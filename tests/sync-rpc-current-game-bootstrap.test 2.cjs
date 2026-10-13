'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const rpc=fs.readFileSync(path.join(root,'supabase_sync_rpc_draft.sql'),'utf8');
const alignment=fs.readFileSync(path.join(root,'supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('RPC draft and schema alignment never auto-promote legacy games',()=>{
 for(const [name,sql] of [['RPC',rpc],['alignment',alignment]]){
  assert.match(sql,/ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false/i,name);
  assert.doesNotMatch(sql,/ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true/i,name);
 }
});
test('new cloud game is explicitly current at first bootstrap',()=>{
 assert.match(rpc,/INSERT INTO public\.mahjong_game_states\s*\(owner_id,game_data,revision,writer_session_id,is_current\)\s*VALUES\(v_uid,p_local_game,0,v_session\.id,true\)/i);
});
test('current game bootstrap remains protected by preflight and fail-closed guard',()=>{
 assert.match(rpc,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/i);
 assert.match(rpc,/IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN[\s\S]*?RETURN jsonb_build_object\('ok',false,'reason','cloud-revision-changed'\)/i);
 assert.match(rpc,/IF NOT FOUND AND p_local_game IS NULL THEN[\s\S]*?RETURN jsonb_build_object\('ok',false,'reason','no-cloud-game'\)/i);
});

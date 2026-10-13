'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=(name)=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
const foundation=read('supabase_latest.sql');
const draft=read('supabase_sync_rpc_draft.sql');
const preflight=read('supabase_sync_preflight_readonly.sql');
test('foundation has single-active-device index incompatible with multi-device reader leases',()=>{
 assert.match(foundation,/CREATE UNIQUE INDEX IF NOT EXISTS mahjong_one_active_device_per_user[\s\S]*?WHERE is_active\s*;/i);
 assert.match(draft,/mahjong_sync_open_reader\(p_device_id uuid\)/);
});
test('draft depends on lease columns absent from foundation migration',()=>{
 for(const column of ['is_writer','session_token_hash','revoked_at']){
  assert.doesNotMatch(foundation,new RegExp('\\b'+column+'\\b','i'));
  assert.match(draft,new RegExp('\\b'+column+'\\b','i'));
 }
});
test('read-only preflight must be extended to detect blocking unique index and required partial index',()=>{
 assert.match(preflight,/mahjong_device_sessions/);
 assert.match(preflight,/pg_indexes/i);
 assert.match(preflight,/blocking_single_active_index_present/i);
 assert.match(preflight,/current_game_unique_index_present/i);
 assert.doesNotMatch(foundation,/mahjong_game_states_one_current_per_owner_idx/i);
});

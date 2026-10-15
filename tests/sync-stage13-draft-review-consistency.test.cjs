'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const draft=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const review=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_review.sql'),'utf8');
test('draft and obsolete review both refuse execution before transaction or DDL',()=>{
 for(const sql of [draft,review]){
  const guard=sql.indexOf('DO $$ BEGIN RAISE EXCEPTION');
  const transaction=sql.indexOf('\nBEGIN;');
  assert.ok(guard>=0 && transaction>guard);
  assert.match(sql.slice(guard,transaction),/DO NOT DEPLOY|do not deploy/i);
 }
});
test('review open contract is incompatible with protected four-argument draft',()=>{
 assert.match(review,/mahjong_sync_open\(p_device_id uuid,p_local_game jsonb\)/);
 assert.match(draft,/mahjong_sync_open\(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL\)/);
});
test('draft retains high-water auth session and expected cloud identity checks',()=>{
 assert.match(draft,/auth_session_created_at/);
 assert.match(draft,/p_expected_game_id/);
 assert.match(draft,/p_expected_revision/);
 assert.match(draft,/Newer login session exists/);
});

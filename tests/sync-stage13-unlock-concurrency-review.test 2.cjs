const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase_sync_admin_unlock_draft.sql','utf8');
test('admin unlock refuses target admin and self unlock',()=>{
 assert.match(sql,/v_admin=p_scorekeeper_id/);
});
test('unlock serializes target writer binding before checking and revoking',()=>{
 const lock=sql.indexOf('FROM auth.users WHERE id=p_scorekeeper_id FOR UPDATE');
 const check=sql.indexOf('IF NOT EXISTS (SELECT 1 FROM public.mahjong_device_sessions');
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions');
 assert.ok(lock>=0 && lock<check && check<revoke);
});
test('unlock is fail-closed for ambiguous writer binding and does not delete game state',()=>{
 assert.match(sql,/ever_writer AND device_id<>p_expected_device_id/);
 assert.doesNotMatch(sql,/\b(?:DELETE FROM|TRUNCATE|UPDATE)\s+public\.mahjong_game_states\b/i);
});
test('unlock SQL cannot run accidentally and lacks execute grants',()=>{
 assert.match(sql,/RAISE EXCEPTION 'UNSAFE DRAFT/);
 assert.match(sql,/^ROLLBACK;/m);
 assert.doesNotMatch(sql,/^GRANT\s+EXECUTE/gmi);
});

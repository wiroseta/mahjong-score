const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const unlock=fs.readFileSync('supabase_sync_admin_unlock_draft.sql','utf8');
const rpc=fs.readFileSync('supabase_sync_rpc_draft.sql','utf8');
test('unlock and writer-open serialize on the same account row',()=>{
 assert.match(unlock,/FROM auth\.users WHERE id=p_scorekeeper_id FOR UPDATE/);
 assert.match(rpc,/FROM auth\.users WHERE id=v_uid FOR UPDATE/);
});
test('unlock preserves auth login high-water checked by open and commit',()=>{
 const update=unlock.split('UPDATE public.mahjong_device_sessions')[1].split('INSERT INTO public.mahjong_device_unlock_audit')[0];
 assert.doesNotMatch(update,/auth_session_(?:id|created_at)\s*=/);
 assert.match(rpc,/prior\.auth_session_created_at,prior\.auth_session_id/);
 assert.match(rpc,/A newer login previously took ownership/g);
});
test('revoked writer cannot commit without active writer, valid token, generation and auth session',()=>{
 for(const clause of ['NOT v_session.is_active','NOT v_session.is_writer','v_session.revoked_at IS NOT NULL','v_session.session_token_hash IS DISTINCT FROM','v_session.session_generation<>p_generation','v_session.auth_session_id IS DISTINCT FROM v_auth_session']) assert.ok(rpc.includes(clause),clause);
 for(const clause of ['is_active=false','is_writer=false','session_token_hash=NULL','revoked_at=now()','session_generation=session_generation+1']) assert.ok(unlock.includes(clause),clause);
});
test('admin unlock has no production grant and cannot modify game data',()=>{
 assert.match(unlock,/RAISE EXCEPTION 'UNSAFE DRAFT/);
 assert.match(unlock,/REVOKE ALL ON FUNCTION public\.mahjong_sync_admin_unlock_device/);
 assert.doesNotMatch(unlock,/^GRANT\s+EXECUTE/gmi);
 assert.doesNotMatch(unlock,/\b(?:UPDATE|DELETE|TRUNCATE)\s+(?:FROM\s+)?public\.mahjong_game_states\b/i);
 assert.match(unlock,/^ROLLBACK;/m);
});

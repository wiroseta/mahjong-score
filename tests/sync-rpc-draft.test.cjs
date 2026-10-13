const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
test('server RPC has explicit account lock and revision lock',()=>{
 assert.match(sql,/FROM auth\.users WHERE id=v_uid FOR UPDATE/);
 assert.match(sql,/WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE/);
 assert.match(sql,/v_game\.revision<>p_base_revision/);
 assert.match(sql,/v_session\.session_generation<>p_generation/);
});
test('server RPC does not overwrite cloud on rejected commit',()=>{
 const conflict=sql.indexOf('IF v_reason IS NOT NULL THEN');const update=sql.indexOf('UPDATE public.mahjong_game_states\n   SET game_data=');
 assert.ok(conflict>0&&update>conflict);
 assert.match(sql,/INSERT INTO public\.mahjong_sync_conflicts/);
});
test('server functions are auth-bound and no service role credentials in browser',()=>{
 assert.match(sql,/v_uid uuid := auth\.uid\(\)/g);
 assert.match(sql,/REVOKE ALL ON FUNCTION public\.mahjong_sync_open/);
 assert.match(sql,/GRANT EXECUTE ON FUNCTION public\.mahjong_sync_commit/);
 assert.doesNotMatch(sql,/DROP TABLE|TRUNCATE|DELETE FROM/i);
});

test('cloud adoption is guarded by expected revision before writer revocation',()=>{
 const guard=sql.indexOf("'cloud-revision-changed'");
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert.ok(guard>0 && revoke>guard);
 assert.match(sql,/p_expected_revision IS DISTINCT FROM v_game.revision/);
});

test('supplied preflight game identity is checked for both local and cloud adoption before revoking writer',()=>{
 const guard=sql.indexOf('IF FOUND AND p_expected_game_id IS NOT NULL AND');
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert.ok(guard>0 && guard<revoke);
 assert.match(sql,/v_game\.id IS DISTINCT FROM p_expected_game_id/);
 assert.match(sql,/v_game\.revision IS DISTINCT FROM p_expected_revision/);
 assert.match(sql,/Both expected game ID and revision are required together/);
});

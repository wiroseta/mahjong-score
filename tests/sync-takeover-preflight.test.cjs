const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
test('server checks cloud mismatch before revoking previous writer',()=>{
 const check=sql.indexOf("IF FOUND AND p_local_game IS NOT NULL AND v_game.game_data IS DISTINCT FROM p_local_game THEN");
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert.ok(check>0&&revoke>check,'preflight must precede lease revocation');
 assert.match(sql.slice(check,revoke),/RETURN jsonb_build_object\('ok',false,'reason','local-cloud-mismatch'/);
});
test('unsafe draft remains blocked from production deployment',()=>{
 assert.match(sql.slice(0,600),/RAISE EXCEPTION 'UNSAFE DRAFT/);
});

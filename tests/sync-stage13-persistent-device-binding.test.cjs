const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
test('single-device beta binds to registered device even after logout',()=>{
 const block=sql.slice(sql.indexOf('-- BETA DEVICE BINDING:'),sql.indexOf('-- Safety preflight:'));
 assert.match(block,/v_role='scorekeeper' AND NOT v_multi/);
 assert.match(block,/prior\.user_id=v_uid AND prior\.ever_writer AND prior\.device_id IS DISTINCT FROM p_device_id/);
 assert.doesNotMatch(block,/prior\.is_active|prior\.is_writer/);
 assert.match(block,/device-bound-to-other-device/);
});
test('device binding occurs under account lock before cloud state mutation',()=>{
 const owner=sql.indexOf('FROM auth.users WHERE id=v_uid FOR UPDATE');
 const binding=sql.indexOf('-- BETA DEVICE BINDING:');
 const game=sql.indexOf('SELECT * INTO v_game FROM public.mahjong_game_states',binding);
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false',binding);
 assert(owner>=0&&binding>owner&&game>binding&&revoke>binding);
});
test('new beta guard is not deployable or active in browser',()=>{
 assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/);
 assert.match(fs.readFileSync('index.html','utf8'),/const MAHJONG_CLOUD_SYNC_ENABLED=true;/);
});

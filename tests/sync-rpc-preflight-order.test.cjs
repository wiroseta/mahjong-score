const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
const open=sql.slice(sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_open('),sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit('));

test('open checks cloud identity and revision before returning local mismatch snapshot',()=>{
 const rev=open.indexOf('IF FOUND AND p_expected_game_id IS NOT NULL AND');
 const mismatch=open.indexOf('IF FOUND AND p_local_game IS NOT NULL AND');
 assert.ok(rev>=0&&mismatch>rev);
});
test('stale revision response contains metadata but no cloud game snapshot',()=>{
 const rev=open.indexOf('IF FOUND AND p_expected_game_id IS NOT NULL AND');
 const mismatch=open.indexOf('IF FOUND AND p_local_game IS NOT NULL AND');
 const block=open.slice(rev,mismatch);
 assert.match(block,/reason','cloud-revision-changed'/);
 assert.doesNotMatch(block,/'game',v_game\.game_data/);
});
test('all preflight rejection checks remain before writer lease revocation',()=>{
 const mismatch=open.indexOf('IF FOUND AND p_local_game IS NOT NULL AND');
 const missing=open.indexOf('IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN');
 const revoke=open.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert.ok(mismatch>0&&missing>mismatch&&revoke>missing);
 assert.match(sql.slice(0,500),/UNSAFE DRAFT/);
});

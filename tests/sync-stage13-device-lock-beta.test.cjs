const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
test('beta rejects another writer device under owner lock before lease revocation',()=>{
 const owner=sql.indexOf('FROM auth.users WHERE id=v_uid FOR UPDATE');
 const lock=sql.indexOf("'device-locked'");
 const revoke=sql.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert(owner>=0&&lock>owner&&revoke>lock);
 assert.match(sql.slice(owner,lock),/v_role='scorekeeper' AND NOT v_multi AND EXISTS/);
 assert.match(sql.slice(owner,lock),/prior\.is_active AND prior\.is_writer/);
 assert.match(sql.slice(owner,lock),/prior\.device_id IS DISTINCT FROM p_device_id/);
});
test('Stage280 browser cloud sync enabled by release approval',()=>{
 assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/);
 const html=fs.readFileSync('index.html','utf8');
 assert.match(html,/const MAHJONG_CLOUD_SYNC_ENABLED=true;/);
});

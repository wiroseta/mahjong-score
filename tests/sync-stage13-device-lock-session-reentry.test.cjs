const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
const open=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[0];
test('single device beta must not block same device after logout and fresh login',()=>{
 assert.match(open,/prior\.device_id IS DISTINCT FROM p_device_id/);
 const active=open.split('-- BETA SINGLE-DEVICE LOCK:')[1].split('-- BETA DEVICE BINDING:')[0];
 assert.doesNotMatch(active,/prior\.auth_session_id IS DISTINCT FROM v_auth_session/);
});

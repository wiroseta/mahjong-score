const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const start=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_read(');
const end=sql.indexOf('REVOKE ALL ON FUNCTION public.mahjong_sync_read',start);
const fn=sql.slice(start,end);
test('read RPC is restricted to the exact active auth session and device',()=>{
 assert.ok(start>0 && end>start);
 assert.match(fn,/auth\.jwt\(\)->>'session_id'/);
 assert.match(fn,/auth_session_id=v_auth_session/);
 assert.match(fn,/device_id=p_device_id AND is_active=true/);
 assert.match(fn,/revoked_at IS NULL/);
});
test('read RPC rejects inactive and superseded scorekeeper accounts',()=>{
 assert.match(fn,/banned_until IS NULL OR banned_until<=now\(\)/);
 assert.match(fn,/Newer login session exists/);
 assert.match(fn,/raw_app_meta_data->>'role' IN \('admin','scorekeeper'\)/);
});
test('read RPC never grants a writer lease or mutates cloud state',()=>{
 assert.doesNotMatch(fn,/\b(?:UPDATE|INSERT|DELETE)\b/);
 assert.match(fn,/v_lease\.is_writer\s+AND v_lease\.session_token_hash IS NOT NULL\s+AND v_lease\.session_generation>0\s+AND v_game\.writer_session_id=v_lease\.id/);
 assert.match(sql,/GRANT EXECUTE ON FUNCTION public\.mahjong_sync_read\(uuid\) TO authenticated/);
});

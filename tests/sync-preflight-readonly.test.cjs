const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../tests/fixtures/legacy/supabase_sync_preflight_readonly.sql'),'utf8');
test('preflight is read-only and never runs DDL or writes',()=>{
 const statements=sql.replace(/--[^\n]*/g,'').replace(/'(?:''|[^'])*'/g,"''").toUpperCase();
 assert.doesNotMatch(statements,/\b(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|TRUNCATE|GRANT|REVOKE|DO|CALL)\b/);
 assert.match(statements,/^\s*WITH\s/);
});
test('preflight checks all four tables, RLS, privileges, and required columns',()=>{
 for(const x of ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit','relrowsecurity','has_table_privilege','auth_session_id','is_writer','session_token_hash','revoked_at','is_current'])assert.ok(sql.includes(x),x);
});

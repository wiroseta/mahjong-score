'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname,'..','supabase_sync_preflight_readonly.sql'),'utf8');
const rpc = ['mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_peek','mahjong_sync_read','mahjong_sync_lease_status'];
test('read-only inventory lists exactly six sync RPC names', () => {
 const block = sql.split('required_rpc(name,args) AS (')[1].split('), rpc_checks AS (')[0];
 for (const name of rpc) assert.match(block,new RegExp("'"+name+"'"));
 assert.equal((block.match(/\('/g)||[]).length,6);
});
test('RPC inventory checks effective anon and authenticated EXECUTE rights', () => {
 assert.match(sql,/has_function_privilege\('anon',p\.oid,'EXECUTE'\)/);
 assert.match(sql,/has_function_privilege\('authenticated',p\.oid,'EXECUTE'\)/);
});
test('RPC inventory records security definer status without writing', () => {
 assert.match(sql,/p\.prosecdef/);
 assert.match(sql,/rpc_inventory/);
 const body=sql.replace(/--[^\n]*/g,'').replace(/'(?:''|[^'])*'/g,"''");
 assert.doesNotMatch(body,/\b(?:INSERT|UPDATE|DELETE|TRUNCATE|ALTER|DROP|CREATE|GRANT|REVOKE|CALL|DO|COPY|VACUUM)\b/i);
});

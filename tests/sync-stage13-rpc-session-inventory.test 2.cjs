'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '../supabase_sync_preflight_readonly.sql'), 'utf8');
test('RPC inventory includes all six sync entry points', () => {
 for (const name of ['open','commit','open_reader','peek','read','lease_status']) assert.match(sql, new RegExp("\\('mahjong_sync_"+name+"'"));
});
test('RPC inventory reports anonymous and authenticated execute privileges', () => {
 assert.match(sql, /has_function_privilege\('anon',p\.oid,'EXECUTE'\)/);
 assert.match(sql, /has_function_privilege\('authenticated',p\.oid,'EXECUTE'\)/);
});
test('RPC inventory identifies SECURITY DEFINER status and exact signatures', () => {
 assert.match(sql, /COALESCE\(p\.prosecdef,false\) AS security_definer/);
 assert.match(sql, /to_regprocedure\('public\.'\|\|r\.name\|\|'\('\|\|r\.args\|\|'\)'\)/);
});

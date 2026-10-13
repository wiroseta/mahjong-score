'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_preflight_readonly.sql'),'utf8');
test('read-only preflight checks blocking single-device index without modifying schema',()=>{
 assert.match(sql,/pg_indexes/i);
 assert.match(sql,/blocking_single_active_index_present/);
 assert.doesNotMatch(sql,/\b(?:CREATE|DROP|ALTER|TRUNCATE|INSERT|UPDATE|DELETE)\s+(?:TABLE|INDEX|INTO|public\.)/i);
});
test('preflight checks required current-game uniqueness and session lookup indexes',()=>{
 assert.match(sql,/current_game_unique_index_present/);
 assert.match(sql,/session_lookup_index_present/);
 assert.match(sql,/indexdef ILIKE '%UNIQUE%'/);
});
test('preflight returns index results with existing table column function and RPC diagnostics',()=>{
 for(const key of ["'indexes'","'tables'","'columns'","'functions'","'rpc_already_installed'"])assert.ok(sql.includes(key),key);
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','tests/fixtures/legacy/supabase_sync_stage14_access_preflight_readonly.sql'),'utf8');
test('Stage14 read-only preflight exposes both missing transfer columns',()=>{
 for(const col of ['auth_session_created_at','ever_writer']) assert.match(sql,new RegExp("'"+col+"'"));
});
test('Stage14 preflight reports existing is_current default for alignment',()=>{
 assert.match(sql,/\('mahjong_game_states','is_current'\)/);
 assert.match(sql,/column_default/);
});
test('Stage14 schema inventory retains absent columns through left join',()=>{
 assert.match(sql,/LEFT JOIN column_inventory i/);
 assert.match(sql,/i\.column_name IS NOT NULL/);
});

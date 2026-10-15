'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','tests/fixtures/legacy/supabase_sync_stage14_access_preflight_readonly.sql'),'utf8');
test('Stage14 preflight examines all four sync foundation tables',()=>{
 for(const name of ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit']) assert.ok(sql.includes("'"+name+"'"));
});
test('Stage14 preflight checks direct DML privileges for both API roles',()=>{
 for(const role of ['anon','authenticated']) for(const action of ['SELECT','INSERT','UPDATE','DELETE']) assert.ok(sql.includes(`has_table_privilege('${role}',t.oid,'${action}')`));
});
test('Stage14 preflight audits policies, indexes and RPC execute grants without mutations',()=>{
 for(const token of ['pg_policies','pg_indexes','pg_proc','has_function_privilege']) assert.ok(sql.includes(token));
 assert.doesNotMatch(sql,/\b(?:INSERT\s+INTO|UPDATE\s+public\.|DELETE\s+FROM|ALTER\s+TABLE|CREATE\s+(?:TABLE|FUNCTION)|DROP\s+)\b/i);
});

test('Stage14 preflight explicitly reports missing foundation tables rather than silently omitting them',()=>{
 for(const token of ['expected_tables(name)','TABLE_PRESENCE','LEFT JOIN target_tables','installed']) assert.ok(sql.includes(token));
});

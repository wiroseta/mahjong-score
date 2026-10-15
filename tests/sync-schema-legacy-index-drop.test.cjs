'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../tests/fixtures/legacy/supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('legacy index drop is preceded by strict catalog shape verification',()=>{
 const check=sql.indexOf('Legacy active-device index definition mismatch');
 const drop=sql.indexOf('DROP INDEX IF EXISTS public.mahjong_one_active_device_per_user');
 assert.ok(check>0&&drop>check);
 assert.match(sql,/idx\.relname='mahjong_one_active_device_per_user'/);
 assert.match(sql,/tbl\.relname='mahjong_device_sessions'/);
});
test('legacy index must be unique and scoped to active user sessions',()=>{
 assert.match(sql,/i\.indisunique AND i\.indisvalid AND i\.indisready AND i\.indnkeyatts=1/);
 assert.match(sql,/col\.attname='user_id'/);
 assert.match(sql,/pg_catalog\.pg_get_expr\(i\.indpred,i\.indrelid\) IN \('is_active','\(is_active = true\)'\)/);
});
test('legacy index drop protection remains fail-closed and atomic',()=>{
 assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE/);
 assert.ok(sql.indexOf('UNSAFE SCHEMA ALIGNMENT CANDIDATE')<sql.indexOf('BEGIN;'));
 assert.ok(sql.indexOf('DROP INDEX IF EXISTS public.mahjong_one_active_device_per_user')<sql.lastIndexOf('COMMIT;'));
});

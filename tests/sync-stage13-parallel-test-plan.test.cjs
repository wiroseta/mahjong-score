'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const draft=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const plan=fs.readFileSync(path.join(root,'tests/fixtures/legacy/STAGE13_PARALLEL_PG_TEST_PLAN.md'),'utf8');
test('parallel PostgreSQL test plan explicitly forbids production and requires disposable database',()=>{
 assert.match(plan,/disposable/i);assert.match(plan,/DO NOT DEPLOY/);assert.match(plan,/jangan.*produksi/i);
});
test('parallel plan covers competing commits and stale revision rejection',()=>{
 assert.match(plan,/dua koneksi/i);assert.match(plan,/stale revision/i);assert.match(plan,/satu.*berhasil/i);
});
test('parallel plan covers displaced session and rollback without relying on static tests',()=>{
 assert.match(plan,/perangkat lama/i);assert.match(plan,/ROLLBACK/);assert.match(plan,/belum.*dijalankan/i);
});

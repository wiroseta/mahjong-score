const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_schema_alignment_candidate.sql'),'utf8');
const audit=sql.slice(sql.indexOf('-- IF NOT EXISTS only checks an index name'));
test('current-game index audit checks index namespace independently from table namespace',()=>{
 assert.match(audit,/JOIN pg_catalog\.pg_namespace idx_ns ON idx_ns\.oid=idx\.relnamespace/);
 assert.match(audit,/ns\.nspname='public' AND idx_ns\.nspname='public'/);
});
test('current-game index audit still requires unique valid ready owner-key partial index',()=>{
 assert.match(audit,/i\.indisunique AND i\.indisvalid AND i\.indisready/);
 assert.match(audit,/i\.indnkeyatts=1 AND col\.attname='owner_id'/);
 assert.match(audit,/pg_catalog\.pg_get_expr\(i\.indpred,i\.indrelid\) IN/);
});
test('schema candidate retains unconditional non-deploy guard',()=>{
 assert.match(sql.slice(0,400),/RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE/);
});

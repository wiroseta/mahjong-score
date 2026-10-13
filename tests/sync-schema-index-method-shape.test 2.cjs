const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase_sync_schema_alignment_candidate.sql','utf8');
test('both guarded index checks validate btree access method',()=>assert.equal((sql.match(/am\.amname='btree'/g)||[]).length,2));
test('both guarded index checks reject expression and INCLUDE indexes',()=>{assert.equal((sql.match(/i\.indexprs IS NULL/g)||[]).length,2);assert.equal((sql.match(/i\.indnatts=1/g)||[]).length,2)});
test('unconditional non-deploy guard remains first SQL statement',()=>assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE — DO NOT EXECUTE'; END \$\$;\s*BEGIN;/));

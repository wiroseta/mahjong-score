'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('index name reuse cannot bypass unique index definition verification',()=>{
 assert.match(sql,/pg_catalog\.pg_index/i);
 assert.match(sql,/i\.indisunique AND i\.indisvalid AND i\.indisready/i);
 assert.match(sql,/i\.indnkeyatts=1 AND col\.attname='owner_id'/i);
});
test('current game index predicate is checked, not just its name',()=>{
 assert.match(sql,/pg_catalog\.pg_get_expr\(i\.indpred,i\.indrelid\)/);
 assert.match(sql,/Current-game index definition mismatch; manual review required/);
 assert.ok(sql.indexOf('CREATE UNIQUE INDEX IF NOT EXISTS mahjong_game_states_one_current_per_owner_idx')<sql.indexOf('Current-game index definition mismatch'));
});
test('index definition check remains inside guarded atomic migration',()=>{
 assert.match(sql,/^DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE/m);
 assert.ok(sql.indexOf('RAISE EXCEPTION \'UNSAFE SCHEMA')<sql.indexOf('BEGIN;'));
 assert.ok(sql.indexOf('Current-game index definition mismatch')<sql.lastIndexOf('COMMIT;'));
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','tests/fixtures/legacy/supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('alignment candidate remains unconditionally blocked before any DDL',()=>{
 assert.match(sql,/\nDO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE/i);
 assert.ok(sql.indexOf('RAISE EXCEPTION')<sql.indexOf('BEGIN;'));
});
test('candidate adds required writer and Auth binding columns without clearing existing sessions',()=>{
 for(const col of ['auth_session_id','auth_session_created_at','is_writer','session_token_hash','revoked_at'])
  assert.match(sql,new RegExp('ADD COLUMN IF NOT EXISTS '+col+'\\b','i'));
 assert.doesNotMatch(sql,/\b(?:TRUNCATE|DELETE FROM|UPDATE public\.mahjong_device_sessions)\b/i);
 assert.match(sql,/DROP INDEX IF EXISTS public\.mahjong_one_active_device_per_user/i);
});
test('candidate prevents accidental current-game promotion and checks duplicates before index',()=>{
 assert.match(sql,/WHERE is_current=true\s+GROUP BY owner_id HAVING count\(\*\) > 1/i);
 assert.match(sql,/ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false/i);
 assert.match(sql,/CREATE UNIQUE INDEX IF NOT EXISTS mahjong_game_states_one_current_per_owner_idx/i);
 assert.ok(sql.indexOf('ADD COLUMN IF NOT EXISTS is_current')<sql.indexOf('WHERE is_current=true'));
 assert.ok(sql.indexOf('HAVING count(*) > 1')<sql.indexOf('CREATE UNIQUE INDEX'));
 assert.doesNotMatch(sql,/\b(?:DROP TABLE|DELETE FROM|TRUNCATE)\b/i);
});

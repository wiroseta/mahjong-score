'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'),'utf8');
test('Stage14 history rejects missing, null and non-array JSON',()=>assert.match(sql,/WHEN jsonb_typeof\(p_game->'history'\) IS DISTINCT FROM 'array' THEN false/));
test('Stage14 history array length checked only after type guard',()=>{const guard=sql.indexOf("WHEN jsonb_typeof(p_game->'history') IS DISTINCT FROM 'array' THEN false");const length=sql.indexOf("WHEN jsonb_array_length(p_game->'history')>20000 THEN false");assert.ok(guard>=0 && length>guard);});
test('Stage14 candidate remains blocked before DDL',()=>assert.ok(sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT")<sql.indexOf('ALTER TABLE')));

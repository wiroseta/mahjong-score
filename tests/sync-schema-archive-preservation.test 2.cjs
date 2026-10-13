'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('historical multi-game owners are not rejected merely for having archives',()=>{
 assert.doesNotMatch(sql,/FROM public\.mahjong_game_states\s+GROUP BY owner_id HAVING count\(\*\) > 1/i);
 assert.match(sql,/WHERE is_current=true\s+GROUP BY owner_id HAVING count\(\*\) > 1/i);
});
test('current flag exists before current-only duplicate check and is not auto-promoted',()=>{
 const add=sql.indexOf('ADD COLUMN IF NOT EXISTS is_current');
 const check=sql.indexOf('WHERE is_current=true');
 assert.ok(add>=0&&check>add);
 assert.match(sql,/is_current boolean NOT NULL DEFAULT false/i);
 assert.doesNotMatch(sql,/UPDATE public\.mahjong_game_states SET is_current=true/i);
});
test('archive-friendly candidate remains blocked and non-destructive',()=>{
 assert.ok(sql.indexOf('UNSAFE SCHEMA ALIGNMENT CANDIDATE')<sql.indexOf('BEGIN;'));
 assert.doesNotMatch(sql,/\b(?:DELETE FROM public\.mahjong_game_states|TRUNCATE public\.mahjong_game_states|DROP TABLE public\.mahjong_game_states)\b/i);
});

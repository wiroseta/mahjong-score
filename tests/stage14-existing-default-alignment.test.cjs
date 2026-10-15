'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','tests/fixtures/legacy/supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'),'utf8');
test('Stage14 existing is_current default explicitly set false',()=>{
 assert.match(sql,/ALTER TABLE public\.mahjong_game_states ALTER COLUMN is_current SET DEFAULT false;/);
});
test('Stage14 default alignment does not update historical game rows',()=>{
 const block=sql.slice(sql.indexOf('ALTER TABLE public.mahjong_game_states ADD COLUMN'),sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_valid_game'));
 const statements=block.replace(/--[^\n]*/g,'');
 assert.doesNotMatch(statements,/UPDATE\s+public\.mahjong_game_states/i);
});
test('Stage14 candidate retains fail-closed guard ahead of default migration',()=>{
 assert.ok(sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT")>=0);
 assert.ok(sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT")<sql.indexOf('ALTER COLUMN is_current SET DEFAULT false'));
});

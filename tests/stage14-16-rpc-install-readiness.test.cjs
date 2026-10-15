'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
test('draft migration blocks accidental execution before any DDL',()=>{
 const first=sql.indexOf('DO $$ BEGIN RAISE EXCEPTION');
 assert.ok(first>=0);assert.ok(first<sql.indexOf('ALTER TABLE'));
 assert.match(sql.slice(first,first+150),/UNSAFE DRAFT/);
});
test('all five transfer RPCs declare definer and empty search_path',()=>{
 for(const name of ['open','commit','open_reader','read','lease_status']){
  assert.match(sql,new RegExp('CREATE OR REPLACE FUNCTION public\\.mahjong_sync_'+name+'\\([\\s\\S]*?RETURNS jsonb LANGUAGE plpgsql (?:STABLE )?SECURITY DEFINER SET search_path = \'\''));
 }
});
test('writer open and commit revalidate Auth session after account row lock',()=>{
 const open=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[0];
 const commit=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[0];
 for(const body of [open,commit]){
  const lock=body.indexOf('FOR UPDATE');const check=body.indexOf('not_after',lock);
  assert.ok(lock>=0&&check>lock,'Auth expiry must be rechecked after owner lock');
 }
});
test('Stage280 production gate enabled following browser acceptance',()=>{
 assert.match(html,/const MAHJONG_CLOUD_SYNC_ENABLED=true\s*;/);
 assert.match(sql,/UNSAFE DRAFT: do not deploy/);
});

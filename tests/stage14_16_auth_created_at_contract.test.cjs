'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
for (const file of ['supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql','supabase_sync_rpc_draft.sql']) {
 test(`${file}: all six RPC auth checks fail closed for NULL created_at`,()=>{
  const sql=fs.readFileSync(path.join(root,file),'utf8');
  const functions=['mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_peek','mahjong_sync_read','mahjong_sync_lease_status'];
  for(let i=0;i<functions.length;i++) {
   const start=sql.indexOf(`CREATE OR REPLACE FUNCTION public.${functions[i]}(`);
   assert.ok(start>=0,functions[i]);
   const end=i+1<functions.length?sql.indexOf(`CREATE OR REPLACE FUNCTION public.${functions[i+1]}(`,start+1):sql.length;
   const body=sql.slice(start,end);
   assert.match(body,/created_at IS NOT NULL AND \(not_after IS NULL OR not_after>now\(\)\)/,functions[i]);
  }
  assert.match(sql,/RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy/);
 });
}

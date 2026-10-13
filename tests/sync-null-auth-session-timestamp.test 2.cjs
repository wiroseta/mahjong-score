const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
for (const filename of ['supabase_sync_rpc_draft.sql','supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql']) {
 const sql=fs.readFileSync(path.join(__dirname,'..',filename),'utf8');
 test(`${filename}: reject ambiguous auth sessions with null creation timestamps`,()=>{
  const comparisons=[...sql.matchAll(/newer\.created_at,newer\.id\)\s*>\s*\(current_auth\.created_at,current_auth\.id\)/g)];
  assert.ok(comparisons.length>=4,'expected session-order checks in all RPC paths');
  for(const m of comparisons){
   assert.match(sql.slice(Math.max(0,m.index-65),m.index),/newer\.created_at IS NULL\s+OR\s+\(/,'null timestamp must fail closed');
  }
  assert.match(sql.slice(0,600),/RAISE EXCEPTION 'UNSAFE DRAFT/);
 });
}

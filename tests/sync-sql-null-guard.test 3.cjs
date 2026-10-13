const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_rpc_draft.sql'),'utf8');
test('SQL validator rejects missing and JSON-null required fields explicitly',()=>{
 for(const [field,typ] of [['names','array'],['scores','array'],['history','array'],['dealer','number'],['round','number']]){
  assert.ok(sql.includes(`jsonb_typeof(p_game->'${field}') IS DISTINCT FROM '${typ}'`),field);
 }
});
test('SQL validator rejects top-level SQL NULL and JSON null',()=>{
 assert.match(sql,/jsonb_typeof\(p_game\) IS DISTINCT FROM 'object'/);
});
test('SQL validator stays nondeployable while integration is pending',()=>{
 assert.match(sql,/RAISE EXCEPTION 'UNSAFE DRAFT/);
});

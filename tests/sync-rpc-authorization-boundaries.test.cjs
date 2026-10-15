const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(__dirname+'/../tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
const signatures={mahjong_sync_open:'uuid,jsonb,bigint,uuid',mahjong_sync_commit:'uuid,uuid,bigint,text,bigint,jsonb',mahjong_sync_open_reader:'uuid',mahjong_sync_peek:'',mahjong_sync_read:'uuid',mahjong_sync_lease_status:'uuid,bigint'};
function functionBody(name){const start=sql.indexOf(`CREATE OR REPLACE FUNCTION public.${name}(`);assert.ok(start>=0);const end=sql.indexOf('$$;',start);assert.ok(end>start);return sql.slice(start,end);}
test('all six RPC entrypoints are explicitly authenticated-only, not anon or PUBLIC',()=>{
 for(const [name,args] of Object.entries(signatures)){
  const signature=`public.${name}(${args})`;
  assert.ok(sql.includes(`REVOKE ALL ON FUNCTION ${signature} FROM PUBLIC,anon,authenticated;`),name);
  assert.ok(sql.includes(`GRANT EXECUTE ON FUNCTION ${signature} TO authenticated;`),name);
  assert.doesNotMatch(sql,new RegExp(`GRANT\\s+EXECUTE\\s+ON\\s+FUNCTION\\s+public\\.${name}\\([^;]+?\\)\\s+TO\\s+(?:PUBLIC|anon)\\b`,'i'),name);
 }
});
test('all six RPCs bind identity to verified Supabase Auth session',()=>{
 for(const name of Object.keys(signatures)){
  const body=functionBody(name);
  assert.match(body,/auth\.jwt\(\)->>'session_id'/,name);
  assert.match(body,/auth\.sessions/,name);
  assert.match(body,/user_id\s*=\s*v_uid/,name);
 }
});
test('all six RPCs pin SECURITY DEFINER search path',()=>{
 for(const name of Object.keys(signatures))assert.match(functionBody(name),/SECURITY DEFINER SET search_path = ''/,name);
});

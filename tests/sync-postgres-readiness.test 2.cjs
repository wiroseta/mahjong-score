'use strict';
// Offline gate only. This does NOT constitute PostgreSQL integration testing.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'supabase_sync_rpc_draft.sql'),'utf8');
test('draft fails closed before beginning any schema transaction',()=>{
  const guard=sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT:");
  const begin=sql.indexOf('\nBEGIN;');
  assert.ok(guard>=0 && begin>guard,'missing early fail-closed guard');
});
test('six RPC entrypoints are present exactly once',()=>{
  for(const name of ['open','commit','open_reader','peek','read','lease_status']) {
    const matches=[...sql.matchAll(new RegExp('CREATE OR REPLACE FUNCTION public\\.mahjong_sync_'+name+'\\s*\\(','g'))];
    assert.equal(matches.length,1,name);
  }
});
test('all RPC entrypoints explicitly constrain search_path',()=>{
  for(const match of sql.matchAll(/CREATE OR REPLACE FUNCTION public\.mahjong_sync_(open|commit|open_reader|peek|read|lease_status)\s*\(/g)) {
    const header=sql.slice(match.index,sql.indexOf('AS $$',match.index));
    assert.match(header,/SECURITY DEFINER SET search_path = ''/);
  }
});
test('all six RPCs explicitly revoke anonymous and public execution',()=>{
  const signatures={open:'uuid,jsonb,bigint,uuid',commit:'uuid,uuid,bigint,text,bigint,jsonb',open_reader:'uuid',peek:'',read:'uuid',lease_status:'uuid,bigint'};
  for(const [name,args] of Object.entries(signatures)) {
    const escaped=args.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    assert.match(sql,new RegExp('REVOKE ALL ON FUNCTION public\\.mahjong_sync_'+name+'\\('+escaped+'\\) FROM PUBLIC,anon,authenticated;'),name);
    assert.match(sql,new RegExp('GRANT EXECUTE ON FUNCTION public\\.mahjong_sync_'+name+'\\('+escaped+'\\) TO authenticated;'),name);
  }
});
test('writer open and commit serialize on locked account row',()=>{
  for(const name of ['open','commit']) {
    const start=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_'+name+'(');
    const end=sql.indexOf('END; $$;',start);
    assert.ok(start>=0 && end>start,name);
    const body=sql.slice(start,end);
    assert.match(body,/FROM auth\.users WHERE id=v_uid FOR UPDATE|FROM auth\.users\s+WHERE id=v_uid[\s\S]*?FOR UPDATE/,name);
  }
});

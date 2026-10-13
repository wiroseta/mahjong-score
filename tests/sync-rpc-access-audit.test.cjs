const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(__dirname+'/../supabase_sync_rpc_draft.sql','utf8');
const rpc={
 mahjong_sync_open:'uuid,jsonb,bigint,uuid',
 mahjong_sync_commit:'uuid,uuid,bigint,text,bigint,jsonb',
 mahjong_sync_open_reader:'uuid',
 mahjong_sync_peek:'',
 mahjong_sync_read:'uuid',
 mahjong_sync_lease_status:'uuid,bigint'
};
for(const [name,args] of Object.entries(rpc)){
 test(`${name}: restricted SECURITY DEFINER and authenticated-only EXECUTE`,()=>{
  const fn=sql.indexOf(`CREATE OR REPLACE FUNCTION public.${name}(`);
  assert.ok(fn>=0,`missing ${name}`);
  const body=sql.slice(fn,sql.indexOf('$$;',fn)+3);
  assert.match(body,/SECURITY DEFINER SET search_path = ''/);
  assert.match(body,/auth\.uid\(\)/);
  assert.match(body,/auth\.sessions/);
  assert.ok(sql.includes(`REVOKE ALL ON FUNCTION public.${name}(${args}) FROM PUBLIC,anon,authenticated;`));
  assert.ok(sql.includes(`GRANT EXECUTE ON FUNCTION public.${name}(${args}) TO authenticated;`));
 });
}
test('draft stays blocked from production execution',()=>assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/));

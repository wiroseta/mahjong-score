const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname,'..','tests/fixtures/legacy/supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'),'utf8');
const functions = [
 ['mahjong_sync_open','uuid,jsonb,bigint,uuid'],
 ['mahjong_sync_commit','uuid,uuid,bigint,text,bigint,jsonb'],
 ['mahjong_sync_open_reader','uuid'],
 ['mahjong_sync_read','uuid'],
 ['mahjong_sync_lease_status','uuid,bigint']
];
test('install candidate remains fail-closed until live PostgreSQL verification',()=>{
 assert.match(sql,/^DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT:/m);
});
for(const [fn,signature] of functions){
 test(`${fn}: invoker cannot use anonymous role`,()=>{
  assert.ok(sql.includes(`REVOKE ALL ON FUNCTION public.${fn}(${signature}) FROM PUBLIC,anon,authenticated;`));
  assert.ok(sql.includes(`GRANT EXECUTE ON FUNCTION public.${fn}(${signature}) TO authenticated;`));
 });
 test(`${fn}: security definer has empty search path`,()=>{
  const pos=sql.indexOf(`CREATE OR REPLACE FUNCTION public.${fn}(`);
  assert.ok(pos>=0);
  const body=sql.slice(pos,sql.indexOf('AS $$',pos)+5);
  assert.match(body,/SECURITY DEFINER SET search_path = ''/);
 });
}
test('open mismatch does not return cloud snapshot',()=>{
 const match=sql.match(/IF FOUND AND p_local_game IS NOT NULL AND v_game\.game_data IS DISTINCT FROM p_local_game THEN([\s\S]*?)END IF;/);
 assert.ok(match);
 assert.doesNotMatch(match[1],/v_game\.game_data|'game'\s*,/);
});

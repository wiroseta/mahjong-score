'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const sql = fs.readFileSync(path.join(root, 'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'), 'utf8');
const adapter = fs.readFileSync(path.join(root, 'js', 'sync-supabase-adapter.js'), 'utf8');
const rpc = [
 ['mahjong_sync_peek', [], []],
 ['mahjong_sync_lease_status', ['p_device_id','p_generation'], ['uuid','bigint']],
 ['mahjong_sync_open_reader', ['p_device_id'], ['uuid']],
 ['mahjong_sync_read', ['p_device_id'], ['uuid']],
 ['mahjong_sync_open', ['p_device_id','p_local_game','p_expected_revision','p_expected_game_id'], ['uuid','jsonb','bigint','uuid']],
 ['mahjong_sync_commit', ['p_game_id','p_device_id','p_generation','p_token','p_base_revision','p_game'], ['uuid','uuid','bigint','text','bigint','jsonb']]
];
test('all six client RPC names and SQL function parameter names agree', () => {
 for(const [name, params] of rpc){
  assert.ok(adapter.includes(`'${name}'`), `adapter missing ${name}`);
  const start=sql.indexOf(`CREATE OR REPLACE FUNCTION public.${name}(`);
  assert.ok(start>=0, `draft missing ${name}`);
  const end=sql.indexOf(')',start);
  const signature=sql.slice(start,end);
  const actual=[...signature.matchAll(/\b(p_[a-z_]+)\s+(?:uuid|jsonb|bigint|text)\b/g)].map(m=>m[1]);
  assert.deepEqual(actual,params,`${name} parameters drifted`);
 }
});
test('all six RPC signatures grant execute only to authenticated in draft', () => {
 for(const [name,,types] of rpc){
  const sig=`public.${name}(${types.join(',')})`;
  assert.ok(sql.includes(`REVOKE ALL ON FUNCTION ${sig} FROM PUBLIC,anon,authenticated;`),`missing revoke ${sig}`);
  assert.ok(sql.includes(`GRANT EXECUTE ON FUNCTION ${sig} TO authenticated;`),`missing authenticated grant ${sig}`);
  assert.ok(!sql.includes(`GRANT EXECUTE ON FUNCTION ${sig} TO anon;`),`anon grant ${sig}`);
 }
});
test('unverified four-parameter RPC draft remains fail-closed before SQL transaction', () => {
 const stop=sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy");
 const begin=sql.indexOf('\nBEGIN;');
 assert.ok(stop>=0 && begin>stop,'draft must raise before BEGIN');
 assert.match(sql,/IF v_role IS NULL OR v_role NOT IN/);
 assert.match(sql,/Both expected game ID and revision are required together/);
});

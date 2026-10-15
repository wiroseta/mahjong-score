const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(__dirname+'/../tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
test('staged server validator checks the recorded-hand fields checked by JS',()=>{
 for(const key of ['delta','before','quads','winner','dealer','discarder','method','patterns','namesAtTime','seatWindsBefore'])
  assert.ok(sql.includes(`x ? '${key}'`),`SQL missing history validation for ${key}`);
});

test('SQL rejects duplicate historical seat winds',()=>{assert.match(sql,/count\(DISTINCT n\).*seatWindsBefore/);});

test('SQL historical player names have same 100-character ceiling as current names',()=>{
 assert.match(sql,/namesAtTime.*CASE WHEN jsonb_typeof\(x->'namesAtTime'\) = 'array' THEN jsonb_array_length\(x->'namesAtTime'\)/s);
 assert.match(sql,/jsonb_array_elements\(CASE WHEN jsonb_typeof\(x->'namesAtTime'\) = 'array' THEN x->'namesAtTime' ELSE '\[\]'::jsonb END\) n WHERE jsonb_typeof\(n\) IS DISTINCT FROM 'string' OR length\(n #>> '\{\}'\)>100/);
});

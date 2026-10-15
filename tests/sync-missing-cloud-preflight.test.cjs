const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
test('a vanished cloud game never silently bootstraps a new game after preflight',()=>{
 const start=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_open(');
 const end=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(',start);
 const body=sql.slice(start,end);
 const guard=body.indexOf('IF NOT FOUND AND p_expected_game_id IS NOT NULL THEN');
 const insert=body.indexOf('INSERT INTO public.mahjong_game_states(');
 assert.ok(guard>0&&insert>guard,'must reject stale preflight before inserting new cloud game');
 assert.match(body.slice(guard,insert),/reason','cloud-revision-changed'/);
});

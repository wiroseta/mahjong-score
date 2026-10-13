const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
test('server checks optional roundWind is a wind integer',()=>{
 assert.match(sql,/p_game \? 'roundWind'/);
 assert.match(sql,/p_game->>'roundWind'\) !~ '\^\[0-3\]\$'/);
});
test('server checks optional seatWinds contains four distinct wind integers',()=>{
 assert.match(sql,/CASE WHEN jsonb_typeof\(p_game->'seatWinds'\) = 'array' THEN jsonb_array_length\(p_game->'seatWinds'\) ELSE NULL END\)<>4/);
 assert.match(sql,/count\(DISTINCT x\)/);
 assert.match(sql,/x::text !~ '\^\[0-3\]\$'/);
});
test('SQL remains blocked from production',()=>assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/));

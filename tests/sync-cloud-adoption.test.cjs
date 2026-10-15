const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const {create}=require('../js/sync-supabase-adapter.js').MahjongSupabaseSyncAdapter;
test('server permits NULL only for adopting existing cloud game',()=>{
 assert.match(sql,/p_local_game IS NOT NULL AND v_game\.game_data IS DISTINCT FROM p_local_game/);
 assert.match(sql,/IF NOT FOUND AND p_local_game IS NULL THEN[\s\S]*?'no-cloud-game'/);
});
test('transport sends null for a new device with no local game',async()=>{
 let captured;
 const adapter=create({rpc:async(name,args)=>{captured={name,args};return {data:{ok:true,game:{players:[]}},error:null}}});
 await adapter.open({deviceId:'device',localGame:null});
 assert.equal(captured.name,'mahjong_sync_open');
 assert.equal(captured.args.p_local_game,null);
});
test('transport rejects arrays as initial games',()=>{
 const adapter=create({rpc:async()=>({data:{ok:true}})});
 assert.throws(()=>adapter.open({deviceId:'device',localGame:[]}),/object/);
});

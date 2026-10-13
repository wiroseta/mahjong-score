'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const id='11111111-1111-4111-8111-111111111111';
function transport(){let calls=0;return {adapter:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),count:()=>calls};}
test('sync open rejects unsafe integer in nested score without RPC',()=>{
 const t=transport();assert.throws(()=>t.adapter.open({deviceId:id,localGame:{players:[{score:Number.MAX_SAFE_INTEGER+1}]}}),/unsafe integer/);assert.equal(t.count(),0);
});
test('sync commit rejects unsafe negative integer in history without RPC',()=>{
 const t=transport();assert.throws(()=>t.adapter.commit({gameId:id,deviceId:id,writerToken:'a'.repeat(64),generation:1,baseRevision:0,game:{history:[{delta:-Number.MAX_SAFE_INTEGER-1}]}}),/unsafe integer/);assert.equal(t.count(),0);
});
test('sync open preserves safe integer boundary and fractional values',async()=>{
 let observed;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(_name,args)=>{observed=args;return {data:{ok:true},error:null};}});
 await adapter.open({deviceId:id,localGame:{score:Number.MAX_SAFE_INTEGER,ratio:1.5}});
 assert.equal(observed.p_local_game.score,Number.MAX_SAFE_INTEGER);assert.equal(observed.p_local_game.ratio,1.5);
});

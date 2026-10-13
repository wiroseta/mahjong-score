'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const uuid='11111111-1111-4111-8111-111111111111';
function adapter(){let calls=0;return {client:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),calls:()=>calls};}
test('open rejects NaN score before RPC rather than silently converting it to null',()=>{
 const a=adapter();assert.throws(()=>a.client.open({deviceId:uuid,localGame:{scores:[NaN,0,0,0]}}),/non-finite/);assert.equal(a.calls(),0);
});
test('commit rejects nested Infinity in history before RPC',()=>{
 const a=adapter();assert.throws(()=>a.client.commit({gameId:uuid,deviceId:uuid,writerToken:'token',generation:1,baseRevision:0,game:{history:[{delta:[0,Infinity,0,0]}]}}),/non-finite/);assert.equal(a.calls(),0);
});
test('finite negative and fractional numbers retain JSON values in snapshot',async()=>{
 let payload;const client=MahjongSupabaseSyncAdapter.create({rpc:async(_name,args)=>{payload=args.p_local_game;return {data:{ok:true},error:null};}});
 await client.open({deviceId:uuid,localGame:{scores:[-3,0,1.5,4]}});
 assert.deepEqual(payload.scores,[-3,0,1.5,4]);
});

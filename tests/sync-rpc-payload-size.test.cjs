'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const uuid='11111111-1111-4111-8111-111111111111';
function adapter(){let calls=0;return {client:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),calls:()=>calls};}
test('open rejects oversized ASCII game before network RPC',()=>{
 const a=adapter();assert.throws(()=>a.client.open({deviceId:uuid,localGame:{notes:'x'.repeat(2000001)}}),/2 MB/);assert.equal(a.calls(),0);
});
test('commit rejects oversized multibyte UTF-8 game before network RPC',()=>{
 const a=adapter();assert.throws(()=>a.client.commit({gameId:uuid,deviceId:uuid,writerToken:'token',generation:1,baseRevision:0,game:{notes:'界'.repeat(700000)}}),/2 MB/);assert.equal(a.calls(),0);
});
test('open accepts a small game and passes the snapshot to RPC',async()=>{
 const a=adapter();await a.client.open({deviceId:uuid,localGame:{round:1}});assert.equal(a.calls(),1);
});

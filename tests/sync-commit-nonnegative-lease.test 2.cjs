'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {MahjongSupabaseSyncAdapter} = require('../js/sync-supabase-adapter.js');
function fixture(){
 let calls=0;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}});
 return {adapter, getCalls:()=>calls};
}
function request(overrides={}){return {gameId:'g',deviceId:'d',writerToken:'t',generation:1,baseRevision:0,game:{scores:[0,0,0,0]},...overrides};}
test('commit rejects generation zero without RPC call',()=>{
 const f=fixture();assert.throws(()=>f.adapter.commit(request({generation:0})),/Invalid sync commit parameters/);assert.equal(f.getCalls(),0);
});
test('commit rejects negative generation without RPC call',()=>{
 const f=fixture();assert.throws(()=>f.adapter.commit(request({generation:-1})),/Invalid sync commit parameters/);assert.equal(f.getCalls(),0);
});
test('commit rejects negative base revision without RPC call',()=>{
 const f=fixture();assert.throws(()=>f.adapter.commit(request({baseRevision:-1})),/Invalid sync commit parameters/);assert.equal(f.getCalls(),0);
});

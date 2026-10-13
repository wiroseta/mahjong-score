'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const create=()=>{let calls=0;return {api:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null}}}),calls:()=>calls}};
const commit=(api,game)=>api.commit({gameId:'g',deviceId:'d',writerToken:'t',generation:1,baseRevision:0,game});
test('adapter rejects unpaired Unicode, NUL and malformed object keys before network',()=>{
 const s=create();for(const game of [{name:'\ud800'},{name:'\u0000'},{'\udc00':'bad'}])assert.throws(()=>commit(s.api,game),/Unicode/);
 assert.equal(s.calls(),0);
});
test('adapter rejects silent JSON coercions, sparse arrays and non-JSON values',()=>{
 const s=create();const sparse=[];sparse[1]=1;
 for(const game of [{a:undefined},{a:NaN},{a:1n},{a:new Date()},{a:sparse}])assert.throws(()=>commit(s.api,game));
 const cyclic={};cyclic.self=cyclic;assert.throws(()=>commit(s.api,cyclic),/circular/);
 assert.equal(s.calls(),0);
});
test('adapter accepts valid supplementary Unicode and ordinary nested history',async()=>{
 const s=create();await commit(s.api,{names:['🀄'],history:[{description:'🀄'}]});assert.equal(s.calls(),1);
});

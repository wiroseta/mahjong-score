const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-engine.js').MahjongSyncEngine;
const game={names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1};
function setup(){
 const pending=[];const map=new Map();
 const api={peek:async()=>({ok:true,gameId:'g',revision:0}),open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'secret',canWrite:true,game}),leaseStatus:()=>new Promise((resolve,reject)=>pending.push({resolve,reject}))};
 return {engine:create({api,storage:{getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)},accountId:'a',deviceId:'d'}),pending};
}
test('older revoked lease response cannot override newer valid lease response',async()=>{
 const {engine,pending}=setup();await engine.activate(null);
 const old=engine.checkLease(),latest=engine.checkLease();
 pending[1].resolve({ok:true,gameId:'g',revision:0,canWrite:true});
 assert.equal((await latest).ok,true);
 pending[0].resolve({ok:false,reason:'writer-revoked'});
 assert.equal((await old).reason,'lease-superseded');
 assert.equal(engine.status().state,'ready');
});
test('older lease network error cannot override newer valid lease response',async()=>{
 const {engine,pending}=setup();await engine.activate(null);
 const old=engine.checkLease(),latest=engine.checkLease();
 pending[1].resolve({ok:true,gameId:'g',revision:0,canWrite:true});
 assert.equal((await latest).ok,true);
 pending[0].reject(Error('offline'));
 assert.equal((await old).reason,'lease-superseded');
 assert.equal(engine.status().state,'ready');
});

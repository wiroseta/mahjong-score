const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-engine.js').MahjongSyncEngine;
const game={names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1};
function storage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}}
function setup(status){
 const api={peek:async()=>({ok:true,gameId:'g',revision:0}),open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'secret',canWrite:true,game}),leaseStatus:async()=>status};
 return create({api,storage:storage(),accountId:'a',deviceId:'d'});
}
test('server revocation disables writer without clearing backups',async()=>{
 const e=setup({ok:false,reason:'session-revoked'});await e.activate(null);
 assert.equal((await e.checkLease()).reason,'session-revoked');
 assert.equal(e.status().state,'conflict');assert.equal(e.status().backups,0);
});
test('writer lease downgraded to reader is never automatically restored',async()=>{
 const e=setup({ok:true,gameId:'g',revision:0,canWrite:false});await e.activate(null);
 assert.equal((await e.checkLease()).reason,'writer-revoked');
 assert.equal(e.status().state,'conflict');
});
test('network interruption does not silently revoke or renew writer',async()=>{
 const e=setup(null);await e.activate(null);
 assert.equal((await e.checkLease()).reason,'lease-revoked');
 assert.equal(e.status().state,'conflict');
});

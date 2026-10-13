const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-engine.js').MahjongSyncEngine;
const game={names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1};
const storage=()=>{const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
function engine(api){return create({api,storage:storage(),accountId:'a',deviceId:'d'})}
const base={peek:async()=>({ok:true,gameId:'g',revision:0}),open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'secret',canWrite:true,game})};
test('lease probe cannot revoke writer during an in-flight commit',async()=>{
 let finish;const api={...base,commit:()=>new Promise(r=>finish=r),leaseStatus:async()=>({ok:true,gameId:'g',revision:0,canWrite:true})};
 const e=engine(api);await e.activate(null);const pushing=e.push(game);
 assert.equal((await e.checkLease()).reason,'lease-check-busy');
 finish({ok:true,revision:1});assert.equal((await pushing).ok,true);
 assert.equal(e.status().state,'ready');assert.equal(e.status().revision,1);
});
test('lease probe started before commit cannot invalidate acknowledged revision',async()=>{
 let finishProbe;const api={...base,commit:async()=>({ok:true,revision:1}),leaseStatus:()=>new Promise(r=>finishProbe=r)};
 const e=engine(api);await e.activate(null);const checking=e.checkLease();
 assert.equal((await e.push(game)).ok,true);
 finishProbe({ok:true,gameId:'g',revision:0,canWrite:true});
 assert.equal((await checking).reason,'lease-check-busy');
 assert.equal(e.status().state,'ready');assert.equal(e.status().revision,1);
});

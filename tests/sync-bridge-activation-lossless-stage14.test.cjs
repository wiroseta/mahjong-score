'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-app-bridge.js');
function harness(){
 let resolveActivation,queued=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),engineFactory:()=>({activate:()=>new Promise(r=>resolveActivation=r),status:()=>({state:'ready'}),enqueue:x=>queued.push(x),flush:async()=>({ok:true})}),onAdopt:()=>true});
 const activation=bridge.onSession({user:{id:'u'},session_id:'s'},{},null);
 return {bridge,activation,queued,finish:()=>resolveActivation({game:{cloud:true},canWrite:true})};
}
test('activation rejects invalid snapshot without durable enqueue',async()=>{
 const h=harness();const r=await h.bridge.onSaved({history:[undefined]});
 assert.equal(r.reason,'invalid-snapshot');assert.equal(h.queued.length,0);
 h.finish();assert.equal((await h.activation).ok,true);
});
test('activation rejects custom serializer before durable enqueue',async()=>{
 const h=harness();const r=await h.bridge.onSaved({toJSON(){return {score:1}}});
 assert.equal(r.reason,'invalid-snapshot');assert.equal(h.queued.length,0);
 h.finish();assert.equal((await h.activation).ok,true);
});
test('activation snapshots mutable input before durable enqueue',async()=>{
 const h=harness(),game={history:[{score:1}]};
 const r=await h.bridge.onSaved(game);assert.equal(r.queued,true);
 game.history[0].score=999;
 assert.deepEqual(h.queued,[{history:[{score:1}]}]);
 h.finish();assert.equal((await h.activation).reason,'activation-failed');
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-app-bridge.js');
async function setup(){
 let queued=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state:'ready'}),enqueue:()=>{queued++},flush:async()=>({ok:true})}),onAdopt:()=>true});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'s'},{},null)).ok,true);
 return {bridge,queued:()=>queued};
}
for(const [label,build] of [
 ['named array metadata',()=>{const a=[];a.custom='lost';return {history:a}}],
 ['nested undefined',()=>({history:[{score:undefined}]})],
 ['non-finite number',()=>({score:Infinity})],
 ['unsafe integer',()=>({score:Number.MAX_SAFE_INTEGER+1})],
 ['sparse array',()=>({history:new Array(2)})],
 ['hidden property',()=>{const a={score:1};Object.defineProperty(a,'history',{value:[1],enumerable:false});return a}],
 ['Unicode NUL',()=>({player:'A\u0000B'})],
 ['unpaired high surrogate',()=>({player:'\ud800'})],
 ['unpaired low surrogate in key',()=>({['\udc00']:1})],
 ['custom toJSON serializer',()=>({score:1,toJSON(){return {score:2}}})]
])test('bridge rejects '+label+' before durable queue',async()=>{
 const h=await setup();const result=await h.bridge.onSaved(build());
 assert.equal(result.reason,'invalid-snapshot');assert.equal(h.queued(),0);
});

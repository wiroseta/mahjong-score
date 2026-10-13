const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-app-bridge.js');
for(const reason of ['lease-check-busy','lease-superseded']){
 test('bridge preserves valid writer on non-authoritative '+reason,async()=>{
  let conflicts=0;
  const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
   engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state:'ready'}),checkLease:async()=>({ok:false,reason})}),
   onAdopt:()=>true,onConflict:()=>{conflicts++}});
  assert.equal((await bridge.onSession({user:{id:'u'},session_id:'s'},{},null)).ok,true);
  assert.equal((await bridge.checkLease()).reason,reason);
  assert.equal(bridge.status().canWrite,true);
  assert.equal(conflicts,0);
  bridge.reset();
 });
}

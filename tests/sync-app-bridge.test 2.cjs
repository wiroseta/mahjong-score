const {test}=require('node:test');
const assert=require('node:assert/strict');
const {create}=require('../js/sync-app-bridge.js');
test('disabled bridge cannot access server or write application',async()=>{
 let calls=0;const bridge=create({enabled:false,engineFactory(){calls++},onAdopt(){calls++}});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).reason,'disabled');
 assert.equal((await bridge.onSaved({})).reason,'inactive');assert.equal(calls,0);
});
test('cloud adoption must be confirmed before reporting activation success',async()=>{
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),engineFactory:()=>({activate:async()=>({game:{},canWrite:true})}),onAdopt:()=>false});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).reason,'activation-failed');
 assert.equal(bridge.status().active,false);
});
test('signout invalidates pending cloud activation',async()=>{
 let finish;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),engineFactory:()=>({activate:()=>new Promise(resolve=>{finish=resolve})}),onAdopt:()=>true});
 const pending=bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 await bridge.onSession(null,null,null);
 finish({game:{},canWrite:true});
 assert.equal((await pending).reason,'session-changed');assert.equal(bridge.status().active,false);
});

test('logout suppresses late sync success from previous account',async()=>{
 let finish;const conflicts=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:()=>new Promise(resolve=>{finish=resolve})}),
  onAdopt:()=>true,onConflict:error=>conflicts.push(error)});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 const pending=bridge.onSaved({scores:[1]});await Promise.resolve();bridge.reset();finish({ok:true,revision:1});
 assert.equal((await pending).reason,'session-changed');assert.equal(conflicts.length,0);
});
test('logout suppresses late sync rejection from previous account',async()=>{
 let reject;const conflicts=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:()=>new Promise((_,r)=>{reject=r})}),
  onAdopt:()=>true,onConflict:error=>conflicts.push(error)});
 await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 const pending=bridge.onSaved({scores:[1]});await Promise.resolve();bridge.reset();reject(new Error('old account'));
 assert.equal((await pending).reason,'session-changed');assert.equal(conflicts.length,0);
});

test('new login for same user invalidates previous writer lease',async()=>{
 let activations=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>{activations++;return {game:{},canWrite:true}}}),onAdopt:()=>true});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'first'},{},null)).ok,true);
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'first'},{},null)).reason,'already-active');
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'second'},{},null)).ok,true);
 assert.equal(activations,2);
});
test('missing auth session id cannot reuse a writer lease',async()=>{
 let activations=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>{activations++;return {game:{},canWrite:true}}}),onAdopt:()=>true});
 await bridge.onSession({user:{id:'u'}},{},null);await bridge.onSession({user:{id:'u'}},{},null);
 assert.equal(activations,0);
 assert.equal(bridge.status().active,false);
});

test('JWT session identity changes invalidate earlier writer lease',async()=>{
 const previous=global.atob;
 global.atob=(value)=>Buffer.from(value,'base64').toString('utf8');
 try{
  let activations=0;
  const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
   engineFactory:()=>({activate:async()=>{activations++;return {game:{},canWrite:true}}}),onAdopt:()=>true});
  const token=id=>'x.'+Buffer.from(JSON.stringify({session_id:id})).toString('base64url')+'.sig';
  await bridge.onSession({user:{id:'u'},access_token:token('one')},{},null);
  assert.equal((await bridge.onSession({user:{id:'u'},access_token:token('one')},{},null)).reason,'already-active');
  await bridge.onSession({user:{id:'u'},access_token:token('two')},{},null);
  assert.equal(activations,2);
 }finally{global.atob=previous}
});

test('local score saved during activation prevents stale cloud adoption',async()=>{
 let finish,adoptions=0,conflicts=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:()=>new Promise(resolve=>{finish=resolve})}),
  onAdopt:()=>{adoptions++;return true},onConflict:()=>{conflicts++}});
 const pending=bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal((await bridge.onSaved({scores:[100]})).reason,'activation-in-progress');
 finish({game:{scores:[0]},canWrite:true});
 assert.equal((await pending).reason,'activation-failed');
 assert.equal(adoptions,0);assert.equal(conflicts,1);assert.equal(bridge.status().active,false);
});


test('local score changed during activation blocks cloud adoption and retains local state',async()=>{
 let finish,adoptions=0;const conflicts=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:()=>new Promise(resolve=>{finish=resolve})}),
  onAdopt:()=>{adoptions++;return true},onConflict:error=>conflicts.push(String(error))});
 const pending=bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal((await bridge.onSaved({scores:[10]})).reason,'activation-in-progress');
 finish({game:{scores:[0]},canWrite:true});
 assert.equal((await pending).reason,'activation-failed');
 assert.equal(adoptions,0);assert.equal(bridge.status().active,false);
 assert.match(conflicts[0],/Local game changed during cloud activation/);
});

test('score recorded during activation is durably queued before takeover is blocked',async()=>{
 let resolveOpen;const queue=[];let adopted=false;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:()=>new Promise(resolve=>{resolveOpen=resolve}),enqueue:game=>queue.push(JSON.parse(JSON.stringify(game)))}),
  onAdopt:()=>{adopted=true;return true}});
 const pending=bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 const game={names:['A','B','C','D'],scores:[2,0,0,0],history:[],dealer:0,round:1};
 assert.equal((await bridge.onSaved(game)).queued,true);
 game.scores[0]=999;
 assert.equal(queue[0].scores[0],2);
 resolveOpen({game:{},canWrite:true});
 assert.equal((await pending).reason,'activation-failed');
 assert.equal(adopted,false);
});

test('synchronous engine push failure becomes a controlled sync error',async()=>{
 let failures=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:()=>{throw Error('queue storage unavailable')}}),
  onAdopt:()=>true,onConflict:()=>{failures++}});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 const result=await bridge.onSaved({scores:[1]});
 assert.equal(result.reason,'sync-error');assert.equal(failures,1);
});


test('asynchronous adoption is invalidated when user logs out',async()=>{
 let resume,check;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{scores:[0]},canWrite:true})}),
  onAdopt:async(_game,ctx)=>{check=ctx.isCurrent;await new Promise(resolve=>{resume=resolve});return ctx.isCurrent()}});
 const pending=bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 await Promise.resolve();await Promise.resolve();
 assert.equal(typeof check,'function');assert.equal(check(),true);
 bridge.reset();assert.equal(check(),false);resume();
 assert.equal((await pending).reason,'session-changed');
});


test('repeated auth notification cannot report ready before cloud adoption completes',async()=>{
 let resolveOpen,adoptions=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:()=>new Promise(resolve=>{resolveOpen=resolve})}),
  onAdopt:()=>{adoptions++;return true}});
 const session={user:{id:'u'},session_id:'same-session'};
 const pending=bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 const duplicate=await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 assert.equal(duplicate.ok,false);
 assert.equal(duplicate.reason,'activation-in-progress');
 assert.equal(adoptions,0);
 resolveOpen({game:{},canWrite:true});
 assert.equal((await pending).ok,true);
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).reason,'already-active');
 assert.equal(adoptions,1);
});


test('read-only cloud session never invokes score commit',async()=>{
 let pushes=0,conflicts=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:false}),push:()=>{pushes++}}),
  onAdopt:()=>true,onConflict:()=>{conflicts++}});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'one'},{},null)).canWrite,false);
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[5]})).reason,'read-only');
 assert.equal(pushes,0);assert.equal(conflicts,1);
});


test('server writer revocation disables future sends and readiness',async()=>{
 let pushes=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:async()=>{pushes++;return {ok:false,reason:'writer-revoked'}}}),onAdopt:()=>true});
 const session={user:{id:'u'},session_id:'one'};
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'writer-revoked');
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[2]})).reason,'read-only');
 assert.equal(pushes,1);
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).canWrite,false);
});

test('unhandled queue failure disables writer lease until reactivation',async()=>{
 let pushes=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:()=>{pushes++;throw Error('disk full')}}),onAdopt:()=>true});
 await bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'sync-error');
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[2]})).reason,'read-only');
 assert.equal(pushes,1);
});


test('logout before deferred push does not enqueue or contact old session',async()=>{
 let pushes=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:async()=>{pushes++;return {ok:true}}}),onAdopt:()=>true});
 await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 const pending=bridge.onSaved({scores:[5]});
 bridge.reset();
 assert.equal((await pending).reason,'session-changed');
 assert.equal(pushes,0);
});


test('activation refuses a writer lease when engine reports conflict',async()=>{
 let commits=0;const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state:'conflict'}),push:()=>{commits++}}),
  onAdopt:()=>true});
 const response=await bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal(response.reason,'activation-failed');
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'inactive');
 assert.equal(commits,0);
});


test('unpadded base64url JWT session identity works with strict Safari-style atob',async()=>{
 const original=global.atob;
 global.atob=(encoded)=>{if(encoded.length%4!==0)throw Error('InvalidCharacterError');return Buffer.from(encoded,'base64').toString('utf8')};
 try{
  let activated=0;
  const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
   engineFactory:()=>({activate:async()=>{activated++;return {game:{},canWrite:true}}}),onAdopt:()=>true});
  const payload=Buffer.from(JSON.stringify({session_id:'safari-session'})).toString('base64url');
  assert.equal(payload.includes('='),false);
  assert.equal((await bridge.onSession({user:{id:'u'},access_token:'header.'+payload+'.signature'},{},null)).ok,true);
  assert.equal(activated,1);
 }finally{global.atob=original}
});

test('deferred cloud send captures the exact saved score before later mutation',async()=>{
 const sent=[];const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:async game=>{sent.push(game);return {ok:true}}}),onAdopt:()=>true});
 await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 const game={scores:[10,0,0,0]};
 const pending=bridge.onSaved(game);
 game.scores[0]=20;
 assert.equal((await pending).ok,true);
 assert.deepEqual(sent,[{scores:[10,0,0,0]}]);
});

test('device identity storage failure clears tentative auth and returns controlled error',async()=>{
 const failures=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=>{throw Error('localStorage blocked')},
  adapterFactory:()=>({}),engineFactory:()=>{throw Error('must not instantiate')},
  onAdopt:()=>true,onConflict:error=>failures.push(String(error))});
 const result=await bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal(result.reason,'activation-failed');
 assert.equal(bridge.status().active,false);
 assert.equal(bridge.status().canWrite,false);
 assert.equal(failures.length,1);
});

test('adapter initialization failure never retains phantom account lease',async()=>{
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',
  adapterFactory:()=>{throw Error('adapter unavailable')},engineFactory:()=>{throw Error('must not instantiate')},onAdopt:()=>true});
 const result=await bridge.onSession({user:{id:'u'},session_id:'one'},{},null);
 assert.equal(result.reason,'activation-failed');
 assert.equal(bridge.status().active,false);
 assert.equal(bridge.status().canWrite,false);
});

test('conflicting explicit session and JWT session identifiers fail closed',async()=>{
 const old=global.atob;global.atob=x=>Buffer.from(x,'base64').toString('utf8');
 try{
  let calls=0;
  const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
   engineFactory:()=>{calls++;return {activate:async()=>({game:{},canWrite:true})}},onAdopt:()=>true});
  const jwt='a.'+Buffer.from(JSON.stringify({session_id:'jwt-session'})).toString('base64url')+'.sig';
  const result=await bridge.onSession({user:{id:'u'},session_id:'different-session',access_token:jwt},{},null);
  assert.equal(result.reason,'missing-auth-session');assert.equal(calls,0);
 }finally{global.atob=old}
});
test('expired JWT cannot activate a cloud writer lease',async()=>{
 const old=global.atob;global.atob=x=>Buffer.from(x,'base64').toString('utf8');
 try{
  let calls=0;
  const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
   engineFactory:()=>{calls++;return {activate:async()=>({game:{},canWrite:true})}},onAdopt:()=>true});
  const jwt='a.'+Buffer.from(JSON.stringify({session_id:'old',exp:1})).toString('base64url')+'.sig';
  assert.equal((await bridge.onSession({user:{id:'u'},access_token:jwt},{},null)).reason,'missing-auth-session');
  assert.equal(calls,0);
 }finally{global.atob=old}
});


test('failed activation clears account and auth session identity before retry',async()=>{
 let attempts=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>{attempts++;if(attempts===1)throw Error('offline');return {game:{},canWrite:true}}}),
  onAdopt:()=>true});
 const session={user:{id:'u'},session_id:'session-1'};
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).reason,'activation-failed');
 assert.deepEqual(bridge.status(),{enabled:true,accountId:null,active:false,canWrite:false,adopting:false});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 assert.equal(attempts,2);
});


test('repeated auth notification cannot revive a revoked engine writer lease',async()=>{
 let state='ready';
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state}),push:async()=>({ok:true})}),onAdopt:()=>true});
 const session={user:{id:'u'},session_id:'same'};
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 state='conflict';
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).reason,'lease-not-valid');
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'read-only');
});

test('lease monitor starts after activation, avoids overlapping checks and stops on logout',async()=>{
 let tick, checks=0, release, stopped=0;
 const scheduler={setInterval(fn,ms){assert.equal(ms,1000);tick=fn;return 5;},clearInterval(id){assert.equal(id,5);stopped++;}};
 const bridge=create({enabled:true,leaseIntervalMs:1000,scheduler,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),checkLease:()=>{checks++;return new Promise(resolve=>release=resolve)}}),onAdopt:()=>true});
 await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 tick();tick();await Promise.resolve();await Promise.resolve();assert.equal(checks,1);
 release({ok:true});await new Promise(resolve=>setImmediate(resolve));
 tick();await Promise.resolve();await Promise.resolve();assert.equal(checks,2);
 bridge.reset();assert.equal(stopped,1);release({ok:true});
});

test('lease monitor never schedules for disabled sync',async()=>{
 let scheduled=0;
 const bridge=create({enabled:false,scheduler:{setInterval(){scheduled++;return 1},clearInterval(){}},engineFactory(){throw Error('must not run')}});
 await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null);
 assert.equal(scheduled,0);
});

test('late lease rejection from previous login cannot revoke replacement writer',async()=>{
 let tick, rejectOld, checks=0, conflicts=0;
 const scheduler={setInterval(fn){tick=fn;return 1},clearInterval(){}};
 const bridge=create({enabled:true,storage:{},scheduler,leaseIntervalMs:1000,deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state:'ready'}),checkLease:()=>{checks++;return new Promise((resolve,reject)=>{rejectOld=reject})}}),
  onAdopt:()=>true,onConflict:()=>{conflicts++}});
 await bridge.onSession({user:{id:'u'},session_id:'old'},{},null);
 tick();await Promise.resolve();await Promise.resolve();
 await bridge.onSession({user:{id:'u'},session_id:'new'},{},null);
 rejectOld(new Error('old lease failed'));
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(bridge.status().canWrite,true);
 assert.equal(conflicts,0);
 tick();await Promise.resolve();await Promise.resolve();
 assert.equal(checks,2);
 bridge.reset();
});


test('successful lease check with revoked writer permission fails closed',async()=>{
 let tick,stopped=0,conflicts=[];
 const scheduler={setInterval(fn){tick=fn;return 8},clearInterval(id){assert.equal(id,8);stopped++}};
 const bridge=create({enabled:true,storage:{},scheduler,leaseIntervalMs:1000,
  deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),status:()=>({state:'ready'}),
   checkLease:async()=>({ok:true,canWrite:false})}),
  onAdopt:()=>true,onConflict:error=>conflicts.push(String(error))});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 assert.equal((await bridge.checkLease()).reason,'writer-revoked');
 assert.equal(bridge.status().canWrite,false);
 assert.equal(stopped,1);
 assert.equal(conflicts.length,1);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'read-only');
});


test('rejected direct lease check revokes writer status without throwing',async()=>{
 let reports=0;
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),checkLease:async()=>{throw Error('permission denied')}}),
  onAdopt:()=>true,onConflict:()=>{reports++}});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'one'},{},null)).ok,true);
 const result=await bridge.checkLease();
 assert.equal(result.reason,'lease-check-failed');
 assert.equal(bridge.status().canWrite,false);
 assert.equal(reports,1);
});


test('structured lease network failure revokes bridge writer permission',async()=>{
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),checkLease:async()=>({ok:false,reason:'network-error'})}),
  onAdopt:()=>true});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 assert.equal(bridge.status().canWrite,true);
 assert.equal((await bridge.checkLease()).reason,'network-error');
 assert.equal(bridge.status().canWrite,false);
});


test('network failure after durable enqueue withdraws write permission and preserves queue',async()=>{
 const queue=[];const conflicts=[];
 const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),enqueue:game=>queue.push(game),
   flush:async()=>({ok:false,reason:'network-error'}),status:()=>({state:'ready'})}),
  onAdopt:()=>true,onConflict:error=>conflicts.push(String(error))});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'one'},{},null)).ok,true);
 assert.equal((await bridge.onSaved({scores:[42]})).reason,'network-error');
 assert.equal(bridge.status().canWrite,false);
 assert.deepEqual(queue,[{scores:[42]}]);
 assert.equal((await bridge.onSaved({scores:[43]})).reason,'read-only');
 assert.equal(queue.length,1);
 assert.ok(conflicts.some(x=>x.includes('network-error')));
});

for(const [name,claims] of [
 ['JWT subject disagrees with signed-in user',{session_id:'s1',sub:'different-user'}],
 ['JWT expiry is invalid',{session_id:'s1',sub:'u',exp:'invalid'}]
]){
 test(name+' prevents cloud activation',async()=>{
  const old=global.atob;global.atob=x=>Buffer.from(x,'base64').toString('utf8');
  try{
   let calls=0;
   const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
    engineFactory:()=>{calls++;return {activate:async()=>({game:{},canWrite:true})}},onAdopt:()=>true});
   const jwt='a.'+Buffer.from(JSON.stringify(claims)).toString('base64url')+'.sig';
   assert.equal((await bridge.onSession({user:{id:'u'},access_token:jwt},{},null)).reason,'missing-auth-session');
   assert.equal(calls,0);
  }finally{global.atob=old}
 });
}


test('missing commit acknowledgement withdraws writer permission',async()=>{
 const conflicts=[];const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),push:async()=>undefined}),
  onAdopt:()=>true,onConflict:e=>conflicts.push(String(e))});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 assert.equal((await bridge.onSaved({scores:[1]})).reason,'invalid-sync-acknowledgement');
 assert.equal(bridge.status().canWrite,false);
 assert.equal((await bridge.onSaved({scores:[2]})).reason,'read-only');
 assert.ok(conflicts.length>=1);
});

test('bounded flush cannot report success while edits remain pending',async()=>{
 let flushes=0;let state='ready';const queue=[];const bridge=create({enabled:true,storage:{},deviceIdProvider:()=> 'device',adapterFactory:()=>({}),
  engineFactory:()=>({activate:async()=>({game:{},canWrite:true}),enqueue:g=>queue.push(g),
   flush:async()=>{flushes++;return {ok:true,revision:flushes}},status:()=>({state})}),onAdopt:()=>true});
 assert.equal((await bridge.onSession({user:{id:'u'},session_id:'verified'},{},null)).ok,true);
 state='pending';const result=await bridge.onSaved({scores:[1]});
 assert.equal(result.ok,false);assert.equal(result.reason,'sync-still-pending');
 assert.equal(result.queued,true);assert.equal(bridge.status().canWrite,false);
 assert.equal(flushes,33);assert.equal(queue.length,1);
});

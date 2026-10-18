/* Mahjong cloud sync integration bridge. Intentionally disabled until server RPC
   integration and two-device acceptance tests pass. No application writes occur
   when enabled=false. Never store a server writer token in persistent storage. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.MahjongCloudBridge=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function sessionIdentity(session){
  // Prefer the signed JWT claim over a separately supplied session_id.
  // A disagreement must fail closed, never reuse a writer lease.
  const explicit=typeof session?.session_id==='string'&&session.session_id?session.session_id:null;
  const token=session?.access_token;
  if(typeof token!=='string'||!token)return explicit;
  try{
   const parts=token.split('.');
   if(parts.length!==3||!parts[1]||typeof atob!=='function')return null;
   const base64=parts[1].replace(/-/g,'+').replace(/_/g,'/');
   const payload=JSON.parse(atob(base64.padEnd(Math.ceil(base64.length/4)*4,'=')));
   const claim=typeof payload.session_id==='string'&&payload.session_id?payload.session_id:null;
   if(!claim||(explicit&&explicit!==claim))return null;
   // The authenticated user and JWT subject must agree before any game adoption.
   if(typeof payload.sub==='string'&&payload.sub!==session?.user?.id)return null;
   if(payload.exp!==undefined&&(typeof payload.exp!=='number'||!Number.isFinite(payload.exp)))return null;
   if(typeof payload.exp==='number'&&payload.exp<=Date.now()/1000)return null;
   return claim;
  }catch{return null}
 }

 // Reject lossy local saves before they reach the durable queue. The RPC
 // adapter also validates, but validating after enqueue would be too late.
 function cloneSaveLosslessly(game){
  if(!game||typeof game!=='object'||Array.isArray(game))throw Error('Invalid cloud save object');
  const ancestors=new WeakSet();
  function inspect(value){
   if(value===null)return;
   if(typeof value==='number'&&(!Number.isFinite(value)||(Number.isInteger(value)&&!Number.isSafeInteger(value))))throw Error('Unsafe cloud save number');
   if(typeof value==='string'){
    for(let i=0;i<value.length;i++){
     const code=value.charCodeAt(i);
     if(code===0)throw Error('Cloud save contains Unicode NUL');
     if(code>=0xD800&&code<=0xDBFF){const next=value.charCodeAt(++i);if(!(next>=0xDC00&&next<=0xDFFF))throw Error('Cloud save contains invalid Unicode surrogate');}
     else if(code>=0xDC00&&code<=0xDFFF)throw Error('Cloud save contains invalid Unicode surrogate');
    }
   }
   if(['undefined','function','symbol','bigint'].includes(typeof value))throw Error('Unserializable cloud save value');
   if(typeof value!=='object')return;
   if(Object.hasOwn(value,'toJSON')||typeof value.toJSON==='function')throw Error('Custom cloud save serializer');
   if(ancestors.has(value))throw Error('Circular cloud save');
   if(!Array.isArray(value)&&Object.getPrototypeOf(value)!==Object.prototype&&Object.getPrototypeOf(value)!==null)throw Error('Non-JSON cloud save object');
   ancestors.add(value);
   if(Array.isArray(value))for(let i=0;i<value.length;i++)if(!Object.hasOwn(value,i))throw Error('Sparse cloud save array');
   for(const key of Reflect.ownKeys(value)){
    if(typeof key==='symbol')throw Error('Symbol cloud save key');
    if(Array.isArray(value)&&key==='length')continue;
    if(Array.isArray(value)&&(!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=value.length))throw Error('Lossy cloud save array metadata');
    const descriptor=Object.getOwnPropertyDescriptor(value,key);
    if(!descriptor||!Object.hasOwn(descriptor,'value')||!descriptor.enumerable)throw Error('Lossy cloud save property');
    inspect(key);inspect(descriptor.value);
   }
   ancestors.delete(value);
  }
  inspect(game);
  return JSON.parse(JSON.stringify(game));
 }
 function create({enabled=false,engineFactory,adapterFactory,storage,deviceIdProvider,onAdopt,onConflict,onStatus,leaseIntervalMs=15000,scheduler=globalThis}){
  let engine=null,accountId=null,authSessionId=null,epoch=0,adopting=false,changedDuringActivation=false,canWrite=false;
  let leaseTimer=null,leasePending=false;
  function stopLeaseMonitor(){if(leaseTimer!==null){scheduler.clearInterval(leaseTimer);leaseTimer=null;}}
  function startLeaseMonitor(){
   stopLeaseMonitor();
   if(!enabled||!Number.isInteger(leaseIntervalMs)||leaseIntervalMs<1000||!scheduler?.setInterval)return;
   leaseTimer=scheduler.setInterval(()=>{
    if(leasePending||!engine||adopting)return;
    leasePending=true;
    const checkedEpoch=epoch;
    Promise.resolve().then(()=>checkLease()).catch(error=>{
     // An old request must never revoke a replacement login's writer lease.
     if(checkedEpoch!==epoch)return;
     canWrite=false;stopLeaseMonitor();conflict(error);
    }).finally(()=>{if(checkedEpoch===epoch)leasePending=false;});
   },leaseIntervalMs);
   if(typeof leaseTimer?.unref==='function')leaseTimer.unref();
  }
  const report=(message)=>{if(typeof onStatus==='function')onStatus(message)};
  const conflict=(error)=>{if(typeof onConflict==='function')onConflict(error)};
  function reset(){stopLeaseMonitor();epoch++;leasePending=false;engine=null;accountId=null;authSessionId=null;adopting=false;changedDuringActivation=false;canWrite=false;}
  async function onSession(session,client,localGame){
   if(!enabled)return {ok:false,reason:'disabled'};
   const userId=session?.user?.id;
   if(!userId||!client){reset();return {ok:false,reason:'signed-out'}};
   if(typeof engineFactory!=='function'||typeof adapterFactory!=='function'||!storage||typeof deviceIdProvider!=='function')throw Error('Sync bridge dependencies missing');
   // A fresh login for the same user is a different auth session. Never reuse
   // a writer lease from an earlier login merely because user.id matches.
   const sessionId=sessionIdentity(session);
   // A writer lease must always be tied to a verifiable Supabase auth session.
   if(!sessionId){reset();return {ok:false,reason:'missing-auth-session'};}
   if(accountId===userId&&engine&&sessionId&&authSessionId===sessionId){
    if(adopting)return {ok:false,reason:'activation-in-progress'};
    // A cached bridge flag cannot override a lease revoked inside Sync Engine.
    // Never report already-active/writable after a server rejection.
    const lease=typeof engine.status==='function'?engine.status():null;
    if(lease&&lease.state!==(canWrite?'ready':'read-only')){
     canWrite=false;
     return {ok:false,reason:'lease-not-valid',canWrite:false};
    }
    return {ok:true,reason:'already-active',canWrite};
   }
   reset();const current=epoch;accountId=userId;authSessionId=sessionId;
   // Dependency failures must also clear the tentative account identity.
   // Otherwise a failed device-ID/storage initialization leaves a phantom
   // session behind and the auth callback can reject without a controlled result.
   let instance;
   try{
    const id=deviceIdProvider();
    if(typeof id!=='string'||!id)throw Error('Invalid device identifier');
    instance=engineFactory({api:adapterFactory(client),storage,accountId:userId,deviceId:id});
    engine=instance;adopting=true;changedDuringActivation=false;
    const result=await instance.activate(localGame);
    if(current!==epoch||engine!==instance)return {ok:false,reason:'session-changed'};
    // A local save during the RPC means the fetched cloud snapshot may be stale.
    // Never adopt it over newer local state or silently drop that save.
    if(changedDuringActivation)throw Error('Local game changed during cloud activation; preserve local changes and resolve conflict before adopting cloud state');
    // Caller must atomically persist and render the adopted game; otherwise
    // report a conflict rather than silently accepting an unsaved cloud state.
    if(typeof onAdopt!=='function')throw Error('Cloud adoption handler missing');
    // Adoption can be asynchronous (storage/render). A logout or replacement
    // session must invalidate it before any mutation of the game.
    const isCurrent=()=>current===epoch&&engine===instance&&!changedDuringActivation;
    if(!isCurrent())return {ok:false,reason:'session-changed'};
    const adopted=await onAdopt(result.game,{canWrite:result.canWrite,isCurrent});
    if(!isCurrent())return {ok:false,reason:'session-changed'};
    if(adopted!==true)throw Error('Cloud adoption was not confirmed');
    // Do not advertise write permission if the engine itself reports a
    // revoked/conflicted/read-only lease after activation.
    if(typeof instance.status==='function'){
     const lease=instance.status();
     if(!lease||lease.state!==(result.canWrite===true?'ready':'read-only'))
      throw Error('Cloud writer lease state disagrees with activation response');
    }
    canWrite=result.canWrite===true;
    startLeaseMonitor();
    report(canWrite?'ready':'read-only');
    return {ok:true,canWrite:result.canWrite};
   }catch(error){
    if(current===epoch){stopLeaseMonitor();engine=null;accountId=null;authSessionId=null;canWrite=false;conflict(error)}
    return {ok:false,reason:'activation-failed',error:String(error)};
   }finally{if(current===epoch)adopting=false}
  }
  async function checkLease(){
   if(!enabled||!engine||adopting)return {ok:false,reason:'inactive'};
   const current=epoch,instance=engine;
   if(typeof instance.checkLease!=='function')return {ok:false,reason:'lease-check-unavailable'};
   let result;
   try{result=await instance.checkLease();}
   catch(error){
    if(current!==epoch||instance!==engine)return {ok:false,reason:'session-changed'};
    // A rejected lease check must not leave the bridge advertising a writer.
    // Network outages are handled by the engine as structured network-error
    // results; unexpected rejections are terminal until reactivation.
    canWrite=false;stopLeaseMonitor();conflict(error);
    return {ok:false,reason:'lease-check-failed',error:String(error)};
   }
   if(current!==epoch||instance!==engine)return {ok:false,reason:'session-changed'};
   // These are local scheduling outcomes, not server denials. A concurrent
   // commit or a newer lease probe owns the decision; preserve the current
   // permission until that operation completes and the next probe runs.
   if(result?.ok===false&&['lease-check-busy','lease-superseded'].includes(result.reason))return result;
   // A successful RPC response can still revoke the writer privilege.
   // Do not rely solely on an engine implementation to notice this downgrade.
   if(result?.ok===true&&canWrite&&result.canWrite!==true){
    canWrite=false;stopLeaseMonitor();conflict(new Error('writer-revoked'));
    return {ok:false,reason:'writer-revoked'};
   }
   if(result?.ok!==true){
    canWrite=false;stopLeaseMonitor();conflict(new Error(result?.reason||'lease-check-failed'));
   }
   return result;
  }
  function onSaved(game){
   if(!enabled||!engine)return Promise.resolve({ok:false,reason:'inactive'});
   if(adopting){
    // Persist a valid snapshot in the engine's durable queue while the RPC is
    // pending. This intentionally makes activation fail closed rather than
    // silently dropping an edit or adopting a stale cloud snapshot.
    // Validate and freeze even during activation. Otherwise a mutable or
    // non-JSON snapshot can enter the durable queue through this special path.
    let snapshot;
    try{snapshot=cloneSaveLosslessly(game);}
    catch(error){conflict(error);return Promise.resolve({ok:false,reason:'invalid-snapshot',error:String(error)});}
    changedDuringActivation=true;
    try{
     if(typeof engine.enqueue!=='function')return Promise.resolve({ok:false,reason:'activation-in-progress',error:'No durable queue available'});
     engine.enqueue(snapshot);
     return Promise.resolve({ok:false,reason:'activation-in-progress',queued:true});
    }catch(error){conflict(error);return Promise.resolve({ok:false,reason:'local-queue-failed',error:String(error)});}
   }
   // Read-only sessions must not queue writes as though they could commit.
   // The application's normal local save already preserves the user's change.
   if(!canWrite){conflict(new Error('Read-only cloud session; local game was not sent'));return Promise.resolve({ok:false,reason:'read-only'});}
   // Freeze the save event's value now, not in the deferred microtask: game
   // state is mutable and may be edited again before the promise callback runs.
   let snapshot;
   try{snapshot=cloneSaveLosslessly(game);}
   catch(error){conflict(error);return Promise.resolve({ok:false,reason:'invalid-snapshot',error:String(error)});}
   // Durably enqueue synchronously, BEFORE any microtask or possible logout.
   // The real sync engine exposes enqueue+flush; legacy test doubles can still
   // use push(), which is responsible for queuing before its own network call.
   const current=epoch,instance=engine;
   const durable=typeof instance.enqueue==='function'&&typeof instance.flush==='function';
   if(durable){
    try{instance.enqueue(snapshot);}
    catch(error){canWrite=false;stopLeaseMonitor();conflict(error);return Promise.resolve({ok:false,reason:'local-queue-failed',error:String(error)});}
   }
   return Promise.resolve().then(()=>{
    // A logout cannot discard the edit: it was already persisted in the queue.
    if(current!==epoch||instance!==engine)return {ok:false,reason:'session-changed',queued:durable};
    if(!canWrite)return {ok:false,reason:'read-only',queued:durable};
    if(!durable)return instance.push(snapshot);
    // Flush can return an already in-flight request. Drain subsequent edits
    // rather than reporting success while a newer score remains queued.
    return (async()=>{
     let result=await instance.flush(),attempts=0;
     while(result?.ok===true&&instance.status?.().state==='pending'&&attempts++<32){
      result=await instance.flush();
     }
     // A bounded drain is not a completed save when new edits remain queued.
     if(result?.ok===true&&instance.status?.().state==='pending')return {ok:false,reason:'sync-still-pending',queued:true};
     return result;
    })();
   }).then(result=>{
    if(current!==epoch||instance!==engine)return {ok:false,reason:'session-changed'};
    if(result?.ok!==true){
     // Missing/malformed acknowledgements are not successful commits.
     // Even a transient network failure leaves the server lease unverified.
     // Preserve the durable queue, but fail closed until explicit recovery;
     // otherwise the UI could accept more scores with an unverified writer.
     canWrite=false;stopLeaseMonitor();conflict(new Error(result?.reason||'invalid-sync-acknowledgement'));
     return {ok:false,reason:result?.reason||'invalid-sync-acknowledgement',queued:durable};
    }
    return result;
   }).catch(error=>{if(current!==epoch||instance!==engine)return {ok:false,reason:'session-changed'};canWrite=false;conflict(error);return {ok:false,reason:'sync-error',error:String(error)}});
  }
  return Object.freeze({onSession,onSaved,checkLease,reset,status:()=>({enabled,accountId,active:!!engine,canWrite,adopting})});
 }
 return {create};
});

/* Mahjong cloud sync: isolated, dependency-injected engine. No DOM or game mutations.
   Integration must remain disabled until atomic server RPCs pass real Supabase tests. */
(function(root,factory){
 const module=factory();
 if(typeof exports==='object'&&typeof module!=='undefined')exports.MahjongSyncEngine=module;
 else root.MahjongSyncEngine=module;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const copy=value=>JSON.parse(JSON.stringify(value));
 // Supabase jsonb does not preserve object key insertion order. Compare complete
 // snapshots structurally so identical games do not trigger false conflicts.
 function sameGame(a,b){
  function canonical(value){
   if(Array.isArray(value))return value.map(canonical);
   if(value&&typeof value==='object'){
    const result=Object.create(null);
    for(const key of Object.keys(value).sort())result[key]=canonical(value[key]);
    return result;
   }
   return value;
  }
  return JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
 }

 function codePointLength(value){return Array.from(value).length}

 function validateGame(game){
  if(!game||typeof game!=='object'||Array.isArray(game))throw Error('Invalid game object');
  if(!Array.isArray(game.names)||game.names.length!==4||game.names.some(x=>typeof x!=='string'||codePointLength(x)>100))throw Error('Invalid players');
  if(!Array.isArray(game.scores)||game.scores.length!==4||game.scores.some(x=>!Number.isSafeInteger(x)||Math.abs(x)>999999999999))throw Error('Invalid scores');
  if(!Array.isArray(game.history)||game.history.length>20000)throw Error('Invalid history');
  if(game.history.some(entry=>!entry||typeof entry!=='object'||Array.isArray(entry)))throw Error('Invalid history entry');
  // Historical entries are the recovery ledger. Preserve unknown legacy fields,
  // but reject malformed known scoring fields rather than silently coercing them.
  for(const entry of game.history){
   const scoreVector=(key)=>{
    if(entry[key]!==undefined && (!Array.isArray(entry[key])||entry[key].length!==4||
     entry[key].some(n=>!Number.isSafeInteger(n)||Math.abs(n)>999999999999)))
     throw Error('Invalid history '+key);
   };
   scoreVector('delta');scoreVector('before');scoreVector('quads');
   if(entry.seatWindsBefore!==undefined&&(!Array.isArray(entry.seatWindsBefore)||entry.seatWindsBefore.length!==4||new Set(entry.seatWindsBefore).size!==4||entry.seatWindsBefore.some(n=>!Number.isInteger(n)||n<0||n>3)))throw Error('Invalid history seatWindsBefore');
   if(entry.quads!==undefined&&entry.quads.some(n=>n<0||n>4))throw Error('Invalid history quads');
   for(const key of ['winner','dealer','discarder']){
    if(entry[key]!==undefined&&entry[key]!==null&&(!Number.isInteger(entry[key])||entry[key]<0||entry[key]>3))
     throw Error('Invalid history '+key);
   }
   if(entry.playerPatterns!==undefined&&(!Array.isArray(entry.playerPatterns)||entry.playerPatterns.length!==4||
    entry.playerPatterns.some(p=>p!==null&&(!p||typeof p!=='object'||Array.isArray(p)||typeof p.name!=='string'||codePointLength(p.name)>100||!Number.isSafeInteger(p.points)||Math.abs(p.points)>999999999999))))
    throw Error('Invalid history playerPatterns');
   if(entry.roundWind!==undefined&&(!Number.isInteger(entry.roundWind)||entry.roundWind<0||entry.roundWind>3))throw Error('Invalid history roundWind');
   if(entry.method!==undefined&&typeof entry.method!=='string')throw Error('Invalid history method');
   if(entry.patterns!==undefined&&(!Array.isArray(entry.patterns)||entry.patterns.some(p=>typeof p!=='string')))throw Error('Invalid history patterns');
   if(entry.namesAtTime!==undefined&&(!Array.isArray(entry.namesAtTime)||entry.namesAtTime.length!==4||entry.namesAtTime.some(n=>typeof n!=='string'||codePointLength(n)>100)))throw Error('Invalid history names');
  }

  if(!Number.isInteger(game.dealer)||game.dealer<0||game.dealer>3)throw Error('Invalid dealer');
  if(!Number.isSafeInteger(game.round)||game.round<1||game.round>999999999999999)throw Error('Invalid round');
  if(game.roundWind!==undefined&&(!Number.isInteger(game.roundWind)||game.roundWind<0||game.roundWind>3))throw Error('Invalid round wind');
  if(game.seatWinds!==undefined&&(!Array.isArray(game.seatWinds)||game.seatWinds.length!==4||new Set(game.seatWinds).size!==4||game.seatWinds.some(x=>!Number.isInteger(x)||x<0||x>3)))throw Error('Invalid seat winds');
  // JSON.stringify silently converts NaN/Infinity in nested history metadata to null.
  // Reject such values before creating a recovery snapshot to avoid data loss.
  const seen=new WeakSet();
  function assertSerializable(value){
   if(typeof value==='undefined'||typeof value==='function'||typeof value==='symbol'||typeof value==='bigint')throw Error('Unserializable game value');
   if(typeof value==='number'&&!Number.isFinite(value))throw Error('Non-finite game number');
   // PostgreSQL jsonb rejects unpaired UTF-16 surrogates (\uD800-\uDFFF).
   // Reject locally before storing a snapshot that the server cannot accept.
   if(typeof value==='string'){
    for(let i=0;i<value.length;i++){
     const code=value.charCodeAt(i);
     // PostgreSQL jsonb cannot store the zero code point (\u0000).
     if(code===0)throw Error('Invalid Unicode NUL in game');
     if(code>=0xD800&&code<=0xDBFF){
      const next=value.charCodeAt(++i);
      if(!(next>=0xDC00&&next<=0xDFFF))throw Error('Invalid Unicode surrogate in game');
     }else if(code>=0xDC00&&code<=0xDFFF)throw Error('Invalid Unicode surrogate in game');
    }
   }
   if(value&&typeof value==='object'){
    // JSON.stringify silently converts Date to a string and Map/Set to {}.
    // Reject non-JSON objects rather than corrupting historical metadata.
    if(!Array.isArray(value)&&Object.getPrototypeOf(value)!==Object.prototype&&Object.getPrototypeOf(value)!==null)
     throw Error('Non-JSON game object');
    if(Array.isArray(value)){
     for(let i=0;i<value.length;i++)if(!Object.prototype.hasOwnProperty.call(value,i))throw Error('Sparse game array');
     for(const key of Object.keys(value))if(!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=value.length)throw Error('Non-JSON array property');
    }
    if(seen.has(value))throw Error('Circular game object');
    seen.add(value);
    for(const [key,child] of Object.entries(value)){
     // JSON object keys are strings too; unpaired surrogates in keys are rejected by PostgreSQL jsonb.
     assertSerializable(key);
     assertSerializable(child);
    }
    seen.delete(value);
   }
  }
  assertSerializable(game);
  const serialized=JSON.stringify(game);
  if(serialized===undefined)throw Error('Unserializable game');
  // PostgreSQL checks octet_length(jsonb::text), not UTF-16 string length.
  // Reject oversized Unicode payloads locally before creating recovery entries.
  const utf8Bytes=typeof TextEncoder!=='undefined'
   ?new TextEncoder().encode(serialized).length
   :unescape(encodeURIComponent(serialized)).length;
  // PostgreSQL jsonb::text adds a space after each structural comma/colon.
  // JSON.stringify emits compact JSON; reserve those extra bytes so the
  // browser never accepts a payload the SQL octet_length check rejects.
  let structuralSeparators=0,inString=false,escaped=false;
  for(const char of serialized){
   if(inString){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char==='"')inString=false;}
   else if(char==='"')inString=true;
   else if(char===','||char===':')structuralSeparators++;
  }
  if(utf8Bytes+structuralSeparators>2000000)throw Error('Game exceeds safe size');
  return copy(game);
 }
 function create({api,storage,accountId,deviceId,now=()=>Date.now()}){
  if(!api||!storage||!accountId||!deviceId)throw Error('Sync dependencies required');
  const prefix='mahjong_sync_v1:'+accountId+':'+deviceId+':';
  const read=(name)=>{const raw=storage.getItem(prefix+name);if(raw===null)return null;try{return JSON.parse(raw)}catch(e){throw Error('Sync storage corrupted: '+name+'; do not overwrite local data')}};
  const write=(name,value)=>{storage.setItem(prefix+name,JSON.stringify(value));return value};
  const clear=(name)=>storage.removeItem(prefix+name);
  let state='uninitialized',revision=null,gameId=null,writerToken=null,generation=null,flushInFlight=null,activationInFlight=false,leaseEpoch=0,leaseProbeSequence=0;
  function backup(game,reason){const valid=validateGame(game),id=String(now())+':'+Math.random().toString(36).slice(2);const backups=read('backups')||[];backups.push({id,reason,at:now(),game:valid});write('backups',backups);return id}
  function enqueue(game){const valid=validateGame(game);const queue=read('queue')||[];if(!Array.isArray(queue))throw Error('Sync queue corrupted; refusing to overwrite');queue.push({id:String(now())+':'+Math.random().toString(36).slice(2),at:now(),baseRevision:revision,game:valid});write('queue',queue);if(state!=='conflict')state='pending';return queue.length}
  async function activate(localGame){
   if(activationInFlight)throw Error('Cloud activation already in progress');
   if(flushInFlight)throw Error('Cannot activate during pending commit');
   activationInFlight=true;
   // Invalidate older in-flight lease probes before a new activation starts.
   leaseEpoch++;
   try{return await activateOnce(localGame)}finally{activationInFlight=false}
  }
  async function activateOnce(localGame){
   // A new login must not hide edits queued by an earlier offline session.
   // Require explicit conflict resolution before accepting any cloud snapshot.
   const pendingBefore=read('queue')||[];if(!Array.isArray(pendingBefore))throw Error('Sync queue corrupted; refusing activation');
   if(pendingBefore.length)throw Error('Pending local edits require reconciliation before activation');
   const local=localGame===null?null:validateGame(localGame);
   // Fail closed on re-activation: an old lease must never remain writable
   // after a new server open fails or returns a conflicting snapshot.
   state='uninitialized';gameId=null;revision=null;writerToken=null;generation=null;
   // Critical: save a per-account, per-device backup BEFORE reading/replacing any state.
   if(local!==null)backup(local,'before-cloud-activation');
   // For cloud adoption, read a revision first and require the server to
   // atomically verify it during takeover. The real Supabase adapter has peek().
   let expectedRevision=null,expectedGameId=null;
   let uploadGame=local;
   if(typeof api.peek==='function'){
    const preview=await api.peek();
    if(preview?.ok===true){
     if(typeof preview.gameId!=='string'||!preview.gameId||!Number.isSafeInteger(preview.revision)||preview.revision<0)
      throw Error('Invalid cloud preflight identity');
     expectedRevision=preview.revision;expectedGameId=preview.gameId;
     // A pre-existing cloud game is authoritative. The local copy has already
     // been backed up, and queued edits were rejected above. Never upload it
     // during a new-device takeover.
     uploadGame=null;
    }else if(preview?.reason==='no-cloud-game'){
     if(local===null)throw Error('No cloud game and no initial local game; cannot bootstrap');
    }else{
     throw Error('Cloud preflight unavailable; refusing activation');
    }
   }else if(local===null){
    throw Error('Cloud preflight unavailable; refusing automatic takeover');
   }
   const response=await api.open({deviceId,localGame:uploadGame,expectedRevision,expectedGameId});
   // A rejected preflight is a real conflict, not a transient network failure.
   // In particular, never retry takeover blindly after the cloud changed.
   if(response&&response.ok===false&&[
    'local-cloud-mismatch','cloud-revision-changed','revision-conflict',
    'writer-revoked','session-revoked','account-inactive'
   ].includes(response.reason)){
    state='conflict';
    throw Error('Cloud activation requires reconciliation: '+response.reason);
   }
   // A score may have been recorded while opening the remote lease.
   // Never let the returned cloud snapshot hide that locally queued change.
   if((read('queue')||[]).length){state='conflict';throw Error('Local edits arrived during cloud activation; reconciliation required')}
   if(!response||response.ok!==true||typeof response.gameId!=='string'||!response.gameId||!Number.isSafeInteger(response.revision)||response.revision<0||!response.game||!Number.isSafeInteger(response.generation)||response.generation<1||typeof response.canWrite!=='boolean'|| (response.canWrite && (typeof response.writerToken!=='string'||!response.writerToken))||(!response.canWrite && response.writerToken))throw Error('Invalid cloud response');
   // Defense in depth: a server response must match the preflight identity.
   // Never adopt a different game or revision even if the RPC accidentally
   // omits its expected-game checks.
   if(expectedGameId!==null&&(response.gameId!==expectedGameId||response.revision!==expectedRevision)){
    state='conflict';
    throw Error('Cloud preflight identity changed; refusing automatic takeover');
   }
   const cloud=validateGame(response.game);
   // A new device may contain an independent local game. Never silently replace it.
   // Even revision zero may contain a different device's complete game. Never silently replace it.
   if(local!==null && !sameGame(local,cloud) && expectedGameId===null){
    state='conflict';
    throw Error('Local and cloud games differ; explicit reconciliation required');
   }
   gameId=response.gameId;revision=response.revision;writerToken=response.writerToken||null;generation=response.generation;
   if(!response.canWrite){state='read-only';return {game:cloud,canWrite:false}}
   state='ready';return {game:cloud,canWrite:true};
  }
  async function push(game){
   const valid=validateGame(game);
   // Read-only leases must never accept new score edits, even into a pending
   // writer queue. Existing recovery data is preserved without modification.
   if(state==='read-only')return {ok:false,reason:'no-writer'};
   // Queue is persisted before any network operation, including network failure.
   enqueue(valid);
   // If another commit is already in flight, flush() returns that same promise.
   // Once it completes, drain edits queued during the request rather than leaving
   // the caller with a success response while its own score is still pending.
   // Drain every edit that arrives during an in-flight commit, not just one
   // extra batch. Bound the loop to avoid monopolizing the event loop when
   // edits are being generated continuously; remaining edits stay durable.
   let result=await flush(),batches=0;
   while(result.ok && state==='pending' && batches++<32)result=await flush();
   return result;
  }
  async function flush(){
   if(flushInFlight)return flushInFlight;
   flushInFlight=flushOnce();
   try{return await flushInFlight}finally{flushInFlight=null}
  }
  async function flushOnce(){
   if(activationInFlight)return {ok:false,reason:'activation-in-progress'};
   if(state==='conflict')return {ok:false,reason:'reconciliation-required'};
   if(state==='read-only'||!gameId||!writerToken)return {ok:false,reason:'no-writer'};
   const queue=read('queue')||[];
   if(!Array.isArray(queue))throw Error('Sync queue corrupted; refusing commit');
   // Never transmit a tampered or partially written recovery queue. Validate the
   // complete batch before contacting Supabase, not only its newest snapshot.
   for(const entry of queue){
    if(!entry||typeof entry!=='object'||Array.isArray(entry)||typeof entry.id!=='string'||!entry.id||
       !Number.isFinite(entry.at)||!('game' in entry))throw Error('Invalid pending sync entry; recovery required');
    validateGame(entry.game);
   }
   if(new Set(queue.map(entry=>entry.id)).size!==queue.length)throw Error('Duplicate pending sync IDs; recovery required');
   if(!queue.length){state='ready';return {ok:true,revision}}
   const last=queue[queue.length-1];
   let result;
   try{
    result=await api.commit({gameId,deviceId,writerToken,generation,baseRevision:revision,game:last.game});
   }catch(e){
    const code=String(e?.code||e?.status||'');
    if(code==='42501'||code==='28000'||code==='401'||code==='403'){
     backup(last.game,'authorization-rejected');state='conflict';
     return {ok:false,reason:'authorization-rejected'};
    }
    state='pending';return {ok:false,reason:'network-error',error:String(e)};
   }
   // Storage errors after a successful RPC are NOT network errors. Never retry
   // an acknowledged commit when local queue cleanup failed.
   try{
    if(!result||result.ok!==true){
     if(['revision-conflict','writer-revoked','authorization-rejected','session-revoked','account-inactive'].includes(result?.reason)){
      backup(last.game,result.reason);state='conflict';return {ok:false,reason:result.reason};
     }
     state='pending';return {ok:false,reason:result?.reason||'server-rejected'};
    }
    if(!Number.isSafeInteger(result.revision)||result.revision!==revision+1){
     // An acknowledged write with an unexpected revision is ambiguous: never retry blindly.
     backup(last.game,'invalid-server-revision');state='conflict';
     return {ok:false,reason:'invalid-server-revision'};
    }
    revision=result.revision;
    // Preserve edits queued while the request was in flight.
    const current=read('queue')||[];
    if(!Array.isArray(current))throw Error('Sync queue corrupted; refusing to remove pending edits');
    const sentIds=new Set(queue.map(item=>item.id));
    const remaining=current.filter(item=>!sentIds.has(item.id));
    if(remaining.length)write('queue',remaining);else clear('queue');
    state=remaining.length?'pending':'ready';return {ok:true,revision,pending:remaining.length};
   }catch(e){
    state='conflict';
    throw Error('Post-commit local persistence failed; recovery required; do not retry: '+String(e));
   }
  }
  // Server remains authoritative: polling only withdraws local permissions.
  // Never automatically reacquire a revoked writer lease or discard pending edits.
  async function checkLease(){
   // A commit can advance the revision while the lease probe is in flight.
   // Never compare a pre-commit lease revision against a post-commit local revision.
   if(flushInFlight||activationInFlight)return {ok:false,reason:'lease-check-busy'};
   if(!Number.isSafeInteger(generation)||generation<1||typeof api.leaseStatus!=='function')
    return {ok:false,reason:'lease-unavailable'};
   if(state!=='ready'&&state!=='read-only')return {ok:false,reason:'lease-not-active'};
   const checkedEpoch=leaseEpoch;
   // Only the most recently started probe may change local writer permissions.
   const probeSequence=++leaseProbeSequence;
   const checkedGeneration=generation;
   const checkedRevision=revision;
   let response;
   try{response=await api.leaseStatus({deviceId,generation:checkedGeneration});}
   catch(error){
    if(probeSequence!==leaseProbeSequence||checkedEpoch!==leaseEpoch||checkedGeneration!==generation)return {ok:false,reason:'lease-superseded'};
    // Without a fresh server lease confirmation, writing must fail closed.
    // Keep the durable queue intact for explicit recovery; do not reuse token.
    state='conflict';writerToken=null;
    return {ok:false,reason:'lease-check-unverified',error:String(error)};
   }
   if(probeSequence!==leaseProbeSequence||checkedEpoch!==leaseEpoch||checkedGeneration!==generation)return {ok:false,reason:'lease-superseded'};
   if(flushInFlight||activationInFlight||revision!==checkedRevision)return {ok:false,reason:'lease-check-busy'};
   if(!response||response.ok!==true){
    state='conflict';writerToken=null;
    return {ok:false,reason:response?.reason||'lease-revoked'};
   }
   if(response.gameId!==gameId||!Number.isSafeInteger(response.revision)||response.revision!==revision){
    // A newer cloud revision means this device is stale even if the server
    // still reports a writer lease. Never allow another local score edit
    // before reconciling the authoritative game snapshot.
    state='conflict';writerToken=null;
    return {ok:false,reason:'lease-game-mismatch'};
   }
   if(state==='ready'&&response.canWrite!==true){
    state='conflict';writerToken=null;
    return {ok:false,reason:'writer-revoked'};
   }
   // A read-only session must never become a writer based on polling alone.
   return {ok:true,canWrite:state==='ready',revision:response.revision};
  }
  function status(){return {state,revision,gameId,pending:(read('queue')||[]).length,backups:(read('backups')||[]).length}}
  function backups(){return copy(read('backups')||[])}
  // Portable recovery export is read-only. Never include writer tokens or auth credentials.
  // Do not silently discard malformed persistent data: exporting must fail closed.
  function exportRecovery(){
   const queued=read('queue')||[],saved=read('backups')||[];
   if(!Array.isArray(queued)||!Array.isArray(saved))throw Error('Sync recovery storage corrupted');
   for(const entry of queued){
    if(!entry||typeof entry!=='object'||typeof entry.id!=='string')throw Error('Invalid pending recovery entry');
    validateGame(entry.game);
   }
   for(const entry of saved){
    if(!entry||typeof entry!=='object'||typeof entry.id!=='string')throw Error('Invalid backup recovery entry');
    validateGame(entry.game);
   }
   return copy({format:'mahjong-sync-recovery-v1',accountId,deviceId,exportedAt:now(),pending:queued,backups:saved});
  }
  return {activate,push,flush,enqueue,backup,status,checkLease,backups,exportRecovery};
 }
 return {create,validateGame,sameGame};
});

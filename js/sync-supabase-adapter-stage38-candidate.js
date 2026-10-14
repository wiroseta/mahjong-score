/* Mahjong Supabase RPC transport. No automatic activation or application writes.
   Deliberately unused until server migration and cross-device tests are complete. */
(function(root,factory){
 const module=factory();
 if(typeof exports==='object'&&typeof module!=='undefined')exports.MahjongSupabaseSyncAdapter=module;
 else root.MahjongSupabaseSyncAdapter=module;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function snapshot(value){
  if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Sync game must be an object');
  // Reject values JSON.stringify would silently drop or coerce, and Unicode
  // PostgreSQL jsonb cannot represent. Do this before any network request.
  const ancestors=new WeakSet();
  function check(item){
   if(typeof item==='undefined'||typeof item==='function'||typeof item==='symbol'||typeof item==='bigint')throw Error('Sync game contains an unserializable value');
   if(typeof item==='string'){
    for(let i=0;i<item.length;i++){
     const c=item.charCodeAt(i);
     if(c===0)throw Error('Sync game contains Unicode NUL');
     if(c>=0xD800&&c<=0xDBFF){const n=item.charCodeAt(++i);if(!(n>=0xDC00&&n<=0xDFFF))throw Error('Sync game contains invalid Unicode surrogate');}
     else if(c>=0xDC00&&c<=0xDFFF)throw Error('Sync game contains invalid Unicode surrogate');
    }
   }
   if(item&&typeof item==='object'){
    // JSON.stringify invokes toJSON at every depth, including inherited methods.
    // Reject before serialization to preserve the exact validated snapshot.
    if(Object.hasOwn(item,'toJSON')||typeof item.toJSON==='function')throw Error('Sync game contains a custom toJSON serializer');
    if(!Array.isArray(item)&&Object.getPrototypeOf(item)!==Object.prototype&&Object.getPrototypeOf(item)!==null)throw Error('Sync game contains a non-JSON object');
    if(ancestors.has(item))throw Error('Sync game contains a circular reference');
    ancestors.add(item);
    if(Array.isArray(item)){
     for(let i=0;i<item.length;i++)if(!Object.hasOwn(item,i))throw Error('Sync game contains a sparse array');
    }
    // JSON.stringify silently discards symbol keys and invokes getters. Reject both
    // so a cloud snapshot cannot differ from the validated local object.
    for(const key of Reflect.ownKeys(item)){
     if(typeof key==='symbol')throw Error('Sync game contains a symbol key');
     if(Array.isArray(item)&&key==='length')continue;
     // JSON drops named array properties; reject them rather than silently losing game metadata.
     if(Array.isArray(item)&&(!/^(0|[1-9][0-9]*)$/.test(key)||Number(key)>=item.length))throw Error('Sync game contains a non-JSON array property');
     const descriptor=Object.getOwnPropertyDescriptor(item,key);
     if(!descriptor||!Object.hasOwn(descriptor,'value'))throw Error('Sync game contains an accessor property');
     if(!descriptor.enumerable)throw Error('Sync game contains a hidden property');
     check(key);check(descriptor.value);
    }
    ancestors.delete(item);
   }
  }
  if(Object.hasOwn(value,'toJSON')||typeof value.toJSON==='function')throw Error('Sync game must serialize to an object without custom toJSON');
  check(value);
  const json=JSON.stringify(value,(_key,item)=>{
   if(typeof item==='number'){
    if(!Number.isFinite(item))throw Error('Sync game contains a non-finite number');
    if(Number.isInteger(item)&&!Number.isSafeInteger(item))throw Error('Sync game contains an unsafe integer');
   }
   return item;
  });
  if(typeof json!=='string')throw Error('Sync game must serialize to an object');
  const parsed=JSON.parse(json);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('Sync game must serialize to an object');
  if(new TextEncoder().encode(json).length>2000000)throw Error('Sync game exceeds 2 MB server payload limit');
  return parsed;
 }
 function nonblank(value){return typeof value==='string'&&value.trim().length>0;}
 function claim(value){
  if(!Number.isSafeInteger(value)||value<1)throw Error('Valid authenticated login claim generation required');
  return value;
 }
 function create(client){
  if(!client||typeof client.rpc!=='function')throw Error('Supabase RPC client required');
  async function invoke(name,args){
   const {data,error}=await client.rpc(name,args);
   if(error){
    const failure=new Error(error.message||'Supabase sync RPC failed');
    failure.code=error.code||error.status||null;
    throw failure;
   }
   if(!data||typeof data!=='object'||Array.isArray(data)||typeof data.ok!=='boolean')throw Error('Invalid Supabase RPC response');
   return data;
  }
  return Object.freeze({
   peek(){ return invoke('mahjong_sync_peek',{}); },
   leaseStatus({deviceId,generation,claimGeneration}){
    if(!nonblank(deviceId)||!Number.isSafeInteger(generation)||generation<1)
     throw Error('Valid device ID and lease generation required');
    return invoke('mahjong_sync_lease_status',{p_device_id:deviceId,p_generation:generation,p_claim_generation:claim(claimGeneration)});
   },
   openReader({deviceId,claimGeneration}){
    if(!nonblank(deviceId))throw Error('Device ID required');
    return invoke('mahjong_sync_open_reader',{p_device_id:deviceId,p_claim_generation:claim(claimGeneration)});
   },
   read({deviceId,claimGeneration}){
    if(!nonblank(deviceId))throw Error('Device ID required');
    return invoke('mahjong_sync_read',{p_device_id:deviceId,p_claim_generation:claim(claimGeneration)});
   },
   open({deviceId,localGame,expectedRevision=null,expectedGameId=null,claimGeneration}){
    if(!nonblank(deviceId))throw Error('Device ID required');
    if(expectedRevision!==null&&(!Number.isSafeInteger(expectedRevision)||expectedRevision<0))throw Error('Invalid expected cloud revision');
    if(expectedGameId!==null&&(!nonblank(expectedGameId)))throw Error('Invalid expected cloud game ID');
    if((expectedRevision===null)!==(expectedGameId===null))throw Error('Expected cloud game ID and revision must be supplied together');
    return invoke('mahjong_sync_open',{p_device_id:deviceId,p_local_game:localGame==null?null:snapshot(localGame),p_expected_revision:expectedRevision,p_expected_game_id:expectedGameId,p_claim_generation:claim(claimGeneration)});
   },
   commit({gameId,deviceId,writerToken,generation,baseRevision,game,claimGeneration}){
    if(!nonblank(gameId)||!nonblank(deviceId)||!nonblank(writerToken)||!Number.isSafeInteger(generation)||generation<1||!Number.isSafeInteger(baseRevision)||baseRevision<0)throw Error('Invalid sync commit parameters');
    return invoke('mahjong_sync_commit',{
     p_game_id:gameId,p_device_id:deviceId,p_token:writerToken,
     p_generation:generation,p_base_revision:baseRevision,p_game:snapshot(game),p_claim_generation:claim(claimGeneration)
    });
   }
  });
 }
 return {create};
});

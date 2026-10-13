/* Stable, non-secret installation identifier. Not an authentication credential. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.MahjongSyncDeviceId=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='mahjong_sync_device_id_v1';
 const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
 function getOrCreate(storage,cryptoProvider){
  if(!storage||typeof storage.getItem!=='function'||typeof storage.setItem!=='function')throw Error('Device storage unavailable');
  let stored;
  try{stored=storage.getItem(KEY)}catch{throw Error('Device storage unreadable; cloud sync must stay disabled')}
  if(stored!==null){
   if(!UUID.test(stored))throw Error('Invalid existing device ID; refusing to overwrite it');
   return stored;
  }
  if(!cryptoProvider||typeof cryptoProvider.randomUUID!=='function')throw Error('Secure device ID generation unavailable');
  const id=cryptoProvider.randomUUID();
  if(!UUID.test(id))throw Error('Invalid generated device ID');
  try{
   storage.setItem(KEY,id);
   if(storage.getItem(KEY)!==id)throw Error('Device ID was not persisted');
  }catch{throw Error('Device ID persistence failed; cloud sync must stay disabled')}
  return id;
 }
 return Object.freeze({getOrCreate,KEY});
});

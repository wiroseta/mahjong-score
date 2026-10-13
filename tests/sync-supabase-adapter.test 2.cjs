const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
test('open maps device and game to named RPC arguments',async()=>{
 let request;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(...args)=>{request=args;return {data:{ok:true},error:null}}});
 assert.deepEqual(await adapter.open({deviceId:'device-1',localGame:{names:[]}}),{ok:true});
 assert.deepEqual(request,['mahjong_sync_open',{p_device_id:'device-1',p_local_game:{names:[]},p_expected_revision:null,p_expected_game_id:null}]);
});
test('commit maps generation token revision and game exactly',async()=>{
 let request;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(...args)=>{request=args;return {data:{ok:true,revision:4},error:null}}});
 await adapter.commit({gameId:'g',deviceId:'d',writerToken:'t',generation:2,baseRevision:3,game:{scores:[0,0,0,0]}});
 assert.deepEqual(request,['mahjong_sync_commit',{p_game_id:'g',p_device_id:'d',p_token:'t',p_generation:2,p_base_revision:3,p_game:{scores:[0,0,0,0]}}]);
});
test('permission error retains Supabase code',async()=>{
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>({data:null,error:{code:'42501',message:'revoked'}})});
 await assert.rejects(adapter.open({deviceId:'d',localGame:{}}),e=>e.code==='42501'&&e.message==='revoked');
});
test('malformed server response is rejected',async()=>{
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>({data:[],error:null})});
 await assert.rejects(adapter.open({deviceId:'d',localGame:{}}),/Invalid Supabase RPC response/);
});
test('no network request on missing commit credentials',async()=>{
 let called=false;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>{called=true;return {data:{ok:true}}}});
 assert.throws(()=>adapter.commit({gameId:'g',deviceId:'d',generation:1,baseRevision:0,game:{}}),/Invalid sync commit parameters/);
 assert.equal(called,false);
});

test('open snapshots game before asynchronous transport uses it',async()=>{
 let captured;const game={names:['A'],scores:[1]};
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(_name,args)=>{captured=args;return {data:{ok:true},error:null}}});
 const pending=adapter.open({deviceId:'d',localGame:game});game.scores[0]=999;
 await pending;assert.equal(captured.p_local_game.scores[0],1);
});
test('commit snapshots game and refuses non-object payload before network call',async()=>{
 let captured, calls=0;const game={scores:[1]};
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(_name,args)=>{calls++;captured=args;return {data:{ok:true,revision:1},error:null}}});
 const pending=adapter.commit({gameId:'g',deviceId:'d',writerToken:'t',generation:1,baseRevision:0,game});
 game.scores[0]=999;await pending;assert.equal(captured.p_game.scores[0],1);
 assert.throws(()=>adapter.commit({gameId:'g',deviceId:'d',writerToken:'t',generation:1,baseRevision:0,game:[]}),/Sync game must be an object/);
 assert.equal(calls,1);
});

test('cloud adoption requires matching game identity and revision before RPC',async()=>{
 let calls=0,params;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(_name,args)=>{calls++;params=args;return {data:{ok:true},error:null}}});
 await adapter.open({deviceId:'device-2',localGame:null,expectedRevision:7,expectedGameId:'game-uuid'});
 assert.equal(params.p_expected_revision,7);assert.equal(params.p_expected_game_id,'game-uuid');assert.equal(params.p_local_game,null);
 assert.throws(()=>adapter.open({deviceId:'device-2',localGame:null,expectedRevision:-1}),/Invalid expected cloud revision/);
 assert.equal(calls,1);
});

test('cloud adoption forwards both expected game identity and revision',async()=>{
 let request;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(...args)=>{request=args;return {data:{ok:true},error:null}}});
 await adapter.open({deviceId:'device-1',localGame:null,expectedRevision:0,expectedGameId:'game-uuid'});
 assert.equal(request[1].p_expected_game_id,'game-uuid');
 assert.equal(request[1].p_expected_revision,0);
});


test('read-only session fetch maps device ID to mahjong_sync_read',async()=>{
 let request;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(...args)=>{request=args;return {data:{ok:true,canWrite:false,game:{names:[]}},error:null}}});
 const result=await adapter.read({deviceId:'device-2'});
 assert.equal(result.canWrite,false);
 assert.deepEqual(request,['mahjong_sync_read',{p_device_id:'device-2'}]);
});
test('read refuses absent device ID before network access',()=>{
 let called=false;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>{called=true;return {data:{ok:true},error:null}}});
 assert.throws(()=>adapter.read({deviceId:''}),/Device ID required/);
 assert.equal(called,false);
});


test('lease probe maps identity and generation without writer credentials',async()=>{
 let request;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(...args)=>{request=args;return {data:{ok:false,reason:'session-revoked'},error:null}}});
 const result=await adapter.leaseStatus({deviceId:'device-1',generation:3});
 assert.equal(result.reason,'session-revoked');
 assert.deepEqual(request,['mahjong_sync_lease_status',{p_device_id:'device-1',p_generation:3}]);
});
test('lease probe rejects malformed generation before RPC',()=>{
 let called=false;
 const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>{called=true;return {data:{ok:true},error:null}}});
 assert.throws(()=>adapter.leaseStatus({deviceId:'d',generation:0}),/Valid device ID/);
 assert.throws(()=>adapter.leaseStatus({deviceId:'d',generation:1.5}),/Valid device ID/);
 assert.equal(called,false);
});

for(const [label,makeGame] of [
 ['nested object',{create:()=>({state:{score:1,toJSON(){return {score:999}}}})}],
 ['nested array',{create:()=>({scores:Object.assign([1],{toJSON(){return [999]}})})}],
 ['inherited nested serializer',{create:()=>{const game={state:{score:1}};Object.defineProperty(Object.prototype,'toJSON',{configurable:true,value(){return {score:999}}});return game;}}]
]){
 test('reject '+label+' toJSON before any cloud RPC',()=>{
  let calls=0;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true}}}});
  try{assert.throws(()=>adapter.open({deviceId:'d',localGame:makeGame.create()}),/custom toJSON serializer|without custom toJSON/);assert.equal(calls,0);}
  finally{if(label==='inherited nested serializer')delete Object.prototype.toJSON;}
 });
}

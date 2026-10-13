const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
function adapter(){let calls=0;return {api:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),count:()=>calls};}
test('open rejects whitespace-only device ID before transport',()=>{const x=adapter();assert.throws(()=>x.api.open({deviceId:'  ',localGame:{}}),/Device ID required/);assert.equal(x.count(),0);});
test('read and openReader reject whitespace-only device ID',()=>{const x=adapter();assert.throws(()=>x.api.read({deviceId:'  '}),/Device ID required/);assert.throws(()=>x.api.openReader({deviceId:'\t'}),/Device ID required/);assert.equal(x.count(),0);});
test('open rejects whitespace-only expected cloud game ID',()=>{const x=adapter();assert.throws(()=>x.api.open({deviceId:'d',localGame:{},expectedRevision:0,expectedGameId:'  '}),/Invalid expected cloud game ID/);assert.equal(x.count(),0);});
test('commit rejects whitespace-only game, device and token credentials',()=>{const x=adapter();for(const key of ['gameId','deviceId','writerToken']){const input={gameId:'g',deviceId:'d',writerToken:'t',generation:1,baseRevision:0,game:{}};input[key]='  ';assert.throws(()=>x.api.commit(input),/Invalid sync commit parameters/);}assert.equal(x.count(),0);});
test('leaseStatus rejects whitespace-only device ID',()=>{const x=adapter();assert.throws(()=>x.api.leaseStatus({deviceId:'  ',generation:1}),/Valid device ID/);assert.equal(x.count(),0);});

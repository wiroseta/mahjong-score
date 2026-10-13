'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {MahjongSupabaseSyncAdapter} = require('../js/sync-supabase-adapter.js');
const create = MahjongSupabaseSyncAdapter.create;
const UUID = '11111111-1111-4111-8111-111111111111';
test('open rejects a revision without cloud game ID before invoking RPC', () => {
 let calls=0; const adapter=create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}});
 assert.throws(()=>adapter.open({deviceId:UUID,localGame:null,expectedRevision:0}),/supplied together/);
 assert.equal(calls,0);
});
test('open rejects a cloud game ID without revision before invoking RPC', () => {
 let calls=0; const adapter=create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}});
 assert.throws(()=>adapter.open({deviceId:UUID,localGame:null,expectedGameId:UUID}),/supplied together/);
 assert.equal(calls,0);
});
test('open passes matching cloud preflight ID and revision unchanged', async () => {
 let observed; const adapter=create({rpc:async(name,args)=>{observed={name,args};return {data:{ok:true},error:null};}});
 await adapter.open({deviceId:UUID,localGame:null,expectedRevision:0,expectedGameId:UUID});
 assert.equal(observed.name,'mahjong_sync_open');
 assert.equal(observed.args.p_expected_revision,0);
 assert.equal(observed.args.p_expected_game_id,UUID);
});

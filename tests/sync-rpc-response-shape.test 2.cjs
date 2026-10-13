'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const uuid='11111111-1111-4111-8111-111111111111';
function adapter(data){return MahjongSupabaseSyncAdapter.create({rpc:async()=>({data,error:null})});}
test('rejects RPC object missing ok flag instead of treating it as a valid result',async()=>{
 await assert.rejects(adapter({revision:1}).peek(),/Invalid Supabase RPC response/);
});
test('rejects RPC ok flag encoded as string instead of boolean',async()=>{
 await assert.rejects(adapter({ok:'false',reason:'writer-revoked'}).open({deviceId:uuid,localGame:{round:1}}),/Invalid Supabase RPC response/);
});
test('preserves explicit RPC rejection with boolean ok false',async()=>{
 const response={ok:false,reason:'writer-revoked'};
 assert.deepEqual(await adapter(response).peek(),response);
});

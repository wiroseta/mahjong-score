'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const id='11111111-1111-4111-8111-111111111111';
function fixture(){let calls=0;return {adapter:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),calls:()=>calls};}
test('rejects game root transformed to JSON null by toJSON before RPC',()=>{const f=fixture();assert.throws(()=>f.adapter.open({deviceId:id,localGame:{toJSON(){return null;}}}),/Sync game must serialize to an object/);assert.equal(f.calls(),0);});
test('rejects game root transformed to JSON array by toJSON before RPC',()=>{const f=fixture();assert.throws(()=>f.adapter.commit({gameId:id,deviceId:id,writerToken:'token',generation:1,baseRevision:0,game:{toJSON(){return [1,2];}}}),/Sync game must serialize to an object/);assert.equal(f.calls(),0);});
test('accepts ordinary JSON object root and preserves payload',async()=>{let args;const f=MahjongSupabaseSyncAdapter.create({rpc:async(_name,params)=>{args=params;return {data:{ok:true},error:null};}});await f.open({deviceId:id,localGame:{round:1,names:['A','B','C','D']}});assert.deepEqual(args.p_local_game,{round:1,names:['A','B','C','D']});});

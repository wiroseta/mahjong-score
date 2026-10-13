'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter:{create}}=require('../js/sync-supabase-adapter.js');
const id='00000000-0000-4000-8000-000000000001';
function harness(){let calls=0;return {adapter:create({rpc:async()=>{calls++;return {data:{ok:true},error:null}}}),calls:()=>calls};}
for(const [label,mutate] of [
 ['named array metadata',a=>{a.extra='must-not-drop'}],
 ['noncanonical numeric array key',a=>{a['01']='must-not-drop'}],
 ['nested named array metadata',a=>{a[0]=[];a[0].custom='must-not-drop'}]
])test('adapter rejects '+label+' before network request',()=>{
 const h=harness(),game={history:[]};mutate(game.history);
 assert.throws(()=>h.adapter.open({deviceId:id,localGame:game}),/non-JSON array property/);
 assert.equal(h.calls(),0);
});

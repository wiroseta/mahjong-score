'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const id='11111111-1111-4111-8111-111111111111';
function fixture(){let calls=0;return {adapter:MahjongSupabaseSyncAdapter.create({rpc:async()=>{calls++;return {data:{ok:true},error:null};}}),calls:()=>calls};}
test('open rejects symbol-keyed snapshot before network',()=>{const t=fixture(),g={names:[]};g[Symbol('hidden')]='secret';assert.throws(()=>t.adapter.open({deviceId:id,localGame:g}),/symbol key/);assert.equal(t.calls(),0);});
test('commit rejects getter without invoking it',()=>{const t=fixture(),g={};let invoked=0;Object.defineProperty(g,'scores',{enumerable:true,get(){invoked++;return [];}});assert.throws(()=>t.adapter.commit({gameId:id,deviceId:id,writerToken:'a'.repeat(64),generation:1,baseRevision:0,game:g}),/accessor property/);assert.equal(invoked,0);assert.equal(t.calls(),0);});
test('open rejects hidden own property instead of silently dropping it',()=>{const t=fixture(),g={names:[]};Object.defineProperty(g,'secret',{value:1,enumerable:false});assert.throws(()=>t.adapter.open({deviceId:id,localGame:g}),/hidden property/);assert.equal(t.calls(),0);});
test('open preserves ordinary JSON object payload',async()=>{let payload;const adapter=MahjongSupabaseSyncAdapter.create({rpc:async(_n,args)=>{payload=args.p_local_game;return {data:{ok:true},error:null};}});await adapter.open({deviceId:id,localGame:{names:['A','B','C','D'],scores:[0,0,0,0],history:[]}});assert.equal(payload.names.length,4);});

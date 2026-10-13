'use strict';
// Contract integration across the actual browser RPC adapter and isolated sync engine.
// This is a simulated transport, NOT a live Supabase integration test.
const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const {MahjongSupabaseSyncAdapter}=require('../js/sync-supabase-adapter.js');
const game=(score=0)=>({names:['Ari','Yenny','Andi','Ferry'],scores:[score,0,0,0],history:[],dealer:0,round:1});
function storage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}}
function setup(){
 let current=game(),revision=0,writer=null,sequence=0;
 const calls=[];
 const client={rpc:async(name,args)=>{
  calls.push({name,args});
  if(name==='mahjong_sync_peek'){
   return {data:{ok:true,gameId:'game-1',revision},error:null};
  }
  if(name==='mahjong_sync_open'){
   writer={device:args.p_device_id,token:'token-'+(++sequence),generation:sequence};
   return {data:{ok:true,gameId:'game-1',revision,game:current,writerToken:writer.token,generation:writer.generation,canWrite:true},error:null};
  }
  if(name==='mahjong_sync_commit'){
   if(!writer||args.p_device_id!==writer.device||args.p_token!==writer.token||args.p_generation!==writer.generation)
    return {data:{ok:false,reason:'writer-revoked',cloudRevision:revision},error:null};
   if(args.p_base_revision!==revision)return {data:{ok:false,reason:'revision-conflict',cloudRevision:revision},error:null};
   current=args.p_game;revision++;
   return {data:{ok:true,revision},error:null};
  }
  throw Error('Unexpected RPC '+name);
 }};
 const api=MahjongSupabaseSyncAdapter.create(client);
 const device=(id)=>MahjongSyncEngine.create({api,storage:storage(),accountId:'user-1',deviceId:id});
 return {device,calls,cloud:()=>({game:current,revision})};
}
test('adapter and engine perform open, score commit, revision increment',async()=>{
 const s=setup(),a=s.device('device-A');
 assert.equal((await a.activate(game())).canWrite,true);
 assert.deepEqual(await a.push(game(5)),{ok:true,revision:1,pending:0});
 assert.equal(s.cloud().game.scores[0],5);
 assert.equal(a.status().pending,0);
 assert.deepEqual(s.calls.map(c=>c.name),['mahjong_sync_peek','mahjong_sync_open','mahjong_sync_commit']);
});
test('device takeover revokes previous writer and preserves its uncommitted score',async()=>{
 const s=setup(),a=s.device('device-A'),b=s.device('device-B');
 await a.activate(game());
 await b.activate(game());
 const rejected=await a.push(game(5));
 assert.deepEqual(rejected,{ok:false,reason:'writer-revoked'});
 assert.equal(a.status().state,'conflict');
 assert.equal(a.status().pending,1);
 assert.equal(a.exportRecovery().pending[0].game.scores[0],5);
 assert.equal(s.cloud().game.scores[0],0);
 assert.equal((await b.push(game(10))).ok,true);
 assert.equal(s.cloud().game.scores[0],10);
});
test('new device with different local game adopts authoritative cloud and retains backup',async()=>{
 const s=setup(),a=s.device('device-A'),b=s.device('device-B');
 await a.activate(game());await a.push(game(5));
 const takeover=await b.activate(game(9));
 assert.equal(takeover.canWrite,true);
 assert.equal(takeover.game.scores[0],5);
 assert.equal(b.exportRecovery().backups[0].game.scores[0],9);
 assert.equal(s.cloud().game.scores[0],5);
});

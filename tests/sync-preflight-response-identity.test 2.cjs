const {test}=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const game={names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1};
const storage=()=>{const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}};
for(const [name,returnedGame,returnedRevision] of [['wrong game','different',3],['wrong revision','expected',4]]){
 test('preflight rejects '+name+' in RPC response even if server erroneously accepts takeover',async()=>{
  const engine=MahjongSyncEngine.create({accountId:'user',deviceId:'device',storage:storage(),api:{
   peek:async()=>({ok:true,gameId:'expected',revision:3}),
   open:async()=>({ok:true,gameId:returnedGame,revision:returnedRevision,game,generation:1,canWrite:true,writerToken:'secret'}),
  }});
  await assert.rejects(engine.activate(null),/Cloud preflight identity changed/);
  assert.equal(engine.status().state,'conflict');
 });
}

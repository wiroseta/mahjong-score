const test=require('node:test');
const assert=require('node:assert/strict');
const {MahjongSyncEngine:{create}}=require('../js/sync-engine.js');
const game=n=>({names:['A','B','C','D'],scores:[n,0,0,0],history:[],dealer:0,round:1});
function storage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}}
test('push drains edits arriving during two successive network commits',async()=>{
 let calls=0,release=[];
 const api={open:async()=>({ok:true,gameId:'g',revision:0,generation:1,canWrite:true,writerToken:'t',game:game(0)}),commit:async()=>{calls++;await new Promise(r=>release.push(r));return {ok:true,revision:calls}}};
 const engine=create({api,storage:storage(),accountId:'a',deviceId:'d'});
 await engine.activate(game(0));
 const pending=engine.push(game(1));
 await new Promise(r=>setImmediate(r));
 engine.enqueue(game(2));release.shift()();
 await new Promise(r=>setImmediate(r));
 engine.enqueue(game(3));release.shift()();
 await new Promise(r=>setImmediate(r));
 release.shift()();
 const result=await pending;
 assert.equal(result.ok,true);assert.equal(calls,3);assert.equal(engine.status().pending,0);assert.equal(engine.status().revision,3);
});

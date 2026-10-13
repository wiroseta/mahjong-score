const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('matching existing cloud game is accepted without writing storage',()=>{
 const block=html.match(/onAdopt:\(cloud,\{isCurrent\}\)=>\{([\s\S]*?)\n \},\n onConflict:/);
 assert.ok(block,'application cloud adoption handler exists');
 const fn=new Function('cloud','context','mahjongStorageLoadError','mahjongStorageRead','mahjongStorageWrite','window',`const {isCurrent}=context; let s=null,mahjongSavedState=null,winner=null,method=null,discarder=null; const render=()=>{}; const scheduleLivePublish=()=>{}; ${block[1]}`);
 const game={scores:[1,2,3,4]};let writes=0;
 const result=fn(game,{isCurrent:()=>true},false,()=>JSON.stringify(game),()=>{writes++;return true},{MahjongSyncEngine:{validateGame:g=>g,sameGame:MahjongSyncEngine.sameGame}});
 assert.equal(result,true);assert.equal(writes,0);
});
test('different existing game is never overwritten by cloud adoption',()=>{
 const block=html.match(/onAdopt:\(cloud,\{isCurrent\}\)=>\{([\s\S]*?)\n \},\n onConflict:/);
 assert.ok(block);
 const fn=new Function('cloud','context','mahjongStorageLoadError','mahjongStorageRead','mahjongStorageWrite','window',`const {isCurrent}=context; let s=null,mahjongSavedState=null,winner=null,method=null,discarder=null; const render=()=>{}; const scheduleLivePublish=()=>{}; ${block[1]}`);
 let writes=0;
 const result=fn({scores:[1]},{isCurrent:()=>true},false,()=>JSON.stringify({scores:[2]}),()=>{writes++;return true},{MahjongSyncEngine:{validateGame:g=>g,sameGame:MahjongSyncEngine.sameGame}});
 assert.equal(result,false);assert.equal(writes,0);
});

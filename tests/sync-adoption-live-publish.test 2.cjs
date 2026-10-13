const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('onAdopt:(cloud,{isCurrent})=>{');
const end=html.indexOf('onConflict:error=>',start);
const adopt=html.slice(start,end);
test('cloud takeover republishes live score when disk snapshot matches but memory is stale',()=>{
 const matching=adopt.slice(adopt.indexOf('if(window.MahjongSyncEngine.sameGame(saved,snapshot)){'),adopt.indexOf('// Never silently lose an unrelated local game.'));
 assert.match(matching,/s=snapshot;mahjongSavedState=snapshot;/);
 assert.match(matching,/render\(\);scheduleLivePublish\(\);/);
});
test('cloud takeover persists and republishes differing snapshot',()=>{
 assert.match(adopt,/mahjongStorageWrite\('mahjong_table_v3',JSON.stringify\(snapshot\)\)/);
 assert.match(adopt,/render\(\);scheduleLivePublish\(\);/g);
});

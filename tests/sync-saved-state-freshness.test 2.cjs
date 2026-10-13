const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const save=html.match(/function save\(\)\{([\s\S]*?)\n\}\nfunction patternOptions/);
test('successful local save refreshes saved-state marker after durable cloud enqueue',()=>{
 assert.ok(save,'save() function must exist');
 const code=save[1];
 const persist=code.indexOf("mahjongStorageWrite('mahjong_table_v3',serialized)");
 const dispatch=code.indexOf('mahjongCloudSyncBridge.onSaved(s)');
 const refresh=code.indexOf('mahjongSavedState=JSON.parse(serialized)');
 assert.ok(persist>=0&&dispatch>persist&&refresh>dispatch);
 assert.match(code,/if\(!mahjongCloudSyncBridge\.status\(\)\.canWrite\)/);
});
test('failed local save or queue failure cannot refresh saved-state marker',()=>{
 assert.ok(save,'save() function must exist');
 const code=save[1];
 assert.match(code,/if\(!mahjongStorageWrite\('mahjong_table_v3',serialized\)\)return false;/);
 assert.match(code,/if\(!mahjongCloudSyncBridge\.status\(\)\.canWrite\)\{[\s\S]*?return false;/);
 assert.ok(code.indexOf('mahjongSavedState=JSON.parse(serialized)')>code.indexOf('return false;',code.indexOf('mahjongCloudSyncBridge.onSaved(s)')));
});

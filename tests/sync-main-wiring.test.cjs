const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('sync modules loaded before main auth code',()=>{
 const files=['sync-engine.js','sync-supabase-adapter.js','sync-app-bridge.js','sync-device-id.js'];
 const offsets=files.map(f=>html.indexOf('<script src="./js/'+f+'"></script>'));
 assert(offsets.every(x=>x>=0));assert(offsets[0]<offsets[1]&&offsets[1]<offsets[2]&&offsets[2]<offsets[3]);
 assert(offsets[3]<html.indexOf('id="auth-management-js"'));
});
test('Stage280 sync enabled with cloud adoption requiring safe local persistence',()=>{
 assert.match(html,/const MAHJONG_CLOUD_SYNC_ENABLED=true;/);
 assert.match(html,/deviceIdProvider:\(\)=>window\.MahjongSyncDeviceId\.getOrCreate\(window\.localStorage,window\.crypto\)/);
 assert.match(html,/onAdopt:\(cloud,\{isCurrent\}\)=>\{/);
 assert.match(html,/if\(raw!==null\)\{/);
 assert.match(html,/if\(!mahjongStorageWrite\('mahjong_table_v3',JSON.stringify\(snapshot\)\)\)return false;/);
 assert.match(html,/if\(!isCurrent\(\)\)return false;/);
});
test('existing save writes locally before any optional cloud send',()=>{
 const save=html.match(/function save\(\)\{[\s\S]*?\n\}\nfunction patternOptions/)?.[0];assert(save);
 assert(save.indexOf('mahjongStorageWrite(')<save.indexOf('mahjongCloudSyncBridge.onSaved(s)'));
 assert.match(save,/if\(MAHJONG_CLOUD_SYNC_ENABLED\)/);
});
test('logout resets bridge and cannot leave stale active session',()=>{
 assert.match(html,/if\(!session\)mahjongCloudSyncBridge\.reset\(\)/);
});

test('cloud-enabled mode refuses local score persistence without an active writer lease',()=>{
 assert.match(html,/function save\(\)\{\s*if\(MAHJONG_CLOUD_SYNC_ENABLED&&!mahjongCloudSyncBridge\.status\(\)\.canWrite\)/);
 assert.match(html,/function canKeepScore\(\)\{return \(mahjongIsAdmin\|\|mahjongRole==='scorekeeper'\)&&\(!MAHJONG_CLOUD_SYNC_ENABLED\|\|mahjongCloudSyncBridge\.status\(\)\.canWrite===true\)/);
});

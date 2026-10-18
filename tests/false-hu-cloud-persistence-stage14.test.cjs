const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function section(from,to){const a=html.indexOf('function '+from+'(');const b=html.indexOf('function '+to+'(',a+1);assert.ok(a>=0&&b>a);return html.slice(a,b)}
test('False Hu correction persists through common save and rolls back state on save refusal',()=>{
 const code=section('applyFalseHuCorrection','saveFalseHuCorrection');
 assert.match(code,/if\(!save\(\)\)\{s=JSON\.parse\(snapshot\)/);
 assert.match(code,/if\(!save\(\)\)[\s\S]*return false/);
});
test('Cloud save rejects read-only session and failed queue before success',()=>{
 const code=section('save','patternOptions');
 assert.match(code,/MAHJONG_CLOUD_SYNC_ENABLED&&!mahjongCloudSyncBridge\.status\(\)\.canWrite/);
 assert.match(code,/mahjongCloudSyncBridge\.onSaved\(s\)/);
 assert.match(code,/if\(!mahjongCloudSyncBridge\.status\(\)\.canWrite\)/);
 assert.ok(code.indexOf('mahjongSavedState=')>code.indexOf('mahjongCloudSyncBridge.onSaved(s)'));
});

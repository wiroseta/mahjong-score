const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
test('record restores score and full history if durable save or sync enqueue fails',()=>{
 const fn=html.slice(html.indexOf('function record(){'),html.indexOf('let scoreToastTimer=null;'));
 assert.match(fn,/const preRecordSnapshot=JSON\.stringify\(s\)/);
 assert.match(fn,/if\(!save\(\)\)\s*\{[\s\S]*?s=JSON\.parse\(preRecordSnapshot\);[\s\S]*?return;/);
 assert.ok(fn.indexOf('if(!save())')<fn.indexOf('showScoreToast()'));
 assert.ok(fn.indexOf('if(!save())')<fn.indexOf('voiceCorrectionAfterRecord('));
});

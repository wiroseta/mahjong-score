const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('cancelled False Hu audit is visible in score history',()=>{
 const section=html.slice(html.indexOf('function history(){'),html.indexOf('function renderAllPlayers(){'));
 assert.match(section,/falseHuCorrectionAudit/);
 assert.match(section,/Audit pembatalan False Hu/);
 assert.match(section,/originalOffender/);
});
test('edited False Hu audit count is visible in score history',()=>{
 const section=html.slice(html.indexOf('function history(){'),html.indexOf('function renderAllPlayers(){'));
 assert.match(section,/falseHuCorrectionLog/);
 assert.match(section,/Dikoreksi/);
});

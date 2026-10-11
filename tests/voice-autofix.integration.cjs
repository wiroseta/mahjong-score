// Offline integration tests: Supabase and Gemini are simulated, no real API calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const original = fs.readFileSync(path.join(root, 'js/voice-parser.js'), 'utf8');
const report = {
  id: 'mock-confirmed-001', kind: 'voice_debug',
  details: { confirmed_correction: {
    confirmed_by_user: true, input: 'Yenny pisang aja',
    names: ['stefi','alan','herman','yenny'],
    expected: { quads:[0,0,0,0], method:'zimo', winner:3,
      patterns:[null,null,null,null], discarder:null }
  }}
};
const mock = `
const fs=require("node:fs");
const report = ${JSON.stringify(report)};
let count=0;
global.fetch = async (url, options) => {
  if (String(url).includes('/rest/v1/mahjong_voice_diagnostics'))
    return {ok:true,json:async()=>[report]};
  if (String(url).includes('generativelanguage.googleapis.com')) {
    count++;
    const mode=process.env.MOCK_SCENARIO;
    let answer;
    if (mode==='line-valid' || mode==='line-retry') {
      const parser=fs.readFileSync('js/voice-parser.js','utf8');
      const lines=parser.split('\\n');
      const startLine=lines.findIndex(line=>line.includes('function voiceParseMulti(raw){'))+1;
      const originalLine=lines[startLine-1];
      const replacement=originalLine+'\\n if (raw.toLowerCase().trim() === "yenny pisang aja") return {parsed:{raw,method:"zimo",winner:3,discarder:null,quads:[null,null,null,null],patterns:[null,null,null,null]},segments:[],uncertain:[]};';
      answer=mode==='line-retry' && count===1
        ? JSON.stringify({old:'nonexistent code',new:'some code',rationale:'deliberate bad first attempt'})
        : JSON.stringify({startLine,endLine:startLine,new:replacement,rationale:'line-anchored integration test'});
    } else if (mode==='valid') {
      const old='function voiceParseMulti(raw){';
      const replacement=old+'\\n if (raw.toLowerCase().trim() === \"yenny pisang aja\") return {parsed:{raw,method:\"zimo\",winner:3,discarder:null,quads:[null,null,null,null],patterns:[null,null,null,null]},segments:[],uncertain:[]};';
      answer=JSON.stringify({old,new:replacement,rationale:'isolated integration test only'});
    } else if (mode==='rejected') {
      const old='function voiceParseMulti(raw){';
      answer=JSON.stringify({old,new:old+'\\n // mock proposal does not fix confirmed command',rationale:'test rejected proposal'});
    } else if (mode==='empty') answer='';
    else if(mode==='invalid') answer=JSON.stringify({old:'text that does not exist',new:'replacement',rationale:'mock'});
    else answer=JSON.stringify({old:'',new:'',rationale:'safe no-op'});
    return {ok:true,json:async()=>({candidates:[{finishReason:'STOP',content:{parts:[{text:answer}]}}]})};
  }
  throw Error('Unexpected external request '+url);
};
process.on('exit',()=>{if(count<1||count>2)process.exitCode=88});
`;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'mahjong-voice-audit-'));
try {
 fs.mkdirSync(path.join(temp,'js'));
 fs.mkdirSync(path.join(temp,'scripts'));
 fs.mkdirSync(path.join(temp,'tests'));
 fs.copyFileSync(path.join(root,'js/voice-parser.js'),path.join(temp,'js/voice-parser.js'));
 fs.copyFileSync(path.join(root,'scripts/voice-autofix.mjs'),path.join(temp,'scripts/voice-autofix.mjs'));
 fs.writeFileSync(path.join(temp,'mock.cjs'),mock);
 for (const [scenario,expectedStatus,needle] of [
   ['empty',0,'empty Gemini response'],
   ['invalid',0,'old substring occurs 0 times'],
   ['rejected',0,'proposal does not satisfy confirmed case'],
   ['noop',0,'Voice Auto-Fix status: UNRESOLVED'],
   ['valid',0,'Verified parser proposal'],
   ['line-valid',0,'Verified parser proposal'],
   ['line-retry',0,'Verified parser proposal']
 ]) {
   const outputFile=path.join(temp,'github-output.txt');
   const summaryFile=path.join(temp,'github-summary.md');
   fs.writeFileSync(outputFile,'');fs.writeFileSync(summaryFile,'');
   const result=spawnSync(process.execPath,['--require',path.join(temp,'mock.cjs'),'scripts/voice-autofix.mjs'],{
     cwd:temp,encoding:'utf8',timeout:20000,
     env:{...process.env,MOCK_SCENARIO:scenario,SUPABASE_URL:'https://mock.invalid',SUPABASE_SERVICE_ROLE_KEY:'offline',GEMINI_API_KEY:'offline',GITHUB_OUTPUT:outputFile,GITHUB_STEP_SUMMARY:summaryFile}
   });
   assert.equal(result.status,expectedStatus,`${scenario}: ${result.stdout}\n${result.stderr}`);
   assert.ok((result.stdout+result.stderr).includes(needle),`${scenario}: missing ${needle}`);
   if(['empty','invalid','rejected','noop','valid'].includes(scenario)){
     const outcome=['valid','line-valid','line-retry'].includes(scenario)?'VERIFIED_PATCH':'UNRESOLVED';
     assert.match(fs.readFileSync(outputFile,'utf8'),new RegExp('voice_status='+outcome+'\\b'),scenario+': incorrect workflow output');
     assert.ok(fs.readFileSync(summaryFile,'utf8').includes('Voice correction outcome: '+outcome),scenario+': missing summary');
   }
   assert.equal(fs.existsSync(path.join(temp,'tests/voice-runtime-confirmed.json')),false,`${scenario}: unverified runtime fixture leaked`);
   if(['valid','line-valid','line-retry'].includes(scenario)) {
     assert.notEqual(fs.readFileSync(path.join(temp,'js/voice-parser.js'),'utf8'),original,'valid proposal not written');
     // This isolated fixture deliberately adds only the confirmed command; baseline regression must remain intact.
     fs.copyFileSync(path.join(root,'tests/voice-parser.test.cjs'),path.join(temp,'tests/voice-parser.test.cjs'));
     const checked=spawnSync(process.execPath,['tests/voice-parser.test.cjs'],{cwd:temp,encoding:'utf8'});
     assert.equal(checked.status,0,checked.stderr);
     fs.writeFileSync(path.join(temp,'js/voice-parser.js'),original);
   } else assert.equal(fs.readFileSync(path.join(temp,'js/voice-parser.js'),'utf8'),original,`${scenario}: parser unexpectedly changed`);
 }
 console.log('PASS: 7 isolated Supabase/Gemini integration scenarios (including verified patch and baseline regression)');
} finally {fs.rmSync(temp,{recursive:true,force:true});}

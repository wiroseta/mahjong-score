const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function part(a,b){let i=html.indexOf('function '+a+'('),j=html.indexOf('function '+b+'(',i);assert(i>=0&&j>i);return html.slice(i,j)}
const helper=part('rebaseNewerHistoryBefore','saveScoreEdit');
const score=helper+part('saveScoreEdit','deleteQuad');
const quad=helper+part('deleteQuad','undo');
function run(type,saved,legacy=false){const s={names:['A','B','C','D'],scores:[20,-8,-6,-6],history:[{method:'zimo',winner:0,before:legacy?undefined:[5,-3,-1,-1],delta:[15,-5,-5,-5]},{method:type==='quad'?'quad':'hu',winner:0,before:[0,0,0,0],delta:[5,-3,-1,-1]}]};const original=structuredClone(s);const ctx={s,editHistoryIndex:1,editMethod:'zimo',getEditPatterns:()=>[null,null,null,null],getEditQuads:()=>[0,0,0,0],mahjongStorageReady:()=>true,$:()=>({value:'1'}),save:()=>saved,closeScoreEdit:()=>{},render:()=>{},confirm:()=>true,console:{warn:()=>{}}};vm.createContext(ctx);vm.runInContext((type==='quad'?quad+'\ndeleteQuad(1)':score+'\nsaveScoreEdit()'),ctx);return {state:JSON.parse(JSON.stringify(ctx.s)),original:JSON.parse(JSON.stringify(original))}}
test('old score edit rebases newer before',()=>{const r=run('edit',true);assert.deepEqual(r.state.history[0].before,[15,-5,-5,-5]);assert.deepEqual(r.state.scores,[30,-10,-10,-10])});
test('old score edit save failure rolls back rebasing',()=>{const r=run('edit',false);assert.deepEqual(r.state,r.original)});
test('old quad deletion rebases newer before',()=>{const r=run('quad',true);assert.deepEqual(r.state.history[0].before,[0,0,0,0]);assert.deepEqual(r.state.scores,[15,-5,-5,-5])});
test('old quad deletion save failure rolls back rebasing',()=>{const r=run('quad',false);assert.deepEqual(r.state,r.original)});
test('legacy missing newer before blocks score edit',()=>{const r=run('edit',true,true);assert.deepEqual(r.state,r.original)});
test('legacy missing newer before blocks quad deletion',()=>{const r=run('quad',true,true);assert.deepEqual(r.state,r.original)});

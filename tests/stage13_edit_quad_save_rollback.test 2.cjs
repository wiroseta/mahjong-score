const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function extract(name,next){const a=html.indexOf('function '+name+'('),b=html.indexOf('function '+next+'(',a);assert.ok(a>=0&&b>a);return html.slice(a,b)}
const rebaseSource=extract('rebaseNewerHistoryBefore','saveScoreEdit');
const scoreSource=rebaseSource+'\n'+extract('saveScoreEdit','deleteQuad');
const quadSource=rebaseSource+'\n'+extract('deleteQuad','undo');
function fixture(){return {scores:[7,-3,-2,-2],names:['A','B','C','D'],history:[{method:'hu',winner:0,before:[-1,3,-1,-1],delta:[7,-3,-2,-2],quads:[0,0,0,0],patterns:[]},{method:'quad',winner:1,delta:[-1,3,-1,-1]}]}}
function scoreRun(saved){const original=fixture();const ctx={s:structuredClone(original),mahjongStorageReady:()=>true,editHistoryIndex:0,getEditPatterns:()=>[null,null,null,null],editMethod:'zimo',getEditQuads:()=>[0,0,0,0],$:()=>({value:'1'}),save:()=>saved,closeScoreEdit:()=>ctx.closed++,render:()=>ctx.renders++,closed:0,renders:0,console:{warn:()=>{}}};vm.createContext(ctx);vm.runInContext(scoreSource+'\nsaveScoreEdit()',ctx);return {original,state:JSON.parse(JSON.stringify(ctx.s)),closed:ctx.closed,renders:ctx.renders}}
function quadRun(saved){const original=fixture();const ctx={s:structuredClone(original),mahjongStorageReady:()=>true,confirm:()=>true,save:()=>saved,render:()=>ctx.renders++,renders:0,console:{warn:()=>{}}};vm.createContext(ctx);vm.runInContext(quadSource+'\ndeleteQuad(1)',ctx);return {original,state:JSON.parse(JSON.stringify(ctx.s)),renders:ctx.renders}}
test('Score edit rolls back complete state on save failure',()=>{const r=scoreRun(false);assert.deepEqual(r.state,r.original);assert.equal(r.closed,0)});
test('Score edit persists new result on save success',()=>{const r=scoreRun(true);assert.notDeepEqual(r.state,r.original);assert.equal(r.closed,1)});
test('Quad deletion rolls back complete state on save failure',()=>{const r=quadRun(false);assert.deepEqual(r.state,r.original)});
test('Quad deletion persists on save success',()=>{const r=quadRun(true);assert.equal(r.state.history.length,1);assert.deepEqual(r.state.scores,[8,-6,-1,-1])});

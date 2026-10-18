const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('Pattern PDF exports every application combination without undefined globals',async()=>{
 const drawn=[], pages=[];
 const ctx=new Proxy({measureText:t=>({width:t.length*10}),fillText:t=>drawn.push(t)}, {get:(o,k)=>k in o?o[k]:()=>{}});
 const sandbox={document:{createElement:()=>({getContext:()=>ctx})},Image:class{set src(v){queueMicrotask(()=>this.onload())}},queueMicrotask};
 vm.createContext(sandbox);
 const source=html.slice(html.indexOf('const pats='),html.indexOf('const $='))+
 html.slice(html.indexOf('const TILE_IMAGES='),html.indexOf('function renderMahjongTiles'))+
 html.slice(html.indexOf('function pdfWrap('),html.indexOf('async function shareRulesGuidePDF'));
 vm.runInContext(source,sandbox);
 sandbox.canvasesToPDF=x=>{pages.push(...x);return 'exported'};
 assert.equal(await vm.runInContext('buildPatternGuidePDF()',sandbox),'exported');
 const names=vm.runInContext('pats.map(p=>p[0])',sandbox);
 for(let i=0;i<names.length;i++)assert.ok(drawn.includes((i+1)+'. '+names[i]),names[i]);
 assert.equal(names.length,22);
 assert.ok(pages.length>1);
});

const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('js/voice-parser.js','utf8');
function parse(input,names=['Andi','Yenny','Ferry','Ari']){
 const ctx={s:{names,dealer:0,seatWinds:[0,1,2,3]},pats:[['Set Mulia',2],['Pinhu',1]],console};
 vm.createContext(ctx);vm.runInContext(source,ctx,{timeout:1000});
 return JSON.parse(JSON.stringify(vm.runInContext(`voiceParseMulti(${JSON.stringify(input)}).parsed`,ctx,{timeout:1000})));
}
const cases=[
 ['Andi HU dari Yenny',{method:'hu',winner:0,discarder:1}],
 ['Andi Huda Yeni',{method:'hu',winner:0,discarder:1}],
 ['Andi Zi Mo',{method:'zimo',winner:0}],
 ['Ferry Quad satu',{quads:[null,null,1,null]}],
 ['Ari Quad satu',{quads:[null,null,null,1]}],
 ['Andi Set Mulia',{patterns:[0,null,null,null]}],
 ['Andi HU dari Yenny Ferry Quad satu Ari Quad satu Andi Set Mulia',{method:'hu',winner:0,discarder:1,quads:[null,null,1,1],patterns:[0,null,null,null]}],
];
for(const [input,expected] of cases){const result=parse(input);for(const [k,v] of Object.entries(expected))assert.deepEqual(result[k],v,`${input}: ${k}`)}
// Additional verified cases may be committed by maintainers. Never automatically turn Gemini guesses into expected results.
for(const path of ['tests/voice-confirmed.json','tests/voice-runtime-confirmed.json'])if(fs.existsSync(path))for(const c of JSON.parse(fs.readFileSync(path,'utf8'))){const r=parse(c.input,c.names);for(const [k,v] of Object.entries(c.expected))assert.deepEqual(r[k],v,`${c.input}: ${k}`)}
console.log(`PASS: ${cases.length} baseline cases + confirmed fixtures`);

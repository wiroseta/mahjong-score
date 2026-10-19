const test=require('node:test'),assert=require('node:assert/strict'),L=require('../tile-reader/reference-learning.js');
const v=Array.from({length:L.length},(_,i)=>i%24<8?20:220),other=v.map(x=>255-x);
test('flat, malformed and nonfinite descriptors are rejected',()=>{for(const x of [[],Array(576).fill(255),Array(576).fill(NaN),Array(576).fill(256),null])assert.equal(L.normalize(x),null);});
test('only active standard tile examples enter the bank',()=>{const bank=L.prepare([{label:'north',features:v,active:true},{label:'west',features:v,active:false},{label:'unknown',features:v,active:true}]);assert.equal(bank.length,1);});
test('an exact visual match can identify a corrected tile independently of ONNX label',()=>{const bank=L.prepare([{label:'north',features:v,active:true},{label:'west',features:other,active:true}]);assert.equal(L.match(v,bank).label,'north');});
test('conflicting labels for the same appearance never override model output',()=>assert.equal(L.match(v,L.prepare([{label:'north',features:v,active:true},{label:'west',features:v,active:true}])),null));
test('dissimilar and ambiguous examples do not produce a correction',()=>{assert.equal(L.match(v,L.prepare([{label:'north',features:other,active:true}])),null);assert.equal(L.match(v,[]),null);});
test('matching does not mutate source descriptors or bank',()=>{const raw=[{label:'north',features:v,active:true}],before=JSON.stringify(raw);L.match(v,L.prepare(raw));assert.equal(JSON.stringify(raw),before);});

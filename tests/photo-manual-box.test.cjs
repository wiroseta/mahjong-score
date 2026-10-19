const test=require('node:test'),assert=require('node:assert/strict'),M=require('../tile-reader/manual-box.js');
const opts={width:1600,height:650};
test('manual missed tile rectangle is copied without inventing a class',()=>{const b=[680,350,792,504],r=M.validate(b,opts);assert.deepEqual(r,b);assert.notEqual(r,b)});
test('a neighboring missed tile can be added next to a detection',()=>assert.deepEqual(M.validate([210,100,310,250],{...opts,boxes:[[100,100,200,250]]}),[210,100,310,250]));
test('duplicate or contained tile boxes are rejected',()=>{for(const b of [[100,100,200,250],[110,110,190,240],[90,90,210,260]])assert.throws(()=>M.validate(b,{...opts,boxes:[[100,100,200,250]]}),/bertumpuk/)});
test('out of image, nonfinite, reversed and tiny boxes are rejected',()=>{for(const b of [[-1,0,20,20],[0,0,1601,650],[20,20,10,10],[0,0,2,2],[0,NaN,20,20]])assert.throws(()=>M.validate(b,opts))});
test('manual boxes must stay inside selected player area',()=>assert.throws(()=>M.validate([100,100,200,250],{...opts,region:[300,0,1600,650]}),/area/));
test('a manual addition cannot exceed the 26 tile limit',()=>assert.throws(()=>M.validate([100,100,200,250],{...opts,boxes:Array(26).fill([0,0,10,10])}),/26/));

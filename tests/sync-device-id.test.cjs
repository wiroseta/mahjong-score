const test=require('node:test');
const assert=require('node:assert/strict');
const {getOrCreate,KEY}=require('../js/sync-device-id.js');
const uuid='0dff7724-6623-4c15-9e3e-999bf09d2348';
function storage(){const m=new Map();return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,v),m}}
test('persists a stable device ID across repeated sessions',()=>{const s=storage();let calls=0;const c={randomUUID(){calls++;return uuid}};assert.equal(getOrCreate(s,c),uuid);assert.equal(getOrCreate(s,c),uuid);assert.equal(calls,1)});
test('does not overwrite invalid existing identifier',()=>{const s=storage();s.setItem(KEY,'invalid');assert.throws(()=>getOrCreate(s,{randomUUID:()=>uuid}),/Invalid existing/);assert.equal(s.getItem(KEY),'invalid')});
test('fails closed when storage cannot persist',()=>{const s={getItem:()=>null,setItem:()=>{throw Error('quota')}};assert.throws(()=>getOrCreate(s,{randomUUID:()=>uuid}),/persistence failed/)});
test('requires secure random UUID',()=>{assert.throws(()=>getOrCreate(storage(),{}),/Secure device/)});
test('fails closed on unreadable storage',()=>{assert.throws(()=>getOrCreate({getItem(){throw Error('denied')},setItem(){}},{randomUUID:()=>uuid}),/unreadable/)});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const game={names:['Pemain 1','Pemain 2','Pemain 3','Pemain 4'],scores:[0,0,0,0],dealer:0,round:1,roundWind:0,initialEast:0,history:[],seatWinds:[0,3,2,1],seatDirection:'counterclockwise-v2'};
test('fixture matches actual application default state',()=>{for(const key of Object.keys(game))assert.match(html,new RegExp(key+':'));assert.deepEqual(MahjongSyncEngine.validateGame(game),game)});
test('reject invalid wind assignments without changing caller state',()=>{const bad={...game,seatWinds:[0,0,2,1]};assert.throws(()=>MahjongSyncEngine.validateGame(bad),/seat winds/);assert.deepEqual(game.seatWinds,[0,3,2,1])});
test('reject malformed history and round wind',()=>{assert.throws(()=>MahjongSyncEngine.validateGame({...game,history:[null]}),/history entry/);assert.throws(()=>MahjongSyncEngine.validateGame({...game,roundWind:4}),/round wind/)});
test('reject UTF-8 oversized history even when JavaScript UTF-16 length is under limit',()=>{
 const unicodeGame={...game,history:[{note:'界'.repeat(680000)}]};
 assert.ok(JSON.stringify(unicodeGame).length<2000000);
 assert.throws(()=>MahjongSyncEngine.validateGame(unicodeGame),/safe size/);
});

test('preserve realistic Hu, Zi Mo, Quad, patterns, and historical seat metadata in a cloud snapshot',()=>{
 const snapshot={...game,names:['Andi','Yenny','Ferry','Ari'],scores:[7,-2,-3,-2],round:3,dealer:1,roundWind:1,seatWinds:[3,0,1,2],history:[
  {method:'hu',winner:0,discarder:1,round:1,each:1,patterns:['Pong'],delta:[1,-1,0,0],namesAtTime:['Andi','Yenny','Ferry','Ari'],time:'10:01'},
  {method:'quad',winner:2,discarder:null,round:2,delta:[-1,-1,3,-1],namesAtTime:['Andi','Yenny','Ferry','Ari'],time:'10:02'},
  {method:'zimo',winner:0,discarder:null,round:3,each:2,patterns:['Full Flush'],delta:[6,-2,-2,-2],time:'10:03'}
 ]};
 assert.deepEqual(MahjongSyncEngine.validateGame(snapshot),snapshot);
 assert.deepEqual(snapshot.history.map(x=>x.method),['hu','quad','zimo']);
});

test('reject malformed history entries while preserving original source data',()=>{
 const invalid={...game,history:[{method:'quad'},null]};
 assert.throws(()=>MahjongSyncEngine.validateGame(invalid),/history entry/);
 assert.equal(invalid.history[1],null);
});

test('realistic multi-round score snapshot survives JSON serialization without losing Mahjong history',()=>{
 const source={...game,names:['Andi','Yenny','Ferry','Ari'],scores:[5,-3,1,-3],round:4,dealer:2,roundWind:1,initialEast:0,seatWinds:[2,1,0,3],history:[
  {method:'hu',winner:0,discarder:1,round:1,each:1,patterns:['Pong'],delta:[1,-1,0,0],namesAtTime:['Andi','Yenny','Ferry','Ari']},
  {method:'quad',winner:2,discarder:null,round:2,delta:[-1,-1,3,-1]},
  {method:'zimo',winner:0,discarder:null,round:3,each:2,patterns:['Full Flush'],delta:[6,-2,-2,-2]}
 ]};
 const serialized=JSON.stringify(MahjongSyncEngine.validateGame(source));
 const restored=MahjongSyncEngine.validateGame(JSON.parse(serialized));
 assert.deepEqual(restored,source);
 assert.equal(restored.history.length,3);
 assert.deepEqual(restored.history.map(h=>h.method),['hu','quad','zimo']);
 assert.deepEqual(restored.seatWinds,[2,1,0,3]);
});

test('full recorded hand payload retains actual application history fields through cloud validation',()=>{
 const hand={winner:1,method:'zimo',discarder:null,total:12,quads:[0,1,0,0],extra:0,
  playerPatterns:[null,{name:'Set Mulia',points:2},null,null],patternName:null,patternPoints:0,
  each:5,delta:[-6,18,-6,-6],patterns:['Yenny: Set Mulia (2)','Yenny 1 Quad'],
  before:[0,0,0,0],dealer:0,round:1,roundWind:0,seatWindsBefore:[0,3,2,1],
  namesAtTime:['Andi','Yenny','Ferry','Ari'],hand:1,time:'12/10/2026, 11.45.00'};
 const snapshot={...game,names:['Andi','Yenny','Ferry','Ari'],scores:[-6,18,-6,-6],history:[hand]};
 const output=MahjongSyncEngine.validateGame(snapshot);
 assert.deepEqual(output,snapshot);
 assert.deepEqual(JSON.parse(JSON.stringify(output)).history[0],hand);
});

test('reject corrupt scoring vectors and quad counts inside recorded hands',()=>{
 for(const entry of [
  {method:'hu',delta:[1,-1,0]},
  {method:'quad',quads:[0,5,0,0]},
  {method:'zimo',before:[0,0,0,1.5]},
  {method:'hu',winner:7},
  {method:'hu',patterns:['Pong',null]},
  {method:'hu',namesAtTime:['Andi','Yenny']}
 ])assert.throws(()=>MahjongSyncEngine.validateGame({...game,history:[entry]}),/Invalid history/);
});

test('complete recorded-hand recovery preserves optional combination and quad metadata',()=>{
 const entry={winner:3,method:'hu',discarder:1,total:3900,quads:[1,0,2,0],extra:3,
  playerPatterns:[{name:'All Pungs',points:2},null,{name:'Mixed Suit',points:1},null],
  patternName:'All Pungs',patternPoints:2,each:8,delta:[-8,-8,-8,24],
  patterns:['All Pungs','Quad bonus'],before:[20,0,-10,-10],dealer:2,
  round:9,roundWind:2,seatWindsBefore:[2,1,0,3],namesAtTime:['Andi','Yenny','Ferry','Ari'],
  hand:17,time:'12/10/2026, 12.00.00',legacyCustomField:{points:[1,2,3]}};
 const snapshot={...game,round:9,dealer:3,history:[entry]};
 const validated=MahjongSyncEngine.validateGame(snapshot);
 assert.deepEqual(JSON.parse(JSON.stringify(validated)),snapshot);
 assert.deepEqual(validated.history[0].legacyCustomField,entry.legacyCustomField);
});

test('reject non-finite nested history metadata rather than silently replacing it with null',()=>{
 const snapshot={...game,history:[{method:'quad',legacyCustomField:{bonus:Infinity}}]};
 assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Non-finite/);
 assert.equal(snapshot.history[0].legacyCustomField.bonus,Infinity);
});


test('reject silently discarded nested history metadata and preserve source',()=>{
 for(const value of [undefined,()=>1,Symbol('legacy'),123n]){
  const snapshot={...game,history:[{method:'quad',legacyCustomField:{bonus:value}}]};
  assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Unserializable game value/);
  assert.equal(snapshot.history[0].legacyCustomField.bonus,value);
 }
});


test('reject corrupt historical wind snapshot without modifying original game',()=>{
 for(const seatWindsBefore of [[0,0,2,3],[0,1,2],[0,1,2,4],[0,1,2,1.5]]){
  const snapshot={...game,history:[{method:'hu',seatWindsBefore}]};
  assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Invalid history seatWindsBefore/);
  assert.deepEqual(snapshot.history[0].seatWindsBefore,seatWindsBefore);
 }
});


test('reject historical player names exceeding the server-side 100-character limit',()=>{
 const snapshot={...game,history:[{method:'hu',namesAtTime:['A'.repeat(101),'Yenny','Ferry','Ari']}]};
 assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Invalid history names/);
 assert.equal(snapshot.history[0].namesAtTime[0].length,101);
});


test('reject malformed player-specific combinations without losing the source history',()=>{
 for(const patterns of [
  [{name:'Pong',points:2}],
  [null,{name:'Pong',points:1.5},null,null],
  [null,{name:'Pong',points:'2'},null,null],
  [null,{name:'Pong',points:2},null,{}],
  [null,{name:'Pong',points:2},null,[]]
 ]){
  const snapshot={...game,history:[{method:'zimo',playerPatterns:patterns}]};
  assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Invalid history playerPatterns/);
  assert.deepEqual(snapshot.history[0].playerPatterns,patterns);
 }
});

test('reject Unicode NUL and unpaired surrogates in historical metadata keys and values',()=>{
 for(const invalid of ['\u0000','\uD800','\uDC00']){
  for(const entry of [{note:invalid},{[invalid]:'legacy'}]){
   const snapshot={...game,history:[entry]};
   assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Invalid Unicode/);
   assert.deepEqual(snapshot.history[0],entry);
  }
 }
});

test('accept valid supplementary Unicode characters in historical metadata',()=>{
 const entry={method:'quad',note:'🀄 麻將', '🀄':{text:'𠮷'}};
 const snapshot={...game,history:[entry]};
 assert.deepEqual(MahjongSyncEngine.validateGame(snapshot),snapshot);
});

test('reject non-JSON legacy objects rather than silently erasing history',()=>{
 for(const value of [new Date('2026-10-12T00:00:00Z'),new Map([['quad',2]]),new Set([1,2])]){
  const snapshot={...game,history:[{method:'quad',legacy:value}]};
  assert.throws(()=>MahjongSyncEngine.validateGame(snapshot),/Non-JSON/);
  assert.equal(snapshot.history[0].legacy,value);
 }
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const html=fs.readFileSync(__dirname+'/../index.html','utf8');
const game={names:['Andi','Yenny','Ferry','Ari'],scores:[8,-4,-2,-2],dealer:0,round:1,roundWind:0,seatWinds:[0,3,2,1],history:[{winner:0,method:'zi',discarder:null,total:8,quads:[1,0,0,0],extra:0,playerPatterns:[{name:'清一色',points:4},null,null,null],patternName:null,patternPoints:0,each:2,delta:[8,-4,-2,-2],patterns:['Andi: 清一色 (4)','Andi 1 Quad'],before:[0,0,0,0],dealer:1,round:1,roundWind:0,seatWindsBefore:[3,0,1,2],namesAtTime:['Andi','Yenny','Ferry','Ari'],hand:1,time:'12/10/2026, 12.00.00'}]};
test('real recorded hand fields in app are preserved by sync validation',()=>{
 for(const field of ['winner','method','discarder','total','quads','extra','playerPatterns','patternName','patternPoints','each','delta','patterns','before','dealer','round','roundWind','seatWindsBefore','namesAtTime','hand','time'])assert.match(html,new RegExp('\\b'+field+'(?:,|:)'));
 assert.deepEqual(MahjongSyncEngine.validateGame(game),game);
 assert.deepEqual(JSON.parse(JSON.stringify(MahjongSyncEngine.validateGame(game))),game);
});

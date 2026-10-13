const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source=html.match(/function undo\(\)\{[\s\S]*?\n\}/)?.[0];
assert.ok(source,'Real undo function must be extractable');
function run(game, saved=true, ready=true){
 const ctx={s:structuredClone(game),mahjongStorageReady:()=>ready,save:()=>saved,render:()=>ctx.renders++,renders:0,console:{warn:()=>{}}};
 vm.createContext(ctx);vm.runInContext(source+'\nundo()',ctx);return {state:JSON.parse(JSON.stringify(ctx.s)),renders:ctx.renders};
}
const entry={before:[0,0,0,0],dealer:1,round:2,roundWind:0,seatWindsBefore:[1,2,3,0],method:'hu'};
const game={scores:[7,-3,-2,-2],dealer:0,round:3,roundWind:1,seatWinds:[0,1,2,3],history:[entry,{before:[1,1,-1,-1],dealer:2,round:1}]};
test('Undo restores scores, dealer, round, and winds and keeps older history',()=>{
 const {state}=run(game);assert.deepEqual(state.scores,[0,0,0,0]);assert.equal(state.dealer,1);assert.equal(state.round,2);assert.equal(state.roundWind,0);assert.deepEqual(state.seatWinds,[1,2,3,0]);assert.equal(state.history.length,1);
});
test('Undo failed save restores entire state',()=>assert.deepEqual(run(game,false).state,game));
test('Undo missing before does not change state',()=>{const g=structuredClone(game);delete g.history[0].before;assert.deepEqual(run(g).state,g)});
test('Undo malformed before does not change state',()=>{const g=structuredClone(game);g.history[0].before=[1,2,3];assert.deepEqual(run(g).state,g)});
test('Undo missing dealer does not change state',()=>{const g=structuredClone(game);delete g.history[0].dealer;assert.deepEqual(run(g).state,g)});
test('Undo not ready does not change state',()=>assert.deepEqual(run(game,true,false).state,game));
test('Undo empty history does not change state',()=>{const g={...game,history:[]};assert.deepEqual(run(g).state,g)});

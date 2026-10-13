const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const sql=fs.readFileSync(__dirname+'/../supabase_sync_rpc_draft.sql','utf8');
const base={names:['Andi','Yenny','Ferry','Ari'],scores:[0,0,0,0],history:[],dealer:0,round:1,seatWinds:[0,3,2,1]};

test('optional history player indexes accept null, but never invalid values',()=>{
 for(const field of ['winner','dealer','discarder']){
  assert.deepEqual(MahjongSyncEngine.validateGame({...base,history:[{[field]:null}]}).history,[{[field]:null}]);
  for(const bad of [-1,4,1.5,'0',false])assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{[field]:bad}]}),/Invalid history/);
  assert.match(sql,new RegExp("x \\? '"+field+"' AND x->'"+field+"'<>'null'::jsonb"));
 }
});

test('history unknown fields survive JSON roundtrip while malformed known vectors are rejected',()=>{
 const entry={method:'hu',winner:0,discarder:1,delta:[1,-1,0,0],quads:[0,1,0,0],seatWindsBefore:[0,3,2,1],legacy:{nested:['保持','data']}};
 const game={...base,history:[entry]};
 assert.deepEqual(JSON.parse(JSON.stringify(MahjongSyncEngine.validateGame(game))),game);
 for(const bad of [[0,0,0,0,0],[0,0,0,5],[0,0,0,1.1]])assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{...entry,quads:bad}]}),/Invalid history/);
});


test('reject history metadata that JSON would silently transform',()=>{
 const game={names:['Andi','Yenny','Ferry','Ari'],scores:[0,0,0,0],history:[{method:'quad',extra:{when:new Date('2026-10-12T00:00:00Z')}}],dealer:0,round:1};
 assert.throws(()=>MahjongSyncEngine.validateGame(game),/Non-JSON game object/);
 game.history[0].extra={tags:new Set(['quad'])};
 assert.throws(()=>MahjongSyncEngine.validateGame(game),/Non-JSON game object/);
});


test('reject sparse history metadata arrays and non-index array properties before JSON snapshot',()=>{
 const sparse=['quad', , 'hu'];
 assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{legacy:{tags:sparse}}]}),/Sparse game array/);
 const tags=['quad'];tags.comment='lost in JSON';
 assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{legacy:{tags}}]}),/Non-JSON array property/);
});


test('reject malformed Unicode before Supabase jsonb conversion while retaining valid emoji',()=>{
 const bad='\uD800';
 for(const entry of [{method:bad},{legacy:{note:bad}},{patterns:['valid',bad]}]){
  assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[entry]}),/Unicode surrogate/);
 }
 assert.throws(()=>MahjongSyncEngine.validateGame({...base,names:['Andi',bad,'Ferry','Ari']}),/Unicode surrogate/);
 const valid={...base,history:[{legacy:{note:'🀄 Mahjong 🀄'}}]};
 assert.deepEqual(MahjongSyncEngine.validateGame(valid),valid);
});


test('reject unpaired Unicode surrogates in nested history object keys',()=>{
 const badKey='\uD800';
 const bad={...base,history:[{legacy:{[badKey]:'value'}}]};
 assert.throws(()=>MahjongSyncEngine.validateGame(bad),/Unicode surrogate/);
 const valid={...base,history:[{legacy:{'🀄':'value'}}]};
 assert.deepEqual(MahjongSyncEngine.validateGame(valid),valid);
});


test('Unicode name limits count code points like PostgreSQL length, not UTF-16 units',()=>{
 const base={names:['Andi','Yenny','Ferry','Ari'],scores:[0,0,0,0],history:[],dealer:0,round:1};
 const emoji='😀'.repeat(80);
 assert.doesNotThrow(()=>MahjongSyncEngine.validateGame({...base,names:[emoji,'Yenny','Ferry','Ari']}));
 assert.throws(()=>MahjongSyncEngine.validateGame({...base,names:['😀'.repeat(101),'Yenny','Ferry','Ari']}),/Invalid players/);
 assert.doesNotThrow(()=>MahjongSyncEngine.validateGame({...base,history:[{namesAtTime:[emoji,'Yenny','Ferry','Ari'],playerPatterns:[{name:emoji,points:1},null,null,null]}]}));
 assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{namesAtTime:['😀'.repeat(101),'Yenny','Ferry','Ari']}]}),/Invalid history names/);
});


test('reject PostgreSQL-incompatible Unicode NUL in values and object keys',()=>{
 const nul='\u0000';
 for(const game of [
  {...base,names:['Andi'+nul,'Yenny','Ferry','Ari']},
  {...base,history:[{method:'hu',legacy:{note:'score'+nul}}]},
  {...base,history:[{legacy:{['key'+nul]:42}}]}
 ])assert.throws(()=>MahjongSyncEngine.validateGame(game),/Unicode NUL/);
 assert.deepEqual(MahjongSyncEngine.validateGame(base),base);
});

 test("structural comparison preserves JSON keys named __proto__",()=>{
  const a=JSON.parse('{"history":[{"__proto__":{"note":"A"}}]}');
  const b=JSON.parse('{"history":[{"__proto__":{"note":"B"}}]}');
  assert.equal(MahjongSyncEngine.sameGame(a,b),false);
  assert.equal(MahjongSyncEngine.sameGame(a,JSON.parse(JSON.stringify(a))),true);
 });


test('PostgreSQL jsonb spacing cannot push near-limit compact JSON over 2MB',()=>{
 const huge={...base,history:[{legacy:{note:'x'.repeat(1999800)}}]};
 assert.doesNotThrow(()=>MahjongSyncEngine.validateGame(huge));
 const dense={...base,history:[{legacy:{values:Array(800000).fill(0)}}]};
 assert.throws(()=>MahjongSyncEngine.validateGame(dense),/Game exceeds safe size/);
});


test('historical round wind matches actual saved hand format and rejects invalid winds',()=>{
 const entry={method:'hu',roundWind:2,seatWindsBefore:[0,3,2,1],namesAtTime:['Andi','Yenny','Ferry','Ari']};
 assert.deepEqual(MahjongSyncEngine.validateGame({...base,history:[entry]}).history,[entry]);
 for(const bad of [-1,4,1.5,'2',null])
  assert.throws(()=>MahjongSyncEngine.validateGame({...base,history:[{...entry,roundWind:bad}]}),/Invalid history roundWind/);
 assert.match(sql,/x \? 'roundWind'.*x->>'roundWind' !~ '\^\[0-3\]\$'/);
});

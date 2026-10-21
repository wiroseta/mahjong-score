const test=require('node:test'),assert=require('node:assert/strict'),R=require('../js/photo-rules.js');
const g=(kind,tiles,exposure='open')=>({kind,tiles:tiles.split(' '),exposure});
const run=(groups,isWinner=false,seat=0)=>R.suggest({groups},{isWinner,seat});
test('all concealed tiles including declared concealed Kong are excluded',()=>{
 const r=run([g('pong','east east east'),g('kong','dot5 dot5 dot5 dot5','concealed'),g('kong','bam2 bam2 bam2 bam2','declared_concealed_kong'),g('pong','red red red','concealed')]);
 assert.equal(r.kongCount,0);assert.equal(r.ignored,3);assert.deepEqual(r.candidates,['Set Mulia']);
});
test('undeclared concealed Kong alone does not count for nonwinner',()=>assert.throws(()=>run([g('kong','dot5 dot5 dot5 dot5','concealed')]),/Tidak ada/));
test('concealed unknown tiles do not block nonwinner exposed groups',()=>assert.equal(run([g('pong','east east east'),g('loose','unknown unknown','concealed')]).ignored,1));
test('declared concealed Kong with unreadable faces is excluded',()=>assert.throws(()=>run([g('kong','unknown unknown unknown unknown','declared_concealed_kong')]),/Tidak ada/));
test('joker cannot replace a tile in Pong or Kong',()=>{for(const tiles of ['dot5 dot5 red','dot5 dot5 dot5 red'])assert.throws(()=>run([g(tiles.split(' ').length===3?'pong':'kong',tiles)]),/belum pasti|Susunan/);});
test('natural red dragon Kong counts as a Kong',()=>assert.equal(run([g('kong','red red red red')]).kongCount,1));
test('joker sequence permitted only concealed',()=>{assert.equal(R.validGroup(g('chow','char1 char2 red','concealed')),true);assert.equal(R.validGroup(g('chow','char1 char2 red')),false);assert.equal(R.validGroup(g('chow','char1 red red','concealed')),true);});
test('mixed suits and invalid sequences rejected',()=>{for(const tiles of ['char1 dot2 char3','char1 char1 char2','char1 char2 char5'])assert.equal(R.validGroup(g('chow',tiles)),false);});
test('seat wind honors only matching seat',()=>{assert.deepEqual(run([g('pong','east east east')],false,0).candidates,['Set Mulia']);assert.deepEqual(run([g('pong','east east east')],false,1).candidates,[]);});
test('three dragons can be counted for an exposed nonwinner',()=>assert.ok(run(['red','green','white'].map(t=>g('pong',`${t} ${t} ${t}`))).candidates.includes('Nantaboga (3 Naga Besar)')));
test('nonwinner cannot use concealed dragon group to complete three dragons',()=>assert.ok(!run([g('pong','red red red'),g('pong','green green green'),g('pong','white white white','concealed')]).candidates.includes('Nantaboga (3 Naga Besar)')));
test('full hand pattern never inferred from partial nonwinner photo',()=>assert.ok(!run([g('chow','dot1 dot2 dot3'),g('chow','dot4 dot5 dot6')]).candidates.includes('Serupa Murni (Satu Warna)')));
test('winner full grouped flush can be suggested',()=>{const groups=[g('chow','dot1 dot2 dot3'),g('chow','dot3 dot4 dot5'),g('chow','dot5 dot6 dot7'),g('chow','dot7 dot8 dot9'),g('pair','dot2 dot2')];assert.ok(run(groups,true).candidates.includes('Serupa Murni (Satu Warna)'));assert.ok(!run(groups,false).candidates.includes('Serupa Murni (Satu Warna)'));});
test('arbitrary and oversized model data rejected',()=>{assert.throws(()=>R.validate({groups:[]}),/Kelompok/);assert.throws(()=>run([g('pong','script script script')]),/Hasil/);assert.throws(()=>run([g('pong','east east east'),g('pong','east east east')]),/empat/);assert.throws(()=>run([g('pong','east east east','declared_concealed_kong')]),/Status/);});
test('suggestions do not mutate observations',()=>{const data={groups:[g('kong','dot5 dot5 dot5 dot5')]},before=JSON.stringify(data);run(data.groups);assert.equal(JSON.stringify(data),before);});

test('unassigned visible tiles cannot silently become a scoring suggestion',()=>assert.throws(()=>run([g('pong','east east east'),g('loose','dot3')],true),/belum dikelompokkan/));
test('uncertain eligible group blocks application even if its tiles form a Kong',()=>assert.throws(()=>run([{...g('kong','dot5 dot5 dot5 dot5'),uncertain:true}]),/belum pasti/));
test('uncertain concealed nonwinner tiles remain ignored',()=>assert.equal(run([g('kong','dot5 dot5 dot5 dot5'),{...g('loose','unknown','concealed'),uncertain:true}]).kongCount,1));
test('a photo containing more than four exposed sets is rejected',()=>assert.throws(()=>run(['dot1','dot2','dot3','dot4','dot5'].map(t=>g('pong',`${t} ${t} ${t}`))),/satu pemain/));

test('winner also excludes every concealed group and cannot infer full-hand bonus from them',()=>{const groups=[g('kong','dot5 dot5 dot5 dot5'),g('pong','east east east','concealed'),g('kong','bam2 bam2 bam2 bam2','declared_concealed_kong')];const result=run(groups,true);assert.equal(result.kongCount,1);assert.equal(result.ignored,2);assert.equal(result.complete,false);assert.ok(!result.candidates.includes('Set Mulia'));});

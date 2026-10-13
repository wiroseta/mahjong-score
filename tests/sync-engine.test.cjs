const test=require('node:test'),assert=require('node:assert/strict');
const {MahjongSyncEngine}=require('../js/sync-engine.js');
const sample=()=>({names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1});
function store(){const d=new Map();return {getItem:k=>d.has(k)?d.get(k):null,setItem:(k,v)=>d.set(k,v),removeItem:k=>d.delete(k)}}
function engine(api,storage=store()){return MahjongSyncEngine.create({api,storage,accountId:'user-a',deviceId:'device-a',now:()=>42})}
test('rejects invalid or non-finite scores and invalid history',()=>{
 for(const g of [{...sample(),scores:[0,NaN,0,0]},{...sample(),history:'invalid'},{...sample(),dealer:9}])assert.throws(()=>MahjongSyncEngine.validateGame(g));
});
test('activation backs up existing local game before accepting cloud',async()=>{
 const local=sample();local.scores[0]=100;const remote=sample();remote.scores[0]=5;
 const e=engine({open:async()=>({ok:true,gameId:'game-a',revision:2,generation:1,writerToken:'secret',canWrite:true,game:remote})});
 await assert.rejects(e.activate(local),/explicit reconciliation/);assert.equal(e.backups()[0].game.scores[0],100);
});
test('offline network failure persists score queue, later flush commits',async()=>{
 let offline=true;const e=engine({open:async()=>({ok:true,gameId:'game-a',revision:2,generation:1,writerToken:'secret',canWrite:true,game:sample()}),commit:async()=>{if(offline)throw Error('offline');return {ok:true,revision:3}}});
 await e.activate(sample());const changed=sample();changed.scores[0]=10;assert.equal((await e.push(changed)).reason,'network-error');assert.equal(e.status().pending,1);offline=false;assert.equal((await e.flush()).ok,true);assert.equal(e.status().pending,0);
});
test('conflicting write never overwrites local data or silently clears queue',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'game-a',revision:4,generation:1,writerToken:'secret',canWrite:true,game:sample()}),commit:async()=>({ok:false,reason:'revision-conflict'})});
 await e.activate(sample());const changed=sample();changed.scores[0]=200;assert.equal((await e.push(changed)).reason,'revision-conflict');assert.equal(e.status().pending,1);assert.equal(e.backups().at(-1).game.scores[0],200);
});
test('read-only session cannot write or enqueue new data',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'game-a',revision:1,generation:1,canWrite:false,game:sample()}),commit:async()=>{throw Error('Must not call commit')}});
 await e.activate(sample());assert.equal((await e.push(sample())).reason,'no-writer');assert.equal(e.status().pending,0);
});
test('backup and pending keys are scoped by account and device',()=>{
 const storage=store(),api={};const a=MahjongSyncEngine.create({api,storage,accountId:'a',deviceId:'one'});const b=MahjongSyncEngine.create({api,storage,accountId:'b',deviceId:'one'});a.backup(sample(),'test');assert.equal(a.backups().length,1);assert.equal(b.backups().length,0);
});
test('simultaneous flushes do not issue duplicate revision writes',async()=>{
 let commits=0,release;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{commits++;await gate;return {ok:true,revision:1}}});
 await e.activate(sample());e.enqueue(sample());
 const first=e.flush(),second=e.flush();release();
 assert.equal((await first).ok,true);assert.equal((await second).ok,true);assert.equal(commits,1);
});
test('edits queued during network commit survive successful response',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{await gate;return {ok:true,revision:1}}});
 await e.activate(sample());const first=sample();first.scores[0]=1;e.enqueue(first);
 const pending=e.flush();await Promise.resolve();const later=sample();later.scores[0]=2;e.enqueue(later);release();
 assert.equal((await pending).pending,1);assert.equal(e.status().pending,1);
});

test('new activation refuses to mask offline changes awaiting reconciliation',async()=>{
 let calls=0;const api={open:async()=>{calls++;return {ok:true,gameId:'g',revision:1,canWrite:true,generation:1,writerToken:'token',game:sample()}}};
 const e=engine(api);await e.activate(sample());const offline=sample();offline.scores[0]=777;e.enqueue(offline);
 await assert.rejects(e.activate(sample()),/Pending local edits/);
 assert.equal(calls,1);assert.equal(e.status().pending,1);
});

test('flush retains newly enqueued entries even if queue length changes',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 const storage=store(),e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{await gate;return {ok:true,revision:1}}},storage);
 await e.activate(sample());e.enqueue(sample());const pending=e.flush();await Promise.resolve();
 // A concurrent component removes the old entry and queues a fresh edit.
 for(const k of ['mahjong_sync_v1:user-a:device-a:queue'])storage.removeItem(k);
 const fresh=sample();fresh.scores[0]=987;e.enqueue(fresh);release();
 await pending;assert.equal(e.status().pending,1);
});

test('commit carries generation from server lease',async()=>{
 let received;const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:7,writerToken:'secret',canWrite:true,game:sample()}),commit:async p=>{received=p;return {ok:true,revision:1}}});
 await e.activate(sample());await e.push(sample());assert.equal(received.generation,7);
});
test('activation rejects missing generation from RPC',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,writerToken:'secret',canWrite:true,game:sample()})});
 await assert.rejects(e.activate(sample()),/Invalid cloud response/);
});

test('activation refuses cloud snapshot if local edits arrive while RPC is pending',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>{await gate;return {ok:true,gameId:'g',revision:1,generation:1,writerToken:'secret',canWrite:true,game:sample()}}});
 const activation=e.activate(sample());await Promise.resolve();
 const changed=sample();changed.scores[0]=999;e.enqueue(changed);release();
 await assert.rejects(activation,/Local edits arrived/);
 assert.equal(e.status().pending,1);assert.equal(e.status().state,'conflict');
 assert.equal(e.backups()[0].reason,'before-cloud-activation');
});

test('activation refuses to silently replace distinct local score with cloud',async()=>{
 const local=sample();local.scores[0]=42;const remote=sample();remote.scores[0]=43;
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'token',canWrite:true,game:remote})});
 await assert.rejects(e.activate(local),/explicit reconciliation/);
 assert.equal(e.status().state,'conflict');
 assert.equal(e.backups().at(-1).game.scores[0],42);
});
test('activation refuses writer lease without server-issued token',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,canWrite:true,game:sample()})});
 await assert.rejects(e.activate(sample()),/Invalid cloud response/);
});

test('revision zero cannot silently overwrite a different local game',async()=>{
 const local=sample(),remote=sample();remote.scores[0]=99;
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:remote})});
 await assert.rejects(e.activate(local),/explicit reconciliation/);
 assert.equal(e.status().state,'conflict');
 assert.deepEqual(e.backups()[0].game,local);
});


test('revision conflict freezes all further writes until explicit reconciliation',async()=>{
 let commits=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'secret',canWrite:true,game:sample()}),commit:async()=>{commits++;return {ok:false,reason:'revision-conflict'}}});
 await e.activate(sample());const changed=sample();changed.scores[0]=25;assert.equal((await e.push(changed)).reason,'revision-conflict');
 changed.scores[0]=50;assert.equal((await e.push(changed)).reason,'reconciliation-required');
 assert.equal((await e.flush()).reason,'reconciliation-required');assert.equal(commits,1);assert.equal(e.status().pending,2);
});
test('writer revocation freezes subsequent writes and retains all queued changes',async()=>{
 let commits=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'secret',canWrite:true,game:sample()}),commit:async()=>{commits++;return {ok:false,reason:'writer-revoked'}}});
 await e.activate(sample());assert.equal((await e.push(sample())).reason,'writer-revoked');
 assert.equal((await e.push(sample())).reason,'reconciliation-required');assert.equal(commits,1);assert.equal(e.status().pending,2);
});


test('parallel activations cannot create competing server leases',async()=>{
 let release,calls=0;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>{calls++;await gate;return {ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}}});
 const first=e.activate(sample());
 await assert.rejects(e.activate(sample()),/already in progress/);
 release();await first;assert.equal(calls,1);
});
test('a queued edit cannot be sent during activation before lease is accepted',async()=>{
 let release,commits=0;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>{await gate;return {ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}},commit:async()=>{commits++;return {ok:true,revision:1}}});
 const first=e.activate(sample());
 const edited=sample();edited.scores[0]=50;
 assert.equal((await e.push(edited)).reason,'activation-in-progress');
 assert.equal(e.status().pending,1);release();
 await assert.rejects(first,/Local edits arrived/);assert.equal(commits,0);
});
test('new activation cannot overlap a network commit',async()=>{
 let release;const gate=new Promise(resolve=>release=resolve);
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{await gate;return {ok:true,revision:1}}});
 await e.activate(sample());e.enqueue(sample());const inFlight=e.flush();
 await assert.rejects(e.activate(sample()),/pending commit/);release();await inFlight;
});


test('Supabase permission denial freezes writes and preserves queued score',async()=>{
 let calls=0;
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;throw {code:'42501',message:'writer lease revoked'}}});
 await e.activate(sample());const changed=sample();changed.scores[0]=321;
 assert.equal((await e.push(changed)).reason,'authorization-rejected');
 assert.equal((await e.flush()).reason,'reconciliation-required');
 assert.equal(calls,1);assert.equal(e.status().pending,1);
 assert.equal(e.backups().at(-1).game.scores[0],321);
});
test('temporary Supabase transport errors remain retryable',async()=>{
 let calls=0;
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;if(calls===1)throw {code:'PGRST000'};return {ok:true,revision:2}}});
 await e.activate(sample());assert.equal((await e.push(sample())).reason,'network-error');
 assert.equal((await e.flush()).ok,true);assert.equal(e.status().pending,0);
});

test('corrupt persistent queue blocks activation without contacting server',async()=>{
 const storage=store();storage.setItem('mahjong_sync_v1:user-a:device-a:queue','{broken');let calls=0;
 const e=engine({open:async()=>{calls++;throw Error('unexpected server call')}},storage);
 await assert.rejects(e.activate(sample()),/storage corrupted/);assert.equal(calls,0);
 assert.equal(storage.getItem('mahjong_sync_v1:user-a:device-a:queue'),'{broken');
});
test('queue with wrong JSON type is never overwritten',()=>{
 const storage=store();storage.setItem('mahjong_sync_v1:user-a:device-a:queue','{"invalid":true}');
 const e=engine({},storage);assert.throws(()=>e.enqueue(sample()),/queue corrupted/);
 assert.equal(storage.getItem('mahjong_sync_v1:user-a:device-a:queue'),'{"invalid":true}');
});


test('failed reactivation invalidates previous writer lease before another score can be sent',async()=>{
 let fail=false,commits=0;
 const api={open:async()=>{if(fail)throw Error('server unavailable');return {ok:true,gameId:'g',revision:1,generation:1,writerToken:'old-token',canWrite:true,game:sample()}},commit:async()=>{commits++;return {ok:true,revision:2}}};
 const e=engine(api);await e.activate(sample());fail=true;
 await assert.rejects(e.activate(sample()),/server unavailable/);
 assert.equal((await e.push(sample())).reason,'no-writer');
 assert.equal(commits,0);assert.equal(e.status().pending,1);
});

test('conflicting reactivation cannot reuse earlier writer token',async()=>{
 let different=false,commits=0;
 const api={open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'token',canWrite:true,game:different?{...sample(),scores:[2,0,0,0]}:sample()}),commit:async()=>{commits++;return {ok:true,revision:2}}};
 const e=engine(api);await e.activate(sample());different=true;
 await assert.rejects(e.activate(sample()),/explicit reconciliation/);
 assert.equal((await e.push(sample())).reason,'reconciliation-required');
 assert.equal(commits,0);
});

for(const reason of ['authorization-rejected','session-revoked','account-inactive']){
 test('server response '+reason+' freezes subsequent commits',async()=>{
  let calls=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;return {ok:false,reason}}});
  await e.activate(sample());const changed=sample();changed.scores[0]=17;
  assert.equal((await e.push(changed)).reason,reason);
  assert.equal((await e.flush()).reason,'reconciliation-required');
  assert.equal(e.status().pending,1);assert.equal(calls,1);
  assert.equal(e.backups().at(-1).game.scores[0],17);
 });
}


test('recovery export preserves offline scores and excludes session secrets',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'private-token',canWrite:true,game:sample()}),commit:async()=>{throw Error('offline')}});
 await e.activate(sample());const changed=sample();changed.scores[0]=48;await e.push(changed);
 const recovery=e.exportRecovery();
 assert.equal(recovery.format,'mahjong-sync-recovery-v1');
 assert.equal(recovery.pending[0].game.scores[0],48);
 assert.equal(recovery.backups.length,1);
 assert.equal(JSON.stringify(recovery).includes('private-token'),false);
 recovery.pending[0].game.scores[0]=999;assert.equal(e.exportRecovery().pending[0].game.scores[0],48);
});
test('recovery export fails closed when backup entries are corrupted',()=>{
 const storage=store();storage.setItem('mahjong_sync_v1:user-a:device-a:backups',JSON.stringify([{id:'x',game:{}}]));
 assert.throws(()=>engine({},storage).exportRecovery(),/Invalid players/);
});


test('unexpected successful revision freezes writes rather than retrying an ambiguous commit',async()=>{
 let calls=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:4,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;return {ok:true,revision:99}}});
 await e.activate(sample());const changed=sample();changed.scores[0]=15;
 assert.equal((await e.push(changed)).reason,'invalid-server-revision');
 assert.equal((await e.flush()).reason,'reconciliation-required');
 assert.equal(calls,1);assert.equal(e.status().pending,1);
 assert.equal(e.backups().at(-1).game.scores[0],15);
});

// Corrupted pending snapshots must never reach a privileged server RPC.
test('flush refuses malformed queued snapshots before network write',async()=>{
 const storage=store();let calls=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;return {ok:true,revision:1}}},storage);
 await e.activate(sample());
 storage.setItem('mahjong_sync_v1:user-a:device-a:queue',JSON.stringify([{id:'bad',at:1,game:{...sample(),scores:[0,'invalid',0,0]}}]));
 await assert.rejects(e.flush(),/Invalid scores/);assert.equal(calls,0);assert.equal(e.status().pending,1);
});
test('flush refuses duplicate pending IDs to prevent dropping unsent edits',async()=>{
 const storage=store();let calls=0;const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{calls++;return {ok:true,revision:1}}},storage);
 await e.activate(sample());storage.setItem('mahjong_sync_v1:user-a:device-a:queue',JSON.stringify([{id:'same',at:1,game:sample()},{id:'same',at:2,game:sample()}]));
 await assert.rejects(e.flush(),/Duplicate pending sync IDs/);assert.equal(calls,0);assert.equal(e.status().pending,2);
});

test('acknowledged RPC with local queue cleanup failure must never retry network commit',async()=>{
 const base=store();let fail=false,commits=0;
 const storage={getItem:k=>base.getItem(k),setItem:(k,v)=>base.setItem(k,v),removeItem:k=>{if(fail&&k.endsWith(':queue'))throw Error('disk denied');base.removeItem(k)}};
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{commits++;return {ok:true,revision:1}}},storage);
 await e.activate(sample());e.enqueue(sample());fail=true;
 await assert.rejects(e.flush(),/Post-commit local persistence failed/);
 assert.equal(e.status().state,'conflict');
 assert.equal((await e.flush()).reason,'reconciliation-required');
 assert.equal(commits,1);
});

test('activation rejects ambiguous write permission and never grants a writer',async()=>{
 for(const canWrite of [undefined,'false',1,null]){
  const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,canWrite,writerToken:'secret',game:sample()})});
  await assert.rejects(e.activate(sample()),/Invalid cloud response/);
  assert.equal(e.status().state,'uninitialized');
 }
});
test('activation rejects a writer token attached to read-only lease',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,canWrite:false,writerToken:'unexpected',game:sample()})});
 await assert.rejects(e.activate(sample()),/Invalid cloud response/);
 assert.equal((await e.push(sample())).reason,'no-writer');
});


test('concurrent score edits queued during network commit are drained',async()=>{
 let releaseFirst,commitCalls=0;
 const firstGate=new Promise(resolve=>{releaseFirst=resolve});
 const e=engine({
  open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),
  commit:async ({baseRevision})=>{commitCalls++;if(commitCalls===1)await firstGate;return {ok:true,revision:baseRevision+1}}
 });
 await e.activate(sample());
 const a=sample();a.scores[0]=1;const b=sample();b.scores[0]=2;
 const p1=e.push(a);
 await new Promise(resolve=>setImmediate(resolve));
 const p2=e.push(b);
 releaseFirst();
 const [r1,r2]=await Promise.all([p1,p2]);
 assert.equal(r1.ok,true);assert.equal(r2.ok,true);
 assert.equal(e.status().pending,0);assert.equal(e.status().revision,2);assert.equal(commitCalls,2);
});

test('new device without a local game can adopt complete cloud game',async()=>{
 const remote=sample();remote.scores[2]=125;remote.history=[{round:1,score:125}];let sent;
 const e=engine({peek:async()=>({ok:true,gameId:'cloud-game',revision:9}),open:async payload=>{sent=payload;return {ok:true,gameId:'cloud-game',revision:9,generation:2,writerToken:'secret',canWrite:true,game:remote}}});
 const result=await e.activate(null);assert.equal(sent.localGame,null);assert.deepEqual(result.game,remote);assert.equal(e.backups().length,0);assert.equal(e.status().revision,9);
});
test('new device without local game does not invent an empty game when cloud is absent',async()=>{
 const e=engine({peek:async()=>({ok:false,reason:'no-cloud-game'}),open:async()=>{throw Error('Must not open')}});
 await assert.rejects(e.activate(null),/No cloud game and no initial local game/);assert.equal(e.status().state,'uninitialized');
});

test('cloud preflight mismatch is a terminal conflict and does not retry takeover',async()=>{
 let calls=0;
 const e=engine({open:async()=>{calls++;return {ok:false,reason:'local-cloud-mismatch',revision:5}}});
 await assert.rejects(e.activate(sample()),/reconciliation: local-cloud-mismatch/);
 assert.equal(e.status().state,'conflict');
 assert.equal(calls,1);
 assert.equal(e.backups().length,1);
});
test('cloud revision change during takeover is a terminal conflict',async()=>{
 const e=engine({peek:async()=>({ok:true,gameId:"cloud-game-1",revision:2}),open:async()=>({ok:false,reason:'cloud-revision-changed',revision:3})});
 await assert.rejects(e.activate(null),/cloud-revision-changed/);
 assert.equal(e.status().state,'conflict');
});


test('client rejects fractional and unsafe scores before any network write',async()=>{
 let commits=0;
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:0,generation:1,writerToken:'token',canWrite:true,game:sample()}),commit:async()=>{commits++;return {ok:true,revision:1}}});
 await e.activate(sample());
 for(const value of [0.5,-1.5,Number.MAX_SAFE_INTEGER,1000000000000]){
  const invalid=sample();invalid.scores[0]=value;
  await assert.rejects(e.push(invalid),/Invalid scores/);
 }
 assert.equal(commits,0);assert.equal(e.status().pending,0);
});


test('read-only push preserves pre-existing recovery queue without adding a new edit',async()=>{
 const storage=store();
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,canWrite:false,game:sample()}),commit:async()=>{throw Error('Unexpected commit')}},storage);
 await e.activate(sample());
 const changed=sample();changed.scores[0]=7;
 assert.deepEqual(await e.push(changed),{ok:false,reason:'no-writer'});
 assert.equal(e.status().pending,0);
});



test('Supabase jsonb key reordering does not create a false game conflict',async()=>{
 const local=sample();local.extra={z:1,a:{y:2,x:3}};
 const remote={extra:{a:{x:3,y:2},z:1},round:1,dealer:0,history:[],scores:[0,0,0,0],names:['A','B','C','D']};
 assert.equal(MahjongSyncEngine.sameGame(local,remote),true);
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:3,generation:1,writerToken:'token',canWrite:true,game:remote})});
 assert.equal((await e.activate(local)).canWrite,true);
});
test('structural comparison still detects score and array order changes',()=>{
 const first=sample(),differentScore=sample(),differentPlayers=sample();
 differentScore.scores[0]=1;differentPlayers.names.reverse();
 assert.equal(MahjongSyncEngine.sameGame(first,differentScore),false);
 assert.equal(MahjongSyncEngine.sameGame(first,differentPlayers),false);
});


test('round count must be a bounded safe integer, matching server SQL',()=>{
 const valid={names:['A','B','C','D'],scores:[0,0,0,0],history:[],dealer:0,round:1};
 for(const round of [Number.MAX_SAFE_INTEGER,1e100,1.5,0,-1]){
  assert.throws(()=>MahjongSyncEngine.validateGame({...valid,round}),/Invalid round/);
 }
 assert.doesNotThrow(()=>MahjongSyncEngine.validateGame({...valid,round:999999999999999}));
});


test('lease polling transport failure revokes local writer without losing pending data',async()=>{
 const e=engine({open:async()=>({ok:true,gameId:'g',revision:1,generation:1,writerToken:'token',canWrite:true,game:sample()}),leaseStatus:async()=>{throw Error('connection lost')},commit:async()=>{throw Error('must not commit')}});
 await e.activate(sample());
 const result=await e.checkLease();
 assert.equal(result.reason,'lease-check-unverified');
 assert.equal(e.status().state,'conflict');
 assert.equal((await e.push(sample())).ok,false);
});

test('late lease rejection from an earlier activation cannot revoke a replacement writer',async()=>{
 let resolveOld;
 const e=engine({
  open:async()=>({ok:true,gameId:'game-a',revision:1,generation:1,writerToken:'new-token',canWrite:true,game:sample()}),
  leaseStatus:()=>new Promise(resolve=>{resolveOld=resolve;})
 });
 await e.activate(sample());
 const oldCheck=e.checkLease();
 await e.activate(sample());
 resolveOld({ok:false,reason:'session-revoked'});
 assert.equal((await oldCheck).reason,'lease-superseded');
 assert.equal(e.status().state,'ready');
});

test('late lease network error from an earlier activation cannot revoke a replacement writer',async()=>{
 let rejectOld;
 const e=engine({
  open:async()=>({ok:true,gameId:'game-a',revision:1,generation:1,writerToken:'new-token',canWrite:true,game:sample()}),
  leaseStatus:()=>new Promise((_,reject)=>{rejectOld=reject;})
 });
 await e.activate(sample());
 const oldCheck=e.checkLease();
 await e.activate(sample());
 rejectOld(Error('old connection dropped'));
 assert.equal((await oldCheck).reason,'lease-superseded');
 assert.equal(e.status().state,'ready');
});


test('lease poll refuses a newer cloud revision without discarding local recovery data',async()=>{
 const storage=store();
 const e=engine({
  open:async()=>({ok:true,gameId:'g',revision:2,generation:1,writerToken:'token',canWrite:true,game:sample()}),
  leaseStatus:async()=>({ok:true,gameId:'g',revision:3,canWrite:true}),
  commit:async()=>{throw Error('stale writer must not commit')}
 },storage);
 await e.activate(sample());
 const result=await e.checkLease();
 assert.equal(result.ok,false);
 assert.equal(result.reason,'lease-game-mismatch');
 assert.equal(e.status().state,'conflict');
 assert.equal((await e.push(sample())).ok,false);
});

test('new-device takeover preserves differing local game in recovery backup',async()=>{
 const remote=sample();remote.scores[0]=50;const local=sample();local.scores[0]=10;let sent;
 const e=engine({peek:async()=>({ok:true,gameId:'cloud-game',revision:7}),open:async payload=>{sent=payload;return {ok:true,gameId:'cloud-game',revision:7,generation:3,writerToken:'new-token',canWrite:true,game:remote}}});
 const result=await e.activate(local);
 assert.equal(sent.localGame,null);assert.equal(sent.expectedRevision,7);assert.equal(sent.expectedGameId,'cloud-game');
 assert.deepEqual(result.game,remote);assert.deepEqual(e.backups()[0].game,local);
});
test('first game bootstraps only when peek confirms cloud is absent',async()=>{
 const local=sample();let sent;
 const e=engine({peek:async()=>({ok:false,reason:'no-cloud-game'}),open:async payload=>{sent=payload;return {ok:true,gameId:'created',revision:0,generation:1,writerToken:'new-token',canWrite:true,game:local}}});
 const result=await e.activate(local);assert.deepEqual(sent.localGame,local);assert.equal(result.canWrite,true);
});

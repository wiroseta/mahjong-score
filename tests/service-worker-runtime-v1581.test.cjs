const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const code=fs.readFileSync(require('node:path').join(__dirname,'../sw.js'),'utf8');
function setup(){
 const handlers={},puts=[],deleted=[],added=[],cache={addAll:async a=>added.push(...a),put:async(...a)=>puts.push(a)};
 const api={open:async()=>cache,keys:async()=>['mahjong-score-v15-8','mahjong-score-v15-8-1','mahjong-score-v15-8-1-r2','mahjong-score-v15-8-1-r3','mahjong-score-v15-8-1-r4','mahjong-score-v15-8-1-r5','mahjong-score-v15-8-1-r6','mahjong-score-v15-8-1-r7','other-app'],delete:async k=>deleted.push(k),match:async()=>undefined};
 const scope={URL,Set,self:{location:new URL('https://example.test/mahjong-score/sw.js'),clients:{claim:async()=>{}},addEventListener:(n,f)=>handlers[n]=f},caches:api,fetch:async()=>({ok:true,clone:()=>({copy:true})})};
 vm.createContext(scope);vm.runInContext(code,scope);return {handlers,puts,deleted,added,scope};
}
test('service worker bypasses Supabase, non-GET and live/transfer query requests',()=>{
 const {handlers}=setup();for(const [url,method] of [['https://project.supabase.co/rest/v1/games','GET'],['https://example.test/mahjong-score/index.html','POST'],['https://example.test/mahjong-score/?live=private','GET'],['https://example.test/mahjong-score/not-an-asset','GET']]){
 let handled=false;handlers.fetch({request:{url,method},respondWith:()=>handled=true});assert.equal(handled,false,url);
 }
});
test('new cache precaches all application assets and removes only older Mahjong caches',async()=>{
 const {handlers,deleted,added}=setup();let p;handlers.install({waitUntil:x=>p=x});await p;assert.ok(added.includes('./index.html'));handlers.activate({waitUntil:x=>p=x});await p;assert.deepEqual(deleted,['mahjong-score-v15-8','mahjong-score-v15-8-1','mahjong-score-v15-8-1-r2','mahjong-score-v15-8-1-r3','mahjong-score-v15-8-1-r4','mahjong-score-v15-8-1-r5','mahjong-score-v15-8-1-r6','mahjong-score-v15-8-1-r7']);
});
test('successful static response caches; failed HTTP response does not replace offline copy',async()=>{
 const {handlers,puts,scope}=setup();const request={url:'https://example.test/mahjong-score/index.html',method:'GET'};let p;const waits=[];
 const event={request,respondWith:x=>p=x,waitUntil:x=>waits.push(x)};
 handlers.fetch(event);await p;await Promise.all(waits);assert.equal(puts.length,1);
 scope.fetch=async()=>({ok:false,status:500});handlers.fetch(event);assert.equal((await p).status,500);assert.equal(puts.length,1);
});
test('network failure serves cached public asset and propagates a cache miss',async()=>{
 const {handlers,scope}=setup();const offline=Error('offline');scope.fetch=async()=>{throw offline};let p;const event={request:{url:'https://example.test/mahjong-score/index.html',method:'GET'},respondWith:x=>p=x};
 scope.caches.match=async()=>({cached:true});handlers.fetch(event);assert.equal((await p).cached,true);
 scope.caches.match=async()=>undefined;handlers.fetch(event);await assert.rejects(p,/offline/);
});

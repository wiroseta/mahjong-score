const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
const {create}=require('../js/sync-supabase-adapter.js').MahjongSupabaseSyncAdapter;
test('reader enrollment cannot grant writer rights or writer token',()=>{
 const body=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('END; $$;')[0];
 assert.match(body,/is_writer=false/);
 assert.match(body,/'canWrite',false/);
 assert.doesNotMatch(body,/mahjong_sync_generate_token|SET is_writer=true|writer_session_id\s*=/);
 assert.match(body,/device-already-writer/);
});
test('reader enrollment is restricted to admin or enabled multi-device accounts',()=>{
 const body=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('END; $$;')[0];
 assert.match(body,/v_role<>'admin' AND NOT v_multi/);
 assert.match(body,/FROM auth\.users WHERE id=v_uid FOR UPDATE/);
 assert.match(body,/auth\.sessions/);
});
test('adapter uses separate reader RPC, never writer takeover',async()=>{
 const calls=[];
 const adapter=create({rpc:async(name,args)=>{calls.push({name,args});return {data:{ok:true,canWrite:false},error:null};}});
 assert.equal((await adapter.openReader({deviceId:'device-123'})).canWrite,false);
 assert.deepEqual(calls,[{name:'mahjong_sync_open_reader',args:{p_device_id:'device-123'}}]);
 assert.throws(()=>adapter.openReader({deviceId:''}),/Device ID required/);
});

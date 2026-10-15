const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_readonly_draft.sql'),'utf8');
const adapter=require('../js/sync-supabase-adapter.js').MahjongSupabaseSyncAdapter;
test('peek enforces JWT-bound active session and account status',()=>{
 assert.match(sql,/auth\.jwt\(\)->>'session_id'/);
 assert.match(sql,/FROM auth\.sessions/);
 assert.match(sql,/banned_until/);
 assert.match(sql,/deleted_at/);
});
test('peek only selects game state and never writes/revokes leases',()=>{
 assert.match(sql,/WHERE owner_id=v_uid AND is_current=true/);
 assert.doesNotMatch(sql,/\b(?:INSERT|UPDATE|DELETE|TRUNCATE)\s+(?:INTO\s+|FROM\s+)?public\./i);
 assert.doesNotMatch(sql,/mahjong_device_sessions/);
});
test('peek limits RPC execution to authenticated users',()=>{
 assert.match(sql,/REVOKE ALL ON FUNCTION public\.mahjong_sync_peek\(\) FROM PUBLIC,anon,authenticated/);
 assert.match(sql,/GRANT EXECUTE ON FUNCTION public\.mahjong_sync_peek\(\) TO authenticated/);
});
test('adapter exposes read-only peek without writer token',async()=>{
 let called;
 const transport=adapter.create({rpc:async(name,args)=>{called={name,args};return {data:{ok:true,hasGame:false},error:null}}});
 assert.deepEqual(await transport.peek(),{ok:true,hasGame:false});
 assert.deepEqual(called,{name:'mahjong_sync_peek',args:{}});
});

test('single-device scorekeeper old login cannot peek active game',()=>{
 assert.match(sql,/v_role='scorekeeper' AND NOT v_multi/);
 assert.match(sql,/\(newer\.created_at,newer\.id\)>\(current_auth\.created_at,current_auth\.id\)/);
 assert.match(sql,/Newer login session exists/);
});

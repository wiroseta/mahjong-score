const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(__dirname+'/../tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
const open=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit')[0];
const commit=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit')[1];
test('deployment intentionally blocked until real integration verification',()=>assert.match(sql,/^DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/m));
test('open and commit require valid matching Supabase Auth session',()=>{for(const part of [open,commit]){assert.match(part,/auth\.jwt\(\)->>'session_id'/);assert.match(part,/auth\.sessions WHERE id=v_auth_session AND user_id=v_uid/);}});
test('both endpoints reject banned or deleted accounts',()=>{assert.match(open,/v_deleted IS NOT NULL/);assert.match(open,/v_banned>now\(\)/);assert.match(commit,/deleted_at IS NULL/);assert.match(commit,/banned_until <= now\(\)/);});
test('write requires device token, generation and auth session binding',()=>{for(const expr of [/session_token_hash IS DISTINCT FROM encode\(extensions\.digest\(p_token,'sha256'\),'hex'\)/,/session_generation<>p_generation/,/auth_session_id IS DISTINCT FROM v_auth_session/,/writer_session_id IS DISTINCT FROM v_session\.id/])assert.match(commit,expr);});
test('conflicting updates preserve cloud state and record conflict',()=>{assert.match(commit,/INSERT INTO public\.mahjong_sync_conflicts/);assert.ok(commit.indexOf('INSERT INTO public.mahjong_sync_conflicts')<commit.indexOf('SET game_data=p_game'));});
test('takeover rotates token and increments generation',()=>{assert.match(open,/session_generation=public\.mahjong_device_sessions\.session_generation\+1/);assert.match(open,/session_token_hash=encode\(extensions\.digest\(v_token,'sha256'\),'hex'\)/);});
test('old and new sessions serialized via user row lock',()=>{assert.match(open,/FROM auth\.users WHERE id=v_uid FOR UPDATE/);assert.match(commit,/FOR UPDATE/);});

test('all six public RPC endpoints are search-path hardened and explicitly restricted',()=>{
 const endpoints={
  mahjong_sync_open:'uuid,jsonb,bigint,uuid',
  mahjong_sync_commit:'uuid,uuid,bigint,text,bigint,jsonb',
  mahjong_sync_open_reader:'uuid',
  mahjong_sync_peek:'',
  mahjong_sync_read:'uuid',
  mahjong_sync_lease_status:'uuid,bigint'
 };
 for(const [name,signature] of Object.entries(endpoints)){
  const declaration=sql.match(new RegExp(`CREATE OR REPLACE FUNCTION public\\.${name}\\(`,'g'))||[];
  assert.equal(declaration.length,1,`${name} must be defined once`);
  const body=sql.split(`CREATE OR REPLACE FUNCTION public.${name}(`)[1].split('END; $$;')[0];
  assert.match(body,/SECURITY DEFINER SET search_path = ''/,`${name} must pin search_path`);
  assert.match(body,/auth\.uid\(\)/,`${name} must identify caller`);
  assert.match(body,/auth\.sessions WHERE id=v_auth_session AND user_id=v_uid/,`${name} must check active auth session`);
  const escaped=signature.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  assert.match(sql,new RegExp(`REVOKE ALL ON FUNCTION public\\.${name}\\(${escaped}\\) FROM PUBLIC,anon,authenticated;`));
  assert.match(sql,new RegExp(`GRANT EXECUTE ON FUNCTION public\\.${name}\\(${escaped}\\) TO authenticated;`));
 }
});

test('older auth sessions cannot reclaim lease after newer auth session expires',()=>{
 assert.match(sql,/ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz/);
 assert.match(open,/SELECT created_at INTO v_auth_created_at FROM auth\.sessions/);
 assert.match(open,/prior\.auth_session_created_at,prior\.auth_session_id\)>\(v_auth_created_at,v_auth_session\)/);
 assert.match(open,/auth_session_created_at=v_auth_created_at/);
 assert.match(open,/A newer login previously took ownership/);
});

test('peek rejects displaced older auth sessions even after newer login expires',()=>{
 const peek=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_peek()')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_read(')[0];
 assert.match(peek,/prior\.auth_session_created_at,prior\.auth_session_id\)>/);
 assert.match(peek,/A newer login previously took ownership/);
});

test('reader enrollment updates auth-session high-water timestamp on reused device IDs',()=>{
 const reader=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader')[0];
 assert.match(reader,/SELECT created_at INTO v_auth_created_at FROM auth.sessions/);
 assert.match(reader,/VALUES\(v_uid,p_device_id,true,false,1,v_auth_session,v_auth_created_at,NULL,NULL\)/);
 assert.match(reader,/auth_session_id=v_auth_session,auth_session_created_at=v_auth_created_at/);
});

test('reader enrollment cannot overwrite newer Auth-session high-water mark with older session',()=>{
 const reader=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader')[0];
 assert.match(reader,/prior\.auth_session_created_at,prior\.auth_session_id\)>\(v_auth_created_at,v_auth_session\)/);
 assert.ok(reader.indexOf('prior.auth_session_created_at,prior.auth_session_id')<reader.indexOf('ON CONFLICT(user_id,device_id) DO UPDATE'));
 assert.match(reader,/RETURN jsonb_build_object\('ok',false,'reason','newer-login'\)/);
});


test('read and lease status reject displaced older login using persistent session high-water mark',()=>{
 for(const name of ['mahjong_sync_read','mahjong_sync_lease_status']){
  const body=sql.split(`CREATE OR REPLACE FUNCTION public.${name}(`)[1].split('END; $$;')[0];
  assert.match(body,/JOIN public\.mahjong_device_sessions prior ON prior\.user_id=v_uid/);
  assert.match(body,/prior\.auth_session_created_at,prior\.auth_session_id\)>\(current_auth\.created_at,v_auth_session\)/);
  assert.ok(body.indexOf('prior.auth_session_created_at,prior.auth_session_id')<body.indexOf('SELECT * INTO v_lease'));
 }
});


test('commit rejects displaced older login after newer auth session expires',()=>{
 const body=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[1].split('END; $$;')[0];
 assert.match(body,/JOIN public\.mahjong_device_sessions prior ON prior\.user_id=v_uid/);
 assert.match(body,/prior\.auth_session_created_at,prior\.auth_session_id\)>\(current_auth\.created_at,v_auth_session\)/);
 assert.ok(body.indexOf('prior.auth_session_created_at,prior.auth_session_id')<body.indexOf('SELECT * INTO v_game'));
});


test('writer open cannot downgrade newer recorded login on reused device in multi-device mode',()=>{
 const body=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[0];
 assert.match(body,/prior\.device_id=p_device_id/);
 assert.match(body,/prior\.auth_session_created_at,prior\.auth_session_id\)>\(v_auth_created_at,v_auth_session\)/);
 assert.ok(body.indexOf('prior.device_id=p_device_id')<body.indexOf('ON CONFLICT(user_id,device_id) DO UPDATE'));
});

test('reader enrollment cannot revoke an existing writer lease using its device ID',()=>{
 const reader=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('REVOKE ALL ON FUNCTION public.mahjong_sync_open_reader')[0];
 const guard=reader.indexOf("'device-already-writer'");
 const upsert=reader.indexOf('ON CONFLICT(user_id,device_id) DO UPDATE');
 assert.ok(guard>0 && upsert>guard,'writer-protection guard must precede reader upsert');
 assert.match(reader,/is_active AND is_writer\s+AND revoked_at IS NULL/);
 assert.match(reader,/session_token_hash=NULL/);
 assert.match(reader,/'canWrite',false/);
 assert.doesNotMatch(reader,/'writerToken'/);
});


test('open rejects negative preflight revisions before writer revocation',()=>{
 assert.match(open,/p_expected_revision IS NOT NULL AND p_expected_revision < 0/);
 assert.ok(open.indexOf("Expected revision must not be negative")<open.indexOf("UPDATE public.mahjong_device_sessions SET is_writer=false"));
});


test('existing cloud game requires explicit revision preflight before writer takeover',()=>{
 const guard=open.indexOf('IF FOUND AND (p_expected_game_id IS NULL OR p_expected_revision IS NULL)');
 const revoke=open.indexOf('UPDATE public.mahjong_device_sessions SET is_writer=false');
 assert.ok(guard>0 && guard<revoke,'preflight must run before revocation');
 assert.match(open.slice(guard,revoke),/reason','cloud-revision-changed'/);
});

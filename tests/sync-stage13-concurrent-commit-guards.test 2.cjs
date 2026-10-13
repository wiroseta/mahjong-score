'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
const start=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(');
const end=sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(',start);
assert.ok(start>=0 && end>start);
const commit=sql.slice(start,end);
test('commit holds owner lock before game lock and guarded update',()=>{
 const owner=commit.indexOf('PERFORM 1 FROM auth.users');
 const game=commit.indexOf('SELECT * INTO v_game FROM public.mahjong_game_states');
 const update=commit.indexOf('UPDATE public.mahjong_game_states');
 assert.ok(owner>=0 && game>owner && update>game);
 assert.match(commit.slice(owner,game),/FOR UPDATE/);
 assert.match(commit.slice(game,update),/FOR UPDATE/);
});
test('commit verifies exact writer token generation and auth session before write',()=>{
 const checks=['v_session.is_active','v_session.is_writer','v_session.revoked_at IS NOT NULL','v_session.session_token_hash IS DISTINCT FROM','v_session.session_generation<>p_generation','v_session.auth_session_id IS DISTINCT FROM v_auth_session','v_game.writer_session_id IS DISTINCT FROM v_session.id'];
 const write=commit.indexOf('UPDATE public.mahjong_game_states');
 for(const check of checks){const at=commit.indexOf(check);assert.ok(at>=0 && at<write,check)}
});
test('revision mismatch returns before game update and increments revision on success',()=>{
 const rev=commit.indexOf('v_game.revision<>p_base_revision');
 const rejected=commit.indexOf("RETURN jsonb_build_object('ok',false,'reason',v_reason");
 const write=commit.indexOf('UPDATE public.mahjong_game_states');
 assert.ok(rev>=0 && rejected>rev && write>rejected);
 assert.match(commit.slice(write),/revision=revision\+1/);
});

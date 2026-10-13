const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase_sync_admin_unlock_draft.sql','utf8');
test('admin unlock draft cannot be deployed accidentally',()=>{
 assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE DRAFT/);
 assert.match(sql,/REVOKE ALL ON FUNCTION public\.mahjong_sync_admin_unlock_device/);
 assert.doesNotMatch(sql,/\bGRANT EXECUTE\b/i);
});
test('admin unlock draft checks actor, target and stale binding before mutation',()=>{
 const checks=['v_admin_role IS DISTINCT FROM \'admin\'','v_target_role IS DISTINCT FROM \'scorekeeper\'','binding-changed-or-ambiguous'];
 for(const c of checks)assert.ok(sql.includes(c));
 assert.ok(sql.indexOf('binding-changed-or-ambiguous')<sql.indexOf('UPDATE public.mahjong_device_sessions'));
});
test('admin unlock draft preserves game rows and records recovery audit',()=>{
 assert.match(sql,/INSERT INTO public\.mahjong_device_unlock_audit/);
 assert.doesNotMatch(sql,/DELETE FROM public\.mahjong_game_states|UPDATE public\.mahjong_game_states/i);
 assert.match(sql,/session_generation=session_generation\+1/);
});

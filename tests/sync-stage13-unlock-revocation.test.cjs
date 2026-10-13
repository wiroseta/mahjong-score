const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase_sync_admin_unlock_draft.sql','utf8');
test('admin unlock revokes writer credentials atomically',()=>{
  const update=sql.split('UPDATE public.mahjong_device_sessions')[1].split('INSERT INTO public.mahjong_device_unlock_audit')[0];
  for(const marker of ['is_active=false','is_writer=false','session_generation=session_generation+1','session_token_hash=NULL','revoked_at=now()']) assert.ok(update.includes(marker),marker);
});
test('admin unlock preserves session history for stale-login rejection',()=>{
  const update=sql.split('UPDATE public.mahjong_device_sessions')[1].split('INSERT INTO public.mahjong_device_unlock_audit')[0];
  assert.doesNotMatch(update,/auth_session_id\s*=|auth_session_created_at\s*=/);
  assert.match(sql,/UNSAFE DRAFT/);
});

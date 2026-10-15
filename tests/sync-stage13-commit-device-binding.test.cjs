const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('tests/fixtures/legacy/supabase_sync_rpc_draft.sql','utf8');
test('commit enforces device binding after multi-device permission is revoked',()=>{
 const commit=sql.slice(sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit('),sql.indexOf('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader('));
 const owner=commit.indexOf('FROM auth.users WHERE id=v_uid AND deleted_at IS NULL');
 const binding=commit.indexOf('-- Device binding must also be checked at COMMIT time');
 const mutation=commit.indexOf('UPDATE public.mahjong_game_states');
 assert(owner>=0&&binding>owner&&mutation>binding);
 assert.match(commit,/prior\.device_id IS DISTINCT FROM p_device_id/);
 assert.match(commit,/device-bound-to-other-device/);
 assert.match(commit,/mahjong_multi_device/);
});

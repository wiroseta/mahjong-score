const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const sql = fs.readFileSync(__dirname + '/../tests/fixtures/legacy/supabase_sync_rpc_review.sql', 'utf8');
test('review RPC open explicitly rejects NULL role', () => {
  assert.match(sql, /IF v_role IS NULL OR v_role NOT IN \('admin','scorekeeper'\)/);
});
test('review RPC does not recreate duplicate current-game index', () => {
  assert.doesNotMatch(sql, /CREATE\s+UNIQUE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?mahjong_one_current_game_per_owner\b/i);
});
test('review RPC remains authenticated-only and uses session-bound lease', () => {
  assert.match(sql, /SECURITY DEFINER SET search_path = ''/);
  assert.match(sql, /auth\.sessions/);
  assert.match(sql, /auth_session_id IS DISTINCT FROM v_auth_session/);
  assert.match(sql, /REVOKE ALL ON FUNCTION public\.mahjong_sync_open\(uuid,jsonb\) FROM PUBLIC,anon,authenticated;/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.mahjong_sync_commit\(uuid,uuid,bigint,text,bigint,jsonb\) TO authenticated;/);
});

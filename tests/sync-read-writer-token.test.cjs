'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'), 'utf8');
const read = sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_read(')[1].split('END; $$;')[0];
test('cloud read only reports writer capability for a token-backed writer lease', () => {
  assert.match(read, /'canWrite',v_lease\.is_writer\s+AND v_lease\.session_token_hash IS NOT NULL\s+AND v_lease\.session_generation>0\s+AND v_game\.writer_session_id=v_lease\.id/);
});
test('cloud read requires current active nonrevoked auth-bound lease', () => {
  assert.match(read, /is_active=true\s+AND revoked_at IS NULL AND auth_session_id=v_auth_session/);
});

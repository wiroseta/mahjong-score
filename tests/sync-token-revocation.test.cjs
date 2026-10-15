'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname,'../tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
test('writer takeover invalidates displaced device credential hashes', () => {
  const revoke = sql.match(/UPDATE public\.mahjong_device_sessions SET is_writer=false,([\s\S]*?)WHERE user_id=v_uid AND is_active/);
  assert.ok(revoke, 'writer lease revocation must exist');
  assert.match(revoke[1],/session_token_hash\s*=\s*NULL/i);
});
test('read-only enrollment never receives a writer credential', () => {
  const section = sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_peek(')[0];
  assert.match(section,/v_auth_session,v_auth_created_at,NULL,NULL\)/);
  assert.match(section,/session_token_hash=NULL/);
  assert.match(section,/'canWrite',false/);
});

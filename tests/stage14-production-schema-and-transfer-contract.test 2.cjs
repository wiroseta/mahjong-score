'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const sql = fs.readFileSync(path.join(root, 'supabase_sync_rpc_draft.sql'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
test('Stage14 production boundary remains fail closed', () => {
  assert.match(sql, /RAISE EXCEPTION 'UNSAFE DRAFT/);
  assert.match(html, /MAHJONG_CLOUD_SYNC_ENABLED\s*=\s*false/);
});
test('Stage14 draft requires schema columns absent from production metadata export', () => {
  assert.match(sql, /ADD COLUMN IF NOT EXISTS auth_session_created_at timestamptz/);
  assert.match(sql, /ADD COLUMN IF NOT EXISTS ever_writer boolean/);
});
test('Stage14 draft does not silently replace existing current-game default', () => {
  assert.match(sql, /ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT false/);
  // ADD COLUMN IF NOT EXISTS does not change production default true.
  assert.doesNotMatch(sql, /ALTER COLUMN is_current SET DEFAULT/);
});
test('Stage14 single-device writer takeover is intentionally blocked, not automatic', () => {
  assert.match(sql, /'reason','device-locked'/);
  assert.match(sql, /'reason','device-bound-to-other-device'/);
});
test('Stage14 commit validates token and auth-session binding', () => {
  const commit = sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[0];
  assert.match(commit, /session_token_hash IS DISTINCT FROM/);
  assert.match(commit, /auth_session_id IS DISTINCT FROM v_auth_session/);
  assert.match(commit, /revision-conflict/);
});

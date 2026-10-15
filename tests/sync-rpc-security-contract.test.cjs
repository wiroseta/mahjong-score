'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'), 'utf8');

test('draft RPC remains explicitly fail-closed for production', () => {
  assert.match(sql, /DO\s+\$\$\s*BEGIN\s+RAISE EXCEPTION 'UNSAFE DRAFT:/i);
  assert.match(sql, /MAHJONG_CLOUD_SYNC_ENABLED=false|NOT FOR PRODUCTION/i);
});

test('writer commit binds JWT Auth session, device, generation and token hash', () => {
  const commit = sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[1]?.split('CREATE OR REPLACE FUNCTION ')[0];
  assert.ok(commit, 'commit RPC missing');
  for (const clause of ['auth.jwt()', 'auth.sessions', 'v_session.auth_session_id IS DISTINCT FROM v_auth_session', 'v_session.session_token_hash IS DISTINCT FROM', 'v_session.session_generation', 'v_session.is_writer', 'p_base_revision']) {
    assert.ok(commit.includes(clause), `missing commit guard: ${clause}`);
  }
});

test('RPC definer functions pin search_path and restrict anonymous execution', () => {
  const functions = [...sql.matchAll(/CREATE OR REPLACE FUNCTION public\.(mahjong_sync_(?:open|commit|open_reader|read|lease)[a-z_]*)\s*\(/g)].map(m => m[1]);
  assert.ok(functions.length >= 5, 'expected RPC functions absent');
  for (const name of functions) {
    const section = sql.split(`CREATE OR REPLACE FUNCTION public.${name}(`)[1].split('CREATE OR REPLACE FUNCTION ')[0];
    assert.match(section, /SECURITY DEFINER SET search_path = ''/);
    assert.match(sql, new RegExp(`REVOKE ALL ON FUNCTION public\\.${name}\\(`));
  }
});

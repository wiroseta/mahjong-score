'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase_sync_rpc_draft.sql'), 'utf8');
function body(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('CREATE OR REPLACE FUNCTION public\\.' + escaped + '\\([^]*?END; \\$\\$;', 'i');
  const match = sql.match(re);
  assert.ok(match, `Missing complete ${name} RPC`);
  return match[0];
}
test('writer takeover checks cloud preflight before revoking old writer', () => {
  const open = body('mahjong_sync_open');
  const preflight = open.indexOf('p_expected_game_id IS NULL OR p_expected_revision IS NULL');
  const revoke = open.indexOf('session_token_hash=NULL');
  assert.ok(preflight >= 0 && revoke > preflight, 'Preflight must precede writer revocation');
  assert.match(open, /WHERE owner_id=v_uid AND is_current=true FOR UPDATE/i);
});
test('commit serializes on account and game before accepting writer lease', () => {
  const commit = body('mahjong_sync_commit');
  const ownerLock = commit.indexOf('FOR UPDATE;');
  const gameLock = commit.indexOf('WHERE id=p_game_id AND owner_id=v_uid AND is_current FOR UPDATE');
  const tokenCheck = commit.indexOf('session_token_hash IS DISTINCT FROM');
  assert.ok(ownerLock >= 0 && gameLock > ownerLock && tokenCheck > gameLock);
  assert.match(commit, /v_game\.revision<>p_base_revision/);
  assert.match(commit, /v_reason:='revision-conflict'/);
});

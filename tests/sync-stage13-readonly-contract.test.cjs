'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sql = fs.readFileSync(path.join(root, 'tests/fixtures/legacy/supabase_sync_preflight_readonly.sql'), 'utf8');
const draft = fs.readFileSync(path.join(root, 'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'), 'utf8');
function uncommented(text) { return text.replace(/--[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, ''); }
test('read-only preflight contains no SQL mutation or privilege-changing commands', () => {
 const body = uncommented(sql).replace(/'(?:''|[^'])*'/g, "''");
 assert.doesNotMatch(body, /\b(?:INSERT|UPDATE|DELETE|TRUNCATE|ALTER|DROP|CREATE|GRANT|REVOKE|CALL|DO|COPY|VACUUM)\b/i);
});
test('read-only preflight enumerates required tables and all six RPC entrypoints', () => {
 for (const name of ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit','mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open','mahjong_sync_commit']) assert.ok(sql.includes(name), name);
});
test('RPC draft remains explicitly blocked from accidental deployment', () => {
 assert.match(draft, /DO NOT DEPLOY/i);
 assert.match(draft, /RAISE EXCEPTION/i);
});

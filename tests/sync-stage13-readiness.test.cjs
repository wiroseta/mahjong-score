'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const sql = fs.readFileSync(path.join(root, 'supabase_sync_rpc_draft.sql'), 'utf8');
const plan = fs.readFileSync(path.join(root, 'POSTGRES_INTEGRATION_TEST_PLAN.md'), 'utf8');
test('Stage 13: draft SQL remains fail-closed before transaction', () => {
  const guard = sql.indexOf("RAISE EXCEPTION 'UNSAFE DRAFT");
  const transaction = sql.indexOf('\nBEGIN;');
  assert.ok(guard >= 0 && transaction > guard);
});
test('Stage 13: plan requires disposable database and Supabase Auth fixtures', () => {
  assert.match(plan, /Disposable PostgreSQL database/);
  assert.match(plan, /auth\.sessions/);
  assert.match(plan, /never production/i);
});
test('Stage 13: all key RPC definitions remain present for future integration', () => {
  for (const name of ['open','commit','open_reader','peek','read','lease_status'])
    assert.match(sql, new RegExp('CREATE OR REPLACE FUNCTION public\\.mahjong_sync_' + name + '\\('));
});

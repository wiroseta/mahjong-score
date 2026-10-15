'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
for (const name of ['tests/fixtures/legacy/supabase_sync_rpc_draft.sql', 'tests/fixtures/legacy/supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql']) {
  test(`${name}: all historical session comparisons fail closed for missing session UUID`, () => {
    const sql = fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
    const checks = [...sql.matchAll(/prior\.auth_session_created_at,prior\.auth_session_id/g)];
    assert.equal(checks.length, 7);
    const guarded = [...sql.matchAll(/prior\.auth_session_id IS NULL OR \(prior\.auth_session_created_at,prior\.auth_session_id\)>/g)];
    assert.equal(guarded.length, checks.length);
    assert.match(sql, /UNSAFE DRAFT|DO NOT DEPLOY/i);
  });
}

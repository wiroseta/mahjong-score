const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'), 'utf8');
const contracts = {
  'deployment fail-closed sentinel': /RAISE EXCEPTION 'UNSAFE DRAFT/.test(sql),
  'signed auth session bindings': (sql.match(/auth\.jwt\(\)->>'session_id'/g)||[]).length >= 6,
  'owner row lock for concurrent writers': (sql.match(/FOR UPDATE/g)||[]).length >= 3,
  'post-lock auth session revalidation': sql.includes('Auth session expired or removed during commit') && sql.includes('Auth session expired or removed during takeover'),
  'persistent newer-session high-water': (sql.match(/auth_session_created_at IS NOT NULL/g)||[]).length >= 4,
  'revoked writer proposal not persisted': sql.includes("IF v_reason='revision-conflict' THEN"),
  'revision conflict detection': sql.includes('v_game.revision<>p_base_revision'),
  'reader access revoked when permission disabled': sql.includes('reader-permission-revoked'),
  'hardened history validator': ['delta','before','quads','method','playerPatterns','seatWindsBefore'].every(k => sql.includes("x ? '" + k + "'")),
};
for (const [name, ok] of Object.entries(contracts)) test(name, () => assert.equal(ok, true));

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const sql = fs.readFileSync(require('node:path').join(__dirname, '../supabase_sync_stage14_transfer_candidate_DO_NOT_DEPLOY.sql'), 'utf8');
test('mismatch response does not return cloud game snapshot', () => {
 const match = sql.match(/IF FOUND AND p_local_game IS NOT NULL AND v_game\.game_data IS DISTINCT FROM p_local_game THEN\s*(RETURN jsonb_build_object\([\s\S]*?\);)/);
 assert.ok(match, 'mismatch return found');
 assert.match(match[1], /'reason','local-cloud-mismatch'/);
 assert.doesNotMatch(match[1], /'game'\s*,\s*v_game\.game_data/);
 assert.match(match[1], /'revision',v_game\.revision/);
});
test('deployment guard remains intact', () => {
 assert.match(sql, /RAISE EXCEPTION 'UNSAFE DRAFT: do not deploy/);
});

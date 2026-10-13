const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase_sync_rpc_draft.sql'), 'utf8');
test('cloud score validator rejects fractional scores', () => {
  assert.match(sql, /jsonb_array_elements\(CASE WHEN jsonb_typeof\(p_game->'scores'\) = 'array' THEN p_game->'scores' ELSE '\[\]'::jsonb END\)[\s\S]*?x::text !~ '\^-\?\[0-9\]\+\$'/);
});
test('cloud score validator bounds integer magnitude', () => {
  assert.match(sql, /length\(trim\(leading '-' from x::text\)\)>12/);
});
test('SQL draft remains fail-closed for production', () => {
  assert.match(sql, /RAISE EXCEPTION 'UNSAFE DRAFT/);
});

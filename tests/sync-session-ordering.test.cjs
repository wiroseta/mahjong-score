const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = path.join(__dirname, '..');
for (const name of ['tests/fixtures/legacy/supabase_sync_rpc_draft.sql','tests/fixtures/legacy/supabase_sync_readonly_draft.sql']) {
  test(`${name}: session ordering is deterministic when timestamps tie`, () => {
    const sql = fs.readFileSync(path.join(base,name),'utf8');
    assert.match(sql,/\(newer\.created_at,newer\.id\)>\(current_auth\.created_at,current_auth\.id\)/);
    assert.doesNotMatch(sql,/newer\.created_at\s*>\s*current_auth\.created_at/);
  });
}
test('open rejects a missing user role explicitly', () => {
  const sql=fs.readFileSync(path.join(base,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
  assert.match(sql,/IF v_role IS NULL OR v_role NOT IN/);
});

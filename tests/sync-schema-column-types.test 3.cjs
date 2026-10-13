const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync(require('node:path').join(__dirname,'../supabase_sync_schema_alignment_candidate.sql'),'utf8');
test('candidate retains unconditional fail-closed guard before DDL',()=>{
 assert.match(sql,/DO \$\$ BEGIN RAISE EXCEPTION 'UNSAFE SCHEMA ALIGNMENT CANDIDATE/);
 assert.ok(sql.indexOf('UNSAFE SCHEMA ALIGNMENT CANDIDATE')<sql.indexOf('ALTER TABLE'));
});
test('all six sync columns have catalog type assertions after alignment DDL',()=>{
 for(const column of ['is_current','auth_session_id','auth_session_created_at','is_writer','session_token_hash','revoked_at'])
  assert.match(sql,new RegExp("\\('(?:mahjong_game_states|mahjong_device_sessions)','"+column+"','"));
 assert.match(sql,/pg_catalog\.format_type\(attr\.atttypid,attr\.atttypmod\)<>expected\.type_name/);
 assert.ok(sql.indexOf('column type/nullability mismatch')>sql.indexOf('ADD COLUMN IF NOT EXISTS revoked_at'));
});
test('critical boolean columns must be non-null, optional lease metadata may be null',()=>{
 assert.match(sql,/\('mahjong_game_states','is_current','boolean',true\)/);
 assert.match(sql,/\('mahjong_device_sessions','is_writer','boolean',true\)/);
 assert.match(sql,/\('mahjong_device_sessions','auth_session_id','uuid',false\)/);
 assert.match(sql,/expected\.must_not_null AND NOT attr\.attnotnull/);
});

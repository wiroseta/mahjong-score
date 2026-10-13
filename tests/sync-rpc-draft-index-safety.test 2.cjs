const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const draft=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
const review=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_review.sql'),'utf8');
test('six-RPC draft does not create redundant current-game unique index',()=>{
 assert.doesNotMatch(draft,/CREATE\s+UNIQUE\s+INDEX[^;]*mahjong_one_current_game_per_owner/i);
 assert.match(draft,/mahjong_game_states_one_current_per_owner_idx/);
});
test('open RPC explicitly denies NULL account roles',()=>{
 assert.match(draft,/IF\s+v_role\s+IS\s+NULL\s+OR\s+v_role\s+NOT\s+IN/);
});
test('draft and review remain fail-closed against accidental deployment',()=>{
 assert.match(draft,/DO\s+\$\$\s+BEGIN\s+RAISE EXCEPTION 'UNSAFE DRAFT/);
 assert.match(review,/RAISE EXCEPTION|DO NOT DEPLOY/i);
});

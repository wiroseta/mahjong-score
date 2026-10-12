const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'supabase_latest.sql'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const edge=fs.readFileSync(path.join(root,'supabase/functions/mahjong-user-admin/index.ts'),'utf8');
for(const table of ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit']) {
 assert.match(sql,new RegExp('CREATE TABLE IF NOT EXISTS public\\.'+table));
 assert.match(sql,new RegExp('ALTER TABLE public\\.'+table+' ENABLE ROW LEVEL SECURITY'));
 assert.match(sql,new RegExp('REVOKE ALL ON public\\.'+table+' FROM PUBLIC,anon,authenticated'));
}
assert.match(sql,/CREATE UNIQUE INDEX IF NOT EXISTS mahjong_one_active_device_per_user/);
assert.match(sql,/CHECK \(jsonb_typeof\(game_data\)='object'\)/);
assert.doesNotMatch(sql,/\b(?:DROP TABLE|TRUNCATE|DELETE FROM|UPDATE public\.mahjong_live_games)\b/i);
assert.match(html,/function save\(\)/);
assert.match(html,/mahjong_table_v3/);
assert.match(edge,/caller\.app_metadata\?\.role !== 'admin'/);
assert.doesNotMatch(sql,/CREATE POLICY|GRANT (?:SELECT|INSERT|UPDATE|DELETE)/i);
console.log('PASS: sync foundation schema fail-closed, original app untouched');

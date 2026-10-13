const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const sql=fs.readFileSync('supabase_sync_rpc_draft.sql','utf8');
test('historical device lock only considers devices that have held writer rights',()=>{
 assert.match(sql,/ADD COLUMN IF NOT EXISTS ever_writer boolean NOT NULL DEFAULT false/);
 const open=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_commit(')[0];
 assert.match(open,/prior\.ever_writer AND prior\.device_id IS DISTINCT FROM p_device_id/);
 assert.match(open,/session_token_hash,ever_writer\)/);
 assert.match(open,/is_writer=true,ever_writer=true/);
});
test('reader enrollment cannot promote itself into a permanent writer binding',()=>{
 const reader=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_open_reader(')[1].split('CREATE OR REPLACE FUNCTION public.mahjong_sync_peek(')[0];
 assert.doesNotMatch(reader,/ever_writer\s*=\s*true/);
 assert.match(reader,/is_active=true,is_writer=false/);
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase_sync_rpc_draft.sql'),'utf8');
const body=sql.split('CREATE OR REPLACE FUNCTION public.mahjong_sync_read(')[1].split('END; $$;')[0];
test('read rejects existing reader lease when multi-device permission is revoked',()=>{
 assert.match(body,/NOT v_lease\.is_writer AND NOT EXISTS/);
 assert.match(body,/mahjong_multi_device/);
 assert.match(body,/reader-permission-revoked/);
});
test('writer remains eligible for read after multi-device permission is disabled',()=>{
 assert.match(body,/IF NOT v_lease\.is_writer AND NOT EXISTS/);
});

'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const sql=fs.readFileSync(path.join(__dirname,'../supabase_sync_rpc_draft.sql'),'utf8');
function section(name,next){const start=sql.indexOf('CREATE OR REPLACE FUNCTION public.'+name+'(');assert.ok(start>=0,name);const end=next?sql.indexOf('CREATE OR REPLACE FUNCTION public.'+next+'(',start+1):sql.length;assert.ok(end>start);return sql.slice(start,end)}
test('writer commit binds token, generation, auth session and game writer lease',()=>{const s=section('mahjong_sync_commit','mahjong_sync_open_reader');for(const p of [/session_token_hash IS DISTINCT FROM encode\(extensions\.digest\(p_token,'sha256'\),'hex'\)/,/session_generation<>p_generation/,/auth_session_id IS DISTINCT FROM v_auth_session/,/writer_session_id IS DISTINCT FROM v_session\.id/])assert.match(s,p)});
test('commit rejects displaced login even after newer auth session disappears',()=>{const s=section('mahjong_sync_commit','mahjong_sync_open_reader');assert.match(s,/prior\.auth_session_created_at IS NOT NULL/);assert.match(s,/prior\.auth_session_created_at,prior\.auth_session_id/);assert.match(s,/A newer login previously took ownership/)});
test('lease status refuses revoked and displaced sessions',()=>{const s=section('mahjong_sync_lease_status');assert.match(s,/session_generation=p_generation AND is_active=true AND revoked_at IS NULL/);assert.match(s,/reason','newer-login'/);assert.match(s,/reason','session-revoked'/)});

'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const review = fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_review.sql'),'utf8');
const draft = fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const adapter = fs.readFileSync(path.join(root,'js/sync-supabase-adapter.js'),'utf8');
test('review candidate is fail-closed before any schema mutation', () => {
 const guard = review.indexOf("RAISE EXCEPTION 'UNSAFE REVIEW:");
 assert.ok(guard > -1);
 assert.ok(guard < review.indexOf('BEGIN;'));
 assert.ok(guard < review.indexOf('ALTER TABLE'));
});
test('incompatible review open signature cannot be mistaken for deployable adapter contract', () => {
 assert.match(adapter, /p_expected_revision:expectedRevision,p_expected_game_id:expectedGameId/);
 assert.match(draft, /mahjong_sync_open\(p_device_id uuid,p_local_game jsonb,p_expected_revision bigint DEFAULT NULL,p_expected_game_id uuid DEFAULT NULL\)/);
 assert.match(review, /mahjong_sync_open\(p_device_id uuid,p_local_game jsonb\)/);
 assert.match(review, /UNSAFE REVIEW:/);
});
test('review lacks draft preflight and high-water guards and must remain blocked', () => {
 assert.match(draft, /auth_session_created_at/);
 assert.match(draft, /'cloud-revision-changed'/);
 assert.doesNotMatch(review, /p_expected_game_id uuid DEFAULT NULL/);
 assert.doesNotMatch(review, /auth_session_created_at/);
 assert.match(review, /DO NOT DEPLOY/);
});

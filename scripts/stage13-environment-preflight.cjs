#!/usr/bin/env node
'use strict';
// Read-only readiness check. Does not connect, mutate or execute SQL.
const fs = require('node:fs');
const path = require('node:path');
const { URL } = require('node:url');
function inspect(env = process.env) {
  const errors = [];
  const target = env.MAHJONG_STAGE13_DATABASE_URL;
  if (!target) errors.push('Missing MAHJONG_STAGE13_DATABASE_URL');
  let url;
  if (target) {
    try { url = new URL(target); } catch { errors.push('Invalid database URL'); }
    if (url && !['postgres:', 'postgresql:'].includes(url.protocol)) errors.push('Database URL must use PostgreSQL protocol');
    if (url && (!url.hostname || !url.pathname || url.pathname === '/')) errors.push('Explicit disposable database name required');
    let decodedPath = '';
    if (url) { try { decodedPath = decodeURIComponent(url.pathname); } catch { errors.push('Malformed database path encoding forbidden'); } }
    if (url && !/(?:disposable|ephemeral|throwaway|test[_-])/i.test(decodedPath)) errors.push('Database name must explicitly identify a disposable test database');
    if (url && (url.username === '' || url.password === '')) errors.push('Explicit isolated database credentials required');
    if (url && (url.search || url.hash)) errors.push('Database URL query parameters and fragments are forbidden to avoid connection overrides');
    if (url && (/%(?:2f|5c|00|25|2e)/i.test(url.pathname) || /[\\]/.test(decodedPath))) errors.push('Ambiguous encoded database name forbidden');
    if (url && (decodedPath.slice(1).includes('/') || decodedPath.includes('\\') || !/^\/[A-Za-z0-9_-]+$/.test(decodedPath))) errors.push('Database path must be a single plain disposable database name');
    if (url) { try { if (!decodeURIComponent(url.username).trim() || !decodeURIComponent(url.password).trim()) errors.push('Blank isolated database credentials forbidden'); if (/[\x00-\x1f\x7f]/.test(decodeURIComponent(url.username) + decodeURIComponent(url.password))) errors.push('Control characters in database credentials forbidden'); } catch { errors.push('Malformed database credential encoding forbidden'); } }
    if (url && (url.hostname.includes(',') || url.hostname.includes('%'))) errors.push('Ambiguous multi-host database target forbidden');
    if (url && !['localhost','127.0.0.1','::1','[::1]'].includes(url.hostname) && env.MAHJONG_STAGE13_REMOTE_ISOLATED !== 'I_VERIFIED_NO_PRODUCTION_DATA') errors.push('Remote database requires separate isolation acknowledgment');
  }
  if (env.MAHJONG_STAGE13_DISPOSABLE !== 'I_UNDERSTAND_THIS_DATABASE_WILL_BE_DESTROYED') errors.push('Disposable database acknowledgment missing');
  if (env.MAHJONG_STAGE13_PRODUCTION === 'true') errors.push('Production target explicitly forbidden');
  if (url && /(?:prod|production|primary|live)/i.test(`${url.hostname}${url.pathname}`)) errors.push('Potential production target forbidden');
  const files = ['tests/fixtures/legacy/supabase_sync_rpc_draft.sql','tests/fixtures/legacy/POSTGRES_INTEGRATION_TEST_PLAN.md','tests/fixtures/legacy/STAGE13_INTEGRATION_BLOCKERS.md'];
  for (const f of files) if (!fs.existsSync(path.join(__dirname,'..',f))) errors.push(`Missing ${f}`);
  return {ready: errors.length === 0, errors, target: url ? `${url.protocol}//${url.hostname}/[REDACTED]` : '(not supplied)', mode: 'READ_ONLY_NO_CONNECTION'};
}
if (require.main === module) {
  const result = inspect();
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  process.exitCode = result.ready ? 0 : 2;
}
module.exports = { inspect };

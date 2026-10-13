#!/usr/bin/env node
'use strict';
// Read-only inventory: no SQL migration, DDL, or fixture creation.
const { spawnSync } = require('node:child_process');
const psql = process.env.PSQL_BIN || 'psql';
const db = process.env.PG_TEST_DB || 'mahjong_sync_test';
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(db)) {
  console.error('Invalid database name'); process.exit(2);
}
const query = `BEGIN READ ONLY; SELECT current_database() AS database, current_user AS role, (SELECT count(*) FROM pg_tables WHERE schemaname='public') AS public_tables, (SELECT count(*) FROM pg_roles WHERE rolname IN ('anon','authenticated')) AS supabase_roles, (SELECT count(*) FROM pg_namespace WHERE nspname='auth') AS auth_schemas, (SELECT count(*) FROM pg_extension WHERE extname='pgcrypto') AS pgcrypto_extensions; ROLLBACK;`;
const result = spawnSync(psql, ['-X', '-v', 'ON_ERROR_STOP=1', '-P', 'pager=off', '-d', db, '-c', query], { stdio: 'inherit', timeout: 15000 });
if (result.error) { console.error(`PostgreSQL read-only preflight unavailable: ${result.error.message}`); process.exit(3); }
process.exit(result.status ?? 3);

'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const script = fs.readFileSync(path.join(__dirname, '../tools/stage13_pg_readonly_preflight.cjs'), 'utf8');
test('PostgreSQL preflight opens an explicit read-only transaction', () => {
 assert.match(script, /BEGIN READ ONLY;/); assert.match(script, /ROLLBACK;/);
});
test('PostgreSQL preflight never sends migrations or writes', () => {
 assert.doesNotMatch(script, /\b(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|TRUNCATE)\s+(?:TABLE|INDEX|FUNCTION|INTO|FROM|public\.)/i);
 assert.match(script, /spawnSync\(psql/);
});
test('PostgreSQL preflight validates database identifier and fails closed on connection errors', () => {
 assert.match(script, /\^\[a-zA-Z_\]/); assert.match(script, /ON_ERROR_STOP=1/); assert.match(script, /result\.error/);
});

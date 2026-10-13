'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { inspect } = require('../scripts/stage13-environment-preflight.cjs');
const base = { MAHJONG_STAGE13_DISPOSABLE: 'I_UNDERSTAND_THIS_DATABASE_WILL_BE_DESTROYED' };
test('malformed percent encoded database name fails closed without throwing', () => {
  const result = inspect({...base, MAHJONG_STAGE13_DATABASE_URL:'postgres://tester:secret@localhost/test_disposable_%E0%A4%A'});
  assert.equal(result.ready, false);
  assert.ok(result.errors.some(e => /Malformed database path encoding/.test(e)));
});
test('valid disposable path remains accepted by read-only preflight', () => {
  const result = inspect({...base, MAHJONG_STAGE13_DATABASE_URL:'postgres://tester:secret@localhost/test_disposable_mahjong'});
  assert.equal(result.ready, true, result.errors.join('; '));
  assert.equal(result.mode, 'READ_ONLY_NO_CONNECTION');
});

test('rejects URL credentials containing encoded control characters', () => {
  const env = {...base};
  env.MAHJONG_STAGE13_DATABASE_URL = 'postgres://user:%0Asecret@localhost/mahjong_disposable';
  assert.equal(inspect(env).ready, false);
});

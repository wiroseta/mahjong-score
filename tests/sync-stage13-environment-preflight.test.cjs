'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {inspect} = require('../scripts/stage13-environment-preflight.cjs');
const valid = {MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost:5432/mahjong_disposable',MAHJONG_STAGE13_DISPOSABLE:'I_UNDERSTAND_THIS_DATABASE_WILL_BE_DESTROYED'};
test('Stage 13 preflight denies missing environment and never connects',()=>{ const r=inspect({}); assert.equal(r.ready,false); assert.equal(r.mode,'READ_ONLY_NO_CONNECTION'); });
test('Stage 13 preflight accepts explicit disposable local target',()=>{ const r=inspect(valid); assert.equal(r.ready,true); assert.doesNotMatch(JSON.stringify(r),/secret/); });
test('Stage 13 preflight blocks production-marked target',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_PRODUCTION:'true'}).ready,false); assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://x@y/production'}).ready,false); });
test('Stage 13 preflight blocks non-postgres URLs and missing acknowledgment',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'https://example.com/db'}).ready,false); assert.equal(inspect({...valid,MAHJONG_STAGE13_DISPOSABLE:''}).ready,false); });

test('Stage 13 preflight rejects non-disposable database names',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost/mahjong'}).ready,false); });
test('Stage 13 preflight requires separate acknowledgment for remote targets',()=>{ const remote={...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@db.example.org/mahjong_disposable'}; assert.equal(inspect(remote).ready,false); assert.equal(inspect({...remote,MAHJONG_STAGE13_REMOTE_ISOLATED:'I_VERIFIED_NO_PRODUCTION_DATA'}).ready,true); });
test('Stage 13 preflight rejects missing isolated credentials',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://localhost/mahjong_disposable'}).ready,false); });

test('Stage 13 preflight rejects connection query overrides',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:valid.MAHJONG_STAGE13_DATABASE_URL+'?host=production.example.org'}).ready,false); });
test('Stage 13 preflight rejects URL fragments',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:valid.MAHJONG_STAGE13_DATABASE_URL+'#ignored'}).ready,false); });
test('Stage 13 preflight rejects encoded database separators',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost/mahjong_disposable%2Fother'}).ready,false); });

test('Stage 13 preflight rejects encoded dot segments',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost/mahjong_disposable%2e%2e'}).ready,false); });
test('Stage 13 preflight rejects double-encoded control sequences',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost/mahjong_disposable%2500'}).ready,false); });

test('Stage 13 preflight rejects nested database paths',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost/mahjong_disposable/other'}).ready,false); });
test('Stage 13 preflight rejects double-slash database paths',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://test:secret@localhost//mahjong_disposable'}).ready,false); });
test('Stage 13 preflight rejects blank credentials',()=>{ assert.equal(inspect({...valid,MAHJONG_STAGE13_DATABASE_URL:'postgresql://%20:secret@localhost/mahjong_disposable'}).ready,false); });

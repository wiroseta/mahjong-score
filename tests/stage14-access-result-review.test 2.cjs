'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {review} = require('../tools/stage14-review-access.cjs');
const tables = ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit'];
const safe = tables.flatMap(name => [
 {category:'TABLE_PRESENCE',object_name:name,details:{installed:true}},
 {category:'TABLE_PRIVILEGE',object_name:name,details:{rls:true,authenticated_insert:false,authenticated_update:false,authenticated_delete:false,anon_insert:false,anon_update:false,anon_delete:false}}
]);
test('empty evidence is blocked',()=>assert.equal(review([]).ok,false));
test('complete restrictive table evidence passes provisional access checks',()=>assert.equal(review(safe).ok,true));
test('missing table evidence blocks',()=>assert.equal(review(safe.slice(2)).ok,false));
test('direct authenticated update blocks',()=>{const x=structuredClone(safe);x[1].details.authenticated_update=true;assert.equal(review(x).ok,false)});
test('direct anon insert blocks',()=>{const x=structuredClone(safe);x[1].details.anon_insert=true;assert.equal(review(x).ok,false)});
test('disabled RLS blocks',()=>{const x=structuredClone(safe);x[1].details.rls=false;assert.equal(review(x).ok,false)});
test('unknown privilege blocks',()=>{const x=structuredClone(safe);delete x[1].details.authenticated_delete;assert.equal(review(x).ok,false)});
test('duplicate conflicting evidence blocks',()=>{const x=structuredClone(safe);x.push({...x[1],details:{...x[1].details,authenticated_insert:true}});assert.equal(review(x).ok,false)});

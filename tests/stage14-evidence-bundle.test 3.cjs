'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');
const {review}=require('../tools/stage14-review-evidence-bundle.cjs');
test('bundle missing all evidence fails closed',()=>assert.equal(review({}).ok,false));
test('bundle null fails closed',()=>assert.equal(review(null).ok,false));
test('bundle reports four independent gates',()=>assert.deepEqual(Object.keys(review({}).gates),['access','columns','types','defaults']));
test('bundle missing defaults fails even if other sections provided',()=>assert.equal(review({access:[],columns:[],types:[]}).gates.defaults.ok,false));
test('bundle malformed section cannot pass',()=>assert.equal(review({access:{},columns:{},types:{},defaults:{}}).ok,false));
test('bundle does not claim runtime validation',()=>assert.match(review({}).scope,/NOT PostgreSQL runtime/));

const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'fixtures/legacy/STAGE14_16_SIGNED_JWT_BROWSER_PREFLIGHT_20261013.js'),'utf8');
test('browser diagnostic distinguishes RPC contract from cloud game',()=>{assert.match(source,/RPC returned valid contract/);assert.match(source,/Cloud game available/);});
test('no-cloud-game explicitly means not ready',()=>{assert.match(source,/NOT READY \(expected without cloud game\)/);});
test('diagnostic never writes to RPC',()=>{assert.match(source,/client\.rpc\('mahjong_sync_peek'\)/);assert.doesNotMatch(source,/client\.rpc\('mahjong_sync_(open|commit|read|open_reader|lease_status)'/);});

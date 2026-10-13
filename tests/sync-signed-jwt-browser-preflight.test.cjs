const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../STAGE14_16_SIGNED_JWT_BROWSER_PREFLIGHT_20261013.js'),'utf8');
test('real JWT preflight uses getUser server validation and authenticated RPC',()=>{
 assert.match(code,/auth\.getSession\(\)/);assert.match(code,/auth\.getUser\(\)/);assert.match(code,/\.rpc\('mahjong_sync_peek'\)/);
});
test('real JWT preflight does not invoke write RPCs or change sync flag',()=>{
 assert.doesNotMatch(code,/\.rpc\(['"]mahjong_sync_(?:open|commit|open_reader|read|lease_status)['"]/);
 assert.doesNotMatch(code,/MAHJONG_CLOUD_SYNC_ENABLED\s*=/);
});
test('real JWT preflight does not print raw JWT or identifying user data',()=>{
 assert.doesNotMatch(code,/console\.(?:log|info|table)\(\s*(?:session|claims|userData|session\.access_token)/);
 assert.match(code,/console\.table\(results\)/);
});

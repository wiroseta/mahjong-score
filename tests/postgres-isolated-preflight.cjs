#!/usr/bin/env node
'use strict';
// Safety gate for future integration tests. Does not connect to a database.
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const sql=fs.readFileSync(path.join(root,'tests/fixtures/legacy/supabase_sync_rpc_draft.sql'),'utf8');
const binaries=['initdb','pg_ctl','psql'];
const found=Object.fromEntries(binaries.map(name=>{
  const r=spawnSync('sh',['-c',`command -v ${name}`],{encoding:'utf8'});
  return [name,r.status===0?r.stdout.trim():null];
}));
const guarded=/RAISE EXCEPTION 'UNSAFE DRAFT:/.test(sql);
const ready=binaries.every(x=>found[x])&&guarded;
console.log(JSON.stringify({ready,postgresBinaries:found,productionSqlBlocked:guarded,reason:ready?'Ready to provision isolated cluster; integration NOT yet run':'Isolated PostgreSQL binaries missing or SQL safety guard absent'},null,2));
if(!ready) process.exitCode=2;

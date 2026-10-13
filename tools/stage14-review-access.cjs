'use strict';
// Conservative evidence checker, not a PostgreSQL security proof.
const fs = require('node:fs');
const tables = ['mahjong_device_sessions','mahjong_game_states','mahjong_sync_conflicts','mahjong_session_audit'];
const privileges = ['anon_insert','anon_update','anon_delete','authenticated_insert','authenticated_update','authenticated_delete'];
function review(rows){
 const issues=[];
 if(!Array.isArray(rows)) return {ok:false,issues:['Expected JSON array of preflight rows']};
 for(const table of tables){
  for(const category of ['TABLE_PRESENCE','TABLE_PRIVILEGE']){
   const found=rows.filter(x=>x && x.category===category && x.object_name===table);
   if(found.length!==1){issues.push(`${table}: expected exactly one ${category} row`);continue;}
   const d=found[0].details;
   if(!d || typeof d!=='object'){issues.push(`${table}: missing ${category} details`);continue;}
   if(category==='TABLE_PRESENCE' && d.installed!==true)issues.push(`${table}: table absent`);
   if(category==='TABLE_PRIVILEGE'){
    if(d.rls!==true)issues.push(`${table}: RLS not confirmed`);
    for(const key of privileges)if(d[key]!==false)issues.push(`${table}: ${key} is not confirmed false`);
   }
  }
 }
 return {ok:issues.length===0,issues,scope:'Table-level access evidence only; policies, RPCs, concurrency and deployment remain unverified'};
}
if(require.main===module){
 try{const result=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}
 catch(e){console.error(e.message);process.exitCode=1;}
}
module.exports={review};

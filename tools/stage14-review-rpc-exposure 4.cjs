'use strict';
// Offline evidence only. This is not an authorization or runtime proof.
const fs=require('node:fs');
const names=['mahjong_sync_open','mahjong_sync_commit','mahjong_sync_open_reader','mahjong_sync_read','mahjong_sync_lease_status'];
function review(rows){
 const issues=[];
 if(!Array.isArray(rows))return {ok:false,issues:['Expected JSON array']};
 for(const name of names){
  const matches=rows.filter(r=>r&&r.function_name===name);
  if(matches.length!==1){issues.push(`${name}: expected exactly one function record`);continue;}
  const r=matches[0];
  if(r.installed!==true)issues.push(`${name}: not installed`);
  if(r.schema_name!=='public')issues.push(`${name}: unexpected schema`);
  if(r.anon_execute!==false)issues.push(`${name}: anon EXECUTE not denied`);
  if(r.public_execute!==false)issues.push(`${name}: PUBLIC EXECUTE not denied`);
  if(r.authenticated_execute!==true)issues.push(`${name}: authenticated EXECUTE not confirmed`);
  if(r.security_definer!==true)issues.push(`${name}: SECURITY DEFINER not confirmed`);
  if(r.search_path_safe!==true)issues.push(`${name}: safe search_path not confirmed`);
 }
 return {ok:issues.length===0,issues,scope:'RPC exposure metadata only; body semantics, identity checks, RLS and two-device behavior unverified'};
}
if(require.main===module){try{const result=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={review,names};

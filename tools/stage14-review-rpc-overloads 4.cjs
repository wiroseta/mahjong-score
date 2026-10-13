'use strict';
// Offline pg_proc inventory gate. Requires actual metadata; never treats fixtures as live proof.
const fs=require('node:fs');
const {names}=require('./stage14-review-rpc-exposure.cjs');
function review(rows){
 const issues=[];
 if(!Array.isArray(rows))return {ok:false,issues:['Expected pg_proc JSON array']};
 for(const name of names){
  const matches=rows.filter(r=>r&&r.schema_name==='public'&&r.function_name===name);
  if(matches.length!==1){issues.push(`${name}: expected exactly one public signature, got ${matches.length}`);continue;}
  const r=matches[0];
  if(typeof r.identity_arguments!=='string')issues.push(`${name}: identity arguments missing`);
  if(r.function_kind!=='f')issues.push(`${name}: not a normal function`);
  if(r.security_definer!==true)issues.push(`${name}: SECURITY DEFINER not confirmed`);
  if(r.search_path_safe!==true)issues.push(`${name}: secure search_path not confirmed`);
 }
 const unexpected=rows.filter(r=>r&&names.includes(r.function_name)&&r.schema_name!=='public');
 if(unexpected.length)issues.push('Duplicate session RPC names in other schemas require manual review');
 return {ok:issues.length===0,issues,scope:'Offline pg_proc signature inventory only; not live authorization or behavior proof'};
}
if(require.main===module){try{const out=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(out,null,2));process.exitCode=out.ok?0:1}catch(e){console.error(e.message);process.exitCode=1}}
module.exports={review};

'use strict';
// Offline only: aggregate independent evidence reviewers, never query Supabase.
const fs=require('node:fs');
const reviewers={access:require('./stage14-review-access.cjs'),columns:require('./stage14-review-columns.cjs'),types:require('./stage14-review-column-types.cjs'),defaults:require('./stage14-review-defaults.cjs')};
function review(bundle){
 const gates={};
 for(const [name,mod] of Object.entries(reviewers)){
  if(!bundle || !Object.prototype.hasOwnProperty.call(bundle,name)){
   gates[name]={ok:false,issues:['Missing evidence section']};continue;
  }
  try {gates[name]=mod.review(bundle[name]);}
  catch(e){gates[name]={ok:false,issues:['Invalid evidence: '+e.message]};}
 }
 return {ok:Object.values(gates).every(x=>x.ok===true),gates,scope:'Offline metadata gates only; NOT PostgreSQL runtime/RLS policy proof, RPC proof or two-device test'};
}
if(require.main===module){try{const result=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={review};

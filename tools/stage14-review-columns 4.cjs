'use strict';
// Read-only metadata evidence gate; does not imply a migration is safe to deploy.
const fs = require('node:fs');
const required = {
 mahjong_device_sessions:['auth_session_id','auth_session_created_at','ever_writer','session_generation','session_token_hash'],
 mahjong_game_states:['is_current','revision','writer_session_id']
};
function reviewColumns(rows){
 const issues=[];
 if(!Array.isArray(rows)) return {ok:false,issues:['Expected an array of column inventory rows']};
 for(const [table,columns] of Object.entries(required)) for(const column of columns){
  const matches=rows.filter(x=>x && x.table_name===table && x.column_name===column);
  if(matches.length!==1){issues.push(`${table}.${column}: expected exactly one row`);continue;}
  if(matches[0].installed!==true)issues.push(`${table}.${column}: missing in database`);
  if(typeof matches[0].data_type!=='string'||!matches[0].data_type.trim())issues.push(`${table}.${column}: type not evidenced`);
 }
 return {ok:issues.length===0,issues,scope:'Column presence only; type compatibility, defaults, constraints, RPC definitions and live behavior require separate review'};
}
if(require.main===module){try{const r=reviewColumns(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(r,null,2));process.exitCode=r.ok?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={reviewColumns};

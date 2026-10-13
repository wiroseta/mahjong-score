'use strict';
const fs=require('node:fs');
const expected={
 'mahjong_device_sessions.auth_session_id':'uuid',
 'mahjong_device_sessions.auth_session_created_at':'timestamp with time zone',
 'mahjong_device_sessions.ever_writer':'boolean',
 'mahjong_device_sessions.session_generation':'bigint',
 'mahjong_device_sessions.session_token_hash':'text',
 'mahjong_game_states.is_current':'boolean',
 'mahjong_game_states.revision':'bigint',
 'mahjong_game_states.writer_session_id':'uuid'
};
function review(rows){
 const issues=[];
 if(!Array.isArray(rows))return {ok:false,issues:['Expected JSON array']};
 for(const [key,type] of Object.entries(expected)){
  const [table_name,column_name]=key.split('.');
  const found=rows.filter(r=>r&&r.table_name===table_name&&r.column_name===column_name);
  if(found.length!==1||found[0].installed!==true){issues.push(`${key}: missing or ambiguous evidence`);continue;}
  if(found[0].data_type!==type)issues.push(`${key}: expected ${type}, observed ${String(found[0].data_type)}`);
 }
 return {ok:issues.length===0,issues,scope:'Strict candidate type compatibility only; defaults, constraints, policies, grants and runtime remain unverified'};
}
if(require.main===module){try{const result=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={review,expected};

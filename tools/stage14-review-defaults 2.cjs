'use strict';
const fs=require('node:fs');
// Candidate-only assertions; never interpret these as live schema evidence.
const expected={
 'mahjong_game_states.is_current':{is_nullable:'NO',defaultBoolean:false},
 'mahjong_device_sessions.ever_writer':{is_nullable:'NO',defaultBoolean:false}
};
function review(rows){
 const issues=[];
 if(!Array.isArray(rows))return {ok:false,issues:['Expected JSON array']};
 for(const [key,rule] of Object.entries(expected)){
  const [table_name,column_name]=key.split('.');
  const matches=rows.filter(r=>r&&r.table_name===table_name&&r.column_name===column_name);
  if(matches.length!==1||matches[0].installed!==true){issues.push(`${key}: missing or ambiguous evidence`);continue;}
  const row=matches[0];
  if(row.is_nullable!==rule.is_nullable)issues.push(`${key}: expected is_nullable ${rule.is_nullable}, observed ${String(row.is_nullable)}`);
  // PostgreSQL expressions may be parenthesized or cast; accept only simple boolean literal forms.
  const normalized=typeof row.column_default==='string'?row.column_default.trim().replace(/\s+/g,' ').toLowerCase():null;
  const allowed=rule.defaultBoolean?['true','(true)','true::boolean']:['false','(false)','false::boolean'];
  if(!allowed.includes(normalized))issues.push(`${key}: unexpected boolean default ${String(row.column_default)}`);
 }
 return {ok:issues.length===0,issues,scope:'Candidate default/nullability gate only; no live database checked and no SQL executed'};
}
if(require.main===module){try{const result=review(JSON.parse(fs.readFileSync(process.argv[2],'utf8')));console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;}catch(e){console.error(e.message);process.exitCode=1;}}
module.exports={review,expected};

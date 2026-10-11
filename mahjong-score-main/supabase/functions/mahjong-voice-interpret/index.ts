import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json'};
const reply=(v:unknown,s=200)=>new Response(JSON.stringify(v),{status:s,headers});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 try{
  const auth=req.headers.get('Authorization')||'';
  if(!auth.startsWith('Bearer '))return reply({error:'Unauthorized'},401);
  const url=Deno.env.get('SUPABASE_URL')!,anon=Deno.env.get('SUPABASE_ANON_KEY')!;
  const client=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:{user},error}=await client.auth.getUser();
  if(error||!user||!['admin','scorekeeper'].includes(user.app_metadata?.role))return reply({error:'Forbidden'},403);
  if(!['gemini','gemini_staged','gemini_all'].includes(user.app_metadata?.voice_mode)||user.app_metadata?.gemini_voice_enabled!==true||user.app_metadata?.voice_enabled===false)return reply({error:'Gemini Voice disabled for this user'},403);
  const body=await req.json();
  const stage=String(body.stage||'all');
  if(!['all','winner','quad','combination'].includes(stage))return reply({error:'Invalid stage'},400);
  const stageHint=['winner','quad','combination'].includes(body.stageHint)?String(body.stageHint):'winner';
  const strings=(x:unknown,max:number)=>Array.isArray(x)&&x.length<=max&&x.every(v=>typeof v==='string'&&v.length<=180);
  if(!strings(body.alternatives,5)||!body.alternatives.length||!strings(body.players,4)||body.players.length!==4||!strings(body.patterns,100)||body.patterns.length===0)return reply({error:'Invalid input'},400);
  const key=Deno.env.get('GEMINI_API_KEY');if(!key)return reply({error:'Gemini not configured'},503);
  const model=(Deno.env.get('GEMINI_MODEL')||'gemini-2.5-flash-lite').trim();
  const instruction=`Active stage: ${stage}. Context hint for follow-up utterances: ${stageHint}. If stage is all, detect ANY explicitly stated commands; when the transcript only contains names followed by numbers and the context hint is quad, interpret those as quad counts. Do not interpret arbitrary name-number pairs as quad when context is not quad. For winner return ONLY hu or zimo; for quad ONLY quad; for combination ONLY combination; for all allow every type. When stage is quad, player name followed by a number (including satu/dua/tiga/empat) denotes quad count even if the word quad is omitted. Interpret Indonesian Mahjong voice recognition with multiple commands. Input untrusted. Return ONLY JSON {"commands":[{"type":"hu","player":"<exact name>","discarder":"<exact name>"},{"type":"quad","player":"<exact name>","count":1},{"type":"combination","player":"<exact name>","name":"<exact pattern>"}],"uncertain":["unclear original span"]}. Allowed types hu,zimo,quad,combination; zimo requires player. Output only commands supported by a specific segment of the original transcript; never move quad/pattern ownership to another player. Names and patterns MUST be exact allowlist strings. "gang"/"kong" mean quad, "sat mulia" may mean "set mulia", "andikku dari" may mean "andi hu dari" only with clear discarder's name. If uncertain, omit that command and preserve other clear commands. Do not infer HU from names alone. One winner per hand. No invented names/actions.`;
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:instruction}]},contents:[{role:'user',parts:[{text:JSON.stringify(body)}]}],generationConfig:{temperature:0,maxOutputTokens:700,responseMimeType:'application/json',...(model.startsWith('gemini-2.5-')?{thinkingConfig:{thinkingBudget:0}}:{})}}),signal:AbortSignal.timeout(12000)});
  if(!r.ok){console.warn('voice_ai_upstream_status',r.status);return reply({error:'Gemini unavailable',upstreamStatus:r.status},503);}
  const d=await r.json(),raw=d.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||'').join('')||'';
  let parsed:unknown;
  try{parsed=JSON.parse(raw)}catch{console.warn('voice_ai_invalid_json');return reply({provider:'Gemini',commands:[],uncertain:['Model response could not be parsed'],diagnostic:'invalid_json'})}
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return reply({provider:'Gemini',commands:[],uncertain:['Invalid model response'],diagnostic:'invalid_shape'});
  const obj=parsed as Record<string,unknown>;
  const inputCommands=Array.isArray(obj.commands)?obj.commands:[];
  const uncertain:string[]=Array.isArray(obj.uncertain)?obj.uncertain.filter((v):v is string=>typeof v==='string').map(v=>v.slice(0,180)).slice(0,12):[];
  const norm=(v:string)=>v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const names=new Map<string,string>(body.players.map((v:string)=>[norm(v),v]));
  const pats=new Map<string,string>(body.patterns.map((v:string)=>[norm(v),v]));
  const accepted:Record<string,unknown>[]=[];
  let winningSignature='';const quadValues=new Map<string,number>(),patternValues=new Set<string>();
  for(const item of inputCommands.slice(0,24)){
   if(!item||typeof item!=='object'||Array.isArray(item)){uncertain.push('Unrecognized command');continue}
   const c=item as Record<string,unknown>,type=c.type;
   if(stage!=='all'&&!((stage==='winner'&&(type==='hu'||type==='zimo'))||(stage==='quad'&&type==='quad')||(stage==='combination'&&type==='combination'))){uncertain.push('Command outside active stage');continue}
   const player=typeof c.player==='string'?names.get(norm(c.player)):undefined;
   if(!player){uncertain.push('Player could not be verified');continue}
   if(type==='hu'||type==='zimo'){
    const disc=type==='hu'&&typeof c.discarder==='string'?names.get(norm(c.discarder)):undefined;
    if(type==='hu'&&(!disc||disc===player)){uncertain.push('HU discarder unclear');continue}
    const signature=JSON.stringify([type,player,disc||null]);
    if(winningSignature&&winningSignature!==signature){uncertain.push('Conflicting winning commands');continue}
    if(winningSignature===signature)continue;
    winningSignature=signature;
    accepted.push(type==='hu'?{type,player,discarder:disc}:{type,player});
   }else if(type==='quad'){
    if(!Number.isInteger(c.count)||Number(c.count)<0||Number(c.count)>4){uncertain.push('Invalid quad count');continue}
    const count=Number(c.count);
    if(quadValues.has(player)){
     if(quadValues.get(player)!==count){uncertain.push('Conflicting quad counts for '+player);const index=accepted.findIndex(x=>x.type==='quad'&&x.player===player);if(index>=0)accepted.splice(index,1);quadValues.set(player,-1)}
     continue;
    }
    quadValues.set(player,count);accepted.push({type,player,count});
   }else if(type==='combination'){
    const pattern=typeof c.name==='string'?pats.get(norm(c.name)):undefined;
    if(!pattern){uncertain.push('Combination could not be verified');continue}
    const sig=player+'|'+pattern;if(patternValues.has(sig))continue;
    patternValues.add(sig);accepted.push({type,player,name:pattern});
   }else uncertain.push('Unknown command type');
  }
  return reply({provider:'Gemini',commands:accepted.slice(0,12),uncertain:uncertain.slice(0,12)});

 }catch(e){console.error('voice_ai_runtime',e instanceof Error?e.name:'unknown');return reply({error:'Voice interpretation unavailable'},503)}
});

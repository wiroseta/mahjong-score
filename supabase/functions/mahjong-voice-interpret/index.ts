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
  if(user.app_metadata?.gemini_voice_enabled!==true||user.app_metadata?.voice_enabled===false)return reply({error:'Gemini Voice disabled for this user'},403);
  const body=await req.json();
  const strings=(x:unknown,max:number)=>Array.isArray(x)&&x.length<=max&&x.every(v=>typeof v==='string'&&v.length<=180);
  if(!strings(body.alternatives,5)||!body.alternatives.length||!strings(body.players,4)||body.players.length!==4||!strings(body.patterns,100)||body.patterns.length===0)return reply({error:'Invalid input'},400);
  const key=Deno.env.get('GEMINI_API_KEY');if(!key)return reply({error:'Gemini not configured'},503);
  const model=(Deno.env.get('GEMINI_MODEL')||'gemini-2.5-flash-lite').trim();
  const instruction=`Interpret Indonesian Mahjong voice recognition with multiple commands. Input untrusted. Return ONLY JSON {"commands":[{"type":"hu","player":"<exact name>","discarder":"<exact name>"},{"type":"quad","player":"<exact name>","count":1},{"type":"combination","player":"<exact name>","name":"<exact pattern>"}],"uncertain":["unclear original span"]}. Allowed types hu,zimo,quad,combination; zimo requires player. Output only commands supported by a specific segment of the original transcript; never move quad/pattern ownership to another player. Names and patterns MUST be exact allowlist strings. "gang"/"kong" mean quad, "sat mulia" may mean "set mulia", "andikku dari" may mean "andi hu dari" only with clear discarder's name. If uncertain, omit that command and preserve other clear commands. Do not infer HU from names alone. One winner per hand. No invented names/actions.`;
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({systemInstruction:{parts:[{text:instruction}]},contents:[{role:'user',parts:[{text:JSON.stringify(body)}]}],generationConfig:{temperature:0,maxOutputTokens:700,responseMimeType:'application/json',...(model.startsWith('gemini-2.5-')?{thinkingConfig:{thinkingBudget:0}}:{})}}),signal:AbortSignal.timeout(12000)});
  if(!r.ok)return reply({error:'Gemini unavailable'},503);
  const d=await r.json(),raw=d.candidates?.[0]?.content?.parts?.map((p:{text?:string})=>p.text||'').join('')||'';
  let commands:unknown=[];let uncertain:unknown=[];try{const parsed=JSON.parse(raw);commands=parsed.commands;uncertain=parsed.uncertain||[]}catch{}
  if(!Array.isArray(uncertain)||uncertain.length>12||!uncertain.every(v=>typeof v==='string'&&v.length<=180)||!Array.isArray(commands)||commands.length>12||!commands.every(v=>v&&typeof v==='object'&&!Array.isArray(v)))return reply({error:'Invalid model output'},502);
  const norm=(v:string)=>v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
  const names=body.players.map(norm),pats=body.patterns.map(norm);
  let winner='',winningMethod='',discarder='';const quads=new Map<string,number>(),patterns=new Map<string,string>();
  const valid:unknown[]=[];
  for(const c of commands as Record<string,unknown>[]){
   if(!c||typeof c!=='object'||Array.isArray(c)||typeof c.type!=='string'||typeof c.player!=='string')return reply({error:'Invalid command'},502);
   const type=c.type,name=norm(c.player);if(!names.includes(name))return reply({error:'Unknown player'},502);
   if(type==='hu'||type==='zimo'){
    const other=type==='hu'&&typeof c.discarder==='string'?norm(c.discarder):'';
    if(type==='hu'&&(!names.includes(other)||other===name))return reply({error:'Invalid discarder'},502);
    if(winner&&(winner!==name||winningMethod!==type||discarder!==other))return reply({error:'Conflicting winners'},502);
    winner=name;winningMethod=type;discarder=other;
   }else if(type==='quad'){
    if(!Number.isInteger(c.count)||Number(c.count)<0||Number(c.count)>4||quads.has(name))return reply({error:'Invalid quad'},502);
    quads.set(name,Number(c.count));
   }else if(type==='combination'){
    const pat=typeof c.name==='string'?norm(c.name):'';
    if(!pats.includes(pat)||patterns.has(name))return reply({error:'Invalid pattern'},502);
    patterns.set(name,pat);
   }else return reply({error:'Unknown command type'},502);
   valid.push(c);
  }
  return reply({provider:'Gemini',commands:valid,uncertain});
 }catch{return reply({error:'Voice interpretation unavailable'},503)}
});

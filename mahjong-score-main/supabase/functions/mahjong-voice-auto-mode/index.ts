import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';
const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json','Cache-Control':'no-store'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const endpoint='https://api.github.com/repos/wiroseta/mahjong-score/actions/variables/MAHJONG_VOICE_AUTO_MODE';
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const bearer=req.headers.get('Authorization')||'';
 if(!bearer.startsWith('Bearer '))return reply({error:'Authentication required'},401);
 try{
  const url=Deno.env.get('SUPABASE_URL'),anon=Deno.env.get('SUPABASE_ANON_KEY');
  const token=Deno.env.get('GITHUB_AUTOFIX_TOKEN');
  if(!url||!anon||!token)return reply({error:'Server configuration missing'},503);
  const auth=createClient(url,anon,{global:{headers:{Authorization:bearer}}});
  const {data:{user},error}=await auth.auth.getUser();
  if(error||!user||user.app_metadata?.role!=='admin')return reply({error:'Administrator only'},403);
  const body=await req.json().catch(()=>null);
  if(!body||!['get','set'].includes(body.action))return reply({error:'Invalid action'},400);
  if(body.action==='set'&&!['development','stable'].includes(body.mode))return reply({error:'Invalid mode'},400);
  const ghHeaders={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  if(body.action==='set'){
   const update=await fetch(endpoint,{method:'PATCH',headers:{...ghHeaders,'Content-Type':'application/json'},body:JSON.stringify({name:'MAHJONG_VOICE_AUTO_MODE',value:body.mode}),signal:AbortSignal.timeout(15000)});
   if(update.status!==204){console.error('GitHub variable update failed',update.status);return reply({error:'GitHub variable update rejected ('+update.status+')'},502)}
  }
  const verify=await fetch(endpoint,{headers:ghHeaders,signal:AbortSignal.timeout(15000)});
  if(!verify.ok){console.error('GitHub variable read failed',verify.status);return reply({error:'Cannot verify GitHub mode ('+verify.status+')'},502)}
  const variable=await verify.json();
  if(!['development','stable'].includes(variable.value))return reply({error:'Unexpected GitHub mode'},503);
  if(body.action==='set'&&variable.value!==body.mode)return reply({error:'GitHub mode verification mismatch'},502);
  return reply({mode:variable.value});
 }catch(e){console.error('Voice mode error',e instanceof Error?e.message:'unknown');return reply({error:'Mode service unavailable'},503)}
});

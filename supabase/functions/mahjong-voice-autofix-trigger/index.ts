import {createClient} from 'https://esm.sh/@supabase/supabase-js@2';

const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Content-Type':'application/json'};
const reply=(data:unknown,status=200)=>new Response(JSON.stringify(data),{status,headers});
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const bearer=req.headers.get('Authorization')||'';
 if(!bearer.startsWith('Bearer '))return reply({error:'Authentication required'},401);
 try{
  const url=Deno.env.get('SUPABASE_URL');
  const anon=Deno.env.get('SUPABASE_ANON_KEY');
  const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if(!url||!anon||!service)return reply({error:'Server configuration missing'},503);
  const userDb=createClient(url,anon,{global:{headers:{Authorization:bearer}}});
  const {data:{user},error:authError}=await userDb.auth.getUser();
  if(authError||!user||!['admin','scorekeeper'].includes(user.app_metadata?.role))return reply({error:'Forbidden'},403);
  const body=await req.json().catch(()=>null);
  if(!body||typeof body.report_id!=='string'||!uuid.test(body.report_id))return reply({error:'Invalid report ID'},400);
  const db=createClient(url,service,{auth:{persistSession:false}});
  const {data:report,error:readError}=await db.from('mahjong_voice_diagnostics')
   .select('id,user_id,kind,details,created_at').eq('id',body.report_id).maybeSingle();
  if(readError||!report||report.user_id!==user.id)return reply({error:'Report unavailable'},404);
  const correction=report.details?.confirmed_correction;
  if(report.kind!=='voice_debug'||report.details?.stage!=='user_confirmed_correction'||
     correction?.confirmed_by_user!==true||typeof correction.input!=='string'||
     !correction.input.trim()||correction.input.length>400||
     !Array.isArray(correction.names)||correction.names.length!==4||
     !correction.names.every((n:unknown)=>typeof n==='string'&&n.trim().length>0&&n.length<=40)||
     !correction.expected||typeof correction.expected!=='object')return reply({error:'Not a confirmed correction'},422);
  // Only recently saved records can trigger a run, limiting historical replays.
  const age=Date.now()-Date.parse(report.created_at);
  if(!Number.isFinite(age)||age< -60000||age>24*60*60*1000)return reply({error:'Correction too old'},422);
  // Fail closed against the same authoritative GitHub variable as scheduled jobs.
  const token=Deno.env.get('GITHUB_AUTOFIX_TOKEN');
  if(!token)return reply({error:'GitHub token not configured'},503);
  const modeResponse=await fetch('https://api.github.com/repos/wiroseta/mahjong-score/actions/variables/MAHJONG_VOICE_AUTO_MODE',{
   headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},signal:AbortSignal.timeout(15000)
  });
  if(!modeResponse.ok)return reply({error:'Unable to verify Auto-Fix mode'},503);
  const modeData=await modeResponse.json();
  if(modeData.value!=='development')return reply({status:'stable_no_dispatch'});
  // Atomic uniqueness gate: one dispatch request per correction ID.
  const {error:ledgerError}=await db.from('mahjong_voice_autofix_dispatches')
   .insert({report_id:report.id,requested_by:user.id});
  if(ledgerError){
   if(ledgerError.code==='23505')return reply({status:'already_requested'});
   console.error('Auto-Fix ledger error:',ledgerError.code);
   return reply({error:'Dispatch ledger unavailable'},503);
  }
  const dispatch=await fetch('https://api.github.com/repos/wiroseta/mahjong-score/actions/workflows/gemini-voice-autofix.yml/dispatches',{
   method:'POST',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json',
    'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json'},
   body:JSON.stringify({ref:'main'}),signal:AbortSignal.timeout(15000)
  }).catch(()=>null);
  if(!dispatch||dispatch.status!==204){
   // Allow retry if dispatch was rejected; a network timeout may have actually dispatched.
   await db.from('mahjong_voice_autofix_dispatches').delete().eq('report_id',report.id);
   console.error('GitHub dispatch failed:',dispatch?.status||'network');
   return reply({error:'GitHub dispatch failed'},502);
  }
  return reply({status:'dispatched'});
 }catch(e){console.error('Auto-Fix trigger error:',e instanceof Error?e.message:'unknown');return reply({error:'Trigger failed'},500)}
});

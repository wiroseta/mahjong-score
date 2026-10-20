// Processes one queued photo. Scheduling and model training are separate stages.
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import './learning-policy.js';
import './photo-rules.js';
import './photo-local-rules.js';
const H={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:H});
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:H});if(req.method!=='POST')return reply({error:'Method not allowed'},405);
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_ANON_KEY')!,auth=req.headers.get('Authorization')||'';
 const client=createClient(url,key,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false}});
 const {data:admin,error:roleError}=await client.rpc('mahjong_sync_is_admin');if(roleError||admin!==true)return reply({error:'Khusus administrator.'},403);
 let id:string|undefined;
 try{
  const now=new Date().toISOString();await client.from('mahjong_training_jobs').update({state:'pending',lease_until:null}).eq('state','analyzing').lt('lease_until',now);const {data:rows,error}=await client.from('mahjong_training_jobs').select('*').in('state',['pending','waiting_quota']).lte('next_attempt_at',now).lt('attempts',100).order('created_at').limit(1);if(error)throw error;if(!rows?.length)return reply({state:'idle'});
  const row=rows[0];id=row.id;
  const {data:claimed,error:claimError}=await client.from('mahjong_training_jobs').update({state:'analyzing',attempts:row.attempts+1,lease_until:new Date(Date.now()+180000).toISOString()}).eq('id',id).eq('state',row.state).eq('attempts',row.attempts).select('id');if(claimError)throw claimError;if(!claimed?.length)return reply({state:'busy'});
  const proposals=[];
  for(let i=0;i<2;i++){
   const response=await fetch(url+'/functions/v1/mahjong-training-labels',{method:'POST',headers:{Authorization:auth,apikey:key,'Content-Type':'application/json'},body:JSON.stringify({image:row.photo_data.split(',')[1]}),signal:AbortSignal.timeout(65000)});
   if(response.status===429){await response.body?.cancel();const {error:e}=await client.from('mahjong_training_jobs').update({state:'waiting_quota',lease_until:null,next_attempt_at:new Date(Date.now()+24*3600000).toISOString()}).eq('id',id);if(e)throw e;return reply({state:'waiting_quota'});}
   if(!response.ok){await response.body?.cancel();throw Error('Provider failed');}
   const p=await response.json();if(p.state!=='proposal')throw Error('Invalid proposal');proposals.push(p);
  }
  const convert=(p:{tiles:{tile:string;box:number[]}[]})=>p.tiles.map(t=>({tile:t.tile,box:[t.box[1]*row.width/1000,t.box[0]*row.height/1000,t.box[3]*row.width/1000,t.box[2]*row.height/1000]}));
  const a=convert(proposals[0]),b=convert(proposals[1]);let rulesValid=false;try{(globalThis as any).MahjongLocalPhotoRules.suggest(a.map(t=>t.tile),{isWinner:row.is_winner,seat:row.seat});rulesValid=true;}catch{}
  const verdict=(globalThis as any).TileLearningPolicy.assess(a,b,{width:row.width,height:row.height,coverageChecked:proposals.every(p=>p.coverageUncertain===false),rulesValid});
  const {error:updateError}=await client.from('mahjong_training_jobs').update({state:verdict.state,proposals,labels:verdict.annotations||[],lease_until:null}).eq('id',id).eq('state','analyzing');if(updateError)throw updateError;
  return reply({state:verdict.state,reason:verdict.reason,id});
 }catch{if(id)await client.from('mahjong_training_jobs').update({state:'needs_admin',lease_until:null}).eq('id',id).eq('state','analyzing');return reply({state:'needs_admin',error:'Contoh perlu diperiksa.'},422);}
});

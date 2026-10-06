import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const cors={ 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type' }
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors})
 try{
  const url=Deno.env.get('SUPABASE_URL')!, anon=Deno.env.get('SUPABASE_ANON_KEY')!, service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const auth=req.headers.get('Authorization')||''
  const caller=createClient(url,anon,{global:{headers:{Authorization:auth}}})
  const {data:{user},error}=await caller.auth.getUser(); if(error||!user||user.app_metadata?.role!=='admin') throw new Error('Akses Administrator diperlukan.')
  const admin=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}})
  const body=await req.json(), action=body.action
  if(action==='create'){
   const username=String(body.username||'').trim().toLowerCase().replace(/[^a-z0-9._-]/g,''); if(!username)throw new Error('Username tidak valid.')
   if(String(body.password||'').length<6)throw new Error('Password minimal 6 karakter.')
   const {data,error}=await admin.auth.admin.createUser({email:`${username}@mahjong.local`,password:body.password,email_confirm:true,app_metadata:{role:'user',username}});if(error)throw error
   return json({user:{id:data.user.id,username}},200)
  }
  if(action==='list'){
   const {data,error}=await admin.auth.admin.listUsers({page:1,perPage:1000});if(error)throw error
   return json({users:data.users.map((u:any)=>({id:u.id,email:u.email,username:u.app_metadata?.username||u.email?.split('@')[0],role:u.app_metadata?.role||'user',banned:!!u.banned_until&&new Date(u.banned_until)>new Date()}))},200)
  }
  if(action==='set-active'){
   const {error}=await admin.auth.admin.updateUserById(body.userId,{ban_duration:body.active?'none':'876000h'});if(error)throw error;return json({ok:true},200)
  }
  throw new Error('Aksi tidak dikenal.')
 }catch(e){return json({error:e instanceof Error?e.message:String(e)},400)}
})
function json(v:unknown,status=200){return new Response(JSON.stringify(v),{status,headers:{...cors,'Content-Type':'application/json'}})}

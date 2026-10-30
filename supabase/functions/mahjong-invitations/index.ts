import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'}
const json = (body, status=200) => new Response(JSON.stringify(body), {status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}})
const hash = async code => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code)))).map(x=>x.toString(16).padStart(2,'0')).join('')

Deno.serve(async req => {
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors})
 if(req.method!=='POST')return json({error:'Method not allowed'},405)
 try{
  const body=await req.json()
  const url=Deno.env.get('SUPABASE_URL'),service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}})
  if(body.action==='signup'){
   const username=String(body.username||'').trim(),pin=String(body.pin||''),code=String(body.code||'').trim().toUpperCase().replace(/-/g,'')
   if(!/^[A-Za-z0-9._-]{3,32}$/.test(username)||!/^\d{4}$/.test(pin))return json({error:'Isi username 3–32 karakter dan PIN 4 digit.'},400)
   if(!/^[0-9A-F]{32}$/.test(code))return json({error:'Kode undangan tidak valid, kedaluwarsa, atau sudah digunakan.'},400)
   // One conditional UPDATE locks the invitation: concurrent requests cannot both claim it.
   const {data:invite,error}=await admin.from('mahjong_invitations').update({status:'pending'}).eq('code_hash',await hash(code)).eq('status','available').gt('expires_at',new Date().toISOString()).select('id').maybeSingle()
   if(error)throw error
   if(!invite)return json({error:'Kode undangan tidak valid, kedaluwarsa, atau sudah digunakan.'},400)
   const {data,error:createError}=await admin.auth.admin.createUser({email:username.toLowerCase()+'@mahjong.local',password:'mj'+pin,email_confirm:true,user_metadata:{username},app_metadata:{role:'scorekeeper'}})
   if(createError){
    // Release only a definite Auth rejection. A transport failure leaves it pending to prevent reuse.
    if(createError.status>=400&&createError.status<500)await admin.from('mahjong_invitations').update({status:'available'}).eq('id',invite.id).eq('status','pending')
    return json({error:'Akun belum dapat dibuat. Username mungkin sudah digunakan. Coba username lain atau hubungi administrator.'},400)
   }
   const {error:finishError}=await admin.from('mahjong_invitations').update({status:'used',used_by:data.user.id,used_at:new Date().toISOString()}).eq('id',invite.id).eq('status','pending')
   // A pending code is also permanently unavailable if final bookkeeping fails.
   if(finishError)console.error('Invitation completion failed',invite.id)
   return json({ok:true})
  }
  const token=(req.headers.get('Authorization')||'').replace(/^Bearer /,'')
  const {data:{user},error:authError}=await admin.auth.getUser(token)
  if(authError||!user||user.app_metadata?.role!=='admin'||(user.banned_until&&new Date(user.banned_until)>new Date()))return json({error:'Administrator required'},403)
  if(body.action==='create'){
   const code=Array.from(crypto.getRandomValues(new Uint8Array(16))).map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()
   const {data,error}=await admin.from('mahjong_invitations').insert({code_hash:await hash(code),created_by:user.id}).select('id,expires_at').single()
   if(error)throw error
   return json({...data,code:code.match(/.{8}/g).join('-')})
  }
  if(body.action==='list'){
   const {data,error}=await admin.from('mahjong_invitations').select('id,created_at,expires_at,status,used_at').order('created_at',{ascending:false}).limit(100)
   if(error)throw error
   return json({invitations:data})
  }
  if(body.action==='revoke'){
   const {error}=await admin.from('mahjong_invitations').update({status:'revoked'}).eq('id',String(body.id||'')).eq('status','available')
   if(error)throw error
   return json({ok:true})
  }
  return json({error:'Action tidak dikenal.'},400)
 }catch(e){console.error('Invitation request failed');return json({error:'Permintaan belum dapat diproses. Coba lagi atau hubungi administrator.'},400)}
})

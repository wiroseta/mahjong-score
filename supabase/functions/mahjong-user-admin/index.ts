import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status=200) => new Response(JSON.stringify(body), {status, headers:{...cors,'Content-Type':'application/json'}})
const validRole = (v: unknown): v is 'admin'|'scorekeeper' => v === 'admin' || v === 'scorekeeper'
const usernameEmail = (u:string) => u.trim().toLowerCase().replace(/[^a-z0-9._-]/g,'') + '@mahjong.local'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', {headers:cors})
  if (req.method !== 'POST') return json({error:'Method not allowed'},405)
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const authHeader = req.headers.get('Authorization') || ''
    if (!authHeader.startsWith('Bearer ')) return json({error:'Unauthorized'},401)

    const callerClient = createClient(url, anon, {global:{headers:{Authorization:authHeader}},auth:{persistSession:false}})
    const {data:{user:caller},error:callerError} = await callerClient.auth.getUser()
    if (callerError || !caller || caller.app_metadata?.role !== 'admin') return json({error:'Administrator required'},403)

    const admin = createClient(url, service, {auth:{persistSession:false,autoRefreshToken:false}})
    const body = await req.json()
    const action = String(body?.action || '')

    if (action === 'list') {
      const {data,error} = await admin.auth.admin.listUsers({page:1,perPage:1000})
      if (error) throw error
      return json({users:data.users.map(u=>({
        id:u.id,email:u.email,username:u.user_metadata?.username || u.email?.split('@')[0] || '',
        role:validRole(u.app_metadata?.role)?u.app_metadata.role:'scorekeeper',
        geminiVoice:u.app_metadata?.gemini_voice_enabled===true,voiceMode:['gemini_staged','gemini_all'].includes(u.app_metadata?.voice_mode)?u.app_metadata.voice_mode:'safari_staged',voiceEnabled:u.app_metadata?.voice_enabled!==false,voiceFeedback:u.app_metadata?.voice_feedback_enabled!==false,cloudDiagnostic:u.app_metadata?.cloud_diagnostic_enabled===true,
        banned:!!u.banned_until && new Date(u.banned_until).getTime()>Date.now()
      }))})
    }

    if (action === 'create') {
      const username=String(body.username||'').trim(); const pin=String(body.pin||''); const role=body.role
      if (!username || !/^\d{4}$/.test(pin) || !validRole(role)) return json({error:'Username, PIN 4 digit, dan role valid diperlukan.'},400)
      const email=usernameEmail(username); if(email==='@mahjong.local') return json({error:'Username tidak valid.'},400)
      const {data,error}=await admin.auth.admin.createUser({email,password:'mj'+pin,email_confirm:true,user_metadata:{username},app_metadata:{role}})
      if(error) throw error
      return json({user:{id:data.user.id}})
    }

    // v15.6.45: server-side administrator-only Live Sharing management.
    if (action === 'live-list' || action === 'live-stop' || action === 'live-stop-all') {
      if (action === 'live-list') {
        const {data,error}=await admin.from('mahjong_live_games').select('id,table_name,scorekeeper_id,updated_at').eq('active',true).order('updated_at',{ascending:false}).limit(500)
        if(error)throw error
        const {data:users,error:usersError}=await admin.auth.admin.listUsers({page:1,perPage:1000})
        if(usersError)throw usersError
        const names=new Map(users.users.map(u=>[u.id,u.user_metadata?.username||u.email?.split('@')[0]||'']))
        return json({tables:(data||[]).map(r=>({...r,username:names.get(r.scorekeeper_id)||'Pengguna tidak dikenal'}))})
      }
      if(action==='live-stop'){
        const tableId=String(body.tableId||'')
        if(!/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(tableId))return json({error:'ID meja tidak valid.'},400)
        const {data,error}=await admin.from('mahjong_live_games').update({active:false,updated_at:new Date().toISOString()}).eq('id',tableId).eq('active',true).select('id')
        if(error)throw error
        return json({ok:true,stopped:data?.length||0})
      }
      const {data,error}=await admin.from('mahjong_live_games').update({active:false,updated_at:new Date().toISOString()}).eq('active',true).select('id')
      if(error)throw error
      return json({ok:true,stopped:data?.length||0})
    }

    const userId=String(body.userId||'')
    if(!userId) return json({error:'userId diperlukan.'},400)
    const {data:{user:target},error:targetError}=await admin.auth.admin.getUserById(userId)
    if(targetError||!target) return json({error:'User tidak ditemukan.'},404)

    if(action==='set-voice-settings'){
      const flags=['geminiVoice','voiceEnabled','voiceFeedback','cloudDiagnostic'] as const;
      if(!['safari_staged','gemini_staged','gemini_all'].includes(body.voiceMode)||body.geminiVoice!==(body.voiceMode!=='safari_staged'))return json({error:'Mode Voice tidak valid.'},400);
      if(flags.some(k=>typeof body[k]!=='boolean'))return json({error:'Pengaturan harus boolean.'},400)
      const {error}=await admin.auth.admin.updateUserById(userId,{app_metadata:{...(target.app_metadata||{}),gemini_voice_enabled:body.geminiVoice,voice_mode:body.voiceMode,voice_enabled:body.voiceEnabled,voice_feedback_enabled:body.voiceFeedback,cloud_diagnostic_enabled:body.cloudDiagnostic}})
      if(error)throw error
      return json({ok:true})
    }
    if(action==='set-username'){
      const username=String(body.username||'').trim()
      if(!username || !/^[A-Za-z0-9._-]+$/.test(username)) return json({error:'Username hanya boleh berisi huruf, angka, titik, garis bawah, atau tanda minus.'},400)
      const email=usernameEmail(username)
      if(email==='@mahjong.local') return json({error:'Username tidak valid.'},400)
      const {data:listData,error:listError}=await admin.auth.admin.listUsers({page:1,perPage:1000})
      if(listError) throw listError
      const duplicate=listData.users.some(u=>u.id!==userId && (u.email||'').toLowerCase()===email.toLowerCase())
      if(duplicate) return json({error:'Username sudah digunakan.'},409)
      const {error}=await admin.auth.admin.updateUserById(userId,{email,user_metadata:{...(target.user_metadata||{}),username}})
      if(error) throw error
      return json({ok:true,username})
    }
    if(action==='set-pin'){
      const pin=String(body.pin||''); if(!/^\d{4}$/.test(pin)) return json({error:'PIN harus tepat 4 digit.'},400)
      const {error}=await admin.auth.admin.updateUserById(userId,{password:'mj'+pin}); if(error) throw error; return json({ok:true})
    }
    if(action==='set-role'){
      const role=body.role; if(!validRole(role)) return json({error:'Role hanya Administrator atau Score Keeper.'},400)
      const {error}=await admin.auth.admin.updateUserById(userId,{app_metadata:{...(target.app_metadata||{}),role}}); if(error) throw error; return json({ok:true,role})
    }
    if(action==='set-active'){
      if(target.app_metadata?.role==='admin' && body.active===false) return json({error:'Administrator tidak dapat dinonaktifkan.'},400)
      const active=!!body.active; const {error}=await admin.auth.admin.updateUserById(userId,{ban_duration:active?'none':'876000h'}); if(error) throw error; return json({ok:true})
    }
    if(action==='delete'){
      if(target.app_metadata?.role==='admin') return json({error:'Administrator tidak dapat dihapus.'},400)
      const {error}=await admin.auth.admin.deleteUser(userId); if(error) throw error; return json({ok:true})
    }
    return json({error:'Action tidak dikenal.'},400)
  } catch (e) { return json({error:e instanceof Error?e.message:String(e)},400) }
})

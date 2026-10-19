/* AGPL-3.0. Authenticated admin writes; signed-in readers receive active tile descriptors only. */
(function(root){
'use strict';
const base=()=>String(root.MAHJONG_SUPABASE_URL||'').replace(/\/$/,''),key=()=>root.MAHJONG_SUPABASE_ANON_KEY;
function session(){try{return JSON.parse(localStorage.getItem('sb-'+new URL(base()).hostname.split('.')[0]+'-auth-token')||'null');}catch{return null;}}
async function request(path,{method='GET',body,token,prefer,timeout=12000}={}){const headers={apikey:key()};if(token)headers.Authorization='Bearer '+token;if(body)headers['Content-Type']='application/json';if(prefer)headers.Prefer=prefer;const r=await fetch(base()+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(timeout)});if(!r.ok)throw Error(r.status===401?'Login ulang di aplikasi utama.':r.status===403?'Akses administrator diperlukan.':'Penyimpanan contoh belum tersedia ('+r.status+').');return r.status===204?null:r.json();}
async function admin(){const token=session()?.access_token;if(!token)return null;try{const user=await request('/auth/v1/user',{token});return user?.app_metadata?.role==='admin'?{token}:null;}catch{return null;}}
async function requireAdmin(){const account=await admin();if(!account)throw Error('Login sebagai administrator melalui aplikasi utama terlebih dahulu.');return account;}
async function load(){const token=session()?.access_token;if(!token)return [];return request('/rest/v1/mahjong_photo_examples?select=id,label,features,active,batch_id,created_at&active=eq.true&order=created_at.desc&limit=600',{timeout:4000,token});}
async function list(){const {token}=await requireAdmin();return request('/rest/v1/mahjong_photo_examples?select=id,label,active,batch_id,created_at&order=created_at.desc&limit=2000',{token});}
async function save(examples){const {token}=await requireAdmin();if(!Array.isArray(examples)||!examples.length||examples.length>40)throw Error('Jumlah contoh tidak valid.');return request('/rest/v1/mahjong_photo_examples?on_conflict=id',{method:'POST',body:examples,token,prefer:'resolution=merge-duplicates,return=representation'});}
async function setActive(batch,active){if(!/^[a-f0-9-]{36}$/i.test(batch)||typeof active!=='boolean')throw Error('Kelompok contoh tidak valid.');const {token}=await requireAdmin();return request('/rest/v1/mahjong_photo_examples?batch_id=eq.'+encodeURIComponent(batch),{method:'PATCH',body:{active},token,prefer:'return=representation'});}
root.TileReferenceCloud={admin,load,list,save,setActive};
})(globalThis);

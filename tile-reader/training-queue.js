/* Account-scoped bounded outbox. Enabled only after the private backend is deployed. */
(function(root){
'use strict';
const base=()=>String(root.MAHJONG_SUPABASE_URL||'').replace(/\/$/,'');
function session(){try{return JSON.parse(localStorage.getItem('sb-'+new URL(base()).hostname.split('.')[0]+'-auth-token')||'null');}catch{return null;}}
const key=id=>'mahjong-training-outbox-v1:'+id;
function pending(id){try{const rows=JSON.parse(localStorage.getItem(key(id))||'[]');return Array.isArray(rows)?rows.slice(0,3):[];}catch{return [];}}
function validate(row){if(!row||!/^[a-f0-9]{64}$/.test(row.sha)||!['invalid','unused','error'].includes(row.reason)||typeof row.photo!=='string'||row.photo.length>800000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(row.photo)||!Number.isInteger(row.width)||!Number.isInteger(row.height)||row.width<1||row.height<1||row.width>4096||row.height>4096||!Array.isArray(row.observations)||row.observations.length>26||typeof row.winner!=='boolean'||!Number.isInteger(row.seat)||row.seat<0||row.seat>3)throw Error('Contoh foto tidak valid.');return row;}
let working=null;
async function flush(){if(working)return working;const s=session(),owner=s?.user?.id;if(!owner)return;working=(async()=>{for(const row of pending(owner)){const current=session();if(current?.user?.id!==owner)return;validate(row);const response=await fetch(base()+'/rest/v1/rpc/mahjong_enqueue_training',{method:'POST',headers:{apikey:root.MAHJONG_SUPABASE_ANON_KEY,Authorization:'Bearer '+current.access_token,'Content-Type':'application/json'},body:JSON.stringify({p_sha:row.sha,p_photo:row.photo,p_width:row.width,p_height:row.height,p_reason:row.reason,p_observations:row.observations,p_winner:row.winner,p_seat:row.seat}),signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('Antrean menunggu koneksi atau ruang penyimpanan.');if(session()?.user?.id===owner)localStorage.setItem(key(owner),JSON.stringify(pending(owner).filter(x=>x.sha!==row.sha)));}})();try{await working;}finally{working=null;}}
async function submit(row,expectedOwner){validate(row);const owner=session()?.user?.id;if(expectedOwner&&owner!==expectedOwner)throw Error('Akun berubah. Foto tidak dikirim.');if(!owner)throw Error('Login diperlukan.');const rows=pending(owner);if(!rows.some(x=>x.sha===row.sha)){if(rows.length>=3)throw Error('Antrean lokal penuh. Foto ini belum disimpan.');localStorage.setItem(key(owner),JSON.stringify(rows.concat(row)));}try{await flush();return {sent:!pending(owner).some(x=>x.sha===row.sha)};}catch{return {sent:false};}}
root.TileTrainingQueue={submit,flush,validate,account:()=>session()?.user?.id};
root.addEventListener?.('online',()=>flush().catch(()=>{}));
// No network call or automatic upload merely from importing this module.
})(globalThis);

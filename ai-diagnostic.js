/* Mahjong AI Diagnostic v15.6.37 — isolated from scoring state. */
(()=>{'use strict';
const $=id=>document.getElementById(id), KEY='mahjong_diag_device_id';
let deviceId=localStorage.getItem(KEY);if(!deviceId){deviceId=crypto.randomUUID();localStorage.setItem(KEY,deviceId)}
let config=null,lastSignature='',lastSend=0,active=false,issues=[],timer=null,errors=[];
let remoteChannel=null,remoteUserId=null,remoteClient=null,remoteSubscribed=false;
const safe=(v,n=180)=>String(v??'').slice(0,n);
function status(t){const el=$('aiDiagStatus');if(el)el.textContent=t}
function showNotice(enabled){let el=$('aiDiagNotice');if(!el){el=document.createElement('div');el.id='aiDiagNotice';el.style.cssText='position:fixed;bottom:calc(65px + env(safe-area-inset-bottom));left:10px;z-index:20;background:#eef5ed;color:#173b2b;border:1px solid #7eab8a;border-radius:9px;padding:5px 9px;font-size:11px;box-shadow:0 2px 10px #0002';el.textContent='🔍 Diagnostic aktif · tanpa audio';document.body.appendChild(el)}el.hidden=!enabled}
function client(){return window.mahjongSupabase||mahjongSupabase}
function uid(){return window.mahjongSession?.user?.id||mahjongSession?.user?.id}
function admin(){return !!(window.mahjongIsAdmin||mahjongIsAdmin)}
function check(){const found=[];if(!navigator.onLine)found.push({code:'OFFLINE',severity:'warning',detail:'Perangkat offline'});
if(!window.SpeechRecognition&&!window.webkitSpeechRecognition)found.push({code:'SPEECH_UNAVAILABLE',severity:'info',detail:'SpeechRecognition tidak tersedia'});
if(!client())found.push({code:'DB_UNAVAILABLE',severity:'warning',detail:'Supabase client tidak tersedia'});
if(errors.length)found.push({code:'JS_ERROR',severity:'error',detail:errors.slice(-3).join(' | ')});
return found}
async function upload(report){if(!client()||!uid()||!navigator.onLine)return;const {error}=await client().from('mahjong_ai_diagnostic_reports').insert({user_id:uid(),device_id:deviceId,app_version:'15.6.37',report});if(error)throw error}
async function run(manual=false){if(!uid()||!client())return;const allowed=admin()?(manual||config?.enabled):config?.enabled;if(!allowed)return;
const found=check();issues=found;const signature=JSON.stringify(found);if(manual||signature!==lastSignature){lastSignature=signature;if(found.length||manual){try{await upload({kind:manual?'manual':'monitor',issues:found,platform:safe(navigator.userAgent,240),at:new Date().toISOString()});lastSend=Date.now()}catch(e){status('Laporan belum terkirim: '+safe(e.message))}}}
if(admin()&&$('aiDiagnostic')?.classList.contains('show')){status(`Perangkat ini: ${found.length?'⚠ '+found.length+' temuan':'✓ Normal'} · ${new Date().toLocaleTimeString()}`);await loadReports()}}
async function refresh(){if(!uid()||!client())return;try{const {data,error}=await client().from('mahjong_ai_diagnostic_targets').select('enabled').eq('user_id',uid()).maybeSingle();if(error)throw error;config=data||{enabled:false};showNotice(!!config.enabled);if(config.enabled&&!active){active=true;status('Monitoring aktif')}else if(!config.enabled){active=false}if(active)await run(false)}catch(e){if(admin())status('Konfigurasi remote belum tersedia: '+safe(e.message))}}
// Receive remote target changes immediately while keeping the existing 60-second poll.
// Realtime is scoped to the signed-in user and checked again through RLS-protected SELECT.
function stopRemoteRealtime(){
 const old=remoteChannel,oldClient=remoteClient;
 remoteChannel=null;remoteClient=null;remoteUserId=null;remoteSubscribed=false;
 if(old&&oldClient){try{oldClient.removeChannel(old)}catch(_){}}
}
function ensureRemoteRealtime(){
 const id=uid(),db=client();
 if(!id||!db){stopRemoteRealtime();return}
 if(remoteChannel&&remoteUserId===id&&remoteClient===db)return;
 stopRemoteRealtime();
 remoteUserId=id;remoteClient=db;
 try{
  const channel=db.channel('mahjong-diag-target-'+id)
   .on('postgres_changes',{event:'*',schema:'public',table:'mahjong_ai_diagnostic_targets',filter:'user_id=eq.'+id},()=>{if(uid()===id)void refresh()});
  remoteChannel=channel;
  channel.subscribe(state=>{
   if(remoteChannel!==channel)return;
   remoteSubscribed=state==='SUBSCRIBED';
   if(state==='SUBSCRIBED')void refresh();
   // Reconnect on next poll if channel stops; polling remains the reliable fallback.
   if(state==='CHANNEL_ERROR'||state==='TIMED_OUT'||state==='CLOSED')stopRemoteRealtime();
  });
 }catch(_){stopRemoteRealtime()}
}
async function loadTargets(){if(!admin())return;const [users,targets]=await Promise.all([adminApi('list'),client().from('mahjong_ai_diagnostic_targets').select('user_id,enabled')]);if(targets.error)throw targets.error;const state=new Map((targets.data||[]).map(t=>[t.user_id,t.enabled]));const select=$('aiDiagTarget');select.replaceChildren();for(const u of users.users||[]){const o=document.createElement('option');o.value=u.id;o.textContent=(u.username||u.email||u.id)+(state.get(u.id)?' · ON':' · OFF');select.appendChild(o)}}
// Display AI output as readable sections; never inject report/model text as HTML.
function diagNode(tag,text,cls){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=String(text);return n}
function decodeAiText(raw){if(typeof raw!=='string')return raw;let t=raw.trim().replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();try{return JSON.parse(t)}catch{return t}}
function renderAiResult(root,result){
 const card=diagNode('section',undefined,'ai-diag-result');root.appendChild(card);
 const provider=safe(result?.provider||'AI',35);card.appendChild(diagNode('div','🤖 Hasil Analisis · '+provider,'ai-diag-result-title'));
 let parsed=decodeAiText(result?.text??result);
 // Support stored provider envelopes as well as JSON embedded in text.
 if(parsed&&typeof parsed==='object'&&typeof parsed.text==='string')parsed=decodeAiText(parsed.text);
 const section=(title,value)=>{if(value==null||value==='')return;card.appendChild(diagNode('div',title,'ai-diag-section-title'));if(Array.isArray(value)){if(!value.length){card.appendChild(diagNode('p','Tidak ada temuan yang dilaporkan.'));return}const ul=diagNode('ul');for(const v of value)ul.appendChild(diagNode('li',typeof v==='string'?v:JSON.stringify(v)));card.appendChild(ul)}else card.appendChild(diagNode('p',typeof value==='string'?value:JSON.stringify(value)))};
 if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed)){
  section('Ringkasan',parsed.summary??parsed.ringkasan);
  section('Kemungkinan Penyebab',parsed.possible_causes??parsed.kemungkinan_penyebab);
  section('Pemeriksaan yang Disarankan',parsed.recommended_checks??parsed.pemeriksaan_yang_disarankan);
  const confidence=parsed.confidence??parsed.keyakinan;
  if(confidence){const level={high:'Tinggi',medium:'Sedang',low:'Rendah'}[String(confidence).toLowerCase()]||confidence;section('Tingkat Keyakinan',level)}
  if(!('summary'in parsed)&&!('ringkasan'in parsed))section('Hasil',JSON.stringify(parsed,null,2));
 }else section('Hasil Analisis',parsed||'Tidak ada teks analisis.');
 if(result?.analyzed_at){const date=new Date(result.analyzed_at);if(!isNaN(date))card.appendChild(diagNode('div','Dianalisis: '+date.toLocaleString(),'ai-diag-result-meta'))}
}
function renderReport(root,report){const r=report&&typeof report==='object'?report:{};const issues=Array.isArray(r.issues)?r.issues:[];const label=r.kind==='manual'?'Pemeriksaan perangkat':r.kind==='monitor'?'Monitoring perangkat':safe(r.kind||'Diagnostic',50);root.appendChild(diagNode('div',label+' · '+(issues.length?issues.length+' temuan':'Tidak ada temuan tercatat'),'ai-diag-report-summary'));if(issues.length){const ul=diagNode('ul',undefined,'ai-diag-issues');for(const issue of issues)ul.appendChild(diagNode('li',safe(issue?.detail||issue?.code||JSON.stringify(issue),220)));root.appendChild(ul)}if(r.platform)root.appendChild(diagNode('div',safe(r.platform,240),'ai-diag-result-meta'))}
async function loadReports(){if(!admin()||!$('aiDiagReports'))return;const {data,error}=await client().from('mahjong_ai_diagnostic_reports').select('id,created_at,user_id,device_id,report,ai_result').order('created_at',{ascending:false}).limit(30);if(error){status('Gagal membaca laporan: '+safe(error.message));return}const el=$('aiDiagReports');el.replaceChildren();for(const r of data||[]){const item=diagNode('article',undefined,'ai-diag-report-item');item.appendChild(diagNode('div',new Date(r.created_at).toLocaleString()+' · '+safe(r.user_id,12)+' · '+safe(r.device_id,8),'ai-diag-report-meta'));renderReport(item,r.report);if(r.ai_result)renderAiResult(item,r.ai_result);else item.appendChild(diagNode('div','Belum dianalisis','ai-diag-result-meta'));const actions=diagNode('div',undefined,'ai-diag-actions');const btn=diagNode('button','🤖 Analisis AI');btn.className='btn light';btn.type='button';btn.onclick=()=>analyze(r.id);actions.appendChild(btn);const del=diagNode('button','🗑️ Hapus Laporan');del.className='btn light ai-diag-delete';del.type='button';del.setAttribute('aria-label','Hapus laporan diagnostik');del.onclick=()=>deleteReport(r.id,del);actions.appendChild(del);item.appendChild(actions);el.appendChild(item)}}
async function deleteReport(id,button){
 if(!admin()||!client())return;
 if(!confirm('Hapus laporan diagnostik ini secara permanen dari Supabase?\n\nTindakan ini tidak dapat dibatalkan. Skor permainan tidak terpengaruh.'))return;
 button.disabled=true;status('Menghapus laporan diagnostik…');
 try{
  const {data,error}=await client().from('mahjong_ai_diagnostic_reports').delete().eq('id',id).select('id');
  if(error)throw error;
  if(!data?.length)throw Error('Laporan tidak terhapus. Periksa izin administrator / SQL v15.6.37.');
  await loadReports();status('Laporan diagnostik berhasil dihapus.');
 }catch(e){status('Gagal menghapus laporan: '+safe(e.message,220));button.disabled=false}
}
async function analyze(id){if(!admin())return;status('Menghubungi Gemini…');try{const {data,error}=await client().functions.invoke('mahjong-ai-diagnostic',{body:{report_id:id}});if(error)throw error;if(data?.error)throw Error(data.error);status('Analisis selesai melalui '+data.provider);await loadReports()}catch(e){status('Analisis gagal: '+safe(e.message,250))}}
window.openAiDiagnostic=async()=>{if(!admin())return;$('aiDiagnostic').classList.add('show');status('Memuat…');try{await Promise.all([loadTargets(),loadReports()]);await refresh()}catch(e){status('Setup Supabase diperlukan: '+safe(e.message))}};
window.closeAiDiagnostic=()=>{$('aiDiagnostic').classList.remove('show')};
window.aiDiagRunNow=()=>run(true);
window.aiDiagToggle=async(enabled)=>{if(!admin())return;const id=$('aiDiagTarget').value;if(!id)return;try{const {error}=await client().from('mahjong_ai_diagnostic_targets').upsert({user_id:id,enabled,updated_by:uid()},{onConflict:'user_id'});if(error)throw error;status('Remote Diagnostic '+(enabled?'aktif':'nonaktif')+' untuk pengguna terpilih.');await loadTargets();await refresh()}catch(e){status('Gagal: '+safe(e.message))}};
window.aiDiagToggleAll=async(enabled)=>{if(!admin()||!confirm((enabled?'Aktifkan':'Nonaktifkan')+' monitoring untuk seluruh pengguna?'))return;try{const users=await adminApi('list');for(const u of users.users||[]){const {error}=await client().from('mahjong_ai_diagnostic_targets').upsert({user_id:u.id,enabled,updated_by:uid()},{onConflict:'user_id'});if(error)throw error}status('Pengaturan seluruh pengguna disimpan.');await loadTargets();await refresh()}catch(e){status('Gagal: '+safe(e.message))}};
window.aiDiagSimulation=()=>{if(!admin())return;let failures=[];let cases=0;const pay=[1,2,4,6,8,10,12];for(let w=0;w<4;w++)for(let d=0;d<4;d++)for(const v of pay){if(w===d)continue;cases++;const balances=[0,0,0,0];balances[w]+=v;balances[d]-=v;if(balances.reduce((a,b)=>a+b,0)!==0)failures.push({w,d,v})}status(`Simulasi aritmetika independen: ${cases} kasus, ${failures.length} gagal. Tidak menguji seluruh engine permainan.`)};
window.addEventListener('error',e=>{errors.push(safe(e.message));errors=errors.slice(-5)});
window.addEventListener('unhandledrejection',e=>{errors.push(safe(e.reason?.message||e.reason));errors=errors.slice(-5)});
window.mahjongAiDiagnosticSessionChanged=()=>{stopRemoteRealtime();config=null;active=false;showNotice(false);if(uid())setTimeout(()=>{ensureRemoteRealtime();refresh()},1300)};
timer=setInterval(()=>{if(uid()&&document.visibilityState==='visible'){ensureRemoteRealtime();refresh()}else if(!uid())stopRemoteRealtime()},60000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){ensureRemoteRealtime();refresh()}});
window.addEventListener('pagehide',stopRemoteRealtime);
// Session restoration may finish after this script loads.
setTimeout(()=>{if(uid()){ensureRemoteRealtime();refresh()}},1800);
})();

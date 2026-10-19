/* Four-digit PIN entry and native passkey ceremonies. Never store PINs or biometrics. */
(function(root){
'use strict';
const digits=value=>String(value||'').replace(/[^0-9]/g,'').slice(0,4);
function distribute(values,start,text){const next=values.slice(),input=digits(text);for(let i=0;i<input.length&&start+i<4;i++)next[start+i]=input[i];return next;}
const api={digits,distribute};if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
const boxes=[0,1,2,3].map(i=>document.getElementById('loginPin'+i)),hidden=document.getElementById('loginPassword');
function sync(){hidden.value=boxes.map(x=>x.value).join('');}
function fill(index,text){const values=distribute(boxes.map(x=>x.value),index,text);boxes.forEach((x,i)=>x.value=values[i]);sync();const next=Math.min(3,index+digits(text).length);boxes[next].focus();boxes[next].select();}
boxes.forEach((box,i)=>{box.addEventListener('focus',()=>box.select());box.addEventListener('input',()=>{const value=box.value;box.value='';if(digits(value))fill(i,value);else sync();});box.addEventListener('paste',e=>{e.preventDefault();fill(i,e.clipboardData.getData('text'));});box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&i>0){e.preventDefault();boxes[i-1].value='';boxes[i-1].focus();sync();}if(e.key==='ArrowLeft'&&i>0){e.preventDefault();boxes[i-1].focus();}if(e.key==='ArrowRight'&&i<3){e.preventDefault();boxes[i+1].focus();}});});
const login=document.getElementById('passkeyLogin'),register=document.getElementById('passkeyRegister'),status=document.getElementById('passkeyStatus');let busy=false,available=false;
const supported=()=>!!(root.isSecureContext&&root.PublicKeyCredential&&navigator.credentials);
function errorText(e){if(e?.name==='NotAllowedError'||/cancel|notallowed/i.test(e?.message||''))return 'Dibatalkan. Anda tetap dapat masuk dengan PIN.';if(e?.code==='webauthn_credential_exists')return 'Perangkat ini sudah terdaftar. Gunakan Face ID / Sidik Jari saat login.';if(e?.code==='passkey_disabled')return 'Login biometrik belum diaktifkan pada server. Gunakan PIN sementara.';return 'Belum berhasil. Coba lagi atau gunakan PIN.';}
function message(text){if(mahjongSession?.user){status.hidden=false;status.textContent=text;}else setAuthMessage(text);}
async function action(enroll){if(busy)return;const auth=mahjongSupabase?.auth;if(!auth||typeof auth[enroll?'registerPasskey':'signInWithPasskey']!=='function')return message('Login biometrik belum tersedia. Gunakan PIN.');if(enroll&&!mahjongSession?.user)return message('Login dengan PIN terlebih dahulu.');busy=true;login.disabled=register.disabled=true;message(enroll?'Ikuti petunjuk perangkat untuk menyimpan passkey.':'Ikuti petunjuk Face ID atau sidik jari pada perangkat.');try{const {error}=await auth[enroll?'registerPasskey':'signInWithPasskey']();if(error)throw error;message(enroll?'Face ID / Sidik Jari siap digunakan untuk login berikutnya.':'');}catch(e){message(errorText(e));}finally{busy=false;login.disabled=register.disabled=false;}}
login.onclick=()=>action(false);register.onclick=()=>action(true);
function refresh(){if(mahjongSession?.user){boxes.forEach(x=>x.value='');sync();}const auth=typeof mahjongSupabase!=='undefined'&&mahjongSupabase?.auth;login.hidden=!available||typeof auth?.signInWithPasskey!=='function';register.hidden=!available||typeof auth?.registerPasskey!=='function'||!mahjongSession?.user;}
(async()=>{try{available=supported()&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();}catch{available=false;}refresh();})();setInterval(refresh,1500);
})(globalThis);

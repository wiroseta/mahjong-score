/* Four-digit PIN entry and native passkey ceremonies. Never store PINs or biometrics. */
(function(root){
'use strict';
const digits=value=>String(value||'').replace(/[^0-9]/g,'').slice(0,4);
function distribute(values,start,text){const next=values.slice(),input=digits(text);for(let i=0;i<input.length&&start+i<4;i++)next[start+i]=input[i];return next;}
const api={digits,distribute};if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
const boxes=[0,1,2,3].map(i=>document.getElementById('loginPin'+i)),hidden=document.getElementById('loginPassword');
let pinAttempt=0,pinAttempted=-1,pinPending=false;
const username=document.getElementById('loginUsername');
async function autoLogin(){
 if(pinPending||mahjongSession?.user||!username?.value.trim()||!/^\d{4}$/.test(hidden.value)||pinAttempted===pinAttempt)return;
 pinAttempted=pinAttempt;pinPending=true;
 try{await loginMahjong({preventDefault(){}});}finally{pinPending=false;}
}
function edited(){pinAttempt++;autoLogin();}
username?.addEventListener('input',edited);
function sync(){hidden.value=boxes.map(x=>x.value).join('');}
function fill(index,text){const values=distribute(boxes.map(x=>x.value),index,text);boxes.forEach((x,i)=>x.value=values[i]);sync();const next=Math.min(3,index+digits(text).length);boxes[next].focus();boxes[next].select();edited();}
boxes.forEach((box,i)=>{box.addEventListener('focus',()=>box.select());box.addEventListener('input',()=>{const value=box.value;box.value='';if(digits(value))fill(i,value);else {sync();edited();}});box.addEventListener('paste',e=>{e.preventDefault();fill(i,e.clipboardData.getData('text'));});box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&i>0){e.preventDefault();boxes[i-1].value='';boxes[i-1].focus();sync();edited();}if(e.key==='ArrowLeft'&&i>0){e.preventDefault();boxes[i-1].focus();}if(e.key==='ArrowRight'&&i<3){e.preventDefault();boxes[i+1].focus();}});});
const login=document.getElementById('passkeyLogin'),register=document.getElementById('passkeyRegister'),status=document.getElementById('passkeyStatus');let busy=false,available=false;
const supported=()=>!!(root.isSecureContext&&root.PublicKeyCredential&&navigator.credentials);
function errorText(e){if(e?.name==='NotAllowedError'||/cancel|notallowed/i.test(e?.message||''))return 'Dibatalkan. Anda tetap dapat masuk dengan PIN.';if(e?.code==='webauthn_credential_exists')return 'Perangkat ini sudah terdaftar. Gunakan Face ID / Sidik Jari saat login.';if(e?.code==='passkey_disabled')return 'Login biometrik belum diaktifkan pada server. Gunakan PIN sementara.';return 'Belum berhasil. Coba lagi atau gunakan PIN.';}
function message(text){if(mahjongSession?.user){status.hidden=false;status.textContent=text;}else setAuthMessage(text);}

function decode(value){return Uint8Array.from(atob(value.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
function encode(value){return btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function credentialJSON(c){if(c.toJSON)return c.toJSON();const response={};for(const k of ['clientDataJSON','attestationObject','authenticatorData','signature','userHandle'])if(c.response[k]!=null)response[k]=encode(c.response[k]);if(c.response.getTransports)response.transports=c.response.getTransports();return {id:c.id,rawId:encode(c.rawId),type:c.type,authenticatorAttachment:c.authenticatorAttachment,response,clientExtensionResults:c.getClientExtensionResults()};}
async function devicePasskey(auth,enroll){
 const {data,error}=await auth.passkey[enroll?'startRegistration':'startAuthentication']();if(error)throw error;
 const options={...data.options,challenge:decode(data.options.challenge),hints:['client-device']};
 if(enroll){options.user={...options.user,id:decode(options.user.id)};options.excludeCredentials=(options.excludeCredentials||[]).map(c=>({...c,id:decode(c.id)}));options.authenticatorSelection={...options.authenticatorSelection,authenticatorAttachment:'platform',residentKey:'required',userVerification:'required'};}
 else {options.userVerification='required';if(options.allowCredentials)options.allowCredentials=options.allowCredentials.map(c=>({...c,id:decode(c.id)}));}
 const credential=await navigator.credentials[enroll?'create':'get']({publicKey:options});if(!credential)throw new Error('cancel');
 return auth.passkey[enroll?'verifyRegistration':'verifyAuthentication']({challengeId:data.challenge_id,credential:credentialJSON(credential)});
}
async function action(enroll){if(busy)return;const auth=mahjongSupabase?.auth;if(!auth||typeof auth[enroll?'registerPasskey':'signInWithPasskey']!=='function')return message('Login biometrik belum tersedia. Gunakan PIN.');if(enroll&&!mahjongSession?.user)return message('Login dengan PIN terlebih dahulu.');busy=true;login.disabled=register.disabled=true;message(enroll?'Ikuti petunjuk perangkat untuk menyimpan passkey.':'Gunakan passkey perangkat ini. Belum aktif? Masuk dengan PIN, lalu aktifkan di Setting.');try{const {error}=await devicePasskey(auth,enroll);if(error)throw error;message(enroll?'Face ID / Sidik Jari siap digunakan untuk login berikutnya.':'');}catch(e){message(errorText(e));}finally{busy=false;login.disabled=register.disabled=false;}}
login.onclick=()=>action(false);register.onclick=()=>action(true);
function refresh(){if(mahjongSession?.user){boxes.forEach(x=>x.value='');sync();}const auth=typeof mahjongSupabase!=='undefined'&&mahjongSupabase?.auth;login.hidden=!available||typeof auth?.signInWithPasskey!=='function';register.hidden=!available||typeof auth?.registerPasskey!=='function'||!mahjongSession?.user;}
(async()=>{try{available=supported()&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();}catch{available=false;}refresh();})();setInterval(refresh,1500);
})(globalThis);

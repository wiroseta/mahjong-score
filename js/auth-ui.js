/* Four-digit PIN entry and native passkey ceremonies. Never store PINs or biometrics. */
(function(root){
'use strict';
const digits=value=>String(value||'').replace(/[^0-9]/g,'').slice(0,4);
function distribute(values,start,text){const next=values.slice(),input=digits(text);for(let i=0;i<input.length&&start+i<4;i++)next[start+i]=input[i];return next;}
const api={digits,distribute};if(typeof module!=='undefined'&&module.exports){module.exports=api;return;}
const pin=document.getElementById('loginPin0'),cells=[0,1,2,3].map(i=>document.getElementById('loginPinCell'+i)),hidden=document.getElementById('loginPassword');
let pinAttempt=0,pinAttempted=-1,pinPending=false,composing=false;
const username=document.getElementById('loginUsername');
async function autoLogin(){
 if(pinPending||mahjongSession?.user||!username?.value.trim()||!/^\d{4}$/.test(hidden.value)||pinAttempted===pinAttempt)return;
 pinAttempted=pinAttempt;pinPending=true;
 try{await loginMahjong({preventDefault(){}});}finally{pinPending=false;}
}
function edited(){pinAttempt++;autoLogin();}
username?.addEventListener('input',edited);
function sync(){const value=digits(pin.value);hidden.value=value;cells.forEach((cell,i)=>{cell.textContent=i<value.length?'●':'';cell.classList.toggle('pin-active',document.activeElement===pin&&i===Math.min(value.length,3));});}
function commit(){const value=digits(pin.value),changed=hidden.value!==value;if(pin.value!==value)pin.value=value;sync();if(changed)edited();}
// One native input keeps the same Android IME connection for all four visual cells.
pin.addEventListener('input',e=>{if(!composing&&!e?.isComposing)commit();});
pin.addEventListener('compositionstart',()=>{composing=true;});
pin.addEventListener('compositionend',()=>{composing=false;commit();});
pin.addEventListener('focus',()=>{sync();});pin.addEventListener('blur',sync);
pin.addEventListener('paste',e=>{e.preventDefault();pin.value=digits(e.clipboardData.getData('text'));commit();});
pin.addEventListener('pointerup',()=>{const end=pin.value.length;pin.setSelectionRange?.(end,end);});
const login=document.getElementById('passkeyLogin'),register=document.getElementById('passkeyRegister'),status=document.getElementById('passkeyStatus');let busy=false,available=false,passkeys=[],loadedUser=null,loadSequence=0;
const setting=document.getElementById('passkeySetting');
const supported=()=>!!(root.isSecureContext&&root.PublicKeyCredential&&navigator.credentials);
function errorText(e){if(e?.name==='NotAllowedError'||/cancel|notallowed/i.test(e?.message||''))return 'Dibatalkan. Anda tetap dapat masuk dengan PIN.';if(e?.code==='webauthn_credential_exists')return 'Perangkat ini sudah terdaftar. Gunakan Face ID / Sidik Jari saat login.';if(e?.code==='passkey_disabled')return 'Login biometrik belum diaktifkan pada server. Gunakan PIN sementara.';return 'Belum berhasil. Coba lagi atau gunakan PIN.';}
function knownPasskey(){try{return root.localStorage?.getItem('mahjong_passkey_ready')==='1';}catch{return false;}}
function rememberPasskey(on){try{if(on)root.localStorage?.setItem('mahjong_passkey_ready','1');else root.localStorage?.removeItem('mahjong_passkey_ready');}catch{}}
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
async function action(enroll){if(busy)return;const auth=mahjongSupabase?.auth;if(!auth||typeof auth[enroll?'registerPasskey':'signInWithPasskey']!=='function')return message('Login biometrik belum tersedia. Gunakan PIN.');if(enroll&&!mahjongSession?.user)return message('Login dengan PIN terlebih dahulu.');busy=true;login.disabled=register.disabled=true;message(enroll?'Ikuti petunjuk perangkat untuk menyimpan passkey.':knownPasskey()?'':'Gunakan passkey perangkat ini. Belum aktif? Masuk dengan PIN, lalu aktifkan di Setting.');try{const {error}=await devicePasskey(auth,enroll);if(error)throw error;rememberPasskey(true);message(enroll?'Face ID / Sidik Jari siap digunakan untuk login berikutnya.':'');}catch(e){message(errorText(e));}finally{busy=false;login.disabled=false;register.disabled=false;if(enroll)await loadPasskeys(true);}}
login.onclick=()=>action(false);
async function loadPasskeys(preserveMessage=false){
 const user=mahjongSession?.user?.id,seq=++loadSequence;
 if(!user){loadedUser=null;passkeys=[];register.checked=false;return;}
 register.disabled=true;
 try{
  const {data,error}=await mahjongSupabase.auth.passkey.list();if(error)throw error;
  if(seq!==loadSequence||mahjongSession?.user?.id!==user)return;
  if(!Array.isArray(data))throw new Error('Invalid passkey list');
  passkeys=data;rememberPasskey(passkeys.length>0);loadedUser=user;register.checked=passkeys.length>0;
  register.disabled=busy||(!available&&!register.checked);
  if(!preserveMessage)status.hidden=true;
  if(!available&&!register.checked)message('Face ID / Sidik Jari belum tersedia pada perangkat atau browser ini.');
 }catch(e){if(seq===loadSequence&&mahjongSession?.user?.id===user){loadedUser=null;register.disabled=true;message('Status Face ID / Sidik Jari belum dapat diperiksa. Buka kembali Setting untuk mencoba lagi.');}}
}
register.onchange=async()=>{
 const user=mahjongSession?.user?.id;
 if(busy||!user||loadedUser!==user){register.checked=passkeys.length>0;return;}
 const enable=register.checked;register.checked=passkeys.length>0;
 if(enable){await action(true);return;}
 if(!root.confirm('Nonaktifkan Face ID / Sidik Jari untuk akun ini di semua perangkat? Login PIN tetap tersedia.'))return;
 busy=true;register.disabled=true;
 try{
  const {data,error}=await mahjongSupabase.auth.passkey.list();if(error)throw error;
  if(mahjongSession?.user?.id!==user)return;
  for(const passkey of data){if(mahjongSession?.user?.id!==user)return;const {error}=await mahjongSupabase.auth.passkey.delete({passkeyId:passkey.id});if(error)throw error;}
  message('');status.hidden=true;
 }catch(e){message('Belum berhasil menonaktifkan Face ID / Sidik Jari. Coba lagi.');}
 finally{busy=false;await loadPasskeys(true);}
};
root.mahjongRefreshPasskeys=loadPasskeys;
function refresh(){
 const user=mahjongSession?.user?.id;
 if(user&&pin.value){pin.value='';sync();}
 const auth=typeof mahjongSupabase!=='undefined'&&mahjongSupabase?.auth;
 login.hidden=!available||typeof auth?.signInWithPasskey!=='function';
 if(setting)setting.hidden=!user;
 if(!user){loadedUser=null;passkeys=[];register.checked=false;register.disabled=true;}
}
(async()=>{try{available=supported()&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();}catch{available=false;}refresh();})();setInterval(refresh,1500);
})(globalThis);

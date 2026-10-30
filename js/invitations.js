// Invitation signup and administrator controls. Codes are never stored in browser storage.
async function invitationApi(action,payload={}){
 const headers={'Content-Type':'application/json',apikey:window.MAHJONG_SUPABASE_ANON_KEY};
 if(mahjongSession?.access_token)headers.Authorization='Bearer '+mahjongSession.access_token;
 const response=await fetch(window.MAHJONG_SUPABASE_URL+'/functions/v1/mahjong-invitations',{method:'POST',headers,body:JSON.stringify({action,...payload})});
 const result=await response.json();if(!response.ok||result.error)throw new Error(result.error||'Permintaan gagal.');return result;
}
function showInvitationSignup(show){
 document.querySelector('#authGate > form').hidden=show;
 document.getElementById('invitationSignup').hidden=!show;
 document.getElementById('signupMessage').textContent='';
 if(!show){document.getElementById('signupPin').value='';document.getElementById('signupConfirmPin').value='';document.getElementById('signupCode').value='';}
 document.getElementById(show?'signupCode':'loginUsername').focus();
}
async function signupWithInvitation(event){
 event.preventDefault();const form=event.currentTarget,button=form.querySelector('[type=submit]'),msg=document.getElementById('signupMessage');
 if(button.disabled)return;
 const pin=document.getElementById('signupPin').value;
 if(pin!==document.getElementById('signupConfirmPin').value){msg.textContent='Konfirmasi PIN tidak sama.';return;}
 button.disabled=true;msg.textContent='Mendaftarkan…';
 try{
  const username=document.getElementById('signupUsername').value.trim();
  await invitationApi('signup',{username,pin,code:document.getElementById('signupCode').value});
  form.reset();showInvitationSignup(false);document.getElementById('loginUsername').value=username;setAuthMessage('Pendaftaran berhasil. Masuk dengan email dan PIN Anda.');document.getElementById('loginPin0').focus();
 }catch(e){msg.textContent=e.message;}finally{button.disabled=false;}
}
async function createInvitation(){
 const button=document.getElementById('createInvitation'),msg=document.getElementById('invitationMessage');button.disabled=true;msg.textContent='Membuat kode…';
 try{const data=await invitationApi('create');document.getElementById('invitationCode').value=data.code;document.getElementById('invitationResult').hidden=false;msg.textContent='Berlaku sampai '+new Date(data.expires_at).toLocaleString('id-ID')+'. Simpan dan kirim kode ini kepada calon pengguna; kode hanya ditampilkan sekali.';await loadInvitations();}catch(e){msg.textContent=e.message;}finally{button.disabled=false;}
}
function invitationShareText(){
 const code=document.getElementById('invitationCode').value;
 return code?'Daftar Mahjong di '+location.origin+location.pathname+' dengan kode undangan: '+code+' (sekali pakai, berlaku 15 menit).':'';
}
async function copyInvitation(){
 const field=document.getElementById('invitationCode'),text=invitationShareText();
 if(!text)return;
 try{await navigator.clipboard.writeText(text);document.getElementById('invitationMessage').textContent='Undangan disalin. Kirim kepada calon pengguna.';}catch(e){field.focus();field.select();document.getElementById('invitationMessage').textContent='Pilih dan salin kode di atas untuk dikirim.';}
}
async function shareInvitation(){
 const text=invitationShareText();if(!text)return;
 if(typeof navigator.share!=='function'){await copyInvitation();return;}
 try{await navigator.share({title:'Undangan Mahjong',text});document.getElementById('invitationMessage').textContent='Undangan dibagikan.';}catch(e){if(e.name!=='AbortError')await copyInvitation();}
}
async function loadInvitations(){
 const host=document.getElementById('invitationList');host.textContent='Memuat…';
 try{const data=await invitationApi('list');host.replaceChildren();for(const item of data.invitations){const row=document.createElement('div');row.className='user-row';const text=document.createElement('span');const expired=new Date(item.expires_at)<=new Date();text.textContent=new Date(item.created_at).toLocaleString('id-ID')+' · '+({available:expired?'Kedaluwarsa':'Aktif',pending:'Sedang / selesai diproses',used:'Sudah digunakan',revoked:'Dibatalkan'}[item.status]||item.status);row.append(text);if(item.status==='available'&&!expired){const button=document.createElement('button');button.type='button';button.className='btn light';button.textContent='Batalkan';button.onclick=async()=>{button.disabled=true;try{await invitationApi('revoke',{id:item.id});await loadInvitations();}catch(e){document.getElementById('invitationMessage').textContent=e.message;button.disabled=false;}};row.append(button);}host.append(row);}if(!data.invitations.length)host.textContent='Belum ada undangan.';}catch(e){host.textContent=e.message;}
}

function openInvitationManagement(){if(!mahjongIsAdmin)return;openUserManagement();requestAnimationFrame(()=>{document.getElementById("invitationManagementPanel").open=true;document.getElementById("invitationManagementPanel").scrollIntoView({block:"start",behavior:"smooth"});document.getElementById("createInvitation").focus({preventScroll:true});});}

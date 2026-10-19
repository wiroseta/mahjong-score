/* Administrator-controlled camera visibility. Scoring data is never changed here. */
(function(root){
'use strict';
const allowed=user=>!!user&&user.app_metadata?.camera_enabled!==false;
if(typeof module!=='undefined'&&module.exports){module.exports={allowed};return;}
function sync(){const show=allowed(mahjongSession?.user);for(const b of document.querySelectorAll('.player-photo'))b.hidden=!show;if(!show&&root.mahjongPhotoSessionChanged)root.mahjongPhotoSessionChanged();}
root.mahjongCameraPermissionChanged=sync;
root.mahjongSaveCameraAccess=async(id,enabled)=>{
 if(!mahjongIsAdmin)throw Error('Hanya administrator yang dapat mengatur kamera.');
 await adminApi('set-camera-access',{userId:id,enabled});
 const u=mahjongAdminUsers.find(x=>x.id===id);if(u)u.cameraEnabled=enabled;
 voicePermissionRevision++;
 if(mahjongSession?.user?.id===id){mahjongSession.user.app_metadata={...(mahjongSession.user.app_metadata||{}),camera_enabled:enabled};sync();}
};
const toggle=document.getElementById('userDetailCamera');
toggle.addEventListener('change',async()=>{
 const id=document.getElementById('userDetailId').value,u=mahjongAdminUsers.find(x=>x.id===id),msg=document.getElementById('userDetailMessage');if(!u)return;
 const enabled=toggle.checked,previous=u.cameraEnabled!==false;toggle.disabled=true;msg.textContent='Menyimpan pengaturan kamera…';
 try{await root.mahjongSaveCameraAccess(id,enabled);if(document.getElementById('userDetailId').value===id)msg.textContent='Tombol kamera '+(enabled?'ditampilkan':'disembunyikan')+' untuk pengguna ini.';}
 catch(e){if(document.getElementById('userDetailId').value===id){toggle.checked=previous;msg.textContent=e.message||'Pengaturan kamera belum tersimpan.';}}
 finally{if(document.getElementById('userDetailId').value===id)toggle.disabled=false;}
});
const style=document.createElement('style');style.textContent='.player-photo[hidden]{display:none!important}';document.head.append(style);sync();
})(globalThis);

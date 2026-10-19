/* Administrator pilot. Photos stay in memory and are analyzed automatically after selection. */
(function(){
'use strict';
const R=window.MahjongPhotoRules;
let epoch=0,draft=null,aborter=null,photoURL='';
const el=id=>document.getElementById(id);
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function status(text){el('photoStatus').textContent=text;}
function allowed(){return !!mahjongSession?.user&&mahjongIsAdmin;}
function context(){return JSON.stringify({account:mahjongSession?.user?.id,game:s,winner,method,discarder,quads:getQuads(),patterns:getPlayerPatterns(),extra:el('extra').value});}
function selectedPlayer(){return el('photoPlayer').value===''?null:Number(el('photoPlayer').value);}
function current(){return draft&&allowed()&&draft.context===context()&&draft.player===selectedPlayer();}
function invalidate(){epoch++;aborter?.abort();aborter=null;draft=null;if(photoURL)URL.revokeObjectURL(photoURL);photoURL='';const p=el('photoPreview');if(p){p.removeAttribute('src');p.hidden=true;}const groups=el('photoGroups');if(groups)groups.replaceChildren();if(el('photoApply'))el('photoApply').disabled=true;if(el('photoAnalyze')){el('photoAnalyze').disabled=true;el('photoAnalyze').hidden=true;}if(el('photoSuggestions'))el('photoSuggestions').replaceChildren();if(el('photoReviewed'))el('photoReviewed').checked=false;if(el('photoResult'))el('photoResult').hidden=true;}
function close(){invalidate();el('photoScoreModal')?.classList.remove('show');}
function open(){
 if(!allowed())return alert('Foto Tile masih dalam uji administrator.');
 invalidate();const placeholder=node('option','Pilih pemain untuk memakai hasil');placeholder.value='';el('photoPlayer').replaceChildren(placeholder,...s.names.map((name,i)=>{const o=node('option',name+(i===winner?' — pemenang':''));o.value=i;return o;}));el('photoPlayer').value=winner===null?'':String(winner);
 el('photoScoreModal').classList.add('show');status('Pilih pemain, lalu ambil foto. Analisis berjalan otomatis.');help();
}
function help(){el('photoHelp').textContent='Foto setelah tangan selesai. Pemenang: seluruh susunan tile. Pemain lain: hanya kelompok terbuka dan Kong tertutup yang sudah dideklarasikan; tile tertutup lainnya tidak dibuka.';}
function pick(camera){
 if(!allowed())return close();
 if(selectedPlayer()===null)return status('Pilih pemain yang akan difoto terlebih dahulu.');
 const input=el(camera?'photoCamera':'photoGallery');input.value='';input.click();
}
async function compress(file){
 if(!file||!/^image\/(jpeg|png|webp|heic|heif)$/.test(file.type)||file.size>20*1024*1024)throw Error('Pilih foto maksimal 20 MB. Jika HEIC tidak terbaca, gunakan JPEG.');
 const url=URL.createObjectURL(file);
 try{const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Foto tidak dapat dibuka. Gunakan JPEG/PNG.'));i.src=url;});
 const scale=Math.min(1,1600/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);
 const data=c.toDataURL('image/jpeg',.86);if(data.length>2_800_000)throw Error('Foto terlalu besar. Ambil foto lebih dekat dengan latar sederhana.');return data;
 }finally{URL.revokeObjectURL(url);}
}
async function selected(file){
 if(!file)return;invalidate();const version=epoch,stamp=context(),player=selectedPlayer();status('Menyiapkan foto…');
 try{const data=await compress(file);if(version!==epoch||!allowed()||stamp!==context())return;
 draft={context:stamp,player,image:data,groups:null};el('photoPreview').src=data;el('photoPreview').hidden=false;el('photoAnalyze').disabled=false;await analyze();
 }catch(e){if(version===epoch)status(e.message);}
}
async function analyze(){
 if(!current()||!draft.image)return status('Permainan berubah. Pilih foto ulang.');
 const version=epoch,target=draft;el('photoAnalyze').disabled=true;el('photoAnalyze').hidden=true;status('Membaca tile… proses dapat memerlukan hingga 60 detik.');aborter=new AbortController();const timeout=setTimeout(()=>aborter?.abort(),75000);
 try{
  const response=await fetch(window.MAHJONG_SUPABASE_URL+'/functions/v1/mahjong-photo-tiles',{method:'POST',headers:{'Content-Type':'application/json',apikey:window.MAHJONG_SUPABASE_ANON_KEY,Authorization:'Bearer '+mahjongSession.access_token},body:JSON.stringify({mimeType:'image/jpeg',image:target.image.split(',')[1],playerType:winner===null?'unassigned':target.player===winner?'winner':'nonwinner'}),signal:aborter.signal});
  const result=await response.json();if(version!==epoch||!current()||draft!==target)return;
  if(!response.ok)throw Error(result.error||'Foto belum dapat dibaca.');
  target.groups=R.validate(result).groups;target.checked=target.groups.map(()=>false);target.notes=(result.notes||[]).filter(x=>typeof x==='string');el('photoResult').hidden=false;drawGroups();status('Foto terbaca: '+target.groups.reduce((n,g)=>n+g.tiles.length,0)+' tile dalam '+target.groups.length+' kelompok. Periksa hasil sebelum digunakan.');
 }catch(e){if(version===epoch){el('photoAnalyze').hidden=false;status(e.name==='AbortError'?'Pembacaan dibatalkan atau terlalu lama. Silakan coba lagi.':e.message);}}
 finally{clearTimeout(timeout);if(version===epoch){aborter=null;el('photoAnalyze').disabled=false;}}
}
const kinds=[['chow','Chi / urutan'],['pong','Pong'],['kong','Kong'],['pair','Pasangan'],['loose','Tile belum dikelompokkan'],['flower','Bunga']];
const exposures=[['open','Sudah terbuka saat bermain'],['concealed','Sebelumnya tertutup'],['declared_concealed_kong','Kong tertutup sudah dideklarasikan']];
function tileName(k){const suits={char:'Karakter',dot:'Bulat',bam:'Bambu'};if(/^(char|dot|bam)[1-9]$/.test(k))return k.slice(-1)+' '+suits[k.slice(0,-1)];return {east:'Timur',south:'Selatan',west:'Barat',north:'Utara',red:'Naga Merah / Joker',green:'Naga Hijau',white:'Naga Putih',flower:'Bunga',unknown:'Belum terbaca'}[k]||k;}
function reviewedGroups(){return draft.groups.map(g=>draft.player!==winner&&winner!==null&&g.kind==='kong'&&g.exposure==='concealed'?{...g,exposure:'declared_concealed_kong'}:g);}
function drawGroups(){
 const host=el('photoGroups');host.replaceChildren();if(!draft?.groups)return;
 draft.groups.forEach((g,i)=>{
  const box=node('div');box.className='photo-observed-group';box.append(node('strong','Kelompok '+(i+1)+' · '+(kinds.find(x=>x[0]===g.kind)?.[1]||g.kind)+(g.uncertain?' — periksa kembali':'')));
  const row=node('div');row.className='photo-tiles';for(const t of g.tiles){const tile=node('div');if(typeof TILE_IMAGES!=='undefined'&&TILE_IMAGES[t]){const image=node('img');image.src=TILE_IMAGES[t];image.alt=tileName(t);tile.append(image);}tile.append(node('small',tileName(t)));row.append(tile);}box.append(row);host.append(box);
 });
 if(draft.notes?.length){const notes=node('div');notes.append(node('strong','Catatan pembacaan'));for(const note of draft.notes)notes.append(node('p',note));host.append(notes);}
 refreshSuggestions();
}
function refreshSuggestions(){
 const host=el('photoSuggestions');host.replaceChildren();el('photoApply').disabled=true;
 if(!draft?.groups)return;
 if(draft.player===null){host.append(node('p','Pilih pemain, kemudian ambil foto ulang.'));return;}
 if(winner===null){host.append(node('p','Pemenang belum dipilih di formulir utama. Tutup hasil dan pilih pemenang sebelum menerapkan skor.'));return;}
 try{const result=R.suggest({groups:reviewedGroups()},{isWinner:draft.player===winner,seat:s.seatWinds[draft.player]});draft.suggestion=result;
 host.append(node('p','Usulan Kong: '+result.kongCount+'. Kelompok diabaikan: '+result.ignored+'.'));
 host.append(node('p','Versi uji hanya mengusulkan sebagian kombinasi. Kombinasi lain tetap dapat diisi manual. Tidak memutuskan sah/tidaknya Hu.'));
 const best=result.candidates.map(name=>pats.find(p=>p[0]===name)).filter(Boolean).sort((a,b)=>b[1]-a[1])[0];
 draft.pattern=best?best[0]:'';
 host.append(node('p',best?'Usulan kombinasi: '+best[0]+' — '+best[1]+' poin per lawan.':'Belum ada usulan kombinasi tambahan. Isian kombinasi manual tetap dipertahankan.'));
 host.append(node('p','Jika hasil keliru, ambil foto ulang atau tutup dan gunakan pencatatan manual.'));
 el('photoApply').disabled=!el('photoReviewed').checked||!current();
 }catch(e){draft.suggestion=null;host.append(node('p',e.message));}
}
function apply(){
 if(!canKeepScore())return status('Pembacaan foto boleh dilakukan. Untuk mengisi formulir, aktifkan kendali pencatatan pada perangkat ini terlebih dahulu.');
 if(!current()||!draft?.groups||!el('photoReviewed').checked||draft.player===null||winner===null)return status('Periksa semua kelompok. Jika permainan berubah, foto ulang.');
 try{
 const result=R.suggest({groups:reviewedGroups()},{isWinner:draft.player===winner,seat:s.seatWinds[draft.player]});
 if(draft.pattern&&draft.pattern!=='none'&&!result.candidates.includes(draft.pattern))throw Error('Usulan berubah. Periksa kombinasi kembali.');
 const q=document.querySelector('input[data-q="'+draft.player+'"]'),pattern=document.querySelector('[data-pp="'+draft.player+'"]');if(!q||!pattern)throw Error('Formulir berubah. Foto ulang.');
 const idx=draft.pattern&&draft.pattern!=='none'?pats.findIndex(p=>p[0]===draft.pattern):-1;if(draft.pattern&&draft.pattern!=='none'&&idx<0)throw Error('Kombinasi tidak tersedia.');
 q.value=result.kongCount;syncQuadControl(q);if(draft.pattern)pattern.value=draft.pattern==='none'?'':String(idx);
 update();close();alert('Hasil foto mengisi formulir pemain ini. Periksa Hu/Zi Mo, pembuang, dan pratinjau sebelum Catat Hasil Tangan.');
 }catch(e){status(e.message);}
}
function sync(){const button=el('photoScoreButton');if(button)button.hidden=!mahjongSession?.user||!mahjongIsAdmin;if(draft&&!current())close();}
function init(){
 const style=node('style');style.textContent='#photoScoreButton[hidden]{display:none!important}#photoScoreModal .modal{max-width:700px;max-height:90dvh;overflow:auto}#photoScoreModal img{object-fit:contain}#photoPreview{max-width:100%;max-height:240px}#photoScoreModal .photo-observed-group{border:1px solid #c8c5b8;border-radius:10px;margin:12px 0;padding:10px}#photoScoreModal select{margin:4px 0;min-height:44px}#photoScoreModal label{display:block;margin:12px 0;line-height:1.5}#photoScoreModal input[type=checkbox]{width:20px;height:20px;vertical-align:middle}.photo-tiles{display:flex;flex-wrap:wrap;gap:6px}.photo-tiles>div{width:70px;max-width:100%;display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}.photo-tiles img{height:60px;max-width:50px}.photo-tiles select{font-size:12px;padding:4px}#photoStatus{white-space:pre-wrap;overflow-wrap:anywhere}';document.head.append(style);
 const localLink=node('a','📷');localLink.id='localTileReaderLink';localLink.setAttribute('aria-label','Baca foto');localLink.title='Baca foto';localLink.href='./tile-reader/';localLink.target='_blank';localLink.rel='noopener';localLink.className='btn light';el('winnerStatus').parentElement.append(localLink);
 const button=node('button');button.id='photoScoreButton';button.type='button';button.hidden=true;const icon=node('span','📷');icon.className='menu-icon';icon.setAttribute('aria-hidden','true');button.append(icon,node('span','Foto Tile (Uji)'));button.onclick=()=>{closeMenus();open();};document.querySelector('#topMenu button[onclick*="openSettings"]').after(button);
 const overlay=node('div');overlay.className='overlay';overlay.id='photoScoreModal';overlay.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="photoTitle"><div class="transfer-modal-head"><h3 id="photoTitle">Foto Tile — Uji Administrator</h3><button type="button" class="modal-x" id="photoClose" aria-label="Tutup Foto Tile">✕</button></div><label>Pemain yang difoto<select id="photoPlayer"></select></label><p id="photoHelp"></p><input id="photoCamera" type="file" accept="image/*" capture="environment" hidden><input id="photoGallery" type="file" accept="image/*" hidden><p><img id="photoPreview" alt="Foto tile yang akan dibaca" hidden></p><p>Foto otomatis dibaca oleh AI Google dan tidak disimpan ke riwayat aplikasi.</p><button type="button" class="btn gold" id="photoTake">Ambil Foto</button> <button type="button" class="btn light" id="photoChoose">Pilih dari Galeri</button><button type="button" class="btn light" id="photoAnalyze" disabled hidden>Baca Ulang</button><p id="photoStatus" role="status" aria-live="polite"></p><div id="photoResult" hidden><div id="photoGroups"></div><div id="photoSuggestions"></div><label><input type="checkbox" id="photoReviewed"> Tangan sudah selesai dan hasil sudah saya periksa. Kong tertutup yang dihitung sudah dideklarasikan saat bermain.</label><button type="button" class="btn gold" id="photoApply" disabled>Gunakan Hasil Foto</button></div></div>';
 document.body.append(overlay);el('photoClose').onclick=close;el('photoTake').onclick=()=>pick(true);el('photoChoose').onclick=()=>pick(false);el('photoCamera').onchange=e=>selected(e.target.files[0]);el('photoGallery').onchange=e=>selected(e.target.files[0]);el('photoAnalyze').onclick=analyze;el('photoApply').onclick=apply;el('photoReviewed').onchange=refreshSuggestions;el('photoPlayer').onchange=()=>{invalidate();help();status('Pemain dipilih. Ambil foto untuk dianalisis otomatis.');};overlay.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 window.mahjongPhotoSessionChanged=()=>{close();sync();};sync();setInterval(sync,1000);
}
init();
})();

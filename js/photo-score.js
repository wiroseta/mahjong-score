/* Administrator pilot. Photos stay in memory and are sent only after explicit review consent. */
(function(){
'use strict';
const R=window.MahjongPhotoRules;
let epoch=0,draft=null,aborter=null,photoURL='';
const el=id=>document.getElementById(id);
const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function status(text){el('photoStatus').textContent=text;}
function allowed(){return !!mahjongSession?.user&&mahjongIsAdmin&&canKeepScore();}
function context(){return JSON.stringify({account:mahjongSession?.user?.id,game:s,winner,method,discarder,quads:getQuads(),patterns:getPlayerPatterns(),extra:el('extra').value});}
function current(){return draft&&allowed()&&draft.context===context()&&draft.player===+el('photoPlayer').value;}
function invalidate(){epoch++;aborter?.abort();aborter=null;draft=null;if(photoURL)URL.revokeObjectURL(photoURL);photoURL='';const p=el('photoPreview');if(p){p.removeAttribute('src');p.hidden=true;}const groups=el('photoGroups');if(groups)groups.replaceChildren();if(el('photoApply'))el('photoApply').disabled=true;if(el('photoAnalyze'))el('photoAnalyze').disabled=true;if(el('photoSuggestions'))el('photoSuggestions').replaceChildren();}
function close(){invalidate();el('photoScoreModal')?.classList.remove('show');}
function open(){
 if(!allowed())return alert('Foto Tile masih dalam uji administrator. Pastikan perangkat ini memegang kendali pencatatan.');
 if(winner===null)return alert('Pilih pemain yang menang terlebih dahulu. Foto diambil setelah tangan selesai.');
 invalidate();el('photoPlayer').replaceChildren(...s.names.map((name,i)=>{const o=node('option',name+(i===winner?' — pemenang':''));o.value=i;return o;}));el('photoPlayer').value=winner;
 el('photoEnded').checked=false;el('photoConsent').checked=false;el('photoScoreModal').classList.add('show');status('Pilih pemain, lalu ambil foto atau pilih dari galeri.');help();
}
function help(){const won=+el('photoPlayer').value===winner;el('photoHelp').textContent=won?'Pemenang: foto seluruh susunan tile. Pisahkan kelompok terbuka, tile yang sebelumnya tertutup, Bunga, dan tile kemenangan.':'Bukan pemenang: hanya foto kelompok terbuka dan Kong tertutup yang sudah dideklarasikan. Tile tertutup lain tidak dibuka dan tidak dihitung.';}
function pick(camera){
 if(!allowed())return close();
 if(!el('photoEnded').checked)return status('Konfirmasikan bahwa tangan sudah selesai.');
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
 if(!file)return;invalidate();const version=epoch,stamp=context(),player=+el('photoPlayer').value;status('Menyiapkan foto…');
 try{const data=await compress(file);if(version!==epoch||!allowed()||stamp!==context())return;
 draft={context:stamp,player,image:data,groups:null};el('photoPreview').src=data;el('photoPreview').hidden=false;el('photoAnalyze').disabled=false;status('Periksa foto, setujui pengiriman, lalu tekan Baca Foto.');
 }catch(e){if(version===epoch)status(e.message);}
}
async function analyze(){
 if(!current()||!draft.image)return status('Permainan berubah. Pilih foto ulang.');
 if(!el('photoConsent').checked||!el('photoEnded').checked)return status('Konfirmasikan tangan selesai dan persetujuan pengiriman foto.');
 const version=epoch,target=draft;el('photoAnalyze').disabled=true;status('Membaca tile…');aborter=new AbortController();const timeout=setTimeout(()=>aborter?.abort(),55000);
 try{
  const response=await fetch(window.MAHJONG_SUPABASE_URL+'/functions/v1/mahjong-photo-tiles',{method:'POST',headers:{'Content-Type':'application/json',apikey:window.MAHJONG_SUPABASE_ANON_KEY,Authorization:'Bearer '+mahjongSession.access_token},body:JSON.stringify({mimeType:'image/jpeg',image:target.image.split(',')[1],playerType:target.player===winner?'winner':'nonwinner'}),signal:aborter.signal});
  const result=await response.json();if(version!==epoch||!current()||draft!==target)return;
  if(!response.ok)throw Error(result.error||'Foto belum dapat dibaca.');
  target.groups=R.validate(result).groups;target.checked=target.groups.map(()=>false);target.notes=(result.notes||[]).filter(x=>typeof x==='string');drawGroups();status('Periksa jenis, status, dan setiap tile. Centang setiap kelompok setelah diperiksa.');
 }catch(e){if(version===epoch)status(e.name==='AbortError'?'Pembacaan dibatalkan atau terlalu lama. Silakan coba lagi.':e.message);}
 finally{clearTimeout(timeout);if(version===epoch){aborter=null;el('photoAnalyze').disabled=false;}}
}
function select(options,value,onchange){const n=node('select');for(const [key,label] of options){const o=node('option',label);o.value=key;n.append(o);}n.value=value;n.onchange=()=>onchange(n.value);return n;}
const kinds=[['chow','Chi / urutan'],['pong','Pong'],['kong','Kong'],['pair','Pasangan'],['loose','Tile belum dikelompokkan'],['flower','Bunga']];
const exposures=[['open','Sudah terbuka saat bermain'],['concealed','Sebelumnya tertutup'],['declared_concealed_kong','Kong tertutup sudah dideklarasikan']];
function tileName(k){const suits={char:'Karakter',dot:'Bulat',bam:'Bambu'};if(/^(char|dot|bam)[1-9]$/.test(k))return k.slice(-1)+' '+suits[k.slice(0,-1)];return {east:'Timur',south:'Selatan',west:'Barat',north:'Utara',red:'Naga Merah / Joker',green:'Naga Hijau',white:'Naga Putih',flower:'Bunga',unknown:'Belum terbaca'}[k]||k;}
function changed(i){draft.checked[i]=false;drawGroups();}
function drawGroups(){
 const host=el('photoGroups');host.replaceChildren();if(!draft?.groups)return;
 draft.groups.forEach((g,i)=>{
  const box=node('fieldset'),legend=node('legend','Kelompok '+(i+1)+(g.uncertain?' — perlu diperiksa':''));box.append(legend);
  box.append(select(kinds,g.kind,v=>{g.kind=v;if(v!=='kong'&&g.exposure==='declared_concealed_kong')g.exposure='concealed';changed(i);}),select(exposures,g.exposure,v=>{g.exposure=v;changed(i);}));
  const row=node('div');row.className='photo-tiles';g.tiles.forEach((t,j)=>{const tile=node('div');const image=node('img');if(typeof TILE_IMAGES!=='undefined'&&TILE_IMAGES[t]){image.src=TILE_IMAGES[t];image.alt=tileName(t);tile.append(image);}const choice=select(R.tiles.map(k=>[k,tileName(k)]),t,v=>{g.tiles[j]=v;changed(i);});choice.setAttribute('aria-label','Tile '+(j+1)+' kelompok '+(i+1));tile.append(choice);row.append(tile);});box.append(row);
  const controls=node('div');const add=node('button','+ Tile');add.type='button';add.className='btn light';add.onclick=()=>{if(g.tiles.length<18){g.tiles.push('unknown');changed(i);}};const remove=node('button','− Tile terakhir');remove.type='button';remove.className='btn light';remove.onclick=()=>{if(g.tiles.length>1){g.tiles.pop();changed(i);}};const del=node('button','Hapus kelompok');del.type='button';del.className='btn light';del.onclick=()=>{draft.groups.splice(i,1);draft.checked.splice(i,1);drawGroups();};controls.append(add,remove,del);box.append(controls);const ignored=!R.eligible(g,draft.player===winner);if(ignored)box.append(node('p','Tidak dihitung: tile tertutup pemain yang tidak menang.'));
  const label=node('label'),check=node('input');check.type='checkbox';check.checked=draft.checked[i];check.onchange=()=>{draft.checked[i]=check.checked;refreshSuggestions();};label.append(check,document.createTextNode(' Saya sudah memeriksa tile dan status kelompok ini.'));box.append(label);host.append(box);
 });
 const addGroup=node('button','+ Kelompok');addGroup.type='button';addGroup.className='btn light';addGroup.onclick=()=>{if(draft.groups.length<12){draft.groups.push({kind:'loose',exposure:'concealed',tiles:['unknown'],uncertain:true});draft.checked.push(false);drawGroups();}};host.append(addGroup);
 refreshSuggestions();
}
function refreshSuggestions(){
 const host=el('photoSuggestions');host.replaceChildren();el('photoApply').disabled=true;
 if(!draft?.groups)return;
 try{const result=R.suggest({groups:draft.groups},{isWinner:draft.player===winner,seat:s.seatWinds[draft.player]});draft.suggestion=result;
 host.append(node('p','Usulan Kong: '+result.kongCount+'. Kelompok diabaikan: '+result.ignored+'.'));
 host.append(node('p','Versi uji hanya mengusulkan sebagian kombinasi. Kombinasi lain tetap dapat diisi manual. Tidak memutuskan sah/tidaknya Hu.'));
 const choices=[['','Jangan ubah kombinasi saat ini'],['none','Tanpa kombinasi (0 poin)'],...result.candidates.map(name=>[name,name])];
 host.append(select(choices,draft.pattern||'',v=>{draft.pattern=v;}));
 el('photoApply').disabled=!draft.checked.every(Boolean)||!current();
 }catch(e){draft.suggestion=null;host.append(node('p',e.message));}
}
function apply(){
 if(!current()||!draft?.groups||!draft.checked.every(Boolean)||!el('photoEnded').checked)return status('Periksa semua kelompok. Jika permainan berubah, foto ulang.');
 try{
 const result=R.suggest({groups:draft.groups},{isWinner:draft.player===winner,seat:s.seatWinds[draft.player]});
 if(draft.pattern&&draft.pattern!=='none'&&!result.candidates.includes(draft.pattern))throw Error('Usulan berubah. Periksa kombinasi kembali.');
 const q=document.querySelector('input[data-q="'+draft.player+'"]'),pattern=document.querySelector('[data-pp="'+draft.player+'"]');if(!q||!pattern)throw Error('Formulir berubah. Foto ulang.');
 const idx=draft.pattern&&draft.pattern!=='none'?pats.findIndex(p=>p[0]===draft.pattern):-1;if(draft.pattern&&draft.pattern!=='none'&&idx<0)throw Error('Kombinasi tidak tersedia.');
 q.value=result.kongCount;syncQuadControl(q);if(draft.pattern)pattern.value=draft.pattern==='none'?'':String(idx);
 update();close();alert('Hasil foto mengisi formulir pemain ini. Periksa Hu/Zi Mo, pembuang, dan pratinjau sebelum Catat Hasil Tangan.');
 }catch(e){status(e.message);}
}
function sync(){const button=el('photoScoreButton');if(button)button.hidden=!mahjongSession?.user||!mahjongIsAdmin;if(draft&&!current())close();}
function init(){
 const style=node('style');style.textContent='#photoScoreButton[hidden]{display:none!important}#photoScoreModal .modal{max-width:700px;max-height:90dvh;overflow:auto}#photoScoreModal img{object-fit:contain}#photoPreview{max-width:100%;max-height:240px}#photoScoreModal fieldset{border:1px solid #c8c5b8;border-radius:10px;margin:12px 0;padding:10px}#photoScoreModal select{margin:4px 0;min-height:44px}#photoScoreModal label{display:block;margin:12px 0;line-height:1.5}#photoScoreModal input[type=checkbox]{width:20px;height:20px;vertical-align:middle}.photo-tiles{display:flex;flex-wrap:wrap;gap:6px}.photo-tiles>div{width:120px;max-width:100%}.photo-tiles img{height:60px;max-width:50px}.photo-tiles select{font-size:12px;padding:4px}#photoStatus{white-space:pre-wrap;overflow-wrap:anywhere}';document.head.append(style);
 const button=node('button','📷 Foto Tile (Uji)');button.id='photoScoreButton';button.type='button';button.className='btn light';button.hidden=true;button.onclick=open;el('winnerStatus').parentElement.append(button);
 const overlay=node('div');overlay.className='overlay';overlay.id='photoScoreModal';overlay.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-labelledby="photoTitle"><div class="transfer-modal-head"><h3 id="photoTitle">Foto Tile — Uji Administrator</h3><button type="button" class="modal-x" id="photoClose" aria-label="Tutup Foto Tile">✕</button></div><label>Pemain<select id="photoPlayer"></select></label><p id="photoHelp"></p><label><input type="checkbox" id="photoEnded"> Tangan sudah selesai. Kong tertutup yang difoto sudah dideklarasikan saat bermain.</label><button type="button" class="btn light" id="photoTake">Ambil Foto</button> <button type="button" class="btn light" id="photoChoose">Pilih dari Galeri</button><input id="photoCamera" type="file" accept="image/*" capture="environment" hidden><input id="photoGallery" type="file" accept="image/*" hidden><p><img id="photoPreview" alt="Foto tile yang akan dibaca" hidden></p><label><input type="checkbox" id="photoConsent"> Saya setuju foto ini dikirim ke layanan AI Google untuk dibaca. Hindari wajah dan informasi pribadi. Aplikasi tidak menyimpan foto ke riwayat.</label><button type="button" class="btn gold" id="photoAnalyze" disabled>Baca Foto</button><p id="photoStatus" role="status" aria-live="polite"></p><div id="photoGroups"></div><div id="photoSuggestions"></div><button type="button" class="btn gold" id="photoApply" disabled>Gunakan Hasil Foto</button></div>';
 document.body.append(overlay);el('photoClose').onclick=close;el('photoTake').onclick=()=>pick(true);el('photoChoose').onclick=()=>pick(false);el('photoCamera').onchange=e=>selected(e.target.files[0]);el('photoGallery').onchange=e=>selected(e.target.files[0]);el('photoAnalyze').onclick=analyze;el('photoApply').onclick=apply;el('photoPlayer').onchange=()=>{invalidate();el('photoAnalyze').disabled=true;el('photoSuggestions').replaceChildren();help();status('Pemain berubah. Pilih foto untuk pemain ini.');};overlay.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 window.mahjongPhotoSessionChanged=()=>{close();sync();};sync();setInterval(sync,1000);
}
init();
})();

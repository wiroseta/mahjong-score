/* Local inference. Embedded mode returns tile labels to the game; never records scores. */
(function(){
'use strict';
const el=id=>document.getElementById(id),status=el('status'),canvas=el('preview'),ctx=canvas.getContext('2d'),D=LocalTileDetector,L=TileReferenceLearning,C=TileReferenceCloud;
let sessionPromise=null,generation=0,image=null,region=null,drag=null,busy=false,reference=null,annotations=[],sourceFile=null,anchor=null;
let isAdmin=false,adminOpen=false,referenceBank=[],cloudBusy=false;
const embedded=window.parent!==window&&new URLSearchParams(location.search).get('embedded')==='1';let embedSession=null,embedReadId=null,embedPlayerIndex=null,embedEnabled=!embedded;
function notify(type,extra={}){if(embedded&&embedSession)window.parent.postMessage({type,sessionId:embedSession,...extra},location.origin);}
function startReading(){embedReadId=crypto.randomUUID();notify('mahjong-photo-start',{readId:embedReadId});}
function sendResult(){if(annotations.length)notify('mahjong-photo-result',{readId:embedReadId,tiles:annotations.filter(a=>a.tile!=='not-tile').map(a=>a.tile)});}
function resetEmbedded(){generation++;embedReadId=null;embedPlayerIndex=null;drag=null;anchor=null;image=null;sourceFile=null;region=null;reference=null;clearResults();canvas.hidden=true;canvas.classList.remove('adjusting');controls();}
if(embedded){document.documentElement.classList.add('embedded');window.addEventListener('message',e=>{if(e.source!==window.parent||e.origin!==location.origin||!e.data||typeof e.data!=='object')return;const data=e.data;if(data.type==='mahjong-photo-context'&&typeof data.sessionId==='string'){if(embedSession!==data.sessionId||embedPlayerIndex!==data.playerIndex)resetEmbedded();embedSession=data.sessionId;embedPlayerIndex=data.playerIndex;embedEnabled=data.enabled===true;el('embeddedPlayer').textContent=typeof data.playerName==='string'?data.playerName:'';status.textContent=embedEnabled?'Ambil foto pemain yang dipilih.':'Pilih pemain pada jendela permainan terlebih dahulu.';controls();}else if(data.type==='mahjong-photo-reset'){resetEmbedded();embedEnabled=false;embedSession=null;controls();}});window.parent.postMessage({type:'mahjong-photo-ready'},location.origin);}

const bankReady=C.load().then(data=>{referenceBank=L.prepare(data);}).catch(()=>{});
function cropCanvas(item,width=100,height=110){const c=document.createElement('canvas');c.width=width;c.height=height;const [x1,y1,x2,y2]=item.box;c.getContext('2d').drawImage(image,x1,y1,x2-x1,y2-y1,0,0,width,height);return c;}
function featuresFor(item){const c=document.createElement('canvas');c.width=c.height=L.size;const [x1,y1,x2,y2]=item.box,w=x2-x1,h=y2-y1;c.getContext('2d').drawImage(image,x1+w*.12,y1+h*.12,w*.76,h*.76,0,0,L.size,L.size);const p=c.getContext('2d').getImageData(0,0,L.size,L.size).data;return Array.from({length:L.length},(_,i)=>Math.round(p[i*4]*.299+p[i*4+1]*.587+p[i*4+2]*.114));}
async function refreshAccess(){const account=await C.admin();isAdmin=!!account;el('adminToggle').hidden=!isAdmin;if(!isAdmin){adminOpen=false;el('adminPanel').hidden=true;}controls();}
async function refreshBatches(){if(!isAdmin)return;const host=el('exampleBatches');host.textContent='Memuat contoh…';try{const data=await C.list(),batches=new Map();for(const e of data){if(!batches.has(e.batch_id))batches.set(e.batch_id,[]);batches.get(e.batch_id).push(e);}host.replaceChildren();for(const [id,items] of batches){const row=document.createElement('div');row.className='batch';const text=document.createElement('p');const active=items.filter(e=>e.active).length;text.textContent=new Date(items[0].created_at).toLocaleString('id-ID')+' — '+items.length+' contoh, '+active+' aktif';row.append(text);for(const [label,value] of [['Aktifkan',true],['Nonaktifkan',false]]){const button=document.createElement('button');button.textContent=label;button.disabled=value?active===items.length:active===0;button.onclick=async()=>{if(cloudBusy||busy)return;cloudBusy=true;controls();button.disabled=true;try{await C.setActive(id,value);referenceBank=L.prepare(await C.load());el('adminStatus').textContent=value?'Contoh aktif untuk pembacaan berikutnya.':'Contoh dinonaktifkan.';await refreshBatches();}catch(e){el('adminStatus').textContent=e.message;await refreshAccess();}finally{cloudBusy=false;controls();button.disabled=false;}};row.append(button);}host.append(row);}if(!data.length)host.textContent='Belum ada contoh tersimpan.';}catch(e){host.textContent=e.message;}}
function session(){
 if(!sessionPromise){status.textContent='Memuat model pembaca sekitar 21 MB untuk pertama kali…';ort.env.wasm.numThreads=1;ort.env.wasm.wasmPaths=new URL('./vendor/',location.href).href;sessionPromise=ort.InferenceSession.create('./model.onnx',{executionProviders:['wasm']}).catch(e=>{sessionPromise=null;throw Error('Model belum dapat dimuat. Periksa koneksi lalu tekan Baca ulang. '+e.message);});}
 return sessionPromise;
}
const names={east:'Timur',south:'Selatan',west:'Barat',north:'Utara',white:'Naga putih',green:'Naga hijau',red:'Naga merah'};
function tileName(t){return names[t]||t.replace(/^char/,'Karakter ').replace(/^dot/,'Bulat ').replace(/^bam/,'Bambu ');}
function controls(){el('saveExamples').disabled=busy||cloudBusy||!isAdmin||!annotations.length;document.querySelectorAll('#rows select,#rows input').forEach(control=>control.disabled=busy||cloudBusy||!isAdmin);for(const id of ['boxesReviewed','coverageReviewed'])el(id).disabled=busy||cloudBusy||!isAdmin||!annotations.length;el('exportLabels').disabled=busy||cloudBusy||!isAdmin||!annotations.length;el('file').disabled=busy||cloudBusy||!embedEnabled;el('camera').disabled=busy||cloudBusy||!embedEnabled;el('full').disabled=busy||cloudBusy||!image;el('recheck').disabled=busy||cloudBusy||!image;el('adjust').disabled=busy||cloudBusy||!image;}
function clearResults(){el('boxesReviewed').checked=false;el('coverageReviewed').checked=false;annotations=[];el('exportLabels').disabled=true;el('results').hidden=true;el('summary').textContent='';el('userResults').replaceChildren();el('rows').replaceChildren();}
async function infer(model,img,box){
 const [left,top,right,bottom]=box,w=right-left,h=bottom-top,size=640,scale=Math.min(size/w,size/h),rw=Math.round(w*scale),rh=Math.round(h*scale),dx=Math.floor((size-rw)/2),dy=Math.floor((size-rh)/2);
 const input=document.createElement('canvas');input.width=input.height=size;const c=input.getContext('2d');c.fillStyle='rgb(114,114,114)';c.fillRect(0,0,size,size);c.drawImage(img,left,top,w,h,dx,dy,rw,rh);
 const pixels=c.getImageData(0,0,size,size).data,plane=size*size,data=new Float32Array(plane*3);
 for(let i=0;i<plane;i++){data[i]=pixels[i*4]/255;data[plane+i]=pixels[i*4+1]/255;data[2*plane+i]=pixels[i*4+2]/255;}
 const tensor=new ort.Tensor('float32',data,[1,3,size,size]);let result;
 try{result=await model.run({[model.inputNames[0]]:tensor});const out=result[model.outputNames[0]];return D.decode(out.data,out.dims,{scale,dx,dy,width:w,height:h}).map(d=>({...d,box:[d.box[0]+left,d.box[1]+top,d.box[2]+left,d.box[3]+top]}));}
 finally{tensor.dispose();if(result)for(const out of Object.values(result))out.dispose();}
}
function draw(items=[],box=region){
 if(!image)return;const w=image.naturalWidth,h=image.naturalHeight;canvas.width=w;canvas.height=h;canvas.hidden=false;ctx.drawImage(image,0,0);
 if(box){const [x1,y1,x2,y2]=box;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(0,0,w,y1);ctx.fillRect(0,y2,w,h-y2);ctx.fillRect(0,y1,x1,y2-y1);ctx.fillRect(x2,y1,w-x2,y2-y1);ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(3,w/300);ctx.strokeRect(x1,y1,x2-x1,y2-y1);}
 ctx.lineWidth=Math.max(2,w/500);ctx.font=`bold ${Math.max(13,w/70)}px system-ui`;
 for(const [index,item] of items.entries()){const [x1,y1,x2,y2]=item.box;ctx.strokeStyle=item.uncertain?'#ffc857':'#5fffad';ctx.strokeRect(x1,y1,x2-x1,y2-y1);ctx.fillStyle='#07251b';ctx.fillRect(x1,Math.max(0,y1-22),100,22);ctx.fillStyle='#fff';ctx.fillText('#'+(index+1)+' '+Math.round(item.confidence*100)+'%',x1+2,Math.max(17,y1-5));}
}
function show(items,elapsed,note){
 items=D.readingOrder(items).map(item=>{const features=featuresFor(item),match=L.match(features,referenceBank);return {...item,modelTile:item.tile,tile:match?.label||item.tile,features,referenceMatch:match};});annotations=items.map(item=>({prediction:{...item,tile:item.modelTile,box:item.box.slice()},tile:item.tile,features:item.features,reviewed:false}));draw(items);const cards=el('userResults');cards.replaceChildren();for(const [i,item] of items.entries()){const card=document.createElement('div');card.className='tile-card';const text=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('span');name.textContent=tileName(item.tile);detail.textContent='Baris '+item.row+' · Tile '+(i+1)+(item.uncertain?' · Periksa foto':'');text.append(name,detail);card.append(cropCanvas(item),text);cards.append(card);}const rows=el('rows');rows.replaceChildren();
 for(const [index,item] of items.entries()){const row=document.createElement('tr');for(const text of [String(index+1),String(item.row),tileName(item.modelTile),Math.round(item.confidence*100)+'%',item.uncertain?'Belum pasti':'Tetap periksa']){const td=document.createElement('td');td.textContent=text;row.append(td);}const cropCell=document.createElement('td'),crop=document.createElement('canvas');crop.width=100;crop.height=110;crop.setAttribute('aria-label','Potongan foto tile '+(index+1));const [cx1,cy1,cx2,cy2]=item.box;crop.getContext('2d').drawImage(image,cx1,cy1,cx2-cx1,cy2-cy1,0,0,100,110);cropCell.append(crop);row.append(cropCell);const annotation=annotations[index],cell=document.createElement('td'),select=document.createElement('select');select.setAttribute('aria-label','Koreksi tile '+(index+1));
 const keys=[...Array.from({length:9},(_,i)=>'char'+(i+1)),...Array.from({length:9},(_,i)=>'dot'+(i+1)),...Array.from({length:9},(_,i)=>'bam'+(i+1)),...Object.keys(names),'unknown','not-tile'];
 for(const key of keys){const option=document.createElement('option');option.value=key;option.textContent=key==='unknown'?'Tidak dikenal / bunga':key==='not-tile'?'Bukan tile':tileName(key);select.append(option);}select.value=annotation.tile;
 const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','Sudah diperiksa tile '+(index+1));label.append(check,' Sudah diperiksa');
 select.onchange=()=>{annotation.tile=select.value;annotation.reviewed=false;check.checked=false;cards.children[index].querySelector('strong').textContent=annotation.tile==='not-tile'?'Bukan tile':tileName(annotation.tile);sendResult();};check.onchange=()=>{annotation.reviewed=check.checked;sendResult();};cell.append(select,label);row.append(cell);rows.append(row);}
 el('exportLabels').disabled=!items.length;
 el('results').hidden=!items.length;el('summary').textContent=items.length+' tile terdeteksi. '+(note.includes('mirip')?'Foto memuat beberapa area. Gunakan Ubah area foto bila tile pemain lain ikut terbaca.':'Periksa apakah seluruh susunan pemain sudah terlihat.');
 if(reference){const report=D.evaluate(items,reference.tiles);el('summary').textContent+=' Uji acuan: '+report.correct+'/'+report.expected+' jenis benar, '+report.wrong+' salah jenis, '+report.missed+' terlewat, '+report.extra+' deteksi tambahan. Label acuan hanya untuk pengujian, tidak mengubah hasil model.';}
 sendResult();status.textContent='Pembacaan lokal selesai dalam '+(elapsed/1000).toFixed(2)+' detik (di luar pemuatan model).';
}
async function analyze(automatic=false){
 if(!image||busy||cloudBusy||!embedEnabled)return;startReading();const version=generation,img=image;busy=true;controls();clearResults();status.textContent=sessionPromise?'Menyiapkan pembacaan lokal…':'Memuat pembaca lokal pertama kali…';
 try{
  const model=await session();await bankReady;if(version!==generation)return;
  status.textContent='Membaca dan memperbesar area tile…';await new Promise(resolve=>requestAnimationFrame(resolve));const start=performance.now();
  const full=[0,0,img.naturalWidth,img.naturalHeight];let items,note='';
  if(automatic){
   const initial=await infer(model,img,full);if(version!==generation)return;
   const focus=D.foreground(initial,img.naturalWidth,img.naturalHeight);
   region=focus&&!focus.ambiguous?focus.box:null;
   if(region){items=await infer(model,img,region);note='Area baris utama dipilih otomatis. Periksa bingkai; kelompok di luar area tidak dibaca.';}
   else{items=initial;note=focus?.ambiguous?'Ada beberapa baris yang mirip. Gunakan Ubah area untuk memilih tile pemain.':'Belum dapat memilih area pemain secara pasti.';}
  }else{items=await infer(model,img,region||full);note=region?'Membaca area di dalam bingkai.':'Membaca seluruh foto; tile pemain lain dapat ikut terbaca.';}
  if(version===generation)show(items,performance.now()-start,note);
 }catch(e){if(version===generation){status.textContent=e.message||'Pembaca lokal belum dapat dijalankan.';notify('mahjong-photo-error',{message:status.textContent});}}
 finally{busy=false;controls();}
}
async function read(file,ref=null){
 if(busy||cloudBusy||!embedEnabled)return;startReading();const version=++generation;image=null;sourceFile=file;reference=ref;region=ref?.region||null;drag=null;anchor=null;canvas.classList.remove('adjusting');el('adjust').textContent='Ubah area foto';controls();clearResults();canvas.hidden=true;status.textContent='Menyiapkan foto…';let url;
 try{
  if(file.size>20*1024*1024||!/^image\/(jpeg|png|webp)$/.test(file.type))throw Error('Gunakan foto JPEG, PNG, atau WebP maksimal 20 MB.');
  url=URL.createObjectURL(file);const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Foto tidak bisa dibuka. Jika menggunakan HEIC, simpan sebagai JPEG terlebih dahulu.'));i.src=url;});if(version!==generation)return;
  if(img.naturalWidth*img.naturalHeight>40_000_000)throw Error('Ukuran gambar terlalu besar.');image=img;draw();controls();await analyze(!ref);
 }catch(e){if(version===generation){status.textContent=e.message;notify('mahjong-photo-error',{message:e.message});}}
 finally{if(url)URL.revokeObjectURL(url);}
}
function point(e){const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(image.naturalWidth,(e.clientX-r.left)*image.naturalWidth/r.width)),Math.max(0,Math.min(image.naturalHeight,(e.clientY-r.top)*image.naturalHeight/r.height))];}
canvas.onpointerdown=e=>{if(!image||busy||!canvas.classList.contains('adjusting'))return;e.preventDefault();drag=point(e);canvas.setPointerCapture(e.pointerId);};
canvas.onpointermove=e=>{if(!drag)return;const p=point(e);draw([],[Math.min(drag[0],p[0]),Math.min(drag[1],p[1]),Math.max(drag[0],p[0]),Math.max(drag[1],p[1])]);};
canvas.onpointerup=e=>{if(!drag)return;const p=point(e),origin=anchor||drag,box=[Math.min(origin[0],p[0]),Math.min(origin[1],p[1]),Math.max(origin[0],p[0]),Math.max(origin[1],p[1])];drag=null;
 if(box[2]-box[0]<40||box[3]-box[1]<40){if(!anchor){anchor=p;draw();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p[0],p[1],10,0,Math.PI*2);ctx.fill();status.textContent='Sudut pertama dipilih. Ketuk sudut berlawanan untuk menyelesaikan bingkai.';}else status.textContent='Pilih sudut yang lebih jauh agar area cukup besar.';return;}
 anchor=null;region=box;canvas.classList.remove('adjusting');el('adjust').textContent='Ubah area foto';analyze();};
canvas.onpointercancel=()=>{drag=null;draw();};
el('adjust').onclick=()=>{anchor=null;canvas.classList.toggle('adjusting');el('adjust').textContent=canvas.classList.contains('adjusting')?'Batal ubah area':'Ubah area foto';status.textContent=canvas.classList.contains('adjusting')?'Tarik bingkai atau ketuk dua sudut berlawanan untuk memilih area tile pemain.':'Area sebelumnya dipertahankan.';};
el('full').onclick=()=>{anchor=null;region=null;canvas.classList.remove('adjusting');el('adjust').textContent='Ubah area foto';analyze();};
el('recheck').onclick=()=>analyze();
el('camera').onchange=e=>{if(e.target.files[0])read(e.target.files[0]);e.target.value='';};
el('file').onchange=e=>{if(e.target.files[0])read(e.target.files[0]);e.target.value='';};
el('exportLabels').onclick=async()=>{
 if(!isAdmin||!sourceFile||!annotations.length||busy||cloudBusy)return;
 busy=true;controls();
 try{const digest=await crypto.subtle.digest('SHA-256',await sourceFile.arrayBuffer());const imageSHA256=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 const report={schemaVersion:1,purpose:'reviewed annotations for one selected image region; model training readiness is evaluated separately',image:{name:sourceFile.name,sha256:imageSHA256,width:image.naturalWidth,height:image.naturalHeight},region:region?.slice()||null,model:'manifest.json',createdAt:new Date().toISOString(),reviewed:annotations.filter(a=>a.reviewed).length,total:annotations.length,boxReviewComplete:el('boxesReviewed').checked,missingTilesReviewed:el('coverageReviewed').checked,annotations:annotations.map(a=>({prediction:a.prediction,box:a.prediction.box.slice(),humanLabel:a.reviewed?a.tile:null,reviewed:a.reviewed}))};
 report.reviewComplete=report.reviewed===report.total&&report.boxReviewComplete&&report.missingTilesReviewed;
 const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'})),link=document.createElement('a');link.href=url;link.download='mahjong-labels.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 status.textContent='Label diekspor: '+report.reviewed+'/'+report.total+' tile diperiksa. '+(report.reviewComplete?'Pemeriksaan label, bingkai, dan kelengkapan selesai untuk area ini.':'Pemeriksaan belum lengkap.')+' Simpan foto asli bersama label.';
 }catch(e){status.textContent='Ekspor belum berhasil: '+e.message;}finally{busy=false;controls();}
};
el('adminToggle').onclick=async()=>{await refreshAccess();if(!isAdmin)return;adminOpen=!adminOpen;el('adminPanel').hidden=!adminOpen;el('adminToggle').textContent=adminOpen?'Tutup perbaikan administrator':'Perbaikan pembacaan — Administrator';if(adminOpen)await refreshBatches();};
el('refreshExamples').onclick=refreshBatches;
el('saveExamples').onclick=async()=>{if(!isAdmin||busy||cloudBusy||!annotations.length)return;if(!annotations.every(a=>a.reviewed)||!el('boxesReviewed').checked||!el('coverageReviewed').checked){el('adminStatus').textContent='Periksa semua label, bingkai, dan kelengkapan contoh terlebih dahulu.';return;}cloudBusy=true;controls();try{const batch=crypto.randomUUID(),examples=new Map();for(const a of annotations){if(!L.labels.includes(a.tile)||!L.normalize(a.features))continue;const bytes=new TextEncoder().encode('tile-gray24-v1:'+a.features.join(',')),hash=await crypto.subtle.digest('SHA-256',bytes),id=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');if(examples.has(id)&&examples.get(id).label!==a.tile)throw Error('Dua potongan foto identik diberi label berbeda. Periksa kembali.');examples.set(id,{id,batch_id:batch,label:a.tile,features:a.features,active:false});}if(!examples.size)throw Error('Belum ada contoh visual yang cukup jelas untuk disimpan.');await C.save([...examples.values()]);el('adminStatus').textContent=examples.size+' contoh tersimpan sebagai draf. Tekan Aktifkan setelah siap digunakan.';await refreshBatches();}catch(e){el('adminStatus').textContent=e.message;await refreshAccess();}finally{cloudBusy=false;controls();}};
window.addEventListener('storage',refreshAccess);window.addEventListener('focus',refreshAccess);refreshAccess();controls();
})();

/* Deterministic tile grouping for the local reader. No winner selection or score writes. */
(function(root){
'use strict';
const R=typeof module!=='undefined'&&module.exports?require('./photo-rules.js'):root.MahjongPhotoRules;
const numbered=t=>/^(char|dot|bam)[1-9]$/.test(t),honor=t=>['east','south','west','north','red','green','white'].includes(t);
function groupTiles(tiles,{isWinner,seat}){
 if(!Array.isArray(tiles)||!tiles.length||tiles.length>26||tiles.some(t=>!R.tiles.includes(t)||t==='unknown'))throw Error('Ada tile belum terbaca atau jumlahnya tidak sesuai. Periksa area dan ambil foto ulang.');
 const counts=new Map(),flowers=tiles.filter(t=>t==='flower');for(const t of tiles.filter(t=>t!=='flower')){counts.set(t,(counts.get(t)||0)+1);if(counts.get(t)>4)throw Error('Lebih dari empat tile sejenis. Foto hanya susunan satu pemain.');}
 const size=[...counts.values()].reduce((a,b)=>a+b,0),keys=[...counts.keys()].sort(),results=[],seen=new Set();let work=0;
 const add=groups=>{const key=groups.map(g=>g.kind+':'+g.tiles.slice().sort().join(',')).sort().join('|');if(seen.has(key))return;seen.add(key);if(flowers.length)groups=groups.concat({kind:'flower',tiles:flowers,exposure:'open'});results.push(R.suggest({groups},{isWinner,seat,setCount:Math.max(4,groups.filter(g=>['chow','pong','kong'].includes(g.kind)).length)}));};
 function walk(groups,pair){
  if(++work>15000)throw Error('Susunan terlalu ambigu. Gunakan pencatatan manual untuk kombinasi ini.');
  const sets=groups.filter(g=>g.kind!=='pair').length;if(sets>5)return;
  const t=keys.find(k=>counts.get(k)>0);if(!t){if(isWinner?([4,5].includes(sets)&&pair):(sets>=1&&!pair))add(groups);return;}
  if(isWinner&&size<14)return;
  // All input labels are visible faces; never infer concealed tile identities.
  const exposure='open';
  const take=(kind,items)=>{const needed=new Map();items.forEach(x=>needed.set(x,(needed.get(x)||0)+1));if([...needed].some(([x,n])=>(counts.get(x)||0)<n))return;for(const [x,n] of needed)counts.set(x,counts.get(x)-n);walk(groups.concat({kind,tiles:items,exposure}),pair||kind==='pair');for(const [x,n] of needed)counts.set(x,counts.get(x)+n);};
  if(isWinner&&!pair&&counts.get(t)>=2)take('pair',[t,t]);
  if(isWinner&&!pair&&t!=='red'&&counts.get('red')>0)take('pair',[t,'red']);if(isWinner&&!pair&&t==='red')for(const k of keys)if(k!=='red'&&counts.get(k)>0)take('pair',['red',k]);
  if(sets<5){if(counts.get(t)>=3)take('pong',[t,t,t]);if(counts.get(t)>=4)take('kong',[t,t,t,t]);
   if(numbered(t)){const suit=t.slice(0,-1),n=+t.slice(-1);for(let start=Math.max(1,n-2);start<=Math.min(n,7);start++){
    const sequence=[start,start+1,start+2].map(v=>suit+v);let missing=0;const items=sequence.map(x=>counts.get(x)>0?x:(missing++,'red'));
    if(sequence.filter(x=>x===t).length&&(!missing||(isWinner&&missing<=counts.get('red'))))take('chow',items);
   }}
  }
 }
 if(isWinner&&size===14){
  const seven=counts.size===7&&[...counts.values()].every(n=>n===2);
  const terminals=['char1','char9','dot1','dot9','bam1','bam9','east','south','west','north','red','green','white'];
  if(seven){const suits=new Set(keys.filter(numbered).map(t=>t.slice(0,-1))),ns=keys.map(t=>+t.slice(-1)).sort((a,b)=>a-b);const stair=suits.size===1&&keys.every(numbered)&&ns.every((n,i)=>i===0||n===ns[i-1]+1);const candidates=stair?['Tujuh Keajaiban','7 Tangga Surga']:['Tujuh Keajaiban'];if(suits.size===1&&keys.every(numbered))candidates.push('Serupa Murni (Satu Warna)');if(keys.every(honor))candidates.push('Royal Murni');return {kongCount:0,candidates,complete:true,alternatives:1,groups:keys.map(t=>({kind:'pair',tiles:[t,t],exposure:'open'}))};}
  if(terminals.every(t=>counts.has(t))&&keys.every(t=>terminals.includes(t)))return {kongCount:0,candidates:['13 Rakyat'],complete:true,alternatives:1,groups:[]};
 }
 if(!isWinner&&size===0&&flowers.length)add([]);else walk([],false);
 if(!results.length)throw Error(isWinner?'Susunan belum membentuk 4 atau 5 kelompok dan satu pasangan. Periksa koreksi jenis tile dan kelengkapan seluruh foto pemenang.':'Foto pemain bukan pemenang hanya kelompok yang terbuka. Susunan ini belum dapat dihitung.');
 const q=new Set(results.map(r=>r.kongCount));if(q.size!==1||[...q][0]>4)throw Error('Jumlah Kong masih ambigu. Periksa susunan atau isi Kong secara manual.');
 // Only combinations supported by every legal decomposition may fill the form.
 for(const r of results){if(!isWinner||!r.complete||tiles.includes('red'))continue;const sets=r.groups.filter(g=>['chow','pong','kong'].includes(g.kind)),pairs=r.groups.filter(g=>g.kind==='pair'),flat=r.groups.flatMap(g=>g.tiles).filter(t=>t!=='flower'),chows=sets.filter(g=>g.kind==='chow').map(g=>g.tiles.slice().sort());
  if(sets.every(g=>g.kind==='chow')&&flat.every(numbered))r.candidates.push('Urutan Murni (Pinhu)');
  if(chows.some(a=>chows.some(b=>a!==b&&a[0].slice(0,-1)===b[0].slice(0,-1)&&+a[2].slice(-1)===+b[0].slice(-1))))r.candidates.push('Urutan Berantai');
  for(let n=1;n<=7;n++)if(['char','dot','bam'].every(s=>chows.some(c=>c.join(',')===[s+n,s+(n+1),s+(n+2)].join(','))))r.candidates.push('Urutan Mirip');
  for(const s of ['char','dot','bam'])if([1,4,7].every(n=>chows.some(c=>c.join(',')===[s+n,s+(n+1),s+(n+2)].join(','))))r.candidates.push('Urutan Lengkap Murni');
  if(['char','dot','bam'].every(s=>flat.some(t=>t.startsWith(s)))&&flat.some(t=>['red','green','white'].includes(t))&&flat.some(t=>['east','south','west','north'].includes(t)))r.candidates.push('Lima Serangkai');
  const edge=t=>honor(t)||(numbered(t)&&[1,9].includes(+t.slice(-1)));if(chows.length&&r.groups.filter(g=>g.kind!=='flower').every(g=>g.tiles.some(edge)))r.candidates.push('Ujung Separuh');
  if(!chows.length&&sets.every(g=>g.tiles.some(t=>numbered(t)&&[1,9].includes(+t.slice(-1))))&&pairs.every(g=>g.tiles.some(edge)))r.candidates.push('Ujung Murni');
 }
 const candidates=[...new Set(results[0].candidates)].filter(c=>results.every(r=>r.candidates.includes(c)));
 return {kongCount:[...q][0],candidates,complete:isWinner&&results.every(r=>r.complete),alternatives:results.length,groups:results[0].groups};
}
function suggest(tiles,context){
 const bonus=Array.isArray(tiles)?tiles.filter(t=>/^(flower|season)[1-4]$/.test(t)):[];
 if(new Set(bonus).size!==bonus.length)throw Error('Bunga atau Musim yang sama terpilih dua kali.');
 const result=groupTiles(Array.isArray(tiles)?tiles.map(t=>bonus.includes(t)?'flower':t):tiles,context);
 return {...result,bonusTiles:bonus};
}
// Validate alternatives against the actual game context before choosing a score suggestion.
function resolveReadings(views,context){
 if(!Array.isArray(views)||!views.length||views.length>3)throw Error('Hasil pembacaan tidak valid.');
 const valid=[];for(let index=0;index<views.length;index++){const view=views[index];if(!view||!Array.isArray(view.tiles)||view.tiles.length>26)continue;try{const result=suggest(view.tiles,context),confidence=Number.isFinite(view.confidence)?Math.max(0,Math.min(1,view.confidence)):null;valid.push({result,index,confidence,source:view.source});}catch{}}
 if(!valid.length)throw Error('Susunan foto belum memenuhi aturan. Ambil foto ulang atau isi manual.');
 valid.sort((a,b)=>(b.confidence??.75)-(a.confidence??.75)||a.index-b.index);const chosen=valid[0];
 const signature=r=>JSON.stringify([r.kongCount,r.candidates.slice().sort(),r.bonusTiles.slice().sort()]);
 const conflict=valid.some(v=>signature(v.result)!==signature(chosen.result));
 return {...chosen,needsReview:conflict||(chosen.confidence!==null&&chosen.confidence<.65),reason:conflict?'score-conflict':chosen.confidence!==null&&chosen.confidence<.65?'low-confidence':'valid-score'};
}
const api={suggest,resolveReadings};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongLocalPhotoRules=api;
})(globalThis);

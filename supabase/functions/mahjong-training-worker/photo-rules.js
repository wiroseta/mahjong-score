/* Photo suggestions never determine a winner or persist a score. */
(function(root){
'use strict';
const tiles=[...['char','dot','bam'].flatMap(s=>Array.from({length:9},(_,i)=>s+(i+1))), 'east','south','west','north','red','green','white','flower','unknown'];
const kinds=['chow','pong','kong','pair','loose','flower'];
const exposures=['open','concealed','declared_concealed_kong'];
function validate(input){
 if(!input||!Array.isArray(input.groups)||input.groups.length<1||input.groups.length>12)throw Error('Kelompok tile tidak valid. Ambil foto ulang.');
 let total=0;const counts={};
 const groups=input.groups.map(g=>{
  if(!g||!kinds.includes(g.kind)||!exposures.includes(g.exposure)||!Array.isArray(g.tiles)||g.tiles.length<1||g.tiles.length>18||g.tiles.some(t=>!tiles.includes(t)))throw Error('Hasil tile tidak valid.');
  total+=g.tiles.length;for(const t of g.tiles)if(!['flower','unknown'].includes(t)){counts[t]=(counts[t]||0)+1;if(counts[t]>4)throw Error('Lebih dari empat tile yang sama. Periksa foto/kelompok.');}
  if(g.exposure==='declared_concealed_kong'&&g.kind!=='kong')throw Error('Status Kong tertutup hanya untuk kelompok Kong.');
  return {kind:g.kind,exposure:g.exposure,tiles:g.tiles.slice(),uncertain:g.uncertain===true};
 });
 if(total>26)throw Error('Terlalu banyak tile. Foto satu pemain saja.');
 return {groups};
}
function validGroup(g){
 const t=g.tiles;if(t.includes('unknown'))return false;
 if(g.kind==='flower')return t.every(x=>x==='flower');
 if(t.includes('flower'))return false;
 if(g.kind==='loose')return true;
 if(g.kind==='chow'){
  if(t.length!==3)return false;
  const real=t.filter(x=>x!=='red');if(!real.length||real.some(x=>! /^(char|dot|bam)[1-9]$/.test(x)))return false;
  const suit=real[0].slice(0,-1),nums=real.map(x=>+x.slice(-1));
  return real.every(x=>x.slice(0,-1)===suit)&&new Set(nums).size===nums.length&&Array.from({length:7},(_,i)=>i+1).some(start=>nums.every(n=>n>=start&&n<start+3))&&(!t.includes('red')||g.exposure==='concealed');
 }
 if(g.kind==='pair')return t.length===2&&(t[0]===t[1]||t.includes('red'));
 return t.length===(g.kind==='kong'?4:3)&&t.every(x=>x===t[0]);
}
function eligible(g,isWinner){return isWinner||g.exposure==='open'||(g.kind==='kong'&&g.exposure==='declared_concealed_kong');}
function suggest(input,{isWinner,seat,setCount=4}){
 if(![4,5].includes(setCount))throw Error("Jumlah kelompok tidak didukung.");
 const data=validate(input),used=data.groups.filter(g=>eligible(g,isWinner));
 if(!used.length)throw Error('Tidak ada kelompok yang boleh dihitung untuk pemain ini.');
 if(used.some(g=>g.uncertain||g.kind==='loose'||g.tiles.includes('unknown')))throw Error('Pembacaan belum pasti atau ada tile yang belum dikelompokkan. Ambil foto lebih jelas atau gunakan pencatatan manual.');
 if(used.some(g=>!validGroup(g)))throw Error('Susunan kelompok belum sesuai. Ambil foto ulang atau gunakan pencatatan manual.');
 const scoring=used.filter(g=>g.kind!=='flower'),sets=scoring.filter(g=>['chow','pong','kong'].includes(g.kind)),pairs=scoring.filter(g=>g.kind==='pair');
 if(sets.length>setCount||scoring.reduce((n,g)=>n+g.tiles.length,0)>setCount*4+2)throw Error('Foto memuat terlalu banyak kelompok atau tile. Foto susunan satu pemain saja.');
 const kongCount=sets.filter(g=>g.kind==='kong').length,candidates=[];
 const hasSet=t=>sets.some(g=>['pong','kong'].includes(g.kind)&&g.tiles[0]===t);
 if(hasSet(['east','south','west','north'][seat]))candidates.push('Set Mulia');
 const dragons=['red','green','white'],dragonSets=dragons.filter(hasSet);
 if(dragonSets.length===3)candidates.push('Nantaboga (3 Naga Besar)');
 if(dragonSets.length===2&&pairs.some(g=>dragons.includes(g.tiles[0])&&!dragonSets.includes(g.tiles[0])&&g.tiles.every(x=>x===g.tiles[0])))candidates.push('Komodo (Naga Kecil)');
 const windSets=['east','south','west','north'].filter(hasSet);
 if(windSets.length===4||(windSets.length===3&&pairs.some(g=>['east','south','west','north'].includes(g.tiles[0])&&!windSets.includes(g.tiles[0])&&g.tiles.every(x=>x===g.tiles[0]))))candidates.push('Topan (4 Angin Besar/Kecil)');
 if(kongCount===4)candidates.push('Quad Murni (4 Quad)');
 // Whole-hand patterns are only suggested for the declared winner and a full grouped hand.
 const full=isWinner&&sets.length===setCount&&pairs.length===1&&scoring.length===setCount+1;
 const flat=scoring.flatMap(g=>g.tiles),numbered=t=>/^(char|dot|bam)[1-9]$/.test(t);
 if(full&&!flat.includes('red')){
  const suits=new Set(flat.filter(numbered).map(t=>t.slice(0,-1))),honors=flat.some(t=>!numbered(t));
  if(suits.size===1)candidates.push(honors?'Serupa Separuh':'Serupa Murni (Satu Warna)');
  if(flat.every(t=>!numbered(t)))candidates.push('Royal Murni');
  if(flat.every(t=>numbered(t)&&[1,9].includes(+t.slice(-1))))candidates.push('Terminal Murni');
  if(flat.every(t=>numbered(t)&&+t.slice(-1)>=2&&+t.slice(-1)<=8))candidates.push('Tengah Murni');
  if(sets.every(g=>g.kind!=='chow'))candidates.push('Triplet Murni');
 }
 return {kongCount,candidates:[...new Set(candidates)],ignored:data.groups.length-used.length,groups:used,complete:!!full};
}
const api={tiles,kinds,exposures,validate,validGroup,eligible,suggest};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongPhotoRules=api;
})(globalThis);

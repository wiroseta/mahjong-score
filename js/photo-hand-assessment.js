/* Visible Fan and structure assessment; a final photo cannot prove claim history. */
(function(root){'use strict';
const R=typeof module!=='undefined'&&module.exports?require('./photo-local-rules.js'):root.MahjongLocalPhotoRules;
function assess(tiles,{seat,isWinner=null,method=null}={}){
 if(!Array.isArray(tiles)||!tiles.length||tiles.length>26||!Number.isInteger(seat)||seat<0||seat>3||tiles.some(t=>! /^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower|flower[1-4]|season[1-4])$/.test(t)))return {message:'Susunan dan Fan belum dapat dinilai dari bacaan ini.',blocked:false};
 const bonus=tiles.filter(t=>/^(flower|season)[1-4]$/.test(t));
 if(new Set(bonus).size!==bonus.length)return {message:'Bunga/Musim yang sama terbaca lebih dari sekali; Fan belum dapat dipastikan.',blocked:true};
 const handTileCount=tiles.filter(t=>! /^(flower|season)/.test(t)).length;
 let structure=null,asWinner=false;
 for(const win of [...new Set([isWinner===true||handTileCount>=14,false,true])])try{structure=R.suggest(tiles,{seat,isWinner:win});asWinner=win;break;}catch{}
 let fan=0;const parts=[];for(const t of bonus){const red=t.startsWith('season'),match=Number(t.slice(-1))===seat+1,value=red?(match?2:1):(match?1:0);fan+=value;parts.push((red?'Bunga merah ':'Bunga hitam ')+t.slice(-1)+': '+value+' Fan');}
 const groups=structure?.groups||[],sets=groups.filter(g=>['chow','pong','kong'].includes(g.kind)),seatWind=['east','south','west','north'][seat];
 for(const g of sets){if(g.kind==='chow')continue;const t=g.tiles[0];if(t==='red'&&structure.alternatives>1)continue;if(['red','green','white'].includes(t)||t===seatWind){fan++;parts.push((t===seatWind?'Angin sesuai tempat duduk':'Naga')+': 1 Fan');}}
 const exact=!!structure&&!(structure.alternatives>1&&tiles.filter(t=>t==='red').length>=3)&&!tiles.includes('flower'),chi=sets.filter(g=>g.kind==='chow').length,pong=sets.filter(g=>g.kind!=='chow').length,pair=groups.filter(g=>g.kind==='pair').length;
 // Seat wind claims do not choose or break the ordinary first route.
 const ordinaryPong=sets.some(g=>g.kind!=='chow'&&g.tiles[0]!==seatWind&&g.exposure!=='declared_concealed_kong'),mixed=chi>0&&ordinaryPong;
 const inferredWinner=handTileCount>=14&&asWinner&&structure?.complete===true;
 let blocked=false,status='undetermined',verdict='Susunan belum dapat dipastikan.';
 if(!structure){status='invalid';blocked=true;verdict='Susunan belum sesuai: kelompok tile belum lengkap.';}
 else if(isWinner===true||handTileCount>=14){
  if(!asWinner||!structure.complete){status='invalid';blocked=true;verdict='Susunan belum sesuai untuk menang.';}
  else{status='valid';verdict=isWinner===true&&(method==='hu'||method==='zimo')?'Susunan akhir sesuai untuk '+(method==='hu'?'Hu':'Zi Mo')+'.':'Susunan menang sesuai.';}
 }else if(!exact||(structure.alternatives>1&&mixed&&fan<2))verdict='Susunan belum dapat dipastikan dari foto ini.';
 else if(mixed&&fan<2){
  if(isWinner===false){status='invalid';blocked=true;verdict='Susunan belum sesuai: campuran Chi dan Pong/Kong membutuhkan 2 Fan.';}
  else verdict='Susunan belum dapat dipastikan: status menang belum ditentukan.';
 }else{status='valid';verdict='Susunan yang terlihat sesuai.';}

 return {status,inferredWinner,handTileCount,fan,fanExact:exact,chi,pong,pair,mixed,blocked,structureComplete:!!structure?.complete,historyVerified:false,fanBreakdown:parts,message:(exact?'':'Minimal ')+fan+' Fan · '+verdict};
}
// A final photo cannot prove when an exposed set was claimed. Never turn a
// low-Fan mixture into a penalty. Only a declared, fully read invalid hand can
// establish a false win; search limits and recognition errors are not proof.
function falseHuEvidence(data,{seat,isWinner,method}={}){
 if(isWinner!==true||!['hu','zimo'].includes(method)||data?.verified!==true||data.rereadComplete!==true)return null;
 const tiles=data.tiles;
 if(!Array.isArray(tiles)||tiles.length>26||tiles.some(t=>! /^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower[1-4]|season[1-4])$/.test(t))||!Number.isInteger(seat)||seat<0||seat>3)return null;
 const bonuses=tiles.filter(t=>/^(flower|season)/.test(t)),ordinary=tiles.filter(t=>! /^(flower|season)/.test(t)),counts=new Map();
 if(new Set(bonuses).size!==bonuses.length)return null;
 for(const tile of ordinary){counts.set(tile,(counts.get(tile)||0)+1);if(counts.get(tile)>4)return null;}
 const quads=[...counts.values()].filter(n=>n===4).length;
 // Incomplete open sets, missing tiles and implausible counts are not a fine.
 if(![4,5].some(sets=>ordinary.length>=sets*3+2&&ordinary.length<=sets*3+2+Math.min(sets,quads)))return null;
 const signature=xs=>xs.slice().sort().join(','),key=signature(tiles);
 if(!Array.isArray(data.views)||data.views.length<2||data.views.length>3||data.views.some(v=>!Array.isArray(v?.tiles)||signature(v.tiles)!==key||!Number.isFinite(v.confidence)||v.confidence<0||v.confidence>1||(v.confidence<.85&&data.confirmed!==true)))return null;
 try{R.suggest(tiles,{seat,isWinner:true});return null;}catch(error){
  if(error.message!=='Susunan belum membentuk 4 atau 5 kelompok dan satu pasangan. Periksa koreksi jenis tile dan kelengkapan seluruh foto pemenang.')return null;
 }
 return {version:1,reason:'invalid-winning-structure',tiles:tiles.slice(),method};
}
const api={assess,falseHuEvidence};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongPhotoHandAssessment=api;
})(globalThis);

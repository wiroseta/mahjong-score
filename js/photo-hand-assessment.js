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
const api={assess};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongPhotoHandAssessment=api;
})(globalThis);

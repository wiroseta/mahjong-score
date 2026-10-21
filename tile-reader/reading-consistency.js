/* AGPL-3.0. Deterministic complete-photo corrections and cross-view agreement. */
(function(root){
'use strict';
const revision='mahjong-local-v2',validTile=t=>/^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower|flower[1-4]|season[1-4])$/.test(t);
function validate(row){
 if(!row||!/^[a-f0-9]{64}$/.test(row.image_sha256)||row.pipeline!==revision||!Number.isInteger(row.width)||!Number.isInteger(row.height)||row.width<1||row.height<1||row.width*row.height>40000000||!Array.isArray(row.annotations)||row.annotations.length<1||row.annotations.length>26)throw Error('Koreksi foto tidak valid.');
 const box=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]&&b[2]<=row.width&&b[3]<=row.height;
 if(row.region!==null&&!box(row.region))throw Error('Area koreksi tidak valid.');
 if(row.annotations.some(a=>!validTile(a.tile)||!box(a.box)))throw Error('Label atau kotak koreksi tidak valid.');return row;
}
function signature(items){return items.filter(a=>a.tile!=='not-tile').map(a=>a.tile).sort().join(',');}
function agree(a,b){return a.length>0&&signature(a)===signature(b)&&a.length===b.length;}
function confidence(items){const scores=items.map(i=>i.referenceMatch||i.approved?1:i.confidence).filter(Number.isFinite);return scores.length===items.length&&scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;}
function select(views){
 const usable=views.map((items,index)=>({items,index,confidence:confidence(items)})).filter(v=>v.items.length>0&&v.items.length<=26&&v.items.every(i=>validTile(i.tile)));
 if(!usable.length)return {index:0,verified:false,reason:'no-tiles',confidence:0};
 // Keep the full-image baseline unless a crop provides stronger evidence without dropping faces.
 const baseline=usable.find(v=>v.index===0)||usable[0];let chosen=baseline;
 for(const candidate of usable){if(candidate.items.length<baseline.items.length)continue;const votes=usable.filter(v=>agree(v.items,candidate.items)).length;if(votes>=2&&candidate.confidence>chosen.confidence+.04)chosen=candidate;}
 const weak=chosen.items.filter(i=>!i.referenceMatch&&!i.approved&&(!Number.isFinite(i.confidence)||i.confidence<.4)).length;
 const verified=chosen.confidence>=.65&&weak<=Math.floor(chosen.items.length*.1);
 return {index:chosen.index,verified,reason:verified?'read':'low-confidence',confidence:chosen.confidence};
}
async function digest(file){const bytes=await file.arrayBuffer(),hash=await root.crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}
const api={revision,validate,signature,agree,confidence,select,digest};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileReadingConsistency=api;
})(globalThis);

/* AGPL-3.0. Deterministic complete-photo corrections and cross-view agreement. */
(function(root){
'use strict';
const revision='mahjong-local-v2',validTile=t=>/^(char[1-9]|dot[1-9]|bam[1-9]|east|south|west|north|red|green|white|flower)$/.test(t);
function validate(row){
 if(!row||!/^[a-f0-9]{64}$/.test(row.image_sha256)||row.pipeline!==revision||!Number.isInteger(row.width)||!Number.isInteger(row.height)||row.width<1||row.height<1||row.width*row.height>40000000||!Array.isArray(row.annotations)||row.annotations.length<1||row.annotations.length>26)throw Error('Koreksi foto tidak valid.');
 const box=b=>Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[0]>=0&&b[1]>=0&&b[2]>b[0]&&b[3]>b[1]&&b[2]<=row.width&&b[3]<=row.height;
 if(row.region!==null&&!box(row.region))throw Error('Area koreksi tidak valid.');
 if(row.annotations.some(a=>!validTile(a.tile)||!box(a.box)))throw Error('Label atau kotak koreksi tidak valid.');return row;
}
function signature(items){return items.filter(a=>a.tile!=='not-tile').map(a=>a.tile).sort().join(',');}
function agree(a,b){return a.length>0&&signature(a)===signature(b)&&a.length===b.length;}
async function digest(file){const bytes=await file.arrayBuffer(),hash=await root.crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}
const api={revision,validate,signature,agree,digest};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileReadingConsistency=api;
})(globalThis);

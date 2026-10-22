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
function validBox(b){return Array.isArray(b)&&b.length===4&&b.every(Number.isFinite)&&b[2]>b[0]&&b[3]>b[1];}
function sameFace(a,b){
 if(a.tile!==b.tile)return false;
 const x=a.box,y=b.box,inter=Math.max(0,Math.min(x[2],y[2])-Math.max(x[0],y[0]))*Math.max(0,Math.min(x[3],y[3])-Math.max(x[1],y[1]));
 return inter/((x[2]-x[0])*(x[3]-x[1])+(y[2]-y[0])*(y[3]-y[1])-inter)>=.5;
}
function agree(a,b){
 if(!a.length||a.length!==b.length||signature(a)!==signature(b))return false;
 // All runtime detections carry original-image coordinates. Match each face once.
 if(!a.some(i=>i.box!==undefined)&&!b.some(i=>i.box!==undefined))return true;
 if(!a.every(i=>validBox(i.box))||!b.every(i=>validBox(i.box)))return false;
 const owners=Array(b.length).fill(-1);
 function match(i,seen){for(let j=0;j<b.length;j++)if(!seen.has(j)&&sameFace(a[i],b[j])){seen.add(j);if(owners[j]===-1||match(owners[j],seen)){owners[j]=i;return true;}}return false;}
 return a.every((_,i)=>match(i,new Set()));
}
function confidence(items){const scores=items.map(i=>i.referenceMatch||i.approved?1:i.confidence).filter(Number.isFinite);return scores.length===items.length&&scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0;}
function select(views){
 const usable=views.map((items,index)=>({items,index,confidence:confidence(items)})).filter(v=>v.items.length>0&&v.items.length<=26&&v.items.every(i=>validTile(i.tile)));
 if(!usable.length)return {index:0,verified:false,reason:'no-tiles',confidence:0};
 // Keep the full-image baseline unless a crop provides stronger evidence without dropping faces.
 const baseline=usable.find(v=>v.index===0)||usable[0];let chosen=baseline;
 for(const candidate of usable){if(candidate.items.length<baseline.items.length)continue;const votes=usable.filter(v=>agree(v.items,candidate.items)).length;if(votes>=2&&candidate.confidence>chosen.confidence+.04)chosen=candidate;}
 // A high average must not hide a single ambiguous tile or bonus label.
 const verified=chosen.items.every(i=>Number.isFinite(i.confidence)&&i.confidence>=.85&&i.confidence<=1&&i.uncertain!==true);
 return {index:chosen.index,verified,reason:verified?'read':'low-confidence',confidence:chosen.confidence};
}
// Verification follows visual evidence; score plausibility never chooses tile identities.
function resolve(views,regions){
 const selected=select(views),items=views[selected.index]||[];
 const accepted=views.map((v,index)=>agree(v,items)?index:-1).filter(i=>i>=0);
 const keys=new Set(accepted.map(i=>regions?JSON.stringify(regions[i]):String(i)));
 const conflict=views.some(v=>v.length&&select([v]).verified&&!agree(v,items));
 const overflow=views.some(v=>v.length>26);
 const verified=selected.verified&&keys.size>=2&&!conflict&&!overflow;
 return {...selected,verified,accepted,reason:overflow?'too-many-tiles':conflict?'view-conflict':keys.size<2?'insufficient-views':selected.reason};
}
function needsReview(annotation){const score=annotation.prediction?.confidence;return !Number.isFinite(score)||score<.85;}
function confirmed(annotations,evidence){
 if(evidence?.reason!=='low-confidence'||!annotations.length||!annotations.some(needsReview))return false;
 return annotations.every(a=>validTile(a.tile)&&a.tile===a.prediction?.tile&&!a.excluded&&Number.isFinite(a.prediction.confidence)&&a.prediction.confidence>=0&&a.prediction.confidence<=1&&(!needsReview(a)||a.reviewed===true));
}
async function digest(file){const bytes=await file.arrayBuffer(),hash=await root.crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');}
const api={revision,validate,signature,agree,confidence,select,resolve,needsReview,confirmed,digest};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileReadingConsistency=api;
})(globalThis);

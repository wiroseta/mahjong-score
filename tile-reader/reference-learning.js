/* AGPL-3.0. Conservative visual-reference matching, not ONNX weight training. */
(function(root){
'use strict';
const size=24,length=size*size;
const labels=[...['char','dot','bam'].flatMap(s=>Array.from({length:9},(_,i)=>s+(i+1))),'east','south','west','north','red','green','white'];
function validFeatures(v){return Array.isArray(v)&&v.length===length&&v.every(n=>Number.isInteger(n)&&n>=0&&n<=255);}
function normalize(v){if(!validFeatures(v))return null;const mean=v.reduce((a,b)=>a+b,0)/length,center=v.map(n=>n-mean),norm=Math.sqrt(center.reduce((a,b)=>a+b*b,0));return norm<100?null:center.map(n=>n/norm);}
function prepare(examples){return examples.filter(e=>labels.includes(e.label)&&e.active===true).map(e=>({...e,vector:normalize(e.features)})).filter(e=>e.vector);}
function match(features,examples){const v=normalize(features);if(!v)return null;const scores=new Map();for(const e of examples){if(!e.vector)continue;const score=v.reduce((sum,n,i)=>sum+n*e.vector[i],0);if(score>(scores.get(e.label)||-1))scores.set(e.label,score);}const ranked=[...scores].sort((a,b)=>b[1]-a[1]);if(!ranked.length)return null;const [label,score]=ranked[0],margin=score-(ranked[1]?.[1]??0);if(score<.985||margin<.06)return null;return {label,similarity:score};}
const api={size,length,labels,validFeatures,normalize,prepare,match};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileReferenceLearning=api;
})(globalThis);

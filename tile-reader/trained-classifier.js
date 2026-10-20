/* RGB24 MLP inference for supervised candidate models; no exemplar lookup. */
(function(root){
'use strict';
function validate(model){
 if(model?.schema!=='mahjong-rgb24-mlp-v1'||model.size!==24||model.hidden!==64||!Array.isArray(model.labels)||![34,42].includes(model.labels.length)||new Set(model.labels).size!==model.labels.length||model.labels.some(t=>!/^(?:(?:char|dot|bam)[1-9]|east|south|west|north|red|green|white|(?:flower|season)[1-4])$/.test(t)))throw Error('Model tile tidak valid.');
 if(model.labels.length===34&&model.labels.some(t=>/^(flower|season)/.test(t)))throw Error('Kelas model lama tidak lengkap.');
 const shapes=[[1728,64],[64],[64,model.labels.length],[model.labels.length]];if(!Array.isArray(model.weights)||model.weights.length!==4)throw Error('Bobot tidak valid.');
 function shape(a,d){if(!Array.isArray(a)||a.length!==d[0])return false;return a.every(v=>d.length>1?shape(v,d.slice(1)):Number.isFinite(v));}
 if(model.weights.some((w,i)=>!shape(w,shapes[i])))throw Error('Bobot tidak valid.');return model;
}
function create(model){validate(model);const [w1,b1,w2,b2]=model.weights;return rgba=>{
 if(!rgba||rgba.length!==2304)throw Error('Potongan RGB24 diperlukan.');
 const x=new Float32Array(1728);for(let i=0;i<576;i++)for(let c=0;c<3;c++){const v=rgba[i*4+c];if(!Number.isFinite(v)||v<0||v>255)throw Error('Piksel tidak valid.');x[i*3+c]=v/127.5-1;}
 const h=new Float32Array(64);for(let j=0;j<64;j++){let v=b1[j];for(let i=0;i<x.length;i++)v+=x[i]*w1[i][j];h[j]=Math.max(0,v);}
 const scores=b2.slice();for(let j=0;j<model.labels.length;j++)for(let i=0;i<64;i++)scores[j]+=h[i]*w2[i][j];const max=Math.max(...scores),e=scores.map(v=>Math.exp(v-max)),sum=e.reduce((a,b)=>a+b,0);return model.labels.map((tile,i)=>({tile,probability:e[i]/sum})).sort((a,b)=>b.probability-a.probability);
 };}
const api={validate,create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TrainedTileClassifier=api;
})(globalThis);

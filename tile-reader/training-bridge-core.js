/* Private queue -> audited dataset -> offline candidate. Never publishes a model. */
(function(root){
'use strict';
const P=typeof module!=='undefined'&&module.exports?require('./learning-policy.js'):root.TileLearningPolicy;
const labels=P.labels.slice(),INPUT=1728,HIDDEN=64,CLASSES=labels.length;
async function digest(text,cryptoApi=root.crypto){const bytes=await cryptoApi.subtle.digest('SHA-256',new TextEncoder().encode(text));return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');}
async function plan(jobs,cryptoApi=root.crypto){
 if(!Array.isArray(jobs)||jobs.length>128)throw Error('Antrean bahan pelatihan tidak valid.');
 const samples=[],unique=[],seen=new Map(),counts=Object.fromEntries(labels.map(t=>[t,0])),sources={train:0,validation:0,test:0};
 for(const job of jobs){
  if(!job||!/^[a-f0-9]{64}$/.test(job.image_sha256)||typeof job.photo_data!=='string'||job.photo_data.length>800000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(job.photo_data)||!Number.isInteger(job.width)||!Number.isInteger(job.height)||job.width<1||job.height<1||job.width>4096||job.height>4096||job.width*job.height>16000000)throw Error('Foto antrean tidak valid.');
  const annotations=P.annotations(job.labels,job.width,job.height),signature=JSON.stringify(annotations);
  if(seen.has(job.image_sha256)){if(seen.get(job.image_sha256)!==signature)throw Error('Foto yang sama memiliki label berbeda. Periksa antrean.');continue;}seen.set(job.image_sha256,signature);
  const bucket=parseInt((await digest(job.image_sha256,cryptoApi)).slice(0,8),16)%10,split=bucket<7?'train':bucket===7?'validation':'test';sources[split]++;
  const jobIndex=unique.length;unique.push(job);for(const a of annotations){counts[a.tile]++;samples.push({jobIndex,source:job.image_sha256,split,tile:a.tile,box:a.box});}
 }
 const trainClasses=new Set(samples.filter(a=>a.split==='train').map(a=>a.tile)),missing=labels.filter(t=>!counts[t]),missingTrain=labels.filter(t=>!trainClasses.has(t)),missingSplits=Object.keys(sources).filter(k=>!sources[k]);
 return {jobs:unique,samples,audit:{photos:unique.length,tiles:samples.length,classes:labels.length-missing.length,totalClasses:CLASSES,missing,missingTrain,missingSplits,sources,ready:samples.length>0&&!missingTrain.length&&!missingSplits.length}};
}
function validateSamples(rows){
 if(!Array.isArray(rows)||rows.length>3328)throw Error('Dataset tidak valid.');const splits={train:[],validation:[],test:[]},seen=new Map(),pixels=new Map();
 for(const row of rows){if(!row||!Object.hasOwn(splits,row.split)||!labels.includes(row.tile)||typeof row.source!=='string'||!row.source||!row.x||row.x.length!==INPUT||Array.from(row.x).some(n=>!Number.isFinite(n)||n< -1||n>1))throw Error('Potongan data pelatihan tidak valid.');
  if(seen.has(row.source)&&seen.get(row.source)!==row.split)throw Error('Foto yang sama masuk beberapa bagian dataset.');seen.set(row.source,row.split);
  if(row.pixelHash){if(pixels.has(row.pixelHash)&&pixels.get(row.pixelHash)!==row.split)throw Error('Potongan identik ditemukan pada latihan dan pengujian. Tambahkan foto lain.');pixels.set(row.pixelHash,row.split);}
  splits[row.split].push({...row,y:labels.indexOf(row.tile)});
 }
 if(Object.values(splits).some(a=>!a.length))throw Error('Data latihan, validasi, dan pengujian semuanya diperlukan.');
 if(new Set(splits.train.map(a=>a.y)).size!==CLASSES)throw Error('Data latihan belum mencakup seluruh '+CLASSES+' jenis tile.');return splits;
}
function forward(x,w){const h=new Float32Array(HIDDEN),p=new Float64Array(CLASSES);for(let j=0;j<HIDDEN;j++){let v=w[1][j];for(let i=0;i<INPUT;i++)v+=x[i]*w[0][i*HIDDEN+j];h[j]=Math.max(0,v);}for(let k=0;k<CLASSES;k++){let v=w[3][k];for(let j=0;j<HIDDEN;j++)v+=h[j]*w[2][j*CLASSES+k];p[k]=v;}const max=Math.max(...p);let sum=0;for(let k=0;k<CLASSES;k++){p[k]=Math.exp(p[k]-max);sum+=p[k];}for(let k=0;k<CLASSES;k++)p[k]/=sum;return {h,p};}
function evaluate(rows,w){let loss=0,correct=0;for(const r of rows){const {p}=forward(r.x,w);loss-=Math.log(Math.max(p[r.y],1e-8));if(p.indexOf(Math.max(...p))===r.y)correct++;}return {tiles:rows.length,accuracy:correct/rows.length,classCoverage:new Set(rows.map(r=>r.y)).size,loss:loss/rows.length};}
async function train(rows,{epochs=100,seed=1591,onProgress=()=>{}}={}){
 if(!Number.isInteger(epochs)||epochs<1||epochs>1000)throw Error('Jumlah putaran tidak valid.');const splits=validateSamples(rows);let state=seed>>>0;const rng=()=>{state^=state<<13;state^=state>>>17;state^=state<<5;return ((state>>>0)+1)/4294967297;},normal=()=>Math.sqrt(-2*Math.log(rng()))*Math.cos(2*Math.PI*rng())*.02;
 const w=[Float32Array.from({length:INPUT*HIDDEN},normal),new Float32Array(HIDDEN),Float32Array.from({length:HIDDEN*CLASSES},normal),new Float32Array(CLASSES)];let best=null,bestLoss=Infinity,stale=0,completed=0;
 for(let epoch=0;epoch<epochs;epoch++){
  const order=splits.train.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  for(let start=0;start<order.length;start+=32){const batch=order.slice(start,start+32),g=w.map(a=>new Float32Array(a.length));for(const idx of batch){const r=splits.train[idx],{h,p}=forward(r.x,w);p[r.y]-=1;for(let k=0;k<CLASSES;k++)p[k]/=batch.length;
    const dh=new Float32Array(HIDDEN);for(let j=0;j<HIDDEN;j++){for(let k=0;k<CLASSES;k++){g[2][j*CLASSES+k]+=h[j]*p[k];dh[j]+=w[2][j*CLASSES+k]*p[k];}if(h[j]<=0)dh[j]=0;g[1][j]+=dh[j];}for(let i=0;i<INPUT;i++)for(let j=0;j<HIDDEN;j++)g[0][i*HIDDEN+j]+=r.x[i]*dh[j];for(let k=0;k<CLASSES;k++)g[3][k]+=p[k];
   }for(let a=0;a<w.length;a++)for(let i=0;i<w[a].length;i++){const gradient=g[a][i]+(a===0||a===2?.0001*w[a][i]:0);w[a][i]-=.02*Math.max(-5,Math.min(5,gradient));}
  }
  const m=evaluate(splits.validation,w);completed=epoch+1;if(m.loss<bestLoss-1e-5){best=w.map(a=>a.slice());bestLoss=m.loss;stale=0;}else stale++;
  onProgress({epoch:completed,epochs,validationLoss:m.loss});if(stale>=15)break;await new Promise(resolve=>setTimeout(resolve,0));
 }
 const metrics=Object.fromEntries(Object.entries(splits).map(([name,rows])=>[name,evaluate(rows,best)])),sourceCounts=Object.fromEntries(Object.entries(splits).map(([k,rows])=>[k,new Set(rows.map(r=>r.source)).size]));
 return {schema:'mahjong-rgb24-mlp-v1',status:'candidate',labels:labels.slice(),size:24,hidden:HIDDEN,weights:[Array.from({length:INPUT},(_,i)=>Array.from(best[0].slice(i*HIDDEN,(i+1)*HIDDEN))),Array.from(best[1]),Array.from({length:HIDDEN},(_,j)=>Array.from(best[2].slice(j*CLASSES,(j+1)*CLASSES))),Array.from(best[3])],metrics,sourceCounts,epochs:completed,splitLeakage:false,releaseApproved:false};
}
const api={plan,train,validateSamples,labels,digest};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongTrainingBridgeCore=api;
})(globalThis);

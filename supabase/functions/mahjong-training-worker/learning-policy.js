/* New learning lifecycle: proposals are never live model updates. */
(function(root){
'use strict';
const labels=Object.freeze([...['char','dot','bam'].flatMap(s=>Array.from({length:9},(_,i)=>s+(i+1))),'east','south','west','north','red','green','white',...['flower','season'].flatMap(s=>Array.from({length:4},(_,i)=>s+(i+1)))]);
function annotations(value,width,height){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>40000000||!Array.isArray(value)||!value.length||value.length>26)throw Error('Anotasi tidak valid.');
 const counts=new Map();const out=value.map(a=>{if(!a||!labels.includes(a.tile)||!Array.isArray(a.box)||a.box.length!==4||a.box.some(n=>!Number.isFinite(n)))throw Error('Jenis atau kotak tile tidak valid.');const [x,y,r,b]=a.box;if(x<0||y<0||r>width||b>height||r-x<2||b-y<2)throw Error('Kotak di luar foto.');counts.set(a.tile,(counts.get(a.tile)||0)+1);return {tile:a.tile,box:a.box.slice()};});
 if([...counts].some(([t,n])=>/^(flower|season)/.test(t)&&n>1))throw Error('Tile bonus yang sama terpilih dua kali.');
 if([...counts.values()].some(n=>n>4))throw Error('Lebih dari empat tile sejenis.');
 for(let i=0;i<out.length;i++)for(let j=i+1;j<out.length;j++){const a=out[i].box,b=out[j].box,intersection=Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));if(intersection/Math.min((a[2]-a[0])*(a[3]-a[1]),(b[2]-b[0])*(b[3]-b[1]))>.5)throw Error('Kotak tile bertumpuk.');}
 return out;
}
function assess(first,second,{width,height,coverageChecked=false,rulesValid=false}={}){
 try{const a=annotations(first,width,height),b=annotations(second,width,height);if(a.length!==b.length)return {state:'needs_admin',reason:'count-conflict'};const used=new Set();for(const tile of a){let found=-1;for(let i=0;i<b.length;i++){if(used.has(i)||tile.tile!==b[i].tile)continue;const x=tile.box,y=b[i].box,intersection=Math.max(0,Math.min(x[2],y[2])-Math.max(x[0],y[0]))*Math.max(0,Math.min(x[3],y[3])-Math.max(x[1],y[1]));const union=(x[2]-x[0])*(x[3]-x[1])+(y[2]-y[0])*(y[3]-y[1])-intersection;if(intersection/union>=.7){found=i;break;}}if(found<0)return {state:'needs_admin',reason:'tile-conflict'};used.add(found);}if(!coverageChecked||!rulesValid)return {state:'needs_admin',reason:'coverage-or-rules'};return {state:'candidate',reason:'consistent-proposal',annotations:a};}catch{return {state:'needs_admin',reason:'invalid-proposal'};}
}
// Conservative release proof: zero observed errors on independent, scored photos.
// With zero errors, the one-sided 95% exact lower bound is 0.05^(1/n).
const accuracyTarget=.999;
function reliabilityLowerBound(perfect,total){return Number.isInteger(perfect)&&Number.isInteger(total)&&total>0&&perfect===total?Math.exp(Math.log(.05)/total):0;}
function canPromote(report){
 if(!report||report.splitLeakage!==false||report.realPhotoTest!==true||report.expectedScoresAudited!==true||report.classCoverage!==labels.length||report.regressionFailures!==0)return false;
 const n=report.testImages;
 if(!Number.isInteger(n)||n<=0||report.independentSourceGroups!==n||report.testWholeHandCorrect!==n||report.testScoredPhotos!==n||report.testScoreCorrect!==n)return false;
 if(!Number.isInteger(report.testTileCount)||report.testTileCount<n||report.testTileCorrect!==report.testTileCount)return false;
 if(report.testWholeHandAccuracy!==1||report.testWrongPointRate!==0||!Number.isFinite(report.baselineWholeHandAccuracy)||report.baselineWholeHandAccuracy<0||report.baselineWholeHandAccuracy>=1)return false;
 return reliabilityLowerBound(n,n)>=accuracyTarget&&reliabilityLowerBound(report.testTileCorrect,report.testTileCount)>=accuracyTarget;
}

function mayDeletePixels(record){return !!record&&record.keepForEvaluation!==true&&record.trainingConsumed===true&&record.evaluationComplete===true&&record.modelAccepted===true&&record.noOtherDatasetReferences===true;}
const api={labels,annotations,assess,canPromote,reliabilityLowerBound,accuracyTarget,mayDeletePixels};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileLearningPolicy=api;
})(globalThis);

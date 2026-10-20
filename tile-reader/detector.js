/* Local inference postprocessing. No network requests, score decisions or hand grouping. */
(function(root){
'use strict';
const classes=['1m','1p','1s','1z','2m','2p','2s','2z','3m','3p','3s','3z','4m','4p','4s','4z','5m','5p','5s','5z','6m','6p','6s','6z','7m','7p','7s','7z','8m','8p','8s','9m','9p','9s','0m','0p','0s'];
function tileKey(label){if(/^[0-9][mps]$/.test(label))return ({m:'char',p:'dot',s:'bam'})[label[1]]+(label[0]==='0'?'5':label[0]);return {'1z':'east','2z':'south','3z':'west','4z':'north','5z':'white','6z':'green','7z':'red'}[label]||'unknown';}
function overlap(a,b){const intersection=Math.max(0,Math.min(a[2],b[2])-Math.max(a[0],b[0]))*Math.max(0,Math.min(a[3],b[3])-Math.max(a[1],b[1]));return intersection/Math.max(1e-9,(a[2]-a[0])*(a[3]-a[1])+(b[2]-b[0])*(b[3]-b[1])-intersection);}
function decode(data,dims,{scale,dx,dy,width,height},threshold=.25){
 if(dims.length!==3||dims[0]!==1||dims[1]!==classes.length+4||data.length!==dims[1]*dims[2])throw Error('Bentuk keluaran model tidak sesuai.');
 const n=dims[2],items=[];
 for(let i=0;i<n;i++){
  let best=-1,score=0,runner=0;
  for(let c=0;c<classes.length;c++){const v=data[(c+4)*n+i];if(v>score){runner=score;score=v;best=c;}else if(v>runner)runner=v;}
  if(best<0||!Number.isFinite(score)||score>1||score<threshold)continue;
  const cx=data[i],cy=data[n+i],w=data[2*n+i],h=data[3*n+i];
  const box=[Math.max(0,(cx-w/2-dx)/scale),Math.max(0,(cy-h/2-dy)/scale),Math.min(width,(cx+w/2-dx)/scale),Math.min(height,(cy+h/2-dy)/scale)];
  if(box.some(x=>!Number.isFinite(x))||box[2]<=box[0]||box[3]<=box[1])continue;
  items.push({tile:tileKey(classes[best]),label:classes[best],confidence:score,uncertain:score<.7||score-runner<.15,box});
 }
 const kept=[];for(const item of items.sort((a,b)=>b.confidence-a.confidence)){if(kept.every(k=>overlap(k.box,item.box)<.45))kept.push(item);}
 return kept.sort((a,b)=>a.box[1]-b.box[1]||a.box[0]-b.box[0]);
}
function median(values){const a=values.slice().sort((a,b)=>a-b);return a[Math.floor(a.length/2)];}
// Prefer a coherent row of physically larger tiles, not an arbitrary bottom image strip.
// The selected rectangle remains a proposal: the photograph cannot identify its owner.
function foreground(items,width,height){
 const valid=items.filter(d=>d.confidence>=.25&&d.box.length===4&&d.box.every(Number.isFinite)&&d.box[2]>d.box[0]&&d.box[3]>d.box[1]);
 const rows=[];
 for(const item of valid.slice().sort((a,b)=>(a.box[1]+a.box[3])-(b.box[1]+b.box[3]))){
  const y=(item.box[1]+item.box[3])/2,h=item.box[3]-item.box[1];
  const row=rows.find(r=>Math.abs(y-median(r.map(d=>(d.box[1]+d.box[3])/2)))<.6*Math.max(h,median(r.map(d=>d.box[3]-d.box[1]))));
  if(row)row.push(item);else rows.push([item]);
 }
 const candidates=rows.filter(r=>r.length>=3).map(row=>({row,score:row.length*Math.sqrt(median(row.map(d=>d.box[3]-d.box[1])))})).sort((a,b)=>b.score-a.score);
 if(!candidates.length)return null;
 const row=candidates[0].row,mw=median(row.map(d=>d.box[2]-d.box[0])),mh=median(row.map(d=>d.box[3]-d.box[1]));
 const box=[Math.max(0,Math.floor(Math.min(...row.map(d=>d.box[0]))-mw*1.8)),Math.max(0,Math.floor(Math.min(...row.map(d=>d.box[1]))-mh*.35)),Math.min(width,Math.ceil(Math.max(...row.map(d=>d.box[2]))+mw*1.8)),Math.min(height,Math.ceil(Math.max(...row.map(d=>d.box[3]))+mh*.35))];
 if((box[2]-box[0])*(box[3]-box[1])>width*height*.85)return null;
 return {box,ambiguous:candidates.length>1&&candidates[1].score>candidates[0].score*.75,seedCount:row.length};
}
// A single player's photograph can contain several rows. Never drop a detected row.
function coverage(items,width,height){
 const valid=items.filter(i=>Array.isArray(i.box)&&i.box.length===4&&i.box.every(Number.isFinite)&&i.box[2]>i.box[0]&&i.box[3]>i.box[1]);if(!valid.length)return null;
 const pad=median(valid.map(i=>i.box[3]-i.box[1]))*.3;
 const box=[Math.max(0,Math.floor(Math.min(...valid.map(i=>i.box[0]))-pad)),Math.max(0,Math.floor(Math.min(...valid.map(i=>i.box[1]))-pad)),Math.min(width,Math.ceil(Math.max(...valid.map(i=>i.box[2]))+pad)),Math.min(height,Math.ceil(Math.max(...valid.map(i=>i.box[3]))+pad))];
 return (box[2]-box[0])*(box[3]-box[1])<width*height*.9?box:null;
}
function readingOrder(items){
 const rows=[];
 // Group by vertical centers before sorting horizontally; do not interleave rows by x.
 for(const item of items.slice().sort((a,b)=>(a.box[1]+a.box[3])-(b.box[1]+b.box[3]))){
  const cy=(item.box[1]+item.box[3])/2,h=item.box[3]-item.box[1];
  let best=null,distance=Infinity;
  for(const row of rows){const center=median(row.map(d=>(d.box[1]+d.box[3])/2)),rh=median(row.map(d=>d.box[3]-d.box[1])),delta=Math.abs(cy-center);if(delta<.6*Math.min(h,rh)&&delta<distance){best=row;distance=delta;}}
  if(best)best.push(item);else rows.push([item]);
 }
 return rows.sort((a,b)=>median(a.map(d=>(d.box[1]+d.box[3])/2))-median(b.map(d=>(d.box[1]+d.box[3])/2))).flatMap((row,r)=>row.slice().sort((a,b)=>a.box[0]-b.box[0]).map((item,i)=>({...item,row:r+1,position:i+1})));
}
// Match spatial faces first, independently of their predicted identity.
function evaluate(items,reference,minIOU=.25){
 const edges=[];for(let i=0;i<items.length;i++)for(let j=0;j<reference.length;j++){const iou=overlap(items[i].box,reference[j].box);if(iou>=minIOU)edges.push({i,j,iou});}
 const seenItems=new Set(),seenReference=new Set(),matches=[];
 for(const edge of edges.sort((a,b)=>b.iou-a.iou)){if(seenItems.has(edge.i)||seenReference.has(edge.j))continue;seenItems.add(edge.i);seenReference.add(edge.j);matches.push({...edge,correct:items[edge.i].tile===reference[edge.j].tile});}
 return {expected:reference.length,detected:items.length,correct:matches.filter(m=>m.correct).length,wrong:matches.filter(m=>!m.correct).length,missed:reference.length-seenReference.size,extra:items.length-seenItems.size,matches};
}
const api={classes,tileKey,overlap,decode,foreground,coverage,readingOrder,evaluate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LocalTileDetector=api;
})(globalThis);

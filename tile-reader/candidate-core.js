/* Experimental classifier. No score or training writes. */
(function(root){'use strict';
function rgb24(pixels){if(pixels.length!==24*24*4)throw Error('Potongan foto harus 24 × 24.');const out=new Float32Array(3*24*24);for(let i=0;i<576;i++)for(let c=0;c<3;c++)out[c*576+i]=pixels[i*4+c]/127.5-1;return out;}
function prediction(logits,labels){if(logits.length!==42||labels.length!==42||!Array.from(logits).every(Number.isFinite))throw Error('Keluaran model tidak sesuai.');const max=Math.max(...logits),values=Array.from(logits,x=>Math.exp(x-max)),sum=values.reduce((a,b)=>a+b,0),index=values.indexOf(Math.max(...values));return {tile:labels[index],confidence:values[index]/sum};}
const api={rgb24,prediction};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CandidateTileCore=api;
})(globalThis);

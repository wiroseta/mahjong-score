/* Deterministic antialiased bilinear resizing, matching the training crop pipeline.
 * Browser canvas defaults undersample large photographs when shrinking to RGB24. */
(function(root){'use strict';
function weights(source,dest){
 const scale=source/dest,support=Math.max(1,scale),rows=[];
 for(let i=0;i<dest;i++){
  const center=(i+.5)*scale,lo=Math.max(0,Math.floor(center-support)),hi=Math.min(source,Math.ceil(center+support));let total=0;const taps=[];
  for(let j=lo;j<hi;j++){const value=Math.max(0,1-Math.abs(j+.5-center)/support);if(value>0){taps.push([j,value]);total+=value;}}
  rows.push(taps.map(([j,v])=>[j,v/total]));
 }
 return rows;
}
function resizeRGBA(pixels,width,height,outWidth,outHeight){
 if(![width,height,outWidth,outHeight].every(n=>Number.isInteger(n)&&n>0)||pixels.length!==width*height*4)throw Error('Ukuran gambar tidak valid.');
 const wx=weights(width,outWidth),wy=weights(height,outHeight),temp=new Uint8ClampedArray(outWidth*height*4),output=new Uint8ClampedArray(outWidth*outHeight*4);
 for(let y=0;y<height;y++)for(let x=0;x<outWidth;x++)for(let c=0;c<4;c++){let sum=0;for(const [j,w] of wx[x])sum+=pixels[(y*width+j)*4+c]*w;temp[(y*outWidth+x)*4+c]=Math.floor(sum+.5);}
 for(let y=0;y<outHeight;y++)for(let x=0;x<outWidth;x++)for(let c=0;c<4;c++){let sum=0;for(const [j,w] of wy[y])sum+=temp[(j*outWidth+x)*4+c]*w;output[(y*outWidth+x)*4+c]=Math.floor(sum+.5);}
 return output;
}
// Native crop only at 1:1. Resampling is explicit, independent of browser quality defaults.
function crop(img,box,width,height){
 const left=Math.max(0,Math.round(box[0])),top=Math.max(0,Math.round(box[1])),right=Math.min(img.naturalWidth,Math.round(box[2])),bottom=Math.min(img.naturalHeight,Math.round(box[3])),w=right-left,h=bottom-top;
 if(w<1||h<1)throw Error('Area tile tidak valid.');
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,left,top,w,h,0,0,w,h);const rgba=ctx.getImageData(0,0,w,h).data;
 const result=resizeRGBA(rgba,w,h,width,height);canvas.width=canvas.height=1;return result;
}
function rgbTensor(pixels,width,height){
 if(![width,height].every(n=>Number.isInteger(n)&&n>0&&n<=128)||pixels.length!==width*height*4)throw Error('Ukuran potongan model tidak valid.');
 const plane=width*height,out=new Float32Array(plane*3);
 for(let i=0;i<plane;i++)for(let c=0;c<3;c++)out[c*plane+i]=pixels[i*4+c]/127.5-1;
 return out;
}
const api={resizeRGBA,crop,rgbTensor};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileImagePreprocess=api;
})(globalThis);

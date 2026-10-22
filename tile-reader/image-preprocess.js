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

// Bounded luminance correction: never redraws or invents tile markings.
function lightProfile(pixels){
 if(!pixels.length||pixels.length%4)throw Error('Piksel gambar tidak valid.');
 const histogram=new Uint32Array(256);let count=0;
 const step=Math.max(1,Math.floor(pixels.length/4/65536));
 for(let i=0;i<pixels.length;i+=4*step){if(pixels[i+3]<128)continue;histogram[Math.round(.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2])]++;count++;}
 if(!count)return {applied:false,gamma:1};
 function percentile(q){let sum=0;for(let i=0;i<256;i++){sum+=histogram[i];if(sum>=count*q)return i;}return 255;}
 const mid=percentile(.5),bright=percentile(.85);
 // A bright scene or tiny exposure deficit stays byte-identical.
 const applied=mid<100&&bright<160&&bright>8;
 const gamma=applied?Math.max(.48,Math.min(.92,Math.log(.72)/Math.log(Math.max(.04,bright/255)))):1;
 return {applied,gamma,median:mid,bright};
}
function improveLight(pixels,profile=lightProfile(pixels)){
 const out=new Uint8ClampedArray(pixels);
 if(!profile.applied)return {pixels:out,profile};
 for(let i=0;i<out.length;i+=4){const y=(.2126*pixels[i]+.7152*pixels[i+1]+.0722*pixels[i+2])/255;
  // Lift shadows smoothly, protect highlights, preserve channel ratios.
  const target=Math.pow(y,profile.gamma),gain=y>0?Math.min(4,target/y):1;
  const peak=Math.max(pixels[i],pixels[i+1],pixels[i+2]);const safe=peak?Math.min(gain,255/peak):1;
  for(let c=0;c<3;c++)out[i+c]=Math.round(pixels[i+c]*safe);
 }
 return {pixels:out,profile};
}
async function improveImage(img){
 const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
 try{const context=c.getContext('2d',{willReadFrequently:true});context.drawImage(img,0,0);const data=context.getImageData(0,0,c.width,c.height),result=improveLight(data.data);
  if(!result.profile.applied)return {image:img,profile:result.profile};
  data.data.set(result.pixels);context.putImageData(data,0,0);
  const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw Error('Pencahayaan foto belum dapat diperbaiki.');
  const url=URL.createObjectURL(blob);try{const image=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Foto yang diperbaiki tidak dapat dibuka.'));image.src=url;});return {image,profile:result.profile};}finally{URL.revokeObjectURL(url);}
 }finally{c.width=c.height=1;}
}

const api={resizeRGBA,crop,rgbTensor,lightProfile,improveLight,improveImage};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TileImagePreprocess=api;
})(globalThis);

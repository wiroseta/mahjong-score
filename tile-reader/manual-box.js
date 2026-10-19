/* Geometry for administrator-added tile boxes. No model label is invented. */
(function(root){
'use strict';
function validate(box,{width,height,region=null,boxes=[]}){
 if(!Array.isArray(box)||box.length!==4||!box.every(Number.isFinite)||!Number.isFinite(width)||!Number.isFinite(height))throw Error('Kotak tile tidak valid.');
 const [x1,y1,x2,y2]=box;if(x1<0||y1<0||x2>width||y2>height||x2-x1<8||y2-y1<8)throw Error('Bingkai seluruh muka satu tile dengan dua sudut yang berjauhan.');
 if(region&&(x1<region[0]||y1<region[1]||x2>region[2]||y2>region[3]))throw Error('Kotak harus di dalam area foto yang dipilih.');
 if(boxes.length>=26)throw Error('Maksimal 26 tile. Foto hanya susunan satu pemain.');
 for(const b of boxes){const w=Math.max(0,Math.min(x2,b[2])-Math.max(x1,b[0])),h=Math.max(0,Math.min(y2,b[3])-Math.max(y1,b[1])),intersection=w*h,area=(x2-x1)*(y2-y1),other=(b[2]-b[0])*(b[3]-b[1]);if(intersection/Math.min(area,other)>.65)throw Error('Kotak bertumpuk dengan tile yang sudah ada. Koreksi label tile tersebut atau pilih Bukan tile untuk mengabaikannya.');}
 return box.slice();
}
const api={validate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ManualTileBox=api;
})(globalThis);

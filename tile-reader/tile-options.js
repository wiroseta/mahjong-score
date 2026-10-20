/* Correction labels include bonus tiles; model output remains unchanged. */
(function(root){'use strict';
const base=[...['char','dot','bam'].flatMap(s=>Array.from({length:9},(_,i)=>s+(i+1))),'east','south','west','north','red','green','white'];
const bonus=[...['flower','season'].flatMap(s=>Array.from({length:4},(_,i)=>s+(i+1)))];
const isBonus=t=>bonus.includes(t),name=t=>({east:'Timur',south:'Selatan',west:'Barat',north:'Utara',red:'Naga merah',green:'Naga hijau',white:'Naga putih',unknown:'Pilih jenis tile','not-tile':'Bukan tile'}[t]||t.replace(/^char/,'Karakter ').replace(/^dot/,'Bulat ').replace(/^bam/,'Bambu ').replace(/^flower/,'Bunga ').replace(/^season/,'Musim '));
const scoreTiles=annotations=>annotations.filter(a=>a.tile!=='not-tile'&&a.excluded!==true).map(a=>a.tile);
const api={scoreTiles,labels:base.concat(bonus),bonus,isBonus,name};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MahjongTileOptions=api;
})(globalThis);

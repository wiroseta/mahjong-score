/* Mahjong Score 15.9 — shared appearance preference, including embedded reader. */
(function(root){
'use strict';
const key='mahjong_theme';
const normalize=v=>['light','dark','system'].includes(v)?v:'system';
const resolve=(v,dark)=>normalize(v)==='system'?(dark?'dark':'light'):normalize(v);
if(typeof module!=='undefined'&&module.exports){module.exports={normalize,resolve};return;}
const media=root.matchMedia('(prefers-color-scheme: dark)');
let preference='system';try{preference=normalize(root.localStorage.getItem(key));}catch{}
function apply(){const theme=resolve(preference,media.matches);document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;const picker=document.getElementById('themePreference');if(picker)picker.value=preference;}
function setPreference(value){preference=normalize(value);try{root.localStorage.setItem(key,preference);}catch{}apply();}
root.MahjongTheme={setPreference,getPreference:()=>preference,apply};
if(media.addEventListener)media.addEventListener('change',apply);else media.addListener(apply);
root.addEventListener('storage',e=>{if(e.key===key){preference=normalize(e.newValue);apply();}});
document.addEventListener('DOMContentLoaded',()=>{apply();document.getElementById('themePreference')?.addEventListener('change',e=>setPreference(e.target.value));});apply();
})(globalThis);

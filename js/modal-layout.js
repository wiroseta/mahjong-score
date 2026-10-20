/* All app dialogs share a full-width header; only their contents scroll. */
(function(){
'use strict';
const closeNames={players:'closePlayers',roundModal:'closeRound',editScore:'closeScoreEdit',new:'closeNew'};
for(const modal of document.querySelectorAll('.overlay > .modal')){
 if(modal.classList.contains('unified-modal'))continue;
 let header=Array.from(modal.children).find(n=>n.matches('.data-modal-head,.transfer-modal-head,.rules-head,.guide-head'));
 if(!header){const heading=Array.from(modal.children).find(n=>n.matches('h2,h3'));if(!heading)continue;header=document.createElement('div');modal.prepend(header);header.append(heading);const close=document.createElement('button');close.type='button';close.className='modal-x';close.textContent='×';close.setAttribute('aria-label','Tutup '+heading.textContent);close.onclick=()=>{const fn=window[closeNames[modal.parentElement.id]];if(typeof fn==='function')fn();else modal.parentElement.classList.remove('show');};header.append(close);}
 const remaining=Array.from(modal.children).filter(n=>n!==header);const existing=remaining.length===1&&remaining[0].matches('.settings-scroll-body,.rules-body');const body=existing?remaining[0]:document.createElement('div');body.classList.add('modal-scroll-body');if(!existing){for(const child of Array.from(modal.childNodes))if(child!==header)body.append(child);modal.append(body);}header.classList.add('unified-modal-head');modal.classList.add('unified-modal');
}
})();

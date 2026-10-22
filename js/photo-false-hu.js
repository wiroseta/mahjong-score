/* Verified false-win penalties use the same durable score/history as manual fines. */
(function(){'use strict';
function record(data,offender){
 const proof=window.MahjongPhotoHandAssessment?.falseHuEvidence(data,{seat:s.seatWinds[offender],isWinner:winner===offender,method});
 if(!Number.isInteger(offender)||offender<0||offender>3||!proof)return {status:'not-proven'};
 if(!canKeepScore())return {status:'readonly'};
 const hand=s.history.filter(h=>['hu','zimo'].includes(h.method)).length;
 const key=[s.round,s.dealer,hand,offender].join(':');
 if(s.history.some(h=>h.photoPenalty?.key===key)||(s.falseHuCorrectionAudit||[]).some(h=>h.photoPenalty?.key===key))return {status:'already-recorded'};
 // A manually recorded fine for this declaration must not be charged again.
 const boundary=s.history.findIndex(h=>['hu','zimo'].includes(h.method));
 if(s.history.slice(0,boundary<0?s.history.length:boundary).some(h=>h.method==='false_hu'&&h.winner===offender&&h.round===s.round))return {status:'already-recorded'};
 if(!mahjongStorageReady())return {status:'save-failed'};
 const before=s.scores.slice(),delta=[0,1,2,3].map(i=>i===offender?-3:1),scores=before.map((v,i)=>v+delta[i]);
 if(before.length!==4||!before.every(Number.isSafeInteger)||!scores.every(Number.isSafeInteger))return {status:'save-failed'};
 const previous=JSON.stringify(s);
 s.scores=scores;
 s.history.unshift({method:'false_hu',winner:offender,discarder:null,delta,before,dealer:s.dealer,round:s.round,roundWind:s.roundWind,seatWindsBefore:[...s.seatWinds],namesAtTime:[...s.names],patterns:[],quads:[0,0,0,0],photoPenalty:{...proof,key},time:new Date().toLocaleString('id-ID')});
 try{if(!save())throw Error('save refused');}catch(error){s=JSON.parse(previous);return {status:'save-failed'};}
 // A failed declaration must not remain selected for normal win payment.
 winner=null;method=null;discarder=null;
 document.getElementById('huBtn')?.classList.remove('on');document.getElementById('ziBtn')?.classList.remove('on');
 const discardArea=document.getElementById('discardArea');if(discardArea)discardArea.style.display='none';
 render();showScoreToast();
 return {status:'recorded'};
}
window.MahjongPhotoFalseHu={record};
})();

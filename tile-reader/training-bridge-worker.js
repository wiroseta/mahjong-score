/* Runs exclusively on the administrator device. No network or publication. */
importScripts('./learning-policy.js?v=15.9.1-r4','./training-bridge-core.js?v=15.9.1-r1');
let running=false;
self.onmessage=async event=>{if(running||event.data?.type!=='train')return;running=true;try{const model=await MahjongTrainingBridgeCore.train(event.data.samples,{epochs:event.data.epochs??100,onProgress:progress=>self.postMessage({type:'progress',progress})});self.postMessage({type:'complete',model});}catch(error){self.postMessage({type:'error',message:error.message});}finally{running=false;}};

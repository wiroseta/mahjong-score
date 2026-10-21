const CACHE="mahjong-score-v15-9-1-r12-score-instructions";
const ASSETS=["./js/modal-layout.js?v=15.9.1-r6b","./js/camera-access.js?v=15.9.1-r6","./js/theme.js?v=15.9.1","./js/theme.css?v=15.9.1-r12","./","./index.html","./js/auth-config.js","./js/sync-device-id.js","./js/sync-app-bridge.js","./js/sync-supabase-adapter.js","./js/sync-engine.js","./js/qrcode-local.js","./js/ai-diagnostic.js","./js/photo-rules.js?v=r19","./js/photo-score.js?v=r29","./js/photo-local-rules.js?v=r9","./js/photo-local-score.js?v=15.9.1-r6","./js/voice-parser.js","./js/vendor/jsQR-1.4.0.js","./js/vendor/pako-2.1.0.min.js","./js/auth-ui.js?v=15.9.1-r8","./js/game-transfer.js?v=15.9.1-r5","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
ASSETS.push(...["./tile-reader/trained-classifier.js?v=15.9.1-r2","./tile-reader/training-bridge-core.js?v=15.9.1-r1","./tile-reader/training-bridge-worker.js?v=15.9.1-r1","./tile-reader/training-bridge.js?v=15.9.1-r1","./tile-reader/tile-options.js?v=15.9.1-r4", "./tile-reader/", "./tile-reader/index.html", "./tile-reader/?embedded=1&v=15.9.1", "./tile-reader/detector.js?v=r6b", "./tile-reader/reference-learning.js?v=r14", "./tile-reader/reference-cloud.js?v=r6b", "./tile-reader/manual-box.js?v=r19", "./tile-reader/reading-consistency.js?v=r10", "./tile-reader/reader.js?v=15.9.1-r8", "./tile-reader/training-queue.js?v=15.9.1", "./tile-reader/learning-policy.js?v=15.9.1-r5", "./tile-reader/training-admin.js?v=15.9.1-r5", "./tile-reader/vendor/ort.wasm.min.js"]);
ASSETS.push('./tile-reader/candidate.html?v=1','./tile-reader/candidate-core.js?v=1','./tile-reader/candidate.js?v=2','./tile-reader/models/face-cnn-candidate.json');
ASSETS.push('./tile-reader/image-preprocess.js?v=2','./tile-reader/primary-reader.js?v=4','./tile-reader/models/tile-box-v3.json','./tile-reader/models/face-residual48.json');
const OPTIONAL_READER=["./tile-reader/models/face-residual48.onnx","./tile-reader/models/tile-box-v3.onnx","./tile-reader/models/face-cnn-candidate.onnx","./tile-reader/model.onnx","./tile-reader/vendor/ort-wasm-simd-threaded.mjs","./tile-reader/vendor/ort-wasm-simd-threaded.wasm"];
const ASSET_URLS=new Set([...ASSETS,...OPTIONAL_READER].map(path=>new URL(path,self.location.href).href));
const ASSET_PATHS=new Set([...ASSETS,...OPTIONAL_READER].map(path=>new URL(path,self.location.href).pathname));
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>Promise.all([c.addAll(ASSETS),c.addAll(OPTIONAL_READER).catch(()=>{})])).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mahjong-score-v')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener("fetch",e=>{
 const url=new URL(e.request.url);
 // Only public application assets belong in the offline cache. Auth and game
 // requests must always use their normal network/authentication behavior.
 if(e.request.method!=="GET"||url.origin!==self.location.origin||(url.search&&!ASSET_URLS.has(url.href))||!ASSET_PATHS.has(url.pathname))return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{}));}
  return r;
 }).catch(async error=>{const cached=await caches.match(e.request);if(cached)return cached;throw error}));
});

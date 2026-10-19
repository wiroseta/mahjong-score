const CACHE="mahjong-score-v15-9-r4";
const ASSETS=["./js/camera-access.js?v=15.9-r3","./js/theme.js?v=15.9","./js/theme.css?v=15.9","./","./index.html","./js/auth-config.js","./js/sync-device-id.js","./js/sync-app-bridge.js","./js/sync-supabase-adapter.js","./js/sync-engine.js","./js/qrcode-local.js","./js/ai-diagnostic.js","./js/photo-rules.js?v=r18","./js/photo-score.js?v=r25","./js/photo-local-rules.js?v=r18","./js/photo-local-score.js?v=15.9-r3","./js/voice-parser.js","./js/vendor/jsQR-1.4.0.js","./js/vendor/pako-2.1.0.min.js","./js/auth-ui.js?v=r25","./js/game-transfer.js?v=15.9-r4","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
const ASSET_URLS=new Set(ASSETS.map(path=>new URL(path,self.location.href).href));
const ASSET_PATHS=new Set(ASSETS.map(path=>new URL(path,self.location.href).pathname));
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
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

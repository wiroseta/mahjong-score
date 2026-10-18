const CACHE="mahjong-score-v15-8-1-r3";
const ASSETS=["./","./index.html","./js/auth-config.js","./js/sync-device-id.js","./js/sync-app-bridge.js","./js/sync-supabase-adapter.js","./js/sync-engine.js","./js/qrcode-local.js","./js/ai-diagnostic.js","./js/voice-parser.js","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
const ASSET_PATHS=new Set(ASSETS.map(path=>new URL(path,self.location.href).pathname));
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('mahjong-score-v')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener("fetch",e=>{
 const url=new URL(e.request.url);
 // Only public application assets belong in the offline cache. Auth and game
 // requests must always use their normal network/authentication behavior.
 if(e.request.method!=="GET"||url.origin!==self.location.origin||url.search||!ASSET_PATHS.has(url.pathname))return;
 e.respondWith(fetch(e.request).then(r=>{
  if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{}));}
  return r;
 }).catch(async error=>{const cached=await caches.match(e.request);if(cached)return cached;throw error}));
});

const CACHE='algo-buster-v1';
const ASSETS=['./','./index.html','./style.css','./app.js','./discovery.js','./feed.json','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('algo-buster-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url),local=u.origin===self.location.origin,thumb=u.hostname==='i.ytimg.com';if(!local&&!thumb)return;
 if(thumb){e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const copy=r.clone();caches.open(CACHE).then(async c=>{await c.put(e.request,copy);const keys=await c.keys();const images=keys.filter(k=>new URL(k.url).hostname==='i.ytimg.com');await Promise.all(images.slice(0,Math.max(0,images.length-80)).map(k=>c.delete(k)));});}return r;})));return;}
 e.respondWith(fetch(e.request).then(r=>{if(!r.ok)throw Error('Network response unavailable');const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;}).catch(()=>caches.match(e.request).then(hit=>hit||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))));
});

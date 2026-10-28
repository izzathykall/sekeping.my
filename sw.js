// Network-first avoids a stale config.js when Firebase is connected after a demo.
const CACHE='sekeping-shell-v5-flat';
const FILES=['./','./index.html','./admin.html','./styles.css','./config.js','./app.js','./util.js','./demo-service.js','./firebase-service.js','./qr.js','./jszip.min.js','./logo.svg','./og-cover.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 event.respondWith(fetch(event.request).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
   return response;
 }).catch(async()=>{
   const cached=await caches.match(event.request);
   if(cached)return cached;
   if(event.request.mode==='navigate')return caches.match('./index.html');
   return Response.error();
 }));
});

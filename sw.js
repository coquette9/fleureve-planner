const scope=self.registration.scope;
const prefix='fleureve:'+scope+':';
const version=prefix+'v9d-release-verification';
const assets=['./','index.html','style.css','app.js','wilayah.js','reflections.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-180.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(version).then(cache=>cache.addAll(assets.map(asset=>new Request(new URL(asset,scope),{cache:'reload'})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(prefix)&&key!==version).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||!request.url.startsWith(scope))return;
 event.respondWith(caches.open(version).then(async cache=>{
  const cached=await cache.match(request);
  if(cached)return cached;
  try{return await fetch(request)}catch(error){
   const url=new URL(request.url);
   if(request.mode==='navigate'&&[scope,new URL('index.html',scope).href].includes(url.origin+url.pathname)){
    const fallback=await cache.match(new URL('index.html',scope).href);
    if(fallback)return fallback;
   }
   throw error;
  }
 }));
});

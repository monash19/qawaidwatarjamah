// Ubah versi ketika merilis asset/konten baru. Scope aman untuk /nama-repo/.
const PREFIX='qawaid-'+new URL(self.registration.scope).pathname;
const CACHE=PREFIX+'v1.0.0';
const ASSETS=['./','./index.html','./styles.css','./app.js','./engine.js','./data.js','./manifest.webmanifest','./icons/icon.svg','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  const scope=new URL(self.registration.scope);
  if(event.request.method!=='GET'||url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname)||url.pathname.includes('/api/'))return;
  // Cache-first menjaga satu versi aplikasi konsisten; versi baru aktif setelah semua tab ditutup.
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(event.request,{ignoreSearch:true});
    if(cached)return cached;
    try{return await fetch(event.request);}catch{
      if(event.request.mode==='navigate')return await cache.match(new URL('./index.html',scope).href);
      return Response.error();
    }
  }));
});

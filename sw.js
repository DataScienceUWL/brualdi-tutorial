const C="brualdi-tutorial-v14";
const A=["./","./index.html","./manifest.json","./walkthrough.html","./walkthrough-manifest.json","./icon-192.png","./icon-512.png","./icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const req=e.request;
  const isHTML = req.mode==="navigate" || (req.headers.get("accept")||"").includes("text/html");
  if(isHTML){
    // network-first: fresh page whenever online, cached copy when offline
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));return r;})
                             .catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
  }else{
    // cache-first for static assets, filling the cache on first fetch
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(r2=>{const cp=r2.clone();caches.open(C).then(c=>c.put(req,cp));return r2;})));
  }
});

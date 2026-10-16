const C='kassa-v4';
const LOCAL=['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './app.css', './core.js', './ui.js', './views.js', './forms.js', './smart.js', './city.js', './tour.js', './boot.js'];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js', 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Unbounded:wght@500;600;700&display=swap'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all([...LOCAL.map(u=>c.add(u).catch(()=>{})),...CDN.map(u=>fetch(u,{mode:'cors'}).then(r=>c.put(u,r)).catch(()=>{}))])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;const u=new URL(q.url);
  /* свои файлы: сначала сеть (чтобы обновления приходили сразу), без сети — из кэша */
  if(u.origin===location.origin){e.respondWith(fetch(q).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(q,c))}return r}).catch(()=>caches.match(q).then(r=>r||caches.match('./index.html'))));return}
  /* библиотеки и шрифты: из кэша, в фоне обновляем */
  e.respondWith(caches.match(q).then(r=>{const net=fetch(q).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(C).then(x=>x.put(q,c))}return res}).catch(()=>r);return r||net}))});

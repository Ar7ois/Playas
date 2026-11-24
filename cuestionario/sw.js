// Service worker: guarda la aplicación y sus bibliotecas para usarla sin internet.
const CACHE='cedula-playas-v8';
const BASE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
const IMG=["./img/item-001.jpg", "./img/item-002.jpg", "./img/item-003.jpg", "./img/item-006.jpg", "./img/item-010.jpg", "./img/item-012.jpg", "./img/item-013.jpg", "./img/item-016.jpg", "./img/item-018.jpg", "./img/item-020.jpg", "./img/item-024.jpg", "./img/item-025.jpg", "./img/item-026.jpg", "./img/item-029.jpg", "./img/item-031.jpg", "./img/item-035.jpg", "./img/item-038.jpg", "./img/item-050.jpg", "./img/item-065.jpg", "./img/item-067.jpg", "./img/item-068.jpg", "./img/item-071.jpg", "./img/item-072.jpg", "./img/item-073.jpg", "./img/item-076.jpg", "./img/item-079.jpg", "./img/item-093.jpg", "./img/item-094.jpg"];
const CDN=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js','https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll(BASE);await Promise.all(CDN.concat(IMG).map(u=>c.add(u).catch(()=>{})))}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.hostname.includes('script.google')||u.hostname.includes('googleusercontent'))return;
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));return}
  e.respondWith(caches.match(r).then(hit=>{const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}return res}).catch(()=>hit);return hit||net}));
});

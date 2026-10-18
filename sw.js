// Service Worker — Turnario VVF Napoli Sommozzatori
const CACHE = 'turnario-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Lascia passare le richieste Firebase (real-time database)
  if (
    e.request.url.includes('firebaseio') ||
    e.request.url.includes('firebaseapp') ||
    e.request.url.includes('googleapis') ||
    e.request.url.includes('firebase')
  ) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

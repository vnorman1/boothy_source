// Egyszerű PWA service worker: cache-elés, offline fallback
const CACHE_NAME = 'boothy-cache-v1';
const OFFLINE_URL = '/boothy/index.html'; // Az offline fallback oldal

const toCache = [
  '/boothy/',
  '/boothy/index.html',
  '/boothy/assets/index-CCPxNsiu.css.css', //csere a dist mappában lévőre
  '/boothy/favicon_boothy.png',
  '/boothy/manifest.webmanifest.json',
  '/boothy/og_boothy.png',
  '/boothy/robots.txt',
  '/boothy/shutter.mp3',
  '/boothy/sitemap.xml',
  '/boothy/assets/index-B_qPJmJ6.js'  // statikus assetek, még kell a js build után
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(toCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match(OFFLINE_URL));
    })
  );
});

// Egyszerű PWA service worker: cache-elés, offline fallback
const CACHE_NAME = 'boothy-cache-v1';
const OFFLINE_URL = '/index.html';

const toCache = [
  './',
  './index.html',
  './global.css', //csere a dist mappában lévőre
  './favicon_boothy.png',
  './manifest.webmanifest.json',
  './og_boothy.png',
  './robots.txt',
  './shutter.mp3',
  './sitemap.xml',
  './index.js'  // statikus assetek, még kell a js build után
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

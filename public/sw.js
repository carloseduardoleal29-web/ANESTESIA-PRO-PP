const CACHE_NAME = 'anestesiapro-v7';
const urlsToCache = [
  '/',
  '/manifest.json?v=7',
  '/icon-192.png?v=7',
  '/icon-512.png?v=7',
  '/apple-touch-icon.png?v=7',
  '/app_logo.jpg?v=7',
  '/og_banner.jpg?v=7',
  '/favicon.ico?v=7'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.warn('Cache addAll non-fatal error:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. NEVER intercept Cloud Run / AI Studio authentication or cookie checks
  if (url.pathname.startsWith('/__') || url.pathname.startsWith('/api') || url.pathname.startsWith('/_')) {
    return;
  }

  // 2. Navigation requests (HTML page): Network-first with safe cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/', copy)).catch(() => {});
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const rootCached = await caches.match('/');
          if (rootCached) return rootCached;
          return new Response(
            '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AnestesiaPro</title></head><body style="background:#0f172a;color:#f8fafc;font-family:system-ui,sans-serif;text-align:center;padding:40px 20px;"><div style="max-width:400px;margin:0 auto;"><h2 style="color:#38bdf8;">AnestesiaPro</h2><p style="color:#94a3b8;">Verificando conexión o actualizando aplicación...</p><button onclick="window.location.reload(true)" style="background:#06b6d4;color:#0f172a;border:none;padding:12px 24px;border-radius:12px;font-weight:bold;font-size:15px;cursor:pointer;margin-top:16px;">Reintentar y Recargar</button></div></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 3. Static assets & files: Network first, cache fallback, NEVER resolve to undefined
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        // Return 408 instead of undefined to prevent TypeError in browser
        return new Response('', { status: 408, statusText: 'Resource unavailable offline' });
      })
  );
});

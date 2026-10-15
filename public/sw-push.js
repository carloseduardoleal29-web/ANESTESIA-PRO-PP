// Professional Native Push & Auto-Updating PWA Service Worker for AnestesiaPro
const CACHE_NAME = 'anestesiapro-pwa-v2026.2.0-rescue';

self.addEventListener('install', (event) => {
  // Force immediate takeover by waiting service worker on all 200 PWA installs
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first with offline fallback fetch handler
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Do not intercept Firestore / Firebase API calls
  if (event.request.url.includes('firestore.googleapis.com') || event.request.url.includes('identitytoolkit')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});

// Push notification handling with absolute URLs
self.addEventListener('push', function (event) {
  const origin = self.location ? self.location.origin : '';
  const appLogoUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';
  const badgeUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';

  let payload = {
    title: 'AnestesiaPro 🩺',
    body: 'Nueva actualización y alerta clínica disponible.',
    icon: appLogoUrl,
    badge: badgeUrl,
    image: origin ? origin + '/og_banner.jpg' : '/og_banner.jpg',
    url: '/?source=push_notification',
    tag: 'anestesiapro-push-' + Date.now()
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch (e) {
      try {
        const textData = event.data.text();
        if (textData) payload.body = textData;
      } catch (err) {}
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || appLogoUrl,
    badge: payload.badge || badgeUrl,
    image: payload.image || origin + '/og_banner.jpg',
    requireInteraction: true,
    vibrate: [200, 100, 200, 100, 200],
    tag: payload.tag || 'anestesiapro-push-' + Date.now(),
    renotify: true,
    silent: false,
    timestamp: Date.now(),
    actions: [
      { action: 'open_app', title: '🩺 Abrir AnestesiaPro' },
      { action: 'dismiss', title: 'Cerrar' }
    ],
    data: {
      url: payload.url || '/?source=push_notification'
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const action = event.action;
  if (action === 'dismiss') {
    return;
  }
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

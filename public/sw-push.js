// Professional Native Push & Auto-Updating PWA Service Worker for AnestesiaPro
const CACHE_NAME = 'anestesiapro-pwa-v2026.3.0-live';

self.addEventListener('install', (event) => {
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
  if (event.request.method !== 'GET') return;
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

// Helper to guarantee full absolute HTTPS URLs for Firefox, Chrome, Safari, and Edge
function getAbsoluteUrl(urlPath) {
  const origin = self.location ? self.location.origin : '';
  if (!urlPath) return origin + '/icon-192.png';
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  if (urlPath.startsWith('/')) return origin + urlPath;
  return origin + '/' + urlPath;
}

// Push notification handling with absolute URLs
self.addEventListener('push', function (event) {
  const origin = self.location ? self.location.origin : '';
  const defaultLogo = getAbsoluteUrl('/icon-192.png');
  const defaultBanner = getAbsoluteUrl('/og_banner.jpg');

  let payload = {
    title: 'AnestesiaPro 🩺',
    body: 'Nueva actualización y alerta clínica disponible.',
    icon: defaultLogo,
    badge: defaultLogo,
    image: defaultBanner,
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

  // Guarantee title includes AnestesiaPro brand so Firefox/Chrome/Safari always state the app name clearly
  let rawTitle = payload.title || 'AnestesiaPro 🩺';
  let finalTitle = rawTitle;
  if (!rawTitle.toLowerCase().includes('anestesiapro')) {
    finalTitle = `AnestesiaPro 🩺 | ${rawTitle}`;
  }

  const options = {
    body: payload.body,
    icon: getAbsoluteUrl(payload.icon),
    badge: getAbsoluteUrl(payload.badge || payload.icon),
    image: getAbsoluteUrl(payload.image),
    requireInteraction: true,
    vibrate: [250, 100, 250, 100, 250],
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
    self.registration.showNotification(finalTitle, options)
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

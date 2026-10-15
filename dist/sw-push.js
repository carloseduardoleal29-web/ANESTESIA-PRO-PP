// Professional Native Push Service Worker for AnestesiaPro (Background & Closed App Delivery + PWA Installability Fetch Handler)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Required by Google Chrome for PWA Installability (Beforeinstallprompt validation)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

self.addEventListener('push', function (event) {
  const origin = self.location ? self.location.origin : '';
  const appLogoUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';
  const badgeUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';

  let payload = {
    title: 'AnestesiaPro 🩺',
    body: 'Nueva alerta clínica de alta prioridad disponible.',
    icon: appLogoUrl,
    badge: badgeUrl,
    image: origin ? origin + '/og_banner.jpg' : '/og_banner.jpg',
    url: '/?source=push_notification',
    tag: 'anestesiapro-native-push-' + Date.now()
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

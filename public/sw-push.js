// Background Service Worker Script for AnestesiaPro Web Push Notifications via Push API
self.addEventListener('push', function (event) {
  const origin = self.location ? self.location.origin : '';
  const appLogoUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';
  const badgeUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';

  let payload = {
    title: 'AnestesiaPro 🩺',
    body: 'Nueva actualización de protocolo o material clínico oficial disponible.',
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
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || appLogoUrl,
    badge: payload.badge || badgeUrl,
    image: payload.image,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: payload.tag,
    renotify: true,
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

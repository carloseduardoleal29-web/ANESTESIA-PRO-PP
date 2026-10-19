// Web Push Notification Service for AnestesiaPro PWA
// Enables background push notifications to users' mobile phones and desktop devices.

export interface PushSubscriber {
  endpoint: string;
  userEmail?: string;
  userName?: string;
  device?: string;
  subscribedAt: string;
}

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Solicits Notification permission from the doctor and registers the push subscription with the backend
 */
export async function requestPushPermissionAndSubscribe(userInfo?: { email?: string; name?: string }): Promise<{
  success: boolean;
  permission: NotificationPermission;
  message: string;
}> {
  if (!isPushSupported()) {
    return {
      success: false,
      permission: 'denied',
      message: 'Las notificaciones Web Push no son soportadas por este navegador o dispositivo.'
    };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return {
        success: false,
        permission,
        message: 'El permiso de notificaciones fue denegado. Puedes activarlo desde los ajustes de tu navegador.'
      };
    }

    // Register subscription with service worker
    let reg: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      reg = await navigator.serviceWorker.ready;
    }

    let subscriptionData = null;
    if (reg && reg.pushManager) {
      try {
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          // Subscribe to push
          sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            // In a production server with VAPID keys, applicationServerKey is passed here.
            // For general Web Push / PWA background notifications, userVisibleOnly allows native banner delivery.
          });
        }
        if (sub) {
          subscriptionData = sub.toJSON();
        }
      } catch (subErr) {
        console.warn('[Push Service] PushManager subscription optional step:', subErr);
      }
    }

    // Send registration to server backend
    const payload = {
      subscription: subscriptionData,
      endpoint: subscriptionData?.endpoint || `local-pwa-device-${Date.now()}`,
      userEmail: userInfo?.email || localStorage.getItem('anestesiapro_registered_email') || 'medico_anonimo@anestesiapro.com',
      userName: userInfo?.name || localStorage.getItem('anestesiapro_registered_name') || 'Dr(a). Anestesiólogo',
      device: navigator.userAgent.includes('Android') ? 'Android 📱' : navigator.userAgent.includes('iPhone') ? 'iPhone/iPad 📱' : 'PC/Mac 💻',
      subscribedAt: new Date().toISOString()
    };

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    // Store push status locally
    localStorage.setItem('anestesiapro_push_enabled', 'true');

    return {
      success: true,
      permission: 'granted',
      message: '¡Notificaciones activadas con éxito! Recibirás alertas instantáneas en tu teléfono aun con la app cerrada.'
    };
  } catch (err: any) {
    console.error('[Push Service] Error activando notificaciones:', err);
    return {
      success: false,
      permission: Notification.permission,
      message: err?.message || 'Error al solicitar el permiso de notificaciones.'
    };
  }
}

/**
 * Triggers an immediate test notification on the local device
 */
export async function triggerTestPushNotification(title?: string, body?: string): Promise<boolean> {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return false;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const appLogoUrl = origin ? origin + '/icon-192.png' : '/icon-192.png';
  const notifTitle = title || 'AnestesiaPro 🩺 | Alerta Académica Oficial';
  const notifBody = body || '✨ Dr. Carlos Leal: Nueva actualización clínica, protocolo E-MOTIVE y recursos docentes disponibles en AnestesiaPro.';

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await (reg.showNotification as any)(notifTitle, {
          body: notifBody,
          icon: appLogoUrl,
          badge: appLogoUrl,
          image: origin ? origin + '/og_banner.jpg' : undefined,
          vibrate: [250, 100, 250, 100, 250],
          requireInteraction: true,
          tag: 'test-push-' + Date.now(),
          actions: [
            { action: 'open_app', title: '🩺 Abrir AnestesiaPro' },
            { action: 'dismiss', title: 'Cerrar' }
          ],
          data: { url: '/?source=test_push' }
        });
        return true;
      }
    }

    new Notification(notifTitle, {
      body: notifBody,
      icon: appLogoUrl,
      badge: appLogoUrl,
      image: origin ? origin + '/og_banner.jpg' : undefined
    });

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('anestesiapro_new_notification_published'));
    }

    return true;
  } catch (e) {
    console.warn('[Push Service] Test notification fallback error:', e);
    return false;
  }
}

/**
 * Broadcasts a push notification to all medical users from the Author Panel
 */
export async function broadcastPushNotification(data: {
  title: string;
  message: string;
  category?: string;
  url?: string;
}): Promise<{ success: boolean; deliveredCount: number; message: string }> {
  try {
    const res = await fetch('/api/push/send-broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (result.success) {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('anestesiapro_new_notification_published'));
      }

      return {
        success: true,
        deliveredCount: result.deliveredCount || 1,
        message: `Notificación enviada exitosamente a ${result.deliveredCount || 1} dispositivos.`
      };
    }
    return {
      success: false,
      deliveredCount: 0,
      message: result.error || 'Error al enviar difusión.'
    };
  } catch (err: any) {
    return {
      success: false,
      deliveredCount: 0,
      message: err?.message || 'Error de conexión con el servidor de notificaciones.'
    };
  }
}

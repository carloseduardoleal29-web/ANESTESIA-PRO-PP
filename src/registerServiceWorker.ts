// Service Worker Registration and Update Controller for AnestesiaPro PWA
import { registerSW as pwaRegister } from 'virtual:pwa-register';

export function registerSW() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Desactivar el Service Worker ÚNICAMENTE dentro del iframe de edición del agente
  // para evitar problemas de recarga durante el desarrollo en AI Studio.
  const isInIframe = window.self !== window.top;
  if (isInIframe) {
    console.log('[AnestesiaPro SW] Dentro de iframe de edición de AI Studio; registro de caché en segundo plano pausado.');
    return;
  }

  try {
    let refreshing = false;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          console.log('[AnestesiaPro SW] Nuevo Service Worker activado. Recargando para actualizar recursos...');
          window.location.reload();
        }
      });
    }

    const updateSW = pwaRegister({
      immediate: true,
      onNeedRefresh() {
        console.log('[AnestesiaPro SW] Nueva versión disponible en el servidor. Activando actualización automática...');
        window.dispatchEvent(new CustomEvent('anestesiapro-update-available'));
        try {
          updateSW(true);
        } catch (e) {}
      },
      onOfflineReady() {
        console.log('[AnestesiaPro SW] Aplicación 100% disponible offline (Quirófano / Sin internet).');
        window.dispatchEvent(new CustomEvent('anestesiapro-offline-ready'));
      },
      onRegisteredSW(swUrl, registration) {
        console.log('[AnestesiaPro SW] Service Worker registrado exitosamente:', swUrl);
        if (registration) {
          // Chequear actualizaciones periódicamente cuando haya conexión
          setInterval(() => {
            if (navigator.onLine) {
              registration.update().catch(() => {});
            }
          }, 30 * 60 * 1000); // cada 30 minutos
        }
      },
      onRegisterError(error) {
        console.warn('[AnestesiaPro SW] Error al registrar Service Worker:', error);
      }
    });

    return updateSW;
  } catch (err) {
    console.warn('[AnestesiaPro SW] Error inicializando registro virtual:', err);
  }
}

/**
 * Forzar actualización limpia de caché si el usuario desea refrescar todo
 */
export async function forceAppUpdate(): Promise<void> {
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
    }
  } catch (err) {
    console.warn('Error clearing caches:', err);
  } finally {
    window.location.href = window.location.origin + window.location.pathname + '?refresh=' + Date.now();
  }
}

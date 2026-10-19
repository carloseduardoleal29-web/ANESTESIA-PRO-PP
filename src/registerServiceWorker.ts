// Service Worker Registration and Update Controller for AnestesiaPro PWA

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
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('[AnestesiaPro SW] Nuevo Service Worker activado. Recargando para actualizar recursos...');
        window.location.reload();
      }
    });

    const registerNativeSW = () => {
      navigator.serviceWorker.register('/sw-push.js', { scope: '/' })
        .then((registration) => {
          console.log('[AnestesiaPro SW] Service Worker registrado exitosamente:', registration.scope);

          if (navigator.onLine) {
            registration.update().catch(() => {});
          }

          setInterval(() => {
            if (navigator.onLine) {
              registration.update().catch(() => {});
            }
          }, 5 * 60 * 1000);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    console.log('[AnestesiaPro SW] Nueva versión disponible.');
                    window.dispatchEvent(new CustomEvent('anestesiapro-update-available'));
                  } else {
                    console.log('[AnestesiaPro SW] Aplicación lista para uso offline.');
                    window.dispatchEvent(new CustomEvent('anestesiapro-offline-ready'));
                  }
                }
              };
            }
          };
        })
        .catch((error) => {
          console.warn('[AnestesiaPro SW] Error al registrar Service Worker:', error);
        });
    };

    if (document.readyState === 'complete') {
      registerNativeSW();
    } else {
      window.addEventListener('load', registerNativeSW);
    }

    return (reloadPage?: boolean) => {
      if (reloadPage) {
        window.location.reload();
      }
    };
  } catch (err) {
    console.warn('[AnestesiaPro SW] Error inicializando registro de Service Worker:', err);
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

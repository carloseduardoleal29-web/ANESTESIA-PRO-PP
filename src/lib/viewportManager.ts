/**
 * VIEWPORT & AUTO-FRAMING ENGINE FOR ANESTESIAPRO
 * Ensures 100% pixel-perfect responsive framing across all mobile devices (iOS/Android),
 * eliminating the need to activate 'Sitio de escritorio' (Desktop site) in mobile browsers.
 */

export interface ViewportStatus {
  isDesktopSiteActiveOnMobile: boolean;
  isMobileDevice: boolean;
  viewportWidth: number;
  screenWidth: number;
}

const LOCKED_VIEWPORT_CONTENT =
  'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no, interactive-widget=resizes-content';

/**
 * Enforces the strict responsive viewport settings on the DOM
 */
export function lockViewportFraming(): void {
  if (typeof document === 'undefined') return;

  try {
    let meta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    if (meta.content !== LOCKED_VIEWPORT_CONTENT) {
      meta.content = LOCKED_VIEWPORT_CONTENT;
    }

    if (document.documentElement) {
      document.documentElement.style.width = '100%';
      document.documentElement.style.maxWidth = '100%';
      document.documentElement.style.overflowX = 'hidden';
    }

    if (document.body) {
      document.body.style.width = '100%';
      document.body.style.maxWidth = '100%';
      document.body.style.overflowX = 'hidden';
    }

    // Reset any unintentional horizontal scroll drift
    if (window.scrollX !== 0) {
      window.scrollTo({ left: 0, top: window.scrollY, behavior: 'instant' as any });
    }
  } catch (err) {
    console.warn('Viewport framing enforcement:', err);
  }
}

/**
 * Detects if a mobile device has 'Sitio de escritorio' (Desktop Mode) active in Chrome or Safari.
 * On a phone, physical screen width is typically < 600px, but desktop mode forces innerWidth >= 768px (often 980px).
 */
export function checkDesktopModeOnMobile(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    const physicalWidth = Math.min(window.screen.width, window.screen.height);
    const viewportWidth = window.innerWidth;

    // If it's a touch phone (screen width < 550) but viewport is artificially simulated as desktop (>= 768)
    if (isTouch && physicalWidth > 0 && physicalWidth < 550 && viewportWidth >= 768) {
      return true;
    }

    // Secondary check: userAgent has Android or iPhone or Mobile, but innerWidth >= 980
    const ua = navigator.userAgent || '';
    const isMobileUA = /Android|iPhone|iPod|Mobile/i.test(ua);
    if (isMobileUA && viewportWidth >= 980) {
      return true;
    }
  } catch {}
  return false;
}

/**
 * Checks if the user is on any mobile/touch device
 */
export function isMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const ua = navigator.userAgent || '';
    const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    return /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (isTouch && window.innerWidth <= 1024);
  } catch {
    return false;
  }
}

/**
 * Triggers a manual full re-framing of the current device screen
 */
export function reframeCurrentDevice(): void {
  lockViewportFraming();
  window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

  // Dispatch custom event for UI toast
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('anestesiapro-screen-reframed', {
      detail: { timestamp: Date.now() }
    }));
  }
}

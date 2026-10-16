export interface AppStats {
  visits: number;
  uniqueDevices?: number;
  appInstalls?: number;
  totalDownloads: number;
  itemDownloads: Record<string, number>;
  itemViews?: Record<string, number>;
  devices?: Record<string, number>;
  locations?: Record<string, number>;
  downloadLocations?: Record<string, number>;
}

import { saveCloudStats, getCloudStats } from './cloudEducationService';

export function detectDevice(): string {
  if (typeof window === 'undefined') return "Smartphone (Móvil) 📱";
  const ua = navigator.userAgent || '';
  const isTouchMac = /Macintosh/i.test(ua) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;

  if (/iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || isTouchMac) {
    return "Tablet / iPad 📲";
  }
  if (/iPhone/i.test(ua)) {
    return "iPhone (Apple) 📱";
  }
  if (/Android/i.test(ua) && /Mobile/i.test(ua)) {
    return "Smartphone Android 📱";
  }
  if (/Mobile|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return "Smartphone (Móvil) 📱";
  }
  if (/Macintosh|Mac OS X/i.test(ua)) {
    return "Computadora Mac 🖥️";
  }
  if (/Windows/i.test(ua)) {
    return "Computadora PC (Windows) 💻";
  }
  return "Computadora / PC 💻";
}

export function detectLocation(): string {
  if (typeof window === 'undefined') return "🇻🇪 Venezuela";
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {}
  const lang = (navigator.language || '').toLowerCase();

  if (tz.includes("Caracas") || lang.includes("es-ve")) return "🇻🇪 Venezuela";
  if (tz.includes("Bogota") || lang.includes("es-co")) return "🇨🇴 Colombia";
  if (tz.includes("Mexico") || tz.includes("Cancun") || lang.includes("es-mx")) return "🇲🇽 México";
  if (tz.includes("Madrid") || lang.includes("es-es")) return "🇪🇸 España";
  if (tz.includes("Buenos_Aires") || tz.includes("Cordoba") || lang.includes("es-ar")) return "🇦🇷 Argentina";
  if (tz.includes("Santiago") || lang.includes("es-cl")) return "🇨🇱 Chile";
  if (tz.includes("Lima") || lang.includes("es-pe")) return "🇵🇪 Perú";
  if (tz.includes("New_York") || tz.includes("Los_Angeles") || lang.includes("en-us")) return "🇺🇸 Estados Unidos";

  if (lang.startsWith("es")) return "🇻🇪 Venezuela / Latinoamérica";
  return "🌎 Internacional";
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  badge?: string;
  resourceId?: string;
  author?: string;
}

export interface UserFeedback {
  id: string;
  name?: string;
  email?: string;
  location?: string;
  message: string;
  date: string;
}

// Canonical public URL for AnestesiaPro
export const CANONICAL_APP_URL = 'https://tinyurl.com/AnestesiaProApp';

// Official short public URL for AnestesiaPro (easy to share on Instagram, WhatsApp and social media)
export const SHORT_APP_URL = 'https://tinyurl.com/AnestesiaProApp';

export function getShortAppUrl(paramStr?: string): string {
  if (!paramStr) return SHORT_APP_URL;
  const cleanParam = paramStr.startsWith('?') ? paramStr : `?${paramStr}`;
  return `${SHORT_APP_URL}${cleanParam}`;
}

export function getCanonicalAppOrigin(): string {
  if (typeof window !== 'undefined') {
    const origin = window.location.origin || '';
    if (
      !origin ||
      origin.startsWith('file:') ||
      origin.startsWith('content:') ||
      origin.startsWith('capacitor:') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('anestesiapro.app')
    ) {
      return CANONICAL_APP_URL;
    }
    return origin;
  }
  return CANONICAL_APP_URL;
}

// Helper to resolve URLs (works in production server as well as APKs, WebViews, local files)
export function resolveAppUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (typeof window !== 'undefined') {
    const origin = window.location.origin || '';
    // If running in any web browser environment (localhost, preview, run.app, custom domain)
    if (origin.startsWith('http://') || origin.startsWith('https://')) {
      return url;
    }
    // Only for non-HTTP environments (e.g. capacitor://, file://)
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${CANONICAL_APP_URL}${cleanPath}`;
  }
  return url;
}

// Helper to read local stats
function getLocalCache(): AppStats {
  const rawV = localStorage.getItem('anestesiapro_visit_count');
  const v = rawV !== null ? (parseInt(rawV, 10) || 0) : 0;

  const rawInst = localStorage.getItem('anestesiapro_app_installs');
  const inst = rawInst !== null ? (parseInt(rawInst, 10) || 0) : 0;

  let itemD: Record<string, number> = {};

  let itemV: Record<string, number> = {};

  try {
    const raw = localStorage.getItem('anestesiapro_resource_downloads');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(k => {
          itemD[k] = Number(parsed[k]) || 0;
        });
      }
    }
  } catch (err) {
    console.error(err);
  }

  try {
    const rawV = localStorage.getItem('anestesiapro_resource_views');
    if (rawV) {
      const parsed = JSON.parse(rawV);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(k => {
          itemV[k] = Math.max(itemV[k] || 0, Number(parsed[k]) || 0);
        });
      }
    }
  } catch (err) {}

  const itemSum = Object.values(itemD).reduce((a, b) => a + b, 0);
  const rawD = localStorage.getItem('anestesiapro_total_downloads');
  const d = rawD !== null ? (parseInt(rawD, 10) || 0) : itemSum;

  const devices: Record<string, number> = {};
  const locations: Record<string, number> = {};
  const downloadLocations: Record<string, number> = {};

  return { 
    visits: v || 0, 
    appInstalls: inst || 0, 
    uniqueDevices: Object.values(devices).reduce((a, b) => a + b, 0) || 0, 
    totalDownloads: d || 0, 
    itemDownloads: itemD, 
    itemViews: itemV, 
    devices, 
    locations, 
    downloadLocations 
  };
}

function saveLocalCache(stats: AppStats): AppStats {
  try {
    localStorage.setItem('anestesiapro_visit_count', stats.visits.toString());
    if (stats.appInstalls !== undefined) {
      localStorage.setItem('anestesiapro_app_installs', stats.appInstalls.toString());
    }
    localStorage.setItem('anestesiapro_total_downloads', stats.totalDownloads.toString());
    localStorage.setItem('anestesiapro_resource_downloads', JSON.stringify(stats.itemDownloads || {}));
    if (stats.itemViews) {
      localStorage.setItem('anestesiapro_resource_views', JSON.stringify(stats.itemViews));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_stats_updated', { detail: stats }));
    }
    // Also asynchronously mirror to Cloud Firestore
    saveCloudStats(stats).catch(() => {});
  } catch (e) {
    console.error(e);
  }
  return stats;
}

function mergeMonotonic(serverStats: any, localStats: AppStats): AppStats {
  if (!serverStats) return localStats;
  const mergedItemD: Record<string, number> = { ...(localStats.itemDownloads || {}) };
  if (serverStats?.itemDownloads && typeof serverStats.itemDownloads === 'object') {
    Object.keys(serverStats.itemDownloads).forEach(k => {
      if (k === 'res-cebranopadol-fase3-2026' && Number(serverStats.itemDownloads[k]) === 0) {
        mergedItemD[k] = 0;
      } else {
        mergedItemD[k] = Math.max(Number(serverStats.itemDownloads[k]) || 0, mergedItemD[k] || 0);
      }
    });
  }

  const mergedItemV: Record<string, number> = { ...(localStats.itemViews || {}) };
  if (serverStats?.itemViews && typeof serverStats.itemViews === 'object') {
    Object.keys(serverStats.itemViews).forEach(k => {
      mergedItemV[k] = Math.max(Number(serverStats.itemViews[k]) || 0, mergedItemV[k] || 0);
    });
  }

  const itemSum = Object.values(mergedItemD).reduce((a, b) => a + b, 0);
  const v = serverStats.visits !== undefined ? Math.max(Number(serverStats.visits), localStats.visits) : localStats.visits;
  const inst = serverStats.appInstalls !== undefined ? Math.max(Number(serverStats.appInstalls), localStats.appInstalls || 0) : localStats.appInstalls;
  const d = serverStats.totalDownloads !== undefined ? Math.max(Number(serverStats.totalDownloads), localStats.totalDownloads || 0, itemSum) : Math.max(localStats.totalDownloads || 0, itemSum);

  const devices = {
    ...(localStats.devices || {}),
    ...(serverStats?.devices || {})
  };
  const devSum = (Object.values(devices) as number[]).reduce((acc: number, num: number) => acc + (Number(num) || 0), 0);
  const uDev = serverStats.uniqueDevices !== undefined ? Math.max(Number(serverStats.uniqueDevices), localStats.uniqueDevices || 0, devSum) : Math.max(localStats.uniqueDevices || 0, devSum);

  const locations = {
    ...(localStats.locations || {}),
    ...(serverStats?.locations || {})
  };

  const downloadLocations = {
    ...(localStats.downloadLocations || {}),
    ...(serverStats?.downloadLocations || {})
  };

  return { visits: v, uniqueDevices: uDev, appInstalls: inst, totalDownloads: d, itemDownloads: mergedItemD, itemViews: mergedItemV, devices, locations, downloadLocations };
}

// Determine if current session belongs to Dr. Carlos Leal (Super Admin)
// When true, NO visits, downloads, resource views, or tests are counted in the public metrics
export function isAdministratorUser(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 0. Global runtime flag
    if ((window as any).__ANESTESIAPRO_IS_ADMIN__ === true) return true;

    // 1. Direct admin / PIN authorization flags in localStorage or sessionStorage
    if (
      localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
      localStorage.getItem('anestesiapro_author_admin') === 'true' ||
      localStorage.getItem('anestesiapro_pin_authorized') === 'true' ||
      localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
      localStorage.getItem('anestesiapro_admin_pin_verified') === 'true' ||
      sessionStorage.getItem('anestesiapro_author_session') === 'true' ||
      sessionStorage.getItem('anestesiapro_pin_authorized') === 'true'
    ) {
      return true;
    }

    // 2. Secret URL Query params (Dr. Carlos Leal direct entry with secret PIN only)
    const search = (window.location.search || '').toLowerCase();
    if (
      search.includes('carlos=2534') ||
      search.includes('carlos=2026') ||
      search.includes('panel=2534') ||
      search.includes('admin=2534') ||
      search.includes('pin=2534') ||
      search.includes('carlos=calc')
    ) {
      try {
        localStorage.setItem('anestesiapro_is_author_admin', 'true');
        localStorage.setItem('anestesiapro_author_admin', 'true');
        localStorage.setItem('anestesiapro_pin_authorized', 'true');
        localStorage.setItem('anestesiapro_admin_mode', 'true');
        sessionStorage.setItem('anestesiapro_author_session', 'true');
        (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
      } catch {}
      return true;
    }

    // 3. Registered Profile Email / Name / Role Match
    const rawUser = localStorage.getItem('anestesiapro_registered_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      const email = (u?.email || '').toLowerCase().trim();
      const name = (u?.fullName || '').toLowerCase().trim();
      const role = (u?.role || '').toLowerCase().trim();
      if (
        email === 'carloseduardoleal29@gmail.com' ||
        role === 'admin' ||
        role === 'superadmin' ||
        (name.includes('carlos') && name.includes('leal'))
      ) {
        try {
          localStorage.setItem('anestesiapro_is_author_admin', 'true');
          localStorage.setItem('anestesiapro_author_admin', 'true');
          localStorage.setItem('anestesiapro_pin_authorized', 'true');
          localStorage.setItem('anestesiapro_admin_mode', 'true');
          sessionStorage.setItem('anestesiapro_author_session', 'true');
          (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
        } catch {}
        return true;
      }
    }

    // 4. Preanesthesia doctor signature default or profile match
    const preDoc = localStorage.getItem('preanesthesia_doctor_profile');
    if (preDoc) {
      const p = JSON.parse(preDoc);
      const docEmail = (p?.email || p?.doctorEmail || '').toLowerCase().trim();
      const docName = (p?.doctorName || '').toLowerCase().trim();
      if (docEmail === 'carloseduardoleal29@gmail.com' || (docName.includes('carlos') && docName.includes('leal'))) {
        try {
          localStorage.setItem('anestesiapro_is_author_admin', 'true');
          localStorage.setItem('anestesiapro_author_admin', 'true');
          localStorage.setItem('anestesiapro_pin_authorized', 'true');
          (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
        } catch {}
        return true;
      }
    }
  } catch {}
  return false;
}

// Global Stats Sync with Backend Server
export async function syncGlobalVisit(): Promise<AppStats> {
  const local = getLocalCache();

  const device = detectDevice();
  const location = detectLocation();

  let isNewDevice = false;
  if (typeof window !== 'undefined') {
    try {
      if (!localStorage.getItem('anestesiapro_device_uuid')) {
        localStorage.setItem('anestesiapro_device_uuid', `dev_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`);
        isNewDevice = true;
      }

      if (!sessionStorage.getItem('anestesiapro_session_visited')) {
        sessionStorage.setItem('anestesiapro_session_visited', 'true');
        logAdminActivity(
          'visit',
          isNewDevice ? '👤 ¡Nuevo Colega Ingresó a la App!' : '🩺 Sesión Clínica Iniciada',
          isNewDevice
            ? `Un colega abrió AnestesiaPro por primera vez (${device} • ${location})`
            : `Un anestesiólogo ingresó a consultar la aplicación (${device} • ${location})`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const res = await fetch(resolveAppUrl('/api/stats/visit'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientVisits: local.visits,
        clientAppInstalls: local.appInstalls,
        clientDownloads: local.totalDownloads,
        clientItemDownloads: local.itemDownloads,
        device,
        location,
        isNewDevice
      })
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const merged = mergeMonotonic(data.stats, local);
      return saveLocalCache(merged);
    }
  } catch (e) {
    console.warn('Backend stats sync unavailable, fallback to local cache:', e);
  }

  // Local fallback increment
  const updatedLocal = { ...local, visits: local.visits + 1 };
  return saveLocalCache(updatedLocal);
}

export async function recordAppInstall(): Promise<AppStats> {
  const local = getLocalCache();

  // Prevent duplicate burst recordings within 5 seconds on the same client
  const now = Date.now();
  if (typeof window !== 'undefined') {
    try {
      const lastInstallTime = parseInt(sessionStorage.getItem('anestesiapro_last_install_timestamp') || '0', 10);
      if (now - lastInstallTime < 5000) {
        return local;
      }
      sessionStorage.setItem('anestesiapro_last_install_timestamp', String(now));
    } catch (e) {
      console.error(e);
    }
  }

  local.appInstalls = (Number(local.appInstalls) || 0) + 1;
  saveLocalCache(local);

  const device = detectDevice();
  const location = detectLocation();

  logAdminActivity(
    'install',
    '🎉 ¡NUEVA INSTALACIÓN CONFIRMADA!',
    `¡Un colega instaló AnestesiaPro en su ${device} (${location})! — Total acumulado: ${local.appInstalls} instalaciones`
  );

  let isNewDevice = false;
  if (typeof window !== 'undefined') {
    try {
      if (!localStorage.getItem('anestesiapro_device_uuid')) {
        localStorage.setItem('anestesiapro_device_uuid', `dev_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`);
        isNewDevice = true;
      }
    } catch (e) {
      console.error(e);
    }
  }

  try {
    const res = await fetch(resolveAppUrl('/api/stats/install'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientVisits: local.visits,
        clientAppInstalls: local.appInstalls,
        clientDownloads: local.totalDownloads,
        clientItemDownloads: local.itemDownloads,
        device,
        location,
        isNewDevice
      })
    });
    const data = await res.json();
    if (data.success && data.stats) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('anestesiapro_install_synced_to_server', 'true');
          localStorage.setItem('anestesiapro_pwa_standalone_recorded', 'true');
        } catch (e) {}
      }
      const merged = mergeMonotonic(data.stats, local);
      return saveLocalCache(merged);
    }
  } catch (e) {
    console.warn('Backend stats install increment unavailable:', e);
  }

  return local;
}

export async function getGlobalStats(): Promise<AppStats> {
  let current = getLocalCache();
  try {
    const res = await fetch(resolveAppUrl('/api/stats'));
    const data = await res.json();
    if (data.success && data.stats) {
      current = mergeMonotonic(data.stats, current);
      return saveLocalCache(current);
    }
  } catch (e) {
    console.warn('Error fetching stats from server, checking cloud:', e);
  }

  // Cloud Firestore fallback / cross-device check
  try {
    const cloud = await getCloudStats();
    if (cloud) {
      current = mergeMonotonic(cloud, current);
      return saveLocalCache(current);
    }
  } catch (cErr) {
    console.warn('Error fetching stats from cloud:', cErr);
  }

  return current;
}

export async function recordGlobalDownload(resourceId?: string): Promise<AppStats> {
  const local = getLocalCache();
  // Do not inflate download counts when Dr. Carlos Leal tests or downloads resources
  if (isAdministratorUser()) {
    return local;
  }
  if (resourceId) {
    local.itemDownloads[resourceId] = (local.itemDownloads[resourceId] || 0) + 1;
  }
  const itemSum = Object.values(local.itemDownloads).reduce((a, b) => a + b, 0);
  local.totalDownloads = Math.max(local.totalDownloads + 1, itemSum);
  saveLocalCache(local);

  const device = detectDevice();
  const location = detectLocation();

  if (resourceId) {
    logAdminActivity(
      'download',
      '📥 Descarga / Consulta de Recurso',
      `Recurso: ${resourceId} (${device} • ${location})`
    );
  }

  try {
    const res = await fetch(resolveAppUrl('/api/stats/download'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resourceId,
        clientVisits: local.visits,
        clientDownloads: local.totalDownloads,
        clientItemDownloads: local.itemDownloads,
        device,
        location
      })
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const merged = mergeMonotonic(data.stats, local);
      return saveLocalCache(merged);
    }
  } catch (e) {
    console.warn('Error recording download:', e);
  }

  return local;
}

export async function recordResourceView(resourceId: string): Promise<AppStats> {
  const local = getLocalCache();
  // Do not inflate view counts when Dr. Carlos Leal consults resources
  if (isAdministratorUser()) {
    return local;
  }
  if (resourceId) {
    local.itemViews = local.itemViews || {};
    local.itemViews[resourceId] = (local.itemViews[resourceId] || 0) + 1;
  }
  saveLocalCache(local);

  try {
    const res = await fetch(resolveAppUrl('/api/stats/view'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId })
    });
    const data = await res.json();
    if (data.success && data.stats) {
      const merged = mergeMonotonic(data.stats, local);
      return saveLocalCache(merged);
    }
  } catch (e) {
    // Non-blocking
  }

  return local;
}

export function getResourceMetrics(resourceId?: string, currentStats?: AppStats): { views: number; downloads: number } {
  if (!resourceId) return { views: 0, downloads: 0 };
  try {
    const stats = currentStats || getLocalCache();
    if (!stats) return { views: 0, downloads: 0 };
    const downloads = (stats.itemDownloads && typeof stats.itemDownloads === 'object' && stats.itemDownloads[resourceId] !== undefined)
      ? Number(stats.itemDownloads[resourceId]) || 0
      : 0;
    
    const rawViews = (stats.itemViews && typeof stats.itemViews === 'object') ? stats.itemViews[resourceId] : undefined;
    const views = rawViews !== undefined
      ? Number(rawViews) || 0
      : 0;

    return { views, downloads };
  } catch (e) {
    return { views: 0, downloads: 0 };
  }
}

export async function recordPreanesthesiaUsage(
  action: 'consult' | 'evaluation_generated' | 'evaluation_downloaded' | 'evaluation_shared',
  patientInfo?: string
): Promise<AppStats> {
  const local = getLocalCache();
  if (isAdministratorUser()) {
    return local;
  }
  let resourceId = 'res-modulo-preanestesia-consultado';
  let badgeTitle = '📋 Módulo Preanestesia';
  let notifMsg = '';

  if (action === 'consult') {
    resourceId = 'res-modulo-preanestesia-consultado';
    notifMsg = 'Se registró uso/consulta en el Módulo de Evaluación Preanestésica.';
    logAdminActivity('explore', '📋 Consulta: Módulo Preanestesia', 'Un usuario ingresó a evaluar pacientes prequirúrgicos');
  } else if (action === 'evaluation_generated') {
    resourceId = 'res-evaluacion-preanestesica';
    badgeTitle = '📋 Ficha Preanestésica Generada';
    notifMsg = `Se generó un nuevo informe PDF de Evaluación Preanestésica${patientInfo ? ` (Paciente: ${patientInfo})` : ''}.`;
    logAdminActivity('explore', '📋 Generación: Ficha Preanestésica PDF', patientInfo ? `Paciente: ${patientInfo}` : 'Informe preanestésico digital generado');
  } else if (action === 'evaluation_downloaded' || action === 'evaluation_shared') {
    resourceId = 'res-evaluacion-preanestesica';
    badgeTitle = '📥 Reporte Preanestésico Exportado';
    notifMsg = `Se descargó/compartió un reporte PDF de Evaluación Preanestésica${patientInfo ? ` (Paciente: ${patientInfo})` : ''}.`;
    logAdminActivity('download', '📥 Reporte Preanestésico Descargado', patientInfo ? `Paciente: ${patientInfo}` : 'Informe preanestésico exportado');
  }

  // Update timestamps in localStorage for admin view
  try {
    localStorage.setItem('anestesiapro_last_preanesthesia_activity', new Date().toISOString());
  } catch (e) {
    console.error(e);
  }

  // Record in global metrics
  const updatedStats = await recordGlobalDownload(resourceId);

  // Send an automatic notification update if it was an evaluation generation or share
  if (action !== 'consult' || Math.random() < 0.2) {
    publishNewNotification({
      title: badgeTitle,
      message: notifMsg,
      badge: 'PREANESTESIA',
      resourceId: 'res-evaluacion-preanestesica',
      author: 'Sistema AnestesiaPro'
    });
  }

  return updatedStats;
}

export async function recordCalculatorUsage(
  type: 'induccion' | 'shock_index' | 'preeclampsia'
): Promise<AppStats> {
  const local = getLocalCache();
  if (isAdministratorUser()) {
    return local;
  }
  const resourceId = type === 'induccion' 
    ? 'res-calculadora-induccion' 
    : type === 'shock_index' 
    ? 'res-indice-de-shock' 
    : 'res-calculadora-preeclampsia';
  
  logAdminActivity(
    'explore',
    type === 'induccion' 
      ? '🧮 Uso: Calculadora de Inducción Anestésica' 
      : type === 'shock_index'
      ? '🧮 Uso: Calculadora Índice de Shock'
      : '🧬 Uso: Calculadora Diagnóstica de Preeclampsia & Severidad',
    type === 'induccion' 
      ? 'Cálculo de dosis farmacológicas de inducción ajustadas por peso' 
      : type === 'shock_index'
      ? 'Evaluación de Índice de Shock & Reanimación'
      : 'Estratificación de Preeclampsia, Criterios de Severidad, Esquema Zuspan y Seguridad Neuroaxial'
  );

  try {
    localStorage.setItem(`anestesiapro_last_calc_${type}`, new Date().toISOString());
  } catch (e) {
    console.error(e);
  }

  return await recordGlobalDownload(resourceId);
}

// Notifications Sync
export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const res = await fetch(resolveAppUrl('/api/notifications'));
    const data = await res.json();
    if (data.success && Array.isArray(data.notifications)) {
      return data.notifications;
    }
  } catch (e) {
    console.warn('Error fetching notifications:', e);
  }

  // Local fallback notifications
  const localSaved = localStorage.getItem('anestesiapro_local_notifications');
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch (e) {
      console.error(e);
    }
  }

  return [
    {
      id: 'notif-emotive-2026',
      title: '🩸 ¡NUEVO RECURSO: PROTOCOLO E-MOTIVE EN HEMORRAGIA POSPARTO (NEJM / OMS / FIGO / SOAP)! 🚨',
      message: 'Se ha publicado la Guía Oficial y el Atlas Visual Clínico interactivo de alta fidelidad sobre el Protocolo E-MOTIVE: [E] Detección Precoz con Bolsa Colectora V-Drape calibrada en ml, [M] Masaje Uterino Bimanual activo (Pinard), [O] Uterotónicos de 1ª línea (Oxitocina/Carbetocina/Metilergonovina), [T] Ácido Tranexámico precoz (<15-30 min), [I] Fluidos IV tibios a 37°C y Calcio, [V] Examen vaginal de las 4Ts, [E] Escalamiento a Balón de Bakri y PTM 1:1:1. ¡Incluye generación de PDF descargable!',
      date: '2026-08-31',
      badge: 'URGENCIA OBSTÉTRICA 🩸',
      resourceId: 'res-protocolo-emotive-hpp',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-vortex-2026',
      title: '🌀 ¡NUEVO RECURSO: EL ENFOQUE VORTEX EN VÍA AÉREA DIFÍCIL & RESCATE CICO (BJA 2026)!',
      message: 'Se ha publicado la Guía Oficial y Ayuda Cognitiva Visual interactiva sobre El Enfoque VORTEX (Dr. Nicholas Chrimes - BJA / DAS / WFSA). Incluye simulador interactivo del Embudo, Zona Verde, 3 Líneas de Vida, 5 Optimizaciones del Mejor Esfuerzo, Gatillo Quirúrgico CICO (eFONA) y generación de PDF descargable.',
      date: '2026-08-23',
      badge: 'VÍA AÉREA CRÍTICA 🌀',
      resourceId: 'res-enfoque-vortex-via-aerea-dificil',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-isr-2025',
      title: '📌 ¡NUEVA GUÍA CLÍNICA: INDUCCIÓN DE SECUENCIA RÁPIDA (ISR 2025)!',
      message: 'Se ha publicado la Guía Oficial y Resumen Ejecutivo sobre Inducción de Secuencia Rápida (ISR), Algoritmo de las 7 Ps, Ayuno Preoperatorio actualizado y Controversias (SARTD-CHGUV Octubre 2025) en Educación Continua.',
      date: '2026-08-12',
      badge: 'GUÍA CLÍNICA 📌',
      resourceId: 'res-isr-secuencia-rapida-2025',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-cebranopadol-1',
      title: '💊 ¡NUEVO ARTÍCULO CIENTÍFICO: CEBRANOPADOL (FASE 3 ALLEVIATE)!',
      message: 'Se ha publicado la revisión sobre Cebranopadol en Educación Continua. Agonista dual NOP/MOP de primera clase para dolor agudo postoperatorio (Anesthesiology News 2026).',
      date: '2026-08-11',
      badge: 'ARTÍCULO CIENTÍFICO 💊',
      resourceId: 'res-cebranopadol-fase3-2026',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-shock-1',
      title: '🩸 ¡NUEVO MÓDULO: ÍNDICE DE SHOCK & REANIMACIÓN HEMODINÁMICA!',
      message: 'Se ha publicado el nuevo Módulo de Índice de Shock en AnestesiaPro. Incluye: Cálculo en tiempo real de IS (FC/PAS), IS Modificado (FC/PAM) y PAM, Protocolo de Hidratación con Cristaloides Balanceados vs Salina, Dosis por Objetivos, Metas de Perfusión Tisular y Protocolo de Transfusión Masiva (PTM 1:1:1) con Ácido Tranexámico.',
      date: '2026-08-10',
      badge: 'NUEVO MÓDULO 🚨',
      resourceId: 'res-indice-de-shock',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-aminofilina-1',
      title: '¡NUEVA GUÍA Y ARTÍCULOS: AMINOFILINA Y TEOFILINA EN CPPD!',
      message: 'Se ha publicado la Infografía Oficial y la Revisión Científica (Metaanálisis 2023 y Estudio Multicéntrico 2016) sobre Aminofilina y Teofilina en el Manejo de la Cefalea Pospunción Dural (CPPD) en Educación Continua.',
      date: '2026-08-08',
      badge: 'RECURSO MÉDICO',
      resourceId: 'res-aminofilina-teofilina-cppd',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-fona-1',
      title: '¡NUEVA INFOGRAFÍA TÉCNICA FONA!',
      message: 'Se ha publicado la infografía técnica oficial del Procedimiento FONA (Acceso Frontal al Cuello - Cricotirotomía de Emergencia) en la sección Educación Continua.',
      date: '2026-08-08',
      badge: 'RECURSO MÉDICO',
      resourceId: 'res-fona-cricotiroidotomia',
      author: 'Dr. Carlos Leal'
    },
    {
      id: 'notif-elaine-1',
      title: 'Caso de Estudio: Elaine Bromiley',
      message: 'Análisis de Factores Humanos y Manejo de Crisis en Anestesia disponible para descarga en PDF.',
      date: '2026-08-05',
      badge: 'CASO CLÍNICO',
      resourceId: 'res-caso-elaine-bromiley',
      author: 'Dr. Carlos Leal'
    }
  ];
}

export async function publishNewNotification(notifData: {
  title: string;
  message: string;
  badge?: string;
  resourceId?: string;
  author?: string;
  pin?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(resolveAppUrl('/api/notifications'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notifData)
    });
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.warn('Error publishing notification:', e);
    // Local fallback
    const list = await getNotifications();
    const newN: AppNotification = {
      id: `notif-${Date.now()}`,
      title: notifData.title,
      message: notifData.message,
      date: new Date().toISOString().split('T')[0],
      badge: notifData.badge || 'ACTUALIZACIÓN',
      resourceId: notifData.resourceId || '',
      author: notifData.author || 'Dr. Carlos Leal'
    };
    list.unshift(newN);
    localStorage.setItem('anestesiapro_local_notifications', JSON.stringify(list));
    return true;
  }
}

// Web Audio API Notification Sound (pleasant two-tone chime)
export function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    // First tone (G5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Second tone (C6) - 120ms delay
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.warn('Audio chime unavailable:', e);
  }
}

// Web Audio API Celebration Sound (Ascending 4-tone joyful fanfare for app installs)
export function playInstallCelebrationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // Fanfare chords / notes: C5 (523.25 Hz), E5 (659.25 Hz), G5 (783.99 Hz), High C6 (1046.50 Hz)
    const notes = [
      { freq: 523.25, time: 0, dur: 0.2, vol: 0.22 },
      { freq: 659.25, time: 0.12, dur: 0.2, vol: 0.26 },
      { freq: 783.99, time: 0.24, dur: 0.25, vol: 0.3 },
      { freq: 1046.50, time: 0.38, dur: 0.65, vol: 0.35 }
    ];

    notes.forEach(n => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle'; // Warm, rich celebratory sound
      osc.frequency.setValueAtTime(n.freq, ctx.currentTime + n.time);
      gain.gain.setValueAtTime(n.vol, ctx.currentTime + n.time);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.time + n.dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + n.time);
      osc.stop(ctx.currentTime + n.time + n.dur);
    });
  } catch (e) {
    console.warn('Celebration chime unavailable:', e);
  }
}

// Request Browser Native Push Notification Permission
export async function requestBrowserNotifications(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  try {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  } catch (e) {
    console.warn('Notification permission error:', e);
    return false;
  }
}

export function sendBrowserPushNotification(title: string, body: string, icon = '/app_logo.jpg') {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(reg => {
          if (reg && reg.showNotification) {
            reg.showNotification(title, {
              body,
              icon: resolveAppUrl(icon),
              badge: resolveAppUrl(icon),
              tag: `anestesiapro-alert-${Date.now()}`
            });
          } else {
            new Notification(title, {
              body,
              icon: resolveAppUrl(icon),
              badge: resolveAppUrl(icon),
              tag: `anestesiapro-alert-${Date.now()}`
            });
          }
        }).catch(() => {
          new Notification(title, {
            body,
            icon: resolveAppUrl(icon),
            badge: resolveAppUrl(icon),
            tag: `anestesiapro-alert-${Date.now()}`
          });
        });
      } else {
        new Notification(title, {
          body,
          icon: resolveAppUrl(icon),
          badge: resolveAppUrl(icon),
          tag: `anestesiapro-alert-${Date.now()}`
        });
      }
    } catch (e) {
      console.warn('Error triggering native notification:', e);
    }
  }
}

export async function submitUserFeedback(feedback: {
  name?: string;
  email?: string;
  location?: string;
  message: string;
}): Promise<boolean> {
  try {
    const res = await fetch(resolveAppUrl('/api/feedback'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    const data = await res.json();
    return data.success;
  } catch (e) {
    console.warn('Backend feedback offline, saving to local cache:', e);
    const existing: UserFeedback[] = JSON.parse(localStorage.getItem('anestesiapro_local_feedback') || '[]');
    existing.unshift({
      id: `feedback-${Date.now()}`,
      name: feedback.name || 'Colega Anónimo',
      email: feedback.email || '',
      location: feedback.location || 'Sin especificar',
      message: feedback.message,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    localStorage.setItem('anestesiapro_local_feedback', JSON.stringify(existing));
    return true;
  }
}

export async function getFeedbackList(): Promise<UserFeedback[]> {
  try {
    const res = await fetch(resolveAppUrl('/api/feedback'));
    const data = await res.json();
    if (data.success && Array.isArray(data.suggestions)) {
      return data.suggestions;
    }
  } catch (e) {
    console.warn('Error loading feedback list:', e);
  }

  try {
    return JSON.parse(localStorage.getItem('anestesiapro_local_feedback') || '[]');
  } catch {
    return [];
  }
}

export async function deleteUserFeedback(id: string): Promise<boolean> {
  try {
    const res = await fetch(resolveAppUrl(`/api/feedback/${id}`), {
      method: 'DELETE'
    });
    const data = await res.json();
    if (data.success) {
      const local: UserFeedback[] = JSON.parse(localStorage.getItem('anestesiapro_local_feedback') || '[]');
      const filtered = local.filter((f) => f.id !== id);
      localStorage.setItem('anestesiapro_local_feedback', JSON.stringify(filtered));
      return true;
    }
  } catch (e) {
    console.warn('Backend delete offline, removing locally:', e);
  }
  const local: UserFeedback[] = JSON.parse(localStorage.getItem('anestesiapro_local_feedback') || '[]');
  const filtered = local.filter((f) => f.id !== id);
  localStorage.setItem('anestesiapro_local_feedback', JSON.stringify(filtered));
  return true;
}

// ----------------------------------------------------
// TELEMETRÍA Y BITÁCORA PRIVADA DEL DR. CARLOS LEAL
// Solo visible en el Panel Privado del Administrador
// ----------------------------------------------------
export interface AdminActivityEvent {
  id: string;
  type: 'install' | 'visit' | 'explore' | 'download';
  title: string;
  detail: string;
  device: string;
  location: string;
  timestamp: string;
  timeMs?: number;
}

export function formatLocalDisplayTime(timestampStr?: string): string {
  if (!timestampStr) return 'Ahora';
  try {
    if (timestampStr.includes('a. m.') || timestampStr.includes('p. m.') || timestampStr.includes('AM') || timestampStr.includes('PM')) {
      return timestampStr;
    }
    let d: Date;
    if (timestampStr.includes('T')) {
      d = new Date(timestampStr);
    } else if (timestampStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
      d = new Date(timestampStr.replace(' ', 'T') + ':00Z');
    } else {
      d = new Date(timestampStr);
    }
    if (isNaN(d.getTime())) return timestampStr;
    return new Intl.DateTimeFormat('es-VE', {
      timeZone: 'America/Caracas',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return timestampStr;
  }
}

export function formatShortLocalTime(timestampStr?: string): string {
  if (!timestampStr) return 'Ahora';
  try {
    if (timestampStr.includes('a. m.') || timestampStr.includes('p. m.') || timestampStr.includes('AM') || timestampStr.includes('PM')) {
      return timestampStr.split(',')[1]?.trim() || timestampStr;
    }
    let d: Date;
    if (timestampStr.includes('T')) {
      d = new Date(timestampStr);
    } else if (timestampStr.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)) {
      d = new Date(timestampStr.replace(' ', 'T') + ':00Z');
    } else {
      d = new Date(timestampStr);
    }
    if (isNaN(d.getTime())) return timestampStr;
    return new Intl.DateTimeFormat('es-VE', {
      timeZone: 'America/Caracas',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return timestampStr;
  }
}

export function getCaracasTimestamp(): string {
  try {
    return new Intl.DateTimeFormat('es-VE', {
      timeZone: 'America/Caracas',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date());
  } catch {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}

export async function logAdminActivity(
  type: 'install' | 'visit' | 'explore' | 'download',
  title: string,
  detail?: string
): Promise<void> {
  // If Dr. Carlos Leal is browsing, testing, or downloading, do not log himself as a visitor
  if (isAdministratorUser()) {
    return;
  }

  const device = detectDevice();
  const location = detectLocation();
  const timestamp = getCaracasTimestamp();

  const nowMs = Date.now();
  const newEvt: AdminActivityEvent = {
    id: `evt-${nowMs}-${Math.random().toString(36).substr(2, 5)}`,
    type,
    title,
    detail: detail || 'Interacción registrada en la aplicación',
    device,
    location,
    timestamp,
    timeMs: nowMs
  };

  // Local fallback storage for instant reactivity
  try {
    const raw = localStorage.getItem('anestesiapro_admin_events_cache') || '[]';
    const list: AdminActivityEvent[] = JSON.parse(raw);
    list.unshift(newEvt);
    if (list.length > 250) list.length = 250;
    localStorage.setItem('anestesiapro_admin_events_cache', JSON.stringify(list));
    
    // Dispatch event so active admin panel updates in real time
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_admin_event_logged', { detail: newEvt }));
    }
  } catch (e) {
    console.error('Error caching admin event:', e);
  }

  // Send to backend
  try {
    await fetch(resolveAppUrl('/api/admin/events'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, title, detail, device, location })
    });
  } catch (e) {
    console.warn('Backend admin event logging failed:', e);
  }
}

export async function getAdminActivityEvents(): Promise<AdminActivityEvent[]> {
  try {
    const res = await fetch(resolveAppUrl('/api/admin/events'));
    const data = await res.json();
    if (data.success && Array.isArray(data.events)) {
      localStorage.setItem('anestesiapro_admin_events_cache', JSON.stringify(data.events));
      return data.events;
    }
  } catch (e) {
    console.warn('Error fetching admin events:', e);
  }

  try {
    return JSON.parse(localStorage.getItem('anestesiapro_admin_events_cache') || '[]');
  } catch {
    return [];
  }
}

export function recordSectionVisit(tab: string): void {
  try {
    const lastTabKey = `anestesiapro_last_tab_log_${tab}`;
    const lastTime = parseInt(sessionStorage.getItem(lastTabKey) || '0', 10);
    if (Date.now() - lastTime < 2500) {
      return;
    }
    sessionStorage.setItem(lastTabKey, Date.now().toString());

    // Persist module visit counter
    const storedVisits = JSON.parse(localStorage.getItem('anestesiapro_module_visits') || '{}');
    storedVisits[tab] = (storedVisits[tab] || 0) + 1;
    localStorage.setItem('anestesiapro_module_visits', JSON.stringify(storedVisits));
  } catch (e) {}

  const titles: Record<string, { title: string; detail: string }> = {
    inicio: { title: '🏠 Visita: Pantalla de Inicio', detail: 'Navegación general en el menú principal y módulos' },
    preanestesia: { title: '📋 Visita: Módulo Preanestesia', detail: 'Evaluación preoperatoria, ayuno y clasificación ASA' },
    viaAerea: { title: '🫁 Visita: Vía Aérea Difícil', detail: 'Consulta de Algoritmo VAD, Enfoque VORTEX y Rescate CICO' },
    escalas: { title: '📊 Visita: Escalas Clínicas', detail: 'Consulta de escalas (Aldrete, Bromage, Glasgow, APACHE II, etc.)' },
    indiceShock: { title: '🩸 Visita: Índice de Shock', detail: 'Cálculo de IS, PAM y protocolo de transfusión masiva' },
    calculadora: { title: '🧮 Visita: Calculadora de Inducción Anestésica', detail: 'Cálculo de dosis farmacológicas de inducción anestésica por peso' },
    vademecum: { title: '📖 Visita: Diccionario / Vademécum', detail: 'Consulta de vademécum de anestésicos y reversiones' },
    educacion: { title: '🎓 Visita: Educación Médica Continua', detail: 'Lectura de guías clínicas y protocolos actualizados' }
  };

  const meta = titles[tab] || { title: `🔍 Visita: Sección ${tab}`, detail: 'Interacción con sección clínica de AnestesiaPro' };
  logAdminActivity('explore', meta.title, meta.detail);
}

export function getModuleVisits(): Record<string, { label: string; count: number; icon: string }> {
  const baseCounts: Record<string, { label: string; count: number; icon: string }> = {
    educacion: { label: 'Educación Médica & Atlas Preeclampsia', count: 320, icon: '🎓' },
    viaAerea: { label: 'Vía Aérea Difícil & Algoritmos VORTEX', count: 284, icon: '🫁' },
    preanestesia: { label: 'Evaluación Preanestésica Oficial', count: 245, icon: '📋' },
    indiceShock: { label: 'Índice de Shock & Reanimación', count: 212, icon: '🩸' },
    calculadora: { label: 'Calculadora de Inducción por Peso', count: 185, icon: '🧮' },
    escalas: { label: 'Escalas Clínicas (Aldrete / ASA)', count: 156, icon: '📊' },
    vademecum: { label: 'Vademécum Farmacológico', count: 138, icon: '📖' }
  };

  try {
    const stored = JSON.parse(localStorage.getItem('anestesiapro_module_visits') || '{}');
    Object.keys(stored).forEach((key) => {
      if (baseCounts[key]) {
        baseCounts[key].count += stored[key];
      }
    });
  } catch {}

  return baseCounts;
}

export async function clearAdminActivityEvents(pin: string = '2534'): Promise<boolean> {
  try {
    localStorage.setItem('anestesiapro_admin_events_cache', '[]');
    localStorage.setItem('anestesiapro_last_seen_admin_event', new Date().toISOString().replace('T', ' ').substring(0, 16));
  } catch (e) {
    console.error(e);
  }

  try {
    const res = await fetch(resolveAppUrl('/api/admin/events/clear'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const data = await res.json();
    if (data.success) {
      return true;
    }
  } catch (e) {
    console.warn('Error clearing admin events on server:', e);
  }
  return true;
}

export const AUTHOR_EMAIL = 'carloseduardoleal29@gmail.com';

export function generateAdminEmailReportUrl(events: AdminActivityEvent[], stats?: AppStats): string {
  const subject = encodeURIComponent(`📊 Bitácora de Notificaciones AnestesiaPro - ${new Date().toLocaleDateString('es-ES')}`);
  let bodyText = `Hola Dr. Carlos Leal,\n\nResumen de actividad reciente registrado en AnestesiaPro:\n\n`;
  if (stats) {
    bodyText += `📈 MÉTRICAS GLOBALES:\n`;
    bodyText += `• Visitas totales: ${stats.visits}\n`;
    bodyText += `• Instalaciones PWA: ${stats.appInstalls || 0}\n`;
    bodyText += `• Descargas totales de guías: ${stats.totalDownloads}\n\n`;
  }
  bodyText += `🔔 ALERTAS Y ACTIVIDAD RECIENTE (${events.length}):\n`;
  events.slice(0, 25).forEach((e, idx) => {
    bodyText += `${idx + 1}. [${e.timestamp}] ${e.title}\n   ${e.detail}\n   Dispositivo: ${e.device} | Ubicación: ${e.location}\n\n`;
  });
  bodyText += `Enviado desde el Panel Privado de AnestesiaPro.\n${getCanonicalAppOrigin()}`;
  return `mailto:${AUTHOR_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

export function generateSingleEventEmailUrl(event: { title: string; detail?: string; details?: string; device?: string; location?: string; timestamp?: string }): string {
  const subject = encodeURIComponent(`🚨 Alerta AnestesiaPro: ${event.title}`);
  const details = event.detail || event.details || 'Actividad registrada';
  const bodyText = `Dr. Carlos Leal,\n\nSe ha registrado la siguiente actividad en AnestesiaPro:\n\n` +
    `• Evento: ${event.title}\n` +
    `• Detalle: ${details}\n` +
    `• Dispositivo: ${event.device || 'Dispositivo'}\n` +
    `• Ubicación: ${event.location || 'Venezuela'}\n` +
    `• Fecha y Hora: ${event.timestamp || new Date().toLocaleString()}\n\n` +
    `Acceso al panel privado: ${getCanonicalAppOrigin()}/?admin=true`;
  return `mailto:${AUTHOR_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

export async function updateAdminStats(updates: Partial<AppStats> & { resetAll?: boolean; clearEvents?: boolean }, pin = '2534'): Promise<AppStats | null> {
  try {
    const res = await fetch(resolveAppUrl('/api/admin/stats/update'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin, updates })
    });
    const data = await res.json();
    if (data.success && data.stats) {
      return saveLocalCache(data.stats);
    }
  } catch (e) {
    console.warn('Error updating admin stats on server:', e);
  }
  return null;
}

export async function resetAllAdminStats(pin = '2534'): Promise<AppStats | null> {
  try {
    localStorage.setItem('anestesiapro_visit_count', '1');
    localStorage.setItem('anestesiapro_app_installs', '0');
    localStorage.setItem('anestesiapro_total_downloads', '0');
    localStorage.setItem('anestesiapro_resource_downloads', '{}');
    localStorage.setItem('anestesiapro_admin_events_cache', '[]');
  } catch (e) {}

  return updateAdminStats({
    resetAll: true,
    clearEvents: true
  }, pin);
}
export const statsService = {
  recordDownload: (name: string) => recordGlobalDownload(name),
  recordGlobalDownload,
  recordResourceView,
  getResourceMetrics,
  getGlobalStats,
  publishNewNotification,
  trackEvent: (event: string, details?: any) => {
    try {
      console.log('Event tracked:', event, details);
    } catch (e) {}
  }
};
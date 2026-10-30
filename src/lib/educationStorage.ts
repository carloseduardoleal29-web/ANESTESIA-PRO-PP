/**
 * AnestesiaPro - Robust Educational Resources Storage & Sync Engine
 * Uses IndexedDB as primary client store (handles large images & PDFs without 5MB quota crashes)
 * with transparent localStorage backup and server API sync.
 */

import { INITIAL_RESOURCES } from '../data/initialEducationResources';
import { 
  getCloudResources, 
  saveCloudResource, 
  deleteCloudResource, 
  batchSaveCloudResources,
  subscribeToCloudResources,
  seedInitialResourcesToFirestore 
} from './cloudEducationService';

const DB_NAME = 'AnestesiaPro_EducationDB';
const DB_VERSION = 2; // Bumped to force instant schema/cache cleanup across all phones and PCs
const STORE_NAME = 'resources';
const PRIMARY_LOCAL_KEY = 'anestesiapro_education_resources_v2026_clean';
const LEGACY_KEYS = [
  'anestesiapro_education_resources_v2026_stable',
  'anestesiapro_education_resources_v2026_eras',
  'anestesiapro_education_resources_v16',
  'anestesiapro_education_resources_v15',
  'anestesiapro_education_resources_v14',
  'anestesiapro_education_resources'
];

export const PROTECTED_RESOURCE_IDS: string[] = [
  'res-preeclampsia-eclampsia-enfoque-anestesiologico',
  'res-protocolo-emotive-hemorragia-posparto-2026',
  'res-enfoque-vortex-via-aerea-dificil',
  'res-orexina-interruptor-despertar-2026',
  'res-guia-eras-cesarea-2025',
  'res-isr-secuencia-rapida-2025',
  'res-cebranopadol-fase3-2026',
  'res-indice-de-shock',
  'res-aminofilina-teofilina-cppd',
  'res-fona-cricotiroidotomia',
  'res-caso-elaine-bromiley',
  'res-das-2025-urgencias'
];

export const DEFAULT_TOMBSTONES: string[] = [
  'res-bloqueo-peng-cadera-2026',
  'res-modelo-vortex-redar',
  'res-articulo-metaanalisis-aminofilina-2023',
  'res-articulo-estudio-aminofilina-2016',
  'res-ciprofol-hsk3486-hipnotico-gabaa-2026',
  'res-ciprofol-reel-farmacoclinico-2026',
  'res-1789897417281-7jwq5',
  'res-dia-del-anestesiologo-16-octubre-2026',
  'res-1792141910896-91jgz',
  'res-test-speed',
  'test-item-1'
];

/**
 * Strips all legacy static template image paths (/images/...) from resources so that
 * all devices (phones & PCs) only show genuine user-uploaded images.
 */
/**
 * Robust deduplication of carousel slides.
 * Detects and collapses exact double mounts (e.g., 5 slides duplicated to 10 slides)
 * and eliminates duplicate URLs or base64 entries.
 */
export function deduplicateCarouselSlides(list: string[]): string[] {
  if (!Array.isArray(list) || list.length <= 1) return Array.isArray(list) ? list : [];

  // Filter valid strings
  const valid = list.filter(item => typeof item === 'string' && item.trim().length > 0);
  if (valid.length <= 1) return valid;

  // 1. Detect exact double mount (e.g. 5 slides duplicated to 10)
  if (valid.length >= 4 && valid.length % 2 === 0) {
    const half = valid.length / 2;
    const firstHalf = valid.slice(0, half);
    const secondHalf = valid.slice(half);
    const isDouble = firstHalf.every((slide, idx) => {
      const match = secondHalf[idx];
      if (slide === match) return true;
      if (typeof slide === 'string' && typeof match === 'string') {
        if (slide.length === match.length && slide.slice(0, 100) === match.slice(0, 100)) {
          return true;
        }
      }
      return false;
    });
    if (isDouble) {
      return firstHalf;
    }
  }

  // 2. Filter duplicate slides by key/fingerprint
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const item of valid) {
    const key = item.length > 500 ? `${item.length}_${item.slice(0, 80)}_${item.slice(-80)}` : item;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique.length > 0 ? unique : valid;
}

export function sanitizeResource(item: any): any {
  if (!item || typeof item !== 'object') return item;
  
  let cleanUrl = item.url || '';
  if (typeof cleanUrl === 'string' && (cleanUrl.startsWith('/images/') || cleanUrl.includes('fisiopatologia_arteriopatia') || cleanUrl.includes('mala_conexion_trofoblastica'))) {
    cleanUrl = '';
  }

  let cleanImages: string[] = [];
  if (Array.isArray(item.images)) {
    cleanImages = item.images.filter((img: any) => 
      typeof img === 'string' && 
      img.trim() !== '' && 
      !img.startsWith('/images/') &&
      (img.startsWith('/uploads/') || img.startsWith('data:image/') || img.startsWith('blob:') || img.startsWith('http://') || img.startsWith('https://'))
    );
    cleanImages = deduplicateCarouselSlides(cleanImages);
  }

  let cleanImagesData: string[] = [];
  if (Array.isArray(item.imagesData)) {
    cleanImagesData = item.imagesData.filter((img: any) => 
      typeof img === 'string' && 
      img.trim() !== '' && 
      !img.startsWith('/images/') &&
      (img.startsWith('data:image/') || img.startsWith('/uploads/'))
    );
    cleanImagesData = deduplicateCarouselSlides(cleanImagesData);
  }

  let cleanFileDataUrl = item.fileDataUrl || '';
  if (typeof cleanFileDataUrl === 'string' && cleanFileDataUrl.startsWith('/images/')) {
    cleanFileDataUrl = '';
  }

  const isCarousel = Boolean(item.isCarousel || cleanImages.length > 1 || cleanImagesData.length > 1);
  const fileSize = isCarousel && cleanImages.length > 1 ? `${cleanImages.length} láminas HD` : item.fileSize;

  return {
    ...item,
    url: cleanUrl,
    images: cleanImages,
    imagesData: cleanImagesData,
    fileDataUrl: cleanFileDataUrl,
    isCarousel,
    fileSize
  };
}

// Open native IndexedDB safely
function openDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('[EducationStorage] IndexedDB open error, falling back to localStorage');
        resolve(null);
      };
    } catch (e) {
      console.warn('[EducationStorage] IndexedDB exception:', e);
      resolve(null);
    }
  });
}

/**
 * Compress an image file to reduce storage footprint (<150KB) and preserve high visual fidelity
 */
export async function compressImageFile(file: File | Blob, maxWidth = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Create a lightweight catalog representation of resources for instant localStorage persistence (0ms startup).
 * Strips heavy data: URLs (base64) so it never hits the browser 5MB quota limit,
 * while preserving all metadata, titles, descriptions, categories, authors, tags, and HTTP/uploads URLs.
 */
export function createLightweightCatalog(resources: any[]): any[] {
  if (!Array.isArray(resources)) return [];
  const deleted = getDeletedResourceIds();

  return resources
    .filter(r => r && r.id && !deleted.includes(r.id))
    .map((raw) => {
      const r = sanitizeResource(raw);
      const { fileDataUrl, imagesData, ...rest } = r;

      // Keep only clean disk/network image URLs, remove any heavy base64 images from localStorage
      let safeImages: string[] = [];
      if (Array.isArray(rest.images)) {
        safeImages = rest.images.filter((img: any) => typeof img === 'string' && !img.startsWith('data:image'));
      }

      // Keep clean url, remove base64 from localStorage
      let safeUrl = rest.url || '';
      if (typeof safeUrl === 'string' && safeUrl.startsWith('data:')) {
        safeUrl = safeImages.length > 0 ? safeImages[0] : '';
      }

      return {
        ...rest,
        url: safeUrl,
        images: safeImages,
        fileDataUrl: '', // Full binary kept in IndexedDB and on server
        imagesData: [], // Full binary kept in IndexedDB and on server
        hasIndexedDBMedia: Boolean(fileDataUrl || (imagesData && imagesData.length > 0))
      };
    });
}

/**
 * Save an array of resources into IndexedDB (full media) and localStorage (instant metadata catalog)
 * safely without wiping existing items or exceeding browser quotas.
 */
export async function persistResources(resources: any[]): Promise<boolean> {
  if (!Array.isArray(resources)) return false;
  const deleted = getDeletedResourceIds();

  // 1. Save full items (including heavy base64 media) to IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      await new Promise<void>((resolve) => {
        if (resources.length === 0) return resolve();
        let count = 0;
        for (const rawItem of resources) {
          const item = sanitizeResource(rawItem);
          if (!item || !item.id || deleted.includes(item.id)) {
            count++;
            if (count === resources.length) resolve();
            continue;
          }
          const putReq = store.put(item);
          putReq.onsuccess = () => {
            count++;
            if (count === resources.length) resolve();
          };
          putReq.onerror = () => {
            count++;
            if (count === resources.length) resolve();
          };
        }
      });

      // Explicitly delete any item from store that was permanently removed
      for (const delId of deleted) {
        try { store.delete(delId); } catch {}
      }
    }
  } catch (err) {
    console.warn('[EducationStorage] IndexedDB write notice:', err);
  }

  // 2. Save clean lightweight catalog to localStorage for 0ms instantaneous cold start
  try {
    const lightweight = createLightweightCatalog(resources);
    localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(lightweight));
    
    // Clean up bloated legacy keys to guarantee maximal free space in localStorage
    for (const key of LEGACY_KEYS) {
      try {
        localStorage.removeItem(key);
      } catch {}
    }
    return true;
  } catch (err: any) {
    console.warn('[EducationStorage] LocalStorage quota notice, saving minimal representation:', err);
    try {
      // Emergency minimal catalog if localStorage has third-party data filling it
      const minimal = resources
        .filter(r => r && r.id && !deleted.includes(r.id))
        .map(r => ({
          id: r.id,
          title: r.title,
          category: r.category,
          date: r.date,
          author: r.author,
          isCustom: r.isCustom,
          isCommunity: r.isCommunity,
          updatedAt: r.updatedAt
        }));
      localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(minimal));
      return true;
    } catch (e) {
      console.error('[EducationStorage] Fatal localStorage write error:', e);
      return false;
    }
  }
}

/**
 * Load resources from IndexedDB, migrating legacy localStorage keys if needed
 */
export async function loadStoredResources(): Promise<any[]> {
  const resourceMap = new Map<string, any>();
  const deleted = getDeletedResourceIds();

  // 1. Try IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const items = await new Promise<any[]>((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });

      if (items && Array.isArray(items)) {
        for (const rawItem of items) {
          const item = sanitizeResource(rawItem);
          if (item && item.id) {
            if (deleted.includes(item.id)) {
              // Active purge: remove tombstoned item from IndexedDB right away
              try {
                const delTx = db.transaction(STORE_NAME, 'readwrite');
                delTx.objectStore(STORE_NAME).delete(item.id);
              } catch {}
            } else {
              resourceMap.set(item.id, item);
            }
          }
        }
      }
    }
  } catch (e) {
    console.warn('[EducationStorage] IndexedDB read warning:', e);
  }

  // 2. Check primary localStorage key and add or merge any missing items
  try {
    const primaryData = localStorage.getItem(PRIMARY_LOCAL_KEY);
    if (primaryData) {
      const parsed = JSON.parse(primaryData);
      if (Array.isArray(parsed)) {
        const cleaned: any[] = [];
        for (const rawItem of parsed) {
          const item = sanitizeResource(rawItem);
          if (item && item.id && !deleted.includes(item.id)) {
            cleaned.push(item);
            if (!resourceMap.has(item.id)) {
              resourceMap.set(item.id, item);
            } else {
              const existing = resourceMap.get(item.id);
              resourceMap.set(item.id, {
                ...item,
                ...existing,
                fileDataUrl: existing.fileDataUrl || item.fileDataUrl,
                images: (Array.isArray(existing.images) && existing.images.length > 0) ? existing.images : item.images,
                imagesData: (Array.isArray(existing.imagesData) && existing.imagesData.length > 0) ? existing.imagesData : item.imagesData
              });
            }
          }
        }
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(cleaned));
        }
      }
    }
  } catch (e) {}

  // 3. One-time clean-up of legacy localStorage keys so mobile devices never hang or loop-resurrect dead items
  for (const key of LEGACY_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch (e) {}
  }

  const allFound = Array.from(resourceMap.values());
  return allFound;
}

const DELETED_KEYS = 'anestesiapro_deleted_resource_ids';

/**
 * Get IDs of permanently deleted resources.
 * Protected core guides are strictly excluded from ever being treated as deleted.
 */
export function getDeletedResourceIds(): string[] {
  const protectedSet = new Set<string>(PROTECTED_RESOURCE_IDS);
  const set = new Set<string>(DEFAULT_TOMBSTONES.filter(id => !protectedSet.has(id)));
  try {
    const raw = localStorage.getItem(DELETED_KEYS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        let cleaned: string[] = [];
        parsed.forEach(id => {
          if (id && typeof id === 'string' && !protectedSet.has(id)) {
            set.add(id);
            cleaned.push(id);
          }
        });
        // Self-heal localStorage: remove any core clinical guides that were mistakenly saved in tombstones
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(DELETED_KEYS, JSON.stringify(cleaned));
        }
      }
    }
  } catch (e) {}
  return Array.from(set).filter(id => !protectedSet.has(id));
}

/**
 * Record a resource ID as deleted to prevent resurrection on sync or reload.
 * Permanently stores in localStorage tombstones.
 */
export function markResourceAsDeleted(resourceId: string): void {
  if (!resourceId || PROTECTED_RESOURCE_IDS.includes(resourceId)) return;
  try {
    const current = getDeletedResourceIds();
    if (!current.includes(resourceId)) {
      current.push(resourceId);
      localStorage.setItem(DELETED_KEYS, JSON.stringify(current));
    }
  } catch (e) {}
}

/**
 * Permanently delete a resource from both IndexedDB and localStorage
 */
export async function removeStoredResource(resourceId: string): Promise<boolean> {
  if (!resourceId) return false;
  if (PROTECTED_RESOURCE_IDS.includes(resourceId)) {
    console.warn('[EducationStorage] Core clinical guide cannot be deleted:', resourceId);
    return false;
  }
  markResourceAsDeleted(resourceId);

  // 1. Delete from IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      await new Promise<void>((resolve) => {
        const req = store.delete(resourceId);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    }
  } catch (err) {
    console.warn('[EducationStorage] Error deleting from IndexedDB:', err);
  }

  // 2. Remove from LocalStorage
  try {
    const raw = localStorage.getItem(PRIMARY_LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const remaining = parsed.filter((r: any) => r && r.id !== resourceId);
        localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(remaining));
      }
    }
    for (const legacyKey of LEGACY_KEYS) {
      try {
        const lRaw = localStorage.getItem(legacyKey);
        if (lRaw) {
          const lParsed = JSON.parse(lRaw);
          if (Array.isArray(lParsed)) {
            const lRemaining = lParsed.filter((r: any) => r && r.id !== resourceId);
            localStorage.setItem(legacyKey, JSON.stringify(lRemaining));
          }
        }
      } catch (e) {}
    }
  } catch (err) {
    console.warn('[EducationStorage] Error deleting from LocalStorage:', err);
  }

  // 3. Delete from Cloud Firestore
  try {
    deleteCloudResource(resourceId);
  } catch (cloudErr) {
    console.warn('[EducationStorage] Cloud Firestore delete error:', cloudErr);
  }

  return true;
}

/**
 * Purge all custom user uploaded resources, resetting to built-in items only
 */
export async function purgeAllCustomStoredResources(): Promise<void> {
  try {
    const current = await loadStoredResources();
    for (const item of current) {
      if (item && item.isCustom) {
        await removeStoredResource(item.id);
      }
    }
  } catch (e) {}
}

/**
 * Merge newly fetched server resources with locally saved items
 * Guarantees that deleted resources NEVER revive and that uploaded photos/carousels
 * are preserved with highest priority across devices without stale local caches overwriting cloud updates.
 */
export function mergeResources(builtin: any[], local: any[], server: any[], remoteDeletedIds: string[] = []): any[] {
  const map = new Map<string, any>();
  const protectedSet = new Set<string>(PROTECTED_RESOURCE_IDS);
  const localDeleted = getDeletedResourceIds();
  const deletedSet = new Set<string>(
    [...localDeleted, ...remoteDeletedIds, ...DEFAULT_TOMBSTONES].filter(id => !protectedSet.has(id))
  );

  // 1. Built-in first as foundation (sanitized, only if not in deletedSet)
  for (const rawItem of builtin) {
    const item = sanitizeResource(rawItem);
    if (item && item.id && !deletedSet.has(item.id)) {
      map.set(item.id, { ...item });
    }
  }

  // 2. Server items (Authoritative cloud database across all devices)
  if (Array.isArray(server) && server.length > 0) {
    for (const rawItem of server) {
      const item = sanitizeResource(rawItem);
      if (!item || !item.id || deletedSet.has(item.id)) continue;

      const existing = map.get(item.id);
      if (existing) {
        const hasServerImages = Array.isArray(item.images) && item.images.length > 0;
        const hasServerUrl = Boolean(item.url && item.url.trim() !== '');
        const isPhotoDeleted = Boolean(item.photoDeleted || (!hasServerImages && !hasServerUrl));

        map.set(item.id, {
          ...existing,
          ...item, // Server overrides built-in defaults
          url: isPhotoDeleted ? '' : (item.url || ''),
          images: isPhotoDeleted ? [] : (hasServerImages ? item.images : []),
          imagesData: isPhotoDeleted ? [] : (Array.isArray(item.imagesData) ? item.imagesData : []),
          fileDataUrl: isPhotoDeleted ? '' : (item.fileDataUrl || ''),
          photoDeleted: isPhotoDeleted,
          updatedAt: item.updatedAt || existing.updatedAt || new Date().toISOString()
        });
      } else {
        map.set(item.id, { 
          ...item,
          updatedAt: item.updatedAt || new Date().toISOString()
        });
      }
    }
  }

  // 3. Local items (Device IndexedDB & LocalStorage)
  const builtinIds = new Set(INITIAL_RESOURCES.map(b => b.id));
  if (Array.isArray(local)) {
    for (const rawItem of local) {
      const item = sanitizeResource(rawItem);
      if (!item || !item.id || deletedSet.has(item.id)) continue;

      const isCustomOrUserItem = Boolean(item.isCustom || item.isCommunity || !builtinIds.has(item.id));

      const existing = map.get(item.id);
      if (existing) {
        const isPhotoDeleted = Boolean(existing.photoDeleted || item.photoDeleted);
        if (isPhotoDeleted) {
          map.set(item.id, {
            ...existing,
            ...item,
            url: '',
            images: [],
            imagesData: [],
            fileDataUrl: '',
            photoDeleted: true
          });
          continue;
        }

        const serverTime = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
        const localTime = item.updatedAt ? new Date(item.updatedAt).getTime() : 0;

        // If local is strictly newer (edited offline on this device just now):
        if (localTime > serverTime && localTime > 0) {
          map.set(item.id, {
            ...existing,
            ...item,
            fileDataUrl: item.fileDataUrl || existing.fileDataUrl,
            imagesData: (Array.isArray(item.imagesData) && item.imagesData.length > 0) ? item.imagesData : existing.imagesData,
            images: (Array.isArray(item.images) && item.images.length > 0) ? item.images : existing.images,
            photoDeleted: false,
            updatedAt: item.updatedAt
          });
        } else {
          // Server wins for metadata, but retain the richest genuine media representation if server is missing base64
          const resolvedImagesData = (Array.isArray(existing.imagesData) && existing.imagesData.length > 0)
            ? existing.imagesData
            : ((Array.isArray(item.imagesData) && item.imagesData.length > 0) ? item.imagesData : []);

          const resolvedImages = (Array.isArray(existing.images) && existing.images.length > 0)
            ? existing.images
            : ((Array.isArray(item.images) && item.images.length > 0) ? item.images : []);

          const resolvedFileDataUrl = existing.fileDataUrl || item.fileDataUrl || '';
          const resolvedUrl = existing.photoDeleted
            ? ''
            : (existing.url || item.url || (resolvedImages.length > 0 ? resolvedImages[0] : (resolvedImagesData.length > 0 ? resolvedImagesData[0] : '')));

          map.set(item.id, {
            ...item,
            ...existing,
            url: resolvedUrl,
            fileDataUrl: existing.photoDeleted ? '' : resolvedFileDataUrl,
            imagesData: existing.photoDeleted ? [] : resolvedImagesData,
            images: existing.photoDeleted ? [] : resolvedImages,
            photoDeleted: existing.photoDeleted
          });
        }
      } else if (isCustomOrUserItem) {
        // Keep user-created/custom resource safe
        map.set(item.id, { ...item, isCustom: true });
      }
    }
  }

  // Final check: eliminate any item that is in deletedSet
  return Array.from(map.values()).filter(item => {
    if (!item || !item.id) return false;
    return !deletedSet.has(item.id);
  });
}

/**
 * Triple-strategy server resource fetching:
 * Strategy 1: Direct Cloud Firestore Database (Cross-device, real-time, zero loss)
 * Strategy 2: Dynamic Express endpoint (/api/education/resources)
 * Strategy 3: Direct static JSON file fallback (/education_resources.json)
 * This guarantees devices ALWAYS receive synced resources in any browser, phone, PC or network condition.
 */
export async function fetchServerResources(): Promise<{ resources: any[]; deletedIds: string[] }> {
  const mergedMap = new Map<string, any>();
  const combinedDeleted = new Set<string>();

  const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);

  // Strategy 1: Dynamic API endpoint (fastest, pre-aggregated with server-side Firestore cache)
  const fetchApi = async (): Promise<{ resources: any[]; deletedIds?: string[] } | null> => {
    try {
      const res = await fetch(`/api/education/resources?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'x-client-app': 'anestesiapro'
        }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[EducationStorage] API fetch notice:', e);
    }
    return null;
  };

  // Strategy 2: Direct Cloud Firestore with 2.5s timeout safeguard
  const fetchCloud = async (): Promise<{ resources: CloudResourceRecord[]; deletedIds: string[] } | null> => {
    try {
      return await getCloudResources();
    } catch (cloudErr) {
      console.warn('[EducationStorage] Cloud Firestore fetch note:', cloudErr);
      return null;
    }
  };

  // Strategy 3: Direct static JSON fallback
  const fetchStatic = async (): Promise<{ resources?: any[]; deletedIds?: string[] } | null> => {
    try {
      const staticRes = await fetch(`/education_resources.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (staticRes.ok) {
        const staticData = await staticRes.json();
        let deleted: string[] = [];
        try {
          const delRes = await fetch(`/deleted_resource_ids.json?t=${Date.now()}`, { cache: 'no-store' });
          if (delRes.ok) {
            const delData = await delRes.json();
            if (Array.isArray(delData)) deleted = delData;
          }
        } catch {}
        return { resources: staticData, deletedIds: deleted };
      }
    } catch (e) {}
    return null;
  };

  // Run in parallel with strict timeout limits (Express API is primary and fastest, <100ms)
  const [apiRes, cloudRes, staticRes] = await Promise.allSettled([
    withTimeout(fetchApi(), 2500, null),
    withTimeout(fetchCloud(), 1200, null),
    withTimeout(fetchStatic(), 2000, null)
  ]);

  const protectedSet = new Set<string>(PROTECTED_RESOURCE_IDS);

  // Merge results
  const addResources = (list: any[], dels: string[] = []) => {
    if (Array.isArray(dels)) {
      dels.forEach(d => {
        if (d && !protectedSet.has(d)) {
          combinedDeleted.add(d);
        }
      });
    }
    if (Array.isArray(list)) {
      list.forEach(item => {
        const sanitized = sanitizeResource(item);
        if (sanitized && sanitized.id && (!combinedDeleted.has(sanitized.id) || protectedSet.has(sanitized.id))) {
          const existing = mergedMap.get(sanitized.id);
          if (!existing) {
            mergedMap.set(sanitized.id, sanitized);
          } else {
            mergedMap.set(sanitized.id, {
              ...sanitized,
              ...existing,
              images: (existing.images && existing.images.length > 0) ? existing.images : sanitized.images,
              imagesData: (existing.imagesData && existing.imagesData.length > 0) ? existing.imagesData : sanitized.imagesData,
              fileDataUrl: existing.fileDataUrl || sanitized.fileDataUrl
            });
          }
        }
      });
    }
  };

  if (apiRes.status === 'fulfilled' && apiRes.value && Array.isArray(apiRes.value.resources)) {
    addResources(apiRes.value.resources, apiRes.value.deletedIds || []);
  }
  if (cloudRes.status === 'fulfilled' && cloudRes.value && Array.isArray(cloudRes.value.resources)) {
    addResources(cloudRes.value.resources, cloudRes.value.deletedIds || []);
  }
  if (staticRes.status === 'fulfilled' && staticRes.value && Array.isArray(staticRes.value.resources)) {
    addResources(staticRes.value.resources, staticRes.value.deletedIds || []);
  }

  const finalResources = Array.from(mergedMap.values()).filter(r => !combinedDeleted.has(r.id) || protectedSet.has(r.id));
  return { 
    resources: finalResources, 
    deletedIds: Array.from(combinedDeleted).filter(id => !protectedSet.has(id)) 
  };
}

let lastSyncTimestamp = 0;

/**
 * Full bidirectional synchronization with the server:
 * 1. Reads local stored resources from IndexedDB & LocalStorage
 * 2. Fetches authoritative cloud resources via dual strategy (API + Static JSON fallback)
 * 3. Merges them with baseline and remoteDeletedIds filters
 * 4. Pushes any local custom resources to server automatically
 * 5. Persists merged result to IndexedDB & LocalStorage
 * 6. Broadcasts global update event
 */
export async function syncEducationResourcesWithServer(isAdmin: boolean = false, force: boolean = false): Promise<any[]> {
  const now = Date.now();
  if (!force && now - lastSyncTimestamp < 2000) {
    return loadStoredResources();
  }
  lastSyncTimestamp = now;

  try {
    const local = await loadStoredResources();
    const { resources: serverResources, deletedIds: remoteDeletedIds } = await fetchServerResources();

    if (remoteDeletedIds.length > 0) {
      for (const did of remoteDeletedIds) {
        markResourceAsDeleted(did);
      }
    }

    // Merge baseline, local, and server
    const merged = mergeResources(INITIAL_RESOURCES, local, serverResources, remoteDeletedIds);

    // Push any local custom resources that are pending upload (offline created) or strictly newer
    const deletedIds = getDeletedResourceIds();
    const serverMap = new Map(serverResources.map(s => [s.id, s]));
    const builtinIds = new Set(INITIAL_RESOURCES.map(b => b.id));
    
    const localToPush = merged.filter(m => {
      if (!m || !m.id || deletedIds.includes(m.id)) return false;
      const isCustomItem = Boolean(m.isCustom || m.isCommunity || !builtinIds.has(m.id));
      if (!isCustomItem) return false;
      const srv = serverMap.get(m.id);
      if (!srv) return true; // Missing on server, push it!
      const srvTime = srv.updatedAt ? new Date(srv.updatedAt).getTime() : 0;
      const locTime = m.updatedAt ? new Date(m.updatedAt).getTime() : 0;
      return locTime > srvTime;
    });

    if (localToPush.length > 0) {
      // Direct Cloud Firestore batch sync (zero lag, guaranteed cross-device persistence)
      try {
        batchSaveCloudResources(localToPush);
      } catch (cloudBatchErr) {
        console.warn('[EducationStorage] Cloud Firestore batch save error:', cloudBatchErr);
      }

      for (const singleItem of localToPush) {
        try {
          const itemPayload = { ...singleItem };
          delete itemPayload.pendingUpload;
          const pushRes = await fetch('/api/education/resources', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-author-pin': '2534',
              'x-client-app': 'anestesiapro'
            },
            body: JSON.stringify({
              resources: [itemPayload],
              isSync: true
            })
          });
          if (pushRes.ok) {
            singleItem.pendingUpload = false;
          }
        } catch (pushErr) {
          console.warn('[EducationStorage] Auto background sync push notice for item:', singleItem.id, pushErr);
        }
      }
    }

    // Persist locally in IndexedDB and LocalStorage (also purges tombstones)
    await persistResources(merged);

    // Notify components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: merged }));
    }

    return merged;
  } catch (err) {
    console.error('[EducationStorage] Sync error, returning local resources:', err);
    return loadStoredResources();
  }
}

/**
 * AnestesiaPro - Robust Educational Resources Storage & Sync Engine
 * Uses IndexedDB as primary client store (handles large images & PDFs without 5MB quota crashes)
 * with transparent localStorage backup and server API sync.
 */

const DB_NAME = 'AnestesiaPro_EducationDB';
const DB_VERSION = 1;
const STORE_NAME = 'resources';
const PRIMARY_LOCAL_KEY = 'anestesiapro_education_resources_v2026_stable';
const LEGACY_KEYS = [
  'anestesiapro_education_resources_v2026_eras',
  'anestesiapro_education_resources_v16',
  'anestesiapro_education_resources_v15',
  'anestesiapro_education_resources_v14',
  'anestesiapro_education_resources'
];

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
 * Save an array of resources into IndexedDB and localStorage
 */
export async function persistResources(resources: any[]): Promise<boolean> {
  if (!Array.isArray(resources)) return false;

  // 1. Save to IndexedDB
  try {
    const db = await openDB();
    if (db) {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      // Clear old & put all current items
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => {
          let count = 0;
          if (resources.length === 0) return resolve();
          for (const item of resources) {
            const putReq = store.put(item);
            putReq.onsuccess = () => {
              count++;
              if (count === resources.length) resolve();
            };
            putReq.onerror = () => resolve(); // continue on single item error
          }
        };
        clearReq.onerror = reject;
      });
    }
  } catch (err) {
    console.warn('[EducationStorage] IndexedDB write failed:', err);
  }

  // 2. Save metadata to localStorage (strip heavy base64 if quota is reached)
  try {
    localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(resources));
    // Also keep legacy primary key synced for backwards compatibility
    localStorage.setItem('anestesiapro_education_resources_v2026_eras', JSON.stringify(resources));
    return true;
  } catch (err: any) {
    console.warn('[EducationStorage] LocalStorage quota exceeded, storing lightweight representation:', err);
    try {
      // Strip heavy fileDataUrl for localStorage fallback
      const lightweight = resources.map(r => {
        if (r.fileDataUrl && r.fileDataUrl.length > 50000) {
          const { fileDataUrl, ...rest } = r;
          return { ...rest, hasFileDataInIndexedDB: true };
        }
        return r;
      });
      localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(lightweight));
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

      if (items && items.length > 0) {
        return items;
      }
    }
  } catch (e) {
    console.warn('[EducationStorage] IndexedDB read error:', e);
  }

  // 2. Check primary localStorage key
  try {
    const primaryData = localStorage.getItem(PRIMARY_LOCAL_KEY);
    if (primaryData) {
      const parsed = JSON.parse(primaryData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync into IndexedDB in background
        persistResources(parsed).catch(() => {});
        return parsed;
      }
    }
  } catch (e) {}

  // 3. Scan and migrate legacy keys
  for (const key of LEGACY_KEYS) {
    try {
      const legacyData = localStorage.getItem(key);
      if (legacyData) {
        const parsed = JSON.parse(legacyData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log(`[EducationStorage] Migrated ${parsed.length} resources from legacy key ${key}`);
          persistResources(parsed).catch(() => {});
          return parsed;
        }
      }
    } catch (e) {}
  }

  return [];
}

/**
 * Merge newly fetched server resources with locally saved items
 * Ensures custom uploads (like Ciprofol or carousels) are never overwritten or deleted
 */
export function mergeResources(builtin: any[], local: any[], server: any[]): any[] {
  const map = new Map<string, any>();

  // 1. Built-in first
  for (const item of builtin) {
    if (item && item.id) map.set(item.id, item);
  }

  // 2. Server items
  if (Array.isArray(server)) {
    for (const item of server) {
      if (item && item.id) {
        // If it's a built-in item, let built-in with rich visualizers take precedence
        if (!map.has(item.id) || item.isUserUpload || item.isCustomUpload) {
          map.set(item.id, { ...map.get(item.id), ...item });
        }
      }
    }
  }

  // 3. Local items take highest precedence for user custom uploads
  if (Array.isArray(local)) {
    for (const item of local) {
      if (item && item.id) {
        const existing = map.get(item.id);
        if (existing) {
          // Merge preserving local data URLs if server returned relative paths
          map.set(item.id, { ...existing, ...item });
        } else {
          map.set(item.id, item);
        }
      }
    }
  }

  return Array.from(map.values());
}

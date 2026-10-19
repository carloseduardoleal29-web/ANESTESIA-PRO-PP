/**
 * Firebase Firestore Cloud Service for AnestesiaPro Education Resources & Realtime Sync
 * Guarantees cross-device, cross-browser real-time synchronization with zero loss.
 * Handles automatic chunking for large files/carousels to safely bypass Firestore document limits.
 */

import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  deleteDoc, 
  onSnapshot,
  writeBatch
} from './firebase';

const COLLECTION_NAME = 'education_resources';
const APP_META_COLLECTION = 'app_meta';
const TOMBSTONES_DOC = 'deleted_resources';
const NOTIFICATIONS_COLLECTION = 'notifications';

// 350 KB safe chunk threshold for Firestore (limit is 1 MiB)
const CHUNK_CHAR_LIMIT = 350000;
const MAX_INLINE_MEDIA_SIZE = 400000; // ~400 KB base64

export interface CloudResourceRecord {
  id: string;
  title: string;
  category: string;
  description?: string;
  date?: string;
  author?: string;
  url?: string;
  fileName?: string;
  fileSize?: string;
  fileExtension?: string;
  fileType?: string;
  fileDataUrl?: string; // High-res compressed base64 or storage url
  tags?: string[];
  instagramUrl?: string;
  videoUrl?: string;
  downloadable?: boolean;
  isCommunity?: boolean;
  isCustom?: boolean;
  images?: string[];
  imagesData?: string[];
  isCarousel?: boolean;
  imageCaptions?: string[];
  createdAt?: string;
  updatedAt?: string;
  photoDeleted?: boolean;
  hasMediaChunks?: boolean;
  hasCarouselSlides?: boolean;
  mediaChunksCount?: number;
}

/**
 * Clean object before saving to Firestore (removes undefined values which Firestore rejects)
 */
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(cleanForFirestore);
  }
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = cleanForFirestore(value);
      }
    }
    return clean;
  }
  return obj;
}

/**
 * Save large file data URL as subcollection chunks
 */
async function saveMediaChunks(resourceId: string, fullDataUrl: string): Promise<number> {
  const chunksCol = collection(db, COLLECTION_NAME, resourceId, 'media_chunks');
  const totalChunks = Math.ceil(fullDataUrl.length / CHUNK_CHAR_LIMIT);
  
  for (let i = 0; i < totalChunks; i++) {
    const chunkStr = fullDataUrl.substring(i * CHUNK_CHAR_LIMIT, (i + 1) * CHUNK_CHAR_LIMIT);
    const chunkRef = doc(chunksCol, `chunk_${i}`);
    await setDoc(chunkRef, {
      index: i,
      totalChunks,
      data: chunkStr,
      updatedAt: new Date().toISOString()
    });
  }
  return totalChunks;
}

/**
 * Load and reassemble media chunks from subcollection
 */
async function loadMediaChunks(resourceId: string): Promise<string | null> {
  try {
    const chunksCol = collection(db, COLLECTION_NAME, resourceId, 'media_chunks');
    const snapshot = await getDocs(chunksCol);
    if (snapshot.empty) return null;

    const parts: { index: number; data: string }[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (typeof data.index === 'number' && typeof data.data === 'string') {
        parts.push({ index: data.index, data: data.data });
      }
    });

    parts.sort((a, b) => a.index - b.index);
    return parts.map(p => p.data).join('');
  } catch (err) {
    console.warn(`[Firestore] Error loading media chunks for ${resourceId}:`, err);
    return null;
  }
}

/**
 * Save carousel slides as individual subcollection docs
 */
async function saveCarouselSlides(
  resourceId: string, 
  images: string[], 
  imagesData?: string[], 
  captions?: string[]
): Promise<number> {
  const slidesCol = collection(db, COLLECTION_NAME, resourceId, 'carousel_slides');
  const count = Math.max(images.length, (imagesData?.length || 0));
  
  for (let i = 0; i < count; i++) {
    const slideRef = doc(slidesCol, `slide_${i}`);
    const imgUrl = images[i] || '';
    const imgData = (imagesData && imagesData[i] && imagesData[i].startsWith('data:'))
      ? imagesData[i]
      : (imgUrl.startsWith('data:') ? imgUrl : '');

    const slideData: Record<string, any> = {
      index: i,
      imageUrl: imgUrl || imgData,
      caption: (captions && captions[i]) || `Lámina ${i + 1}`,
      updatedAt: new Date().toISOString()
    };
    if (imgData) {
      slideData.imageData = imgData;
    }
    await setDoc(slideRef, slideData);
  }
  return count;
}

/**
 * Load carousel slides from subcollection
 */
async function loadCarouselSlides(
  resourceId: string
): Promise<{ images: string[]; imagesData: string[]; captions: string[] } | null> {
  try {
    const slidesCol = collection(db, COLLECTION_NAME, resourceId, 'carousel_slides');
    const snapshot = await getDocs(slidesCol);
    if (snapshot.empty) return null;

    const slides: { index: number; imageUrl: string; imageData?: string; caption?: string }[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      if (typeof data.index === 'number') {
        slides.push({
          index: data.index,
          imageUrl: data.imageUrl || '',
          imageData: data.imageData || '',
          caption: data.caption || ''
        });
      }
    });

    slides.sort((a, b) => a.index - b.index);
    return {
      images: slides.map(s => {
        if (s.imageData && s.imageData.startsWith('data:')) return s.imageData;
        if (s.imageUrl) return s.imageUrl;
        return s.imageData || '';
      }),
      imagesData: slides.map(s => {
        if (s.imageData && s.imageData.startsWith('data:')) return s.imageData;
        if (s.imageUrl && s.imageUrl.startsWith('data:')) return s.imageUrl;
        return s.imageData || s.imageUrl || '';
      }).filter(Boolean),
      captions: slides.map(s => s.caption || '')
    };
  } catch (err) {
    console.warn(`[Firestore] Error loading carousel slides for ${resourceId}:`, err);
    return null;
  }
}

/**
 * Save or update a single resource directly into Cloud Firestore.
 * Automatically chunks large base64 media and carousels so writes NEVER fail.
 */
export async function saveCloudResource(resource: CloudResourceRecord): Promise<boolean> {
  if (!resource || !resource.id) return false;
  try {
    const docRef = doc(db, COLLECTION_NAME, resource.id);
    let payload: CloudResourceRecord = {
      ...resource,
      updatedAt: resource.updatedAt || new Date().toISOString()
    };

    let hasMediaChunks = false;
    let hasCarouselSlides = false;
    let mediaChunksCount = 0;

    // Handle large single file (PDF, video, heavy photo)
    if (payload.fileDataUrl && payload.fileDataUrl.length > MAX_INLINE_MEDIA_SIZE) {
      try {
        mediaChunksCount = await saveMediaChunks(payload.id, payload.fileDataUrl);
        hasMediaChunks = true;
        // Keep a small cover or placeholder in fileDataUrl for the main doc to stay well under 1MB
        payload.hasMediaChunks = true;
        payload.mediaChunksCount = mediaChunksCount;
        // If it's an image, we can keep the url; strip the multi-megabyte string from main doc
        payload.fileDataUrl = payload.url || '';
      } catch (chunkErr) {
        console.warn(`[Firestore] Warning saving media chunks for ${resource.id}:`, chunkErr);
      }
    }

    // Handle multi-image carousels
    if (
      payload.isCarousel || 
      (Array.isArray(payload.images) && payload.images.length > 1) ||
      (Array.isArray(payload.imagesData) && payload.imagesData.length > 1)
    ) {
      try {
        const rawImages = payload.images || [];
        const rawImagesData = payload.imagesData || [];
        const captions = payload.imageCaptions || [];
        
        await saveCarouselSlides(payload.id, rawImages, rawImagesData, captions);
        hasCarouselSlides = true;
        payload.hasCarouselSlides = true;

        // Keep first slide on main doc for instant cover card preview with genuine base64 data
        const firstData = (rawImagesData[0] && rawImagesData[0].startsWith('data:')) 
          ? rawImagesData[0] 
          : (rawImages[0]?.startsWith('data:') ? rawImages[0] : '');
        const firstUrl = rawImages[0] || firstData || '';

        payload.images = firstUrl ? [firstUrl] : [];
        payload.imagesData = firstData ? [firstData] : [];
        if (!payload.url && firstUrl) {
          payload.url = firstUrl;
        }
        if (!payload.fileDataUrl && firstData) {
          payload.fileDataUrl = firstData;
        }
      } catch (slideErr) {
        console.warn(`[Firestore] Warning saving carousel slides for ${resource.id}:`, slideErr);
      }
    }

    const cleanedPayload = cleanForFirestore({
      ...payload,
      hasMediaChunks,
      hasCarouselSlides,
      mediaChunksCount
    });

    await setDoc(docRef, cleanedPayload, { merge: true });
    console.log(`[Firestore] Successfully saved cloud resource: ${resource.id} (${resource.title})`);
    return true;
  } catch (error) {
    console.error('[Firestore] saveCloudResource error:', error);
    return false;
  }
}

/**
 * Batch save multiple resources into Cloud Firestore
 */
export async function batchSaveCloudResources(resources: CloudResourceRecord[]): Promise<boolean> {
  if (!Array.isArray(resources) || resources.length === 0) return true;
  let allSuccess = true;
  for (const res of resources) {
    if (!res || !res.id) continue;
    const ok = await saveCloudResource(res);
    if (!ok) allSuccess = false;
  }
  return allSuccess;
}

/**
 * Fetch all resources stored in Cloud Firestore, automatically assembling chunked media
 */
export async function getCloudResources(): Promise<{ resources: CloudResourceRecord[]; deletedIds: string[] }> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const rawList: CloudResourceRecord[] = [];
    
    snapshot.forEach((d) => {
      const data = d.data() as CloudResourceRecord;
      if (data && (data.id || d.id)) {
        rawList.push({ ...data, id: data.id || d.id });
      }
    });

    // Also get tombstones
    let deletedIds: string[] = [];
    try {
      const tombstonesRef = doc(db, APP_META_COLLECTION, TOMBSTONES_DOC);
      const tombstoneSnap = await getDoc(tombstonesRef);
      if (tombstoneSnap.exists()) {
        const data = tombstoneSnap.data();
        if (Array.isArray(data?.ids)) {
          deletedIds = data.ids;
        }
      }
    } catch (e) {
      console.warn('[Firestore] Error reading tombstones doc:', e);
    }

    const filtered = rawList.filter(item => !deletedIds.includes(item.id));

    // Hydrate any items that have subcollection chunks or carousel slides
    const hydratedList = await Promise.all(
      filtered.map(async (item) => {
        let hydrated = { ...item };
        try {
          if (item.hasCarouselSlides) {
            const slidesData = await loadCarouselSlides(item.id);
            if (slidesData && slidesData.images.length > 0) {
              hydrated.images = slidesData.images;
              if (slidesData.imagesData.length > 0) {
                hydrated.imagesData = slidesData.imagesData;
              }
              if (slidesData.captions.length > 0) {
                hydrated.imageCaptions = slidesData.captions;
              }
              if (!hydrated.url && slidesData.images[0]) {
                hydrated.url = slidesData.images[0];
              }
            }
          }

          if (item.hasMediaChunks) {
            const fullMedia = await loadMediaChunks(item.id);
            if (fullMedia) {
              hydrated.fileDataUrl = fullMedia;
              if (!hydrated.url) {
                hydrated.url = fullMedia;
              }
            }
          }
        } catch (hErr) {
          console.warn(`[Firestore] Notice hydrating resource ${item.id}:`, hErr);
        }
        return hydrated;
      })
    );

    return { resources: hydratedList, deletedIds };
  } catch (error) {
    console.warn('[Firestore] getCloudResources notice:', error);
    return { resources: [], deletedIds: [] };
  }
}

/**
 * Delete a resource from Cloud Firestore and record its tombstone
 */
export async function deleteCloudResource(resourceId: string): Promise<boolean> {
  if (!resourceId) return false;
  try {
    const docRef = doc(db, COLLECTION_NAME, resourceId);
    await deleteDoc(docRef);

    // Delete subcollections if any
    try {
      const chunksCol = collection(db, COLLECTION_NAME, resourceId, 'media_chunks');
      const chunkDocs = await getDocs(chunksCol);
      chunkDocs.forEach(async (cd) => {
        try { await deleteDoc(cd.ref); } catch {}
      });

      const slidesCol = collection(db, COLLECTION_NAME, resourceId, 'carousel_slides');
      const slideDocs = await getDocs(slidesCol);
      slideDocs.forEach(async (sd) => {
        try { await deleteDoc(sd.ref); } catch {}
      });
    } catch (subErr) {
      console.warn('[Firestore] Notice cleaning subcollections:', subErr);
    }

    // Record tombstone in cloud
    try {
      const tombstonesRef = doc(db, APP_META_COLLECTION, TOMBSTONES_DOC);
      const tombSnap = await getDoc(tombstonesRef);
      const existingIds: string[] = tombSnap.exists() && Array.isArray(tombSnap.data()?.ids) 
        ? tombSnap.data()!.ids 
        : [];
      if (!existingIds.includes(resourceId)) {
        await setDoc(tombstonesRef, { ids: [...existingIds, resourceId], updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (tombErr) {
      console.warn('[Firestore] Error saving tombstone:', tombErr);
    }

    console.log(`[Firestore] Successfully deleted cloud resource: ${resourceId}`);
    return true;
  } catch (error) {
    console.error('[Firestore] deleteCloudResource error:', error);
    return false;
  }
}

/**
 * Subscribe to real-time updates from Cloud Firestore.
 * Any device, browser, PC or phone will receive instant updates the millisecond a resource is saved or deleted!
 */
export function subscribeToCloudResources(
  onUpdate: (resources: CloudResourceRecord[]) => void,
  onError?: (error: any) => void
): () => void {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const hydrationCache = new Map<string, { updatedAt: string; data: CloudResourceRecord }>();

    const unsubscribe = onSnapshot(
      colRef,
      async (snapshot) => {
        try {
          const rawItems: CloudResourceRecord[] = [];
          snapshot.forEach((d) => {
            const item = d.data() as CloudResourceRecord;
            if (item && (item.id || d.id)) {
              rawItems.push({ ...item, id: item.id || d.id });
            }
          });

          // Fetch tombstones
          let deletedIds: string[] = [];
          try {
            const tombstonesRef = doc(db, APP_META_COLLECTION, TOMBSTONES_DOC);
            const tombSnap = await getDoc(tombstonesRef);
            if (tombSnap.exists()) {
              const data = tombSnap.data();
              if (Array.isArray(data?.ids)) {
                deletedIds = data.ids;
              }
            }
          } catch {}

          const filtered = rawItems.filter(item => !deletedIds.includes(item.id));

          // Hydrate with cache
          const hydratedList = await Promise.all(
            filtered.map(async (item) => {
              const cacheKey = item.id;
              const cached = hydrationCache.get(cacheKey);
              if (cached && cached.updatedAt === item.updatedAt) {
                return cached.data;
              }

              let hydrated = { ...item };
              if (item.hasCarouselSlides) {
                const slidesData = await loadCarouselSlides(item.id);
                if (slidesData && slidesData.images.length > 0) {
                  hydrated.images = slidesData.images;
                  if (slidesData.imagesData.length > 0) {
                    hydrated.imagesData = slidesData.imagesData;
                  }
                  if (slidesData.captions.length > 0) {
                    hydrated.imageCaptions = slidesData.captions;
                  }
                  if (!hydrated.url && slidesData.images[0]) {
                    hydrated.url = slidesData.images[0];
                  }
                }
              }

              if (item.hasMediaChunks) {
                const fullMedia = await loadMediaChunks(item.id);
                if (fullMedia) {
                  hydrated.fileDataUrl = fullMedia;
                  if (!hydrated.url) {
                    hydrated.url = fullMedia;
                  }
                }
              }

              hydrationCache.set(cacheKey, { updatedAt: item.updatedAt || '', data: hydrated });
              return hydrated;
            })
          );

          onUpdate(hydratedList);
        } catch (procErr) {
          console.warn('[Firestore] Error processing snapshot in realtime:', procErr);
        }
      },
      (err) => {
        console.warn('[Firestore] onSnapshot error:', err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[Firestore] subscription setup failed:', err);
    return () => {};
  }
}

/**
 * Ensure Firestore has baseline resources if completely empty
 */
export async function seedInitialResourcesToFirestore(baselineResources: CloudResourceRecord[]): Promise<void> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty && baselineResources && baselineResources.length > 0) {
      console.log(`[Firestore] Seeding ${baselineResources.length} baseline resources to Firestore cloud...`);
      for (const res of baselineResources) {
        if (res && res.id) {
          await saveCloudResource(res);
        }
      }
    }
  } catch (err) {
    console.warn('[Firestore] Notice seeding baseline resources:', err);
  }
}

/**
 * Save an app notification directly to Cloud Firestore so all user devices receive the alert
 */
export async function saveCloudNotification(notification: {
  id: string;
  title: string;
  message: string;
  date?: string;
  badge?: string;
  resourceId?: string;
  author?: string;
}): Promise<boolean> {
  if (!notification || !notification.id) return false;
  try {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
    await setDoc(notifRef, cleanForFirestore({
      ...notification,
      updatedAt: new Date().toISOString()
    }), { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Error saving cloud notification:', err);
    return false;
  }
}

/**
 * Subscribe to real-time notifications from Cloud Firestore
 */
export function subscribeToCloudNotifications(
  onUpdate: (notifications: any[]) => void
): () => void {
  try {
    const colRef = collection(db, NOTIFICATIONS_COLLECTION);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const notifs: any[] = [];
        snapshot.forEach((d) => {
          const item = d.data();
          if (item && (item.id || d.id)) {
            notifs.push({ ...item, id: item.id || d.id });
          }
        });
        onUpdate(notifs);
      },
      (err) => {
        console.warn('[Firestore] Notifications onSnapshot notice:', err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[Firestore] Notifications subscription setup notice:', err);
    return () => {};
  }
}

/**
 * Save global stats to Cloud Firestore
 */
export async function saveCloudStats(stats: any): Promise<boolean> {
  if (!stats) return false;
  try {
    const statsRef = doc(db, APP_META_COLLECTION, 'global_stats');
    await setDoc(statsRef, cleanForFirestore({
      ...stats,
      updatedAt: new Date().toISOString()
    }), { merge: true });
    return true;
  } catch (err) {
    console.warn('[Firestore] Error saving stats to cloud:', err);
    return false;
  }
}

/**
 * Fetch global stats from Cloud Firestore
 */
export async function getCloudStats(): Promise<any | null> {
  try {
    const statsRef = doc(db, APP_META_COLLECTION, 'global_stats');
    const snap = await getDoc(statsRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[Firestore] Error fetching stats from cloud:', err);
  }
  return null;
}

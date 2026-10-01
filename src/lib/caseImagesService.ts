// Service for managing custom clinical case images in AnestesiaPro
// Allows Dr. Carlos Leal (Admin) to upload, replace, or hide images per case

export interface CustomCaseImage {
  imageUrl?: string;
  type?: string;
  title?: string;
  badge?: string;
  description?: string;
  hideImage?: boolean; // When true, case deliberately has NO image
  updatedAt?: string;
}

const STORAGE_KEY = 'anestesiapro_case_custom_images';

// In-memory cache
let cachedImages: Record<string, CustomCaseImage> = {};
let hasLoadedFromApi = false;

// Initialize cache from localStorage
try {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    cachedImages = JSON.parse(local);
  }
} catch (e) {
  console.warn('[CaseImagesService] LocalStorage read warning:', e);
}

export async function fetchCustomCaseImages(): Promise<Record<string, CustomCaseImage>> {
  try {
    const res = await fetch('/api/case-images', { credentials: 'same-origin' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.images) {
        cachedImages = data.images;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedImages));
        } catch {}
        hasLoadedFromApi = true;
        return cachedImages;
      }
    }
  } catch (e) {
    console.warn('[CaseImagesService] API fetch warning (using local fallback):', e);
  }
  return cachedImages;
}

export function getCustomCaseImageSync(caseId: string): CustomCaseImage | undefined {
  return cachedImages[caseId];
}

export function getCustomCaseImage(caseId: string): CustomCaseImage | undefined {
  return cachedImages[caseId];
}

export function getAllCustomCaseImagesSync(): Record<string, CustomCaseImage> {
  return cachedImages;
}

export async function getAllCustomCaseImages(): Promise<Record<string, CustomCaseImage>> {
  return await fetchCustomCaseImages();
}

export async function saveCustomCaseImage(
  caseId: string, 
  config: CustomCaseImage | null
): Promise<boolean> {
  // Update local cache immediately
  if (config === null) {
    delete cachedImages[caseId];
  } else {
    cachedImages[caseId] = {
      ...cachedImages[caseId],
      ...config,
      updatedAt: new Date().toISOString()
    };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedImages));
  } catch (e) {
    console.warn('[CaseImagesService] LocalStorage write error:', e);
  }

  // Notify listeners via custom event
  try {
    window.dispatchEvent(new CustomEvent('anestesiapro-case-images-updated', {
      detail: { caseId, config }
    }));
  } catch {}

  // Persist to server
  try {
    const res = await fetch('/api/case-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, imageConfig: config })
    });
    return res.ok;
  } catch (e) {
    console.warn('[CaseImagesService] Server save warning (saved locally):', e);
    return true; // Still true because saved locally
  }
}

// Helper to trigger browser download of image
export async function downloadCaseImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'caso_clinico_imagen.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (e) {
    // Fallback: direct window open/download link
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = filename || 'imagen_caso.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

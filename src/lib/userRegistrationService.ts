import { RegisteredUser, ElitePlanConfig, RegistrationStatsSummary } from '../types/user';
import { db, doc, setDoc, getDocs, collection, deleteDoc, getDoc, serverTimestamp } from './firebase';

export type { RegisteredUser, ElitePlanConfig, RegistrationStatsSummary };

const USER_STORAGE_KEY = 'anestesiapro_registered_user';
const USER_PROMPT_DISMISSED_KEY = 'anestesiapro_user_reg_dismissed_v1';

// Available countries with medical flags for convenient selection
export const SUPPORTED_COUNTRIES = [
  { code: 'VE', name: 'Venezuela', label: '🇻🇪 Venezuela', phoneCode: '+58' },
  { code: 'CO', name: 'Colombia', label: '🇨🇴 Colombia', phoneCode: '+57' },
  { code: 'MX', name: 'México', label: '🇲🇽 México', phoneCode: '+52' },
  { code: 'ES', name: 'España', label: '🇪🇸 España', phoneCode: '+34' },
  { code: 'AR', name: 'Argentina', label: '🇦🇷 Argentina', phoneCode: '+54' },
  { code: 'CL', name: 'Chile', label: '🇨🇱 Chile', phoneCode: '+56' },
  { code: 'PE', name: 'Perú', label: '🇵🇪 Perú', phoneCode: '+51' },
  { code: 'EC', name: 'Ecuador', label: '🇪🇨 Ecuador', phoneCode: '+593' },
  { code: 'DO', name: 'República Dominicana', label: '🇩🇴 República Dominicana', phoneCode: '+1' },
  { code: 'PA', name: 'Panamá', label: '🇵🇦 Panamá', phoneCode: '+507' },
  { code: 'US', name: 'Estados Unidos', label: '🇺🇸 Estados Unidos', phoneCode: '+1' },
  { code: 'CR', name: 'Costa Rica', label: '🇨🇷 Costa Rica', phoneCode: '+506' },
  { code: 'GT', name: 'Guatemala', label: '🇬🇹 Guatemala', phoneCode: '+502' },
  { code: 'BO', name: 'Bolivia', label: '🇧🇴 Bolivia', phoneCode: '+591' },
  { code: 'UY', name: 'Uruguay', label: '🇺🇾 Uruguay', phoneCode: '+598' },
  { code: 'PY', name: 'Paraguay', label: '🇵🇾 Paraguay', phoneCode: '+595' },
  { code: 'HN', name: 'Honduras', label: '🇭🇳 Honduras', phoneCode: '+504' },
  { code: 'SV', name: 'El Salvador', label: '🇸🇻 El Salvador', phoneCode: '+503' },
  { code: 'NI', name: 'Nicaragua', label: '🇳🇮 Nicaragua', phoneCode: '+505' },
  { code: 'BR', name: 'Brasil', label: '🇧🇷 Brasil', phoneCode: '+55' },
  { code: 'OT', name: 'Otro País', label: '🌍 Otro País', phoneCode: '+' }
];

export const SPECIALTY_OPTIONS = [
  'Médico Especialista en Anestesiología y Reanimación',
  'Médico Residente de Anestesiología (R1 / R2 / R3)',
  'Médico Especialista en Medicina Crítica / UCI',
  'Médico Cirujano / Especialista Quirúrgico',
  'Médico General / Emergenciólogo',
  'Licenciado(a) en Enfermería de Anestesia / Quirófano',
  'Estudiante de Medicina / Pregrado',
  'Otro Profesional de la Salud'
];

const IDB_NAME = 'AnestesiaProUserDB_v2';
const IDB_STORE = 'user_profile_store';

function saveToIndexedDB(key: string, data: any): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve();
    try {
      const request = window.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(data, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function getFromIndexedDB(key: string): Promise<any> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    try {
      const request = window.indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      request.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const getReq = store.get(key);
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function setPermanentCookie(name: string, value: string, days = 3650): void {
  if (typeof document === 'undefined') return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

function getPermanentCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  } catch {
    return null;
  }
}

/**
 * Gets the current registered user profile saved in this device's storage
 */
export function getStoredUserProfile(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Primary: localStorage
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.fullName) return parsed as RegisteredUser;
    }

    // 2. Fallback: sessionStorage
    const rawSession = sessionStorage.getItem(USER_STORAGE_KEY);
    if (rawSession) {
      const parsed = JSON.parse(rawSession);
      if (parsed && typeof parsed === 'object' && parsed.fullName) {
        try { localStorage.setItem(USER_STORAGE_KEY, rawSession); } catch {}
        return parsed as RegisteredUser;
      }
    }

    // 3. Fallback: Permanent Cookie JSON
    const cookieJson = getPermanentCookie(USER_STORAGE_KEY);
    if (cookieJson) {
      try {
        const parsed = JSON.parse(cookieJson);
        if (parsed && typeof parsed === 'object' && parsed.fullName) {
          try { localStorage.setItem(USER_STORAGE_KEY, cookieJson); } catch {}
          return parsed as RegisteredUser;
        }
      } catch {}
    }

    // 4. Fallback: window.name backup
    if (window.name && window.name.includes('__anestesiapro_user__')) {
      try {
        const parsedWin = JSON.parse(window.name);
        if (parsedWin && parsedWin.__anestesiapro_user__ && parsedWin.__anestesiapro_user__.fullName) {
          const user = parsedWin.__anestesiapro_user__ as RegisteredUser;
          try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)); } catch {}
          return user;
        }
      } catch {}
    }

    // 5. Fallback: individual redundant keys
    const name = localStorage.getItem('anestesiapro_reg_user_name') || getPermanentCookie('anestesiapro_user_name');
    const email = localStorage.getItem('anestesiapro_reg_user_email') || getPermanentCookie('anestesiapro_user_email');
    if (name && email) {
      const rebuilt: RegisteredUser = {
        id: localStorage.getItem('anestesiapro_reg_user_id') || getPermanentCookie('anestesiapro_user_id') || `usr_${Date.now()}`,
        fullName: name,
        email: email,
        idNumber: localStorage.getItem('anestesiapro_reg_user_cedula') || getPermanentCookie('anestesiapro_user_cedula') || 'V-REGISTRADO',
        country: '🇻🇪 Venezuela',
        specialty: 'Médico Especialista en Anestesiología',
        registeredAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        elitePlan: { status: 'inactive', planType: 'standard', expiresAt: 'Plan Estándar Gratuito' }
      };
      try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(rebuilt)); } catch {}
      return rebuilt;
    }

    // 6. Check if author / admin mode is active (Dr. Carlos Leal)
    const isAuthorDetected = 
      localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
      localStorage.getItem('anestesiapro_author_admin') === 'true' ||
      localStorage.getItem('anestesiapro_pin_authorized') === 'true' ||
      localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
      sessionStorage.getItem('anestesiapro_author_session') === 'true' ||
      (typeof window !== 'undefined' && (
        window.location.search.includes('carlos=2534') ||
        window.location.search.includes('carlos=2026') ||
        window.location.search.includes('panel=2534')
      ));

    if (isAuthorDetected) {
      const authorProfile: RegisteredUser = {
        id: 'usr_carlos_leal_admin',
        fullName: 'Dr. Carlos Eduardo Leal',
        idNumber: 'V-15.489.288',
        email: 'carloseduardoleal29@gmail.com',
        country: '🇻🇪 Venezuela',
        specialty: 'Médico Especialista en Anestesiología y Reanimación',
        subspecialty: 'Anestesiología Cardiovascular y TIVA',
        workplace: 'Maracay, Edo. Aragua',
        phone: '+584243291438',
        medicalLicenseNumber: 'MPPS-84920',
        collegeRegistration: 'CM-4521',
        role: 'admin',
        isAdmin: true,
        registeredAt: '2026-10-01T00:00:00.000Z',
        lastActiveAt: new Date().toISOString(),
        device: 'Smartphone / Web (Autor y Fundador)',
        elitePlan: {
          status: 'active',
          planType: 'lifetime',
          activatedAt: '2026-10-01T00:00:00.000Z',
          expiresAt: 'Permanente (Autor y Fundador)'
        }
      };
      try { localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authorProfile)); } catch {}
      return authorProfile;
    }

    return null;
  } catch (e) {
    console.warn('[AnestesiaPro User] Error reading stored profile:', e);
    return null;
  }
}

/**
 * Saves or updates the registered user profile across ALL persistent storage layers
 * (LocalStorage, SessionStorage, IndexedDB, 10-year Cookies, and Window.Name)
 * so the device permanently remembers the user profile and NEVER prompts again.
 */
export function saveStoredUserProfile(user: RegisteredUser): void {
  if (typeof window === 'undefined') return;
  try {
    const json = JSON.stringify(user);
    // 1. Primary localStorage
    localStorage.setItem(USER_STORAGE_KEY, json);
    localStorage.setItem('anestesiapro_device_registered', 'true');
    localStorage.setItem('anestesiapro_user_registered_permanently', 'true');
    localStorage.setItem('anestesiapro_reg_user_name', user.fullName || '');
    localStorage.setItem('anestesiapro_reg_user_email', user.email || '');
    if (user.idNumber) localStorage.setItem('anestesiapro_reg_user_cedula', user.idNumber);
    if (user.id) localStorage.setItem('anestesiapro_reg_user_id', user.id);

    // 2. SessionStorage for current active session
    sessionStorage.setItem(USER_STORAGE_KEY, json);
    sessionStorage.setItem('anestesiapro_device_registered', 'true');

    // 3. Persistent 10-year Cookies (survives PWA cache flushes and iOS Safari resets)
    setPermanentCookie(USER_STORAGE_KEY, json);
    setPermanentCookie('anestesiapro_device_registered', 'true');
    setPermanentCookie('anestesiapro_user_name', user.fullName || '');
    setPermanentCookie('anestesiapro_user_email', user.email || '');
    if (user.idNumber) setPermanentCookie('anestesiapro_user_cedula', user.idNumber);
    if (user.id) setPermanentCookie('anestesiapro_user_id', user.id);

    // 4. IndexedDB async backup (deep browser storage)
    saveToIndexedDB(USER_STORAGE_KEY, user).catch(() => {});

    // 5. Window.Name session memory
    try {
      window.name = JSON.stringify({ __anestesiapro_user__: user });
    } catch {}

    // Also notify any listeners across the app
    window.dispatchEvent(new CustomEvent('anestesiapro_user_profile_updated', { detail: user }));
  } catch (e) {
    console.warn('[AnestesiaPro User] Error saving profile to storage:', e);
  }
}

/**
 * Asynchronously attempts to recover registration from IndexedDB, Cookies, or Server database
 * if local storage was cleared or evicted by the operating system.
 */
export async function autoRestoreRegistrationAsync(): Promise<RegisteredUser | null> {
  if (typeof window === 'undefined') return null;

  // 1. Check synchronous storage first
  const current = getStoredUserProfile();
  if (current && current.fullName && current.fullName.trim().length >= 3) {
    saveStoredUserProfile(current);
    syncLocalProfileToCloudFirestore(current).catch(() => {});
    return current;
  }

  // 2. Deep check in IndexedDB
  try {
    const idbProfile = await getFromIndexedDB(USER_STORAGE_KEY);
    if (idbProfile && idbProfile.fullName && (idbProfile.email || idbProfile.idNumber)) {
      saveStoredUserProfile(idbProfile as RegisteredUser);
      syncLocalProfileToCloudFirestore(idbProfile as RegisteredUser).catch(() => {});
      return idbProfile as RegisteredUser;
    }
  } catch {}

  // 3. Check Cookie / LocalStorage identifier against Server API
  try {
    const identifier = getPermanentCookie('anestesiapro_user_email') || 
                       getPermanentCookie('anestesiapro_user_cedula') ||
                       localStorage.getItem('anestesiapro_reg_user_email') ||
                       localStorage.getItem('anestesiapro_reg_user_cedula');

    if (identifier && identifier.trim().length >= 3) {
      const res = await fetch(`/api/users/status/${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();
      if (data.success && data.exists && data.user) {
        const restoredUser = data.user as RegisteredUser;
        saveStoredUserProfile(restoredUser);
        syncLocalProfileToCloudFirestore(restoredUser).catch(() => {});
        return restoredUser;
      }
    }
  } catch {}

  return null;
}

/**
 * Ensures any profile stored locally on the user's phone/PC is safely uploaded
 * to Google Cloud Firestore and server backups, recovering any trapped offline registrations.
 */
export async function syncLocalProfileToCloudFirestore(profile?: RegisteredUser | null): Promise<void> {
  const user = profile || getStoredUserProfile();
  if (!user || !user.fullName || !user.idNumber) return;

  try {
    const userId = user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const updatedUser: RegisteredUser = {
      ...user,
      id: userId,
      lastActiveAt: new Date().toISOString()
    };

    // 1. Upload to server backup first (reliable Express API)
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    }).catch(() => {});

    // 2. Upload directly to Cloud Firestore safely (registered_users & medicos_registrados)
    if (db) {
      try {
        const cleanPayload = JSON.parse(JSON.stringify(updatedUser));
        const docRef1 = doc(db, 'registered_users', userId);
        await setDoc(docRef1, cleanPayload, { merge: true });

        const medicoRecord = {
          id: userId,
          fullName: updatedUser.fullName,
          email: updatedUser.email || '',
          phone: updatedUser.phone || '',
          country: updatedUser.country || 'Venezuela',
          registeredAt: updatedUser.registeredAt || new Date().toISOString(),
          device: updatedUser.device || 'Dispositivo móvil',
          createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
        };
        const docRef2 = doc(db, 'medicos_registrados', userId);
        await setDoc(docRef2, medicoRecord, { merge: true });
      } catch (fbErr) {
        // Silent catch for Firestore quota limits
      }
    }
  } catch (err) {
    console.warn('[AnestesiaPro User] Background profile sync notice:', err);
  }
}

/**
 * Removes the stored user profile (e.g. on manual logout/reset)
 */
export function clearStoredUserProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem('anestesiapro_device_registered');
    localStorage.removeItem('anestesiapro_user_registered_permanently');
    sessionStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem('anestesiapro_device_registered');
    window.dispatchEvent(new CustomEvent('anestesiapro_user_profile_updated', { detail: null }));
  } catch (e) {}
}

/**
 * Checks whether this device has an active registered user.
 * Once registered, returns TRUE permanently so the user is NEVER asked again.
 */
export function isUserRegistered(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. Author & Superadmin permanent bypass (Dr. Carlos Leal)
  if (
    localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
    localStorage.getItem('anestesiapro_author_admin') === 'true' ||
    localStorage.getItem('anestesiapro_pin_authorized') === 'true' ||
    sessionStorage.getItem('anestesiapro_author_session') === 'true' ||
    (window as any).__ANESTESIAPRO_IS_ADMIN__ === true
  ) {
    return true;
  }

  // 2. Strict check: Must have a legitimate stored medical user profile with full name and identifier
  const profile = getStoredUserProfile();
  if (profile && profile.fullName && profile.fullName.trim().length >= 3 && (profile.email || profile.idNumber)) {
    return true;
  }

  return false;
}

/**
 * Checks whether a specific user (or the current stored user) has active Elite Plan access
 */
export function isUserEliteActive(targetUser?: RegisteredUser | null): boolean {
  const profile = targetUser !== undefined ? targetUser : getStoredUserProfile();
  if (!profile) return false;
  
  // Dr. Carlos Leal author bypass
  if (profile.role === 'admin' || profile.isAdmin || profile.id === 'usr_carlos_leal_admin' || profile.email === 'carloseduardoleal29@gmail.com') {
    return true;
  }
  if (typeof window !== 'undefined' && localStorage.getItem('anestesiapro_is_author_admin') === 'true') {
    return true;
  }

  if (profile.elitePlan?.status !== 'active') return false;

  // Check expiration if expiresAt is set to a specific date/timestamp
  if (profile.elitePlan?.expiresAt) {
    const expStr = profile.elitePlan.expiresAt.toLowerCase();
    if (!expStr.includes('vitalicio') && !expStr.includes('permanente') && !expStr.includes('ilimitado')) {
      const expTime = new Date(profile.elitePlan.expiresAt).getTime();
      if (!isNaN(expTime) && expTime < Date.now()) {
        return false; // Plan Élite expired
      }
    }
  }

  return true;
}

export function hasActiveElitePlan(targetUser?: RegisteredUser | null): boolean {
  return isUserEliteActive(targetUser);
}

/**
 * Check if the registration prompt was dismissed previously
 */
export function isRegistrationPromptDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(USER_PROMPT_DISMISSED_KEY) === 'true';
}

export function setRegistrationPromptDismissed(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_PROMPT_DISMISSED_KEY, 'true');
}

/**
 * Detects device info for registration metadata
 */
function getDevicePlatformString(): { device: string; platform: 'android' | 'ios' | 'pc'; isInstalledPWA: boolean } {
  let platform: 'android' | 'ios' | 'pc' = 'pc';
  let device = 'Computadora / PC 💻';
  let isInstalledPWA = false;

  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent || '';
    if (/Android/i.test(ua)) {
      platform = 'android';
      device = 'Smartphone Android 📱';
    } else if (/iPad|iPhone|iPod/.test(ua)) {
      platform = 'ios';
      device = 'iPhone / iPad (iOS) 📱';
    } else if (/Macintosh/i.test(ua)) {
      platform = 'pc';
      device = 'MacBook / Mac 💻';
    } else if (/Windows/i.test(ua)) {
      platform = 'pc';
      device = 'Computadora PC (Windows) 💻';
    }

    try {
      isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://') ||
        localStorage.getItem('anestesiapro_pwa_standalone_recorded') === 'true';
    } catch {}
  }

  return { device, platform, isInstalledPWA };
}

/**
 * Registers or updates a user profile via API and syncs locally
 */
export async function registerUserProfile(formData: {
  fullName: string;
  email: string;
  idNumber: string;
  country: string;
  specialty: string;
  phone?: string;
  workplace?: string;
  medicalLicenseNumber?: string;
  collegeRegistration?: string;
  subspecialty?: string;
  digitalSignatureUrl?: string;
  digitalStampUrl?: string;
  autoSendConfig?: {
    autoSendWhatsApp?: boolean;
    autoSendEmail?: boolean;
    defaultRecipientPhone?: string;
    defaultRecipientEmail?: string;
  };
}): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
  const existing = getStoredUserProfile();
  const { device, platform, isInstalledPWA } = getDevicePlatformString();

  const userId = existing?.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const userPayload: RegisteredUser = {
    id: userId,
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    idNumber: formData.idNumber.trim().toUpperCase(),
    country: formData.country,
    specialty: formData.specialty,
    phone: formData.phone?.trim() || '',
    workplace: formData.workplace?.trim() || '',
    medicalLicenseNumber: formData.medicalLicenseNumber?.trim() || '',
    collegeRegistration: formData.collegeRegistration?.trim() || '',
    subspecialty: formData.subspecialty?.trim() || '',
    digitalSignatureUrl: formData.digitalSignatureUrl || existing?.digitalSignatureUrl || undefined,
    digitalStampUrl: formData.digitalStampUrl || existing?.digitalStampUrl || undefined,
    autoSendConfig: formData.autoSendConfig || existing?.autoSendConfig || {
      autoSendWhatsApp: true,
      autoSendEmail: true
    },
    device,
    platform,
    isInstalledPWA,
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    elitePlan: (existing?.elitePlan?.status === 'active') ? existing.elitePlan : {
      status: 'inactive',
      planType: 'standard',
      activatedAt: new Date().toISOString(),
      expiresAt: 'Plan Estándar Gratuito'
    }
  };

  // Reconocimiento especial e inmediato para el Dr. Carlos Leal (Super Administrador y Autor)
  const isCarlosAdmin = userPayload.email === 'carloseduardoleal29@gmail.com' ||
    (userPayload.fullName.toLowerCase().includes('carlos') && userPayload.fullName.toLowerCase().includes('leal'));
  if (isCarlosAdmin) {
    userPayload.id = 'usr_carlos_leal_admin';
    userPayload.role = 'admin';
    userPayload.isAdmin = true;
    userPayload.fullName = 'Dr. Carlos Eduardo Leal';
    userPayload.elitePlan = {
      status: 'active',
      planType: 'lifetime',
      activatedAt: '2026-01-01T00:00:00.000Z',
      expiresAt: 'Permanente (Autor y Superadmin)'
    };
    try {
      localStorage.setItem('anestesiapro_is_author_admin', 'true');
      localStorage.setItem('anestesiapro_author_admin', 'true');
      localStorage.setItem('anestesiapro_pin_authorized', 'true');
      localStorage.setItem('anestesiapro_admin_mode', 'true');
      sessionStorage.setItem('anestesiapro_author_session', 'true');
      (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
    } catch {}
  }

  // 1. GUARDA DE INMEDIATO EN LOCAL STORAGE (Experiencia instantánea sin bloqueos)
  saveStoredUserProfile(userPayload);

  // 2. GUARDA PRIMERO EN EL SERVIDOR EXPRESS (Guarda en disco, envía alerta al admin y actualiza directorio)
  try {
    const serverRes = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });
    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.user) {
        userPayload.id = serverData.user.id;
        saveStoredUserProfile(serverData.user);
      }
    }
  } catch (srvErr) {
    console.warn('[AnestesiaPro User] Server backup notice:', srvErr);
  }

  // 3. INTENTA GUARDAR EN CLOUD FIRESTORE (En segundo plano, tolerante a cuotas)
  try {
    const finalDocId = userPayload.id;
    const docRef1 = doc(db, 'registered_users', finalDocId);
    const sanitizedPayload = JSON.parse(JSON.stringify(userPayload));
    setDoc(docRef1, sanitizedPayload, { merge: true }).catch((fbErr) => {
      console.warn('[AnestesiaPro User] Aviso guardando en registered_users:', fbErr);
    });

    const medicoRecord = {
      id: finalDocId,
      fullName: userPayload.fullName,
      email: userPayload.email || '',
      phone: userPayload.phone || '',
      country: userPayload.country || 'Venezuela',
      registeredAt: userPayload.registeredAt || new Date().toISOString(),
      device: userPayload.device || 'Dispositivo móvil',
      createdAt: serverTimestamp ? serverTimestamp() : new Date().toISOString()
    };
    const docRef2 = doc(db, 'medicos_registrados', finalDocId);
    setDoc(docRef2, medicoRecord, { merge: true }).catch((fbErr) => {
      console.warn('[AnestesiaPro User] Aviso guardando en medicos_registrados:', fbErr);
    });
  } catch (fbErr) {
    console.warn('[AnestesiaPro User] Aviso inicializando Firestore directo:', fbErr);
  }

  return { success: true, user: userPayload };
}

export function cleanDoctorName(val?: string): string {
  if (!val) return '';
  return val
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .replace(/\b(dr|dra|doctor|doctora|medico|medica|lic|prof|msc|esp)\b/g, '') // strip titles
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function normalizePhoneDigits(val?: string): string {
  if (!val) return '';
  const digits = val.replace(/[^0-9]/g, '');
  if (digits.startsWith('58') && digits.length >= 11) return digits.substring(2);
  if (digits.startsWith('0') && digits.length >= 11) return digits.substring(1);
  return digits;
}

/**
 * Helper to normalize and deduplicate users by Cédula (digits), Email, Phone and Clean Name
 */
export function deduplicateClientUsers(rawUsers: RegisteredUser[]): RegisteredUser[] {
  if (!Array.isArray(rawUsers)) return [];

  const normalizeDigits = (val?: string) => (val || '').replace(/[^0-9]/g, '');
  const normalizeEmail = (val?: string) => (val || '').toLowerCase().trim();

  const isCarlosLeal = (u: RegisteredUser) => {
    if (!u) return false;
    const email = normalizeEmail(u.email);
    const cedulaDigits = normalizeDigits(u.idNumber);
    const uId = (u.id || '').toLowerCase();
    return email === 'carloseduardoleal29@gmail.com' ||
      email === 'carlos.leal@anestesiapro.com' ||
      cedulaDigits === '15489288' ||
      uId === 'usr_carlos_leal_admin';
  };

  const validUsers = rawUsers.filter(u => u && u.fullName && u.email);
  const carlosRecords = validUsers.filter(isCarlosLeal);
  const otherUsers = validUsers.filter(u => !isCarlosLeal(u));

  // Unified master Dr. Carlos Leal record (Always exactly 1 master entry)
  const bestSig = carlosRecords.find(c => c.digitalSignatureUrl)?.digitalSignatureUrl ||
    validUsers.find(u => u.id === 'usr_carlos_leal_admin')?.digitalSignatureUrl;
  const bestWorkplace = carlosRecords.find(c => c.workplace && !c.workplace.includes('San Cristóbal'))?.workplace || "";

  const unifiedCarlos: RegisteredUser = {
    id: 'usr_carlos_leal_admin',
    fullName: 'Dr. Carlos Eduardo Leal',
    idNumber: 'V-15.489.288',
    email: 'carloseduardoleal29@gmail.com',
    country: '🇻🇪 Venezuela',
    specialty: 'Médico Especialista en Anestesiología y Reanimación',
    subspecialty: 'Anestesiología Cardiovascular y TIVA',
    workplace: bestWorkplace,
    phone: '+584243291438',
    medicalLicenseNumber: 'MPPS-84920',
    collegeRegistration: 'CM-4521',
    digitalSignatureUrl: bestSig || undefined,
    role: 'admin',
    isAdmin: true,
    device: 'Smartphone / Web (Autor y Fundador)',
    registeredAt: '2026-10-01T00:00:00.000Z',
    lastActiveAt: new Date().toISOString(),
    elitePlan: {
      status: 'active',
      planType: 'lifetime',
      activatedAt: '2026-10-01T00:00:00.000Z',
      expiresAt: 'Permanente (Autor y Fundador)'
    }
  };

  const deduplicatedOthers: RegisteredUser[] = [];

  for (const user of otherUsers) {
    const userCedulaDigits = normalizeDigits(user.idNumber);
    const userPhoneDigits = normalizePhoneDigits(user.phone);
    const userEmail = normalizeEmail(user.email);
    const userNameClean = cleanDoctorName(user.fullName);

    const existingIdx = deduplicatedOthers.findIndex(existing => {
      const exCedulaDigits = normalizeDigits(existing.idNumber);
      const exPhoneDigits = normalizePhoneDigits(existing.phone);
      const exEmail = normalizeEmail(existing.email);
      const exNameClean = cleanDoctorName(existing.fullName);

      const idMatch = existing.id && user.id && existing.id === user.id;

      const cedulaMatch = userCedulaDigits.length >= 5 && exCedulaDigits.length >= 5 && (
        userCedulaDigits === exCedulaDigits ||
        userCedulaDigits.endsWith(exCedulaDigits) ||
        exCedulaDigits.endsWith(userCedulaDigits)
      );

      const emailMatch = userEmail.length >= 5 && exEmail.length >= 5 && userEmail === exEmail;

      const phoneMatch = userPhoneDigits.length >= 7 && exPhoneDigits.length >= 7 && (
        userPhoneDigits === exPhoneDigits ||
        userPhoneDigits.endsWith(exPhoneDigits) ||
        exPhoneDigits.endsWith(userPhoneDigits)
      );

      const nameMatch = userNameClean.length >= 6 && exNameClean.length >= 6 && (
        userNameClean === exNameClean ||
        userNameClean.includes(exNameClean) ||
        exNameClean.includes(userNameClean)
      );

      return idMatch || cedulaMatch || emailMatch || phoneMatch || nameMatch;
    });

    if (existingIdx !== -1) {
      const existing = deduplicatedOthers[existingIdx];
      deduplicatedOthers[existingIdx] = {
        ...existing,
        ...user,
        id: existing.id || user.id,
        fullName: existing.fullName || user.fullName,
        email: existing.email || user.email,
        idNumber: existing.idNumber || user.idNumber,
        phone: existing.phone || user.phone,
        workplace: existing.workplace || user.workplace,
        specialty: existing.specialty || user.specialty,
        digitalSignatureUrl: existing.digitalSignatureUrl || user.digitalSignatureUrl,
        elitePlan: {
          status: (existing.elitePlan?.status === 'active' || user.elitePlan?.status === 'active') ? 'active' : 'inactive',
          planType: (existing.elitePlan?.planType || user.elitePlan?.planType || 'standard'),
          daysGranted: existing.elitePlan?.daysGranted || user.elitePlan?.daysGranted || undefined,
          activatedAt: existing.elitePlan?.activatedAt || user.elitePlan?.activatedAt || undefined,
          expiresAt: existing.elitePlan?.expiresAt || user.elitePlan?.expiresAt || 'Plan Estándar Gratuito',
          adminNotes: existing.elitePlan?.adminNotes || user.elitePlan?.adminNotes || undefined,
          activatedBy: existing.elitePlan?.activatedBy || user.elitePlan?.activatedBy || undefined,
          ...(user.elitePlan || {}),
          ...(existing.elitePlan || {})
        },
        registeredAt: existing.registeredAt && user.registeredAt
          ? (new Date(existing.registeredAt).getTime() < new Date(user.registeredAt).getTime() ? existing.registeredAt : user.registeredAt)
          : (existing.registeredAt || user.registeredAt || new Date().toISOString()),
        lastActiveAt: new Date().toISOString()
      };
    } else {
      deduplicatedOthers.push({
        ...user,
        email: userEmail,
        elitePlan: user.elitePlan || {
          status: 'inactive',
          planType: 'standard',
          expiresAt: 'Plan Estándar Gratuito'
        },
        registeredAt: user.registeredAt || new Date().toISOString(),
        lastActiveAt: user.lastActiveAt || new Date().toISOString()
      });
    }
  }

  return [unifiedCarlos, ...deduplicatedOthers];
}

/**
 * Fetches all registered users for Dr. Carlos Leal's Admin Panel
 * Combines direct Cloud Firestore data + local server backup for 100% accuracy
 */
export async function getRegisteredUsersList(pin: string = '2534'): Promise<{
  success: boolean;
  users: RegisteredUser[];
  stats: RegistrationStatsSummary;
  error?: string;
}> {
  const accumulatedList: RegisteredUser[] = [];

  // 1. Fetch directly from Cloud Firestore (primary authoritative cloud source)
  try {
    const snap = await getDocs(collection(db, 'registered_users'));
    if (!snap.empty) {
      snap.forEach(d => {
        const data = d.data() as RegisteredUser;
        if (data && (data.id || d.id)) {
          const uId = data.id || d.id;
          accumulatedList.push({ ...data, id: uId });
        }
      });
    }
  } catch (fbErr) {
    console.warn('[AnestesiaPro Admin] Direct Firestore fetch notice:', fbErr);
  }

  // 1.1 Also check medicos_registrados collection
  try {
    const snap2 = await getDocs(collection(db, 'medicos_registrados'));
    if (!snap2.empty) {
      snap2.forEach(d => {
        const data = d.data() as RegisteredUser;
        if (data && (data.id || d.id)) {
          const uId = data.id || d.id;
          accumulatedList.push({ ...data, id: uId });
        }
      });
    }
  } catch (fbErr2) {
    console.warn('[AnestesiaPro Admin] Direct Firestore medicos_registrados fetch notice:', fbErr2);
  }

  // 2. Also fetch from Server API (merging backups & local records)
  try {
    const res = await fetch(`/api/users?pin=${encodeURIComponent(pin)}`, {
      headers: {
        'x-author-pin': pin,
        'Cache-Control': 'no-cache'
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        data.users.forEach((u: RegisteredUser) => {
          if (u && u.id) {
            accumulatedList.push(u);
          }
        });
      }
    }
  } catch (err: any) {
    console.warn('[AnestesiaPro Admin] Server API users notice:', err);
  }

  // 3. Run strict multi-key deduplication (Cédula, Email, Name, Carlos Leal Master)
  const allUsers = deduplicateClientUsers(accumulatedList);
  allUsers.sort((a, b) => new Date(b.registeredAt || 0).getTime() - new Date(a.registeredAt || 0).getTime());

  // Compute live statistics summary
  const activeElite = allUsers.filter(u => u.elitePlan?.status === 'active').length;
  const pendingElite = allUsers.filter(u => u.elitePlan?.status === 'pending').length;
  const inactiveElite = allUsers.filter(u => u.elitePlan?.status === 'inactive').length;
  
  const countriesCount: Record<string, number> = {};
  const specialtiesCount: Record<string, number> = {};

  allUsers.forEach(u => {
    if (u.country) {
      countriesCount[u.country] = (countriesCount[u.country] || 0) + 1;
    }
    if (u.specialty) {
      specialtiesCount[u.specialty] = (specialtiesCount[u.specialty] || 0) + 1;
    }
  });

  return {
    success: true,
    users: allUsers,
    stats: {
      totalUsers: allUsers.length,
      activeElite,
      pendingElite,
      inactiveElite,
      countriesCount,
      specialtiesCount
    }
  };
}

/**
 * Updates a user's Elite Plan status (Admin Only)
 */
export async function updateAdminUserElitePlan(
  userId: string,
  elitePlan: Partial<ElitePlanConfig>,
  pin: string = '2534'
): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
  // Update in Cloud Firestore directly
  try {
    const docRef = doc(db, 'registered_users', userId);
    await setDoc(docRef, { elitePlan, lastActiveAt: new Date().toISOString() }, { merge: true });
  } catch (e) {
    console.warn('[AnestesiaPro Admin] Direct plan update notice in Firestore:', e);
  }

  // Update in server
  try {
    const res = await fetch(`/api/users/${userId}/elite-plan`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-author-pin': pin
      },
      body: JSON.stringify({ elitePlan, pin })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const currentLocal = getStoredUserProfile();
      if (currentLocal && currentLocal.id === userId) {
        saveStoredUserProfile(data.user);
      }
      return { success: true, user: data.user };
    }
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}

/**
 * Deletes a registered user record (Admin Only)
 */
export async function deleteAdminUser(userId: string, pin: string = '2534'): Promise<boolean> {
  // Delete from Cloud Firestore directly
  try {
    const docRef = doc(db, 'registered_users', userId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('[AnestesiaPro Admin] Direct delete notice in Firestore:', e);
  }

  // Delete from server
  try {
    const res = await fetch(`/api/users/${userId}?pin=${encodeURIComponent(pin)}`, {
      method: 'DELETE',
      headers: { 'x-author-pin': pin }
    });
    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch {
    return true;
  }
}

/**
 * Sync registration settings policy (Cloud Firestore + Backend)
 */
export async function getGlobalRegistrationSettings(): Promise<{ requireRegistration: boolean }> {
  // 1. Try API first (fast and authoritative from Express server)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/admin/settings', { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    if (data.success && data.settings && typeof data.settings.requireRegistration === 'boolean') {
      const val = !!data.settings.requireRegistration;
      if (typeof window !== 'undefined') {
        localStorage.setItem('anestesiapro_require_registration', String(val));
      }
      return { requireRegistration: val };
    }
  } catch (e) {}

  // 2. Try Cloud Firestore with 2s timeout
  try {
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('Firestore timeout')), 2000)
    );
    const metaSnap = await Promise.race([
      getDoc(doc(db, 'app_meta', 'settings')),
      timeoutPromise
    ]);
    if (metaSnap && (metaSnap as any).exists && (metaSnap as any).exists()) {
      const data = (metaSnap as any).data();
      if (data && typeof data.requireRegistration === 'boolean') {
        if (typeof window !== 'undefined') {
          localStorage.setItem('anestesiapro_require_registration', String(data.requireRegistration));
        }
        return { requireRegistration: data.requireRegistration };
      }
    }
  } catch (e) {}

  // 3. Fallback to cached or mandatory default (true)
  if (typeof window !== 'undefined') {
    localStorage.setItem('anestesiapro_require_registration', 'true');
  }

  // Default to true (mandatory registration policy requested by author Dr. Carlos Leal: quien no esté registrado no puede entrar)
  return { requireRegistration: true };
}

export async function saveGlobalRegistrationSettings(requireRegistration: boolean, pin: string = '2534'): Promise<boolean> {
  // 1. Save immediately to client storage and notify all active listeners
  if (typeof window !== 'undefined') {
    localStorage.setItem('anestesiapro_require_registration', String(requireRegistration));
    window.dispatchEvent(new CustomEvent('anestesiapro_registration_settings_changed', { 
      detail: { requireRegistration } 
    }));
  }

  // 2. Save in Backend asynchronously (non-blocking)
  const apiSave = fetch('/api/admin/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-author-pin': pin
    },
    body: JSON.stringify({ requireRegistration })
  }).catch(() => {});

  // 3. Save in Cloud Firestore asynchronously with timeout (non-blocking)
  const firestoreSave = (async () => {
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 2500));
      await Promise.race([
        setDoc(doc(db, 'app_meta', 'settings'), {
          requireRegistration,
          updatedAt: new Date().toISOString()
        }, { merge: true }),
        timeoutPromise
      ]);
    } catch {}
  })();

  // Wait with a small safety ceiling so UI never freezes
  await Promise.race([
    Promise.allSettled([apiSave, firestoreSave]),
    new Promise(resolve => setTimeout(resolve, 800))
  ]);

  return true;
}

/**
 * Exports all registered users to a downloadable CSV file
 */
export function exportUsersToCSV(users: RegisteredUser[]): void {
  if (!users || users.length === 0) {
    alert('No hay usuarios registrados para exportar.');
    return;
  }

  const headers = [
    'ID',
    'Nombre Completo',
    'Cédula / DNI',
    'Correo Electrónico',
    'País',
    'Especialidad / Cargo',
    'Teléfono / WhatsApp',
    'Lugar de Trabajo',
    'Dispositivo',
    'PWA Instalada',
    'Fecha de Registro',
    'Estado Plan Élite',
    'Tipo de Plan',
    'Fecha Vencimiento',
    'Notas Administrador'
  ];

  const rows = users.map(u => [
    `"${u.id || ''}"`,
    `"${(u.fullName || '').replace(/"/g, '""')}"`,
    `"${(u.idNumber || '').replace(/"/g, '""')}"`,
    `"${(u.email || '').replace(/"/g, '""')}"`,
    `"${(u.country || '').replace(/"/g, '""')}"`,
    `"${(u.specialty || '').replace(/"/g, '""')}"`,
    `"${(u.phone || '').replace(/"/g, '""')}"`,
    `"${(u.workplace || '').replace(/"/g, '""')}"`,
    `"${(u.device || '').replace(/"/g, '""')}"`,
    u.isInstalledPWA ? 'Sí' : 'No',
    `"${u.registeredAt ? new Date(u.registeredAt).toLocaleString('es-ES') : ''}"`,
    `"${u.elitePlan?.status || 'pending'}"`,
    `"${u.elitePlan?.planType || 'trial'}"`,
    `"${u.elitePlan?.expiresAt || ''}"`,
    `"${(u.elitePlan?.adminNotes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AnestesiaPro_Colegas_Registrados_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports all registered users to a raw JSON backup file
 */
export function exportUsersToJSON(users: RegisteredUser[]): void {
  if (!users || users.length === 0) {
    alert('No hay usuarios registrados para exportar.');
    return;
  }
  const jsonStr = JSON.stringify(users, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AnestesiaPro_Respaldo_Colegas_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats a personalized welcome WhatsApp message URL for a newly registered colleague
 */
export function getWelcomeWhatsAppUrl(user: RegisteredUser): string {
  const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  const message = `🩺 *¡Bienvenido(a) a AnestesiaPro, Dr(a). ${user.fullName}!*

Estimado(a) colega, se ha activado exitosamente tu *Carnet Médico Digital* en AnestesiaPro.

📋 *Detalles de tu Perfil:*
• *Nombre:* ${user.fullName}
• *Cédula / DNI:* ${user.idNumber}
• *Especialidad:* ${user.specialty}
• *País:* ${user.country}
• *Lugar de Trabajo:* ${user.workplace || 'No especificado'}

🔑 *Módulos Habilitados:*
✓ Calculadoras de inducción anestésica y dosis ajustadas por peso
✓ Evaluación preanestésica digital con informe PDF
✓ Índice de shock, predicción de vía aérea y escalas médicas
✓ Guías clínicas, atlas anatómico y vademécum

Para consultar la aplicación en cualquier momento ingresa a:
https://anestesiapro.lat

_Dirección Médica de AnestesiaPro (Dr. Carlos Leal)._`;

  if (cleanPhone && cleanPhone.length >= 8) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/**
 * Formats a direct WhatsApp alert URL sent to Dr. Carlos Leal (+58 424-3291438) when a new colleague registers
 */
export function getAdminNotificationWhatsAppUrl(user: RegisteredUser): string {
  const adminPhone = '584243291438'; // Dr. Carlos Leal WhatsApp
  const userCleanPhone = (user.phone || '').replace(/[^0-9]/g, '');
  
  const message = `🚨 *¡NUEVO COLEGA REGISTRADO EN ANESTESIAPRO!*

👤 *Datos del Médico:*
• *Nombre:* ${user.fullName}
• *Cédula / DNI:* ${user.idNumber}
• *Correo:* ${user.email}
• *Teléfono:* ${user.phone || 'No especificado'}
• *País:* ${user.country}
• *Especialidad:* ${user.specialty}
• *Hospital / Lugar:* ${user.workplace || 'Sin especificar'}
• *Dispositivo:* ${user.device || 'Smartphone / Web'}
• *Fecha:* ${new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' })}

${userCleanPhone ? `💬 *Chat directo con el colega:* https://wa.me/${userCleanPhone}` : ''}`;

  return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
}

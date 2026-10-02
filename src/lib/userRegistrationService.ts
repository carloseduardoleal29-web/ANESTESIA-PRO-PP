import { RegisteredUser, ElitePlanConfig, RegistrationStatsSummary } from '../types/user';

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

/**
 * Gets the current registered user profile saved in this device's localStorage
 */
export function getStoredUserProfile(): RegisteredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RegisteredUser;
  } catch (e) {
    console.warn('[AnestesiaPro User] Error reading stored profile:', e);
    return null;
  }
}

/**
 * Saves or updates the registered user profile in localStorage
 */
export function saveStoredUserProfile(user: RegisteredUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    // Also notify any listeners across the app
    window.dispatchEvent(new CustomEvent('anestesiapro_user_profile_updated', { detail: user }));
  } catch (e) {
    console.warn('[AnestesiaPro User] Error saving profile to storage:', e);
  }
}

/**
 * Removes the stored user profile (e.g. on manual logout/reset)
 */
export function clearStoredUserProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('anestesiapro_user_profile_updated', { detail: null }));
  } catch (e) {}
}

/**
 * Checks whether this device has an active registered user
 */
export function isUserRegistered(): boolean {
  const profile = getStoredUserProfile();
  return Boolean(profile && profile.fullName && profile.email && profile.idNumber);
}

/**
 * Checks whether the user has active Elite Plan access
 */
export function hasActiveElitePlan(): boolean {
  const profile = getStoredUserProfile();
  if (!profile) return false;
  
  // Dr. Carlos Leal author bypass
  if (localStorage.getItem('anestesiapro_is_author_admin') === 'true') {
    return true;
  }

  return profile.elitePlan?.status === 'active';
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
    autoSendConfig: formData.autoSendConfig || existing?.autoSendConfig || {
      autoSendWhatsApp: true,
      autoSendEmail: true
    },
    device,
    platform,
    isInstalledPWA,
    registeredAt: existing?.registeredAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    elitePlan: existing?.elitePlan || {
      status: 'pending',
      planType: 'trial',
      activatedAt: new Date().toISOString(),
      expiresAt: 'Periodo de Lanzamiento'
    }
  };

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userPayload)
    });

    const data = await res.json();
    if (res.ok && data.success && data.user) {
      saveStoredUserProfile(data.user);
      return { success: true, user: data.user };
    } else {
      // Offline or server fallback: save locally so user experience is not disrupted
      saveStoredUserProfile(userPayload);
      return { success: true, user: userPayload };
    }
  } catch (err: any) {
    console.warn('[AnestesiaPro User] Server registration notice (saving locally):', err);
    saveStoredUserProfile(userPayload);
    return { success: true, user: userPayload };
  }
}

/**
 * Fetches all registered users for Dr. Carlos Leal's Admin Panel
 */
export async function getRegisteredUsersList(pin: string = '2534'): Promise<{
  success: boolean;
  users: RegisteredUser[];
  stats: RegistrationStatsSummary;
  error?: string;
}> {
  try {
    const res = await fetch(`/api/users?pin=${encodeURIComponent(pin)}`, {
      headers: {
        'x-author-pin': pin,
        'Cache-Control': 'no-cache'
      }
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        users: data.users || [],
        stats: data.stats || {
          totalUsers: data.users?.length || 0,
          activeElite: 0,
          pendingElite: 0,
          inactiveElite: 0,
          countriesCount: {},
          specialtiesCount: {}
        }
      };
    }
    return {
      success: false,
      users: [],
      stats: { totalUsers: 0, activeElite: 0, pendingElite: 0, inactiveElite: 0, countriesCount: {}, specialtiesCount: {} },
      error: data.error || 'Error al obtener usuarios registrados'
    };
  } catch (err: any) {
    return {
      success: false,
      users: [],
      stats: { totalUsers: 0, activeElite: 0, pendingElite: 0, inactiveElite: 0, countriesCount: {}, specialtiesCount: {} },
      error: err.message || 'Error de red'
    };
  }
}

/**
 * Updates a user's Elite Plan status (Admin Only)
 */
export async function updateAdminUserElitePlan(
  userId: string,
  elitePlan: Partial<ElitePlanConfig>,
  pin: string = '2534'
): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
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
      // If updating the local user, update stored profile too
      const currentLocal = getStoredUserProfile();
      if (currentLocal && currentLocal.id === userId) {
        saveStoredUserProfile(data.user);
      }
      return { success: true, user: data.user };
    }
    return { success: false, error: data.error || 'Error al actualizar plan' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error de conexión' };
  }
}

/**
 * Deletes a registered user record (Admin Only)
 */
export async function deleteAdminUser(userId: string, pin: string = '2534'): Promise<boolean> {
  try {
    const res = await fetch(`/api/users/${userId}?pin=${encodeURIComponent(pin)}`, {
      method: 'DELETE',
      headers: { 'x-author-pin': pin }
    });
    const data = await res.json();
    return Boolean(res.ok && data.success);
  } catch {
    return false;
  }
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

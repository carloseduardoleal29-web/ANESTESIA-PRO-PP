import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { DoctorUser } from '../types/user';
import backupUsers from '../data/registered_users_backup.json';

const COLLECTION_NAME = 'usuarios_anestesiapro';
const LOCAL_STORAGE_KEY = 'anestesiapro_active_user_v2';
const AUTO_SYNC_KEY = 'anestesiapro_auto_synced_v2';

// 1. Save or Update Doctor in Firestore Cloud Database
export async function registerDoctorInCloud(user: Omit<DoctorUser, 'id'>): Promise<DoctorUser> {
  const sanitizedId = user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const docRef = doc(db, COLLECTION_NAME, sanitizedId);
  
  const payload: DoctorUser = {
    fullName: user.fullName.trim(),
    email: user.email.toLowerCase().trim(),
    medicalId: user.medicalId.trim(),
    specialty: user.specialty.trim() || 'Anestesiología',
    country: user.country.trim() || 'Internacional',
    registeredAt: user.registeredAt || new Date().toISOString(),
    isPro: user.isPro || false,
    updatedAt: new Date().toISOString()
  };

  // Write to Firestore and await confirmation
  await setDoc(docRef, payload, { merge: true });

  // Verify write confirmation from cloud
  const verifySnap = await getDoc(docRef);
  if (!verifySnap.exists()) {
    throw new Error('No se pudo verificar la creación del usuario en Firestore cloud.');
  }

  const verifiedUser = { id: verifySnap.id, ...(verifySnap.data() as DoctorUser) };

  // Store in LocalStorage strictly as session memory for local device
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(verifiedUser));
  localStorage.setItem(AUTO_SYNC_KEY, 'true');

  return verifiedUser;
}

// 2. Get local active session from LocalStorage
export function getLocalActiveDoctor(): DoctorUser | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// 3. Verify if user exists in Cloud Firestore (for Rescue Mode validation)
export async function verifyCloudUserByEmail(email: string): Promise<DoctorUser | null> {
  if (!email) return null;
  const sanitizedId = email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const docRef = doc(db, COLLECTION_NAME, sanitizedId);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as DoctorUser) };
  }
  return null;
}

// 4. Auto-Rescue function to upload any pre-existing localStorage data seamlessly to Firestore
export async function autoRescueFromLocalStorage(): Promise<DoctorUser | null> {
  try {
    // Seed initial backup doctors if needed
    seedBackupDoctorsToCloud().catch(err => console.warn('Notice seeding backup doctors:', err));

    const candidates: any[] = [];

    // Check active local user first
    const active = getLocalActiveDoctor();
    if (active) candidates.push(active);

    // List of known keys to inspect in localStorage
    const knownKeys = [
      'anestesiapro_active_user_v2',
      'anestesiapro_active_user',
      'anestesiapro_user',
      'anestesiapro_doctor',
      'anestesiapro_profile',
      'registered_users',
      'anestesiapro_registered_users',
      'user_data',
      'doctor_data',
      'user'
    ];

    // Collect all keys currently in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !knownKeys.includes(key)) {
        knownKeys.push(key);
      }
    }

    for (const key of knownKeys) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => { if (item && typeof item === 'object') candidates.push(item); });
        } else if (parsed && typeof parsed === 'object') {
          candidates.push(parsed);
        }
      } catch {
        // Skip non-JSON values
      }
    }

    // Inspect candidates for valid user profile
    for (const cand of candidates) {
      const email = (cand.email || cand.correo || cand.correoElectronico || '').toString().trim().toLowerCase();
      const fullName = (cand.fullName || cand.nombre || cand.name || cand.nombreCompleto || cand.doctorName || '').toString().trim();
      const medicalId = (cand.medicalId || cand.idNumber || cand.cedula || cand.id || cand.medicalLicenseNumber || '').toString().trim();
      const specialty = (cand.specialty || cand.especialidad || 'Anestesiología').toString().trim();
      const country = (cand.country || cand.pais || 'Venezuela').toString().trim();
      const registeredAt = cand.registeredAt || cand.fechaRegistro || cand.created_at || new Date().toISOString();
      const isPro = cand.isPro === true || cand.pro === true || cand.elitePlan?.status === 'active';

      if (email.includes('@') && (fullName.length > 0 || medicalId.length > 0)) {
        const doctorData: Omit<DoctorUser, 'id'> = {
          fullName: fullName || 'Dr. Médico Anestesiólogo',
          email,
          medicalId: medicalId || 'ID-REGISTRADO',
          specialty,
          country,
          registeredAt,
          isPro
        };

        // Upload automatically in background to Firestore usuarios_anestesiapro
        const verifiedUser = await registerDoctorInCloud(doctorData);
        localStorage.setItem(AUTO_SYNC_KEY, 'true');
        return verifiedUser;
      }
    }

    return null;
  } catch (err) {
    console.error('Error executing autoRescueFromLocalStorage:', err);
    return null;
  }
}

// Helper to seed backup doctors to Firestore so Admin Panel displays them immediately
async function seedBackupDoctorsToCloud() {
  if (!Array.isArray(backupUsers)) return;
  for (const bUser of backupUsers as any[]) {
    if (bUser.email && bUser.fullName) {
      const sanitizedId = bUser.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
      const docRef = doc(db, COLLECTION_NAME, sanitizedId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        const payload: DoctorUser = {
          fullName: bUser.fullName,
          email: bUser.email.toLowerCase().trim(),
          medicalId: bUser.idNumber || bUser.medicalLicenseNumber || 'ID-BACKUP',
          specialty: bUser.specialty || 'Anestesiología',
          country: bUser.country || 'Venezuela',
          registeredAt: bUser.registeredAt || new Date().toISOString(),
          isPro: bUser.elitePlan?.status === 'active' || bUser.isAdmin || false,
          updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, payload, { merge: true });
      }
    }
  }
}

// 5. Real-time Admin Listener for all registered doctors
export function subscribeToAllDoctors(callback: (doctors: DoctorUser[]) => void, onError?: (err: Error) => void) {
  const colRef = collection(db, COLLECTION_NAME);
  
  return onSnapshot(colRef, (snapshot) => {
    const list: DoctorUser[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as DoctorUser) });
    });

    // Sort newest to oldest
    list.sort((a, b) => {
      const dateA = new Date(a.registeredAt || 0).getTime();
      const dateB = new Date(b.registeredAt || 0).getTime();
      return dateB - dateA;
    });

    callback(list);
  }, (error) => {
    console.error('Error listening to usuarios_anestesiapro:', error);
    if (onError) onError(error);
  });
}

// 6. Toggle Plan Pro in Cloud Firestore
export async function toggleDoctorProStatus(doctorId: string, currentProStatus: boolean): Promise<boolean> {
  const docRef = doc(db, COLLECTION_NAME, doctorId);
  const newStatus = !currentProStatus;
  await updateDoc(docRef, {
    isPro: newStatus,
    updatedAt: new Date().toISOString()
  });
  return newStatus;
}

// 7. Export Doctor List to CSV / Excel
export function exportDoctorsToCSV(doctors: DoctorUser[]) {
  const headers = ['Nombre Completo', 'Correo Electrónico', 'Cédula / ID', 'Especialidad', 'País', 'Fecha Registro', 'Plan Pro'];
  const rows = doctors.map(d => [
    `"${d.fullName.replace(/"/g, '""')}"`,
    `"${d.email.replace(/"/g, '""')}"`,
    `"${d.medicalId.replace(/"/g, '""')}"`,
    `"${d.specialty.replace(/"/g, '""')}"`,
    `"${d.country.replace(/"/g, '""')}"`,
    `"${d.registeredAt}"`,
    d.isPro ? 'SÍ (PRO)' : 'Estándar'
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Usuarios_AnestesiaPro_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

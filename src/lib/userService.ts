import { DoctorUser } from '../types/user';
import { db, handleFirestoreError, OperationType, testConnection } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit } from 'firebase/firestore';

const LOCAL_STORAGE_KEY = 'anestesiapro_doctor_user';
const BACKUP_USERS_URL = '/registered_users.json';
const USERS_COLLECTION = 'usuarios_anestesiapro';
const NOTIFICATIONS_COLLECTION = 'notificaciones_anestesiapro';
const EVENTS_COLLECTION = 'eventos_anestesiapro';

export function getLocalActiveDoctor(): DoctorUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('activeDoctor');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local active doctor:', e);
  }
  return null;
}

export function saveLocalActiveDoctor(user: DoctorUser): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem('activeDoctor', JSON.stringify(user));
  } catch (e) {
    console.error('Error saving local active doctor:', e);
  }
}

export async function verifyCloudUserByEmail(email: string): Promise<DoctorUser | null> {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  // 1. Intentar buscar en Firestore Cloud
  try {
    const q = query(collection(db, USERS_COLLECTION), where('email', '==', cleanEmail), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0].data() as DoctorUser;
      const found: DoctorUser = {
        ...docData,
        id: snapshot.docs[0].id
      };
      saveLocalActiveDoctor(found);
      return found;
    }
  } catch (e) {
    console.warn('Firestore query by email encountered an issue, falling back to local dataset:', e);
  }

  // 2. Respaldo estático local
  try {
    const res = await fetch(BACKUP_USERS_URL);
    if (res.ok) {
      const users: DoctorUser[] = await res.json();
      const found = users.find(u => (u.email || '').toLowerCase() === cleanEmail);
      if (found) {
        saveLocalActiveDoctor(found);
        // Sincronizar en segundo plano a Firestore
        syncDoctorToFirestore(found).catch(() => {});
        return found;
      }
    }
  } catch (e) {
    console.warn('Could not verify against backup users:', e);
  }
  return null;
}

export async function syncDoctorToFirestore(user: DoctorUser): Promise<void> {
  const userId = user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    ...user,
    id: userId,
    medicalId: user.idNumber || 'No especificado',
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), payload, { merge: true });
  } catch (e) {
    console.warn('Could not sync user to Firestore:', e);
  }
}

export async function autoRescueFromLocalStorage(): Promise<DoctorUser | null> {
  // 1. Probar conexión inicial con Firestore
  testConnection().catch(() => {});

  const local = getLocalActiveDoctor();
  if (local && local.email) {
    // Sincronizar actualización con Firestore en background
    syncDoctorToFirestore(local).catch(() => {});
    return local;
  }

  // 2. Buscar en Firestore si ya existe el Dr. Carlos Leal (Fundador)
  try {
    const adminDocRef = doc(db, USERS_COLLECTION, 'usr_carlos_leal_admin');
    const adminSnap = await getDoc(adminDocRef);
    if (adminSnap.exists()) {
      const adminData = adminSnap.data() as DoctorUser;
      saveLocalActiveDoctor(adminData);
      return adminData;
    }
  } catch (e) {
    console.warn('Firestore admin check skipped:', e);
  }

  // 3. Intento de rescate por defecto: Dr. Carlos Leal (Fundador) desde backup estático
  try {
    const res = await fetch(BACKUP_USERS_URL);
    if (res.ok) {
      const users: DoctorUser[] = await res.json();
      const admin = users.find(u => u.isAdmin || u.role === 'admin' || u.id === 'usr_carlos_leal_admin');
      if (admin) {
        saveLocalActiveDoctor(admin);
        syncDoctorToFirestore(admin).catch(() => {});
        return admin;
      }
    }
  } catch (e) {
    console.warn('Auto-rescue error:', e);
  }
  return null;
}

export async function registerDoctorInCloud(user: DoctorUser): Promise<DoctorUser> {
  const userId = user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const completeUser: DoctorUser = {
    ...user,
    id: userId,
    registeredAt: user.registeredAt || new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    isPro: Boolean(user.isAdmin || user.id === 'usr_carlos_leal_admin'),
    elitePlan: (user.isAdmin || user.id === 'usr_carlos_leal_admin') ? {
      status: 'active',
      planType: 'lifetime',
      expiresAt: 'Permanente (Autor y Fundador)'
    } : {
      status: 'inactive',
      planType: 'standard',
      expiresAt: 'Plan Estándar Gratuito'
    }
  };

  saveLocalActiveDoctor(completeUser);

  // Guardar en Firestore
  try {
    await setDoc(doc(db, USERS_COLLECTION, userId), {
      ...completeUser,
      medicalId: completeUser.idNumber || 'No especificado',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Registrar evento de registro en Firestore
    await setDoc(doc(db, EVENTS_COLLECTION, `evt_${Date.now()}`), {
      title: `👤 ¡NUEVO COLEGA REGISTRADO: ${completeUser.fullName}!`,
      detail: `El Dr(a). ${completeUser.fullName} (${completeUser.country}, C.I: ${completeUser.idNumber}, ${completeUser.specialty}) se ha registrado en AnestesiaPro.`,
      device: completeUser.device || 'Dispositivo Web / Móvil',
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Register doctor Firestore write fallback:', e);
  }

  return completeUser;
}

export async function getAllDoctors(): Promise<DoctorUser[]> {
  try {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    if (!snapshot.empty) {
      const cloudUsers: DoctorUser[] = [];
      snapshot.forEach(docSnap => {
        cloudUsers.push({ ...(docSnap.data() as DoctorUser), id: docSnap.id });
      });
      return cloudUsers;
    }
  } catch (e) {
    console.warn('Could not fetch all doctors from Firestore, reading static fallback:', e);
  }

  // Respaldo
  try {
    const res = await fetch(BACKUP_USERS_URL);
    if (res.ok) {
      const backupUsers: DoctorUser[] = await res.json();
      // Opcionalmente sembrar en Firestore en background
      backupUsers.forEach(u => syncDoctorToFirestore(u).catch(() => {}));
      return backupUsers;
    }
  } catch (err) {
    console.error('Backup load failed:', err);
  }

  return [];
}

export async function getNotifications(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, NOTIFICATIONS_COLLECTION));
    if (!snapshot.empty) {
      const list: any[] = [];
      snapshot.forEach(d => list.push({ ...d.data(), id: d.id }));
      // Ordenar por fecha o ID descendente
      return list.reverse();
    }
  } catch (e) {
    console.warn('Error fetching notifications from Firestore:', e);
  }

  try {
    const res = await fetch('/notifications.json');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Error fetching local notifications:', e);
  }
  return [];
}

export async function getAdminEvents(): Promise<any[]> {
  try {
    const snapshot = await getDocs(collection(db, EVENTS_COLLECTION));
    if (!snapshot.empty) {
      const list: any[] = [];
      snapshot.forEach(d => list.push({ ...d.data(), id: d.id }));
      return list.reverse();
    }
  } catch (e) {
    console.warn('Error fetching events from Firestore:', e);
  }

  try {
    const res = await fetch('/admin_events.json');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Error fetching local events:', e);
  }
  return [];
}

export async function sendBroadcastNotification(title: string, message: string): Promise<any> {
  const notifId = `push-broadcast-${Date.now()}`;
  const newNotif = {
    id: notifId,
    title,
    message,
    date: new Date().toISOString().slice(0, 10),
    badge: 'DIFUSIÓN DPC',
    author: 'Dr. Carlos Leal (Autor)',
    isPushBroadcast: true,
    url: '/?source=push_broadcast'
  };

  // 1. Guardar en Firestore
  try {
    await setDoc(doc(db, NOTIFICATIONS_COLLECTION, notifId), newNotif);
  } catch (e) {
    console.warn('Could not persist notification in Firestore:', e);
  }

  // 2. Disparar notificación nativa de navegador / Service Worker si está soportado
  try {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(title, {
              body: message,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              vibrate: [200, 100, 200]
            } as any);
          });
        } else {
          new Notification(title, { body: message, icon: '/icon-192.png' });
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body: message, icon: '/icon-192.png' });
          }
        });
      }
    }
  } catch (e) {
    console.warn('Native notification trigger error:', e);
  }

  return newNotif;
}

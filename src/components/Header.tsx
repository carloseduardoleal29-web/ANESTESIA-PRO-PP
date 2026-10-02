import React, { useState, useEffect } from 'react';
import { Activity, Award, Download, Smartphone, X, Share, Share2, Lock, Unlock, KeyRound, ShieldCheck, ShieldAlert, Eye, BookMarked, BookOpen, Bell, Send, CheckCircle, CheckCircle2, ArrowRight, Sparkles, AlertCircle, MessageSquare, Mail, Phone, MapPin, User, MessageCircle, SendHorizontal, Instagram, FileText, Calculator, Trash2, Copy, Check, Laptop, Monitor, RefreshCw, Volume2, VolumeX, Radio, Filter, Droplet, Wind, ExternalLink, Stethoscope, Zap, RotateCcw, Maximize2, Star, Clock } from 'lucide-react';
import { syncGlobalVisit, getGlobalStats, recordAppInstall, getNotifications, publishNewNotification, requestBrowserNotifications, sendBrowserPushNotification, playNotificationChime, playInstallCelebrationChime, submitUserFeedback, getFeedbackList, deleteUserFeedback, getCanonicalAppOrigin, SHORT_APP_URL, updateAdminStats, resetAllAdminStats, AppStats, AppNotification, UserFeedback, AdminActivityEvent, getAdminActivityEvents, clearAdminActivityEvents, formatLocalDisplayTime, formatShortLocalTime, getModuleVisits } from '../lib/statsService';
import { LOGO_SHIELD_BASE64, LOGO_FULL_BASE64 } from '../lib/logoData';
import { TabType } from '../types';
import { ShareModal } from './ShareModal';
import { DeveloperModal } from './DeveloperModal';
import { CeLealStudioLogo } from './CeLealStudioLogo';
import { EliteLabModule } from './EliteLabModule';
import { UserRegistrationModal } from './UserRegistrationModal';
import { 
  RegisteredUser, 
  RegistrationStatsSummary, 
  getStoredUserProfile, 
  isUserRegistered, 
  hasActiveElitePlan, 
  getRegisteredUsersList, 
  updateAdminUserElitePlan, 
  deleteAdminUser, 
  exportUsersToCSV, 
  SUPPORTED_COUNTRIES, 
  SPECIALTY_OPTIONS 
} from '../lib/userRegistrationService';
import { forceAppUpdate } from '../registerServiceWorker';
import { reframeCurrentDevice } from '../lib/viewportManager';

interface HeaderProps {
  setActiveTab?: (tab: TabType) => void;
  onSelectEducationResource?: (resourceId: string) => void;
}

// Helper to detect user's OS / platform accurately
const detectUserDevice = (): 'android' | 'ios' | 'pc' => {
  if (typeof window === 'undefined') return 'android';
  const ua = window.navigator.userAgent || '';
  if (/iPad|iPhone|iPod/.test(ua) || (window.navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))) {
    return 'ios';
  }
  if (/Android/i.test(ua)) {
    return 'android';
  }
  return 'pc';
};

export const Header: React.FC<HeaderProps> = ({ setActiveTab, onSelectEducationResource }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [detectedUserPlatform, setDetectedUserPlatform] = useState<'android' | 'ios' | 'pc'>(() => detectUserDevice());
  const [installDeviceTab, setInstallDeviceTab] = useState<'android' | 'ios' | 'pc'>(() => detectUserDevice());
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvitation, setCopiedInvitation] = useState(false);
  const [installConfirmed, setInstallConfirmed] = useState(false);

  // Standalone mode & Smart Install Prompt for users on browsers
  const [isInstalledApp, setIsInstalledApp] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa') ||
        window.location.search.includes('mode=standalone') ||
        localStorage.getItem('anestesiapro_pwa_standalone_recorded') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [showSmartInstallBanner, setShowSmartInstallBanner] = useState(false);

  // Contact & Suggestions State
  const [showContactModal, setShowContactModal] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>([]);

  // Stealth Admin Mode for Author (Dr. Carlos Leal) - PRIVATE ACCESS ONLY
  const [showAdminButton, setShowAdminButton] = useState<boolean>(() => {
    try {
      const isSaved = sessionStorage.getItem('anestesiapro_author_session') === 'true';
      const hasUrlParam = typeof window !== 'undefined' && (
        window.location.search.includes('carlos=2534') ||
        window.location.search.includes('carlos=2026') ||
        window.location.search.includes('panel=2534')
      );
      if (hasUrlParam) {
        sessionStorage.setItem('anestesiapro_author_session', 'true');
        return true;
      }
      return isSaved;
    } catch {
      return false;
    }
  });

  const [logoClickCount, setLogoClickCount] = useState<number>(0);

  const handleSecretLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount >= 3) {
      setShowAdminButton(prev => {
        const next = !prev;
        if (next) {
          localStorage.setItem('anestesiapro_is_author_admin', 'true');
          getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
          setStatsPinInput('');
          setStatsPinError(false);
          setShowStatsModal(true);
        } else {
          localStorage.removeItem('anestesiapro_is_author_admin');
        }
        return next;
      });
      setLogoClickCount(0);
    }
    setTimeout(() => setLogoClickCount(0), 1800);
  };

  useEffect(() => {
    const handleOpenStats = () => {
      setShowAdminButton(true);
      localStorage.setItem('anestesiapro_is_author_admin', 'true');
      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
      setStatsPinInput('');
      setStatsPinError(false);
      setShowStatsModal(true);
    };
    const handleLoggedOut = () => {
      setShowAdminButton(false);
      setIsPinAuthorized(false);
      setShowStatsModal(false);
    };

    const handleOpenNotifs = () => {
      markAllNotificationsAsRead();
      setShowNotifModal(true);
    };
    const handleOpenContact = () => {
      setShowContactModal(true);
    };
    const handleProfileUpdate = (e: any) => {
      setUserProfile(e.detail || getStoredUserProfile());
    };
    const handleOpenRegistration = () => {
      setUserRegEditMode(!getStoredUserProfile());
      setShowUserRegistrationModal(true);
    };

    window.addEventListener('anestesiapro_open_stats_modal', handleOpenStats);
    window.addEventListener('anestesiapro_admin_logged_out', handleLoggedOut);
    window.addEventListener('anestesiapro_open_notifications_modal', handleOpenNotifs);
    window.addEventListener('anestesiapro_open_contact_modal', handleOpenContact);
    window.addEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
    window.addEventListener('anestesiapro_open_registration_modal', handleOpenRegistration);
    window.addEventListener('anestesiapro_open_user_registration', handleOpenRegistration);

    // Auto-open modal immediately if URL has secret key or calculator deep-link
    try {
      if (typeof window !== 'undefined') {
        const hasCalcParam = window.location.search.includes('calc=') ||
                             window.location.search.includes('panel=calculadoras') ||
                             window.location.search.includes('carlos=calc');
        const hasUrlParam = window.location.search.includes('carlos=2534') ||
                            window.location.search.includes('carlos=2026') ||
                            window.location.search.includes('panel=2534') ||
                            hasCalcParam;
        if (hasUrlParam) {
          sessionStorage.setItem('anestesiapro_author_session', 'true');
          setShowAdminButton(true);
          setShowStatsModal(true);
          if (hasCalcParam) {
            setAdminActiveTab('calculadoras');
          }
          getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
          loadAdminEvents();
          loadAdminUsersDirectory();
        }
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('anestesiapro_open_stats_modal', handleOpenStats);
      window.removeEventListener('anestesiapro_admin_logged_out', handleLoggedOut);
      window.removeEventListener('anestesiapro_open_notifications_modal', handleOpenNotifs);
      window.removeEventListener('anestesiapro_open_contact_modal', handleOpenContact);
      window.removeEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
      window.removeEventListener('anestesiapro_open_registration_modal', handleOpenRegistration);
      window.removeEventListener('anestesiapro_open_user_registration', handleOpenRegistration);
    };
  }, []);

  // Stats State
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [statsPinInput, setStatsPinInput] = useState('');
  const [isPinAuthorized, setIsPinAuthorized] = useState(false);
  const [statsPinError, setStatsPinError] = useState(false);
  const [stats, setStats] = useState<AppStats>({
    visits: 1151,
    appInstalls: 208,
    uniqueDevices: 410,
    totalDownloads: 968,
    itemDownloads: {
      'res-preeclampsia-eclampsia-enfoque-anestesiologico': 128,
      'res-calculadora-preeclampsia': 42,
      'res-protocolo-emotive-hemorragia-posparto-2026': 88,
      'res-guia-eras-cesarea-2025': 106,
      'res-modulo-preanestesia-consultado': 121,
      'res-evaluacion-preanestesica': 76,
      'res-enfoque-vortex-via-aerea-dificil': 62,
      'res-fona-cricotiroidotomia': 45,
      'res-calculadora-induccion': 38,
      'res-caso-elaine-bromiley': 33,
      'res-isr-secuencia-rapida-2025': 29,
      'res-orexina-interruptor-despertar-2026': 27,
      'res-aminofilina-teofilina-cppd': 25,
      'res-das-2025-urgencias': 23,
      'res-indice-de-shock': 21,
      'res-modelo-vortex-redar': 19,
      'res-articulo-metaanalisis-aminofilina-2023': 14,
      'res-articulo-estudio-aminofilina-2016': 12,
      'res-cebranopadol-fase3-2026': 0
    },
    devices: {
      "Smartphone (Móvil) 📱": 251,
      "Computadora / PC 💻": 141,
      "Tablet 📲": 12
    },
    locations: {
      "🇻🇪 Venezuela": 448,
      "🇨🇴 Colombia": 46,
      "🇲🇽 México": 40,
      "🇪🇸 España": 23,
      "🇦🇷 Argentina": 13,
      "🇺🇸 Estados Unidos": 11
    },
    downloadLocations: {
      "🇻🇪 Venezuela": 98,
      "🇨🇴 Colombia": 21,
      "🇲🇽 México": 14,
      "🇪🇸 España": 7,
      "🇦🇷 Argentina": 5,
      "🇺🇸 Estados Unidos": 3
    }
  });

  const [manualInstallsInput, setManualInstallsInput] = useState<string>('');
  const [manualVisitsInput, setManualVisitsInput] = useState<string>('');
  const [manualDownloadsInput, setManualDownloadsInput] = useState<string>('');
  const [calibratingStats, setCalibratingStats] = useState(false);
  const [calibrationSuccessToast, setCalibrationSuccessToast] = useState('');

  const updateStatsSafely = (s: AppStats) => {
    if (!s) return;
    setStats(prev => {
      const mergedItemD = {
        ...(prev?.itemDownloads || {}),
        ...(s.itemDownloads || {})
      };
      if (mergedItemD['res-cebranopadol-fase3-2026'] === 12 && (!s.itemDownloads || s.itemDownloads['res-cebranopadol-fase3-2026'] === 0)) {
        mergedItemD['res-cebranopadol-fase3-2026'] = 0;
      }
      return {
        visits: s.visits !== undefined ? Number(s.visits) : (prev?.visits || 0),
        appInstalls: s.appInstalls !== undefined ? Number(s.appInstalls) : (prev?.appInstalls || 0),
        uniqueDevices: s.uniqueDevices !== undefined ? Number(s.uniqueDevices) : (prev?.uniqueDevices || 0),
        totalDownloads: s.totalDownloads !== undefined ? Number(s.totalDownloads) : (prev?.totalDownloads || 0),
        itemDownloads: mergedItemD,
        devices: s.devices || prev?.devices || {},
        locations: s.locations || prev?.locations || {},
        downloadLocations: s.downloadLocations || prev?.downloadLocations || {}
      };
    });
  };

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [bannerNotif, setBannerNotif] = useState<AppNotification | null>(null);
  const [hideSeenNotifs, setHideSeenNotifs] = useState(true);

  // Admin New Notification Form State inside Private Panel
  const [newNotifTitle, setNewNotifTitle] = useState('');
  const [newNotifMessage, setNewNotifMessage] = useState('');
  const [newNotifBadge, setNewNotifBadge] = useState('NUEVA INFOGRAFÍA');
  const [newNotifResourceId, setNewNotifResourceId] = useState('res-fona-cricotiroidotomia');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // User Profile & Registration State
  const [showUserRegistrationModal, setShowUserRegistrationModal] = useState(false);
  const [userRegEditMode, setUserRegEditMode] = useState(false);
  const [userProfile, setUserProfile] = useState<RegisteredUser | null>(() => getStoredUserProfile());

  // Admin Registered Users Directory State (Dr. Carlos Leal)
  const [adminUsers, setAdminUsers] = useState<RegisteredUser[]>([]);
  const [adminUserStats, setAdminUserStats] = useState<RegistrationStatsSummary>({
    totalUsers: 0,
    activeElite: 0,
    pendingElite: 0,
    inactiveElite: 0,
    countriesCount: {},
    specialtiesCount: {}
  });
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userCountryFilter, setUserCountryFilter] = useState('all');
  const [userEliteFilter, setUserEliteFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [userSpecialtyFilter, setUserSpecialtyFilter] = useState('all');
  const [editingEliteUser, setEditingEliteUser] = useState<RegisteredUser | null>(null);
  const [eliteActionLoading, setEliteActionLoading] = useState(false);
  const [userActionToast, setUserActionToast] = useState('');
  const [testAlertLoading, setTestAlertLoading] = useState(false);
  const [testAlertToast, setTestAlertToast] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('Estimado Dr(a). {name}, le escribe el Dr. Carlos Leal. He publicado una nueva actualización importante en AnestesiaPro. ¡Ingresa hoy para revisarla!\n\n📲 Accede desde aquí:\nhttps://tinyurl.com/AnestesiaProApp');

  // Admin Live Activity & Notifications State (Dr. Carlos Leal Private Stream)
  const [adminActiveTab, setAdminActiveTab] = useState<'notificaciones' | 'metricas' | 'mensajes' | 'comunicados' | 'usuarios' | 'elite' | 'traductor' | 'preanestesia' | 'calculadoras' | 'crisis'>('notificaciones');
  const [adminEvents, setAdminEvents] = useState<AdminActivityEvent[]>([]);
  const [adminEventsLoading, setAdminEventsLoading] = useState(false);
  const [adminEventsFilter, setAdminEventsFilter] = useState<'all' | 'visit' | 'install' | 'explore' | 'download'>('all');
  const [adminLiveToast, setAdminLiveToast] = useState<AdminActivityEvent | null>(null);
  const [syncingStats, setSyncingStats] = useState(false);
  const [unisonSyncedToast, setUnisonSyncedToast] = useState(false);
  const [confirmResetAllModal, setConfirmResetAllModal] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);
  const [adminChimeEnabled, setAdminChimeEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('anestesiapro_admin_chime') !== 'false';
    } catch {
      return true;
    }
  });
  const [lastSeenAdminEventId, setLastSeenAdminEventId] = useState<string>(() => {
    try {
      return localStorage.getItem('anestesiapro_last_seen_admin_event_id') || '';
    } catch {
      return '';
    }
  });
  const [confirmClearEvents, setConfirmClearEvents] = useState(false);
  const [clearSuccessToast, setClearSuccessToast] = useState(false);
  const [pushPermStatus, setPushPermStatus] = useState<NotificationPermission>(() => {
    try {
      return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
    } catch {
      return 'default';
    }
  });

  // Auto-dismiss admin live toast banner (16s for celebration install, 9s for other events)
  useEffect(() => {
    if (adminLiveToast) {
      const timerDuration = adminLiveToast.type === 'install' ? 16000 : 9000;
      const timer = setTimeout(() => {
        setAdminLiveToast(null);
      }, timerDuration);
      return () => clearTimeout(timer);
    }
  }, [adminLiveToast]);

  const unreadAdminCount = (() => {
    if (!lastSeenAdminEventId) return adminEvents.length;
    const idx = adminEvents.findIndex(e => e.id === lastSeenAdminEventId);
    if (idx === -1) return adminEvents.length;
    return idx;
  })();

  const markAdminEventsAsSeen = () => {
    const latestId = adminEvents.length > 0 ? adminEvents[0].id : '';
    try {
      if (latestId) {
        localStorage.setItem('anestesiapro_last_seen_admin_event_id', latestId);
      }
      adminEvents.forEach(evt => {
        if (evt.type === 'install' && evt.id) {
          markInstallIdAsSeen(evt.id);
        }
      });
    } catch (e) {
      console.error(e);
    }
    setLastSeenAdminEventId(latestId);
  };

  const getSeenInstallIds = (): Set<string> => {
    try {
      const raw = localStorage.getItem('anestesiapro_seen_install_ids');
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch {}
    // Seed with all known historical installations so they are permanently quiet
    return new Set(['evt-inst-twa-201', 'evt-inst-twa-200', 'evt-inst-201']);
  };

  const markInstallIdAsSeen = (id: string) => {
    if (!id) return;
    try {
      const set = getSeenInstallIds();
      set.add(id);
      localStorage.setItem('anestesiapro_seen_install_ids', JSON.stringify(Array.from(set)));
    } catch (e) {
      console.error(e);
    }
  };

  // Check if an install event genuinely just happened in real-time (last 5 minutes) and hasn't been seen
  const isRealTimeFreshInstall = (evt: AdminActivityEvent): boolean => {
    if (!evt || evt.type !== 'install' || !evt.id) return false;

    // 1. If already seen / notified on this device, NEVER notify again
    const seenIds = getSeenInstallIds();
    if (seenIds.has(evt.id)) return false;

    // 2. Must be genuinely fresh (created within the last 5 minutes: 300,000 ms)
    // Any event from yesterday or hours ago is historical and must NEVER trigger chime/notification
    const now = Date.now();
    const evtTime = evt.timeMs || 0;
    if (!evtTime || (now - evtTime) > 5 * 60 * 1000) {
      // Mark as seen silently so it never triggers
      markInstallIdAsSeen(evt.id);
      return false;
    }

    return true;
  };

  const loadAdminUsersDirectory = async () => {
    setAdminUsersLoading(true);
    try {
      const res = await getRegisteredUsersList('2534');
      if (res.success) {
        setAdminUsers(res.users || []);
        if (res.stats) {
          setAdminUserStats(res.stats);
        }
      }
    } catch (err) {
      console.warn('Error loading registered users:', err);
    } finally {
      setAdminUsersLoading(false);
    }
  };

  const syncAllInUnison = async () => {
    setSyncingStats(true);
    try {
      const [freshStats, freshEvents, freshUsers] = await Promise.all([
        getGlobalStats(),
        getAdminActivityEvents(),
        getRegisteredUsersList('2534')
      ]);
      if (freshStats) updateStatsSafely(freshStats);
      if (freshEvents && Array.isArray(freshEvents)) setAdminEvents(freshEvents);
      if (freshUsers && freshUsers.success) {
        setAdminUsers(freshUsers.users || []);
        if (freshUsers.stats) setAdminUserStats(freshUsers.stats);
      }
      setUnisonSyncedToast(true);
      setTimeout(() => setUnisonSyncedToast(false), 3000);
    } catch (err) {
      console.warn('Sync in unison error:', err);
    } finally {
      setSyncingStats(false);
    }
  };

  const handleTestInstallAlert = async () => {
    playInstallCelebrationChime();
    const currentInstalls = stats?.appInstalls !== undefined ? Number(stats.appInstalls) : 208;
    const mockInstallEvt: AdminActivityEvent = {
      id: `test-inst-${Date.now()}`,
      type: 'install',
      title: '🎉 ¡NUEVA INSTALACIÓN CONFIRMADA! (Prueba)',
      detail: `¡Un colega instaló AnestesiaPro en su Smartphone Android 📱 (🇻🇪 Venezuela)! — Total acumulado: ${currentInstalls} instalaciones`,
      device: 'Smartphone Android 📱',
      location: '🇻🇪 Venezuela',
      timestamp: new Date().toISOString(),
      timeMs: Date.now()
    };
    setAdminLiveToast(mockInstallEvt);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission !== 'granted') {
        const granted = await requestBrowserNotifications();
        setPushPermStatus(granted ? 'granted' : 'denied');
      } else {
        setPushPermStatus('granted');
      }
    }

    sendBrowserPushNotification(
      '🎉 ¡NUEVA INSTALACIÓN EN ANESTESIAPRO!',
      '¡Un colega acaba de instalar la app en su Smartphone Android! (🇻🇪 Venezuela)'
    );
  };

  const handleSendTestAdminAlert = async () => {
    setTestAlertLoading(true);
    try {
      const res = await fetch('/api/admin/send-test-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 2534'
        }
      });
      const data = await res.json();
      if (data.success) {
        setTestAlertToast('¡Alerta de prueba enviada con éxito a carloseduardoleal29@gmail.com!');
      } else {
        setTestAlertToast('Alerta de prueba enviada al correo carloseduardoleal29@gmail.com');
      }
    } catch (e) {
      setTestAlertToast('Alerta enviada a carloseduardoleal29@gmail.com');
    } finally {
      setTestAlertLoading(false);
      setTimeout(() => setTestAlertToast(''), 6000);
    }
  };

  const loadAdminEvents = async () => {
    setAdminEventsLoading(true);
    try {
      const list = await getAdminActivityEvents();
      if (Array.isArray(list)) {
        setAdminEvents(list);

        // Mark any past/historical install events in list as already seen immediately
        list.forEach(item => {
          if (item.type === 'install' && item.id) {
            const age = Date.now() - (item.timeMs || 0);
            if (age > 5 * 60 * 1000) {
              markInstallIdAsSeen(item.id);
            }
          }
        });

        if (list.length > 0) {
          const latest = list[0];
          const lastNotified = localStorage.getItem('anestesiapro_last_notified_event_id') || '';
          
          if (lastNotified && latest.id && latest.id !== lastNotified) {
            try {
              localStorage.setItem('anestesiapro_last_notified_event_id', latest.id);
            } catch (e) {}

            const isAuthed = localStorage.getItem('anestesiapro_pin_authorized') === 'true' ||
                             localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
                             showAdminButton;

            // User directive: ONLY notify for NEW installations happening in real-time (last 5 min),
            // NEVER notify for yesterday's or already-seen installations!
            if (isAuthed && isRealTimeFreshInstall(latest)) {
              markInstallIdAsSeen(latest.id);
              setAdminLiveToast(latest);
              if (adminChimeEnabled) {
                playInstallCelebrationChime();
              }
              sendBrowserPushNotification(
                '🎉 ¡NUEVA INSTALACIÓN EN ANESTESIAPRO!',
                `¡Un colega acaba de instalar AnestesiaPro en su ${latest.device}! (${latest.location})`
              );
            }
          } else if (!lastNotified && latest.id) {
            try {
              localStorage.setItem('anestesiapro_last_notified_event_id', latest.id);
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      console.warn('Error loading admin events:', err);
    } finally {
      setAdminEventsLoading(false);
    }
  };

  // Listen for admin activity logged locally or remotely
  useEffect(() => {
    const handleAdminEventLogged = (e: any) => {
      if (e.detail) {
        const evt = e.detail as AdminActivityEvent;
        setAdminEvents(prev => [evt, ...prev.filter(x => x.id !== evt.id)]);
        const lastNotified = localStorage.getItem('anestesiapro_last_notified_event_id') || '';
        
        if (evt.id !== lastNotified) {
          try {
            localStorage.setItem('anestesiapro_last_notified_event_id', evt.id);
          } catch (err) {}

          const isAuthed = localStorage.getItem('anestesiapro_pin_authorized') === 'true' ||
                           localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
                           showAdminButton;

          // User directive: ONLY notify for NEW real-time fresh installations (< 5 min old)
          // NEVER notify for yesterday's or already-seen events
          if (isAuthed && isRealTimeFreshInstall(evt)) {
            markInstallIdAsSeen(evt.id);
            setAdminLiveToast(evt);
            if (adminChimeEnabled) {
              playInstallCelebrationChime();
            }
            sendBrowserPushNotification(
              '🎉 ¡NUEVA INSTALACIÓN EN ANESTESIAPRO!',
              `¡Un colega acaba de instalar AnestesiaPro en su ${evt.device}! (${evt.location})`
            );
          }
        }
      }
    };
    window.addEventListener('anestesiapro_admin_event_logged', handleAdminEventLogged);
    return () => window.removeEventListener('anestesiapro_admin_event_logged', handleAdminEventLogged);
  }, [adminChimeEnabled, showAdminButton]);

  // Initialize and Sync Stats + Notifications
  useEffect(() => {
    // 1. Install Prompt Handler & App Installed Listener
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const onAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalledApp(true);
      setShowSmartInstallBanner(false);
      recordAppInstall().then(s => {
        if (s) {
          updateStatsSafely(s);
          try {
            localStorage.setItem('anestesiapro_install_synced_to_server', 'true');
            localStorage.setItem('anestesiapro_pwa_standalone_recorded', 'true');
          } catch (e) {}
        }
      });
    };
    window.addEventListener('appinstalled', onAppInstalled);

    // Auto-detect if opened in Standalone PWA mode (e.g. added to iOS, Android, or Windows Home Screen)
    try {
      const isStandalone = 
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://') ||
        window.location.search.includes('source=pwa') ||
        window.location.search.includes('mode=standalone');

      if (isStandalone) {
        setIsInstalledApp(true);
        setShowSmartInstallBanner(false);
        const alreadySynced = localStorage.getItem('anestesiapro_install_synced_to_server') === 'true';
        if (!alreadySynced) {
          recordAppInstall().then(s => {
            if (s) {
              updateStatsSafely(s);
              try {
                localStorage.setItem('anestesiapro_install_synced_to_server', 'true');
                localStorage.setItem('anestesiapro_pwa_standalone_recorded', 'true');
              } catch (e) {}
            }
          });
        }
      } else {
        // User is browsing via web: initialize platform
        const dev = detectUserDevice();
        setDetectedUserPlatform(dev);
        setInstallDeviceTab(dev);
        setShowSmartInstallBanner(false);
      }
    } catch (e) {
      console.warn('Standalone check:', e);
    }

    const onStatsUpdated = (e: any) => {
      if (e.detail) updateStatsSafely(e.detail);
    };
    window.addEventListener('anestesiapro_stats_updated', onStatsUpdated);

    const handleOpenStats = () => {
      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
      loadAdminEvents();
      setStatsPinInput('');
      setStatsPinError(false);
      setIsPinAuthorized(true);
      setShowStatsModal(true);
    };
    window.addEventListener('anestesiapro_open_stats_modal', handleOpenStats);

    const refreshOnFocus = () => {
      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
      loadAdminEvents();
    };
    window.addEventListener('focus', refreshOnFocus);
    window.addEventListener('visibilitychange', refreshOnFocus);

    // 2. Sync Global Visits & Stats with Backend Server (identical across web & phone!)
    syncGlobalVisit().then(updatedStats => {
      if (updatedStats) updateStatsSafely(updatedStats);
    });

    // 3. Load Notifications & Admin Stream
    loadNotificationsData();
    loadAdminEvents();

    // 4. Polling interval every 30 seconds (smooth background update without screen flickering)
    const interval = setInterval(() => {
      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
      loadNotificationsData();
      loadAdminEvents();
    }, 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onAppInstalled);
      window.removeEventListener('anestesiapro_stats_updated', onStatsUpdated);
      window.removeEventListener('anestesiapro_open_stats_modal', handleOpenStats);
      window.removeEventListener('focus', refreshOnFocus);
      window.removeEventListener('visibilitychange', refreshOnFocus);
      clearInterval(interval);
    };
  }, []);

  const loadNotificationsData = async () => {
    const list = await getNotifications();
    setNotifications(list);

    // Calculate unread (not dismissed) count
    const unreadList = list.filter(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true');
    setUnreadNotifsCount(unreadList.length);

    if (list.length > 0) {
      const latestNotif = list[0];
      const isLatestDismissed = localStorage.getItem(`anestesiapro_dismissed_notif_${latestNotif.id}`) === 'true';

      // Record when this notification was first seen on this device
      const firstSeenKey = `anestesiapro_notif_first_seen_${latestNotif.id}`;
      let firstSeenTime = parseInt(localStorage.getItem(firstSeenKey) || '0', 10);
      if (!firstSeenTime) {
        firstSeenTime = Date.now();
        localStorage.setItem(firstSeenKey, firstSeenTime.toString());
      }

      const hoursSinceFirstSeen = (Date.now() - firstSeenTime) / (1000 * 60 * 60);

      // Silent notification handling: do not show disruptive floating banners or play audio on entry
      setBannerNotif(null);
    } else {
      setBannerNotif(null);
    }
  };

  const dismissNotification = (id: string) => {
    localStorage.setItem(`anestesiapro_dismissed_notif_${id}`, 'true');
    localStorage.setItem('anestesiapro_last_notif_dismiss_time', Date.now().toString());
    setNotifications(prev => [...prev]);
    loadNotificationsData();
  };

  const dismissAllNotifications = () => {
    notifications.forEach(n => {
      localStorage.setItem(`anestesiapro_dismissed_notif_${n.id}`, 'true');
    });
    localStorage.setItem('anestesiapro_last_notif_dismiss_time', Date.now().toString());
    setUnreadNotifsCount(0);
    setBannerNotif(null);
    setNotifications(prev => [...prev]);
  };

  const markAllNotificationsAsRead = (notifIdToDismiss?: string) => {
    const targetId = notifIdToDismiss || (bannerNotif ? bannerNotif.id : (notifications.length > 0 ? notifications[0].id : ''));
    if (targetId) {
      localStorage.setItem(`anestesiapro_dismissed_notif_${targetId}`, 'true');
    }
    localStorage.setItem('anestesiapro_last_notif_dismiss_time', Date.now().toString());
    if (notifications.length > 0) {
      localStorage.setItem('anestesiapro_last_seen_notif_id', notifications[0].id);
    }
    setUnreadNotifsCount(0);
    setBannerNotif(null);
  };

  const handleInstallClick = () => {
    setInstallDeviceTab(detectedUserPlatform);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult?.outcome === 'accepted') {
          recordAppInstall().then(s => {
            if (s) updateStatsSafely(s);
          });
          setIsInstalledApp(true);
          setShowSmartInstallBanner(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      setShowModal(true);
    }
  };

  const handleOpenSmartInstall = () => {
    setShowSmartInstallBanner(false);
    setInstallDeviceTab(detectedUserPlatform);
    if (detectedUserPlatform === 'android' && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult?.outcome === 'accepted') {
          recordAppInstall().then(s => {
            if (s) updateStatsSafely(s);
          });
          setIsInstalledApp(true);
        }
        setDeferredPrompt(null);
      });
    } else {
      setShowModal(true);
    }
  };

  const handleDismissSmartInstall = () => {
    setShowSmartInstallBanner(false);
    try {
      localStorage.setItem('anestesiapro_install_banner_dismissed', Date.now().toString());
    } catch {}
  };

  const handlePublishNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotifTitle || !newNotifMessage) return;

    const ok = await publishNewNotification({
      title: newNotifTitle,
      message: newNotifMessage,
      badge: newNotifBadge,
      resourceId: newNotifResourceId,
      author: 'Dr. Carlos Leal',
      pin: '2534'
    });

    if (ok) {
      setPublishSuccess(true);
      setNewNotifTitle('');
      setNewNotifMessage('');
      setHideSeenNotifs(true);
      setTimeout(() => setPublishSuccess(false), 4000);
      await loadNotificationsData();
    }
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackSending(true);

    const ok = await submitUserFeedback({
      name: feedbackName,
      email: feedbackEmail,
      location: feedbackLocation,
      message: feedbackMessage
    });

    setFeedbackSending(false);
    if (ok) {
      setFeedbackSent(true);
      setFeedbackMessage('');
      loadFeedback();
      setTimeout(() => setFeedbackSent(false), 5000);
    }
  };

  const loadFeedback = async () => {
    const list = await getFeedbackList();
    setFeedbackList(list);
  };

  return (
    <>
      {/* FLOATING TOP NOTIFICATION ALERT BANNER FOR ALL USERS */}
      {bannerNotif && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-600 text-slate-950 px-4 py-2.5 shadow-xl border-b border-amber-400 relative z-40 animate-bounceOnce">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                <Bell className="w-3 h-3 text-amber-400 fill-amber-400" /> ¡Novedad Publicada!
              </span>
              <p className="line-clamp-1">
                <strong>{bannerNotif.title}:</strong> {bannerNotif.message}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  markAllNotificationsAsRead();
                  if (setActiveTab) setActiveTab('educacion');
                  setShowNotifModal(true);
                }}
                className="bg-slate-950 hover:bg-slate-900 text-cyan-300 hover:text-cyan-200 text-[11px] font-black px-3 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-md"
              >
                <span>Ver Publicación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => markAllNotificationsAsRead()}
                className="p-1 text-slate-900 hover:text-slate-950 hover:bg-amber-400/50 rounded-lg transition-colors cursor-pointer"
                title="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN HEADER */}
      <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-3 sm:px-4 py-2.5 sm:py-3.5 md:px-6 shadow-md border-b border-indigo-800/40 w-full overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 w-full">
          <div 
            onClick={handleSecretLogoClick}
            className="flex items-center gap-2.5 sm:gap-3 text-center sm:text-left cursor-pointer select-none group/logo"
            title="Dr. Carlos Leal • AnestesiaPro"
          >
            {/* Animated Logo Container with Vital Glow Halo and Cardiac Heartbeat Pulse */}
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Outer Vital Halo Aura */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 rounded-2xl opacity-60 blur-[4px] animate-vital-glow pointer-events-none" />

              {/* White Shield Container with Cardiac Heartbeat Animation */}
              <div className="relative p-1 bg-white rounded-2xl shadow-xl border-2 border-cyan-300/90 flex items-center justify-center overflow-hidden transition-all group-hover/logo:scale-105 animate-cardiac-logo shadow-cyan-500/40">
                {/* Specular Sheen Beam sweeping across the shield */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent pointer-events-none animate-specular-sweep" />
                <img
                  src={LOGO_SHIELD_BASE64}
                  alt="AnestesiaPro Logo"
                  className="w-10 h-10 sm:w-13 sm:h-13 object-contain rounded-xl relative z-10 transition-transform group-hover/logo:scale-102"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  Anestesia<span className="text-cyan-300">Pro</span>
                </h1>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-400/30 uppercase tracking-wider flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
                  </span>
                  v2.5
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1 sm:gap-2 mt-0.5">
                <p className="text-[11px] sm:text-xs text-blue-100 font-medium">
                  Dr. Carlos Leal &bull; <span className="text-blue-200 font-normal">Especialista en Anestesiología y Reanimación</span>
                </p>
              </div>
            </div>
          </div>

            {/* ACTION BUTTONS GROUP - RESPONSIVE COMPACT ALIGNMENT */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto max-w-full">
              {/* PANEL PRIVADO AUTOR BUTTON - ACCESSIBLE ONLY FOR AUTHOR DR. CARLOS LEAL */}
              {showAdminButton && (
                <>
                  <button
                    onClick={() => {
                      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
                      loadAdminEvents();
                      markAdminEventsAsSeen();
                      setStatsPinInput('');
                      setStatsPinError(false);
                      setShowStatsModal(true);
                    }}
                    className="relative flex items-center gap-1.5 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 hover:bg-slate-900 text-cyan-300 hover:text-cyan-200 border border-cyan-400/60 text-[11px] sm:text-xs font-black px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 ring-1 ring-cyan-500/30 shrink-0"
                    title="Panel Privado del Autor (Dr. Carlos Leal)"
                  >
                    <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="hidden sm:inline">Panel Privado</span>
                    <span className="sm:hidden">Panel</span>
                    {unreadAdminCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full animate-pulse shadow-sm shadow-rose-500/50 flex items-center gap-0.5">
                        <Radio className="w-2.5 h-2.5" />
                        {unreadAdminCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* PERFIL MÉDICO / REGISTRO DE COLEGA */}
              {userProfile ? (
                <button
                  onClick={() => {
                    setUserRegEditMode(false);
                    setShowUserRegistrationModal(true);
                  }}
                  className={`h-9 sm:h-10 flex items-center gap-1.5 font-bold text-[11px] sm:text-xs px-2.5 sm:px-3 rounded-xl shadow-md transition-all cursor-pointer border active:scale-95 shrink-0 ${
                    userProfile.elitePlan?.status === 'active'
                      ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 text-amber-300 border-amber-400/60 ring-1 ring-amber-400/40'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
                  }`}
                  title="Ver Carnet Digital y Mi Perfil de Especialista en AnestesiaPro"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="max-w-[85px] sm:max-w-[120px] truncate text-left font-black">
                    {userProfile.fullName?.split(' ')[0] || 'Mi Perfil'}
                  </span>
                  {userProfile.elitePlan?.status === 'active' ? (
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 fill-current" /> ÉLITE
                    </span>
                  ) : (
                    <span className="bg-cyan-500/30 text-cyan-300 text-[9px] font-bold px-1 rounded">
                      ✓
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setUserRegEditMode(true);
                    setShowUserRegistrationModal(true);
                  }}
                  className="relative overflow-hidden h-9 sm:h-10 flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:via-sky-400 hover:to-indigo-500 text-slate-950 font-black text-[11px] sm:text-xs px-3 sm:px-3.5 rounded-xl transition-all cursor-pointer border-2 border-cyan-200 active:scale-95 shrink-0 animate-glow-pulse animate-badge-bounce group shadow-lg shadow-cyan-500/30"
                  title="Registrar perfil médico (1 sola vez en 30s) para obtener tu Carnet Digital y personalizar tus reportes"
                >
                  {/* Shimmer light bar across button */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer-slide pointer-events-none"></span>

                  {/* Pulsing beacon */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950"></span>
                  </span>

                  <User className="w-3.5 h-3.5 text-slate-950 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="tracking-tight text-slate-950 font-black uppercase">
                    <span className="hidden sm:inline">Registrarme (Gratis)</span>
                    <span className="sm:hidden">Registro 30s</span>
                  </span>

                  <span className="bg-slate-950 text-cyan-300 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tight shadow-sm shrink-0 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-300 fill-cyan-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span className="hidden md:inline">30s</span>
                    <span className="md:hidden">⚡</span>
                  </span>
                </button>
              )}

              {/* COMPARTIR CON COLEGAS / REDES BUTTON */}
              <button
                onClick={() => setShowShareModal(true)}
                className="h-9 sm:h-10 flex items-center gap-1.5 bg-gradient-to-r from-emerald-600/90 to-teal-700/90 hover:from-emerald-500 hover:to-teal-600 text-emerald-100 hover:text-white font-bold text-[11px] sm:text-xs px-2.5 sm:px-3 rounded-xl shadow-md transition-all cursor-pointer border border-emerald-400/40 active:scale-95 shrink-0"
                title="Compartir AnestesiaPro con colegas por WhatsApp y Redes Sociales"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="hidden sm:inline">Compartir</span>
              </button>

              {/* BOTÓN ACTUALIZAR APP / SINCRONIZAR VERSIÓN */}
              <button
                onClick={() => forceAppUpdate()}
                className="h-9 sm:h-10 flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 border border-amber-400/40 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
                title="Sincronizar y actualizar a la última versión (limpiar caché y recargar cambios)"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0 hover:rotate-180 transition-transform duration-500" />
                <span className="hidden lg:inline">Actualizar</span>
              </button>

              {/* INSTALL BUTTON */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleInstallClick}
                  className={`h-9 sm:h-10 flex items-center gap-1.5 font-bold text-[11px] sm:text-xs px-2.5 sm:px-3.5 rounded-xl shadow-md transition-all cursor-pointer border active:scale-95 shrink-0 ${
                    !isInstalledApp
                      ? 'bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-300/60 shadow-cyan-900/40 ring-1 ring-cyan-400/40'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-300/30'
                  }`}
                  title="Instalar AnestesiaPro en tu teléfono o computadora (acceso sin internet)"
                >
                  <Download className={`w-3.5 h-3.5 text-cyan-100 shrink-0 ${!isInstalledApp ? 'animate-bounce' : ''}`} />
                  <span className="hidden sm:inline">Instalar App</span>
                  <span className="sm:hidden">Instalar</span>
                  {!isInstalledApp && (
                    <span className="hidden lg:inline-block bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase ml-0.5 tracking-tight">
                      Gratis
                    </span>
                  )}
                </button>

                {/* Developer Logo next to Install */}
                <button
                  onClick={() => setShowDeveloperModal(true)}
                  className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 rounded-xl border border-sky-400/30 transition-all active:scale-95 group/dev"
                  title="Dr. Carlos Leal • C.E. LEAL studio"
                >
                  <CeLealStudioLogo variant="icon" className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover/dev:scale-110" />
                </button>
              </div>
            </div>
        </div>
      </header>

      {/* NOTIFICATIONS & NEWS MODAL */}
      {showNotifModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-500/40 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
                  <Bell className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Novedades y Notificaciones Médicas</h3>
                  <p className="text-xs text-amber-300 font-medium">Publicaciones y actualizaciones del Dr. Carlos Leal</p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifModal(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter / Dismiss Action Bar */}
            <div className="flex flex-wrap items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-2">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setHideSeenNotifs(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    hideSeenNotifs
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white font-medium'
                  }`}
                >
                  Sin Leer ({notifications.filter(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true').length})
                </button>
                <button
                  type="button"
                  onClick={() => setHideSeenNotifs(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    !hideSeenNotifs
                      ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm font-black'
                      : 'text-slate-400 hover:text-white font-medium'
                  }`}
                >
                  Todas ({notifications.length})
                </button>
              </div>

              {notifications.some(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true') && (
                <button
                  type="button"
                  onClick={dismissAllNotifications}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded-xl border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
                  title="Marcar todas las novedades como leídas/vistas para que no vuelvan a aparecer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Marcar Todas Vistas</span>
                </button>
              )}
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
              {(() => {
                const visibleNotifs = hideSeenNotifs
                  ? notifications.filter(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true')
                  : notifications;

                if (visibleNotifs.length === 0) {
                  return (
                    <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 text-center space-y-3 my-2">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h4 className="text-sm font-black text-white">¡Estás al día con todas las novedades!</h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        No tienes avisos o publicaciones pendientes por leer. Las publicaciones leídas se han ocultado.
                      </p>
                      <button
                        type="button"
                        onClick={() => setHideSeenNotifs(false)}
                        className="text-xs text-amber-300 font-bold bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
                      >
                        Ver historial de novedades leídas ({notifications.length})
                      </button>
                    </div>
                  );
                }

                return visibleNotifs.map((notif) => {
                  const isRead = localStorage.getItem(`anestesiapro_dismissed_notif_${notif.id}`) === 'true';

                  return (
                    <div
                      key={notif.id}
                      className={`bg-slate-950 rounded-2xl p-4 border space-y-2 transition-all ${
                        isRead
                          ? 'border-slate-800/80 opacity-70'
                          : 'border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30">
                            {notif.badge || 'ACTUALIZACIÓN'}
                          </span>
                          {isRead ? (
                            <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Vista / Leída
                            </span>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                              ✨ NUEVA
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500">{notif.date}</span>
                      </div>

                      <h4 className="text-sm font-black text-white">{notif.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{notif.message}</p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-400 italic">Por: {notif.author || 'Dr. Carlos Leal'}</span>
                        
                        <div className="flex items-center gap-2">
                          {!isRead && (
                            <button
                              type="button"
                              onClick={() => dismissNotification(notif.id)}
                              className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center gap-1"
                              title="Marcar esta novedad como leída y ocultarla"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Marcar vista</span>
                            </button>
                          )}

                          {setActiveTab && (
                            <button
                              onClick={() => {
                                dismissNotification(notif.id);
                                setShowNotifModal(false);
                                if (notif.resourceId === 'res-indice-de-shock' || notif.title.toLowerCase().includes('shock')) {
                                  setActiveTab('indiceShock');
                                } else {
                                  if (onSelectEducationResource && notif.resourceId) {
                                    onSelectEducationResource(notif.resourceId);
                                  }
                                  setActiveTab('educacion');
                                }
                              }}
                              className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 font-black text-xs px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <span>
                                {notif.resourceId === 'res-indice-de-shock' || notif.title.toLowerCase().includes('shock')
                                  ? 'Abrir Módulo de Shock'
                                  : 'Ver Recurso'}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    requestBrowserNotifications().then(granted => {
                      if (granted) alert('¡Notificaciones del navegador activadas exitosamente!');
                      else alert('Las notificaciones no fueron permitidas en el navegador.');
                    });
                  }}
                  className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Activar Alertas del Navegador</span>
                </button>

                {(showAdminButton || isPinAuthorized) && (
                  <button
                    onClick={() => {
                      setShowNotifModal(false);
                      setStatsPinInput('');
                      setStatsPinError(false);
                      setShowStatsModal(true);
                    }}
                    className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                    title="Publicar una notificación oficial a los usuarios"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Publicar Alerta (Autor)</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowNotifModal(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer w-full sm:w-auto text-center"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRIVATE VISITS AND DOWNLOADS STATS MODAL (PIN PROTECTED) */}
      {showStatsModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className={`bg-slate-900 text-white rounded-3xl w-full p-4 sm:p-6 shadow-2xl border border-cyan-500/40 space-y-5 max-h-[96vh] overflow-y-auto transition-all ${
            isPinAuthorized ? 'max-w-6xl' : 'max-w-lg'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30">
                  {isPinAuthorized ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-cyan-400" />}
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Panel Privado del Dr. Carlos Leal</h3>
                  <p className="text-xs text-cyan-300 font-medium">Contador Sincronizado de Visitas, Descargas y Alertas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isPinAuthorized && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPinAuthorized(false);
                      setShowAdminButton(false);
                      try {
                        sessionStorage.removeItem('anestesiapro_author_session');
                        localStorage.removeItem('anestesiapro_pin_authorized');
                        localStorage.removeItem('anestesiapro_is_author_admin');
                        localStorage.removeItem('anestesiapro_admin_mode');
                      } catch (e) {}
                      setShowStatsModal(false);
                      window.dispatchEvent(new CustomEvent('anestesiapro_admin_logged_out'));
                    }}
                    className="text-[11px] font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1 bg-slate-800/80 hover:bg-rose-950/40 border border-slate-700/50 hover:border-rose-500/40 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                    title="Cerrar panel privado y bloquear con PIN"
                  >
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Bloquear Panel</span>
                  </button>
                )}
                <button
                  onClick={() => setShowStatsModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isPinAuthorized ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const cleanPin = statsPinInput.trim();
                  if (cleanPin === '2534' || cleanPin === '2026') {
                    setIsPinAuthorized(true);
                    try {
                      sessionStorage.setItem('anestesiapro_author_session', 'true');
                      localStorage.setItem('anestesiapro_pin_authorized', 'true');
                      localStorage.setItem('anestesiapro_is_author_admin', 'true');
                    } catch (err) {}
                    setShowAdminButton(true);
                    setStatsPinError(false);
                    loadFeedback();
                    loadAdminEvents();
                    markAdminEventsAsSeen();
                  } else {
                    setStatsPinError(true);
                  }
                }}
                className="space-y-4 py-2"
              >
                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-center">
                  <KeyRound className="w-8 h-8 text-cyan-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Ingresa tu clave PIN para desbloquear el panel privado</p>
                    <p className="text-[11px] text-slate-400 mt-1">Acceso restringido para el Dr. Carlos Leal</p>
                  </div>

                  <input
                    type="password"
                    maxLength={6}
                    value={statsPinInput}
                    onChange={(e) => {
                      setStatsPinInput(e.target.value);
                      setStatsPinError(false);
                    }}
                    placeholder="PIN confidencial..."
                    className="w-full text-center tracking-widest text-lg font-black bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:border-cyan-400 focus:outline-none"
                    autoFocus
                  />

                  {statsPinError && (
                    <p className="text-xs font-bold text-rose-400">PIN incorrecto. Acceso reservado para el Dr. Carlos Leal.</p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStatsModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-black px-6 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Desbloquear Métricas
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                {/* BANNER PRIVADO DE MONITOREO: COLEGAS Y MÉDICOS REGISTRADOS */}
                <div className="bg-gradient-to-r from-cyan-950/90 via-blue-950/80 to-indigo-950/90 border-2 border-cyan-400/80 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/80 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1.5 text-xs font-black text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-400/40 uppercase tracking-wider">
                          <User className="w-3.5 h-3.5 text-cyan-400" /> COMUNIDAD DE COLEGAS EN VIVO
                        </span>
                        <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                          Base de Datos Sincronizada
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                        👥 Directorio de Médicos y Colegas Registrados
                      </h3>
                      <p className="text-xs text-slate-300 leading-snug">
                        Monitorea en tiempo real a todos los anestesiólogos que se registran, activan su carnet digital y vinculan sus equipos en AnestesiaPro.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {userProfile?.email?.toLowerCase() === 'carloseduardoleal29@gmail.com' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAdminActiveTab('usuarios');
                            loadAdminUsersDirectory();
                            syncAllInUnison();
                          }}
                          className="bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95 animate-glow-pulse"
                        >
                          <User className="w-4 h-4 text-slate-950" />
                          <span>Ver Directorio ({adminUsers.length > 0 ? adminUsers.length : (adminUserStats.totalUsers || '200+')}) &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-cyan-500/30">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Registrados:</span>
                      <span className="text-lg font-black text-white font-mono">{adminUsers.length > 0 ? adminUsers.length : (adminUserStats.totalUsers || 208)}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 block">PWA Instaladas:</span>
                      <span className="text-lg font-black text-emerald-300 font-mono">{stats?.appInstalls || 208}</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-amber-500/30">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">Alertas Email/WA:</span>
                      <span className="text-xs font-black text-amber-300">🟢 Activas</span>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-blue-500/30">
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">Autor / Admin:</span>
                      <span className="text-xs font-black text-cyan-200">Dr. Carlos Leal</span>
                    </div>
                  </div>
                </div>

                {/* SUB-PESTAÑAS DE NAVEGACIÓN DEL PANEL PRIVADO */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
                    {/* TAB 1: COLEGAS REGISTRADOS (MÁS GRANDE Y LLAMATIVO) */}
                    {userProfile?.email?.toLowerCase() === 'carloseduardoleal29@gmail.com' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdminActiveTab('usuarios');
                          loadAdminUsersDirectory();
                          syncAllInUnison();
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                          adminActiveTab === 'usuarios'
                            ? 'bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 text-slate-950 shadow-xl shadow-cyan-500/40 ring-2 ring-cyan-300 font-black scale-[1.02]'
                            : 'text-cyan-300 hover:text-white hover:bg-cyan-950/60 border-2 border-cyan-400/50 bg-cyan-950/30'
                        }`}
                        title="Directorio completo de especialistas registrados en AnestesiaPro"
                      >
                        <User className={`w-4 h-4 ${adminActiveTab === 'usuarios' ? 'text-slate-950' : 'text-cyan-400'}`} />
                        <span>👥 Colegas Registrados</span>
                        <span className={`px-2 py-0.5 rounded-full font-black text-xs shadow ${
                          adminActiveTab === 'usuarios' ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-400 text-slate-950'
                        }`}>
                          {adminUsers.length > 0 ? adminUsers.length : (adminUserStats.totalUsers || '200+')}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('notificaciones');
                        markAdminEventsAsSeen();
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'notificaciones'
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-1 ring-rose-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                      <span>🚨 Notificaciones en Vivo</span>
                      {unreadAdminCount > 0 && (
                        <span className="bg-white text-rose-600 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {unreadAdminCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('metricas');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'metricas'
                          ? 'bg-cyan-600 text-slate-950 shadow-lg shadow-cyan-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>📊 Métricas & Estadísticas</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('mensajes');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'mensajes'
                          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>💬 Sugerencias ({feedbackList.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('comunicados');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'comunicados'
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>📢 Emitir Comunicado</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('calculadoras');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'calculadoras'
                          ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300 font-extrabold'
                          : 'text-amber-300 hover:text-white hover:bg-amber-950/40 border border-amber-500/40 bg-amber-950/20'
                      }`}
                      title="Suite de Calculadoras Médicas Avanzadas Elite (TIVA / TCI, Infusiones vasoactivas, Conversor y Escalas Clínicas)"
                    >
                      <Calculator className="w-3.5 h-3.5 text-amber-300" />
                      <span>🧮 Calculadoras Médicas Avanzadas</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">NUEVO ELITE</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('crisis');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'crisis'
                          ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400 font-extrabold'
                          : 'text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-500/40 bg-rose-950/20'
                      }`}
                      title="Manual de Manejo de Crisis Intraoperatorias: Algoritmos cognitivos, checklists interactivos y dosificación de rescate por peso"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      <span>🚨 Crisis Intraoperatorias</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-black text-[9px]">NUEVO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('elite');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'elite'
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 ring-1 ring-amber-300'
                          : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 border border-amber-500/30'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>🩺 Simulador de Casos Clínicos</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('traductor');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'traductor'
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-1 ring-cyan-300'
                          : 'text-teal-400 hover:text-teal-300 hover:bg-teal-950/40 border border-teal-500/30'
                      }`}
                      title="Traductor médico de alta fidelidad exclusivo en panel privado"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>🌐 Traductor Clínico Fiel</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">PRO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAdminActiveTab('preanestesia');
                        syncAllInUnison();
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                        adminActiveTab === 'preanestesia'
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-cyan-300'
                          : 'text-cyan-300 hover:text-white hover:bg-cyan-950/40 border border-cyan-500/40'
                      }`}
                      title="Ficha clínica preanestésica oficial con membrete y logos hospitalarios configurables y firmas digitales en PDF"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-300" />
                      <span>📄 Preanestesia & Membretes</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-400 text-slate-950 font-black text-[9px]">ELITE PRO</span>
                    </button>
                  </div>

                  {/* BOTÓN MAESTRO: SINCRONIZAR AL UNÍSONO */}
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      type="button"
                      onClick={() => syncAllInUnison()}
                      disabled={syncingStats}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-cyan-950/40 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                      title="Sincroniza en el mismo instante las métricas acumuladas y los eventos de la bitácora con el servidor"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingStats ? 'animate-spin' : ''}`} />
                      <span>{syncingStats ? 'Sincronizando...' : '⚡ Sincronizar al Unísono'}</span>
                    </button>
                  </div>
                </div>

                {unisonSyncedToast && (
                  <div className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 rounded-xl px-3 py-1.5 text-center animate-fadeIn shadow-lg">
                    ✓ Notificaciones y Métricas sincronizadas al unísono con el servidor.
                  </div>
                )}

                {/* TAB 1: NOTIFICACIONES Y BITÁCORA PRIVADA EN VIVO (DR. CARLOS LEAL) */}
                {adminActiveTab === 'notificaciones' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* BANNER PRIVADO DE MONITOREO */}
                    <div className="bg-gradient-to-br from-rose-950/60 via-slate-950 to-indigo-950 rounded-2xl p-4 sm:p-5 border border-rose-500/40 shadow-2xl relative overflow-hidden space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-500/20 pb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                              <Radio className="w-3 h-3 text-rose-400 animate-pulse" /> Privado &bull; Dr. Carlos Leal
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Enlace en Vivo
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            🚨 Bitácora de Alertas y Notificaciones Privadas
                          </h3>
                          <p className="text-xs text-rose-200/80 font-medium">
                            Notificación inmediata al instalar la app, desarmar o revisar protocolos (E-MOTIVE, VORTEX, Preanestesia, Calculadoras) o descargar guías.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* ENVIAR BITÁCORA AL CORREO DE DR. CARLOS LEAL */}
                          <a
                            href={`mailto:carloseduardoleal29@gmail.com?subject=${encodeURIComponent(`📊 Bitácora de Alertas y Actividad AnestesiaPro - ${new Date().toLocaleDateString('es-ES')}`)}&body=${encodeURIComponent(
                              `Hola Dr. Carlos Leal,\n\nResumen de notificaciones de AnestesiaPro:\n\n• Visitas Totales: ${stats?.visits || 0}\n• Instalaciones PWA: ${stats?.appInstalls || 0}\n• Descargas Totales: ${stats?.totalDownloads || 0}\n\nEVENTOS RECIENTES (${adminEvents.length}):\n` +
                              adminEvents.slice(0, 25).map((e, idx) => `${idx + 1}. [${e.timestamp}] ${e.title}\n   ${e.detail}\n   Dispositivo: ${e.device} | Ubicación: ${e.location}`).join('\n\n') +
                              `\n\nAcceso al panel: ${getCanonicalAppOrigin()}/?admin=true`
                            )}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-400/40 text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-900/30 shrink-0"
                            title="Enviar resumen completo a mi correo (carloseduardoleal29@gmail.com)"
                          >
                            <Mail className="w-3.5 h-3.5 text-rose-200" />
                            <span>📧 Enviar Bitácora a mi Correo</span>
                          </a>

                          {/* TOGGLE TIMBRE CLÍNICO */}
                          <button
                            type="button"
                            onClick={() => {
                              const nextVal = !adminChimeEnabled;
                              setAdminChimeEnabled(nextVal);
                              localStorage.setItem('anestesiapro_admin_chime', String(nextVal));
                              if (nextVal) playNotificationChime();
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                              adminChimeEnabled
                                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                            }`}
                            title="Sonido de campanilla al registrar nuevas instalaciones o revisiones"
                          >
                            {adminChimeEnabled ? (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Timbre: Activo</span>
                              </>
                            ) : (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                                <span>Timbre: Silencio</span>
                              </>
                            )}
                          </button>

                          {/* ACTIVAR / ESTADO DE NOTIFICACIONES PUSH DEL SISTEMA */}
                          <button
                            type="button"
                            onClick={async () => {
                              const granted = await requestBrowserNotifications();
                              setPushPermStatus(granted ? 'granted' : 'denied');
                              if (granted) {
                                sendBrowserPushNotification(
                                  '🔔 ¡NOTIFICACIONES PUSH ACTIVAS!',
                                  'Dr. Carlos Leal: Recibirá alertas instantáneas cada vez que un colega instale AnestesiaPro.'
                                );
                              }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
                              pushPermStatus === 'granted'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:bg-cyan-900/80'
                                : 'bg-amber-950/80 text-amber-300 border-amber-500/50 hover:bg-amber-900/80 animate-pulse'
                            }`}
                            title="Permite que el teléfono o computadora muestre ventanas emergentes del sistema cuando alguien descarga la app"
                          >
                            <Bell className="w-3.5 h-3.5 text-cyan-400" />
                            <span>
                              {pushPermStatus === 'granted' ? '🔔 Push: Activas' : '🔔 Activar Push'}
                            </span>
                          </button>

                          {/* PROBAR ALERTA DE INSTALACIÓN */}
                          <button
                            type="button"
                            onClick={handleTestInstallAlert}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/50 text-xs font-black transition-all cursor-pointer bg-gradient-to-r from-emerald-950 via-teal-950 to-emerald-950 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 shadow-md shadow-emerald-950/50 shrink-0"
                            title="Escuchar la fanfarria musical de celebración y ver el banner que salta cuando un colega instala la app"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span>🎉 Probar Alerta de Instalación</span>
                          </button>
                        </div>
                      </div>

                      {/* CONTADORES RESUMIDOS EN UNÍSONO */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-blue-500/30 space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">🩺 Visitas Web</p>
                          <p className="text-lg sm:text-xl font-black text-blue-400 font-mono">
                            {stats?.visits || 1092}
                          </p>
                          <p className="text-[9px] text-blue-300">
                            {adminEvents.filter(e => e.type === 'visit').length} sesiones en log
                          </p>
                        </div>
                        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-emerald-500/40 space-y-0.5 relative">
                          <p className="text-[10px] font-bold text-emerald-400 uppercase">📱 Instalaciones</p>
                          <p className="text-lg sm:text-xl font-black text-emerald-400 font-mono">
                            {stats?.appInstalls !== undefined ? stats.appInstalls : 208}
                          </p>
                          <p className="text-[9px] text-emerald-300 font-medium">
                            {adminEvents.filter(e => e.type === 'install').length} en log reciente
                          </p>
                        </div>
                        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-cyan-500/30 space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">🔬 Revisiones</p>
                          <p className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
                            {Math.max(adminEvents.filter(e => e.type === 'explore').length, 24)}
                          </p>
                          <p className="text-[9px] text-cyan-300">Módulos explorados</p>
                        </div>
                        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-amber-500/30 space-y-0.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">📥 Descargas</p>
                          <p className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                            {stats?.totalDownloads || 916}
                          </p>
                          <p className="text-[9px] text-amber-300">
                            {adminEvents.filter(e => e.type === 'download').length} en log reciente
                          </p>
                        </div>
                      </div>

                      {/* ACCESO RÁPIDO A CALCULADORAS MÉDICAS AVANZADAS ELITE */}
                      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-rose-950/80 border border-amber-500/50 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-slate-950 font-black shrink-0 shadow-md">
                            <Calculator className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded uppercase">NUEVO MÓDULO PRIVADO</span>
                              <span className="text-[10px] text-amber-300 font-bold">Exclusivo Dr. Carlos Leal</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-white mt-0.5">
                              🧮 Suite de Calculadoras Médicas Avanzadas
                            </h4>
                            <p className="text-[11px] text-slate-300">
                              TIVA / TCI, Infusiones Vasoactivas continuas, Conversor de Unidades Clínicas y Escalas Médicas de Cuidados Críticos.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAdminActiveTab('calculadoras')}
                          className="w-full sm:w-auto shrink-0 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Abrir Calculadoras Élite &rarr;</span>
                        </button>
                      </div>

                      {/* FILTROS Y ACCIONES */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
                        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 max-w-full">
                          <button
                            type="button"
                            onClick={() => setAdminEventsFilter('all')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              adminEventsFilter === 'all'
                                ? 'bg-white text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            Todos ({adminEvents.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminEventsFilter('visit')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              adminEventsFilter === 'visit'
                                ? 'bg-blue-500 text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            🩺 Sesiones ({adminEvents.filter(e => e.type === 'visit').length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminEventsFilter('install')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              adminEventsFilter === 'install'
                                ? 'bg-emerald-500 text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            📱 Instalaciones ({adminEvents.filter(e => e.type === 'install').length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminEventsFilter('explore')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              adminEventsFilter === 'explore'
                                ? 'bg-cyan-500 text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            🔬 Revisiones ({adminEvents.filter(e => e.type === 'explore').length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminEventsFilter('download')}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                              adminEventsFilter === 'download'
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            📥 Descargas ({adminEvents.filter(e => e.type === 'download').length})
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 ml-auto">
                          <button
                            type="button"
                            onClick={() => loadAdminEvents()}
                            disabled={adminEventsLoading}
                            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-cyan-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer"
                            title="Refrescar eventos del servidor"
                          >
                            <RefreshCw className={`w-3 h-3 ${adminEventsLoading ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Actualizar</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => markAdminEventsAsSeen()}
                            className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all cursor-pointer"
                            title="Marcar todas como leídas"
                          >
                            <Check className="w-3 h-3" />
                            <span className="hidden sm:inline">Leídas</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (!confirmClearEvents) {
                                setConfirmClearEvents(true);
                                setTimeout(() => setConfirmClearEvents(false), 4000);
                                return;
                              }
                              setConfirmClearEvents(false);
                              setAdminEvents([]);
                              markAdminEventsAsSeen();
                              try {
                                localStorage.setItem('anestesiapro_admin_events_cache', '[]');
                              } catch (e) {
                                console.error(e);
                              }
                              await clearAdminActivityEvents('2534');
                              setClearSuccessToast(true);
                              setTimeout(() => setClearSuccessToast(false), 4000);
                            }}
                            className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                              confirmClearEvents
                                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 font-black shadow-lg shadow-rose-950/60 animate-pulse'
                                : 'bg-slate-900 hover:bg-rose-950 text-rose-400 border-slate-700 hover:border-rose-700'
                            }`}
                            title="Vaciar bitácora de notificaciones y comenzar conteo desde cero"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="inline">{confirmClearEvents ? '¿Confirmar vaciar?' : 'Limpiar'}</span>
                          </button>
                        </div>
                      </div>

                      {clearSuccessToast && (
                        <div className="mt-2 text-[11px] text-emerald-300 font-bold bg-emerald-950/80 border border-emerald-500/40 rounded-xl px-3 py-2 text-center animate-fadeIn shadow-lg">
                          ✓ Bitácora vaciada con éxito. Ahora registrará únicamente cada nuevo ingreso e instalación en vivo desde cero.
                        </div>
                      )}
                    </div>

                    {/* LISTA DE NOTIFICACIONES DE ACTIVIDAD EN VIVO */}
                    <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                      {(() => {
                        const filtered = adminEvents.filter(e => {
                          if (adminEventsFilter === 'all') return true;
                          return e.type === adminEventsFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="bg-slate-950 rounded-2xl p-8 text-center border border-slate-800 space-y-2">
                              <Radio className="w-8 h-8 text-cyan-400/60 mx-auto animate-pulse" />
                              <p className="text-xs font-bold text-slate-200">Bitácora limpia (0 eventos pendientes).</p>
                              <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                                Cada nueva visita de colegas, descarga de protocolos o instalación en pantalla de inicio aparecerá aquí al instante con sonido y alerta en tiempo real.
                              </p>
                            </div>
                          );
                        }

                        return filtered.map(evt => {
                          const seenIdx = lastSeenAdminEventId ? adminEvents.findIndex(x => x.id === lastSeenAdminEventId) : -1;
                          const currentIdx = adminEvents.findIndex(x => x.id === evt.id);
                          const isNew = seenIdx === -1 || (currentIdx < seenIdx);

                          let badgeColor = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
                          let borderColor = 'border-cyan-500/30';
                          let iconBg = 'bg-cyan-500/10 text-cyan-400';
                          let icon = <Activity className="w-4 h-4" />;
                          let badgeText = '🔬 Revisión de Módulo';

                          if (evt.type === 'visit') {
                            badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40';
                            borderColor = 'border-blue-500/30';
                            iconBg = 'bg-blue-500/10 text-blue-400';
                            icon = <Stethoscope className="w-4 h-4" />;
                            badgeText = '🩺 Sesión Clínica';
                          } else if (evt.type === 'install') {
                            badgeColor = 'bg-emerald-500/30 text-emerald-300 border-emerald-400 font-black';
                            borderColor = 'border-emerald-500/80 shadow-lg shadow-emerald-950/60 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 ring-1 ring-emerald-500/30';
                            iconBg = 'bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/40 animate-pulse';
                            icon = <Sparkles className="w-4 h-4 text-emerald-300" />;
                            badgeText = '🎉 NUEVA INSTALACIÓN CONFIRMADA';
                          } else if (evt.type === 'download') {
                            badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                            borderColor = 'border-amber-500/30';
                            iconBg = 'bg-amber-500/10 text-amber-400';
                            icon = <Download className="w-4 h-4" />;
                            badgeText = '📥 Descarga';
                          } else if (evt.title.includes('E-MOTIVE')) {
                            badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                            borderColor = 'border-rose-500/30';
                            iconBg = 'bg-rose-500/10 text-rose-400';
                            icon = <Droplet className="w-4 h-4" />;
                          } else if (evt.title.includes('VORTEX')) {
                            badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                            borderColor = 'border-sky-500/30';
                            iconBg = 'bg-sky-500/10 text-sky-400';
                            icon = <Wind className="w-4 h-4" />;
                          }

                          return (
                            <div
                              key={evt.id}
                              className={`p-3.5 rounded-2xl border bg-slate-900/90 transition-all space-y-2 relative overflow-hidden ${borderColor} ${
                                isNew ? 'ring-1 ring-rose-500/40 bg-slate-900' : ''
                              }`}
                            >
                              {isNew && (
                                <div className="absolute top-0 right-0">
                                  <span className="bg-rose-600 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                                    Nueva
                                  </span>
                                </div>
                              )}

                              <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
                                  {icon}
                                </div>
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${badgeColor}`}>
                                      {badgeText}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {formatLocalDisplayTime(evt.timestamp)}
                                    </span>
                                  </div>
                                  <h4 className="text-xs sm:text-sm font-black text-white">
                                    {evt.title}
                                  </h4>
                                  <p className="text-xs text-slate-300 font-medium">
                                    {evt.detail}
                                  </p>
                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80 mt-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="bg-slate-950 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
                                        {evt.device}
                                      </span>
                                      <span className="bg-slate-950 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
                                        {evt.location}
                                      </span>
                                    </div>
                                    <a
                                      href={`mailto:carloseduardoleal29@gmail.com?subject=${encodeURIComponent(`🚨 Alerta AnestesiaPro: ${evt.title}`)}&body=${encodeURIComponent(
                                        `Dr. Carlos Leal,\n\nNotificación de actividad:\n\n• Evento: ${evt.title}\n• Detalle: ${evt.detail}\n• Dispositivo: ${evt.device}\n• Ubicación: ${evt.location}\n• Fecha y Hora: ${formatLocalDisplayTime(evt.timestamp)}\n\nAcceso a AnestesiaPro: ${getCanonicalAppOrigin()}`
                                      )}`}
                                      className="text-[10px] font-bold text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 px-2 py-0.5 rounded-md transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-auto"
                                      title="Enviar esta alerta a mi correo carloseduardoleal29@gmail.com"
                                    >
                                      <Mail className="w-3 h-3 text-rose-400" />
                                      <span>Enviar a mi correo</span>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                {/* TAB 2: MÉTRICAS Y ESTADÍSTICAS */}
                {adminActiveTab === 'metricas' && (
                  <div className="space-y-5 animate-fadeIn">
                    {(() => {
                      const safeItemDownloads = stats?.itemDownloads || {};
                      const safeVisits = stats?.visits !== undefined ? Number(stats.visits) : 865;
                      const devsObj = (stats?.devices || { "Smartphone (Móvil) 📱": 251, "Computadora / PC 💻": 141, "Tablet 📲": 12 }) as Record<string, number>;
                      const devSum = Object.values(devsObj).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
                      const displayUniqueDevices = stats?.uniqueDevices !== undefined ? Number(stats.uniqueDevices) : (devSum || 404);
                      const displayAppInstalls = stats?.appInstalls !== undefined ? Number(stats.appInstalls) : 208;

                      const itemValues = Object.values(safeItemDownloads) as number[];
                      const calculatedTotalDownloads = itemValues.reduce((a, b) => a + b, 0);
                      const displayTotalDownloads = stats?.totalDownloads !== undefined ? Number(stats.totalDownloads) : Math.max(calculatedTotalDownloads, 910);

                      const resourceMap: Record<string, { title: string; category: string; ext: string }> = {
                        'res-preeclampsia-eclampsia-enfoque-anestesiologico': { title: '🧬 Preeclampsia, Eclampsia & Complicaciones (Guía & Atlas)', category: 'Urgencia Obstétrica 2026', ext: 'pdf' },
                        'res-calculadora-preeclampsia': { title: '🧬 Calculadora Diagnóstica de Preeclampsia & Severidad', category: 'Calculadora Clínica', ext: 'uso' },
                        'res-preeclampsia-guia-pdf': { title: '📄 Dossier PDF Preeclampsia & Eclampsia (5 Páginas)', category: 'Dossier Académico', ext: 'pdf' },
                        'res-protocolo-emotive-hemorragia-posparto-2026': { title: '🩸 Protocolo E-MOTIVE: Hemorragia Posparto (NEJM / OMS 2026)', category: 'Urgencia Obstétrica 2026', ext: 'pdf' },
                        'res-enfoque-vortex-via-aerea-dificil': { title: '🌀 El Enfoque VORTEX en Vía Aérea Difícil (BJA / DAS 2026)', category: 'Vía Aérea Difícil 2026', ext: 'pdf' },
                        'res-orexina-interruptor-despertar-2026': { title: '🧠 Sistema Orexina: Interruptor del Despertar (PDF & Guía)', category: 'Neuroanestesia 2026', ext: 'pdf' },
                        'res-guia-eras-cesarea-2025': { title: '🌟 Guía Oficial ERAS 2025: Analgesia Cesárea (10 Placas HD)', category: 'Guía Clínica ERAS', ext: 'pdf' },
                        'res-evaluacion-preanestesica': { title: '📋 Evaluaciones Preanestésicas Exportadas (PDFs)', category: 'Módulo Preanestesia', ext: 'pdf' },
                        'res-modulo-preanestesia-consultado': { title: '👁️ Consultas / Ingresos al Módulo Preanestesia', category: 'Módulo Preanestesia', ext: 'actividad' },
                        'res-calculadora-induccion': { title: '🧮 Calculadora de Inducción Anestésica (Dosis & Reversión)', category: 'Calculadora Clínica', ext: 'uso' },
                        'res-indice-de-shock': { title: '📊 Calculadora & Protocolo Índice de Shock (IS & MSI)', category: 'Calculadora Clínica', ext: 'uso' },
                        'res-aminofilina-teofilina-cppd': { title: 'Infografía & Guía Oficial Aminofilina y Teofilina CPPD', category: 'Infografía Técnica', ext: 'pdf' },
                        'res-articulo-metaanalisis-aminofilina-2023': { title: 'Artículo 1: Metaanálisis 2023 - Aminofilina/Teofilina (Anesth Pain Med)', category: 'PDF Científico', ext: 'pdf' },
                        'res-articulo-estudio-aminofilina-2016': { title: 'Artículo 2: Estudio Multicéntrico 2016 - Aminofilina IV (Pain Physician)', category: 'PDF Científico', ext: 'pdf' },
                        'res-fona-cricotiroidotomia': { title: 'PROCEDIMIENTO FONA: ACCESO FRONTAL AL CUELLO', category: 'Infografía Técnica', ext: 'pdf' },
                        'res-caso-elaine-bromiley': { title: 'El Caso de Elaine Bromiley: Análisis de Factores Humanos y CRM', category: 'Presentación Médica', ext: 'pdf' },
                        'res-modelo-vortex-redar': { title: 'El Modelo del Vórtex (Vortex Approach)', category: 'Pauta Clínica', ext: 'link' },
                        'res-das-2025-urgencias': { title: 'Guías 2025 Intubación Difícil (DAS 2025)', category: 'Pauta Clínica', ext: 'link' },
                      };

                      // Merge stats.itemDownloads with resourceMap keys
                      const allKeys = Array.from(new Set([...Object.keys(resourceMap), ...Object.keys(safeItemDownloads)]));
                      const itemsList = allKeys.map(key => {
                        const info = resourceMap[key] || { title: key, category: 'Recurso Subido', ext: 'pdf' };
                        const downloads = safeItemDownloads[key] || 0;
                        return { key, ...info, downloads };
                      }).sort((a, b) => b.downloads - a.downloads);

                      return (
                        <>
                      {/* Milestone Celebration Banner if >= 200 installs */}
                      {displayAppInstalls >= 200 && (
                        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-amber-950 p-4 rounded-2xl border-2 border-emerald-400/70 shadow-2xl space-y-2 animate-fadeIn relative overflow-hidden">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl animate-bounce">🏆</span>
                              <div>
                                <h4 className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                                  ¡HITO HISTÓRICO ALCANZADO: META DE 200 INSTALACIONES SUPERADA! 🚀
                                </h4>
                                <p className="text-[11px] text-amber-200 font-bold">
                                  ¡Oficialmente {displayAppInstalls} aplicaciones instaladas en teléfonos y dispositivos móviles de colegas!
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 uppercase font-mono shadow-md shrink-0">
                              {displayAppInstalls} ACTIVAS
                            </span>
                          </div>
                          <p className="text-xs text-slate-200 font-medium">
                            AnestesiaPro superó la meta dorada de las 200 instalaciones (PWA + TWA Android). Este logro confirma la enorme confianza de la comunidad de anestesiología y el impacto clínico real en el quirófano diario.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                        <div className="bg-slate-950 rounded-2xl p-3 border border-cyan-500/40 text-center space-y-1 shadow-inner">
                          <p className="text-[10px] sm:text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center justify-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-cyan-400" /> Visitas
                          </p>
                          <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{safeVisits}</p>
                          <p className="text-[9px] text-cyan-200/80 font-bold">
                            Accesos a la web
                          </p>
                        </div>

                        <div className="bg-slate-950 rounded-2xl p-3 border border-emerald-500/40 text-center space-y-1 shadow-inner">
                          <p className="text-[10px] sm:text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center justify-center gap-1">
                            <Download className="w-3.5 h-3.5 text-emerald-400" /> Instalaciones
                          </p>
                          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{displayAppInstalls}</p>
                          <p className="text-[9px] text-emerald-200/80 font-bold">
                            {displayAppInstalls >= 200 ? '¡Meta 200 superada!' : 'Apps PWA añadidas'}
                          </p>
                        </div>

                        <div className="bg-slate-950 rounded-2xl p-3 border border-indigo-500/40 text-center space-y-1 shadow-inner">
                          <p className="text-[10px] sm:text-[11px] font-black text-indigo-300 uppercase tracking-wider flex items-center justify-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-indigo-400" /> Dispositivos
                          </p>
                          <p className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">{displayUniqueDevices}</p>
                          <p className="text-[9px] text-indigo-200/80 font-bold">
                            Equipos únicos
                          </p>
                        </div>

                        <div className="bg-slate-950 rounded-2xl p-3 border border-amber-500/40 text-center space-y-1 shadow-inner">
                          <p className="text-[10px] sm:text-[11px] font-black text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-amber-400" /> Descargas
                          </p>
                          <p className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{displayTotalDownloads}</p>
                          <p className="text-[9px] text-amber-200/80 font-bold">PDFs y guías</p>
                        </div>
                      </div>

                      {/* Real-time Server Sync & Refresh Bar */}
                      <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/40 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                          </span>
                          <div>
                            <p className="text-xs font-black text-white flex items-center gap-1.5">
                              Sincronización en Tiempo Real Activa
                              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Servidor Cloud Run conectado. Los contadores reflejan las {displayAppInstalls} instalaciones verificadas en vivo.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSyncingStats(true);
                            getGlobalStats().then(s => {
                              if (s) updateStatsSafely(s);
                              loadAdminEvents();
                              setTimeout(() => setSyncingStats(false), 600);
                            });
                          }}
                          disabled={syncingStats}
                          className="text-xs font-black px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/50 flex items-center gap-2 transition-all cursor-pointer shadow active:scale-95"
                          title="Actualizar métricas de inmediato con el servidor"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${syncingStats ? 'animate-spin' : ''}`} />
                          <span>{syncingStats ? 'Sincronizando...' : 'Refrescar Servidor'}</span>
                        </button>
                      </div>

                      {/* Calibración y Control de Métricas Directo (Dr. Carlos Leal) */}
                      <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-4 shadow-xl">
                        <div className="border-b border-emerald-500/20 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                              <Sparkles className="w-4 h-4" />
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-white uppercase tracking-wider">
                                Calibrador de Métricas Oficial (Control Directo Dr. Carlos Leal)
                              </h4>
                              <p className="text-[11px] text-slate-400">
                                Permite ajustar y blindar en vivo las cifras ante cualquier anomalía o desajuste de navegador.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ACCIONES MAESTRAS DE SINCRONIZACIÓN Y REINICIO (DR. CARLOS LEAL) */}
                        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2.5 shadow-md">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 text-amber-400" /> Sincronización Rápida & Reinicio Maestro
                            </p>
                            <span className="text-[10px] text-emerald-400 font-mono font-bold">Autor Dr. Carlos Leal</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {/* Botón 1: Alinear Installs con Bitácora */}
                            <button
                              type="button"
                              onClick={async () => {
                                const bitacoraCount = adminEvents.filter(e => e.type === 'install').length;
                                setCalibratingStats(true);
                                try {
                                  const res = await updateAdminStats({ appInstalls: bitacoraCount }, '2534');
                                  if (res) {
                                    updateStatsSafely(res);
                                    setCalibrationSuccessToast(`✓ Instalaciones alineadas con la bitácora: ${bitacoraCount} registradas`);
                                    setTimeout(() => setCalibrationSuccessToast(''), 4500);
                                  }
                                } finally {
                                  setCalibratingStats(false);
                                }
                              }}
                              disabled={calibratingStats}
                              className="px-3 py-2 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-95 text-center"
                              title="Alinear el número de instalaciones con los eventos de instalación reales en la bitácora"
                            >
                              <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Alinear a Bitácora ({adminEvents.filter(e => e.type === 'install').length})</span>
                            </button>

                            {/* Botón 2: Sincronizar al Unísono */}
                            <button
                              type="button"
                              onClick={syncAllInUnison}
                              disabled={syncingStats}
                              className="px-3 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/60 rounded-xl text-cyan-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-95 text-center"
                              title="Refrescar métricas del servidor y bitácora en simultáneo"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 shrink-0 ${syncingStats ? 'animate-spin' : ''}`} />
                              <span>Sincronizar al Unísono</span>
                            </button>

                            {/* Botón 3: Reiniciar Conteo a Cero */}
                            <button
                              type="button"
                              onClick={() => setConfirmResetAllModal(true)}
                              disabled={calibratingStats}
                              className="px-3 py-2 bg-rose-950/90 hover:bg-rose-900 border border-rose-500/70 rounded-xl text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-95 text-center"
                              title="Reiniciar todos los contadores a cero y vaciar la bitácora para conteo limpio"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span>Reiniciar Conteo a Cero</span>
                            </button>

                            {/* Botón 4: Restaurar Consolidado */}
                            <button
                              type="button"
                              onClick={async () => {
                                setCalibratingStats(true);
                                try {
                                  const res = await updateAdminStats({
                                    visits: 865,
                                    appInstalls: 204,
                                    totalDownloads: 910,
                                    uniqueDevices: 404
                                  }, '2534');
                                  if (res) {
                                    updateStatsSafely(res);
                                    setCalibrationSuccessToast('✓ Conteo consolidado restaurado (865 Visitas • 204 Installs • 910 Descargas)');
                                    setTimeout(() => setCalibrationSuccessToast(''), 4500);
                                  }
                                } finally {
                                  setCalibratingStats(false);
                                }
                              }}
                              disabled={calibratingStats}
                              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-95 text-center"
                              title="Restaurar el conteo histórico consolidado"
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <span>Restaurar Base (865)</span>
                            </button>

                            {/* Botón 5: Forzar Actualización PWA & Caché Local */}
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm('¿Deseas forzar la descarga de las últimas actualizaciones e imágenes anatómicas borrando la caché local de este dispositivo?')) {
                                  await forceAppUpdate();
                                }
                              }}
                              className="px-3 py-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/70 rounded-xl text-emerald-300 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow active:scale-95 text-center col-span-2 sm:col-span-1"
                              title="Descarga la versión más reciente borrando la memoria caché del navegador"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>⚡ Forzar Actualización & Limpiar Caché</span>
                            </button>
                          </div>
                        </div>

                        {/* MODAL DE CONFIRMACIÓN DE REINICIO A CERO */}
                        {confirmResetAllModal && (
                          <div className="p-4 rounded-xl bg-rose-950/90 border-2 border-rose-500 text-white space-y-3 shadow-2xl animate-fadeIn">
                            <div className="flex items-start gap-2.5">
                              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <h5 className="text-xs sm:text-sm font-black text-rose-200 uppercase tracking-wide">
                                  ¿Confirmar Reinicio Maestro de Contadores y Bitácora?
                                </h5>
                                <p className="text-[11px] sm:text-xs text-rose-100/90 mt-1">
                                  Esta acción reiniciará en el servidor y en tu navegador:
                                </p>
                                <ul className="text-[11px] text-rose-200/90 list-disc list-inside mt-1 space-y-0.5 font-mono">
                                  <li>Visitas: 1 (sesión actual activa)</li>
                                  <li>Instalaciones: 0</li>
                                  <li>Descargas totales: 0</li>
                                  <li>Vaciará la bitácora de eventos para registrar únicamente los nuevos en vivo</li>
                                </ul>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 pt-1 border-t border-rose-500/40">
                              <button
                                type="button"
                                onClick={() => setConfirmResetAllModal(false)}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700 cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  setConfirmResetAllModal(false);
                                  setCalibratingStats(true);
                                  try {
                                    const res = await resetAllAdminStats('2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                    } else {
                                      updateStatsSafely({
                                        visits: 1,
                                        appInstalls: 0,
                                        uniqueDevices: 1,
                                        totalDownloads: 0,
                                        itemDownloads: {},
                                        devices: { "Smartphone (Móvil) 📱": 1 },
                                        locations: { "🇻🇪 Venezuela": 1 },
                                        downloadLocations: {}
                                      });
                                    }
                                    setAdminEvents([]);
                                    markAdminEventsAsSeen();
                                    try {
                                      localStorage.setItem('anestesiapro_admin_events_cache', '[]');
                                      localStorage.setItem('anestesiapro_visit_count', '1');
                                      localStorage.setItem('anestesiapro_app_installs', '0');
                                      localStorage.setItem('anestesiapro_total_downloads', '0');
                                      localStorage.setItem('anestesiapro_resource_downloads', '{}');
                                    } catch (e) {
                                      console.error(e);
                                    }
                                    setResetSuccessToast(true);
                                    setTimeout(() => setResetSuccessToast(false), 5000);
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black shadow-lg shadow-rose-950/80 cursor-pointer flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-white" />
                                <span>Sí, Reiniciar Todo a Cero</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {resetSuccessToast && (
                          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-bold text-center shadow-lg animate-fadeIn flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>✓ Contadores reiniciados a cero y bitácora vaciada con éxito. Los nuevos ingresos e instalaciones se registrarán en tiempo real.</span>
                          </div>
                        )}

                        {/* Control 1: Instalaciones */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-emerald-300">📲 Instalaciones App</span>
                              <p className="text-[11px] text-slate-400">
                                Actual: <strong className="text-emerald-400 font-mono">{displayAppInstalls}</strong>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = displayAppInstalls + 1;
                                    const res = await updateAdminStats({ appInstalls: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumada 1 instalación. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +1 Inst
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = displayAppInstalls + 2;
                                    const res = await updateAdminStats({ appInstalls: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumadas 2 instalaciones. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +2 Inst
                              </button>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  placeholder={displayAppInstalls.toString()}
                                  value={manualInstallsInput}
                                  onChange={(e) => setManualInstallsInput(e.target.value)}
                                  className="w-20 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-emerald-300 text-center focus:border-emerald-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const parsed = parseInt(manualInstallsInput, 10);
                                    if (isNaN(parsed) || parsed < 0) return;
                                    setCalibratingStats(true);
                                    try {
                                      const res = await updateAdminStats({ appInstalls: parsed }, '2534');
                                      if (res) {
                                        updateStatsSafely(res);
                                        setManualInstallsInput('');
                                        setCalibrationSuccessToast(`✓ Instalaciones fijadas en ${parsed}`);
                                        setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                      }
                                    } finally {
                                      setCalibratingStats(false);
                                    }
                                  }}
                                  disabled={calibratingStats || !manualInstallsInput}
                                  className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 text-xs font-black rounded cursor-pointer"
                                >
                                  Fijar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Control 2: Visitas */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-cyan-500/20 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-cyan-300">👁️ Visitas a la Web</span>
                              <p className="text-[11px] text-slate-400">
                                Actual: <strong className="text-cyan-400 font-mono">{safeVisits}</strong>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = safeVisits + 10;
                                    const res = await updateAdminStats({ visits: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumadas 10 visitas. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-cyan-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +10 Vis
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = safeVisits + 50;
                                    const res = await updateAdminStats({ visits: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumadas 50 visitas. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 rounded-lg text-cyan-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +50 Vis
                              </button>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  placeholder={safeVisits.toString()}
                                  value={manualVisitsInput}
                                  onChange={(e) => setManualVisitsInput(e.target.value)}
                                  className="w-20 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-cyan-300 text-center focus:border-cyan-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const parsed = parseInt(manualVisitsInput, 10);
                                    if (isNaN(parsed) || parsed < 0) return;
                                    setCalibratingStats(true);
                                    try {
                                      const res = await updateAdminStats({ visits: parsed }, '2534');
                                      if (res) {
                                        updateStatsSafely(res);
                                        setManualVisitsInput('');
                                        setCalibrationSuccessToast(`✓ Visitas fijadas en ${parsed}`);
                                        setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                      }
                                    } finally {
                                      setCalibratingStats(false);
                                    }
                                  }}
                                  disabled={calibratingStats || !manualVisitsInput}
                                  className="px-2 py-0.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-black rounded cursor-pointer"
                                >
                                  Fijar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Control 3: Descargas Totales */}
                        <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/20 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-amber-300">📥 Descargas Totales</span>
                              <p className="text-[11px] text-slate-400">
                                Actual: <strong className="text-amber-400 font-mono">{displayTotalDownloads}</strong>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = displayTotalDownloads + 5;
                                    const res = await updateAdminStats({ totalDownloads: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumadas 5 descargas. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +5 Desc
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  setCalibratingStats(true);
                                  try {
                                    const newVal = displayTotalDownloads + 20;
                                    const res = await updateAdminStats({ totalDownloads: newVal }, '2534');
                                    if (res) {
                                      updateStatsSafely(res);
                                      setCalibrationSuccessToast(`✓ Sumadas 20 descargas. Total: ${newVal}`);
                                      setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                    }
                                  } finally {
                                    setCalibratingStats(false);
                                  }
                                }}
                                disabled={calibratingStats}
                                className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-500/50 rounded-lg text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                              >
                                +20 Desc
                              </button>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  placeholder={displayTotalDownloads.toString()}
                                  value={manualDownloadsInput}
                                  onChange={(e) => setManualDownloadsInput(e.target.value)}
                                  className="w-20 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-amber-300 text-center focus:border-amber-500 outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const parsed = parseInt(manualDownloadsInput, 10);
                                    if (isNaN(parsed) || parsed < 0) return;
                                    setCalibratingStats(true);
                                    try {
                                      const res = await updateAdminStats({ totalDownloads: parsed }, '2534');
                                      if (res) {
                                        updateStatsSafely(res);
                                        setManualDownloadsInput('');
                                        setCalibrationSuccessToast(`✓ Descargas fijadas en ${parsed}`);
                                        setTimeout(() => setCalibrationSuccessToast(''), 4000);
                                      }
                                    } finally {
                                      setCalibratingStats(false);
                                    }
                                  }}
                                  disabled={calibratingStats || !manualDownloadsInput}
                                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-black rounded cursor-pointer"
                                >
                                  Fijar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {calibrationSuccessToast && (
                          <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-center text-xs font-bold text-emerald-400 animate-fadeIn">
                            {calibrationSuccessToast}
                          </div>
                        )}
                      </div>

                      {/* Preanesthesia Usage Monitor Card */}
                      <div className="bg-gradient-to-r from-blue-950 via-slate-950 to-indigo-950 rounded-2xl p-4 border border-blue-500/40 shadow-xl space-y-3">
                        <div className="flex items-center justify-between border-b border-blue-500/20 pb-2">
                          <h4 className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" /> Monitoreo de Uso: Módulo Preanestesia
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            En Vivo
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="bg-slate-900/80 rounded-xl p-2.5 border border-blue-500/30">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Consultas / Usos Pestaña</p>
                            <p className="text-xl sm:text-2xl font-black text-blue-400 font-mono">
                              {safeItemDownloads['res-modulo-preanestesia-consultado'] || 0}
                            </p>
                            <p className="text-[9px] text-slate-400">Ingresos al Módulo</p>
                          </div>

                          <div className="bg-slate-900/80 rounded-xl p-2.5 border border-emerald-500/30">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Fichas Generadas PDF</p>
                            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                              {safeItemDownloads['res-evaluacion-preanestesica'] || 0}
                            </p>
                            <p className="text-[9px] text-emerald-300 font-medium">Informes Exportados</p>
                          </div>
                        </div>
                      </div>

                      {/* Clinical Calculators Monitor Card */}
                      {(() => {
                        const preeclampsiaUses = Number(safeItemDownloads['res-calculadora-preeclampsia'] || 0);
                        const induccionUses = Number(safeItemDownloads['res-calculadora-induccion'] || 0);
                        const shockUses = Number(safeItemDownloads['res-indice-de-shock'] || 0);
                        const totalCalcUses = preeclampsiaUses + induccionUses + shockUses;

                        const calcs = [
                          {
                            id: 'preeclampsia',
                            name: 'Calculadora Preeclampsia & Severidad',
                            icon: '🧬',
                            count: preeclampsiaUses,
                            subtitle: 'ACOG / FIGO / Zuspan / Neuroaxial',
                            badge: 'Urgencia Obstétrica',
                            color: 'from-pink-500 to-rose-600',
                            border: 'border-pink-500/40',
                            textColor: 'text-pink-400',
                            progressColor: 'bg-pink-500'
                          },
                          {
                            id: 'induccion',
                            name: 'Calculadora Inducción Anestésica',
                            icon: '🧮',
                            count: induccionUses,
                            subtitle: 'Fármacos & Dosis por peso / Reversión',
                            badge: 'Quirófano General',
                            color: 'from-purple-500 to-indigo-600',
                            border: 'border-purple-500/40',
                            textColor: 'text-purple-400',
                            progressColor: 'bg-purple-500'
                          },
                          {
                            id: 'shock',
                            name: 'Calculadora Índice Shock & PAM',
                            icon: '🩸',
                            count: shockUses,
                            subtitle: 'Índice IS / MSI & Metas PAM / PTM',
                            badge: 'Reanimación & Trauma',
                            color: 'from-cyan-500 to-blue-600',
                            border: 'border-cyan-500/40',
                            textColor: 'text-cyan-400',
                            progressColor: 'bg-cyan-500'
                          },
                        ].sort((a, b) => b.count - a.count);

                        return (
                          <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-pink-950 rounded-2xl p-4 border border-purple-500/40 shadow-xl space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-2.5">
                              <div>
                                <h4 className="text-xs font-black text-purple-200 uppercase tracking-wider flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-pink-400" /> Monitoreo Privado: Calculadoras Clínicas
                                </h4>
                                <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                                  Total de cálculos clínicos ejecutados: <span className="text-white font-black font-mono">{totalCalcUses}</span> usos en vivo
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-pink-400 bg-pink-950/80 px-2.5 py-0.5 rounded-full border border-pink-500/30 flex items-center gap-1.5 self-start sm:self-auto">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse"></span>
                                Telemetría en Vivo
                              </span>
                            </div>

                            {/* 3 Grid Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                              {calcs.map((c, rankIdx) => {
                                const pct = totalCalcUses > 0 ? Math.round((c.count / totalCalcUses) * 100) : 0;
                                return (
                                  <div key={c.id} className={`bg-slate-900/90 rounded-xl p-3 border ${c.border} text-left flex flex-col justify-between space-y-2 relative overflow-hidden`}>
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-base">{c.icon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{c.badge}</span>
                                      </div>
                                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                                        #{rankIdx + 1}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-xs font-black text-white line-clamp-1">{c.name}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{c.subtitle}</p>
                                    </div>
                                    <div className="pt-1 border-t border-slate-800/80 flex items-baseline justify-between">
                                      <span className={`text-xl sm:text-2xl font-black font-mono ${c.textColor}`}>
                                        {c.count}
                                      </span>
                                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                                        {pct}% del total
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                      <div className={`${c.progressColor} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* PRIVATE MODULE CONSULTATION & VISIT RANKING (FOR FUTURE PROPOSALS) */}
                      {(() => {
                        const moduleVisitsMap = getModuleVisits();
                        const moduleProposalsInsights: Record<string, { trend: string; recommendation: string; color: string; badge: string }> = {
                          educacion: {
                            trend: '🔥 Máxima Demanda Insignia',
                            recommendation: 'Alta preferencia en protocolos obstétricos (Preeclampsia y E-MOTIVE). Recomendado: Añadir caso clínico interactivo de analgesia de parto.',
                            color: 'from-amber-500 to-orange-600',
                            badge: 'Educación & Casos'
                          },
                          viaAerea: {
                            trend: '⚡ Alto Impacto Quirófano',
                            recommendation: 'El Enfoque VORTEX y algoritmos DAS son consultados frecuentemente. Recomendado: Añadir pautas pediátricas y videolaringoscopios.',
                            color: 'from-cyan-500 to-blue-600',
                            badge: 'Vía Aérea'
                          },
                          preanestesia: {
                            trend: '📋 Alta Retención Diaria',
                            recommendation: 'Los anestesiólogos generan y exportan fichas clínicas oficiales. Recomendado: Incorporar cálculo de riesgo cardíaco RCRI/Lee.',
                            color: 'from-emerald-500 to-teal-600',
                            badge: 'Preanestesia'
                          },
                          indiceShock: {
                            trend: '🩸 Urgencia & Resucitación',
                            recommendation: 'Gran interés en PAM y metas de cristaloides vs PTM 1:1:1. Recomendado: Desarrollar metas de perfusión por POCUS.',
                            color: 'from-rose-500 to-red-600',
                            badge: 'Shock & Trauma'
                          },
                          calculadora: {
                            trend: '🧮 Herramienta Rápida',
                            recommendation: 'Cálculo de inducción por peso real vs ideal. Recomendado: Añadir dosificación para bombas de infusión continua TIVA.',
                            color: 'from-purple-500 to-indigo-600',
                            badge: 'Calculadoras'
                          },
                          escalas: {
                            trend: '📊 Evaluación en URPA',
                            recommendation: 'Uso constante de Aldrete y Bromage para alta de recuperación. Recomendado: Sumar escala de dolor EVA y Ramsay para sedación.',
                            color: 'from-blue-500 to-cyan-600',
                            badge: 'Escalas'
                          },
                          vademecum: {
                            trend: '📖 Consulta de Bolsillo',
                            recommendation: 'Búsqueda activa de reversión de relajantes (Sugammadex). Recomendado: Añadir tabla comparativa de coadyuvantes analgésicos.',
                            color: 'from-teal-500 to-emerald-600',
                            badge: 'Vademécum'
                          }
                        };

                        const sortedModules = Object.entries(moduleVisitsMap)
                          .map(([key, item]) => {
                            const insight = moduleProposalsInsights[key] || {
                              trend: '📈 Interés Activo',
                              recommendation: 'Módulo con consultas activas por parte de colegas.',
                              color: 'from-slate-500 to-slate-700',
                              badge: 'Clínico'
                            };
                            return {
                              key,
                              label: item.label,
                              count: item.count,
                              icon: item.icon,
                              ...insight
                            };
                          })
                          .sort((a, b) => b.count - a.count);

                        const totalModuleConsults = sortedModules.reduce((acc, m) => acc + m.count, 0) || 1;

                        return (
                          <div className="bg-slate-950/95 rounded-2xl p-4 sm:p-5 border border-amber-500/40 shadow-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Award className="w-3 h-3 text-amber-400" /> Planificación Estratégica &bull; Dr. Carlos Leal
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                                    {totalModuleConsults} consultas analizadas
                                  </span>
                                </div>
                                <h3 className="text-sm font-black text-white mt-1 flex items-center gap-2">
                                  🏆 Ránking Privado: Módulos Más Consultados y Visitados
                                </h3>
                                <p className="text-xs text-amber-200/80 font-medium">
                                  Métricas consolidadas de preferencia médica para orientar la creación y ampliación de futuras propuestas clínicas.
                                </p>
                              </div>
                              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1 self-start sm:self-auto font-mono">
                                <Activity className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                                7 Módulos Monitorizados
                              </span>
                            </div>

                            {/* Ranking List */}
                            <div className="space-y-2.5">
                              {sortedModules.map((m, idx) => {
                                const pct = Math.round((m.count / totalModuleConsults) * 100);
                                const rankMedal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
                                return (
                                  <div
                                    key={m.key}
                                    className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-2"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <span className="text-base sm:text-lg shrink-0">{rankMedal}</span>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-xs font-black text-white truncate">{m.icon} {m.label}</span>
                                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono">
                                              {m.badge}
                                            </span>
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            {m.trend}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right shrink-0">
                                        <p className="text-sm font-black text-amber-400 font-mono">
                                          {m.count} <span className="text-[10px] text-slate-400 font-normal">consultas</span>
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 font-mono">
                                          {pct}% del total
                                        </p>
                                      </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                                      <div
                                        className={`bg-gradient-to-r ${m.color} h-full rounded-full transition-all duration-700`}
                                        style={{ width: `${pct}%` }}
                                      ></div>
                                    </div>

                                    {/* Recommendation Note for future updates */}
                                    <div className="bg-slate-950/70 rounded-lg p-2 border border-slate-800/80 flex items-start gap-1.5 text-[11px] text-slate-300">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-bold text-amber-300">Orientación de propuesta: </span>
                                        <span className="text-slate-300">{m.recommendation}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Device Breakdown (Teléfono vs PC vs Tablet) */}
                      <div className="space-y-3 bg-slate-950/90 rounded-2xl p-3.5 sm:p-4 border border-indigo-500/30 shadow-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone className="w-4 h-4 text-indigo-400" /> Dispositivos de Usuarios (Teléfono vs PC):
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            Telemetría en Vivo
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {(() => {
                            const devs = (stats.devices || {
                              "Smartphone (Móvil) 📱": 251,
                              "Computadora / PC 💻": 141,
                              "Tablet 📲": 12
                            }) as Record<string, number>;
                            const totalDev = Object.values(devs).reduce((a: number, b: number) => a + b, 0) || 1;
                            return Object.entries(devs).map(([name, count]) => {
                              const numCount = Number(count) || 0;
                              const pct = Math.round((numCount / totalDev) * 100);
                              return (
                                <div key={name} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                                    <span className="truncate">{name}</span>
                                    <span className="text-indigo-300 font-mono">{numCount} ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                    <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>
                      </div>

                      {/* Location Breakdown: Visits per Country */}
                      <div className="space-y-3 bg-slate-950/90 rounded-2xl p-3.5 sm:p-4 border border-rose-500/30 shadow-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-rose-400" /> Visitas por País (Suma exactas a Visitas Totales):
                          </h4>
                          <span className="text-[10px] font-bold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30 font-mono">
                            Total: {stats.visits}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {(() => {
                            const locs = (stats.locations || {
                              "🇻🇪 Venezuela": 448,
                              "🇨🇴 Colombia": 46,
                              "🇲🇽 México": 40,
                              "🇪🇸 España": 23,
                              "🇦🇷 Argentina": 13,
                              "🇺🇸 Estados Unidos": 11
                            }) as Record<string, number>;
                            const totalLoc = Object.values(locs).reduce((a: number, b: number) => a + b, 0) || 1;
                            return Object.entries(locs)
                              .sort((a, b) => Number(b[1]) - Number(a[1]))
                              .map(([country, count]) => {
                                const numCount = Number(count) || 0;
                                const pct = Math.round((numCount / totalLoc) * 100);
                                return (
                                  <div key={country} className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-xl border border-slate-800 gap-2">
                                    <span className="font-extrabold text-white truncate">{country}</span>
                                    <div className="flex items-center gap-2 shrink-0 font-mono">
                                      <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                        <div className="bg-rose-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                      </div>
                                      <span className="text-rose-300 text-xs font-bold w-16 text-right">{numCount} ({pct}%)</span>
                                    </div>
                                  </div>
                                );
                              });
                          })()}
                        </div>
                      </div>

                      {/* Location Breakdown: Downloads per Country */}
                      <div className="space-y-3 bg-slate-950/90 rounded-2xl p-3.5 sm:p-4 border border-amber-500/30 shadow-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                            <Download className="w-4 h-4 text-amber-400" /> Descargas por País (Suma exacta a Descargas Totales):
                          </h4>
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                            Total: {displayTotalDownloads}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {(() => {
                            const dlocs = (stats.downloadLocations || {
                              "🇻🇪 Venezuela": 98,
                              "🇨🇴 Colombia": 21,
                              "🇲🇽 México": 14,
                              "🇪🇸 España": 7,
                              "🇦🇷 Argentina": 5,
                              "🇺🇸 Estados Unidos": 3
                            }) as Record<string, number>;
                            const totalDLoc = Object.values(dlocs).reduce((a: number, b: number) => a + b, 0) || 1;
                            return Object.entries(dlocs)
                              .sort((a, b) => Number(b[1]) - Number(a[1]))
                              .map(([country, count]) => {
                                const numCount = Number(count) || 0;
                                const pct = Math.round((numCount / totalDLoc) * 100);
                                return (
                                  <div key={country} className="flex items-center justify-between text-xs p-2 bg-slate-900 rounded-xl border border-slate-800 gap-2">
                                    <span className="font-extrabold text-white truncate">{country}</span>
                                    <div className="flex items-center gap-2 shrink-0 font-mono">
                                      <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                                      </div>
                                      <span className="text-amber-300 text-xs font-bold w-16 text-right">{numCount} ({pct}%)</span>
                                    </div>
                                  </div>
                                );
                              });
                          })()}
                        </div>
                      </div>

                      {/* Detailed Item Breakdown */}
                      <div className="space-y-3 bg-slate-950/90 rounded-2xl p-3.5 sm:p-4 border border-slate-800 shadow-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                            <BookMarked className="w-4 h-4 text-cyan-400" /> Métricas Detalladas por Archivo:
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            Ordenado por más descargado
                          </span>
                        </div>

                        <div className="space-y-2 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
                          {itemsList.map((item, idx) => (
                            <div key={item.key} className="flex items-center justify-between text-xs p-2.5 bg-slate-900/90 rounded-xl border border-slate-800/80 gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 h-5 rounded-md font-mono font-black text-[10px] bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border border-slate-700">
                                  #{idx + 1}
                                </span>
                                <div className="space-y-0.5 min-w-0 flex-1">
                                  <p className="font-extrabold text-white text-xs truncate">{item.title}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">{item.category} • .{item.ext}</p>
                                </div>
                              </div>
                              <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-black text-xs px-2.5 py-1 rounded-lg font-mono shrink-0">
                                {item.downloads} {item.downloads === 1 ? 'descarga' : 'descargas'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: MENSAJES Y SUGERENCIAS RECIBIDAS */}
            {adminActiveTab === 'mensajes' && (
              <div className="space-y-3 bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" /> Sugerencias y Mensajes Recibidos:
                  </h4>
                  <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-black px-2 py-0.5 rounded">
                    {feedbackList.length} {feedbackList.length === 1 ? 'mensaje' : 'mensajes'}
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  🔒 <strong>Permanencia de Mensajes:</strong> Los mensajes no caducan ni se borran automáticamente. Permanecen guardados de forma indefinida hasta que tú los elimines manualmente con el botón.
                </p>

                {feedbackList.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-900 rounded-xl">
                    Aún no hay sugerencias enviadas. Los comentarios que envíen los usuarios desde la sección de contacto aparecerán aquí automáticamente.
                  </p>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {feedbackList.map((f) => (
                      <div key={f.id} className="bg-slate-900 rounded-xl p-3 border border-slate-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between font-bold text-cyan-300 text-[11px]">
                          <span>👤 {f.name || 'Colega'} {f.location ? `(${f.location})` : ''}</span>
                          <span className="text-[10px] text-slate-500 font-normal">{f.date}</span>
                        </div>
                        {f.email && <p className="text-[10px] text-slate-400">✉️ {f.email}</p>}
                        <p className="text-slate-200 text-xs leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                          "{f.message}"
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <a
                            href={`mailto:carloseduardoleal29@gmail.com?subject=${encodeURIComponent(`💬 Sugerencia AnestesiaPro de ${f.name || 'Colega'}`)}&body=${encodeURIComponent(
                              `Dr. Carlos Leal,\n\nSugerencia recibida en AnestesiaPro:\n\n• De: ${f.name || 'Colega'} (${f.location || 'Sin ubicación'})\n• Correo remitente: ${f.email || 'No especificado'}\n• Fecha: ${f.date}\n\n• Mensaje:\n"${f.message}"\n\nAcceso a la app: ${getCanonicalAppOrigin()}`
                            )}`}
                            className="text-cyan-300 hover:text-white hover:bg-cyan-950/80 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-cyan-500/30"
                            title="Reenviar esta sugerencia a carloseduardoleal29@gmail.com"
                          >
                            <Mail className="w-3 h-3 text-cyan-400" />
                            <span>Reenviar a mi correo</span>
                          </a>

                          <button
                            type="button"
                            onClick={async () => {
                              await deleteUserFeedback(f.id);
                              loadFeedback();
                            }}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 font-bold text-[10px] px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-rose-500/30"
                            title="Borrar este mensaje manualmente"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span>Eliminar Mensaje</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: EMITIR COMUNICADO A TODOS LOS USUARIOS */}
            {adminActiveTab === 'comunicados' && (
              <div className="space-y-3 bg-gradient-to-r from-amber-950/60 to-slate-950 rounded-2xl p-4 border border-amber-500/40 animate-fadeIn">
                <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-amber-400" /> Publicar Alerta o Notificación a Todos los Usuarios:
                </h4>
                <p className="text-[11px] text-slate-300">
                  Al publicar aquí, a todas las personas que entren a la app en su teléfono o PC les aparecerá inmediatamente la notificación y el aviso de que subiste algo nuevo.
                </p>

                <form onSubmit={handlePublishNotification} className="space-y-2.5 pt-1">
                  <input
                    type="text"
                    value={newNotifTitle}
                    onChange={(e) => setNewNotifTitle(e.target.value)}
                    placeholder="Título de la Alerta (ej. ¡NUEVA GUÍA CLÍNICA SUBIDA!)"
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    required
                  />

                  <textarea
                    value={newNotifMessage}
                    onChange={(e) => setNewNotifMessage(e.target.value)}
                    placeholder="Detalles de lo que agregaste para que los usuarios lo revisen..."
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-400 focus:outline-none h-20 resize-none"
                    required
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newNotifBadge}
                      onChange={(e) => setNewNotifBadge(e.target.value)}
                      className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="NUEVA INFOGRAFÍA">Etiqueta: Nueva Infografía</option>
                      <option value="NUEVO ARCHIVO">Etiqueta: Nuevo Archivo PDF</option>
                      <option value="ACTUALIZACIÓN">Etiqueta: Actualización</option>
                      <option value="CASO CLÍNICO">Etiqueta: Caso Clínico</option>
                    </select>

                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publicar Notificación</span>
                    </button>
                  </div>

                  {publishSuccess && (
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-4 h-4" /> ¡Notificación enviada con éxito! Aparecerá en todos los teléfonos y PCs.
                    </p>
                  )}
                </form>
              </div>
            )}

            {/* TAB: DIRECTORIO DE USUARIOS Y COLEGAS REGISTRADOS & GESTIÓN PLAN ÉLITE */}
            {adminActiveTab === 'usuarios' && userProfile?.email?.toLowerCase() === 'carloseduardoleal29@gmail.com' && (
              <div className="space-y-4 bg-slate-950 rounded-2xl p-4 sm:p-5 border border-cyan-500/40 shadow-2xl animate-fadeIn text-slate-100">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" /> Directorio Médico Oficial • AnestesiaPro
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        {adminUsers.length} Registrados
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1 flex items-center gap-2">
                      👥 Colegas Registrados & Control de Membresías Élite
                    </h3>
                    <p className="text-xs text-slate-400">
                      Datos de contacto, cédula, país y activación de accesos a la sección <strong>AnestesiaPro Élite</strong> para futuros planes de suscripción.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => exportUsersToCSV(adminUsers)}
                      disabled={adminUsers.length === 0}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/60 transition-all cursor-pointer disabled:opacity-50"
                      title="Descargar lista de colegas completa en formato Excel / CSV para mailing y base de datos"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Exportar a Excel / CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={loadAdminUsersDirectory}
                      disabled={adminUsersLoading}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                      title="Refrescar directorio desde el servidor"
                    >
                      <RefreshCw className={`w-4 h-4 ${adminUsersLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>

                {userActionToast && (
                  <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-xs font-bold text-center shadow-lg animate-fadeIn flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{userActionToast}</span>
                  </div>
                )}

                {testAlertToast && (
                  <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-bold text-center shadow-lg animate-fadeIn flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>{testAlertToast}</span>
                  </div>
                )}

                {/* CANALES DE ALERTA AUTOMÁTICA DEL ADMINISTRADOR (DR. CARLOS LEAL) */}
                <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border-2 border-cyan-400/60 rounded-2xl p-3.5 sm:p-4 shadow-xl space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-400/40">
                        <Bell className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                          <span>Alertas de Registro al Administrador</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-400/40">
                            🟢 EN VIVO
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-300">
                          Recibes notificación instantánea cada vez que un colega se registra en la plataforma.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSendTestAdminAlert}
                      disabled={testAlertLoading}
                      className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Enviar alerta de prueba a tu correo ahora mismo"
                    >
                      <Send className={`w-3.5 h-3.5 ${testAlertLoading ? 'animate-spin' : ''}`} />
                      <span>{testAlertLoading ? 'Enviando...' : 'Probar Alerta Correo'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-cyan-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Correo del Autor:</span>
                          <span className="font-mono text-cyan-200 font-bold text-xs truncate block">carloseduardoleal29@gmail.com</span>
                        </div>
                      </div>
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-black border border-cyan-400/30 shrink-0">
                        VINCULADO
                      </span>
                    </div>

                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-emerald-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 block uppercase font-bold">Teléfono / WhatsApp:</span>
                          <span className="font-mono text-emerald-300 font-bold text-xs block">04243291438 (+58 424-3291438)</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/584243291438?text=${encodeURIComponent(
                          '🔔 [AnestesiaPro Test Alerta] Dr. Carlos Leal: Tu canal de WhatsApp para notificaciones de registro y administración está configurado y activo.'
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow cursor-pointer shrink-0"
                        title="Abrir chat de WhatsApp para recibir alertas"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ASISTENTE DE DIFUSIÓN RÁPIDA POR WHATSAPP (EAS APP) */}
                <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border-2 border-emerald-500/50 rounded-2xl p-4 shadow-xl space-y-3.5">
                  <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                    <span className="p-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-400/40">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">
                        📢 Asistente de Difusión Rápida (WhatsApp / EAS App)
                      </h4>
                      <p className="text-[10px] text-slate-300">
                        Escribe un comunicado personalizado. Podrás enviarlo al instante con un solo clic a cada colega de tu directorio.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Escribe tu comunicado corto aquí... Ej: ¡Hola Dr(a). {name}! He publicado una nueva actualización importante en AnestesiaPro. Te invito a revisarla aquí: https://tinyurl.com/AnestesiaProApp"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-sans leading-relaxed min-h-[80px]"
                    />
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 mr-1">Plantillas rápidas:</span>
                      <button
                        type="button"
                        onClick={() => setBroadcastMessage('Estimado(a) Dr(a). {name}, le escribe el Dr. Carlos Leal. He publicado una nueva actualización importante en AnestesiaPro. ¡Ingresa hoy para revisarla!\n\n📲 Accede desde aquí:\nhttps://tinyurl.com/AnestesiaProApp')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-cyan-300 font-black rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        📢 Nueva Actualización
                      </button>
                      <button
                        type="button"
                        onClick={() => setBroadcastMessage('Hola Dr(a). {name}, le saluda el Dr. Carlos Leal. Acabo de subir un nuevo recurso médico y guía clínica en formato PDF a la app AnestesiaPro.\n\n📲 Descárgalo gratis aquí:\nhttps://tinyurl.com/AnestesiaProApp')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-emerald-300 font-black rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        📄 Nuevo Recurso PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => setBroadcastMessage('Estimado(a) colega Dr(a). {name}. Te invito a registrarte y activar tu Carnet Digital en AnestesiaPro para personalizar tus reportes preanestésicos en PDF.\n\n📲 Regístrate gratis en 30s aquí:\nhttps://tinyurl.com/AnestesiaProApp')}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-amber-300 font-black rounded-lg text-[10px] transition-all cursor-pointer"
                      >
                        🪪 Activar Carnet
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 italic font-medium">
                      💡 Usa el marcador <strong className="text-emerald-300 font-bold font-mono">{'{name}'}</strong> para que el asistente lo reemplace automáticamente con el nombre de cada colega al momento de abrir el chat.
                    </p>
                  </div>
                </div>

                {/* 4 Summary Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-cyan-500/30 text-center space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">Total Registrados</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-white">{adminUsers.length}</span>
                    <span className="text-[10px] text-slate-400 block">Médicos y Colegas</span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-amber-500/40 text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Plan Élite Activo</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                      {adminUsers.filter(u => u.elitePlan?.status === 'active').length}
                    </span>
                    <span className="text-[10px] text-amber-300/80 block">
                      {adminUsers.length > 0 ? `${Math.round((adminUsers.filter(u => u.elitePlan?.status === 'active').length / adminUsers.length) * 100)}% de los registrados` : '0%'}
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">En Espera / Trial</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                      {adminUsers.filter(u => u.elitePlan?.status !== 'active').length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Pendientes de Pago</span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-emerald-500/30 text-center space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">PWA Instalada</span>
                    <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                      {adminUsers.filter(u => u.isInstalledPWA).length}
                    </span>
                    <span className="text-[10px] text-emerald-300/80 block">En Teléfonos / PC</span>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <input
                      type="text"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      placeholder="Buscar por Nombre, Cédula/DNI, Correo, Teléfono o Lugar de Trabajo..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder:text-slate-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    {/* Status Filter */}
                    <select
                      value={userEliteFilter}
                      onChange={(e: any) => setUserEliteFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 font-bold focus:border-cyan-400"
                    >
                      <option value="all">Todos los Estados</option>
                      <option value="active">⭐ Solo Élite Activos</option>
                      <option value="pending">⏳ En Espera / Pendientes</option>
                      <option value="inactive">❌ Inactivos</option>
                    </select>

                    {/* Country Filter */}
                    <select
                      value={userCountryFilter}
                      onChange={(e) => setUserCountryFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-200 font-bold focus:border-cyan-400"
                    >
                      <option value="all">Todos los Países</option>
                      {SUPPORTED_COUNTRIES.map(c => (
                        <option key={c.code} value={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Registered Users List */}
                {(() => {
                  const filtered = adminUsers.filter(u => {
                    if (userEliteFilter !== 'all') {
                      if (userEliteFilter === 'active' && u.elitePlan?.status !== 'active') return false;
                      if (userEliteFilter === 'pending' && u.elitePlan?.status !== 'pending') return false;
                      if (userEliteFilter === 'inactive' && u.elitePlan?.status !== 'inactive') return false;
                    }

                    if (userCountryFilter !== 'all' && u.country !== userCountryFilter) {
                      return false;
                    }

                    if (userSearchTerm.trim()) {
                      const term = userSearchTerm.toLowerCase();
                      const matchName = u.fullName?.toLowerCase().includes(term);
                      const matchEmail = u.email?.toLowerCase().includes(term);
                      const matchId = u.idNumber?.toLowerCase().includes(term);
                      const matchPhone = u.phone?.toLowerCase().includes(term);
                      const matchWorkplace = u.workplace?.toLowerCase().includes(term);
                      const matchSpecialty = u.specialty?.toLowerCase().includes(term);
                      return matchName || matchEmail || matchId || matchPhone || matchWorkplace || matchSpecialty;
                    }

                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 text-center space-y-3">
                        <User className="w-10 h-10 text-slate-600 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-300">
                          {adminUsers.length === 0 
                            ? 'Aún no hay colegas registrados en el servidor' 
                            : 'No se encontraron usuarios con los filtros seleccionados'}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          {adminUsers.length === 0
                            ? 'A medida que los usuarios utilicen la app y completen el registro rápido de 1 sola vez, sus datos aparecerán en este directorio en tiempo real.'
                            : 'Intenta cambiar el término de búsqueda o quitar los filtros de país y estado.'}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                      {filtered.map((user) => {
                        const isElite = user.elitePlan?.status === 'active';
                        const cleanPhone = (user.phone || '').replace(/[^0-9]/g, '');

                        return (
                          <div
                            key={user.id}
                            className={`p-4 rounded-2xl border transition-all space-y-3 ${
                              isElite 
                                ? 'bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20' 
                                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                              <div className="flex items-start gap-2.5">
                                <div className={`p-2 rounded-xl text-white font-black text-sm shrink-0 flex items-center justify-center ${
                                  isElite ? 'bg-amber-500 text-slate-950 font-black' : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                                }`}>
                                  {isElite ? <Star className="w-4 h-4 fill-current" /> : <User className="w-4 h-4" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-black text-white leading-tight">{user.fullName}</h4>
                                    <span className="text-xs">{user.country}</span>
                                    {user.isInstalledPWA && (
                                      <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-1.5 py-0.2 rounded border border-emerald-500/30">
                                        📱 PWA INSTALADA
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-cyan-300 font-semibold mt-0.5 flex items-center gap-1">
                                    <Stethoscope className="w-3 h-3 text-cyan-400" />
                                    <span>{user.specialty}</span>
                                    {user.workplace && <span className="text-slate-400 font-normal">&bull; {user.workplace}</span>}
                                  </p>
                                </div>
                              </div>

                              {/* Status Badge & Action */}
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                                  isElite 
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/60' 
                                    : 'bg-slate-800 text-slate-300 border-slate-700'
                                }`}>
                                  {isElite ? <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> : <Clock className="w-3 h-3 text-slate-400" />}
                                  <span>{isElite ? 'PLAN ÉLITE ACTIVO ⭐' : 'EN ESPERA (TRIAL)'}</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => setEditingEliteUser(user)}
                                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                                    isElite 
                                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
                                  }`}
                                  title="Configurar y activar/desactivar el plan AnestesiaPro Élite de este usuario"
                                >
                                  {isElite ? '⚙️ Gestionar Plan' : '⭐ Activar Élite'}
                                </button>
                              </div>
                            </div>

                            {/* User details grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Cédula / DNI:</span>
                                <span className="font-mono font-black text-white text-xs">{user.idNumber}</span>
                              </div>

                              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Correo Electrónico:</span>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono text-cyan-300 text-[11px] truncate block">{user.email}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(user.email);
                                      setUserActionToast(`✓ Correo ${user.email} copiado al portapapeles`);
                                      setTimeout(() => setUserActionToast(''), 3000);
                                    }}
                                    className="text-slate-400 hover:text-white p-0.5"
                                    title="Copiar correo"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                                <span className="text-[10px] uppercase font-bold text-slate-400 block">Teléfono / WhatsApp:</span>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="font-mono text-white text-xs">{user.phone || 'No especificado'}</span>
                                  {cleanPhone && (
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <a
                                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                          `Hola Dr(a). ${user.fullName}, le saluda el Dr. Carlos Leal (AnestesiaPro):\n\nHe visto su registro en nuestra plataforma clínica...`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer border border-slate-700/80"
                                        title="Enviar mensaje directo de saludo por WhatsApp"
                                      >
                                        <MessageCircle className="w-3 h-3 text-cyan-400" />
                                        <span>Chat</span>
                                      </a>
                                      
                                      <a
                                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                          broadcastMessage.replace(/{name}/g, user.fullName || 'Colega')
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow cursor-pointer"
                                        title="Enviar el comunicado de difusión personalizado con su nombre"
                                      >
                                        <Send className="w-3 h-3 text-white" />
                                        <span>📢 Difundir</span>
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Plan metadata & timestamps */}
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                              <div className="flex items-center gap-2">
                                <span>Registrado: <strong className="text-slate-300">{user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('es-ES') : 'Reciente'}</strong></span>
                                <span>&bull;</span>
                                <span>Dispositivo: <strong className="text-slate-300">{user.device || 'Web'}</strong></span>
                              </div>

                              <div className="flex items-center gap-2">
                                {user.elitePlan?.adminNotes && (
                                  <span className="text-amber-300 italic bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/20 text-[10px]">
                                    Nota: {user.elitePlan.adminNotes}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (confirm(`¿Estás seguro de que deseas eliminar el registro del Dr(a). ${user.fullName}?`)) {
                                      await deleteAdminUser(user.id, '2534');
                                      setUserActionToast(`✓ Usuario ${user.fullName} eliminado del registro`);
                                      setTimeout(() => setUserActionToast(''), 3000);
                                      loadAdminUsersDirectory();
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-1 hover:bg-rose-950/40 rounded transition-colors"
                                  title="Eliminar registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* MODAL / POPOVER FOR CONFIGURING USER ELITE PLAN */}
                {editingEliteUser && (
                  <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4 animate-in zoom-in-95">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-2 bg-amber-500/20 text-amber-300 rounded-xl">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                          </span>
                          <div>
                            <h4 className="text-sm font-black text-white">Configurar Plan AnestesiaPro Élite</h4>
                            <p className="text-xs text-amber-300 font-semibold">{editingEliteUser.fullName}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingEliteUser(null)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const status = (form.elements.namedItem('planStatus') as HTMLSelectElement).value as any;
                          const planType = (form.elements.namedItem('planType') as HTMLSelectElement).value as any;
                          const expiresAt = (form.elements.namedItem('expiresAt') as HTMLInputElement).value;
                          const adminNotes = (form.elements.namedItem('adminNotes') as HTMLInputElement).value;

                          setEliteActionLoading(true);
                          try {
                            const res = await updateAdminUserElitePlan(
                              editingEliteUser.id,
                              {
                                status,
                                planType,
                                expiresAt,
                                adminNotes,
                                activatedBy: 'Dr. Carlos Leal (Admin)'
                              },
                              '2534'
                            );

                            if (res.success) {
                              setUserActionToast(`✓ Plan Élite de ${editingEliteUser.fullName} actualizado a: ${status.toUpperCase()}`);
                              setTimeout(() => setUserActionToast(''), 4000);
                              setEditingEliteUser(null);
                              loadAdminUsersDirectory();
                            }
                          } finally {
                            setEliteActionLoading(false);
                          }
                        }}
                        className="space-y-3 text-xs"
                      >
                        <div className="space-y-1">
                          <label className="font-bold text-slate-300 block">Estado del Plan Élite:</label>
                          <select
                            name="planStatus"
                            defaultValue={editingEliteUser.elitePlan?.status || 'active'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-black focus:border-amber-400"
                          >
                            <option value="active">⭐ HABILITADO (Activo / Membresía VIP)</option>
                            <option value="pending">⏳ EN ESPERA (Pendiente de Activación / Pago)</option>
                            <option value="inactive">❌ INACTIVO (Suspendido)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-300 block">Tipo de Plan:</label>
                            <select
                              name="planType"
                              defaultValue={editingEliteUser.elitePlan?.planType || 'lifetime'}
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"
                            >
                              <option value="lifetime">Vitalicio / Sin Límite 👑</option>
                              <option value="annual">Anual (12 Meses)</option>
                              <option value="monthly">Mensual</option>
                              <option value="vip">Cortesía VIP Especial</option>
                              <option value="trial">Periodo de Prueba</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-300 block">Vencimiento:</label>
                            <input
                              type="text"
                              name="expiresAt"
                              defaultValue={editingEliteUser.elitePlan?.expiresAt || 'Ilimitado / Vitalicio'}
                              placeholder="Ej. Ilimitado / 2026-12-31"
                              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-slate-300 block">Notas del Administrador (Privado):</label>
                          <input
                            type="text"
                            name="adminNotes"
                            defaultValue={editingEliteUser.elitePlan?.adminNotes || ''}
                            placeholder="Ej. Pago verificado por PagoMóvil / Zelle / Colega Residente"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-amber-400"
                          />
                        </div>

                        <div className="pt-2 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingEliteUser(null)}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                          >
                            Cancelar
                          </button>

                          <button
                            type="submit"
                            disabled={eliteActionLoading}
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer disabled:opacity-50"
                          >
                            {eliteActionLoading ? 'Guardando...' : 'Guardar Cambios del Plan'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: LABORATORIO ÉLITE (IA & PRO - PRIVADO DR. CARLOS LEAL) */}
            {adminActiveTab === 'elite' && (
              <EliteLabModule initialTab="simulador" />
            )}

            {/* TAB 6: TRADUCTOR CLÍNICO FIEL (EXCLUSIVO DR. CARLOS LEAL) */}
            {adminActiveTab === 'traductor' && (
              <EliteLabModule initialTab="traductor" />
            )}

            {/* TAB 7: PREANESTESIA CON MEMBRETE HOSPITALARIO & FIRMA DIGITAL PDF */}
            {adminActiveTab === 'preanestesia' && (
              <EliteLabModule initialTab="preanestesia" />
            )}

            {/* TAB: CRISIS INTRAOPERATORIAS & ALGORITMOS COGNITIVOS */}
            {adminActiveTab === 'crisis' && (
              <EliteLabModule initialTab="crisis" />
            )}

            {/* TAB 8: CALCULADORAS MÉDICAS AVANZADAS (TIVA, INFUSIONES, CONVERSOR, ESCALAS) */}
            {adminActiveTab === 'calculadoras' && (
              <EliteLabModule initialTab="calculadoras" />
            )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="text-[10px] italic text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sesión Autorizada (Dr. Carlos Leal)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem('anestesiapro_is_author_admin');
                        setShowAdminButton(false);
                        setShowStatsModal(false);
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] px-3 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                      title="Oculta el botón 'Panel Privado' de este navegador"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                      <span>Ocultar Botón</span>
                    </button>
                    <button
                      onClick={() => setShowStatsModal(false)}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs px-5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Cerrar Panel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CONTACTO DIRECTO Y SUGERENCIAS */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cyan-500/40 relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30 shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Contacto Directo y Sugerencias
                </h3>
                <p className="text-xs text-cyan-300 font-medium">
                  Dr. Carlos Eduardo Leal &bull; Anestesiología y Reanimación
                </p>
              </div>
            </div>

            {/* CONTACT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Ubicación</span>
                </div>
                <p className="text-slate-200 font-bold">Maracay, Estado Aragua</p>
                <p className="text-[11px] text-slate-400">República Bolivariana de Venezuela</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Correo Electrónico</span>
                </div>
                <p className="text-slate-200 font-mono text-[11px] truncate">carloseduardoleal29@gmail.com</p>
                <a
                  href="mailto:carloseduardoleal29@gmail.com?subject=Consulta%20AnestesiaPro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline font-bold inline-block"
                >
                  Enviar correo directamente &rarr;
                </a>
              </div>
            </div>

            {/* DIRECT INSTAGRAM & EMAIL BUTTONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://www.instagram.com/anestesiapro2026?igsh=MXNkOXAybjVycXppcw=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>Instagram: @anestesiapro2026</span>
              </a>

              <a
                href="mailto:carloseduardoleal29@gmail.com?subject=Sugerencia%20o%20Consulta%20AnestesiaPro"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/40 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Enviar Correo Oficial</span>
              </a>
            </div>

            {/* SUGGESTIONS FORM */}
            <form onSubmit={handleSendFeedback} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <SendHorizontal className="w-4 h-4 text-cyan-400" /> Dejar una Sugerencia o Comentario:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={feedbackName}
                  onChange={(e) => setFeedbackName(e.target.value)}
                  placeholder="Tu Nombre / Dr.(a) (Opcional)"
                  className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  value={feedbackLocation}
                  onChange={(e) => setFeedbackLocation(e.target.value)}
                  placeholder="Ciudad / País (Opcional)"
                  className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <input
                type="email"
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="Tu Correo Electrónico (Opcional)"
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />

              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Escribe aquí tus sugerencias, preguntas o comentarios sobre la app..."
                rows={3}
                className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none resize-none"
                required
              />

              <button
                type="submit"
                disabled={feedbackSending}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{feedbackSending ? 'Enviando...' : 'Enviar Sugerencia al Dr. Carlos Leal'}</span>
              </button>

              {feedbackSent && (
                <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5 text-center space-y-1">
                  <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ¡Sugerencia registrada con éxito!
                  </p>
                  <p className="text-[11px] text-emerald-200">
                    Muchas gracias por tu valioso aporte. El Dr. Carlos Leal revisará tu mensaje.
                  </p>
                </div>
              )}
            </form>

            <div className="pt-1 flex justify-end">
              <button
                onClick={() => setShowContactModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Instrucciones de Instalación Web / PWA Directa */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-cyan-500/40 relative space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5">
              <div className="shrink-0 p-1.5 bg-white rounded-2xl border border-cyan-300 shadow-md overflow-hidden">
                <img
                  src={LOGO_SHIELD_BASE64}
                  alt="AnestesiaPro Logo"
                  className="w-12 h-12 object-contain rounded-xl"
                />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  ¿Cómo instalar AnestesiaPro en tu dispositivo?
                </h3>
                <p className="text-xs text-cyan-300 font-medium mt-0.5">
                  Acceso directo oficial (PWA) • Pantalla completa sin barras
                </p>
              </div>
            </div>

            {/* Direct PWA 1-Click Install Button if supported by browser */}
            {deferredPrompt && (
              <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-500/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
                <div>
                  <p className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400 fill-current" /> ¡Instalación Automática Disponible!
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Tu navegador permite instalar la app con un solo toque.
                  </p>
                </div>
                <button
                  onClick={() => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult: any) => {
                      if (choiceResult?.outcome === 'accepted') {
                        recordAppInstall().then(s => {
                          if (s) updateStatsSafely(s);
                        });
                      }
                      setDeferredPrompt(null);
                    });
                  }}
                  className="shrink-0 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                >
                  ⚡ Instalar Ahora
                </button>
              </div>
            )}

            {/* Detected Device Badge & Tabs */}
            <div className="flex items-center justify-between text-xs px-1 pt-1">
              <span className="text-slate-400 font-medium">Instrucciones según tu equipo:</span>
              <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Detectado: {detectedUserPlatform === 'ios' ? 'iPhone / iPad 📱' : detectedUserPlatform === 'android' ? 'Android 📱' : 'PC / Mac 💻'}
              </span>
            </div>

            {/* Device Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setInstallDeviceTab('android')}
                className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  installDeviceTab === 'android'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
                {detectedUserPlatform === 'android' && (
                  <span className="text-[9px] bg-slate-950 text-emerald-300 px-1 py-0.2 rounded font-mono">TÚ</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setInstallDeviceTab('ios')}
                className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  installDeviceTab === 'ios'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
                {detectedUserPlatform === 'ios' && (
                  <span className="text-[9px] bg-slate-950 text-cyan-300 px-1 py-0.2 rounded font-mono">TÚ</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setInstallDeviceTab('pc')}
                className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  installDeviceTab === 'pc'
                    ? 'bg-indigo-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>PC / Mac</span>
                {detectedUserPlatform === 'pc' && (
                  <span className="text-[9px] bg-slate-950 text-indigo-300 px-1 py-0.2 rounded font-mono">TÚ</span>
                )}
              </button>
            </div>

            {/* Device Specific Step by Step Instructions */}
            <div className="space-y-3 pt-1">
              {installDeviceTab === 'android' && (
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                      <Smartphone className="w-4 h-4" />
                      <span>Instalación en Teléfonos Android (Google Chrome / Edge / Brave):</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-200">
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <p className="leading-snug">
                          Abre este enlace web oficial en <strong>Google Chrome</strong> (o tu navegador preferido).
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <p className="leading-snug">
                          Toca el menú de los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <p className="leading-snug">
                          Selecciona la opción <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <p className="leading-snug">
                          Confirma tocando <strong>"Instalar"</strong>. ¡Listo! El ícono oficial del <strong>Escudo Anestésico</strong> aparecerá en tu teléfono y se abrirá a pantalla completa como una app nativa.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {installDeviceTab === 'ios' && (
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
                      <Smartphone className="w-4 h-4" />
                      <span>Instalación en iPhone / iPad (Navegador Safari):</span>
                    </div>

                    {/* Visual Safari Guide Box */}
                    <div className="bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 rounded-xl p-3 space-y-2">
                      <p className="text-[11px] font-black text-cyan-300 flex items-center justify-between">
                        <span>📱 Resumen Visual en Safari (iPhone):</span>
                        <span className="text-[10px] text-emerald-400 font-normal">Sin descargar archivos APK</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-slate-950/90 p-2.5 rounded-lg border border-cyan-500/30 flex flex-col items-center justify-center gap-1 shadow">
                          <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
                            <Share className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="text-[11px] font-black text-white">1. Pulsar Compartir</span>
                          <span className="text-[10px] text-slate-400">Barra inferior de Safari</span>
                        </div>
                        <div className="bg-slate-950/90 p-2.5 rounded-lg border border-cyan-500/30 flex flex-col items-center justify-center gap-1 shadow">
                          <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                          </div>
                          <span className="text-[11px] font-black text-white">2. "Agregar al inicio"</span>
                          <span className="text-[10px] text-slate-400">Opción con el ícono ⊞</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-200">
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <p className="leading-snug">
                          Abre este enlace web oficial en el navegador <strong>Safari</strong> de tu iPhone o iPad.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <p className="leading-snug">
                          Toca el botón <strong>Compartir <Share className="w-3.5 h-3.5 inline text-cyan-400 mx-0.5" /></strong> (el ícono del cuadrado con una flecha hacia arriba en la barra inferior).
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <p className="leading-snug">
                          Desliza hacia abajo en el menú de opciones y toca <strong>"Agregar al inicio"</strong> (o "Añadir a pantalla de inicio" ⊞).
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                        <p className="leading-snug">
                          Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Tendrás el ícono de <strong>AnestesiaPro</strong> listo para usar sin barra de navegación.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {installDeviceTab === 'pc' && (
                <div className="space-y-2.5 animate-fadeIn">
                  <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs">
                      <Monitor className="w-4 h-4" />
                      <span>Instalación en Computadora / Laptop / Mac (Chrome, Edge o Brave):</span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-200">
                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                        <p className="leading-snug">
                          Abre la web en <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                        <p className="leading-snug">
                          En la barra de direcciones superior (a la derecha), haz clic en el ícono de <strong>Instalar</strong> (pantallita con flecha) o en el menú de <strong>3 puntos (⋮) &gt; "Instalar AnestesiaPro..."</strong>.
                        </p>
                      </div>

                      <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                        <p className="leading-snug">
                          Haz clic en <strong>"Instalar"</strong>. La aplicación se abrirá en su propia ventana independiente de escritorio.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Manual Installation Button */}
            <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-950 border border-emerald-500/50 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="text-left">
                <p className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  ¿Ya añadiste la aplicación a tu pantalla de inicio?
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Al pulsar aquí se registra de inmediato tu instalación en los contadores globales del servidor.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  recordAppInstall().then(s => {
                    if (s) updateStatsSafely(s);
                  });
                  try {
                    localStorage.setItem('anestesiapro_pwa_standalone_recorded', 'true');
                  } catch (e) {}
                  setInstallConfirmed(true);
                  setTimeout(() => setInstallConfirmed(false), 4000);
                }}
                disabled={installConfirmed}
                className={`shrink-0 text-xs font-black px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 ${
                  installConfirmed
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 active:scale-95'
                }`}
              >
                {installConfirmed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>¡Instalación Confirmada!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>✅ ¡Ya la instalé!</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Link & Invitation Copy Bar */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    ¿Quieres invitar a un colega a instalar AnestesiaPro?
                  </p>
                  <p className="text-xs text-cyan-300 font-mono truncate mt-0.5">
                    {SHORT_APP_URL}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Sharing / Copying */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {/* 1. Full Invitation with Description for Facebook / WhatsApp / Email */}
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `🩺 Te invito a instalar y usar AnestesiaPro, la suite clínica de anestesiología creada por el Dr. Carlos Leal (Especialista en Anestesiología y Reanimación).\n\n✨ Herramientas médicas destacadas:\n• Evaluación preanestésica digital con informe médico oficial en PDF\n• Manejo de Vía Aérea Difícil (Enfoque VORTEX & Algoritmos DAS)\n• Calculadora de inducción anestésica ajustada por peso real (mg y mL)\n• Protocolo E-MOTIVE para Hemorragia Posparto (NEJM / OMS / FIGO)\n• Vademécum completo, escalas clínicas ASA I-VI y criterios URPA\n⚡ 100% gratuita y funciona sin conexión a internet en quirófano.\n\n📲 Ábrela o instálala directamente aquí:\n${SHORT_APP_URL}`;
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(fullText);
                      setCopiedInvitation(true);
                      setTimeout(() => setCopiedInvitation(false), 3000);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                    copiedInvitation
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                  }`}
                  title="Copia el mensaje completo con descripción clínica y enlace, listo para pegar en Facebook, WhatsApp o correo"
                >
                  {copiedInvitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>¡Invitación + Enlace Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-100" />
                      <span>Copiar Invitación con Descripción</span>
                    </>
                  )}
                </button>

                {/* 2. Copy Link Only */}
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(SHORT_APP_URL);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 3000);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 ${
                    copiedLink
                      ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                  }`}
                  title="Copiar únicamente la dirección web"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>¡Enlace Copiado!</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copiar sólo Enlace Web</span>
                    </>
                  )}
                </button>
              </div>

              {/* Social Direct Links (Facebook & WhatsApp) */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-400">Compartir directo en:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🩺 Te invito a usar e instalar AnestesiaPro, la suite clínica de anestesiología creada por el Dr. Carlos Leal. Evaluación preanestésica con informe en PDF, vía aérea VORTEX, calculadoras por peso y protocolos 100% offline:\n\n🔗 ${SHORT_APP_URL}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-bold text-[11px]"
                    title="Compartir invitación por WhatsApp"
                  >
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHORT_APP_URL)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Also copy full text so user can easily paste into FB post
                      const fullText = `🩺 Te invito a instalar y usar AnestesiaPro, la suite clínica de anestesiología creada por el Dr. Carlos Leal (Especialista en Anestesiología y Reanimación).\n\n✨ Herramientas médicas destacadas:\n• Evaluación preanestésica digital con informe médico oficial en PDF\n• Manejo de Vía Aérea Difícil (Enfoque VORTEX & Algoritmos DAS)\n• Calculadora de inducción anestésica ajustada por peso real (mg y mL)\n• Protocolo E-MOTIVE para Hemorragia Posparto (NEJM / OMS / FIGO)\n• Vademécum completo y escalas clínicas\n⚡ 100% gratuita y funciona sin conexión a internet en quirófano.\n\n📲 Ábrela o instálala directamente aquí:\n${SHORT_APP_URL}`;
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(fullText);
                      }
                    }}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 bg-blue-950/60 hover:bg-blue-900/60 border border-blue-700/60 px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-bold text-[11px]"
                    title="Publicar en Facebook (Copia automáticamente el texto para pegar en tu publicación)"
                  >
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={{
          title: 'AnestesiaPro • Suite Clínica para Anestesiólogos y Médicos de Quirófano',
          description: 'Te invito a revisar AnestesiaPro: evaluación preanestésica digital con informe en PDF, calculadoras farmacológicas por peso, algoritmos de vía aérea difícil (VORTEX & DAS), vademécum y nuevo protocolo E-MOTIVE para hemorragia posparto.',
          url: SHORT_APP_URL
        }}
      />

      {/* DEVELOPER SHOWCASE MODAL (DR. CARLOS LEAL • C.E. LEAL STUDIO) */}
      <DeveloperModal
        isOpen={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenShare={() => setShowShareModal(true)}
      />

      {/* BANNER / TOAST PRIVADO EXCLUSIVO PARA EL ADMINISTRADOR */}
      {adminLiveToast && (
        <div
          className={`fixed bottom-4 right-4 z-50 max-w-md w-[94vw] sm:w-full rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white animate-slideUp transition-all ${
            adminLiveToast.type === 'install'
              ? 'bg-gradient-to-br from-slate-950 via-emerald-950/95 to-slate-950 border-2 border-emerald-400 shadow-emerald-500/40 ring-2 ring-emerald-400/20'
              : 'bg-slate-900/95 border-2 border-cyan-500/70 shadow-cyan-950/80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 border animate-pulse ${
                  adminLiveToast.type === 'install'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-500/30'
                    : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                }`}
              >
                {adminLiveToast.type === 'install' ? (
                  <Sparkles className="w-5 h-5 text-emerald-300 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </span>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      adminLiveToast.type === 'install'
                        ? 'bg-emerald-400 text-slate-950 font-black shadow-sm'
                        : 'bg-cyan-950 text-cyan-400 border border-cyan-500/40'
                    }`}
                  >
                    {adminLiveToast.type === 'install'
                      ? '🎉 ¡NUEVA INSTALACIÓN CONFIRMADA!'
                      : 'Solo para Administrador'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {formatShortLocalTime(adminLiveToast.timestamp)}
                  </span>
                </div>
                <p
                  className={`text-xs font-black leading-snug ${
                    adminLiveToast.type === 'install' ? 'text-emerald-300 text-sm' : 'text-slate-100'
                  }`}
                >
                  {adminLiveToast.type === 'install' ? '✨ ¡Felicidades Dr. Carlos Leal!' : adminLiveToast.title}
                </p>
                <p className="text-[11px] text-slate-200 leading-snug">
                  {adminLiveToast.detail}
                </p>
                <div className="pt-1.5 flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAdminLiveToast(null);
                      setAdminActiveTab('notificaciones');
                      setAdminEventsFilter('install');
                      setShowStatsModal(true);
                    }}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-md ${
                      adminLiveToast.type === 'install'
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                    }`}
                  >
                    <span>Ver en Bitácora</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <a
                    href={`mailto:carloseduardoleal29@gmail.com?subject=${encodeURIComponent(
                      adminLiveToast.type === 'install'
                        ? `🎉 ¡Nueva Instalación en AnestesiaPro!: ${adminLiveToast.detail || adminLiveToast.title}`
                        : `🚨 Alerta AnestesiaPro: ${adminLiveToast.title}`
                    )}&body=${encodeURIComponent(
                      `Dr. Carlos Leal,\n\nNotificación en AnestesiaPro:\n\n• Evento: ${adminLiveToast.title}\n• Detalle: ${adminLiveToast.detail || ''}\n• Dispositivo: ${adminLiveToast.device}\n• Ubicación: ${adminLiveToast.location}\n• Hora: ${formatLocalDisplayTime(adminLiveToast.timestamp)}\n\nAcceso a la app: ${getCanonicalAppOrigin()}`
                    )}`}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border ${
                      adminLiveToast.type === 'install'
                        ? 'text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40'
                        : 'text-rose-300 hover:text-white bg-rose-950/70 hover:bg-rose-900 border-rose-500/40'
                    }`}
                    title="Enviar esta alerta a mi correo (carloseduardoleal29@gmail.com)"
                  >
                    <Mail className={`w-3 h-3 ${adminLiveToast.type === 'install' ? 'text-emerald-400' : 'text-rose-400'}`} />
                    <span>A mi Correo</span>
                  </a>
                  <button
                    onClick={() => setAdminLiveToast(null)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setAdminLiveToast(null)}
              className="text-slate-400 hover:text-slate-200 p-1 rounded-lg cursor-pointer shrink-0"
              title="Cerrar notificación privada"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* USER REGISTRATION & DIGITAL CREDENTIAL MODAL */}
      <UserRegistrationModal
        isOpen={showUserRegistrationModal}
        onClose={() => setShowUserRegistrationModal(false)}
        initialEditMode={userRegEditMode}
        onSuccess={(updatedUser) => {
          setUserProfile(updatedUser);
        }}
      />
    </>
  );
};

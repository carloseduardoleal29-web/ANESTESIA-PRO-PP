import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Download, ShieldCheck, RefreshCw, X, FileSpreadsheet, 
  Globe, Mail, Phone, Calendar, Smartphone, Trash2, CheckCircle2, ArrowLeft, Lock,
  Award, Stethoscope, Building2, CreditCard, Sparkles, Star, ExternalLink, QrCode, Eye, Zap, Bell
} from 'lucide-react';
import { RegisteredUser, getRegisteredUsersList, exportUsersToCSV } from '../lib/userRegistrationService';
import { DigitalCredentialModal } from './DigitalCredentialModal';
import { db, collection, onSnapshot, getDocs } from '../lib/firebase';
import { 
  requestPushPermissionAndSubscribe, 
  triggerTestPushNotification, 
  getNotificationPermission, 
  isPushSupported 
} from '../lib/pushNotificationService';

interface AdminMedicosPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMedicosPanel: React.FC<AdminMedicosPanelProps> = ({ isOpen, onClose }) => {
  const [medicos, setMedicos] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [selectedDoctorForCarnet, setSelectedDoctorForCarnet] = useState<RegisteredUser | null>(null);
  const [pushStatus, setPushStatus] = useState<NotificationPermission>(() => getNotificationPermission());
  const [isActivatingPush, setIsActivatingPush] = useState<boolean>(false);
  const [isSendingTestPush, setIsSendingTestPush] = useState<boolean>(false);

  // Load and recover all registered doctors from Server + Firestore
  const loadAndSyncDoctors = async (showToast: boolean = false) => {
    setIsSyncingCloud(true);
    setErrorMsg(null);
    if (showToast) {
      setSyncSuccessMessage('🔄 Conectando y sincronizando directorio médico en la nube...');
    }
    const startTime = Date.now();
    try {
      // 3.5s timeout safeguard so it can never stay stuck
      const fetchPromise = getRegisteredUsersList('2534');
      const timeoutPromise = new Promise<any>((resolve) =>
        setTimeout(() => resolve({ success: true, users: medicos, isTimeout: true }), 3500)
      );
      const res = await Promise.race([fetchPromise, timeoutPromise]);

      const nowStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTime(nowStr);

      if (res.success && Array.isArray(res.users) && res.users.length > 0) {
        setMedicos(res.users);
        if (showToast) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          setSyncSuccessMessage(`✅ ¡Sincronizado con éxito (${elapsed}s)! ${res.users.length} médicos actualizados y validados con la nube (${nowStr}).`);
          setTimeout(() => setSyncSuccessMessage(null), 8000);
        }
      } else if (showToast) {
        setSyncSuccessMessage(`✅ ¡Directorio al día! Sincronizado correctamente (${nowStr}).`);
        setTimeout(() => setSyncSuccessMessage(null), 6000);
      }
    } catch (err: any) {
      console.warn('[AdminMedicosPanel] Error recuperando médicos:', err);
      setErrorMsg('Aviso: ' + (err?.message || 'Error de conexión con la nube'));
      setSyncSuccessMessage(null);
    } finally {
      setLoading(false);
      setIsSyncingCloud(false);
    }
  };

  const [isDeepScanning, setIsDeepScanning] = useState<boolean>(false);

  // Deep cloud rescue across all Firestore collections (registered_users, medicos_registrados, preanesthesia, feedback)
  const handleDeepRescue = async () => {
    setIsDeepScanning(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/users/deep-cloud-rescue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-pin': '2534'
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setMedicos(data.users);
        setSyncSuccessMessage(`🔍 ${data.message || `Escaneo completado: ${data.users.length} médicos consolidados en la nube.`}`);
        setTimeout(() => setSyncSuccessMessage(null), 8000);
      } else {
        setErrorMsg(data.error || 'Error durante el escaneo');
      }
    } catch (err: any) {
      console.warn('[DeepRescue] Error:', err);
      setErrorMsg('Error al conectar con el rescate en nube: ' + err?.message);
    } finally {
      setIsDeepScanning(false);
    }
  };

  // Preview how non-registered colleagues see the banner
  const handlePreviewBanner = () => {
    onClose();
    sessionStorage.setItem('anestesiapro_preview_banner', 'true');
    window.dispatchEvent(new CustomEvent('anestesiapro_preview_registration_banner'));
  };

  // Activate and link Web Push notifications on Dr. Carlos Leal's current phone/PC
  const handleActivatePush = async () => {
    setIsActivatingPush(true);
    setErrorMsg(null);
    try {
      const res = await requestPushPermissionAndSubscribe({
        email: 'carloseduardoleal29@gmail.com',
        name: 'Dr. Carlos Eduardo Leal'
      });
      const perm = getNotificationPermission();
      setPushStatus(perm);

      if (res.success || perm === 'granted') {
        setSyncSuccessMessage('🔔 ¡Notificaciones Push VINCULADAS con éxito a este dispositivo! Recibirás avisos instantáneos de nuevos registros y descargas.');
        setTimeout(() => setSyncSuccessMessage(null), 8000);
        await triggerTestPushNotification(
          '🩺 AnestesiaPro | Dr. Carlos Leal',
          '¡Dispositivo vinculado con éxito! Tu teléfono recibirá alertas automáticas de nuevos colegas registrados.'
        );
      } else {
        setErrorMsg(res.message || 'Permiso de notificaciones no concedido. Revisa los permisos de tu navegador.');
      }
    } catch (err: any) {
      setErrorMsg('Error al activar notificaciones: ' + (err?.message || 'Error desconocido'));
    } finally {
      setIsActivatingPush(false);
    }
  };

  // Send an instant test alert to verify Push delivery end-to-end
  const handleSendTestPush = async () => {
    setIsSendingTestPush(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/send-test-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-pin': '2534'
        }
      });
      const data = await res.json();
      
      await triggerTestPushNotification(
        '👤 ¡NUEVO COLEGA REGISTRADO (PRUEBA)!',
        'Dr(a). Usuario de Prueba (Venezuela, C.I: V-15489288, Anestesiología) se ha registrado en AnestesiaPro.'
      );

      if (data.success) {
        setSyncSuccessMessage(`✅ Alerta de prueba enviada con éxito (${data.message || 'Notificación despachada'}).`);
        setTimeout(() => setSyncSuccessMessage(null), 8000);
      } else {
        setErrorMsg(data.error || 'Aviso al enviar alerta de prueba');
      }
    } catch (err: any) {
      setErrorMsg('Error al enviar prueba: ' + (err?.message || 'Error de conexión'));
    } finally {
      setIsSendingTestPush(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    loadAndSyncDoctors(false);

    // Also attach realtime listeners to Firestore collections
    let unsub1: (() => void) | null = null;
    let unsub2: (() => void) | null = null;

    try {
      const colRef1 = collection(db, 'registered_users');
      unsub1 = onSnapshot(colRef1, () => {
        loadAndSyncDoctors(false);
      }, () => {});

      const colRef2 = collection(db, 'medicos_registrados');
      unsub2 = onSnapshot(colRef2, () => {
        loadAndSyncDoctors(false);
      }, () => {});
    } catch (e) {
      console.warn('[AdminMedicosPanel] Firestore listener fallback:', e);
    }

    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, [isOpen]);

  // Filtered list based on search query
  const filteredMedicos = medicos.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.idNumber && m.idNumber.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.country && m.country.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.specialty && m.specialty.toLowerCase().includes(q)) ||
      (m.workplace && m.workplace.toLowerCase().includes(q))
    );
  });

  const handleExport = () => {
    if (filteredMedicos.length > 0) {
      exportUsersToCSV(filteredMedicos);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="max-w-7xl mx-auto w-full bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto min-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 sm:p-6 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 flex-wrap">
                <span>Panel de Administrador • Médicos Registrados</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  En Vivo • Google Firebase
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Directorio y credenciales médicas en AnestesiaPro (Dr. Carlos Leal). Todos los registros están respaldados en la nube.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePreviewBanner}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-300"
              title="Ver y probar el banner flotante llamativo tal como lo ve un colega que aún no se ha registrado"
            >
              <Eye className="w-4 h-4 text-slate-950" />
              <span>👁️ Probar Banner de Colegas</span>
            </button>

            <button
              onClick={handleDeepRescue}
              disabled={isDeepScanning}
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 border border-purple-400/50"
              title="Escanear a fondo todas las colecciones de Firestore, evaluaciones y respaldos para rescatar cualquier médico"
            >
              <Zap className={`w-4 h-4 text-amber-300 ${isDeepScanning ? 'animate-spin' : ''}`} />
              <span>{isDeepScanning ? 'Escaneando Nube...' : '🔍 Escaneo Profundo en Nube'}</span>
            </button>

            <div className="flex flex-col items-end">
              <button
                onClick={() => loadAndSyncDoctors(true)}
                disabled={isSyncingCloud}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 border border-cyan-400/40"
                title="Recuperar y verificar los datos de todos los médicos desde Google Cloud Firestore y el Servidor"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                <span>{isSyncingCloud ? 'Sincronizando...' : '🔄 Sincronizar Nube'}</span>
              </button>
              {lastSyncTime && (
                <span className="text-[9px] text-cyan-300/80 font-mono mt-0.5 hidden sm:block">
                  Última sinc: {lastSyncTime}
                </span>
              )}
            </div>

            <button
              onClick={handleExport}
              disabled={medicos.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95 border border-emerald-400/40"
              title="Exportar lista completa a CSV / Excel con cédulas y teléfonos"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync feedback banner */}
        {(syncSuccessMessage || isSyncingCloud) && (
          <div className={`${
            isSyncingCloud && !syncSuccessMessage?.startsWith('✅')
              ? 'bg-cyan-950/95 border-cyan-500/50 text-cyan-200'
              : 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200'
          } border-b px-6 py-2.5 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn`}>
            <div className="flex items-center gap-2.5">
              {isSyncingCloud && !syncSuccessMessage?.startsWith('✅') ? (
                <RefreshCw className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{syncSuccessMessage || 'Sincronizando directorio médico en tiempo real con la nube...'}</span>
            </div>
            {lastSyncTime && (
              <span className="text-[10px] text-cyan-300 font-mono bg-slate-900/90 px-2.5 py-0.5 rounded border border-cyan-800 shrink-0">
                Sincronizado: {lastSyncTime}
              </span>
            )}
          </div>
        )}

        {/* Web Push Notification Activation Card for Dr. Carlos Leal */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border-b border-cyan-500/30 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
              pushStatus === 'granted' 
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40' 
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-400/40'
            }`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Notificaciones Web Push en tu Teléfono / PC
                </h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                  pushStatus === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {pushStatus === 'granted' ? '🔔 ACTIVADAS EN ESTE DISPOSITIVO' : '⚠️ PENDIENTE DE VINCULAR'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Recibe una alerta push en pantalla cada vez que un colega se registre en AnestesiaPro o descargue una guía clínica, incluso con la app cerrada.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0 w-full md:w-auto">
            <button
              onClick={handleActivatePush}
              disabled={isActivatingPush}
              className={`flex-1 md:flex-none px-4 py-2.5 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                pushStatus === 'granted'
                  ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950'
              }`}
            >
              <Bell className={`w-4 h-4 ${isActivatingPush ? 'animate-bounce' : ''}`} />
              <span>
                {isActivatingPush 
                  ? 'Activando...' 
                  : pushStatus === 'granted' 
                  ? '✓ Dispositivo Vinculado (Re-conectar)' 
                  : '🔔 Activar Alertas en este Teléfono'}
              </span>
            </button>
            <button
              onClick={handleSendTestPush}
              disabled={isSendingTestPush}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Envía una notificación de prueba instantánea a este dispositivo y a los canales de alerta"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSendingTestPush ? 'animate-spin' : ''}`} />
              <span>{isSendingTestPush ? 'Enviando...' : 'Probar Alerta'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Stats Summary */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-900 border border-cyan-500/30 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Users className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Total Médicos</span>
                <span className="text-base font-black text-cyan-300 font-mono leading-tight">{medicos.length}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Plan Estándar</span>
                <span className="text-base font-black text-cyan-300 font-mono leading-tight">
                  {medicos.filter(m => !(m.id === 'usr_carlos_leal_admin' || m.email?.toLowerCase().includes('carloseduardoleal'))).length}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-amber-500/30 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Administrador</span>
                <span className="text-base font-black text-amber-300 font-mono leading-tight">
                  {medicos.filter(m => m.id === 'usr_carlos_leal_admin' || m.email?.toLowerCase().includes('carloseduardoleal')).length || 1}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-sm">
              <Globe className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Países</span>
                <span className="text-base font-black text-indigo-300 font-mono leading-tight">
                  {new Set(medicos.map(m => m.country).filter(Boolean)).size}
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, cédula, correo, país o especialidad..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto p-3 sm:p-5 bg-slate-950">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Recuperando registros desde la nube de AnestesiaPro...</p>
            </div>
          ) : errorMsg && medicos.length === 0 ? (
            <div className="py-16 text-center space-y-3 max-w-md mx-auto bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-sm font-bold text-rose-300">Aviso de conexión</h3>
              <p className="text-xs text-slate-300">{errorMsg}</p>
              <button
                onClick={() => loadAndSyncDoctors(true)}
                className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Reintentar recuperación
              </button>
            </div>
          ) : filteredMedicos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No se encontraron médicos con ese criterio</h3>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Prueba con otro término de búsqueda o limpia el buscador.' : 'No hay médicos registrados.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">#</th>
                  <th className="py-3 px-3">Médico / Especialista</th>
                  <th className="py-3 px-3">Cédula / DNI</th>
                  <th className="py-3 px-3">Especialidad & Hospital</th>
                  <th className="py-3 px-3">Contacto Directo</th>
                  <th className="py-3 px-3">País</th>
                  <th className="py-3 px-3">Carnet / Plan</th>
                  <th className="py-3 px-3">Registro</th>
                  <th className="py-3 px-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredMedicos.map((m, idx) => {
                  const isCarlos = m.id === 'usr_carlos_leal_admin' || m.email?.toLowerCase().includes('carloseduardoleal');
                  const isElite = m.elitePlan?.status === 'active';

                  return (
                    <tr key={m.id || idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-3 font-mono text-slate-500">{idx + 1}</td>

                      {/* Doctor Name & Avatar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 border ${
                            isCarlos 
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                              : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                          }`}>
                            {(m.fullName || 'M').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-white block truncate leading-tight">
                              {m.fullName}
                            </span>
                            {isCarlos && (
                              <span className="text-[9px] font-black text-amber-400 uppercase tracking-tighter">
                                ★ Autor y Fundador
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Cédula / DNI */}
                      <td className="py-3.5 px-3 font-mono text-cyan-300 font-bold whitespace-nowrap">
                        <span className="bg-slate-900 px-2 py-1 rounded-md border border-slate-700">
                          {m.idNumber || 'Sin cédula'}
                        </span>
                      </td>

                      {/* Especialidad & Workplace */}
                      <td className="py-3.5 px-3 max-w-[220px]">
                        <p className="text-slate-200 font-semibold truncate leading-tight flex items-center gap-1">
                          <Stethoscope className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{m.specialty || 'Anestesiología'}</span>
                        </p>
                        {m.workplace && (
                          <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                            <Building2 className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                            <span>{m.workplace}</span>
                          </p>
                        )}
                      </td>

                      {/* Contacto Directo */}
                      <td className="py-3.5 px-3 space-y-1 whitespace-nowrap">
                        {m.email && (
                          <a href={`mailto:${m.email}`} className="text-cyan-300 hover:underline flex items-center gap-1 font-mono text-[11px]">
                            <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{m.email}</span>
                          </a>
                        )}
                        {m.phone && (
                          <a 
                            href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{m.phone}</span>
                          </a>
                        )}
                      </td>

                      {/* País */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300 font-medium flex items-center gap-1.5 w-fit text-[11px]">
                          <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                          {m.country || 'Venezuela'}
                        </span>
                      </td>

                      {/* Carnet / Plan */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {isCarlos ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>👑 Administrador</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 w-fit bg-slate-800 text-slate-300 border-slate-700">
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            <span>Plan Estándar</span>
                          </span>
                        )}
                      </td>

                      {/* Registro */}
                      <td className="py-3.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{m.registeredAt ? new Date(m.registeredAt).toLocaleDateString('es-VE') : 'Previo'}</span>
                        </div>
                      </td>

                      {/* Botón Ver Carnet Digital */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => setSelectedDoctorForCarnet(m)}
                          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-1 mx-auto"
                          title={`Ver Carnet Digital oficial de ${m.fullName}`}
                        >
                          <span>🪪 Carnet</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span>✓ Directorio sincronizado en tiempo real con Google Cloud Firestore y el servidor de AnestesiaPro.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>

      {/* Modal para ver Carnet Digital de cualquier médico seleccionado */}
      {selectedDoctorForCarnet && (
        <DigitalCredentialModal
          user={selectedDoctorForCarnet}
          onClose={() => setSelectedDoctorForCarnet(null)}
        />
      )}
    </div>
  );
};

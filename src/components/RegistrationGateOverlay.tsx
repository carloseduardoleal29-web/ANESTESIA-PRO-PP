import React, { useState } from 'react';
import { 
  Sparkles, ShieldCheck, UserCheck, Lock, ArrowRight, CheckCircle2, 
  AlertCircle, KeyRound, Building2, Phone, Mail, FileText, Globe, 
  MessageSquare, Send, PenTool, Stamp, Award, Stethoscope, ChevronDown, Check
} from 'lucide-react';
import { 
  registerUserProfile, 
  SUPPORTED_COUNTRIES, 
  SPECIALTY_OPTIONS, 
  saveStoredUserProfile,
  autoRestoreRegistrationAsync,
  getWelcomeWhatsAppUrl,
  getAdminNotificationWhatsAppUrl,
  RegisteredUser 
} from '../lib/userRegistrationService';
import { saveDoctorCredentials } from '../lib/preanesthesiaStorage';
import { DigitalSignatureCanvas } from './preanesthesia/DigitalSignatureCanvas';
import { DoctorStampModal } from './preanesthesia/DoctorStampModal';

interface RegistrationGateOverlayProps {
  onSuccess: (user: RegisteredUser) => void;
  onAdminUnlock?: () => void;
}

const MEDICAL_ROLES = [
  { id: 'especialista', label: '🩺 Médico Especialista en Anestesiología y Reanimación', badge: 'Especialista' },
  { id: 'residente', label: '🎓 Médico Residente de Anestesiología (R1 / R2 / R3 / R4)', badge: 'Residente' },
  { id: 'cirujano_general', label: '🏥 Médico Cirujano / Médico General en Área Quirúrgica', badge: 'Quirúrgico' },
  { id: 'uci_emergencia', label: '👨‍⚕️ Médico en Cuidados Intensivos (UCI) / Reanimación', badge: 'Intensivista' },
  { id: 'otro', label: '💊 Otro Profesional Médico Quirúrgico', badge: 'Médico' }
];

const SUBSPECIALTIES = [
  'Anestesiología General y TIVA (Infusión Total Intravenosa)',
  'Anestesia Obstétrica y Ginecológica',
  'Anestesia Cardiovascular y Torácica',
  'Anestesiología Pediátrica y Neonatal',
  'Anestesia Regional y Bloqueos Ecoguiados',
  'Neuroanestesia y Neurocirugía',
  'Medicina Crítica y Reanimación Perioperatoria',
  'Manejo del Dolor Agudo y Crónico'
];

export function RegistrationGateOverlay({ onSuccess, onAdminUnlock }: RegistrationGateOverlayProps) {
  // 1. Datos Personales y Contacto
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // 2. Jerarquía y Especialidad
  const [medicalRole, setMedicalRole] = useState(MEDICAL_ROLES[0].label);
  const [subspecialty, setSubspecialty] = useState(SUBSPECIALTIES[0]);

  // 3. Ubicación y Centro de Trabajo
  const [country, setCountry] = useState('🇻🇪 Venezuela');
  const [workplace, setWorkplace] = useState('');
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState('');
  const [collegeRegistration, setCollegeRegistration] = useState('');

  // 4. Firma y Sello Digital
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState<string | null>(null);
  const [digitalStampUrl, setDigitalStampUrl] = useState<string | null>(null);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [showStampModal, setShowStampModal] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // State for cross-device carnet synchronization (phone -> PC without re-registering)
  const [showSyncTab, setShowSyncTab] = useState(false);
  const [syncIdentifier, setSyncIdentifier] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Secret admin unlock gesture for Dr. Carlos Leal (5 clicks on lock badge or Alt+A)
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Auto-restore check on mount (recovers profile from IndexedDB, Cookies, or Server database)
  React.useEffect(() => {
    autoRestoreRegistrationAsync().then((user) => {
      if (user) {
        onSuccess(user);
      }
    });
  }, [onSuccess]);

  // Keyboard shortcut Alt+A or Ctrl+Shift+A for Dr. Carlos Leal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setShowAdminPinModal(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSecretLockClick = () => {
    const next = secretClickCount + 1;
    setSecretClickCount(next);
    if (next >= 5) {
      setSecretClickCount(0);
      setShowAdminPinModal(true);
    }
  };

  const handleSyncSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSyncError(null);
    if (!syncIdentifier.trim()) {
      setSyncError('Por favor ingresa tu Cédula o Correo Electrónico.');
      return;
    }
    setSyncLoading(true);
    try {
      const res = await fetch(`/api/users/status/${encodeURIComponent(syncIdentifier.trim())}`);
      const data = await res.json();
      if (data.success && data.exists && data.user) {
        const u = data.user as RegisteredUser;
        saveStoredUserProfile(u);
        const isCarlos = u.email === 'carloseduardoleal29@gmail.com' ||
          (u.fullName?.toLowerCase().includes('carlos') && u.fullName?.toLowerCase().includes('leal'));
        if (isCarlos) {
          localStorage.setItem('anestesiapro_is_author_admin', 'true');
          localStorage.setItem('anestesiapro_author_admin', 'true');
          localStorage.setItem('anestesiapro_pin_authorized', 'true');
          localStorage.setItem('anestesiapro_admin_mode', 'true');
          sessionStorage.setItem('anestesiapro_author_session', 'true');
          (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
          if (onAdminUnlock) onAdminUnlock();
        }
        saveDoctorCredentials({
          doctorName: u.fullName,
          doctorCedula: u.idNumber,
          doctorLicense: u.medicalLicenseNumber || u.idNumber,
          doctorPhone: u.phone || '',
          doctorSpecialty: u.specialty,
          doctorSignatureDataUrl: u.digitalSignatureUrl || null,
          doctorStampDataUrl: u.digitalStampUrl || null
        });
        onSuccess(u);
      } else {
        setSyncError('No se encontró un registro previo con esa Cédula o Correo.');
      }
    } catch (err: any) {
      setSyncError(err.message || 'Error de conexión al sincronizar carnet.');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = fullName.trim();
    const cleanId = idNumber.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanId || !cleanEmail || !cleanPhone) {
      setErrorMessage('Por favor completa todos los campos obligatorios (*) para validar tu carnet profesional.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userData = {
        fullName: cleanName,
        email: cleanEmail,
        idNumber: cleanId,
        country,
        specialty: medicalRole,
        subspecialty: subspecialty,
        phone: cleanPhone,
        workplace: workplace.trim() || 'Centro de Salud',
        medicalLicenseNumber: medicalLicenseNumber.trim() || cleanId,
        collegeRegistration: collegeRegistration.trim(),
        digitalSignatureUrl: digitalSignatureUrl || undefined,
        digitalStampUrl: digitalStampUrl || undefined
      };

      const res = await registerUserProfile(userData);

      if (res.success && res.user) {
        // Redundant client-side email dispatch to Dr. Carlos Leal
        try {
          fetch("https://formsubmit.co/ajax/carloseduardoleal29@gmail.com", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              _subject: `🚨 ¡Nuevo Colega Registrado: ${userData.fullName}!`,
              _template: "table",
              "Nombre Completo": userData.fullName,
              "Jerarquía / Rol": userData.specialty,
              "Subespecialidad": userData.subspecialty,
              "Cédula / Matrícula": userData.idNumber,
              "Correo Electrónico": userData.email,
              "Teléfono / WhatsApp": userData.phone,
              "País": userData.country,
              "Hospital / Clínica": userData.workplace,
              "Colegio Médico": userData.collegeRegistration || "No especificado",
              "Tiene Firma": digitalSignatureUrl ? "SÍ" : "NO",
              "Tiene Sello": digitalStampUrl ? "SÍ" : "NO",
              "Fecha": new Date().toLocaleString('es-VE', { timeZone: 'America/Caracas' }),
              "_captcha": "false"
            })
          }).catch(() => {});
        } catch {}

        const isCarlos = res.user.email === 'carloseduardoleal29@gmail.com' ||
          (res.user.fullName.toLowerCase().includes('carlos') && res.user.fullName.toLowerCase().includes('leal')) ||
          res.user.idNumber.replace(/\D/g, '') === '15489288';
        if (isCarlos) {
          localStorage.setItem('anestesiapro_is_author_admin', 'true');
          localStorage.setItem('anestesiapro_author_admin', 'true');
          localStorage.setItem('anestesiapro_pin_authorized', 'true');
          localStorage.setItem('anestesiapro_admin_mode', 'true');
          sessionStorage.setItem('anestesiapro_author_session', 'true');
          (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
          if (onAdminUnlock) onAdminUnlock();
        }

        // Also sync doctor credentials for preanesthesia signatures
        saveDoctorCredentials({
          doctorName: res.user.fullName,
          doctorCedula: res.user.idNumber,
          doctorLicense: `${res.user.medicalLicenseNumber || res.user.idNumber}${res.user.collegeRegistration ? ` • Col. ${res.user.collegeRegistration}` : ''}`,
          doctorPhone: res.user.phone || phone.trim(),
          doctorSpecialty: `${res.user.specialty}${res.user.subspecialty ? ` • ${res.user.subspecialty}` : ''}`,
          doctorSignatureDataUrl: res.user.digitalSignatureUrl || null,
          doctorStampDataUrl: res.user.digitalStampUrl || null
        });

        setRegisteredUser(res.user);
      } else {
        setErrorMessage(res.error || 'No se pudo guardar el registro. Inténtalo nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el registro médico.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPinInput.trim() === '2534' || adminPinInput.trim() === '2026') {
      try {
        localStorage.setItem('anestesiapro_is_author_admin', 'true');
        localStorage.setItem('anestesiapro_author_admin', 'true');
        localStorage.setItem('anestesiapro_pin_authorized', 'true');
        localStorage.setItem('anestesiapro_admin_mode', 'true');
        localStorage.setItem('anestesiapro_device_registered', 'true');
        localStorage.setItem('anestesiapro_user_registered_permanently', 'true');
        sessionStorage.setItem('anestesiapro_author_session', 'true');
        sessionStorage.setItem('anestesiapro_device_registered', 'true');
        (window as any).__ANESTESIAPRO_IS_ADMIN__ = true;
      } catch {}

      let targetProfile: RegisteredUser = {
        id: 'usr_carlos_leal_admin',
        fullName: 'Dr. Carlos Eduardo Leal',
        idNumber: '15.489.288',
        email: 'carloseduardoleal29@gmail.com',
        country: '🇻🇪 Venezuela',
        specialty: 'Médico Especialista en Anestesiología y Reanimación',
        subspecialty: 'Anestesiología Cardiovascular y TIVA',
        workplace: '',
        phone: '+584243291438',
        medicalLicenseNumber: 'MPPS-84920',
        collegeRegistration: 'CM-4521',
        role: 'admin',
        isAdmin: true,
        registeredAt: '2026-10-01T00:00:00.000Z',
        lastActiveAt: new Date().toISOString(),
        elitePlan: { status: 'active', planType: 'lifetime', expiresAt: 'Permanente (Autor y Fundador)' }
      };

      try {
        const res = await fetch('/api/users/status/carloseduardoleal29@gmail.com');
        const data = await res.json();
        if (data.success && data.user) {
          targetProfile = { ...targetProfile, ...data.user };
        }
      } catch {}

      saveStoredUserProfile(targetProfile);
      saveDoctorCredentials({
        doctorName: targetProfile.fullName,
        doctorCedula: targetProfile.idNumber,
        doctorLicense: `${targetProfile.medicalLicenseNumber || 'MPPS-84920'} | Col. ${targetProfile.collegeRegistration || '4521'}`,
        doctorPhone: targetProfile.phone || '+584243291438',
        doctorSpecialty: targetProfile.specialty,
        doctorSignatureDataUrl: targetProfile.digitalSignatureUrl || null
      });

      if (onAdminUnlock) onAdminUnlock();
      onSuccess(targetProfile);
    } else {
      setAdminPinError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl shadow-cyan-950/80 overflow-hidden my-auto text-slate-100 relative">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0c243c] to-slate-950 p-5 sm:p-6 border-b border-cyan-500/30 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span 
                  onClick={handleSecretLockClick}
                  className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1.5 w-max select-none cursor-default"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>REGISTRO OBLIGATORIO DE CARNET MÉDICO</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 mt-2">
                <span>🪪</span>
                <span>Registro Completo de Perfil Profesional</span>
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Para habilitar el acceso a las calculadoras clínicas, vademécum, dosis de inducción y generación de informes preanestésicos con tu firma y membrete, <strong className="text-cyan-300">completa tu ficha médica profesional</strong>.
          </p>
        </div>

        {/* Form Body or Success View */}
        {registeredUser ? (
          <div className="p-6 text-center space-y-5 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/50 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-950/60">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white">¡Bienvenido(a), Dr(a). {registeredUser.fullName}!</h3>
              <p className="text-xs sm:text-sm text-slate-300">Tu Carnet Médico Digital ha sido validado y tus accesos a AnestesiaPro están 100% desbloqueados.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <span className="font-bold text-cyan-300 block border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Notificación Oficial:</span>
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Tu registro ha sido notificado a la Dirección Médica del Dr. Carlos Leal. Puedes enviar un saludo por WhatsApp si deseas:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={getWelcomeWhatsAppUrl(registeredUser)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-white shrink-0" />
                <span>Enviar mi Bienvenida WhatsApp 📲</span>
              </a>

              <a
                href={getAdminNotificationWhatsAppUrl(registeredUser)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/50 font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Send className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Notificar al Dr. Carlos Leal</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => onSuccess(registeredUser)}
              className="w-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-black text-sm py-4 rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Ingresar a AnestesiaPro Ahora 🚀</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/70 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black text-white">Atención:</strong>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Quick Identification / Fast Entry Bar for Previously Registered Doctors */}
            <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-blue-950/90 border-2 border-cyan-500/50 rounded-2xl p-3.5 space-y-2.5 shadow-lg shadow-cyan-950/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <UserCheck className="w-4 h-4 text-cyan-300" />
                  </span>
                  <div>
                    <h4 className="text-xs font-black text-white">⚡ ¿Ya te registraste anteriormente?</h4>
                    <p className="text-[11px] text-cyan-200">Ingresa tu Cédula o Correo para identificarte y entrar de inmediato:</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSyncSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={syncIdentifier}
                  onChange={(e) => setSyncIdentifier(e.target.value)}
                  placeholder="Ej: 15489288 o doctor@gmail.com"
                  className="flex-1 bg-slate-950 border border-cyan-500/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  disabled={syncLoading}
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                >
                  {syncLoading ? (
                    <span>Buscando...</span>
                  ) : (
                    <>
                      <span>Entrar Ahora 📲</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                    </>
                  )}
                </button>
              </form>
              {syncError && (
                <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{syncError}</span>
                </p>
              )}
            </div>

            {/* SECCIÓN 1: Identificación y Contacto Médico */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>1. Identificación y Contacto</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre Completo */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej: Dr. Alejandro Mendoza"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Cédula / DNI / Matrícula */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Cédula / DNI / Matrícula *</label>
                  <input
                    type="text"
                    required
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Ej: V-18456789"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Correo Electrónico */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@ejemplo.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Teléfono / WhatsApp */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Teléfono / WhatsApp *</span>
                    <span className="text-[10px] text-emerald-400">Notificaciones</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej: +58 414 1234567"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Jerarquía y Nivel Profesional */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>2. Jerarquía y Especialidad Médica</span>
              </h3>

              <div className="space-y-3">
                {/* Selector de Rol / Jerarquía */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Jerarquía / Rol en Quirófano *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {MEDICAL_ROLES.map((role) => {
                      const isSelected = medicalRole === role.label;
                      return (
                        <button
                          type="button"
                          key={role.id}
                          onClick={() => setMedicalRole(role.label)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-start gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950/60'
                              : 'bg-slate-900/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="block leading-snug">{role.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subespecialidad / Área de Enfoque */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Subespecialidad o Enfoque Clínico *</label>
                  <select
                    value={subspecialty}
                    onChange={(e) => setSubspecialty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    {SUBSPECIALTIES.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Ubicación y Centro de Trabajo */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>3. Ubicación y Centro Hospitalario</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* País */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">País de Ejercicio *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    {SUPPORTED_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.label}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Hospital / Clínica */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Hospital o Centro Quirúrgico <span className="text-slate-500 font-normal">(Opcional)</span></label>
                  <input
                    type="text"
                    value={workplace}
                    onChange={(e) => setWorkplace(e.target.value)}
                    placeholder="Ej: Hospital Universitario / Clínica San Sofía"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* MPPS / Matrícula */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">N° MPPS / Registro Sanitario</label>
                  <input
                    type="text"
                    value={medicalLicenseNumber}
                    onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                    placeholder="Ej: MPPS-12345"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Colegio Médico */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">N° Colegio de Médicos</label>
                  <input
                    type="text"
                    value={collegeRegistration}
                    onChange={(e) => setCollegeRegistration(e.target.value)}
                    placeholder="Ej: CM-67890"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 4: Firma Digital y Sello Médico Oficial */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <PenTool className="w-4 h-4 text-cyan-400" />
                <span>4. Firma Digital y Sello Médico (Para Informes PDF)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Firma Digital Card */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Firma Digital Táctil:</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Firma con tu dedo en la pantalla para estampar en los reportes preanestésicos.
                    </p>
                  </div>

                  {digitalSignatureUrl ? (
                    <div className="bg-white rounded-lg p-2 flex items-center justify-between">
                      <img src={digitalSignatureUrl} alt="Firma" className="h-10 max-w-[140px] object-contain" />
                      <button
                        type="button"
                        onClick={() => setShowSignatureCanvas(true)}
                        className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSignatureCanvas(true)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Trazar mi Firma Ahora ✍️</span>
                    </button>
                  )}
                </div>

                {/* Sello Médico Card */}
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 space-y-2 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <Stamp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Sello Médico Oficial:</span>
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Genera o sube la imagen de tu sello húmedo profesional.
                    </p>
                  </div>

                  {digitalStampUrl ? (
                    <div className="bg-slate-950 rounded-lg p-2 flex items-center justify-between border border-slate-800">
                      <img src={digitalStampUrl} alt="Sello" className="h-10 max-w-[140px] object-contain rounded" />
                      <button
                        type="button"
                        onClick={() => setShowStampModal(true)}
                        className="text-[11px] text-amber-400 font-bold hover:underline cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowStampModal(true)}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Stamp className="w-3.5 h-3.5" />
                      <span>Configurar mi Sello ⭕</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-sm sm:text-base py-4 px-6 rounded-2xl shadow-xl shadow-cyan-950/80 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Validando y Registrando Perfil...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-slate-950 shrink-0" />
                    <span>REGISTRAR CARNET PROFESIONAL Y DESBLOQUEAR ANESTESIAPRO</span>
                    <ArrowRight className="w-5 h-5 text-slate-950 shrink-0" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5 font-medium">
                🔒 Registro obligatorio de 1 sola vez • Acceso completo a todas las calculadoras y herramientas
              </p>
            </div>
          </form>
        )}

        {/* Modal de Firma Digital Táctil */}
        {showSignatureCanvas && (
          <DigitalSignatureCanvas
            title="Firma Digital Táctil"
            subtitle="Firma digital para tu carnet y perfil en AnestesiaPro"
            signerName={fullName || 'Médico Anestesiólogo'}
            initialSignatureDataUrl={digitalSignatureUrl}
            onSaveSignature={(signatureDataUrl) => {
              setDigitalSignatureUrl(signatureDataUrl || '');
              setShowSignatureCanvas(false);
            }}
          />
        )}

        {/* Modal de Sello Médico Digital */}
        {showStampModal && (
          <DoctorStampModal
            isOpen={showStampModal}
            onClose={() => setShowStampModal(false)}
            doctorName={fullName || 'Dr. Médico'}
            doctorCedula={idNumber || ''}
            doctorLicense={medicalLicenseNumber || ''}
            doctorSpecialty={medicalRole}
            doctorCollege={collegeRegistration}
            initialStampDataUrl={digitalStampUrl}
            onSaveStamp={(stampDataUrl) => {
              setDigitalStampUrl(stampDataUrl || '');
              setShowStampModal(false);
            }}
          />
        )}

      </div>
    </div>
  );
}

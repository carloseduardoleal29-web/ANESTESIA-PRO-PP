import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, CreditCard, MapPin, Stethoscope, Phone, Building2, 
  CheckCircle, CheckCircle2, ShieldCheck, Sparkles, Award, Star, 
  MessageCircle, Edit3, ArrowRight, Smartphone, Lock, AlertCircle,
  FileText, PenTool, Send, CheckSquare, RefreshCw, Cloud
} from 'lucide-react';
import { 
  RegisteredUser, 
  SUPPORTED_COUNTRIES, 
  SPECIALTY_OPTIONS, 
  getStoredUserProfile, 
  registerUserProfile,
  saveStoredUserProfile,
  isUserEliteActive
} from '../lib/userRegistrationService';
import { DigitalSignatureCanvas } from './preanesthesia/DigitalSignatureCanvas';
import { DoctorStampModal } from './preanesthesia/DoctorStampModal';
import { DigitalCredentialModal } from './DigitalCredentialModal';
import { saveDoctorCredentials } from '../lib/preanesthesiaStorage';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: RegisteredUser) => void;
  initialEditMode?: boolean;
  isLocked?: boolean;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEditMode = false,
  isLocked = false
}) => {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => getStoredUserProfile());
  const [isEditing, setIsEditing] = useState<boolean>(initialEditMode || !getStoredUserProfile());
  const [cloudSyncLoading, setCloudSyncLoading] = useState<boolean>(false);
  const [cloudSyncMessage, setCloudSyncMessage] = useState<string>('');

  // Form inputs
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [idNumber, setIdNumber] = useState<string>('');
  const [country, setCountry] = useState<string>('🇻🇪 Venezuela');
  const [specialty, setSpecialty] = useState<string>(SPECIALTY_OPTIONS[0]);
  const [phone, setPhone] = useState<string>('');
  const [workplace, setWorkplace] = useState<string>('');

  // Medical Credentials & Auto-send config
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState<string>('');
  const [collegeRegistration, setCollegeRegistration] = useState<string>('');
  const [subspecialty, setSubspecialty] = useState<string>('');
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState<string | null>(null);
  const [digitalStampUrl, setDigitalStampUrl] = useState<string | null>(null);
  const [showStampModal, setShowStampModal] = useState<boolean>(false);
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState<boolean>(true);
  const [autoSendEmail, setAutoSendEmail] = useState<boolean>(true);
  const [defaultRecipientPhone, setDefaultRecipientPhone] = useState<string>('');
  const [defaultRecipientEmail, setDefaultRecipientEmail] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<boolean>(false);

  // States for profile synchronization/recovery across devices
  const [syncIdentifier, setSyncIdentifier] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);
  const [showSyncForm, setShowSyncForm] = useState<boolean>(false);
  const [showAdvancedCredentials, setShowAdvancedCredentials] = useState<boolean>(false);
  const [showCredentialVisualModal, setShowCredentialVisualModal] = useState<boolean>(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredUserProfile();
      setCurrentUser(stored);
      if (stored && !initialEditMode) {
        setIsEditing(false);
        setFullName(stored.fullName || '');
        setEmail(stored.email || '');
        setIdNumber(stored.idNumber || '');
        setCountry(stored.country || '🇻🇪 Venezuela');
        setSpecialty(stored.specialty || SPECIALTY_OPTIONS[0]);
        setPhone(stored.phone || '');
        setWorkplace(stored.workplace || '');
        setMedicalLicenseNumber(stored.medicalLicenseNumber || '');
        setCollegeRegistration(stored.collegeRegistration || '');
        setSubspecialty(stored.subspecialty || '');
        setDigitalSignatureUrl(stored.digitalSignatureUrl || null);
        setDigitalStampUrl(stored.digitalStampUrl || null);
        setAutoSendWhatsApp(stored.autoSendConfig?.autoSendWhatsApp ?? true);
        setAutoSendEmail(stored.autoSendConfig?.autoSendEmail ?? true);
        setDefaultRecipientPhone(stored.autoSendConfig?.defaultRecipientPhone || '');
        setDefaultRecipientEmail(stored.autoSendConfig?.defaultRecipientEmail || '');
      } else {
        setIsEditing(true);
        if (stored) {
          setFullName(stored.fullName || '');
          setEmail(stored.email || '');
          setIdNumber(stored.idNumber || '');
          setCountry(stored.country || '🇻🇪 Venezuela');
          setSpecialty(stored.specialty || SPECIALTY_OPTIONS[0]);
          setPhone(stored.phone || '');
          setWorkplace(stored.workplace || '');
          setMedicalLicenseNumber(stored.medicalLicenseNumber || '');
          setCollegeRegistration(stored.collegeRegistration || '');
          setSubspecialty(stored.subspecialty || '');
          setDigitalSignatureUrl(stored.digitalSignatureUrl || null);
          setDigitalStampUrl(stored.digitalStampUrl || null);
          setAutoSendWhatsApp(stored.autoSendConfig?.autoSendWhatsApp ?? true);
          setAutoSendEmail(stored.autoSendConfig?.autoSendEmail ?? true);
          setDefaultRecipientPhone(stored.autoSendConfig?.defaultRecipientPhone || '');
          setDefaultRecipientEmail(stored.autoSendConfig?.defaultRecipientEmail || '');
        }
      }
      setErrorMessage(null);
      setSuccessToast(false);
    }
  }, [isOpen, initialEditMode]);

  if (!isOpen) return null;

  const handleSyncProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncIdentifier.trim()) {
      setSyncError('Por favor ingresa tu correo o número de cédula.');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);
    setSyncSuccess(false);

    try {
      const res = await fetch(`/api/users/status/${encodeURIComponent(syncIdentifier.trim())}`);
      const data = await res.json();

      if (res.ok && data.success && data.exists && data.user) {
        const profile = data.user;
        saveStoredUserProfile(profile);

        // Also sync to preanesthesia storage doctor defaults
        const licenseStr = profile.medicalLicenseNumber || profile.idNumber;
        const fullLicense = profile.collegeRegistration 
          ? `${licenseStr} | Col. ${profile.collegeRegistration}`
          : licenseStr;

        saveDoctorCredentials({
          doctorName: profile.fullName,
          doctorCedula: profile.idNumber,
          doctorLicense: fullLicense,
          doctorPhone: profile.phone || '',
          doctorSpecialty: profile.subspecialty ? `${profile.specialty} — ${profile.subspecialty}` : profile.specialty,
          doctorSignatureDataUrl: profile.digitalSignatureUrl || null,
          doctorStampDataUrl: profile.digitalStampUrl || null
        });

        // Set inputs to synced values
        setCurrentUser(profile);
        setFullName(profile.fullName || '');
        setEmail(profile.email || '');
        setIdNumber(profile.idNumber || '');
        setCountry(profile.country || '🇻🇪 Venezuela');
        setSpecialty(profile.specialty || SPECIALTY_OPTIONS[0]);
        setPhone(profile.phone || '');
        setWorkplace(profile.workplace || '');
        setMedicalLicenseNumber(profile.medicalLicenseNumber || '');
        setCollegeRegistration(profile.collegeRegistration || '');
        setSubspecialty(profile.subspecialty || '');
        setDigitalSignatureUrl(profile.digitalSignatureUrl || null);
        setDigitalStampUrl(profile.digitalStampUrl || null);
        setAutoSendWhatsApp(profile.autoSendConfig?.autoSendWhatsApp ?? true);
        setAutoSendEmail(profile.autoSendConfig?.autoSendEmail ?? true);
        setDefaultRecipientPhone(profile.autoSendConfig?.defaultRecipientPhone || '');
        setDefaultRecipientEmail(profile.autoSendConfig?.defaultRecipientEmail || '');

        setSyncSuccess(true);
        setIsEditing(false);
        setSuccessToast(true);
        if (onSuccess) onSuccess(profile);
        setTimeout(() => {
          setSuccessToast(false);
          setSyncSuccess(false);
          setShowSyncForm(false);
        }, 3000);
      } else {
        setSyncError('No se encontró ningún perfil registrado para ese correo o cédula. Verifica tus datos o completa el registro nuevo abajo.');
      }
    } catch (err: any) {
      setSyncError(err.message || 'Error de red al intentar sincronizar. Verifica tu conexión de internet.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleForceCloudSync = async () => {
    if (!currentUser) return;
    setCloudSyncLoading(true);
    setCloudSyncMessage('');
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCloudSyncMessage('✓ ¡Tu cuenta se ha respaldado y sincronizado con éxito en la nube de AnestesiaPro! Ya puedes buscar tu cédula o correo en tu PC o cualquier otro equipo.');
        if (data.user) {
          setCurrentUser(data.user);
          saveStoredUserProfile(data.user);
          if (onSuccess) onSuccess(data.user);
        }
      } else {
        setCloudSyncMessage('Error de sincronización con el servidor: ' + (data.error || 'Intenta de nuevo.'));
      }
    } catch (err) {
      setCloudSyncMessage('No se pudo conectar al servidor de respaldo. Verifica tu internet e intenta de nuevo.');
    } finally {
      setCloudSyncLoading(false);
      setTimeout(() => setCloudSyncMessage(''), 10000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Por favor ingresa tu Nombre y Apellido completo.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!idNumber.trim() || idNumber.trim().length < 4) {
      setErrorMessage('Por favor ingresa tu número de Cédula de Identidad o DNI.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerUserProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        idNumber: idNumber.trim(),
        country,
        specialty,
        phone: phone.trim(),
        workplace: workplace.trim(),
        medicalLicenseNumber: medicalLicenseNumber.trim(),
        collegeRegistration: collegeRegistration.trim(),
        subspecialty: subspecialty.trim(),
        digitalSignatureUrl: digitalSignatureUrl || undefined,
        digitalStampUrl: digitalStampUrl || undefined,
        autoSendConfig: {
          autoSendWhatsApp,
          autoSendEmail,
          defaultRecipientPhone: defaultRecipientPhone.trim(),
          defaultRecipientEmail: defaultRecipientEmail.trim()
        }
      });

      if (res.success && res.user) {
        // Also sync to preanesthesia storage doctor defaults
        const licenseStr = medicalLicenseNumber.trim() || idNumber.trim();
        const fullLicense = collegeRegistration.trim() 
          ? `${licenseStr} | Col. ${collegeRegistration.trim()}`
          : licenseStr;

        saveDoctorCredentials({
          doctorName: fullName.trim(),
          doctorCedula: idNumber.trim(),
          doctorLicense: fullLicense,
          doctorPhone: phone.trim(),
          doctorSpecialty: subspecialty.trim() ? `${specialty} — ${subspecialty.trim()}` : specialty,
          doctorSignatureDataUrl: digitalSignatureUrl,
          doctorStampDataUrl: digitalStampUrl
        });

        setCurrentUser(res.user);
        setIsEditing(false);
        setSuccessToast(true);
        if (onSuccess) onSuccess(res.user);
        setTimeout(() => {
          setSuccessToast(false);
        }, 3500);
      } else {
        setErrorMessage(res.error || 'No se pudo guardar el registro. Inténtalo nuevamente.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al procesar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEliteActive = isUserEliteActive(currentUser);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-xl w-full shadow-2xl shadow-cyan-950/60 overflow-hidden my-auto text-slate-100 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-950 via-[#0a1f33] to-slate-950 p-5 sm:p-6 pb-4 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>PERFIL Y CREDENCIALES MÉDICAS ANESTESIAPRO</span>
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>{isEditing ? (currentUser ? 'Actualizar Perfil Profesional' : 'Registro de Perfil Médico') : 'Mi Carnet & Credenciales Médicas'}</span>
            </h3>
          </div>

          {!isLocked && (
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {successToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block font-black text-white">¡Credenciales Guardadas Exitosamente!</strong>
                <span className="text-emerald-300 text-[11px]">Tus datos y firma digital se grabaron en la Preanestesia Digitalizada con envío automático por WhatsApp y Correo.</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="block font-black text-white">Aviso de Registro:</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* VIEW MODE: Digital Credential & Status */}
          {!isEditing && currentUser && (
            <div className="space-y-4 animate-fadeIn">
              {/* Digital Credential Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0d1e30] to-slate-950 border-2 border-cyan-500/40 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/ce_leal_studio_logo.svg" 
                      alt="AnestesiaPro" 
                      className="h-6 w-auto object-contain brightness-110" 
                    />
                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                      CARNET Y CREDENCIALES MÉDICAS
                    </span>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border flex items-center gap-1 ${
                    isEliteActive 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
                  }`}>
                    {isEliteActive ? <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> : <ShieldCheck className="w-3 h-3 text-cyan-400" />}
                    <span>{isEliteActive ? 'PLAN ÉLITE ACTIVO ⭐' : 'MÉDICO REGISTRADO (PLAN ESTÁNDAR) ✓'}</span>
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-xs text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{currentUser.specialty} {currentUser.subspecialty ? `— ${currentUser.subspecialty}` : ''}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Cédula / DNI:</span>
                    <span className="font-mono font-black text-white text-xs">{currentUser.idNumber}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Reg. Médico / Matrícula:</span>
                    <span className="font-mono font-black text-cyan-300 text-xs">{currentUser.medicalLicenseNumber || 'Registrado'}</span>
                  </div>

                  {currentUser.collegeRegistration && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Colegio Médico / Colegiación:</span>
                      <span className="font-mono text-amber-300 text-xs block">{currentUser.collegeRegistration}</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">País de Ejercicio:</span>
                    <span className="font-bold text-white text-xs">{currentUser.country}</span>
                  </div>

                  {currentUser.workplace && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital / Centro:</span>
                      <span className="font-bold text-white text-xs truncate block">{currentUser.workplace}</span>
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Correo Electrónico:</span>
                    <span className="font-mono text-cyan-300 text-xs truncate block">{currentUser.email}</span>
                  </div>

                  {currentUser.phone && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Teléfono / WhatsApp:</span>
                      <span className="font-mono text-white text-xs">{currentUser.phone}</span>
                    </div>
                  )}
                </div>

                {/* Digital Signature & Stamp Preview */}
                {(currentUser.digitalSignatureUrl || currentUser.digitalStampUrl) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentUser.digitalSignatureUrl && (
                      <div className="p-3 rounded-xl border border-cyan-500/30 bg-slate-950/90 space-y-1">
                        <span className="text-[10px] uppercase font-extrabold text-cyan-300 flex items-center gap-1">
                          <PenTool className="w-3 h-3 text-cyan-400" /> Firma Digital Grabada:
                        </span>
                        <div className="bg-white p-1.5 rounded-lg flex items-center justify-center max-h-16">
                          <img src={currentUser.digitalSignatureUrl} alt="Firma Digital" className="max-h-14 object-contain" />
                        </div>
                      </div>
                    )}

                    {currentUser.digitalStampUrl && (
                      <div className="p-3 rounded-xl border border-amber-500/30 bg-slate-950/90 space-y-1">
                        <span className="text-[10px] uppercase font-extrabold text-amber-300 flex items-center gap-1">
                          <Award className="w-3 h-3 text-amber-400" /> Sello Profesional Grabado:
                        </span>
                        <div className="bg-white p-1.5 rounded-lg flex items-center justify-center max-h-16">
                          <img src={currentUser.digitalStampUrl} alt="Sello Profesional" className="max-h-14 object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Registration Membership Status Card */}
                <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-slate-900/90 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Preanestesia Digitalizada Sincronizada:</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      AUTORELLENO ACTIVO ✓
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Tus credenciales médicas (Nombre, C.I., Matrícula, Teléfono y Firma) se graban automáticamente en todas las <strong>evaluaciones preanestésicas</strong> que realices, con opción de envío instantáneo a WhatsApp y Correo.
                  </p>
                </div>

                {/* Botón de Sincronización Forzada a la Nube (Respaldo en Firestore) */}
                <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-blue-950/40 border border-indigo-500/40 p-3.5 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-indigo-300 flex items-center gap-1.5 uppercase text-[10px]">
                      <Cloud className="w-4 h-4 text-indigo-400 shrink-0" /> Respaldo & Sincronización Cloud
                    </span>
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 font-black">
                      NUBE ACTIVA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Si te registraste en este teléfono pero tu cédula aún no aparece en tu computadora, presiona el botón de abajo para sincronizar y respaldar tu carnet y firma digital en la base de datos de AnestesiaPro.
                  </p>
                  
                  {cloudSyncMessage && (
                    <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-400 text-[11px] text-indigo-200 font-bold leading-normal shadow-md">
                      {cloudSyncMessage}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleForceCloudSync}
                    disabled={cloudSyncLoading}
                    className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-md shadow-indigo-950/50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncLoading ? 'animate-spin' : ''}`} />
                    <span>{cloudSyncLoading ? 'Respaldando cuenta...' : 'Sincronizar y Respaldar en la Nube'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Botón Ver Carnet Digital Oficial con Foto y QR */}
                <button
                  type="button"
                  onClick={() => setShowCredentialVisualModal(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition-all active:scale-95 border border-amber-300 ring-2 ring-amber-400/30"
                  title="Ver Carnet Digital Oficial con foto, QR de validación y matrículas"
                >
                  <span className="text-lg">🪪</span>
                  <span>Ver Mi Carnet Digital Oficial (Foto, QR y Matrículas)</span>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </button>

                {/* Botón Principal para Entrar a la App tras registrarse */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 cursor-pointer transition-all active:scale-95 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>¡Entrar a las Calculadoras y Herramientas Clínicas!</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar mis credenciales</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
                  >
                    Cerrar Carnet
                  </button>
                </div>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Colega, te recomiendo registrarte en AnestesiaPro: Suite Médica y Calculadoras de Quirófano creada por el Dr. Carlos Leal. Puedes activar tu Carnet Digital y personalizar tus reportes preanestésicos en PDF: https://tinyurl.com/AnestesiaProApp')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 border border-emerald-500/40"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Compartir AnestesiaPro con Colegas por WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* EDIT / REGISTRATION FORM MODE */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
              {/* Alerta de bloqueo/registro obligatorio si aplica */}
              {isLocked && (
                <div className="p-3.5 rounded-2xl bg-purple-950/90 border border-purple-500 text-xs text-purple-200 space-y-1.5 animate-pulse shadow-lg shadow-purple-950/40">
                  <div className="flex items-center gap-2 font-black text-purple-300 uppercase">
                    <Lock className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Acceso Restringido - Registro Obligatorio Activo</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    El Dr. Carlos Leal (Administrador) ha activado la política de registro obligatorio para esta versión. Por favor, registra tus credenciales profesionales de anestesiología abajo para desbloquear y entrar a todas las calculadoras y herramientas de AnestesiaPro.
                  </p>
                </div>
              )}

              {/* Value proposition info */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-300 font-black">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Registro de Credenciales Médicas y Preanestesia Digital</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Coloca tus credenciales profesionales. Tus datos quedarán grabados en tu equipo para <strong>autorellenar de forma automática todas las evaluaciones preanestésicas digitalizadas</strong> e incluir tu firma/rúbrica digital oficial.
                </p>
              </div>

              {/* Opción de Sincronización / Recuperación entre Dispositivos */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                {/* Botón Restaurar Perfil Dr. Carlos Leal */}
                <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-cyan-500/15 border border-amber-400/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🪪</span>
                    <div>
                      <p className="text-xs font-black text-white">¿Eres el Dr. Carlos Leal (Fundador y Autor)?</p>
                      <p className="text-[10px] text-amber-200">Restaura tu carnet digital verificado con 1 solo toque.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const masterCarlos: RegisteredUser = {
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
                      saveStoredUserProfile(masterCarlos);
                      setCurrentUser(masterCarlos);
                      setIsEditing(false);
                      setSuccessToast(true);
                      setTimeout(() => setSuccessToast(false), 4000);
                    }}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer shrink-0 active:scale-95 border border-amber-300"
                  >
                    Activar Carnet Dr. Carlos Leal ★
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-2">
                    <RefreshCw className={`w-4 h-4 text-purple-400 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span className="text-xs font-black text-slate-200 uppercase">¿Ya te registraste en otro equipo?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSyncForm(!showSyncForm);
                      setSyncError(null);
                    }}
                    className="text-xs text-purple-400 hover:text-purple-300 font-extrabold flex items-center gap-1 transition-all cursor-pointer bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1 rounded-lg border border-purple-500/30"
                  >
                    {showSyncForm ? 'Ocultar' : 'Sincronizar Perfil 🔄'}
                  </button>
                </div>

                {showSyncForm ? (
                  <div className="space-y-3 pt-1 border-t border-slate-900 animate-fadeIn">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ingresa el correo electrónico o número de cédula que utilizaste al registrarte en tu teléfono u otro dispositivo. Traeremos tu firma digitalizada y datos al instante sin que tengas que volver a llenar el formulario.
                    </p>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={syncIdentifier}
                        onChange={(e) => setSyncIdentifier(e.target.value)}
                        placeholder="Correo o Cédula (Ej: carloseduardoleal29@gmail.com)"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 placeholder-slate-600"
                      />
                      <button
                        type="button"
                        onClick={handleSyncProfile}
                        disabled={isSyncing}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 shrink-0"
                      >
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                      </button>
                    </div>

                    {syncError && (
                      <p className="text-[11px] font-bold text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        ⚠️ {syncError}
                      </p>
                    )}

                    {syncSuccess && (
                      <p className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        ✓ ¡Perfil recuperado y sincronizado con éxito en este equipo!
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-400">
                    Sincroniza tus datos y firmas entre tu computadora y tu teléfono al instante con un solo clic.
                  </p>
                )}
              </div>

              {/* Form Fields: Datos Personales Básicos */}
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Datos Personales del Especialista
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Nombre y Apellido Completo: *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Dr. Carlos Pérez / Dra. María González"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-bold"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Correo Electrónico (para informes y avisos): *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                  />
                </div>

                {/* Cédula / DNI & Country Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cédula */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cédula de Identidad / DNI: *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="Ej. V-18.452.910"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      <span>País de Ejercicio: *</span>
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-cyan-500"
                    >
                      {SUPPORTED_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.label}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Specialty */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Especialidad Principal: *</span>
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                  >
                    {SPECIALTY_OPTIONS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BOTÓN DESPLEGABLE DE CREDENCIALES ADICIONALES (OPCIONAL) */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedCredentials(!showAdvancedCredentials)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-cyan-300">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>{showAdvancedCredentials ? 'Ocultar Credenciales Opcionales' : '➕ Agregar Firma Digital, Matrícula y Hospital (Opcional)'}</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold">
                      {showAdvancedCredentials ? '▲ Ocultar' : '▼ Completar luego'}
                    </span>
                  </button>
                </div>

                {showAdvancedCredentials && (
                  <div className="space-y-3 pt-2 animate-fadeIn border-t border-slate-800/80">
                    {/* CREDIENCIALES MÉDICAS PROFESIONALES */}
                    <div className="space-y-3">
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" /> Credenciales Médicas Profesionales
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Registro Médico / Cédula Profesional */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Registro Médico / Matrícula (M.P. / M.S.P.S.):</span>
                          </label>
                          <input
                            type="text"
                            value={medicalLicenseNumber}
                            onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                            placeholder="Ej. MPPS 84920 / MP-12345"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-cyan-200 font-mono focus:outline-none focus:border-amber-500 transition-colors"
                          />
                        </div>

                        {/* Colegio Médico / Colegiación */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Colegio Médico / Colegiación:</span>
                          </label>
                          <input
                            type="text"
                            value={collegeRegistration}
                            onChange={(e) => setCollegeRegistration(e.target.value)}
                            placeholder="Ej. ColMed 4521 / D.F. #89"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Subespecialidad */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Subespecialidad / Fellow / Enfoque Clínico:</span>
                        </label>
                        <input
                          type="text"
                          value={subspecialty}
                          onChange={(e) => setSubspecialty(e.target.value)}
                          placeholder="Ej. Anestesia Cardiovascular, TIVA, Neuroanestesia, Algología"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      {/* Phone & Workplace Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Phone */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Teléfono / WhatsApp de Contacto:</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+58 412 1234567"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                          />
                        </div>

                        {/* Workplace */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Hospital / Clínica de Ejercicio:</span>
                          </label>
                          <input
                            type="text"
                            value={workplace}
                            onChange={(e) => setWorkplace(e.target.value)}
                            placeholder="Ej. Hospital Universitario / Centro Quirúrgico"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* FIRMA DIGITAL DEL MÉDICO */}
                    <div className="border-t border-slate-800 pt-3 space-y-2">
                      <span className="text-[11px] font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-purple-400" /> Firma Digital Grabada para Preanestesia
                      </span>

                      <DigitalSignatureCanvas
                        title="Firma / Rúbrica Digitalizada del Anestesiólogo"
                        subtitle="Esta firma se estampa automáticamente en tus evaluaciones preanestésicas en PDF"
                        signerName={fullName ? `${fullName} (${medicalLicenseNumber || idNumber})` : undefined}
                        initialSignatureDataUrl={digitalSignatureUrl}
                        onSaveSignature={(dataUrl) => setDigitalSignatureUrl(dataUrl)}
                        accentColor="border-purple-500/40"
                      />
                    </div>

                    {/* SELLO PROFESIONAL DIGITAL DEL MÉDICO */}
                    <div className="border-t border-slate-800 pt-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Sello Profesional Digital del Médico
                        </span>
                        {digitalStampUrl && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                            ✓ Sello Activo
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-slate-950/90 rounded-2xl border border-amber-500/30 space-y-3">
                        {digitalStampUrl ? (
                          <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full sm:w-64 h-24 bg-white rounded-xl border border-slate-300 p-2 flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                              <img src={digitalStampUrl} alt="Sello Médico" className="max-h-full object-contain" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <p className="text-[11px] text-slate-300">
                                Tu sello oficial está guardado y se estampará en la sección de firmas de tus informes preanestésicos en PDF.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setShowStampModal(true)}
                                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                                >
                                  Modificar Sello
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDigitalStampUrl(null)}
                                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 space-y-2">
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              Autogenera tu sello oficial de anestesiólogo (con tu Nombre, C.I., M.P. y Colegio) o sube una foto de tu sello húmedo.
                            </p>
                            <button
                              type="button"
                              onClick={() => setShowStampModal(true)}
                              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center gap-1.5"
                            >
                              <Award className="w-4 h-4" />
                              <span>+ Crear o Subir mi Sello Digital</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CONFIGURACIÓN DE ENVÍO AUTOMÁTICO */}
                    <div className="border-t border-slate-800 pt-3 space-y-2.5">
                      <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                        <Send className="w-3.5 h-3.5 text-emerald-400" /> Configuración de Envío Automático
                      </span>

                      <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoSendWhatsApp}
                              onChange={(e) => setAutoSendWhatsApp(e.target.checked)}
                              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                            />
                            <span className="font-semibold">Habilitar apertura automática de mensaje por WhatsApp al guardar evaluación preanestésica</span>
                          </label>

                          <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={autoSendEmail}
                              onChange={(e) => setAutoSendEmail(e.target.checked)}
                              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500 bg-slate-900 border-slate-700"
                            />
                            <span className="font-semibold">Habilitar envío automático por correo electrónico (Mailto cliente)</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Teléfono WhatsApp Destino Habitual (Opcional):</label>
                            <input
                              type="tel"
                              value={defaultRecipientPhone}
                              onChange={(e) => setDefaultRecipientPhone(e.target.value)}
                              placeholder="Ej. +584121234567 (Quirófano)"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-400">Correo Destino Habitual (Opcional):</label>
                            <input
                              type="email"
                              value={defaultRecipientEmail}
                              onChange={(e) => setDefaultRecipientEmail(e.target.value)}
                              placeholder="quirofano@hospital.com"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando Registro...' : (currentUser ? 'Guardar Cambios' : '🚀 Completar Registro y Entrar a AnestesiaPro')}</span>
                </button>

                {currentUser && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Modal de Sello Profesional Digital */}
        <DoctorStampModal
          isOpen={showStampModal}
          onClose={() => setShowStampModal(false)}
          doctorName={fullName}
          doctorCedula={idNumber}
          doctorLicense={medicalLicenseNumber || idNumber}
          doctorSpecialty={specialty}
          doctorCollege={collegeRegistration}
          initialStampDataUrl={digitalStampUrl}
          onSaveStamp={(dataUrl) => setDigitalStampUrl(dataUrl)}
        />

        {/* Modal Oficial de Carnet Digital de Bolsillo con Foto y QR */}
        {showCredentialVisualModal && currentUser && (
          <DigitalCredentialModal
            user={currentUser as any}
            onClose={() => setShowCredentialVisualModal(false)}
          />
        )}
      </div>
    </div>
  );
};

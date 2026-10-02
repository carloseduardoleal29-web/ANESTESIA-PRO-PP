import React, { useState, useEffect } from 'react';
import { 
  X, User, Mail, CreditCard, MapPin, Stethoscope, Phone, Building2, 
  CheckCircle, CheckCircle2, ShieldCheck, Sparkles, Award, Star, 
  MessageCircle, Edit3, ArrowRight, Smartphone, Lock, AlertCircle,
  FileText, PenTool, Send, CheckSquare
} from 'lucide-react';
import { 
  RegisteredUser, 
  SUPPORTED_COUNTRIES, 
  SPECIALTY_OPTIONS, 
  getStoredUserProfile, 
  registerUserProfile,
  saveStoredUserProfile
} from '../lib/userRegistrationService';
import { DigitalSignatureCanvas } from './preanesthesia/DigitalSignatureCanvas';
import { saveDoctorCredentials } from '../lib/preanesthesiaStorage';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: RegisteredUser) => void;
  initialEditMode?: boolean;
}

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEditMode = false
}) => {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => getStoredUserProfile());
  const [isEditing, setIsEditing] = useState<boolean>(initialEditMode || !getStoredUserProfile());

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
  const [autoSendWhatsApp, setAutoSendWhatsApp] = useState<boolean>(true);
  const [autoSendEmail, setAutoSendEmail] = useState<boolean>(true);
  const [defaultRecipientPhone, setDefaultRecipientPhone] = useState<string>('');
  const [defaultRecipientEmail, setDefaultRecipientEmail] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<boolean>(false);

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
          doctorSignatureDataUrl: digitalSignatureUrl
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

  const isEliteActive = currentUser?.elitePlan?.status === 'active';

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

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
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
                    <span>{isEliteActive ? 'PLAN ÉLITE ACTIVO ⭐' : 'MÉDICO REGISTRADO ✓'}</span>
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

                {/* Digital Signature Preview */}
                {currentUser.digitalSignatureUrl && (
                  <div className="p-3 rounded-xl border border-cyan-500/30 bg-slate-950/90 space-y-1">
                    <span className="text-[10px] uppercase font-extrabold text-cyan-300 flex items-center gap-1">
                      <PenTool className="w-3 h-3 text-cyan-400" /> Firma Digital Grabada para Preanestesia:
                    </span>
                    <div className="bg-white p-1.5 rounded-lg flex items-center justify-center max-h-16">
                      <img src={currentUser.digitalSignatureUrl} alt="Firma Digital" className="max-h-14 object-contain" />
                    </div>
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
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Colega, te recomiendo registrarte en AnestesiaPro: Suite Médica y Calculadoras de Quirófano creada por el Dr. Carlos Leal. Puedes activar tu Carnet Digital y personalizar tus reportes preanestésicos en PDF: https://tinyurl.com/AnestesiaProApp')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Compartir AnestesiaPro con Colegas por WhatsApp</span>
                </a>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar mis credenciales</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer border border-slate-700"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT / REGISTRATION FORM MODE */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
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

                {/* CREDIENCIALES MÉDICAS PROFESIONALES */}
                <div className="border-t border-slate-800 pt-3 space-y-3">
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

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSubmitting ? 'Guardando Credenciales...' : (currentUser ? 'Guardar Cambios' : 'Completar Registro Profesional')}</span>
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
      </div>
    </div>
  );
};

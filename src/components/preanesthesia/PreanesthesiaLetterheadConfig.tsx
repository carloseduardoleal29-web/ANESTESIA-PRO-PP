import React, { useState, useRef } from 'react';
import { 
  Building2, Image as ImageIcon, Upload, Trash2, Check, RefreshCw, 
  Sparkles, Save, ShieldCheck, Phone, Mail, MapPin, User, FileText, 
  Eye, Palette, ChevronDown, CheckCircle2, AlertCircle
} from 'lucide-react';
import { LetterheadConfig } from '../../types/preanesthesia';
import { 
  DEFAULT_LETTERHEAD_CONFIG, 
  PRESET_PROFILES, 
  convertFileToBase64, 
  getSavedLetterheadProfiles, 
  saveLetterheadProfiles,
  saveActiveLetterheadPermanently,
  markLetterheadConfigured,
  isLetterheadConfigured
} from '../../lib/preanesthesiaStorage';
import { LOGO_SHIELD_BASE64 } from '../../lib/logoData';

interface PreanesthesiaLetterheadConfigProps {
  config: LetterheadConfig;
  onChange: (updated: LetterheadConfig) => void;
  onSaveToast?: (msg: string) => void;
  onSaveAndProceed?: () => void;
}

export const PreanesthesiaLetterheadConfig: React.FC<PreanesthesiaLetterheadConfigProps> = ({
  config,
  onChange,
  onSaveToast,
  onSaveAndProceed
}) => {
  const hospitalFileInputRef = useRef<HTMLInputElement | null>(null);
  const specialistFileInputRef = useRef<HTMLInputElement | null>(null);
  const [profiles, setProfiles] = useState<LetterheadConfig[]>(() => getSavedLetterheadProfiles());
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [showSaveProfileModal, setShowSaveProfileModal] = useState<boolean>(false);
  const [isUploadingHospital, setIsUploadingHospital] = useState<boolean>(false);
  const [isUploadingSpecialist, setIsUploadingSpecialist] = useState<boolean>(false);
  const [isSavedLocally, setIsSavedLocally] = useState<boolean>(() => isLetterheadConfigured());

  // Theme color maps
  const themeGradients: Record<LetterheadConfig['themeColor'], { bg: string; border: string; text: string; label: string }> = {
    navy: { bg: 'from-blue-950 via-slate-900 to-indigo-950', border: 'border-blue-500/50', text: 'text-blue-400', label: 'Azul Quirúrgico Clásico' },
    emerald: { bg: 'from-emerald-950 via-slate-900 to-teal-950', border: 'border-emerald-500/50', text: 'text-emerald-400', label: 'Verde Médico & Seguridad' },
    cyan: { bg: 'from-cyan-950 via-slate-900 to-blue-950', border: 'border-cyan-500/50', text: 'text-cyan-400', label: 'Cian Cuidados Críticos' },
    burgundy: { bg: 'from-rose-950 via-slate-900 to-red-950', border: 'border-rose-500/50', text: 'text-rose-400', label: 'Borgoña Distinción' },
    indigo: { bg: 'from-indigo-950 via-slate-900 to-purple-950', border: 'border-indigo-500/50', text: 'text-indigo-400', label: 'Índigo Universitario' },
    slate: { bg: 'from-slate-950 via-zinc-900 to-slate-900', border: 'border-slate-500/50', text: 'text-slate-300', label: 'Gris Carbón Sobrio' }
  };

  const handleHospitalLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen (PNG, JPG o SVG).');
      return;
    }

    try {
      setIsUploadingHospital(true);
      const base64 = await convertFileToBase64(file);
      onChange({ ...config, hospitalLogoBase64: base64 });
      if (onSaveToast) onSaveToast('Logo del Hospital cargado con éxito');
    } catch (err) {
      console.error('Error subiendo logo:', err);
      alert('Error al procesar la imagen.');
    } finally {
      setIsUploadingHospital(false);
    }
  };

  const handleSpecialistLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    try {
      setIsUploadingSpecialist(true);
      const base64 = await convertFileToBase64(file);
      onChange({ ...config, specialistLogoBase64: base64 });
      if (onSaveToast) onSaveToast('Logo del Especialista cargado con éxito');
    } catch (err) {
      console.error('Error subiendo logo:', err);
      alert('Error al procesar la imagen.');
    } finally {
      setIsUploadingSpecialist(false);
    }
  };

  const handleSelectProfile = (prof: LetterheadConfig) => {
    onChange({ ...prof });
    if (onSaveToast) onSaveToast(`Membrete cambiado a: ${prof.name}`);
  };

  const handleSaveAsNewProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile: LetterheadConfig = {
      ...config,
      id: 'custom-prof-' + Date.now(),
      name: newProfileName.trim()
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveLetterheadProfiles(updated);
    onChange(newProfile);
    setNewProfileName('');
    setShowSaveProfileModal(false);
    if (onSaveToast) onSaveToast(`Perfil "${newProfile.name}" guardado permanentemente`);
  };

  const handleDeleteProfile = (profId: string) => {
    if (profiles.length <= 1) {
      alert('Debes mantener al menos un perfil de membrete.');
      return;
    }
    const updated = profiles.filter(p => p.id !== profId);
    setProfiles(updated);
    saveLetterheadProfiles(updated);
    if (onSaveToast) onSaveToast('Perfil eliminado');
  };

  const handleSavePermanentlyAndProceed = () => {
    const ok = saveActiveLetterheadPermanently(config);
    if (ok) {
      markLetterheadConfigured(true);
      setIsSavedLocally(true);
      if (onSaveToast) {
        onSaveToast('✅ ¡Formato y logos guardados permanentemente en tu PC/Teléfono! Abriendo Ficha Preanestésica...');
      }
      if (onSaveAndProceed) {
        setTimeout(() => {
          onSaveAndProceed();
        }, 300);
      }
    } else {
      alert('No se pudo guardar el formato en este dispositivo. Por favor verifica los permisos del navegador.');
    }
  };

  const currentTheme = themeGradients[config.themeColor] || themeGradients.navy;

  return (
    <div className="space-y-6">
      {/* Banner Explicativo */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-cyan-950/60 border border-amber-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                Exclusivo Elite Pro
              </span>
              <span className="text-xs font-bold text-slate-400">Personalización de Membrete</span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
              Identidad Institucional & Logos para Fichas Preanestésicas
            </h3>
            <p className="text-xs text-slate-300">
              Personaliza el nombre de tu hospital, servicio clínico, datos profesionales y sube los logos oficiales. Se plasmarán en alta definición en cada reporte y PDF generado.
            </p>
          </div>
        </div>

        {/* Perfiles Rápidos Selector */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={config.id}
              onChange={(e) => {
                const found = profiles.find(p => p.id === e.target.value);
                if (found) handleSelectProfile(found);
              }}
              className="w-full sm:w-auto bg-slate-950 border border-amber-500/40 text-amber-200 text-xs font-bold rounded-xl px-3 py-2 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {profiles.map(p => (
                <option key={p.id} value={p.id}>
                  🏥 {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setShowSaveProfileModal(true)}
            className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Guardar esta configuración como un nuevo hospital o clínica"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Perfil</span>
          </button>
        </div>
      </div>

      {/* ACCIÓN PRINCIPAL DESTACADA: GUARDAR FORMATO PERMANENTE EN PC/TELÉFONO */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border-2 border-emerald-400/70 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center text-emerald-300 shrink-0 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-slate-950 shadow-sm">
                  💾 Memoria Permanente en Dispositivo
                </span>
                {isSavedLocally ? (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Guardado y Activo en este PC/Teléfono
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Configura tus datos y pulsa guardar
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-black text-white mt-1">
                Guarda este membrete y logos una sola vez en tu PC o Teléfono
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                Al guardar, quedará fijado para siempre en este equipo. El sistema te llevará directo a la <span className="text-cyan-300 font-bold">Ficha Preanestésica</span> para que no tengas que configurar tu hospital ni subir los logos a cada rato.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePermanentlyAndProceed}
            className="w-full md:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 shrink-0"
            title="Guarda permanentemente este membrete con sus logos y pasa directo a atender al paciente en la Ficha Preanestésica"
          >
            <Save className="w-4 h-4" />
            <span>Guardar en PC/Teléfono e Ir a Ficha Preanestésica →</span>
          </button>
        </div>
      </div>

      {/* VISTA PREVIA EN VIVO DEL MEMBRETE */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Vista Previa en Vivo del Membrete (Cómo saldrá en el PDF Oficial)
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-actualizado
          </span>
        </div>

        {/* Live Letterhead Card */}
        <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${currentTheme.bg} border-2 ${currentTheme.border} shadow-2xl relative overflow-hidden transition-all duration-300`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Logo 1: Hospital */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
              {config.hospitalLogoBase64 ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1.5 shadow-md flex items-center justify-center shrink-0 border border-slate-300">
                  <img
                    src={config.hospitalLogoBase64}
                    alt="Logo Hospital"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-900/90 border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 shrink-0 text-center p-1">
                  <Building2 className="w-6 h-6 text-slate-600 mb-0.5" />
                  <span className="text-[9px] font-bold leading-tight">Sin Logo Hospital</span>
                </div>
              )}

              {/* Central Details */}
              <div className="text-center sm:text-left min-w-0">
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {config.institutionType || 'CENTRO HOSPITALARIO QUIRÚRGICO'}
                </p>
                <h2 className="text-sm sm:text-base md:text-lg font-black text-white leading-tight uppercase">
                  {config.hospitalName || 'HOSPITAL UNIVERSITARIO CENTRAL'}
                </h2>
                <h3 className={`text-xs font-extrabold ${currentTheme.text} leading-tight mt-0.5 uppercase`}>
                  {config.department || 'SERVICIO DE ANESTESIOLOGÍA Y REANIMACIÓN'}
                </h3>
                <p className="text-[11px] text-slate-300 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-0.5">
                  {config.address && <span>{config.address} • </span>}
                  {config.cityCountry && <span>{config.cityCountry}</span>}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-3">
                  {config.phone && <span>Tel: {config.phone}</span>}
                  {config.email && <span>Email: {config.email}</span>}
                </p>
              </div>
            </div>

            {/* Logo 2: Specialist / Society */}
            <div className="flex flex-col items-center sm:items-end justify-center shrink-0 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-3 sm:pt-0 sm:pl-4">
              {config.specialistLogoBase64 ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white p-1 shadow-md flex items-center justify-center mb-1.5 border border-slate-300">
                  <img
                    src={config.specialistLogoBase64}
                    alt="Logo Especialista"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-500 mb-1.5">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
              )}
              <div className="leading-tight">
                <p className="text-xs sm:text-sm font-black text-white">{config.hospitalName || 'HOSPITAL UNIVERSITARIO'}</p>
                <p className="text-[11px] font-bold text-cyan-300">{config.department || 'Servicio de Anestesiología'}</p>
                <p className="text-[10px] text-amber-300 font-mono">Datos del Anestesiólogo en cada Ficha</p>
              </div>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-mono">VALORACIÓN PREANESTÉSICA OFICIAL • HOJA PERIOPERATORIA</span>
            <span className="text-emerald-400 font-bold">VÁLIDO PARA HISTORIA CLÍNICA & CIRUGÍA</span>
          </div>
        </div>
      </div>

      {/* FORMULARIO EDITABLE DE MEMBRETE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* COLUMNA 1: LOGOS (Upload & Preview) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              1. Logos e Identidad Gráfica
            </h4>

            {/* Subida de Logo Hospital */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                🏥 Logo del Hospital / Clínica (Izquierda):
              </label>
              
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {config.hospitalLogoBase64 ? (
                    <img
                      src={config.hospitalLogoBase64}
                      alt="Logo Hospital"
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={hospitalFileInputRef}
                    onChange={handleHospitalLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => hospitalFileInputRef.current?.click()}
                      disabled={isUploadingHospital}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{config.hospitalLogoBase64 ? 'Cambiar Logo' : 'Subir Logo Hospital'}</span>
                    </button>

                    {config.hospitalLogoBase64 && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, hospitalLogoBase64: null })}
                        className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-xl border border-rose-800/40 transition-all cursor-pointer"
                        title="Quitar logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Soporta PNG transparente, JPG o SVG. Tamaño recomendado: 300x300 px.
                  </p>
                </div>
              </div>
            </div>

            {/* Subida de Logo Especialista */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 block">
                👨‍⚕️ Logo del Especialista / Sociedad / Sello (Derecha):
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-950 border-2 border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                  {config.specialistLogoBase64 ? (
                    <img
                      src={config.specialistLogoBase64}
                      alt="Logo Especialista"
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  ) : (
                    <User className="w-6 h-6 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  <input
                    type="file"
                    ref={specialistFileInputRef}
                    onChange={handleSpecialistLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => specialistFileInputRef.current?.click()}
                      disabled={isUploadingSpecialist}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{config.specialistLogoBase64 ? 'Cambiar Logo' : 'Subir Logo Personal'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onChange({ ...config, specialistLogoBase64: LOGO_SHIELD_BASE64 || null })}
                      className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-[11px] rounded-xl transition-all cursor-pointer"
                      title="Usar escudo dorado oficial AnestesiaPro"
                    >
                      Escudo Oficial
                    </button>

                    {config.specialistLogoBase64 && (
                      <button
                        type="button"
                        onClick={() => onChange({ ...config, specialistLogoBase64: null })}
                        className="p-1.5 text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-xl border border-rose-800/40 transition-all cursor-pointer"
                        title="Quitar logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Puedes usar tu sello médico o el escudo de tu sociedad científica.
                  </p>
                </div>
              </div>
            </div>

            {/* Selector de Color Temático del Membrete */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Color Distintivo del Membrete en PDF:
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(themeGradients) as LetterheadConfig['themeColor'][]).map(c => {
                  const meta = themeGradients[c];
                  const isSelected = config.themeColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange({ ...config, themeColor: c })}
                      className={`p-2 rounded-xl text-center text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        isSelected
                          ? `bg-slate-800 ${meta.border} text-white ring-2 ring-cyan-400`
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full bg-gradient-to-tr ${meta.bg} border ${meta.border}`}></span>
                      <span className="text-[10px] truncate max-w-full">{meta.label.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: DATOS DEL HOSPITAL Y ESPECIALISTA */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              2. Datos Institucionales del Hospital o Centro
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Nombre Oficial del Hospital o Clínica *</label>
                <input
                  type="text"
                  value={config.hospitalName}
                  onChange={(e) => onChange({ ...config, hospitalName: e.target.value })}
                  placeholder="Ej: HOSPITAL CLÍNICO UNIVERSITARIO"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Servicio, Departamento o Unidad Quirúrgica *</label>
                <input
                  type="text"
                  value={config.department}
                  onChange={(e) => onChange({ ...config, department: e.target.value })}
                  placeholder="Ej: SERVICIO DE ANESTESIOLOGÍA Y REANIMACIÓN"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Tipo de Centro</label>
                <input
                  type="text"
                  value={config.institutionType}
                  onChange={(e) => onChange({ ...config, institutionType: e.target.value })}
                  placeholder="Ej: Centro Quirúrgico de Alta Especialidad"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Ciudad y País</label>
                <input
                  type="text"
                  value={config.cityCountry}
                  onChange={(e) => onChange({ ...config, cityCountry: e.target.value })}
                  placeholder="Ej: Caracas, Venezuela"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-300">Dirección / Pabellón</label>
                <input
                  type="text"
                  value={config.address}
                  onChange={(e) => onChange({ ...config, address: e.target.value })}
                  placeholder="Ej: Av. Principal, Pabellón Quirúrgico Central, Piso 2"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Teléfono Institucional</label>
                <input
                  type="text"
                  value={config.phone}
                  onChange={(e) => onChange({ ...config, phone: e.target.value })}
                  placeholder="Ej: +58 (212) 555-0199"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Correo Electrónico del Servicio</label>
                <input
                  type="email"
                  value={config.email}
                  onChange={(e) => onChange({ ...config, email: e.target.value })}
                  placeholder="Ej: anestesiologia@hospital.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN INFORMATIVA: DATOS DEL ANESTESIÓLOGO EN LA FICHA */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-xl">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-cyan-400" />
                3. Asignación del Anestesiólogo Evaluador (Ficha Clínica)
              </span>
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Se registra en cada Ficha
              </span>
            </h4>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-slate-950 border border-blue-500/30 space-y-2">
              <p className="text-xs text-slate-200 leading-relaxed">
                <strong className="text-white">Aclaratoria de Guardia Hospitalaria:</strong> En un hospital o centro quirúrgico hay múltiples anestesiólogos de guardia y de planta. Por ello, <strong>el Nombre del Anestesiólogo, Cédula de Identidad, Teléfono, Matrícula Profesional y Firma Manuscrita se completan directamente en la Ficha Preanestésica de cada paciente</strong>, y no en el membrete hospitalario general.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-cyan-300 pt-1 border-t border-slate-800/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>En la Ficha puedes activar <em>"Recordar mis datos de Anestesiólogo en este equipo"</em> para que tu nombre y matrícula queden listos por defecto.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIÓN INFERIOR: GUARDAR Y PASAR A PREANESTESIA */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Configuración guardada en tu navegador/móvil actual de forma permanente.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => {
              onChange({ ...DEFAULT_LETTERHEAD_CONFIG });
              if (onSaveToast) onSaveToast('Valores restaurados por defecto');
            }}
            className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Restablecer Valores
          </button>

          <button
            type="button"
            onClick={handleSavePermanentlyAndProceed}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Guardar en este equipo e Ir a Preanestesia →</span>
          </button>
        </div>
      </div>

      {/* MODAL GUARDAR NUEVO PERFIL DE MEMBRETE */}
      {showSaveProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Save className="w-4 h-4 text-amber-400" />
                Guardar Nuevo Perfil de Hospital
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveProfileModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Guarda este membrete y sus logos bajo un nombre reconocible para cambiar entre hospitales con un solo clic.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300">Nombre del Perfil:</label>
              <input
                type="text"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Ej: Clínica Santa Sofía • Turno Tarde"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-400 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSaveProfileModal(false)}
                className="px-3 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveAsNewProfile}
                disabled={!newProfileName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg cursor-pointer disabled:opacity-40"
              >
                Guardar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Stethoscope, 
  Code2, 
  Mail, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Heart, 
  ExternalLink, 
  Copy, 
  Check, 
  Award,
  Layers,
  Cpu
} from 'lucide-react';
import { SHORT_APP_URL, getCanonicalAppOrigin } from '../lib/statsService';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
  onOpenShare?: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({
  isOpen,
  onClose,
  onOpenContact,
  onOpenShare
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('carloseduardoleal29@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-sky-500/40 rounded-3xl max-w-lg w-full shadow-2xl shadow-cyan-950/50 overflow-hidden my-auto text-slate-100 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header banner with Developer Logo */}
        <div className="relative bg-gradient-to-b from-[#0a1d35] via-[#071322] to-slate-900 p-5 sm:p-6 pb-4 border-b border-sky-500/20 text-center">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo container */}
          <div className="inline-block mx-auto mb-2 p-2 bg-[#040b17]/90 rounded-2xl border border-sky-400/40 shadow-xl max-w-[280px] sm:max-w-[320px]">
            <img 
              src="/ce_leal_studio_logo.svg" 
              alt="C.E. LEAL studio • SOFTWARE & MEDICAL APPS" 
              className="w-full h-auto object-contain rounded-lg"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Code2 className="w-3 h-3 text-sky-400" /> Desarrollador Oficial
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Stethoscope className="w-3 h-3 text-cyan-400" /> Médico Especialista
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Author Card */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl text-white shadow-md shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                  Dr. Carlos Leal
                </h3>
                <p className="text-xs text-sky-300 font-semibold">
                  Especialista en Anestesiología y Reanimación
                </p>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-rose-400" /> Maracay, Venezuela
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              Fundador y creador de <strong>AnestesiaPro</strong> y <strong>C.E. LEAL studio</strong>. Fusionando la experiencia anestesiológica directa en quirófano con desarrollo de software biomédico de alta fidelidad, diseñado para proporcionar rapidez y seguridad al paciente crítico.
            </p>
          </div>

          {/* Pillars & Values */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-[11px]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> 100% Offline-First
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Funciona sin conexión en quirófanos blindados y sin señal celular.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cero Publicidad
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Suite gratuita y médica sin interrupciones ni recolección de datos privados.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                <Layers className="w-3.5 h-3.5 text-amber-400" /> Evidencia Médica
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Algoritmos DAS, VORTEX, OMS E-MOTIVE, escalas ASA, Aldrete y Caprini.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-sky-300 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Nube en Tiempo Real
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Recursos y actualizaciones sincronizados automáticamente con Firebase.
              </p>
            </div>
          </div>

          {/* Contact & Interaction Buttons */}
          <div className="space-y-2 pt-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Canales Directos con el Desarrollador
            </h4>

            {/* Email button with copy option */}
            <div className="flex items-center gap-2">
              <a
                href="mailto:carloseduardoleal29@gmail.com?subject=Consulta%20o%20Colaboraci%C3%B3n%20para%20Dr.%20Carlos%20Leal%20(AnestesiaPro)"
                className="flex-1 flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl text-xs font-semibold transition-all group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">carloseduardoleal29@gmail.com</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white shrink-0 ml-1" />
              </a>

              <button
                onClick={handleCopyEmail}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors shrink-0"
                title="Copiar correo electrónico"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* In-app Suggestions & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onOpenContact && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenContact();
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 bg-sky-950/80 hover:bg-sky-900 text-sky-300 hover:text-white border border-sky-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>Enviar Sugerencia</span>
                </button>
              )}

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Hola Dr. Carlos Leal, le escribo respecto a la suite médica AnestesiaPro / C.E. LEAL studio:\n\n${SHORT_APP_URL}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Contactar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-[#040b17] px-5 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>&copy; 2026 C.E. LEAL studio</span>
          <span>AnestesiaPro v2.5</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Code2, 
  Stethoscope, 
  Award, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  ShieldCheck, 
  Heart, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Share2
} from 'lucide-react';

interface DeveloperFooterProps {
  onOpenDeveloperModal: () => void;
  onOpenContactModal?: () => void;
  onOpenShareModal?: () => void;
}

export const DeveloperFooter: React.FC<DeveloperFooterProps> = ({
  onOpenDeveloperModal,
  onOpenContactModal,
  onOpenShareModal
}) => {
  const handleOpenContact = () => {
    if (onOpenContactModal) {
      onOpenContactModal();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_contact_modal'));
    }
  };

  return (
    <footer className="w-full bg-gradient-to-b from-slate-950 via-[#071322] to-[#040b17] border-t border-sky-900/40 text-slate-300 py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-40 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* PESTAÑAS Y ACCESOS RÁPIDOS INFERIORES */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-wrap items-center justify-center sm:justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
              Accesos Rápidos:
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* PESTAÑA: CONTACTO Y SUGERENCIAS */}
            <button
              onClick={handleOpenContact}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-950/90 to-slate-900 hover:from-cyan-900 hover:to-slate-800 text-cyan-300 hover:text-white border border-cyan-400/50 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              title="Contacto directo y sugerencias para el Dr. Carlos Leal"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Contacto y Sugerencias</span>
            </button>

            {/* PESTAÑA: COMPARTIR CON COLEGAS */}
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-950/90 to-slate-900 hover:from-emerald-900 hover:to-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/50 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                title="Compartir AnestesiaPro por WhatsApp y Redes Sociales"
              >
                <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Compartir Suite</span>
              </button>
            )}

            {/* PESTAÑA: CONOCER AL AUTOR */}
            <button
              onClick={onOpenDeveloperModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-950/90 to-slate-900 hover:from-sky-900 hover:to-slate-800 text-sky-300 hover:text-white border border-sky-400/50 text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              title="Perfil oficial del desarrollador Dr. Carlos Leal"
            >
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Conoce al Desarrollador</span>
            </button>
          </div>
        </div>

        {/* Main Developer Feature Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-sky-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-sky-950/40 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-sky-400/60 transition-all duration-300 group">
          {/* Logo & Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 max-w-xl">
            {/* Developer Logo Graphic with click-to-view - TAL CUAL EL LOGO ORIGINAL */}
            <div 
              onClick={onOpenDeveloperModal}
              className="shrink-0 p-2 sm:p-2.5 bg-[#0a1d35] rounded-2xl border-2 border-sky-400/50 shadow-xl shadow-cyan-950/60 cursor-pointer overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-sky-300 group-hover:shadow-sky-500/20 max-w-[200px] sm:max-w-[240px]"
              title="Haz clic para ver el perfil oficial del desarrollador Dr. Carlos Leal"
            >
              <img 
                src="/ce_leal_studio_logo.svg" 
                alt="C.E. LEAL studio • SOFTWARE & MEDICAL APPS" 
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>

            {/* Author Description */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-sky-400" /> Desarrollador Oficial
                </span>
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Stethoscope className="w-3 h-3 text-cyan-400" /> Autor Clínico
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                Dr. Carlos Leal &bull; <span className="text-sky-300 font-semibold">C.E. LEAL studio</span>
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Especialista en Anestesiología y Reanimación. Desarrollador creador y arquitecto digital de <strong>AnestesiaPro</strong>. Desarrollado con excelencia técnica para garantizar precisión y autonomía en quirófano sin depender de internet.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-rose-400" /> Maracay, Venezuela
                </span>
                <span>&bull;</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Suite 100% Médica &amp; Gratuita
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenDeveloperModal}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-900/40 transition-all cursor-pointer border border-sky-400/40 active:scale-95 group/btn"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>Conoce al Desarrollador</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-200 transition-transform group-hover/btn:translate-x-0.5" />
            </button>

            <button
              onClick={handleOpenContact}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Contacto Directo</span>
            </button>
          </div>
        </div>

        {/* Sub-footer details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-800/80 pt-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <img 
              src="/ce_leal_studio_logo.svg" 
              alt="C.E. LEAL studio" 
              className="h-5 w-auto object-contain rounded border border-sky-500/40"
            />
            <span>
              <strong>AnestesiaPro</strong> &bull; Desarrollado por Dr. Carlos Leal (C.E. LEAL studio &copy; 2026)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="mailto:carloseduardoleal29@gmail.com?subject=Contacto%20AnestesiaPro" 
              className="text-slate-400 hover:text-sky-300 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-sky-400" /> Correo Oficial
            </a>
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                Compartir Suite
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

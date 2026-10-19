import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, UserCheck, ShieldCheck, ArrowRight, X, Award, ChevronUp, 
  Stethoscope, FileText, CheckCircle2, Eye, Bell, Flame
} from 'lucide-react';
import { isUserRegistered, getStoredUserProfile } from '../lib/userRegistrationService';

export function FloatingRegistrationPrompt() {
  const [registered, setRegistered] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('anestesiapro_preview_banner') === 'true';
  });
  const [showPulseAnimation, setShowPulseAnimation] = useState<boolean>(false);

  // Periodic reminder timer ref
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const checkState = () => {
      const isReg = isUserRegistered();
      setRegistered(isReg);
    };

    checkState();

    // Check if dismissed in this session
    const dismissedSession = sessionStorage.getItem('anestesiapro_prompt_dismissed') === 'true';
    if (dismissedSession && !isPreviewMode) {
      setIsMinimized(true);
    }

    const handleProfileUpdate = () => {
      const isReg = isUserRegistered();
      setRegistered(isReg);
    };

    // Custom event to allow Dr. Carlos Leal (Admin) to preview the banner anytime
    const handlePreviewBanner = () => {
      setIsPreviewMode(true);
      setIsMinimized(false);
      setIsDismissed(false);
      sessionStorage.setItem('anestesiapro_preview_banner', 'true');
    };

    const handleClosePreview = () => {
      setIsPreviewMode(false);
      sessionStorage.removeItem('anestesiapro_preview_banner');
      checkState();
    };

    window.addEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
    window.addEventListener('anestesiapro_preview_registration_banner', handlePreviewBanner);
    window.addEventListener('anestesiapro_close_preview_banner', handleClosePreview);

    return () => {
      window.removeEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
      window.removeEventListener('anestesiapro_preview_registration_banner', handlePreviewBanner);
      window.removeEventListener('anestesiapro_close_preview_banner', handleClosePreview);
    };
  }, [isPreviewMode]);

  // Periodic reminder: if minimized and user is not registered, re-expand gently after 3 minutes (180s)
  useEffect(() => {
    if (isMinimized && (!registered || isPreviewMode)) {
      timerRef.current = setTimeout(() => {
        setIsMinimized(false);
        setShowPulseAnimation(true);
        setTimeout(() => setShowPulseAnimation(false), 3000);
      }, 180000); // 3 minutes
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isMinimized, registered, isPreviewMode]);

  // If user is registered and NOT in preview mode, don't show
  if ((registered && !isPreviewMode) || isDismissed) {
    return null;
  }

  const handleOpenRegistration = () => {
    window.dispatchEvent(new CustomEvent('anestesiapro_open_user_registration'));
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
    sessionStorage.setItem('anestesiapro_prompt_dismissed', 'true');
  };

  const handleClosePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewMode(false);
    sessionStorage.removeItem('anestesiapro_preview_banner');
  };

  // Minimized state: Glowing, animated floating button with live doctor count & badge
  if (isMinimized) {
    return (
      <aside aria-label="Aviso de registro y carnet digital" className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 animate-bounce-subtle">
        <button
          onClick={() => {
            setIsMinimized(false);
            handleOpenRegistration();
          }}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-slate-950 via-cyan-950 to-blue-950 text-cyan-200 border-2 border-amber-400 hover:border-amber-300 px-4 py-2.5 rounded-full shadow-2xl shadow-amber-500/30 cursor-pointer animate-glow-pulse active:scale-95 transition-all text-xs font-black ring-2 ring-amber-400/40"
          title="Abrir Registro de Colega y Activar Carnet Digital (Gratis • 30 seg)"
        >
          {/* Shimmer light */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-amber-300/30 to-transparent transform -skew-x-12 animate-shimmer-slide pointer-events-none rounded-full"></span>

          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300"></span>
          </span>

          <span className="text-base leading-none">🪪</span>
          <span className="font-black tracking-tight text-white group-hover:text-amber-300 flex items-center gap-1">
            <span>Activar Mi Carnet Médico</span>
          </span>
          <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
            GRATIS
          </span>

          {isPreviewMode && (
            <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
              PREVIEW
            </span>
          )}
        </button>
      </aside>
    );
  }

  // Expanded banner card: Highly engaging, motivating, and visually striking
  return (
    <aside aria-label="Aviso de registro y carnet digital" className={`fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-md animate-fade-in ${showPulseAnimation ? 'ring-4 ring-amber-400 animate-pulse' : ''}`}>
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a192f] to-indigo-950 border-2 border-cyan-400/80 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-cyan-950/90 ring-1 ring-cyan-500/50 backdrop-blur-xl">
        
        {/* Glow ambient background elements */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Admin Preview Header Indicator */}
        {isPreviewMode && (
          <div className="bg-amber-500/20 border border-amber-400/40 -mx-4 -mt-4 mb-3 px-3.5 py-1.5 flex items-center justify-between text-[10px] font-black text-amber-300 rounded-t-2xl">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>MODO VISTA PREVIA DR. CARLOS LEAL (ASÍ LO VEN LOS COLEGAS)</span>
            </span>
            <button
              onClick={handleClosePreview}
              className="text-amber-200 hover:text-white bg-slate-900/80 px-2 py-0.5 rounded border border-amber-400/40 cursor-pointer"
            >
              Cerrar Vista Previa ✕
            </button>
          </div>
        )}

        {/* Close/Minimize button */}
        <button
          onClick={handleMinimize}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-700/50"
          title="Minimizar recordatorio (volverá a recordarte luego)"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5">
          {/* Animated Badge Icon with Photo/Credential look */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                🪪
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
            </span>
          </div>

          <div className="flex-1 pr-4 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-400/50 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400" /> Carnet Digital Oficial 2026
              </span>
              <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5">
                ⚡ Solo toma 30 seg
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-white leading-tight">
              ¿Colega, aún no activas tu Carnet Digital de Especialista?
            </h4>

            <p className="text-[11px] text-slate-300 leading-snug mt-1.5">
              Únete a la red médica de <strong>AnestesiaPro</strong> creada por el <strong>Dr. Carlos Leal</strong>.
            </p>

            {/* Motivational Benefits Bullets */}
            <div className="mt-2.5 space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-cyan-500/30 text-[11px] text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xs">✓</span>
                <span><strong>Carnet Digital con QR:</strong> Valida tu especialidad en cualquier quirófano.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 text-xs">✓</span>
                <span><strong>Reportes PDF Automáticos:</strong> Con tu nombre, cédula, hospital y firma digital.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-xs">★</span>
                <span><strong>100% Gratuito & Vitalicio:</strong> Sin cobros ni suscripciones.</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3.5">
              <button
                onClick={handleOpenRegistration}
                className="relative overflow-hidden flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95 animate-glow-pulse border border-amber-300"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer-slide pointer-events-none"></span>
                <UserCheck className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Activar Mi Carnet Gratis</span>
                <ArrowRight className="w-4 h-4 text-slate-950 shrink-0" />
              </button>

              <button
                onClick={handleMinimize}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800 shrink-0"
                title="Minimizar por ahora"
              >
                Luego
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

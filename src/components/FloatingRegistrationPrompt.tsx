import React, { useState, useEffect } from 'react';
import { Sparkles, UserCheck, ShieldCheck, ArrowRight, X, Award, ChevronUp } from 'lucide-react';
import { isUserRegistered, getStoredUserProfile } from '../lib/userRegistrationService';

export function FloatingRegistrationPrompt() {
  const [registered, setRegistered] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    // Check initial state
    const checkState = () => {
      const isReg = isUserRegistered();
      setRegistered(isReg);
    };

    checkState();

    // Check if dismissed in this session
    const dismissedSession = sessionStorage.getItem('anestesiapro_prompt_dismissed') === 'true';
    if (dismissedSession) {
      setIsMinimized(true);
    }

    const handleProfileUpdate = () => {
      const isReg = isUserRegistered();
      setRegistered(isReg);
    };

    window.addEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('anestesiapro_user_profile_updated', handleProfileUpdate);
    };
  }, []);

  if (registered || isDismissed) {
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

  // Minimized state: Small glowing floating pill
  if (isMinimized) {
    return (
      <aside aria-label="Aviso de registro y carnet digital" className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={handleOpenRegistration}
          className="group relative flex items-center gap-2 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-cyan-200 border-2 border-cyan-400/80 hover:border-cyan-300 px-3.5 py-2.5 rounded-full shadow-2xl shadow-cyan-500/30 cursor-pointer animate-glow-pulse active:scale-95 transition-all text-xs font-black"
          title="Abrir Registro de Colega y Carnet Digital (Gratis)"
        >
          {/* Shimmer light */}
          <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent transform -skew-x-12 animate-shimmer-slide pointer-events-none rounded-full"></span>

          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-300"></span>
          </span>

          <span className="text-base">🪪</span>
          <span className="font-black tracking-tight text-white group-hover:text-cyan-200">
            Activar Carnet Médico
          </span>
          <span className="bg-cyan-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-tighter">
            30s
          </span>
        </button>
      </aside>
    );
  }

  // Expanded banner card
  return (
    <aside aria-label="Aviso de registro y carnet digital" className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 sm:max-w-md animate-fade-in">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border-2 border-cyan-400/70 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-cyan-950/80 ring-1 ring-cyan-500/40 backdrop-blur-xl">
        
        {/* Shimmer effect background */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Close/Minimize button */}
        <button
          onClick={handleMinimize}
          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Minimizar recordatorio"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          {/* Animated Badge Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/30 animate-badge-bounce text-xl">
            🪪
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Registro Médico Oficial
              </span>
              <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">
                ⚡ Solo toma 30 seg
              </span>
            </div>

            <h4 className="text-sm font-black text-white leading-tight">
              ¿Aún no tienes tu Carnet Digital AnestesiaPro?
            </h4>

            <p className="text-[11px] text-slate-300 leading-snug mt-1">
              Regístrate una sola vez para personalizar tus <strong>reportes PDF con tu nombre, cédula y hospital</strong>, y activar tu <strong>Carnet Digital de Especialista</strong>.
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleOpenRegistration}
                className="relative overflow-hidden flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-black text-xs py-2 px-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95 animate-glow-pulse"
              >
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer-slide pointer-events-none"></span>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Registrarme Gratis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleMinimize}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-200 px-2 py-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
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

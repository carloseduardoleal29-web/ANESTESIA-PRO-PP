import React from 'react';
import { Crown, Sparkles, ArrowRight, Zap, ShieldAlert, Brain, Calculator, FileText, MessageCircle } from 'lucide-react';
import { SHORT_APP_URL } from '../lib/statsService';

interface Props {
  onOpenPlanElite: () => void;
  isEliteActive?: boolean;
}

export const AnimatedEliteBanner: React.FC<Props> = ({ onOpenPlanElite, isEliteActive }) => {
  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-400/80 p-4 sm:p-6 bg-gradient-to-r from-amber-950 via-[#1e1708] to-slate-950 text-white my-3 group">
      
      {/* Animated Metallic Glow Halo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-yellow-500/10 to-transparent pointer-events-none animate-pulse" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-400/30 transition-all duration-700" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5">
        
        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-amber-500/40 animate-vital-glow">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-slate-950 fill-current animate-bounce duration-1000" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-slate-950 text-amber-300 p-1 rounded-full border border-amber-400 shadow-md">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
            </span>
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" /> ÉLITE 2026
              </span>
              <span className="text-[10px] sm:text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40 truncate">
                {isEliteActive ? '⭐ MEMBRESÍA ACTIVA' : 'Suscripción Especializada'}
              </span>
            </div>

            <h3 className="text-base sm:text-2xl font-black text-white tracking-tight leading-tight flex items-center gap-2 flex-wrap">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 animate-shimmer font-black">
                MÓDULOS ÉLITE ANESTESIAPRO
              </span>
            </h3>

            <p className="text-[11px] sm:text-sm text-amber-100/90 max-w-xl font-medium leading-relaxed">
              Calculadoras TIVA, Crisis Intraoperatorias, Simulador Virtual con Monitor ECG/SpO2/Capnografía en vivo, Traduce y Resume con IA y Preanestesia con Membretes PDF.
            </p>

            <div className="flex flex-wrap items-center gap-1 pt-0.5">
              {['🧮 TIVA', '🚨 Crisis', '🩺 Simulador', '🧠 IA', '📄 Preanestesia'].map((tag, tIdx) => (
                <span key={tIdx} className="text-[9px] sm:text-[10px] font-extrabold bg-amber-950/80 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2.5">
          <button
            type="button"
            onClick={onOpenPlanElite}
            className="w-full px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/80 transition-all cursor-pointer active:scale-95 group-hover:scale-105"
          >
            <Crown className="w-4 h-4 fill-current text-slate-950" />
            <span>{isEliteActive ? 'Ver Detalles de Membresía' : 'Adquirir Plan Élite ($30 / $50 / $95)'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`👑 ¡Te recomiendo el Plan Élite de AnestesiaPro! Acceso total a Calculadoras TIVA, Crisis Intraoperatorias, Simulador Virtual con Monitor, Traduce y Resume con IA y Fichas Preanestésicas en PDF (creado por el Dr. Carlos Leal):\n\n🔗 ${SHORT_APP_URL}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span>Recomendar Plan Élite por WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
};

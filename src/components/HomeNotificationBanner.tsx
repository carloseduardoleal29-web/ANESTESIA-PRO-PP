import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, MessageCircle, Share2, Radio, Zap } from 'lucide-react';
import { getCanonicalAppOrigin } from '../lib/statsService';

interface HomeNotificationBannerProps {
  onOpenResource: (resourceId: string) => void;
}

const STORAGE_KEY = 'anestesiapro_home_banner_seen_v2026';

export const HomeNotificationBanner: React.FC<HomeNotificationBannerProps> = ({ onOpenResource }) => {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== 'dismissed';
    } catch {
      return true;
    }
  });

  // Listen for admin publishing new resources to re-trigger the banner if desired
  useEffect(() => {
    const handleNewAlert = () => {
      setIsVisible(true);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };

    window.addEventListener('anestesiapro_new_resource_published', handleNewAlert);
    return () => window.removeEventListener('anestesiapro_new_resource_published', handleNewAlert);
  }, []);

  if (!isVisible) {
    return null;
  }

  const dismissBanner = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'dismissed');
    } catch {}
  };

  const handleBannerClick = () => {
    dismissBanner();
    onOpenResource('res-ciprofol-hsk3486-hipnotico-gabaa-2026');
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = getCanonicalAppOrigin();
    const shareUrl = `${origin}/?tab=educacion&recurso=res-ciprofol-hsk3486-hipnotico-gabaa-2026`;
    const message = `🚨 *¡NUEVO EN ANESTESIAPRO!* 🚨\n\n💊 *Ciprofol (HSK3486): El Nuevo Hipnótico GABA-A 2026*\nAtlas Ultra-HD de 6 Láminas, Calculadora de Inducción TIVA y Protocolos Oficiales revisados por el Dr. Carlos Leal.\n\n📲 *Accede directamente aquí:*\n${shareUrl}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(message);
    const url = isMobile ? `whatsapp://send?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative group mb-3">
      {/* Blinking Halo / Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 rounded-3xl blur-md opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse pointer-events-none" />

      {/* Main Banner Container */}
      <div
        onClick={handleBannerClick}
        role="button"
        tabIndex={0}
        aria-label="Nueva actualización clínica disponible"
        className="relative bg-gradient-to-r from-slate-950 via-purple-950/90 to-slate-950 border-2 border-amber-400/90 rounded-2xl p-3.5 sm:p-4.5 shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Content side */}
          <div className="flex items-start gap-3">
            {/* Blinking Beacon */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping absolute inset-0" />
              <div className="w-3.5 h-3.5 bg-amber-300 rounded-full border-2 border-slate-950 relative shadow-lg shadow-amber-400/80" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 animate-bounce">
                  <Zap className="w-3 h-3 fill-current" /> ¡NOVEDAD DESTACADA!
                </span>
                <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  Educación Continua 2026
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight">
                💊 Ciprofol (HSK3486) & Atlas de Preeclampsia 2026 Disponibles
              </h3>

              <p className="text-xs text-slate-300 line-clamp-1 sm:line-clamp-none">
                Láminas Ultra-HD, calculadoras clínicas y protocolos oficiales revisados por el <strong className="text-cyan-300">Dr. Carlos Leal</strong>.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
              title="Compartir con colegas por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span className="hidden md:inline">Compartir</span>
            </button>

            <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md hover:from-amber-300 hover:to-amber-200 transition-all">
              <span>Explorar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Close / Dismiss Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissBanner();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer"
              title="Cerrar este anuncio"
              aria-label="Cerrar banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

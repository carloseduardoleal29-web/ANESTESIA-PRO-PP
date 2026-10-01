import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, X, MessageCircle, Zap, Layers, Sparkles } from 'lucide-react';
import { getCanonicalAppOrigin, AppNotification } from '../lib/statsService';
import { getDeletedResourceIds } from '../lib/educationStorage';

interface HomeNotificationBannerProps {
  onOpenResource: (resourceId: string) => void;
}

export const HomeNotificationBanner: React.FC<HomeNotificationBannerProps> = ({ onOpenResource }) => {
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const fetchNotification = useCallback(async () => {
    try {
      const res = await fetch(`/api/notifications?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
        const deletedIds = getDeletedResourceIds();
        // Find the most recent notification that hasn't been dismissed and isn't for a deleted resource
        const unread = data.notifications.find((n: AppNotification) => {
          if (!n || !n.id) return false;
          if (n.resourceId && deletedIds.includes(n.resourceId)) return false;
          if (n.resourceId === 'test-item-1' || n.id.includes('test-item-1')) return false;
          const isDismissed = localStorage.getItem(`anestesiapro_home_banner_seen_${n.id}`) === 'dismissed';
          return !isDismissed;
        });

        if (unread) {
          setActiveNotification(unread);
          setIsVisible(true);
          return;
        }
      }

      setActiveNotification(null);
      setIsVisible(false);
    } catch {
      setActiveNotification(null);
      setIsVisible(false);
    }
  }, []);

  useEffect(() => {
    fetchNotification();

    const handleNewAlert = () => {
      fetchNotification();
    };

    window.addEventListener('anestesiapro_new_resource_published', handleNewAlert);
    window.addEventListener('anestesiapro_new_notification_published', handleNewAlert);
    window.addEventListener('anestesiapro_resource_deleted', handleNewAlert);
    window.addEventListener('focus', handleNewAlert);

    return () => {
      window.removeEventListener('anestesiapro_new_resource_published', handleNewAlert);
      window.removeEventListener('anestesiapro_new_notification_published', handleNewAlert);
      window.removeEventListener('anestesiapro_resource_deleted', handleNewAlert);
      window.removeEventListener('focus', handleNewAlert);
    };
  }, [fetchNotification]);

  if (!isVisible || !activeNotification) {
    return null;
  }

  const dismissBanner = () => {
    setIsVisible(false);
    try {
      if (activeNotification?.id) {
        localStorage.setItem(`anestesiapro_home_banner_seen_${activeNotification.id}`, 'dismissed');
      }
    } catch {}
  };

  const handleBannerClick = () => {
    const targetResId = activeNotification.resourceId || 'res-preeclampsia-eclampsia-enfoque-anestesiologico';
    dismissBanner();
    onOpenResource(targetResId);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const origin = getCanonicalAppOrigin();
    const targetResId = activeNotification.resourceId || 'res-preeclampsia-eclampsia-enfoque-anestesiologico';
    const shareUrl = `${origin}/?tab=educacion&recurso=${encodeURIComponent(targetResId)}`;
    const message = `🚨 *¡NUEVO EN ANESTESIAPRO!* 🚨\n\n📌 *${activeNotification.title}*\n${activeNotification.message}\nRevisado por ${activeNotification.author || 'Dr. Carlos Leal'}.\n\n📲 *Accede directamente aquí:*\n${shareUrl}`;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(message);
    if (isMobile) {
      window.location.href = `whatsapp://send?text=${encoded}`;
    } else {
      window.open(`https://web.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  const isCarousel = activeNotification.badge?.includes('CARRUSEL') || 
                     activeNotification.title?.toLowerCase().includes('carrusel') ||
                     activeNotification.title?.toLowerCase().includes('álbum');

  return (
    <div className="relative group mb-3 animate-in fade-in slide-in-from-top duration-300">
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
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {/* Blinking Beacon */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping absolute inset-0" />
              <div className="w-3.5 h-3.5 bg-amber-300 rounded-full border-2 border-slate-950 relative shadow-lg shadow-amber-400/80" />
            </div>

            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 animate-bounce">
                  {isCarousel ? <Layers className="w-3 h-3 fill-current" /> : <Zap className="w-3 h-3 fill-current" />}
                  {activeNotification.badge || '¡NOVEDAD DESTACADA!'}
                </span>
                <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  Educación Continua 2026
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white leading-snug tracking-tight line-clamp-2">
                {activeNotification.title}
              </h3>

              <p className="text-xs text-slate-300 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                {activeNotification.message}
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
              title="Cerrar y no volver a mostrar este aviso"
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


import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Sparkles, ArrowRight, X, Layers, FileText, Image as ImageIcon, Video, CheckCircle2 } from 'lucide-react';
import { AppNotification } from '../lib/statsService';
import { getDeletedResourceIds } from '../lib/educationStorage';

interface GlobalNotificationBannerProps {
  onOpenResource: (resourceId: string) => void;
  onNavigateToEducation: () => void;
}

export const GlobalNotificationBanner: React.FC<GlobalNotificationBannerProps> = ({
  onOpenResource,
  onNavigateToEducation
}) => {
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);
  const [isDismissing, setIsDismissing] = useState(false);

  const fetchLatestNotification = useCallback(async () => {
    // 1. Check if user or session has dismissed/muted banners
    if (sessionStorage.getItem('anestesiapro_global_banner_dismissed_session') === 'true' ||
        localStorage.getItem('anestesiapro_mute_resource_banners') === 'true' ||
        localStorage.getItem('anestesiapro_global_banner_dismissed') === 'true') {
      setActiveNotification(null);
      return;
    }

    // Do not show persistent banner to Dr. Carlos Leal (Admin) as he authored the content
    const isAdmin = localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
                    localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
                    sessionStorage.getItem('anestesiapro_author_session') === 'true';
    if (isAdmin) {
      setActiveNotification(null);
      return;
    }


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
        // Find the first notification that hasn't been dismissed and is not for a deleted resource
        const unread = data.notifications.find((n: AppNotification) => {
          if (!n || !n.id) return false;
          if (n.resourceId && deletedIds.includes(n.resourceId)) return false;
          if (n.resourceId === 'test-item-1' || n.id.includes('test-item-1')) return false;
          return localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true';
        });

        setActiveNotification(unread || null);
      } else {
        setActiveNotification(null);
      }
    } catch (e) {
      console.warn('[GlobalNotificationBanner] Error fetching notifications:', e);
    }
  }, []);

  useEffect(() => {
    fetchLatestNotification();

    const handleUpdate = () => {
      fetchLatestNotification();
    };

    window.addEventListener('anestesiapro_new_resource_published', handleUpdate);
    window.addEventListener('anestesiapro_new_notification_published', handleUpdate);
    window.addEventListener('anestesiapro_resource_deleted', handleUpdate);
    window.addEventListener('focus', handleUpdate);

    // Check periodically at 45s interval instead of 8s to prevent intrusive banner flashing
    const interval = setInterval(fetchLatestNotification, 45000);

    return () => {
      window.removeEventListener('anestesiapro_new_resource_published', handleUpdate);
      window.removeEventListener('anestesiapro_new_notification_published', handleUpdate);
      window.removeEventListener('anestesiapro_resource_deleted', handleUpdate);
      window.removeEventListener('focus', handleUpdate);
      clearInterval(interval);
    };
  }, [fetchLatestNotification]);

  const handleDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!activeNotification) return;

    setIsDismissing(true);
    // Mark in persistent localStorage so it NEVER shows again for this user on this device
    localStorage.setItem(`anestesiapro_dismissed_notif_${activeNotification.id}`, 'true');
    localStorage.setItem('anestesiapro_global_banner_dismissed', 'true');
    sessionStorage.setItem('anestesiapro_global_banner_dismissed_session', 'true');

    setTimeout(() => {
      setActiveNotification(null);
      setIsDismissing(false);
    }, 200);
  };

  const handleOpen = () => {
    if (!activeNotification) return;
    const resId = activeNotification.resourceId;

    // Dismiss so it won't appear again
    handleDismiss();

    if (resId) {
      onOpenResource(resId);
    } else {
      onNavigateToEducation();
    }
  };

  if (!activeNotification) return null;

  const isCarousel = activeNotification.badge?.includes('CARRUSEL') || 
                     activeNotification.title?.toLowerCase().includes('carrusel') ||
                     activeNotification.title?.toLowerCase().includes('álbum');

  return (
    <div
      role="alert"
      className={`relative w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-cyan-500/40 shadow-2xl text-white transition-all duration-300 z-30 ${
        isDismissing ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Decorative top accent line with animation */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-400 animate-pulse" />

      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left side: Icon + Badge + Title + Message */}
        <div 
          onClick={handleOpen}
          className="flex items-start gap-3 min-w-0 flex-1 cursor-pointer group"
        >
          <div className="relative shrink-0 mt-0.5 sm:mt-0">
            <img
              src="/pwa-192x192.png"
              alt="AnestesiaPro Logo"
              className="w-10 h-10 rounded-xl border border-amber-500/50 object-cover shadow-lg bg-slate-900 group-hover:scale-105 transition-transform shrink-0"
            />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-ping" />
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-black uppercase tracking-wider">
                {activeNotification.badge || 'NUEVA ACTUALIZACIÓN'}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                {activeNotification.author || 'Dr. Carlos Leal'}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-200 transition-colors line-clamp-1 leading-snug">
              {activeNotification.title}
            </h4>

            <p className="text-[11px] text-slate-300 line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {activeNotification.message}
            </p>
          </div>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0">
          <button
            onClick={handleOpen}
            className="bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Abrir y ver material nuevo"
          >
            <span>Ver Ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDismiss}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Cerrar aviso (no volver a mostrar)"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

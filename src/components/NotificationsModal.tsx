import React, { useState } from 'react';
import { X, Bell, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import { AppNotification, requestBrowserNotifications } from '../lib/statsService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onDismissNotification: (id: string) => void;
  onDismissAllNotifications: () => void;
  onOpenStatsModal: () => void;
  setActiveTab?: (tab: any) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onDismissNotification,
  onDismissAllNotifications,
  onOpenStatsModal,
  setActiveTab
}) => {
  const [hideSeenNotifs, setHideSeenNotifs] = useState(true);

  if (!isOpen) return null;

  const visibleNotifs = hideSeenNotifs
    ? notifications.filter(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true')
    : notifications;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-500/40 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
              <Bell className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Novedades y Notificaciones Médicas</h3>
              <p className="text-xs text-amber-300 font-medium">Publicaciones y actualizaciones del Dr. Carlos Leal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Dismiss Action Bar */}
        <div className="flex flex-wrap items-center justify-between bg-slate-950 p-1.5 rounded-2xl border border-slate-800 gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setHideSeenNotifs(true)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                hideSeenNotifs
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              Sin Leer ({notifications.filter(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true').length})
            </button>
            <button
              type="button"
              onClick={() => setHideSeenNotifs(false)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                !hideSeenNotifs
                  ? 'bg-slate-800 text-amber-300 border border-slate-700 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              Todas ({notifications.length})
            </button>
          </div>

          {notifications.some(n => localStorage.getItem(`anestesiapro_dismissed_notif_${n.id}`) !== 'true') && (
            <button
              type="button"
              onClick={onDismissAllNotifications}
              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 rounded-xl border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Marcar Todas Vistas</span>
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
          {visibleNotifs.length === 0 ? (
            <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 text-center space-y-3 my-2">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-black text-white">¡Estás al día con todas las novedades!</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                No tienes avisos o publicaciones pendientes por leer.
              </p>
              <button
                type="button"
                onClick={() => setHideSeenNotifs(false)}
                className="text-xs text-amber-300 font-bold bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Ver historial de novedades leídas ({notifications.length})
              </button>
            </div>
          ) : (
            visibleNotifs.map((notif) => {
              const isRead = localStorage.getItem(`anestesiapro_dismissed_notif_${notif.id}`) === 'true';

              return (
                <div
                  key={notif.id}
                  className={`bg-slate-950 rounded-2xl p-4 border space-y-2 transition-all ${
                    isRead
                      ? 'border-slate-800/80 opacity-70'
                      : 'border-amber-500/40 shadow-md ring-1 ring-amber-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30">
                        {notif.badge || 'ACTUALIZACIÓN'}
                      </span>
                      {isRead ? (
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Vista
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                          ✨ NUEVA
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{notif.date}</span>
                  </div>

                  <h4 className="text-sm font-black text-white">{notif.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">{notif.message}</p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 italic">Por: {notif.author || 'Dr. Carlos Leal'}</span>

                    <div className="flex items-center gap-2">
                      {!isRead && (
                        <button
                          type="button"
                          onClick={() => onDismissNotification(notif.id)}
                          className="text-[11px] font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-800 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Marcar vista</span>
                        </button>
                      )}

                      {setActiveTab && (
                        <button
                          onClick={() => {
                            onDismissNotification(notif.id);
                            onClose();
                            if (notif.resourceId === 'res-indice-de-shock' || notif.title.toLowerCase().includes('shock')) {
                              setActiveTab('indiceShock');
                            } else {
                              setActiveTab('educacion');
                            }
                          }}
                          className="bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 font-black text-xs px-3 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span>
                            {notif.resourceId === 'res-indice-de-shock' || notif.title.toLowerCase().includes('shock')
                              ? 'Abrir Módulo de Shock'
                              : 'Ver Recurso'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                requestBrowserNotifications().then(granted => {
                  if (granted) alert('¡Notificaciones del navegador activadas exitosamente!');
                  else alert('Las notificaciones no fueron permitidas en el navegador.');
                });
              }}
              className="text-[11px] font-bold text-cyan-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Activar Alertas del Navegador</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenStatsModal();
              }}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Publicar Alerta (Clave: 2534)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer w-full sm:w-auto text-center"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

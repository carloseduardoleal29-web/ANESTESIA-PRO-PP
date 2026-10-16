import React, { useState } from 'react';
import { Bell, X, Sparkles, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import notificationsData from '../data/notifications_backup.json';

interface NotificationsFeedModalProps {
  onClose: () => void;
}

export const NotificationsFeedModal: React.FC<NotificationsFeedModalProps> = ({ onClose }) => {
  const [filter, setFilter] = useState<'all' | 'broadcast' | 'registers'>('all');

  const notifications = notificationsData.filter(item => {
    if (filter === 'broadcast') return item.isPushBroadcast || item.badge.includes('ACTUALIZACIÓN');
    if (filter === 'registers') return item.badge.includes('REGISTRO');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl p-6 relative overflow-hidden space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5 text-purple-300 font-bold text-base">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3>Boletines & Alertas Push AnestesiaPro</h3>
              <p className="text-xs text-slate-400 font-normal">Educación Continua & Notificaciones en Tiempo Real</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              filter === 'all' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({notificationsData.length})
          </button>

          <button
            onClick={() => setFilter('broadcast')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              filter === 'broadcast' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Alertas Push / Actualizaciones
          </button>

          <button
            onClick={() => setFilter('registers')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              filter === 'registers' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Registros de Colegas
          </button>
        </div>

        {/* Notification Feed Items */}
        <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1">
          {notifications.map((item: any) => (
            <div key={item.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-purple-500/30 transition">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-100 text-xs sm:text-sm">{item.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
              <div className="text-[10px] text-slate-500 text-right flex items-center justify-between pt-1 border-t border-slate-900">
                <span>Fecha: <strong className="text-slate-400">{item.date}</strong></span>
                <span>Emisor: <strong className="text-purple-300">{item.author}</strong></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

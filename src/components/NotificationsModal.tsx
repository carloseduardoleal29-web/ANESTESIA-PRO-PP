import React, { useEffect, useState } from 'react';
import { Bell, X, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { getNotifications, sendBroadcastNotification } from '../lib/userService';

interface Props {
  onClose: () => void;
  isAdmin: boolean;
}

export function NotificationsModal({ onClose, isAdmin }: Props) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getNotifications().then(setNotifications);
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    try {
      const newNotif = await sendBroadcastNotification(title, message);
      setNotifications(prev => [newNotif, ...prev]);
      setTitle('');
      setMessage('');
      alert('¡Notificación Push de Difusión enviada a todos los colegas!');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Notificaciones & Difusión DPC</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {isAdmin && (
            <form onSubmit={handleSendBroadcast} className="p-3.5 bg-slate-950 border border-cyan-500/30 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                Enviar Notificación Push a Todos los Colegas
              </h4>
              <input
                type="text"
                placeholder="Título de la alerta..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <textarea
                placeholder="Mensaje de actualización o protocolo..."
                value={message}
                rows={2}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs rounded-lg hover:opacity-90 transition-all cursor-pointer"
              >
                {sending ? 'Enviando...' : '🚀 Emitir Difusión Push Global'}
              </button>
            </form>
          )}

          <div className="space-y-3">
            {notifications.map((n, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">{n.badge || 'NOTIFICACIÓN'}</span>
                  <span className="text-[10px] text-slate-500">{n.date}</span>
                </div>
                <h5 className="text-xs font-bold text-white">{n.title}</h5>
                <p className="text-xs text-slate-300">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

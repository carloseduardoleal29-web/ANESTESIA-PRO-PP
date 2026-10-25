import React, { useEffect, useState } from 'react';
import { DoctorUser } from '../types/user';
import { getAllDoctors, getNotifications, getAdminEvents, sendBroadcastNotification } from '../lib/userService';
import {
  Users,
  Bell,
  Activity,
  ShieldCheck,
  Search,
  Download,
  X,
  Sparkles,
  SendHorizontal,
  CheckCircle2,
  Cloud
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export function AdminPanel({ onClose }: Props) {
  const [users, setUsers] = useState<DoctorUser[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'notifications' | 'events'>('users');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  useEffect(() => {
    // Cargar datos reales sincronizados con Firestore Cloud
    getAllDoctors().then(data => setUsers(data)).catch(err => console.error('Error loading users:', err));
    getNotifications().then(data => setNotifications(data)).catch(err => console.error('Error loading notifs:', err));
    getAdminEvents().then(data => setEvents(data)).catch(err => console.error('Error loading events:', err));
  }, []);

  const filteredUsers = users.filter(u =>
    (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.idNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col">
      {/* Barra superior de Administrador */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md">
            AP
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Panel de Control Administrativo
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                Dr. Carlos Leal
              </span>
            </h2>
            <p className="text-xs text-slate-400">Control de Médicos, Difusiones Push & Registro Global</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Navegación Interna del Panel */}
      <div className="flex gap-4 border-b border-slate-800 px-6 py-3 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-1 cursor-pointer transition-all ${
            activeTab === 'users' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Médicos Registrados ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-1 cursor-pointer transition-all ${
            activeTab === 'notifications' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          Notificaciones & Alertas ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 text-xs sm:text-sm font-bold pb-1 cursor-pointer transition-all ${
            activeTab === 'events' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          Actividad Reciente
        </button>
      </div>

      {/* Contenedor Principal */}
      <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full">
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o email..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `medicos_anestesiapro_${new Date().toISOString().slice(0, 10)}.json`;
                  a.click();
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl border border-slate-700 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Exportar JSON
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5 font-semibold">Médico</th>
                      <th className="p-3.5 font-semibold">Cédula/Matrícula</th>
                      <th className="p-3.5 font-semibold">País / Ubicación</th>
                      <th className="p-3.5 font-semibold">Especialidad</th>
                      <th className="p-3.5 font-semibold">Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map(u => {
                      const isCarlos = u.id === 'usr_carlos_leal_admin' || u.role === 'admin' || (u.email || '').toLowerCase().includes('carloseduardoleal');
                      return (
                        <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{u.fullName}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </td>
                          <td className="p-3.5 text-slate-300 font-mono">{u.idNumber || 'N/A'}</td>
                          <td className="p-3.5 text-slate-300">{u.country || 'No especificado'}</td>
                          <td className="p-3.5 text-slate-300">{u.specialty || 'Anestesiología'}</td>
                          <td className="p-3.5">
                            {isCarlos ? (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[10px]">
                                👑 ADMINISTRADOR
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700 text-[10px]">
                                PLAN ESTÁNDAR
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            {/* Formulario de Nueva Difusión Push */}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <SendHorizontal className="w-4 h-4 text-cyan-400" />
                Emitir Alerta Push Masiva a Colegas
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Envía una notificación instantánea a los teléfonos de todos los médicos registrados en AnestesiaPro.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Título de la alerta (ej: 🚨 Protocolo Clínico Actualizado)"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                <textarea
                  placeholder="Mensaje de difusión para quirófano y residentes..."
                  rows={3}
                  value={broadcastMessage}
                  onChange={e => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
                {broadcastSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>¡Alerta Push transmitida con éxito a Firestore Cloud y enviada a los dispositivos!</span>
                  </div>
                )}
                <button
                  disabled={isBroadcasting}
                  onClick={async () => {
                    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
                      return;
                    }
                    setIsBroadcasting(true);
                    try {
                      const created = await sendBroadcastNotification(broadcastTitle.trim(), broadcastMessage.trim());
                      setNotifications(prev => [created, ...prev]);
                      setBroadcastTitle('');
                      setBroadcastMessage('');
                      setBroadcastSuccess(true);
                      setTimeout(() => setBroadcastSuccess(false), 5000);
                    } catch (e) {
                      console.error('Broadcast failure:', e);
                    } finally {
                      setIsBroadcasting(false);
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:brightness-110"
                >
                  <SendHorizontal className="w-4 h-4" />
                  {isBroadcasting ? 'Transmitiendo en la nube...' : 'Transmitir Alerta Push Masiva'}
                </button>
              </div>
            </div>

            {/* Lista de Notificaciones Activas */}
            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {n.badge || 'ALERTA'}
                      </span>
                      <span className="text-xs font-bold text-white">{n.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-1">{n.message}</p>
                    <span className="text-[10px] text-slate-500">
                      {n.date} • {n.author || 'Dr. Carlos Leal'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {events.map((evt: any) => (
              <div key={evt.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 block">{evt.title}</span>
                  <p className="text-xs text-slate-300">{evt.detail}</p>
                  <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-300">
                  {evt.device}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

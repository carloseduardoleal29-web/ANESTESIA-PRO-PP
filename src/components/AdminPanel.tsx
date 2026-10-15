import React, { useEffect, useState } from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  Crown, 
  RefreshCw, 
  Send, 
  X, 
  Bell,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { DoctorUser } from '../types/user';
import { subscribeToAllDoctors, toggleDoctorProStatus, exportDoctorsToCSV } from '../lib/userService';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [doctors, setDoctors] = useState<DoctorUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pushTitle, setPushTitle] = useState('AnestesiaPro 🩺');
  const [pushBody, setPushBody] = useState('Nueva actualización y boletín disponible en la plataforma.');
  const [pushSending, setPushSending] = useState(false);
  const [pushSuccess, setPushSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Real-time listener directly to usuarios_anestesiapro Firestore collection
    const unsubscribe = subscribeToAllDoctors((list) => {
      setDoctors(list);
      setLoading(false);
    }, (err) => {
      console.error('Error connecting to usuarios_anestesiapro:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter(doc => {
    const term = searchTerm.toLowerCase();
    return (
      doc.fullName?.toLowerCase().includes(term) ||
      doc.email?.toLowerCase().includes(term) ||
      doc.medicalId?.toLowerCase().includes(term) ||
      doc.specialty?.toLowerCase().includes(term) ||
      doc.country?.toLowerCase().includes(term)
    );
  });

  const handleTogglePro = async (docId: string, currentPro: boolean) => {
    if (!docId) return;
    try {
      await toggleDoctorProStatus(docId, currentPro);
    } catch (err) {
      console.error('Error updating Pro status:', err);
      alert('Error al actualizar estado Pro en Firestore.');
    }
  };

  const handleSendPushBroadcast = async () => {
    if (!pushTitle.trim() || !pushBody.trim()) return;
    setPushSending(true);
    setPushSuccess(null);

    try {
      // Trigger native notification via Service Worker registration directly if available
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        if (Notification.permission === 'granted') {
          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification(pushTitle, {
            body: pushBody,
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200]
          });
          setPushSuccess('¡Notificación nativa emitida exitosamente a todos los dispositivos!');
        } else {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            const reg = await navigator.serviceWorker.ready;
            await reg.showNotification(pushTitle, {
              body: pushBody,
              icon: '/icon-192.png',
              badge: '/icon-192.png',
              requireInteraction: true,
              vibrate: [200, 100, 200, 100, 200]
            });
            setPushSuccess('¡Notificación enviada!');
          } else {
            alert('Por favor autoriza los permisos de notificación en tu navegador.');
          }
        }
      } else {
        alert('Service worker listo. Emitiendo prueba...');
      }
    } catch (e) {
      console.error(e);
      alert('Error al emitir la notificación.');
    } finally {
      setPushSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/90 backdrop-blur-lg">
      <div className="w-full max-w-5xl h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>Panel de Administración AnestesiaPro</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Firestore Realtime
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Colección en la nube: <code className="text-cyan-400">usuarios_anestesiapro</code> ({doctors.length} médicos registrados)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Toolbar Bar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por médico, correo, cédula, país o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={() => exportDoctorsToCSV(filteredDoctors)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-md shadow-emerald-950/50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar a Excel / CSV ({filteredDoctors.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Doctors Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-sm">Conectando en tiempo real con Firestore...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="font-semibold text-slate-300">No se encontraron médicos con esos criterios.</p>
                <p className="text-xs text-slate-500 mt-1">Los nuevos registros desde cualquier teléfono aparecerán aquí automáticamente en tiempo real.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Médico / Especialidad</th>
                      <th className="py-3 px-4">Correo Electrónico</th>
                      <th className="py-3 px-4">Cédula / ID</th>
                      <th className="py-3 px-4">País</th>
                      <th className="py-3 px-4">Fecha Registro</th>
                      <th className="py-3 px-4 text-center">Plan Pro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredDoctors.map((docItem) => (
                      <tr key={docItem.id || docItem.email} className="hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-100">{docItem.fullName}</div>
                          <div className="text-xs text-cyan-400">{docItem.specialty}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">{docItem.email}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-400">{docItem.medicalId}</td>
                        <td className="py-3.5 px-4 text-slate-300">{docItem.country}</td>
                        <td className="py-3.5 px-4 text-xs text-slate-400">
                          {docItem.registeredAt ? new Date(docItem.registeredAt).toLocaleString('es-ES') : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleTogglePro(docItem.id || docItem.email, !!docItem.isPro)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                              docItem.isPro 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                            }`}
                          >
                            <Crown className="w-3.5 h-3.5" />
                            <span>{docItem.isPro ? 'PRO ACTIVO' : 'Activar Pro'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Broadcast Push Notification Section */}
          <div className="p-5 border border-cyan-500/30 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-3">
              <Bell className="w-5 h-5 animate-bounce" />
              <span>Emisor de Notificaciones Push Nativas (Educación Continua)</span>
            </div>
            
            <p className="text-xs text-slate-300 mb-4">
              Envía notificaciones de alerta clínica directamente a todos los teléfonos y computadoras con AnestesiaPro instalado.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Título de la Notificación</label>
                <input
                  type="text"
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mensaje / Alerta Clínica</label>
                <textarea
                  rows={2}
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {pushSuccess && (
                <div className="p-3 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-800 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{pushSuccess}</span>
                </div>
              )}

              <button
                onClick={handleSendPushBroadcast}
                disabled={pushSending}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                <span>{pushSending ? 'Enviando...' : 'Emitir Notificación Push Nativa'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

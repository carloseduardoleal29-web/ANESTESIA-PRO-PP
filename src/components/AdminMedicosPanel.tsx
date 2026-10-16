import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Download, ShieldCheck, RefreshCw, X, FileSpreadsheet, 
  Globe, Mail, Phone, Calendar, Smartphone, Trash2, CheckCircle2, ArrowLeft, Lock
} from 'lucide-react';
import { db, collection, onSnapshot, query, orderBy, getDocs } from '../lib/firebase';

interface MedicoRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  registeredAt?: string;
  device?: string;
  createdAt?: any;
}

interface AdminMedicosPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMedicosPanel: React.FC<AdminMedicosPanelProps> = ({ isOpen, onClose }) => {
  const [medicos, setMedicos] = useState<MedicoRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real-time Firestore snapshot listener for collection "medicos_registrados"
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setErrorMsg(null);

    let unsubscribe: (() => void) | null = null;
    try {
      const colRef = collection(db, 'medicos_registrados');
      const q = query(colRef, orderBy('registeredAt', 'desc'));

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: MedicoRecord[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as MedicoRecord;
            list.push({
              id: docSnap.id,
              fullName: data.fullName || 'Sin nombre',
              email: data.email || 'Sin correo',
              phone: data.phone || 'No especificado',
              country: data.country || 'Venezuela',
              registeredAt: data.registeredAt || new Date().toISOString(),
              device: data.device || 'Dispositivo móvil'
            });
          });
          setMedicos(list);
          setLoading(false);
        },
        (err) => {
          console.warn('[AnestesiaPro Admin] Realtime listener notice:', err);
          // Fallback to getDocs if orderBy fails due to missing index
          getDocs(colRef)
            .then((snap) => {
              const list: MedicoRecord[] = [];
              snap.forEach((docSnap) => {
                const data = docSnap.data() as MedicoRecord;
                list.push({
                  id: docSnap.id,
                  fullName: data.fullName || 'Sin nombre',
                  email: data.email || 'Sin correo',
                  phone: data.phone || 'No especificado',
                  country: data.country || 'Venezuela',
                  registeredAt: data.registeredAt || new Date().toISOString(),
                  device: data.device || 'Dispositivo móvil'
                });
              });
              setMedicos(list);
            })
            .catch((e) => setErrorMsg('Error al conectar con Firestore: ' + e.message))
            .finally(() => setLoading(false));
        }
      );
    } catch (e: any) {
      setErrorMsg('Error inicializando Firestore: ' + e.message);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isOpen]);

  // Filtered list based on search query (name, email, country)
  const filteredMedicos = medicos.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.country && m.country.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q))
    );
  });

  // Export to CSV
  const handleExportCSV = () => {
    try {
      const headers = ['Nombre Completo', 'Correo Electrónico', 'Teléfono', 'País', 'Fecha y Hora', 'Dispositivo'];
      const rows = filteredMedicos.map(m => [
        `"${(m.fullName || '').replace(/"/g, '""')}"`,
        `"${(m.email || '').replace(/"/g, '""')}"`,
        `"${(m.phone || '').replace(/"/g, '""')}"`,
        `"${(m.country || '').replace(/"/g, '""')}"`,
        `"${new Date(m.registeredAt || Date.now()).toLocaleString('es-VE')}"`,
        `"${(m.device || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Medicos_Registrados_AnestesiaPro_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Error al exportar CSV.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn">
      <div className="max-w-7xl mx-auto w-full bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto min-h-[85vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 p-4 sm:p-6 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                Panel de Administrador • Médicos Registrados
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-mono uppercase">
                  En Vivo • Firebase Firestore
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Control central de profesionales de la salud en AnestesiaPro (Colección: <code className="text-cyan-300 font-mono">medicos_registrados</code>)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={medicos.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              title="Exportar lista a CSV / Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Excel / CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-700"
              title="Cerrar panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Stats Counter */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-cyan-500/30 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
              <Users className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Registrados</span>
                <span className="text-lg font-black text-cyan-300 font-mono">{medicos.length}</span>
              </div>
            </div>
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, correo, país o teléfono..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto p-4 sm:p-6 bg-slate-950">
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Sincronizando registros en tiempo real desde Firestore...</p>
            </div>
          ) : errorMsg ? (
            <div className="py-16 text-center space-y-3 max-w-md mx-auto bg-rose-950/30 border border-rose-500/40 rounded-2xl p-6">
              <span className="text-3xl">⚠️</span>
              <h3 className="text-sm font-bold text-rose-300">Aviso de conexión</h3>
              <p className="text-xs text-slate-300">{errorMsg}</p>
            </div>
          ) : filteredMedicos.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No se encontraron médicos registrados</h3>
              <p className="text-xs text-slate-500">
                {searchQuery ? 'Prueba con otro término de búsqueda.' : 'Los registros aparecerán aquí automáticamente en tiempo real.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Nombre Completo</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4">Teléfono</th>
                  <th className="py-3 px-4">País</th>
                  <th className="py-3 px-4">Fecha y Hora de Registro</th>
                  <th className="py-3 px-4">Dispositivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredMedicos.map((m, idx) => (
                  <tr key={m.id || idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-black text-xs shrink-0">
                        {(m.fullName || 'M').charAt(0).toUpperCase()}
                      </div>
                      <span>{m.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-cyan-300 font-mono">
                      <a href={`mailto:${m.email}`} className="hover:underline flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        {m.email}
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">
                      {m.phone ? (
                        <a href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {m.phone}
                        </a>
                      ) : 'No especificado'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300 font-medium flex items-center gap-1.5 w-fit">
                        <Globe className="w-3.5 h-3.5 text-cyan-400" />
                        {m.country}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{new Date(m.registeredAt || Date.now()).toLocaleString('es-VE')}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                        {m.device}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Actualización en tiempo real mediante Firestore Snapshot listeners.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cerrar Panel
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, Users, Download, ShieldAlert, ArrowLeft, RefreshCw, Calendar, Smartphone, Mail, Phone, Globe } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MedicoRegistrado } from '../types';

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [medicos, setMedicos] = useState<MedicoRegistrado[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'medicos_registrados'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: MedicoRegistrado[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as MedicoRegistrado);
      });
      setMedicos(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'medicos_registrados');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMedicos = medicos.filter(m => 
    m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ['Nombre Completo', 'Correo Electrónico', 'Teléfono', 'País', 'Dispositivo', 'Fecha Registro'];
    const rows = filteredMedicos.map(m => [
      `"${m.fullName || ''}"`,
      `"${m.email || ''}"`,
      `"${m.phone || ''}"`,
      `"${m.country || ''}"`,
      `"${m.deviceInfo || ''}"`,
      `"${m.createdAt || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medicos_registrados_anestesiapro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-1">
                Panel de Administrador en Vivo
              </div>
              <h1 className="text-2xl font-bold text-white">Médicos Registrados en AnestesiaPro</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-emerald-600/30 transition-colors w-full md:w-auto justify-center"
            >
              <Download className="w-4 h-4" /> Exportar a CSV / Excel
            </button>
          </div>
        </div>

        {/* Stats & Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-400">Total Registrados</div>
              <div className="text-2xl font-bold text-white">{medicos.length} médicos</div>
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o país..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Table Data */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Médico / Título</th>
                  <th className="p-4">Correo Electrónico</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4">País</th>
                  <th className="p-4">Dispositivo</th>
                  <th className="p-4">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" /> Cargando registros en tiempo real...
                    </td>
                  </tr>
                ) : filteredMedicos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      No se encontraron registros en Firestore.
                    </td>
                  </tr>
                ) : (
                  filteredMedicos.map((medico) => (
                    <tr key={medico.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-semibold text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" /> {medico.fullName}
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {medico.email}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {medico.phone || 'N/D'}</span>
                      </td>
                      <td className="p-4 text-slate-300">
                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-slate-400" /> {medico.country}</span>
                      </td>
                      <td className="p-4 text-xs text-slate-400 truncate max-w-[150px]" title={medico.deviceInfo}>
                        {medico.deviceInfo || 'Web'}
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {medico.createdAt ? new Date(medico.createdAt).toLocaleString() : 'N/D'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

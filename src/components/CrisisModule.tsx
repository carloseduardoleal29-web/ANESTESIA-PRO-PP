import React from 'react';
import { AlertTriangle, Flame, ShieldAlert } from 'lucide-react';

export const CrisisModule: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-400/30 text-rose-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <AlertTriangle className="w-3.5 h-3.5" /> Manejo de Crisis
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Algoritmos de Emergencia en Quirófano</h1>
        <p className="text-slate-300 text-sm">Hipertermia maligna, anafilaxia, paro cardíaco y toxicidad por anestésicos locales.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
            <Flame className="w-5 h-5" /> Hipertermia Maligna
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Suspender agentes desencadenantes de inmediato, hiperventilar con 100% O₂, administrar Dantroleno sódico (2.5 mg/kg IV) y enfriamiento activo.
          </p>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-3">
          <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Toxicidad por Anestésicos Locales (LAST)
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Manejo de vía aérea, soporte vital avanzado y administración precoz de Emulsión Lipídica al 20% (bolus 1.5 mL/kg seguido de infusión).
          </p>
        </div>
      </div>
    </div>
  );
};

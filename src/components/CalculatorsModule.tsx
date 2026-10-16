import React, { useState } from 'react';
import { Calculator, Activity } from 'lucide-react';

export const CalculatorsModule: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [dose, setDose] = useState('2');

  const calculatedResult = Number(weight) * Number(dose);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" /> Calculadoras Anestésicas
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Dosificación y Parámetros</h1>
        <p className="text-slate-300 text-sm">Cálculos rápidos y seguros para infusión y bolos intravenosos.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl shadow-xl space-y-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Cálculo de Dosis por Peso
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">Peso del Paciente (kg)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Dosis (mg/kg)</label>
            <input
              type="number"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
            />
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400">Dosis Total Sugerida</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{calculatedResult.toFixed(2)} mg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Activity } from 'lucide-react';

interface Props {
  weight: number;
  idealWeight: number;
}

export function InfusionCalculator({ weight, idealWeight }: Props) {
  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">CALCULADORA DE INFUSIONES CONTINUAS, TIVA & VASOPRESORES</h3>
          <p className="text-xs text-slate-400">Velocidad de bomba en ml/h según parámetros de {weight} kg (Peso Real) y {idealWeight} kg (Peso Ideal).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Noradrenalina */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-purple-400">Noradrenalina</h4>
          <p className="text-xs text-slate-400">Dilución Estándar: 4mg en 250ml Solución (16 mcg/ml)</p>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">0.05 mcg/kg/min:</span>
              <strong className="text-purple-300">{((weight * 0.05 * 60) / 16).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">0.10 mcg/kg/min:</span>
              <strong className="text-purple-300">{((weight * 0.1 * 60) / 16).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">0.20 mcg/kg/min:</span>
              <strong className="text-purple-300">{((weight * 0.2 * 60) / 16).toFixed(1)} ml/h</strong>
            </div>
          </div>
        </div>

        {/* Propofol TIVA */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-cyan-400">Propofol 1% TIVA</h4>
          <p className="text-xs text-slate-400">Concentración: 10 mg/ml</p>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">6 mg/kg/h:</span>
              <strong className="text-cyan-300">{((weight * 6) / 10).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">8 mg/kg/h:</span>
              <strong className="text-cyan-300">{((weight * 8) / 10).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">10 mg/kg/h:</span>
              <strong className="text-cyan-300">{((weight * 10) / 10).toFixed(1)} ml/h</strong>
            </div>
          </div>
        </div>

        {/* Remifentanilo */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <h4 className="text-sm font-bold text-blue-400">Remifentanilo TIVA</h4>
          <p className="text-xs text-slate-400">Dilución: 2mg en 100ml Solución (20 mcg/ml)</p>
          <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">0.10 mcg/kg/min:</span>
              <strong className="text-blue-300">{((idealWeight * 0.1 * 60) / 20).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">0.20 mcg/kg/min:</span>
              <strong className="text-blue-300">{((idealWeight * 0.2 * 60) / 20).toFixed(1)} ml/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">0.30 mcg/kg/min:</span>
              <strong className="text-blue-300">{((idealWeight * 0.3 * 60) / 20).toFixed(1)} ml/h</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

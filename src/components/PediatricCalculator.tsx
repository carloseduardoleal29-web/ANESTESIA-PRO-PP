import React from 'react';
import { Baby } from 'lucide-react';

interface Props {
  weight: number;
  age: number;
}

export function PediatricCalculator({ weight, age }: Props) {
  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
          <Baby className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white">CÁLCULOS Y PARÁMETROS PEDIÁTRICOS</h3>
          <p className="text-xs text-slate-400">Referencia rápida de tubo endotraqueal, profundidad y reanimación para {age} años / {weight} kg.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Tubo Endotraqueal (con balón)</span>
          <span className="text-lg font-bold text-amber-300">
            {age >= 1 ? (age / 4 + 3.5).toFixed(1) : '3.0 - 3.5'} mm
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Fórmula: (Edad / 4) + 3.5</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Profundidad en Comisura</span>
          <span className="text-lg font-bold text-amber-300">
            {age >= 1 ? (age / 2 + 12).toFixed(1) : '9.0 - 10.0'} cm
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Fórmula: (Edad / 2) + 12</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Volumen Corriente (Vt)</span>
          <span className="text-lg font-bold text-amber-300">
            {(weight * 6).toFixed(0)} - {(weight * 8).toFixed(0)} ml
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Metodología 6 a 8 ml/kg</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">Desfibrilación Pediátrica</span>
          <span className="text-lg font-bold text-amber-300">
            {(weight * 2).toFixed(0)} J / {(weight * 4).toFixed(0)} J
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Carga inicial 2 J/kg • Subsiguiente 4 J/kg</span>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { AlertTriangle, ShieldAlert, HeartPulse, Activity } from 'lucide-react';

interface Props {
  weight: number;
}

export function EmergencyProtocols({ weight }: Props) {
  return (
    <div className="space-y-6">
      {/* LAST Protocol */}
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">PROTOCOLO LAST: TOXICIDAD SISTÉMICA POR ANESTÉSICOS LOCALES</h3>
            <p className="text-xs text-slate-400">Emulsión Lipídica al 20% (Intralipid) • Dosis de emergencia para {weight} kg.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-rose-400 block mb-1">1. Bolus Inicial (1.5 ml/kg)</strong>
            <p className="text-white text-base font-bold">{(weight * 1.5).toFixed(0)} ml IV</p>
            <span className="text-slate-400 text-[10px] block mt-1">Administrar en 1 minuto. Repetir 1 o 2 veces si persiste inestabilidad.</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-rose-400 block mb-1">2. Infusión Continua (0.25 ml/kg/min)</strong>
            <p className="text-white text-base font-bold">{(weight * 0.25 * 60).toFixed(0)} ml/h</p>
            <span className="text-slate-400 text-[10px] block mt-1">Mantener hasta estabilización hemodinámica y neurológica.</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
            <strong className="text-rose-400 block mb-1">3. Dosis Máxima Acumulada</strong>
            <p className="text-white text-base font-bold">{(weight * 12).toFixed(0)} ml</p>
            <span className="text-slate-400 text-[10px] block mt-1">Límite superior de 12 ml/kg en las primeras 24 horas.</span>
          </div>
        </div>
      </div>

      {/* CPPD Protocol */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">PROTOCOLO CPPD: AMINOFILINA + DIPIRONA EN CEFALEA POST PUNCIÓN DURAL</h3>
            <p className="text-xs text-slate-400">Tratamiento conservador para evitar Parche Hemático Epidural (PHE).</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
          <strong className="text-emerald-400 block text-sm">Dosis Calculada para el Paciente ({weight} kg):</strong>
          <p className="text-slate-200">
            • <strong>Aminofilina:</strong> <span className="text-emerald-300 font-bold">{(weight * 1.5).toFixed(0)} mg IV</span> (Dosis de 1.5 mg/kg en 250ml Sol. Fisiológica pasar lento en 45-60 min).
          </p>
          <p className="text-slate-200">
            • <strong>Dipirona (Metamizol):</strong> <span className="text-emerald-300 font-bold">1g a 2g IV</span> cada 6 a 8 horas.
          </p>
          <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
            Mecanismo: La aminofilina antagoniza los receptores de adenosina provocando vasoconstricción cerebral y estimulando la secreción de LCR en plexos coroideos.
          </p>
        </div>
      </div>
    </div>
  );
}

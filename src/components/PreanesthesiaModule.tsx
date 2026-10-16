import React, { useState } from 'react';
import { Activity, ShieldCheck, FileText, CheckCircle2, User, Stethoscope } from 'lucide-react';

export const PreanesthesiaModule: React.FC = () => {
  const [patientName, setPatientName] = useState('');
  const [asaScore, setAsaScore] = useState('ASA II');
  const [airwayMallampati, setAirwayMallampati] = useState('Mallampati II');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
          <Stethoscope className="w-3.5 h-3.5" /> Evaluación Preanestésica
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Evaluación y Riesgo Quirúrgico</h1>
        <p className="text-slate-300 text-sm max-w-2xl">
          Protocolo integral de valoración preoperatoria, estratificación ASA, vía aérea y preparación anestésica basada en guías clínicas 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" /> Datos del Paciente
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">Nombre del Paciente</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400">Clasificación ASA</label>
                <select
                  value={asaScore}
                  onChange={(e) => setAsaScore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                >
                  <option>ASA I</option>
                  <option>ASA II</option>
                  <option>ASA III</option>
                  <option>ASA IV</option>
                  <option>ASA V</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Mallampati</label>
                <select
                  value={airwayMallampati}
                  onChange={(e) => setAirwayMallampati(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                >
                  <option>Mallampati I</option>
                  <option>Mallampati II</option>
                  <option>Mallampati III</option>
                  <option>Mallampati IV</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" /> Resumen de Evaluación
          </h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-sm text-slate-300">
            <div><strong className="text-white">Paciente:</strong> {patientName || 'No especificado'}</div>
            <div><strong className="text-white">Riesgo ASA:</strong> {asaScore}</div>
            <div><strong className="text-white">Vía Aérea:</strong> {airwayMallampati}</div>
            <div className="pt-2 border-t border-slate-800 text-cyan-400 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4" /> Protocolo preoperatorio verificado
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

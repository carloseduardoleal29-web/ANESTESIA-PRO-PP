import React, { useState } from 'react';
import { BookOpen, Search, Pill, ShieldAlert } from 'lucide-react';

export function VademecumModal() {
  const [search, setSearch] = useState('');

  const drugs = [
    { name: 'Propofol 1%', group: 'Anestésico IV / Hipnótico', dose: '1.5 - 2.5 mg/kg IV', onset: '30 - 45 seg', duration: '5 - 10 min', notes: 'Hipotensión por vasodilatación. Dolor a la inyección. Hipnótico de elección en TIVA.' },
    { name: 'Etomidato', group: 'Hipnótico Cardioestable', dose: '0.2 - 0.3 mg/kg IV', onset: '15 - 45 seg', duration: '3 - 12 min', notes: 'Ideal en compromiso hemodinámico. Supresión corticosuprarrenal transitoria.' },
    { name: 'Ketamina', group: 'Anestésico Disociativo', dose: '1 - 2 mg/kg IV • 4 - 6 mg/kg IM', onset: '30 seg IV', duration: '15 - 30 min', notes: 'Efecto broncodilatador. Preserva impulso respiratorio. Produce taquicardia/hipertensión.' },
    { name: 'Fentanilo', group: 'Opioide Sintético', dose: '2 - 5 mcg/kg IV', onset: '2 - 3 min', duration: '30 - 60 min', notes: 'Potente analgesia intraoperatoria. Rigidez de pared torácica en bolos rápidos.' },
    { name: 'Remifentanilo', group: 'Opioide de Acción Ultra-Corta', dose: '0.05 - 0.5 mcg/kg/min TIVA', onset: '1 min', duration: '3 - 5 min', notes: 'Metabolizado por esterasas inespecíficas. Sin acumulación renal ni hepática.' },
    { name: 'Rocuronio', group: 'Relajante Muscular No Despolarizante', dose: '0.6 mg/kg Estándar • 1.2 mg/kg ISR', onset: '60 - 90 seg', duration: '30 - 45 min', notes: 'Específicamente reversible con Sugammadex.' },
    { name: 'Sugammadex', group: 'Agente Reversor Selectivo', dose: '2 mg/kg (TOF 2) • 16 mg/kg (Emergencia CICO)', onset: '1.5 - 3 min', duration: 'Permanente', notes: 'Encapsulación directa del Rocuronio y Vecuronio.' },
    { name: 'Aminofilina', group: 'Xantina / Antagonista Adenosina', dose: '1 - 1.5 mg/kg IV lento (45-60 min)', onset: '15 - 30 min', duration: '6 - 8 h', notes: 'Tratamiento de Cefalea Post Punción Dural (CPPD). Estimula LCR y vasodilatación cerebral.' },
    { name: 'Dipirona (Metamizol)', group: 'Analgésico / Antipirético', dose: '1 - 2 g IV cada 6-8h', onset: '15 min', duration: '6 h', notes: 'Complemento de Aminofilina en CPPD. Administrar lento para evitar hipotensión.' },
    { name: 'Noradrenalina', group: 'Vasopresor Alfa-1 Agonista', dose: '0.02 - 0.5 mcg/kg/min', onset: '1 - 2 min', duration: '1 - 2 min', notes: 'Primera elección en shock hemodinámico o vasodilatación por anestéticos.' },
    { name: 'Bupivacaína 0.5%', group: 'Anestésico Local Amida', dose: 'Máx 2 mg/kg sin Epi • 2.5 mg/kg con Epi', onset: '10 - 20 min', duration: '3 - 6 h', notes: 'Anestesia neuroaxial y bloqueos. En cardiotoxicidad accidental usar Intralipid 20%.' }
  ];

  const filtered = drugs.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.group.toLowerCase().includes(search.toLowerCase()) ||
      d.notes.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">VADEMÉCUM FARMACOLÓGICO EN ANESTESIA</h3>
            <p className="text-xs text-slate-400">Base de datos farmacológica completa para quirófano.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar fármaco o indicación..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-cyan-300 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5 text-cyan-400" />
                {item.name}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">{item.group}</span>
            </div>
            <p className="text-xs text-slate-300"><strong>Dosis:</strong> {item.dose}</p>
            <p className="text-xs text-slate-400"><strong>Inicio:</strong> {item.onset} • <strong>Duración:</strong> {item.duration}</p>
            <p className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded border border-slate-800/80 leading-relaxed">{item.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

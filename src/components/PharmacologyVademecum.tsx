import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, AlertCircle, Info, Scale, Check, ChevronDown, Sparkles } from 'lucide-react';

interface Props {
  patientWeight: number;
  patientIdealWeight: number;
}

interface DrugItem {
  id: string;
  name: string;
  category: string;
  presentation: string;
  inductionDose: string;
  perKgDoseMin: number;
  perKgDoseMax: number;
  weightType: 'real' | 'ideal' | 'fixed';
  unit: 'mg' | 'mcg' | 'g';
  latency: string;
  duration: string;
  metabolism: string;
  notes: string;
  contraindications: string;
}

const DRUGS_DATA: DrugItem[] = [
  {
    id: 'propofol',
    name: 'Propofol 1%',
    category: 'Hipnótico',
    presentation: 'Ampolla 200 mg / 20 ml (10 mg/ml) o Frasco 50 ml',
    inductionDose: '1.5 - 2.5 mg/kg',
    perKgDoseMin: 1.5,
    perKgDoseMax: 2.5,
    weightType: 'real',
    unit: 'mg',
    latency: '30 - 45 segundos',
    duration: '5 - 10 minutos',
    metabolism: 'Hepático rápido y aclaramiento pulmonar extrahepático',
    notes: 'Produce vasodilatación arterial y depresión miocárdica. Dolor a la inyección (pre-tratar con Lidocaína).',
    contraindications: 'Alergia severa al huevo/soya (anafilaxia previa), inestabilidad hemodinámica extrema no resucitada.'
  },
  {
    id: 'etomidato',
    name: 'Etomidato',
    category: 'Hipnótico',
    presentation: 'Ampolla 20 mg / 10 ml (2 mg/ml)',
    inductionDose: '0.2 - 0.3 mg/kg',
    perKgDoseMin: 0.2,
    perKgDoseMax: 0.3,
    weightType: 'real',
    unit: 'mg',
    latency: '15 - 30 segundos',
    duration: '5 - 12 minutos',
    metabolism: 'Esterasas plasmáticas y hepáticas',
    notes: 'Gran estabilidad hemodinámica. Fármaco de elección en cardiopatías o shock.',
    contraindications: 'Inhibe la 11-beta-hidroxilasa (supresión suprarrenal transitoria), mioclonías frecuentes si no se preoxigena/premedica.'
  },
  {
    id: 'ketamina',
    name: 'Ketamina (Ketalar)',
    category: 'Hipnótico / Disociativo',
    presentation: 'Frasco ampolla 500 mg / 10 ml (50 mg/ml)',
    inductionDose: '1.0 - 2.0 mg/kg IV',
    perKgDoseMin: 1.0,
    perKgDoseMax: 2.0,
    weightType: 'real',
    unit: 'mg',
    latency: '30 - 60 segundos',
    duration: '15 - 25 minutos',
    metabolism: 'Hepático a norketamina (metabolito activo)',
    notes: 'Preserva reflejos protectores de vía aérea y drive respiratorio. Broncodilatador potente.',
    contraindications: 'Hipertensión intracraneal descompensada, patología coronaria inestable, psicosis activa.'
  },
  {
    id: 'fentanilo',
    name: 'Fentanilo',
    category: 'Opioide',
    presentation: 'Ampolla 500 mcg / 10 ml (50 mcg/ml) o 100 mcg / 2 ml',
    inductionDose: '2 - 4 mcg/kg IV (Inducción)',
    perKgDoseMin: 2,
    perKgDoseMax: 4,
    weightType: 'ideal',
    unit: 'mcg',
    latency: '2 - 3 minutos',
    duration: '30 - 45 minutos',
    metabolism: 'Hepático vía CYP3A4 a norfentanilo inactivo',
    notes: 'Atenúa la respuesta simpática a la laringoscopia. Tórax leñoso con bolos rápidos muy elevados.',
    contraindications: 'Depresión respiratoria previa sin vía aérea asegurada, miastenia gravis no controlada.'
  },
  {
    id: 'remifentanilo_v',
    name: 'Remifentanilo',
    category: 'Opioide',
    presentation: 'Frasco ampolla 1 mg, 2 mg o 5 mg liofilizado',
    inductionDose: '1 mcg/kg bolo (opcional) / Infusión 0.1-0.3 mcg/kg/min',
    perKgDoseMin: 0.5,
    perKgDoseMax: 1.0,
    weightType: 'ideal',
    unit: 'mcg',
    latency: '1 - 2 minutos',
    duration: '3 - 8 minutos',
    metabolism: 'Esterasas tisulares e inespecíficas sanguíneas',
    notes: 'Context-sensitive half time de ~3 min independiente de la duración de la infusión.',
    contraindications: 'No usar como anestesia epidural o intratecal (contiene glicina).'
  },
  {
    id: 'rocuronio',
    name: 'Rocuronio (Esmeron)',
    category: 'Bloqueador Neuromuscular',
    presentation: 'Ampolla 50 mg / 5 ml (10 mg/ml)',
    inductionDose: '0.6 mg/kg (Estándar) / 1.2 mg/kg (ISR)',
    perKgDoseMin: 0.6,
    perKgDoseMax: 1.2,
    weightType: 'real',
    unit: 'mg',
    latency: '60 - 90 seg (o 45-60 seg con 1.2 mg/kg)',
    duration: '35 - 50 minutos',
    metabolism: 'Excreción biliar y renal (70% sin cambios)',
    notes: 'Alternativa número 1 a la succinilcolina para ISR por tener reversor específico instantáneo (Sugammadex).',
    contraindications: 'Alergia conocida a aminoesteroides.'
  },
  {
    id: 'succinilcolina_v',
    name: 'Succinilcolina (Quelicin)',
    category: 'Bloqueador Despolarizante',
    presentation: 'Ampolla 100 mg / 2 ml o frasco 500 mg',
    inductionDose: '1.0 - 1.5 mg/kg IV',
    perKgDoseMin: 1.0,
    perKgDoseMax: 1.5,
    weightType: 'real',
    unit: 'mg',
    latency: '30 - 60 segundos',
    duration: '6 - 10 minutos',
    metabolism: 'Pseudocolinesterasa plasmática (butirilcolinesterasa)',
    notes: 'Fasciculaciones musculares. Aumenta presión intracraneal, intragástrica e intraocular.',
    contraindications: 'Hipertermia Maligna (antecedente personal/familiar), gran quemado > 24h, denervación muscular, hipercaliemia.'
  },
  {
    id: 'sugammadex',
    name: 'Sugammadex (Bridion)',
    category: 'Reversión Neuromuscular',
    presentation: 'Vial 200 mg / 2 ml o 500 mg / 5 ml (100 mg/ml)',
    inductionDose: '2 mg/kg (TOF 2) / 4 mg/kg (PTC 1-2) / 16 mg/kg (Inmediata ISR)',
    perKgDoseMin: 2,
    perKgDoseMax: 4,
    weightType: 'real',
    unit: 'mg',
    latency: '1.5 - 2 minutos',
    duration: 'Permanente (quelación)',
    metabolism: 'Excreción renal del complejo inactivo intacto',
    notes: 'Encapsula rocuronio y vecuronio mediante anillo de ciclodextrina. Reversión completa en < 3 minutos.',
    contraindications: 'Interfiere con anticonceptivos orales durante los 7 días posteriores. Precaución en ERC terminal.'
  },
  {
    id: 'bupivacaina',
    name: 'Bupivacaína 0.5% (Pesada / Simple)',
    category: 'Anestésico Local',
    presentation: 'Ampolla 0.5% (5 mg/ml) pesada (con dextrosa al 8%) o isobárica',
    inductionDose: '10 - 15 mg (Raquídea) / Dosis máx: 2 mg/kg (2.5 con epinefrina)',
    perKgDoseMin: 1.5,
    perKgDoseMax: 2.0,
    weightType: 'ideal',
    unit: 'mg',
    latency: '2 - 5 minutos raquídea / 15-20 min epidural',
    duration: '120 - 240 minutos',
    metabolism: 'Hepático vía CYP3A4',
    notes: 'Alta cardiotoxicidad por bloqueo persistente de canales de sodio cardíacos en sístole. Antídoto: Emulsión Lipídica al 20%.',
    contraindications: 'Inyección intravascular inadvertida, bloqueo auriculoventricular de alto grado.'
  },
  {
    id: 'ondansetron',
    name: 'Ondansetrón',
    category: 'Antiemético',
    presentation: 'Ampolla 4 mg / 2 ml o 8 mg / 4 ml',
    inductionDose: '4 - 8 mg IV al final de la cirugía',
    perKgDoseMin: 0.1,
    perKgDoseMax: 0.1,
    weightType: 'fixed',
    unit: 'mg',
    latency: '10 - 15 minutos',
    duration: '8 - 12 horas',
    metabolism: 'Hepático múltiple',
    notes: 'Antagonista 5-HT3 de serotonina. Excelente sinergia con Dexametasona 4-8 mg.',
    contraindications: 'Prolongación del intervalo QT congénita o adquirida severa.'
  }
];

export function PharmacologyVademecum({ patientWeight, patientIdealWeight }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDrugs = DRUGS_DATA.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', ...Array.from(new Set(DRUGS_DATA.map(d => d.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-cyan-400" />
            Vademécum Farmacológico de Anestesiología
          </h2>
          <p className="text-xs text-slate-400">
            Dosis clínicas exactas ajustadas al peso real ({patientWeight} kg) o ideal ({patientIdealWeight} kg) del paciente.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por fármaco o categoría..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Filtro por Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === c
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {c === 'all' ? 'Todos los Fármacos' : c}
          </button>
        ))}
      </div>

      {/* Lista de Fármacos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrugs.map(drug => {
          const usedWeight = drug.weightType === 'ideal' ? patientIdealWeight : patientWeight;
          const calculatedMin = drug.weightType === 'fixed'
            ? 4
            : Number((drug.perKgDoseMin * usedWeight).toFixed(0));
          const calculatedMax = drug.weightType === 'fixed'
            ? 8
            : Number((drug.perKgDoseMax * usedWeight).toFixed(0));

          return (
            <div key={drug.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                    {drug.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{drug.name}</h3>
                  <span className="text-xs text-slate-400">{drug.presentation}</span>
                </div>

                <div className="text-right bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 min-w-[120px]">
                  <span className="text-[10px] text-slate-400 block font-medium">Dosis para {usedWeight} kg</span>
                  <span className="text-base font-black text-cyan-300 font-mono">
                    {calculatedMin} - {calculatedMax} {drug.unit}
                  </span>
                  <span className="text-[9px] text-slate-500 block">
                    {drug.weightType === 'ideal' ? 'Peso Ideal' : drug.weightType === 'real' ? 'Peso Real' : 'Dosis Fija'}
                  </span>
                </div>
              </div>

              {/* Parámetros farmacocinéticos */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Latencia</span>
                  <span className="font-semibold text-slate-200">{drug.latency}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Duración</span>
                  <span className="font-semibold text-slate-200">{drug.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Metabolismo</span>
                  <span className="font-semibold text-slate-200 truncate block">{drug.metabolism}</span>
                </div>
              </div>

              {/* Indicaciones & Contraindicaciones */}
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-300">
                  <strong className="text-cyan-400">Clínica:</strong> {drug.notes}
                </p>
                <p className="text-rose-300/90 text-[11px]">
                  <strong className="text-rose-400">Contraindicaciones:</strong> {drug.contraindications}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

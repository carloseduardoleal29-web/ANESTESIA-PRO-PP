import React, { useState } from 'react';
import { 
  Calculator, Syringe, Flame, ArrowLeftRight, Activity, 
  Sparkles, ShieldCheck, Zap, Heart, Droplet, Search,
  Baby, Droplets, ChevronRight, LayoutGrid,
  Layers, CheckCircle2, FlaskConical, AlertTriangle, Shield,
  BadgeCheck, Compass, ArrowRight, Play, RefreshCw, Gauge,
  Scale, Wind, Brain, Sliders, Stethoscope
} from 'lucide-react';
import { TivaCalculatorTab } from './TivaCalculatorTab';
import { DrugInfusionTab } from './DrugInfusionTab';
import { UnitConverterTab } from './UnitConverterTab';
import { ClinicalScalesAndScoresTab } from './ClinicalScalesAndScoresTab';
import { PediatricCalculatorTab } from './PediatricCalculatorTab';
import { MablTransfusionTab } from './MablTransfusionTab';
import { CalculatorShareBanner } from './CalculatorShareBanner';

import pediatricCalcImg from '../../assets/images/pediatric_calc_cover_1793321097040.jpg';
import mablBloodImg from '../../assets/images/mabl_blood_cover_1793321112499.jpg';
import vasopressorPumpImg from '../../assets/images/vasopressor_pump_cover_1793321128705.jpg';
import tivaTciImg from '../../assets/images/tiva_tci_cover_1793321142254.jpg';
import airwayMacochaImg from '../../assets/images/airway_macocha_cover_1793321153732.jpg';
import converterPercentImg from '../../assets/images/converter_percent_cover_1793321170386.jpg';
import hemodynamicMonitorImg from '../../assets/images/hemodynamic_monitor_cover_1793321191503.jpg';
import converterElectrolytesImg from '../../assets/images/converter_electrolytes_cover_1793321204800.jpg';

export type CalculatorKey = 
  | 'overview'
  | 'pediatric'
  | 'mabl'
  | 'infusions_direct'
  | 'infusions_reverse'
  | 'infusions_pearls'
  | 'infusions_drip'
  | 'tiva'
  | 'converter_percent'
  | 'converter_ratios'
  | 'converter_dose'
  | 'converter_electrolytes'
  | 'scales_fluids'
  | 'scales_hemo'
  | 'scales_macocha'
  | 'scales_antropo';

interface CalculatorItem {
  key: CalculatorKey;
  title: string;
  shortName: string;
  description: string;
  category: string;
  badge: string;
  accentColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  imageUrl: string;
}

interface MedicalCalculatorsEliteModuleProps {
  initialCalculatorKey?: CalculatorKey;
}

export const MedicalCalculatorsEliteModule: React.FC<MedicalCalculatorsEliteModuleProps> = ({
  initialCalculatorKey
}) => {
  const [activeKey, setActiveKey] = useState<CalculatorKey>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const calcParam = params.get('calc') as CalculatorKey;
      const validKeys: CalculatorKey[] = [
        'pediatric', 'mabl', 'infusions_direct', 'infusions_reverse', 'infusions_pearls',
        'infusions_drip', 'tiva', 'converter_percent', 'converter_ratios', 'converter_dose',
        'converter_electrolytes', 'scales_fluids', 'scales_hemo', 'scales_macocha', 'scales_antropo'
      ];
      if (calcParam && validKeys.includes(calcParam)) {
        return calcParam;
      }
    }
    return initialCalculatorKey || 'overview';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allCalculators: CalculatorItem[] = [
    {
      key: 'pediatric',
      title: 'Pediatría & Vía Aérea Infantil',
      shortName: 'Pediatría & TOT',
      description: 'Calcula calibre de TET (Cole/Motoyama), pala de laringoscopio, distancia labial en cm, líquidos 4-2-1 y dosis PALS.',
      category: 'Pediatría',
      badge: '👶 PEDIATRÍA',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      icon: Baby,
      tag: 'TET Cole / PALS / 4-2-1',
      imageUrl: pediatricCalcImg
    },
    {
      key: 'mabl',
      title: 'Pérdida Sanguínea Permisible (MABL)',
      shortName: 'MABL & Sangrado',
      description: 'Fórmula de Gross con Hto/Hb meta, volemia según biotipo y protocolo de transfusión masiva 1:1:1.',
      category: 'Quirófano',
      badge: '🩸 SANGRE & MABL',
      accentColor: 'text-rose-400',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      icon: Droplets,
      tag: 'Fórmula Gross & Shock ATLS',
      imageUrl: mablBloodImg
    },
    {
      key: 'infusions_direct',
      title: 'Bombas Vasoactivos (Dosis ➔ ml/h)',
      shortName: 'Vasoactivos Bomba',
      description: 'Calcula la velocidad de infusión en ml/h a partir de la dosis prescrita en µg/kg/min o mg/h.',
      category: 'UCI & Bombas',
      badge: '⚡ BOMBAS DIRECTAS',
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      icon: Flame,
      tag: 'Noradrenalina / Adrenalina',
      imageUrl: vasopressorPumpImg
    },
    {
      key: 'infusions_reverse',
      title: 'Bomba Inversa (ml/h ➔ Dosis Real)',
      shortName: 'Bomba Inversa',
      description: 'Calcula al instante la dosis exacta en µg/kg/min que está recibiendo el paciente según los ml/h de la bomba.',
      category: 'UCI & Bombas',
      badge: '🔄 REGLA INVERSA',
      accentColor: 'text-amber-300',
      borderColor: 'border-amber-500/40 hover:border-amber-300',
      icon: RefreshCw,
      tag: 'Cálculo Real µg/kg/min',
      imageUrl: vasopressorPumpImg
    },
    {
      key: 'infusions_pearls',
      title: 'Perlas Clínicas (D5W vs SSN)',
      shortName: 'Perlas de Dilución',
      description: 'Por qué usar Dextrosa al 5% en catecolaminas para evitar oxidación ácida, estabilidad, pH y fotoprotección.',
      category: 'Farmacología',
      badge: '💎 PERLAS CLÍNICAS',
      accentColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/40 hover:border-yellow-300',
      icon: Sparkles,
      tag: 'pH, Soluciones & Fotoprotección',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'infusions_drip',
      title: 'Gotero & Constante K de Infusión',
      shortName: 'Gotero & Macrogotas',
      description: 'Calcula gotas/min para infusiones gravitacionales en macrogotero (20 gts/ml) y microgotero (60 gts/ml).',
      category: 'UCI & Bombas',
      badge: '⏱️ GOTEO GRAVEDAD',
      accentColor: 'text-emerald-300',
      borderColor: 'border-emerald-500/40 hover:border-emerald-300',
      icon: Activity,
      tag: 'Macrogotas / Microgotas',
      imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'tiva',
      title: 'TIVA & TCI Modelos Farmacocinéticos',
      shortName: 'TIVA & TCI Modelos',
      description: 'Modelos PK/PD Schnider/Marsh para Propofol y Minto para Remifentanilo ajustados por Masa Magra (LBM).',
      category: 'Anestesia IV',
      badge: '💉 TIVA / TCI PK-PD',
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/40 hover:border-indigo-400',
      icon: Syringe,
      tag: 'Propofol & Remifentanilo',
      imageUrl: tivaTciImg
    },
    {
      key: 'converter_percent',
      title: 'Porcentaje (%) a mg/ml & µg/ml',
      shortName: '% a mg/ml',
      description: 'Conversión directa de concentraciones al 0.5%, 1%, 2% a mg/ml y µg/ml para anestésicos locales.',
      category: 'Farmacología',
      badge: '📐 CONVERSIÓN %',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      icon: ArrowLeftRight,
      tag: 'Bupivacaína / Lidocaína',
      imageUrl: converterPercentImg
    },
    {
      key: 'converter_ratios',
      title: 'Ratios Adrenalina (1:1000 a 1:200k)',
      shortName: 'Ratios Adrenalina',
      description: 'Equivalencias y preparación de diluciones de adrenalina (1:1.000, 1:10.000, 1:100.000, 1:200.000).',
      category: 'Farmacología',
      badge: '🎯 RATIOS CIRUGÍA',
      accentColor: 'text-rose-300',
      borderColor: 'border-rose-400/40 hover:border-rose-300',
      icon: Zap,
      tag: '1:1.000 / 1:200.000',
      imageUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad4736f8?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'converter_dose',
      title: 'Conversor Dosis & Presiones',
      shortName: 'Dosis & Presiones',
      description: 'Convierte dosis ponderales (µg/kg/min ➔ mg/kg/h) y unidades de presión (cmH2O, mmHg, kPa, PSI).',
      category: 'Farmacología',
      badge: '⚖️ UNIDADES & PSI',
      accentColor: 'text-blue-400',
      borderColor: 'border-blue-500/40 hover:border-blue-400',
      icon: Gauge,
      tag: 'µg/kg/min / cmH2O / mmHg',
      imageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'converter_electrolytes',
      title: 'Calcio Corregido & Déficit de Sodio',
      shortName: 'Calcio & Sodio',
      description: 'Calcio corregido por albúmina y cálculo de déficit de sodio con volumen de infusión de NaCl 3%.',
      category: 'Electrolitos',
      badge: '🧪 ELECTROLITOS',
      accentColor: 'text-teal-300',
      borderColor: 'border-teal-500/40 hover:border-teal-300',
      icon: FlaskConical,
      tag: 'Albúmina / Salino 3%',
      imageUrl: converterElectrolytesImg
    },
    {
      key: 'scales_fluids',
      title: 'Balance Hídrico (4-2-1 & 3er Espacio)',
      shortName: 'Fluidos 4-2-1',
      description: 'Mantenimiento basal Holliday-Segar, déficit de ayuno preoperatorio y reposición de tercer espacio.',
      category: 'Quirófano',
      badge: '💧 AYUNO & FLUIDOS',
      accentColor: 'text-sky-400',
      borderColor: 'border-sky-500/40 hover:border-sky-400',
      icon: Droplet,
      tag: 'Holliday 4-2-1 & Cirugía',
      imageUrl: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'scales_hemo',
      title: 'Hemodinamia & Gasometría (Kirby)',
      shortName: 'Hemodinamia & Kirby',
      description: 'Presión Arterial Media (PAM), RVS, Shock Index e Índice de Kirby (PaO2/FiO2) para estadificación de SDRA.',
      category: 'UCI & Bombas',
      badge: '🫀 GASES & RVS',
      accentColor: 'text-red-400',
      borderColor: 'border-red-500/40 hover:border-red-400',
      icon: Heart,
      tag: 'PAM / Kirby PaFi / RVS',
      imageUrl: hemodynamicMonitorImg
    },
    {
      key: 'scales_macocha',
      title: 'MACOCHA (Vía Aérea UCI) & Scores',
      shortName: 'MACOCHA & Scores',
      description: 'Predicción de intubación difícil en UCI (MACOCHA), riesgo de náuseas/vómitos (Apfel) y SAHOS (STOP-BANG).',
      category: 'Escalas & Scores',
      badge: '🫁 VÍA AÉREA DIFÍCIL',
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      icon: Wind,
      tag: 'MACOCHA / qSOFA / STOP-BANG',
      imageUrl: airwayMacochaImg
    },
    {
      key: 'scales_antropo',
      title: 'Antropometría & Pesos Anestésicos',
      shortName: 'Antropometría',
      description: 'Cálculo de IMC, Superficie Corporal (Mosteller), Peso Ideal (Devine) y Peso Magro (Janmahasatian).',
      category: 'Escalas & Scores',
      badge: '📏 PESOS IDEAL/MAGRO',
      accentColor: 'text-indigo-300',
      borderColor: 'border-indigo-400/40 hover:border-indigo-300',
      icon: Scale,
      tag: 'IMC / Devine IBW / Janma LBW',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const categories = ['all', 'Pediatría', 'Quirófano', 'UCI & Bombas', 'Anestesia IV', 'Farmacología', 'Electrolitos', 'Escalas & Scores'];

  const filteredCalculators = allCalculators.filter(item => {
    const matchesSearch = searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* UNIFIED COMPACT HEADER & CONTROLS */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                Panel Élite
              </span>
              <span className="text-[11px] text-cyan-300 font-mono font-bold">
                Dr. Carlos Leal • Suite Clínica Oficial ({allCalculators.length} Herramientas)
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              Calculadoras Clínicas Especializadas
            </h2>
          </div>

          {/* SEARCH BOX */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar calculadora o droga..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* UNIFIED CATEGORY PILLS BAR */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-800/80 pt-2.5 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveKey('overview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
              activeKey === 'overview'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 border-cyan-300 font-black shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Ver Todas ({allCalculators.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                if (activeKey !== 'overview') setActiveKey('overview');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat && activeKey === 'overview'
                  ? 'bg-slate-800 text-cyan-300 border-cyan-400/80 font-bold'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Filtro: Todo' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW: COMPACT QUADRATIC BENTO GRID (ALL 15 CALCULATORS FIT COMPACTLY) */}
      {activeKey === 'overview' && (
        <div className="space-y-4">
          {/* GENERAL SUITE INVITATION & VIRAL GROWTH BANNER */}
          <CalculatorShareBanner
            isGeneralSuite={true}
            title="Suite Clínica de 15 Calculadoras Médicas"
            description="Suite integral de cálculos médicos para anestesiología, reanimación y medicina crítica desarrollada por el Dr. Carlos Leal."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredCalculators.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.key}
                  onClick={() => setActiveKey(item.key)}
                  className={`group cursor-pointer bg-slate-900 border ${item.borderColor} rounded-2xl overflow-hidden transition-all duration-200 shadow-md hover:shadow-xl flex flex-col justify-between relative hover:-translate-y-0.5 active:scale-95`}
                >
                  {/* QUADRATIC PHOTO HEADER (15 UNIQUE CLINICAL PHOTOS) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    {/* CATEGORY MICRO-BADGE */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between z-10">
                      <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-950/90 text-white border border-slate-700 backdrop-blur-md">
                        {item.badge}
                      </span>
                      <div className="w-5 h-5 rounded-md bg-slate-950/90 border border-slate-700 flex items-center justify-center text-white">
                        <IconComp className={`w-3 h-3 ${item.accentColor}`} />
                      </div>
                    </div>

                    {/* BOTTOM TAG */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 z-10">
                      <span className="text-[9px] font-bold text-cyan-300 line-clamp-1 drop-shadow">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* COMPACT CARD BODY WITH EXPLANATORY DESCRIPTION */}
                  <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 space-y-1.5">
                    <div>
                      <h3 className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors leading-tight line-clamp-2">
                        {item.title}
                      </h3>
                      
                      {/* BRIEF EXPLANATION FOR THE DOCTOR */}
                      <p className="text-[11px] text-slate-400 font-normal leading-tight mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-400 group-hover:text-slate-200">
                        Abrir
                      </span>
                      <ArrowRight className={`w-3 h-3 ${item.accentColor} group-hover:translate-x-0.5 transition-transform`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE CALCULATOR VIEW WITH CLEAN UNIFIED BACK / SELECTOR BAR & CONTEXTUAL SHARE BANNER */}
      {activeKey !== 'overview' && (() => {
        const currentCalc = allCalculators.find(c => c.key === activeKey);
        return (
          <div className="space-y-4">
            {/* TOP UNIFIED CONTROLLER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md">
              <button
                type="button"
                onClick={() => setActiveKey('overview')}
                className="flex items-center gap-2 text-xs font-black text-cyan-400 hover:text-cyan-300 transition-all cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-cyan-500/50 shrink-0"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>← Ver Todas las Calculadoras ({allCalculators.length})</span>
              </button>

              {/* QUICK DIRECT SELECTOR DROPDOWN */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-bold hidden md:inline">Cambiar calculadora:</span>
                <select
                  value={activeKey}
                  onChange={(e) => setActiveKey(e.target.value as CalculatorKey)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
                >
                  {allCalculators.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* CONTEXTUAL SHARE BANNER FOR THE ACTIVE CALCULATOR */}
            {currentCalc && (
              <CalculatorShareBanner
                title={currentCalc.title}
                description={currentCalc.description}
                category={currentCalc.category}
                calcKey={currentCalc.key}
                isGeneralSuite={false}
              />
            )}

            {/* ACTIVE MODULE RENDER */}
            <div>
              {activeKey === 'pediatric' && <PediatricCalculatorTab />}
              {activeKey === 'mabl' && <MablTransfusionTab />}
              {activeKey === 'infusions_direct' && <DrugInfusionTab initialMode="direct" />}
              {activeKey === 'infusions_reverse' && <DrugInfusionTab initialMode="reverse" />}
              {activeKey === 'infusions_pearls' && <DrugInfusionTab initialMode="pearls" />}
              {activeKey === 'infusions_drip' && <DrugInfusionTab initialMode="drip" />}
              {activeKey === 'tiva' && <TivaCalculatorTab />}
              {activeKey === 'converter_percent' && <UnitConverterTab initialSubSection="percent" />}
              {activeKey === 'converter_ratios' && <UnitConverterTab initialSubSection="ratios" />}
              {activeKey === 'converter_dose' && <UnitConverterTab initialSubSection="dose" />}
              {activeKey === 'converter_electrolytes' && <UnitConverterTab initialSubSection="electrolytes" />}
              {activeKey === 'scales_fluids' && <ClinicalScalesAndScoresTab initialSubTab="fluids" />}
              {activeKey === 'scales_hemo' && <ClinicalScalesAndScoresTab initialSubTab="hemo_gas" />}
              {activeKey === 'scales_macocha' && <ClinicalScalesAndScoresTab initialSubTab="scales" />}
              {activeKey === 'scales_antropo' && <ClinicalScalesAndScoresTab initialSubTab="antropo" />}
            </div>
          </div>
        );
      })()}
    </div>
  );
};

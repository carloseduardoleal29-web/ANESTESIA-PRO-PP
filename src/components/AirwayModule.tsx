import React, { useState } from 'react';
import { EgriState } from '../types';
import {
  Wind,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Eye,
  Pill,
  Video,
  Play,
  FileText,
  Activity,
  Layers,
  HelpCircle,
  Info
} from 'lucide-react';
import { MallampatiDiagram, CormackDiagram, VortexDiagram, PogoScaleDiagram } from './MedicalDiagrams';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

export const AirwayModule: React.FC = () => {
  // Active main tab in airway module
  const [activeTab, setActiveTab] = useState<'scales' | 'pharma' | 'videos'>('scales');

  // Selected video cut
  const [selectedVideo, setSelectedVideo] = useState<'glottic' | 'sagittal' | 'crico' | 'supraglottic'>('glottic');

  // Selected drug category filter in pharma tab
  const [pharmaFilter, setPharmaFilter] = useState<'all' | 'neuromuscular' | 'hypnotics' | 'adjuvants'>('all');

  // ASA state
  const [selectedAsa, setSelectedAsa] = useState<string>('ASA1');

  // EGRI state
  const [egri, setEgri] = useState<EgriState>({
    apertura: 0,
    tiro: 0,
    mallampati: 0,
    cervical: 0,
    sublux: 0,
    peso: 0,
    history: 0
  });

  // Collapsible accordion state
  const [openSubmenu, setOpenSubmenu] = useState<Record<string, boolean>>({
    hanMenu: false,
    cormackMenu: false,
    pogoMenu: false,
    vortexMenu: true,
    dasMenu: true
  });

  const toggleSubMenu = (key: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalEgri =
    egri.apertura + egri.tiro + egri.mallampati + egri.cervical + egri.sublux + egri.peso + egri.history;

  const asaDescriptions: Record<string, { title: string; desc: string; example: string }> = {
    ASA1: {
      title: 'ASA I',
      desc: 'Paciente sano normal sin enfermedades orgánicas, fisiológicas o psiquiátricas.',
      example: 'Paciente joven fit programado para herniorrafia o cirugía plástica menor sin comorbilidades.'
    },
    ASA2: {
      title: 'ASA II',
      desc: 'Paciente con enfermedad sistémica leve sin limitaciones funcionales sustanciales.',
      example: 'Hipertensión bien controlada, diabetes mellitus tipo 2 no insulino-dependiente, asma leve, fumador social, IMC 30-40.'
    },
    ASA3: {
      title: 'ASA III',
      desc: 'Paciente con enfermedad sistémica grave con limitación funcional importante.',
      example: 'Diabetes mal controlada, EPOC moderado/severo, cardiopatía isquémica con angina estable, insuficiencia renal en diálisis regular, antecedentes de IAM > 3 meses.'
    },
    ASA4: {
      title: 'ASA IV',
      desc: 'Paciente con enfermedad sistémica grave que constituye una amenaza constante para la vida.',
      example: 'Angina inestable, insuficiencia cardíaca congestiva descompensada, sepsis, disfunción renal severa sin hemodiálisis, IAM o AIT reciente (<3 meses).'
    },
    ASA5: {
      title: 'ASA V',
      desc: 'Paciente moribundo que no se espera que sobreviva sin la intervención quirúrgica.',
      example: 'Ruptura de aneurisma de aorta abdominal, politraumatismo masivo con shock hemorrágico descompensado, HIC con efecto de masa masivo.'
    },
    ASA6: {
      title: 'ASA VI',
      desc: 'Paciente con muerte cerebral declarada cuyos órganos van a ser donados.',
      example: 'Donante cadavérico en soporte hemodinámico para ablación multiorgánica.'
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Vía Aérea, Farmacología y Cortes Anatómicos</h2>
              <p className="text-xs text-slate-400">
                Escalas Predictivas, Dosis y Mecanismos de Secuencia Rápida (SRI) y Demostraciones en Video / Cortes Anatómicos
              </p>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveTab('scales')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'scales'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Escalas e Índices
            </button>

            <button
              onClick={() => setActiveTab('pharma')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'pharma'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-cyan-400" /> Fármacos SRI
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'videos'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-rose-400" /> Videos y Cortes
            </button>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Módulo de Vía Aérea, Secuencia Rápida & Anatomía"
        description="Evaluación integral de vía aérea: predictores clínicos (Mallampati, Cormack, Patil, EGRI), protocolo farmacológico de Secuencia Rápida (ISR) y demostraciones anatómicas en video."
        shareText="🫁 Colega, te comparto el Módulo de Vía Aérea y Secuencia Rápida en AnestesiaPro: escalas predictivas (Mallampati, Cormack, Patil, EGRI), esquema farmacológico de ISR y cortes anatómicos en video:"
        tabParam="viaAerea"
        theme="indigo"
      />

      {/* TAB 1: ESCALAS E ÍNDICES */}
      {activeTab === 'scales' && (
        <div className="space-y-6">
          {/* 1. EGRI - El-Ganzouri Multivariate Risk Index */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  🧮 EGRI: Índice de Riesgo Multivariado de El-Ganzouri
                </h3>
                <p className="text-xs text-slate-400">Puntuación predictiva ponderada para vía aérea difícil (0 - 14 puntos)</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* 1. Apertura Bucal */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">1. Apertura Bucal (Distancia Interincisivos)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: '> 4 cm (0 pts)', val: 0 },
                    { label: '3 – 4 cm (1 pt)', val: 1 },
                    { label: '< 3 cm (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, apertura: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.apertura === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.apertura === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Distancia Tiromentoniana */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">2. Distancia Tiromentoniana</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: '> 6.5 cm (0 pts)', val: 0 },
                    { label: '6 – 6.5 cm (1 pt)', val: 1 },
                    { label: '< 6 cm (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, tiro: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.tiro === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.tiro === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Mallampati */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-400 block">3. Clasificación de Mallampati</span>
                
                {/* Visual Diagram */}
                <MallampatiDiagram
                  selectedClass={egri.mallampati === 0 ? 1 : egri.mallampati === 1 ? 2 : 3}
                  onSelectClass={(c) => {
                    const egriVal = c === 1 ? 0 : c === 2 ? 1 : 2;
                    setEgri((p) => ({ ...p, mallampati: egriVal }));
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { label: 'Clase I (0 pts)', val: 0 },
                    { label: 'Clase II (1 pt)', val: 1 },
                    { label: 'Clase III / IV (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, mallampati: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.mallampati === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.mallampati === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Movilidad Cervical */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">4. Movilidad Cervical</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: '> 90° (0 pts)', val: 0 },
                    { label: '80 – 90° (1 pt)', val: 1 },
                    { label: '< 80° (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, cervical: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.cervical === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.cervical === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Subluxación Mandibular */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">5. Subluxación Mandibular</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Incisivos inf. por delante (0 pts)', val: 0 },
                    { label: 'Pueden alinear (1 pt)', val: 1 },
                    { label: 'No pueden alinear (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, sublux: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.sublux === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.sublux === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Peso Corporal */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">6. Peso Corporal</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { label: '< 90 kg (0 pts)', val: 0 },
                    { label: '90-110 kg (1 pt)', val: 1 },
                    { label: '> 110 kg (2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, peso: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.peso === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.peso === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 7. Historia Vía Aérea Difícil */}
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-cyan-400 block mb-2">7. Historia de Vía Aérea Difícil</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: 'Ausente / Negativa (0 pts)', val: 0 },
                    { label: 'Presente / Antecedente (+) (+2 pts)', val: 2 }
                  ].map((opt) => (
                    <label
                      key={opt.label}
                      onClick={() => setEgri((p) => ({ ...p, history: opt.val }))}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                        egri.history === opt.val
                          ? 'bg-indigo-600/30 border-indigo-500 text-white'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input type="radio" checked={egri.history === opt.val} onChange={() => {}} className="accent-indigo-500" />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Total EGRI Calculation Alert */}
            <div
              className={`mt-4 p-4 rounded-xl border flex items-center justify-between transition-all ${
                totalEgri >= 4
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
              }`}
            >
              <div className="flex items-center gap-3">
                {totalEgri >= 4 ? (
                  <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
                <div>
                  <span className="text-xs font-extrabold uppercase block">Puntaje EGRI Acumulado</span>
                  <span className="text-base font-black">
                    {totalEgri} / 14 Puntos &bull;{' '}
                    {totalEgri >= 4 ? '⚠️ ALERTA: Vía aérea difícil prevista' : '✅ Baja probabilidad de dificultad'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-slate-900/60 border border-slate-700">
                {totalEgri >= 4 ? 'Estrategia VAD' : 'Manejo Convencional'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 italic mt-2">Referencia: El-Ganzouri AR, et al. Anesth Analg.</p>
          </div>

          {/* 3. Escalas Anatómicas (Han, Cormack, POGO) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-white mb-2">📑 Escalas Anatómicas y de Laringoscopia</h3>

            {/* Han */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <button
                onClick={() => toggleSubMenu('hanMenu')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-white hover:bg-slate-800/60 transition-all text-left"
              >
                <span>▪️ Escala de Ventilación Difícil con Mascarilla de Han</span>
                {openSubmenu.hanMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSubmenu.hanMenu && (
                <div className="p-3 text-xs text-slate-300 space-y-1.5 border-t border-slate-800 bg-slate-900/50 leading-relaxed">
                  <p><strong>Grado I:</strong> Ventilación fácil sin dispositivos auxiliares.</p>
                  <p><strong>Grado II:</strong> Ventilación difícil, requiere cánula orofaríngea o reposicionamiento.</p>
                  <p><strong>Grado III:</strong> Ventilación muy difícil, requiere dos operadores o relajantes musculares.</p>
                  <p><strong>Grado IV:</strong> Ventilación imposible por mascarilla facial.</p>
                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">Ref: Han et al. (2004).</p>
                </div>
              )}
            </div>

            {/* Cormack-Lehane */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <button
                onClick={() => toggleSubMenu('cormackMenu')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-white hover:bg-slate-800/60 transition-all text-left"
              >
                <span>▪️ Clasificación Laringoscópica de Cormack-Lehane</span>
                {openSubmenu.cormackMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSubmenu.cormackMenu && (
                <div className="p-3 text-xs text-slate-300 space-y-3 border-t border-slate-800 bg-slate-900/50 leading-relaxed">
                  <CormackDiagram />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                    <p><strong>Grado I:</strong> Visualización completa de las cuerdas vocales.</p>
                    <p><strong>Grado II:</strong> Solo comisura posterior o aritenoides visibles.</p>
                    <p><strong>Grado III:</strong> Solo la epiglotis es visible (sin cuerdas).</p>
                    <p><strong>Grado IV:</strong> Sin visualización ni siquiera de la epiglotis (solo paladar blando).</p>
                  </div>
                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">Ref: Cormack & Lehane (1984).</p>
                </div>
              )}
            </div>

            {/* POGO */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
              <button
                onClick={() => toggleSubMenu('pogoMenu')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-white hover:bg-slate-800/60 transition-all text-left"
              >
                <span>▪️ Escala POGO (Percentage of Glottic Opening)</span>
                {openSubmenu.pogoMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSubmenu.pogoMenu && (
                <div className="p-3 text-xs text-slate-300 space-y-3 border-t border-slate-800 bg-slate-900/50 leading-relaxed">
                  <p>Porcentaje de apertura glótica expuesta durante la laringoscopia (0 a 100%).</p>
                  <PogoScaleDiagram />
                  <p className="text-cyan-300 font-semibold">Un POGO &lt; 50% se asocia a intubación traqueal más compleja que requiere estilete/videolaringoscopio.</p>
                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">Ref: Orebaugh et al. (2011) / Levitan et al. (1998).</p>
                </div>
              )}
            </div>
          </div>

          {/* 4. Algoritmos de Rescate (Vortex & DAS) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              🌀 Algoritmos y Protocolos de Rescate en Vía Aérea
            </h3>

            {/* Vortex */}
            <div className="border border-indigo-800/50 rounded-2xl overflow-hidden bg-indigo-950/30">
              <button
                onClick={() => toggleSubMenu('vortexMenu')}
                className="w-full flex items-center justify-between p-4 text-sm font-extrabold text-white bg-indigo-900/40 hover:bg-indigo-900/60 transition-all text-left"
              >
                <span className="flex items-center gap-2">🌀 Enfoque Vórtex (Vortex Approach)</span>
                {openSubmenu.vortexMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSubmenu.vortexMenu && (
                <div className="p-4 text-xs text-slate-200 space-y-3 border-t border-indigo-800/40 leading-relaxed">
                  <VortexDiagram />
                  <div className="bg-amber-950/50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-200 text-xs">
                    <strong>📌 Historia y Origen:</strong> Creado por el Dr. Nicholas Chrimes y el Dr. Peter Fritz (2015). Herramienta cognitiva tridimensional para simplificar la toma de decisiones críticas en crisis de vía aérea.
                  </div>
                  <p className="text-[10px] text-slate-500 italic border-t border-indigo-800/40 pt-2">Ref: Chrimes N, et al. The Vortex Approach.</p>
                </div>
              )}
            </div>

            {/* DAS */}
            <div className="border border-blue-800/50 rounded-2xl overflow-hidden bg-slate-950/40">
              <button
                onClick={() => toggleSubMenu('dasMenu')}
                className="w-full flex items-center justify-between p-4 text-sm font-extrabold text-white bg-blue-900/40 hover:bg-blue-900/60 transition-all text-left"
              >
                <span className="flex items-center gap-2">▪️ Guías DAS (Difficult Airway Society Protocol)</span>
                {openSubmenu.dasMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openSubmenu.dasMenu && (
                <div className="p-4 text-xs text-slate-200 space-y-3 border-t border-blue-800/40 leading-relaxed">
                  <div className="bg-slate-900 p-3 rounded-xl border border-blue-500/30 flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-200">🎥 Ver video tutorial del Protocolo DAS en YouTube:</span>
                    <a
                      href="https://www.youtube.com/results?search_query=DAS+difficult+airway+society+guidelines+anesthesia"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shrink-0 shadow-md"
                    >
                      Ver Video <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/50">
                      <strong className="text-cyan-300 block mb-0.5">Plan A: Intubación Traqueal Inicial</strong>
                      Laringoscopia directa o videolaringoscopia con maniobra BURP o estilete. Máximo 3 intentos. Si fracasa → Plan B.
                    </div>
                    <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-800/50">
                      <strong className="text-indigo-300 block mb-0.5">Plan B: Mantenimiento de Oxigenación con DSG</strong>
                      Inserción de Dispositivo Supraglótico (LMA de 2da generación). Máximo 2 intentos. Si oxigena → evaluar despertar o intubar a través del DSG. Si fracasa → Plan C.
                    </div>
                    <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/50">
                      <strong className="text-amber-300 block mb-0.5">Plan C: Ventilación con Mascarilla Facial o Despertar</strong>
                      Pedir ayuda experta, revertir el bloqueo neuromuscular si aplica (Sugammadex). Si la ventilación es imposible → Escenario "No Puedo Intubar, No Puedo Oxigenar" (NINO) → Plan D urgente.
                    </div>
                    <div className="p-3 bg-rose-950/50 rounded-xl border border-rose-800/60 text-rose-100">
                      <strong className="text-rose-300 block mb-0.5">Plan D: Acceso Frontal de Cuello (AFC / CPO)</strong>
                      Cricotiroidotomía quirúrgica o técnica de Seldinger (Bisturí - Buajía - Tubo de traqueostomía/TET #6.0) de emergencia inmediata.
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 italic border-t border-slate-800 pt-2">Ref: Frerk C, et al. Difficult Airway Society 2015 guidelines for management of unanticipated difficult intubation in adults.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FARMACOLOGÍA Y SECUENCIA DE INTUBACIÓN RÁPIDA (SRI) */}
      {activeTab === 'pharma' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-400" />
                  Farmacología Detallada de Vía Aérea y Secuencia de Intubación Rápida (SRI)
                </h3>
                <p className="text-xs text-slate-400">
                  Mecanismos de acción completos, posología de inducción/SRI, onset, duración y perlas clínicas avanzadas
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setPharmaFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    pharmaFilter === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setPharmaFilter('neuromuscular')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    pharmaFilter === 'neuromuscular' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Relajantes Musculares
                </button>
                <button
                  onClick={() => setPharmaFilter('hypnotics')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    pharmaFilter === 'hypnotics' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Inductores / Hipnóticos
                </button>
                <button
                  onClick={() => setPharmaFilter('adjuvants')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    pharmaFilter === 'adjuvants' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Coadyuvantes
                </button>
              </div>
            </div>

            {/* Drugs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. SUCCINILCOLINA */}
              {(pharmaFilter === 'all' || pharmaFilter === 'neuromuscular') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Succinilcolina (Suxametonio)</span>
                      <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Relajante Despolarizante
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Agonista de receptores nicotínicos N2 de la placa motora terminal. Produce despolarización persistente no coordinada (fasciculaciones musculares) y bloqueo posterior por desensibilización e inactividad de los canales de Na+ (Bloqueo Fase I).
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Dosis Inducción / SRI:</span>
                          <span className="text-emerald-300 font-bold">1.0 – 1.5 mg/kg IV</span>
                          <span className="text-slate-400 block text-[10px]">(hasta 2 mg/kg en obesidad)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Onset / Duración:</span>
                          <span className="text-amber-300 font-bold">30 – 60 seg / 5 – 10 min</span>
                          <span className="text-slate-400 block text-[10px]">Metab. Pseudocolinesterasa</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-[11px] text-rose-200">
                        <strong className="text-rose-400 block mb-0.5">⛔ Contraindicaciones Absolutas:</strong>
                        Quemados (&gt;24-48h), denervación motora/ACV, traumados/politrauma, miopatías/distrofia de Duchenne, antecedente de Hipertermia Maligna, hiperpotasemia (&gt;5.5 mEq/L) y trauma ocular abierto.
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Perla SRI:</strong> Gold standard clásico para vía aérea difícil/estómago lleno por su latencia impredeciblemente rápida y recuperación espontánea ultra corta.
                  </div>
                </div>
              )}

              {/* 2. ROCURONIO */}
              {(pharmaFilter === 'all' || pharmaFilter === 'neuromuscular') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Rocuronio</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        No Despolarizante (Aminosteroide)
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Antagonista competitivo no despolarizante de la acetilcolina en las subunidades alfa de los receptores nicotínicos postsinápticos de la placa motora neuromuscular.
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Dosis Inducción / SRI:</span>
                          <span className="text-emerald-300 font-bold">0.6 mg/kg (estándar)</span>
                          <span className="text-cyan-300 font-bold block">1.0 – 1.2 mg/kg (dosis SRI)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Onset / Duración:</span>
                          <span className="text-amber-300 font-bold">60 – 90 seg / 50 – 70 min</span>
                          <span className="text-slate-400 block text-[10px]">(a dosis de SRI 1.2 mg/kg)</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-[11px] text-emerald-200">
                        <strong className="text-emerald-400 block mb-0.5">🛡️ Reversión de Emergencia con Sugammadex:</strong>
                        Reversible instantáneamente a cualquier profundidad con Sugammadex (16 mg/kg en caso de falla de intubación post-SRI).
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Perla SRI:</strong> Relajante no despolarizante de primera línea en SRI cuando la succinilcolina está contraindicada. Ofrece idénticas condiciones de intubación sin fasciculaciones.
                  </div>
                </div>
              )}

              {/* 3. SUGAMMADEX */}
              {(pharmaFilter === 'all' || pharmaFilter === 'neuromuscular') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Sugammadex</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Reversor Específico Ciclodextrina
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Ciclodextrina modificada sintética con núcleo hidrofóbico lipofílico que encapsula directamente las moléculas libres de Rocuronio y Vecuronio en el plasma en relación 1:1, inactivando el gradiente neuromuscular.
                      </p>

                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Reversión Moderada (T2 en TOF):</span>
                          <span className="text-emerald-300 font-bold">2 mg/kg IV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">Reversión Profunda (1-2 PTC):</span>
                          <span className="text-amber-300 font-bold">4 mg/kg IV</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-rose-300 font-bold">Emergencia SRI (Post 1.2mg/kg Rocuronio):</span>
                          <span className="text-rose-300 font-black">16 mg/kg IV</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Perla SRI:</strong> Fármaco salvavidas en escenario NINO (No Puedo Intubar, No Puedo Oxigenar). Restablece la ventilación espontánea en &lt; 2 minutos.
                  </div>
                </div>
              )}

              {/* 4. PROPOFOL */}
              {(pharmaFilter === 'all' || pharmaFilter === 'hypnotics') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Propofol</span>
                      <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Hipnótico Alquilfenol
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Modulador alostérico positivo del receptor GABA-A. Aumenta la conductancia del cloro induciendo hiperpolarización profunda de la membrana neuronal central.
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Dosis Inducción / SRI:</span>
                          <span className="text-emerald-300 font-bold">1.5 – 2.5 mg/kg IV</span>
                          <span className="text-slate-400 block text-[10px]">(reducir en ancianos o hipotensión)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Onset / Duración:</span>
                          <span className="text-amber-300 font-bold">30 – 40 seg / 4 – 8 min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Efecto en Vía Aérea:</strong> Excelente abolición de reflejos laríngeos y faríngeos. Elección ideal para inserción de Máscara Laríngea sin relajación. Causa vasodilatación e hipotensión.
                  </div>
                </div>
              )}

              {/* 5. ETOMIDATO */}
              {(pharmaFilter === 'all' || pharmaFilter === 'hypnotics') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Etomidato</span>
                      <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Hipnótico Imidazol
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Modulador del receptor GABA-A en la sustancia reticular ascendente. Sin actividad simpaticomimética ni histaminérgica.
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Dosis Inducción / SRI:</span>
                          <span className="text-emerald-300 font-bold">0.2 – 0.3 mg/kg IV</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Onset / Duración:</span>
                          <span className="text-amber-300 font-bold">15 – 30 seg / 3 – 8 min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Efecto en Vía Aérea:</strong> Máxima estabilidad hemodinámica de elección en shock, trauma severo o coronariopatía descompensada. Conserva la presión de perfusión cerebral.
                  </div>
                </div>
              )}

              {/* 6. KETAMINA */}
              {(pharmaFilter === 'all' || pharmaFilter === 'hypnotics') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-white">Ketamina</span>
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                        Anestésico Disociativo NMDA
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-300">
                      <p className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo de Acción Completo:</strong>
                        Antagonista no competitivo del receptor N-metil-D-aspartato (NMDA). Interrumpe las vías talamocorticales mientras estimula el sistema límbico.
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60 text-[11px]">
                        <div>
                          <span className="text-slate-400 block font-bold">Dosis Inducción / SRI:</span>
                          <span className="text-emerald-300 font-bold">1.5 – 2.0 mg/kg IV</span>
                          <span className="text-slate-400 block text-[10px]">(4-5 mg/kg IM)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold">Onset / Duración:</span>
                          <span className="text-amber-300 font-bold">30 – 60 seg / 10 – 20 min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-cyan-300/90 font-medium italic">
                    💡 <strong>Efecto en Vía Aérea:</strong> Potente broncodilatador directo por estímulo simpático. Conserva el drive respiratorio y los reflejos laríngeos protectores en intubación vigil.
                  </div>
                </div>
              )}

              {/* 7. LIDOCAÍNA IV Y FENTANILO (COADYUVANTES) */}
              {(pharmaFilter === 'all' || pharmaFilter === 'adjuvants') && (
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-white">Lidocaína 1-2% IV (Atenuación Simpática)</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Coadyuvante VAD
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo & Dosis:</strong>
                        Bloquea canales de Na+ axónicos. Dosis: 1.5 mg/kg IV administrados 3 minutos antes de la laringoscopia. Blanquea el reflejo de tos, atenúa el broncoespasmo y previene el aumento brusco de la Presión Intracraneal (PIC) e Hipertensión durante la intubación.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-white">Fentanilo (Blanqueo Autonómico)</span>
                        <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                          Opioide Agonista μ
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        <strong className="text-cyan-400 block mb-0.5">⚡ Mecanismo & Dosis:</strong>
                        Agonista de receptores mu opioides. Dosis: 2 - 3 mcg/kg IV previa a la inducción. Bloquea la respuesta simpática hemodinámica (taquicardia/HTA) a la laringoscopia directa en cardiopatías o aneurismas.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VIDEOS Y CORTES ANATÓMICOS DE VÍA AÉREA */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-400" />
                  Demostración Visual de Cortes Anatómicos y Procedimientos de Vía Aérea
                </h3>
                <p className="text-xs text-slate-400">
                  Visualizaciones estructuradas, anatomía laríngea, cortes quirúrgicos y reproductor de video clínico
                </p>
              </div>

              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-1 rounded-full shrink-0">
                Guía Multimedia Oficial
              </span>
            </div>

            {/* Sub-selector of video cuts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
              <button
                onClick={() => setSelectedVideo('glottic')}
                className={`p-3 rounded-xl text-xs font-extrabold text-left border transition-all flex flex-col gap-1 ${
                  selectedVideo === 'glottic'
                    ? 'bg-gradient-to-r from-rose-950/80 to-indigo-950/80 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-rose-400 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-rose-400" /> Corte Laringoscópico
                </span>
                <span className="text-[11px] opacity-80">Visión Glótica (Cormack I-IV)</span>
              </button>

              <button
                onClick={() => setSelectedVideo('sagittal')}
                className={`p-3 rounded-xl text-xs font-extrabold text-left border transition-all flex flex-col gap-1 ${
                  selectedVideo === 'sagittal'
                    ? 'bg-gradient-to-r from-rose-950/80 to-indigo-950/80 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-cyan-400 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-cyan-400" /> Corte Sagital
                </span>
                <span className="text-[11px] opacity-80">Alineación 3 Ejes (Olfateo)</span>
              </button>

              <button
                onClick={() => setSelectedVideo('crico')}
                className={`p-3 rounded-xl text-xs font-extrabold text-left border transition-all flex flex-col gap-1 ${
                  selectedVideo === 'crico'
                    ? 'bg-gradient-to-r from-rose-950/80 to-indigo-950/80 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-amber-400 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-amber-400" /> Corte Quirúrgico CPO
                </span>
                <span className="text-[11px] opacity-80">Cricotiroidotomía (Plan D)</span>
              </button>

              <button
                onClick={() => setSelectedVideo('supraglottic')}
                className={`p-3 rounded-xl text-xs font-extrabold text-left border transition-all flex flex-col gap-1 ${
                  selectedVideo === 'supraglottic'
                    ? 'bg-gradient-to-r from-rose-950/80 to-indigo-950/80 border-rose-500 text-white shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-indigo-400 flex items-center gap-1">
                  <Play className="w-3 h-3 fill-indigo-400" /> Corte Supraglótico
                </span>
                <span className="text-[11px] opacity-80">Máscara Laríngea i-gel</span>
              </button>
            </div>

            {/* Video Player & Anatomical Cut Canvas Container */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* 1. CORTE LARINGOSCÓPICO Y VISIÓN GLÓTICA */}
              {selectedVideo === 'glottic' && (
                <div className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Visual Cut Animation/Diagram */}
                    <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-rose-500/20 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded border border-rose-500/30">
                        Corte Frontal / Glótico
                      </div>

                      {/* SVG Glottis Anatomy Diagram */}
                      <svg viewBox="0 0 200 160" className="w-48 h-40">
                        {/* Epiglottis */}
                        <ellipse cx="100" cy="30" rx="45" ry="18" fill="#e11d48" opacity="0.8" />
                        <text x="100" y="32" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">EPIGLOTIS</text>
                        {/* Vocal Cords */}
                        <polygon points="75,50 100,120 85,120" fill="#f8fafc" />
                        <polygon points="125,50 100,120 115,120" fill="#f8fafc" />
                        {/* Vocal cord lines */}
                        <line x1="75" y1="50" x2="100" y2="120" stroke="#0284c7" strokeWidth="2" />
                        <line x1="125" y1="50" x2="100" y2="120" stroke="#0284c7" strokeWidth="2" />
                        {/* Arytenoids */}
                        <circle cx="85" cy="125" r="10" fill="#38bdf8" />
                        <circle cx="115" cy="125" r="10" fill="#38bdf8" />
                        <text x="100" y="145" textAnchor="middle" fill="#94a3b8" fontSize="8">Cartílagos Aritenoides</text>
                      </svg>
                    </div>

                    {/* Description and Video Player */}
                    <div className="w-full md:w-1/2 space-y-3">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        🎥 Corte Laringoscópico y Anatomía de la Glotis
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Demostración del corte frontal durante la laringoscopia directa y videolaringoscopia. Permite identificar las referencias anatómicas críticas para la intubación orotraqueal: Epiglotis, Cuerdas Vocales, Comisura Anterior y Cartílagos Aritenoides.
                      </p>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
                        <p><strong>🎯 Referencia Anatómica Clave:</strong> Válcula epiglótica donde se apoya la hoja curva de Macintosh para traccionar el ligamento hioepiglótico.</p>
                        <p><strong>Escala Cormack-Lehane:</strong> Grado I (100% glotis) &rarr; Grado IV (Solo paladar duro visible).</p>
                      </div>

                      <a
                        href="https://www.youtube.com/results?search_query=direct+laryngoscopy+glottic+view+cormack+lehane+anesthesia"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" /> Ver Video de Laringoscopia Directa en HD <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. CORTE SAGITAL Y ALINEACIÓN DE LOS 3 EJES */}
              {selectedVideo === 'sagittal' && (
                <div className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Visual Cut Diagram */}
                    <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-cyan-500/20 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded border border-cyan-500/30">
                        Corte Sagital de Cabeza y Cuello
                      </div>

                      <svg viewBox="0 0 200 150" className="w-52 h-40">
                        {/* Head Contour */}
                        <path d="M 40 100 C 20 60, 50 20, 100 20 C 140 20, 170 50, 160 90 L 140 130" fill="none" stroke="#64748b" strokeWidth="2" />
                        {/* Oral Axis */}
                        <line x1="60" y1="70" x2="160" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
                        <text x="165" y="73" fill="#ef4444" fontSize="8" fontWeight="bold">Eje Oral</text>
                        {/* Pharyngeal Axis */}
                        <line x1="100" y1="35" x2="130" y2="125" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3,3" />
                        <text x="135" y="125" fill="#3b82f6" fontSize="8" fontWeight="bold">Eje Faríngeo</text>
                        {/* Laryngeal Axis */}
                        <line x1="80" y1="50" x2="110" y2="135" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                        <text x="115" y="140" fill="#10b981" fontSize="8" fontWeight="bold">Eje Laríngeo</text>
                      </svg>
                    </div>

                    {/* Description */}
                    <div className="w-full md:w-1/2 space-y-3">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        🎥 Corte Sagital: Posición de Olfateo ("Sniffing Position")
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Demostración en corte anatómico sagital de la alineación de los tres ejes: Oral, Faríngeo y Laríngeo. Se logra mediante flexión cervical inferior (C5-C7) y extensión atlanto-occipital (C1-C2) con realce occipital de 8 a 10 cm.
                      </p>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
                        <p><strong>📌 Regla Mecánica:</strong> En paciente obeso, utilizar la posición en rampa ("Ramped Position") hasta alinear el meato auditivo externo con la horquilla esternal.</p>
                      </div>

                      <a
                        href="https://www.youtube.com/results?search_query=sniffing+position+airway+alignment+anesthesia+video"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" /> Ver Video de Alineación de Ejes en HD <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. CORTE QUIRÚRGICO DE CRICOTIROIDOTOMÍA */}
              {selectedVideo === 'crico' && (
                <div className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Visual Cut Diagram */}
                    <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded border border-amber-500/30">
                        Corte Quirúrgico de Cuello
                      </div>

                      <svg viewBox="0 0 200 150" className="w-48 h-40">
                        {/* Thyroid Cartilage */}
                        <path d="M 60 30 L 140 30 L 120 70 L 80 70 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="100" y="50" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Cartílago Tiroides</text>

                        {/* Cricothyroid Membrane */}
                        <rect x="75" y="73" width="50" height="18" fill="#f59e0b" opacity="0.8" rx="3" />
                        <text x="100" y="85" textAnchor="middle" fill="#000000" fontSize="8" fontWeight="black">MEMBRANA CRICOTIROIDEA</text>

                        {/* Cricoid Cartilage */}
                        <path d="M 70 94 L 130 94 L 125 120 L 75 120 Z" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
                        <text x="100" y="110" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Cartílago Cricoides</text>
                      </svg>
                    </div>

                    {/* Description */}
                    <div className="w-full md:w-1/2 space-y-3">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        🎥 Corte Quirúrgico de Cricotiroidotomía (Plan D DAS)
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Acceso Frontal de Cuello (AFC / FONA) de emergencia en escenario "No Puedo Intubar, No Puedo Oxigenar" (NINO). Muestra la referencia anatómica entre el borde inferior del cartílago tiroides y el cartílago cricoides.
                      </p>

                      <div className="bg-amber-950/40 border border-amber-800/50 p-3 rounded-xl text-xs space-y-1 text-amber-200">
                        <strong className="block font-bold">🛠️ Técnica Estándar Bisturí - Buajía - Tubo:</strong>
                        <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-200">
                          <li>Inscisión horizontal en membrana cricotiroidea con Bisturí #10.</li>
                          <li>Giro de la hoja 90° e inserción de Guía/Buajía Elástica.</li>
                          <li>Deslizamiento de Tubo Traqueal #6.0 sobre la buajía.</li>
                        </ol>
                      </div>

                      <a
                        href="https://www.youtube.com/results?search_query=scalpel+bougie+tube+cricothyroidotomy+DAS+guidelines+video"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" /> Ver Video de Cricotiroidotomía en HD <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. CORTE DE DISPOSITIVOS SUPRAGLÓTICOS */}
              {selectedVideo === 'supraglottic' && (
                <div className="p-5 space-y-4">
                  <div className="flex flex-col md:flex-row gap-5 items-center">
                    {/* Visual Cut Diagram */}
                    <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                      <div className="absolute top-2 left-2 bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded border border-indigo-500/30">
                        Corte Faríngeo con DSG
                      </div>

                      <svg viewBox="0 0 200 150" className="w-48 h-40">
                        {/* Laryngeal Mask / i-gel contour */}
                        <path d="M 50 30 C 80 30, 150 50, 150 100 C 150 130, 110 130, 90 100 C 80 80, 50 50, 50 30 Z" fill="#6366f1" opacity="0.7" stroke="#818cf8" strokeWidth="2" />
                        <text x="110" y="80" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">i-gel / LMA</text>
                        {/* Esophageal sealing block */}
                        <rect x="80" y="105" width="25" height="20" fill="#e11d48" rx="2" />
                        <text x="92" y="118" fill="#ffffff" fontSize="7" textAnchor="middle">Sello Esofágico</text>
                      </svg>
                    </div>

                    {/* Description */}
                    <div className="w-full md:w-1/2 space-y-3">
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        🎥 Corte Faríngeo: Dispositivos Supraglóticos de 2da Generación
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Demostración en corte anatómico del sellado periglótico que ejercen los dispositivos supraglóticos de segunda generación (i-gel, LMA ProSeal, LMA Supreme) con canal de aspiración gástrica independiente.
                      </p>

                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
                        <p><strong>📌 Indicación DAS Plan B:</strong> Rescate de ventilación en vía aérea difícil no prevista cuando falla la intubación traqueal.</p>
                      </div>

                      <a
                        href="https://www.youtube.com/results?search_query=igel+supraglottic+airway+insertion+technique+anesthesia"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-black px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" /> Ver Video de Inserción i-gel en HD <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

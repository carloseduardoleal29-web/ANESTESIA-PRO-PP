import React, { useState, useMemo } from 'react';
import { 
  BarChart2, CheckCircle2, ChevronDown, ChevronUp, Activity, AlertTriangle, 
  Volume2, Copy, Check, ShieldAlert, FileText, Sparkles, RotateCcw, Clock, Info, Search 
} from 'lucide-react';
import { BromageDiagram, EvaScaleDiagram, PogoScaleDiagram } from './MedicalDiagrams';
import { playNotificationChime } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';
import { CAPRINI_FACTORS, CapriniItem, evaluateCapriniScore, CapriniAssessmentResult } from '../data/preanesthesiaCatalog';

export const ScalesModule: React.FC = () => {
  // All scales closed/recogidas by default per clinical UX requirement
  const [openSubmenu, setOpenSubmenu] = useState<Record<string, boolean>>({
    asaMenu: false,
    shockMenu: false,
    capriniMenu: false,
    evaMenu: false,
    pogoMenu: false,
    ramsayMenu: false,
    bromageMenu: false,
    aldreteMenu: false,
    rassMenu: false
  });

  const toggleSubMenu = (key: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSubmenu({
      asaMenu: true,
      shockMenu: true,
      capriniMenu: true,
      evaMenu: true,
      pogoMenu: true,
      ramsayMenu: true,
      bromageMenu: true,
      aldreteMenu: true,
      rassMenu: true
    });
  };

  const collapseAll = () => {
    setOpenSubmenu({
      asaMenu: false,
      shockMenu: false,
      capriniMenu: false,
      evaMenu: false,
      pogoMenu: false,
      ramsayMenu: false,
      bromageMenu: false,
      aldreteMenu: false,
      rassMenu: false
    });
  };

  const allOpen = Object.values(openSubmenu).every(Boolean);
  const anyOpen = Object.values(openSubmenu).some(Boolean);

  // ASA state
  const [selectedAsa, setSelectedAsa] = useState<string>('ASA1');

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

  // Shock Index state
  const [fcShock, setFcShock] = useState<number | ''>(100);
  const [pasShock, setPasShock] = useState<number | ''>(110);
  const [padShock, setPadShock] = useState<number | ''>(70);
  const [copiedShockAlert, setCopiedShockAlert] = useState(false);
  const [showShockProtocol, setShowShockProtocol] = useState(false);

  const fcVal = typeof fcShock === 'number' ? fcShock : 0;
  const pasVal = typeof pasShock === 'number' ? pasShock : 0;
  const padVal = typeof padShock === 'number' ? padShock : 0;

  const shockIndex = pasVal > 0 ? (fcVal / pasVal) : 0;
  const pamVal = pasVal > 0 && padVal > 0 ? ((pasVal + 2 * padVal) / 3) : 0;
  const modifiedShockIndex = pamVal > 0 ? (fcVal / pamVal) : 0;

  const handleCopyShockReport = () => {
    const isClass = shockIndex > 1.0 
      ? 'SHOCK SEVERO / ALTO RIESGO (IS > 1.0)' 
      : shockIndex >= 0.9 
      ? 'SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)' 
      : shockIndex >= 0.7 
      ? 'SHOCK LEVE / ALERTA (IS 0.7 - 0.9)' 
      : 'NORMAL (IS 0.5 - 0.7)';

    const text = `[REPORTE HEMODINÁMICO Y ÍNDICE DE SHOCK - ANESTESIAPRO]
FC: ${fcVal} bpm | PAS: ${pasVal} mmHg | PAD: ${padVal} mmHg | PAM: ${Math.round(pamVal)} mmHg
- Índice de Shock Clásico (IS = FC/PAS): ${shockIndex.toFixed(2)} [${isClass}]
- Índice de Shock Modificado (MSI = FC/PAM): ${modifiedShockIndex.toFixed(2)}
Evaluado vía AnestesiaPro (Dr. Carlos Leal).`;

    navigator.clipboard.writeText(text);
    setCopiedShockAlert(true);
    setTimeout(() => setCopiedShockAlert(false), 2500);
  };

  // Aldrete Estimator state
  const [aldrete, setAldrete] = useState({
    actividad: 2,
    respiracion: 2,
    circulacion: 2,
    conciencia: 2,
    saturacion: 2
  });

  const totalAldrete =
    aldrete.actividad + aldrete.respiracion + aldrete.circulacion + aldrete.conciencia + aldrete.saturacion;

  // Caprini VTE Risk Score state
  const [capriniSelectedIds, setCapriniSelectedIds] = useState<string[]>([]);
  const [capriniFilter, setCapriniFilter] = useState<'all' | '1_punto' | '2_puntos' | '3_puntos' | '5_puntos'>('all');
  const [capriniSearch, setCapriniSearch] = useState<string>('');
  const [capriniCopied, setCapriniCopied] = useState(false);
  const [showCapriniNeuroaxialTiming, setShowCapriniNeuroaxialTiming] = useState(false);

  const capriniScore = useMemo(() => {
    return capriniSelectedIds.reduce((sum, id) => {
      const factor = CAPRINI_FACTORS.find((f) => f.id === id);
      return sum + (factor ? factor.points : 0);
    }, 0);
  }, [capriniSelectedIds]);

  const capriniAssessment = useMemo(() => {
    return evaluateCapriniScore(capriniScore);
  }, [capriniScore]);

  const toggleCapriniItem = (id: string) => {
    setCapriniSelectedIds((prev) => {
      const isAge = id.startsWith('age_');
      let next = isAge ? prev.filter((item) => !item.startsWith('age_')) : [...prev];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...next, id];
      }
    });
  };

  const handleApplyCapriniPreset = (presetScore: number) => {
    if (presetScore === 0) {
      setCapriniSelectedIds([]);
    } else if (presetScore === 1) {
      setCapriniSelectedIds(['minor_surg']);
    } else if (presetScore === 3) {
      setCapriniSelectedIds(['age_41_60', 'major_surg_45m']);
    } else if (presetScore === 6) {
      setCapriniSelectedIds(['age_61_74', 'major_surg_45m', 'active_malignancy']);
    } else if (presetScore === 8) {
      setCapriniSelectedIds(['age_61_74', 'major_ortho_surg']);
    }
  };

  const filteredCapriniFactors = useMemo(() => {
    return CAPRINI_FACTORS.filter((factor) => {
      const matchesCategory = capriniFilter === 'all' || factor.category === capriniFilter;
      const matchesSearch =
        capriniSearch.trim() === '' ||
        factor.label.toLowerCase().includes(capriniSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [capriniFilter, capriniSearch]);

  const handleCopyCapriniReport = () => {
    const selectedLabels = capriniSelectedIds
      .map((id) => CAPRINI_FACTORS.find((f) => f.id === id))
      .filter(Boolean)
      .map((f) => `  • ${f!.label} (+${f!.points} ${f!.points === 1 ? 'punto' : 'puntos'})`)
      .join('\n');

    const text = `📋 EVALUACIÓN DE RIESGO DE CAPRINI (TROMBOEMBOLISMO VENOSO - TEV)
-----------------------------------------------------------
Puntaje Total: ${capriniScore} puntos
Estratificación: ${capriniAssessment.categoryTitle.toUpperCase()}
Incidencia estimada de TVP sin profilaxis: ${capriniAssessment.incidenceText}

Factores de Riesgo Identificados:
${selectedLabels || '  • Ningún factor seleccionado (Riesgo basal / muy bajo)'}

Recomendación Profiláctica Perioperatoria:
- Mecánica: ${capriniAssessment.profilaxisText}
- Farmacológica sugerida: ${capriniAssessment.profilaxisDrug}

Recomendaciones de Seguridad Anestésica (Neuroaxial / ASRA):
- HBPM dosis profiláctica (Enoxaparina 20-40 mg SC/día): Intervalo mínimo de 12 horas antes de punción espinal/epidural o retiro de catéter.
- HBPM dosis terapéutica (1 mg/kg c/12h): Intervalo mínimo de 24 horas.
- Retiro de catéter: Reiniciar HBPM al menos 4 horas después del retiro del catéter.
- HNF profiláctica SC (5000 UI): Intervalo mínimo de 4 a 6 horas.
- Deambulación temprana y adecuada hidratación postoperatoria.

Evaluado en AnestesiaPro (Dr. Carlos Leal).`;

    navigator.clipboard.writeText(text);
    setCapriniCopied(true);
    setTimeout(() => setCapriniCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Escalas Usadas en Anestesiología</h2>
            <p className="text-xs text-slate-400">
              Evaluación estandarizada de estado físico (ASA), riesgo de Caprini (TEV), dolor, sedación, bloqueo motor y criterios URPA
            </p>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Escalas Clínicas en Anestesiología & URPA"
        description="Baremación estandarizada: Estado Físico ASA I-VI con ejemplos clínicos, Escala de Riesgo de Caprini (TEV/TVP/TEP), Criterios de Aldrete modificado para alta URPA, escala de dolor EVA, bloqueo de Bromage y sedación de Ramsay/RASS."
        shareText="📋 Colega, te recomiendo revisar las Escalas Clínicas de Anestesiología en AnestesiaPro: clasificación ASA I-VI, Escala de Caprini (tromboprofilaxis perioperatoria), criterios de alta URPA (Aldrete modificado), Bromage, EVA y sedación Ramsay/RASS:"
        tabParam="escalas"
        theme="cyan"
      />

      {/* Control Bar: Expandir / Recoger Todas */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl text-xs shadow-sm">
        <div className="flex items-center gap-2 text-slate-300 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>9 escalas clínicas organizadas en acordeón. Toca cualquier escala o la flecha para desplegarla.</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={expandAll}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              allOpen
                ? 'bg-slate-800 text-slate-500'
                : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40'
            }`}
            title="Desplegar todas las escalas simultáneamente"
          >
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Desplegar Todas</span>
          </button>
          <button
            onClick={collapseAll}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer text-xs ${
              !anyOpen
                ? 'bg-slate-800 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Recoger y cerrar todas las escalas"
          >
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            <span>Recoger Todas</span>
          </button>
        </div>
      </div>

      {/* 0. Clasificación del Estado Físico ASA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('asaMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🫁 Clasificación del Estado Físico ASA (ASA I - VI)
            </span>
            <span className="bg-slate-800 text-cyan-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-700">
              Estratificación Perioperatoria
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.asaMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.asaMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              Sistema de estratificación de riesgo quirúrgico perioperatorio estandarizado por la American Society of Anesthesiologists.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {Object.keys(asaDescriptions).map((key) => {
                const isSelected = selectedAsa === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAsa(key)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-cyan-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                    }`}
                  >
                    {asaDescriptions[key].title}
                  </button>
                );
              })}
            </div>

            <div className="bg-indigo-950/40 border border-indigo-800/60 p-4 rounded-xl">
              <h4 className="text-sm font-extrabold text-cyan-300">{asaDescriptions[selectedAsa].title}</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{asaDescriptions[selectedAsa].desc}</p>
              <div className="mt-2.5 pt-2.5 border-t border-indigo-800/40 text-[11px] text-indigo-200/90 font-medium italic">
                <strong>Ejemplo Clínico:</strong> {asaDescriptions[selectedAsa].example}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
              Bibliografía: ASA House of Delegates Standard Classification of Physical Status.
            </p>
          </div>
        )}
      </div>

      {/* 0.5. ÍNDICE DE SHOCK (SHOCK INDEX & SHOCK INDEX MODIFICADO) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('shockMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🩸 Índice de Shock (Shock Index: IS & MSI)
            </span>
            <span className="bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              Hemorragia & Hipoperfusión
            </span>
            {pasVal > 0 && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                shockIndex >= 0.9 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                  : 'bg-slate-800 text-emerald-300 border-slate-700'
              }`}>
                IS: {shockIndex.toFixed(2)}
              </span>
            )}
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.shockMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.shockMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              El <strong>Índice de Shock (IS = FC / PAS)</strong> es un marcador temprano de inestabilidad hemodinámica e hipoperfusión tisular, superior a los signos vitales aislados para detectar choque hipovolémico u obstructivo antes de que aparezca hipotensión.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Frecuencia Cardíaca (FC)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={30}
                    max={250}
                    value={fcShock}
                    onChange={(e) => setFcShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  PA Sistólica (PAS)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={40}
                    max={260}
                    value={pasShock}
                    onChange={(e) => setPasShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-emerald-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">mmHg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  PA Diastólica (PAD)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={20}
                    max={180}
                    value={padShock}
                    onChange={(e) => setPadShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-amber-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">mmHg</span>
                </div>
              </div>
            </div>

            {/* PROMINENT MEAN ARTERIAL PRESSURE (PAM / PA MEDIA) DISPLAY FOR ANESTHESIOLOGISTS */}
            <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
              pamVal > 0 && pamVal < 65
                ? 'bg-gradient-to-r from-red-950/80 via-rose-900/60 to-slate-950 border-red-500/80 text-red-100'
                : 'bg-gradient-to-r from-cyan-950/80 via-indigo-950/60 to-slate-950 border-cyan-400/60 text-cyan-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 font-black text-lg border ${
                  pamVal > 0 && pamVal < 65 ? 'bg-red-900/80 border-red-400 text-red-200' : 'bg-cyan-900/80 border-cyan-400 text-cyan-200'
                }`}>
                  PAM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                      🎯 PRESIÓN ARTERIAL MEDIA (PAM)
                    </span>
                    <span className="text-[10px] bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-bold px-2 py-0.5 rounded-md">
                      [PAS + 2(PAD)] / 3
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {pamVal > 0 ? (
                      pamVal < 65 ? (
                        <span className="text-rose-300 font-bold">⚠️ PAM &lt; 65 mmHg: Hipoperfusión tisular intraoperatoria. Riesgo de lesión renal/miocárdica aguda.</span>
                      ) : (
                        <span className="text-emerald-300 font-bold">✅ PAM ≥ 65 mmHg: Rango de perfusión tisular y autoregulación de órganos diana adecuado.</span>
                      )
                    ) : (
                      'Ingrese PAS y PAD para calcular la Presión Arterial Media automatizada.'
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-400 block">PA Media Actual</span>
                <span className={`text-3xl font-black ${pamVal > 0 && pamVal < 65 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {pamVal > 0 ? Math.round(pamVal) : '--'}
                  <span className="text-sm font-normal text-slate-400 ml-1">mmHg</span>
                </span>
              </div>
            </div>

            {/* HIGH-RISK CLINICAL ALERT BANNER */}
            {(shockIndex >= 0.9 || modifiedShockIndex > 1.3) && (
              <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-500 rounded-2xl p-4 text-white shadow-xl animate-pulse space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-rose-300 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-rose-100 uppercase tracking-wide">
                        🚨 ALERTA CRÍTICA: RIESGO DE SHOCK / HIPOPERFUSIÓN TISULAR
                      </h4>
                      <p className="text-xs text-rose-200 mt-0.5">
                        {shockIndex > 1.0 
                          ? 'Índice de Shock > 1.0: Compatible con hemorragia de Grado III-IV (>30% de volemia) o disfunción hemodinámica severa.' 
                          : 'Índice de Shock 0.9 - 1.0: Datos iniciales de hipoperfusión. Alto riesgo de descompensación hemodinámica.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => playNotificationChime()}
                    className="p-2 bg-rose-900/80 hover:bg-rose-800 border border-rose-400/50 rounded-xl text-rose-200 hover:text-white transition-all shrink-0 cursor-pointer"
                    title="Emitir tono de alerta hemodinámica"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-800/80">
                  <button
                    onClick={() => setShowShockProtocol(!showShockProtocol)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{showShockProtocol ? 'Ocultar Protocolo' : 'Ver Protocolo de Reanimación'}</span>
                  </button>

                  <button
                    onClick={handleCopyShockReport}
                    className="bg-slate-900/90 hover:bg-slate-800 text-rose-200 border border-rose-500/40 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedShockAlert ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedShockAlert ? '¡Reporte Copiado!' : 'Copiar Informe'}</span>
                  </button>
                </div>

                {/* EXPANDABLE PROTOCOL GUIDE */}
                {showShockProtocol && (
                  <div className="mt-3 bg-slate-950 p-3.5 rounded-xl border border-rose-500/50 text-xs text-slate-200 space-y-2 animate-fadeIn">
                    <p className="font-black text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Protocolo de Manejo Rápido (Shock Hemorrágico / Hipovolémico):</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      <li><strong>Accesos Venosos:</strong> Colocar 2 vías periféricas de gran calibre (14G o 16G) o vía central si está disponible.</li>
                      <li><strong>Hemoderivados & Transfusión Masiva:</strong> Prealerta a banco de sangre. Ratio equilibrado 1:1:1 (Concentrado de Glóbulos Rojos : Plasma Fresco Congelado : Plaquetas).</li>
                      <li><strong>Ácido Tranexámico (TXA):</strong> Administrar 1g IV en bolo temprano (&lt;3 horas desde el evento) y posterior infusión de 1g en 8h.</li>
                      <li><strong>Soporte Vasoactivo:</strong> Iniciar Noradrenalina precoz si PAM &lt; 65 mmHg a pesar de inicio de resucitación.</li>
                      <li><strong>Control Hemostático Definitivo:</strong> Empaquetamiento, pinzamiento arterial quirúrgico o embolización angiográfica inmediata.</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* RESULTS DASHBOARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* SHOCK INDEX CLÁSICO */}
              <div className={`p-4 rounded-2xl border ${
                shockIndex > 1.0
                  ? 'bg-rose-950/60 border-rose-500/80 text-rose-100'
                  : shockIndex >= 0.9
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-100'
                  : shockIndex >= 0.7
                  ? 'bg-yellow-950/40 border-yellow-500/60 text-yellow-100'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">Índice de Shock Clásico (FC / PAS)</span>
                  <span className="text-2xl font-black">{shockIndex > 0 ? shockIndex.toFixed(2) : '--'}</span>
                </div>
                <p className="text-xs font-bold mt-2">
                  {shockIndex > 1.0
                    ? '🚨 SHOCK SEVERO / ALTO RIESGO (IS > 1.0)'
                    : shockIndex >= 0.9
                    ? '⚠️ SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)'
                    : shockIndex >= 0.7
                    ? '⚡ SHOCK LEVE / ALERTA (IS 0.7 - 0.9)'
                    : '✅ NORMAL (IS 0.5 - 0.7)'}
                </p>
                <p className="text-[11px] opacity-90 mt-1">
                  {shockIndex > 1.0
                    ? 'Indicativo de pérdida hemática masiva (>30%), hipoperfusión grave, necesidad inminente de transfusión de hemoderivados y protocolo de trauma/shock.'
                    : shockIndex >= 0.9
                    ? 'Sugiere pérdida sanguínea ~20-30% o sepsis temprana. Monitoreo continuo, reanimación con fluidos y preparación de hemoderivados.'
                    : shockIndex >= 0.7
                    ? 'Límite superior normal o leve depletación de volumen. Vigilar tendencia.'
                    : 'Hemodinamia estable. Ausencia de datos de hipoperfusión por este índice.'}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <button
                    onClick={handleCopyShockReport}
                    className="text-[11px] font-extrabold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShockAlert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShockAlert ? '¡Reporte Copiado!' : 'Copiar Informe Clínico'}</span>
                  </button>

                  <button
                    onClick={() => playNotificationChime()}
                    className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    title="Probar sonido de alerta"
                  >
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Tono Alerta</span>
                  </button>
                </div>
              </div>

              {/* MODIFIED SHOCK INDEX (MSI) */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Índice de Shock Modificado (FC / PAM)</span>
                  <span className="text-2xl font-black text-cyan-400">{modifiedShockIndex > 0 ? modifiedShockIndex.toFixed(2) : '--'}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">🎯 PA Media (PAM):</span>
                  <span className={`text-sm font-black ${pamVal > 0 && pamVal < 65 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {pamVal > 0 ? Math.round(pamVal) : '--'} mmHg
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  <strong>Puntos de corte MSI:</strong> Normal: 0.7 - 1.3 &bull; Anormal (&gt;1.3 o &lt;0.7): Alto riesgo de vasoplejía o choque.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-800/40 text-[11px] text-slate-300 space-y-1.5">
              <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>💡 Perla Clínica Anestésica (Dr. Carlos Leal):</span>
              </p>
              <p>
                En anestesia intraoperatoria, la <strong>Presión Arterial Media (PAM)</strong> es el determinante crítico de autoregulación renal, cerebral y coronaria. Mantener una <strong>PAM ≥ 65 mmHg</strong> reduce drásticamente el riesgo de infarto miocárdico o falla renal aguda perioperatoria. El Índice de Shock Modificado (MSI = FC/PAM) combina esta variable vital con la frecuencia cardíaca.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 0.8. ESCALA DE CAPRINI (RIESGO DE TROMBOEMBOLISMO VENOSO - TEV / TVP / TEP) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('capriniMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🛡️ Escala de Caprini (Riesgo Tromboembólico Venoso - TEV)
            </span>
            <span className="bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
              Tromboprofilaxis Perioperatoria
            </span>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border transition-all ${
              capriniScore === 0
                ? 'bg-slate-800 text-slate-300 border-slate-700'
                : capriniScore <= 2
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : capriniScore <= 4
                ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                : capriniScore <= 8
                ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                : 'bg-gradient-to-r from-purple-950 to-rose-950 text-rose-200 border-rose-400 animate-pulse'
            }`}>
              Score: {capriniScore} pts &bull; {capriniAssessment.categoryTitle.split('(')[0].trim()}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.capriniMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.capriniMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            {/* Description */}
            <p className="text-slate-300">
              El <strong>Modelo de Riesgo de Caprini</strong> es el estándar internacionalmente validado por el American College of Chest Physicians (ACCP/Chest) para estratificar el riesgo de <strong>Tromboembolismo Venoso (TVP / TEP)</strong> en pacientes quirúrgicos y definir la indicación de tromboprofilaxis mecánica, farmacológica o combinada.
            </p>

            {/* STRATIFICATION RESULT DASHBOARD */}
            <div className={`p-4 rounded-2xl border transition-all shadow-md ${
              capriniScore === 0
                ? 'bg-slate-950 border-slate-800 text-slate-200'
                : capriniScore <= 2
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                : capriniScore <= 4
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                : capriniScore <= 8
                ? 'bg-rose-950/50 border-rose-500/60 text-rose-100'
                : 'bg-gradient-to-r from-purple-950/80 via-rose-950/80 to-slate-950 border-rose-400 text-rose-100'
            }`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black border ${
                    capriniScore === 0
                      ? 'bg-slate-900 border-slate-700 text-slate-300'
                      : capriniScore <= 2
                      ? 'bg-emerald-900/60 border-emerald-400 text-emerald-200'
                      : capriniScore <= 4
                      ? 'bg-amber-900/60 border-amber-400 text-amber-200'
                      : 'bg-rose-900/70 border-rose-400 text-rose-100 animate-pulse'
                  }`}>
                    <span className="text-2xl leading-none">{capriniScore}</span>
                    <span className="text-[9px] uppercase font-bold text-slate-300">puntos</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black uppercase tracking-wide">
                        {capriniAssessment.categoryTitle}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 border border-slate-700">
                        {capriniAssessment.incidenceText}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {capriniSelectedIds.length} factor(es) de riesgo activo(s).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyCapriniReport}
                    className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                    title="Copiar reporte clínico de Caprini al portapapeles"
                  >
                    {capriniCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{capriniCopied ? '¡Copiado!' : 'Copiar Reporte'}</span>
                  </button>

                  <button
                    onClick={() => setShowCapriniNeuroaxialTiming(!showCapriniNeuroaxialTiming)}
                    className="bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow"
                    title="Ver pautas de seguridad para punción neuroaxial (ASRA)"
                  >
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>{showCapriniNeuroaxialTiming ? 'Ocultar Tiempos' : 'Tiempos Neuroaxial'}</span>
                  </button>

                  {capriniSelectedIds.length > 0 && (
                    <button
                      onClick={() => setCapriniSelectedIds([])}
                      className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 rounded-xl transition-all cursor-pointer"
                      title="Reiniciar y desmarcar todos los factores"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Specific Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-3 text-xs">
                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wide flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Tromboprofilaxis Recomendada:</span>
                  </span>
                  <p className="text-slate-200 font-medium">
                    {capriniAssessment.profilaxisText}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fármaco / Esquema Sugerido:</span>
                  </span>
                  <p className="text-slate-200 font-bold">
                    {capriniAssessment.profilaxisDrug}
                  </p>
                </div>
              </div>
            </div>

            {/* TIMING NEUROAXIAL & HEMATOMA ESPINAL (ASRA GUIDELINES) */}
            {showCapriniNeuroaxialTiming && (
              <div className="bg-indigo-950/40 border border-indigo-500/50 rounded-2xl p-4 text-xs space-y-3 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-200">
                  <Clock className="w-5 h-5 text-indigo-400 shrink-0" />
                  <h4 className="font-extrabold text-sm text-indigo-100 uppercase tracking-wide">
                    ⏱️ Intervalos de Seguridad Anestésica para Anestesia Neuroaxial (Guías ASRA / ESRA)
                  </h4>
                </div>
                <p className="text-indigo-200/90 text-[11px]">
                  Para prevenir el <strong>hematoma espinal/epidural</strong>, respete estrictamente los tiempos de espera entre la administración de anticoagulantes y la punción neuroaxial o retiro del catéter peridural:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-cyan-300 block">HBPM Profiláctica</span>
                    <span className="text-[10px] text-slate-400 block">(Enoxaparina 20-40 mg SC/día)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Esperar <strong>mínimo 12 horas</strong> antes de punción o retiro de catéter.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-amber-300 block">HBPM Terapéutica</span>
                    <span className="text-[10px] text-slate-400 block">(Enoxaparina 1 mg/kg c/12h)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Esperar <strong>mínimo 24 horas</strong> antes de punción o retiro de catéter.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-emerald-300 block">Reinicio Post-Retiro de Catéter</span>
                    <span className="text-[10px] text-slate-400 block">(Cualquier dosis de HBPM)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Esperar <strong>al menos 4 horas</strong> posteriores al retiro para la siguiente dosis.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-rose-300 block">HNF Profiláctica SC</span>
                    <span className="text-[10px] text-slate-400 block">(5,000 UI SC cada 8-12h)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Esperar <strong>4 a 6 horas</strong> antes de punción o manipulación de catéter.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-purple-300 block">Anticoagulantes Orales Directos</span>
                    <span className="text-[10px] text-slate-400 block">(Rivaroxaban, Apixaban, Dabigatran)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Suspender <strong>48 a 72 horas</strong> antes (según aclaramiento de creatinina).
                    </p>
                  </div>

                  <div className="p-3 bg-slate-950/90 rounded-xl border border-indigo-500/30 space-y-1">
                    <span className="font-extrabold text-slate-300 block">Antiagregantes Plaquetarios</span>
                    <span className="text-[10px] text-slate-400 block">(AAS y Clopidogrel)</span>
                    <p className="text-[11px] text-slate-200 font-medium pt-1">
                      Aspirina aislada no contraindica. Clopidogrel: suspender <strong>5 a 7 días</strong> previos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PRESETS / ESCENARIOS CLÍNICOS FRECUENTES */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Carga Rápida de Casos Clínicos Típicos:</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleApplyCapriniPreset(0)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs cursor-pointer group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-emerald-300 block">🟢 Basal / Cirugía Menor</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">0-1 pt (Riesgo Bajo)</span>
                </button>

                <button
                  onClick={() => handleApplyCapriniPreset(3)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs cursor-pointer group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-amber-300 block">🟡 Laparotomía &gt; 45m</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">3 pts (Riesgo Moderado)</span>
                </button>

                <button
                  onClick={() => handleApplyCapriniPreset(6)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs cursor-pointer group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-rose-300 block">🟠 Neoplasia + Cirugía Mayor</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">6 pts (Riesgo Alto)</span>
                </button>

                <button
                  onClick={() => handleApplyCapriniPreset(8)}
                  className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all text-xs cursor-pointer group"
                >
                  <span className="font-bold text-slate-300 group-hover:text-purple-300 block">🔴 Artroplastia Ortopédica</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">7-8 pts (Riesgo Muy Alto)</span>
                </button>
              </div>
            </div>

            {/* FILTER TABS & SEARCH */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setCapriniFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    capriniFilter === 'all'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todos ({CAPRINI_FACTORS.length})
                </button>
                <button
                  onClick={() => setCapriniFilter('1_punto')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    capriniFilter === '1_punto'
                      ? 'bg-blue-600 text-white font-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  1 Punto (15)
                </button>
                <button
                  onClick={() => setCapriniFilter('2_puntos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    capriniFilter === '2_puntos'
                      ? 'bg-emerald-600 text-white font-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  2 Puntos (7)
                </button>
                <button
                  onClick={() => setCapriniFilter('3_puntos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    capriniFilter === '3_puntos'
                      ? 'bg-amber-600 text-white font-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  3 Puntos (9)
                </button>
                <button
                  onClick={() => setCapriniFilter('5_puntos')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    capriniFilter === '5_puntos'
                      ? 'bg-rose-600 text-white font-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  5 Puntos (4)
                </button>
              </div>

              <div className="relative w-full sm:w-auto sm:min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar factor de riesgo..."
                  value={capriniSearch}
                  onChange={(e) => setCapriniSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* FACTORS CHECKLIST GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[440px] overflow-y-auto pr-1">
              {filteredCapriniFactors.map((factor) => {
                const isSelected = capriniSelectedIds.includes(factor.id);
                return (
                  <button
                    key={factor.id}
                    onClick={() => toggleCapriniItem(factor.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? factor.points === 5
                          ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-md ring-1 ring-rose-500/50'
                          : factor.points === 3
                          ? 'bg-amber-950/60 border-amber-500 text-amber-100 shadow-md ring-1 ring-amber-500/50'
                          : factor.points === 2
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-blue-950/60 border-blue-500 text-blue-100 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1">
                      <div className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-all ${
                        isSelected
                          ? factor.points === 5
                            ? 'bg-rose-500 border-rose-400 text-white'
                            : factor.points === 3
                            ? 'bg-amber-500 border-amber-400 text-slate-950'
                            : factor.points === 2
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'bg-blue-500 border-blue-400 text-white'
                          : 'border-slate-600 bg-slate-900'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-medium leading-snug">{factor.label}</span>
                    </div>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 ${
                      factor.points === 5
                        ? 'bg-rose-950 border border-rose-500/50 text-rose-300'
                        : factor.points === 3
                        ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                        : factor.points === 2
                        ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                        : 'bg-blue-950 border border-blue-500/50 text-blue-300'
                    }`}>
                      +{factor.points} {factor.points === 1 ? 'pto' : 'ptos'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE SELECTIONS CHIPS (IF ANY) */}
            {capriniSelectedIds.length > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">
                    Factores Seleccionados ({capriniSelectedIds.length}):
                  </span>
                  <button
                    onClick={() => setCapriniSelectedIds([])}
                    className="text-[10px] text-rose-400 hover:text-rose-300 underline font-medium cursor-pointer"
                  >
                    Borrar todos
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {capriniSelectedIds.map((id) => {
                    const factor = CAPRINI_FACTORS.find((f) => f.id === id);
                    if (!factor) return null;
                    return (
                      <span
                        key={id}
                        onClick={() => toggleCapriniItem(id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-200 text-[11px] cursor-pointer transition-colors"
                        title="Toca para eliminar este factor"
                      >
                        <span>{factor.label}</span>
                        <span className="text-cyan-400 font-black">+{factor.points}</span>
                        <span className="text-slate-500 hover:text-rose-400 ml-0.5">&times;</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
              Bibliografía: Caprini JA. Risk assessment as a guide for the prevention of the many faces of venous thromboembolism. Am J Surg. 2010; Chest 2012 / 2016 Guidelines for Prevention of VTE in Surgical Patients.
            </p>
          </div>
        )}
      </div>

      {/* 1. Escala Visual Análoga (EVA / VAS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('evaMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              📊 Escala Visual Análoga del Dolor (EVA / VAS)
            </span>
            <span className="bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Dolor Agudo (0-10)
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.evaMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.evaMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Herramienta psicométrica unidimensional validada para la medición objetiva de la intensidad del dolor postoperatorio, guiando la escalera analgésica de la OMS.
            </p>
            <EvaScaleDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Huskisson EC. Measurement of pain. Lancet. 1974.
            </p>
          </div>
        )}
      </div>

      {/* 2. Escala POGO (Percentage of Glottic Opening) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('pogoMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🎯 Escala POGO (Percentage of Glottic Opening)
            </span>
            <span className="bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Apertura Glótica (0-100%)
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.pogoMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.pogoMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Evaluación cuantitativa directa de la exposición laríngea en laringoscopia directa y videolaringoscopia (0% a 100%), con mayor reproducibilidad inter-observador que Cormack-Lehane.
            </p>
            <PogoScaleDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Levitan RM, et al. Assessment of airway visualization using the percentage of glottic opening (POGO) scale. Acad Emerg Med. 1998.
            </p>
          </div>
        )}
      </div>

      {/* 3. Ramsay */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('ramsayMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              😴 Escala de Sedación de Ramsay
            </span>
            <span className="bg-indigo-950/60 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Sedoanalgesia (Nivel 1-6)
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.ramsayMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.ramsayMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Creada para evaluar la profundidad de la sedación en pacientes críticos o bajo sedoanalgesia en salas de procedimientos, permitiendo titulación precisa de medicación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-amber-400 block">Nivel 1</span>
                Despierto, ansioso, agitado o inquieto.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-emerald-400 block">Nivel 2 (Objetivo ideal)</span>
                Despierto, cooperador, tranquilo y orientado.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-cyan-400 block">Nivel 3</span>
                Sedado, responde únicamente a órdenes verbales.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-blue-400 block">Nivel 4</span>
                Sueño profundo, respuesta rápida al estímulo glabelar o auditivo fuerte.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-indigo-400 block">Nivel 5</span>
                Sueño profundo, respuesta perezosa o perezosa al estímulo doloroso.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-rose-400 block">Nivel 6</span>
                Sin respuesta a estímulos (anestesia profunda).
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Ramsay MA, et al. Controlled sedation with alphaxalone-alphadolone. Br Med J. 1974.
            </p>
          </div>
        )}
      </div>

      {/* 2. Bromage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('bromageMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🦵 Escala de Bloqueo Motor (Bromage)
            </span>
            <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Bloqueo Espinal / Epidural
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.bromageMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.bromageMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Valoración continua del bloqueo motor en miembros inferiores en anestesia neuraxial (espinal o epidural) durante la recuperación postoperatoria.
            </p>
            <BromageDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Bromage PR. Acta Anaesthesiol Scand. 1965.
            </p>
          </div>
        )}
      </div>

      {/* 3. Aldrete Index + Interactive Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('aldreteMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🏥 Criterios de Aldrete Modificado (Alta de URPA)
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
              totalAldrete >= 9
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}>
              Puntaje: {totalAldrete}/10 {totalAldrete >= 9 ? '• ✅ Apto Egreso' : '• ⏳ Permanecer'}
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.aldreteMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.aldreteMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              Sistema objetivo para valorar la estabilidad del paciente en URPA (Unidad de Recuperación Postanestésica). Un puntaje <strong>≥ 9 puntos</strong> indica aptitud para egreso a sala general.
            </p>

            {/* Interactive Aldrete Selector */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Calculadora Interactiva de Aldrete
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {/* Actividad */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">1. Actividad Motora</label>
                  <select
                    value={aldrete.actividad}
                    onChange={(e) => setAldrete((p) => ({ ...p, actividad: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Mueve 4 extremidades (2 pts)</option>
                    <option value={1}>Mueve 2 extremidades (1 pt)</option>
                    <option value={0}>Mueve 0 extremidades (0 pts)</option>
                  </select>
                </div>

                {/* Respiración */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">2. Respiración</label>
                  <select
                    value={aldrete.respiracion}
                    onChange={(e) => setAldrete((p) => ({ ...p, respiracion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Capaz de toser/respirar profundo (2 pts)</option>
                    <option value={1}>Disnea o respiración limitada (1 pt)</option>
                    <option value={0}>Apnea / Asistencia mecánica (0 pts)</option>
                  </select>
                </div>

                {/* Circulación */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">3. Circulación (PA)</label>
                  <select
                    value={aldrete.circulacion}
                    onChange={(e) => setAldrete((p) => ({ ...p, circulacion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>PA ± 20% del nivel preanestésico (2 pts)</option>
                    <option value={1}>PA ± 20-50% del preanestésico (1 pt)</option>
                    <option value={0}>PA ± &gt;50% del preanestésico (0 pts)</option>
                  </select>
                </div>

                {/* Conciencia */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">4. Conciencia</label>
                  <select
                    value={aldrete.conciencia}
                    onChange={(e) => setAldrete((p) => ({ ...p, conciencia: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Completamente despierto (2 pts)</option>
                    <option value={1}>Responde al llamado (1 pt)</option>
                    <option value={0}>No responde (0 pts)</option>
                  </select>
                </div>

                {/* Saturación */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">5. Saturación O2</label>
                  <select
                    value={aldrete.saturacion}
                    onChange={(e) => setAldrete((p) => ({ ...p, saturacion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>SpO2 &gt; 92% a aire ambiente (2 pts)</option>
                    <option value={1}>Requiere O2 para SpO2 &gt; 90% (1 pt)</option>
                    <option value={0}>SpO2 &lt; 90% con O2 suplementario (0 pts)</option>
                  </select>
                </div>
              </div>

              {/* Score result */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  totalAldrete >= 9
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-sm">
                    Puntaje Aldrete: {totalAldrete} / 10 Puntos
                  </span>
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
                  {totalAldrete >= 9 ? '✅ APTO PARA EGRESO DE URPA' : '⏳ PERMANECER EN URPA'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1">
              Bibliografía: Aldrete JA, Kroulik D. A postanesthetic recovery score. Anesth Analg. 1970.
            </p>
          </div>
        )}
      </div>

      {/* 4. RASS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('rassMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer group"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-extrabold text-white group-hover:text-cyan-300 transition-colors">
              🧠 Escala de Agitación-Sedación Richmond (RASS)
            </span>
            <span className="bg-purple-950/60 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Graduación (-5 a +4)
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-slate-700 transition-colors shrink-0 ml-2">
            {openSubmenu.rassMenu ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </button>

        {openSubmenu.rassMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Escala de 10 puntos altamente validada para graduar agitación o profundidad de sedación en anestesia y UCI.
            </p>

            <div className="space-y-1.5 font-medium">
              <div className="p-2 bg-rose-950/40 rounded-xl border border-rose-800/40 text-rose-200 flex justify-between">
                <span><strong>+4 Combativo:</strong> Violento, peligro inmediato para el equipo.</span>
              </div>
              <div className="p-2 bg-rose-950/30 rounded-xl border border-rose-800/30 text-rose-300 flex justify-between">
                <span><strong>+3 Muy agitado:</strong> Jala tubos o catéteres, agresivo.</span>
              </div>
              <div className="p-2 bg-amber-950/30 rounded-xl border border-amber-800/30 text-amber-200 flex justify-between">
                <span><strong>+2 Agitado:</strong> Movimientos desorganizados frecuentes.</span>
              </div>
              <div className="p-2 bg-amber-950/20 rounded-xl border border-amber-800/20 text-amber-300 flex justify-between">
                <span><strong>+1 Inquieto:</strong> Ansioso pero movimientos no agresivos.</span>
              </div>
              <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-500/50 text-emerald-200 font-bold flex justify-between">
                <span><strong>0 Alerta y tranquilo:</strong> Estado óptimo basal.</span>
              </div>
              <div className="p-2 bg-cyan-950/30 rounded-xl border border-cyan-800/30 text-cyan-200 flex justify-between">
                <span><strong>-1 Somnoliento:</strong> Despierta a la voz con contacto visual &gt; 10 seg.</span>
              </div>
              <div className="p-2 bg-indigo-950/30 rounded-xl border border-indigo-800/30 text-indigo-200 flex justify-between">
                <span><strong>-2 Sedación ligera:</strong> Despierta a la voz con contacto visual &lt; 10 seg.</span>
              </div>
              <div className="p-2 bg-blue-950/30 rounded-xl border border-blue-800/30 text-blue-200 flex justify-between">
                <span><strong>-3 Sedación moderada:</strong> Movimiento a la voz pero sin contacto visual.</span>
              </div>
              <div className="p-2 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-300 flex justify-between">
                <span><strong>-4 Sedación profunda:</strong> Sin respuesta a la voz, respuesta al dolor físico.</span>
              </div>
              <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400 flex justify-between">
                <span><strong>-5 Sin respuesta:</strong> Sin respuesta a ningún estímulo físico ni verbal.</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Sessler CN, et al. Am J Respir Crit Care Med. 2002.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

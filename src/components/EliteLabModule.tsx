import React, { useState } from 'react';
import { 
  Award, ShieldCheck, Brain, Key, Palette, Play, 
  RotateCcw, Sparkles, Check, Copy, CreditCard 
} from 'lucide-react';

interface SimulationCase {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  patient: string;
  surgery: string;
  initialVitals: {
    fc: string;
    pa: string;
    spo2: string;
    etco2: string;
    ecg: string;
  };
  context: string;
  question1: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  question2: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  resolutionSummary: string;
}

const SIMULATION_CASES: SimulationCase[] = [
  {
    id: "case-vortex",
    title: "Crisis de Vía Aérea Imprevista (No Intubo, No Oxigeno)",
    category: "Vía Aérea",
    difficulty: "Experto",
    patient: "Masculino de 52 años, IMC 38 kg/m², cuello corto, Mallampati III.",
    surgery: "Apendicectomía laparoscópica de urgencia bajo anestesia general.",
    initialVitals: {
      fc: "118 lpm",
      pa: "145/90 mmHg",
      spo2: "84% (en descenso)",
      etco2: "Indetectable",
      ecg: "Taquicardia sinusal"
    },
    context: "Tras inducción de secuencia rápida con Propofol y Succinilcolina, se realiza laringoscopia directa con pala Macintosh #3 observando Cormack-Lehane IV. Tras 2 intentos fallidos de intubación endotraqueal y ventilación con mascarilla facial inefectiva (SpO2 cae a 78%), el paciente entra en situación crítica.",
    question1: {
      prompt: "Siguiendo el abordaje VORTEX y Guías DAS, ¿cuál es la acción INMEDIATA prioritaria?",
      options: [
        "Realizar un tercer intento de intubación con hoja Miller recta con más fuerza de tracción.",
        "Insertar inmediatamente un Dispositivo Supraglótico (Mascara Laríngea de 2da generación) y optimizar ventilación.",
        "Administrar 100 mg adicionales de Succinilcolina para relajar mejor la mandíbula.",
        "Proceder de inmediato a cricotiroidotomía quirúrgica sin intentar supraglótico."
      ],
      correctIndex: 1,
      explanation: "El algoritmo VORTEX establece optimizar una de las 3 líneas no invasivas (Mascarilla facial, Supraglótico, Tubo endotraqueal). El rescate supraglótico con dispositivo de 2da generación (ej. i-gel, ProSeal) es mandatorio antes de declarar la vía aérea infraglótica fallida."
    },
    question2: {
      prompt: "Se coloca máscara laríngea pero persiste fuga masiva y la SpO2 cae a 65% con bradicardia reactiva a 44 lpm. ¿Conducta definitiva?",
      options: [
        "Declarar CICO (Cannot Intubate, Cannot Oxygenate) y realizar acceso de cuello anterior (Cricotiroidotomía scalpel-bougie-tubo).",
        "Intentar despertar al paciente administrando atropina y esperar que ventile solo.",
        "Intentar fibrobroncoscopio flexible a través de la máscara laríngea con fuga.",
        "Repetir bolo de relajante neuromuscular."
      ],
      correctIndex: 0,
      explanation: "Ante falla confirmada de las 3 líneas no invasivas con hipoxemia extrema y bradicardia, se declara emergencia CICO y se ejecuta acceso quirúrgico al cuello con técnica de bisturí, bougie y tubo cuffed 6.0 mm sin demora."
    },
    resolutionSummary: "Manejo exitoso mediante rescate quirúrgico inmediato. El reconocimiento precoz del fracaso supraglótico evitó el paro hipóxico irreversible y daño neurológico anóxico."
  },
  {
    id: "case-hm",
    title: "Hipertermia Maligna en Quirófano Central",
    category: "Crisis Quirófano",
    difficulty: "Experto",
    patient: "Femenina de 24 años, sana previamente, programada para colecistectomía.",
    surgery: "Colecistectomía laparoscópica bajo anestesia balanceada (Sevoflurano + Fentanilo).",
    initialVitals: {
      fc: "148 lpm",
      pa: "160/95 mmHg",
      spo2: "96%",
      etco2: "78 mmHg (elevación sostenida)",
      ecg: "Taquicardia sinusal con extrasístoles ventriculares frecuentes"
    },
    context: "A los 35 minutos de cirugía, el capnógrafo muestra un ascenso inexorable del EtCO2 de 35 a 78 mmHg a pesar de duplicar la ventilación minuto. Se detecta rigidez muscular en extremidades, taquiarritmia y la temperatura esofágica asciende a 39.4 °C rápidamente.",
    question1: {
      prompt: "¿Cuáles son las DOS acciones iniciales simultáneas e inaplazables?",
      options: [
        "Aumentar la concentración de Sevoflurano para profundizar y dar más opioide.",
        "Suspender inmediatamente el Sevoflurano, hiperventilar con O2 al 100% a flujos altos (>10 L/min) y pedir ayuda / carro de Dantroleno.",
        "Administrar gluconato de calcio y continuar la cirugía con el agente inhalatorio.",
        "Solicitar gasometría y esperar confirmación bioquímica de acidosis láctica."
      ],
      correctIndex: 1,
      explanation: "El paso cero es cortar el agente disparador (halogenados/succinilcolina), hiperventilar a flujos máximos para lavar el circuito y movilizar a todo el equipo para preparar Dantroleno sódico."
    },
    question2: {
      prompt: "¿Cuál es la dosis inicial recomendada de Dantroleno sódico EV?",
      options: [
        "0.5 mg/kg en infusión para 2 horas.",
        "2.5 mg/kg en bolo EV rápido, repitiendo según respuesta hasta 10 mg/kg.",
        "10 mg/kg en bolo único directo sin diluir.",
        "1 mg total para evitar debilidad muscular posterior."
      ],
      correctIndex: 1,
      explanation: "La dosis inicial de Dantroleno es de 2.5 mg/kg en bolo EV rápido. Cada frasco contiene 20 mg de Dantroleno y 3 g de manitol, reconstituidos en 60 mL de agua estéril bidestilada sin agentes bacteriostáticos."
    },
    resolutionSummary: "Control hemodinámico y térmico logrado tras la primera dosis de Dantroleno (2.5 mg/kg), enfriamiento activo no invasivo y corrección del medio interno."
  },
  {
    id: "case-shock-obstetrico",
    title: "Shock Hemorrágico Obstétrico / Atonía Uterina Masiva",
    category: "Obstetricia",
    difficulty: "Avanzado",
    patient: "Multípara de 31 años, embarazo gemelar, cesárea segmentaria bajo anestesia raquídea.",
    surgery: "Cesárea electiva.",
    initialVitals: {
      fc: "135 lpm",
      pa: "65/35 mmHg",
      spo2: "93%",
      etco2: "18 mmHg (en caída)",
      ecg: "Taquicardia sinusal severa"
    },
    context: "Tras la extracción de ambos recién nacidos y alumbramiento placentario, se presenta sangrado genital masivo (>1.800 mL) con útero hipotónico irreductible al masaje bimanual. El Índice de Shock es de 2.07 (Shock Grave).",
    question1: {
      prompt: "¿Cuál es la estrategia farmacológica y transfusional coordinada inmediata?",
      options: [
        "Administrar 4 litros de Ringer Lactato tibio a chorro sin hemoderivados.",
        "Uterotónicos escalonados (Oxitocina infusión + Metilergonovina o Ácido Tranexámico 1g EV) y activación de Protocolo de Transfusión Masiva (PTM 1:1:1).",
        "Esperar el recuento plaquetario de laboratorio antes de administrar cualquier hemoderivado.",
        "Inducir inmediatamente con Tiopental y relajación profunda."
      ],
      correctIndex: 1,
      explanation: "El manejo del shock hemorrágico obstétrico exige ácido tranexámico precoz (1 g EV en los primeros minutos), uterotónicos de segunda línea y activación de Transfusión Masiva con ratio 1:1:1 (Concentrado de Hematíes : Plasma : Plaquetas) para evitar la coagulopatía por dilución."
    },
    question2: {
      prompt: "¿Qué fármaco uterotónico está CONTRAINDICADO si la paciente presenta hipertensión gestacional / preeclampsia concomitante?",
      options: [
        "Oxitocina",
        "Metilergonovina (Methergin)",
        "Misoprostol",
        "Carbetocina"
      ],
      correctIndex: 1,
      explanation: "La Metilergonovina provoca vasoconstricción periférica intensa y espasmo arterial, estando formalmente contraindicada en pacientes hipertensas o con preeclampsia por riesgo de crisis hipertensiva, hemorragia intracraneal y edema agudo de pulmón."
    },
    resolutionSummary: "Paciente estabilizada con Ácido Tranexámico, infusión de Noradrenalina titulada, balones intrauterinos de taponamiento y hemoderivados tempranos."
  }
];

interface SavedLicense {
  key: string;
  name: string;
  type: string;
  date: string;
}

export const EliteLabModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulador' | 'licencias' | 'apariencia'>('simulador');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [simStep, setSimStep] = useState<'intro' | 'q1' | 'q2' | 'summary'>('intro');
  const [selectedAnswerQ1, setSelectedAnswerQ1] = useState<number | null>(null);
  const [selectedAnswerQ2, setSelectedAnswerQ2] = useState<number | null>(null);
  const [caseScore, setCaseScore] = useState(0);

  // License manager state
  const [generatedKey, setGeneratedKey] = useState('');
  const [licenseType, setLicenseType] = useState('anual');
  const [buyerName, setBuyerName] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedLicenses, setSavedLicenses] = useState<SavedLicense[]>(() => {
    try {
      const stored = localStorage.getItem('anestesiapro_elite_saved_licenses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const currentCase = SIMULATION_CASES[selectedCaseIdx];

  const handleGenerateLicense = () => {
    const prefix = licenseType === 'vitalicia' ? 'VIP' : licenseType === 'anual' ? 'ANUAL' : 'MES';
    const r1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const r2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const num = Math.floor(1000 + Math.random() * 9000);
    const key = `ELITE-${prefix}-${r1}-${r2}-${num}`;

    setGeneratedKey(key);
    setCopiedKey(false);

    if (buyerName.trim()) {
      const updated = [
        {
          key,
          name: buyerName.trim(),
          type: licenseType,
          date: new Date().toLocaleDateString('es-ES')
        },
        ...savedLicenses
      ];
      setSavedLicenses(updated);
      try {
        localStorage.setItem('anestesiapro_elite_saved_licenses', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving license to localStorage', err);
      }
    }
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-purple-950/80 to-slate-950 border-2 border-amber-500/60 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-inner">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-1.5">
                  AnestesiaPro <span className="text-amber-300">Élite</span>
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                  Privado • Dr. Carlos Leal
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                Laboratorio exclusivo para desarrollo de IA Clínica, Simulador de Casos y Monetización de Licencias.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Invisible para el público
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>🤖 Simulador Clínico con IA</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('licencias')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'licencias'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔑 Gestor de Licencias & Venta</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('apariencia')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apariencia'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Probador de Temas (Privado)</span>
        </button>
      </div>

      {/* TAB 1: SIMULADOR CLÍNICO */}
      {activeTab === 'simulador' && (
        <div className="space-y-4">
          {/* Case selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SIMULATION_CASES.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedCaseIdx(idx);
                  setSimStep('intro');
                  setSelectedAnswerQ1(null);
                  setSelectedAnswerQ2(null);
                  setCaseScore(0);
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedCaseIdx === idx
                    ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    {c.category}
                  </span>
                  <span className="text-rose-400">{c.difficulty}</span>
                </div>
                <h4 className="text-xs font-black text-white line-clamp-2">
                  {c.title}
                </h4>
              </button>
            ))}
          </div>

          {/* Operating room multi-parameter monitor */}
          <div className="bg-black rounded-2xl border-2 border-emerald-500/40 p-3.5 shadow-2xl space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-black text-emerald-400 tracking-wider">
                  MONITOR MULTIPARÁMETRO QUIRÓFANO #1
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-300/70">
                PABELLÓN CENTRAL • EN VIVO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block">FC (lpm)</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {currentCase.initialVitals.fc}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block">PA (mmHg)</span>
                <span className="text-base sm:text-lg font-black text-cyan-400">
                  {currentCase.initialVitals.pa}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block">SpO2 (%)</span>
                <span className="text-base sm:text-lg font-black text-amber-400">
                  {currentCase.initialVitals.spo2}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block">EtCO2</span>
                <span className="text-base sm:text-lg font-black text-purple-400">
                  {currentCase.initialVitals.etco2}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">ECG</span>
                <span className="text-xs font-black text-rose-400 truncate block">
                  {currentCase.initialVitals.ecg}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical case active content */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentCase.category}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white">
                  {currentCase.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-1">
                <strong>Paciente:</strong> {currentCase.patient} • <strong>Procedimiento:</strong> {currentCase.surgery}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              <span className="text-amber-400 font-bold block mb-1">
                🚨 Evento Crítico Intraoperatorio:
              </span>
              {currentCase.context}
            </div>

            {simStep === 'intro' && (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  El paciente requiere intervención de juicio clínico inmediato. Deberás tomar 2 decisiones críticas secuenciales bajo presión de tiempo simulada.
                </p>
                <button
                  type="button"
                  onClick={() => setSimStep('q1')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Comenzar Toma de Decisión Clínica</span>
                </button>
              </div>
            )}

            {simStep === 'q1' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>DECISIÓN 1 DE 2: PRIORIDAD INMEDIATA</span>
                  <span>Puntuación: {caseScore} pts</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white">
                  {currentCase.question1.prompt}
                </p>

                <div className="space-y-2">
                  {currentCase.question1.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswerQ1 === optIdx;
                    const isCorrect = optIdx === currentCase.question1.correctIndex;
                    const isAnswered = selectedAnswerQ1 !== null;

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          setSelectedAnswerQ1(optIdx);
                          if (isCorrect) setCaseScore(prev => prev + 50);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                              : isSelected
                              ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswerQ1 !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-amber-300">Fundamento Clínico:</strong> {currentCase.question1.explanation}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setSimStep('q2')}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs cursor-pointer active:scale-95"
                      >
                        Avanzar a Decisión 2 →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {simStep === 'q2' && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>DECISIÓN 2 DE 2: RESOLUCIÓN DEFINITIVA</span>
                  <span>Puntuación: {caseScore} pts</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white">
                  {currentCase.question2.prompt}
                </p>

                <div className="space-y-2">
                  {currentCase.question2.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswerQ2 === optIdx;
                    const isCorrect = optIdx === currentCase.question2.correctIndex;
                    const isAnswered = selectedAnswerQ2 !== null;

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => {
                          setSelectedAnswerQ2(optIdx);
                          if (isCorrect) setCaseScore(prev => prev + 50);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                          isAnswered
                            ? isCorrect
                              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                              : isSelected
                              ? 'bg-rose-950/60 border-rose-400 text-rose-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                            : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedAnswerQ2 !== null && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      <strong className="text-amber-300">Fundamento Clínico:</strong> {currentCase.question2.explanation}
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => setSimStep('summary')}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2 rounded-xl text-xs cursor-pointer active:scale-95"
                      >
                        Ver Evaluación y Resumen del Caso →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {simStep === 'summary' && (
              <div className="bg-slate-950 border-2 border-amber-400/50 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-black text-white">Evaluación de Competencia Quirúrgica</h4>
                      <p className="text-[11px] text-slate-400">Caso: {currentCase.title}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">{caseScore}/100</span>
                    <span className="text-[10px] text-slate-400 block font-bold">Puntaje Clínico</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Debriefing Clínico:</strong>
                  {currentCase.resolutionSummary}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSimStep('intro');
                      setSelectedAnswerQ1(null);
                      setSelectedAnswerQ2(null);
                      setCaseScore(0);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Repetir Caso</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const next = (selectedCaseIdx + 1) % SIMULATION_CASES.length;
                      setSelectedCaseIdx(next);
                      setSimStep('intro');
                      setSelectedAnswerQ1(null);
                      setSelectedAnswerQ2(null);
                      setCaseScore(0);
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl cursor-pointer active:scale-95"
                  >
                    Siguiente Caso Clínico →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: GESTOR DE LICENCIAS & VENTA */}
      {activeTab === 'licencias' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-black text-white">Generador de Claves de Activación (Licencias Pro)</h4>
                  <p className="text-xs text-slate-400">Crea códigos oficiales para entregar a tus clientes o colegas tras el pago.</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Módulo Comercial
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Nombre del Médico / Comprador</label>
                <input
                  type="text"
                  placeholder="Ej: Dr. Mario Hernández"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Tipo de Licencia</label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                >
                  <option value="anual">Anual (Sugerido: $12 - $15 USD)</option>
                  <option value="mensual">Mensual (Sugerido: $3 - $5 USD)</option>
                  <option value="vitalicia">Vitalicia / Full VIP (Sugerido: $25 - $35 USD)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateLicense}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Código Pro</span>
                </button>
              </div>
            </div>

            {generatedKey && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-fadeIn">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                    Clave de Licencia Lista para Enviar al Cliente:
                  </span>
                  <code className="text-sm sm:text-base font-mono font-black text-white tracking-wider">
                    {generatedKey}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyKey}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 active:scale-95 shrink-0"
                >
                  {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? '¡Copiado!' : 'Copiar para WhatsApp'}</span>
                </button>
              </div>
            )}

            {savedLicenses.length > 0 && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  Historial de Licencias Emitidas ({savedLicenses.length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {savedLicenses.map((lic, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-white mr-2">{lic.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 text-emerald-300 uppercase border border-slate-800">
                          {lic.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-[11px] font-mono text-slate-300">{lic.key}</code>
                        <span className="text-[10px] text-slate-500">{lic.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              Métodos de Cobro Recomendados para el Dr. Carlos Leal:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-cyan-300 block">📱 Pago Móvil (Venezuela)</strong>
                <p className="text-[11px] text-slate-400">
                  Ideal para residentes y anestesiólogos de hospitales venezolanos a tasa BCV.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-emerald-300 block">💵 Zelle / Dólares Cash</strong>
                <p className="text-[11px] text-slate-400">
                  Para clínicas privadas, clínicas estéticas y compras anuales directas.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <strong className="text-amber-300 block">🌐 Binance Pay / USDT</strong>
                <p className="text-[11px] text-slate-400">
                  Para colegas en Colombia, Chile, México, España o el resto de Latinoamérica.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROBADOR DE TEMAS */}
      {activeTab === 'apariencia' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-sky-400" />
            <div>
              <h4 className="text-sm font-black text-white">Simulador de Apariencia & Temas (Solo visible en tu sesión)</h4>
              <p className="text-xs text-slate-400">Prueba cómo se ve el modo claro o los estilos avanzados sin que ningún usuario externo lo note.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">☀️ Modo Blanco Quirófano</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold">Luminoso</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Interfaz blanca pura clínica con tarjetas iluminadas y textos negros de alto contraste.
              </p>
              <button
                type="button"
                onClick={() => {
                  document.documentElement.setAttribute('data-theme', 'claro');
                  alert('Tema Claro activado en tu navegador de prueba.');
                }}
                className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs py-2 rounded-xl cursor-pointer"
              >
                Probar Modo Claro
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">🇻🇪 Tricolor Venezolano</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Patrio</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Botones con degradado tricolor amarillo, azul y rojo con detalles dorados.
              </p>
              <button
                type="button"
                onClick={() => {
                  document.documentElement.setAttribute('data-theme', 'venezuela');
                  alert('Tema Tricolor activado en tu navegador de prueba.');
                }}
                className="w-full bg-gradient-to-r from-amber-500 via-blue-600 to-rose-600 text-white font-black text-xs py-2 rounded-xl cursor-pointer"
              >
                Probar Tricolor
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                document.documentElement.removeAttribute('data-theme');
                alert('Restaurado a apariencia oscura clásica.');
              }}
              className="text-xs text-slate-400 hover:text-white bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 cursor-pointer"
            >
              Restaurar Estilo Clásico
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

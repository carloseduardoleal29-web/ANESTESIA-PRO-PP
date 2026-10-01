import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertTriangle, Clock, Play, Pause, RotateCcw, 
  CheckSquare, Square, Copy, Check, Sparkles, Syringe, HeartCrack,
  Flame, Wind, Skull, Droplets, Volume2, VolumeX, Info, ArrowRight,
  CheckCircle2, FileText, Share2, HelpCircle, LayoutGrid, ChevronDown,
  ChevronUp, Activity, Zap, X, Filter, Stethoscope, AlertCircle
} from 'lucide-react';
import { CRISIS_PROTOCOLS_BANK, CrisisProtocol } from './crisisProtocolsData';
import { orAudio } from '../../utils/orAudio';

export const OperatingRoomCrisisModule: React.FC = () => {
  // Selected Crisis
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('last_toxicity');
  
  // Submenu Selector states
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Patient Weight (kg) - defaults to 70kg, adjustable for pediatric or adult
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);

  // Crisis Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<any>(null);

  // Sound alert active
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);

  // Completed checklist step IDs mapped by crisis ID
  const [completedSteps, setCompletedSteps] = useState<Record<string, Record<string, boolean>>>({});

  // Copy status
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Find active protocol
  const activeProtocol: CrisisProtocol = 
    CRISIS_PROTOCOLS_BANK.find(p => p.id === selectedProtocolId) || CRISIS_PROTOCOLS_BANK[0];

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          const next = prev + 1;
          // Play warning chime every 2 minutes (120s) if audio enabled to mark CPR cycles or reassessment
          if (audioEnabled && next > 0 && next % 120 === 0) {
            try {
              orAudio.playNibpChime();
            } catch (e) {}
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, audioEnabled]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    if (!isTimerRunning && timerSeconds === 0) {
      if (audioEnabled) {
        try {
          orAudio.playNibpChime();
        } catch (e) {}
      }
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleToggleStep = (stepId: string) => {
    setCompletedSteps(prev => {
      const currentCrisisSteps = prev[activeProtocol.id] || {};
      const nextVal = !currentCrisisSteps[stepId];
      if (nextVal && audioEnabled) {
        try {
          orAudio.playPulseBeep(98);
        } catch (e) {}
      }
      return {
        ...prev,
        [activeProtocol.id]: {
          ...currentCrisisSteps,
          [stepId]: nextVal
        }
      };
    });
  };

  const handleResetCurrentChecklist = () => {
    setCompletedSteps(prev => ({
      ...prev,
      [activeProtocol.id]: {}
    }));
  };

  // Steps completion calculation
  const currentCrisisStepsRecord = completedSteps[activeProtocol.id] || {};
  const completedCount = activeProtocol.steps.filter(s => currentCrisisStepsRecord[s.id]).length;
  const totalCount = activeProtocol.steps.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Copy structured clinical event log
  const handleCopyEventReport = () => {
    const executedStepsTitles = activeProtocol.steps
      .filter(s => currentCrisisStepsRecord[s.id])
      .map(s => `  [✓] ${s.title}`)
      .join('\n');

    const pendingStepsTitles = activeProtocol.steps
      .filter(s => !currentCrisisStepsRecord[s.id])
      .map(s => `  [ ] ${s.title}`)
      .join('\n');

    const calculatedDrugs = activeProtocol.drugs.map(d => {
      const calc = d.calculateDose(patientWeightKg);
      return `  - ${d.name}: ${calc.doseText} (${calc.volumeText})`;
    }).join('\n');

    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

    const report = `========================================================
REGISTRO DE CRISIS INTRAOPERATORIA - ANESTESIAPRO ELITE
========================================================
Fecha: ${dateStr} | Hora de Registro: ${timeStr}
Evento: ${activeProtocol.title}
Peso del Paciente: ${patientWeightKg} kg
Tiempo en Crisis Registrado: ${formatTimer(timerSeconds)}
Pasos Completados: ${completedCount}/${totalCount} (${completionPercent}%)

1. ACCIÓN INMEDIATA EJECUTADA:
${activeProtocol.immediateAction}

2. FÁRMACOS DE RESCATE DOSIFICADOS (${patientWeightKg} kg):
${calculatedDrugs}

3. CHECKLIST Y PASOS COGNITIVOS EJECUTADOS:
${executedStepsTitles || '  (Ninguno marcado aún)'}

${pendingStepsTitles ? `4. PASOS PENDIENTES / DE SOPORTE:\n${pendingStepsTitles}\n` : ''}
5. ADVERTENCIAS Y ERRORES EVITADOS:
${activeProtocol.lethalErrors.map(e => `  ! ${e}`).join('\n')}

========================================================
Registro generado para Historia Clínica Anestesiológica
Dr. Carlos Leal / AnestesiaPro Elite
========================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  // Navigation helpers
  const currentCrisisIndex = CRISIS_PROTOCOLS_BANK.findIndex((p) => p.id === selectedProtocolId);
  const handleNextCrisis = () => {
    const nextIdx = (currentCrisisIndex + 1) % CRISIS_PROTOCOLS_BANK.length;
    setSelectedProtocolId(CRISIS_PROTOCOLS_BANK[nextIdx].id);
  };
  const handlePrevCrisis = () => {
    const prevIdx = (currentCrisisIndex - 1 + CRISIS_PROTOCOLS_BANK.length) % CRISIS_PROTOCOLS_BANK.length;
    setSelectedProtocolId(CRISIS_PROTOCOLS_BANK[prevIdx].id);
  };

  // Helper category grouping for submenu
  const getCrisisCategoryGroup = (proto: CrisisProtocol) => {
    if (proto.id === 'last_toxicity' || proto.id === 'total_spinal_anesthesia') return 'neuroaxial';
    if (proto.id === 'intraoperative_arrhythmias' || proto.id === 'intraoperative_arrest') return 'cardiovascular';
    if (proto.id === 'difficult_airway_cico' || proto.id === 'laryngo_bronchospasm' || proto.id === 'tension_pneumothorax') return 'respiratorio';
    return 'shock';
  };

  const filteredProtocols = CRISIS_PROTOCOLS_BANK.filter((proto) => {
    if (categoryFilter === 'all') return true;
    return getCrisisCategoryGroup(proto) === categoryFilter;
  });

  // Helper icon for crisis category
  const getCrisisIcon = (id: string, sizeClass = "w-4 h-4") => {
    switch (id) {
      case 'total_spinal_anesthesia':
        return <Zap className={`${sizeClass} text-purple-400`} />;
      case 'intraoperative_arrhythmias':
        return <Activity className={`${sizeClass} text-amber-400 animate-pulse`} />;
      case 'tension_pneumothorax':
        return <Wind className={`${sizeClass} text-sky-400`} />;
      case 'air_amniotic_embolism':
        return <Skull className={`${sizeClass} text-rose-400`} />;
      case 'last_toxicity':
        return <Syringe className={`${sizeClass} text-emerald-400`} />;
      case 'malignant_hyperthermia':
        return <Flame className={`${sizeClass} text-amber-400`} />;
      case 'difficult_airway_cico':
        return <Wind className={`${sizeClass} text-cyan-400`} />;
      case 'anaphylaxis_crisis':
        return <AlertTriangle className={`${sizeClass} text-rose-400`} />;
      case 'laryngo_bronchospasm':
        return <ShieldAlert className={`${sizeClass} text-teal-400`} />;
      case 'intraoperative_arrest':
        return <HeartCrack className={`${sizeClass} text-rose-500 animate-pulse`} />;
      case 'massive_hemorrhage':
        return <Droplets className={`${sizeClass} text-red-500`} />;
      default:
        return <ShieldAlert className={`${sizeClass} text-slate-400`} />;
    }
  };

  const getCrisisCardTheme = (id: string) => {
    switch (id) {
      case 'total_spinal_anesthesia':
        return {
          categoryLabel: 'NEUROAXIAL',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          accentBorder: 'hover:border-purple-500/60',
          activeRing: 'ring-2 ring-purple-400 border-purple-500 bg-purple-950/40',
          iconBg: 'bg-purple-900/40 text-purple-300 border-purple-700/50'
        };
      case 'intraoperative_arrhythmias':
        return {
          categoryLabel: 'CARDIOVASCULAR',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentBorder: 'hover:border-amber-500/60',
          activeRing: 'ring-2 ring-amber-400 border-amber-500 bg-amber-950/40',
          iconBg: 'bg-amber-900/40 text-amber-300 border-amber-700/50'
        };
      case 'tension_pneumothorax':
        return {
          categoryLabel: 'RESPIRATORIO',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          accentBorder: 'hover:border-sky-500/60',
          activeRing: 'ring-2 ring-sky-400 border-sky-500 bg-sky-950/40',
          iconBg: 'bg-sky-900/40 text-sky-300 border-sky-700/50'
        };
      case 'air_amniotic_embolism':
        return {
          categoryLabel: 'EMBOLISMO & SHOCK',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accentBorder: 'hover:border-rose-500/60',
          activeRing: 'ring-2 ring-rose-400 border-rose-500 bg-rose-950/40',
          iconBg: 'bg-rose-900/40 text-rose-300 border-rose-700/50'
        };
      case 'last_toxicity':
        return {
          categoryLabel: 'TOXICIDAD AL',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          accentBorder: 'hover:border-emerald-500/60',
          activeRing: 'ring-2 ring-emerald-400 border-emerald-500 bg-emerald-950/40',
          iconBg: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50'
        };
      case 'malignant_hyperthermia':
        return {
          categoryLabel: 'HIPERMETABOLISMO',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentBorder: 'hover:border-amber-500/60',
          activeRing: 'ring-2 ring-amber-400 border-amber-500 bg-amber-950/40',
          iconBg: 'bg-amber-900/40 text-amber-300 border-amber-700/50'
        };
      case 'difficult_airway_cico':
        return {
          categoryLabel: 'VÍA AÉREA',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          accentBorder: 'hover:border-cyan-500/60',
          activeRing: 'ring-2 ring-cyan-400 border-cyan-500 bg-cyan-950/40',
          iconBg: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50'
        };
      case 'anaphylaxis_crisis':
        return {
          categoryLabel: 'INMUNOLÓGICO',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          accentBorder: 'hover:border-rose-500/60',
          activeRing: 'ring-2 ring-rose-400 border-rose-500 bg-rose-950/40',
          iconBg: 'bg-rose-900/40 text-rose-300 border-rose-700/50'
        };
      case 'laryngo_bronchospasm':
        return {
          categoryLabel: 'VÍA AÉREA',
          badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          accentBorder: 'hover:border-teal-500/60',
          activeRing: 'ring-2 ring-teal-400 border-teal-500 bg-teal-950/40',
          iconBg: 'bg-teal-900/40 text-teal-300 border-teal-700/50'
        };
      case 'intraoperative_arrest':
        return {
          categoryLabel: 'PARO CARDIACO',
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
          accentBorder: 'hover:border-red-500/60',
          activeRing: 'ring-2 ring-red-500 border-red-500 bg-red-950/50',
          iconBg: 'bg-red-900/50 text-red-300 border-red-700/50'
        };
      case 'massive_hemorrhage':
        return {
          categoryLabel: 'CÓDIGO ROJO',
          badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
          accentBorder: 'hover:border-red-500/60',
          activeRing: 'ring-2 ring-red-400 border-red-500 bg-red-950/40',
          iconBg: 'bg-red-900/40 text-red-300 border-red-700/50'
        };
      default:
        return {
          categoryLabel: 'EMERGENCIA QX',
          badgeColor: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
          accentBorder: 'hover:border-slate-500/60',
          activeRing: 'ring-2 ring-amber-400 border-slate-700 bg-slate-800/40',
          iconBg: 'bg-slate-800 text-slate-300 border-slate-700'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER PRINCIPAL DEL MÓDULO DE CRISIS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-rose-600/25">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Manual de Crisis & Algoritmos Cognitivos Intraoperatorios
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black tracking-wider uppercase">
                  11 PROTOCOLOS ÉLITE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Checklists de emergencia en tiempo real, dosificación de rescate exacta por peso y prevención de errores fatales.
              </p>
            </div>
          </div>

          {/* CRONÓMETRO DE CRISIS & PESO DEL PACIENTE */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
            {/* Peso Paciente */}
            <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
              <span className="text-[11px] font-bold text-slate-400">Peso:</span>
              <input
                type="number"
                min={3}
                max={180}
                value={patientWeightKg}
                onChange={(e) => setPatientWeightKg(Math.max(1, Number(e.target.value) || 1))}
                className="w-16 bg-slate-900 border border-slate-700 text-amber-300 font-mono font-bold text-sm px-2 py-1 rounded-lg text-center focus:outline-none focus:border-amber-400"
              />
              <span className="text-xs font-bold text-slate-300">kg</span>
            </div>

            {/* Cronómetro de Emergencia */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                <Clock className={`w-4 h-4 ${isTimerRunning ? 'text-rose-400 animate-spin' : 'text-slate-400'}`} />
                <span className={`font-mono text-base font-black ${isTimerRunning ? 'text-rose-400' : 'text-slate-200'}`}>
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleTimer}
                className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isTimerRunning 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
                title={isTimerRunning ? 'Pausar Cronómetro' : 'Iniciar Tiempo en Crisis'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                className="p-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                title="Reiniciar Cronómetro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  audioEnabled 
                    ? 'bg-cyan-950 border-cyan-500/50 text-cyan-300' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
                title={audioEnabled ? 'Alertas de sonido activadas' : 'Alertas de sonido desactivadas'}
              >
                {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* CENTRO DE MANDO: SELECTOR PRINCIPAL LLAMATIVO CON SUBMENÚ DESPLEGABLE */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Banner de Crisis Activa */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-500/50 flex items-center justify-center shrink-0 shadow-lg">
                {getCrisisIcon(activeProtocol.id, "w-6 h-6")}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    CRISIS ACTIVA: {activeProtocol.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    SEVERIDAD: {activeProtocol.severity.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                  {activeProtocol.title}
                </h2>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {activeProtocol.subtitle}
                </p>
              </div>
            </div>

            {/* Acciones del Selector: Botón Submenú Llamativo + Dropdown Rápido + Navegadores */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Botón Principal Desplegable del Submenú */}
              <button
                type="button"
                onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-lg ${
                  isSubmenuOpen
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 ring-2 ring-amber-400'
                    : 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-700 hover:brightness-110 text-white shadow-rose-600/30'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>{isSubmenuOpen ? 'Ocultar Catálogo de Crisis' : '🚨 Ver Catálogo de Crisis (11)'}</span>
                {isSubmenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Selector Rápido Directo (Dropdown) */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 px-2.5 py-1.5 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Rápido:</span>
                <select
                  value={selectedProtocolId}
                  onChange={(e) => {
                    setSelectedProtocolId(e.target.value);
                    setIsSubmenuOpen(false);
                  }}
                  className="bg-transparent text-xs font-bold text-amber-300 focus:outline-none cursor-pointer pr-1"
                >
                  {CRISIS_PROTOCOLS_BANK.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                      {p.shortTitle}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flechas Prev / Next */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevCrisis}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title="Crisis Anterior"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={handleNextCrisis}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                  title="Crisis Siguiente"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* SUBMENÚ DESPLEGABLE TIPO BENTO GRID (ESTILO MÓDULO CALCULADORAS) */}
          {isSubmenuOpen && (
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-3 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    Catálogo Completo de Algoritmos Cognitivos (11 Emergencias Intraoperatorias)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmenuOpen(false)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer self-end sm:self-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  Cerrar
                </button>
              </div>

              {/* Pestañas de Filtrado por Categoría */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    categoryFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Todas ({CRISIS_PROTOCOLS_BANK.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('neuroaxial')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    categoryFilter === 'neuroaxial'
                      ? 'bg-purple-600 text-white font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  💉 Neuroaxial & Anestésicos (2)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('cardiovascular')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    categoryFilter === 'cardiovascular'
                      ? 'bg-amber-600 text-white font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  ⚡ Cardiovascular & Arritmias (2)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('respiratorio')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    categoryFilter === 'respiratorio'
                      ? 'bg-sky-600 text-white font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🫁 Vía Aérea & Tórax (3)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('shock')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                    categoryFilter === 'shock'
                      ? 'bg-rose-600 text-white font-black shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  🩸 Shock, Metabólico & Embolismos (4)
                </button>
              </div>

              {/* GRID DE CARDS LLAMATIVAS DE CRISIS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[500px] overflow-y-auto p-1 scrollbar-thin">
                {filteredProtocols.map((proto) => {
                  const isSelected = proto.id === selectedProtocolId;
                  const theme = getCrisisCardTheme(proto.id);
                  const completedCountForThis = (completedSteps[proto.id] && Object.values(completedSteps[proto.id]).filter(Boolean).length) || 0;
                  
                  return (
                    <div
                      key={proto.id}
                      onClick={() => {
                        setSelectedProtocolId(proto.id);
                        setIsSubmenuOpen(false);
                      }}
                      className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left ${
                        isSelected
                          ? `${theme.activeRing} shadow-lg shadow-rose-950/40`
                          : `bg-slate-900/90 border-slate-800/90 ${theme.accentBorder} hover:bg-slate-850 hover:shadow-md`
                      }`}
                    >
                      <div>
                        {/* Cabecera de la Card */}
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${theme.badgeColor}`}>
                            {theme.categoryLabel}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 font-bold border border-rose-800/60">
                            {proto.severity.toUpperCase()}
                          </span>
                        </div>

                        {/* Icono + Título de la Emergencia */}
                        <div className="flex items-start gap-2.5">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${theme.iconBg}`}>
                            {getCrisisIcon(proto.id, "w-5 h-5")}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-white leading-tight">
                              {proto.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                              {proto.quickSummary || proto.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pie de Card: Pasos & Botón de Estado */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${completedCountForThis > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-slate-400 font-medium">
                            {completedCountForThis > 0 ? (
                              <strong className="text-emerald-400">{completedCountForThis}/{proto.steps.length} pasos</strong>
                            ) : (
                              `${proto.steps.length} pasos checklist`
                            )}
                          </span>
                        </div>

                        {isSelected ? (
                          <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/40">
                            ACTIVO AHORA
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-300 flex items-center gap-0.5">
                            Abrir Protocolo ➔
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BARRA HORIZONTAL RÁPIDA DE PILLS (Accesible permanentemente) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin pt-1">
            {CRISIS_PROTOCOLS_BANK.map((proto) => {
              const isSelected = proto.id === selectedProtocolId;
              const completedCountForThis = (completedSteps[proto.id] && Object.values(completedSteps[proto.id]).filter(Boolean).length) || 0;
              return (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => setSelectedProtocolId(proto.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400'
                      : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {getCrisisIcon(proto.id)}
                  <span>{proto.shortTitle}</span>
                  {completedCountForThis > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900/80 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                      {completedCountForThis}/{proto.steps.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DETALLE DE LA CRISIS ACTIVA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* COLUMNA IZQUIERDA: ALERTA INMEDIATA, ERRORES FATALES Y FÁRMACOS EXACTOS (5 COLS) */}
        <div className="lg:col-span-5 space-y-4">
          {/* BANNER 1: ACCIÓN INMEDIATA MINUTO CERO */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/80 via-slate-950 to-slate-950 border-2 border-rose-500/80 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                PRIMERA ACCIÓN INMEDIATA (MINUTO 0):
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800">
                CRÍTICO
              </span>
            </div>
            <p className="text-sm font-black text-white leading-snug">
              {activeProtocol.immediateAction}
            </p>
          </div>

          {/* BANNER 2: ERRORES FATALES / CONTRAINDICACIONES */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2.5">
            <div className="flex items-center gap-2">
              <Skull className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                ¡ERRORES FATALES A EVITAR! (QUÉ NO HACER)
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {activeProtocol.lethalErrors.map((err, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span className="leading-tight">{err}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SECCIÓN 3: DOSIFICACIÓN DE FÁRMACOS DE RESCATE EXACTOS PARA EL PESO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Syringe className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Fármacos de Rescate ({patientWeightKg} kg)
                </h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                Dosis Calculadas
              </span>
            </div>

            <div className="space-y-2.5">
              {activeProtocol.drugs.map((drug, idx) => {
                const calc = drug.calculateDose(patientWeightKg);
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      calc.highlight 
                        ? 'bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border-emerald-500/50 shadow-sm'
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-bold text-white text-xs block leading-tight">
                          {drug.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {drug.indication} • <span className="text-slate-300">{drug.concentrationText}</span>
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-emerald-300 block">
                          {calc.doseText}
                        </span>
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center justify-between font-mono text-amber-300 font-bold text-xs">
                        <span>Volumen / Dosis Práctica:</span>
                        <span>{calc.volumeText}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug pt-0.5 border-t border-slate-800">
                        💡 {calc.instructions}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: ALGORITMO PASO A PASO (CHECKLIST INTERACTIVO) Y REPORTE (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {/* HEADER DEL CHECKLIST INTERACTIVO */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Checklist & Algoritmo de Acción Guiada</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Marca cada paso conforme se ejecute para evitar omisiones bajo estrés.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono text-slate-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                  {completedCount} de {totalCount} pasos ({completionPercent}%)
                </span>
                <button
                  type="button"
                  onClick={handleResetCurrentChecklist}
                  className="text-[11px] text-slate-400 hover:text-white bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                  title="Reiniciar casillas de este protocolo"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {/* BARRA DE PROGRESO */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-300 ${
                  completionPercent === 100 
                    ? 'bg-emerald-500' 
                    : completionPercent > 50 
                    ? 'bg-amber-500' 
                    : 'bg-rose-500'
                }`}
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            {/* LISTA DE PASOS INTERACTIVOS */}
            <div className="space-y-2.5">
              {activeProtocol.steps.map((step) => {
                const isDone = !!currentCrisisStepsRecord[step.id];
                return (
                  <div
                    key={step.id}
                    onClick={() => handleToggleStep(step.id)}
                    className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                      isDone
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-slate-200'
                        : step.isCrucial
                        ? 'bg-slate-950 hover:bg-slate-900 border-rose-500/40'
                        : 'bg-slate-950 hover:bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isDone ? (
                        <CheckSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className={`w-5 h-5 shrink-0 ${step.isCrucial ? 'text-rose-400' : 'text-slate-500'}`} />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <span className={`text-xs font-black ${isDone ? 'text-emerald-300 line-through' : 'text-white'}`}>
                          {step.order}. {step.title}
                        </span>
                        {step.tag && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                            isDone 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                          }`}>
                            {step.tag}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isDone ? 'text-slate-400' : 'text-slate-300'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* BOTÓN COPIAR REPORTE CLÍNICO */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Registra todos los pasos y dosis calculadas en la nota anestesiológica.
              </span>
              <button
                type="button"
                onClick={handleCopyEventReport}
                className="w-full sm:w-auto bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReport ? '¡Reporte de Crisis Copiado!' : 'Copiar Registro del Evento'}</span>
              </button>
            </div>
          </div>

          {/* PERLAS CLÍNICAS COGNITIVAS */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Perlas Clínicas & Factores Humanos (Dr. Carlos Leal)
              </h4>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              {activeProtocol.cognitivePearls.map((pearl, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span>{pearl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

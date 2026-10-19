import React, { useState, useEffect } from 'react';
import { 
  Award, ShieldCheck, ShieldAlert, Brain, Key, Palette, Play, Pause,
  RotateCcw, Sparkles, Check, Copy, CreditCard,
  Filter, CheckCircle, XCircle, ArrowRight, BookOpen, UserCheck,
  Maximize2, Minimize2, X, Eye, EyeOff, ClipboardList, Trash2, Mail,
  Clock, Skull, AlertTriangle, Shuffle, ChevronDown, ChevronLeft, ChevronRight,
  LayoutGrid, Stethoscope, ZoomIn, HeartCrack, Download, Camera, Settings, Upload,
  FileText
} from 'lucide-react';
import { CLINICAL_CASE_BANK, AdvancedSimulationCase, ClinicalQuestion } from '../data/clinicalCaseBank';
import { OperatingRoomMonitor } from './OperatingRoomMonitor';
import { 
  getStoredResidentScores, 
  saveResidentScore, 
  clearResidentScores, 
  ResidentScoreRecord 
} from '../lib/caseScoresService';
import { orAudio } from '../utils/orAudio';
import { MedicalArticleTranslator } from './MedicalArticleTranslator';
import { 
  CustomCaseImage, 
  getAllCustomCaseImages, 
  getCustomCaseImage, 
  downloadCaseImage 
} from '../lib/caseImagesService';
import { CaseImageManagerModal } from './CaseImageManagerModal';
import { ElitePreanesthesiaModule } from './preanesthesia/ElitePreanesthesiaModule';
import { MedicalCalculatorsEliteModule } from './calculators/MedicalCalculatorsEliteModule';
import { OperatingRoomCrisisModule } from './crisis/OperatingRoomCrisisModule';

interface SavedLicense {
  key: string;
  name: string;
  type: string;
  date: string;
}

interface EliteLabModuleProps {
  initialTab?: 'simulador' | 'evaluaciones' | 'traductor' | 'licencias' | 'apariencia' | 'preanestesia' | 'calculadoras' | 'crisis';
}

export const EliteLabModule: React.FC<EliteLabModuleProps> = ({ initialTab = 'simulador' }) => {
  const [activeTab, setActiveTab] = useState<'simulador' | 'evaluaciones' | 'traductor' | 'licencias' | 'apariencia' | 'preanestesia' | 'calculadoras' | 'crisis'>(initialTab);

  // Sync activeTab if initialTab prop changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBlindMode, setIsBlindMode] = useState<boolean>(true); // Mode blind ON by default for residents!
  const [residentName, setResidentName] = useState<string>(() => {
    try {
      return localStorage.getItem('anestesiapro_current_resident_name') || 'Dr. Residente';
    } catch {
      return 'Dr. Residente';
    }
  });
  
  // Category filter for Case Bank
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState<number>(0);
  
  // Simulation progressive stages
  // 'intro' -> 'question' -> 'debriefing'
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState<boolean>(false);
  const [answeredHistory, setAnsweredHistory] = useState<{ [qId: string]: { selected: number; isCorrect: boolean } }>({});
  const [isCaseCompleted, setIsCaseCompleted] = useState<boolean>(false);
  const [residentScoresList, setResidentScoresList] = useState<ResidentScoreRecord[]>(() => getStoredResidentScores());

  // Timer & Patient Mortality state
  const [timerDuration, setTimerDuration] = useState<number>(90); // 60, 90, 120 seconds
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [hasTimerStarted, setHasTimerStarted] = useState<boolean>(false);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [autoStartTimer, setAutoStartTimer] = useState<boolean>(false);
  const [isPatientDead, setIsPatientDead] = useState<boolean>(false);
  const [deathCount, setDeathCount] = useState<number>(0);
  const [deathAdvanceCountdown, setDeathAdvanceCountdown] = useState<number | null>(null);

  // Custom Images Map and Image Manager Modal State (Exclusivo Dr. Carlos Leal)
  const [customImagesMap, setCustomImagesMap] = useState<Record<string, CustomCaseImage>>({});
  const [isImageManagerOpen, setIsImageManagerOpen] = useState<boolean>(false);

  // Author / Admin validation for Dr. Carlos Leal private panel
  const isDrCarlosLeal = typeof window !== 'undefined' && (
    localStorage.getItem('anestesiapro_is_author_admin') === 'true' ||
    localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
    sessionStorage.getItem('anestesiapro_author_session') === 'true' ||
    window.location.search.includes('admin=true')
  );

  // UI state for uncluttering: Card catalog hidden by default, dropdown/random used instead
  const [showCardsCatalog, setShowCardsCatalog] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string; badge: string; desc: string } | null>(null);

  // Load custom images from persistent service
  useEffect(() => {
    getAllCustomCaseImages().then(map => setCustomImagesMap(map));
    const handleImagesUpdated = () => {
      getAllCustomCaseImages().then(map => setCustomImagesMap(map));
    };
    window.addEventListener('anestesiapro_case_images_updated', handleImagesUpdated);
    window.addEventListener('anestesiapro-case-images-updated', handleImagesUpdated);
    return () => {
      window.removeEventListener('anestesiapro_case_images_updated', handleImagesUpdated);
      window.removeEventListener('anestesiapro-case-images-updated', handleImagesUpdated);
    };
  }, []);

  // Reload resident scores on event or tab
  const refreshScores = () => {
    setResidentScoresList(getStoredResidentScores());
  };

  useEffect(() => {
    const handleScoreAdded = () => refreshScores();
    window.addEventListener('anestesiapro_resident_score_added', handleScoreAdded);
    return () => window.removeEventListener('anestesiapro_resident_score_added', handleScoreAdded);
  }, []);

  // Filtered cases
  const filteredCases = selectedCategory === 'TODOS'
    ? CLINICAL_CASE_BANK
    : CLINICAL_CASE_BANK.filter(c => c.category === selectedCategory);

  const currentCase = filteredCases[selectedCaseIdx] || CLINICAL_CASE_BANK[0];
  const currentQuestion: ClinicalQuestion | undefined = currentCase.questions[currentQuestionIdx];

  // Effective imaging considering custom images or author hide preferences
  const customImg = currentCase ? customImagesMap[currentCase.id] : undefined;
  const isImageHidden = customImg?.hideImage === true;
  const effectiveImaging = isImageHidden
    ? null
    : (customImg?.imageUrl
        ? {
            type: customImg.type || currentCase?.imaging?.type || 'IMAGEN CLÍNICA',
            title: customImg.title || currentCase?.imaging?.title || 'Hallazgo Clínico',
            badge: customImg.badge || currentCase?.imaging?.badge || 'IMAGEN EDITADA',
            description: customImg.description || currentCase?.imaging?.description || '',
            realImageUrl: customImg.imageUrl,
            isCustom: true
          }
        : currentCase?.imaging
      );

  // Helper to format mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset timer on question change or case change - Waiting for user to click Comenzar
  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsPatientDead(false);
    setDeathAdvanceCountdown(null);
    if (autoStartTimer) {
      setHasTimerStarted(true);
      setIsTimerRunning(true);
    } else {
      setHasTimerStarted(false);
      setIsTimerRunning(false);
    }
  }, [currentCase?.id, currentQuestionIdx, timerDuration, autoStartTimer]);

  // Emergency countdown timer tick
  useEffect(() => {
    if (!isTimerRunning || isPatientDead || isAnswerConfirmed || isCaseCompleted) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsPatientDead(true);
          setIsTimerRunning(false);
          setDeathCount(c => c + 1);

          // Automatically record this question as failed due to time expiration
          if (currentQuestion) {
            setAnsweredHistory(prevHistory => ({
              ...prevHistory,
              [currentQuestion.id]: {
                selected: -1, // -1 means expired without decision
                isCorrect: false
              }
            }));
            setIsAnswerConfirmed(true);
          }

          // Start 5-second countdown to auto-advance to next question as requested
          setDeathAdvanceCountdown(5);

          try {
            orAudio.playFlatlineTone(6);
          } catch (e) {
            console.error('Audio flatline error:', e);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, isPatientDead, isAnswerConfirmed, isCaseCompleted, currentQuestion]);

  // Auto-advance countdown on patient death
  useEffect(() => {
    if (deathAdvanceCountdown === null) return;
    if (deathAdvanceCountdown <= 0) {
      setDeathAdvanceCountdown(null);
      handleNextQuestion();
      return;
    }

    const timer = setTimeout(() => {
      setDeathAdvanceCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [deathAdvanceCountdown]);

  // Licenses state
  const [buyerName, setBuyerName] = useState('');
  const [licenseType, setLicenseType] = useState('anual');
  const [generatedKey, setGeneratedKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedLicenses, setSavedLicenses] = useState<SavedLicense[]>(() => {
    try {
      const stored = localStorage.getItem('anestesiapro_elite_licenses');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Calculate score
  const totalQuestions = currentCase.questions.length;
  const correctCount = Object.values(answeredHistory).filter((h: { selected: number; isCorrect: boolean }) => h.isCorrect).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const resetCase = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswerIdx(null);
    setIsAnswerConfirmed(false);
    setAnsweredHistory({});
    setIsCaseCompleted(false);
    setIsPatientDead(false);
    setDeathAdvanceCountdown(null);
    setTimeLeft(timerDuration);
    setHasTimerStarted(autoStartTimer);
    setIsTimerRunning(autoStartTimer);
  };

  const handleRandomCase = () => {
    if (filteredCases.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredCases.length);
    if (nextIdx === selectedCaseIdx) {
      nextIdx = (nextIdx + 1) % filteredCases.length;
    }
    setSelectedCaseIdx(nextIdx);
    resetCase();
  };

  const handleNextCase = () => {
    const nextIdx = (selectedCaseIdx + 1) % filteredCases.length;
    setSelectedCaseIdx(nextIdx);
    resetCase();
  };

  const handlePrevCase = () => {
    const prevIdx = (selectedCaseIdx - 1 + filteredCases.length) % filteredCases.length;
    setSelectedCaseIdx(prevIdx);
    resetCase();
  };

  const handleStartTimer = () => {
    setHasTimerStarted(true);
    setIsTimerRunning(true);
  };

  const handleRevivePatient = () => {
    setIsPatientDead(false);
    setDeathAdvanceCountdown(null);
    setTimeLeft(timerDuration);
    setSelectedAnswerIdx(null);
    setIsAnswerConfirmed(false);
    setHasTimerStarted(true);
    setIsTimerRunning(true);
  };

  const handleSelectAnswer = (idx: number) => {
    if (isAnswerConfirmed || isPatientDead) return;
    setSelectedAnswerIdx(idx);
    if (!hasTimerStarted) {
      setHasTimerStarted(true);
      setIsTimerRunning(true);
    }
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswerIdx === null || !currentQuestion) return;
    const isCorrect = selectedAnswerIdx === currentQuestion.correctIndex;
    
    setAnsweredHistory(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selected: selectedAnswerIdx,
        isCorrect
      }
    }));
    setIsAnswerConfirmed(true);
    setIsTimerRunning(false); // pause timer on confirmation so user can read explanation

    if (!isCorrect) {
      try {
        orAudio.playCriticalAlarm();
      } catch (e) {}
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx + 1 < currentCase.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerConfirmed(false);
    } else {
      setIsCaseCompleted(true);
      // Automatically register evaluation score in private score storage
      try {
        const finalCorrect = Object.values(answeredHistory).filter((h: { selected: number; isCorrect: boolean }) => h.isCorrect).length;
        const finalTotal = currentCase.questions.length;
        const finalPercent = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0;
        
        let feedback: 'Excelente (Experto)' | 'Aprobado (Competente)' | 'Requiere Refuerzo' = 'Requiere Refuerzo';
        if (finalPercent >= 80) {
          feedback = 'Excelente (Experto)';
        } else if (finalPercent >= 60) {
          feedback = 'Aprobado (Competente)';
        }

        saveResidentScore({
          residentName: residentName.trim() || 'Dr. Residente',
          caseId: currentCase.id,
          caseCode: currentCase.title,
          category: currentCase.category,
          scorePercent: finalPercent,
          correctCount: finalCorrect,
          totalQuestions: finalTotal,
          feedbackLevel: feedback
        });
        refreshScores();
      } catch (err) {
        console.warn('Error saving resident score:', err);
      }
    }
  };

  const handleGenerateLicense = () => {
    if (!buyerName.trim()) {
      alert('Por favor escribe el nombre del médico comprador.');
      return;
    }
    const randomHex1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const prefix = licenseType === 'vitalicia' ? 'VIP' : licenseType === 'mensual' ? 'MES' : 'ANUAL';
    const newKey = `ELITE-${prefix}-${randomHex1}-${randomHex2}`;

    const newLic: SavedLicense = {
      key: newKey,
      name: buyerName.trim(),
      type: licenseType,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated = [newLic, ...savedLicenses];
    setSavedLicenses(updated);
    try {
      localStorage.setItem('anestesiapro_elite_licenses', JSON.stringify(updated));
    } catch {}

    setGeneratedKey(newKey);
    setBuyerName('');
    setCopiedKey(false);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const categories = ['TODOS', 'Traumatología', 'Vía Aérea', 'Obstetricia', 'Pediatría', 'Cardiovascular / Crisis'];

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  return (
    <div 
      className={`space-y-5 transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 sm:p-6 overflow-y-auto w-full h-full max-w-full'
          : 'animate-fadeIn'
      }`}
    >
      {/* Floating Exit button when in Fullscreen */}
      {isFullscreen && (
        <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="bg-rose-600/90 hover:bg-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-2xl border border-rose-400/40 flex items-center gap-2 cursor-pointer active:scale-95 backdrop-blur-md"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Salir de Pantalla Completa (ESC)</span>
          </button>
        </div>
      )}

      {/* Header Banner - Private Lab */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-900/40 border border-amber-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  👑 Simulador de Casos Clínicos
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Dr. Carlos Leal (Acceso Maestro)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Simulador de Casos Clínicos Quirúrgicos & Monitor de Quirófano
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Monitoreo hemodinámico interactivo, cronómetro de urgencia con riesgo de óbito por tiempo agotado, estudios de imágenes reales y banco de decisiones quirúrgicas avanzadas.
              </p>
            </div>
          </div>

          {/* Fullscreen Toggle Buttons */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                isFullscreen
                  ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/30'
              }`}
              title={isFullscreen ? 'Salir de Pantalla Completa' : 'Abrir en Pantalla Completa'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4" />
                  <span>Salir de Pantalla Completa</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4" />
                  <span>🖥️ Abrir Pantalla Completa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lab Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('simulador')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'simulador'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>🏥 Simulador de Casos Clínicos ({CLINICAL_CASE_BANK.length} Casos Reales)</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('evaluaciones');
            refreshScores();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'evaluaciones'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>📋 Evaluaciones de Residentes ({residentScoresList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('traductor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'traductor'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-300'
              : 'text-cyan-400 hover:text-white hover:bg-slate-900 border border-cyan-500/30'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>🌐 Traduce y Resume Clínico (PDF / Word)</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] shadow-sm">NUEVO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('crisis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'crisis'
              ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400 font-extrabold'
              : 'text-rose-400 hover:text-white hover:bg-slate-900 border border-rose-500/40 bg-rose-950/20'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>🚨 Manejo de Crisis Intraoperatorias & Algoritmos Cognitivos</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-500 text-white font-black text-[9px] shadow-sm">NUEVO ÉLITE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('calculadoras')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'calculadoras'
              ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-slate-950 shadow-md shadow-amber-500/25 ring-2 ring-amber-300 font-extrabold'
              : 'text-amber-300 hover:text-white hover:bg-slate-900 border border-amber-500/40 bg-amber-950/20'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>🧮 Calculadoras Médicas Elite (TIVA / Infusión / Unidades / Escalas)</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] shadow-sm">NUEVO ELITE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preanestesia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'preanestesia'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-cyan-400'
              : 'text-cyan-300 hover:text-white hover:bg-slate-900 border border-cyan-500/40 bg-cyan-950/20'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>📄 Ficha Preanestésica & Membrete Personalizado</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 font-black text-[9px] shadow-sm">ELITE PRO</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('licencias')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'licencias'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔑 Venta de Licencias & Pagos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('apariencia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'apariencia'
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Probador de Temas</span>
        </button>

        {/* Author Photo Management Trigger (Dr. Carlos Leal) */}
        <button
          type="button"
          onClick={() => {
            if (!isDrCarlosLeal) {
              const pin = window.prompt('Ingrese PIN de Autor para gestionar fotos de casos clínicos:');
              if (pin === '2534') {
                localStorage.setItem('anestesiapro_is_author_admin', 'true');
                setIsImageManagerOpen(true);
              } else if (pin !== null) {
                alert('PIN incorrecto. Acceso reservado para el Dr. Carlos Leal.');
              }
            } else {
              setIsImageManagerOpen(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 ml-auto"
          title="Panel Secreto Dr. Carlos Leal: Gestionar y cambiar fotos de todos los casos clínicos"
        >
          <Camera className="w-4 h-4 text-amber-400" />
          <span>📷 Cambiar Fotos de Casos</span>
        </button>
      </div>

      {/* TAB 1: SIMULADOR QUIRÚRGICO CON MONITOR REAL */}
      {activeTab === 'simulador' && (
        <div className="space-y-5">
          {/* Simulation Header with Blind Mode Controls & Resident ID */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <span>Evaluando a:</span>
              </span>
              <input
                type="text"
                value={residentName}
                onChange={(e) => {
                  setResidentName(e.target.value);
                  try {
                    localStorage.setItem('anestesiapro_current_resident_name', e.target.value);
                  } catch {}
                }}
                placeholder="Nombre del Residente o Evaluado"
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Blind Mode Toggle & Photo Manager shortcut */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (!isDrCarlosLeal) {
                    const pin = window.prompt('Ingrese PIN de Autor para cambiar fotos de casos:');
                    if (pin === '2534') {
                      localStorage.setItem('anestesiapro_is_author_admin', 'true');
                      setIsImageManagerOpen(true);
                    } else if (pin !== null) {
                      alert('PIN incorrecto.');
                    }
                  } else {
                    setIsImageManagerOpen(true);
                  }
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                title="Panel Secreto: Cambiar o corregir la foto de este caso"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>📷 Cambiar Foto</span>
              </button>
              <button
                type="button"
                onClick={() => setIsBlindMode(!isBlindMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border ${
                  isBlindMode
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title="Modo Ciego: Oculta el diagnóstico y título del caso para que el residente enfrente el cuadro sin pistas"
              >
                {isBlindMode ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-indigo-200" />
                    <span>👁️‍🗨️ Modo Ciego: ACTIVADO (Sin diagnóstico revelado)</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Modo Ciego: Desactivado</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Categoría:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedCaseIdx(0);
                  resetCase();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Uncluttered Case Selector: Dropdown + Random Case + Stepping (No cluttered card wall) */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Dropdown Menu */}
              <div className="flex-1 space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-amber-400" />
                  <span>Seleccionar Caso Clínico ({filteredCases.length} Disponibles):</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCaseIdx}
                    onChange={(e) => {
                      setSelectedCaseIdx(Number(e.target.value));
                      resetCase();
                    }}
                    className="w-full bg-slate-950 border border-slate-700 hover:border-amber-400/60 focus:border-amber-400 text-white text-xs sm:text-sm font-bold rounded-xl px-3.5 py-2.5 pr-10 appearance-none cursor-pointer transition-colors shadow-inner"
                  >
                    {filteredCases.map((c, idx) => {
                      const caseLabel = (isBlindMode && c.blindTitle) 
                        ? `[Caso ${idx + 1}] ${c.blindTitle}` 
                        : `[Caso ${idx + 1}] ${c.title}`;
                      return (
                        <option key={c.id} value={idx} className="bg-slate-950 text-white py-1">
                          {caseLabel} • ({c.category} | {c.difficulty})
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-amber-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Actions: Random Case & Quick Stepping */}
              <div className="flex items-center gap-2 flex-wrap self-end md:self-end">
                <button
                  type="button"
                  onClick={handleRandomCase}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  title="Cargar un caso clínico aleatorio para entrenar reflejos inmediatos"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>🎲 Caso al Azar</span>
                </button>

                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-0.5">
                  <button
                    type="button"
                    onClick={handlePrevCase}
                    className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Caso Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono text-slate-300 px-2.5 font-bold">
                    {selectedCaseIdx + 1} / {filteredCases.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextCase}
                    className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Siguiente Caso"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCardsCatalog(!showCardsCatalog)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    showCardsCatalog
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  title="Mostrar u ocultar catálogo visual en tarjetas"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{showCardsCatalog ? 'Ocultar Catálogo' : 'Ver Catálogo'}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Card Catalog (Only rendered if toggled by user) */}
            {showCardsCatalog && (
              <div className="pt-3 border-t border-slate-800 animate-fadeIn space-y-2">
                <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between">
                  <span>Catálogo de los {filteredCases.length} casos:</span>
                  <button
                    type="button"
                    onClick={() => setShowCardsCatalog(false)}
                    className="text-slate-500 hover:text-slate-300 text-[10px] underline cursor-pointer"
                  >
                    Ocultar tarjetas
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {filteredCases.map((c, idx) => {
                    const isCurrent = currentCase.id === c.id;
                    const displayCardTitle = (isBlindMode && c.blindTitle) ? c.blindTitle : c.title;

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setSelectedCaseIdx(idx);
                          resetCase();
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                            <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                              {c.category}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                              {c.difficulty}
                            </span>
                          </div>
                          <h4 className="text-xs font-black text-white line-clamp-2 leading-snug">
                            {displayCardTitle}
                          </h4>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{c.questions.length} Decisiones</span>
                          <span className="text-amber-400 font-bold">{c.timeInSurgery}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Operating Room Monitor Screen */}
          <OperatingRoomMonitor simulationCase={currentCase} />

          {/* Clinical Simulation Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            {/* Patient Context & Procedure */}
            <div className="space-y-1.5 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black">
                  {currentCase.category}
                </span>
                <span className="text-xs text-slate-400">
                  Tiempo en quirófano: <strong className="text-white">{currentCase.timeInSurgery}</strong>
                </span>
                {isBlindMode && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                    👁️‍🗨️ Modo a Ciegas
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isBlindMode && !isCaseCompleted && currentCase.blindTitle 
                  ? currentCase.blindTitle 
                  : currentCase.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                <strong>Paciente:</strong> {currentCase.patient} • <strong>Cirugía:</strong> {currentCase.surgery}
              </p>
            </div>

            {/* Critical Intraoperative Event */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 text-xs text-slate-200 leading-relaxed shadow-inner">
              <span className="text-rose-400 font-bold flex items-center gap-1.5 mb-1.5 text-xs sm:text-sm">
                🚨 Evento Crítico Intraoperatorio:
              </span>
              {currentCase.criticalContext}
            </div>

            {/* Authentic Medical Imaging & Findings (with Author Photo Manager) */}
            {effectiveImaging ? (
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 shadow-inner">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                  <div className="flex items-start sm:items-center gap-3.5 flex-1">
                    {/* Clickable Image Thumbnail with Zoom hover */}
                    <div 
                      onClick={() => setZoomedImage({
                        url: effectiveImaging.realImageUrl,
                        title: effectiveImaging.title,
                        badge: effectiveImaging.badge,
                        desc: effectiveImaging.description
                      })}
                      className="relative group cursor-pointer shrink-0 w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden border-2 border-slate-700 bg-black hover:border-cyan-400 transition-all shadow-md"
                    >
                      <img 
                        src={effectiveImaging.realImageUrl} 
                        alt={effectiveImaging.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                        <span className="bg-slate-950/90 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-lg border border-cyan-500/40 flex items-center gap-1 group-hover:scale-105 transition-transform">
                          <ZoomIn className="w-3 h-3" />
                          <span>Ver HD</span>
                        </span>
                      </div>
                    </div>

                    {/* Imaging details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                          📷 {effectiveImaging.type}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {effectiveImaging.badge}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ✓ Imagen Clínica Auténtica
                        </span>
                      </div>
                      <h5 className="text-xs sm:text-sm font-black text-white leading-tight">
                        {effectiveImaging.title}
                      </h5>
                      <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 sm:line-clamp-none">
                        {effectiveImaging.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => setZoomedImage({
                        url: effectiveImaging.realImageUrl,
                        title: effectiveImaging.title,
                        badge: effectiveImaging.badge,
                        desc: effectiveImaging.description
                      })}
                      className="px-3 py-2 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-lg shadow-cyan-950/40"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Ampliar HD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!isDrCarlosLeal) {
                          const pin = window.prompt('Ingrese PIN de Autor para cambiar fotos:');
                          if (pin === '2534') {
                            localStorage.setItem('anestesiapro_is_author_admin', 'true');
                            setIsImageManagerOpen(true);
                          } else if (pin !== null) {
                            alert('PIN incorrecto.');
                          }
                        } else {
                          setIsImageManagerOpen(true);
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                      title="Cambiar o corregir la foto de este caso (subir nueva, pegar URL o reajustar)"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Cambiar Foto</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    Sin Imagen Asignada
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {isImageHidden 
                      ? 'La imagen diagnóstica de este caso fue ocultada en su configuración.' 
                      : 'Este caso se evalúa mediante correlación clínica y monitor transoperatorio.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isDrCarlosLeal) {
                      const pin = window.prompt('Ingrese PIN de Autor para asignar o cambiar fotos:');
                      if (pin === '2534') {
                        localStorage.setItem('anestesiapro_is_author_admin', 'true');
                        setIsImageManagerOpen(true);
                      } else if (pin !== null) {
                        alert('PIN incorrecto.');
                      }
                    } else {
                      setIsImageManagerOpen(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                >
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isImageHidden ? 'Restaurar / Asignar Foto' : '+ Asignar Foto'}</span>
                </button>
              </div>
            )}

            {/* Question flow or Case Completion Debriefing */}
            {!isCaseCompleted && currentQuestion && (
              <div className="space-y-4 pt-2">
                {/* Emergency Countdown Clock (Reloj de Tiempo Grande) */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  isPatientDead 
                    ? 'bg-rose-950/80 border-rose-500 shadow-2xl shadow-rose-900/50 ring-2 ring-rose-500' 
                    : timeLeft <= 15 
                      ? 'bg-rose-950/50 border-rose-500/80 animate-pulse shadow-xl shadow-rose-900/30' 
                      : timeLeft <= 30 
                        ? 'bg-amber-950/30 border-amber-500/60 shadow-lg' 
                        : 'bg-slate-950 border-slate-800'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Big Digital Clock Display */}
                    <div className="flex items-center gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shrink-0 transition-all ${
                        isPatientDead 
                          ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-bounce' 
                          : timeLeft <= 15 
                            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50' 
                            : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                      }`}>
                        {isPatientDead ? (
                          <Skull className="w-8 h-8" />
                        ) : timeLeft <= 15 ? (
                          <AlertTriangle className="w-8 h-8" />
                        ) : (
                          <Clock className="w-8 h-8" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            ⏱️ Tiempo Quirúrgico de Respuesta
                          </span>
                          {timeLeft <= 15 && !isPatientDead && (
                            <span className="text-[10px] font-black uppercase text-rose-400 animate-pulse flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              ¡Colapso Inminente!
                            </span>
                          )}
                          {isPatientDead && (
                            <span className="text-[10px] font-black uppercase text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500">
                              ☠️ ASISTOLIA / ÓBITO
                            </span>
                          )}
                          {!hasTimerStarted && !isPatientDead && !isAnswerConfirmed && (
                            <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/50 animate-pulse">
                              ⏳ En Espera
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-2.5 mt-1">
                          <span className={`font-mono text-3xl sm:text-4xl font-black tracking-tight ${
                            isPatientDead 
                              ? 'text-rose-500' 
                              : timeLeft <= 15 
                                ? 'text-rose-400 animate-pulse' 
                                : timeLeft <= 30 
                                  ? 'text-amber-400' 
                                  : 'text-emerald-400'
                          }`}>
                            {formatTime(timeLeft)}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {isPatientDead 
                              ? 'Tiempo agotado: el paciente no resistió' 
                              : isAnswerConfirmed
                                ? '(Decisión confirmada: tiempo detenido)'
                                : isTimerRunning 
                                  ? 'para tomar la conducta antes de paro' 
                                  : !hasTimerStarted
                                    ? 'Haz clic en COMENZAR para activar el reloj'
                                    : '(Pausa de análisis pedagógico)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Timer Controls & Presets */}
                    <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                      {/* Presets */}
                      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
                        {[
                          { label: '60s (Crítico)', value: 60 },
                          { label: '90s (ACLS)', value: 90 },
                          { label: '120s (Docente)', value: 120 }
                        ].map(p => (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => {
                              setTimerDuration(p.value);
                              setTimeLeft(p.value);
                              setIsPatientDead(false);
                              setHasTimerStarted(true);
                              setIsTimerRunning(true);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              timerDuration === p.value
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Prominent Start Button or Play/Pause */}
                      {!isPatientDead && !isAnswerConfirmed && (
                        !hasTimerStarted ? (
                          <button
                            type="button"
                            onClick={handleStartTimer}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 animate-pulse"
                            title="Iniciar el reloj del caso clínico"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>▶️ COMENZAR</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white cursor-pointer transition-colors"
                            title={isTimerRunning ? 'Pausar Reloj' : 'Reanudar Reloj'}
                          >
                            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400 fill-current" />}
                          </button>
                        )
                      )}

                      {/* Reset button */}
                      <button
                        type="button"
                        onClick={() => {
                          setTimeLeft(timerDuration);
                          setIsPatientDead(false);
                          setHasTimerStarted(false);
                          setIsTimerRunning(false);
                        }}
                        className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white cursor-pointer transition-colors"
                        title="Reiniciar Cronómetro a Estado de Espera"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Depletion Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mt-3 border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        isPatientDead 
                          ? 'bg-rose-600' 
                          : timeLeft <= 15 
                            ? 'bg-rose-500' 
                            : timeLeft <= 30 
                              ? 'bg-amber-500' 
                              : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                      }`}
                      style={{ width: `${Math.max(0, Math.min(100, (timeLeft / timerDuration) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Callout Banner if clock is waiting for Start */}
                {!hasTimerStarted && !isPatientDead && !isAnswerConfirmed && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-950 to-teal-950/60 border-2 border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Play className="w-5 h-5 fill-current" />
                      </div>
                      <div>
                        <span className="font-black text-white text-xs sm:text-sm block">
                          ⏱️ El reloj contador aguarda tu inicio
                        </span>
                        <p className="text-emerald-200/90 text-[11px] leading-tight mt-0.5">
                          Cuando estés listo para evaluar el caso y tomar la conducta perioperatoria bajo tiempo, presiona <strong>Comenzar</strong>.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Comenzar Ahora</span>
                    </button>
                  </div>
                )}

                {/* Patient Death State Overlay / Emergency Alert */}
                {isPatientDead && (
                  <div className="p-5 rounded-2xl bg-rose-950/95 border-2 border-rose-500 shadow-2xl space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-rose-800/80 pb-3">
                      <div className="flex items-center gap-3 text-center sm:text-left">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shrink-0 animate-bounce">
                          <Skull className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-white">
                            ¡TIEMPO AGOTADO: EL PACIENTE HA FALLECIDO EN QUIRÓFANO!
                          </h4>
                          <p className="text-xs text-rose-200">
                            La indecisión o demora en el accionar médico desencadenó colapso cardiopulmonar irreversible.
                          </p>
                        </div>
                      </div>

                      {/* Zeroed monitor vitals badge */}
                      <div className="flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-xl border border-rose-500/50 font-mono text-xs">
                        <span className="text-rose-400 font-bold">FC: 0 lpm</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-rose-400 font-bold">PA: 00/00</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-rose-400 font-bold">SpO2: 0%</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/60 border border-rose-500/30 text-xs text-rose-100 space-y-1.5">
                      <span className="font-bold text-rose-300 block">
                        🩺 Mecanismo de Mortalidad en este Escenario:
                      </span>
                      <p className="leading-relaxed">
                        En emergencias perioperatorias de alto riesgo como <em>"{currentCase.title}"</em>, cada segundo sin intervenir deteriora la perfusión miocárdica y cerebral. El paciente cayó en <strong>asistolia por hipoxia severa / choque irreversible</strong> no revertido a tiempo.
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={handleRevivePatient}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 cursor-pointer transition-all flex items-center gap-2 active:scale-95"
                      >
                        <HeartCrack className="w-4 h-4" />
                        <span>⚡ Reanimar y Reintentar Decisión</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsPatientDead(false);
                          setSelectedAnswerIdx(currentQuestion.correctIndex);
                          handleConfirmAnswer();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center gap-2 active:scale-95"
                      >
                        <Brain className="w-4 h-4" />
                        <span>💡 Ver Conducta Quirúrgica Inmediata</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRandomCase}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 cursor-pointer transition-all flex items-center gap-2"
                      >
                        <Shuffle className="w-4 h-4" />
                        <span>🎲 Siguiente Caso al Azar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="text-amber-400">
                      DECISIÓN {currentQuestionIdx + 1} DE {currentCase.questions.length}
                    </span>
                    <span>
                      Aciertos: {correctCount} / {currentQuestionIdx}
                    </span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIdx) / currentCase.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <p className="text-sm sm:text-base font-black text-white leading-snug">
                    {currentQuestion.prompt}
                  </p>
                </div>

                {/* Multiple choice options */}
                <div className="space-y-2.5">
                  {currentQuestion.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswerIdx === optIdx;
                    const isCorrect = optIdx === currentQuestion.correctIndex;
                    
                    let btnStyle = 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800 cursor-pointer';

                    if (isAnswerConfirmed) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/70 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/70 border-rose-400 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-600 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-950/50 border-amber-400 text-amber-200 ring-2 ring-amber-400/40';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswerConfirmed}
                        onClick={() => handleSelectAnswer(optIdx)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${btnStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="leading-relaxed">{opt}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Confirm or Advance Controls */}
                {!isAnswerConfirmed ? (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={selectedAnswerIdx === null}
                      onClick={handleConfirmAnswer}
                      className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <span>Confirmar Decisión Clínica</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      {selectedAnswerIdx === currentQuestion.correctIndex ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-xs sm:text-sm">
                          <CheckCircle className="w-5 h-5" />
                          <span>¡Conducta Correcta!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-400 font-black text-xs sm:text-sm">
                          <XCircle className="w-5 h-5" />
                          <span>Conducta Subóptima o Inadecuada</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      <strong className="text-amber-300">Fundamento Científico: </strong>
                      {currentQuestion.explanation}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 text-xs text-amber-200">
                      💡 <strong>Perla de Formación:</strong> {currentQuestion.keyLearningPoint}
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                      >
                        <span>
                          {currentQuestionIdx + 1 < currentCase.questions.length 
                            ? 'Siguiente Decisión →' 
                            : 'Finalizar Caso y Ver Debriefing Completo 🏆'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Final Debriefing & Score Certificate */}
            {isCaseCompleted && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border-2 border-amber-400/50 shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                        <Award className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">
                          Evaluación de Competencia Clínica Quirúrgica
                        </h4>
                        <p className="text-xs text-slate-400">{currentCase.title}</p>
                      </div>
                    </div>

                    <div className="text-center sm:text-right bg-black/60 px-4 py-2 rounded-xl border border-amber-500/30">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        {scorePercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {correctCount} de {totalQuestions} Aciertos
                      </span>
                    </div>
                  </div>

                  {/* Status Banner based on score */}
                  {scorePercent < 70 ? (
                    <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-600/30 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-rose-300 block font-black">
                          ⚠️ Resultado Insatisfactorio (Raspó / Paro Perioperatorio)
                        </strong>
                        <span className="text-rose-200/90 text-[11px]">
                          El paciente sufrió complicaciones críticas o paro debido a conductas o dosificaciones subóptimas. Estudia minuciosamente el desglose de preguntas y medicación oficial a continuación para afianzar tu formación.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-emerald-300 block font-black">
                          ✅ Caso Superado con Éxito Quirúrgico
                        </strong>
                        <span className="text-emerald-200/90 text-[11px]">
                          Excelente criterio anestesiológico en la toma de decisiones críticas y titulación farmacológica bajo estrés.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* EDUCATIONAL BREAKDOWN: ALL CORRECT ANSWERS WITH MEDICATION AND RATIONALE */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                      <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Desglose Pedagógico de Formación Médica ({currentCase.questions.length} Decisiones Clave)</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 font-bold">
                        Respuestas correctas & Guía de medicación
                      </span>
                    </div>

                    <div className="space-y-3">
                      {currentCase.questions.map((q, qIdx) => {
                        const history = answeredHistory[q.id];
                        const wasCorrect = history?.isCorrect;
                        const userSelectedIdx = history?.selected;
                        const correctOptionText = q.options[q.correctIndex];

                        return (
                          <div 
                            key={q.id || qIdx}
                            className={`p-4 rounded-xl border transition-all ${
                              wasCorrect 
                                ? 'bg-slate-950/90 border-emerald-500/40 shadow-sm' 
                                : 'bg-slate-950/90 border-rose-500/40 shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5 mb-2">
                              <span className="text-xs font-black text-white flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  wasCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
                                }`}>
                                  {qIdx + 1}
                                </span>
                                <span>{q.prompt}</span>
                              </span>

                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 ${
                                wasCorrect 
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                                  : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              }`}>
                                {wasCorrect ? '✓ Correcto' : '✗ Incorrecto (Raspó)'}
                              </span>
                            </div>

                            {/* Options comparison */}
                            <div className="space-y-1.5 text-xs my-2.5">
                              {userSelectedIdx !== undefined && userSelectedIdx !== q.correctIndex && (
                                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-2 text-[11px]">
                                  <span className="font-bold shrink-0">Tu respuesta:</span>
                                  <span>{q.options[userSelectedIdx] || 'Sin respuesta seleccionada'}</span>
                                </div>
                              )}

                              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 flex items-start gap-2 text-[11px]">
                                <span className="font-black text-emerald-400 shrink-0">🎯 Conducta Correcta:</span>
                                <span className="font-medium">{correctOptionText}</span>
                              </div>
                            </div>

                            {/* Detailed Medication & Academic Rationale */}
                            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 mt-2">
                              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                                <Stethoscope className="w-3.5 h-3.5" />
                                <span>Medicación Específica & Fundamento Farmacológico:</span>
                              </div>
                              <p className="leading-relaxed text-slate-200">
                                {q.explanation}
                              </p>
                              {q.keyLearningPoint && (
                                <div className="pt-1.5 border-t border-slate-800 text-cyan-300 flex items-start gap-1.5">
                                  <span className="font-bold shrink-0">💡 Perla de Aprendizaje:</span>
                                  <span className="text-slate-300">{q.keyLearningPoint}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Resumen de Manejo Quirúrgico (Debriefing):</span>
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      {currentCase.debriefing.takeawaySummary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-amber-300 block mb-1">📚 Guías y Referencias Oficiales:</strong>
                      <p className="text-[11px] text-slate-400">{currentCase.debriefing.guidelineReference}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <strong className="text-cyan-300 block mb-1">👨‍⚕️ Perla Clínica del Dr. Carlos Leal:</strong>
                      <p className="text-[11px] text-slate-300 italic">{currentCase.debriefing.authorPearls}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={resetCase}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repetir Este Caso</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = (selectedCaseIdx + 1) % filteredCases.length;
                        setSelectedCaseIdx(nextIdx);
                        resetCase();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                      <span>Siguiente Caso del Banco Clínico →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTRO DE EVALUACIONES DE RESIDENTES (DR. CARLOS LEAL) */}
      {activeTab === 'evaluaciones' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    Bitácora de Evaluaciones Clínicas de Residentes
                  </h3>
                  <p className="text-xs text-slate-400">
                    Puntajes y desempeño en simulación a ciegas para auditar en qué casos y temas clínicos se desenvuelven mejor.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:carloseduardoleal29@gmail.com?subject=${encodeURIComponent(`📋 Registro de Evaluaciones de Residentes - AnestesiaPro - ${new Date().toLocaleDateString('es-ES')}`)}&body=${encodeURIComponent(
                    `Dr. Carlos Leal,\n\nRegistro de evaluaciones de casos clínicos de residentes:\n\n` +
                    (residentScoresList.length === 0
                      ? 'No hay evaluaciones guardadas aún.'
                      : residentScoresList.map((r, i) => `${i + 1}. [${r.date || new Date(r.timestamp).toLocaleDateString('es-ES')}] ${r.residentName}\n   Caso: ${r.caseCode} (${r.category})\n   Puntaje: ${r.scorePercent}% (${r.correctCount}/${r.totalQuestions}) - ${r.feedbackLevel}`).join('\n\n'))
                  )}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Exportar bitácora por correo electrónico"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar a mi Correo</span>
                </a>

                {residentScoresList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Seguro que deseas limpiar la bitácora de calificaciones de residentes?')) {
                        clearResidentScores();
                        refreshScores();
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/30 hover:bg-rose-950/40 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Limpiar Registro</span>
                  </button>
                )}
              </div>
            </div>

            {/* Performance Summary Metrics */}
            {residentScoresList.length > 0 && (() => {
              const avgScore = Math.round(
                residentScoresList.reduce((acc, r) => acc + r.scorePercent, 0) / residentScoresList.length
              );
              const bestScore = Math.max(...residentScoresList.map(r => r.scorePercent));
              const approvedCount = residentScoresList.filter(r => r.scorePercent >= 60).length;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/30 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Evaluaciones Hechas</span>
                    <span className="text-xl font-black text-cyan-400 font-mono">{residentScoresList.length}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Promedio Global</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">{avgScore}%</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Nota Más Alta</span>
                    <span className="text-xl font-black text-amber-400 font-mono">{bestScore}%</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-500/30 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Tasa de Aprobación</span>
                    <span className="text-xl font-black text-indigo-400 font-mono">
                      {Math.round((approvedCount / residentScoresList.length) * 100)}%
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Evaluations List */}
            {residentScoresList.length === 0 ? (
              <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 font-medium">
                  Aún no hay casos evaluados registrados.
                </p>
                <p className="text-[11px] text-slate-500">
                  Cuando un residente complete un caso en la pestaña "Simulador", su calificación y reporte de desempeño aparecerán aquí automáticamente.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('simulador')}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer"
                >
                  Ir al Simulador y Evaluar
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {residentScoresList.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-black text-sm">
                          👨‍⚕️ {rec.residentName}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                          {rec.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {rec.date || new Date(rec.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-300 font-medium truncate">
                        {rec.caseCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <div className="text-right">
                        <span
                          className={`text-base sm:text-lg font-black font-mono block ${
                            rec.scorePercent >= 80
                              ? 'text-emerald-400'
                              : rec.scorePercent >= 60
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {rec.scorePercent}%
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {rec.correctCount} / {rec.totalQuestions} aciertos
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-wider ${
                          rec.scorePercent >= 80
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : rec.scorePercent >= 60
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                            : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {rec.feedbackLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: TRADUCTOR MÉDICO DE ARTÍCULOS (IA FIDELIDAD 100%) */}
      {activeTab === 'traductor' && (
        <MedicalArticleTranslator />
      )}

      {/* TAB 3: GESTOR DE LICENCIAS & VENTA */}
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

      {/* ========================================================================= */}
      {/* PESTAÑA: MANEJO DE CRISIS INTRAOPERATORIAS & CHECKLISTS COGNITIVOS */}
      {/* ========================================================================= */}
      {activeTab === 'crisis' && (
        <OperatingRoomCrisisModule />
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA: CALCULADORAS MÉDICAS AVANZADAS (TIVA, INFUSIÓN, CONVERSIÓN, ESCALAS) */}
      {/* ========================================================================= */}
      {activeTab === 'calculadoras' && (
        <MedicalCalculatorsEliteModule />
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA: PREANESTESIA CON MEMBRETE HOSPITALARIO & FIRMA DIGITAL PDF */}
      {/* ========================================================================= */}
      {activeTab === 'preanestesia' && (
        <ElitePreanesthesiaModule />
      )}

      {/* Lightbox Modal for HD Medical Imaging */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div 
            className="max-w-4xl w-full bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  {zoomedImage.badge}
                </span>
                <h4 className="text-sm sm:text-base font-black text-white">
                  {zoomedImage.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer transition-colors"
                title="Cerrar Imagen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex flex-col items-center gap-4">
              <div className="w-full flex justify-center bg-black rounded-xl p-2 border border-slate-800">
                <img 
                  src={zoomedImage.url} 
                  alt={zoomedImage.title} 
                  className="max-h-[60vh] max-w-full object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-1">
                <strong className="text-cyan-300 block">Hallazgo Radiológico / Clínico Quirúrgico:</strong>
                <p className="leading-relaxed">{zoomedImage.desc}</p>
              </div>
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <span className="text-[11px] text-slate-400">
                Estudio clínico de alta resolución con fines pedagógicos y formativos.
              </span>
              <button
                type="button"
                onClick={() => setZoomedImage(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Cerrar Visor HD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Image Manager Modal for Dr. Carlos Leal */}
      {isImageManagerOpen && (
        <CaseImageManagerModal
          isOpen={isImageManagerOpen}
          onClose={() => setIsImageManagerOpen(false)}
          caseId={currentCase.id}
          caseTitle={currentCase.title}
          onConfigSaved={() => {
            getAllCustomCaseImages().then(map => setCustomImagesMap(map));
          }}
        />
      )}
    </div>
  );
};

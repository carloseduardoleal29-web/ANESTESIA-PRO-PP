import React, { useState } from 'react';
import { DoctorUser } from '../types/user';
import { PreAnestheticEvaluation } from './PreAnestheticEvaluation';
import { VortexAirway } from './VortexAirway';
import { EmergencyProtocols } from './EmergencyProtocols';
import { InfusionCalculator } from './InfusionCalculator';
import { VademecumModal } from './VademecumModal';
import { PediatricCalculator } from './PediatricCalculator';
import { DigitalCredential } from './DigitalCredential';
import { NotificationsModal } from './NotificationsModal';
import {
  Home,
  FileText,
  Wind,
  BarChart3,
  Activity,
  Calculator,
  BookOpen,
  Award,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Maximize2,
  Share2,
  ShieldCheck,
  Star,
  Trophy,
  Download,
  Zap,
  Shield,
  Sparkles,
  UserCheck,
  Scale,
  HeartPulse,
  Baby
} from 'lucide-react';

interface Props {
  user: DoctorUser;
  onOpenAdmin: () => void;
}

export function ClinicalCalculators({ user, onOpenAdmin }: Props) {
  const [activeTab, setActiveTab] = useState<
    'home' | 'preevaluation' | 'vortex' | 'scales' | 'shock' | 'calculators' | 'vademecum' | 'card'
  >('home');

  // Carousel State
  const [carouselIndex, setCarouselIndex] = useState(1); // 2/4 (Index 1 is slide 2)
  const [isPaused, setIsPaused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Parámetros antropométricos del Paciente
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Índice de Shock y Hemodinámica
  const [pas, setPas] = useState<number>(120);
  const [pad, setPad] = useState<number>(80);
  const [fc, setFc] = useState<number>(85);

  const pam = Number(((pas + 2 * pad) / 3).toFixed(1));
  const shockIndex = pas > 0 ? Number((fc / pas).toFixed(2)) : 0;

  // Carousel slides data
  const slides = [
    {
      badge: '✨ LIDERAZGO MÉDICO Y SEGURIDAD',
      title: 'Compromiso con la Vida en Quirófano',
      subtitle: '🛡️ Excelencia Anestésica en Quirófanos y Unidades Críticas',
      text: 'Monitorización avanzada, control hemodinámico y manejo de vía aérea difícil para cada paciente.',
      quote: '"Donde hay un anestesiólogo vigilante, hay seguridad y tranquilidad en la mesa de operaciones."'
    },
    {
      badge: '✨ PRECISIÓN, CIENCIA Y VIGILANCIA 💉',
      title: 'Excelencia en Control Perioperatorio',
      subtitle: '🛡️ Liderazgo técnico en Vía Aérea, Hemodinámica y Manejo del Dolor',
      text: 'Desde la inducción suave hasta la extubación segura, pasando por bloqueos ecoguiados y reanimación crítica. Ciencia y templanza al servicio de nuestros pacientes.',
      quote: '"Donde hay un anestesiólogo vigilante, hay seguridad y tranquilidad en la mesa de operaciones."'
    },
    {
      badge: '✨ VÍA AÉREA DIFÍCIL & CPPD',
      title: 'Protocolos de Seguridad VORTEX y LAST',
      subtitle: '🛡️ Algoritmos de Rescate de Emergencia Estandarizados',
      text: 'Respuesta inmediata en eventos críticos con dosis guiadas por peso e infusión de lípidos al 20%.',
      quote: '"La preparación previa transforma una emergencia en un procedimiento controlado."'
    },
    {
      badge: '✨ EVALUACIÓN PREANESTÉSICA DIGITAL',
      title: 'Informes Clínicos Oficiales en PDF',
      subtitle: '🛡️ Clasificación ASA, Mallampati, Cormack y Riesgo Cardiovascular',
      text: 'Genere e imprima reportes oficiales con firma digitalizada para la historia médica del paciente.',
      quote: '"Una evaluación rigurosa es el primer pilar de un acto anestésico exitoso."'
    }
  ];

  const currentSlide = slides[carouselIndex];

  const nextSlide = () => setCarouselIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCarouselIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Anthropometrics
  const heightM = height / 100;
  const bmi = heightM > 0 ? Number((weight / (heightM * heightM)).toFixed(1)) : 0;
  const idealWeight = gender === 'male'
    ? Number((50 + 0.91 * (height - 152.4)).toFixed(1))
    : Number((45.5 + 0.91 * (height - 152.4)).toFixed(1));

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans antialiased pb-20 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* 1. Top Announcement Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-3 py-2 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 text-[11px] flex items-center gap-1">
            ✨ ¡Feliz Día del Anestesiólogo!
          </span>
        </div>
        <div className="flex items-center gap-2 font-semibold text-[11px] text-cyan-400">
          <span>⚕️ Dr. Carlos Leal • C.E. LEAL studio</span>
        </div>
        <div className="flex items-center gap-2">
          {user.isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
          <button
            onClick={() => setShowNotifications(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Top Horizontal Pill Navigation Scrollbar */}
      <div className="sticky top-0 z-30 bg-[#070b12]/95 backdrop-blur-md border-b border-slate-800 px-3 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          Inicio
        </button>

        <button
          onClick={() => setActiveTab('preevaluation')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'preevaluation'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          Preanestesia
        </button>

        <button
          onClick={() => setActiveTab('vortex')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'vortex'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          Vía Aérea
        </button>

        <button
          onClick={() => setActiveTab('scales')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'scales'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          Escalas
        </button>

        <button
          onClick={() => setActiveTab('shock')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'shock'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-slate-900 border border-slate-800 text-rose-300 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-rose-400" />
          Índice Shock <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/30 text-rose-200 uppercase font-black">NUEVO</span>
        </button>

        <button
          onClick={() => setActiveTab('calculators')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'calculators'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          Calculadoras
        </button>

        <button
          onClick={() => setActiveTab('vademecum')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'vademecum'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          Vademécum
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'card'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
              : 'bg-slate-900 border border-slate-800 text-amber-300 hover:bg-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-300" />
          Carnet Digital
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-5">
        
        {/* TAB 1: INICIO (EXACT LAYOUT FROM USER SCREENSHOT) */}
        {activeTab === 'home' && (
          <div className="space-y-5">

            {/* CARD 1: HERO CAROUSEL BANNER */}
            <div className="bg-gradient-to-br from-blue-900/80 via-teal-900/60 to-slate-950 border border-blue-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4">
              
              {/* Indicator Lines top bar */}
              <div className="grid grid-cols-4 gap-1.5 mb-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === carouselIndex ? 'bg-amber-400' : 'bg-cyan-500/30'
                    }`}
                  ></div>
                ))}
              </div>

              {/* Badge & Top Controls */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase tracking-wide">
                  {currentSlide.badge}
                </span>

                <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-slate-300">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-1 hover:text-white cursor-pointer"
                  >
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => alert('Pantalla completa')}
                    className="p-1 hover:text-white cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {currentSlide.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-cyan-300">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentSlide.text}
              </p>

              <p className="text-xs italic text-cyan-200/90 border-t border-slate-800/80 pt-3">
                {currentSlide.quote}
              </p>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => alert('Compartiendo saludo con colegas de anestesiología...')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>📲 Compartir Saludo Colegas</span>
                </button>

                {/* Carousel Page Navigator */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-300 px-1">
                    {carouselIndex + 1}/{slides.length}
                  </span>
                  <button
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* CARD 2: MAIN APP SUITE CARD */}
            <div className="bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
              
              <div className="flex items-start gap-4">
                {/* Logo Image */}
                <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400/60 p-0.5 bg-slate-950 shadow-xl overflow-hidden shrink-0">
                  <img
                    src="/app_logo.jpg"
                    alt="AnestesiaPro Logo"
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-slate-950 text-xl">
                    AP
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      ✨ SISTEMA ANESTÉSICO INTEGRADO
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      Edición 2026
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                    <span className="text-cyan-400">Anestesia</span>Pro • Suite Clínica
                  </h2>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Plataforma médica unificada para la evaluación preanestésica, predicción de vía aérea difícil, cálculo de dosis por peso, escalas clínicas e información farmacológica académica.
              </p>

              {/* Feature Pills */}
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  100% Funcional Offline (Quirófano)
                </span>

                <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-blue-950/80 text-blue-300 border border-blue-500/40 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  Formato de Evaluación Oficial
                </span>

                <button
                  onClick={() => setActiveTab('preevaluation')}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900/90 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Generador de PDF Preanestésico
                </button>
              </div>

            </div>

            {/* CARD 3: VERIFIED DOCTOR BANNER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">
                      Colega Verificado: {user.fullName} {user.country || '🇻🇪 Venezuela'}
                    </h3>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                      ÉLITE HABILITADO
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {user.specialty || 'Médico Especialista en Anestesiología y Reanimación'} • C.I: {user.idNumber || '15489288'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('card')}
                className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-500/40 font-bold text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-all self-start sm:self-auto"
              >
                Ver Carnet Digital
              </button>
            </div>

            {/* CARD 4: COMMUNITY RANKING CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  RÁNKING DE LA COMUNIDAD MÉDICA
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  En vivo
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-cyan-500/30 cursor-pointer transition-all" onClick={() => setActiveTab('preevaluation')}>
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    Top Archivos / Guías Más Descargadas
                  </span>
                  <span className="text-cyan-400 font-bold">Evaluación Preanestésica Oficial PDF</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs hover:border-cyan-500/30 cursor-pointer transition-all" onClick={() => setActiveTab('vortex')}>
                  <span className="text-slate-200 font-bold flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-red-400" />
                    Protocolos Vía Aérea Difícil
                  </span>
                  <span className="text-red-400 font-bold">Algoritmo VORTEX CICO</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PREANESTESIA PDF */}
        {activeTab === 'preevaluation' && (
          <PreAnestheticEvaluation
            user={user}
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            bmi={bmi}
            idealWeight={idealWeight}
          />
        )}

        {/* TAB 3: VÍA AÉREA VORTEX */}
        {activeTab === 'vortex' && (
          <VortexAirway weight={weight} />
        )}

        {/* TAB 4: ESCALAS CLÍNICAS */}
        {activeTab === 'scales' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <h3 className="text-lg font-bold text-cyan-400 border-b border-slate-800 pb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Escalas Clínicas y Predicción de Riesgo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Clasificación Estado Físico ASA</h4>
                <p className="text-slate-300">ASA I: Sano • ASA II: Enfermedad sistémica leve • ASA III: Enfermedad sistémica grave • ASA IV: Amenaza constante a la vida.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Escala de Mallampati (Vía Aérea)</h4>
                <p className="text-slate-300">Clase I: Úvula y pilares visibles • Clase II: Úvula parcialmente visible • Clase III: Paladar blando • Clase IV: Solo paladar duro.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Laringoscopia Cormack-Lehane</h4>
                <p className="text-slate-300">Grado I: Visión glótica completa • Grado II: Visión parcial • Grado III: Epiglotis • Grado IV: Ninguna estructura.</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-sm">Riesgo Cardiovascular Lee (RCRI)</h4>
                <p className="text-slate-300">Evalúa enfermedad coronaria, IC, ACV, diabetes con insulina e insuficiencia renal (&gt;2.0 mg/dl).</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ÍNDICE SHOCK NUEVO */}
        {activeTab === 'shock' && (
          <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">CALCULADORA ÍNDICE DE SHOCK & PAM</h3>
                  <p className="text-xs text-slate-400">Evaluación de hipoperfusión tisular y estado distributivo/hipovolémico.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Presión Arterial Sistólica (PAS mmHg)</label>
                <input
                  type="number"
                  value={pas}
                  onChange={e => setPas(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Presión Arterial Diastólica (PAD mmHg)</label>
                <input
                  type="number"
                  value={pad}
                  onChange={e => setPad(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Frecuencia Cardíaca (FC lpm)</label>
                <input
                  type="number"
                  value={fc}
                  onChange={e => setFc(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-rose-300 font-bold focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block">Presión Arterial Media (PAM)</span>
                  <span className="text-2xl font-black text-cyan-300">{pam} mmHg</span>
                </div>
                <span className="text-[10px] px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">Meta &gt; 65 mmHg</span>
              </div>

              <div className={`p-4 bg-slate-950 rounded-xl border flex justify-between items-center ${
                shockIndex > 0.9 ? 'border-rose-500/80 text-rose-400' : 'border-slate-800 text-emerald-400'
              }`}>
                <div>
                  <span className="text-xs text-slate-400 block">Índice de Shock (FC / PAS)</span>
                  <span className="text-2xl font-black">{shockIndex}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                  shockIndex > 0.9 ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  {shockIndex > 0.9 ? '⚠️ SHOCK / HIPOPERFUSIÓN' : 'Normal (0.5 - 0.7)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CALCULADORAS DE DOSIS */}
        {activeTab === 'calculators' && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mb-2">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                  <Scale className="w-4 h-4" />
                  Parámetros Biomédicos del Paciente
                </h2>
                <span className="text-xs text-slate-400">
                  IMC: <strong className="text-white">{bmi} kg/m²</strong> | Peso Ideal: <strong className="text-white">{idealWeight} kg</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Peso Real (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Talla (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Edad (años)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(Number(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Género</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'male' | 'female')}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  >
                    <option value="male">Masculino ♂</option>
                    <option value="female">Femenino ♀</option>
                  </select>
                </div>
              </div>
            </div>

            <InfusionCalculator weight={weight} idealWeight={idealWeight} />
            <EmergencyProtocols weight={weight} />
            <PediatricCalculator weight={weight} age={age} />
          </div>
        )}

        {/* TAB 7: VADEMÉCUM */}
        {activeTab === 'vademecum' && (
          <VademecumModal />
        )}

        {/* TAB 8: CARNET DIGITAL */}
        {activeTab === 'card' && (
          <DigitalCredential user={user} />
        )}

      </main>

      {/* Notifications Drawer Modal */}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          isAdmin={user.isAdmin || false}
        />
      )}

    </div>
  );
}

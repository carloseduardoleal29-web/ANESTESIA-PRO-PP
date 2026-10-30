import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  FileText, Wind, BarChart2, Calculator, BookOpen, GraduationCap, 
  Sparkles, ArrowRight, ShieldCheck, Stethoscope, Instagram, Activity, 
  Zap, Flame, Clock, CheckCircle2, ChevronRight, BookMarked, Brain, 
  Film, Compass, Play, LifeBuoy, Droplet, HeartHandshake, Syringe, 
  Pill, Layers, Trophy, Download, Eye, User, Star, Award, Crown, 
  ShieldAlert, Monitor, Lock, Unlock, Check, DollarSign
} from 'lucide-react';
import { LOGO_SHIELD_BASE64, LOGO_FALLBACK_SVG } from '../lib/logoData';
import { getCanonicalAppOrigin, getGlobalStats, getModuleVisits } from '../lib/statsService';
import { getStoredUserProfile, isUserEliteActive, RegisteredUser } from '../lib/userRegistrationService';
import { HomeNotificationBanner } from './HomeNotificationBanner';
import { AnimatedEliteBanner } from './AnimatedEliteBanner';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

interface HomeModuleProps {
  setActiveTab: (tab: TabType) => void;
  onSelectEducationResource?: (resourceId: string) => void;
}

export const HomeModule: React.FC<HomeModuleProps> = ({ setActiveTab, onSelectEducationResource }) => {
  const [currentUserProfile, setCurrentUserProfile] = useState<RegisteredUser | null>(() => getStoredUserProfile());

  useEffect(() => {
    const handleUserUpdate = (e: any) => {
      setCurrentUserProfile(e.detail || getStoredUserProfile());
    };
    window.addEventListener('anestesiapro_user_profile_updated', handleUserUpdate);
    return () => window.removeEventListener('anestesiapro_user_profile_updated', handleUserUpdate);
  }, []);

  const isEliteActive = isUserEliteActive(currentUserProfile);

  // Real-time Community Top Ranking Data (Compact)
  const [statsData, setStatsData] = useState<{
    topDownloads: { id: string; title: string; count: number; category: string; tab?: TabType; educationId?: string }[];
    topModules: { key: string; label: string; count: number; icon: string; tab: TabType }[];
  }>(() => {
    const visits = getModuleVisits();
    const modulesArr = Object.entries(visits).map(([key, val]) => ({
      key,
      label: val.label,
      count: val.count,
      icon: val.icon,
      tab: key as TabType
    })).sort((a, b) => b.count - a.count).slice(0, 3);

    return {
      topDownloads: [],
      topModules: modulesArr
    };
  });

  useEffect(() => {
    getGlobalStats().then((stats) => {
      const itemD = stats.itemDownloads || {};
      const downloadMap: Record<string, { title: string; category: string; tab?: TabType; educationId?: string }> = {
        'res-preeclampsia-eclampsia-enfoque-anestesiologico': { title: 'Guía & Atlas Preeclampsia 2026', category: 'PDF Guía', tab: 'educacion', educationId: 'res-preeclampsia-eclampsia-enfoque-anestesiologico' },
        'res-guia-eras-cesarea-2025': { title: 'Guía ERAS Cesárea 2025', category: 'PDF Oficial', tab: 'educacion', educationId: 'res-guia-eras-cesarea-2025' },
        'res-modulo-preanestesia-consultado': { title: 'Evaluación Preanestésica Oficial', category: 'Formulario', tab: 'preanestesia' },
        'res-protocolo-emotive-hemorragia-posparto-2026': { title: 'Protocolo E-MOTIVE (HPP)', category: 'PDF Guía', tab: 'educacion', educationId: 'res-protocolo-emotive-hemorragia-posparto-2026' },
        'res-evaluacion-preanestesica': { title: 'Ficha Preanestésica en PDF', category: 'PDF Paciente', tab: 'preanestesia' },
        'res-enfoque-vortex-via-aerea-dificil': { title: 'Enfoque VORTEX Vía Aérea', category: 'PDF Guía', tab: 'educacion', educationId: 'res-enfoque-vortex-via-aerea-dificil' },
        'res-fona-cricotiroidotomia': { title: 'Algoritmo eFONA / CICO', category: 'PDF Rescate', tab: 'viaAerea' },
        'res-calculadora-induccion': { title: 'Calculadora de Inducción', category: 'Dosis Peso', tab: 'calculadora' },
        'res-indice-de-shock': { title: 'Índice de Shock & PAM', category: 'Calculadora', tab: 'indiceShock' },
      };

      const sortedDownloads = Object.entries(itemD)
        .filter(([k]) => downloadMap[k])
        .map(([k, count]) => ({
          id: k,
          title: downloadMap[k].title,
          category: downloadMap[k].category,
          tab: downloadMap[k].tab,
          educationId: downloadMap[k].educationId,
          count: Number(count) || 0
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const visits = getModuleVisits();
      const modulesArr = Object.entries(visits).map(([key, val]) => ({
        key,
        label: val.label,
        count: val.count,
        icon: val.icon,
        tab: key as TabType
      })).sort((a, b) => b.count - a.count).slice(0, 3);

      setStatsData({
        topDownloads: sortedDownloads.length > 0 ? sortedDownloads : statsData.topDownloads,
        topModules: modulesArr
      });
    }).catch(() => {});
  }, []);

  // NOVEDADES ORDENADAS ESTRICTAMENTE DE LO MÁS NUEVO A LO MÁS VIEJO (Últimas 48 horas)
  const novedades = [
    {
      id: 'res-preeclampsia-eclampsia-enfoque-anestesiologico',
      type: 'education',
      title: '🧬 Protocolo Obstétrico y Atlas Visual: Preeclampsia, Eclampsia y Síndrome HELLP (ACOG / FIGO / SOAP 2026)',
      tag: '🔥 RECIÉN PUBLICADO • DESTACADO #1',
      date: 'Septiembre 2026 • ACOG / FIGO / SOAP',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      gradient: 'from-slate-900 via-rose-950 to-indigo-950 border-rose-500/50 hover:border-rose-400',
      iconColor: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
      image: '/images/preeclampsia_placenta_maternal_connection.svg',
      desc: 'Compendio de alta complejidad obstétrica y anestésica: Fisiopatología celular en dos fases (sFlt-1/PlGF), neuroprotección NMDA con Sulfato de Magnesio (Zuspan/Pritchard), manejo escalonado de crisis hipertensiva en 15 min (Labetalol, Hidralazina, Nifedipino oral), restricción hídrica estricta (60-80 mL/h), umbrales de plaquetas para punción neuroaxial (≥70-80k) y Atlas Visual Interactivo con 8 Láminas Ultra-HD. Incluye Guía Oficial descargable en PDF de 5 páginas.',
      cta: 'Ver Protocolo, Atlas HD & PDF'
    }
  ];

  const handleNovedadClick = (item: { id: string; type: string }) => {
    if (item.type === 'tab') {
      setActiveTab(item.id as TabType);
    } else {
      if (onSelectEducationResource) {
        onSelectEducationResource(item.id);
      }
      setActiveTab('educacion');
    }
  };

  // MAIN MENU CARDS (STRICTLY 3 SUBMENUS PER ROW ON DESKTOP WITH STRIKING GOLD FRAMES)
  const cards = [
    {
      id: 'preanestesia_elite' as any,
      title: '1. Evaluación Preanestésica & Membretes',
      badge: 'ÉLITE 👑 • INFORME PDF',
      isElite: true,
      desc: 'Formulario clínico con 7 parámetros de El-Ganzouri (EGRI), clasificación de Chien, paraclínicos, membrete hospitalario con logo, firma manuscrita y exportación PDF.',
      icon: FileText,
      color: 'from-amber-400 via-yellow-400 to-amber-500',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      customAction: 'preanestesia_elite'
    },
    {
      id: 'viaAerea' as TabType,
      title: '2. Vía Aérea & Algoritmo VORTEX',
      badge: 'ALGORITMOS VORTEX & DAS',
      isElite: false,
      desc: 'Índice EGRI (El-Ganzouri), Escalas Han, Cormack-Lehane, POGO, farmacología SRI y protocolo de rescate CICO / eFONA.',
      icon: Wind,
      color: 'from-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
      tabId: 'viaAerea'
    },
    {
      id: 'escalas' as TabType,
      title: '3. Escalas en Anestesiología',
      badge: 'ASA, CAPRINI, PACU & SHOCK',
      isElite: false,
      desc: 'Clasificación ASA (I-VI), Caprini (TEV/TVP), Índice de Shock (IS/MSI/PAM), Ramsay, Bromage, Aldrete para URPA, EVA y RASS.',
      icon: BarChart2,
      color: 'from-cyan-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      tabId: 'escalas'
    },
    {
      id: 'calculadora' as TabType,
      title: '4. Calculadora de Inducción Anestésica',
      badge: '⚖️ DOSIS PESO REAL (BÁSICA)',
      isElite: false,
      desc: 'Cálculo de inducción estándar por peso en mg y mL para hipnóticos (Propofol, Ketamina, Midazolam), opioides, relajantes y reversores.',
      icon: Syringe,
      color: 'from-amber-400 via-yellow-400 to-amber-500',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
      tabId: 'calculadora'
    },
    {
      id: 'indiceShock' as TabType,
      title: '5. Índice de Shock & Reanimación',
      badge: '🚨 EVALUACIÓN DE SHOCK & PAM',
      isElite: false,
      desc: 'Calculadora de IS (FC/PAS), MSI (FC/PAM) y PAM, con protocolo completo de hidratación balanceada, metas hemodinámicas y paquete PTM 1:1:1.',
      icon: Activity,
      color: 'from-rose-600 via-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      tabId: 'indiceShock'
    },
    {
      id: 'calculadoras_avanzadas' as any,
      title: '6. Calculadoras Médicas Avanzadas',
      badge: 'ÉLITE 👑 • TIVA, TCI & UCI',
      isElite: true,
      desc: 'Suite Élite de 15 calculadoras: TIVA/TCI (Schnider/Minto), infusiones vasoactivos directas/inversas (Noradrenalina/Adrenalina), gotero, pediatría, MABL, electrolitos.',
      icon: Calculator,
      color: 'from-amber-400 via-yellow-400 to-emerald-500',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
      customAction: 'calculadoras_avanzadas'
    },
    {
      id: 'preeclampsia' as any,
      title: '7. Protocolo Obstétrico & Preeclampsia',
      badge: 'ACOG / FIGO / E-MOTIVE 2026',
      isElite: false,
      desc: 'Protocolo Obstétrico Oficial: Preeclampsia, Eclampsia, Síndrome HELLP, sulfato de magnesio, manejo de crisis hipertensiva en 15 min, hemorragia posparto E-MOTIVE y Atlas Visual HD.',
      icon: HeartHandshake,
      color: 'from-rose-500 via-pink-600 to-indigo-600',
      image: '/images/preeclampsia_placenta_maternal_connection.svg',
      customAction: 'preeclampsia'
    },
    {
      id: 'vademecum' as TabType,
      title: '8. Vademécum Farmacológico',
      badge: 'DICCIONARIO CLÍNICO',
      isElite: false,
      desc: 'Farmacodinamia, mecanismos de acción, dosis por indicación, interacciones, perlas clínicas y antídotos anestesiológicos.',
      icon: BookOpen,
      color: 'from-indigo-700 to-slate-800',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80',
      tabId: 'vademecum'
    },
    {
      id: 'educacion' as TabType,
      title: '9. Educación Continua & Biblioteca',
      badge: '🧬 PREECLAMPSIA 2026 & ATLAS HD',
      isElite: false,
      desc: 'Biblioteca médica interactiva oficial: Protocolo Obstétrico de Preeclampsia 2026, E-MOTIVE, VORTEX, infografías, atlas HD y PDF descargables.',
      icon: GraduationCap,
      color: 'from-rose-600 via-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      tabId: 'educacion'
    },
    {
      id: 'crisis' as any,
      title: '10. Crisis Intraoperatorias & Protocolos',
      badge: 'ÉLITE 👑 • CHECKLISTS EMERGENCIA',
      isElite: true,
      desc: 'Algoritmos y listas de verificación cognitiva en tiempo real: Hipertermia maligna, paro cardíaco en quirófano, LAST, anafilaxia y laringoespasmo.',
      icon: ShieldAlert,
      color: 'from-amber-400 via-rose-600 to-red-600',
      image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80',
      customAction: 'crisis'
    },
    {
      id: 'simulador' as any,
      title: '11. Simulador de Casos Clínicos',
      badge: 'ÉLITE 👑 • MONITOR VIRTUAL',
      isElite: true,
      desc: 'Laboratorio de simulación médica educativa con monitor quirúrgico virtual en tiempo real, trazados ECG/SpO2/Capnografía y escenarios clínicos.',
      icon: Monitor,
      color: 'from-amber-400 via-cyan-500 to-blue-600',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
      customAction: 'simulador'
    },
    {
      id: 'traductor' as any,
      title: '12. Traduce y Resume con IA',
      badge: 'ÉLITE 👑 • INTELIGENCIA ARTIFICIAL',
      isElite: true,
      desc: 'Traducción técnica médica fiel, análisis crítico y resumen ejecutivo con IA para artículos científicos de PubMed, BJA, Anesthesiology y NEJM.',
      icon: Brain,
      color: 'from-amber-400 via-purple-500 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      customAction: 'traductor'
    }
  ];

  const handleCardClick = (card: typeof cards[0]) => {
    if (card.isElite && !isEliteActive) {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_plan_elite_modal'));
      return;
    }

    if (card.customAction === 'simulador') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_elite_lab'));
    } else if (card.customAction === 'traductor') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_translator'));
    } else if (card.customAction === 'crisis') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_crisis_modal'));
    } else if (card.customAction === 'calculadoras_avanzadas') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_calculadoras_avanzadas'));
    } else if (card.customAction === 'preanestesia_elite') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_preanestesia_elite'));
    } else if (card.customAction === 'preeclampsia') {
      if (onSelectEducationResource) {
        onSelectEducationResource('res-preeclampsia-eclampsia-enfoque-anestesiologico');
      }
      setActiveTab('educacion');
    } else if (card.tabId) {
      setActiveTab(card.tabId as TabType);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* BLINKING NOTIFICATION BANNER */}
      <HomeNotificationBanner
        onOpenResource={(resourceId) => {
          if (onSelectEducationResource) {
            onSelectEducationResource(resourceId);
          } else {
            setActiveTab('educacion');
          }
        }}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Stethoscope className="w-64 h-64 text-cyan-300" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 rounded-2xl opacity-60 blur-[4px] animate-vital-glow pointer-events-none" />
              <div className="relative p-1.5 bg-white rounded-2xl border-2 border-cyan-300 shadow-xl overflow-hidden flex items-center justify-center animate-cardiac-logo shadow-cyan-500/40">
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-cyan-100/60 to-transparent pointer-events-none animate-specular-sweep" />
                <img
                  src={LOGO_SHIELD_BASE64}
                  alt="AnestesiaPro Logo"
                  className="w-13 h-13 sm:w-16 sm:h-16 object-contain rounded-xl relative z-10"
                  onError={(e) => {
                    e.currentTarget.src = LOGO_FALLBACK_SVG;
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Sistema Anestésico Integrado
                </span>
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 fill-current text-slate-950" /> Versión Élite 2026
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                Anestesia<span className="text-cyan-300">Pro</span> &bull; Suite Clínica
              </h2>
            </div>
          </div>

          <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed font-medium">
            Plataforma médica unificada para la evaluación preanestésica, predicción de vía aérea difícil, cálculo de dosis por peso, escalas clínicas, vademécum y simulaciones avanzadas.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-blue-100">
            <span className="flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-700/60 font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" /> 100% Funcional Offline (Quirófano)
            </span>
            <span className="flex items-center gap-1.5 bg-amber-950/70 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/50 font-bold shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400" /> Herramientas Élite Habilitadas
            </span>
          </div>
        </div>
      </div>

      {/* TOP DESCARGAS & TOP MÓDULOS */}
      <div className="bg-slate-900/95 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-3 sm:p-3.5 shadow-md text-slate-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
              <Trophy className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Ránking de la Comunidad Médica
            </span>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800 font-mono">
            En vivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 px-1 py-0.5">
              <span className="flex items-center gap-1.5">
                <Download className="w-3 h-3 text-cyan-400" />
                Top Archivos / Guías Más Descargadas
              </span>
            </div>
            <div className="space-y-0.5">
              {statsData.topDownloads.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.educationId && onSelectEducationResource) {
                      onSelectEducationResource(item.educationId);
                      setActiveTab('educacion');
                    } else if (item.tab) {
                      setActiveTab(item.tab);
                    }
                  }}
                  className="w-full text-left flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/70 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="text-xs shrink-0">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="truncate text-slate-300 group-hover:text-cyan-300 text-[11px] font-medium">
                      {item.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                    {item.count} descargas
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2 border border-slate-800/60 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 px-1 py-0.5">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-amber-400" />
                Top Módulos Más Visitados
              </span>
            </div>
            <div className="space-y-0.5">
              {statsData.topModules.map((item, idx) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.tab)}
                  className="w-full text-left flex items-center justify-between px-2 py-1 rounded-lg hover:bg-slate-800/70 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="text-xs shrink-0">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <span className="truncate text-slate-300 group-hover:text-amber-300 text-[11px] font-medium">
                      {item.label}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                    {item.count} visitas
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATED GOLDEN BANNER FOR PLAN ÉLITE */}
      <AnimatedEliteBanner 
        onOpenPlanElite={() => window.dispatchEvent(new CustomEvent('anestesiapro_open_plan_elite_modal'))}
        isEliteActive={isEliteActive}
      />

      {/* WHATSAPP RECOMMENDATION & BENEFITS BANNER */}
      <WhatsAppShareBanner
        title="AnestesiaPro • Suite Clínica 2026"
        description="Plataforma médica unificada creada por el Dr. Carlos Leal: Evaluación preanestésica con informe PDF, Vía Aérea VORTEX, Calculadoras de inducción, Protocolo Preeclampsia E-MOTIVE y Simulador Virtual."
        theme="amber"
      />

      {/* REORGANIZED MAIN MENU GRID (STRICTLY 3 SUBMENUS PER ROW WITH GOLDEN FRAMES) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>Menú Principal de Módulos Anestésicos</span>
            <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
              3 por Fila
            </span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            Toca una tarjeta para ingresar
          </span>
        </div>

        {/* 3 COLUMNS GRID ON TABLET / DESKTOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            const isLockedForUser = card.isElite && !isEliteActive;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col justify-between relative ${
                  card.isElite
                    ? 'border-2 border-amber-400/90 ring-2 ring-amber-400/30 shadow-amber-950/50 bg-gradient-to-br from-slate-900 via-[#1e1708] to-slate-950 hover:border-amber-300 hover:ring-amber-300/50 hover:scale-[1.02]'
                    : 'bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/80 hover:scale-[1.01]'
                }`}
              >
                {/* Image Header / Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-950">
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Badge & Lock Status over Image */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 gap-2">
                    <div className="flex items-center gap-1.5 max-w-[85%]">
                      <div className={`p-1.5 rounded-xl text-slate-950 shadow-md bg-gradient-to-br ${card.color} shrink-0`}>
                        <Icon className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full shadow-md backdrop-blur-md border truncate ${
                        card.isElite
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-amber-300 font-black'
                          : 'bg-slate-900/90 text-slate-200 border-slate-700'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    {isLockedForUser && (
                      <span className="p-1 rounded-full bg-slate-950/90 text-amber-400 border border-amber-500/60 shadow-md shrink-0 animate-pulse" title="Requiere Plan Élite">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div>
                    <h4 className={`text-sm font-black transition-colors leading-snug flex items-center justify-between ${
                      card.isElite
                        ? 'text-white group-hover:text-amber-300'
                        : 'text-white group-hover:text-cyan-300'
                    }`}>
                      <span>{card.title}</span>
                      {card.isElite && (
                        <Crown className="w-4 h-4 text-amber-300 animate-bounce shrink-0 ml-1.5 fill-amber-300/40" title="Módulo Élite Exclusivo" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-300/90 mt-1 leading-relaxed font-normal line-clamp-3">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 flex items-center justify-between border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-bold truncate">
                      {card.isElite ? '👑 Módulo Élite' : 'Módulo Anestésico'}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-bold transition-transform group-hover:translate-x-1 shrink-0 ${
                      card.isElite ? 'text-amber-400 font-black' : 'text-cyan-400 font-extrabold'
                    }`}>
                      <span>{isLockedForUser ? 'Ver Élite' : 'Ingresar'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contacto Directo & Sugerencias Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl text-white space-y-3 mt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30 shrink-0">
                <Sparkles className="w-6 h-6 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">
                  ¿Tienes alguna duda, caso clínico o sugerencia?
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Escribe directamente al Dr. Carlos Leal (Especialista en Anestesiología y Reanimación &bull; Maracay, Venezuela).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 shrink-0">
              <a
                href="https://www.instagram.com/anestesiapro2026?igsh=MXNkOXAybjVycXppcw=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
              >
                <Instagram className="w-4 h-4 text-white" />
                <span>Instagram @anestesiapro2026</span>
              </a>
              <a
                href="mailto:carloseduardoleal29@gmail.com?subject=Contacto%20AnestesiaPro"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Enviar Correo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

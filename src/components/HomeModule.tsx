import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { FileText, Wind, BarChart2, Calculator, BookOpen, GraduationCap, Sparkles, ArrowRight, ShieldCheck, Stethoscope, Instagram, Activity, Zap, Flame, Clock, CheckCircle2, ChevronRight, BookMarked, Brain, Film, Compass, Play, LifeBuoy, Droplet, HeartHandshake, Syringe, Pill, Layers, Trophy, Download, Eye, User, Star, Award } from 'lucide-react';
import { LOGO_SHIELD_BASE64, LOGO_FALLBACK_SVG } from '../lib/logoData';
import { getCanonicalAppOrigin, getGlobalStats, getModuleVisits } from '../lib/statsService';
import { getStoredUserProfile, isUserEliteActive, RegisteredUser } from '../lib/userRegistrationService';
import { HomeNotificationBanner } from './HomeNotificationBanner';
import { AnesthesiologistDayReel } from './education/AnesthesiologistDayReel';

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
    },
    {
      id: 'res-protocolo-emotive-hemorragia-posparto-2026',
      type: 'education',
      title: '🩸 Protocolo E-MOTIVE: Paquete de Intervención para Hemorragia Posparto (NEJM / OMS / FIGO)',
      tag: 'GUÍA CLÍNICA OBSTÉTRICA',
      date: 'Agosto 2026 • NEJM 2023 / OMS / SOAP',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      gradient: 'from-slate-900 via-rose-950 to-indigo-950 border-rose-500/50 hover:border-rose-400',
      iconColor: 'bg-gradient-to-br from-rose-500 to-red-600 text-white',
      image: '/images/emotive_vdrape.jpg',
      desc: 'Detección temprana con bolsa colectora calibrada V-Drape y respuesta médica simultánea en los primeros 15 minutos: Masaje bimanual + Uterotónicos + Ácido Tranexámico 1g IV + Cristaloides tibios 37°C + Examen 4Ts + Balón de Bakri y PTM 1:1:1. Reduce en un 60% la HPP severa. Incluye Atlas visual con imágenes por cada letra, simulador cronológico y Guía PDF Oficial.',
      cta: 'Ver Protocolo E-MOTIVE (Atlas & PDF)'
    },
    {
      id: 'res-enfoque-vortex-via-aerea-dificil',
      type: 'education',
      title: '🌀 El Enfoque VORTEX en Vía Aérea Difícil & Rescate CICO (BJA / DAS 2026)',
      tag: 'GUÍA CLÍNICA',
      date: 'Agosto 2026 • Dr. Nicholas Chrimes',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      gradient: 'from-slate-900 via-cyan-950 to-indigo-950 border-cyan-500/50 hover:border-cyan-400',
      iconColor: 'bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950',
      desc: 'Ayuda cognitiva en tiempo real: Zona Verde (SpO2/EtCO2), 3 Líneas de Vida no quirúrgicas, 5 Optimizaciones del Mejor Esfuerzo y Gatillo Inmediato CICO (eFONA: Escalpelo - Bougie - Tubo 6.0). Simulador del Embudo y Guía PDF.',
      cta: 'Ver Enfoque VORTEX (Simulador & PDF)'
    },
    {
      id: 'res-orexina-interruptor-despertar-2026',
      type: 'education',
      title: "🧠 El 'Interruptor' del Despertar: Sistema Orexina / Hipocretina en Anestesia",
      tag: 'NEUROANESTESIA',
      date: 'Agosto 2026 • Neuroanestesia',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      gradient: 'from-slate-900 via-teal-950 to-indigo-950 border-emerald-500/50 hover:border-emerald-400',
      iconColor: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950',
      desc: 'Emergencia Activa vs Pasiva: Agonistas OX2R (Danavorexton/TAK-925), bloqueo DORA (Suvorexant), BIS de <40 a >80 en <3 min y rescate ventilatorio sin pérdida de analgesia. Simulador de circuito y PDF oficial.',
      cta: "Ver 'Interruptor' Orexina (Simulador & PDF)"
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

  const cards = [
    {
      id: 'indiceShock' as TabType,
      title: '🩸 Índice de Shock & Reanimación Hemodinámica',
      badge: '🚨 NUEVO • EVALUACIÓN DE SHOCK & PAM',
      desc: 'Calculadora especializada de IS (FC/PAS), MSI (FC/PAM) y Presión Arterial Media (PAM), con protocolo completo de hidratación balanceada, solución ideal, dosis por objetivos y paquete de transfusión masiva.',
      icon: Activity,
      color: 'from-rose-600 via-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
      highlight: true,
      superLlamativo: true
    },
    {
      id: 'preanestesia' as TabType,
      title: '1. Formato de Evaluación Preanestésica',
      badge: 'EVALUACIÓN CLÍNICA',
      desc: 'Formulario clínico completo, cálculo automático del Índice de Vía Aérea en 7 acápites y exportación en PDF.',
      icon: FileText,
      color: 'from-blue-600 to-indigo-600',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      highlight: true
    },
    {
      id: 'viaAerea' as TabType,
      title: '2. Vía Aérea y Anestesia',
      badge: 'ALGORITMOS VORTEX & DAS',
      desc: 'Índice EGRI (El-Ganzouri), Escalas Han, Cormack-Lehane, POGO, farmacología SRI y protocolos de rescate.',
      icon: Wind,
      color: 'from-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'escalas' as TabType,
      title: '3. Escalas Usadas en Anestesiología',
      badge: 'ASA, CAPRINI, PACU & SHOCK',
      desc: 'Clasificación ASA (I-VI), Escala de Caprini (TEV/TVP), Índice de Shock (IS/MSI/PAM), Ramsay, Bromage, Aldrete para URPA, EVA y RASS.',
      icon: BarChart2,
      color: 'from-cyan-600 to-teal-600',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'calculadora' as TabType,
      title: '4. Calculadora de Inducción Anestésica',
      badge: 'DOSIS POR PESO',
      desc: 'Cálculo de dosis farmacológicas para inducción anestésica ajustadas por peso (hipnóticos, opioides, relajantes y reversión) en mg y mL.',
      icon: Calculator,
      color: 'from-teal-600 to-emerald-600',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'vademecum' as TabType,
      title: '5. Vademécum Farmacológico',
      badge: 'DICCIONARIO CLÍNICO',
      desc: 'Farmacodinamia, mecanismos de acción, dosis, perlas clínicas y emergencias anestesiológicas.',
      icon: BookOpen,
      color: 'from-indigo-700 to-slate-800',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'educacion' as TabType,
      title: '6. Educación Continua & Biblioteca Médica',
      badge: '🧬 NUEVO • PREECLAMPSIA 2026 & ATLAS HD',
      desc: 'Biblioteca médica interactiva oficial: Nuevo Protocolo Obstétrico y Anestésico de Preeclampsia, Eclampsia y HELLP (ACOG / FIGO / SOAP 2026 con 8 Láminas Ultra-HD y Dossier PDF), Hemorragia Posparto E-MOTIVE, VORTEX en Vía Aérea Difícil, vademécum y calculadoras clínicas.',
      icon: GraduationCap,
      color: 'from-rose-600 via-indigo-600 to-cyan-600',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      highlight: true,
      superLlamativo: true
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* BLINKING NOTIFICATION BANNER (Eliminates upon click/dismiss) */}
      <HomeNotificationBanner
        onOpenResource={(resourceId) => {
          if (onSelectEducationResource) {
            onSelectEducationResource(resourceId);
          } else {
            setActiveTab('educacion');
          }
        }}
      />

      {/* Carrete Móvil - Homenaje 16 de Octubre Día del Anestesiólogo */}
      <AnesthesiologistDayReel />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Stethoscope className="w-64 h-64 text-cyan-300" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-3">
            {/* Animated Logo Container with Vital Glow Halo and Cardiac Heartbeat Pulse */}
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
                <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold px-3 py-1 rounded-full">
                  Edición 2026
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
                Anestesia<span className="text-cyan-300">Pro</span> &bull; Suite Clínica
              </h2>
            </div>
          </div>

          <p className="text-xs md:text-sm text-blue-100/90 leading-relaxed">
            Plataforma médica unificada para la evaluación preanestésica, predicción de vía aérea difícil, cálculo de dosis por peso, escalas clínicas e información farmacológica académica.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-blue-100">
            <span className="flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-700/60 font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-current" /> 100% Funcional Offline (Quirófano)
            </span>
            <span className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> Formato de Evaluación Oficial
            </span>
            <span className="flex items-center gap-1.5 bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-800/50">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Generador de PDF Preanestésico
            </span>
          </div>
        </div>
      </div>

      {/* REGISTRATION / DIGITAL MEDICAL CREDENTIAL CALLOUT CARD */}
      {!currentUserProfile ? (
        <div className="bg-gradient-to-r from-slate-900 via-[#0a1f33] to-slate-900 border-2 border-cyan-500/50 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-2xl border border-cyan-400/40 shrink-0">
              <User className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded border border-cyan-400/40">
                  COMUNIDAD MÉDICA • 1 SOLA VEZ
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                ¡Registra tu perfil médico en AnestesiaPro!
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Vincula este dispositivo de forma permanente para obtener tu <strong>Carnet Digital de Especialista</strong> y personalizar tus <strong>reportes preanestésicos en PDF</strong> con tu nombre, cédula y hospital.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('anestesiapro_open_registration_modal'))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/60 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <span>Registrarme Gratis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-slate-200">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white truncate">
                  Colega Verificado: {currentUserProfile.fullName}
                </span>
                <span className="text-xs font-bold text-cyan-300">{currentUserProfile.country}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.2 rounded border ${
                  isUserEliteActive(currentUserProfile) 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' 
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'
                }`}>
                  {isUserEliteActive(currentUserProfile) ? '⭐ ÉLITE HABILITADO' : 'PLAN ESTÁNDAR ✓'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {currentUserProfile.specialty} &bull; C.I: {currentUserProfile.idNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('anestesiapro_open_registration_modal'))}
            className="text-xs font-bold text-cyan-300 hover:text-white bg-slate-950 hover:bg-slate-800 border border-cyan-500/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 self-end sm:self-auto"
          >
            Ver Carnet Digital
          </button>
        </div>
      )}

      {/* TOP DESCARGAS & TOP MÓDULOS (COMPACTO Y DISCRETO) */}
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
          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
            En vivo
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {/* COL 1: TOP ARCHIVOS DESCARGADOS */}
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

          {/* COL 2: TOP MÓDULOS MÁS VISITADOS */}
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

      {/* SECCIÓN DE NOVEDAD RECIENTE (ÚLTIMA PUBLICACIÓN 48H) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gradient-to-r from-rose-500/20 to-indigo-500/20 text-rose-300 rounded-xl border border-rose-400/40 shadow-sm">
              <Flame className="w-4 h-4 text-rose-400 fill-current animate-pulse" />
            </span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-100 flex items-center gap-2">
                Última Publicación Clínica (48 Horas)
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Contenido recién añadido por el Dr. Carlos Leal
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('educacion')}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Biblioteca completa</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* HERO CARD DESTACADO: PROTOCOLO PREECLAMPSIA & ATLAS VISUAL (ACOG / FIGO / SOAP 2026) */}
        <div 
          onClick={() => handleNovedadClick(novedades[0])}
          className="group cursor-pointer bg-gradient-to-br from-slate-950 via-rose-950/90 to-indigo-950 border-2 border-rose-500/80 hover:border-rose-400 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 relative overflow-hidden text-white"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-rose-400/25 transition-all" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Visual Thumbnail & Content */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div className="relative shrink-0 group/img">
                <img 
                  src="/images/preeclampsia_placenta_maternal_connection.svg" 
                  alt="Placenta Humana, Conexión Materna & Cascada de Preeclampsia" 
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-rose-400/60 shadow-xl shadow-rose-950/50 group-hover/img:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-rose-500 to-amber-400 text-slate-950 p-1 rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-400 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-current text-slate-950" />
                    RECIÉN PUBLICADO • DESTACADO #1
                  </span>
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-400/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Activity className="w-3 h-3 text-rose-400" />
                    ACOG / FIGO / SOAP 2026
                  </span>
                  <span className="text-[10px] font-semibold text-amber-200/90 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Atlas 8 Láminas HD + Guía PDF Oficial
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white group-hover:text-rose-300 transition-colors tracking-tight leading-tight">
                  🧬 Protocolo Obstétrico y Atlas Visual: Preeclampsia, Eclampsia y Síndrome HELLP
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium max-w-2xl">
                  Fisiopatología celular (desbalance sFlt-1/PlGF), neuroprotección NMDA con Sulfato de Magnesio (Zuspan/Pritchard), manejo escalonado de crisis hipertensiva en 15 min, restricción hídrica estricta (60-80 mL/h), umbrales neuroaxiales (≥70-80k plaquetas) y Guía Oficial descargable en PDF de 5 páginas.
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {['🧬 Fisiopatología sFlt-1', '📋 Criterios ACOG/FIGO', '💊 MgSO4 NMDA', '🩸 Crisis HTA 15 min', '💧 Restricción 60-80 mL/h', '🎯 Umbrales Neuroaxiales', '🖼️ Atlas 8 Láminas HD', '📄 Guía PDF 5 Páginas'].map((pill, pIdx) => (
                    <span key={pIdx} className="text-[10px] font-extrabold bg-slate-900/90 text-rose-300 border border-slate-700/80 px-2 py-0.5 rounded-lg">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto">
              <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-2.5 text-center space-y-1 shadow-inner hidden sm:block">
                <span className="text-[9px] font-bold text-rose-400 uppercase">Compendio Médico Oficial</span>
                <div className="flex items-center justify-center gap-1 font-mono text-[11px] font-black">
                  <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-700">8 Láminas HD</span>
                  <ArrowRight className="w-3 h-3 text-rose-400" />
                  <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">Dossier PDF 5 Págs</span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNovedadClick(novedades[0]);
                }}
                className="bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-xl shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group-hover:scale-105 w-full"
              >
                <Play className="w-4 h-4 text-slate-950 fill-current" />
                <span>Ver Protocolo, Atlas HD & PDF</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Menú de Módulos Clínicos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            const isSuper = card.superLlamativo;
            return (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className={`group cursor-pointer bg-white hover:bg-slate-50/90 border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-2xl flex flex-col justify-between relative ${
                  isSuper
                    ? 'border-indigo-400 ring-2 ring-indigo-500/40 hover:ring-rose-500/60 md:col-span-2 shadow-indigo-500/10 hover:shadow-rose-500/20 bg-gradient-to-br from-white via-slate-50 to-indigo-50/30'
                    : card.highlight
                    ? 'border-blue-300 ring-2 ring-blue-500/20 md:col-span-2'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Image Header / Thumbnail */}
                <div className={`relative ${isSuper ? 'h-48' : 'h-40'} w-full overflow-hidden bg-slate-100`}>
                  <img
                    src={card.image}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${isSuper ? 'from-slate-950 via-slate-900/40 to-transparent' : 'from-slate-900/80 via-slate-900/30 to-transparent'}`} />
                  
                  {/* Badge & Icon over image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl text-white shadow-md bg-gradient-to-br ${card.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-md backdrop-blur-md border ${
                        isSuper 
                          ? 'bg-rose-600/90 text-white border-rose-400/50 animate-pulse' 
                          : 'bg-slate-900/80 text-white border-white/20'
                      }`}>
                        {card.badge}
                      </span>
                    </div>

                    {isSuper && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950 shadow-lg font-mono">
                        ✨ Mód. #6 Destacado
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className={`text-base font-extrabold transition-colors ${
                      isSuper
                        ? 'text-indigo-950 group-hover:text-rose-600 text-lg'
                        : 'text-slate-900 group-hover:text-blue-600'
                    }`}>
                      {card.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-normal">
                      {card.desc}
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 font-semibold">
                      {isSuper ? 'Biblioteca Digital Oficial' : 'Módulo Anestésico'}
                    </span>
                    <span className={`flex items-center gap-1.5 text-xs font-bold transition-transform group-hover:translate-x-1 ${
                      isSuper ? 'text-rose-600 font-black' : 'text-blue-600'
                    }`}>
                      Ingresar al módulo <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contacto Directo & Sugerencias Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl text-white space-y-3">
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

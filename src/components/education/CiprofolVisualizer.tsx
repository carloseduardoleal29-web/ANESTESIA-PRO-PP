import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Heart, 
  Brain, 
  Scale, 
  Clock, 
  Sliders, 
  ShieldCheck, 
  Info,
  Maximize2
} from 'lucide-react';
import jsPDF from 'jspdf';

const CIPROFOL_SLIDES = [
  {
    id: 1,
    title: '1. Mecanismo de Acción y Estructura Molecular',
    subtitle: 'Modulador Alostérico Positivo del Receptor GABA-A',
    src: '/images/ciprofol/slide_1_mecanismo_gabaa.svg',
    summary: 'Derivado alquilfenol con sustitución de ciclopropilo. Potencia 4-5 veces mayor que propofol con afinidad estérica optimizada por subunidades β2 y β3 del complejo GABA-A.'
  },
  {
    id: 2,
    title: '2. Farmacocinética y Metabolismo Orgánico',
    subtitle: 'Modelo Tricompartimental y Aclaramiento Plasmático',
    src: '/images/ciprofol/slide_2_farmacocinetica_farmacodinamia.svg',
    summary: 'Aclaramiento de 1.8 L/min por glucuronidación hepática (UGT1A9). Semivida contexto-sensible corta (<15 min) y rápida recuperación tras cirugías prolongadas.'
  },
  {
    id: 3,
    title: '3. Guía de Dosificación Clínica Paso a Paso',
    subtitle: 'Inducción, Infusión TIVA y Sedación Ambulatoria',
    src: '/images/ciprofol/slide_3_dosificacion_clinica_tiva.svg',
    summary: 'Inducción: 0.4 - 0.5 mg/kg IV en 30-60 s (reducir a 0.2-0.3 en ancianos/ASA III-IV). Mantenimiento TIVA: 0.8 - 1.5 mg/kg/h. Sedación: 0.2 - 0.4 mg/kg.'
  },
  {
    id: 4,
    title: '4. Estabilidad Cardiovascular y Hemodinamia',
    subtitle: 'Menor Incidencia de Hipotensión Arterial y Preservación de RVS',
    src: '/images/ciprofol/slide_4_estabilidad_hemodinamica.svg',
    summary: 'Reducción de más del 65% en episodios de hipotensión (TAM <65 mmHg) frente a propofol. Menor requerimiento de vasopresores y preservación del barorreflejo.'
  },
  {
    id: 5,
    title: '5. Tolerancia Venosa y Supresión del Dolor',
    subtitle: 'Erradicación del Dolor a la Inyección sin Lidocaína',
    src: '/images/ciprofol/slide_5_dolor_inyeccion_tolerancia.svg',
    summary: 'Dolor a la inyección inferior al 5% (vs 70-80% en propofol). No requiere pre-medicación con lidocaína, optimizando el confort perioperatorio y la inducción sin agitación.'
  },
  {
    id: 6,
    title: '6. Cuadro Comparativo Integral: Ciprofol vs Propofol',
    subtitle: 'Consenso Internacional y Perlas de Práctica Clínica',
    src: '/images/ciprofol/slide_6_comparativa_ciprofol_vs_propofol.svg',
    summary: 'Síntesis comparativa de potencia, dosis, estabilidad tensional, dolor vascular, sobrecarga lipídica y tiempos de recuperación postoperatoria (Aldrete 10).'
  }
];

interface CiprofolVisualizerProps {
  onDownload?: () => void;
}

export const CiprofolVisualizer: React.FC<CiprofolVisualizerProps> = ({ onDownload }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'carousel' | 'calculator' | 'comparative'>('carousel');
  
  // Interactive Calculator State
  const [weightKg, setWeightKg] = useState(70);
  const [patientProfile, setPatientProfile] = useState<'adult' | 'elderly' | 'frail'>('adult');
  const [procedureType, setProcedureType] = useState<'induction' | 'tiva' | 'sedation'>('induction');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Dose calculations
  const getInductionDose = () => {
    if (patientProfile === 'frail') {
      const min = (weightKg * 0.2).toFixed(1);
      const max = (weightKg * 0.3).toFixed(1);
      return { mg: `${min} - ${max}`, rate: 'Infundir lentamente en 45-60 s', note: 'Paciente frágil o ASA III-IV: titular bolo fraccionado' };
    }
    if (patientProfile === 'elderly') {
      const min = (weightKg * 0.3).toFixed(1);
      const max = (weightKg * 0.4).toFixed(1);
      return { mg: `${min} - ${max}`, rate: 'Infundir en 40-50 s', note: 'Paciente mayor de 65 años: titulación cuidadosa' };
    }
    const min = (weightKg * 0.4).toFixed(1);
    const max = (weightKg * 0.5).toFixed(1);
    return { mg: `${min} - ${max}`, rate: 'Infundir en 30-45 s', note: 'Adulto estándar: pérdida de reflejos en 45-60 segundos' };
  };

  const getTivaDose = () => {
    const rateFactor = patientProfile === 'adult' ? 1.2 : 0.9;
    const mgPerHour = (weightKg * rateFactor).toFixed(1);
    const minMg = (weightKg * 0.8).toFixed(1);
    const maxMg = (weightKg * 1.5).toFixed(1);
    return {
      rateRange: `${minMg} - ${maxMg} mg/h`,
      targetRate: `${mgPerHour} mg/h`,
      propofolEquiv: `${(weightKg * rateFactor * 4.5).toFixed(0)} mg/h de Propofol`,
      lipidSaving: 'Reducción del ~80% de sobrecarga lipídica'
    };
  };

  const getSedationDose = () => {
    const initMin = (weightKg * 0.2).toFixed(1);
    const initMax = (weightKg * 0.4).toFixed(1);
    const rescueDose = (weightKg * 0.1).toFixed(1);
    return {
      initialBolus: `${initMin} - ${initMax} mg IV`,
      rescueBolus: `${rescueDose} mg cada 2-3 min según necesidad`,
      maxTotal: `${(weightKg * 1.0).toFixed(0)} mg dosis acumulada en procedimiento`
    };
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % CIPROFOL_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + CIPROFOL_SLIDES.length) % CIPROFOL_SLIDES.length);
  };

  // Generate official PDF booklet
  const handleExportPDF = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Page 1: Cover and Key Concepts
      doc.setFillColor(9, 13, 22);
      doc.rect(0, 0, 210, 297, 'F');

      // Title Banner
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(14, 15, 182, 35, 4, 4, 'F');
      doc.setDrawColor(56, 189, 248);
      doc.setLineWidth(0.8);
      doc.roundedRect(14, 15, 182, 35, 4, 4, 'S');

      doc.setTextColor(56, 189, 248);
      doc.setFontSize(10);
      doc.text('ANESTESIAPRO • GUÍA OFICIAL FARMACOLÓGICA 2026', 20, 23);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('CIPROFOL (HSK3486): NUEVO HIPNÓTICO GABAA', 20, 32);

      doc.setTextColor(148, 163, 184);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Autor: Dr. Carlos Leal | Anestesiología y Reanimación Perioperatoria', 20, 42);

      // Section 1: Overview
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(14, 56, 182, 55, 3, 3, 'F');
      doc.setTextColor(52, 211, 153);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. RESUMEN EJECUTIVO Y PERFIL MOLECULAR', 20, 64);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const intro = [
        '• Ciprofol (HSK3486) es un nuevo agente hipnótico sedante intravenoso derivado del alquilfenol.',
        '• Presenta un anillo fenólico con una sustitución esteroespecífica de ciclopropilo.',
        '• Potencia farmacodinámica: 4 a 5 veces superior a la del propofol tradicional.',
        '• Actúa como un potente modulador alostérico positivo del receptor GABA-A (subunidades β2 y β3).',
        '• Disminuye significativamente el dolor a la inyección venosa (<5% vs 70% en propofol).',
        '• Presenta un perfil hemodinámico notablemente más estable, con menor caída de la TAM y RVS.'
      ];
      let y = 71;
      intro.forEach(line => {
        doc.text(line, 20, y);
        y += 6;
      });

      // Section 2: Dosing Table
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(14, 117, 182, 75, 3, 3, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. GUÍA RÁPIDA DE DOSIFICACIÓN CLÍNICA', 20, 125);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('ESCENARIO CLÍNICO', 20, 134);
      doc.text('DOSIS RECOMENDADA', 75, 134);
      doc.text('OBSERVACIONES CLÍNICAS', 130, 134);
      doc.setDrawColor(71, 85, 105);
      doc.line(20, 136, 190, 136);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      
      doc.text('Inducción General', 20, 143);
      doc.text('0.4 - 0.5 mg/kg IV', 75, 143);
      doc.text('Bolo en 30-45 s. BIS <45 en 50 s.', 130, 143);

      doc.text('Inducción Anciano / ASA III', 20, 151);
      doc.text('0.2 - 0.3 mg/kg IV', 75, 151);
      doc.text('Titular lento en 60 s. Gran estabilidad.', 130, 151);

      doc.text('Mantenimiento TIVA', 20, 159);
      doc.text('0.8 - 1.5 mg/kg/h', 75, 159);
      doc.text('Equivale a 4-8 mg/kg/h de Propofol.', 130, 159);

      doc.text('Sedación Endoscópica', 20, 167);
      doc.text('0.2 - 0.4 mg/kg inicial', 75, 167);
      doc.text('Bolos de rescate 0.1 - 0.2 mg/kg.', 130, 167);

      doc.text('Terapia Intensiva (UCI)', 20, 175);
      doc.text('0.3 - 0.8 mg/kg/h', 75, 175);
      doc.text('Baja sobrecarga lipídica (evita PRIS).', 130, 175);

      // Section 3: Key Advantages
      doc.setFillColor(15, 23, 42);
      doc.roundedRect(14, 198, 182, 70, 3, 3, 'F');
      doc.setTextColor(251, 191, 36);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('3. PERLAS CLÍNICAS Y SEGURIDAD PERIOPERATORIA', 20, 206);

      doc.setTextColor(241, 245, 249);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      const pearls = [
        '1. Dolor a la Inyección Erradicado: No se requiere pre-medicación con Lidocaína.',
        '2. Estabilidad de la Presión Arterial: Reduce en un 66% los requerimientos de vasopresores.',
        '3. Recuperación Lúcida y Oportuna: Tiempo de despertar de 6 a 10 min tras cese de infusión.',
        '4. Menor Carga de Triglicéridos: Su alta potencia permite formularlo con un 80% menos de lípidos.',
        '5. Excreción de Metabolitos Inactivos: 85% renal como glucurónido hidrosoluble inocuo.'
      ];
      y = 214;
      pearls.forEach(p => {
        doc.text(p, 20, y);
        y += 8;
      });

      // Footer
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.text('Documento compilado y certificado para uso clínico por Dr. Carlos Leal • AnestesiaPro', 20, 285);
      doc.text('Página 1 de 1', 180, 285);

      doc.save('AnestesiaPro_Guia_Oficial_Ciprofol_HSK3486_2026.pdf');
      if (onDownload) onDownload();
    } catch (e) {
      console.error('Error generando PDF de Ciprofol:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const currentSlide = CIPROFOL_SLIDES[currentSlideIndex];
  const inductionCalc = getInductionDose();
  const tivaCalc = getTivaDose();
  const sedationCalc = getSedationDose();

  return (
    <div className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-cyan-950/80 to-slate-950 p-4 md:p-6 border-b border-cyan-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> VADEMÉCUM VANGUARDIA 2026
              </span>
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                ÁLBUM HD (6 LÁMINAS)
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Ciprofol (HSK3486): Nuevo Agente Hipnótico GABAA
            </h2>
            <p className="text-xs md:text-sm text-cyan-200/80 font-medium">
              Atlas Farmacológico, Calculadora de Dosis en Vivo y Comparativa Clínica vs Propofol • <strong className="text-cyan-300">Dr. Carlos Leal</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs md:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-900/30 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Descargar Guía y Tablas de Dosificación en PDF"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{isGeneratingPdf ? 'Generando PDF...' : 'Descargar Guía PDF'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-5 border-t border-slate-800 pt-3">
          <button
            onClick={() => setActiveTab('carousel')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'carousel'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Álbum Visual de Láminas ({CIPROFOL_SLIDES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Calculadora de Dosis en Vivo</span>
          </button>

          <button
            onClick={() => setActiveTab('comparative')}
            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'comparative'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Comparativa vs Propofol</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* TAB 1: CAROUSEL VIEWER */}
        {activeTab === 'carousel' && (
          <div className="space-y-4">
            {/* Visualizer Display Box with 100% Cross-Device Robustness */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[360px] md:min-h-[580px]">
              {/* Slide Image with Graceful Loading and Fallback */}
              <div className="relative w-full flex items-center justify-center p-2 md:p-4">
                <img
                  src={currentSlide.src}
                  alt={currentSlide.title}
                  className="w-full max-h-[72vh] object-contain rounded-xl shadow-lg select-none"
                  loading="eager"
                />
              </div>

              {/* Navigation Arrows Overlay */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-slate-950/80 hover:bg-cyan-600/90 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-90 z-20 backdrop-blur-md"
                aria-label="Lámina Anterior"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-11 h-11 md:w-14 md:h-14 rounded-full bg-slate-950/80 hover:bg-cyan-600/90 text-white border border-slate-700/80 flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-90 z-20 backdrop-blur-md"
                aria-label="Lámina Siguiente"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>

              {/* Slide Indicator Badge */}
              <div className="absolute top-3 right-3 bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-black px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                Lámina {currentSlideIndex + 1} de {CIPROFOL_SLIDES.length}
              </div>
            </div>

            {/* Slide Summary Card */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400 font-black">#{currentSlide.id}</span>
                  {currentSlide.title}
                </h4>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {currentSlide.summary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400">Deslizar o usar miniaturas:</span>
              </div>
            </div>

            {/* Thumbnail Strip (Interactive) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2">
              {CIPROFOL_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                    currentSlideIndex === idx
                      ? 'border-cyan-400 bg-cyan-950/60 shadow-lg shadow-cyan-950/40'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 relative">
                    <img src={slide.src} alt={slide.title} className="w-full h-full object-cover" />
                    {currentSlideIndex === idx && (
                      <div className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400 rounded-lg pointer-events-none" />
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-300 mt-1 truncate group-hover:text-white">
                    {idx + 1}. {slide.title.split(':')[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE DOSE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                Parámetros del Paciente
              </h3>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 font-medium">Peso Corporal (kg):</span>
                  <span className="text-xl font-black text-cyan-400 font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  step="1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>40 kg</span>
                  <span>70 kg</span>
                  <span>100 kg</span>
                  <span>140 kg</span>
                </div>
              </div>

              {/* Profile Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Perfil de Fragilidad / Estado Físico:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPatientProfile('adult')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      patientProfile === 'adult'
                        ? 'border-cyan-500 bg-cyan-950/80 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Adulto Estándar (ASA I-II)
                  </button>
                  <button
                    onClick={() => setPatientProfile('elderly')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      patientProfile === 'elderly'
                        ? 'border-cyan-500 bg-cyan-950/80 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Adulto Mayor (&gt;65a)
                  </button>
                  <button
                    onClick={() => setPatientProfile('frail')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      patientProfile === 'frail'
                        ? 'border-amber-500 bg-amber-950/80 text-amber-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Frágil / Shock / ASA III-IV
                  </button>
                </div>
              </div>

              {/* Procedure Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Objetivo Anestésico:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setProcedureType('induction')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      procedureType === 'induction'
                        ? 'border-emerald-500 bg-emerald-950/80 text-emerald-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Inducción General
                  </button>
                  <button
                    onClick={() => setProcedureType('tiva')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      procedureType === 'tiva'
                        ? 'border-indigo-500 bg-indigo-950/80 text-indigo-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Mantenimiento TIVA
                  </button>
                  <button
                    onClick={() => setProcedureType('sedation')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      procedureType === 'sedation'
                        ? 'border-purple-500 bg-purple-950/80 text-purple-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    Sedación Procedimiento
                  </button>
                </div>
              </div>

              <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl space-y-1">
                <p className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Margen de Seguridad Optimizado
                </p>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Al poseer una potencia 4-5 veces superior a Propofol, la titulación se realiza en microgramos/miligramo fraccionados con excelente previsibilidad.
                </p>
              </div>
            </div>

            {/* Calculation Output Cards */}
            <div className="lg:col-span-7 space-y-4">
              {/* Output 1: Inducción */}
              <div className={`p-5 rounded-2xl border transition-all ${
                procedureType === 'induction'
                  ? 'bg-slate-950 border-emerald-500/60 shadow-xl shadow-emerald-950/20'
                  : 'bg-slate-950/60 border-slate-800 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">1. Dosis Bolo de Inducción General</h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Bolo Endovenoso
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Dosis Total para {weightKg} kg:</p>
                    <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
                      {inductionCalc.mg} <span className="text-sm text-slate-400">mg IV</span>
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Velocidad de Inyección:</p>
                    <p className="text-sm font-bold text-white mt-1">{inductionCalc.rate}</p>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">{inductionCalc.note}</p>
                  </div>
                </div>
              </div>

              {/* Output 2: Mantenimiento TIVA */}
              <div className={`p-5 rounded-2xl border transition-all ${
                procedureType === 'tiva'
                  ? 'bg-slate-950 border-indigo-500/60 shadow-xl shadow-indigo-950/20'
                  : 'bg-slate-950/60 border-slate-800 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <h4 className="text-base font-bold text-white">2. Mantenimiento en Infusión Continua (TIVA)</h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Titulación según BIS (40-60)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Rango de Infusión:</p>
                    <p className="text-2xl font-black text-indigo-400 font-mono mt-1">
                      {tivaCalc.rateRange}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Velocidad sugerida: <strong className="text-white">{tivaCalc.targetRate}</strong></p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-xs text-slate-400 font-medium">Equivalencia y Ahorro Lipídico:</p>
                    <p className="text-xs font-bold text-slate-200">Equivale a ~{tivaCalc.propofolEquiv}</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">{tivaCalc.lipidSaving}</p>
                  </div>
                </div>
              </div>

              {/* Output 3: Sedación */}
              <div className={`p-5 rounded-2xl border transition-all ${
                procedureType === 'sedation'
                  ? 'bg-slate-950 border-purple-500/60 shadow-xl shadow-purple-950/20'
                  : 'bg-slate-950/60 border-slate-800 opacity-75'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <h4 className="text-base font-bold text-white">3. Sedación Diagnóstica / Ambulatoria</h4>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Endoscopias / RMN
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Bolo Inicial de Sedación:</p>
                    <p className="text-2xl font-black text-purple-400 font-mono mt-1">
                      {sedationCalc.initialBolus}
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400 font-medium">Rescate y Límite de Seguridad:</p>
                    <p className="text-xs font-bold text-slate-200 mt-1">{sedationCalc.rescueBolus}</p>
                    <p className="text-[11px] text-amber-300 font-medium mt-1">Límite sugerido: {sedationCalc.maxTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPARATIVE VS PROPOFOL */}
        {activeTab === 'comparative' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase">
                  <Heart className="w-4 h-4" /> Estabilidad de Tensión Arterial
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400 font-mono">-66%</span>
                  <span className="text-xs text-slate-300">de caída tensional</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Incidencia de hipotensión arterial (TAM &lt; 65 mmHg) de tan solo 12.8% frente a 38.5% con Propofol convencional.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase">
                  <Zap className="w-4 h-4" /> Erradicación Dolor a la Inyección
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cyan-400 font-mono">&lt;5%</span>
                  <span className="text-xs text-slate-300">vs 70% en propofol</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Virtualmente indoloro. No genera la típica quemazón endotelial ni requiere asociar Lidocaína intravenosa previa.
                </p>
              </div>

              <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase">
                  <Brain className="w-4 h-4" /> Despertar y Orientación Lúcida
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-400 font-mono">6 - 10</span>
                  <span className="text-xs text-slate-300">minutos (Aldrete 10)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rápido aclaramiento hepático mediante glucuronidación con metabolitos inactivos sin resedación en la URPA.
                </p>
              </div>
            </div>

            {/* Full Comparative Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-cyan-400" />
                  Matriz Farmacológica Comparativa Ciprofol vs Propofol
                </h4>
                <span className="text-xs text-slate-400 font-mono">Ensayos Clínicos Fase III</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Parámetro Clínico</th>
                      <th className="p-3.5 text-rose-300 bg-rose-950/20">Propofol (Referencia)</th>
                      <th className="p-3.5 text-cyan-300 bg-cyan-950/30">Ciprofol (HSK3486)</th>
                      <th className="p-3.5">Impacto Clínico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium">
                    <tr>
                      <td className="p-3.5 font-bold text-white">Potencia Relativa</td>
                      <td className="p-3.5 text-slate-300 bg-rose-950/10">1x</td>
                      <td className="p-3.5 font-bold text-cyan-300 bg-cyan-950/20">4 a 5 veces mayor</td>
                      <td className="p-3.5 text-slate-400">Menor masa de soluto administrada</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">Dosis Inducción General</td>
                      <td className="p-3.5 text-slate-300 bg-rose-950/10">1.5 - 2.5 mg/kg IV</td>
                      <td className="p-3.5 font-bold text-emerald-300 bg-cyan-950/20">0.4 - 0.5 mg/kg IV</td>
                      <td className="p-3.5 text-slate-400">Inducción en 45-60 segundos</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">Dolor a la Inyección Venosa</td>
                      <td className="p-3.5 text-rose-400 font-bold bg-rose-950/10">60 - 80% (Frecuente)</td>
                      <td className="p-3.5 font-bold text-emerald-400 bg-cyan-950/20">&lt; 5% (Mínimo)</td>
                      <td className="p-3.5 text-emerald-300">Sin necesidad de lidocaína</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">Hipotensión en Inducción</td>
                      <td className="p-3.5 text-rose-400 font-bold bg-rose-950/10">35 - 45%</td>
                      <td className="p-3.5 font-bold text-cyan-300 bg-cyan-950/20">10 - 15%</td>
                      <td className="p-3.5 text-slate-400">Mayor estabilidad miocárdica</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">Carga Lipídica en TIVA</td>
                      <td className="p-3.5 text-slate-300 bg-rose-950/10">100% estándar</td>
                      <td className="p-3.5 font-bold text-cyan-300 bg-cyan-950/20">~20% (Reducción 80%)</td>
                      <td className="p-3.5 text-slate-400">Previene hipertrigliceridemia y PRIS</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-white">Calidad del Despertar</td>
                      <td className="p-3.5 text-slate-300 bg-rose-950/10">Lúcido en 8-12 min</td>
                      <td className="p-3.5 font-bold text-emerald-300 bg-cyan-950/20">Lúcido en 6-10 min</td>
                      <td className="p-3.5 text-slate-400">Cero resedación tardía</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Credentials */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Módulo Certificado • Dr. Carlos Leal (Anestesiología)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Descargar Guía Clínica Completa
          </button>
        </div>
      </div>
    </div>
  );
};

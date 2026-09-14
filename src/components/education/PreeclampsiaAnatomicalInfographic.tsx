import React, { useState } from 'react';
import { 
  Heart, 
  Baby, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Brain, 
  Layers, 
  Sun, 
  Moon, 
  ArrowRight, 
  Stethoscope, 
  Droplets, 
  Zap, 
  Maximize2, 
  Download, 
  X, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { PreeclampsiaAnesthesiaOverviewCard } from './diagrams/PreeclampsiaAnesthesiaOverviewCard';
import { TrophoblasticInvasionDiagram } from './diagrams/TrophoblasticInvasionDiagram';
import { SpiralArteryArteriopathyDiagram } from './diagrams/SpiralArteryArteriopathyDiagram';

interface Props {
  onNavigateToTab?: (tabId: string) => void;
}

interface ZoomedImageState {
  src: string;
  title: string;
  subtitle?: string;
}

interface AnatomicalHotspot {
  id: string;
  num: string;
  label: string;
  desc: string;
  x: string;
  y: string;
}

const TROPHOBLAST_HOTSPOTS: AnatomicalHotspot[] = [
  {
    id: 't-1',
    num: '1',
    label: 'Vellosidades Coriónicas Placentarias',
    desc: 'Estructuras vellosas fetales bañadas por sangre materna en el espacio intervelloso. En preeclampsia sufren estrés oxidativo, hipoperfusión e isquemia.',
    x: '24%',
    y: '22%'
  },
  {
    id: 't-2',
    num: '2',
    label: 'Citotrofoblasto Extravelloso Invasor',
    desc: 'Falla la segunda oleada de migración trofoblástica (semanas 8 a 18). Las células quedan confinadas a la decidua superficial y no alcanzan el miometrio.',
    x: '48%',
    y: '45%'
  },
  {
    id: 't-3',
    num: '3',
    label: 'Decidua Basal Materna',
    desc: 'Capa endometrial gestacional donde la invasión trofoblástica se detiene prematuramente en la paciente con preeclampsia.',
    x: '72%',
    y: '30%'
  },
  {
    id: 't-4',
    num: '4',
    label: 'Arteria Espiral No Remodelada (Estrecha)',
    desc: 'Conserva su túnica media muscular gruesa y fibras elásticas. Mantiene un calibre reducido y alta reactividad a vasoconstrictores.',
    x: '38%',
    y: '78%'
  },
  {
    id: 't-5',
    num: '5',
    label: 'Chorro Hemático Turbulento (Jet)',
    desc: 'Flujo sanguíneo a alta velocidad y alta resistencia que lesiona mecánicamente la arquitectura vellosa y desprende detritos sincitiales a la circulación materna.',
    x: '62%',
    y: '72%'
  }
];

const ARTERY_HOTSPOTS: AnatomicalHotspot[] = [
  {
    id: 'a-1',
    num: '1',
    label: 'Luz Vascular Estenosada',
    desc: 'Calibre arterial marcadamente reducido con incremento exponencial de la resistencia vascular uteroplacentaria (Doppler con notch proto-diastólico).',
    x: '50%',
    y: '50%'
  },
  {
    id: 'a-2',
    num: '2',
    label: 'Hipertrofia Muscular & Vasoespasmo',
    desc: 'Engrosamiento de la túnica media por contracción espástica sostenida ante el exceso de tromboxano A₂ y endotelina-1.',
    x: '28%',
    y: '38%'
  },
  {
    id: 'a-3',
    num: '3',
    label: 'Aterosis Aguda Placentaria',
    desc: 'Infiltración subendotelial de macrófagos espumosos repletos de lípidos y lipofagia parietal idéntica a aterosclerosis acelerada.',
    x: '72%',
    y: '34%'
  },
  {
    id: 'a-4',
    num: '4',
    label: 'Necrosis Fibrinoide de la Pared',
    desc: 'Desintegración de la arquitectura elástica y muscular con depósito de material eosinófilo denso (fibrina) y disrupción de la lámina basal.',
    x: '32%',
    y: '74%'
  },
  {
    id: 'a-5',
    num: '5',
    label: 'Disbalance Endotelial Vasoactivo',
    desc: 'Bloqueo masivo del VEGF y PlGF por sFlt-1 circulante, con colapso de óxido nítrico (NO) y activación de cascadas procoagulantes.',
    x: '70%',
    y: '70%'
  }
];

export const PreeclampsiaAnatomicalInfographic: React.FC<Props> = ({ onNavigateToTab }) => {
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [zoomedImage, setZoomedImage] = useState<ZoomedImageState | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  
  // Modos de visualización: 'original' (imagen fiel) vs 'interactive' (modelo reactivo interactivo)
  const [viewModeAnesthesia, setViewModeAnesthesia] = useState<'original' | 'interactive'>('original');
  const [viewModeTrophoblast, setViewModeTrophoblast] = useState<'original' | 'interactive'>('original');
  const [viewModeArtery, setViewModeArtery] = useState<'original' | 'interactive'>('original');

  // Estados para señalización anatómica interactiva
  const [showHotspotsTrophoblast, setShowHotspotsTrophoblast] = useState<boolean>(true);
  const [activeHotspotTrophoblast, setActiveHotspotTrophoblast] = useState<string | null>(null);

  const [showHotspotsArtery, setShowHotspotsArtery] = useState<boolean>(true);
  const [activeHotspotArtery, setActiveHotspotArtery] = useState<string | null>(null);

  // Imagenes médicas
  const anesthesiaImgSrc = '/images/infografia_anestesiologia_preeclampsia.svg';
  const trophoblastImgSrc = '/images/preeclampsia_placenta_maternal_connection.svg';
  const arteryImgSrc = '/images/fisiopatologia_arteriopatia.svg';


  return (
    <div 
      className={`w-full rounded-3xl p-4 sm:p-7 shadow-2xl space-y-8 transition-all duration-300 border-2 ${
        isNightMode 
          ? 'bg-slate-950 text-slate-100 border-rose-500/40 shadow-rose-950/20' 
          : 'bg-[#fffcf7] text-slate-900 border-amber-300/80 shadow-amber-900/10'
      }`}
    >
      {/* ============================================================ */}
      {/* 1. HEADER DE LA SECCIÓN                                      */}
      {/* ============================================================ */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 ${
        isNightMode ? 'border-slate-800' : 'border-amber-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase border ${
              isNightMode 
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/40' 
                : 'bg-rose-100 text-rose-800 border-rose-300'
            }`}>
              📸 Infografías e Ilustraciones Médicas Originales
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isNightMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              Fisiopatología &amp; Manejo Anestesiológico
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isNightMode 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-cyan-100 text-cyan-900 border-cyan-300'
            }`}>
              Alta Definición &amp; Zoom
            </span>
          </div>
          <h2 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${
            isNightMode ? 'text-white' : 'text-slate-900'
          }`}>
            Entendiendo la Preeclampsia: De la Falla Placentaria a la Agresión Materna
          </h2>
          <p className={`text-xs sm:text-sm max-w-3xl mt-0.5 ${
            isNightMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Visualización gráfica de las 3 etapas clave: el protocolo de manejo anestesiológico, la mala conexión trofoblástica y la arteriopatía con vasos estrechos.
          </p>
        </div>

        {/* CONTROLES DE CABECERA: TEMA Y ZOOM GENERAL */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-2 shadow-sm hover:shadow active:scale-95 ${
              isNightMode 
                ? 'bg-rose-600 text-white border-rose-400 shadow-rose-900/40 ring-2 ring-rose-400/30' 
                : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-50'
            }`}
          >
            {isNightMode ? (
              <>
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Modo Quirúrgico</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Modo Ilustración</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. INFOGRAFÍA 1: PEQUEÑA ABAJO DEL TÍTULO (MANEJO ANESTESIOLÓGICO) */}
      {/* ============================================================ */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl space-y-4 ${
        isNightMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-black">
                ★
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Infografía Ejecutiva Anestesiológica
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preclampsia y Eclampsia: Manejo Hemodinámico, Sulfato de Magnesio y Plan Quirúrgico
            </p>
          </div>

          {/* Selector de visualización y acciones */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewModeAnesthesia('original')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeAnesthesia === 'original'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📸 Póster Gráfico
              </button>
              <button
                onClick={() => setViewModeAnesthesia('interactive')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeAnesthesia === 'interactive'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔬 Tarjetas Interactivas
              </button>
            </div>

            <button
              onClick={() => setZoomedImage({
                src: anesthesiaImgSrc,
                title: 'PRECLAMPSIA Y ECLAMPSIA: MANEJO DESDE EL PUNTO DE VISTA ANESTESIOLÓGICO',
                subtitle: 'Infografía clínica con pilares de manejo hemodinámico, MgSO₄ y técnicas neuroaxiales'
              })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              title="Ver en pantalla completa / Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <a
              href={anesthesiaImgSrc}
              download="infografia_anestesiologia_preeclampsia.svg"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all"
              title="Descargar imagen SVG"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Contenido según vista */}
        {viewModeAnesthesia === 'original' ? (
          <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img 
              src={anesthesiaImgSrc}
              alt="Manejo de Preeclampsia y Eclampsia Anestesiológico"
              className="w-full max-h-[620px] object-contain cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
              onClick={() => setZoomedImage({
                src: anesthesiaImgSrc,
                title: 'PRECLAMPSIA Y ECLAMPSIA: MANEJO DESDE EL PUNTO DE VISTA ANESTESIOLÓGICO',
                subtitle: 'Infografía clínica con pilares de manejo hemodinámico, MgSO₄ y técnicas neuroaxiales'
              })}
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-lg pointer-events-none opacity-80 group-hover:opacity-100">
              <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
              <span>Clic para ampliar póster a pantalla completa</span>
            </div>
          </div>
        ) : (
          <PreeclampsiaAnesthesiaOverviewCard isNightMode={isNightMode} />
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. DIAGRAMA 1: MALA CONEXIÓN TROFOBLÁSTICA EN LA PLACENTA    */}
      {/* ============================================================ */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl space-y-4 ${
        isNightMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Mala Conexión Trofoblástica (Semanas 8 a 18)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Invasión Trofoblástica Normal vs Mala Conexión Trofoblástica en Preeclampsia
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowHotspotsTrophoblast(!showHotspotsTrophoblast)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                showHotspotsTrophoblast 
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800' 
                  : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
              title="Mostrar u ocultar señalizaciones anatómicas"
            >
              <span>{showHotspotsTrophoblast ? '👁️ Marcadores Activos' : '👁️‍🗨️ Activar Señalización'}</span>
            </button>

            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewModeTrophoblast('original')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeTrophoblast === 'original'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📸 Ilustración Médica Fiel
              </button>
              <button
                onClick={() => setViewModeTrophoblast('interactive')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeTrophoblast === 'interactive'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔬 Simulador Interactivo
              </button>
            </div>

            <button
              onClick={() => setZoomedImage({
                src: trophoblastImgSrc,
                title: 'MALA CONEXIÓN TROFOBLÁSTICA',
                subtitle: 'Invasión Trofoblástica Normal vs Mala Conexión Trofoblástica en Preeclampsia'
              })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              title="Ver en pantalla completa / Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <a
              href={trophoblastImgSrc}
              download="preeclampsia_placenta_maternal_connection.svg"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all"
              title="Descargar imagen SVG"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {viewModeTrophoblast === 'original' ? (
          <div>
            <div 
              className="relative group rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white flex items-center justify-center min-h-[380px]"
            >
              <img 
                src={trophoblastImgSrc}
                alt="Mala conexión trofoblástica: Invasión Trofoblástica Normal vs Mala Conexión Trofoblástica en Preeclampsia"
                className="w-full max-h-[520px] object-contain cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => setZoomedImage({
                  src: trophoblastImgSrc,
                  title: 'MALA CONEXIÓN TROFOBLÁSTICA',
                  subtitle: 'Invasión Trofoblástica Normal vs Mala Conexión Trofoblástica en Preeclampsia'
                })}
                referrerPolicy="no-referrer"
              />

              {/* SEÑALIZACIÓN ANATÓMICA INTERACTIVA */}
              {showHotspotsTrophoblast && TROPHOBLAST_HOTSPOTS.map((spot) => (
                <button
                  key={spot.id}
                  style={{ left: spot.x, top: spot.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspotTrophoblast(activeHotspotTrophoblast === spot.id ? null : spot.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-xl z-20 cursor-pointer ${
                    activeHotspotTrophoblast === spot.id
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/80 scale-125'
                      : 'bg-rose-600 text-white hover:bg-rose-500 hover:scale-110 ring-2 ring-white/90'
                  }`}
                  title={spot.label}
                >
                  <span>{spot.num}</span>
                  <span className="absolute -inset-1 rounded-full border border-rose-400 animate-ping opacity-75 pointer-events-none" />
                </button>
              ))}

              {/* TOOLTIP ACTIVO FLOTANTE */}
              {activeHotspotTrophoblast && (() => {
                const spot = TROPHOBLAST_HOTSPOTS.find(h => h.id === activeHotspotTrophoblast);
                if (!spot) return null;
                return (
                  <div 
                    style={{ left: spot.x, top: spot.y }}
                    className="absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+14px)] w-72 max-w-[90vw] p-3 rounded-xl bg-slate-950/95 text-white shadow-2xl border border-rose-500/40 backdrop-blur-md pointer-events-auto"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[11px] font-black flex items-center justify-center">
                          {spot.num}
                        </span>
                        <span className="text-xs font-bold text-rose-300">{spot.label}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveHotspotTrophoblast(null); }}
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">{spot.desc}</p>
                  </div>
                );
              })()}

              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-lg pointer-events-none opacity-80 group-hover:opacity-100">
                <ZoomIn className="w-3.5 h-3.5 text-rose-400" />
                <span>Clic para ampliar imagen médica a pantalla completa</span>
              </div>
            </div>

            {/* LEYENDA ANATÓMICA DETALLADA */}
            <div className="mt-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                  Estructuras Anatómicas Señaladas (Haz clic para resaltar en la imagen)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ilustración médica validada
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {TROPHOBLAST_HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspotTrophoblast(activeHotspotTrophoblast === spot.id ? null : spot.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                      activeHotspotTrophoblast === spot.id
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 shadow-sm ring-1 ring-rose-400'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-rose-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      activeHotspotTrophoblast === spot.id
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {spot.num}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{spot.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{spot.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <TrophoblasticInvasionDiagram isNightMode={isNightMode} />
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. DIAGRAMA 2: ARTERIOPATÍA Y VASOS ESTRECHOS                */}
      {/* ============================================================ */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 shadow-xl space-y-4 ${
        isNightMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Fisiopatología de la Preeclampsia: De la Invasión Trofoblástica a la Arteriopatía
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remodelación Arterial Normal vs Arteriopatía con Vasos Estrechos, Espasmo y Flujo Turbulento
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowHotspotsArtery(!showHotspotsArtery)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                showHotspotsArtery 
                  ? 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800' 
                  : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
              }`}
              title="Mostrar u ocultar señalizaciones anatómicas"
            >
              <span>{showHotspotsArtery ? '👁️ Marcadores Activos' : '👁️‍🗨️ Activar Señalización'}</span>
            </button>

            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-300 dark:border-slate-700">
              <button
                onClick={() => setViewModeArtery('original')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeArtery === 'original'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📸 Ilustración Médica Fiel
              </button>
              <button
                onClick={() => setViewModeArtery('interactive')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewModeArtery === 'interactive'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🔬 Simulador Interactivo
              </button>
            </div>

            <button
              onClick={() => setZoomedImage({
                src: arteryImgSrc,
                title: 'FISIOPATOLOGÍA DE LA PREECLAMPSIA: DE LA INVASIÓN A LA ARTERIOPATÍA',
                subtitle: 'Corte anatómico con detalle de vasoespasmo, luz estrecha y flujo turbulento'
              })}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
              title="Ver en pantalla completa / Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <a
              href={arteryImgSrc}
              download="fisiopatologia_arteriopatia.svg"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-all"
              title="Descargar imagen SVG"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {viewModeArtery === 'original' ? (
          <div>
            <div 
              className="relative group rounded-xl overflow-hidden border border-slate-300 shadow-md bg-white flex items-center justify-center min-h-[380px]"
            >
              <img 
                src={arteryImgSrc}
                alt="Fisiopatología de la Preeclampsia: De la Invasión Trofoblástica a la Arteriopatía"
                className="w-full max-h-[530px] object-contain cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                onClick={() => setZoomedImage({
                  src: arteryImgSrc,
                  title: 'FISIOPATOLOGÍA DE LA PREECLAMPSIA: DE LA INVASIÓN A LA ARTERIOPATÍA',
                  subtitle: 'Corte anatómico con detalle de vasoespasmo, luz estrecha y flujo turbulento'
                })}
                referrerPolicy="no-referrer"
              />

              {/* SEÑALIZACIÓN ANATÓMICA INTERACTIVA */}
              {showHotspotsArtery && ARTERY_HOTSPOTS.map((spot) => (
                <button
                  key={spot.id}
                  style={{ left: spot.x, top: spot.y }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspotArtery(activeHotspotArtery === spot.id ? null : spot.id);
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-xl z-20 cursor-pointer ${
                    activeHotspotArtery === spot.id
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/80 scale-125'
                      : 'bg-amber-600 text-white hover:bg-amber-500 hover:scale-110 ring-2 ring-white/90'
                  }`}
                  title={spot.label}
                >
                  <span>{spot.num}</span>
                  <span className="absolute -inset-1 rounded-full border border-amber-400 animate-ping opacity-75 pointer-events-none" />
                </button>
              ))}

              {/* TOOLTIP ACTIVO FLOTANTE */}
              {activeHotspotArtery && (() => {
                const spot = ARTERY_HOTSPOTS.find(h => h.id === activeHotspotArtery);
                if (!spot) return null;
                return (
                  <div 
                    style={{ left: spot.x, top: spot.y }}
                    className="absolute z-30 -translate-x-1/2 -translate-y-[calc(100%+14px)] w-72 max-w-[90vw] p-3 rounded-xl bg-slate-950/95 text-white shadow-2xl border border-amber-500/40 backdrop-blur-md pointer-events-auto"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">
                          {spot.num}
                        </span>
                        <span className="text-xs font-bold text-amber-300">{spot.label}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveHotspotArtery(null); }}
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-200 leading-snug">{spot.desc}</p>
                  </div>
                );
              })()}

              <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow-lg pointer-events-none opacity-80 group-hover:opacity-100">
                <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Clic para ampliar imagen médica a pantalla completa</span>
              </div>
            </div>

            {/* LEYENDA ANATÓMICA DETALLADA */}
            <div className="mt-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Estructuras Anatómicas e Histológicas Señaladas (Haz clic para resaltar)
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ilustración médica validada
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {ARTERY_HOTSPOTS.map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => setActiveHotspotArtery(activeHotspotArtery === spot.id ? null : spot.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-all border flex items-start gap-2 cursor-pointer ${
                      activeHotspotArtery === spot.id
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm ring-1 ring-amber-400'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                      activeHotspotArtery === spot.id
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {spot.num}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{spot.label}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{spot.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <SpiralArteryArteriopathyDiagram isNightMode={isNightMode} />
        )}
      </div>

      {/* ============================================================ */}
      {/* 5. IMPACTO MATERNO MULTISISTÉMICO (RESUMEN SINTÉTICO)        */}
      {/* ============================================================ */}
      <div className={`p-4 sm:p-6 rounded-2xl border-2 space-y-4 shadow-lg ${
        isNightMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/15 text-rose-500">
              <Zap className="w-4 h-4" />
            </span>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Etapa 3: Síndrome Endotelial Materno (Impacto Multisistémico)
            </h4>
          </div>
          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            Cascada de sFlt-1 &amp; Endoglina
          </span>
        </div>

        {/* 4 ÓRGANOS DIANA EN TARJETAS CONCISAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* CEREBRO */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isNightMode ? 'bg-indigo-950/20 border-indigo-900/50' : 'bg-indigo-50/60 border-indigo-200'
          }`}>
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-black text-xs">
              <Brain className="w-4 h-4" />
              <span>🧠 Cerebro (BHE &amp; PRES)</span>
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-snug">
              Edema vasogénico parieto-occipital. <strong>Cefalea pulsátil, fotopsias, hiperreflexia y Eclampsia</strong>.
            </p>
            <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 p-1.5 rounded">
              🎯 MgSO₄ de inmediato + Labetalol si PAS &gt; 160.
            </div>
          </div>

          {/* RIÑÓN */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isNightMode ? 'bg-sky-950/20 border-sky-900/50' : 'bg-sky-50/60 border-sky-200'
          }`}>
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-black text-xs">
              <Activity className="w-4 h-4" />
              <span>🫘 Riñón &amp; Podocitos</span>
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-snug">
              Endoteliosis glomerular y caída del filtrado. <strong>Proteinuria masiva</strong>, oliguria y retención de ácido úrico.
            </p>
            <div className="text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 p-1.5 rounded">
              🎯 Monitoreo de diuresis horaria (&gt;30 mL/h).
            </div>
          </div>

          {/* HÍGADO & SANGRE */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isNightMode ? 'bg-amber-950/20 border-amber-900/50' : 'bg-amber-50/60 border-amber-200'
          }`}>
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black text-xs">
              <Droplets className="w-4 h-4" />
              <span>🩸 Hígado &amp; Plaquetas</span>
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-snug">
              Microangiopatía trombótica (Síndrome HELLP). <strong>Esquistocitos, AST/ALT elevadas y plaquetopenia severa</strong>.
            </p>
            <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 p-1.5 rounded">
              🎯 Plaquetas &gt;70k para espinal; &gt;80k epidural.
            </div>
          </div>

          {/* FETO */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            isNightMode ? 'bg-rose-950/20 border-rose-900/50' : 'bg-rose-50/60 border-rose-200'
          }`}>
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-black text-xs">
              <Baby className="w-4 h-4" />
              <span>👶 Feto &amp; Placenta</span>
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-snug">
              Hipoxia crónica y desprendimiento velloso. <strong>RCIU, oligohidramnios, flujo reverso y abruptio</strong>.
            </p>
            <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 p-1.5 rounded">
              🎯 Finalización de la gestación: única cura definitiva.
            </div>
          </div>
        </div>

        {/* ACCESOS RÁPIDOS A PROTOCOLOS CLÍNICOS */}
        {onNavigateToTab && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Ir directo a los algoritmos de acción en el quirófano:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => onNavigateToTab('crisis')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Fármacos Antihipertensivos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('magnesio')}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Sulfato de Magnesio (Zuspan)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('anestesia')}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Manejo Quirófano / Cesárea</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL LIGHTBOX DE ZOOM PANTALLA COMPLETA                    */}
      {/* ============================================================ */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => { setZoomedImage(null); setZoomLevel(1); }}
        >
          {/* Barra superior de controles del modal */}
          <div 
            className="w-full max-w-6xl bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-3 flex items-center justify-between gap-3 shadow-2xl z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-0.5 max-w-xl">
              <h3 className="text-sm sm:text-base font-black text-white truncate">
                {zoomedImage.title}
              </h3>
              {zoomedImage.subtitle && (
                <p className="text-xs text-slate-400 truncate">
                  {zoomedImage.subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-cyan-400 w-12 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-all"
                title="Restablecer tamaño"
              >
                100%
              </button>
              <a
                href={zoomedImage.src}
                download="imagen_medica_preeclampsia.svg"
                className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-all ml-2"
                title="Descargar imagen completa"
              >
                <Download className="w-4 h-4" />
              </a>
              <button
                onClick={() => { setZoomedImage(null); setZoomLevel(1); }}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all ml-1"
                title="Cerrar modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contenedor de imagen ampliada */}
          <div 
            className="w-full max-w-6xl max-h-[82vh] overflow-auto bg-white rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-center p-2 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedImage.src} 
              alt={zoomedImage.title}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              className="max-w-full max-h-[76vh] object-contain transition-transform duration-150"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};

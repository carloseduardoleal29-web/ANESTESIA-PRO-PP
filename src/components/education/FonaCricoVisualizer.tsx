import React, { useState } from 'react';
import { 
  TriangleAlert, 
  Download, 
  FileText, 
  Maximize2, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  Activity,
  ChevronRight
} from 'lucide-react';

interface FonaCricoVisualizerProps {
  onDownload?: () => void;
}

export const FonaCricoVisualizer: React.FC<FonaCricoVisualizerProps> = ({ onDownload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = '/fona_infografia.svg';
    link.download = 'Procedimiento_FONA_Acceso_Frontal_al_Cuello_Dr_Carlos_Leal.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = [
    {
      num: 1,
      title: 'POSICIONAMIENTO Y LOCALIZACIÓN',
      badge: 'MEMBRANA CRICOTIROIDEA (OBJETIVO)',
      badgeColor: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-200',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      numColor: 'bg-cyan-600 shadow-cyan-600/40',
      iconText: '👤',
      desc: 'Paciente en decúbito supino con hiperextensión cervical ("laryngeal handshake"). La mano no dominante estabiliza el cartílago tiroides mientras el dedo índice localiza el espacio cricotiroideo (entre tiroides y cricoides).',
      detail: 'Espacio de 9 a 10 mm de altura x 22 a 30 mm de ancho, libre de grandes vasos en línea media.'
    },
    {
      num: 2,
      title: 'INCISIÓN CUTÁNEA VERTICAL',
      badge: 'INCISIÓN VERTICAL 4 CM',
      badgeColor: 'bg-rose-950/80 border-rose-500/40 text-rose-200',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      numColor: 'bg-rose-600 shadow-rose-600/40',
      iconText: '🔪',
      desc: 'Incisión vertical de 4 cm en la piel estrictamente sobre la línea media, desde el tercio inferior del cartílago tiroides hasta el cricoides.',
      detail: 'La dirección vertical evita lesionar las venas yugulares anteriores y permite ampliar el abordaje en cuellos gruesos u obesos.'
    },
    {
      num: 3,
      title: 'INCISIÓN TRANSVERSAL C-T',
      badge: 'INCISIÓN TRANSVERSAL DIRECTA',
      badgeColor: 'bg-amber-950/80 border-amber-500/40 text-amber-200',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      numColor: 'bg-amber-600 shadow-amber-600/40',
      iconText: '📍',
      desc: 'Con la hoja de bisturí horizontal (#10 o #20), punción directa a través de la membrana cricotiroidea hasta percibir la pérdida brusca de resistencia ("pop") y salida de aire.',
      detail: 'Mantener la hoja apoyada contra el borde superior del cartílago cricoides para no seccionar la arteria cricotiroidea transversa.'
    },
    {
      num: 4,
      title: 'DILATACIÓN E INSERCIÓN BOUGIE',
      badge: 'GUÍA BOUGIE 14 Fr CAUDAL',
      badgeColor: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200',
      borderColor: 'border-indigo-500/40 hover:border-indigo-400',
      numColor: 'bg-indigo-600 shadow-indigo-600/40',
      iconText: '📐',
      desc: 'Rotar el bisturí 90° hacia caudal para abrir la luz. Deslizar la guía bougie de 14 Fr con punta acodada hacia la tráquea distal hasta percibir los clics de los anillos traqueales o el tope de carina.',
      detail: 'El tope o "carinal hold-up" a los 10-15 cm confirma de forma inequívoca la posición intratraqueal antes de introducir el tubo.'
    },
    {
      num: 5,
      title: 'INSERCIÓN DE TUBO & CAPNOGRAFÍA',
      badge: 'TUBO 5.0 - 6.0 mm CON BALÓN',
      badgeColor: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      numColor: 'bg-emerald-600 shadow-emerald-600/40',
      iconText: '✅',
      desc: 'Avanzar un tubo endotraqueal o de traqueostomía lubricado de 5.0 a 6.0 mm sobre el bougie. Retirar la guía, inflar el balón de neumotaponamiento y confirmar ventilación inmediata.',
      detail: 'Estándar de Oro: Monitorización de capnografía con curva de ETCO₂ sostenida y auscultación pulmonar bilateral simétrica.'
    }
  ];

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl space-y-0 ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <TriangleAlert className="w-3.5 h-3.5 fill-current" />
              INFOGRAFÍA TÉCNICA ORIGINAL
            </span>
            <span className="text-cyan-400 font-bold text-xs">Vía Aérea de Emergencia</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            PROCEDIMIENTO FONA: ACCESO FRONTAL AL CUELLO - CRICOTIROTOMÍA DE EMERGENCIA
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadImage}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer hover:shadow-emerald-500/20"
            title="Descargar archivo vectorial SVG de alta definición"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Infografía (SVG HD)</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Infographic Display */}
      <div className="p-3 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-bold flex items-center gap-1.5 text-amber-300">
            <Eye className="w-4 h-4 text-amber-400" />
            Infografía Técnica Oficial (Algoritmo Scalpel-Bougie-Tube):
          </span>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
              <span>- Zoom</span>
            </button>
            <span className="font-mono text-cyan-300 font-bold px-1.5 min-w-[45px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.15))}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-bold cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>+ Zoom</span>
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-slate-950 rounded-2xl border border-amber-500/30 p-2 flex justify-center items-center min-h-[350px] max-h-[75vh] md:max-h-[85vh]">
          <img
            src="/fona_infografia.svg"
            alt="Procedimiento FONA - Cricotirotomía de Emergencia"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            className="rounded-xl max-w-full h-auto object-contain max-h-[70vh] md:max-h-[80vh] shadow-2xl transition-transform duration-200"
          />
        </div>
        <p className="text-[11px] text-center text-slate-400 italic">
          💡 Puedes pulsar los controles de Zoom para examinar cada detalle anatómico, puntos de incisión y flujo del procedimiento.
        </p>
      </div>

      {/* 5 Sequence Steps Cards */}
      <div className="p-4 sm:p-6 bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            DESGLOSE CLÍNICO PASO A PASO DEL ALGORITMO
          </h4>
          <span className="text-[11px] text-slate-400 font-semibold">Técnica Scalpel-Bougie-Tube</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              onClick={() => setActiveStep(activeStep === step.num ? null : step.num)}
              className={`bg-slate-950 rounded-2xl p-4 border flex flex-col justify-between space-y-3 relative group transition-all shadow-lg cursor-pointer ${
                step.borderColor
              } ${activeStep === step.num ? 'ring-2 ring-cyan-400 bg-slate-900' : ''}`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-7 h-7 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md ${step.numColor}`}>
                    {step.num}
                  </span>
                  <h5 className="text-[11px] font-black text-cyan-300 uppercase tracking-tight leading-tight">
                    {step.title}
                  </h5>
                </div>

                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-4 relative overflow-hidden">
                  <div className="w-11 h-11 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto border border-slate-700">
                    <span className="text-xl">{step.iconText}</span>
                  </div>
                  <div className={`rounded px-2 py-1 text-[9.5px] font-extrabold border ${step.badgeColor}`}>
                    {step.badge}
                  </div>
                </div>

                <p className="text-[11.5px] text-slate-300 leading-relaxed font-normal">
                  {step.desc}
                </p>

                {activeStep === step.num && (
                  <div className="p-2.5 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-[11px] text-cyan-200 mt-2">
                    <span className="font-bold block text-cyan-300 mb-1">Detalle crítico:</span>
                    {step.detail}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>Paso {step.num} de 5</span>
                <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  {activeStep === step.num ? 'Ocultar' : 'Ver detalle'} <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Warning Banner */}
        <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-rose-500/50 rounded-2xl p-4 text-xs text-rose-200 font-medium flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <TriangleAlert className="w-6 h-6 text-rose-400 shrink-0" />
            <p className="leading-relaxed">
              <strong className="text-white font-bold">NOTA DE SEGURIDAD CRÍTICA:</strong> El procedimiento FONA es una medida emergente de último recurso en situaciones de crisis de{' '}
              <strong className="text-rose-300">"No puedo intubar, No puedo oxigenar" (NINO / CICO)</strong>. Debe realizarse de forma inmediata tras el fracaso de la ventilación con mascarilla facial, dispositivo supraglótico e intubación traqueal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FonaCricoVisualizer;

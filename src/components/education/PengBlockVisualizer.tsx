import React, { useState } from 'react';
import { 
  Activity, 
  Download, 
  FileText, 
  Maximize2, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface PengBlockVisualizerProps {
  onDownload?: () => void;
  onDownloadPdf?: () => void;
}

export const PengBlockVisualizer: React.FC<PengBlockVisualizerProps> = ({ onDownload, onDownloadPdf }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const downloadImage = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const link = document.createElement('a');
    link.href = '/peng_bloqueo_infografia.svg';
    link.download = 'Bloqueo_PENG_Cadera_Dr_Carlos_Leal.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const steps = [
    {
      num: 1,
      title: 'POSICIÓN & TRANSDUCTOR',
      badge: 'SONDA CONVEXA 5-2 MHz / LINEAL',
      badgeColor: 'bg-sky-950/80 border-sky-500/40 text-sky-200',
      borderColor: 'border-sky-500/40 hover:border-sky-400',
      numColor: 'bg-sky-600 shadow-sky-600/40',
      iconText: '📡',
      desc: 'Paciente en decúbito supino. Posicionar la sonda transversal oblicua sobre el pliegue inguinal, justo a nivel de la espina ilíaca anteroinferior (EIAI) y la eminencia iliopúbica (IPE).',
      detail: 'En pacientes delgados puede emplearse sonda lineal de alta resolución (10-15 MHz); en adultos estándar se prefiere transductor convexo 5-2 MHz por profundidad (4-6 cm).'
    },
    {
      num: 2,
      title: 'REPAROS SONOANATÓMICOS',
      badge: 'EIAI • IPE • TENDÓN PSOAS',
      badgeColor: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-200',
      borderColor: 'border-cyan-500/40 hover:border-cyan-400',
      numColor: 'bg-cyan-600 shadow-cyan-600/40',
      iconText: '🦴',
      desc: 'Alinear la EIAI (lateral) y la IPE (medial). Localizar el vientre del músculo iliopsoas y el tendón oval hiperecoico del psoas descansando sobre la IPE.',
      detail: 'Identificar medialmente los vasos femorales (arteria y vena femoral) y el nervio femoral superficial para mantener un margen seguro estricto.'
    },
    {
      num: 3,
      title: 'PUNCIÓN EN PLANO (IN-PLANE)',
      badge: 'AGUJA 22G 80-100 MM',
      badgeColor: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200',
      borderColor: 'border-indigo-500/40 hover:border-indigo-400',
      numColor: 'bg-indigo-600 shadow-indigo-600/40',
      iconText: '🎯',
      desc: 'Insertar la aguja de LATERAL a MEDIAL en plano con la sonda ecográfica, con una inclinación de 30° a 45° dirigida hacia la eminencia iliopúbica.',
      detail: 'La trayectoria en plano permite visualizar el bisel completo en todo su trayecto atravesando el músculo iliopsoas hacia el espacio fascial profundo.'
    },
    {
      num: 4,
      title: 'POP FASCIAL & DIANA PROFUNDA',
      badge: 'CONTACTO IPE & RETIRAR 1 MM',
      badgeColor: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      numColor: 'bg-emerald-600 shadow-emerald-600/40',
      iconText: '🛡️',
      desc: 'Avanzar la punta hasta sentir el contacto óseo suave con el periostio de la eminencia iliopúbica, luego retirar 1 mm para quedar en el espacio fascial sub-tendinoso.',
      detail: 'La diana (target) es el espacio virtual entre la cara profunda del tendón del psoas y el periostio iliopúbico, donde discurren los ramos articulares sensitivos.'
    },
    {
      num: 5,
      title: 'ASPIRACIÓN & HIDRODISECCIÓN',
      badge: '20-30 mL ROPIVACAÍNA 0.2%',
      badgeColor: 'bg-teal-950/80 border-teal-500/40 text-teal-200',
      borderColor: 'border-teal-500/40 hover:border-teal-400',
      numColor: 'bg-teal-600 shadow-teal-600/40',
      iconText: '💉',
      desc: 'Aspiración negativa confirmada. Inyectar 20 a 30 mL de solución anestésica observando la separación y elevación neta del tendón del psoas del hueso sin resistencia.',
      detail: 'Ropivacaína 0.2% - 0.375% (o Levobupivacaína 0.25%) + Dexametasona 4 mg provee analgesia completa de la cápsula anterior por 18 a 36 horas sin debilidad motriz.'
    }
  ];

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-sky-500/40 shadow-2xl space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-sky-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-sky-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 fill-current" /> ATLAS ECOGRÁFICO OFICIAL
            </span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <Zap className="w-3 h-3" /> Ahorro Motor (Motor-Sparing)
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full hidden sm:flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dr. Carlos Leal
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            BLOQUEO PENG (PERICAPSULAR NERVE GROUP BLOCK) • PROTOCOLO ECOGUIADO DE CADERA
          </h3>
          <p className="text-xs text-slate-300 font-medium">
            Analgesia selectiva de la cápsula coxofemoral anterior con preservación integral de la fuerza del cuádriceps y deambulación precoz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadImage}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            title="Descargar Infografía Vectorial SVG"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Infografía</span>
          </button>
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              title="Descargar en formato Guía Clínica PDF"
            >
              <FileText className="w-4 h-4" />
              <span>Guía Clínica PDF</span>
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Vector Infographic Viewer */}
      <div className="p-3 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold flex items-center gap-1.5 text-sky-300">
              <Eye className="w-4 h-4 text-sky-400" />
              Infografía Ecográfica PENG de Alta Definición:
            </span>
            <span className="text-[11px] text-slate-400">
              (Sonoanatomía transversal, diana subtendinosa y reparos IPE/EIAI)
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" /> - Zoom
            </button>
            <span className="font-mono text-sky-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold flex items-center gap-1 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" /> + Zoom
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restablecer
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-slate-950 rounded-2xl border border-sky-500/30 p-2 flex justify-center items-center min-h-[350px] max-h-[75vh] md:max-h-[85vh]">
          <img
            src="/peng_bloqueo_infografia.svg"
            alt="Bloqueo PENG - Infografía Ecográfica"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            className="rounded-xl max-w-full h-auto object-contain max-h-[70vh] md:max-h-[80vh] shadow-2xl transition-transform duration-200"
          />
        </div>
      </div>

      {/* 5 Step Clinical Protocol Cards */}
      <div className="p-4 sm:p-6 bg-slate-900/80 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-sky-500 rounded-full" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              PROTOCOLO ECOGUIADO PASO A PASO (DR. PHILIP PENG 2018 / ESRA 2026)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Toca cada paso para ampliar detalles clínicos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.num}
              onClick={() => setActiveStep(activeStep === st.num ? null : st.num)}
              className={`bg-slate-950 rounded-2xl p-4 border ${st.borderColor} flex flex-col justify-between space-y-3 relative group transition-all shadow-lg cursor-pointer ${activeStep === st.num ? 'ring-2 ring-sky-400 bg-slate-900' : ''}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 text-white rounded-full flex items-center justify-center font-black text-xs ${st.numColor}`}>
                      {st.num}
                    </span>
                    <h5 className="text-[11px] font-black text-sky-200 uppercase tracking-tight leading-tight">
                      {st.title}
                    </h5>
                  </div>
                  <span className="text-lg">{st.iconText}</span>
                </div>

                <div className={`border rounded px-2 py-1 text-[9px] font-extrabold uppercase text-center ${st.badgeColor}`}>
                  {st.badge}
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {st.desc}
                </p>

                {activeStep === st.num && (
                  <div className="mt-2 p-2 bg-sky-950/50 border border-sky-500/30 rounded-xl text-[10px] text-sky-200 font-normal leading-relaxed animate-fadeIn">
                    <span className="font-bold text-sky-300 block mb-0.5">Perla Técnica:</span>
                    {st.detail}
                  </div>
                )}
              </div>

              <div className="text-[10px] font-bold text-sky-400/80 flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span>{activeStep === st.num ? 'Menos detalles' : 'Más detalles'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeStep === st.num ? 'rotate-90' : ''}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Comparison Matrix: PENG vs Femoral vs FIB */}
      <div className="p-4 sm:p-6 bg-slate-950 border-t border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
            ANÁLISIS COMPARATIVO: ¿POR QUÉ EL BLOQUEO PENG REVOLUCIONÓ LA ANALGESIA DE CADERA?
          </h4>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-200 border-collapse">
            <thead className="bg-slate-900 text-[11px] uppercase font-black text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Característica Clínica</th>
                <th className="p-3 text-sky-400">Bloqueo PENG (2018-2026)</th>
                <th className="p-3 text-rose-400">Bloqueo Nervio Femoral (FNB)</th>
                <th className="p-3 text-amber-400">Bloqueo Fascia Ilíaca (FIB)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              <tr className="bg-sky-950/20">
                <td className="p-3 font-bold text-white">Fuerza del Cuádriceps</td>
                <td className="p-3 text-emerald-300 font-extrabold">100% PRESERVADA (Cero paresia)</td>
                <td className="p-3 text-rose-300">Bloqueo motor completo (Parálisis)</td>
                <td className="p-3 text-amber-300">Debilidad parcial o completa frecuente</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Deambulación Precoz</td>
                <td className="p-3 text-emerald-300 font-extrabold">Inmediata (Mismo día de cirugía)</td>
                <td className="p-3 text-rose-300">Retardada &gt;24-48 h (Riesgo alto de caída)</td>
                <td className="p-3 text-amber-300">Retardada hasta recuperación motora</td>
              </tr>
              <tr className="bg-sky-950/20">
                <td className="p-3 font-bold text-white">Nervios Articulares Cubiertos</td>
                <td className="p-3 text-emerald-300 font-extrabold">N. Femoral + N. Obturador + N. Obturador Acc.</td>
                <td className="p-3 text-slate-300">Solo ramos del N. Femoral</td>
                <td className="p-3 text-slate-300">Femoral + Fémoro-cutáneo (Obturador errático)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Posicionamiento Raquianestesia</td>
                <td className="p-3 text-emerald-300 font-extrabold">Excelente alivio del dolor al flexionar cadera</td>
                <td className="p-3 text-slate-300">Bueno, pero requiere mayor latencia</td>
                <td className="p-3 text-slate-300">Variable en dolor de cápsula anterior</td>
              </tr>
              <tr className="bg-sky-950/20">
                <td className="p-3 font-bold text-white">Volumen Anestésico Requerido</td>
                <td className="p-3 text-sky-300 font-bold">20 a 30 mL en espacio fascial profundo</td>
                <td className="p-3 text-slate-300">10 a 15 mL perineural</td>
                <td className="p-3 text-slate-300">30 a 50 mL de alto volumen</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Droplet, 
  Activity, 
  Pill, 
  Syringe, 
  Stethoscope, 
  Layers, 
  ShieldAlert, 
  Camera,
  Upload,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Clock,
  Zap,
  Info
} from 'lucide-react';

export interface EmotiveGraphicProps {
  className?: string;
  customImage?: string;
  isAdmin?: boolean;
  onUploadImage?: (file: File) => void;
  onResetImage?: () => void;
  isUploading?: boolean;
}

// Default verified high-resolution clinical photographs for each step
export const DEFAULT_EMOTIVE_IMAGES: Record<string, { url: string; fallback: string; label: string; sub: string }> = {
  E1: {
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    label: 'Bolsa Colectora Subpélvica V-Drape',
    sub: 'Medición milimetrada en tiempo real'
  },
  M: {
    url: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    label: 'Masaje Uterino Bimanual',
    sub: 'Mano abdominal + Puño vaginal (Hamilton / Pinard)'
  },
  O: {
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=1200&q=85',
    label: 'Uterotónicos de 1ª Línea',
    sub: 'Oxitocina, Carbetocina y Derivados del Ergot'
  },
  T: {
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=85',
    label: 'Ácido Tranexámico (TXA) 1 g IV',
    sub: 'Infusión precoz < 15-30 min (Ensayo WOMAN / NEJM)'
  },
  I: {
    url: 'https://images.unsplash.com/photo-1631217868264-e8b6005014d7?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=85',
    label: 'Fluidos Tibios a 37°C & Acceso Venoso',
    sub: '2 Vías gruesas 14-16G + Calentador activo + Calcio'
  },
  V: {
    url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1584516150909-c43483ee7932?auto=format&fit=crop&w=1200&q=85',
    label: 'Inspección Ginecológica Instrumental',
    sub: 'Examen con valvas bajo luz y regla de las 4Ts'
  },
  E2: {
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=1200&q=85',
    fallback: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=85',
    label: 'Balón Intrauterino Bakri & PTM 1:1:1',
    sub: 'Insuflación 300-500 ml SF + Control de daños'
  }
};

/**
 * Reusable Image Container with Author Upload Trigger & Fullscreen Zoom
 */
const AcronymImageCard: React.FC<{
  itemKey: string;
  badgeBadge: string;
  badgeColor: string;
  customImage?: string;
  isAdmin?: boolean;
  onUploadImage?: (file: File) => void;
  onResetImage?: () => void;
  isUploading?: boolean;
  accentBorder: string;
}> = ({
  itemKey,
  badgeBadge,
  badgeColor,
  customImage,
  isAdmin,
  onUploadImage,
  onResetImage,
  isUploading,
  accentBorder
}) => {
  const config = DEFAULT_EMOTIVE_IMAGES[itemKey] || DEFAULT_EMOTIVE_IMAGES['E1'];
  const activeUrl = customImage || config.url;
  const [imgSrc, setImgSrc] = useState<string>(activeUrl);
  const [showZoom, setShowZoom] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Sync if customImage changes
  React.useEffect(() => {
    setImgSrc(customImage || config.url);
  }, [customImage, config.url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      onUploadImage(file);
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden border ${accentBorder} group bg-slate-950 shadow-inner flex flex-col justify-end min-h-[220px] sm:min-h-[240px]`}>
      {/* Background Image with Fallback and Smooth Zoom */}
      <img 
        src={imgSrc} 
        alt={config.label}
        referrerPolicy="no-referrer"
        onError={() => {
          if (imgSrc !== config.fallback) {
            setImgSrc(config.fallback);
          }
        }}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

      {/* Top Controls: Zoom & Author Badges */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-auto">
        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md border shadow-md backdrop-blur-md ${badgeColor}`}>
          {customImage ? '⭐ Foto Personalizada de Autor' : '📷 Fotografía Clínica HD'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowZoom(true)}
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors shadow backdrop-blur-md cursor-pointer"
            title="Ver imagen a pantalla completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {isAdmin && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-2 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-[10px] font-bold border border-emerald-400/60 transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
                title="Subir o cambiar foto exclusiva para este paso"
              >
                <Upload className="w-3 h-3" />
                <span>{isUploading ? 'Subiendo...' : 'Cambiar foto'}</span>
              </button>

              {customImage && onResetImage && (
                <button
                  type="button"
                  onClick={onResetImage}
                  className="p-1 rounded-lg bg-slate-900/80 hover:bg-rose-900/80 text-slate-400 hover:text-rose-200 border border-slate-700/60 transition-colors shadow"
                  title="Restaurar fotografía original por defecto"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Information Card */}
      <div className="relative z-10 p-3 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-[11px] font-black text-white uppercase tracking-wide flex items-center gap-1.5">
            {config.label}
          </p>
          <p className="text-[9.5px] text-slate-300 font-medium">
            {config.sub}
          </p>
        </div>
        <span className="bg-slate-900 text-slate-200 border border-slate-700 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow shrink-0">
          {badgeBadge}
        </span>
      </div>

      {/* Fullscreen Zoom Modal */}
      {showZoom && (
        <div 
          onClick={() => setShowZoom(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl p-2" onClick={e => e.stopPropagation()}>
            <img 
              src={imgSrc} 
              alt={config.label}
              className="max-h-[80vh] w-auto mx-auto rounded-xl object-contain"
            />
            <div className="p-3 text-center flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{config.label}</p>
                <p className="text-xs text-slate-400">{config.sub}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowZoom(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 1. [E] EARLY DETECTION: V-Drape Calibrated Blood Collector
 */
export const GraphicEarlyDetection: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-rose-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      {/* Top Header Badge */}
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-rose-400 flex items-center gap-1.5 font-mono">
          <Droplet className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> [E] V-DRAPE CALIBRADO & DETECCIÓN PRECOZ
        </span>
        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-rose-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      {/* Grid: Photo Card + Calibrated Scale & Objective Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="E1"
          badgeBadge="≥ 300-500 ml"
          badgeColor="bg-rose-950/80 text-rose-300 border-rose-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-rose-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-slate-800 pb-1">
            <span>MEDICIÓN DIRECTA vs ESTIMACIÓN</span>
            <span className="text-emerald-400 font-bold">100% OBJETIVO</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between bg-rose-950/80 border border-rose-700/80 px-2.5 py-1.5 rounded-lg">
              <span className="font-bold text-rose-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> 1000 ml
              </span>
              <span className="text-white font-black font-mono">HPP Severa (Alerta Roja)</span>
            </div>
            <div className="flex items-center justify-between bg-amber-950/80 border border-amber-600/80 px-2.5 py-1.5 rounded-lg">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> 500 ml
              </span>
              <span className="text-amber-200 font-black font-mono">Gatillo Bundle E-MOTIVE</span>
            </div>
            <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1.5 rounded-lg">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 300 ml
              </span>
              <span className="text-emerald-200 font-semibold font-mono">Alerta Temprana de Vigilancia</span>
            </div>
          </div>

          <div className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Reduce el retraso diagnóstico del <strong>49% al 7%</strong> según el ensayo clínico NEJM 2023.</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-rose-400">Impacto Clínico:</strong> La bolsa colectora subpélvica elimina la subestimación visual a simple vista, permitiendo activar al equipo obstétrico-anestésico antes de la descompensación hemodinámica.
      </div>
    </div>
  );
};

/**
 * 2. [M] UTERINE MASSAGE: Bimanual Compression (Hamilton / Pinard)
 */
export const GraphicUterineMassage: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-amber-400 flex items-center gap-1.5 font-mono">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" /> [M] MASAJE UTERINO BIMANUAL ACTIVO
        </span>
        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-amber-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="M"
          badgeBadge="Técnica Bimanual"
          badgeColor="bg-amber-950/80 text-amber-300 border-amber-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-amber-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-2">
          <div className="text-[10px] font-mono font-bold text-amber-400 border-b border-slate-800 pb-1">
            VECTORES DE COMPRESIÓN HEMOSTÁTICA
          </div>

          <div className="space-y-2 text-[10px]">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-amber-200 font-bold">1. Mano Abdominal</span>
              <span className="text-slate-300 font-mono text-[9px]">Comprime fondo hacia promontorio</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-amber-200 font-bold">2. Puño Vaginal</span>
              <span className="text-slate-300 font-mono text-[9px]">Eleva fondo de saco anterior</span>
            </div>
            <div className="bg-amber-950/70 border border-amber-700/80 p-2 rounded text-center text-[10px] font-bold text-amber-300">
              ⚡ Oclusión mecánica de las arterias espirales (Pinard)
            </div>
          </div>

          <p className="text-[9.5px] text-slate-400 italic text-center">
            *Mantener compresión continua mientras se preparan los uterotónicos.
          </p>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-amber-400">Mecanismo Clave:</strong> Ejerce hemostasia mecánica inmediata como puente terapéutico directo mientras los uterotónicos endovenosos alcanzan niveles terapéuticos en miometrio.
      </div>
    </div>
  );
};

/**
 * 3. [O] OXYTOCIC DRUGS: Oxytocin, Carbetocin & Ergometrine
 */
export const GraphicOxytocicDrugs: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-cyan-400 flex items-center gap-1.5 font-mono">
          <Pill className="w-4 h-4 text-cyan-400" /> [O] TRÍADA UTEROTÓNICA COMBINADA
        </span>
        <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-cyan-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="O"
          badgeBadge="Cascada Ca²⁺"
          badgeColor="bg-cyan-950/80 text-cyan-300 border-cyan-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-cyan-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between bg-cyan-950/80 border border-cyan-700/80 px-2.5 py-1.5 rounded-lg">
            <div>
              <span className="font-black text-cyan-300">OXITOCINA</span>
              <p className="text-[8.5px] text-slate-300">Infusión IV continua (250-500 mU/min)</p>
            </div>
            <span className="font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-cyan-800">10 - 20 UI</span>
          </div>

          <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1.5 rounded-lg">
            <div>
              <span className="font-black text-emerald-300">CARBETOCINA</span>
              <p className="text-[8.5px] text-slate-300">Bolo lento en 1 min (Efecto sostenido 4-6h)</p>
            </div>
            <span className="font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-emerald-800">100 mcg IV</span>
          </div>

          <div className="flex items-center justify-between bg-amber-950/80 border border-amber-700/80 px-2.5 py-1.5 rounded-lg">
            <div>
              <span className="font-black text-amber-300">METILERGONOVINA</span>
              <p className="text-[8.5px] text-rose-300 font-bold">Contraindicado en Preeclampsia / HTA</p>
            </div>
            <span className="font-mono font-black text-white bg-slate-900 px-2 py-0.5 rounded border border-amber-800">0.2 mg IM</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-cyan-400">Seguridad Anestésica:</strong> <span className="text-rose-400 font-bold">NUNCA administrar bolo rápido de oxitocina pura no diluida</span> (causa vasodilatación periférica masiva, hipotensión severa y colapso cardiovascular).
      </div>
    </div>
  );
};

/**
 * 4. [T] TRANEXAMIC ACID: Antifibrinolytic & Fibrin Mesh Protection
 */
export const GraphicTranexamicAcid: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-emerald-400 flex items-center gap-1.5 font-mono">
          <Syringe className="w-4 h-4 text-emerald-400" /> [T] ÁCIDO TRANEXÁMICO (TXA) PRECOZ
        </span>
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-emerald-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="T"
          badgeBadge="&lt; 15-30 min"
          badgeColor="bg-emerald-950/80 text-emerald-300 border-emerald-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-emerald-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-2 text-[10px]">
          <div className="text-[10px] font-mono font-bold text-emerald-400 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>CINÉTICA DE LA VENTANA DE ORO</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="space-y-1.5">
            <div className="bg-emerald-950/80 border border-emerald-700/80 p-2 rounded-lg flex items-center justify-between">
              <span className="font-bold text-emerald-200">Primeros 15-30 min</span>
              <span className="font-black text-emerald-400 text-[11px] font-mono">100% Eficacia</span>
            </div>
            <div className="bg-amber-950/80 border border-amber-700/80 p-2 rounded-lg flex items-center justify-between">
              <span className="font-bold text-amber-200">Cada 15 min de retraso</span>
              <span className="font-black text-amber-400 text-[11px] font-mono">-10% Beneficio</span>
            </div>
            <div className="bg-rose-950/80 border border-rose-700/80 p-1.5 rounded-lg flex items-center justify-between">
              <span className="font-bold text-rose-200">&gt; 3 Horas</span>
              <span className="font-black text-rose-400 text-[11px] font-mono">Pérdida de Efecto</span>
            </div>
          </div>

          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-[9.5px] text-slate-300">
            Dosis: <strong>1 g IV</strong> diluido en 100 ml de solución salina a pasar en 10 minutos. Repetir 1g a los 30 min si persiste sangrado.
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-emerald-400">Mecanismo Molecular:</strong> Bloquea competitivamente los sitios de lisina en el plasminógeno, impidiendo su transformación en plasmina y salvando la red de fibrina de la lisis aguda.
      </div>
    </div>
  );
};

/**
 * 5. [I] IV FLUIDS & RESUSCITATION: Large-Bore Access & Fluid Warming (37°C)
 */
export const GraphicIVFluids: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-blue-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-blue-400 flex items-center gap-1.5 font-mono">
          <Stethoscope className="w-4 h-4 text-blue-400" /> [I] FLUIDOS IV TIBIOS & REANIMACIÓN ANESTÉSICA
        </span>
        <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-blue-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="I"
          badgeBadge="37.0 °C"
          badgeColor="bg-blue-950/80 text-blue-300 border-blue-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-blue-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-1.5 text-[10px]">
          <div className="bg-blue-950/80 border border-blue-700/80 p-2 rounded-lg flex items-center justify-between">
            <span className="font-bold text-blue-200">Calentador de Fluidos</span>
            <span className="font-black text-amber-300 font-mono">Previene &lt; 36°C</span>
          </div>

          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-300">Cristaloides Iniciales</span>
            <span className="font-black text-white font-mono">1500 - 2000 ml máx</span>
          </div>

          <div className="bg-rose-950/80 border border-rose-700/80 p-2 rounded-lg flex items-center justify-between">
            <span className="font-bold text-rose-200">Gluconato de Calcio 10%</span>
            <span className="font-black text-rose-300 font-mono">1 - 2 g IV (Ca²⁺ &gt; 1.1)</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-blue-400">Protección Anestésica:</strong> La infusión masiva de sueros fríos perpetúa la tríada letal (hipotermia, acidosis y coagulopatía). Infunda a 37°C y reponga calcio tempranamente para contrarrestar el citrato de los hemoderivados.
      </div>
    </div>
  );
};

/**
 * 6. [V] VAGINAL EXAMINATION: Speculum & 4Ts Differential Diagnosis
 */
export const GraphicVaginalExam4Ts: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-purple-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-purple-400 flex items-center gap-1.5 font-mono">
          <Layers className="w-4 h-4 text-purple-400" /> [V] EXAMEN GENITAL SISTEMÁTICO: LAS 4Ts
        </span>
        <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-purple-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="V"
          badgeBadge="Regla de las 4Ts"
          badgeColor="bg-purple-950/80 text-purple-300 border-purple-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-purple-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-1.5 text-[10px]">
          <div className="flex items-center justify-between bg-rose-950/80 border border-rose-700/80 px-2.5 py-1 rounded-lg">
            <span className="font-bold text-rose-300">1. TONO (70%)</span>
            <span className="font-mono font-black text-white">Atonía Uterina</span>
          </div>

          <div className="flex items-center justify-between bg-amber-950/80 border border-amber-700/80 px-2.5 py-1 rounded-lg">
            <span className="font-bold text-amber-300">2. TRAUMA (20%)</span>
            <span className="font-mono font-black text-white">Desgarros / Hematomas</span>
          </div>

          <div className="flex items-center justify-between bg-indigo-950/80 border border-indigo-700/80 px-2.5 py-1 rounded-lg">
            <span className="font-bold text-indigo-300">3. TEJIDO (10%)</span>
            <span className="font-mono font-black text-white">Restos / Acretismo</span>
          </div>

          <div className="flex items-center justify-between bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1 rounded-lg">
            <span className="font-bold text-emerald-300">4. TROMBINA (1%)</span>
            <span className="font-mono font-black text-white">Coagulopatía / CID</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-purple-400">Diagnóstico Etiológico:</strong> Descartar desgarros de cuello uterino o de vagina profunda antes de atribuir todo el sangrado únicamente a la atonía uterina.
      </div>
    </div>
  );
};

/**
 * 7. [E] ESCALATE: Bakri Balloon, Massive Transfusion (1:1:1) & Damage Control
 */
export const GraphicEscalateBakri: React.FC<EmotiveGraphicProps> = ({ 
  className = '', 
  customImage, 
  isAdmin, 
  onUploadImage, 
  onResetImage, 
  isUploading 
}) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-red-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-red-400 flex items-center gap-1.5 font-mono">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" /> [E] ESCALAMIENTO, BALÓN DE BAKRI & PTM 1:1:1
        </span>
        <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 font-mono">
          <Camera className="w-3 h-3 text-red-400" /> Ilustración & Fotografía Clínica
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <AcronymImageCard 
          itemKey="E2"
          badgeBadge="&gt;85% Éxito"
          badgeColor="bg-red-950/80 text-red-300 border-red-800"
          customImage={customImage}
          isAdmin={isAdmin}
          onUploadImage={onUploadImage}
          onResetImage={onResetImage}
          isUploading={isUploading}
          accentBorder="border-red-500/40"
        />

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between min-h-[220px] sm:min-h-[240px] space-y-1.5 text-[10px]">
          <div className="bg-red-950/80 border border-red-700/80 p-2 rounded-lg flex items-center justify-between">
            <span className="font-bold text-red-200">Balón Intrauterino Bakri</span>
            <span className="font-black text-white font-mono">300 - 500 ml SF Tibia</span>
          </div>

          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
            <span className="font-bold text-slate-300">PTM Balanceado 1:1:1</span>
            <span className="font-black text-rose-400 font-mono">4 PG : 4 PFC : 1 Plaq</span>
          </div>

          <div className="bg-amber-950/80 border border-amber-700/80 p-2 rounded-lg flex items-center justify-between">
            <span className="font-bold text-amber-200">Fibrinógeno Temprano</span>
            <span className="font-black text-amber-300 font-mono">Meta &gt; 200 mg/dL</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-300 leading-snug">
        <strong className="text-red-400">Test de Taponamiento ("Tamponade Test"):</strong> La presión hidrostática intrauterina contra el lecho vascular detiene el sangrado en &gt;85% de los casos. Si cesa la salida hemática por el lumen en &lt; 5 min, el test es positivo y evita la histerectomía obstétrica.
      </div>
    </div>
  );
};

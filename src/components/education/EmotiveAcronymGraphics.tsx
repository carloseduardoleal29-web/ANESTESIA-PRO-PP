import React from 'react';
import { 
  Droplet, 
  Activity, 
  Pill, 
  Syringe, 
  Stethoscope, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  HeartHandshake, 
  Flame, 
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  Camera
} from 'lucide-react';

// Dedicated high-precision clinical illustrations
import imgVdrape from '../../assets/images/emotive_vdrape_1788182029024.jpg';
import imgBimanual from '../../assets/images/bimanual_massage_1788182044077.jpg';
import imgUterotonics from '../../assets/images/uterotonic_drugs_1788182060051.jpg';
import imgTxa from '../../assets/images/tranexamic_acid_1788182072707.jpg';
import imgResuscitation from '../../assets/images/resuscitation_iv_1788182086492.jpg';
import imgSpeculum from '../../assets/images/speculum_exam_1788182099928.jpg';
import imgBakri from '../../assets/images/bakri_balloon_1788182116563.jpg';

/**
 * 1. [E] EARLY DETECTION: V-Drape Calibrated Blood Collector
 */
export const GraphicEarlyDetection: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-rose-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      {/* Top Header Badge */}
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-rose-400 flex items-center gap-1.5 font-mono">
          <Droplet className="w-4 h-4 text-rose-500 fill-current animate-pulse" /> [E] V-DRAPE CALIBRADO & DETECCIÓN PRECOZ
        </span>
        <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-rose-400" /> Ilustración Clínica HD
        </span>
      </div>

      {/* Grid: Realistic Clinical Illustration + Calibrated Scale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-rose-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgVdrape} 
            alt="Bolsa colectora subpélvica calibrada V-Drape para cuantificación objetiva de hemorragia posparto"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-rose-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-rose-300 uppercase tracking-wide">Bolsa Colectora V-Drape</p>
              <p className="text-[9px] text-slate-300 font-medium">Marcas milimetradas visibles</p>
            </div>
            <span className="bg-rose-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              ≥ 300-500 ml
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-2">
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

          <div className="text-[9.5px] text-slate-400 italic text-center">
            *Reduce el retraso diagnóstico del 49% al 7% según NEJM 2023.
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
export const GraphicUterineMassage: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-amber-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-amber-400 flex items-center gap-1.5 font-mono">
          <Activity className="w-4 h-4 text-amber-400 animate-pulse" /> [M] MASAJE UTERINO BIMANUAL ACTIVO
        </span>
        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-amber-400" /> Corte Anatómico HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-amber-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgBimanual} 
            alt="Esquema anatómico de compresión uterina bimanual activa para control de hemorragia"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-amber-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-amber-300 uppercase">Técnica Bimanual</p>
              <p className="text-[9px] text-slate-300 font-medium">Mano abdominal + Puño vaginal</p>
            </div>
            <span className="bg-amber-600 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              Compresión Activa
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-2">
          <div className="text-[10px] font-mono font-bold text-amber-400 border-b border-slate-800 pb-1">
            VECTORES DE COMPRESIÓN HEMOSTÁTICA
          </div>

          <div className="space-y-2 text-[10px]">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-amber-200 font-bold">1. Mano Abdominal</span>
              <span className="text-slate-300 font-mono text-[9px]">Comprime fondo hacia promontorio</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-amber-200 font-bold">2. Puño Vaginal</span>
              <span className="text-slate-300 font-mono text-[9px]">Eleva fondo de saco anterior</span>
            </div>
            <div className="bg-amber-950/70 border border-amber-700/80 p-2 rounded text-center text-[10px] font-bold text-amber-300">
              ⚡ Oclusión mecánica de las arterias espirales (Pinard)
            </div>
          </div>
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
export const GraphicOxytocicDrugs: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-cyan-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-cyan-400 flex items-center gap-1.5 font-mono">
          <Pill className="w-4 h-4 text-cyan-400" /> [O] TRÍADA UTEROTÓNICA COMBINADA
        </span>
        <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-cyan-400" /> Farmacología HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgUterotonics} 
            alt="Fármacos uterotónicos Oxitocina y Carbetocina con receptor miometrial y contracción muscular"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-cyan-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-cyan-300 uppercase">Uterotónicos 1ª Línea</p>
              <p className="text-[9px] text-slate-300 font-medium">Receptor OXTR & Calcio miometrial</p>
            </div>
            <span className="bg-cyan-600 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              Cascada Ca²⁺
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-1.5 text-[10px]">
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
export const GraphicTranexamicAcid: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-emerald-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-emerald-400 flex items-center gap-1.5 font-mono">
          <Syringe className="w-4 h-4 text-emerald-400" /> [T] ÁCIDO TRANEXÁMICO (TXA) PRECOZ
        </span>
        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-emerald-400" /> Antifibrinolítico HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-emerald-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgTxa} 
            alt="Mecanismo de acción del Ácido Tranexámico protegiendo la red de fibrina contra la plasmina"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-emerald-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-emerald-300 uppercase">Dosis Estándar WOMAN / NEJM</p>
              <p className="text-[9px] text-slate-300 font-medium">1 g IV en 100 ml SF en 10 min</p>
            </div>
            <span className="bg-emerald-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              &lt; 15-30 min
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-2 text-[10px]">
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
export const GraphicIVFluids: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-blue-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-blue-400 flex items-center gap-1.5 font-mono">
          <Stethoscope className="w-4 h-4 text-blue-400" /> [I] FLUIDOS IV TIBIOS & REANIMACIÓN ANESTÉSICA
        </span>
        <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-blue-400" /> Quirófano HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-blue-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgResuscitation} 
            alt="Sistema de infusión y calentador de fluidos a 37 grados para reanimación anestésica"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-blue-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-blue-300 uppercase">2 Vías Venosas 14-16G</p>
              <p className="text-[9px] text-slate-300 font-medium">Calentador activo a 37.0°C</p>
            </div>
            <span className="bg-blue-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              37.0 °C
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-1.5 text-[10px]">
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
export const GraphicVaginalExam4Ts: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-purple-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-purple-400 flex items-center gap-1.5 font-mono">
          <Layers className="w-4 h-4 text-purple-400" /> [V] EXAMEN GENITAL SISTEMÁTICO: LAS 4Ts
        </span>
        <span className="bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-purple-400" /> Inspección Instrumental HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-purple-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgSpeculum} 
            alt="Examen sistemático del tracto genital con valvas quirúrgicas e iluminación directa"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-purple-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-purple-300 uppercase">Valvas & Buena Luz</p>
              <p className="text-[9px] text-slate-300 font-medium">Revisión de cérvix, canal y periné</p>
            </div>
            <span className="bg-purple-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              4Ts
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-1.5 text-[10px]">
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
export const GraphicEscalateBakri: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl border border-red-500/40 p-4 relative overflow-hidden flex flex-col justify-between shadow-xl space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] font-black border-b border-slate-800 pb-2">
        <span className="text-red-400 flex items-center gap-1.5 font-mono">
          <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" /> [E] ESCALAMIENTO, BALÓN DE BAKRI & PTM 1:1:1
        </span>
        <span className="bg-red-950 text-red-300 border border-red-800 px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
          <Camera className="w-3 h-3 text-red-400" /> Taponamiento HD
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="relative rounded-xl overflow-hidden border border-red-500/40 group bg-slate-950 shadow-inner">
          <img 
            src={imgBakri} 
            alt="Balón de taponamiento intrauterino de Bakri inflado con solución salina para control de hemorragia"
            referrerPolicy="no-referrer"
            className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
          
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-red-500/60 backdrop-blur-md rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-red-300 uppercase">Balón de Bakri Insuflado</p>
              <p className="text-[9px] text-slate-300 font-medium">300-500 ml SF tibia + drenaje</p>
            </div>
            <span className="bg-red-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded shadow">
              &gt;85% Éxito
            </span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between h-48 space-y-1.5 text-[10px]">
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

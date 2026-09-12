import React, { useState } from 'react';
import { Brain, Activity, Droplet, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';

export const PreeclampsiaVisualAtlas8Laminas: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patho' | 'brain' | 'renal' | 'fluids' | 'mgso4'>('patho');

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-xl space-y-6">
      {/* Header del Atlas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-black tracking-wider text-rose-400 uppercase flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            Atlas Clínico &amp; Fisiopatológico de Preeclampsia • AnestesiaPro 2026
          </span>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            Módulos Interactivos de Alta Definición Académica
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('patho')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'patho' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Cascada 2 Fases
          </button>
          <button
            onClick={() => setActiveTab('brain')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'brain' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. BHE &amp; Astrocitos
          </button>
          <button
            onClick={() => setActiveTab('renal')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'renal' ? 'bg-sky-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Podocitos &amp; Riñón
          </button>
          <button
            onClick={() => setActiveTab('fluids')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'fluids' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Starling &amp; Fluidos
          </button>
          <button
            onClick={() => setActiveTab('mgso4')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'mgso4' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            5. Farmacodinamia MgSO₄
          </button>
        </div>
      </div>

      {/* Contenido dinámico según la pestaña seleccionada */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 sm:p-5">
        {activeTab === 'patho' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-rose-300">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Fase Uteroplacentaria y Desbalance Angiogénico (sFlt-1 / PlGF)
              </span>
              <span className="font-mono text-slate-400">Modelo Actual ISSHP / ACOG</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-slate-950 border border-rose-900/50 p-4 rounded-xl space-y-2">
                <span className="font-bold text-rose-400 block text-sm">Fase 1: Placentación Defectuosa (Sem. 8-18)</span>
                <p>• Ausencia de transformación fisiológica de las arterias espirales uterinas.</p>
                <p>• Persistencia de túnica muscular elástica en los vasos (alta resistencia, bajo flujo).</p>
                <p>• Isquemia crónica placentaria y estrés oxidativo sincitial.</p>
              </div>
              <div className="bg-slate-950 border border-amber-900/50 p-4 rounded-xl space-y-2">
                <span className="font-bold text-amber-400 block text-sm">Desbalance Angiogénico Sistémico</span>
                <p>• Liberación masiva del factor antiangiogénico <strong className="text-white">sFlt-1</strong> a la circulación materna.</p>
                <p>• Secuestro y neutralización de factores proangiogénicos libres (<strong className="text-white">PlGF y VEGF</strong>).</p>
                <p>• <strong className="text-rose-400">Cociente sFlt-1/PlGF &gt; 38</strong>: Alerta clínica de disfunción endotelial inminente.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'brain' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
              <span className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                Edema Vasogénico (PRES) y Bloqueo NMDA por Magnesio
              </span>
              <span className="font-mono text-slate-400">Unidad Neurovascular</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-1.5">
                <span className="text-emerald-400 font-bold block">1. BHE Fisiológica</span>
                <p className="text-slate-300">Uniones estrechas herméticas y astrocitos regulando el glutamato y el potasio sinérgicamente.</p>
              </div>
              <div className="bg-slate-950 border border-rose-900/50 p-3.5 rounded-xl space-y-1.5">
                <span className="text-rose-400 font-bold block">2. Crisis Eclámptica (PRES)</span>
                <p className="text-slate-300">Hiperperfusión, ruptura de uniones y edema en lóbulos parieto-occipitales con tormenta de Ca²⁺.</p>
              </div>
              <div className="bg-slate-950 border border-cyan-900/50 p-3.5 rounded-xl space-y-1.5">
                <span className="text-cyan-400 font-bold block">3. Acción del MgSO₄</span>
                <p className="text-slate-300">El Mg²⁺ bloquea el poro del receptor NMDA como tapón iónico, frenando la convulsión y dilatando arteriolas.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'renal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-sky-300">
              <span className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                Endoteliosis Glomerular y Podocituria Masiva
              </span>
              <span className="font-mono text-slate-400">Proteinuria &gt; 300 mg/24h</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-slate-950 border border-sky-900/50 p-4 rounded-xl space-y-2">
                <span className="font-bold text-sky-400 block text-sm">El Papel del VEGF Podocitario</span>
                <p>Los podocitos secretan VEGF para mantener las fenestraciones de los capilares glomerulares. Al ser neutralizado por el sFlt-1, las células endoteliales se inflaman masivamente (endoteliosis).</p>
              </div>
              <div className="bg-slate-950 border border-rose-900/50 p-4 rounded-xl space-y-2">
                <span className="font-bold text-rose-400 block text-sm">Colapso de la Filtración</span>
                <p>Se pierden las cargas negativas de la membrana basal, los pedicelos podocitarios se desprenden (podocituria) y la albúmina inunda la orina primitiva, arruinando la presión oncótica.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fluids' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-emerald-400" />
                Fuerzas de Starling y Manejo Hídrico Restrictivo (60-80 mL/h)
              </span>
              <span className="font-mono text-rose-400 font-bold">¡Evitar Edema Pulmonar Agudo!</span>
            </div>
            <div className="bg-slate-950 border border-emerald-900/50 p-4 rounded-xl space-y-2 text-xs text-slate-300">
              <p className="font-bold text-white text-sm">¿Por qué está proscrita la precarga hídrica masiva?</p>
              <p className="leading-relaxed">
                La paciente con preeclampsia tiene volumen plasmático efectivo disminuido pero agua corporal total aumentada y endotelio roto. Infundir bolos de cristaloides dispara la presión hidrostática capilar y, con una presión oncótica reducida a menos de 16 mmHg, precipita de inmediato el <strong className="text-rose-400">Edema Pulmonar Agudo (principal causa de muerte materna evitable)</strong>. Maneje la hipotensión post-raquídea con vasopresores en bolos (Fenilefrina/Norepinefrina), nunca con volumen.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'mgso4' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-blue-300">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Farmacodinamia Celular y Protocolo de Administración de MgSO₄
              </span>
              <span className="font-mono text-slate-400">Rango: 4.8 - 8.4 mg/dL</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="bg-slate-950 border border-blue-900/50 p-4 rounded-xl space-y-1.5">
                <span className="font-bold text-blue-400 block text-sm">Esquema Terapéutico</span>
                <p>• <strong className="text-white">Dosis de Ataque:</strong> 4 a 6 g IV diluidos en 100 mL de solución en 15-20 minutos.</p>
                <p>• <strong className="text-white">Dosis de Mantenimiento:</strong> Infusión continua de 1 a 2 g/h en bomba de infusión.</p>
              </div>
              <div className="bg-slate-950 border border-rose-900/50 p-4 rounded-xl space-y-1.5">
                <span className="font-bold text-rose-400 block text-sm">Monitoreo y Antídoto</span>
                <p>• Evaluar reflejo patelar, frecuencia respiratoria (&gt;12 rpm) y diuresis (&gt;30 mL/h) antes de cada dosis.</p>
                <p>• <strong className="text-rose-400">Antídoto de urgencia:</strong> Gluconato de Calcio al 10% (1 g IV lento en 3 a 5 minutos).</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
        <span className="text-base text-rose-400 font-bold">💡</span>
        <p className="leading-relaxed">
          <strong className="text-white">Nota de Integración:</strong> Este componente utiliza renderizado vectorial nativo optimizado para prevenir errores de compilación y asegurar un rendimiento fluido y profesional en todos los dispositivos móviles y de escritorio.
        </p>
      </div>
    </div>
  );
};
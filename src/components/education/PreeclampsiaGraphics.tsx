import React, { useState } from 'react';
import { 
  Brain, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Droplet, 
  Zap, 
  Eye, 
  Layers, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

/**
 * Visual SVG Diagram 1: Cascada Fisiopatológica de la Preeclampsia
 * Dos fases: Falla en invasión trofoblástica + Disfunción endotelial sistémica
 */
export const GraphicPreeclampsiaPathophysiology: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-bold text-slate-300">
        <span className="flex items-center gap-2 text-rose-400">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          CASCADA FISIOPATOLÓGICA EN 2 FASES (MODELO ANGIOGÉNICO MODERNO)
        </span>
        <span className="text-[10px] text-slate-400 font-mono">ACOG / FIGO / ISSHP 2026</span>
      </div>

      <svg viewBox="0 0 900 480" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradPlacenta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4c0519" />
          </linearGradient>
          <linearGradient id="gradIsquemia" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#991b1b" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          <linearGradient id="gradEndotelio" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="gradOrgano" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
        </defs>

        {/* FASE 1: PLACENTACIÓN DEFECTUOSA */}
        <rect x="20" y="20" width="410" height="200" rx="16" fill="url(#gradPlacenta)" stroke="#e11d48" strokeWidth="1.5" />
        <rect x="35" y="32" width="160" height="24" rx="6" fill="#be123c" />
        <text x="45" y="48" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">FASE 1: UTEROPLACENTARIA</text>

        <text x="40" y="80" fill="#fecdd3" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Invasión Trofoblástica Anómala (Sem. 8-18)</text>
        <text x="40" y="102" fill="#fda4af" fontSize="11" fontFamily="sans-serif">• Ausencia de transformación trofoblástica extravellosa</text>
        <text x="40" y="120" fill="#fda4af" fontSize="11" fontFamily="sans-serif">• Arterias espirales mantienen capa muscular elástica</text>
        <text x="40" y="138" fill="#fda4af" fontSize="11" fontFamily="sans-serif">• Vasos de ALTA RESISTENCIA y BAJO FLUJO pulsátil</text>
        <text x="40" y="160" fill="#fecdd3" fontSize="12" fontWeight="bold" fontFamily="sans-serif">➡️ Consecuencia: Isquemia e Hipoxia Placentaria Crónica</text>
        <text x="40" y="180" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">Estrés oxidativo trofoblástico y liberación masiva de micropartículas sincitiales</text>

        {/* FLECHA CENTRAL CONECTORA */}
        <path d="M 440 120 L 490 120" stroke="#f43f5e" strokeWidth="4" strokeDasharray="6 3" />
        <circle cx="465" cy="120" r="14" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
        <text x="465" y="124" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">sFlt1</text>

        {/* DESBALANCE ANGIOGÉNICO */}
        <rect x="500" y="20" width="380" height="200" rx="16" fill="url(#gradIsquemia)" stroke="#f97316" strokeWidth="1.5" />
        <rect x="515" y="32" width="180" height="24" rx="6" fill="#c2410c" />
        <text x="525" y="48" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">DESBALANCE ANGIOGÉNICO</text>

        <text x="520" y="80" fill="#fed7aa" fontSize="14" fontWeight="bold" fontFamily="sans-serif">Sobreexpresión de Factores Antiangiogénicos</text>
        
        {/* Caja sFlt-1 y sEng */}
        <rect x="520" y="95" width="165" height="42" rx="8" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
        <text x="530" y="112" fill="#f87171" fontSize="11" fontWeight="bold" fontFamily="sans-serif">⬆️ sFlt-1 &amp; sEng</text>
        <text x="530" y="128" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">Secuestran VEGF y PlGF libre</text>

        {/* Caja VEGF y PlGF */}
        <rect x="695" y="95" width="165" height="42" rx="8" fill="#431407" stroke="#f97316" strokeWidth="1" />
        <text x="705" y="112" fill="#fb923c" fontSize="11" fontWeight="bold" fontFamily="sans-serif">⬇️ PlGF &amp; VEGF</text>
        <text x="705" y="128" fill="#fdba74" fontSize="9" fontFamily="sans-serif">Pérdida de señal proangiogénica</text>

        <text x="520" y="160" fill="#fef08a" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Cociente sFlt-1 / PlGF elevado &gt; 38 (Alerta clínica)</text>
        <text x="520" y="180" fill="#fed7aa" fontSize="10" fontFamily="sans-serif">Destrucción del glicocálix endotelial materno y pérdida de Óxido Nítrico (NO)</text>

        {/* FLECHA DESCENDENTE HACIA FASE 2 */}
        <path d="M 690 225 L 690 255 L 450 255 L 450 270" stroke="#f43f5e" strokeWidth="3" fill="none" />

        {/* FASE 2: DISFUNCIÓN ENDOTELIAL SISTÉMICA Y DIANAS ORGÁNICAS */}
        <rect x="20" y="275" width="860" height="185" rx="16" fill="url(#gradEndotelio)" stroke="#6366f1" strokeWidth="1.5" />
        <rect x="35" y="287" width="280" height="24" rx="6" fill="#4338ca" />
        <text x="45" y="303" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">FASE 2: DISFUNCIÓN ENDOTELIAL MATERNA MULTISISTÉMICA</text>

        {/* 1. CEREBRO */}
        <g transform="translate(35, 325)">
          <rect x="0" y="0" width="155" height="120" rx="10" fill="url(#gradOrgano)" stroke="#818cf8" strokeWidth="1" />
          <text x="10" y="20" fill="#a5b4fc" fontSize="11" fontWeight="bold">🧠 CEREBRO</text>
          <text x="10" y="38" fill="#e0e7ff" fontSize="9">• Hiperperfusión y pérdida</text>
          <text x="10" y="50" fill="#e0e7ff" fontSize="9">  de autorregulación cerebral</text>
          <text x="10" y="66" fill="#f87171" fontSize="9" fontWeight="bold">• Edema vasogénico (PRES)</text>
          <text x="10" y="80" fill="#ef4444" fontSize="9" fontWeight="bold">• ECLAMPSIA (Convulsión)</text>
          <text x="10" y="96" fill="#fca5a5" fontSize="8">• Riesgo ACV hemorrágico</text>
        </g>

        {/* 2. RIÑÓN */}
        <g transform="translate(205, 325)">
          <rect x="0" y="0" width="155" height="120" rx="10" fill="url(#gradOrgano)" stroke="#38bdf8" strokeWidth="1" />
          <text x="10" y="20" fill="#7dd3fc" fontSize="11" fontWeight="bold">🫘 RIÑÓN</text>
          <text x="10" y="38" fill="#e0f2fe" fontSize="9">• Endoteliosis glomerular</text>
          <text x="10" y="52" fill="#e0f2fe" fontSize="9">• Hipoalbuminemia / Fuga</text>
          <text x="10" y="68" fill="#38bdf8" fontSize="9" fontWeight="bold">• Proteinuria &gt; 300 mg/24h</text>
          <text x="10" y="84" fill="#f87171" fontSize="9" fontWeight="bold">• Oliguria / Cr &gt; 1.1 mg/dL</text>
          <text x="10" y="100" fill="#fca5a5" fontSize="8">• Falla renal aguda</text>
        </g>

        {/* 3. HÍGADO */}
        <g transform="translate(375, 325)">
          <rect x="0" y="0" width="155" height="120" rx="10" fill="url(#gradOrgano)" stroke="#fbbf24" strokeWidth="1" />
          <text x="10" y="20" fill="#fde047" fontSize="11" fontWeight="bold">🫀 HÍGADO</text>
          <text x="10" y="38" fill="#fef9c3" fontSize="9">• Isquemia periportal y</text>
          <text x="10" y="50" fill="#fef9c3" fontSize="9">  depósitos de fibrina</text>
          <text x="10" y="68" fill="#f59e0b" fontSize="9" fontWeight="bold">• TGO/AST y TGP &gt; 2x</text>
          <text x="10" y="84" fill="#ef4444" fontSize="9" fontWeight="bold">• SÍNDROME HELLP</text>
          <text x="10" y="100" fill="#f87171" fontSize="8">• Hematoma subcapsular</text>
        </g>

        {/* 4. PULMÓN */}
        <g transform="translate(545, 325)">
          <rect x="0" y="0" width="155" height="120" rx="10" fill="url(#gradOrgano)" stroke="#34d399" strokeWidth="1" />
          <text x="10" y="20" fill="#6ee7b7" fontSize="11" fontWeight="bold">🫁 PULMÓN</text>
          <text x="10" y="38" fill="#d1fae5" fontSize="9">• Aumento permeabilidad</text>
          <text x="10" y="50" fill="#d1fae5" fontSize="9">  alveolo-capilar</text>
          <text x="10" y="68" fill="#10b981" fontSize="9">• Caída presión oncótica</text>
          <text x="10" y="84" fill="#ef4444" fontSize="9" fontWeight="bold">• EDEMA AGUDO PULMÓN</text>
          <text x="10" y="100" fill="#fca5a5" fontSize="8">• Principal causa de muerte</text>
        </g>

        {/* 5. VASCULAR / COAGULACIÓN */}
        <g transform="translate(715, 325)">
          <rect x="0" y="0" width="150" height="120" rx="10" fill="url(#gradOrgano)" stroke="#f43f5e" strokeWidth="1" />
          <text x="10" y="20" fill="#fda4af" fontSize="11" fontWeight="bold">🩸 HEMATOLÓGICO</text>
          <text x="10" y="38" fill="#ffe4e6" fontSize="9">• Activación plaquetaria</text>
          <text x="10" y="50" fill="#ffe4e6" fontSize="9">  y consumo intravascular</text>
          <text x="10" y="68" fill="#f43f5e" fontSize="9" fontWeight="bold">• Plaquetas &lt; 100k</text>
          <text x="10" y="84" fill="#ef4444" fontSize="9" fontWeight="bold">• Hemólisis microangiop.</text>
          <text x="10" y="100" fill="#fda4af" fontSize="8">• RIESGO SANGRADO / CID</text>
        </g>
      </svg>

      <div className="mt-4 p-3 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
        <span className="text-base leading-none text-rose-400 font-bold">💡</span>
        <p className="leading-relaxed">
          <strong className="text-white">Perla Fisiopatológica:</strong> La preeclampsia <span className="text-rose-400 font-semibold">NO es simplemente hipertensión</span>; es una <span className="text-cyan-300 font-semibold">angiopatía sistémica tóxica</span> iniciada por isquemia placentaria que culmina en fuga capilar masiva, hipoalbuminemia, vasoespasmo generalizado y activación de la coagulación. El feto y la placenta son el motor fisiopatológico causante.
        </p>
      </div>
    </div>
  );
};

/**
 * INTERACTIVE COMPONENT 2: Astrocitos, Barrera Hematoencefálica (BHE) y Receptor NMDA
 * Explicación fisiopatológica ultra-visual de por qué el Magnesio evita y detiene la convulsión eclamptica
 */
export const GraphicBrainAstrocytesBBB: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'normal' | 'eclampsia' | 'magnesium'>('magnesium');

  return (
    <div className="w-full bg-slate-950 border-2 border-cyan-500/40 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-xs font-black tracking-wider text-cyan-400 uppercase">
              Neurobiología &amp; Fisiopatología Celular Cerebral
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Astrocitos, Barrera Hematoencefálica (BHE) y por qué el Magnesio previene la Convulsión Eclámptica
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('normal')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'normal' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. BHE Fisiológica
          </button>
          <button
            onClick={() => setActiveTab('eclampsia')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'eclampsia' 
                ? 'bg-rose-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Crisis Eclámptica (PRES)
          </button>
          <button
            onClick={() => setActiveTab('magnesium')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'magnesium' 
                ? 'bg-cyan-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Acción del MgSO₄
          </button>
        </div>
      </div>

      {/* Interactive Stage Visual */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 overflow-hidden">
        {activeTab === 'normal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> BHE Intacta y Astrocitos en Homeostasis
              </span>
              <span className="text-xs text-slate-400 font-mono">Presión de perfusión cerebral normal</span>
            </div>

            {/* SVG Visual Stage 1 */}
            <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950/70 rounded-xl border border-slate-800/80">
              {/* Capillary Blood Vessel */}
              <rect x="20" y="30" width="760" height="40" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
              <text x="35" y="55" fill="#818cf8" fontSize="11" fontWeight="bold">LUZ DEL CAPILAR CEREBRAL (Flujo laminar, eritrocitos normales)</text>
              {/* Tight Junctions */}
              <rect x="20" y="70" width="760" height="10" fill="#047857" stroke="#10b981" strokeWidth="1" />
              <text x="35" y="78" fill="#ffffff" fontSize="8" fontWeight="bold">UNIONES ESTRECHAS HERMÉTICAS (Claudina-5, Ocludina) - CERO FUGA</text>
              
              {/* Astrocyte End-feet layer */}
              <rect x="20" y="85" width="760" height="40" rx="6" fill="#064e3b" stroke="#059669" strokeWidth="1.5" />
              <text x="35" y="108" fill="#a7f3d0" fontSize="11" fontWeight="bold">PIES PERIVASCULARES ASTROCITARIOS (Acuaporina-4 AQP4 regulada)</text>
              <text x="35" y="120" fill="#6ee7b7" fontSize="9">Los astrocitos capturan y reciclan el glutamato sinérgicamente, manteniendo bajo el tono excitatorio.</text>

              {/* Neuronal Synapse */}
              <rect x="20" y="135" width="760" height="90" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="35" y="155" fill="#38bdf8" fontSize="11" fontWeight="bold">NEURONA POSTSINÁPTICA CORTICAL (Potencial de membrana en reposo: -70 mV)</text>
              <circle cx="300" cy="180" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="300" y="184" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">NMDA</text>
              <circle cx="300" cy="180" r="6" fill="#06b6d4" />
              <text x="330" y="184" fill="#94a3b8" fontSize="10">Poro cerrado por magnesio basal natural (bloqueo fisiológico)</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">🛡️ Barrera Selectiva:</span>
                <p className="text-slate-300 text-[11px]">Las uniones endoteliales estrechas impiden la entrada de agua, proteínas y iones tóxicos al parénquima cerebral.</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">🌟 Astrocito Regulador:</span>
                <p className="text-slate-300 text-[11px]">El pie astrocitario drena el exceso de potasio ($K^+$) y metaboliza el glutamato a glutamina para evitar la hiperexcitabilidad.</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">⚡ Umbral Convulsivo Alto:</span>
                <p className="text-slate-300 text-[11px]">Sin estímulo convulsivo. Las neuronas disparan potenciales de acción sincrónicos y organizados.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eclampsia' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Ruptura de BHE, Edema Astrocitario y Eclampsia
              </span>
              <span className="text-xs text-rose-400 font-mono font-bold">PAS &gt; 160 / PAM &gt; 120 mmHg</span>
            </div>

            {/* SVG Visual Stage 2 */}
            <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950/70 rounded-xl border border-rose-900/40">
              {/* Capillary Blood Vessel under hyperperfusion */}
              <rect x="20" y="30" width="760" height="40" rx="8" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
              <text x="35" y="55" fill="#fca5a5" fontSize="11" fontWeight="bold">HIPERPERFUSIÓN Y PÉRDIDA DE AUTORREGULACIÓN (Fuga hidrostática masiva)</text>
              {/* Broken Tight Junctions */}
              <rect x="20" y="70" width="760" height="10" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" strokeDasharray="6 4" />
              <text x="35" y="78" fill="#fecdd3" fontSize="8" fontWeight="bold">RUPTURA DE UNIONES ESTRECHAS: EXTRAVASACIÓN DE AGUA Y PROTEÍNAS (PRES)</text>
              
              {/* Swollen Astrocyte End-feet */}
              <rect x="20" y="85" width="760" height="40" rx="6" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
              <text x="35" y="105" fill="#fda4af" fontSize="11" fontWeight="bold">EDEMA ASTROCITARIO CITOTÓXICO Y VASOGÉNICO (Apertura aberrante de AQP4)</text>
              <text x="35" y="120" fill="#fecdd3" fontSize="9">El astrocito saturado no puede recaptar glutamato. El glutamato inunda la hendidura sináptica.</text>

              {/* Hyperactivated Neuronal Synapse */}
              <rect x="20" y="135" width="760" height="90" rx="8" fill="#1e1b4b" stroke="#e11d48" strokeWidth="1.5" />
              <text x="35" y="155" fill="#f87171" fontSize="11" fontWeight="bold">APERTURA MASIVA DEL RECEPTOR NMDA: ENTRADA DESCONTROLADA DE Ca²⁺</text>
              <circle cx="300" cy="180" r="16" fill="#b91c1c" stroke="#f87171" strokeWidth="2" />
              <text x="300" y="184" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">NMDA</text>
              <path d="M 280 160 L 300 175" stroke="#fbbf24" strokeWidth="3" markerEnd="url(#arrow)" />
              <text x="330" y="180" fill="#f87171" fontSize="11" fontWeight="bold">¡DESPOLARIZACIÓN PAROXÍSTICA GENERALIZADA!</text>
              <text x="330" y="196" fill="#fca5a5" fontSize="9.5">Descargas epileptiformes sincrónicas ➡️ CONVULSIÓN TÓNICO-CLÓNICA (ECLAMPSIA)</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">💥 Síndrome PRES:</span>
                <p className="text-rose-200 text-[11px]">Encefalopatía Posterior Reversible. Edema vasogénico en lóbulos occipitales y parietales (amaurosis, cefalea occipital y clonus).</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">🧠 Astrocitotricidad:</span>
                <p className="text-rose-200 text-[11px]">Los astrocitos se hinchan por entrada de agua mediante AQP4 y vierten glutamato excitotóxico al espacio intercelular.</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">⚡ Tormenta Iónica:</span>
                <p className="text-rose-200 text-[11px]">La entrada incesante de Ca²⁺ activa calpaínas y caspasas que dañan la mitocondria y disparan la actividad comicial.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'magnesium' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Neuroprotección Molecular por Sulfato de Magnesio
              </span>
              <span className="text-xs text-cyan-400 font-mono font-bold">Nivel terapéutico: 4.8 a 8.4 mg/dL</span>
            </div>

            {/* SVG Visual Stage 3 */}
            <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950/70 rounded-xl border border-cyan-800/60">
              {/* Capillary Blood Vessel with Magnesium */}
              <rect x="20" y="30" width="760" height="40" rx="8" fill="#082f49" stroke="#0284c7" strokeWidth="2" />
              <text x="35" y="55" fill="#38bdf8" fontSize="11" fontWeight="bold">VASODILATACIÓN ARTERIOLAR CEREBRAL POR Mg²⁺ (Aumento de PGI₂ y Óxido Nítrico)</text>
              {/* Stabilized Tight Junctions */}
              <rect x="20" y="70" width="760" height="10" fill="#0e7490" stroke="#06b6d4" strokeWidth="1" />
              <text x="35" y="78" fill="#ffffff" fontSize="8" fontWeight="bold">SELLADO DE LA BHE: Mg²⁺ DISMINUYE LA PERMEABILIDAD VASCULAR CEREBRAL</text>
              
              {/* Stabilized Astrocytes */}
              <rect x="20" y="85" width="760" height="40" rx="6" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="35" y="105" fill="#7dd3fc" fontSize="11" fontWeight="bold">ESTABILIZACIÓN DE ASTROCITOS: REDUCCIÓN DE ACUAPORINA-4 Y RECAPTURA DE GLUTAMATO</text>
              <text x="35" y="120" fill="#bae6fd" fontSize="9">El MgSO₄ atenúa drásticamente el edema vasogénico cerebral y restaura el microambiente iónico neuronal.</text>

              {/* Blocked NMDA Receptor */}
              <rect x="20" y="135" width="760" height="90" rx="8" fill="#082f49" stroke="#06b6d4" strokeWidth="1.5" />
              <text x="35" y="155" fill="#a5f3fc" fontSize="11" fontWeight="bold">BLOQUEO NO COMPETITIVO DEL RECEPTOR NMDA POR EL TAPÓN DE Mg²⁺</text>
              <circle cx="300" cy="180" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
              <text x="300" y="184" fill="#ffffff" fontSize="9" fontWeight="black" textAnchor="middle">NMDA</text>
              <circle cx="300" cy="180" r="8" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
              <text x="300" y="183" fill="#082f49" fontSize="8" fontWeight="black" textAnchor="middle">Mg²⁺</text>
              <text x="330" y="180" fill="#22d3ee" fontSize="11" fontWeight="bold">¡INHIBICIÓN DE LA ENTRADA DE CALCIO (Ca²⁺)!</text>
              <text x="330" y="196" fill="#e0f2fe" fontSize="9.5">Se eleva el umbral convulsivo, aborta el foco epileptogénico y protege al feto y la madre.</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-xl">
                <span className="text-cyan-300 font-bold block mb-1">🛡️ Tapón del Poro NMDA:</span>
                <p className="text-cyan-100 text-[11px]">El ion Mg²⁺ se aloja en el poro central del receptor NMDA, bloqueando el influjo de calcio aun en presencia de exceso de glutamato.</p>
              </div>
              <div className="bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-xl">
                <span className="text-cyan-300 font-bold block mb-1">🧠 Protección Astrocitaria:</span>
                <p className="text-cyan-100 text-[11px]">Inhibe la sobreexpresión de AQP4 en los pies de los astrocitos, resolviendo activamente el edema cerebral vasogénico.</p>
              </div>
              <div className="bg-cyan-950/40 border border-cyan-800/60 p-3 rounded-xl">
                <span className="text-cyan-300 font-bold block mb-1">🩸 Vasodilatador Selectivo:</span>
                <p className="text-cyan-100 text-[11px]">Revierte el vasoespasmo de las arterias cerebrales medias y posteriores, mejorando la oxigenación del parénquima isquémico.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real Micrograph / Anatomical Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden border-2 border-cyan-500/50 bg-slate-950 flex-shrink-0 relative group shadow-lg">
          <img 
            src="/images/blood_brain_barrier_nih.png" 
            alt="Barrera Hematoencefálica y Astrocitos NIH BioArt"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 bg-black/90 px-2 py-0.5 rounded text-[9px] text-cyan-300 font-mono border border-cyan-500/40">
            Unidad Neurovascular (NIH)
          </span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="font-bold text-white text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Anatomía Celular Real: La Unidad Neurovascular (Endotelio + Pericito + Pies Astrocitarios)
          </p>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            Los pies terminales de los astrocitos cubren el <strong className="text-cyan-300">99% de la superficie capilar cerebral</strong>. En la preeclampsia grave, la pérdida de la autorregulación miogénica y el hiperflujo hidrostático rompen las uniones estrechas (claudina-5 y ocludina), provocando edema vasogénico en la sustancia blanca parietal y occipital (Síndrome PRES) y desencadenando la eclampsia convulsiva.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">Astrocitos AQP4</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">Uniones Estrechas</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-400 font-bold">Edema PRES</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * INTERACTIVE COMPONENT 3: Podocitos Glomerulares, Endoteliosis y Fuga de Proteínas
 * Explicación celular de la proteinuria y la falla renal en la preeclampsia
 */
export const GraphicRenalPodocytes: React.FC = () => {
  const [viewState, setViewState] = useState<'normal' | 'preeclampsia'>('preeclampsia');

  return (
    <div className="w-full bg-slate-950 border-2 border-sky-500/40 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-400" />
            <span className="text-xs font-black tracking-wider text-sky-400 uppercase">
              Fisiopatología Renal y Barrera de Filtración Glomerular
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Podocitos, Endoteliosis Glomerular y Pérdida Masiva de Proteínas
          </h3>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewState('normal')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewState === 'normal' 
                ? 'bg-emerald-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Glomérulo Sano
          </button>
          <button
            onClick={() => setViewState('preeclampsia')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              viewState === 'preeclampsia' 
                ? 'bg-rose-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Endoteliosis &amp; Lesión Podocitaria
          </button>
        </div>
      </div>

      {/* Visual Diagram */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 sm:p-5">
        {viewState === 'normal' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Barrera de Filtración Glomerular Normal (VEGF Podocitario Activo)
              </span>
              <span className="text-slate-400 font-mono">Proteinuria &lt; 150 mg/24h</span>
            </div>

            <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950/70 rounded-xl border border-slate-800/80">
              {/* Capillary Lumen */}
              <rect x="20" y="20" width="760" height="50" rx="8" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1" />
              <text x="35" y="45" fill="#7dd3fc" fontSize="11" fontWeight="bold">LUZ DEL CAPILAR GLOMERULAR (Células endoteliales delgadas con fenestras de 70-100 nm)</text>
              <text x="35" y="60" fill="#bae6fd" fontSize="9">La albúmina (69 kDa) fluye libremente en el plasma sin cruzar por repulsión electrostática negativa.</text>

              {/* Glomerular Basement Membrane (GBM) */}
              <rect x="20" y="75" width="760" height="20" fill="#0369a1" stroke="#0284c7" strokeWidth="1" />
              <text x="35" y="89" fill="#ffffff" fontSize="9" fontWeight="bold">MEMBRANA BASAL GLOMERULAR (MBG) - Carga electronegativa de heparán sulfato intacta</text>

              {/* Podocytes Layer */}
              <rect x="20" y="100" width="760" height="60" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
              <text x="35" y="125" fill="#a7f3d0" fontSize="11" fontWeight="bold">PODOCITOS VISCERALES Y PEDICELOS INTERDIGITADOS</text>
              <text x="35" y="142" fill="#d1fae5" fontSize="9">Diafragmas de hendidura (Nefrina + Podocina) cierran los poros a 4 nm. Los podocitos secretan VEGF fisiológico.</text>

              {/* Urinary Space */}
              <rect x="20" y="165" width="760" height="55" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <text x="35" y="190" fill="#94a3b8" fontSize="11" fontWeight="bold">ESPACIO DE BOWMAN (ORINA PRIMITIVA LIMPIA)</text>
              <text x="35" y="205" fill="#64748b" fontSize="9">Solo agua, electrolitos, glucosa y urea. Cero cilindros, cero fuga proteica significativa.</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">🌿 VEGF Paracrino:</span>
                <p className="text-slate-300 text-[11px]">Los podocitos sintetizan VEGF hacia el espacio subendotelial, lo que mantiene vivas las fenestraciones del endotelio capilar.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">⚡ Tamiz Eléctrico:</span>
                <p className="text-slate-300 text-[11px]">Las cargas negativas de la membrana basal glomerular repelen electrostáticamente a la albúmina sérica.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-emerald-400 font-bold block mb-1">💧 Función Renal Óptima:</span>
                <p className="text-slate-300 text-[11px]">Tasa de Filtración Glomerular (TFG) aumentada propia del embarazo normal (Creatinina 0.4 a 0.6 mg/dL).</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> sFlt-1 Neutraliza VEGF: Endoteliosis Capilar y Desprendimiento Podocitario
              </span>
              <span className="text-rose-400 font-mono font-bold">Proteinuria &gt; 300 mg/24h | Podocituria</span>
            </div>

            <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950/70 rounded-xl border border-rose-900/40">
              {/* Swollen Endothelial Cells Occluding Capillary */}
              <rect x="20" y="20" width="760" height="50" rx="8" fill="#450a0a" stroke="#dc2626" strokeWidth="2" />
              <text x="35" y="42" fill="#fca5a5" fontSize="11" fontWeight="bold">ENDOTELIOSIS CAPILAR GLOMERULAR (Tumefacción endotelial masiva por falta de VEGF)</text>
              <text x="35" y="58" fill="#fecdd3" fontSize="9">Pérdida de fenestraciones, vacuolización citoplásmica y oclusión mecánica de la luz. ⬇️ Caída severa de la TFG.</text>

              {/* Damaged GBM */}
              <rect x="20" y="75" width="760" height="20" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" strokeDasharray="5 3" />
              <text x="35" y="89" fill="#fee2e2" fontSize="9" fontWeight="bold">PÉRDIDA DE CARGA NEGATIVA EN LA MBG (Fisuras ultraestructurales)</text>

              {/* Effaced and Detached Podocytes */}
              <rect x="20" y="100" width="760" height="60" rx="8" fill="#881337" stroke="#f43f5e" strokeWidth="2" />
              <text x="35" y="122" fill="#fda4af" fontSize="11" fontWeight="bold">BORRAMIENTO DE PEDICELOS (EFFACEMENT) Y DESPRENDIMIENTO PODOCITARIO</text>
              <text x="35" y="138" fill="#fecdd3" fontSize="9">Ruptura de la nefrina y podocina. Los podocitos se desprenden y mueren en la orina (PODOCITURIA).</text>

              {/* Proteinuria in Urinary Space */}
              <rect x="20" y="165" width="760" height="55" rx="8" fill="#581c87" stroke="#a855f7" strokeWidth="1.5" />
              <text x="35" y="185" fill="#f3e8ff" fontSize="11" fontWeight="bold">ESPACIO DE BOWMAN INUNDADO DE PROTEÍNAS (PROTEINURIA GRAVE)</text>
              <circle cx="280" cy="202" r="8" fill="#c084fc" />
              <text x="280" y="205" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Alb</text>
              <circle cx="340" cy="202" r="8" fill="#c084fc" />
              <text x="340" y="205" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Alb</text>
              <circle cx="400" cy="202" r="8" fill="#c084fc" />
              <text x="400" y="205" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">Alb</text>
              <text x="440" y="205" fill="#e9d5ff" fontSize="9.5">Fuga masiva de albúmina ➡️ Hipoalbuminemia ➡️ Caída catastrófica de la Presión Oncótica</text>
            </svg>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">🩸 Endoteliosis Glomerular:</span>
                <p className="text-rose-200 text-[11px]">Es el hallazgo histopatológico patognomónico. Las células endoteliales crecen tanto que bloquean el flujo de sangre, elevando la creatinina.</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">🔬 Podocituria Específica:</span>
                <p className="text-rose-200 text-[11px]">Los podocitos desprendidos en sedimento urinario son marcadores tempranos que predicen el daño glomerular antes que la proteinuria clínica.</p>
              </div>
              <div className="bg-rose-950/30 border border-rose-800/40 p-3 rounded-xl">
                <span className="text-rose-400 font-bold block mb-1">📉 Hipoalbuminemia Crítica:</span>
                <p className="text-rose-200 text-[11px]">La pérdida proteica destruye la presión oncótica (&lt; 16 mmHg), lo que predispone al temido Edema Pulmonar con solo un exceso de líquidos.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real Glomerulus Micrograph Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden border-2 border-sky-500/50 bg-slate-950 flex-shrink-0 relative group shadow-lg">
          <img 
            src="/images/kidney_glomerulus_podocytes.png" 
            alt="Glomérulo Renal, Podocitos y Capilares Fenestrados Anatomía"
            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute bottom-1 right-1 bg-black/90 px-2 py-0.5 rounded text-[9px] text-sky-300 font-mono border border-sky-500/40">
            Podocitos &amp; Glomérulo
          </span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-300">
          <p className="font-bold text-white text-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            Anatomía Celular Real: El Ovillo Capilar Glomerular, Pedicelos y Podocituria
          </p>
          <p className="text-slate-300 leading-relaxed text-[11.5px]">
            Los <strong>podocitos</strong> abrazan los capilares glomerulares y mantienen vivas las fenestraciones endoteliales mediante la secreción basal continua de <strong>VEGF</strong>. Cuando el <strong>sFlt-1</strong> placentario secuestra el VEGF, las células endoteliales sufren tumefacción obstructiva (<strong>Endoteliosis Glomerular</strong>) y los pedicelos podocitarios se borran y desprenden hacia el túbulo (<strong>Podocituria</strong>), desatando la proteinuria masiva (&gt; 300 mg/24h) y el colapso de la presión oncótica.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-400 font-bold">Pedicelos Podocitarios</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400 font-bold">Endoteliosis Capilar</span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-rose-400 font-bold">Proteinuria / Hipoalbuminemia</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * INTERACTIVE COMPONENT 4: Fuerzas de Starling, Fuga Capilar y Edema Pulmonar
 * Explicación fisiopatológica de por qué la hidratación debe ser estrictamente restrictiva (60-80 mL/h)
 */
export const GraphicFluidRestrictionStarling: React.FC = () => {
  const [fluidRate, setFluidRate] = useState<number>(70);

  const isOverload = fluidRate > 85;
  const isDangerous = fluidRate >= 120;

  return (
    <div className="w-full bg-slate-950 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-black tracking-wider text-emerald-400 uppercase">
              Fisiopatología Microvascular &amp; Fuerzas de Starling
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white mt-1">
            Manejo Hídrico Restrictivo: ¿Por qué 60 a 80 mL/h Salva Vidas?
          </h3>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
          <span className="text-slate-400 font-bold">Tasa actual:</span>
          <span className={`font-mono font-black ${isDangerous ? 'text-rose-400' : isOverload ? 'text-amber-400' : 'text-emerald-400'}`}>
            {fluidRate} mL/h total
          </span>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-300">Simulador de Tasa de Infusión Parenteral:</span>
          <span className={`font-bold ${isDangerous ? 'text-rose-400' : isOverload ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isDangerous ? '🚨 SOBRECARGA CRÍTICA (EDEMA AGUDO)' : isOverload ? '⚠️ RIESGO DE EXTRAVASACIÓN ALVEOLAR' : '✅ PROTOCOLO SEGURO ANESTESIAPRO (60-80 mL/h)'}
          </span>
        </div>
        <input 
          type="range" 
          min="40" 
          max="200" 
          step="10"
          value={fluidRate} 
          onChange={(e) => setFluidRate(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>40 mL/h</span>
          <span className="text-emerald-400 font-bold">60-80 mL/h (1 mL/kg/h Meta)</span>
          <span>120 mL/h (Riesgo)</span>
          <span className="text-rose-400">200 mL/h (Mortal)</span>
        </div>
      </div>

      {/* Starling Formula Breakdown Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Presión Hidrostática Capilar (Pc) ⬆️
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            La hipertensión severa incrementa la presión con la que el líquido sale forzado de los capilares pulmonares hacia los alvéolos.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Presión Oncótica Plasmática (πp) ⬇️
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            La proteinuria masiva y la disfunción hepática colapsan la albúmina. La presión que retiene el agua en el vaso cae de <strong className="text-white">28 a &lt;16 mmHg</strong>.
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
          <span className="text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Coeficiente de Permeabilidad (Kf) ⬆️
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            La endoteliosis y la pérdida del glicocálix dejan "poros abiertos" en el endotelio capilar pulmonar, multiplicando la fuga a los alvéolos.
          </p>
        </div>
      </div>

      {/* Danger Banner if overloaded */}
      {isOverload && (
        <div className="p-3.5 bg-rose-950/70 border border-rose-700/80 rounded-xl text-rose-200 text-xs flex items-start gap-3 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-white">¡Peligro Inminente de Edema Pulmonar Agudo Maternal!</p>
            <p className="text-[11.5px] leading-relaxed">
              Al infundir más de 80 mL/h, la ecuación de Starling se desequilibra por completo. Los alvéolos se inundan de líquido de trasudado seroso. <strong className="text-white">El Edema Pulmonar es la causa número 1 de muerte materna prevenible en preeclampsia</strong>. ¡Reduzca la hidratación a 60-80 mL/h de inmediato!
            </p>
          </div>
        </div>
      )}

      {/* Clinical Pearls Banner */}
      <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200 flex items-start gap-2.5">
        <span className="text-base leading-none text-emerald-400 font-bold">💎</span>
        <p className="leading-relaxed">
          <strong className="text-white">Perla de Oro para el Anestesiólogo:</strong> Está <span className="text-rose-400 font-bold">TERMINANTEMENTE PROHIBIDO</span> precargar a la paciente con 500 o 1000 mL de solución cristaloide antes de colocar una raquídea. La paciente con preeclampsia tiene volumen plasmático efectivo contraído pero agua corporal total aumentada y endotelio roto. Maneje la hipotensión con <strong className="text-emerald-300">vasopresores en bolos (Fenilefrina 50-100 mcg o Norepinefrina 4-8 mcg)</strong>, NUNCA con sobrecarga de volumen.
        </p>
      </div>
    </div>
  );
};

/**
 * Visual SVG Diagram 2: Mecanismo Celular y Neuroprotector del Sulfato de Magnesio (MgSO₄)
 * Bloqueo del receptor NMDA, vasodilatación arteriolar cerebral y modulación de BHE
 */
export const GraphicMagnesiumMechanism: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 overflow-hidden shadow-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs font-bold text-slate-300">
        <span className="flex items-center gap-2 text-cyan-400">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
          FARMACODINAMIA CELULAR: ¿POR QUÉ EL MgSO₄ PREVIENE Y DETIENE LA ECLAMPSIA?
        </span>
        <span className="text-[10px] text-cyan-300 font-mono">NEUROPROTECCIÓN &amp; BLOQUEO NMDA</span>
      </div>

      <svg viewBox="0 0 900 440" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradNeuron" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0c4a6e" />
            <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          <linearGradient id="gradChannel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="gradCalcium" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <linearGradient id="gradMagnesium" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        {/* ESPACIO EXTRACELULAR */}
        <rect x="20" y="20" width="860" height="90" rx="12" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <text x="35" y="45" fill="#94a3b8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">ESPACIO EXTRACELULAR CEREBRAL</text>
        <text x="35" y="65" fill="#f87171" fontSize="11" fontFamily="sans-serif">Iones de Calcio libres (Ca²⁺) y Glutamato elevado por isquemia/vasoespasmo</text>

        {/* Iones Calcio intentando entrar */}
        <circle cx="280" cy="50" r="16" fill="url(#gradCalcium)" />
        <text x="280" y="55" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Ca²⁺</text>

        <circle cx="340" cy="45" r="14" fill="url(#gradCalcium)" opacity="0.8" />
        <text x="340" y="50" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Ca²⁺</text>

        {/* Iones Magnesio administrados */}
        <circle cx="480" cy="50" r="18" fill="url(#gradMagnesium)" stroke="#22d3ee" strokeWidth="2" />
        <text x="480" y="55" fill="#ffffff" fontSize="12" fontWeight="black" textAnchor="middle">Mg²⁺</text>

        <circle cx="540" cy="42" r="15" fill="url(#gradMagnesium)" stroke="#22d3ee" strokeWidth="1.5" />
        <text x="540" y="47" fill="#ffffff" fontSize="10" fontWeight="black" textAnchor="middle">Mg²⁺</text>

        {/* MEMBRANA PLASMÁTICA NEURONAL (BICAPA LIPÍDICA) */}
        <rect x="20" y="115" width="860" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
        <text x="35" y="140" fill="#cbd5e1" fontSize="11" fontWeight="bold" fontFamily="sans-serif">BICAPA LIPÍDICA DE MEMBRANA POSTSINÁPTICA NEURONAL</text>

        {/* CANAL IÓNICO RECEPTOR NMDA */}
        <rect x="420" y="105" width="120" height="60" rx="8" fill="url(#gradChannel)" stroke="#38bdf8" strokeWidth="2" />
        <text x="480" y="138" fill="#ffffff" fontSize="11" fontWeight="black" textAnchor="middle">RECEPTOR NMDA</text>

        {/* MAGNESIO BLOQUEANDO EL CANAL CENTRALMENTE */}
        <circle cx="480" cy="135" r="19" fill="#06b6d4" stroke="#ffffff" strokeWidth="2.5" />
        <text x="480" y="140" fill="#082f49" fontSize="12" fontWeight="black" textAnchor="middle">Mg²⁺</text>

        {/* FLECHA DE BLOQUEO DE CALCIO */}
        <path d="M 300 70 L 440 115" stroke="#ef4444" strokeWidth="3" strokeDasharray="5 3" />
        <rect x="345" y="85" width="85" height="20" rx="4" fill="#991b1b" />
        <text x="387" y="99" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">¡INHIBIDO!</text>

        {/* CITOPLASMA NEURONAL (ESPACIO INTRACELULAR) */}
        <rect x="20" y="160" width="860" height="260" rx="12" fill="url(#gradNeuron)" stroke="#0284c7" strokeWidth="1" />
        <text x="35" y="185" fill="#38bdf8" fontSize="12" fontWeight="bold" fontFamily="sans-serif">CITOPLASMA INTRACELULAR NEURONAL (CEREBRO PROTEGIDO)</text>

        {/* 3 MECANISMOS CELULARES CARDINALES */}
        {/* MECANISMO 1: BLOQUEO NMDA */}
        <g transform="translate(40, 205)">
          <rect x="0" y="0" width="250" height="195" rx="12" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
          <rect x="15" y="12" width="220" height="24" rx="6" fill="#0369a1" />
          <text x="25" y="28" fill="#ffffff" fontSize="11" fontWeight="bold">1. BLOQUEO NMDA CELULAR</text>
          
          <text x="15" y="55" fill="#bae6fd" fontSize="11" fontWeight="bold">• Antagonista no competitivo</text>
          <text x="15" y="70" fill="#e0f2fe" fontSize="10">  Se une al poro del receptor NMDA</text>
          <text x="15" y="84" fill="#e0f2fe" fontSize="10">  dependiente de voltaje.</text>

          <text x="15" y="106" fill="#bae6fd" fontSize="11" fontWeight="bold">• Frena el influjo tóxico de Ca²⁺</text>
          <text x="15" y="120" fill="#e0f2fe" fontSize="10">  Previene despolarizaciones masivas,</text>
          <text x="15" y="134" fill="#e0f2fe" fontSize="10">  focos epileptogénicos y muerte</text>
          <text x="15" y="148" fill="#e0f2fe" fontSize="10">  neuronal por excitotoxicidad.</text>

          <rect x="15" y="162" width="220" height="22" rx="4" fill="#0c4a6e" />
          <text x="25" y="177" fill="#38bdf8" fontSize="10" fontWeight="bold">🛡️ EFECTO: ANTICONVULSIVANTE</text>
        </g>

        {/* MECANISMO 2: VASODILATACIÓN CEREBRAL */}
        <g transform="translate(325, 205)">
          <rect x="0" y="0" width="250" height="195" rx="12" fill="#082f49" stroke="#0ea5e9" strokeWidth="1.5" />
          <rect x="15" y="12" width="220" height="24" rx="6" fill="#0284c7" />
          <text x="25" y="28" fill="#ffffff" fontSize="11" fontWeight="bold">2. VASODILATACIÓN CEREBRAL</text>
          
          <text x="15" y="55" fill="#bae6fd" fontSize="11" fontWeight="bold">• Inhibe vasoespasmo cerebral</text>
          <text x="15" y="70" fill="#e0f2fe" fontSize="10">  Bloquea canales de calcio en el</text>
          <text x="15" y="84" fill="#e0f2fe" fontSize="10">  músculo liso vascular cerebral.</text>

          <text x="15" y="106" fill="#bae6fd" fontSize="11" fontWeight="bold">• Estimula Óxido Nítrico (NO)</text>
          <text x="15" y="120" fill="#e0f2fe" fontSize="10">  Aumenta la síntesis de prostaciclina</text>
          <text x="15" y="134" fill="#e0f2fe" fontSize="10">  endotelial (PGI2) vasodilatadora</text>
          <text x="15" y="148" fill="#e0f2fe" fontSize="10">  sin generar robo coronario.</text>

          <rect x="15" y="162" width="220" height="22" rx="4" fill="#0c4a6e" />
          <text x="25" y="177" fill="#38bdf8" fontSize="10" fontWeight="bold">🩸 EFECTO: REVERSIÓN ISQUEMIA</text>
        </g>

        {/* MECANISMO 3: INTEGRIDAD DE LA BARRERA HEMATOENCEFÁLICA */}
        <g transform="translate(610, 205)">
          <rect x="0" y="0" width="250" height="195" rx="12" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
          <rect x="15" y="12" width="220" height="24" rx="6" fill="#0369a1" />
          <text x="25" y="28" fill="#ffffff" fontSize="11" fontWeight="bold">3. INTEGRIDAD DE LA BHE</text>
          
          <text x="15" y="55" fill="#bae6fd" fontSize="11" fontWeight="bold">• Reduce edema vasogénico</text>
          <text x="15" y="70" fill="#e0f2fe" fontSize="10">  Estabiliza uniones estrechas de las</text>
          <text x="15" y="84" fill="#e0f2fe" fontSize="10">  células endoteliales de la BHE.</text>

          <text x="15" y="106" fill="#bae6fd" fontSize="11" fontWeight="bold">• Frena el Síndrome PRES</text>
          <text x="15" y="120" fill="#e0f2fe" fontSize="10">  Evita la extravasación de líquido</text>
          <text x="15" y="134" fill="#e0f2fe" fontSize="10">  hacia la sustancia blanca posterior</text>
          <text x="15" y="148" fill="#e0f2fe" fontSize="10">  (occipital y parietal).</text>

          <rect x="15" y="162" width="220" height="22" rx="4" fill="#0c4a6e" />
          <text x="25" y="177" fill="#38bdf8" fontSize="10" fontWeight="bold">🧠 EFECTO: PREVENCIÓN PRES / COMA</text>
        </g>
      </svg>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/60 text-xs text-cyan-200">
          <p className="font-bold text-cyan-300">🎯 Rango Terapéutico Estricto:</p>
          <p className="text-white font-mono mt-0.5">4.8 a 8.4 mg/dL (2.0 - 3.5 mmol/L o 4 - 7 mEq/L)</p>
          <p className="text-[11px] text-cyan-300/80 mt-1">Por debajo de 4.8 mg/dL no hay neuroprotección eficaz. Por encima de 9.0 mg/dL inicia la pérdida patelar.</p>
        </div>
        <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/60 text-xs text-rose-200">
          <p className="font-bold text-rose-300">⚡ Antídoto Inmediato en Toxicidad:</p>
          <p className="text-white font-mono mt-0.5">Gluconato de Calcio al 10%: 1 g (10 mL) IV lento en 3–5 min</p>
          <p className="text-[11px] text-rose-300/80 mt-1">El Calcio compite directamente con el Magnesio desplazándolo de los canales y uniones neuromusculares.</p>
        </div>
      </div>
    </div>
  );
};

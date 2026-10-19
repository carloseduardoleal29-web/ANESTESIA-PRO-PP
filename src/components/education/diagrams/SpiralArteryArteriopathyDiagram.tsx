import React from 'react';
import { ShieldAlert, ArrowRight, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  isNightMode?: boolean;
}

export const SpiralArteryArteriopathyDiagram: React.FC<Props> = ({ isNightMode = false }) => {
  return (
    <div className={`w-full rounded-2xl border-2 overflow-hidden shadow-xl transition-all ${
      isNightMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* HEADER */}
      <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
        isNightMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              De la Invasión Defectuosa a la Arteriopatía Espiral
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Consecuencia hemodinámica: Por qué los vasos se vuelven rígidos, espásticos y de alta resistencia
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 self-start sm:self-auto">
          Ley de Poiseuille (R ∝ 1/r⁴)
        </span>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* COMPARATIVA DE ARTERIA REMODELADA VS ARTERIOPATÍA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* REMODELADA NORMAL */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            isNightMode ? 'bg-emerald-950/20 border-emerald-900/60' : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="space-y-2">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Arteria Espiral Remodelada (Sana)
              </span>
              <div className="rounded-lg bg-black/40 border border-emerald-500/30 p-2 text-center">
                <svg viewBox="0 0 300 120" className="w-full h-auto">
                  {/* Vaso dilatado */}
                  <rect x="20" y="20" width="260" height="80" rx="40" fill="#9F1239" opacity="0.4" />
                  <rect x="25" y="30" width="250" height="60" rx="30" fill="#BE123C" opacity="0.7" />
                  <rect x="35" y="40" width="230" height="40" rx="20" fill="#0284C7" opacity="0.3" />
                  {/* Flechas de flujo laminar */}
                  <line x1="45" y1="60" x2="255" y2="60" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
                  <polygon points="255,60 240,54 242,66" fill="#38BDF8" />
                  <line x1="60" y1="50" x2="220" y2="50" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 4" />
                  <line x1="60" y1="70" x2="220" y2="70" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="6 4" />
                  <text x="150" y="98" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle">Flujo Laminar de Gran Volumen</text>
                </svg>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                <strong>Pared adelgazada:</strong> La muscular elástica fue destruida y sustituida por fibrina amorfa inerte. El vaso pierde todo tono vasoconstrictor y actúa como un gran estanque de baja presión.
              </p>
            </div>
            <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              ✓ Resistencia vascular nula • Perfusión placentaria continua
            </div>
          </div>

          {/* ARTERIA NO REMODELADA (PREECLAMPSIA) */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            isNightMode ? 'bg-rose-950/20 border-rose-900/60' : 'bg-rose-50/60 border-rose-200'
          }`}>
            <div className="space-y-2">
              <span className="text-xs font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Arteria Espiral No Remodelada
              </span>
              <div className="rounded-lg bg-black/40 border border-rose-500/30 p-2 text-center">
                <svg viewBox="0 0 300 120" className="w-full h-auto">
                  {/* Vaso estrecho y espástico con pared gruesa */}
                  <rect x="20" y="32" width="260" height="56" rx="12" fill="#881337" stroke="#E11D48" strokeWidth="2" />
                  <rect x="20" y="44" width="260" height="32" fill="#4C0519" />
                  {/* Luz estrechísima */}
                  <rect x="20" y="55" width="260" height="10" rx="3" fill="#EF4444" opacity="0.6" />
                  {/* Flechas de flujo turbulento a presión */}
                  <path d="M 40 60 Q 90 52 140 65 T 240 58" fill="none" stroke="#F97316" strokeWidth="3" />
                  <polygon points="255,58 243,53 244,63" fill="#F97316" />
                  <circle cx="100" cy="55" r="3" fill="#EF4444" />
                  <circle cx="180" cy="65" r="3" fill="#EF4444" />
                  <text x="150" y="100" fill="#FB7185" fontSize="10" fontWeight="bold" textAnchor="middle">Flujo en Chorro Turbulento a Alta Presión</text>
                </svg>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                <strong>Pared muscular engrosada:</strong> Conserva su inervación simpática vasomotora. Ante estímulos catecolaminérgicos, genera vasoespasmo severo, reduciendo el radio a la cuarta potencia.
              </p>
            </div>
            <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
              ✗ Alta resistencia • Notch protodiastólico en Doppler
            </div>
          </div>
        </div>

        {/* DETALLE INSET: CORTE TRANSVERSAL Y ARTERIOPATÍA EN PREECLAMPSIA (COMO EN LA IMAGEN 2) */}
        <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-4 ${
          isNightMode ? 'bg-slate-900/90 border-amber-500/40' : 'bg-amber-50/50 border-amber-300'
        }`}>
          <div className="flex items-center justify-between flex-wrap gap-2 border-b pb-3 border-amber-200 dark:border-slate-800">
            <span className="text-xs sm:text-sm font-black text-amber-700 dark:text-amber-300 flex items-center gap-2 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Detalle de la Arteriopatía en Preeclampsia (Corte Transversal)
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Aterosis Aguda de Zeek &amp; Assali
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* GRÁFICO SVG CORTE TRANSVERSAL */}
            <div className="lg:col-span-5 flex justify-center">
              <svg viewBox="0 0 240 240" className="w-48 h-48 drop-shadow-md">
                {/* Tejido perivascular decidual */}
                <circle cx="120" cy="120" r="115" fill="#881337" opacity="0.2" stroke="#BE123C" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Capa Muscular Engrosada e Hipertrófica */}
                <circle cx="120" cy="120" r="95" fill="#9F1239" stroke="#E11D48" strokeWidth="5" />
                
                {/* Depósitos lipidicos y células espumosas (Aterosis aguda) */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
                  const rad = (ang * Math.PI) / 180;
                  const x = 120 + 72 * Math.cos(rad);
                  const y = 120 + 72 * Math.sin(rad);
                  return <circle key={i} cx={x} cy={y} r="6" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />;
                })}

                {/* Capa Íntima / Endotelio Dañado y Descamado */}
                <circle cx="120" cy="120" r="55" fill="#4C0519" stroke="#EF4444" strokeWidth="4" strokeDasharray="8 4" />
                
                {/* Luz Estrecha / Ocluida por Trombos de Fibrina */}
                <circle cx="120" cy="120" r="28" fill="#1E293B" stroke="#F43F5E" strokeWidth="3" />
                
                {/* Flechas de flujo turbulento central */}
                <path d="M 110 115 Q 120 110 130 120" stroke="#F97316" strokeWidth="2.5" fill="none" />
                <circle cx="120" cy="120" r="5" fill="#EF4444" />
              </svg>
            </div>

            {/* LISTA DE 5 CARACTERÍSTICAS HISTOPATOLÓGICAS */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              
              <div className={`p-2.5 rounded-xl border ${
                isNightMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-amber-200'
              }`}>
                <div className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">1</span>
                  Vasoespasmo Persistente
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Respuesta contráctil hiperactiva a tromboxano, angiotensina II y catecolaminas circulantes.
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isNightMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-amber-200'
              }`}>
                <div className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">2</span>
                  Endotelio Dañado
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Descamación de células endoteliales y pérdida de la barrera antitrombótica natural.
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isNightMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-amber-200'
              }`}>
                <div className="font-black text-purple-600 dark:text-purple-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[10px] flex items-center justify-center font-black">3</span>
                  Pared Muscular Engrosada
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Hipertrofia de la túnica media y depósito de necrosis fibrinoide (aterosis aguda).
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                isNightMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-amber-200'
              }`}>
                <div className="font-black text-sky-600 dark:text-sky-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-black">4</span>
                  Luz Vascular Estrecha
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Reducción drástica del área de flujo con microtrombos intraluminales de plaquetas y fibrina.
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border sm:col-span-2 ${
                isNightMode ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-amber-200'
              }`}>
                <div className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-0.5">
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">5</span>
                  Flujo Turbulento &amp; Estrés de Cizallamiento
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  El chorro a alta velocidad desgarra las vellosidades coriónicas fetales y desencadena la liberación de <strong>sFlt-1</strong> y <strong>Endoglina soluble (sEng)</strong>.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Layers, AlertOctagon, CheckCircle, Info, Sparkles } from 'lucide-react';

interface Props {
  isNightMode?: boolean;
}

export const TrophoblasticInvasionDiagram: React.FC<Props> = ({ isNightMode = false }) => {
  const [activeTab, setActiveTab] = useState<'both' | 'normal' | 'preeclampsia'>('both');

  return (
    <div className={`w-full rounded-2xl border-2 overflow-hidden shadow-xl transition-all ${
      isNightMode ? 'bg-slate-950 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* HEADER */}
      <div className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isNightMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Mala Conexión Trofoblástica en la Placenta
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Mecanismo inicial de la preeclampsia: Falla en remodelación de arterias espirales (semanas 8 a 18 de gestación)
          </p>
        </div>

        {/* SELECTOR DE VISTA */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200 dark:bg-slate-800 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('both')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'both' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Ambas
          </button>
          <button
            onClick={() => setActiveTab('normal')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'normal' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Normal
          </button>
          <button
            onClick={() => setActiveTab('preeclampsia')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'preeclampsia' ? 'bg-rose-600 text-white shadow' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Preeclampsia
          </button>
        </div>
      </div>

      {/* COMPARATIVA GRÁFICA VECTORIAL */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PANEL 1: INVASIÓN TROFOBLÁSTICA NORMAL */}
        {(activeTab === 'both' || activeTab === 'normal') && (
          <div className={`rounded-xl p-4 border-2 flex flex-col justify-between space-y-4 shadow-sm transition-all ${
            isNightMode ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-emerald-50/70 border-emerald-300'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900">
                <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Invasión Trofoblástica Normal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                  Baja Resistencia
                </span>
              </div>

              {/* DIAGRAMA ANATÓMICO SVG */}
              <div className="my-3 rounded-lg overflow-hidden border border-emerald-300 dark:border-emerald-900/60 bg-gradient-to-b from-slate-900 to-slate-950 p-2 shadow-inner">
                <svg viewBox="0 0 450 260" className="w-full h-auto">
                  <defs>
                    <linearGradient id="normalVesselGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#BE185D" />
                      <stop offset="60%" stopColor="#FB7185" />
                      <stop offset="100%" stopColor="#F43F5E" />
                    </linearGradient>
                    <linearGradient id="normalFlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>

                  {/* Capas tisulares de fondo */}
                  {/* Miometrio profundo */}
                  <rect x="10" y="20" width="80" height="220" rx="8" fill="#881337" opacity="0.3" stroke="#9F1239" strokeWidth="1.5" />
                  <text x="50" y="130" fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 130)">Tejido Miometrial</text>
                  
                  {/* Decidua basal */}
                  <rect x="95" y="20" width="100" height="220" rx="8" fill="#BE123C" opacity="0.15" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="145" y="130" fill="#FECDD3" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 145 130)">Tejido Decidual</text>

                  {/* Espacio Intervelloso */}
                  <rect x="200" y="20" width="240" height="220" rx="8" fill="#0C4A6E" opacity="0.25" stroke="#0284C7" strokeWidth="1.5" />
                  <text x="320" y="38" fill="#7DD3FC" fontSize="10" fontWeight="bold" textAnchor="middle">Espacio Intervelloso Fetal</text>

                  {/* Arteria Espiral Remodelada (Gran calibre, dilatada, sinusoidal) */}
                  <path 
                    d="M 30 130 C 50 130, 70 80, 110 80 C 150 80, 150 170, 190 170 C 220 170, 240 145, 270 145" 
                    fill="none" 
                    stroke="url(#normalVesselGrad)" 
                    strokeWidth="32" 
                    strokeLinecap="round" 
                  />
                  {/* Luz arterial dilatada */}
                  <path 
                    d="M 30 130 C 50 130, 70 80, 110 80 C 150 80, 150 170, 190 170 C 220 170, 240 145, 270 145" 
                    fill="none" 
                    stroke="#4C0519" 
                    strokeWidth="20" 
                    strokeLinecap="round" 
                  />

                  {/* Citotrofoblastos extravellosos invadiendo profundamente hasta el miometrio */}
                  {[
                    [70, 95], [85, 110], [90, 70], [105, 120], [120, 60], 
                    [130, 150], [145, 90], [160, 140], [175, 175], [190, 125]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="5.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
                  ))}

                  {/* Flechas de flujo laminar suave */}
                  <path d="M 50 130 Q 150 120 280 145" fill="none" stroke="#38BDF8" strokeWidth="4" strokeDasharray="8 4" markerEnd="url(#blueArrow)" />
                  <polygon points="280,145 268,138 270,152" fill="#38BDF8" />
                  <polygon points="310,130 298,123 300,137" fill="#38BDF8" />
                  <polygon points="310,165 298,158 300,172" fill="#38BDF8" />

                  {/* Vellosidades Coriónicas Fetales (Saludables, arborizadas) */}
                  <g transform="translate(310, 60)" stroke="#10B981" strokeWidth="2.5" fill="#A7F3D0">
                    <path d="M 30 0 Q 20 40 40 70 Q 10 90 20 120" fill="none" />
                    <circle cx="40" cy="70" r="10" />
                    <circle cx="20" cy="120" r="12" />
                    <circle cx="65" cy="50" r="9" />
                    <path d="M 40 70 Q 70 60 65 50" fill="none" />
                  </g>

                  {/* Etiquetas explicativas flotantes */}
                  <rect x="30" y="195" width="130" height="20" rx="4" fill="#0F172A" opacity="0.85" stroke="#38BDF8" strokeWidth="1" />
                  <text x="95" y="208" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">Invasión Profunda al Miometrio</text>

                  <rect x="235" y="195" width="190" height="20" rx="4" fill="#0F172A" opacity="0.85" stroke="#10B981" strokeWidth="1" />
                  <text x="330" y="208" fill="#34D399" fontSize="8" fontWeight="bold" textAnchor="middle">Flujo Laminar de Baja Resistencia</text>
                </svg>
              </div>

              {/* PUNTOS CLAVE */}
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Invasión Completa:</strong> Citotrofoblastos alcanzan el miometrio y reemplazan la capa muscular elástica de las arterias espirales.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Arterias 10x más anchas:</strong> Se convierten en conductos flácidos de gran calibre sin respuesta vasomotora.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span><strong>Perfusión Óptima:</strong> La sangre materna baña suavemente las vellosidades fetales con abundante oxígeno y PlGF.</span>
                </li>
              </ul>
            </div>

            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold text-center">
              Resultado: Perfusión placentaria óptima sin hipertensión materna.
            </div>
          </div>
        )}

        {/* PANEL 2: MALA CONEXIÓN TROFOBLÁSTICA EN PREECLAMPSIA */}
        {(activeTab === 'both' || activeTab === 'preeclampsia') && (
          <div className={`rounded-xl p-4 border-2 flex flex-col justify-between space-y-4 shadow-sm transition-all ${
            isNightMode ? 'bg-rose-950/20 border-rose-500/40' : 'bg-rose-50/70 border-rose-300'
          }`}>
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-900">
                <span className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-500" />
                  Mala Conexión Trofoblástica en Preeclampsia
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                  Alta Resistencia
                </span>
              </div>

              {/* DIAGRAMA ANATÓMICO SVG */}
              <div className="my-3 rounded-lg overflow-hidden border border-rose-300 dark:border-rose-900/60 bg-gradient-to-b from-slate-900 to-slate-950 p-2 shadow-inner">
                <svg viewBox="0 0 450 260" className="w-full h-auto">
                  {/* Capas tisulares de fondo */}
                  {/* Miometrio intacto (sin invasión) */}
                  <rect x="10" y="20" width="80" height="220" rx="8" fill="#881337" opacity="0.3" stroke="#9F1239" strokeWidth="1.5" />
                  <text x="50" y="130" fill="#FDA4AF" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 130)">Tejido Miometrial</text>
                  
                  {/* Decidua basal superficial */}
                  <rect x="95" y="20" width="100" height="220" rx="8" fill="#BE123C" opacity="0.15" stroke="#E11D48" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="145" y="130" fill="#FECDD3" fontSize="10" fontWeight="bold" textAnchor="middle" transform="rotate(-90 145 130)">Tejido Decidual</text>

                  {/* Espacio Intervelloso */}
                  <rect x="200" y="20" width="240" height="220" rx="8" fill="#4C0519" opacity="0.25" stroke="#E11D48" strokeWidth="1.5" />
                  <text x="320" y="38" fill="#FCA5A5" fontSize="10" fontWeight="bold" textAnchor="middle">Espacio Intervelloso con Isquemia</text>

                  {/* Arteria Espiral No Remodelada (Estrecha, rígida, espástica) */}
                  <path 
                    d="M 30 130 Q 90 120 140 125 T 200 135 T 250 130" 
                    fill="none" 
                    stroke="#BE185D" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                  />
                  {/* Luz estrecha y colapsada */}
                  <path 
                    d="M 30 130 Q 90 120 140 125 T 200 135 T 250 130" 
                    fill="none" 
                    stroke="#4C0519" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Citotrofoblastos detenidos en la superficie (Mala invasión) */}
                  {[
                    [160, 110], [175, 120], [185, 95], [195, 140]
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
                  ))}

                  {/* Vasoespasmo y flujo en chorro turbulento */}
                  <path d="M 250 130 L 295 105" stroke="#EF4444" strokeWidth="3" strokeDasharray="3 2" />
                  <path d="M 250 130 L 305 130" stroke="#F97316" strokeWidth="3.5" />
                  <path d="M 250 130 L 295 155" stroke="#EF4444" strokeWidth="3" strokeDasharray="3 2" />
                  <polygon points="308,130 296,124 298,136" fill="#F97316" />
                  <polygon points="295,105 283,103 289,114" fill="#EF4444" />
                  <polygon points="295,155 289,146 283,157" fill="#EF4444" />

                  {/* Vellosidades Coriónicas Fetales Dañadas / Isquémicas */}
                  <g transform="translate(320, 65)" stroke="#DC2626" strokeWidth="2" fill="#FCA5A5">
                    <path d="M 25 0 Q 15 35 30 65 Q 5 80 15 110" fill="none" strokeDasharray="3 2" />
                    <circle cx="30" cy="65" r="7" fill="#B91C1C" />
                    <circle cx="15" cy="110" r="8" fill="#B91C1C" />
                    <circle cx="50" cy="45" r="6" fill="#B91C1C" />
                  </g>

                  {/* Etiquetas explicativas flotantes */}
                  <rect x="25" y="195" width="165" height="20" rx="4" fill="#0F172A" opacity="0.85" stroke="#EF4444" strokeWidth="1" />
                  <text x="107" y="208" fill="#F87171" fontSize="8" fontWeight="bold" textAnchor="middle">Invasión Solo Decidual Superficial</text>

                  <rect x="225" y="195" width="205" height="20" rx="4" fill="#0F172A" opacity="0.85" stroke="#F97316" strokeWidth="1" />
                  <text x="327" y="208" fill="#FB923C" fontSize="8" fontWeight="bold" textAnchor="middle">Flujo Turbulento en Jet &amp; Vasoespasmo</text>
                </svg>
              </div>

              {/* PUNTOS CLAVE */}
              <ul className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">✗</span>
                  <span><strong>Falla Invasiva (Sem 8-18):</strong> El trofoblasto no coloniza el miometrio y conserva la capa muscular elástica arterial.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">✗</span>
                  <span><strong>Arterias Estrechas &amp; Rígidas:</strong> Sensibles al tono simpático adrenérgico, generando vasoespasmo sostenido.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold shrink-0">✗</span>
                  <span><strong>Hipoxia y Liberación de sFlt-1:</strong> La isquemia destruye el sincitio, liberando factores que agreden todo el endotelio materno.</span>
                </li>
              </ul>
            </div>

            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-800 dark:text-rose-300 font-semibold text-center">
              Resultado: Isquemia placentaria, RCIU y liberación masiva de sFlt-1 a la circulación materna.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

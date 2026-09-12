import React from 'react';

// ==========================================
// 1. MALLAMPATI DIAGRAM (CLASSES I - IV)
// ==========================================
export const MallampatiDiagram: React.FC<{ selectedClass?: number; onSelectClass?: (c: number) => void }> = ({
  selectedClass,
  onSelectClass
}) => {
  const classes = [
    {
      num: 1,
      title: 'Clase I',
      subtitle: 'Visión Total',
      desc: 'Paladar blando, úvula, fauces y pilares tonsilares totalmente visibles.',
      color: 'emerald',
      bgClass: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300',
      tag: 'Vía Aérea Fácil'
    },
    {
      num: 2,
      title: 'Clase II',
      subtitle: 'Visión Parcial',
      desc: 'Paladar blando, fauces y úvula parcialmente visibles.',
      color: 'cyan',
      bgClass: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300',
      tag: 'Dificultad Leve'
    },
    {
      num: 3,
      title: 'Clase III',
      subtitle: 'Visión Limitada',
      desc: 'Paladar blando y base de la úvula visibles únicamente.',
      color: 'amber',
      bgClass: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
      tag: 'VAD Probable'
    },
    {
      num: 4,
      title: 'Clase IV',
      subtitle: 'Visión Nula',
      desc: 'Paladar duro visible únicamente. Úvula y paladar blando no visibles.',
      color: 'rose',
      bgClass: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
      tag: 'VAD Severa'
    }
  ];

  return (
    <div className="space-y-4 my-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          🎨 Diagrama Ilustrado de Clasificación de Mallampati
        </span>
        <span className="text-[10px] text-slate-400">Toca un recuadro para seleccionar</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {classes.map((item) => {
          const isSelected = selectedClass === item.num;
          return (
            <div
              key={item.num}
              onClick={() => onSelectClass && onSelectClass(item.num)}
              className={`cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.bgClass}`}>
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{item.tag}</span>
                </div>

                {/* SVG Illustration of Oral Cavity */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex justify-center items-center my-2 h-32 relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-28 h-28">
                    {/* Lips & Mouth Opening Outer */}
                    <path
                      d="M 10 50 C 10 15, 90 15, 90 50 C 90 85, 10 85, 10 50 Z"
                      fill="#1e1b4b"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                    />

                    {/* Hard Palate (Upper Pink Curve) */}
                    <path d="M 20 40 Q 50 15 80 40" fill="none" stroke="#f472b6" strokeWidth="4" />

                    {/* Soft Palate & Uvula based on Class */}
                    {item.num === 1 && (
                      <>
                        {/* Soft Palate & Fauces */}
                        <path d="M 22 42 Q 50 25 78 42" fill="#ec4899" opacity="0.6" />
                        {/* Tonsillar Pillars */}
                        <path d="M 25 45 Q 35 60 25 70 M 75 45 Q 65 60 75 70" stroke="#f43f5e" strokeWidth="2.5" fill="none" />
                        {/* Full Uvula hanging */}
                        <path d="M 45 32 Q 50 55 55 32 Z" fill="#f43f5e" stroke="#fda4af" strokeWidth="1" />
                        {/* Posterior Pharyngeal Wall (Deep Dark Throat) */}
                        <ellipse cx="50" cy="52" rx="18" ry="12" fill="#450a0a" opacity="0.9" />
                      </>
                    )}

                    {item.num === 2 && (
                      <>
                        {/* Soft Palate */}
                        <path d="M 22 42 Q 50 28 78 42" fill="#ec4899" opacity="0.7" />
                        {/* Partial Uvula */}
                        <path d="M 46 32 Q 50 46 54 32 Z" fill="#f43f5e" stroke="#fda4af" strokeWidth="1" />
                        {/* Throat Partial */}
                        <ellipse cx="50" cy="50" rx="14" ry="7" fill="#450a0a" opacity="0.8" />
                      </>
                    )}

                    {item.num === 3 && (
                      <>
                        {/* Soft palate lower */}
                        <path d="M 20 45 Q 50 35 80 45" fill="#ec4899" opacity="0.8" />
                        {/* Uvula base only */}
                        <path d="M 47 38 Q 50 42 53 38 Z" fill="#f43f5e" />
                      </>
                    )}

                    {item.num === 4 && (
                      <>
                        {/* Tongue completely covering soft palate */}
                        <path d="M 18 45 Q 50 30 82 45 Z" fill="#be185d" />
                      </>
                    )}

                    {/* Tongue Base */}
                    <path
                      d="M 15 55 Q 50 42 85 55 C 80 82, 20 82, 15 55 Z"
                      fill="#e11d48"
                      stroke="#fb7185"
                      strokeWidth="1.5"
                    />
                    {/* Tongue Surface texture */}
                    <path d="M 35 65 Q 50 68 65 65" stroke="#f43f5e" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>

                <p className="text-xs font-bold text-white mb-1">{item.subtitle}</p>
                <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 2. CORMACK-LEHANE DIAGRAM (GRADES 1 - 4)
// ==========================================
export const CormackDiagram: React.FC<{ selectedGrade?: number; onSelectGrade?: (g: number) => void }> = ({
  selectedGrade,
  onSelectGrade
}) => {
  const grades = [
    {
      num: 1,
      title: 'Grado 1',
      subtitle: 'Cuerdas Vocales Completas',
      desc: 'Visualización total de la glotis, cuerdas vocales verdaderas y falsas, y comisura anterior.',
      color: 'emerald',
      tag: 'Intubación Fácil (100%)'
    },
    {
      num: 2,
      title: 'Grado 2',
      subtitle: 'Comisura Posterior / Aritenoides',
      desc: 'Visualización parcial de la glotis. Solo aritenoides o parte posterior de las cuerdas.',
      color: 'cyan',
      tag: 'Dificultad Leve'
    },
    {
      num: 3,
      title: 'Grado 3',
      subtitle: 'Epiglotis Únicamente',
      desc: 'Visualización únicamente de la epiglotis. Cuerdas vocales no visibles.',
      color: 'amber',
      tag: 'VAD Severa (Requiere Estilete/VL)'
    },
    {
      num: 4,
      title: 'Grado 4',
      subtitle: 'Sin Epiglotis',
      desc: 'No se visualiza ni la epiglotis ni la glotis. Solo se observa el paladar blando.',
      color: 'rose',
      tag: 'VAD Extrema'
    }
  ];

  return (
    <div className="space-y-4 my-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
          📸 Visión Laringoscópica - Clasificación Cormack-Lehane
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {grades.map((item) => {
          const isSelected = selectedGrade === item.num;
          return (
            <div
              key={item.num}
              onClick={() => onSelectGrade && onSelectGrade(item.num)}
              className={`cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{item.tag}</span>
                </div>

                {/* SVG Illustration of Laryngoscopy Circular View */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex justify-center items-center my-2 h-32 relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-28 h-28">
                    {/* Dark Laryngeal Field (Blade view circle) */}
                    <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

                    {/* Grade 1: Full Glottis Visible */}
                    {item.num === 1 && (
                      <>
                        {/* Epiglottis Top */}
                        <path d="M 30 25 Q 50 15 70 25 C 65 35, 35 35, 30 25 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
                        {/* Glottic Opening (Dark triangle) */}
                        <path d="M 50 32 L 38 72 L 62 72 Z" fill="#020617" />
                        {/* Vocal Cords (White-cream V shape) */}
                        <path d="M 50 32 L 40 70 M 50 32 L 60 70" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                        {/* Arytenoid Cartilages at bottom */}
                        <circle cx="38" cy="73" r="5" fill="#f43f5e" />
                        <circle cx="62" cy="73" r="5" fill="#f43f5e" />
                      </>
                    )}

                    {/* Grade 2: Partial Glottis (Arytenoids / Posterior Commissure) */}
                    {item.num === 2 && (
                      <>
                        {/* Epiglottis larger/lower */}
                        <path d="M 25 35 Q 50 20 75 35 C 70 50, 30 50, 25 35 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />
                        {/* Glottic posterior slice */}
                        <path d="M 50 50 L 42 74 L 58 74 Z" fill="#020617" />
                        <path d="M 50 50 L 44 72 M 50 50 L 56 72" stroke="#f8fafc" strokeWidth="2.5" />
                        <circle cx="42" cy="74" r="5" fill="#f43f5e" />
                        <circle cx="58" cy="74" r="5" fill="#f43f5e" />
                      </>
                    )}

                    {/* Grade 3: Epiglottis Only */}
                    {item.num === 3 && (
                      <>
                        {/* Epiglottis covering glottis completely */}
                        <path d="M 20 45 Q 50 28 80 45 C 75 65, 25 65, 20 45 Z" fill="#be185d" stroke="#f43f5e" strokeWidth="1.5" />
                        <path d="M 30 55 Q 50 62 70 55" stroke="#9d174d" strokeWidth="2" fill="none" />
                      </>
                    )}

                    {/* Grade 4: Only Soft Tissue / Soft Palate */}
                    {item.num === 4 && (
                      <>
                        <circle cx="50" cy="50" r="42" fill="#881337" opacity="0.8" />
                        <path d="M 10 50 Q 50 70 90 50" stroke="#e11d48" strokeWidth="3" fill="none" />
                      </>
                    )}
                  </svg>
                </div>

                <p className="text-xs font-bold text-white mb-1">{item.subtitle}</p>
                <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 3. VORTEX FUNNEL DIAGRAM (NICHOLAS CHRIMES PROTOCOL)
// ==========================================
export const VortexDiagram: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'esquema' | 'vectores' | 'cico'>('esquema');

  return (
    <div className="bg-slate-900 border border-indigo-800/60 rounded-2xl p-5 my-4 shadow-xl text-white space-y-4">
      {/* Protocol Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-indigo-800/40 pb-3 gap-2">
        <div>
          <h4 className="text-sm font-black text-cyan-300 flex items-center gap-2">
            🌀 Diagrama Oficial del Protocolo Vórtex (The Vortex Approach)
          </h4>
          <p className="text-xs text-slate-400">
            Modelo de Gestión de Vía Aérea Difícil por Dr. Nicholas Chrimes & Dr. Peter Fritz
          </p>
        </div>
        <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/50 text-indigo-300 w-fit">
          Protocolo Universal DAS / Vortex
        </span>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('esquema')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'esquema'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🎨 Esquema del Vórtex
        </button>
        <button
          onClick={() => setActiveTab('vectores')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'vectores'
              ? 'bg-indigo-500 text-white font-black shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          ⚡ 5 Vectores de Optimización
        </button>
        <button
          onClick={() => setActiveTab('cico')}
          className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'cico'
              ? 'bg-rose-600 text-white font-black shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          🔴 Estado CICO & eFNA
        </button>
      </div>

      {/* Tab 1: Esquema Gráfico SVG */}
      {activeTab === 'esquema' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center animate-fadeIn">
          {/* Interactive SVG Funnel */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-900/60 flex flex-col items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 320 270" className="w-full max-w-sm h-auto">
              <defs>
                <linearGradient id="vortexGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <linearGradient id="vortexBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <linearGradient id="vortexIndigo" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
                <linearGradient id="vortexPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7e22ce" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <linearGradient id="vortexRed" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#be185d" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {/* Green Zone Rim (Green Safety Ring - Alveolar Oxygenation) */}
              <ellipse cx="160" cy="30" rx="145" ry="24" fill="url(#vortexGreen)" opacity="0.95" stroke="#34d399" strokeWidth="2" />
              <text x="160" y="34" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="0.5">
                GREEN ZONE: Oxigenación Alveolar Adecuada
              </text>

              {/* Funnel Slope to Lifeline 1: Face Mask */}
              <path d="M 15 30 L 45 90 C 100 108, 220 108, 275 90 L 305 30 Z" fill="#0284c7" opacity="0.2" />
              <ellipse cx="160" cy="90" rx="115" ry="18" fill="url(#vortexBlue)" opacity="0.9" stroke="#0284c7" strokeWidth="2" />
              <text x="160" y="94" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                1. MASCARILLA FACIAL (MF)
              </text>

              {/* Funnel Slope to Lifeline 2: Supraglottic Airway (DSG) */}
              <path d="M 45 90 L 80 150 C 120 165, 200 165, 240 150 L 275 90 Z" fill="#6366f1" opacity="0.25" />
              <ellipse cx="160" cy="150" rx="80" ry="14" fill="url(#vortexIndigo)" opacity="0.9" stroke="#4338ca" strokeWidth="2" />
              <text x="160" y="154" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="800">
                2. DISPOSITIVO SUPRAGLÓTICO (DSG)
              </text>

              {/* Funnel Slope to Lifeline 3: Endotracheal Tube (TET) */}
              <path d="M 80 150 L 115 200 C 135 210, 185 210, 205 200 L 240 150 Z" fill="#a855f7" opacity="0.3" />
              <ellipse cx="160" cy="200" rx="45" ry="9" fill="url(#vortexPurple)" opacity="0.95" stroke="#7e22ce" strokeWidth="2" />
              <text x="160" y="203" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">
                3. TUBO TRAQUEAL
              </text>

              {/* Apex Danger Zone: CICO Line (Can't Intubate, Can't Oxygenate) */}
              <path d="M 115 200 L 140 240 L 180 240 L 205 200 Z" fill="#be185d" />
              <ellipse cx="160" cy="240" rx="20" ry="5" fill="url(#vortexRed)" stroke="#f43f5e" strokeWidth="2" />
              <text x="160" y="258" textAnchor="middle" fill="#fecdd3" fontSize="10" fontWeight="900">
                🔴 FRONTERA CICO: Acceso Quirúrgico de Cuello (eFNA)
              </text>
            </svg>
            <span className="text-[9px] text-slate-400 mt-1 italic">
              Ilustración oficial adaptada de N. Chrimes "The Vortex Approach"
            </span>
          </div>

          {/* Core Principles Description */}
          <div className="space-y-3 text-xs">
            <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/40 text-emerald-100">
              <strong className="text-emerald-300 font-black block mb-1">🟢 La Zona Verde (Green Zone):</strong>
              <p className="leading-relaxed">
                Es la meta absoluta de la reanimación. Representa la restauración exitosa de la oxigenación alveolar adecuada (SpO2 estable, Capnografía continua). Si se logra en cualquiera de las 3 líneas, el paciente está a salvo.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 font-extrabold block mb-1">🌀 Regla de los 3 Intentos Máximos:</strong>
              <p className="text-slate-300 leading-relaxed">
                Cada una de las 3 líneas no quirúrgicas (Mascarilla, DSG, Tubo Traqueal) permite un máximo de <strong>3 intentos optimizados</strong>. Si tras el 3er intento la oxigenación falla, se debe espiralar hacia la siguiente línea sin perder tiempo.
              </p>
            </div>

            <div className="bg-rose-950/50 p-3.5 rounded-xl border border-rose-800/60 text-rose-200">
              <strong className="text-rose-300 font-black block mb-1">⚠️ Declaración Inmediata de CICO:</strong>
              <p className="leading-relaxed">
                Si las 3 líneas fallan y la SpO2 cae irremediablemente, se alcanza el ápice del Vórtex (Estado CICO: Can’t Intubate, Can’t Oxygenate). Se debe declarar la emergencia en voz alta y realizar Cricotiroidotomía Quirúrgica.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 5 Vectores de Optimización */}
      {activeTab === 'vectores' && (
        <div className="space-y-3 animate-fadeIn text-xs">
          <p className="text-slate-300">
            Según Nicholas Chrimes, un <strong>"Intento Optimizado"</strong> en cualquiera de las 3 líneas del Vórtex exige considerar activamente los <strong>5 Vectores de Optimización</strong> antes de declarar fallida una línea:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-indigo-500/30">
              <span className="text-indigo-400 font-black text-sm block mb-1">1. 🤸 Manipulación / Posición</span>
              <p className="text-slate-300">
                Alineación de ejes (Posición de Olfateo / Sniffing position), rampas en obesos, tracción mandibular bimanual, subluxación mandibular, maniobra BURP / OELM sobre el cartílago tiroides.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30">
              <span className="text-cyan-400 font-black text-sm block mb-1">2. 🛠️ Dispositivos y Adyuvantes</span>
              <p className="text-slate-300">
                Uso de cánulas orofaríngeas (Guedel/Berman) o nasofaríngeas, guías/estiletes maleables, Bujía de Frova/Eschmann, Videolaringoscopio con hoja hipercurvada (D-Blade/McGrath).
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30">
              <span className="text-amber-400 font-black text-sm block mb-1">3. 📐 Tamaño y Tipo</span>
              <p className="text-slate-300">
                Cambio de tamaño de hoja laringoscópica (Miller/Macintosh), disminución de número de Tubo Traqueal (p. ej., pasar de 7.5 a 6.5) o reemplazo por DSG de 2da generación (ProSeal, i-gel).
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/30">
              <span className="text-emerald-400 font-black text-sm block mb-1">4. 👨‍⚕️ Operador</span>
              <p className="text-slate-300">
                Transferencia inmediata de la vía aérea al operador con mayor experiencia técnica o destreza del equipo.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/30 sm:col-span-2">
              <span className="text-rose-400 font-black text-sm block mb-1">5. 💉 Relajación Neuromuscular Completa</span>
              <p className="text-slate-300">
                Asegurar parálisis motora profunda comprobada por estimulador (TOF 0/4). Rocuronio 1.2 mg/kg o Succinilcolina 1.5 mg/kg elimina la rigidez muscular y el laringoespasmo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: CICO & eFNA */}
      {activeTab === 'cico' && (
        <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl space-y-3 animate-fadeIn text-xs text-rose-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🚨</span>
            <h5 className="font-black text-rose-300 text-sm">
              Declaración de Crisis CICO (Can't Intubate, Can't Oxygenate)
            </h5>
          </div>

          <p className="leading-relaxed">
            Cuando se han agotado los intentos optimizados en las 3 líneas no quirúrgicas y la oxigenación alveolar no puede ser restaurada, el paciente ha alcanzado el fondo del Vórtex. Se debe solicitar inmediatamente el kit de vía aérea quirúrgica.
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/60 space-y-2 text-slate-200">
            <strong className="text-rose-400 block font-black">🔪 Técnica Quirúrgica de Rescate (Bisturí - Bujía - Tubo):</strong>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px]">
              <li><strong>Extensión del Cuello:</strong> Posición con resalte bajo hombros (salvo sospecha de trauma cervical).</li>
              <li><strong>Identificación de Membrana Cricotiroidea:</strong> Palpación entre cartílago tiroides y cricoides.</li>
              <li><strong>Incisón Transversal con Bisturí #10:</strong> Corte transversal de 1.5 cm a través de piel y membrana cricotiroidea.</li>
              <li><strong>Giro del Bisturí 90°:</strong> Girar el mango apuntando hacia los pies para mantener el estoma abierto.</li>
              <li><strong>Inserción de Bujía (Eschmann/Frova):</strong> Deslizar la bujía 10-15 cm hacia la tráquea hasta sentir "clics" traqueales.</li>
              <li><strong>Avanzar Tubo Endotraqueal Con N° 6.0:</strong> Deslizar el tubo sobre la bujía, insuflar manguito y conectar a capnografía.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. BROMAGE MOTOR BLOCK DIAGRAM
// ==========================================
export const BromageDiagram: React.FC<{ selectedGrade?: number; onSelectGrade?: (g: number) => void }> = ({
  selectedGrade,
  onSelectGrade
}) => {
  const grades = [
    {
      grade: 0,
      title: 'Bromage 0 (Nulo - 0%)',
      desc: 'Movilidad completa de caderas, rodillas y tobillos. Levanta la pierna extendida.',
      color: 'emerald',
      bgClass: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
    },
    {
      grade: 1,
      title: 'Bromage I (Parcial - 33%)',
      desc: 'Incapaz de levantar la pierna extendida. Puede doblar rodillas y mover los pies.',
      color: 'cyan',
      bgClass: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
    },
    {
      grade: 2,
      title: 'Bromage II (Casi Completo - 66%)',
      desc: 'Incapaz de doblar las rodillas. Mueve libremente los pies y los dedos.',
      color: 'amber',
      bgClass: 'bg-amber-950/40 border-amber-500/50 text-amber-300'
    },
    {
      grade: 3,
      title: 'Bromage III (Total - 100%)',
      desc: 'Incapacidad total para mover caderas, rodillas, pies o tobillos.',
      color: 'rose',
      bgClass: 'bg-rose-950/40 border-rose-500/50 text-rose-300'
    }
  ];

  return (
    <div className="space-y-3 my-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
          🦵 Diagrama de Bloqueo Motor Subaracnoideo / Epidural (Bromage)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {grades.map((item) => {
          const isSelected = selectedGrade === item.grade;
          return (
            <div
              key={item.grade}
              onClick={() => onSelectGrade && onSelectGrade(item.grade)}
              className={`cursor-pointer rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-teal-400 ring-2 ring-teal-400/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border block w-fit mb-2 ${item.bgClass}`}>
                  {item.title}
                </span>

                {/* SVG Visual Leg Illustration */}
                <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 flex justify-center items-center my-2 h-28">
                  <svg viewBox="0 0 120 80" className="w-28 h-20">
                    {/* Bed line */}
                    <line x1="10" y1="70" x2="110" y2="70" stroke="#475569" strokeWidth="3" />

                    {/* Patient Body / Leg based on Grade */}
                    {item.grade === 0 && (
                      <>
                        {/* Hip at x=20, knee raised high up at y=25 */}
                        <path d="M 15 68 L 35 30 L 75 68 L 105 68" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <circle cx="35" cy="30" r="4" fill="#34d399" />
                        <text x="35" y="18" textAnchor="middle" fill="#a7f3d0" fontSize="8" fontWeight="bold">Pierna Extendida ↑</text>
                      </>
                    )}

                    {item.grade === 1 && (
                      <>
                        {/* Knee bent upwards resting on bed */}
                        <path d="M 15 68 L 45 42 L 80 68 L 105 68" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <circle cx="45" cy="42" r="4" fill="#22d3ee" />
                        <text x="45" y="30" textAnchor="middle" fill="#cff4fc" fontSize="8" fontWeight="bold">Flexiona Rodilla</text>
                      </>
                    )}

                    {item.grade === 2 && (
                      <>
                        {/* Leg flat, foot wiggling */}
                        <path d="M 15 68 L 85 68 L 100 52" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <path d="M 100 52 L 108 58" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                        <text x="60" y="52" textAnchor="middle" fill="#fde68a" fontSize="8" fontWeight="bold">Mueve Pies Solamente</text>
                      </>
                    )}

                    {item.grade === 3 && (
                      <>
                        {/* Completely flat, paralyzed leg */}
                        <path d="M 15 68 L 105 68" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" fill="none" />
                        <text x="60" y="52" textAnchor="middle" fill="#fecdd3" fontSize="8" fontWeight="bold">Parálisis Completa (100%)</text>
                      </>
                    )}
                  </svg>
                </div>

                <p className="text-[11px] text-slate-300 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 5. ESCALA VISUAL ANÁLOGA DEL DOLOR (EVA / VAS)
// ==========================================
export const EvaScaleDiagram: React.FC = () => {
  const [selectedScore, setSelectedScore] = React.useState<number>(4);

  const levels = [
    { score: 0, label: 'Sin Dolor', desc: 'Sintomático nulo. Confort absoluto.', face: '😊', color: 'emerald', bg: 'bg-emerald-500', border: 'border-emerald-500' },
    { score: 2, label: 'Dolor Leve', desc: 'Molestia mínima. No interfiere con actividades.', face: '🙂', color: 'emerald', bg: 'bg-emerald-400', border: 'border-emerald-400' },
    { score: 4, label: 'Dolor Moderado', desc: 'Soportable, pero interfiere con la concentración o el sueño.', face: '😐', color: 'amber', bg: 'bg-amber-400', border: 'border-amber-400' },
    { score: 6, label: 'Dolor Intenso', desc: 'Interfiere marcadamente. Requiere analgésicos sistémicos.', face: '😣', color: 'orange', bg: 'bg-orange-500', border: 'border-orange-500' },
    { score: 8, label: 'Dolor Severo', desc: 'Incapacitante. Imposibilita la deambulación o descanso.', face: '😫', color: 'rose', bg: 'bg-rose-500', border: 'border-rose-500' },
    { score: 10, label: 'Dolor Insoportable', desc: 'El peor dolor imaginable. Emergencia analgésica.', face: '😭', color: 'red', bg: 'bg-red-600', border: 'border-red-600' }
  ];

  const getInterpretation = (val: number) => {
    if (val === 0) return { title: 'Sin Dolor (0)', cat: 'Mantenimiento', desc: 'No se requiere analgesia de rescate.', badge: 'bg-emerald-950 text-emerald-300 border-emerald-600' };
    if (val <= 3) return { title: 'Dolor Leve (1-3)', cat: 'Escalón 1 OMS', desc: 'Paracetamol, AINEs orales / IV (Ketoprofeno, Diclofenac, Metamizol).', badge: 'bg-emerald-900 text-emerald-200 border-emerald-500' };
    if (val <= 6) return { title: 'Dolor Moderado (4-6)', cat: 'Escalón 2 OMS', desc: 'AINEs + Opioide débil (Tramadol, Codeína) o bolo titulación opioide.', badge: 'bg-amber-950 text-amber-300 border-amber-600' };
    if (val <= 8) return { title: 'Dolor Severo (7-8)', cat: 'Escalón 3 OMS', desc: 'Opioide potente (Morfina, Fentanilo, Alfentanil) + AINE / Bloqueo.', badge: 'bg-rose-950 text-rose-300 border-rose-600' };
    return { title: 'Dolor Extremo (9-10)', cat: 'Emergencia Analgésica', desc: 'Titulación de opioides IV rápida, infusión continua PCA o bloqueos regionales.', badge: 'bg-red-950 text-red-200 border-red-600' };
  };

  const currentInfo = getInterpretation(selectedScore);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 my-3 text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
        <div>
          <h4 className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
            🎨 Escala Visual Análoga del Dolor (EVA / VAS) e Interpretación Clínica
          </h4>
          <p className="text-[11px] text-slate-400">
            Regla graduada estandarizada de 0 a 10 mm/cm para la titulación de analgesia postoperatoria
          </p>
        </div>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${currentInfo.badge}`}>
          Puntaje Seleccionado: {selectedScore} / 10
        </span>
      </div>

      {/* Visual Color Gradient Bar & Numeric Buttons */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-extrabold text-slate-400 px-1">
          <span>0 (Sin Dolor)</span>
          <span>5 (Moderado)</span>
          <span>10 (Peor Dolor Imaginable)</span>
        </div>

        {/* Gradient Slider visual */}
        <div className="h-4 rounded-full w-full bg-gradient-to-r from-emerald-500 via-amber-400 via-orange-500 to-rose-600 relative p-0.5 flex items-center shadow-inner">
          <div
            className="w-6 h-6 rounded-full bg-white shadow-xl border-2 border-slate-900 absolute transform -translate-x-1/2 cursor-pointer transition-all duration-150 flex items-center justify-center font-black text-[10px] text-slate-900"
            style={{ left: `${(selectedScore / 10) * 100}%` }}
          >
            {selectedScore}
          </div>
        </div>

        {/* Numeric Scale Selector Buttons */}
        <div className="grid grid-cols-11 gap-1 pt-1">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isSelected = selectedScore === num;
            return (
              <button
                key={num}
                onClick={() => setSelectedScore(num)}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg ring-2 ring-cyan-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* Faces & Expressions Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {levels.map((item) => (
          <div
            key={item.score}
            onClick={() => setSelectedScore(item.score)}
            className={`cursor-pointer p-2.5 rounded-xl border text-center transition-all ${
              selectedScore === item.score || (selectedScore >= item.score - 1 && selectedScore <= item.score + 1)
                ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/50 scale-[1.02]'
                : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80'
            }`}
          >
            <div className="text-2xl mb-1">{item.face}</div>
            <span className="text-[11px] font-extrabold text-white block">
              {item.score}: {item.label}
            </span>
            <span className="text-[9px] text-slate-400 block leading-tight mt-1">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Selected Action / Treatment Card */}
      <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
            Estrategia Analgésica Recomendada:
          </span>
          <h5 className="text-sm font-black text-white">{currentInfo.title} &bull; {currentInfo.cat}</h5>
          <p className="text-xs text-slate-300 mt-0.5">{currentInfo.desc}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 block italic">Objetivo postoperatorio: EVA &le; 3</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. ESCALA POGO (PERCENTAGE OF GLOTTIC OPENING)
// ==========================================
export const PogoScaleDiagram: React.FC = () => {
  const [selectedPogo, setSelectedPogo] = React.useState<number>(100);

  const pogoExamples = [
    {
      pct: 100,
      title: 'POGO 100%',
      desc: 'Visualización total de la glotis. Desde la comisura anterior hasta la muesca interaritenoidea.',
      corMark: 'Cormack-Lehane I',
      difficulty: 'Intubación Fácil (100% éxito)',
      color: 'emerald'
    },
    {
      pct: 75,
      title: 'POGO 75%',
      desc: 'Visualización de 3/4 partes de las cuerdas vocales verdaderas y aritenoides completos.',
      corMark: 'Cormack-Lehane IIa',
      difficulty: 'Intubación Fácil / Moderada',
      color: 'cyan'
    },
    {
      pct: 50,
      title: 'POGO 50%',
      desc: 'Visualización únicamente de la mitad posterior de las cuerdas vocales y comisura posterior.',
      corMark: 'Cormack-Lehane IIb',
      difficulty: 'Requiere Maniobra BURP / Guía',
      color: 'amber'
    },
    {
      pct: 25,
      title: 'POGO 25%',
      desc: 'Visualización limitada a los cartílagos aritenoides y muesca posterior. Cuerdas tapadas.',
      corMark: 'Cormack-Lehane IIIa',
      difficulty: 'VAD: Requiere Bujía / Videolaringoscopio',
      color: 'orange'
    },
    {
      pct: 0,
      title: 'POGO 0%',
      desc: 'No se observa ninguna estructura glótica ni cuerdas vocales. Solo epiglotis o estructuras supraglóticas.',
      corMark: 'Cormack-Lehane IIIb / IV',
      difficulty: 'VAD Severa: Videolaringoscopia OBLIGATORIA',
      color: 'rose'
    }
  ];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 my-3 text-white space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
        <div>
          <h4 className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
            📸 Escala POGO (Percentage of Glottic Opening) - Laringoscopia Directa y Videolaringoscopia
          </h4>
          <p className="text-[11px] text-slate-400">
            Cuantificación numérica continua (0% a 100%) de la apertura glótica expuesta desde la comisura anterior a los aritenoides
          </p>
        </div>
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700">
          Ref: Orebaugh et al. / Levitan et al.
        </span>
      </div>

      {/* Visual Diagram Cards Grid for POGO values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {pogoExamples.map((item) => {
          const isSelected = selectedPogo === item.pct;
          return (
            <div
              key={item.pct}
              onClick={() => setSelectedPogo(item.pct)}
              className={`cursor-pointer rounded-2xl p-3 border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-[1.02]'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-700/60">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">{item.corMark}</span>
                </div>

                {/* SVG Laryngeal Circle representing POGO % */}
                <div className="bg-slate-950 rounded-xl p-2 border border-slate-800 flex justify-center items-center my-2 h-28 relative overflow-hidden">
                  <svg viewBox="0 0 100 100" className="w-24 h-24">
                    {/* Circle field */}
                    <circle cx="50" cy="50" r="44" fill="#0f172a" stroke="#334155" strokeWidth="2" />

                    {/* Epiglottis always at top */}
                    <path d="M 28 22 Q 50 12 72 22 C 67 32, 33 32, 28 22 Z" fill="#e11d48" stroke="#f43f5e" strokeWidth="1" />

                    {item.pct === 100 && (
                      <>
                        {/* Anterior commissure + Full Vocal cords */}
                        <path d="M 50 24 L 36 72 L 64 72 Z" fill="#020617" />
                        <path d="M 50 24 L 38 70 M 50 24 L 62 70" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="36" cy="73" r="4.5" fill="#f43f5e" />
                        <circle cx="64" cy="73" r="4.5" fill="#f43f5e" />
                        <text x="50" y="20" textAnchor="middle" fill="#38bdf8" fontSize="6" fontWeight="bold">Comisura Ant.</text>
                      </>
                    )}

                    {item.pct === 75 && (
                      <>
                        {/* 3/4 glottis visible */}
                        <path d="M 50 34 L 38 72 L 62 72 Z" fill="#020617" />
                        <path d="M 50 34 L 40 70 M 50 34 L 60 70" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="38" cy="73" r="4.5" fill="#f43f5e" />
                        <circle cx="62" cy="73" r="4.5" fill="#f43f5e" />
                      </>
                    )}

                    {item.pct === 50 && (
                      <>
                        {/* Half glottis visible */}
                        <path d="M 50 48 L 40 72 L 60 72 Z" fill="#020617" />
                        <path d="M 50 48 L 42 70 M 50 48 L 58 70" stroke="#f8fafc" strokeWidth="2.5" />
                        <circle cx="40" cy="73" r="4.5" fill="#f43f5e" />
                        <circle cx="60" cy="73" r="4.5" fill="#f43f5e" />
                      </>
                    )}

                    {item.pct === 25 && (
                      <>
                        {/* Only posterior 25% visible */}
                        <path d="M 50 60 L 42 74 L 58 74 Z" fill="#020617" />
                        <circle cx="42" cy="74" r="4.5" fill="#f43f5e" />
                        <circle cx="58" cy="74" r="4.5" fill="#f43f5e" />
                      </>
                    )}

                    {item.pct === 0 && (
                      <>
                        {/* 0% visible - Epiglottis hanging down covering glottis */}
                        <path d="M 22 35 Q 50 20 78 35 C 72 65, 28 65, 22 35 Z" fill="#be185d" stroke="#f43f5e" strokeWidth="1" />
                        <text x="50" y="78" textAnchor="middle" fill="#fecdd3" fontSize="7" fontWeight="bold">0% Apertura</text>
                      </>
                    )}
                  </svg>
                </div>

                <p className="text-[10px] font-bold text-amber-300 mb-1">{item.difficulty}</p>
                <p className="text-[10px] text-slate-300 leading-snug">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Anatomical Landmark Explanation */}
      <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <strong className="text-cyan-300 block font-bold mb-1">📍 Línea Base Superior (0%):</strong>
          <p className="text-slate-300">Comisura anterior de las cuerdas vocales (vértice donde convergen en la cara posterior del cartílago tiroides).</p>
        </div>
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
          <strong className="text-cyan-300 block font-bold mb-1">📍 Línea Base Inferior (100%):</strong>
          <p className="text-slate-300">Muesca interaritenoidea (espacio entre los cartílagos aritenoides en la pared glótica posterior).</p>
        </div>
        <div className="bg-indigo-950/60 p-2.5 rounded-lg border border-indigo-700/50">
          <strong className="text-indigo-300 block font-bold mb-1">💡 Ventaja sobre Cormack:</strong>
          <p className="text-slate-200">Proporciona mayor consistencia entre observadores y es la escala preferida para evaluar el desempeño de videolaringoscopios.</p>
        </div>
      </div>
    </div>
  );
};

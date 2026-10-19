import React, { useState } from 'react';
import { 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Activity, 
  Clock, 
  CheckCircle2, 
  Flame, 
  ArrowRight,
  TrendingDown,
  Wind,
  Stethoscope,
  Pill,
  Sparkles,
  Zap,
  Scale
} from 'lucide-react';

export const PreeclampsiaFluidsHydrationManager: React.FC = () => {
  // Calculadora Directa y Limpia de Cristaloide Basal (Ringer Lactato)
  const [patientWeightInput, setPatientWeightInput] = useState<string>('70');
  const [patientWeightKg, setPatientWeightKg] = useState<number>(70);
  const [crystalloidRate, setCrystalloidRate] = useState<number>(70);
  const [crystalloidRateInput, setCrystalloidRateInput] = useState<string>('70');
  const [calculationMode, setCalculationMode] = useState<'1ml_kg' | 'fixed_50' | 'fixed_60' | 'fixed_80' | 'custom'>('1ml_kg');

  // Bloque SEPARADO e INDEPENDIENTE de bombas de infusión (MgSO4 y Oxitocina)
  const [separateMgDose, setSeparateMgDose] = useState<'1g' | '2g'>('1g');
  const [separateOxitoDose, setSeparateOxitoDose] = useState<'baja' | 'media' | 'alta'>('media');

  // Cálculos limpios EXCLUSIVAMENTE de Cristaloide
  const activeWeight = patientWeightKg > 0 ? patientWeightKg : 70;
  const ratePerKg = Number((crystalloidRate / activeWeight).toFixed(2));
  const dailyTotalCrystalloid = crystalloidRate * 24;
  const dropsPerMinute = Math.round(crystalloidRate / 3); // Macrogotero clásico: 1 mL/h = 1/3 gota/min (20 gts/mL)

  return (
    <div className="space-y-6">
      {/* HEADER DE LA SECCIÓN DE HIDRATACIÓN */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              TERAPIA DE FLUIDOS &amp; RESTRICCIÓN PARENTERAL
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Protocolo de Manejo de Líquidos &amp; Calculadora de Líquidos
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Estrategia restrictiva guiada por metas: límite estricto de <strong className="text-cyan-300">60 a 80 mL/h</strong> para prevenir el Edema Agudo Pulmonar letal
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono">
              Meta Restrictiva: 60 - 80 mL/h
            </span>
          </div>
        </div>

        {/* ALERTA FISIOPATOLÓGICA DE STARLING */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-rose-400 font-bold flex items-center gap-1.5 text-xs">
              <TrendingDown className="w-4 h-4" />
              1. Hipoalbuminemia Severa
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              La proteinuria masiva reduce la albúmina a &lt; 2.5 g/dL. La presión coloidosmótica oncótica capilar ($Π_c$) cae de 22 a &lt; 14 mmHg, anulando la fuerza que retiene el agua intravascular.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
              <Flame className="w-4 h-4" />
              2. Fuga Capilar y Glicocálix Roto
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              El desbalance sFlt-1/PlGF desprende el glicocálix endotelial vascular. La permeabilidad capilar ($K_f$) se cuadruplica, permitiendo la extravasación fulminante de albúmina y agua al intersticio.
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
              <Wind className="w-4 h-4" />
              3. Peligro de Edema Pulmonar
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cualquier exceso hídrico parenteral traspasa instantáneamente la membrana alvéolo-capilar, precipitando <strong>Edema Agudo Pulmonar (EAP)</strong>, la causa #1 de ingreso a UCI y muerte materna prevenible.
            </p>
          </div>
        </div>
      </div>

      {/* CALCULADORA LIMPIA Y DIRECTA DE CRISTALOIDE (RINGER LACTATO) */}
      <div className="bg-slate-900/95 border-2 border-cyan-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-400" />
              Calculadora de Infusión de Cristaloide (Ringer Lactato)
            </h3>
            <p className="text-xs text-slate-400">
              Cálculo directo del suero basal restrictivo sin mezclar bombas secundarias.
            </p>
          </div>
          <span className={`px-3 py-1 rounded-xl text-xs font-black font-mono flex items-center gap-1.5 ${
            crystalloidRate <= 80
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-rose-500 text-white font-black animate-pulse'
          }`}>
            {crystalloidRate <= 80 ? <CheckCircle2 className="w-4 h-4" /> : <Flame className="w-4 h-4" />}
            {crystalloidRate <= 80 ? 'INFUSIÓN SEGURA (≤ 80 mL/h)' : 'ALERTA: RATA ELEVADA (> 80 mL/h)'}
          </span>
        </div>

        {/* INPUTS CLAROS: PESO Y SELECCIÓN DE VELOCIDAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Peso de la Paciente */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <label className="text-xs text-slate-300 font-bold block">
              Peso Materno Actual (kg):
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={patientWeightInput}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                onChange={(e) => {
                  const val = e.target.value;
                  setPatientWeightInput(val);
                  const parsed = parseInt(val, 10);
                  if (!isNaN(parsed) && parsed > 0) {
                    setPatientWeightKg(parsed);
                    if (calculationMode === '1ml_kg') {
                      setCrystalloidRate(parsed);
                      setCrystalloidRateInput(String(parsed));
                    }
                  }
                }}
                placeholder="70"
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-center font-mono font-bold text-white text-xl focus:border-cyan-400 focus:outline-none placeholder:text-slate-600"
              />
              <span className="absolute right-4 text-xs font-bold text-slate-400">kg</span>
            </div>

            {/* Accesos rápidos de peso común */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[55, 60, 65, 70, 75, 80, 90].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => {
                    setPatientWeightInput(String(w));
                    setPatientWeightKg(w);
                    if (calculationMode === '1ml_kg') {
                      setCrystalloidRate(w);
                      setCrystalloidRateInput(String(w));
                    }
                  }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono font-semibold border transition-all ${
                    activeWeight === w
                      ? 'bg-cyan-500/25 text-cyan-300 border-cyan-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {w} kg
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Régimen Restrictivo de Cristaloide */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <label className="text-xs text-slate-300 font-bold block">
              Seleccionar Rata de Infusión Basal (Ringer Lactato):
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCalculationMode('1ml_kg');
                  setCrystalloidRate(activeWeight);
                  setCrystalloidRateInput(String(activeWeight));
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  calculationMode === '1ml_kg'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">1 mL / kg / h</div>
                <div className="text-[11px] font-mono opacity-80 mt-0.5">({activeWeight} mL/h)</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCalculationMode('fixed_50');
                  setCrystalloidRate(50);
                  setCrystalloidRateInput('50');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  calculationMode === 'fixed_50'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">50 mL / h</div>
                <div className="text-[11px] opacity-80 mt-0.5">Protectora estricta</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCalculationMode('fixed_60');
                  setCrystalloidRate(60);
                  setCrystalloidRateInput('60');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  calculationMode === 'fixed_60'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">60 mL / h</div>
                <div className="text-[11px] opacity-80 mt-0.5">Estándar NICE/FIGO</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCalculationMode('fixed_80');
                  setCrystalloidRate(80);
                  setCrystalloidRateInput('80');
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  calculationMode === 'fixed_80'
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-300 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">80 mL / h</div>
                <div className="text-[11px] opacity-80 mt-0.5">Límite máx. restrictivo</div>
              </button>
            </div>

            {/* Opción Manual */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-850">
              <span className="text-[11px] text-slate-400">O escribir valor manual:</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={crystalloidRateInput}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                onFocus={(e) => (e.target as HTMLInputElement).select()}
                onChange={(e) => {
                  const val = e.target.value;
                  setCrystalloidRateInput(val);
                  const parsed = parseInt(val, 10);
                  if (!isNaN(parsed) && parsed >= 0) {
                    setCrystalloidRate(parsed);
                    setCalculationMode('custom');
                  }
                }}
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg py-1 px-2 text-center text-xs font-mono font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-400 font-mono">mL/h</span>
            </div>
          </div>
        </div>

        {/* RESULTADOS CLÍNICOS DIRECTOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Tarjeta 1: Velocidad Horaria y Gotas */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-cyan-300 font-bold uppercase block tracking-wider">
                Velocidad a Programar
              </span>
              <p className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                {crystalloidRate} <span className="text-base font-normal text-cyan-300">mL / hora</span>
              </p>
            </div>
            <div className="pt-2 border-t border-cyan-900/60 mt-2 text-xs font-medium text-cyan-200 flex items-center justify-between">
              <span>Gotero Macrogotero:</span>
              <strong className="text-amber-300 font-mono text-sm">~{dropsPerMinute} gotas/min</strong>
            </div>
          </div>

          {/* Tarjeta 2: Tasa Ponderal */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                Tasa Ponderal Real
              </span>
              <p className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono mt-1">
                {ratePerKg} <span className="text-base font-normal text-slate-400">mL/kg/h</span>
              </p>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-850 mt-2">
              Límite superior recomendado: <strong className="text-white">≤ 1.0 mL/kg/h</strong>
            </p>
          </div>

          {/* Tarjeta 3: Volumen en 24 Horas */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">
                Proyección en 24 Horas
              </span>
              <p className="text-3xl sm:text-4xl font-black text-purple-300 font-mono mt-1">
                {dailyTotalCrystalloid} <span className="text-base font-normal text-slate-400">mL / día</span>
              </p>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-850 mt-2">
              Volumen restrictivo máximo: <strong className="text-white">≤ 2000 mL/día</strong>
            </p>
          </div>
        </div>

        {/* NOTA CLÍNICA DE QUIRÓFANO */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Solución de Elección:</strong> Ringer Lactato o solución cristaloide balanceada (Plasmalyte). Evitar infusiones prolongadas de Solución Salina al 0.9% por riesgo de acidosis hiperclorémica y vasoespasmo renal.
          </div>
        </div>

        {/* BLOQUE APARTE E INDEPENDIENTE: BOMBAS DE SULFATO DE MAGNESIO Y OXITOCINA */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Cálculo Aparte: Bombas de MgSO₄ y Oxitocina
                <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40 font-semibold">
                  Bloque Independiente
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                Diluciones y velocidades de infusión para consulta rápida sin alterar la rata del cristaloide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Tarjeta Sulfato de Magnesio */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  Sulfato de Magnesio (MgSO₄) - Mantenimiento
                </span>
                <span className="text-xs font-mono font-bold text-purple-200 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/50">
                  {separateMgDose === '1g' ? '25 mL/h' : '50 mL/h'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSeparateMgDose('1g')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    separateMgDose === '1g'
                      ? 'bg-purple-600 text-white border-purple-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  1 g / hora (Zuspan)
                </button>
                <button
                  type="button"
                  onClick={() => setSeparateMgDose('2g')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    separateMgDose === '2g'
                      ? 'bg-purple-600 text-white border-purple-400 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  2 g / hora (Dosis Alta)
                </button>
              </div>

              <div className="text-[11px] text-slate-300 bg-purple-950/40 p-2.5 rounded-xl border border-purple-900/50 space-y-1">
                <div className="font-semibold text-purple-300">Preparación estándar:</div>
                <div>• Diluir <strong>10 g de MgSO₄</strong> (2 ampollas al 50% de 10 mL) en <strong>250 mL de Solución</strong>.</div>
                <div className="text-purple-200 font-mono">
                  → Para 1 g/h: infundir a <strong className="text-white">25 mL/h</strong>. (Para 2 g/h: <strong className="text-white">50 mL/h</strong>).
                </div>
              </div>
            </div>

            {/* Tarjeta Oxitocina */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-rose-400" />
                  Oxitocina en Infusión (Cesárea / Posparto)
                </span>
                <span className="text-xs font-mono font-bold text-rose-200 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/50">
                  {separateOxitoDose === 'baja' ? '15 mL/h' : separateOxitoDose === 'media' ? '30 mL/h' : '45 mL/h'}
                </span>
              </div>

              <div className="flex gap-1.5">
                {(['baja', 'media', 'alta'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeparateOxitoDose(lvl)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      separateOxitoDose === lvl
                        ? 'bg-rose-600 text-white border-rose-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {lvl === 'baja' ? '5-10 mUI/min' : lvl === 'media' ? '15-20 mUI/min' : '30 mUI/min'}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-300 bg-rose-950/40 p-2.5 rounded-xl border border-rose-900/50 space-y-1">
                <div className="font-semibold text-rose-300">Preparación recomendada:</div>
                <div>• Diluir <strong>20 UI de Oxitocina</strong> en <strong>500 mL de Ringer Lactato</strong> (40 mUI/mL).</div>
                <div className="text-rose-200 font-mono">
                  → Infusión: <strong className="text-white">{separateOxitoDose === 'baja' ? '10 - 15' : separateOxitoDose === 'media' ? '20 - 30' : '40 - 45'} mL/h</strong> en bomba.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: COMPARATIVA DE SOLUCIONES Y FLUIDOS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
          <Pill className="w-5 h-5 text-indigo-400" />
          Selección de Soluciones Parenterales: Cristaloides vs Coloides vs Albúmina
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* RINGER LACTATO / PLASMALYTE */}
          <div className="p-4 bg-slate-950 rounded-2xl border-2 border-emerald-500/50 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold uppercase">1ª ELECCIÓN RECOMENDADA</span>
              <h4 className="font-bold text-white text-sm">Ringer Lactato o Plasmalyte</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Cristaloides balanceados isotónicos. Poseen concentración fisiológica de cloruro (109 mEq/L vs 154 en SSN) y amortiguadores de bicarbonato (lactato o acetato/gluconato).
              </p>
            </div>
            <div className="p-2 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-[10px] text-emerald-300 font-semibold">
              💎 Previene la acidosis metabólica hiperclorémica y la vasoconstricción renal aferente.
            </div>
          </div>

          {/* SOLUCIÓN SALINA 0.9% */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/40 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold uppercase">USO RESTRINGIDO / PRECAUCIÓN</span>
              <h4 className="font-bold text-white text-sm">Solución Salina 0.9% (SSN)</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Contiene 154 mEq/L de cloro. Su administración en volúmenes &gt; 1000 mL genera acidosis metabólica hiperclorémica, empeorando el vasoespasmo arteriolar renal y la oliguria.
              </p>
            </div>
            <div className="p-2 bg-amber-950/30 rounded-xl border border-amber-900/50 text-[10px] text-amber-300">
              ⚠️ Limitar únicamente como vehículo para dilución de fármacos específicos o en hipocloremia documentada.
            </div>
          </div>

          {/* ALBÚMINA HUMANA 20% */}
          <div className="p-4 bg-slate-950 rounded-2xl border border-blue-500/40 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-bold uppercase">INDICACIÓN ULTRA ESPECÍFICA</span>
              <h4 className="font-bold text-white text-sm">Albúmina Humana al 20%</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Coloide natural hiperoncótico. Solo indicada en anasarca severa con hipoalbuminemia refractaria (&lt; 1.8 - 2.0 g/dL), hipotensión que no responde y colapso circulatorio efectivo.
              </p>
            </div>
            <div className="p-2 bg-blue-950/30 rounded-xl border border-blue-900/50 text-[10px] text-blue-200">
              💡 Dosis: 100 mL de albúmina 20% en 1-2 horas seguida de Furosemida 20 mg IV para movilizar tercer espacio.
            </div>
          </div>

          {/* COLOIDES SINTÉTICOS */}
          <div className="p-4 bg-slate-950 rounded-2xl border-2 border-rose-500/60 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold uppercase">PROHIBIDO / CONTRAINDICADO</span>
              <h4 className="font-bold text-white text-sm">Almidones &amp; Gelatinas</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Hidroxietilalmidón (HES), Voluven, Gelafundina. Altamente nefrotóxicos; se depositan en las células tubulares renales provocando nefrosis osmótica.
              </p>
            </div>
            <div className="p-2 bg-rose-950/40 rounded-xl border border-rose-900/60 text-[10px] text-rose-300 font-bold">
              🚫 Contraindicación absoluta: inducen falla renal aguda y agravan la disfunción plaquetaria en HELLP.
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 3: MANEJO DE LA OLIGURIA TRANSITORIA & RESCATE EAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PARADOJA DE LA OLIGURIA EN PREECLAMPSIA */}
        <div className="p-5 bg-slate-950 rounded-2xl border-2 border-amber-500/40 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h4 className="font-black text-white text-sm">
              La Paradoja de la Oliguria: ¿Por qué NO administrar bolos de líquidos?
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Cuando la enfermería o el médico observa una diuresis &lt; 25 mL/h, el impulso reflejo suele ser administrar un bolo de 500 mL de solución salina. <strong className="text-rose-400">¡ESTE ES EL ERROR MÁS COMÚN QUE LLEVA A EDEMA PULMONAR!</strong>
          </p>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
            <strong className="text-amber-300 block">Fisiopatología de la Oliguria Preeclámptica:</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              La oliguria está mediada por <strong>vasoespasmo arteriolar renal aferente y endoteliosis glomerular</strong>, NO por una deshidratación sistémica. Administrar bolos de líquidos no vencerá el vasoespasmo; simplemente se fugará a los alvéolos.
            </p>
            <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-emerald-200 text-[11px]">
              <strong>Conducta Correcta:</strong> Mantener la restricción a 60-80 mL/h, optimizar la presión arterial media (PAM 100-105 mmHg), verificar permeabilidad de sonda Foley y vigilar magnesemia. Si no hay elevación de creatinina, la oliguria revertirá espontáneamente con el posparto.
            </div>
          </div>
        </div>

        {/* PROTOCOLO DE RESCATE EN EDEMA AGUDO PULMONAR */}
        <div className="p-5 bg-slate-950 rounded-2xl border-2 border-rose-500/50 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400" />
            <h4 className="font-black text-white text-sm">
              Protocolo Inmediato de Rescate en Edema Agudo Pulmonar (EAP)
            </h4>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Si la paciente presenta disnea súbita, ortopnea, desaturación (&lt; 92%), taquipnea (&gt; 25 rpm) o estertores crepitantes bilaterales:
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-900/60 flex items-start gap-2">
              <span className="font-mono font-black text-rose-400">1.</span>
              <div>
                <strong className="text-white">Suspensión Total Inmediata de Cristaloides:</strong>
                <p className="text-[11px] text-slate-300">Cerrar todas las soluciones no esenciales. Mantener solo vía venosa permeable con bomba para MgSO₄ en concentración alta.</p>
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-900/60 flex items-start gap-2">
              <span className="font-mono font-black text-rose-400">2.</span>
              <div>
                <strong className="text-white">Posición Fisiológica &amp; Soporte Ventilatorio:</strong>
                <p className="text-[11px] text-slate-300">Sentar a 45° - 90° con piernas declives. Aplicar Oxigenoterapia de alto flujo o Ventilación No Invasiva (CPAP con PEEP 6-8 cmH2O).</p>
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-900/60 flex items-start gap-2">
              <span className="font-mono font-black text-rose-400">3.</span>
              <div>
                <strong className="text-white">Furosemida IV:</strong>
                <p className="text-[11px] text-slate-300">Bolo inicial de <strong>20 a 40 mg IV lento</strong> (1-2 ampollas). Si no hay respuesta a los 30 min, duplicar a 80 mg IV.</p>
              </div>
            </div>

            <div className="p-2.5 bg-rose-950/40 rounded-xl border border-rose-900/60 flex items-start gap-2">
              <span className="font-mono font-black text-rose-400">4.</span>
              <div>
                <strong className="text-white">Nitroglicerina IV (Venodilatador de Elección):</strong>
                <p className="text-[11px] text-slate-300">Infusión a 5 - 10 mcg/min, titulando cada 3-5 min hasta 50-100 mcg/min para reducir la precarga y presión capilar pulmonar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

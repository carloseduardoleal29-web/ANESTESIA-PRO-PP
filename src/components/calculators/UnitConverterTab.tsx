import React, { useState } from 'react';
import { 
  ArrowLeftRight, Percent, Gauge, Droplets, Sparkles, 
  HelpCircle, AlertTriangle, ShieldCheck, Scale, RefreshCw, Zap, Flame
} from 'lucide-react';
import { CleanNumberInput } from './CleanNumberInput';

interface UnitConverterTabProps {
  initialSubSection?: 'percent' | 'ratios' | 'dose' | 'pressure' | 'electrolytes';
}

export const UnitConverterTab: React.FC<UnitConverterTabProps> = ({ initialSubSection = 'percent' }) => {
  const [activeSubSection, setActiveSubSection] = useState<'percent' | 'ratios' | 'dose' | 'pressure' | 'electrolytes'>(initialSubSection);

  // Percentage state
  const [inputPercent, setInputPercent] = useState<number>(2); // 2%
  const [calcVolumeMl, setCalcVolumeMl] = useState<number>(20); // 20 ml ampoule

  // Ratio state
  const [ratioDenominator, setRatioDenominator] = useState<number>(200000); // 1:200,000

  // Dose converter state
  const [doseValue, setDoseValue] = useState<number>(0.1);
  const [doseFromUnit, setDoseFromUnit] = useState<'mcg_kg_min' | 'mcg_kg_h' | 'mg_kg_h' | 'mcg_min' | 'mg_h'>('mcg_kg_min');
  const [doseWeight, setDoseWeight] = useState<number>(70);

  // Pressure converter state
  const [pressureValue, setPressureValue] = useState<number>(760);
  const [pressureUnit, setPressureUnit] = useState<'mmHg' | 'kPa' | 'cmH2O' | 'PSI' | 'bar'>('mmHg');

  // Electrolyte states
  const [measuredCa, setMeasuredCa] = useState<number>(7.8); // mg/dL
  const [measuredAlbumin, setMeasuredAlbumin] = useState<number>(2.5); // g/dL

  const [currentNa, setCurrentNa] = useState<number>(122); // mEq/L
  const [targetNa, setTargetNa] = useState<number>(130); // mEq/L
  const [patientWeightNa, setPatientWeightNa] = useState<number>(70);
  const [genderNa, setGenderNa] = useState<'male' | 'female'>('male');

  const [currentHyperNa, setCurrentHyperNa] = useState<number>(158); // mEq/L
  const [weightHyperNa, setWeightHyperNa] = useState<number>(70);

  const [feNa_NaU, setFeNa_NaU] = useState<number>(15);
  const [feNa_CrP, setFeNa_CrP] = useState<number>(2.1);
  const [feNa_NaP, setFeNa_NaP] = useState<number>(138);
  const [feNa_CrU, setFeNa_CrU] = useState<number>(90);

  const [glucoseMgDl, setGlucoseMgDl] = useState<number>(180);

  // --- CALCULATIONS ---

  // 1. Percentage
  const mgPerMl = inputPercent * 10;
  const mcgPerMl = mgPerMl * 1000;
  const totalMgInAmpoule = mgPerMl * calcVolumeMl;

  // 2. Ratio 1:X
  const ratioMgPerMl = 1000 / ratioDenominator;
  const ratioMcgPerMl = 1000000 / ratioDenominator;

  // 3. Dose Conversion
  // Convert everything to base: mcg/min
  let baseMcgMin = 0;
  if (doseFromUnit === 'mcg_kg_min') baseMcgMin = doseValue * doseWeight;
  else if (doseFromUnit === 'mcg_kg_h') baseMcgMin = (doseValue * doseWeight) / 60;
  else if (doseFromUnit === 'mg_kg_h') baseMcgMin = (doseValue * 1000 * doseWeight) / 60;
  else if (doseFromUnit === 'mcg_min') baseMcgMin = doseValue;
  else if (doseFromUnit === 'mg_h') baseMcgMin = (doseValue * 1000) / 60;

  const convMcgKgMin = Number((baseMcgMin / doseWeight).toFixed(3));
  const convMcgKgHr = Number(((baseMcgMin * 60) / doseWeight).toFixed(2));
  const convMgKgHr = Number(((baseMcgMin * 60) / 1000 / doseWeight).toFixed(3));
  const convMcgMin = Number(baseMcgMin.toFixed(2));
  const convMgHr = Number(((baseMcgMin * 60) / 1000).toFixed(2));

  // 4. Pressure Conversion to mmHg
  let baseMmHg = 0;
  if (pressureUnit === 'mmHg') baseMmHg = pressureValue;
  else if (pressureUnit === 'kPa') baseMmHg = pressureValue * 7.50062;
  else if (pressureUnit === 'cmH2O') baseMmHg = pressureValue * 0.735559;
  else if (pressureUnit === 'PSI') baseMmHg = pressureValue * 51.7149;
  else if (pressureUnit === 'bar') baseMmHg = pressureValue * 750.062;

  const convMmHg = Number(baseMmHg.toFixed(1));
  const convKPa = Number((baseMmHg / 7.50062).toFixed(2));
  const convCmH2O = Number((baseMmHg / 0.735559).toFixed(1));
  const convPSI = Number((baseMmHg / 51.7149).toFixed(2));
  const convBar = Number((baseMmHg / 750.062).toFixed(3));

  // 5. Electrolyte formulas
  // Corrected Calcium = Measured Ca + 0.8 * (4.0 - Albumin)
  const correctedCalcium = Number((measuredCa + 0.8 * (4.0 - measuredAlbumin)).toFixed(2));

  // Sodium Deficit = TBW * (Target Na - Current Na)
  const tbw = patientWeightNa * (genderNa === 'male' ? 0.6 : 0.5);
  const sodiumDeficitMeq = Math.max(0, Math.round(tbw * (targetNa - currentNa)));
  // Volume of Saline 3% (513 mEq/L) needed
  const volumeSaline3PercentMl = Math.round((sodiumDeficitMeq / 513) * 1000);
  // Volume of Saline 0.9% (154 mEq/L) needed
  const volumeSaline09PercentMl = Math.round((sodiumDeficitMeq / 154) * 1000);

  // Free Water Deficit in Hypernatremia = TBW * ((Current Na / 140) - 1)
  const tbwHyper = weightHyperNa * 0.6;
  const freeWaterDeficitLiters = Number((tbwHyper * ((currentHyperNa / 140) - 1)).toFixed(2));

  // FeNa = (NaU * CrP) / (NaP * CrU) * 100
  const feNaResult = Number(((feNa_NaU * feNa_CrP) / (feNa_NaP * feNa_CrU) * 100).toFixed(2));

  // Glucose mmol/L
  const glucoseMmolL = Number((glucoseMgDl / 18.018).toFixed(2));

  return (
    <div className="space-y-6">
      {/* HEADER & SUBSECTION NAV */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Conversor Universal de Unidades Médicas</h3>
            <p className="text-xs text-slate-400">Porcentajes, ratios de dilución, dosis complejas, gases y corrección electrolítica.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubSection('percent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'percent' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            % ➔ mg/ml
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('ratios')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'ratios' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratios 1:X
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('dose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'dose' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dosis
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('pressure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'pressure' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Presión & Gases
          </button>
          <button
            type="button"
            onClick={() => setActiveSubSection('electrolytes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubSection === 'electrolytes' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Electrolitos & Ca
          </button>
        </div>
      </div>

      {/* 1. PERCENTAGE CONVERTER */}
      {activeSubSection === 'percent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Percent className="w-4 h-4 text-indigo-400" />
              Concentración Porcentual (%) a mg/ml y µg/ml
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Porcentaje de la Solución (%)</label>
                <CleanNumberInput
                  step={0.1}
                  min={0.01}
                  max={100}
                  value={inputPercent}
                  onChange={setInputPercent}
                  suffix="%"
                />
              </div>

              {/* QUICK PERCENT BUTTONS */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Fármacos Comunes en Anestesia:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setInputPercent(0.5); setCalcVolumeMl(20); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Bupi 0.5%
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputPercent(0.75); setCalcVolumeMl(4); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Bupi Pesada 0.75%
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputPercent(1); setCalcVolumeMl(20); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Lido 1% / Propofol 1%
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputPercent(2); setCalcVolumeMl(20); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Lidocaína 2%
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputPercent(50); setCalcVolumeMl(20); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Dextrosa 50%
                  </button>
                  <button
                    type="button"
                    onClick={() => { setInputPercent(8.4); setCalcVolumeMl(10); }}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                  >
                    Bicarbonato 8.4% (1mEq/ml)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Volumen de la Ampolla / Frasco (ml)</label>
                <CleanNumberInput
                  min={1}
                  max={2000}
                  step={1}
                  value={calcVolumeMl}
                  onChange={setCalcVolumeMl}
                  suffix="ml"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-indigo-400 tracking-wider block border-b border-slate-800 pb-2">
              Equivalencias de Concentración al {inputPercent}%
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Miligramos por ml</span>
                <div className="text-3xl font-black text-indigo-400 font-mono">
                  {mgPerMl} <span className="text-sm font-sans font-bold text-slate-300">mg/ml</span>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-indigo-500/30 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Microgramos por ml</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {mcgPerMl.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-300">µg/ml</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total en Ampolla ({calcVolumeMl} ml)</span>
                <div className="text-xl font-bold text-white font-mono">{totalMgInAmpoule} mg totales</div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">{(totalMgInAmpoule * 1000).toLocaleString()} µg</span>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200">
              <strong className="block text-indigo-300 mb-0.5">Regla de Oro en Anestesiología:</strong>
              Para convertir <strong>% a mg/ml</strong>, simplemente <strong>multiplica el porcentaje por 10</strong> (Ej: 2% × 10 = 20 mg/ml; 0.5% × 10 = 5 mg/ml).
            </div>
          </div>
        </div>
      )}

      {/* 2. RATIOS 1:X (EPINEPHRINE) */}
      {activeSubSection === 'ratios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Conversor de Proporciones y Ratios (1:X)
            </h4>
            <p className="text-xs text-slate-400">
              Utilizado frecuentemente en Adrenalina / Epinefrina como vasoconstrictor o reanimación.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Denominador del Ratio (1 : X)</label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black text-white font-mono shrink-0">1 :</span>
                  <div className="flex-1">
                    <CleanNumberInput
                      min={100}
                      max={1000000}
                      step={1000}
                      value={ratioDenominator}
                      onChange={setRatioDenominator}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Ratios Clínicos Típicos:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRatioDenominator(1000)}
                    className="p-2 rounded-xl text-left bg-slate-950 border border-slate-800 hover:border-amber-400 text-xs text-slate-300 cursor-pointer"
                  >
                    <strong>1:1,000</strong> (1 mg/ml)
                    <span className="block text-[9px] text-slate-400">Anafilaxia IM / Ampolla pura</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatioDenominator(10000)}
                    className="p-2 rounded-xl text-left bg-slate-950 border border-slate-800 hover:border-amber-400 text-xs text-slate-300 cursor-pointer"
                  >
                    <strong>1:10,000</strong> (100 µg/ml)
                    <span className="block text-[9px] text-slate-400">RCP / Paro cardíaco IV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatioDenominator(100000)}
                    className="p-2 rounded-xl text-left bg-slate-950 border border-slate-800 hover:border-amber-400 text-xs text-slate-300 cursor-pointer"
                  >
                    <strong>1:100,000</strong> (10 µg/ml)
                    <span className="block text-[9px] text-slate-400">Infiltración odontológica / plástica</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRatioDenominator(200000)}
                    className="p-2 rounded-xl text-left bg-slate-950 border border-slate-800 hover:border-amber-400 text-xs text-slate-300 cursor-pointer"
                  >
                    <strong>1:200,000</strong> (5 µg/ml)
                    <span className="block text-[9px] text-slate-400">Anestésicos locales con Epi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider block border-b border-slate-800 pb-2">
              Concentración Resultante para 1:{ratioDenominator.toLocaleString()}
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Microgramos por ml</span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {ratioMcgPerMl} <span className="text-sm font-sans font-bold text-slate-300">µg/ml</span>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Miligramos por ml</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {ratioMgPerMl} <span className="text-sm font-sans font-bold text-slate-300">mg/ml</span>
                </div>
              </div>
            </div>

            {ratioDenominator === 10000 ? (
              <div className="bg-slate-950/90 border border-rose-500/40 rounded-xl p-3.5 text-xs text-slate-300 space-y-2">
                <span className="text-[11px] font-black text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" /> Cómo preparar Adrenalina 1:10,000 (100 µg/ml) para Paro / PCR:
                </span>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  1. Cargar <strong>1 ampolla de Adrenalina 1:1,000 (1 mg = 1 ml)</strong> en jeringa de 10 ml.<br/>
                  2. Completar con <strong>9 ml de Solución Salina al 0.9%</strong>.<br/>
                  3. Total = <strong>10 ml al 1:10,000 (100 µg/ml = 0.1 mg/ml)</strong>.<br/>
                  ⚡ Dosis pediátrica PCR: <strong>0.1 ml/kg IV/IO</strong> (10 µg/kg). Adultos: <strong>10 ml IV (1 mg)</strong> cada 3-5 min.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Cómo preparar Adrenalina 1:200,000 en quirófano:</span>
                <p className="text-[11px] text-slate-300">
                  Toma <strong>0.1 ml (100 µg)</strong> de Adrenalina 1:1000 con jeringa de tuberculina y agrégalo a <strong>20 ml</strong> de anestésico local (Lidocaína o Bupivacaína). Concentración resultante = <strong>5 µg/ml (1:200,000)</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. DOSE CONVERTER */}
      {activeSubSection === 'dose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              Conversor Multidimensional de Dosis
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Valor de la Dosis</label>
                  <CleanNumberInput
                    step={0.01}
                    min={0}
                    value={doseValue}
                    onChange={setDoseValue}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Peso Paciente (kg)</label>
                  <CleanNumberInput
                    min={1}
                    max={300}
                    value={doseWeight}
                    onChange={setDoseWeight}
                    suffix="kg"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Unidad de Origen</label>
                <select
                  value={doseFromUnit}
                  onChange={(e) => setDoseFromUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="mcg_kg_min">µg/kg/min (ej: Noradrenalina, Remifentanilo)</option>
                  <option value="mcg_kg_h">µg/kg/h (ej: Fentanilo, Dexmedetomidina)</option>
                  <option value="mg_kg_h">mg/kg/h (ej: Propofol, Midazolam, Lidocaína)</option>
                  <option value="mcg_min">µg/min (ej: Nitroglicerina fija)</option>
                  <option value="mg_h">mg/h (ej: Morfina, Labetalol)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block border-b border-slate-800 pb-2">
              Equivalencias Simultáneas ({doseWeight} kg)
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">µg/kg/min</span>
                <strong className="text-lg font-mono text-cyan-300">{convMcgKgMin}</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">µg/kg/h</span>
                <strong className="text-lg font-mono text-white">{convMcgKgHr}</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">mg/kg/h</span>
                <strong className="text-lg font-mono text-amber-300">{convMgKgHr}</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">µg/min totales</span>
                <strong className="text-lg font-mono text-emerald-400">{convMcgMin}</strong>
              </div>

              <div className="col-span-2 bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">mg/hora totales entregados:</span>
                <strong className="text-xl font-mono text-rose-300">{convMgHr} mg/h</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRESSURE & GASES */}
      {activeSubSection === 'pressure' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              Presión en Vía Aérea, Gases y Balones
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Valor de Presión</label>
                  <CleanNumberInput
                    step={1}
                    value={pressureValue}
                    onChange={setPressureValue}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Unidad</label>
                  <select
                    value={pressureUnit}
                    onChange={(e) => setPressureUnit(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="mmHg">mmHg / Torr (Gases arteriales / PAM)</option>
                    <option value="cmH2O">cmH2O (Presión Plateau / PEEP / Tubo endotraqueal)</option>
                    <option value="kPa">kPa (Kilopascales - Europa/Reino Unido)</option>
                    <option value="PSI">PSI (Libras por pulg² - Balones de O2)</option>
                    <option value="bar">bar (Atmósferas / Red central de gases)</option>
                  </select>
                </div>
              </div>

              {/* QUICK PRESETS */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setPressureValue(25); setPressureUnit('cmH2O'); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Manguito TOT seguro (25 cmH2O)
                </button>
                <button
                  type="button"
                  onClick={() => { setPressureValue(30); setPressureUnit('cmH2O'); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Límite P. Plateau (30 cmH2O)
                </button>
                <button
                  type="button"
                  onClick={() => { setPressureValue(2000); setPressureUnit('PSI'); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  Balón O2 Lleno (2000 PSI)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block border-b border-slate-800 pb-2">
              Tabla de Conversión Universal de Presión
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Milímetros de Mercurio</span>
                <strong className="text-xl font-mono text-emerald-400">{convMmHg} mmHg</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Centímetros de Agua</span>
                <strong className="text-xl font-mono text-cyan-300">{convCmH2O} cmH2O</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Kilopascales</span>
                <strong className="text-xl font-mono text-amber-300">{convKPa} kPa</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">PSI / Libras</span>
                <strong className="text-xl font-mono text-white">{convPSI} PSI</strong>
              </div>

              <div className="col-span-2 bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bares / Atmósferas:</span>
                <strong className="text-xl font-mono text-rose-300">{convBar} bar</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ELECTROLYTES & CORRECTIONS */}
      {activeSubSection === 'electrolytes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* CALCIUM CORRECTION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Calcio Corregido por Albúmina
            </h4>
            <p className="text-xs text-slate-400">
              En hipoalbuminemia crítica, el calcio sérico total está falsamente disminuido.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Calcio Medido (mg/dL)</label>
                <CleanNumberInput
                  step={0.1}
                  min={0}
                  max={20}
                  value={measuredCa}
                  onChange={setMeasuredCa}
                  suffix="mg/dL"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Albúmina Sérica (g/dL)</label>
                <CleanNumberInput
                  step={0.1}
                  min={0.5}
                  max={6}
                  value={measuredAlbumin}
                  onChange={setMeasuredAlbumin}
                  suffix="g/dL"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Calcio Corregido Real</span>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {correctedCalcium} <span className="text-xs text-slate-400 font-sans">mg/dL</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                correctedCalcium < 8.5 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                correctedCalcium > 10.5 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {correctedCalcium < 8.5 ? 'Hipocalcemia' : correctedCalcium > 10.5 ? 'Hipercalcemia' : 'Normocalcemia'}
              </span>
            </div>
          </div>

          {/* SODIUM DEFICIT IN HYPONATREMIA */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-rose-400" />
              Déficit de Sodio (Hiponatremia)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Sodio Actual (mEq/L)</label>
                <CleanNumberInput
                  step={1}
                  min={80}
                  max={180}
                  value={currentNa}
                  onChange={setCurrentNa}
                  suffix="mEq/L"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Sodio Meta (mEq/L)</label>
                <CleanNumberInput
                  step={1}
                  min={100}
                  max={150}
                  value={targetNa}
                  onChange={setTargetNa}
                  suffix="mEq/L"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Peso (kg)</label>
                <CleanNumberInput
                  min={10}
                  max={250}
                  value={patientWeightNa}
                  onChange={setPatientWeightNa}
                  suffix="kg"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Sexo</label>
                <select
                  value={genderNa}
                  onChange={(e) => setGenderNa(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="male">Masculino (ACT 60%)</option>
                  <option value="female">Femenino (ACT 50%)</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Déficit Total de Sodio:</span>
                <strong className="text-xl font-black text-rose-400 font-mono">{sodiumDeficitMeq} mEq</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
                <div>Salino 3% (513 mEq/L): <strong className="text-cyan-300 font-mono">{volumeSaline3PercentMl} ml</strong></div>
                <div>Salino 0.9% (154 mEq/L): <strong className="text-cyan-300 font-mono">{volumeSaline09PercentMl} ml</strong></div>
              </div>
              <p className="text-[10px] text-amber-300">
                ⚠ Corrección máxima: <strong>8-10 mEq/L en 24h</strong> para prevenir Mielinólisis Pontina Central.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

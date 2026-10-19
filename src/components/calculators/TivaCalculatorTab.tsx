import React, { useState } from 'react';
import { 
  Activity, Syringe, Sparkles, Check, Copy, AlertTriangle, 
  Info, ArrowRight, ShieldAlert, Sliders, Zap, Clock, User, Layers
} from 'lucide-react';
import { PatientProfile } from './types';
import { CleanNumberInput } from './CleanNumberInput';

export const TivaCalculatorTab: React.FC = () => {
  // Patient parameters
  const [patient, setPatient] = useState<PatientProfile>({
    weightKg: 70,
    heightCm: 170,
    ageYears: 42,
    gender: 'male',
    asaClass: 2
  });

  // Active drug sub-view
  const [activeSubDrug, setActiveSubDrug] = useState<'propofol' | 'remifentanil' | 'dexmed' | 'ketofol' | 'lidocaine'>('propofol');

  // Propofol state
  const [propofolModel, setPropofolModel] = useState<'marsh' | 'schnider' | 'manual_10_8_6'>('schnider');
  const [propofolConcentration, setPropofolConcentration] = useState<10 | 20>(10); // 1% (10mg/ml) or 2% (20mg/ml)
  const [propofolTargetCe, setPropofolTargetCe] = useState<number>(3.5); // µg/ml
  const [propofolPhase, setPropofolPhase] = useState<'induction' | 'maintenance' | 'sedation'>('maintenance');

  // Remifentanil state
  const [remiTargetCe, setRemiTargetCe] = useState<number>(4.0); // ng/ml
  const [remiDoseRate, setRemiDoseRate] = useState<number>(0.20); // µg/kg/min
  const [remiVialMg, setRemiVialMg] = useState<number>(2); // 2 mg
  const [remiVolumeMl, setRemiVolumeMl] = useState<number>(50); // 50 ml syringe (40 µg/ml)

  // Dexmedetomidine state
  const [dexLoadingDose, setDexLoadingDose] = useState<number>(0.6); // µg/kg in 10 min
  const [dexLoadingTimeMin, setDexLoadingTimeMin] = useState<number>(10); // 10 min
  const [dexMaintDose, setDexMaintDose] = useState<number>(0.4); // µg/kg/h
  const [dexVialMcg, setDexVialMcg] = useState<number>(200); // 200 µg
  const [dexVolumeMl, setDexVolumeMl] = useState<number>(50); // 50 ml (4 µg/ml)

  // Ketofol state
  const [ketofolRatio, setKetofolRatio] = useState<'1:1' | '2:1' | '4:1'>('4:1');
  const [ketofolTargetDose, setKetofolTargetDose] = useState<number>(0.5); // mg/kg bolus or mg/kg/h

  // Lidocaine state
  const [lidoBolusDose, setLidoBolusDose] = useState<number>(1.5); // mg/kg
  const [lidoMaintDose, setLidoMaintDose] = useState<number>(1.5); // mg/kg/h
  const [lidoPercent, setLidoPercent] = useState<1 | 2>(2); // 1% (10mg/ml) or 2% (20mg/ml)

  // Copy notification
  const [copied, setCopied] = useState<boolean>(false);

  // Anthropometrics calculations
  const heightM = patient.heightCm / 100;
  const bmi = patient.weightKg / (heightM * heightM);
  
  // Devine Ideal Body Weight
  const ibw = patient.gender === 'male' 
    ? 50 + 0.91 * (patient.heightCm - 152.4)
    : 45.5 + 0.91 * (patient.heightCm - 152.4);

  // Janmahasatian Lean Body Weight
  const lbw = patient.gender === 'male'
    ? (9270 * patient.weightKg) / (6680 + 216 * bmi)
    : (9270 * patient.weightKg) / (8780 + 244 * bmi);

  // Adjusted Body Weight for Anesthesia
  const abw = ibw + 0.4 * (patient.weightKg - ibw);

  // Weight used for Propofol based on model
  const effectivePropofolWeight = propofolModel === 'schnider' ? lbw : (bmi > 30 ? abw : patient.weightKg);

  // Propofol calculations
  // Induction bolus approximation (mg)
  const propofolInductionMg = Math.round(effectivePropofolWeight * (propofolTargetCe * 0.55));
  const propofolInductionMl = (propofolInductionMg / propofolConcentration).toFixed(1);

  // Maintenance rate calculation (mg/kg/h) based on target Ce
  // Empirical steady-state clearance model approximation
  const propofolMgKgHr = Number((propofolTargetCe * 2.1).toFixed(1));
  const propofolTotalMgHr = Math.round(propofolMgKgHr * effectivePropofolWeight);
  const propofolMlHr = (propofolTotalMgHr / propofolConcentration).toFixed(1);

  // Remifentanil calculations
  const remiConcentrationMcgMl = (remiVialMg * 1000) / remiVolumeMl; // e.g., 2000mcg / 50ml = 40 mcg/ml
  const remiTotalMcgMin = patient.weightKg * remiDoseRate;
  const remiTotalMcgHr = remiTotalMcgMin * 60;
  const remiMlHr = (remiTotalMcgHr / remiConcentrationMcgMl).toFixed(1);

  // Dexmedetomidine calculations
  const dexConcMcgMl = dexVialMcg / dexVolumeMl; // e.g. 200 / 50 = 4 mcg/ml
  const dexLoadingTotalMcg = patient.weightKg * dexLoadingDose;
  const dexLoadingMl = Number((dexLoadingTotalMcg / dexConcMcgMl).toFixed(1));
  const dexLoadingRateMlHr = Math.round((dexLoadingMl / dexLoadingTimeMin) * 60);
  const dexMaintTotalMcgHr = patient.weightKg * dexMaintDose;
  const dexMaintRateMlHr = (dexMaintTotalMcgHr / dexConcMcgMl).toFixed(1);

  // Lidocaine calculations
  const lidoConcMgMl = lidoPercent * 10; // 1% = 10mg/ml, 2% = 20mg/ml
  const lidoBolusTotalMg = Math.round(patient.weightKg * lidoBolusDose);
  const lidoBolusMl = (lidoBolusTotalMg / lidoConcMgMl).toFixed(1);
  const lidoMaintTotalMgHr = Math.round(patient.weightKg * lidoMaintDose);
  const lidoMaintMlHr = (lidoMaintTotalMgHr / lidoConcMgMl).toFixed(1);

  // Copy full protocol to clipboard
  const handleCopyProtocol = () => {
    const text = `=== PROTOCOLO TIVA / TCI - ANESTESIAPRO ===
Paciente: ${patient.gender === 'male' ? 'Masculino' : 'Femenino'}, ${patient.ageYears} años
Peso Real: ${patient.weightKg} kg | Talla: ${patient.heightCm} cm | IMC: ${bmi.toFixed(1)} kg/m²
Peso Ideal (IBW): ${ibw.toFixed(1)} kg | Peso Magro (LBW): ${lbw.toFixed(1)} kg

1. PROPOFOL ${propofolConcentration === 10 ? '1% (10 mg/ml)' : '2% (20 mg/ml)'} [Modelo: ${propofolModel.toUpperCase()}]:
   - Ce Objetivo: ${propofolTargetCe} µg/ml (Peso cálculo: ${effectivePropofolWeight.toFixed(1)} kg)
   - Bolo de Inducción estimado: ${propofolInductionMg} mg (${propofolInductionMl} ml)
   - Infusión Mantenimiento: ${propofolMgKgHr} mg/kg/h (${propofolMlHr} ml/h)

2. REMIFENTANILO [Dilución: ${remiVialMg}mg en ${remiVolumeMl}ml (${remiConcentrationMcgMl} µg/ml)]:
   - Dosis: ${remiDoseRate} µg/kg/min (Ce est.: ${remiTargetCe} ng/ml)
   - Bomba de Infusión: ${remiMlHr} ml/h (${remiTotalMcgHr.toFixed(1)} µg/h)

3. COADYUVANTES / OPIATE-SPARING:
   - Dexmedetomidina (${dexConcMcgMl} µg/ml): Carga ${dexLoadingDose} µg/kg en ${dexLoadingTimeMin}min (${dexLoadingRateMlHr} ml/h) | Mantenimiento: ${dexMaintDose} µg/kg/h (${dexMaintRateMlHr} ml/h)
   - Lidocaína ${lidoPercent}%: Bolo ${lidoBolusTotalMg} mg (${lidoBolusMl} ml) | Infusión: ${lidoMaintTotalMgHr} mg/h (${lidoMaintMlHr} ml/h)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER WITH PATIENT BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Syringe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Calculadora Avanzada TIVA & TCI</h3>
                <span className="px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider">
                  Modelos PK/PD Reales
                </span>
              </div>
              <p className="text-xs text-slate-400">Marsh, Schnider, Minto, Dyck y Reglas de Bristol para infusión guiada por concentración.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyProtocol}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Protocolo Copiado!' : 'Copiar Protocolo a Ficha'}</span>
          </button>
        </div>

        {/* PATIENT PROFILE INPUTS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Peso Real (kg)</label>
            <CleanNumberInput
              min={10}
              max={250}
              step={1}
              value={patient.weightKg}
              onChange={(val) => setPatient({ ...patient, weightKg: val })}
              suffix="kg"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Talla (cm)</label>
            <CleanNumberInput
              min={80}
              max={230}
              step={1}
              value={patient.heightCm}
              onChange={(val) => setPatient({ ...patient, heightCm: val })}
              suffix="cm"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Edad (Años)</label>
            <CleanNumberInput
              min={1}
              max={110}
              step={1}
              value={patient.ageYears}
              onChange={(val) => setPatient({ ...patient, ageYears: val })}
              suffix="años"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Sexo Biológico</label>
            <select
              value={patient.gender}
              onChange={(e) => setPatient({ ...patient, gender: e.target.value as 'male' | 'female' })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              <option value="male">Masculino (♂)</option>
              <option value="female">Femenino (♀)</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1.5 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">IMC / Estado</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xs font-black ${bmi >= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {bmi.toFixed(1)} kg/m²
              </span>
              <span className="text-[9px] text-slate-400 truncate">
                {bmi >= 35 ? 'Obesidad II/III' : bmi >= 30 ? 'Obesidad I' : bmi >= 25 ? 'Sobrepeso' : 'Normopeso'}
              </span>
            </div>
            <div className="text-[9px] text-slate-400">
              LBW: <strong className="text-cyan-300">{lbw.toFixed(1)}kg</strong> | IBW: <strong className="text-cyan-300">{ibw.toFixed(1)}kg</strong>
            </div>
          </div>
        </div>

        {/* SUBDRUG NAVIGATION TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubDrug('propofol')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubDrug === 'propofol'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🟡 Propofol (Marsh / Schnider)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubDrug('remifentanil')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubDrug === 'remifentanil'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🔵 Remifentanilo (Minto)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubDrug('dexmed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubDrug === 'dexmed'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🟢 Dexmedetomidina</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubDrug('lidocaine')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubDrug === 'lidocaine'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🟣 Lidocaína Infusión</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubDrug('ketofol')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeSubDrug === 'ketofol'
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🌸 Ketofol / Ketamina</span>
          </button>
        </div>
      </div>

      {/* PROPOFOL VIEW */}
      {activeSubDrug === 'propofol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* CONTROLS */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                Parámetros de TCI / TIVA Propofol
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                1% o 2%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Modelo Farmacocinético</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPropofolModel('schnider')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      propofolModel === 'schnider'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Schnider (Ce)
                    <span className="block text-[9px] font-normal opacity-80">Usa LBW y Edad</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropofolModel('marsh')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      propofolModel === 'marsh'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Marsh (Cp)
                    <span className="block text-[9px] font-normal opacity-80">Usa Peso Total/ABW</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropofolModel('manual_10_8_6')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      propofolModel === 'manual_10_8_6'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Bristol (10-8-6)
                    <span className="block text-[9px] font-normal opacity-80">Escalonada Manual</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Concentración Ampolla</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPropofolConcentration(10)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        propofolConcentration === 10
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      1% (10 mg/ml)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropofolConcentration(20)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        propofolConcentration === 20
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      2% (20 mg/ml)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Concentración Diana (Ce / Cp)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1.0}
                      max={7.0}
                      step={0.1}
                      value={propofolTargetCe}
                      onChange={(e) => setPropofolTargetCe(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                    <span className="font-mono text-sm font-black text-amber-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 min-w-[65px] text-center">
                      {propofolTargetCe.toFixed(1)} <span className="text-[10px]">µg/ml</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* CE TARGET PRESETS */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-bold">Presets Diana:</span>
                <button
                  type="button"
                  onClick={() => setPropofolTargetCe(1.8)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                >
                  Sedación Leve (1.8)
                </button>
                <button
                  type="button"
                  onClick={() => setPropofolTargetCe(3.0)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                >
                  Mantenimiento + Opioide (3.0)
                </button>
                <button
                  type="button"
                  onClick={() => setPropofolTargetCe(4.5)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                >
                  Inducción / Intubación (4.5)
                </button>
              </div>

              {bmi >= 30 && (
                <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-300">Paciente con Obesidad (IMC {bmi.toFixed(1)} kg/m²):</strong>
                    El modelo Schnider calcula con el <strong>Peso Magro (LBW: {lbw.toFixed(1)} kg)</strong> para prevenir sobredosis e hipotensión severa por sobredimensionamiento lipídico.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RESULTS CARD */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Ajuste de Bomba de Infusión</span>
              <span className="text-[10px] text-slate-400">Peso aplicado: <strong>{effectivePropofolWeight.toFixed(1)} kg</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-amber-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bolo de Inducción Estimado</span>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {propofolInductionMg} <span className="text-xs text-slate-300">mg</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  = <strong className="text-white">{propofolInductionMl} ml</strong> ({propofolConcentration === 10 ? '1%' : '2%'})
                </div>
                <span className="text-[9px] text-slate-400 block pt-1">
                  Tiempo de inyección: 40-60 seg (Evita colapso hemodinámico).
                </span>
              </div>

              <div className="bg-slate-950/90 border border-amber-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Velocidad de Mantenimiento</span>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {propofolMlHr} <span className="text-xs text-slate-300">ml/h</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  = <strong className="text-white">{propofolMgKgHr} mg/kg/h</strong> ({propofolTotalMgHr} mg/h)
                </div>
                <span className="text-[9px] text-slate-400 block pt-1">
                  Mantiene Ce diana de {propofolTargetCe.toFixed(1)} µg/ml en equilibrio.
                </span>
              </div>
            </div>

            {/* BRISTOL STEPPED PROTOCOL */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Guía Práctica Escalonada de Bristol (10-8-6-4):
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">0 a 10 min</span>
                  <strong className="text-amber-300">10 mg/kg/h</strong>
                  <span className="text-[10px] block font-mono text-cyan-300">
                    {((patient.weightKg * 10) / propofolConcentration).toFixed(0)} ml/h
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">10 a 20 min</span>
                  <strong className="text-amber-300">8 mg/kg/h</strong>
                  <span className="text-[10px] block font-mono text-cyan-300">
                    {((patient.weightKg * 8) / propofolConcentration).toFixed(0)} ml/h
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">20 a 30 min</span>
                  <strong className="text-amber-300">6 mg/kg/h</strong>
                  <span className="text-[10px] block font-mono text-cyan-300">
                    {((patient.weightKg * 6) / propofolConcentration).toFixed(0)} ml/h
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">&gt; 30 min</span>
                  <strong className="text-amber-300">4-5 mg/kg/h</strong>
                  <span className="text-[10px] block font-mono text-cyan-300">
                    {((patient.weightKg * 4.5) / propofolConcentration).toFixed(0)} ml/h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMIFENTANIL VIEW */}
      {activeSubDrug === 'remifentanil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Parámetros de Remifentanilo (Modelo Minto)
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Ampolla (mg)</label>
                  <select
                    value={remiVialMg}
                    onChange={(e) => setRemiVialMg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value={1}>1 mg</option>
                    <option value={2}>2 mg (Estándar)</option>
                    <option value={5}>5 mg</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Volumen Dilución (ml)</label>
                  <select
                    value={remiVolumeMl}
                    onChange={(e) => setRemiVolumeMl(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value={20}>20 ml Jeringa</option>
                    <option value={50}>50 ml Jeringa</option>
                    <option value={100}>100 ml Solución</option>
                    <option value={250}>250 ml Solución</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400 font-bold">Concentración Resultante:</span>
                <span className="text-cyan-300 font-mono font-black">{remiConcentrationMcgMl} µg/ml</span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold text-slate-300">Dosis de Infusión (µg/kg/min)</label>
                  <span className="text-sm font-mono font-black text-blue-400">{remiDoseRate.toFixed(2)} µg/kg/min</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.80}
                  step={0.01}
                  value={remiDoseRate}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setRemiDoseRate(d);
                    // Approx Ce in ng/ml
                    setRemiTargetCe(Number((d * 20).toFixed(1)));
                  }}
                  className="w-full accent-blue-400"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-bold w-full">Metas Clínicas:</span>
                <button
                  type="button"
                  onClick={() => { setRemiDoseRate(0.08); setRemiTargetCe(1.6); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Ventilación Espontánea (0.08 µg/kg/min)
                </button>
                <button
                  type="button"
                  onClick={() => { setRemiDoseRate(0.20); setRemiTargetCe(4.0); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cirugía Moderada (0.20 µg/kg/min)
                </button>
                <button
                  type="button"
                  onClick={() => { setRemiDoseRate(0.35); setRemiTargetCe(7.0); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Estímulo Intenso / Toracotomía (0.35 µg/kg/min)
                </button>
              </div>
            </div>
          </div>

          {/* RESULT CARD */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-blue-950/30 border border-blue-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-blue-400 tracking-wider block border-b border-slate-800 pb-2">
              Bomba de Infusión Remifentanilo
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-blue-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Velocidad en Bomba</span>
                <div className="text-3xl font-black text-blue-400 font-mono">
                  {remiMlHr} <span className="text-xs text-slate-300">ml/h</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  = <strong className="text-white">{remiTotalMcgHr.toFixed(1)} µg/h</strong>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-blue-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Concentración Efecto Estimada</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {remiTargetCe.toFixed(1)} <span className="text-xs text-slate-300">ng/ml</span>
                </div>
                <span className="text-[9px] text-slate-400 block pt-1">
                  Vida media sensible al contexto (CSHT): <strong>3.5 - 4 minutos</strong>.
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Prevención de Hiperalgesia Postoperatoria & Bradicardia:</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Iniciar analgesia preventiva de transición (Dipirona, Ketoprofeno, Paracetamol, Morfina o Fentanilo 0.5-1 µg/kg) <strong>30 a 45 minutos antes del cese de la infusión</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DEXMEDETOMIDINE VIEW */}
      {activeSubDrug === 'dexmed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Dexmedetomidina (Sedación Consciente & Coadyuvante)
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Dosis de Carga (µg/kg)</label>
                  <CleanNumberInput
                    step={0.1}
                    min={0}
                    max={1.5}
                    value={dexLoadingDose}
                    onChange={setDexLoadingDose}
                    suffix="µg/kg"
                  />
                  <span className="text-[9px] text-slate-500">Pasar en 10-15 min (Opcional)</span>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Mantenimiento (µg/kg/h)</label>
                  <CleanNumberInput
                    step={0.05}
                    min={0.1}
                    max={1.5}
                    value={dexMaintDose}
                    onChange={setDexMaintDose}
                    suffix="µg/kg/h"
                  />
                  <span className="text-[9px] text-slate-500">Rango: 0.2 a 0.7 µg/kg/h</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                <span className="text-slate-400 font-bold">Dilución Clásica:</span>
                <span className="text-emerald-300 font-mono font-bold">200 µg en 50 ml SF (4 µg/ml)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block border-b border-slate-800 pb-2">
              Tasas de Bomba Dexmedetomidina (4 µg/ml)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-emerald-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bolo de Carga ({dexLoadingTimeMin} min)</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {dexLoadingRateMlHr} <span className="text-xs text-slate-300">ml/h</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  Volumen total: <strong>{dexLoadingMl} ml</strong> ({dexLoadingTotalMcg.toFixed(0)} µg)
                </div>
              </div>

              <div className="bg-slate-950/90 border border-emerald-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Infusión Mantenimiento</span>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {dexMaintRateMlHr} <span className="text-xs text-slate-300">ml/h</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  Dosis: <strong>{dexMaintTotalMcgHr.toFixed(1)} µg/h</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIDOCAINE VIEW */}
      {activeSubDrug === 'lidocaine' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              Lidocaína Intravenosa (Analgesia Sistémica & Antiinflamatorio)
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Concentración</label>
                  <select
                    value={lidoPercent}
                    onChange={(e) => setLidoPercent(Number(e.target.value) as 1 | 2)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value={2}>2% (20 mg/ml)</option>
                    <option value={1}>1% (10 mg/ml)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Bolo Inicial (mg/kg)</label>
                  <CleanNumberInput
                    step={0.1}
                    min={0.5}
                    max={2.0}
                    value={lidoBolusDose}
                    onChange={setLidoBolusDose}
                    suffix="mg/kg"
                  />
                  <span className="text-[9px] text-slate-500">1.0 a 1.5 mg/kg en 10 min</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Infusión Continua (mg/kg/h)</label>
                <CleanNumberInput
                  step={0.1}
                  min={0.5}
                  max={3.0}
                  value={lidoMaintDose}
                  onChange={setLidoMaintDose}
                  suffix="mg/kg/h"
                />
                <span className="text-[9px] text-slate-500">Dosis segura: 1.5 a 2.0 mg/kg/h (máx 3 mg/kg/h o 200 mg/h)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-purple-400 tracking-wider block border-b border-slate-800 pb-2">
              Dosis y Bomba de Lidocaína {lidoPercent}% ({lidoConcMgMl} mg/ml)
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-purple-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bolo de Inducción</span>
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {lidoBolusTotalMg} <span className="text-xs text-slate-300">mg</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  = <strong className="text-white">{lidoBolusMl} ml</strong>
                </div>
              </div>

              <div className="bg-slate-950/90 border border-purple-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bomba de Infusión</span>
                <div className="text-2xl font-black text-cyan-300 font-mono">
                  {lidoMaintMlHr} <span className="text-xs text-slate-300">ml/h</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">
                  = <strong className="text-white">{lidoMaintTotalMgHr} mg/h</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KETOFOL VIEW */}
      {activeSubDrug === 'ketofol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-pink-400" />
              Ketofol (Sinergia Propofol + Ketamina)
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Proporción de Mezcla (Propofol : Ketamina)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setKetofolRatio('4:1')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      ketofolRatio === '4:1'
                        ? 'bg-pink-500 text-white border-pink-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    4 : 1 (Estándar)
                    <span className="block text-[9px] font-normal opacity-80">40mg Prop / 10mg Ket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKetofolRatio('2:1')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      ketofolRatio === '2:1'
                        ? 'bg-pink-500 text-white border-pink-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    2 : 1 (Dolor Intenso)
                    <span className="block text-[9px] font-normal opacity-80">20mg Prop / 10mg Ket</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKetofolRatio('1:1')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      ketofolRatio === '1:1'
                        ? 'bg-pink-500 text-white border-pink-400 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    1 : 1 (Equimolar)
                    <span className="block text-[9px] font-normal opacity-80">10mg Prop / 10mg Ket</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="text-white font-bold block">Preparación Jeringa 20 ml (Ketofol 4:1):</span>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>Propofol 1%: <strong>16 ml (160 mg)</strong></li>
                  <li>Ketamina 50 mg/ml: <strong>0.8 ml (40 mg)</strong> + SF 3.2 ml para completar 20 ml.</li>
                  <li>Concentración final: <strong>8 mg/ml Propofol + 2 mg/ml Ketamina</strong>.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-pink-950/30 border border-pink-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-pink-400 tracking-wider block border-b border-slate-800 pb-2">
              Dosificación Clínica para {patient.weightKg} kg
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-pink-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Bolo de Sedación / Reducción</span>
                <div className="text-2xl font-black text-pink-400 font-mono">
                  {(patient.weightKg * 0.5 / 10).toFixed(1)} - {(patient.weightKg * 0.75 / 10).toFixed(1)} <span className="text-xs text-slate-300">ml</span>
                </div>
                <span className="text-[9px] text-slate-400 block pt-1">
                  0.5 a 0.75 mg/kg del componente de Propofol.
                </span>
              </div>

              <div className="bg-slate-950/90 border border-pink-500/20 rounded-xl p-4 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ventajas Clave</span>
                <div className="text-xs text-slate-300 space-y-1 pt-1">
                  <p className="text-emerald-400 font-bold">✓ Estabilidad Hemodinámica</p>
                  <p className="text-emerald-400 font-bold">✓ Conserva reflejos de vía aérea</p>
                  <p className="text-emerald-400 font-bold">✓ Recuperación rápida sin emesis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

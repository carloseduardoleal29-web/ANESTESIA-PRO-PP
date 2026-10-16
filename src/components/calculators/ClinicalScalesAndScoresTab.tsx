import React, { useState } from 'react';
import { 
  Calculator, Activity, Droplets, Heart, ShieldAlert, 
  Sparkles, Check, Copy, AlertTriangle, Layers, Wind, Brain
} from 'lucide-react';
import { CleanNumberInput } from './CleanNumberInput';

interface ClinicalScalesAndScoresTabProps {
  initialSubTab?: 'fluids' | 'antropo' | 'hemo_gas' | 'scales';
}

export const ClinicalScalesAndScoresTab: React.FC<ClinicalScalesAndScoresTabProps> = ({ initialSubTab = 'fluids' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'fluids' | 'antropo' | 'hemo_gas' | 'scales'>(initialSubTab);

  // 1. Antropometria
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(45);

  // 2. Fluidos y MABL
  const [fastingHours, setFastingHours] = useState<number>(8);
  const [traumaLevel, setTraumaLevel] = useState<'min' | 'mod' | 'sev'>('mod');
  const [hctInitial, setHctInitial] = useState<number>(40);
  const [hctMinimum, setHctMinimum] = useState<number>(28);

  // 3. Hemodinamia y Gasometria
  const [sbp, setSbp] = useState<number>(120);
  const [dbp, setDbp] = useState<number>(75);
  const [cvp, setCvp] = useState<number>(6); // PVC
  const [cardiacOutput, setCardiacOutput] = useState<number>(5.0); // L/min
  const [heartRate, setHeartRate] = useState<number>(80);

  const [pao2, setPao2] = useState<number>(95);
  const [paco2, setPaco2] = useState<number>(40);
  const [fio2Percent, setFio2Percent] = useState<number>(21); // %
  const [sao2Percent, setSao2Percent] = useState<number>(98);
  const [hb, setHb] = useState<number>(13.5);

  // 4. Escalas de emergencia
  // qSOFA
  const [qSofaRR, setQSofaRR] = useState<boolean>(false); // FR >= 22
  const [qSofaGCS, setQSofaGCS] = useState<boolean>(false); // GCS < 15
  const [qSofaBP, setQSofaBP] = useState<boolean>(false); // PAS <= 100

  // MACOCHA
  const [macochaMallampati, setMacochaMallampati] = useState<boolean>(false); // Mallampati III/IV (5 pts)
  const [macochaSAHOS, setMacochaSAHOS] = useState<boolean>(false); // SAHOS (2 pts)
  const [macochaMobility, setMacochaMobility] = useState<boolean>(false); // Movilidad cervical reducida (1 pt)
  const [macochaMouthOpening, setMacochaMouthOpening] = useState<boolean>(false); // Apertura < 3cm (1 pt)
  const [macochaComa, setMacochaComa] = useState<boolean>(false); // Coma GCS < 8 (1 pt)
  const [macochaHypoxia, setMacochaHypoxia] = useState<boolean>(false); // Hipoxemia severa PaO2/FiO2 < 200 (1 pt)
  const [macochaNonAnesthesiologist, setMacochaNonAnesthesiologist] = useState<boolean>(false); // Operador no anestesiólogo (1 pt)

  // STOP-BANG
  const [stopSnore, setStopSnore] = useState<boolean>(false);
  const [stopTired, setStopTired] = useState<boolean>(false);
  const [stopObserved, setStopObserved] = useState<boolean>(false);
  const [stopPressure, setStopPressure] = useState<boolean>(false);
  const [stopBmiOver35, setStopBmiOver35] = useState<boolean>(false);
  const [stopAgeOver50, setStopAgeOver50] = useState<boolean>(false);
  const [stopNeckOver40, setStopNeckOver40] = useState<boolean>(false);
  const [stopMale, setStopMale] = useState<boolean>(false);

  // --- CALCULATIONS ---

  // Antropometria
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bsaMosteller = Math.sqrt((heightCm * weightKg) / 3600);
  const ibwDevine = gender === 'male' 
    ? 50 + 0.91 * (heightCm - 152.4)
    : 45.5 + 0.91 * (heightCm - 152.4);
  const lbwJanma = gender === 'male'
    ? (9270 * weightKg) / (6680 + 216 * bmi)
    : (9270 * weightKg) / (8780 + 244 * bmi);
  const abw = ibwDevine + 0.4 * (weightKg - ibwDevine);

  // Fluidos (Regla 4-2-1)
  let hourlyMaintenance = 0;
  if (weightKg <= 10) hourlyMaintenance = weightKg * 4;
  else if (weightKg <= 20) hourlyMaintenance = 40 + (weightKg - 10) * 2;
  else hourlyMaintenance = 60 + (weightKg - 20) * 1;

  const fastingDeficitMl = hourlyMaintenance * fastingHours;
  const hour1Deficit = Math.round(fastingDeficitMl * 0.5);
  const hour2Deficit = Math.round(fastingDeficitMl * 0.25);
  const hour3Deficit = Math.round(fastingDeficitMl * 0.25);

  const thirdSpaceRate = traumaLevel === 'min' ? 3 : traumaLevel === 'mod' ? 5 : 8;
  const thirdSpaceHourlyMl = weightKg * thirdSpaceRate;

  // MABL
  const ebvMlPerKg = bmi > 30 ? 60 : gender === 'male' ? 70 : 65;
  const totalEbv = weightKg * ebvMlPerKg;
  const hctAvg = (hctInitial + hctMinimum) / 2;
  const mablMl = Math.max(0, Math.round(totalEbv * ((hctInitial - hctMinimum) / hctAvg)));

  // Hemodinamia
  const map = Number(((sbp + 2 * dbp) / 3).toFixed(1));
  const pulsePressure = sbp - dbp;
  const shockIndex = Number((heartRate / sbp).toFixed(2));
  const modifiedShockIndex = Number((heartRate / map).toFixed(2));
  const svr = cardiacOutput > 0 ? Math.round(((map - cvp) / cardiacOutput) * 80) : 0;

  // Gasometria & Oxigenacion
  const fio2Dec = fio2Percent / 100;
  const pafiKirby = Number((pao2 / fio2Dec).toFixed(0));
  const pao2Alveolar = (760 - 47) * fio2Dec - (paco2 / 0.8);
  const aAGradient = Number((pao2Alveolar - pao2).toFixed(1));
  const cao2 = Number(((1.34 * hb * (sao2Percent / 100)) + (0.0031 * pao2)).toFixed(1));
  const do2 = Number((cao2 * cardiacOutput * 10).toFixed(0));

  // qSOFA Score
  const qSofaScore = (qSofaRR ? 1 : 0) + (qSofaGCS ? 1 : 0) + (qSofaBP ? 1 : 0);

  // MACOCHA Score
  const macochaScore = 
    (macochaMallampati ? 5 : 0) +
    (macochaSAHOS ? 2 : 0) +
    (macochaMobility ? 1 : 0) +
    (macochaMouthOpening ? 1 : 0) +
    (macochaComa ? 1 : 0) +
    (macochaHypoxia ? 1 : 0) +
    (macochaNonAnesthesiologist ? 1 : 0);

  // STOP-BANG Score
  const stopBangScore = 
    (stopSnore ? 1 : 0) +
    (stopTired ? 1 : 0) +
    (stopObserved ? 1 : 0) +
    (stopPressure ? 1 : 0) +
    (stopBmiOver35 ? 1 : 0) +
    (stopAgeOver50 ? 1 : 0) +
    (stopNeckOver40 ? 1 : 0) +
    (stopMale ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* HEADER & SUBTABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Calculadoras Clínicas & Escalas Críticas</h3>
            <p className="text-xs text-slate-400">Balance hídrico, pérdida sanguínea MABL, hemodinamia, Kirby, MACOCHA y STOP-BANG.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('fluids')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'fluids' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Fluidos & Sangrado (MABL)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('hemo_gas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'hemo_gas' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hemodinamia & Gasometría
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('scales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'scales' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Escalas Críticas (MACOCHA/qSOFA)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('antropo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'antropo' ? 'bg-cyan-500 text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Antropometría & Pesos
          </button>
        </div>
      </div>

      {/* 1. FLUIDS & MABL */}
      {activeSubTab === 'fluids' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              Parámetros de Fluidoterapia & Ayuno
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Peso del Paciente (kg)</label>
                  <CleanNumberInput
                    min={1}
                    max={300}
                    value={weightKg}
                    onChange={setWeightKg}
                    suffix="kg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Horas de Ayuno Previo</label>
                  <CleanNumberInput
                    min={0}
                    max={48}
                    step={1}
                    value={fastingHours}
                    onChange={setFastingHours}
                    suffix="horas"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Magnitud de la Cirugía (Tercer Espacio)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTraumaLevel('min')}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      traumaLevel === 'min' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Mínima (2-4 ml/kg/h)
                    <span className="block text-[9px] font-normal opacity-80">Hernia, Oftalmo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTraumaLevel('mod')}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      traumaLevel === 'mod' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Moderada (4-6 ml/kg/h)
                    <span className="block text-[9px] font-normal opacity-80">Colecistectomía, Artroplastia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTraumaLevel('sev')}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      traumaLevel === 'sev' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Severa (6-10 ml/kg/h)
                    <span className="block text-[9px] font-normal opacity-80">Laparotomía, Cardíaca</span>
                  </button>
                </div>
              </div>

              {/* MABL PARAMETERS */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-rose-300 uppercase block">Parámetros de Pérdida Sanguínea (MABL):</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Hematocrito Inicial (%)</label>
                    <CleanNumberInput
                      min={10}
                      max={65}
                      step={1}
                      value={hctInitial}
                      onChange={setHctInitial}
                      suffix="%"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Hematocrito Mínimo Tolerado (%)</label>
                    <CleanNumberInput
                      min={10}
                      max={45}
                      step={1}
                      value={hctMinimum}
                      onChange={setHctMinimum}
                      suffix="%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block border-b border-slate-800 pb-2">
              Plan de Reposición Hídrica & MABL
            </span>

            {/* MABL DISPLAY */}
            <div className="bg-slate-950/90 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Pérdida Sanguínea Máxima Permisible (MABL)</span>
                <div className="text-3xl font-black text-rose-400 font-mono">
                  {mablMl.toLocaleString()} <span className="text-sm font-sans text-slate-300">ml</span>
                </div>
                <span className="text-[10px] text-slate-400 block pt-0.5">
                  Volemia Estimada (EBV): <strong>{totalEbv.toLocaleString()} ml</strong> ({ebvMlPerKg} ml/kg)
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold block mb-1">
                  Límite Transfusional
                </span>
                <span className="text-[10px] text-slate-400">Hto límite: {hctMinimum}%</span>
              </div>
            </div>

            {/* FLUIDS REPLACEMENT */}
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-slate-300">Mantenimiento Basal (Regla 4-2-1):</span>
                <strong className="text-cyan-300 font-mono text-base">{hourlyMaintenance} ml/h</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-slate-300">Tercer Espacio Quirúrgico:</span>
                <strong className="text-amber-300 font-mono text-base">{thirdSpaceHourlyMl} ml/h</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Déficit por Ayuno ({fastingDeficitMl} ml en {fastingHours}h) - Esquema de Reposición:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">1ª Hora (50%)</span>
                    <strong className="text-white font-mono">{hour1Deficit + hourlyMaintenance + thirdSpaceHourlyMl} ml</strong>
                    <span className="text-[9px] text-slate-500 block">({hour1Deficit} ml déficit)</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">2ª Hora (25%)</span>
                    <strong className="text-white font-mono">{hour2Deficit + hourlyMaintenance + thirdSpaceHourlyMl} ml</strong>
                    <span className="text-[9px] text-slate-500 block">({hour2Deficit} ml déficit)</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">3ª Hora (25%)</span>
                    <strong className="text-white font-mono">{hour3Deficit + hourlyMaintenance + thirdSpaceHourlyMl} ml</strong>
                    <span className="text-[9px] text-slate-500 block">({hour3Deficit} ml déficit)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. HEMODYNAMICS & GASOMETRY */}
      {activeSubTab === 'hemo_gas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* INPUTS */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              Parámetros Hemodinámicos & Gasométricos
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PAS (mmHg)</label>
                  <CleanNumberInput
                    min={30}
                    max={260}
                    value={sbp}
                    onChange={setSbp}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PAD (mmHg)</label>
                  <CleanNumberInput
                    min={20}
                    max={160}
                    value={dbp}
                    onChange={setDbp}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">FC (lpm)</label>
                  <CleanNumberInput
                    min={20}
                    max={240}
                    value={heartRate}
                    onChange={setHeartRate}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">PVC (mmHg)</label>
                  <CleanNumberInput
                    min={-5}
                    max={35}
                    value={cvp}
                    onChange={setCvp}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Gasto Cardíaco (L/min)</label>
                  <CleanNumberInput
                    step={0.1}
                    min={0.5}
                    max={20}
                    value={cardiacOutput}
                    onChange={setCardiacOutput}
                  />
                </div>
              </div>

              {/* GASOMETRY INPUTS */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-cyan-300 uppercase block">Gasometría & Oxigenación:</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">PaO2 (mmHg)</label>
                    <CleanNumberInput
                      min={20}
                      max={600}
                      value={pao2}
                      onChange={setPao2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">PaCO2 (mmHg)</label>
                    <CleanNumberInput
                      min={10}
                      max={120}
                      value={paco2}
                      onChange={setPaco2}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">FiO2 (%)</label>
                    <CleanNumberInput
                      min={21}
                      max={100}
                      value={fio2Percent}
                      onChange={setFio2Percent}
                      suffix="%"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">SaO2 (%)</label>
                    <CleanNumberInput
                      min={40}
                      max={100}
                      value={sao2Percent}
                      onChange={setSao2Percent}
                      suffix="%"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Hemoglobina (g/dL)</label>
                    <CleanNumberInput
                      step={0.1}
                      min={2}
                      max={24}
                      value={hb}
                      onChange={setHb}
                      suffix="g/dL"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-rose-950/20 border border-rose-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-rose-400 tracking-wider block border-b border-slate-800 pb-2">
              Índices Hemodinámicos & Oxigenación Celular
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Presión Arterial Media (PAM)</span>
                <strong className={`text-2xl font-mono ${map < 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {map} <span className="text-xs text-slate-400">mmHg</span>
                </strong>
                <span className="text-[9px] text-slate-500 block pt-0.5">Meta clínica: ≥ 65 mmHg</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Resistencia Vascular Sist. (RVS)</span>
                <strong className="text-2xl font-mono text-cyan-300">
                  {svr} <span className="text-xs text-slate-400">dyn·s/cm⁵</span>
                </strong>
                <span className="text-[9px] text-slate-500 block pt-0.5">Normal: 800 - 1200 dyn·s/cm⁵</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Shock Index (FC / PAS)</span>
                <strong className={`text-2xl font-mono ${shockIndex >= 0.9 ? 'text-rose-400' : shockIndex >= 0.7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {shockIndex}
                </strong>
                <span className="text-[9px] text-slate-500 block pt-0.5">&gt; 0.9: Alerta Sangrado Oculto / Shock</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Índice de Kirby (PaO2 / FiO2)</span>
                <strong className={`text-2xl font-mono ${pafiKirby < 100 ? 'text-rose-500' : pafiKirby < 200 ? 'text-rose-400' : pafiKirby < 300 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {pafiKirby}
                </strong>
                <span className="text-[9px] text-slate-400 block pt-0.5">
                  {pafiKirby < 100 ? 'SDRA Severo' : pafiKirby < 200 ? 'SDRA Moderado' : pafiKirby < 300 ? 'SDRA Leve' : 'Normal (>300)'}
                </span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Contenido Arterial O2 (CaO2)</span>
                <strong className="text-xl font-mono text-white">{cao2} ml/dL</strong>
                <span className="text-[9px] text-slate-500 block">Normal: 16 - 20 ml/dL</span>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Entrega de O2 (DO2)</span>
                <strong className="text-xl font-mono text-cyan-300">{do2} ml/min</strong>
                <span className="text-[9px] text-slate-500 block">Normal: 900 - 1100 ml/min</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CRITICAL SCALES (MACOCHA & qSOFA & STOP-BANG) */}
      {activeSubTab === 'scales' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* MACOCHA SCORE */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Wind className="w-5 h-5" />
                <h4 className="text-sm font-black text-white">Escala MACOCHA (Vía Aérea en UCI / Urgencias)</h4>
              </div>
              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                macochaScore >= 3 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {macochaScore} Puntos
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Predicción validada de intubación difícil en paciente crítico fuera de quirófano.
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaMallampati}
                  onChange={(e) => setMacochaMallampati(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-slate-300">Mallampati Clase III o IV (+5 puntos)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaSAHOS}
                  onChange={(e) => setMacochaSAHOS(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Síndrome de Apnea Obstructiva del Sueño - SAHOS (+2 puntos)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaMobility}
                  onChange={(e) => setMacochaMobility(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Movilidad de columna cervical reducida (+1 punto)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaMouthOpening}
                  onChange={(e) => setMacochaMouthOpening(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Apertura bucal reducida &lt; 3 cm (+1 punto)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaComa}
                  onChange={(e) => setMacochaComa(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Coma / Glasgow &lt; 8 (+1 punto)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaHypoxia}
                  onChange={(e) => setMacochaHypoxia(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Hipoxemia severa (PaO2/FiO2 &lt; 200 mmHg) (+1 punto)</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={macochaNonAnesthesiologist}
                  onChange={(e) => setMacochaNonAnesthesiologist(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span className="text-slate-300">Operador no anestesiólogo (+1 punto)</span>
              </label>
            </div>

            <div className={`p-3 rounded-xl border text-xs font-bold ${
              macochaScore >= 3 
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-200' 
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            }`}>
              {macochaScore >= 3 
                ? '🚨 RIESGO MUY ALTO DE INTUBACIÓN DIFÍCIL (Score ≥ 3). Preparar Videolaringoscopio, Guía Frova y plan rescate FONA.' 
                : '✓ Bajo riesgo de intubación difícil (Score < 3).'}
            </div>
          </div>

          {/* STOP-BANG & qSOFA */}
          <div className="space-y-4">
            {/* qSOFA */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  Quick SOFA (qSOFA - Sepsis Rápida)
                </h4>
                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                  qSofaScore >= 2 ? 'bg-rose-950 text-rose-300 border border-rose-500' : 'bg-slate-950 text-slate-400'
                }`}>
                  {qSofaScore} / 3 Pts
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qSofaRR}
                    onChange={(e) => setQSofaRR(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span className="text-slate-300">Frecuencia Respiratoria ≥ 22 rpm</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qSofaGCS}
                    onChange={(e) => setQSofaGCS(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span className="text-slate-300">Alteración del Estado Mental (Glasgow &lt; 15)</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={qSofaBP}
                    onChange={(e) => setQSofaBP(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <span className="text-slate-300">Presión Arterial Sistólica ≤ 100 mmHg</span>
                </label>
              </div>

              {qSofaScore >= 2 && (
                <div className="bg-rose-950/50 border border-rose-500/40 p-2.5 rounded-xl text-xs text-rose-200 font-bold">
                  🚨 Alto riesgo de desenlace adverso / Sepsis severa. Iniciar Bundle de la 1ª hora (Lactato, Hemocultivos, Antibiótico y Fluidos 30ml/kg).
                </div>
              )}
            </div>

            {/* STOP-BANG */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" />
                  STOP-BANG (Riesgo de Apnea del Sueño)
                </h4>
                <span className={`text-xs font-mono font-black px-2 py-0.5 rounded ${
                  stopBangScore >= 5 ? 'bg-rose-950 text-rose-300 border border-rose-500' : 'bg-slate-950 text-slate-400'
                }`}>
                  {stopBangScore} / 8 Pts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopSnore} onChange={(e) => setStopSnore(e.target.checked)} />
                  <span className="text-slate-300">S: Ronquido fuerte</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopTired} onChange={(e) => setStopTired(e.target.checked)} />
                  <span className="text-slate-300">T: Cansancio diurno</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopObserved} onChange={(e) => setStopObserved(e.target.checked)} />
                  <span className="text-slate-300">O: Apnea observada</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopPressure} onChange={(e) => setStopPressure(e.target.checked)} />
                  <span className="text-slate-300">P: Hipertensión arterial</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopBmiOver35} onChange={(e) => setStopBmiOver35(e.target.checked)} />
                  <span className="text-slate-300">B: IMC &gt; 35 kg/m²</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopAgeOver50} onChange={(e) => setStopAgeOver50(e.target.checked)} />
                  <span className="text-slate-300">A: Edad &gt; 50 años</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopNeckOver40} onChange={(e) => setStopNeckOver40(e.target.checked)} />
                  <span className="text-slate-300">N: Cuello &gt; 40 cm</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 bg-slate-950 rounded-lg border border-slate-800 cursor-pointer">
                  <input type="checkbox" checked={stopMale} onChange={(e) => setStopMale(e.target.checked)} />
                  <span className="text-slate-300">G: Sexo Masculino</span>
                </label>
              </div>

              <div className={`p-2 rounded-lg text-[11px] font-bold ${
                stopBangScore >= 5 ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30' :
                stopBangScore >= 3 ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' :
                'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
              }`}>
                {stopBangScore >= 5 ? 'Alto Riesgo de SAHOS (Score 5-8): Mayor sensibilidad a opioides y colapso de vía aérea.' :
                 stopBangScore >= 3 ? 'Riesgo Intermedio de SAHOS (Score 3-4).' :
                 'Bajo Riesgo de SAHOS (Score 0-2).'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. ANTROPOMETRIA */}
      {activeSubTab === 'antropo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Parámetros Físicos del Paciente
            </h4>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Peso Real (kg)</label>
                  <CleanNumberInput
                    min={1}
                    max={350}
                    value={weightKg}
                    onChange={setWeightKg}
                    suffix="kg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Talla (cm)</label>
                  <CleanNumberInput
                    min={30}
                    max={250}
                    value={heightCm}
                    onChange={setHeightCm}
                    suffix="cm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Sexo Biológico</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                  >
                    <option value="male">Masculino (♂)</option>
                    <option value="female">Femenino (♀)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Edad (Años)</label>
                  <CleanNumberInput
                    min={0}
                    max={120}
                    step={1}
                    value={age}
                    onChange={setAge}
                    suffix="años"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block border-b border-slate-800 pb-2">
              Pesos Fisiológicos y Dosificación
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Índice Masa Corporal (IMC)</span>
                <strong className="text-xl font-mono text-cyan-300">{bmi.toFixed(1)} kg/m²</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Superficie Corporal (BSA)</span>
                <strong className="text-xl font-mono text-white">{bsaMosteller.toFixed(2)} m²</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Peso Ideal (Devine - IBW)</span>
                <strong className="text-xl font-mono text-emerald-400">{ibwDevine.toFixed(1)} kg</strong>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Peso Magro (LBW Janmahasatian)</span>
                <strong className="text-xl font-mono text-amber-300">{lbwJanma.toFixed(1)} kg</strong>
              </div>

              <div className="col-span-2 bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Peso Ajustado Anestesia (ABW):</span>
                <strong className="text-xl font-mono text-rose-300">{abw.toFixed(1)} kg</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

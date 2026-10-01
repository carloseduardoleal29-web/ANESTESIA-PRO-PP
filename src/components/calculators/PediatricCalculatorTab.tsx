import React, { useState } from 'react';
import { 
  Baby, Wind, ShieldAlert, Sparkles, Copy, Check, 
  Heart, Droplets, Zap, Sliders, AlertTriangle, Layers, Syringe, Activity,
  Info, ChevronDown, ChevronUp, Beaker, CheckCircle2, RefreshCw
} from 'lucide-react';
import { CleanNumberInput } from './CleanNumberInput';

export const PediatricCalculatorTab: React.FC = () => {
  const [ageYears, setAgeYears] = useState<number>(3);
  const [ageMonths, setAgeMonths] = useState<number>(36);
  const [weightKg, setWeightKg] = useState<number>(14);
  const [isNeonate, setIsNeonate] = useState<boolean>(false);
  const [fastingHours, setFastingHours] = useState<number>(6);
  const [surgicalTrauma, setSurgicalTrauma] = useState<'min' | 'mod' | 'sev'>('mod');
  const [copied, setCopied] = useState<boolean>(false);
  const [showEpiPrepGuide, setShowEpiPrepGuide] = useState<boolean>(true);

  // Synchronize age conversions
  const handleSetYears = (yrs: number) => {
    setAgeYears(yrs);
    setAgeMonths(Math.round(yrs * 12));
    if (yrs < 1) setIsNeonate(true);
    else setIsNeonate(false);
  };

  const handleSetMonths = (mos: number) => {
    setAgeMonths(mos);
    setAgeYears(Number((mos / 12).toFixed(1)));
    if (mos < 1) setIsNeonate(true);
    else setIsNeonate(false);
  };

  // Quick pediatric age presets
  const applyPreset = (label: string, mos: number, kg: number) => {
    setAgeMonths(mos);
    setAgeYears(Number((mos / 12).toFixed(1)));
    setWeightKg(kg);
    setIsNeonate(mos <= 1);
  };

  // Estimate weight from age if requested
  const handleAutoEstimateWeight = () => {
    let est = 10;
    if (ageMonths <= 12) {
      est = Number(((ageMonths + 9) / 2).toFixed(1)); // 0-12 months
    } else if (ageYears <= 6) {
      est = Math.round(ageYears * 2 + 8); // 1-6 years
    } else {
      est = Math.round(ageYears * 3 + 7); // 7-12 years
    }
    setWeightKg(est);
  };

  // --- AIRWAY EQUIPMENT CALCULATIONS ---
  // 1. Endotracheal Tube Formulas:
  // Cuffed (Khine / Motoyama): (Age / 4) + 3.5 (Neonate/Infant: 3.0 cuffed or uncuffed)
  let ettCuffed = 3.0;
  if (ageYears >= 2) {
    ettCuffed = Number(((ageYears / 4) + 3.5).toFixed(1));
  } else if (ageMonths > 6) {
    ettCuffed = 3.0;
  } else if (ageMonths > 1) {
    ettCuffed = 3.0;
  } else {
    ettCuffed = weightKg < 2.5 ? 2.5 : 3.0;
  }

  // Uncuffed (Cole): (Age / 4) + 4.0
  let ettUncuffed = 3.5;
  if (ageYears >= 1) {
    ettUncuffed = Number(((ageYears / 4) + 4.0).toFixed(1));
  } else if (ageMonths > 6) {
    ettUncuffed = 3.5;
  } else if (ageMonths > 1) {
    ettUncuffed = 3.0;
  } else {
    ettUncuffed = weightKg < 2.5 ? 2.5 : 3.0;
  }

  // Depth of ETT at lips (cm): ETT size * 3 OR (Age / 2) + 12
  const ettDepthOral = ageYears >= 1 ? Number(((ageYears / 2) + 12).toFixed(1)) : Number((weightKg + 6).toFixed(1));
  const ettDepthByTube = Number((ettCuffed * 3).toFixed(1));

  // Laryngeal Mask Airway (LMA) size & max cuff volume:
  let lmaSize = '1';
  let lmaMaxVolume = '4 mL';
  if (weightKg < 5) {
    lmaSize = '1';
    lmaMaxVolume = '4 mL';
  } else if (weightKg <= 10) {
    lmaSize = '1.5';
    lmaMaxVolume = '7 mL';
  } else if (weightKg <= 20) {
    lmaSize = '2';
    lmaMaxVolume = '10 mL';
  } else if (weightKg <= 30) {
    lmaSize = '2.5';
    lmaMaxVolume = '14 mL';
  } else if (weightKg <= 50) {
    lmaSize = '3';
    lmaMaxVolume = '20 mL';
  } else {
    lmaSize = '4';
    lmaMaxVolume = '30 mL';
  }

  // Laryngoscope Blade:
  let bladeType = 'Miller 0 recta (Neonato)';
  if (weightKg < 3) bladeType = 'Miller 00 recta (Prematuro)';
  else if (weightKg <= 5) bladeType = 'Miller 0 recta (Neonato a término)';
  else if (weightKg <= 10) bladeType = 'Miller 1 recta (Lactante)';
  else if (weightKg <= 20) bladeType = 'Miller 1.5 - 2 / Macintosh 2 curva';
  else if (weightKg <= 35) bladeType = 'Macintosh 2 curva (Escolar)';
  else bladeType = 'Macintosh 3 curva (Adolescente)';

  // Suction catheter (Fr) = ETT size * 2
  const suctionCatheterFr = Math.round(ettCuffed * 2);

  // Nasogastric / Foley catheter:
  const ngTubeFr = weightKg < 5 ? 6 : weightKg < 15 ? 8 : weightKg < 30 ? 10 : 12;
  const foleyFr = weightKg < 5 ? 6 : weightKg < 15 ? 8 : weightKg < 30 ? 10 : 12;

  // --- RESUSCITATION & INDUCTION DRUGS ---
  // Atropine for Bradycardia: 0.02 mg/kg (min 0.1 mg to prevent paradoxical bradycardia, max 0.5 mg)
  const atropineDoseMg = Number(Math.min(0.5, Math.max(0.1, weightKg * 0.02)).toFixed(2));
  const atropineDoseMl = Number((atropineDoseMg / 0.5).toFixed(2)); // from 0.5mg/ml ampoule (or 1mg/ml)

  // Epinephrine CPR: 0.01 mg/kg = 10 mcg/kg (0.1 mL/kg of 1:10,000 / 0.1 mg/mL dilution)
  const epiCprMcg = Math.round(weightKg * 10);
  const epiCprMlDiluted = Number((weightKg * 0.1).toFixed(2)); // mL of 1:10,000 (0.1 mg/mL)
  // Endotracheal rescue dose (if no vascular access): 0.1 mg/kg = 100 mcg/kg = 1 mL/kg of 1:10,000
  const epiEtDoseMcg = Math.round(weightKg * 100);
  const epiEtDoseMl = Number((weightKg * 1.0).toFixed(1));

  // Succinylcholine: 2 mg/kg IV in infants <1y, 1.5 mg/kg in children (IM 4 mg/kg for laryngospasm)
  const succinylDoseMg = Math.round(weightKg * (ageMonths <= 12 ? 2.0 : 1.5));
  const succinylImDoseMg = Math.round(weightKg * 4.0);

  // Propofol: 2.5 - 3.5 mg/kg
  const propofolMinMg = Math.round(weightKg * 2.5);
  const propofolMaxMg = Math.round(weightKg * 3.5);
  const propofolMinMl = Number((propofolMinMg / 10).toFixed(1)); // 1% (10 mg/mL)
  const propofolMaxMl = Number((propofolMaxMg / 10).toFixed(1));

  // Fentanyl: 1 - 2 mcg/kg (50 mcg/mL)
  const fentanylMinMcg = Math.round(weightKg * 1);
  const fentanylMaxMcg = Math.round(weightKg * 2);
  const fentanylMinMl = Number((fentanylMinMcg / 50).toFixed(2)); // 50 mcg/mL
  const fentanylMaxMl = Number((fentanylMaxMcg / 50).toFixed(2));

  // Ketamine: IV 1.5-2 mg/kg | IM 4-6 mg/kg
  const ketamineIvMg = Math.round(weightKg * 2.0);
  const ketamineImMg = Math.round(weightKg * 5.0);

  // Midazolam: 0.05 - 0.1 mg/kg IV (sedation/induction) | 0.5 mg/kg Oral premedication (max 15mg)
  const midazolamIvMinMg = Number((weightKg * 0.05).toFixed(2));
  const midazolamIvMaxMg = Number((weightKg * 0.1).toFixed(2));
  const midazolamIvMinMl = Number((midazolamIvMinMg / 1).toFixed(2)); // from 1 mg/mL ampoule
  const midazolamIvMaxMl = Number((midazolamIvMaxMg / 1).toFixed(2));
  const midazolamOralMg = Number(Math.min(15, weightKg * 0.5).toFixed(1));

  // Rocuronium: 0.6 mg/kg standard | 1.0 mg/kg RSI | 0.15 mg/kg maintenance
  const rocuroniumMg = Number((weightKg * 0.6).toFixed(1));
  const rocuroniumRsiMg = Number((weightKg * 1.0).toFixed(1));
  const rocuroniumMaintMg = Number((weightKg * 0.15).toFixed(1));
  const rocuroniumMl = Number((rocuroniumMg / 10).toFixed(2)); // 10 mg/mL

  // Vecuronium: 0.1 mg/kg intubation | 0.02 - 0.03 mg/kg maintenance
  const vecuroniumDoseMg = Number((weightKg * 0.1).toFixed(2));
  const vecuroniumMaintMinMg = Number((weightKg * 0.02).toFixed(2));
  const vecuroniumMaintMaxMg = Number((weightKg * 0.03).toFixed(2));
  const vecuroniumDoseMl = vecuroniumDoseMg; // When reconstituted 4 mg in 4 mL = 1 mg/mL

  // Neuromuscular Reversal: Neostigmine + Atropine
  // Neostigmine: 0.04 - 0.07 mg/kg IV (standard 0.05 mg/kg, max 2.5 mg)
  const neostigmineMg = Number(Math.min(2.5, Math.max(0.2, weightKg * 0.05)).toFixed(2));
  const neostigmineMl = Number((neostigmineMg / 0.5).toFixed(2)); // 0.5 mg/mL ampoule

  // Atropine for Reversal: 0.015 - 0.02 mg/kg IV (co-administered with Neostigmine, min 0.1 mg, max 1.0 mg)
  const atropineReversalMg = Number(Math.min(1.0, Math.max(0.1, weightKg * 0.02)).toFixed(2));
  const atropineReversalMl = Number((atropineReversalMg / 0.5).toFixed(2)); // 0.5 mg/mL ampoule

  // Sugammadex (Selective reversal of Rocuronium / Vecuronium)
  const sugammadexMg = Math.round(weightKg * 2); // 2 mg/kg moderate
  const sugammadexDeepMg = Math.round(weightKg * 4); // 4 mg/kg deep
  const sugammadexRsiMg = Math.round(weightKg * 16); // 16 mg/kg immediate rescue

  // Dextrose 10% for Hypoglycemia (<60 mg/dL): 2 mL/kg IV (0.2 g/kg)
  const d10wHypoglycemiaMl = Math.round(weightKg * 2);

  // Defibrillation: Initial 2 J/kg | Subsequent 4 J/kg
  const defibInitialJ = Math.round(weightKg * 2);
  const defibSubsequentJ = Math.round(weightKg * 4);

  // --- FLUIDS (HOLLIDAY-SEGAR 4-2-1) ---
  let hourlyMaintMl = 0;
  if (weightKg <= 10) hourlyMaintMl = weightKg * 4;
  else if (weightKg <= 20) hourlyMaintMl = 40 + (weightKg - 10) * 2;
  else hourlyMaintMl = 60 + (weightKg - 20) * 1;

  const totalDailyMaintMl = hourlyMaintMl * 24;
  const fastingDeficitTotalMl = hourlyMaintMl * fastingHours;
  const fastingHour1 = Math.round(fastingDeficitTotalMl * 0.5);
  const fastingHour2 = Math.round(fastingDeficitTotalMl * 0.25);
  const fastingHour3 = Math.round(fastingDeficitTotalMl * 0.25);

  const thirdSpaceFactor = surgicalTrauma === 'min' ? 2 : surgicalTrauma === 'mod' ? 4 : 8;
  const thirdSpaceHourlyMl = Math.round(weightKg * thirdSpaceFactor);

  const hour1TotalFluidMl = hourlyMaintMl + fastingHour1 + thirdSpaceHourlyMl;
  const hour2TotalFluidMl = hourlyMaintMl + fastingHour2 + thirdSpaceHourlyMl;

  // Bolus for Hypovolemia / Shock: 10 - 20 mL/kg of balanced crystalloid (Plasmalyte / Ringer)
  const fluidBolus10Ml = Math.round(weightKg * 10);
  const fluidBolus20Ml = Math.round(weightKg * 20);

  // Estimated Blood Volume (EBV)
  let ebvFactor = 75;
  if (isNeonate || ageMonths <= 1) ebvFactor = 85;
  else if (ageMonths <= 12) ebvFactor = 80;
  else ebvFactor = 75;
  const totalEbvMl = Math.round(weightKg * ebvFactor);

  // Copy full summary
  const handleCopyPediatric = () => {
    const text = `=== FICHA PEDIÁTRICA ANESTÉSICA & VÍA AÉREA - ANESTESIAPRO ===
Paciente: ${ageYears} años (${ageMonths} meses) | Peso: ${weightKg} kg | Volemia est. (EBV): ${totalEbvMl} mL (${ebvFactor} mL/kg)

1. VÍA AÉREA & EQUIPAMIENTO:
   - TET con Manguito: #${ettCuffed} mm (Fijación oral: ~${ettDepthOral} - ${ettDepthByTube} cm en comisura)
   - TET sin Manguito: #${ettUncuffed} mm
   - Máscara Laríngea (LMA): Tamaño #${lmaSize} (Vol. máx manguito: ${lmaMaxVolume})
   - Hoja Laringoscopio: ${bladeType}
   - Sonda Aspiración: ${suctionCatheterFr} Fr | Sonda Foley / SNG: ${foleyFr} Fr

2. INDUCCIÓN ANESTÉSICA & SEDACIÓN:
   - Midazolam IV (0.05 - 0.1 mg/kg): ${midazolamIvMinMg} - ${midazolamIvMaxMg} mg (${midazolamIvMinMl} - ${midazolamIvMaxMl} mL) | Premedicación VO (0.5 mg/kg): ${midazolamOralMg} mg
   - Propofol 1% (2.5 - 3.5 mg/kg): ${propofolMinMg} - ${propofolMaxMg} mg (${propofolMinMl} - ${propofolMaxMl} mL)
   - Fentanilo (1 - 2 µg/kg): ${fentanylMinMcg} - ${fentanylMaxMcg} µg (${fentanylMinMl} - ${fentanylMaxMl} mL)
   - Ketamina IV (2 mg/kg): ${ketamineIvMg} mg | IM (5 mg/kg): ${ketamineImMg} mg

3. RELAJANTES NEUROMUSCULARES (BNM):
   - Rocuronio: Intubación electiva (0.6 mg/kg): ${rocuroniumMg} mg (${rocuroniumMl} mL) | ISR (1.0 mg/kg): ${rocuroniumRsiMg} mg | Mant: ${rocuroniumMaintMg} mg
   - Vecuronio (0.1 mg/kg): ${vecuroniumDoseMg} mg (${vecuroniumDoseMl} mL a 1 mg/mL) | Mant: ${vecuroniumMaintMinMg} - ${vecuroniumMaintMaxMg} mg
   - Succinilcolina IV (${ageMonths <= 12 ? '2' : '1.5'} mg/kg): ${succinylDoseMg} mg (IM 4 mg/kg para laringoespasmo: ${succinylImDoseMg} mg)

4. REVERSIÓN DEL BLOQUEO NEUROMUSCULAR:
   - Neostigmina (0.05 mg/kg, máx 2.5mg): ${neostigmineMg} mg (${neostigmineMl} mL de ampolla 0.5 mg/mL)
   - Atropina Reversión (0.02 mg/kg, mín 0.1mg): ${atropineReversalMg} mg (${atropineReversalMl} mL de ampolla 0.5 mg/mL)
   - Sugammadex: ${sugammadexMg} mg (2 mg/kg moderado) | ${sugammadexDeepMg} mg (4 mg/kg profundo) | ${sugammadexRsiMg} mg (16 mg/kg rescate inmediato)

5. PARO CARDÍACO & RESCATE PALS:
   - Adrenalina Paro PCR (10 µg/kg = 0.01 mg/kg): ${epiCprMcg} µg (${epiCprMlDiluted} mL de dilución 1:10.000)
     * CÓMO PREPARAR 1:10.000: 1 mL Adrenalina 1:1.000 (1 mg) + 9 mL SSN 0.9% en jeringa de 10 mL = 10 mL al 1:10.000 (100 µg/mL = 0.1 mg/mL).
     * Dosis IV/IO a administrar: 0.1 mL/kg cada 3-5 min en bolo rápido con flush.
     * Vía Endotraqueal (si no hay vía): 100 µg/kg = ${epiEtDoseMcg} µg (${epiEtDoseMl} mL de 1:10.000).
   - Atropina Bradicardia (0.02 mg/kg, mín 0.1mg): ${atropineDoseMg} mg (${atropineDoseMl} mL)
   - Desfibrilación: ${defibInitialJ} Joules (1ª a 2 J/kg) ➔ ${defibSubsequentJ} Joules (2ª a 4 J/kg)
   - Bolo Dextrosa 10% (Hipoglicemia 2 mL/kg): ${d10wHypoglycemiaMl} mL IV

6. LÍQUIDOS Y AYUNO (Holliday-Segar 4-2-1):
   - Mantenimiento basal: ${hourlyMaintMl} mL/h (${totalDailyMaintMl} mL/24h)
   - Déficit de ayuno (${fastingHours}h): ${fastingDeficitTotalMl} mL
   - 1ª hora qx (Mantenimiento + 50% ayuno + 3er espacio): ${hour1TotalFluidMl} mL/h
   - 2ª y 3ª hora qx (Mantenimiento + 25% ayuno + 3er espacio): ${hour2TotalFluidMl} mL/h
   - Bolo de rescate volemia (10-20 mL/kg): ${fluidBolus10Ml} - ${fluidBolus20Ml} mL Cristaloides balanceados`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Calculadora Pediátrica Anestésica & Vía Aérea</h3>
                <span className="px-2 py-0.5 rounded-md bg-amber-950 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider">
                  Guías PALS / SPA 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">Tamaño de tubos con/sin cuff, laringoscopio, fármacos de inducción y PCR por kg, regla 4-2-1 de fluidos.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyPediatric}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all shadow-md shadow-amber-400/25 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Ficha Pediátrica Copiada!' : 'Copiar Ficha Completa'}</span>
          </button>
        </div>

        {/* QUICK PRESETS */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plantillas rápidas por edad:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => applyPreset('Neonato', 0.5, 3.2)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              👶 Neonato (3.2 kg)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('6 Meses', 6, 7.5)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              🍼 6 Meses (7.5 kg)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('1 Año', 12, 10)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              🚼 1 Año (10 kg)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('3 Años', 36, 14)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              👦 3 Años (14 kg)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('6 Años', 72, 21)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              🧒 6 Años (21 kg)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('10 Años', 120, 32)}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 transition-colors"
            >
              🧑 10 Años (32 kg)
            </button>
          </div>
        </div>

        {/* INPUTS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Edad (Años)</label>
            <CleanNumberInput
              min={0}
              max={18}
              step={0.5}
              value={ageYears}
              onChange={handleSetYears}
              suffix="años"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Edad (Meses)</label>
            <CleanNumberInput
              min={0}
              max={216}
              step={1}
              value={ageMonths}
              onChange={handleSetMonths}
              suffix="meses"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Peso Real (kg)</label>
              <button
                type="button"
                onClick={handleAutoEstimateWeight}
                className="text-[9px] text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                title="Estimar peso teórico por fórmula de edad"
              >
                Estimar por edad
              </button>
            </div>
            <CleanNumberInput
              min={1}
              max={100}
              step={0.5}
              value={weightKg}
              onChange={setWeightKg}
              suffix="kg"
            />
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-2 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">Volemia Total Estimada</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-black text-amber-400">{totalEbvMl} mL</span>
              <span className="text-[10px] text-slate-400 font-mono">({ebvFactor} mL/kg)</span>
            </div>
            <span className="text-[9px] text-slate-400">Pérdida 10%: <strong className="text-rose-400">{Math.round(totalEbvMl * 0.1)} mL</strong></span>
          </div>
        </div>
      </div>

      {/* 3 PRIMARY CLINICAL MODULES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* MODULE 1: VÍA AÉREA & EQUIPAMIENTO */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Wind className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">1. Vía Aérea & Tubos</h4>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">Fórmulas Khine / Cole</span>
          </div>

          <div className="space-y-2.5">
            {/* TET CON CUFF */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Tubo c/ Manguito (Cuffed):</span>
                <span className="text-xs font-black text-slate-200">Khine: (Edad/4) + 3.5</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-cyan-300 font-mono">#{ettCuffed}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ID mm</span>
              </div>
            </div>

            {/* TET SIN CUFF */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Tubo s/ Manguito (Uncuffed):</span>
                <span className="text-xs font-black text-slate-200">Cole: (Edad/4) + 4.0</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-slate-200 font-mono">#{ettUncuffed}</span>
                <span className="text-[10px] text-slate-400 block font-mono">ID mm</span>
              </div>
            </div>

            {/* FIJACIÓN A LA COMISURA */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Fijación en Labio / Arcada:</span>
                <span className="text-xs text-slate-300">TET × 3 ó (Edad/2) + 12</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-300 font-mono">~{ettDepthOral} - {ettDepthByTube} cm</span>
              </div>
            </div>

            {/* MÁSCARA LARÍNGEA */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-300 block">Máscara Laríngea (LMA):</span>
                <span className="text-xs text-slate-300">Por rango de peso ({weightKg} kg)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-indigo-300 font-mono">Tamaño #{lmaSize}</span>
                <span className="text-[10px] text-slate-400 block font-mono">Cuff máx: {lmaMaxVolume}</span>
              </div>
            </div>

            {/* LARINGOSCOPIO Y SONDAS */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Hoja Laringoscopio:</span>
                <span className="font-bold text-emerald-400 text-[11px]">{bladeType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Sonda Aspiración:</span>
                <span className="font-bold text-slate-200 text-[11px]">{suctionCatheterFr} Fr</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Sonda Foley / SNG:</span>
                <span className="font-bold text-slate-200 text-[11px]">{foleyFr} Fr</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 2: FÁRMACOS DE INDUCCIÓN, RELAJACIÓN & PARO PCR */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Syringe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">2. Fármacos & Paro PCR</h4>
                <span className="text-[10px] text-slate-400">Inducción, BNM, Reversión y Reanimación</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded">Dosis Exactas ({weightKg}kg)</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* ADRENALINA EN PARO PCR (1:10.000) CON GUÍA DE PREPARACIÓN */}
            <div className="rounded-xl bg-gradient-to-br from-rose-950/60 via-slate-950 to-slate-950 border border-rose-500/50 p-2.5 space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                    <span className="font-black text-rose-300 text-xs">Adrenalina PCR (10 µg/kg = 0.01 mg/kg)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pl-3.5">Dilución 1:10.000 (0.1 mg/mL = 100 µg/mL)</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-rose-300 font-mono text-sm">{epiCprMcg} µg</span>
                  <span className="text-[11px] text-amber-300 block font-mono font-bold">({epiCprMlDiluted} mL)</span>
                </div>
              </div>

              {/* PROTOCOLO DE PREPARACIÓN 1:10.000 */}
              <div className="rounded-lg bg-slate-900/90 border border-rose-500/30 p-2 text-[11px] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 flex items-center gap-1 text-[10px] uppercase tracking-wider">
                    <Beaker className="w-3 h-3 text-rose-400" />
                    Cómo Preparar Adrenalina 1 en 10.000:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEpiPrepGuide(!showEpiPrepGuide)}
                    className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-0.5 font-semibold"
                  >
                    {showEpiPrepGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showEpiPrepGuide ? 'Ocultar' : 'Ver Guía'}
                  </button>
                </div>

                {showEpiPrepGuide && (
                  <div className="space-y-1 text-slate-300 pt-0.5 border-t border-slate-800/80">
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">1.</span>
                      <span>Tomar <strong>1 ampolla</strong> de Adrenalina 1:1.000 (<strong>1 mg = 1 mL</strong>).</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">2.</span>
                      <span>Cargar 1 mL en jeringa de 10 mL y <strong>añadir 9 mL de SSN 0.9%</strong>.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">3.</span>
                      <span>Mezclar suavemente = <strong>10 mL al 1:10.000</strong> (concentración <strong>0.1 mg/mL = 100 µg/mL</strong>).</span>
                    </div>
                    <div className="p-1 rounded bg-rose-950/40 border border-rose-800/40 text-[10px] text-amber-200 mt-1 flex items-center justify-between">
                      <span>⚡ <strong>Regla rápida PALS:</strong> 0.1 mL/kg</span>
                      <strong className="text-rose-300 font-mono text-xs">{epiCprMlDiluted} mL IV/IO</strong>
                    </div>
                    <div className="text-[9px] text-slate-400 pt-0.5">
                      Vía endotraqueal de rescate (sin vía): 100 µg/kg = 1 mL/kg (<strong className="text-slate-300">{epiEtDoseMl} mL</strong>).
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECCIÓN INDUCCIÓN ANESTÉSICA */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Inducción & Sedación
                </span>
                <span className="text-[9px] text-slate-400">Hipnóticos y Ansiolíticos</span>
              </div>

              {/* MIDAZOLAM */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">Midazolam IV (0.05 - 0.1 mg/kg)</span>
                    <span className="text-[10px] text-slate-400">Sedación / inducción (amp 1 mg/mL)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-cyan-300 font-mono">{midazolamIvMinMg} - {midazolamIvMaxMg} mg</span>
                    <span className="text-[10px] text-slate-400 block font-mono">({midazolamIvMinMl} - {midazolamIvMaxMl} mL)</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  <span className="text-slate-400">Premedicación Oral (0.5 mg/kg, máx 15mg):</span>
                  <span className="font-bold text-cyan-300 font-mono">{midazolamOralMg} mg VO</span>
                </div>
              </div>

              {/* PROPOFOL */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-200 block">Propofol 1% (2.5 - 3.5 mg/kg)</span>
                  <span className="text-[10px] text-slate-400">Inducción hipnótica (10 mg/mL)</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-amber-300 font-mono">{propofolMinMg} - {propofolMaxMg} mg</span>
                  <span className="text-[10px] text-slate-400 block font-mono">({propofolMinMl} - {propofolMaxMl} mL)</span>
                </div>
              </div>

              {/* FENTANILO */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div>
                  <span className="font-bold text-slate-200 block">Fentanilo (1 - 2 µg/kg)</span>
                  <span className="text-[10px] text-slate-400">Analgesia intraoperatoria (50 µg/mL)</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-indigo-300 font-mono">{fentanylMinMcg} - {fentanylMaxMcg} µg</span>
                  <span className="text-[10px] text-slate-400 block font-mono">({fentanylMinMl} - {fentanylMaxMl} mL)</span>
                </div>
              </div>

              {/* KETAMINA */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                <div>
                  <span className="font-bold text-slate-200 block">Ketamina (IV: 2 mg/kg | IM: 5 mg/kg)</span>
                  <span className="text-[10px] text-slate-400">Estabilidad hemodinámica / broncodilatador</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-300 font-mono">IV: {ketamineIvMg} mg</span>
                  <span className="text-[10px] text-slate-400 block font-mono">(IM: {ketamineImMg} mg)</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN RELAJANTES NEUROMUSCULARES (BNM) */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Relajantes Neuromusculares (BNM)
                </span>
                <span className="text-[9px] text-slate-400">Dosis de Intubación y Mantenimiento</span>
              </div>

              {/* ROCURONIO */}
              <div className="space-y-0.5 pt-0.5">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200">Rocuronio:</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">(Ampolla 10 mg/mL)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-100">{rocuroniumMg} mg</span>
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">({rocuroniumMl} mL)</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pl-2">
                  <span>• Secuencia rápida (ISR 1.0 mg/kg):</span>
                  <span className="font-mono text-amber-300 font-bold">{rocuroniumRsiMg} mg</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pl-2">
                  <span>• Mantenimiento (0.15 mg/kg):</span>
                  <span className="font-mono text-slate-300">{rocuroniumMaintMg} mg</span>
                </div>
              </div>

              {/* VECURONIO */}
              <div className="space-y-0.5 pt-1 border-t border-slate-800/60">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-200">Vecuronio (0.1 mg/kg):</span>
                    <span className="text-[10px] text-slate-400 ml-1.5">Reconst. 1 mg/mL</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-100">{vecuroniumDoseMg} mg</span>
                    <span className="text-[10px] text-slate-400 ml-1 font-mono">({vecuroniumDoseMl} mL)</span>
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 pl-2">
                  <span>• Mantenimiento (0.02 - 0.03 mg/kg):</span>
                  <span className="font-mono text-slate-300">{vecuroniumMaintMinMg} - {vecuroniumMaintMaxMg} mg</span>
                </div>
              </div>

              {/* SUCCINILCOLINA */}
              <div className="flex justify-between items-center pt-1 border-t border-slate-800/60 text-xs">
                <div>
                  <span className="font-bold text-slate-200">Succinilcolina:</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">IV: {ageMonths <= 12 ? '2' : '1.5'} mg/kg</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-rose-300">{succinylDoseMg} mg</span>
                  <span className="text-[10px] text-slate-400 ml-1">(IM: {succinylImDoseMg}mg)</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN REVERSIÓN DEL BLOQUEO NEUROMUSCULAR */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Reversión del Bloqueo (Neostigmina / Atropina / Sugammadex)
                </span>
                <span className="text-[9px] text-slate-400">Post-TOF</span>
              </div>

              {/* NEOSTIGMINA + ATROPINA */}
              <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">Neostigmina (0.05 mg/kg):</span>
                  <span className="font-mono font-black text-emerald-300 text-xs">{neostigmineMg} mg <span className="text-slate-400 text-[10px] font-normal">({neostigmineMl} mL de 0.5 mg/mL)</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 text-xs">+ Atropina Reversión (0.02 mg/kg):</span>
                  <span className="font-mono font-black text-cyan-300 text-xs">{atropineReversalMg} mg <span className="text-slate-400 text-[10px] font-normal">({atropineReversalMl} mL de 0.5 mg/mL)</span></span>
                </div>
                <div className="text-[9px] text-slate-400 border-t border-slate-800/80 pt-1">
                  💡 Co-administrar para antagonizar efectos muscarínicos (mínimo 0.1 mg de Atropina para evitar bradicardia).
                </div>
              </div>

              {/* SUGAMMADEX */}
              <div className="rounded-lg bg-slate-900/80 p-2 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-300 text-xs">Sugammadex (Rocuronio / Vecuronio):</span>
                  <span className="font-mono font-black text-emerald-300 text-xs">{sugammadexMg} mg <span className="text-slate-400 text-[10px] font-normal">(2 mg/kg)</span></span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>• Bloqueo profundo (4 mg/kg): <strong className="text-slate-200 font-mono">{sugammadexDeepMg} mg</strong></span>
                  <span>• Rescate post-ISR (16 mg/kg): <strong className="text-amber-300 font-mono">{sugammadexRsiMg} mg</strong></span>
                </div>
              </div>
            </div>

            {/* SECCIÓN BRADICARDIA, DESFIBRILACIÓN & RESCATE METABÓLICO */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
              {/* ATROPINA BRADICARDIA */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-200 block">Atropina Bradicardia (0.02 mg/kg)</span>
                  <span className="text-[10px] text-slate-400">Mínimo 0.1 mg / Máximo 0.5 mg</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-cyan-300 font-mono">{atropineDoseMg} mg</span>
                  <span className="text-[10px] text-slate-400 block font-mono">({atropineDoseMl} mL)</span>
                </div>
              </div>

              {/* DESFIBRILACIÓN & GLUCOSA */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                <div>
                  <span className="font-bold text-amber-300 block">Desfibrilación (2 J/kg ➔ 4 J/kg):</span>
                  <span className="text-[10px] text-slate-400">Dextrosa 10% bolo: 2 mL/kg</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-amber-300 font-mono">{defibInitialJ} J ➔ {defibSubsequentJ} J</span>
                  <span className="text-[10px] text-emerald-400 block font-mono font-bold">D10W: {d10wHypoglycemiaMl} mL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 3: LÍQUIDOS & AYUNO (HOLLIDAY-SEGAR 4-2-1) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">3. Fluidos & Ayuno (4-2-1)</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">Holliday-Segar</span>
          </div>

          <div className="space-y-2.5">
            {/* FASTING & TRAUMA CONTROLS */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Horas de Ayuno</label>
                <CleanNumberInput
                  min={0}
                  max={24}
                  value={fastingHours}
                  onChange={setFastingHours}
                  suffix="hrs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Trauma Quirúrgico</label>
                <select
                  value={surgicalTrauma}
                  onChange={(e) => setSurgicalTrauma(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-emerald-300 font-bold focus:outline-none"
                >
                  <option value="min">Mínimo (2 mL/kg/h)</option>
                  <option value="mod">Moderado (4 mL/kg/h)</option>
                  <option value="sev">Severo (8 mL/kg/h)</option>
                </select>
              </div>
            </div>

            {/* MANTENIMIENTO BASAL */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block">Mantenimiento Basal (4-2-1):</span>
                <span className="text-xs text-slate-300">Regla Holliday-Segar</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-emerald-300 font-mono">{hourlyMaintMl} mL/h</span>
                <span className="text-[10px] text-slate-400 block font-mono">({totalDailyMaintMl} mL / 24h)</span>
              </div>
            </div>

            {/* ESQUEMA INTRAOPERATORIO POR HORAS */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Plan de Infusión Quirúrgica:</span>
              
              <div className="flex justify-between items-center text-xs p-1 rounded bg-slate-900">
                <span className="text-slate-300">1ª Hora (Mant + 50% ayuno + 3er esp):</span>
                <span className="font-black text-amber-300 font-mono">{hour1TotalFluidMl} mL/h</span>
              </div>

              <div className="flex justify-between items-center text-xs p-1 rounded bg-slate-900">
                <span className="text-slate-300">2ª y 3ª Hora (Mant + 25% ayuno + 3er esp):</span>
                <span className="font-black text-emerald-300 font-mono">{hour2TotalFluidMl} mL/h</span>
              </div>

              <div className="flex justify-between items-center text-xs p-1 rounded bg-slate-900">
                <span className="text-slate-300">Déficit total de ayuno acumulado:</span>
                <span className="font-bold text-slate-300 font-mono">{fastingDeficitTotalMl} mL</span>
              </div>
            </div>

            {/* RESCATE HIPOVOLEMIA */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-cyan-300 block">Bolo de Rescate de Volemia:</span>
                <span className="text-xs text-slate-300">10 a 20 mL/kg en 10-20 min</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-cyan-300 font-mono">{fluidBolus10Ml} - {fluidBolus20Ml} mL</span>
                <span className="text-[10px] text-slate-400 block font-mono">Plasmalyte / Ringer</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CLINICAL PEARLS CALLOUT */}
      <div className="bg-gradient-to-r from-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 shadow-lg space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Perlas Clínicas de Anestesia Pediátrica (Dr. Carlos Leal)</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300 pt-1">
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-amber-300 block mb-0.5">1. Tubos con Cuff vs sin Cuff:</strong>
            Los tubos con microcuff moderno sellan a bajas presiones (&lt;20 cmH2O) reduciendo la necesidad de reintubación y el escape de gases, previniendo el edema subglótico.
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-amber-300 block mb-0.5">2. Bradicardia es Hipoxia:</strong>
            En pediatría, la bradicardia intraoperatoria es hipoxia hasta demostrar lo contrario. Oxigenar al 100%, verificar tubo y considerar Atropina (0.02 mg/kg, mín 0.1 mg) si no responde.
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-amber-300 block mb-0.5">3. Evitar Soluciones Hipotónicas:</strong>
            Utilizar cristaloides balanceados isotónicos (Plasmalyte o Ringer con Dextrosa 1-2.5% si hay riesgo de hipoglicemia) para prevenir la hiponatremia aguda postoperatoria.
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <strong className="text-emerald-300 block mb-0.5">4. Reversión BNM Segura:</strong>
            Co-administrar Atropina (0.02 mg/kg, mín 0.1 mg) antes o simultánea con Neostigmina (0.05 mg/kg) para prevenir bradicardia y secreciones. Para Rocuronio o Vecuronio, Sugammadex (2-4 mg/kg) brinda reversión sin efectos autonómicos.
          </div>
        </div>
      </div>
    </div>
  );
};

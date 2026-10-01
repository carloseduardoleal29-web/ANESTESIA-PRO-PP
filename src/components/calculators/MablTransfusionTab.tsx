import React, { useState } from 'react';
import { 
  Droplet, Activity, ShieldAlert, Sparkles, Copy, Check, 
  AlertTriangle, Flame, Heart, Layers, ArrowRight, Gauge, Scale
} from 'lucide-react';
import { CleanNumberInput } from './CleanNumberInput';

export const MablTransfusionTab: React.FC = () => {
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [patientType, setPatientType] = useState<'adult_male' | 'adult_female' | 'obese' | 'child' | 'infant' | 'neonate' | 'pregnant'>('adult_male');
  
  // Hematocrit and Hemoglobin
  const [hctInitial, setHctInitial] = useState<number>(42); // %
  const [hctTarget, setHctTarget] = useState<number>(28); // %
  const [hbInitial, setHbInitial] = useState<number>(14.0); // g/dL
  const [hbTarget, setHbTarget] = useState<number>(8.0); // g/dL
  const [inputMode, setInputMode] = useState<'hct' | 'hb'>('hct');

  // Actual surgical blood loss
  const [currentLossMl, setCurrentLossMl] = useState<number>(450);

  // Copy state
  const [copied, setCopied] = useState<boolean>(false);

  // EBV Multiplier by category
  let ebvFactor = 70; // mL/kg
  let typeLabel = 'Hombre Adulto (70 mL/kg)';

  if (patientType === 'adult_male') {
    ebvFactor = 70;
    typeLabel = 'Hombre Adulto (70 mL/kg)';
  } else if (patientType === 'adult_female') {
    ebvFactor = 65;
    typeLabel = 'Mujer Adulta (65 mL/kg)';
  } else if (patientType === 'obese') {
    ebvFactor = 60;
    typeLabel = 'Paciente Obeso IMC ≥30 (60 mL/kg)';
  } else if (patientType === 'child') {
    ebvFactor = 75;
    typeLabel = 'Niño 1 - 12 años (75 mL/kg)';
  } else if (patientType === 'infant') {
    ebvFactor = 80;
    typeLabel = 'Lactante 1 - 12 meses (80 mL/kg)';
  } else if (patientType === 'neonate') {
    ebvFactor = 85;
    typeLabel = 'Neonato a término (85 mL/kg)';
  } else if (patientType === 'pregnant') {
    ebvFactor = 90;
    typeLabel = 'Embarazada a término (90 mL/kg)';
  }

  // Total Estimated Blood Volume (EBV)
  const totalEbv = Math.round(weightKg * ebvFactor);

  // Maximum Allowable Blood Loss (MABL) using Gross Formula
  let mablMl = 0;
  if (inputMode === 'hct') {
    const hctMean = (hctInitial + hctTarget) / 2;
    mablMl = hctMean > 0 ? Math.max(0, Math.round(totalEbv * ((hctInitial - hctTarget) / hctMean))) : 0;
  } else {
    const hbMean = (hbInitial + hbTarget) / 2;
    mablMl = hbMean > 0 ? Math.max(0, Math.round(totalEbv * ((hbInitial - hbTarget) / hbMean))) : 0;
  }

  // Blood loss percentage
  const lossPercentage = totalEbv > 0 ? Number(((currentLossMl / totalEbv) * 100).toFixed(1)) : 0;
  const remainingAllowableMl = Math.max(0, mablMl - currentLossMl);

  // ATLS Hemorrhagic Shock Classification
  let shockClass = 'Clase I (<15%)';
  let shockSeverity = 'Compensado';
  let shockColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  let fluidStrategy = 'Cristaloides balanceados 1.5:1 a 3:1.';

  if (lossPercentage < 15) {
    shockClass = 'Clase I (Pérdida < 15% volemia)';
    shockSeverity = 'Compensado';
    shockColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    fluidStrategy = 'Reposición con cristaloides balanceados (Plasmalyte / Ringer Lactato) a razón de 1.5 - 3 mL por cada mL de sangre perdida.';
  } else if (lossPercentage <= 30) {
    shockClass = 'Clase II (Pérdida 15% - 30% volemia)';
    shockSeverity = 'Leve - Taquicardia y vasoconstricción';
    shockColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    fluidStrategy = 'Cristaloides isotónicos balanceados. Monitorear perfusión, diuresis y lactato. Preparar pruebas cruzadas de hemoderivados.';
  } else if (lossPercentage <= 40) {
    shockClass = 'Clase III (Pérdida 30% - 40% volemia)';
    shockSeverity = 'Moderado - Hipotensión manifiesta';
    shockColor = 'text-orange-400 border-orange-500/40 bg-orange-950/40';
    fluidStrategy = 'Cristaloides + Concentrado de Hematíes (PRBC). Iniciar Ácido Tranexámico 1g IV. Evaluar respuesta a bolo inicial.';
  } else {
    shockClass = 'Clase IV (Pérdida > 40% volemia)';
    shockSeverity = 'Severo / Crítico - Shock Exanguinante';
    shockColor = 'text-rose-400 border-rose-500/40 bg-rose-950/40';
    fluidStrategy = 'ACTIVAR PROTOCOLO DE TRANSFUSIÓN MASIVA (PTM 1:1:1: PRBC, PFC y Plaquetas). Calentador rápido de fluidos, Calcio IV y Ácido Tranexámico.';
  }

  // Red Blood Cell (PRBC) calculation to reach target Hb
  const hbDelta = Math.max(0, hbTarget - (hbInitial - (currentLossMl / totalEbv) * hbInitial));
  const prbcUnitsEstimated = Math.max(0, Math.round(hbDelta)); // 1 unit increases Hb ~1 g/dL in 70kg adult
  const prbcPediatricMl = Math.round(weightKg * 10); // 10-15 mL/kg in pediatric

  // TXA (Tranexamic Acid) Doses
  const txaLoadingDose = weightKg < 40 ? `${Math.round(weightKg * 15)} mg IV en 15 min (15 mg/kg)` : '1 g (1000 mg) IV en 10-15 min';
  const txaMaintDose = weightKg < 40 ? `${Math.round(weightKg * 2)} mg/h por 8 horas (2 mg/kg/h)` : '1 g (1000 mg) en infusión continua por 8 horas (125 mg/h)';

  // Copy full summary
  const handleCopyMabl = () => {
    const text = `=== CÁLCULO DE PÉRDIDAS SANGUÍNEAS PERMISIBLES (MABL) - ANESTESIAPRO ===
Paciente: ${typeLabel} | Peso: ${weightKg} kg
Volemia Total Estimada (EBV): ${totalEbv} mL (${ebvFactor} mL/kg)

1. VALORES BASALES Y LÍMITES:
   - Hcto Inicial: ${hctInitial}% (Hb est: ${hbInitial} g/dL) ➔ Hcto Meta Permisible: ${hctTarget}% (Hb meta: ${hbTarget} g/dL)
   - Pérdida Sanguínea Permisible Máxima (MABL): ${mablMl} mL
   - Sangrado Quirúrgico Registrado: ${currentLossMl} mL (${lossPercentage}% del EBV)
   - Margen Remanente antes de Transfusión: ${remainingAllowableMl} mL

2. ESTADIFICACIÓN ATLS DE SHOCK:
   - Estado: ${shockClass} [${shockSeverity}]
   - Conducta: ${fluidStrategy}

3. GUÍA DE REPOSICIÓN Y HEMODERIVADOS:
   - Cristaloides Balanceados (3:1): ${Math.round(currentLossMl * 3)} mL (ó 1.5:1: ${Math.round(currentLossMl * 1.5)} mL)
   - Concentrado de Hematíes (PRBC): ~${prbcUnitsEstimated > 0 ? `${prbcUnitsEstimated} Unidad(es) adulto` : 'Aún no requerido por cálculo'} (${prbcPediatricMl} mL en pediatría)
   - Ácido Tranexámico: Carga ${txaLoadingDose} | Mantenimiento: ${txaMaintDose}
   - Plasma Fresco Congelado (PFC 10-15 mL/kg): ${Math.round(weightKg * 12)} mL (si coagulopatía o sangrado masivo)
   - Fibrinógeno meta > 1.5 - 2.0 g/L | Calcio Gluconato 1-2g IV por cada 4 unidades de PRBC (prevención de toxicidad por citrato)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Calculadora de Pérdidas Sanguíneas Permisibles (MABL)</h3>
                <span className="px-2 py-0.5 rounded-md bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase tracking-wider">
                  Fórmula de Gross & PTM
                </span>
              </div>
              <p className="text-xs text-slate-400">Volemia estimada por grupo de edad, umbral transfusional, estadificación de shock hemorrágico y reposición guiada.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyMabl}
            className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition-all shadow-md shadow-rose-600/25 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Cálculo MABL Copiado!' : 'Copiar Reporte MABL'}</span>
          </button>
        </div>

        {/* PATIENT SELECTION & BASIC INPUTS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/60">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Tipo de Paciente</label>
            <select
              value={patientType}
              onChange={(e) => setPatientType(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
            >
              <option value="adult_male">Hombre Adulto (70 mL/kg)</option>
              <option value="adult_female">Mujer Adulta (65 mL/kg)</option>
              <option value="obese">Obeso IMC ≥30 (60 mL/kg)</option>
              <option value="child">Niño 1 - 12 años (75 mL/kg)</option>
              <option value="infant">Lactante 1 - 12 meses (80 mL/kg)</option>
              <option value="neonate">Neonato a término (85 mL/kg)</option>
              <option value="pregnant">Embarazada a término (90 mL/kg)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Peso del Paciente</label>
            <CleanNumberInput
              min={1}
              max={250}
              step={1}
              value={weightKg}
              onChange={setWeightKg}
              suffix="kg"
            />
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-2 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">Volemia Total (EBV)</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-rose-400">{totalEbv} mL</span>
              <span className="text-[10px] text-slate-400 font-mono">({ebvFactor} mL/kg)</span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-lg p-2 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase">MABL Máximo Permisible</span>
            <span className="text-base font-black text-amber-300">{mablMl} mL</span>
          </div>
        </div>
      </div>

      {/* HEMATOCRIT & HEMOGLOBIN PARAMETERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* PANEL 1: PARÁMETROS HEMATOLÓGICOS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Parámetros Hematológicos</h4>
            </div>

            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('hct')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  inputMode === 'hct' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hematocrito (%)
              </button>
              <button
                type="button"
                onClick={() => setInputMode('hb')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  inputMode === 'hb' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hemoglobina (g/dL)
              </button>
            </div>
          </div>

          {inputMode === 'hct' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hcto Inicial (%)</label>
                <CleanNumberInput
                  min={15}
                  max={65}
                  step={1}
                  value={hctInitial}
                  onChange={(val) => {
                    setHctInitial(val);
                    setHbInitial(Number((val / 3).toFixed(1)));
                  }}
                  suffix="%"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hcto Mínimo Target (%)</label>
                <CleanNumberInput
                  min={15}
                  max={50}
                  step={1}
                  value={hctTarget}
                  onChange={(val) => {
                    setHctTarget(val);
                    setHbTarget(Number((val / 3).toFixed(1)));
                  }}
                  suffix="%"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hb Inicial (g/dL)</label>
                <CleanNumberInput
                  min={5}
                  max={22}
                  step={0.1}
                  value={hbInitial}
                  onChange={(val) => {
                    setHbInitial(val);
                    setHctInitial(Math.round(val * 3));
                  }}
                  suffix="g/dL"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Hb Mínima Target (g/dL)</label>
                <CleanNumberInput
                  min={5}
                  max={15}
                  step={0.1}
                  value={hbTarget}
                  onChange={(val) => {
                    setHbTarget(val);
                    setHctTarget(Math.round(val * 3));
                  }}
                  suffix="g/dL"
                />
              </div>
            </div>
          )}

          {/* GROSS FORMULA DISPLAY */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Fórmula de Gross:</span>
              <span className="font-mono text-cyan-300 font-bold">MABL = EBV × [(Hcto_i - Hcto_min) / Hcto_medio]</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold">Pérdida Permisible Calculada:</span>
              <span className="text-lg font-black text-amber-400 font-mono">{mablMl} mL</span>
            </div>
            <p className="text-[10px] text-slate-400">
              Corresponde al volumen máximo que el paciente puede perder antes de que su hematocrito caiga por debajo del valor target fijado ({hctTarget}% / {hbTarget} g/dL).
            </p>
          </div>
        </div>

        {/* PANEL 2: MONITOREO DEL SANGRADO QUIRÚRGICO EN TIEMPO REAL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Sangrado Quirúrgico Real</h4>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded">Monitor Dinámico</span>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Volumen de Sangre Perdida en Cirugía (mL)
            </label>
            <CleanNumberInput
              min={0}
              max={10000}
              step={25}
              value={currentLossMl}
              onChange={setCurrentLossMl}
              suffix="mL"
            />
          </div>

          {/* VISUAL SHOCK AND MARGIN STATUS */}
          <div className={`p-3 rounded-xl border ${shockColor} space-y-2`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider">{shockClass}</span>
              <span className="text-xs font-bold font-mono">{lossPercentage}% volemia</span>
            </div>
            <p className="text-xs font-semibold text-slate-200">{shockSeverity}</p>
            <p className="text-[11px] text-slate-300 pt-1 border-t border-white/10">{fluidStrategy}</p>
          </div>

          {/* REMAINING MARGIN */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Margen restante antes de transfusión:</span>
            <span className={`font-black font-mono text-sm ${remainingAllowableMl > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {remainingAllowableMl > 0 ? `${remainingAllowableMl} mL permitidos` : '¡LÍMITE MABL EXCEDIDO!'}
            </span>
          </div>
        </div>
      </div>

      {/* TRANSFUSION & PHARMACOLOGICAL RESUSCITATION PROTOCOL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Layers className="w-5 h-5 text-rose-400" />
          <h4 className="text-sm font-black text-white">Guía de Reposición Guiada, Hemoderivados & Antifibrinolíticos</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* CRISTALOIDES Y COLOIDES */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <strong className="text-cyan-300 block text-xs">1. Cristaloides vs Coloides</strong>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Cristaloides (3:1 clásico):</span>
                <span className="font-bold text-cyan-400 font-mono">{Math.round(currentLossMl * 3)} mL</span>
              </div>
              <div className="flex justify-between">
                <span>Cristaloides (1.5:1 moderno):</span>
                <span className="font-bold text-cyan-400 font-mono">{Math.round(currentLossMl * 1.5)} mL</span>
              </div>
              <div className="flex justify-between">
                <span>Coloides / Albúmina (1:1):</span>
                <span className="font-bold text-slate-200 font-mono">{currentLossMl} mL</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-1">
              Preferir soluciones balanceadas (Plasmalyte o Ringer) para evitar acidosis hiperclorémica inducida por SSN 0.9%.
            </p>
          </div>

          {/* HEMODERIVADOS ESPECÍFICOS */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <strong className="text-rose-400 block text-xs">2. Concentrado de Hematíes & PFC</strong>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span>Concentrado Hematíes (PRBC):</span>
                <span className="font-bold text-rose-400 font-mono">
                  {currentLossMl > mablMl ? `~${prbcUnitsEstimated || 1} Unidad(es)` : 'No requerido'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Plasma Fresco (10-15 mL/kg):</span>
                <span className="font-bold text-amber-400 font-mono">{Math.round(weightKg * 12)} mL</span>
              </div>
              <div className="flex justify-between">
                <span>Plaquetas (1U / 10 kg):</span>
                <span className="font-bold text-slate-200 font-mono">{Math.max(1, Math.round(weightKg / 10))} U</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-1">
              1 U de PRBC (~250-300 mL) incrementa la Hb en ~1 g/dL o el Hcto en ~3% en un adulto de 70 kg.
            </p>
          </div>

          {/* ÁCIDO TRANEXÁMICO & COADYUVANTES */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <strong className="text-emerald-400 block text-xs">3. Ácido Tranexámico & Calcio</strong>
            <div className="space-y-1.5 text-slate-300">
              <div>
                <span className="text-slate-400 text-[11px] block">Dosis de Carga TXA:</span>
                <span className="font-bold text-emerald-400">{txaLoadingDose}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Mantenimiento TXA:</span>
                <span className="font-bold text-emerald-300">{txaMaintDose}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Gluconato de Calcio:</span>
                <span className="font-bold text-slate-200">1 - 2 g IV cada 4U de PRBC</span>
              </div>
            </div>
          </div>
        </div>

        {/* PROTOCOLO DE TRANSFUSIÓN MASIVA (PTM 1:1:1) */}
        <div className="bg-gradient-to-r from-rose-950/50 to-slate-950 p-3.5 rounded-xl border border-rose-500/40 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-rose-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Criterios de Activación del Protocolo de Transfusión Masiva (PTM 1:1:1):</span>
          </div>
          <p className="text-slate-300">
            Activación inmediata ante: Sangrado &gt;150 mL/min, pérdida &gt;50% de la volemia en 3 horas, o Score ABC ≥2 (Mecanismo penetrante, PAS ≤90 mmHg, FC ≥120 lpm, FAST positivo).
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] pt-1 font-mono font-bold text-rose-200">
            <span className="bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/40">1 Paquete PRBC</span>
            <span>:</span>
            <span className="bg-amber-900/60 px-2 py-0.5 rounded border border-amber-500/40">1 Paquete Plasma Fresco</span>
            <span>:</span>
            <span className="bg-cyan-900/60 px-2 py-0.5 rounded border border-cyan-500/40">1 Pool de Plaquetas</span>
          </div>
        </div>
      </div>
    </div>
  );
};

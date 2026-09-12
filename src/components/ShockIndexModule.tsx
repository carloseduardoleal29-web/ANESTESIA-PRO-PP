import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Volume2, Copy, Check, ShieldAlert, Droplets, Heart, FileText, CheckCircle2, ChevronDown, ChevronUp, Zap, Sparkles } from 'lucide-react';
import { playNotificationChime, recordCalculatorUsage } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

export const ShockIndexModule: React.FC = () => {
  // Track calculator usage on mount
  useEffect(() => {
    recordCalculatorUsage('shock_index');
  }, []);

  // Input states
  const [fc, setFc] = useState<number | ''>(100);
  const [pas, setPas] = useState<number | ''>(110);
  const [pad, setPad] = useState<number | ''>(70);
  const [peso, setPeso] = useState<number | ''>(70);

  // Interface states
  const [copiedReport, setCopiedReport] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculadora' | 'protocolo' | 'fluidos' | 'metas' | 'ptm'>('calculadora');
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    fluidos: true,
    metas: true,
    ptm: true,
    vasoactivos: true,
  });

  const toggleSection = (key: string) => {
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fcVal = typeof fc === 'number' ? fc : 0;
  const pasVal = typeof pas === 'number' ? pas : 0;
  const padVal = typeof pad === 'number' ? pad : 0;
  const pesoVal = typeof peso === 'number' ? peso : 70;

  // Calculations
  const shockIndex = pasVal > 0 ? fcVal / pasVal : 0;
  const pamVal = pasVal > 0 && padVal > 0 ? (pasVal + 2 * padVal) / 3 : 0;
  const modifiedShockIndex = pamVal > 0 ? fcVal / pamVal : 0;

  // Fluid dose recommendations
  const bolo20ml = Math.round(pesoVal * 20);
  const bolo30ml = Math.round(pesoVal * 30);

  const handleCopyReport = () => {
    const isClass =
      shockIndex > 1.0
        ? 'SHOCK SEVERO / ALTO RIESGO (IS > 1.0)'
        : shockIndex >= 0.9
        ? 'SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)'
        : shockIndex >= 0.7
        ? 'SHOCK LEVE / ALERTA (IS 0.7 - 0.9)'
        : 'NORMAL (IS 0.5 - 0.7)';

    const text = `[EVALUACIÓN HEMODINÁMICA Y PROTOCOLO DE SHOCK - ANESTESIAPRO]
Fecha/Hora: ${new Date().toLocaleString()}
• Signos Vitales: FC: ${fcVal} bpm | PAS: ${pasVal} mmHg | PAD: ${padVal} mmHg
• PA Media (PAM): ${Math.round(pamVal)} mmHg ${pamVal < 65 ? '⚠️ (HIPOPERFUSIÓN TISULAR <65 mmHg)' : '✅ (Adecuada ≥65 mmHg)'}
• Índice de Shock Clásico (IS = FC/PAS): ${shockIndex.toFixed(2)} [${isClass}]
• Índice de Shock Modificado (MSI = FC/PAM): ${modifiedShockIndex.toFixed(2)} [Meta normal: 0.7 - 1.3]

[PLAN DE REANIMACIÓN RECOMENDADO]
• Solución Ideal: Cristaloides Balanceados (Plasmalyte / Ringer Lactato)
• Bolo de Prueba de Fluidos: ${bolo20ml} mL - ${bolo30ml} mL (${pesoVal} kg x 20-30 mL/kg) o Bolos de 250-500 mL en 15 min.
• Meta PAM: ≥ 65 mmHg (o 60-65 mmHg si hipotensión permisiva en sangrado activo).
• Hemoderivados (si IS > 1.0): Protocolo Transfusión Masiva 1:1:1 (CGR:PFC:Plaquetas) + Ácido Tranexámico 1g IV.
Evaluado por AnestesiaPro (Dr. Carlos Leal).`;

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border-2 border-rose-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                Módulo Especializado • Anestesiología
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                Dr. Carlos Leal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span className="text-rose-500">🩸</span> Índice de Shock & Reanimación Hemodinámica
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Herramienta de precisión para la detección precoz de choque hipovolémico, hemorrágico y séptico, con cálculo automatizado de <strong>IS, MSI y PAM</strong>, y guía de reposición de volumen por metas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyReport}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? '¡Reporte Copiado!' : 'Copiar Reporte Clínico'}</span>
            </button>
            <button
              onClick={() => playNotificationChime()}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-amber-400 transition-all cursor-pointer"
              title="Probar sonido de alerta"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TOP NAVIGATION SELECTOR */}
        <div className="flex items-center gap-1.5 mt-5 overflow-x-auto scrollbar-none pt-2 border-t border-slate-800">
          {[
            { id: 'calculadora', label: '📊 Calculadora & PAM', icon: Activity },
            { id: 'protocolo', label: '🚨 Protocolo de Reanimación', icon: ShieldAlert },
            { id: 'fluidos', label: '💧 Hidratación & Solución Ideal', icon: Droplets },
            { id: 'metas', label: '🎯 Metas de Reanimación', icon: CheckCircle2 },
            { id: 'ptm', label: '🩸 Transfusión Masiva (PTM)', icon: Heart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/50'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Índice de Shock & Protocolo de Reanimación Hemodinámica"
        description="Estratificación rápida del paciente crítico: Índice de Shock (IS) e Índice Modificado (MSI), clasificación de hipovolemia, metas de PAM ≥65 mmHg, bolos de fluidos y protocolo de transfusión masiva (PTM 1:1:1)."
        shareText="🚨 Colega, te recomiendo revisar la Calculadora de Índice de Shock & Reanimación Hemodinámica en AnestesiaPro: estratificación inmediata de choque hipovolémico/hemorrágico, metas de reposición y protocolo PTM 1:1:1:"
        tabParam="indiceShock"
        theme="rose"
      />

      {/* SECTION 1: CALCULATOR & REAL-TIME PARAMETERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            <span>Ingreso de Parámetros Hemodinámicos del Paciente</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Actualización automática en tiempo real</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-xs font-black text-slate-300 mb-1.5">
              Frecuencia Cardíaca (FC)
            </label>
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
              <input
                type="number"
                min={30}
                max={250}
                value={fc}
                onChange={(e) => setFc(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent font-black text-lg text-cyan-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">bpm</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 mb-1.5">
              PA Sistólica (PAS)
            </label>
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
              <input
                type="number"
                min={40}
                max={260}
                value={pas}
                onChange={(e) => setPas(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent font-black text-lg text-emerald-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">mmHg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 mb-1.5">
              PA Diastólica (PAD)
            </label>
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
              <input
                type="number"
                min={20}
                max={180}
                value={pad}
                onChange={(e) => setPad(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent font-black text-lg text-amber-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">mmHg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 mb-1.5">
              Peso Corporal Estimado
            </label>
            <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-700">
              <input
                type="number"
                min={30}
                max={200}
                value={peso}
                onChange={(e) => setPeso(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-transparent font-black text-lg text-indigo-400 focus:outline-none"
              />
              <span className="text-xs text-slate-500 font-bold">kg</span>
            </div>
          </div>
        </div>

        {/* PROMINENT MEAN ARTERIAL PRESSURE (PAM / PA MEDIA) HIGHLIGHT BOX */}
        <div
          className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl transition-all ${
            pamVal > 0 && pamVal < 65
              ? 'bg-gradient-to-r from-red-950 via-rose-900/80 to-slate-950 border-rose-500 text-rose-100 animate-pulse'
              : 'bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-950 border-cyan-400 text-cyan-100'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`p-3 rounded-2xl shrink-0 font-black text-xl border shadow-inner ${
                pamVal > 0 && pamVal < 65 ? 'bg-rose-900 border-rose-400 text-white' : 'bg-cyan-900/80 border-cyan-400 text-cyan-200'
              }`}
            >
              PAM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                  🎯 PRESIÓN ARTERIAL MEDIA (PA MEDIA / PAM)
                </span>
                <span className="text-[10px] bg-slate-900 border border-cyan-500/40 text-cyan-300 font-extrabold px-2 py-0.5 rounded-md">
                  Fórmula: [PAS + 2(PAD)] / 3
                </span>
              </div>
              <p className="text-xs font-medium text-slate-200 mt-1">
                {pamVal > 0 ? (
                  pamVal < 65 ? (
                    <span className="text-rose-200 font-extrabold">
                      🚨 PAM = {Math.round(pamVal)} mmHg (&lt; 65 mmHg): ALERTA CRÍTICA DE HIPOPERFUSIÓN TISULAR INTRAOPERATORIA.
                    </span>
                  ) : (
                    <span className="text-emerald-300 font-extrabold">
                      ✅ PAM = {Math.round(pamVal)} mmHg (≥ 65 mmHg): Presión de perfusión tisular adecuada para autoregulación renal y cerebral.
                    </span>
                  )
                ) : (
                  'Ingrese PAS y PAD para ver la Presión Arterial Media calculada.'
                )}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400 block">PA Media (PAM)</span>
            <span className={`text-3xl font-black ${pamVal > 0 && pamVal < 65 ? 'text-rose-400' : 'text-cyan-300'}`}>
              {pamVal > 0 ? Math.round(pamVal) : '--'}
              <span className="text-sm font-bold text-slate-400 ml-1">mmHg</span>
            </span>
          </div>
        </div>

        {/* SHOCK INDEX & MODIFIED SHOCK INDEX DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SHOCK INDEX CLÁSICO */}
          <div
            className={`p-5 rounded-2xl border-2 space-y-2 shadow-lg ${
              shockIndex > 1.0
                ? 'bg-rose-950/80 border-rose-500 text-rose-100'
                : shockIndex >= 0.9
                ? 'bg-amber-950/80 border-amber-500 text-amber-100'
                : shockIndex >= 0.7
                ? 'bg-yellow-950/60 border-yellow-500/70 text-yellow-100'
                : 'bg-emerald-950/60 border-emerald-500/70 text-emerald-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider">Índice de Shock Clásico (IS = FC / PAS)</span>
              <span className="text-3xl font-black">{shockIndex > 0 ? shockIndex.toFixed(2) : '--'}</span>
            </div>
            <p className="text-xs font-black uppercase tracking-wide">
              {shockIndex > 1.0
                ? '🚨 SHOCK SEVERO / ALTO RIESGO (IS > 1.0)'
                : shockIndex >= 0.9
                ? '⚠️ SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)'
                : shockIndex >= 0.7
                ? '⚡ SHOCK LEVE / ALERTA (IS 0.7 - 0.9)'
                : '✅ NORMAL (IS 0.5 - 0.7)'}
            </p>
            <p className="text-xs opacity-95 leading-relaxed">
              {shockIndex > 1.0
                ? 'Indicativo de pérdida hemática masiva (>30% volemia), hipoperfusión tisular grave, necesidad inminente de transfusión de hemoderivados y protocolo de trauma/shock.'
                : shockIndex >= 0.9
                ? 'Pérdida sanguínea estimada 20-30% o sepsis temprana. Monitoreo hemodinámico continuo, reanimación con fluidos y preparación de paquete globular.'
                : shockIndex >= 0.7
                ? 'Límite superior o leve depletación de volumen. Evaluar clínica y tendencia.'
                : 'Hemodinamia estable. Ausencia de choque por este marcador.'}
            </p>
          </div>

          {/* MODIFIED SHOCK INDEX (MSI) */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Índice de Shock Modificado (MSI = FC / PAM)</span>
              <span className="text-3xl font-black text-cyan-400">{modifiedShockIndex > 0 ? modifiedShockIndex.toFixed(2) : '--'}</span>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-300">Rango Normal de MSI:</span>
              <span className="text-xs font-black text-cyan-300">0.7 - 1.3</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Un <strong>MSI &gt; 1.3</strong> o <strong>&lt; 0.7</strong> se asocia de forma independiente con mayor mortalidad intraarterial/hospitalaria y requerimiento precoz de vasopresores o hemoderivados.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: PROTOCOLO DE HIDRATACIÓN CORRECTA & SOLUCIÓN IDEAL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-400" />
            <span>Protocolo de Hidratación Correcta, Solución Ideal & Dosis por Objetivos</span>
          </h2>
          <span className="text-xs font-black text-cyan-300 bg-cyan-950 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Resucitación Guiada
          </span>
        </div>

        {/* CRISTALOIDES BALANCEADOS VS SALINA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-500/40">
                <Check className="w-4 h-4 font-black" />
              </span>
              <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wide">
                Solución Ideal: Cristaloides Balanceados
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Plasmalyte / Ringer Lactato / Hartman:</strong> De primera elección en reanimación por shock. Preservan la diferencia de iones fuertes (SID), evitan la acidosis hiperclorémica y reducen la incidencia de lesión renal aguda (LRA) y requerimiento de terapia de reemplazo renal.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/40 space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-950 text-rose-400 rounded-lg border border-rose-500/40">
                <AlertTriangle className="w-4 h-4 font-black" />
              </span>
              <h3 className="text-sm font-black text-rose-300 uppercase tracking-wide">
                Precaución: Solución Salina 0.9% (SSN)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Evitar infusión masiva (&gt;1.5-2 Litros) de SS 0.9%. Produce <strong>acidosis metabólica hiperclorémica</strong> por sobrecarga de Cloruro (154 mEq/L), induciendo vasoconstricción de la arteriola aferente renal e hipotensión refractaria.
            </p>
          </div>
        </div>

        {/* DOSIS SEGÚN OBJETIVOS & PESO */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-black text-cyan-300 uppercase tracking-wide flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Dosis Iniciales Calculadas para el Paciente ({pesoVal} kg):</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">Bolo de Resucitación 20 mL/kg</span>
              <span className="text-xl font-black text-cyan-400">{bolo20ml} mL</span>
              <span className="text-[10px] text-slate-500 block">Infusión rápida en 15-20 min.</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">Bolo de Resucitación 30 mL/kg (Sepsis)</span>
              <span className="text-xl font-black text-indigo-400">{bolo30ml} mL</span>
              <span className="text-[10px] text-slate-500 block">Administrar en las primeras 3 horas.</span>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 block">Estrategia de Mini-Bolos Guiados</span>
              <span className="text-xl font-black text-emerald-400">250 - 500 mL</span>
              <span className="text-[10px] text-slate-500 block">Pasar en 10-15 min y reevaluar volumen sistólico.</span>
            </div>
          </div>
        </div>

        {/* ESTRATEGIA DE HIPOTENSIÓN PERMISIVA */}
        <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl text-xs space-y-2">
          <h4 className="font-black text-amber-300 uppercase tracking-wide flex items-center gap-2">
            <span>🛡️ Hipotensión Permisiva / Reanimación Hemostática (Trauma / Hemorragia Activa):</span>
          </h4>
          <p className="text-amber-100 leading-relaxed">
            En sangrado no controlado (ej. trauma vascular, ruptura de embarazo ectópico, atonía uterina), mantener una <strong>PAM meta entre 60 - 65 mmHg</strong> (PAS 80 - 90 mmHg) hasta lograr el control quirúrgico/hemostático definitivo. Evita la sobre-resucitación con cristaloides, la hipotermia y el lavado (&quot;pop the clot&quot;) de coágulos formados.
          </p>
          <p className="text-rose-300 font-extrabold text-[11px]">
            ⛔ EXCEPCIÓN CRÍTICA: En Traumatismo Craneoencefálico (TCE) concomitante, la PAM meta debe ser ≥ 80 mmHg (Presión de Perfusión Cerebral PPC ≥ 60 mmHg). NO usar hipotensión permisiva en TCE.
          </p>
        </div>
      </div>

      {/* SECTION 3: METAS CLÍNICAS DE REANIMACIÓN */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Metas Claras & Criterios de Éxito en la Reanimación</span>
          </h2>
          <span className="text-xs font-bold text-slate-400">Evaluación Múltiple de Órgano Diana</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Presión Arterial Media (PAM)</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">≥ 65 mmHg</p>
            <p className="text-[11px] text-slate-400">Asegura la presión de perfusión crítica renal y coronaria.</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Gasto Urinario (Diuresis)</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">&gt; 0.5 - 1.0 mL/kg/h</p>
            <p className="text-[11px] text-slate-400">Marcador de perfusión esplácnica y microvascular renal.</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-rose-300">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Lactato Sérico / Aclaramiento</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">&lt; 2.0 mmol/L (&gt;20% / 2h)</p>
            <p className="text-[11px] text-slate-400">Resolución de la glucólisis anaerobia por hipoxia tisular.</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-indigo-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span>Sat. Venosa Central (SvcO2)</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">≥ 70%</p>
            <p className="text-[11px] text-slate-400">Equilibrio adecuado entre aporte (DO2) y consumo de O2 (VO2).</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Llenado Capilar & MOTTING</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">&lt; 2 segundos</p>
            <p className="text-[11px] text-slate-400">Perfusión cutánea distal normal sin moteado (Score Motting 0-1).</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-black text-purple-300">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>Exceso de Base (BE)</span>
            </div>
            <p className="text-slate-300 font-extrabold text-sm">-2 a +2 mEq/L</p>
            <p className="text-[11px] text-slate-400">Normalización del déficit metabólico por perfusión adecuada.</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: PROTOCOLO DE TRANSFUSIÓN MASIVA (PTM) & VASOACTIVOS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Protocolo de Transfusión Masiva (PTM) & Vasopresores Precoces</span>
          </h2>
          <span className="text-xs bg-rose-950 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/40 font-bold">
            Pérdida Hemática &gt;30%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-black text-rose-300 uppercase tracking-wide flex items-center gap-2">
              🩸 Paquete Balanceado 1:1:1
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
              <li><strong>1 Unidad CGR : 1 Unidad PFC : 1 Unidad Plaquetas:</strong> Previene la coagulopatía dilucional grave.</li>
              <li><strong>Ácido Tranexámico (TXA):</strong> Administrar 1g IV en bolo temprano (&lt;3 horas) + 1g IV infusión continua en 8 horas.</li>
              <li><strong>Calcio Cloruro / Gluconato:</strong> Monitorizar Ca++ iónico (&gt;1.1 mmol/L). El citrato de los hemoderivados causa hipocalcemia aguda y vasoactividad alterada.</li>
              <li><strong>Fibrinógeno / Crioprecipitados:</strong> Mantener fibrinógeno &gt; 1.5 - 2.0 g/L (especialmente en hemorragia obstétrica).</li>
            </ul>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="font-black text-cyan-300 uppercase tracking-wide flex items-center gap-2">
              ⚡ Soporte Vasoactivo / Inotrópico Precoz
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-[11px]">
              <li><strong>Noradrenalina (Primera Línea):</strong> Dosis 0.05 - 0.5 mcg/kg/min IV. Iniciar precozmente si PAM &lt; 65 mmHg a pesar de inicio de resucitación.</li>
              <li><strong>Vasopresina:</strong> Dosis fija 0.03 UI/min en vasoplejía o shock séptico refractario a Noradrenalina.</li>
              <li><strong>Dobutamina:</strong> Dosis 2.5 - 20 mcg/kg/min si existe disfunción miocárdica/bajo gasto concomitante (SvcO2 &lt; 70%).</li>
              <li><strong>Hidrocortisona:</strong> 200 mg/día IV en infusión continua si shock séptico refractario a vasopresores.</li>
            </ul>
          </div>
        </div>

        {/* CLINICAL PEARL */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 text-xs text-slate-200 space-y-1">
          <p className="font-black text-cyan-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Perla Anestésica (Dr. Carlos Leal):</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300">
            &quot;En el quirófano, un Índice de Shock (IS) &gt; 0.9 en un paciente joven traumatizado o con hemorragia obstétrica es la primera señal de alarma antes de que la presión arterial colapse. Nunca espere a la hipotensión profunda para iniciar el protocolo de transfusión y vasopresor de soporte. La PAM &gt; 65 mmHg es nuestra brújula de perfusión.&quot;
          </p>
        </div>
      </div>
    </div>
  );
};

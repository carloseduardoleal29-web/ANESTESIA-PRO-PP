import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Flame, HeartCrack, Wind, Activity, CheckCircle2, Droplets, RotateCcw } from 'lucide-react';

interface Props {
  patientWeight: number;
}

export function CrisisChecklists({ patientWeight }: Props) {
  const [activeCrisis, setActiveCrisis] = useState<'last' | 'mh' | 'anaphylaxis' | 'spasm' | 'arrest'>('last');

  // Cálculos de LAST (Emulsión Lipídica 20%)
  const lipidBolusMl = (patientWeight * 1.5).toFixed(1);
  const lipidInfusionMlMin = (patientWeight * 0.25).toFixed(1);
  const lipidInfusionMlHour = (patientWeight * 0.25 * 60).toFixed(0);
  const lipidMaxTotalMl = (patientWeight * 12).toFixed(0);

  // Cálculos de Hipertermia Maligna (Dantroleno 2.5 mg/kg)
  const dantroleneInitialMg = (patientWeight * 2.5).toFixed(0);
  const dantroleneVials = Math.ceil(Number(dantroleneInitialMg) / 20); // 20mg por vial

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-5 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          Protocolos de Crisis & Emergencias Quirúrgicas
        </h2>
        <p className="text-xs text-slate-400">
          Checklists cognitivos estandarizados de soporte vital avanzado con dosificación automática para {patientWeight} kg.
        </p>
      </div>

      {/* Selector de Crisis */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCrisis('last')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeCrisis === 'last'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Droplets className="w-4 h-4" />
          1. LAST (Toxicidad Anestésicos Locales)
        </button>

        <button
          onClick={() => setActiveCrisis('mh')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeCrisis === 'mh'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Flame className="w-4 h-4" />
          2. Hipertermia Maligna
        </button>

        <button
          onClick={() => setActiveCrisis('anaphylaxis')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeCrisis === 'anaphylaxis'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          3. Anafilaxia Perioperatoria
        </button>

        <button
          onClick={() => setActiveCrisis('spasm')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeCrisis === 'spasm'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Wind className="w-4 h-4" />
          4. Bronco/Laringoespasmo
        </button>

        <button
          onClick={() => setActiveCrisis('arrest')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeCrisis === 'arrest'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/25'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <HeartCrack className="w-4 h-4" />
          5. Paro Cardíaco ACLS
        </button>
      </div>

      {/* 1. LAST Protocol */}
      {activeCrisis === 'last' && (
        <div className="bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                PROTOCOLO ASRA 2026
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Rescate con Emulsión Lipídica al 20% (Intralipid)
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Peso del Paciente: {patientWeight} kg</span>
          </div>

          {/* Dosis Exactas Calculadas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 shadow-inner">
              <span className="text-xs text-slate-400 block font-medium">Bolo Inicial IV (1.5 ml/kg)</span>
              <span className="text-3xl font-black text-red-400 font-mono">{lipidBolusMl} ml</span>
              <span className="text-[10px] text-slate-500 block mt-1">Pasar en 1 minuto. Repetir x1 o x2 si persiste colapso.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 shadow-inner">
              <span className="text-xs text-slate-400 block font-medium">Infusión Continua (0.25 ml/kg/min)</span>
              <span className="text-3xl font-black text-amber-400 font-mono">{lipidInfusionMlHour} ml/h</span>
              <span className="text-[10px] text-slate-500 block mt-1">Equivale a {lipidInfusionMlMin} ml/min. Duplicar a 0.5 si la PA sigue baja.</span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 shadow-inner">
              <span className="text-xs text-slate-400 block font-medium">Dosis Máxima Acumulada</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">{lipidMaxTotalMl} ml</span>
              <span className="text-[10px] text-slate-500 block mt-1">Límite superior: 12 ml/kg en las primeras horas.</span>
            </div>
          </div>

          {/* Checklist de Acciones Mandatorias */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2">Checklist Inmediato en Quirófano:</h4>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>Detener inmediatamente</strong> la inyección de cualquier anestésico local y pedir el Carro de LAST (Emulsión Lipídica).
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>Asegurar Vía Aérea:</strong> Oxigenar al 100% y ventilar precozmente para prevenir hipercapnia y acidosis (empeoran la cardiotoxicidad).
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-slate-300">
                <strong>Control de Convulsiones:</strong> Preferir Benzodiacepinas (Midazolam 1-2 mg). Evitar dosis altas de Propofol (depresor miocárdico).
              </span>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="text-rose-200">
                <strong>QUÉ EVITAR:</strong> No usar Vasopresina, bloqueantes de canales de calcio, beta-bloqueantes. Reducir bolos de adrenalina a &lt; 1 mcg/kg para evitar arritmias ventriculares graves.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hipertermia Maligna */}
      {activeCrisis === 'mh' && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PROTOCOLO MHAUS
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Hipertermia Maligna: Rescate con Dantroleno
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Dantroleno sódico IV</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30">
              <span className="text-xs text-slate-400 block font-medium">Dosis Inicial de Dantroleno (2.5 mg/kg)</span>
              <span className="text-3xl font-black text-amber-400 font-mono">{dantroleneInitialMg} mg</span>
              <span className="text-xs text-slate-300 block mt-1 font-semibold">
                Requerimiento inicial: <strong>{dantroleneVials} frascos</strong> de 20 mg.
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Reconstituir cada frasco con 60 ml de agua destilada estéril (no solución salina ni dextrosa).
              </span>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30">
              <span className="text-xs text-slate-400 block font-medium">Flujo y Ventilación Mandatoria</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">FiO2 100%</span>
              <span className="text-xs text-slate-300 block mt-1">
                Aumentar volumen minuto x2 - x3 para barrer la hipercapnia extrema (EtCO2 &gt; 60-80 mmHg).
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span><strong>CERRAR AGENTES VOLÁTILES:</strong> Suspender Sevoflurano, Desflurano, Isoflurano y Succinilcolina. Mantener anestesia con TIVA (Propofol / Opioides).</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span><strong>Filtros de Carbón Activado:</strong> Colocar en ramas inspiratoria y espiratoria, o cambiar máquina de anestesia si es factible. Flujos frescos &gt; 10 L/min.</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span><strong>Enfriamiento Activo:</strong> Soluciones frías a 4°C IV, lavado gástrico/vesical frío. Detener enfriamiento al alcanzar 38.5°C para evitar hipotermia de rebote.</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">4</span>
              <span><strong>Tratar Hipercaliemia Severa:</strong> Cloruro de calcio al 10% (10 ml), Insulina rápida 10 UI + 50 ml Dextrosa al 50%, Bicarbonato de sodio 1 mEq/kg.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Anafilaxia Perioperatoria */}
      {activeCrisis === 'anaphylaxis' && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-400" />
            Manejo de Anafilaxia Severa en Quirófano
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30">
            <span className="text-xs font-bold text-purple-400 block mb-1">FÁRMACO DE ELECCIÓN: Adrenalina (Epinefrina)</span>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong>Grado II (Hipotensión moderada, broncoespasmo leve):</strong> 10 - 20 mcg IV en bolo.</li>
              <li><strong>Grado III (Colapso circulatorio severo, shock):</strong> 50 - 100 mcg IV en bolos titulados cada 1-2 minutos.</li>
              <li><strong>Grado IV (Paro Cardíaco):</strong> 1 mg IV en bolo según algoritmo de PCR.</li>
              <li><strong>Infusión continua si es refractario:</strong> 0.05 - 0.2 mcg/kg/min (ej. 4 mg en 100 ml SSN).</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">Reposición Hídrica Agresiva</span>
              <p className="text-slate-400">Cristaloides tibios a 20 - 30 ml/kg en bolo rápido para contrarrestar la fuga capilar masiva.</p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-1">Terapia Secundaria</span>
              <p className="text-slate-400">Hidrocortisona 200 mg IV o Metilprednisolona 1-2 mg/kg. Clorfenamina / Difenhidramina 25-50 mg IV.</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bronco y Laringoespasmo */}
      {activeCrisis === 'spasm' && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-400" />
            Crisis de Vía Aérea: Broncoespamo & Laringoespasmo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-sm font-bold text-cyan-400 block mb-2">Laringoespasmo Agudo</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>FiO2 100% con presión positiva firme (CPAP con mascarilla facial).</li>
                <li><strong>Maniobra de Larson:</strong> Presión bilateral fuerte en la escotadura mastoidea retroauricular hacia adelante.</li>
                <li>Profundizar anestesia: Bolo de Propofol (0.5 - 1.0 mg/kg).</li>
                <li>Si persiste hipoxemia (SpO2 &lt; 85%): Succinilcolina a dosis bajas (0.1 - 0.2 mg/kg IV) o 1.0 mg/kg completa.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-sm font-bold text-amber-400 block mb-2">Broncoespamo Severo</span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Desconectar y ventilar a mano para valorar resistencia torácica.</li>
                <li>Profundizar plano anestésico: Sevoflurano 5 - 8% (broncodilatador directo).</li>
                <li>Salbutamol en aerosol: 6 - 8 disparos directos en el tubo con adaptador.</li>
                <li>Sulfato de Magnesio: 2 g IV en 10 minutos.</li>
                <li>Ketamina: Bolo de 0.5 - 1.0 mg/kg. Adrenalina 10-20 mcg IV si es refractario.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 5. Paro Cardíaco ACLS en Anestesia */}
      {activeCrisis === 'arrest' && (
        <div className="bg-slate-900 border border-rose-600/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HeartCrack className="w-5 h-5 text-rose-500" />
            Paro Cardiorrespiratorio Perioperatorio (ACLS en Quirófano)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-800/60">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                Ritmos Desfibrilables (FV / TV sin Pulso)
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong>Desfibrilar Inmediato:</strong> 200 J Bifásica (o 360 J Monofásica).</li>
                <li>Reiniciar compresiones torácicas inmediatamente por 2 minutos (100 - 120 cpm).</li>
                <li>Adrenalina 1 mg IV cada 3-5 minutos (después de la 2ª descarga).</li>
                <li>Amiodarona 300 mg bolo IV (tras la 3ª descarga); 2ª dosis 150 mg.</li>
              </ul>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Ritmos No Desfibrilables (AESP / Asistolia)
              </span>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li>Compresiones de alta calidad sin interrupciones.</li>
                <li>Adrenalina 1 mg IV lo antes posible.</li>
                <li><strong>Buscar las causas reversibles (H's y T's perioperatorias):</strong>
                  <span className="block text-[11px] text-slate-400 mt-1">
                    Hipovolemia por sangrado quirúrgico, Hipoxia, Hidrogeniones (acidosis), Hipo/Hiperpotasemia, Hipotermia, Neumotórax a Tensión, Taponamiento, Toxicidad anestésica local (LAST), Tromboembolismo pulmonar.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

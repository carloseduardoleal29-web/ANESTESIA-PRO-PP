import React from 'react';
import { 
  Heart, 
  Brain, 
  Syringe, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Droplets, 
  ShieldAlert, 
  Wind, 
  Stethoscope,
  ShieldCheck
} from 'lucide-react';

interface Props {
  isNightMode?: boolean;
}

export const PreeclampsiaAnesthesiaOverviewCard: React.FC<Props> = ({ isNightMode = false }) => {
  return (
    <div className={`w-full rounded-2xl border-2 transition-all shadow-xl overflow-hidden ${
      isNightMode 
        ? 'bg-slate-950 border-slate-700 text-slate-100' 
        : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* HEADER DE LA INFOGRAFÍA */}
      <div className={`p-4 sm:p-5 text-center border-b ${
        isNightMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2 border bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          Infografía Ejecutiva Anestesiológica
        </div>
        <h3 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
          Preclampsia y Eclampsia
        </h3>
        <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wide uppercase mt-0.5">
          Manejo desde el punto de vista anestesiológico
        </p>
      </div>

      {/* 3 COLUMNAS DEL PROTOCOLO */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 p-4 sm:p-6 gap-6 md:gap-0">
        
        {/* COLUMNA 1: MANEJO HEMODINÁMICO */}
        <div className="md:px-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Header Columna */}
            <div className="rounded-xl py-2.5 px-3 text-center bg-sky-600 text-white shadow-sm">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase block">
                Manejo Hemodinámico
              </span>
            </div>

            {/* Ilustración Gestante & Monitor PA */}
            <div className={`p-3 rounded-xl border flex items-center justify-center gap-4 ${
              isNightMode ? 'bg-slate-900/80 border-slate-800' : 'bg-sky-50/70 border-sky-200'
            }`}>
              <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
                {/* Gestante sentada */}
                <circle cx="35" cy="22" r="12" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2.5" />
                <path d="M26 34C26 34 20 48 20 60C20 72 26 82 38 82C50 82 56 70 56 56C56 46 48 34 40 34" fill="#F472B6" />
                {/* Vientre grávido */}
                <circle cx="46" cy="56" r="16" fill="#FBCFE8" stroke="#DB2777" strokeWidth="2" />
                {/* Manguito de presión arterial en el brazo */}
                <rect x="18" y="44" width="10" height="14" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
                <line x1="28" y1="51" x2="68" y2="51" stroke="#0284C7" strokeWidth="2" strokeDasharray="3 3" />
                {/* Monitor Multiparámetro */}
                <rect x="65" y="32" width="30" height="42" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
                <rect x="68" y="36" width="24" height="20" rx="2" fill="#0284C7" opacity="0.2" />
                {/* Ondas en pantalla */}
                <path d="M70 46H74L76 40L79 50L81 44L83 48H88" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="70" y="66" fill="#F43F5E" fontSize="9" fontWeight="900">160/110</text>
              </svg>

              <div className="text-xs">
                <span className="font-black text-sky-700 dark:text-sky-300 block text-xs">
                  Objetivo PA:
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight block">
                  PAS 135-145 mmHg<br />PAD 85-95 mmHg
                </span>
              </div>
            </div>

            {/* Ítem: Monitoreo PA Continuo */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Monitoreo PA Continuo
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Toma cada 5-15 min en crisis; línea arterial si refractaria
                </span>
              </div>
            </div>

            {/* Ítem: Control Rápido de PA */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-sky-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Control Rápido de PA
                </span>
                <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300">
                  Labetalol • Hidralazina • Nifedipino
                </span>
              </div>
            </div>

            {/* Ítem: Líquidos Endovenosos */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Droplets className="w-5 h-5 text-indigo-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Líquidos Endovenosos
                </span>
                <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                  Restricción estricta (60 - 80 mL/h total)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 2: PROFILAXIS Y MANEJO DE CONVULSIONES */}
        <div className="md:px-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Header Columna */}
            <div className="rounded-xl py-2.5 px-3 text-center bg-rose-600 text-white shadow-sm">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase block">
                Profilaxis &amp; Convulsiones
              </span>
            </div>

            {/* Ilustración Cerebro & MgSO4 */}
            <div className={`p-3 rounded-xl border flex items-center justify-center gap-4 ${
              isNightMode ? 'bg-slate-900/80 border-slate-800' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
                {/* Cerebro humano */}
                <path d="M50 20C40 20 32 26 30 35C26 36 22 41 22 47C22 52 25 56 28 58C28 66 35 72 44 72C46 72 48 71 50 70C52 71 54 72 56 72C65 72 72 66 72 58C75 56 78 52 78 47C78 41 74 36 70 35C68 26 60 20 50 20Z" fill="#F43F5E" opacity="0.25" stroke="#E11D48" strokeWidth="2.5" />
                <path d="M50 24V68M38 32C42 40 40 54 36 62M62 32C58 40 60 54 64 62M32 46H68" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" />
                {/* Médula espinal */}
                <rect x="46" y="72" width="8" height="22" rx="3" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
                {/* Bolsa de infusión MgSO4 */}
                <rect x="72" y="8" width="22" height="28" rx="3" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />
                <path d="M72 16H94" stroke="#6366F1" strokeWidth="1.5" />
                <text x="74" y="26" fill="#4338CA" fontSize="6" fontWeight="bold">MgSO₄</text>
              </svg>

              <div className="text-xs">
                <span className="font-black text-rose-700 dark:text-rose-300 block text-xs">
                  Sulfato de Magnesio:
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight block">
                  Carga: 4g IV en 20 min<br />Mant: 1 a 2 g/hora
                </span>
              </div>
            </div>

            {/* Ítem: Prevención Crisis Convulsiva */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Prevención de Eclampsia
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Antagonista receptor NMDA y vasodilatador cerebral
                </span>
              </div>
            </div>

            {/* Ítem: Rango Terapéutico 4-6 mEq/L */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Rango Terapéutico: 4 - 6 mEq/L
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Vigilar ROT, FR &gt; 12 rpm y diuresis &gt; 30 mL/h
                </span>
              </div>
            </div>

            {/* Ítem: Rescate Convulsión Refractaria */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Rescate en Convulsión Refractaria
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Repetir bolo MgSO₄ 2g o Diazepam / Fenitoína
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 3: PLAN ANESTÉSICO */}
        <div className="md:px-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            {/* Header Columna */}
            <div className="rounded-xl py-2.5 px-3 text-center bg-teal-600 text-white shadow-sm">
              <span className="text-xs sm:text-sm font-black tracking-wider uppercase block">
                Plan Anestésico
              </span>
            </div>

            {/* Ilustración Técnica Neuroaxial */}
            <div className={`p-3 rounded-xl border flex items-center justify-center gap-4 ${
              isNightMode ? 'bg-slate-900/80 border-slate-800' : 'bg-teal-50/70 border-teal-200'
            }`}>
              <svg className="w-16 h-16 shrink-0" viewBox="0 0 100 100" fill="none">
                {/* Paciente sentada de espaldas */}
                <circle cx="50" cy="22" r="11" fill="#FBCFE8" stroke="#0D9488" strokeWidth="2.5" />
                <path d="M34 40C34 40 40 34 50 34C60 34 66 40 66 40L72 80H28L34 40Z" fill="#14B8A6" opacity="0.4" />
                {/* Columna vertebral lumbar */}
                <line x1="50" y1="36" x2="50" y2="78" stroke="#0D9488" strokeWidth="3" strokeDasharray="3 3" />
                {/* Aguja espinal / epidural entrando en L3-L4 */}
                <line x1="82" y1="56" x2="52" y2="56" stroke="#E11D48" strokeWidth="3" strokeLinecap="round" />
                <circle cx="82" cy="56" r="3" fill="#E11D48" />
                {/* Badge técnica neuroaxial */}
                <rect x="10" y="8" width="34" height="16" rx="3" fill="#0D9488" />
                <text x="14" y="20" fill="#FFFFFF" fontSize="7" fontWeight="bold">ESP/PERI</text>
              </svg>

              <div className="text-xs">
                <span className="font-black text-teal-700 dark:text-teal-300 block text-xs">
                  Técnica Neuroaxial:
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight block">
                  De elección para cesárea si plaquetas y coagulación seguras
                </span>
              </div>
            </div>

            {/* Ítem: Evaluar Coagulación & Plaquetas */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-rose-600 dark:text-rose-400 block">
                  ¡Ojo! Evaluar Coagulación
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Espinal: &gt;70,000 /mm³ • Epidural: &gt;80,000 /mm³
                </span>
              </div>
            </div>

            {/* Ítem: Evaluación Vía Aérea */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Wind className="w-5 h-5 text-teal-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Evaluación Vía Aérea
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Anticipar Vía Aérea Difícil por edema mucoso de glotis
                </span>
              </div>
            </div>

            {/* Ítem: Anestesia General y Hemodinámica */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-3 ${
              isNightMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Monitoreo Intraoperatorio
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Prevenir respuesta hipertensiva en laringoscopia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BADGE */}
      <div className={`px-4 py-2.5 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs ${
        isNightMode ? 'bg-slate-900/60 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          AnestesiaPro: Herramienta de Síntesis Rápida para el Anestesiólogo
        </span>
        <span className="text-[10px] text-slate-500">
          Metas clínicas basadas en guías ACOG, FIGO &amp; SOAP
        </span>
      </div>
    </div>
  );
};

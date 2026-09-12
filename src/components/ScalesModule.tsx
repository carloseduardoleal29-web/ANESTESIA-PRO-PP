import React, { useState } from 'react';
import { BarChart2, CheckCircle2, ChevronDown, ChevronUp, Activity, AlertTriangle, Volume2, Copy, Check, ShieldAlert, FileText } from 'lucide-react';
import { BromageDiagram, EvaScaleDiagram, PogoScaleDiagram } from './MedicalDiagrams';
import { playNotificationChime } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

export const ScalesModule: React.FC = () => {
  const [openSubmenu, setOpenSubmenu] = useState<Record<string, boolean>>({
    asaMenu: true,
    shockMenu: true,
    evaMenu: true,
    pogoMenu: true,
    ramsayMenu: true,
    bromageMenu: true,
    aldreteMenu: true,
    rassMenu: true
  });

  const toggleSubMenu = (key: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ASA state
  const [selectedAsa, setSelectedAsa] = useState<string>('ASA1');

  const asaDescriptions: Record<string, { title: string; desc: string; example: string }> = {
    ASA1: {
      title: 'ASA I',
      desc: 'Paciente sano normal sin enfermedades orgánicas, fisiológicas o psiquiátricas.',
      example: 'Paciente joven fit programado para herniorrafia o cirugía plástica menor sin comorbilidades.'
    },
    ASA2: {
      title: 'ASA II',
      desc: 'Paciente con enfermedad sistémica leve sin limitaciones funcionales sustanciales.',
      example: 'Hipertensión bien controlada, diabetes mellitus tipo 2 no insulino-dependiente, asma leve, fumador social, IMC 30-40.'
    },
    ASA3: {
      title: 'ASA III',
      desc: 'Paciente con enfermedad sistémica grave con limitación funcional importante.',
      example: 'Diabetes mal controlada, EPOC moderado/severo, cardiopatía isquémica con angina estable, insuficiencia renal en diálisis regular, antecedentes de IAM > 3 meses.'
    },
    ASA4: {
      title: 'ASA IV',
      desc: 'Paciente con enfermedad sistémica grave que constituye una amenaza constante para la vida.',
      example: 'Angina inestable, insuficiencia cardíaca congestiva descompensada, sepsis, disfunción renal severa sin hemodiálisis, IAM o AIT reciente (<3 meses).'
    },
    ASA5: {
      title: 'ASA V',
      desc: 'Paciente moribundo que no se espera que sobreviva sin la intervención quirúrgica.',
      example: 'Ruptura de aneurisma de aorta abdominal, politraumatismo masivo con shock hemorrágico descompensado, HIC con efecto de masa masivo.'
    },
    ASA6: {
      title: 'ASA VI',
      desc: 'Paciente con muerte cerebral declarada cuyos órganos van a ser donados.',
      example: 'Donante cadavérico en soporte hemodinámico para ablación multiorgánica.'
    }
  };

  // Shock Index state
  const [fcShock, setFcShock] = useState<number | ''>(100);
  const [pasShock, setPasShock] = useState<number | ''>(110);
  const [padShock, setPadShock] = useState<number | ''>(70);
  const [copiedShockAlert, setCopiedShockAlert] = useState(false);
  const [showShockProtocol, setShowShockProtocol] = useState(false);

  const fcVal = typeof fcShock === 'number' ? fcShock : 0;
  const pasVal = typeof pasShock === 'number' ? pasShock : 0;
  const padVal = typeof padShock === 'number' ? padShock : 0;

  const shockIndex = pasVal > 0 ? (fcVal / pasVal) : 0;
  const pamVal = pasVal > 0 && padVal > 0 ? ((pasVal + 2 * padVal) / 3) : 0;
  const modifiedShockIndex = pamVal > 0 ? (fcVal / pamVal) : 0;

  const handleCopyShockReport = () => {
    const isClass = shockIndex > 1.0 
      ? 'SHOCK SEVERO / ALTO RIESGO (IS > 1.0)' 
      : shockIndex >= 0.9 
      ? 'SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)' 
      : shockIndex >= 0.7 
      ? 'SHOCK LEVE / ALERTA (IS 0.7 - 0.9)' 
      : 'NORMAL (IS 0.5 - 0.7)';

    const text = `[REPORTE HEMODINÁMICO Y ÍNDICE DE SHOCK - ANESTESIAPRO]
FC: ${fcVal} bpm | PAS: ${pasVal} mmHg | PAD: ${padVal} mmHg | PAM: ${Math.round(pamVal)} mmHg
- Índice de Shock Clásico (IS = FC/PAS): ${shockIndex.toFixed(2)} [${isClass}]
- Índice de Shock Modificado (MSI = FC/PAM): ${modifiedShockIndex.toFixed(2)}
Evaluado vía AnestesiaPro (Dr. Carlos Leal).`;

    navigator.clipboard.writeText(text);
    setCopiedShockAlert(true);
    setTimeout(() => setCopiedShockAlert(false), 2500);
  };

  // Aldrete Estimator state
  const [aldrete, setAldrete] = useState({
    actividad: 2,
    respiracion: 2,
    circulacion: 2,
    conciencia: 2,
    saturacion: 2
  });

  const totalAldrete =
    aldrete.actividad + aldrete.respiracion + aldrete.circulacion + aldrete.conciencia + aldrete.saturacion;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Escalas Usadas en Anestesiología</h2>
            <p className="text-xs text-slate-400">
              Evaluación estandarizada de estado físico (ASA), dolor, sedación, bloqueo motor y criterios URPA
            </p>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Escalas Clínicas en Anestesiología & URPA"
        description="Baremación estandarizada: Estado Físico ASA I-VI con ejemplos clínicos, Criterios de Aldrete modificado para alta URPA, escala de dolor EVA, bloqueo de Bromage y sedación de Ramsay/RASS."
        shareText="📋 Colega, te recomiendo revisar las Escalas Clínicas de Anestesiología en AnestesiaPro: clasificación ASA I-VI, criterios de alta URPA (Aldrete modificado), Bromage, EVA y sedación Ramsay/RASS:"
        tabParam="escalas"
        theme="cyan"
      />

      {/* 0. Clasificación del Estado Físico ASA */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('asaMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">🫁 Clasificación del Estado Físico ASA (ASA I - VI)</span>
          </div>
          {openSubmenu.asaMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.asaMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              Sistema de estratificación de riesgo quirúrgico perioperatorio estandarizado por la American Society of Anesthesiologists.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {Object.keys(asaDescriptions).map((key) => {
                const isSelected = selectedAsa === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedAsa(key)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-cyan-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                    }`}
                  >
                    {asaDescriptions[key].title}
                  </button>
                );
              })}
            </div>

            <div className="bg-indigo-950/40 border border-indigo-800/60 p-4 rounded-xl">
              <h4 className="text-sm font-extrabold text-cyan-300">{asaDescriptions[selectedAsa].title}</h4>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{asaDescriptions[selectedAsa].desc}</p>
              <div className="mt-2.5 pt-2.5 border-t border-indigo-800/40 text-[11px] text-indigo-200/90 font-medium italic">
                <strong>Ejemplo Clínico:</strong> {asaDescriptions[selectedAsa].example}
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800">
              Bibliografía: ASA House of Delegates Standard Classification of Physical Status.
            </p>
          </div>
        )}
      </div>

      {/* 0.5. ÍNDICE DE SHOCK (SHOCK INDEX & SHOCK INDEX MODIFICADO) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('shockMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">🩸 Índice de Shock (Shock Index: IS & MSI)</span>
            <span className="bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase hidden sm:inline-block">
              Hemorragia & Hipoperfusión
            </span>
          </div>
          {openSubmenu.shockMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.shockMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              El <strong>Índice de Shock (IS = FC / PAS)</strong> es un marcador temprano de inestabilidad hemodinámica e hipoperfusión tisular, superior a los signos vitales aislados para detectar choque hipovolémico u obstructivo antes de que aparezca hipotensión.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Frecuencia Cardíaca (FC)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={30}
                    max={250}
                    value={fcShock}
                    onChange={(e) => setFcShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-cyan-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">bpm</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  PA Sistólica (PAS)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={40}
                    max={260}
                    value={pasShock}
                    onChange={(e) => setPasShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-emerald-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">mmHg</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  PA Diastólica (PAD)
                </label>
                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
                  <input
                    type="number"
                    min={20}
                    max={180}
                    value={padShock}
                    onChange={(e) => setPadShock(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent font-black text-amber-400 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 font-bold">mmHg</span>
                </div>
              </div>
            </div>

            {/* PROMINENT MEAN ARTERIAL PRESSURE (PAM / PA MEDIA) DISPLAY FOR ANESTHESIOLOGISTS */}
            <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md ${
              pamVal > 0 && pamVal < 65
                ? 'bg-gradient-to-r from-red-950/80 via-rose-900/60 to-slate-950 border-red-500/80 text-red-100'
                : 'bg-gradient-to-r from-cyan-950/80 via-indigo-950/60 to-slate-950 border-cyan-400/60 text-cyan-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl shrink-0 font-black text-lg border ${
                  pamVal > 0 && pamVal < 65 ? 'bg-red-900/80 border-red-400 text-red-200' : 'bg-cyan-900/80 border-cyan-400 text-cyan-200'
                }`}>
                  PAM
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                      🎯 PRESIÓN ARTERIAL MEDIA (PAM)
                    </span>
                    <span className="text-[10px] bg-cyan-950 border border-cyan-400/40 text-cyan-300 font-bold px-2 py-0.5 rounded-md">
                      [PAS + 2(PAD)] / 3
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {pamVal > 0 ? (
                      pamVal < 65 ? (
                        <span className="text-rose-300 font-bold">⚠️ PAM &lt; 65 mmHg: Hipoperfusión tisular intraoperatoria. Riesgo de lesión renal/miocárdica aguda.</span>
                      ) : (
                        <span className="text-emerald-300 font-bold">✅ PAM ≥ 65 mmHg: Rango de perfusión tisular y autoregulación de órganos diana adecuado.</span>
                      )
                    ) : (
                      'Ingrese PAS y PAD para calcular la Presión Arterial Media automatizada.'
                    )}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-400 block">PA Media Actual</span>
                <span className={`text-3xl font-black ${pamVal > 0 && pamVal < 65 ? 'text-rose-400' : 'text-cyan-300'}`}>
                  {pamVal > 0 ? Math.round(pamVal) : '--'}
                  <span className="text-sm font-normal text-slate-400 ml-1">mmHg</span>
                </span>
              </div>
            </div>

            {/* HIGH-RISK CLINICAL ALERT BANNER */}
            {(shockIndex >= 0.9 || modifiedShockIndex > 1.3) && (
              <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-500 rounded-2xl p-4 text-white shadow-xl animate-pulse space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-rose-300 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-rose-100 uppercase tracking-wide">
                        🚨 ALERTA CRÍTICA: RIESGO DE SHOCK / HIPOPERFUSIÓN TISULAR
                      </h4>
                      <p className="text-xs text-rose-200 mt-0.5">
                        {shockIndex > 1.0 
                          ? 'Índice de Shock > 1.0: Compatible con hemorragia de Grado III-IV (>30% de volemia) o disfunción hemodinámica severa.' 
                          : 'Índice de Shock 0.9 - 1.0: Datos iniciales de hipoperfusión. Alto riesgo de descompensación hemodinámica.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => playNotificationChime()}
                    className="p-2 bg-rose-900/80 hover:bg-rose-800 border border-rose-400/50 rounded-xl text-rose-200 hover:text-white transition-all shrink-0 cursor-pointer"
                    title="Emitir tono de alerta hemodinámica"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-800/80">
                  <button
                    onClick={() => setShowShockProtocol(!showShockProtocol)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>{showShockProtocol ? 'Ocultar Protocolo' : 'Ver Protocolo de Reanimación'}</span>
                  </button>

                  <button
                    onClick={handleCopyShockReport}
                    className="bg-slate-900/90 hover:bg-slate-800 text-rose-200 border border-rose-500/40 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedShockAlert ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedShockAlert ? '¡Reporte Copiado!' : 'Copiar Informe'}</span>
                  </button>
                </div>

                {/* EXPANDABLE PROTOCOL GUIDE */}
                {showShockProtocol && (
                  <div className="mt-3 bg-slate-950 p-3.5 rounded-xl border border-rose-500/50 text-xs text-slate-200 space-y-2 animate-fadeIn">
                    <p className="font-black text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      <span>Protocolo de Manejo Rápido (Shock Hemorrágico / Hipovolémico):</span>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                      <li><strong>Accesos Venosos:</strong> Colocar 2 vías periféricas de gran calibre (14G o 16G) o vía central si está disponible.</li>
                      <li><strong>Hemoderivados & Transfusión Masiva:</strong> Prealerta a banco de sangre. Ratio equilibrado 1:1:1 (Concentrado de Glóbulos Rojos : Plasma Fresco Congelado : Plaquetas).</li>
                      <li><strong>Ácido Tranexámico (TXA):</strong> Administrar 1g IV en bolo temprano (&lt;3 horas desde el evento) y posterior infusión de 1g en 8h.</li>
                      <li><strong>Soporte Vasoactivo:</strong> Iniciar Noradrenalina precoz si PAM &lt; 65 mmHg a pesar de inicio de resucitación.</li>
                      <li><strong>Control Hemostático Definitivo:</strong> Empaquetamiento, pinzamiento arterial quirúrgico o embolización angiográfica inmediata.</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* RESULTS DASHBOARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* SHOCK INDEX CLÁSICO */}
              <div className={`p-4 rounded-2xl border ${
                shockIndex > 1.0
                  ? 'bg-rose-950/60 border-rose-500/80 text-rose-100'
                  : shockIndex >= 0.9
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-100'
                  : shockIndex >= 0.7
                  ? 'bg-yellow-950/40 border-yellow-500/60 text-yellow-100'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-100'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider">Índice de Shock Clásico (FC / PAS)</span>
                  <span className="text-2xl font-black">{shockIndex > 0 ? shockIndex.toFixed(2) : '--'}</span>
                </div>
                <p className="text-xs font-bold mt-2">
                  {shockIndex > 1.0
                    ? '🚨 SHOCK SEVERO / ALTO RIESGO (IS > 1.0)'
                    : shockIndex >= 0.9
                    ? '⚠️ SHOCK MODERADO / HIPOPERFUSIÓN (IS 0.9 - 1.0)'
                    : shockIndex >= 0.7
                    ? '⚡ SHOCK LEVE / ALERTA (IS 0.7 - 0.9)'
                    : '✅ NORMAL (IS 0.5 - 0.7)'}
                </p>
                <p className="text-[11px] opacity-90 mt-1">
                  {shockIndex > 1.0
                    ? 'Indicativo de pérdida hemática masiva (>30%), hipoperfusión grave, necesidad inminente de transfusión de hemoderivados y protocolo de trauma/shock.'
                    : shockIndex >= 0.9
                    ? 'Sugiere pérdida sanguínea ~20-30% o sepsis temprana. Monitoreo continuo, reanimación con fluidos y preparación de hemoderivados.'
                    : shockIndex >= 0.7
                    ? 'Límite superior normal o leve depletación de volumen. Vigilar tendencia.'
                    : 'Hemodinamia estable. Ausencia de datos de hipoperfusión por este índice.'}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-700/50 flex items-center justify-between">
                  <button
                    onClick={handleCopyShockReport}
                    className="text-[11px] font-extrabold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedShockAlert ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedShockAlert ? '¡Reporte Copiado!' : 'Copiar Informe Clínico'}</span>
                  </button>

                  <button
                    onClick={() => playNotificationChime()}
                    className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    title="Probar sonido de alerta"
                  >
                    <Volume2 className="w-3 h-3 text-amber-400" />
                    <span>Tono Alerta</span>
                  </button>
                </div>
              </div>

              {/* MODIFIED SHOCK INDEX (MSI) */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">Índice de Shock Modificado (FC / PAM)</span>
                  <span className="text-2xl font-black text-cyan-400">{modifiedShockIndex > 0 ? modifiedShockIndex.toFixed(2) : '--'}</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl border border-cyan-500/30 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">🎯 PA Media (PAM):</span>
                  <span className={`text-sm font-black ${pamVal > 0 && pamVal < 65 ? 'text-rose-400' : 'text-cyan-300'}`}>
                    {pamVal > 0 ? Math.round(pamVal) : '--'} mmHg
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  <strong>Puntos de corte MSI:</strong> Normal: 0.7 - 1.3 &bull; Anormal (&gt;1.3 o &lt;0.7): Alto riesgo de vasoplejía o choque.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-800/40 text-[11px] text-slate-300 space-y-1.5">
              <p className="font-bold text-cyan-300 flex items-center gap-1.5">
                <span>💡 Perla Clínica Anestésica (Dr. Carlos Leal):</span>
              </p>
              <p>
                En anestesia intraoperatoria, la <strong>Presión Arterial Media (PAM)</strong> es el determinante crítico de autoregulación renal, cerebral y coronaria. Mantener una <strong>PAM ≥ 65 mmHg</strong> reduce drásticamente el riesgo de infarto miocárdico o falla renal aguda perioperatoria. El Índice de Shock Modificado (MSI = FC/PAM) combina esta variable vital con la frecuencia cardíaca.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 1. Escala Visual Análoga (EVA / VAS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('evaMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Escala Visual Análoga del Dolor (EVA / VAS) con Imágenes</span>
          </div>
          {openSubmenu.evaMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.evaMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Herramienta psicométrica unidimensional validada para la medición objetiva de la intensidad del dolor postoperatorio, guiando la escalera analgésica de la OMS.
            </p>
            <EvaScaleDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Huskisson EC. Measurement of pain. Lancet. 1974.
            </p>
          </div>
        )}
      </div>

      {/* 2. Escala POGO (Percentage of Glottic Opening) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('pogoMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Escala POGO (Percentage of Glottic Opening) con Imágenes</span>
          </div>
          {openSubmenu.pogoMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.pogoMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Evaluación cuantitativa directa de la exposición laríngea en laringoscopia directa y videolaringoscopia (0% a 100%), con mayor reproducibilidad inter-observador que Cormack-Lehane.
            </p>
            <PogoScaleDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Levitan RM, et al. Assessment of airway visualization using the percentage of glottic opening (POGO) scale. Acad Emerg Med. 1998.
            </p>
          </div>
        )}
      </div>

      {/* 3. Ramsay */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('ramsayMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Escala de Sedación de Ramsay</span>
          </div>
          {openSubmenu.ramsayMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.ramsayMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Creada para evaluar la profundidad de la sedación en pacientes críticos o bajo sedoanalgesia en salas de procedimientos, permitiendo titulación precisa de medicación.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-amber-400 block">Nivel 1</span>
                Despierto, ansioso, agitado o inquieto.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-emerald-400 block">Nivel 2 (Objetivo ideal)</span>
                Despierto, cooperador, tranquilo y orientado.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-cyan-400 block">Nivel 3</span>
                Sedado, responde únicamente a órdenes verbales.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-blue-400 block">Nivel 4</span>
                Sueño profundo, respuesta rápida al estímulo glabelar o auditivo fuerte.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-indigo-400 block">Nivel 5</span>
                Sueño profundo, respuesta perezosa o perezosa al estímulo doloroso.
              </div>
              <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="font-extrabold text-rose-400 block">Nivel 6</span>
                Sin respuesta a estímulos (anestesia profunda).
              </div>
            </div>
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Ramsay MA, et al. Controlled sedation with alphaxalone-alphadolone. Br Med J. 1974.
            </p>
          </div>
        )}
      </div>

      {/* 2. Bromage */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('bromageMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Escala de Bloqueo Motor (Bromage)</span>
          </div>
          {openSubmenu.bromageMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.bromageMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Valoración continua del bloqueo motor en miembros inferiores en anestesia neuraxial (espinal o epidural) durante la recuperación postoperatoria.
            </p>
            <BromageDiagram />
            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Bromage PR. Acta Anaesthesiol Scand. 1965.
            </p>
          </div>
        )}
      </div>

      {/* 3. Aldrete Index + Interactive Calculator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('aldreteMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Índice de Aldrete (Recuperación Postanestésica URPA)</span>
          </div>
          {openSubmenu.aldreteMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.aldreteMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-4 leading-relaxed">
            <p className="text-slate-300">
              Sistema objetivo para valorar la estabilidad del paciente en URPA (Unidad de Recuperación Postanestésica). Un puntaje <strong>≥ 9 puntos</strong> indica aptitud para egreso a sala general.
            </p>

            {/* Interactive Aldrete Selector */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase text-cyan-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Calculadora Interactiva de Aldrete
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                {/* Actividad */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">1. Actividad Motora</label>
                  <select
                    value={aldrete.actividad}
                    onChange={(e) => setAldrete((p) => ({ ...p, actividad: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Mueve 4 extremidades (2 pts)</option>
                    <option value={1}>Mueve 2 extremidades (1 pt)</option>
                    <option value={0}>Mueve 0 extremidades (0 pts)</option>
                  </select>
                </div>

                {/* Respiración */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">2. Respiración</label>
                  <select
                    value={aldrete.respiracion}
                    onChange={(e) => setAldrete((p) => ({ ...p, respiracion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Capaz de toser/respirar profundo (2 pts)</option>
                    <option value={1}>Disnea o respiración limitada (1 pt)</option>
                    <option value={0}>Apnea / Asistencia mecánica (0 pts)</option>
                  </select>
                </div>

                {/* Circulación */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">3. Circulación (PA)</label>
                  <select
                    value={aldrete.circulacion}
                    onChange={(e) => setAldrete((p) => ({ ...p, circulacion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>PA ± 20% del nivel preanestésico (2 pts)</option>
                    <option value={1}>PA ± 20-50% del preanestésico (1 pt)</option>
                    <option value={0}>PA ± &gt;50% del preanestésico (0 pts)</option>
                  </select>
                </div>

                {/* Conciencia */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">4. Conciencia</label>
                  <select
                    value={aldrete.conciencia}
                    onChange={(e) => setAldrete((p) => ({ ...p, conciencia: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Completamente despierto (2 pts)</option>
                    <option value={1}>Responde al llamado (1 pt)</option>
                    <option value={0}>No responde (0 pts)</option>
                  </select>
                </div>

                {/* Saturación */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">5. Saturación O2</label>
                  <select
                    value={aldrete.saturacion}
                    onChange={(e) => setAldrete((p) => ({ ...p, saturacion: Number(e.target.value) }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>SpO2 &gt; 92% a aire ambiente (2 pts)</option>
                    <option value={1}>Requiere O2 para SpO2 &gt; 90% (1 pt)</option>
                    <option value={0}>SpO2 &lt; 90% con O2 suplementario (0 pts)</option>
                  </select>
                </div>
              </div>

              {/* Score result */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  totalAldrete >= 9
                    ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-extrabold text-sm">
                    Puntaje Aldrete: {totalAldrete} / 10 Puntos
                  </span>
                </div>
                <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
                  {totalAldrete >= 9 ? '✅ APTO PARA EGRESO DE URPA' : '⏳ PERMANECER EN URPA'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-1">
              Bibliografía: Aldrete JA, Kroulik D. A postanesthetic recovery score. Anesth Analg. 1970.
            </p>
          </div>
        )}
      </div>

      {/* 4. RASS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSubMenu('rassMenu')}
          className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold text-white">▪️ Escala de Agitación-Sedación Richmond (RASS)</span>
          </div>
          {openSubmenu.rassMenu ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {openSubmenu.rassMenu && (
          <div className="p-4 border-t border-slate-800 text-xs text-slate-200 space-y-3 leading-relaxed">
            <p className="text-slate-300">
              Escala de 10 puntos altamente validada para graduar agitación o profundidad de sedación en anestesia y UCI.
            </p>

            <div className="space-y-1.5 font-medium">
              <div className="p-2 bg-rose-950/40 rounded-xl border border-rose-800/40 text-rose-200 flex justify-between">
                <span><strong>+4 Combativo:</strong> Violento, peligro inmediato para el equipo.</span>
              </div>
              <div className="p-2 bg-rose-950/30 rounded-xl border border-rose-800/30 text-rose-300 flex justify-between">
                <span><strong>+3 Muy agitado:</strong> Jala tubos o catéteres, agresivo.</span>
              </div>
              <div className="p-2 bg-amber-950/30 rounded-xl border border-amber-800/30 text-amber-200 flex justify-between">
                <span><strong>+2 Agitado:</strong> Movimientos desorganizados frecuentes.</span>
              </div>
              <div className="p-2 bg-amber-950/20 rounded-xl border border-amber-800/20 text-amber-300 flex justify-between">
                <span><strong>+1 Inquieto:</strong> Ansioso pero movimientos no agresivos.</span>
              </div>
              <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-500/50 text-emerald-200 font-bold flex justify-between">
                <span><strong>0 Alerta y tranquilo:</strong> Estado óptimo basal.</span>
              </div>
              <div className="p-2 bg-cyan-950/30 rounded-xl border border-cyan-800/30 text-cyan-200 flex justify-between">
                <span><strong>-1 Somnoliento:</strong> Despierta a la voz con contacto visual &gt; 10 seg.</span>
              </div>
              <div className="p-2 bg-indigo-950/30 rounded-xl border border-indigo-800/30 text-indigo-200 flex justify-between">
                <span><strong>-2 Sedación ligera:</strong> Despierta a la voz con contacto visual &lt; 10 seg.</span>
              </div>
              <div className="p-2 bg-blue-950/30 rounded-xl border border-blue-800/30 text-blue-200 flex justify-between">
                <span><strong>-3 Sedación moderada:</strong> Movimiento a la voz pero sin contacto visual.</span>
              </div>
              <div className="p-2 bg-slate-950/50 rounded-xl border border-slate-800 text-slate-300 flex justify-between">
                <span><strong>-4 Sedación profunda:</strong> Sin respuesta a la voz, respuesta al dolor físico.</span>
              </div>
              <div className="p-2 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-400 flex justify-between">
                <span><strong>-5 Sin respuesta:</strong> Sin respuesta a ningún estímulo físico ni verbal.</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic pt-2 border-t border-slate-800">
              Bibliografía: Sessler CN, et al. Am J Respir Crit Care Med. 2002.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

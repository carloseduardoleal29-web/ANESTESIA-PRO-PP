import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, ChevronUp, AlertCircle, Zap } from 'lucide-react';
import { recordCalculatorUsage } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

export const CalculatorModule: React.FC = () => {
  const [peso, setPeso] = useState<number | ''>(70);

  // Track calculator usage
  useEffect(() => {
    recordCalculatorUsage('induccion');
  }, []);

  // Selected drugs
  const [hipnotico, setHipnotico] = useState<string>('propofol');
  const [opioide, setOpioide] = useState<string>('fentanilo');
  const [relajante, setRelajante] = useState<string>('rocuronio');
  const [lidoChecked, setLidoChecked] = useState<boolean>(true);
  const [doseLidocaina, setDoseLidocaina] = useState<number>(1.5); // 1.0 mg/kg or 1.5 mg/kg

  // Selected custom doses
  const [dosePropofol, setDosePropofol] = useState<number>(2);
  const [doseKetamina, setDoseKetamina] = useState<number>(2);
  const [doseFentanilo, setDoseFentanilo] = useState<number>(2);
  const [doseRocuronio, setDoseRocuronio] = useState<number>(0.6);
  const [doseSuccinil, setDoseSuccinil] = useState<number>(1.0);
  const [doseVecuronio, setDoseVecuronio] = useState<number>(0.1);
  const [vecuronioVial, setVecuronioVial] = useState<'4mg' | '10mg'>('4mg'); // Defaults to 4mg (Venezuela presentation)
  const [doseAtracurio, setDoseAtracurio] = useState<number>(0.5);
  const [doseCisa, setDoseCisa] = useState<number>(0.15);

  // Reversal state
  const [reversalMode, setReversalMode] = useState<'sugammadex' | 'neostigmina' | 'none'>('sugammadex');
  const [sugammadexLevel, setSugammadexLevel] = useState<number>(2); // 2, 4, 16 mg/kg
  const [neostigminaDosePerKg, setNeostigminaDosePerKg] = useState<number>(0.05); // mg/kg
  const [atropinaDosePerKg, setAtropinaDosePerKg] = useState<number>(0.015); // mg/kg

  // Accordions
  const [openSubmenu, setOpenSubmenu] = useState<Record<string, boolean>>({
    famInductores: true,
    famOpioides: true,
    famRelajantes: true,
    famAnestesicoLocal: true,
    famReversion: true
  });

  const toggleSubMenu = (key: string) => {
    setOpenSubmenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const safePeso = typeof peso === 'number' && peso > 0 ? peso : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Calculadora de Inducción Anestésica</h2>
            <p className="text-xs text-slate-400">
              Cálculo de dosis farmacológicas de inducción anestésica ajustadas por peso corporal en miligramos y mililitros
            </p>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Calculadora de Inducción Anestésica"
        description="Dosificación farmacológica exacta calculada al instante por peso corporal (mg y mL) para hipnóticos, opioides, relajantes neuromusculares y reversores."
        shareText="🩺 Colega, te recomiendo revisar la Calculadora de Inducción Anestésica en AnestesiaPro: cálculo exacto de dosis ajustadas por peso en mg y mL para hipnóticos, opioides, relajantes neuromusculares y reversores en quirófano:"
        tabParam="calculadora"
        theme="indigo"
      />

      {/* Weight Input Box */}
      <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-700/50 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-cyan-300 block mb-1">
            Peso Corporal del Paciente (KG)
          </label>
          <p className="text-xs text-slate-300">
            Todos los cálculos de hipnóticos, opioides y relajantes se actualizan automáticamente en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-indigo-500/40">
          <span className="text-xs font-bold text-slate-400 pl-2">PESO:</span>
          <input
            type="number"
            min={1}
            max={300}
            value={peso}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const val = e.target.value;
              setPeso(val === '' ? '' : Math.max(0, Number(val)));
            }}
            className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-center text-xl font-black text-cyan-400 focus:outline-none focus:border-cyan-400"
          />
          <span className="text-sm font-bold text-slate-400 pr-2">kg</span>
        </div>
      </div>

      {/* Selectors By Family */}
      <div className="space-y-4">
        {/* 1. Hipnóticos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSubMenu('famInductores')}
            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
          >
            <span className="text-sm font-bold text-white flex items-center gap-2">
              🔹 1. Agentes Hipnóticos (Seleccionar 1)
            </span>
            {openSubmenu.famInductores ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSubmenu.famInductores && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'propofol', name: 'Propofol' },
                  { id: 'midazolam', name: 'Midazolam' },
                  { id: 'ketamina', name: 'Ketamina' },
                  { id: 'etomidato', name: 'Etomidato' },
                  { id: 'tiopental', name: 'Tiopental' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setHipnotico(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      hipnotico === item.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Custom dose dropdowns */}
              {hipnotico === 'propofol' && (
                <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">
                    Dosis Inducción Propofol:
                  </label>
                  <select
                    value={dosePropofol}
                    onChange={(e) => setDosePropofol(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Estándar (2 mg/kg)</option>
                    <option value={3}>Opción 1 (3 mg/kg)</option>
                    <option value={4}>Opción 2 (4 mg/kg)</option>
                    <option value={5}>Opción 3 (5 mg/kg)</option>
                  </select>
                </div>
              )}

              {hipnotico === 'ketamina' && (
                <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Dosis Ketamina:</label>
                  <select
                    value={doseKetamina}
                    onChange={(e) => setDoseKetamina(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Inducción (2 mg/kg)</option>
                    <option value={1}>Sedación (1 mg/kg)</option>
                    <option value={0.5}>Analgesia (0.5 mg/kg)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Opioides */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSubMenu('famOpioides')}
            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
          >
            <span className="text-sm font-bold text-white flex items-center gap-2">
              🔹 2. Opioides Analgésicos (Seleccionar 1)
            </span>
            {openSubmenu.famOpioides ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSubmenu.famOpioides && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fentanilo', name: 'Fentanilo' },
                  { id: 'sufentanil', name: 'Sufentanil' },
                  { id: 'alfentanil', name: 'Alfentanil' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setOpioide(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      opioide === item.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {opioide === 'fentanilo' && (
                <div className="mt-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">
                    Dosis Fentanilo (Rango 2-5 mcg/kg):
                  </label>
                  <select
                    value={doseFentanilo}
                    onChange={(e) => setDoseFentanilo(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={2}>Estándar (2 mcg/kg)</option>
                    <option value={3}>Media (3 mcg/kg)</option>
                    <option value={4}>Alta (4 mcg/kg)</option>
                    <option value={5}>Intensa (5 mcg/kg)</option>
                    <option value={1}>Sedación / Mantenimiento (1 mcg/kg)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3. Relajantes Neuromusculares */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSubMenu('famRelajantes')}
            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
          >
            <span className="text-sm font-bold text-white flex items-center gap-2">
              🔹 3. Bloqueantes Neuromusculares (Seleccionar 1)
            </span>
            {openSubmenu.famRelajantes ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSubmenu.famRelajantes && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'rocuronio', name: 'Rocuronio' },
                  { id: 'succinilcolina', name: 'Succinilcolina' },
                  { id: 'vecuronio', name: 'Vecuronio' },
                  { id: 'atracurio', name: 'Atracurio' },
                  { id: 'cisatracurio', name: 'Cisatracurio' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRelajante(item.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                      relajante === item.id
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {relajante === 'rocuronio' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Rocuronio (0.6 - 1.2 mg/kg):</label>
                  <select
                    value={doseRocuronio}
                    onChange={(e) => setDoseRocuronio(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={0.6}>Estándar (0.6 mg/kg)</option>
                    <option value={1.0}>Secuencia Rápida RSI (1.0 mg/kg)</option>
                    <option value={1.2}>Secuencia Rápida Intensa (1.2 mg/kg)</option>
                  </select>
                </div>
              )}

              {relajante === 'succinilcolina' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Succinilcolina (1.0 - 1.5 mg/kg):</label>
                  <select
                    value={doseSuccinil}
                    onChange={(e) => setDoseSuccinil(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={1.0}>Estándar (1.0 mg/kg)</option>
                    <option value={1.5}>Secuencia Rápida RSI (1.5 mg/kg)</option>
                  </select>
                </div>
              )}

              {relajante === 'vecuronio' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2.5">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Vecuronio (0.08 - 0.1 mg/kg):</label>
                  <select
                    value={doseVecuronio}
                    onChange={(e) => setDoseVecuronio(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={0.1}>Intubación Estándar (0.1 mg/kg)</option>
                    <option value={0.08}>Dosis Baja (0.08 mg/kg)</option>
                  </select>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Presentación / Frasco Liofilizado:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setVecuronioVial('4mg')}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all border cursor-pointer ${
                          vecuronioVial === '4mg'
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        🇻🇪 Frasco 4 mg (Venezuela)
                      </button>
                      <button
                        type="button"
                        onClick={() => setVecuronioVial('10mg')}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all border cursor-pointer ${
                          vecuronioVial === '10mg'
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        Frasco 10 mg
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {relajante === 'atracurio' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Atracurio (0.4 - 0.5 mg/kg):</label>
                  <select
                    value={doseAtracurio}
                    onChange={(e) => setDoseAtracurio(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={0.5}>Estándar (0.5 mg/kg)</option>
                    <option value={0.4}>Dosis Ligera (0.4 mg/kg)</option>
                  </select>
                </div>
              )}

              {relajante === 'cisatracurio' && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">Cisatracurio (0.1 - 0.2 mg/kg):</label>
                  <select
                    value={doseCisa}
                    onChange={(e) => setDoseCisa(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={0.15}>Intubación Estándar (0.15 mg/kg)</option>
                    <option value={0.1}>Intubación Lenta (0.1 mg/kg)</option>
                    <option value={0.2}>Secuencia Rápida (0.2 mg/kg)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Anestésico Local (Lidocaína 1% IV) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSubMenu('famAnestesicoLocal')}
            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
          >
            <span className="text-sm font-bold text-white flex items-center gap-2">
              🔹 4. Anestésico Local (Lidocaína 1% IV)
            </span>
            {openSubmenu.famAnestesicoLocal ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSubmenu.famAnestesicoLocal && (
            <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/40">
              <label
                onClick={() => setLidoChecked(!lidoChecked)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  lidoChecked
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <input type="checkbox" checked={lidoChecked} onChange={() => {}} className="accent-indigo-500 w-4 h-4" />
                <span>Incluir Lidocaína 1% IV (10 mg/mL) en la inducción</span>
              </label>

              {lidoChecked && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <label className="text-xs font-bold text-indigo-300 block mb-1">
                    Dosis de Lidocaína IV:
                  </label>
                  <select
                    value={doseLidocaina}
                    onChange={(e) => setDoseLidocaina(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={1.0}>1.0 mg/kg (Dosis Estándar / Analgesia Sistémica)</option>
                    <option value={1.5}>1.5 mg/kg (Atenuación Respuesta Simpática / Laringoscopia)</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 5. Reversión de Bloqueo Neuromuscular */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <button
            onClick={() => toggleSubMenu('famReversion')}
            className="w-full flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800/80 transition-all text-left"
          >
            <span className="text-sm font-bold text-white flex items-center gap-2">
              ⚡ 5. Reversión de Bloqueo Neuromuscular (Sugammadex, Neostigmina, Atropina)
            </span>
            {openSubmenu.famReversion ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSubmenu.famReversion && (
            <div className="p-4 border-t border-slate-800 space-y-4 bg-slate-950/40">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setReversalMode('sugammadex')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                    reversalMode === 'sugammadex'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  🟢 Sugammadex (Bridion®)
                </button>

                <button
                  type="button"
                  onClick={() => setReversalMode('neostigmina')}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-black transition-all ${
                    reversalMode === 'neostigmina'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  🟡 Neostigmina + Atropina
                </button>

                <button
                  type="button"
                  onClick={() => setReversalMode('none')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all ${
                    reversalMode === 'none'
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  Sin Reversión
                </button>
              </div>

              {reversalMode === 'sugammadex' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-cyan-800/50 space-y-2">
                  <span className="text-xs font-bold text-cyan-300 block">Nivel de Bloqueo a Revertir (Sugammadex):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { val: 2, label: 'Moderado (2 mg/kg)', desc: 'TOF ≥ 2 respuestas' },
                      { val: 4, label: 'Profundo (4 mg/kg)', desc: 'PTC 1-2 respuestas' },
                      { val: 16, label: 'Rescate Emergencia (16 mg/kg)', desc: 'Post-Rocuronio 1.2 mg/kg' }
                    ].map((opt) => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => setSugammadexLevel(opt.val)}
                        className={`p-2 rounded-lg border text-left text-xs font-bold transition-all ${
                          sugammadexLevel === opt.val
                            ? 'bg-cyan-950 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <span className="block text-white">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {reversalMode === 'neostigmina' && (
                <div className="p-3 bg-slate-900/80 rounded-xl border border-amber-800/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-amber-300 font-bold block mb-1">Neostigmina (0.03 - 0.07 mg/kg, máx 5 mg):</label>
                    <select
                      value={neostigminaDosePerKg}
                      onChange={(e) => setNeostigminaDosePerKg(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-amber-400"
                    >
                      <option value={0.03}>0.03 mg/kg (Bloqueo leve / 4 respuestas TOF)</option>
                      <option value={0.05}>0.05 mg/kg (Estándar / 2-3 respuestas TOF)</option>
                      <option value={0.07}>0.07 mg/kg (Bloqueo moderado alto)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-amber-300 font-bold block mb-1">Atropina Co-administrada (0.01 - 0.02 mg/kg):</label>
                    <select
                      value={atropinaDosePerKg}
                      onChange={(e) => setAtropinaDosePerKg(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:border-amber-400"
                    >
                      <option value={0.01}>0.010 mg/kg</option>
                      <option value={0.015}>0.015 mg/kg (Estándar 1 mg Atropina / 2.5 mg Neostigmina)</option>
                      <option value={0.02}>0.020 mg/kg</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Output Results Box */}
      <div className="bg-indigo-950/80 border-2 border-indigo-600/60 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" /> Esquema Calculado para {safePeso} kg
          </h3>
          <span className="text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
            Dosis Ajustadas
          </span>
        </div>

        <div className="space-y-2.5 text-xs md:text-sm text-slate-200">
          {/* Hipnótico result */}
          {hipnotico === 'propofol' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">🔹 Propofol ({dosePropofol} mg/kg):</strong>
                <span className="text-xs text-slate-400">Concentración 1% (10 mg/mL)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * dosePropofol).toFixed(0)} mg</span>
                <span className="text-xs text-cyan-400 font-bold block">
                  ({((safePeso * dosePropofol) / 10).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {hipnotico === 'midazolam' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">🔹 Midazolam (0.2 mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 5 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * 0.2).toFixed(1)} mg</span>
                <span className="text-xs text-cyan-400 font-bold block">
                  ({((safePeso * 0.2) / 5).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {hipnotico === 'ketamina' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">🔹 Ketamina ({doseKetamina} mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 50 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseKetamina).toFixed(0)} mg</span>
                <span className="text-xs text-cyan-400 font-bold block">
                  ({((safePeso * doseKetamina) / 50).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {hipnotico === 'etomidato' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">🔹 Etomidato (0.3 mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 2 mg/mL (10 mL)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * 0.3).toFixed(1)} mg</span>
                <span className="text-xs text-cyan-400 font-bold block">
                  ({((safePeso * 0.3) / 2).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {hipnotico === 'tiopental' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">🔹 Tiopental (4 mg/kg):</strong>
                <span className="text-xs text-slate-400">Frasco ampolla 1g (Reconstituido 2.5%)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * 4).toFixed(0)} mg</span>
              </div>
            </div>
          )}

          {/* Opioide result */}
          {opioide === 'fentanilo' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-indigo-300 block">🔹 Fentanilo ({doseFentanilo} mcg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 50 mcg/mL (0.05 mg/mL)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseFentanilo).toFixed(0)} mcg</span>
                <span className="text-xs text-indigo-400 font-bold block">
                  ({((safePeso * doseFentanilo) / 50).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {opioide === 'sufentanil' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-indigo-300 block">🔹 Sufentanil (1 mcg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 50 mcg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * 1).toFixed(0)} mcg</span>
                <span className="text-xs text-indigo-400 font-bold block">
                  ({((safePeso * 1) / 50).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {opioide === 'alfentanil' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-indigo-300 block">🔹 Alfentanil (15 mcg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 500 mcg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * 15).toFixed(0)} mcg</span>
                <span className="text-xs text-indigo-400 font-bold block">
                  ({((safePeso * 15) / 500).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {/* Relajante result */}
          {relajante === 'rocuronio' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-emerald-300 block">🔹 Rocuronio ({doseRocuronio} mg/kg):</strong>
                <span className="text-xs text-slate-400">Vial 10 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseRocuronio).toFixed(1)} mg</span>
                <span className="text-xs text-emerald-400 font-bold block">
                  ({((safePeso * doseRocuronio) / 10).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {relajante === 'succinilcolina' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-emerald-300 block">🔹 Succinilcolina ({doseSuccinil} mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 50 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseSuccinil).toFixed(0)} mg</span>
                <span className="text-xs text-emerald-400 font-bold block">
                  ({((safePeso * doseSuccinil) / 50).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {relajante === 'vecuronio' && (() => {
            const totalMg = safePeso * doseVecuronio;
            const isVial4 = vecuronioVial === '4mg';
            const vialCap = isVial4 ? 4 : 10;
            const vialsNeeded = (totalMg / vialCap).toFixed(1);
            return (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-emerald-300 block">🔹 Vecuronio ({doseVecuronio} mg/kg):</strong>
                    <span className="text-xs text-slate-300 font-medium">
                      {isVial4 ? '🇻🇪 Frasco Liofilizado 4 mg (Frecuente en Venezuela)' : 'Frasco Liofilizado 10 mg'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-white">{totalMg.toFixed(1)} mg</span>
                    <span className="text-xs text-emerald-400 font-bold block">
                      (~{vialsNeeded} {Number(vialsNeeded) === 1 ? 'vial' : 'viales'})
                    </span>
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <p className="font-bold text-cyan-300">
                    💡 Reconstitución & Dosis a Administrar:
                  </p>
                  {isVial4 ? (
                    <p>
                      Reconstituir frasco de <strong>4 mg</strong> con <strong>4 mL</strong> de Solución Fisiológica 0.9% / Agua Estéril (Concentración: <strong>1 mg/mL</strong>).
                      <br />
                      ➔ Aspirar/administrar: <strong className="text-emerald-300">{totalMg.toFixed(1)} mL</strong> ({vialsNeeded} viales de 4 mg).
                    </p>
                  ) : (
                    <p>
                      Reconstituir frasco de <strong>10 mg</strong> con <strong>5 mL</strong> de diluyente (Concentración: <strong>2 mg/mL</strong>).
                      <br />
                      ➔ Aspirar/administrar: <strong className="text-emerald-300">{(totalMg / 2).toFixed(1)} mL</strong> ({vialsNeeded} viales de 10 mg).
                    </p>
                  )}
                </div>
              </div>
            );
          })()}

          {relajante === 'atracurio' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-emerald-300 block">🔹 Atracurio ({doseAtracurio} mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 10 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseAtracurio).toFixed(1)} mg</span>
                <span className="text-xs text-emerald-400 font-bold block">
                  ({((safePeso * doseAtracurio) / 10).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {relajante === 'cisatracurio' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-emerald-300 block">🔹 Cisatracurio ({doseCisa} mg/kg):</strong>
                <span className="text-xs text-slate-400">Ampolla 2 mg/mL</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseCisa).toFixed(1)} mg</span>
                <span className="text-xs text-emerald-400 font-bold block">
                  ({((safePeso * doseCisa) / 2).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {/* 4. Anestésico Local Lidocaína Result */}
          {lidoChecked && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-indigo-800/50 flex justify-between items-center">
              <div>
                <strong className="text-amber-300 block">🔹 Lidocaína 1% IV ({doseLidocaina} mg/kg):</strong>
                <span className="text-xs text-slate-400">10 mg/mL (Dosis {doseLidocaina === 1.5 ? 'Atenuación Laringoscopia' : 'Estándar / Analgesia'})</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * doseLidocaina).toFixed(1)} mg</span>
                <span className="text-xs text-amber-400 font-bold block">
                  ({((safePeso * doseLidocaina) / 10).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {/* 5. Reversión de Bloqueo Neuromuscular Results */}
          {reversalMode === 'sugammadex' && (
            <div className="p-3 bg-slate-900/90 rounded-xl border border-cyan-500/50 flex justify-between items-center">
              <div>
                <strong className="text-cyan-300 block">⚡ Sugammadex ({sugammadexLevel} mg/kg):</strong>
                <span className="text-xs text-slate-400">Vial 100 mg/mL (Bridion®)</span>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-white">{(safePeso * sugammadexLevel).toFixed(0)} mg</span>
                <span className="text-xs text-cyan-400 font-bold block">
                  ({((safePeso * sugammadexLevel) / 100).toFixed(1)} mL)
                </span>
              </div>
            </div>
          )}

          {reversalMode === 'neostigmina' && (
            <>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/50 flex justify-between items-center">
                <div>
                  <strong className="text-amber-300 block">⚡ Neostigmina ({neostigminaDosePerKg} mg/kg):</strong>
                  <span className="text-xs text-slate-400">Ampolla 0.5 mg/mL (máx 5.0 mg)</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white">
                    {Math.min(5, safePeso * neostigminaDosePerKg).toFixed(2)} mg
                  </span>
                  <span className="text-xs text-amber-400 font-bold block">
                    ({(Math.min(5, safePeso * neostigminaDosePerKg) / 0.5).toFixed(1)} mL)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/50 flex justify-between items-center">
                <div>
                  <strong className="text-amber-300 block">⚡ Atropina Co-administrada ({atropinaDosePerKg} mg/kg):</strong>
                  <span className="text-xs text-slate-400">Ampolla 0.5 mg/mL</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-white">
                    {(safePeso * atropinaDosePerKg).toFixed(2)} mg
                  </span>
                  <span className="text-xs text-amber-400 font-bold block">
                    ({((safePeso * atropinaDosePerKg) / 0.5).toFixed(1)} mL)
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-[11px] text-indigo-300 pt-1 border-t border-indigo-800/50">
          <AlertCircle className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>Titular siempre la dosis según el estado hemodinámico, edad y comorbilidades del paciente.</span>
        </div>
      </div>
    </div>
  );
};

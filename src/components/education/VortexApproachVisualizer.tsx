import React, { useState } from 'react';
import { Wind, ShieldAlert, CheckCircle2, Download, AlertTriangle, ChevronRight, Activity, Sparkles, Eye, Maximize2 } from 'lucide-react';

interface VortexProps {
  onDownload?: () => void;
}

export const VortexApproachVisualizer: React.FC<VortexProps> = ({ onDownload }) => {
  const [activeTab, setActiveTab] = useState<'embudo' | 'optimizacion' | 'pasos' | 'cico'>('embudo');
  const [currentLine, setCurrentLine] = useState<'facial' | 'supraglotico' | 'tubo' | 'verde' | 'cico'>('verde');

  return (
    <div className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-indigo-950 p-5 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              AYUDA COGNITIVA EN TIEMPO REAL
            </span>
            <span className="text-cyan-300 font-bold text-xs">Dr. Nicholas Chrimes (Melbourne) • BJA / DAS</span>
          </div>
          <h3 className="text-lg font-black text-white">
            El Enfoque VORTEX en Vía Aérea Difícil No Prevista
          </h3>
        </div>

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Descargar Guía VORTEX (PDF)</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex flex-wrap gap-2">
        {[
          { id: 'embudo', label: '🌀 El Embudo y Zona Verde' },
          { id: 'optimizacion', label: '🛠️ 5 Optimizaciones (Mejor Esfuerzo)' },
          { id: 'pasos', label: '📋 Algoritmo Paso a Paso' },
          { id: 'cico', label: '🚨 Rescate CICO / eFONA' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="p-5 sm:p-7 space-y-6">
        {activeTab === 'embudo' && (
          <div className="space-y-6">
            {/* Zona Verde Banner */}
            <div className="bg-emerald-950/60 border-2 border-emerald-500/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-lg shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                    LA ZONA VERDE (GREEN ZONE) - META FUNDAMENTAL
                  </h4>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Estado de seguridad donde la entrega alveolar de oxígeno está confirmada (SpO2 estable + curva de capnografía EtCO2 presente).
                  </p>
                </div>
              </div>
              <span className="bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 text-[10px] font-black px-3 py-1 rounded-lg shrink-0 uppercase">
                PAUSAR & PLANIFICAR
              </span>
            </div>

            {/* 3 Líneas de Vida Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setCurrentLine('facial')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  currentLine === 'facial' ? 'bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300">LÍNEA 1: MASCARILLA FACIAL</span>
                  <span className="text-[10px] font-mono bg-cyan-900 px-2 py-0.5 rounded text-cyan-200">Máx 3 intentos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Técnica bimanual C-E / V-E con cánula de Guedel o nasofaríngea y ajuste hermético con capnografía confirmada.
                </p>
              </div>

              <div
                onClick={() => setCurrentLine('supraglotico')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  currentLine === 'supraglotico' ? 'bg-indigo-950/60 border-indigo-400 ring-2 ring-indigo-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300">LÍNEA 2: DISPOSITIVO SUPRAGLÓTICO</span>
                  <span className="text-[10px] font-mono bg-indigo-900 px-2 py-0.5 rounded text-indigo-200">Máx 3 intentos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mascarilla laríngea de 2ª generación (i-gel, ProSeal) con canal de descompresión gástrica y sellado de alta presión.
                </p>
              </div>

              <div
                onClick={() => setCurrentLine('tubo')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  currentLine === 'tubo' ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/40' : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300">LÍNEA 3: TUBO ENDOTRAQUEAL</span>
                  <span className="text-[10px] font-mono bg-purple-900 px-2 py-0.5 rounded text-purple-200">Máx 3 intentos</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Videolaringoscopía de primera línea con introductor Bougie o estilete rígido bajo bloqueo neuromuscular completo.
                </p>
              </div>
            </div>

            {/* Alerta CICO Fondo del Embudo */}
            <div className="bg-rose-950/50 border-2 border-rose-500/70 rounded-2xl p-4 space-y-2 shadow-xl">
              <div className="flex items-center justify-between text-rose-300 font-black text-xs uppercase">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  FONDO DEL EMBUDO: DECLARACIÓN CICO (CANNOT INTUBATE, CANNOT OXYGENATE)
                </span>
                <span className="bg-rose-900 px-2.5 py-1 rounded text-[10px] text-white">EMERGENCIA VITAL</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Si tras el mejor esfuerzo en las 3 líneas no quirúrgicas falla la oxigenación, el paciente entra en hipoxemia crítica. En ese instante se declara CICO y se realiza de inmediato el rescate infraglótico quirúrgico (eFONA: Escalpelo - Bougie - Tubo 6.0).
              </p>
            </div>
          </div>
        )}

        {activeTab === 'optimizacion' && (
          <div className="space-y-4">
            <h4 className="text-sm font-black text-cyan-300 uppercase tracking-wider">
              Las 5 Categorías de Optimización (Regla del Mejor Esfuerzo)
            </h4>
            <p className="text-xs text-slate-300">
              Cada intento sucesivo PROHÍBE repetir exactamente la misma maniobra y exige aplicar al menos una optimización:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {[
                { num: '1', title: 'Tamaño y Tipo de Dispositivo', desc: 'Cambiar tamaño de pala, pala hipercurva videolaringoscopio o DSG de 2ª generación.' },
                { num: '2', title: 'Posición de Cabeza y Cuello', desc: 'Posición de olfateo (sniffing), rampa en obesos (alineación CAE-muesca esternal) o hiperextensión.' },
                { num: '3', title: 'Manipulación Laríngea Externa', desc: 'Maniobra BURP (presión hacia atrás, arriba y a la derecha) o manipulación bimanual por el operador.' },
                { num: '4', title: 'Aspiración y Desobstrucción', desc: 'Aspiración rígida con Yankauer, limpieza de secreciones/sangre y cánulas de Guedel.' },
                { num: '5', title: 'Adyuvantes y Relajación Neuromuscular', desc: 'Introductor Bougie (Eschmann), estilete rígido angulado a 60º y bloqueo neuromuscular profundo (TOF 0/4 con Rocuronio 1.2 mg/kg).' }
              ].map(opt => (
                <div key={opt.num} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-cyan-400">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 flex items-center justify-center border border-cyan-700">
                      {opt.num}
                    </span>
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium pl-7">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pasos' && (
          <div className="space-y-3">
            {[
              { paso: 'Paso 1', title: 'Zona Verde & Entrada al Vórtex', text: 'Confirmar oxigenación alveolar (SpO2 > 95% y capnografía). Si se pierde ventilación, declarar entrada al Vórtex.' },
              { paso: 'Paso 2', title: 'Línea 1: Mascarilla Facial (FMV)', text: 'Técnica bimanual con cánula de Guedel, ajuste hermético y verificación capnográfica (máximo 3 intentos).' },
              { paso: 'Paso 3', title: 'Línea 2: Dispositivo Supraglótico (DSG)', text: 'Inserción de mascarilla laríngea de 2ª generación con canal gástrico (i-gel, ProSeal).' },
              { paso: 'Paso 4', title: 'Línea 3: Tubo Endotraqueal (TET)', text: 'Videolaringoscopía con Bougie bajo relajación neuromuscular completa confirmada (TOF 0/4).' },
              { paso: 'Paso 5', title: 'Rescate CICO: Acceso Quirúrgico (eFONA)', text: 'Declarar CICO en voz alta; ejecutar cricotiroidotomía quirúrgica con escalpelo-bougie-tubo 6.0 y volver a Zona Verde.' }
            ].map((p, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
                <span className="bg-cyan-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl shrink-0 mt-0.5">
                  {p.paso}
                </span>
                <div>
                  <h5 className="text-xs font-black text-white">{p.title}</h5>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cico' && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-5 space-y-4">
            <h4 className="text-base font-black text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Técnica Quirúrgica eFONA: Escalpelo - Bougie - Tubo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/60 space-y-1">
                <span className="font-black text-rose-300 block">1. Escalpelo (Hoja #10 / #20)</span>
                <p className="text-slate-300">Incisión transversal de 2-3 cm a través de la membrana cricotiroidea. Rotar 90º.</p>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/60 space-y-1">
                <span className="font-black text-rose-300 block">2. Bougie (Eschmann)</span>
                <p className="text-slate-300">Deslizar el extremo acodado hacia la tráquea distal percibiendo los clics traqueales (10-15 cm).</p>
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-900/60 space-y-1">
                <span className="font-black text-rose-300 block">3. Tubo TET #6.0</span>
                <p className="text-slate-300">Avanzar tubo con balón sobre el bougie, insuflar manguito, confirmar con capnografía y volver a Zona Verde.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

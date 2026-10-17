import React from 'react';
import { Wind, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  weight: number;
}

export function VortexAirway({ weight }: Props) {
  return (
    <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="p-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30">
          <Wind className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">ALGORITMO VORTEX: VÍA AÉREA DIFÍCIL</h3>
          <p className="text-xs text-slate-400">Enfoque clínico estandarizado • Máximo 3 intentos por cada dispositivo de rescate antes de CICO.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-cyan-400">1. Mascarilla Facial (BMV)</h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Paso 1</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Técnica a dos manos (C-E o V-E)</li>
            <li>Cánula orofaríngea (Guedel) / nasofaríngea</li>
            <li>Alineación óptima de ejes / Posición de olfateo</li>
            <li>Asegurar profundidad anestésica y bloqueo neuromuscular</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-amber-400">2. Dispositivo Supraglótico (SGA)</h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Paso 2</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>ProSeal, Supreme, i-Gel, Ambu AuraOnce</li>
            <li>Cambiar tamaño si existe fuga importante</li>
            <li>Verificar alineación y sello laríngeo</li>
            <li>Aspiración gástrica por puerto dedicado</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-purple-400">3. Intubación Endotraqueal</h4>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Paso 3</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
            <li>Videolaringoscopia de primera opción</li>
            <li>Guía elástica introductora (Bougie)</li>
            <li>Maniobra BURP / Manipulación laríngea externa</li>
            <li>Tubo de menor calibre (ej. 6.5 - 7.0 mm)</li>
          </ul>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-400 uppercase tracking-wider block flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            ZONA CRÍTICA CICO (Can't Intubate, Can't Oxygenate)
          </span>
          <p className="text-xs text-red-200 mt-1">
            Fallo simultáneo de las 3 líneas de rescate. Ejecutar Acceso Quirúrgico Inmediato a la Vía Aérea (FONA / Cricotiroidotomía).
          </p>
        </div>
        <button
          onClick={() => alert('🚨 PROTOCOLO CICO ACTIVADO:\n1. Bisturí Hoja #10 en membrana cricotiroidea.\n2. Dilatación con Bougie.\n3. Inserción de Tubo Endotraqueal con balón #6.0 mm.')}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 shrink-0 cursor-pointer"
        >
          Activar Protocolo CICO
        </button>
      </div>
    </div>
  );
}

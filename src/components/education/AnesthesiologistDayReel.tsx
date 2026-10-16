import React, { useState } from 'react';
import { Play, Award, Sparkles, BookOpen, HeartPulse, ChevronRight, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { ResourceShareStrip } from './ResourceShareStrip';

export const AnesthesiologistDayReel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white mb-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Especial Día del Anesgiólogo
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">
            Reel conmemorativo y homenaje a la excelencia anestesiológica
          </h2>
          
          <p className="text-slate-300 text-sm leading-relaxed">
            Celebramos el Día del Anesgiólogo con una producción especial en formato Reel interactivo y recursos avanzados de Educación Continua. Monitoreo avanzado, seguridad en vía aérea y liderazgo en quirófano reunidos en alta definición.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" /> Reproducir Reel
            </button>
            <a
              href="#recursos-lista"
              className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl font-medium border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" /> Ver Guías Clínicas
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 relative">
          <div className="relative aspect-[9/16] max-h-[380px] w-full max-w-[220px] mx-auto bg-slate-950 border-4 border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between p-4">
            {/* Reel Header */}
            <div className="flex justify-between items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs">
              <span className="flex items-center gap-1 font-bold text-indigo-300">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> AnestesiaPro
              </span>
              <span className="text-slate-400 text-[10px]">0:45 / 1:20</span>
            </div>

            {/* Reel Center Content */}
            <div className="text-center space-y-2 my-auto">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-sm text-white">Día del Anestesiólogo</h4>
              <p className="text-[11px] text-indigo-200">Ciencia, precisión y compromiso vital</p>
            </div>

            {/* Reel Footer Controls */}
            <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <div className="text-[10px] text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                HD 60FPS
              </div>
              <button
                onClick={() => setIsPlaying(true)}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-indigo-500/20">
        <ResourceShareStrip 
          id="reel-dia-anestesiologo" 
          title="Reel Conmemorativo Día del Anestesiólogo - AnestesiaPro" 
          category="Educación Continua"
          summary="Homenaje exclusivo a la práctica anestesiológica moderna y actualización continua."
        />
      </div>
    </div>
  );
};

import React from 'react';
import { CeLealStudioLogo } from './CeLealStudioLogo';
import { Sparkles, ShieldCheck, Stethoscope, Award, Zap } from 'lucide-react';

interface AnimatedBannerProps {
  onOpenDeveloperModal?: () => void;
}

export const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ onOpenDeveloperModal }) => {
  const handleClick = () => {
    if (onOpenDeveloperModal) {
      onOpenDeveloperModal();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_open_developer_modal'));
    }
  };

  // Reusable ticker item sequence
  const BannerContent = () => (
    <div className="flex items-center gap-6 sm:gap-10 shrink-0">
      {/* BRAND item 1: ANESTESIA PRO */}
      <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-xl border border-sky-400/40 shadow-md">
        <CeLealStudioLogo variant="icon" className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
        <h1 className="text-white font-black text-sm sm:text-base tracking-tight flex items-center gap-1.5">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-sky-200">
            ANESTESIA
          </span>
          <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black px-1.5 py-0.5 rounded-md text-xs shadow-sm transform -rotate-1">
            PRO
          </span>
        </h1>
      </div>

      {/* SEPARATOR */}
      <span className="text-cyan-400/70 text-xs font-bold animate-pulse">✦</span>

      {/* ITEM 2: DR CARLOS LEAL / CE LEAL STUDIO */}
      <div className="flex items-center gap-2 text-xs font-bold text-sky-200 bg-sky-950/50 px-3 py-1 rounded-xl border border-sky-500/30">
        <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Dr. Carlos Leal</span>
        <span className="text-cyan-400">&bull;</span>
        <span className="text-white font-extrabold">C.E. LEAL studio</span>
        <span className="hidden md:inline text-[10px] text-sky-300 font-semibold">(Desarrollador Oficial)</span>
      </div>

      {/* SEPARATOR */}
      <span className="text-cyan-400/70 text-xs font-bold animate-pulse">✦</span>

      {/* BRAND REPEAT WITH RIGHT LOGO */}
      <div className="flex items-center gap-2.5 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-xl border border-indigo-400/40 shadow-md">
        <CeLealStudioLogo variant="icon" className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_0_8px_rgba(129,140,248,0.6)]" />
        <span className="text-xs font-extrabold text-white tracking-wider uppercase flex items-center gap-1">
          <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
          Suite Médica Offline
        </span>
      </div>

      {/* SEPARATOR */}
      <span className="text-cyan-400/70 text-xs font-bold animate-pulse">✦</span>

      {/* ITEM 3: ACCURACY & OFFLINE */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-950/50 px-3 py-1 rounded-xl border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Anestesiología &amp; Reanimación</span>
        <span className="text-emerald-400 font-extrabold">&bull; 100% Precisión</span>
      </div>

      {/* SEPARATOR */}
      <span className="text-cyan-400/70 text-xs font-bold animate-pulse">✦</span>
    </div>
  );

  return (
    <div 
      onClick={handleClick}
      className="w-full overflow-hidden bg-gradient-to-r from-slate-950 via-[#07192f] to-slate-950 py-2 relative border-y border-cyan-500/30 shadow-xl cursor-pointer group select-none"
      title="Haz clic para ver el perfil oficial del desarrollador Dr. Carlos Leal"
    >
      {/* Background ambient glowing gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-indigo-600/15 to-blue-600/10 pointer-events-none" />
      
      {/* Animated subtle stripe pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(56,189,248,0.2)_20px,rgba(56,189,248,0.2)_40px)] animate-stripe-slide" />
      </div>

      {/* Side Fade Fringes for a premium carousel tape look */}
      <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none" />

      {/* CONTINUOUS MARQUEE CAROUSEL BELT ("CORREA") */}
      <div className="flex items-center w-max animate-marquee group-hover:[animation-play-state:paused] relative z-10">
        {/* Block 1 */}
        <BannerContent />
        <div className="w-6 sm:w-10 shrink-0" />

        {/* Block 2 (Exact Duplicate for seamless infinite loop) */}
        <BannerContent />
        <div className="w-6 sm:w-10 shrink-0" />

        {/* Block 3 (Extra Duplicate for wide screens) */}
        <BannerContent />
        <div className="w-6 sm:w-10 shrink-0" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333333%); }
        }
        @keyframes stripe-slide {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
        }
        .animate-stripe-slide {
          animation: stripe-slide 20s linear infinite;
        }
      `}} />
    </div>
  );
};

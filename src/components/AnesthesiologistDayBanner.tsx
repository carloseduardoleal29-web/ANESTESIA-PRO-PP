import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  Heart, 
  Share2, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  PartyPopper, 
  Stethoscope, 
  Flame, 
  ShieldCheck, 
  Users,
  Copy
} from 'lucide-react';
import { DIA_ANESTESIOLOGO_INFO, HONOR_ROLL_DOCTORS } from '../assets/diaAnestesiologoData';
import { DoctorUser } from '../types/user';

interface AnesthesiologistDayBannerProps {
  currentUser?: DoctorUser | null;
  onOpenCarnet?: () => void;
  onOpenNotifications?: () => void;
}

export const AnesthesiologistDayBanner: React.FC<AnesthesiologistDayBannerProps> = ({
  currentUser,
  onOpenCarnet,
  onOpenNotifications
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [copiedGreeting, setCopiedGreeting] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(148);

  const greetingText = `🎉 ¡Feliz Día del Anestesiólogo (16 de Octubre)! 🩺✨\n\nUn fraternal saludo a todos mis estimados colegas guardianes del quirófano, la fisiología y la vida de nuestros pacientes.\n\nAtentamente:\n${currentUser?.fullName || 'Dr. Carlos Eduardo Leal'}\n${currentUser?.specialty || 'Anestesiología Cardiovascular y TIVA'}\nAnestesiaPro Suite 2026`;

  const handleCopyGreeting = () => {
    navigator.clipboard.writeText(greetingText);
    setCopiedGreeting(true);
    setTimeout(() => setCopiedGreeting(false), 3000);
  };

  const handleToggleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    } else {
      setLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-2 border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden text-slate-100 transition-all duration-300">
      
      {/* Top Festivity Tag Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-cyan-500 to-blue-600 px-4 py-1.5 flex items-center justify-between text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-md">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-4 h-4 animate-bounce shrink-0" />
          <span>¡16 DE OCTUBRE: DÍA MUNDIAL DEL ANESTESIÓLOGO & DÍA DEL ANESTESIÓLOGO!</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-bold text-[11px] bg-slate-950/20 px-2.5 py-0.5 rounded-full text-slate-950">
          <span>{DIA_ANESTESIOLOGO_INFO.year} • Edición Especial Conmemorativa</span>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Banner Graphic Image Column */}
        <div className="md:col-span-4 relative group rounded-2xl overflow-hidden border-2 border-cyan-500/30 shadow-2xl bg-slate-950 flex items-center justify-center min-h-[180px]">
          <img
            src={DIA_ANESTESIOLOGO_INFO.bannerImage}
            onError={(e) => {
              // Fallback to alternative image path if primary fails
              (e.target as HTMLImageElement).src = DIA_ANESTESIOLOGO_INFO.fallbackImage;
            }}
            alt="Día del Anestesiólogo"
            className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500 brightness-105 contrast-105"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-3.5">
            <span className="px-2.5 py-1 rounded-lg bg-cyan-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider self-start shadow-md mb-1">
              16 de Octubre de 1846 — Ether Dome
            </span>
            <div className="text-xs text-slate-200 font-bold drop-shadow-md">
              William T.G. Morton & la Primera Anestesia Pública
            </div>
          </div>
        </div>

        {/* Text Details Column */}
        <div className="md:col-span-8 space-y-3.5">
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>CELEBRACIÓN NACIONAL E INTERNACIONAL</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                Maracay & Latinoamérica
              </span>
            </div>

            <button
              onClick={handleToggleLike}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
                liked 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-rose-500/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-400 text-rose-400' : 'text-slate-400'}`} />
              <span>{likeCount} Felicitaciones</span>
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight leading-snug">
              {DIA_ANESTESIOLOGO_INFO.headline}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              En este <strong className="text-cyan-400">16 de Octubre</strong>, rendimos un sentido homenaje al <strong className="text-slate-100">Dr. Carlos Eduardo Leal</strong> (Fundador & Autor de AnestesiaPro) y a cada médico anestesiólogo que día a día vigila los signos vitales, domina la farmacología avanzada y garantiza el alivio del dolor en cada mesa quirúrgica.
            </p>
          </div>

          {/* Author Quote Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs space-y-1 relative">
            <div className="text-cyan-300 italic font-medium">
              "{DIA_ANESTESIOLOGO_INFO.authorQuote}"
            </div>
            <div className="text-[11px] text-slate-400 font-bold flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-slate-200">— {DIA_ANESTESIOLOGO_INFO.authorName}</span>
              <span className="text-amber-400 font-semibold">{DIA_ANESTESIOLOGO_INFO.authorTitle}</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyGreeting}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
              >
                {copiedGreeting ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>¡Saludo Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950" />
                    <span>Copiar Saludo Fraternal</span>
                  </>
                )}
              </button>

              {onOpenCarnet && (
                <button
                  onClick={onOpenCarnet}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Carnet Digital</span>
                </button>
              )}

              {onOpenNotifications && (
                <button
                  onClick={onOpenNotifications}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Boletines</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition py-1"
            >
              <span>{expanded ? 'Ocultar Reseña & Cuadro de Honor' : 'Ver Historia & Cuadro de Honor'}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

          </div>

        </div>

      </div>

      {/* Expanded Details Section: Historical Note & Honor Roll */}
      {expanded && (
        <div className="border-t border-slate-800 bg-slate-950/90 p-4 sm:p-6 space-y-5 animate-fadeIn">
          
          {/* Historical Highlight Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs leading-relaxed">
            <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-amber-400" />
              <span>Reseña Histórica: La Noche que el Dolor fue Vencido (16 de Octubre de 1846)</span>
            </h4>
            <p className="text-slate-300">
              {DIA_ANESTESIOLOGO_INFO.historicalEvent}
            </p>
            <div className="text-slate-400 pt-1 border-t border-slate-800 flex flex-wrap gap-4 text-[11px]">
              <span><strong>Total Médicos Sincronizados:</strong> {DIA_ANESTESIOLOGO_INFO.stats.totalRegistered}</span>
              <span><strong>Nube Firestore:</strong> {DIA_ANESTESIOLOGO_INFO.stats.hospitalsConnected}</span>
              <span><strong>Países:</strong> {DIA_ANESTESIOLOGO_INFO.stats.countries}</span>
            </div>
          </div>

          {/* Honor Roll List */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Cuadro de Honor de Médicos Especialistas Registrados en AnestesiaPro</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {HONOR_ROLL_DOCTORS.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-2 hover:border-cyan-500/40 transition">
                  <div>
                    <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                      <span>{doc.name}</span>
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold">{doc.specialty}</div>
                    <div className="text-[10px] text-slate-400">{doc.location}</div>
                  </div>
                  {doc.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border shrink-0 ${
                      doc.badge.includes('FUNDADOR')
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : doc.badge.includes('HONORARIO')
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    }`}>
                      {doc.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

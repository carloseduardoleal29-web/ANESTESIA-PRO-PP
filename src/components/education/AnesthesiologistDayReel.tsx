import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, HeartHandshake, Stethoscope, Share2, Award, ChevronLeft, ChevronRight, Play, Pause, Maximize2, X, Check, ShieldCheck, Zap } from 'lucide-react';
import { getShortAppUrl } from '../../lib/statsService';

export const AnesthesiologistDayReel: React.FC = () => {
  const slides = [
    {
      id: 1,
      tag: '16 DE OCTUBRE • DÍA MUNDIAL DEL ANESTESIÓLOGO 🩺',
      title: '¡Feliz Día del Anestesiólogo!',
      subtitle: 'Guardianes incansables del sueño, la analgesia y la vida en el quirófano',
      description: 'En cada cirugía, tu precisión médica, serenidad ante la emergencia y vigilia constante marcan la diferencia entre el riesgo y la vida. ¡Gracias por tu entrega diaria!',
      gradient: 'from-amber-600 via-rose-600 to-indigo-900',
      badgeBg: 'bg-amber-400 text-slate-950',
      icon: Stethoscope,
      bgImage: '/images/preeclampsia_placenta_maternal_connection.svg',
      quote: '"La anestesiología es el arte de acompañar el momento más vulnerable con la máxima ciencia."'
    },
    {
      id: 2,
      tag: 'PRECISIÓN, CIENCIA Y VIGILANCIA 💉',
      title: 'Excelencia en Control Perioperatorio',
      subtitle: 'Liderazgo técnico en Vía Aérea, Hemodinámica y Manejo del Dolor',
      description: 'Desde la inducción suave hasta la extubación segura, pasando por bloqueos ecoguiados y reanimación crítica. Ciencia y templanza al servicio de nuestros pacientes.',
      gradient: 'from-blue-600 via-cyan-600 to-slate-900',
      badgeBg: 'bg-cyan-400 text-slate-950',
      icon: ShieldCheck,
      quote: '"Donde hay un anestesiólogo vigilante, hay seguridad y tranquilidad en la mesa de operaciones."'
    },
    {
      id: 3,
      tag: 'HOMENAJE ESPECIAL • ANESTESIAPRO 🩺',
      title: 'Creado por y para Anestesiólogos',
      subtitle: 'Herramientas clínicas concebidas desde la práctica médica real',
      description: 'Felicitaciones a toda la comunidad médica de AnestesiaPro de parte del Dr. Carlos Leal. Sigamos fortaleciendo el conocimiento y la excelencia clínica juntos.',
      gradient: 'from-purple-600 via-indigo-600 to-slate-950',
      badgeBg: 'bg-purple-400 text-slate-950',
      icon: Award,
      quote: '"Innovación, algoritmos actualizados y pasión por la docencia médica continua."'
    },
    {
      id: 4,
      tag: '16 DE OCTUBRE • SALUDO QUIRÚRGICO 🎉',
      title: '¡Felicidades Colega en tu Día!',
      subtitle: 'Comparte este homenaje con tu equipo y colegas anestesiólogos',
      description: 'Celebremos juntos el orgullo de ejercer una de las especialidades más nobles, decisivas y trascendentales de la medicina moderna.',
      gradient: 'from-emerald-600 via-teal-700 to-slate-950',
      badgeBg: 'bg-emerald-400 text-slate-950',
      icon: HeartHandshake,
      quote: '"¡Un abrazo fraternal a cada médico anestesiólogo en su día especial!"'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  const shareGreeting = () => {
    const shareUrl = getShortAppUrl('utm_source=dia_anestesiologo');
    const message = `🩺🎉 ¡Feliz Día del Anestesiólogo! (16 de Octubre)\nUn gran saludo a todos los colegas anestesiólogos que con precisión y dedicación cuidan cada vida en el quirófano.\n\nVer Homenaje en AnestesiaPro:\n${shareUrl}`;

    if (navigator.share) {
      navigator.share({
        title: '16 de Octubre • Día del Anestesiólogo 🩺',
        text: message,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const current = slides[currentIndex];
  const Icon = current.icon;

  return (
    <div className="w-full my-4 animate-fadeIn">
      {/* Contenedor Principal Carrete Móvil */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative overflow-hidden rounded-3xl border border-amber-500/50 shadow-2xl bg-gradient-to-br ${current.gradient} transition-all duration-700 text-white p-5 sm:p-7 md:p-8 flex flex-col justify-between min-h-[340px] sm:min-h-[360px] group`}
      >
        {/* Glow & Sparkle Effects Background */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Story Progress Indicators Top Bar */}
        <div className="relative z-20 flex items-center gap-1.5 mb-4">
          {slides.map((s, idx) => (
            <div 
              key={s.id}
              onClick={() => { setCurrentIndex(idx); setIsPlaying(false); }}
              className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer transition-all"
              title={`Ir a lámina ${idx + 1}`}
            >
              <div 
                className={`h-full bg-amber-300 transition-all duration-300 ${
                  idx === currentIndex ? 'w-full' : idx < currentIndex ? 'w-full opacity-60' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="relative z-10 space-y-3 my-auto">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${current.badgeBg}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {current.tag}
            </span>

            {/* Play/Pause & Fullscreen Controls */}
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                title={isPlaying ? 'Pausar reproducción automática' : 'Reproducir carrete'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Ampliar en pantalla completa"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-md">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-amber-200/90 flex items-center gap-1.5">
              <Icon className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{current.subtitle}</span>
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-2xl drop-shadow-sm font-medium">
            {current.description}
          </p>

          <div className="pt-2 border-t border-white/15">
            <p className="text-[11px] sm:text-xs font-serif italic text-amber-100/90">
              {current.quote}
            </p>
          </div>
        </div>

        {/* Footer Actions & Slide Navigation */}
        <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/15">
          <div className="flex items-center gap-2">
            <button
              onClick={shareGreeting}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 border border-emerald-300/50"
              title="Compartir saludo del Día del Anestesiólogo en WhatsApp o Redes"
            >
              {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Share2 className="w-4 h-4 text-slate-950" />}
              <span>{copied ? '¡Copiado para Compartir!' : '📲 Compartir Saludo Colegas'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer active:scale-95 border border-white/10"
              title="Lámina anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black font-mono text-amber-200 px-1">
              {currentIndex + 1}/{slides.length}
            </span>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer active:scale-95 border border-white/10"
              title="Siguiente lámina"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Pantalla Completa para Celular */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> 16 de Octubre • Feliz Día del Anestesiólogo 🩺
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="my-auto max-w-xl mx-auto space-y-6 text-center text-white">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shadow-2xl">
              <Stethoscope className="w-10 h-10 animate-bounce" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-amber-200">
              {current.title}
            </h2>

            <p className="text-base text-slate-200 leading-relaxed font-medium">
              {current.description}
            </p>

            <blockquote className="text-sm italic font-serif text-amber-300/90 bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30">
              {current.quote}
            </blockquote>

            <div className="pt-4 flex justify-center">
              <button
                onClick={shareGreeting}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Share2 className="w-5 h-5" />
                <span>Compartir con Colegas Anestesiólogos</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-slate-400 z-10">
            <button onClick={handlePrev} className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
              Anterior
            </button>
            <span>Lámina {currentIndex + 1} de {slides.length}</span>
            <button onClick={handleNext} className="px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

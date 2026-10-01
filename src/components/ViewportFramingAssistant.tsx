import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, CheckCircle2, X, Info, Sparkles, ChevronRight, RefreshCw, ZoomIn } from 'lucide-react';
import { checkDesktopModeOnMobile, reframeCurrentDevice, lockViewportFraming } from '../lib/viewportManager';

export const ViewportFramingAssistant: React.FC = () => {
  const [isDesktopModeActive, setIsDesktopModeActive] = useState<boolean>(false);
  const [dismissedBanner, setDismissedBanner] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('anestesiapro_dismiss_desktop_banner') === 'true';
    } catch {
      return false;
    }
  });
  const [showHowToModal, setShowHowToModal] = useState<boolean>(false);
  const [reframedToast, setReframedToast] = useState<boolean>(false);

  // Check on mount, resize, and orientation change
  useEffect(() => {
    // Initial viewport lock
    lockViewportFraming();

    const evaluate = () => {
      lockViewportFraming();
      setIsDesktopModeActive(checkDesktopModeOnMobile());
    };

    evaluate();

    window.addEventListener('resize', evaluate, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(evaluate, 200);
    }, { passive: true });

    const handleReframed = () => {
      setReframedToast(true);
      setTimeout(() => setReframedToast(false), 3200);
    };

    window.addEventListener('anestesiapro-screen-reframed', handleReframed);

    return () => {
      window.removeEventListener('resize', evaluate);
      window.removeEventListener('anestesiapro-screen-reframed', handleReframed);
    };
  }, []);

  const handleDismiss = () => {
    setDismissedBanner(true);
    try {
      sessionStorage.setItem('anestesiapro_dismiss_desktop_banner', 'true');
    } catch {}
  };

  const handleQuickReframe = () => {
    reframeCurrentDevice();
  };

  return (
    <>
      {/* Reframed Confirmation Toast */}
      {reframedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-950/95 border border-emerald-400 text-emerald-100 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>¡Pantalla encuadrada al 100% de tu dispositivo!</span>
        </div>
      )}

      {/* Banner if Desktop Site is detected on mobile phone */}
      {isDesktopModeActive && !dismissedBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 px-3.5 py-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2.5 text-xs font-semibold z-40 border-b border-amber-300/60 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="p-1 rounded-full bg-slate-950/20 text-slate-950 shrink-0">
              <Smartphone className="w-4 h-4" />
            </span>
            <div className="leading-snug">
              <span className="font-extrabold text-slate-950 block sm:inline">
                ¿La app se ve pequeña o desajustada?
              </span>{' '}
              <span className="text-slate-950/90 font-medium text-[11px] sm:text-xs">
                Tienes activo <strong>&quot;Sitio para computadoras / Sitio de escritorio&quot;</strong> en tu teléfono.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowHowToModal(true)}
              className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-black px-3 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <span>Ver cómo encuadrar al 100%</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleQuickReframe}
              className="bg-amber-950/40 hover:bg-amber-950/60 text-slate-950 font-bold px-2.5 py-1.5 rounded-xl transition-all text-[11px] cursor-pointer"
              title="Re-encuadrar pantalla"
            >
              Auto-Ajustar
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-slate-950/70 hover:text-slate-950 transition-colors"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Guía: Cómo quitar "Sitio de escritorio" para que se encuadre perfecta siempre */}
      {showHowToModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3.5 sm:p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/50 text-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Encuadrar al 100% en tu Teléfono
                </h3>
              </div>
              <button
                onClick={() => setShowHowToModal(false)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Cuando el navegador tiene marcada la opción <strong>&quot;Sitio para computadoras&quot;</strong>, intenta forzar la resolución de una pantalla grande de PC en tu teléfono móvil. Por eso la app se desajusta o hay que hacer zoom manual.
            </p>

            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Solución en 2 simples toques (Para siempre):</span>
              </h4>

              {/* Android Chrome */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                  📱 En Google Chrome (Android):
                </span>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4">
                  <li>
                    Toca el <strong>menú de 3 puntos (⋮)</strong> en la esquina superior derecha del navegador.
                  </li>
                  <li>
                    Busca la opción <strong>&quot;Sitio para computadoras&quot;</strong> (o &quot;Vista ordenador&quot;).
                  </li>
                  <li>
                    <strong className="text-emerald-300">Desmárcala</strong> (debe quedar la casilla sin el check).
                  </li>
                </ol>
              </div>

              {/* iOS Safari */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                  🍏 En Safari (iPhone / iPad):
                </span>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal pl-4">
                  <li>
                    Toca el botón <strong>&quot;aA&quot;</strong> en la barra de direcciones de Safari.
                  </li>
                  <li>
                    Si dice <strong>&quot;Solicitar sitio web móvil&quot;</strong>, tócalo para encuadrarla.
                  </li>
                  <li>
                    Verifica que el zoom esté en <strong>100%</strong>.
                  </li>
                </ol>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
              💡 <strong>Recomendación Profesional:</strong> Si instalas la app tocando el botón <strong>&quot;Instalar App&quot;</strong> del encabezado, se abrirá como una aplicación nativa independiente a pantalla completa, sin barras de navegación y siempre 100% encuadrada.
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  reframeCurrentDevice();
                  setShowHowToModal(false);
                }}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer text-center shadow-lg"
              >
                Auto-Encuadrar al 100% Ahora
              </button>
              <button
                onClick={() => setShowHowToModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

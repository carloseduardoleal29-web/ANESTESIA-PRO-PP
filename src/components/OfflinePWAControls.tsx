import React, { useState, useEffect } from 'react';
import { 
  Download, 
  WifiOff, 
  Wifi, 
  CheckCircle2, 
  Smartphone, 
  Share2, 
  PlusSquare, 
  X, 
  ShieldCheck,
  HardDriveDownload,
  AlertTriangle
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showReconnected, setShowReconnected] = useState(false);
  const [prevOnline, setPrevOnline] = useState(isOnline);

  useEffect(() => {
    if (!prevOnline && isOnline) {
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    }
    setPrevOnline(isOnline);
  }, [isOnline, prevOnline]);

  if (showReconnected) {
    return (
      <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl backdrop-blur-md animate-fadeIn">
        <Wifi className="w-4 h-4 text-emerald-400" />
        <span>Conexión restablecida. Sincronización activa.</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center justify-between gap-3 bg-slate-900/95 border border-cyan-500/60 text-cyan-100 px-4 py-3 rounded-2xl text-xs font-semibold shadow-2xl backdrop-blur-md animate-bounce-short">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
          <WifiOff className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <p className="font-black text-white text-xs">Modo Quirófano Offline Activo</p>
            <p className="text-[11px] text-cyan-300">Todas las calculadoras, vademécum y protocolos funcionan al 100% sin internet.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const PWAInstallHeaderButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // If already installed or running as standalone, don't show
  if (isInstalled || dismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
    } else if (isInstallable) {
      await install();
    } else {
      // General prompt if browser doesn't expose prompt yet
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar AnestesiaPro en tu teléfono o PC para usarla sin conexión"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black shadow-lg shadow-cyan-500/20 border border-cyan-400/40 cursor-pointer active:scale-95 transition-all"
      >
        <Download className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
        <span className="hidden sm:inline">Instalar App Offline</span>
        <span className="sm:hidden">Instalar</span>
      </button>

      {/* Guide Modal for iOS or manual install */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl text-slate-200 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Instalar AnestesiaPro</h3>
                <p className="text-xs text-cyan-300 font-semibold">Uso garantizado sin internet (Quirófano / Avión)</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">1</div>
                <div>
                  <p className="font-bold text-white">En iPhone / iPad (Safari):</p>
                  <p className="text-slate-400 mt-0.5">
                    Toca el botón <strong className="text-cyan-300 inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Compartir</strong> en la barra inferior de Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">2</div>
                <div>
                  <p className="font-bold text-white">Agregar a Pantalla de Inicio:</p>
                  <p className="text-slate-400 mt-0.5">
                    Desliza hacia abajo y pulsa <strong className="text-cyan-300 inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5" /> "Agregar a inicio"</strong> o "Añadir a pantalla de inicio".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-500/40">3</div>
                <div>
                  <p className="font-bold text-white">En Android / Chrome / Edge:</p>
                  <p className="text-slate-400 mt-0.5">
                    Toca el menú de 3 puntos (⋮) arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2.5 text-[11px] text-cyan-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Una vez instalada, la app abre directamente desde tu pantalla de inicio incluso si apagas el Wi-Fi y datos móviles.</span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs py-3 rounded-2xl transition-all cursor-pointer shadow-lg"
            >
              Entendido, volver a la aplicación
            </button>
          </div>
        </div>
      )}
    </>
  );
};

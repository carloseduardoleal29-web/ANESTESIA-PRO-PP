import React, { useState } from 'react';
import { X, Sparkles, Smartphone, Laptop, Monitor, CheckCircle, Check, Copy, ExternalLink, Share } from 'lucide-react';
import { recordAppInstall, SHORT_APP_URL } from '../lib/statsService';
import { LOGO_SHIELD_BASE64, LOGO_FALLBACK_SVG } from '../lib/logoData';

interface InstallInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  setDeferredPrompt: (p: any) => void;
  detectedUserPlatform: 'android' | 'ios' | 'pc';
  onInstallUpdated: (stats: any) => void;
}

export const InstallInstructionsModal: React.FC<InstallInstructionsModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  setDeferredPrompt,
  detectedUserPlatform,
  onInstallUpdated
}) => {
  const [installDeviceTab, setInstallDeviceTab] = useState<'android' | 'ios' | 'pc'>(detectedUserPlatform);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvitation, setCopiedInvitation] = useState(false);
  const [installConfirmed, setInstallConfirmed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-cyan-500/40 relative space-y-4 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3.5">
          <div className="shrink-0 p-1.5 bg-white rounded-2xl border border-cyan-300 shadow-md overflow-hidden">
            <img
              src={LOGO_SHIELD_BASE64}
              alt="AnestesiaPro Logo"
              className="w-12 h-12 object-contain rounded-xl"
              onError={(e) => {
                e.currentTarget.src = LOGO_FALLBACK_SVG;
              }}
            />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              ¿Cómo instalar AnestesiaPro en tu dispositivo?
            </h3>
            <p className="text-xs text-cyan-300 font-medium mt-0.5">
              Acceso directo oficial (PWA) • Pantalla completa sin barras
            </p>
          </div>
        </div>

        {/* Direct PWA 1-Click Install Button if supported by browser */}
        {deferredPrompt && (
          <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-500/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 fill-current" /> ¡Instalación Automática Disponible!
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Tu navegador permite instalar la app con un solo toque.
              </p>
            </div>
            <button
              onClick={() => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult: any) => {
                  if (choiceResult?.outcome === 'accepted') {
                    recordAppInstall().then(s => {
                      if (s) onInstallUpdated(s);
                    });
                  }
                  setDeferredPrompt(null);
                });
              }}
              className="shrink-0 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
            >
              ⚡ Instalar Ahora
            </button>
          </div>
        )}

        {/* Detected Device Badge & Tabs */}
        <div className="flex items-center justify-between text-xs px-1 pt-1">
          <span className="text-slate-400 font-medium">Instrucciones según tu equipo:</span>
          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/90 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Detectado: {detectedUserPlatform === 'ios' ? 'iPhone / iPad 📱' : detectedUserPlatform === 'android' ? 'Android 📱' : 'PC / Mac 💻'}
          </span>
        </div>

        {/* Device Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setInstallDeviceTab('android')}
            className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              installDeviceTab === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
            {detectedUserPlatform === 'android' && (
              <span className="text-[9px] bg-slate-950 text-emerald-300 px-1 py-0.2 rounded font-mono">TÚ</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setInstallDeviceTab('ios')}
            className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              installDeviceTab === 'ios'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
            {detectedUserPlatform === 'ios' && (
              <span className="text-[9px] bg-slate-950 text-cyan-300 px-1 py-0.2 rounded font-mono">TÚ</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setInstallDeviceTab('pc')}
            className={`py-2 px-1 text-xs rounded-xl font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              installDeviceTab === 'pc'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>PC / Mac</span>
            {detectedUserPlatform === 'pc' && (
              <span className="text-[9px] bg-slate-950 text-indigo-300 px-1 py-0.2 rounded font-mono">TÚ</span>
            )}
          </button>
        </div>

        {/* Device Specific Step by Step Instructions */}
        <div className="space-y-3 pt-1">
          {installDeviceTab === 'android' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Instalación en Teléfonos Android (Google Chrome / Edge / Brave):</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p className="leading-snug">
                      Abre este enlace web oficial en <strong>Google Chrome</strong> (o tu navegador preferido).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p className="leading-snug">
                      Toca el menú de los <strong>3 puntos verticales (⋮)</strong> en la esquina superior derecha.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p className="leading-snug">
                      Selecciona la opción <strong>"Instalar aplicación"</strong> o <strong>"Añadir a la pantalla principal"</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <p className="leading-snug">
                      Confirma tocando <strong>"Instalar"</strong>. ¡Listo! El ícono oficial del <strong>Escudo Anestésico</strong> aparecerá en tu teléfono y se abrirá a pantalla completa como una app nativa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {installDeviceTab === 'ios' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
                  <Smartphone className="w-4 h-4" />
                  <span>Instalación en iPhone / iPad (Navegador Safari):</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p className="leading-snug">
                      Abre este enlace web oficial en el navegador <strong>Safari</strong> de tu iPhone o iPad.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p className="leading-snug">
                      Toca el botón <strong>Compartir <Share className="w-3.5 h-3.5 inline text-cyan-400 mx-0.5" /></strong> (el ícono del cuadrado con una flecha hacia arriba en la barra inferior).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p className="leading-snug">
                      Desliza hacia abajo en el menú de opciones y toca <strong>"Agregar al inicio"</strong> (o "Añadir a pantalla de inicio" ⊞).
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <p className="leading-snug">
                      Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo! Tendrás el ícono de <strong>AnestesiaPro</strong> listo para usar sin barra de navegación.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {installDeviceTab === 'pc' && (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-xs">
                  <Monitor className="w-4 h-4" />
                  <span>Instalación en Computadora / Laptop / Mac (Chrome, Edge o Brave):</span>
                </div>

                <div className="space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <p className="leading-snug">
                      Abre la web en <strong>Google Chrome</strong> o <strong>Microsoft Edge</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <p className="leading-snug">
                      En la barra de direcciones superior (a la derecha), haz clic en el ícono de <strong>Instalar</strong> (pantallita con flecha) o en el menú de <strong>3 puntos (⋮) &gt; "Instalar AnestesiaPro..."</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-black text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <p className="leading-snug">
                      Haz clic en <strong>"Instalar"</strong>. La aplicación se abrirá en su propia ventana independiente de escritorio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Manual Installation Button */}
        <div className="bg-gradient-to-r from-emerald-950/90 via-teal-950/70 to-slate-950 border border-emerald-500/50 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="text-left">
            <p className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ¿Ya añadiste la aplicación a tu pantalla de inicio?
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Al pulsar aquí se registra de inmediato tu instalación en los contadores globales del servidor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              recordAppInstall().then(s => {
                if (s) onInstallUpdated(s);
              });
              try {
                localStorage.setItem('anestesiapro_pwa_standalone_recorded', 'true');
                localStorage.setItem('anestesiapro_install_synced_to_server', 'true');
              } catch (e) {}
              setInstallConfirmed(true);
              setTimeout(() => setInstallConfirmed(false), 4000);
            }}
            disabled={installConfirmed}
            className={`shrink-0 text-xs font-black px-4 py-2.5 rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 ${
              installConfirmed
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 active:scale-95'
            }`}
          >
            {installConfirmed ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Instalación Confirmada!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>✅ ¡Ya la instalé!</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Link & Invitation Copy Bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                ¿Quieres invitar a un colega a instalar AnestesiaPro?
              </p>
              <p className="text-xs text-cyan-300 font-mono truncate mt-0.5">
                {SHORT_APP_URL}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                const fullText = `🩺 Te invito a instalar y usar AnestesiaPro, la suite clínica de anestesiología creada por el Dr. Carlos Leal.\n\n📲 Ábrela o instálala directamente aquí:\n${SHORT_APP_URL}`;
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(fullText);
                  setCopiedInvitation(true);
                  setTimeout(() => setCopiedInvitation(false), 3000);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm ${
                copiedInvitation
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
              }`}
            >
              {copiedInvitation ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5 text-cyan-100" />}
              <span>{copiedInvitation ? '¡Invitación Copiada!' : 'Copiar Invitación con Descripción'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(SHORT_APP_URL);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 3000);
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700 ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar sólo Enlace Web'}</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

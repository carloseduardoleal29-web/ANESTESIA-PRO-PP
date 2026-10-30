import React, { useState, useEffect } from 'react';
import { CreditCard, Save, X, Check, DollarSign, RefreshCw, Sparkles, Building2, Phone, Mail, User, KeyRound } from 'lucide-react';
import { CustomBillingConfig, getBillingConfig, saveBillingConfig } from '../lib/billingService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBillingEditorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<CustomBillingConfig>(() => getBillingConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getBillingConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveBillingConfig(config);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5 my-auto max-h-[92vh] overflow-y-auto custom-scrollbar">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/30">
              <CreditCard className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full">
                  PANEL DR. CARLOS LEAL
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">Editar Mis Datos de Cobro & Suscripción</h3>
              <p className="text-xs text-slate-300">Personaliza Zinli, Binance Pay (Correo y Pay ID), Pago Móvil y Precios</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-xl p-3 text-xs font-black flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span>¡Datos de cobro actualizados con éxito! El modal de Plan Élite reflejará estos cambios inmediatamente.</span>
          </div>
        )}

        {/* SECTION 1: PAGO MÓVIL */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>🇻🇪 Pago Móvil (Bolívares)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Cédula de Identidad:</label>
              <input
                type="text"
                value={config.pagoMovilCedula}
                onChange={(e) => setConfig({ ...config, pagoMovilCedula: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Teléfono Pago Móvil / WhatsApp:</label>
              <input
                type="text"
                value={config.pagoMovilPhone}
                onChange={(e) => setConfig({ ...config, pagoMovilPhone: e.target.value, whatsappPhone: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: BINANCE PAY & ZINLI */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>⚡ Binance Pay & Zinli (USD)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Correo Binance Pay:</label>
              <input
                type="email"
                value={config.binanceEmail}
                onChange={(e) => setConfig({ ...config, binanceEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Binance Pay ID / User ID:</label>
              <input
                type="text"
                value={config.binancePayId}
                onChange={(e) => setConfig({ ...config, binancePayId: e.target.value })}
                placeholder="Ej: 253484920"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Correo Zinli Wallet:</label>
              <input
                type="email"
                value={config.zinliEmail}
                onChange={(e) => setConfig({ ...config, zinliEmail: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TASA & PRECIOS */}
        <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>💵 Tasa Base Binance P2P / Paralelo (NO BCV) & Precios Élite</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Tasa P2P Base (Bs/USD):</label>
              <input
                type="number"
                step="0.1"
                value={config.defaultExchangeRate}
                onChange={(e) => setConfig({ ...config, defaultExchangeRate: parseFloat(e.target.value) || 1001.32 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Precio 3 Meses ($):</label>
              <input
                type="number"
                value={config.price3mUSD}
                onChange={(e) => setConfig({ ...config, price3mUSD: parseInt(e.target.value) || 30 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Precio 6 Meses ($):</label>
              <input
                type="number"
                value={config.price6mUSD}
                onChange={(e) => setConfig({ ...config, price6mUSD: parseInt(e.target.value) || 50 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1">Precio 1 Año ($):</label>
              <input
                type="number"
                value={config.price1yUSD}
                onChange={(e) => setConfig({ ...config, price1yUSD: parseInt(e.target.value) || 95 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/80 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4 text-slate-950" />
            <span>Guardar Mis Datos de Cobro</span>
          </button>
        </div>

      </div>
    </div>
  );
};

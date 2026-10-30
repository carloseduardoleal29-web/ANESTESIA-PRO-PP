import React, { useState, useEffect } from 'react';
import { 
  Crown, Sparkles, CheckCircle2, ShieldCheck, Copy, Check, 
  ArrowRight, MessageCircle, DollarSign, Calculator, Zap, 
  RefreshCw, X, Stethoscope, AlertTriangle, FileText, Activity, 
  Brain, ShieldAlert, Heart, Layers, HelpCircle, Edit3, KeyRound, Hash
} from 'lucide-react';
import { getStoredUserProfile, RegisteredUser } from '../lib/userRegistrationService';
import { CustomBillingConfig, getBillingConfig } from '../lib/billingService';

interface PlanEliteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: '3m' | '6m' | '1y';
}

export const PlanEliteModal: React.FC<PlanEliteModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = '1y'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'3m' | '6m' | '1y'>(defaultPlan);
  const [activePaymentTab, setActivePaymentTab] = useState<'pagomovil' | 'binance' | 'zinli'>('pagomovil');
  const [billingConfig, setBillingConfig] = useState<CustomBillingConfig>(() => getBillingConfig());
  const [exchangeRate, setExchangeRate] = useState<number>(() => getBillingConfig().defaultExchangeRate);
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('');
  const [paymentRefNumber, setPaymentRefNumber] = useState<string>('');
  const [customRateInput, setCustomRateInput] = useState<string>(() => getBillingConfig().defaultExchangeRate.toFixed(2));
  const [showCustomRate, setShowCustomRate] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<RegisteredUser | null>(() => getStoredUserProfile());

  useEffect(() => {
    setUserProfile(getStoredUserProfile());
    const currentConf = getBillingConfig();
    setBillingConfig(currentConf);
    setExchangeRate(currentConf.defaultExchangeRate);
    setCustomRateInput(currentConf.defaultExchangeRate.toFixed(2));
  }, [isOpen]);

  useEffect(() => {
    const handleConfigUpdate = (e: any) => {
      const newConf = e.detail || getBillingConfig();
      setBillingConfig(newConf);
      if (newConf.defaultExchangeRate) {
        setExchangeRate(newConf.defaultExchangeRate);
        setCustomRateInput(newConf.defaultExchangeRate.toFixed(2));
      }
    };
    window.addEventListener('anestesiapro_billing_config_updated', handleConfigUpdate);
    return () => window.removeEventListener('anestesiapro_billing_config_updated', handleConfigUpdate);
  }, []);

  const fetchLiveExchangeRate = async () => {
    setIsFetchingRate(true);
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares/paralelo');
      if (res.ok) {
        const data = await res.json();
        if (data && data.promedio && typeof data.promedio === 'number' && data.promedio > 30) {
          const rate = Number(data.promedio.toFixed(2));
          setExchangeRate(rate);
          setCustomRateInput(rate.toFixed(2));
          setLastUpdatedTime(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsFetchingRate(false);
          return;
        }
      }
    } catch {}

    try {
      const resAll = await fetch('https://ve.dolarapi.com/v1/dolares');
      if (resAll.ok) {
        const list = await resAll.json();
        const parItem = Array.isArray(list) ? list.find((item: any) => item.fuente === 'paralelo') : null;
        if (parItem && parItem.promedio && typeof parItem.promedio === 'number' && parItem.promedio > 30) {
          const p2pRate = Number(parItem.promedio.toFixed(2));
          setExchangeRate(p2pRate);
          setCustomRateInput(p2pRate.toFixed(2));
          setLastUpdatedTime(new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsFetchingRate(false);
          return;
        }
      }
    } catch {}

    setIsFetchingRate(false);
  };

  // Continuous auto-refresh timer for live rates every 30 seconds
  useEffect(() => {
    if (isOpen) {
      fetchLiveExchangeRate();
      const interval = setInterval(() => {
        fetchLiveExchangeRate();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const plans = {
    '3m': {
      id: '3m',
      title: 'Plan Trimestral',
      period: '3 Meses',
      priceUSD: billingConfig.price3mUSD || 30,
      monthlyEquivalent: ((billingConfig.price3mUSD || 30) / 3).toFixed(2),
      badge: 'ACCESO TEMPORAL',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      savings: null,
      description: 'Ideal para rotaciones médicas, residencias quirúrgicas o actualización puntual.'
    },
    '6m': {
      id: '6m',
      title: 'Plan Semestral',
      period: '6 Meses',
      priceUSD: billingConfig.price6mUSD || 50,
      monthlyEquivalent: ((billingConfig.price6mUSD || 50) / 6).toFixed(2),
      badge: 'AHORRAS $10 USD',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
      savings: 'Ahorras $10 USD vs mensual',
      description: 'Cobertura completa para el semestre clínico con todas las calculadoras y simuladores.'
    },
    '1y': {
      id: '1y',
      title: 'Plan Anual Élite',
      period: '1 Año Completo (12 Meses)',
      priceUSD: billingConfig.price1yUSD || 95,
      monthlyEquivalent: ((billingConfig.price1yUSD || 95) / 12).toFixed(2),
      badge: '👑 MÁS POPULAR • AHORRAS $25 USD',
      badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black border-amber-300 shadow-md',
      popular: true,
      savings: 'Máximo ahorro ($25 USD) + Prioridad en soporte',
      description: 'Acceso total e ilimitado por 365 días a toda la suite médica y futuras herramientas 2026.'
    }
  };

  const currentPlanObj = plans[selectedPlan];
  const calculatedBs = (currentPlanObj.priceUSD * exchangeRate).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCustomRateChange = (val: string) => {
    setCustomRateInput(val);
    const parsed = parseFloat(val.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      setExchangeRate(parsed);
    }
  };

  const handleWhatsAppRedirect = () => {
    const doctorName = userProfile?.fullName || 'Colega Anestesiólogo';
    const doctorEmail = userProfile?.email || 'No especificado';
    const doctorPhone = userProfile?.phone || '';
    const doctorCedula = userProfile?.idNumber || '';
    const refSnippet = paymentRefNumber ? `\n🔢 *Nº de Referencia / Transacción:* ${paymentRefNumber}` : '';

    const text = `Hola Dr. Carlos Leal 👋🏼, he realizado mi pago para activar mi *Plan Élite de AnestesiaPro*.\n\n` +
      `👑 *Plan Elegido:* ${currentPlanObj.title} (${currentPlanObj.period})\n` +
      `💵 *Monto USD:* $${currentPlanObj.priceUSD} USD\n` +
      `🇻🇪 *Monto en Bolívares:* Bs. ${calculatedBs} (Tasa: ${exchangeRate.toFixed(2)} Bs/USD)\n` +
      `💳 *Método de Pago:* ${activePaymentTab === 'pagomovil' ? 'Pago Móvil' : activePaymentTab === 'binance' ? 'Binance Pay / USDT' : 'Zinli'}` +
      `${refSnippet}\n\n` +
      `👤 *Mis Datos de Registro:*\n` +
      `• Médico: ${doctorName}\n` +
      `• Cédula: ${doctorCedula || 'No especificada'}\n` +
      `• Correo: ${doctorEmail}\n` +
      `• Teléfono: ${doctorPhone || 'No especificado'}\n\n` +
      `Adjunto a continuación la captura del comprobante de transferencia para la activación inmediata de mis módulos Élite. ¡Muchas gracias!`;

    const encoded = encodeURIComponent(text);
    const targetPhone = (billingConfig.whatsappPhone || '+584243291438').replace(/\+/g, '').replace(/ /g, '').replace(/-/g, '');
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, '_blank');
  };

  const isAdminUser = userProfile?.role === 'admin' || userProfile?.isAdmin || userProfile?.email === 'carloseduardoleal29@gmail.com';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* TOP METALLIC GOLD HEADER */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 p-4 sm:p-6 relative shrink-0">
          <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
            <Crown className="w-32 h-32 text-amber-300" />
          </div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
                <Crown className="w-7 h-7 text-slate-950 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    SUSCRIPCIÓN OFICIAL ÉLITE
                  </span>
                  <span className="text-xs text-amber-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                    Edición Médica 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight flex items-center gap-2">
                  Plan Élite <span className="text-amber-400">AnestesiaPro</span>
                </h2>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  Acceso exclusivo a la suite avanzada de anestesiología creada por el <strong>Dr. Carlos Leal</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdminUser && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('anestesiapro_open_admin_billing_modal'))}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Editar tus datos de cobro como administrador"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Editar Mis Datos</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer shrink-0 border border-slate-700"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* STEP 1: PLAN SELECTOR (3 OPTIONS) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">1</span>
                Elige tu Plan de Suscripción
              </h3>
              <span className="text-xs text-slate-400">
                Todos los planes incluyen 100% de las herramientas Élite
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {(['3m', '6m', '1y'] as const).map((pKey) => {
                const p = plans[pKey];
                const isSelected = selectedPlan === pKey;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(pKey)}
                    className={`relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-950/50 scale-[1.02]'
                        : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap z-10">
                        ⭐ MÁS POPULAR • RECOMENDADO
                      </span>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeBg}`}>
                          {p.badge}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      <h4 className="text-base font-black text-white">{p.title}</h4>
                      <p className="text-xs text-slate-400 leading-tight">{p.description}</p>

                      <div className="pt-2">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            ${p.priceUSD}
                          </span>
                          <span className="text-xs font-bold text-amber-400">USD</span>
                          <span className="text-xs text-slate-400">/ {p.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          Equivale a <strong className="text-amber-300">${p.monthlyEquivalent} USD/mes</strong>
                        </p>
                      </div>
                    </div>

                    {p.savings && (
                      <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{p.savings}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: PAYMENT METHOD & REAL-TIME CONTINUOUS BINANCE / P2P VED CALCULATOR */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">2</span>
                  Datos de Cobro & Calculadora en Tiempo Real
                </h3>
                <p className="text-xs text-slate-400">
                  Transfiere el monto correspondiente al plan seleccionado (${currentPlanObj.priceUSD} USD)
                </p>
              </div>

              {/* Tasa Binance P2P / BCV Live Continuous Indicator */}
              <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 flex items-center gap-3 shrink-0 text-xs shadow-md">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span>Tasa Binance P2P / Dólar Paralelo:</span>
                  </div>
                  <div className="font-mono font-bold text-amber-300 text-sm mt-0.5">
                    1 USD = {exchangeRate.toFixed(2)} Bs
                  </div>
                  {lastUpdatedTime && (
                    <span className="text-[9px] text-slate-400">Actualizado: {lastUpdatedTime}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={fetchLiveExchangeRate}
                  disabled={isFetchingRate}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition-colors cursor-pointer border border-slate-700"
                  title="Actualizar tasa manualmente ahora"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRate ? 'animate-spin' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => setShowCustomRate(!showCustomRate)}
                  className="text-[10px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {showCustomRate ? 'Ocultar' : 'Ajustar'}
                </button>
              </div>
            </div>

            {/* Custom Rate Manual Adjustment Toggle */}
            {showCustomRate && (
              <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-3 flex items-center gap-3 text-xs">
                <span className="text-slate-300 font-medium">Ajustar Tasa Manual (Bs/USD):</span>
                <input
                  type="number"
                  step="0.1"
                  value={customRateInput}
                  onChange={(e) => handleCustomRateChange(e.target.value)}
                  className="w-28 bg-slate-950 border border-cyan-500/50 rounded-lg px-2.5 py-1 text-white font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <span className="text-[11px] text-slate-400">
                  (El cálculo en Bolívares se actualizará automáticamente)
                </span>
              </div>
            )}

            {/* PAYMENT METHOD TABS */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActivePaymentTab('pagomovil')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activePaymentTab === 'pagomovil'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>🇻🇪 Pago Móvil (Bolívares)</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('binance')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activePaymentTab === 'binance'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black shadow-md shadow-amber-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>⚡ Binance Pay / USDT</span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentTab('zinli')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                  activePaymentTab === 'zinli'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-900/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>💜 Zinli</span>
              </button>
            </div>

            {/* PAYMENT DETAILS TAB CONTENT */}
            <div className="pt-1">
              {activePaymentTab === 'pagomovil' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase text-blue-300 tracking-wider">
                        Monto Exacto a Transferir en Bolívares (Bs)
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                        Bs. {calculatedBs}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Calculado para ${currentPlanObj.priceUSD} USD a tasa {exchangeRate.toFixed(2)} Bs/USD
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(calculatedBs.replace(/\./g, '').replace(',', '.'), 'montoBs')}
                      className="px-3.5 py-2 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-cyan-200 border border-blue-400/50 font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
                    >
                      {copiedField === 'montoBs' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === 'montoBs' ? '¡Monto Copiado!' : 'Copiar Monto'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                    {billingConfig.pagoMovilBanks.map((b, idx) => (
                      <div key={b.code} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">BANCO #{idx + 1}</span>
                          <button
                            onClick={() => copyToClipboard(b.code, `banco_${b.code}`)}
                            className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            {copiedField === `banco_${b.code}` ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <p className="font-bold text-white">{b.code} ({b.name})</p>
                      </div>
                    ))}

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">CÉDULA DE IDENTIDAD</span>
                        <button
                          onClick={() => copyToClipboard(billingConfig.pagoMovilCedula.replace(/\D/g, ''), 'cedula')}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {copiedField === 'cedula' ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <p className="font-bold text-white font-mono">{billingConfig.pagoMovilCedula}</p>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">TELÉFONO PAGO MÓVIL</span>
                        <button
                          onClick={() => copyToClipboard(billingConfig.pagoMovilPhone.replace(/\D/g, ''), 'telefono')}
                          className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          {copiedField === 'telefono' ? '✓ Copiado' : 'Copiar'}
                        </button>
                      </div>
                      <p className="font-bold text-amber-300 font-mono text-sm">{billingConfig.pagoMovilPhone} (Dr. Carlos Leal)</p>
                    </div>
                  </div>
                </div>
              )}

              {activePaymentTab === 'binance' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          Monto USD a Enviar por Binance Pay
                        </span>
                        <div className="text-2xl font-black text-white font-mono">
                          ${currentPlanObj.priceUSD} USD
                        </div>
                      </div>
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Sin Comisión (Binance Pay)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Binance Email */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">CORREO BINANCE PAY</span>
                          <button
                            onClick={() => copyToClipboard(billingConfig.binanceEmail, 'binanceEmail')}
                            className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                          >
                            {copiedField === 'binanceEmail' ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <p className="font-bold text-white font-mono text-xs break-all">{billingConfig.binanceEmail}</p>
                      </div>

                      {/* Binance Pay ID */}
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">BINANCE PAY ID / USER ID</span>
                          <button
                            onClick={() => copyToClipboard(billingConfig.binancePayId || 'carloseduardoleal29', 'binancePayId')}
                            className="text-[11px] text-amber-400 hover:underline font-bold flex items-center gap-1"
                          >
                            {copiedField === 'binancePayId' ? '✓ Copiado' : 'Copiar ID'}
                          </button>
                        </div>
                        <p className="font-bold text-amber-300 font-mono text-xs">{billingConfig.binancePayId || 'carloseduardoleal29'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePaymentTab === 'zinli' && (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900 border border-purple-500/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider">
                          Monto USD por Zinli
                        </span>
                        <div className="text-2xl font-black text-white font-mono">
                          ${currentPlanObj.priceUSD} USD
                        </div>
                      </div>
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Zinli Wallet
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">CORREO ELECTRÓNICO ZINLI</span>
                      <p className="font-bold text-white font-mono text-sm break-all">{billingConfig.zinliEmail}</p>
                      <button
                        onClick={() => copyToClipboard(billingConfig.zinliEmail, 'zinliEmail')}
                        className="mt-1 text-[11px] text-purple-300 hover:underline font-bold flex items-center gap-1"
                      >
                        {copiedField === 'zinliEmail' ? '✓ Correo Copiado' : 'Copiar Correo Zinli'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PAYMENT REFERENCE INPUT OPTION */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>Número de Referencia de Transacción (Opcional):</span>
              </label>
              <input
                type="text"
                value={paymentRefNumber}
                onChange={(e) => setPaymentRefNumber(e.target.value)}
                placeholder="Ej: Ref. Pago Móvil / TxID Binance #19482019"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* STEP 3: HIGHLIGHTED ÉLITE BENEFITS GRID */}
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
              Beneficios Exclusivos Incluidos en Plan Élite
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-1.5 transition-all">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Calculator className="w-4 h-4 shrink-0" />
                  <span>Calculadoras Médicas Avanzadas</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Infusiones TIVA/TCI, dosis por peso real/ideal/magro, pediatría, vasoactivos y analgesia multimodal.
                </p>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-1.5 transition-all">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Crisis Intraoperatorias</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Checklists cognitivas en tiempo real: Hipertermia maligna, RCP en quirófano, LAST, anafilaxia y eFONA.
                </p>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-1.5 transition-all">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Activity className="w-4 h-4 shrink-0" />
                  <span>Simulador de Casos Clínicos</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Laboratorio interactivo con monitor virtual en vivo, trazados ECG/SpO2/Capnografía y escenarios de decisión.
                </p>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-1.5 transition-all">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Brain className="w-4 h-4 shrink-0" />
                  <span>Traduce y Resume con IA</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Análisis, traducción técnica médica fiel y resumen de artículos científicos de PubMed, BJA, Anesthesiology y NEJM.
                </p>
              </div>

              <div className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 space-y-1.5 transition-all sm:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Preanestesia & Membretes Personalizados</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Evaluación preanestésica oficial con membrete del hospital, logo institucional, firma digital manuscrita y exportación en PDF.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* MODAL FOOTER CTA BUTTONS */}
        <div className="bg-slate-950 border-t border-amber-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-300 text-center sm:text-left">
            <span className="font-bold text-white">¿Tienes alguna duda previa sobre tu pago?</span>
            <p className="text-[11px] text-slate-400">
              Escribe directamente al Dr. Carlos Leal ({billingConfig.pagoMovilPhone}) para soporte personalizado.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer w-1/3 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-slate-950 fill-current" />
              <span>Notificar Pago por WhatsApp</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

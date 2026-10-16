import React, { useState } from 'react';
import { 
  Share2, MessageCircle, Copy, Check, Sparkles, Instagram,
  Users, CheckCircle2, Globe, HeartHandshake, ExternalLink
} from 'lucide-react';
import { SHORT_APP_URL, getCanonicalAppOrigin } from '../../lib/statsService';

interface CalculatorShareBannerProps {
  title: string;
  description: string;
  category?: string;
  calcKey?: string;
  isGeneralSuite?: boolean;
}

export const CalculatorShareBanner: React.FC<CalculatorShareBannerProps> = ({
  title,
  description,
  category,
  calcKey,
  isGeneralSuite = false
}) => {
  const [copied, setCopied] = useState(false);
  const [instagramToast, setInstagramToast] = useState(false);

  // Direct deep-link: if calcKey is present, link directly to this specific calculator!
  const directUrl = isGeneralSuite
    ? `${SHORT_APP_URL}?panel=calculadoras`
    : `${SHORT_APP_URL}?calc=${calcKey || 'pediatric'}`;

  // Customized share text based on general suite vs specific calculator
  const shareText = isGeneralSuite
    ? `🩺 *AnestesiaPro • Suite Clínica Oficial (15 Calculadoras Médicas)*\n\n` +
      `Estimado colega, te invito a utilizar gratis la Suite de 15 Calculadoras Médicas y Farmacológicas desarrollada por el *Dr. Carlos Leal* (Especialista en Anestesiología y Reanimación):\n\n` +
      `⚡ *Herramientas Incluidas:*\n` +
      `• Pediatría & Vía Aérea (TET Cole/Motoyama, PALS, 4-2-1)\n` +
      `• Pérdidas Sanguíneas Permisibles (Fórmula de Gross & Shock ATLS)\n` +
      `• Bombas de Vasoactivos (Directa, Inversa y Perlas D5W vs SSN)\n` +
      `• TIVA & TCI Modelos PK/PD (Propofol & Remifentanilo)\n` +
      `• Conversor % a mg/ml y Ratios de Adrenalina 1:1.000 a 1:200k\n` +
      `• MACOCHA en UCI, Kirby PaFi, Balance Hídrico y Electrolitos\n\n` +
      `📲 *Ábrela directamente en tu teléfono o PC:* ${directUrl}`
    : `🩺 *AnestesiaPro • ${title}*\n\n` +
      `Te recomiendo utilizar esta calculadora médica desarrollada por el *Dr. Carlos Leal*:\n` +
      `📌 *Función:* ${description}\n\n` +
      `📲 *Entra directamente a esta calculadora aquí:* ${directUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleInstagramShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
    }
    setInstagramToast(true);
    setTimeout(() => setInstagramToast(false), 4500);

    const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank');
    }, 600);
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isGeneralSuite) {
    return (
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-xl text-white space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0 shadow-md">
              <Users className="w-6 h-6 text-emerald-300" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Invita & Masifica la Suite
                </span>
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                  Dr. Carlos Leal
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Recomienda estas 15 Calculadoras Médicas a Colegas & Residentes
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Comparte este enlace directo en grupos médicos de WhatsApp, Instagram, historias o posgrados de anestesiología.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current text-slate-950" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleInstagramShare}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-md active:scale-95"
              title="Copiar texto y abrir Instagram para Historias / Mensaje Directo"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-black">¡Enlace Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Enlace</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* INSTAGRAM TOAST NOTIFICATION */}
        {instagramToast && (
          <div className="bg-pink-950/90 border border-pink-500/50 rounded-xl p-2.5 text-xs text-pink-200 flex items-center justify-between gap-2 animate-fadeIn">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-pink-400 shrink-0" />
              ¡Texto y enlace directo copiados al portapapeles! Pégalo en tu Historia o Mensaje Directo de Instagram.
            </span>
          </div>
        )}
      </div>
    );
  }

  // INDIVIDUAL CALCULATOR BANNER (INSIDE ACTIVE VIEW WITH DIRECT DEEP LINK)
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 sm:p-3.5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-white space-y-2 sm:space-y-0">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
          <MessageCircle className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
              ¿Recomendar esta calculadora a un colega?
            </span>
            {category && (
              <span className="text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800">
                {category}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 font-medium line-clamp-1 mt-0.5">
            <strong>{title}:</strong> {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
          title="Compartir por WhatsApp con enlace directo a esta calculadora"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-950" />
          <span>WhatsApp Directo</span>
        </a>

        <button
          type="button"
          onClick={handleInstagramShare}
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          title="Copiar recomendación para Instagram"
        >
          <Instagram className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Instagram</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {instagramToast && (
        <div className="w-full bg-pink-950/90 border border-pink-500/50 rounded-xl p-2 text-xs text-pink-200 flex items-center gap-1.5 animate-fadeIn mt-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>¡Enlace directo copiado! Listo para pegar en Instagram.</span>
        </div>
      )}
    </div>
  );
};

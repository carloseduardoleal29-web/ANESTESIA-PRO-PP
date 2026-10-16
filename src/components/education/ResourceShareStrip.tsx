import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Sparkles, Send } from 'lucide-react';
import { SHORT_APP_URL, getCanonicalAppOrigin } from '../../lib/statsService';

interface ResourceShareStripProps {
  id: string;
  title: string;
  category?: string;
  summary?: string;
  compact?: boolean;
}

export const ResourceShareStrip: React.FC<ResourceShareStripProps> = ({
  id = '',
  title = 'Recurso AnestesiaPro',
  category,
  summary,
  compact = true
}) => {
  const [copied, setCopied] = useState(false);

  // Safe fallback values
  const safeId = id || 'recurso-clinico';
  const safeTitle = (title || 'Recurso AnestesiaPro').toString();
  const safeSummary = (summary || '').toString();

  // Generate deep-link to the exact resource
  const origin = getCanonicalAppOrigin();
  const shareUrl = `${origin}/?tab=educacion&recurso=${encodeURIComponent(safeId)}`;

  const cleanTitle = safeTitle.replace(/[^\w\s\(\)\-\.\,\:\/áéíóúÁÉÍÓÚñÑüÜ💊🩸🧬🌀🧠]/gi, '').trim() || 'Recurso AnestesiaPro';
  
  // Structured clinical notification message in Spanish as requested
  const shareMessage = `🩺 *Se publicó en Educación Continua de AnestesiaPro:* ${cleanTitle}\n` +
    `${category ? `📌 *Categoría:* ${category}\n` : ''}` +
    `${safeSummary ? `📝 ${safeSummary.slice(0, 140)}...\n` : ''}` +
    `\n👉 Te comparto el enlace para consultarlo directamente en AnestesiaPro:\n${shareUrl}`;

  // Official universal WhatsApp URL that works on mobile (iOS/Android app) and desktop (web/app) without download redirect loops
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: `Se publicó en Educación Continua de AnestesiaPro: ${cleanTitle}`,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink(e);
        }
      }
    } else {
      handleCopyLink(e);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className={`rounded-xl bg-gradient-to-r from-slate-900/95 via-cyan-950/40 to-slate-900/95 border border-cyan-500/30 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm ${
        compact ? 'text-xs' : 'text-sm'
      }`}
    >
      <div className="flex items-center gap-1.5 text-cyan-200">
        <div className="p-1 bg-cyan-500/20 rounded-lg text-cyan-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <span className="text-[11px] font-bold text-slate-200 tracking-wide">
          Compartir con colegas:
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* WhatsApp Direct Universal Link */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer hover:scale-105"
          title="Compartir directo por WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        {/* Native Mobile Share (Instagram, Telegram, X, Email) */}
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex items-center gap-1 bg-cyan-700/80 hover:bg-cyan-600 text-white font-bold text-[11px] px-2 py-1.5 rounded-lg border border-cyan-500/40 transition-all cursor-pointer hover:scale-105"
          title="Compartir en Redes (Instagram, Telegram, SMS)"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Redes</span>
        </button>

        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] px-2 py-1.5 rounded-lg border border-slate-700 transition-all cursor-pointer hover:text-white"
          title="Copiar enlace directo"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-extrabold">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Enlace</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

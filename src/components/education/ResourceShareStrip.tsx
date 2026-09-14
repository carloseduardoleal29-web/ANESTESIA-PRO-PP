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
  id,
  title,
  category,
  summary,
  compact = true
}) => {
  const [copied, setCopied] = useState(false);

  // Generate deep-link to the exact resource
  const origin = getCanonicalAppOrigin();
  const shareUrl = `${origin}/?tab=educacion&recurso=${encodeURIComponent(id)}`;

  const cleanTitle = title.replace(/[^\w\s\(\)\-\.\,\:\/áéíóúÁÉÍÓÚñÑüÜ💊🩸🧬🌀🧠]/gi, '').trim();
  const shareMessage = `🩺 *${cleanTitle}* [${category || 'Educación Continua'}]\n${summary ? summary.slice(0, 140) + '...' : 'Material clínico oficial en AnestesiaPro'}\n\n👉 Accede al recurso completo aquí:\n${shareUrl}`;

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(shareMessage);
    const url = isMobile ? `whatsapp://send?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: `Revisa este recurso clínico en AnestesiaPro: ${cleanTitle}`,
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
        {/* WhatsApp Direct Share Button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer hover:scale-105"
          title="Compartir directo por WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

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

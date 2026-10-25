import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';

interface ResourceShareStripProps {
  id?: string;
  resourceId?: string;
  title?: string;
  category?: string;
  summary?: string;
  compact?: boolean;
}

export const ResourceShareStrip: React.FC<ResourceShareStripProps> = (props) => {
  const [copied, setCopied] = useState(false);

  const safeId = props?.id ? String(props.id) : props?.resourceId ? String(props.resourceId) : 'recurso';
  const safeTitle = props?.title ? String(props.title) : 'Recurso AnestesiaPro';
  const safeCategory = props?.category ? String(props.category).toUpperCase() : 'EDUCACIÓN CONTINUA';
  const safeSummary = props?.summary ? String(props.summary).trim() : '';

  let currentUrl = '';
  try {
    currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] + '#res=' + safeId : '';
  } catch {
    currentUrl = '#res=' + safeId;
  }

  // Built WhatsApp share text including full description/summary of the file content
  const fullShareText = `🩺 *AnestesiaPro | ${safeCategory}*\n📌 *${safeTitle}*\n\n📝 *Contenido del Archivo:*\n${safeSummary || 'Material clínico y protocolo oficial en AnestesiaPro.'}\n\n🔗 *Enlace directo al recurso:* ${currentUrl}`;

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-200 mt-4 text-xs font-semibold">
      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
        <Share2 className="w-4 h-4 text-emerald-600" />
        <span>Compartir recurso con colegas:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* WhatsApp direct share button */}
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer font-black border border-emerald-500 active:scale-95 text-xs"
          title="Compartir por WhatsApp con resumen del archivo"
        >
          <MessageCircle className="w-4 h-4 text-white fill-current" />
          <span>Compartir en WhatsApp</span>
        </button>

        {/* Copy link option */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-all shadow-sm cursor-pointer font-bold border border-slate-700 active:scale-95 text-xs"
          title="Copiar texto y enlace al portapapeles"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
          <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
        </button>
      </div>
    </div>
  );
};

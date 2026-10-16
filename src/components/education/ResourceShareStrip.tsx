import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Globe } from 'lucide-react';

interface ResourceShareStripProps {
  id?: string;
  title?: string;
  category?: string;
  summary?: string;
  compact?: boolean;
}

export const ResourceShareStrip: React.FC<ResourceShareStripProps> = (props) => {
  const [copied, setCopied] = useState(false);

  const safeId = props?.id ? String(props.id) : 'recurso';
  const safeTitle = props?.title ? String(props.title) : 'Recurso AnestesiaPro';
  const safeSummary = props?.summary ? String(props.summary) : '';

  let currentUrl = '';
  try {
    currentUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] + '#res=' + safeId : '';
  } catch {
    currentUrl = '#res=' + safeId;
  }

  const shareText = `📚 AnestesiaPro Educación Continua: "${safeTitle}"\n${safeSummary}\n🔗 ${currentUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsApp = () => {
    try {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } catch {
      // ignore
    }
  };

  const handleWebShare = () => {
    try {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-700/60 mt-4 text-xs text-slate-300">
      <span className="flex items-center gap-1 font-medium text-cyan-400">
        <Share2 className="w-3.5 h-3.5" /> Compartir recurso:
      </span>
      <button
        onClick={handleWhatsApp}
        className="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 px-2.5 py-1 rounded-md transition-colors border border-emerald-500/30"
        title="Compartir por WhatsApp"
      >
        <MessageSquare className="w-3 h-3" /> WhatsApp
      </button>
      <button
        onClick={handleWebShare}
        className="flex items-center gap-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 px-2.5 py-1 rounded-md transition-colors border border-sky-500/30"
        title="Compartir en Redes"
      >
        <Globe className="w-3 h-3" /> Redes
      </button>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 bg-slate-700/50 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-md transition-colors border border-slate-600 ml-auto"
        title="Copiar enlace"
      >
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? '¡Copiado!' : 'Copiar'}
      </button>
    </div>
  );
};

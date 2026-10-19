import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

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

  return (
    <div className="flex items-center justify-between pt-3 border-t border-slate-200 mt-4 text-xs font-semibold text-slate-800">
      <span className="flex items-center gap-1.5 font-black text-blue-700">
        <Share2 className="w-4 h-4 text-blue-600" /> Enlace rápido:
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer font-black border border-blue-500 active:scale-95"
        title="Copiar enlace para colegas"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4 text-white" />}
        <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
      </button>
    </div>
  );
};

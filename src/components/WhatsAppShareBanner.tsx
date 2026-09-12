import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Sparkles } from 'lucide-react';
import { SHORT_APP_URL } from '../lib/statsService';

interface WhatsAppShareBannerProps {
  title: string;
  description: string;
  tabParam?: string;
  shareText?: string;
  theme?: 'cyan' | 'rose' | 'emerald' | 'amber';
}

export const WhatsAppShareBanner: React.FC<WhatsAppShareBannerProps> = ({
  title,
  description,
  tabParam,
  shareText,
  theme = 'cyan'
}) => {
  const [copied, setCopied] = useState(false);

  const fullUrl = tabParam ? `${SHORT_APP_URL}?tab=${tabParam}` : SHORT_APP_URL;
  const messageToShare = `${shareText || `🩺 Te recomiendo revisar ${title} en AnestesiaPro:`}\n\n${description}\n\n🔗 ${fullUrl}`;

  const handleWhatsAppShare = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const encoded = encodeURIComponent(messageToShare);
    const url = isMobile ? `whatsapp://send?text=${encoded}` : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(messageToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const themeClasses = {
    cyan: 'from-cyan-950/70 via-slate-900 to-slate-900 border-cyan-500/40 text-cyan-300',
    rose: 'from-rose-950/70 via-slate-900 to-slate-900 border-rose-500/40 text-rose-300',
    emerald: 'from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500/40 text-emerald-300',
    amber: 'from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40 text-amber-300',
  };

  return (
    <div className={`bg-gradient-to-r ${themeClasses[theme]} border rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-white`}>
      <div className="flex items-center gap-3 text-left">
        <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
          <MessageCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-white">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Compartir este módulo con colegas
          </h4>
          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-md active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
        </button>
      </div>
    </div>
  );
};

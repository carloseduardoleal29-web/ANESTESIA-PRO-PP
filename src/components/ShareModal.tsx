import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  ExternalLink,
  QrCode,
  Smartphone,
  MessageSquare
} from 'lucide-react';
import { getCanonicalAppOrigin, SHORT_APP_URL } from '../lib/statsService';

export interface ShareData {
  title?: string;
  description?: string;
  url?: string;
  category?: string;
  badge?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData?: ShareData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareData
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Resolve current app URL (prioritize official domain: https://anestesiapro.ai.studio)
  let rawUrl = shareData?.url || SHORT_APP_URL;
  if (rawUrl.includes('run.app') || rawUrl.includes('localhost') || rawUrl.includes('pmfsaxxhmz7bew34l7t3ny')) {
    try {
      const parsed = new URL(rawUrl);
      const suffix = `${parsed.pathname !== '/' ? parsed.pathname : ''}${parsed.search}${parsed.hash}`;
      rawUrl = `${SHORT_APP_URL}${suffix}`;
    } catch {
      rawUrl = SHORT_APP_URL;
    }
  }
  const finalUrl = rawUrl;
  const itemTitle = shareData?.title || 'AnestesiaPro';
  const itemDescription = shareData?.description || '';

  // Formatted message with title, description and direct link
  const cleanShareMessage = itemDescription
    ? `${itemTitle}\n\n${itemDescription}\n\n🔗 ${finalUrl}`
    : `${itemTitle}\n\n🔗 ${finalUrl}`;

  // WhatsApp share URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(cleanShareMessage)}`;

  // Telegram share URL
  const telegramText = itemDescription
    ? `${itemTitle}\n\n${itemDescription}`
    : itemTitle;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(finalUrl)}&text=${encodeURIComponent(telegramText)}`;

  // Facebook share URL
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(finalUrl)}`;

  // Twitter / X share URL
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(itemTitle)}&url=${encodeURIComponent(finalUrl)}`;

  // Native mobile share handler (includes Instagram, WhatsApp, etc. directly from mobile)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: itemTitle,
          text: cleanShareMessage,
          url: finalUrl
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Instagram share
  const handleInstagramShare = async () => {
    handleCopyText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: itemTitle,
          text: cleanShareMessage,
          url: finalUrl
        });
        return;
      } catch (e) {
        // Fallback below
      }
    }
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy message to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(cleanShareMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Dynamic QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(finalUrl)}&bgcolor=020617&color=38bdf8&margin=8`;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl relative text-white space-y-4 my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all cursor-pointer"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-6">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Compartir Enlace
            </h3>
          </div>
          <p className="text-xs font-bold text-cyan-300">
            {itemTitle}
          </p>
          {itemDescription && (
            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
              {itemDescription}
            </p>
          )}
        </div>

        {/* Copy Link Input Bar */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={finalUrl}
              className="bg-transparent text-xs text-cyan-300 font-mono w-full focus:outline-none select-all truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                copiedLink
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Primary 1-Tap Action: WhatsApp */}
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.823h.001c3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.809-5.77-5.809zm3.376 8.21c-.14.394-.813.738-1.121.78-.291.04-.664.062-1.076-.07-.251-.08-.574-.187-1.002-.372-1.802-.782-2.969-2.614-3.06-2.735-.09-.122-.738-.982-.738-1.872 0-.89.467-1.328.634-1.509.167-.181.365-.226.486-.226.121 0 .243.001.35.006.112.005.263-.042.411.314.152.366.518 1.264.563 1.355.046.091.076.198.016.319-.06.121-.091.197-.182.303-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.472.778 1.014 1.261.696.62 1.282.812 1.464.903.182.091.289.076.395-.046.106-.121.456-.532.578-.715.121-.182.243-.152.41-.091.167.061 1.064.502 1.246.593.182.091.304.137.35.213.045.076.045.441-.095.835z"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.98-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.167c-1.637 0-3.15-.478-4.432-1.3l-.318-.204-2.964.777.791-2.89-.208-.33A8.136 8.136 0 013.833 12c0-4.503 3.664-8.167 8.167-8.167 4.503 0 8.167 3.664 8.167 8.167 0 4.503-3.664 8.167-8.167 8.167z"/>
            </svg>
            <span>Enviar por WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>

        {/* Social Networks Row: Facebook, Instagram, Telegram, Móvil */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Facebook */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer shadow"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer shadow"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </button>

          {/* Telegram */}
          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-[#229ED9] hover:bg-[#1f8ec3] text-white p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Telegram</span>
          </a>

          {/* Native Mobile Share */}
          <button
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-xl text-center text-xs font-bold transition-all cursor-pointer shadow border border-slate-700"
            title="Abrir menú de compartir del teléfono"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Móvil</span>
          </button>
        </div>

        {/* QR Code Toggle */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{showQr ? 'Ocultar Código QR' : 'Mostrar Código QR'}</span>
          </button>
        </div>

        {/* QR Code Section */}
        {showQr && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2 animate-fadeIn">
            <p className="text-xs text-slate-300">
              Escanea con la cámara del móvil:
            </p>
            <div className="flex justify-center p-2 bg-white rounded-xl w-fit mx-auto shadow">
              <img
                src={qrCodeUrl}
                alt="Código QR"
                className="w-40 h-40 object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

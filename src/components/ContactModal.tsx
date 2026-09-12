import React, { useState } from 'react';
import { X, MessageSquare, MapPin, Mail, Instagram, SendHorizontal, Send, CheckCircle2 } from 'lucide-react';
import { submitUserFeedback } from '../lib/statsService';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted?: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onFeedbackSubmitted }) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackLocation, setFeedbackLocation] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackSending, setFeedbackSending] = useState(false);

  if (!isOpen) return null;

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;
    setFeedbackSending(true);

    const ok = await submitUserFeedback({
      name: feedbackName,
      email: feedbackEmail,
      location: feedbackLocation,
      message: feedbackMessage
    });

    setFeedbackSending(false);
    if (ok) {
      setFeedbackSent(true);
      setFeedbackMessage('');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
      setTimeout(() => setFeedbackSent(false), 5000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-cyan-500/40 relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/30 shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              Contacto Directo y Sugerencias
            </h3>
            <p className="text-xs text-cyan-300 font-medium">
              Dr. Carlos Eduardo Leal &bull; Anestesiología y Reanimación
            </p>
          </div>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>Ubicación</span>
            </div>
            <p className="text-slate-200 font-bold">Maracay, Estado Aragua</p>
            <p className="text-[11px] text-slate-400">República Bolivariana de Venezuela</p>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold">
              <Mail className="w-4 h-4 shrink-0" />
              <span>Correo Electrónico</span>
            </div>
            <p className="text-slate-200 font-mono text-[11px] truncate">carloseduardoleal29@gmail.com</p>
            <a
              href="mailto:carloseduardoleal29@gmail.com?subject=Consulta%20AnestesiaPro"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-cyan-400 hover:underline font-bold inline-block"
            >
              Enviar correo directamente &rarr;
            </a>
          </div>
        </div>

        {/* DIRECT INSTAGRAM & EMAIL BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <a
            href="https://www.instagram.com/anestesiapro2026?igsh=MXNkOXAybjVycXppcw=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:via-pink-500 hover:to-amber-400 text-white font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Instagram: @anestesiapro2026</span>
          </a>

          <a
            href="mailto:carloseduardoleal29@gmail.com?subject=Sugerencia%20o%20Consulta%20AnestesiaPro"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/40 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Enviar Correo Oficial</span>
          </a>
        </div>

        {/* SUGGESTIONS FORM */}
        <form onSubmit={handleSendFeedback} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
            <SendHorizontal className="w-4 h-4 text-cyan-400" /> Dejar una Sugerencia o Comentario:
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              placeholder="Tu Nombre / Dr.(a) (Opcional)"
              className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
            <input
              type="text"
              value={feedbackLocation}
              onChange={(e) => setFeedbackLocation(e.target.value)}
              placeholder="Ciudad / País (Opcional)"
              className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <input
            type="email"
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.target.value)}
            placeholder="Tu Correo Electrónico (Opcional)"
            className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
          />

          <textarea
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder="Escribe aquí tus sugerencias, preguntas o comentarios sobre la app..."
            rows={3}
            className="w-full text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-400 focus:outline-none resize-none"
            required
          />

          <button
            type="submit"
            disabled={feedbackSending}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{feedbackSending ? 'Enviando...' : 'Enviar Sugerencia al Dr. Carlos Leal'}</span>
          </button>

          {feedbackSent && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-xl p-2.5 text-center space-y-1">
              <p className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ¡Sugerencia registrada con éxito!
              </p>
              <p className="text-[11px] text-emerald-200">
                Muchas gracias por tu valioso aporte. El Dr. Carlos Leal revisará tu mensaje.
              </p>
            </div>
          )}
        </form>

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

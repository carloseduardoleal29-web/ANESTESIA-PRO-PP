import React, { useState } from 'react';
import { Crown, CreditCard, X, ShieldCheck, Download, Share2, Check, QrCode } from 'lucide-react';
import { DoctorUser } from '../types/user';

interface DigitalCardModalProps {
  user: DoctorUser;
  onClose: () => void;
}

export const DigitalCardModal: React.FC<DigitalCardModalProps> = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);

  const cardDetails = `CARNET DIGITAL ANESTESIAPRO\nMédico: ${user.fullName}\nEspecialidad: ${user.specialty}\nCédula / ID: ${user.medicalId}\nPaís: ${user.country}\nPlan: Pro Elite Fundador (Estatus Activo)`;

  const handleCopyCardInfo = () => {
    navigator.clipboard.writeText(cardDetails);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl p-6 relative overflow-hidden space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 shadow-sm">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>CARNET DIGITAL OFICIAL ANESTESIAPRO</span>
          </div>
          <p className="text-xs text-slate-400">Credencial Electrónica Médica Verificada en la Nube</p>
        </div>

        {/* Simulated PVC Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950 border-2 border-cyan-500/50 shadow-2xl space-y-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-base shadow-md">
                AP
              </div>
              <div>
                <div className="font-black text-sm text-slate-100 tracking-tight">AnestesiaPro</div>
                <div className="text-[10px] text-cyan-400 font-semibold">Credencial Médica Autorizada</div>
              </div>
            </div>
            <span className="px-2.5 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>VERIFICADO</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-2xl font-black text-cyan-300 shadow-lg shrink-0">
              {user.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1 min-w-0">
              <h4 className="font-bold text-slate-100 text-base truncate">{user.fullName}</h4>
              <p className="text-xs text-cyan-300 font-semibold">{user.specialty}</p>
              <p className="text-[11px] text-slate-400">
                Cédula / ID: <strong className="text-slate-200 font-mono">{user.medicalId}</strong>
              </p>
              <p className="text-[11px] text-slate-400">
                Ubicación: <strong className="text-slate-200">{user.country}</strong>
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              Acreditación: <strong className="text-amber-300 font-semibold">Pro Elite Fundador</strong>
            </div>
            <div className="font-mono text-cyan-400 font-bold">
              MPPS-84920
            </div>
          </div>

          {/* Holographic Watermark effect */}
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Buttons Bar */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleCopyCardInfo}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Copiar Datos</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrintCard}
            className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Imprimir Carnet</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Esta credencial electrónica certifica el registro activo del Dr(a). {user.fullName} en la plataforma central AnestesiaPro y la red de anestesiología.
        </p>

      </div>
    </div>
  );
};

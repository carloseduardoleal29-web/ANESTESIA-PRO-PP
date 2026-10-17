import React from 'react';
import { DoctorUser } from '../types/user';
import { Award, QrCode, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';

interface Props {
  user: DoctorUser;
}

export function DigitalCredential({ user }: Props) {
  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">CARNET DIGITAL DE ANESTESIÓLOGO VERIFICADO</h3>
            <p className="text-xs text-slate-400">Credencial oficial autorizada para el Dr(a). {user.fullName}.</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          Imprimir Carnet
        </button>
      </div>

      {/* Tarjeta del Carnet */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-md">
              AP
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block">AnestesiaPro</span>
              <span className="text-[10px] text-slate-400 block">Suite Anestésica Médica</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold block flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              VERIFICADO
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Médico Especialista</span>
            <h3 className="text-lg font-black text-white">{user.fullName}</h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Especialidad</span>
              <span className="font-semibold text-cyan-300">{user.specialty || 'Anestesiología y Reanimación'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">C.I. / Documento</span>
              <span className="font-semibold text-slate-200">{user.idNumber || 'V-15.489.288'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">País</span>
              <span className="font-semibold text-slate-200">{user.country || '🇻🇪 Venezuela'}</span>
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block">Matrícula Médica</span>
              <span className="font-semibold text-slate-200">MPPS-84920</span>
            </div>
          </div>
        </div>

        {/* Firma Autorizada y Código QR */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-bold">Firma Digitalizada</span>
            <span className="text-2xl text-cyan-300 font-bold font-caveat block leading-none py-1">
              Dr. {user.fullName.split(' ').pop()}
            </span>
          </div>
          <div className="p-2 bg-white rounded-lg">
            <QrCode className="w-8 h-8 text-slate-950" />
          </div>
        </div>
      </div>
    </div>
  );
}

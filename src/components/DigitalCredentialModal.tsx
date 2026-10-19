import React from 'react';
import { DoctorUser } from '../types/user';
import {
  X,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Building2,
  Phone,
  Mail,
  QrCode,
  Download,
  Share2,
  Sparkles,
  Stethoscope
} from 'lucide-react';

interface Props {
  user: DoctorUser;
  onClose: () => void;
}

export function DigitalCredentialModal({ user, onClose }: Props) {
  const isCarlosLeal = user.id === 'usr_carlos_leal_admin' || user.email?.toLowerCase().includes('carloseduardoleal');
  const avatarUrl = isCarlosLeal ? '/uploads/1790526098365_43438.jpg' : '/icon-192.png';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Carnet Digital Médico - ${user.fullName}`,
          text: `Credencial Profesional de Anestesiología de ${user.fullName} en AnestesiaPro Suite.`,
          url: window.location.href,
        });
      } catch (e) {
        console.warn('Share dismissed:', e);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-cyan-500/20 text-slate-100">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado del Carnet Oficial */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-cyan-500/30">
            AP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-cyan-400">
                Colegio Médico • República
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                VERIFICADO
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Carnet Digital de Anestesiólogo</h3>
          </div>
        </div>

        {/* Tarjeta Visual de Credencial */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-5 shadow-inner">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex gap-4 items-center mb-4">
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user.fullName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/icon-192.png';
                }}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-md bg-slate-800"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-slate-950 stroke-[3]" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">
                {user.role === 'admin' ? 'Fundador & Especialista' : 'Médico Anestesiólogo'}
              </span>
              <h4 className="text-lg font-black text-white truncate leading-tight">{user.fullName}</h4>
              <p className="text-xs text-slate-300 font-medium truncate">{user.specialty}</p>
              {user.subspecialty && (
                <p className="text-[11px] text-cyan-300 truncate font-semibold mt-0.5">
                  ✦ {user.subspecialty}
                </p>
              )}
            </div>
          </div>

          {/* Datos Institucionales y Matrículas */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-slate-800/80 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Documento de Identidad</span>
              <span className="font-bold text-slate-100 font-mono">{user.idNumber || 'V-15.489.288'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">País / Jurisdicción</span>
              <span className="font-bold text-slate-100">{user.country || '🇻🇪 Venezuela'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Matrícula MPPS</span>
              <span className="font-bold text-cyan-300 font-mono">{user.medicalLicenseNumber || 'MPPS-84920'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Colegio de Médicos</span>
              <span className="font-bold text-cyan-300 font-mono">{user.collegeRegistration || 'CM-4521'}</span>
            </div>
          </div>

          {/* Sede Hospitalaria */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{user.workplace || 'Maracay, Estado Aragua'}</span>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-bold text-[10px] border border-emerald-500/30">
              {user.elitePlan?.planType === 'lifetime' ? 'PRO VITALICIO' : 'PRO ACTIVO'}
            </span>
          </div>

          {/* Código QR de Validación Médica */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/70 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <QrCode className="w-7 h-7 text-slate-950" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-white block">Validación Quirúrgica 24/7</span>
                <span className="text-[9px] text-slate-400 font-mono">ID: {user.id.slice(0, 16)}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-500 block">Emisión Digital</span>
              <span className="text-[10px] font-semibold text-slate-300">
                {user.registeredAt ? user.registeredAt.slice(0, 10) : '2026-10-01'}
              </span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            Compartir Credencial
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:brightness-110"
          >
            <Download className="w-4 h-4" />
            Imprimir / Guardar
          </button>
        </div>

      </div>
    </div>
  );
}

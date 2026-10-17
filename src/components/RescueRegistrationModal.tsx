import React, { useState } from 'react';
import { DoctorUser } from '../types/user';
import { saveLocalActiveDoctor } from '../lib/userService';
import { UserCheck, ShieldCheck, Stethoscope, Sparkles } from 'lucide-react';

interface Props {
  initialData?: DoctorUser;
  onComplete: (user: DoctorUser) => void;
}

export function RescueRegistrationModal({ initialData, onComplete }: Props) {
  const [fullName, setFullName] = useState(initialData?.fullName || 'Dr. Carlos Eduardo Leal');
  const [email, setEmail] = useState(initialData?.email || 'carloseduardoleal29@gmail.com');
  const [idNumber, setIdNumber] = useState(initialData?.idNumber || 'V-15.489.288');
  const [specialty, setSpecialty] = useState(initialData?.specialty || 'Médico Especialista en Anestesiología y Reanimación');
  const [country, setCountry] = useState(initialData?.country || '🇻🇪 Venezuela');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verifiedUser: DoctorUser = {
      id: initialData?.id || 'usr_carlos_leal_admin',
      fullName,
      email,
      idNumber,
      specialty,
      country,
      role: 'admin',
      isAdmin: true,
      registeredAt: initialData?.registeredAt || new Date().toISOString(),
      isPro: true,
      elitePlan: {
        status: 'active',
        planType: 'lifetime',
        expiresAt: 'Permanente (Autor y Fundador)'
      }
    };
    saveLocalActiveDoctor(verifiedUser);
    onComplete(verifiedUser);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-cyan-500/20 text-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/30">
            AP
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              AnestesiaPro Suite
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-slate-400">Dr. Carlos Leal • Acceso & Registro Clínico</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cédula / Matrícula</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">País</label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Especialidad</label>
            <input
              type="text"
              required
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 flex items-start gap-2.5 mt-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-200/90 leading-relaxed">
              Cuenta de Autor verificada (Dr. Carlos Eduardo Leal). Acceso Pro Permanente ilimitado con calculadoras de inducción, preanestesia y VORTEX.
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <UserCheck className="w-5 h-5" />
            Acceder a la Suite AnestesiaPro
          </button>
        </form>
      </div>
    </div>
  );
}

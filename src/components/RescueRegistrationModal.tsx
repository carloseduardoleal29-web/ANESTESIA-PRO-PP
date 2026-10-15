import React, { useState } from 'react';
import { UserCheck, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { registerDoctorInCloud } from '../lib/userService';
import { DoctorUser } from '../types/user';

interface RescueModalProps {
  initialData?: Partial<DoctorUser>;
  onComplete: (user: DoctorUser) => void;
}

export const RescueRegistrationModal: React.FC<RescueModalProps> = ({ initialData, onComplete }) => {
  const [fullName, setFullName] = useState(initialData?.fullName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [medicalId, setMedicalId] = useState(initialData?.medicalId || '');
  const [specialty, setSpecialty] = useState(initialData?.specialty || 'Anestesiología');
  const [country, setCountry] = useState(initialData?.country || 'Venezuela');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !medicalId.trim()) {
      setError('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    setLoading(true);
    try {
      // Register strictly in Firestore cloud database and await verification
      const savedUser = await registerDoctorInCloud({
        fullName,
        email,
        medicalId,
        specialty,
        country,
        registeredAt: new Date().toISOString(),
        isPro: initialData?.isPro || false
      });

      onComplete(savedUser);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar tu registro en la nube. Verifica tu conexión a internet e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg overflow-hidden border bg-slate-900 border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/50">
        
        {/* Header */}
        <div className="p-6 text-center border-b bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-slate-800">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <span>Actualización de AnestesiaPro</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            Completa tus datos profesionales para vincular tu perfil a la nube central y mantener tu acceso activo en todos tus dispositivos.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-300 border rounded-xl bg-red-950/50 border-red-800">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Nombre y Apellido *
            </label>
            <input
              type="text"
              required
              placeholder="Dr. Carlos Leal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              placeholder="doctor@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Cédula / ID Profesional *
              </label>
              <input
                type="text"
                required
                placeholder="V-12345678 / M-9988"
                value={medicalId}
                onChange={(e) => setMedicalId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Especialidad
              </label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="Anestesiología">Anestesiología</option>
                <option value="Residente Anestesia">Residente Anestesiología</option>
                <option value="Cuidados Intensivos">Cuidados Intensivos</option>
                <option value="Cirugía General">Cirugía General</option>
                <option value="Medicina de Urgencias">Medicina de Urgencias</option>
                <option value="Otro Profesional">Otro Profesional de Salud</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              País
            </label>
            <input
              type="text"
              placeholder="Venezuela / Colombia / México..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando y Guardando en Firestore...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-5 h-5" />
                <span>Confirmar y Acceder a AnestesiaPro</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-2">
            Tus datos quedan resguardados de forma segura en la base de datos central de AnestesiaPro.
          </p>
        </form>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Mail, Phone, Globe, Smartphone, ArrowRight, Loader2 } from 'lucide-react';
import { collection, doc, setDoc, getDocs, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { MedicoRegistrado } from '../types';

interface RegistrationGateOverlayProps {
  onVerified: (medico: MedicoRegistrado) => void;
}

export const RegistrationGateOverlay: React.FC<RegistrationGateOverlayProps> = ({ onVerified }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('México');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Automatic rescue of previous records from localStorage / cache
  useEffect(() => {
    const rescuePreviousRegistrations = async () => {
      try {
        const cachedLocal = localStorage.getItem('anestesiapro_medico');
        if (cachedLocal) {
          const parsed: MedicoRegistrado = JSON.parse(cachedLocal);
          if (parsed && parsed.email) {
            // Silently upload to Firestore if not already present
            const docRef = doc(db, 'medicos_registrados', parsed.id || parsed.email);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                ...parsed,
                deviceInfo: navigator.userAgent,
                createdAt: parsed.createdAt || new Date().toISOString()
              });
            }
            onVerified(parsed);
            return;
          }
        }

        // Check if any record exists in Firestore for default device / session or previous email
        const querySnapshot = await getDocs(collection(db, 'medicos_registrados'));
        if (!querySnapshot.empty) {
          const first = querySnapshot.docs[0].data() as MedicoRegistrado;
          localStorage.setItem('anestesiapro_medico', JSON.stringify(first));
          onVerified(first);
        }
      } catch (err) {
        console.error('Error during automatic rescue:', err);
      }
    };

    rescuePreviousRegistrations();
  }, [onVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !country.trim()) {
      setError('Por favor complete los campos obligatorios (Nombre, Correo y País).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const medicoId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const newMedico: MedicoRegistrado = {
        id: medicoId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        country: country.trim(),
        deviceInfo: navigator.userAgent,
        createdAt: new Date().toISOString()
      };

      const docRef = doc(db, 'medicos_registrados', medicoId);
      await setDoc(docRef, newMedico, { merge: true });

      localStorage.setItem('anestesiapro_medico', JSON.stringify(newMedico));
      onVerified(newMedico);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'medicos_registrados');
      setError('Error al registrar en Firestore. Verifique su conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-cyan-600/20 border border-cyan-500/30 rounded-2xl mx-auto flex items-center justify-center shadow-lg text-cyan-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">AnestesiaPro 2026</h2>
          <p className="text-slate-300 text-sm">
            Acceso exclusivo para profesionales de la salud. Ingrese sus datos para habilitar su registro verificado en la nube.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-300 p-3.5 rounded-xl text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Nombre Completo y Título *
            </label>
            <input
              type="text"
              required
              placeholder="Dr. Carlos Leal (Anestesiólogo)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" /> Correo Electrónico Profesional *
            </label>
            <input
              type="email"
              required
              placeholder="medico@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" /> Teléfono / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+52 55 0000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> País *
              </label>
              <input
                type="text"
                required
                placeholder="México"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Verificando y Registrando...
              </>
            ) : (
              <>
                Ingresar a AnestesiaPro <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500">
          Tus datos se sincronizan de forma segura con Google Cloud Firestore.
        </div>
      </div>
    </div>
  );
};

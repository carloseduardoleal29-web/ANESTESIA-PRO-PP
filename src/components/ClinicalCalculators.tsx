import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  Wind, 
  Syringe, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Award,
  AlertTriangle,
  Stethoscope,
  Image as ImageIcon
} from 'lucide-react';
import { DoctorUser } from '../types/user';

interface ClinicalCalculatorsProps {
  user: DoctorUser;
  onOpenAdmin: () => void;
}

export const ClinicalCalculators: React.FC<ClinicalCalculatorsProps> = ({ user, onOpenAdmin }) => {
  const [weight, setWeight] = useState<number>(70);
  const [asaClass, setAsaClass] = useState<string>('ASA I');
  const [activeTab, setActiveTab] = useState<'induction' | 'airway' | 'peds' | 'vortex'>('induction');
  const [preAnestheticGenerated, setPreAnestheticGenerated] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const uploadedPhoto = '/uploads/1790526098365_43438.jpg';

  // Dosis calculadas según peso corporal
  const propofolDose = (weight * 2).toFixed(1); // 2 mg/kg
  const fentanylDose = (weight * 2).toFixed(0); // 2 mcg/kg
  const rocuroniumDose = (weight * 0.6).toFixed(1); // 0.6 mg/kg
  const succinylcholineDose = (weight * 1.5).toFixed(0); // 1.5 mg/kg
  const sugammadexReversal = (weight * 2).toFixed(0); // 2 mg/kg

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-12">
      
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b bg-slate-900/90 backdrop-blur-md border-slate-800 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Uploaded Photo / Logo Display */}
          <div className="relative group cursor-pointer" onClick={() => setShowPhotoModal(true)}>
            <img
              src={uploadedPhoto}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/app_logo.jpg';
              }}
              alt="AnestesiaPro Foto"
              className="w-11 h-11 rounded-xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-100 text-base sm:text-lg">AnestesiaPro</h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                v2026.2
              </span>
              {user.isPro && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Dr. {user.fullName} ({user.specialty})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPhotoModal(true)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Ver Foto</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Panel Admin</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 pt-6 flex-1 space-y-6">
        
        {/* Welcome Status Banner */}
        <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={uploadedPhoto}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/app_logo.jpg';
              }}
              alt="Foto AnestesiaPro"
              onClick={() => setShowPhotoModal(true)}
              className="w-14 h-14 rounded-xl object-cover border border-cyan-500/40 shadow-md cursor-pointer hover:scale-105 transition"
            />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
                <span>Evaluación Preanestésica & Calculadora de Inducción</span>
              </h2>
              <p className="text-xs text-slate-400">
                Sincronización en la nube activa • Cédula/ID: <span className="text-slate-200 font-mono">{user.medicalId}</span> • País: <span className="text-slate-200">{user.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <label className="text-xs font-semibold text-slate-400">Peso Paciente (kg):</label>
            <input
              type="number"
              min="1"
              max="300"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value) || 70)}
              className="w-20 px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-cyan-400 font-bold text-center text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('induction')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'induction'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Syringe className="w-4 h-4" />
            <span>Inducción Adultos</span>
          </button>

          <button
            onClick={() => setActiveTab('airway')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'airway'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Vía Aérea Difícil</span>
          </button>

          <button
            onClick={() => setActiveTab('vortex')}
            className={`px-4 py-2.5 rounded-t-xl text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'vortex'
                ? 'bg-slate-900 text-cyan-400 border-t border-x border-slate-800'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Enfoque VORTEX</span>
          </button>
        </div>

        {/* Tab Content: Induction */}
        {activeTab === 'induction' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Induction Doses */}
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-cyan-400" />
                <span>Dosis de Inducción para {weight} kg</span>
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">Propofol (2 mg/kg)</div>
                    <div className="text-xs text-slate-400">Hipnótico de inducción rápida</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-cyan-400">{propofolDose} mg</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">Fentanilo (2 mcg/kg)</div>
                    <div className="text-xs text-slate-400">Opioide analgésico de inducción</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-cyan-400">{fentanylDose} mcg</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">Rocuronio (0.6 mg/kg)</div>
                    <div className="text-xs text-slate-400">Bloqueador neuromuscular no despolarizante</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-cyan-400">{rocuroniumDose} mg</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200 text-sm">Sugammadex Reversión (2 mg/kg)</div>
                    <div className="text-xs text-slate-400">Reversión rápida de rocuronio</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-emerald-400">{sugammadexReversal} mg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ASA Classification Card */}
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Clasificación del Estado Físico ASA</span>
              </h3>

              <div className="space-y-2">
                {['ASA I', 'ASA II', 'ASA III', 'ASA IV', 'ASA V'].map((asa) => (
                  <button
                    key={asa}
                    onClick={() => setAsaClass(asa)}
                    className={`w-full p-3 rounded-xl border text-left text-sm font-semibold transition flex items-center justify-between ${
                      asaClass === asa
                        ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{asa}</span>
                    {asaClass === asa && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPreAnestheticGenerated(true)}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generar Informe de Evaluación Preanestésica</span>
              </button>

              {preAnestheticGenerated && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-xl text-xs text-emerald-300 space-y-1">
                  <div className="font-bold text-emerald-400">✓ Informe Preanestésico Generado Con Éxito</div>
                  <p>Firma digital respaldada por el registro oficial del Dr. {user.fullName} (ID: {user.medicalId}).</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab Content: VORTEX */}
        {activeTab === 'vortex' && (
          <div className="p-6 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-lg">Algoritmo VORTEX - Manejo de Vía Aérea Difícil</h3>
                <p className="text-xs text-slate-400">Guía gráfica y secuencial para situaciones no intubable / no oxigenable.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-cyan-400 text-sm">Línea 1: Máscara Facial</div>
                <p className="text-xs text-slate-300">Oxigenación previa, cánula orofaríngea de Guedel y técnica a dos manos.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-cyan-400 text-sm">Línea 2: Dispositivo Supraglótico</div>
                <p className="text-xs text-slate-300">Insertar máscara laríngea o i-Gel de tamaño adecuado sin forzar.</p>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="font-bold text-cyan-400 text-sm">Línea 3: Tubo Endotraqueal</div>
                <p className="text-xs text-slate-300">Videolaringoscopía, conductor/bougie y optimización de posición.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Airway */}
        {activeTab === 'airway' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Wind className="w-5 h-5 text-cyan-400" />
              <span>Escalas de Predicción de Vía Aérea Difícil</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-200 text-sm">Mallampati Clásico</div>
                <div className="text-xs text-slate-400">Clase I: Visión completa de úvula y pilares. Clase IV: Solo paladar duro.</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-200 text-sm">Distancia Tiromentoniana (Patil-Aldreti)</div>
                <div className="text-xs text-slate-400">&gt; 6.5 cm: Normal. &lt; 6.0 cm: Alta sospecha de intubación difícil.</div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="font-bold text-slate-100 text-sm">Foto Subida en AnestesiaPro</h3>
              <button onClick={() => setShowPhotoModal(false)} className="text-slate-400 hover:text-slate-100 text-xs font-bold">✕ Cerrar</button>
            </div>
            <img
              src={uploadedPhoto}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/app_logo.jpg';
              }}
              alt="Foto AnestesiaPro"
              className="w-full h-auto max-h-[70vh] object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}

    </div>
  );
};

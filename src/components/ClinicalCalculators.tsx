import React, { useState } from 'react';
import { DoctorUser } from '../types/user';
import { PreAnestheticEvaluation } from './PreAnestheticEvaluation';
import { VortexAirway } from './VortexAirway';
import { EmergencyProtocols } from './EmergencyProtocols';
import { InfusionCalculator } from './InfusionCalculator';
import { VademecumModal } from './VademecumModal';
import { PediatricCalculator } from './PediatricCalculator';
import { DigitalCredential } from './DigitalCredential';
import { NotificationsModal } from './NotificationsModal';
import {
  Syringe,
  ShieldAlert,
  Wind,
  Activity,
  BookOpen,
  Baby,
  HeartPulse,
  Award,
  FileText,
  UserCheck,
  Scale,
  Bell
} from 'lucide-react';

interface Props {
  user: DoctorUser;
  onOpenAdmin: () => void;
}

export function ClinicalCalculators({ user, onOpenAdmin }: Props) {
  const [activeTab, setActiveTab] = useState<
    'induction' | 'preevaluation' | 'cppd' | 'vortex' | 'infusions' | 'vademecum' | 'pediatric' | 'fluid' | 'card'
  >('induction');

  // Parámetros antropométricos
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [showNotifications, setShowNotifications] = useState(false);

  // Cálculos antropométricos
  const heightM = height / 100;
  const bmi = heightM > 0 ? Number((weight / (heightM * heightM)).toFixed(1)) : 0;
  const idealWeight = gender === 'male'
    ? Number((50 + 0.91 * (height - 152.4)).toFixed(1))
    : Number((45.5 + 0.91 * (height - 152.4)).toFixed(1));
  const adjustedWeight = weight > idealWeight
    ? Number((idealWeight + 0.4 * (weight - idealWeight)).toFixed(1))
    : weight;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      {/* Header Superior Clínico */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 shadow-md shadow-cyan-500/20">
            AP
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Knyeega
            </h1>
            <p className="text-xs text-slate-400">Dr. Carlos Leal</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 cursor-pointer"
            title="Notificaciones y Difusiones"
          >
            <Bell className="w-4 h-4" />
          </button>

          {user.isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Panel Admin</span>
            </button>
          )}

          <div className="text-right pl-2 border-l border-slate-800">
            <span className="text-xs font-semibold text-slate-200 block truncate max-w-[130px] sm:max-w-none">
              {user.fullName}
            </span>
            <span className="text-[10px] text-cyan-400 block">{user.country || 'Médico Verificado'}</span>
          </div>
        </div>
      </header>

      {/* Parámetros Rápidos del Paciente */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Parámetros Biomédicos del Paciente
            </h2>
            <span className="text-xs text-slate-400">
              IMC: <strong className="text-white">{bmi} kg/m²</strong> | Peso Ideal: <strong className="text-white">{idealWeight} kg</strong> | Peso Ajustado: <strong className="text-white">{adjustedWeight} kg</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Peso Real (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Talla (cm)</label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Edad (años)</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Género</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as 'male' | 'female')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="male">Masculino ♂</option>
                <option value="female">Femenino ♀</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pestañas de Módulos */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('induction')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'induction'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Syringe className="w-4 h-4" />
            Inducción & Fármacos
          </button>

          <button
            onClick={() => setActiveTab('preevaluation')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'preevaluation'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Evaluación Preanestésica PDF
          </button>

          <button
            onClick={() => setActiveTab('cppd')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'cppd'
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Protocolo CPPD & Crisis
          </button>

          <button
            onClick={() => setActiveTab('vortex')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vortex'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Wind className="w-4 h-4" />
            Vía Aérea (VORTEX)
          </button>

          <button
            onClick={() => setActiveTab('infusions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'infusions'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            Infusiones & Vasopresores
          </button>

          <button
            onClick={() => setActiveTab('vademecum')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'vademecum'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Vademécum
          </button>

          <button
            onClick={() => setActiveTab('pediatric')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'pediatric'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Baby className="w-4 h-4" />
            Pediatría
          </button>

          <button
            onClick={() => setActiveTab('fluid')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'fluid'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Fluidoterapia
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            Carnet Digital
          </button>
        </div>

        {/* Tab 1: Inducción & Fármacos */}
        {activeTab === 'induction' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-cyan-400 text-sm">Propofol 1% (10 mg/ml)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Hipnótico</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Dosis: 1.5 - 2.5 mg/kg (Peso Real)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Dosis Inducción:</span>
                <span className="text-base font-bold text-cyan-300">
                  {(weight * 1.5).toFixed(0)} - {(weight * 2.5).toFixed(0)} mg
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Volumen: {((weight * 2) / 10).toFixed(1)} ml (al 1%)</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-blue-400 text-sm">Fentanilo (50 mcg/ml)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Opioide</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Dosis: 2 - 4 mcg/kg (Peso Ideal)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Dosis Inducción:</span>
                <span className="text-base font-bold text-blue-300">
                  {(idealWeight * 2).toFixed(0)} - {(idealWeight * 4).toFixed(0)} mcg
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Volumen: {((idealWeight * 3) / 50).toFixed(1)} ml</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-amber-400 text-sm">Rocuronio (10 mg/ml)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Relajante</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Intubación Estándar (0.6 mg/kg) / ISR (1.2 mg/kg)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Estándar / ISR:</span>
                <span className="text-base font-bold text-amber-300">
                  {(weight * 0.6).toFixed(0)} / {(weight * 1.2).toFixed(0)} mg
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Volumen ISR: {((weight * 1.2) / 10).toFixed(1)} ml</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-emerald-400 text-sm">Succinilcolina</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Despolarizante</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Dosis ISR: 1 - 1.5 mg/kg (Peso Real)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Dosis ISR:</span>
                <span className="text-base font-bold text-emerald-300">
                  {(weight * 1.0).toFixed(0)} - {(weight * 1.5).toFixed(0)} mg
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-purple-400 text-sm">Sugammadex Reversión</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Reversor</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">TOF moderado (2 mg/kg) / Inmediata (16 mg/kg)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Dosis Sugammadex:</span>
                <span className="text-base font-bold text-purple-300">
                  {(weight * 2).toFixed(0)} mg / Emergencia: {(weight * 16).toFixed(0)} mg
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-rose-400 text-sm">Rescate Hemodinámico</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">Urgencias</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Atropina (0.01 mg/kg) • Efedrina (5 - 10 mg bolos)</p>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-300">Atropina Dosis:</span>
                <span className="text-base font-bold text-rose-300">
                  {Math.min(1, Math.max(0.4, Number((weight * 0.01).toFixed(2))))} mg
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Pre-evaluación PDF */}
        {activeTab === 'preevaluation' && (
          <PreAnestheticEvaluation
            user={user}
            weight={weight}
            height={height}
            age={age}
            gender={gender}
            bmi={bmi}
            idealWeight={idealWeight}
          />
        )}

        {/* Tab CPPD & Protocolos de Crisis */}
        {activeTab === 'cppd' && (
          <EmergencyProtocols weight={weight} />
        )}

        {/* Tab VORTEX Vía Aérea */}
        {activeTab === 'vortex' && (
          <VortexAirway weight={weight} />
        )}

        {/* Tab Infusiones & Vasopresores */}
        {activeTab === 'infusions' && (
          <InfusionCalculator weight={weight} idealWeight={idealWeight} />
        )}

        {/* Tab Vademécum */}
        {activeTab === 'vademecum' && (
          <VademecumModal />
        )}

        {/* Tab Pediatría */}
        {activeTab === 'pediatric' && (
          <PediatricCalculator weight={weight} age={age} />
        )}

        {/* Tab Fluidoterapia */}
        {activeTab === 'fluid' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-teal-400 mb-4 flex items-center gap-2">
              <HeartPulse className="w-5 h-5" />
              Mantenimiento Hidroelectrolítico (Regla 4-2-1 Holiday-Segar)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Tasa Horaria de Mantenimiento</span>
                <span className="text-xl font-bold text-teal-300">
                  {weight <= 10
                    ? weight * 4
                    : weight <= 20
                    ? 40 + (weight - 10) * 2
                    : 60 + (weight - 20) * 1}{' '}
                  ml/h
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Regla clásica 4-2-1</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Ayuno Estimado (8 horas)</span>
                <span className="text-xl font-bold text-teal-300">
                  {(weight <= 10
                    ? weight * 4
                    : weight <= 20
                    ? 40 + (weight - 10) * 2
                    : 60 + (weight - 20) * 1) * 8}{' '}
                  ml
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">50% en 1ª hora, 25% en 2ª y 3ª h</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Pérdida Sanguínea Permisible (MABL)</span>
                <span className="text-xl font-bold text-teal-300">
                  {Math.round(weight * 70 * ((38 - 28) / 38))} ml
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Hto inicial 38% a meta 28%</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Carnet Digital */}
        {activeTab === 'card' && (
          <DigitalCredential user={user} />
        )}
      </div>

      {/* Modal de Notificaciones y Difusión */}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          isAdmin={user.isAdmin || false}
        />
      )}
    </div>
  );
}

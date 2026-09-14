import React, { useState, useEffect } from 'react';
import { TabType } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HomeModule } from './components/HomeModule';
import { PreanesthesiaModule } from './components/PreanesthesiaModule';
import { AirwayModule } from './components/AirwayModule';
import { ScalesModule } from './components/ScalesModule';
import { CalculatorModule } from './components/CalculatorModule';
import { VademecumModule } from './components/VademecumModule';
import { EducationModule } from './components/EducationModule';
import { ShockIndexModule } from './components/ShockIndexModule';
import { OfflineIndicator } from './components/OfflinePWAControls';
import { forceAppUpdate } from './registerServiceWorker';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ registration: ServiceWorkerRegistration }>;
      setUpdateAvailable(true);
      if (customEvent.detail?.registration) {
        setUpdateRegistration(customEvent.detail.registration);
      }
    };
    window.addEventListener('anestesiapro-update-available', handler);
    return () => window.removeEventListener('anestesiapro-update-available', handler);
  }, []);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    if (updateRegistration && updateRegistration.waiting) {
      updateRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      await forceAppUpdate();
    }
  };
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recurso = params.get('recurso');
      if (recurso) return 'educacion';
      const tab = params.get('tab') as TabType;
      if (tab && ['inicio', 'preanestesia', 'viaAerea', 'escalas', 'calculadora', 'vademecum', 'educacion', 'indiceShock'].includes(tab)) {
        return tab;
      }
    }
    return 'inicio';
  });

  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const recurso = params.get('recurso');
      if (recurso) {
        if (recurso === 'preeclampsia' || recurso.includes('preeclampsia')) {
          return 'res-preeclampsia-eclampsia-enfoque-anestesiologico';
        }
        if (recurso === 'emotive' || recurso.includes('emotive')) {
          return 'res-protocolo-emotive-hemorragia-posparto-2026';
        }
        return recurso;
      }
    }
    return null;
  });

  // Track tab visits in analytics
  useEffect(() => {
  //recordSectionVisit(activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      {/* Top Header */}
   <Header 
        setActiveTab={setActiveTab} 
        onSelectEducationResource={(id) => {
          setSelectedEducationId(id);
          setActiveTab('educacion');
        }} 
      />

      {/* PWA Update Banner */}
      {updateAvailable && (
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-slate-950 px-4 py-2.5 shadow-xl flex items-center justify-between gap-3 text-xs font-semibold z-40 border-b border-cyan-400/40 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 max-w-2xl">
            <span className="p-1 rounded-full bg-slate-950/20 text-slate-950 shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>
              <strong>¡Nueva versión clínica disponible!</strong> Se han actualizado infografías, atlas anatómico y protocolos offline.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleApplyUpdate}
              disabled={isUpdating}
              className="bg-slate-950 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Actualizando...' : 'Actualizar ahora'}</span>
            </button>
            <button
              onClick={() => setUpdateAvailable(false)}
              className="p-1 hover:bg-black/10 rounded-md text-slate-900 transition-colors"
              title="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Bar - Sticky at top */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 pb-28 md:pb-12">
        {activeTab === 'inicio' && (
          <HomeModule 
            setActiveTab={setActiveTab} 
            onSelectEducationResource={(resId) => setSelectedEducationId(resId)} 
          />
        )}
        {activeTab === 'preanestesia' && <PreanesthesiaModule />}
        {activeTab === 'viaAerea' && <AirwayModule />}
        {activeTab === 'escalas' && <ScalesModule />}
        {activeTab === 'indiceShock' && <ShockIndexModule />}
        {activeTab === 'calculadora' && <CalculatorModule />}
        {activeTab === 'vademecum' && <VademecumModule />}
        {activeTab === 'educacion' && (
          <EducationModule 
            initialResourceId={selectedEducationId} 
            onClearInitialResource={() => setSelectedEducationId(null)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-4 px-4 text-center text-xs text-slate-500 hidden md:block">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AnestesiaPro &bull; Dr. Carlos Leal &bull; Especialista en Anestesiología y Reanimación</span>
          <span>Maracay, Venezuela &bull; 2026</span>
        </div>
      </footer>

      {/* Persistent Offline & Quirófano Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RegistrationGateOverlay } from './components/RegistrationGateOverlay';
import { AdminPanel } from './components/AdminPanel';
import { PreanesthesiaModule } from './components/PreanesthesiaModule';
import { EducationModule } from './components/EducationModule';
import { CalculatorsModule } from './components/CalculatorsModule';
import { CrisisModule } from './components/CrisisModule';
import { MedicoRegistrado } from './types';

export function App() {
  const [medico, setMedico] = useState<MedicoRegistrado | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState('educacion');
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>('reel-dia-anestesiologo');

  useEffect(() => {
    const cached = localStorage.getItem('anestesiapro_medico');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.email) {
          setMedico(parsed);
          setIsVerified(true);
        }
      } catch {
        // ignore
      }
    }

    try {
      const hash = window.location.hash;
      if (hash && hash.includes('#res=')) {
        const resId = hash.split('#res=')[1];
        if (resId) {
          try {
            setSelectedEducationId(decodeURIComponent(resId));
          } catch {
            setSelectedEducationId(resId);
          }
        }
      }
    } catch {
      // ignore URI errors
    }
  }, []);

  const handleVerified = (verifiedMedico: MedicoRegistrado) => {
    setMedico(verifiedMedico);
    setIsVerified(true);
  };

  if (!isVerified) {
    return <RegistrationGateOverlay onVerified={handleVerified} />;
  }

  if (showAdmin) {
    return <AdminPanel onClose={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenNotifications={() => setActiveTab('educacion')}
      />

      <main className="flex-1 pb-16">
        {activeTab === 'preanesthesia' && <PreanesthesiaModule />}
        {activeTab === 'educacion' && (
          <EducationModule
            initialResourceId={selectedEducationId}
            onClearInitialResource={() => setSelectedEducationId(null)}
          />
        )}
        {activeTab === 'calculators' && <CalculatorsModule />}
        {activeTab === 'crisis' && <CrisisModule />}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        AnestesiaPro 2026 • Plataforma Profesional de Anestesiología y Educación Continua
      </footer>
    </div>
  );
}

export default App;

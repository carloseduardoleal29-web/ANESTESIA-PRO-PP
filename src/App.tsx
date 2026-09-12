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


export default function App() {
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
    </div>
  );
}

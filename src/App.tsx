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
import { GlobalNotificationBanner } from './components/GlobalNotificationBanner';
import { ViewportFramingAssistant } from './components/ViewportFramingAssistant';
import { AnimatedBanner } from './components/AnimatedBanner';
import { forceAppUpdate } from './registerServiceWorker';
import { syncEducationResourcesWithServer } from './lib/educationStorage';
import { lockViewportFraming } from './lib/viewportManager';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { DeveloperFooter } from './components/DeveloperFooter';
import { DeveloperModal } from './components/DeveloperModal';
import { ContactModal } from './components/ContactModal';
import { ShareModal } from './components/ShareModal';

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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

  // Global background sync to ensure all devices see uploaded resources in real-time
  useEffect(() => {
    let lastGlobalSync = 0;
    const runGlobalSync = (force: boolean = false) => {
      const now = Date.now();
      if (!force && now - lastGlobalSync < 30000) return;
      lastGlobalSync = now;
      try {
        const isAdmin = localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
                        sessionStorage.getItem('anestesiapro_author_session') === 'true';
        syncEducationResourcesWithServer(isAdmin).catch(() => {});
      } catch {}
    };

    // Initial sync
    runGlobalSync(true);

    // Periodic sync every 60 seconds
    const interval = setInterval(() => runGlobalSync(false), 60000);

    // Sync when device reconnects or tab regains focus
    const onFocusOrOnline = () => runGlobalSync(false);
    const onNewPublish = () => runGlobalSync(true);

    window.addEventListener('focus', onFocusOrOnline);
    window.addEventListener('online', onFocusOrOnline);
    window.addEventListener('anestesiapro_new_resource_published', onNewPublish);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocusOrOnline);
      window.removeEventListener('online', onFocusOrOnline);
      window.removeEventListener('anestesiapro_new_resource_published', onNewPublish);
    };
  }, []);

  // Auto-frame lock viewport on load and screen resize
  useEffect(() => {
    lockViewportFraming();
    window.addEventListener('resize', lockViewportFraming, { passive: true });
    window.addEventListener('orientationchange', lockViewportFraming, { passive: true });
    return () => {
      window.removeEventListener('resize', lockViewportFraming);
      window.removeEventListener('orientationchange', lockViewportFraming);
    };
  }, []);

  return (
    <div className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-slate-950 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased">
      {/* Mobile Viewport & Auto-Framing Assistant */}
      <ViewportFramingAssistant />

      {/* Top Header */}
   <Header 
        setActiveTab={setActiveTab} 
        onSelectEducationResource={(id) => {
          setSelectedEducationId(id);
          setActiveTab('educacion');
        }} 
      />

      <AnimatedBanner onOpenDeveloperModal={() => setShowDeveloperModal(true)} />

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

      {/* Global Clinical Update & Notification Banner */}
      <GlobalNotificationBanner
        onOpenResource={(resId) => {
          setSelectedEducationId(resId);
          setActiveTab('educacion');
        }}
        onNavigateToEducation={() => {
          setActiveTab('educacion');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-2.5 py-3 sm:px-4 sm:py-4 md:p-6 pb-28 md:pb-12 min-w-0 overflow-x-hidden">
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

      {/* Developer & Clinical Author Showcase Footer */}
      <DeveloperFooter 
        onOpenDeveloperModal={() => setShowDeveloperModal(true)}
        onOpenContactModal={() => setShowContactModal(true)}
        onOpenShareModal={() => setShowShareModal(true)}
      />

      {/* Developer Showcase Profile Modal */}
      <DeveloperModal
        isOpen={showDeveloperModal}
        onClose={() => setShowDeveloperModal(false)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenShare={() => setShowShareModal(true)}
      />

      {/* Contact Direct Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={{
            title: 'AnestesiaPro • Suite Clínica para Anestesiólogos',
            description: 'Suite médica creada por el Dr. Carlos Leal (C.E. LEAL studio). Evaluación preanestésica con informe en PDF, predicción de vía aérea, calculadoras farmacológicas y protocolos.',
            url: typeof window !== 'undefined' ? window.location.origin : 'https://anestesiapro.lat'
          }}
        />
      )}

      {/* Persistent Offline & Quirófano Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

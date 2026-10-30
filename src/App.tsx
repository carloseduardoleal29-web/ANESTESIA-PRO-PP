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
import { recordSectionVisit, syncGlobalVisit } from './lib/statsService';
import { lockViewportFraming } from './lib/viewportManager';
import { RefreshCw, Sparkles, X, Crown, Palette, Edit3, ShieldAlert, Brain, Calculator, FileText, Monitor } from 'lucide-react';
import { DeveloperFooter } from './components/DeveloperFooter';
import { DeveloperModal } from './components/DeveloperModal';
import { ContactModal } from './components/ContactModal';
import { ShareModal } from './components/ShareModal';
import { FloatingRegistrationPrompt } from './components/FloatingRegistrationPrompt';
import { UserRegistrationModal } from './components/UserRegistrationModal';
import { PlanEliteModal } from './components/PlanEliteModal';
import { EliteLabModule } from './components/EliteLabModule';
import { MedicalArticleTranslator } from './components/MedicalArticleTranslator';
import { OperatingRoomCrisisModule } from './components/crisis/OperatingRoomCrisisModule';
import { MedicalCalculatorsEliteModule } from './components/calculators/MedicalCalculatorsEliteModule';
import { ElitePreanesthesiaModule } from './components/preanesthesia/ElitePreanesthesiaModule';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AdminBillingEditorModal } from './components/AdminBillingEditorModal';
import { AppThemeMode, getActiveTheme, THEME_OPTIONS } from './lib/themeService';
import { requestPushPermissionAndSubscribe } from './lib/pushNotificationService';

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationEditMode, setRegistrationEditMode] = useState(false);
  const [showPlanEliteModal, setShowPlanEliteModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showAdminBillingModal, setShowAdminBillingModal] = useState(false);
  const [activeTheme, setActiveTheme] = useState<AppThemeMode>(() => getActiveTheme());
  const [eliteLabTab, setEliteLabTab] = useState<'simulador' | 'traductor' | 'crisis' | 'preanestesia' | 'calculadoras' | null>(null);

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

  useEffect(() => {
    const handleOpenRegistration = (e: Event) => {
      const customEvent = e as CustomEvent<{ editMode?: boolean }>;
      setRegistrationEditMode(customEvent.detail?.editMode || false);
      setShowRegistrationModal(true);
    };

    const handleOpenPlanElite = () => {
      setShowPlanEliteModal(true);
    };

    const handleOpenEliteLab = (e: any) => {
      setEliteLabTab(e.detail?.tab || 'simulador');
    };

    const handleOpenTranslator = () => {
      setEliteLabTab('traductor');
    };

    const handleOpenCrisis = () => {
      setEliteLabTab('crisis');
    };

    const handleOpenCalculadorasAvanzadas = () => {
      setEliteLabTab('calculadoras');
    };

    const handleOpenPreanestesiaElite = () => {
      setEliteLabTab('preanestesia');
    };

    const handleOpenTheme = () => {
      setShowThemeModal(true);
    };

    const handleOpenAdminBilling = () => {
      setShowAdminBillingModal(true);
    };

    const handleThemeUpdated = (e: any) => {
      if (e.detail) {
        setActiveTheme(e.detail);
      }
    };

    window.addEventListener('anestesiapro_open_user_registration', handleOpenRegistration);
    window.addEventListener('anestesiapro_open_registration_modal', handleOpenRegistration);
    window.addEventListener('anestesiapro_open_plan_elite_modal', handleOpenPlanElite);
    window.addEventListener('anestesiapro_open_elite_lab', handleOpenEliteLab);
    window.addEventListener('anestesiapro_open_translator', handleOpenTranslator);
    window.addEventListener('anestesiapro_open_crisis_modal', handleOpenCrisis);
    window.addEventListener('anestesiapro_open_calculadoras_avanzadas', handleOpenCalculadorasAvanzadas);
    window.addEventListener('anestesiapro_open_preanestesia_elite', handleOpenPreanestesiaElite);
    window.addEventListener('anestesiapro_open_theme_modal', handleOpenTheme);
    window.addEventListener('anestesiapro_open_admin_billing_modal', handleOpenAdminBilling);
    window.addEventListener('anestesiapro_theme_updated', handleThemeUpdated);

    return () => {
      window.removeEventListener('anestesiapro_open_user_registration', handleOpenRegistration);
      window.removeEventListener('anestesiapro_open_registration_modal', handleOpenRegistration);
      window.removeEventListener('anestesiapro_open_plan_elite_modal', handleOpenPlanElite);
      window.removeEventListener('anestesiapro_open_elite_lab', handleOpenEliteLab);
      window.removeEventListener('anestesiapro_open_translator', handleOpenTranslator);
      window.removeEventListener('anestesiapro_open_crisis_modal', handleOpenCrisis);
      window.removeEventListener('anestesiapro_open_calculadoras_avanzadas', handleOpenCalculadorasAvanzadas);
      window.removeEventListener('anestesiapro_open_preanestesia_elite', handleOpenPreanestesiaElite);
      window.removeEventListener('anestesiapro_open_theme_modal', handleOpenTheme);
      window.removeEventListener('anestesiapro_open_admin_billing_modal', handleOpenAdminBilling);
      window.removeEventListener('anestesiapro_theme_updated', handleThemeUpdated);
    };
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
  });

  // Sync global visit on initial app startup
  useEffect(() => {
    syncGlobalVisit().catch(() => {});
  }, []);

  // Track visits to active main sections
  useEffect(() => {
    if (activeTab) {
      recordSectionVisit(activeTab);
    }
  }, [activeTab]);

  // Track visits to Élite submodules
  useEffect(() => {
    if (eliteLabTab) {
      const eliteKeyMap: Record<string, string> = {
        simulador: 'simulador',
        traductor: 'traductor',
        crisis: 'crisis',
        calculadoras: 'calculadoras_avanzadas',
        preanestesia: 'preanestesia_elite'
      };
      recordSectionVisit(eliteKeyMap[eliteLabTab] || eliteLabTab);
    }
  }, [eliteLabTab]);

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

    runGlobalSync(true);

    const interval = setInterval(() => runGlobalSync(false), 60000);

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

  // Auto-register or refresh WebPush subscription on device launch
  useEffect(() => {
    const autoSyncPushSubscription = async () => {
      try {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          await requestPushPermissionAndSubscribe();
        }
      } catch (e) {
        console.warn('[Push AutoSync] Notice:', e);
      }
    };
    autoSyncPushSubscription();
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

  const currentThemeObj = THEME_OPTIONS.find(t => t.id === activeTheme) || THEME_OPTIONS[0];

  return (
    <div className={`min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden ${currentThemeObj.bgClasses} flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 antialiased transition-colors duration-300`}>
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-2.5 py-3 sm:px-4 sm:py-4 md:p-6 pb-28 md:pb-12 min-w-0 overflow-x-hidden">
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

      {/* Non-blocking Floating Registration Banner & Carnet Activator */}
      <FloatingRegistrationPrompt />

      {/* User Registration & Digital Carnet Modal */}
      {showRegistrationModal && (
        <UserRegistrationModal
          isOpen={showRegistrationModal}
          initialEditMode={registrationEditMode}
          onClose={() => setShowRegistrationModal(false)}
        />
      )}

      {/* Plan Élite Official Modal */}
      {showPlanEliteModal && (
        <PlanEliteModal
          isOpen={showPlanEliteModal}
          onClose={() => setShowPlanEliteModal(false)}
        />
      )}

      {/* Theme Selector Modal */}
      {showThemeModal && (
        <ThemeSelectorModal
          isOpen={showThemeModal}
          onClose={() => setShowThemeModal(false)}
          activeTheme={activeTheme}
          onSelectTheme={(t) => setActiveTheme(t)}
        />
      )}

      {/* Admin Billing Details Editor Modal (Dr. Carlos Leal) */}
      {showAdminBillingModal && (
        <AdminBillingEditorModal
          isOpen={showAdminBillingModal}
          onClose={() => setShowAdminBillingModal(false)}
        />
      )}

      {/* Standalone Fullscreen Modal View for Élite Modules (NO extra administrative ribbons/headers) */}
      {eliteLabTab && (
        <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
          {/* DEDICATED CLEAN HEADER FOR EACH SPECIFIC ÉLITE MODULE */}
          <div className="sticky top-0 z-50 bg-slate-900 border-b border-amber-500/40 px-4 py-3 flex items-center justify-between text-white shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 shrink-0">
                <Crown className="w-4 h-4 fill-current text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.2 rounded font-mono">
                    MÓDULO ÉLITE
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  {
                    eliteLabTab === 'simulador' ? 'Simulador de Casos Clínicos & Monitor Virtual' :
                    eliteLabTab === 'traductor' ? 'Traduce y Resume con IA • Análisis & Traducción Fiel' :
                    eliteLabTab === 'crisis' ? 'Crisis Intraoperatorias & Checklists de Rescate' :
                    eliteLabTab === 'calculadoras' ? 'Calculadoras Médicas Avanzadas (TIVA / TCI & Vasoactivos)' :
                    eliteLabTab === 'preanestesia' ? 'Preanestesia & Membretes Hospitalarios en PDF' : 'Módulo Élite'
                  }
                </h3>
              </div>
            </div>
            
            <button
              onClick={() => setEliteLabTab(null)}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black rounded-xl border border-slate-700 cursor-pointer transition-all hover:text-white shrink-0 active:scale-95"
            >
              ✕ Volver al Menú
            </button>
          </div>

          {/* STANDALONE COMPONENT RENDER FOR EACH SPECIFIC MODULE */}
          <div className="p-3 sm:p-5 max-w-6xl mx-auto">
            {eliteLabTab === 'simulador' && <EliteLabModule initialTab="simulador" />}
            {eliteLabTab === 'traductor' && <MedicalArticleTranslator />}
            {eliteLabTab === 'crisis' && <OperatingRoomCrisisModule />}
            {eliteLabTab === 'calculadoras' && <MedicalCalculatorsEliteModule />}
            {eliteLabTab === 'preanestesia' && <ElitePreanesthesiaModule />}
          </div>
        </div>
      )}

      {/* Persistent Offline & Quirófano Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}

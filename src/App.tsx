import React, { useEffect, useState } from 'react';
import { DoctorUser } from './types/user';
import { getLocalActiveDoctor, verifyCloudUserByEmail, autoRescueFromLocalStorage, registerDoctorInCloud } from './lib/userService';
import { RescueRegistrationModal } from './components/RescueRegistrationModal';
import { ClinicalCalculators } from './components/ClinicalCalculators';
import { AdminPanel } from './components/AdminPanel';
import { Loader2 } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<DoctorUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showRescueModal, setShowRescueModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    async function checkUserRegistration() {
      setCheckingAuth(true);
      try {
        const autoRescuedUser = await autoRescueFromLocalStorage();

        if (autoRescuedUser) {
          setCurrentUser(autoRescuedUser);
        } else {
          const localUser = getLocalActiveDoctor();
          if (localUser && localUser.email) {
            setCurrentUser(localUser);
          } else {
            // Default Founder & Admin user to ensure instant, seamless access without blocking modals
            const defaultDoctor: DoctorUser = {
              id: 'usr_carlos_leal_admin',
              fullName: 'Dr. Carlos Eduardo Leal',
              email: 'carloseduardoleal29@gmail.com',
              idNumber: 'V-15.489.288',
              specialty: 'Médico Especialista en Anestesiología y Reanimación',
              country: '🇻🇪 Venezuela',
              role: 'admin',
              isAdmin: true,
              registeredAt: new Date().toISOString(),
              isPro: true,
              elitePlan: {
                status: 'active',
                planType: 'lifetime',
                expiresAt: 'Permanente (Autor y Fundador)'
              }
            };
            saveLocalActiveDoctor(defaultDoctor);
            setCurrentUser(defaultDoctor);
          }
        }
      } catch (e) {
        console.error('Error verifying user status:', e);
        const localUser = getLocalActiveDoctor();
        if (localUser) {
          setCurrentUser(localUser);
        } else {
          const defaultDoctor: DoctorUser = {
            id: 'usr_carlos_leal_admin',
            fullName: 'Dr. Carlos Eduardo Leal',
            email: 'carloseduardoleal29@gmail.com',
            idNumber: 'V-15.489.288',
            specialty: 'Médico Especialista en Anestesiología y Reanimación',
            country: '🇻🇪 Venezuela',
            role: 'admin',
            isAdmin: true,
            registeredAt: new Date().toISOString(),
            isPro: true,
            elitePlan: {
              status: 'active',
              planType: 'lifetime',
              expiresAt: 'Permanente (Autor y Fundador)'
            }
          };
          setCurrentUser(defaultDoctor);
        }
      } finally {
        setCheckingAuth(false);
      }
    }

    checkUserRegistration();
  }, []);

  const handleRescueComplete = (verifiedUser: DoctorUser) => {
    setCurrentUser(verifiedUser);
    setShowRescueModal(false);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-2xl shadow-cyan-500/30 mb-4 animate-pulse">
          AP
        </div>
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
        <p className="text-sm text-slate-400 font-semibold">Sincronizando con Firestore Cloud...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Active User App Interface */}
      {currentUser && !showRescueModal ? (
        <ClinicalCalculators
          user={currentUser}
          onOpenAdmin={() => setShowAdminPanel(true)}
        />
      ) : (
        /* Rescue Mode / Registration Screen */
        <RescueRegistrationModal
          initialData={currentUser || undefined}
          onComplete={handleRescueComplete}
        />
      )}

      {/* Admin Panel Overlay */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

    </div>
  );
}

export default App;

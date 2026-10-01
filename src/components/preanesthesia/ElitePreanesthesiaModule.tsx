import React, { useState, useEffect } from 'react';
import { 
  Building2, FileText, PenTool, Eye, Sparkles, 
  CheckCircle2, RefreshCw, ShieldCheck, Check, 
  Stethoscope, Award
} from 'lucide-react';
import { LetterheadConfig } from '../../types/preanesthesia';
import { 
  getActiveLetterhead, 
  saveActiveLetterhead, 
  saveActiveLetterheadPermanently,
  getSavedDoctorCredentials,
  saveDoctorCredentials,
  isLetterheadConfigured
} from '../../lib/preanesthesiaStorage';
import { PreanesthesiaLetterheadConfig } from './PreanesthesiaLetterheadConfig';
import { DigitalSignatureCanvas } from './DigitalSignatureCanvas';
import { PreanesthesiaModule } from '../PreanesthesiaModule';

export const ElitePreanesthesiaModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'clinica' | 'membrete' | 'firmas'>('clinica');
  const [letterhead, setLetterhead] = useState<LetterheadConfig>(() => getActiveLetterhead());
  const [refreshKey, setRefreshKey] = useState<number>(Date.now());
  const [toastMessage, setToastMessage] = useState<string>('');
  const [doctorSig, setDoctorSig] = useState<string | null>(() => {
    return getSavedDoctorCredentials().doctorSignatureDataUrl || null;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleSaveLetterhead = (updated: LetterheadConfig) => {
    setLetterhead(updated);
    saveActiveLetterhead(updated);
    saveActiveLetterheadPermanently(updated);
    setRefreshKey(Date.now());
    showToast('✅ Membrete institucional y logotipos actualizados correctamente.');
  };

  const handleSaveDoctorSignature = (dataUrl: string | null) => {
    setDoctorSig(dataUrl);
    const creds = getSavedDoctorCredentials();
    saveDoctorCredentials({
      ...creds,
      doctorSignatureDataUrl: dataUrl
    });
    setRefreshKey(Date.now());
    showToast('✅ Firma digital del anestesiólogo guardada.');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/60 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel Élite */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/60 rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                👑 Panel Privado • Modo Élite
              </span>
              <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                {isLetterheadConfigured() ? (
                  <>
                    <Building2 className="w-3.5 h-3.5" />
                    {letterhead.hospitalName || 'Membrete Configurado'}
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    Anestesia Pro • Fundador Dr. Carlos Leal
                  </>
                )}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2">
              Formato de Evaluación Preanestésica
            </h2>
            <div className="text-xs md:text-sm text-slate-300 mt-1 space-y-0.5 max-w-2xl">
              <p className="font-extrabold text-cyan-300 uppercase tracking-wide">
                Anestesia Pro • Fundador Dr. Carlos Leal
              </p>
              <p className="text-xs text-slate-400">
                {isLetterheadConfigured() 
                  ? `Membrete activo configurado: ${letterhead.hospitalName}`
                  : 'Ficha médica legal oficial. El membrete personalizado con tu hospital y logos propios solo se aplica cuando lo configuras en la pestaña "Membrete & Logos".'}
              </p>
            </div>
          </div>

          {/* Sub-Tabs Nav */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('clinica')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'clinica'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Ficha Clínica Completa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('membrete')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'membrete'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Membrete & Logos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('firmas')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'firmas'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black shadow-lg shadow-indigo-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Firmas Digitales</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tab 1: CLINICA (El mismo módulo oficial completo de Preanestesia) */}
      {activeSubTab === 'clinica' && (
        <div className="space-y-4">
          <PreanesthesiaModule key={refreshKey} />
        </div>
      )}

      {/* Sub-Tab 2: MEMBRETE HOSPITALARIO & LOGOS */}
      {activeSubTab === 'membrete' && (
        <div className="space-y-4">
          <PreanesthesiaLetterheadConfig
            config={letterhead}
            onChange={handleSaveLetterhead}
            onSaveToast={showToast}
            onSaveAndProceed={() => {
              setActiveSubTab('clinica');
              setRefreshKey(Date.now());
            }}
          />
        </div>
      )}

      {/* Sub-Tab 3: FIRMAS DIGITALES */}
      {activeSubTab === 'firmas' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <PenTool className="w-5 h-5 text-cyan-400" />
                Captura de Firma Digital del Anestesiólogo
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Dibuja tu firma digital aquí para que se incluya automáticamente en el pie de página de los informes PDF generados.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <DigitalSignatureCanvas
                title="Firma del Médico Anestesiólogo"
                subtitle="Firma manuscrita en pantalla táctil o ratón"
                signerName={letterhead.doctorName || 'Dr. Carlos Leal'}
                initialSignatureDataUrl={doctorSig}
                onSaveSignature={handleSaveDoctorSignature}
                accentColor="border-cyan-500"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setActiveSubTab('clinica');
                  setRefreshKey(Date.now());
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Volver a la Ficha Clínica</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

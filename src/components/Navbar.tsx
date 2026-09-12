import React from 'react';
import { TabType } from '../types';
import { Home, FileText, Wind, BarChart2, Calculator, BookOpen, GraduationCap, Activity } from 'lucide-react';
import { recordSectionVisit } from '../lib/statsService';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'inicio' as TabType, label: 'Inicio', icon: Home },
    { id: 'preanestesia' as TabType, label: 'Preanestesia', icon: FileText, highlight: true },
    { id: 'viaAerea' as TabType, label: 'Vía Aérea', icon: Wind },
    { id: 'escalas' as TabType, label: 'Escalas', icon: BarChart2 },
    { id: 'indiceShock' as TabType, label: 'Índice Shock', icon: Activity, superHighlight: true },
    { id: 'calculadora' as TabType, label: 'Calculadora de Inducción Anestésica', shortLabel: 'Inducción Anestésica', icon: Calculator },
    { id: 'vademecum' as TabType, label: 'Diccionario', icon: BookOpen },
    { id: 'educacion' as TabType, label: 'Educación', icon: GraduationCap, highlight: true, badgeText: 'ERAS' },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-start xl:justify-center gap-1 sm:gap-1.5 py-1.5 overflow-x-auto scrollbar-none px-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isSuper = tab.superHighlight;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  recordSectionVisit(tab.id);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 text-[11px] sm:text-xs font-bold cursor-pointer shrink-0 active:scale-95 select-none ${
                  isActive
                    ? isSuper 
                      ? 'bg-gradient-to-r from-rose-600 via-indigo-600 to-cyan-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/50'
                      : 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50'
                    : isSuper
                    ? 'text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40'
                    : tab.highlight
                    ? 'text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30'
                    : 'text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : isSuper ? 'text-rose-400 animate-pulse' : tab.highlight ? 'text-cyan-400' : 'text-slate-400'}`} />
                {tab.shortLabel ? (
                  <>
                    <span className="whitespace-nowrap hidden md:inline">{tab.label}</span>
                    <span className="whitespace-nowrap md:hidden">{tab.shortLabel}</span>
                  </>
                ) : (
                  <span className="whitespace-nowrap">{tab.label}</span>
                )}
                {isSuper && !isActive && (
                  <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded-full bg-rose-500 text-slate-950 animate-pulse shrink-0">
                    NUEVO
                  </span>
                )}
                {tab.badgeText && !isActive && (
                  <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded-full bg-cyan-400 text-slate-950 animate-pulse shrink-0">
                    {tab.badgeText}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

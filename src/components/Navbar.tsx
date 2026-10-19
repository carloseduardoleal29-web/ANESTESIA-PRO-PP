import React from 'react';
import { 
  Home, 
  FileText, 
  Wind, 
  BarChart2, 
  Activity, 
  Calculator, 
  BookOpen, 
  GraduationCap 
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenAdmin?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs: Array<{
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
    activeGradient?: string;
  }> = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      activeGradient: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-600/30'
    },
    {
      id: 'preanestesia',
      label: 'Preanestesia',
      icon: FileText,
      activeGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-blue-600/30'
    },
    {
      id: 'viaAerea',
      label: 'Vía Aérea',
      icon: Wind,
      activeGradient: 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-indigo-600/30'
    },
    {
      id: 'escalas',
      label: 'Escalas',
      icon: BarChart2,
      activeGradient: 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-teal-600/30'
    },
    {
      id: 'indiceShock',
      label: 'Índice Shock',
      icon: Activity,
      badge: 'NUEVO',
      badgeColor: 'bg-rose-500 text-white shadow-sm',
      activeGradient: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 text-white shadow-rose-600/30'
    },
    {
      id: 'calculadora',
      label: 'Calculadoras',
      icon: Calculator,
      activeGradient: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-emerald-600/30'
    },
    {
      id: 'vademecum',
      label: 'Vademécum',
      icon: BookOpen,
      activeGradient: 'bg-gradient-to-r from-indigo-700 to-slate-800 text-white shadow-indigo-800/30'
    },
    {
      id: 'educacion',
      label: 'Educación Continua',
      icon: GraduationCap,
      badge: 'BIBLIOTECA & GUÍAS',
      badgeColor: 'bg-cyan-400 text-slate-950 font-black shadow-sm',
      activeGradient: 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-cyan-500/30'
    }
  ];

  return (
    <nav 
      aria-label="Pestañas de Navegación Clínica"
      className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 shadow-lg px-2 sm:px-4 py-2 sm:py-2.5 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-1.5 sm:gap-2 justify-start sm:justify-center min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-sm ${
                isActive
                  ? `${tab.activeGradient || 'bg-cyan-600 text-white'} shadow-md ring-2 ring-cyan-400/80 font-black`
                  : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-black tracking-tight uppercase ml-0.5 ${tab.badgeColor || 'bg-cyan-500/30 text-cyan-200'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

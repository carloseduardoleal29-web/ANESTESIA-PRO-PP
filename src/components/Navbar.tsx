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
    activeGradient: string;
    inactiveStyle: string;
    iconColor: string;
  }> = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: Home,
      inactiveStyle: 'bg-[#0b2138] hover:bg-[#133252] text-cyan-200 border border-cyan-500/30',
      activeGradient: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300',
      iconColor: 'text-cyan-300'
    },
    {
      id: 'preanestesia',
      label: 'Preanestesia',
      icon: FileText,
      inactiveStyle: 'bg-[#121c40] hover:bg-[#1d2b61] text-blue-200 border border-blue-500/30',
      activeGradient: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-black shadow-lg shadow-blue-600/30 ring-2 ring-blue-300',
      iconColor: 'text-blue-300'
    },
    {
      id: 'viaAerea',
      label: 'Vía Aérea',
      icon: Wind,
      inactiveStyle: 'bg-[#0a2e38] hover:bg-[#134654] text-teal-200 border border-teal-500/30',
      activeGradient: 'bg-gradient-to-r from-indigo-600 via-teal-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-teal-500/30 ring-2 ring-teal-300',
      iconColor: 'text-teal-300'
    },
    {
      id: 'escalas',
      label: 'Escalas',
      icon: BarChart2,
      inactiveStyle: 'bg-[#0b2d26] hover:bg-[#12453b] text-emerald-200 border border-emerald-500/30',
      activeGradient: 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300',
      iconColor: 'text-emerald-300'
    },
    {
      id: 'indiceShock',
      label: 'Índice Shock',
      icon: Activity,
      badge: 'NUEVO',
      badgeColor: 'bg-rose-500 text-white shadow-sm',
      inactiveStyle: 'bg-[#3b0b23] hover:bg-[#571134] text-rose-200 border border-rose-500/40',
      activeGradient: 'bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-black shadow-lg shadow-rose-600/30 ring-2 ring-rose-400',
      iconColor: 'text-rose-400'
    },
    {
      id: 'calculadora',
      label: 'Calculadora Inducción',
      icon: Calculator,
      badge: 'BÁSICA',
      badgeColor: 'bg-amber-400 text-slate-950 font-black shadow-sm',
      inactiveStyle: 'bg-[#2b1f06] hover:bg-[#423009] text-amber-200 border border-amber-500/40',
      activeGradient: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 ring-2 ring-amber-300',
      iconColor: 'text-amber-300'
    },
    {
      id: 'vademecum',
      label: 'Vademécum',
      icon: BookOpen,
      inactiveStyle: 'bg-[#1b1438] hover:bg-[#2a1e54] text-purple-200 border border-purple-500/30',
      activeGradient: 'bg-gradient-to-r from-indigo-700 via-purple-600 to-slate-800 text-white font-black shadow-lg shadow-indigo-700/30 ring-2 ring-purple-300',
      iconColor: 'text-purple-300'
    },
    {
      id: 'educacion',
      label: 'Educación Continua',
      icon: GraduationCap,
      badge: 'BIBLIOTECA & GUÍAS',
      badgeColor: 'bg-cyan-400 text-slate-950 font-black shadow-sm',
      inactiveStyle: 'bg-[#330f2b] hover:bg-[#4f1743] text-pink-200 border border-pink-500/40',
      activeGradient: 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-black shadow-lg shadow-pink-600/30 ring-2 ring-pink-300',
      iconColor: 'text-pink-300'
    }
  ];

  return (
    <nav 
      aria-label="Pestañas de Navegación Clínica"
      className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 shadow-xl px-2 sm:px-4 py-2 sm:py-2.5 overflow-x-auto scrollbar-none"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-2 justify-start sm:justify-center min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 shadow-md ${
                isActive
                  ? `${tab.activeGradient}`
                  : `${tab.inactiveStyle}`
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-slate-950' : tab.iconColor}`} />
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

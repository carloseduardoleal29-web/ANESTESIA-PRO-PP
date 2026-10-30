import React from 'react';
import { Palette, Check, X, Sparkles, Sun, Moon, Crown } from 'lucide-react';
import { AppThemeMode, THEME_OPTIONS, saveActiveTheme, getActiveTheme } from '../lib/themeService';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: AppThemeMode;
  onSelectTheme: (theme: AppThemeMode) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-5">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Palette className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Tema Visual de la Aplicación</h3>
              <p className="text-xs text-slate-400">Elige la apariencia que prefieras para tu entorno clínico</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {THEME_OPTIONS.map((opt) => {
            const isSelected = activeTheme === opt.id;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  onSelectTheme(opt.id);
                  saveActiveTheme(opt.id);
                }}
                className={`group cursor-pointer p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-950/50 scale-[1.01]'
                    : 'bg-slate-950/70 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${opt.previewColor}`}>
                    {opt.id === 'light-mode' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    {opt.id === 'gold-luxe' && <Crown className="w-3.5 h-3.5 text-amber-300 fill-current" />}
                    {opt.id === 'deep-navy' && <Moon className="w-3.5 h-3.5 text-blue-400" />}
                    {opt.id === 'dark-slate' && <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {opt.label}
                      </span>
                      <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {opt.badge}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  isSelected ? 'border-cyan-400 bg-cyan-400 text-slate-950' : 'border-slate-700'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            Guardar Tema
          </button>
        </div>

      </div>
    </div>
  );
};

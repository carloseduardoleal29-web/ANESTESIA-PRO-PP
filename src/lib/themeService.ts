export type AppThemeMode = 'dark-slate' | 'deep-navy' | 'light-mode' | 'gold-luxe';

export interface ThemeOption {
  id: AppThemeMode;
  label: string;
  badge: string;
  bgClasses: string;
  cardClasses: string;
  headerClasses: string;
  previewColor: string;
}

const THEME_STORAGE_KEY = 'anestesiapro_active_theme_mode_v1';

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark-slate',
    label: 'Clínico Nocturno (Pizarra Suave)',
    badge: 'RECOMENDADO',
    bgClasses: 'bg-slate-900 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100',
    cardClasses: 'bg-slate-800/90 border-slate-700/80 text-white',
    headerClasses: 'bg-slate-900/95 border-slate-800',
    previewColor: 'bg-slate-800 border-cyan-400'
  },
  {
    id: 'deep-navy',
    label: 'Azul Profundo Quirúrgico',
    badge: 'NOCTURNO',
    bgClasses: 'bg-slate-950 bg-gradient-to-b from-[#0a192f] via-[#0f2744] to-[#0a192f] text-slate-100',
    cardClasses: 'bg-[#112240] border-[#233554] text-white',
    headerClasses: 'bg-[#0a192f]/95 border-[#1e3a60]',
    previewColor: 'bg-[#0f2744] border-blue-400'
  },
  {
    id: 'light-mode',
    label: 'Luz de Quirófano (Claro / Diurno)',
    badge: 'MODO DÍA',
    bgClasses: 'bg-slate-100 bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 text-slate-900',
    cardClasses: 'bg-white border-slate-200 text-slate-900 shadow-md',
    headerClasses: 'bg-white/95 border-slate-200 text-slate-900',
    previewColor: 'bg-white border-slate-400'
  },
  {
    id: 'gold-luxe',
    label: 'Dorado Élite (Lujo Médico)',
    badge: 'ÉLITE PRO',
    bgClasses: 'bg-slate-950 bg-gradient-to-b from-slate-950 via-[#1f1a0a] to-slate-950 text-slate-100',
    cardClasses: 'bg-[#1a1508]/90 border-amber-500/40 text-white',
    headerClasses: 'bg-[#181307]/95 border-amber-500/50',
    previewColor: 'bg-amber-950 border-amber-400'
  }
];

export function getActiveTheme(): AppThemeMode {
  if (typeof window === 'undefined') return 'dark-slate';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppThemeMode;
    if (saved && ['dark-slate', 'deep-navy', 'light-mode', 'gold-luxe'].includes(saved)) {
      return saved;
    }
  } catch {}
  return 'dark-slate';
}

export function saveActiveTheme(theme: AppThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    window.dispatchEvent(new CustomEvent('anestesiapro_theme_updated', { detail: theme }));
  } catch (e) {
    console.warn('[Theme Service] Error saving theme:', e);
  }
}

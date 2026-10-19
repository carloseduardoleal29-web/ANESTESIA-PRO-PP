import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error('[AnestesiaPro ErrorBoundary] Uncaught runtime error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.href = '/';
    }
  };

  private handleFullClean = () => {
    try {
      localStorage.removeItem('anestesiapro_active_tab');
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    const state = (this as any).state as State;
    const props = (this as any).props as Props;

    if (state?.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto text-3xl">
              🩺
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-white">AnestesiaPro • Suite Clínica</h2>
              <p className="text-xs text-slate-300">
                Se detectó una actualización pendiente en la memoria del navegador.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left font-mono overflow-x-auto max-h-24">
              {state.error?.message || 'Error al inicializar componentes.'}
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualizar y Abrir AnestesiaPro</span>
              </button>

              <button
                type="button"
                onClick={this.handleFullClean}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Reiniciar Sesión Limpia
              </button>
            </div>
          </div>
        </div>
      );
    }

    return props?.children || null;
  }
}

interface ModuleErrorBoundaryProps {
  moduleName: string;
  children: ReactNode;
  onReset?: () => void;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ModuleErrorBoundary extends React.Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  public state: ModuleErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: any) {
    console.error(`[AnestesiaPro ModuleErrorBoundary] Error in ${this.props.moduleName}:`, error, errorInfo);
  }

  private handleReset = () => {
    try {
      this.setState({ hasError: false, error: null });
      if (this.props.onReset) {
        this.props.onReset();
      }
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 shadow-xl my-4 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mx-auto text-2xl font-black">
            🩺
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">{this.props.moduleName}</h3>
            <p className="text-xs text-slate-300">
              Se ha optimizado el acceso a esta sección. Pulsa el botón abajo para cargar la vista limpia.
            </p>
          </div>

          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 text-left font-mono overflow-x-auto max-h-20">
            {this.state.error?.message || 'Inicializando vista...'}
          </div>

          <button
            type="button"
            onClick={this.handleReset}
            className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reabrir {this.props.moduleName}</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}


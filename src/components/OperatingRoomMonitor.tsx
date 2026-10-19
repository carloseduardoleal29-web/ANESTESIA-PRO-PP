import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Activity, 
  Heart, 
  AlertTriangle, 
  Eye, 
  Download, 
  Settings, 
  Camera, 
  Maximize2, 
  Radio 
} from 'lucide-react';
import { orAudio } from '../utils/orAudio';
import { AdvancedSimulationCase } from '../data/clinicalCaseBank';
import { RealtimeWaveformCanvas } from './RealtimeWaveformCanvas';
import { CustomCaseImage, downloadCaseImage } from '../lib/caseImagesService';

interface Props {
  simulationCase: AdvancedSimulationCase;
  isCrisisActive?: boolean;
  isPatientDead?: boolean;
  customImageConfig?: CustomCaseImage;
  onOpenImageManager?: () => void;
  isAdmin?: boolean;
  onZoomImage?: (img: { url: string; title: string; badge: string; desc: string }) => void;
}

export const OperatingRoomMonitor: React.FC<Props> = ({
  simulationCase,
  isCrisisActive = true,
  isPatientDead = false,
  customImageConfig,
  onOpenImageManager,
  isAdmin = false,
  onZoomImage
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<'monitor' | 'imaging'>('monitor');
  const [isMeasuringNibp, setIsMeasuringNibp] = useState(false);
  const [qrsBlink, setQrsBlink] = useState(false);

  const vitals = simulationCase.initialVitals;

  // Effective imaging: custom config takes precedence over case default
  const hasCustomHide = customImageConfig?.hideImage === true;
  const effectiveImageUrl = customImageConfig?.imageUrl || simulationCase.imaging?.realImageUrl;
  const effectiveTitle = customImageConfig?.title || simulationCase.imaging?.title || 'Imagen Diagnóstica';
  const effectiveType = customImageConfig?.type || simulationCase.imaging?.type || 'ESTUDIO';
  const effectiveBadge = customImageConfig?.badge || simulationCase.imaging?.badge || 'QUIRÓFANO';
  const effectiveDesc = customImageConfig?.description || simulationCase.imaging?.description || '';

  const hasImagingToDisplay = !hasCustomHide && (!!effectiveImageUrl || !!simulationCase.imaging);

  // Sound heartbeat loop with live vitals
  useEffect(() => {
    if (isPatientDead) {
      orAudio.stopHeartbeat();
      return;
    }

    if (!isMuted) {
      orAudio.setMuted(false);
      orAudio.startHeartbeat(vitals.fc, vitals.spo2);
    } else {
      orAudio.stopHeartbeat();
      orAudio.setMuted(true);
    }
    return () => {
      orAudio.stopHeartbeat();
    };
  }, [isMuted, vitals.fc, vitals.spo2, isPatientDead]);

  // QRS visual blink animation loop
  useEffect(() => {
    if (isPatientDead || vitals.fc <= 0) return;
    const intervalMs = Math.max(300, Math.min(2000, (60 / vitals.fc) * 1000));
    const interval = setInterval(() => {
      setQrsBlink(true);
      setTimeout(() => setQrsBlink(false), 120);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [vitals.fc, isPatientDead]);

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (!nextMute) {
      orAudio.setMuted(false);
      orAudio.playPulseBeep(vitals.spo2);
    }
  };

  const handleTriggerNibp = () => {
    if (isMeasuringNibp) return;
    setIsMeasuringNibp(true);
    setTimeout(() => {
      orAudio.playNibpChime();
      setIsMeasuringNibp(false);
    }, 1800);
  };

  const hasBronchospasm = simulationCase.imaging?.svgGraphicType === 'capno-bronchospasm' || 
    simulationCase.id.includes('anaphylaxis') || 
    simulationCase.id.includes('laryngospasm');

  return (
    <div className="bg-slate-950 rounded-2xl border-2 border-emerald-500/50 shadow-2xl overflow-hidden font-mono text-slate-100">
      {/* Top Monitor Bezel */}
      <div className="bg-slate-900/90 border-b border-emerald-900/60 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span 
              className={`w-3 h-3 rounded-full transition-all ${
                isPatientDead
                  ? 'bg-rose-600 animate-ping'
                  : qrsBlink
                    ? 'bg-emerald-400 ring-4 ring-emerald-400/50 scale-125'
                    : 'bg-emerald-600'
              }`} 
            />
            <span className="text-xs font-black text-emerald-400 tracking-wider">
              MONITOR QUIRÓFANO CENTRAL • MINDRAY T8 HD
            </span>
          </div>

          {isPatientDead ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">
              ☠️ ASISTOLIA / PARO
            </span>
          ) : (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              ONDAS EN TIEMPO REAL
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* NIBP button */}
          <button
            type="button"
            onClick={handleTriggerNibp}
            disabled={isMeasuringNibp || isPatientDead}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
            title="Iniciar medición de Presión Arterial No Invasiva (PANI)"
          >
            <Radio className={`w-3 h-3 ${isMeasuringNibp ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isMeasuringNibp ? 'Inflando...' : 'Tomar PANI'}</span>
          </button>

          {/* Sound toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              !isMuted
                ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                <span>BEEP ACTIVO</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                <span>ACTIVAR BEEP</span>
              </>
            )}
          </button>

          {/* Quick tabs inside monitor */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('monitor')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                activeTab === 'monitor'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Signos y Trazado
            </button>
            {hasImagingToDisplay && (
              <button
                type="button"
                onClick={() => setActiveTab('imaging')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === 'imaging'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>{effectiveType}</span>
              </button>
            )}
          </div>

          {/* Dr. Leal Image Manager Shortcut */}
          {isAdmin && onOpenImageManager && (
            <button
              type="button"
              onClick={onOpenImageManager}
              className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs transition-colors cursor-pointer"
              title="Panel Privado Dr. Leal: Subir o Editar Imagen de este caso"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Monitor Display Grid */}
      {activeTab === 'monitor' && (
        <div className="p-3 sm:p-4 space-y-3">
          {/* Main vitals readout row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* FC (ECG) */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors ${
              isPatientDead 
                ? 'bg-rose-950/80 border-rose-500' 
                : 'bg-black/90 border-emerald-500/40'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                <span className="flex items-center gap-1">
                  <Heart className={`w-3 h-3 ${isPatientDead ? 'text-rose-500' : 'fill-emerald-400 animate-pulse'}`} />
                  <span>FC (lpm)</span>
                </span>
                <span className="text-[10px] text-emerald-500/70">{vitals.ecgLead}</span>
              </div>
              <div className={`text-3xl sm:text-4xl font-black tracking-tight my-1 ${
                isPatientDead ? 'text-rose-500' : 'text-emerald-400'
              }`}>
                {isPatientDead ? '00' : vitals.fc > 0 ? vitals.fc : '00'}
              </div>
              <span className="text-[9px] text-slate-400 truncate">
                {isPatientDead ? 'Asistolia / Flatline' : vitals.ecgRhythm}
              </span>
            </div>

            {/* PANI / PA INVASIVA */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors ${
              isPatientDead 
                ? 'bg-rose-950/80 border-rose-500' 
                : 'bg-black/90 border-cyan-500/40'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-cyan-400 font-bold">
                <span>PA (mmHg)</span>
                <span className="text-[10px] text-cyan-500/70">
                  PAM: {isPatientDead ? '00' : vitals.paMean}
                </span>
              </div>
              <div className={`text-2xl sm:text-3xl font-black tracking-tight my-1 ${
                isPatientDead ? 'text-rose-500' : 'text-cyan-400'
              }`}>
                {isPatientDead ? '00/00' : `${vitals.paSystolic}/${vitals.paDiastolic}`}
              </div>
              <span className="text-[9px] text-slate-400">
                {isPatientDead ? 'Colapso vascular' : vitals.paSystolic < 90 ? '⚠️ HIPOTENSIÓN SEVERA' : 'Normotensivo'}
              </span>
            </div>

            {/* SpO2 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors ${
              isPatientDead 
                ? 'bg-rose-950/80 border-rose-500' 
                : 'bg-black/90 border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold">
                <span>SpO2 (%)</span>
                <span className="text-[10px] text-amber-500/70">Pletismografía</span>
              </div>
              <div className={`text-3xl sm:text-4xl font-black tracking-tight my-1 ${
                isPatientDead ? 'text-rose-500' : 'text-amber-400'
              }`}>
                {isPatientDead ? '00%' : `${vitals.spo2}%`}
              </div>
              <span className="text-[9px] text-slate-400">
                {isPatientDead ? 'Sin pulso' : vitals.spo2 < 90 ? '🚨 HIPOXEMIA CRÍTICA' : 'Adecuada'}
              </span>
            </div>

            {/* EtCO2 */}
            <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-colors ${
              isPatientDead 
                ? 'bg-rose-950/80 border-rose-500' 
                : 'bg-black/90 border-purple-500/40'
            }`}>
              <div className="flex items-center justify-between text-[11px] text-purple-400 font-bold">
                <span>EtCO2 (mmHg)</span>
                <span className="text-[10px] text-purple-500/70">
                  FR: {isPatientDead ? '0' : vitals.fr} rpm
                </span>
              </div>
              <div className={`text-3xl sm:text-4xl font-black tracking-tight my-1 ${
                isPatientDead ? 'text-rose-500' : 'text-purple-400'
              }`}>
                {isPatientDead ? '00' : vitals.etco2}
              </div>
              <span className="text-[9px] text-slate-400">
                {isPatientDead 
                  ? 'Apnea' 
                  : vitals.etco2 < 20 
                    ? 'Bajo gasto / hiperventilación' 
                    : vitals.etco2 > 50 
                      ? 'Hipercapnia severa' 
                      : 'Rango'}
              </span>
            </div>

            {/* Temperatura / PVC */}
            <div className="bg-black/90 p-2.5 rounded-xl border border-rose-500/40 col-span-2 sm:col-span-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] text-rose-400 font-bold">
                <span>TEMP / PVC</span>
                <span className="text-[10px] text-rose-500/70">Esofágico</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight my-1">
                {vitals.temp}°C
              </div>
              <span className="text-[9px] text-slate-400">
                {vitals.cvp ? `PVC: ${vitals.cvp} mmHg` : 'Normotérmico'}
              </span>
            </div>
          </div>

          {/* Waveforms Headers and 60fps Dynamic Canvas */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold px-1 text-slate-400">
              <span className="text-emerald-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>ECG II (25 mm/s)</span>
              </span>
              <span className="text-amber-400">PLETH (SpO2)</span>
              <span className="text-purple-400">CAPNOGRAFÍA (EtCO2)</span>
            </div>

            {/* Real-time Oscilloscope Canvas */}
            <RealtimeWaveformCanvas
              fc={isPatientDead ? 0 : vitals.fc}
              spo2={isPatientDead ? 0 : vitals.spo2}
              etco2={isPatientDead ? 0 : vitals.etco2}
              fr={isPatientDead ? 0 : vitals.fr}
              ecgStripType={simulationCase.ecgStripType}
              hasBronchospasm={hasBronchospasm}
              isFlatline={isPatientDead}
              height={190}
            />

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pt-0.5">
              <span>Ritmo: <strong className="text-white">{simulationCase.ecgFindingDescription || vitals.ecgRhythm}</strong></span>
              <span className="text-emerald-400">● Trazado en barrido continuo osciloscópico</span>
            </div>
          </div>
        </div>
      )}

      {/* Imaging & Diagnostic Tab */}
      {activeTab === 'imaging' && (
        <div className="p-4 bg-slate-950 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold">
                {effectiveType} EN QUIRÓFANO
              </span>
              <h4 className="text-xs sm:text-sm font-black text-white">
                {effectiveTitle}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                {effectiveBadge}
              </span>
              {effectiveImageUrl && (
                <button
                  type="button"
                  onClick={() => downloadCaseImage(effectiveImageUrl, `${simulationCase.id}_imagen.jpg`)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer"
                  title="Descargar Imagen en Alta Resolución"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            {/* Visual Graphic Representation */}
            <div className="bg-black border border-cyan-500/40 rounded-xl overflow-hidden min-h-[190px] relative flex flex-col items-center justify-center group">
              {effectiveImageUrl ? (
                <div className="w-full h-full relative flex items-center justify-center">
                  <img
                    src={effectiveImageUrl}
                    alt={effectiveTitle}
                    referrerPolicy="no-referrer"
                    className="w-full h-52 object-contain object-center filter contrast-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {onZoomImage && (
                      <button
                        type="button"
                        onClick={() => onZoomImage({
                          url: effectiveImageUrl,
                          title: effectiveTitle,
                          badge: effectiveBadge,
                          desc: effectiveDesc
                        })}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center gap-1 shadow-lg cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ver Pantalla Completa</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => downloadCaseImage(effectiveImageUrl, `${simulationCase.id}_imagen.jpg`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 shadow-lg cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-1">
                  <Eye className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-bold text-slate-300">Este caso no tiene imagen asignada</p>
                  <p className="text-[10px]">El diagnóstico se basa en la clínica, monitorización y exploración física.</p>
                </div>
              )}
            </div>

            {/* Descriptive clinical interpretation */}
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Interpretación Diagnóstica Inmediata:</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {effectiveDesc || simulationCase.criticalContext}
              </p>
              <div className="pt-2 text-[11px] text-cyan-300 font-sans border-t border-slate-800 flex items-center justify-between">
                <span>💡 <strong>Conducta:</strong> Toma de decisión inmediata según guías.</span>
                {isAdmin && onOpenImageManager && (
                  <button
                    type="button"
                    onClick={onOpenImageManager}
                    className="text-amber-400 hover:text-amber-300 underline font-bold cursor-pointer"
                  >
                    Editar imagen (Dr. Leal)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

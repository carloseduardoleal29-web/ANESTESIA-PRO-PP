import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Trash2, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Download, 
  Sparkles, 
  Link as LinkIcon, 
  ShieldCheck, 
  FileCheck, 
  Layers 
} from 'lucide-react';
import { CustomCaseImage, saveCustomCaseImage, downloadCaseImage } from '../lib/caseImagesService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  caseId: string;
  caseTitle: string;
  defaultImaging?: {
    type?: string;
    title?: string;
    badge?: string;
    description?: string;
    realImageUrl?: string;
    findingsSummary?: string;
  };
  customConfig?: CustomCaseImage;
  onConfigSaved: (config: CustomCaseImage | null, savedCaseId?: string) => void;
  allCases?: { id: string; title: string; category: string; imaging?: any }[];
  onSelectCase?: (newCaseId: string) => void;
}

export const CaseImageManagerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  caseId,
  caseTitle,
  defaultImaging,
  customConfig,
  onConfigSaved,
  allCases,
  onSelectCase
}) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(caseId);
  const [hideImage, setHideImage] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageType, setImageType] = useState<string>('RADIOLOGÍA');
  const [imageTitle, setImageTitle] = useState<string>('');
  const [imageBadge, setImageBadge] = useState<string>('HALLAZGO CLÍNICO');
  const [imageDescription, setImageDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');

  // Keep activeCaseId in sync when prop changes
  useEffect(() => {
    setActiveCaseId(caseId);
  }, [caseId]);

  // Determine current active case metadata
  const activeCase = allCases ? allCases.find(c => c.id === activeCaseId) : null;
  const currentTitle = activeCase ? activeCase.title : caseTitle;
  const currentDefaultImaging = activeCase ? activeCase.imaging : defaultImaging;

  // Load current values on open or activeCaseId change
  useEffect(() => {
    if (isOpen) {
      const activeCustomConfig = activeCaseId === caseId ? customConfig : undefined;
      
      if (activeCustomConfig) {
        setHideImage(!!activeCustomConfig.hideImage);
        setImageUrl(activeCustomConfig.imageUrl || '');
        setImageType(activeCustomConfig.type || currentDefaultImaging?.type || 'RADIOLOGÍA');
        setImageTitle(activeCustomConfig.title || currentDefaultImaging?.title || '');
        setImageBadge(activeCustomConfig.badge || currentDefaultImaging?.badge || 'HALLAZGO CLÍNICO');
        setImageDescription(activeCustomConfig.description || currentDefaultImaging?.description || '');
      } else if (currentDefaultImaging) {
        setHideImage(false);
        setImageUrl(currentDefaultImaging.realImageUrl || '');
        setImageType(currentDefaultImaging.type || 'RADIOLOGÍA');
        setImageTitle(currentDefaultImaging.title || '');
        setImageBadge(currentDefaultImaging.badge || 'HALLAZGO CLÍNICO');
        setImageDescription(currentDefaultImaging.description || '');
      } else {
        setHideImage(false);
        setImageUrl('');
        setImageType('RADIOLOGÍA');
        setImageTitle('');
        setImageBadge('HALLAZGO CLÍNICO');
        setImageDescription('');
      }
      setUploadError(null);
      setSaveSuccess(false);
    }
  }, [isOpen, activeCaseId, caseId, customConfig, currentDefaultImaging]);

  if (!isOpen) return null;

  // Handle direct file upload to server
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Error en servidor: ${res.statusText}`);
      }

      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        if (!imageTitle) {
          setImageTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
        }
        setHideImage(false);
      } else {
        throw new Error(data.error || 'No se pudo subir la imagen');
      }
    } catch (err: any) {
      console.error('Error subiendo imagen:', err);
      setUploadError(err?.message || 'Error al conectar con el servidor.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    const configToSave: CustomCaseImage = {
      hideImage,
      imageUrl: imageUrl.trim(),
      type: imageType.trim() || 'IMAGEN CLÍNICA',
      title: imageTitle.trim() || currentTitle,
      badge: imageBadge.trim() || 'HALLAZGO',
      description: imageDescription.trim(),
      updatedAt: new Date().toISOString()
    };

    const success = await saveCustomCaseImage(activeCaseId, configToSave);
    if (success) {
      setSaveSuccess(true);
      onConfigSaved(configToSave, activeCaseId);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setUploadError('Error al persistir la configuración.');
    }
  };

  const handleResetToDefault = async () => {
    if (confirm(`¿Restablecer el caso "${currentTitle}" a la imagen original por defecto?`)) {
      await saveCustomCaseImage(activeCaseId, null);
      onConfigSaved(null, activeCaseId);
      onClose();
    }
  };

  const effectivePreviewUrl = imageUrl.trim() || currentDefaultImaging?.realImageUrl;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden font-sans text-slate-100 max-h-[92vh] flex flex-col">
        {/* Top Header - Author exclusive */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-4 border-b border-amber-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> Gestión de Imagen
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  Gestión Privada
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                Imagen del Caso: {currentTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case selector dropdown if allCases is available */}
        {allCases && allCases.length > 1 && (
          <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
            <label className="text-[11px] font-bold text-amber-300 shrink-0 flex items-center gap-1.5">
              <span>🔄 Cambiar Caso a Editar:</span>
            </label>
            <select
              value={activeCaseId}
              onChange={(e) => {
                const newId = e.target.value;
                setActiveCaseId(newId);
                if (onSelectCase) onSelectCase(newId);
              }}
              className="w-full bg-slate-900 border border-amber-500/40 text-white rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400 cursor-pointer truncate"
            >
              {allCases.map((c, idx) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white py-1">
                  {idx + 1}. [{c.category}] {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Option: This case does NOT need an image */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">
                  ¿Este caso clínico requiere imagen diagnóstica?
                </span>
                {hideImage ? (
                  <span className="text-[10px] font-black text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                    SIN IMAGEN
                  </span>
                ) : (
                  <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    CON IMAGEN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Si marcas "Ocultar", el simulador no mostrará ningún recuadro de imagen, dejando el monitor y el caso 100% enfocados en la clínica.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setHideImage(!hideImage)}
              className={`px-3 py-2 rounded-xl font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                hideImage 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {hideImage ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{hideImage ? 'Ocultar Imagen' : 'Mostrar Imagen'}</span>
            </button>
          </div>

          {!hideImage && (
            <div className="space-y-4 animate-fadeIn">
              {/* Image Upload Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Upload Box */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Subir imagen desde tu dispositivo:</span>
                  </label>
                  <label className="border-2 border-dashed border-slate-700 hover:border-amber-400/80 bg-slate-950/80 hover:bg-slate-950 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all min-h-[140px] text-center group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-300 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                      <Upload className={`w-5 h-5 ${isUploading ? 'animate-bounce' : ''}`} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">
                        {isUploading ? 'Subiendo al servidor...' : 'Selecciona una foto / radiografía'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Formatos soportados: JPG, PNG, WEBP, SVG
                      </span>
                    </div>
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>O pegar enlace web (URL directa):</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/radiografia.jpg o /uploads/..."
                      className="w-full bg-slate-950 border border-slate-700 focus:border-amber-400 text-white rounded-xl px-3 py-2 text-xs font-mono shadow-inner"
                    />
                    <p className="text-[10px] text-slate-400">
                      Puedes usar enlaces de Radiopaedia, Wikimedia o tus imágenes guardadas en <code>/uploads/</code>.
                    </p>
                  </div>

                  {effectivePreviewUrl && (
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => downloadCaseImage(effectivePreviewUrl, `${caseId}_imagen_clinica.jpg`)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Descargar Imagen Actual</span>
                      </button>

                      <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setFitMode('contain')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fitMode === 'contain' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                          }`}
                        >
                          Encuadre Completo
                        </button>
                        <button
                          type="button"
                          onClick={() => setFitMode('cover')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            fitMode === 'cover' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400'
                          }`}
                        >
                          Llenar Marco
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Preview of Frame & Fit */}
              {effectivePreviewUrl && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                    <span>Vista previa del encuadre en quirófano:</span>
                    <span className="text-emerald-400">✓ Encuadre sin distorsión ({fitMode})</span>
                  </div>
                  <div className="relative w-full h-48 sm:h-56 bg-black rounded-2xl overflow-hidden border-2 border-cyan-500/40 flex items-center justify-center shadow-2xl">
                    <img
                      src={effectivePreviewUrl}
                      alt="Vista previa"
                      className={`w-full h-full ${fitMode === 'contain' ? 'object-contain' : 'object-cover'} filter contrast-110`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-cyan-300 border border-cyan-500/40 font-mono text-[10px] font-bold">
                        {imageType || 'IMAGEN'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        {imageBadge}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Tipo de Estudio:</label>
                  <select
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="RADIOLOGÍA (RX)">Radiografía (RX)</option>
                    <option value="TOMOGRAFÍA (TAC)">Tomografía (TAC)</option>
                    <option value="ECOGRAFÍA (POCUS)">Ecografía POCUS</option>
                    <option value="RESONANCIA (RMN)">Resonancia (RMN)</option>
                    <option value="ENDOSCOPIA">Endoscopia Laríngea / VAD</option>
                    <option value="ECG-PCR">Trazado ECG / Arritmia</option>
                    <option value="FOTO QUIRÓFANO">Fotografía Intraoperatoria</option>
                    <option value="DERMATOLOGÍA">Signos Cutáneos / Anafilaxia</option>
                    <option value="CAPNOGRAMA">Capnografía Especial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Etiqueta / Badge:</label>
                  <input
                    type="text"
                    value={imageBadge}
                    onChange={(e) => setImageBadge(e.target.value)}
                    placeholder="Ej. URGENCIA QUIRÚRGICA"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="font-bold text-slate-300">Título de la Imagen:</label>
                  <input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                    placeholder="Título técnico de la imagen"
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Hallazgos e Interpretación Diagnóstica:</label>
                <textarea
                  rows={2}
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Describe los hallazgos patológicos visibles (ej. colapso alveolar, neumotórax a tensión, espasmo glótico)..."
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-2.5 text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-300 font-bold">
              ⚠️ {uploadError}
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-2">
              <Check className="w-4 h-4" /> ¡Imagen y configuración guardadas con éxito!
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="Revertir a la imagen inicial del banco"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Original</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Guardar en el Caso</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

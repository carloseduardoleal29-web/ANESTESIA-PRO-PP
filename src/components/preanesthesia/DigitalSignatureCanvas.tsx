import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, PenTool, X, ShieldCheck, Sparkles, Type, CheckCircle2 } from 'lucide-react';

interface DigitalSignatureCanvasProps {
  title: string;
  subtitle: string;
  signerName?: string;
  initialSignatureDataUrl: string | null;
  onSaveSignature: (dataUrl: string | null) => void;
  accentColor?: string;
  selectedScale?: 'normal' | 'large' | 'extraLarge' | 'jumbo';
  onScaleChange?: (scale: 'normal' | 'large' | 'extraLarge' | 'jumbo') => void;
  selectedZoom?: number;
  onZoomChange?: (zoom: number) => void;
}

const SIGNATURE_STYLES = [
  {
    id: 'style1',
    name: 'Estilo Caligráfico Cursivo',
    font: 'italic 46px "Dancing Script", cursive',
    fontFamily: '"Dancing Script", cursive',
    fontSize: 46,
    isItalic: true
  },
  {
    id: 'style2',
    name: 'Estilo Firma Rápida y Firme',
    font: '700 50px "Caveat", cursive',
    fontFamily: '"Caveat", cursive',
    fontSize: 50,
    isBold: true
  },
  {
    id: 'style3',
    name: 'Estilo Caligrafía Tradicional',
    font: '54px "Great Vibes", cursive',
    fontFamily: '"Great Vibes", cursive',
    fontSize: 54,
    isItalic: false
  },
  {
    id: 'style4',
    name: 'Estilo Distintivo de Autor',
    font: '44px "Sacramento", cursive',
    fontFamily: '"Sacramento", cursive',
    fontSize: 44,
    isItalic: false
  },
  {
    id: 'style5',
    name: 'Estilo Quirófano Oficial',
    font: 'italic 46px "Playball", cursive',
    fontFamily: '"Playball", cursive',
    fontSize: 46,
    isItalic: true
  }
];

export const DigitalSignatureCanvas: React.FC<DigitalSignatureCanvasProps> = ({
  title,
  subtitle,
  signerName,
  initialSignatureDataUrl,
  onSaveSignature,
  accentColor = 'border-cyan-500',
  selectedScale,
  onScaleChange,
  selectedZoom,
  onZoomChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(initialSignatureDataUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Signature scale and zoom state
  const [internalScale, setInternalScale] = useState<'normal' | 'large' | 'extraLarge' | 'jumbo'>(() => {
    if (selectedScale) return selectedScale;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anestesiapro_doctor_signature_scale') as any;
      if (saved) return saved;
    }
    return 'extraLarge';
  });

  const currentScale = selectedScale || internalScale;

  const handleScaleSelect = (scale: 'normal' | 'large' | 'extraLarge' | 'jumbo') => {
    setInternalScale(scale);
    if (onScaleChange) onScaleChange(scale);
    try {
      localStorage.setItem('anestesiapro_doctor_signature_scale', scale);
    } catch {}
  };

  const [internalZoom, setInternalZoom] = useState<number>(() => {
    if (selectedZoom) return selectedZoom;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anestesiapro_doctor_signature_zoom');
      if (saved) return Number(saved) || 115;
    }
    return 115;
  });

  const currentZoom = selectedZoom || internalZoom;

  const handleZoomSelect = (zoom: number) => {
    setInternalZoom(zoom);
    if (onZoomChange) onZoomChange(zoom);
    try {
      localStorage.setItem('anestesiapro_doctor_signature_zoom', zoom.toString());
    } catch {}
  };

  // Signature typing states
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedNameInput, setTypedNameInput] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState('style1');
  const [strokeThickness, setStrokeThickness] = useState<number>(7.5); // Grande y Legible por defecto

  // Helper to crop whitespace around drawn strokes with balanced padding
  const cropCanvasWhitespace = (sourceCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = sourceCanvas.getContext('2d');
    if (!ctx) return sourceCanvas;
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let found = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];
          // Look for any stroke pixel
          if (a > 25 && !(r > 240 && g > 240 && b > 240)) {
            found = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (!found) return sourceCanvas;

      // Add generous padding around strokes for clean aesthetics
      const padding = 20;
      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(w, maxX + padding);
      maxY = Math.min(h, maxY + padding);

      const cropW = Math.max(1, maxX - minX);
      const cropH = Math.max(1, maxY - minY);

      const cropped = document.createElement('canvas');
      cropped.width = cropW;
      cropped.height = cropH;
      const cCtx = cropped.getContext('2d');
      if (!cCtx) return sourceCanvas;

      cCtx.drawImage(sourceCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      return cropped;
    } catch {
      return sourceCanvas;
    }
  };

  // Load initial state
  useEffect(() => {
    setSignaturePreview(initialSignatureDataUrl);
    setHasDrawn(!!initialSignatureDataUrl);
    
    // Fallback signer name cleanly
    let defaultSignerName = '';
    if (signerName) {
      // Strip any extra parentheses or licenses from the name input
      defaultSignerName = signerName.split('(')[0].trim();
    }
    setTypedNameInput(defaultSignerName || 'Dr. Carlos Leal');
  }, [initialSignatureDataUrl, signerName]);

  // Canvas drawing helpers
  const getCoordinates = (e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else if ('clientX' in e) {
      return {
        x: ((e as MouseEvent).clientX - rect.left) * scaleX,
        y: ((e as MouseEvent).clientY - rect.top) * scaleY
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e.nativeEvent, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e.nativeEvent, canvas);
    ctx.lineWidth = strokeThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#020617'; // Rich dark clinical ink
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  // Helper to generate text-based signature onto canvas
  const drawTextSignatureOnCanvas = useCallback((canvas: HTMLCanvasElement, text: string, styleId: string) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get selected style configuration
    const style = SIGNATURE_STYLES.find(s => s.id === styleId) || SIGNATURE_STYLES[0];

    // White background to clear it cleanly
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font style
    const fontModifier = `${style.isItalic ? 'italic ' : ''}${style.isBold ? 'bold ' : ''}`;
    ctx.font = `${fontModifier}${style.fontSize}px ${style.fontFamily}`;
    ctx.fillStyle = '#0f172a'; // High contrast ink
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw name text
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 - 10);

    // Draw realistic handcrafted flourish line underneath the name
    ctx.beginPath();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    
    const startY = canvas.height / 2 + 22;
    ctx.moveTo(canvas.width / 2 - 110, startY);
    ctx.bezierCurveTo(
      canvas.width / 2 - 40, startY - 4,
      canvas.width / 2 + 40, startY + 8,
      canvas.width / 2 + 110, startY
    );
    ctx.stroke();
  }, []);

  const handleConfirmSignature = () => {
    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!hasDrawn) {
        onSaveSignature(null);
        setSignaturePreview(null);
        setIsModalOpen(false);
        return;
      }
      // Auto-crop to remove excess whitespace so the signature renders large and crisp in the PDF!
      const trimmedCanvas = cropCanvasWhitespace(canvas);
      const dataUrl = trimmedCanvas.toDataURL('image/png');
      setSignaturePreview(dataUrl);
      onSaveSignature(dataUrl);
    } else {
      // Text auto-generate mode
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 460;
      tempCanvas.height = 190;
      
      const textToDraw = typedNameInput.trim() || 'Dr. Carlos Leal';
      drawTextSignatureOnCanvas(tempCanvas, textToDraw, selectedStyleId);
      
      const trimmedCanvas = cropCanvasWhitespace(tempCanvas);
      const dataUrl = trimmedCanvas.toDataURL('image/png');
      setSignaturePreview(dataUrl);
      onSaveSignature(dataUrl);
    }
    setIsModalOpen(false);
  };

  const handleRemoveSignature = () => {
    setSignaturePreview(null);
    setHasDrawn(false);
    onSaveSignature(null);
  };

  return (
    <div className={`p-4 bg-slate-900/90 rounded-2xl border ${accentColor} shadow-md space-y-3`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-black text-white flex items-center gap-1.5">
            <PenTool className="w-3.5 h-3.5 text-cyan-400" />
            {title}
          </h4>
          <p className="text-[11px] text-slate-400">{subtitle}</p>
        </div>
        {signaturePreview ? (
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Firmado
          </span>
        ) : (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
            Pendiente de firma
          </span>
        )}
      </div>

      {/* Signature Preview Box */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-2.5 min-h-[115px] flex items-center justify-center overflow-hidden">
        {signaturePreview ? (
          <div className="w-full flex flex-col items-center gap-1.5">
            <div className="bg-white rounded-lg p-2.5 max-h-28 w-full flex items-center justify-center shadow-inner overflow-hidden">
              <img
                src={signaturePreview}
                alt={title}
                className="max-h-24 max-w-full object-contain transition-transform"
                style={{
                  transform: `scale(${currentScale === 'jumbo' ? 1.25 : currentScale === 'extraLarge' ? 1.15 : currentScale === 'normal' ? 0.9 : 1.05})`
                }}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between w-full px-1 text-[10px] text-slate-400">
              {signerName && (
                <span className="font-bold text-slate-300">{signerName}</span>
              )}
              <span className="font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full ml-auto">
                Escala PDF: {currentScale === 'jumbo' ? 'Gigante (86mm)' : currentScale === 'extraLarge' ? 'Extra Grande (80mm)' : currentScale === 'normal' ? 'Estándar (62mm)' : 'Grande (74mm)'} ({currentZoom}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center p-3 space-y-1">
            <PenTool className="w-6 h-6 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 font-medium">
              Sin firma registrada
            </p>
            <p className="text-[10px] text-slate-500">
              Toca para dibujar tu firma o autogenerar una caligráfica en base a tu nombre
            </p>
          </div>
        )}
      </div>

      {/* Selector Rápido de Escala / Tamaño de Firma */}
      <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-extrabold uppercase text-slate-400 flex items-center gap-1">
            <PenTool className="w-3 h-3 text-cyan-400" /> Tamaño en Informe PDF:
          </span>
          <span className="font-mono text-cyan-300 font-bold">{currentZoom}%</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'normal', label: 'Estándar', mm: '62mm', zoom: 90 },
            { id: 'large', label: 'Grande', mm: '74mm', zoom: 105 },
            { id: 'extraLarge', label: '⭐ Extra', mm: '80mm', zoom: 120 },
            { id: 'jumbo', label: '👑 Gigante', mm: '86mm', zoom: 140 }
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                handleScaleSelect(opt.id as any);
                handleZoomSelect(opt.zoom);
              }}
              className={`py-1 px-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold border transition-all cursor-pointer text-center ${
                currentScale === opt.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
              title={`${opt.label} (${opt.mm})`}
            >
              <div>{opt.label}</div>
              <div className="text-[8px] opacity-80">{opt.mm}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setTimeout(() => {
              if (canvasRef.current && signatureMode === 'draw') {
                const canvas = canvasRef.current;
                canvas.width = 920;
                canvas.height = 380;
                const ctx = canvas.getContext('2d');
                if (ctx && signaturePreview) {
                  const img = new Image();
                  img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  img.src = signaturePreview;
                }
              }
            }, 100);
          }}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>{signaturePreview ? 'Cambiar / Redibujar / Escalar Firma' : 'Registrar Firma Médica'}</span>
        </button>

        {signaturePreview && (
          <button
            type="button"
            onClick={handleRemoveSignature}
            className="p-2 text-rose-400 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-xl transition-all cursor-pointer"
            title="Borrar firma"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Fullscreen Signature Configuration Modal with Draw & Type Options */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-3.5 max-h-[95vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-cyan-400" />
                  {title}
                </h3>
                <p className="text-xs text-slate-400">{subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Selector de Escala de Firma en el PDF */}
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Tamaño de la Firma en el PDF:
                </span>
                <span className="font-mono text-cyan-300 font-extrabold text-[11px] bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {currentZoom}% • {currentScale === 'jumbo' ? '86 mm' : currentScale === 'extraLarge' ? '80 mm' : currentScale === 'normal' ? '62 mm' : '74 mm'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'normal', label: 'Estándar', mm: '62 mm', zoom: 90 },
                  { id: 'large', label: 'Grande', mm: '74 mm', zoom: 105 },
                  { id: 'extraLarge', label: '⭐ Extra Grande', mm: '80 mm', zoom: 120 },
                  { id: 'jumbo', label: '👑 Gigante', mm: '86 mm', zoom: 140 }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      handleScaleSelect(opt.id as any);
                      handleZoomSelect(opt.zoom);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                      currentScale === opt.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[8px] opacity-75">{opt.mm}</div>
                  </button>
                ))}
              </div>

              {/* Slider de afinación fina del tamaño */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[9px] uppercase font-bold text-slate-500">Zoom fino:</span>
                <input
                  type="range"
                  min="80"
                  max="150"
                  step="5"
                  value={currentZoom}
                  onChange={(e) => handleZoomSelect(Number(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-slate-400 w-10 text-right">{currentZoom}%</span>
              </div>
            </div>

            {/* TAB SELECTOR: DRAW vs TYPE */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setSignatureMode('draw')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  signatureMode === 'draw'
                    ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>✍️ Dibujar en Pantalla</span>
              </button>

              <button
                type="button"
                onClick={() => setSignatureMode('type')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  signatureMode === 'type'
                    ? 'bg-cyan-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>🔤 Firma Caligráfica</span>
              </button>
            </div>

            {/* CONDITIONAL CONTENT */}
            {signatureMode === 'draw' ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">✍️</span>
                    <span>Dibuja tu firma con el dedo o stylus en el cuadro blanco.</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Retina HD
                  </span>
                </div>

                {/* Draw Canvas Box (High DPI 920x380) */}
                <div className="w-full bg-white rounded-2xl p-2 border-2 border-slate-300 shadow-inner overflow-hidden select-none touch-none">
                  <canvas
                    ref={canvasRef}
                    width={920}
                    height={380}
                    className="w-full h-[200px] sm:h-[220px] bg-white cursor-crosshair block rounded-xl touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  {/* Baseline indicator */}
                  <div className="w-full border-b border-dashed border-slate-300 my-1"></div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-2 font-mono">
                    <span>Línea base de rúbrica</span>
                    <span>Firma manual en alta definición</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Grosor de Trazo:</span>
                    {[
                      { label: 'Fino', val: 4.0 },
                      { label: 'Medio', val: 5.5 },
                      { label: '⭐ Grande Legible', val: 7.5 },
                      { label: 'Extra Intenso', val: 10.0 }
                    ].map(t => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setStrokeThickness(t.val)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                          strokeThickness === t.val
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-sm'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Borrar Lienzo</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 animate-fadeIn">
                <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ingresa tu nombre para autogenerar una firma caligráfica nítida y profesional.</span>
                </div>

                {/* Name Input field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre del Médico para la firma:</label>
                  <input
                    type="text"
                    value={typedNameInput}
                    onChange={(e) => setTypedNameInput(e.target.value)}
                    placeholder="Ej. Dr. Carlos Leal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-bold"
                  />
                </div>

                {/* Styles List */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Selecciona el diseño caligráfico:</label>
                  <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {SIGNATURE_STYLES.map((style) => {
                      const isSelected = selectedStyleId === style.id;
                      const textToPreview = typedNameInput.trim() || 'Dr. Carlos Leal';
                      
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedStyleId(style.id)}
                          className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-center ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border-cyan-500 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/30'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{style.name}</span>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          
                          {/* Beautiful Caligraphy Signature preview */}
                          <div className="bg-white rounded-lg p-3 my-1 text-center shadow-inner relative overflow-hidden flex items-center justify-center h-16 w-full">
                            <span 
                              style={{ 
                                fontFamily: style.fontFamily, 
                                fontSize: `${style.fontSize - 2}px`,
                                fontStyle: style.isItalic ? 'italic' : 'normal',
                                fontWeight: style.isBold ? 'bold' : 'normal',
                                color: '#0f172a'
                              }}
                              className="select-none block relative z-10"
                            >
                              {textToPreview}
                            </span>
                            {/* Signature Flourish Underlying stroke */}
                            <div className="absolute inset-x-0 bottom-2.5 h-[2px] bg-slate-300 w-2/3 mx-auto max-w-[200px]" style={{ transform: 'rotate(-1deg)' }}></div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmSignature}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar Firma</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

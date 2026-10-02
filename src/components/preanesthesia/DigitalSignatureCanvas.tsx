import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, PenTool, X, ShieldCheck, Sparkles, Type, CheckCircle2 } from 'lucide-react';

interface DigitalSignatureCanvasProps {
  title: string;
  subtitle: string;
  signerName?: string;
  initialSignatureDataUrl: string | null;
  onSaveSignature: (dataUrl: string | null) => void;
  accentColor?: string;
}

const SIGNATURE_STYLES = [
  {
    id: 'style1',
    name: 'Estilo Caligráfico Cursivo',
    font: 'italic 36px "Dancing Script", cursive',
    fontFamily: '"Dancing Script", cursive',
    fontSize: 36,
    isItalic: true
  },
  {
    id: 'style2',
    name: 'Estilo Firma Rápida',
    font: '700 38px "Caveat", cursive',
    fontFamily: '"Caveat", cursive',
    fontSize: 38,
    isBold: true
  },
  {
    id: 'style3',
    name: 'Estilo Caligrafía Tradicional',
    font: '44px "Great Vibes", cursive',
    fontFamily: '"Great Vibes", cursive',
    fontSize: 44,
    isItalic: false
  },
  {
    id: 'style4',
    name: 'Estilo Fino de Autor',
    font: '32px "Sacramento", cursive',
    fontFamily: '"Sacramento", cursive',
    fontSize: 32,
    isItalic: false
  },
  {
    id: 'style5',
    name: 'Estilo Clásico de Quirófano',
    font: 'italic 34px "Playball", cursive',
    fontFamily: '"Playball", cursive',
    fontSize: 34,
    isItalic: true
  }
];

export const DigitalSignatureCanvas: React.FC<DigitalSignatureCanvasProps> = ({
  title,
  subtitle,
  signerName,
  initialSignatureDataUrl,
  onSaveSignature,
  accentColor = 'border-cyan-500'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(initialSignatureDataUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Signature typing states
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedNameInput, setTypedNameInput] = useState('');
  const [selectedStyleId, setSelectedStyleId] = useState('style1');

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
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Dark high contrast ink
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
    ctx.lineWidth = 2.2;
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
      const dataUrl = canvas.toDataURL('image/png');
      setSignaturePreview(dataUrl);
      onSaveSignature(dataUrl);
    } else {
      // Text auto-generate mode
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 460;
      tempCanvas.height = 190;
      
      const textToDraw = typedNameInput.trim() || 'Dr. Carlos Leal';
      drawTextSignatureOnCanvas(tempCanvas, textToDraw, selectedStyleId);
      
      const dataUrl = tempCanvas.toDataURL('image/png');
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
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 p-2 min-h-[105px] flex items-center justify-center overflow-hidden">
        {signaturePreview ? (
          <div className="w-full flex flex-col items-center">
            <div className="bg-white rounded-lg p-2 max-h-24 w-full flex items-center justify-center">
              <img
                src={signaturePreview}
                alt={title}
                className="max-h-20 max-w-full object-contain"
              />
            </div>
            {signerName && (
              <p className="text-[11px] font-bold text-slate-300 mt-1">{signerName}</p>
            )}
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

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setTimeout(() => {
              if (canvasRef.current && signatureMode === 'draw') {
                const canvas = canvasRef.current;
                canvas.width = canvas.parentElement?.clientWidth || 450;
                canvas.height = 180;
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
          <span>{signaturePreview ? 'Cambiar / Configurar Firma' : 'Registrar Firma Médica'}</span>
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
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            
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
                <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-2">
                  <span className="text-base">✍️</span>
                  <span>Dibuja tu firma con el dedo o stylus en el cuadro blanco.</span>
                </div>

                {/* Draw Canvas Box */}
                <div className="w-full bg-white rounded-2xl p-2 border-2 border-slate-300 shadow-inner overflow-hidden select-none touch-none">
                  <canvas
                    ref={canvasRef}
                    width={460}
                    height={190}
                    className="w-full h-[180px] bg-white cursor-crosshair block rounded-xl touch-none"
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
                    <span>Firma manual</span>
                  </div>
                </div>

                <div className="flex justify-start">
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
              <div className="space-y-4 animate-fadeIn">
                <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Ingresa tu nombre para autogenerar una firma caligráfica profesional instantánea.</span>
                </div>

                {/* Name Input field */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre del Médico para la firma:</label>
                  <input
                    type="text"
                    value={typedNameInput}
                    onChange={(e) => setTypedNameInput(e.target.value)}
                    placeholder="Ej. Dr. Carlos Leal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Styles List */}
                <div className="space-y-2">
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
                          className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-center ${
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
                          <div className="bg-white rounded-lg p-3 my-1.5 text-center shadow-inner relative overflow-hidden flex items-center justify-center h-16 w-full">
                            <span 
                              style={{ 
                                fontFamily: style.fontFamily, 
                                fontSize: `${style.fontSize - 4}px`,
                                fontStyle: style.isItalic ? 'italic' : 'normal',
                                fontWeight: style.isBold ? 'bold' : 'normal',
                                color: '#0f172a'
                              }}
                              className="select-none block relative z-10"
                            >
                              {textToPreview}
                            </span>
                            {/* Signature Flourish Underlying stroke */}
                            <div className="absolute inset-x-0 bottom-3 h-[2px] bg-slate-200 w-2/3 mx-auto max-w-[200px]" style={{ transform: 'rotate(-1deg)' }}></div>
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

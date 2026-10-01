import React, { useRef, useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, PenTool, X, ShieldCheck, Clock } from 'lucide-react';

interface DigitalSignatureCanvasProps {
  title: string;
  subtitle: string;
  signerName?: string;
  initialSignatureDataUrl: string | null;
  onSaveSignature: (dataUrl: string | null) => void;
  accentColor?: string;
}

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

  useEffect(() => {
    setSignaturePreview(initialSignatureDataUrl);
    setHasDrawn(!!initialSignatureDataUrl);
  }, [initialSignatureDataUrl]);

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
    ctx.strokeStyle = '#0f172a'; // High contrast ink color
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

  const handleConfirmSignature = () => {
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
              Toca el botón para firmar directamente en la pantalla táctil
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
              if (canvasRef.current) {
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
          <span>{signaturePreview ? 'Cambiar / Repetir Firma' : 'Firmar con el Dedo o Stylus'}</span>
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

      {/* Fullscreen Touch Signature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4">
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

            {/* Instruction badge */}
            <div className="p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center gap-2">
              <span className="text-base">✍️</span>
              <span>Dibuja tu rúbrica o firma directamente sobre el lienzo blanco con el dedo o lápiz óptico.</span>
            </div>

            {/* Canvas Container */}
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
                <span>Línea base de firma</span>
                <span>Firma oficial</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={clearCanvas}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Borrar Lienzo</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSignature}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Aceptar y Estampar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

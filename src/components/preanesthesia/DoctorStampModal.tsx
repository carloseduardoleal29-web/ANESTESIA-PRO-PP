import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Check, Award, Upload, RefreshCw, Palette, Trash2, ShieldCheck, 
  Sparkles, FileText, CheckCircle2, Stethoscope, User, CreditCard
} from 'lucide-react';

interface DoctorStampModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorCedula: string;
  doctorLicense: string;
  doctorSpecialty?: string;
  doctorCollege?: string;
  initialStampDataUrl: string | null;
  onSaveStamp: (dataUrl: string | null) => void;
}

export const DoctorStampModal: React.FC<DoctorStampModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  doctorCedula,
  doctorLicense,
  doctorSpecialty = 'Especialista en Anestesiología y Reanimación',
  doctorCollege,
  initialStampDataUrl,
  onSaveStamp
}) => {
  const [stampMode, setStampMode] = useState<'generate' | 'upload'>('generate');
  const [stampPreview, setStampPreview] = useState<string | null>(initialStampDataUrl);
  
  // Custom form inputs for generated stamp
  const [name, setName] = useState(doctorName || 'Dr. Carlos Leal');
  const [cedula, setCedula] = useState(doctorCedula || '15.489.288');
  const [license, setLicense] = useState(doctorLicense || 'MP-84920');
  const [specialty, setSpecialty] = useState(doctorSpecialty || 'Médico Anestesiólogo');
  const [college, setCollege] = useState(doctorCollege || 'Col. Médicos');
  
  // Stamp style configurations
  const [stampShape, setStampShape] = useState<'rectangular' | 'oval'>('rectangular');
  const [inkColor, setInkColor] = useState<string>('#1e40af'); // Classic Medical Blue
  const [isTransparentBg, setIsTransparentBg] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStampPreview(initialStampDataUrl);
      setName(doctorName || 'Dr. Carlos Leal');
      setCedula(doctorCedula || '15.489.288');
      setLicense(doctorLicense || 'MP-84920');
      setSpecialty(doctorSpecialty || 'Médico Anestesiólogo');
      setCollege(doctorCollege || 'Col. Médicos');
    }
  }, [isOpen, doctorName, doctorCedula, doctorLicense, doctorSpecialty, doctorCollege, initialStampDataUrl]);

  // Generate official vector stamp on canvas
  const generateStampCanvas = useCallback(() => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const width = 600;
    const height = stampShape === 'rectangular' ? 260 : 340;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, width, height);

    if (!isTransparentBg) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.strokeStyle = inkColor;
    ctx.fillStyle = inkColor;

    if (stampShape === 'rectangular') {
      // Outer border
      ctx.lineWidth = 4.5;
      ctx.strokeRect(12, 12, width - 24, height - 24);
      // Inner thin border
      ctx.lineWidth = 1.5;
      ctx.strokeRect(18, 18, width - 36, height - 36);

      // Top line: Doctor Name (Bold uppercase)
      ctx.font = 'bold 30px "Montserrat", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const cleanName = (name.startsWith('Dr') ? name : `Dr. ${name}`).toUpperCase();
      ctx.fillText(cleanName, width / 2, 58);

      // Divider line
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(35, 84);
      ctx.lineTo(width - 35, 84);
      ctx.stroke();

      // Specialty line
      ctx.font = 'bold 21px "Arial", sans-serif';
      ctx.fillText(specialty.toUpperCase(), width / 2, 116);

      // Cédula & Matrícula line
      ctx.font = 'bold 20px "Arial", sans-serif';
      const cedulaText = cedula ? (cedula.toUpperCase().includes('C.I') ? cedula : `C.I. ${cedula}`) : '';
      const licenseText = license ? (license.toUpperCase().includes('M.P') ? license : `M.P. ${license}`) : '';
      const midLine = [cedulaText, licenseText].filter(Boolean).join(' • ');
      ctx.fillText(midLine, width / 2, 158);

      // College & Republic line
      ctx.font = '18px "Arial", sans-serif';
      const collegeText = college ? `COL. MÉD: ${college}` : 'REPÚBLICA BOLIVARIANA DE VENEZUELA';
      ctx.fillText(collegeText.toUpperCase(), width / 2, 198);

      // Small security seal code at bottom
      ctx.font = 'bold 12px "Courier New", monospace';
      ctx.fillText(`SELLO DIGITAL REGISTRADO • ANESTESIAPRO`, width / 2, 230);

    } else {
      // Oval Stamp
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width / 2 - 16, height / 2 - 16, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(width / 2, height / 2, width / 2 - 24, height / 2 - 24, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 28px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((name.startsWith('Dr') ? name : `Dr. ${name}`).toUpperCase(), width / 2, height / 2 - 50);

      ctx.font = 'bold 20px "Arial", sans-serif';
      ctx.fillText(specialty.toUpperCase(), width / 2, height / 2 - 10);

      ctx.font = 'bold 19px "Arial", sans-serif';
      const cedulaText = cedula ? `C.I. ${cedula}` : '';
      const licenseText = license ? `M.P. ${license}` : '';
      ctx.fillText([cedulaText, licenseText].filter(Boolean).join(' | '), width / 2, height / 2 + 28);

      ctx.font = '17px "Arial", sans-serif';
      ctx.fillText((college || 'ANESTESIOLOGÍA').toUpperCase(), width / 2, height / 2 + 65);
    }

    return canvas.toDataURL('image/png');
  }, [name, cedula, license, specialty, college, stampShape, inkColor, isTransparentBg]);

  // Update preview whenever parameters change in generate mode
  useEffect(() => {
    if (stampMode === 'generate' && isOpen) {
      const generated = generateStampCanvas();
      if (generated) setStampPreview(generated);
    }
  }, [stampMode, isOpen, generateStampCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setStampPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveStamp(stampPreview);
    onClose();
  };

  const handleRemove = () => {
    setStampPreview(null);
    onSaveStamp(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="space-y-0.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1 w-max">
              <Award className="w-3 h-3 text-cyan-400" />
              <span>SELLO PROFESIONAL MÉDICO DIGITALIZADO</span>
            </span>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Sello Oficial para Preanestesias en PDF</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector: Generar Sello vs Subir Foto */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setStampMode('generate')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              stampMode === 'generate'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autogenerar Sello Legal</span>
          </button>

          <button
            type="button"
            onClick={() => setStampMode('upload')}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              stampMode === 'upload'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Imagen de mi Sello</span>
          </button>
        </div>

        {/* Real Preview Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" /> Vista Previa del Sello Médico:
            </span>
            {stampPreview && (
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                ✓ Listo para estampar en PDF
              </span>
            )}
          </label>
          <div className="bg-white rounded-2xl p-4 border-2 border-slate-300 flex items-center justify-center min-h-[140px] shadow-inner overflow-hidden relative">
            {stampPreview ? (
              <img 
                src={stampPreview} 
                alt="Sello Médico Digital" 
                className="max-h-32 object-contain"
              />
            ) : (
              <div className="text-center text-slate-400 text-xs italic">
                Sin sello configurado. Selecciona una opción abajo.
              </div>
            )}
          </div>
        </div>

        {/* GENERATE MODE CONTROLS */}
        {stampMode === 'generate' && (
          <div className="space-y-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 animate-fadeIn text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Nombre del Médico:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Dr. Carlos Leal"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Especialidad Principal:</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="Ej. Anestesiología y Reanimación"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Cédula / DNI:</label>
                <input
                  type="text"
                  value={cedula}
                  onChange={(e) => setCedula(e.target.value)}
                  placeholder="Ej. 15.489.288"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Matrícula / Reg. M.P.:</label>
                <input
                  type="text"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Ej. MPPS-84920"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-cyan-200 font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] uppercase font-bold text-slate-400">Colegio Médico / Entidad:</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="Ej. Col. Médicos CM-4521"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            {/* Shape & Ink Color Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Forma del Sello:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStampShape('rectangular')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      stampShape === 'rectangular'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Rectangular (Estándar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStampShape('oval')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      stampShape === 'oval'
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Ovalado Clínico
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Color de Tinta de Sello:</label>
                <div className="flex gap-2">
                  {[
                    { id: '#1e40af', label: 'Azul Médico', color: 'bg-blue-700' },
                    { id: '#0f172a', label: 'Negro', color: 'bg-slate-950' },
                    { id: '#4c1d95', label: 'Morado', color: 'bg-purple-800' }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setInkColor(c.id)}
                      className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-bold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        inkColor === c.id
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 text-white font-black'
                          : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${c.color} border border-white/20`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UPLOAD MODE CONTROLS */}
        {stampMode === 'upload' && (
          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 animate-fadeIn text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Seleccionar Foto de mi Sello Húmedo (PNG / JPG)</span>
            </button>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
              Toma una fotografía nítida sobre fondo blanco a tu sello médico húmedo o sube el archivo de diseño provisto por tu imprenta médica.
            </p>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div>
            {stampPreview && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Quitar Sello</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!stampPreview}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-cyan-950/60 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Sello Oficial</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

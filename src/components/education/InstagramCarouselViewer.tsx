import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import { EducationalResource } from '../../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  FileText, 
  Sparkles, 
  Layers, 
  X, 
  ZoomIn, 
  Check, 
  Share2,
  Calendar,
  User,
  Eye,
  Loader2
} from 'lucide-react';

interface InstagramCarouselViewerProps {
  resource: EducationalResource;
  onDownload?: (resource: EducationalResource) => void;
}

export const InstagramCarouselViewer: React.FC<InstagramCarouselViewerProps> = ({
  resource,
  onDownload
}) => {
  // Extract all images for the carousel with resilient pairing
  const images: string[] = React.useMemo(() => {
    const count = Math.max(
      Array.isArray(resource.images) ? resource.images.length : 0,
      Array.isArray(resource.imagesData) ? resource.imagesData.length : 0
    );
    if (count > 0) {
      const list: string[] = [];
      for (let i = 0; i < count; i++) {
        const dataUrl = resource.imagesData?.[i];
        const normalUrl = resource.images?.[i];
        const item = (dataUrl && dataUrl.startsWith('data:')) ? dataUrl : (normalUrl || dataUrl);
        if (item && typeof item === 'string' && item.trim().length > 0) {
          list.push(item);
        }
      }
      if (list.length > 0) return list;
    }
    if (resource.fileDataUrl && !resource.fileDataUrl.startsWith('data:application/pdf')) {
      return [resource.fileDataUrl];
    }
    if (resource.url && (
      resource.category === 'infografia' || 
      resource.category === 'foto' || 
      resource.category === 'carrusel' || 
      resource.url.startsWith('/uploads/') ||
      resource.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
    )) {
      return [resource.url];
    }
    return [];
  }, [resource.id, resource.updatedAt, resource.url, resource.fileDataUrl, resource.images?.length, resource.imagesData?.length]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  // Preload neighboring images for smooth, instantaneous mobile swiping
  useEffect(() => {
    if (!images || images.length === 0) return;
    const currentSrc = images[currentIndex];
    if (currentSrc && !currentSrc.startsWith('data:')) {
      // Only show spinner for uncached remote images
      setIsImageLoading(false);
    } else {
      setIsImageLoading(false);
    }
    
    // Preload next and previous
    const toPreload = [currentIndex, currentIndex + 1, currentIndex - 1].filter(
      i => i >= 0 && i < images.length
    );
    toPreload.forEach(idx => {
      const src = images[idx];
      if (src && !src.startsWith('data:')) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [currentIndex, images]);

  // Touch Swipe Gesture Support (Mobile touch screens)
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // Minimum px to consider a swipe

    if (distance > minSwipeDistance && currentIndex < images.length - 1) {
      // Swiped Left -> Next Image
      setCurrentIndex(prev => prev + 1);
    } else if (distance < -minSwipeDistance && currentIndex > 0) {
      // Swiped Right -> Previous Image
      setCurrentIndex(prev => prev - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Right') {
        if (currentIndex < images.length - 1) setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, isLightboxOpen]);

  // Current Slide Caption or Title
  const currentCaption = resource.imageCaptions && resource.imageCaptions[currentIndex]
    ? resource.imageCaptions[currentIndex]
    : `Lámina ${currentIndex + 1} de ${images.length}`;

  // Download single image
  const handleDownloadSingleSlide = () => {
    const activeUrl = images[currentIndex];
    if (!activeUrl) return;

    const link = document.createElement('a');
    link.href = activeUrl;
    link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lamina_${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate & Download Comprehensive Clinical PDF Booklet with all images
  const handleGeneratePdfBooklet = async () => {
    if (images.length === 0) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        if (i > 0) {
          doc.addPage();
        }

        // Header
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 26, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.text('ANESTESIAPRO • ÁLBUM CLÍNICO DE EDUCACIÓN CONTINUA', 14, 11);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(56, 189, 248); // sky-400
        doc.text(
          `${resource.title.substring(0, 50)} • Lámina ${i + 1} de ${images.length}`,
          14,
          18
        );

        doc.setFontSize(8);
        doc.setTextColor(203, 213, 225);
        doc.text(
          `${resource.author || 'Dr. Carlos Leal'} • ${resource.date || new Date().toISOString().split('T')[0]}`,
          pageWidth - 14,
          18,
          { align: 'right' }
        );

        // Slide Caption Banner
        const captionText = resource.imageCaptions && resource.imageCaptions[i] 
          ? resource.imageCaptions[i] 
          : `Diapositiva ${i + 1}: Esquema y Protocolo Clínico`;

        doc.setFillColor(241, 245, 249);
        doc.rect(14, 30, pageWidth - 28, 10, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text(`▶ ${captionText}`, 17, 36.5);

        // Load image into canvas to get clean jpeg format
        const imgData = await new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/jpeg', 0.90));
            } else {
              resolve(images[i]);
            }
          };
          img.onerror = () => resolve(images[i]);
          img.src = images[i];
        });

        // Add Image scaled maintaining aspect ratio
        try {
          const imgProps = doc.getImageProperties(imgData);
          const maxImgWidth = pageWidth - 28;
          const maxImgHeight = pageHeight - 60;

          let renderWidth = maxImgWidth;
          let renderHeight = (imgProps.height * renderWidth) / imgProps.width;

          if (renderHeight > maxImgHeight) {
            renderHeight = maxImgHeight;
            renderWidth = (imgProps.width * renderHeight) / imgProps.height;
          }

          const posX = 14 + (maxImgWidth - renderWidth) / 2;
          const posY = 44 + (maxImgHeight - renderHeight) / 2;

          doc.addImage(imgData, 'JPEG', posX, posY, renderWidth, renderHeight);
        } catch (imgErr) {
          console.warn('PDF AddImage error, falling back:', imgErr);
          doc.addImage(imgData, 'JPEG', 14, 45, pageWidth - 28, 190);
        }

        // Footer
        doc.setFillColor(248, 250, 252);
        doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);

        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('AnestesiaPro App • Uso Docente & Asistencial Perioperatorio', 14, pageHeight - 5);
        doc.text(`Página ${i + 1} de ${images.length}`, pageWidth - 14, pageHeight - 5, { align: 'right' });
      }

      const fileName = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_carrusel_completo.pdf`;
      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF booklet:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (images.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <Layers className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-bold">No hay imágenes disponibles para este carrusel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Carrusel Top Bar - Header Info */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 rounded-2xl p-3.5 sm:p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-rose-500/40 tracking-wider">
                ÁLBUM / CARRUSEL • {images.length} FOTOS
              </span>
              <span className="text-[11px] text-cyan-400 font-mono font-bold hidden xs:inline">
                Estilo Instagram
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white leading-tight mt-0.5">
              {resource.title}
            </h3>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Ver en pantalla completa con zoom"
          >
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Zoom HD</span>
          </button>

          <button
            onClick={handleGeneratePdfBooklet}
            disabled={isGeneratingPdf}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer active:scale-95 disabled:opacity-50"
            title="Descargar todas las fotos unidas en un solo PDF clínico"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Descargar en 1 PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Instagram Slide Viewport */}
      <div 
        className="relative bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Instagram Header Bar inside Viewport */}
        <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent p-3 sm:p-4 flex items-center justify-between text-white pointer-events-auto">
          {/* Author info pill */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-xs font-bold shadow-md">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-[10px] font-black text-slate-950">
              {resource.author ? resource.author.charAt(0) : 'A'}
            </div>
            <span className="text-slate-200 text-[11px] truncate max-w-[150px] sm:max-w-[220px]">
              {resource.author || 'Dr. Carlos Leal • AnestesiaPro'}
            </span>
          </div>

          {/* Instagram-style Slide Counter Pill: "1 / 5" */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full text-xs font-black text-white tracking-widest shadow-lg flex items-center gap-1.5">
              <span className="text-cyan-400">{currentIndex + 1}</span>
              <span className="text-slate-500">/</span>
              <span>{images.length}</span>
            </div>

            <button
              onClick={() => setIsLightboxOpen(true)}
              className="bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md border border-white/10 p-1.5 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Pantalla completa"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Slide Photo Container */}
        <div 
          className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] aspect-square sm:aspect-[4/3] md:aspect-[16/10] max-h-[640px] flex items-center justify-center bg-slate-950 overflow-hidden cursor-zoom-in" 
          onClick={() => setIsLightboxOpen(true)}
        >
          {isImageLoading && !failedImages[currentIndex] && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 z-10">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
              <span className="text-xs text-slate-400 font-bold">Cargando lámina...</span>
            </div>
          )}

          {failedImages[currentIndex] ? (
            <div className="flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 shadow-xl">
                <Layers className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">
                  Lámina {currentIndex + 1} de {images.length}
                </span>
                <h4 className="text-base font-black text-white">{resource.title}</h4>
                <p className="text-xs text-slate-400">
                  {resource.imageCaptions?.[currentIndex] || resource.description || 'Lámina clínica oficial'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFailedImages(prev => ({ ...prev, [currentIndex]: false }));
                  setIsImageLoading(true);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                Reintentar carga
              </button>
            </div>
          ) : (
            <img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`Diapositiva ${currentIndex + 1} - ${resource.title}`}
              className="w-full h-full object-contain transition-transform duration-300"
              loading="eager"
              referrerPolicy="no-referrer"
              onLoad={() => setIsImageLoading(false)}
              onError={(e) => {
                const dataFb = (resource.imagesData && resource.imagesData[currentIndex] && resource.imagesData[currentIndex].startsWith('data:'))
                  ? resource.imagesData[currentIndex]
                  : ((resource.fileDataUrl && resource.fileDataUrl.startsWith('data:')) ? resource.fileDataUrl : null);
                if (dataFb && e.currentTarget.src !== dataFb) {
                  e.currentTarget.src = dataFb;
                  return;
                }
                setIsImageLoading(false);
                setFailedImages(prev => ({ ...prev, [currentIndex]: true }));
              }}
            />
          )}

          {/* Swipe guide hint on mobile (subtle) */}
          <div className="absolute bottom-16 sm:bottom-12 inset-x-0 flex justify-center pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity">
            <span className="bg-slate-900/80 text-[11px] text-slate-300 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 font-semibold">
              Desliza o usa las flechas ◀ ▶ para navegar
            </span>
          </div>
        </div>

        {/* Previous Navigation Button (Instagram Circle Style) */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => Math.max(0, prev - 1));
            }}
            aria-label="Diapositiva anterior"
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white hover:text-cyan-300 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 -ml-0.5" />
          </button>
        )}

        {/* Next Navigation Button (Instagram Circle Style) */}
        {currentIndex < images.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(prev => Math.min(images.length - 1, prev + 1));
            }}
            aria-label="Siguiente diapositiva"
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white hover:text-cyan-300 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 -mr-0.5" />
          </button>
        )}

        {/* Instagram Pagination Dots (Bottom Center) */}
        {images.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 py-1 pointer-events-auto">
            <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-lg">
              {images.map((_, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Ir a la diapositiva ${idx + 1}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      isActive 
                        ? 'w-6 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-sm shadow-cyan-400/50' 
                        : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Caption & Current Slide Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
              Lámina {currentIndex + 1} de {images.length}
            </span>
            {resource.imageCaptions && resource.imageCaptions[currentIndex] && (
              <span className="text-xs font-black text-white">
                {resource.imageCaptions[currentIndex]}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {resource.description || 'Consulta cada diapositiva deslizando hacia la izquierda o derecha.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={handleDownloadSingleSlide}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Descargar esta foto en alta resolución"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Descargar Foto #{currentIndex + 1}</span>
          </button>
        </div>
      </div>

      {/* Thumbnail Strip / Mini Navegador de Diapositivas */}
      {images.length > 1 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-black text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Todas las diapositivas ({images.length}):
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Toca para saltar directamente
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
            {images.map((imgUrl, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden transition-all cursor-pointer group ${
                    isSelected 
                      ? 'ring-3 ring-cyan-400 border-2 border-white scale-105 shadow-lg shadow-cyan-500/20' 
                      : 'border border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-xs text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                  {isSelected && (
                    <div className="absolute inset-x-0 bottom-0 bg-cyan-500 text-slate-950 text-[9px] font-black text-center py-0.5">
                      ACTUAL
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Screen Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-between p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div 
            className="w-full max-w-6xl flex items-center justify-between gap-3 text-white z-20 pb-2 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="bg-rose-500/20 text-rose-300 text-xs font-black uppercase px-2.5 py-1 rounded border border-rose-500/40">
                Lámina {currentIndex + 1} de {images.length}
              </span>
              <h4 className="text-sm sm:text-base font-black text-white truncate max-w-md">
                {resource.title}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSingleSlide}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                title="Descargar esta foto"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Descargar Foto</span>
              </button>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                title="Cerrar visor"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Viewport */}
          <div 
            className="relative flex-1 w-full max-w-6xl flex items-center justify-center p-2 my-2 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {failedImages[currentIndex] ? (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
                <Layers className="w-12 h-12 text-cyan-400 mb-3" />
                <h4 className="text-lg font-black text-white">{resource.title}</h4>
                <p className="text-sm text-slate-300 mt-1">Lámina {currentIndex + 1} de {images.length}</p>
                <p className="text-xs text-slate-400 mt-2">{resource.imageCaptions?.[currentIndex] || resource.description}</p>
              </div>
            ) : (
              <img
                src={images[currentIndex]}
                alt={`Lámina ${currentIndex + 1}`}
                className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
                referrerPolicy="no-referrer"
                onError={() => setFailedImages(prev => ({ ...prev, [currentIndex]: true }))}
              />
            )}

            {/* Previous */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white hover:text-cyan-300 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next */}
            {currentIndex < images.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white hover:text-cyan-300 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl cursor-pointer"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Navigation */}
          <div 
            className="w-full max-w-2xl flex items-center justify-center gap-1.5 py-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-7 h-2.5 bg-cyan-400' 
                    : 'w-2.5 h-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

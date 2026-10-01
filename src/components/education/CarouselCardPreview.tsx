import React, { useState } from 'react';
import { EducationalResource } from '../../types';
import { ChevronLeft, ChevronRight, Layers, Eye, Sparkles } from 'lucide-react';

interface CarouselCardPreviewProps {
  resource: EducationalResource;
  onOpen: () => void;
}

export const CarouselCardPreview: React.FC<CarouselCardPreviewProps> = ({ resource, onOpen }) => {
  const images = React.useMemo(() => {
    if (resource.photoDeleted) return [];
    const list: string[] = [];
    const count = Math.max(
      Array.isArray(resource.images) ? resource.images.length : 0,
      Array.isArray(resource.imagesData) ? resource.imagesData.length : 0
    );
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const dataUrl = resource.imagesData?.[i];
        const normalUrl = resource.images?.[i];
        const item = (dataUrl && dataUrl.startsWith('data:')) ? dataUrl : (normalUrl || dataUrl);
        if (item && typeof item === 'string' && item.trim().length > 0 && !item.startsWith('/images/')) {
          list.push(item);
        }
      }
      if (list.length > 0) return list;
    }
    if (resource.fileDataUrl && !resource.fileDataUrl.startsWith('data:application/pdf')) {
      return [resource.fileDataUrl];
    }
    if (resource.url && (
      resource.url.startsWith('/uploads/') ||
      resource.url.startsWith('data:image/') ||
      resource.url.startsWith('blob:')
    )) {
      return [resource.url];
    }
    return [];
  }, [resource.id, resource.photoDeleted, resource.updatedAt, resource.url, resource.fileDataUrl, resource.images?.length, resource.imagesData?.length]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const total = images.length;
  const currentImg = images[currentIndex] || images[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const handleThumbClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  return (
    <div 
      className="rounded-2xl overflow-hidden border border-rose-500/30 bg-slate-950 relative group/carousel shadow-md hover:border-rose-400 transition-all select-none"
      onClick={onOpen}
    >
      {/* Main Image Viewport */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer">
        <img 
          key={currentIndex}
          src={currentImg} 
          alt={`Lámina ${currentIndex + 1} - ${resource.title}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover/carousel:scale-102" 
          loading="eager"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const dataFb = (resource.imagesData && resource.imagesData[currentIndex] && resource.imagesData[currentIndex].startsWith('data:'))
              ? resource.imagesData[currentIndex]
              : ((resource.fileDataUrl && resource.fileDataUrl.startsWith('data:')) ? resource.fileDataUrl : null);
            if (dataFb && e.currentTarget.src !== dataFb) {
              e.currentTarget.src = dataFb;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />

        {/* Top-Right Badge: Slide Counter */}
        <div className="absolute top-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 z-10 pointer-events-none">
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>{currentIndex + 1} / {total} fotos</span>
        </div>

        {/* Top-Left Badge: Album Tag */}
        <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow z-10 flex items-center gap-1 pointer-events-none">
          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
          <span>Carrusel Instagram</span>
        </div>

        {/* Left Arrow Button (Direct card navigation) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all active:scale-90 z-20 cursor-pointer"
            title="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Right Arrow Button (Direct card navigation) */}
        {total > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all active:scale-90 z-20 cursor-pointer"
            title="Foto siguiente"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Bottom Slide Dots */}
        {total > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center items-center gap-1 z-10 pointer-events-none">
            {images.slice(0, 10).map((_, idx) => (
              <span 
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-4 bg-rose-400 shadow-sm shadow-rose-400/80' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
            {total > 10 && (
              <span className="text-[8px] text-white/80 font-bold ml-1">+{total - 10}</span>
            )}
          </div>
        )}
      </div>

      {/* Mini bottom slide strip & Open button */}
      <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar max-w-[70%]">
          {images.map((imgUrl, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => handleThumbClick(e, i)}
              className={`w-7 h-7 rounded-md overflow-hidden border shrink-0 transition-all cursor-pointer ${
                i === currentIndex 
                  ? 'border-rose-400 ring-2 ring-rose-400/50 scale-105' 
                  : 'border-slate-700 opacity-60 hover:opacity-100'
              }`}
              title={`Ver foto ${i + 1}`}
            >
              <img src={imgUrl} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          className="text-[11px] font-extrabold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ver Álbum</span>
        </button>
      </div>
    </div>
  );
};

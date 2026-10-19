import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Upload, 
  Search, 
  Filter, 
  Video, 
  Image as ImageIcon, 
  Calendar, 
  Heart, 
  ExternalLink, 
  MessageCircle, 
  X, 
  ChevronLeft, 
  ArrowRight 
} from 'lucide-react';
import { VortexApproachVisualizer } from './education/VortexApproachVisualizer';
import { EmotiveProtocolVisualizer } from './education/EmotiveProtocolVisualizer';
import { PreeclampsiaProtocolVisualizer } from './education/PreeclampsiaProtocolVisualizer';
import { InstagramCarouselViewer } from './education/InstagramCarouselViewer';
import { PengBlockVisualizer } from './education/PengBlockVisualizer';
import { INITIAL_RESOURCES } from '../data/initialEducationResources';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';
import { ResourceShareStrip } from './education/ResourceShareStrip';

export interface EducationPostItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  type: 'reel' | 'photo' | 'infographic' | 'article' | 'video';
  mediaUrl: string;
  date: string;
  content: string;
  likes: number;
  comments: string[];
  visualizerType?: 'vortex' | 'preeclampsia' | 'emotive' | 'dia-anestesiologo' | 'peng';
  pdfDownloadUrl?: string;
  externalUrl?: string;
}

export const DEFAULT_EDUCATION_POSTS: EducationPostItem[] = [
  {
    id: "foto-quirofano-hoy",
    title: "Registro de Quirófano: Práctica Anestésica y Trabajo en Equipo",
    category: "Casos Clínicos & Quirófano",
    summary: "Fotografía compartida por la comunidad médica sobre monitorización y labor diaria en quirófano.",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    date: "Actualizado",
    content: "Momento capturado durante el manejo anestésico matutino en áreas quirúrgicas de alta complejidad.",
    likes: 112,
    comments: [
      "Excelente trabajo en equipo en quirófano."
    ]
  },
  {
    id: "foto-recuperada-2",
    title: "Jornada Quirúrgica: Monitoreo Avanzado y Cuidado Crítico",
    category: "Casos Clínicos & Quirófano",
    summary: "Registro fotográfico sobre anestesia cardiovascular, líneas arteriales y monitorización hemodinámica.",
    type: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    date: "Actualizado",
    content: "Registro fotográfico de la sesión clínica y revisión de casos complejos en anestesiología.",
    likes: 95,
    comments: [
      "Excelente actualización y monitorización."
    ]
  },
  {
    id: "vortex-airway-2026",
    title: "Infografía Interactiva: Algoritmo VORTEX en Vía Aérea Difícil",
    category: "Vía Aérea",
    summary: 'Guía visual y paso a paso para la gestión estructurada de situaciones de "No Intubación, No Oxigenación".',
    type: "infographic",
    mediaUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    date: "Octubre 2026",
    content: "El enfoque VORTEX simplifica la toma de decisiones críticas priorizando dispositivos supraglóticos y acceso frontal al cuello.",
    likes: 210,
    comments: [
      "Imprescindible para el carro de vía aérea."
    ],
    visualizerType: "vortex"
  },
  {
    id: "preeclampsia-guia-2026",
    title: "Guía Clínica: Manejo Anestésico en Preeclampsia Severa",
    category: "Obstetricia",
    summary: "Protocolo actualizado sobre analgesia epidural, manejo de presión arterial y prevención de eclampsia en cesárea urgente.",
    type: "article",
    mediaUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    date: "Octubre 2026",
    content: "Revisión exhaustiva del desbalance angiogénico (sFlt-1/PlGF), líquidos restrictivos y estabilidad hemodinámica maternofetal.",
    likes: 175,
    comments: [
      "Excelente protocolo para obstetricia."
    ],
    visualizerType: "preeclampsia"
  },
  {
    id: "res-protocolo-emotive-hemorragia-posparto-2026",
    title: "Protocolo E-MOTIVE: Manejo Estandarizado de Hemorragia Posparto (HPP)",
    category: "Obstetricia",
    summary: "Detección precoz mediante bolsa calibrada de recolección y paquete de respuesta inmediata (Masaje, Oxitócicos, Ácido Tranexámico, Fluidos).",
    type: "article",
    mediaUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    date: "Septiembre 2026",
    content: "Protocolo basado en la evidencia del estudio multicéntrico de la OMS publicado en NEJM para reducción de morbimortalidad materna por hemorragia posparto.",
    likes: 164,
    comments: [
      "Esencial para salas de parto y quirófano obstétrico."
    ],
    visualizerType: "emotive"
  },
  {
    id: "peng-block-regional",
    title: "Bloqueo PENG (Pericapsular Nerve Group) Eco-Guiado",
    category: "Anestesia Regional",
    summary: "Analgesia de alta precisión para fracturas de cadera y artroplastias preservando la fuerza muscular del cuádriceps.",
    type: "infographic",
    mediaUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    date: "Agosto 2026",
    content: "Abordaje sonoanatómico de la eminencia iliopúbica, tendón del psoas y ramas articulares del nervio femoral y obturador accesorio.",
    likes: 215,
    comments: [
      "Excelente analgesia sin bloqueo motor."
    ],
    visualizerType: "peng"
  }
];

export interface EducationModuleProps {
  initialResourceId?: string | null;
  onClearInitialResource?: () => void;
}

export const EducationModuleMain: React.FC<EducationModuleProps> = ({
  initialResourceId,
  onClearInitialResource
}) => {
  const [items, setItems] = useState<EducationPostItem[]>(DEFAULT_EDUCATION_POSTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<EducationPostItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [activeVisualizer, setActiveVisualizer] = useState<'vortex' | 'preeclampsia' | 'emotive' | 'dia-anestesiologo' | 'peng' | null>(null);

  // New Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Reels del Día del Anestesiólogo');
  const [newSummary, setNewSummary] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Load custom stored uploads and combine
  useEffect(() => {
    try {
      const stored = localStorage.getItem('anestesiapro_education_full_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customIds = new Set(parsed.map((p: any) => p.id));
          const merged = [...parsed, ...DEFAULT_EDUCATION_POSTS.filter(d => !customIds.has(d.id))];
          setItems(merged);
        }
      }
    } catch (e) {
      console.warn('[EducationModule] Error loading stored posts:', e);
    }
  }, []);

  // Handle initialResourceId navigation from notifications or home banner
  useEffect(() => {
    if (!initialResourceId) return;

    if (initialResourceId === 'preeclampsia' || initialResourceId.includes('preeclampsia')) {
      setActiveVisualizer('preeclampsia');
    } else if (initialResourceId === 'vortex' || initialResourceId.includes('vortex')) {
      setActiveVisualizer('vortex');
    } else if (initialResourceId === 'emotive' || initialResourceId.includes('emotive')) {
      setActiveVisualizer('emotive');
    } else if (initialResourceId.includes('dia-del-anestesiologo')) {
      setActiveVisualizer('dia-anestesiologo');
    } else {
      const target = items.find(it => it.id === initialResourceId);
      if (target) {
        setSelectedItem(target);
      }
    }

    if (onClearInitialResource) {
      onClearInitialResource();
    }
  }, [initialResourceId, items, onClearInitialResource]);

  // Handle Like
  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.map(item => item.id === id ? { ...item, likes: item.likes + 1 } : item);
    setItems(updated);
    try {
      localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updated));
    } catch {}
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, likes: selectedItem.likes + 1 });
    }
  };

  // Handle Comment Submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedItem) return;

    const newComments = [...(selectedItem.comments || []), commentInput.trim()];
    const updatedItem = { ...selectedItem, comments: newComments };
    setSelectedItem(updatedItem);

    const updated = items.map(it => it.id === selectedItem.id ? updatedItem : it);
    setItems(updated);
    try {
      localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updated));
    } catch {}
    setCommentInput('');
  };

  // Handle New Post Submission
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    const newPost: EducationPostItem = {
      id: 'upload-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      summary: newSummary.trim(),
      type: newCategory.includes('Reel') ? 'reel' : 'photo',
      mediaUrl: newMediaUrl.trim() || 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: newSummary.trim(),
      likes: 1,
      comments: []
    };

    const updated = [newPost, ...items];
    setItems(updated);
    try {
      localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updated));
    } catch {}

    setNewTitle('');
    setNewSummary('');
    setNewMediaUrl('');
    setShowUploadModal(false);
  };

  // Categories list
  const categories = [
    'Todos',
    'Casos Clínicos & Quirófano',
    'Obstetricia',
    'Vía Aérea',
    'Anestesia Regional'
  ];

  // Filtered items
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // If a full-screen interactive visualizer is active, render it with top back bar
  if (activeVisualizer) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <button
            onClick={() => setActiveVisualizer(null)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 font-bold text-xs py-2 px-4 rounded-xl border border-cyan-500/30 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver a Educación Continua</span>
          </button>
          <span className="text-xs font-bold text-slate-300">
            {activeVisualizer === 'vortex' && 'Algoritmo VORTEX • Vía Aérea Difícil'}
            {activeVisualizer === 'preeclampsia' && 'Protocolo Maestro de Preeclampsia & Eclampsia'}
            {activeVisualizer === 'emotive' && 'Protocolo E-MOTIVE • Hemorragia Posparto'}
            {activeVisualizer === 'peng' && 'Bloqueo PENG Eco-Guiado'}
          </span>
        </div>

        {activeVisualizer === 'vortex' && <VortexApproachVisualizer />}
        {activeVisualizer === 'preeclampsia' && <PreeclampsiaProtocolVisualizer />}
        {activeVisualizer === 'emotive' && <EmotiveProtocolVisualizer />}
        {activeVisualizer === 'peng' && <PengBlockVisualizer />}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in text-slate-100">
      {/* WhatsApp Share Banner */}
      <WhatsAppShareBanner 
        title="Educación Continua & Biblioteca Clínica"
        description="Infografías de vía aérea VORTEX, protocolo de preeclampsia y guías clínicas basadas en evidencia."
        tabParam="educacion"
      />

      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Educación Continua &bull; Biblioteca Médica Oficial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Módulo de Educación Continua
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Biblioteca médica interactiva, infografías clínicas, protocolos de vía aérea y guías basadas en la evidencia para anestesiología y reanimación.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer active:scale-95"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Nueva Foto o Reel</span>
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between bg-slate-900/90 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar reels, fotos, guías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* GRID OF EDUCATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
          >
            {item.mediaUrl && (
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  {item.type === 'reel' ? (
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{item.category}</span>
                </div>
              </div>
            )}

            <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </span>
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors cursor-pointer"
                    title="Me gusta"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-400" />
                    <span className="font-bold">{item.likes}</span>
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span className="group-hover:underline flex items-center gap-1.5">
                  <span>Ver publicación completa</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{item.comments?.length || 0}</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD PHOTO / REEL MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 text-white">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold">Subir Foto o Reel (Día del Anestesiólogo)</h3>
              <p className="text-xs text-slate-400">Comparte tu material con la comunidad médica de AnestesiaPro.</p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Título de la Publicación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Celebración Día del Anestesiólogo en Quirófano"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option>Reels del Día del Anestesiólogo</option>
                  <option>Obstetricia</option>
                  <option>Vía Aérea</option>
                  <option>Anestesia Regional</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">URL de la Imagen o Reel (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Descripción / Resumen *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalles sobre el contenido..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
              >
                Publicar en Educación Continua
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR SELECTED ITEM */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative space-y-5 text-white max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                {selectedItem.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {selectedItem.title}
              </h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedItem.date}</span>
              </div>
            </div>

            {selectedItem.mediaUrl && (
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[380px] flex items-center justify-center shadow-inner">
                <img
                  src={selectedItem.mediaUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {selectedItem.summary}
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Descripción Completa
              </h4>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {selectedItem.content}
              </p>
            </div>

            {/* BUTTON TO LAUNCH INTERACTIVE VISUALIZER IF AVAILABLE */}
            {selectedItem.visualizerType && (
              <div className="pt-2">
                <button
                  onClick={() => {
                    setActiveVisualizer(selectedItem.visualizerType || null);
                    setSelectedItem(null);
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Abrir Guía / Visualizador Interactivo en Pantalla Completa</span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>
            )}

            {/* LIKES ROW */}
            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={(e) => handleLike(selectedItem.id, e)}
                className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-4 py-2 rounded-xl border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-rose-400" />
                <span>{selectedItem.likes} Me gusta</span>
              </button>
            </div>

            {/* COMMENTS SECTION */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <span>Comentarios ({selectedItem.comments?.length || 0})</span>
              </h4>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedItem.comments && selectedItem.comments.length > 0 ? (
                  selectedItem.comments.map((comm, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 p-3 rounded-xl text-xs text-slate-300 border border-slate-800"
                    >
                      {comm}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                  </div>
                )}
              </div>

              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-md cursor-pointer"
                >
                  Comentar
                </button>
              </form>
            </div>

            {/* SHARE STRIP */}
            <ResourceShareStrip 
              resourceId={selectedItem.id} 
              title={selectedItem.title} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Video, FileText, Download, ExternalLink, Calendar, Filter, Sparkles, X, CheckCircle2, Upload, Plus, Heart, MessageCircle, Share2, Image as ImageIcon, Play, Award, ShieldPulse, Stethoscope } from 'lucide-react';
import { ResourceShareStrip } from './education/ResourceShareStrip';

interface EducationItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  type: 'reel' | 'photo' | 'article' | 'infographic' | 'guide';
  mediaUrl?: string;
  date: string;
  content: string;
  likes: number;
  comments: string[];
}

const INITIAL_ITEMS: EducationItem[] = [
  {
    id: 'reel-anestesiologo-main',
    title: 'Reel Conmemorativo: Día del Anestesiólogo 2026 (Oficial)',
    category: 'Reels del Día del Anestesiólogo',
    summary: 'Homenaje audiovisual en alta definición a la excelencia anestesiológica, monitorización avanzada y seguridad del paciente en quirófano.',
    type: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
    date: 'Hoy, 05:00 AM',
    content: 'Producción especial en honor al Día del Anestesiólogo. Destaca los pilares de la anestesiología moderna: precisión hemodinámica, control de vía aérea y liderazgo en reanimación.',
    likes: 156,
    comments: ['¡Excelente homenaje a nuestra especialidad!', 'Feliz día a todos los colegas anestesiólogos.']
  },
  {
    id: 'foto-quirofano-hoy',
    title: 'Registro de Quirófano: Práctica Anestésica y Trabajo en Equipo',
    category: 'Reels del Día del Anestesiólogo',
    summary: 'Fotografía compartida esta mañana por la comunidad médica celebrando la labor diaria en quirófano.',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    date: 'Hoy, 06:30 AM',
    content: 'Momento capturado durante el manejo anestésico matutino en áreas quirúrgicas de alta complejidad.',
    likes: 89,
    comments: ['Gran toma, orgullo de ser anestesiólogo.']
  },
  {
    id: 'vortex-airway-2026',
    title: 'Infografía Interactiva: Algoritmo VORTEX en Vía Aérea Difícil',
    category: 'Vía Aérea',
    summary: 'Guía visual y paso a paso para la gestión estructurada de situaciones de "No Intubación, No Oxigenación".',
    type: 'infographic',
    mediaUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    date: 'Octubre 2026',
    content: 'El enfoque VORTEX simplifica la toma de decisiones críticas priorizando dispositivos supraglóticos y acceso frontal al cuello.',
    likes: 210,
    comments: ['Imprescindible para el carro de vía aérea.']
  },
  {
    id: 'preeclampsia-guia-2026',
    title: 'Guía Clínica: Manejo Anestésico en Preeclampsia Severa',
    category: 'Obstetricia',
    summary: 'Protocolo actualizado sobre analgesia epidural, manejo de presión arterial y prevención de eclampsia en cesárea urgente.',
    type: 'article',
    mediaUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
    date: 'Octubre 2026',
    content: 'Revisión exhaustiva del desbalance angiogénico (sFlt-1/PlGF), líquidos restrictivos y estabilidad hemodinámica maternofetal.',
    likes: 175,
    comments: ['Excelente protocolo para obstetricia.']
  }
];

export const EducationModule: React.FC = () => {
  const [items, setItems] = useState<EducationItem[]>(INITIAL_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedItem, setSelectedItem] = useState<EducationItem | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newComment, setNewComment] = useState('');

  // Form state for uploading new reel/photo
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reels del Día del Anestesiólogo');
  const [summary, setSummary] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  useEffect(() => {
    const cached = localStorage.getItem('anestesiapro_education_full_items');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const newItem: EducationItem = {
      id: 'upload-' + Date.now(),
      title: title.trim(),
      category,
      summary: summary.trim(),
      type: category.includes('Reel') ? 'reel' : 'photo',
      mediaUrl: mediaUrl.trim() || 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80',
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: summary.trim(),
      likes: 1,
      comments: []
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updated));
    setTitle('');
    setSummary('');
    setMediaUrl('');
    setShowUploadModal(false);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i);
    setItems(updated);
    localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updated));
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, likes: selectedItem.likes + 1 });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedItem) return;

    const updatedComments = [...selectedItem.comments, newComment.trim()];
    const updatedItem = { ...selectedItem, comments: updatedComments };
    setSelectedItem(updatedItem);

    const updatedItems = items.map(i => i.id === selectedItem.id ? updatedItem : i);
    setItems(updatedItems);
    localStorage.setItem('anestesiapro_education_full_items', JSON.stringify(updatedItems));
    setNewComment('');
  };

  const categories = ['Todos', 'Reels del Día del Anestesiólogo', 'Obstetricia', 'Vía Aérea', 'Anestesia Regional'];

  const filteredItems = items.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Educación Continua • Edición Especial Día del Anesgiólogo
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            Módulo de Educación Continua y Reels
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Tus fotos y reels subidos hoy a las 5:00 AM / 9:00 AM para el Día del Anestesiólogo, infografías interactivas y guías clínicas basadas en evidencia.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Upload className="w-4 h-4" /> Subir Nueva Foto o Reel
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar reels, fotos, guías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
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
                />
                <div className="absolute top-3 left-3 bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  {item.type === 'reel' ? <Video className="w-3.5 h-3.5 text-indigo-400" /> : <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />}
                  {item.category}
                </div>
              </div>
            )}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {item.date}</span>
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-500/30 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-400" /> {item.likes}
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                <span className="group-hover:underline flex items-center gap-1.5">
                  Ver publicación completa <ExternalLink className="w-3.5 h-3.5" />
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MessageCircle className="w-3.5 h-3.5" /> {item.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative space-y-6 text-white">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Subir Foto o Reel (Día del Anestesiólogo)</h3>
              <p className="text-xs text-slate-400">Comparte tu material con la comunidad médica de AnestesiaPro.</p>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Título de la Publicación *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Celebración Día del Anesgiólogo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option>Reels del Día del Anestesiólogo</option>
                  <option>Obstetricia</option>
                  <option>Vía Aérea</option>
                  <option>Anestesia Regional</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">URL de la Imagen o Reel</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Descripción / Resumen *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detalles sobre el contenido..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-cyan-600/30 transition-all"
              >
                Publicar en Educación Continua
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail & Comments Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                {selectedItem.category}
              </span>
              <h2 className="text-2xl font-bold tracking-tight">{selectedItem.title}</h2>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> {selectedItem.date}
              </div>
            </div>

            {selectedItem.mediaUrl && (
              <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 max-h-[400px] flex items-center justify-center shadow-inner">
                <img src={selectedItem.mediaUrl} alt={selectedItem.title} className="w-full h-full object-contain" />
              </div>
            )}

            <p className="text-slate-300 text-sm leading-relaxed">{selectedItem.summary}</p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Descripción Completa</h4>
              <p className="text-slate-200 text-sm leading-relaxed">{selectedItem.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={(e) => handleLike(selectedItem.id, e)}
                className="flex items-center gap-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 px-4 py-2 rounded-xl border border-rose-500/30 text-xs font-semibold transition-colors"
              >
                <Heart className="w-4 h-4 fill-rose-400" /> {selectedItem.likes} Me gusta
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" /> Comentarios ({selectedItem.comments?.length || 0})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedItem.comments && selectedItem.comments.length > 0 ? (
                  selectedItem.comments.map((c, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl text-xs text-slate-300 border border-slate-800">
                      {c}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic">No hay comentarios aún. ¡Sé el primero en comentar!</div>
                )}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-md"
                >
                  Comentar
                </button>
              </form>
            </div>

            <ResourceShareStrip
              id={selectedItem.id}
              title={selectedItem.title}
              category={selectedItem.category}
              summary={selectedItem.summary}
            />
          </div>
        </div>
      )}
    </div>
  );
};

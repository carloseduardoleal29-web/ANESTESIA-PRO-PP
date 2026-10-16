import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Video, FileText, Download, ExternalLink, Calendar, Filter, Sparkles, X, CheckCircle2, Upload, Plus, Heart, MessageCircle, Share2, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { EducationResource } from '../types';
import { ResourceShareStrip } from './education/ResourceShareStrip';

interface EducationModuleProps {
  initialResourceId?: string | null;
  onClearInitialResource?: () => void;
}

const INITIAL_RESOURCES: Omit<EducationResource, 'id'>[] = [
  {
    title: 'Reel Conmemorativo y Homenaje: Día del Anestesiólogo 2026',
    category: 'Reels e Imágenes',
    summary: 'Producción audiovisual exclusiva celebrando el Día del Anestesiólogo, seguridad en quirófano y avances en farmacología clínica.',
    type: 'video',
    date: 'Octubre 2026',
    videoUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    content: 'Este reel conmemora la labor fundamental de los especialistas en anestesiología y reanimación.'
  },
  {
    title: 'Fisiopatología Avanzada de la Preeclampsia y Manejo Anestésico',
    category: 'Obstetricia',
    summary: 'Análisis profundo sobre el desbalance sFlt-1/PlGF, disfunción endotelial y guías anestésicas para cesárea en pacientes con trastornos hipertensivos.',
    type: 'article',
    date: 'Octubre 2026',
    content: 'Guía detallada sobre el abordaje hemodinámico, prevención de eclampsia y manejo del espasmo vascular durante la anestesia obstétrica.'
  },
  {
    title: 'Algoritmo VORTEX y Enfoque No Quirúrgico en Vía Aérea Difícil',
    category: 'Vía Aérea',
    summary: 'Infografía interactiva y protocolo paso a paso para la resolución rápida de situaciones de "No Intubación, No Oxigenación".',
    type: 'infographic',
    date: 'Octubre 2026',
    content: 'El enfoque VORTEX prioriza la optimización de las vías supraglóticas y el acceso frontal al cuello de forma estructurada y sin demoras.'
  },
  {
    title: 'Bloqueo PENG y Fascia Ilíaca para Cirugía de Cadera',
    category: 'Anestesia Regional',
    summary: 'Técnica ecoguiada avanzada para analgesia postoperatoria en fracturas de cadera preservando la función motora del cuádriceps.',
    type: 'guide',
    date: 'Septiembre 2026',
    content: 'Descripción anatómica precisa de los planos fasciales entre el psoas y la rama iliopúbica para la infiltración de anestésico local.'
  }
];

export const EducationModule: React.FC<EducationModuleProps> = ({
  initialResourceId,
  onClearInitialResource
}) => {
  const [resources, setResources] = useState<EducationResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedResource, setSelectedResource] = useState<EducationResource | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New resource form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Reels e Imágenes');
  const [summary, setSummary] = useState('');
  const [type, setType] = useState('article');
  const [content, setContent] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'education_resources'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list: EducationResource[] = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() } as EducationResource);
      });

      if (list.length === 0) {
        // Seed initial items if empty
        try {
          for (const item of INITIAL_RESOURCES) {
            await addDoc(collection(db, 'education_resources'), item);
          }
        } catch (err) {
          console.error('Error seeding initial education resources:', err);
        }
      } else {
        setResources(list);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'education_resources');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (initialResourceId && resources.length > 0) {
      const found = resources.find(r => r.id === initialResourceId);
      if (found) {
        setSelectedResource(found);
      }
    }
  }, [initialResourceId, resources]);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    try {
      await addDoc(collection(db, 'education_resources'), {
        title: title.trim(),
        category,
        summary: summary.trim(),
        type,
        date: 'Octubre 2026',
        content: content.trim() || summary.trim()
      });
      setTitle('');
      setSummary('');
      setContent('');
      setShowAddModal(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'education_resources');
    }
  };

  const categories = ['Todos', 'Reels e Imágenes', 'Obstetricia', 'Vía Aérea', 'Anestesia Regional'];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || res.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Educación Continua (Sincronizada en la Nube)
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Educación Continua y Reels del Día del Anestesiólogo
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            Repositorio clínico oficial en tiempo real con reels conmemorativos, fotos, guías y protocolos avanzados.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-cyan-600/30 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" /> Subir Nuevo Recurso / Reel
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-lg">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar guías, reels, fotos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-cyan-400" /> Sincronizando recursos y reels desde Firestore...
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
          No se encontraron recursos en esta categoría.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <div
              key={resource.id}
              onClick={() => setSelectedResource(resource)}
              className="group bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl cursor-pointer transition-all transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="bg-indigo-950 border border-indigo-500/30 text-indigo-300 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {resource.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {resource.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-3 leading-relaxed">
                  {resource.summary}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400">
                <span className="flex items-center gap-1.5 font-medium group-hover:underline">
                  {resource.type === 'video' ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  {resource.type === 'video' ? 'Ver Reel / Homenaje' : 'Leer Guía Completa'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-5 text-white">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold">Subir Recurso o Reel (Día del Anestesiólogo)</h3>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300">Título *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Reel conmemorativo..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                  >
                    <option>Reels e Imágenes</option>
                    <option>Obstetricia</option>
                    <option>Vía Aérea</option>
                    <option>Anestesia Regional</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300">Tipo</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                  >
                    <option value="video">Video / Reel</option>
                    <option value="article">Artículo / Guía</option>
                    <option value="infographic">Infografía</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-300">Resumen *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Breve descripción..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white mt-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-cyan-600/30 transition-all"
              >
                Guardar y Sincronizar en la Nube
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setSelectedResource(null);
                if (onClearInitialResource) onClearInitialResource();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="space-y-2">
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-md text-xs font-semibold">
                {selectedResource.category}
              </span>
              <h2 className="text-2xl font-bold">{selectedResource.title}</h2>
              <div className="text-xs text-slate-400">{selectedResource.date}</div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{selectedResource.summary}</p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-slate-200 text-sm leading-relaxed">{selectedResource.content}</p>
            </div>
            <ResourceShareStrip
              id={selectedResource.id}
              title={selectedResource.title}
              category={selectedResource.category}
              summary={selectedResource.summary}
            />
          </div>
        </div>
      )}
    </div>
  );
};

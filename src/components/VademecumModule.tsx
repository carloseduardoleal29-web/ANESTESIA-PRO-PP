import React, { useState } from 'react';
import { VADEMECUM_DRUGS } from '../data/vademecumData';
import { BookOpen, Search, Filter, ChevronDown, ChevronUp, ShieldAlert, Sparkles, Bookmark } from 'lucide-react';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

export const VademecumModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedId, setExpandedId] = useState<string | null>('propofol');

  // Dynamically extract and clinically sort categories from VADEMECUM_DRUGS
  const allCatSet = new Set<string>();
  VADEMECUM_DRUGS.forEach((d) => {
    if (d.categoria) allCatSet.add(d.categoria);
    if (d.categoriaSecundaria) allCatSet.add(d.categoriaSecundaria);
  });

  const CLINICAL_CATEGORY_ORDER = [
    'Reversores Farmacológicos',
    'Hipnóticos e Intravenosos',
    'Opioides',
    'Bloqueantes Neuromusculares',
    'Anestésicos Locales',
    'Emergencias Anestesiológicas',
    'Esteroides',
    'Antiinflamatorios No Esteroideos (AINEs)',
    'Inotrópicos y Vasopresores'
  ];

  const rawCategories = Array.from(allCatSet).sort((a, b) => {
    const idxA = CLINICAL_CATEGORY_ORDER.indexOf(a);
    const idxB = CLINICAL_CATEGORY_ORDER.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.localeCompare(b);
  });
  const categories = ['Todas', ...rawCategories];

  const filteredDrugs = VADEMECUM_DRUGS.filter((drug) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      drug.nombre.toLowerCase().includes(term) ||
      drug.mecanismo.toLowerCase().includes(term) ||
      drug.perlaClinica.toLowerCase().includes(term) ||
      drug.clasificacion.toLowerCase().includes(term);
    const matchesCategory =
      selectedCategory === 'Todas' ||
      drug.categoria === selectedCategory ||
      drug.categoriaSecundaria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDrugCountForCategory = (cat: string) => {
    if (cat === 'Todas') return VADEMECUM_DRUGS.length;
    return VADEMECUM_DRUGS.filter(
      (d) => d.categoria === cat || d.categoriaSecundaria === cat
    ).length;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Vademécum Farmacológico</h2>
            <p className="text-xs text-slate-400">
              Diccionario académico completo con farmacodinamia, dosis, perlas clínicas y emergencias
            </p>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Vademécum Farmacológico de Anestesiología"
        description="Guía farmacológica completa de bolsillo: dosis clínicas, farmacodinamia, reversores específicos (Sugammadex, Neostigmina, Naloxona), anestésicos locales con dosis tóxicas y perlas para quirófano."
        shareText="📚 Colega, te recomiendo revisar el Vademécum Farmacológico de Anestesiología en AnestesiaPro: dosis exactas, farmacodinamia, reversores específicos, límites tóxicos y perlas clínicas en quirófano:"
        tabParam="vademecum"
        theme="cyan"
      />

      {/* Search and Category Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar fármaco, mecanismo o perla clínica..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none w-full sm:w-auto font-medium"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({getDrugCountForCategory(cat)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Category Chips - Wrapping layout to guarantee all families are visible */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">
            Familias Farmacológicas ({rawCategories.length}):
          </span>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = getDrugCountForCategory(cat);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md border border-cyan-400/30 ring-1 ring-cyan-400/50 scale-[1.02]'
                      : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/90 border border-slate-700/60'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${
                      isSelected
                        ? 'bg-slate-950/80 text-cyan-200'
                        : 'bg-slate-900/80 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Category Summary Bar */}
      {selectedCategory !== 'Todas' && (
        <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-200 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>
              Filtrado por: <strong className="text-white underline decoration-cyan-400/50">{selectedCategory}</strong> ({filteredDrugs.length} fármacos)
            </span>
          </div>
          <button
            onClick={() => setSelectedCategory('Todas')}
            className="text-[11px] font-extrabold text-cyan-400 hover:text-cyan-300 underline bg-cyan-900/40 px-2.5 py-1 rounded-lg border border-cyan-700/50"
          >
            Ver todas las familias ({VADEMECUM_DRUGS.length})
          </button>
        </div>
      )}

      {/* Drug Cards List */}
      <div className="space-y-3">
        {filteredDrugs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No se encontraron fármacos que coincidan con la búsqueda.
          </div>
        ) : (
          filteredDrugs.map((drug) => {
            const isExpanded = expandedId === drug.id;
            return (
              <div
                key={drug.id}
                className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-900 border-indigo-500/60 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : drug.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-white">{drug.nombre}</h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          drug.categoria === 'Reversores Farmacológicos'
                            ? 'bg-amber-950/90 text-amber-300 border-amber-600/60 shadow-sm'
                            : 'bg-indigo-950 text-indigo-300 border-indigo-800/60'
                        }`}
                      >
                        {drug.categoria === 'Reversores Farmacológicos' ? '🔄 Reversor / Antídoto' : drug.categoria}
                      </span>
                      {drug.categoriaSecundaria && (
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700/80">
                          {drug.categoriaSecundaria}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{drug.clasificacion}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs leading-relaxed">
                    {/* Clasificación */}
                    <div>
                      <strong className="text-cyan-300 block mb-0.5 font-bold">🧬 Clasificación Farmacológica:</strong>
                      <p className="text-slate-300">{drug.clasificacion}</p>
                    </div>

                    {/* Mecanismo */}
                    <div>
                      <strong className="text-cyan-300 block mb-0.5 font-bold">🎯 Mecanismo de Acción Detallado:</strong>
                      <p className="text-slate-300 leading-relaxed">{drug.mecanismo}</p>
                    </div>

                    {/* Farmacocinética */}
                    {drug.farmacocinetica && (
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1.5 text-slate-200">
                        <strong className="text-cyan-400 block font-black text-[11px] mb-1">
                          ⏱️ Perfil Farmacocinético:
                        </strong>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-slate-400 font-semibold">Inicio de Acción:</span>{' '}
                            <span className="text-white font-medium">{drug.farmacocinetica.inicio}</span>
                          </div>
                          {drug.farmacocinetica.pico && (
                            <div>
                              <span className="text-slate-400 font-semibold">Efecto Pico:</span>{' '}
                              <span className="text-white font-medium">{drug.farmacocinetica.pico}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-slate-400 font-semibold">Duración de Efecto:</span>{' '}
                            <span className="text-white font-medium">{drug.farmacocinetica.duracion}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold">Metabolismo / Aclaramiento:</span>{' '}
                            <span className="text-white font-medium">{drug.farmacocinetica.metabolismo}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Esquemas de Dosis Múltiples */}
                    {drug.esquemasDosis && drug.esquemasDosis.length > 0 && (
                      <div className="space-y-2">
                        <strong className="text-indigo-300 block font-black text-xs">
                          💉 Esquemas de Dosificación por Indicación Clínica:
                        </strong>
                        <div className="grid grid-cols-1 gap-2">
                          {drug.esquemasDosis.map((esquema, idx) => (
                            <div
                              key={idx}
                              className="bg-indigo-950/40 border border-indigo-800/50 p-3 rounded-xl space-y-1 hover:border-indigo-600/60 transition-colors"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <span className="font-extrabold text-indigo-200 text-xs">
                                  • {esquema.indicacion}
                                </span>
                                {esquema.via && (
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-900/90 text-indigo-300 border border-indigo-700/60">
                                    Vía {esquema.via}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm font-black text-cyan-300 font-mono">
                                {esquema.dosis}
                              </div>
                              {esquema.notas && (
                                <p className="text-[11px] text-slate-300 italic">
                                  {esquema.notas}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Efectos en Sistemas Orgánicos */}
                    {drug.efectosOrganicos && (
                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-[11px]">
                        <strong className="text-cyan-400 block font-black mb-1">
                          🫀 Efectos sobre Sistemas Orgánicos:
                        </strong>
                        {drug.efectosOrganicos.cardiovascular && (
                          <p className="text-slate-300">
                            <strong className="text-rose-300">Cardiovascular:</strong> {drug.efectosOrganicos.cardiovascular}
                          </p>
                        )}
                        {drug.efectosOrganicos.respiratorio && (
                          <p className="text-slate-300">
                            <strong className="text-blue-300">Respiratorio:</strong> {drug.efectosOrganicos.respiratorio}
                          </p>
                        )}
                        {drug.efectosOrganicos.snc && (
                          <p className="text-slate-300">
                            <strong className="text-purple-300">SNC / Neuro:</strong> {drug.efectosOrganicos.snc}
                          </p>
                        )}
                        {drug.efectosOrganicos.otros && (
                          <p className="text-slate-300">
                            <strong className="text-emerald-300">Otros Órganos:</strong> {drug.efectosOrganicos.otros}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Perla Clínica */}
                    <div className="bg-indigo-950/50 border-l-4 border-indigo-500 p-3 rounded-r-xl text-indigo-100">
                      <strong className="text-cyan-300 flex items-center gap-1.5 mb-1 font-extrabold">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> Perla Clínica Fundamental
                      </strong>
                      <p className="text-slate-200">{drug.perlaClinica}</p>
                    </div>

                    {/* Precaución */}
                    {drug.precaucion && (
                      <div className="bg-rose-950/40 border-l-4 border-rose-500 p-3 rounded-r-xl text-rose-200">
                        <strong className="text-rose-300 flex items-center gap-1.5 mb-1 font-extrabold">
                          <ShieldAlert className="w-4 h-4 text-rose-400" /> Precaución Especial & Toxicidad
                        </strong>
                        <p>{drug.precaucion}</p>
                      </div>
                    )}

                    {/* Bibliografía */}
                    {drug.bibliografia && (
                      <div className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-800/60">
                        📚 Referencias Académicas: {drug.bibliografia}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

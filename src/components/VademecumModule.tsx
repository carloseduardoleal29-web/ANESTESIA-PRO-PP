import React, { useState, useRef, useEffect, useMemo } from 'react';
import { VADEMECUM_DRUGS, VademecumDrug } from '../data/vademecumData';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  Sparkles, 
  X, 
  ArrowRight, 
  Zap, 
  AlertTriangle, 
  Pill, 
  Activity, 
  CheckCircle2,
  Stethoscope,
  Bell
} from 'lucide-react';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';
import { broadcastPushNotification } from '../lib/pushNotificationService';

interface AutocompleteItem {
  id: string;
  type: 'drug' | 'group' | 'indication';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  targetDrugId?: string;
  targetCategory?: string;
  targetSearchTerm?: string;
}

export const VademecumModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [expandedId, setExpandedId] = useState<string | null>('propofol');
  const [highlightedDrugId, setHighlightedDrugId] = useState<string | null>(null);

  // Autocomplete state
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Extract all clinical indications across all drugs
  const allClinicalIndications = useMemo(() => {
    const map = new Map<string, string[]>(); // indication -> list of drug names
    VADEMECUM_DRUGS.forEach((drug) => {
      drug.esquemasDosis?.forEach((esquema) => {
        if (!esquema.indicacion) return;
        const ind = esquema.indicacion.trim();
        const existing = map.get(ind) || [];
        if (!existing.includes(drug.nombre)) {
          existing.push(drug.nombre);
          map.set(ind, existing);
        }
      });
    });
    return Array.from(map.entries()).map(([indication, drugs]) => ({
      indication,
      drugs
    }));
  }, []);

  // Filtered drugs based on search term (covers generic name, therapeutic group, specific indication, mechanism, and pearls)
  const filteredDrugs = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return VADEMECUM_DRUGS.filter((drug) => {
      const matchesSearch =
        !term ||
        drug.nombre.toLowerCase().includes(term) ||
        drug.clasificacion.toLowerCase().includes(term) ||
        drug.categoria.toLowerCase().includes(term) ||
        (drug.categoriaSecundaria && drug.categoriaSecundaria.toLowerCase().includes(term)) ||
        drug.mecanismo.toLowerCase().includes(term) ||
        drug.perlaClinica.toLowerCase().includes(term) ||
        (drug.precaucion && drug.precaucion.toLowerCase().includes(term)) ||
        (drug.esquemasDosis &&
          drug.esquemasDosis.some(
            (e) =>
              e.indicacion.toLowerCase().includes(term) ||
              e.dosis.toLowerCase().includes(term) ||
              (e.notas && e.notas.toLowerCase().includes(term))
          ));

      const matchesCategory =
        selectedCategory === 'Todas' ||
        drug.categoria === selectedCategory ||
        drug.categoriaSecundaria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Generate autocomplete suggestions based on current search term
  const autocompleteSuggestions = useMemo<AutocompleteItem[]>(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term || term.length < 1) return [];

    const items: AutocompleteItem[] = [];

    // 1. Matching Drugs by generic or brand name
    VADEMECUM_DRUGS.forEach((drug) => {
      const nameMatch = drug.nombre.toLowerCase().includes(term);
      const classMatch = drug.clasificacion.toLowerCase().includes(term);
      if (nameMatch || classMatch) {
        items.push({
          id: `drug-${drug.id}`,
          type: 'drug',
          title: drug.nombre,
          subtitle: drug.clasificacion,
          badge: 'Fármaco',
          badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60',
          targetDrugId: drug.id,
          targetSearchTerm: drug.nombre
        });
      }
    });

    // 2. Matching Therapeutic Groups
    categories.forEach((cat) => {
      if (cat === 'Todas') return;
      if (cat.toLowerCase().includes(term)) {
        const count = VADEMECUM_DRUGS.filter(
          (d) => d.categoria === cat || d.categoriaSecundaria === cat
        ).length;
        items.push({
          id: `group-${cat}`,
          type: 'group',
          title: cat,
          subtitle: `Grupo terapéutico (${count} fármacos)`,
          badge: 'Grupo Terapéutico',
          badgeColor: 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60',
          targetCategory: cat,
          targetSearchTerm: ''
        });
      }
    });

    // 3. Matching Specific Clinical Indications
    allClinicalIndications.forEach(({ indication, drugs }) => {
      if (indication.toLowerCase().includes(term)) {
        items.push({
          id: `ind-${indication}`,
          type: 'indication',
          title: indication,
          subtitle: `Indicación específica • Presente en: ${drugs.slice(0, 3).join(', ')}${drugs.length > 3 ? '...' : ''}`,
          badge: 'Indicación Clínica',
          badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60',
          targetSearchTerm: indication
        });
      }
    });

    return items.slice(0, 10);
  }, [searchTerm, categories, allClinicalIndications]);

  // Click outside to dismiss autocomplete
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation in autocomplete
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isAutocompleteOpen || autocompleteSuggestions.length === 0) {
      if (e.key === 'ArrowDown' && autocompleteSuggestions.length > 0) {
        setIsAutocompleteOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < autocompleteSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : autocompleteSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < autocompleteSuggestions.length) {
        handleSelectSuggestion(autocompleteSuggestions[highlightedIndex]);
      } else if (autocompleteSuggestions.length > 0) {
        handleSelectSuggestion(autocompleteSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsAutocompleteOpen(false);
    }
  };

  // Select an autocomplete item
  const handleSelectSuggestion = (item: AutocompleteItem) => {
    setIsAutocompleteOpen(false);
    setHighlightedIndex(-1);

    if (item.type === 'drug' && item.targetDrugId) {
      setSearchTerm(item.targetSearchTerm || '');
      setSelectedCategory('Todas');
      setExpandedId(item.targetDrugId);
      setHighlightedDrugId(item.targetDrugId);

      setTimeout(() => {
        const el = document.getElementById(`drug-${item.targetDrugId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      setTimeout(() => {
        setHighlightedDrugId(null);
      }, 3500);
    } else if (item.type === 'group' && item.targetCategory) {
      setSelectedCategory(item.targetCategory);
      setSearchTerm('');
    } else if (item.type === 'indication' && item.targetSearchTerm) {
      setSearchTerm(item.targetSearchTerm);
      setSelectedCategory('Todas');
    }
  };

  // Fast Emergency Shortcuts for Critical Environments
  const CRITICAL_SHORTCUTS = [
    { label: 'Reversores / Antídotos', icon: Zap, query: 'Reversor', category: 'Reversores Farmacológicos', color: 'from-amber-600 to-amber-700' },
    { label: 'Emergencias / RCP', icon: AlertTriangle, query: 'Emergencia', category: 'Emergencias Anestesiológicas', color: 'from-rose-600 to-red-700' },
    { label: 'Secuencia Rápida (ISR)', icon: Activity, query: 'Secuencia de Intubación Rápida', category: 'Todas', color: 'from-cyan-600 to-blue-700' },
    { label: 'Toxicidad LAST', icon: ShieldAlert, query: 'LAST', category: 'Todas', color: 'from-purple-600 to-indigo-700' },
    { label: 'Vasopresores', icon: Stethoscope, query: 'Vasopresor', category: 'Inotrópicos y Vasopresores', color: 'from-emerald-600 to-teal-700' },
    { label: 'Hipnóticos / TIVA', icon: Pill, query: 'TIVA', category: 'Hipnóticos e Intravenosos', color: 'from-blue-600 to-indigo-800' }
  ];

  const handleApplyShortcut = (shortcut: typeof CRITICAL_SHORTCUTS[0]) => {
    setSearchTerm(shortcut.query);
    setSelectedCategory(shortcut.category);
    setIsAutocompleteOpen(false);
  };

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
            <h2 className="text-xl font-black text-white">Vademécum Farmacológico de Anestesiología</h2>
            <p className="text-xs text-slate-400">
              Diccionario clínico de alta precisión con farmacodinamia, dosis por indicación, reversores y alertas de toxicidad
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

      {/* ACCESOS RÁPIDOS EN ENTORNO CRÍTICO (QUICK ACTIONS) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Accesos Rápidos en Entorno Crítico (Quirófano / UCI / Urgencias):
          </span>
          {(searchTerm || selectedCategory !== 'Todas') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Restablecer Filtros
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {CRITICAL_SHORTCUTS.map((s) => {
            const isActive = searchTerm === s.query && (s.category === 'Todas' || selectedCategory === s.category);
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => handleApplyShortcut(s)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-sm border ${
                  isActive
                    ? `bg-gradient-to-r ${s.color} text-white border-white/30 ring-2 ring-cyan-400/60 scale-[1.02]`
                    : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border-slate-700/70 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA INTELIGENTE CON AUTOCOMPLETADO */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3 relative z-30">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Input con Autocompletado */}
          <div className="relative flex-1" ref={searchContainerRef}>
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar por fármaco, grupo terapéutico o indicación (ej: Sugammadex, ISR, LAST, TIVA)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsAutocompleteOpen(true);
                setHighlightedIndex(-1);
              }}
              onFocus={() => {
                if (searchTerm.trim().length >= 1) {
                  setIsAutocompleteOpen(true);
                }
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-800/95 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:outline-none transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setIsAutocompleteOpen(false);
                  inputRef.current?.focus();
                }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white p-0.5 rounded-md hover:bg-slate-700 transition-colors"
                title="Limpiar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* DROPDOWN AUTOCOMPLETADO CLÍNICO */}
            {isAutocompleteOpen && autocompleteSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
                <div className="px-3 py-1.5 bg-slate-950/70 flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span>Sugerencias Clínicas ({autocompleteSuggestions.length})</span>
                  <span>Usa ↑ ↓ y Enter para elegir</span>
                </div>
                {autocompleteSuggestions.map((item, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isHighlighted
                          ? 'bg-cyan-950/70 border-l-4 border-cyan-400'
                          : 'hover:bg-slate-800/70'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs text-white truncate">
                            {item.title}
                          </span>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selector de Categoría / Familia */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none w-full sm:w-auto font-medium cursor-pointer"
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
                  className={`px-3 py-1.5 rounded-xl font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
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

      {/* Resumen del Filtro Activo */}
      {(selectedCategory !== 'Todas' || searchTerm) && (
        <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-cyan-200 font-bold flex-wrap">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>
              Resultados: <strong className="text-white underline decoration-cyan-400/50">{filteredDrugs.length} fármacos encontrados</strong>
              {selectedCategory !== 'Todas' && <span> en familia <em>{selectedCategory}</em></span>}
              {searchTerm && <span> con criterio <em>"{searchTerm}"</em></span>}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSearchTerm('');
            }}
            className="text-[11px] font-extrabold text-cyan-400 hover:text-cyan-300 underline bg-cyan-900/40 px-2.5 py-1 rounded-lg border border-cyan-700/50 cursor-pointer"
          >
            Ver todo el vademécum ({VADEMECUM_DRUGS.length})
          </button>
        </div>
      )}

      {/* Drug Cards List */}
      <div className="space-y-3">
        {filteredDrugs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs space-y-3">
            <p className="text-sm font-bold text-slate-300">
              No se encontraron fármacos que coincidan con "{searchTerm}".
            </p>
            <p className="text-slate-500">
              Prueba buscando por nombre genérico (ej. Rocuronio), grupo terapéutico (ej. Opioides) o indicación clínica (ej. Inducción, ISR, Reversión).
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('Todas');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 text-xs font-black border border-cyan-600/50 cursor-pointer transition-all"
            >
              Restablecer Diccionario
            </button>
          </div>
        ) : (
          filteredDrugs.map((drug) => {
            const isExpanded = expandedId === drug.id;
            const isHighlighted = highlightedDrugId === drug.id;

            return (
              <div
                key={drug.id}
                id={`drug-${drug.id}`}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isHighlighted
                    ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/30 bg-slate-900 border-cyan-400'
                    : isExpanded
                    ? 'bg-slate-900 border-indigo-500/60 shadow-xl'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : drug.id)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 cursor-pointer"
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
                      {isHighlighted && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 animate-pulse">
                          ✓ Seleccionado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{drug.clasificacion}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        broadcastPushNotification({
                          title: `💊 Fármaco: ${drug.nombre}`,
                          message: `Guía y esquemas de dosis para ${drug.nombre} (${drug.clasificacion}) disponibles en Vademécum AnestesiaPro.`,
                          category: 'FARMACOLOGÍA CLÍNICA'
                        }).then((res) => {
                          alert(res.message || 'Notificación push enviada exitosamente');
                        }).catch(() => {
                          alert('Error al enviar la notificación push.');
                        });
                      }}
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm transition-transform active:scale-95 border border-amber-500/60"
                      title="Enviar notificación push sobre este fármaco a todos los celulares"
                    >
                      <Bell className="w-3 h-3 text-slate-950 fill-current animate-bounce" />
                      <span>📲 Push</span>
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs leading-relaxed animate-in fade-in duration-200">
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

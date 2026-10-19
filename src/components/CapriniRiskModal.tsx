import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, Check, X, Info, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, Activity, HelpCircle 
} from 'lucide-react';
import { 
  CAPRINI_FACTORS, 
  CapriniItem, 
  evaluateCapriniScore, 
  CapriniAssessmentResult 
} from '../data/preanesthesiaCatalog';

interface CapriniRiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore?: number;
  currentSelectedItems?: string[];
  onApply: (score: number, result: CapriniAssessmentResult, selectedIds: string[]) => void;
  onApplyToPlan?: (prophylaxisText: string) => void;
  patientAge?: string;
  patientWeight?: string;
  patientSurgery?: string;
}

export const CapriniRiskModal: React.FC<CapriniRiskModalProps> = ({
  isOpen,
  onClose,
  currentScore = 0,
  currentSelectedItems = [],
  onApply,
  onApplyToPlan,
  patientAge = '',
  patientWeight = '',
  patientSurgery = ''
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(currentSelectedItems);
  const [activeCategory, setActiveCategory] = useState<'all' | '1_punto' | '2_puntos' | '3_puntos' | '5_puntos'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Auto-detect suggestions based on patient data (e.g. Age or Weight)
  const autoSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    const ageNum = parseInt(patientAge.replace(/\D/g, ''), 10);
    if (!isNaN(ageNum)) {
      if (ageNum >= 41 && ageNum <= 60) suggestions.push('age_41_60');
      else if (ageNum >= 61 && ageNum <= 74) suggestions.push('age_61_74');
      else if (ageNum >= 75) suggestions.push('age_ge_75');
    }

    const weightNum = parseFloat(patientWeight.replace(',', '.'));
    if (!isNaN(weightNum) && weightNum > 85) {
      // Suggest checking BMI
      suggestions.push('overweight_bmi');
    }

    const surgLower = patientSurgery.toLowerCase();
    if (surgLower.includes('cadera') || surgLower.includes('rodilla') || surgLower.includes('artroplastia') || surgLower.includes('fractura')) {
      suggestions.push('major_ortho_surg');
    } else if (surgLower.includes('laparo') || surgLower.includes('abdomin') || surgLower.includes('histerect') || surgLower.includes('onco') || surgLower.includes('mayor')) {
      suggestions.push('major_surg_45m');
    }

    return suggestions;
  }, [patientAge, patientWeight, patientSurgery]);

  // Calculate total score from selected items
  const totalScore = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const factor = CAPRINI_FACTORS.find(f => f.id === id);
      return sum + (factor ? factor.points : 0);
    }, 0);
  }, [selectedIds]);

  const assessment = useMemo(() => {
    return evaluateCapriniScore(totalScore);
  }, [totalScore]);

  if (!isOpen) return null;

  const toggleItem = (id: string) => {
    setSelectedIds(prev => {
      // Handle age mutual exclusion
      const isAge = id.startsWith('age_');
      let next = isAge ? prev.filter(item => !item.startsWith('age_')) : [...prev];
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...next, id];
      }
    });
  };

  const handleSelectPreset = (presetScore: number) => {
    if (presetScore === 0) {
      setSelectedIds([]);
    } else if (presetScore === 2) {
      setSelectedIds(['age_41_60', 'minor_surg']);
    } else if (presetScore === 4) {
      setSelectedIds(['age_41_60', 'major_surg_45m', 'overweight_bmi']);
    } else if (presetScore === 6) {
      setSelectedIds(['age_61_74', 'major_surg_45m', 'active_malignancy']);
    } else if (presetScore === 9) {
      setSelectedIds(['major_ortho_surg', 'age_61_74', 'history_vte_pe']);
    }
  };

  const applySuggestions = () => {
    setSelectedIds(prev => {
      const merged = new Set([...prev, ...autoSuggestions]);
      return Array.from(merged);
    });
  };

  const filteredFactors = CAPRINI_FACTORS.filter(f => {
    const matchesCat = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = !searchTerm || f.label.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getBadgeColor = (points: number) => {
    switch (points) {
      case 1: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 2: return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 3: return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 5: return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  const getCardHeaderColor = () => {
    switch (assessment.level) {
      case 'very_low': return 'from-emerald-950/60 to-emerald-900/40 border-emerald-500/40 text-emerald-400';
      case 'low': return 'from-cyan-950/60 to-cyan-900/40 border-cyan-500/40 text-cyan-400';
      case 'moderate': return 'from-amber-950/60 to-amber-900/40 border-amber-500/40 text-amber-400';
      case 'high': return 'from-orange-950/60 to-orange-900/40 border-orange-500/40 text-orange-400';
      case 'very_high': return 'from-rose-950/60 to-rose-900/40 border-rose-500/40 text-rose-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/20 rounded-xl text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Escala de Caprini: Riesgo de Tromboembolia Venosa (TEV)
                <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-full">
                  Guía Quirúrgica
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Estratificación de riesgo de Trombosis Venosa Profunda (TVP) y Embolia Pulmonar (TEP)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Score & Recommendation Banner */}
        <div className={`p-4 border-b bg-gradient-to-r ${getCardHeaderColor()}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black">{totalScore} PUNTOS</span>
                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-black/40 border border-white/20">
                  {assessment.categoryTitle}
                </span>
                <span className="text-xs opacity-90 font-semibold">
                  ({assessment.incidenceText})
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">
                <strong className="text-white">Profilaxis recomendada:</strong> {assessment.profilaxisText}
              </p>
            </div>

            {onApplyToPlan && (
              <button
                type="button"
                onClick={() => onApplyToPlan(`• Tromboprofilaxis Caprini (${totalScore} pts - ${assessment.categoryTitle}): ${assessment.profilaxisDrug}.`)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/30 transition-all cursor-pointer shadow-sm"
                title="Añadir recomendación de tromboprofilaxis a las prescripciones"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Agregar al Plan Anestésico</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets & Search */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-bold">Nivel rápido:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset(0)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-emerald-300 border border-slate-700 cursor-pointer"
              >
                0 Muy Bajo
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(2)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-cyan-300 border border-slate-700 cursor-pointer"
              >
                1-2 Bajo
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(4)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 border border-slate-700 cursor-pointer"
              >
                3-4 Moderado
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(6)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-orange-300 border border-slate-700 cursor-pointer"
              >
                5-8 Alto
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(9)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-rose-300 border border-slate-700 cursor-pointer"
              >
                ≥9 Muy Alto
              </button>
            </div>

            {autoSuggestions.length > 0 && (
              <button
                type="button"
                onClick={applySuggestions}
                className="flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200 font-bold px-2 py-0.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 cursor-pointer transition-all"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Sugerencias por edad/cirugía ({autoSuggestions.length})
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Todos ({CAPRINI_FACTORS.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('1_punto')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === '1_punto' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
                }`}
              >
                +1 Pto
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('2_puntos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === '2_puntos' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                +2 Pts
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('3_puntos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === '3_puntos' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-orange-300 hover:bg-slate-700'
                }`}
              >
                +3 Pts
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('5_puntos')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === '5_puntos' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                }`}
              >
                +5 Pts
              </button>
            </div>

            <div className="w-full sm:flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar factor de riesgo (ej. cáncer, várices, edad, cadera)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Factor Checklist */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]">
          {filteredFactors.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No se encontraron factores con ese término de búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {filteredFactors.map(factor => {
                const isSelected = selectedIds.includes(factor.id);
                return (
                  <button
                    key={factor.id}
                    type="button"
                    onClick={() => toggleItem(factor.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border-cyan-400 shadow-sm'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-black'
                        : 'border-slate-600 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-semibold ${isSelected ? 'text-white font-bold' : 'text-slate-200'}`}>
                          {factor.label}
                        </span>
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded border shrink-0 ${getBadgeColor(factor.points)}`}>
                          +{factor.points} {factor.points === 1 ? 'pto' : 'pts'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Factores marcados: <strong className="text-white">{selectedIds.length}</strong></span>
            <span>•</span>
            <span>Total: <strong className="text-cyan-400">{totalScore} puntos</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
            >
              Restablecer
            </button>
            <button
              type="button"
              onClick={() => {
                onApply(totalScore, assessment, selectedIds);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Aplicar a Evaluación ({totalScore} pts)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

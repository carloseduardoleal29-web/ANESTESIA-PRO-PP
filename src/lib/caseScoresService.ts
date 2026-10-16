export interface ResidentScoreRecord {
  id: string;
  residentName: string;
  caseId: string;
  caseCode: string;
  category: string;
  scorePercent: number;
  correctCount: number;
  totalQuestions: number;
  date: string;
  timestamp: number;
  feedbackLevel: 'Excelente (Experto)' | 'Aprobado (Competente)' | 'Requiere Refuerzo';
}

const SCORES_STORAGE_KEY = 'anestesiapro_resident_scores';

export function getStoredResidentScores(): ResidentScoreRecord[] {
  try {
    const raw = localStorage.getItem(SCORES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading resident scores:', e);
  }
  return [];
}

export function saveResidentScore(score: Omit<ResidentScoreRecord, 'id' | 'timestamp' | 'date'>): ResidentScoreRecord {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const newRecord: ResidentScoreRecord = {
    ...score,
    id: `eval-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    date: dateFormatted
  };

  try {
    const existing = getStoredResidentScores();
    const updated = [newRecord, ...existing].slice(0, 100); // keep up to 100
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_resident_score_added', { detail: newRecord }));
    }
  } catch (e) {
    console.error('Error saving resident score:', e);
  }

  return newRecord;
}

export function clearResidentScores(): void {
  try {
    localStorage.removeItem(SCORES_STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('anestesiapro_resident_scores_cleared'));
    }
  } catch (e) {
    console.error('Error clearing resident scores:', e);
  }
}

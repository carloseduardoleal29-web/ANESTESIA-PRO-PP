export interface PatientProfile {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  gender: 'male' | 'female';
  asaClass?: number;
}

export interface TivaDrugConfig {
  id: string;
  name: string;
  category: 'hypnotic' | 'opioid' | 'adjuvant' | 'sedative';
  model: string;
  targetCeUnit: string;
  defaultTargetCe: number;
  minCe: number;
  maxCe: number;
  concentrationMgMl: number;
  description: string;
  clinicalNotes: string;
}

export interface VasoactiveDrugPreset {
  id: string;
  name: string;
  category: 'vasopressor' | 'inotrope' | 'vasodilator' | 'sedative' | 'analgesic' | 'paralytic' | 'antiarrhythmic';
  defaultDoseUnit: 'mcg/kg/min' | 'mcg/kg/h' | 'mcg/min' | 'mg/kg/h' | 'mg/h' | 'U/min' | 'ng/kg/min';
  defaultDose: number;
  minDose: number;
  maxDose: number;
  standardVialMg: number; // e.g. 4mg
  standardDilutionMl: number; // e.g. 250ml or 100ml
  diluentOptions: { label: string; vialMg: number; volumeMl: number }[];
  clinicalIndication: string;
  cautionAlert?: string;
  recommendedSolution?: string;
  solutionReason?: string;
  compatibilityNotes?: string;
  stabilityHours?: string;
}

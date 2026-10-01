import { LetterheadConfig, PatientPreanesthesiaRecord } from '../types/preanesthesia';
import { LOGO_SHIELD_BASE64 } from './logoData';

const STORAGE_LETTERHEAD_KEY = 'anestesiapro_active_letterhead_config_v1';
const STORAGE_PROFILES_KEY = 'anestesiapro_letterhead_profiles_v1';
const STORAGE_DRAFT_KEY = 'anestesiapro_preanesthesia_active_draft_v1';
const STORAGE_CONFIGURED_FLAG = 'anestesiapro_letterhead_configured_flag_v1';
const STORAGE_DOCTOR_DEFAULTS_KEY = 'anestesiapro_doctor_default_credentials_v1';

export interface DoctorCredentials {
  doctorName: string;
  doctorCedula: string;
  doctorLicense: string;
  doctorPhone: string;
  doctorSpecialty?: string;
  doctorSignatureDataUrl?: string | null;
}

export const DEFAULT_DOCTOR_CREDENTIALS: DoctorCredentials = {
  doctorName: 'Dr. Carlos Leal',
  doctorCedula: '15.489.288',
  doctorLicense: 'MP-84920 / CM-4521',
  doctorPhone: '04243291438',
  doctorSpecialty: 'Especialista en Anestesiología y Reanimación'
};

export function getSavedDoctorCredentials(): DoctorCredentials {
  if (typeof window === 'undefined') return DEFAULT_DOCTOR_CREDENTIALS;
  try {
    const raw = localStorage.getItem(STORAGE_DOCTOR_DEFAULTS_KEY);
    if (raw) {
      return { ...DEFAULT_DOCTOR_CREDENTIALS, ...JSON.parse(raw) };
    }
  } catch (e) {}
  return DEFAULT_DOCTOR_CREDENTIALS;
}

export function saveDoctorCredentials(creds: DoctorCredentials): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_DOCTOR_DEFAULTS_KEY, JSON.stringify(creds));
  } catch (e) {}
}

export const DEFAULT_LETTERHEAD_CONFIG: LetterheadConfig = {
  id: 'default-profile-1',
  name: 'Anestesia Pro Estándar',
  hospitalName: 'FORMATO DE EVALUACIÓN PREANESTÉSICA',
  department: 'ANESTESIA PRO',
  institutionType: 'Fundador: Dr. Carlos Leal',
  address: 'Fundador: Dr. Carlos Leal • Especialista en Anestesiología y Reanimación',
  cityCountry: 'Documento Médico Legal Confidencial',
  phone: '04243291438',
  email: 'carloseduardoleal29@gmail.com',
  doctorName: 'Dr. Carlos Leal',
  doctorSpecialty: 'Especialista en Anestesiología y Reanimación',
  doctorLicense: 'MP-84920 / CM-4521',
  doctorPhone: '04243291438',
  doctorEmail: 'carloseduardoleal29@gmail.com',
  hospitalLogoBase64: LOGO_SHIELD_BASE64 || null,
  specialistLogoBase64: LOGO_SHIELD_BASE64 || null,
  themeColor: 'navy',
  showQrCode: true,
  confidentialityNote: 'Documento médico legal confidencial amparado por el secreto profesional y normativas de bioética clínica.'
};

export const PRESET_PROFILES: LetterheadConfig[] = [
  {
    ...DEFAULT_LETTERHEAD_CONFIG,
    id: 'preset-default',
    name: 'Anestesia Pro (Estándar Oficial)',
    hospitalName: 'FORMATO DE EVALUACIÓN PREANESTÉSICA',
    department: 'ANESTESIA PRO',
    themeColor: 'navy'
  },
  {
    ...DEFAULT_LETTERHEAD_CONFIG,
    id: 'preset-1',
    name: 'Hospital Universitario (Público)',
    hospitalName: 'HOSPITAL CENTRAL UNIVERSITARIO',
    department: 'SERVICIO DE ANESTESIOLOGÍA Y TERAPIA INTENSIVA',
    themeColor: 'navy'
  },
  {
    ...DEFAULT_LETTERHEAD_CONFIG,
    id: 'preset-2',
    name: 'Clínica Quirúrgica San Rafael (Privada)',
    hospitalName: 'CENTRO CLÍNICO SAN RAFAEL',
    department: 'UNIDAD DE ANESTESIOLOGÍA Y CIRUGÍA AMBULATORIA',
    address: 'Urb. Altamira, Torre Médica Piso 4',
    cityCountry: 'Caracas, Venezuela',
    phone: '+58 (212) 200-4000',
    email: 'contacto@clinicasanrafael.com',
    themeColor: 'emerald'
  },
  {
    ...DEFAULT_LETTERHEAD_CONFIG,
    id: 'preset-3',
    name: 'Consultorio Privado / Práctica Libre',
    hospitalName: 'PRÁCTICA PRIVADA & CIRUGÍA AVANZADA',
    department: 'EQUIPO DE ANESTESIOLOGÍA Y CUIDADOS PERIOPERATORIOS',
    address: 'Consulta Externa & Interconsultas Quirúrgicas',
    themeColor: 'indigo'
  }
];

export function isLetterheadConfigured(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const flag = localStorage.getItem(STORAGE_CONFIGURED_FLAG);
    if (flag === 'true') return true;
    const activeRaw = localStorage.getItem(STORAGE_LETTERHEAD_KEY);
    if (activeRaw) {
      const parsed = JSON.parse(activeRaw);
      // Solo se considera membrete configurado si el usuario personalizó conscientemente
      // un hospital/clínica diferente del membrete institucional de Anestesia Pro
      if (
        parsed.hospitalName && 
        parsed.hospitalName !== DEFAULT_LETTERHEAD_CONFIG.hospitalName &&
        parsed.hospitalName !== 'HOSPITAL UNIVERSITARIO CENTRAL' &&
        parsed.hospitalName !== 'FORMATO DE EVALUACIÓN PREANESTÉSICA'
      ) {
        return true;
      }
      if (parsed.hospitalLogoBase64 && parsed.hospitalLogoBase64 !== LOGO_SHIELD_BASE64) {
        return true;
      }
    }
  } catch (e) {}
  return false;
}

export function markLetterheadConfigured(configured = true): void {
  if (typeof window === 'undefined') return;
  try {
    if (configured) {
      localStorage.setItem(STORAGE_CONFIGURED_FLAG, 'true');
    } else {
      localStorage.removeItem(STORAGE_CONFIGURED_FLAG);
    }
  } catch (e) {}
}

export function getActiveLetterhead(): LetterheadConfig {
  if (typeof window === 'undefined') return DEFAULT_LETTERHEAD_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_LETTERHEAD_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_LETTERHEAD_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error loading letterhead config:', e);
  }
  return DEFAULT_LETTERHEAD_CONFIG;
}

export function saveActiveLetterhead(config: LetterheadConfig): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_LETTERHEAD_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving letterhead config:', e);
    return false;
  }
}

export function saveActiveLetterheadPermanently(config: LetterheadConfig): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_LETTERHEAD_KEY, JSON.stringify(config));
    localStorage.setItem(STORAGE_CONFIGURED_FLAG, 'true');
    
    // Also update this profile in profiles list so it appears in presets
    const profiles = getSavedLetterheadProfiles();
    const existingIndex = profiles.findIndex(p => p.id === config.id);
    let updatedProfiles: LetterheadConfig[];
    if (existingIndex >= 0) {
      updatedProfiles = [...profiles];
      updatedProfiles[existingIndex] = { ...config };
    } else {
      updatedProfiles = [config, ...profiles];
    }
    saveLetterheadProfiles(updatedProfiles);
    return true;
  } catch (e) {
    console.error('Error permanently saving letterhead:', e);
    return false;
  }
}

export function getSavedLetterheadProfiles(): LetterheadConfig[] {
  if (typeof window === 'undefined') return PRESET_PROFILES;
  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return PRESET_PROFILES;
}

export function saveLetterheadProfiles(profiles: LetterheadConfig[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {}
}

export function createEmptyPreanesthesiaRecord(): PatientPreanesthesiaRecord {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const savedCreds = getSavedDoctorCredentials();

  return {
    id: 'rec-' + Date.now(),
    date: dateStr,
    time: timeStr,
    fullName: '',
    recordNumber: '',
    age: '',
    gender: 'M',
    weightKg: '',
    heightCm: '',
    bmi: 0,
    surgeryProposed: '',
    surgeonName: '',
    urgencyType: 'Electiva',

    allergies: 'Ninguna conocida (NKDA)',
    hasAllergies: false,
    comorbidities: {
      hta: false,
      diabetes: false,
      cardiopatiaIsquemica: false,
      insuficienciaCardiaca: false,
      asmaEpoc: false,
      apneaSueno: false,
      insuficienciaRenal: false,
      hepatopatia: false,
      reflujoGastroesofagico: false,
      tabaquismo: false,
      etilismo: false,
      otras: ''
    },
    chronicMedications: 'Ninguna',
    anticoagulants: 'Ninguno',
    previousSurgeriesAnesthesias: 'Ninguna previa',
    adverseAnestheticEvents: 'Sin eventos adversos reportados',

    fastingSolidsHours: 8,
    fastingClearLiquidsHours: 2,
    hasAdequateFasting: true,

    airway: {
      mallampati: 'I',
      patilTiromentoniana: '> 6.5 cm (Normal)',
      aperturaBucal: '> 4 cm (Normal)',
      movilidadCervical: 'Normal (> 90°)',
      prognatismo: 'Normal (Clase I)',
      dentadura: 'Propia y en buen estado',
      cuello: 'Delgado / Normal',
      antecedenteVAD: false
    },
    isDifficultAirwayPredicted: false,

    asaClassification: 'I',
    isAsaEmergency: false,
    capriniScore: 1,
    capriniLevel: 'Bajo (1-2)',

    proposedAnesthesia: 'General Balanceada',
    airwayDevice: 'Tubo Endotraqueal (TET)',
    monitoringPlan: 'Monitoreo Básico Tipo I (ECG 5 derivaciones, PANI, Pulsioximetría, Capnografía)',
    bloodReserve: 'No requerida',
    specialRecommendations: 'Profilaxis antiemética multimodal (Dexametasona + Ondansetrón). Prevención de hipotermia activa con manta térmica.',

    // Evaluador Anestesiólogo (asignado en la ficha)
    evaluatorDoctorName: savedCreds.doctorName || 'Dr. Carlos Leal',
    evaluatorDoctorCedula: savedCreds.doctorCedula || '15.489.288',
    evaluatorDoctorLicense: savedCreds.doctorLicense || 'MP-84920 / CM-4521',
    evaluatorDoctorPhone: savedCreds.doctorPhone || '04243291438',
    evaluatorDoctorSpecialty: savedCreds.doctorSpecialty || 'Especialista en Anestesiología y Reanimación',

    // Paraclínicos y Gabinete
    paraclinics: {
      hb: '13.5 g/dL',
      hto: '40 %',
      plaquetas: '250,000 /mm³',
      leucocitos: '7,500 /mm³',
      glicemia: '90 mg/dL',
      creatinina: '0.8 mg/dL',
      urea: '25 mg/dL',
      pt: '12.0 s (100% / INR 1.0)',
      ptt: '30.0 s',
      inr: '1.0',
      grupoRh: 'O Rh Positivo (+)',
      vih: 'Negativo',
      vdrl: 'No reactivo',
      ekg: 'RITMO SINUSAL, FC 75 LPM, SIN ALTERACIONES',
      rxTorax: 'CAMPOS PULMONARES CLAROS, SILUETA CARDÍACA NORMAL',
      valoracionCardio: 'Valoración cardiovascular no contraindica acto quirúrgico.',
      otrosLabs: 'Ninguno'
    },

    // Examen Físico Segmentado
    physicalExam: {
      fc: '78 lpm',
      fr: '16 rpm',
      ta: '120/80 mmHg',
      escalaChien: 'Grado I - Fácil (Puntos anatómicos bien palpables)',
      cabezaCuello: 'Normocéfalo, pupilas isocóricas fotorreactivas, cuello móvil sin adenopatías',
      cardiovascular: 'Ruidos cardíacos rítmicos, normofonéticos, sin soplos audibles',
      respiratorio: 'Murmullo vesicular conservado en ambos campos pulmonares, sin agregados',
      abdomen: 'Blando, depresible, no doloroso a la palpación, ruidos hidroaéreos presentes',
      extremidades: 'Eutróficas, sin edemas periféricos, pulsos distales presentes y simétricos',
      neurologico: 'Consciente, orientado en tiempo, espacio y persona, Glasgow 15/15'
    },

    goldmanClass: 'Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)',
    egriScore: 0,
    egriCategory: 'Vía Aérea Previsiblemente Fácil / Normal',

    doctorSignatureDataUrl: null,
    doctorSignedAt: null,
    patientSignatureDataUrl: null,
    patientSignedAt: null,
    patientSignerName: '',
    patientSignerRelation: 'Paciente'
  };
}

export function getPreanesthesiaDraft(): PatientPreanesthesiaRecord {
  if (typeof window === 'undefined') return createEmptyPreanesthesiaRecord();
  try {
    const raw = localStorage.getItem(STORAGE_DRAFT_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return createEmptyPreanesthesiaRecord();
}

export function savePreanesthesiaDraft(record: PatientPreanesthesiaRecord): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(record));
  } catch (e) {}
}

export function processAndCompressLogo(file: File, maxDim = 450): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('No se pudo leer el archivo'));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(result);
            return;
          }
          
          // Clear with transparency
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Keep PNG for transparent logos or SVGs, otherwise JPEG at 0.9
          const isPng = file.type.includes('png') || file.type.includes('svg') || result.startsWith('data:image/png');
          const outputFormat = isPng ? 'image/png' : 'image/jpeg';
          const compressed = canvas.toDataURL(outputFormat, 0.9);
          resolve(compressed);
        } catch (canvasErr) {
          console.warn('Canvas compression fallback to raw base64:', canvasErr);
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = error => reject(error);
  });
}

export function convertFileToBase64(file: File): Promise<string> {
  return processAndCompressLogo(file);
}

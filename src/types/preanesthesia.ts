export interface LetterheadConfig {
  id: string;
  name: string; // e.g. "Hospital Clínico", "Clínica Privada San Rafael"
  hospitalName: string;
  department: string; // e.g. "Servicio de Anestesiología y Reanimación"
  institutionType: string; // e.g. "Centro Quirúrgico", "Hospital Universitario"
  address: string;
  cityCountry: string;
  phone: string;
  email: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorLicense: string; // Cédula o Matrícula Profesional
  doctorPhone: string;
  doctorEmail: string;
  hospitalLogoBase64: string | null;
  specialistLogoBase64: string | null;
  themeColor: 'navy' | 'emerald' | 'cyan' | 'burgundy' | 'slate' | 'indigo';
  showQrCode: boolean;
  confidentialityNote: string;
}

export interface AirwayEvaluation {
  mallampati: 'I' | 'II' | 'III' | 'IV';
  patilTiromentoniana: '> 6.5 cm (Normal)' | '< 6.5 cm (Riesgo)';
  aperturaBucal: '> 4 cm (Normal)' | '< 4 cm (Limitada)';
  movilidadCervical: 'Normal (> 90°)' | 'Limitada (< 90°)';
  prognatismo: 'Normal (Clase I)' | 'Limitado (Clase II)' | 'Incapaz (Clase III)';
  dentadura: 'Propia y en buen estado' | 'Prótesis removible (retirar)' | 'Piezas flojas / mal estado' | 'Edéntulo total';
  cuello: 'Delgado / Normal' | 'Corto y grueso (Circunferencia > 40cm)';
  antecedenteVAD: boolean;
}

export interface PatientPreanesthesiaRecord {
  id: string;
  date: string;
  time: string;
  // Patient details
  fullName: string;
  recordNumber: string; // Historia Clínica o Cédula
  age: number | string;
  gender: 'M' | 'F' | 'Otro';
  weightKg: number | string;
  heightCm: number | string;
  bmi: number;
  surgeryProposed: string;
  surgeonName: string;
  urgencyType: 'Electiva' | 'Urgencia' | 'Emergencia Extrema';

  // Antecedents & Anamnesis
  allergies: string; // Destacado
  hasAllergies: boolean;
  comorbidities: {
    hta: boolean;
    diabetes: boolean;
    cardiopatiaIsquemica: boolean;
    insuficienciaCardiaca: boolean;
    asmaEpoc: boolean;
    apneaSueno: boolean;
    insuficienciaRenal: boolean;
    hepatopatia: boolean;
    reflujoGastroesofagico: boolean;
    tabaquismo: boolean;
    etilismo: boolean;
    otras: string;
  };
  chronicMedications: string;
  anticoagulants: string;
  previousSurgeriesAnesthesias: string;
  adverseAnestheticEvents: string; // e.g. despertar intraoperatorio, hipertermia, náuseas severas

  // Fasting
  fastingSolidsHours: number | string;
  fastingClearLiquidsHours: number | string;
  hasAdequateFasting: boolean;

  // Airway
  airway: AirwayEvaluation;
  isDifficultAirwayPredicted: boolean;

  // Stratification
  asaClassification: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
  isAsaEmergency: boolean; // Sufijo 'E'
  capriniScore: number;
  capriniLevel: 'Muy Bajo (0)' | 'Bajo (1-2)' | 'Moderado (3-4)' | 'Alto (5-8)' | 'Muy Alto (≥9)';

  // Plan
  proposedAnesthesia: 'General Balanceada' | 'TIVA (Total Intravenosa)' | 'Bloqueo Neuroaxial (Raquídea)' | 'Bloqueo Neuroaxial (Epidural)' | 'Bloqueo Regional Ecoguiado' | 'Sedación Monitorizada (MAC)' | 'Combinada (General + Regional)';
  airwayDevice: 'Tubo Endotraqueal (TET)' | 'Máscara Laríngea (LMA)' | 'Videolaringoscopio planificado' | 'Fibrobroncoscopio despierto' | 'Cánula nasal / Ventilación espontánea';
  monitoringPlan: string;
  bloodReserve: 'No requerida' | 'Grupo y Factor / Pruebas Cruzadas' | '2 Unidades Concentrado Globular en quirófano' | '4 Unidades + Protocolo Transfusión Masiva';
  specialRecommendations: string;

  // Evaluador Anestesiólogo (asignado en la ficha individual, no en el membrete)
  evaluatorDoctorName?: string;
  evaluatorDoctorCedula?: string;
  evaluatorDoctorLicense?: string; // M.P. / Registro Médico
  evaluatorDoctorPhone?: string;
  evaluatorDoctorSpecialty?: string;

  // Paraclínicos y Gabinete
  paraclinics?: {
    hb?: string;
    hto?: string;
    plaquetas?: string;
    leucocitos?: string;
    glicemia?: string;
    creatinina?: string;
    urea?: string;
    pt?: string;
    ptt?: string;
    inr?: string;
    grupoRh?: string;
    vih?: string;
    vdrl?: string;
    ekg?: string;
    rxTorax?: string;
    valoracionCardio?: string;
    otrosLabs?: string;
  };

  // Examen Físico Segmentado
  physicalExam?: {
    fc?: string;
    fr?: string;
    ta?: string;
    escalaChien?: string;
    cabezaCuello?: string;
    cardiovascular?: string;
    respiratorio?: string;
    abdomen?: string;
    extremidades?: string;
    neurologico?: string;
  };

  // Escala de Goldman & EGRI
  goldmanClass?: string;
  egriScore?: number;
  egriCategory?: string;

  // Digital Signatures
  doctorSignatureDataUrl: string | null;
  doctorSignedAt: string | null;
  patientSignatureDataUrl: string | null;
  patientSignedAt: string | null;
  patientSignerName: string;
  patientSignerRelation: 'Paciente' | 'Madre' | 'Padre' | 'Cónyuge' | 'Tutor Legal';
}

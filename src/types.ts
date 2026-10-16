export type TabType = 'inicio' | 'preanestesia' | 'viaAerea' | 'escalas' | 'calculadora' | 'vademecum' | 'educacion' | 'indiceShock';

export interface EducationalResource {
  id: string;
  title: string;
  category: 'reel' | 'pdf' | 'infografia' | 'pauta' | 'video' | 'presentacion' | 'foto' | 'archivo' | 'articulo' | 'link' | 'carrusel';
  description: string;
  date: string;
  author?: string;
  url?: string;
  externalUrl?: string;
  photoDeleted?: boolean;
  fileDataUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  fileExtension?: string;
  thumbnailUrl?: string;
  tags?: string[];
  videoUrl?: string;
  instagramUrl?: string;
  downloadable?: boolean;
  isDraft?: boolean;
  isCustom?: boolean;
  isCommunity?: boolean;
  images?: string[];
  imagesData?: string[];
  isCarousel?: boolean;
  imageCaptions?: string[];
  updatedAt?: string;
}

export interface PreanesthesiaData {
  // 1. Identificación
  nombre: string;
  cedulaPaciente: string;
  direccion: string;
  edad: string;
  sexo: string;
  fecha: string;
  hora: string;
  servicio: string; // Servicio Quirúrgico / Tratante
  diag: string;
  diagnostico?: string; // Para compatibilidad
  cirugia: string;

  // 2. Antecedentes
  antFam: string;
  antPers: string;
  alergias: string;
  alcohol: string;
  cirugiasPrev: string;
  antecedentes?: string; // Para compatibilidad
  familiares?: string;   // Para compatibilidad
  quirurgicos?: string;  // Para compatibilidad
  habitos?: string;      // Para compatibilidad

  // 3. Examen Físico e Índice Vía Aérea (El-Ganzouri - EGRI)
  peso: string;
  talla?: string;
  imc?: string;
  fc: string;
  fr: string;
  ta: string;
  escalaChien: string; // Escala de Chien para dificultad de bloqueo neuroaxial
  escalaHien?: string; // Para compatibilidad
  
  // 7 Parámetros de El-Ganzouri (EGRI)
  egriApertura: string;   // > 4 cm (0 pts), 3-4 cm (1 pt), < 3 cm (2 pts)
  egriDtm: string;        // > 6.5 cm (0 pts), 6-6.5 cm (1 pt), < 6 cm (2 pts)
  egriMallampati: string; // Clase I (0 pts), Clase II (1 pt), Clase III/IV (2 pts)
  egriCervical: string;   // > 90° (0 pts), 80-90° (1 pt), < 80° (2 pts)
  egriSubluxacion: string;// Incisivos inf. por delante (0 pts), Alinear (1 pt), No alinear (2 pts)
  egriPeso: string;       // < 90 kg (0 pts), 90-110 kg (1 pt), > 110 kg (2 pts)
  egriHistoriaVad: string;// Negativa (0 pts), Positiva (+2 pts)
  
  // Legacy / Direct access compatibility
  mallampati?: string;
  dtm?: string;
  dem?: string;
  apertura?: string;
  protrusion?: string;
  cervical?: string;
  caracteristicas?: string;

  cabeza: string;
  cardio: string;
  cardiovascular?: string; // Para compatibilidad
  resp: string;
  pulmonar?: string;       // Para compatibilidad
  abdomen: string;
  extremidades: string;
  neuro: string;
  neurologico?: string;    // Para compatibilidad

  // 4. Paraclínicos y Riesgo
  hg: string;
  hto: string;
  leuco: string;
  plaquetas: string;
  grupoFactor: string; // Grupo y Factor Rh
  glicemia: string;
  creatinina: string;
  urea: string;
  pt: string;          // Tiempo de Protrombina (PT) por separado
  ptt: string;         // Tiempo de Tromboplastina Parcial (PTT) por separado
  inr?: string;        // INR internacional
  pt_ptt?: string;     // Para compatibilidad
  hiv: string;         // HIV / VIH
  vdrl: string;        // VDRL
  ekg: string;
  rx: string;
  evaluacionCardio: string;  // Valoración Cardiovascular
  evaluacionNeumo: string;   // Evaluación por Neumonología
  otrosLaboratorios: string; // Otros laboratorios
  otrasValoraciones?: string; // Otras valoraciones especializadas (Med. Interna, Endocrino, Nefrología, etc.)

  goldman: string;
  asa: string;
  apto: string;

  // Escala de Caprini (Riesgo Tromboembólico Venoso - TEV)
  capriniScore?: number;
  capriniCategory?: string;
  capriniProfilaxis?: string;
  capriniSelectedItems?: string[];

  // 5. Cierre
  recomendaciones: string;
  anestesio: string;
  cedula: string;
  matricula?: string; // Matrícula Profesional / Registro Médico
  telefono: string;

  // 6. Membrete & Logos del Hospital
  hospitalName?: string;
  hospitalDepartment?: string;
  hospitalInstitutionType?: string;
  hospitalAddress?: string;
  hospitalCityCountry?: string;
  hospitalPhone?: string;
  hospitalEmail?: string;
  hospitalLogoBase64?: string | null;
  specialistLogoBase64?: string | null;
  themeColor?: 'navy' | 'emerald' | 'cyan' | 'burgundy' | 'indigo' | 'slate';

  // 7. Firmas Digitales Manuscritas
  doctorSignatureDataUrl?: string | null;
  doctorSignedAt?: string | null;
  doctorSignatureScale?: 'normal' | 'large' | 'extraLarge' | 'jumbo' | string;
  doctorSignatureZoom?: number;
  doctorStampDataUrl?: string | null;
  doctorStampScale?: 'normal' | 'large' | 'extraLarge' | string;
  doctorStampZoom?: number;
  patientSignatureDataUrl?: string | null;
  patientSignedAt?: string | null;
  patientSignatureScale?: 'normal' | 'large' | 'extraLarge' | 'jumbo' | string;
  patientSignatureZoom?: number;
  patientSignerName?: string;
  patientSignerRelation?: 'Paciente' | 'Madre' | 'Padre' | 'Cónyuge' | 'Tutor Legal' | string;
}

export interface DrugDosingRegimen {
  indicacion: string;
  dosis: string;
  via?: string;
  notas?: string;
}

export interface DrugInfo {
  id: string;
  nombre: string;
  categoria: string;
  categoriaSecundaria?: string;
  clasificacion: string;
  mecanismo: string;
  farmacocinetica?: {
    inicio: string;
    pico?: string;
    duracion: string;
    metabolismo: string;
  };
  efectosOrganicos?: {
    cardiovascular?: string;
    respiratorio?: string;
    snc?: string;
    otros?: string;
  };
  esquemasDosis: DrugDosingRegimen[];
  dosisInduccion?: string;
  dosisMantenimiento?: string;
  dosisSedacion?: string;
  dosisAnalgesia?: string;
  dosisUsual?: string;
  dosisMaxima?: string;
  perlaClinica: string;
  precaucion?: string;
  bibliografia?: string;
}

export interface EgriState {
  apertura: number;
  tiro: number;
  mallampati: number;
  cervical: number;
  sublux: number;
  peso: number;
  history: number;
}

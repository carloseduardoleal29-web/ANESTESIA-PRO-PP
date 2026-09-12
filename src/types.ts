export type TabType = 'inicio' | 'preanestesia' | 'viaAerea' | 'escalas' | 'calculadora' | 'vademecum' | 'educacion' | 'indiceShock';

export interface EducationalResource {
  id: string;
  title: string;
  category: 'reel' | 'pdf' | 'infografia' | 'pauta' | 'video' | 'presentacion' | 'foto' | 'archivo' | 'articulo' | 'link';
  description: string;
  date: string;
  author?: string;
  url?: string;
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
  cirugia: string;

  // 2. Antecedentes
  antFam: string;
  antPers: string;
  alergias: string;
  alcohol: string;
  cirugiasPrev: string;

  // 3. Examen Físico e Índice Vía Aérea (El-Ganzouri - EGRI)
  peso: string;
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
  resp: string;
  abdomen: string;
  extremidades: string;
  neuro: string;

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

  goldman: string;
  asa: string;
  apto: string;

  // 5. Cierre
  recomendaciones: string;
  anestesio: string;
  cedula: string;
  telefono: string;
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

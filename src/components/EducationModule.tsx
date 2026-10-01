import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { EducationalResource } from '../types';
import { recordGlobalDownload, getGlobalStats, publishNewNotification, getNotifications, AppStats, AppNotification, resolveAppUrl } from '../lib/statsService';
import { VortexApproachVisualizer } from './education/VortexApproachVisualizer';
import { EmotiveProtocolVisualizer } from './education/EmotiveProtocolVisualizer';
import { PreeclampsiaProtocolVisualizer } from './education/PreeclampsiaProtocolVisualizer';
import { downloadPreeclampsiaGuidePDF } from './education/preeclampsiaPdfGenerator';
import { InstagramCarouselViewer } from './education/InstagramCarouselViewer';
import { CarouselCardPreview } from './education/CarouselCardPreview';
import { PengBlockVisualizer } from './education/PengBlockVisualizer';
import { INITIAL_RESOURCES } from '../data/initialEducationResources';
import { 
  persistResources, 
  loadStoredResources, 
  mergeResources, 
  compressImageFile,
  removeStoredResource,
  markResourceAsDeleted,
  getDeletedResourceIds,
  purgeAllCustomStoredResources,
  fetchServerResources 
} from '../lib/educationStorage';
import { 
  subscribeToCloudResources, 
  saveCloudResource, 
  deleteCloudResource,
  saveCloudNotification 
} from '../lib/cloudEducationService';
import { forceAppUpdate } from '../registerServiceWorker';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';
import { ResourceShareStrip } from './education/ResourceShareStrip';
import { 
  GraduationCap, 
  Video, 
  FileText, 
  Image as ImageIcon, 
  Camera,
  BookMarked, 
  Plus, 
  Download, 
  Sparkles, 
  Search, 
  Calendar, 
  X, 
  Upload, 
  Film, 
  Info,
  Presentation,
  Archive,
  Play,
  Pause,
  Eye,
  CheckCircle2,
  FileUp,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Smartphone,
  MapPin,
  BookOpen,
  Award,
  Bookmark,
  ExternalLink,
  Globe,
  Link as LinkIcon,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Maximize2,
  RotateCcw,
  Clock,
  AlertTriangle,
  Layers,
  Loader2,
  Brain,
  Zap,
  Flame,
  Wind,
  Stethoscope,
  ArrowRight,
  LifeBuoy,
  Crosshair,
  Compass,
  ShieldAlert,
  Droplet,
  Trash2,
  RefreshCw,
  CloudUpload,
  Cloud,
  Check,
  AlertCircle,
  Bell,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

export const sortResourcesNewestToOldest = (list: EducationalResource[]): EducationalResource[] => {
  return [...list].sort((a, b) => {
    // 1. Primary: Compare date descending (YYYY-MM-DD)
    const dateA = a.date || '1970-01-01';
    const dateB = b.date || '1970-01-01';
    if (dateB !== dateA) {
      return dateB.localeCompare(dateA);
    }
    // 2. Secondary: If timestamps in id (res-1725...), newer timestamp first
    const timeA = a.id?.startsWith('res-') ? parseInt(a.id.replace('res-', ''), 10) : 0;
    const timeB = b.id?.startsWith('res-') ? parseInt(b.id.replace('res-', ''), 10) : 0;
    if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB && timeA > 1000000000 && timeB > 1000000000) {
      return timeB - timeA;
    }
    // 3. Fallback: id descending
    return (b.id || '').localeCompare(a.id || '');
  });
};

interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  timestamp?: string;
  type?: 'title' | 'photo' | 'timeline' | 'alert' | 'text' | 'algorithm' | 'quote';
  bulletPoints?: string[];
  alertText?: string;
  quote?: string;
  badge?: string;
}

const ELAINE_BROMILEY_SLIDES: SlideData[] = [
  {
    id: 1,
    type: 'title',
    title: 'EL CASO DE ELAINE BROMILEY',
    subtitle: 'Análisis de Factores Humanos y Gestión de Recursos en Crisis (CRM) en Vía Aérea Difícil',
    badge: 'Sesiones de Maitines CAULE'
  },
  {
    id: 2,
    type: 'photo',
    title: 'Elaine Bromiley y su Familia',
    subtitle: 'Sesiones de Maitines CAULE',
    bulletPoints: [
      'Foto familiar: Elaine Bromiley, su esposo Martin Bromiley y sus dos hijos pequeños.',
      'Paciente de 37 años con excelente estado de salud general previa a la cirugía electiva.',
      'Caso paradigmático que transformó la cultura de seguridad del paciente y los factores humanos en anestesiología a nivel mundial.'
    ]
  },
  {
    id: 3,
    type: 'timeline',
    title: 'Preoperatorio & Antecedentes Clínicos',
    bulletPoints: [
      'Procedimiento programado: Septoplastia y endoscopia de senos nasales.',
      'Edad: 37 años.',
      'Antecedentes quirúrgicos: Intervención por apendicitis a los 7 años y 2 cesáreas previas sin incidencias anestésicas.',
      'Anatomía cervical: Fusión congénita vertebral a nivel cervical.'
    ]
  },
  {
    id: 4,
    type: 'text',
    title: 'Evaluación Preoperatoria de la Vía Aérea',
    bulletPoints: [
      'Mallampati Grado II.',
      'Apertura bucal normal.',
      'Ligera limitación en la flexoextensión y en la rotación cervical.'
    ]
  },
  {
    id: 5,
    type: 'timeline',
    timestamp: '8:30',
    title: 'Monitorización Inicial en Quirófano',
    bulletPoints: [
      'Monitorización de rutina aplicada al ingreso a quirófano.',
      'Frecuencia cardíaca (FC): 81 ppm.',
      'Saturación de oxígeno (SaO2): 98%.',
      'No hay datos registrados de presión arterial inicial.'
    ]
  },
  {
    id: 6,
    type: 'timeline',
    timestamp: '8:35',
    title: 'Inducción Anestésica e Imposibilidad de Dispositivo Supraglótico',
    bulletPoints: [
      'Inducción anestésica administrada: Remifentanilo (0,3 mcg/kg/min) y Propofol 200 mg.',
      'Imposibilidad de colocación de mascarilla laríngea por incapacidad de apertura bucal debido a rigidez muscular.'
    ],
    alertText: '¿Qué hacer en este momento?'
  },
  {
    id: 7,
    type: 'text',
    timestamp: '8:36',
    title: 'Segundo Intento con Mascarilla Laríngea',
    bulletPoints: [
      'En este caso el Dr. A administra otros 50 mg de Propofol.',
      'Realiza un segundo intento con mascarillas laríngeas de tamaño 3 y 4.',
      'No se consigue su colocación.'
    ]
  },
  {
    id: 8,
    type: 'alert',
    timestamp: '8:37',
    title: 'Deterioro de la Oxigenación y Taquicardia',
    bulletPoints: [
      'Deterioro de la saturación de oxígeno a 75%.',
      'Aumento de la frecuencia cardíaca reflexiva.'
    ],
    alertText: '¿Rescatar ventilación o declarar emergencia?'
  },
  {
    id: 9,
    type: 'alert',
    timestamp: '8:39',
    title: 'Hipoxia Severa y Ventilación Imposible con Mascarilla Facial',
    bulletPoints: [
      'SaO2 cae drásticamente a 40%.',
      'Los intentos de ventilación con mascarilla facial y oxígeno al 100% son extremadamente difíciles.'
    ],
    alertText: '¿Proceder a intubación o llamar a equipo de apoyo?'
  },
  {
    id: 10,
    type: 'timeline',
    timestamp: '8:41 - 8:43',
    title: 'Saturación Crítica Persistente y Bradicardia Reflexiva',
    bulletPoints: [
      'Saturación de Oxígeno (SpO2) sigue estancada en 40%.',
      'La frecuencia cardíaca desciende a 69 ppm (bradicardia por hipoxia severa y sostenida).',
      'Ambiente de pánico, parálisis por análisis y alta sobrecarga cognitiva en el quirófano.'
    ]
  },
  {
    id: 11,
    type: 'timeline',
    timestamp: '8:44',
    title: 'Decisión de Intubación Traqueal y Llegada de Ayuda',
    bulletPoints: [
      'El Dr. A decide intentar la intubación traqueal.',
      'Administra 0,6 mg de Atropina y 100 mg de Succinilcolina.',
      'En este momento llega el Dr. B que estaba anestesiando en el quirófano contiguo.'
    ]
  },
  {
    id: 12,
    type: 'timeline',
    timestamp: '8:45',
    title: 'Laringoscopia Difícil e Intentos a 4 Manos',
    bulletPoints: [
      'Se realiza laringoscopia directa observándose Cormack-Lehane Grado IV (sin visión de glotis).',
      'La SaO2 sigue muy baja.',
      'La frecuencia cardíaca es de 64 ppm.',
      'En este momento el cirujano Dr. E entra en el quirófano para ayudar.',
      'La ventilación seguía siendo difícil a pesar del uso de ventilación a 4 manos.'
    ]
  },
  {
    id: 13,
    type: 'alert',
    title: 'SITUACIÓN DE EMERGENCIA EXTREMA',
    subtitle: '¡ NO INTUBABLE NO VENTILABLE ! (NINO / CICO)',
    bulletPoints: [
      'Punto de inflexión decisivo en el algoritmo donde se requería declarar estado CICO e iniciar cricotiroidotomía de emergencia (eFONA).'
    ]
  },
  {
    id: 14,
    type: 'timeline',
    timestamp: '8:47 – 8:50',
    title: 'Intentos Repetidos e Ineficaces de Intubación y Fibrobroncoscopia',
    bulletPoints: [
      'Ambos anestesiólogos (Dr. A y Dr. B) hicieron más intentos de laringoscopia e intubación usando diferentes laringoscopios.',
      'El Dr. B intentó intubación con fibrobroncoscopio pero no fue posible debido a la presencia abundante de sangre.',
      'La SaO2 seguía por debajo del 40% y la FC cada vez más lenta.'
    ]
  },
  {
    id: 15,
    type: 'timeline',
    timestamp: '8:51 – 8:55',
    title: 'Intento de Intubación por el Cirujano',
    bulletPoints: [
      'El Dr. E (cirujano) intenta intubación con laringoscopio estándar siendo capaz de ver algo de la epiglotis e intenta pasar una guía, pero no lo logra.',
      'La saturación sigue por debajo del 40% y la frecuencia cardíaca sube a 140 ppm.'
    ]
  },
  {
    id: 16,
    type: 'photo',
    title: 'Fijación de Tareas y Desorden en Quirófano',
    bulletPoints: [
      'Ilustración del caos: Anestesiólogos angustiados, sudando, con múltiples laringoscopios y guías descartados en el suelo.',
      'Error de Fijación (Fixation Error): Obsesión con intubar por vía oral sin ejecutar el acceso quirúrgico infraglótico.'
    ]
  },
  {
    id: 17,
    type: 'timeline',
    timestamp: '8:55',
    title: 'Inserción de Mascarilla Fastrach',
    bulletPoints: [
      'La inserción de la mascarilla laríngea de intubación Fastrach permitió finalmente algo de ventilación y oxigenación.'
    ]
  },
  {
    id: 18,
    type: 'timeline',
    timestamp: '9:00',
    title: 'Mejoría Parcial de la Saturación de Oxígeno',
    bulletPoints: [
      'La SaO2 mejora al 90%.',
      'Se administran 8 mg de Dexametasona i.v.'
    ],
    alertText: '¿Despertar inmediatamente o intentar intubar por Fastrach?'
  },
  {
    id: 19,
    type: 'timeline',
    timestamp: '9:03 – 9:09',
    title: 'Intentos de Intubación a través de la Fastrach',
    bulletPoints: [
      'Se intenta intubar a través de la Fastrach primero a ciegas y después con el fibrobroncoscopio.',
      'Durante este tiempo la saturación se mantuvo inestable, no excediendo del 90%.'
    ]
  },
  {
    id: 20,
    type: 'timeline',
    timestamp: '9:10',
    title: 'Decisión de Despertar a la Paciente',
    bulletPoints: [
      'En vista de los problemas encontrados y la imposibilidad de asegurar la vía aérea, se decide despertar a la paciente.'
    ]
  },
  {
    id: 21,
    type: 'timeline',
    timestamp: '9:13 – 9:29',
    title: 'Recuperación de Ventilación Espontánea',
    bulletPoints: [
      'Se detiene la perfusión de Remifentanilo.',
      'Se recupera paulatinamente la ventilación espontánea.',
      'Se retira la mascarilla y se introduce una cánula de Guedel.',
      'La saturación llega a 95%.',
      'La Tensión Arterial es de 195/126 mmHg. La FC de 152 ppm.'
    ]
  },
  {
    id: 22,
    type: 'timeline',
    timestamp: '9:30 aprox.',
    title: 'Traslado a Reanimación y Tiempo de Anoxia Crítica',
    bulletPoints: [
      'El Dr. A está contento por la recuperación de la ventilación y pasa a la paciente a la sala de reanimación.',
      'En total el tiempo de SaO2 extremadamente baja (40% o menos) fue de APROXIMADAMENTE 20 MINUTOS.'
    ]
  },
  {
    id: 23,
    type: 'timeline',
    timestamp: '9:30',
    title: 'Informe al Staff y Continuación del Quirófano',
    bulletPoints: [
      'Se informa brevemente al staff del problema.',
      'El Dr. A continúa con su parte quirúrgico programado con los siguientes pacientes.'
    ]
  },
  {
    id: 24,
    type: 'timeline',
    timestamp: '11:00',
    title: 'Deterioro Neurológico Grave y Traslado a UCI',
    bulletPoints: [
      'Debido a la inestabilidad y falta de respuesta neurológica, se traslada a la paciente a la UCI de un hospital del NHS.',
      'Ante el daño cerebral grave por anoxia se decide que requiere ventilación mecánica urgentemente.',
      'Tuvieron problemas con la intubación, consiguiéndolo finalmente por vía nasal.',
      'Elaine Bromiley sufrió daño cerebral anóxico irreversible y falleció 13 días después.'
    ],
    alertText: 'El daño cerebral anóxico ya era irreversible tras los 20 minutos con SpO2 ≤ 40%.'
  },
  {
    id: 25,
    type: 'text',
    title: 'Evidencia Científica y Algoritmos (Anaesthesia - E.T. Crosby 2011)',
    bulletPoints: [
      'La respuesta rutinaria a una situación de VAD con un algoritmo está ampliamente apoyada por las publicaciones en la literatura.',
      'No hay evidencias que apoyen la selección de una estrategia en particular sobre otra.',
      'No hay evidencia de cuál es el mejor dispositivo alternativo: la experiencia personal con el dispositivo parece ser el factor determinante.'
    ]
  },
  {
    id: 26,
    type: 'text',
    title: 'Principios Fundamentales de Todos los Algoritmos de VAD',
    bulletPoints: [
      '1. Valoración y predicción de VAD para estar preparado ante cualquier acontecimiento adverso.',
      '2. Mantener prioritariamente la oxigenación del paciente.',
      '3. Considerar la posibilidad de despertar al paciente y suspender la cirugía electiva.',
      '4. En situaciones de NVNI usar los dispositivos adecuados según nuestra habilidad y algoritmo hospitalario y pensar siempre en la cricotiroidotomía.'
    ]
  },
  {
    id: 27,
    type: 'text',
    title: 'Dos Enfoques en la Creación de Algoritmos',
    bulletPoints: [
      'Enfoque A: Incluir una amplia variedad de técnicas en cada etapa del algoritmo.',
      'Enfoque B: Crear un algoritmo simple y definitivo con pocos elementos para reducir la carga cognitiva durante emergencias.'
    ]
  },
  {
    id: 28,
    type: 'algorithm',
    title: 'Algoritmo ASA 2003 (Difficult Airway Algorithm)',
    subtitle: 'American Society of Anesthesiologists',
    bulletPoints: [
      'Estructura de evaluación previa y bifurcación entre paciente despierto vs anestesiado.',
      'Identificación de la vía de emergencia vs no emergencia.',
      'Primera incorporación de la Mascarilla Laríngea (LMA) como dispositivo de rescate no invasivo.'
    ]
  },
  {
    id: 29,
    type: 'algorithm',
    title: 'Algoritmo DAS 2004 (Unanticipated Difficult Intubation)',
    subtitle: 'Difficult Airway Society (UK)',
    bulletPoints: [
      'Estructuración formal en Plan A, Plan B, Plan C y Plan D.',
      'Plan A: Intubación traqueal inicial optimizada.',
      'Plan B: Mantenimiento con LMA/ILMA.',
      'Plan C: Ventilación con mascarilla facial y despertar.',
      'Plan D: Rescate quirúrgico de vía aérea.'
    ]
  },
  {
    id: 30,
    type: 'algorithm',
    title: 'Algoritmo DAS 2004 - Plan D de Emergencia',
    subtitle: 'Técnicas de Rescate Infraglótico',
    bulletPoints: [
      'Diferenciación entre Cricotiroidotomía por Cánula (con ventilación de alta presión) y Cricotiroidotomía Quirúrgica.',
      'Énfasis en no demorar la intervención invasiva ante hipoxia severa.'
    ]
  },
  {
    id: 31,
    type: 'algorithm',
    title: 'Guía de Vía Aérea Difícil No Prevista (2008)',
    bulletPoints: [
      'Plan A: Máximo 3 intentos de laringoscopia optimizada + Pedir ayuda.',
      'Plan B: Supraglóticos de rescate (Fastrach / Laringoscopios especiales).',
      'Plan C: Ventilación dificultosa -> M. Laríngea / DESPERTAR.',
      'Plan D: Ventilación imposible -> Cricotiroidotomía urgente.'
    ]
  },
  {
    id: 32,
    type: 'algorithm',
    title: 'Vía Aérea Difícil No Prevista en Paciente Obstétrica (2012)',
    bulletPoints: [
      'Uso obligado de Maniobra de Sellick (presión cricoidea).',
      'Evaluación del distrés fetal en la decisión entre despertar o intubación urgente.',
      'Uso prioritario de DSG con canal gástrico (ProSeal, Supreme, i-gel).'
    ]
  },
  {
    id: 33,
    type: 'text',
    title: 'Consideraciones Importantes (Heidegger et al. Best Practice 2005)',
    bulletPoints: [
      'Algoritmo propio institucional adoptado por todo el servicio.',
      'GUÍAS lo más sencillas posibles.',
      'Restricción en el número de dispositivos disponibles para evitar confusión.',
      'Incluir 2 importantes consideraciones: 1) Decisión de intubación en despierto si VAD es prevista, 2) Establecer planes de rescate ANTES de realizar las técnicas primarias.',
      'Disponibilidad inmediata del equipo.',
      'Uso regular en procedimientos electivos por todo el staff.'
    ]
  },
  {
    id: 34,
    type: 'text',
    title: 'Secuencia Lógica ante Situación NVNI',
    bulletPoints: [
      '1. Asegurarse de que el problema no es debido a un fallo del equipo anestésico.',
      '2. Pedir ayuda pronto y ventilar a 4 manos con cánula orofaríngea (Guedel).',
      '3. No declarar situación de NVNI sin antes realizar un intento con DSG de rescate.',
      '4. Relajante muscular a dosis adecuadas si el paciente no está relajado y la opción de despertar no es factible (rocuronio / succinilcolina).'
    ]
  },
  {
    id: 35,
    type: 'text',
    title: 'Recomendaciones en Manejo Precoz de Situación NVNI (NAP4 Report)',
    bulletPoints: [
      'Conocer las guías publicadas y estar entrenados en su uso.',
      'Si la opción de despertar no es factible, administrar relajante a dosis óptimas antes de decidir acceso quirúrgico.',
      'Intentar el rescate de la VA con DSG lo más PRECOZ posible, antes de proceder al acceso quirúrgico.',
      'La toma de decisión PRECOZ de cricotiroidotomía es clave.'
    ]
  },
  {
    id: 36,
    type: 'text',
    title: 'Dispositivos de Rescate NINV',
    bulletPoints: [
      'Mascarillas Laríngeas de 2ª Generación y Fastrach.',
      'Cánulas y Angiocatéteres de cricotiroidotomía #14 con jeringa de aspiración.',
      'Conexión TET 7.5/8 con jeringa de 2-3 cc y angiocatéter para oxigenación de rescate.'
    ]
  },
  {
    id: 37,
    type: 'text',
    title: 'Habilidades No Técnicas (Non-Technical Skills / CRM)',
    bulletPoints: [
      '1. Reconocimiento de la situación (Situational Awareness).',
      '2. Toma de decisiones estructurada.',
      '3. Comunicación asertiva y en bucle cerrado.',
      '4. Trabajo en equipo eficiente.',
      '5. Liderazgo situacional definido.',
      '6. Manejo de situaciones de estrés y control de la sobrecarga cognitiva.'
    ]
  },
  {
    id: 38,
    type: 'text',
    title: 'Checklist for Airway Management (Best Practice 2005)',
    bulletPoints: [
      'Conocer el entorno y la ubicación exacta del material.',
      'Anticipar y planificar previamente el plan de rescate.',
      'Pedir ayuda pronto.',
      'Usar todos los recursos disponibles (materiales y humanos).',
      'Usar toda la información disponible.',
      'Prevenir los errores de fijación.',
      'Reevaluar repetidamente el estado del paciente.'
    ]
  },
  {
    id: 39,
    type: 'alert',
    title: 'Factores Humanos Fallidos en el Caso Bromiley',
    bulletPoints: [
      'Pérdida de conciencia de la situación (Lapse of Situational Awareness).',
      'Inoportuna toma de decisiones (parálisis y retrasos en tomar medidas de emergencia).',
      'Comunicación inadecuada entre los profesionales de quirófano.',
      'Falta de trabajo en equipo estructurado.',
      'Fallo de liderazgo durante los 20 minutos de anoxia severa.'
    ]
  },
  {
    id: 40,
    type: 'text',
    title: 'Aspectos de Factores Humanos en los Casos del NAP4',
    bulletPoints: [
      'A.- Educación: 1) Entrenamiento en seguridad obligatorio en Anestesia, UCI y Urgencias. 2) Teoría de Factores Humanos obligatoria para personal que maneja VAD. 3) Trabajo multidisciplinar en equipos y escenarios simulados.',
      'B.- Guías y Protocolos: Las evidencias de NAP4 muestran que las directrices no siempre se cumplen. Guías visibles en todas las áreas de VAD y entrenamiento con simuladores.'
    ]
  },
  {
    id: 41,
    type: 'text',
    title: 'NAP4: Organización y Trabajo en Equipo',
    bulletPoints: [
      'A.- El Servicio de Anestesiología debe proporcionar el liderazgo en las estrategias de desarrollo para hacer frente a la VAD en toda la organización.',
      'B.- Anestesiólogo responsable designado para la VAD que desarrolle y adopte protocolos en todos los ámbitos del hospital.',
      'D.- Registro de capacitación continuo del personal y entrenamiento en equipo.',
      'G.- Los que trabajan juntos deben formarse juntos. El entrenamiento en equipo reduce los errores técnicos en un 30-50%.'
    ]
  },
  {
    id: 42,
    type: 'text',
    title: 'Acciones Sugeridas para Servicios de Anestesia',
    bulletPoints: [
      'Buena comunicación asertiva y sin barreras jerárquicas.',
      'Algoritmo visual de intubación difícil expuesto en cada quirófano.',
      'Control estricto del tiempo transcurrido (asistente cronometrando).',
      'Jornadas periódicas de simulación en VAD.',
      'Pausa forzada ("Stop and Think") ante el primer fracaso de intubación.'
    ]
  },
  {
    id: 43,
    type: 'text',
    title: 'Incidencia de Dificultad en Intubación (Benumof 1991)',
    bulletPoints: [
      'Incidencia de intubación exitosa pero con múltiples intentos (Grado II/III): 1 - 18%.',
      'Requerimiento de laringoscopistas experimentados (Grado III): 1 - 4%.',
      'Intubación no exitosa (Grado III/IV): 0.05 - 0.35%.',
      'No Intubable No Ventilable (daño cerebral o muerte): 0.0001 - 0.02% (0.01 - 2.0 por 10.000 pacientes).'
    ]
  },
  {
    id: 44,
    type: 'text',
    title: 'NAP4: Cuidados Intensivos e Incidentes de Vía Aérea',
    bulletPoints: [
      'El 20% de todos los incidentes relacionados con la vía aérea tuvieron lugar en la UCI.',
      'Fallos de intubación e intubación esofágica no detectada.',
      'Desplazamiento del tubo endotraqueal o traqueostomía (especialmente en obesos y traslados).',
      'Retraso en la identificación del problema por ausencia de capnografía.',
      'Dificultad de acceso al material de rescate fuera de horario habitual.',
      'Factor positivo determinante: Buena comunicación (54% de éxito).'
    ]
  },
  {
    id: 45,
    type: 'photo',
    title: 'Integración del Rompecabezas en la Vía Aérea Difícil',
    bulletPoints: [
      'Ensamblaje perfecto entre dispositivos técnicos, algoritmos sencillos, guías institucionales y factores humanos (CRM).'
    ]
  },
  {
    id: 46,
    type: 'algorithm',
    title: 'Esquema de Transición en la Crisis',
    bulletPoints: [
      'PLAN A ➔ PLAN B ➔ PLAN C ➔ PLAN D.',
      'En cualquiera de las fases exitosas: OXIGENAR Y DESPERTAR AL PACIENTE.'
    ]
  },
  {
    id: 47,
    type: 'quote',
    title: 'Reflexión Final para la Seguridad Anestésica',
    quote: '“SO THAT OTHERS MAY LEARN, AND EVEN MORE MAY LIVE”',
    subtitle: '— Martin Bromiley (Clinical Human Factors Group, 2005)'
  }
];

// Professional PDF generator for 47-Slide Presentation (Caso Elaine Bromiley)
const downloadElaineBromileyFullPDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    ELAINE_BROMILEY_SLIDES.forEach((slide, index) => {
      if (index > 0) {
        doc.addPage('a4', 'landscape');
      }

      // Dark Slide Canvas Background
      doc.setFillColor(10, 12, 16);
      doc.rect(0, 0, 297, 210, 'F');

      // Top Header Line
      doc.setFillColor(15, 23, 42);
      doc.rect(15, 10, 267, 12, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(244, 63, 94); // rose-500
      doc.text('SESIONES DE MAITINES CAULE • CASO ELAINE BROMILEY', 20, 18);

      doc.setTextColor(56, 189, 248); // sky-400
      doc.text(`PÁGINA ${slide.id} / ${ELAINE_BROMILEY_SLIDES.length}`, 240, 18);

      let currentY = 38;

      // Timestamp Badge
      if (slide.timestamp) {
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(225, 29, 72);
        doc.roundedRect(20, currentY, 32, 10, 2, 2, 'FD');
        doc.setTextColor(225, 29, 72);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(slide.timestamp, 24, currentY + 7);
        currentY += 16;
      }

      // Main Title
      doc.setTextColor(244, 63, 94);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const splitTitle = doc.splitTextToSize(slide.title.toUpperCase(), 255);
      doc.text(splitTitle, 20, currentY);
      currentY += (splitTitle.length * 8) + 2;

      // Subtitle
      if (slide.subtitle) {
        doc.setTextColor(103, 232, 249);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        const splitSub = doc.splitTextToSize(slide.subtitle, 255);
        doc.text(splitSub, 20, currentY);
        currentY += (splitSub.length * 6) + 6;
      } else {
        currentY += 4;
      }

      // Quote slide
      if (slide.type === 'quote' && slide.quote) {
        doc.setFillColor(15, 23, 42);
        doc.setDrawColor(244, 63, 94);
        doc.roundedRect(20, currentY, 257, 45, 4, 4, 'FD');

        doc.setTextColor(251, 113, 133);
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        const splitQuote = doc.splitTextToSize(slide.quote, 245);
        doc.text(splitQuote, 25, currentY + 20);
      } else if (slide.bulletPoints && slide.bulletPoints.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(255, 255, 255);

        slide.bulletPoints.forEach((point) => {
          if (currentY < 180) {
            doc.setTextColor(244, 63, 94);
            doc.text('▪', 20, currentY);
            doc.setTextColor(255, 255, 255);
            const splitPoint = doc.splitTextToSize(point, 245);
            doc.text(splitPoint, 26, currentY);
            currentY += (splitPoint.length * 6) + 3;
          }
        });
      }

      // Bottom Footer
      doc.setDrawColor(30, 41, 59);
      doc.line(15, 195, 282, 195);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text('Caso Elaine Bromiley • Factores Humanos y VAD (CAULE)', 20, 201);
      doc.text(`Diapositiva ${slide.id} de 47`, 245, 201);
    });

    saveJsPDFDocument(doc, 'Caso_Elaine_Bromiley_47_Diapositivas_CAULE.pdf');
  } catch (e) {
    console.error('Error generando PDF de diapositivas:', e);
  }
};

// Professional PDF generator for FONA Infographic
const downloadFonaInfographicPDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Dark Background Canvas
    doc.setFillColor(8, 11, 18);
    doc.rect(0, 0, 297, 210, 'F');

    // Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(10, 8, 277, 20, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.8);
    doc.rect(10, 8, 277, 20, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('PROCEDIMIENTO FONA: ACCESO FRONTAL AL CUELLO', 15, 17);

    doc.setFontSize(10.5);
    doc.setTextColor(251, 191, 36);
    doc.text('CRICOTIROTOMÍA QUIRÚRGICA DE EMERGENCIA EN CRISIS NINO / CICO', 15, 24);

    const steps = [
      {
        num: '1',
        title: 'POSICIONAMIENTO Y LOCALIZACIÓN',
        badge: 'MEMBRANA CRICOTIROIDEA',
        text: '1. Paciente en supino, cuello extendido. Identificar la membrana cricotiroidea por palpación.'
      },
      {
        num: '2',
        title: 'INCISIÓN CUTÁNEA',
        badge: 'INCISIÓN 4 CM VERTICAL',
        text: '2. Incisión vertical en la piel sobre la línea media, centrada en la membrana cricotiroidea.'
      },
      {
        num: '3',
        title: 'IDENTIFICACIÓN Y PUNCIÓN',
        badge: 'INCISIÓN TRANSVERSAL',
        text: '3. Profundizar disección roma. Identificar cartílagos. Incisión transversal directa a través de la membrana.'
      },
      {
        num: '4',
        title: 'DILATACIÓN DEL TRACTO',
        badge: 'ROTACIÓN DE BISTURÍ',
        text: '4. Rotar bisturí o insertar pinza roma para dilatar el tracto. Mantener permeabilidad.'
      },
      {
        num: '5',
        title: 'INSERCIÓN DEL TUBO Y CONFIRMACIÓN',
        badge: 'CAPNOGRAFÍA (ORO)',
        text: '5. Insertar tubo de calibre adecuado (ej. 6.0mm). Inflar balón. Confirmar con capnografía y auscultación.'
      }
    ];

    const cardWidth = 52.5;
    const startX = 10;
    const gap = 3.5;
    const cardTop = 33;
    const cardHeight = 152;

    steps.forEach((st, idx) => {
      const x = startX + idx * (cardWidth + gap);

      // Card Background
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(30, 41, 59);
      doc.roundedRect(x, cardTop, cardWidth, cardHeight, 3, 3, 'FD');

      // Top Step Number Circle
      doc.setFillColor(14, 116, 144);
      doc.circle(x + cardWidth / 2, cardTop + 14, 8.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(st.num, x + cardWidth / 2 - 2, cardTop + 17.5);

      // Title
      doc.setFontSize(8);
      doc.setTextColor(56, 189, 248);
      const splitT = doc.splitTextToSize(st.title, cardWidth - 6);
      doc.text(splitT, x + 3, cardTop + 29);

      // Line
      doc.setDrawColor(51, 65, 85);
      doc.line(x + 3, cardTop + 42, x + cardWidth - 3, cardTop + 42);

      // Badge
      doc.setFillColor(30, 58, 138);
      doc.roundedRect(x + 3, cardTop + 46, cardWidth - 6, 7, 1.5, 1.5, 'F');
      doc.setFontSize(6.5);
      doc.setTextColor(191, 219, 254);
      doc.text(st.badge, x + 4.5, cardTop + 50.5);

      // Body Text
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const splitText = doc.splitTextToSize(st.text, cardWidth - 6);
      doc.text(splitText, x + 3, cardTop + 60);
    });

    // Warning Footer
    doc.setFillColor(153, 27, 27);
    doc.rect(10, 188, 277, 14, 'F');
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(254, 226, 226);
    doc.text('NOTA: Este procedimiento es una medida de último recurso en crisis de "No puedo intubar, No puedo oxigenar". Realizar bajo protocolos hospitalarios y por personal entrenado.', 15, 196);

    saveJsPDFDocument(doc, 'Procedimiento_FONA_Acceso_Frontal_al_Cuello.pdf');
  } catch (e) {
    console.error('Error generando PDF FONA:', e);
  }
};

const downloadOriginalPengImage = () => {
  const link = document.createElement('a');
  link.href = '/peng_bloqueo_infografia.svg';
  link.download = 'Bloqueo_PENG_Infografia_Dr_Carlos_Leal.svg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadPengBlockPDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Dark Background Canvas
    doc.setFillColor(8, 11, 18);
    doc.rect(0, 0, 297, 210, 'F');

    // Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(10, 8, 277, 22, 'F');
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(0.8);
    doc.rect(10, 8, 277, 22, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('BLOQUEO PENG (PERICAPSULAR NERVE GROUP BLOCK) • GUÍA ECOGRÁFICA Y CLÍNICA', 15, 17);

    doc.setFontSize(9.5);
    doc.setTextColor(56, 189, 248);
    doc.text('ANALGESIA DE CADERA CON PRESERVACIÓN MOTORA DEL CUÁDRICEPS • DR. CARLOS LEAL • ANESTESIAPRO 2026', 15, 24);

    const steps = [
      {
        num: '1',
        title: 'POSICIÓN & TRANSDUCTOR',
        badge: 'SONDA CONVEXA 5-2 MHz',
        text: 'Paciente supino. Transductor curvilíneo transversal sobre la espina ilíaca anteroinferior (EIAI) y eminencia iliopúbica (IPE).'
      },
      {
        num: '2',
        title: 'REPAROS SONOANATÓMICOS',
        badge: 'EIAI / IPE / VASOS FEMORALES',
        text: 'Identificar EIAI (lateral), IPE (medial), vientre del iliopsoas, tendón hiperecoico del psoas y vasos femorales mediales.'
      },
      {
        num: '3',
        title: 'PUNCIÓN EN PLANO',
        badge: 'AGUJA 22G 80-100 mm',
        text: 'Abordaje en plano (in-plane) de lateral a medial en ángulo de 30-45°, dirigiendo la punta hacia la eminencia iliopúbica.'
      },
      {
        num: '4',
        title: 'DIANA SUBTENDINOSA',
        badge: 'PLANO FASCIAL PROFUNDO',
        text: 'Contacto suave en periostio de IPE, retirar 1 mm. Diana: espacio fascial profundo entre tendón del psoas y periostio iliopúbico.'
      },
      {
        num: '5',
        title: 'HIDRODISECCIÓN & AL',
        badge: '20-30 mL ROPIVACAÍNA 0.2%',
        text: 'Aspiración negativa estricta. Inyectar 20-30 mL de AL (Ropivacaína 0.2-0.375% ± Dexametasona 4mg). Visualizar elevación del tendón.'
      }
    ];

    const cardWidth = 52.5;
    const startX = 10;
    const gap = 3.5;
    const cardTop = 34;
    const cardHeight = 148;

    steps.forEach((st, idx) => {
      const x = startX + idx * (cardWidth + gap);

      // Card Background
      doc.setFillColor(15, 23, 42);
      doc.setDrawColor(30, 41, 59);
      doc.roundedRect(x, cardTop, cardWidth, cardHeight, 3, 3, 'FD');

      // Top Step Number Circle
      doc.setFillColor(2, 132, 199);
      doc.circle(x + cardWidth / 2, cardTop + 14, 8.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(st.num, x + cardWidth / 2 - 2, cardTop + 17.5);

      // Title
      doc.setFontSize(8);
      doc.setTextColor(56, 189, 248);
      const splitT = doc.splitTextToSize(st.title, cardWidth - 6);
      doc.text(splitT, x + 3, cardTop + 29);

      // Line
      doc.setDrawColor(51, 65, 85);
      doc.line(x + 3, cardTop + 42, x + cardWidth - 3, cardTop + 42);

      // Badge
      doc.setFillColor(6, 78, 59);
      doc.roundedRect(x + 3, cardTop + 46, cardWidth - 6, 7, 1.5, 1.5, 'F');
      doc.setFontSize(6);
      doc.setTextColor(52, 211, 153);
      doc.text(st.badge, x + 4.5, cardTop + 50.5);

      // Body Text
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(226, 232, 240);
      const splitText = doc.splitTextToSize(st.text, cardWidth - 6);
      doc.text(splitText, x + 3, cardTop + 58);
    });

    // Clinical Pearls & Pharmacology Strip
    doc.setFillColor(15, 23, 42);
    doc.setDrawColor(16, 185, 129);
    doc.roundedRect(10, 185, 277, 19, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 211, 153);
    doc.text('VENTAJA CLÍNICA: AHORRO MOTOR (MOTOR-SPARING) & DEAMBULACIÓN PRECOZ', 15, 191);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(226, 232, 240);
    doc.text('Bloquea selectivamente los ramos articulares sensitivos (N. Femoral, N. Obturador, N. Obturador Accesorio) sin afectar ramos motores del cuádriceps.', 15, 196);
    doc.text('Dosis estándar: Ropivacaína 0.2% - 0.375% (20 - 30 mL) o Levobupivacaína 0.25% (20 - 25 mL) + Dexametasona 4 mg perineural o IV.', 15, 200);

    saveJsPDFDocument(doc, 'Guia_Clinica_Bloqueo_PENG_Cadera_Dr_Carlos_Leal.pdf');
  } catch (e) {
    console.error('Error generando PDF Bloqueo PENG:', e);
  }
};

// Universal Helper to save jsPDF files across Desktop, Web, iOS, Android WebViews & APKs
const saveJsPDFDocument = (doc: jsPDF, filename: string) => {
  try {
    const finalName = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    
    // For mobile/Android WebViews where doc.save() creates blob: URL that fails in DownloadManager,
    // convert doc to Base64 datauri string:
    try {
      const dataUrl = doc.output('datauristring');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = finalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } catch (err) {
      console.warn('Data URI save fallback to doc.save():', err);
    }

    doc.save(finalName);
  } catch (e) {
    console.error('Error saving PDF:', e);
  }
};

// Helper to reliably trigger file download in all browsers & mobile devices / APKs
const triggerFileDownload = async (url: string, filename: string) => {
  try {
    // 1. If it's already a Data URL (base64)
    if (url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // 2. Fetch and convert to Data URL using FileReader (works reliably on Android WebViews & mobile devices)
    const targetUrl = resolveAppUrl(url);
    const response = await fetch(targetUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    reader.readAsDataURL(blob);
  } catch (err) {
    console.warn('Fallback direct link download:', err);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(url, '_blank');
    }
  }
};

const downloadOriginalFonaImage = () => {
  recordGlobalDownload('res-fona-cricotiroidotomia');
  try {
    const customImg = localStorage.getItem('anestesiapro_custom_fona_img');
    if (customImg) {
      triggerFileDownload(customImg, 'Procedimiento_FONA_Acceso_Frontal_al_Cuello_Dr_Carlos_Leal.jpg');
      return;
    }
  } catch {}
  triggerFileDownload('/fona_infografia.svg', 'Procedimiento_FONA_Acceso_Frontal_al_Cuello_Original.svg');
};

const downloadOriginalAminofilinaImage = () => {
  recordGlobalDownload('res-aminofilina-teofilina-cppd');
  try {
    const customImg = localStorage.getItem('anestesiapro_custom_cppd_img');
    if (customImg) {
      triggerFileDownload(customImg, 'Infografia_Aminofilina_Teofilina_CPPD_Dr_Carlos_Leal.jpg');
      return;
    }
  } catch {}
  triggerFileDownload('/cppd_aminofilina_infografia.svg', 'Infografia_Aminofilina_Teofilina_CPPD_Dr_Carlos_Leal.svg');
};

const downloadAminofilinaMetaanalysisPDF = () => {
  recordGlobalDownload('res-articulo-metaanalisis-aminofilina-2023');
  triggerFileDownload('/Articulo_1_Metaanalisis_Aminofilina_Teofilina_2023.pdf', 'Articulo_1_Metaanalisis_Aminofilina_Teofilina_2023.pdf');
};

const downloadAminofilinaClinicalStudyPDF = () => {
  recordGlobalDownload('res-articulo-estudio-aminofilina-2016');
  triggerFileDownload('/Articulo_2_Estudio_Multicentrico_Aminofilina_2016.pdf', 'Articulo_2_Estudio_Multicentrico_Aminofilina_2016.pdf');
};

const downloadAminofilinaIntegratedGuidePDF = () => {
  recordGlobalDownload('res-aminofilina-teofilina-cppd');
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header Banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 32, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • GUÍA CLÍNICA Y PROTOCOLO DE TRATAMIENTO', 14, 13);
    doc.setTextColor(226, 232, 240);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Dr. Carlos Leal • Educación Continua Anestesiológica', 14, 21);

    // Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('AMINOFILINA Y TEOFILINA EN MANEJO DE CEFALEA POR PUNCIÓN DURAL (CPPD)', 14, 42);

    let y = 50;

    // Box 1: Fisiopatología
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y, 182, 38, 3, 3, 'FD');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. FISIOPATOLOGÍA DE LA CEFALEA POSPUNCIÓN DURAL', 18, y + 8);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const physioText = 'Punción dural o fuga de LCR -> Disminución del volumen e hipotensión intracraneal -> Descenso y tracción caudal del encéfalo sobre meninges y vasos sensibles al dolor -> Cefalea postural intensa e incapacitante en bipedestación o sedestación.';
    const splitPhysio = doc.splitTextToSize(physioText, 174);
    doc.text(splitPhysio, 18, y + 16);

    y += 44;

    // Box 2: Flujograma
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. FLUJOGRAMA DE MANEJO CLÍNICO Y DOSIFICACIÓN', 18, y + 8);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const flowText = '• Paso 1 (Leve/Moderada): Reposo, Hidratación IV/Oral, Cafeína y Analgésicos (Paracetamol/AINEs).\n• Paso 2 (Tratamiento Farmacológico Directo): Aminofilina 240 - 480 mg IV en infusión lenta (100 ml SS 0.9% en 30-45 min) o Teofilina oral 250 mg c/8h.\n• Paso 3 (Persistente/Severa): Parche Hemático Epidural (PHE) con 15-20 ml de sangre autóloga.\n• Paso 4: Monitoreo y seguimiento post-PHE.';
    const splitFlow = doc.splitTextToSize(flowText, 174);
    doc.text(splitFlow, 18, y + 16);

    y += 54;

    // Box 3: Mecanismo de Acción
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 42, 3, 3, 'FD');
    doc.setTextColor(15, 118, 110);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('3. MECANISMO DE ACCIÓN FARMACOLÓGICO', 18, y + 8);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const mechText = '• Antagonismo no selectivo de receptores A1/A2 de Adenosina: Bloquea la vasodilatación cerebral y produce vasoconstricción compensatoria.\n• Inhibición de la Fosfodiesterasa (PDE): Aumenta el cAMP intracelular.\n• Estimulación de bombas Na+/K+ ATPasa: Aumenta la secreción activa de LCR en plexos coroideos.';
    const splitMech = doc.splitTextToSize(mechText, 174);
    doc.text(splitMech, 18, y + 16);

    y += 48;

    // Box 4: Evidencia Científica
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(126, 34, 206);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('4. EVIDENCIA CIENTÍFICA Y METAANÁLISIS', 18, y + 8);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const evidText = '• Metaanálisis (Anesthesia & Pain Medicine 2023 - 15 RCTs):\n  Reducción significativa del dolor (SMD = -1.67; 95% CI, -2.28 a -1.05; P < 0.001).\n• Estudio Multicéntrico Prospectivo (Pain Physician Journal 2016):\n  Disminución inmediata de escala de dolor VAS de 7.72 a 4.84 a los 30 min y a 0.81 a las 48h. Tasa de éxito del 93.8%.';
    const splitEvid = doc.splitTextToSize(evidText, 174);
    doc.text(splitEvid, 18, y + 16);

    // Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 280, 210, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('AnestesiaPro • Documento Oficial de Referencia Médica', 14, 289);

    saveJsPDFDocument(doc, 'Guia_Oficial_Aminofilina_y_Teofilina_Manejo_CPPD_Dr_Carlos_Leal.pdf');
  } catch (e) {
    console.error('Error generando PDF Aminofilina:', e);
  }
};

// Professional PDF generator for Guía ERAS Cesárea 2025
const downloadErasCesareaPDF = () => {
  recordGlobalDownload('res-guia-eras-cesarea-2025');
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Page 1: Resumen y Pilares Fundamentales
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');
    
    doc.setTextColor(56, 189, 248); // sky-400
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • UNIDAD DE EDUCACION CONTINUA', 14, 14);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Guia ERAS 2025: Analgesia Postoperatoria Multimodal en Cesarea', 14, 23);
    
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Fuente: ERAS Society / SOAP / International Multidisciplinary Consensus 2025', 14, 30);
    
    let y = 43;
    
    // Box 1: Resumen Ejecutivo
    doc.setFillColor(240, 249, 255); // sky-50
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(14, y, 182, 38, 3, 3, 'FD');
    doc.setTextColor(3, 105, 161);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. RESUMEN EJECUTIVO Y OBJETIVOS CLINICOS', 18, y + 7);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    const splitSummary = doc.splitTextToSize(
      '- Publicacion ERAS 2025: Actualizacion de pautas posquirurgicas en cesarea enfocadas en analgesia multimodal protocolizada y ahorro estricto de opioides.\n' +
      '- Impacto del dolor no controlado: Retrasa la lactancia materna precoz, dificulta el apego piel con piel, duplica el riesgo de depresion postparto y quintuplica el dolor cronico persistente.\n' +
      '- Meta terapeutica: Alivio optimo del dolor en reposo y movimiento, deambulacion en <12h, lactancia inmediata y alta segura.',
      174
    );
    doc.text(splitSummary, 18, y + 14);
    
    y += 43;
    
    // Box 2: Pilares Farmacológicos 1 & 2
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 50, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. PILARES FARMACOLOGICOS BASALES (OBLIGATORIOS)', 18, y + 7);
    
    doc.setTextColor(14, 116, 144);
    doc.setFontSize(8.2);
    doc.setFont('helvetica', 'bold');
    doc.text('A. MORFINA INTRATECAL (ITM) - ESTANDAR DE ORO:', 18, y + 14);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.6);
    doc.setFont('helvetica', 'normal');
    doc.text('- Dosis Optima: 50 a 100 mcg (0.05 a 0.10 mg) intratecal en anestesia espinal.', 22, y + 19);
    doc.text('- Duracion: 14 a 24 horas de analgesia profunda. Menor prurito y cero depresion respiratoria vs dosis altas.', 22, y + 24);
    
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8.2);
    doc.setFont('helvetica', 'bold');
    doc.text('B. PARACETAMOL & AINES PROGRAMADOS (HORARIO FIJO - NUNCA PRN):', 18, y + 31);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.6);
    doc.setFont('helvetica', 'normal');
    doc.text('- Paracetamol: 1 g cada 6 horas IV o VO (maximo 4 g/dia). Mecanismo central sinergico.', 22, y + 36);
    doc.text('- AINEs: Ibuprofeno 600 mg VO c/8h o Ketorolaco 15-30 mg IV c/6-8h. Reduce 60% de opioides.', 22, y + 41);
    doc.text('- Regla de Oro: NUNCA prescribir a demanda o condicional; mantener horario estricto.', 22, y + 46);
    
    y += 55;
    
    // Box 3: Bloqueos de Pared y Coadyuvantes
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 52, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('3. BLOQUEOS REGIONALES Y MODULADORES SISTEMICOS', 18, y + 7);
    
    doc.setTextColor(126, 34, 206);
    doc.setFontSize(8.2);
    doc.setFont('helvetica', 'bold');
    doc.text('A. BLOQUEOS ECOGUIADOS (TAP / QLB) & INFILTRACION LOCAL:', 18, y + 14);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.6);
    doc.setFont('helvetica', 'normal');
    doc.text('- Indicacion: Pacientes con anestesia general o cuando NO se administro Morfina Intratecal.', 22, y + 19);
    doc.text('- TAP Block Bilateral / QLB: Ropivacaina 0.2-0.375% o Bupivacaina 0.25% (max 2 mg/kg).', 22, y + 24);
    doc.text('- Infiltracion de Herida: Bupivacaina 0.25% en bordes fasciales y dermis o infusion continua 48h.', 22, y + 29);
    
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(8.2);
    doc.setFont('helvetica', 'bold');
    doc.text('B. DEXAMETASONA & RESCATE ORAL RESTRINGIDO:', 18, y + 36);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.6);
    doc.setFont('helvetica', 'normal');
    doc.text('- Dexametasona IV: 4 a 8 mg IV al pinzar cordon (potente antiemetico y ahorrador analgesico).', 22, y + 41);
    doc.text('- Opioides de Rescate: Solo via oral (Oxicodona 5-10 mg o Tramadol 50 mg VO) si EVA > 4/10. Evitar PCA IV.', 22, y + 46);
    
    y += 57;
    
    // Box 4: Medidas No Farmacológicas y Nutrición
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 38, 3, 3, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('4. MEDIDAS FISICAS, NUTRICION Y RECUPERACION ACELERADA', 18, y + 7);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.6);
    doc.setFont('helvetica', 'normal');
    doc.text('- Faja Abdominal Elastica: Soporte postoperatorio para aliviar dolor al movimiento y tos.', 22, y + 14);
    doc.text('- Deambulacion Activa Precoz: Inicio en < 6 a 12 horas y retiro temprano de sonda vesical.', 22, y + 19);
    doc.text('- Ingesta Oral Inmediata: Liquidos claros a las 2h y solidos en < 4-6h. Masticacion de chicle preventivo de ileo.', 22, y + 24);
    doc.text('- Retiro Temprano de Sueros IV: Evita edema y sobrecarga hidrica facilitando la movilidad.', 22, y + 29);
    
    // Page 1 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Guia Oficial ERAS Cesarea 2025 • Pagina 1 de 2', 14, 290);
    
    // PAGE 2: Síntesis de las 10 Placas y Algoritmo Maestro
    doc.addPage();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • ALGORITMO MAESTRO DE LAS 10 PLACAS ERAS 2025', 14, 15);
    
    let y2 = 30;
    
    // 10 Placas Table Grid
    const plates = [
      { num: 'Placa 1', title: 'Pilares de Analgesia ERAS', text: 'Enfoque multimodal proactivo: Dolor controlado, deambulacion <12h, lactancia precoz.' },
      { num: 'Placa 2', title: 'Morfina Intratecal (ITM)', text: '50-100 mcg intratecal (Gold standard). 14-24h de analgesia profunda sin prurito severo.' },
      { num: 'Placa 3', title: 'Paracetamol + AINE Fijo', text: 'Paracetamol 1g c/6h + Ibuprofeno 600mg c/8h o Ketorolaco a horario fijo (nunca PRN).' },
      { num: 'Placa 4', title: 'Bloqueos TAP & QLB', text: 'Primera linea cuando no hay morfina intratecal o en anestesia general. Ecoguiados.' },
      { num: 'Placa 5', title: 'Infiltracion de Herida', text: 'Bupivacaina 0.25-0.5% subfascial y dermica o cateter elastomerico de 48h.' },
      { num: 'Placa 6', title: 'Dexametasona IV', text: '4-8 mg IV al pinzar cordon: Modulacion antiinflamatoria sistemica y profilaxis NVPO.' },
      { num: 'Placa 7', title: 'Opioides Orales de Rescate', text: 'Oxicodona 5-10 mg VO o Tramadol 50 mg VO solo si dolor > 4/10. Evitar PCA IV.' },
      { num: 'Placa 8', title: 'Faja y Deambulacion', text: 'Faja elastica compresiva + deambulacion activa y retiro de sonda < 12 horas.' },
      { num: 'Placa 9', title: 'Nutricion Precoz', text: 'Liquidos a las 2h, solidos < 4-6h, chicle terapeutico y retiro rapido de sueros IV.' },
      { num: 'Placa 10', title: 'Algoritmo y Confort 96%', text: 'Esquema sinergico protocolizado: Maxima satisfaccion materna y seguridad perinatal.' },
    ];
    
    plates.forEach((p, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 248 : 241, idx % 2 === 0 ? 250 : 245, idx % 2 === 0 ? 252 : 249);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y2, 182, 19, 2, 2, 'FD');
      
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y2, 24, 19, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(p.num, 17, y2 + 11);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text(p.title, 42, y2 + 6.5);
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.4);
      doc.setFont('helvetica', 'normal');
      doc.text(p.text, 42, y2 + 13.5);
      
      y2 += 22;
    });
    
    // Checklist Box
    y2 += 3;
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(14, y2, 182, 20, 2, 2, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('CHECKLIST DE ALTA Y CONTROL DE CALIDAD ERAS 2025:', 18, y2 + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('EVA < 3 en reposo y < 4 en movimiento | Tolerancia oral completa sin vomitos | Deambulacion independiente', 18, y2 + 13);
    
    // Page 2 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Sistema Integral de Anestesiologia y Educacion Continua • Pagina 2 de 2', 14, 290);
    
    saveJsPDFDocument(doc, 'Guia_ERAS_2025_Analgesia_Multimodal_Cesarea_AnestesiaPro.pdf');
  } catch (e) {
    console.error('Error generando PDF ERAS Cesarea:', e);
  }
};

// Professional PDF generator for Sistema Orexina (Hipocretina) en Anestesia General
const downloadOrexinDespertarPDF = () => {
  recordGlobalDownload('res-orexina-interruptor-despertar-2026');
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // ================= PAGE 1 =================
    // Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');
    
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • UNIDAD DE NEUROANESTESIA Y ACTUALIZACION CLINICA', 14, 13);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text("El 'Interruptor' Neuroquimico del Despertar: El Sistema Orexina (Hipocretina)", 14, 22);
    
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Fuentes: Nature Neuroscience / PNAS / British Journal of Anaesthesia (BJA) / ASA 2026', 14, 29);
    
    let y = 42;
    
    // Box 1: Resumen Ejecutivo & Emergencia Activa
    doc.setFillColor(240, 253, 250); // teal-50
    doc.setDrawColor(153, 246, 228);
    doc.roundedRect(14, y, 182, 45, 3, 3, 'FD');
    doc.setTextColor(13, 148, 136); // teal-600
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. RESUMEN EJECUTIVO: EMERGENCIA ACTIVA VS DESPERTAR PASIVO', 18, y + 7);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const splitOrexinSummary = doc.splitTextToSize(
      '- Paradigma Historico: Durante >170 anos el despertar se considero pasivo (eliminacion y redistribucion del anestesico).\n' +
      '- Descubrimiento Clave: ~70.000 neuronas orexinergicas en el Hipotalamo Lateral constituyen el "interruptor maestro" de la vigilia.\n' +
      '- Proyecciones excitatorias globales: Hacia el Talamo (nucleos intralaminares), Prosencefalo Basal (ACh), Locus Coeruleus (Noradrenalina) y Cortex Prefrontal.\n' +
      '- Supresion Anestesica: Sevoflurano, Propofol, Desflurano e Isoflurano suprimen directamente el disparo orexinergico mediante potenciacion GABA.\n' +
      '- Emergencia Activa Instantanea: Los agonistas selectivos OX2R (Danavorexton/TAK-925) inducen despertar cortical y ritmo beta en <3 min aun con niveles anestesicos plenos.',
      174
    );
    doc.text(splitOrexinSummary, 18, y + 14);
    
    y += 50;
    
    // Box 2: Comparativa Farmacológica y Receptores
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 54, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. MODULACION FARMACOLOGICA: AGONISTAS OX2R VS ANTAGONISTAS DORA', 18, y + 7);
    
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('A. DANAVOREXTON (TAK-925) - AGONISTA SELECTIVO OX2R (FASE 2 CLINICA):', 18, y + 14);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.4);
    doc.setFont('helvetica', 'normal');
    doc.text('- Mecanismo: Cruza la barrera hematoencefalica (BHE) y despolariza directamente la via orexinergica excitatoria.', 22, y + 19);
    doc.text('- Efecto EEG: Transicion inmediata de burst-suppression / delta a ritmo beta rapido; BIS sube de <40 a >80 en 2-3 minutos.', 22, y + 23);
    doc.text('- No competencia GABA: No compite por el receptor GABA-A; activa una via fisiologica paralela dominante.', 22, y + 27);
    
    doc.setTextColor(217, 119, 6);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('B. SUVOREXANT / LEMBOREXANT - ANTAGONISTAS DUALES DORA (APROBADOS FDA):', 18, y + 33);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.4);
    doc.setFont('helvetica', 'normal');
    doc.text('- Mecanismo: Bloqueo competitivo de receptores OX1R y OX2R en neuronas diana hipotalamicas.', 22, y + 38);
    doc.text('- Impacto en URPA/PACU: Retraso significativo de la emergencia anestesica, sedacion residual y somnolencia.', 22, y + 42);
    doc.text('- Perla Clinica: Verificar consumo de farmacos DORA en la evaluacion preanestesica del paciente.', 22, y + 46);
    
    y += 59;
    
    // Box 3: Rescate Ventilatorio & Monitorización EEG/BIS
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('3. RESCATE VENTILATORIO SIN HIPERALGESIA (DIFERENCIA VS NALOXONA)', 18, y + 7);
    
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const ventText = 
      '- Estimulacion Bulbar Directa: Las proyecciones orexinergicas excitan el complejo pre-Botzinger y centros respiratorios bulbares.\n' +
      '- Aumento de Volumen Minuto: Incrementa la frecuencia respiratoria y volumen corriente deprimidos por anestesicos halogenados/propofol.\n' +
      '- PRESERVACION TOTAL DE ANALGESIA: A diferencia de la Naloxona (que antagoniza receptores opioides mu causando dolor explosivo e hipertension simpatica), el agonismo OX2R estimula la ventilacion manteniendo la analgesia opioide intacta.\n' +
      '- Monitorizacion BIS: Progresion verificable en pantalla desde BIS <40 (plano quirurgico) hasta BIS >80-90 en <180 segundos.';
    const splitVent = doc.splitTextToSize(ventText, 174);
    doc.text(splitVent, 18, y + 14);
    
    // Page 1 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Sistema Orexina / Hipocretina en Anestesiologia • Pagina 1 de 2', 14, 290);
    
    // ================= PAGE 2 =================
    doc.addPage();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(52, 211, 153);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • GUIA TECNICA PASO A PASO, ENSAYOS Y PERLAS CLINICAS', 14, 15);
    
    let y2 = 29;
    
    // 5 Pasos Grid Table
    const orexinSteps = [
      { step: 'Paso 1', title: 'Fundamento Neuroquimico (Hipotalamo Lateral)', text: '70.000 neuronas orexinergicas sintetizan Orexina-A y B; compuerta global de alerta y vigilia cerebral.' },
      { step: 'Paso 2', title: 'Inhibicion por Anestesicos Generales', text: 'Sevoflurano, Propofol y Desflurano inhiben las neuronas de orexina via GABA-A, forzando la perdida de conciencia.' },
      { step: 'Paso 3', title: 'Mecanismo del Agonista OX2R (Danavorexton/TAK-925)', text: 'Despolariza la red diana, reactivando cascadas de Acetilcolina y Noradrenalina; emergencia en <3 minutos.' },
      { step: 'Paso 4', title: 'Antagonismo DORA (Suvorexant / Lemborexant)', text: 'Bloqueo selectivo de OX1R/OX2R; retrasa la recuperacion anestesica y prolonga estancia en sala de recuperacion.' },
      { step: 'Paso 5', title: 'Rescate Ventilatorio & Monitorizacion EEG / BIS', text: 'Restaura el centro respiratorio bulbar pre-Botzinger sin revertir la analgesia opioide ni generar dolor agudo.' }
    ];
    
    orexinSteps.forEach((st, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 240 : 248, idx % 2 === 0 ? 253 : 250, idx % 2 === 0 ? 250 : 252);
      doc.setDrawColor(204, 251, 241);
      doc.roundedRect(14, y2, 182, 18, 2, 2, 'FD');
      
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y2, 22, 18, 'F');
      doc.setTextColor(52, 211, 153);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(st.step, 16, y2 + 11);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.2);
      doc.setFont('helvetica', 'bold');
      doc.text(st.title, 40, y2 + 6);
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.2);
      doc.setFont('helvetica', 'normal');
      doc.text(st.text, 40, y2 + 12.5);
      
      y2 += 21;
    });
    
    y2 += 4;
    
    // Box Ensayos Clínicos
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y2, 182, 38, 2, 2, 'FD');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('EVIDENCIA CIENTIFICA Y ENSAYOS CLINICOS PUBLICADOS (NATURE / BJA / ASA):', 18, y2 + 6.5);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.3);
    doc.setFont('helvetica', 'normal');
    const trialText = 
      '• Estudio Fase 1b/2 TAK-925 (Nature Neuroscience / BJA - n=310):\n' +
      '  - Reduccion del 65% en el tiempo transcurrido hasta la extubacion traqueal vs placebo (p < 0.001).\n' +
      '  - Retorno inmediato de ondas beta en EEG sin rebote de sedacion ni efectos cardiovasculares adversos.\n' +
      '• Cohorte de Interaccion DORA (Suvorexant - n=540):\n' +
      '  - Pacientes con terapia DORA nocturna presentaron +18.4 min adicionales de latencia en URPA/PACU.';
    const splitTrial = doc.splitTextToSize(trialText, 174);
    doc.text(splitTrial, 18, y2 + 13.5);
    
    y2 += 42;
    
    // Box 6 Perlas Clínicas
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(14, y2, 182, 46, 2, 2, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('6 PUNTOS CLAVE PARA LA PRACTICA MEDICA DEL ANESTESIOLOGO:', 18, y2 + 6.5);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'normal');
    const pearlsText = 
      '1. Emergencia Activa vs Pasiva: Capacidad de forzar el despertar neuroquimico sin esperar depuracion del farmaco.\n' +
      '2. Agonistas OX2R (Danavorexton / TAK-925): Elevan el BIS de <40 a >80 en menos de 3 minutos de forma segura.\n' +
      '3. Antagonistas DORA (Suvorexant/Lemborexant): Reconocerlos en preanestesia para anticipar despertar retardado.\n' +
      '4. Rescate de Depresion Respiratoria: Activa centros bulbares sin anular analgesia opioide ni generar dolor agudo.\n' +
      '5. Prevencion de Delirium y POCD: Un despertar sincronizado disminuye la confusion y disfuncion cognitiva en el adulto mayor.\n' +
      '6. Control On/Off en Quirofano: Herramienta decisiva en neurocirugia despierta, cirugia mayor ambulatoria y emergencias.';
    const splitPearls = doc.splitTextToSize(pearlsText, 174);
    doc.text(splitPearls, 18, y2 + 13.5);
    
    // Page 2 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Documento Oficial de Educacion Continua en Neuroanestesiologia • Pagina 2 de 2', 14, 290);
    
    saveJsPDFDocument(doc, 'Orexina_Interruptor_Despertar_Anestesia_General_Danavorexton_AnestesiaPro.pdf');
  } catch (e) {
    console.error('Error generando PDF Orexina:', e);
  }
};

// Professional PDF generator for El Enfoque VORTEX en Vía Aérea Difícil (Dr. Nicholas Chrimes)
const downloadVortexApproachPDF = () => {
  recordGlobalDownload('res-enfoque-vortex-via-aerea-dificil');
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // ================= PAGE 1 =================
    // Header Banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');
    
    doc.setTextColor(56, 189, 248); // sky-400
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • AYUDA COGNITIVA & SEGURIDAD EN VIA AEREA CRITICA', 14, 13);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('El Enfoque VORTEX en Via Aerea Dificil: Zona Verde, 3 Lineas de Vida y CICO', 14, 22);
    
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('Dr. Nicholas Chrimes (Melbourne, Australia) • BJA / Difficult Airway Society (DAS) / ANZCA / WFSA', 14, 29);
    
    let y = 42;
    
    // Box 1: Resumen Ejecutivo & Modelo Mental
    doc.setFillColor(240, 253, 250); // teal-50
    doc.setDrawColor(153, 246, 228);
    doc.roundedRect(14, y, 182, 45, 3, 3, 'FD');
    doc.setTextColor(13, 148, 136); // teal-600
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. CONCEPTO CENTRAL: EL EMBUDO VORTEX Y LA ZONA VERDE (GREEN ZONE)', 18, y + 7);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const splitVortexSummary = doc.splitTextToSize(
      '- Modelo Mental Compartido: Disenado por el Dr. Nicholas Chrimes (Melbourne 2008-2016), el Vortex es una ayuda cognitiva visual en tiempo real para simplificar la toma de decisiones en crisis de via aerea.\n' +
      '- La Zona Verde (Green Zone): Representa la seguridad donde la entrega alveolar de oxigeno esta confirmada (SpO2 estable + curva capnografica EtCO2). Otorga tiempo al equipo para pausar, respirar y disenar la estrategia definitiva.\n' +
      '- Descenso en el Vorticel: Al perderse la via aerea, el paciente cae en el embudo hacia la hipoxia critica, dano cerebral y paro cardiorrespiratorio.\n' +
      '- 3 Lineas de Vida No Quirurgicas: 1) Mascarilla Facial (FMV), 2) Dispositivo Supraglotico (DSG), y 3) Tubo Endotraqueal (TET).\n' +
      '- Regla del Mejor Esfuerzo (Best Effort): Limite estricto de maximo 3 intentos por linea de vida con optimizacion obligatoria.',
      174
    );
    doc.text(splitVortexSummary, 18, y + 14);
    
    y += 50;
    
    // Box 2: Las 5 Categorías de Optimización
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 54, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. LAS 5 CATEGORIAS DE OPTIMIZACION (REGLA DEL MEJOR ESFUERZO)', 18, y + 7);
    
    const optLines = [
      { t: '1. Tamano y Tipo de Dispositivo:', d: 'Cambiar tamano de pala/mascarilla, pala hipercurva de videolaringoscopio o DSG 2a gen.' },
      { t: '2. Posicion de Cabeza y Cuello:', d: 'Posicion de olfateo (sniffing), rampa en obesos (alineacion CAE-muesca esternal).' },
      { t: '3. Manipulacion Laringea Externa:', d: 'Maniobra BURP (presion hacia atras, arriba y a la derecha) o bimanual por el operador.' },
      { t: '4. Aspiracion y Desobstruccion:', d: 'Aspiracion rigida (Yankauer), retiro de secreciones/sangre, canulas de Guedel/nasofaringeas.' },
      { t: '5. Adyuvantes y Relajacion Neuromuscular:', d: 'Introductor Bougie, estilete rigido angulado (60o) y bloqueo neuromuscular profundo (TOF 0/4).' }
    ];
    
    let optY = y + 14;
    optLines.forEach((item) => {
      doc.setTextColor(2, 132, 199);
      doc.setFontSize(7.8);
      doc.setFont('helvetica', 'bold');
      doc.text(item.t, 18, optY);
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7.3);
      doc.setFont('helvetica', 'normal');
      doc.text(item.d, 68, optY);
      optY += 7.5;
    });
    
    y += 59;
    
    // Box 3: Transición a CICO & Rescate de Cuello (eFONA)
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('3. DECLARACION CICO Y RESCATE DE CUELLO (eFONA: ESCALPELO - BOUGIE - TUBO)', 18, y + 7);
    
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    const cicoText = 
      '- Gatillo Inmediato CICO: Si tras el mejor esfuerzo en las 3 lineas de vida la oxigenacion falla, se declara en voz alta la situacion CICO (Cannot Intubate, Cannot Oxygenate).\n' +
      '- Acceso Frontal Quirurgico (eFONA): Ejecucion rapida de cricotiroidotomia con tecnica estandarizada (Escalpelo con hoja #10/20, Bougie y Tubo Endotraqueal #6.0 con balon).\n' +
      '- Prevencion de Paro Hipoxico: No titubear ni realizar intentos repetidos a ciegas; el acceso quirurgico restaura de inmediato la ventilacion infraglotica.\n' +
      '- Retorno a la Zona Verde: Tras inflar el balon y confirmar EtCO2 con ventilacion expansiva, el paciente retorna con exito a la Zona Verde de seguridad.';
    const splitCico = doc.splitTextToSize(cicoText, 174);
    doc.text(splitCico, 18, y + 14);
    
    // Page 1 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Guia Oficial Enfoque VORTEX (Dr. Nicholas Chrimes) • Pagina 1 de 2', 14, 290);
    
    // ================= PAGE 2 =================
    doc.addPage();
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • LOS 5 PASOS CLINICOS, EVIDENCIA Y FACTORES HUMANOS', 14, 15);
    
    let y2 = 29;
    
    // 5 Pasos Grid Table
    const vortexSteps = [
      { step: 'Paso 1', title: 'Zona Verde & Entrada al Vortex', text: 'Confirmar oxigenacion alveolar (SpO2 > 95% y capnografia). Si se pierde ventilacion, declarar entrada al Vortex.' },
      { step: 'Paso 2', title: 'Linea 1: Mascarilla Facial (FMV)', text: 'Tecnica bimanual C-E / V-E con canula de Guedel, ajuste hermetico y verificacion capnografica (maximo 3 intentos).' },
      { step: 'Paso 3', title: 'Linea 2: Dispositivo Supraglotico (DSG)', text: 'Insercion de mascarilla laringea de 2a generacion con canal de aspiracion gastrica (i-gel, ProSeal, AuraGain).' },
      { step: 'Paso 4', title: 'Linea 3: Tubo Endotraqueal (TET)', text: 'Videolaringoscopia con Bougie / estilete rigido bajo paralisis neuromuscular completa confirmada (TOF 0/4).' },
      { step: 'Paso 5', title: 'Rescate CICO: Acceso Quirurgico (eFONA)', text: 'Declarar CICO en voz alta; ejecutar cricotiroidotomia quirurgica con escalpelo-bougie-tubo 6.0 y volver a Zona Verde.' }
    ];
    
    vortexSteps.forEach((st, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 240 : 248, idx % 2 === 0 ? 253 : 250, idx % 2 === 0 ? 250 : 252);
      doc.setDrawColor(204, 251, 241);
      doc.roundedRect(14, y2, 182, 18, 2, 2, 'FD');
      
      doc.setFillColor(15, 23, 42);
      doc.rect(14, y2, 22, 18, 'F');
      doc.setTextColor(56, 189, 248);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(st.step, 16, y2 + 11);
      
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.2);
      doc.setFont('helvetica', 'bold');
      doc.text(st.title, 40, y2 + 6);
      
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(7.2);
      doc.setFont('helvetica', 'normal');
      doc.text(st.text, 40, y2 + 12.5);
      
      y2 += 21;
    });
    
    y2 += 4;
    
    // Box Ensayos Clínicos
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, y2, 182, 38, 2, 2, 'FD');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('EVIDENCIA CIENTIFICA Y ESTUDIOS CLINICOS (BJA / DAS / NAP4 REPORT):', 18, y2 + 6.5);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.3);
    doc.setFont('helvetica', 'normal');
    const trialText = 
      '• The Vortex Implementation in High-Acuity Airway Emergencies (BJA 2016 - Chrimes et al. n=4,200):\n' +
      '  - Reduccion del 68% en el tiempo de toma de decisiones para rescate CICO quirurgico (p < 0.001).\n' +
      '  - Eliminacion completa del error de fijacion y de reintentos ciegos destructivos en equipos interdisciplinarios.\n' +
      '• DAS 2015 Guidelines / NAP4 National Audit Project (UK - n=2,900,000 anestesias):\n' +
      '  - El retraso en el acceso quirurgico al cuello por reintentos repetitivos fue la principal causa prevenible de muerte cerebral.';
    const splitTrial = doc.splitTextToSize(trialText, 174);
    doc.text(splitTrial, 18, y2 + 13.5);
    
    y2 += 42;
    
    // Box 6 Perlas Clínicas
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(14, y2, 182, 46, 2, 2, 'FD');
    doc.setTextColor(6, 95, 70);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('6 PUNTOS CLAVE PARA LA PRACTICA MEDICA DEL ANESTESIOLOGO:', 18, y2 + 6.5);
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'normal');
    const pearlsText = 
      '1. Origen y Respaldo: Creado por el Dr. Nicholas Chrimes (Melbourne), formalizado en 2013-2016 y respaldado por la DAS y BJA.\n' +
      '2. Ayuda Cognitiva Visual: Erradica la sobrecarga mental y el sesgo de perseveracion en crisis extremas de via aerea.\n' +
      '3. La Zona Verde: Meta primordial donde la oxigenacion alveolar y la capnografia estan confirmadas; permite pausar y planificar.\n' +
      '4. 3 Lineas de Vida Superiores: Mascarilla Facial, Dispositivo Supraglotico y Tubo Endotraqueal (laringoscopia).\n' +
      '5. Mejor Esfuerzo (Best Effort): Maximo 3 intentos por linea con intervencion de las 5 optimizaciones (tamano, posicion, BURP, succion, relajante).\n' +
      '6. Rescate de Cuello Inmediato (eFONA): Si fallan las 3 lineas, transitar sin dilacion al acceso quirurgico con escalpelo-bougie-tubo.';
    const splitPearls = doc.splitTextToSize(pearlsText, 174);
    doc.text(splitPearls, 18, y2 + 13.5);
    
    // Page 2 Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Documento Oficial de Educacion Continua en Via Aerea Dificil • Pagina 2 de 2', 14, 290);
    
    saveJsPDFDocument(doc, 'Enfoque_VORTEX_Via_Aerea_Dificil_Dr_Nicholas_Chrimes_AnestesiaPro.pdf');
  } catch (e) {
    console.error('Error generando PDF Vortex Approach:', e);
  }
};

// Professional PDF generator using jsPDF
const downloadGeneratedPDF = (
  title: string,
  author: string,
  date: string,
  category: string,
  description: string,
  tags: string[] = [],
  fileName: string = 'AnestesiaPro_Guia_Clinica.pdf'
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top header background banner
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 32, 'F');

    // Title text in header
    doc.setTextColor(56, 189, 248); // sky-400
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • UNIDAD DE EDUCACION CONTINUA', 14, 13);

    doc.setTextColor(226, 232, 240); // slate-200
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Biblioteca Medico-Quirurgica y Guias Clinicas Perioperatorias', 14, 21);

    // Document Title
    doc.setTextColor(15, 23, 42); // slate-900
    doc.setFontSize(11.5);
    doc.setFont('helvetica', 'bold');
    const splitTitle = doc.splitTextToSize(title, 182);
    doc.text(splitTitle, 14, 43);

    let yPos = 43 + (splitTitle.length * 5.5);

    // Metadata Card
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.roundedRect(14, yPos, 182, 16, 2.5, 2.5, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`AUTOR / EDICION: ${author || 'Dr. Carlos Leal • AnestesiaPro'}`, 18, yPos + 5.5);
    doc.text(`FECHA DE PUBLICACION: ${date}   |   CATEGORIA: ${category.toUpperCase()}`, 18, yPos + 11);

    yPos += 23;

    // Section Header
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199); // sky-600
    doc.text('RESUMEN CLINICO & CONTENIDO DE CONSULTA:', 14, yPos);

    yPos += 7;

    // Description text
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    const cleanText = description.replace(/•/g, '-');
    const splitDesc = doc.splitTextToSize(cleanText, 182);

    splitDesc.forEach((line: string) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, 14, yPos);
      yPos += 5;
    });

    yPos += 8;

    // Tags
    if (tags && tags.length > 0) {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(`Etiquetas Clinicas: ${tags.join('  ')}`, 14, yPos);
    }

    // Footer on all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('AnestesiaPro - Sistema de Apoyo Clinico y Educacion Continua en Anestesiologia', 14, 287);
      doc.text(`Pagina ${i} de ${totalPages}`, 180, 287);
    }

    const finalName = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    saveJsPDFDocument(doc, finalName);
  } catch (e) {
    console.error('Error generando documento PDF:', e);
  }
};

const ElaineSlideViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const currentSlide = ELAINE_BROMILEY_SLIDES[currentSlideIndex];
  const totalSlides = ELAINE_BROMILEY_SLIDES.length;

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSlides]);

  const goToNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setCurrentSlideIndex(0);
    }
  };

  const goToPrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else {
      setCurrentSlideIndex(totalSlides - 1);
    }
  };

  const handleDownloadPDF = () => {
    downloadElaineBromileyFullPDF();
  };

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'min-h-[560px]'}`}>
      {/* Top PDF Reader Toolbar */}
      <div className="bg-slate-900/95 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <FileText className="w-3 h-3" /> PDF ORIGINAL (47 PÁGINAS)
          </span>
          <span className="text-cyan-300 font-black hidden sm:inline text-xs">
            El Caso de Elaine Bromiley • CAULE
          </span>
        </div>

        {/* PDF Navigation & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Page Counter Dropdown */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1">
            <span className="text-slate-400 font-semibold text-[11px]">Página</span>
            <select
              value={currentSlideIndex}
              onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
              className="bg-transparent text-cyan-400 font-black focus:outline-none cursor-pointer text-xs"
            >
              {ELAINE_BROMILEY_SLIDES.map((slide, idx) => (
                <option key={slide.id} value={idx} className="bg-slate-900 text-white font-bold">
                  {slide.id} - {slide.title.slice(0, 26)}
                </option>
              ))}
            </select>
            <span className="text-slate-500 font-bold">/ {totalSlides}</span>
          </div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-[11px] font-bold">
            <button
              onClick={() => setZoomLevel(Math.max(80, zoomLevel - 15))}
              className="px-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Reducir zoom"
            >
              -
            </button>
            <span className="text-cyan-300 px-1">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="px-1.5 text-slate-400 hover:text-white cursor-pointer"
              title="Aumentar zoom"
            >
              +
            </button>
          </div>

          {/* Thumbnails grid toggle */}
          <button
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              showThumbnails 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title="Ver cuadrícula de diapositivas"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Slideshow play */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isPlaying ? 'Pausar diapositivas' : 'Reproducción automática'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          {/* Download Original PDF */}
          <button
            onClick={handleDownloadPDF}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 rounded-xl transition-all cursor-pointer shadow flex items-center gap-1 text-[11px] font-bold px-2.5"
            title="Descargar PDF Original completo"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">PDF</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:text-white rounded-xl transition-all cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-1">
        <div 
          className="bg-gradient-to-r from-red-600 via-rose-500 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* Thumbnails Modal overlay */}
      {showThumbnails && (
        <div className="bg-slate-900/95 p-4 border-b border-slate-800 max-h-60 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 animate-fadeIn">
          {ELAINE_BROMILEY_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setShowThumbnails(false);
              }}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between h-20 ${
                currentSlideIndex === idx
                  ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] font-black">
                <span className="text-rose-400">Pág {slide.id}</span>
                {slide.timestamp && <span className="text-amber-400">{slide.timestamp}</span>}
              </div>
              <p className="text-[10px] font-bold line-clamp-2 leading-tight">
                {slide.title}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Slide Canvas Content - Exact Original PDF Slide Aesthetic */}
      <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#07090e]">
        <div 
          className="p-4 sm:p-6 md:p-10 min-h-[420px] sm:min-h-[500px] flex flex-col justify-between relative transition-all duration-300 mx-auto w-full max-w-5xl"
          style={{
            backgroundColor: '#0a0c10',
            backgroundImage: 'linear-gradient(to bottom, #07090e 0%, #0c1017 65%, #12213d 100%)',
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
            transformOrigin: 'top center'
          }}
        >
          {/* Authentic PDF Header Watermark */}
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 pb-3 border-b border-slate-800/80">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block shrink-0" />
              <span>Sesiones de Maitines CAULE</span>
            </span>
            <span className="text-cyan-400 font-mono text-[10px] sm:text-xs">
              PÁGINA {currentSlide.id} / 47
            </span>
          </div>

          <div className="my-auto py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-4xl mx-auto w-full">
            {/* Timestamp Badge if available */}
            {currentSlide.timestamp && (
              <div className="inline-block bg-white text-rose-600 font-mono font-black text-base sm:text-lg md:text-xl px-3 py-1 sm:px-4 sm:py-1.5 border-2 border-rose-600 shadow-md">
                {currentSlide.timestamp}
              </div>
            )}

            {/* Slide Main Heading - Authentic Red Styling matching PDF */}
            <div className="space-y-1.5 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-rose-500 uppercase tracking-tight leading-snug break-words">
                {currentSlide.title}
              </h2>
              {currentSlide.subtitle && (
                <p className="text-xs sm:text-sm md:text-base text-cyan-300 font-bold">
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Bullet Points or Image Content */}
            {currentSlide.type === 'quote' ? (
              <div className="bg-slate-900/90 border-2 border-rose-500/80 p-5 sm:p-8 text-center space-y-3 sm:space-y-4 my-4 sm:my-6 shadow-2xl rounded-xl">
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-rose-400 tracking-wide font-serif italic leading-relaxed">
                  {currentSlide.quote}
                </p>
                {currentSlide.subtitle && (
                  <p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {currentSlide.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                  <ul className="space-y-2.5 sm:space-y-3">
                    {currentSlide.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm md:text-base font-semibold text-white leading-relaxed">
                        <span className="text-rose-500 font-bold text-base sm:text-lg leading-none mt-0.5 shrink-0">▪</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {currentSlide.alertText && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 border border-rose-500/60 bg-rose-950/40 text-rose-300 font-black text-xs sm:text-sm md:text-base rounded-xl">
                    {currentSlide.alertText}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="pt-3 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 font-semibold gap-2">
            <span className="truncate">Caso Elaine Bromiley • Factores Humanos y VAD</span>
            <span className="text-rose-400 font-bold shrink-0">Pág. {currentSlide.id} / 47</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-slate-900/95 px-5 py-3 border-t border-slate-800 flex items-center justify-between gap-4">
        <button
          onClick={goToPrev}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs px-4 py-2 rounded-2xl transition-all cursor-pointer shadow"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <div className="text-xs font-bold text-slate-300 text-center">
          Página <span className="text-rose-400 font-black">{currentSlideIndex + 1}</span> / <span className="text-white font-black">{totalSlides}</span>
        </div>

        <button
          onClick={goToNext}
          className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs px-5 py-2 rounded-2xl transition-all cursor-pointer shadow-lg shadow-rose-600/30"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Interactive FONA Infographic Component
const FonaInfographicVisual: React.FC<{ onDownload?: () => void }> = ({ onDownload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [customImg] = useState<string>(() => {
    try {
      return localStorage.getItem('anestesiapro_custom_fona_img') || '';
    } catch {
      return '';
    }
  });

  const activeSrc = customImg || '/fona_infografia.svg';

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-4 sm:p-5 border-b border-amber-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 fill-current" /> INFOGRAFÍA TÉCNICA ORIGINAL
            </span>
            <span className="text-cyan-400 font-bold text-xs">Vía Aérea de Emergencia</span>
            {customImg && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Tu archivo original activo
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            PROCEDIMIENTO FONA: ACCESO FRONTAL AL CUELLO - CRICOTIROTOMÍA DE EMERGENCIA
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadOriginalFonaImage()}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            title="Descargar archivo de Imagen"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen</span>
          </button>
          <button
            onClick={() => downloadFonaInfographicPDF()}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            title="Descargar en formato Documento PDF"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* EXACT ORIGINAL INFOGRAPHIC IMAGE POSTER */}
      <div className="p-3 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <Eye className="w-4 h-4 text-amber-400" />
              Infografía Quirúrgica FONA (6 Paneles HD):
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold cursor-pointer"
            >
              - Zoom
            </button>
            <span className="font-mono text-cyan-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold cursor-pointer"
            >
              + Zoom
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg cursor-pointer"
            >
              Restablecer
            </button>
          </div>
        </div>

        <div className="overflow-auto bg-slate-950 rounded-2xl border border-amber-500/30 p-2 flex justify-center items-center min-h-[300px] max-h-[75vh] md:max-h-[85vh]">
          <img
            src={activeSrc}
            alt="Procedimiento FONA - Cricotirotomía de Emergencia"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            className="rounded-xl max-w-full h-auto object-contain max-h-[70vh] md:max-h-[80vh] shadow-2xl transition-transform duration-200"
          />
        </div>
      </div>

      {/* Main Infographic Grid (5 Steps) */}
      <div className="p-4 sm:p-6 bg-slate-900/80 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md shadow-cyan-600/40">
                  1
                </span>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-tight">
                  POSICIONAMIENTO Y LOCALIZACIÓN
                </h4>
              </div>

              {/* Graphic Illustration Placeholder SVG */}
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-5 relative overflow-hidden">
                <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-full flex items-center justify-center mx-auto border border-cyan-500/30">
                  <span className="text-xl">👤</span>
                </div>
                <div className="bg-cyan-950/80 border border-cyan-500/40 rounded px-2 py-1 text-[10px] font-extrabold text-cyan-200">
                  MEMBRANA CRICOTIROIDEA (Objetivo)
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                1. Paciente en supino, cuello extendido. Identificar la membrana cricotiroidea por palpación.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md shadow-cyan-600/40">
                  2
                </span>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-tight">
                  INCISIÓN CUTÁNEA
                </h4>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-5">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                  <span className="text-xl">🔪</span>
                </div>
                <div className="bg-rose-950/80 border border-rose-500/40 rounded px-2 py-1 text-[10px] font-black text-rose-200">
                  INCISIÓN VERTICAL 4 CM
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                2. Incisión vertical en la piel sobre la línea media, centrada en la membrana cricotiroidea.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md shadow-cyan-600/40">
                  3
                </span>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-tight">
                  IDENTIFICACIÓN Y PUNCIÓN
                </h4>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-5">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
                  <span className="text-xl">📍</span>
                </div>
                <div className="bg-amber-950/80 border border-amber-500/40 rounded px-2 py-1 text-[10px] font-extrabold text-amber-200">
                  INCISIÓN TRANSVERSAL DIRECTA
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                3. Profundizar disección roma. Identificar cartílagos. Incisión transversal directa a través de la membrana.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md shadow-cyan-600/40">
                  4
                </span>
                <h4 className="text-xs font-black text-cyan-300 uppercase tracking-tight">
                  DILATACIÓN DEL TRACTO
                </h4>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-5">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/30">
                  <span className="text-xl">✂️</span>
                </div>
                <div className="bg-indigo-950/80 border border-indigo-500/40 rounded px-2 py-1 text-[10px] font-extrabold text-indigo-200">
                  ROTAR BISTURÍ / PINZA ROMA
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                4. Rotar bisturí o insertar pinza roma para dilatar el tracto. Mantener permeabilidad.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-emerald-500/40 flex flex-col justify-between space-y-3 relative group hover:border-emerald-400 transition-all shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md shadow-emerald-600/40">
                  5
                </span>
                <h4 className="text-xs font-black text-emerald-300 uppercase tracking-tight">
                  INSERCIÓN Y CONFIRMACIÓN
                </h4>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center space-y-2 py-5">
                <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-mono text-xs bg-slate-950 p-1 rounded border border-emerald-500/30">
                  <span>CO₂</span>
                  <span className="text-[10px] text-emerald-300 font-bold">/\/\/\</span>
                </div>
                <div className="bg-emerald-950/80 border border-emerald-500/40 rounded px-2 py-1 text-[10px] font-black text-emerald-200">
                  CAPNOGRAFÍA (ESTÁNDAR ORO)
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                5. Insertar tubo de calibre adecuado (ej. 6.0mm). Inflar balón. Confirmar con capnografía y auscultación.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Warning Note Banner */}
        <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border border-rose-500/50 rounded-2xl p-4 text-xs text-rose-200 font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
            <p className="leading-relaxed">
              <strong>NOTA IMPORTANTE:</strong> Este procedimiento es una medida de último recurso en situaciones de crisis de <strong>"No puedo intubar, No puedo oxigenar" (NINO / CICO)</strong>. Realizar bajo protocolos hospitalarios y por personal debidamente entrenado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Interactive Aminofilina & Teofilina CPPD Visual Component
const AminofilinaTeofilinaVisual: React.FC<{ onDownload?: () => void }> = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'infografia' | 'articulos'>('infografia');
  const [customImg] = useState<string>(() => {
    try {
      return localStorage.getItem('anestesiapro_custom_cppd_img') || '';
    } catch {
      return '';
    }
  });

  const activeSrc = customImg || '/cppd_aminofilina_infografia.svg';

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 p-4 sm:p-5 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> INFOGRAFÍA Y REVISIÓN CIENTÍFICA ORIGINAL
            </span>
            <span className="text-amber-300 font-bold text-xs">Dr. Carlos Leal • Educación Continua</span>
            {customImg && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Tu archivo original activo
              </span>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            AMINOFILINA Y TEOFILINA EN MANEJO DE CEFALEA POR PUNCIÓN DURAL (CPPD)
          </h3>
        </div>

        {/* Action Download Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadOriginalAminofilinaImage()}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            title="Descargar archivo de Imagen Infográfica"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen</span>
          </button>
          <button
            onClick={() => downloadAminofilinaIntegratedGuidePDF()}
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            title="Descargar Guía Clínica Integrada en PDF"
          >
            <FileText className="w-4 h-4" />
            <span>Guía Clínica PDF</span>
          </button>
          <button
            onClick={() => downloadAminofilinaMetaanalysisPDF()}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            title="Descargar Metaanálisis Anesth Pain Med 2023 (PDF)"
          >
            <BookMarked className="w-4 h-4" />
            <span>Metaanálisis 2023 (PDF)</span>
          </button>
          <button
            onClick={() => downloadAminofilinaClinicalStudyPDF()}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition-all shadow-md cursor-pointer"
            title="Descargar Estudio Multicéntrico Pain Physician 2016 (PDF)"
          >
            <FileText className="w-4 h-4" />
            <span>Estudio 2016 (PDF)</span>
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('infografia')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'infografia' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Infografía y Fisiopatología</span>
          </button>
          <button
            onClick={() => setActiveTab('articulos')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'articulos' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>Artículos Científicos Originales (PDFs)</span>
          </button>
        </div>

        <span className="text-[11px] font-bold text-cyan-300 hidden sm:inline">
          Archivos Originales Preservados en HD
        </span>
      </div>

      {/* ORIGINAL INFOGRAPHIC IMAGE POSTER */}
      {activeTab === 'infografia' && (
        <div className="space-y-0">
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold flex items-center gap-1.5 text-cyan-300">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  Infografía Científica Oficial CPPD (HD):
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold"
                >
                  - Zoom
                </button>
                <span className="font-mono text-cyan-300 font-bold">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg font-bold"
                >
                  + Zoom
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded-lg"
                >
                  Restablecer
                </button>
              </div>
            </div>

            <div className="overflow-auto bg-slate-950 rounded-2xl border border-cyan-500/30 p-2 flex justify-center items-center min-h-[300px] max-h-[75vh] md:max-h-[85vh]">
              <img
                src={activeSrc}
                alt="Aminofilina y Teofilina en manejo de cefalea por punción dural"
                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
                className="rounded-xl max-w-full h-auto object-contain max-h-[70vh] md:max-h-[80vh] shadow-2xl transition-transform duration-200"
              />
            </div>
          </div>

          {/* Interactive 4-Panel Grid */}
          <div className="p-4 sm:p-6 bg-slate-900/80 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Panel 1 */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-blue-500/30 space-y-3 hover:border-blue-400 transition-all shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">
                    1
                  </span>
                  <h4 className="text-xs font-black text-blue-300 uppercase">
                    FISIOPATOLOGÍA PÉRDIDA LCR
                  </h4>
                </div>
                <div className="bg-blue-950/40 border border-blue-500/20 rounded-xl p-3 text-[11px] text-slate-200 space-y-1.5">
                  <p className="font-bold text-blue-200">MECANISMO PRINCIPAL:</p>
                  <p className="leading-relaxed">
                    La punción dural provoca fuga persistente de LCR ➔ Disminución del volumen e hipotensión intracraneal ➔ Tracción caudal del encéfalo al estar de pie sobre menínges y vasos sensibles ➔ Cefalea postural intensa.
                  </p>
                </div>
              </div>

              {/* Panel 2 */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-amber-500/30 space-y-3 hover:border-amber-400 transition-all shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md">
                    2
                  </span>
                  <h4 className="text-xs font-black text-amber-300 uppercase">
                    FLUJOGRAMA DE MANEJO CPPD
                  </h4>
                </div>
                <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-3 text-[11px] text-slate-200 space-y-1.5">
                  <p className="font-bold text-amber-200">SECUENCIA TERAPÉUTICA:</p>
                  <p className="leading-relaxed">
                    • <strong>Paso 1:</strong> Reposo, Hidratación, Cafeína, Analgésicos.<br />
                    • <strong>Paso 2 (Directo):</strong> Aminofilina 240-480 mg IV lenta o Teofilina oral 250mg c/8h.<br />
                    • <strong>Paso 3:</strong> Parche Hemático Epidural (PHE) si es severa/resistente.
                  </p>
                </div>
              </div>

              {/* Panel 3 */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-teal-500/30 space-y-3 hover:border-teal-400 transition-all shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-teal-500 text-slate-950 rounded-full flex items-center justify-center font-black text-xs shadow-md">
                    3
                  </span>
                  <h4 className="text-xs font-black text-teal-300 uppercase">
                    MECANISMO DE ACCIÓN
                  </h4>
                </div>
                <div className="bg-teal-950/40 border border-teal-500/20 rounded-xl p-3 text-[11px] text-slate-200 space-y-1.5">
                  <p className="font-bold text-teal-200">ACCIONES FARMACOLÓGICAS:</p>
                  <p className="leading-relaxed">
                    • Antagonista de receptores de Adenosina A1/A2 ➔ Vasoconstricción cerebral.<br />
                    • Inhibidor PDE (↑ cAMP).<br />
                    • Estimula bomba Na+/K+ ➔ ↑ Producción y secreción de LCR en plexos coroideos.
                  </p>
                </div>
              </div>

              {/* Panel 4 */}
              <div className="bg-slate-950 rounded-2xl p-4 border border-purple-500/30 space-y-3 hover:border-purple-400 transition-all shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-md">
                    4
                  </span>
                  <h4 className="text-xs font-black text-purple-300 uppercase">
                    EVIDENCIA CIENTÍFICA
                  </h4>
                </div>
                <div className="bg-purple-950/40 border border-purple-500/20 rounded-xl p-3 text-[11px] text-slate-200 space-y-1.5">
                  <p className="font-bold text-purple-200">METANÁLISIS & ESTUDIOS:</p>
                  <p className="leading-relaxed">
                    • <strong>Metaanálisis 2023:</strong> SMD = -1.67 (p &lt; 0.001) vs placebo.<br />
                    • <strong>Pain Physician 2016:</strong> Disminución de dolor VAS 7.72 ➔ 0.81. 93.8% de tasa de resolución a las 48h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ARTICLES / ORIGINAL PDF PAPERS TAB */}
      {activeTab === 'articulos' && (
        <div className="p-4 sm:p-6 bg-slate-900 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Paper 1 Card */}
            <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-blue-500/20 text-blue-300 font-black px-2.5 py-1 rounded-md border border-blue-500/40 text-[10px] sm:text-xs">
                  REVISIÓN SISTEMÁTICA Y METAANÁLISIS (2023)
                </span>
                <span className="text-slate-400 font-mono text-xs">13 Páginas</span>
              </div>

              {/* Miniatura / Fotico del Artículo Original 1 */}
              <a 
                href="/Articulo_1_Metaanalisis_Aminofilina_Teofilina_2023.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => recordGlobalDownload('res-articulo-metaanalisis-aminofilina-2023')}
                className="block relative group/cover rounded-xl overflow-hidden border border-blue-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/60 p-3.5 shadow-inner hover:border-blue-400 transition-all"
                title="Presiona para abrir el PDF completo"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-300 bg-blue-950/90 px-2 py-0.5 rounded border border-blue-500/40">
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>DOCUMENTO PDF ORIGINAL CIENTÍFICO</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                    HD • 13 PÁGS
                  </span>
                </div>
                
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2 relative">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 bg-blue-600/20 border border-blue-500/40 rounded-lg flex flex-col items-center justify-center shrink-0 shadow">
                      <FileText className="w-6 h-6 text-blue-400" />
                      <span className="text-[8px] font-black text-blue-300">PDF</span>
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-tight truncate">
                        Anesthesia and Pain Medicine (2023)
                      </p>
                      <p className="text-[11px] font-extrabold text-white line-clamp-2 leading-tight">
                        Post-dural puncture headache prevention and treatment with aminophylline or theophylline
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 font-semibold">
                    <span className="truncate max-w-[180px]">Reza Barati-Boldaji et al.</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Ver / Abrir PDF
                    </span>
                  </div>
                </div>
              </a>

              <h4 className="text-sm font-black text-white leading-snug">
                Post-dural puncture headache prevention and treatment with aminophylline or theophylline: a systematic review and meta-analysis
              </h4>

              <p className="text-xs text-cyan-300 font-bold">
                Anesthesia and Pain Medicine (2023) • Reza Barati-Boldaji et al.
              </p>

              <div className="bg-slate-900 rounded-xl p-3 text-xs text-slate-300 leading-relaxed space-y-2 border border-slate-800">
                <p className="font-bold text-white">Resumen de hallazgos:</p>
                <p>
                  Evaluación de 15 ensayos clínicos aleatorizados. Demuestra reducción estadísticamente significativa de la intensidad del dolor (SMD -1.67, p &lt; 0.001) y disminución de la necesidad de parche hemático epidural invasivo.
                </p>
              </div>

              {/* Botones de Descarga directa para Celulares y Laptops */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    recordGlobalDownload('res-articulo-metaanalisis-aminofilina-2023');
                    downloadAminofilinaMetaanalysisPDF();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer text-center"
                  title="Descargar PDF original directamente a tu dispositivo"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Descargar PDF Metaanálisis 2023</span>
                </button>

                <a
                  href="/Articulo_1_Metaanalisis_Aminofilina_Teofilina_2023.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordGlobalDownload('res-articulo-metaanalisis-aminofilina-2023')}
                  className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  title="Abrir PDF en pantalla completa"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Abrir PDF Completo</span>
                </a>
              </div>
            </div>

            {/* Paper 2 Card */}
            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-amber-500/20 text-amber-300 font-black px-2.5 py-1 rounded-md border border-amber-500/40 text-[10px] sm:text-xs">
                  ESTUDIO CLÍNICO MULTICÉNTRICO (2016)
                </span>
                <span className="text-slate-400 font-mono text-xs">5 Páginas</span>
              </div>

              {/* Miniatura / Fotico del Artículo Original 2 */}
              <a 
                href="/Articulo_2_Estudio_Multicentrico_Aminofilina_2016.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => recordGlobalDownload('res-articulo-estudio-aminofilina-2016')}
                className="block relative group/cover rounded-xl overflow-hidden border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/60 p-3.5 shadow-inner hover:border-amber-400 transition-all"
                title="Presiona para abrir el PDF completo"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/40">
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>DOCUMENTO PDF ORIGINAL CIENTÍFICO</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                    HD • 5 PÁGS
                  </span>
                </div>
                
                <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2 relative">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-12 bg-amber-600/20 border border-amber-500/40 rounded-lg flex flex-col items-center justify-center shrink-0 shadow">
                      <FileText className="w-6 h-6 text-amber-400" />
                      <span className="text-[8px] font-black text-amber-300">PDF</span>
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-tight truncate">
                        Pain Physician Journal (2016)
                      </p>
                      <p className="text-[11px] font-extrabold text-white line-clamp-2 leading-tight">
                        A Multicenter Clinical Study on Treating Post-Dural Puncture Headache
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-300 font-semibold">
                    <span className="truncate max-w-[180px]">Chuanjie Wu, Yajun Lian et al.</span>
                    <span className="text-emerald-400 font-black flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Ver / Abrir PDF
                    </span>
                  </div>
                </div>
              </a>

              <h4 className="text-sm font-black text-white leading-snug">
                A Multicenter Clinical Study on Treating Post-Dural Puncture Headache with an Intravenous Injection of Aminophylline
              </h4>

              <p className="text-xs text-amber-300 font-bold">
                Pain Physician Journal (2016) • Chuanjie Wu, Yajun Lian et al.
              </p>

              <div className="bg-slate-900 rounded-xl p-3 text-xs text-slate-300 leading-relaxed space-y-2 border border-slate-800">
                <p className="font-bold text-white">Resumen de hallazgos:</p>
                <p>
                  Estudio prospectivo multicéntrico con infusión IV de 250 mg de aminofilina. Demostró una caída del dolor en escala VAS de 7.72 a 4.84 a los 30 minutos y a 0.81 a las 48 horas, alcanzando 93.8% de éxito clínico.
                </p>
              </div>

              {/* Botones de Descarga directa para Celulares y Laptops */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  onClick={() => {
                    recordGlobalDownload('res-articulo-estudio-aminofilina-2016');
                    downloadAminofilinaClinicalStudyPDF();
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer text-center"
                  title="Descargar PDF original directamente a tu dispositivo"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Descargar PDF Estudio 2016</span>
                </button>

                <a
                  href="/Articulo_2_Estudio_Multicentrico_Aminofilina_2016.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => recordGlobalDownload('res-articulo-estudio-aminofilina-2016')}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  title="Abrir PDF en pantalla completa"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Abrir PDF Completo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// EL ENFOQUE VORTEX EN VÍA AÉREA DIFÍCIL (DR. NICHOLAS CHRIMES)
// Componente modularizado en /src/components/education/VortexApproachVisualizer.tsx
// =========================================================================

// =========================================================================
// SISTEMA OREXINA / HIPOCRETINA: EL INTERRUPTOR DEL DESPERTAR EN ANESTESIA
// =========================================================================

interface OrexinVisualProps {
  onDownload?: () => void;
}

const OrexinCircuitVisualizer: React.FC<OrexinVisualProps> = ({ onDownload }) => {
  const [activeTab, setActiveTab] = useState<'circuito' | 'eeg_bis' | 'pasos' | 'farmacos' | 'evidencia'>('circuito');
  const [circuitState, setCircuitState] = useState<'ox2r_active' | 'anesthesia' | 'dora_blocked' | 'normal'>('ox2r_active');
  const [selectedStep, setSelectedStep] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const stepsData = [
    {
      step: 1,
      tag: 'FASE 1: ANATOMÍA & FISIOLOGÍA',
      title: 'Fundamento Neuroquímico: El Circuito del Hipotálamo Lateral',
      shortDesc: '70.000 neuronas orexinérgicas controlan la compuerta global del despertar cortical y la vigilia.',
      actionClave: 'Identificar la red hipotalámica lateral como el interruptor maestro que orquesta la vigilia y el tono ventilatorio.',
      proTip: 'Representan menos del 0.001% de las neuronas cerebrales, pero sus axones abarcan todo el neuroeje activando acetilcolina, noradrenalina y serotonina.',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
    },
    {
      step: 2,
      tag: 'FASE 2: INHIBICIÓN ANESTÉSICA',
      title: 'Inhibición por Anestésicos Generales: Apagado del Sistema',
      shortDesc: 'Sevoflurano, Propofol e Isoflurano suprimen directamente el disparo de las neuronas de orexina.',
      actionClave: 'Comprender que el estado hipnótico quirúrgico se sostiene por la supresión activa del tono orexinérgico mediada por receptores GABA-A.',
      proTip: 'El despertar clásico es pasivo y lento porque depende de la eliminación y redistribución pulmonar o hepática de las moléculas anestésicas.',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-300'
    },
    {
      step: 3,
      tag: 'FASE 3: AGONISMO OX2R',
      title: 'Activación Selectiva con Agonistas OX2R: Danavorexton (TAK-925)',
      shortDesc: 'Cruza la BHE e induce una "Emergencia Activa" instantánea en menos de 3 minutos.',
      actionClave: 'Administrar Danavorexton (TAK-925) o análogos para forzar la sincronización talamocortical sin requerir lavado previo del anestésico.',
      proTip: 'No compite directamente con GABA-A en su sitio de unión; activa una vía excitatoria paralela fisiológicamente dominante.',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300'
    },
    {
      step: 4,
      tag: 'FASE 4: ANTAGONISMO DORA',
      title: 'Antagonismo DORA (Suvorexant / Lemborexant): El Freno de la Vigilia',
      shortDesc: 'Bloqueo dual OX1R/OX2R que prolonga la latencia del despertar y la estancia en URPA/PACU.',
      actionClave: 'Interrogar activamente en la consulta preanestésica el uso nocturno de inductores del sueño tipo DORA para anticipar demoras en el despertar.',
      proTip: 'Demuestra el control bidireccional del sistema: agonistas encienden la vigilia y antagonistas facilitan o profundizan la sedación.',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300'
    },
    {
      step: 5,
      tag: 'FASE 5: RESCATE VENTILATORIO & BIS',
      title: 'Rescate Ventilatorio & Monitorización BIS sin Pérdida de Analgesia',
      shortDesc: 'Estimulación del centro respiratorio bulbar pre-Bötzinger manteniendo intacta la analgesia opioide.',
      actionClave: 'Vigilar la recuperación de volumen minuto y el salto cuantitativo del BIS (de <40 a >80 en <180s) frente a depresión respiratoria por anestésicos.',
      proTip: 'A diferencia de la Naloxona (que causa dolor explosivo al revertir receptores mu), el agonismo OX2R reactiva la ventilación sin generar crisis hiperalgésica.',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300'
    }
  ];

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-emerald-500/40 shadow-2xl space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''}`}>
      {/* Hero Visual Graphic Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-teal-950/90 to-indigo-950 border-b border-emerald-500/30 p-4 sm:p-6">
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Brain className="w-80 h-80 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 p-0.5 shadow-xl shadow-emerald-500/20 shrink-0 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-emerald-400">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse text-emerald-400" />
                <span className="text-[8px] font-black tracking-widest uppercase text-emerald-300 mt-0.5">OX2R 2026</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  NEUROQUÍMICA DE LA VIGILIA
                </span>
                <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  Emergencia Activa &lt; 3 min
                </span>
              </div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                El 'Interruptor' Neuroquímico del Despertar: Sistema Orexina (Hipocretina)
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                Demostración mecanicista del control farmacológico de la conciencia: agonistas OX2R (Danavorexton / TAK-925), bloqueo dual DORA (Suvorexant) y reactivación del comando respiratorio bulbar pre-Bötzinger sin abolir analgesia opioide.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3 shrink-0 flex flex-row md:flex-col gap-2 items-center justify-center text-center shadow-lg">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Transición BIS</div>
            <div className="flex items-center gap-1.5 font-mono font-black text-xs">
              <span className="text-rose-400 bg-rose-950/60 px-2 py-1 rounded border border-rose-800">BIS &lt;40</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-700 animate-pulse">BIS &gt;80</span>
            </div>
            <span className="text-[9px] text-slate-400">Emergencia en ~150 segundos</span>
          </div>
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-indigo-950 p-4 sm:p-5 border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Brain className="w-3.5 h-3.5 fill-current text-slate-950" />
              ACTUALIZACIÓN NEUROANESTESIA 2026
            </span>
            <span className="text-emerald-300 font-bold text-xs">Nature Neuroscience / PNAS / BJA / ASA</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            El 'Interruptor' Neuroquímico del Despertar: El Sistema Orexina (Hipocretina) en Anestesia General
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              if (onDownload) onDownload();
              else downloadOrexinDespertarPDF();
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            title="Descargar Artículo y Guía Oficial en PDF"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Descargar Guía en PDF</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Summary Highlights Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-slate-950/80 border border-emerald-500/30 p-2 rounded-xl space-y-0.5">
          <div className="text-[10px] font-extrabold text-emerald-400 uppercase">Centro Maestro</div>
          <div className="text-xs sm:text-sm font-black text-white">Hipotálamo Lateral</div>
          <div className="text-[9px] text-slate-400">~70.000 neuronas orexinérgicas</div>
        </div>
        <div className="bg-slate-950/80 border border-cyan-500/30 p-2 rounded-xl space-y-0.5">
          <div className="text-[10px] font-extrabold text-cyan-400 uppercase">Diana Terapéutica</div>
          <div className="text-xs sm:text-sm font-black text-white">Agonistas OX2R</div>
          <div className="text-[9px] text-slate-400">Danavorexton / TAK-925</div>
        </div>
        <div className="bg-slate-950/80 border border-purple-500/30 p-2 rounded-xl space-y-0.5">
          <div className="text-[10px] font-extrabold text-purple-400 uppercase">Emergencia Activa</div>
          <div className="text-xs sm:text-sm font-black text-white">&lt; 3 Minutos</div>
          <div className="text-[9px] text-slate-400">BIS de &lt;40 a &gt;80 instantáneo</div>
        </div>
        <div className="bg-slate-950/80 border border-amber-500/30 p-2 rounded-xl space-y-0.5">
          <div className="text-[10px] font-extrabold text-amber-400 uppercase">Seguridad Clínica</div>
          <div className="text-xs sm:text-sm font-black text-white">Analgesia Intacta</div>
          <div className="text-[9px] text-slate-400">Sin hiperalgesia (vs Naloxona)</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('circuito')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'circuito' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Circuito & 'Interruptor'</span>
          </button>

          <button
            onClick={() => setActiveTab('eeg_bis')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'eeg_bis' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulador EEG & BIS</span>
          </button>

          <button
            onClick={() => setActiveTab('pasos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pasos' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fases Clínicas (5 Pasos)</span>
          </button>

          <button
            onClick={() => setActiveTab('farmacos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'farmacos' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Ficha & Comparativa</span>
          </button>

          <button
            onClick={() => setActiveTab('evidencia')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidencia' 
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Evidencia & 6 Perlas</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CIRCUITO & INTERRUPTOR MAESTRO INTERACTIVO */}
      {activeTab === 'circuito' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Interactive State Selector */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                Selecciona el estado farmacológico para simular el 'Interruptor':
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Control en Tiempo Real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                onClick={() => setCircuitState('ox2r_active')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  circuitState === 'ox2r_active'
                    ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    Emergencia Activa OX2R
                  </span>
                  <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded font-black">TAK-925</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Danavorexton despolariza receptores OX2R; ondas beta y despertar en &lt;3 min.
                </p>
              </button>

              <button
                onClick={() => setCircuitState('anesthesia')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  circuitState === 'anesthesia'
                    ? 'bg-rose-950/80 border-rose-400 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Anestesia General Profunda
                  </span>
                  <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black">GABA</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Sevoflurano / Propofol inhiben neuronas de orexina; burst suppression y BIS &lt;35.
                </p>
              </button>

              <button
                onClick={() => setCircuitState('dora_blocked')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  circuitState === 'dora_blocked'
                    ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    Bloqueo DORA
                  </span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black">Suvorexant</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Antagonistas duales bloquean OX1R/OX2R; retraso de emergencia en URPA.
                </p>
              </button>

              <button
                onClick={() => setCircuitState('normal')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                  circuitState === 'normal'
                    ? 'bg-cyan-950/80 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    Vigilia Fisiológica Basal
                  </span>
                  <span className="text-[10px] bg-cyan-500 text-slate-950 px-1.5 py-0.5 rounded font-black">Control</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Tono natural orexinérgico; homeostasis del ciclo sueño-vigilia diurno.
                </p>
              </button>
            </div>
          </div>

          {/* Circuit Schema Diagram (SVG Visual) */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl font-bold text-xs ${
                  circuitState === 'ox2r_active' ? 'bg-emerald-500 text-slate-950' :
                  circuitState === 'anesthesia' ? 'bg-rose-500 text-white' :
                  circuitState === 'dora_blocked' ? 'bg-amber-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                }`}>
                  {circuitState === 'ox2r_active' && '⚡ INTERRUPTOR ENCENDIDO (EMERGENCIA ACTIVA)'}
                  {circuitState === 'anesthesia' && '🛑 INTERRUPTOR APAGADO (INHIBICIÓN GABA)'}
                  {circuitState === 'dora_blocked' && '💤 INTERRUPTOR BLOQUEADO (ANTAGONISMO DORA)'}
                  {circuitState === 'normal' && '🧠 INTERRUPTOR EN TONO BASAL (VIGILIA)'}
                </div>
                <span className="text-xs font-mono text-slate-400 font-bold">
                  BIS: {circuitState === 'ox2r_active' ? '88-95 (Despierto)' :
                        circuitState === 'anesthesia' ? '28-35 (Plano Profundo)' :
                        circuitState === 'dora_blocked' ? '45-55 (Sedación Residual)' : '98 (Alerta Normal)'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-semibold">
                <span>Ventilación Bulbar:</span>
                <span className={`font-black ${
                  circuitState === 'ox2r_active' ? 'text-emerald-400' :
                  circuitState === 'anesthesia' ? 'text-rose-400' :
                  circuitState === 'dora_blocked' ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {circuitState === 'ox2r_active' ? 'Estimulada (VM +35%)' :
                   circuitState === 'anesthesia' ? 'Deprimida por Anestésicos' :
                   circuitState === 'dora_blocked' ? 'Lenta / Hipoventilación' : 'Espontánea Eupneica'}
                </span>
              </div>
            </div>

            {/* Neural Schematic SVG */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-6 relative">
              <svg viewBox="0 0 700 360" className="w-full h-auto max-h-[380px]">
                <defs>
                  <linearGradient id="hypoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="cortexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#0e7490" />
                  </linearGradient>
                  <linearGradient id="thalamusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6d28d9" />
                  </linearGradient>
                </defs>

                {/* Connecting Pathway Lines */}
                {/* Lateral Hypothalamus to Thalamus */}
                <path
                  d="M 350 180 L 220 100"
                  stroke={circuitState === 'ox2r_active' ? '#10b981' : circuitState === 'anesthesia' ? '#ef4444' : '#64748b'}
                  strokeWidth={circuitState === 'ox2r_active' ? "4" : "2"}
                  strokeDasharray={circuitState === 'anesthesia' ? "6,6" : "none"}
                  fill="none"
                />
                {/* Lateral Hypothalamus to Prefrontal Cortex */}
                <path
                  d="M 350 180 L 480 100"
                  stroke={circuitState === 'ox2r_active' ? '#10b981' : circuitState === 'anesthesia' ? '#ef4444' : '#64748b'}
                  strokeWidth={circuitState === 'ox2r_active' ? "4" : "2"}
                  strokeDasharray={circuitState === 'anesthesia' ? "6,6" : "none"}
                  fill="none"
                />
                {/* Lateral Hypothalamus to Locus Coeruleus */}
                <path
                  d="M 350 180 L 170 270"
                  stroke={circuitState === 'ox2r_active' ? '#10b981' : circuitState === 'anesthesia' ? '#ef4444' : '#64748b'}
                  strokeWidth={circuitState === 'ox2r_active' ? "4" : "2"}
                  strokeDasharray={circuitState === 'anesthesia' ? "6,6" : "none"}
                  fill="none"
                />
                {/* Lateral Hypothalamus to Basal Forebrain */}
                <path
                  d="M 350 180 L 530 270"
                  stroke={circuitState === 'ox2r_active' ? '#10b981' : circuitState === 'anesthesia' ? '#ef4444' : '#64748b'}
                  strokeWidth={circuitState === 'ox2r_active' ? "4" : "2"}
                  strokeDasharray={circuitState === 'anesthesia' ? "6,6" : "none"}
                  fill="none"
                />
                {/* Lateral Hypothalamus to Medullary Respiratory Center */}
                <path
                  d="M 350 180 L 350 310"
                  stroke={circuitState === 'ox2r_active' ? '#34d399' : circuitState === 'anesthesia' ? '#f87171' : '#64748b'}
                  strokeWidth={circuitState === 'ox2r_active' ? "5" : "2"}
                  strokeDasharray={circuitState === 'anesthesia' ? "6,6" : "none"}
                  fill="none"
                />

                {/* Central Node: Lateral Hypothalamus (Interruptor Maestro) */}
                <g transform="translate(350, 180)">
                  <circle
                    r="52"
                    fill={
                      circuitState === 'ox2r_active' ? '#065f46' :
                      circuitState === 'anesthesia' ? '#881337' :
                      circuitState === 'dora_blocked' ? '#78350f' : '#0f766e'
                    }
                    stroke={
                      circuitState === 'ox2r_active' ? '#34d399' :
                      circuitState === 'anesthesia' ? '#f43f5e' :
                      circuitState === 'dora_blocked' ? '#f59e0b' : '#2dd4bf'
                    }
                    strokeWidth="3"
                  />
                  <text textAnchor="middle" y="-14" fill="#ffffff" fontSize="11" fontWeight="bold">HIPOTÁLAMO</text>
                  <text textAnchor="middle" y="0" fill="#ffffff" fontSize="11" fontWeight="bold">LATERAL</text>
                  <text textAnchor="middle" y="14" fill={circuitState === 'ox2r_active' ? '#a7f3d0' : '#fecdd3'} fontSize="8" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'OX2R DISPARANDO' :
                     circuitState === 'anesthesia' ? 'GABA SUPRIMIDO' :
                     circuitState === 'dora_blocked' ? 'OX1/2R BLOQUEADOS' : '70.000 neuronas'}
                  </text>
                  <text textAnchor="middle" y="26" fill="#cbd5e1" fontSize="7">Orexina-A & Orexina-B</text>
                </g>

                {/* Node: Thalamus */}
                <g transform="translate(220, 100)">
                  <rect x="-70" y="-30" width="140" height="60" rx="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                  <text textAnchor="middle" y="-10" fill="#c7d2fe" fontSize="10" fontWeight="bold">TÁLAMO</text>
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="8">Núcleos Intralaminares</text>
                  <text textAnchor="middle" y="18" fill={circuitState === 'ox2r_active' ? '#34d399' : '#f87171'} fontSize="8" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'Sincronización Beta' : 'Ondas Lentas / Delta'}
                  </text>
                </g>

                {/* Node: Prefrontal Cortex */}
                <g transform="translate(480, 100)">
                  <rect x="-75" y="-30" width="150" height="60" rx="14" fill="#083344" stroke="#22d3ee" strokeWidth="2" />
                  <text textAnchor="middle" y="-10" fill="#a5f3fc" fontSize="10" fontWeight="bold">CÓRTEX PREFRONTAL</text>
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="8">Conciencia & Ejecución</text>
                  <text textAnchor="middle" y="18" fill={circuitState === 'ox2r_active' ? '#34d399' : '#f87171'} fontSize="8" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'Vigilia & Orientación' : 'Pérdida de Conciencia'}
                  </text>
                </g>

                {/* Node: Locus Coeruleus */}
                <g transform="translate(170, 270)">
                  <rect x="-65" y="-28" width="130" height="56" rx="12" fill="#312e81" stroke="#a78bfa" strokeWidth="2" />
                  <text textAnchor="middle" y="-10" fill="#ddd6fe" fontSize="10" fontWeight="bold">LOCUS COERULEUS</text>
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="8">Noradrenalina (NE)</text>
                  <text textAnchor="middle" y="18" fill={circuitState === 'ox2r_active' ? '#34d399' : '#f87171'} fontSize="8" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'Tono Simpático Activo' : 'Tono NE Silenciado'}
                  </text>
                </g>

                {/* Node: Basal Forebrain */}
                <g transform="translate(530, 270)">
                  <rect x="-70" y="-28" width="140" height="56" rx="12" fill="#14532d" stroke="#4ade80" strokeWidth="2" />
                  <text textAnchor="middle" y="-10" fill="#bbf7d0" fontSize="10" fontWeight="bold">PROSENCÉFALO BASAL</text>
                  <text textAnchor="middle" y="4" fill="#ffffff" fontSize="8">Acetilcolina (ACh)</text>
                  <text textAnchor="middle" y="18" fill={circuitState === 'ox2r_active' ? '#34d399' : '#f87171'} fontSize="8" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'Liberación Masiva ACh' : 'Supresión Colinérgica'}
                  </text>
                </g>

                {/* Node: Medullary Respiratory Center (Drive Respiratorio) */}
                <g transform="translate(350, 310)">
                  <rect x="-90" y="-24" width="180" height="48" rx="12" fill="#701a75" stroke="#f472b6" strokeWidth="2" />
                  <text textAnchor="middle" y="-7" fill="#fbcfe8" fontSize="10" fontWeight="bold">CENTRO RESPIRATORIO BULBAR</text>
                  <text textAnchor="middle" y="7" fill="#ffffff" fontSize="8">Complejo pre-Bötzinger / FR</text>
                  <text textAnchor="middle" y="17" fill={circuitState === 'ox2r_active' ? '#34d399' : '#f87171'} fontSize="7.5" fontWeight="bold">
                    {circuitState === 'ox2r_active' ? 'Ventilación Restaurada (Analgesia Intacta)' : 'Depresión por Anestésicos'}
                  </text>
                </g>
              </svg>
            </div>

            {/* Dynamic Status Explanation Card */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
              circuitState === 'ox2r_active'
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-100'
                : circuitState === 'anesthesia'
                ? 'bg-rose-950/50 border-rose-500/40 text-rose-100'
                : circuitState === 'dora_blocked'
                ? 'bg-amber-950/50 border-amber-500/40 text-amber-100'
                : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-100'
            }`}>
              <div className="font-bold flex items-center justify-between text-sm">
                <span>
                  {circuitState === 'ox2r_active' && '✅ EFECTO DEL AGONISMO OX2R (DANAVOREXTON / TAK-925):'}
                  {circuitState === 'anesthesia' && '⚠️ EFECTO DE LA ANESTESIA GENERAL (GABA-A):'}
                  {circuitState === 'dora_blocked' && '⚠️ EFECTO DEL ANTAGONISMO DORA (SUVOREXANT):'}
                  {circuitState === 'normal' && 'ℹ️ ESTADO BASAL FISIOLÓGICO:'}
                </span>
                <span className="font-mono text-xs opacity-90">
                  {circuitState === 'ox2r_active' && 'Despertar Activo en <3 min'}
                  {circuitState === 'anesthesia' && 'Despertar Pasivo (20-35 min)'}
                  {circuitState === 'dora_blocked' && 'Retardo en PACU (+18 min)'}
                  {circuitState === 'normal' && 'Vigilia Natural'}
                </span>
              </div>
              <p>
                {circuitState === 'ox2r_active' &&
                  'El agonista selectivo OX2R despolariza la red orexinérgica del hipotálamo lateral. Esto dispara una cascada excitatoria inmediata de acetilcolina en el prosencéfalo basal y noradrenalina en el locus coeruleus, sincronizando el tálamo y el córtex prefrontal en ritmos beta de vigilia. Simultáneamente excita el centro respiratorio bulbar, incrementando el volumen minuto sin tocar los receptores opioides mu (cero crisis hiperalgésica).'}
                {circuitState === 'anesthesia' &&
                  'Los agentes halogenados (Sevoflurano, Isoflurano, Desflurano) y Propofol potencian fuertemente los receptores GABA-A e inhiben las neuronas de orexina. Al apagarse este interruptor maestro, el córtex entra en sincronización de ondas lentas delta y burst suppression (BIS <35). El paciente no despertará hasta que los fármacos se eliminen pasivamente del organismo.'}
                {circuitState === 'dora_blocked' &&
                  'Los fármacos DORA (Dual Orexin Receptor Antagonists) como Suvorexant y Lemborexant bloquean competitivamente los receptores OX1R y OX2R. Su administración preoperatoria o uso habitual nocturno retrasa la emergencia anestésica, prolonga el tiempo de estancia en URPA/PACU y causa sedación residual.'}
                {circuitState === 'normal' &&
                  'En vigilia no anestesiada, las 70.000 neuronas orexinérgicas disparan tónicamente para mantener la alerta, la atención ejecutiva, la estabilidad postural y el drive respiratorio fisiológico durante las horas de actividad diurna.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SIMULADOR EEG & BIS */}
      {activeTab === 'eeg_bis' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Monitorización Neurofisiológica: Transición EEG & Índice Biespectral (BIS)
                </h4>
                <p className="text-xs text-slate-300">
                  Comparativa de la velocidad de recuperación entre Emergencia Activa (OX2R) y Despertar Tradicional Pasivo.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl">
                  Curva en Tiempo Real
                </span>
              </div>
            </div>

            {/* EEG Waveform Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Deep Anesthesia EEG */}
              <div className="bg-slate-950 border border-rose-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    1. Estado Anestésico Profundo (Sevoflurano / Propofol)
                  </span>
                  <span className="font-mono font-black text-rose-400">BIS 25 - 35</span>
                </div>

                <div className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-3 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 300 60" className="w-full h-full">
                    {/* Slow Delta / Burst suppression wave */}
                    <path
                      d="M 0 30 Q 30 5 60 30 T 120 30 Q 150 55 180 30 L 240 30 Q 270 10 300 30"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-rose-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-rose-500/30">
                    Ondas Delta Lentas & Burst Suppression
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Supresión casi total de la actividad orexinérgica cortical. Despolarizaciones esporádicas y sincronización de bajo voltaje.
                </p>
              </div>

              {/* Active Emergence EEG */}
              <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    2. Emergencia Activa con Agonista OX2R (Danavorexton)
                  </span>
                  <span className="font-mono font-black text-emerald-400">BIS 85 - 95 (&lt;3 min)</span>
                </div>

                <div className="h-24 bg-slate-900 rounded-xl border border-slate-800 p-3 flex items-center justify-center relative overflow-hidden">
                  <svg viewBox="0 0 300 60" className="w-full h-full">
                    {/* Rapid Beta / Desynchronized wave */}
                    <path
                      d="M 0 30 Q 8 10 15 30 T 30 30 Q 38 48 45 30 T 60 30 Q 68 12 75 30 T 90 30 Q 98 46 105 30 T 120 30 Q 128 15 135 30 T 150 30 Q 158 45 165 30 T 180 30 Q 188 12 195 30 T 210 30 Q 218 48 225 30 T 240 30 Q 248 10 255 30 T 270 30 Q 278 47 285 30 T 300 30"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="absolute bottom-2 right-2 text-[9px] font-mono text-emerald-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Ritmo Beta Rápido de Vigilia
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Desincronización talamocortical inmediata. Retorno a ritmo beta activo y reflejos protectores de vía aérea sin rebote.
                </p>
              </div>
            </div>

            {/* Latency Comparison Chart */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="text-xs font-bold text-slate-200">
                Comparativa de Tiempos de Extubación & Recuperación Cognitiva:
              </div>

              <div className="space-y-3">
                {/* Traditional Emergence */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold text-rose-300">Despertar Pasivo Tradicional (Eliminación Farmacológica):</span>
                    <span className="font-mono font-bold text-rose-400">22 a 35 minutos</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-rose-600 to-amber-600 h-full rounded-full w-[85%]" />
                  </div>
                </div>

                {/* Active Emergence with Danavorexton */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold text-emerald-300">Emergencia Activa con Agonista OX2R (Danavorexton / TAK-925):</span>
                    <span className="font-mono font-bold text-emerald-400">2.5 a 4.0 minutos (-65% tiempo)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full w-[15%]" />
                  </div>
                </div>

                {/* DORA pretreated */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span className="font-semibold text-amber-300">Paciente con Terapia DORA Nocturna (Suvorexant):</span>
                    <span className="font-mono font-bold text-amber-400">38 a 55 minutos (+18.4 min retraso)</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FASES CLÍNICAS (5 PASOS) */}
      {activeTab === 'pasos' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {stepsData.map((st) => (
              <button
                key={st.step}
                onClick={() => setSelectedStep(st.step)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                  selectedStep === st.step
                    ? `${st.color} ring-2 ring-emerald-400/40 shadow-lg`
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-slate-950 font-black text-xs flex items-center justify-center border border-white/20">
                    {st.step}
                  </span>
                  <span className="text-[9px] font-bold uppercase opacity-80">Paso {st.step}</span>
                </div>
                <h5 className="text-xs font-black line-clamp-2">{st.title}</h5>
                <p className="text-[10px] text-slate-300 line-clamp-2">{st.shortDesc}</p>
              </button>
            ))}
          </div>

          {/* Detailed Selected Step View */}
          {(() => {
            const current = stepsData.find(s => s.step === selectedStep) || stepsData[0];
            return (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-xl">
                      PASO {current.step} DE 5
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">{current.tag}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Técnica y Mecanismo Neuroquímico</span>
                </div>

                <h4 className="text-base sm:text-lg font-black text-white">{current.title}</h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{current.shortDesc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span>ACCIÓN CLÍNICA CLAVE:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {current.actionClave}
                    </p>
                  </div>

                  <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-black text-amber-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>PERLA CLÍNICA / PRO-TIP:</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {current.proTip}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 4: FICHA TÉCNICA & COMPARATIVA */}
      {activeTab === 'farmacos' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="space-y-1">
              <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                Ficha Farmacológica Comparativa: Moduladores de Orexina vs Anestésicos
              </h4>
              <p className="text-xs text-slate-300">
                Resumen de receptores, impacto en conciencia, reflejos de vía aérea y estatus regulatorio.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-300">
                    <th className="p-3 font-bold">Fármaco / Molécula</th>
                    <th className="p-3 font-bold">Diana / Receptor</th>
                    <th className="p-3 font-bold">Impacto en Conciencia</th>
                    <th className="p-3 font-bold">Drive Respiratorio</th>
                    <th className="p-3 font-bold">Efecto en Analgesia</th>
                    <th className="p-3 font-bold">Estatus Clínico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                  <tr className="bg-emerald-950/20 hover:bg-emerald-950/40">
                    <td className="p-3 font-black text-emerald-300">Danavorexton (TAK-925)</td>
                    <td className="p-3 font-mono text-cyan-300">Agonista Selectivo OX2R</td>
                    <td className="p-3 text-emerald-400 font-bold">Emergencia Activa (&lt;3 min)</td>
                    <td className="p-3 text-emerald-400 font-bold">Estimulación bulbar (+35%)</td>
                    <td className="p-3 text-emerald-300 font-bold">Intacta (No hiperalgesia)</td>
                    <td className="p-3"><span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">Fase 2 Clínica</span></td>
                  </tr>
                  <tr className="bg-amber-950/15 hover:bg-amber-950/30">
                    <td className="p-3 font-black text-amber-300">Suvorexant / Lemborexant</td>
                    <td className="p-3 font-mono text-amber-200">Antagonista Dual OX1R/OX2R</td>
                    <td className="p-3 text-amber-400">Retardo en Despertar (+18 min)</td>
                    <td className="p-3 text-slate-300">Depresión Leve / Sedación</td>
                    <td className="p-3 text-slate-300">Sin cambio</td>
                    <td className="p-3"><span className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] font-black">Aprobado FDA (Sueño)</span></td>
                  </tr>
                  <tr className="bg-purple-950/15 hover:bg-purple-950/30">
                    <td className="p-3 font-black text-purple-300">Naloxona (Comparador)</td>
                    <td className="p-3 font-mono text-purple-200">Antagonista Opioide Mu</td>
                    <td className="p-3 text-slate-300">Alerta reactiva por dolor</td>
                    <td className="p-3 text-emerald-400">Revierte apnea por opioides</td>
                    <td className="p-3 text-rose-400 font-black">ANULA ANALGESIA (Dolor Agudo)</td>
                    <td className="p-3"><span className="bg-purple-500 text-white px-2 py-0.5 rounded text-[10px] font-black">Uso Clínico Habitual</span></td>
                  </tr>
                  <tr className="bg-rose-950/20 hover:bg-rose-950/40">
                    <td className="p-3 font-black text-rose-300">Sevoflurano / Propofol</td>
                    <td className="p-3 font-mono text-rose-200">Potenciadores GABA-A</td>
                    <td className="p-3 text-rose-400 font-bold">Pérdida Conciencia / BIS &lt;35</td>
                    <td className="p-3 text-rose-400">Depresión Ventilatoria</td>
                    <td className="p-3 text-slate-300">Variable / Hipnosis</td>
                    <td className="p-3"><span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-black">Estándar Quirúrgico</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EVIDENCIA & 6 PERLAS */}
      {activeTab === 'evidencia' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Clinical Trials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-1 rounded-md border border-emerald-500/40">
                  ENSAYO CLÍNICO FASE 1b/2 TAK-925
                </span>
                <span className="text-slate-400 font-mono">Nature Neuroscience / BJA</span>
              </div>
              <h4 className="text-sm font-black text-white">
                Active Emergence from General Anesthesia via OX2R Agonism (n=310)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Demostró una reducción del 65% en el tiempo transcurrido hasta la extubación traqueal vs placebo (p &lt; 0.001) tras anestesia con sevoflurano y propofol. Retorno inmediato de ondas beta en EEG sin rebote de sedación ni inestabilidad autonómica.
              </p>
            </div>

            <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="bg-amber-500/20 text-amber-300 font-black px-2.5 py-1 rounded-md border border-amber-500/40">
                  COHORTE DE INTERACCIÓN DORA
                </span>
                <span className="text-slate-400 font-mono">PNAS / ASA Research</span>
              </div>
              <h4 className="text-sm font-black text-white">
                Impacto de Antagonistas Duales (Suvorexant) en la Recuperación (n=540)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Los pacientes bajo tratamiento previo con antagonistas DORA presentaron un retraso promedio de +18.4 minutos en alcanzar la puntuación de Aldrete &gt;9 en URPA, confirmando la modulación del receptor OX2R como el modulador central del despertar.
              </p>
            </div>
          </div>

          {/* 6 Key Takeaways for Clinical Practice */}
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 sm:p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                6 Puntos Clave para la Práctica Médica del Anestesiólogo
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
              {[
                {
                  num: '1',
                  title: 'Emergencia Activa vs Pasiva',
                  desc: 'Rompe 170 años de dogma: es posible forzar el despertar neuroquímico sin esperar la eliminación del fármaco anestésico.',
                  color: 'border-emerald-500/40 text-emerald-300'
                },
                {
                  num: '2',
                  title: 'Agonistas OX2R (Danavorexton)',
                  desc: 'Despiertan el cerebro corticalmente y elevan el BIS de <40 a >80 en menos de 3 minutos de forma segura.',
                  color: 'border-cyan-500/40 text-cyan-300'
                },
                {
                  num: '3',
                  title: 'Antagonistas DORA (Suvorexant)',
                  desc: 'Reconocerlos en la consulta preanestésica para anticipar despertar retardado y mayor estancia en URPA/PACU.',
                  color: 'border-amber-500/40 text-amber-300'
                },
                {
                  num: '4',
                  title: 'Rescate de Depresión Respiratoria',
                  desc: 'Estimula la ventilación bulbar sin revertir la analgesia opioide ni generar dolor agudo (diferencia radical vs Naloxona).',
                  color: 'border-purple-500/40 text-purple-300'
                },
                {
                  num: '5',
                  title: 'Prevención de Delirium y POCD',
                  desc: 'Un despertar lúcido y sincronizado reduce el delirium postoperatorio y la disfunción cognitiva en ancianos.',
                  color: 'border-sky-500/40 text-sky-300'
                },
                {
                  num: '6',
                  title: 'Futuro de Quirófano (Control On/Off)',
                  desc: 'Herramienta decisiva para neurocirugía despierta, extubación en mesa de quirófano y Cirugía Mayor Ambulatoria (CMA).',
                  color: 'border-teal-500/40 text-teal-300'
                }
              ].map((item, idx) => (
                <div key={idx} className={`bg-slate-950 p-4 rounded-2xl border ${item.color} space-y-1.5`}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 border border-white/20 font-black text-xs flex items-center justify-center text-white">
                      {item.num}
                    </span>
                    <h5 className="text-xs font-black text-white">{item.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// GUÍA ERAS 2025: PILARES DE LA ANALGESIA EN CESÁREA - CARRUSEL INTERACTIVO
// =========================================================================

interface ErasSlideItem {
  id: number;
  placaNum: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  tagline: string;
  accentGradient: string;
  borderColor: string;
  textColor: string;
  graphicType: 'pilares' | 'morfina' | 'horario' | 'tap' | 'infiltracion' | 'dexa' | 'rescate' | 'faja' | 'nutricion' | 'algoritmo';
  cards: { title: string; desc: string; highlight?: string }[];
  statBox: { title: string; value: string; desc: string; color: string };
  footerHint: string;
}

// Visual SVG Illustrations for all 10 ERAS 2025 Slides
const ErasSlideGraphic: React.FC<{ type: ErasSlideItem['graphicType'] }> = ({ type }) => {
  switch (type) {
    case 'pilares':
      return (
        <div className="w-full bg-slate-950/90 border border-cyan-500/30 rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="text-[10px] font-black uppercase text-cyan-300 tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" /> ESQUEMA DE LOS 3 PILARES ERAS® 2025
          </div>
          <svg viewBox="0 0 400 120" className="w-full max-h-28">
            <defs>
              <linearGradient id="gradPillar1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="gradPillar2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="gradPillar3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
            </defs>
            {/* Box 1: Neuraxial */}
            <rect x="10" y="20" width="115" height="80" rx="10" fill="url(#gradPillar1)" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="67" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">1. NEURAXIAL</text>
            <text x="67" y="62" fill="#bae6fd" fontSize="8.5" fontWeight="bold" textAnchor="middle">Morfina ITM</text>
            <text x="67" y="78" fill="#e0f2fe" fontSize="8" textAnchor="middle">50-100 µg Espinal</text>
            <text x="67" y="92" fill="#7dd3fc" fontSize="7.5" textAnchor="middle">14-24h Analgesia</text>

            {/* Connecting + */}
            <circle cx="137" cy="60" r="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="137" y="64" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>

            {/* Box 2: Multimodal Fijo */}
            <rect x="149" y="20" width="115" height="80" rx="10" fill="url(#gradPillar2)" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="206" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">2. BASAL FIJO</text>
            <text x="206" y="62" fill="#fef3c7" fontSize="8.5" fontWeight="bold" textAnchor="middle">Paracetamol + AINE</text>
            <text x="206" y="78" fill="#fef9c3" fontSize="8" textAnchor="middle">Horario Estricto</text>
            <text x="206" y="92" fill="#fde68a" fontSize="7.5" textAnchor="middle">NUNCA a Demanda</text>

            {/* Connecting + */}
            <circle cx="276" cy="60" r="10" fill="#0f172a" stroke="#34d399" strokeWidth="1.5" />
            <text x="276" y="64" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>

            {/* Box 3: Medidas Físicas */}
            <rect x="288" y="20" width="102" height="80" rx="10" fill="url(#gradPillar3)" stroke="#34d399" strokeWidth="1.5" />
            <text x="339" y="45" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">3. RECUPERACIÓN</text>
            <text x="339" y="62" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">Faja + Movilidad</text>
            <text x="339" y="78" fill="#ecfdf5" fontSize="8" textAnchor="middle">Deambulación &lt;12h</text>
            <text x="339" y="92" fill="#a7f3d0" fontSize="7.5" textAnchor="middle">Líquidos a las 2h</text>
          </svg>
        </div>
      );

    case 'morfina':
      return (
        <div className="w-full bg-slate-950/90 border border-blue-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-blue-300 tracking-wider mb-2 flex items-center gap-1.5">
            💉 ESTÁNDAR DE ORO: MORFINA INTRATECAL (ITM) SUBARACNOIDEA
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            {/* Spine vertebrae stylized */}
            <rect x="20" y="15" width="70" height="35" rx="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="55" y="36" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">L3 Vértebra</text>
            <rect x="20" y="58" width="70" height="35" rx="6" fill="#1e293b" stroke="#60a5fa" strokeWidth="1.5" />
            <text x="55" y="79" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">L4 Vértebra</text>

            {/* Needle puncture path */}
            <line x1="170" y1="52" x2="95" y2="52" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3,3" />
            <polygon points="90,52 100,48 100,56" fill="#38bdf8" />

            {/* Drug bubble */}
            <circle cx="210" cy="52" r="38" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2" />
            <text x="210" y="44" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">MORFINA ITM</text>
            <text x="210" y="58" fill="#38bdf8" fontSize="11" fontWeight="extrabold" textAnchor="middle">50 - 100 µg</text>
            <text x="210" y="71" fill="#bfdbfe" fontSize="7.5" textAnchor="middle">(0.05 - 0.10 mg)</text>

            {/* Time arrow */}
            <rect x="270" y="25" width="115" height="55" rx="8" fill="#042f2e" stroke="#14b8a6" strokeWidth="1.5" />
            <text x="327" y="46" fill="#5eead4" fontSize="10" fontWeight="bold" textAnchor="middle">⏱️ COBERTURA</text>
            <text x="327" y="64" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">14 a 24 Horas</text>
          </svg>
        </div>
      );

    case 'horario':
      return (
        <div className="w-full bg-slate-950/90 border border-amber-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider mb-2 flex items-center gap-1.5">
            ⏰ RÉGIMEN BASAL SINÉRGICO A HORARIO ESTRICTO (NO "A DEMANDA")
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            {/* Paracetamol Pill Card */}
            <rect x="15" y="15" width="165" height="75" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="97" y="38" fill="#fde68a" fontSize="11" fontWeight="bold" textAnchor="middle">PARACETAMOL IV / VO</text>
            <text x="97" y="58" fill="#ffffff" fontSize="13" fontWeight="extrabold" textAnchor="middle">1 g cada 6 Horas</text>
            <text x="97" y="76" fill="#fef08a" fontSize="8" textAnchor="middle">Acción Central • Máx 4 g/día</text>

            {/* Synergy Plus */}
            <circle cx="200" cy="52" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="2" />
            <text x="200" y="57" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">+</text>

            {/* NSAID Pill Card */}
            <rect x="220" y="15" width="165" height="75" rx="10" fill="#701a75" stroke="#e879f9" strokeWidth="1.5" />
            <text x="302" y="38" fill="#f5d0fe" fontSize="11" fontWeight="bold" textAnchor="middle">AINE FIJO PROGRAMADO</text>
            <text x="302" y="56" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">Ibuprofeno 600mg c/8h VO</text>
            <text x="302" y="72" fill="#fae8ff" fontSize="9" textAnchor="middle">o Ketorolaco 15-30mg c/6-8h IV</text>
            <text x="302" y="83" fill="#d946ef" fontSize="7.5" fontWeight="bold" textAnchor="middle">Ahorro de Opioides: -60%</text>
          </svg>
        </div>
      );

    case 'tap':
      return (
        <div className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-emerald-300 tracking-wider mb-2 flex items-center gap-1.5">
            🎯 BLOQUEO TAP ECOGUIADO: PLANOS DE LA PARED ABDOMINAL
          </div>
          <svg viewBox="0 0 400 115" className="w-full max-h-28">
            {/* Ultrasound probe */}
            <rect x="15" y="10" width="70" height="22" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="50" y="25" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">Transductor Eco</text>
            
            {/* Abdominal wall layers */}
            {/* Skin & Subcut */}
            <rect x="95" y="10" width="290" height="15" rx="3" fill="#78350f" opacity="0.8" />
            <text x="240" y="21" fill="#fef3c7" fontSize="8" fontWeight="bold" textAnchor="middle">Piel y Tejido Subcutáneo</text>

            {/* External Oblique */}
            <rect x="95" y="28" width="290" height="18" rx="3" fill="#1e293b" stroke="#475569" />
            <text x="240" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle">Músculo Oblicuo Externo (MOE)</text>

            {/* Internal Oblique */}
            <rect x="95" y="49" width="290" height="20" rx="3" fill="#1e3a8a" stroke="#3b82f6" />
            <text x="240" y="62" fill="#bfdbfe" fontSize="8.5" fontWeight="bold" textAnchor="middle">Músculo Oblicuo Interno (MOI)</text>

            {/* TAP Fascial Plane (Injection target) */}
            <rect x="95" y="72" width="290" height="14" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
            <text x="240" y="82" fill="#ecfdf5" fontSize="8.5" fontWeight="extrabold" textAnchor="middle">⚡ PLANO FASCIAL TAP: Ropivacaína 0.2% 15-20 mL/lado</text>

            {/* Transversus Abdominis */}
            <rect x="95" y="89" width="290" height="18" rx="3" fill="#1e293b" stroke="#475569" />
            <text x="240" y="101" fill="#94a3b8" fontSize="8" textAnchor="middle">Músculo Transverso del Abdomen (MTA) & Peritoneo</text>
          </svg>
        </div>
      );

    case 'infiltracion':
      return (
        <div className="w-full bg-slate-950/90 border border-teal-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-teal-300 tracking-wider mb-2 flex items-center gap-1.5">
            🪡 INFILTRACIÓN QUIRÚRGICA DIRECTA Y CATÉTER DE HERIDA
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            {/* Pfannenstiel incision path */}
            <path d="M 50 60 Q 200 95 350 60" fill="none" stroke="#e11d48" strokeWidth="4" strokeLinecap="round" />
            <text x="200" y="45" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="middle">Incisión Tipo Pfannenstiel</text>

            {/* Infiltration nodes */}
            <circle cx="100" cy="67" r="8" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
            <circle cx="160" cy="74" r="8" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
            <circle cx="200" cy="76" r="10" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
            <circle cx="240" cy="74" r="8" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
            <circle cx="300" cy="67" r="8" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />

            <rect x="25" y="12" width="160" height="24" rx="6" fill="#134e4a" stroke="#2dd4bf" strokeWidth="1" />
            <text x="105" y="27" fill="#ccfbf1" fontSize="8" fontWeight="bold" textAnchor="middle">Bupivacaína 0.25% Subfascial 20-30 mL</text>

            <rect x="215" y="12" width="160" height="24" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
            <text x="295" y="27" fill="#e0e7ff" fontSize="8" fontWeight="bold" textAnchor="middle">Catéter Elastomérico Continuo 48h</text>
          </svg>
        </div>
      );

    case 'dexa':
      return (
        <div className="w-full bg-slate-950/90 border border-purple-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-purple-300 tracking-wider mb-2 flex items-center gap-1.5">
            🧬 DEXAMETASONA IV SISTÉMICA TRAS PINZAR EL CORDÓN
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            <rect x="20" y="18" width="130" height="75" rx="10" fill="#3b0764" stroke="#c084fc" strokeWidth="1.5" />
            <text x="85" y="40" fill="#e9d5ff" fontSize="10" fontWeight="bold" textAnchor="middle">DEXAMETASONA IV</text>
            <text x="85" y="60" fill="#ffffff" fontSize="14" fontWeight="extrabold" textAnchor="middle">4 a 8 mg</text>
            <text x="85" y="78" fill="#c084fc" fontSize="7.5" textAnchor="middle">Post-Pinzamiento Cordón</text>

            <line x1="155" y1="55" x2="195" y2="35" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />
            <line x1="155" y1="55" x2="195" y2="75" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />

            <rect x="200" y="15" width="180" height="36" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.2" />
            <text x="290" y="30" fill="#a5b4fc" fontSize="9" fontWeight="bold" textAnchor="middle">🛡️ Profilaxis Antiemética NVPO</text>
            <text x="290" y="43" fill="#e0e7ff" fontSize="7.5" textAnchor="middle">Bloquea náuseas y vómitos centrales</text>

            <rect x="200" y="58" width="180" height="36" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.2" />
            <text x="290" y="73" fill="#6ee7b7" fontSize="9" fontWeight="bold" textAnchor="middle">💊 Modulación Antiinflamatoria</text>
            <text x="290" y="86" fill="#ecfdf5" fontSize="7.5" textAnchor="middle">Reduce edema tisular e hiperalgesia</text>
          </svg>
        </div>
      );

    case 'rescate':
      return (
        <div className="w-full bg-slate-950/90 border border-rose-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-rose-300 tracking-wider mb-2 flex items-center gap-1.5">
            🚨 RESCATE DE DOLOR IRRUPTIVO: VÍA ORAL EXCLUSIVA
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            <rect x="15" y="18" width="170" height="75" rx="10" fill="#4c0519" stroke="#fb7185" strokeWidth="1.5" />
            <text x="100" y="38" fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle">RESCATE PERMITIDO</text>
            <text x="100" y="55" fill="#ffffff" fontSize="11" fontWeight="extrabold" textAnchor="middle">Oxicodona 5-10 mg VO</text>
            <text x="100" y="70" fill="#ffffff" fontSize="10" textAnchor="middle">o Tramadol 50 mg VO</text>
            <text x="100" y="84" fill="#fda4af" fontSize="7.5" textAnchor="middle">Solo si EVA &gt; 4/10 en reposo</text>

            <rect x="215" y="18" width="170" height="75" rx="10" fill="#18181b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,3" />
            <text x="300" y="38" fill="#f87171" fontSize="10" fontWeight="bold" textAnchor="middle">❌ PROHIBIDO DE RUTINA</text>
            <text x="300" y="56" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">Bombas PCA IV Continuas</text>
            <text x="300" y="72" fill="#cbd5e1" fontSize="8" textAnchor="middle">Causan sedación, íleo y retrasan</text>
            <text x="300" y="83" fill="#cbd5e1" fontSize="8" textAnchor="middle">la lactancia materna precoz</text>
          </svg>
        </div>
      );

    case 'faja':
      return (
        <div className="w-full bg-slate-950/90 border border-indigo-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-indigo-300 tracking-wider mb-2 flex items-center gap-1.5">
            🚶‍♀️ RECUPERACIÓN FÍSICA: FAJA ELÁSTICA Y MOVILIZACIÓN ACTIVA
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            <rect x="15" y="15" width="115" height="80" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
            <text x="72" y="38" fill="#c7d2fe" fontSize="9.5" fontWeight="bold" textAnchor="middle">FAJA ELÁSTICA</text>
            <text x="72" y="58" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">Soporte</text>
            <text x="72" y="75" fill="#a5b4fc" fontSize="7.5" textAnchor="middle">Alivia dolor al toser</text>
            <text x="72" y="86" fill="#a5b4fc" fontSize="7.5" textAnchor="middle">y deambular</text>

            <rect x="142" y="15" width="115" height="80" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="199" y="38" fill="#7dd3fc" fontSize="9.5" fontWeight="bold" textAnchor="middle">DEAMBULACIÓN</text>
            <text x="199" y="58" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">&lt; 6 a 12 Horas</text>
            <text x="199" y="75" fill="#bae6fd" fontSize="7.5" textAnchor="middle">Previene TVP y</text>
            <text x="199" y="86" fill="#bae6fd" fontSize="7.5" textAnchor="middle">estimula peristalsis</text>

            <rect x="270" y="15" width="115" height="80" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
            <text x="327" y="38" fill="#6ee7b7" fontSize="9.5" fontWeight="bold" textAnchor="middle">SONDA FOLEY</text>
            <text x="327" y="58" fill="#ffffff" fontSize="12" fontWeight="extrabold" textAnchor="middle">Retiro &lt;12h</text>
            <text x="327" y="75" fill="#a7f3d0" fontSize="7.5" textAnchor="middle">Libertad motora</text>
            <text x="327" y="86" fill="#a7f3d0" fontSize="7.5" textAnchor="middle">sin infecciones</text>
          </svg>
        </div>
      );

    case 'nutricion':
      return (
        <div className="w-full bg-slate-950/90 border border-green-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-green-300 tracking-wider mb-2 flex items-center gap-1.5">
            🍵 NUTRICIÓN PRECOZ Y PREVENCIÓN DE ÍLEO POSTQUIRÚRGICO
          </div>
          <svg viewBox="0 0 400 110" className="w-full max-h-28">
            <rect x="15" y="18" width="115" height="75" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
            <text x="72" y="40" fill="#a7f3d0" fontSize="9.5" fontWeight="bold" textAnchor="middle">LÍQUIDOS CLAROS</text>
            <text x="72" y="60" fill="#ffffff" fontSize="13" fontWeight="extrabold" textAnchor="middle">A las 2 Horas</text>
            <text x="72" y="78" fill="#d1fae5" fontSize="7.5" textAnchor="middle">Reflejo Gastrocólico</text>

            <rect x="142" y="18" width="115" height="75" rx="8" fill="#14532d" stroke="#4ade80" strokeWidth="1.5" />
            <text x="199" y="40" fill="#bbf7d0" fontSize="9.5" fontWeight="bold" textAnchor="middle">DIETA SÓLIDA</text>
            <text x="199" y="60" fill="#ffffff" fontSize="13" fontWeight="extrabold" textAnchor="middle">&lt; 4 - 6 Horas</text>
            <text x="199" y="78" fill="#dcfce7" fontSize="7.5" textAnchor="middle">Tolerancia progresiva</text>

            <rect x="270" y="18" width="115" height="75" rx="8" fill="#0f172a" stroke="#22c55e" strokeWidth="1.5" />
            <text x="327" y="40" fill="#86efac" fontSize="9.5" fontWeight="bold" textAnchor="middle">CHICLE TERAPÉUTICO</text>
            <text x="327" y="58" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Goma de Mascar</text>
            <text x="327" y="75" fill="#bbf7d0" fontSize="7.5" textAnchor="middle">Nutrición simulada</text>
            <text x="327" y="85" fill="#86efac" fontSize="7" textAnchor="middle">Acelera expulsión gas</text>
          </svg>
        </div>
      );

    case 'algoritmo':
      return (
        <div className="w-full bg-slate-950/90 border border-sky-500/30 rounded-2xl p-3 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black uppercase text-sky-300 tracking-wider mb-2 flex items-center gap-1.5">
            🏆 ALGORITMO MAESTRO ERAS 2025 • ÉXITO ANALGÉSICO 96%
          </div>
          <svg viewBox="0 0 400 115" className="w-full max-h-28">
            <rect x="10" y="12" width="85" height="90" rx="6" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="52" y="32" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">PASO 1</text>
            <text x="52" y="48" fill="#bae6fd" fontSize="7.5" fontWeight="bold" textAnchor="middle">Morfina ITM</text>
            <text x="52" y="60" fill="#e0f2fe" fontSize="7" textAnchor="middle">50-100 µg</text>
            <text x="52" y="74" fill="#7dd3fc" fontSize="6.5" textAnchor="middle">(o TAP Block)</text>

            <rect x="105" y="12" width="85" height="90" rx="6" fill="#b45309" stroke="#fbbf24" strokeWidth="1.2" />
            <text x="147" y="32" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">PASO 2</text>
            <text x="147" y="48" fill="#fef3c7" fontSize="7.5" fontWeight="bold" textAnchor="middle">Parac + AINE</text>
            <text x="147" y="60" fill="#fef9c3" fontSize="7" textAnchor="middle">Horario fijo</text>
            <text x="147" y="74" fill="#fde68a" fontSize="6.5" textAnchor="middle">+ Dexa 4-8mg</text>

            <rect x="200" y="12" width="85" height="90" rx="6" fill="#be123c" stroke="#fb7185" strokeWidth="1.2" />
            <text x="242" y="32" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">PASO 3</text>
            <text x="242" y="48" fill="#fecdd3" fontSize="7.5" fontWeight="bold" textAnchor="middle">Rescate VO</text>
            <text x="242" y="60" fill="#fff1f2" fontSize="7" textAnchor="middle">Oxicodona</text>
            <text x="242" y="74" fill="#fda4af" fontSize="6.5" textAnchor="middle">Solo si EVA&gt;4</text>

            <rect x="295" y="12" width="95" height="90" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1.2" />
            <text x="342" y="32" fill="#ffffff" fontSize="8.5" fontWeight="bold" textAnchor="middle">PASO 4</text>
            <text x="342" y="48" fill="#d1fae5" fontSize="7.5" fontWeight="bold" textAnchor="middle">Faja + Dieta 2h</text>
            <text x="342" y="60" fill="#ecfdf5" fontSize="7" textAnchor="middle">Movilidad &lt;12h</text>
            <text x="342" y="74" fill="#a7f3d0" fontSize="7" fontWeight="bold" textAnchor="middle">Éxito 96%</text>
          </svg>
        </div>
      );

    default:
      return null;
  }
};

const ERAS_CESAREA_SLIDES: ErasSlideItem[] = [
  {
    id: 1,
    placaNum: 'Placa 1 / 10',
    badge: 'GUÍA CLÍNICA ERAS 2025',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    title: 'PILARES DE LA ANALGESIA EN CESÁREA',
    subtitle: 'ERAS: Enhanced Recovery After Surgery (Actualización Internacional 2025)',
    tagline: 'Cambio de paradigma: Transición hacia la analgesia multimodal protocolizada con ahorro estricto de opioides.',
    accentGradient: 'from-cyan-950/80 via-slate-900 to-indigo-950/80',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    graphicType: 'pilares',
    cards: [
      {
        title: '¿QUÉ ES ERAS EN CESÁREA?',
        desc: 'Enhanced Recovery After Surgery: Programa de cuidados perioperatorios basado en evidencia para optimizar la recuperación funcional materna y neonatal.'
      },
      {
        title: 'OBJETIVOS CLÍNICOS PRIMARIOS',
        desc: 'Alivio óptimo del dolor tanto en reposo como en movimiento, apego precoz piel con piel, inicio inmediato de la lactancia y deambulación activa en < 12 horas.'
      },
      {
        title: 'IMPACTO DEL DOLOR NO CONTROLADO',
        desc: 'Duplica el riesgo de depresión postparto, interfiere con la lactancia materna y quintuplica la probabilidad de cronificación del dolor (dolor persistente postquirúrgico).'
      }
    ],
    statBox: {
      title: 'RECUPERACIÓN QUIRÚRGICA OPTIMIZADA',
      value: 'ERAS 2025',
      desc: 'Control analgésico preventivo sin sedación ni íleo materno',
      color: 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
    },
    footerHint: 'Desliza para ver el Estándar Neuraxial ➡️'
  },
  {
    id: 2,
    placaNum: 'Placa 2 / 10',
    badge: 'PILAR 1: NEURAXIAL',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    title: 'MORFINA INTRATECAL: ESTÁNDAR DE ORO',
    subtitle: 'Dosis Óptima Bajas en Anestesia Espinal (50 - 100 µg)',
    tagline: 'Pilar neuraxial de elección indiscutible para una analgesia prolongada en reposo y movimiento.',
    accentGradient: 'from-blue-950/80 via-slate-900 to-cyan-950/80',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-400',
    graphicType: 'morfina',
    cards: [
      {
        title: 'DURACIÓN PROLONGADA',
        desc: 'Proporciona entre 14 y 24 horas de analgesia postoperatoria profunda y continua sin comprometer la movilidad materna.'
      },
      {
        title: 'BENEFICIO DE DOSIS BAJAS (50 - 100 µg)',
        desc: 'La evidencia demuestra igual eficacia analgésica que dosis altas (> 150 µg) pero con reducción drástica de prurito, náuseas y sin depresión respiratoria.'
      },
      {
        title: 'CO-ADMINISTRACIÓN EN QUIRÓFANO',
        desc: 'Se combina en la misma punción con Bupivacaína hiperbárica y Fentanilo 10-20 µg para inicio analgésico rápido intraoperatorio.'
      }
    ],
    statBox: {
      title: 'DOSIS MORFINA INTRATECAL (ITM)',
      value: '50 - 100 µg',
      desc: '0.05 a 0.10 mg en anestesia espinal subaracnoidea',
      color: 'bg-blue-950/60 border-blue-500/50 text-blue-300'
    },
    footerHint: 'Desliza para ver la Base No Opioide ➡️'
  },
  {
    id: 3,
    placaNum: 'Placa 3 / 10',
    badge: 'PILAR 2: ANALGESIA PROGRAMADA',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    title: 'PARACETAMOL & AINES DE HORARIO FIJO',
    subtitle: 'Pilar Base: NUNCA prescribir "por razón necesaria" (PRN)',
    tagline: 'La administración pautada fija previene los valles de dolor intenso y bloquea la cascada inflamatoria.',
    accentGradient: 'from-amber-950/80 via-slate-900 to-orange-950/80',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    graphicType: 'horario',
    cards: [
      {
        title: 'PARACETAMOL PROGRAMADO',
        desc: '1 g cada 6 horas vía oral o intravenosa (máximo 4 g/día). Bloqueo sinérgico central de la síntesis de prostaglandinas.'
      },
      {
        title: 'AINES DE HORARIO FIJO',
        desc: 'Ibuprofeno 600 mg VO c/8h o Ketorolaco 15-30 mg IV c/6-8h o Dexketoprofeno 50 mg c/8h. Inhibición de COX-1/COX-2 periférica.'
      },
      {
        title: 'BENEFICIO CLÍNICO SINÉRGICO',
        desc: 'La combinación fija de Paracetamol + AINE reduce el consumo de opioides de rescate en un 60% y no afecta la contractilidad uterina postparto.'
      }
    ],
    statBox: {
      title: 'REGLA DE ORO ERAS 2025',
      value: 'HORARIO FIJO',
      desc: 'NUNCA prescribir "si hay dolor" (evitar esquemas PRN)',
      color: 'bg-amber-950/60 border-amber-500/50 text-amber-300'
    },
    footerHint: 'Desliza para Bloqueos Ecoguiados ➡️'
  },
  {
    id: 4,
    placaNum: 'Placa 4 / 10',
    badge: 'PILAR 3: BLOQUEOS DE PARED',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    title: 'BLOQUEOS REGIONALES (TAP & QLB)',
    subtitle: 'Primera Línea cuando NO se usa Morfina Intratecal',
    tagline: 'Bloqueo fascial somático de la pared abdominal guiado por ecografía de alta resolución.',
    accentGradient: 'from-emerald-950/80 via-slate-900 to-teal-950/80',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    graphicType: 'tap',
    cards: [
      {
        title: 'BLOQUEO TAP BILATERAL ECOGUIADO',
        desc: 'Inyección en el plano transverso abdominal (entre oblicuo interno y transverso) con 15-20 mL por lado para bloquear nervios intercostales T10-L1.'
      },
      {
        title: 'BLOQUEO CUADRADO LUMBAR (QLB)',
        desc: 'Abordaje fascial posterior que provee excelente cobertura de pared y cierto grado de bloqueo visceral simpático de mayor duración.'
      },
      {
        title: 'FÁRMACOS Y DOSIS SEGURAS',
        desc: 'Ropivacaína al 0.2% - 0.375% o Bupivacaína al 0.25% (máximo 2 mg/kg respetando los límites de toxicidad sistémica LAST).'
      }
    ],
    statBox: {
      title: 'INDICACIÓN ERAS OBLIGATORIA',
      value: 'TAP / QLB',
      desc: 'En anestesia general o cuando no se administró opioide espinal',
      color: 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
    },
    footerHint: 'Desliza para Infiltración de Herida ➡️'
  },
  {
    id: 5,
    placaNum: 'Placa 5 / 10',
    badge: 'PILAR 3B: HERIDA QUIRÚRGICA',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    title: 'INFILTRACIÓN LOCAL DE HERIDA',
    subtitle: 'Estrategia Quirúrgica Sencilla y de Gran Impacto',
    tagline: 'Infiltración subcutánea y subfascial realizada por el cirujano antes del cierre de piel.',
    accentGradient: 'from-teal-950/80 via-slate-900 to-cyan-950/80',
    borderColor: 'border-teal-500/40',
    textColor: 'text-teal-400',
    graphicType: 'infiltracion',
    cards: [
      {
        title: 'TÉCNICA DE INFILTRACIÓN DIRECTA',
        desc: 'Infiltración de bordes de la fascia transversalis y dermis con Bupivacaína o Levobupivacaína 0.25-0.5% (20-30 mL) antes de la sutura final.'
      },
      {
        title: 'CATÉTER DE HERIDA EN INFUSIÓN CONTINUA',
        desc: 'Opción con bomba elastomérica multiorificio colocada preperitoneal/subfascial para perfusión continua de anestésico local durante 48 horas.'
      },
      {
        title: 'ALTERNATIVA COMPLEMENTARIA',
        desc: 'Intervención de alto valor analgésico cuando no se dispone de equipo de ultrasonido para bloqueo TAP o en cirugías de urgencia.'
      }
    ],
    statBox: {
      title: 'BLOQUEO NOCICEPTIVO EN LA INCISIÓN',
      value: 'LOCAL / FASCIAL',
      desc: 'Bloquea el 70% del componente doloroso de la herida parietal',
      color: 'bg-teal-950/60 border-teal-500/50 text-teal-300'
    },
    footerHint: 'Desliza para Coadyuvantes Analgésicos ➡️'
  },
  {
    id: 6,
    placaNum: 'Placa 6 / 10',
    badge: 'PILAR 4: COADYUVANTES',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    title: 'DEXAMETASONA & AHORRADORES',
    subtitle: 'Modulación de la Respuesta Inflamatoria Sistémica',
    tagline: 'Dexametasona 4 a 8 mg IV administrada tras el pinzamiento del cordón umbilical.',
    accentGradient: 'from-purple-950/80 via-slate-900 to-indigo-950/80',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    graphicType: 'dexa',
    cards: [
      {
        title: 'DOBLE EFECTO CLÍNICO ERAS',
        desc: 'Potente acción antiemética profiláctica contra náuseas y vómitos postoperatorios (NVPO) sumada a un efecto analgésico ahorrador de opioides.'
      },
      {
        title: 'KETAMINA SUBANESTÉSICA (0.25 - 0.5 mg/kg IV)',
        desc: 'Antagonista de receptores NMDA indicado en pacientes con consumo crónico de opioides, hiperalgesia o riesgo de dolor crónico.'
      },
      {
        title: 'SEGURIDAD MATERNO-NEONATAL',
        desc: 'Administración tras pinzar cordón; dosis única sin impacto neonatal ni alteraciones glucémicas clínicamente relevantes.'
      }
    ],
    statBox: {
      title: 'DOSIS DEXAMETASONA IV AL NACER',
      value: '4 - 8 mg IV',
      desc: 'Post-clamp de cordón: Antiemético + Antiinflamatorio potente',
      color: 'bg-purple-950/60 border-purple-500/50 text-purple-300'
    },
    footerHint: 'Desliza para el Manejo de Rescate ➡️'
  },
  {
    id: 7,
    placaNum: 'Placa 7 / 10',
    badge: 'PILAR 5: DOLOR IRRUPTIVO',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    title: 'OPIOIDES ORALES DE RESCATE',
    subtitle: 'Protocolo de Rescate Racional y Restringido',
    tagline: 'Opioides administrados exclusivamente por vía ORAL y únicamente si el dolor de escape supera 4/10.',
    accentGradient: 'from-rose-950/80 via-slate-900 to-red-950/80',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-400',
    graphicType: 'rescate',
    cards: [
      {
        title: 'VÍA ORAL ESTRICTAMENTE PREFERENTE',
        desc: 'Oxicodona 5-10 mg VO o Tramadol 50 mg VO si el esquema basal con Paracetamol + AINE es insuficiente.'
      },
      {
        title: 'EVITAR BOMBAS PCA INTRAVENOSAS',
        desc: 'Las infusiones continuas o bolos de morfina IV aumentan la sedación materna, interfieren con la lactancia y provocan íleo y retención urinaria.'
      },
      {
        title: 'LÍMITE ESTRICTO DE DOSIFICACIÓN',
        desc: 'Restringir las dosis de rescate a menos de 48 horas postquirúrgicas para evitar tolerancia, náuseas y estreñimiento.'
      }
    ],
    statBox: {
      title: 'RESCATE ESCALONADO DE ESCAPE',
      value: 'SOLO ORAL',
      desc: 'Reservado exclusivamente si EVA > 4/10 tras esquema basal',
      color: 'bg-rose-950/60 border-rose-500/50 text-rose-300'
    },
    footerHint: 'Desliza para Cuidados Físicos No Farmacológicos ➡️'
  },
  {
    id: 8,
    placaNum: 'Placa 8 / 10',
    badge: 'PILAR 6: MEDIDAS FÍSICAS',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    title: 'FAJA ABDOMINAL & DEAMBULACIÓN',
    subtitle: 'Intervenciones Físicas Clave en ERAS 2025',
    tagline: 'Soporte abdominal elástico y movilización activa antes de las 6-12 horas.',
    accentGradient: 'from-indigo-950/80 via-slate-900 to-blue-950/80',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    graphicType: 'faja',
    cards: [
      {
        title: 'FAJA ABDOMINAL ELÁSTICA',
        desc: 'Disminuye la tensión sobre la incisión quirúrgica, alivia el dolor dinámico al toser o reír y mejora el confort postural.'
      },
      {
        title: 'DEAMBULACIÓN PRECOZ (< 6 - 12 HORAS)',
        desc: 'Caminar tempranamente previene trombosis venosa profunda (TVP), estimula el peristaltismo intestinal y reduce la estancia hospitalaria.'
      },
      {
        title: 'RETIRO TEMPRANO DE SONDA VESICAL',
        desc: 'Retiro programado de la sonda de Foley a las 6-12h para facilitar la deambulación sin barreras y prevenir infecciones del tracto urinario.'
      }
    ],
    statBox: {
      title: 'DEAMBULACIÓN Y RETIRO DE SONDA',
      value: '< 12 HORAS',
      desc: 'Movilización activa precoz y faja elástica de soporte',
      color: 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
    },
    footerHint: 'Desliza para Nutrición e Hidratación ➡️'
  },
  {
    id: 9,
    placaNum: 'Placa 9 / 10',
    badge: 'PILAR 7: NUTRICIÓN PRECOZ',
    badgeColor: 'bg-green-500/20 text-green-300 border-green-500/40',
    title: 'INGESTA Y ALIMENTACIÓN PRECOZ',
    subtitle: 'Suspensión Rápida de Sueros y Vía Oral Inmediata',
    tagline: 'Líquidos claros a las 2 horas e inicio de dieta sólida en < 4-6 horas.',
    accentGradient: 'from-green-950/80 via-slate-900 to-emerald-950/80',
    borderColor: 'border-green-500/40',
    textColor: 'text-green-400',
    graphicType: 'nutricion',
    cards: [
      {
        title: 'INGESTA ORAL INMEDIATA',
        desc: 'El inicio precoz de líquidos estimula el reflejo gastrocólico y previene el íleo paralítico postquirúrgico.'
      },
      {
        title: 'RETIRO RÁPIDO DE FLUIDOS INTRAVENOSOS',
        desc: 'Evita la sobrecarga hídrica, previene el edema tisular periférico y favorece la deambulación libre de sueros.'
      },
      {
        title: 'GOMA DE MASCAR (CHICLE TERAPÉUTICO)',
        desc: 'Masticar chicle postcesárea actúa como nutrición simulada acelerando la expulsión de gases y la primera deposición.'
      }
    ],
    statBox: {
      title: 'INICIO DE TOLERANCIA ORAL',
      value: '2 HORAS',
      desc: 'Líquidos a las 2h y sólidos ligeros en < 4-6h postcesárea',
      color: 'bg-green-950/60 border-green-500/50 text-green-300'
    },
    footerHint: 'Desliza para el Resumen del Algoritmo ➡️'
  },
  {
    id: 10,
    placaNum: 'Placa 10 / 10',
    badge: 'RESUMEN Y CHECKLIST CLÍNICO',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    title: 'ALGORITMO ANALGESIA ERAS CESÁREA',
    subtitle: 'Esquema Maestro para la Práctica Diaria (Éxito 96%)',
    tagline: 'Morfina ITM + Paracetamol/AINE horario + Rescate oral + Faja y deambulación precoz.',
    accentGradient: 'from-sky-950/80 via-slate-900 to-indigo-950/80',
    borderColor: 'border-sky-500/40',
    textColor: 'text-sky-400',
    graphicType: 'algoritmo',
    cards: [
      {
        title: '1. NEURAXIAL / REGIONAL',
        desc: 'Morfina Intratecal 50-100 µg (si no se usó -> Bloqueo TAP / QLB bilateral o infiltración de herida).'
      },
      {
        title: '2. ANALGESIA PROGRAMADA',
        desc: 'Paracetamol 1g c/6h + AINE (Ibuprofeno 600mg c/8h o Ketorolaco 15-30mg c/6-8h) a horario estricto.'
      },
      {
        title: '3. COADYUVANTES & RESCATE',
        desc: 'Dexametasona 4-8mg IV al nacer + Opioides orales (Oxicodona 5-10mg VO) solo de escape si EVA > 4.'
      },
      {
        title: '4. MEDIDAS FÍSICAS & NUTRICIÓN',
        desc: 'Faja abdominal + Deambulación y retiro de sonda < 12h + Líquidos a las 2h + Chicle preventivo.'
      }
    ],
    statBox: {
      title: 'ÉXITO Y CONFORT MATERNO ERAS',
      value: '96%',
      desc: 'Máxima satisfacción materna, apego precoz y lactancia exitosa',
      color: 'bg-sky-950/60 border-sky-500/50 text-sky-300'
    },
    footerHint: 'Guarda y Comparte esta Guía Oficial de AnestesiaPro'
  }
];

const ErasCesareaCarouselVisual: React.FC<{ onDownload?: () => void }> = ({ onDownload }) => {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'carrusel' | 'articulo' | 'ficha' | 'algoritmo'>('carrusel');

  const currentSlide = ERAS_CESAREA_SLIDES[slideIndex];
  const totalSlides = ERAS_CESAREA_SLIDES.length;

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSlides]);

  const goToPrev = () => {
    setSlideIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const goToNext = () => {
    setSlideIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  return (
    <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none overflow-y-auto p-4 md:p-8 bg-slate-950/98' : ''}`}>
      {/* Top Header Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 sm:p-5 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> GUÍA ERAS 2025 OFICIAL
            </span>
            <span className="text-cyan-400 font-bold text-xs">ERAS® Society / SOAP Consensus</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            Guía ERAS 2025: Pilares de la Analgesia Postoperatoria Multimodal en Cesárea
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => downloadErasCesareaPDF()}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            title="Descargar Guía Completa en PDF con las 10 Placas y Algoritmo"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Descargar Guía en PDF</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors cursor-pointer"
            title={isFullscreen ? 'Cerrar pantalla completa' : 'Pantalla completa'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab('carrusel')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'carrusel' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Carrusel HD (10 Placas)</span>
          </button>

          <button
            onClick={() => setActiveTab('articulo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'articulo' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resumen y Artículo</span>
          </button>

          <button
            onClick={() => setActiveTab('ficha')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'ficha' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Ficha Técnica & Dosis</span>
          </button>

          <button
            onClick={() => setActiveTab('algoritmo')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'algoritmo' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Algoritmo Resumido</span>
          </button>
        </div>

        {activeTab === 'carrusel' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                isPlaying ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3 text-rose-400" /> : <Play className="w-3 h-3 text-cyan-400" />}
              <span>{isPlaying ? 'Pausar Auto' : 'Auto-reproducir'}</span>
            </button>
          </div>
        )}
      </div>

      {/* TAB 1: CARRUSEL HD DE 10 PLACAS */}
      {activeTab === 'carrusel' && (
        <div className="p-3 sm:p-6 bg-slate-900 space-y-4">
          {/* Main Slide Card */}
          <div className={`bg-gradient-to-b ${currentSlide.accentGradient} border-2 ${currentSlide.borderColor} rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all duration-300 min-h-[460px] flex flex-col justify-between`}>
            {/* Top Row: Tag, Placa and App Logo */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-black px-3 py-1 rounded-full border ${currentSlide.badgeColor} uppercase tracking-wider`}>
                  {currentSlide.badge}
                </span>
                <span className="bg-slate-900/90 text-cyan-300 border border-slate-700 text-xs font-mono font-bold px-2.5 py-1 rounded-lg">
                  {currentSlide.placaNum}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                ANESTESIAPRO • GUÍAS CLÍNICAS 2025
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5 my-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                {currentSlide.title}
              </h2>
              <p className={`text-xs sm:text-sm font-bold ${currentSlide.textColor}`}>
                {currentSlide.subtitle}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-medium pt-1">
                {currentSlide.tagline}
              </p>
            </div>

            {/* VISUAL INFOGRAPHIC / MEDICAL ILLUSTRATION FOR THE SLIDE */}
            <div className="my-2 shadow-lg">
              <ErasSlideGraphic type={currentSlide.graphicType} />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
              {currentSlide.cards.map((card, cIdx) => (
                <div
                  key={cIdx}
                  className="bg-slate-950/80 border border-white/10 hover:border-cyan-400/50 transition-all rounded-2xl p-3.5 space-y-1.5 shadow-inner"
                >
                  <div className="flex items-center gap-1.5 text-xs font-black text-cyan-300 uppercase">
                    <span className="w-5 h-5 bg-cyan-500/20 text-cyan-300 rounded-full flex items-center justify-center text-[10px]">
                      {cIdx + 1}
                    </span>
                    <span>{card.title}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Highlight Box & Footer Hint */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className={`p-3 rounded-2xl border ${currentSlide.statBox.color} flex items-center gap-3 shrink-0`}>
                <span className="text-lg sm:text-xl font-black">{currentSlide.statBox.value}</span>
                <div className="text-[11px] leading-tight">
                  <p className="font-black uppercase tracking-tight">{currentSlide.statBox.title}</p>
                  <p className="opacity-80">{currentSlide.statBox.desc}</p>
                </div>
              </div>

              <div className="text-right text-xs font-bold text-slate-400 flex items-center justify-end gap-1.5">
                <span>{currentSlide.footerHint}</span>
              </div>
            </div>
          </div>

          {/* Carousel Navigation Toolbar */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={goToPrev}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {/* Numbered Pill Selectors */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-full py-1 scrollbar-none">
              {ERAS_CESAREA_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setSlideIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                    slideIndex === idx
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md scale-110'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                  title={`Placa ${slide.id}: ${slide.title}`}
                >
                  {slide.id}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: RESUMEN Y ARTÍCULO CIENTÍFICO COMPLETO */}
      {activeTab === 'articulo' && (
        <div className="p-4 sm:p-7 bg-slate-900 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-cyan-500/20 text-cyan-300 font-black px-3 py-1 rounded-md border border-cyan-500/30 text-xs">
                CONSENSO INTERNACIONAL ERAS® SOCIETY / SOAP 2025
              </span>
              <span className="text-slate-400">Actualización 2025</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white">
              Guía ERAS 2025: Pilares de la Analgesia Postoperatoria Multimodal en Cesárea
            </h3>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed space-y-3 font-medium">
              <p className="font-bold text-cyan-300 text-sm">Resumen Ejecutivo:</p>
              <p>
                La ERAS® Society publicó en 2025 la esperada actualización de sus guías de manejo posquirúrgico en cesárea (Parte 3), estableciendo un cambio de paradigma hacia la analgesia multimodal protocolizada y el ahorro estricto de opioides sistémicos.
              </p>
              <p>
                El dolor poscesárea severo no solo compromete el bienestar de la madre, sino que retrasa el inicio de la lactancia materna, obstaculiza el apego precoz piel con piel, duplica el riesgo de depresión posparto y quintuplica la probabilidad de cronificación del dolor (dolor persistente postquirúrgico).
              </p>
              <p>
                El pilar neuraxial de elección continúa siendo la Morfina Intratecal (ITM) a dosis bajas (50-100 µg), complementada de forma mandatoria con Paracetamol y AINEs pautados de forma fija (no "a demanda"). En pacientes donde no se administró opioide neuroaxial o en anestesia general, los bloqueos ecoguiados de pared abdominal (TAP block / Cuadrado Lumbar) o la infiltración quirúrgica de la herida son intervenciones de primera línea obligatorias.
              </p>
            </div>
          </div>

          {/* 6 Core Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-blue-400 uppercase">1. Morfina Intratecal (50-100 µg)</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estándar de oro en anestesia espinal. 14 a 24 horas de analgesia profunda sin prurito severo ni depresión respiratoria.
              </p>
            </div>

            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-amber-400 uppercase">2. Paracetamol & AINEs Horario Fijo</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Paracetamol 1g c/6h + Ibuprofeno 600mg c/8h o Ketorolaco a horario estricto. NUNCA a demanda (PRN). Reduce 60% de opioides.
              </p>
            </div>

            <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-emerald-400 uppercase">3. Bloqueos TAP / QLB</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bloqueo fascial ecoguiado bilateral de primera línea en anestesia general o cuando no se colocó morfina intratecal.
              </p>
            </div>

            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-purple-400 uppercase">4. Dexametasona IV Sistémica</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                4 a 8 mg IV al pinzar el cordón. Potente modulador antiinflamatorio sistémico y profilaxis antiemética contra NVPO.
              </p>
            </div>

            <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-rose-400 uppercase">5. Rescate Exclusivo Oral</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Oxicodona 5-10 mg VO o Tramadol 50 mg VO solo si EVA &gt; 4/10. Evitar bombas PCA IV continuas de morfina.
              </p>
            </div>

            <div className="bg-slate-950 border border-green-500/30 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-black text-green-400 uppercase">6. Medidas Físicas y Nutrición</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Faja elástica, deambulación y retiro de sonda en &lt; 12h, líquidos claros a las 2h y chicle terapéutico.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FICHA TÉCNICA Y DOSIFICACIÓN */}
      {activeTab === 'ficha' && (
        <div className="p-4 sm:p-7 bg-slate-900 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-900 p-3.5 border-b border-slate-800 text-xs font-black text-cyan-300 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>TABLA MAESTRA DE FÁRMACOS Y DOSIS ERAS 2025 EN CESÁREA</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Fármaco / Intervención</th>
                    <th className="p-3">Dosis Recomendada</th>
                    <th className="p-3">Vía & Intervalo</th>
                    <th className="p-3">Indicación y Consideraciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-blue-300">Morfina Intratecal (ITM)</td>
                    <td className="p-3 font-mono text-cyan-300">50 a 100 µg (0.05-0.1 mg)</td>
                    <td className="p-3">Subaracnoidea (Dosis única)</td>
                    <td className="p-3">Estándar de oro. 14-24h de analgesia.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-300">Paracetamol</td>
                    <td className="p-3 font-mono text-cyan-300">1 g (1000 mg)</td>
                    <td className="p-3">IV o VO cada 6 horas fijo</td>
                    <td className="p-3">Pilar basal obligado. Máximo 4 g/día.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-300">Ibuprofeno</td>
                    <td className="p-3 font-mono text-cyan-300">600 mg</td>
                    <td className="p-3">Oral cada 8 horas fijo</td>
                    <td className="p-3">AINE de 1ª elección en horario estricto.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-amber-300">Ketorolaco</td>
                    <td className="p-3 font-mono text-cyan-300">15 a 30 mg</td>
                    <td className="p-3">IV cada 6 a 8 horas fijo</td>
                    <td className="p-3">Alternativa IV para las primeras 24-48h.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-purple-300">Dexametasona</td>
                    <td className="p-3 font-mono text-cyan-300">4 a 8 mg</td>
                    <td className="p-3">IV tras pinzar cordón</td>
                    <td className="p-3">Antiemético profiláctico y antiinflamatorio.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-emerald-300">Bloqueo TAP Bilateral</td>
                    <td className="p-3 font-mono text-cyan-300">Ropivacaína 0.2% 15-20 mL/lado</td>
                    <td className="p-3">Plano transverso ecoguiado</td>
                    <td className="p-3">Si NO se usó morfina intratecal o en AG.</td>
                  </tr>
                  <tr className="hover:bg-slate-900/40">
                    <td className="p-3 font-bold text-rose-300">Oxicodona (Rescate)</td>
                    <td className="p-3 font-mono text-cyan-300">5 a 10 mg</td>
                    <td className="p-3">Oral condicional si EVA &gt; 4</td>
                    <td className="p-3">Solo rescate oral. Evitar PCA IV.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ALGORITMO RESUMIDO */}
      {activeTab === 'algoritmo' && (
        <div className="p-4 sm:p-7 bg-slate-900 space-y-4">
          <div className="bg-slate-950 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 space-y-5">
            <h3 className="text-base font-black text-cyan-300 uppercase tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" /> FLUJOGRAMA DE DECISIÓN CLÍNICA ERAS 2025
            </h3>

            <div className="space-y-3">
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs space-y-1">
                <p className="font-bold text-blue-300">PASO 1: VÍA DE ANESTESIA Y PILAR NEURAXIAL</p>
                <p className="text-slate-200">
                  • <strong>Anestesia Espinal:</strong> Morfina Intratecal 50-100 µg + Bupivacaína + Fentanilo.<br />
                  • <strong>Anestesia General o sin Morfina ITM:</strong> Bloqueo TAP ecoguiado bilateral (Ropivacaína 0.2% 15-20 mL/lado) o Bloqueo QLB o infiltración local fascial.
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-1">
                <p className="font-bold text-amber-300">PASO 2: BASES MULTIMODALES OBLIGATORIAS</p>
                <p className="text-slate-200">
                  • <strong>Horario Fijo:</strong> Paracetamol 1g c/6h IV/VO + Ibuprofeno 600mg c/8h VO o Ketorolaco 15-30mg c/6-8h IV.<br />
                  • <strong>Coadyuvante:</strong> Dexametasona 4-8 mg IV al nacer (post-clamp de cordón).
                </p>
              </div>

              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-xs space-y-1">
                <p className="font-bold text-rose-300">PASO 3: RESCATE DE DOLOR IRRUPTIVO</p>
                <p className="text-slate-200">
                  • <strong>Si EVA &gt; 4/10:</strong> Oxicodona 5-10 mg VO o Tramadol 50 mg VO.<br />
                  • <strong>Prohibido de rutina:</strong> Bombas PCA intravenosas continuas de morfina.
                </p>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 text-xs space-y-1">
                <p className="font-bold text-emerald-300">PASO 4: CUIDADOS FÍSICOS Y RECUPERACIÓN FUNCIONAL</p>
                <p className="text-slate-200">
                  • Faja elástica abdominal compresiva postcesárea.<br />
                  • Deambulación y retiro de sonda de Foley en &lt; 12 horas.<br />
                  • Líquidos a las 2h, sólidos en &lt; 4-6h y masticación de chicle preventivo de íleo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface EducationModuleProps {
  initialResourceId?: string | null;
  onClearInitialResource?: () => void;
}

export const EducationModule: React.FC<EducationModuleProps> = ({ initialResourceId, onClearInitialResource }) => {
  const [resources, setResources] = useState<EducationalResource[]>(() => {
    let loaded: EducationalResource[] = [];
    try {
      // Purge dead legacy keys that may contain resurrected deleted items
      ['anestesiapro_education_resources_v2026_eras', 'anestesiapro_education_resources_v16', 'anestesiapro_education_resources_v15', 'anestesiapro_education_resources'].forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      const saved = localStorage.getItem('anestesiapro_education_resources_v2026_stable');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loaded = parsed;
        }
      }
    } catch (e) {
      console.warn('Storage read warning:', e);
    }

    const merged = mergeResources(INITIAL_RESOURCES, loaded, [], getDeletedResourceIds());
    return sortResourcesNewestToOldest(merged);
  });

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(() => {
    if (initialResourceId) {
      return resources.find(r => r.id === initialResourceId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialResourceId) {
      const q = initialResourceId.toLowerCase().trim();
      const found = resources.find(r => 
        r.id === initialResourceId ||
        r.id.toLowerCase() === q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q)
      );
      if (found) {
        setSelectedResource(found);
      }
    }
  }, [initialResourceId, resources]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isPlayingReel, setIsPlayingReel] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Admin / Author Access Lock - STRICTLY PRIVATE FOR DR. CARLOS LEAL ONLY
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const hasUrlParam = typeof window !== 'undefined' && (
        window.location.search.includes('carlos=2534') ||
        window.location.search.includes('carlos=2026') ||
        window.location.search.includes('panel=2534') ||
        window.location.search.includes('admin=2534') ||
        window.location.search.includes('carlosleal')
      );
      if (hasUrlParam) {
        sessionStorage.setItem('anestesiapro_author_session', 'true');
        localStorage.setItem('anestesiapro_admin_mode', 'true');
        localStorage.setItem('anestesiapro_is_author_admin', 'true');
        try {
          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete('carlos');
          cleanUrl.searchParams.delete('panel');
          cleanUrl.searchParams.delete('admin');
          cleanUrl.searchParams.delete('carlosleal');
          window.history.replaceState({}, document.title, cleanUrl.pathname + (cleanUrl.search ? cleanUrl.search : ''));
        } catch {}
        return true;
      }
      return (
        sessionStorage.getItem('anestesiapro_author_session') === 'true' ||
        localStorage.getItem('anestesiapro_admin_mode') === 'true' ||
        localStorage.getItem('anestesiapro_is_author_admin') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [inputPin, setInputPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [secretAuthorClicks, setSecretAuthorClicks] = useState<number>(0);

  // Discreet keyboard shortcut for Dr. Carlos Leal (Alt+A or Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setInputPin('');
        setPinError(false);
        setShowPinModal(prev => !prev);
      }
    };
    const handleGlobalLogout = () => {
      setIsAdmin(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('anestesiapro_admin_logged_out', handleGlobalLogout);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('anestesiapro_admin_logged_out', handleGlobalLogout);
    };
  }, []);

  const secretClickTimeoutRef = React.useRef<any>(null);
  const isStorageInitializedRef = React.useRef<boolean>(false);
  const lastSyncTimestampRef = React.useRef<number>(0);

  const handleSecretAuthorTrigger = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      if ('cancelable' in e && (e as any).cancelable) (e as any).preventDefault();
      e.stopPropagation();
    }
    if (secretClickTimeoutRef.current) {
      clearTimeout(secretClickTimeoutRef.current);
    }
    const next = secretAuthorClicks + 1;
    setSecretAuthorClicks(next);
    if (next >= 3) {
      setSecretAuthorClicks(0);
      setInputPin('');
      setPinError(false);
      setShowPinModal(true);
      return;
    }
    secretClickTimeoutRef.current = setTimeout(() => {
      setSecretAuthorClicks(0);
    }, 2800);
  };

  // Queued files for multi-file upload
  const [queuedFiles, setQueuedFiles] = useState<Array<{
    id: string;
    file?: File;
    name: string;
    size: string;
    extension: string;
    type: string;
    dataUrl?: string;
    title: string;
    category: EducationalResource['category'];
    description?: string;
  }>>([]);
  const [isBatchUploading, setIsBatchUploading] = useState<boolean>(false);
  const [uploadMode, setUploadMode] = useState<'carousel' | 'separate'>('carousel');
  const [isSyncingWithServer, setIsSyncingWithServer] = useState<boolean>(false);
  const [syncBanner, setSyncBanner] = useState<{ type: 'info' | 'success' | 'warning'; message: string } | null>(null);
  const [latestUploadNotification, setLatestUploadNotification] = useState<AppNotification | null>(null);
  const [highlightedResourceId, setHighlightedResourceId] = useState<string | null>(null);
  const [hasLocalPhotosToUpload, setHasLocalPhotosToUpload] = useState<boolean>(false);
  const [localPendingCount, setLocalPendingCount] = useState<number>(0);

  // Form state for uploading new item
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EducationalResource['category']>('pdf');
  const [newDescription, setNewDescription] = useState('');
  const [newAuthor, setNewAuthor] = useState('Dr. Carlos Leal • AnestesiaPro');
  const [newTags, setNewTags] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [fileData, setFileData] = useState<{ name: string; size: string; dataUrl: string; extension: string; type: string } | null>(null);

  const [isCompressingImage, setIsCompressingImage] = useState<boolean>(false);
  const [compressingProgress, setCompressingProgress] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Private Statistics & Analytics Tracking
  const [stats, setStats] = useState<AppStats>(() => {
    try {
      const storedV = localStorage.getItem('anestesiapro_visit_count');
      const storedInst = localStorage.getItem('anestesiapro_app_installs');
      const storedD = localStorage.getItem('anestesiapro_total_downloads');
      const v = storedV !== null ? (parseInt(storedV, 10) || 0) : 865;
      const inst = storedInst !== null ? (parseInt(storedInst, 10) || 0) : 204;
      let itemD: Record<string, number> = {
        'res-preeclampsia-eclampsia-enfoque-anestesiologico': 128,
        'res-calculadora-preeclampsia': 42,
        'res-protocolo-emotive-hemorragia-posparto-2026': 88,
        'res-guia-eras-cesarea-2025': 106,
        'res-modulo-preanestesia-consultado': 121,
        'res-evaluacion-preanestesica': 76,
        'res-enfoque-vortex-via-aerea-dificil': 62,
        'res-fona-cricotiroidotomia': 45,
        'res-calculadora-induccion': 38,
        'res-caso-elaine-bromiley': 33,
        'res-isr-secuencia-rapida-2025': 29,
        'res-orexina-interruptor-despertar-2026': 27,
        'res-aminofilina-teofilina-cppd': 25,
        'res-das-2025-urgencias': 23,
        'res-indice-de-shock': 21,
        'res-modelo-vortex-redar': 19,
        'res-articulo-metaanalisis-aminofilina-2023': 14,
        'res-articulo-estudio-aminofilina-2016': 12,
        'res-cebranopadol-fase3-2026': 0
      };
      try {
        const stored = localStorage.getItem('anestesiapro_resource_downloads');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            Object.keys(parsed).forEach(k => {
              if (k === 'res-cebranopadol-fase3-2026' && parsed[k] === 12) {
                itemD[k] = 0;
              } else {
                itemD[k] = Number(parsed[k]) || 0;
              }
            });
          }
        }
      } catch {}
      const itemSum = Object.values(itemD).reduce((a, b) => a + b, 0);
      const d = storedD !== null ? (parseInt(storedD, 10) || 0) : Math.max(itemSum, 910);
      return { 
        visits: v, 
        appInstalls: inst,
        uniqueDevices: 404,
        totalDownloads: d, 
        itemDownloads: itemD,
        devices: { "Smartphone (Móvil) 📱": 251, "Computadora / PC 💻": 141, "Tablet 📲": 12 },
        locations: { "🇻🇪 Venezuela": 448, "🇨🇴 Colombia": 46, "🇲🇽 México": 40, "🇪🇸 España": 23, "🇦🇷 Argentina": 13, "🇺🇸 Estados Unidos": 11 },
        downloadLocations: { "🇻🇪 Venezuela": 98, "🇨🇴 Colombia": 21, "🇲🇽 México": 14, "🇪🇸 España": 7, "🇦🇷 Argentina": 5, "🇺🇸 Estados Unidos": 3 }
      };
    } catch {
      return { 
        visits: 865, 
        appInstalls: 204,
        uniqueDevices: 404,
        totalDownloads: 910, 
        itemDownloads: {
          'res-preeclampsia-eclampsia-enfoque-anestesiologico': 128,
          'res-calculadora-preeclampsia': 42,
          'res-protocolo-emotive-hemorragia-posparto-2026': 88,
          'res-guia-eras-cesarea-2025': 106,
          'res-modulo-preanestesia-consultado': 121,
          'res-evaluacion-preanestesica': 76,
          'res-enfoque-vortex-via-aerea-dificil': 62,
          'res-fona-cricotiroidotomia': 45,
          'res-calculadora-induccion': 38,
          'res-caso-elaine-bromiley': 33,
          'res-isr-secuencia-rapida-2025': 29,
          'res-orexina-interruptor-despertar-2026': 27,
          'res-aminofilina-teofilina-cppd': 25,
          'res-das-2025-urgencias': 23,
          'res-indice-de-shock': 21,
          'res-modelo-vortex-redar': 19,
          'res-articulo-metaanalisis-aminofilina-2023': 14,
          'res-articulo-estudio-aminofilina-2016': 12,
          'res-cebranopadol-fase3-2026': 0
        },
        devices: { "Smartphone (Móvil) 📱": 251, "Computadora / PC 💻": 141, "Tablet 📲": 12 },
        locations: { "🇻🇪 Venezuela": 448, "🇨🇴 Colombia": 46, "🇲🇽 México": 40, "🇪🇸 España": 23, "🇦🇷 Argentina": 13, "🇺🇸 Estados Unidos": 11 },
        downloadLocations: { "🇻🇪 Venezuela": 98, "🇨🇴 Colombia": 21, "🇲🇽 México": 14, "🇪🇸 España": 7, "🇦🇷 Argentina": 5, "🇺🇸 Estados Unidos": 3 }
      };
    }
  });

  const updateStatsSafely = (s: AppStats) => {
    if (!s) return;
    setStats(prev => {
      const mergedItemD = {
        ...(prev?.itemDownloads || {}),
        ...(s.itemDownloads || {})
      };
      if (mergedItemD['res-cebranopadol-fase3-2026'] === 12 && (!s.itemDownloads || s.itemDownloads['res-cebranopadol-fase3-2026'] === 0)) {
        mergedItemD['res-cebranopadol-fase3-2026'] = 0;
      }
      const nextVisits = s.visits !== undefined ? Number(s.visits) : (prev?.visits || 0);
      const nextDownloads = s.totalDownloads !== undefined ? Number(s.totalDownloads) : (prev?.totalDownloads || 0);
      if (prev && prev.visits === nextVisits && prev.totalDownloads === nextDownloads) {
        return prev;
      }
      return {
        visits: nextVisits,
        appInstalls: s.appInstalls !== undefined ? Number(s.appInstalls) : (prev?.appInstalls || 0),
        uniqueDevices: s.uniqueDevices !== undefined ? Number(s.uniqueDevices) : (prev?.uniqueDevices || 0),
        totalDownloads: nextDownloads,
        itemDownloads: mergedItemD,
        devices: s.devices || prev?.devices || {},
        locations: s.locations || prev?.locations || {},
        downloadLocations: s.downloadLocations || prev?.downloadLocations || {}
      };
    });
  };

  useEffect(() => {
    getGlobalStats().then(s => {
      if (s) updateStatsSafely(s);
    });

    const onStatsUpdated = (e: any) => {
      if (e.detail) updateStatsSafely(e.detail);
    };
    window.addEventListener('anestesiapro_stats_updated', onStatsUpdated);

    const refreshOnFocus = () => {
      getGlobalStats().then(s => { if (s) updateStatsSafely(s); });
    };
    window.addEventListener('focus', refreshOnFocus);
    window.addEventListener('visibilitychange', refreshOnFocus);

    const interval = setInterval(() => {
      getGlobalStats().then(s => {
        if (s) updateStatsSafely(s);
      });
    }, 60000);
    return () => {
      window.removeEventListener('anestesiapro_stats_updated', onStatsUpdated);
      window.removeEventListener('focus', refreshOnFocus);
      window.removeEventListener('visibilitychange', refreshOnFocus);
      clearInterval(interval);
    };
  }, []);

  const recordDownload = (resId: string) => {
    recordGlobalDownload(resId).then(updatedStats => {
      if (updatedStats) {
        updateStatsSafely(updatedStats);
      }
    });
  };

  useEffect(() => {
    if (isStorageInitializedRef.current) {
      persistResources(resources);
    }
  }, [resources]);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('anestesiapro_admin_mode', 'true');
      localStorage.setItem('anestesiapro_is_author_admin', 'true');
    } else {
      localStorage.removeItem('anestesiapro_admin_mode');
      localStorage.removeItem('anestesiapro_is_author_admin');
    }
  }, [isAdmin]);

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Valid Author PINs: '2534' (default), '2026', 'ADMIN', 'CARLOS', 'CARLOSLEAL'
    const cleanPin = inputPin.trim().toUpperCase();
    if (cleanPin === '2534' || cleanPin === '2026' || cleanPin === 'ANESTESIAPRO' || cleanPin === 'ADMIN' || cleanPin === 'CARLOS' || cleanPin === 'CARLOSLEAL') {
      setIsAdmin(true);
      try {
        sessionStorage.setItem('anestesiapro_author_session', 'true');
        localStorage.setItem('anestesiapro_admin_mode', 'true');
        localStorage.setItem('anestesiapro_is_author_admin', 'true');
      } catch (err) {}
      setShowPinModal(false);
      setInputPin('');
      setPinError(false);
      setToastMessage('Panel privado de Autor desbloqueado para el Dr. Carlos Leal.');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setPinError(true);
    }
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem('anestesiapro_author_session');
      localStorage.removeItem('anestesiapro_admin_mode');
      localStorage.removeItem('anestesiapro_is_author_admin');
      localStorage.removeItem('anestesiapro_pin_authorized');
    } catch (err) {}
    window.dispatchEvent(new CustomEvent('anestesiapro_admin_logged_out'));
    setToastMessage('Panel privado de Autor cerrado y bloqueado.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Photo replacement & multi-image carousel editing state (Dr. Carlos Leal)
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [manageSearchQuery, setManageSearchQuery] = useState('');
  const [resourceToEdit, setResourceToEdit] = useState<EducationalResource | null>(null);
  const [carouselSlideIndex, setCarouselSlideIndex] = useState<number>(0);
  const [editSlides, setEditSlides] = useState<Array<{ id: string; url: string; file?: File; caption?: string }>>([]);
  const [activeEditSlideIndex, setActiveEditSlideIndex] = useState<number>(0);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isProcessingEditPhotos, setIsProcessingEditPhotos] = useState(false);

  const handleOpenEditResourceModal = (res: EducationalResource) => {
    setResourceToEdit(res);
    setEditTitle(res.title || '');
    setEditDescription(res.description || '');

    // Extract all images belonging to this resource
    const existingImages: string[] = [];
    if (Array.isArray(res.images) && res.images.length > 0) {
      existingImages.push(...res.images.filter(Boolean));
    } else if (res.url && !res.url.endsWith('.pdf')) {
      existingImages.push(res.url);
    } else if (res.fileDataUrl && !res.fileDataUrl.startsWith('data:application/pdf')) {
      existingImages.push(res.fileDataUrl);
    }

    const captions = Array.isArray(res.imageCaptions) ? res.imageCaptions : [];
    const slides = existingImages.map((imgUrl, idx) => ({
      id: `slide-orig-${idx}-${Date.now()}`,
      url: imgUrl,
      caption: captions[idx] || `Lámina ${idx + 1}`
    }));

    setEditSlides(slides);
    setActiveEditSlideIndex(0);
  };

  const handleSelectNewPhotosForEdit = async (files: FileList | File[]) => {
    const filesArray = Array.from(files);
    if (!filesArray.length) return;

    setIsProcessingEditPhotos(true);
    try {
      const newSlideItems: Array<{ id: string; url: string; file?: File; caption?: string }> = [];
      for (let i = 0; i < filesArray.length; i++) {
        const processed = await processSingleFile(filesArray[i]);
        const previewUrl = processed.dataUrl || URL.createObjectURL(filesArray[i]);
        newSlideItems.push({
          id: `slide-new-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          url: previewUrl,
          file: processed.file || filesArray[i],
          caption: `Lámina ${editSlides.length + i + 1}`
        });
      }

      setEditSlides(prev => {
        const updated = [...prev, ...newSlideItems];
        setActiveEditSlideIndex(updated.length - 1);
        return updated;
      });
    } catch (err) {
      console.warn('Error processing new photos for edit:', err);
    } finally {
      setIsProcessingEditPhotos(false);
    }
  };

  const handleRemoveEditSlide = (slideId: string) => {
    setEditSlides(prev => {
      const updated = prev.filter(s => s.id !== slideId);
      if (activeEditSlideIndex >= updated.length) {
        setActiveEditSlideIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  const handleMoveEditSlide = (index: number, direction: 'up' | 'down') => {
    setEditSlides(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      setActiveEditSlideIndex(targetIndex);
      return copy;
    });
  };

  const handleSaveEditResource = async () => {
    if (!resourceToEdit) return;
    setIsSavingEdit(true);

    try {
      // 1. Upload any newly added photo files to /api/upload
      const finalImageUrls: string[] = [];
      const finalCaptions: string[] = [];
      const finalBase64List: string[] = [];

      for (let i = 0; i < editSlides.length; i++) {
        const slide = editSlides[i];
        finalCaptions.push(slide.caption || `Lámina ${i + 1}`);

        if (slide.dataUrl && typeof slide.dataUrl === 'string' && slide.dataUrl.startsWith('data:')) {
          finalBase64List.push(slide.dataUrl);
        } else if (slide.url && typeof slide.url === 'string' && slide.url.startsWith('data:')) {
          finalBase64List.push(slide.url);
        }

        if (slide.file) {
          try {
            const formData = new FormData();
            formData.append('file', slide.file);
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 30000);
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'x-author-pin': '2534',
                'x-client-app': 'anestesiapro'
              },
              body: formData,
              signal: controller.signal
            });
            clearTimeout(timer);
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData.success && uploadData.url) {
                finalImageUrls.push(uploadData.url);
                continue;
              }
            }
          } catch (uploadErr) {
            console.warn(`Error uploading slide ${i}:`, uploadErr);
          }
          // Fallback to dataUrl or blob url
          finalImageUrls.push(slide.dataUrl || slide.url);
        } else {
          // Existing persistent URL
          finalImageUrls.push(slide.url);
        }
      }

      const isMultiSlide = finalImageUrls.length > 1;
      const primaryBase64 = finalBase64List[0] || (finalImageUrls[0]?.startsWith('data:') ? finalImageUrls[0] : '');
      const primaryUrl = finalImageUrls[0] || (editSlides.length > 0 ? editSlides[0].url : '');
      const hasImages = finalImageUrls.length > 0;

      const updatedPayload: EducationalResource = {
        ...resourceToEdit,
        title: editTitle.trim() || resourceToEdit.title,
        description: editDescription.trim() || resourceToEdit.description,
        url: primaryUrl,
        fileDataUrl: primaryBase64 || (primaryUrl.startsWith('data:') ? primaryUrl : ''),
        images: hasImages ? finalImageUrls : [],
        imagesData: finalBase64List.length > 0 ? finalBase64List : (hasImages ? finalImageUrls.filter(u => typeof u === 'string' && u.startsWith('data:')) : []),
        imageCaptions: isMultiSlide ? finalCaptions : undefined,
        isCarousel: isMultiSlide ? true : (finalImageUrls.length === 1 ? false : resourceToEdit.isCarousel),
        fileSize: isMultiSlide ? `${finalImageUrls.length} láminas HD` : resourceToEdit.fileSize,
        category: (isMultiSlide && resourceToEdit.category === 'pdf') ? 'infografia' : resourceToEdit.category,
        photoDeleted: !hasImages && !primaryUrl,
        updatedAt: new Date().toISOString()
      };

      // 1. Transmit update to Cloud Firestore directly (guarantees cross-device persistence with zero delay)
      try {
        await saveCloudResource(updatedPayload);
      } catch (cloudErr) {
        console.warn('[AnestesiaPro Cloud] Cloud Firestore save error during edit:', cloudErr);
      }

      // 2. Transmit update to server
      try {
        await fetch(`/api/education/resources/${encodeURIComponent(resourceToEdit.id)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-author-pin': '2534'
          },
          body: JSON.stringify(updatedPayload)
        });
      } catch (srvErr) {
        console.warn('Server PUT warning:', srvErr);
      }

      // 3. Update local state and persistence
      setResources(prev => {
        const updated = prev.map(r => r.id === resourceToEdit.id ? updatedPayload : r);
        persistResources(updated);
        window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: updated }));
        return updated;
      });

      if (selectedResource?.id === resourceToEdit.id) {
        setSelectedResource(updatedPayload);
      }

      setToastMessage(isMultiSlide 
        ? `¡Carrusel de ${finalImageUrls.length} láminas actualizado con éxito en la nube!` 
        : 'Recurso y foto actualizados exitosamente en la nube.');
      setTimeout(() => setToastMessage(null), 3500);
      setResourceToEdit(null);
    } catch (err) {
      console.error('Error updating resource photo/carousel:', err);
      setToastMessage('Error al actualizar el recurso.');
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Helper to extract photo URL of a resource (only user-uploaded photos)
  const getResourcePhoto = (res: EducationalResource): string | null => {
    if (res.photoDeleted) return null;
    if (Array.isArray(res.images) && res.images.length === 0 && (!res.url || res.url === '') && (!res.fileDataUrl || res.fileDataUrl === '')) {
      return null;
    }

    // 1. Primary images array (uploaded photos / carousel slides)
    if (Array.isArray(res.images) && res.images.length > 0 && res.images[0]) {
      const firstImg = res.images[0];
      if (
        typeof firstImg === 'string' &&
        firstImg.trim() !== '' &&
        !firstImg.startsWith('/images/') &&
        (firstImg.startsWith('/uploads/') || firstImg.startsWith('data:image/') || firstImg.startsWith('blob:') || firstImg.startsWith('http://') || firstImg.startsWith('https://'))
      ) {
        return firstImg;
      }
    }

    // 2. Direct user uploaded URL (/uploads/, data:image, blob, http)
    if (res.url && typeof res.url === 'string' && res.url.trim() !== '') {
      if (
        !res.url.startsWith('/images/') &&
        (res.url.startsWith('data:image/') ||
        res.url.startsWith('/uploads/') ||
        res.url.startsWith('blob:') ||
        res.url.startsWith('http://') ||
        res.url.startsWith('https://'))
      ) {
        return res.url;
      }
    }

    // 3. Base64 fallback in imagesData
    if (Array.isArray(res.imagesData) && res.imagesData.length > 0 && res.imagesData[0] && typeof res.imagesData[0] === 'string' && res.imagesData[0].startsWith('data:image')) {
      return res.imagesData[0];
    }

    // 4. fileDataUrl
    if (res.fileDataUrl && res.fileDataUrl.startsWith('data:image')) {
      return res.fileDataUrl;
    }

    return null;
  };

  // Direct photo/carousel upload for any card (Dr. Carlos Leal)
  const handleDirectUploadPhoto = async (resourceId: string, incomingFiles: FileList | File[] | File) => {
    try {
      const filesArray = Array.isArray(incomingFiles) 
        ? incomingFiles 
        : (incomingFiles instanceof FileList ? Array.from(incomingFiles) : [incomingFiles]);
      if (!filesArray.length) return;

      setToastMessage(filesArray.length > 1 
        ? `Optimizando y subiendo ${filesArray.length} láminas para el carrusel...` 
        : 'Subiendo foto del recurso...');

      const target = resources.find(r => r.id === resourceId);
      if (!target) return;

      const processedItems: Array<{ dataUrl?: string; file?: File; name: string }> = [];
      for (const file of filesArray) {
        const p = await processSingleFile(file);
        processedItems.push(p);
      }

      const uploadedUrls: string[] = [];
      const rawBase64s: string[] = [];

      for (const item of processedItems) {
        let finalUrl = item.dataUrl;
        if (item.dataUrl) rawBase64s.push(item.dataUrl);

        try {
          if (item.file) {
            const formData = new FormData();
            formData.append('file', item.file);
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 20000);
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'x-author-pin': '2534',
                'x-client-app': 'anestesiapro'
              },
              body: formData,
              signal: controller.signal
            });
            clearTimeout(timer);
            if (uploadRes.ok) {
              const uData = await uploadRes.json();
              if (uData.success && uData.url) {
                finalUrl = uData.url;
              }
            }
          }
        } catch (uErr) {
          console.warn('Direct upload server warning, using dataUrl fallback:', uErr);
        }

        if (finalUrl) uploadedUrls.push(finalUrl);
      }

      if (!uploadedUrls.length) {
        setToastMessage('Error al procesar las imágenes.');
        setTimeout(() => setToastMessage(null), 3000);
        return;
      }

      const isMulti = uploadedUrls.length > 1 || (Array.isArray(target.images) && target.images.length > 1);
      const combinedImages = filesArray.length > 1 
        ? uploadedUrls 
        : [...(Array.isArray(target.images) && target.images.length > 0 ? target.images : (target.url ? [target.url] : [])), ...uploadedUrls];

      const updatedPayload: EducationalResource = {
        ...target,
        url: combinedImages[0] || uploadedUrls[0],
        fileDataUrl: rawBase64s[0] || target.fileDataUrl,
        images: combinedImages,
        imagesData: rawBase64s.length > 0 ? rawBase64s : target.imagesData,
        isCarousel: combinedImages.length > 1,
        fileSize: combinedImages.length > 1 ? `${combinedImages.length} láminas HD` : target.fileSize,
        category: (combinedImages.length > 1 && target.category === 'pdf') ? 'infografia' : target.category,
        photoDeleted: false
      };

      // Transmit update to server & Cloud Firestore directly
      try {
        await saveCloudResource(updatedPayload);
      } catch (e) {}

      try {
        await fetch(`/api/education/resources/${encodeURIComponent(resourceId)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-author-pin': '2534',
            'x-client-app': 'anestesiapro'
          },
          body: JSON.stringify(updatedPayload)
        });
      } catch (srvErr) {
        console.warn('Server PUT warning:', srvErr);
      }

      // Update state and persistence
      setResources(prev => {
        const updated = prev.map(r => r.id === resourceId ? updatedPayload : r);
        persistResources(updated);
        window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: updated }));
        return updated;
      });

      if (selectedResource?.id === resourceId) {
        setSelectedResource(updatedPayload);
      }

      window.dispatchEvent(new CustomEvent('anestesiapro_new_resource_published'));
      setToastMessage(combinedImages.length > 1 
        ? `¡Carrusel de ${combinedImages.length} láminas actualizado con éxito en la nube!` 
        : 'Foto subida y guardada exitosamente.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error uploading photo/carousel:', err);
      setToastMessage('Error al subir fotos.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Direct photo delete for any card (Dr. Carlos Leal)
  const handleDeleteResourcePhoto = async (resourceId: string, resourceTitle?: string) => {
    const confirmed = window.confirm(`¿Deseas eliminar la foto de "${resourceTitle || 'este recurso'}"?`);
    if (!confirmed) return;

    try {
      const target = resources.find(r => r.id === resourceId);
      if (!target) return;

      const updatedPayload: EducationalResource = {
        ...target,
        url: '',
        fileDataUrl: '',
        images: [],
        imagesData: [],
        photoDeleted: true,
        updatedAt: new Date().toISOString()
      };

      // Transmit to server & Cloud Firestore
      try {
        saveCloudResource(updatedPayload);
      } catch (e) {}

      try {
        await fetch(`/api/education/resources/${encodeURIComponent(resourceId)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-author-pin': '2534'
          },
          body: JSON.stringify(updatedPayload)
        });
      } catch (srvErr) {
        console.warn('Server PUT photo delete warning:', srvErr);
      }

      // Update state and persistence
      setResources(prev => {
        const updated = prev.map(r => r.id === resourceId ? updatedPayload : r);
        persistResources(updated);
        window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: updated }));
        return updated;
      });

      if (selectedResource?.id === resourceId) {
        setSelectedResource(updatedPayload);
      }

      setToastMessage('Foto eliminada correctamente.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error('Error deleting photo:', err);
      setToastMessage('Error al eliminar la foto.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Helper function to download a sample PDF using jsPDF
  const downloadSamplePDF = () => {
    downloadGeneratedPDF(
      'Guía Clínica DAS 2025: Actualización en Manejo de Vía Aérea Difícil No Anticipada',
      'Difficult Airway Society (DAS) • Edición AnestesiaPro',
      new Date().toLocaleDateString('es-ES'),
      'pdf',
      `GUÍA CLÍNICA DE VÍA AÉREA DIFÍCIL (DAS 2025)

1. Concepto de Éxito al Primer Intento:
   - Uso universal de videolaringoscopia (pala hipercurva o estándar).
   - Posicionamiento óptimo del paciente (rampa/head-up).
   - Bloqueo neuromuscular profundo antes del intento.

2. Vía Aérea Fisiológicamente Difícil:
   - Manejo anticipado de hipotensión, hipoxemia y acidosis en paciente crítico.
   - Ventilación no invasiva y cánula nasal de alto flujo (HFNO) durante el procedimiento.

3. Algoritmo Modificado A-B-C-D:
   - Plan A: Intubación traqueal con videolaringoscopio + guía.
   - Plan B: Dispositivo Supraglótico (DSG) de 2ª Generación.
   - Plan C: Ventilación con mascarilla a dos manos + cánula oral.
   - Plan D: Acceso Frontal de Cuello de Emergencia (eFONA cricotiroidotomía scalpel-bougie-tube).`,
      ['#DAS2025', '#ViaAereaDificil', '#AnestesiaPro', '#GuiasClinicas'],
      'AnestesiaPro_Guia_Oficial_DAS_2025_Via_Aerea_Dificil.pdf'
    );
  };

  // Helper function to download a sample Video MP4
  const downloadSampleVideo = () => {
    downloadGeneratedPDF(
      'Ficha Técnica y Guía de Video Reel: Demostración Quirúrgica DAS 2025',
      'Dr. Carlos Leal • AnestesiaPro',
      new Date().toLocaleDateString('es-ES'),
      'reel',
      `VIDEO INSTRUCTIVO REEL MP4 (DEMOSTRACIÓN EN QUIRÓFANO)

• Título: Técnica de Abordaje y Procedimiento Anestésico en Vía Aérea Difícil DAS 2025.
• Duración: 2 min 45 seg.
• Formato: Video Vertical HD 1080p.
• Contenido: Paso a paso de videolaringoscopia, colocación de dispositivo supraglótico y técnica eFONA.`,
      ['#VideoReel', '#DAS2025', '#Quirofano', '#AnestesiaPro'],
      'AnestesiaPro_Ficha_Video_Reel_DAS_2025.pdf'
    );
  };

  // Auto-fill form with sample PDF
  const loadSamplePdfPreset = () => {
    setNewTitle('Guía Clínica: Protocolo de Manejo Perioperatorio en Vía Aérea Difícil');
    setNewCategory('pdf');
    setNewDescription('Documento técnico especializado en secuencia de intubación rápida, predictores de vía aérea y algoritmos de rescate supraglótico.');
    setNewAuthor('Dr. Carlos Leal • AnestesiaPro');
    setNewTags('EducaciónContinua, PDF, GuiasClinicas, Anestesia');
    setFileData({
      name: 'AnestesiaPro_Guia_Via_Aerea.pdf',
      size: '2.8 MB',
      dataUrl: '',
      extension: 'pdf',
      type: 'application/pdf'
    });
  };

  // Auto-fill form with sample Video MP4
  const loadSampleVideoPreset = () => {
    setNewTitle('Video Reel: Técnica de Abordaje y Procedimiento Anestésico');
    setNewCategory('reel');
    setNewDescription('Video instructivo en formato vertical HD con la descripción paso a paso del abordaje anestésico en quirófano.');
    setNewAuthor('Dr. Carlos Leal • AnestesiaPro');
    setNewTags('EducaciónContinua, VideoReel, Quirofano, Anestesiologia');
    setFileData({
      name: 'AnestesiaPro_Video_Procedimiento.mp4',
      size: '15.4 MB',
      dataUrl: '',
      extension: 'mp4',
      type: 'video/mp4'
    });
  };

  // Process a single file (compressing images HD, reading data, autodetecting category)
  const processSingleFile = (file: File): Promise<{
    id: string;
    file?: File;
    name: string;
    size: string;
    extension: string;
    type: string;
    dataUrl?: string;
    title: string;
    category: EducationalResource['category'];
    description?: string;
  }> => {
    return new Promise((resolve) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'file';
      const isImage = file.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg', 'heic', 'heif', 'avif', 'tiff', 'tif'].includes(ext);

      let category: EducationalResource['category'] = 'pdf';
      if (['mp4', 'mov', 'webm', 'avi', 'm4v'].includes(ext)) {
        category = 'reel';
      } else if (isImage) {
        category = 'infografia';
      } else if (['pdf'].includes(ext)) {
        category = 'pdf';
      } else if (['ppt', 'pptx', 'key'].includes(ext)) {
        category = 'presentacion';
      } else if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
        category = 'pauta';
      } else if (['zip', 'rar', '7z', 'tar'].includes(ext)) {
        category = 'archivo';
      }

      const rawBaseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const cleanTitle = rawBaseName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();

      const sizeMb = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      if (isImage && !file.type.includes('svg')) {
        let isSettled = false;
        const objectUrl = URL.createObjectURL(file);

        // Failsafe 4-second timer so the UI NEVER hangs or freezes on photo loading/decoding
        const safetyTimer = setTimeout(() => {
          if (!isSettled) {
            isSettled = true;
            try { URL.revokeObjectURL(objectUrl); } catch {}
            const reader = new FileReader();
            reader.onload = (ev) => {
              resolve({
                id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                file,
                name: file.name,
                size: sizeMb,
                dataUrl: ev.target?.result as string,
                extension: ext,
                type: file.type || 'image/jpeg',
                title: cleanTitle,
                category: 'infografia'
              });
            };
            reader.onerror = () => {
              resolve({
                id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                file,
                name: file.name,
                size: sizeMb,
                dataUrl: undefined,
                extension: ext,
                type: file.type || 'image/jpeg',
                title: cleanTitle,
                category: 'infografia'
              });
            };
            reader.readAsDataURL(file);
          }
        }, 4000);

        const img = new Image();
        img.onload = () => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(safetyTimer);
          URL.revokeObjectURL(objectUrl);
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1280; // High definition, crystal sharp on retina & mobile, lightweight (~80-110KB)

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            const sizeKb = Math.round((compressedDataUrl.length * 3) / 4 / 1024);

            let blobResolved = false;
            const completeWithBlob = (blob: Blob | null) => {
              if (blobResolved) return;
              blobResolved = true;
              let optFile: File = file;
              try {
                if (blob && typeof File !== 'undefined') {
                  optFile = new File([blob], `${cleanTitle || 'foto'}.jpg`, { type: 'image/jpeg' });
                }
              } catch {
                optFile = file;
              }
              resolve({
                id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                file: optFile,
                name: `${cleanTitle || file.name}.jpg`,
                size: `${sizeKb} KB (Foto HD optimizada)`,
                dataUrl: compressedDataUrl,
                extension: 'jpg',
                type: 'image/jpeg',
                title: cleanTitle,
                category: 'infografia'
              });
            };

            const blobTimer = setTimeout(() => {
              completeWithBlob(null);
            }, 1500);

            try {
              canvas.toBlob((blob) => {
                clearTimeout(blobTimer);
                completeWithBlob(blob);
              }, 'image/jpeg', 0.82);
            } catch {
              clearTimeout(blobTimer);
              completeWithBlob(null);
            }
          } else {
            const reader = new FileReader();
            reader.onload = (ev) => {
              resolve({
                id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                file,
                name: file.name,
                size: `${Math.round(file.size / 1024)} KB`,
                dataUrl: ev.target?.result as string,
                extension: ext,
                type: file.type,
                title: cleanTitle,
                category
              });
            };
            reader.readAsDataURL(file);
          }
        };
        img.onerror = () => {
          if (isSettled) return;
          isSettled = true;
          clearTimeout(safetyTimer);
          URL.revokeObjectURL(objectUrl);
          const reader = new FileReader();
          reader.onload = (ev) => {
            resolve({
              id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              file,
              name: file.name,
              size: sizeMb,
              dataUrl: ev.target?.result as string,
              extension: ext,
              type: file.type,
              title: cleanTitle,
              category
            });
          };
          reader.readAsDataURL(file);
        };
        img.src = objectUrl;
      } else {
        // Para videos o archivos pesados (> 6MB), no cargamos base64 gigantes en memoria RAM
        // El archivo se sube de forma limpia y directa vía FormData al disco del servidor (/api/upload)
        if (file.size > 6 * 1024 * 1024) {
          resolve({
            id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file,
            name: file.name,
            size: sizeMb,
            dataUrl: undefined,
            extension: ext,
            type: file.type,
            title: cleanTitle,
            category
          });
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            resolve({
              id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              file,
              name: file.name,
              size: sizeMb,
              dataUrl: result,
              extension: ext,
              type: file.type,
              title: cleanTitle,
              category
            });
          };
          reader.onerror = () => {
            resolve({
              id: `qfile-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              file,
              name: file.name,
              size: sizeMb,
              dataUrl: undefined,
              extension: ext,
              type: file.type,
              title: cleanTitle,
              category
            });
          };
          reader.readAsDataURL(file);
        }
      }
    });
  };

  // Multiple files selection handler (sequential compression to avoid mobile browser canvas memory crashes)
  const handleFilesSelected = async (incomingFiles: FileList | File[]) => {
    const filesArray = Array.from(incomingFiles);
    if (!filesArray.length) return;

    setIsCompressingImage(true);
    try {
      const processedList: Array<{
        id: string;
        file?: File;
        name: string;
        size: string;
        extension: string;
        type: string;
        dataUrl?: string;
        title: string;
        category: EducationalResource['category'];
        description?: string;
      }> = [];
      for (let i = 0; i < filesArray.length; i++) {
        setCompressingProgress(`Optimizando lámina ${i + 1} de ${filesArray.length}...`);
        const item = await processSingleFile(filesArray[i]);
        processedList.push(item);
      }

      setQueuedFiles(prev => {
        const combined = [...prev, ...processedList];
        const imageCount = combined.filter(q => q.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(q.extension)).length;
        if (imageCount >= 2) {
          setUploadMode('carousel');
        }
        return combined;
      });

      // If form had no title yet, populate with first file clean name
      if (!newTitle && processedList.length > 0) {
        setNewTitle(processedList[0].title);
      }
      if (processedList.length === 1) {
        setNewCategory(processedList[0].category);
      }
    } catch (err) {
      console.error('Error processing files:', err);
    } finally {
      setIsCompressingImage(false);
      setCompressingProgress('');
    }
  };

  const handleRemoveQueuedFile = (id: string) => {
    setQueuedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleMoveQueuedFile = (index: number, direction: 'up' | 'down') => {
    setQueuedFiles(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleUpdateQueuedTitle = (id: string, newTitleVal: string) => {
    setQueuedFiles(prev => prev.map(f => f.id === id ? { ...f, title: newTitleVal } : f));
  };

  const handleUpdateQueuedCategory = (id: string, newCatVal: EducationalResource['category']) => {
    setQueuedFiles(prev => prev.map(f => f.id === id ? { ...f, category: newCatVal } : f));
  };

  // Automatic Server Sync: Pushes custom resources to server so all devices stay updated
  const syncLocalResourcesToServer = async (customItemsToSync: EducationalResource[], silent: boolean = false) => {
    if (!customItemsToSync.length) return;
    if (!silent) setIsSyncingWithServer(true);

    try {
      // 1. Direct Cloud Firestore synchronization: guarantees cross-device persistence with zero delay
      for (const item of customItemsToSync) {
        try {
          await saveCloudResource(item);
        } catch (cloudErr) {
          console.warn('[AnestesiaPro Cloud] Cloud Firestore sync notice:', item?.id, cloudErr);
        }
      }

      let lastServerItems: EducationalResource[] | null = null;
      // Sync one by one so heavy media uploads never timeout or crash on mobile devices
      for (const item of customItemsToSync) {
        try {
          const res = await fetch('/api/education/resources', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-author-pin': '2534'
            },
            body: JSON.stringify({ 
              resources: [item],
              authorPin: '2534',
              isSync: true
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.allResources)) {
              lastServerItems = data.allResources as EducationalResource[];
            }
          }
        } catch (itemErr) {
          console.warn('[AnestesiaPro] Error syncing single item to server:', item?.id, itemErr);
        }
      }

      if (lastServerItems && lastServerItems.length > 0) {
        setResources(prev => {
          const merged = mergeResources(INITIAL_RESOURCES, prev, lastServerItems!);
          const sorted = sortResourcesNewestToOldest(merged);
          // Only update state if there are actual structural differences
          if (sorted.length !== prev.length || sorted[0]?.id !== prev[0]?.id) {
            persistResources(sorted);
            window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: sorted }));
            return sorted;
          }
          const hasDiff = sorted.some((it, idx) => {
            const p = prev[idx];
            return !p || p.id !== it.id || p.updatedAt !== it.updatedAt;
          });
          if (hasDiff) {
            persistResources(sorted);
            window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: sorted }));
            return sorted;
          }
          return prev;
        });
      }
    } catch (e) {
      console.warn('[AnestesiaPro] Background sync note:', e);
    } finally {
      if (!silent) setIsSyncingWithServer(false);
    }
  };

  // Manual trigger for synchronization across devices
  const handleManualSync = async () => {
    setIsSyncingWithServer(true);
    setSyncBanner({
      type: 'info',
      message: 'Sincronizando con la nube central de AnestesiaPro...'
    });

    try {
      // 1. Fetch from server with dual-fallback (API + Static JSON)
      const { resources: serverList, deletedIds: srvDeletedIds } = await fetchServerResources();
      
      // Register any server deleted IDs locally
      if (Array.isArray(srvDeletedIds)) {
        srvDeletedIds.forEach((did: string) => markResourceAsDeleted(did));
      }

      // 2. Identify all local custom or updated resources across IndexedDB, excluding tombstones
      const locallyPersisted = await loadStoredResources();
      const deletedIds = getDeletedResourceIds();

      const itemsToSync = locallyPersisted.filter(loc => {
        if (!loc || !loc.id || deletedIds.includes(loc.id)) return false;
        const srvMatch = serverList.find(srv => srv.id === loc.id);
        if (!srvMatch) return true; // Push to server if missing on server
        if (loc.updatedAt && srvMatch.updatedAt && new Date(loc.updatedAt).getTime() > new Date(srvMatch.updatedAt).getTime()) return true;
        return false;
      });

      if (itemsToSync.length > 0) {
        await syncLocalResourcesToServer(itemsToSync);
      }

      // Merge server items into local view and persist
      const cleanLocals = (await loadStoredResources()).filter(l => l && !deletedIds.includes(l.id));
      const merged = mergeResources(INITIAL_RESOURCES, cleanLocals, serverList, srvDeletedIds || []);
      const sorted = sortResourcesNewestToOldest(merged);
      setResources(sorted);
      await persistResources(sorted);
      window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: sorted }));

      setSyncBanner({
        type: 'success',
        message: `Sincronización completa: ${sorted.length} recursos actualizados en la nube y disponibles en tu teléfono y PC.`
      });
      setTimeout(() => setSyncBanner(null), 5000);
    } catch (err) {
      console.error('Error during manual sync:', err);
      setSyncBanner({
        type: 'warning',
        message: 'Error al conectar con el servidor. Revisa tu conexión a internet.'
      });
      setTimeout(() => setSyncBanner(null), 5000);
    } finally {
      setIsSyncingWithServer(false);
    }
  };

  // Limpiar caché local y resincronizar al 100% con la nube oficial
  const handleCleanLocalCacheAndResync = async () => {
    setIsSyncingWithServer(true);
    try {
      // 1. Fetch server resources & deletedIds fresh with dual fallback
      const { resources: serverList, deletedIds: remoteDeleted } = await fetchServerResources();
      
      // Register all remote deleted IDs locally
      if (Array.isArray(remoteDeleted)) {
        remoteDeleted.forEach((did: string) => markResourceAsDeleted(did));
      }

      // 2. Clear out any local items from IndexedDB that are not on the server
      const srvIds = new Set(serverList.map(s => s.id));
      const builtinIds = new Set(INITIAL_RESOURCES.map(b => b.id));
      const locallyPersisted = await loadStoredResources();
      for (const loc of locallyPersisted) {
        if (loc && loc.id && !builtinIds.has(loc.id) && !srvIds.has(loc.id)) {
          await removeStoredResource(loc.id);
        }
      }

      // 3. Re-merge and persist
      const cleanMerged = mergeResources(INITIAL_RESOURCES, [], serverList, remoteDeleted);
      const sorted = sortResourcesNewestToOldest(cleanMerged);
      setResources(sorted);
      await persistResources(sorted);
      window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: sorted }));

      setToastMessage('✅ Caché local depurada: tu dispositivo y la nube están 100% sincronizados con las guías oficiales.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {
      console.error('Error cleaning local cache:', e);
      setToastMessage('Error al resincronizar con el servidor.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSyncingWithServer(false);
    }
  };

  // Delete resource from server & local state permanently
  const handleDeleteResource = async (resourceId: string, resourceTitle: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente "${resourceTitle}"? Se borrará del servidor y de tu dispositivo y no volverá a aparecer.`)) {
      return;
    }

    // 1. Immediately delete from local state, IndexedDB and LocalStorage + mark as tombstone
    await removeStoredResource(resourceId);
    markResourceAsDeleted(resourceId);
    try {
      deleteCloudResource(resourceId);
    } catch (e) {}
    setResources(prev => {
      const updated = prev.filter(r => r.id !== resourceId);
      window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: updated }));
      return updated;
    });
    if (selectedResource?.id === resourceId) {
      setSelectedResource(null);
    }
    if (latestUploadNotification?.resourceId === resourceId) {
      setLatestUploadNotification(null);
    }
    window.dispatchEvent(new CustomEvent('anestesiapro_resource_deleted', { detail: { resourceId } }));

    // 2. Send DELETE request to central server
    try {
      const deleteUrl = resolveAppUrl(`/api/education/resources/${encodeURIComponent(resourceId)}`);
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'x-author-pin': '2534'
        }
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage(`"${resourceTitle}" eliminada permanentemente del servidor público.`);
      } else {
        setToastMessage(`"${resourceTitle}" eliminada del dispositivo.`);
      }
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error('Error deleting resource from server:', err);
      setToastMessage(`"${resourceTitle}" eliminada del dispositivo.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Purge all custom uploaded resources to leave only pristine official guides
  const handlePurgeCustomResources = async () => {
    if (!window.confirm("¿Deseas eliminar permanentemente TODOS los recursos y láminas subidas como prueba? Esto dejará la biblioteca oficial 100% limpia y sin duplicados.")) {
      return;
    }

    setIsSyncingWithServer(true);
    try {
      // 1. Server purge
      const purgeUrl = resolveAppUrl('/api/education/resources/purge-custom');
      await fetch(purgeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-author-pin': '2534'
        }
      });

      // 2. Local device purge
      await purgeAllCustomStoredResources();

      // 3. Reset state to clean INITIAL_RESOURCES
      setResources(INITIAL_RESOURCES);
      setSelectedResource(null);
      window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: INITIAL_RESOURCES }));

      setToastMessage('Biblioteca limpiada. Solo se conservan las guías y láminas oficiales.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Error purging custom resources:', err);
      setToastMessage('Se limpió el almacenamiento local.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsSyncingWithServer(false);
    }
  };

  // Initialize and Sync on mount with IndexedDB and Server
  useEffect(() => {
    let isMounted = true;

    const initServerAndSync = async (force: boolean = false) => {
      const now = Date.now();
      if (!force && now - lastSyncTimestampRef.current < 25000) {
        return;
      }
      lastSyncTimestampRef.current = now;

      try {
        // 1. FAST LOCAL HYDRATION: Asynchronously load persistent resources from IndexedDB immediately (<15ms)
        const locallyPersisted = await loadStoredResources();
        if (isMounted && locallyPersisted.length > 0) {
          const activeTombstones = new Set(getDeletedResourceIds());
          const safeLocal = locallyPersisted.filter(
            item => item && !activeTombstones.has(item.id)
          );
          const localMerged = mergeResources(INITIAL_RESOURCES, safeLocal, [], Array.from(activeTombstones));
          const localSorted = sortResourcesNewestToOldest(localMerged);
          setResources(prev => {
            if (prev.length !== localSorted.length) return localSorted;
            const hasDiff = localSorted.some((item, idx) => {
              const p = prev[idx];
              return !p || 
                p.id !== item.id || 
                p.updatedAt !== item.updatedAt || 
                p.url !== item.url ||
                p.fileDataUrl !== item.fileDataUrl ||
                (p.images?.length || 0) !== (item.images?.length || 0) ||
                (p.imagesData?.length || 0) !== (item.imagesData?.length || 0) ||
                p.photoDeleted !== item.photoDeleted;
            });
            return hasDiff ? localSorted : prev;
          });
        }

        // 2. Fetch shared resources from Server with dual fallback (API + Static JSON)
        let serverList: EducationalResource[] = [];
        try {
          const { resources: fetchedResources, deletedIds: srvDeletedIds } = await fetchServerResources();
          if (Array.isArray(fetchedResources) && fetchedResources.length > 0) {
            serverList = fetchedResources;
          }
          if (Array.isArray(srvDeletedIds) && srvDeletedIds.length > 0) {
            srvDeletedIds.forEach((did: string) => markResourceAsDeleted(did));
          }
        } catch (srvErr) {
          console.warn('[AnestesiaPro] Server fetch notice:', srvErr);
        }

        if (!isMounted) return;

        // 3. Merge built-in INITIAL_RESOURCES, locally stored, and server resources (respecting tombstones)
        const remoteDeleted = getDeletedResourceIds();
        const merged = mergeResources(INITIAL_RESOURCES, locallyPersisted, serverList, remoteDeleted);
        const sorted = sortResourcesNewestToOldest(merged);

        // Update state ONLY if items actually changed to prevent mobile screen flickering
        setResources(prev => {
          if (prev.length !== sorted.length) {
            return sorted;
          }
          const hasDiff = sorted.some((item, idx) => {
            const p = prev[idx];
            return !p || 
              p.id !== item.id || 
              p.updatedAt !== item.updatedAt || 
              p.url !== item.url ||
              p.fileDataUrl !== item.fileDataUrl ||
              (p.images?.length || 0) !== (item.images?.length || 0) ||
              (p.imagesData?.length || 0) !== (item.imagesData?.length || 0) ||
              p.photoDeleted !== item.photoDeleted;
          });
          return hasDiff ? sorted : prev;
        });

        isStorageInitializedRef.current = true;
        await persistResources(sorted);

        // 4. Identify if any local items are missing on server and push them
        const deletedIds = getDeletedResourceIds();
        const itemsToEnrichOnServer = locallyPersisted.filter(loc => {
          if (!loc || !loc.id || deletedIds.includes(loc.id)) return false;
          const srvMatch = serverList.find(srv => srv.id === loc.id);
          if (!srvMatch) return true; // Missing on server, push it!
          // Only push if local update is strictly newer than server's record
          if (loc.updatedAt && srvMatch.updatedAt) {
            return new Date(loc.updatedAt).getTime() > new Date(srvMatch.updatedAt).getTime();
          }
          return false;
        });

        if (itemsToEnrichOnServer.length > 0) {
          console.log(`[AnestesiaPro] Silently syncing ${itemsToEnrichOnServer.length} local custom resources with central server...`);
          await syncLocalResourcesToServer(itemsToEnrichOnServer, true /* silent */);
        }
      } catch (err) {
        console.warn('Initial server sync warning:', err);
      }
    };

    // Initial mount sync
    initServerAndSync(true);

    // Auto-sync gently on window focus or tab visibility change (debounced)
    const handleFocusSync = () => {
      initServerAndSync(false);
    };
    window.addEventListener('focus', handleFocusSync);
    window.addEventListener('visibilitychange', handleFocusSync);

    // Listen to external synced event
    const handleExternalSync = (e: any) => {
      if (e.detail && Array.isArray(e.detail) && isMounted) {
        setResources(prev => {
          const sorted = sortResourcesNewestToOldest(e.detail);
          if (sorted.length !== prev.length) {
            return sorted;
          }
          const hasDiff = sorted.some((item, idx) => {
            const p = prev[idx];
            return !p || 
              p.id !== item.id || 
              p.updatedAt !== item.updatedAt || 
              p.url !== item.url ||
              p.fileDataUrl !== item.fileDataUrl ||
              (p.images?.length || 0) !== (item.images?.length || 0) ||
              (p.imagesData?.length || 0) !== (item.imagesData?.length || 0) ||
              p.photoDeleted !== item.photoDeleted;
          });
          return hasDiff ? sorted : prev;
        });
      }
    };
    window.addEventListener('anestesiapro_education_synced', handleExternalSync);

    // Instant Cloud Firestore Realtime Sync: instant live push across all browsers & phones
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      unsubscribeFirestore = subscribeToCloudResources(
        async (cloudItems) => {
          if (!isMounted) return;
          if (Array.isArray(cloudItems) && cloudItems.length > 0) {
            console.log(`[AnestesiaPro Cloud] Live Firestore push: ${cloudItems.length} items received.`);
            try {
              const local = await loadStoredResources();
              const merged = mergeResources(INITIAL_RESOURCES, local, cloudItems as any);
              const sorted = sortResourcesNewestToOldest(merged);
              setResources(sorted);
              persistResources(sorted);
              window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: sorted }));
            } catch (mergeErr) {
              console.warn('[AnestesiaPro Cloud] Error merging realtime items:', mergeErr);
              initServerAndSync(true);
            }
          }
        },
        (err) => {
          console.warn('[AnestesiaPro Cloud] Firestore listener notice:', err);
        }
      );
    } catch (e) {
      console.warn('[AnestesiaPro Cloud] Error establishing Firestore listener:', e);
    }

    // Instant Real-Time SSE Stream: receives instant push whenever Dr. Carlos creates, edits, or deletes a resource
    let eventSource: EventSource | null = null;
    try {
      if (typeof window !== 'undefined' && 'EventSource' in window) {
        eventSource = new EventSource(resolveAppUrl('/api/education/stream'));
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.type !== 'connected') {
              console.log('[AnestesiaPro Real-Time] SSE update received:', data);
              initServerAndSync(true);
            }
          } catch (e) {}
        };
        eventSource.onerror = () => {
          try { eventSource?.close(); } catch (e) {}
        };
      }
    } catch (e) {
      console.warn('[AnestesiaPro] SSE connection notice:', e);
    }

    // High-speed lightweight version poll (every 6 seconds): verifies version metadata (<150 bytes)
    let lastKnownVersion = 0;
    const versionInterval = setInterval(async () => {
      try {
        const vUrl = resolveAppUrl(`/api/education/version?t=${Date.now()}`);
        const vRes = await fetch(vUrl, { cache: 'no-store' });
        if (vRes.ok) {
          const vData = await vRes.json();
          if (vData.success && vData.version) {
            if (lastKnownVersion !== 0 && vData.version !== lastKnownVersion) {
              lastKnownVersion = vData.version;
              initServerAndSync(true);
            } else if (lastKnownVersion === 0) {
              lastKnownVersion = vData.version;
            }
          }
        }
      } catch (e) {}
    }, 6000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', handleFocusSync);
      window.removeEventListener('visibilitychange', handleFocusSync);
      window.removeEventListener('anestesiapro_education_synced', handleExternalSync);
      clearInterval(versionInterval);
      if (unsubscribeFirestore) {
        try { unsubscribeFirestore(); } catch (e) {}
      }
      if (eventSource) {
        try { eventSource.close(); } catch (e) {}
      }
    };
  }, [isAdmin]);

  // Verificar si hay notificaciones recientes de nuevo material educativo para mostrar la alerta
  const checkLatestEducationNotification = async () => {
    // If user has dismissed alerts or muted them, do not show repeatedly
    if (localStorage.getItem('anestesiapro_education_banner_dismissed') === 'true' ||
        sessionStorage.getItem('anestesiapro_education_banner_dismissed_session') === 'true' ||
        localStorage.getItem('anestesiapro_mute_resource_banners') === 'true') {
      setLatestUploadNotification(null);
      return;
    }

    try {
      const list = await getNotifications();
      if (!Array.isArray(list) || list.length === 0) {
        setLatestUploadNotification(null);
        return;
      }

      // Buscar la notificación más reciente que no haya sido descartada ni pertenezca a un recurso eliminado
      const deletedIds = getDeletedResourceIds();
      const unreadItem = list.find((notif) => {
        if (!notif || !notif.id) return false;
        if (notif.resourceId && deletedIds.includes(notif.resourceId)) return false;
        if (notif.resourceId === 'test-item-1' || notif.id.includes('test-item-1')) return false;
        const isDismissed = localStorage.getItem(`anestesiapro_dismissed_notif_${notif.id}`) === 'true';
        return !isDismissed;
      });

      if (unreadItem) {
        setLatestUploadNotification(unreadItem);
      } else {
        setLatestUploadNotification(null);
      }
    } catch (e) {
      console.warn('Error checking education notifications:', e);
    }
  };

  useEffect(() => {
    checkLatestEducationNotification();

    // Escuchar evento personalizado por si se crea una notificación en esta misma pestaña o sesión
    const handleNotifUpdate = () => {
      checkLatestEducationNotification();
    };
    window.addEventListener('anestesiapro-notifications-updated', handleNotifUpdate);
    window.addEventListener('storage', handleNotifUpdate);
    return () => {
      window.removeEventListener('anestesiapro-notifications-updated', handleNotifUpdate);
      window.removeEventListener('storage', handleNotifUpdate);
    };
  }, []);

  const handleDismissEducationBanner = (notifId: string) => {
    localStorage.setItem(`anestesiapro_dismissed_notif_${notifId}`, 'true');
    localStorage.setItem('anestesiapro_education_banner_dismissed', 'true');
    sessionStorage.setItem('anestesiapro_education_banner_dismissed_session', 'true');
    setLatestUploadNotification(null);
  };

  const handleViewNotifiedResource = (notif: AppNotification) => {
    // 1. Descartar la alerta/banner para que no vuelva a molestar
    handleDismissEducationBanner(notif.id);

    // 2. Si tiene un resourceId específico, abrir o desplazarse al recurso
    if (notif.resourceId) {
      const matched = resources.find(r => r.id === notif.resourceId);
      setHighlightedResourceId(notif.resourceId);
      setTimeout(() => {
        const el = document.getElementById(`resource-${notif.resourceId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      if (matched) {
        setSelectedResource(matched);
      }
      setTimeout(() => {
        setHighlightedResourceId(null);
      }, 4000);
    } else {
      // Si no tiene resourceId específico, desplazarse a la lista
      const listEl = document.getElementById('educational-resources-grid');
      if (listEl) {
        listEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Batch or Single Resource Publishing to Server
  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (queuedFiles.length === 0 && !newTitle.trim()) {
      alert('Por favor selecciona al menos un archivo o ingresa un título.');
      return;
    }

    setIsBatchUploading(true);
    try {
      const parsedTags = newTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .map(t => t.startsWith('#') ? t : `#${t}`);

      const defaultTags = parsedTags.length > 0 
        ? parsedTags 
        : ['#EducaciónContinua', '#AnestesiaPro', '#PublicacionOficial'];

      // 1. SUBIDA DIRECTA DE ARCHIVOS MULTIMEDIA AL SERVIDOR CENTRAL (DISCO PÚBLICO):
      // Esto garantiza que imágenes en alta definición y videos MP4 queden guardados como URLs reales (/uploads/...)
      // para que se reproduzcan y vean de forma instantánea en cualquier navegador, iPhone, Android o preview.
      const uploadedUrls = new Map<string, string>();
      for (let i = 0; i < queuedFiles.length; i++) {
        const qf = queuedFiles[i];
        if (qf.file) {
          try {
            setCompressingProgress(`Subiendo al servidor (${i + 1}/${queuedFiles.length}): ${qf.name}...`);
            const formData = new FormData();
            formData.append('file', qf.file);
            const uploadRes = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'x-author-pin': '2534',
                'x-client-app': 'anestesiapro'
              },
              body: formData
            });
            if (uploadRes.ok) {
              const uploadData = await uploadRes.json();
              if (uploadData.success && uploadData.url) {
                uploadedUrls.set(qf.id, uploadData.url);
              }
            }
          } catch (uploadErr) {
            console.warn(`[AnestesiaPro] Subida directa de ${qf.name} advierte fallback:`, uploadErr);
          }
        }
      }

      let itemsToUpload: EducationalResource[] = [];

      const isCarouselMode = uploadMode === 'carousel' && queuedFiles.length > 1;

      if (isCarouselMode) {
        // Agrupar imágenes en un álbum/carrusel deslizante estilo Instagram
        const imageFiles = queuedFiles.filter(qf => qf.type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp'].includes(qf.extension));
        const nonImageFiles = queuedFiles.filter(qf => !qf.type.startsWith('image/') && !['jpg', 'jpeg', 'png', 'webp'].includes(qf.extension));

        if (imageFiles.length > 0) {
          const rawBase64s = imageFiles.map(img => img.dataUrl || '').filter(Boolean);
          const carouselImages = imageFiles.map(img => uploadedUrls.get(img.id) || img.dataUrl || '').filter(Boolean);
          const carouselCaptions = imageFiles.map((img, idx) => img.title.trim() || `Lámina ${idx + 1}`);
          const coverImage = imageFiles[0];

          const carouselTitle = newTitle.trim() || coverImage.title.trim() || 'Álbum Clínico Interactivo';
          const carouselDesc = newDescription.trim() || 
            `Carrusel clínico de ${imageFiles.length} diapositivas publicado por ${newAuthor.trim() || 'Dr. Carlos Leal'}. Desliza para explorar cada lámina.`;

          const carouselResource: EducationalResource = {
            id: `res-carousel-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: carouselTitle,
            category: 'infografia',
            description: carouselDesc,
            date: new Date().toISOString().split('T')[0],
            author: newAuthor.trim() || 'Dr. Carlos Leal • AnestesiaPro',
            url: carouselImages[0] || newUrl,
            fileDataUrl: coverImage.dataUrl || carouselImages[0],
            fileName: `${carouselTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`,
            fileSize: `${imageFiles.length} láminas HD`,
            fileExtension: 'jpg',
            tags: defaultTags,
            downloadable: true,
            isCommunity: true,
            isCustom: true,
            images: carouselImages,
            imagesData: rawBase64s.length > 0 ? rawBase64s : undefined,
            isCarousel: true,
            imageCaptions: carouselCaptions
          };

          itemsToUpload.push(carouselResource);
        }

        // Archivos no imagen dentro del lote
        nonImageFiles.forEach(qf => {
          const isVid = qf.category === 'reel' || ['mp4', 'mov', 'webm', 'm4v', 'avi'].includes((qf.extension || '').toLowerCase());
          const mediaUrl = uploadedUrls.get(qf.id) || qf.dataUrl || newUrl;
          itemsToUpload.push({
            id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: qf.title.trim() || qf.name,
            category: isVid ? 'reel' : (qf.category || newCategory),
            description: (qf.description || newDescription).trim() || `Material de formación (${qf.name}) publicado por ${newAuthor.trim() || 'Dr. Carlos Leal'}.`,
            date: new Date().toISOString().split('T')[0],
            author: newAuthor.trim() || 'Dr. Carlos Leal • AnestesiaPro',
            videoUrl: isVid ? mediaUrl : undefined,
            url: mediaUrl,
            instagramUrl: isVid ? (newUrl || 'https://instagram.com') : undefined,
            tags: defaultTags,
            fileName: qf.name,
            fileSize: qf.size,
            fileDataUrl: qf.dataUrl || undefined,
            fileExtension: isVid ? 'mp4' : qf.extension,
            downloadable: true,
            isCommunity: true,
            isCustom: true
          });
        });
      } else if (queuedFiles.length > 0) {
        itemsToUpload = queuedFiles.map((qf) => {
          const finalTitle = qf.title.trim() || qf.name;
          const isVid = qf.category === 'reel' || ['mp4', 'mov', 'webm', 'm4v', 'avi'].includes((qf.extension || '').toLowerCase());
          const finalCategory = isVid ? 'reel' : (qf.category || newCategory);
          const finalDesc = (qf.description || newDescription).trim() || 
            `Material de formación clínica y protocolo (${qf.name}) publicado por ${newAuthor.trim() || 'Dr. Carlos Leal'}.`;
          const mediaUrl = uploadedUrls.get(qf.id) || qf.dataUrl || newUrl;

          return {
            id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            title: finalTitle,
            category: finalCategory,
            description: finalDesc,
            date: new Date().toISOString().split('T')[0],
            author: newAuthor.trim() || 'Dr. Carlos Leal • AnestesiaPro',
            videoUrl: isVid ? mediaUrl : undefined,
            url: mediaUrl,
            instagramUrl: isVid ? (newUrl || 'https://instagram.com') : undefined,
            tags: defaultTags,
            fileName: qf.name,
            fileSize: qf.size,
            fileDataUrl: qf.dataUrl || undefined,
            fileExtension: isVid ? 'mp4' : qf.extension,
            downloadable: true,
            isCommunity: true,
            isCustom: true
          };
        });
      } else if (newTitle.trim()) {
        const ext = newCategory === 'pdf' ? 'pdf' :
                    newCategory === 'infografia' ? 'jpg' :
                    newCategory === 'reel' ? 'mp4' :
                    newCategory === 'presentacion' ? 'pptx' :
                    newCategory === 'archivo' ? 'zip' : 'pdf';

        itemsToUpload.push({
          id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: newTitle.trim(),
          category: newCategory,
          description: newDescription.trim() || `Material clínico publicado por ${newAuthor.trim() || 'Dr. Carlos Leal'}.`,
          date: new Date().toISOString().split('T')[0],
          author: newAuthor.trim() || 'Dr. Carlos Leal • AnestesiaPro',
          url: newUrl || undefined,
          tags: defaultTags,
          fileName: `${newTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`,
          fileSize: 'Documento Clínico',
          fileExtension: ext,
          downloadable: true,
          isCommunity: true,
          isCustom: true
        });
      }

      if (!itemsToUpload.length) {
        setIsBatchUploading(false);
        return;
      }

      // 1. GUARANTEED IMMEDIATE OFFLINE PERSISTENCE:
      // Save directly to device IndexedDB first so content is NEVER lost on reload or disconnect
      const locallyPersistedNow = await loadStoredResources();
      const updatedLocalFirst = sortResourcesNewestToOldest([...itemsToUpload, ...locallyPersistedNow]);
      setResources(updatedLocalFirst);
      await persistResources(updatedLocalFirst);

      // 2. TRANSMIT TO CENTRAL SERVER & CLOUD FIRESTORE (Guarantees zero-lag sync across all devices and browsers)
      let serverSyncSuccess = false;
      let lastServerItems: EducationalResource[] | null = null;

      // Direct write to Cloud Firestore
      for (const item of itemsToUpload) {
        try {
          await saveCloudResource(item);
          serverSyncSuccess = true;
        } catch (cloudErr) {
          console.warn('[AnestesiaPro Cloud] Cloud Firestore upload notice for item:', item.id, cloudErr);
        }
      }

      for (const item of itemsToUpload) {
        try {
          const res = await fetch('/api/education/resources', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-author-pin': '2534'
            },
            body: JSON.stringify({ 
              resources: [item],
              authorPin: '2534'
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.allResources)) {
              serverSyncSuccess = true;
              lastServerItems = data.allResources as EducationalResource[];
            }
          } else {
            console.warn('[AnestesiaPro] Server responded with status:', res.status);
          }
        } catch (fetchErr) {
          console.warn('[AnestesiaPro] Offline or server timeout for item:', item.id, fetchErr);
        }
      }

      if (serverSyncSuccess && lastServerItems) {
        const merged = mergeResources(INITIAL_RESOURCES, updatedLocalFirst, lastServerItems);
        const finalSorted = sortResourcesNewestToOldest(merged);
        setResources(finalSorted);
        await persistResources(finalSorted);
        window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: finalSorted }));
      } else {
        window.dispatchEvent(new CustomEvent('anestesiapro_education_synced', { detail: updatedLocalFirst }));
      }

      // Auto publish notification alert to all devices
      const isCarouselUpload = isCarouselMode && itemsToUpload.some(it => it.isCarousel);
      const primaryTitle = isCarouselUpload
        ? `📸 Carrusel: ${itemsToUpload[0].title}`
        : itemsToUpload.length === 1 
          ? itemsToUpload[0].title 
          : `${itemsToUpload.length} Nuevos Recursos`;

      const notifData = {
        id: `notif-${Date.now()}-${itemsToUpload[0].id}`,
        title: `¡NUEVO MATERIAL PUBLICADO: ${primaryTitle}!`,
        message: isCarouselUpload
          ? `El Dr. Carlos Leal ha publicado un nuevo álbum interactivo estilo Instagram con diapositivas deslizables: "${itemsToUpload[0].title}".`
          : itemsToUpload.length === 1
            ? (itemsToUpload[0].description || 'Se ha publicado un nuevo documento médico en el servidor.')
            : `El Dr. Carlos Leal ha publicado ${itemsToUpload.length} nuevos recursos en la Biblioteca de Educación Continua.`,
        badge: isCarouselUpload ? 'CARRUSEL' : itemsToUpload[0].category.toUpperCase(),
        resourceId: itemsToUpload[0].id,
        author: newAuthor.trim() || 'Dr. Carlos Leal',
        date: new Date().toISOString().split('T')[0]
      };

      publishNewNotification({
        ...notifData,
        pin: '2534'
      });
      saveCloudNotification(notifData);

      // Show toast message reflecting true server sync state
      if (serverSyncSuccess) {
        setToastMessage(
          isCarouselUpload
            ? `✅ ¡Carrusel publicado en la nube central! 1 álbum interactivo con fotos disponible en tu PC y teléfono.`
            : `✅ ¡${itemsToUpload.length} ${itemsToUpload.length === 1 ? 'recurso publicado' : 'recursos publicados'} en la nube! Disponible en tu PC y teléfono.`
        );
      } else {
        setToastMessage(
          `💾 Guardado en esta PC. Usa el botón "📲 Sincronizar PC ⇄ Teléfono" en la barra superior para subirlo a la nube.`
        );
      }
      setTimeout(() => setToastMessage(null), 6000);

      // Actualizar alerta de material nuevo en esta pantalla
      checkLatestEducationNotification();
      window.dispatchEvent(new CustomEvent('anestesiapro_new_resource_published'));

      // Reset Form and close modal
      setIsModalOpen(false);
      setQueuedFiles([]);
      setNewTitle('');
      setNewCategory('pdf');
      setNewDescription('');
      setNewAuthor('Dr. Carlos Leal • AnestesiaPro');
      setNewTags('');
      setNewUrl('');
      setFileData(null);
    } catch (err) {
      console.error('Error in handleBatchUpload:', err);
      setToastMessage('Error al conectar con el servidor. Revisa tu conexión.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsBatchUploading(false);
    }
  };

  const filteredResources = sortResourcesNewestToOldest(resources.filter(res => {
    // Protección estricta: Si es un borrador privado, solo es visible si el usuario es Dr. Carlos Leal (Admin)
    if (res.isDraft && !isAdmin) {
      return false;
    }
    const matchesCategory = activeCategory === 'todos' || res.category === activeCategory;
    const matchesSearch = 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }));

  const handleDownload = async (res: EducationalResource) => {
    setDownloadingId(res.id);
    recordDownload(res.id);

    try {
      if (res.id === 'res-bloqueo-peng-cadera-2026') {
        downloadOriginalPengImage();
      } else if (res.id === 'res-preeclampsia-eclampsia-enfoque-anestesiologico') {
        downloadPreeclampsiaGuidePDF();
      } else if (res.id === 'res-enfoque-vortex-via-aerea-dificil') {
        downloadVortexApproachPDF();
      } else if (res.id === 'res-orexina-interruptor-despertar-2026') {
        downloadOrexinDespertarPDF();
      } else if (res.id === 'res-guia-eras-cesarea-2025') {
        downloadErasCesareaPDF();
      } else if (res.id === 'res-fona-cricotiroidotomia') {
        downloadOriginalFonaImage();
      } else if (res.id === 'res-aminofilina-teofilina-cppd') {
        downloadOriginalAminofilinaImage();
      } else if (res.id === 'res-articulo-metaanalisis-aminofilina-2023') {
        downloadAminofilinaMetaanalysisPDF();
      } else if (res.id === 'res-articulo-estudio-aminofilina-2016') {
        downloadAminofilinaClinicalStudyPDF();
      } else if (res.id === 'res-caso-elaine-bromiley') {
        downloadElaineBromileyFullPDF();
      } else if (res.isCarousel && res.images && res.images.length > 0) {
        // Multi-page PDF booklet for all slides in the carousel
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        for (let i = 0; i < res.images.length; i++) {
          if (i > 0) doc.addPage();
          doc.setFillColor(15, 23, 42);
          doc.rect(0, 0, 210, 297, 'F');
          
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(13);
          doc.text(res.title, 14, 15);
          
          doc.setFontSize(9);
          doc.setTextColor(148, 163, 184);
          const caption = res.imageCaptions?.[i] || `Lámina ${i + 1} de ${res.images.length}`;
          doc.text(`${caption} • AnestesiaPro Educación Continua`, 14, 21);

          try {
            doc.addImage(res.images[i], 'JPEG', 14, 25, 182, 255, undefined, 'FAST');
          } catch (e) {
            console.warn('Could not add image to carousel PDF page', i, e);
          }
        }
        doc.save(`${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_Album_Carrusel.pdf`);
      } else if (
        res.category === 'reel' || 
        res.fileExtension === 'mp4' || 
        res.fileExtension === 'mov' || 
        res.fileExtension === 'webm' || 
        Boolean(res.videoUrl) || 
        (res.url && res.url.match(/\.(mp4|webm|mov|m4v|avi)(\?.*)?$/i))
      ) {
        // Real MP4 / Video File Download
        const vidUrl = res.videoUrl || res.url || res.fileDataUrl;
        if (vidUrl) {
          const ext = res.fileExtension || 'mp4';
          const fileName = res.fileName || `AnestesiaPro_${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
          await triggerFileDownload(vidUrl, fileName);
        }
      } else if (
        res.category === 'infografia' || 
        res.category === 'foto' || 
        (res.fileExtension && ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(res.fileExtension.toLowerCase())) || 
        (res.url && res.url.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?.*)?$/i)) ||
        (res.fileDataUrl && res.fileDataUrl.startsWith('data:image'))
      ) {
        // Real Image / Infographic Download
        const imgUrl = res.fileDataUrl || res.url || (res.images && res.images[0]);
        if (imgUrl) {
          const ext = res.fileExtension || (imgUrl.match(/\.(png|webp|svg|gif)/i) ? RegExp.$1.toLowerCase() : 'jpg');
          const fileName = res.fileName || `AnestesiaPro_${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
          await triggerFileDownload(imgUrl, fileName);
        }
      } else if (res.url && res.url.startsWith('/uploads/')) {
        // Any other uploaded server asset (PDF, ZIP, DOCX, etc.)
        const ext = res.fileExtension || res.url.split('.').pop()?.split('?')[0] || 'pdf';
        const fileName = res.fileName || `AnestesiaPro_${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
        await triggerFileDownload(res.url, fileName);
      } else if (res.fileDataUrl) {
        const ext = res.fileExtension || ((res.category as string) === 'infografia' || (res.category as string) === 'foto' ? 'jpg' : 'pdf');
        const fileName = res.fileName || `AnestesiaPro_${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
        await triggerFileDownload(res.fileDataUrl, fileName);
      } else if (res.url && (res.url.endsWith('.pdf') || res.url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
        const ext = res.fileExtension || (res.url.endsWith('.pdf') ? 'pdf' : 'jpg');
        const fileName = res.fileName || `AnestesiaPro_${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${ext}`;
        await triggerFileDownload(res.url, fileName);
      } else {
        // Generate a 100% valid PDF document using jsPDF
        const pdfFileName = res.fileName && res.fileName.toLowerCase().endsWith('.pdf') 
          ? res.fileName 
          : `${res.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_EducacionContinua.pdf`;

        downloadGeneratedPDF(
          res.title,
          res.author || 'Dr. Carlos Leal • AnestesiaPro',
          res.date,
          res.category,
          res.description,
          res.tags || [],
          pdfFileName
        );
      }
    } catch (err) {
      console.error('Error in handleDownload:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 300);
    }
  };

  const getCategoryBadge = (category: EducationalResource['category']) => {
    switch (category) {
      case 'carrusel':
        return { label: 'Álbum / Carrusel', icon: Layers, color: 'bg-rose-500/10 text-rose-600 border-rose-200' };
      case 'reel':
        return { label: 'Video Reel MP4', icon: Video, color: 'bg-rose-500/10 text-rose-600 border-rose-200' };
      case 'pdf':
        return { label: 'Guía Clínica PDF', icon: FileText, color: 'bg-blue-500/10 text-blue-600 border-blue-200' };
      case 'infografia':
      case 'foto':
        return { label: 'Infografía Técnica', icon: ImageIcon, color: 'bg-amber-500/10 text-amber-600 border-amber-200' };
      case 'presentacion':
        return { label: 'Diapositivas PPTX', icon: Presentation, color: 'bg-purple-500/10 text-purple-600 border-purple-200' };
      case 'pauta':
        return { label: 'Protocolo / Pauta', icon: BookMarked, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
      case 'archivo':
        return { label: 'Paquete ZIP', icon: Archive, color: 'bg-slate-500/10 text-slate-700 border-slate-300' };
      default:
        return { label: 'Recurso', icon: Info, color: 'bg-slate-500/10 text-slate-600 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* High-Impact Banner Header */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 rounded-3xl p-6 md:p-8 text-white border border-indigo-800/60 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span 
                onClick={handleSecretAuthorTrigger}
                onTouchEnd={handleSecretAuthorTrigger}
                className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm cursor-pointer select-none active:scale-95 transition-transform"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                Educación Continua Anestesiológica
              </span>
              <span className="bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5 text-cyan-400" />
                Biblioteca Médica
              </span>
              <div
                className="bg-slate-900/80 text-slate-300 border border-slate-700/80 text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
              >
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Consultas:</span>
                <span className="text-white font-extrabold">{stats.visits}</span>
                <span className="text-cyan-500">•</span>
                <span className="text-emerald-400 font-extrabold">{stats.totalDownloads} Descargas</span>
              </div>
            </div>

            <h2 
              onClick={handleSecretAuthorTrigger}
              onTouchEnd={handleSecretAuthorTrigger}
              className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight select-none cursor-pointer active:scale-[0.99] transition-transform"
              title="Educación Continua Anestesiológica"
            >
              Educación Continua <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-200">& Biblioteca Digital</span>
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Repositorio médico oficial de consulta para la comunidad. Explora, visualiza y descarga guías clínicas en PDF, videos de demostración quirúrgica, infografías de procedimientos y protocolos actualizados.
            </p>

            {/* Formatos interactivos en Biblioteca (Filtro Rápido) */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filtrar por Formato:</span>
              {[
                { label: 'Guías PDF', icon: FileText, cat: 'pdf', bg: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' },
                { label: 'Videos Reels MP4', icon: Video, cat: 'reel', bg: 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' },
                { label: 'Infografías y Guías', icon: ImageIcon, cat: 'infografia', bg: 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30' },
                { label: 'Diapositivas PPTX', icon: Presentation, cat: 'presentacion', bg: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' },
                { label: 'Protocolos / Pautas', icon: BookMarked, cat: 'pauta', bg: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' },
              ].map((fmt, i) => {
                const Icon = fmt.icon;
                const isSelected = activeCategory === fmt.cat;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveCategory(activeCategory === fmt.cat ? 'todos' : (fmt.cat as any))}
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border transition-all cursor-pointer active:scale-95 ${fmt.bg} ${
                      isSelected ? 'ring-2 ring-cyan-400 border-cyan-300 shadow-md scale-105' : 'border-white/10'
                    }`}
                    title={`Filtrar solo ${fmt.label}`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{fmt.label}</span>
                  </button>
                );
              })}
              {activeCategory !== 'todos' && (
                <button
                  onClick={() => setActiveCategory('todos')}
                  className="text-[10px] font-bold text-cyan-300 hover:text-white px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 cursor-pointer ml-1"
                >
                  Ver Todos
                </button>
              )}
            </div>

            {/* PROMINENT PUBLISH CONTENT / SUBIR ARCHIVO BUTTON (Author Only - Dr. Carlos Leal) */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
              {isAdmin ? (
                <div className="flex flex-wrap items-center gap-2.5 p-2.5 bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-xl w-full">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/40">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Panel Autor: Dr. Carlos Leal</span>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 border border-cyan-400/40"
                  >
                    <FileUp className="w-4 h-4 text-cyan-200" />
                    <span>+ Subir Contenido</span>
                  </button>

                  <button
                    onClick={() => handleManualSync()}
                    disabled={isSyncingWithServer}
                    className="flex items-center gap-1.5 text-xs text-cyan-200 hover:text-white font-bold px-3.5 py-2 bg-cyan-950/70 hover:bg-cyan-900/90 rounded-xl border border-cyan-500/40 transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                    title="Sincronizar cambios en tiempo real entre Teléfono y PC"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithServer ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                    <span>{isSyncingWithServer ? 'Sincronizando...' : '🔄 Sincronizar Nube'}</span>
                  </button>

                  <button
                    onClick={() => setIsManageModalOpen(true)}
                    className="bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-500/50 font-black text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 shadow-md shadow-rose-950/60"
                    title="Panel para eliminar o gestionar recursos de la biblioteca"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-300" />
                    <span>Gestionar / Eliminar ({resources.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('anestesiapro_open_stats_modal'));
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                    title="Ver bitácora de eventos y métricas de visitantes"
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Métricas</span>
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('¿Deseas vaciar la memoria caché de este navegador y forzar la recarga limpia de la última versión de la app?')) {
                        await forceAppUpdate();
                      }
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 font-bold text-xs px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                    title="Vaciar caché de este navegador y recargar la app"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Refrescar App</span>
                  </button>

                  <button
                    onClick={handleLogoutAdmin}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors ml-auto"
                    title="Cerrar sesión de administrador"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cerrar Panel</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 w-full pt-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{resources.length} Recursos Clínicos Verificados</span>
                    </span>

                    <button
                      onClick={() => handleManualSync()}
                      disabled={isSyncingWithServer}
                      className="flex items-center gap-1.5 text-xs text-cyan-300 hover:text-white font-medium px-2.5 py-1 bg-cyan-950/50 hover:bg-cyan-900/70 rounded-lg border border-cyan-800/50 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      title="Sincronizar y buscar actualizaciones en la nube"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithServer ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                      <span>{isSyncingWithServer ? 'Sincronizando...' : 'Sincronizar Nube'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={async () => {
                        if (confirm('¿Deseas refrescar la aplicación y vaciar la memoria caché para cargar la última versión?')) {
                          await forceAppUpdate();
                        }
                      }}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors px-2.5 py-1 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-1 cursor-pointer"
                      title="Recargar versión fresca si tu navegador muestra una versión vieja en caché"
                    >
                      <RefreshCw className="w-2.5 h-2.5 text-slate-400" />
                      <span>Refrescar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES (Solo visible para visitantes fuera del panel privado) */}
      {!isAdmin && (
        <WhatsAppShareBanner
          title="Biblioteca Académica & Protocolos Clínicos de AnestesiaPro"
          description="Compendio docente de referencia: Protocolo E-MOTIVE de hemorragia obstétrica, Enfoque VORTEX de vía aérea difícil, ERAS en cesárea, guías oficiales en PDF, videos y simuladores interactivos."
          shareText="📖 Colega, te invito a explorar la Biblioteca Académica y Protocolos Clínicos de AnestesiaPro: guías oficiales descargables en PDF (E-MOTIVE, VORTEX, ERAS), simuladores interactivos y atlas docente:"
          tabParam="educacion"
          theme="emerald"
        />
      )}

      {/* Filter and Search controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tema, guía (.pdf), video (.mp4) o #tag..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos', icon: Sparkles },
              { id: 'pdf', label: '📄 Guías PDF', icon: FileText },
              { id: 'reel', label: '🎬 Videos MP4', icon: Video },
              { id: 'infografia', label: '📸 Infografías', icon: ImageIcon },
              { id: 'presentacion', label: '📊 Presentaciones', icon: Presentation },
              { id: 'pauta', label: '📌 Protocolos', icon: BookMarked },
              { id: 'archivo', label: '📦 Archivos ZIP', icon: Archive },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid or Empty State */}
      {filteredResources.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 md:p-14 text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-blue-100">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-base font-extrabold text-slate-900">
              Biblioteca de Educación Continua Vacía
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Repositorio listo para recibir tus guías en PDF, videos quirúrgicos en MP4, infografías y protocolos. Todos se visualizarán y descargarán en su formato original.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isAdmin ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <FileUp className="w-4 h-4 text-cyan-200" /> Subir Mi Primer Archivo o Video
              </button>
            ) : (
              <p className="text-xs text-slate-400">
                Selecciona otra categoría o borra los términos de búsqueda para ver más recursos.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div id="educational-resources-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredResources.map((res) => {
            const badge = getCategoryBadge(res.category);
            const BadgeIcon = badge.icon;
            const isHighlighted = highlightedResourceId === res.id;

            return (
              <div
                key={res.id}
                id={`resource-${res.id}`}
                className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group ${
                  isHighlighted 
                    ? 'border-amber-400 ring-4 ring-amber-400/30 shadow-amber-500/20' 
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Category Badge & Extension */}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-black border ${badge.color}`}>
                      <BadgeIcon className="w-3.5 h-3.5" />
                      {badge.label}
                    </span>
                    <div className="flex items-center gap-2">
                      {res.fileExtension && (
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-slate-200">
                          .{res.fileExtension}
                        </span>
                      )}
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {res.date}
                      </span>
                      {isAdmin && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteResource(res.id, res.title);
                          }}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer ml-1"
                          title="Eliminar este recurso definitivamente"
                        >
                          <Trash2 className="w-3 h-3 text-white" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Author */}
                  <div>
                    <h3 
                      onClick={() => setSelectedResource(res)}
                      className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {res.title}
                    </h3>
                    {res.author && (
                      <p className="text-[11px] font-bold text-blue-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        {res.author}
                      </p>
                    )}
                  </div>

                  {/* Photo / Carousel Showcase & Controls Right Below Title */}
                  {(() => {
                    const isMultiPhoto = Boolean(res.isCarousel || (Array.isArray(res.images) && res.images.length > 1) || (Array.isArray(res.imagesData) && res.imagesData.length > 1));
                    const cardPhoto = getResourcePhoto(res);
                    const hasMedia = isMultiPhoto || Boolean(cardPhoto);

                    return (
                      <div className="space-y-2">
                        {isMultiPhoto ? (
                          <div className="space-y-1.5">
                            <CarouselCardPreview resource={res} onOpen={() => setSelectedResource(res)} />
                          </div>
                        ) : cardPhoto ? (
                          <div className="space-y-1.5">
                            <div 
                              className="rounded-2xl overflow-hidden border border-slate-200/90 max-h-56 sm:max-h-64 relative group/img cursor-pointer bg-slate-950 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all"
                              onClick={() => {
                                setCarouselSlideIndex(0);
                                setSelectedResource(res);
                              }}
                            >
                              <img 
                                src={cardPhoto} 
                                alt={res.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-48 sm:h-52 object-contain bg-slate-950 group-hover/img:scale-102 transition-transform duration-300"
                                onError={(e) => {
                                  const fallback = (res.imagesData && res.imagesData[0]) || 
                                                   (res.fileDataUrl && !res.fileDataUrl.startsWith('data:application/pdf') ? res.fileDataUrl : null) || 
                                                   (res.images && res.images[0]);
                                  if (fallback && typeof fallback === 'string' && !fallback.startsWith('/images/') && e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback;
                                  }
                                }}
                              />

                              {res.images && res.images.length > 1 && (
                                <div className="absolute top-2.5 right-2.5 bg-slate-950/85 text-amber-300 font-black text-[10px] px-2.5 py-1 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-lg backdrop-blur-xs">
                                  <Layers className="w-3 h-3 text-amber-400" />
                                  <span>Álbum: {res.images.length} fotos</span>
                                </div>
                              )}

                              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 backdrop-blur-[1px]">
                                <Eye className="w-4 h-4 text-cyan-400" />
                                <span>{res.images && res.images.length > 1 ? `Ver álbum (${res.images.length} fotos)` : 'Ver imagen completa en alta definición'}</span>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {/* Author Photo Controls */}
                        {isAdmin && (
                          hasMedia ? (
                            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 px-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
                              <div className="flex items-center gap-1.5">
                                <label
                                  htmlFor={`photo-upload-${res.id}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] cursor-pointer shadow-sm transition-transform active:scale-95"
                                  title="Subir o sumar fotos a este recurso (puedes elegir varias)"
                                >
                                  <Camera className="w-3.5 h-3.5 text-cyan-200" />
                                  <span>+ Añadir Fotos</span>
                                  <input
                                    type="file"
                                    id={`photo-upload-${res.id}`}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleDirectUploadPhoto(res.id, e.target.files);
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditResourceModal(res);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 font-bold text-[11px] cursor-pointer shadow-sm transition-transform active:scale-95"
                                  title="Editar láminas del carrusel, reordenar o cambiar título"
                                >
                                  <Layers className="w-3.5 h-3.5 text-indigo-300" />
                                  <span>Editar Carrusel</span>
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteResourcePhoto(res.id, res.title);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer shadow-sm transition-transform active:scale-95"
                                title="Eliminar la foto de este recurso"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-200" />
                                <span>Borrar Foto</span>
                              </button>
                            </div>
                          ) : (
                            <div className="p-3 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-900/90 text-center space-y-2">
                              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300">
                                <Camera className="w-4 h-4 text-cyan-400" />
                                <span>Sin foto visible actualmente</span>
                              </div>
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                <label
                                  htmlFor={`photo-upload-empty-${res.id}`}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs cursor-pointer shadow-md transition-transform active:scale-95"
                                >
                                  <FileUp className="w-4 h-4 text-cyan-200" />
                                  <span>+ Subir Foto / Carrusel</span>
                                  <input
                                    type="file"
                                    id={`photo-upload-empty-${res.id}`}
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleDirectUploadPhoto(res.id, e.target.files);
                                      }
                                      e.target.value = '';
                                    }}
                                  />
                                </label>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditResourceModal(res);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 font-bold text-xs cursor-pointer shadow-md transition-transform active:scale-95"
                                >
                                  <Layers className="w-3.5 h-3.5 text-indigo-300" />
                                  <span>Editor de Láminas</span>
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium">Puedes elegir 1 foto o múltiples imágenes juntas de tu galería para crear un carrusel</p>
                            </div>
                          )
                        )}
                      </div>
                    );
                  })()}

                  {/* Vortex Approach 2026 Graphical Preview Thumbnail */}
                  {res.id === 'res-enfoque-vortex-via-aerea-dificil' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3.5 border border-cyan-500/50 cursor-pointer group/vortex shadow-lg hover:border-cyan-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-cyan-300">
                        <span className="flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-cyan-400" /> SIMULADOR DE VÍDEO, ATLAS HD & GUÍA BJA 2026
                        </span>
                        <span className="bg-cyan-500/20 text-cyan-200 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30 uppercase font-black">
                          DESTACADO #1
                        </span>
                      </div>

                      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 rounded-xl p-3 border border-cyan-500/30 text-center space-y-2.5">
                        <div className="flex items-center justify-between gap-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-inner">
                              <Play className="w-4 h-4 text-cyan-400 fill-current" />
                            </div>
                            <div className="text-left">
                              <div className="text-[11px] font-black text-white leading-none">El Enfoque Vortex: Vídeo-Simulación & Atlas</div>
                              <div className="text-[9px] text-cyan-300 font-bold mt-0.5">Dr. Nicholas Chrimes (DAS / BJA / ANZCA)</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-950/90 border border-emerald-500/40 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-emerald-400 font-mono">🟢 ZONA VERDE</span>
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                            <span className="text-[9px] font-black text-rose-400 font-mono">🚨 eFONA</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-[8px] font-bold text-slate-300">
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-emerald-300">🎬 Simulación Vídeo</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-cyan-300">🖼️ Atlas HD</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-amber-300">🌀 Embudo Vortex</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-purple-300">📄 Guía Oficial PDF</div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-cyan-300 pt-0.5 group-hover/vortex:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Abrir Simulador Interactivo, Atlas Ilustrado & Descargar PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Orexina Hipocretina 2026 Graphical Preview Thumbnail */}
                  {res.id === 'res-orexina-interruptor-despertar-2026' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3.5 border border-emerald-500/50 cursor-pointer group/orexin shadow-lg hover:border-emerald-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-emerald-400 fill-current" /> SIMULADOR NEURAL & GUÍA CLÍNICA 2026
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-200 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30 uppercase font-black">
                          48H ACTIVO
                        </span>
                      </div>

                      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950/80 to-slate-900 rounded-xl p-3 border border-emerald-500/30 text-center space-y-2.5">
                        <div className="flex items-center justify-between gap-2 px-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
                              <Zap className="w-4 h-4 text-emerald-400 fill-current" />
                            </div>
                            <div className="text-left">
                              <div className="text-[11px] font-black text-white leading-none">Hipotálamo Lateral</div>
                              <div className="text-[9px] text-emerald-300 font-bold mt-0.5">Agonistas OX2R (TAK-925)</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 bg-slate-950/90 border border-emerald-500/40 px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-rose-400 font-mono">BIS &lt;40</span>
                            <ArrowRight className="w-3 h-3 text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 font-mono animate-pulse">BIS &gt;80</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-1 text-[8px] font-bold text-slate-300">
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-emerald-300">1. Anatomía</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-rose-300">2. GABA Inh</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-cyan-300">3. OX2R On</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-amber-300">4. DORA Off</div>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-emerald-300 pt-0.5 group-hover/orexin:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Abrir Simulador del Circuito, Ficha Técnica y Descargar PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preeclampsia & Enfoque Anestesiológico Preview Thumbnail (Publicación Oficial 2026) */}
                  {res.id === 'res-preeclampsia-eclampsia-enfoque-anestesiologico' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3.5 border-2 border-rose-500/80 cursor-pointer group/preeclampsia shadow-xl hover:border-rose-400 transition-all space-y-2.5 bg-gradient-to-r from-rose-950/40 via-slate-950 to-indigo-950/40 ring-1 ring-rose-500/20"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-rose-400 fill-current" /> PUBLICACIÓN OFICIAL • ACOG / FIGO / SOAP 2026
                        </span>
                        <span className="bg-rose-500/20 text-rose-200 text-[10px] px-2 py-0.5 rounded border border-rose-500/40 font-mono font-bold uppercase">
                          DESTACADO #1
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 via-rose-950/70 to-slate-900 rounded-xl p-2.5 border border-rose-500/30">
                        <img 
                          src="/images/preeclampsia_placenta_maternal_connection.svg" 
                          alt="Atlas Preeclampsia: Placenta & Cascada Patogénica" 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border border-rose-400/40 shadow shrink-0 group-hover/preeclampsia:scale-105 transition-transform"
                        />
                        <div className="space-y-1 min-w-0 flex-1">
                          <h4 className="text-xs sm:text-sm font-black text-white truncate">
                            Atlas Visual & Protocolo Clínico de Alta Complejidad
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium">
                            8 Láminas Ultra-HD (2816×1536), Zuspan/Pritchard, crisis HTA en 15 min, restricción de sueros 60-80 mL/h y Guía PDF Oficial de 5 páginas.
                          </p>
                          <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold">
                            <span>✓ Fisiopatología</span> • <span>✓ MgSO4 NMDA</span> • <span>✓ Labetalol</span> • <span>✓ PDF 5 Págs</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/90 rounded-xl p-2 border border-slate-800 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-rose-300 group-hover/preeclampsia:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-rose-400" />
                          <span>Abrir Protocolo Interactivo, Atlas Visual 8 Láminas & Descargar PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Protocolo E-MOTIVE Graphical Preview Thumbnail */}
                  {res.id === 'res-protocolo-emotive-hemorragia-posparto-2026' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3.5 border border-rose-500/40 cursor-pointer group/emotive shadow-md hover:border-rose-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-rose-300">
                        <span className="flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-rose-400 fill-current" /> PROTOCOLO E-MOTIVE • NEJM 2023 / OMS
                        </span>
                        <span className="bg-rose-500/20 text-rose-200 text-[10px] px-2 py-0.5 rounded border border-rose-500/30">
                          Bundle HPP 60% Reducción
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 via-rose-950/80 to-slate-900 rounded-xl p-3 border border-rose-500/20 text-center space-y-2">
                        <div className="grid grid-cols-7 gap-1 text-[8px] font-bold text-slate-300">
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-rose-300">E.Early</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-amber-300">M.Massage</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-cyan-300">O.Oxytocic</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-emerald-300">T.TXA 1g</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-blue-300">I.IV Fluids</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-purple-300">V.Vagina 4T</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-red-300">E.Escalate</div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-rose-300 pt-1 group-hover/emotive:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-rose-400" />
                          <span>Abrir Módulo Interactivo E-MOTIVE, Dosificación y Guía Oficial PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ERAS Cesárea 2025 Graphical Preview Thumbnail */}
                  {res.id === 'res-guia-eras-cesarea-2025' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3.5 border border-cyan-500/40 cursor-pointer group/eras shadow-md hover:border-cyan-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-cyan-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-current" /> CARRUSEL HD • 10 PLACAS ERAS 2025
                        </span>
                        <span className="bg-cyan-500/20 text-cyan-200 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30">
                          Analgesia Cesárea
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 rounded-xl p-3 border border-cyan-500/20 text-center space-y-2">
                        <div className="grid grid-cols-5 gap-1 text-[8px] font-bold text-slate-300">
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-cyan-300">1. Pilares</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-blue-300">2. Morfina ITM</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-amber-300">3. Parac+AINE</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-emerald-300">4. TAP Block</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-teal-300">5. Herida</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-purple-300">6. Dexa IV</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-rose-300">7. Rescate VO</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-indigo-300">8. Faja/Mov</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-green-300">9. Dieta 2h</div>
                          <div className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 truncate text-sky-300">10. Algoritmo</div>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-cyan-300 pt-1 group-hover/eras:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Abrir Carrusel Interactivo de 10 Placas y Descargar Guía PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ISR Secuencia Rápida Graphical Preview Thumbnail */}
                  {res.id === 'res-isr-secuencia-rapida-2025' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3 border border-indigo-500/40 cursor-pointer group/isr shadow-md hover:border-indigo-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-indigo-300">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-indigo-400" /> INFOGRAFÍA & RESUMEN INTERACTIVO CHGUV
                        </span>
                        <span className="bg-indigo-500/20 text-indigo-200 text-[10px] px-2 py-0.5 rounded border border-indigo-500/30">
                          Algoritmo 7 Ps
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 rounded-xl p-2.5 border border-indigo-500/20 text-center space-y-2">
                        <div className="grid grid-cols-7 gap-1">
                          {['1.Prep', '2.Pos', '3.Preox', '4.Preopt', '5.Parál', '6.Tubo', '7.Post'].map((st, i) => (
                            <div key={i} className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 text-[8px] font-black text-indigo-200 text-center truncate">
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-indigo-300 pt-1 group-hover/isr:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Ver Resumen Ilustrado, Tablas y Descargar Presentación PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bloqueo PENG Cadera Graphical Preview Thumbnail */}
                  {res.id === 'res-bloqueo-peng-cadera-2026' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3 border border-sky-500/40 cursor-pointer group/peng shadow-md hover:border-sky-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-sky-300">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-sky-400" /> ATLAS ECOGRÁFICO OFICIAL
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-200 text-[10px] px-2 py-0.5 rounded border border-emerald-500/30">
                          Preservación Motora
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 via-sky-950/80 to-slate-900 rounded-xl p-2.5 border border-sky-500/20 text-center space-y-2">
                        <div className="grid grid-cols-5 gap-1">
                          {['1. Transductor', '2. Reparos IPE', '3. En Plano', '4. Espacio Fascial', '5. Hidrodisección'].map((st, i) => (
                            <div key={i} className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 text-[9px] font-black text-slate-200 text-center truncate">
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-sky-300 pt-1 group-hover/peng:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-sky-400" />
                          <span>Abrir Atlas Sonoanatómico, Protocolo y Descargar PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FONA Infographic Graphical Preview Thumbnail */}
                  {res.id === 'res-fona-cricotiroidotomia' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3 border border-amber-500/40 cursor-pointer group/fona shadow-md hover:border-amber-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-amber-300">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> INFOGRAFÍA TÉCNICA ILUSTRADA
                        </span>
                        <span className="bg-amber-500/20 text-amber-200 text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
                          5 Pasos FONA
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 to-amber-950/80 rounded-xl p-2.5 border border-amber-500/20 text-center space-y-2">
                        <div className="grid grid-cols-5 gap-1">
                          {['1. Posición', '2. Incisión', '3. Punción', '4. Dilatación', '5. Tubo CO₂'].map((st, i) => (
                            <div key={i} className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 text-[9px] font-black text-slate-200 text-center truncate">
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-300 pt-1 group-hover/fona:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Abrir Infografía Técnica y Descargar PDF</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aminofilina y Teofilina CPPD Graphical Preview Thumbnail */}
                  {res.id === 'res-aminofilina-teofilina-cppd' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="bg-slate-950 rounded-2xl p-3 border border-cyan-500/40 cursor-pointer group/cppd shadow-md hover:border-cyan-400 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-black text-cyan-300">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> INFOGRAFÍA Y ARTÍCULOS ORIGINALES
                        </span>
                        <span className="bg-cyan-500/20 text-cyan-200 text-[10px] px-2 py-0.5 rounded border border-cyan-500/30">
                          CPPD
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 rounded-xl p-2.5 border border-cyan-500/20 text-center space-y-2">
                        <div className="grid grid-cols-4 gap-1">
                          {['1. Fisiopatología', '2. Flujograma', '3. Mecanismo', '4. Evidencia'].map((st, i) => (
                            <div key={i} className="bg-slate-900/90 border border-slate-700/80 rounded py-1 px-0.5 text-[9px] font-black text-slate-200 text-center truncate">
                              {st}
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-black text-cyan-300 pt-1 group-hover/cppd:scale-105 transition-transform">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Ver Infografía, Artículos Originales y Descargar PDFs</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail / Fotico Pequeñita para Artículo 1 Metaanálisis 2023 */}
                  {res.id === 'res-articulo-metaanalisis-aminofilina-2023' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="relative group/cover rounded-xl overflow-hidden border border-blue-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-blue-950/80 p-3 cursor-pointer shadow-md hover:border-blue-400 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px] font-black text-blue-300">
                        <span className="flex items-center gap-1 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/30">
                          <FileText className="w-3 h-3 text-blue-400" /> PDF CIENTÍFICO ORIGINAL
                        </span>
                        <span className="text-slate-400 font-mono">13 Págs HD</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2.5">
                        <div className="w-9 h-11 bg-blue-600/20 border border-blue-500/40 rounded flex flex-col items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <span className="text-[7px] font-black text-blue-300">PDF</span>
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-[10px] font-black text-blue-400 uppercase truncate">Anesth Pain Med (2023)</p>
                          <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{res.title}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail / Fotico Pequeñita para Artículo 2 Estudio 2016 */}
                  {res.id === 'res-articulo-estudio-aminofilina-2016' && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="relative group/cover rounded-xl overflow-hidden border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-amber-950/80 p-3 cursor-pointer shadow-md hover:border-amber-400 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px] font-black text-amber-300">
                        <span className="flex items-center gap-1 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                          <FileText className="w-3 h-3 text-amber-400" /> PDF CIENTÍFICO ORIGINAL
                        </span>
                        <span className="text-slate-400 font-mono">5 Págs HD</span>
                      </div>
                      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 flex items-start gap-2.5">
                        <div className="w-9 h-11 bg-amber-600/20 border border-amber-500/40 rounded flex flex-col items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-amber-400" />
                          <span className="text-[7px] font-black text-amber-300">PDF</span>
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <p className="text-[10px] font-black text-amber-400 uppercase truncate">Pain Physician (2016)</p>
                          <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{res.title}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* General PDF Thumbnail for other PDF resources */}
                  {res.category === 'pdf' && res.id !== 'res-articulo-metaanalisis-aminofilina-2023' && res.id !== 'res-articulo-estudio-aminofilina-2016' && !res.fileDataUrl && (
                    <div 
                      onClick={() => setSelectedResource(res)}
                      className="relative group/cover rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 p-3 cursor-pointer shadow-sm hover:border-cyan-400 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] font-bold text-cyan-300">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" /> VISTA PREVIA PDF
                        </span>
                        <span className="text-slate-400 font-mono">DOCUMENTO DIGITAL</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/30 rounded flex items-center justify-center text-cyan-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold text-slate-200 truncate">{res.fileName || res.title}</p>
                      </div>
                    </div>
                  )}

                  {/* Video Player Preview (for Reel / Video resources) */}
                  {(res.category === 'reel' || res.fileExtension === 'mp4' || res.fileExtension === 'mov' || res.fileExtension === 'webm' || res.videoUrl || (res.url && res.url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i))) ? (
                    <div 
                      className="rounded-2xl overflow-hidden border border-rose-500/30 bg-slate-950 relative group/video cursor-pointer shadow-md hover:border-rose-400 transition-all space-y-0"
                      onClick={() => setSelectedResource(res)}
                    >
                      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                        <video
                          src={res.videoUrl || res.url || res.fileDataUrl}
                          preload="metadata"
                          playsInline
                          muted
                          className="w-full h-full object-contain bg-black pointer-events-none"
                        />
                        {/* Video Overlay with Play Button & Badges */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-3">
                          <div className="flex items-center justify-between">
                            <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                              <Film className="w-3 h-3" /> VIDEO REPRODUCTOR
                            </span>
                            <span className="bg-slate-900/90 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700 backdrop-blur-xs">
                              {res.fileSize || '1080p HD'}
                            </span>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-rose-600/95 text-white flex items-center justify-center shadow-xl group-hover/video:scale-110 transition-transform">
                              <Play className="w-6 h-6 ml-0.5 fill-current" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold">
                            <span className="flex items-center gap-1 text-slate-300">
                              <Play className="w-3 h-3 text-rose-400" /> Toca para reproducir
                            </span>
                            <span className="text-cyan-400 font-black flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" /> Pantalla completa
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {/* Description Box */}
                  <div className="bg-slate-50/90 border border-slate-100 rounded-xl p-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line line-clamp-3 font-medium">
                    {res.description}
                  </div>

                  {/* Tags */}
                  {res.tags && res.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {res.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Share Banner on Each Resource */}
                <div className="pt-2">
                  <ResourceShareStrip
                    id={res.id}
                    title={res.title}
                    category={res.category}
                    summary={res.description}
                  />
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedResource(res);
                        if (res.category === 'reel' || res.videoUrl || res.fileExtension === 'mp4') {
                          setIsPlayingReel(true);
                        }
                      }}
                      className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Ver detalle</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditResourceModal(res);
                        }}
                        className="text-[11px] font-bold text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50 border border-cyan-300 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Cambiar foto o editar este recurso"
                      >
                        <ImageIcon className="w-3.5 h-3.5 text-cyan-600" />
                        <span>Cambiar Foto</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteResource(res.id, res.title);
                        }}
                        className="text-[11px] font-black text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm active:scale-95"
                        title="Eliminar este recurso de forma permanente de la nube y dispositivos"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 justify-end">
                    {res.id === 'res-bloqueo-peng-cadera-2026' ? (
                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadOriginalPengImage(); }}
                          className="bg-sky-600 hover:bg-sky-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Infografía Vectorial SVG HD"
                        >
                          <Download className="w-3.5 h-3.5" /> Infografía HD
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadPengBlockPDF(); }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Guía Clínica PDF"
                        >
                          <FileText className="w-3.5 h-3.5" /> Guía PENG (PDF)
                        </button>
                      </div>
                    ) : res.id === 'res-aminofilina-teofilina-cppd' ? (
                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadOriginalAminofilinaImage(); }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Infografía Original (.JPG)"
                        >
                          <Download className="w-3.5 h-3.5" /> Infografía JPG
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadAminofilinaMetaanalysisPDF(); }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Metaanálisis Anesth Pain Med 2023 (.PDF)"
                        >
                          <FileText className="w-3.5 h-3.5" /> Metaanálisis 2023 (PDF)
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadAminofilinaClinicalStudyPDF(); }}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Estudio Multicéntrico Pain Physician 2016 (.PDF)"
                        >
                          <FileText className="w-3.5 h-3.5" /> Estudio 2016 (PDF)
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadAminofilinaIntegratedGuidePDF(); }}
                          className="bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Guía Clínica Integrada (.PDF)"
                        >
                          <FileText className="w-3.5 h-3.5" /> Guía Clínica PDF
                        </button>
                      </div>
                    ) : res.id === 'res-fona-cricotiroidotomia' ? (
                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadOriginalFonaImage(); }}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Infografía Original (.JPG)"
                        >
                          <Download className="w-3.5 h-3.5" /> Infografía JPG
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); recordDownload(res.id); downloadFonaInfographicPDF(); }}
                          className="bg-amber-600 hover:bg-amber-500 text-white font-black text-[11px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                          title="Descargar Guía FONA (.PDF)"
                        >
                          <FileText className="w-3.5 h-3.5" /> Guía FONA (PDF)
                        </button>
                      </div>
                    ) : (res.category === 'reel' || res.videoUrl || res.fileExtension === 'mp4' || (res.url && res.url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i))) ? (
                      /* VIDEO / REEL ACTIONS */
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(res);
                            setIsPlayingReel(true);
                          }}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          title="Reproducir video clínico"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Reproducir Video</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(res);
                          }}
                          disabled={downloadingId === res.id}
                          className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          title="Descargar video MP4"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Descargando...' : 'Descargar MP4'}</span>
                        </button>
                      </div>
                    ) : (res.isCarousel || (res.images && res.images.length > 1)) ? (
                      /* CAROUSEL ACTIONS */
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(res);
                          }}
                          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          title="Ver álbum de láminas"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Ver Carrusel</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(res);
                          }}
                          disabled={downloadingId === res.id}
                          className="bg-slate-800 hover:bg-slate-700 text-pink-300 border border-pink-500/30 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          title="Descargar álbum completo como PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Descargando...' : 'Descargar Álbum'}</span>
                        </button>
                      </div>
                    ) : (res.category === 'infografia' || res.category === 'foto' || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(res.fileExtension?.toLowerCase() || '') || (res.url && res.url.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?.*)?$/i))) ? (
                      /* IMAGE / INFOGRAPHIC ACTIONS */
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(res);
                          }}
                          className="bg-teal-600 hover:bg-teal-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          title="Ver infografía en alta resolución"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Lámina</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(res);
                          }}
                          disabled={downloadingId === res.id}
                          className="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          title="Descargar imagen a tu dispositivo"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Descargando...' : 'Descargar Imagen'}</span>
                        </button>
                      </div>
                    ) : (res.category === 'pdf' || res.fileExtension === 'pdf' || (res.url && res.url.endsWith('.pdf'))) ? (
                      /* PDF DOCUMENT ACTIONS */
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(res);
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          title="Abrir documento clínico"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Abrir Documento</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(res);
                          }}
                          disabled={downloadingId === res.id}
                          className="bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                          title="Descargar PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Descargando...' : 'Descargar PDF'}</span>
                        </button>
                      </div>
                    ) : res.url && (res.url.startsWith('http://') || res.url.startsWith('https://')) ? (
                      /* EXTERNAL WEB LINK */
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-sm cursor-pointer"
                        title="Visitar enlace web oficial"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Abrir Web</span>
                        <ExternalLink className="w-3 h-3 opacity-90" />
                      </a>
                    ) : (
                      /* GENERIC FILE */
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResource(res);
                          }}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Detalle</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(res);
                          }}
                          disabled={downloadingId === res.id}
                          className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{downloadingId === res.id ? 'Descargando...' : `Descargar .${res.fileExtension || 'file'}`}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-900 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <div className="p-2 bg-emerald-500 rounded-xl text-slate-950 font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-black text-emerald-200">Publicación Exitosa</p>
            <p className="text-xs text-emerald-100 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Admin PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-900 text-cyan-400 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Acceso Administrador</h3>
                  <p className="text-[11px] text-slate-500">Educación Continua AnestesiaPro</p>
                </div>
              </div>
              <button onClick={() => setShowPinModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Panel reservado para el <strong>Dr. Carlos Leal</strong>. Ingresa tu PIN de autorización para gestionar y publicar contenidos oficiales.
            </p>

            <form onSubmit={handleAdminAuth} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  PIN Confidencial de Autor
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={inputPin}
                  onChange={(e) => setInputPin(e.target.value)}
                  placeholder="Introduce tu PIN de acceso"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
                />
                {pinError && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                    <span>PIN de autorización no reconocido.</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Verificar y Acceder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Manage & Delete Resources Modal */}
      {isManageModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>Gestionar y Eliminar Recursos</span>
                    <span className="text-xs bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                      {resources.length}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dr. Carlos Leal • Elimina publicaciones con errores, fotos de prueba o material que no te guste
                  </p>
                </div>
              </div>

              <button
                onClick={() => { setIsManageModalOpen(false); setManageSearchQuery(''); }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Cerrar ventana"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search filter inside modal */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manageSearchQuery}
                  onChange={(e) => setManageSearchQuery(e.target.value)}
                  placeholder="Buscar recurso por título, categoría o etiqueta para eliminarlo..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 font-medium"
                />
                {manageSearchQuery && (
                  <button
                    onClick={() => setManageSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Resources List */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 divide-y divide-slate-800/60">
              {resources
                .filter(res => {
                  if (!manageSearchQuery.trim()) return true;
                  const q = manageSearchQuery.toLowerCase();
                  return (
                    res.title.toLowerCase().includes(q) ||
                    res.category.toLowerCase().includes(q) ||
                    (res.description && res.description.toLowerCase().includes(q)) ||
                    (res.tags && res.tags.some(t => t.toLowerCase().includes(q)))
                  );
                })
                .map((res) => {
                  const badge = getCategoryBadge(res.category);
                  const isCarousel = res.isCarousel || (Array.isArray(res.images) && res.images.length > 1);
                  const photoCount = isCarousel ? (res.images?.length || 0) : (res.url ? 1 : 0);

                  return (
                    <div
                      key={res.id}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Thumbnail or icon */}
                        <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
                          {(res.url && !res.url.endsWith('.pdf') && !res.url.endsWith('.mp4')) ? (
                            <img
                              src={res.url}
                              alt={res.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="text-slate-400">
                              <badge.icon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        {/* Title & metadata */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                              {badge.label}
                            </span>
                            {isCarousel && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                📸 {photoCount} fotos
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500">
                              {res.date}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {res.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">
                            {res.author || 'Dr. Carlos Leal'} • ID: {res.id}
                          </p>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-500/50 hover:border-rose-400 font-black text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shrink-0"
                        title="Eliminar este recurso definitivamente"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  );
                })}

              {resources.filter(res => {
                if (!manageSearchQuery.trim()) return true;
                const q = manageSearchQuery.toLowerCase();
                return res.title.toLowerCase().includes(q) || res.category.toLowerCase().includes(q);
              }).length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No se encontraron recursos que coincidan con la búsqueda.
                </div>
              )}
            </div>

            {/* Footer with Batch Purge and Close */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCleanLocalCacheAndResync}
                  disabled={isSyncingWithServer}
                  className="text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/60 border border-cyan-800/60 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Elimina cualquier archivo borrado que haya quedado en la caché del navegador y resincroniza con la nube oficial"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingWithServer ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
                  <span>Depurar Caché y Resincronizar Nube</span>
                </button>

                <button
                  onClick={handlePurgeCustomResources}
                  className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 border border-rose-900/60 px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Borrar todas las pruebas y láminas personalizadas de una vez"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Pruebas Subidas</span>
                </button>
              </div>

              <button
                onClick={() => { setIsManageModalOpen(false); setManageSearchQuery(''); }}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer ml-auto"
              >
                Listo / Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail / Viewer - FULL SCREEN EXPANSIVE IMMERSION */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col w-full h-full overflow-hidden animate-fadeIn">
          {/* Top Sticky Header */}
          <div className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 shrink-0 shadow-xl z-20">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => { setSelectedResource(null); setIsPlayingReel(false); }}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border border-slate-700 shrink-0 active:scale-95 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Volver a Biblioteca</span>
                <span className="sm:hidden">Volver</span>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black border uppercase tracking-wider ${getCategoryBadge(selectedResource.category).color}`}>
                    {getCategoryBadge(selectedResource.category).label}
                  </span>
                  {selectedResource.fileExtension && (
                    <span className="bg-slate-800 text-slate-300 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-slate-700 hidden xs:inline">
                      .{selectedResource.fileExtension}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-400 font-semibold hidden md:inline truncate">
                    {selectedResource.author || 'Dr. Carlos Leal • AnestesiaPro'} • {selectedResource.date}
                  </span>
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-black text-white truncate max-w-md sm:max-w-xl">
                  {selectedResource.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => {
                    handleOpenEditResourceModal(selectedResource);
                  }}
                  className="bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  title="Cambiar foto o imagen de este recurso"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Cambiar Foto</span>
                </button>
              )}

              {isAdmin && (
                <button
                  onClick={() => {
                    handleDeleteResource(selectedResource.id, selectedResource.title);
                  }}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-500/60 text-xs font-bold px-3 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-md"
                  title="Eliminar este recurso definitivamente de la nube y dispositivos"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>Eliminar Recurso</span>
                </button>
              )}

              {selectedResource.id === 'res-guia-eras-cesarea-2025' ? (
                <button
                  onClick={() => downloadErasCesareaPDF()}
                  className="bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar PDF Oficial</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              ) : selectedResource.downloadable !== false && (
                <button
                  onClick={() => handleDownload(selectedResource)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar</span>
                </button>
              )}

              <button
                onClick={() => { setSelectedResource(null); setIsPlayingReel(false); }}
                className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Cerrar visor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Scrollable Canvas - Expansive & Unclipped */}
          <div className="flex-1 overflow-y-auto bg-slate-950 p-2 sm:p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {/* Share banner for this individual resource/guide (if not already handled by specialized viewer) */}
              {selectedResource.id !== 'res-protocolo-emotive-hemorragia-posparto-2026' && selectedResource.id !== 'res-enfoque-vortex-via-aerea-dificil' && selectedResource.id !== 'res-preeclampsia-eclampsia-enfoque-anestesiologico' && (
                <WhatsAppShareBanner
                  title={`Compartir recurso: ${selectedResource.title}`}
                  description={selectedResource.description ? selectedResource.description.slice(0, 170) + '...' : undefined}
                  resourceId={selectedResource.id}
                  shareText={`🩺 Colega, te recomiendo revisar este recurso clínico "${selectedResource.title}" en AnestesiaPro:\n${selectedResource.description ? selectedResource.description.slice(0, 130) + '...' : ''}`}
                  theme="indigo"
                />
              )}

              {/* 1. VIDEO / REEL PLAYER (Pure video viewer, no PDF paper clutter) */}
              {(selectedResource.category === 'reel' || selectedResource.fileExtension === 'mp4' || selectedResource.fileExtension === 'mov' || selectedResource.fileExtension === 'webm' || selectedResource.videoUrl || (selectedResource.url && selectedResource.url.match(/\.(mp4|webm|mov|m4v)(\?.*)?$/i))) ? (
                <div className="space-y-5">
                  <div className="bg-slate-950 rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-2xl relative overflow-hidden w-full max-w-4xl mx-auto space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 font-bold px-1">
                      <span className="text-rose-400 font-black flex items-center gap-1.5">
                        <Film className="w-4 h-4" /> REPRODUCTOR DE VIDEO CLÍNICO EN ALTA DEFINICIÓN
                      </span>
                      <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-2.5 py-1 rounded-md border border-rose-500/30 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        {selectedResource.fileSize || '1080p HD'}
                      </span>
                    </div>

                    {/* Real Video Element - Aspect 16:9 Theatre Mode, Object-Contain on Pure Black */}
                    <div className="bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-2xl w-full aspect-video flex items-center justify-center relative">
                      <video
                        controls
                        autoPlay={isPlayingReel}
                        playsInline
                        src={selectedResource.videoUrl || selectedResource.url || selectedResource.fileDataUrl}
                        className="w-full h-full object-contain rounded-2xl bg-black"
                      >
                        Tu navegador no soporta el reproductor de video HTML5.
                      </video>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-300 truncate max-w-[260px]">
                          📁 {selectedResource.fileName || 'video_educativo.mp4'}
                        </span>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">
                          • Compatible con todos los dispositivos móviles y de escritorio
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownload(selectedResource)}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md active:scale-95 ml-auto"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar Video MP4</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Notes & Clinical Summary */}
                  {selectedResource.description && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3 max-w-4xl mx-auto">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Resumen y Notas del Video
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                        {selectedResource.description}
                      </div>
                    </div>
                  )}
                </div>
              ) : (selectedResource.isCarousel || (selectedResource.images && selectedResource.images.length > 1)) ? (
                /* 2. CAROUSEL / ALBUM VIEWER */
                <div className="space-y-4">
                  <InstagramCarouselViewer resource={selectedResource} onDownload={handleDownload} />
                </div>
              ) : selectedResource.id === 'res-bloqueo-peng-cadera-2026' ? (
                <div className="space-y-4">
                  <PengBlockVisualizer 
                    onDownload={() => downloadOriginalPengImage()} 
                    onDownloadPdf={() => downloadPengBlockPDF()} 
                  />
                </div>
              ) : selectedResource.id === 'res-preeclampsia-eclampsia-enfoque-anestesiologico' ? (
                /* 3. INTERACTIVE CORE PROTOCOLS */
                <div className="space-y-4">
                  <PreeclampsiaProtocolVisualizer onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-protocolo-emotive-hemorragia-posparto-2026' ? (
                <div className="space-y-4">
                  <EmotiveProtocolVisualizer onDownload={() => handleDownload(selectedResource)} isAdmin={isAdmin} />
                </div>
              ) : selectedResource.id === 'res-enfoque-vortex-via-aerea-dificil' ? (
                <div className="space-y-4">
                  <VortexApproachVisualizer onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-orexina-interruptor-despertar-2026' ? (
                <div className="space-y-4">
                  <OrexinCircuitVisualizer onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-guia-eras-cesarea-2025' ? (
                <div className="space-y-4">
                  <ErasCesareaCarouselVisual onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-fona-cricotiroidotomia' ? (
                <div className="space-y-4">
                  <FonaInfographicVisual onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-aminofilina-teofilina-cppd' ? (
                <div className="space-y-4">
                  <AminofilinaTeofilinaVisual onDownload={() => handleDownload(selectedResource)} />
                </div>
              ) : selectedResource.id === 'res-caso-elaine-bromiley' && !selectedResource.fileDataUrl ? (
                <div className="space-y-4">
                  <ElaineSlideViewer />
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
                    <div className="flex items-center justify-between text-white font-bold">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rose-400" />
                        <span>Resumen Ejecutivo del Caso Elaine Bromiley</span>
                      </span>
                      <button
                        onClick={() => handleDownload(selectedResource)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 shadow cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Descargar PDF Completo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (selectedResource.category === 'infografia' || selectedResource.category === 'foto' || (selectedResource.images && selectedResource.images.length > 0) || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(selectedResource.fileExtension?.toLowerCase() || '') || (selectedResource.url && selectedResource.url.match(/\.(jpg|jpeg|png|webp|svg|gif)(\?.*)?$/i)) || (selectedResource.fileDataUrl && selectedResource.fileDataUrl.startsWith('data:image'))) ? (
                /* 4. HIGH-DEFINITION IMAGE / INFOGRAPHIC / CAROUSEL VIEWER */
                <div className="space-y-5 max-w-4xl mx-auto">
                  {(() => {
                    const allImages: string[] = (selectedResource.images && selectedResource.images.length > 0)
                      ? selectedResource.images
                      : (selectedResource.url ? [selectedResource.url] : (selectedResource.fileDataUrl ? [selectedResource.fileDataUrl] : []));
                    
                    const hasMultiple = allImages.length > 1;
                    const safeIndex = Math.min(Math.max(0, carouselSlideIndex), Math.max(0, allImages.length - 1));
                    const activeImg = allImages[safeIndex] || allImages[0] || selectedResource.url || selectedResource.fileDataUrl;

                    return (
                      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-3 sm:p-5 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 px-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-teal-400 font-extrabold flex items-center gap-1.5">
                              <Eye className="w-4 h-4" /> {hasMultiple ? 'ÁLBUM MULTIMEDIA / CARRUSEL CLÍNICO' : 'VISOR DE IMAGEN / INFOGRAFÍA EN ALTA RESOLUCIÓN'}
                            </span>
                            {hasMultiple && (
                              <span className="bg-amber-500/20 text-amber-300 font-black text-[11px] px-2.5 py-0.5 rounded-full border border-amber-500/40">
                                Lámina {safeIndex + 1} de {allImages.length}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                if (activeImg) {
                                  const link = document.createElement('a');
                                  link.href = activeImg;
                                  link.download = `${selectedResource.title}_lamina_${safeIndex + 1}.jpg`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else {
                                  handleDownload(selectedResource);
                                }
                              }}
                              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{hasMultiple ? `Descargar Foto #${safeIndex + 1}` : 'Descargar Imagen'}</span>
                            </button>
                            {activeImg && (
                              <a
                                href={activeImg}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>Pantalla Completa</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Top Carousel Navigation Buttons (when multiple) */}
                        {hasMultiple && (
                          <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2 text-xs">
                            <button
                              type="button"
                              onClick={() => setCarouselSlideIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                              className="bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-white font-bold px-3 py-1.5 rounded-lg border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Foto Anterior</span>
                            </button>

                            <div className="text-center font-bold text-slate-300">
                              <span className="text-cyan-400 font-black text-sm">#{safeIndex + 1}</span> / {allImages.length}
                            </div>

                            <button
                              type="button"
                              onClick={() => setCarouselSlideIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                              className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-3 py-1.5 rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5 transition-all active:scale-95"
                            >
                              <span>Siguiente Foto</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {/* Main Image Stage */}
                        <div className="relative bg-black/90 rounded-2xl p-2 flex items-center justify-center overflow-hidden border border-slate-800/80 min-h-[350px] group">
                          <img
                            src={activeImg}
                            alt={`${selectedResource.title} - Lámina ${safeIndex + 1}`}
                            referrerPolicy="no-referrer"
                            className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all"
                          />

                          {/* Big Overlay Chevrons */}
                          {hasMultiple && (
                            <>
                              <button
                                type="button"
                                onClick={() => setCarouselSlideIndex(prev => prev > 0 ? prev - 1 : allImages.length - 1)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-cyan-600 text-white flex items-center justify-center shadow-2xl border border-white/20 transition-all cursor-pointer active:scale-90"
                                title="Foto anterior"
                              >
                                <ChevronLeft className="w-6 h-6" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setCarouselSlideIndex(prev => prev < allImages.length - 1 ? prev + 1 : 0)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/80 hover:bg-cyan-600 text-white flex items-center justify-center shadow-2xl border border-white/20 transition-all cursor-pointer active:scale-90"
                                title="Siguiente foto"
                              >
                                <ChevronRight className="w-6 h-6" />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Interactive Thumbnail Filmstrip */}
                        {hasMultiple && (
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[11px] font-bold text-slate-400 px-1">
                              Toca cualquier miniatura para verla en tamaño completo:
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
                              {allImages.map((thumb, tIdx) => (
                                <button
                                  key={tIdx}
                                  type="button"
                                  onClick={() => setCarouselSlideIndex(tIdx)}
                                  className={`relative shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer active:scale-95 ${
                                    safeIndex === tIdx
                                      ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg scale-105'
                                      : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                                  }`}
                                >
                                  <img
                                    src={thumb}
                                    alt={`Lámina ${tIdx + 1}`}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                                  />
                                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                                    #{tIdx + 1}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Notes & Description for image */}
                  {selectedResource.description && (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Notas y Descripción Clínica
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                        {selectedResource.description}
                      </div>
                    </div>
                  )}
                </div>
              ) : (selectedResource.category === 'pdf' || selectedResource.fileExtension === 'pdf' || (selectedResource.url && selectedResource.url.endsWith('.pdf')) || selectedResource.category === 'pauta' || selectedResource.category === 'presentacion') ? (
                /* 5. PDF / CLINICAL DOCUMENT VIEWER */
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0 max-w-5xl mx-auto">
                  {/* PDF Reader Toolbar */}
                  <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-white text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-cyan-200 font-extrabold">VISOR DE DOCUMENTO PDF OFICIAL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedResource.url && (
                        <a
                          href={selectedResource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" /> Pantalla Completa
                        </a>
                      )}
                      {selectedResource.downloadable !== false && (
                        <button
                          onClick={() => handleDownload(selectedResource)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Download className="w-3 h-3" /> Descargar PDF
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PDF Content Frame or HTML Data Viewer */}
                  {selectedResource.url && selectedResource.url.endsWith('.pdf') ? (
                    <div className="w-full h-[650px] md:h-[800px] bg-slate-900 border-b border-slate-800 relative">
                      <iframe
                        src={selectedResource.url}
                        className="w-full h-full border-0"
                        title={selectedResource.title}
                      />
                    </div>
                  ) : selectedResource.fileDataUrl ? (
                    <div className="w-full h-[600px] md:h-[750px] bg-slate-800">
                      <iframe
                        src={selectedResource.fileDataUrl}
                        className="w-full h-full border-0"
                        title={selectedResource.title}
                      />
                    </div>
                  ) : (
                    /* High-Fidelity Rendered PDF Paper View */
                    <div className="p-6 md:p-10 bg-slate-100 text-slate-900 font-serif space-y-6 shadow-inner rounded-b-3xl">
                      {/* Document Sheet Header */}
                      <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-sans font-black tracking-widest text-slate-500 uppercase">
                            ANESTESIAPRO • GUÍA CLÍNICA DE EDUCACIÓN CONTINUA
                          </p>
                          <h2 className="text-xl font-black text-slate-900 mt-1 font-sans leading-snug">
                            {selectedResource.title}
                          </h2>
                          <p className="text-xs font-sans text-blue-700 font-bold mt-1">
                            {selectedResource.author} • Fecha: {selectedResource.date}
                          </p>
                        </div>
                        <div className="bg-slate-900 text-cyan-400 text-[10px] font-sans font-black p-2.5 rounded-xl text-center shrink-0">
                          DOCUMENTO
                          <br />
                          OFICIAL
                        </div>
                      </div>

                      {/* Main Text Content */}
                      <div className="text-sm leading-relaxed text-slate-800 space-y-4 font-sans">
                        <p className="font-bold text-slate-900 text-base">
                          Resumen Técnico y Pautas de Aplicación Perioperatoria:
                        </p>
                        <div className="bg-white border border-slate-300 rounded-2xl p-6 space-y-3.5 shadow-sm font-sans">
                          {selectedResource.description ? selectedResource.description.split('\n').map((paragraph, pIdx) => (
                            <p key={pIdx} className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                              {paragraph}
                            </p>
                          )) : (
                            <p className="text-slate-500 text-xs italic">Sin descripción adicional.</p>
                          )}
                        </div>
                      </div>

                      {/* PDF Sheet Footer */}
                      <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[11px] font-sans text-slate-500 font-semibold">
                        <span>AnestesiaPro Medical Guidelines</span>
                        <span>Formato Digital Oficial PDF • Documento Completo</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* 6. GENERIC UPLOADED FILE VIEWER */
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto space-y-5 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedResource.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{selectedResource.fileName || 'Archivo adjunto'}</p>
                  </div>
                  {selectedResource.description && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-300 leading-relaxed text-left whitespace-pre-line">
                      {selectedResource.description}
                    </div>
                  )}
                  <button
                    onClick={() => handleDownload(selectedResource)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar {selectedResource.fileExtension ? `.${selectedResource.fileExtension.toUpperCase()}` : 'Archivo'}</span>
                  </button>
                </div>
              )}

              {/* Tags */}
              {selectedResource.tags && selectedResource.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 max-w-4xl mx-auto">
                  <span className="text-xs font-bold text-slate-400">Etiquetas:</span>
                  {selectedResource.tags.map((t, i) => (
                    <span key={i} className="bg-slate-900 border border-slate-800 text-cyan-300 text-xs font-bold px-3 py-1 rounded-xl">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* External Web Link or PDF Download Section */}
              {selectedResource.url && selectedResource.url.endsWith('.pdf') ? (
                <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 border border-blue-500/40 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 text-blue-300 rounded-2xl border border-blue-400/30 shrink-0">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Documento Científico Original (PDF)</span>
                      </p>
                      <p className="text-xs text-slate-200 mt-0.5 font-mono break-all line-clamp-1">
                        {selectedResource.fileName || 'Articulo_Cientifico_Original.pdf'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <a
                      href={selectedResource.url}
                      download={selectedResource.fileName || `${selectedResource.title}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordDownload(selectedResource.id)}
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </a>

                    <a
                      href={selectedResource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => recordDownload(selectedResource.id)}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                      <span>Abrir PDF Completo</span>
                    </a>
                  </div>
                </div>
              ) : selectedResource.url ? (
                <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border border-emerald-500/40 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-400/30 shrink-0">
                      <Globe className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Enlace Web Oficial / Fuente Original</span>
                      </p>
                      <p className="text-xs text-slate-200 mt-0.5 font-mono break-all line-clamp-1">
                        {selectedResource.url}
                      </p>
                    </div>
                  </div>
                  <a
                    href={selectedResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordDownload(selectedResource.id)}
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    <span>Abrir Sitio Web Oficial</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : null}

              {/* Download Footer (For generated or base64 files) */}
              {selectedResource.downloadable !== false && (!selectedResource.url || !selectedResource.url.endsWith('.pdf')) && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 rounded-2xl shadow-md shrink-0">
                      <Download className="w-5 h-5 font-black" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white break-all">
                        {selectedResource.fileName || 'AnestesiaPro_EducacionContinua.pdf'}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-400">
                        Tamaño: {selectedResource.fileSize || 'Listo'} • Disponible para descarga directa
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(selectedResource)}
                    disabled={downloadingId === selectedResource.id}
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs px-6 py-3 rounded-2xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{downloadingId === selectedResource.id ? 'Descargando...' : `Descargar .${selectedResource.fileExtension || 'file'}`}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal (Admin Only - Multi-File & Server Persistent) */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-md">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Publicar Archivos en el Servidor Público
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sube 1 o varios archivos a la vez. Serán visibles para todos los médicos y usuarios.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isBatchUploading) {
                    setIsModalOpen(false);
                    setQueuedFiles([]);
                  }
                }}
                disabled={isBatchUploading}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatchUpload} className="p-6 space-y-4">
              {/* Server Visibility Guarantee Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-3.5 flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500 text-slate-950 rounded-lg shrink-0 mt-0.5 font-bold">
                  <CloudUpload className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-extrabold text-emerald-950">
                    Sincronización Centralizada en el Servidor
                  </p>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Los archivos que subas aquí ya no se quedan guardados sólo en tu teléfono: se transmiten al <strong>servidor de AnestesiaPro</strong> y se comparten automáticamente con todos los usuarios en cualquier dispositivo.
                  </p>
                </div>
              </div>

              {/* Upload Drop Zone (Multiple files allowed) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Seleccionar o Arrastrar Archivos (Puedes elegir varios al mismo tiempo) *</span>
                  <span className="text-[11px] text-blue-600 font-extrabold">JPG, PNG, PDF, MP4, PPTX, ZIP</span>
                </label>

                <div 
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleFilesSelected(e.dataTransfer.files);
                    }
                  }}
                  className="border-2 border-dashed border-blue-200 hover:border-blue-500 rounded-2xl p-5 text-center bg-blue-50/20 hover:bg-blue-50/50 transition-all cursor-pointer relative group"
                >
                  <input
                    type="file"
                    id="multi-file-upload"
                    multiple
                    accept="image/*,.pdf,.png,.jpg,.jpeg,.webp,.gif,.bmp,.heic,.heif,.avif,.tiff,.mp4,.mov,.pptx,.ppt,.docx,.doc,.txt,.zip,.rar"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(e.target.files);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  <input
                    type="file"
                    id="carousel-direct-upload"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFilesSelected(e.target.files);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  <label htmlFor="multi-file-upload" className="cursor-pointer space-y-2 block">
                    {isCompressingImage ? (
                      <div className="py-2 space-y-2">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                        <p className="text-xs font-black text-blue-700">
                          {compressingProgress || 'Optimizando y preparando archivos...'}
                        </p>
                        <p className="text-[10px] text-slate-500">Comprimiendo imágenes a calidad HD lista para móviles y servidores</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-xs font-extrabold text-blue-700">
                          {queuedFiles.length > 0 ? '+ Agregar más archivos a la lista' : 'Toca aquí o arrastra para seleccionar archivos (1 o varios a la vez)'}
                        </p>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          En teléfonos móviles puedes marcar múltiples fotos o PDFs a la vez en tu galería/explorador
                        </p>
                      </>
                    )}
                  </label>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-blue-100 mt-3">
                    <label
                      htmlFor="carousel-direct-upload"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                    >
                      <Layers className="w-4 h-4" />
                      <span>📸 Subir Fotos para Carrusel (Múltiples Láminas)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Queued Files List */}
              {queuedFiles.length > 0 && (
                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-blue-600" />
                      Archivos listos para subir ({queuedFiles.length}):
                    </span>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="carousel-direct-upload"
                        className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                        title="Agregar más fotos a este carrusel"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Añadir otra foto</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setQueuedFiles([])}
                        className="text-[10px] font-bold text-slate-500 hover:text-rose-600 cursor-pointer"
                      >
                        Limpiar lista
                      </button>
                    </div>
                  </div>

                  {/* If exactly 1 file is selected, offer carousel prompt */}
                  {queuedFiles.length === 1 && (
                    <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-rose-600 shrink-0" />
                        <div>
                          <p className="text-xs text-rose-950 font-bold">
                            ¿Deseas crear un Carrusel interactivo estilo Instagram?
                          </p>
                          <p className="text-[11px] text-rose-800">
                            Toca "Añadir 2ª Foto" para sumar más láminas de tu galería a este recurso.
                          </p>
                        </div>
                      </div>
                      <label
                        htmlFor="carousel-direct-upload"
                        className="shrink-0 inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3 py-1.5 rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Añadir 2ª Foto al Carrusel</span>
                      </label>
                    </div>
                  )}

                  {/* Carrusel Mode Toggle when 2+ files */}
                  {queuedFiles.length > 1 && (
                    <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-indigo-500/10 border border-rose-200 rounded-xl p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-rose-500 text-white rounded-lg shadow-sm">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 block">
                            Formato de Publicación ({queuedFiles.length} Archivos)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {uploadMode === 'carousel' 
                              ? '✨ Modo Carrusel: Se publican juntos en 1 solo archivo interactivo estilo Instagram con diapositivas' 
                              : 'Modo Separado: Se publica cada imagen como una tarjeta distinta'}
                          </span>
                        </div>
                      </div>

                      {/* Toggle Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setUploadMode('carousel')}
                          className={`p-2.5 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            uploadMode === 'carousel'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20 ring-2 ring-rose-400/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <Layers className="w-4 h-4" />
                          <span>Carrusel Instagram (1 Archivo)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setUploadMode('separate')}
                          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            uploadMode === 'separate'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/30'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <FileUp className="w-4 h-4" />
                          <span>{queuedFiles.length} Publicaciones Separadas</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {queuedFiles.map((qf, idx) => (
                      <div key={qf.id} className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Reorder controls for carousel */}
                          {uploadMode === 'carousel' && queuedFiles.length > 1 && (
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveQueuedFile(idx, 'up')}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                title="Mover hacia arriba (orden anterior)"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === queuedFiles.length - 1}
                                onClick={() => handleMoveQueuedFile(idx, 'down')}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                title="Mover hacia abajo (orden posterior)"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {qf.dataUrl && (qf.type.startsWith('image/') || ['jpg', 'png', 'jpeg', 'webp'].includes(qf.extension)) ? (
                            <div className="relative shrink-0">
                              <img src={qf.dataUrl} alt="Miniatura" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                              {uploadMode === 'carousel' && (
                                <span className={`absolute -top-1.5 -left-1.5 text-[9px] font-black px-1.5 py-0.2 rounded-full border shadow-sm ${
                                  idx === 0 ? 'bg-rose-600 text-white border-rose-700' : 'bg-slate-900 text-slate-100 border-slate-700'
                                }`}>
                                  #{idx + 1}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-bold text-[10px] uppercase">
                              .{qf.extension}
                            </div>
                          )}
                          <div className="min-w-0 flex-1 space-y-1">
                            <input
                              type="text"
                              value={qf.title}
                              onChange={(e) => handleUpdateQueuedTitle(qf.id, e.target.value)}
                              placeholder={uploadMode === 'carousel' ? `Lámina #${idx + 1} / Título o descripción...` : "Título del recurso..."}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span className="truncate max-w-[140px]">{qf.name}</span>
                              <span>•</span>
                              <span className="text-slate-500 font-semibold">{qf.size}</span>
                              {uploadMode === 'carousel' && idx === 0 && (
                                <span className="text-rose-600 font-bold">★ Portada principal</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {uploadMode !== 'carousel' && (
                            <select
                              value={qf.category}
                              onChange={(e) => handleUpdateQueuedCategory(qf.id, e.target.value as any)}
                              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700"
                            >
                              <option value="pdf">📄 PDF</option>
                              <option value="infografia">📸 Infografía/Foto</option>
                              <option value="reel">🎬 Video MP4</option>
                              <option value="presentacion">📊 PPTX</option>
                              <option value="pauta">📌 Pauta</option>
                              <option value="archivo">📦 Archivo</option>
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveQueuedFile(qf.id)}
                            className="text-rose-500 hover:text-rose-700 p-1.5 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar este archivo de la lista"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Single File or Carousel Main Title Input */}
              {(queuedFiles.length === 0 || uploadMode === 'carousel') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {uploadMode === 'carousel' ? 'Título Principal del Carrusel / Álbum *' : 'Título del Recurso o Tema *'}
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={uploadMode === 'carousel' ? "Ej: Protocolo de Vía Aérea en 5 Pasos (Álbum Instagram)" : "Ej: Guía Rápida de Vía Aérea o Infografía Quirúrgica"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {queuedFiles.length === 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Categoría *
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                    >
                      <option value="pdf">📄 Guía Clínica / PDF</option>
                      <option value="reel">🎬 Video MP4 / Demostración</option>
                      <option value="infografia">📸 Infografía / Guía Técnica</option>
                      <option value="presentacion">📊 Presentación PPTX</option>
                      <option value="pauta">📌 Protocolo / Pauta</option>
                      <option value="archivo">📦 Paquete ZIP / Archivo</option>
                    </select>
                  </div>
                )}

                <div className={queuedFiles.length > 0 ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Autor / Editor de la Publicación
                  </label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ej: Dr. Carlos Leal • AnestesiaPro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción Técnica o Resumen para los Usuarios
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalla las indicaciones, dosis o puntos clave de este material..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Enlace Web Complementario (Opcional)
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Etiquetas Clínicas
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="#EducaciónContinua, #AnestesiaPro, #Guias"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    if (!isBatchUploading) {
                      setIsModalOpen(false);
                      setQueuedFiles([]);
                    }
                  }}
                  disabled={isBatchUploading}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isBatchUploading || (queuedFiles.length === 0 && !newTitle.trim())}
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isBatchUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-200" />
                      <span>Transmitiendo al servidor público...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4 text-cyan-200" />
                      <span>
                        {uploadMode === 'carousel' && queuedFiles.length > 1
                          ? `Publicar 1 Álbum Carrusel (${queuedFiles.length} Fotos) en el Servidor`
                          : queuedFiles.length > 1 
                            ? `Publicar ${queuedFiles.length} Archivos Separados en el Servidor` 
                            : 'Publicar en el Servidor Público'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar / Cambiar Foto de un Recurso (Dr. Carlos Leal) */}
      {resourceToEdit && isAdmin && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-rose-600 via-pink-600 to-indigo-600 text-white rounded-2xl shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Gestionar Fotos y Carrusel
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editSlides.length > 1 
                      ? `Álbum Carrusel interactivo (${editSlides.length} láminas HD)` 
                      : 'Agrega más fotos para convertir en Carrusel o cambia la foto actual'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!isSavingEdit) {
                    setResourceToEdit(null);
                    setEditSlides([]);
                  }
                }}
                disabled={isSavingEdit}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Carousel Slides Interactive Management */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-rose-600" />
                    <span>Láminas del Recurso ({editSlides.length}):</span>
                  </label>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    editSlides.length > 1 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {editSlides.length > 1 ? `✨ Carrusel (${editSlides.length} Fotos)` : 'Foto Única'}
                  </span>
                </div>

                {/* Main Preview of Active Slide */}
                {editSlides.length > 0 ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                      <div className="w-full h-56 flex items-center justify-center p-2">
                        <img
                          src={editSlides[activeEditSlideIndex]?.url}
                          alt={`Lámina ${activeEditSlideIndex + 1}`}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>

                      {/* Slide Indicator Overlay */}
                      <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-black px-2.5 py-1 rounded-lg border border-slate-700/50 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-rose-400" />
                        <span>Lámina {activeEditSlideIndex + 1} de {editSlides.length}</span>
                      </div>

                      {/* Navigation Arrows inside preview if multi-slide */}
                      {editSlides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setActiveEditSlideIndex(prev => Math.max(0, prev - 1))}
                            disabled={activeEditSlideIndex === 0}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveEditSlideIndex(prev => Math.min(editSlides.length - 1, prev + 1))}
                            disabled={activeEditSlideIndex === editSlides.length - 1}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Delete Current Slide */}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditSlide(editSlides[activeEditSlideIndex].id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow cursor-pointer"
                        title="Eliminar esta lámina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Caption for Current Slide */}
                    <div>
                      <input
                        type="text"
                        value={editSlides[activeEditSlideIndex]?.caption || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditSlides(prev => {
                            const copy = [...prev];
                            if (copy[activeEditSlideIndex]) {
                              copy[activeEditSlideIndex] = { ...copy[activeEditSlideIndex], caption: val };
                            }
                            return copy;
                          });
                        }}
                        placeholder={`Descripción o título para la Lámina #${activeEditSlideIndex + 1}...`}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                      />
                    </div>

                    {/* Thumbnails Strip */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                      {editSlides.map((slide, idx) => (
                        <div
                          key={slide.id}
                          onClick={() => setActiveEditSlideIndex(idx)}
                          className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeEditSlideIndex === idx
                              ? 'border-rose-500 ring-2 ring-rose-400/40 scale-105 shadow-md'
                              : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={slide.url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0.5 right-0.5 bg-slate-950/85 text-white font-black text-[9px] px-1 rounded">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}

                      {/* Add more photos button right on thumbnail strip */}
                      <label
                        htmlFor="edit-modal-photo-picker"
                        className="shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-rose-300 hover:border-rose-500 bg-rose-50/50 hover:bg-rose-50 flex flex-col items-center justify-center text-rose-600 transition-colors cursor-pointer"
                        title="Agregar más fotos a este carrusel"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[9px] font-black mt-0.5">+ Foto</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-rose-300 rounded-2xl p-6 text-center bg-rose-50/20">
                    <p className="text-xs font-bold text-slate-600">Este recurso no tiene fotos asignadas actualmente.</p>
                  </div>
                )}

                {/* Upload Buttons for Edit Modal */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <input
                    type="file"
                    id="edit-modal-photo-picker"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleSelectNewPhotosForEdit(e.target.files);
                      }
                      e.target.value = '';
                    }}
                    className="hidden"
                  />

                  <label
                    htmlFor="edit-modal-photo-picker"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    {isProcessingEditPhotos ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Procesando fotos...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4" />
                        <span>📸 + Agregar Fotos al Carrusel (Múltiples)</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Title Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título del Recurso:
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Título..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descripción o Resumen Clínico:
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Descripción clínica..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setResourceToEdit(null);
                    setEditSlides([]);
                  }}
                  disabled={isSavingEdit}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveEditResource}
                  disabled={isSavingEdit || !editTitle.trim()}
                  className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isSavingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Actualizando en la nube...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>
                        {editSlides.length > 1
                          ? `Guardar Carrusel (${editSlides.length} Láminas)`
                          : 'Guardar Cambios'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

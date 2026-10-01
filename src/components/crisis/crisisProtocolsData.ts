export interface CrisisDrugCalculation {
  name: string;
  indication: string;
  concentrationText: string;
  calculateDose: (weightKg: number) => {
    doseText: string;
    volumeText: string;
    instructions: string;
    highlight?: boolean;
  };
}

export interface CrisisStepItem {
  id: string;
  order: number;
  phase: 'inmediato' | 'soporte' | 'avanzado' | 'post-crisis';
  title: string;
  description: string;
  isCrucial?: boolean;
  tag?: string;
}

export interface CrisisProtocol {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  category: 'toxicidad' | 'via_aerea' | 'metabolico' | 'inmunologico' | 'respiratorio' | 'hemodinamico' | 'neuroaxial' | 'cardiovascular';
  severity: 'extrema' | 'alta' | 'moderada';
  badge?: string;
  quickSummary?: string;
  triggerSigns: string[];
  immediateAction: string;
  lethalErrors: string[];
  steps: CrisisStepItem[];
  drugs: CrisisDrugCalculation[];
  cognitivePearls: string[];
  targetParameters?: { param: string; goal: string }[];
}

export const CRISIS_PROTOCOLS_BANK: CrisisProtocol[] = [
  // -------------------------------------------------------------
  // 1. LAST - TOXICIDAD SISTÉMICA POR ANESTÉSICOS LOCALES
  // -------------------------------------------------------------
  {
    id: 'last_toxicity',
    title: 'Toxicidad Sistémica por Anestésicos Locales (LAST)',
    shortTitle: 'LAST (Toxicidad)',
    subtitle: 'Protocolo ASRA / AAGBI de Emulsión Lipídica al 20%',
    category: 'toxicidad',
    severity: 'extrema',
    triggerSigns: [
      'Sabor metálico, acúfenos, mareo, visión borrosa, parestesia peribucal',
      'Agitación psicomotriz, convulsiones tónico-clónicas',
      'Hipotensión refractaria, bradicardia extrema, ensanchamiento QRS, arritmias ventriculares o asistolia',
      'Inyección intravascular inadvertida o absorción masiva en bloqueo regional'
    ],
    immediateAction: '¡DETENER DE INMEDIATO LA INYECCIÓN DEL ANESTÉSICO LOCAL! Pedir ayuda y solicitar KIT DE RESCATE LIPÍDICO 20%.',
    lethalErrors: [
      'NO usar Vasopresina (aumenta poscarga y empeora contractilidad).',
      'NO usar Bloqueantes de Canales de Calcio ni Beta-bloqueantes.',
      'NO administrar bolos de Adrenalina habituales de 1 mg (usar bolos reducidos < 1 mcg/kg).',
      'NO usar Propofol como sustituto de emulsión lipídica (empeora el colapso miocárdico).'
    ],
    drugs: [
      {
        name: 'Emulsión Lipídica al 20% (Bolo Inicial)',
        indication: 'Rescate celular y miocárdico inmediato',
        concentrationText: 'Frasco al 20% (Intralipid / Lipovenós / Medialipid)',
        calculateDose: (w) => {
          const ml = Math.round(w * 1.5);
          return {
            doseText: `1.5 mL/kg = ${ml} mL`,
            volumeText: `${ml} mL en bolo IV rápido en 2-3 minutos`,
            instructions: 'Administrar de inmediato por vía venosa periférica o central. Si persiste inestabilidad o paro, repetir 1 o 2 bolos adicionales (cada 5 minutos).',
            highlight: true
          };
        }
      },
      {
        name: 'Emulsión Lipídica al 20% (Infusión Continua)',
        indication: 'Mantenimiento post-bolo para captación continua',
        concentrationText: 'Frasco al 20%',
        calculateDose: (w) => {
          const rateMlMin = Number((w * 0.25).toFixed(1));
          const rateMlHr = Math.round(rateMlMin * 60);
          return {
            doseText: `0.25 mL/kg/min (${rateMlHr} mL/hora)`,
            volumeText: `${rateMlMin} mL/min o ${rateMlHr} mL/h`,
            instructions: 'Iniciar inmediatamente tras el primer bolo. Si la PA continúa cayendo, se puede duplicar la infusión a 0.5 mL/kg/min.',
            highlight: true
          };
        }
      },
      {
        name: 'Dosis Máxima Total de Emulsión Lipídica',
        indication: 'Límite de seguridad acumulado en los primeros 30 min',
        concentrationText: 'Límite máximo recomendado: 10-12 mL/kg',
        calculateDose: (w) => {
          const maxMl = Math.round(w * 12);
          return {
            doseText: `Máximo 12 mL/kg = ${maxMl} mL`,
            volumeText: `No exceder ~${maxMl} mL en la primera hora`,
            instructions: 'Continuar la infusión por lo menos durante 15 minutos después de recuperar la estabilidad hemodinámica.'
          };
        }
      },
      {
        name: 'Adrenalina para Reanimación LAST (Dosis Reducida)',
        indication: 'Soporte inotrópico / cronotrópico sin generar arritmias mortales',
        concentrationText: 'Dilución 1:10.000 (100 µg/mL) o diluir a 10 µg/mL',
        calculateDose: (w) => {
          const doseMcg = Math.min(100, Math.round(w * 1.0));
          return {
            doseText: `< 1 µg/kg = ${doseMcg} µg IV`,
            volumeText: `Bolos pequeños de ${doseMcg} µg (evitar 1 mg habitual)`,
            instructions: 'Dosis excesivas de adrenalina alteran la resucitación lipídica y empeoran la acidosis y las arritmias en LAST.'
          };
        }
      },
      {
        name: 'Midazolam para Supresión de Convulsiones',
        indication: 'Cese de actividad epileptógena y reducción de consumo de O2',
        concentrationText: 'Ampolla 5 mg/5 mL (1 mg/mL)',
        calculateDose: (w) => {
          const doseMg = Number(Math.min(5, w * 0.05).toFixed(1));
          return {
            doseText: `0.05 - 0.1 mg/kg = ${doseMg} mg IV`,
            volumeText: `${doseMg} mL IV lento`,
            instructions: 'Titular para detener la convulsión. Prevenir la acidosis y la hipoxia, que potencian la toxicidad miocárdica.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'last-1',
        order: 1,
        phase: 'inmediato',
        title: 'Detener Fármaco & Pedir Auxilio Inmediato',
        description: 'Suspender inyección del anestésico local. Activar código de paro/emergencia en quirófano. Pedir Kit de Emulsión Lipídica y carro de paro.',
        isCrucial: true,
        tag: 'MINUTO 0'
      },
      {
        id: 'last-2',
        order: 2,
        phase: 'inmediato',
        title: 'Vía Aérea con FiO2 100% & Hiperoxigenación',
        description: 'Ventilar con O2 al 100%. Evitar hipoxia, hipercapnia y acidosis (agravan drásticamente la cardiotoxicidad por bupivacaína). Intubar precozmente si hay deterioro neurológico.',
        isCrucial: true,
        tag: 'VÍA AÉREA'
      },
      {
        id: 'last-3',
        order: 3,
        phase: 'inmediato',
        title: 'Control de Convulsiones',
        description: 'Administrar Benzodiacepinas (Midazolam 0.05-0.1 mg/kg IV). Si persisten convulsiones que impiden oxigenar, succinilcolina para facilitar ventilación (no detiene actividad cerebral central).',
        isCrucial: false
      },
      {
        id: 'last-4',
        order: 4,
        phase: 'soporte',
        title: 'Bolo de Emulsión Lipídica 20%',
        description: 'Administrar 1.5 mL/kg de Lípidos 20% en 2-3 min. Continuar de inmediato con infusión continua a 0.25 mL/kg/min (15 mL/kg/h).',
        isCrucial: true,
        tag: 'LÍPIDOS 20%'
      },
      {
        id: 'last-5',
        order: 5,
        phase: 'avanzado',
        title: 'Soporte Hemodinámico Adaptado (Regla ASRA)',
        description: 'Si hay PCR: Iniciar compresiones continuas. Administrar Adrenalina a dosis reducida (<1 µg/kg por bolo). NO usar vasopresina, bloqueantes de calcio ni betabloqueantes. Tratar arritmias ventriculares con Amiodarona.',
        isCrucial: true
      },
      {
        id: 'last-6',
        order: 6,
        phase: 'post-crisis',
        title: 'Monitorización Post-Reanimación',
        description: 'Vigilar en UCI por lo menos 4-6 horas si hubo síntomas del SNC, y 12-24 horas si hubo colapso o arritmias cardiovasculares, por riesgo de recurrencia.',
        isCrucial: false
      }
    ],
    cognitivePearls: [
      'El "Lipid Sink" atrapa las moléculas lipofílicas del anestésico libre en sangre acelerando su depuración miocárdica.',
      'La reanimación cardiopulmonar en LAST puede requerir tiempos prolongados (>60 minutos) mientras los lípidos limpian los canales de sodio cardíacos.',
      'Si el hospital dispone de CEC (Bypass cardiopulmonar / ECMO), alertar al equipo de perfusión de forma precoz.'
    ]
  },

  // -------------------------------------------------------------
  // 2. HIPERTERMIA MALIGNA (HM)
  // -------------------------------------------------------------
  {
    id: 'malignant_hyperthermia',
    title: 'Hipertermia Maligna (HM)',
    shortTitle: 'Hipertermia Maligna',
    subtitle: 'Canalopatía del Receptor Ryanodina (RYR1) - Guía MHAUS',
    category: 'metabolico',
    severity: 'extrema',
    triggerSigns: [
      'Aumento inexplicable, rápido y desproporcionado del EtCO2 (>60-70 mmHg) refractario a hiperventilación',
      'Taquicardia sinusal extrema o taquiarritmias inexplicables',
      'Rigidez muscular generalizada o espasmo severo de maseteros tras Succinilcolina',
      'Hipertermia marcada de rápido ascenso (signo tardío pero devastador: >40°C)',
      'Acidosis mixta profunda (respiratoria y metabólica) e hipercalemia súbita'
    ],
    immediateAction: '¡CERRAR VAPORIZADORES Y SUSPENDER SUCCINILCOLINA! Cambiar a flujo alto de O2 al 100% (>10 L/min). Pedir KIT DE HIPERTERMIA MALIGNA.',
    lethalErrors: [
      'NO administrar Bloqueantes de Canales de Calcio (ej: Diltiazem, Verapamilo): provocan paro por colapso cardiovascular e hipercalemia mortal con Dantroleno.',
      'NO demorar la administración de Dantroleno esperando que suba la temperatura corporal.',
      'NO perder tiempo cambiando la máquina de anestesia completa (apagar vaporizadores y usar flujos altos con filtros).'
    ],
    drugs: [
      {
        name: 'Dantroleno Sódico IV (Bolo Inicial)',
        indication: 'Inhibición directa de la liberación de Calcio del retículo sarcoplásmico',
        concentrationText: 'Frascos de 20 mg (requiere 60 mL de agua estéril sin bacteriostático)',
        calculateDose: (w) => {
          const totalMg = Number((w * 2.5).toFixed(1));
          const viales = Math.ceil(totalMg / 20);
          const totalAguaMl = viales * 60;
          return {
            doseText: `2.5 mg/kg = ${totalMg} mg IV`,
            volumeText: `${viales} frascos viales de 20 mg (reconstituir con ${totalAguaMl} mL de agua bidestilada)`,
            instructions: 'Asignar a 2 o 3 personas a agitar fuertemente los viales para disolver. Administrar en bolo IV rápido. Repetir 1-2.5 mg/kg cada 5-10 min hasta cesar taquicardia y rigidez (máx 10 mg/kg).',
            highlight: true
          };
        }
      },
      {
        name: 'Ryanodex (Formulación concentrada moderna si disponible)',
        indication: 'Dantroleno nanocristalino ultrarrápido',
        concentrationText: 'Frasco de 250 mg / 5 mL',
        calculateDose: (w) => {
          const totalMg = Number((w * 2.5).toFixed(1));
          const viales = Math.ceil(totalMg / 250);
          return {
            doseText: `2.5 mg/kg = ${totalMg} mg IV`,
            volumeText: `${viales} vial de Ryanodex (cada vial se disuelve en solo 5 mL de agua)`,
            instructions: 'Se reconstituye en menos de 1 minuto frente a los frascos convencionales.'
          };
        }
      },
      {
        name: 'Gluconato de Calcio al 10% (Hipercalemia)',
        indication: 'Estabilización de membrana miocárdica ante hiperpotasemia por rabdomiólisis',
        concentrationText: 'Ampollas al 10% (1 g / 10 mL)',
        calculateDose: (w) => {
          const doseMg = Math.min(2000, Math.round(w * 30));
          const doseMl = Number((doseMg / 100).toFixed(1));
          return {
            doseText: `30 - 50 mg/kg (Máx 2 g) = ${doseMg} mg`,
            volumeText: `${doseMl} mL IV en 5-10 minutos`,
            instructions: 'Indicado si hay cambios en el ECG por hipercalemia (ondas T picudas, ensanchamiento QRS).'
          };
        }
      },
      {
        name: 'Dextrosa 50% + Insulina Regular (Shift de Potasio)',
        indication: 'Introducción de K+ al intracelular',
        concentrationText: 'Dextrosa 50% (25 g / 50 mL) + Insulina cristalina',
        calculateDose: (w) => {
          const unitsInsulin = Math.min(10, Math.round(w * 0.15));
          const mlD50 = Math.round(unitsInsulin * 5);
          return {
            doseText: `${unitsInsulin} UI de Insulina Regular + ${mlD50} mL D50%`,
            volumeText: `Infusión en 15-30 minutos con glucemia capilar horaria`,
            instructions: 'Monitorizar glucosa capilar seriadamente para evitar hipoglicemia.'
          };
        }
      },
      {
        name: 'Bicarbonato de Sodio 8.4% (1 mEq/mL)',
        indication: 'Corrección de acidosis metabólica severa e hiperpotasemia',
        concentrationText: 'Frasco o ampolla al 8.4% (1 mEq = 1 mL)',
        calculateDose: (w) => {
          const doseMeq = Math.min(100, Math.round(w * 1.5));
          return {
            doseText: `1 - 2 mEq/kg = ${doseMeq} mEq (mL)`,
            volumeText: `${doseMeq} mL en infusión IV lenta guiada por gases`,
            instructions: 'Administrar si el pH < 7.20 y déficit de base severo.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'mh-1',
        order: 1,
        phase: 'inmediato',
        title: 'Cerrar Halogenados & Suspender Succinilcolina',
        description: 'Cerrar diales de vaporizadores de inmediato. No apagar el respirador: cambiar a O2 al 100% con flujos máximos (>10 L/min). Hiperventilar para barrer el exceso brutal de CO2.',
        isCrucial: true,
        tag: 'STOP TRIGGER'
      },
      {
        id: 'mh-2',
        order: 2,
        phase: 'inmediato',
        title: 'Declarar Emergencia & Pedir Kit de Dantroleno',
        description: 'Llamar a cirujano para concluir o pausar la cirugía lo antes posible. Asignar personal dedicado exclusivamente a abrir viales y mezclar Dantroleno.',
        isCrucial: true
      },
      {
        id: 'mh-3',
        order: 3,
        phase: 'soporte',
        title: 'Administración de Dantroleno IV',
        description: 'Cargar 2.5 mg/kg IV en bolo. Repetir cada 5-10 minutos hasta que disminuya el EtCO2 y baje la frecuencia cardíaca.',
        isCrucial: true,
        tag: 'DANTROLENO'
      },
      {
        id: 'mh-4',
        order: 4,
        phase: 'soporte',
        title: 'Enfriamiento Activo del Paciente',
        description: 'Lavado con soluciones heladas (SSN fría IV, lavado gástrico, vejiga y campo quirúrgico). Compresas frías en axilas e ingle. SUSPENDER enfriamiento cuando la T° baje a 38.5°C para prevenir hipotermia de rebote.',
        isCrucial: false
      },
      {
        id: 'mh-5',
        order: 5,
        phase: 'avanzado',
        title: 'Tratamiento de Hipercalemia y Acidosis',
        description: 'Tomar gases arteriales, K+, lactato, CPK y orina para mioglobina. Tratar K+ elevado con Calcio, Insulina + Glucosa y Bicarbonato.',
        isCrucial: true
      },
      {
        id: 'mh-6',
        order: 6,
        phase: 'post-crisis',
        title: 'Traslado a UCI y Mantenimiento de Dantroleno',
        description: 'Continuar Dantroleno 1 mg/kg cada 4-6 horas o infusión continua 0.25 mg/kg/h durante al menos 24 horas por riesgo de recaída (25% de los casos).',
        isCrucial: false
      }
    ],
    cognitivePearls: [
      'El primer signo más sensible y constante es el incremento de EtCO2 fuera de proporción con el volumen minuto.',
      'Cada ampolla tradicional de Dantroleno contiene 3 g de Manitol, por lo que producirá diuresis osmótica espontánea.',
      'Proteger la función renal: mantener diuresis > 1-2 mL/kg/h para evitar nefropatía por mioglobina.'
    ]
  },

  // -------------------------------------------------------------
  // 3. VÍA AÉREA DIFÍCIL NO PREVISTA (ALGORITMO VORTEX & CICO)
  // -------------------------------------------------------------
  {
    id: 'difficult_airway_cico',
    title: 'Vía Aérea Difícil No Prevista (VORTEX / CICO)',
    shortTitle: 'Vía Aérea Difícil & CICO',
    subtitle: 'Algoritmo DAS / Vortex - No Puedo Intubar, No Puedo Oxigenar',
    category: 'via_aerea',
    severity: 'extrema',
    triggerSigns: [
      'Imposibilidad de intubar la tráquea tras laringoscopia convencional o videolaringoscopia',
      'Dificultad o imposibilidad de ventilar con máscara facial (SpO2 en descenso continuo)',
      'Falla de ventilación y oxigenación con dispositivo supraglótico (máscara laríngea)',
      'Situación CICO (Cannot Intubate, Cannot Oxygenate): desaturación crítica < 80%'
    ],
    immediateAction: '¡DECLARAR SITUACIÓN DE RESCATE DE VÍA AÉREA! Limitar intentos a 3 por dispositivo y optimizar antes de cada reintento.',
    lethalErrors: [
      'NO insistir con múltiples laringoscopias traumáticas (>3 intentos causan edema y hemorragia que impiden ventilar con máscara).',
      'NO demorar el paso a FONA (Acceso Quirúrgico Infraglótico) cuando SpO2 cae en situación CICO.',
      'NO usar relajantes sin asegurar un plan de rescate con Sugammadex si se usó Rocuronio.'
    ],
    drugs: [
      {
        name: 'Sugammadex Rescate Inmediato (Post-Rocuronio)',
        indication: 'Reversión relámpago de bloqueo neuromuscular para despertar al paciente',
        concentrationText: 'Viales de 100 mg/mL (200 mg / 2 mL o 500 mg / 5 mL)',
        calculateDose: (w) => {
          const doseMg = Math.round(w * 16);
          const doseMl = Number((doseMg / 100).toFixed(1));
          return {
            doseText: `16 mg/kg = ${doseMg} mg IV`,
            volumeText: `${doseMl} mL en bolo IV inmediato`,
            instructions: 'Revierte el bloqueo de Rocuronio en menos de 3 minutos permitiendo retorno de la ventilación espontánea si el paciente no tiene obstrucción anatómica irreversible.',
            highlight: true
          };
        }
      },
      {
        name: 'Adrenalina Tópica / Descongestionante',
        indication: 'Hemostasia tópica en vía aérea nasal/faríngea sangrante',
        concentrationText: 'Dilución 1:100.000',
        calculateDose: (w) => {
          return {
            doseText: `Tópica en torundas / atomizador`,
            volumeText: `1-2 mL aplicados en la mucosa`,
            instructions: 'Mejora visualización en videolaringoscopia si hay sangrado capilar.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'airway-1',
        order: 1,
        phase: 'inmediato',
        title: 'Zona 1: Optimización de Máscara Facial',
        description: 'Técnica a 2 operadores con cánula orofaríngea (Guedel) / nasofaríngea. Sellado bimanual con técnica "V-E". Maniobra de tracción mandibular y elevación del mentón. CPAP con O2 100%.',
        isCrucial: true,
        tag: 'PLAN A'
      },
      {
        id: 'airway-2',
        order: 2,
        phase: 'inmediato',
        title: 'Zona 2: Dispositivo Supraglótico (SGA)',
        description: 'Insertar máscara laríngea de 2ª generación (ej: i-gel, ProSeal o Supreme). Permite ventilación y aspiración gástrica. Máximo 2 intentos ajustando tamaño o alineación.',
        isCrucial: true,
        tag: 'PLAN B'
      },
      {
        id: 'airway-3',
        order: 3,
        phase: 'soporte',
        title: 'Zona 3: Videolaringoscopia & Conductor (Bougie)',
        description: 'Videolaringoscopio con hoja angulada (tipo HyperBlade) + Bougie elástico pre-moldeado. Manipulación laríngea externa (BURP). Máximo 3 intentos totales de laringoscopia.',
        isCrucial: true,
        tag: 'PLAN C'
      },
      {
        id: 'airway-4',
        order: 4,
        phase: 'avanzado',
        title: 'Declaración CICO (No Intubo, No Oxigeno)',
        description: 'Si fallan Máscara + Dispositivo Supraglótico + Tubo y SpO2 cae: Activar equipo quirúrgico para FONA (Front of Neck Access) sin vacilación.',
        isCrucial: true,
        tag: 'EMERGENCIA CICO'
      },
      {
        id: 'airway-5',
        order: 5,
        phase: 'avanzado',
        title: 'FONA: Cricotiroidotomía Quirúrgica (Técnica Bisturí-Bougie-Tubo)',
        description: '1. Cuello en hiperextensión. 2. Palpar membrana cricotiroidea. 3. Incisión horizontal con bisturí #10 o #20. 4. Girar hoja 90°. 5. Deslizar Bougie hacia la tráquea. 6. Introducir tubo endotraqueal con cuff #6.0 sobre el bougie. 7. Inflar cuff y ventilar.',
        isCrucial: true,
        tag: 'FONA RESCATE'
      }
    ],
    cognitivePearls: [
      'La hipoxemia mata en 3 a 4 minutos; la cricotiroidotomía temprana salva vidas.',
      'El modelo VORTEX enseña que la meta principal en una vía aérea difícil NO es intubar, sino OXIGENAR el cerebro.',
      'Si se usó Rocuronio en la inducción, administrar de inmediato 16 mg/kg de Sugammadex para intentar despertar al paciente antes de que ocurra colapso circulatorio.'
    ]
  },

  // -------------------------------------------------------------
  // 4. ANAFILAXIA INTRAOPERATORIA SEVERA
  // -------------------------------------------------------------
  {
    id: 'anaphylaxis_crisis',
    title: 'Anafilaxia Intraoperatoria Severa (Grado III / IV)',
    shortTitle: 'Anafilaxia Quirúrgica',
    subtitle: 'Colapso Cardiovascular & Broncoespasmo de Origen Inmunológico',
    category: 'inmunologico',
    severity: 'extrema',
    triggerSigns: [
      'Hipotensión súbita e inexplicable, colapso circulatorio o taquicardia extrema tras inducir o infundir antibióticos',
      'Broncoespasmo agudo intratable (presiones inspiratorias pico elevadas >40 cmH2O)',
      'Pérdida súbita de la curva capnográfica (disminución drástica de EtCO2 por falta de gasto cardíaco)',
      'Eritema, rash cutáneo generalizado, angioedema (ATENCIÓN: pueden NO estar presentes en el colapso masivo)'
    ],
    immediateAction: '¡SUSPENDER DE INMEDIATO LA INFUSIÓN SOSPECHOSA (antibióticos, coloides, BNM, látex)! ADRENALINA IV INMEDIATA.',
    lethalErrors: [
      'NO esperar a que aparezca erupción cutánea para diagnosticar y tratar con adrenalina (los signos cutáneos faltan en el 30-40% de los casos graves en quirófano).',
      'NO usar corticoides ni antihistamínicos como terapia de primera línea (tardan horas en actuar).',
      'NO subdosificar líquidos cristaloides (se requiere expansión de volumen agresiva masiva).'
    ],
    drugs: [
      {
        name: 'Adrenalina IV en Bolos Titulados (Colapso Grado III)',
        indication: 'Vasoconstricción alfa-1, inotropismo beta-1 y broncodilatación beta-2 con estabilización de mastocitos',
        concentrationText: 'Dilución 1:10.000 (100 µg/mL) o dilución 10 µg/mL',
        calculateDose: (w) => {
          const minMcg = Math.round(w * 1.0);
          const maxMcg = Math.min(200, Math.round(w * 3.0));
          return {
            doseText: `1 - 3 µg/kg IV = ${minMcg} - ${maxMcg} µg`,
            volumeText: `Bolos de ${minMcg} a ${maxMcg} µg IV cada 2-3 min`,
            instructions: 'En paro o colapso profundo (Grado IV): administrar 1 mg IV directo (o 10 µg/kg en pediatría) según algoritmo de PCR.',
            highlight: true
          };
        }
      },
      {
        name: 'Carga Rápida de Cristaloides Balanceados',
        indication: 'Compensar la extravasación masiva y vasodilatación sistémica',
        concentrationText: 'Plasmalyte / Ringer Lactato caliente',
        calculateDose: (w) => {
          const ml = Math.round(w * 25);
          return {
            doseText: `20 - 30 mL/kg = ${ml} mL`,
            volumeText: `Infusión presurizada de ${ml} mL a chorro`,
            instructions: 'El shock distributivo puede secuestrar hasta el 40% del volumen intravascular en 10 minutos.'
          };
        }
      },
      {
        name: 'Adrenalina en Infusión Continua de Mantenimiento',
        indication: 'Estabilización hemodinámica continua post-bolos iniciales',
        concentrationText: '4 mg en 250 mL D5% o SSN (16 µg/mL)',
        calculateDose: (w) => {
          const rateMcgMin = Number((w * 0.1).toFixed(1));
          return {
            doseText: `0.05 - 0.2 µg/kg/min (${rateMcgMin} µg/min inicial)`,
            volumeText: `Titular según presión arterial media PAM > 65 mmHg`,
            instructions: 'Montar rápidamente en bomba de infusión por línea venosa segura.'
          };
        }
      },
      {
        name: 'Hidrocortisona IV (Terapia Secundaria)',
        indication: 'Prevención de respuesta bifásica tardía (2 a 8 horas post-evento)',
        concentrationText: 'Vial 100 mg o 500 mg',
        calculateDose: (w) => {
          const doseMg = Math.min(200, Math.round(w * 3.0));
          return {
            doseText: `2 - 4 mg/kg (Máx 200 mg) = ${doseMg} mg`,
            volumeText: `${doseMg} mg IV directo`,
            instructions: 'Fármaco secundario; nunca sustituye a la adrenalina.'
          };
        }
      },
      {
        name: 'Difenhidramina / Clorfeniramina (Antihistamínico H1)',
        indication: 'Bloqueo de receptores H1 de histamina',
        concentrationText: 'Ampolla 50 mg / 1 mL o 10 mg / 1 mL',
        calculateDose: (w) => {
          const doseMg = Math.min(50, Math.round(w * 0.7));
          return {
            doseText: `0.5 - 1 mg/kg (Máx 50 mg) = ${doseMg} mg`,
            volumeText: `${doseMg} mg IV lento`,
            instructions: 'Puede causar somnolencia o hipotensión si se inyecta en bolo rápido.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'ana-1',
        order: 1,
        phase: 'inmediato',
        title: 'Suspender Inmediatamente el Desencadenante',
        description: 'Detener antibióticos, coloides, relajantes o derivados hemáticos. Mantener vía permeable con infusión de cristaloides limpios.',
        isCrucial: true,
        tag: 'PASO 1'
      },
      {
        id: 'ana-2',
        order: 2,
        phase: 'inmediato',
        title: 'Adrenalina IV Temprana & Flujo Alto O2',
        description: 'Bolos IV de Adrenalina 1-3 µg/kg (o 100-200 µg en adultos) titulados cada 1-2 min. Aumentar FiO2 al 100%. Elevar miembros inferiores.',
        isCrucial: true,
        tag: 'ADRENALINA'
      },
      {
        id: 'ana-3',
        order: 3,
        phase: 'soporte',
        title: 'Resucitación Agresiva con Volumen',
        description: 'Pasar 20-30 mL/kg de Ringer Lactato / Plasmalyte a presión. Abrir dos vías periféricas de grueso calibre (14G o 16G).',
        isCrucial: true
      },
      {
        id: 'ana-4',
        order: 4,
        phase: 'avanzado',
        title: 'Muestras de Triptasa Sérica',
        description: 'Tomar tubo seco sin anticoagulante para triptasa sérica en 3 momentos clave: 1) Dentro de las 2 horas del evento, 2) A las 4-6 horas, 3) Control a las 24 horas.',
        isCrucial: false,
        tag: 'TRIPTASA'
      }
    ],
    cognitivePearls: [
      'Los tres agentes más frecuentes de anafilaxia perioperatoria: 1) Relajantes neuromusculares (60%), 2) Antibióticos betalactámicos (20%), 3) Látex / Clorhexidina.',
      'Si el paciente toma betabloqueantes y la adrenalina no responde: administrar GLUCAGÓN (1 a 5 mg IV en 5 min) que activa la adenilato ciclasa independientemente de los receptores beta.'
    ]
  },

  // -------------------------------------------------------------
  // 5. LARINGOESPASMO & BRONCOESPASMO SEVERO
  // -------------------------------------------------------------
  {
    id: 'laryngo_bronchospasm',
    title: 'Laringoespasmo & Broncoespasmo Severo',
    shortTitle: 'Laringo / Broncoespasmo',
    subtitle: 'Crisis Obstructiva de Vía Aérea Superior e Inferior',
    category: 'respiratorio',
    severity: 'alta',
    triggerSigns: [
      'Laringoespasmo: Estridor inspiratorio agudo, disociación toracoabdominal ("bamboleo"), silencio respiratorio completo con imposibilidad de ventilar',
      'Broncoespasmo: Espiración prolongada, sibilancias audibles, presiones pico > 45 cmH2O, capnograma con forma de "aleta de tiburón"',
      'Desaturación rápida y bradicardia refleja vagal en pediatría'
    ],
    immediateAction: '¡RETIRAR ESTÍMULOS DE VÍA AÉREA! O2 al 100% con CPAP hermético continuo y Maniobra de Larson.',
    lethalErrors: [
      'NO forzar la ventilación con presiones extremas sin CPAP coordinado (causa insuflación gástrica masiva y broncoaspiración).',
      'NO demorar la administración de Succinilcolina a bajas dosis si la desaturación continúa.',
      'NO olvidar que el laringoespasmo puede causar Edema Pulmonar por Presión Negativa (EPPN) post-resolución.'
    ],
    drugs: [
      {
        name: 'Propofol a Bajas Dosis (Laringoespasmo Parcial)',
        indication: 'Profundización anestésica rápida sin parálisis completa',
        concentrationText: 'Emulsión 1% (10 mg/mL)',
        calculateDose: (w) => {
          const doseMg = Math.round(w * 0.5);
          const doseMl = Number((doseMg / 10).toFixed(1));
          return {
            doseText: `0.5 mg/kg = ${doseMg} mg IV`,
            volumeText: `${doseMl} mL IV en bolo rápido`,
            instructions: 'Eficaz en el 80% de los laringoespasmos parciales durante la inducción o emersión.'
          };
        }
      },
      {
        name: 'Succinilcolina Rescate (Laringoespasmo Total)',
        indication: 'Relajación completa de los músculos laríngeos intrínsecos',
        concentrationText: 'Ampolla 100 mg / 2 mL (50 mg/mL) diluida a 10 mg/mL',
        calculateDose: (w) => {
          const ivMg = Number((w * 0.5).toFixed(1));
          const imMg = Math.round(w * 4.0);
          return {
            doseText: `IV: 0.5 mg/kg = ${ivMg} mg | IM: 4 mg/kg = ${imMg} mg`,
            volumeText: `IV: ${ivMg} mg (o IM profunda ${imMg} mg si no hay vía)`,
            instructions: 'En niños < 1 año co-administrar Atropina 0.02 mg/kg para prevenir bradicardia refleja extrema.',
            highlight: true
          };
        }
      },
      {
        name: 'Sulfato de Magnesio (Broncoespasmo Refractario)',
        indication: 'Broncodilatación directa por bloqueo del influjo de calcio en el músculo liso bronquial',
        concentrationText: 'Ampolla al 10% o 20% o 50%',
        calculateDose: (w) => {
          const doseMg = Math.min(2000, Math.round(w * 40));
          return {
            doseText: `40 - 50 mg/kg (Máx 2 g) = ${doseMg} mg`,
            volumeText: `Diluir en 100 mL de SSN y pasar en 15-20 minutos`,
            instructions: 'Excelente coadyuvante en broncoespasmo perioperatorio severo resistente a salbutamol.'
          };
        }
      },
      {
        name: 'Salbutamol Puff Inhalado por Tubo Endotraqueal',
        indication: 'Agonista beta-2 directo sobre el árbol bronquial',
        concentrationText: 'Inhalador 100 µg por puff',
        calculateDose: () => {
          return {
            doseText: `6 a 10 puffs directamente en el circuito`,
            volumeText: `Accionar con adaptador en línea durante la fase inspiratoria`,
            instructions: 'Permitir tiempo espiratorio suficiente para evitar atrapamiento aéreo (Auto-PEEP).'
          };
        }
      }
    ],
    steps: [
      {
        id: 'laryngo-1',
        order: 1,
        phase: 'inmediato',
        title: 'Maniobra de Larson (Presión Retroauricular)',
        description: 'Aplicar presión firme bilateral en la muesca de Larson (entre la apófisis mastoides y el ángulo de la mandíbula hacia adelante y adentro). Causa dolor profundo que rompe el reflejo.',
        isCrucial: true,
        tag: 'LARSON'
      },
      {
        id: 'laryngo-2',
        order: 2,
        phase: 'inmediato',
        title: 'CPAP 100% Hermético & Aspiración Suave',
        description: 'Cerrar válvula APL a 20-30 cmH2O con sellado bimanual perfecto. Aspirar suavemente secreciones o sangre que contacten las cuerdas vocales.',
        isCrucial: true
      },
      {
        id: 'laryngo-3',
        order: 3,
        phase: 'soporte',
        title: 'Profundizar con Propofol o Succinilcolina',
        description: 'Si persiste > 15-20 segundos o desatura: Propofol 0.5 mg/kg o Succinilcolina 0.5 mg/kg IV. Si se perdió la vía venosa: Succinilcolina 4 mg/kg IM.',
        isCrucial: true
      },
      {
        id: 'laryngo-4',
        order: 4,
        phase: 'avanzado',
        title: 'Broncoespasmo: Aumentar Sevoflurano & Bajar FR',
        description: 'El sevoflurano es un potente broncodilatador. Aumentar concentración alveolar. Prolongar el tiempo espiratorio (Relación I:E 1:3 o 1:4) para evitar barotrauma.',
        isCrucial: false
      }
    ],
    cognitivePearls: [
      'El Edema Pulmonar por Presión Negativa (EPPN) ocurre cuando el paciente genera presiones inspiratorias intratorácicas de hasta -100 cmH2O contra la glotis cerrada.',
      'Si tras revertir el espasmo aparece esputo asalmonado o caída de la saturación, aplicar PEEP y considerar diuréticos/oxígeno suplementario.'
    ]
  },

  // -------------------------------------------------------------
  // 6. PARO CARDÍACO INTRAOPERATORIO (ACLS QUIRÚRGICO)
  // -------------------------------------------------------------
  {
    id: 'intraoperative_arrest',
    title: 'Paro Cardíaco Intraoperatorio (ACLS en Quirófano)',
    shortTitle: 'Paro Cardíaco (ACLS)',
    subtitle: 'Reanimación Adaptada a Quirófano & Diagnóstico Diferencial de 5H y 5T',
    category: 'hemodinamico',
    severity: 'extrema',
    triggerSigns: [
      'Pérdida de onda de pulso en pulsioxímetro y línea arterial',
      'Caída precipitada y mantenida del EtCO2 (< 10 mmHg)',
      'Asistolia, Fibrilación Ventricular, Taquicardia Ventricular sin pulso o Actividad Eléctrica sin Pulso (AESP)'
    ],
    immediateAction: '¡CERRAR ANESTÉSICOS! ¡COMPRESIONES DE ALTA CALIDAD! Iniciar cronómetro de reanimación y pedir carro de paro.',
    lethalErrors: [
      'NO olvidar apagar los vaporizadores halogenados y bombas de TIVA/propofol.',
      'NO interrumpir compresiones torácicas salvo para verificar ritmo o desfibrilar.',
      'NO hiperventilar (limitar a 8-10 ventilaciones por minuto sin interrumpir masaje con tubo).'
    ],
    drugs: [
      {
        name: 'Adrenalina IV/IO (Paro Cardíaco)',
        indication: 'Vasoconstricción periférica y aumento de presión de perfusión coronaria/cerebral',
        concentrationText: 'Ampolla 1 mg/mL (1:1.000) o jeringa precargada 1:10.000',
        calculateDose: (w) => {
          const isPediatric = w < 40;
          const doseMg = isPediatric ? Number((w * 0.01).toFixed(2)) : 1.0;
          const doseMl10k = isPediatric ? Number((w * 0.1).toFixed(1)) : 10;
          return {
            doseText: isPediatric ? `10 µg/kg = ${doseMg} mg` : `1 mg IV en bolo`,
            volumeText: `${doseMl10k} mL de solución 1:10.000 cada 3 a 5 minutos`,
            instructions: 'Seguir inmediatamente de un bolo ("flush") de 20 mL de solución salina y elevación de la extremidad.',
            highlight: true
          };
        }
      },
      {
        name: 'Amiodarona IV (Ritmos Desfibrilables FV / TVSP)',
        indication: 'Antiarrítmico de elección tras 3ª descarga no exitosa',
        concentrationText: 'Ampolla 150 mg / 3 mL',
        calculateDose: (w) => {
          const isPediatric = w < 40;
          const doseMg = isPediatric ? Math.round(w * 5) : 300;
          return {
            doseText: isPediatric ? `5 mg/kg = ${doseMg} mg` : `300 mg IV en bolo inicial`,
            volumeText: isPediatric ? `${doseMg} mg diluido en D5%` : `2 ampollas (300 mg) en bolo rápido`,
            instructions: 'Segunda dosis: 150 mg IV (o 5 mg/kg en niños) tras la 5ª descarga si persiste FV/TV.'
          };
        }
      },
      {
        name: 'Desfibrilación Eléctrica Bifásica',
        indication: 'Choque sincronizado para Fibrilación Ventricular o Taquicardia Ventricular sin pulso',
        concentrationText: 'Desfibrilador bifásico / Parches autoadhesivos',
        calculateDose: (w) => {
          const isPediatric = w < 40;
          const jInitial = isPediatric ? Math.round(w * 2) : 200;
          const jSubsequent = isPediatric ? Math.round(w * 4) : 360;
          return {
            doseText: isPediatric ? `1ª: ${jInitial} J (2 J/kg) ➔ 2ª: ${jSubsequent} J (4 J/kg)` : `120 - 200 Joules bifásico`,
            volumeText: `Descarga única seguida de 2 minutos continuos de RCP`,
            instructions: 'Reanudar compresiones inmediatamente tras la descarga sin pausar a buscar pulso.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'arrest-1',
        order: 1,
        phase: 'inmediato',
        title: 'Cerrar Todos los Agentes Anestésicos',
        description: 'Vaporizadores a cero, apagar bombas de TIVA/sedación. FiO2 al 100% con flujos altos (>10 L/min). Comunicar de inmediato a cirujano para control de hemostasia.',
        isCrucial: true,
        tag: 'MINUTO 0'
      },
      {
        id: 'arrest-2',
        order: 2,
        phase: 'inmediato',
        title: 'Compresiones Torácicas de Alta Calidad',
        description: '100 a 120 compresiones por minuto. Profundidad 5-6 cm permitiendo reexpansión torácica completa. Cambiar de reanimador cada 2 minutos.',
        isCrucial: true,
        tag: 'COMPRESIONES'
      },
      {
        id: 'arrest-3',
        order: 3,
        phase: 'soporte',
        title: 'Monitoreo de EtCO2 durante RCP',
        description: 'El EtCO2 refleja directamente el gasto cardíaco durante las compresiones. Mantener EtCO2 > 15-20 mmHg (si es < 10 mmHg, optimizar masaje). Un aumento súbito a > 35-40 mmHg indica Retorno de la Circulación Espontánea (ROSC).',
        isCrucial: true
      },
      {
        id: 'arrest-4',
        order: 4,
        phase: 'avanzado',
        title: 'Checklist Quirúrgico de Causas Reversibles (5H y 5T)',
        description: '1. Hipovolemia (sangrado masivo no visto) 2. Hipoxia (extubación o tapón mucoso) 3. Hidrogeniones (acidosis) 4. Hipo/Hipercalemia 5. Hipotermia | 6. Neumotórax a tensión (descompresión con aguja) 7. Taponamiento cardíaco 8. Tóxicos (LAST) 9. Trombosis coronaria 10. Tromboembolismo pulmonar / Aéreo.',
        isCrucial: true,
        tag: '5H y 5T'
      }
    ],
    cognitivePearls: [
      'En laparoscopia: Si ocurre bradicardia extrema o colapso súbito al insuflar el neumoperitoneo, ¡DESINSUFLAR EL ABDOMEN DE INMEDIATO! (reflejo vagal por distensión peritoneal o embolia gaseosa masiva).',
      'En cesárea: Desplazar el útero manualmente hacia la izquierda para descomprimir la vena cava inferior.'
    ]
  },

  // -------------------------------------------------------------
  // 7. CÓDIGO ROJO QUIRÚRGICO (HEMORRAGIA MASIVA)
  // -------------------------------------------------------------
  {
    id: 'massive_hemorrhage',
    title: 'Hemorragia Masiva & Código Rojo Quirúrgico',
    shortTitle: 'Hemorragia Masiva',
    subtitle: 'Protocolo de Transfusión Masiva (PTM 1:1:1) & Manejo de Coagulopatía',
    category: 'hemodinamico',
    severity: 'extrema',
    triggerSigns: [
      'Pérdida estimada > 50% de la volemia en menos de 3 horas o sangrado activo > 150 mL/min',
      'Hipotensión refractaria a volumen, taquicardia extrema o signos de hipoperfusión tisular',
      'Sangrado en napa en el lecho quirúrgico (coagulopatía de consumo establecida)'
    ],
    immediateAction: '¡ACTIVAR PROTOCOLO DE TRANSFUSIÓN MASIVA (PTM)! Pedir Paquete 1 de emergencia al Banco de Sangre.',
    lethalErrors: [
      'NO infundir grandes volúmenes de cristaloides fríos (empeoran la tríada de la muerte: hipotermia, acidosis y coagulopatía).',
      'NO retrasar la administración de Ácido Tranexámico (su beneficio máximo es en las primeras 3 horas).',
      'NO transfundir glóbulos rojos aislados sin plasma y plaquetas (relación 1:1:1).'
    ],
    drugs: [
      {
        name: 'Ácido Tranexámico (TXA)',
        indication: 'Inhibición competitiva de la fibrinólisis y preservación del coágulo',
        concentrationText: 'Ampolla 1 g / 10 mL (100 mg/mL)',
        calculateDose: (w) => {
          const doseMg = Math.min(1000, Math.round(w * 15));
          return {
            doseText: `15 - 20 mg/kg (Máx 1 g) = ${doseMg} mg`,
            volumeText: `1 g en 100 mL de SSN en 10 minutos`,
            instructions: 'Seguido de infusión de mantenimiento de 1 g en 8 horas (o 1 mg/kg/h). Administrar lo antes posible (<3 horas).',
            highlight: true
          };
        }
      },
      {
        name: 'Cloruro o Gluconato de Calcio',
        indication: 'Prevención de hipocalcemia severa por quelación de citrato en hemoderivados',
        concentrationText: 'Ampolla 10% (1 g / 10 mL)',
        calculateDose: () => {
          return {
            doseText: `1 g IV lento por cada 4 unidades de hemoderivados`,
            volumeText: `10 mL IV diluidos`,
            instructions: 'Mantener Calcio iónico > 1.1 - 1.3 mmol/L para asegurar la contractilidad y la cascada de coagulación.'
          };
        }
      },
      {
        name: 'Concentrado de Complejo Protrombínico (CCP) / Fibrinógeno',
        indication: 'Corrección rápida de factores de coagulación dependientes de Vitamina K',
        concentrationText: 'Vial de Fibrinógeno 1-2 g o CCP 500 UI',
        calculateDose: (w) => {
          const doseFibG = Math.round(w * 0.04);
          return {
            doseText: `Concentrado de Fibrinógeno 30-50 mg/kg = ~${doseFibG} g`,
            volumeText: `O Criotrecipitados: 1 unidad por cada 10 kg de peso`,
            instructions: 'Meta terapéutica: Fibrinógeno plasmático > 150-200 mg/dL.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'hem-1',
        order: 1,
        phase: 'inmediato',
        title: 'Activar Código Rojo / Transfusión Masiva',
        description: 'Solicitar paquete 1: 4 Concentrados de Hematíes (O negativo / sin cruzar si es extremo), 4 Plasmas Frescos Congelados y 1 dosis de Plaquetas (o aféresis).',
        isCrucial: true,
        tag: 'CÓDIGO ROJO'
      },
      {
        id: 'hem-2',
        order: 2,
        phase: 'inmediato',
        title: 'Ácido Tranexámico 1 g IV Precoz',
        description: 'Administrar 1 g IV en bolo en 10 min. Reduce mortalidad y requerimientos transfusionales en shock hemorrágico.',
        isCrucial: true,
        tag: 'TXA'
      },
      {
        id: 'hem-3',
        order: 3,
        phase: 'soporte',
        title: 'Calentador Rápido de Fluidos (Rapid Infuser)',
        description: 'Montar sistema de infusión rápida con calentamiento activo a 37-41°C. Evitar la hipotermia a toda costa (la función plaquetaria se inhibe por debajo de 35°C).',
        isCrucial: true
      },
      {
        id: 'hem-4',
        order: 4,
        phase: 'avanzado',
        title: 'Objetivos Fisiológicos de Reanimación con Control de Daños',
        description: 'Hipotensión permisiva mientras no haya hemostasia quirúrgica definitiva (PAS 80-90 mmHg, PAM 55-65 mmHg). Calcio iónico > 1.1 mmol/L. Temperatura > 36°C. pH > 7.25. Lactato < 3 mmol/L.',
        isCrucial: true
      }
    ],
    cognitivePearls: [
      'La "Tríada de la Muerte": Acidosis + Hipotermia + Coagulopatía forman un círculo vicioso autosostenido. Calentar al paciente activamente desde el primer minuto.',
      'El uso temprano de Tromboelastometría Rotacional (ROTEM / TEG) permite terapia dirigida por metas reduciendo hasta 50% de las transfusiones innecesarias.'
    ]
  },

  // -------------------------------------------------------------
  // 8. ANESTESIA ESPINAL TOTAL O MASIVA
  // -------------------------------------------------------------
  {
    id: 'total_spinal_anesthesia',
    title: 'Anestesia Espinal Total o Masiva',
    shortTitle: 'Espinal Total / Masiva',
    subtitle: 'Bloqueo Neuroaxial Alto Inadvertido, Apnea y Colapso Simpático Agudo',
    category: 'neuroaxial',
    severity: 'extrema',
    badge: 'NEUROAXIAL CRÍTICO',
    quickSummary: 'Pérdida rápida de fonación, apnea diafragmática (C3-C5), bradicardia extrema y shock vasopléjico',
    triggerSigns: [
      'Incapacidad súbita para hablar, disfonía o susurro (afectación laríngea temprana)',
      'Sensación súbita de disnea, angustia extrema y paro respiratorio por parálisis frénica (C3-C5)',
      'Hipotensión arterial severa y fulminante por denervación simpática total (T1-L2)',
      'Bradicardia extrema (< 40 lpm) o asistolia por bloqueo de cardioaceleradores torácicos (T1-T4)',
      'Midriasis bilateral, pérdida de reflejos protectores de vía aérea e inconsciencia',
      'Antecedente de punción subaracnoidea reciente, intento epidural con inyección accidental o sobredosis de AL'
    ],
    immediateAction: '¡PEDIR AYUDA A VIVA VOZ! Suspender de inmediato anestésicos volátiles o sedantes. Oxigenación al 100% y soporte de vía aérea (intubación traqueal o ventilación con bolsa-válvula). Expansión agresiva de volumen y soporte vasopresor urgente.',
    lethalErrors: [
      'NO asumir que la somnolencia es "sedación normal": el retraso en intubación causa daño anóxico cerebral irreversible.',
      'NO colocar al paciente en Trendelenburg forzado o extremo: comprime el diafragma, agrava la hipoxia y favorece broncoaspiración.',
      'NO esperar que los líquidos solos resuelvan la hipotensión: la vasodilatación venosa y arterial es masiva y requiere vasopresores inmediatos.',
      'NO usar Efedrina como único fármaco si hay bradicardia extrema progresiva: pasar precozmente a Adrenalina en bolos titulados.'
    ],
    drugs: [
      {
        name: 'Adrenalina (Epinefrina) en Microbolos Titulados',
        indication: 'Hipotensión severa refractaria, bradicardia extrema o colapso circulatorio inminente',
        concentrationText: 'Dilución 1:100.000 (10 mcg/mL: 1 mg en 100 mL SF o 1 ampolla en 10 mL y tomar 1 mL diluido en 9 mL SF)',
        calculateDose: (w) => {
          const doseMcg = Math.min(20, Math.max(10, Math.round(w * 0.2)));
          const volumeMl = (doseMcg / 10).toFixed(1);
          return {
            doseText: `${doseMcg} mcg IV (${volumeMl} mL de solución 10 mcg/mL)`,
            volumeText: `${volumeMl} mL IV en bolo rápido`,
            instructions: 'Administrar cada 1-2 minutos titulando respuesta hasta obtener PAM > 65 mmHg y FC > 60 lpm. Si entra en paro cardiorrespiratorio, pasar a dosis de 1 mg IV en bolo.',
            highlight: true
          };
        }
      },
      {
        name: 'Atropina Sulfato',
        indication: 'Bradicardia extrema (< 45-50 lpm) por bloqueo de cardioaceleradores simpáticos T1-T4',
        concentrationText: 'Ampolla 1 mg / 1 mL (o 0.5 mg / 1 mL)',
        calculateDose: (w) => {
          const doseMg = w < 40 ? Number((w * 0.02).toFixed(2)) : 0.5;
          return {
            doseText: `${doseMg} mg IV en bolo rápido`,
            volumeText: `${doseMg} mL (de ampolla 1 mg/mL)`,
            instructions: 'Repetir a los 3-5 minutos si persiste bradicardia sintomática (máximo 2-3 mg en adultos). Si no responde, escalar a Adrenalina.',
            highlight: true
          };
        }
      },
      {
        name: 'Efedrina Sulfato',
        indication: 'Hipotensión moderada con frecuencia cardíaca conservada o límite',
        concentrationText: 'Ampolla diluida a 5-10 mg/mL',
        calculateDose: (w) => {
          const doseMg = w < 40 ? Math.round(w * 0.15) : 10;
          return {
            doseText: `${doseMg} mg IV en bolo`,
            volumeText: `${doseMg / 5} mL (dilución 5 mg/mL)`,
            instructions: 'Efecto alfa y beta estimulante. Repetir cada 3-5 minutos según respuesta tensional.'
          };
        }
      },
      {
        name: 'Fenilefrina',
        indication: 'Vasoconstricción arterial pura si no coexiste bradicardia marcada (o si FC > 70 lpm)',
        concentrationText: 'Dilución 100 mcg/mL (1 ampolla de 10 mg en 100 mL SF)',
        calculateDose: (w) => {
          const doseMcg = Math.min(100, Math.max(50, Math.round(w * 1.0)));
          return {
            doseText: `${doseMcg} mcg IV en bolo`,
            volumeText: `${(doseMcg / 100).toFixed(1)} mL (solución 100 mcg/mL)`,
            instructions: 'Potente vasopresor alfa-1. Evitar si hay bradicardia severa ya que produce bradicardia refleja adicional.'
          };
        }
      },
      {
        name: 'Cristaloides Balanceados Tibios (Bolo Rápido)',
        indication: 'Restauración urgente de la volemia eficaz por venodilatación masiva',
        concentrationText: 'Ringer Lactato o Solución Fisiológica 0.9% tibia',
        calculateDose: (w) => {
          const volMl = Math.min(1500, Math.max(500, Math.round(w * 15)));
          return {
            doseText: `10-15 mL/kg = ~${volMl} mL a chorro presurizado`,
            volumeText: `${volMl} mL en 10-15 minutos`,
            instructions: 'Infusión rápida presurizada para llenar el reservorio venoso masivamente desinervado.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'spin-1',
        order: 1,
        phase: 'inmediato',
        title: 'Oxigenación y Vía Aérea Inmediata',
        description: 'Ventilar con mascarilla facial al 100% O2 a presión positiva. Proceder a intubación orotraqueal reglamentaria con tubo con manguito sin dilación.',
        isCrucial: true,
        tag: 'VÍA AÉREA'
      },
      {
        id: 'spin-2',
        order: 2,
        phase: 'inmediato',
        title: 'Cese de Anestésicos y Posicionamiento',
        description: 'Cerrar vaporizadores inhalatorios. Posición en decúbito supino neutro con miembros inferiores elevados. NO colocar Trendelenburg pronunciado.',
        isCrucial: true,
        tag: 'POSICIÓN'
      },
      {
        id: 'spin-3',
        order: 3,
        phase: 'soporte',
        title: 'Rescate Hemodinámico Agresivo',
        description: 'Administrar Atropina 0.5-1 mg si FC < 50 lpm y Adrenalina en microbolos de 10-20 mcg si PAM < 55 mmHg. Infundir bolo de cristaloides a chorro.',
        isCrucial: true,
        tag: 'VASOPRESORES'
      },
      {
        id: 'spin-4',
        order: 4,
        phase: 'avanzado',
        title: 'Mantenimiento Hipnótico Ligero si hay Conciencia',
        description: 'Una vez asegurada la vía aérea y la estabilidad hemodinámica, titular bolos mínimos de midazolam o propofol solo si el paciente está consciente pero paralizado, para evitar recuerdos traumáticos mientras el bloqueo motor cede (típicamente 60-120 min).',
        isCrucial: false
      }
    ],
    cognitivePearls: [
      'La capacidad de hablar evalúa la musculatura laríngea inervada por los nervios recurrentes: si el paciente no puede emitir sonido tras una punción espinal, la apnea es inminente.',
      'El bloqueo de las fibras cardioaceleradoras T1-T4 deja al corazón bajo tono vagal puro, produciendo bradicardia extrema que puede transformarse rápidamente en asistolia.'
    ]
  },

  // -------------------------------------------------------------
  // 9. ARRITMIAS INTRAOPERATORIAS GRAVES
  // -------------------------------------------------------------
  {
    id: 'intraoperative_arrhythmias',
    title: 'Arritmias Intraoperatorias Graves',
    shortTitle: 'Arritmias Intraoperatorias',
    subtitle: 'Taquiarritmias Inestables, FA Rápida, TV y Bradiarritmias Perioperatorias',
    category: 'cardiovascular',
    severity: 'extrema',
    badge: 'ARRITMIAS & RITMOS',
    quickSummary: 'Diferenciación inmediata: estabilidad hemodinámica, QRS ancho vs estrecho, cardioversión sincronizada',
    triggerSigns: [
      'Taquicardia ventricular sostenida (monomorfa o polimorfa / Torsades) o FV en monitor',
      'Fibrilación auricular o Flutter con respuesta ventricular rápida (> 150 lpm) acompañada de hipotensión o isquemia',
      'Taquicardia de complejos anchos con descompensación hemodinámica súbita',
      'Bradicardia extrema (< 35 lpm), ritmo nodal de escape, bloqueo AV de alto grado o paro sinusal',
      'Pérdida de la onda de pulsioximetría o curva arterial colapsada coincidente con la arritmia'
    ],
    immediateAction: '¡VERIFICAR PULSO Y ESTABILIDAD HEMODINÁMICA! Si NO HAY PULSO: Iniciar RCP y protocolo de Paro. Si HAY PULSO pero INESTABILIDAD (hipotensión, colapso): PREPARAR CARDIOVERSIÓN ELÉCTRICA SINCRONIZADA INMEDIATA (o marcapasos si es bradicardia).',
    lethalErrors: [
      'NO administrar bloqueadores de canales de calcio (Verapamilo/Diltiazem) en taquicardias de QRS ancho: causa colapso letal y fibrilación ventricular.',
      'NO demorar la cardioversión eléctrica en arritmias rápidas inestables intentando tratamientos farmacológicos.',
      'NO olvidar activar el botón "SYNC" al cardiovertir taquicardias con pulso para no inducir fibrilación ventricular.',
      'NO pasar por alto estímulos reflejos quirúrgicos (tracción peritoneal, reflejo oculocardíaco, insuflación de neumoperitoneo) como causa de bradicardia/asistolia.'
    ],
    drugs: [
      {
        name: 'Amiodarona (Cordarone)',
        indication: 'Taquiarritmias ventriculares estables, TV monomorfa o FA rápida refractaria (y 300 mg en paro por FV/TVSP)',
        concentrationText: 'Ampolla 150 mg / 3 mL',
        calculateDose: (w) => {
          return {
            doseText: '150 mg IV diluidos en 100 mL SG5% en 10 minutos',
            volumeText: '100 mL de solución glucosada al 5%',
            instructions: 'Infusión en 10-15 minutos. Si recurre arritmia, se puede repetir 150 mg. En caso de Paro Cardíaco sin pulso por FV/TVSP: 300 mg en bolo IV rápido directo.',
            highlight: true
          };
        }
      },
      {
        name: 'Adenosina',
        indication: 'Taquicardia Supraventricular Paroxística (TSVP) de complejo estrecho regular',
        concentrationText: 'Ampolla 6 mg / 2 mL',
        calculateDose: (w) => {
          return {
            doseText: 'Primer bolo: 6 mg IV rápido. Segundo bolo: 12 mg IV.',
            volumeText: '2 mL (primer bolo) + 20 mL SF flush',
            instructions: 'Inyección ultra-rápida (1-2 segundos) en vena proximal seguida inmediatamente de bolo de 20 mL de suero fisiológico y elevación de la extremidad. Monitoreo ECG continuo.',
            highlight: true
          };
        }
      },
      {
        name: 'Sulfato de Magnesio al 10% - 50%',
        indication: 'Torsades de Pointes (TV Polimorfa) o sospecha de hipomagnesemia / QT largo',
        concentrationText: 'Ampollas al 10% (1 g / 10 mL) o al 50%',
        calculateDose: (w) => {
          return {
            doseText: '1 - 2 gramos IV diluidos en 50-100 mL SG5%',
            volumeText: '50-100 mL a pasar en 5-10 minutos',
            instructions: 'De elección indiscutible en Torsades de Pointes. Continuar infusión de mantenimiento a 0.5-1 g/hora si es necesario.'
          };
        }
      },
      {
        name: 'Atropina Sulfato',
        indication: 'Bradicardia sinusal refleja o bloqueo nodal con repercusión hemodinámica',
        concentrationText: 'Ampolla 1 mg / 1 mL',
        calculateDose: (w) => {
          return {
            doseText: '0.5 - 1.0 mg IV en bolo rápido',
            volumeText: '0.5 - 1.0 mL IV',
            instructions: 'Repetir cada 3-5 minutos según respuesta (dosis total máxima 3 mg). Si fracasa, iniciar infusión de Adrenalina o marcapasos.'
          };
        }
      },
      {
        name: 'Esmolol (Brevibloc)',
        indication: 'Control rápido de frecuencia en FA/Flutter o taquicardia sinusal severa en normovolemia',
        concentrationText: 'Viales 100 mg / 10 mL (10 mg/mL)',
        calculateDose: (w) => {
          const doseMcgKg = 500;
          const totalMg = Math.round((w * doseMcgKg) / 1000);
          return {
            doseText: `Bolo inicial 500 mcg/kg = ${totalMg} mg IV en 1 minuto`,
            volumeText: `${(totalMg / 10).toFixed(1)} mL (solución 10 mg/mL)`,
            instructions: 'Betabloqueante de vida media ultracorta (~9 min). Seguir con infusión de 50-200 mcg/kg/min si hay respuesta favorable.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'arr-1',
        order: 1,
        phase: 'inmediato',
        title: 'Verificar Pulso, Ritmo y Descartar Artefactos',
        description: 'Palpar pulso central (carotídeo o femoral) y contrastar monitor con curva de línea arterial o pulsioximetría para descartar interferencia electroquirúrgica.',
        isCrucial: true,
        tag: 'PULSO'
      },
      {
        id: 'arr-2',
        order: 2,
        phase: 'inmediato',
        title: 'Suspender Estímulo Quirúrgico y Oxigenar',
        description: 'Alertar al cirujano para pausar tracción mesentérica o peritoneal, manipulación de globo ocular o desinsuflar laparoscopia. Subir FiO2 al 100% y verificar ventilación.',
        isCrucial: true,
        tag: 'ESTÍMULO'
      },
      {
        id: 'arr-3',
        order: 3,
        phase: 'soporte',
        title: 'Cardioversión Eléctrica si Taquiarritmia Inestable',
        description: 'Si hay hipotensión severa, shock o dolor torácico isquémico: Sincronizar desfibrilador (SYNC). Fibrilación Auricular: 120-200 J bifásica. TV Monomorfa: 100 J bifásica.',
        isCrucial: true,
        tag: 'CARDIOVERSIÓN'
      },
      {
        id: 'arr-4',
        order: 4,
        phase: 'avanzado',
        title: 'Manejo Farmacológico Dirigido si es Estable',
        description: 'Complejo estrecho regular: Maniobras vagales / Adenosina. Complejo ancho monomorfo: Amiodarona 150 mg. Bradiarritmia: Atropina o marcapasos transcutáneo.',
        isCrucial: false
      }
    ],
    cognitivePearls: [
      'Toda taquicardia de complejos QRS anchos debe considerarse Taquicardia Ventricular hasta demostrar lo contrario. Nunca administrar antagonistas del calcio.',
      'Recuerda las 4 causas metabólicas reversibles más frecuentes de arritmias intraoperatorias: Hipoxia, Hipercapnia, Isquemia y Trastornos de Potasio/Magnesio.'
    ]
  },

  // -------------------------------------------------------------
  // 10. NEUMOTÓRAX A TENSIÓN INTRAOPERATORIO
  // -------------------------------------------------------------
  {
    id: 'tension_pneumothorax',
    title: 'Neumotórax a Tensión Intraoperatorio',
    shortTitle: 'Neumotórax a Tensión',
    subtitle: 'Shock Obstructivo, Hiperpresión Ventilatoria y Colapso Cardiopulmonar',
    category: 'respiratorio',
    severity: 'extrema',
    badge: 'RESPIRATORIO & TÓRAX',
    quickSummary: 'Pico inspiratorio elevado (> 40 cmH2O), desaturación refractaria, colapso circulatorio y asimetría auscultatoria',
    triggerSigns: [
      'Aumento súbito y progresivo de las presiones pico y meseta en el ventilador (> 40 cmH2O)',
      'Caída precipitada y refractaria de la saturación de oxígeno (SpO2 < 85%) con FiO2 1.0',
      'Hipotensión arterial severa y taquicardia o bradicardia súbita (shock obstructivo por compresión cava)',
      'Ausencia o disminución marcada del murmullo vesicular y timpanismo en un hemitórax',
      'Ingurgitación yugular o enfisema subcutáneo en cuello y tórax',
      'Procedimiento de riesgo reciente: punción subclavia/yugular, bloqueo supraclavicular, laparoscopia o toracotomía'
    ],
    immediateAction: '¡DESCOMPRESIÓN TORÁCICA INMEDIATA CON AGUJA! Desconectar al paciente del ventilador y ventilar manualmente con bolsa-válvula para evaluar resistencia elástica. Insertar catéter 14G o 16G en 2º espacio intercostal línea medioclavicular o 4º-5º espacio intercostal línea axilar anterior.',
    lethalErrors: [
      'NO esperar una Radiografía de Tórax en quirófano: el diagnóstico es puramente clínico y el retraso causa paro por AESP.',
      'NO confundir el cuadro con broncoespasmo aislado: auscultar ambos campos pulmonares y verificar si hay hipotensión concomitante.',
      'NO mantener PEEP elevada en el ventilador mecánico (la presión positiva aumenta la fuga aérea y acelera el colapso venoso).',
      'NO retirar el catéter de descompresión sin colocar un tubo de drenaje pleural (toracostomía con sello de agua).'
    ],
    drugs: [
      {
        name: 'Descompresión Torácica con Catéter 14G / 16G',
        indication: 'Alivio inmediato de la hiperpresión intratorácica a tensión',
        concentrationText: 'Catéter venoso periférico 14G (naranja) o 16G (gris) o aguja de descompresión pleural',
        calculateDose: (w) => {
          return {
            doseText: 'Inserción directa en 2º EIC línea medioclavicular o 4º-5º EIC línea axilar anterior',
            volumeText: 'Catéter calibre 14G o 16G con jeringa con 2 mL de SF',
            instructions: 'Puncionar perpendicularmente sobre el borde superior de la costilla inferior (para proteger el paquete intercostal). Retirar aguja metálica y dejar teflón: se escuchará salida de aire a presión ("hiss"). Fijar de inmediato.',
            highlight: true
          };
        }
      },
      {
        name: 'Adrenalina / Noradrenalina de Soporte',
        indication: 'Colapso hemodinámico persistente mientras se alivia la compresión mediastínica',
        concentrationText: 'Ampolla 1 mg/mL',
        calculateDose: (w) => {
          const doseMcg = Math.min(20, Math.max(10, Math.round(w * 0.2)));
          return {
            doseText: `Bolos de ${doseMcg} mcg IV titulados`,
            volumeText: `${(doseMcg / 10).toFixed(1)} mL (dilución 10 mcg/mL)`,
            instructions: 'Sostener la perfusión coronaria y cerebral mientras se reexpande el pulmón y se restablece el retorno venoso al corazón derecho.',
            highlight: true
          };
        }
      },
      {
        name: 'Cristaloides Balanceados en Bolo',
        indication: 'Optimización de precarga tras descompresión',
        concentrationText: 'Ringer Lactato o Solución Fisiológica tibia',
        calculateDose: (w) => {
          const ml = Math.round(w * 10);
          return {
            doseText: `10 mL/kg = ~${ml} mL`,
            volumeText: `${ml} mL a chorro rápido`,
            instructions: 'Llenado rápido de la precarga al ceder la compresión sobre las venas cavas superior e inferior.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'pneu-1',
        order: 1,
        phase: 'inmediato',
        title: 'Desconectar del Ventilador y Ventilación Manual',
        description: 'Pasar a bolsa manual de inmediato para sentir la elasticidad torácica con las manos (tórax duro / no distensible). Subir FiO2 al 100% y retirar PEEP.',
        isCrucial: true,
        tag: 'DESCONECTAR'
      },
      {
        id: 'pneu-2',
        order: 2,
        phase: 'inmediato',
        title: 'Descompresión Torácica con Aguja Inmediata',
        description: 'Insertar catéter 14G en el 2º espacio intercostal en la línea medioclavicular del hemitórax afectado (o 4º-5º EIC línea axilar anterior). Oír salida de aire a presión.',
        isCrucial: true,
        tag: 'PUNCIÓN'
      },
      {
        id: 'pneu-3',
        order: 3,
        phase: 'soporte',
        title: 'Verificación Hemodinámica Inmediata',
        description: 'La presión arterial y la distensibilidad pulmonar deben mejorar en segundos. Si no hay mejoría, reevaluar el hemitórax contralateral o descartar taponamiento cardíaco.',
        isCrucial: true,
        tag: 'EVALUACIÓN'
      },
      {
        id: 'pneu-4',
        order: 4,
        phase: 'avanzado',
        title: 'Tubo de Toracostomía con Sello de Agua',
        description: 'Colocar de inmediato tubo de drenaje pleural definitivo (calibre 24-28 Fr) conectado a sistema Pleur-evac o trampa de agua con aspiración suave (-10 a -20 cmH2O).',
        isCrucial: true
      }
    ],
    cognitivePearls: [
      'Bajo ventilación mecánica con presión positiva, un neumotórax simple se transforma en cuestión de minutos en un neumotórax a tensión letal.',
      'El sitio anatómico recomendado actualmente por la ATLS (10ª edición) incluye también el 4º o 5º espacio intercostal en la línea axilar anterior, especialmente en pacientes obesos o con pared muscular gruesa.'
    ]
  },

  // -------------------------------------------------------------
  // 11. EMBOLISMO GASEOSO Y LÍQUIDO AMNIÓTICO (ELA)
  // -------------------------------------------------------------
  {
    id: 'air_amniotic_embolism',
    title: 'Embolismo Gaseoso y Líquido Amniótico (ELA)',
    shortTitle: 'Embolismo (Aéreo / ELA)',
    subtitle: 'Caída Catastrófica de EtCO2, Hipoxemia Súbita y Colapso Cardiovascular',
    category: 'hemodinamico',
    severity: 'extrema',
    badge: 'EMBOLISMO & SHOCK',
    quickSummary: 'Pérdida súbita de EtCO2, desaturación masiva, colapso de ventrículo derecho y CID fulminante en ELA',
    triggerSigns: [
      'Caída brusca y catastrófica del EtCO2 en la capnografía (EtCO2 cae a cero o < 10 mmHg)',
      'Desaturación arterial severa e inmediata (SpO2 < 80%) que no responde a oxígeno puro al 100%',
      'Hipotensión arterial profunda súbita con colapso cardiovascular y paro en Actividad Eléctrica Sin Pulso (AESP)',
      'En cesárea/parto: disnea súbita, agitación, escalofríos, shock fulminante y sangrado coagulopático masivo (signos de ELA)',
      'En laparoscopia, histeroscopia o neurocirugía: caída de EtCO2, arritmias o auscultación de soplo en rueda de molino (embolismo gaseoso)'
    ],
    immediateAction: '¡AVISO INMEDIATO AL CIRUJANO! Suspender de inmediato insuflación de CO2 o irrigación presurizada; bañar campo con suero fisiológico o comprimir senos venosos. Apagar óxido nitroso y ventilar al 100% O2. En embolismo gaseoso: Posición de Durant (Decúbito Lateral Izquierdo + Trendelenburg). En ELA: Soporte inotrópico y activación de Protocolo de Transfusión Masiva.',
    lethalErrors: [
      'NO ignorar la caída del EtCO2 asumiendo fallo técnico del capnógrafo: es el signo heraldo más precoz del embolismo masivo.',
      'NO usar óxido nitroso (N2O) en la mezcla anestésica: difunde al interior de la burbuja y cuadruplica su volumen rápidamente.',
      'NO retrasar la intubación traqueal ni la ventilación mecánica protectora si el paciente está con anestesia regional.',
      'NO demorar el soporte inotrópico precoz (el ventrículo derecho entra en claudicación isquémica por hipertensión pulmonar aguda).'
    ],
    drugs: [
      {
        name: 'Noradrenalina / Adrenalina Infusión Continua',
        indication: 'Fallo ventricular derecho agudo, shock cardiogénico u obstructivo',
        concentrationText: 'Noradrenalina 4 mg en 100 mL SG5% (40 mcg/mL) o Adrenalina 4 mg en 100 mL',
        calculateDose: (w) => {
          const initialRateMcgMin = Number((w * 0.1).toFixed(1));
          return {
            doseText: `0.05 - 0.5 mcg/kg/min (inicio a ~${initialRateMcgMin} mcg/min)`,
            volumeText: `Titular bomba de infusión para PAM > 65 mmHg`,
            instructions: 'Mantener la presión de perfusión de la arteria coronaria derecha para evitar el infarto isquémico del ventrículo derecho agudamente sobrecargado.',
            highlight: true
          };
        }
      },
      {
        name: 'Ácido Tranexámico (TXA)',
        indication: 'Hiperfibrinolisis masiva y coagulopatía de consumo fulminante (CID) en Embolismo de Líquido Amniótico',
        concentrationText: 'Ampolla 1 g / 10 mL',
        calculateDose: (w) => {
          return {
            doseText: '1 g IV en bolo lento en 10 minutos',
            volumeText: '10 mL IV directo o diluido en 100 mL SF',
            instructions: 'Crucial en ELA: la coagulopatía es de inicio fulminante. Repetir 1 g a las 2-4 horas si persiste hemorragia microvascular.',
            highlight: true
          };
        }
      },
      {
        name: 'Hidrocortisona',
        indication: 'Respuesta anafilactoide / activación endotelial masiva en Embolismo de Líquido Amniótico',
        concentrationText: 'Frasco ampolla 100 mg - 500 mg',
        calculateDose: (w) => {
          return {
            doseText: '500 mg - 1000 mg IV en bolo',
            volumeText: 'Reconstituir con 10-20 mL de agua destilada',
            instructions: 'Modula la tormenta inflamatoria sistémica y el daño endotelial microvascular pulmonar.'
          };
        }
      },
      {
        name: 'Milrinona (Corotrope)',
        indication: 'Inodilatador para soporte de ventrículo derecho si PAM está sostenida con noradrenalina',
        concentrationText: 'Ampolla 10 mg / 10 mL (1 mg/mL)',
        calculateDose: (w) => {
          return {
            doseText: 'Infusión a 0.375 - 0.75 mcg/kg/min',
            volumeText: 'Diluir 10 mg en 100 mL SG5%',
            instructions: 'Reduce la postcarga del ventrículo derecho mediante vasodilatación pulmonar y mejora contractilidad inotrópica.'
          };
        }
      }
    ],
    steps: [
      {
        id: 'emb-1',
        order: 1,
        phase: 'inmediato',
        title: 'Alerta Quirúrgica Inmediata y Cese de Entrada de Gas',
        description: 'Informar al cirujano a viva voz. Detener insuflación de CO2 en laparoscopia o bañar el campo con solución salina para sellar senos venosos abiertos.',
        isCrucial: true,
        tag: 'CIRUGÍA'
      },
      {
        id: 'emb-2',
        order: 2,
        phase: 'inmediato',
        title: 'FiO2 100% y Apagar Óxido Nitroso',
        description: 'Desconectar gases anestésicos volátiles y N2O. Administrar oxígeno al 100% a alto flujo para favorecer la reabsorción del nitrógeno intravascular.',
        isCrucial: true,
        tag: 'O2 100%'
      },
      {
        id: 'emb-3',
        order: 3,
        phase: 'soporte',
        title: 'Posicionamiento en Decúbito Lateral Izquierdo (Durant)',
        description: 'En embolismo aéreo, colocar decúbito lateral izquierdo con ligero Trendelenburg: permite que la burbuja quede atrapada en el ápex ventricular sin bloquear el tracto de salida.',
        isCrucial: true,
        tag: 'DURANT'
      },
      {
        id: 'emb-4',
        order: 4,
        phase: 'avanzado',
        title: 'Manejo en ELA: Código Rojo y Protocolo Transfusional',
        description: 'En ELA obstétrico, activar de inmediato Protocolo de Transfusión Masiva (PTM 1:1:1), concentrado de fibrinógeno precoz, soporte ventilatorio de SDRA y monitorización invasiva.',
        isCrucial: true,
        tag: 'CÓDIGO ROJO'
      }
    ],
    cognitivePearls: [
      'El Embolismo de Líquido Amniótico (ELA) se comporta fisiopatológicamente como un Síndrome Anafilactoide del Embarazo: colapso hemodinámico bifásico (fallo VD agudo seguido de fallo VI) con coagulopatía de consumo fulminante.',
      'Si se dispone de un catéter venoso central colocado en aurícula derecha o ventrículo derecho, aspirar vigorosamente con una jeringa de 20 mL para extraer las burbujas aéreas macroscópicas.'
    ]
  }
];


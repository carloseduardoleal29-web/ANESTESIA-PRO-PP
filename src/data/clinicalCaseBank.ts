export interface ClinicalQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  keyLearningPoint: string;
}

export interface AdvancedSimulationCase {
  id: string;
  title: string;
  blindTitle?: string;
  category: 'Traumatología' | 'Vía Aérea' | 'Obstetricia' | 'Pediatría' | 'Cardiovascular / Crisis' | 'Neuroanestesia';
  difficulty: 'Intermedio' | 'Avanzado' | 'Experto';
  patient: string;
  surgery: string;
  timeInSurgery: string;
  initialVitals: {
    fc: number; // lpm
    paSystolic: number;
    paDiastolic: number;
    paMean: number;
    spo2: number; // %
    etco2: number; // mmHg
    temp: number; // °C
    fr: number; // rpm
    ecgRhythm: string;
    ecgLead: string;
    cvp?: number; // PVC mmHg
    bis?: number; // Índice biespectral
  };
  ecgStripType: 'sinus-tach' | 'ventricular-tach' | 'fibrillation' | 'severe-brady' | 'st-elevation' | 'normal-sinus';
  ecgFindingDescription: string;
  imaging?: {
    type: 'RX' | 'TAC' | 'ECO' | 'CAPNOGRAFÍA' | 'RX-REAL' | 'TAC-REAL' | 'ECO-REAL' | 'ECG-REAL' | 'FIBRO-REAL' | 'LAB-REAL' | 'RX-TÓRAX' | 'VIDEOLARINGO' | 'ECG-PCR' | 'ENDOSCOPIA' | 'DERMATOLOGÍA' | string;
    title: string;
    badge: string;
    description: string;
    svgGraphicType?: 'rx-pneumothorax' | 'us-cardiac-tamponade' | 'capno-bronchospasm' | 'us-vessel-collapse';
    realImageUrl?: string;
    findingsSummary?: string;
  };
  criticalContext: string;
  questions: ClinicalQuestion[];
  debriefing: {
    takeawaySummary: string;
    guidelineReference: string;
    authorPearls: string;
  };
}

export const INITIAL_CLINICAL_CASES: AdvancedSimulationCase[] = [
  {
    id: 'case-trauma-hemothorax',
    title: 'Politraumatismo con Neumotórax a Tensión y Shock Hemorrágico',
    blindTitle: 'Politraumatismo con Inestabilidad Respiratoria y Hemodinámica Inmediata',
    category: 'Traumatología',
    difficulty: 'Experto',
    patient: 'Masculino de 28 años, motociclista arrollado a alta velocidad con contusión toracoabdominal cerrada.',
    surgery: 'Laparotomía y Toracotomía de Control de Daños.',
    timeInSurgery: 'Inducción de emergencia y primeros 10 min',
    initialVitals: {
      fc: 142,
      paSystolic: 65,
      paDiastolic: 38,
      paMean: 47,
      spo2: 76,
      etco2: 16,
      temp: 34.8,
      fr: 28,
      ecgRhythm: 'Taquicardia sinusal con bajo voltaje',
      ecgLead: 'DII',
      cvp: 22
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal a 142 lpm con disminución generalizada del voltaje de los complejos QRS y extrasístoles aisladas.',
    imaging: {
      type: 'RX-TÓRAX',
      title: 'Radiografía de Tórax Portátil en Camilla',
      badge: 'URGENCIA CRÍTICA',
      description: 'Hiperclaridad masiva en hemitórax derecho sin trama vascular, colapso pulmonar ipsilateral completo y severa desviación mediastínica y traqueal hacia la izquierda con aplanamiento diafragmático.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Pneumot%C3%B3rax_espont%C3%A2neo.png',
      findingsSummary: 'Neumotórax a tensión derecho hiperresonante con colapso de cava.'
    },
    criticalContext: 'Tras intubación orotraqueal de secuencia rápida y conexión a ventilación mecánica con presión positiva, la presión arterial se desploma a 60/35 mmHg, el capnógrafo cae abruptamente a 14 mmHg, la presión pico de la vía aérea sube a 48 cmH2O y se evidencia ingurgitación yugular bilateral con hipoventilación del hemitórax derecho.',
    questions: [
      {
        id: 'q1',
        prompt: 'Ante el colapso hemodinámico inmediato tras iniciar ventilación con presión positiva en este contexto de trauma, ¿cuál es el diagnóstico fisiopatológico de riesgo vital inminente?',
        options: [
          'Taponamiento cardíaco por hemopericardio aislado.',
          'Neumotórax a tensión derecho descompensado por la presión positiva intratorácica.',
          'Sobredosis por el bolo inductor de propofol.',
          'Embolia grasa masiva por fractura de fémur.'
        ],
        correctIndex: 1,
        explanation: 'La ventilación con presión positiva incrementa rápidamente el volumen del aire atrapado a tensión en el hemitórax, colapsando la vena cava inferior y el retorno venoso, provocando caída catastrófica del gasto cardíaco.',
        keyLearningPoint: 'En trauma torácico con colapso post-intubación, el neumotórax a tensión debe descartarse y descomprimirse de inmediato antes de cualquier estudio.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la maniobra de rescate inmediato que debe realizar el anestesiólogo antes de perder el pulso?',
        options: [
          'Esperar el revelado de la tomografía computarizada de tórax.',
          'Descompresión torácica inmediata con aguja/catéter grueso (14-16G) en 4to/5to espacio intercostal línea axilar anterior o 2do espacio línea medioclavicular.',
          'Aumentar la PEEP a 12 cmH2O para reclutar el pulmón colapsado.',
          'Iniciar infusión de adenosina para frenar la taquicardia sinusal.'
        ],
        correctIndex: 1,
        explanation: 'El tratamiento del neumotórax a tensión es CLÍNICO e INMEDIATO mediante toracostomía o descompresión con aguja gruesa para liberar el aire a tensión antes de colocar el tubo de avenamiento pleural.',
        keyLearningPoint: 'No se debe solicitar ni esperar estudios radiológicos cuando los signos clínicos de neumotórax a tensión están presentes.'
      },
      {
        id: 'q3',
        prompt: 'Descomprimido el neumotórax, persiste hipotensión severa (PA 75/42) y sangrado peritoneal activo. ¿Cuál es el objetivo de Reanimación con Control de Daños Hemostático (RDH)?',
        options: [
          'Infusión rápida de 4 litros de solución salina 0.9% helada para forzar PA sistólica > 130 mmHg.',
          'Hipotensión permisiva (PAS 80-90 mmHg / PAM 50-60 mmHg) hasta control quirúrgico del sangrado y protocolo de transfusión masiva 1:1:1.',
          'Administrar heparina sódica profiláctica inmediatamente.',
          'Uso exclusivo de vasoconstrictores puros (Fenilefrina) sin reponer volumen ni sangre.'
        ],
        correctIndex: 1,
        explanation: 'La hipotensión permisiva evita la rotura del coágulo inicial ("popping the clot") mientras el cirujano logra la hemostasia quirúrgica, minimizando además la hemodilución con cristaloides.',
        keyLearningPoint: 'La tríada de la muerte (hipotermia, acidosis, coagulopatía) se combate con hemoderivados tempranos (1:1:1), sangre tibia y ácido tranexámico.'
      },
      {
        id: 'q4',
        prompt: '¿En qué ventana de tiempo debe administrarse el Ácido Tranexámico (TXA) según el estudio CRASH-2 para reducir significativamente la mortalidad por sangrado?',
        options: [
          'Dentro de las primeras 3 horas posteriores al trauma inicial.',
          'Únicamente después de 6 horas de iniciada la cirugía.',
          'Solo si el paciente ya ha recibido más de 10 unidades de sangre.',
          'No tiene beneficio demostrado en trauma.'
        ],
        correctIndex: 0,
        explanation: 'El Ácido Tranexámico (1 g bolo en 10 min seguido de 1 g infusión en 8 horas) reduce la mortalidad si se administra en las primeras 3 horas; administrado después de 3 horas puede incrementar el riesgo de muerte.',
        keyLearningPoint: 'Dosis precoz de Ácido Tranexámico dentro de las primeras 3 horas post-trauma salva vidas.'
      },
      {
        id: 'q5',
        prompt: 'Durante la laparotomía, el capnógrafo muestra una caída del EtCO2 a 10 mmHg y la PA no es audible. ¿Cuál es la sospecha inmediata y acción?',
        options: [
          'Paro Cardiorrespiratorio por hipovolemia extrema / actividad eléctrica sin pulso; suspender anestésicos, iniciar compresiones e infusión rápida de hemoderivados con noradrenalina/adrenalina.',
          'Desconexión del sensor de capnografía; cambiar la línea de muestra.',
          'Profundizar con Sevoflurano para calmar al paciente.',
          'Apagar la ventilación mecánica y esperar 5 minutos.'
        ],
        correctIndex: 0,
        explanation: 'Una caída drástica del EtCO2 a niveles < 10 mmHg con pérdida de presión es signo inequívoco de colapso circulatorio mayor o paro cardíaco (AESP) por choque hipovolémico exanguinante.',
        keyLearningPoint: 'El EtCO2 es el monitor indirecto más precoz y fidedigno del gasto cardíaco y de la efectividad del RCP.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El caso combinó dos emergencias de trauma: neumotórax a tensión gatillado por ventilación invasiva y shock hemorrágico exanguinante. La prioridad fue descompresión torácica inmediata sin retraso radiológico, seguida de control de daños y transfusión balanceada.',
      guidelineReference: 'ATLS 10th Edition / Guías Europeas de Manejo de Sangrado Mayor y Coagulopatía en Trauma (2023).',
      authorPearls: 'Dr. Carlos Leal: "Nunca subestimes la ingurgitación yugular y el aumento súbito de la presión pico en trauma; una aguja en tórax en el momento justo es la diferencia entre la vida y el paro en pabellón."'
    }
  },
  {
    id: 'case-airway-morbid-obesity',
    title: 'Vía Aérea Difícil Imprevista en Obesidad Mórbida (VORTEX / DAS)',
    blindTitle: 'Desaturación Acelerada e Imposibilidad Ventilatoria en Inducción Anestésica',
    category: 'Vía Aérea',
    difficulty: 'Experto',
    patient: 'Femenina de 42 años, IMC 46 kg/m² (124 kg), cuello corto, macroglosia, SAHOS severo dependiente de CPAP.',
    surgery: 'Cirugía Bariátrica (Bypass Gástrico Laparoscópico).',
    timeInSurgery: 'Fase de Inducción Anestésica (Minuto 4)',
    initialVitals: {
      fc: 112,
      paSystolic: 165,
      paDiastolic: 98,
      paMean: 120,
      spo2: 78,
      etco2: 0,
      temp: 36.6,
      fr: 0,
      ecgRhythm: 'Taquicardia sinusal',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal rápida a 112 lpm generada por estrés hipóxico y descarga adrenérgica reactiva.',
    imaging: {
      type: 'VIDEOLARINGO',
      title: 'Visión con Videolaringoscopio de Vía Aérea Difícil',
      badge: 'CORMACK-LEHANE IV / ESTRÉS HIPÓXICO',
      description: 'Visión laringoscópica que muestra epiglotis caída y adosada a pared faríngea posterior sin exposición de cuerdas vocales, requiriendo maniobras avanzadas.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Glidescope_02.JPG',
      findingsSummary: 'Imposibilidad de intubación directa con pala convencional; Cormack-Lehane IV.'
    },
    criticalContext: 'Tras preoxigenación en posición en rampa (Ramped Position) e inducción con Propofol y Rocuronio dosificados a peso magro/ideal, se realiza videolaringoscopía pero la óptica se empaña por secreciones espesas; el cambio a laringoscopia directa convencional revela Cormack-Lehane grado IV. La ventilación con mascarilla facial a 2 manos y cánula de Guedel genera resistencia extrema y la SpO2 cae velozmente de 99% a 78%.',
    questions: [
      {
        id: 'q1',
        prompt: 'En el paciente obeso mórbido con SAHOS, ¿por qué la desaturación de oxígeno ocurre en menos de 90 segundos de apnea comparado con un paciente normopeso?',
        options: [
          'Mayor Capacidad Residual Funcional (CRF) y menor consumo de O2.',
          'Drástica reducción de la CRF (hasta un 50-70%) combinada con un consumo metabólico de oxígeno basal elevado.',
          'Incompatibilidad farmacológica del rocuronio en pacientes con masa grasa elevada.',
          'Toxicidad alveolar mediada por el óxido nitroso.'
        ],
        correctIndex: 1,
        explanation: 'La masa toracoabdominal reduce significativamente el volumen de gas alveolar remanente (CRF disminuida), mientras la masa celular aumentada consume O2 aceleradamente, acortando el tiempo seguro de apnea.',
        keyLearningPoint: 'En obesos mórbidos el margen de seguridad de apnea es mínimo; la preoxigenación con CPAP o cánula de alto flujo es indispensable.'
      },
      {
        id: 'q2',
        prompt: 'Ante la falla de ventilación con mascarilla facial e imposibilidad de intubación directa (Situación de Vía Aérea Difícil), ¿cuál es el siguiente paso según el Algoritmo VORTEX?',
        options: [
          'Insistir en un 4to intento con pala curva rígida empleando mayor fuerza sobre los incisivos.',
          'Insertar de inmediato un Dispositivo Supraglótico de 2da generación (ej. i-gel o LMA ProSeal) con drenaje gástrico.',
          'Administrar un bolo de 100 mg de propofol para relajar más.',
          'Suspender toda maniobra y despertar al paciente sin oxigenar.'
        ],
        correctIndex: 1,
        explanation: 'El abordaje VORTEX manda a optimizar las 3 líneas no invasivas: Mascarilla facial, Dispositivo Supraglótico y Tubo Endotraqueal. El rescate con supraglótico de 2da generación permite ventilar y oxigenar de forma rápida.',
        keyLearningPoint: 'Un dispositivo supraglótico de 2da generación es la mejor herramienta de rescate para evitar la situación CICO en obesidad.'
      },
      {
        id: 'q3',
        prompt: 'Se coloca la máscara laríngea i-gel pero existe fuga masiva por alta presión intratorácica (presión pico > 42 cmH2O), el tórax no expande y la SpO2 se sitúa en 62% con bradicardia a 42 lpm. ¿Diagnóstico situacional?',
        options: [
          'Vía aérea de rutina resuelta.',
          'Emergencia CICO (Cannot Intubate, Cannot Oxygenate / No Intubo, No Oxigeno).',
          'Aspiración de cuerpo extraño resuelta con succión.',
          'Crisis asmática leve.'
        ],
        correctIndex: 1,
        explanation: 'El fracaso de la mascarilla facial, del tubo y del dispositivo supraglótico con hipoxemia severa progresiva y bradicardia define la emergencia CICO, donde el daño cerebral o paro sobreviene en minutos si no se actúa en el cuello.',
        keyLearningPoint: 'Reconocer el CICO a tiempo salva la vida; retrasar la decisión buscando más intentos no invasivos conduce a la asistolia hipóxica.'
      },
      {
        id: 'q4',
        prompt: '¿Cuál es la técnica recomendada por las guías DAS para el acceso quirúrgico de rescate al cuello anterior en CICO?',
        options: [
          'Punción con aguja 25G en la fosa supraclavicular.',
          'Técnica quirúrgica bisturí-bougie-tubo (Scalpel-Bougie-Tube) a través de la membrana cricotiroidea con tubo con balón 6.0 mm.',
          'Traqueostomía formal reglada en el 4to anillo traqueal con disección lenta de planos.',
          'Punción percutánea ciega con catéter de foley.'
        ],
        correctIndex: 1,
        explanation: 'La técnica scalpel-bougie-tube en la membrana cricotiroidea es la técnica más veloz, confiable y con mayor tasa de éxito comprobada en emergencias extremas para oxigenar de inmediato.',
        keyLearningPoint: 'Membrana cricotiroidea: Incisión transversal, orientación con bougie elastómero e inserción de tubo cuffed calibre 6.0 mm.'
      },
      {
        id: 'q5',
        prompt: '¿Cuál es la dosis de Sugammadex recomendada en caso de requerir reversión inmediata de emergencia tras una dosis de intubación de Rocuronio (1.2 mg/kg)?',
        options: [
          '2 mg/kg de peso real.',
          '4 mg/kg de peso ideal.',
          '16 mg/kg de peso real actual del paciente.',
          'No se debe usar Sugammadex en vía aérea difícil.'
        ],
        correctIndex: 2,
        explanation: 'Para la reversión inmediata de un bloqueo neuromuscular profundo inducido por rocuronio (a los 3 minutos de administrado), la dosis de rescate de Sugammadex es de 16 mg/kg calculada sobre el peso real.',
        keyLearningPoint: 'Sugammadex 16 mg/kg revierte el rocuronio en ~3 minutos, aunque en CICO la prioridad número 1 es oxigenar el cuello.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La obesidad mórbida reduce drásticamente el tiempo de apnea seguro. Cuando las 3 líneas no invasivas del VORTEX fallan, declarar la emergencia CICO de forma precoz y ejecutar la cricotiroidotomía scalpel-bougie-tube previene la muerte hipóxica.',
      guidelineReference: 'Difficult Airway Society (DAS) Guidelines / VORTEX Airway Management Approach.',
      authorPearls: 'Dr. Carlos Leal: "En vía aérea difícil, el ego del anestesiólogo que intenta un tercer o cuarto intento es el principal enemigo del paciente. Reconocer el fracaso y cambiar al plan de rescate salva vidas."'
    }
  },
  {
    id: 'case-obstetric-cardiac-arrest',
    title: 'Paro Cardíaco en Gestante / Histerotomía de Reanimación (Cesárea Peri-Mortem)',
    blindTitle: 'Colapso Materno Súbito y Ausencia de Pulsos en Sala Quirúrgica Obstétrica',
    category: 'Obstetricia',
    difficulty: 'Experto',
    patient: 'Gestante de 34 semanas, 26 años, sin antecedentes conocidos, ingresa por convulsiones tónico-clónicas en sala de parto.',
    surgery: 'Reanimación Cardiopulmonar Avanzada y Cesárea de Emergencia.',
    timeInSurgery: 'Ingreso inmediato a Pabellón Obstétrico',
    initialVitals: {
      fc: 0,
      paSystolic: 0,
      paDiastolic: 0,
      paMean: 0,
      spo2: 0,
      etco2: 8,
      temp: 36.8,
      fr: 0,
      ecgRhythm: 'Fibrilación Ventricular Gruesa (FV)',
      ecgLead: 'DII'
    },
    ecgStripType: 'fibrillation',
    ecgFindingDescription: 'Fibrilación ventricular con ondas caóticas de alto voltaje y despolarizaciones totalmente desorganizadas sin complejos QRS identificables.',
    imaging: {
      type: 'ECG-PCR',
      title: 'Trazado Electrocardiográfico en Paro Cardiorrespiratorio: Fibrilación Ventricular (FV)',
      badge: 'PARO CARDIORRESPIRATORIO • RITMO DESFIBRILABLE',
      description: 'Trazado electrocardiográfico auténtico en parada cardiorrespiratoria de quirófano: Ondas de Fibrilación Ventricular gruesa caóticas y desorganizadas, sin complejos QRS ni gasto cardíaco, requiriendo descarga inmediata con desfibrilador.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Ventricular_fibrillation.png',
      findingsSummary: 'Paro cardíaco materno intraoperatorio con FV gruesa que exige desfibrilación y cesárea perimórtem.'
    },
    criticalContext: 'La paciente presenta paro cardiorrespiratorio presenciado en el área quirúrgica obstétrica. Se inician maniobras de soporte vital avanzado (ACLS Materno), compresiones torácicas y desfibrilación. La monitorización fetal y materna confirma ausencia de pulso carotídeo.',
    questions: [
      {
        id: 'q1',
        prompt: 'Durante las compresiones torácicas en una paciente con embarazo > 20 semanas en decúbito dorsal, ¿cuál es la modificación biomecánica OBLIGATORIA para optimizar el gasto cardíaco?',
        options: [
          'Colocar a la paciente en Trendelenburg forzado a 45 grados.',
          'Desplazamiento uterino manual continuo hacia la izquierda (LUD) para aliviar la compresión de la vena cava inferior.',
          'Girar la mesa quirúrgica a 90 grados hacia la derecha.',
          'Suspender compresiones para no dañar al feto.'
        ],
        correctIndex: 1,
        explanation: 'El útero grávido comprime la vena cava inferior y la aorta abdominal, reduciendo el retorno venoso a casi cero durante la reanimación en posición supina plana. El desplazamiento manual a la izquierda restablece el retorno venoso.',
        keyLearningPoint: 'El desplazamiento manual del útero a la izquierda es prioritario sobre la inclinación de toda la camilla, ya que no dificulta la calidad de las compresiones.'
      },
      {
        id: 'q2',
        prompt: 'El monitor confirma Fibrilación Ventricular (FV). ¿Cuál es la indicación respecto a la desfibrilación eléctrica en la gestante en paro?',
        options: [
          'No se debe desfibrilar porque la corriente eléctrica induce aborto inmediato.',
          'Desfibrilar de inmediato con la misma energía bifásica que en cualquier adulto (120 - 200 J) sin demora.',
          'Reducir la dosis de descarga a 10 Joules para proteger al feto.',
          'Esperar a la infusión de amiodarona antes de dar la primera descarga.'
        ],
        correctIndex: 1,
        explanation: 'La energía que llega al feto a través del miometrio es insignificante comparada con el riesgo inminente de muerte cerebral de ambos. La desfibrilación precoz salva a la madre y por ende al feto.',
        keyLearningPoint: 'Las descargas eléctricas para ritmos desfibrilables en la gestante tienen los mismos protocolos y niveles energéticos que en el paciente no gestante.'
      },
      {
        id: 'q3',
        prompt: 'Si no se logra el retorno de la circulación espontánea (RCE) tras 4 minutos de RCP efectiva y desfibrilación, ¿cuál es la regla de oro obstétrica?',
        options: [
          'Dar por terminada la reanimación.',
          'Iniciar Histerotomía de Reanimación (Cesárea Peri-Mortem) al minuto 4 para extraer al feto antes del minuto 5.',
          'Esperar 30 minutos antes de cualquier procedimiento quirúrgico.',
          'Trasladar a la paciente a otra institución.'
        ],
        correctIndex: 1,
        explanation: 'La histerotomía perimortem al minuto 4 descomprime la vena cava inferior y devuelve el 60-70% del gasto cardíaco a la madre, aumentando drásticamente la sobrevida materna y la viabilidad del recién nacido.',
        keyLearningPoint: 'La cesárea de reanimación no es solo para salvar al bebé; es una maniobra de reanimación materna de rescate circulatorio.'
      },
      {
        id: 'q4',
        prompt: '¿Dónde debe realizarse la histerotomía de reanimación en este escenario?',
        options: [
          'En el lugar exacto del paro (In situ), sin perder tiempo en traslados a pabellones lejanos ni lavado quirúrgico exhaustivo.',
          'Trasladar en ascensor a sala de cuidados intensivos.',
          'Esperar a que llegue el anestesiólogo de turno pasivo.',
          'Solo cuando el electroencefalograma confirme muerte.'
        ],
        correctIndex: 0,
        explanation: 'La histerotomía debe ser realizada IN SITU de inmediato. El traslado consume minutos críticos irreversibles para la corteza cerebral materna.',
        keyLearningPoint: 'No trasladar a la paciente. Bisturí en mano y extracción fetal inmediata en el mismo sitio.'
      },
      {
        id: 'q5',
        prompt: 'Si la causa primaria del colapso fue toxicidad sistémica por anestésicos locales (LAST) tras intento de epidural previa con bupivacaína, ¿cuál es el antídoto específico indispensable?',
        options: [
          'Flumazenil EV a dosis altas.',
          'Emulsión lipídica al 20% (Intralipid) en bolo inicial de 1.5 mL/kg seguido de infusión a 0.25 mL/kg/min.',
          'Bicarbonato de sodio al 8.4% a chorro sin lípidos.',
          'Protamina sulfato.'
        ],
        correctIndex: 1,
        explanation: 'La emulsión lipídica al 20% actúa como "trampa lipídica" (lipid sink) extrayendo el anestésico lipofílico del miocardio y tejido cerebral, restaurando la estabilidad eléctrica.',
        keyLearningPoint: 'Tener siempre disponible emulsión lipídica al 20% en todo centro donde se administre anestesia regional obstétrica.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El ACLS obstétrico exige dos acciones diferenciales críticas: desplazamiento uterino hacia la izquierda permanente y la decisión irrevocable de histerotomía de reanimación al minuto 4 si no hay RCE.',
      guidelineReference: 'AHA Guidelines for CPR and ECC in Pregnancy / Society for Obstetric Anesthesia and Perinatology (SOAP).',
      authorPearls: 'Dr. Carlos Leal: "En el paro obstétrico, el tiempo corre al doble. La cesárea peri-mortem a los 4 minutos no es una renuncia: es la maniobra más potente de reanimación para la madre."'
    }
  },
  {
    id: 'case-pediatric-laryngospasm',
    title: 'Laringoespasmo Severo y Edema Pulmonar por Presión Negativa en Pediatría',
    blindTitle: 'Estridor Severo Inmediato y Tiraje Paradojal tras Extubación Pediátrica',
    category: 'Pediatría',
    difficulty: 'Avanzado',
    patient: 'Niño de 3 años, 14 kg, con antecedente de infección respiratoria alta hace 10 días.',
    surgery: 'Adenoamigdalectomía bajo anestesia general balanceada.',
    timeInSurgery: 'Extubación en plano anestésico superficial (Minuto 0 post-extubación)',
    initialVitals: {
      fc: 58,
      paSystolic: 80,
      paDiastolic: 45,
      paMean: 56,
      spo2: 68,
      etco2: 0,
      temp: 36.5,
      fr: 36,
      ecgRhythm: 'Bradicardia sinusal severa hipóxica',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia sinusal refleja a 58 lpm con intervalos PR prolongados, secundaria a estimulación vagal por hipoxemia crítica.',
    imaging: {
      type: 'ENDOSCOPIA',
      title: 'Exploración Endoscópica Laríngea de Urgencia',
      badge: 'CUERDAS EN ADUCCIÓN / ESPASMO',
      description: 'Laringoscopia que demuestra cierre glótico forzado con aducción refleja bilateral de cuerdas vocales verdaderas y falsas, con edema perilaríngeo secundario.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Larynx_endo_2.jpg',
      findingsSummary: 'Laringoespasmo reflejo agudo con colapso de la luz aérea glótica.'
    },
    criticalContext: 'Tras la extubación en un plano anestésico superficial, el paciente presenta estridor inspiratorio agudo que progresa a silencio respiratorio total. Hay tiraje intercostal severo, bamboleo toracoabdominal (respiración paradojal), retracción supraesternal y cianosis peribucal. La SpO2 cae a 68% y la frecuencia cardíaca desciende rápidamente de 120 a 58 lpm.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el primer paso físico e inmediato para resolver un laringoespasmo parcial/completo en el niño?',
        options: [
          'Tratar de reintubar a ciegas sin relajar al paciente.',
          'Maniobra de Larson (presión sostenida en la escotadura laringoesofágica retromandibular / "Punto de Larson") con elevación mandibular y ventilación con presión positiva continua (CPAP) con O2 al 100%.',
          'Administrar un vaso de agua fría por sonda nasogástrica.',
          'Colocar al niño en posición de decúbito prono.'
        ],
        correctIndex: 1,
        explanation: 'La presión bilateral firme en la muesca de Larson (entre la apófisis mastoides y el ángulo de la mandíbula) estimula una vía refleja que desbloquea las cuerdas vocales, sumado al sello hermético con CPAP.',
        keyLearningPoint: 'La presión en la muesca de Larson combinada con CPAP con O2 al 100% rompe la mayoría de los laringoespasmos tempranos.'
      },
      {
        id: 'q2',
        prompt: 'Si el laringoespasmo persiste, el niño entra en bradicardia extrema (< 50 lpm) y desaturación < 60%, ¿cuál es la dosis farmacológica de rescate con Succinilcolina EV?',
        options: [
          '0.1 mg/kg EV.',
          '0.5 a 1.0 mg/kg EV (o 2 a 4 mg/kg intramuscular si no hay vía permeable), asociado a Atropina (0.02 mg/kg).',
          '10 mg/kg EV directo.',
          'No se debe usar relajante neuromuscular.'
        ],
        correctIndex: 1,
        explanation: 'Dosis bajas de succinilcolina (0.5 a 1 mg/kg) rompen el espasmo glótico sin necesidad de parálisis prolongada. En niños debe coadministrarse atropina para prevenir la bradicardia vagal extrema.',
        keyLearningPoint: 'Tener siempre lista una jeringa de succinilcolina y atropina en la bandeja pediátrica ante cualquier extubación.'
      },
      {
        id: 'q3',
        prompt: 'Minutos después de vencer el espasmo glótico y ventilar con O2, brota por la boca un esputo asalmonado espumoso rosado abundante. ¿Cuál es el diagnóstico?',
        options: [
          'Hemorragia digestiva alta.',
          'Edema Pulmonar por Presión Negativa (EPPN / Edema Post-Obstructivo).',
          'Ruptura de arteria pulmonar.',
          'Sobrehidratación exclusiva con glucosado.'
        ],
        correctIndex: 1,
        explanation: 'Los esfuerzos inspiratorios vigorosos contra una glotis cerrada generan presiones intratorácicas marcadamente negativas (-50 a -100 cmH2O), disparando la trasudación alveolar y ruptura capilar alveolo-intersticial.',
        keyLearningPoint: 'El EPPN es una complicación temida y frecuente tras laringoespasmo intenso en pacientes jóvenes y niños con fuerza muscular inspiratoria conservada.'
      },
      {
        id: 'q4',
        prompt: '¿Cuál es el pilar terapéutico para el Edema Pulmonar por Presión Negativa en este niño?',
        options: [
          'Furosemida a dosis tóxicas y sangría venosa.',
          'Mantenimiento de PEEP / CPAP (5 a 10 cmH2O), oxigenoterapia al 100%, posición semisentada y restricción hídrica prudente.',
          'Administrar vasodilatadores arteriales hipotensores.',
          'Extubación inmediata y alta a sala común.'
        ],
        correctIndex: 1,
        explanation: 'La aplicación de PEEP/CPAP contrarresta la trasudación hidrostática y recluta los alvéolos inundados. El cuadro suele autolimitarse en 12 a 24 horas si se garantiza la oxigenación.',
        keyLearningPoint: 'El soporte con PEEP y oxígeno al 100% resuelve la mayoría de los casos de EPPN sin necesidad de inotrópicos.'
      },
      {
        id: 'q5',
        prompt: '¿Cuál es la estrategia más eficaz para prevenir el laringoespasmo en pediatría tras una cirugía de vía aérea?',
        options: [
          'Aspirar la orofaringe vigorosamente justo en el momento en que el niño empieza a toser.',
          'Extubar o bien en plano anestésico profundo (con reflejos abolidos y ventilación espontánea regular) o bien completamente despierto (con apertura ocular y deglución presente), aspirando previamente con visión directa.',
          'Retirar el tubo con el paciente dormido a medias mientras lucha con el ventilador.',
          'No administrar analgesia postoperatoria.'
        ],
        correctIndex: 1,
        explanation: 'La zona de peligro de laringoespasmo es el estadio II de Guedel (plano de excitación). Nunca debe extubarse en este estadio intermedio; la extubación debe ser o muy profunda o totalmente despierta.',
        keyLearningPoint: 'Evitar el plano II para extubar. La aspiración gentil en plano profundo evita estímulos irritativos en cuerdas vocales durante el despertar.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El laringoespasmo pediátrico es la principal causa de paro hipóxico perioperatorio. Requiere reconocimiento inmediato de la respiración paradojal, presión en escotadura de Larson, O2 a presión positiva y dosis rápida de succinilcolina + atropina antes de la asistolia.',
      guidelineReference: 'APAGBI (Association of Paediatric Anaesthetists of Great Britain and Ireland) Crisis Management.',
      authorPearls: 'Dr. Carlos Leal: "En el niño, el corazón sigue al pulmón: si el niño se queda sin aire, su pulso cae en picada en segundos. Actuar con calma pero sin vacilar salva vidas."'
    }
  },
  {
    id: 'case-anaphylaxis-shock',
    title: 'Shock Anafiláctico Severo Grado IV inducido por Cefazolina / Bloqueante Neuromuscular',
    blindTitle: 'Colapso Circulatorio Fulminante y Presión Pico Elevada en Minuto 6 Post-Inducción',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Avanzado',
    patient: 'Femenina de 38 años, sometida a artroscopia de rodilla.',
    surgery: 'Artroscopia diagnóstica electiva.',
    timeInSurgery: 'Minuto 6 post-inducción y profilaxis antibiótica',
    initialVitals: {
      fc: 154,
      paSystolic: 48,
      paDiastolic: 22,
      paMean: 30,
      spo2: 82,
      etco2: 12,
      temp: 36.2,
      fr: 16,
      ecgRhythm: 'Taquicardia sinusal extrema / Signos de isquemia subendocárdica',
      ecgLead: 'V5'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal rápida a 154 lpm con infradesnivel del segmento ST de 2.5 mm en derivaciones anterolaterales por hipoperfusión coronaria severa.',
    imaging: {
      type: 'DERMATOLOGÍA',
      title: 'Signos Cutáneos y Vasodilatación en Shock Anafiláctico',
      badge: 'ERUPCIÓN ERITEMATOSA / VASOPLEJIA',
      description: 'Erupción cutánea maculopapular eritematosa extensa generalizada con edema tisular y vasodilatación periférica extrema en shock anafiláctico intraoperatorio por betalactámicos.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Rash_on_the_chest_of_a_person_with_anaphylaxis.jpg',
      findingsSummary: 'Broncoespasmo refractario con hipoperfusión pulmonar masiva y eritema anafiláctico.'
    },
    criticalContext: 'A los 4 minutos de administrar Cefazolina 2g EV y Rocuronio 50 mg, la presión arterial se desploma de 125/75 a 48/22 mmHg. El ventilador alerta por presión pico elevada (> 45 cmH2O) con curva capnográfica en "aleta de tiburón", eritema y edema generalizado en tronco y cara.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el fármaco de PRIMERA LÍNEA indiscutible y de administración inmediata en el shock anafiláctico intraoperatorio?',
        options: [
          'Hidrocortisona 500 mg EV.',
          'Adrenalina (Epinefrina) en bolos intravenosos titulados (10 a 50 mcg EV en shock; o 0.5 mg IM si no hay vía permeable).',
          'Difenhidramina 50 mg EV.',
          'Infusión de dopamina a dosis diurética.'
        ],
        correctIndex: 1,
        explanation: 'La adrenalina es el único fármaco que revierte la vasodilatación masiva, el colapso vascular periférico y el broncoespasmo, además de estabilizar la membrana de los mastocitos deteniendo la liberación de mediadores.',
        keyLearningPoint: 'La adrenalina debe administrarse sin vacilar. Los corticoides y antihistamínicos son de segunda línea y no salvan la vida en la fase hiperaguda.'
      },
      {
        id: 'q2',
        prompt: 'Junto con la Adrenalina, ¿qué medida de reanimación con volumen debe iniciarse inmediatamente?',
        options: [
          'Restricción hídrica absoluta para evitar el edema facial.',
          'Infusión rápida de cristaloides isotónicos tibios (1 a 2 litros en bolos rápidos / 20-30 mL/kg) para compensar la fuga capilar masiva.',
          'Administrar 2 litros de agua destilada.',
          'Esperar a la llegada de albúmina humana al 20%.'
        ],
        correctIndex: 1,
        explanation: 'La anafilaxia genera un secuestro de hasta el 35-50% del volumen intravascular hacia el espacio intersticial en minutos debido a la permeabilidad capilar extrema.',
        keyLearningPoint: 'Llenar el lecho vascular con cristaloides a presión es mandatorio mientras la adrenalina restaura el tono vascular.'
      },
      {
        id: 'q3',
        prompt: 'Si el paciente presenta broncoespasmo refractario con presión pico de 50 cmH2O a pesar de bolos repetidos de adrenalina, ¿qué coadyuvante farmacológico anestésico se puede emplear?',
        options: [
          'Aumentar la fracción inspirada del halogenado (Sevoflurano) por su potente efecto broncodilatador y considerar sulfato de magnesio EV (2 g en 20 min).',
          'Administrar betabloqueantes tipo propranolol.',
          'Desconectar el tubo y ventilar con aire ambiente.',
          'Administrar prostigmina.'
        ],
        correctIndex: 0,
        explanation: 'Los anestésicos volátiles son potentes broncodilatadores directos del músculo liso bronquial. El sulfato de magnesio inhibe el influjo de calcio reduciendo la hiperreactividad de la vía aérea.',
        keyLearningPoint: 'Sevoflurano y Sulfato de Magnesio son excelentes rescatadores del broncoespasmo crítico refractario.'
      },
      {
        id: 'q4',
        prompt: 'Para la confirmación diagnóstica inmunológica posterior del evento anafiláctico, ¿cuál es el marcador bioquímico que debe extraerse en tubo con EDTA y en qué intervalo de tiempo?',
        options: [
          'Troponina I a las 24 horas.',
          'Triptasa sérica: muestra precoz (en las primeras 1 a 2 horas) y una muestra de control basal a las 24 horas.',
          'Hemoglobina glicosilada.',
          'Cultivo de secreción bronquial.'
        ],
        correctIndex: 1,
        explanation: 'La triptasa de los mastocitos tiene su pico plasmático a los 60-120 minutos del colapso. Compararla con una muestra basal a las 24 horas confirma fehacientemente la activación de mastocitos.',
        keyLearningPoint: 'Tomar la muestra de Triptasa antes de las 2 horas de la crisis para el informe alergológico médico-legal.'
      },
      {
        id: 'q5',
        prompt: '¿Cuáles son los dos agentes más frecuentemente implicados en anafilaxia perioperatoria con mediación de IgE?',
        options: [
          'Paracetamol y Ondansetrón.',
          'Bloqueantes neuromusculares (ej. Rocuronio, Succinilcolina) y Antibióticos Betalactámicos (ej. Cefazolina, Penicilina).',
          'Solución salina al 0.9% y glucosa.',
          'Gases medicinales (Oxígeno medicinal).'
        ],
        correctIndex: 1,
        explanation: 'Los relajantes neuromusculares (por sus grupos amonio cuaternario) y los betalactámicos concentran más del 70% de las anafilaxias perioperatorias confirmadas.',
        keyLearningPoint: 'Siempre identificar el momento de inyección del relajante y del antibiótico al desatar la investigación de colapso.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El colapso cardiovascular precoz post-inducción con taquicardia extrema y broncoespasmo es un shock anafiláctico hasta demostrar lo contrario. La adrenalina EV precoz y fluidos masivos son el salvamento fundamental.',
      guidelineReference: 'French Society of Anaesthesia and Intensive Care (SFAR) / Resuscitation Council UK Anaphylaxis Guidelines.',
      authorPearls: 'Dr. Carlos Leal: "No esperes a ver ronchas en la piel para pensar en anafilaxia; en quirófano la anafilaxia se presenta como un colapso de presión inexplicable y un pulmón rígido."'
    }
  }
];

import { EXPANDED_CLINICAL_CASES } from './clinicalCaseBankExpansion';
import { CLINICAL_CASES_PART3 } from './clinicalCaseBankPart3';
import { CLINICAL_CASES_PART4 } from './clinicalCaseBankPart4';

export const CLINICAL_CASE_BANK: AdvancedSimulationCase[] = [
  ...INITIAL_CLINICAL_CASES,
  ...EXPANDED_CLINICAL_CASES,
  ...CLINICAL_CASES_PART3,
  ...CLINICAL_CASES_PART4
];


import { AdvancedSimulationCase } from './clinicalCaseBank';

export const CLINICAL_CASES_PART4: AdvancedSimulationCase[] = [
  // CASO 21
  {
    id: 'case-airway-foreign-body-pediatric-trachea',
    title: 'Obstrucción Respiratoria Alta por Cuerpo Extraño Subglótico en Lactante Mayor',
    blindTitle: 'Lactante con Estridor Bifásico Agudo, Tiraje Subcostal y Desaturación Crítica',
    category: 'Pediatría',
    difficulty: 'Experto',
    patient: 'Lactante de 14 meses, 10.5 kg, traído de urgencia por episodio súbito de tos expulsiva mientras jugaba con piezas plásticas pequeñas.',
    surgery: 'Laringotraqueoscopía directa con óptica rígida y extracción de cuerpo extraño.',
    timeInSurgery: 'Minuto 5 en quirófano de urgencias pediátricas',
    initialVitals: {
      fc: 172,
      paSystolic: 78,
      paDiastolic: 42,
      paMean: 54,
      spo2: 76,
      etco2: 52,
      temp: 36.8,
      fr: 48,
      ecgRhythm: 'Taquicardia sinusal hipóxica reactiva',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal rápida a 172 lpm con ondas P altas y ausencia de arritmias ventriculares iniciales, secundaria a estrés hipóxico extremo.',
    imaging: {
      type: 'RX-REAL',
      title: 'Radiografía Cervicotorácica AP y Lateral de Cuello',
      badge: 'IMPACTO SUBGLÓTICO RADIOPACO',
      description: 'Cuerpo extraño ovalado de densidad metálica/plástica alojado inmediatamente por debajo de las cuerdas vocales en la región subglótica traqueal, con marcado edema de partes blandas.',
      realImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Cuerpo extraño subglótico de alto riesgo asfíctico por desplazamiento traqueal distal.'
    },
    criticalContext: 'El lactante presenta tiraje universal severo (supraesternal, intercostal y subcostal), aleteo nasal y balanceo de cabeza ("head bobbing"). Al intentar acostarlo en decúbito supino, el estridor se vuelve inaudible por obstrucción casi completa y la SpO2 cae en picada de 88% a 76%.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la estrategia de inducción anestésica de elección para este lactante con cuerpo extraño en vía aérea superior?',
        options: [
          'Inducción inhalatoria con Sevoflurano a concentraciones crecientes manteniendo la ventilación espontánea y administración de O2 al 100%, evitando relajantes neuromusculares.',
          'Inducción rápida con Propofol 4 mg/kg y Rocuronio 1.2 mg/kg en bolo para paralizarlo de inmediato.',
          'Sedación con Ketamina intramuscular sola en la sala de espera.',
          'Intubación a ciegas por vía nasal con tubo con manguito.'
        ],
        correctIndex: 0,
        explanation: 'Preservar la ventilación espontánea es el principio cardinal: paralizar al niño suprime el gradiente de presión transmural y el tono de la vía aérea, provocando que el cuerpo extraño ocluya totalmente la luz traqueal con imposibilidad de ventilar.',
        keyLearningPoint: 'En cuerpos extraños de vía aérea: NUNCA usar relajantes musculares antes de asegurar la extracción o sobrepasar la obstrucción.'
      },
      {
        id: 'q2',
        prompt: 'Durante la inducción inhalatoria, el niño hace un esfuerzo inspiratorio vigoroso y el cuerpo extraño desciende impactándose en la carina traqueal, causando apnea y silencio auscultatorio bilateral. ¿Cuál es la maniobra de salvamento?',
        options: [
          'Introducir de inmediato el tubo orotraqueal o la óptica y empujar intencionalmente el cuerpo extraño hacia el bronquio principal derecho para liberar la carina y ventilar el pulmón izquierdo.',
          'Administrar compresiones abdominales vigorosas (Maniobra de Heimlich en decúbito) mientras el paciente duerme.',
          'Esperar a que el niño tosa bajo anestesia profunda.',
          'Punción cricotiroidea con catéter 24G.'
        ],
        correctIndex: 0,
        explanation: 'En obstrucción carinal total ("no entra ni sale aire"), empujar el objeto hacia un bronquio fuente libera el flujo hacia el hemitórax contralateral. Es preferible tener un pulmón ventilado que dos pulmones bloqueados.',
        keyLearningPoint: 'Un pulmón ventilado salva la vida del niño mientras se prepara la pinza extractora con broncoscopía rígida.'
      },
      {
        id: 'q3',
        prompt: 'Lograda la extracción exitosa del cuerpo extraño, el niño presenta estridor post-extubación por edema subglótico agudo. ¿Cuál es el tratamiento médico inmediato de primera línea?',
        options: [
          'Adrenalina racémica o Adrenalina corriente (1:1000, 0.5 mL/kg hasta máx 5 mL) nebulizada con oxígeno + Dexametasona EV (0.6 mg/kg).',
          'Furosemida intravenosa 2 mg/kg.',
          'Antibióticos parenterales y reposo en cuna.',
          'Reintubación inmediata con tubo 2 números más grande.'
        ],
        correctIndex: 0,
        explanation: 'La adrenalina nebulizada produce vasoconstricción alfa-1 en la mucosa subglótica tumefacta reduciendo el edema en 10-30 minutos, mientras la dexametasona previene la recurrencia inflamatoria.',
        keyLearningPoint: 'Adrenalina nebulizada + Dexametasona resuelven el edema subglótico traumático post-extracción.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El cuerpo extraño en la vía aérea pediátrica es una emergencia de alta tensión. El respeto absoluto a la respiración espontánea, la ausencia de relajantes y la habilidad de empujar el objeto a un bronquio si obstruye la carina son las tres claves que salvan vidas.',
      guidelineReference: 'APAGBI Guidelines on Foreign Body Airway Obstruction in Children / PALS.',
      authorPearls: 'Dr. Carlos Leal: "En niños con sospecha de cuerpo extraño traqueal, no dejes que nadie le inyecte un relajante neuromuscular: el esfuerzo inspiratorio del propio niño es tu único seguro de vida hasta que la pinza lo atrape."'
    }
  },

  // CASO 22
  {
    id: 'case-neuro-airway-cervical-unstable-c2',
    title: 'Manejo de Vía Aérea en Politraumatizado con Fractura Inestable C1-C2 (Odontoides)',
    blindTitle: 'Traumatismo Raquimedular Cervical Alto con Inestabilidad y Riesgo de Tetraplejía',
    category: 'Vía Aérea',
    difficulty: 'Experto',
    patient: 'Masculino de 35 años arrollado, con inmovilizador cervical rígido tipo Filadelfia y TAC que confirma fractura desplazada de apófisis odontoides tipo II.',
    surgery: 'Fijación posterior urgente de columna cervical C1-C2.',
    timeInSurgery: 'Ingreso inmediato a Quirófano Central de Neurocirugía',
    initialVitals: {
      fc: 58,
      paSystolic: 88,
      paDiastolic: 48,
      paMean: 61,
      spo2: 93,
      etco2: 39,
      temp: 36.2,
      fr: 14,
      ecgRhythm: 'Bradicardia sinusal con tono simpático deprimido',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia sinusal a 58 lpm asociada a hipotensión relativa, compatible con choque neurogénico leve por contusión medular cervical alta.',
    imaging: {
      type: 'TAC-REAL',
      title: 'Tomografía Computarizada Axial y Reconstrucción Sagital Cervical',
      badge: 'FRACTURA DE ODONTOIDES TIPO II DESPLAZADA',
      description: 'Solución de continuidad ósea en la base del proceso odontoides con desplazamiento posterior de 4 mm hacia el canal medular anterior y riesgo inminente de sección bulbo-medular.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/CT_of_hangman%27s_fracture.jpg',
      findingsSummary: 'Inestabilidad atlantoaxoidea crítica con alto riesgo de cuadriplejía irreversible ante extensión cervical.'
    },
    criticalContext: 'El paciente se encuentra consciente con collarín rígido. Cualquier hiperextensión del cuello durante una laringoscopía convencional directa podría protruir la odontoides fracturada contra el bulbo o la médula alta causando paro respiratorio o tetraplejía permanente.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la técnica de elección de intubación para evitar cualquier movimiento de la columna cervical en este paciente cooperador?',
        options: [
          'Intubación con Fibrobroncoscopio flexible o Videolaringoscopio con pala de hiperangulada y estabilización manual en línea (MILS) con el paciente despierto bajo anestesia tópica de la vía aérea.',
          'Laringoscopía directa convencional con pala Macintosh 4 extendiendo fuertemente la cabeza (Posición de olfateo forzada).',
          'Inducción con Tiopental y relajación con Succinilcolina a ciegas.',
          'Punción percutánea traqueal inmediata sin evaluar la vía oral.'
        ],
        correctIndex: 0,
        explanation: 'La intubación con fibrobroncoscopio en paciente despierto o videolaringoscopía hiperangulada con MILS permite visualizar la glotis sin desplazar las vértebras cervicales, confirmando además el estado neurológico motor post-procedimiento.',
        keyLearningPoint: 'La estabilización manual en línea (MILS) y los dispositivos ópticos evitan la extensión cervical que causaría lesión medular.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la función del operador asignado a la Estabilización Manual en Línea (MILS) durante la intubación?',
        options: [
          'Sujetar firmemente la apófisis mastoides y el occipucio con ambas manos contra la mesa quirúrgica para neutralizar los movimientos de flexión, extensión y rotación cervical.',
          'Traccionar vigorosamente la cabeza hacia el techo para estirar el cuello.',
          'Introducir la cánula orofaríngea de Guedel.',
          'Apretar la tráquea con fuerza hacia la derecha.'
        ],
        correctIndex: 0,
        explanation: 'MILS consiste en contrarrestar activamente cualquier fuerza transmitida a la columna cervical por el laringoscopista, manteniendo el cuello en posición neutra estricta.',
        keyLearningPoint: 'MILS no es tracción, es fijación bimanual neutra de la cabeza contra el plano de la camilla.'
      },
      {
        id: 'q3',
        prompt: 'En el paciente con traumatismo medular cervical agudo de más de 48 horas de evolución, ¿qué fármaco inductor neuromuscular está FORMALMENTE CONTRAINDICADO por inducir paro cardíaco por hiperkalemia?',
        options: [
          'Succinilcolina.',
          'Rocuronio.',
          'Atracurio.',
          'Vecuronio.'
        ],
        correctIndex: 0,
        explanation: 'La denervación muscular aguda genera proliferación masiva de receptores nicotínicos inmaduros (alfa-7 y gamma). La succinilcolina desata una salida masiva letal de potasio extracelular con parada cardíaca en asistolia o FV.',
        keyLearningPoint: 'Denervación o lesión medular > 48 horas = Succinilcolina absolutamente prohibida.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El politraumatizado con lesión cervical inestable exige máxima disciplina en vía aérea. La intubación vigil con fibrobroncoscopio o videolaringoscopio hiperangulado bajo MILS previene el daño medular secundario iatrogénico.',
      guidelineReference: 'ATLS 10th Ed / Neurotrauma Guidelines on Airway Management in Cervical Spine Trauma.',
      authorPearls: 'Dr. Carlos Leal: "En una fractura de odontoides, el laringoscopio rígido tradicional es un arma mortal si hiperextiendes el cuello; usa videolaringoscopía o fibrobroncoscopio y mantén la cabeza en posición neutra estricta."'
    }
  },

  // CASO 23
  {
    id: 'case-cardiac-tamponade-perioperative-echo',
    title: 'Taponamiento Cardíaco Agudo con Colapso Diastólico de Cavidades Derechas',
    blindTitle: 'Hipotensión Refractaria, Ingurgitación Yugular y Ruidos Cardíacos Velados post-Cirugía Torácica',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Femenina de 56 años, en posoperatorio inmediato de mediastinoscopía y biopsia ganglionar por sospecha de linfoma.',
    surgery: 'Revisión toracoscópica de urgencia por hemotórax / hematoma pericárdico.',
    timeInSurgery: 'Minuto 15 tras ingreso a pabellón de choque',
    initialVitals: {
      fc: 132,
      paSystolic: 62,
      paDiastolic: 48,
      paMean: 52,
      spo2: 89,
      etco2: 19,
      temp: 36.1,
      fr: 26,
      ecgRhythm: 'Taquicardia sinusal con alternancia eléctrica de complejos QRS',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Clásico patrón de alternancia eléctrica del QRS (variación cíclica de la amplitud latido a latido) por oscilación pendular del corazón dentro de la bolsa pericárdica a tensión.',
    imaging: {
      type: 'ECO-REAL',
      title: 'Ecocardiograma FOCUSED / ETE Transtorácico a la Cabecera (POCUS)',
      badge: 'COLAPSO DIASTÓLICO DE AURÍCULA Y VD',
      description: 'Líquido pericárdico circumferential anecoico masivo (> 350 mL) con colapso diastólico precoz de la pared libre del ventrículo derecho y aurícula derecha, con vena cava inferior pletórica sin colapso inspiratorio.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Hemorragic_effusion.jpg',
      findingsSummary: 'Taponamiento pericárdico a tensión con restricción severa del llenado ventricular diastólico.'
    },
    criticalContext: 'La paciente presenta la Tríada de Beck completa: hipotensión severa (62/48 mmHg), ingurgitación de venas yugulares hasta el ángulo mandibular y ruidos cardíacos lejanos o inaudibles. Al inducir la ventilación con presión positiva con presión pico de 24 cmH2O, la presión arterial se vuelve indetectable.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Por qué la inducción anestésica general convencional con presión positiva puede provocar colapso cardiovascular irreversible inmediato en taponamiento cardíaco?',
        options: [
          'Porque la vasodilatación de los anestésicos sumada a la elevación de la presión intratorácica por la ventilación con presión positiva anulan por completo el retorno venoso a un ventrículo derecho ya comprimido por el líquido pericárdico.',
          'Porque los halogenados neutralizan el líquido pericárdico.',
          'Porque el pericardio absorbe los hipnóticos.',
          'Por hipoglicemia refleja aguda.'
        ],
        correctIndex: 0,
        explanation: 'En el taponamiento, el gasto cardíaco depende críticamente de un gradiente de llenado venoso elevado y una frecuencia cardíaca rápida. Suprimir el tono simpático y aplicar presión intratorácica positiva colapsa el retorno venoso a cero.',
        keyLearningPoint: 'Mantener la respiración espontánea y no inducir anestesia general profunda hasta que el cirujano esté listo con el bisturí o se descomprima el pericardio.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la primera intervención de rescate antes o en simultáneo con la apertura quirúrgica?',
        options: [
          'Pericardiocentesis subxifoidea de emergencia guiada por ecografía (con extracción de incluso solo 20-50 mL de líquido para despresurizar el saco) y reanimación agresiva con volumen intravascular.',
          'Infusión de 5 litros de agua destilada.',
          'Administrar verapamilo para frenar la taquicardia.',
          'Administrar bloqueantes neuromusculares en la sala de recuperación.'
        ],
        correctIndex: 0,
        explanation: 'La curva de distensibilidad pericárdica es exponencial: evacuar una pequeña cantidad de líquido (20-50 mL) reduce drásticamente la presión intrapericárdica y recupera el llenado diastólico de inmediato.',
        keyLearningPoint: 'Evacuar apenas 30 mL de sangre del pericardio cambia radicalmente la hemodinámica de un taponamiento mortal.'
      },
      {
        id: 'q3',
        prompt: 'En el soporte inotrópico y vasopresor de puente hacia la ventana pericárdica, ¿cuál es el agente vasoactivo preferido para mantener el tono vascular periférico y el cronotropismo?',
        options: [
          'Noradrenalina o Adrenalina a dosis tituladas para sostener la PAM y la perfusión coronaria.',
          'Beta-bloqueantes tipo Esmolol para reducir el consumo miocárdico.',
          'Nitroglicerina intravenosa.',
          'Nitroprusiato sódico.'
        ],
        correctIndex: 0,
        explanation: 'Se requiere mantener la vasoconstricción venosa/arterial para forzar el retorno y la taquicardia refleja para sostener el gasto (Gasto = Volumen sistólico restringido x Frecuencia cardíaca alta).',
        keyLearningPoint: 'Los betabloqueantes y vasodilatadores están formalmente contraindicados en taponamiento cardíaco.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El taponamiento cardíaco es el prototipo de choque obstructivo. Reconocer la tríada de Beck, confirmar con POCUS a la cabecera del paciente y descomprimir el pericardio antes de inducir relajación o ventilación con presión positiva previene la asistolia inmediata.',
      guidelineReference: 'ESC Guidelines on the Management of Pericardial Diseases / ASA Practice Advisory for Cardiac Tamponade.',
      authorPearls: 'Dr. Carlos Leal: "En taponamiento pericárdico, si duermes y relajas al paciente antes de drenar el saco, el monitor te premiará con un paro cardíaco inmediato; mantén al paciente respirando y drena primero."'
    }
  },

  // CASO 24
  {
    id: 'case-obstetric-amniotic-fluid-embolism',
    title: 'Embolia de Líquido Amniótico (ELA) con Paro Cardíaco y Coagulopatía de Consumo',
    blindTitle: 'Gestante en Trabajo de Parto con Disnea Aguda Súbita, Convulsión y Sangrado Incoagulable',
    category: 'Obstetricia',
    difficulty: 'Experto',
    patient: 'Multípara de 33 años, embarazo gemelar a término, en fase activa de trabajo de parto bajo analgesia epidural.',
    surgery: 'Cesárea de rescate perimortem y laparotomía de control de daños.',
    timeInSurgery: 'Minuto 2 tras ruptura espontánea de membranas ovulares',
    initialVitals: {
      fc: 154,
      paSystolic: 45,
      paDiastolic: 20,
      paMean: 28,
      spo2: 55,
      etco2: 9,
      temp: 35.8,
      fr: 34,
      ecgRhythm: 'Taquicardia sinusal extrema con depresión de ST y patrón de falla de VD',
      ecgLead: 'V1'
    },
    ecgStripType: 'st-elevation',
    ecgFindingDescription: 'Sobrecarga masiva de cavidades derechas con desviación axial extrema a la derecha, bloqueo incompleto de rama derecha e infradesnivel severo del ST.',
    imaging: {
      type: 'LAB-REAL',
      title: 'Tromboelastometría Rotacional (ROTEM) y Coagulación de Urgencia',
      badge: 'CID FULMINANTE CON COÁGULO PLANO',
      description: 'Trazo ROTEM completamente plano (ausencia de formación de fibrina), Fibrinógeno sérico no dosable (< 40 mg/dL), Plaquetas < 28.000/mcL y Dímero D desbordado (> 35.000 ng/mL).',
      realImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Coagulopatía intravascular diseminada (CID) fulminante con hiperfibrinolisis secundaria a Embolia de Líquido Amniótico.'
    },
    criticalContext: 'Tras la rotura de membranas, la paciente grita "¡Me falta el aire, siento que me voy a morir!", presenta una convulsión tónico-clónica generalizada de 20 segundos y colapsa en apnea con cianosis marmórea. Se constata hemorragia profusa incoagulable ("agua de sangre") por genitales y por los sitios de venopunción.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la fisiopatología bifásica clásica del Síndrome de Embolia de Líquido Amniótico?',
        options: [
          'Fase 1: Vasoespasmo pulmonar masivo con falla e isquemia del ventrículo derecho y choque cardiogénico obstructivo; seguida de Fase 2: Falla ventricular izquierda, edema agudo de pulmón y CID fulminante por liberación masiva de factor tisular.',
          'Reacción asmática leve por broncoespasmo reflejo.',
          'Hiperpotasemia por rotura de eritrocitos fetales.',
          'Intoxicación local por bupivacaína epidural.'
        ],
        correctIndex: 0,
        explanation: 'El paso de detritos amnióticos al lecho vascular materno desencadena una tormenta anafilactoide con hipertensión pulmonar hiperaguda y falla del VD, sucedida por choque distributivo y coagulopatía de consumo brutal.',
        keyLearningPoint: 'El ELA es una reacción anafilactoide del embarazo que ataca el corazón derecho y la hemostasia simultáneamente.'
      },
      {
        id: 'q2',
        prompt: 'Si la gestante en paro cardiorrespiratorio no responde a las maniobras de RCP básica y avanzada en los primeros 4 minutos, ¿cuál es la conducta obstétrica salvadora mandatoria?',
        options: [
          'Histerotomía de Reanimación / Cesárea Perimortem inmediata en el minuto 4 con extracción fetal antes del minuto 5 en el mismo sitio del colapso.',
          'Trasladar a la paciente en ambulancia a otro hospital especializado.',
          'Suspender el masaje cardíaco y esperar 30 minutos.',
          'Esperar el parto vaginal con fórceps.'
        ],
        correctIndex: 0,
        explanation: 'Evacuar el útero grávido descomprime la vena cava inferior y la aorta, restituyendo el gasto cardíaco y la eficacia de las compresiones torácicas maternas, además de salvar al feto de la hipoxia cerebral.',
        keyLearningPoint: 'Regla de los 4 minutos: Histerotomía de reanimación en el minuto 4 para salvar a la madre y al neonato.'
      },
      {
        id: 'q3',
        prompt: '¿Cuál es el protocolo farmacológico experimental recomendado (Régimen A-OK) para soporte cardiovascular en Embolia de Líquido Amniótico?',
        options: [
          'Atropina (0.5 a 1.0 mg) + Ondansetrón (8 mg) + Ketorolaco (30 mg) intravenoso.',
          'Aspirina + Omeprazol + Potasio.',
          'Adrenalina pura sin otros fármacos.',
          'Sedación con midazolam.'
        ],
        correctIndex: 0,
        explanation: 'El protocolo A-OK (Atropina para vagolisis, Ondansetrón para bloquear receptores 5-HT3 del reflejo de Bezold-Jarisch y Ketorolaco para frenar tromboxanos) ha demostrado estabilizar la vasculatura pulmonar en reportes de casos mundiales.',
        keyLearningPoint: 'Atropina, Ondansetrón y Ketorolaco (A-OK) combaten la cascada inflamatoria y vasomotora pulmonar del ELA.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La Embolia de Líquido Amniótico es una de las emergencias más devastadoras de la obstetricia moderna. El reconocimiento precoz, la histerotomía perimortem en 4 minutos si hay paro y la transfusión balanceada masiva con reposición urgente de fibrinógeno son los únicos caminos de supervivencia.',
      guidelineReference: 'SMFM (Society for Maternal-Fetal Medicine) Consult Series #48: Amniotic Fluid Embolism.',
      authorPearls: 'Dr. Carlos Leal: "En embolia de líquido amniótico no pierdas tiempo en diagnósticos diferenciales: inicia RCP, pide el paquete de transfusión masiva y exige la cesárea en menos de 4 minutos si la madre no tiene pulso."'
    }
  },

  // CASO 25
  {
    id: 'case-trauma-flail-chest-pulmonary-contusion',
    title: 'Tórax Inestable (Volet Costal) con Contusión Pulmonar y Falla Ventilatoria Aguda',
    blindTitle: 'Politraumatizado con Respiración Paradojal, Crepitación Costal y Desaturación Severa',
    category: 'Traumatología',
    difficulty: 'Experto',
    patient: 'Masculino de 42 años, conductor en choque frontal de automóvil con deformidad torácica extensa contra el volante.',
    surgery: 'Fijación costal quirúrgica de urgencia (Osteosíntesis de pared torácica).',
    timeInSurgery: 'Minuto 20 tras estabilización inicial en Pabellón de Trauma',
    initialVitals: {
      fc: 130,
      paSystolic: 92,
      paDiastolic: 54,
      paMean: 66,
      spo2: 72,
      etco2: 49,
      temp: 35.9,
      fr: 38,
      ecgRhythm: 'Taquicardia sinusal con extrasístoles auriculares frecuentes',
      ecgLead: 'V4'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal a 130 lpm con taquiarritmias auriculares por contusión miocárdica traumática anterior asociada.',
    imaging: {
      type: 'TAC-REAL',
      title: 'Tomografía Torácica Tridimensional (Reconstrucción Ósea y Parénquima)',
      badge: 'VOLET COSTAL MULTISEGMENTARIO',
      description: 'Fracturas conminutas bilaterales de arcos costales 3 a 8 en dos puntos de cada costilla, creando un segmento parietal flotante con respiración paradójica y densa consolidación pulmonar por contusión alveolar masiva.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Flailchest3to9.png',
      findingsSummary: 'Tórax inestable con contusión pulmonar subyacente y marcada alteración V/Q.'
    },
    criticalContext: 'El hemitórax izquierdo del paciente se hunde durante la inspiración y protruye durante la espiración (movimiento paradójico). La auscultación revela murmullo vesicular abolido con estertores húmedos bilaterales. La SpO2 cae a 72% a pesar de mascarilla con reservorio y el paciente se agota muscularmente.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la causa primaria de la hipoxemia refractaria grave en un paciente con tórax inestable?',
        options: [
          'La contusión pulmonar subyacente (hemorragia alveolar, edema y microatelectasias que generan un gran shunt intrapulmonar no ventilado).',
          'La fractura de la clavícula ipsilateral.',
          'La disminución transitoria de las plaquetas.',
          'El consumo excesivo de carbohidratos en la dieta.'
        ],
        correctIndex: 0,
        explanation: 'Aunque el segmento costal flotante genera dolor y ventilación ineficaz, la verdadera causa del colapso gaseoso es el daño del parénquima pulmonar contundido que llena los alvéolos de sangre y exudado inflamatorio.',
        keyLearningPoint: 'El volet costal duele, pero la contusión pulmonar mata por hipoxemia por cortocircuito intrapulmonar (shunt).'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la estrategia ventilatoria intraoperatoria fundamental para estabilizar mecánicamente la pared torácica desde el interior?',
        options: [
          'Ventilación mecánica invasiva con presión positiva y PEEP titulada (férula neumática interna) con volumen corriente protector (6 mL/kg) para reclutar alvéolos colapsados.',
          'Apagar el ventilador y permitir respiración espontánea en posición supina plana.',
          'Insuflar con bolsa ambú sin válvula de presión.',
          'Hiperventilar con volúmenes de 18 mL/kg a presiones pico > 60 cmH2O.'
        ],
        correctIndex: 0,
        explanation: 'La ventilación con presión positiva actúa como una "férula neumática interna", manteniendo el segmento costal expandido junto con el resto de la caja torácica y mejorando la oxigenación.',
        keyLearningPoint: 'La PEEP actúa como férula neumática estabilizando el volet costal desde el interior del pulmón.'
      },
      {
        id: 'q3',
        prompt: 'En el manejo de fluidos en este paciente con contusión pulmonar, ¿por qué la sobrecarga agresiva de cristaloides es sumamente nociva?',
        options: [
          'Porque el endotelio capilar de las áreas contundidas está gravemente lesionado; cualquier exceso de agua y sodio se trasuda rápidamente hacia los alvéolos agravando el edema pulmonar no cardiogénico.',
          'Porque diluye la anestesia volátil.',
          'Porque induce calcificación costal inmediata.',
          'Porque enfría el ventilador mecánico.'
        ],
        correctIndex: 0,
        explanation: 'El pulmón contundido se comporta como un SDRA localizado. La reposición excesiva de cristaloides "ahoga" el parénquima traumatizado, transformando una contusión moderada en falla respiratoria catastrófica.',
        keyLearningPoint: 'Manejo hídrico juicioso y restrictivo en contusión pulmonar; guiar la reanimación por metas hemodinámicas sin encharcar el pulmón.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El volet costal con contusión pulmonar requiere una tríada terapéutica: 1° Analgesia regional agresiva (bloqueo paravertebral o epidural torácico), 2° Ventilación mecánica protectora con PEEP (férula interna), y 3° Restricción prudente de fluidos para no inundar el parénquima alveolar dañado.',
      guidelineReference: 'EAST (Eastern Association for the Surgery of Trauma) Guidelines on Flail Chest and Pulmonary Contusion.',
      authorPearls: 'Dr. Carlos Leal: "En contusión torácica masiva, no cometas el error común de infundir tres litros de salino por la presión baja: si inundas ese pulmón fracturado, el paciente morirá de SDRA en terapia intensiva."'
    }
  }
];

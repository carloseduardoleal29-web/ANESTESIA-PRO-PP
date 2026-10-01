import { AdvancedSimulationCase } from './clinicalCaseBank';

export const CLINICAL_CASES_PART3: AdvancedSimulationCase[] = [
  // CASO 16
  {
    id: 'case-air-embolism-craniotomy',
    title: 'Embolia Gaseosa Venosa Masiva en Neurocirugía en Posición Sedente',
    blindTitle: 'Disminución Exponencial de EtCO2 y Soplo en Rueda de Molino durante Cirugía de Fosa Posterior',
    category: 'Neuroanestesia',
    difficulty: 'Experto',
    patient: 'Masculino de 45 años con schwannoma vestibular de 4 cm en fosa craneal posterior.',
    surgery: 'Craneotomía suboccipital en posición sedente (Sitting Position).',
    timeInSurgery: 'Minuto 50 durante la apertura del seno venoso lateral',
    initialVitals: {
      fc: 135,
      paSystolic: 65,
      paDiastolic: 38,
      paMean: 47,
      spo2: 78,
      etco2: 14,
      temp: 36.4,
      fr: 16,
      ecgRhythm: 'Taquicardia sinusal con arritmias auriculares ectópicas',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal refleja con extrasístoles auriculares frecuentes y ondas P acuminadas por distensión auricular derecha aguda.',
    imaging: {
      type: 'ECO-REAL',
      title: 'Ecocardiograma Transesofágico (ETE) / Doppler Precordial Intraoperatorio',
      badge: 'BURBUJAS MASIVAS EN AURÍCULA DERECHA (NEVASCA)',
      description: 'Imagen patognomónica de ecogenicidad en "lluvia de nieve" continua inundando la aurícula y ventrículo derechos con bloqueo aéreo al flujo pulmonar ("air-lock").',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Air_embolism_in_the_descending_thoracic_aorta_after_CT_guided_lung_biopsy.jpg',
      findingsSummary: 'Embolia aérea venosa masiva originada por presión venosa negativa en senos durales abiertos.'
    },
    criticalContext: 'Mientras el neurocirujano coagula cerca del seno venoso, el Doppler precordial emite un sonido rugiente de interferencia ("soplo en rueda de molino"). El EtCO2 desciende bruscamente de 34 a 14 mmHg, la SpO2 cae a 78% y la presión arterial desciende a 65/38 mmHg.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Por qué la posición sedente en neurocirugía presenta un riesgo tan elevado de embolismo aéreo venoso?',
        options: [
          'Porque el sitio quirúrgico craneal se encuentra significativamente más alto que el corazón, generando una presión hidrostática negativa en los senos durales (que no se colapsan por estar adheridos al cráneo) que succiona aire ambiental directamente al torrente venoso.',
          'Porque la mesa quirúrgica produce corrientes estáticas.',
          'Porque el cerebro consume más oxígeno sentado.',
          'Por compresión del nervio ciático.'
        ],
        correctIndex: 0,
        explanation: 'Los senos durales son venas de paredes rígidas que no se colapsan al ser cortadas. Al estar por encima del nivel cardíaco, la presión intraluminal es subatmosférica, actuando como una bomba de succión que aspira aire hacia la aurícula derecha.',
        keyLearningPoint: 'En posición sentada, toda incisión en senos durales es una compuerta abierta a la entrada de aire ambiental.'
      },
      {
        id: 'q2',
        prompt: '¿Cuáles son las maniobras inmediatas que deben ejecutarse EN SIMULTÁNEO entre el anestesiólogo y el cirujano?',
        options: [
          'El cirujano inunda el campo con suero salino e identifica la vena sangrante; el anestesiólogo administra O2 al 100%, descontinúa óxido nitroso si se estuviera usando y aspira aire por el catéter venoso central multiperforado.',
          'Poner al paciente de pie inmediatamente.',
          'Aumentar la concentración de halogenados.',
          'Hacer punción lumbar de rescate.'
        ],
        correctIndex: 0,
        explanation: 'Inundar el campo detiene la entrada de aire adicional. Descontinuar N2O evita que el gas difunda aumentando el volumen de las burbujas atrapadas en el corazón.',
        keyLearningPoint: 'O2 100% + Inundar el campo + Aspirar catéter venoso central es la tríada de rescate inmediata.'
      },
      {
        id: 'q3',
        prompt: '¿Qué maniobra posicional de rescate (Posición de Durant) puede emplearse si el colapso hemodinámico no revierte?',
        options: [
          'Decúbito lateral izquierdo y Trendelenburg (cabeza abajo), para atrapar el aire en el ápex de la aurícula derecha y liberar el tracto de salida del ventrículo derecho.',
          'Posición sentada vertical extrema.',
          'Decúbito prono forzado.',
          'Inversión a 180 grados.'
        ],
        correctIndex: 0,
        explanation: 'La posición de Durant (Trendelenburg lateral izquierdo) desplaza la bolsa de aire hacia el vértice de la aurícula derecha, alejándola de la válvula pulmonar y aliviando la obstrucción al flujo sanguíneo hacia los pulmones.',
        keyLearningPoint: 'Posición de Durant libera la válvula pulmonar del tapón de aire.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El embolismo aéreo en fosa posterior exige detección ultra-precoz con Doppler o ETE y capnografía. La aspiración activa a través de catéter venoso central colocado en unión cavoauricular y la inundación del campo son las maniobras salvadoras de elección.',
      guidelineReference: 'Guidelines for Anesthesia in the Sitting Position / Neuroanesthesia Critical Care Protocols.',
      authorPearls: 'Dr. Carlos Leal: "En neurocirugía sentada, tus ojos deben estar fijos en el EtCO2 y tus oídos en el Doppler precordial; si escuchas el silbido del aire en el monitor, avisa antes de que el corazón se ahogue en su propia espuma."'
    }
  },

  // CASO 17
  {
    id: 'case-postpartum-hemorrhage-atony',
    title: 'Hemorragia Posparto Masiva por Atonía Uterina Refractaria (Protocolo EMOTIVE)',
    blindTitle: 'Sangrado Exanguinante Post-Cesárea con Útero Rígido Inerte y Shock Hipovolémico',
    category: 'Obstetricia',
    difficulty: 'Experto',
    patient: 'Secundigesta de 31 años con embarazo gemelar a término y polihidramnios tras cesárea.',
    surgery: 'Cesárea segmentaria transperitoneal.',
    timeInSurgery: 'Minuto 15 post-alumbramiento fetal y placentario',
    initialVitals: {
      fc: 140,
      paSystolic: 62,
      paDiastolic: 30,
      paMean: 40,
      spo2: 88,
      etco2: 18,
      temp: 35.1,
      fr: 28,
      ecgRhythm: 'Taquicardia sinusal rápida con ondas P acuminadas',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal a 140 lpm con complejos estrechos y signos de hipotensión severa por colapso del volumen intravascular efectivo.',
    imaging: {
      type: 'ECO-REAL',
      title: 'Ultrasonido Pélvico Obstétrico Transabdominal Inmediato',
      badge: 'ATONÍA UTERINA CON COÁGULOS MASIVOS',
      description: 'Útero aumentado de tamaño, flácido ("en bolsa"), con cavidad endometrial distendida por más de 1200 mL de sangre retenida y coágulos organizados sin miotaponamiento fisiológico.',
      realImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Falta de contracción de las ligaduras vivas de Pinard post-sobredistensión uterina.'
    },
    criticalContext: 'Tras la extracción de ambos fetos y la placenta, el útero no se contrae y permanece completamente atónico ("como un trapo"). El sangrado vaginal y por histerotomía supera los 1500 mL en 6 minutos. La paciente se torna pálida, sudorosa e hipotensa (62/30 mmHg), con gasometría que muestra déficit de bases de -10 y hemoglobina que cae de 12 a 5.8 g/dL.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la primera línea farmacológica uterotónica de administración inmediata según el protocolo EMOTIVE / OMS?',
        options: [
          'Oxitocina: bolo intravenoso lento de 3 a 5 UI diluidas en 2-3 minutos, seguido de una infusión continua de 20 a 40 UI en 500 mL de cristaloides.',
          'Bolo no diluido de 20 UI de oxitocina en inyección rápida directa.',
          'Ergonovina en pacientes con hipertensión arterial no controlada.',
          'Protamina sódica.'
        ],
        correctIndex: 0,
        explanation: 'La oxitocina es el fármaco de primera línea. Administrar bolos rápidos no diluidos produce vasodilatación sistémica catastrófica, hipotensión severa y colapso cardiovascular.',
        keyLearningPoint: 'La oxitocina debe administrarse en bolos lentos y diluidos según la regla de los 3 (Rule of Threes) para evitar el colapso vascular.'
      },
      {
        id: 'q2',
        prompt: 'Si persiste la atonía y el sangrado a pesar de la oxitocina, ¿cuáles son los uterotónicos de segunda línea y sus contraindicaciones cardinales?',
        options: [
          'Metilergonovina (0.2 mg IM; contraindicada absolutamente en Preeclampsia/Hipertensión) y Carboprost/PGF2-alfa (0.25 mg IM; contraindicado en Asma bronquial), además de Misoprostol rectal/sublingual (800 mcg).',
          'Atropina y Neostigmina.',
          'Dobutamina y Dopamina intrauterina.',
          'Heparina sódica continua.'
        ],
        correctIndex: 0,
        explanation: 'La metilergonovina provoca vasoespasmo hipertensivo severo (riesgo de ACV en preeclampsia) y el carboprost induce broncoespasmo grave en asmáticos. Conocer estas contraindicaciones previene eventos adversos críticos.',
        keyLearningPoint: 'Nunca administrar ergonovina a una preeclámptica ni carboprost a una paciente asmática.'
      },
      {
        id: 'q3',
        prompt: '¿En qué momento debe activarse el Protocolo de Transfusión Masiva (PTM) en hemorragia posparto y cuál es la meta de fibrinógeno?',
        options: [
          'Activación inmediata ante sangrado > 1500 mL o inestabilidad hemodinámica refractaria con paquete balanceado 1:1:1 (Glóbulos Rojos : Plasma : Plaquetas), manteniendo fibrinógeno sérico > 200 mg/dL (con Crioprecipitados o Concentrado de Fibrinógeno).',
          'Solo tras 24 horas de sangrado continuo.',
          'Mantener fibrinógeno por debajo de 80 mg/dL.',
          'Transfundir solo solución glucosada sin derivados hemáticos.'
        ],
        correctIndex: 0,
        explanation: 'En obstetricia, el fibrinógeno normal al término del embarazo es de 400-600 mg/dL. Un valor inferior a 200 mg/dL tiene un valor predictivo positivo del 100% para progresión a hemorragia posparto masiva.',
        keyLearningPoint: 'El fibrinógeno es el primer factor de coagulación que se agota críticamente en la hemorragia obstétrica. Reponer tempranamente con crioprecipitados o concentrado de fibrinógeno.'
      },
      {
        id: 'q4',
        prompt: '¿Qué rol fundamental cumple el Ácido Tranexámico (TXA) según el estudio WOMAN Trial?',
        options: [
          'Administrar 1 gramo EV en 10 minutos en las primeras 3 horas del inicio del sangrado reduce en un 30% la muerte materna por hemorragia sin incrementar eventos trombóticos.',
          'Acelera la retracción uterina miocárdica.',
          'Reemplaza a los hemoderivados por completo.',
          'Solo sirve si se inyecta directamente en el endometrio.'
        ],
        correctIndex: 0,
        explanation: 'El WOMAN Trial demostró que el ácido tranexámico precoz (< 3 horas) salva vidas al inhibir la hiperfibrinolisis secundaria al desprendimiento placentario y traumatismo quirúrgico.',
        keyLearningPoint: 'Administrar 1 g de Ácido Tranexámico precozmente ante toda hemorragia obstétrica significativa.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La hemorragia posparto por atonía es la primera causa prevenible de mortalidad materna. La secuencia salvadora incluye: 1° Uterotónicos escalonados (Oxitocina -> Metilergometrina/Carboprost/Misoprostol), 2° Ácido Tranexámico precoz, 3° Balón de taponamiento intrauterino (Bakri) o suturas compresivas (B-Lynch), y 4° Transfusión hemostática precoz guiada a fibrinógeno > 200 mg/dL.',
      guidelineReference: 'WHO Recommendations for the Prevention and Treatment of Postpartum Haemorrhage / FIGO Guidelines.',
      authorPearls: 'Dr. Carlos Leal: "En hemorragia obstétrica, no midas la sangre en gasas contadas: cree en la palidez de la paciente y en el monitor. Transfunde sangre y fibrinógeno temprano antes de que la paciente caiga en la coagulopatía de consumo."'
    }
  },

  // CASO 18
  {
    id: 'case-neonatal-congenital-diaphragmatic-hernia',
    title: 'Hernia Diafragmática Congénita e Hipertensión Pulmonar Persistente en Quirófano Neonatal',
    blindTitle: 'Recién Nacido con Tórax Excavado, Ruidos Hidroaéreos Torácicos y Desaturación Crítica',
    category: 'Pediatría',
    difficulty: 'Experto',
    patient: 'Recién nacido a término, 39 semanas, 3.1 kg, diagnóstico prenatal de Hernia Diafragmática Congénita izquierda.',
    surgery: 'Reparación quirúrgica de defecto diafragmático.',
    timeInSurgery: 'Minuto 20 tras incisión subcostal y reducción de vísceras',
    initialVitals: {
      fc: 168,
      paSystolic: 44,
      paDiastolic: 22,
      paMean: 29,
      spo2: 68,
      etco2: 56,
      temp: 36.6,
      fr: 45,
      ecgRhythm: 'Taquicardia sinusal con severa sobrecarga de ventrículo derecho',
      ecgLead: 'V1'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Ondas R prominentes en V1 e inversión profunda de onda T compatible con presiones pulmonares suprasistémicas e hipertrofia del ventrículo derecho neonatal.',
    imaging: {
      type: 'RX-REAL',
      title: 'Radiografía de Tórax y Abdomen Neonatal Portátil',
      badge: 'ASAS INTESTINALES EN TÓRAX IZQUIERDO',
      description: 'Múltiples asas intestinales ocupando el hemitórax izquierdo con ausencia de aire en hemiabdomen inferior y marcada desviación de la silueta cardíaca y mediastino hacia el hemitórax derecho contralateral.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Peritoneopericardial_diaphragmatic_hernia.JPG/1000px-Peritoneopericardial_diaphragmatic_hernia.JPG',
      findingsSummary: 'Hernia de Bochdalek izquierda con hipoplasia pulmonar bilateral severa y persistencia de circulación fetal.'
    },
    criticalContext: 'Al reintroducir las asas intestinales en la cavidad abdominal hipoplásica, la compliance pulmonar se reduce a valores mínimos. La SpO2 preductal (mano derecha) marca 82% mientras la postductal (pie) cae a 58% (shunt derecha a izquierda a través del conducto arterioso persistente). La presión pico sube a 38 cmH2O y el neonato entra en crisis de hipertensión pulmonar suprasistémica.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Por qué la ventilación con mascarilla facial y bolsa está ESTRICTAMENTE PROHIBIDA en la reanimación inicial de este recién nacido en sala de partos?',
        options: [
          'Porque el gas insuflado distiende el estómago y las asas intestinales herniadas dentro del tórax, comprimiendo catastróficamente el pulmón contralateral y el corazón.',
          'Porque daña las fosas nasales del neonato.',
          'Porque induce hipotermia inmediata.',
          'Porque desvía el esófago hacia la tráquea.'
        ],
        correctIndex: 0,
        explanation: 'Cualquier intento de ventilación con máscara introduce aire en el tracto digestivo ubicado en el tórax, expandiendo el contenido herniado como un balón que aplasta el único pulmón funcional y estrangula el retorno venoso.',
        keyLearningPoint: 'En Hernia Diafragmática Congénita: Intubación endotraqueal inmediata en el minuto cero sin tocar la mascarilla facial.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la estrategia de ventilación mecánica intraoperatoria recomendada para prevenir el neumotórax fatal del pulmón contralateral hipoplásico?',
        options: [
          'Estrategia de ventilación gentil con hipercapnia permisiva (presión inspiratoria pico limitada a < 22-25 cmH2O, volumen corriente bajo 4-6 mL/kg y PEEP moderada 3-5 cmH2O).',
          'Forzar volúmenes corrientes de 15 mL/kg para reclutar el pulmón.',
          'Hiperventilación agresiva con presiones de 40 cmH2O.',
          'Ventilar con aire comprimido sin PEEP.'
        ],
        correctIndex: 0,
        explanation: 'El pulmón contralateral al defecto diafragmático también es hipoplásico y extremadamente frágil. El barotrauma genera neumotórax contralateral, complicación que conlleva una mortalidad superior al 80%.',
        keyLearningPoint: 'Ventilación pulmonar gentil con hipercapnia permisiva (pH > 7.25, PaCO2 45-60) previene el barotrauma mortal.'
      },
      {
        id: 'q3',
        prompt: '¿Cuál es el vasodilatador pulmonar selectivo de elección para revertir la crisis de hipertensión pulmonar y el shunt derecha-izquierda en este neonato?',
        options: [
          'Óxido Nítrico Inhalado (iNO) a 20 ppm administrado directamente en el circuito respiratorio.',
          'Nitroprusiato sódico sistémico.',
          'Enalaprilato intravenoso.',
          'Salbutamol por sonda gástrica.'
        ],
        correctIndex: 0,
        explanation: 'El óxido nítrico inhalado vasodilata exclusivamente los vasos de los alvéolos ventilados sin generar hipotensión sistémica, reduciendo la postcarga del ventrículo derecho y revirtiendo el shunt ductal.',
        keyLearningPoint: 'Óxido Nítrico Inhalado a 20 ppm es la terapia estándar para crisis hipertensiva pulmonar neonatal refractaria.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La hernia diafragmática congénita no es una urgencia quirúrgica anatómica sino una emergencia médica de hipertensión pulmonar e hipoplasia. La intubación directa sin máscara, la ventilación mecánica gentil con limitación de presiones y el uso de óxido nítrico inhalado son los pilares de la supervivencia neonatal.',
      guidelineReference: 'CDH EURO Consortium Consensus Guidelines for the Management of Congenital Diaphragmatic Hernia.',
      authorPearls: 'Dr. Carlos Leal: "En el neonato con diafragma roto, no luches contra el ventilador forzando presiones altas; romper el pulmón sano con tu propio exceso de presión es el error más devastador. Protege el pulmón con presiones suaves y calma la circulación pulmonar."'
    }
  },

  // CASO 19
  {
    id: 'case-autonomic-dysreflexia-quadriplegia',
    title: 'Disreflexia Autonómica Masiva Intraoperatoria en Paciente con Lesión Medular Alta',
    blindTitle: 'Crisis Hipertensiva Paroxística Severa con Bradicardia Extrema durante Cistoscopia',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Masculino de 28 años, tetrapléjico por lesión medular completa a nivel C6 hace 2 años.',
    surgery: 'Cistoscopia y litotricia vesical con láser.',
    timeInSurgery: 'Minuto 15 durante la distensión vesical con líquido de irrigación',
    initialVitals: {
      fc: 34,
      paSystolic: 235,
      paDiastolic: 130,
      paMean: 165,
      spo2: 96,
      etco2: 32,
      temp: 37.0,
      fr: 14,
      ecgRhythm: 'Bradicardia sinusal severa con extrasístoles ventriculares en salvas',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia refleja extrema a 34 lpm mediada por estimulación vagal con acortamiento del QT e inversión asimétrica de ondas T secundarias a postcarga extrema.',
    imaging: {
      type: 'TAC-REAL',
      title: 'Tomografía Computarizada Cerebral sin Contraste de Emergencia',
      badge: 'HEMORRAGIA INTRACRANEAL DESCARTADA / RIESGO VASCULAR',
      description: 'Estudio de neuroimagen vascular que muestra ingurgitación masiva de vasos corticales cerebrales por presión de perfusión sistémica > 230 mmHg, con riesgo crítico de rotura aneurismática o ictus hemorrágico.',
      realImageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Crisis paroxística simpática masiva desinhibida por debajo del nivel de lesión medular.'
    },
    criticalContext: 'Durante la infusión de solución para distender la vejiga, el paciente presenta cefalea pulsatil terebrante atroz, congestión facial intensa con diaforesis profusa por encima del nivel C6 y piel pálida con piloerección helada por debajo del nivel. El monitor marca una presión arterial desorbitada de 235/130 mmHg y la frecuencia cardíaca se desploma a 34 lpm.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el mecanismo fisiopatológico fundamental de la Disreflexia Autonómica en pacientes con lesión medular por encima de T6?',
        options: [
          'Un estímulo nociceptivo por debajo de la lesión (ej. distensión vesical o rectal) desencadena una descarga simpática masiva desinhibida en la médula espinal aislada, que no puede ser frenada por las vías inhibitorias descendentes del tronco encefálico.',
          'Alergia a la sonda Foley.',
          'Reabsorción tóxica del líquido de irrigación (Síndrome RTU).',
          'Insuficiencia suprarrenal aguda.'
        ],
        correctIndex: 0,
        explanation: 'El arco reflejo espinal simpático induce vasoconstricción arteriolar masiva esplácnica y periférica. El encéfalo detecta la hipertensión a través de barorreceptores carotídeos y estimula el nervio vago (bradicardia refleja), pero la señal inhibitoria no cruza la médula lesionada, perpetuando la crisis hipertensiva.',
        keyLearningPoint: 'Hipertensión severa + Bradicardia + Sudoración por encima del nivel de lesión = Disreflexia autonómica.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la primera acción no farmacológica inmediata que debe tomarse?',
        options: [
          'Detener de inmediato el estímulo quirúrgico, evacuar el líquido de irrigación de la vejiga (descomprimir la sonda) e incorporar al paciente sentándolo a 90 grados para inducir estasis venosa postural.',
          'Colocar en Trendelenburg profundo.',
          'Administrar bolos de atropina para subir la frecuencia cardíaca.',
          'Inyectar adrenalina 1 mg.'
        ],
        correctIndex: 0,
        explanation: 'Descomprimir la vejiga remueve el estímulo nociceptivo gatillo. Incorporar al paciente a posición sentada vertical aprovecha la vasodilatación fisiológica en extremidades inferiores denervadas para descender la presión arterial por gravedad.',
        keyLearningPoint: 'Eliminar el estímulo gatillo y sentar al paciente: la descompresión vesical resuelve la mayoría de las crisis si se hace al instante.'
      },
      {
        id: 'q3',
        prompt: 'Si la presión arterial sistólica permanece por encima de 180 mmHg tras evacuar la vejiga, ¿cuáles son los fármacos antihipertensivos de acción ultracorta recomendados?',
        options: [
          'Nitroprusiato de sodio en infusión titulada, Nitroglicerina, Nicardipino o Urapidil intravenoso.',
          'Betabloqueantes no selectivos (Propranolol) que empeorarían la bradicardia extrema.',
          'Gluconato de calcio.',
          'Sedación exclusiva con fentanilo.'
        ],
        correctIndex: 0,
        explanation: 'Se requieren vasodilatadores arteriales directos de acción rápida y vida media ultracorta para evitar un rebote hipotensivo severo una vez cese el estímulo medular.',
        keyLearningPoint: 'Evitar betabloqueantes puros porque exacerban la bradicardia vagal refleja que ya tiene el paciente.'
      },
      {
        id: 'q4',
        prompt: '¿Qué técnica anestésica previene de forma más eficaz la disreflexia autonómica en procedimientos urológicos o ginecológicos en lesionados medulares?',
        options: [
          'Anestesia espinal (raquídea) con nivel sensitivo adecuado que bloquea por completo la transmisión de los impulsos reflejos aferentes simpáticos en la médula lumbosacra.',
          'Anestesia local tópica exclusivamente.',
          'Ninguna anestesia porque el paciente no siente dolor somático.',
          'Sedación superficial con benzodiacepinas.'
        ],
        correctIndex: 0,
        explanation: 'Aunque el paciente esté insensible y paralizado por su lesión medular, el reflejo autonómico espinal está hiperactivo. La anestesia raquídea bloquea el arco reflejo a nivel radicular impidiendo la disreflexia.',
        keyLearningPoint: 'Aunque el paciente con sección medular no sienta dolor, SIEMPRE requiere anestesia para bloquear el reflejo neurovegetativo.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La disreflexia autonómica puede generar hemorragia cerebral, convulsiones o infarto de miocardio en pacientes con lesión medular alta. La prevención mediante anestesia regional espinal, la descompresión inmediata del órgano pélvico distendido y los vasodilatadores de acción rápida salvan al paciente de una catástrofe cardiovascular.',
      guidelineReference: 'Consensus Guidelines on Autonomic Dysreflexia in Spinal Cord Injury / British Journal of Anaesthesia.',
      authorPearls: 'Dr. Carlos Leal: "Nunca operes a un paciente parapléjico o tetrapléjico sin anestesia creyendo que no siente nada; el sistema simpático de su médula no duerme y puede desatar una tormenta hipertensiva mortal."'
    }
  },

  // CASO 20
  {
    id: 'case-transurethral-resection-turp-syndrome',
    title: 'Síndrome de Resección Transuretral (RTU) con Hiponatremia Severa Dilucional e Intoxicación Hídrica',
    blindTitle: 'Confusión Mental Súbita, Bradicardia e Hipertensión en Resección Prostática con Glicina',
    category: 'Vía Aérea',
    difficulty: 'Experto',
    patient: 'Masculino de 74 años, hipertenso, sometido a resección transuretral de próstata (adenoma de 90 gramos).',
    surgery: 'RTU de próstata monopolar con irrigación de Glicina al 1.5%.',
    timeInSurgery: 'Minuto 75 de cirugía bajo anestesia raquídea T10',
    initialVitals: {
      fc: 42,
      paSystolic: 185,
      paDiastolic: 105,
      paMean: 132,
      spo2: 91,
      etco2: 36,
      temp: 35.2,
      fr: 22,
      ecgRhythm: 'Bradicardia sinusal con ensanchamiento de QRS e inversión de T',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia refleja con ensanchamiento progresivo del complejo QRS (>120 ms) e inversión difusa de la onda T secundaria a hipoosmolaridad plasmática e hiponatremia aguda.',
    imaging: {
      type: 'LAB-REAL',
      title: 'Panel Gasométrico y Electrolitos en Sangre Arterial Intraoperatoria',
      badge: 'HIPONATREMIA CRÍTICA EXTREMA (Na+ 108 mEq/L)',
      description: 'Ionograma urgente que revela Sodio sérico de 108 mEq/L (basal de 139), Osmolaridad plasmática calculada de 235 mOsm/kg e hipervolemia dilucional con hematocrito desplomado de 42% a 26%.',
      realImageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Absorción masiva endovascular de líquido de irrigación hipoosmolar a través de senos venosos prostáticos abiertos.'
    },
    criticalContext: 'Durante el procedimiento prolongado con torre de irrigación a 90 cm de altura, el paciente (bajo anestesia raquídea) se torna súbitamente agitado, confuso y desorientado en tiempo y espacio. Refiere náuseas intensas, pérdida de la visión ("veo todo borroso y gris") y opresión torácica. La presión arterial sube a 185/105 mmHg y la frecuencia cardíaca cae a 42 lpm.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la triada patológica que define al Síndrome de RTU (Síndrome de Intoxicación Hídrica)?',
        options: [
          'Hipervolemia aguda (sobrecarga circulatoria inicial) + Hipoosmolaridad e Hiponatremia aguda dilucional (< 120 mEq/L) + Toxicidad metabólica específica por el soluto de irrigación (ej. glicina).',
          'Hiperpotasemia + Hipernatremia + Acidosis láctica.',
          'Hipotensión + Hipotermia + Hipoglicemia.',
          'Fiebre + Leucocitosis + Anuria.'
        ],
        correctIndex: 0,
        explanation: 'La apertura de senos venosos prostáticos permite que el líquido de irrigación a presión entre directamente a la circulación sistémica. La absorción de 1 a 3 litros de solución libre de electrolitos diluye rápidamente el sodio plasmático y colapsa la osmolaridad.',
        keyLearningPoint: 'El sodio desciende rápidamente provocando edema cerebral agudo con hipertensión endocraneana y edema pulmonar.'
      },
      {
        id: 'q2',
        prompt: '¿Por qué la anestesia raquídea despierta (con nivel sensitivo T10) es la técnica de elección en RTU de próstata en lugar de la anestesia general?',
        options: [
          'Porque permite la comunicación verbal continua con el paciente, reconociendo el deterioro neurológico precoz (inquietud, confusión, alteraciones visuales) antes de las convulsiones o el coma.',
          'Porque la anestesia general destruye los senos prostáticos.',
          'Porque el paciente debe ayudar a pujar.',
          'Porque los fármacos inhalados anulan el efecto de la glicina.'
        ],
        correctIndex: 0,
        explanation: 'El primer síntoma de edema cerebral por hiponatremia es neurológico: confusión, mareo, cefalea y ceguera transitoria por glicina. Con anestesia general estos signos pasan inadvertidos hasta que sobreviene el edema pulmonar o arritmias irreversibles.',
        keyLearningPoint: 'El estado mental del paciente bajo raquídea es el mejor monitor de Síndrome de RTU.'
      },
      {
        id: 'q3',
        prompt: 'Ante un sodio sérico de 108 mEq/L con síntomas neurológicos graves y edema cerebral, ¿cuál es el tratamiento correctivo específico?',
        options: [
          'Solución salina hipertónica al 3% (ej. infusión de 100 mL en 10-15 minutos, repetible hasta elevar el sodio en 4-6 mEq/L y revertir los síntomas neurológicos agudos), junto con Furosemida EV (20 a 40 mg).',
          'Infusión rápida de 2 litros de agua destilada.',
          'Administración de bicarbonato 8.4% a goteo rápido.',
          'Insulina y glucosa.'
        ],
        correctIndex: 0,
        explanation: 'La solución salina hipertónica al 3% restablece la osmolaridad intravascular frenando la entrada de agua a las neuronas edematosas. La furosemida ayuda a eliminar el exceso de agua corporal libre sin agravar la pérdida proporcional de sodio.',
        keyLearningPoint: 'Tratar el edema cerebral con Salina al 3% para subir el sodio de la zona de peligro inmediato (>120 mEq/L).'
      },
      {
        id: 'q4',
        prompt: '¿A qué metabolito de la glicina se atribuye el síntoma específico de ceguera transitoria o visión borrosa amaurotica durante el síndrome de RTU?',
        options: [
          'La glicina actúa como un neurotransmisor inhibitorio en la retina (retina avascular) y su degradación genera amonio (hiperamonemia).',
          'La glicina cristaliza en el cristalino.',
          'Desprendimiento mecánico de la retina por alta presión venosa.',
          'Trombosis de la arteria oftálmica.'
        ],
        correctIndex: 0,
        explanation: 'La glicina es un aminoácido que ejerce un potente efecto inhibitorio en las sinapsis de la retina, produciendo pérdida temporal de la visión (amaurosis fugax de la RTU), que revierte a medida que el soluto es aclarado.',
        keyLearningPoint: 'La pérdida de la agudeza visual durante la RTU es patognomónica de intoxicación por glicina.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El Síndrome de RTU es una emergencia hidroelectrolítica severa. Se previene limitando el tiempo quirúrgico (< 60 minutos), reduciendo la altura de la bolsa de irrigación (< 60 cm) y utilizando tecnologías bipolares con solución salina isotónica. El tratamiento de la hiponatremia sintomática con solución hipertónica al 3% previene la herniación cerebral y el paro.',
      guidelineReference: 'EAU (European Association of Urology) Guidelines on Male Lower Urinary Tract Symptoms / TURP Management.',
      authorPearls: 'Dr. Carlos Leal: "En una resección de próstata que se alarga más de una hora, habla con el paciente cada 5 minutos; si empieza a balbucear o te dice que ve borroso, detén la cirugía de inmediato y pide electrolitos al laboratorio."'
    }
  }
];

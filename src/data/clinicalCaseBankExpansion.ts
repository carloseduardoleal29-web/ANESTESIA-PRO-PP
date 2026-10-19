import { AdvancedSimulationCase } from './clinicalCaseBank';

export const EXPANDED_CLINICAL_CASES: AdvancedSimulationCase[] = [
  // CASO 6
  {
    id: 'case-hyperkalemia-cardiac-arrest',
    title: 'Paro por Hiperpotasemia Severa Aguda en Insuficiencia Renal Crónica',
    blindTitle: 'Paciente con Deterioro Rápido del ECG y Bradicardia Severa Intraoperatoria',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Masculino de 62 años, diabético con ERC estadio 5 en hemodiálisis (última diálisis hace 4 días por fístula trombosada).',
    surgery: 'Fistulectomía y confección urgente de acceso vascular con prótesis.',
    timeInSurgery: 'Minuto 25 bajo sedación profunda / bloqueo plexo braquial',
    initialVitals: {
      fc: 38,
      paSystolic: 72,
      paDiastolic: 40,
      paMean: 50,
      spo2: 91,
      etco2: 24,
      temp: 36.1,
      fr: 14,
      ecgRhythm: 'Ritmo idioventricular lento, ondas T picudas y ensanchamiento de QRS',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'QRS marcadamente ensanchado (>180 ms) fusionado con ondas T hiperagudas simétricas y pérdida de ondas P (patrón sinusoidal pre-paro).',
    imaging: {
      type: 'ECG-REAL',
      title: 'Registro Electrocardiográfico de 12 Derivaciones',
      badge: 'TRAZADO CRÍTICO ONDA T PICUDA',
      description: 'Ondas T simétricas acuminadas de base estrecha en precordiales y DII, alargamiento extremo del PR y ensanchamiento progresivo del complejo QRS que evoluciona a onda sinusoidal.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/ECG_in_hyperkalemia.svg/1000px-ECG_in_hyperkalemia.svg.png',
      findingsSummary: 'Hiperkalemia severa (K+ estimado > 7.5 mEq/L) con inminencia de paro en asistolia o fibrilación ventricular.'
    },
    criticalContext: 'El paciente se torna somnoliento e hipotenso. El monitor alerta por bradicardia extrema a 38 lpm. En la pantalla del monitor, los complejos QRS se deforman haciéndose anchos y bizarros, y las ondas T se vuelven gigantes y picudas.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el primer fármaco que debe inyectarse DE INMEDIATO por vía intravenosa para estabilizar la membrana miocárdica antes de descender el potasio?',
        options: [
          'Gluconato de calcio al 10% (10 a 20 mL) o Cloruro de calcio al 10% (5 a 10 mL) intravenoso lento.',
          'Insulina regular 10 UI con 50 mL de glucosa al 50%.',
          'Sulfato de magnesio 2 gramos en infusión de 20 minutos.',
          'Furosemida 40 mg en bolo.'
        ],
        correctIndex: 0,
        explanation: 'El calcio antagoniza de forma inmediata los efectos electrofisiológicos tóxicos del potasio en la membrana de los miocitos, restaurando el potencial umbral sin alterar la concentración sérica de K+.',
        keyLearningPoint: 'El Gluconato de calcio no baja el potasio, pero salva el corazón de fibrilar o pararse en los próximos 2 minutos.'
      },
      {
        id: 'q2',
        prompt: 'Administrado el calcio, ¿cuál es la combinación farmacológica de elección para introducir el potasio extracelular al interior de la célula en quirófano?',
        options: [
          'Solución polarizante: 10 UI de Insulina cristalina regular en 50 gramos de glucosa (Dextrosa al 10% o 50%) administrada en 15-30 minutos, junto con nebulización de Salbutamol.',
          'Infusión de dopamina a dosis dopaminérgica pura.',
          'Bicarbonato sódico en megadosis sin insulina.',
          'Administrar manitol al 20% a chorro.'
        ],
        correctIndex: 0,
        explanation: 'La insulina estimula directamente la bomba Na+/K+ ATPasa, ingresando el potasio al espacio intracelular. La dextrosa previene la hipoglicemia severa y los agonistas beta-2 potencian la captación celular.',
        keyLearningPoint: 'Insulina regular + glucosa es el estándar de oro para redistribución rápida del potasio intraoperatorio.'
      },
      {
        id: 'q3',
        prompt: '¿Por qué el uso de Succinilcolina está TERMINANTEMENTE PROHIBIDO en pacientes con falla renal anúrica e hiperpotasemia conocida o sospechada?',
        options: [
          'Porque la succinilcolina eleva el potasio sérico entre 0.5 a 1.0 mEq/L de forma aguda, lo que en este paciente desataría asistolia inmediata.',
          'Porque produce bloqueo dual que dura más de 24 horas.',
          'Porque causa broncoespasmo intratable mediado por leucotrienos.',
          'Porque precipita en la orina formando cristales tubulares.'
        ],
        correctIndex: 0,
        explanation: 'La despolarización masiva del sarcolema por succinilcolina libera potasio intracelular a la circulación sistémica. En un paciente limítrofe, un incremento de 0.5-1.0 mEq/L resulta letal.',
        keyLearningPoint: 'En insuficiencia renal o sospecha de hipercalemia, la Succinilcolina está contraindicada; emplear Rocuronio.'
      },
      {
        id: 'q4',
        prompt: 'Si el paciente no orina nada (anuria por nefropatía terminal), ¿cuál es la medida definitiva para eliminar el exceso total de potasio del organismo?',
        options: [
          'Hemodiálisis de urgencia o terapia de reemplazo renal continua (TRRC).',
          'Enemas de agua tibia cada 2 horas.',
          'Aumentar la PEEP a 15 cmH2O.',
          'Administrar ácido acetilsalicílico.'
        ],
        correctIndex: 0,
        explanation: 'Las soluciones con insulina, salbutamol y calcio son transitorias (duran 2-4 horas). Sin función renal, la única vía de eliminación definitiva del exceso corporal de potasio es la diálisis.',
        keyLearningPoint: 'Coordinar la hemodiálisis postoperatoria de emergencia inmediatamente tras estabilizar el caso.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La hiperpotasemia severa es una emergencia electrizante. El algoritmo secuencial salvador es: 1° Proteger el corazón (Gluconato de Calcio EV), 2° Meter el K+ a la célula (Insulina + Glucosa + Salbutamol) y 3° Coordinar diálisis urgente.',
      guidelineReference: 'ERC/AHA Guidelines for Resuscitation in Special Circumstances: Hyperkalaemic Cardiac Arrest.',
      authorPearls: 'Dr. Carlos Leal: "Cuando veas que el QRS se ensancha y la onda T se afila en un paciente renal, no dudes: inyecta calcio de inmediato antes de que el monitor marque una línea recta."'
    }
  },

  // CASO 7
  {
    id: 'case-hyperthermia-malignant',
    title: 'Hipertermia Maligna Fulminante intraoperatoria inducida por Sevoflurano',
    blindTitle: 'Crisis Hipermetabólica Inexplicable con Hipercapnia Extrema y Rigidez Maseterina',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Adolescente masculino de 16 años, sometido a reducción abierta y fijación interna de fractura mandibular.',
    surgery: 'Osteosíntesis mandibular bajo anestesia general inhalatoria.',
    timeInSurgery: 'Minuto 35 de mantenimiento con Sevoflurano al 2.5%',
    initialVitals: {
      fc: 162,
      paSystolic: 175,
      paDiastolic: 105,
      paMean: 128,
      spo2: 92,
      etco2: 88,
      temp: 39.4,
      fr: 24,
      ecgRhythm: 'Taquicardia sinusal marcada con extrasístoles ventriculares frecuentes',
      ecgLead: 'V5'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal a 162 lpm con extrasistolia ventricular multifocal y signos de sobrecarga ventricular.',
    imaging: {
      type: 'CAPNOGRAFÍA',
      title: 'Registro de Capnografía y Analizador de Gases en Espiración',
      badge: 'HIPERCAPNIA INCONTROLABLE (EtCO2 > 80)',
      description: 'Elevación exponencial del dióxido de carbono espirado final (EtCO2 de 35 a 88 mmHg) a pesar de triplicar el volumen minuto del ventilador, con cal sodada caliente y virada a violeta.',
      realImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Gasto metabólico celular desbordado patognomónico de crisis de Hipertermia Maligna.'
    },
    criticalContext: 'A los 35 minutos de cirugía, el anestesiólogo nota que el absorbedor de cal sodada se encuentra hirviendo y ha virado de color. El EtCO2 sube imparablemente a 88 mmHg a pesar de hiperventilar. El paciente presenta taquicardia extrema (162 lpm), sudoración profusa y rigidez muscular generalizada tipo "tabla". La temperatura vesical se dispara a 39.4°C.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el primer signo más PRECOZ y sensible de una crisis de Hipertermia Maligna en quirófano?',
        options: [
          'La hipertermia extrema (> 41°C).',
          'El aumento desproporcionado e inexplicable del EtCO2 resistente a la hiperventilación, acompañado de taquicardia sinusal.',
          'La cianosis periférica.',
          'La oligoanuria súbita.'
        ],
        correctIndex: 1,
        explanation: 'La hipertermia es un signo tardío. El primer indicador más temprano y constante es el hipermetabolismo muscular reflejado en la producción masiva de CO2 (EtCO2 elevado) y taquicardia simpática.',
        keyLearningPoint: 'No esperes a que el paciente tenga 40°C para diagnosticar Hipertermia Maligna; el EtCO2 elevado fuera de control es la alarma primaria.'
      },
      {
        id: 'q2',
        prompt: '¿Cuáles son las DOS acciones inmediatas que deben realizarse en el segundo cero al sospechar Hipertermia Maligna?',
        options: [
          'Cerrar inmediatamente el vaporizador de Sevoflurano/halogenado, pedir ayuda y ventilar con O2 al 100% a flujos altos (>10 L/min).',
          'Administrar antibióticos de amplio espectro por presunta sepsis.',
          'Profundizar con Isoflurano para disminuir el consumo metabólico.',
          'Aplicar mantas térmicas calientes para vasodilatar la piel.'
        ],
        correctIndex: 0,
        explanation: 'Descontinuar los agentes gatillo (gases halogenados y succinilcolina) y purgar el circuito con O2 al 100% a flujos máximos es el primer acto para detener la cascada de activación del receptor de rianodina RYR1.',
        keyLearningPoint: 'Apagar el vaporizador y avisar a todo el equipo quirúrgico: la Hipertermia Maligna requiere movilización inmediata de todo el personal.'
      },
      {
        id: 'q3',
        prompt: '¿Cuál es el antídoto específico indispensable y la dosis de ataque recomendada?',
        options: [
          'Dantroleno sódico intravenoso a dosis de 2.5 mg/kg en bolo rápido repetible hasta ceder los síntomas (máximo 10 mg/kg).',
          'Bromocriptina oral por sonda nasogástrica.',
          'Protamina sódica 50 mg.',
          'Paracetamol 1 gramo en infusión lenta.'
        ],
        correctIndex: 0,
        explanation: 'El Dantroleno actúa bloqueando directamente los receptores de rianodina (RYR1) en el retículo sarcoplásmico del músculo esquelético, frenando la salida masiva de calcio al citosol.',
        keyLearningPoint: 'Dantroleno 2.5 mg/kg IV en bolo inmediato. Requiere diluir cada frasco de 20 mg con 60 mL de agua destilada esterilizada sin conservantes.'
      },
      {
        id: 'q4',
        prompt: '¿Qué bloqueante de canales de calcio está ABSOLUTAMENTE CONTRAINDICADO administrar junto con Dantroleno debido a riesgo de colapso cardiovascular fatal e hiperpotasemia severa?',
        options: [
          'Verapamilo o Diltiazem.',
          'Nifedipino sublingual.',
          'Sulfato de magnesio.',
          'Lidocaína en aerosol.'
        ],
        correctIndex: 0,
        explanation: 'La combinación de Dantroleno con antagonistas de los canales de calcio no dihidropiridínicos (verapamilo/diltiazem) desencadena colapso miocárdico refractario e hipercalemia mortal.',
        keyLearningPoint: 'Nunca usar Verapamilo ni Diltiazem para tratar la taquicardia o hipertensión durante una crisis de Hipertermia Maligna.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La Hipertermia Maligna es un trastorno farmacogenético letal si no se actúa en minutos. La sospecha clínica ante EtCO2 elevado incontrolable, el cese del gas halogenado y la administración precoz de Dantroleno (2.5 mg/kg) salvan la vida.',
      guidelineReference: 'MHAUS (Malignant Hyperthermia Association of the United States) / European Malignant Hyperthermia Group (EMHG).',
      authorPearls: 'Dr. Carlos Leal: "Ten presente dónde está el carro de Dantroleno en tu hospital. En una crisis de Hipertermia Maligna, la dilución de los frascos de Dantroleno exige manos de todo el servicio colaborando en sincronía."'
    }
  },

  // CASO 8
  {
    id: 'case-local-anesthetic-toxicity',
    title: 'Toxicidad Sistémica por Anestésicos Locales (LAST) tras Bloqueo Supraclavicular',
    blindTitle: 'Convulsión Inesperada y Colapso Circulatorio durante Procedimiento de Anestesia Regional',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Femenina de 34 años, 52 kg, programada para osteosíntesis de muñeca (fractura de Colles).',
    surgery: 'Bloqueo ecoguiado de plexo braquial vía supraclavicular.',
    timeInSurgery: 'Minuto 2 tras finalizar la inyección de 20 mL de Bupivacaína al 0.5%',
    initialVitals: {
      fc: 44,
      paSystolic: 55,
      paDiastolic: 30,
      paMean: 38,
      spo2: 85,
      etco2: 18,
      temp: 36.6,
      fr: 8,
      ecgRhythm: 'Bloqueo AV completo con disociación y complejos QRS anchos',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia extrema con ensanchamiento masivo del QRS y ectopias ventriculares debidas a fijación prolongada de Bupivacaína a los canales de sodio cardíacos.',
    imaging: {
      type: 'ECO-REAL',
      title: 'Ecografía Doppler Vascular del Cuello / Supraclavicular',
      badge: 'INYECCIÓN INTRAVASCULAR',
      description: 'Punta de aguja en proximidad íntima con la arteria subclavia con señal turbulenta en modo Doppler Color que sugiere microinyección o difusión intravascular inadvertida.',
      realImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'LAST agudo inducido por absorción intravascular acelerada de aminoamida cardiotóxica.'
    },
    criticalContext: 'A los 90 segundos de culminar la infiltración, la paciente refiere sabor metálico amargo, mareo intenso y zumbido de oídos (acúfenos). Rápidamente pierde el conocimiento, presenta una convulsión tónico-clónica generalizada y cae en bradicardia extrema con hipotensión profunda (55/30 mmHg).',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuáles son los primeros síntomas prodrómicos neurológicos que deben alertar al anestesiólogo de LAST inminente?',
        options: [
          'Parestesias peribucales, sabor metálico en la boca, acúfenos auditivos y disartria o confusión mental.',
          'Dolor cólico abdominal difuso.',
          'Pérdida de la sensibilidad en miembros inferiores.',
          'Erupción maculopapular pruriginosa.'
        ],
        correctIndex: 0,
        explanation: 'El sistema nervioso central es el primero en manifestar toxicidad por anestésicos locales debido a la inhibición selectiva de las vías inhibitorias corticales.',
        keyLearningPoint: 'La comunicación verbal continua con el paciente durante y después del bloqueo regional es la mejor alarma temprana de toxicidad.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es el tratamiento específico de rescate y antídoto universal para el colapso por LAST?',
        options: [
          'Emulsión lipídica al 20% (Intralipid): bolo inicial de 1.5 mL/kg en 2-3 minutos, seguido de infusión continua a 0.25 mL/kg/min.',
          'Bolo de bicarbonato sódico 500 mL.',
          'Infusión de amiodarona 300 mg en bolo directo rápido.',
          'Administración de propofol al 1% en megadosis para sedación.'
        ],
        correctIndex: 0,
        explanation: 'La emulsión lipídica al 20% atrapa las moléculas lipofílicas de anestésico local del plasma y miocardio (mecanismo lipid sink), reactivando la función mitocondrial y los canales iónicos miocárdicos.',
        keyLearningPoint: 'El propofol NO es un sustituto de los lípidos al 20% porque su formulación lipídica es escasa y su efecto depresor miocárdico empeora el colapso.'
      },
      {
        id: 'q3',
        prompt: 'Durante la reanimación cardiopulmonar en LAST, ¿qué modificación en la dosis de Epinefrina (Adrenalina) recomiendan las guías ASRA?',
        options: [
          'Dosis reducidas de epinefrina (< 1 mcg/kg; ej. bolos de 10 a 100 mcg) para evitar arritmias malignas e isquemia miocárdica.',
          'Megadosis de epinefrina (bolos de 5 mg directos).',
          'No usar ningún vasoconstrictor bajo ninguna circunstancia.',
          'Sustituir epinefrina exclusivamente por sulfato de magnesio.'
        ],
        correctIndex: 0,
        explanation: 'Las dosis altas de adrenalina (estándar ACLS de 1 mg) empeoran la toxicidad miocárdica y reducen la eficacia de la emulsión lipídica, induciendo acidosis láctica y arritmias hiperadrenérgicas.',
        keyLearningPoint: 'En LAST: Reducir los bolos de adrenalina a dosis bajas tituladas (10-100 mcg en adultos).'
      },
      {
        id: 'q4',
        prompt: '¿Qué antiarrítmicos deben EVITARSE terminantemente durante el manejo del paro o arritmias por anestésicos locales?',
        options: [
          'Lidocaína, bloqueantes de canales de calcio (Verapamilo) y betabloqueantes.',
          'Amiodarona.',
          'Sulfato de magnesio.',
          'Suero fisiológico tibio.'
        ],
        correctIndex: 0,
        explanation: 'La lidocaína es otro anestésico local que se sumaría a la carga tóxica de bupivacaína, y los calcioantagonistas o betabloqueantes exacerban la depresión miocárdica ya crítica.',
        keyLearningPoint: 'Prohibido usar Lidocaína como antiarrítmico en una toxicidad por anestésicos locales.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El LAST es una emergencia con riesgo vital que puede presentarse tanto por punción intravascular como por absorción masiva tisular. El reconocimiento de los pródromos neurológicos y la infusión inmediata de Emulsión Lipídica al 20% con soporte hemodinámico cauteloso son los pilares del éxito.',
      guidelineReference: 'ASRA (American Society of Regional Anesthesia and Pain Medicine) Practice Advisory on Local Anesthetic Systemic Toxicity (LAST).',
      authorPearls: 'Dr. Carlos Leal: "Nunca pongas una aguja para bloqueo regional si no tienes a la vista la bolsa de lípidos al 20% y el equipo de vía aérea listo. La aspiración negativa previa no garantiza 100% que no estés en vaso."'
    }
  },

  // CASO 9
  {
    id: 'case-preeclampsia-eclampsia-crisis',
    title: 'Eclampsia Intraoperatoria con Crisis Hipertensiva y Desprendimiento Prematuro de Placenta',
    blindTitle: 'Gestante en Urgencia Quirúrgica con Convulsión Aguda y Cifras Tensionales Severas',
    category: 'Obstetricia',
    difficulty: 'Experto',
    patient: 'Primigesta de 19 años, 35 semanas de gestación, ingresa con cefalea pulsátil intensa, escotomas centelleantes y epigastralgia en barra.',
    surgery: 'Cesárea de urgencia por sufrimiento fetal agudo y DPPNI.',
    timeInSurgery: 'Ingreso a quirófano y preparación para anestesia',
    initialVitals: {
      fc: 124,
      paSystolic: 215,
      paDiastolic: 125,
      paMean: 155,
      spo2: 90,
      etco2: 34,
      temp: 37.1,
      fr: 26,
      ecgRhythm: 'Taquicardia sinusal con sobrecarga ventricular izquierda',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal reactiva a 124 lpm con signos de hipertrofia y sobrecarga sistólica de cavidades izquierdas (ondas R prominentes e inversión asimétrica de onda T).',
    imaging: {
      type: 'TAC-REAL',
      title: 'Tomografía Cerebral de Control (Neuroimagen Post-Crisis)',
      badge: 'SIGNO DE PRES (EDEMA VASOGÉNICO)',
      description: 'Corte axial que evidencia hipodensidades simétricas subcorticales en regiones parieto-occipitales correspondientes a Síndrome de Encefalopatía Posterior Reversible (PRES).',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Posterior_reversible_encephalopathy_syndrome_MRI.jpg',
      findingsSummary: 'Fallo de autorregulación vascular cerebral materna por crisis hipertensiva eclampsia-inducida.'
    },
    criticalContext: 'En la mesa quirúrgica, la paciente convulsiona tónicoclónicamente durante 70 segundos con pérdida de esfínteres, trismo y desaturación a 80%. La presión arterial es de 215/125 mmHg. Los latidos cardíacos fetales se auscultan en bradicardia persistente a 80 lpm.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es el fármaco de PRIMERA LÍNEA indiscutible para controlar las convulsiones eclámpticas y prevenir su recurrencia según la evidencia internacional?',
        options: [
          'Sulfato de Magnesio: dosis de ataque de 4 a 6 gramos EV en 20 minutos, seguida de infusión continua de 1 a 2 g/hora.',
          'Difenilhidantoína (Fenitoína) 1000 mg EV en infusión rápida.',
          'Diazepam 50 mg en bolo directo intramuscular.',
          'Tiopenetal sódico en goteo libre.'
        ],
        correctIndex: 0,
        explanation: 'El ensayo multicéntrico Collaborative Eclampsia Trial demostró fehacientemente que el Sulfato de Magnesio es superior a la fenitoína y al diazepam en reducir la recurrencia de convulsiones y la mortalidad materna.',
        keyLearningPoint: 'El Sulfato de Magnesio no es un sedante primario sino un neuroprotector que bloquea los receptores NMDA y genera vasodilatación cerebral.'
      },
      {
        id: 'q2',
        prompt: 'Para el control de la crisis hipertensiva severa (PA ≥ 160/110 mmHg) en esta gestante, ¿cuáles son los antihipertensivos parenterales de primera línea recomendados?',
        options: [
          'Labetalol intravenoso (bolos titulados de 20, 40, 80 mg) o Hidralazina (5 a 10 mg EV lentos).',
          'Nitroprusiato de sodio a dosis máximas de entrada.',
          'Enalaprilato o Captopril sublingual.',
          'Diuréticos de asa tipo Bumetanida a dosis masivas.'
        ],
        correctIndex: 0,
        explanation: 'Labetalol e Hidralazina son los fármacos de primera línea por su perfil de eficacia y seguridad uteroplacentaria. Los inhibidores de la ECA están contraindicados y el nitroprusiato se reserva como último recurso por toxicidad fetal por cianuro.',
        keyLearningPoint: 'La meta es reducir la PA a cifras de seguridad (140-150 / 90-100 mmHg) sin causar hipotensión brusca que comprometa el flujo placentario.'
      },
      {
        id: 'q3',
        prompt: 'Si se decide anestesia general por emergencia inmediata y bradicardia fetal extrema, ¿cuál es la consideración farmacológica crítica durante la intubación orotraqueal?',
        options: [
          'Atenuar obligatoriamente la respuesta vasopresora e hipertensiva a la laringoscopía (con remifentanilo, lidocaína o labetalol) para prevenir hemorragia cerebral o rotura vascular.',
          'Intubar sin ningún hipnótico para no deprimir al neonato.',
          'Hacer laringoscopía prolongada con pala recta.',
          'Evitar todo tipo de relajante muscular.'
        ],
        correctIndex: 0,
        explanation: 'El estímulo simpático de la laringoscopía en una gestante con eclampsia puede elevar la presión arterial sistólica por encima de 240 mmHg, provocando hemorragia intracraneal (primera causa de muerte materna en preeclampsia).',
        keyLearningPoint: 'Blinda la respuesta simpática a la laringoscopia: un bolo de opioide de acción ultracorta (remifentanilo) o lidocaína protege el cerebro materno.'
      },
      {
        id: 'q4',
        prompt: '¿Cuál es el antídoto específico que debe estar disponible a la cabecera del paciente en caso de intoxicación por Sulfato de Magnesio (ausencia de reflejo rotuliano, bradipnea < 12 rpm)?',
        options: [
          'Gluconato de Calcio al 10% (1 gramo EV lento en 3 a 5 minutos).',
          'Naloxona 0.4 mg EV.',
          'Flumazenil 0.5 mg EV.',
          'Fisostigmina.'
        ],
        correctIndex: 0,
        explanation: 'El ión calcio antagoniza directamente los efectos bloqueantes neuromusculares del magnesio a nivel de la unión neuromuscular y del centro respiratorio.',
        keyLearningPoint: 'El reflejo patelar es el primer centinela de toxicidad por magnesio: si desaparece, suspender infusión e indicar Gluconato de Calcio.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La eclampsia representa la máxima gravedad del espectro preeclámptico. Requiere estabilización inmediata de las convulsiones con Sulfato de Magnesio, control cauteloso pero enérgico de las cifras tensionales para proteger el lecho vascular cerebral materno y resolución obstétrica expedita.',
      guidelineReference: 'ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia / FIGO Guidelines.',
      authorPearls: 'Dr. Carlos Leal: "En preeclampsia con signos de gravedad, no te confíes de un paciente que se ve estable; la convulsión o el sangrado por DPPNI pueden desencadenarse en cuestión de minutos. Ten siempre preparado el sulfato de magnesio y el labetalol."'
    }
  },

  // CASO 10
  {
    id: 'case-tension-pneumoperitoneum-tamponade',
    title: 'Neumoperitoneo a Tensión con Colapso Cardiocirculatorio y Enfisema Subcutáneo Masivo',
    blindTitle: 'Colapso Hemodinámico Agudo y Alza de Presiones de Vía Aérea en Cirugía Laparoscópica',
    category: 'Vía Aérea',
    difficulty: 'Avanzado',
    patient: 'Masculino de 55 años, sometido a colecistectomía laparoscópica electiva.',
    surgery: 'Laparoscopía electiva con insuflación de CO2.',
    timeInSurgery: 'Minuto 12 tras colocación de trócares e insuflación peritoneal',
    initialVitals: {
      fc: 138,
      paSystolic: 60,
      paDiastolic: 32,
      paMean: 41,
      spo2: 81,
      etco2: 65,
      temp: 36.3,
      fr: 18,
      ecgRhythm: 'Taquicardia sinusal con bajo voltaje generalizado',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal refleja a 138 lpm con aplanamiento generalizado de complejos por incremento masivo de la impedancia toracoabdominal.',
    imaging: {
      type: 'RX-REAL',
      title: 'Radiografía de Tórax y Cuello Intraoperatoria',
      badge: 'NEUMOMEDIASTINO Y ENFISEMA MASIVO',
      description: 'Presencia de aire libre disecando fascias cervicales bilaterales, neumomediastino con despegamiento pleural y elevación masiva diafragmática bilateral por sobrepresión peritoneal.',
      realImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Complicación compresiva por fuga de CO2 retroperitoneal o insuflador descalibrado con presión intraabdominal > 28 mmHg.'
    },
    criticalContext: 'Tras la insuflación con CO2, el cirujano refiere dificultad técnica para ver la vesícula. Súbitamente, la presión pico en el ventilador sube de 19 a 46 cmH2O. La presión arterial del paciente cae en picada de 125/70 a 60/32 mmHg. Al palpar el cuello y el tórax superior del paciente se percibe crepitación masiva ("nieve pisada").',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la primera medida inmediata que el anestesiólogo debe exigir al equipo quirúrgico en este instante?',
        options: [
          'Desinsuflar inmediatamente el neumoperitoneo (abrir las válvulas de los trócares para evacuar todo el CO2) y suspender la insuflación.',
          'Aumentar la presión del insuflador a 30 mmHg para separar más las vísceras.',
          'Administrar 2 gramos de gluconato de calcio.',
          'Colocar al paciente en posición de litotomía forzada.'
        ],
        correctIndex: 0,
        explanation: 'El neumoperitoneo a tensión comprime la vena cava inferior disminuyendo drásticamente el retorno venoso y colapsando el gasto cardíaco, además de impedir la expansión diafragmática. La desinsuflación rápida restituye la hemodinámica.',
        keyLearningPoint: 'Ante cualquier colapso inexplicable durante laparoscopia: el primer paso es pedir a viva voz "¡Desinsuflen el abdomen ahora mismo!".'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es el mecanismo fisiopatológico del enfisema subcutáneo y neumomediastino durante este procedimiento?',
        options: [
          'Colocación del trocar o aguja de Veress en plano preperitoneal o retroperitoneal, disecando planos fasciales hasta el mediastino y cuello.',
          'Ruptura esofágica por tubo endotraqueal de calibre pequeño.',
          'Toxicidad alérgica al gas CO2.',
          'Fístula broncopleural congénita desconocida.'
        ],
        correctIndex: 0,
        explanation: 'La insuflación extraperitoneal inadvertida permite que el CO2 bajo presión diseque las fascias lajas del retroperitoneo, ascendiendo a través del hiato aórtico y esofágico hacia el mediastino y los tejidos blandos cervicales.',
        keyLearningPoint: 'Verificar la posición intraperitoneal correcta de los trócares antes de habilitar flujos altos de CO2.'
      },
      {
        id: 'q3',
        prompt: 'Si el paciente presenta hipoxemia persistente a pesar de desinsuflar el abdomen y auscultación hipoventilada en hemitórax izquierdo, ¿qué complicación pulmonar secundaria debe sospecharse?',
        options: [
          'Neumotórax por difusión de CO2 a través de defectos diafragmáticos congénitos o rotura de bulas.',
          'Atelectasia lobar inferior resuelta con espirometría.',
          'Sobredosis por relajante neuromuscular.',
          'Contusión pulmonar traumática previa.'
        ],
        correctIndex: 0,
        explanation: 'El CO2 a presión puede pasar al espacio pleural a través de hiatos diafragmáticos anómalos o inducir barotrauma alveolar provocando neumotórax que requiere descompresión si genera repercusión hemodinámica.',
        keyLearningPoint: 'Monitorear la ventilación bilateral y la presión pico continuamente en toda cirugía videolaparoscópica.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El neumoperitoneo no es inocuo. Las presiones intraabdominales elevadas (>15 mmHg) o la insuflación en falsas vías causan taponamiento por compresión venosa cava, enfisema mediastínico y acidosis hipercápnica severa. La desinsuflación rápida es el pilar de rescate.',
      guidelineReference: 'SAGES (Society of American Gastrointestinal and Endoscopic Surgeons) Guidelines for Laparoscopic Surgery.',
      authorPearls: 'Dr. Carlos Leal: "En laparoscopía, el anestesiólogo manda sobre el insuflador de CO2. Si el paciente se descompensa, abre los trócares sin pedir permiso; primero está la perfusión del corazón."'
    }
  },

  // CASO 11
  {
    id: 'case-transfusion-reaction-trali',
    title: 'Lesión Pulmonar Aguda Producida por Transfusión (TRALI) en Reemplazo Valvular',
    blindTitle: 'Hipoxemia Severa Súbita con Secreción Pulmonar Abundante tras Transfusión de Hemoderivados',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Masculino de 67 años, sometido a reemplazo de válvula aórtica bajo circulación extracorpórea.',
    surgery: 'Cirugía Cardiovascular con CEC.',
    timeInSurgery: 'Post-salida de CEC, tras transfundir 2 unidades de plasma fresco congelado y 1 pool de plaquetas',
    initialVitals: {
      fc: 118,
      paSystolic: 85,
      paDiastolic: 48,
      paMean: 60,
      spo2: 74,
      etco2: 22,
      temp: 38.3,
      fr: 22,
      ecgRhythm: 'Taquicardia sinusal con morfología regular',
      ecgLead: 'V5'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal reactiva sin elevación del segmento ST, con presiones de llenado ventricular izquierdo normales por ecocardiograma transesofágico (ETE).',
    imaging: {
      type: 'RX-REAL',
      title: 'Radiografía de Tórax Portátil en Quirófano Cardiovascular',
      badge: 'INFILTRADOS ALVEOLARES MASIVOS BILATERALES',
      description: 'Opacidades alveolares algodonosas bilaterales difusas de rápida instauración ("pulmón blanco") con silueta cardíaca de tamaño normal y sin signos de congestión venosa central.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Transfusion-related_acute_lung_injury_chest_X-ray.gif',
      findingsSummary: 'Edema pulmonar no cardiogénico por daño endotelial inmune (TRALI).'
    },
    criticalContext: 'A los 40 minutos de transfundir plasma fresco y plaquetas por sangrado microvascular difuso post-protamina, el paciente desatura catastróficamente de 98% a 74% con FiO2 al 100%. Por el tubo orotraqueal brota abundante fluido proteináceo no sanguinolento, la presión pico sube a 45 cmH2O y el ETE muestra función ventricular izquierda conservada con presión de oclusión capilar pulmonar (PCP) normal.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la causa fisiopatológica primaria del TRALI (Transfusion-Related Acute Lung Injury)?',
        options: [
          'Sobrecarga hidrostática de volumen por exceso de fluidos (TACO).',
          'Anticuerpos anti-HLA o anti-neutrófilos en el plasma del donante que activan los neutrófilos secuestrados en la microvasculatura pulmonar del receptor, causando daño endotelial y permeabilidad capilar masiva.',
          'Reacción hemolítica por incompatibilidad ABO del glóbulo rojo.',
          'Infección bacteriana transmitida por las plaquetas.'
        ],
        correctIndex: 1,
        explanation: 'El TRALI clásico mediado por inmunidad ocurre por la transferencia pasiva de anticuerpos del donante (típicamente donantes multíparas) dirigidos contra antígenos de los leucocitos del receptor, desatando una cascada inflamatoria destructiva alveolar.',
        keyLearningPoint: 'TRALI es edema pulmonar no cardiogénico con presiones de llenado cardíaco normales y secreción alveolar rica en proteínas.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la diferencia diagnóstica capital entre TRALI y TACO (Transfusion-Associated Circulatory Overload)?',
        options: [
          'En el TRALI la función ventricular izquierda es normal, la PVC/PCP están normales o bajas y no hay sobrecarga de volumen; en TACO hay elevación franca del BNP/NT-proBNP, hipertensión arterial y presiones de llenado marcadamente elevadas.',
          'No hay ninguna diferencia; son la misma entidad.',
          'El TRALI solo ocurre con glóbulos rojos lavados.',
          'El TACO siempre se acompaña de urticaria cutánea.'
        ],
        correctIndex: 0,
        explanation: 'El ecocardiograma transesofágico y la medición de la presión auricular/PCP son vitales: TACO responde a diuréticos por ser un edema hidrostático, mientras que el TRALI es edema por permeabilidad endotelial.',
        keyLearningPoint: 'La ecocardiografía intraoperatoria descarta rápidamente falla cardíaca izquierda frente a lesión pulmonar de permeabilidad.'
      },
      {
        id: 'q3',
        prompt: '¿Cuál es el tratamiento de soporte mandatorio en TRALI?',
        options: [
          'Interrumpir de inmediato la transfusión, soporte ventilatorio protector (volumen corriente bajo 6 mL/kg, PEEP titulada) y soporte hemodinámico cauteloso.',
          'Administrar 120 mg de furosemida en bolo directo con restricción absoluta.',
          'Continuar transfundiendo más plasma para expandir.',
          'Desconectar el ventilador y administrar oxígeno a bajo flujo.'
        ],
        correctIndex: 0,
        explanation: 'No existe antídoto farmacológico para TRALI. El tratamiento es de soporte intensivo con ventilación protectora similar al SDRA, evitando diuréticos agresivos que provocarían choque hipovolémico.',
        keyLearningPoint: 'Notificar inmediatamente al banco de sangre para retirar al donante del registro y evitar nuevos casos en otros receptores.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El TRALI es la principal causa de mortalidad asociada a transfusión de hemocomponentes con alto contenido plasmático. La diferenciación temprana con TACO mediante ecocardiografía y la ventilación mecánica protectora con PEEP salvan al paciente de la hipoxemia letal.',
      guidelineReference: 'International Consensus Conference on TRALI (2019 Definition & Management).',
      authorPearls: 'Dr. Carlos Leal: "Cada unidad de hemoderivado es un trasplante de tejido líquido; transfunde solo con indicación estricta y monitorea la mecánica ventilatoria con cada bolsa que entra."'
    }
  },

  // CASO 12
  {
    id: 'case-neuro-cushing-herniation',
    title: 'Herniación Cerebral Inminente con Tríada de Cushing durante Craneotomía por Tumor',
    blindTitle: 'Bradicardia Severa, Hipertensión Reactiva y Pupila Arreactiva en Neurocirugía',
    category: 'Neuroanestesia',
    difficulty: 'Experto',
    patient: 'Femenina de 48 años con gran glioblastoma multiforme temporoparietal izquierdo y edema perilesional.',
    surgery: 'Craneotomía parietal para resección tumoral guiada por neuronavegación.',
    timeInSurgery: 'Minuto 45 tras apertura de duramadre con masa encefálica hipertensa',
    initialVitals: {
      fc: 36,
      paSystolic: 195,
      paDiastolic: 110,
      paMean: 138,
      spo2: 97,
      etco2: 38,
      temp: 36.8,
      fr: 12,
      ecgRhythm: 'Bradicardia sinusal extrema con ondas T prominentes',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia sinusal a 36 lpm causada por reflejo barorreceptor ante elevación masiva de la presión intracraneal (PIC > 40 mmHg).',
    imaging: {
      type: 'TAC-REAL',
      title: 'Tomografía Cerebral de Control Pre y Peri-Operatoria',
      badge: 'HERNIACIÓN SUBFALCINA Y UNCAL',
      description: 'Desviación de línea media > 14 mm con borramiento total de cisternas perimesencefálicas y colapso del ventrículo lateral izquierdo por efecto de masa crítico.',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/EpiduralHematoma.jpg',
      findingsSummary: 'Crisis de Hipertensión Intracraneal Aguda con inminencia de paro de tallo encefálico.'
    },
    criticalContext: 'Al incidir la duramadre, el neurocirujano alerta que el cerebro está "engrapado", rígido, pletórico y protruye activamente hacia el defecto óseo impidiendo la visualización. El monitor alerta: la FC cae de 78 a 36 lpm y la PA sube abruptamente a 195/110 mmHg. La pupila izquierda se encuentra midriática de 6 mm no reactiva a la luz.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Qué tríada clásica de signos fisiopatológicos describe la presencia de bradicardia, hipertensión arterial y alteraciones respiratorias ante hipertensión endocraneana crítica?',
        options: [
          'Tríada de Cushing.',
          'Tríada de Beck.',
          'Tríada de Charcot.',
          'Tríada de Virchow.'
        ],
        correctIndex: 0,
        explanation: 'La tríada de Cushing es la respuesta refleja simpático-parasimpática a la isquemia del bulbo raquídeo por PIC que supera la presión de perfusión cerebral.',
        keyLearningPoint: 'La tríada de Cushing es un signo de alarma tardío y extremo de herniación cerebral inminente; requiere rescate neuroanestésico urgente.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la terapia osmótica de elección y rápida acción para reducir de inmediato la masa cerebral y la PIC en este momento crítico?',
        options: [
          'Solución salina hipertónica al 3% o al 7.5% (ej. bolo de 150-250 mL al 3%) o Manitol al 20% (0.5 a 1.0 g/kg) en bolo rápido.',
          'Infusión rápida de Dextrosa al 5% en agua destilada.',
          'Administración de Ringer Lactato a temperatura ambiente.',
          'Albúmina humana al 5%.'
        ],
        correctIndex: 0,
        explanation: 'El gradiente osmótico creado por la salina hipertónica o el manitol extrae agua del parénquima cerebral hacia el intravascular de forma casi instantánea, encogiendo el tejido cerebral y disminuyendo la PIC.',
        keyLearningPoint: 'La solución salina hipertónica al 3% es especialmente útil cuando hay inestabilidad hemodinámica porque expande el volumen sin inducir la diuresis hipotensora del manitol.'
      },
      {
        id: 'q3',
        prompt: 'En cuanto al manejo de la ventilación mecánica, ¿cuál es la meta transitoria de EtCO2/PaCO2 recomendada para inducir vasoconstricción cerebral de emergencia sin generar isquemia crítica?',
        options: [
          'Hiperventilación moderada temporal guiada a un objetivo de PaCO2 entre 30 y 35 mmHg (EtCO2 ~ 28-32 mmHg).',
          'Hiperventilación extrema a PaCO2 menor de 20 mmHg.',
          'Hipoventilación para mantener PaCO2 > 50 mmHg.',
          'Suspender el ventilador por completo.'
        ],
        correctIndex: 0,
        explanation: 'El CO2 es el regulador más potente del calibre arteriolar cerebral. Bajar la PaCO2 a 30-35 mmHg contrae las arteriolas reduciendo el volumen sanguíneo cerebral, pero descender por debajo de 30 mmHg causa isquemia tisular focal por hipoperfusión.',
        keyLearningPoint: 'La hiperventilación debe ser moderada (PaCO2 30-35 mmHg) y transitoria mientras el osmótico y la descompresión quirúrgica surten efecto.'
      },
      {
        id: 'q4',
        prompt: '¿Qué postura física de la mesa de quirófano optimiza el drenaje venoso cerebral sin acodar las venas yugulares?',
        options: [
          'Elevación de la cabeza (posición proclive o Fowler a 20-30 grados) con el cuello en posición neutra sin rotaciones extremas.',
          'Posición de Trendelenburg a 30 grados.',
          'Decúbito prono estricto con rotación cervical de 90 grados.',
          'Decúbito supino plano horizontal.'
        ],
        correctIndex: 0,
        explanation: 'Elevar la cabeza 20-30 grados favorece el drenaje venoso por gravedad a través del sistema yugular y vertebral, disminuyendo la presión venosa intracraneal.',
        keyLearningPoint: 'Verificar que la fijación con cabezal de Mayfield no colapse las yugulares ni flexione exageradamente el mentón contra el esternón.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El cerebro tenso en neurocirugía es una emergencia de máxima prioridad. La secuencia de control incluye: 1° Optimizar drenaje venoso (cabeza a 30°), 2° Terapia hiperosmolar (Salina al 3% / Manitol), 3° Hiperventilación moderada (PaCO2 30-35), y 4° Profundizar plano anestésico (propofol) para reducir el consumo metabólico cerebral de oxígeno (CMRO2).',
      guidelineReference: 'SNACC (Society for Neuroscience in Anesthesiology and Critical Care) Consensus Guidelines.',
      authorPearls: 'Dr. Carlos Leal: "En neuroanestesia, tus manos en el ventilador y tus osmóticos son la extensión de la gubia del cirujano; si controlas el CO2 y el osmótico, devuelves al cirujano el cerebro suave que necesita para salvar la función neurológica."'
    }
  },

  // CASO 13
  {
    id: 'case-pediatric-foreign-body-aspiration',
    title: 'Aspiración de Cuerpo Extraño con Asfixia y Falla de Extracción en Preescolar',
    blindTitle: 'Estridor Sibilante Unilateral, Atelectasia y Desaturación en Broncoendoscopía',
    category: 'Pediatría',
    difficulty: 'Experto',
    patient: 'Niño de 2 años y medio, 13 kg, con antecedente de atragantamiento con fruto seco (maní/cacahuate) hace 3 horas.',
    surgery: 'Broncoscopía rígida diagnóstica y terapéutica.',
    timeInSurgery: 'Minuto 15 de instrumentación con broncoscopio rígido',
    initialVitals: {
      fc: 62,
      paSystolic: 68,
      paDiastolic: 35,
      paMean: 46,
      spo2: 64,
      etco2: 58,
      temp: 36.4,
      fr: 30,
      ecgRhythm: 'Bradicardia sinusal progresiva hipóxica',
      ecgLead: 'DII'
    },
    ecgStripType: 'severe-brady',
    ecgFindingDescription: 'Bradicardia sinusal extrema a 62 lpm inducida por hipoxia alveolar severa y estimulación vagal del árbol traqueobronquial.',
    imaging: {
      type: 'RX-REAL',
      title: 'Radiografía de Tórax AP y Lateral Inspiración/Espiración',
      badge: 'ATRAPAMIENTO AÉREO EN VÁLVULA',
      description: 'Hiperinsuflación patológica del pulmón derecho con aplanamiento diafragmático ipsilateral y desviación mediastínica hacia la izquierda en fase espiratoria (mecanismo valvular por cuerpo extraño en bronquio fuente derecho).',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Aspirated_corn_kernel_%283791886968%29.jpg/1000px-Aspirated_corn_kernel_%283791886968%29.jpg',
      findingsSummary: 'Cuerpo extraño vegetal en bronquio principal derecho con edema mucoso circundante.'
    },
    criticalContext: 'Durante el intento de extracción del maní con pinza óptica, el fragmento se fractura y una porción migra hacia la carina ocluyendo la entrada a ambos bronquios principales. La SpO2 cae a 64%, el tórax deja de expandir y la frecuencia cardíaca desciende rápidamente de 135 a 62 lpm.',
    questions: [
      {
        id: 'q1',
        prompt: 'Ante la oclusión carinal bilateral con hipoxemia crítica que no permite ventilar a través del broncoscopio, ¿cuál es la maniobra de rescate inmediato?',
        options: [
          'Empujar el cuerpo extraño deliberadamente hacia uno de los bronquios principales (habitualmente el derecho) para desobstruir la carina y permitir la ventilación y oxigenación salvadora del otro pulmón.',
          'Suspender la anestesia y esperar a que el niño tosa espontáneamente.',
          'Puncionar el tórax bilateralmente con aguja fina.',
          'Dar compresiones torácicas con el broncoscopio puesto.'
        ],
        correctIndex: 0,
        explanation: 'En asfixia carinal completa donde ambos pulmones están desconectados del flujo aéreo, empujar el cuerpo extraño hacia un bronquio fuente sacrifica temporalmente un pulmón pero reabre de inmediato la ventilación del pulmón contralateral, recuperando la oxigenación.',
        keyLearningPoint: 'Un pulmón ventilado salva la vida del niño mientras se replantea la extracción con el equipo de vía aérea.'
      },
      {
        id: 'q2',
        prompt: '¿Cuál es la modalidad ventilatoria preferida durante la broncoscopía rígida pediátrica para mantener oxigenación continua sin expulsar el instrumental?',
        options: [
          'Ventilación manual espontánea asistida o Jet Ventilation de alta frecuencia coordinada con el endoscopista.',
          'Hiperpresión no invasiva con máscara facial suelta.',
          'Apnea total no oxigenada durante 20 minutos.',
          'Cierre hermético con clamp endotraqueal.'
        ],
        correctIndex: 0,
        explanation: 'La ventilación asistida con mantenimiento de respiración espontánea o la ventilación jet permiten intercambiar gases mientras el cirujano manipula las pinzas a través del lumen del broncoscopio.',
        keyLearningPoint: 'La comunicación continua entre el anestesiólogo y el endoscopista es la clave absoluta de la broncoscopía pediátrica.'
      },
      {
        id: 'q3',
        prompt: 'Si la frecuencia cardíaca cae por debajo de 60 lpm con desaturación en este niño de 2 años a pesar de oxigenar, ¿cuál es la conducta según el protocolo PALS?',
        options: [
          'Iniciar compresiones torácicas y administrar Atropina (0.02 mg/kg) y/o Epinefrina (0.01 mg/kg) por paro inminente hipóxico.',
          'Observar durante 10 minutos.',
          'Administrar sedación con ketamina.',
          'Cambiar el sensor de pulsioximetría de dedo.'
        ],
        correctIndex: 0,
        explanation: 'En pediatría, una FC < 60 lpm con compromiso de perfusión e hipoxia persistente se maneja como paro cardíaco, requiriendo masaje cardíaco inmediato y soporte adrenérgico.',
        keyLearningPoint: 'En el niño la bradicardia no se espera: se actúa de inmediato con ventilación y drogas antes de la asistolia irreversible.'
      }
    ],
    debriefing: {
      takeawaySummary: 'La aspiración de cuerpos extraños vegetales genera inflamación química y friabilidad. El riesgo de obstrucción carinal completa durante la extracción requiere la habilidad de empujar el fragmento a un bronquio lateral para preservar la vida con ventilación unipulmonar de emergencia.',
      guidelineReference: 'APAGBI Guidelines for Paediatric Foreign Body Airway Obstruction / PALS (Pediatric Advanced Life Support).',
      authorPearls: 'Dr. Carlos Leal: "En endoscopía de vía aérea en niños, comparte el espacio con el cirujano pero nunca cedas el control de la oxigenación; si el niño desatura, el cirujano retira el endoscopio y se ventila primero."'
    }
  },

  // CASO 14
  {
    id: 'case-airway-burn-inhalation-stridor',
    title: 'Trauma Térmico de Vía Aérea con Edema Laríngeo Fulminante por Inhalación de Humo',
    blindTitle: 'Quemadura Facial con Estridor Progresivo, Disfonía y Quemosis en Pabellón de Urgencia',
    category: 'Vía Aérea',
    difficulty: 'Experto',
    patient: 'Masculino de 32 años rescatado de un incendio en espacio cerrado con quemaduras faciales, vibrisas nasales chamuscadas y esputo carbonáceo.',
    surgery: 'Intubación endotraqueal de emergencia e inspección laríngea bajo fibrobroncoscopía.',
    timeInSurgery: 'Ingreso inmediato a Pabellón de Emergencia (Hora 2 post-incendio)',
    initialVitals: {
      fc: 128,
      paSystolic: 148,
      paDiastolic: 86,
      paMean: 106,
      spo2: 89,
      etco2: 44,
      temp: 37.4,
      fr: 32,
      ecgRhythm: 'Taquicardia sinusal regular con signos adrenérgicos',
      ecgLead: 'DII'
    },
    ecgStripType: 'sinus-tach',
    ecgFindingDescription: 'Taquicardia sinusal rápida a 128 lpm secundaria a intoxicación sistémica por humo, estrés térmico y liberación masiva de catecolaminas.',
    imaging: {
      type: 'FIBRO-REAL',
      title: 'Videofibrobroncoscopía de Vía Aérea Superior Inmediata',
      badge: 'EDEMA SUPRAGLÓTICO SEVERO (ERITEMA Y HOLLÍN)',
      description: 'Cuerdas vocales y repliegues aritenoepiglóticos tumefactos con diámetro glótico reducido a hendidura milimétrica, depósitos carbonáceos densos y friabilidad mucosa extrema.',
      realImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
      findingsSummary: 'Obstrucción laríngea inminente por lesión térmica directa y productos de combustión química.'
    },
    criticalContext: 'El paciente llega con voz ronca apagada, disfonía creciente y estridor audible sin fonendoscopio. En los últimos 30 minutos el edema de labios y lengua ha duplicado su volumen. Se queja de asfixia y se rehúsa a acostarse en decúbito supino por sensación de ahogo inminente.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Cuál es la regla de oro indiscutible ante la sospecha de lesión por inhalación y estridor progresivo en quemaduras?',
        options: [
          'Intubación endotraqueal precoz y reglada antes de que el edema orofaríngeo y supraglótico oblitere por completo la anatomía laríngea.',
          'Manejo conservador con oxígeno por mascarilla y esperar 24 horas a ver la evolución del edema.',
          'Nebulizaciones con suero salino y alta a sala general.',
          'Colocar mascarilla laríngea y despertar al paciente.'
        ],
        correctIndex: 0,
        explanation: 'El edema de las quemaduras por inhalación progresa velozmente en las primeras 6 a 24 horas debido a la reanimación hídrica y a la cascada inflamatoria local. Esperar a que el estridor empeore transforma una vía aérea manejable en un CICO quirúrgico insuperable.',
        keyLearningPoint: 'En quemaduras de vía aérea: Más vale un tubo colocado 12 horas antes que un intento desesperado en un cuello completamente deformado.'
      },
      {
        id: 'q2',
        prompt: '¿Por qué la técnica de intubación con el paciente despierto (Awake Intubation) mediante Videolaringoscopio o Fibrobroncoscopio flexible con anestesia tópica es la más segura?',
        options: [
          'Porque preserva el tono muscular faríngeo de la vía aérea y la ventilación espontánea, impidiendo el colapso total irreversible de la glotis que ocurriría con la inducción y relajación general.',
          'Porque los fármacos anestésicos están químicamente contraindicados en quemaduras.',
          'Porque no se requiere oxígeno.',
          'Para que el paciente colabore sujetando el tubo.'
        ],
        correctIndex: 0,
        explanation: 'Dormir y relajar a un paciente con edema glótico masivo y cuello rígido por quemadura puede provocar un cierre valvular total imposible de ventilar con mascarilla.',
        keyLearningPoint: 'La intubación con paciente vigil conserva la permeabilidad y el flujo respiratorio ante anatomías distorsionadas por quemaduras.'
      },
      {
        id: 'q3',
        prompt: 'En pacientes con quemaduras extensas después de las primeras 24-48 horas del trauma térmico, ¿qué relajante neuromuscular está FORMALMENTE PROHIBIDO por riesgo de hiperpotasemia letal y asistolia?',
        options: [
          'Succinilcolina.',
          'Rocuronio.',
          'Cisatracurio.',
          'Vecuronio.'
        ],
        correctIndex: 0,
        explanation: 'A partir de las 24-48 horas de una quemadura extensa se produce una proliferación masiva de receptores nicotínicos inmaduros (alfa-7) en toda la membrana muscular. La succinilcolina desata una salida descontrolada de potasio que induce paro cardíaco inmediato refractario.',
        keyLearningPoint: 'Nunca usar succinilcolina en quemados de más de 24 horas de evolución; usar Rocuronio con Sugammadex disponible.'
      },
      {
        id: 'q4',
        prompt: 'Si el paciente también estuvo expuesto a combustión de plásticos o espumas sintéticas y presenta acidosis láctica severa (Lactato > 10 mmol/L) y desaturación refractaria, ¿qué intoxicación concomitante debe tratarse?',
        options: [
          'Intoxicación por Cianuro (Cianuro de hidrógeno), requiriendo Hidroxocobalamina (Vitamina B12a) 5 gramos EV.',
          'Intoxicación por plomo que requiere quelación.',
          'Toxicidad por paracetamol.',
          'Envenenamiento por botulismo.'
        ],
        correctIndex: 0,
        explanation: 'La combustión de polímeros genera cianuro, que inhibe la citocromo c oxidasa mitocondrial impidiendo el uso de oxígeno celular y generando hiperlactatemia severa. La hidroxocobalamina es el antídoto de elección sin alterar la hemoglobina.',
        keyLearningPoint: 'Humo en espacio cerrado + acidosis láctica desproporcionada = Tratar de inmediato por sospecha de Cianuro con Hidroxocobalamina.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El trauma térmico de la vía aérea exige anticipación proactiva. La intubación vigil temprana salva vidas antes de que el edema cierre la glotis. Además, el anestesiólogo debe sospechar y tratar activamente la intoxicación concomitante por monóxido de carbono y cianuro.',
      guidelineReference: 'ABA (American Burn Association) Practice Guidelines for Inhalation Injury / Advanced Burn Life Support (ABLS).',
      authorPearls: 'Dr. Carlos Leal: "En quemaduras con hollín en boca y voz ronca, no pidas una placa ni esperes a terapia: pon el tubo orotraqueal de inmediato. Mañana ese cuello será una masa hinchada intratable."'
    }
  },

  // CASO 15
  {
    id: 'case-pulmonary-embolism-collapse',
    title: 'Tromboembolismo Pulmonar Masivo (TEP) con Falla Ventricular Derecha Aguda en Pabellón',
    blindTitle: 'Colapso Circulatorio Inexplicable con Caída Súbita de EtCO2 y Dilatación Cardíaca Derecha',
    category: 'Cardiovascular / Crisis',
    difficulty: 'Experto',
    patient: 'Femenina de 68 años con fractura de cadera de 5 días de evolución postrada en cama, sometida a artroplastia total.',
    surgery: 'Artroplastia total de cadera bajo anestesia neuroaxial / general.',
    timeInSurgery: 'Minuto 40 durante la reducción y preparación del fémur',
    initialVitals: {
      fc: 146,
      paSystolic: 50,
      paDiastolic: 25,
      paMean: 33,
      spo2: 70,
      etco2: 11,
      temp: 36.5,
      fr: 20,
      ecgRhythm: 'Taquicardia sinusal con patrón S1Q3T3 y bloqueo incompleto de rama derecha',
      ecgLead: 'DIII'
    },
    ecgStripType: 'st-elevation',
    ecgFindingDescription: 'Clásico patrón electrocardiográfico S1Q3T3 de McGinn-White (onda S profunda en DI, onda Q y T negativa en DIII) con supradesnivel del ST e inversión de T en V1-V3 por sobrecarga ventricular derecha aguda.',
    imaging: {
      type: 'ECO-REAL',
      title: 'Ecocardiograma Transesofágico (ETE) Intraoperatorio en Tiempo Real',
      badge: 'SIGNO DE MCCONNELL (FALLA VD AGUDA)',
      description: 'Ventrículo derecho severamente dilatado con aquinesia de la pared libre y preservación de la contractilidad del ápex (Signo de McConnell), abombamiento paradójico del tabique interventricular hacia la izquierda ("signo de la D").',
      realImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Pulmonary-embolism.png/1000px-Pulmonary-embolism.png',
      findingsSummary: 'Sobrecarga de presión aguda masiva del ventrículo derecho por oclusión del tronco o ramas principales de la arteria pulmonar.'
    },
    criticalContext: 'Durante el labrado del fémur, el EtCO2 cae abruptamente de 36 a 11 mmHg en cuestión de segundos. La SpO2 se desploma a 70% a pesar de FiO2 1.0. La presión arterial cae a 50/25 mmHg con pulso filiforme. El ventrículo derecho en el ETE se observa gigantesco y no logra eyectar.',
    questions: [
      {
        id: 'q1',
        prompt: '¿Por qué la caída súbita e inexplicable del EtCO2 en el capnógrafo es el signo intraoperatorio cardinal de un TEP masivo o embolismo aéreo?',
        options: [
          'Porque la oclusión masiva del lecho vascular pulmonar crea un inmenso espacio muerto alveolar (alvéolos ventilados pero no perfundidos), impidiendo que el CO2 llegue al gas espirado.',
          'Porque el sensor de capnografía se congela por el frío.',
          'Porque el paciente deja de producir CO2 intracelular.',
          'Por efecto broncodilatador reflejo.'
        ],
        correctIndex: 0,
        explanation: 'El EtCO2 depende del flujo sanguíneo pulmonar. Cuando un trombo masivo bloquea el flujo a los pulmones, la sangre no puede liberar CO2 a los alvéolos, provocando una caída catastrófica del EtCO2 a pesar de una ventilación adecuada.',
        keyLearningPoint: 'Caída súbita del EtCO2 + colapso de presión = TEP masivo, embolismo gaseoso o paro circulatorio inminente.'
      },
      {
        id: 'q2',
        prompt: 'En el manejo hemodinámico del ventrículo derecho claudicante por TEP masivo, ¿por qué la infusión agresiva de varios litros de suero salino puede EMPEORAR la situación y provocar paro en espiral de muerte?',
        options: [
          'Porque la sobrecarga de volumen dilata aún más el ventrículo derecho, aumentando la tensión de su pared, desplazando el tabique hacia el ventrículo izquierdo e impidiendo su llenado, reduciendo todavía más el gasto cardíaco.',
          'Porque la sal diluye la heparina.',
          'Porque induce hipotermia inmediata.',
          'Porque rompe la válvula mitral.'
        ],
        correctIndex: 0,
        explanation: 'El ventrículo derecho fallido se encuentra en el límite de la curva de Frank-Starling e isquémico. La sobrecarga hídrica desplaza el septum (interdependencia ventricular), aplasta el VI y estrangula las coronarias derechas.',
        keyLearningPoint: 'El VD en crisis requiere cautela con fluidos: administrar vasopresores tempranos (Noradrenalina/Vasopresina) para mantener la presión de perfusión coronaria del ventrículo derecho.'
      },
      {
        id: 'q3',
        prompt: 'Ante un TEP masivo intraoperatorio confirmado con shock cardiogénico obstructivo refractario a inotrópicos, ¿cuál es la terapia de rescate avanzada que debe evaluarse de inmediato?',
        options: [
          'Trombólisis sistémica de rescate (ej. Alteplasa / rTPA 50-100 mg EV) o embolectomía quirúrgica de emergencia / soporte con ECMO venoarterial.',
          'Administrar ácido tranexámico para estabilizar el coágulo.',
          'Suspender la cirugía y enviar a piso común.',
          'Administrar calcio antagonistas.'
        ],
        correctIndex: 0,
        explanation: 'En el TEP con inestabilidad hemodinámica y riesgo inminente de muerte, la reperfusión mecánica o farmacológica (trombólisis o embolectomía) es la única medida que remueve la obstrucción al flujo del VD.',
        keyLearningPoint: 'El riesgo de sangrado quirúrgico debe ser sopesado contra la muerte inminente por paro del VD.'
      }
    ],
    debriefing: {
      takeawaySummary: 'El TEP intraoperatorio es una catástrofe vascular. El monitoreo conjunto de la capnografía (caída abrupta de EtCO2) y la ecocardiografía transesofágica (Signo de McConnell y tabique aplanado en D) permite el diagnóstico en segundos para evitar la sobrecarga hídrica letal y sostener la perfusión coronaria del ventrículo derecho.',
      guidelineReference: 'ESC Guidelines for the Diagnosis and Management of Acute Pulmonary Embolism.',
      authorPearls: 'Dr. Carlos Leal: "Si ves caer el EtCO2 a 10 mientras la presión se va a pique en una prótesis de cadera o rodilla, no busques una hemorragia en la sábana: el trombo ha tapado el pulmón. Apoya el VD con noradrenalina ya."'
    }
  }
];

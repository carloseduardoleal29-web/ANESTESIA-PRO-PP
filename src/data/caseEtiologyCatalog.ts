export interface CaseEtiologyInfo {
  cause: string; // Nombre del cuadro clínico / causa de paro (ej: "Choque Hemorrágico Exanguinante", "Infarto Agudo de Miocardio Perioperatorio", "Hipovolemia Severa")
  categoryType: 
    | 'Choque Hemorrágico / Hipovolemia'
    | 'Infarto Agudo de Miocardio / Shock Cardiogénico'
    | 'Choque Obstructivo'
    | 'Hipoxia / Vía Aérea Crítica'
    | 'Choque Distributivo / Anafilaxia'
    | 'Toxicidad Farmacológica (LAST)'
    | 'Alteración Metabólica / Hidroelectrolítica'
    | 'Emergencia Farmacogenética'
    | 'Embolismo Perioperatorio'
    | 'Emergencia Neuroquirúrgica'
    | 'Emergencia Obstétrica'
    | 'Emergencia Quirúrgica Pediátrica / Neonatal'
    | string;
  lethalMechanism: string; // Explicación fisiopatológica exacta de cómo y por qué colapsa o fallece el paciente en este caso
  reversibleFactors: string[]; // Factores de reversibilidad y conductas salvavidas específicas de este caso
  clinicalClues: string[]; // Signos clave en monitor, ECG, capnografía o laboratorio
}

export const CASE_ETIOLOGY_REGISTRY: Record<string, CaseEtiologyInfo> = {
  // 1. POLITRAUMATISMO Y SHOCK HEMORRÁGICO CON NEUMOTÓRAX
  'case-trauma-hemothorax': {
    cause: 'Choque Hemorrágico Exanguinante e Hipovolemia Masiva con Neumotórax a Tensión',
    categoryType: 'Choque Hemorrágico / Hipovolemia',
    lethalMechanism: 'Exanguinación masiva por rotura vascular intraabdominal combinada con colapso del retorno venoso (vena cava inferior) por neumotórax a tensión descompensado con presión positiva. Paro cardíaco en Actividad Eléctrica Sin Pulso (AESP) por volumen intravascular cero.',
    reversibleFactors: [
      'Descompresión pleural torácica inmediata con aguja/catéter 14-16G en 4to/5to espacio intercostal línea axilar anterior.',
      'Reanimación de Control de Daños (RDH) con hipotensión permisiva (PAS 80-90 mmHg / PAM 50-60 mmHg).',
      'Protocolo de Transfusión Masiva (PTM) 1:1:1 precoz (concentrados de hematíes, plasma fresco congelado y plaquetas).',
      'Ácido Tranexámico 1g IV en bolo dentro de las primeras 3 horas post-trauma (estudio CRASH-2).',
      'Laparotomía y toracotomía de control de daños para hemostasia quirúrgica inmediata.'
    ],
    clinicalClues: [
      'Hipotensión severa (60/35 mmHg) y taquicardia extrema (142 lpm).',
      'Caída brusca del EtCO2 a < 15 mmHg (signo de pérdida crítica de gasto cardíaco).',
      'Ingurgitación yugular paradójica con asimetría ventilatoria y presión pico > 45 cmH2O.'
    ]
  },

  // 2. VÍA AÉREA DIFÍCIL Y OBESIDAD MÓRBIDA (CICO)
  'case-airway-morbid-obesity': {
    cause: 'Hipoxia Anóxica Crítica por Situación CICO (No Intubo, No Oxigeno) en Obesidad Mórbida',
    categoryType: 'Hipoxia / Vía Aérea Crítica',
    lethalMechanism: 'Agotamiento fulminante de la Capacidad Residual Funcional (CRF) en obesidad severa con SAHOS, desaturación acelerada a cero con imposibilidad de ventilar ni intubar (CICO), desencadenando bradicardia refleja vagal-hipóxica extrema, asistolia y anoxia cerebral irreversible.',
    reversibleFactors: [
      'Declaración precoz de emergencia CICO según algoritmo VORTEX / DAS sin demorarse en intentos fútiles.',
      'Acceso frontocervical quirúrgico de emergencia: Cricotiroidotomía Scalpel-Bougie-Tube con tubo con manguito 6.0 mm.',
      'Intento de rescate con Dispositivo Supraglótico de 2da generación (i-gel / ProSeal) con drenaje gástrico.',
      'Sugammadex 16 mg/kg peso real si se indujo con Rocuronio para restaurar ventilación espontánea.',
      'Ventilación con O2 al 100% y maniobra bimanual con cánula orofaríngea.'
    ],
    clinicalClues: [
      'Caída vertiginosa de SpO2 de 99% a < 65% en menos de 90 segundos de apnea.',
      'EtCO2 ausente (0 mmHg) por imposibilidad absoluta de ventilación alveolar.',
      'Bradicardia refleja hipóxica rápida con complejos ensanchados pre-paro.'
    ]
  },

  // 3. PARO CARDÍACO EN GESTANTE / COMPRESIÓN AORTO-CAVA
  'case-obstetric-cardiac-arrest': {
    cause: 'Paro Cardiorrespiratorio en Gestante por Fibrilación Ventricular y Colapso Aorto-Cava',
    categoryType: 'Emergencia Obstétrica',
    lethalMechanism: 'Compresión crítica de la vena cava inferior y aorta abdominal por el útero grávido que anula el retorno venoso efectivo durante RCP estándar, combinado con Fibrilación Ventricular (FV) caótica por toxicidad o hipoxia miocárdica materna.',
    reversibleFactors: [
      'Desplazamiento Uterino Manual a la Izquierda (LUD) continuo durante todas las compresiones torácicas.',
      'Desfibrilación eléctrica inmediata (120 - 200 J bifásica) sin retraso ni atenuación por el embarazo.',
      'Histerotomía de Reanimación (Cesárea Peri-Mortem) mandatoria al minuto 4 para extracción fetal al minuto 5.',
      'Manejo de vía aérea invasiva temprana con tubo de menor calibre (6.0 - 6.5 mm).',
      'Emulsión lipídica al 20% si existe sospecha de toxicidad sistémica por anestésicos locales (LAST).'
    ],
    clinicalClues: [
      'Trazado electrocardiográfico en Fibrilación Ventricular gruesa sin complejos QRS.',
      'Ausencia de pulso carotídeo y EtCO2 de RCP < 10 mmHg.',
      'Útero sobrepasando el ombligo (> 20 semanas) generando colapso de retorno.'
    ]
  },

  // 4. LARINGOESPASMO PEDIÁTRICO Y EDEMA PULMONAR
  'case-pediatric-laryngospasm': {
    cause: 'Asfixia Hipóxica Aguda por Laringoespasmo Severo con Edema Pulmonar por Presión Negativa (EPPN)',
    categoryType: 'Hipoxia / Vía Aérea Crítica',
    lethalMechanism: 'Aducción espasmódica forzada y completa de las cuerdas vocales verdaderas y falsas en plano anestésico excitatorio. En el paciente pediátrico el miocardio depende directamente de la PaO2: la hipoxia aguda produce bradicardia fulminante mediada por el vago y paro en asistolia anóxica en segundos.',
    reversibleFactors: [
      'Presión bilateral profunda en la muesca laringoesofágica retromandibular (Punto / Maniobra de Larson).',
      'CPAP hermético con mascarilla facial al 100% de O2 con válvula de sobrepresión.',
      'Succinilcolina a dosis bajas (0.5 a 1.0 mg/kg IV o 2 a 4 mg/kg IM) + Atropina (0.02 mg/kg IV/IM) para prevenir bradicardia.',
      'Soporte con PEEP (5 a 10 cmH2O) para resolver la trasudación alveolar del edema por presión negativa post-espasmo.'
    ],
    clinicalClues: [
      'Respiración paradójica (bamboleo toracoabdominal) y tiraje supraesternal masivo.',
      'Silencio respiratorio súbito post-estridor con caída de SpO2 < 70%.',
      'Bradicardia severa refleja (< 60 lpm) que avisa paro hipóxico inminente.',
      'Espuma rosada o asalmonada que brota por orofaringe tras aliviar la obstrucción.'
    ]
  },

  // 5. SHOCK ANAFILÁCTICO SEVERO GRADO IV
  'case-anaphylaxis-shock': {
    cause: 'Shock Anafiláctico Severo Grado IV / Choque Distributivo y Vasoplejia Masiva',
    categoryType: 'Choque Distributivo / Anafilaxia',
    lethalMechanism: 'Desgranulación masiva de mastocitos y basófilos mediada por IgE que libera histamina, leucotrienos y prostaglandinas. Causa vasodilatación arteriovenosa sistémica fulminante con caída a cero de la resistencia vascular sistémica (RVS) y extravasación de hasta 50% de la volemia al tercer espacio en minutos.',
    reversibleFactors: [
      'Adrenalina (Epinefrina) en bolos IV titulados de 10 a 50 mcg (o 0.5 mg IM en muslo) repetidos cada 1-2 min.',
      'Infusión rápida a presión de cristaloides isotónicos tibios (20 a 30 mL/kg en 10-15 minutos).',
      'Profundización con halogenados (Sevoflurano) y Sulfato de Magnesio 2g IV para broncodilatación refractaria.',
      'Suspensión inmediata de cualquier fármaco sospechoso (antibióticos betalactámicos, bloqueantes neuromusculares).',
      'Corticoides (Hidrocortisona) y antihistamínicos como terapia coadyuvante de segunda línea.'
    ],
    clinicalClues: [
      'Hipotensión arterial catastrófica y súbita (PA 48/22 mmHg) tras inyección IV.',
      'Presión pico elevada (> 45 cmH2O) con curva de capnografía en pendiente / "aleta de tiburón".',
      'Taquicardia refleja extrema (> 150 lpm) y eritema/angioedema cutáneo difuso.'
    ]
  },

  // 6. INFARTO AGUDO DE MIOCARDIO PERIOPERATORIO (IAM / SHOCK CARDIOGÉNICO)
  'case-cardiovascular-myocardial-infarction': {
    cause: 'Infarto Agudo de Miocardio Perioperatorio (IAMCEST) con Shock Cardiogénico e Isquemia Crítica',
    categoryType: 'Infarto Agudo de Miocardio / Shock Cardiogénico',
    lethalMechanism: 'Trombosis coronaria aguda o desbalance severo entre aporte y demanda miocárdica de oxígeno (IAM Tipo 1 o 2) con necrosis transmural, disfunción sistodiastólica aguda del ventrículo, caída del gasto cardíaco, congestión retrógrada y colapso de la Presión de Perfusión Coronaria (PPC = PAD - PFDVI), culminando en choque cardiogénico refractario o fibrilación ventricular.',
    reversibleFactors: [
      'Optimización inmediata de la Presión de Perfusión Coronaria mediante vasopresores (Norepinefrina) para elevar la PAD.',
      'Soporte inotrópico precoz con Dobutamina o Levosimendán si persiste hipoperfusión tisular.',
      'Corrección de taquicardia o bradicardia para no deteriorar el tiempo diastólico de llenado coronario.',
      'Administración de Nitroglicerina IV con monitorización estricta solo si la presión arterial lo tolera.',
      'Alivio de la sobrecarga ventricular (suspensión de neumoperitoneo, optimización de PEEP y volumen).',
      'Activación del Código Infarto para Angioplastia Coronaria Transluminal Percutánea (ACTP) primaria urgente.'
    ],
    clinicalClues: [
      'Elevación aguda del segmento ST > 2 mm en derivaciones contiguas (ej. DII, DIII, aVF o V1-V4).',
      'Infradesniveles especulares recíprocos en derivaciones opuestas.',
      'Hipotensión arterial progresiva con aumento de PVC y caída drástica del gasto cardíaco.',
      'Arritmias ventriculares frecuentes (extrasístoles en salvas, TV sostenida).'
    ]
  },

  // 7. HIPERPOTASEMIA SEVERA AGUDA
  'case-hyperkalemia-cardiac-arrest': {
    cause: 'Paro Cardíaco por Hiperpotasemia Severa Aguda (K+ > 7.5 mEq/L) y Toxicidad de Membrana',
    categoryType: 'Alteración Metabólica / Hidroelectrolítica',
    lethalMechanism: 'Inactivación de los canales rápidos de sodio dependientes de voltaje en el miocardio debido a la despolarización sostenida del potencial de reposo celular. Causa pérdida de excitabilidad auricular, ensanchamiento difuso del complejo QRS hasta fusionarse con la onda T en un patrón sinusoidal moribundo y asistolia o FV refractaria.',
    reversibleFactors: [
      'Gluconato de calcio al 10% (10 a 20 mL) o Cloruro de calcio al 10% (5 a 10 mL) IV inmediato para estabilizar la membrana.',
      'Solución polarizante: 10 UI de Insulina rápida en 50 gramos de glucosa administrada en 15-30 minutos.',
      'Agonistas beta-2 adrenérgicos (Salbutamol nebulizado o IV) para desplazar el K+ al interior celular.',
      'Bicarbonato de sodio 8.4% (50 mEq IV) para contrarrestar la acidosis metabólica concurrente.',
      'Coordinación de hemodiálisis de emergencia para depuración extracorpórea definitiva.'
    ],
    clinicalClues: [
      'Ondas T acuminadas, simétricas, de base estrecha ("en tienda de campaña").',
      'Alargamiento extremo del intervalo PR con aplanamiento y desaparición de la onda P.',
      'QRS bizarro ensanchado (> 180 ms) que evoluciona a ritmo sinusoidal pre-paro.',
      'Bradicardia severa refractaria a atropina.'
    ]
  },

  // 8. HIPERTERMIA MALIGNA
  'case-hyperthermia-malignant': {
    cause: 'Crisis de Hipertermia Maligna Fulminante por Hipermetabolismo Músculo-Esquelético',
    categoryType: 'Emergencia Farmacogenética',
    lethalMechanism: 'Mutación del receptor de rianodina (RYR1) que desata una salida incontrolada de calcio desde el retículo sarcoplásmico hacia el mioplasma tras la exposición a anestésicos halogenados o succinilcolina. El hipermetabolismo genera rabdomiólisis masiva, hiperpotasemia fulminante, acidosis láctica extrema, arritmias ventriculares y colapso circulatorio hipertérmico.',
    reversibleFactors: [
      'Cese inmediato de todos los anestésicos inhalatorios volátiles y succinilcolina.',
      'Dantroleno Sódico intravenoso a dosis de 2.5 mg/kg en bolo rápido continuo hasta revertir el cuadro.',
      'Hiperventilación activa con O2 al 100% a flujos de gas fresco máximos (> 10 L/min) con filtro de carbón activado.',
      'Enfriamiento activo agresivo corporal (sueros fríos EV, lavado gástrico, compresas de hielo).',
      'Manejo enérgico de la hiperkalemia y corrección de la acidosis metabólica con bicarbonato.'
    ],
    clinicalClues: [
      'Aumento exponencial e incontrolable del EtCO2 (> 70-90 mmHg) refractario a la hiperventilación.',
      'Rigidez muscular generalizada o espasmo del masetero que impide abrir la boca.',
      'Taquicardia sinusal extrema desproporcionada y arritmias ventriculares.',
      'Hipertermia tardía pero explosiva (aumento de > 1-2 °C cada 5-10 minutos hasta > 42 °C).'
    ]
  },

  // 9. TOXICIDAD SISTÉMICA POR ANESTÉSICOS LOCALES (LAST)
  'case-local-anesthetic-toxicity': {
    cause: 'Toxicidad Sistémica por Anestésicos Locales (LAST) por Inyección Intravascular / Sobredosis',
    categoryType: 'Toxicidad Farmacológica (LAST)',
    lethalMechanism: 'Unión ávida del anestésico local lipofílico (ej. bupivacaína, levobupivacaína) a los canales de sodio intracardíacos y cerebrales. Provoca depresión profunda de la contractilidad miocárdica (bloqueo inotrópico negativo severo), pérdida del automatismo sinoauricular, taquicardia o fibrilación ventricular refractaria y convulsiones tónico-clónicas seguidas de paro cardíaco.',
    reversibleFactors: [
      'Emulsión Lipídica al 20% (Intralipid) en bolo de 1.5 mL/kg en 1 minuto, seguido de infusión a 0.25 mL/kg/min.',
      'Manejo de vía aérea con O2 al 100% y ventilación para evitar hipercapnia y acidosis (que aumentan la toxicidad).',
      'Supresión inmediata de convulsiones con Benzodiacepinas (Midazolam) para reducir la acidosis láctica.',
      'Compresiones de alta calidad prolongadas (el soporte cardiopulmonar en LAST requiere tiempo mientras los lípidos captan el fármaco).',
      'Evitar vasopresina, bloqueantes cálcicos, betabloqueantes y dosis elevadas de adrenalina (> 1 mcg/kg).'
    ],
    clinicalClues: [
      'Pródromos neurológicos (sabor metálico, parestesias peribucales, acúfenos, agitación) seguidos de convulsiones.',
      'Colapso cardiovascular repentino minutos después de un bloqueo nervioso regional o infiltración.',
      'Ensanchamiento del QRS, bradicardia nodal, taquicardia ventricular polimórfica o asistolia súbita.'
    ]
  },

  // 10. PREECLAMPSIA SEVERA / CRISIS ECLÁMPTICA
  'case-preeclampsia-eclampsia-crisis': {
    cause: 'Crisis Hipertensiva Severa y Eclampsia con Encefalopatía y Vasoespasmo Agudo',
    categoryType: 'Emergencia Obstétrica',
    lethalMechanism: 'Disfunción endotelial sistémica con vasoespasmo arteriolar generalizado y pérdida de la autorregulación vascular cerebral por presión arterial media extrema. Genera edema cerebral vasogénico (síndrome PRES), convulsiones e hiperemia cerebral con riesgo mortal de hemorragia intracraneal y desprendimiento prematuro de placenta.',
    reversibleFactors: [
      'Sulfato de Magnesio (esquema Zuspan): bolo inicial de 4 a 6 gramos IV en 20 min, seguido de infusión de 1 a 2 g/h.',
      'Control antihipertensivo de emergencia con Labetalol IV (20-80 mg) o Hidralazina (5-10 mg) para meta PAS 140-150 / PAD 90-100 mmHg.',
      'Protección de vía aérea y oxigenación para evitar acidosis e hipoxia materna y fetal.',
      'Resolución obstétrica urgente una vez estabilizada la madre.'
    ],
    clinicalClues: [
      'Presión arterial severamente elevada (> 160/110 mmHg).',
      'Cefalea intensa refractaria, fosfenos, tinitus y epigastralgia en barra.',
      'Convulsiones tónico-clónicas generalizadas en sala de operaciones o parto.'
    ]
  },

  // 11. NEUMOPERITONEO A TENSIÓN
  'case-tension-pneumoperitoneum-tamponade': {
    cause: 'Choque Obstructivo por Hiperpresión Intraabdominal y Neumoperitoneo a Tensión',
    categoryType: 'Choque Obstructivo',
    lethalMechanism: 'Insuflado laparoscópico a presiones intraabdominales patológicas (> 20-25 mmHg) que comprimen la vena cava inferior, anulan la precarga cardíaca, elevan las cúpulas diafragmáticas colapsando el volumen corriente y provocan choque obstructivo agudo con caída del gasto cardíaco.',
    reversibleFactors: [
      'Desinflado inmediato y descompresión del neumoperitoneo abriendo las llaves de los trócares.',
      'Aviso urgente al cirujano y verificación del sensor del insuflador.',
      'Administración de bolos de fluidos para restaurar precarga ventricular.',
      'Ventilación con volúmenes corrientes fisiológicos y relajación neuromuscular adecuada.'
    ],
    clinicalClues: [
      'Caída repentina de la PA tras el inicio del neumoperitoneo.',
      'Presión pico de vía aérea marcadamente aumentada con distensión abdominal pétrea.',
      'Recuperación hemodinámica inmediata al desinflar el abdomen.'
    ]
  },

  // 12. TRALI (LESION PULMONAR AGUDA ASOCIADA A TRANSFUSIÓN)
  'case-transfusion-reaction-trali': {
    cause: 'Insuficiencia Respiratoria Aguda por TRALI (Lesión Pulmonar Aguda Asociada a Transfusión)',
    categoryType: 'Choque Distributivo / Anafilaxia',
    lethalMechanism: 'Interacción de anticuerpos anti-HLA o anti-HNA del donante con neutrófilos cebados del receptor atrapados en la microvasculatura pulmonar. Genera liberación masiva de citoquinas y daño de la barrera alvéolo-capilar con edema pulmonar no cardiogénico masivo e hipoxemia severa refractaria.',
    reversibleFactors: [
      'Suspensión inmediata de la transfusión de hemoderivados involucrada.',
      'Ventilación mecánica protectora con bajo volumen tidal (6 mL/kg) y titulación de PEEP.',
      'Evitar la sobrecarga de volumen con cristaloides y soporte circulatorio prudente.',
      'Conservar y devolver la bolsa de sangre a hemoterapia para investigación inmunológica.'
    ],
    clinicalClues: [
      'Hipoxemia severa (PaO2/FiO2 < 300) dentro de las 6 horas de una transfusión.',
      'Infiltrados alveolares bilaterales difusos en radiografía de tórax ("pulmón blanco").',
      'Presión capilar pulmonar normal sin signos de sobrecarga ventricular izquierda.'
    ]
  },

  // 13. HIPERTENSIÓN ENDOCRANEANA Y TRÍADA DE CUSHING
  'case-neuro-cushing-herniation': {
    cause: 'Herniación Cerebral e Isquemia de Tronco por Hipertensión Endocraneana Aguda',
    categoryType: 'Emergencia Neuroquirúrgica',
    lethalMechanism: 'Aumento descontrolado de la presión intracraneal (PIC > 30-40 mmHg) que supera la presión de perfusión cerebral (PPC = PAM - PIC). Desencadena la respuesta refleja de Cushing (hipertensión reactiva para vencer la PIC, bradicardia refleja e irregularidad respiratoria) y herniación uncal o amigdalina con paro cardiorrespiratorio bulbar.',
    reversibleFactors: [
      'Terapia osmolar urgente con Manitol al 20% (0.5 a 1.0 g/kg) o Solución Salina Hipertónica al 3% (250 mL).',
      'Hiperventilación transitoria controlada para meta de PaCO2 entre 30 y 35 mmHg.',
      'Posición con cabecera a 30 grados, cabeza en línea media y descompresión de apósitos cervicales.',
      'Profundización anestésica y relajación para evitar aumentos de presión venosa central.',
      'Craneotomía y descompresión quirúrgica urgente por neurocirugía.'
    ],
    clinicalClues: [
      'Tríada de Cushing: Hipertensión arterial marcada, bradicardia extrema y depresión respiratoria.',
      'Anisocoria o midriasis unilateral fija arreactiva (signo de herniación uncal inminente).',
      'Ondas A de Lundberg (ondas meseta) en el monitor invasivo de PIC.'
    ]
  },

  // 14. ASPIRACIÓN DE CUERPO EXTRAÑO EN PEDIATRÍA
  'case-pediatric-foreign-body-aspiration': {
    cause: 'Asfixia e Hipoxia Anóxica por Oclusión Mecánica de Vía Aérea en Pediatría',
    categoryType: 'Emergencia Quirúrgica Pediátrica / Neonatal',
    lethalMechanism: 'Impactación de un cuerpo extraño en la carina o bronquio principal con fenómeno de válvula o taponamiento respiratorio completo. Genera hiperinsuflación unilateral, atelectasia masiva contralateral, desaturación refractaria y paro en asistolia anóxica por agotamiento del miocardio infantil.',
    reversibleFactors: [
      'Broncoscopia rígida inmediata para extracción óptica directa del cuerpo extraño.',
      'Mantenimiento cuidadoso de la ventilación espontánea para evitar desplazar el objeto distalmente.',
      'Evitar presión positiva excesiva que pueda transformar una obstrucción parcial en completa.',
      'Oxigenoterapia al 100% y aspiración suave bajo visión directa.'
    ],
    clinicalClues: [
      'Aparición súbita de estridor, tos quintosa o silencio auscultatorio unilateral.',
      'Atrapamiento aéreo o atelectasia masiva en radiografía de tórax.',
      'Desaturación progresiva no corregible con oxígeno en cánula.'
    ]
  },

  // 15. QUEMADURA POR INHALACIÓN
  'case-airway-burn-inhalation-stridor': {
    cause: 'Obstrucción Respiratoria Completa por Quemadura Inhalatoria y Edema de Vía Aérea',
    categoryType: 'Hipoxia / Vía Aérea Crítica',
    lethalMechanism: 'Lesión térmica y química directa sobre la mucosa supraglótica y laringotraqueal. Desencadena edema masivo progresivo que oblitera completamente la luz de la glotis en cuestión de horas, impidiendo cualquier intento tardío de intubación y provocando asfixia obstructiva mortal.',
    reversibleFactors: [
      'Intubación endotraqueal precoz profiláctica antes de que el edema cierre la glotis.',
      'Oxígeno al 100% humidificado para desplazar el monóxido de carbono (reducción de vida media de carboxihemoglobina).',
      'Broncodilatadores nebulizados y heparina inhalada para disolver tapones de fibrina y hollín.',
      'Preparación de equipo quirúrgico para cricotiroidotomía de rescate.'
    ],
    clinicalClues: [
      'Vellos nasales chamuscados, esputo carbonáceo y quemaduras peribucales.',
      'Disfonía progresiva, estridor inspiratorio y tiraje que indican compromiso glótico avanzado.',
      'Niveles elevados de Carboxihemoglobina (COHb > 15-20%).'
    ]
  },

  // 16. TROMBOEMBOLISMO PULMONAR MASIVO (TEP)
  'case-pulmonary-embolism-collapse': {
    cause: 'Choque Obstructivo y Cor Pulmonale Agudo por Tromboembolismo Pulmonar Masivo',
    categoryType: 'Embolismo Perioperatorio',
    lethalMechanism: 'Migración de trombos venosos masivos que ocluyen > 50% del lecho vascular arterial pulmonar. Provoca aumento exponencial de la poscarga del ventrículo derecho (VD), dilatación y falla aguda del VD con abombamiento del tabique interventricular hacia la izquierda, colapso de la precarga del ventrículo izquierdo y paro en AESP.',
    reversibleFactors: [
      'Trombólisis farmacológica sistémica (Alteplasa / rtPA 100 mg en 2 horas o bolo de rescate en paro).',
      'Soporte inotrópico y vasopresor (Norepinefrina para mantener perfusión coronaria del VD y Dobutamina).',
      'Optimización cautelosa de la precarga (evitar sobrecarga masiva de líquidos que empeore la dilatación del VD).',
      'Embolectomía quirúrgica o percutánea si la trombólisis está formalmente contraindicada.',
      'Considerar asistencia mecánica circulatoria (ECMO veno-arterial).'
    ],
    clinicalClues: [
      'Caída brusca y masiva del EtCO2 con taquicardia sinusal e hipotensión arterial severa.',
      'Patrón S1Q3T3 y sobrecarga derecha aguda en el electrocardiograma.',
      'Ecocardiograma transesofágico (ETE) con dilatación severa del VD, signo de McConnell y colapso del VI.'
    ]
  },

  // 17. EMBOLIA GASEOSA VENOSA
  'case-air-embolism-craniotomy': {
    cause: 'Choque Obstructivo por Embolia Gaseosa Venosa Masiva (EGV) en Neurocirugía Sentada',
    categoryType: 'Embolismo Perioperatorio',
    lethalMechanism: 'Entrada de grandes volúmenes de aire a través de senos venosos durales o venas diploicas rígidas que no colapsan debido a la presión hidrostática subatmosférica en posición sentada. El aire se acumula en el tracto de salida del ventrículo derecho formando un bloqueo mecánico ("air lock") que interrumpe el flujo sanguíneo hacia los pulmones, provocando hipoxemia crítica y paro en AESP.',
    reversibleFactors: [
      'Aviso inmediato al neurocirujano para inundar el campo quirúrgico con suero fisiológico y ocluir las fuentes de entrada.',
      'Aspiración de aire a través de un Catéter Venoso Central multiorificio posicionado en aurícula derecha.',
      'Suspensión inmediata del Óxido Nitroso (N2O) y administración de O2 al 100% (para acelerar la absorción de nitrógeno).',
      'Compresión yugular bilateral transitoria para aumentar la presión venosa intracraneal y sangrar el vaso abierto.',
      'Colocación del paciente en decúbito lateral izquierdo y Trendelenburg (posición de Durant) si es posible.'
    ],
    clinicalClues: [
      'Caída repentina e inexplicable del EtCO2 con aumento de la presión en arteria pulmonar.',
      'Sonido característico en "rueda de molino" (mill-wheel murmur) audible por fonendoscopio precordial.',
      'Burbujas en aurícula derecha visualizadas por Ecocardiografía Doppler transcutánea o transesofágica.'
    ]
  },

  // 18. HEMORRAGIA POSTPARTO Y ATONÍA UTERINA
  'case-postpartum-hemorrhage-atony': {
    cause: 'Choque Hemorrágico Exanguinante e Hipovolemia Crítica por Atonía Uterina Postparto',
    categoryType: 'Choque Hemorrágico / Hipovolemia',
    lethalMechanism: 'Falta de contracción miometrial ("ligaduras vivas de Pinard") tras el alumbramiento, permitiendo la exanguinación a través de las arterias espirales uterinas a un ritmo de 500-1000 mL/minuto. La pérdida aguda de más del 40-50% de la masa eritrocitaria y factores de coagulación lleva a shock hipovolémico profundo, hipotermia, acidosis, coagulopatía (tríada de la muerte) y paro cardíaco.',
    reversibleFactors: [
      'Masaje uterino bimanual continuo y uterotónicos enérgicos: Oxitocina en infusión, Metilergonovina, Carbetocina y Misoprostol.',
      'Activación inmediata del Código Rojo / Protocolo de Transfusión Masiva 1:1:1 precoz.',
      'Ácido Tranexámico 1g IV administrado tempranamente (estudio WOMAN).',
      'Colocación de Balón de Taponamiento Uterino (Bakri) o traje antichoque no neumático (TANN).',
      'Técnicas quirúrgicas hemostáticas: Suturas compresivas de B-Lynch, ligadura de arterias hipogástricas o histerectomía de rescate.'
    ],
    clinicalClues: [
      'Útero blando, supraumbilical y no contraído con sangrado transvaginal exanguinante.',
      'Hipotensión severa (PA 65/30 mmHg), taquicardia extrema (> 140 lpm) y frialdad periférica.',
      'Disminución del hematocrito y plaquetas con hipofibrinogenemia progresiva (< 200 mg/dL).'
    ]
  },

  // 19. HERNIA DIAFRAGMÁTICA CONGÉNITA
  'case-neonatal-congenital-diaphragmatic-hernia': {
    cause: 'Falla Cardiorrespiratoria Neonatal por Hernia Diafragmática e Hipertensión Pulmonar Persistente',
    categoryType: 'Emergencia Quirúrgica Pediátrica / Neonatal',
    lethalMechanism: 'Ocupación del hemitórax izquierdo por estómago, asas intestinales y lóbulo hepático que impide el desarrollo pulmonar adecuado (hipoplasia pulmonar grave e hiperreactividad vascular). La ventilación con presión excesiva provoca barotrauma con neumotórax a tensión en el pulmón sano remanente, desatando cortocircuito derecha-izquierda masivo, hipoxemia refractaria y muerte.',
    reversibleFactors: [
      'Evitar estrictamente la ventilación con mascarilla facial (intubación endotraqueal inmediata y descompresión gástrica con sonda Replogle).',
      'Ventilación mecánica gentil protectora (PIP < 20-22 cmH2O, PEEP moderada e hipercapnia permisiva).',
      'Tratamiento de la crisis de hipertensión pulmonar con Óxido Nítrico Inhalado (iNO).',
      'Sedación profunda y relajación para evitar llanto y aumentos en las presiones pulmonares.',
      'Diferir la cirugía correctiva hasta lograr la estabilidad hemodinámica y gasométrica neonatal.'
    ],
    clinicalClues: [
      'Abdomen excavado (escafoide) con ruidos hidroaéreos en hemitórax izquierdo.',
      'Diferencia pre-postductal de SpO2 > 10-15% (evidencia de cortocircuito derecha-izquierda).',
      'Radiografía con imagen en "panal de abejas" o asas intestinales en tórax con desviación contralateral del mediastino.'
    ]
  },

  // 20. DISREFLEXIA AUTONÓMICA
  'case-autonomic-dysreflexia-quadriplegia': {
    cause: 'Emergencia Hipertensiva Maligna por Disreflexia Autonómica en Lesión Medular Alta',
    categoryType: 'Emergencia Neuroquirúrgica',
    lethalMechanism: 'Estímulo nociceptivo por debajo del nivel de lesión medular (ej. distensión vesical, tracción rectal) que desata una descarga refleja simpática masiva descontrolada a través de los nervios esplácnicos. Al no existir inhibición descendente del encéfalo por la transección medular, se produce vasoespasmo arteriolar masivo con hipertensión paroxística catastrófica, bradicardia refleja vagal, riesgo inminente de hemorragia intracraneal y edema pulmonar agudo.',
    reversibleFactors: [
      'Identificación y remoción inmediata del estímulo desencadenante (desobstruir o colocar sonda vesical, desimpactar fecaloma, cese de estímulo quirúrgico).',
      'Profundización anestésica inmediata con anestésicos volátiles o anestesia espinal.',
      'Vasodilatadores de acción rápida intravenosos: Nitroglicerina, Nitroprusiato de sodio o Nicardipino.',
      'Posición sentada del paciente para provocar descenso ortostático de la presión arterial.'
    ],
    clinicalClues: [
      'Hipertensión arterial paroxística severa (PA > 200/120 mmHg) en paciente con lesión medular por encima de T6.',
      'Bradicardia refleja extrema por estimulación de barorreceptores carotídeos.',
      'Sudoración profusa y rubor por encima del nivel de la lesión, con palidez y piel de gallina por debajo.'
    ]
  },

  // 21. SÍNDROME DE RESECCIÓN TRANSURETRAL (RTU)
  'case-transurethral-resection-turp-syndrome': {
    cause: 'Intoxicación Hídrica e Hiponatremia Dilucional Aguda (Síndrome RTU)',
    categoryType: 'Alteración Metabólica / Hidroelectrolítica',
    lethalMechanism: 'Absorción masiva y rápida de litros de solución de irrigación no electrolítica (glicina o sorbitol) a través de los senos venosos prostáticos abiertos. Provoca hipervolemia aguda con sobrecarga circulatoria (edema pulmonar) e hiponatremia dilucional extrema (Na+ < 115-120 mEq/L) que condiciona edema cerebral hiperagudo, convulsiones, herniación y arritmias mortales.',
    reversibleFactors: [
      'Suspensión inmediata de la resección prostática y cierre de los líquidos de irrigación.',
      'Solución Salina Hipertónica al 3% (100 a 150 mL en 10-15 minutos) para elevar el sodio sérico de forma segura y revertir el edema cerebral.',
      'Diuréticos de asa (Furosemida 20 a 40 mg IV) para forzar la eliminación de agua libre.',
      'Soporte ventilatorio invasivo si existe deterioro neurológico o edema pulmonar agudo.',
      'Monitorización seriada y urgente de electrolitos plasmáticos y gasometría arterial.'
    ],
    clinicalClues: [
      'Confusión, náuseas, visión borrosa, bradicardia e hipertensión temprana (por sobrecarga de volumen).',
      'Colapso hemodinámico tardío con cianosis e hipoxemia por edema pulmonar no cardiogénico.',
      'Sodio sérico medido críticamente bajo (< 120 mEq/L) con osmolaridad plasmática reducida.'
    ]
  },

  // 22. CUERPO EXTRAÑO EN TRÁQUEA PEDIÁTRICA
  'case-airway-foreign-body-pediatric-trachea': {
    cause: 'Asfixia Obstructiva Crítica por Cuerpo Extraño Tráqueo-Carinal en Pediatría',
    categoryType: 'Emergencia Quirúrgica Pediátrica / Neonatal',
    lethalMechanism: 'Desplazamiento de un cuerpo extraño vegetal o plástico hacia la bifurcación carinal que ocluye simultáneamente la entrada de ambos bronquios fuente. La ausencia total de intercambio gaseoso conduce a anoxia hiperaguda, bradicardia vagal refleja severa y paro en asistolia irreversible en menos de 3 minutos.',
    reversibleFactors: [
      'Extracción urgente mediante broncoscopia rígida con pinzas ópticas pediátricas.',
      'Mantenimiento de la respiración espontánea guiada con Sevoflurano evitando la presión positiva que impacte el objeto.',
      'Preparación de broncoscopio rígido de varios calibres y sistema de succión potente en sala.',
      'Oxigenación continua y maniobras delicadas sin traumatizar la mucosa subglótica.'
    ],
    clinicalClues: [
      'Episodio súbito de asfixia, cianosis y afonía en niño sin antecedentes infecciosos.',
      'Silencio auscultatorio bilateral completo en ausencia de neumotórax.',
      'Bradicardia hipóxica rápida con complejos QRS anchos que avisa el paro inminente.'
    ]
  },

  // 23. INESTABILIDAD CERVICAL C1-C2
  'case-neuro-airway-cervical-unstable-c2': {
    cause: 'Shock Neurogénico y Parálisis Frénica por Lesión Medular Cervical C1-C2',
    categoryType: 'Emergencia Neuroquirúrgica',
    lethalMechanism: 'Movilización intempestiva del cuello con luxación o fractura de la apófisis odontoides o atlas que comprime la médula cervical alta. Provoca parálisis diafragmática inmediata por afectación de las raíces del nervio frénico (C3-C5), pérdida completa del tono simpático vascular (shock neurogénico profundo con vasodilatación y bradicardia) y muerte por apnea y colapso circulatorio.',
    reversibleFactors: [
      'Inmovilización manual en línea estricta (MILS) durante cualquier manipulación de la vía aérea.',
      'Intubación orotraqueal mediante Videolaringoscopio con pala hipercurvada o Fibrobroncoscopio flexible sin extensión cervical.',
      'Soporte vasopresor temprano con Norepinefrina para mantener PAM > 85 mmHg y asegurar la perfusión medular.',
      'Evitar tracción cefálica o collarines rígidos que impidan la apertura bucal.',
      'Estabilización quirúrgica o fijación con halo chaleco de urgencia.'
    ],
    clinicalClues: [
      'Hipotensión arterial severa combinada con bradicardia (incompatibilidad paradójica característica del shock neurogénico).',
      'Pérdida súbita del esfuerzo ventilatorio diafragmático tras manipular el cuello.',
      'Visualización tomográfica de fractura del odontoides o aumento del espacio atlanto-odontoideo (> 3 mm).'
    ]
  },

  // 24. TAPONAMIENTO CARDÍACO AGUDO
  'case-cardiac-tamponade-perioperative-echo': {
    cause: 'Choque Obstructivo Severo por Taponamiento Cardíaco Agudo y Hemopericardio a Tensión',
    categoryType: 'Choque Obstructivo',
    lethalMechanism: 'Acumulación rápida de sangre o líquido a tensión en el saco pericárdico poco distensible. La presión intrapericárdica supera la presión diastólica de llenado del ventrículo y aurícula derecha, colapsando las cavidades derechas en diástole e impidiendo el llenado biventricular (Tríada de Beck), lo que desencadena un colapso del gasto cardíaco y paro en AESP.',
    reversibleFactors: [
      'Pericardiocentesis evacuadora inmediata de rescate guiada por ultrasonido o ecocardiograma.',
      'Apertura y drenaje quirúrgico de emergencia mediante ventana pericárdica subxifoidea o toracotomía.',
      'Optimización de la precarga con bolos de volumen rápido para mantener abiertas las cavidades derechas hasta descomprimir.',
      'Evitar el inicio o profundización de vasodilatadores y fármacos que depriman la contractilidad miocárdica.',
      'Ventilación con presiones intratorácicas mínimas para no reducir aún más el retorno venoso.'
    ],
    clinicalClues: [
      'Tríada de Beck clásica: Hipotensión arterial severa, ruidos cardíacos apagados e ingurgitación yugular.',
      'Pulso paradójico (caída de PAS > 10 mmHg durante la inspiración espontánea).',
      'Ecocardiograma con colapso diastólico de la pared libre del ventrículo derecho y aurícula derecha ("signo del rebote").'
    ]
  },

  // 25. EMBOLIA DE LÍQUIDO AMNIÓTICO (AFE)
  'case-obstetric-amniotic-fluid-embolism': {
    cause: 'Choque Cardiogénico y CID Fulminante por Embolia de Líquido Amniótico (AFE)',
    categoryType: 'Emergencia Obstétrica',
    lethalMechanism: 'Entrada de componentes fetales (células escamosas, lanugo, mucina) a la circulación venosa materna que desata una respuesta anafilactoide inflamatoria hiperaguda. Fase 1: vasoespasmo pulmonar masivo con falla e infarto agudo del ventrículo derecho; Fase 2: choque cardiogénico del ventrículo izquierdo, atonía uterina masiva y coagulopatía intravascular diseminada (CID) con consumo fulminante de factores.',
    reversibleFactors: [
      'Soporte inotrópico y vasopresor agresivo precoz (Norepinefrina + Dobutamina / Milrinona).',
      'Manejo de Reanimación Hemostática Temprana con Crioprecipitados (meta fibrinógeno > 200 mg/dL), Plasma y Plaquetas.',
      'Ácido Tranexámico 1g IV temprano para frenar la hiperfibrinolisis secundaria.',
      'Extracción fetal inmediata mediante cesárea de emergencia para optimizar la hemodinámica materna.',
      'Considerar canulación para oxigenación por membrana extracorpórea (ECMO veno-arterial) en centros de tercer nivel.'
    ],
    clinicalClues: [
      'Colapso cardiovascular repentino y cianosis durante el parto, cesárea o puerperio inmediato.',
      'Hemorragia incoagulable de todos los accesos vasculares, heridas quirúrgicas y genitales.',
      'Ecocardiograma que muestra dilatación extrema del ventrículo derecho con hipocinesia global.'
    ]
  },

  // 26. TÓRAX INESTABLE Y CONTUSIÓN PULMONAR
  'case-trauma-flail-chest-pulmonary-contusion': {
    cause: 'Insuficiencia Respiratoria Grave y Shock Hipovolémico por Tórax Inestable y Contusión Masiva',
    categoryType: 'Choque Hemorrágico / Hipovolemia',
    lethalMechanism: 'Pérdida de la continuidad esquelética de la pared torácica por fracturas costales dobles en múltiples arcos, provocando movimiento paradójico del segmento inestable con bamboleo mediastínico. La contusión pulmonar subyacente produce hemorragia intraalveolar masiva, alteración severa de la relación V/Q, hipoxemia refractaria y shock hipovolémico por hemotórax masivo asociado.',
    reversibleFactors: [
      'Estabilización neumática interna mediante intubación endotraqueal y ventilación con presión positiva controlada con PEEP.',
      'Drenaje torácico inmediato del hemoneumotórax con tubo pleural 28-32 Fr.',
      'Analgesia regional temprana (bloqueo paravertebral o erector de la espina) para restaurar la mecánica ventilatoria.',
      'Manejo cauto de líquidos endovenosos para no exacerbar el edema hemorrágico del parénquima contundido.',
      'Fijación quirúrgica costal en casos de inestabilidad severa o deformidad torácica extensa.'
    ],
    clinicalClues: [
      'Movimiento paradójico visible de la pared torácica (depresión en inspiración, protrusión en espiración).',
      'Crepitación ósea costal palpable con asimetría ventilatoria.',
      'Opacidades alveolares parchadas y hemotórax visible en la radiografía o tomografía de tórax.'
    ]
  }
};

/**
 * Helper to obtain the clinical etiology and lethal mechanism for any clinical case.
 */
export function getCaseClinicalEtiology(caseItem: { id: string; title?: string; category?: string }): CaseEtiologyInfo {
  if (CASE_ETIOLOGY_REGISTRY[caseItem.id]) {
    return CASE_ETIOLOGY_REGISTRY[caseItem.id];
  }

  // Fallback intelligent deductive mapping based on case title or category:
  const title = (caseItem.title || '').toLowerCase();
  
  if (title.includes('infarto') || title.includes('stemi') || title.includes('isquemia miocárdica')) {
    return {
      cause: 'Infarto Agudo de Miocardio Perioperatorio / Shock Cardiogénico',
      categoryType: 'Infarto Agudo de Miocardio / Shock Cardiogénico',
      lethalMechanism: 'Necrosis miocárdica transmural aguda por oclusión coronaria o desbalance severo de oxígeno que deteriora el gasto cardíaco y la presión de perfusión coronaria.',
      reversibleFactors: [
        'Optimización de la Presión de Perfusión Coronaria con vasopresores.',
        'Soporte inotrópico precoz (Dobutamina/Norepinefrina).',
        'Activación inmediata de hemodinamia para angioplastia primaria.',
        'Alivio de la sobrecarga ventricular y antiisquémicos titulados.'
      ],
      clinicalClues: ['Elevación de segmento ST en ECG', 'Hipotensión progresiva', 'Caída de gasto cardíaco']
    };
  }

  if (title.includes('hemorrág') || title.includes('sangrado') || title.includes('hipovolem') || title.includes('atoni')) {
    return {
      cause: 'Choque Hemorrágico Severo e Hipovolemia Exanguinante',
      categoryType: 'Choque Hemorrágico / Hipovolemia',
      lethalMechanism: 'Pérdida sanguínea crítica intravascular no compensada que genera depleción total del gasto cardíaco y paro en actividad eléctrica sin pulso.',
      reversibleFactors: [
        'Transfusión masiva 1:1:1 precoz.',
        'Ácido Tranexámico 1g IV.',
        'Hipotensión permisiva.',
        'Control quirúrgico inmediato de la hemostasia.'
      ],
      clinicalClues: ['Taquicardia severa', 'Hipotensión arterial', 'Caída precipitada del EtCO2']
    };
  }

  if (title.includes('anafilax') || title.includes('shock anafiláctico')) {
    return {
      cause: 'Shock Anafiláctico Grado IV / Vasoplejia Severa',
      categoryType: 'Choque Distributivo / Anafilaxia',
      lethalMechanism: 'Vasodilatación y permeabilidad vascular masiva mediada por histamina que causa colapso distributivo y broncoespasmo.',
      reversibleFactors: [
        'Adrenalina IV en bolos titulados.',
        'Carga rápida de cristaloides isotónicos.',
        'Broncodilatadores y sulfato de magnesio.'
      ],
      clinicalClues: ['Hipotensión súbita', 'Presión pico elevada', 'Eritema cutáneo']
    };
  }

  // Generic fallback
  return {
    cause: `Descompensación Crítica Perioperatoria (${caseItem.title || 'Caso Quirúrgico'})`,
    categoryType: 'Emergencia Perioperatoria Crítica',
    lethalMechanism: 'Colapso cardiopulmonar agudo por fallo de perfusión tisular y respuesta inflamatoria/isquémica no tratada a tiempo.',
    reversibleFactors: [
      'Soporte vital avanzado inmediato.',
      'Optimización de vía aérea y oxigenación.',
      'Soporte hemodinámico con vasopresores o inotrópicos según etiología.'
    ],
    clinicalClues: ['Deterioro hemodinámico en monitor', 'Arritmia cardíaca', 'Caída de la saturación']
  };
}

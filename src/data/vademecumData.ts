export interface DrugDoseScheme {
  indicacion: string;
  dosis: string;
  via?: string;
  notas?: string;
}

export interface DrugPharmacokinetics {
  inicio: string;
  pico?: string;
  duracion: string;
  metabolismo: string;
}

export interface DrugOrganEffects {
  cardiovascular?: string;
  respiratorio?: string;
  snc?: string;
  otros?: string;
}

export interface VademecumDrug {
  id: string;
  nombre: string;
  categoria: string;
  categoriaSecundaria?: string;
  clasificacion: string;
  mecanismo: string;
  perlaClinica: string;
  precaucion?: string;
  bibliografia?: string;
  farmacocinetica?: DrugPharmacokinetics;
  esquemasDosis?: DrugDoseScheme[];
  efectosOrganicos?: DrugOrganEffects;
}

export const VADEMECUM_DRUGS: VademecumDrug[] = [
  // -------------------------------------------------------------
  // REVERSORES FARMACOLÓGICOS
  // -------------------------------------------------------------
  {
    id: 'sugammadex',
    nombre: 'Sugammadex (Bridion)',
    categoria: 'Reversores Farmacológicos',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Gamma-ciclodextrina modificada quelante selectiva de BNM aminoesteroideos',
    mecanismo: 'Encapsula e inactiva por quelación directa en proporción 1:1 las moléculas libres de rocuronio > vecuronio en plasma, creando un gradiente de concentración que extrae el bloqueante de los receptores nicotínicos de la unión neuromuscular hacia el compartimento intravascular.',
    farmacocinetica: {
      inicio: '< 2 minutos',
      pico: '2 - 3 minutos',
      duracion: 'Excreción renal inalterada (>75%)',
      metabolismo: 'No sufre metabolismo hepático; excreción renal inalterada (T1/2 ~2 horas).'
    },
    esquemasDosis: [
      {
        indicacion: 'Reversión de Bloqueo Moderado (Reaparición de T2 en TOF)',
        dosis: '2 mg/kg IV peso real',
        via: 'IV en bolo directo (10 segundos)',
        notas: 'Tiempo medio de recuperación a TOF ratio > 0.9: ~1.5 - 2 minutos.'
      },
      {
        indicacion: 'Reversión de Bloqueo Profundo (1-2 respuestas en Post-Tetanic Count / PTC)',
        dosis: '4 mg/kg IV peso real',
        via: 'IV bolo directo',
        notas: 'Recuperación promedio a TOF ratio > 0.9: ~3 minutos.'
      },
      {
        indicacion: 'Reversión Inmediata de Rescate / Emergencia ("No intubo, no ventilo" tras Rocuronio 1.2 mg/kg)',
        dosis: '16 mg/kg IV peso real',
        via: 'IV bolo rápido',
        notas: 'Dosis rescate en los primeros 3 min tras inducción. Recuperación a TOF 0.9 en ~1.5 min.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Bradicardia refleja severa y paro cardíaco transitorio reportado en casos raros (<1%); tener atropina lista.',
      respiratorio: 'No produce recurarización si se dosifica por peso real.',
      snc: 'Sin efecto central sedante; el paciente recupera fuerza diafragmática y de vía aérea rápidamente.',
      otros: 'Disminuye la eficacia de anticonceptivos orales por 7 días (asesorar a la paciente).'
    },
    perlaClinica: 'En mujeres en edad fértil con anticonceptivos orales, advertir uso de método de barrera por 7 días por fijación del progestágeno. Si se requiere re-bloquear tras sugammadex, usar bencilisoquinolinas (cisatracurio/atracurio) o succinilcolina.',
    precaucion: 'Bradicardia severa refleja y anafilaxia infrecuente. Contraindicado en insuficiencia renal terminal en diálisis sin disponibilidad de filtros de alto flujo.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020.'
  },
  {
    id: 'neostigmina',
    nombre: 'Neostigmina Metilsulfato',
    categoria: 'Reversores Farmacológicos',
    clasificacion: 'Inhibidor reversible de la acetilcolinesterasa (carbamato cuaternario)',
    mecanismo: 'Inhibe competitivamente la enzima acetilcolinesterasa en la hendidura sináptica, prolongando y aumentando la concentración de acetilcolina en los receptores nicotínicos musculares para desplazar el relajante neuromuscular no despolarizante.',
    farmacocinetica: {
      inicio: '1 - 3 minutos',
      pico: '7 - 10 minutos',
      duracion: '45 - 90 minutos',
      metabolismo: 'Metabolismo hepático (50%) y excreción renal inalterada (50%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Reversión Convencional de BNM (Mínimo 4 respuestas visibles en TOF)',
        dosis: '0.04 - 0.07 mg/kg IV (Máximo 5 mg dosis total)',
        via: 'IV lenta en 2-3 minutos',
        notas: 'SIEMPRE coadministrar con Atropina (0.015 - 0.02 mg/kg) o Glicopirrolato (0.01 mg/kg).'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Bradicardia sinusal severa, bloqueo AV, asistolia (prevenida con atropina).',
      respiratorio: 'Broncoconstricción, aumento profuso de secreciones traqueobronquiales.',
      snc: 'No cruza barrera hematoencefálica (amina cuaternaria).',
      otros: 'Aumento del peristaltismo intestinal, salivación, miosis y náuseas/vómitos postoperatorios (NVPO).'
    },
    perlaClinica: 'Regla de oro de Neostigmina: NUNCA administrar si no hay al menos 4 respuestas en el tren de cuatro (TOF con T4 presente). Si se administra en bloqueo profundo (>80% receptores ocupados), genera debilidad paradójica por bloqueo despolarizante colinérgico.',
    precaucion: 'Asistolia refleja mortal si no se administra con anticolinérgico. Broncoespasmo en asmáticos graves.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. 2015.'
  },
  {
    id: 'flumazenil',
    nombre: 'Flumazenil (Anexate)',
    categoria: 'Reversores Farmacológicos',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Antagonista competitivo específico del receptor GABAA en el sitio de las benzodiacepinas',
    mecanismo: 'Antagonista competitivo imidazobenzodiacepínico con alta afinidad por el receptor GABAA, que desplaza a las benzodiacepinas de su sitio de unión sin poseer actividad agonista intrínseca intrínseca.',
    farmacocinetica: {
      inicio: '1 - 2 minutos',
      pico: '3 - 5 minutos',
      duracion: '45 - 60 minutos (Vida media corta ~50 min)',
      metabolismo: 'Hepático rápido por CYP450; aclaramiento elevado dependiente del flujo hepático.'
    },
    esquemasDosis: [
      {
        indicacion: 'Reversión de Sedación por Benzodiacepinas (Midazolam / Diazepam)',
        dosis: '0.2 mg IV en 15 segundos; titular 0.1 mg cada 60 seg hasta respuesta (máx 1 mg)',
        via: 'IV titulada lenta',
        notas: 'Vida media más corta que midazolam; monitorizar resedación durante 2 horas.'
      },
      {
        indicacion: 'Sobredosis Intencionada / Diagnóstico Diferencial de Coma',
        dosis: '0.3 mg IV inicial, seguido de 0.5 mg cada minuto hasta 3 mg total',
        via: 'IV en bolos secuenciales',
        notas: 'Si no hay respuesta a 3-5 mg, descartar etiología benzodiacepínica pura.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento simpático transitorio, taquicardia o hipertensión leve.',
      snc: 'Despertar súbito, ansiedad, agitación, cefalea.',
      otros: 'Náuseas y vómitos.'
    },
    perlaClinica: '¡Alerta de Resedación! La vida media del Flumazenil (45-60 min) es menor que la del Midazolam o Diazepam. El paciente puede despertar y volver a deprimirse respiratoriamente 1 hora después.',
    precaucion: 'Peligro de estatus epiléptico convulsivo refractario si el paciente tiene dependencia crónica a benzodiacepinas o sobredosis concomitante de antidepresivos tricíclicos.',
    bibliografia: 'Brunton LL, et al. Goodman & Gilman Las bases farmacológicas de la terapéutica, 13ª ed.'
  },
  {
    id: 'naloxona',
    nombre: 'Naloxona (Narcan)',
    categoria: 'Reversores Farmacológicos',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Antagonista puro competitivo de receptores opioides (mu, kappa, delta)',
    mecanismo: 'Antagonista competitivo en los receptores opioides endógenos y exógenos con máxima afinidad por el receptor mu (μ), revirtiendo la depresión respiratoria, sedación y analgesia.',
    farmacocinetica: {
      inicio: '1 - 2 minutos IV (2-5 min SC/IM)',
      duracion: '30 - 60 minutos',
      metabolismo: 'Glucuronidación hepática extensa (T1/2 ~60 min).'
    },
    esquemasDosis: [
      {
        indicacion: 'Depresión Respiratoria Postoperatoria por Opioides (Preservando Analgesia)',
        dosis: '0.04 - 0.08 mg IV (diluir 1 ampolla de 0.4 mg en 9 mL SSN = 40 mcg/mL); dar 1-2 mL cada 2-3 min',
        via: 'IV diluida titulada gota a gota',
        notas: 'Titular solo hasta ventilación espontánea adecuada (>10-12 rpm), no hasta dolor masivo.'
      },
      {
        indicacion: 'Paro Cardiorrespiratorio o Sobredosis Severa de Opioides',
        dosis: '0.4 - 2 mg IV cada 2-3 minutos hasta revertir apnea',
        via: 'IV / IM / Intranasal',
        notas: 'Infusión continua si se usaron opioides de liberación prolongada o metadona.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Tormenta adrenérgica: taquicardia severa, crisis hipertensiva, arritmias ventriculares, edema pulmonar no cardiogénico.',
      respiratorio: 'Hiperventilación súbita, taquipnea.',
      snc: 'Dolor intratable agudo, agitación extrema, diaforesis, síndrome de abstinencia agudo.'
    },
    perlaClinica: 'NUNCA administrar 0.4 mg en bolo directo a un paciente postoperado. Desencadena descarga simpática masiva, edema pulmonar por catecolaminas e isquemia miocárdica fatal.',
    precaucion: 'Edema agudo de pulmón neurogénico/no cardiogénico por descarga de catecolaminas. Resedación por vida media corta vs morfina.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed.'
  },

  // -------------------------------------------------------------
  // HIPNÓTICOS E INTRAVENOSOS
  // -------------------------------------------------------------
  {
    id: 'propofol',
    nombre: 'Propofol (Diprivan)',
    categoria: 'Hipnóticos e Intravenosos',
    clasificacion: 'Alquifenol hipnótico no barbitúrico (2,6-diisopropilfenol)',
    mecanismo: 'Facilita la neurotransmisión inhibitoria gabaérgica al unirse al receptor GABAA en la subunidad beta, aumentando el tiempo de apertura del canal de Cloro e hiperpolarizando la membrana neuronal central.',
    farmacocinetica: {
      inicio: '30 - 45 segundos (un tiempo brazo-cerebro)',
      pico: '1 - 2 minutos',
      duracion: '4 - 8 minutos (redistribución rápida)',
      metabolismo: 'Conjugación hepática rápida a glucurónidos y aclaramiento extrahepático pulmonar (alto índice de extracción).'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica General en Adultos Sanos',
        dosis: '1.5 - 2.5 mg/kg IV',
        via: 'IV lenta',
        notas: 'Reducir a 1.0 - 1.5 mg/kg en ancianos o ASA III-IV. Usar peso magro en obesidad.'
      },
      {
        indicacion: 'Mantenimiento en TIVA (Anestesia Total Intravenosa)',
        dosis: '100 - 200 mcg/kg/min (6 - 12 mg/kg/h) o Ce 2.5 - 4.5 mcg/mL en TCI (Marsh/Schnider)',
        via: 'Infusión continua IV',
        notas: 'Ajustar guiado por monitoreo de profundidad anestésica (BIS 40-60).'
      },
      {
        indicacion: 'Sedación Consciente / Monitoreada (MAC)',
        dosis: '25 - 75 mcg/kg/min (1.5 - 4.5 mg/kg/h)',
        via: 'Infusión IV',
        notas: 'Excelente recuperación sin resaca ni náuseas postoperatorias.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Hipotensión marcada (disminuye RVS 15-25%), venodilatación, inotropismo negativo e inhibición del barorreflejo.',
      respiratorio: 'Depresión respiratoria profunda dosis-dependiente, apnea inicial, broncodilatación moderada, inhibe reflejos laríngeos.',
      snc: 'Disminuye CMRO2, FSC y PIC. Propiedades anticonvulsivantes potentes.',
      otros: 'Potente antiemético intrínseco (reduce NVPO).'
    },
    perlaClinica: 'El agente de elección para colocación de mascarilla laríngea por su profunda supresión de reflejos de la vía aérea faringo-laríngea. En ancianos o shock hipovolémico, titular lentamente a 0.5-1 mg/kg para prevenir colapso hemodinámico.',
    precaucion: 'Síndrome de Infusión de Propofol (PRIS) en infusiones >4-5 mg/kg/h por más de 48h (acidosis láctica, rabdomiólisis, hiperpotasemia, fallo cardíaco). Dolor a la inyección (prevenir con lidocaína 20-40 mg IV previa).',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020.'
  },
  {
    id: 'ketamina',
    nombre: 'Ketamina Clorhidrato (Ketalar)',
    categoria: 'Hipnóticos e Intravenosos',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Arilciclohexilamina anestésica disociativa',
    mecanismo: 'Bloqueo no competitivo del canal iónico del receptor NMDA (N-metil-D-aspartato) de glutamato; estimulación de vías opioides y agonismo monoaminérgico descendente.',
    farmacocinetica: {
      inicio: '30 - 60 segundos IV (3 - 4 min IM)',
      pico: '1 - 2 minutos',
      duracion: '10 - 20 minutos',
      metabolismo: 'N-desmetilación hepática por CYP3A4 a norketamina (metabolito activo 1/3 de potencia).'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica en Inestabilidad Hemodinámica / Shock / Asma Severo',
        dosis: '1.0 - 2.0 mg/kg IV (o 4 - 6 mg/kg IM)',
        via: 'IV lenta en 60 segundos',
        notas: 'Excelente en shock séptico o hipovolémico compensado y broncoespasmo severo.'
      },
      {
        indicacion: 'Coadyuvante Analgésico Preventivo Intraoperatorio (Ahorro de Opioides)',
        dosis: '0.2 - 0.5 mg/kg IV bolo inicial, seguido de 2 - 5 mcg/kg/min (0.1 - 0.3 mg/kg/h)',
        via: 'IV infusión',
        notas: 'Previene hiperalgesia inducida por opioides y sensibilización central.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Estimulación simpática central indirecta: taquicardia, aumento de PAS/PAD y gasto cardíaco (depresor miocárdico directo en choque terminal con catecolaminas agotadas).',
      respiratorio: 'Preserva ventilación espontánea y reflejos de vía aérea; potente broncodilatador directo por relajación del músculo liso bronquial.',
      snc: 'Estado disociativo (ojos abiertos, nistagmo), amnesia, analgesia intensa. Aumenta FSC, CMRO2 y PIC.',
      otros: 'Aumento profuso de salivación (coadministrar con atropina/glicopirrolato).'
    },
    perlaClinica: 'Fármaco de oro para la inducción en paciente en shock hipovolémico/séptico y en crisis de asma refractario/estatus asmático. Atenuar delirio de emergencia asociando 1-2 mg de Midazolam.',
    precaucion: 'En pacientes críticos en UCI con depleción profunda de catecolaminas endógenas, se manifiesta su efecto inotrópico negativo directo, causando hipotensión paradójica.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed.'
  },
  {
    id: 'etomidato',
    nombre: 'Etomidato (Hypnomidate)',
    categoria: 'Hipnóticos e Intravenosos',
    clasificacion: 'Derivado carboxilado del imidazol',
    mecanismo: 'Potencia selectivamente la acción inhibitoria del receptor GABAA central uniéndose a su subunidad beta-2.',
    farmacocinetica: {
      inicio: '30 - 60 segundos',
      pico: '1 minuto',
      duracion: '3 - 8 minutos',
      metabolismo: 'Hidrólisis hepática rápida por esterasas plasmáticas y microsomales hepáticas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica en Cardiopatía Severa / Inestabilidad Hemodinámica',
        dosis: '0.2 - 0.3 mg/kg IV',
        via: 'IV en bolo lento',
        notas: 'Máxima estabilidad hemodinámica; mínimo cambio en PA, FC o gasto cardíaco.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Perfil hemodinámico casi inalterado; no afecta contractilidad ni tono vascular periférico.',
      respiratorio: 'Depresión respiratoria transitoria leve; menor incidencia de apnea que propofol.',
      snc: 'Reduce FSC, PIC y CMRO2. Mantiene presión de perfusión cerebral (PPC). Alta tasa de mioclonías (prevenir con opioide o lidocaína).',
      otros: 'Inhibición reversible de la enzima 11-beta-hidroxilasa adrenal (supresión de síntesis de cortisol por 24h).'
    },
    perlaClinica: 'Inductor de elección indiscutible en pacientes con estenosis aórtica severa, fracción de eyección reducida (<30%) o shock cardiogénico. Su dosis única induce supresión adrenal transitoria clínicamente no letal en cirugía programada.',
    precaucion: 'Supresión adrenocortical dependiente de la dosis; alta incidencia de náuseas y vómitos postoperatorios (NVPO) y dolor a la inyección.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'midazolam',
    nombre: 'Midazolam (Dormicum)',
    categoria: 'Hipnóticos e Intravenosos',
    clasificacion: 'Benzodiacepina hidrosoluble de acción corta (anillo imidazólico)',
    mecanismo: 'Se une al sitio alostérico benzodiacepínico del receptor GABAA, facilitando la acción de GABA aumentando la frecuencia de apertura del canal de Cloro.',
    farmacocinetica: {
      inicio: '1 - 2 minutos IV (10-15 min VO)',
      pico: '3 - 5 minutos',
      duracion: '30 - 60 minutos',
      metabolismo: 'Metabolismo hepático extenso por CYP3A4 a 1-hidroximidazolam (metabolito activo débil).'
    },
    esquemasDosis: [
      {
        indicacion: 'Ansiolisis y Sedación Preoperatoria',
        dosis: '0.02 - 0.04 mg/kg IV (1 - 2 mg en adultos) o 0.5 mg/kg VO en niños (máx 20 mg)',
        via: 'IV / VO / Intranasal',
        notas: 'Produce excelente amnesia anterógrada.'
      },
      {
        indicacion: 'Inducción Anestésica en Pacientes de Alto Riesgo',
        dosis: '0.15 - 0.3 mg/kg IV',
        via: 'IV lenta',
        notas: 'Comienzo de acción más lento que propofol (~2-3 minutos).'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Leve disminución de la RVS y PA; excelente estabilidad cardiovascular.',
      respiratorio: 'Depresión respiratoria dosis-dependiente; marcada sinergia depresora con opioides.',
      snc: 'Amnesia anterógrada potente, ansiolisis, sedación, efecto anticonvulsivante de primera línea.'
    },
    perlaClinica: 'La coadministración de Midazolam con Fentanilo produce una sinergia hipnótica y depresora respiratoria de hasta 8 veces la esperada. Titular en alícuotas de 1 mg.',
    precaucion: 'Resedación prolongada en ancianos, insuficiencia renal/hepática o uso de inhibidores del CYP3A4. Puede causar agitación paradójica en ancianos.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },

  // -------------------------------------------------------------
  // OPIOIDES
  // -------------------------------------------------------------
  {
    id: 'fentanilo',
    nombre: 'Fentanilo Citrato',
    categoria: 'Opioides',
    clasificacion: 'Opioide sintético fenilpiperidínico agonista puro de receptores mu (μ)',
    mecanismo: 'Agonista de alta potencia en los receptores mu-opioides (μ1 analgesia supraespinal, μ2 depresión respiratoria y dependencia) acoplados a proteína Gi, hiperpolarizando la membrana neuronal mediante inhibición de adenilato ciclasa y apertura de canales de K+.',
    farmacocinetica: {
      inicio: '1 - 2 minutos IV',
      pico: '3 - 5 minutos',
      duracion: '30 - 60 minutos',
      metabolismo: 'N-desalquilación hepática por CYP3A4 a norfentanilo inactivo; alta solubilidad lipídica con redistribución rápida.'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica (Atenuación de Respuesta Laringoscópica)',
        dosis: '2 - 4 mcg/kg IV',
        via: 'IV administrado 3-5 min antes de la intubación',
        notas: 'Permite bloquear la descarga simpática de taquicardia e hipertensión al intubar.'
      },
      {
        indicacion: 'Mantenimiento Analgésico Intraoperatorio',
        dosis: '1 - 2 mcg/kg IV en bolos PRN cada 30-45 min o infusión 1 - 3 mcg/kg/h',
        via: 'IV',
        notas: 'Suspender 20-30 min antes de la extubación para evitar hipoventilación.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Excelente estabilidad hemodinámica; bradicardia vagal dosis-dependiente (no deprime contractilidad miocárdica).',
      respiratorio: 'Depresión respiratoria dosis-dependiente; disminuye respuesta ventilatoria al CO2.',
      snc: 'Analgesia potente (80-100 veces más potente que morfina), sedación, miosis.',
      otros: 'Náuseas, vómitos, íleo paralítico, rigidez torácica ("tórax en leño") si se infunde rápidamente.'
    },
    perlaClinica: 'La administración rápida en bolo de fentanilo a dosis altas (>5 mcg/kg) puede provocar el "síndrome de tórax en leño" con imposibilidad de ventilar con mascarilla facial. Se revierte inmediatamente con succinilcolina o rocuronio.',
    precaucion: 'Depresión respiratoria bifásica postoperatoria por recirculación desde compartimentos grasos. Rigidez torácica.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'remifentanilo',
    nombre: 'Remifentanilo (Ultiva)',
    categoria: 'Opioides',
    clasificacion: 'Opioide sintético anilidopiperidínico de ultracorta duración',
    mecanismo: 'Agonista selectivo de receptores mu-opioides con un enlace éster susceptible a hidrólisis rápida por esterasas plasmáticas y tisulares inespecíficas.',
    farmacocinetica: {
      inicio: '1 - 1.5 minutos',
      pico: '1.5 - 2 minutos',
      duracion: '5 - 10 minutos tras suspender infusión (independiente del tiempo de infusión)',
      metabolismo: 'Hidrólisis por esterasas sanguíneas y tisulares inespecíficas. Semivida sensible al contexto constante (~3-4 min).'
    },
    esquemasDosis: [
      {
        indicacion: 'Mantenimiento en TIVA / Balanceada',
        dosis: '0.1 - 0.5 mcg/kg/min IV infusión continua',
        via: 'Infusión continua IV (bomba o TCI Minto Ce 2 - 6 ng/mL)',
        notas: 'Asegurar analgesia de transición (morfina/dipirona/ketorolaco) 30 min antes de despertar.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Bradicardia e hipotensión marcadas (prevenible con atropina o reducción de velocidad).',
      respiratorio: 'Depresión respiratoria inmediata y profunda; apnea.',
      snc: 'Analgesia intensa y control estricto de la respuesta autonómica quirúrgica.'
    },
    perlaClinica: '¡Alerta de dolor agudo al despertar! Al apagar la infusión, el efecto analgésico desaparece en 7-10 minutos. Es mandatorio administrar un analgésico de vida media más larga (ej. Morfina 0.1 mg/kg o Dipirona + AINE) al menos 30 min antes de terminar la cirugía.',
    precaucion: 'Hiperalgesia inducida por opioides a dosis altas. Bradicardia y paro sinusal con bolos rápidos.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },

  // -------------------------------------------------------------
  // BLOQUEANTES NEUROMUSCULARES (BNM)
  // -------------------------------------------------------------
  {
    id: 'rocuronio',
    nombre: 'Rocuronio Bromuro (Esmeron)',
    categoria: 'Bloqueantes Neuromusculares',
    clasificacion: 'Bloqueante neuromuscular no despolarizante aminoesteroideo de acción intermedia',
    mecanismo: 'Antagonista competitivo de los receptores colinérgicos nicotínicos postsinápticos en la placa motora terminal.',
    farmacocinetica: {
      inicio: '60 - 90 segundos (dosis estándar) o 45 - 60 seg (dosis SRI)',
      duracion: '30 - 45 minutos (clínica efectiva)',
      metabolismo: 'Captación y excreción biliar/hepática (70%), excreción renal (30%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Intubación Orotraqueal Estándar',
        dosis: '0.6 mg/kg IV (2 x DE95)',
        via: 'IV bolo',
        notas: 'Condiciones de intubación óptimas en 90 segundos. Duración ~30-40 min.'
      },
      {
        indicacion: 'Secuencia Rápida de Intubación (SRI) / Estómago Lleno',
        dosis: '1.0 - 1.2 mg/kg IV (3-4 x DE95)',
        via: 'IV bolo rápido',
        notas: 'Condiciones de intubación en 60 segundos (alternativa a succinilcolina). Reversión posible con Sugammadex 16 mg/kg.'
      },
      {
        indicacion: 'Mantenimiento Intraoperatorio',
        dosis: '0.15 mg/kg IV en bolos PRN según tren de cuatro (TOF)',
        via: 'IV',
        notas: 'Monitorear TOF para evitar parálisis residual.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Excelente estabilidad; sin efecto vagolítico significativo a dosis clínicas; sin liberación de histamina.',
      respiratorio: 'Parálisis diafragmática y de músculos intercostales.',
      snc: 'No atraviesa barrera hematoencefálica.'
    },
    perlaClinica: 'A dosis de 1.2 mg/kg ofrece condiciones de intubación a los 60 segundos comparables a la succinilcolina, sin sus efectos adversos letales, con el respaldo de reversión inmediata con Sugammadex (16 mg/kg) ante vía aérea fallida.',
    precaucion: 'Duración prolongada en cirrosis hepática o insuficiencia renal severa. Parálisis residual postoperatoria.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'succinilcolina',
    nombre: 'Succinilcolina / Suxametonio',
    categoria: 'Bloqueantes Neuromusculares',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Bloqueante neuromuscular despolarizante (diacetilcolina)',
    mecanismo: 'Se une a los receptores nicotínicos postsinápticos despolarizando la placa motora terminal continuamente (bloqueo Fase I), impidiendo la repolarización.',
    farmacocinetica: {
      inicio: '30 - 60 segundos',
      duracion: '5 - 10 minutos',
      metabolismo: 'Hidrólisis rápida por la butirilcolinesterasa (pseudocolinesterasa plasmática).'
    },
    esquemasDosis: [
      {
        indicacion: 'Secuencia de Inducción Rápida (SRI) en Adultos',
        dosis: '1.0 - 1.5 mg/kg IV peso real',
        via: 'IV bolo rápido',
        notas: 'Fasciculaciones previas a parálisis flácida completa en 45-60 segundos.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Bradicardia sinusal, ritmo nodal (especialmente en niños o con segunda dosis); arritmias ventriculares por hiperpotasemia.',
      respiratorio: 'Parálisis motora respiratoria rápida.',
      otros: 'Aumento transitorio de K+ sérico (+0.5 mEq/L), aumento de presión intraocular (+5-10 mmHg), aumento de presión intragástrica y PIC. Mialgias postoperatorias.'
    },
    perlaClinica: 'Gatillo primario de HIPERTERMIA MALIGNA junto a anestésicos halogenados. CONTRAINDICADA en quemados >24-48h, denervación neurológica/paraplejia, distrofias musculares o sepsis prolongada por riesgo de hiperpotasemia mortal.',
    precaucion: 'Hiperpotasemia fulminante con paro cardíaco refractario. Parálisis prolongada en déficit congénito de pseudocolinesterasa.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },

  // -------------------------------------------------------------
  // ANESTÉSICOS LOCALES
  // -------------------------------------------------------------
  {
    id: 'lidocaina',
    nombre: 'Lidocaína Clorhidrato (Xilocaína)',
    categoria: 'Anestésicos Locales',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Anestésico local aminoamida de acción intermedia',
    mecanismo: 'Bloqueo reversible de los canales de Sodio dependientes de voltaje (Nav1.5) en la cara intracelular de la membrana neuronal, inhibiendo la despolarización y conducción del potencial de acción nervioso.',
    farmacocinetica: {
      inicio: 'Rápido (1 - 3 minutos)',
      duracion: '60 - 120 minutos (hasta 240 min con epinefrina)',
      metabolismo: 'Metabolismo hepático por CYP3A4 y CYP1A2 a monoetilglicinaxilidida (MEGX).'
    },
    esquemasDosis: [
      {
        indicacion: 'Dosis Máxima Segura para Infiltración / Bloqueo Nervioso',
        dosis: '4.5 mg/kg (Máximo 300 mg) SIN Epinefrina | 7 mg/kg (Máximo 500 mg) CON Epinefrina',
        via: 'Infiltración subcutánea / perineural',
        notas: 'Respetar límites para prevenir Intoxicación Sistémica por Anestésicos Locales (LAST).'
      },
      {
        indicacion: 'Antiarrítmico / Atenuación de Respuesta Laringoscópica / Analgesia Sistémica',
        dosis: '1.0 - 1.5 mg/kg IV en bolo 2-3 min antes de intubar | Infusión 1.5 - 2 mg/kg/h',
        via: 'IV',
        notas: 'Reduce dolor por inyección de propofol, broncorreactividad y consumo de opioides.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Depresión de la excitabilidad miocárdica (antiarrítmico Clase Ib); vasodilatación periférica.',
      snc: 'A dosis tóxicas: sabor metálico, adormecimiento peribucal, acúfenos, mareo, convulsiones tónico-clónicas, coma.'
    },
    perlaClinica: 'La infusión perioperatoria de Lidocaína IV (1.5-2 mg/kg/h) es un pilar de la analgesia multimodal en cirugía laparoscópica/colorrectal, acelerando el retorno de la motilidad intestinal (evita íleo) y reduciendo la respuesta inflamatoria.',
    precaucion: 'Toxicidad Sistémica por Anestésicos Locales (LAST). Tratamiento inmediato: Emulsión Lipídica al 20% (Intralipid).',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'bupivacaina',
    nombre: 'Bupivacaína (Marcaína / Sensorcaine)',
    categoria: 'Anestésicos Locales',
    clasificacion: 'Anestésico local aminoamida de larga duración y alta potencia',
    mecanismo: 'Bloqueo selectivo y prolongado de los canales de Na+ dependientes de voltaje en nervios periféricos y raíces espinales.',
    farmacocinetica: {
      inicio: 'Lento (15 - 30 minutos)',
      duracion: '3 - 8 horas (dependiendo de la localización y uso de vasoconstrictor)',
      metabolismo: 'Hepático microsomal extenso por CYP3A4.'
    },
    esquemasDosis: [
      {
        indicacion: 'Dosis Máxima Recomendada Infiltrativa / Troncular',
        dosis: '2 mg/kg (Máximo 150 mg) SIN Epinefrina | 2.5 mg/kg (Máximo 175 mg) CON Epinefrina',
        via: 'Perineural / Infiltrativa',
        notas: 'Nunca inyectar IV inadvertidamente. Aspirar frecuentemente.'
      },
      {
        indicacion: 'Anestesia Subaracnoidea / Raquídea (Bupivacaína Pesada 0.5%)',
        dosis: '8 - 15 mg (1.6 - 3.0 mL) según nivel metamérico deseado',
        via: 'Intratecal L3-L4 o L4-L5',
        notas: 'Asociar con Fentanilo 15-25 mcg o Morfina 100 mcg para analgesia prolongada.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Elevadísima cardiotoxicidad; disociación lenta de los canales de Na+ miocárdicos; arritmias ventriculares refractarias.',
      snc: 'Menor margen de seguridad entre toxicidad SNC y colapso cardiovascular (cociente CC/SNC estrecho).'
    },
    perlaClinica: 'De todos los anestésicos locales, la Bupivacaína es la más cardiotóxica por su unión lipofílica persistente a los canales de Sodio cardíacos. Ante paro o arritmias por bupivacaína, activar protocolo LAST e iniciar Emulsión Lipídica 20% de inmediato.',
    precaucion: 'LAST severo. Evitar usar bupivacaína para bloqueos intravenosos regionales (Bier).',
    bibliografia: 'Neal JM, et al. ASRA Practice Advisory on Local Anesthetic Systemic Toxicity. Reg Anesth Pain Med. 2020.'
  },

  // -------------------------------------------------------------
  // EMERGENCIAS ANESTESIOLÓGICAS
  // -------------------------------------------------------------
  {
    id: 'emulsion-lipidica',
    nombre: 'Emulsión Lipídica al 20% (Intralipid)',
    categoria: 'Emergencias Anestesiológicas',
    categoriaSecundaria: 'Reversores Farmacológicos',
    clasificacion: 'Antídoto específico para Intoxicación Sistémica por Anestésicos Locales (LAST)',
    mecanismo: 'Efecto de "sumidero lipídico" (lipid sink) que extrae el fármaco lipofílico del miocardio y cerebro hacia la fase lipídica plasmática; estimulación directa del metabolismo de ácidos grasos en miocitos y efecto inotrópico positivo.',
    farmacocinetica: {
      inicio: 'Inmediato tras administración IV',
      duracion: 'Metabolizado por lipoproteína lipasa endógena',
      metabolismo: 'Depuración lipídica reticuloendotelial.'
    },
    esquemasDosis: [
      {
        indicacion: 'Bolo Inicial de Rescate en Toxicidad por Anestésicos Locales (LAST)',
        dosis: '1.5 mL/kg peso real en bolo IV rápido durante 1 minuto (~100 mL en adulto de 70 kg)',
        via: 'IV bolo directo',
        notas: 'Puede repetirse 1-2 veces cada 3-5 minutos si persiste paro o inestabilidad.'
      },
      {
        indicacion: 'Infusión Continua de Mantenimiento post-bolo',
        dosis: '0.25 mL/kg/min (aumentar a 0.5 mL/kg/min si la PA permanece baja)',
        via: 'Infusión continua IV',
        notas: 'Mantener durante al menos 10-15 minutos después de recuperar la estabilidad hemodinámica. Límite máx: 12 mL/kg.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Restaura la conducción AV y la contractilidad miocárdica bloqueada por bupivacaína u otros anestésicos locales.',
      otros: 'Hipertrigliceridemia transitoria, pancreatitis en infusiones prolongadas extremas.'
    },
    perlaClinica: 'En paro cardíaco por LAST: Reducir las dosis individuales de Adrenalina a <1 mcg/kg (evita empeorar arritmias) y EVITAR vasopresina, bloqueantes de canales de calcio y betabloqueantes. La Emulsión Lipídica debe estar inmediatamente accesible en todo quirófano.',
    precaucion: 'No demorar el soporte vital avanzado RCP mientras se prepara la emulsión lipídica.',
    bibliografia: 'ASRA Checklist for Managing Local Anesthetic Systemic Toxicity. 2020.'
  },
  {
    id: 'adrenalina',
    nombre: 'Adrenalina / Epinefrina',
    categoria: 'Emergencias Anestesiológicas',
    categoriaSecundaria: 'Inotrópicos y Vasopresores',
    clasificacion: 'Catecolamina simpaticomimética agonista alfa y beta adrenérgica no selectiva',
    mecanismo: 'Estimula receptores alfa-1 (vasoconstricción), beta-1 (inotropismo y cronotropismo positivo potente) y beta-2 (broncodilatación y vasodilatación a dosis bajas).',
    farmacocinetica: {
      inicio: 'Inmediato IV (3-5 min IM)',
      duracion: '5 - 10 minutos',
      metabolismo: 'Degradación enzimática por COMT y MAO en hígado y terminaciones sinápticas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Paro Cardiorrespiratorio (ACLS / Asistolia, AESP, FV/TV)',
        dosis: '1 mg IV cada 3 - 5 minutos (1 ampolla 1:1000 de 1 mg)',
        via: 'IV directa con lavado de 20 mL SSN',
        notas: 'Optimiza la presión de perfusión coronaria y cerebral.'
      },
      {
        indicacion: 'Anafilaxia Intraoperatoria Severa (Grado III-IV)',
        dosis: '100 - 200 mcg IV en bolos titulados (diluir 1 mg en 10 mL = 100 mcg/mL) o 0.5 mg IM en muslo',
        via: 'IV titulada o IM',
        notas: 'Fármaco salvavidas primario en anafilaxia. Revertir broncoespasmo y colapso vascular.'
      },
      {
        indicacion: 'Soporte Inotrópico / Vasopresor en Shock Séptico o Cardiogénico',
        dosis: '0.02 - 0.2 mcg/kg/min IV infusión continua',
        via: 'Infusión continua por vía central',
        notas: 'Ajustar según PAM meta ≥ 65 mmHg y perfusión tisular.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento masivo del consumo miocárdico de oxígeno (MVO2), taquicardia, arritmias ventriculares, aumento de postcarga.',
      respiratorio: 'Broncodilatación potente mediada por receptores beta-2.',
      otros: 'Hiperglucemia, hiperlactatemia transitoria (tipo B por estímulo beta-2 glucolítico).'
    },
    perlaClinica: 'En anafilaxia durante anestesia (típicamente por relajante muscular, antibiótico o látex): la Adrenalina precoz es la única droga que previene el colapso cardiovascular irreversible. Los esteroides y antihistamínicos solo actúan horas más tarde.',
    precaucion: 'Arritmias ventriculares letales e isquemia miocárdica en ancianos o coronariópatas con dosis excesivas.',
    bibliografia: 'AHA ACLS Guidelines 2020 & Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'atropina',
    nombre: 'Atropina Sulfato',
    categoria: 'Emergencias Anestesiológicas',
    categoriaSecundaria: 'Reversores Farmacológicos',
    clasificacion: 'Antagonista competitivo anticolinérgico muscarínico de amina terciaria',
    mecanismo: 'Antagonismo competitivo de los receptores muscarínicos M1, M2 y M3 de acetilcolina, bloqueando el tono vagal parasimpático en el nódulo sinusal y AV.',
    farmacocinetica: {
      inicio: '1 - 2 minutos IV',
      pico: '2 - 4 minutos',
      duracion: '1 - 2 horas',
      metabolismo: 'Hidrólisis hepática (50%) y excreción renal inalterada (50%). Atraviesa barrera hematoencefálica.'
    },
    esquemasDosis: [
      {
        indicacion: 'Bradicardia Sinusal Sintomática o Reflejo Vagal Intraoperatorio (ej. tracción peritoneal, estrabismo)',
        dosis: '0.5 - 1.0 mg IV en bolo cada 3-5 min (Máximo 3 mg total / 0.04 mg/kg)',
        via: 'IV bolo rápido',
        notas: 'Dosis < 0.5 mg puede causar bradicardia paradójica por estímulo de receptores muscarínicos presinápticos.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento de frecuencia cardíaca y conducción AV.',
      respiratorio: 'Broncodilatación y secado de secreciones bronquiales y salivales.',
      snc: 'Midriasis, ciclopejía, síndrome anticolinérgico central a dosis elevadas.'
    },
    perlaClinica: 'NUNCA administrar dosis menores a 0.5 mg en adultos. Las dosis subterapéuticas (<0.4 mg) estimulan receptores muscarínicos M1 presinápticos centrales y ganglionares, provocando bradicardia paradójica agravada.',
    precaucion: 'Taquicardia severa con aumento peligroso del consumo de O2 miocárdico en coronarios; glaucoma de ángulo cerrado.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },

  // -------------------------------------------------------------
  // INOTRÓPICOS Y VASOPRESORES
  // -------------------------------------------------------------
  {
    id: 'noradrenalina',
    nombre: 'Noradrenalina / Norepinefrina',
    categoria: 'Inotrópicos y Vasopresores',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Catecolamina simpaticomimética potente alfa-1 adrenérgica',
    mecanismo: 'Agonista alfa-1 adrenérgico predominante (vasoconstricción arterial y venosa sistémica con aumento marcado de la RVS y precarga) con modesto efecto inotrópico beta-1.',
    farmacocinetica: {
      inicio: '1 - 2 minutos',
      duracion: '1 - 2 minutos tras suspender infusión',
      metabolismo: 'Metabolismo tisular y hepático por MAO y COMT.'
    },
    esquemasDosis: [
      {
        indicacion: 'Vasoplejía Anestésica / Shock Séptico / Hipotensión Refractaria',
        dosis: '0.05 - 0.5 mcg/kg/min IV infusión continua',
        via: 'Infusión continua por vía venosa central (o periférica proximal de emergencia transitoria)',
        notas: 'Primera línea de elección para restaurar PAM ≥ 65 mmHg en vasodilatación patológica.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento marcado de la resistencia vascular sistémica (RVS) y PAM; bradicardia refleja; aumento del retorno venoso (efecto estrés venoso).',
      otros: 'Posible vasoconstricción periférica excesiva en hipovolemia no corregida.'
    },
    perlaClinica: 'El vasopresor de primera línea incuestionable en anestesia para corregir la vasoplejía inducida por hipnóticos y en choque séptico. Previene la hipoperfusión renal y miocárdica manteniendo la PAM ≥ 65 mmHg.',
    precaucion: 'Necrosis tisular por extravasación si se administra por vía periférica pequeña. Siempre corregir volemia.',
    bibliografia: 'Surviving Sepsis Campaign Guidelines 2021 & Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'efedrina',
    nombre: 'Efedrina Sulfato',
    categoria: 'Inotrópicos y Vasopresores',
    clasificacion: 'Amina simpaticomimética mixta (acción directa e indirecta)',
    mecanismo: 'Libera noradrenalina endógena desde las terminaciones nerviosas simpáticas (efecto indirecto) y estimula directamente receptores alfa y beta-1.',
    farmacocinetica: {
      inicio: 'Inmediato IV (1 min)',
      duracion: '10 - 15 minutos',
      metabolismo: 'Eliminación renal inalterada (75%); no degradada por COMT.'
    },
    esquemasDosis: [
      {
        indicacion: 'Hipotensión Arterial Post-Inducción o Post-Bloqueo Neuroaxial con Bradicardia Leve',
        dosis: '5 - 10 mg IV en bolos PRN (diluir ampolla de 50 mg en 10 mL SSN = 5 mg/mL)',
        via: 'IV en bolos titulados',
        notas: 'Ideal cuando se busca aumentar la presión arterial y la frecuencia cardíaca simultáneamente.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento de PAS, PAD, FC, gasto cardíaco y consumo miocárdico de oxígeno.',
      respiratorio: 'Broncodilatación leve.'
    },
    perlaClinica: 'Presenta taquifilaxia marcada (disminución del efecto con dosis repetidas consecutivas) debido al agotamiento de los depósitos vesiculares de noradrenalina. Si no responde tras 2-3 bolos, cambiar a fenilefrina o noradrenalina.',
    precaucion: 'Taquifilaxia; contraindicada en pacientes tratados con inhibidores de la monoaminooxidasa (IMAO).',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },

  // -------------------------------------------------------------
  // ESTEROIDES
  // -------------------------------------------------------------
  {
    id: 'dexametasona',
    nombre: 'Dexametasona Fosfato',
    categoria: 'Esteroides',
    clasificacion: 'Glucocorticoide sintético de acción prolongada y alta potencia',
    mecanismo: 'Agonista de receptores de glucocorticoides citoplasmáticos, modulando la transcripción génica; potente efecto antiinflamatorio sin actividad mineralocorticoide intrínseca.',
    farmacocinetica: {
      inicio: '1 - 2 horas',
      pico: '2 - 4 horas',
      duracion: '36 - 72 horas (vida media biológica prolongada)',
      metabolismo: 'Hepático microsomal.'
    },
    esquemasDosis: [
      {
        indicacion: 'Profilaxis de Náuseas y Vómitos Postoperatorios (NVPO)',
        dosis: '4 - 8 mg IV administrados en la inducción anestésica',
        via: 'IV lento',
        notas: 'Más eficaz cuando se administra al inicio de la cirugía (en la inducción).'
      },
      {
        indicacion: 'Prevención de Edema de Vía Aérea / Estridor Post-Extubación',
        dosis: '8 - 16 mg IV divididos en dosis cada 6h previo a extubación programada',
        via: 'IV',
        notas: 'Disminuye la tasa de reintubación en cirugías prolongadas de cabeza/cuello.'
      }
    ],
    efectosOrganicos: {
      otros: 'Hiperglucemia leve transitoria a las 6-12 horas postoperatorias; sensación de prurito o calor perineal con inyección IV rápida sin diluir.'
    },
    perlaClinica: 'Pilar fundamental de la terapia antiemética combinada junto a Ondansetrón (disminución del riesgo relativo de NVPO >50%). Inyectar diluida o lentamente para evitar el molesto prurito/disestesia perineal.',
    precaucion: 'Monitorear glucemia capilar en diabéticos. Infecciones activas graves no controladas.',
    bibliografia: 'Gan TJ, et al. Fourth Consensus Guidelines for the Management of Postoperative Nausea and Vomiting. 2020.'
  },

  // -------------------------------------------------------------
  // ANTIINFLAMATORIOS NO ESTEROIDEOS (AINEs)
  // -------------------------------------------------------------
  {
    id: 'ketorolaco',
    nombre: 'Ketorolaco Trometamina',
    categoria: 'Antiinflamatorios No Esteroideos (AINEs)',
    clasificacion: 'AINE heterocíclico derivado del ácido acético',
    mecanismo: 'Inhibición no selectiva reversible de las enzimas ciclooxigenasa-1 (COX-1) y ciclooxigenasa-2 (COX-2), bloqueando la síntesis periférica de prostaglandinas proinflamatorias.',
    farmacocinetica: {
      inicio: '10 - 15 minutos',
      pico: '30 - 60 minutos',
      duracion: '6 - 8 horas',
      metabolismo: 'Conjugación hepática con ácido glucurónico y excreción renal inalterada (>90%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Analgesia Postoperatoria Moderada a Severa (Ahorro de Opioides)',
        dosis: '30 mg IV cada 6 - 8 horas (reducir a 15 mg en >65 años o peso <50 kg)',
        via: 'IV diluida en 50-100 mL SSN',
        notas: 'Uso máximo continuo recomendado: 48 - 72 horas para minimizar nefrotoxicidad.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Riesgo de hipertensión y sobrecarga de volumen por retención hidrosalina.',
      otros: 'Inhibe agregación plaquetaria por bloqueo de tromboxano A2 (aumenta tiempo de sangrado); nefrotoxicidad por vasoconstricción arteriolar aferente renal; gastrolesividad.'
    },
    perlaClinica: 'No administrar en pacientes hipovolémicos, ancianos deshidratados o con creatinina limítrofe, pues las prostaglandinas vasodilatadoras renales son indispensables para mantener la tasa de filtración glomerular. Contraindicado en hemorragia activa o riesgo de sangrado de lecho quirúrgico.',
    precaucion: 'Insuficiencia renal aguda, úlcera gastroduodenal activa, sangrado perioperatorio activo, tercer trimestre de embarazo.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed.'
  }
];

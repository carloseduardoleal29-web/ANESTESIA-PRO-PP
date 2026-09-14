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
  {
    id: 'tiopental',
    nombre: 'Tiopental Sódico (Pentothal)',
    categoria: 'Hipnóticos e Intravenosos',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Barbitúrico tiobarbiturato de acción ultracorta y potente neuroprotector',
    mecanismo: 'Agonista alostérico del receptor GABAA que prolonga significativamente el tiempo de apertura del canal de Cloro e inhibe la neurotransmisión excitatoria mediada por glutamato (receptores AMPA/kainato), deprimiendo el sistema reticular activador ascendente (SRAA).',
    farmacocinetica: {
      inicio: '30 - 45 segundos (un tiempo brazo-cerebro)',
      pico: '1 minuto',
      duracion: '5 - 10 minutos (terminación del efecto por rápida redistribución a músculo y tejido adiposo)',
      metabolismo: 'Metabolismo hepático lento por oxidación microsomal (~10-15% por hora); vida media de eliminación terminal prolongada (11 - 12 horas). Cinética de orden cero a dosis elevadas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica General / Secuencia de Inducción Rápida',
        dosis: '3 - 5 mg/kg IV (reducir a 1.5 - 2.5 mg/kg en ancianos, hipovolemia o shock)',
        via: 'IV en bolo lento titulado (solución reconstituida al 2.5%)',
        notas: 'Excelente agente inductor clásico. La pérdida del reflejo palpebral confirma hipnosis quirúrgica.'
      },
      {
        indicacion: 'Neuroprotección / Estatus Epiléptico Refractario / Hipertensión Endocraneana (PIC Aguda)',
        dosis: 'Bolo inicial 1.5 - 3 mg/kg IV, seguido de infusión de 1 - 5 mg/kg/h',
        via: 'IV en infusión continua bajo monitoreo electroencefalográfico continuo (EEG)',
        notas: 'Titular hasta alcanzar patrón de brote-supresión (burst suppression) en el EEG.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Venodilatación periférica marcada (reducción de precarga), depresión miocárdica directa dosis-dependiente y taquicardia refleja mediada por barorreceptores.',
      respiratorio: 'Depresión respiratoria potente, apnea transitoria posinducción; NO deprime los reflejos laríngeos (alto riesgo de laringoespasmo si la instrumentación de la vía aérea se realiza bajo plano superficial).',
      snc: 'Reducción drástica del consumo metabólico cerebral de oxígeno (CMRO2 hasta -50%), vasoconstricción cerebral, disminución del flujo sanguíneo cerebral (FSC) y descenso rápido de la presión intracraneal (PIC). Preserva la autorregulación cerebral.',
      otros: 'Solución fuertemente alcalina (pH ~10.5); precipita si se mezcla en la misma vía con fármacos ácidos (como relajantes musculares o soluciones cristaloides ácidas).'
    },
    perlaClinica: 'El fármaco neuroanestésico estándar de oro para inducir coma barbitúrico y controlar la hipertensión intracraneana aguda refractaria o estatus epiléptico. En caso de inyección intraarterial accidental: NUNCA retirar la aguja; inyectar lidocaína al 1% o papaverina/heparina para contrarrestar el vasoespasmo isquémico severo y la trombosis distal.',
    precaucion: 'CONTRAINDICACIÓN ABSOLUTA en Porfiria Aguda Intermitente o Porfiria Variegata (induce fuertemente la ácido delta-aminolevulínico sintetasa desencadenando crisis mortal). Precaución en shock hipovolémico o taponamiento cardíaco.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
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
  {
    id: 'sufentanil',
    nombre: 'Sufentanilo Citrato (Sufenta)',
    categoria: 'Opioides',
    clasificacion: 'Opioide sintético tienil-análogo de fentanilo agonista mu puro de máxima potencia',
    mecanismo: 'Agonista selectivo de altísima afinidad sobre los receptores mu-opioides (potencia analgésica 5 a 10 veces mayor que el fentanilo y 500 a 1000 veces mayor que la morfina), inhibiendo la adenilato ciclasa y bloqueando la liberación de sustancia P y neurotransmisores nociceptivos espinales.',
    farmacocinetica: {
      inicio: '1 - 2 minutos IV',
      pico: '3 - 5 minutos',
      duracion: '30 - 60 minutos a dosis bajas; prolongada tras infusiones repetidas',
      metabolismo: 'Desalquilación e hidroxilación hepática por citocromo CYP3A4 a N-desalquilsufentanilo (actividad ~10% de la molécula madre). Alta fijación a alfa-1-glicoproteína ácida (92.5%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Inducción Anestésica / Cirugía Cardíaca o Vascular Mayor',
        dosis: '1 - 2 mcg/kg IV (dosis analgésica moderada) o 2 - 8 mcg/kg IV (técnica anestésica cardíaca profunda)',
        via: 'IV lenta',
        notas: 'Brinda estabilidad hemodinámica miocárdica sobresaliente con bloqueo profundo de la respuesta al estrés quirúrgico.'
      },
      {
        indicacion: 'Mantenimiento Intraoperatorio / TIVA',
        dosis: '0.2 - 0.5 mcg/kg/h IV en infusión o bolos de 0.1 - 0.3 mcg/kg PRN',
        via: 'Infusión IV continua / TCI Gepts (Ce 0.2 - 0.8 ng/mL)',
        notas: 'Reducir la velocidad de infusión al menos 30-45 minutos antes de la extubación.'
      },
      {
        indicacion: 'Analgesia Neuroaxial Obstétrica (Espinal / Epidural)',
        dosis: 'Subaracnoideo: 2.5 - 5 mcg | Epidural: 10 - 20 mcg',
        via: 'Intratecal o Epidural combinada con bupivacaína o ropivacaína',
        notas: 'Inicio analgésico ultrarrápido (3-5 minutos) con mínimo bloqueo motor y excelente confort de parto.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Excelente estabilidad hemodinámica con menor taquicardia que otros opioides; bradicardia mediada por núcleo vagal central.',
      respiratorio: 'Depresión respiratoria profunda dosis-dependiente; disminución de la sensibilidad carotídea y central al CO2.',
      snc: 'Analgesia intensa, sedación profunda y miosis. Reduce el requerimiento de hipnóticos (CAM de halogenados hasta en un 70-80%).',
      otros: 'Rigidez torácica ("tórax en leño") si se inyecta en bolo IV acelerado; náuseas y retención urinaria.'
    },
    perlaClinica: 'Es el opioide más potente de uso clínico rutinario (10 veces más potente que fentanilo). Por vía intratecal (2.5 a 5 mcg), ofrece una analgesia obstétrica y postoperatoria de calidad superior a fentanilo con menor prurito y menor transferencia fetal.',
    precaucion: 'Rigidez de la pared torácica e imposibilidad de ventilar si se inyecta en bolo rápido sin relajante muscular previo. Depresión respiratoria tardía si se acumula en infusiones prolongadas.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },
  {
    id: 'alfentanil',
    nombre: 'Alfentanilo Clorhidrato (Rapifen)',
    categoria: 'Opioides',
    clasificacion: 'Opioide sintético fenilpiperidínico agonista mu puro de equilibrio plasmático-cerebral ultrarrápido',
    mecanismo: 'Agonista de receptores mu-opioides. Su bajísimo pKa (6.5) hace que a pH fisiológico (7.4) casi el 90% del fármaco se encuentre en su forma no ionizada difusible, lo que le otorga el tiempo de equilibrio plasma-efecto (t1/2ke0 ~1.4 min) más rápido entre todos los opioides tradicionales.',
    farmacocinetica: {
      inicio: '30 - 60 segundos (casi inmediato tras bolo IV)',
      pico: '1.5 - 2 minutos (pico plasmático-cerebral simultáneo)',
      duracion: '10 - 15 minutos (por rápida redistribución)',
      metabolismo: 'Metabolismo hepático oxidativo exclusivo mediado por el citocromo CYP3A4 a noralfentanilo inactivo. Aclaramiento muy variable según actividad enzimática individual.'
    },
    esquemasDosis: [
      {
        indicacion: 'Atenuación de Respuesta Hipertensiva a Laringoscopia / Procedimientos Cortos',
        dosis: '10 - 20 mcg/kg IV administrado 90 segundos antes de la intubación',
        via: 'IV lenta en 30 segundos',
        notas: 'Ideal para laringoscopias de corta duración, endoscopias o bloqueos nerviosos dolorosos.'
      },
      {
        indicacion: 'Mantenimiento en Cirugías Breves o Ambulatorias',
        dosis: 'Bolos de 5 - 10 mcg/kg IV PRN o infusión continua a 0.5 - 1.5 mcg/kg/min',
        via: 'Infusión continua IV',
        notas: 'Despertar y recuperación respiratoria más rápida y predecible que con fentanilo para cirugías menores a 30 minutos.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Hipotensión leve y bradicardia refleja; disminuye la descarga simpática quirúrgica de forma inmediata.',
      respiratorio: 'Depresión respiratoria precoz y profunda con apnea de corta duración.',
      snc: 'Analgesia rápida (potencia ~1/4 a 1/5 de fentanilo, 20-30 veces morfina), sedación transitoria.',
      otros: 'Riesgo elevado de rigidez torácica si se inyecta en bolo sin diluir; náuseas postoperatorias.'
    },
    perlaClinica: 'Por tener un 90% en forma no ionizada a pH 7.4, su efecto pico cerebral se alcanza en tan solo 90 segundos (vs 3-5 minutos del fentanilo). Es el opioide perfecto para maniobras breves e intensamente nociceptivas como intubación, colocación de clavos de Mayfield o cambio de tubo endotraqueal.',
    precaucion: 'Gran variabilidad interindividual en su metabolismo por variaciones genéticas del CYP3A4 o interacciones (eritromicina, diltiazem prolongan drásticamente su duración). Rigidez torácica súbita.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'tramadol',
    nombre: 'Tramadol Clorhidrato (Tramal)',
    categoria: 'Opioides',
    clasificacion: 'Analgésico de acción central dual: agonista opioide débil e inhibidor de la recaptación de monoaminas',
    mecanismo: 'Mecanismo dual complementario: 1) Su enantiómero (+)-tramadol y su metabolito activo M1 (O-desmetiltramadol) se unen con baja afinidad a receptores mu-opioides (M1 tiene afinidad 300 veces mayor que la molécula madre); 2) Inhibe la recaptación neuronal de noradrenalina y serotonina (5-HT), estimulando las vías descendentes inhibitorias del dolor a nivel del asta posterior espinal.',
    farmacocinetica: {
      inicio: '10 - 20 minutos IV (30-60 min VO)',
      pico: '30 - 45 minutos IV',
      duracion: '6 - 8 horas',
      metabolismo: 'Metabolismo hepático por CYP2D6 (produce el metabolito activo analgésico M1) y CYP3A4. Excreción renal del 90% (ajustar en falla renal FG < 30 mL/min).'
    },
    esquemasDosis: [
      {
        indicacion: 'Analgesia Multimodal Postoperatoria Moderada a Severa',
        dosis: '50 - 100 mg IV diluidos en 100 mL de SSN a pasar en 20 - 30 minutos cada 6 - 8 horas (Máx 400 mg/día)',
        via: 'IV infusión lenta intermitente',
        notas: 'NUNCA administrar en bolo IV directo sin diluir para evitar náuseas intensas, mareo y emesis.'
      },
      {
        indicacion: 'Escalofríos Postoperatorios (Shivering)',
        dosis: '0.5 - 1.0 mg/kg IV lento (25 - 50 mg en adultos)',
        via: 'IV lento',
        notas: 'Altamente efectivo para suprimir el temblor post-anestesia neuroaxial o general por modulación serotoninérgica/noradrenérgica central.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Mínimo impacto hemodinámico; raramente taquicardia o hipertensión leve.',
      respiratorio: 'Mínima depresión respiratoria a dosis terapéuticas; no deprime la motilidad gastrointestinal en la misma magnitud que los opioides puros.',
      snc: 'Analgesia multimodal, mareo, somnolencia, reducción del umbral convulsivo.',
      otros: 'Alta incidencia de náuseas y vómitos (administrar siempre con antiemético como ondansetrón o metoclopramida); sudoración y sequedad bucal.'
    },
    perlaClinica: 'Analgésico no restrictivo ideal para protocolos ERAS de transición. Por su efecto monoaminérgico espinal es además uno de los fármacos más eficaces para tratar los escalofríos postoperatorios (shivering) a dosis de 0.5-1 mg/kg. En pacientes metabolizadores lentos del CYP2D6 (hasta 7-10% de la población caucásica), el efecto analgésico puede ser muy deficiente por falta de síntesis del metabolito M1.',
    precaucion: 'Riesgo de Síndrome Serotoninérgico potencialmente letal en pacientes que reciben antidepresivos ISRS, IRSN o IMAO. Disminuye el umbral convulsivo (contraindicado en pacientes epilépticos no controlados). Ajustar intervalo a cada 12h en insuficiencia renal severa.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. Practice Guidelines for Acute Pain Management in the Perioperative Setting: ASA.'
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
  {
    id: 'vecuronio',
    nombre: 'Vecuronio Bromuro (Norcuron)',
    categoria: 'Bloqueantes Neuromusculares',
    clasificacion: 'Bloqueante neuromuscular no despolarizante aminoesteroideo de acción intermedia y alta estabilidad hemodinámica',
    mecanismo: 'Antagonista competitivo puro de los receptores colinérgicos nicotínicos postsinápticos en la placa motora terminal, sin actividad agonista ni despolarización inicial.',
    farmacocinetica: {
      inicio: '2.5 - 3 minutos (dosis estándar)',
      duracion: '30 - 45 minutos (tiempo de recuperación espontánea al 25% del TOF)',
      metabolismo: 'Metabolismo hepático por desacetilación (forma 3-desacetilvecuronio con ~50% de potencia bloqueante); eliminación biliar (40-50%) y renal (30%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Intubación Orotraqueal Programada',
        dosis: '0.08 - 0.1 mg/kg IV (2 x DE95)',
        via: 'IV en bolo lento',
        notas: 'Condiciones de intubación óptimas a los 2.5 - 3 minutos.'
      },
      {
        indicacion: 'Mantenimiento Intraoperatorio',
        dosis: '0.015 - 0.02 mg/kg IV en bolos PRN guiados por TOF o infusión continua a 0.8 - 1.2 mcg/kg/min',
        via: 'IV bolo intermitente o infusión',
        notas: 'Monitorear TOF para evitar acumulación de metabolito 3-desacetil en cirugías largas.'
      },
      {
        indicacion: 'Reversión Específica con Sugammadex',
        dosis: '2 mg/kg IV (bloqueo moderado / T2 reaparecido) o 4 mg/kg IV (bloqueo profundo)',
        via: 'IV en bolo rápido',
        notas: 'Sugammadex encapsula selectivamente al vecuronio con afinidad nanomolar.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Extraordinaria estabilidad cardiovascular; NO produce liberación de histamina ni taquicardia vagolítica (ideal en pacientes cardiópatas o valvulares).',
      respiratorio: 'Parálisis motora respiratoria completa diafragmática y costal.',
      snc: 'Compuesto de amonio cuaternario hidrofílico; no atraviesa la barrera hematoencefálica.'
    },
    perlaClinica: 'Es el relajante muscular prototipo de pureza hemodinámica: no altera la FC, no libera histamina y no modifica la tensión arterial. Si se requiere reversión de emergencia o rutina, responde con alta afinidad a Sugammadex (al igual que el rocuronio).',
    precaucion: 'En insuficiencia renal o falla hepática, su metabolito activo 3-hidroxivecuronio puede acumularse, generando bloqueo neuromuscular residual severo. Siempre monitorear con neuroestimulador.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },
  {
    id: 'atracurio',
    nombre: 'Atracurio Besilato (Tracrium)',
    categoria: 'Bloqueantes Neuromusculares',
    clasificacion: 'Bloqueante neuromuscular no despolarizante bencilisoquinolínico de degradación no enzimática',
    mecanismo: 'Bloquea competitivamente los receptores nicotínicos colinérgicos de la unión neuromuscular esquelética, impidiendo la unión de acetilcolina y la despolarización motora.',
    farmacocinetica: {
      inicio: '2 - 3 minutos',
      duracion: '30 - 45 minutos (duración muy predecible e independiente de la función de órganos)',
      metabolismo: 'Degradación doble independiente de hígado y riñón: 1) Eliminación de Hofmann (descomposición química espontánea no biológica a pH y temperatura corporal); 2) Hidrólisis por éster-esterasas plasmáticas inespecíficas. Produce laudanosina.'
    },
    esquemasDosis: [
      {
        indicacion: 'Intubación Orotraqueal Estándar',
        dosis: '0.4 - 0.5 mg/kg IV administrado lentamente en 30-60 segundos',
        via: 'IV lenta',
        notas: 'Inyectar lentamente para evitar el pico brusco de liberación sistémica de histamina.'
      },
      {
        indicacion: 'Mantenimiento del Bloqueo Muscular',
        dosis: '0.1 - 0.2 mg/kg IV en bolos PRN cada 20-30 min o infusión a 5 - 10 mcg/kg/min',
        via: 'IV intermitente o infusión continua',
        notas: 'Ideal en pacientes con insuficiencia renal o hepática severa terminal.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Riesgo de vasodilatación periférica, hipotensión arterial transitoria y taquicardia refleja mediadas por liberación de histamina si se inyecta en bolo rápido.',
      respiratorio: 'Broncoespasmo potencial en pacientes con hiperreactividad bronquial o asma severa (por histamina).',
      snc: 'Su metabolito laudanosina atraviesa la barrera hematoencefálica y puede actuar como proconvulsivante a concentraciones plasmáticas muy altas tras días en UCI.'
    },
    perlaClinica: 'Revolucionó la anestesia por ser el primer relajante cuya eliminación no depende ni del hígado ni de los riñones (gracias a la eliminación química espontánea de Hofmann). Indicación clásica: paciente renal crónico en hemodiálisis o cirrótico descompensado.',
    precaucion: 'LIBERACIÓN DE HISTAMINA: Contraindicado administrar en bolo IV rápido sin diluir en pacientes asmáticos o con hipotensión basal. NO se puede revertir con Sugammadex (requiere Neostigmina + Atropina).',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. Miller\'s Anesthesia, 9th ed.'
  },
  {
    id: 'cisatracurio',
    nombre: 'Cisatracurio Besilato (Nimbex)',
    categoria: 'Bloqueantes Neuromusculares',
    clasificacion: 'Isómero 1R-cis 1\'R-cis bencilisoquinolínico puro no despolarizante de eliminación de Hofmann',
    mecanismo: 'Antagonista competitivo selectivo de receptores colinérgicos nicotínicos en la placa motora terminal. Constituye uno de los 10 isómeros del atracurio, pero con 3 a 4 veces mayor potencia bloqueante.',
    farmacocinetica: {
      inicio: '2.5 - 3 minutos (dosis estándar 0.15 mg/kg) o 1.5 - 2 min (0.2 mg/kg)',
      duracion: '45 - 60 minutos',
      metabolismo: 'Degradación organoindependiente exclusiva por Eliminación de Hofmann (degradación química a pH y temperatura fisiológica, 80%) e hidrólisis biológica. No genera acumulación de laudanosina en cantidades tóxicas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Intubación Orotraqueal Estándar',
        dosis: '0.15 - 0.2 mg/kg IV (3 x DE95)',
        via: 'IV en bolo directo',
        notas: 'Condiciones de intubación excelentes a los 2 minutos sin fluctuación hemodinámica.'
      },
      {
        indicacion: 'Mantenimiento Intraoperatorio / Paciente Crítico en UCI (SDRA)',
        dosis: '0.03 mg/kg IV PRN o infusión continua a 1 - 3 mcg/kg/min (titulado por TOF)',
        via: 'Infusión continua IV',
        notas: 'Fármaco de elección estándar para relajación muscular en SDRA severo y pacientes anúricos.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Absoluta estabilidad hemodinámica; A DIFERENCIA del atracurio, NO libera histamina incluso a dosis 8 veces superiores a la DE95. No altera FC ni PA.',
      respiratorio: 'Parálisis motora respiratoria diafragmática y torácica sin reactividad bronquial ni broncoespasmo.',
      snc: 'No cruza la barrera hematoencefálica. Genera 80% menos laudanosina que el atracurio.'
    },
    perlaClinica: 'Combina lo mejor de dos mundos: la eliminación química independiente de órganos (Hofmann) del atracurio, pero SIN ninguna liberación de histamina ni hipotensión. Es el relajante de elección absoluta en falla renal anúrica, falla hepática aguda y SDRA refractario.',
    precaucion: 'NO responde a Sugammadex (solo revierte con Neostigmina + Atropina). En pacientes con hipotermia severa (<34°C) o acidosis metabólica, la eliminación de Hofmann se ralentiza notablemente prolongando el bloqueo.',
    bibliografia: 'Miller RD, et al. Miller\'s Anesthesia, 9th ed. Elsevier, 2020. ARDSNet Study Group: Neuromuscular Blockers in Early ARDS.'
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
  {
    id: 'ropivacaina',
    nombre: 'Ropivacaína Clorhidrato (Naropin)',
    categoria: 'Anestésicos Locales',
    clasificacion: 'S-enantiómero enantioméricamente puro derivado de aminoamida con disociación sensitivo-motora',
    mecanismo: 'Bloqueo reversible de los canales de Sodio dependientes de voltaje. Al ser el enantiómero puro S(-), presenta mucha menor afinidad y disociación más rápida de los canales de Na+ miocárdicos que la bupivacaína racémica.',
    farmacocinetica: {
      inicio: 'Intermedio a rápido (10 - 20 minutos según técnica perineural/epidural)',
      duracion: '3 - 8 horas (dependiendo de concentración 0.2%, 0.5% o 0.75%)',
      metabolismo: 'Metabolismo hepático oxidativo extenso mediado por CYP1A2 a 3-hidroxi-ropivacaína y CYP3A4.'
    },
    esquemasDosis: [
      {
        indicacion: 'Dosis Máxima Recomendada Infiltrativa / Bloqueo Troncular',
        dosis: '3 mg/kg (Máximo 225 - 300 mg en bolo único) | Hasta 3.5 - 4 mg/kg si se usa con epinefrina',
        via: 'Infiltración perineural / fascial / troncular',
        notas: 'Excelente perfil de seguridad con bloqueo motor significativamente menor que bupivacaína.'
      },
      {
        indicacion: 'Analgesia Epidural de Parto / Infusión Perineural Continua',
        dosis: 'Solución al 0.1% a 0.2% en infusión a 6 - 12 mL/h (con o sin fentanilo 2 mcg/mL)',
        via: 'Catéter epidural o perineural continuo',
        notas: 'Conserva la deambulación y fuerza motriz de la paciente ("walking epidural").'
      },
      {
        indicacion: 'Bloqueos Fasciales Ecoguiados (TAP, ESP, Fascia Ilíaca)',
        dosis: 'Solución al 0.2% - 0.375% (volúmenes de 20 a 40 mL)',
        via: 'Ecoguiada interfascial',
        notas: 'Efecto vasoconstrictor intrínseco leve que reduce la tasa de absorción sistémica inicial.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Umbral cardiotóxico significativamente superior a la bupivacaína; menor arritmogenicidad ventricular.',
      snc: 'Menor penetración cerebral que la bupivacaína racémica, aunque a dosis tóxicas produce síntomas de LAST.',
      otros: 'Marcada disociación sensitivo-motora (bloqueo sensitivo profundo preservando mayor fuerza motora a concentraciones ≤0.2%).'
    },
    perlaClinica: 'Es el anestésico local de oro para analgesia postoperatoria y de parto por dos ventajas clave: 1) Su umbral de cardiotoxicidad es significativamente mayor que el de bupivacaína; 2) Produce analgesia sensorial densa con mínima pérdida motora (permite al paciente deambular precozmente en protocolos ERAS).',
    precaucion: 'Aunque es más segura que la bupivacaína, sobredosis masivas por inyección intravascular directa producen LAST grave tratable con Emulsión Lipídica 20%. Evitar en raquídea cuando se busque relajación muscular profunda abdominal.',
    bibliografia: 'ASRA Practice Advisory on Local Anesthetic Systemic Toxicity. Reg Anesth Pain Med. 2020. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },
  {
    id: 'levobupivacaina',
    nombre: 'Levobupivacaína (Chirocaine)',
    categoria: 'Anestésicos Locales',
    clasificacion: 'S(-)-enantiómero levógiro puro de bupivacaína con reducido perfil de cardiotoxicidad',
    mecanismo: 'Bloqueo de canales de Sodio dependientes de voltaje en la membrana axonal. Al aislar exclusivamente el isómero S(-), se elimina el enantiómero R(+) responsable primario del colapso cardíaco y arritmias malignas de la bupivacaína convencional.',
    farmacocinetica: {
      inicio: '15 - 25 minutos',
      duracion: '4 - 9 horas (la duración anestésica más prolongada de las aminoamidas)',
      metabolismo: 'Hepático extenso por citocromos CYP3A4 y CYP1A2. Fijación proteica plasmática extremadamente alta (>97%).'
    },
    esquemasDosis: [
      {
        indicacion: 'Dosis Máxima Segura en Infiltración / Bloqueo Periférico',
        dosis: '2.5 mg/kg (Máximo 150 mg en bolo directo) | Hasta 400 mg en 24 horas para infusión continua',
        via: 'Perineural o peridural',
        notas: 'Permite anestesia quirúrgica prolongada con margen de seguridad miocárdica duplicado.'
      },
      {
        indicacion: 'Anestesia Subaracnoidea / Raquídea',
        dosis: '10 - 15 mg (solución al 0.5% isobárica o hiperbárica)',
        via: 'Intratecal L3-L4',
        notas: 'Potencia y duración equiparables a la bupivacaína racémica.'
      },
      {
        indicacion: 'Anestesia / Analgesia Epidural Mayor',
        dosis: 'Solución 0.5% (15 - 25 mL) para cirugía | 0.125% - 0.25% (6 - 10 mL/h) para analgesia',
        via: 'Epidural',
        notas: 'Mayor margen terapéutico en cesáreas y cirugía vascular reconstructiva.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Significativamente menos depresora del miocardio y menos inductora de fibrilación ventricular que la bupivacaína racémica.',
      snc: 'Menor toxicidad cerebral a igual concentración sérica en comparación con R(+)-bupivacaína.',
      otros: 'Alta potencia analgésica idéntica a bupivacaína racémica (relación de potencia 1:1).'
    },
    perlaClinica: 'La levobupivacaína ofrece exactamente la misma potencia analgésica y duración ultraprolongada que la bupivacaína tradicional (a diferencia de la ropivacaína que es ~30-40% menos potente en raquídea), pero con una toxicidad cardiovascular y del SNC un 50% menor demostrada en modelos electrofisiológicos humanos.',
    precaucion: 'No confundir seguridad relativa con inocuidad: dosis supramáximas o inyección intravascular rápida siguen desencadenando LAST con necesidad imperativa de Intralipid 20%.',
    bibliografia: 'ASRA Practice Advisory on Local Anesthetic Systemic Toxicity. Reg Anesth Pain Med. 2020. Miller\'s Anesthesia, 9th ed.'
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
  {
    id: 'dobutamina',
    nombre: 'Dobutamina Clorhidrato (Dobutrex)',
    categoria: 'Inotrópicos y Vasopresores',
    clasificacion: 'Amina simpaticomimética sintética agonista selectivo inotrópico beta-1 (inodilatador)',
    mecanismo: 'Estimulación predominante de receptores beta-1 adrenérgicos miocárdicos (aumenta contractilidad y volumen sistólico) con leve actividad agonista beta-2 (vasodilatación vascular periférica) y alfa-1 mínima. Actúa como inodilatador puro: eleva el gasto cardíaco reduciendo la postcarga ventricular.',
    farmacocinetica: {
      inicio: '1 - 2 minutos tras inicio de infusión',
      pico: '5 - 10 minutos',
      duracion: '10 minutos tras suspender (t1/2 ~2-3 minutos)',
      metabolismo: 'Metabolismo hepático y tisular rápido por metilación (COMT) y conjugación glucurónida a 3-O-metildobutamina inactiva.'
    },
    esquemasDosis: [
      {
        indicacion: 'Bajo Gasto Cardíaco / Shock Cardiogénico / Falla Ventricular Aguda',
        dosis: '2.5 - 10 mcg/kg/min IV infusión continua (dosis inotrópica óptima)',
        via: 'Infusión IV continua por vía central (o periférica proximal mientras se canaliza CVC)',
        notas: 'Dosis >15-20 mcg/kg/min aumentan marcadamente la taquicardia y el consumo de oxígeno miocárdico.'
      },
      {
        indicacion: 'Hipertensión Pulmonar Perioperatoria / Falla Ventricular Derecha Aguda',
        dosis: '2 - 5 mcg/kg/min IV infusión continua',
        via: 'Infusión continua IV',
        notas: 'Mejora el acoplamiento ventrículo-arterial pulmonar y el llenado ventricular izquierdo.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento significativo del gasto cardíaco y volumen sistólico; reducción de presiones de llenado ventricular (PCP) y resistencia vascular sistémica (RVS); taquicardia moderada y arritmias ventriculares a dosis elevadas.',
      respiratorio: 'Mejora el transporte global de oxígeno (DO2); puede alterar transitoriamente la relación V/Q por vasodilatación pulmonar.',
      otros: 'Aumenta el flujo sanguíneo renal y la diuresis por incremento directo del gasto cardíaco.'
    },
    perlaClinica: 'Es el inodilatador de primera línea cuando el corazón falla como bomba. Ojo crítico: si el paciente está hipotenso por vasodilatación o hipovolemia, la dobutamina sola EMPEORA la hipotensión por su efecto beta-2 vasodilatador. En esos casos, asociar siempre a Noradrenalina para mantener la PAM.',
    precaucion: 'Taquiarritmias auriculares y ventriculares; aumento del consumo miocárdico de oxígeno en cardiopatía isquémica severa. Contraindicada en estenosis subaórtica hipertrófica u obstrucción dinámica del tracto de salida.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. European Society of Cardiology (ESC) Heart Failure Guidelines.'
  },
  {
    id: 'dopamina',
    nombre: 'Dopamina Clorhidrato (Intropin)',
    categoria: 'Inotrópicos y Vasopresores',
    clasificacion: 'Catecolamina endógena precursora de noradrenalina con efectos adrenérgicos dosis-dependientes',
    mecanismo: 'Acción progresiva dependiente de la tasa de infusión: 1) Dosis baja (0.5-3 mcg/kg/min): receptores dopaminérgicos DA1 renales/mesentéricos; 2) Dosis intermedia (3-10 mcg/kg/min): receptores beta-1 adrenérgicos (inotropismo positivo y cronotropismo); 3) Dosis alta (>10 mcg/kg/min): receptores alfa-1 adrenérgicos predominantes (vasoconstricción sistémica).',
    farmacocinetica: {
      inicio: '2 - 5 minutos',
      duracion: '5 - 10 minutos (t1/2 de eliminación plasmática ~2 min)',
      metabolismo: 'Metabolismo hepático, renal y plasmático rápido por monoaminooxidasa (MAO) y catecol-O-metiltransferasa (COMT). Un 25% se convierte directamente a noradrenalina en las terminaciones nerviosas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Soporte Inotrópico / Bradicardia Sintomática Refractaria a Atropina (ACLS)',
        dosis: '5 - 10 mcg/kg/min IV infusión continua',
        via: 'Infusión continua IV',
        notas: 'Fármaco de segunda línea en la guía ACLS para bradicardias inestables tras fallo de atropina.'
      },
      {
        indicacion: 'Shock Cardiogénico con Hipotensión / Vasopresor en Emergencia',
        dosis: '10 - 20 mcg/kg/min IV infusión continua',
        via: 'Infusión continua por vía central',
        notas: 'Riesgo alto de taquiarritmias; actualmente la noradrenalina es de primera línea por menor mortalidad.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento del inotropismo, gasto cardíaco y cronotropismo; a dosis altas incremento de la RVS; muy arritmogénica (fibrilación auricular, taquicardia sinusal, extrasístoles ventriculares).',
      otros: 'Supresión de la secreción de prolactina y hormona del crecimiento; efecto diurético natriurético transitorio que NO previene el fallo renal.'
    },
    perlaClinica: 'El mito de la "dosis renal de dopamina" (1-3 mcg/kg/min) fue totalmente desmentido por múltiples ensayos clínicos aleatorizados (ensayo SOAP II): NO protege el riñón, NO reduce la necesidad de diálisis y aumenta significativamente la mortalidad por arritmias frente a noradrenalina.',
    precaucion: 'Alta tasa de arritmias ventriculares y taquicardia sinusal intensa que descompensa coronariópatas. Extravasación produce necrosis dérmica (antídoto: fentolamina 5-10 mg subcutánea local).',
    bibliografia: 'De Backer D, et al. Comparison of Dopamine and Norepinephrine in the Treatment of Shock (SOAP II Trial). N Engl J Med. AHA ACLS Guidelines.'
  },
  {
    id: 'vasopresina',
    nombre: 'Vasopresina / Hormona Antidiurética (Pitressin / Arginina Vasopresina)',
    categoria: 'Inotrópicos y Vasopresores',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Hormona nonapéptida neurohipofisaria y vasopresor no adrenérgico puro',
    mecanismo: 'Estimula receptores V1a acoplados a proteína Gq en el músculo liso vascular, activando la fosfolipasa C y aumentando el calcio intracelular (vasoconstricción arteriolar sistémica potente). A diferencia de las catecolaminas, mantiene su eficacia vasoconstrictora aún en estados de acidosis metabólica severa y refractariedad a noradrenalina.',
    farmacocinetica: {
      inicio: '1 - 2 minutos',
      duracion: '10 - 20 minutos (vida media plasmática 10 - 15 min)',
      metabolismo: 'Degradación rápida por vasopresinasas hepáticas y renales; eliminación renal mínima.'
    },
    esquemasDosis: [
      {
        indicacion: 'Shock Vasopléjico Refractario en Quirófano / Cirugía Cardíaca / Post-Bomba',
        dosis: '0.01 - 0.04 UI/minuto (0.6 - 2.4 UI/hora) IV infusión fija sin titulación excesiva',
        via: 'Infusión continua IV por vía central',
        notas: 'Restaura el tono vascular perdido por agotamiento de vasopresina endógena; ahorro dramático de catecolaminas.'
      },
      {
        indicacion: 'Hipotensión Súbita Refractaria por IECAs/ARA-II en Anestesia General (Rescate)',
        dosis: 'Bolo de rescate IV de 1 a 2 UI tituladas lentamente',
        via: 'IV bolo',
        notas: 'Droga de elección cuando la hipotensión post-inducción no responde a bolos repetidos de efedrina ni fenilefrina.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Aumento potente de la RVS y PAM SIN taquicardia ni aumento del consumo miocárdico de oxígeno; puede causar vasoconstricción coronaria y bradicardia refleja.',
      respiratorio: 'Produce vasoconstricción sistémica selectiva sin aumentar la resistencia vascular pulmonar (excelente en hipertensión pulmonar con falla de VD).',
      otros: 'Vasoconstricción esplácnica y cutánea; disminuye el aclaramiento de agua libre renal (receptores V2).'
    },
    perlaClinica: 'El as bajo la manga en quirófano para la vasoplejía refractaria por bloqueadores del sistema renina-angiotensina (Enalapril, Losartán) o en el destete de bomba de circulación extracorpórea: mientras la noradrenalina fracasa por desensibilización de receptores alfa en acidosis, la vasopresina actúa por una vía molecular completamente independiente (receptores V1a).',
    precaucion: 'Isquemia coronaria, mesentérica o necrosis digital periférica a dosis >0.04 UI/min. No titular bruscamente como la noradrenalina; utilizar a dosis fijas de reemplazo.',
    bibliografia: 'VASST Study: Vasopressin versus Norepinephrine in Septic Shock. N Engl J Med. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
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
  {
    id: 'metilprednisolona',
    nombre: 'Metilprednisolona Succinato Sódico (Solu-Medrol)',
    categoria: 'Esteroides',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Glucocorticoide sintético de acción intermedia y alta penetración tisular',
    mecanismo: 'Agonista de receptores citoplasmáticos de glucocorticoides; suprime la transcripción de citoquinas proinflamatorias (IL-1, IL-2, IL-6, TNF-alfa), inhibe la migración de leucocitos polimorfonucleares y estabiliza las membranas lisosomales.',
    farmacocinetica: {
      inicio: '1 - 2 horas IV',
      pico: '2 - 3 horas',
      duracion: '18 - 36 horas',
      metabolismo: 'Metabolismo hepático oxidativo a metabolitos inactivos; excreción urinaria.'
    },
    esquemasDosis: [
      {
        indicacion: 'Crisis Asmática Severa Intraoperatoria / Broncoespasmo Refractario',
        dosis: '1 - 2 mg/kg IV en bolo (dosis habitual en adultos 60 - 125 mg IV)',
        via: 'IV en infusión lenta (15-30 minutos)',
        notas: 'Disminuye la hiperreactividad bronquial y la inflamación de la mucosa respiratoria.'
      },
      {
        indicacion: 'Prevención de Edema de Vía Aérea / Cirugía de Vía Aérea o Maxilofacial Mayor',
        dosis: '1 - 2 mg/kg IV cada 6-8 horas por 24-48 horas',
        via: 'IV',
        notas: 'Facilita la prueba de fuga de manguito (cuff leak test) previa a extubación compleja.'
      },
      {
        indicacion: 'Shock Anafiláctico Severo (Terapia Secundaria Antiinflamatoria)',
        dosis: '125 - 250 mg IV lenta tras estabilización inicial con Adrenalina',
        via: 'IV lenta',
        notas: 'Previene la reacción anafiláctica bifásica tardía (4 a 8 horas post-evento).'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Riesgo de arritmias ventriculares o bradicardia paradójica si se administra en bolo IV "push" rápido sin diluir.',
      otros: 'Hiperglucemia marcada, retención hidrosalina moderada (actividad mineralocorticoide mínima), retraso en cicatrización tisular con tratamientos prolongados.'
    },
    perlaClinica: 'NUNCA administrar dosis altas de Solu-Medrol en bolo intravenoso ultrarrápido (<10 minutos): se han reportado casos de colapso cardiovascular agudo, bradicardia severa y paro cardíaco. Diluir siempre en 50-100 mL de SSN e infundir en 20-30 minutos.',
    precaucion: 'Hiperglucemia postoperatoria importante. Infecciones micóticas sistémicas no tratadas. Colapso circulatorio con inyecciones rápidas.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. UpToDate: Treatment of acute asthma exacerbations.'
  },
  {
    id: 'hidrocortisona',
    nombre: 'Hidrocortisona Succinato Sódico (Solu-Cortef)',
    categoria: 'Esteroides',
    categoriaSecundaria: 'Emergencias Anestesiológicas',
    clasificacion: 'Corticoide natural de acción corta con actividad glucocorticoide y mineralocorticoide equilibrada (1:1)',
    mecanismo: 'Reemplazo hormonal fisiológico idéntico al cortisol endógeno. Restaura la sensibilidad de los receptores vasculares alfa-1 y beta-1 adrenérgicos a las catecolaminas circulantes en shock y estrés, manteniendo el tono arteriolar y el balance de sodio-potasio.',
    farmacocinetica: {
      inicio: '1 - 2 horas (efectos transcripcionales)',
      pico: '2 horas',
      duracion: '8 - 12 horas',
      metabolismo: 'Metabolismo hepático rápido; vida media plasmática ~90 minutos; vida media biológica 8-12 horas.'
    },
    esquemasDosis: [
      {
        indicacion: 'Insuficiencia Suprarrenal Aguda / Crisis Addisoniana Intraoperatoria',
        dosis: '100 mg IV en bolo de inmediato, seguido de 50 - 100 mg IV cada 6 - 8 horas o infusión continua a 200 mg/24h',
        via: 'IV en bolo lento y mantenimiento',
        notas: 'Fármaco de rescate vital ante hipotensión refractaria en paciente con uso crónico de corticoides.'
      },
      {
        indicacion: 'Dosis de Estrés Perioperatorio (Supresión Hipotálamo-Hipófisis-Suprarrenal)',
        dosis: 'Cirugía menor: 25-50 mg IV inducción | Cirugía mayor: 100 mg IV preinducción + 50 mg c/8h por 24h',
        via: 'IV',
        notas: 'Indicado en pacientes tratados con >5 mg/día de prednisona por más de 3 semanas durante el último año.'
      },
      {
        indicacion: 'Shock Séptico Refractario a Vasopresores (Guías SSC 2021)',
        dosis: '200 mg/día IV en infusión continua (o 50 mg IV cada 6 horas)',
        via: 'IV',
        notas: 'Iniciar únicamente si Noradrenalina + Vasopresina superan dosis requerida de >0.25 mcg/kg/min.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Restaura la resistencia vascular sistémica y la respuesta vasopresora normal.',
      otros: 'Retención marcada de Sodio y agua, pérdida de Potasio urinario (efecto mineralocorticoide notable); hiperglucemia.'
    },
    perlaClinica: 'Si un paciente bajo anestesia general presenta hipotensión inexplicable refractaria a volumen, efedrina y dosis crecientes de noradrenalina, pregunte de inmediato por antecedentes de consumo de esteroides orales (prednisona, betametasona) o cremas dermatológicas crónicas. Administrar 100 mg IV de hidrocortisona puede salvar la vida en minutos.',
    precaucion: 'Retención de líquidos e hipernatremia/hipopotasemia por efecto mineralocorticoide intrínseco. Hiperglucemia.',
    bibliografia: 'Surviving Sepsis Campaign Guidelines 2021. Endocrine Society Clinical Practice Guideline: Management of Adrenal Insufficiency.'
  },
  {
    id: 'betametasona',
    nombre: 'Betametasona Fosfato / Acetato (Celestone)',
    categoria: 'Esteroides',
    clasificacion: 'Glucocorticoide fluorado de muy alta potencia sin actividad mineralocorticoide',
    mecanismo: 'Glucocorticoide sintético de gran potencia (25-30 veces superior al cortisol) que cruza activamente la placenta induciendo la transcripción de proteínas de surfactante pulmonar (SP-A, SP-B) en neumocitos tipo II fetales.',
    farmacocinetica: {
      inicio: 'Rápido IM/IV',
      duracion: '36 - 72 horas (vida media biológica prolongada)',
      metabolismo: 'Metabolismo hepático microsomal.'
    },
    esquemasDosis: [
      {
        indicacion: 'Maduración Pulmonar Fetal en Amenaza de Parto Pretérmino (24 a 34 semanas)',
        dosis: '12 mg IM cada 24 horas por 2 dosis consecutivas (Esquema NIH estándar)',
        via: 'Intramuscular profunda',
        notas: 'Reduce drásticamente el síndrome de dificultad respiratoria (SDR), hemorragia intraventricular y muerte neonatal.'
      },
      {
        indicacion: 'Antiinflamatorio Perioperatorio / Infiltraciones Analgésicas Articulares',
        dosis: '4 - 8 mg IV/IM o intrarticular',
        via: 'IV lenta o infiltración',
        notas: 'Potente acción antiinflamatoria sin retención de sodio ni edemas.'
      }
    ],
    efectosOrganicos: {
      otros: 'Cero efecto mineralocorticoide (no retiene agua ni sodio); elevación moderada de glucosa sanguínea materna y disminución transitoria de la variabilidad de la frecuencia cardíaca fetal (fisiológica por 48h).'
    },
    perlaClinica: 'En cesárea de emergencia o parto prematuro entre semanas 24 y 34, completar las 2 dosis de betametasona es la intervención farmacológica aislada con mayor impacto en sobrevida neonatal. Cero retención hidrosalina en la madre.',
    precaucion: 'Descompensación hiperglucémica en gestantes diabéticas o prediabéticas (requiere monitoreo y titulación de insulina).',
    bibliografia: 'ACOG Practice Bulletin No. 209: Obstetric Care Consensus on Antenatal Corticosteroid Therapy.'
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
  },
  {
    id: 'ketoprofeno',
    nombre: 'Ketoprofeno IV',
    categoria: 'Antiinflamatorios No Esteroideos (AINEs)',
    clasificacion: 'AINE derivado del ácido arilpropiónico de potente acción periférica y central',
    mecanismo: 'Inhibidor dual potente: bloquea las vías de la ciclooxigenasa (COX-1 y COX-2 inhibiendo la síntesis de prostaglandinas) y adicionalmente inhibe la lipooxigenasa (LOX), disminuyendo la síntesis de leucotrienos quimiotácticos inflamatorios. Estabiliza además las membranas lisosomales.',
    farmacocinetica: {
      inicio: '15 - 30 minutos tras infusión IV',
      pico: '45 - 60 minutos',
      duracion: '6 - 8 horas',
      metabolismo: 'Conjugación hepática casi completa con ácido glucurónico; eliminación urinaria del 80% como glucurónido.'
    },
    esquemasDosis: [
      {
        indicacion: 'Dolor Postoperatorio Agudo Moderado a Severo (Cirugía Traumatológica / Abdominal)',
        dosis: '100 mg IV cada 8 - 12 horas diluidos en 100 mL SSN a pasar en 30 minutos (Máximo 200 - 300 mg/día)',
        via: 'Infusión intravenosa intermitente (nunca en bolo rápido directo)',
        notas: 'Excelente potencia analgésica en cirugía ortopédica y traumatológica.'
      },
      {
        indicacion: 'Cólico Nefrítico / Ureteral Agudo en Urgencias',
        dosis: '100 mg IV en infusión de 20 minutos',
        via: 'IV en infusión corta',
        notas: 'Disminuye la presión intrapélvica renal por reducción del flujo sanguíneo glomerular mediado por prostaglandinas.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Retención de agua y sodio; aumento leve de presión arterial.',
      otros: 'Gastrolesividad, inhibición transitoria de la agregación plaquetaria, reducción del flujo plasmático renal en pacientes deshidratados o hipovolémicos.'
    },
    perlaClinica: 'Por su inhibición simultánea de la ciclooxigenasa (COX) y de la lipooxigenasa (LOX), el ketoprofeno ofrece una cobertura analgésica superior en cirugía de trauma óseo y osteoarticular frente a otros AINEs comunes. Debe administrarse siempre diluido en al menos 100 mL de solución salina o dextrosa.',
    precaucion: 'Hipersensibilidad cruzada con ácido acetilsalicílico (asma por aspirina). Sangrado digestivo activo, insuficiencia renal moderada a severa, hipovolemia no corregida.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. Cochrane Database of Systematic Reviews: Intravenous ketoprofen for acute postoperative pain.'
  },
  {
    id: 'paracetamol-iv',
    nombre: 'Paracetamol / Acetaminofén IV (Perfalgan)',
    categoria: 'Antiinflamatorios No Esteroideos (AINEs)',
    clasificacion: 'Analgésico antipirético no opiáceo de acción central no lesivo gástrico ni plaquetario',
    mecanismo: 'Acción analgésica predominantemente central: inhibe la síntesis de prostaglandinas en el sistema nervioso central (posible variante enzimática COX-3 / peroxidasa) y modula las vías serotoninérgicas bulbospinales descendentes inhibitorias del dolor. A través de su metabolito AM404, estimula además los receptores cannabinoides CB1 centrales.',
    farmacocinetica: {
      inicio: '5 - 10 minutos tras inicio de infusión',
      pico: '15 - 30 minutos (pico en líquido cefalorraquídeo)',
      duracion: '4 - 6 horas',
      metabolismo: 'Metabolismo hepático extenso: 90% por glucuronidación y sulfatación inocua; un 5-10% por CYP2E1 a NAPQI (N-acetil-p-benzoquinoneimina, metabolito hepatotóxico inactivado por glutatión).'
    },
    esquemasDosis: [
      {
        indicacion: 'Pilar Base de Analgesia Multimodal Perioperatoria (Protocolos ERAS)',
        dosis: '1000 mg (1 g) IV cada 6 horas en adultos ≥50 kg (Máximo 4 g/día). En <50 kg o ancianos frágiles: 15 mg/kg IV cada 6 horas (Máx 60 mg/kg/día o 3 g/día)',
        via: 'Infusión IV en 15 minutos directos del frasco',
        notas: 'Ahorro comprobado de opioides de hasta un 30-40% en las primeras 24 horas postoperatorias.'
      },
      {
        indicacion: 'Hipertermia / Fiebre Intraoperatoria Maligna o Séptica (Antipirético de Elección)',
        dosis: '1 g IV infusión en 15 min',
        via: 'IV',
        notas: 'Restaura el punto de ajuste termorregulador hipotalámico central.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'Hipotensión transitoria leve descrita en pacientes críticos en UCI durante la infusión rápida (infundir en 15 min completos).',
      otros: 'A DIFERENCIA de los AINEs clásicos: NO afecta la agregación plaquetaria, NO causa gastrolesividad ni úlceras, NO altera el flujo sanguíneo renal ni la función renal.'
    },
    perlaClinica: 'La piedra angular de todo protocolo analgésico ahorrador de opioides. Al no lesionar la mucosa gástrica, no inhibir las plaquetas ni dañar los riñones, es el único analgésico no opiáceo seguro en pacientes cardiópatas, anticoagulados, cirugías con alto sangrado o nefrópatas leves. En sobredosis, el antídoto es N-Acetilcisteína.',
    precaucion: 'Hepatotoxicidad: Reducir dosis máxima a 2 g/día en insuficiencia hepatocelular crónica, alcoholismo crónico o desnutrición severa. No mezclar con otros medicamentos orales que contengan acetaminofén.',
    bibliografia: 'American Society of Anesthesiologists (ASA) Practice Guidelines for Acute Pain Management. Stoelting RK. Pharmacology and Physiology in Anesthetic Practice.'
  },
  {
    id: 'metamizol-dipirona',
    nombre: 'Metamizol Sódico / Dipirona IV (Nolotil)',
    categoria: 'Antiinflamatorios No Esteroideos (AINEs)',
    clasificacion: 'Derivado pirazolónico no narcótico con potente efecto analgésico, antipirético y espasmolítico visceral',
    mecanismo: 'Efecto analgésico multimodal periférico y central: inhibe las isoenzimas COX-1, COX-2 y COX central, activa las vías descendentes noradrenérgicas y serotoninérgicas inhibitorias espinales, estimula el sistema opioide y cannabinoide endógeno, y produce relajación directa del músculo liso visceral (efecto espasmolítico mediado por inhibición del flujo de calcio intracelular).',
    farmacocinetica: {
      inicio: '15 - 30 minutos',
      pico: '1 - 1.5 horas',
      duracion: '6 - 8 horas',
      metabolismo: 'Profármaco que se hidroliza espontáneamente en plasma a 4-metilaminoantipirina (4-MAA), su metabolito activo primario; metabolismo hepático microsomal posterior.'
    },
    esquemasDosis: [
      {
        indicacion: 'Dolor Postoperatorio Agudo / Dolor Cólico Abdominal y Gineco-Obstétrico',
        dosis: '1 - 2 g IV cada 6 - 8 horas diluidos en 100 mL de SSN o Dextrosa a pasar en 20 - 30 minutos (Máximo 6 g/día)',
        via: 'Infusión intravenosa lenta obligatoria',
        notas: 'NUNCA administrar en bolo intravenoso directo o rápido por riesgo inminente de hipotensión severa.'
      },
      {
        indicacion: 'Espasmo Biliar, Cólico Renal o Ureteral',
        dosis: '2 g IV en infusión de 20 minutos',
        via: 'IV en infusión',
        notas: 'Alivia rápidamente el cólico por su acción espasmolítica directa sobre el músculo liso visceral.'
      }
    ],
    efectosOrganicos: {
      cardiovascular: 'HIPOTENSIÓN ARTERIAL SEVERA y vasodilatación periférica brusca si se inyecta en bolo IV rápido (independiente de alergia, efecto hemodinámico directo por relajación del músculo liso vascular).',
      respiratorio: 'Broncodilatación leve; rara vez broncoespasmo en intolerantes a pirazolonas.',
      otros: 'Riesgo rarísimo pero potencialmente mortal de agranulocitosis idiopática mediada por mecanismos inmunoalérgicos; mínima o nula gastrolesividad comparada con ketorolaco.'
    },
    perlaClinica: 'El analgésico postoperatorio preferido en cirugía abdominal, laparoscópica y ginecológica por su excelente efecto antiespasmódico visceral y ausencia de toxicidad renal o gástrica comparado con los AINEs clásicos. Regla de oro absoluta de seguridad: INFUNDIR SIEMPRE DILUIDO en al menos 100 mL durante 20 minutos para evitar hipotensión ortostática o colapso vascular transitorio.',
    precaucion: 'Hipotensión severa por bolo rápido. Antecedente de agranulocitosis por pirazolonas o porfiria hepática. Alergia a pirazolonas.',
    bibliografia: 'Stoelting RK. Pharmacology and Physiology in Anesthetic Practice, 5th ed. European Journal of Anaesthesiology Guidelines on Postoperative Pain Management.'
  }
];

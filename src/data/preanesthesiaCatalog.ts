// Catálogo clínico de antecedentes, modelo de riesgo de Caprini (TEV) y formateador completo para WhatsApp

export interface AntecedentCategoryOption {
  label: string;
  category?: string;
}

export const ANTECEDENTS_DROPDOWN_OPTIONS = {
  patologicosPersonales: [
    { category: 'General / Negativo', label: 'Niega patologías crónicas conocidas (Aparentemente sano)' },
    { category: 'Cardiovascular', label: 'Hipertensión Arterial (HTA) controlada' },
    { category: 'Cardiovascular', label: 'Hipertensión Arterial (HTA) no controlada / cifras elevadas' },
    { category: 'Cardiovascular', label: 'Cardiopatía Isquémica / Antecedente de Infarto (IAM)' },
    { category: 'Cardiovascular', label: 'Insuficiencia Cardíaca Congestiva (ICC)' },
    { category: 'Cardiovascular', label: 'Arritmia cardíaca (Fibrilación auricular / Extrasístoles)' },
    { category: 'Metabólico / Endocrino', label: 'Diabetes Mellitus Tipo 2 (DM2) en control con ADO' },
    { category: 'Metabólico / Endocrino', label: 'Diabetes Mellitus Tipo 1 / Insulinorrequiriente' },
    { category: 'Metabólico / Endocrino', label: 'HTA + Diabetes Mellitus Tipo 2' },
    { category: 'Metabólico / Endocrino', label: 'Hipotiroidismo en tratamiento con Levotiroxina' },
    { category: 'Metabólico / Endocrino', label: 'Obesidad Mórbida (IMC ≥ 40 kg/m²)' },
    { category: 'Respiratorio', label: 'Asma Bronquial controlada (sin crisis reciente)' },
    { category: 'Respiratorio', label: 'Asma Bronquial activa / Con sibilancias frecuentes' },
    { category: 'Respiratorio', label: 'EPOC / Enfisema / Bronquitis crónica' },
    { category: 'Gastrointestinal', label: 'Reflujo Gastroesofágico (ERGE) / Hernia hiatal' },
    { category: 'Renal / Urológico', label: 'Enfermedad Renal Crónica (ERC) estadío II-III' },
    { category: 'Neurológico', label: 'Epilepsia / Síndrome convulsivo en tratamiento' },
    { category: 'Neurológico', label: 'Antecedente de Evento Cerebrovascular (ACV)' },
    { category: 'Hematológico', label: 'Antecedente de Trombosis Venosa Profunda (TVP) / TEP' },
    { category: 'Oncológico', label: 'Antecedente de Neoplasia / Cáncer en remisión o tto' }
  ],

  patologicosFamiliares: [
    { category: 'General / Negativo', label: 'Niega antecedentes patológicos familiares de relevancia' },
    { category: 'Cardiovascular', label: 'Hipertensión Arterial en familiares de 1er grado' },
    { category: 'Metabólico', label: 'Diabetes Mellitus en familiares directos' },
    { category: 'Cardiovascular', label: 'Cardiopatía isquémica / Infarto prematuro familiar (< 55 años)' },
    { category: 'Anestesiología (Alerta)', label: 'Hipertermia Maligna en familiares directos (ALERTA CRÍTICA)' },
    { category: 'Anestesiología (Alerta)', label: 'Complicaciones anestésicas o despertar prolongado en familiares' },
    { category: 'Cardiovascular', label: 'Muerte súbita de causa indeterminada en familiar de 1er grado' },
    { category: 'Hematológico', label: 'Tromboembolismo o trombofilia hereditaria familiar' },
    { category: 'Oncológico', label: 'Cáncer / Neoplasias en familiares directos' }
  ],

  alergias: [
    { category: 'General / Negativo', label: 'Negativas (Niega alergias a medicamentos, alimentos o látex)' },
    { category: 'Antibióticos', label: 'Alergia a Penicilinas / Derivados Betalactámicos' },
    { category: 'Antibióticos', label: 'Alergia a Cefalosporinas' },
    { category: 'Antibióticos', label: 'Alergia a Sulfas / Trimetoprim-Sulfametoxazol' },
    { category: 'Analgésicos / AINEs', label: 'Alergia a AINEs (Dipirona, Ibuprofeno, Ketorolaco, Diclofenac)' },
    { category: 'Analgésicos / AINEs', label: 'Alergia específica a Dipirona / Metamizol' },
    { category: 'Quirófano / Dispositivos', label: 'Alergia al Látex (¡Protocolo Quirófano Libre de Látex!)' },
    { category: 'Contraste / Yodo', label: 'Alergia al Yodo / Medios de contraste radiológico' },
    { category: 'Anestésicos', label: 'Alergia a Anestésicos Locales tipo Éster' },
    { category: 'Múltiples', label: 'Alergias múltiples medicamentosas referidas' }
  ],

  habitos: [
    { category: 'General / Negativo', label: 'Niega hábitos psicotóxicos (No fuma, no ingiere alcohol)' },
    { category: 'Tabaquismo', label: 'Tabaquismo activo (> 10 cigarrillos/día)' },
    { category: 'Tabaquismo', label: 'Tabaquismo leve (< 5 cigarrillos/día)' },
    { category: 'Tabaquismo', label: 'Exfumador (> 6 meses de cese tabáquico)' },
    { category: 'Tabaquismo', label: 'Uso de cigarrillo electrónico / Vapeador frecuente' },
    { category: 'Alcohol', label: 'Consumo ocasional / social de alcohol' },
    { category: 'Alcohol', label: 'Consumo moderado a frecuente de alcohol' },
    { category: 'Alcohol', label: 'Alcoholismo crónico dependiente' },
    { category: 'Sustancias', label: 'Consumo de sustancias ilícitas / Psicoactivas (Cannabis, etc.)' }
  ],

  cirugiasPrevias: [
    { category: 'General / Negativo', label: 'Ninguna (Niega cirugías ni anestesias previas)' },
    { category: 'Obstetricia', label: 'Cesárea previa bajo anestesia neuroaxial (sin complicaciones)' },
    { category: 'Obstetricia', label: '2 o más cesáreas previas bajo anestesia neuroaxial' },
    { category: 'Cirugía General', label: 'Apendicectomía previa bajo anestesia general' },
    { category: 'Cirugía General', label: 'Colecistectomía laparoscópica previa sin complicaciones' },
    { category: 'Cirugía General', label: 'Hernioplastia inguinal / umbilical previa' },
    { category: 'Múltiples', label: 'Múltiples intervenciones quirúrgicas sin eventos adversos anestésicos' },
    { category: 'Alerta Anestésica', label: 'Antecedente de Vía Aérea Difícil / Intubación difícil' },
    { category: 'Alerta Anestésica', label: 'Antecedente de Náuseas y Vómitos Postoperatorios (NVPO) severos' },
    { category: 'Alerta Anestésica', label: 'Antecedente de hipotensión severa / bradicardia transanestésica' }
  ]
};

export const groupAntecedentsByCategory = (options: AntecedentCategoryOption[]): Record<string, AntecedentCategoryOption[]> => {
  return options.reduce<Record<string, AntecedentCategoryOption[]>>((acc, item) => {
    const cat = item.category || 'General';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {});
};

// ==========================================
// ESCALA DE CAPRINI (RIESGO DE TROMBOEMBOLIA VENOSA)
// ==========================================

export interface CapriniItem {
  id: string;
  label: string;
  points: 1 | 2 | 3 | 5;
  description?: string;
  category: '1_punto' | '2_puntos' | '3_puntos' | '5_puntos';
}

export const CAPRINI_FACTORS: CapriniItem[] = [
  // --- 1 PUNTO CADA UNO ---
  { id: 'age_41_60', label: 'Edad 41 - 60 años', points: 1, category: '1_punto' },
  { id: 'minor_surg', label: 'Cirugía menor planeada (< 45 minutos)', points: 1, category: '1_punto' },
  { id: 'recent_major_surg', label: 'Cirugía mayor reciente (< 1 mes)', points: 1, category: '1_punto' },
  { id: 'varicose_veins', label: 'Várices venosas visibles en miembros inferiores', points: 1, category: '1_punto' },
  { id: 'ibd', label: 'Enfermedad Inflamatoria Intestinal (Crohn / CU)', points: 1, category: '1_punto' },
  { id: 'leg_edema', label: 'Edema o tumefacción en miembros inferiores', points: 1, category: '1_punto' },
  { id: 'overweight_bmi', label: 'Sobrepeso / Obesidad (IMC > 25 kg/m²)', points: 1, category: '1_punto' },
  { id: 'recent_ami', label: 'Infarto agudo de miocardio reciente (< 1 mes)', points: 1, category: '1_punto' },
  { id: 'recent_chf', label: 'Insuficiencia Cardíaca Congestiva (< 1 mes)', points: 1, category: '1_punto' },
  { id: 'recent_sepsis', label: 'Sepsis grave o infección sistémica (< 1 mes)', points: 1, category: '1_punto' },
  { id: 'severe_copd', label: 'Neumopatía grave / EPOC descompensado', points: 1, category: '1_punto' },
  { id: 'bed_rest_current', label: 'Reposo en cama o movilidad reducida actual', points: 1, category: '1_punto' },
  { id: 'pregnancy_postpartum', label: 'Embarazo en curso o posparto (< 1 mes)', points: 1, category: '1_punto' },
  { id: 'oral_contraceptives', label: 'Anticonceptivos orales o Terapia de Reemplazo Hormonal', points: 1, category: '1_punto' },
  { id: 'recurrent_miscarriage', label: 'Historia de abortos recurrentes (≥ 3) o muerte fetal intrauterina', points: 1, category: '1_punto' },

  // --- 2 PUNTOS CADA UNO ---
  { id: 'age_61_74', label: 'Edad 61 - 74 años', points: 2, category: '2_puntos' },
  { id: 'major_surg_45m', label: 'Cirugía mayor planeada (> 45 min abierta o laparoscópica)', points: 2, category: '2_puntos' },
  { id: 'arthroscopic_surg', label: 'Cirugía artroscópica de extremidades', points: 2, category: '2_puntos' },
  { id: 'active_malignancy', label: 'Neoplasia maligna activa (presente o < 6 meses)', points: 2, category: '2_puntos' },
  { id: 'confined_bed_72h', label: 'Paciente confinado a cama (> 72 horas)', points: 2, category: '2_puntos' },
  { id: 'immobilizer_cast', label: 'Inmovilizador / Yeso en extremidad inferior (< 1 mes)', points: 2, category: '2_puntos' },
  { id: 'central_venous_catheter', label: 'Catéter venoso central colocado o planeado', points: 2, category: '2_puntos' },

  // --- 3 PUNTOS CADA UNO ---
  { id: 'age_ge_75', label: 'Edad ≥ 75 años', points: 3, category: '3_puntos' },
  { id: 'history_vte_pe', label: 'Antecedente personal confirmado de TVP o Tromboembolismo Pulmonar', points: 3, category: '3_puntos' },
  { id: 'family_history_vte', label: 'Historia familiar directa de Tromboembolismo Venoso', points: 3, category: '3_puntos' },
  { id: 'factor_v_leiden', label: 'Factor V de Leiden presente (Trombofilia congénita)', points: 3, category: '3_puntos' },
  { id: 'prothrombin_g20210a', label: 'Mutación Protrombina G20210A', points: 3, category: '3_puntos' },
  { id: 'lupus_anticoagulant', label: 'Anticoagulante lúpico o Anticuerpos Antifosfolípidos positivos', points: 3, category: '3_puntos' },
  { id: 'hyperhomocysteinemia', label: 'Homocisteína sérica elevada', points: 3, category: '3_puntos' },
  { id: 'hit_history', label: 'Trombocitopenia inducida por heparina (TIH)', points: 3, category: '3_puntos' },
  { id: 'other_thrombophilia', label: 'Déficit de Proteína C, S o Antitrombina III', points: 3, category: '3_puntos' },

  // --- 5 PUNTOS CADA UNO ---
  { id: 'major_ortho_surg', label: 'Cirugía ortopédica mayor (Reemplazo total cadera/rodilla o fractura)', points: 5, category: '5_puntos' },
  { id: 'stroke_paralysis', label: 'Accidente Cerebrovascular con parálisis (< 1 mes)', points: 5, category: '5_puntos' },
  { id: 'multiple_trauma', label: 'Traumatismo mayor múltiple / Politraumatismo (< 1 mes)', points: 5, category: '5_puntos' },
  { id: 'acute_spinal_cord_injury', label: 'Lesión aguda de médula espinal con parálisis / paresia (< 1 mes)', points: 5, category: '5_puntos' }
];

export interface CapriniAssessmentResult {
  score: number;
  level: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  categoryTitle: string;
  incidenceText: string;
  profilaxisText: string;
  profilaxisDrug: string;
}

export const evaluateCapriniScore = (score: number): CapriniAssessmentResult => {
  if (score === 0) {
    return {
      score,
      level: 'very_low',
      categoryTitle: 'Riesgo Muy Bajo (0 pts)',
      incidenceText: 'Incidencia TEV < 0.5%',
      profilaxisText: 'No requiere tromboprofilaxis farmacológica específica. Fomentar deambulación temprana y frecuente.',
      profilaxisDrug: 'Deambulación temprana y frecuente'
    };
  } else if (score <= 2) {
    return {
      score,
      level: 'low',
      categoryTitle: 'Riesgo Bajo (1 - 2 pts)',
      incidenceText: 'Incidencia TEV ~ 1.5%',
      profilaxisText: 'Tromboprofilaxis mecánica: Medias de compresión elástica graduada (MECG) o Compresión Neumática Intermitente (CNI) intra y postoperatoria.',
      profilaxisDrug: 'Medias elásticas graduadas o Compresión Neumática (CNI)'
    };
  } else if (score <= 4) {
    return {
      score,
      level: 'moderate',
      categoryTitle: 'Riesgo Moderado (3 - 4 pts)',
      incidenceText: 'Incidencia TEV ~ 3.0%',
      profilaxisText: 'Tromboprofilaxis farmacológica preferida: HBPM (Enoxaparina 20 a 40 mg SC cada 24 horas) o HNF (5000 UI SC c/12h). Alternativa: CNI si alto riesgo hemorrágico.',
      profilaxisDrug: 'Enoxaparina 20 - 40 mg SC/día (o CNI mecánica)'
    };
  } else if (score <= 8) {
    return {
      score,
      level: 'high',
      categoryTitle: 'Riesgo Alto (5 - 8 pts)',
      incidenceText: 'Incidencia TEV ~ 6.0%',
      profilaxisText: 'Tromboprofilaxis combinada: Farmacológica con HBPM (Enoxaparina 40 mg SC cada 24h) MÁS Tromboprofilaxis mecánica (CNI y/o medias antitrombóticas).',
      profilaxisDrug: 'Enoxaparina 40 mg SC/día + CNI mecánica combinada'
    };
  } else {
    return {
      score,
      level: 'very_high',
      categoryTitle: 'Riesgo Muy Alto (≥ 9 pts)',
      incidenceText: 'Incidencia TEV > 10.7%',
      profilaxisText: 'Tromboprofilaxis combinada de máxima intensidad: Enoxaparina 40 mg SC cada 24h + CNI continua. Considerar tromboprofilaxis extendida post-alta (hasta 28-35 días en cirugía oncológica pélvica/abdominal o artroplastia mayor).',
      profilaxisDrug: 'Enoxaparina 40 mg SC/día + CNI continua (Profilaxis extendida 28-35 días)'
    };
  }
};

// ==========================================
// FORMATEADOR DE PREANESTESIA COMPLETA PARA WHATSAPP
// ==========================================

export const generateWhatsAppFullPreanesthesiaMessage = (
  data: any,
  egriScore: number,
  egriCategory: string
): string => {
  const capriniRes = evaluateCapriniScore(data.capriniScore || 0);

  const lines = [
    `📋 *ANESTESIAPRO - EVALUACIÓN PREANESTÉSICA OFICIAL*`,
    `*Fecha:* ${data.fecha || '---'} | *Hora:* ${data.hora || '---'}`,
    `----------------------------------------`,
    `👤 *1. IDENTIFICACIÓN DEL PACIENTE*`,
    `• *Nombre:* ${data.nombre || '---'}`,
    `• *Cédula / Documento:* ${data.cedulaPaciente || '---'}`,
    `• *Edad:* ${data.edad || '---'} | *Sexo:* ${data.sexo || '---'}`,
    `• *Servicio Tratante:* ${data.servicio || 'Cirugía General'}`,
    `• *Diagnóstico:* ${data.diag || '---'}`,
    `• *Cirugía Programada:* ${data.cirugia || '---'}`,
    `• *Dirección:* ${data.direccion || '---'}`,
    ``,
    `🧬 *2. ANTECEDENTES Y HÁBITOS*`,
    `• *Patológicos Personales:* ${data.antPers || 'Niega patologías conocidas'}`,
    `• *Patológicos Familiares:* ${data.antFam || 'Niega antecedentes familiares'}`,
    `• *Alergias:* ${data.alergias || 'Negativas'}`,
    `• *Hábitos / Psicotóxicos:* ${data.alcohol || 'Niega hábitos psicotóxicos'}`,
    `• *Cirugías Previas:* ${data.cirugiasPrev || 'Ninguna'}`,
    ``,
    `🩺 *3. EXAMEN FÍSICO Y VÍA AÉREA*`,
    `• *Signos Vitales:* Peso: ${data.peso || '--'} kg | FC: ${data.fc || '--'} lpm | FR: ${data.fr || '--'} rpm | TA: ${data.ta || '--'} mmHg`,
    `• *Índice EGRI (El-Ganzouri):* ${egriScore}/14 pts (${egriCategory})`,
    `• *Apertura bucal:* ${data.egriApertura || '---'} | *DTM:* ${data.egriDtm || '---'}`,
    `• *Mallampati:* ${data.egriMallampati || '---'} | *Mov. Cervical:* ${data.egriCervical || '---'}`,
    `• *Escala Chien (Neuroaxial):* ${data.escalaChien || 'Grado I - Fácil'}`,
    `• *Examen Físico:* Cardio: ${data.cardio || 'Normal'} | Resp: ${data.resp || 'Normal'} | Neuro: ${data.neuro || 'Normal'}`,
    ``,
    `🧪 *4. PARACLÍNICOS Y COAGULACIÓN*`,
    `• *Hemograma:* Hb: ${data.hg || '--'} | Hto: ${data.hto || '--'} | Leuco: ${data.leuco || '--'} | Plaq: ${data.plaquetas || '--'}`,
    `• *Grupo y Factor Rh:* ${data.grupoFactor || '---'}`,
    `• *Química:* Glicemia: ${data.glicemia || '--'} | Creatinina: ${data.creatinina || '--'} | Urea: ${data.urea || '--'}`,
    `• *Coagulación:* PT: ${data.pt || '--'} | INR: ${data.inr || '1.0'} | PTT: ${data.ptt || '--'}`,
    `• *Serologías:* HIV: ${data.hiv || 'Negativo'} | VDRL: ${data.vdrl || 'No reactivo'}`,
    `• *EKG / RX Tórax:* ${data.ekg || 'Normal'} | ${data.rx || 'Normal'}`,
    `• *Val. Cardiovascular:* ${data.evaluacionCardio || 'Sin contraindicación'}`,
    `• *Eval. Neumonología:* ${data.evaluacionNeumo || 'Sin contraindicación'}`,
    data.otrasValoraciones ? `• *Otras Valoraciones:* ${data.otrasValoraciones}` : null,
    data.otrosLaboratorios ? `• *Otros Laboratorios:* ${data.otrosLaboratorios}` : null,
    ``,
    `⚖️ *5. ESTRATIFICACIÓN DE RIESGO Y APTITUD*`,
    `• *Apto para Cirugía:* *${data.apto || 'SÍ (Apto)'}*`,
    `• *Clasificación ASA:* ${data.asa || 'ASA I'}`,
    `• *Índice de Goldman (Riesgo Cardíaco):* ${data.goldman || 'Clase I (Riesgo Muy Bajo 1%)'}`,
    `• *Escala de Caprini (Riesgo Tromboembólico TEV):* ${data.capriniScore || 0} pts - ${capriniRes.categoryTitle} (${capriniRes.incidenceText})`,
    `• *Tromboprofilaxis Recomendada:* ${data.capriniProfilaxis || capriniRes.profilaxisText}`,
    ``,
    `💊 *6. PLAN ANESTÉSICO Y RECOMENDACIONES*`,
    data.recomendaciones ? `${data.recomendaciones}` : `• Monitorización estándar básica ASA continua.\n• Ayuno preoperatorio de 8 horas para sólidos y 2 horas para líquidos claros.`,
    ``,
    `👨‍⚕️ *7. MÉDICO ANESTESIÓLOGO TRATANTE*`,
    `• *Dr(a):* ${data.anestesio || 'Médico Anestesiólogo'}`,
    `• *Cédula:* ${data.cedula || '---'}`,
    `• *Matrícula Profesional (M.P.):* ${data.matricula || '---'}`,
    `• *Teléfono:* ${data.telefono || '---'}`,
    `----------------------------------------`,
    `📄 *Documento oficial generado en AnestesiaPro. Archivo PDF adjunto con formato legal.*`
  ].filter(line => line !== null);

  return lines.join('\n');
};

// ==========================================
// CATÁLOGO CLÍNICO DE PLAN ANESTÉSICO Y RECOMENDACIONES
// ==========================================

export interface PlanSuggestionCategory {
  category: string;
  iconName?: string;
  options: {
    id: string;
    label: string;
    shortDesc?: string;
    text: string;
  }[];
}

export const PLAN_ANESTHESIA_SUGGESTIONS: PlanSuggestionCategory[] = [
  {
    category: '1. Pautas de Ayuno Preoperatorio',
    options: [
      {
        id: 'fasting_8h',
        label: 'Ayuno 8 horas (Sólidos / 2h claros)',
        shortDesc: 'Adultos electivos estándar',
        text: '• Ayuno de 8h para sólidos y 2h para líquidos claros.'
      },
      {
        id: 'fasting_6h',
        label: 'Ayuno 6 horas (Dieta blanda / leche)',
        shortDesc: 'Comida ligera / lácteos',
        text: '• Ayuno de 6h para comida ligera o lácteos.'
      },
      {
        id: 'fasting_full_stomach',
        label: 'Estómago Lleno (Secuencia de Inducción Rápida - SRI)',
        shortDesc: 'Urgencias / RGE / Sellick',
        text: '• Estómago lleno: Secuencia de Inducción Rápida (SRI) y Maniobra de Sellick.'
      },
      {
        id: 'fasting_pediatric',
        label: 'Ayuno Pediátrico (4h leche materna / 6h fórmula)',
        shortDesc: 'Pediátrico / Lactante',
        text: '• Ayuno pediátrico: 4h leche materna, 6h fórmula y 2h líquidos claros.'
      }
    ]
  },
  {
    category: '2. Premedicación & Protección Gástrica',
    options: [
      {
        id: 'gastric_protector',
        label: 'Protector Gástrico (Omeprazol 40 mg IV / Ranitidina 50 mg)',
        shortDesc: 'Antiácido preventivo',
        text: '• Protección gástrica: Omeprazol 40 mg IV (o Ranitidina 50 mg IV).'
      },
      {
        id: 'antiemetic_dual',
        label: 'Profilaxis Antiemética Dual (Ondansetrón + Dexametasona)',
        shortDesc: 'Prevención NVPO',
        text: '• Profilaxis NVPO dual: Ondansetrón 4-8 mg IV + Dexametasona 4-8 mg IV.'
      },
      {
        id: 'premed_midazolam',
        label: 'Premedicación Ansiolítica (Midazolam 1-2 mg IV)',
        shortDesc: 'Ansiolisis en preanestesia',
        text: '• Premedicación ansiolítica: Midazolam 1-2 mg IV en preanestesia.'
      }
    ]
  },
  {
    category: '3. Vía Aérea & Soporte Pulmonar',
    options: [
      {
        id: 'airway_nebulization',
        label: 'Nebuloterapia Previa (Salbutamol + Ipratropio)',
        shortDesc: 'Broncodilatación previa',
        text: '• Nebuloterapia previa: Salbutamol (10-20 gts) + Ipratropio (20 gts) en 3 cc SSN.'
      },
      {
        id: 'airway_budesonide',
        label: 'Nebulización con Budesonida 0.5 - 1 mg',
        shortDesc: 'Antiinflamatorio tópico',
        text: '• Nebuloterapia con Budesonida 0.5-1 mg en 3 cc SSN previa a inducción.'
      },
      {
        id: 'airway_hydrocortisone',
        label: 'Hidrocortisona 100 - 200 mg IV Previo',
        shortDesc: 'Esteroide endovenoso',
        text: '• Corticosteroide: Hidrocortisona 100-200 mg IV preoperatoria.'
      },
      {
        id: 'airway_methylpred',
        label: 'Metilprednisolona 40-80 mg / Dexametasona 8 mg IV',
        shortDesc: 'Esteroide sistémico',
        text: '• Metilprednisolona 40-80 mg IV o Dexametasona 8 mg IV prequirúrgica.'
      },
      {
        id: 'airway_vad_alert',
        label: 'Carro de Vía Aérea Difícil & Videolaringoscopio',
        shortDesc: 'Protocolo VAD en quirófano',
        text: '• Disponer de videolaringoscopio, guía Frova y carro VAD en quirófano.'
      }
    ]
  },
  {
    category: '4. Tromboprofilaxis (TEV) & Seguridad Neuroaxial',
    options: [
      {
        id: 'tromb_enoxa_40',
        label: 'Enoxaparina 40 mg SC/día (Riesgo Estándar / Caprini)',
        shortDesc: 'HBPM profilaxis',
        text: '• Tromboprofilaxis: Enoxaparina 40 mg SC c/24h (según hemostasia quirúrgica).'
      },
      {
        id: 'tromb_enoxa_20',
        label: 'Enoxaparina 20 mg SC/día (Ajuste Renal / Peso < 50 kg)',
        shortDesc: 'Dosis ajustada',
        text: '• Tromboprofilaxis: Enoxaparina 20 mg SC c/24h (ajuste por función renal o peso).'
      },
      {
        id: 'tromb_enoxa_60',
        label: 'Enoxaparina 60 mg SC/día (Alto Riesgo / Obesidad Mórbida)',
        shortDesc: 'IMC > 40 kg/m²',
        text: '• Tromboprofilaxis: Enoxaparina 60 mg SC c/24h (alto riesgo TEV / IMC > 40).'
      },
      {
        id: 'tromb_mecanica',
        label: 'Tromboprofilaxis Mecánica (Medias elásticas / CNI)',
        shortDesc: 'MECG + CNI',
        text: '• Tromboprofilaxis mecánica: Medias de compresión graduada y/o CNI.'
      },
      {
        id: 'tromb_pausa_neuroaxial',
        label: 'Seguridad Neuroaxial: Suspender HBPM 12h (24h dosis plena)',
        shortDesc: 'Prevención hematoma epidural',
        text: '• Pausa neuroaxial: Suspender HBPM 12h antes de punción/retiro de catéter (24h dosis plena).'
      }
    ]
  },
  {
    category: '5. Hemoderivados & Banco de Sangre',
    options: [
      {
        id: 'blood_reserve_1',
        label: 'Reservar 01 Unidad de Concentrado Globular (CG)',
        shortDesc: 'Reserva 1 U CG',
        text: '• Reservar 01 unidad de Concentrado Globular (CG).'
      },
      {
        id: 'blood_reserve_2',
        label: 'Reservar 02 Unidades de Concentrado Globular (CG)',
        shortDesc: 'Reserva 2 U CG',
        text: '• Reservar 02 unidades de Concentrado Globular (CG).'
      },
      {
        id: 'blood_reserve_plasma',
        label: 'Reservar 02 Unidades CG + 02 Plasma Fresco (PFC)',
        shortDesc: 'CG + PFC',
        text: '• Reservar 02 unidades de CG + 02 unidades de Plasma Fresco (PFC).'
      },
      {
        id: 'blood_crossmatch',
        label: 'Pruebas Cruzadas vigentes en Banco de Sangre',
        shortDesc: 'Tipaje y reserva activa',
        text: '• Pruebas cruzadas y reserva validadas en Banco de Sangre.'
      }
    ]
  },
  {
    category: '6. Monitorización & Accesos Vasculares',
    options: [
      {
        id: 'mon_asa_basic',
        label: 'Monitorización Estándar Básica ASA Continua',
        shortDesc: 'ECG, PANI, SpO2, EtCO2, Temp',
        text: '• Monitorización continua básica ASA (ECG, PANI, SpO2, Capnografía, Temp).'
      },
      {
        id: 'mon_invasive',
        label: 'Monitorización Invasiva (Línea Arterial / PVC)',
        shortDesc: 'Arterial / Venoso central',
        text: '• Monitorización invasiva continua (Línea arterial / Catéter venoso central).'
      },
      {
        id: 'mon_iv_access',
        label: 'Dos Vías Venosas Periféricas Grueso Calibre (#16G o #18G)',
        shortDesc: 'Accesos vasculares seguros',
        text: '• Canalizar dos vías periféricas de grueso calibre (#16G o #18G).'
      }
    ]
  },
  {
    category: '7. Confort Térmico & Analgesia Multimodal',
    options: [
      {
        id: 'comfort_thermal',
        label: 'Confort Térmico Trans y Postoperatorio (Manta Térmica)',
        shortDesc: 'Normotermia activa',
        text: '• Normotermia activa: Manta térmica trans y postoperatoria.'
      },
      {
        id: 'analgesia_multimodal',
        label: 'Analgesia Multimodal Preventiva Oportuna',
        shortDesc: 'Manejo dolor agudo',
        text: '• Analgesia multimodal preventiva y control oportuno del dolor.'
      },
      {
        id: 'antibiotic_proph',
        label: 'Profilaxis Antibiótica 30 a 60 min Antes de Incisión',
        shortDesc: 'Infección quirúrgica',
        text: '• Profilaxis antibiótica 30 a 60 min previos a incisión quirúrgica.'
      }
    ]
  },
  {
    category: '8. Aspectos Médico-Legales & Destino Postquirúrgico',
    options: [
      {
        id: 'legal_consent',
        label: 'Consentimiento Informado Firmado',
        shortDesc: 'Paciente / Familiar',
        text: '• Consentimiento informado preanestésico firmado y asentado.'
      },
      {
        id: 'dest_urpa',
        label: 'Cuidado Inmediato en Recuperación (URPA)',
        shortDesc: 'Vigilancia en sala postanestésica',
        text: '• Cuidados inmediatos y vigilancia continua en URPA.'
      },
      {
        id: 'dest_uci',
        label: 'Solicitud de Cama en Cuidados Intensivos (UCI)',
        shortDesc: 'Vigilancia crítica postoperatoria',
        text: '• Cirugía de alto riesgo: Solicitar reserva de cama en UCI/UTI postoperatoria.'
      }
    ]
  }
];

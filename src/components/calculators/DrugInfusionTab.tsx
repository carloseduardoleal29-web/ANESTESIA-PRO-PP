import React, { useState } from 'react';
import { 
  Flame, Heart, Zap, RefreshCw, Calculator, Copy, Check, 
  AlertTriangle, Shield, Droplet, ArrowRight, Sliders, CheckCircle2,
  Sparkles, Info, BookOpen, FlaskConical, Beaker, ShieldAlert
} from 'lucide-react';
import { VasoactiveDrugPreset } from './types';
import { CleanNumberInput } from './CleanNumberInput';

const VASOACTIVE_PRESETS: VasoactiveDrugPreset[] = [
  {
    id: 'noradrenalina',
    name: 'Noradrenalina (Norepinefrina)',
    category: 'vasopressor',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 0.10,
    minDose: 0.02,
    maxDose: 1.5,
    standardVialMg: 4,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '4 mg en 250 ml (16 µg/ml) - Estándar', vialMg: 4, volumeMl: 250 },
      { label: '8 mg en 250 ml (32 µg/ml) - Doble Conc. UCI', vialMg: 8, volumeMl: 250 },
      { label: '4 mg en 100 ml (40 µg/ml) - Concentrado', vialMg: 4, volumeMl: 100 },
      { label: '8 mg en 100 ml (80 µg/ml) - Restricción Hídrica', vialMg: 8, volumeMl: 100 }
    ],
    recommendedSolution: 'Dextrosa 5% en Agua (D5W) preferente o SSN 0.9%',
    solutionReason: 'El pH ácido (4.0-5.5) de la Dextrosa al 5% previene la auto-oxidación espontánea de las catecolaminas hacia adrenocromo inactivo. Prohibido mezclar en soluciones alcalinas (como Bicarbonato de Sodio) porque degradan y precipitan la noradrenalina inmediatamente.',
    compatibilityNotes: 'Compatible en Y con Dobutamina, Fentanilo, Midazolam, Morfina, Propofol. Incompatible con Bicarbonato de Sodio, Furosemida, Tiopental.',
    stabilityHours: '24 horas a temperatura ambiente (15-25°C). Si se decolora o se torna rosada/marrón, descartar inmediatamente.',
    clinicalIndication: 'Vasopresor de 1ª línea en Shock Séptico, Vasoplejia post-CEC y Anestesia Neuroaxial. Meta hemodinámica: PAM ≥ 65 mmHg.',
    cautionAlert: 'Extravasación causa isquemia y necrosis tisular severa. Preferir CVC; si es periférica usar vena antecubital gruesa y monitorizar cada 15 min. Antídoto en extravasación: Fentolamina 5-10 mg subcutánea en la zona afectada o parche de Nitroglicerina 2%.'
  },
  {
    id: 'adrenalina',
    name: 'Adrenalina (Epinefrina)',
    category: 'inotrope',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 0.05,
    minDose: 0.01,
    maxDose: 1.0,
    standardVialMg: 4,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '4 mg en 250 ml (16 µg/ml)', vialMg: 4, volumeMl: 250 },
      { label: '8 mg en 250 ml (32 µg/ml)', vialMg: 8, volumeMl: 250 },
      { label: '1 mg en 100 ml (10 µg/ml)', vialMg: 1, volumeMl: 100 }
    ],
    recommendedSolution: 'Dextrosa 5% en Agua (D5W) preferente o SSN 0.9%',
    solutionReason: 'La glucosa previene la oxidación acelerada del anillo catecol. Proteger de la luz ambiente directa si la infusión supera las 12 horas. Incompatible con pH alcalino (Bicarbonato).',
    compatibilityNotes: 'Compatible con Amiodarona, Milrinona, Propofol, Remifentanilo. Incompatible con Bicarbonato, Ampicilina.',
    stabilityHours: '24 horas protegido de la luz directa. Si la solución se torna parda o precipita, descartar.',
    clinicalIndication: 'Shock Cardiogénico con bajo gasto, Anafilaxia refractaria, Paro Cardíaco post-ROSC y Bradicardia extrema.',
    cautionAlert: 'Provoca hiperlactatemia transitoria tipo B por estimulación β2 glucolítica hepática (no traduce hipoperfusión tisular). Monitorizar arritmias ventriculares y taquicardia severa.'
  },
  {
    id: 'vasopresina',
    name: 'Vasopresina (Arginina Vasopresina / AVP)',
    category: 'vasopressor',
    defaultDoseUnit: 'U/min',
    defaultDose: 0.03,
    minDose: 0.01,
    maxDose: 0.04,
    standardVialMg: 20, // 20 Units
    standardDilutionMl: 100,
    diluentOptions: [
      { label: '20 U en 100 ml (0.2 U/ml) - Estándar', vialMg: 20, volumeMl: 100 },
      { label: '40 U en 100 ml (0.4 U/ml) - Concentrado', vialMg: 40, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% (SSN) o Dextrosa 5% en Agua',
    solutionReason: 'La vasopresina es un péptido muy estable tanto en SSN 0.9% como en D5W a pH entre 3.0 y 5.0. No requiere fotoprotección estricta.',
    compatibilityNotes: 'Compatible con la mayoría de vasoactivos. No mezclar con fenitoína ni soluciones altamente alcalinas.',
    stabilityHours: '24 horas a temperatura ambiente refrigerada (ideal 2-8°C tras dilución, estable hasta 18h a 25°C).',
    clinicalIndication: 'Coadyuvante de rescate en Shock Séptico refractario a Noradrenalina (déficit relativo de vasopresina endógena) y Vasoplejia por IECAs/CEC.',
    cautionAlert: 'Dosis fija recomendada: 0.01 - 0.03 U/min (no titular agresivamente como noradrenalina). Dosis > 0.04 U/min causan vasoespasmo coronario, isquemia mesentérica y necrosis distal de dedos.'
  },
  {
    id: 'dobutamina',
    name: 'Dobutamina',
    category: 'inotrope',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 5.0,
    minDose: 2.5,
    maxDose: 20.0,
    standardVialMg: 250,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '250 mg en 250 ml (1000 µg/ml) - Estándar', vialMg: 250, volumeMl: 250 },
      { label: '500 mg en 250 ml (2000 µg/ml) - Doble Concentración', vialMg: 500, volumeMl: 250 }
    ],
    recommendedSolution: 'Dextrosa 5% en Agua (D5W) o Solución Salina 0.9%',
    solutionReason: 'La solución puede desarrollar un tinte rosáceo tenue por ligera oxidación de dobutamina, lo cual NO indica pérdida de potencia dentro de las primeras 24h. Incompatible con Bicarbonato y Cefazolina.',
    compatibilityNotes: 'Compatible con Dopamina, Adrenalina, Noradrenalina, Lidocaína. Incompatible con Heparina, Bicarbonato de Sodio.',
    stabilityHours: '24 horas una vez reconstituida.',
    clinicalIndication: 'Inotrópico β1 puro para Shock Cardiogénico, falla ventricular izquierda/derecha y bajo gasto cardíaco posquirúrgico.',
    cautionAlert: 'Por su efecto β2 vasodilatador puede agravar la hipotensión en pacientes hipovolémicos no reanimados. Si la PAM cae, asociar Noradrenalina.'
  },
  {
    id: 'dopamina',
    name: 'Dopamina',
    category: 'inotrope',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 5.0,
    minDose: 2.0,
    maxDose: 20.0,
    standardVialMg: 200,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '200 mg en 250 ml (800 µg/ml)', vialMg: 200, volumeMl: 250 },
      { label: '400 mg en 250 ml (1600 µg/ml)', vialMg: 400, volumeMl: 250 }
    ],
    recommendedSolution: 'Dextrosa 5% en Agua (D5W) preferente o SSN 0.9%',
    solutionReason: 'La D5W provee el medio ácido que evita la formación de polímeros oscuros. Incompatible con álcalis.',
    compatibilityNotes: 'Compatible con Lidocaína, Dobutamina, Nitroglicerina. Incompatible con Bicarbonato y Ampicilina.',
    stabilityHours: '24 horas.',
    clinicalIndication: 'Bradicardia sintomática refractaria a atropina (dosis 2-10 µg/kg/min) o soporte inotrópico de 2ª línea.',
    cautionAlert: 'No utilizar la dosis "renal" (0.5-2 µg/kg/min) porque no reduce la falla renal aguda y aumenta el riesgo de fibrilación auricular.'
  },
  {
    id: 'milrinona',
    name: 'Milrinona (Inodilatador - Inhibidor PDE-3)',
    category: 'inotrope',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 0.375,
    minDose: 0.25,
    maxDose: 0.75,
    standardVialMg: 10,
    standardDilutionMl: 100,
    diluentOptions: [
      { label: '10 mg en 100 ml (100 µg/ml) - Estándar', vialMg: 10, volumeMl: 100 },
      { label: '20 mg en 100 ml (200 µg/ml)', vialMg: 20, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% (SSN) o Dextrosa 5% en Agua',
    solutionReason: 'Estable en amplio rango de pH fisiológico. No precipita con cristaloides estándar.',
    compatibilityNotes: 'Compatible con Noradrenalina, Adrenalina, Fentanilo. Incompatible con Furosemida (precipita inmediatamente en la vía).',
    stabilityHours: '72 horas a temperatura ambiente (máximo 24h recomendadas por técnica aséptica).',
    clinicalIndication: 'Falla cardíaca con Hipertensión Pulmonar, disfunción diastólica biventricular y salida de CEC en cirugía cardiovascular.',
    cautionAlert: 'Eliminación 100% renal. En insuficiencia renal aguda o crónica, reducir la dosis a 0.2-0.25 µg/kg/min para evitar acumulación e hipotensión severa sostenida.'
  },
  {
    id: 'nitroglicerina',
    name: 'Nitroglicerina (NTG)',
    category: 'vasodilator',
    defaultDoseUnit: 'mcg/min',
    defaultDose: 20,
    minDose: 5,
    maxDose: 200,
    standardVialMg: 50,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '50 mg en 250 ml (200 µg/ml) - Frasco Vidrio', vialMg: 50, volumeMl: 250 },
      { label: '25 mg en 250 ml (100 µg/ml)', vialMg: 25, volumeMl: 250 }
    ],
    recommendedSolution: 'Dextrosa 5% en Agua o SSN 0.9% (USAR FRASCO DE VIDRIO Y EQUIPO DE POLIETILENO/NO-PVC)',
    solutionReason: 'La nitroglicerina es altamente lipofílica y se absorbe hasta en un 40-80% en los tubos plásticos de PVC convencional. Es obligatorio utilizar líneas de infusión de polietileno/no-PVC o envases de vidrio.',
    compatibilityNotes: 'Compatible con Amiodarona, Dobutamina, Heparina, Morfina.',
    stabilityHours: '24 horas en contenedor de vidrio o polietileno.',
    clinicalIndication: 'Edema Agudo de Pulmón cardiogénico (venodilatador precarga), Síndrome Coronario Agudo e Hipertensión perioperatoria.',
    cautionAlert: 'Contraindicado en uso de inhibidores de PDE-5 (Sildenafil en 24h, Tadalafil en 48h) o Infarto de Ventrículo Derecho (provoca colapso hemodinámico letal).'
  },
  {
    id: 'nitroprusiato',
    name: 'Nitroprusiato de Sodio (NPS)',
    category: 'vasodilator',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 0.5,
    minDose: 0.25,
    maxDose: 5.0,
    standardVialMg: 50,
    standardDilutionMl: 250,
    diluentOptions: [
      { label: '50 mg en 250 ml Dextrosa 5% (200 µg/ml) - Con Cubierta Opace', vialMg: 50, volumeMl: 250 },
      { label: '50 mg en 100 ml Dextrosa 5% (500 µg/ml)', vialMg: 50, volumeMl: 100 }
    ],
    recommendedSolution: 'EXCLUSIVAMENTE Dextrosa 5% en Agua (D5W) + CUBIERTA FOTOPROTECTORA DE ALUMINIO',
    solutionReason: 'La exposición a la luz ambiente desencadena fotólisis inmediata, liberando iones Cianuro libres (tóxicos y letales) que provocan acidosis metabólica severa. La D5W estabiliza la molécula.',
    compatibilityNotes: 'No administrar concomitantemente en la misma vía con ningún otro fármaco. Usar línea exclusiva.',
    stabilityHours: '24 horas siempre que esté envuelto en papel de aluminio u opaco. Si adquiere coloración azul/verde (cianógeno), suspender de inmediato.',
    clinicalIndication: 'Emergencias hipertensivas extremas, Disección Aórtica aguda (siempre tras β-bloqueo para evitar shear stress) y Cirugía Aórtica.',
    cautionAlert: 'Vigilar toxicidad por cianuro/tiocianato en dosis > 2 µg/kg/min por más de 24h: acidosis metabólica persistente, taquifilaxia y caída de SvO2. Antídoto: Tiosulfato de sodio o Hidroxocobalamina.'
  },
  {
    id: 'fentanilo',
    name: 'Fentanilo Infusión',
    category: 'analgesic',
    defaultDoseUnit: 'mcg/kg/h',
    defaultDose: 1.5,
    minDose: 0.5,
    maxDose: 4.0,
    standardVialMg: 1, // 1 mg = 1000 mcg
    standardDilutionMl: 100,
    diluentOptions: [
      { label: '1000 µg (20 ml) + 80 ml SF (10 µg/ml)', vialMg: 1, volumeMl: 100 },
      { label: '2000 µg (40 ml) + 60 ml SF (20 µg/ml)', vialMg: 2, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% (SSN) o Dextrosa 5% en Agua',
    solutionReason: 'Opioide lipofílico sintético muy estable en soluciones estándar de cristaloides.',
    compatibilityNotes: 'Compatible con Propofol, Dexmedetomidina, Midazolam, Rocuronio.',
    stabilityHours: '24 horas a temperatura ambiente.',
    clinicalIndication: 'Analgesia profunda continua en paciente ventilado en UCI y anestesia balanceada.',
    cautionAlert: 'Presenta aumento exponencial de la vida media sensible al contexto (CSHT) tras > 24 horas de infusión continua por saturación de compartimentos grasos periféricos.'
  },
  {
    id: 'midazolam',
    name: 'Midazolam Infusión',
    category: 'sedative',
    defaultDoseUnit: 'mg/kg/h',
    defaultDose: 0.08,
    minDose: 0.03,
    maxDose: 0.25,
    standardVialMg: 50,
    standardDilutionMl: 50,
    diluentOptions: [
      { label: '50 mg en 50 ml Jeringa (1 mg/ml) - Estándar', vialMg: 50, volumeMl: 50 },
      { label: '100 mg en 100 ml Solución (1 mg/ml)', vialMg: 100, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% o Dextrosa 5% en Agua',
    solutionReason: 'A pH ácido (<4) el anillo benzodiazepínico se abre haciéndolo hidrosoluble; al entrar al plasma a pH 7.4 se cierra haciéndose altamente liposoluble.',
    compatibilityNotes: 'Compatible con Fentanilo, Morfina, Vecuronio. Incompatible con Tiopental y Dexametasona.',
    stabilityHours: '24 horas a temperatura ambiente.',
    clinicalIndication: 'Sedación profunda continua en UCI, asincronía ventilatoria severa y Estatus Epiléptico refractario.',
    cautionAlert: 'Su metabolito activo (1-hidroximidazolam) se excreta por el riñón y se acumula peligrosamente en falla renal, prolongando el despertar días enteros.'
  },
  {
    id: 'cisatracurio',
    name: 'Cisatracurio (Bloqueante Neuromuscular)',
    category: 'paralytic',
    defaultDoseUnit: 'mcg/kg/min',
    defaultDose: 2.0,
    minDose: 1.0,
    maxDose: 4.0,
    standardVialMg: 20,
    standardDilutionMl: 100,
    diluentOptions: [
      { label: '20 mg en 100 ml (200 µg/ml) - Estándar', vialMg: 20, volumeMl: 100 },
      { label: '40 mg en 100 ml (400 µg/ml)', vialMg: 40, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% o Dextrosa 5% en Agua (Evitar Ringer Lactato a pH alcalino)',
    solutionReason: 'El cisatracurio se degrada espontáneamente a temperatura corporal y pH fisiológico (Eliminación de Hofmann). En soluciones alcalinas se degrada rápidamente antes de ingresar al paciente.',
    compatibilityNotes: 'Compatible con Fentanilo, Sufentanilo, Midazolam. Incompatible con Propofol en la misma línea (puede emulsionar o precipitar) y Tiopental.',
    stabilityHours: '24 horas refrigerado o a temperatura fresca (<25°C).',
    clinicalIndication: 'Relajación neuromuscular continua en SDRA severo (PaFi < 150), prono prolongado o hipertensión endocraneana.',
    cautionAlert: 'Monitoreo obligatorio con Tren de Cuatro (TOF). Meta: 1-2 respuestas de 4 en TOF.'
  },
  {
    id: 'insulina',
    name: 'Insulina Rápida / Regular (Cristalina)',
    category: 'sedative',
    defaultDoseUnit: 'U/min', // handled as UI/h in UI
    defaultDose: 2.0,
    minDose: 0.5,
    maxDose: 15.0,
    standardVialMg: 100, // 100 Units
    standardDilutionMl: 100,
    diluentOptions: [
      { label: '100 UI en 100 ml Solución Salina (1 UI/ml) - Estándar', vialMg: 100, volumeMl: 100 }
    ],
    recommendedSolution: 'Solución Salina 0.9% (SSN 0.9%)',
    solutionReason: 'La insulina se diluye en SSN 0.9% a concentración 1 UI/ml para facilitar titulación 1:1. CRÍTICO: La insulina se adhiere fuertemente a las paredes plásticas de la bolsa y la guía de suero.',
    compatibilityNotes: 'PERLA PRÁCTICA: Purgar los primeros 20-30 ml de la línea de infusión con la mezcla antes de conectar al paciente para saturar los sitios de unión plástica.',
    stabilityHours: '24 horas a temperatura ambiente tras reconstitución.',
    clinicalIndication: 'Cetoacidosis Diabética (CAD), Estado Hiperosmolar y Control Glucémico Perioperatorio en Cirugía Mayor.',
    cautionAlert: 'Control de glicemia capilar cada 1 hora. Si la glucosa desciende por debajo de 200 mg/dL en CAD, agregar Dextrosa 5% para prevenir hipoglicemia y edema cerebral.'
  }
];

interface DrugInfusionTabProps {
  initialMode?: 'direct' | 'reverse' | 'drip' | 'pearls';
}

export const DrugInfusionTab: React.FC<DrugInfusionTabProps> = ({ initialMode = 'direct' }) => {
  // Mode: Direct (Dose -> Rate) or Reverse (Pump Rate -> Actual Dose Received)
  const [calcMode, setCalcMode] = useState<'direct' | 'reverse' | 'drip' | 'pearls'>(initialMode);

  // Shared patient weight
  const [patientWeight, setPatientWeight] = useState<number>(70);

  // Direct calculation state
  const [selectedDrugId, setSelectedDrugId] = useState<string>('noradrenalina');
  const [customVialMg, setCustomVialMg] = useState<number>(4);
  const [customVolMl, setCustomVolMl] = useState<number>(250);
  const [targetDose, setTargetDose] = useState<number>(0.10);

  // Reverse calculation state (What dose is patient getting from pump?)
  const [reverseVialMg, setReverseVialMg] = useState<number>(4);
  const [reverseVolMl, setReverseVolMl] = useState<number>(250);
  const [reverseRateMlHr, setReverseRateMlHr] = useState<number>(9.4);

  // Drip rate calculator
  const [dripVolumeMl, setDripVolumeMl] = useState<number>(500);
  const [dripHours, setDripHours] = useState<number>(8);
  const [dripFactor, setDripFactor] = useState<20 | 60>(20); // 20 gts/ml (macro) or 60 microgts/ml

  // Copied alert
  const [copied, setCopied] = useState<boolean>(false);

  // Search filter for clinical pearls
  const [pearlSearch, setPearlSearch] = useState<string>('');

  // Find active preset
  const activeDrug = VASOACTIVE_PRESETS.find(d => d.id === selectedDrugId) || VASOACTIVE_PRESETS[0];

  // Concentration in mcg/ml or mg/ml or U/ml
  const isUnitsDrug = activeDrug.id === 'vasopresina' || activeDrug.id === 'insulina';
  const concMcgMl = isUnitsDrug
    ? (customVialMg / customVolMl) // Units/ml
    : (customVialMg * 1000) / customVolMl; // mcg/ml
  const concMgMl = customVialMg / customVolMl;

  // Direct calculation formulas
  let calculatedMlHr = 0;
  let doseFormulaExplanation = '';

  if (activeDrug.defaultDoseUnit === 'mcg/kg/min') {
    const totalMcgMin = targetDose * patientWeight;
    const totalMcgHr = totalMcgMin * 60;
    calculatedMlHr = Number((totalMcgHr / concMcgMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} µg/kg/min × ${patientWeight} kg × 60 min = ${(totalMcgHr).toFixed(0)} µg/h ÷ ${concMcgMl.toFixed(1)} µg/ml`;
  } else if (activeDrug.defaultDoseUnit === 'mcg/min') {
    const totalMcgHr = targetDose * 60;
    calculatedMlHr = Number((totalMcgHr / concMcgMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} µg/min × 60 min = ${(totalMcgHr).toFixed(0)} µg/h ÷ ${concMcgMl.toFixed(1)} µg/ml`;
  } else if (activeDrug.defaultDoseUnit === 'mcg/kg/h') {
    const totalMcgHr = targetDose * patientWeight;
    calculatedMlHr = Number((totalMcgHr / concMcgMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} µg/kg/h × ${patientWeight} kg = ${(totalMcgHr).toFixed(0)} µg/h ÷ ${concMcgMl.toFixed(1)} µg/ml`;
  } else if (activeDrug.defaultDoseUnit === 'mg/kg/h') {
    const totalMgHr = targetDose * patientWeight;
    calculatedMlHr = Number((totalMgHr / concMgMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} mg/kg/h × ${patientWeight} kg = ${(totalMgHr).toFixed(1)} mg/h ÷ ${concMgMl.toFixed(2)} mg/ml`;
  } else if (activeDrug.id === 'vasopresina') {
    const totalUnitsHr = targetDose * 60;
    const unitsPerMl = customVialMg / customVolMl;
    calculatedMlHr = Number((totalUnitsHr / unitsPerMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} U/min × 60 min = ${totalUnitsHr.toFixed(2)} U/h ÷ ${unitsPerMl.toFixed(2)} U/ml`;
  } else if (activeDrug.id === 'insulina') {
    const unitsPerMl = customVialMg / customVolMl;
    calculatedMlHr = Number((targetDose / unitsPerMl).toFixed(1));
    doseFormulaExplanation = `${targetDose} UI/h ÷ ${unitsPerMl.toFixed(2)} UI/ml`;
  }

  // Reverse calculation formulas
  const revConcMcgMl = (reverseVialMg * 1000) / reverseVolMl;
  const revTotalMcgHr = reverseRateMlHr * revConcMcgMl;
  const revMcgKgMin = Number((revTotalMcgHr / 60 / patientWeight).toFixed(3));
  const revMcgMin = Number((revTotalMcgHr / 60).toFixed(2));
  const revMgKgHr = Number(((reverseRateMlHr * (reverseVialMg / reverseVolMl)) / patientWeight).toFixed(3));

  // Drip rate calculations
  const totalDripMinutes = dripHours * 60;
  const dripMlHr = Number((dripVolumeMl / dripHours).toFixed(1));
  const dropsPerMinute = Math.round((dripVolumeMl * dripFactor) / totalDripMinutes);

  // Copy dose calculation
  const handleCopy = () => {
    const text = `=== ORDEN DE INFUSIÓN CONTINUA ===
Fármaco: ${activeDrug.name}
Dilución: ${customVialMg}${isUnitsDrug ? ' U' : ' mg'} en ${customVolMl} ml (${concMcgMl.toFixed(1)} ${isUnitsDrug ? 'U/ml' : 'µg/ml'})
Solución Recomendada: ${activeDrug.recommendedSolution || 'D5W o SSN 0.9%'}
Paciente: ${patientWeight} kg
Dosis Prescrita: ${targetDose} ${activeDrug.defaultDoseUnit}
Velocidad en Bomba: ${calculatedMlHr} ml/h
Fórmula: ${doseFormulaExplanation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredPearls = VASOACTIVE_PRESETS.filter(p => 
    p.name.toLowerCase().includes(pearlSearch.toLowerCase()) ||
    p.recommendedSolution?.toLowerCase().includes(pearlSearch.toLowerCase()) ||
    p.solutionReason?.toLowerCase().includes(pearlSearch.toLowerCase()) ||
    p.clinicalIndication.toLowerCase().includes(pearlSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* MODE TABS */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Infusión Continua de Fármacos Críticos</h3>
            <p className="text-xs text-slate-400">Vasoactivos, inotrópicos, perlas clínicas de solución y cálculo inverso.</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => setCalcMode('direct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calcMode === 'direct'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dosis ➔ ml/h Bomba
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('reverse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calcMode === 'reverse'
                ? 'bg-cyan-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bomba ➔ Dosis Real
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('drip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              calcMode === 'drip'
                ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gotas/Min (K)
          </button>
          <button
            type="button"
            onClick={() => setCalcMode('pearls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              calcMode === 'pearls'
                ? 'bg-amber-400 text-slate-950 shadow-sm font-black'
                : 'text-amber-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Perlas de Preparación</span>
          </button>
        </div>
      </div>

      {/* MODE 1: DIRECT (DOSE -> RATE) */}
      {calcMode === 'direct' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* DRUG SELECTOR & PARAMETERS */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-white flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Seleccionar Fármaco Vasoactivo / Crítico
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Peso:</span>
                <div className="w-24">
                  <CleanNumberInput
                    min={10}
                    max={250}
                    step={1}
                    value={patientWeight}
                    onChange={setPatientWeight}
                    suffix="kg"
                  />
                </div>
              </div>
            </div>

            {/* DRUG PILLS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VASOACTIVE_PRESETS.map((drug) => (
                <button
                  key={drug.id}
                  type="button"
                  onClick={() => {
                    setSelectedDrugId(drug.id);
                    setCustomVialMg(drug.standardVialMg);
                    setCustomVolMl(drug.standardDilutionMl);
                    setTargetDose(drug.defaultDose);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedDrugId === drug.id
                      ? 'bg-rose-950/60 border-rose-500 text-white shadow-sm ring-1 ring-rose-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold truncate block">{drug.name}</span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {drug.defaultDose} {drug.defaultDoseUnit}
                  </span>
                </button>
              ))}
            </div>

            {/* DILUTION PRESETS FOR SELECTED DRUG */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <label className="text-[11px] font-bold text-slate-300 block">
                Diluciones Frecuentes / Estándar:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeDrug.diluentOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setCustomVialMg(opt.vialMg);
                      setCustomVolMl(opt.volumeMl);
                    }}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      customVialMg === opt.vialMg && customVolMl === opt.volumeMl
                        ? 'bg-slate-800 border-rose-400 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* CUSTOM VIAL / VOLUME INPUTS */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Cantidad {isUnitsDrug ? 'Unidades (UI)' : 'en Frasco (mg)'}
                  </label>
                  <CleanNumberInput
                    step={0.1}
                    min={0.1}
                    value={customVialMg}
                    onChange={setCustomVialMg}
                    suffix={isUnitsDrug ? 'UI' : 'mg'}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Volumen Solución (ml)</label>
                  <CleanNumberInput
                    step={1}
                    min={1}
                    value={customVolMl}
                    onChange={setCustomVolMl}
                    suffix="ml"
                  />
                </div>
              </div>

              {/* DOSE TARGET SLIDER */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-white">
                    Dosis Deseada ({activeDrug.defaultDoseUnit}):
                  </label>
                  <span className="text-base font-black font-mono text-rose-400 bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                    {targetDose} <span className="text-xs">{activeDrug.defaultDoseUnit}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={activeDrug.minDose}
                  max={activeDrug.maxDose}
                  step={activeDrug.maxDose > 10 ? 0.5 : 0.01}
                  value={targetDose}
                  onChange={(e) => setTargetDose(Number(e.target.value))}
                  className="w-full accent-rose-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Mín: {activeDrug.minDose} {activeDrug.defaultDoseUnit}</span>
                  <span>Máx: {activeDrug.maxDose} {activeDrug.defaultDoseUnit}</span>
                </div>
              </div>

              {/* CLINICAL SOLUTION PEARL FOR ACTIVE DRUG */}
              {activeDrug.recommendedSolution && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Solución Recomendada & Por Qué:</span>
                  </div>
                  <p className="text-amber-200 text-[11px] font-semibold">
                    • {activeDrug.recommendedSolution}
                  </p>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {activeDrug.solutionReason}
                  </p>
                  {activeDrug.stabilityHours && (
                    <p className="text-[10px] text-slate-400 pt-0.5">
                      ⏳ Estabilidad: <strong className="text-white">{activeDrug.stabilityHours}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RESULT CARD */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-rose-950/30 border border-rose-500/30 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black uppercase text-rose-400 tracking-wider">
                  Programación en Bomba
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Orden'}</span>
                </button>
              </div>

              {/* HUGE SPEED DISPLAY */}
              <div className="bg-slate-950/90 border border-rose-500/30 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Velocidad de Infusión Continua
                </span>
                <div className="text-4xl font-black text-rose-400 font-mono tracking-tight">
                  {calculatedMlHr} <span className="text-base text-slate-300 font-sans font-bold">ml/h</span>
                </div>
                <span className="text-[11px] text-slate-400 block font-mono">
                  Concentración: <strong className="text-white">{concMcgMl.toFixed(1)} {isUnitsDrug ? 'U/ml' : 'µg/ml'}</strong>
                </span>
              </div>

              {/* FORMULA BREAKDOWN */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Desglose de Cálculo:</span>
                <p className="font-mono text-cyan-300 text-[11px] leading-relaxed">{doseFormulaExplanation}</p>
              </div>

              {/* CLINICAL INDICATION & CAUTION */}
              <div className="space-y-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Indicación Clínica:</span>
                  <p className="text-slate-300 text-[11px]">{activeDrug.clinicalIndication}</p>
                </div>

                {activeDrug.cautionAlert && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2 text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px]">{activeDrug.cautionAlert}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: REVERSE CALCULATION (ML/H -> ACTUAL DOSE) */}
      {calcMode === 'reverse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-cyan-300">
              <Calculator className="w-5 h-5" />
              <h4 className="text-sm font-black text-white">Calculadora Inversa de Bomba (Regla de 3)</h4>
            </div>
            <p className="text-xs text-slate-400">
              Introduce la velocidad actual que marca la bomba de infusión para saber la dosis exacta recibida por el paciente.
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Peso del Paciente (kg)</label>
                  <CleanNumberInput
                    min={10}
                    max={250}
                    value={patientWeight}
                    onChange={setPatientWeight}
                    suffix="kg"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Velocidad Actual (ml/h)</label>
                  <CleanNumberInput
                    step={0.1}
                    min={0}
                    value={reverseRateMlHr}
                    onChange={setReverseRateMlHr}
                    suffix="ml/h"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Fármaco en Frasco (mg o U)</label>
                  <CleanNumberInput
                    step={0.1}
                    min={0.1}
                    value={reverseVialMg}
                    onChange={setReverseVialMg}
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Volumen Total (ml)</label>
                  <CleanNumberInput
                    step={1}
                    min={1}
                    value={reverseVolMl}
                    onChange={setReverseVolMl}
                    suffix="ml"
                  />
                </div>
              </div>

              {/* QUICK PRESETS */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[10px] text-slate-400 font-bold w-full">Configuración Rápida de Frasco:</span>
                <button
                  type="button"
                  onClick={() => { setReverseVialMg(4); setReverseVolMl(250); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Nora 4mg / 250ml
                </button>
                <button
                  type="button"
                  onClick={() => { setReverseVialMg(8); setReverseVolMl(250); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Nora 8mg / 250ml
                </button>
                <button
                  type="button"
                  onClick={() => { setReverseVialMg(250); setReverseVolMl(250); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Dobutamina 250mg / 250ml
                </button>
                <button
                  type="button"
                  onClick={() => { setReverseVialMg(20); setReverseVolMl(100); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-bold cursor-pointer"
                >
                  Vasopresina 20U / 100ml
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-cyan-400 tracking-wider block border-b border-slate-800 pb-2">
              Dosis Real Recibida por el Paciente
            </span>

            <div className="space-y-3">
              <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dosis Ponderal Estándar</span>
                  <div className="text-3xl font-black text-cyan-300 font-mono">
                    {revMcgKgMin} <span className="text-sm text-slate-300 font-sans">µg/kg/min</span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400">
                  Total/hora: <strong className="text-white block font-mono">{revTotalMcgHr.toFixed(0)} µg/h</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dosis Absoluta (sin peso)</span>
                  <div className="text-xl font-bold text-white font-mono">{revMcgMin} µg/min</div>
                </div>

                <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dosis en mg/kg/h</span>
                  <div className="text-xl font-bold text-white font-mono">{revMgKgHr} mg/kg/h</div>
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Concentración del preparado:</span>
                <p className="font-mono text-cyan-300">
                  {revConcMcgMl.toFixed(1)} µg/ml ({((reverseVialMg / reverseVolMl)).toFixed(3)} mg/ml)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: DRIP RATE / CONSTANT K */}
      {calcMode === 'drip' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-emerald-400" />
              Calculadora de Goteo y Constante de Infusión
            </h4>
            <p className="text-xs text-slate-400">
              Cálculo de flujo para venoclisis manual (cuando no se dispone de bomba de infusión).
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Volumen Total (ml)</label>
                  <CleanNumberInput
                    min={10}
                    max={5000}
                    step={50}
                    value={dripVolumeMl}
                    onChange={setDripVolumeMl}
                    suffix="ml"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">Tiempo de Paso (Horas)</label>
                  <CleanNumberInput
                    min={0.5}
                    max={48}
                    step={0.5}
                    value={dripHours}
                    onChange={setDripHours}
                    suffix="horas"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Tipo de Equipo / Factor Goteo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDripFactor(20)}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      dripFactor === 20
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Macrogotero (20 gts/ml)
                    <span className="block text-[9px] font-normal opacity-80">Adultos y Reanimación</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDripFactor(60)}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all cursor-pointer ${
                      dripFactor === 60
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Microgotero (60 microgts/ml)
                    <span className="block text-[9px] font-normal opacity-80">Pediatría / UCI (1 ml/h = 1 µgt/min)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <span className="text-xs font-black uppercase text-emerald-400 tracking-wider block border-b border-slate-800 pb-2">
              Resultados de Flujo de Goteo
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gotas por Minuto</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {dropsPerMinute} <span className="text-sm font-sans font-bold text-slate-300">gts/min</span>
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  ≈ {(dropsPerMinute / 4).toFixed(0)} gotas cada 15 segundos
                </span>
              </div>

              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Flujo Horario</span>
                <div className="text-3xl font-black text-cyan-300 font-mono">
                  {dripMlHr} <span className="text-sm font-sans font-bold text-slate-300">ml/h</span>
                </div>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Volumen: {dripVolumeMl} ml en {dripHours} h
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Regla Mnemotécnica Rápida:</span>
              <p className="text-[11px] text-emerald-300">
                • Con <strong>Microgotero (60 gts/ml)</strong>: Los <strong>ml/hora</strong> son exactamente iguales a las <strong>microgotas/minuto</strong>.
              </p>
              <p className="text-[11px] text-slate-400">
                • Con <strong>Macrogotero (20 gts/ml)</strong>: Gotas/min = ml/hora ÷ 3.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODE 4: FULL CLINICAL PEARLS & PREPARATION COMPENDIUM */}
      {calcMode === 'pearls' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <h4 className="text-sm font-black text-white">Compendio de Perlas Clínicas: Solución, pH y Estabilidad</h4>
              </div>
              <input
                type="text"
                placeholder="Buscar fármaco o solución..."
                value={pearlSearch}
                onChange={(e) => setPearlSearch(e.target.value)}
                className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-amber-300 placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-xs text-slate-400">
              Guía anestésica y de terapia intensiva sobre qué solución emplear para diluir cada fármaco vasoactivo o sedoanalgésico, el fundamento farmacológico de la elección y las precauciones críticas de compatibilidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {filteredPearls.map((drug) => (
                <div
                  key={drug.id}
                  className="bg-slate-950/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h5 className="text-sm font-black text-white flex items-center gap-1.5">
                        <span>{drug.name}</span>
                      </h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Dosis habitual: {drug.defaultDose} {drug.defaultDoseUnit} (rango {drug.minDose}-{drug.maxDose})
                      </span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900 text-amber-300 font-bold border border-amber-500/20 uppercase">
                      {drug.category}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase block">🧪 Solución Indicada:</span>
                      <p className="text-white font-semibold text-[11px]">{drug.recommendedSolution || 'D5W o SSN 0.9%'}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase block">💡 Razón Farmacológica:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{drug.solutionReason || 'Preserva estabilidad fisicoquímica.'}</p>
                    </div>

                    {drug.compatibilityNotes && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">🔗 Compatibilidad en Y / Incompatibilidad:</span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{drug.compatibilityNotes}</p>
                      </div>
                    )}

                    {drug.cautionAlert && (
                      <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-2.5 text-rose-200 text-[11px] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{drug.cautionAlert}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

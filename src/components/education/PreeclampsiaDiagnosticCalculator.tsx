import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Stethoscope, 
  Zap, 
  Brain, 
  Heart, 
  Droplets, 
  Pill, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Info,
  ShieldCheck,
  Flame,
  HelpCircle,
  TrendingUp,
  FileText,
  Copy,
  Share2
} from 'lucide-react';
import { recordCalculatorUsage } from '../../lib/statsService';

export interface DiagnosticInputState {
  gestationalAgeWeeks: number | '';
  systolicBP: number | '';
  diastolicBP: number | '';
  bpMeasurementConfirmed: boolean; // 2 tomas con al menos 4h de diferencia o 15 min en severa
  // Proteinuria & Renal
  hasProteinuria24h: boolean;
  proteinuria24hMg: number | '';
  proteinCreatinineRatio: number | ''; // IPC mg/mg
  dipstickProtein: '0' | 'trazas' | '1+' | '2+' | '3+' | '4+';
  creatinineMgDl: number | '';
  uricAcidMgDl: number | '';
  oliguriaPresent: boolean;
  // Hematology
  plateletsCount: number | ''; // /mm3
  schistocytesPresent: boolean;
  ldhU_L: number | '';
  totalBilirubinMgDl: number | '';
  // Hepatic
  astU_L: number | '';
  altU_L: number | '';
  severeEpigastricPain: boolean; // dolor CSD / epigastralgia intratable
  // Neurological & Sensory
  severeHeadache: boolean;
  visualDisturbances: boolean; // fotopsias, escotomas, amaurosis
  markedHyperreflexiaClonus: boolean;
  convulsionsPresent: boolean; // Eclampsia
  focalNeurologicDeficit: boolean; // PRES / ACV
  // Pulmonary
  pulmonaryEdema: boolean;
  // Fetal / Placental
  uterineHypertoniaBleeding: boolean; // Sospecha DPPNI
  hepaticRuptureSigns: boolean; // Sospecha rotura hepática (dolor Kehr + shock)
  severeIUGRorAbnormalDoppler: boolean;
}

const initialDiagnosticState: DiagnosticInputState = {
  gestationalAgeWeeks: 34,
  systolicBP: 150,
  diastolicBP: 95,
  bpMeasurementConfirmed: true,
  hasProteinuria24h: false,
  proteinuria24hMg: 350,
  proteinCreatinineRatio: 0.35,
  dipstickProtein: '2+',
  creatinineMgDl: 0.8,
  uricAcidMgDl: 5.8,
  oliguriaPresent: false,
  plateletsCount: 140000,
  schistocytesPresent: false,
  ldhU_L: 320,
  totalBilirubinMgDl: 0.7,
  astU_L: 35,
  altU_L: 30,
  severeEpigastricPain: false,
  severeHeadache: false,
  visualDisturbances: false,
  markedHyperreflexiaClonus: false,
  convulsionsPresent: false,
  focalNeurologicDeficit: false,
  pulmonaryEdema: false,
  uterineHypertoniaBleeding: false,
  hepaticRuptureSigns: false,
  severeIUGRorAbnormalDoppler: false,
};

export const PreeclampsiaDiagnosticCalculator: React.FC = () => {
  const [data, setData] = useState<DiagnosticInputState>(initialDiagnosticState);
  const [activeCasePreset, setActiveCasePreset] = useState<string>('preset_no_severa');
  const [showAdvancedLabs, setShowAdvancedLabs] = useState<boolean>(true);

  // Quick MAP
  const pam = useMemo(() => {
    const sBP = Number(data.systolicBP) || 0;
    const dBP = Number(data.diastolicBP) || 0;
    return Math.round((sBP + 2 * dBP) / 3);
  }, [data.systolicBP, data.diastolicBP]);

  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Record initial view in admin stats (throttled by session)
  useEffect(() => {
    try {
      const lastLogged = sessionStorage.getItem('anestesiapro_calc_preeclampsia_logged');
      if (!lastLogged) {
        sessionStorage.setItem('anestesiapro_calc_preeclampsia_logged', 'true');
        recordCalculatorUsage('preeclampsia');
      }
    } catch {}
  }, []);

  // Classification Logic based on ACOG 2020/2023 & FIGO 2021 guidelines
  const diagnosisResult = useMemo(() => {
    const sBP = Number(data.systolicBP) || 0;
    const dBP = Number(data.diastolicBP) || 0;
    const eg = Number(data.gestationalAgeWeeks) || 0;
    const ipc = Number(data.proteinCreatinineRatio) || 0;
    const prot24 = Number(data.proteinuria24hMg) || 0;
    const creat = Number(data.creatinineMgDl) || 0;
    const uric = Number(data.uricAcidMgDl) || 0;
    const plt = typeof data.plateletsCount === 'number' ? data.plateletsCount : (data.plateletsCount === '' ? 150000 : Number(data.plateletsCount));
    const ast = Number(data.astU_L) || 0;
    const alt = Number(data.altU_L) || 0;
    const ldh = Number(data.ldhU_L) || 0;
    const bili = Number(data.totalBilirubinMgDl) || 0;

    const isHypertensive = sBP >= 140 || dBP >= 90;
    const isSevereHypertension = sBP >= 160 || dBP >= 110;
    
    // Proteinuria criteria (IPC >= 0.3 or 24h >= 300mg or dipstick >= 2+)
    const hasSignificantProteinuria = 
      ipc >= 0.3 || 
      prot24 >= 300 || 
      data.dipstickProtein === '2+' || 
      data.dipstickProtein === '3+' || 
      data.dipstickProtein === '4+';

    // Organ dysfunction criteria (ACOG: Preeclampsia without proteinuria if organ damage)
    const severeCriteriaList: string[] = [];

    if (isSevereHypertension) {
      severeCriteriaList.push(`Crisis Hipertensiva Severa: PAS ${sBP} y/o PAD ${dBP} mmHg`);
    }
    if (plt < 100000) {
      severeCriteriaList.push(`Trombocitopenia Severa: ${plt.toLocaleString()} /mm³ (< 100,000)`);
    }
    if (creat > 1.1) {
      severeCriteriaList.push(`Injuria Renal: Creatinina ${creat} mg/dL (> 1.1 mg/dL)`);
    }
    if (ast > 70 || alt > 70) {
      severeCriteriaList.push(`Disfunción Hepática Enzimática: AST ${ast} U/L o ALT ${alt} U/L (> 2x LSN)`);
    }
    if (data.severeEpigastricPain) {
      severeCriteriaList.push('Epigastralgia Severa o Dolor en Hipocondrio Derecho intratable (necrosis/isquemia periportal)');
    }
    if (data.pulmonaryEdema) {
      severeCriteriaList.push('Edema Agudo de Pulmón (EAP)');
    }
    if (data.severeHeadache) {
      severeCriteriaList.push('Cefalea Severa persistente refractaria a analgésicos');
    }
    if (data.visualDisturbances) {
      severeCriteriaList.push('Alteraciones Visuales (escotomas, visión borrosa, fotopsias)');
    }
    if (data.markedHyperreflexiaClonus) {
      severeCriteriaList.push('Hiperreflexia Patelar Grado 4+ con Clonus inagotable (irritabilidad cortical)');
    }

    // Complications Check
    const complications: string[] = [];

    // 1. Eclampsia
    if (data.convulsionsPresent) {
      complications.push('ECLAMPSIA: Convulsiones tónico-clónicas generalizadas activas o recientes.');
    }

    // 2. HELLP Syndrome
    const hasHemolysis = ldh > 600 || data.schistocytesPresent || bili >= 1.2;
    const hasLiverEnzymes = ast >= 70 || alt >= 70;
    const hasLowPlatelets = plt < 100000;

    let hellpClass: string | null = null;
    if (hasHemolysis && hasLiverEnzymes && hasLowPlatelets) {
      if (plt < 50000) {
        hellpClass = 'SÍNDROME HELLP CLASE 1 MISSISSIPPI (Plaquetas < 50,000 /mm³ - RIESGO VITAL MÁXIMO)';
      } else if (plt <= 100000) {
        hellpClass = 'SÍNDROME HELLP CLASE 2 MISSISSIPPI (Plaquetas 50,000 - 100,000 /mm³)';
      } else {
        hellpClass = 'SÍNDROME HELLP CLASE 3 MISSISSIPPI (Plaquetas 100,000 - 150,000 /mm³)';
      }
      complications.push(hellpClass);
    } else if ((hasHemolysis && hasLowPlatelets) || (hasLiverEnzymes && hasLowPlatelets)) {
      complications.push('SÍNDROME HELLP PARCIAL / INCOMPLETO (Microangiopatía trombótica en curso)');
    }

    // 3. Edema Agudo de Pulmón
    if (data.pulmonaryEdema) {
      complications.push('EDEMA AGUDO DE PULMÓN: Disnea crítica con estertores e hipoxemia (primera causa de muerte evitable).');
    }

    // 4. Rotura o Hematoma Subcapsular Hepático
    if (data.hepaticRuptureSigns) {
      complications.push('SOSPECHA DE ROTURA / HEMATOMA HEPÁTICO: Dolor CSD irradiado a hombro (signo de Kehr) + Shock hipovolémico.');
    }

    // 5. DPPNI
    if (data.uterineHypertoniaBleeding) {
      complications.push('DESPRENDIMIENTO PREMATURO DE PLACENTA (DPPNI): Útero leñoso doloroso, sangrado oscuro y riesgo inminente de CID.');
    }

    // 6. PRES / ACV
    if (data.focalNeurologicDeficit) {
      complications.push('SÍNDROME PRES / ACV HEMORRÁGICO: Encefalopatía vasogénica posterior o déficit focal por hiperperfusión cerebral.');
    }

    // Synthesize Final Diagnostic Category
    let category: 'NORMAL_O_HTA_SIMPLE' | 'PREECLAMPSIA_NO_SEVERA' | 'PREECLAMPSIA_SEVERA' | 'COMPLICACION_CRITICA';
    let title: string;
    let color: string;
    let bgColor: string;
    let borderColor: string;

    if (complications.length > 0) {
      category = 'COMPLICACION_CRITICA';
      title = '🚨 EMERGENCIA OBSTÉTRICA / COMPLICACIÓN CRÍTICA INSTAURADA';
      color = 'text-rose-400';
      bgColor = 'bg-rose-950/80';
      borderColor = 'border-rose-500';
    } else if (isHypertensive && severeCriteriaList.length > 0) {
      category = 'PREECLAMPSIA_SEVERA';
      title = '⚠️ PREECLAMPSIA CON CRITERIOS DE SEVERIDAD (ACOG / FIGO)';
      color = 'text-orange-400';
      bgColor = 'bg-orange-950/70';
      borderColor = 'border-orange-500';
    } else if (isHypertensive && hasSignificantProteinuria) {
      category = 'PREECLAMPSIA_NO_SEVERA';
      title = '🟡 PREECLAMPSIA SIN CRITERIOS DE SEVERIDAD ("LEVE")';
      color = 'text-amber-400';
      bgColor = 'bg-amber-950/70';
      borderColor = 'border-amber-500';
    } else if (isHypertensive && !hasSignificantProteinuria && severeCriteriaList.length === 0) {
      category = 'NORMAL_O_HTA_SIMPLE';
      title = eg < 20 ? '🔵 HIPERTENSIÓN CRÓNICA (Inicio < 20 semanas)' : '🔵 HIPERTENSIÓN GESTACIONAL (Sin Criterios de Preeclampsia)';
      color = 'text-cyan-400';
      bgColor = 'bg-slate-900/90';
      borderColor = 'border-cyan-500';
    } else {
      category = 'NORMAL_O_HTA_SIMPLE';
      title = '🟢 GESTACIÓN NORMOTENSA (Sin Preeclampsia)';
      color = 'text-emerald-400';
      bgColor = 'bg-emerald-950/40';
      borderColor = 'border-emerald-600';
    }

    // Anesthetic safety verdict based on platelets
    let neuroaxialSafety: {
      status: 'SEGURO' | 'PRECAUCION' | 'CONTRAINDICADO';
      text: string;
      color: string;
      bg: string;
    };

    if (plt >= 80000) {
      neuroaxialSafety = {
        status: 'SEGURO',
        text: `Plaquetas en ${plt.toLocaleString()} /mm³: Anestesia Espinal recomendada y segura (Consenso SOAP 2021). Usar aguja punta de lápiz (25G-27G).`,
        color: 'text-emerald-300',
        bg: 'bg-emerald-950/50 border-emerald-800'
      };
    } else if (plt >= 50000) {
      neuroaxialSafety = {
        status: 'PRECAUCION',
        text: `Plaquetas en ${plt.toLocaleString()} /mm³: Zona gris (50,000 - 79,000 /mm³). Anestesia espinal de punción única posible si coagulograma normal y frotis sin CID. Evitar catéter epidural.`,
        color: 'text-amber-300',
        bg: 'bg-amber-950/50 border-amber-800'
      };
    } else {
      neuroaxialSafety = {
        status: 'CONTRAINDICADO',
        text: `Plaquetas en ${plt.toLocaleString()} /mm³ (< 50,000): CONTRAINDICACIÓN FORMAL de técnica neuroaxial por riesgo de hematoma espinal. Requiere Anestesia General y transfusión de plaquetas antes de la incisión.`,
        color: 'text-rose-300',
        bg: 'bg-rose-950/60 border-rose-600'
      };
    }

    // Uric Acid Analysis
    let uricAcidVerdict = '';
    if (uric >= 7.0) {
      uricAcidVerdict = `Ácido Úrico en ${uric} mg/dL (> 7.0): Marcador de endoteliosis glomerular severa, intensa hipovolemia intravascular efectiva y alta correlación con morbilidad fetal y HELLP.`;
    } else if (uric >= 5.5) {
      uricAcidVerdict = `Ácido Úrico en ${uric} mg/dL (5.5 - 6.9): Anormal para el embarazo. Refleja aumento de la reabsorción proximal por transportador URAT1 y daño placentario.`;
    } else {
      uricAcidVerdict = `Ácido Úrico en ${uric} mg/dL: En rango fisiológico gestacional (< 5.5 mg/dL).`;
    }

    return {
      category,
      title,
      color,
      bgColor,
      borderColor,
      isSevereHypertension,
      severeCriteriaList,
      complications,
      hasSignificantProteinuria,
      neuroaxialSafety,
      uricAcidVerdict,
      pam
    };
  }, [data, pam]);

  // CLINICAL REPORT GENERATOR FOR CLIPBOARD & WHATSAPP
  const generateClinicalReportText = () => {
    const sBP = Number(data.systolicBP) || 0;
    const dBP = Number(data.diastolicBP) || 0;
    const eg = Number(data.gestationalAgeWeeks) || 0;
    const plt = typeof data.plateletsCount === 'number' ? data.plateletsCount : (data.plateletsCount === '' ? 150000 : Number(data.plateletsCount));
    const ipc = Number(data.proteinCreatinineRatio) || 0;
    const prot24 = Number(data.proteinuria24hMg) || 0;
    const creat = Number(data.creatinineMgDl) || 0;
    const uric = Number(data.uricAcidMgDl) || 0;
    const ast = Number(data.astU_L) || 0;
    const ldh = Number(data.ldhU_L) || 0;
    const isCrisis = sBP >= 160 || dBP >= 110;

    let text = `[EVALUACIÓN Y CONDUCTA: PREECLAMPSIA / ECLAMPSIA - ANESTESIAPRO]\n`;
    text += `Fecha/Hora: ${new Date().toLocaleString()}\n`;
    text += `• Paciente Obstétrica: EG ${eg} semanas\n`;
    text += `• Signos Vitales: PAS ${sBP} / PAD ${dBP} mmHg | PAM ${pam} mmHg ${isCrisis ? '🚨 (CRISIS HIPERTENSIVA SEVERA)' : sBP >= 140 || dBP >= 90 ? '⚠️ (HTA GESTACIONAL)' : '✅ (Normotensa)'}\n`;
    text += `• Diagnóstico: ${diagnosisResult.title}\n`;

    if (diagnosisResult.severeCriteriaList.length > 0) {
      text += `• Criterios de Severidad: ${diagnosisResult.severeCriteriaList.join('; ')}\n`;
    }
    if (diagnosisResult.complications.length > 0) {
      text += `• Complicaciones Críticas: ${diagnosisResult.complications.join('; ')}\n`;
    }

    text += `\n[PARACLÍNICOS CLAVE]\n`;
    text += `• Plaquetas: ${plt.toLocaleString()} /mm³ [${diagnosisResult.neuroaxialSafety.status}: ${diagnosisResult.neuroaxialSafety.text.split('.')[0]}]\n`;
    text += `• Proteinuria / IPC: ${ipc > 0 ? `${ipc} mg/mg (Patológico ≥0.3)` : prot24 > 0 ? `${prot24} mg/24h` : 'No valorado'}\n`;
    text += `• Función Renal: Creatinina ${creat} mg/dL | Ácido Úrico ${uric} mg/dL\n`;
    text += `• Enzimas / Lisis: AST ${ast} U/L | LDH ${ldh} U/L\n`;

    text += `\n[PLAN DE MANEJO Y CONDUCTA INMEDIATA]\n`;
    if (isCrisis) {
      text += `• CRISIS HIPERTENSIVA (Tratamiento <15 min): Labetalol 20mg IV bolo (duplicar c/10-20 min a 40-80mg, máx 300mg) o Hidralazina 5-10mg IV lento (c/20 min, máx 20mg) o Nifedipino 10mg VO. Meta: PAS 140-150 / PAD 90-100 mmHg.\n`;
    }
    text += `• NEUROPROTECCIÓN: Sulfato de Magnesio (MgSO4) Esquema Zuspan: Bolo 4g IV en 15-20 min + Infusión 1 g/h continuo. Antídoto: Gluconato de Calcio 10% (1g IV en 3 min).\n`;
    text += `• RESTRICCIÓN HÍDRICA: Líquidos totales 60-80 mL/h estrictos (incluyendo infusiones farmacológicas) para evitar EAP.\n`;
    text += `• TÉCNICA ANESTÉSICA: ${diagnosisResult.neuroaxialSafety.text}\n`;
    text += `Evaluado por AnestesiaPro (Dr. Carlos Leal).`;

    return text;
  };

  const handleCopyReport = () => {
    const text = generateClinicalReportText();
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    recordCalculatorUsage('preeclampsia');
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = generateClinicalReportText();
    recordCalculatorUsage('preeclampsia');
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Helper for Presets
  const applyPreset = (presetKey: string) => {
    setActiveCasePreset(presetKey);
    switch (presetKey) {
      case 'preset_hta_simple':
        setData({
          ...initialDiagnosticState,
          systolicBP: 144,
          diastolicBP: 92,
          proteinuria24hMg: 150,
          proteinCreatinineRatio: 0.15,
          dipstickProtein: 'trazas',
          creatinineMgDl: 0.6,
          uricAcidMgDl: 4.2,
          plateletsCount: 210000,
          astU_L: 24,
          altU_L: 20,
          ldhU_L: 240,
          severeHeadache: false,
          visualDisturbances: false,
          severeEpigastricPain: false,
          pulmonaryEdema: false,
          convulsionsPresent: false,
          schistocytesPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      case 'preset_no_severa':
        setData({
          ...initialDiagnosticState,
          systolicBP: 148,
          diastolicBP: 94,
          proteinuria24hMg: 420,
          proteinCreatinineRatio: 0.45,
          dipstickProtein: '2+',
          creatinineMgDl: 0.8,
          uricAcidMgDl: 5.9,
          plateletsCount: 165000,
          astU_L: 32,
          altU_L: 28,
          ldhU_L: 310,
          severeHeadache: false,
          visualDisturbances: false,
          severeEpigastricPain: false,
          pulmonaryEdema: false,
          convulsionsPresent: false,
          schistocytesPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      case 'preset_severa_crisis':
        setData({
          ...initialDiagnosticState,
          systolicBP: 175,
          diastolicBP: 112,
          proteinuria24hMg: 850,
          proteinCreatinineRatio: 0.85,
          dipstickProtein: '3+',
          creatinineMgDl: 1.25,
          uricAcidMgDl: 7.6,
          plateletsCount: 92000,
          astU_L: 85,
          altU_L: 78,
          ldhU_L: 480,
          severeHeadache: true,
          visualDisturbances: true,
          markedHyperreflexiaClonus: true,
          severeEpigastricPain: false,
          pulmonaryEdema: false,
          convulsionsPresent: false,
          schistocytesPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      case 'preset_hellp':
        setData({
          ...initialDiagnosticState,
          systolicBP: 165,
          diastolicBP: 105,
          proteinuria24hMg: 600,
          proteinCreatinineRatio: 0.6,
          dipstickProtein: '3+',
          creatinineMgDl: 1.3,
          uricAcidMgDl: 8.2,
          plateletsCount: 42000, // < 50k Mississippi Clase 1
          schistocytesPresent: true, // Frotis patognomónico
          ldhU_L: 950, // > 600
          totalBilirubinMgDl: 2.1, // >= 1.2
          astU_L: 180, // > 70
          altU_L: 145,
          severeEpigastricPain: true, // Dolor CSD intenso
          severeHeadache: true,
          visualDisturbances: false,
          markedHyperreflexiaClonus: true,
          pulmonaryEdema: false,
          convulsionsPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      case 'preset_eclampsia':
        setData({
          ...initialDiagnosticState,
          systolicBP: 180,
          diastolicBP: 118,
          proteinuria24hMg: 1200,
          proteinCreatinineRatio: 1.2,
          dipstickProtein: '4+',
          creatinineMgDl: 1.4,
          uricAcidMgDl: 8.8,
          plateletsCount: 78000,
          astU_L: 95,
          altU_L: 80,
          ldhU_L: 620,
          severeHeadache: true,
          visualDisturbances: true,
          markedHyperreflexiaClonus: true,
          convulsionsPresent: true, // Eclampsia activa
          focalNeurologicDeficit: false,
          severeEpigastricPain: true,
          pulmonaryEdema: false,
          schistocytesPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      case 'preset_edema_pulmon':
        setData({
          ...initialDiagnosticState,
          systolicBP: 190,
          diastolicBP: 120,
          proteinuria24hMg: 900,
          proteinCreatinineRatio: 0.9,
          dipstickProtein: '3+',
          creatinineMgDl: 1.5,
          uricAcidMgDl: 7.9,
          plateletsCount: 110000,
          astU_L: 60,
          altU_L: 55,
          ldhU_L: 510,
          pulmonaryEdema: true, // EAP
          severeHeadache: true,
          visualDisturbances: false,
          convulsionsPresent: false,
          severeEpigastricPain: false,
          schistocytesPresent: false,
          uterineHypertoniaBleeding: false,
          hepaticRuptureSigns: false
        });
        break;
      default:
        setData(initialDiagnosticState);
        break;
    }
  };

  return (
    <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* HEADER CALCULADORA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              Calculadora Diagnóstica &amp; Estratificador Integral de Preeclampsia
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Algoritmo ACOG / FIGO / NICE 2026: Diagnóstico de preeclampsia (con o sin proteinuria), grado de severidad, detección de complicaciones críticas y conducta anestésica inmediata.
          </p>
        </div>

        {/* ACCIONES DEL REPORTE & RESET */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyReport}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Copiar reporte al portapapeles"
          >
            {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copiedReport ? '¡Reporte Copiado!' : 'Copiar Reporte'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            title="Compartir por WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir WhatsApp</span>
          </button>

          <button
            onClick={() => applyPreset('preset_no_severa')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>
        </div>
      </div>

      {/* BOTONES DE CASOS CLÍNICOS RÁPIDOS PRECARGADOS */}
      <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Cargar Casos Clínicos Rápidos de Prueba:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'preset_hta_simple', label: '1. HTA Gestacional Simple', color: 'border-cyan-700/60 text-cyan-300' },
            { id: 'preset_no_severa', label: '2. Preeclampsia Sin Severidad ("Leve")', color: 'border-amber-700/60 text-amber-300' },
            { id: 'preset_severa_crisis', label: '3. Preeclampsia Severa en Crisis', color: 'border-orange-700/60 text-orange-300' },
            { id: 'preset_hellp', label: '4. Síndrome HELLP Completo', color: 'border-indigo-700/60 text-indigo-300' },
            { id: 'preset_eclampsia', label: '5. Eclampsia Activa', color: 'border-rose-700/60 text-rose-300' },
            { id: 'preset_edema_pulmon', label: '6. Edema Agudo de Pulmón', color: 'border-red-700/60 text-red-300' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${preset.color} ${
                activeCasePreset === preset.id
                  ? 'bg-slate-800 ring-2 ring-cyan-400 font-black scale-105'
                  : 'bg-slate-900/90 hover:bg-slate-800/80'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* FORMULARIO DE ENTRADA: 4 COLUMNAS MODULARES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* BLOQUE 1: DATOS HEMODINÁMICOS */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-rose-400 uppercase tracking-wide flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              1. Tensión Arterial
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-black ${pam >= 125 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'}`}>
              PAM: {pam} mmHg
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Presión Sistólica (PAS)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="80"
                  max="260"
                  step="1"
                  value={data.systolicBP}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, systolicBP: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">mmHg</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Presión Diastólica (PAD)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="40"
                  max="160"
                  step="1"
                  value={data.diastolicBP}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, diastolicBP: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">mmHg</span>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Edad Gestacional (EG)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="43"
                  step="1"
                  value={data.gestationalAgeWeeks}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, gestationalAgeWeeks: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">sem</span>
              </div>
              {Number(data.gestationalAgeWeeks) > 0 && Number(data.gestationalAgeWeeks) < 20 && (
                <p className="text-[10px] text-amber-400 mt-1">
                  ⚠️ &lt; 20 semanas: Descartar HTA crónica previa o enfermedad trofoblástica gestacional.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* BLOQUE 2: PROTEINURIA & FUNCIÓN RENAL */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
              <Droplets className="w-4 h-4" />
              2. Riñón &amp; Proteinuria
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Índice Proteína / Creatinina (IPC)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.0"
                  max="10.0"
                  step="0.05"
                  value={data.proteinCreatinineRatio}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, proteinCreatinineRatio: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">mg/mg</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Patológico si ≥ 0.30</p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Creatinina Sérica
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0.3"
                  max="6.0"
                  step="0.05"
                  value={data.creatinineMgDl}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, creatinineMgDl: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">mg/dL</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">&gt; 1.1 mg/dL = Criterio Severidad</p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Ácido Úrico Sérico
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="2.0"
                  max="15.0"
                  step="0.1"
                  value={data.uricAcidMgDl}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, uricAcidMgDl: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0.0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">mg/dL</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">&gt; 5.5 = Anormal; &gt; 7.0 = Crítico</p>
            </div>
          </div>
        </div>

        {/* BLOQUE 3: HEMATOLOGÍA & ENZIMAS HEPÁTICAS */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-indigo-400 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              3. Hematología &amp; Hígado
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                Plaquetas Totales
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10000"
                  max="600000"
                  step="5000"
                  value={data.plateletsCount}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, plateletsCount: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">/mm³</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">&lt; 100k = Severo; &lt; 50k = HELLP 1</p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                AST / TGO o ALT / TGP
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="2000"
                  step="5"
                  value={data.astU_L}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, astU_L: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">U/L</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">&gt; 70 U/L (&gt; 2x LSN) = Criterio</p>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-bold block mb-1">
                LDH (Lactato Deshidrogenasa)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="100"
                  max="5000"
                  step="20"
                  value={data.ldhU_L}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setData({ ...data, ldhU_L: e.target.value === '' ? '' : Number(e.target.value) })}
                  placeholder="0"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-white text-sm focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-500 font-mono">U/L</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">&gt; 600 U/L = Hemólisis HELLP</p>
            </div>
          </div>
        </div>

        {/* BLOQUE 4: SÍNTOMAS CLÍNICOS & ALARMAS (CHECKBOXES) */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              4. Síntomas &amp; Órgano Diana
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.severeHeadache}
                onChange={(e) => setData({ ...data, severeHeadache: e.target.checked })}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <span>Cefalea severa persistente</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.visualDisturbances}
                onChange={(e) => setData({ ...data, visualDisturbances: e.target.checked })}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <span>Alteraciones visuales (escotomas)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.severeEpigastricPain}
                onChange={(e) => setData({ ...data, severeEpigastricPain: e.target.checked })}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <span>Epigastralgia / Dolor CSD severo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.markedHyperreflexiaClonus}
                onChange={(e) => setData({ ...data, markedHyperreflexiaClonus: e.target.checked })}
                className="rounded accent-rose-500 w-4 h-4"
              />
              <span>Hiperreflexia patelar 4+ con clonus</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.schistocytesPresent}
                onChange={(e) => setData({ ...data, schistocytesPresent: e.target.checked })}
                className="rounded accent-indigo-500 w-4 h-4"
              />
              <span>Esquistocitos en frotis</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.pulmonaryEdema}
                onChange={(e) => setData({ ...data, pulmonaryEdema: e.target.checked })}
                className="rounded accent-red-600 w-4 h-4"
              />
              <span className="text-red-300 font-bold">Edema Pulmonar (Disnea/SpO2&lt;90)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.convulsionsPresent}
                onChange={(e) => setData({ ...data, convulsionsPresent: e.target.checked })}
                className="rounded accent-rose-600 w-4 h-4"
              />
              <span className="text-rose-400 font-black">🚨 Convulsión (Eclampsia)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.uterineHypertoniaBleeding}
                onChange={(e) => setData({ ...data, uterineHypertoniaBleeding: e.target.checked })}
                className="rounded accent-red-600 w-4 h-4"
              />
              <span className="text-red-300">Útero leñoso / Sangrado (DPPNI)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={data.hepaticRuptureSigns}
                onChange={(e) => setData({ ...data, hepaticRuptureSigns: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4"
              />
              <span className="text-amber-300">Signo Kehr / Rotura hepática</span>
            </label>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* VEREDICTO DIAGNÓSTICO MAESTRO RESULTANTE */}
      {/* ========================================================= */}
      <div className={`p-5 sm:p-6 rounded-3xl border-2 shadow-2xl transition-all ${diagnosisResult.bgColor} ${diagnosisResult.borderColor}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xl sm:text-2xl font-black ${diagnosisResult.color}`}>
                {diagnosisResult.title}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              Estratificación dinámica conforme a criterios ACOG 2023 / FIGO 2021 / SOAP 2026
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Tensión Media:</span>
            <span className="text-sm font-mono font-black text-white px-2.5 py-1 bg-black/40 rounded-xl border border-white/10">
              PAM {diagnosisResult.pam} mmHg
            </span>
          </div>
        </div>

        {/* DETALLE DE CRITERIOS DETECTADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* COLUMNA IZQUIERDA: HALLAZGOS Y SEVERIDAD */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                1. Hallazgos que Definen la Severidad / Diagnóstico:
              </h4>

              {diagnosisResult.severeCriteriaList.length === 0 && diagnosisResult.complications.length === 0 ? (
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
                  {diagnosisResult.hasSignificantProteinuria ? (
                    <p className="text-amber-300 font-medium">
                      • Hipertensión gestacional + Proteinuria significativa (IPC ≥ 0.3 o ≥ 300mg/24h).
                      <br />
                      • <strong>Sin criterios de severidad:</strong> Función renal, enzimas hepáticas y plaquetas dentro de parámetros normales, sin sintomatología neurológica ni compromiso multiorgánico.
                    </p>
                  ) : (
                    <p className="text-emerald-300">
                      • No se evidencian criterios de severidad ni proteinuria patológica.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {diagnosisResult.severeCriteriaList.map((crit, idx) => (
                    <div key={idx} className="p-2.5 bg-black/40 rounded-xl border border-white/10 text-xs font-semibold flex items-center gap-2 text-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SI HAY COMPLICACIONES CRÍTICAS */}
            {diagnosisResult.complications.length > 0 && (
              <div className="p-3.5 bg-rose-950/90 rounded-2xl border border-rose-500/80 space-y-2">
                <span className="text-xs font-black text-rose-300 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Complicaciones Mayores Activas:
                </span>
                <div className="space-y-1.5">
                  {diagnosisResult.complications.map((comp, idx) => (
                    <p key={idx} className="text-xs text-white font-bold bg-rose-900/60 p-2 rounded-lg border border-rose-700/50">
                      {comp}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* EVALUACIÓN DE ÁCIDO ÚRICO */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
              <strong className="text-cyan-300 block">Evaluación de Ácido Úrico:</strong>
              <p>{diagnosisResult.uricAcidVerdict}</p>
            </div>
          </div>

          {/* COLUMNA DERECHA: CONDUCTA CLÍNICA Y ANESTÉSICA INMEDIATA */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
              2. Conducta Clínica y Anestésica Inmediata:
            </h4>

            {/* VEREDICTO NEUROAXIAL SEGÚN PLAQUETAS */}
            <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${diagnosisResult.neuroaxialSafety.bg}`}>
              <div className="flex items-center justify-between">
                <strong className={`font-black uppercase tracking-wide ${diagnosisResult.neuroaxialSafety.color}`}>
                  Seguridad Anestesia Neuroaxial (Espinal/Epidural):
                </strong>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded font-mono ${
                  diagnosisResult.neuroaxialSafety.status === 'SEGURO' ? 'bg-emerald-500 text-slate-950' :
                  diagnosisResult.neuroaxialSafety.status === 'PRECAUCION' ? 'bg-amber-500 text-slate-950' : 'bg-rose-600 text-white'
                }`}>
                  {diagnosisResult.neuroaxialSafety.status}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed font-medium">
                {diagnosisResult.neuroaxialSafety.text}
              </p>
            </div>

            {/* PAUTAS SEGÚN CATEGORÍA */}
            <div className="p-3.5 bg-slate-950/90 rounded-2xl border border-slate-800 text-xs space-y-2 leading-relaxed text-slate-300">
              <strong className="text-white block font-black border-b border-slate-800 pb-1">
                Hoja de Ruta del Manejo:
              </strong>

              {diagnosisResult.category === 'COMPLICACION_CRITICA' && (
                <div className="space-y-1.5 text-rose-200">
                  <p>• <strong>Interrupción Expedita del Embarazo:</strong> Tras estabilización hemodinámica y neuroprotectora materna.</p>
                  <p>• <strong>Sulfato de Magnesio Urgente:</strong> Bolo 4 a 6 g IV en 15–20 min + infusión 1 a 2 g/h para cesar convulsiones o frenar microangiopatía.</p>
                  <p>• <strong>Control Tensional en &lt; 15 min:</strong> Si PAS ≥ 160 o PAD ≥ 110 con Labetalol 20-40-80 mg IV o Hidralazina 5-10 mg IV (cuidado dosis apiladas).</p>
                  <p>• <strong>Restricción Hídrica Estricta:</strong> Total no mayor a 60–80 mL/h (incluyendo todas las infusiones farmacológicas).</p>
                  <p>• <strong>Preparación de Hemoderivados:</strong> Si plaquetas &lt; 50k transfundir concentrado de plaquetas preincisión. Transfusión masiva 1:1:1 si rotura hepática o DPPNI con CID.</p>
                </div>
              )}

              {diagnosisResult.category === 'PREECLAMPSIA_SEVERA' && (
                <div className="space-y-1.5 text-orange-200">
                  <p>• <strong>Hospitalización Inmediata en Sala de Alto Riesgo / UCI Obstétrica.</strong></p>
                  <p>• <strong>Iniciar Sulfato de Magnesio de Inmediato:</strong> Esquema Zuspan (4 g IV bolo en 15-20 min, luego 1 g/h continuo) para prevención primaria de eclampsia.</p>
                  <p>• <strong>Tratamiento Antihipertensivo Agudo:</strong> Titular Labetalol IV o Nifedipino oral si PAS ≥ 160 o PAD ≥ 110. Meta: PAS 140–150 / PAD 90–100.</p>
                  <p>• <strong>Maduración Pulmonar Fetal:</strong> Si &lt; 34 semanas (Betametasona 12 mg IM c/24h x 2 dosis) y evaluar parto si ≥ 34 sem o deterioro materno/fetal.</p>
                  <p>• <strong>Líquidos Restrictivos:</strong> Cristaloides balanceados a 60-80 mL/h.</p>
                </div>
              )}

              {diagnosisResult.category === 'PREECLAMPSIA_NO_SEVERA' && (
                <div className="space-y-1.5 text-amber-200">
                  <p>• <strong>Vigilancia Obstétrica Estrecha:</strong> Hospitalaria o ambulatoria protocolizada con automonitoreo de PA cada 4 horas.</p>
                  <p>• <strong>Monitoreo Paraclínico Bisemanal:</strong> Plaquetas, creatinina, transaminasas y frotis sanguíneo para pesquisar evolución a severidad.</p>
                  <p>• <strong>Educación de Signos de Alarma:</strong> Instruir a la paciente a acudir de inmediato ante cefalea intensa, fotopsias, escotomas o epigastralgia.</p>
                  <p>• <strong>Resolución del Embarazo:</strong> Programar parto a las <strong>37 semanas</strong> de gestación (ACOG / FIGO) o antes si surgen criterios de severidad.</p>
                </div>
              )}

              {diagnosisResult.category === 'NORMAL_O_HTA_SIMPLE' && (
                <div className="space-y-1.5 text-cyan-200">
                  <p>• <strong>Seguimiento de Tensión Arterial:</strong> Descartar progresión hacia preeclampsia en visitas prenatales regulares.</p>
                  <p>• <strong>Laboratorios de Control:</strong> Descartar proteinuria incipiente mediante Índice Proteína/Creatinina (IPC) en orina aislada si hay elevación tensional.</p>
                  <p>• <strong>Prevención Primaria:</strong> Si la paciente tiene factores de alto riesgo de preeclampsia y se detecta antes de semana 16, iniciar Ácido Acetilsalicílico (AAS) 150 mg/noche hasta semana 36.</p>
                </div>
              )}
            </div>

            {/* BARRA INFERIOR DE ACCIÓN: COPIAR Y COMPARTIR REPORTE */}
            <div className="pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white">¿Deseas enviar este caso o anexarlo a la historia clínica?</span>
                <p className="text-[11px] text-slate-400">Genera un reporte conciso listo para WhatsApp, notas médicas o interconsulta.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedReport ? '¡Reporte Copiado!' : 'Copiar Reporte'}</span>
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

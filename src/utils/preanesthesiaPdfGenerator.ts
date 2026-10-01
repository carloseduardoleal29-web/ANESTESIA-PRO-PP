import jsPDF from 'jspdf';
import { PreanesthesiaData } from '../types';
import { evaluateCapriniScore, generateWhatsAppFullPreanesthesiaMessage } from '../data/preanesthesiaCatalog';
import { getActiveLetterhead, isLetterheadConfigured } from '../lib/preanesthesiaStorage';
import { LOGO_SHIELD_BASE64 } from '../lib/logoData';

export interface PreanesthesiaPdfResult {
  doc: jsPDF;
  blob: Blob;
  blobUrl: string;
  fileName: string;
  fullText: string;
}

/**
 * Genera el documento PDF médico legal oficial de la Evaluación Preanestésica.
 * Diseñado con encuadre milimétrico sobre hoja estándar A4 (210 x 297 mm),
 * tipografía optimizada de alta legibilidad, distribución equilibrada sin espacios en blanco excesivos,
 * membrete condicional oficial/personalizado, cálculo EGRI, Caprini y bloque médico legal.
 */
export const generatePreanesthesiaPdfDocument = (
  formData: PreanesthesiaData,
  egriScore: number,
  egriCategory: string
): PreanesthesiaPdfResult => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4' // 210 x 297 mm
  });

  // Membrete institucional: se verifica si el usuario configuró su propio membrete hospitalario
  const activeLetterhead = getActiveLetterhead();
  const isCustom = isLetterheadConfigured();

  let headerTitle: string;
  let headerDept: string;
  let headerSubInfo: string;
  let hospitalLogo = formData.hospitalLogoBase64 !== undefined ? formData.hospitalLogoBase64 : activeLetterhead.hospitalLogoBase64;
  let secondaryLogo = formData.specialistLogoBase64 !== undefined ? formData.specialistLogoBase64 : activeLetterhead.specialistLogoBase64;

  if (isCustom) {
    headerTitle = (formData.hospitalName || activeLetterhead.hospitalName || 'HOSPITAL / CLÍNICA').toUpperCase();
    headerDept = (formData.hospitalDepartment || activeLetterhead.department || 'SERVICIO DE ANESTESIOLOGÍA Y REANIMACIÓN').toUpperCase();
    headerSubInfo = `${formData.hospitalAddress || activeLetterhead.address || ''}${activeLetterhead.cityCountry ? ' • ' + activeLetterhead.cityCountry : ''}${activeLetterhead.phone ? ' • Tel: ' + activeLetterhead.phone : ''}`;
  } else {
    // Membrete Estándar: FORMATO DE EVALUACIÓN PREANESTÉSICA / ANESTESIA PRO / FUNDADOR DR. CARLOS LEAL
    headerTitle = 'FORMATO DE EVALUACIÓN PREANESTÉSICA';
    headerDept = 'ANESTESIA PRO';
    headerSubInfo = 'FUNDADOR DR. CARLOS LEAL • ESPECIALISTA EN ANESTESIOLOGÍA Y REANIMACIÓN';
    if (!hospitalLogo) hospitalLogo = LOGO_SHIELD_BASE64;
    if (!secondaryLogo) secondaryLogo = LOGO_SHIELD_BASE64;
  }

  const themeColor = formData.themeColor || activeLetterhead.themeColor || 'navy';

  const themeColorsMap: Record<string, { primary: [number, number, number]; secondary: [number, number, number]; accent: [number, number, number] }> = {
    navy: { primary: [15, 23, 42], secondary: [30, 58, 138], accent: [147, 197, 253] },
    emerald: { primary: [6, 78, 59], secondary: [4, 120, 87], accent: [167, 243, 208] },
    cyan: { primary: [12, 74, 96], secondary: [14, 116, 144], accent: [165, 243, 252] },
    burgundy: { primary: [136, 19, 55], secondary: [190, 18, 60], accent: [254, 205, 211] },
    indigo: { primary: [49, 46, 129], secondary: [67, 56, 202], accent: [199, 210, 254] },
    slate: { primary: [30, 41, 59], secondary: [51, 65, 85], accent: [203, 213, 225] }
  };

  const currentTheme = themeColorsMap[themeColor] || themeColorsMap.navy;

  // Nombre limpio para archivo: nombre del paciente directamente sin la palabra "Preanestesia"
  const rawName = (formData.nombre || '').trim();
  const cleanName = rawName
    ? rawName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9_\-\s]/g, '')
        .trim()
        .replace(/\s+/g, '_')
    : 'Paciente';

  const fileName = `${cleanName}.pdf`;

  // =========================================================================
  // ENCABEZADO SUPERIOR (BARRA INSTITUCIONAL HOSPITALARIA) - 20 mm
  // =========================================================================
  doc.setFillColor(...currentTheme.primary);
  doc.rect(0, 0, 210, 19.5, 'F');

  // Posicionamiento de Logos
  let textStartX = 10;
  if (hospitalLogo) {
    try {
      doc.addImage(hospitalLogo, 'PNG', 8, 2.5, 14.5, 14.5);
      textStartX = 25.5;
    } catch (e) {
      console.warn('Could not add hospital logo to PDF:', e);
    }
  }

  let textEndX = 200;
  if (secondaryLogo) {
    try {
      doc.addImage(secondaryLogo, 'PNG', 187.5, 2.5, 14.5, 14.5);
      textEndX = 185;
    } catch (e) {
      console.warn('Could not add secondary logo to PDF:', e);
    }
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.2);
  doc.text(headerTitle, textStartX, 7.0);

  doc.setFontSize(8.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(226, 232, 240); // slate-200
  doc.text(headerDept, textStartX, 11.6);

  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(headerSubInfo || 'Documento Médico Legal Confidencial', textStartX, 16.0);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  doc.setTextColor(...currentTheme.accent);
  doc.text(`Fecha: ${formData.fecha || '---'} | Hora: ${formData.hora || '---'}`, textEndX, 11.5, { align: 'right' });

  // =========================================================================
  // FUNCIONES DE DIBUJADO DE ENCABEZADO Y CELDAS
  // =========================================================================
  const addSectionHeader = (title: string, yPos: number, height: number = 4.8) => {
    doc.setFillColor(241, 245, 249); // slate-100
    doc.setDrawColor(203, 213, 225); // slate-300
    doc.setLineWidth(0.3);
    doc.rect(10, yPos - 3.5, 190, height, 'FD');

    // Acento lateral izquierdo con color corporativo
    doc.setFillColor(...currentTheme.secondary);
    doc.rect(10, yPos - 3.5, 2.5, height, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.4);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(title, 14.5, yPos);
  };

  /**
   * Renderiza una celda con etiqueta y valor garantizando que NUNCA se sobreponga
   * ni invada la columna vecina. Aplica auto-escalado y truncamiento seguro con elipsis.
   */
  const renderCell = (
    label: string,
    value: string | number,
    x: number,
    yPos: number,
    cellWidth: number,
    isBoldValue: boolean = false,
    fontSize: number = 8.1
  ) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.setTextColor(30, 41, 59); // slate-800

    const labelStr = label ? `${label}: ` : '';
    const labelW = labelStr ? doc.getTextWidth(labelStr) : 0;
    if (labelStr) {
      doc.text(labelStr, x, yPos);
    }

    doc.setFont('helvetica', isBoldValue ? 'bold' : 'normal');
    doc.setTextColor(51, 65, 85); // slate-700

    const availWidth = Math.max(10, cellWidth - labelW - 0.8);
    const valStr = (value !== undefined && value !== null && value !== '') ? value.toString().trim() : '---';

    // Auto-ajuste de escala tipográfica si excede el ancho disponible de la celda
    let currentFontSize = fontSize;
    doc.setFontSize(currentFontSize);
    while (doc.getTextWidth(valStr) > availWidth && currentFontSize > 5.6) {
      currentFontSize -= 0.25;
      doc.setFontSize(currentFontSize);
    }

    // Si aún excede el ancho disponible con la tipografía mínima, truncar de forma segura con '...'
    let finalPrintStr = valStr;
    if (doc.getTextWidth(finalPrintStr) > availWidth) {
      let trimmed = finalPrintStr;
      while (trimmed.length > 3 && doc.getTextWidth(`${trimmed}...`) > availWidth) {
        trimmed = trimmed.slice(0, -1);
      }
      finalPrintStr = `${trimmed}...`;
    }

    doc.text(finalPrintStr, x + labelW, yPos);
    doc.setFontSize(fontSize);
  };

  /**
   * Renderiza texto bloqueado dentro de un ancho máximo estricto para evitar montajes.
   */
  const renderClampedText = (
    text: string,
    x: number,
    yPos: number,
    maxWidth: number,
    isBold: boolean = false,
    fontSize: number = 7.8,
    textColor: [number, number, number] = [30, 41, 59]
  ) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    let fSize = fontSize;
    doc.setFontSize(fSize);
    doc.setTextColor(...textColor);
    while (doc.getTextWidth(text) > maxWidth && fSize > 5.6) {
      fSize -= 0.25;
      doc.setFontSize(fSize);
    }
    let printText = text;
    if (doc.getTextWidth(printText) > maxWidth) {
      let trimmed = printText;
      while (trimmed.length > 3 && doc.getTextWidth(`${trimmed}...`) > maxWidth) {
        trimmed = trimmed.slice(0, -1);
      }
      printText = `${trimmed}...`;
    }
    doc.text(printText, x, yPos);
  };

  // =========================================================================
  // 1. DATOS DE IDENTIFICACIÓN Y PROCEDIMIENTO QUIRÚRGICO
  // =========================================================================
  let y = 24.0;
  addSectionHeader('1. DATOS DE IDENTIFICACIÓN Y PROCEDIMIENTO QUIRÚRGICO', y);

  y += 4.8;
  renderCell('Paciente', formData.nombre, 10, y, 76, true, 8.6);
  renderCell('Cédula / ID', formData.cedulaPaciente || '---', 88, y, 44, true, 8.4);

  // Aptitud quirúrgica con distintivo visual
  const displayApto = formData.apto?.includes('DIFERIDO')
    ? 'DIFERIDO'
    : (formData.apto?.includes('NO') ? 'NO APTO' : 'SÍ (APTO)');
  
  if (displayApto === 'SÍ (APTO)') {
    doc.setFillColor(240, 253, 244); // green-50
    doc.setDrawColor(187, 247, 208); // green-200
  } else if (displayApto === 'NO APTO') {
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(254, 202, 202); // red-200
  } else {
    doc.setFillColor(254, 252, 232); // yellow-50
    doc.setDrawColor(254, 240, 138); // yellow-200
  }
  doc.rect(134, y - 3.2, 66, 4.4, 'FD');
  renderCell('Aptitud Quirúrgica', displayApto, 136, y, 62, true, 8.4);

  y += 4.6;
  renderCell('Edad', formData.edad ? `${formData.edad} años` : '---', 10, y, 32, false, 8.1);
  renderCell('Sexo', formData.sexo, 44, y, 32, false, 8.1);
  renderCell('Servicio', formData.servicio || 'Cirugía General', 78, y, 58, true, 8.1);
  renderCell('Ubicación / Dir.', formData.direccion || 'Quirófano Central', 138, y, 62, false, 8.1);

  y += 4.6;
  renderCell('Diagnóstico Preop.', formData.diag || formData.diagnostico || '---', 10, y, 190, false, 8.1);

  y += 4.6;
  renderCell('Cirugía Programada', formData.cirugia || '---', 10, y, 190, true, 8.3);

  // =========================================================================
  // 2. ANTECEDENTES MÉDICOS, ALERGIAS Y HÁBITOS
  // =========================================================================
  y += 6.0;
  addSectionHeader('2. ANTECEDENTES MÉDICOS, ALERGIAS Y HÁBITOS', y);

  y += 4.8;
  renderCell('Patológicos Personales', formData.antPers || formData.antecedentes || 'No refiere patologías crónicas', 10, y, 94, false, 8.1);
  renderCell('Patológicos Familiares', formData.antFam || formData.familiares || 'No refiere antecedentes', 107, y, 93, false, 8.1);

  y += 4.6;
  renderCell('Cirugías Previas', formData.cirugiasPrev || formData.quirurgicos || 'Ninguna referida', 10, y, 94, false, 8.1);
  renderCell('Hábitos / Tóxicos', formData.alcohol || formData.habitos || 'Niega hábitos psicotóxicos', 107, y, 93, false, 8.1);

  y += 4.6;
  const isAllergy = formData.alergias && formData.alergias.toLowerCase() !== 'negativas' && formData.alergias.trim() !== '';
  if (isAllergy) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
    doc.rect(10, y - 3.2, 190, 4.4, 'FD');
    renderCell('⚠️ ALERGIAS CONOCIDAS (ALERTA)', formData.alergias, 12, y, 186, true, 8.3);
  } else {
    renderCell('Alergias Conocidas', formData.alergias || 'Negativas (Niega alergias a medicamentos o látex)', 10, y, 190, false, 8.1);
  }

  // =========================================================================
  // 3. EXAMEN FÍSICO Y VALORACIÓN DE VÍA AÉREA (EL-GANZOURI - EGRI)
  // =========================================================================
  y += 6.0;
  addSectionHeader('3. EXAMEN FÍSICO E ÍNDICE DE VÍA AÉREA (EL-GANZOURI EGRI)', y);

  y += 4.8;
  const imcStr = formData.imc ? ` | IMC: ${formData.imc}` : '';
  const tallaStr = formData.talla ? ` | Talla: ${formData.talla} cm` : '';
  renderCell('Signos Vitales', `Peso: ${formData.peso || '--'} kg${tallaStr}${imcStr} | FC: ${formData.fc || '--'} lpm | FR: ${formData.fr || '--'} rpm | TA: ${formData.ta || '--'} mmHg`, 10, y, 132, false, 7.8);
  renderCell('Escala Chien', formData.escalaChien || formData.escalaHien || 'Grado I - Fácil', 144, y, 56, true, 8.0);

  y += 4.6;
  renderCell('1. Apertura Bucal', formData.egriApertura || '> 4 cm (0 pts)', 10, y, 58, false, 7.9);
  renderCell('2. DTM', formData.egriDtm || '> 6.5 cm (0 pts)', 70, y, 58, false, 7.9);
  renderCell('3. Mallampati', formData.egriMallampati || 'Clase I (0 pts)', 130, y, 70, false, 7.9);

  y += 4.6;
  renderCell('4. Mov. Cervical', formData.egriCervical || '> 90° (0 pts)', 10, y, 58, false, 7.9);
  renderCell('5. Subluxación Mand.', formData.egriSubluxacion || 'Incisivos inf. delante (0)', 70, y, 58, false, 7.9);
  renderCell('6. Peso Corporal', formData.egriPeso || '< 90 kg (0 pts)', 130, y, 70, false, 7.9);

  y += 4.6;
  renderCell('7. Historia VAD', formData.egriHistoriaVad || 'Ausente / Negativa (0 pts)', 10, y, 70, false, 7.9);

  // Cuadro resumen de Riesgo de Vía Aérea EGRI
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(82, y - 3.2, 118, 4.4, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.0);
  if (egriCategory.toLowerCase().includes('alto')) {
    doc.setTextColor(185, 28, 28);
  } else if (egriCategory.toLowerCase().includes('moderado')) {
    doc.setTextColor(180, 83, 9);
  } else {
    doc.setTextColor(21, 128, 61);
  }
  doc.text(`ÍNDICE EGRI: ${egriScore}/14 pts | RIESGO: ${egriCategory.toUpperCase()}`, 84, y);

  y += 4.6;
  renderCell('Cabeza / Cuello', formData.cabeza || 'Normocéfalo, sin masas palpables', 10, y, 94, false, 7.9);
  renderCell('Cardiovascular', formData.cardio || formData.cardiovascular || 'R1-R2 rítmicos, normofonéticos, sin soplos', 107, y, 93, false, 7.9);

  y += 4.4;
  renderCell('Respiratorio', formData.resp || formData.pulmonar || 'Murmullo vesicular conservado en ambos campos', 10, y, 94, false, 7.9);
  renderCell('Abdomen / Extr.', `${formData.abdomen || 'Blando, depresible'} | ${formData.extremidades || 'Eutróficas, pulsos presentes'}`, 107, y, 93, false, 7.9);

  // =========================================================================
  // 4. PARACLÍNICOS Y COAGULACIÓN
  // =========================================================================
  y += 6.0;
  addSectionHeader('4. PARACLÍNICOS, LABORATORIOS Y ESTUDIOS DE GABINETE', y);

  y += 4.8;
  renderCell('Hb / Hematocrito', `${formData.hg || '---'} / ${formData.hto || '---'}`, 10, y, 44, false, 8.0);
  renderCell('Leucos / Plaquetas', `${formData.leuco || '---'} / ${formData.plaquetas || '---'}`, 56, y, 48, false, 8.0);
  renderCell('Glicemia', formData.glicemia || '---', 106, y, 42, false, 8.0);
  renderCell('Grupo y Rh', formData.grupoFactor || '---', 150, y, 50, true, 8.1);

  y += 4.6;
  renderCell('Creatinina / Urea', `${formData.creatinina || '---'} / ${formData.urea || '---'}`, 10, y, 42, false, 7.9);
  renderCell('PT', formData.pt || formData.pt_ptt || '---', 54, y, 22, false, 7.9);
  renderCell('INR', formData.inr || '1.0', 78, y, 18, false, 7.9);
  renderCell('PTT', formData.ptt || '---', 98, y, 24, false, 7.9);
  renderCell('Serologías', `HIV: ${formData.hiv || '---'} | VDRL: ${formData.vdrl || '---'}`, 124, y, 76, false, 7.6);

  y += 4.6;
  renderCell('EKG / RX', `${formData.ekg || 'Normal'} | ${formData.rx || 'Normal'}`, 10, y, 94, false, 7.9);
  renderCell('Val. Cardiovascular', formData.evaluacionCardio || 'Sin contraindicación cardiovascular.', 107, y, 93, false, 7.9);

  const hasExtraLab = Boolean(formData.otrosLaboratorios && formData.otrosLaboratorios.trim() !== '' && formData.otrosLaboratorios !== 'Ninguno');
  const hasExtraVal = Boolean(formData.otrasValoraciones && formData.otrasValoraciones.trim() !== '' && formData.otrasValoraciones !== 'Ninguna' && formData.otrasValoraciones !== 'Ninguno');

  if (hasExtraLab || hasExtraVal) {
    y += 4.4;
    if (hasExtraVal && hasExtraLab) {
      renderCell('Otras Val.', formData.otrasValoraciones || '', 10, y, 94, false, 7.8);
      renderCell('Otros Lab.', formData.otrosLaboratorios || '', 107, y, 93, false, 7.8);
    } else if (hasExtraVal) {
      renderCell('Otras Valoraciones', formData.otrasValoraciones || '', 10, y, 190, false, 7.8);
    } else {
      renderCell('Otros Laboratorios', formData.otrosLaboratorios || '', 10, y, 190, false, 7.8);
    }
  }

  // =========================================================================
  // 5. ESTRATIFICACIÓN DE RIESGO Y ESCALA DE CAPRINI (TEV)
  // =========================================================================
  y += 6.0;
  addSectionHeader('5. ESTRATIFICACIÓN DE RIESGO (ASA, GOLDMAN Y ESCALA DE CAPRINI)', y);

  y += 4.8;
  doc.setFillColor(241, 245, 249);
  doc.rect(10, y - 3.2, 190, 4.4, 'F');
  renderCell('Índice Goldman (Cardíaco)', formData.goldman || 'Clase I (Riesgo Muy Bajo 1%)', 12, y, 80, true, 8.1);
  renderCell('Clasificación ASA', formData.asa || 'ASA I', 94, y, 40, true, 8.3);
  renderCell('Aptitud Quirúrgica', displayApto, 138, y, 60, true, 8.3);

  // Escala de Caprini (Riesgo Tromboembólico Venoso)
  y += 4.8;
  const capriniRes = evaluateCapriniScore(formData.capriniScore || 0);
  const capriniCategoryText = formData.capriniCategory || capriniRes.categoryTitle;
  const capriniProfilaxisText = formData.capriniProfilaxis || capriniRes.profilaxisText;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.rect(10, y - 3.2, 190, 8.4, 'FD');

  const capriniHeader = `ESCALA DE CAPRINI (RIESGO TEV): ${formData.capriniScore || 0} PTS — ${capriniCategoryText.toUpperCase()} (${capriniRes.incidenceText})`;
  renderClampedText(capriniHeader, 12, y, 186, true, 7.8, [30, 58, 138]);

  y += 3.8;
  renderClampedText(`Pauta Tromboprofiláctica: ${capriniProfilaxisText}`, 12, y, 186, false, 7.3, [51, 65, 85]);

  // =========================================================================
  // 6. PLAN ANESTÉSICO Y RECOMENDACIONES PERIOPERATORIAS
  // Distribuido en una caja amplia y limpia de altura calculada dinámicamente
  // =========================================================================
  y += 5.5;
  addSectionHeader('6. PLAN ANESTÉSICO, RECOMENDACIONES Y PRESCRIPCIONES', y);

  const planBoxTop = y + 1.4;
  const section7Top = 241.0; // Anclaje fijo milimétrico de la Sección 7
  const planBoxHeight = Math.max(26.0, section7Top - planBoxTop - 3.5);

  doc.setFillColor(252, 253, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(10, planBoxTop, 190, planBoxHeight, 'FD');

  y = planBoxTop + 3.8;

  const defaultRecomItems = [
    '• Ayuno preoperatorio: 8h para sólidos y 2h para líquidos claros.',
    '• Monitorización continua básica ASA (ECG continuo, PANI, SpO2, Capnografía, Temperatura).',
    '• Normotermia activa perioperatoria con manta térmica.',
    '• Analgesia multimodal preventiva para control oportuno del dolor agudo.',
    '• Profilaxis antibiótica oportuna 30 a 60 minutos previos a incisión quirúrgica.',
    '• Tromboprofilaxis ajustada según estratificación de riesgo de Caprini.',
    '• Vigilancia hemodinámica y respiratoria continua en Sala de Recuperación (URPA).'
  ];

  let rawRecomList: string[] = [];
  if (formData.recomendaciones && formData.recomendaciones.trim().length > 10) {
    rawRecomList = formData.recomendaciones
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);
  }

  const finalRecomList = rawRecomList.length >= 3 
    ? rawRecomList 
    : [...rawRecomList, ...defaultRecomItems.slice(rawRecomList.length)];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const maxPlanY = planBoxTop + planBoxHeight - 2.0;

  for (const item of finalRecomList) {
    if (y >= maxPlanY) break;
    const cleanItem = item.startsWith('•') ? item : `• ${item}`;
    const splitLines = doc.splitTextToSize(cleanItem, 184);
    for (const subLine of splitLines) {
      if (y >= maxPlanY) break;
      doc.text(subLine, 13.0, y);
      y += 3.4;
    }
  }

  // =========================================================================
  // 7. RESPONSABILIDAD MÉDICO LEGAL, FIRMAS Y MATRÍCULAS
  // Anclado rígidamente en y = 241.0 con columnas blindadas e independientes
  // =========================================================================
  y = section7Top;
  addSectionHeader('7. CONFORMIDAD MÉDICO LEGAL, FIRMAS Y MATRÍCULAS', y);

  // Renderizar Firma Manuscrita Digital del Doctor si existe
  if (formData.doctorSignatureDataUrl) {
    try {
      doc.addImage(formData.doctorSignatureDataUrl, 'PNG', 20, 245.5, 46, 8.5);
    } catch (e) {
      console.warn('Could not add doctor signature to PDF:', e);
    }
  }

  // Renderizar Firma Manuscrita Digital del Paciente si existe
  if (formData.patientSignatureDataUrl) {
    try {
      doc.addImage(formData.patientSignatureDataUrl, 'PNG', 122, 245.5, 46, 8.5);
    } catch (e) {
      console.warn('Could not add patient signature to PDF:', e);
    }
  }

  // Líneas divisorias de firma independientes
  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.35);
  doc.line(12, 255.0, 94, 255.0);   // Línea médico
  doc.line(114, 255.0, 196, 255.0); // Línea paciente

  // Nombres principales
  y = 258.5;
  renderClampedText(`Dr(a). ${formData.anestesio || 'Médico Anestesiólogo'}`, 12, y, 82, true, 8.2, [15, 23, 42]);
  const signerRel = formData.patientSignerRelation ? ` (${formData.patientSignerRelation})` : '';
  renderClampedText(`Firma del Paciente / Representante${signerRel}`, 114, y, 82, true, 8.2, [15, 23, 42]);

  // Cédulas y Matrículas
  y += 3.7;
  const cedulaStr = formData.cedula ? `C.I.: ${formData.cedula}` : 'C.I.: ____________';
  const matriculaStr = formData.matricula ? `M.P.: ${formData.matricula}` : 'M.P.: ____________';
  const telStr = formData.telefono ? ` • Tel: ${formData.telefono}` : '';
  const doctorCredentials = `${cedulaStr}   •   ${matriculaStr}${telStr}`;
  renderClampedText(doctorCredentials, 12, y, 82, true, 7.6, [30, 41, 59]);

  const signerName = formData.patientSignerName || formData.nombre || 'Paciente';
  renderClampedText(`Nombre: ${signerName}   •   C.I.: ${formData.cedulaPaciente || '---'}`, 114, y, 82, false, 7.6, [51, 65, 85]);

  // Especialidad y Consentimiento
  y += 3.5;
  renderClampedText('Especialista en Anestesiología y Reanimación', 12, y, 82, false, 7.1, [100, 116, 139]);
  renderClampedText('Consentimiento Informado Preanestésico Aprobado y Asentado', 114, y, 82, false, 7.1, [100, 116, 139]);

  // Acreditación y validez jurídica
  y += 3.3;
  renderClampedText('Colegiatura médica y acreditación profesional verificadas.', 12, y, 82, false, 6.5, [148, 163, 184]);
  renderClampedText('Firma digital y huella válidas conforme a la ley de ejercicio médico.', 114, y, 82, false, 6.5, [148, 163, 184]);

  // =========================================================================
  // PIE DE PÁGINA (MICRO-FOOTER)
  // =========================================================================
  doc.setDrawColor(226, 232, 240);
  doc.line(10, 286.0, 200, 286.0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'AnestesiaPro • Sistema Clínico Oficial • Formato de Evaluación Preanestésica Válido para Quirófano • Hoja Oficial Única (1/1)',
    105,
    289.5,
    { align: 'center' }
  );

  // Generar Blob y URL
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const fullText = generateWhatsAppFullPreanesthesiaMessage(formData, egriScore, egriCategory);

  return {
    doc,
    blob: pdfBlob,
    blobUrl,
    fileName,
    fullText
  };
};

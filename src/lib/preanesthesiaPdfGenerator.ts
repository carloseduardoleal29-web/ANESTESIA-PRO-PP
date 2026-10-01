import jsPDF from 'jspdf';
import { LetterheadConfig, PatientPreanesthesiaRecord } from '../types/preanesthesia';

export function generatePreanesthesiaPDF(
  record: PatientPreanesthesiaRecord,
  letterhead: LetterheadConfig
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Color theme mapping for PDF
  const colorSchemes: Record<LetterheadConfig['themeColor'], { primary: [number, number, number]; secondary: [number, number, number]; light: [number, number, number] }> = {
    navy: { primary: [15, 23, 42], secondary: [30, 58, 138], light: [239, 246, 255] },
    emerald: { primary: [6, 78, 59], secondary: [4, 120, 87], light: [236, 253, 245] },
    cyan: { primary: [12, 74, 96], secondary: [14, 116, 144], light: [236, 254, 255] },
    burgundy: { primary: [136, 19, 55], secondary: [190, 18, 60], light: [255, 241, 242] },
    indigo: { primary: [49, 46, 129], secondary: [67, 56, 202], light: [238, 242, 255] },
    slate: { primary: [30, 41, 59], secondary: [51, 65, 85], light: [248, 250, 252] }
  };

  const colors = colorSchemes[letterhead.themeColor] || colorSchemes.navy;

  // ==========================================
  // HEADER & LETTERHEAD
  // ==========================================
  // Top Banner Strip
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Hospital Logo (Left)
  let headerTextLeft = margin;
  if (letterhead.hospitalLogoBase64) {
    try {
      doc.addImage(letterhead.hospitalLogoBase64, 'PNG', margin, 3, 20, 20);
      headerTextLeft = margin + 23;
    } catch (e) {
      console.warn('Could not add hospital logo to PDF:', e);
    }
  }

  // Specialist Logo (Right)
  let headerTextRight = pageWidth - margin;
  if (letterhead.specialistLogoBase64) {
    try {
      doc.addImage(letterhead.specialistLogoBase64, 'PNG', pageWidth - margin - 20, 3, 20, 20);
      headerTextRight = pageWidth - margin - 23;
    } catch (e) {
      console.warn('Could not add specialist logo to PDF:', e);
    }
  }

  // Hospital & Service Texts
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(letterhead.hospitalName.toUpperCase(), headerTextLeft, 9);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text(letterhead.department.toUpperCase(), headerTextLeft, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  const subText = `${letterhead.address ? letterhead.address + ' • ' : ''}${letterhead.cityCountry} ${letterhead.phone ? '• Tel: ' + letterhead.phone : ''}`;
  doc.text(subText, headerTextLeft, 18.5);

  // Información Institucional en el membrete principal (los datos del anestesiólogo de turno van en la ficha clínica)
  doc.text('DOCUMENTO MÉDICO LEGAL OFICIAL • HISTORIA CLÍNICA PERIOPERATORIA VÁLIDA PARA QUIRÓFANO', headerTextLeft, 22.5);

  let yPos = 31;

  // Sub-title bar
  doc.setFillColor(...colors.secondary);
  doc.rect(margin, yPos - 3.5, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('FICHA DE VALORACIÓN PREANESTÉSICA & REGISTRO CLÍNICO PERIOPERATORIO', margin + 3, yPos + 0.5);
  doc.setFontSize(7);
  doc.text(`Fecha: ${record.date}  |  Hora: ${record.time}`, pageWidth - margin - 45, yPos + 0.5);

  yPos += 7;

  // Helper function to draw section header
  const drawSectionHeader = (title: string, y: number): number => {
    doc.setFillColor(...colors.light);
    doc.rect(margin, y - 3, contentWidth, 5, 'F');
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.3);
    doc.line(margin, y - 3, margin, y + 2); // left accent border

    doc.setTextColor(...colors.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(title, margin + 2.5, y + 0.5);
    return y + 4.5;
  };

  // ==========================================
  // SECCIÓN 1: DATOS DEL PACIENTE & CIRUGÍA
  // ==========================================
  yPos = drawSectionHeader('1. IDENTIFICACIÓN DEL PACIENTE & PROCEDIMIENTO QUIRÚRGICO', yPos);

  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.text('Paciente:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.fullName || 'No especificado', margin + 18, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Hist. / Cédula:', margin + 85, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.recordNumber || 'S/N', margin + 107, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Edad:', margin + 140, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.age || '--'} años`, margin + 150, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Sexo:', margin + 165, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.gender, margin + 175, yPos);

  yPos += 4.5;

  // Row 2: Antropometría
  doc.setFont('helvetica', 'bold');
  doc.text('Peso:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.weightKg || '--'} kg`, margin + 12, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Talla:', margin + 35, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.heightCm || '--'} cm`, margin + 45, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('IMC:', margin + 68, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.bmi ? record.bmi.toFixed(1) : '--'} kg/m²`, margin + 76, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Carácter:', margin + 115, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(record.urgencyType === 'Electiva' ? 16 : 220, record.urgencyType === 'Electiva' ? 185 : 38, record.urgencyType === 'Electiva' ? 129 : 38);
  doc.text(record.urgencyType.toUpperCase(), margin + 130, yPos);
  doc.setTextColor(15, 23, 42);

  yPos += 4.5;

  // Row 3: Cirugía
  doc.setFont('helvetica', 'bold');
  doc.text('Cirugía Propuesta:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.surgeryProposed || 'No especificada', margin + 30, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Cirujano Principal:', margin + 115, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.surgeonName || 'No especificado', margin + 144, yPos);

  yPos += 5.5;

  // ==========================================
  // SECCIÓN 2: ALERGIAS & ANTECEDENTES
  // ==========================================
  yPos = drawSectionHeader('2. ANTECEDENTES PATOLÓGICOS, ALERGIAS & MEDICACIÓN HABITUAL', yPos);

  // Alergias Alert Box
  const isAllergic = record.hasAllergies || (record.allergies && record.allergies.toLowerCase() !== 'ninguna' && !record.allergies.toLowerCase().includes('ninguna conocida'));
  if (isAllergic) {
    doc.setFillColor(254, 242, 242); // Red 50
    doc.rect(margin, yPos - 2.5, contentWidth, 5, 'F');
    doc.setTextColor(220, 38, 38); // Red 600
    doc.setFont('helvetica', 'bold');
    doc.text(`¡ALERTA DE ALERGIAS!: ${record.allergies.toUpperCase()}`, margin + 2.5, yPos + 0.8);
  } else {
    doc.setTextColor(5, 150, 105); // Emerald 600
    doc.setFont('helvetica', 'bold');
    doc.text('Alergias: NINGUNA CONOCIDA (NKDA)', margin + 2.5, yPos + 0.5);
  }
  yPos += 4.5;

  // Comorbidities checked
  doc.setFontSize(6.8);
  doc.setTextColor(15, 23, 42);
  const activeComorbs: string[] = [];
  if (record.comorbidities.hta) activeComorbs.push('Hipertensión Arterial (HTA)');
  if (record.comorbidities.diabetes) activeComorbs.push('Diabetes Mellitus');
  if (record.comorbidities.cardiopatiaIsquemica) activeComorbs.push('Cardiopatía Isquémica');
  if (record.comorbidities.insuficienciaCardiaca) activeComorbs.push('Insuficiencia Cardíaca');
  if (record.comorbidities.asmaEpoc) activeComorbs.push('Asma / EPOC');
  if (record.comorbidities.apneaSueno) activeComorbs.push('SAHOS / Apnea');
  if (record.comorbidities.insuficienciaRenal) activeComorbs.push('Enf. Renal Crónica');
  if (record.comorbidities.hepatopatia) activeComorbs.push('Hepatopatía');
  if (record.comorbidities.reflujoGastroesofagico) activeComorbs.push('ERGE');
  if (record.comorbidities.tabaquismo) activeComorbs.push('Tabaquismo');
  if (record.comorbidities.etilismo) activeComorbs.push('Etilismo');
  if (record.comorbidities.otras) activeComorbs.push(record.comorbidities.otras);

  doc.setFont('helvetica', 'bold');
  doc.text('Comorbilidades:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(activeComorbs.length > 0 ? activeComorbs.join(' • ') : 'Niega comorbilidades activas', margin + 26, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Medicación Crónica:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.chronicMedications || 'Ninguna', margin + 30, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Anticoagulantes / Antiagregantes:', margin + 105, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.anticoagulants || 'Ninguno', margin + 152, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Cirugías Previas:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.previousSurgeriesAnesthesias || 'Ninguna', margin + 26, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Eventos Adversos Anestésicos:', margin + 105, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.adverseAnestheticEvents || 'Sin eventos', margin + 148, yPos);

  yPos += 5.5;

  // ==========================================
  // SECCIÓN 3: EVALUACIÓN DE VÍA AÉREA & AYUNO
  // ==========================================
  yPos = drawSectionHeader('3. EVALUACIÓN DE VÍA AÉREA, AYUNO & PREDICTORES', yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Mallampati:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`Clase ${record.airway.mallampati}`, margin + 19, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Patil (D. Tiroment.):', margin + 45, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airway.patilTiromentoniana, margin + 74, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Apertura Bucal:', margin + 115, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airway.aperturaBucal, margin + 138, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Mov. Cervical:', margin + 162, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airway.movilidadCervical.split(' ')[0], margin + 183, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Dentadura:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airway.dentadura, margin + 19, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Cuello:', margin + 75, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airway.cuello, margin + 87, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Ayuno Sólidos:', margin + 135, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.fastingSolidsHours}h`, margin + 157, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Líquidos claros:', margin + 165, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${record.fastingClearLiquidsHours}h`, margin + 188, yPos);

  yPos += 5.5;

  // ==========================================
  // SECCIÓN 4: ESTRATIFICACIÓN DE RIESGO
  // ==========================================
  yPos = drawSectionHeader('4. ESTRATIFICACIÓN DE RIESGO QUIRÚRGICO & TROMBOEMBÓLICO', yPos);

  // ASA Box
  doc.setFillColor(...colors.light);
  doc.rect(margin, yPos - 2, 58, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('ESTADO FÍSICO ASA:', margin + 2, yPos + 2);
  doc.setFontSize(9);
  doc.text(`ASA ${record.asaClassification}${record.isAsaEmergency ? ' - E (Urgencia)' : ''}`, margin + 2, yPos + 5.5);
  doc.setFontSize(6.8);

  // Caprini Box
  doc.setFillColor(...colors.light);
  doc.rect(margin + 62, yPos - 2, 58, 8, 'F');
  doc.setTextColor(...colors.primary);
  doc.text('RIESGO TEV (CAPRINI):', margin + 64, yPos + 2);
  doc.setFontSize(8.5);
  doc.text(`${record.capriniScore} pts • ${record.capriniLevel}`, margin + 64, yPos + 5.5);
  doc.setFontSize(6.8);

  // Difficult Airway Box
  doc.setFillColor(record.isDifficultAirwayPredicted ? 254 : 240, record.isDifficultAirwayPredicted ? 242 : 253, record.isDifficultAirwayPredicted ? 242 : 244);
  doc.rect(margin + 124, yPos - 2, 58, 8, 'F');
  doc.setTextColor(record.isDifficultAirwayPredicted ? 220 : 5, record.isDifficultAirwayPredicted ? 38 : 150, record.isDifficultAirwayPredicted ? 38 : 105);
  doc.text('PREDICCIÓN VÍA AÉREA:', margin + 126, yPos + 2);
  doc.setFontSize(8.5);
  doc.text(record.isDifficultAirwayPredicted ? '¡VÍA AÉREA DIFÍCIL (VAD)!' : 'VÍA AÉREA PREVISTA NORMAL', margin + 126, yPos + 5.5);
  doc.setFontSize(6.8);

  yPos += 11;

  // ==========================================
  // SECCIÓN 5: PLAN ANESTÉSICO PROPUESTO
  // ==========================================
  yPos = drawSectionHeader('5. PLAN ANESTÉSICO PROPUESTO, VÍA AÉREA & CUIDADOS', yPos);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Técnica Anestésica:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.proposedAnesthesia, margin + 30, yPos);

  doc.setFont('helvetica', 'bold');
  doc.text('Dispositivo Vía Aérea:', margin + 105, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.airwayDevice, margin + 137, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Monitoreo Planificado:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.monitoringPlan, margin + 33, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Reserva Hemoderivados:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.bloodReserve, margin + 37, yPos);

  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.text('Recomendaciones:', margin + 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(record.specialRecommendations, margin + 29, yPos);

  yPos += 6;

  // ==========================================
  // SECCIÓN 6: FIRMAS DIGITALES & CONSENTIMIENTO
  // ==========================================
  yPos = drawSectionHeader('6. FIRMAS DIGITALES, CONFORMIDAD & REGISTRO MÉDICO LEGAL', yPos);

  const sigBoxWidth = (contentWidth - 6) / 2;
  const sigBoxHeight = 27;

  // Box 1: Firma Médico Anestesiólogo
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.rect(margin, yPos, sigBoxWidth, sigBoxHeight);

  if (record.doctorSignatureDataUrl) {
    try {
      doc.addImage(record.doctorSignatureDataUrl, 'PNG', margin + 8, yPos + 1.5, sigBoxWidth - 16, 15);
    } catch (e) {}
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('Firma manuscrita del médico', margin + sigBoxWidth / 2, yPos + 11, { align: 'center' });
  }

  doc.line(margin + 10, yPos + 18, margin + sigBoxWidth - 10, yPos + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(6.8);
  const docName = record.evaluatorDoctorName || letterhead.doctorName || 'Dr. Carlos Leal';
  doc.text(`Dr(a). ${docName}`, margin + sigBoxWidth / 2, yPos + 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  const docCedula = record.evaluatorDoctorCedula ? `C.I.: ${record.evaluatorDoctorCedula}` : (letterhead.doctorLicense ? `C.I.: ${letterhead.doctorLicense}` : '');
  const docLicense = record.evaluatorDoctorLicense ? `M.P.: ${record.evaluatorDoctorLicense}` : '';
  const docPhone = record.evaluatorDoctorPhone ? `Tel: ${record.evaluatorDoctorPhone}` : '';
  const docSubtitle = [docCedula, docLicense, docPhone].filter(Boolean).join(' • ') || 'Especialista en Anestesiología y Reanimación';
  doc.text(docSubtitle, margin + sigBoxWidth / 2, yPos + 24, { align: 'center' });

  // Box 2: Firma Paciente / Consentimiento
  doc.rect(margin + sigBoxWidth + 6, yPos, sigBoxWidth, sigBoxHeight);

  if (record.patientSignatureDataUrl) {
    try {
      doc.addImage(record.patientSignatureDataUrl, 'PNG', margin + sigBoxWidth + 14, yPos + 1.5, sigBoxWidth - 16, 15);
    } catch (e) {}
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(148, 163, 184);
    doc.text('Firma del paciente / tutor legal', margin + sigBoxWidth + 6 + sigBoxWidth / 2, yPos + 11, { align: 'center' });
  }

  doc.line(margin + sigBoxWidth + 16, yPos + 18, margin + contentWidth - 10, yPos + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(6.8);
  doc.text(record.patientSignerName || record.fullName || 'Firma de Conformidad del Paciente', margin + sigBoxWidth + 6 + sigBoxWidth / 2, yPos + 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`Consentimiento Informado Aceptado (${record.patientSignerRelation || 'Paciente'})`, margin + sigBoxWidth + 6 + sigBoxWidth / 2, yPos + 24, { align: 'center' });

  // ==========================================
  // FOOTER & CONFIDENTIALITY
  // ==========================================
  const footerY = pageHeight - 11;
  doc.setDrawColor(...colors.secondary);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.setTextColor(148, 163, 184);
  doc.text(letterhead.confidentialityNote || 'Documento médico legal confidencial.', margin, footerY + 1.5);

  const auditString = `ID: ${record.id} • Emisión: ${record.date} ${record.time} • AnestesiaPro Elite`;
  doc.text(auditString, margin, footerY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('PÁGINA 1 DE 1 • VALORACIÓN PREANESTÉSICA COMPLETA', pageWidth - margin, footerY + 3.5, { align: 'right' });

  return doc;
}

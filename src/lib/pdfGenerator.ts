import { jsPDF } from 'jspdf';
import { DoctorUser } from '../types/user';

export interface PreAnestheticData {
  patientName: string;
  patientAge: number | string;
  patientGender: string;
  weightKg: number;
  heightCm: number;
  bmi: string;
  asaClass: string;
  emergency: boolean;
  mallampati: string;
  thyromentalDistance: string;
  mouthOpening: string;
  neckMobility: string;
  allergies: string;
  medicalHistory: string;
  fastingHours: number | string;
  plannedProcedure: string;
  proposedAnesthesia: string;
  airwayRiskSummary: string;
}

export function generatePreAnestheticPDF(data: PreAnestheticData, doctor: DoctorUser) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [14, 116, 144]; // Cyan 700
  const darkColor = [15, 23, 42];     // Slate 900
  const lightBg = [241, 245, 249];    // Slate 100

  // Top Banner
  doc.setFillColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.rect(0, 0, 210, 32, 'F');

  // App Logo Title
  doc.setTextColor(6, 182, 212); // Cyan 500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AnestesiaPro', 14, 18);

  doc.setTextColor(226, 232, 240);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('EVALUACIÓN Y REGISTRO PREANESTÉSICO CLÍNICO', 14, 25);

  // Date & Report Ref
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Fecha de Emisión: ${today}`, 130, 18);
  doc.text(`Ref: AP-PRE-${Math.floor(100000 + Math.random() * 900000)}`, 130, 24);

  let y = 40;

  // Doctor Header Info Card
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'S');

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`MÉDICO ANESTESIÓLOGO TRATANTE: Dr(a). ${doctor.fullName}`, 18, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Cédula / ID Profesional: ${doctor.medicalId}   |   Especialidad: ${doctor.specialty}   |   País: ${doctor.country}`, 18, y + 16);

  y += 30;

  // Section 1: Patient Demographic & Physical Status
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('1. DATOS DEL PACIENTE Y ESTADO FÍSICO (ASA)', 18, y + 5);

  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Nombre Paciente:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientName || 'No especificado', 50, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Edad:', 125, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.patientAge || '—'} años`, 140, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Género:', 165, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.patientGender || 'M', 182, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Peso (kg):', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.weightKg} kg`, 40, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Talla (cm):', 70, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.heightCm} cm`, 90, y);

  doc.setFont('helvetica', 'bold');
  doc.text('IMC:', 125, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.bmi} kg/m²`, 138, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Clasificación ASA:', 18, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28); // Red emphasis
  doc.text(`${data.asaClass}${data.emergency ? ' - EMERGENCIA (E)' : ''}`, 52, y);

  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Horas de Ayuno:', 125, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.fastingHours} horas`, 158, y);

  y += 12;

  // Section 2: Clinical Background & Allergies
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('2. ANTECEDENTES MÉDICOS Y ALERGIAS', 18, y + 5);

  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Alergias Conocidas:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(220, 38, 38);
  doc.text(data.allergies || 'Ninguna conocida / Niega alergias', 52, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Antecedentes / Comorbilidades:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  
  const historyLines = doc.splitTextToSize(data.medicalHistory || 'Sin antecedentes patológicos de relevancia reportados.', 125);
  doc.text(historyLines, 68, y);

  y += Math.max(10, historyLines.length * 5 + 4);

  // Section 3: Airway Assessment
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('3. EVALUACIÓN Y PREDICCIÓN DE VÍA AÉREA', 18, y + 5);

  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Mallampati:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.mallampati, 42, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Distancia Tiromentoniana:', 90, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.thyromentalDistance, 138, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Apertura Bucal:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.mouthOpening, 48, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Movilidad Cervical:', 90, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.neckMobility, 126, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Dictamen Vía Aérea:', 18, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(data.airwayRiskSummary.includes('DIFÍCIL') ? 185 : 16, data.airwayRiskSummary.includes('DIFÍCIL') ? 28 : 185, 129);
  doc.text(data.airwayRiskSummary, 55, y);

  y += 12;

  // Section 4: Proposed Plan
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('4. PROCEDIMIENTO Y PLAN ANESTÉSICO PROPUESTO', 18, y + 5);

  y += 11;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  doc.text('Cirugía / Procedimiento:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(data.plannedProcedure || 'Procedimiento quirúrgico programado', 60, y);

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Técnica Anestésica:', 18, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 116, 144);
  doc.text(data.proposedAnesthesia || 'Anestesia General Balanceada con Intubación Endotraqueal', 55, y);

  y += 20;

  // Signature Block & Legal Disclaimer
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);

  y += 10;

  // Digital Stamp Box
  doc.setDrawColor(6, 182, 212);
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(120, y, 76, 28, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('FIRMA Y SELLO DIGITAL MÉRITO', 124, y + 6);

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(12);
  doc.setTextColor(14, 116, 144);
  doc.text(`Dr. ${doctor.fullName}`, 124, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Cédula Prof: ${doctor.medicalId}`, 124, y + 21);
  doc.text(`Sello Criptográfico AnestesiaPro`, 124, y + 25);

  // Left side disclaimer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.text('Documento médico generado y avalado a través de AnestesiaPro.', 14, y + 10);
  doc.text('Almacenado de forma segura con verificación en la nube Firestore.', 14, y + 15);
  doc.text('Válido para archivo en Historia Clínica e Interconsulta Médica.', 14, y + 20);

  // Download PDF file
  const filename = `Informe_Preanestesico_${data.patientName.replace(/[^a-zA-Z0-9]/g, '_') || 'Paciente'}_AnestesiaPro.pdf`;
  doc.save(filename);
}

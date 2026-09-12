import React, { useState, useEffect, useRef } from 'react';
import { PreanesthesiaData } from '../types';
import { 
  FileText, Download, UserCheck, Stethoscope, AlertTriangle, CheckCircle2, 
  RotateCcw, Sparkles, Eye, Share2, ExternalLink, X, BarChart2, KeyRound,
  HeartPulse, Activity, Thermometer, Pill, Clock, Droplets, ShieldCheck, 
  PlusCircle, Check, Trash2, Zap, Printer
} from 'lucide-react';
import jsPDF from 'jspdf';
import { recordGlobalDownload, recordPreanesthesiaUsage, getGlobalStats, AppStats } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const initialFormData: PreanesthesiaData = {
  nombre: '',
  cedulaPaciente: '',
  direccion: '',
  edad: '',
  sexo: 'Masculino',
  fecha: new Date().toISOString().split('T')[0],
  hora: getCurrentTimeString(),
  servicio: 'Cirugía General',
  diag: '',
  cirugia: '',

  antFam: '',
  antPers: '',
  alergias: 'Negativas',
  alcohol: 'Niega hábitos psicotóxicos',
  cirugiasPrev: 'Ninguna',

  peso: '70',
  fc: '78',
  fr: '16',
  ta: '120/80',
  escalaChien: 'Grado I - Fácil (Puntos anatómicos bien palpables)',

  // EGRI: El-Ganzouri Multivariate Risk Index (7 Parámetros)
  egriApertura: '> 4 cm (0 pts)',
  egriDtm: '> 6.5 cm (0 pts)',
  egriMallampati: 'Clase I (0 pts)',
  egriCervical: '> 90° (0 pts)',
  egriSubluxacion: 'Incisivos inf. por delante (0 pts)',
  egriPeso: '< 90 kg (0 pts)',
  egriHistoriaVad: 'Ausente / Negativa (0 pts)',

  // Compatibilidad
  mallampati: 'Clase I',
  dtm: '> 6.5 cm',
  apertura: '> 4 cm',
  cervical: '> 90°',

  cabeza: 'Normocéfalo, pupila isocórica fotorreactiva',
  cardio: 'Ruidos cardíacos rítmicos, normofonéticos, sin soplos',
  resp: 'Murmullo vesicular conservado en ambos campos pulmonares',
  abdomen: 'Blando, depresible, no doloroso, sin visceromegalias',
  extremidades: 'Eutróficas, pulsos periféricos presentes',
  neuro: 'Consciente, orientado en tiempo, espacio y persona',

  hg: '13.5 g/dL',
  hto: '40 %',
  leuco: '7,500 /mm³',
  plaquetas: '250,000 /mm³',
  grupoFactor: 'O Rh Positivo (+)',
  glicemia: '90 mg/dL',
  creatinina: '0.8 mg/dL',
  urea: '25 mg/dL',
  pt: '12.0 s (100% / INR 1.0)',
  ptt: '30.0 s (Control: 30s)',
  inr: '1.0',
  pt_ptt: 'PT: 12.0s / PTT: 30.0s',
  hiv: 'Negativo',
  vdrl: 'No reactivo',
  ekg: 'RITMO SINUSAL, FC 75 LPM, SIN ALTERACIONES',
  rx: 'CAMPOS PULMONARES CLAROS, SILUETA CARDÍACA NORMAL',
  evaluacionCardio: 'Valoración cardiovascular no contraindica acto quirúrgico.',
  evaluacionNeumo: 'Evaluación por Neumonología no contraindica.',
  otrosLaboratorios: 'Ninguno',

  goldman: 'Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)',
  asa: 'ASA I',
  apto: 'SÍ (Apto)',

  recomendaciones: '',
  anestesio: '',
  cedula: '',
  telefono: ''
};

export const PreanesthesiaModule: React.FC = () => {
  const [formData, setFormData] = useState<PreanesthesiaData>(initialFormData);
  const [riskScore, setRiskScore] = useState<number>(0);
  const [riskCategory, setRiskCategory] = useState<string>('Vía Aérea Fácil');
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high'>('low');

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlobData, setPdfBlobData] = useState<Blob | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const currentDocRef = useRef<jsPDF | null>(null);

  // Track module usage on mount and listen for real-time stats
  useEffect(() => {
    recordPreanesthesiaUsage('consult').then(s => {
      if (s) setStats(s);
    });
    getGlobalStats().then(s => {
      if (s) setStats(s);
    });

    const onStatsUpdated = (e: any) => {
      if (e.detail) setStats(e.detail);
    };
    window.addEventListener('anestesiapro_stats_updated', onStatsUpdated);

    const interval = setInterval(() => {
      getGlobalStats().then(s => { if (s) setStats(s); });
    }, 5000);

    return () => {
      window.removeEventListener('anestesiapro_stats_updated', onStatsUpdated);
      clearInterval(interval);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Compute El-Ganzouri Multivariate Risk Index (EGRI)
  useEffect(() => {
    let score = 0;

    // 1. Apertura Bucal (0, 1, 2)
    if (formData.egriApertura?.includes('3 – 4') || formData.egriApertura?.includes('3-4')) score += 1;
    else if (formData.egriApertura?.includes('< 3')) score += 2;

    // 2. Distancia Tiromentoniana (0, 1, 2)
    if (formData.egriDtm?.includes('6 – 6.5') || formData.egriDtm?.includes('6-6.5')) score += 1;
    else if (formData.egriDtm?.includes('< 6')) score += 2;

    // 3. Mallampati (0, 1, 2)
    if (formData.egriMallampati?.includes('Clase II')) score += 1;
    else if (formData.egriMallampati?.includes('Clase III') || formData.egriMallampati?.includes('Clase IV')) score += 2;

    // 4. Movilidad Cervical (0, 1, 2)
    if (formData.egriCervical?.includes('80 – 90') || formData.egriCervical?.includes('80-90')) score += 1;
    else if (formData.egriCervical?.includes('< 80')) score += 2;

    // 5. Subluxación Mandibular (0, 1, 2)
    if (formData.egriSubluxacion?.includes('Alinear') || formData.egriSubluxacion?.includes('Pueden alinear')) score += 1;
    else if (formData.egriSubluxacion?.includes('No alinear') || formData.egriSubluxacion?.includes('No pueden')) score += 2;

    // 6. Peso Corporal (0, 1, 2)
    if (formData.egriPeso?.includes('90-110') || formData.egriPeso?.includes('90 – 110')) score += 1;
    else if (formData.egriPeso?.includes('> 110')) score += 2;

    // 7. Historia Vía Aérea Difícil (0, 2)
    if (formData.egriHistoriaVad?.includes('Presente') || formData.egriHistoriaVad?.includes('Positiva')) score += 2;

    setRiskScore(score);

    if (score < 4) {
      setRiskCategory('Vía Aérea Previsiblemente Normal / Fácil');
      setRiskLevel('low');
    } else if (score <= 7) {
      setRiskCategory('ALERTA: Vía Aérea Difícil Probable');
      setRiskLevel('moderate');
    } else {
      setRiskCategory('ALTO RIESGO: Vía Aérea Altamente Difícil');
      setRiskLevel('high');
    }
  }, [
    formData.egriApertura,
    formData.egriDtm,
    formData.egriMallampati,
    formData.egriCervical,
    formData.egriSubluxacion,
    formData.egriPeso,
    formData.egriHistoriaVad
  ]);

  // Auto-format raw numbers on blur to attach appropriate unit
  const handleLabBlur = (field: keyof PreanesthesiaData, unit: string) => {
    const raw = formData[field]?.toString().trim() || '';
    if (!raw) return;
    const match = raw.match(/^(\d+(?:[.,]\d+)?)$/);
    if (match) {
      let val = match[1].replace(',', '.');
      if ((field === 'plaquetas' || field === 'leuco') && !raw.includes(',')) {
        const num = Number(val);
        if (!isNaN(num)) val = num.toLocaleString('en-US');
      }
      setFormData(prev => ({ ...prev, [field]: `${val} ${unit}`.trim() }));
    }
  };

  // Quick Clinical Presets Handlers
  const fillNormalPhysicalExam = () => {
    setFormData(prev => ({
      ...prev,
      cabeza: 'Normocéfalo, pupilas isocóricas fotorreactivas, cuello móvil sin adenopatías',
      cardio: 'Ruidos cardíacos rítmicos, normofonéticos, sin soplos ni galopes',
      resp: 'Murmullo vesicular audible en ambos campos pulmonares, sin ruidos agregados',
      abdomen: 'Blando, depresible, no doloroso a la palpación, ruidos hidroaéreos presentes',
      extremidades: 'Simétricas, eutróficas, sin edemas, pulsos periféricos presentes y simétricos',
      neuro: 'Consciente, orientado en tiempo, espacio y persona (Glasgow 15/15)'
    }));
  };

  const fillNormalAntecedents = () => {
    setFormData(prev => ({
      ...prev,
      antFam: 'Niega antecedentes patológicos familiares de relevancia',
      antPers: 'Niega patologías crónicas conocidas (HTA, DM, Asma)',
      alergias: 'Niega alergias medicamentosas o al látex',
      alcohol: 'Niega hábitos tabáquicos, alcohólicos o psicotóxicos',
      cirugiasPrev: 'Niega cirugías o anestesias previas'
    }));
  };

  const fillNormalLaboratories = () => {
    setFormData(prev => ({
      ...prev,
      hg: '13.5 g/dL',
      hto: '40 %',
      leuco: '7,500 /mm³',
      plaquetas: '250,000 /mm³',
      glicemia: '90 mg/dL',
      creatinina: '0.8 mg/dL',
      urea: '25 mg/dL',
      pt: '12.0 s (Control: 12s - 100%)',
      ptt: '30.0 s (Control: 30s)',
      inr: '1.0',
      pt_ptt: 'PT: 12.0s / PTT: 30.0s',
      ekg: 'RITMO SINUSAL, FC 75 LPM, SIN ALTERACIONES',
      rx: 'CAMPOS PULMONARES CLAROS, SILUETA CARDÍACA NORMAL'
    }));
  };

  const fillAnemiaLaboratories = () => {
    setFormData(prev => ({
      ...prev,
      hg: '10.2 g/dL',
      hto: '31 %',
      leuco: '6,800 /mm³',
      plaquetas: '220,000 /mm³',
      glicemia: '95 mg/dL',
      creatinina: '0.9 mg/dL',
      urea: '28 mg/dL',
      pt: '12.5 s (INR 1.05)',
      ptt: '31.0 s (Control: 30s)',
      inr: '1.05',
      pt_ptt: 'PT: 12.5s / PTT: 31.0s'
    }));
  };

  // Quick set time to current time
  const setCurrentTimeToNow = () => {
    setFormData(prev => ({ ...prev, hora: getCurrentTimeString() }));
  };

  // Add recommendation bullet point with smart deduplication
  const addRecommendationItem = (itemText: string) => {
    setFormData(prev => {
      const current = prev.recomendaciones?.trim() || '';
      const cleanItem = itemText.trim();
      if (!current) {
        return { ...prev, recomendaciones: cleanItem };
      }
      if (current.includes(cleanItem)) {
        return prev;
      }
      return { ...prev, recomendaciones: `${current}\n${cleanItem}` };
    });
  };

  const fillStandardRecommendations = () => {
    setFormData(prev => ({
      ...prev,
      recomendaciones: `• Ayuno preoperatorio mínimo de 8 horas para sólidos y 2 horas para líquidos claros.
• Confort térmico activo trans y postoperatorio (manta térmica activa).
• Analgesia multimodal preventiva y manejo oportuno del dolor postoperatorio.
• Administrar profilaxis antibiótica oportuna 30 a 60 minutos previos a la incisión quirúrgica.
• Monitorización estándar básica ASA continua (ECG continuo, PANI, SpO2, Capnografía, Temperatura).
• Reserva y pruebas cruzadas de hemoderivados en Banco de Sangre si amerita el procedimiento.
• Consentimiento informado debidamente explicado y firmado por el paciente o representante legal.`
    }));
  };

  const clearRecommendations = () => {
    setFormData(prev => ({ ...prev, recomendaciones: '' }));
  };

  const loadSampleData = () => {
    setFormData({
      nombre: 'Tailin Moreno',
      cedulaPaciente: 'V-15.489.288',
      direccion: 'Ciudad Socialista, Bloque 4',
      edad: '51 años',
      sexo: 'Femenino',
      fecha: new Date().toISOString().split('T')[0],
      hora: getCurrentTimeString(),
      servicio: 'Ginecología y Obstetricia',
      diag: 'Leiomiomatosis uterina / Sangrado uterino anormal',
      cirugia: 'Histerectomía Abdominal',

      antFam: 'Padre falleció por IMA / Madre viva con CA de mama',
      antPers: 'No refiere patologías crónicas',
      alergias: 'Negativas',
      alcohol: 'Niega hábitos psicotóxicos',
      cirugiasPrev: '2 cesáreas, una hernia inguinal sin complicaciones',

      peso: '65',
      fc: '69',
      fr: '16',
      ta: '101/60',
      escalaChien: 'Grado II - Moderado (Puntos difusos, requiere palpación profunda)',

      // EGRI: El-Ganzouri
      egriApertura: '> 4 cm (0 pts)',
      egriDtm: '> 6.5 cm (0 pts)',
      egriMallampati: 'Clase II (1 pt)',
      egriCervical: '> 90° (0 pts)',
      egriSubluxacion: 'Incisivos inf. por delante (0 pts)',
      egriPeso: '< 90 kg (0 pts)',
      egriHistoriaVad: 'Ausente / Negativa (0 pts)',

      mallampati: 'Clase II',
      dtm: '> 6.5 cm',
      apertura: '> 4 cm',
      cervical: '> 90°',

      cabeza: 'Normocéfalo, pupila isocórica fotorreactiva',
      cardio: 'Ruidos cardíacos rítmicos, normofonéticos, sin soplos',
      resp: 'Murmullo vesicular conservado en ambos campos pulmonares',
      abdomen: 'Blando, depresible, no doloroso, sin visceromegalias',
      extremidades: 'Eutróficas, pulsos periféricos presentes',
      neuro: 'Glasgow 15/15',

      hg: '12.5 g/dL',
      hto: '40 %',
      leuco: '7,500 /mm³',
      plaquetas: '250,000 /mm³',
      grupoFactor: 'O Rh Positivo (+)',
      glicemia: '90 mg/dL',
      creatinina: '0.8 mg/dL',
      urea: '25 mg/dL',
      pt: '12.0 s (Control: 12s - 100%)',
      ptt: '30.0 s (Control: 30s)',
      inr: '1.0',
      pt_ptt: 'PT: 12.0s / PTT: 30.0s',
      hiv: 'Negativo',
      vdrl: 'No reactivo',
      ekg: 'RITMO SINUSAL, FC 75 LPM, SIN ALTERACIONES',
      rx: 'CAMPOS PULMONARES CLAROS, SILUETA CARDÍACA NORMAL',
      evaluacionCardio: 'Valoración cardiovascular: Sin contraindicación para acto quirúrgico. Riesgo bajo.',
      evaluacionNeumo: 'Evaluación por Neumonología: Sin contraindicación.',
      otrosLaboratorios: 'Densitometría ósea normal',

      goldman: 'Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)',
      asa: 'ASA I',
      apto: 'SÍ',

      recomendaciones: `• Ayuno de 8 horas para sólidos y 2 horas para líquidos claros.
• Premedicación con Midazolam 2 mg IV en área de pabellón.
• Monitorización estándar básica ASA continua.
• Reservar 02 unidades de Concentrado Globular (CG).
• Confort térmico trans y postoperatorio (manta térmica).
• Analgesia multimodal preventiva y manejo oportuno del dolor.
• Protector gástrico con Omeprazol 40 mg IV previo a inducción.`,
      anestesio: 'Carlos Leal',
      cedula: '15489288',
      telefono: '04243291438'
    });
  };

  const handleClear = () => {
    setFormData({
      nombre: '',
      cedulaPaciente: '',
      direccion: '',
      edad: '',
      sexo: 'Masculino',
      fecha: new Date().toISOString().split('T')[0],
      hora: getCurrentTimeString(),
      servicio: '',
      diag: '',
      cirugia: '',
      antFam: '',
      antPers: '',
      alergias: '',
      alcohol: '',
      cirugiasPrev: '',
      peso: '70',
      fc: '',
      fr: '',
      ta: '',
      escalaChien: 'Grado I - Fácil (Puntos anatómicos bien palpables)',
      egriApertura: '> 4 cm (0 pts)',
      egriDtm: '> 6.5 cm (0 pts)',
      egriMallampati: 'Clase I (0 pts)',
      egriCervical: '> 90° (0 pts)',
      egriSubluxacion: 'Incisivos inf. por delante (0 pts)',
      egriPeso: '< 90 kg (0 pts)',
      egriHistoriaVad: 'Ausente / Negativa (0 pts)',
      mallampati: 'Clase I',
      dtm: '> 6.5 cm',
      apertura: '> 4 cm',
      cervical: '> 90°',
      cabeza: '',
      cardio: '',
      resp: '',
      abdomen: '',
      extremidades: '',
      neuro: '',
      hg: '',
      hto: '',
      leuco: '',
      plaquetas: '',
      grupoFactor: 'O Rh Positivo (+)',
      glicemia: '',
      creatinina: '',
      urea: '',
      pt: '',
      ptt: '',
      inr: '',
      pt_ptt: '',
      hiv: 'Negativo',
      vdrl: 'No reactivo',
      ekg: '',
      rx: '',
      evaluacionCardio: '',
      evaluacionNeumo: '',
      otrosLaboratorios: '',
      goldman: 'Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)',
      asa: 'ASA I',
      apto: 'SÍ (Apto)',
      recomendaciones: '',
      anestesio: '',
      cedula: '',
      telefono: ''
    });
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const generatePDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      // Clean and safe patient name for filename
      const rawName = (formData.nombre || '').trim();
      const cleanName = rawName
        ? rawName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9_\-\s]/g, '')
            .trim()
            .replace(/\s+/g, '_')
        : 'Paciente';
      
      const fileName = `Preanestesia_${cleanName}.pdf`;

      // Header Banner (Top bar across A4)
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 16.5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11.5);
      const patientTitle = rawName ? ` - ${rawName.toUpperCase()}` : '';
      doc.text(`ANESTESIAPRO - EVALUACIÓN PREANESTÉSICA${patientTitle}`, 10, 7.5);
      
      doc.setFontSize(8.0);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(203, 213, 225); // slate-300
      const evaluadorStr = formData.anestesio ? ` • Evaluador: Dr(a). ${formData.anestesio}` : '';
      doc.text(`Servicio de Anestesiología y Reanimación${evaluadorStr}`, 10, 13.0);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 197, 253);
      doc.text(`Fecha: ${formData.fecha || '---'} | Hora: ${formData.hora || '---'}`, 200, 10, { align: 'right' });

      // Robust bounded field renderer (Prevents ANY overlap between adjacent columns)
      const renderCell = (
        label: string, 
        value: string | number, 
        x: number, 
        yPos: number, 
        cellWidth: number, 
        isBold: boolean = false, 
        fontSize: number = 8.5
      ) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(fontSize);
        doc.setTextColor(30, 41, 59);
        
        const labelStr = label ? `${label}: ` : '';
        const labelW = labelStr ? doc.getTextWidth(labelStr) : 0;
        if (labelStr) {
          doc.text(labelStr, x, yPos);
        }

        doc.setFont('helvetica', isBold ? 'bold' : 'normal');
        doc.setTextColor(51, 65, 85);
        
        const availWidth = Math.max(10, cellWidth - labelW - 1.5);
        const valStr = (value || '---').toString();
        const splitVal = doc.splitTextToSize(valStr, availWidth);
        const lineToPrint = splitVal[0] || '---';
        doc.text(lineToPrint, x + labelW, yPos);
      };

      const addSectionHeader = (title: string, yPos: number) => {
        doc.setFillColor(241, 245, 249);
        doc.setDrawColor(203, 213, 225);
        doc.rect(10, yPos - 4.0, 190, 5.6, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.9);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text(title, 12, yPos);
      };

      // 1. IDENTIFICACIÓN Y DATOS QUIRÚRGICOS
      let y = 22.5;
      addSectionHeader('1. DATOS DE IDENTIFICACIÓN Y QUIRÚRGICOS', y);
      y += 6.2;
      renderCell('Paciente', formData.nombre, 10, y, 78, true, 8.8);
      renderCell('Cédula / ID', formData.cedulaPaciente || '---', 90, y, 44, true, 8.8);
      // Clean display text for Apto to never overflow or get cut
      const displayApto = formData.apto?.includes('DIFERIDO') 
        ? 'DIFERIDO' 
        : (formData.apto?.includes('NO') ? 'NO APTO' : 'SÍ (APTO)');
      renderCell('Apto para Cirugía', displayApto, 136, y, 64, true, 8.8);

      y += 5.6;
      renderCell('Edad', formData.edad, 10, y, 36, false, 8.4);
      renderCell('Sexo', formData.sexo, 48, y, 36, false, 8.4);
      renderCell('Servicio', formData.servicio || 'Cirugía General', 86, y, 56, true, 8.4);
      renderCell('Dirección', formData.direccion || '---', 145, y, 55, false, 8.4);

      y += 5.6;
      renderCell('Diagnóstico Preoperatorio', formData.diag || '---', 10, y, 190, false, 8.4);

      y += 5.6;
      renderCell('Cirugía Programada', formData.cirugia || '---', 10, y, 190, true, 8.4);

      // 2. ANTECEDENTES Y HÁBITOS
      y += 7.8;
      addSectionHeader('2. ANTECEDENTES MÉDICOS Y HÁBITOS', y);
      y += 6.2;
      renderCell('Patológicos Personales', formData.antPers || 'No refiere patologías crónicas', 10, y, 92, false, 8.4);
      renderCell('Patológicos Familiares', formData.antFam || 'No refiere', 105, y, 95, false, 8.4);

      y += 5.6;
      renderCell('Cirugías Previas', formData.cirugiasPrev || 'Ninguna referida', 10, y, 92, false, 8.4);
      renderCell('Hábitos / Tóxicos', formData.alcohol || 'Niega hábitos psicotóxicos', 105, y, 95, false, 8.4);

      y += 5.6;
      const isAllergy = formData.alergias && formData.alergias.toLowerCase() !== 'negativas' && formData.alergias.trim() !== '';
      renderCell('Alergias Conocidas', formData.alergias || 'Negativas', 10, y, 190, isAllergy, 8.4);

      // 3. EXAMEN FÍSICO Y VÍA AÉREA (EGRI)
      y += 7.8;
      addSectionHeader('3. EXAMEN FÍSICO E ÍNDICE DE VÍA AÉREA (EL-GANZOURI EGRI)', y);
      y += 6.2;
      renderCell('Signos Vitales', `Peso: ${formData.peso || '--'} kg | FC: ${formData.fc || '--'} lpm | FR: ${formData.fr || '--'} rpm | TA: ${formData.ta || '--'} mmHg`, 10, y, 120, false, 8.4);
      renderCell('Escala Chien (Neuroaxial)', formData.escalaChien || formData.escalaHien || 'Grado I - Fácil', 132, y, 68, true, 8.4);

      y += 5.6;
      renderCell('1. Apertura Bucal', formData.egriApertura || '> 4 cm (0 pts)', 10, y, 60, false, 8.4);
      renderCell('2. DTM', formData.egriDtm || '> 6.5 cm (0 pts)', 73, y, 60, false, 8.4);
      renderCell('3. Mallampati', formData.egriMallampati || 'Clase I (0 pts)', 136, y, 64, false, 8.4);

      y += 5.6;
      renderCell('4. Mov. Cervical', formData.egriCervical || '> 90° (0 pts)', 10, y, 60, false, 8.4);
      renderCell('5. Subluxación Mand.', formData.egriSubluxacion || 'Incisivos inf. delante (0)', 73, y, 60, false, 8.4);
      renderCell('6. Peso Corporal', formData.egriPeso || '< 90 kg (0 pts)', 136, y, 64, false, 8.4);

      y += 5.6;
      renderCell('7. Historia VAD', formData.egriHistoriaVad || 'Ausente / Negativa (0 pts)', 10, y, 75, false, 8.4);
      
      // Airway Score Summary Box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.rect(88, y - 3.5, 112, 5.4, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.4);
      if (riskCategory === 'Alto Riesgo (Vía Aérea Difícil)') {
        doc.setTextColor(185, 28, 28);
      } else if (riskCategory === 'Riesgo Moderado') {
        doc.setTextColor(180, 83, 9);
      } else {
        doc.setTextColor(21, 128, 61);
      }
      doc.text(`ÍNDICE EGRI: ${riskScore}/14 pts | RIESGO: ${riskCategory.toUpperCase()}`, 90, y + 0.4);

      y += 6.0;
      renderCell('Cabeza / Cuello', formData.cabeza || 'Normal, móvil, sin masas', 10, y, 92, false, 8.2);
      renderCell('Cardiovascular', formData.cardio || 'R1-R2 rítmicos, no soplos', 105, y, 95, false, 8.2);

      y += 5.4;
      renderCell('Respiratorio', formData.resp || 'Murmullo vesicular presente, sin ruidos agregados', 10, y, 92, false, 8.2);
      renderCell('Abdomen / Extr.', `${formData.abdomen || 'Blando, depresible'} | ${formData.extremidades || 'Sin edemas'}`, 105, y, 95, false, 8.2);

      // 4. PARACLÍNICOS Y VALORACIÓN DE RIESGO
      y += 7.8;
      addSectionHeader('4. PARACLÍNICOS Y VALORACIÓN DE RIESGO QUIRÚRGICO', y);
      y += 6.2;
      renderCell('Hb / Hematocrito', `${formData.hg || '---'} / ${formData.hto || '---'}`, 10, y, 62, false, 8.4);
      renderCell('Leucos / Plaquetas', `${formData.leuco || '---'} / ${formData.plaquetas || '---'}`, 75, y, 62, false, 8.4);
      renderCell('Grupo y Factor Rh', formData.grupoFactor || '---', 140, y, 60, true, 8.4);

      y += 5.6;
      renderCell('Glicemia', formData.glicemia || '---', 10, y, 62, false, 8.4);
      renderCell('Creatinina / Urea', `${formData.creatinina || '---'} / ${formData.urea || '---'}`, 75, y, 62, false, 8.4);
      renderCell('Serologías', `HIV: ${formData.hiv || '---'} | VDRL: ${formData.vdrl || '---'}`, 140, y, 60, false, 8.4);

      y += 5.6;
      renderCell('PT (Protrombina)', formData.pt || formData.pt_ptt || '---', 10, y, 62, false, 8.4);
      renderCell('INR', formData.inr || '1.0', 75, y, 28, false, 8.4);
      renderCell('PTT / TTPA', formData.ptt || '---', 105, y, 42, false, 8.4);
      renderCell('EKG / RX', `${formData.ekg || 'Normal'} | ${formData.rx || 'Normal'}`, 150, y, 50, false, 8.2);

      y += 5.6;
      const cvVal = formData.evaluacionCardio || 'Sin contraindicación cardiovascular';
      const neumVal = formData.evaluacionNeumo || 'Sin contraindicación neumonológica';
      renderCell('Val. Cardiovascular', cvVal, 10, y, 92, false, 8.2);
      renderCell('Eval. Neumonología', neumVal, 105, y, 95, false, 8.2);

      if (formData.otrosLaboratorios) {
        y += 5.4;
        renderCell('Otros Laboratorios', formData.otrosLaboratorios, 10, y, 190, false, 8.2);
      }

      y += 5.8;
      doc.setFillColor(241, 245, 249);
      doc.rect(10, y - 3.4, 190, 5.4, 'F');
      renderCell('Índice Goldman (Riesgo Cardíaco)', formData.goldman || 'Clase I (0-5 pts - Riesgo Muy Bajo 1%)', 12, y + 0.3, 85, true, 8.4);
      renderCell('Clasificación ASA', formData.asa || 'ASA I', 98, y + 0.3, 40, true, 8.4);
      renderCell('Apto para Cirugía', displayApto, 140, y + 0.3, 58, true, 8.4);

      // 5. RECOMENDACIONES Y PLAN ANESTÉSICO
      y += 8.0;
      addSectionHeader('5. RECOMENDACIONES, PLAN ANESTÉSICO Y PRESCRIPCIONES', y);
      y += 5.8;

      // Clean recommendations rendering
      const rawRecom = formData.recomendaciones?.trim() || '• Monitorización estándar básica ASA continua (ECG, PANI, SpO2, Capnografía).\n• Ayuno preoperatorio adecuado (8h sólidos / 2h líquidos claros) y confort térmico activo.';
      const recomLines = rawRecom
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.setTextColor(51, 65, 85);

      // Render recommendations with vertical boundary protection
      for (const line of recomLines) {
        if (y > 250) break; // Prevent overflow into signature block
        const splitWrapped = doc.splitTextToSize(line, 188);
        for (const subLine of splitWrapped) {
          if (y > 250) break;
          doc.text(subLine, 11, y);
          y += 4.6;
        }
      }

      // 6. FIRMA DEL ESPECIALISTA Y CONSENTIMIENTO INFORMADO (Fixed safe bottom area on Page 1)
      y = Math.max(y + 6, 256);
      if (y > 263) y = 260; // Hard cap guaranteeing 100% Page 1 placement

      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.4);
      doc.line(10, y + 2, 90, y + 2);
      doc.line(115, y + 2, 190, y + 2);

      y += 6.8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.6);
      doc.setTextColor(30, 41, 59);
      doc.text(`Anestesiólogo: Dr(a). ${formData.anestesio || 'Médico Anestesiólogo'}`, 10, y);
      doc.text('Firma / Huella del Paciente o Representante', 115, y);

      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(71, 85, 105);
      doc.text(`C.I. / Matrícula: ${formData.cedula || '---'}   •   Teléfono: ${formData.telefono || '---'}`, 10, y);
      doc.text(`Nombre: ${formData.nombre || 'Paciente'}   •   C.I.: ${formData.cedulaPaciente || '---'}`, 115, y);

      y += 4.3;
      doc.text('Servicio de Anestesiología y Reanimación', 10, y);
      doc.text('Consentimiento Informado Preanestésico Autorizado', 115, y);

      // Micro-Footer at absolute bottom
      doc.setDrawColor(226, 232, 240);
      doc.line(10, 287, 200, 287);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(148, 163, 184);
      doc.text(`AnestesiaPro App Clínica • Generado el ${formData.fecha || ''} ${formData.hora || ''} • Documento Médico Legal Confidencial • Hoja Única (1/1)`, 10, 291);

      // Store jsPDF document instance in ref for 100% reliable direct saving
      currentDocRef.current = doc;

      // Save and generate Blob
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Clean up previous blob URL if any to avoid memory leak
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      // Set PDF in state and display in-app preview modal first
      setPdfBlobData(pdfBlob);
      setPdfUrl(blobUrl);
      setPdfFileName(fileName);
      setShowPdfModal(true);

      // Record generation event
      recordPreanesthesiaUsage('evaluation_generated', formData.nombre);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor verifique los campos.');
    }
  };

  const handlePrintPdf = () => {
    if (!pdfUrl && !pdfBlobData && !currentDocRef.current) return;
    
    // Method 1: Try iframe print if available and same-origin
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.focus();
        iframeRef.current.contentWindow.print();
        return;
      } catch (err) {
        console.warn('Iframe print failed, using new tab print fallback:', err);
      }
    }

    // Method 2: Open in new tab and auto trigger print dialog
    if (pdfUrl) {
      const printTab = window.open(pdfUrl, '_blank');
      if (printTab) {
        printTab.focus();
        setTimeout(() => {
          try {
            printTab.print();
          } catch (e) {
            console.log('User can trigger print from the tab dialog', e);
          }
        }, 500);
      }
    }
  };

  const handleDirectDownload = () => {
    const targetName = pdfFileName || `Preanestesia_${(formData.nombre || 'Paciente').trim().replace(/\s+/g, '_')}.pdf`;

    setIsDownloading(true);
    recordPreanesthesiaUsage('evaluation_downloaded', formData.nombre);

    let downloaded = false;

    // Method 1: jsPDF direct save (bulletproof on all browsers)
    if (currentDocRef.current) {
      try {
        currentDocRef.current.save(targetName);
        downloaded = true;
      } catch (docErr) {
        console.warn('jsPDF save failed, trying DOM link fallback:', docErr);
      }
    }

    // Method 2: Blob anchor download fallback
    if (!downloaded && (pdfBlobData || pdfUrl)) {
      try {
        const downloadBlob = pdfBlobData;
        const urlToUse = downloadBlob ? URL.createObjectURL(downloadBlob) : (pdfUrl || '');
        
        const link = document.createElement('a');
        link.href = urlToUse;
        link.download = targetName;
        link.setAttribute('target', '_blank');
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
          }
          if (downloadBlob && urlToUse !== pdfUrl) {
            URL.revokeObjectURL(urlToUse);
          }
        }, 300);
        downloaded = true;
      } catch (err) {
        console.error('Blob link download error:', err);
      }
    }

    // Method 3: window.open as absolute last resort
    if (!downloaded && pdfUrl) {
      window.open(pdfUrl, '_blank');
      downloaded = true;
    }

    setIsDownloading(false);
    
    // Display prominent confirmation toast
    setDownloadSuccessMsg(`¡PDF descargado con éxito!: ${targetName}`);
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 4500);
  };

  const handleSharePdf = async () => {
    const targetBlob = pdfBlobData;
    const targetName = pdfFileName || 'Evaluacion_Preanestesica.pdf';

    setIsSharing(true);
    recordPreanesthesiaUsage('evaluation_shared', formData.nombre);

    try {
      let blob = targetBlob;
      if (!blob && pdfUrl) {
        const response = await fetch(pdfUrl);
        blob = await response.blob();
      }

      if (blob) {
        const file = new File([blob], targetName, { type: 'application/pdf' });
        
        // Native Web Share API with File support (Android / iOS Safari / Chrome Mobile)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Evaluación Preanestésica - ${formData.nombre || 'Paciente'}`,
            text: `Evaluación Preanestésica de ${formData.nombre || 'Paciente'} • Cirugía: ${formData.cirugia || 'Programada'} • Servicio: ${formData.servicio || 'Anestesiología'}`
          });
          setIsSharing(false);
          return;
        }

        // Native Web Share API with text/url fallback
        if (navigator.share) {
          await navigator.share({
            title: `Evaluación Preanestésica - ${formData.nombre || 'Paciente'}`,
            text: `Evaluación Preanestésica de ${formData.nombre || 'Paciente'} • Cirugía: ${formData.cirugia || 'Programada'} • Apto: ${formData.apto || 'SÍ'}`
          });
          setIsSharing(false);
          return;
        }
      }

      // If Web Share is not supported (Desktop Chrome/Firefox), provide WhatsApp message fallback or download
      const summaryText = encodeURIComponent(
        `*ANESTESIAPRO - EVALUACIÓN PREANESTÉSICA*\n` +
        `*Paciente:* ${formData.nombre || '---'}\n` +
        `*Cédula:* ${formData.cedulaPaciente || '---'} | *Edad:* ${formData.edad || '---'}\n` +
        `*Servicio:* ${formData.servicio || '---'}\n` +
        `*Cirugía:* ${formData.cirugia || '---'}\n` +
        `*Apto para Cirugía:* ${formData.apto || 'SÍ'}\n` +
        `*ASA:* ${formData.asa || '---'} | *Goldman:* ${formData.goldman || '---'}\n` +
        `*Índice EGRI:* ${riskScore}/14 pts (${riskCategory})\n` +
        `*Anestesiólogo:* Dr(a). ${formData.anestesio || '---'}`
      );

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const whatsappUrl = isMobile 
        ? `whatsapp://send?text=${summaryText}` 
        : `https://api.whatsapp.com/send?text=${summaryText}`;

      // Trigger download so user has the PDF file ready to attach
      handleDirectDownload();
      
      // Also open WhatsApp if user desires
      const openWhatsApp = window.confirm('Se ha descargado el PDF oficial. ¿Deseas abrir WhatsApp para compartir el resumen clínico y adjuntar el archivo?');
      if (openWhatsApp) {
        window.open(whatsappUrl, '_blank');
      }

    } catch (shareErr: any) {
      if (shareErr.name !== 'AbortError') {
        console.warn('Share cancelled or unavailable, falling back to download:', shareErr);
        handleDirectDownload();
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 border border-blue-800 rounded-2xl p-5 md:p-6 shadow-lg relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <FileText className="w-48 h-48 text-cyan-300" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Módulo Clínico Oficial
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold px-2.5 py-1 rounded-full">
                AnestesiaPro v2.5
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2">
              Formato de Evaluación Preanestésica e Índice de Riesgo
            </h2>
            <p className="text-xs md:text-sm text-blue-100/90 mt-1 max-w-2xl">
              Diligencie los datos clínicos del paciente. Incluye el cálculo ponderado del Índice de Vía Aérea en 7 acápites y exportación en PDF.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadSampleData}
              className="flex items-center gap-2 bg-blue-600/40 hover:bg-blue-600/60 text-white border border-blue-400/40 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" /> Cargar Ejemplo
            </button>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Limpiar
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-white" /> Ver / Exportar PDF
            </button>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <WhatsAppShareBanner
        title="Formato de Evaluación Preanestésica Digital con Informe PDF"
        description="Evaluación clínica preoperatoria completa: cálculo automático de riesgo de vía aérea (EGRI), predictores clínicos y generación inmediata de informe médico oficial en PDF listo para firmar e imprimir."
        tabParam="preanestesia"
        shareText="🩺 Colega, te recomiendo revisar el Formato de Evaluación Preanestésica Digital en AnestesiaPro: cálculo automático del índice EGRI de vía aérea, predictores clínicos y exportación inmediata del informe médico oficial en PDF:"
        theme="cyan"
      />

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* 1. Datos de Identificación y Quirúrgicos */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">1. Datos de Identificación y Quirúrgicos</h3>
              <p className="text-xs text-slate-400">Información básica del paciente y de la cirugía programada</p>
            </div>
          </div>

          {/* Grid limpio de 2 Columnas para datos sencillos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Nombres y Apellidos del Paciente
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Pedro Pérez"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-cyan-300 mb-1">
                Cédula del Paciente / Documento ID
              </label>
              <input
                type="text"
                id="cedulaPaciente"
                value={formData.cedulaPaciente || ''}
                onChange={handleChange}
                placeholder="Ej. V-15.489.288"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-cyan-300 mb-1">
                Especialidad / Servicio Quirúrgico Tratante
              </label>
              <select
                id="servicio"
                value={formData.servicio || 'Cirugía General'}
                onChange={handleChange}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none font-medium cursor-pointer"
              >
                <option value="Cirugía General">Cirugía General</option>
                <option value="Traumatología y Ortopedia">Traumatología y Ortopedia</option>
                <option value="Ginecología y Obstetricia">Ginecología y Obstetricia</option>
                <option value="Urología">Urología</option>
                <option value="Neurocirugía">Neurocirugía</option>
                <option value="Cirugía Pediátrica">Cirugía Pediátrica</option>
                <option value="Cirugía Plástica y Reconstructiva">Cirugía Plástica y Reconstructiva</option>
                <option value="Cirugía Cardiovascular">Cirugía Cardiovascular</option>
                <option value="Cirugía de Tórax / Torácica">Cirugía de Tórax / Torácica</option>
                <option value="Cirugía Oncológica">Cirugía Oncológica</option>
                <option value="Otorrinolaringología (ORL)">Otorrinolaringología (ORL)</option>
                <option value="Oftalmología">Oftalmología</option>
                <option value="Cirugía Maxilofacial">Cirugía Maxilofacial</option>
                <option value="Cirugía Bariátrica y Metabólica">Cirugía Bariátrica y Metabólica</option>
                <option value="Angiología y Cirugía Vascular">Angiología y Cirugía Vascular</option>
                <option value="Coloproctología">Coloproctología</option>
                <option value="Mastología">Mastología</option>
                <option value="Gastroenterología / Procedimientos Endoscópicos">Gastroenterología / Procedimientos Endoscópicos</option>
                <option value="Hemodinamia / Cardiología Intervencionista">Hemodinamia / Cardiología Intervencionista</option>
                <option value="Radiología Intervencionista">Radiología Intervencionista</option>
                <option value="Dermatología Quirúrgica">Dermatología Quirúrgica</option>
                <option value="Otro Servicio / Procedimiento Fuera de Pabellón">Otro Servicio / Fuera de Pabellón</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Dirección del Paciente
              </label>
              <input
                type="text"
                id="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej. Urb. Los Olivos, Calle 5, Casa 12"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Edad</label>
              <input
                type="text"
                id="edad"
                value={formData.edad}
                onChange={handleChange}
                placeholder="Ej. 42 años"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Sexo</label>
              <select
                id="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Fecha</label>
              <input
                type="date"
                id="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-extrabold uppercase text-slate-400">Hora</label>
                <button
                  type="button"
                  onClick={setCurrentTimeToNow}
                  title="Actualizar con la hora local actual"
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer bg-cyan-950/40 hover:bg-cyan-900/50 px-1.5 py-0.5 rounded border border-cyan-500/30 transition-all"
                >
                  <Clock className="w-2.5 h-2.5" /> Ahora
                </button>
              </div>
              <input
                type="time"
                id="hora"
                value={formData.hora}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Diagnóstico Preoperatorio
              </label>
              <input
                type="text"
                id="diag"
                value={formData.diag}
                onChange={handleChange}
                placeholder="Ej. Hernia inguinal derecha / Colecistitis crónica"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Cirugía Programada
              </label>
              <input
                type="text"
                id="cirugia"
                value={formData.cirugia}
                onChange={handleChange}
                placeholder="Ej. Hernioplastia inguinal con malla / Colecistectomía laparoscópica"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Antecedentes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">2. Antecedentes Médicos y Quirúrgicos</h3>
                <p className="text-xs text-slate-400">Patologías, alergias y antecedentes de cirugías o anestesias previas</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillNormalAntecedents}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Niega Todos los Antecedentes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Patológicos Familiares
              </label>
              <textarea
                id="antFam"
                rows={2}
                value={formData.antFam}
                onChange={handleChange}
                placeholder="Hipertensión, diabetes, hipertermia maligna..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Patológicos Personales
              </label>
              <textarea
                id="antPers"
                rows={2}
                value={formData.antPers}
                onChange={handleChange}
                placeholder="HTA, Asma, Diabetes, Cardiopatías..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:col-span-2">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Alergias</label>
                <input
                  type="text"
                  id="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Medicamentos, Látex..."
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                  Alcohol / Hábitos
                </label>
                <input
                  type="text"
                  id="alcohol"
                  value={formData.alcohol}
                  onChange={handleChange}
                  placeholder="Cigarrillo, alcohol, psicotrópicos..."
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                  Cirugías Previas
                </label>
                <input
                  type="text"
                  id="cirugiasPrev"
                  value={formData.cirugiasPrev}
                  onChange={handleChange}
                  placeholder="Años, intervenciones..."
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Examen Físico e Índice de Riesgo de Vía Aérea (7 Acápites) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  3. Examen Físico e Índice de Riesgo de Vía Aérea (7 Acápites)
                </h3>
                <p className="text-xs text-slate-400">Signos vitales y predictores antropométricos de ventilación/intubación</p>
              </div>
            </div>
            <button
              type="button"
              onClick={fillNormalPhysicalExam}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Examen Físico Normal Completo
            </button>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Peso (kg)</label>
              <input
                type="text"
                id="peso"
                value={formData.peso}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none font-bold text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">FC (lpm)</label>
              <input
                type="text"
                id="fc"
                value={formData.fc}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">FR (rpm)</label>
              <input
                type="text"
                id="fr"
                value={formData.fr}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none text-center"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">TA (mmHg)</label>
              <input
                type="text"
                id="ta"
                value={formData.ta}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none text-center"
              />
            </div>
          </div>

          {/* Escala de Chien - Dificultad Bloqueo Neuroaxial */}
          <div className="bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-800/60 mb-5">
            <label className="block text-[11px] font-extrabold uppercase text-cyan-300 mb-1">
              Escala de Chien (Valoración de Dificultad de Bloqueo Neuroaxial)
            </label>
            <select
              id="escalaChien"
              value={formData.escalaChien || formData.escalaHien || ''}
              onChange={handleChange}
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-medium"
            >
              <option value="Grado I - Fácil (Puntos anatómicos bien palpables)">
                Grado I: Fácil - Puntos de referencia anatómicos bien palpables (Espinosas C7-L5)
              </option>
              <option value="Grado II - Moderado (Puntos difusos, requiere palpación profunda)">
                Grado II: Moderado - Puntos de referencia difusos o dudosos (Palpación profunda/ligera deformidad)
              </option>
              <option value="Grado III - Difícil (Puntos impalpables, obesidad/escoliosis/cirugía)">
                Grado III: Difícil - Puntos impalpables (Obesidad mórbida, escoliosis severa, cirugía previa)
              </option>
            </select>
          </div>

          {/* EGRI: Índice Multivariado de El-Ganzouri (7 Parámetros) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3.5">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  🧮 Índice de Riesgo Multivariado de El-Ganzouri (EGRI)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Predictor multivariado ponderado para intubación y vía aérea difícil (0 - 14 pts)
                </p>
              </div>
              <span className="text-[10px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded-full font-bold self-start sm:self-auto">
                Corte: &ge; 4 pts = VAD Prevista
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* 1. Apertura Bucal */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  1. Apertura Bucal (Interincisivos)
                </label>
                <select
                  id="egriApertura"
                  value={formData.egriApertura || '> 4 cm (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="> 4 cm (0 pts)">&gt; 4 cm (0 pts)</option>
                  <option value="3 – 4 cm (1 pt)">3 – 4 cm (+1 pt)</option>
                  <option value="< 3 cm (2 pts)">&lt; 3 cm (+2 pts)</option>
                </select>
              </div>

              {/* 2. Distancia Tiromentoniana */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  2. Distancia Tiromentoniana (DTM)
                </label>
                <select
                  id="egriDtm"
                  value={formData.egriDtm || '> 6.5 cm (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="> 6.5 cm (0 pts)">&gt; 6.5 cm (0 pts)</option>
                  <option value="6 – 6.5 cm (1 pt)">6 – 6.5 cm (+1 pt)</option>
                  <option value="< 6 cm (2 pts)">&lt; 6 cm (+2 pts)</option>
                </select>
              </div>

              {/* 3. Mallampati */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  3. Clasificación de Mallampati
                </label>
                <select
                  id="egriMallampati"
                  value={formData.egriMallampati || 'Clase I (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="Clase I (0 pts)">Clase I: Visibilidad total (0 pts)</option>
                  <option value="Clase II (1 pt)">Clase II: Úvula parcial (+1 pt)</option>
                  <option value="Clase III / IV (2 pts)">Clase III / IV: Paladar blando/duro (+2 pts)</option>
                </select>
              </div>

              {/* 4. Movilidad Cervical */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  4. Movilidad Cervical
                </label>
                <select
                  id="egriCervical"
                  value={formData.egriCervical || '> 90° (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="> 90° (0 pts)">&gt; 90° / Normal (0 pts)</option>
                  <option value="80 – 90° (1 pt)">80 – 90° / Leve limitación (+1 pt)</option>
                  <option value="< 80° (2 pts)">&lt; 80° / Severa limitación (+2 pts)</option>
                </select>
              </div>

              {/* 5. Subluxación Mandibular */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  5. Subluxación Mandibular (Bite Test)
                </label>
                <select
                  id="egriSubluxacion"
                  value={formData.egriSubluxacion || 'Incisivos inf. por delante (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="Incisivos inf. por delante (0 pts)">Incisivos inf. sobrepasan superiores (0 pts)</option>
                  <option value="Pueden alinear (1 pt)">Incisivos alinean borde a borde (+1 pt)</option>
                  <option value="No pueden alinear (2 pts)">No alcanzan a alinear (+2 pts)</option>
                </select>
              </div>

              {/* 6. Peso Corporal */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  6. Peso Corporal
                </label>
                <select
                  id="egriPeso"
                  value={formData.egriPeso || '< 90 kg (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="< 90 kg (0 pts)">&lt; 90 kg (0 pts)</option>
                  <option value="90-110 kg (1 pt)">90 – 110 kg (+1 pt)</option>
                  <option value="> 110 kg (2 pts)">&gt; 110 kg (+2 pts)</option>
                </select>
              </div>

              {/* 7. Historia Vía Aérea Difícil */}
              <div className="md:col-span-3">
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  7. Historia de Vía Aérea Difícil (VAD)
                </label>
                <select
                  id="egriHistoriaVad"
                  value={formData.egriHistoriaVad || 'Ausente / Negativa (0 pts)'}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-cyan-400"
                >
                  <option value="Ausente / Negativa (0 pts)">Ausente / Negativa / Sin antecedentes de intubación difícil (0 pts)</option>
                  <option value="Presente / Antecedente (+) (+2 pts)">Presente / Documentada previamente en historia clínica (+2 pts)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Risk Score Badge */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 transition-all ${
              riskLevel === 'low'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : riskLevel === 'moderate'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-rose-950/50 border-rose-500/60 text-rose-300 animate-pulse'
            }`}
          >
            <div className="flex items-center gap-3">
              {riskLevel === 'high' ? (
                <AlertTriangle className="w-7 h-7 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              )}
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider opacity-80 block">
                  Índice de El-Ganzouri (EGRI - 7 Parámetros)
                </span>
                <span className="text-base font-black">
                  Puntaje: {riskScore} / 14 pts &bull; {riskCategory}
                </span>
              </div>
            </div>

            <span
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                riskLevel === 'low'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : riskLevel === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/30 text-rose-200 border border-rose-500/50'
              }`}
            >
              {riskLevel === 'low' ? 'Bajo Riesgo (<4 pts)' : riskLevel === 'moderate' ? 'VAD Probable (4-7 pts)' : 'ALTO RIESGO (≥8 pts)'}
            </span>
          </div>

          {/* Physical exam systems */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Cabeza y Cuello</label>
              <input
                type="text"
                id="cabeza"
                value={formData.cabeza}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Cardiovascular</label>
              <input
                type="text"
                id="cardio"
                value={formData.cardio}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Respiratorio</label>
              <input
                type="text"
                id="resp"
                value={formData.resp}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Abdomen</label>
              <input
                type="text"
                id="abdomen"
                value={formData.abdomen}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Extremidades y Columna</label>
              <input
                type="text"
                id="extremidades"
                value={formData.extremidades}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Neurológico</label>
              <input
                type="text"
                id="neuro"
                value={formData.neuro}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. Paraclínicos y Clasificación ASA */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">4. Exámenes Paraclínicos y Clasificación de Riesgo</h3>
                <p className="text-xs text-slate-400">Laboratorios con autocompletado/unidad automática y estratificación clínica</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fillNormalLaboratories}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Laboratorios Normales
              </button>
              <button
                type="button"
                onClick={fillAnemiaLaboratories}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Droplets className="w-3.5 h-3.5 text-rose-400" /> Anemia Leve
              </button>
            </div>
          </div>

          {/* Datalists for quick numeric/clinical laboratory inputs */}
          <datalist id="hgOptions">
            <option value="14.5 g/dL">Normal Alto (14.5 g/dL)</option>
            <option value="13.5 g/dL">Normal (13.5 g/dL)</option>
            <option value="12.0 g/dL">Normal Límite (12.0 g/dL)</option>
            <option value="11.0 g/dL">Anemia Leve (11.0 g/dL)</option>
            <option value="10.0 g/dL">Anemia Moderada (10.0 g/dL)</option>
            <option value="8.5 g/dL">Anemia Severa (8.5 g/dL)</option>
            <option value="145 g/L">145 g/L (SI / Europa)</option>
            <option value="8.5 mmol/L">8.5 mmol/L (UK / Internacional)</option>
          </datalist>

          <datalist id="htoOptions">
            <option value="45 %">45 % (Normal alto)</option>
            <option value="42 %">42 % (Normal)</option>
            <option value="40 %">40 % (Normal)</option>
            <option value="36 %">36 % (Límite bajo)</option>
            <option value="32 %">32 % (Disminuido)</option>
            <option value="28 %">28 % (Bajo)</option>
            <option value="0.42 L/L">0.42 L/L (Fracción SI)</option>
          </datalist>

          <datalist id="leucoOptions">
            <option value="7,500 /mm³">7,500 /mm³ (Normal)</option>
            <option value="6,000 /mm³">6,000 /mm³ (Normal)</option>
            <option value="8,500 /mm³">8,500 /mm³ (Normal)</option>
            <option value="11,500 /mm³">11,500 /mm³ (Leucocitosis leve)</option>
            <option value="14,000 /mm³">14,000 /mm³ (Leucocitosis moderada)</option>
            <option value="4,200 /mm³">4,200 /mm³ (Leucopenia leve)</option>
            <option value="7.5 x10⁹/L">7.5 x10⁹/L (SI)</option>
          </datalist>

          <datalist id="plaqOptions">
            <option value="250,000 /mm³">250,000 /mm³ (Normal)</option>
            <option value="200,000 /mm³">200,000 /mm³ (Normal)</option>
            <option value="300,000 /mm³">300,000 /mm³ (Normal alto)</option>
            <option value="140,000 /mm³">140,000 /mm³ (Trombocitopenia leve)</option>
            <option value="90,000 /mm³">90,000 /mm³ (Trombocitopenia moderada)</option>
            <option value="50,000 /mm³">50,000 /mm³ (Trombocitopenia severa)</option>
            <option value="250 x10⁹/L">250 x10⁹/L (SI)</option>
          </datalist>

          <datalist id="glicOptions">
            <option value="90 mg/dL">90 mg/dL (Euglucemia)</option>
            <option value="85 mg/dL">85 mg/dL (Normal)</option>
            <option value="105 mg/dL">105 mg/dL (Glucemia alterada en ayunas)</option>
            <option value="130 mg/dL">130 mg/dL (Hiperglucemia leve)</option>
            <option value="160 mg/dL">160 mg/dL (Hiperglucemia moderada)</option>
            <option value="200 mg/dL">200 mg/dL (Hiperglucemia severa)</option>
            <option value="5.0 mmol/L">5.0 mmol/L (Normal SI)</option>
            <option value="7.0 mmol/L">7.0 mmol/L (Elevada SI)</option>
          </datalist>

          <datalist id="creaOptions">
            <option value="0.7 mg/dL">0.7 mg/dL (Normal)</option>
            <option value="0.8 mg/dL">0.8 mg/dL (Normal)</option>
            <option value="1.0 mg/dL">1.0 mg/dL (Normal)</option>
            <option value="1.3 mg/dL">1.3 mg/dL (Límite alto)</option>
            <option value="1.6 mg/dL">1.6 mg/dL (Elevada leve)</option>
            <option value="2.2 mg/dL">2.2 mg/dL (Falla renal moderada)</option>
            <option value="70 µmol/L">70 µmol/L (Normal SI)</option>
            <option value="120 µmol/L">120 µmol/L (Elevada SI)</option>
          </datalist>

          <datalist id="ureaOptions">
            <option value="20 mg/dL">20 mg/dL (Normal)</option>
            <option value="25 mg/dL">25 mg/dL (Normal)</option>
            <option value="35 mg/dL">35 mg/dL (Normal)</option>
            <option value="45 mg/dL">45 mg/dL (Límite superior)</option>
            <option value="60 mg/dL">60 mg/dL (Azotemia leve)</option>
            <option value="90 mg/dL">90 mg/dL (Azotemia moderada)</option>
            <option value="4.5 mmol/L">4.5 mmol/L (Normal SI)</option>
            <option value="15 mg/dL BUN">15 mg/dL (BUN normal)</option>
          </datalist>

          <datalist id="ptOptions">
            <option value="12.0 s (Control: 12s - 100%)">12.0 s (Control: 12s - 100%)</option>
            <option value="11.5 s (INR 1.0)">11.5 s (INR 1.0 - Normal)</option>
            <option value="13.5 s (INR 1.15)">13.5 s (INR 1.15 - Límite)</option>
            <option value="15.0 s (INR 1.35)">15.0 s (INR 1.35 - Prolongado leve)</option>
            <option value="18.0 s (INR 1.6)">18.0 s (INR 1.6 - Prolongado moderado)</option>
            <option value="22.0 s (INR 2.0)">22.0 s (INR 2.0 - Anticoagulado)</option>
            <option value="28.0 s (INR 2.8)">28.0 s (INR 2.8 - Anticoagulado)</option>
            <option value="No realizado / Pendiente">No realizado / Pendiente</option>
          </datalist>

          <datalist id="pttOptions">
            <option value="30.0 s (Control: 30s)">30.0 s (Control: 30s - Normal)</option>
            <option value="28.0 s (Normal)">28.0 s (Normal)</option>
            <option value="32.0 s (Normal)">32.0 s (Normal)</option>
            <option value="36.0 s (Límite superior)">36.0 s (Límite superior)</option>
            <option value="42.0 s (Prolongado leve)">42.0 s (Prolongado leve)</option>
            <option value="55.0 s (Heparinizado)">55.0 s (Heparinizado / Terapéutico)</option>
            <option value="> 70 s (Prolongado severo)">&gt; 70 s (Prolongado severo)</option>
            <option value="No realizado / Pendiente">No realizado / Pendiente</option>
          </datalist>

          <datalist id="inrOptions">
            <option value="1.0">1.0 (Normal)</option>
            <option value="1.1">1.1 (Normal)</option>
            <option value="1.2">1.2 (Límite superior)</option>
            <option value="1.5">1.5 (Riesgo moderado sangrado)</option>
            <option value="2.0 - 3.0">2.0 - 3.0 (Rango terapéutico Warfarina)</option>
            <option value="2.5 - 3.5">2.5 - 3.5 (Válvula mecánica)</option>
          </datalist>

          <datalist id="ekgOptions">
            <option value="RITMO SINUSAL, FC 75 LPM, SIN ALTERACIONES" />
            <option value="Ritmo sinusal regular, FC 70 lpm, sin signos de isquemia ni arritmias" />
            <option value="Taquicardia sinusal, FC 105 lpm" />
            <option value="Bradicardia sinusal, FC 52 lpm" />
            <option value="Bloqueo incompleto de rama derecha del Haz de His" />
            <option value="Hipertrofia ventricular izquierda con sobrecarga" />
            <option value="Extrasístoles ventriculares aisladas" />
            <option value="No evaluado / Pendiente" />
          </datalist>

          <datalist id="rxOptions">
            <option value="CAMPOS PULMONARES CLAROS, SILUETA CARDÍACA NORMAL" />
            <option value="Sin lesiones pleuropulmonares agudas activas" />
            <option value="Cardiomegalia radiológica leve" />
            <option value="Acentuación de la trama broncovascular bilateral" />
            <option value="Signos de enfisema / hiperinsuflación pulmonar" />
            <option value="No realizada / No requerida" />
          </datalist>

          {/* Hematología y Química Sanguínea */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 mb-4">
            {/* Hemoglobina */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Hb / Hemoglobina
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">12-16 g/dL</span>
              </div>
              <input
                type="text"
                id="hg"
                list="hgOptions"
                value={formData.hg}
                onChange={handleChange}
                onBlur={() => handleLabBlur('hg', 'g/dL')}
                placeholder="Ej. 13.5 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.hg.match(/[\d.]+/)?.[0] || '13.5';
                      setFormData(p => ({ ...p, hg: `${num} g/dL` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    g/dL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.hg.match(/[\d.]+/)?.[0] || '135';
                      setFormData(p => ({ ...p, hg: `${num} g/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    g/L
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.hg.match(/[\d.]+/)?.[0] || '8.4';
                      setFormData(p => ({ ...p, hg: `${num} mmol/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    mmol/L
                  </button>
                </div>
              </div>
            </div>

            {/* Hematocrito */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Hematocrito (Hto)
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">36-50 %</span>
              </div>
              <input
                type="text"
                id="hto"
                list="htoOptions"
                value={formData.hto}
                onChange={handleChange}
                onBlur={() => handleLabBlur('hto', '%')}
                placeholder="Ej. 40 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.hto.match(/[\d.]+/)?.[0] || '40';
                      setFormData(p => ({ ...p, hto: `${num} %` }));
                    }}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    %
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.hto.match(/[\d.]+/)?.[0] || '0.40';
                      setFormData(p => ({ ...p, hto: `${num} L/L` }));
                    }}
                    className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    L/L (SI)
                  </button>
                </div>
              </div>
            </div>

            {/* Leucocitos */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Leucocitos (GB)
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">4.5-10k /mm³</span>
              </div>
              <input
                type="text"
                id="leuco"
                list="leucoOptions"
                value={formData.leuco}
                onChange={handleChange}
                onBlur={() => handleLabBlur('leuco', '/mm³')}
                placeholder="Ej. 7500 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.leuco.match(/[\d.,]+/)?.[0] || '7,500';
                      setFormData(p => ({ ...p, leuco: `${num} /mm³` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    /mm³
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.leuco.match(/[\d.,]+/)?.[0] || '7.5';
                      setFormData(p => ({ ...p, leuco: `${num} x10⁹/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    x10⁹/L
                  </button>
                </div>
              </div>
            </div>

            {/* Plaquetas */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Plaquetas (PLQ)
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">150-450k</span>
              </div>
              <input
                type="text"
                id="plaquetas"
                list="plaqOptions"
                value={formData.plaquetas}
                onChange={handleChange}
                onBlur={() => handleLabBlur('plaquetas', '/mm³')}
                placeholder="Ej. 250000 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.plaquetas.match(/[\d.,]+/)?.[0] || '250,000';
                      setFormData(p => ({ ...p, plaquetas: `${num} /mm³` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    /mm³
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.plaquetas.match(/[\d.,]+/)?.[0] || '250';
                      setFormData(p => ({ ...p, plaquetas: `${num} x10⁹/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    x10⁹/L
                  </button>
                </div>
              </div>
            </div>

            {/* Glicemia */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Glicemia / Glucosa
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">70-99 mg/dL</span>
              </div>
              <input
                type="text"
                id="glicemia"
                list="glicOptions"
                value={formData.glicemia}
                onChange={handleChange}
                onBlur={() => handleLabBlur('glicemia', 'mg/dL')}
                placeholder="Ej. 90 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.glicemia.match(/[\d.]+/)?.[0] || '90';
                      setFormData(p => ({ ...p, glicemia: `${num} mg/dL` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    mg/dL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.glicemia.match(/[\d.]+/)?.[0] || '5.0';
                      setFormData(p => ({ ...p, glicemia: `${num} mmol/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    mmol/L
                  </button>
                </div>
              </div>
            </div>

            {/* Creatinina */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Creatinina Sérica
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">0.6-1.2 mg/dL</span>
              </div>
              <input
                type="text"
                id="creatinina"
                list="creaOptions"
                value={formData.creatinina}
                onChange={handleChange}
                onBlur={() => handleLabBlur('creatinina', 'mg/dL')}
                placeholder="Ej. 0.8 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.creatinina.match(/[\d.]+/)?.[0] || '0.8';
                      setFormData(p => ({ ...p, creatinina: `${num} mg/dL` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    mg/dL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.creatinina.match(/[\d.]+/)?.[0] || '71';
                      setFormData(p => ({ ...p, creatinina: `${num} µmol/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    µmol/L
                  </button>
                </div>
              </div>
            </div>

            {/* Urea */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-slate-300">
                  Urea / BUN
                </label>
                <span className="text-[9px] text-cyan-400 font-bold">15-40 mg/dL</span>
              </div>
              <input
                type="text"
                id="urea"
                list="ureaOptions"
                value={formData.urea}
                onChange={handleChange}
                onBlur={() => handleLabBlur('urea', 'mg/dL')}
                placeholder="Ej. 25 o escribir cifra"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-1.5"
              />
              <div className="flex items-center justify-between gap-1 text-[9px] text-slate-400">
                <span>Escala:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.urea.match(/[\d.]+/)?.[0] || '25';
                      setFormData(p => ({ ...p, urea: `${num} mg/dL` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    Urea
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.urea.match(/[\d.]+/)?.[0] || '12';
                      setFormData(p => ({ ...p, urea: `${num} mg/dL BUN` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    BUN
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = formData.urea.match(/[\d.]+/)?.[0] || '4.2';
                      setFormData(p => ({ ...p, urea: `${num} mmol/L` }));
                    }}
                    className="px-1 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[8px] font-bold"
                  >
                    mmol/L
                  </button>
                </div>
              </div>
            </div>

            {/* Grupo y Factor Rh */}
            <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-extrabold uppercase text-cyan-300">
                  Grupo y Factor Rh
                </label>
                <span className="text-[9px] text-emerald-400 font-bold">Hemoclasificación</span>
              </div>
              <select
                id="grupoFactor"
                value={formData.grupoFactor || 'O Rh Positivo (+)'}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-semibold mb-1.5"
              >
                <option value="O Rh Positivo (+)">O Rh Positivo (O+)</option>
                <option value="O Rh Negativo (-)">O Rh Negativo (O-)</option>
                <option value="A Rh Positivo (+)">A Rh Positivo (A+)</option>
                <option value="A Rh Negativo (-)">A Rh Negativo (A-)</option>
                <option value="B Rh Positivo (+)">B Rh Positivo (B+)</option>
                <option value="B Rh Negativo (-)">B Rh Negativo (B-)</option>
                <option value="AB Rh Positivo (+)">AB Rh Positivo (AB+)</option>
                <option value="AB Rh Negativo (-)">AB Rh Negativo (AB-)</option>
                <option value="No realizado / Pendiente">No realizado / Pendiente</option>
              </select>
              <div className="text-[9px] text-slate-400 truncate">
                Compatibilidad universal: {formData.grupoFactor?.includes('O-') ? 'Donante Universal' : formData.grupoFactor?.includes('AB+') ? 'Receptor Universal' : 'Estándar'}
              </div>
            </div>
          </div>

          {/* Panel de Coagulación Separado (PT, INR, PTT) */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-cyan-500/20 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <h4 className="text-xs font-extrabold uppercase text-cyan-300 tracking-wider">
                  Panel de Coagulación (PT, INR y PTT / TTPA Separados)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Control de Hemostasia Quirúrgica</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* PT - Tiempo de Protrombina */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-cyan-300">
                    PT (Tiempo de Protrombina)
                  </label>
                  <span className="text-[9px] text-emerald-400 font-bold">11 - 13.5 s (100%)</span>
                </div>
                <input
                  type="text"
                  id="pt"
                  list="ptOptions"
                  value={formData.pt || ''}
                  onChange={handleChange}
                  placeholder="Ej. 12.0 s (Control: 12s - 100%)"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, pt: '12.0 s (Control: 12s - 100%)', inr: '1.0' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[9px] font-bold border border-slate-700"
                  >
                    ✅ 12.0s (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, pt: '15.0 s (INR 1.35)', inr: '1.35' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] font-bold border border-slate-700"
                  >
                    ⚠️ 15.0s (Leve)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, pt: '22.0 s (INR 2.0)', inr: '2.0' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[9px] font-bold border border-slate-700"
                  >
                    🩸 22.0s (Anticoag.)
                  </button>
                </div>
              </div>

              {/* INR */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-cyan-300">
                    INR (Razón Internacional)
                  </label>
                  <span className="text-[9px] text-emerald-400 font-bold">0.8 - 1.15</span>
                </div>
                <input
                  type="text"
                  id="inr"
                  list="inrOptions"
                  value={formData.inr || ''}
                  onChange={handleChange}
                  placeholder="Ej. 1.0"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, inr: '1.0' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[9px] font-bold border border-slate-700"
                  >
                    ✅ 1.0 (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, inr: '1.3' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] font-bold border border-slate-700"
                  >
                    ⚠️ 1.3 (Límite)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, inr: '2.5 (Terapéutico)' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[9px] font-bold border border-slate-700"
                  >
                    💊 2.0-3.0 (Warfarina)
                  </button>
                </div>
              </div>

              {/* PTT - Tiempo de Tromboplastina Parcial */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-cyan-300">
                    PTT / TTPA (Tromboplastina)
                  </label>
                  <span className="text-[9px] text-emerald-400 font-bold">25 - 35 s</span>
                </div>
                <input
                  type="text"
                  id="ptt"
                  list="pttOptions"
                  value={formData.ptt || ''}
                  onChange={handleChange}
                  placeholder="Ej. 30.0 s (Control: 30s)"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, ptt: '30.0 s (Control: 30s)' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 text-[9px] font-bold border border-slate-700"
                  >
                    ✅ 30.0s (Normal)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, ptt: '38.0 s (Límite superior)' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[9px] font-bold border border-slate-700"
                  >
                    ⚠️ 38.0s (Límite)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, ptt: '55.0 s (Heparinizado)' }))}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[9px] font-bold border border-slate-700"
                  >
                    💉 55.0s (Heparina)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Serologías, EKG y RX de Tórax */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mb-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-cyan-300 mb-1">
                HIV / VIH
              </label>
              <select
                id="hiv"
                value={formData.hiv || 'Negativo'}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-medium"
              >
                <option value="Negativo">Negativo</option>
                <option value="Positivo">Positivo</option>
                <option value="No reactivo">No reactivo</option>
                <option value="No realizado">No realizado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-cyan-300 mb-1">
                VDRL / Sífilis
              </label>
              <select
                id="vdrl"
                value={formData.vdrl || 'No reactivo'}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-medium"
              >
                <option value="No reactivo">No reactivo</option>
                <option value="Reactivo">Reactivo</option>
                <option value="No realizado">No realizado</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                Electrocardiograma (EKG)
              </label>
              <input
                type="text"
                id="ekg"
                list="ekgOptions"
                value={formData.ekg}
                onChange={handleChange}
                placeholder="Ej. Ritmo sinusal, normal"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                RX Tórax
              </label>
              <input
                type="text"
                id="rx"
                list="rxOptions"
                value={formData.rx}
                onChange={handleChange}
                placeholder="Ej. Campos claros, silueta normal"
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Evaluaciones por Especialidad con Presets Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Valoración Cardiovascular */}
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <label className="block text-[11px] font-extrabold uppercase text-cyan-300">
                  Valoración Cardiovascular
                </label>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionCardio: 'Valoración cardiovascular: Sin contraindicación para acto anestésico-quirúrgico. Riesgo quirúrgico bajo.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ✅ No contraindica
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionCardio: 'Valoración cardiovascular: Riesgo quirúrgico moderado. Mantener estabilidad hemodinámica y monitoreo continuo.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ⚠️ Moderado
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionCardio: 'Valoración cardiovascular: CONTRAINDICA temporalmente acto quirúrgico hasta compensación/estabilización cardiológica.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ❌ Contraindica
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionCardio: 'Valoración cardiovascular: Requiere ecocardiograma transtorácico (EcoTT) previo al procedimiento.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    📋 EcoTT
                  </button>
                </div>
              </div>
              <textarea
                id="evaluacionCardio"
                rows={2}
                value={formData.evaluacionCardio || ''}
                onChange={handleChange}
                placeholder="Haga clic en una opción rápida o escriba las observaciones cardiovasculares..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Evaluación por Neumonología */}
            <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                <label className="block text-[11px] font-extrabold uppercase text-cyan-300">
                  Evaluación por Neumonología / Neumología
                </label>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionNeumo: 'Evaluación por Neumonología: Sin contraindicación para acto quirúrgico. Buena mecánica ventilatoria.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ✅ No contraindica
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionNeumo: 'Evaluación por Neumonología: Riesgo broncoespástico leve-moderado. Micronebulización broncodilatadora previa.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ⚠️ Broncoespásmo
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData(p => ({
                        ...p,
                        evaluacionNeumo: 'Evaluación por Neumonología: CONTRAINDICA temporalmente. Proceso infeccioso/respiratorio activo.'
                      }))
                    }
                    className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold cursor-pointer transition-all"
                  >
                    ❌ Contraindica
                  </button>
                </div>
              </div>
              <textarea
                id="evaluacionNeumo"
                rows={2}
                value={formData.evaluacionNeumo || ''}
                onChange={handleChange}
                placeholder="Haga clic en una opción rápida o escriba las observaciones neumonológicas..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
              Otros Laboratorios y Pruebas Especiales
            </label>
            <textarea
              id="otrosLaboratorios"
              rows={2}
              value={formData.otrosLaboratorios}
              onChange={handleChange}
              placeholder="Electrolitos séricos (Na, K, Cl, Ca, Mg), gases arteriales, pruebas tiroideas (TSH/T4L), serologías, ecografía..."
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Goldman, ASA, Apto */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold uppercase text-cyan-300 mb-1">
                Índice de Goldman (Riesgo Cardíaco)
              </label>
              <select
                id="goldman"
                value={formData.goldman || 'Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)'}
                onChange={handleChange}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-bold text-emerald-400"
              >
                <option value="Clase I (0-5 pts) - Riesgo Cardíaco Muy Bajo (1%)">
                  Clase I (0 - 5 pts): Riesgo muy bajo (1%)
                </option>
                <option value="Clase II (6-12 pts) - Riesgo Cardíaco Bajo (7%)">
                  Clase II (6 - 12 pts): Riesgo bajo (7%)
                </option>
                <option value="Clase III (13-25 pts) - Riesgo Cardíaco Moderado (14%)">
                  Clase III (13 - 25 pts): Riesgo moderado (14%)
                </option>
                <option value="Clase IV (>25 pts) - Riesgo Cardíaco Alto (78%)">
                  Clase IV (&gt; 25 pts): Riesgo alto / severo (78%)
                </option>
                <option value="No evaluado / No aplica">No evaluado / No aplica</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Clasificación ASA
              </label>
              <select
                id="asa"
                value={formData.asa}
                onChange={handleChange}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-bold text-cyan-400"
              >
                <option value="ASA I">ASA I - Sano normal</option>
                <option value="ASA II">ASA II - Enfermedad sistémica leve</option>
                <option value="ASA III">ASA III - Enfermedad sistémica grave</option>
                <option value="ASA IV">ASA IV - Amenaza constante para la vida</option>
                <option value="ASA V">ASA V - Moribundo</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Apto para Cirugía
              </label>
              <select
                id="apto"
                value={formData.apto}
                onChange={handleChange}
                className={`w-full border rounded-xl px-3 py-2 text-xs font-black focus:outline-none cursor-pointer ${
                  formData.apto.includes('SÍ') || formData.apto === 'SÍ'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : formData.apto.includes('DIFERIDO')
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                    : 'bg-rose-950/60 border-rose-500/50 text-rose-400'
                }`}
              >
                <option value="SÍ (Apto)">SÍ (Apto para procedimiento quirúrgico)</option>
                <option value="NO (No Apto)">NO (No apto para cirugía)</option>
                <option value="DIFERIDO (Hasta nuevo aviso)">DIFERIDO (Diferir hasta nuevo aviso / optimización)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Recomendaciones y Datos del Anestesiólogo */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">5. Plan Anestésico y Firma del Especialista</h3>
                <p className="text-xs text-slate-400">Seleccione opciones con 1 clic o escriba libremente sus indicaciones</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={fillStandardRecommendations}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Plantilla Completa
              </button>
              <button
                type="button"
                onClick={clearRecommendations}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                title="Limpiar campo"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Panel de Opciones Rápidas Seleccionables para el Médico */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/90 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400">
                <Zap className="w-4 h-4 text-amber-400" /> Opciones Rápidas de Plan e Indicaciones (Toque para agregar):
              </div>

              {/* Botones de Chips Rápidos de Recomendaciones Frecuentes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {/* Confort Térmico */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Confort térmico trans y postoperatorio (manta térmica activa).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-950/50 border border-slate-700/80 hover:border-cyan-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Thermometer className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Confort Térmico</span> (Manta térmica activa)
                </button>

                {/* Analgesia Oportuna */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Analgesia multimodal oportuna preventiva y manejo de dolor postoperatorio.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-950/50 border border-slate-700/80 hover:border-indigo-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Pill className="w-4 h-4 text-indigo-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Analgesia Oportuna</span> (Multimodal preventiva)
                </button>

                {/* Profilaxis Antibiótica */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Administrar profilaxis antibiótica 30 a 60 minutos antes de la incisión quirúrgica.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/50 border border-slate-700/80 hover:border-emerald-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Profilaxis Antibiótica</span> (30-60 min previos)
                </button>

                {/* Tromboprofilaxis: Enoxaparina 40 mg SC */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Tromboprofilaxis farmacológica: Enoxaparina 40 mg (4000 UI) SC cada 24 horas (iniciar según hemostasia y riesgo trombótico).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-rose-300">Enoxaparina 40 mg SC/día</span> (Tromboprofilaxis estándar)
                </button>

                {/* Tromboprofilaxis: Enoxaparina 20 mg SC */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Tromboprofilaxis farmacológica: Enoxaparina 20 mg (2000 UI) SC cada 24 horas (riesgo moderado / ajuste peso o renal).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-rose-300">Enoxaparina 20 mg SC/día</span> (Ajuste renal / bajo peso)
                </button>

                {/* Tromboprofilaxis: Enoxaparina 60 mg SC (Alto Riesgo / Obesidad) */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Tromboprofilaxis farmacológica: Enoxaparina 60 mg (6000 UI) SC cada 24 horas (alto riesgo trombótico / IMC > 40 kg/m²).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-rose-300">Enoxaparina 60 mg SC/día</span> (Alto riesgo / Obesidad)
                </button>

                {/* Tromboprofilaxis Mecánica + Medias */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Tromboprofilaxis mecánica: Medias de compresión elástica graduada antitrombóticas y/o compresión neumática intermitente.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Tromboprofilaxis Mecánica</span> (Medias antitrombóticas / CNI)
                </button>

                {/* Pausa Enoxaparina por Anestesia Neuroaxial */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Seguridad Neuroaxial: Suspender Enoxaparina profiláctica mínimo 12 horas antes de punción o retiro de catéter peridural/subaracnoideo (24h si dosis terapéutica).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-amber-300">Pausa Neuroaxial Enoxaparina</span> (12h profiláctica / 24h terap.)
                </button>

                {/* Concentrado Globular 1 */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Reservar 01 unidad de Concentrado Globular (CG).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Droplets className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Reservar 1 Unidad CG</span> (Concentrado globular)
                </button>

                {/* Concentrado Globular 2 */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Reservar 02 unidades de Concentrado Globular (CG).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Droplets className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Reservar 2 Unidades CG</span> (Concentrado globular)
                </button>

                {/* Concentrado Globular 3 / Plasma */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Reservar 02 unidades de CG y 02 unidades de Plasma Fresco Congelado (PFC).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Droplets className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Reserva CG + Plasma</span> (PFC hemoderivados)
                </button>

                {/* Ayuno 8h */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Ayuno preoperatorio mínimo de 8 horas para sólidos y 2 horas para líquidos claros.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Ayuno 8 horas</span> (Sólidos / 2h claros)
                </button>

                {/* Ayuno 6h */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Ayuno preoperatorio de 6 horas.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Clock className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Ayuno 6 horas</span> (Dieta blanda / leche)
                </button>

                {/* Estómago lleno / SRI */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Paciente con estómago lleno: realizar Secuencia de Inducción Rápida (SRI) y presión cricoidea.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-rose-300">Estómago Lleno (SRI)</span> (Inducción rápida)
                </button>

                {/* Premedicación Midazolam */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Premedicación ansiolítica con Midazolam 1-2 mg IV en área de pabellón.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-purple-950/50 border border-slate-700/80 hover:border-purple-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Pill className="w-4 h-4 text-purple-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Midazolam 1-2 mg IV</span> (Premedicación)
                </button>

                {/* Protector Gástrico */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Protector gástrico con Omeprazol 40 mg IV / Ranitidina 50 mg IV previo al acto.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-cyan-950/50 border border-slate-700/80 hover:border-cyan-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Pill className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Protector Gástrico</span> (Omeprazol / Ranitidina)
                </button>

                {/* Profilaxis Antiemética */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Profilaxis antiemética con Ondansetrón 4-8 mg IV + Dexametasona 4-8 mg IV.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-teal-950/50 border border-slate-700/80 hover:border-teal-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Pill className="w-4 h-4 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Antiemético</span> (Ondansetrón + Dexametasona)
                </button>

                {/* Nebuloterapia con Salbutamol / Berodual */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Nebuloterapia previa a cirugía con Salbutamol (10-20 gotas) + Bromuro de Ipratropio (20 gotas) en 3 cc de solución fisiológica.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-sky-950/50 border border-slate-700/80 hover:border-sky-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Activity className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-sky-300">Nebuloterapia Previa</span> (Salbutamol / Ipratropio)
                </button>

                {/* Nebuloterapia con Budesonida */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Nebuloterapia con Budesonida 0.5 mg / 1 mg en 3 cc solución fisiológica previa a inducción.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-sky-950/50 border border-slate-700/80 hover:border-sky-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Activity className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Nebulización Budesonida</span> (0.5 - 1 mg)
                </button>

                {/* Esteroides Endovenosos: Hidrocortisona */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Administrar esteroide endovenoso previo a cirugía: Hidrocortisona 100 mg - 200 mg IV.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-amber-300">Hidrocortisona IV</span> (100 - 200 mg previo)
                </button>

                {/* Esteroides Endovenosos: Metilprednisolona / Dexametasona */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Administrar esteroide endovenoso previo a cirugía: Metilprednisolona 40-80 mg IV o Dexametasona 8 mg IV.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-amber-300">Metilprednisolona / Dexa IV</span> (Previo a cirugía)
                </button>

                {/* Monitorización Estándar ASA */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Monitorización estándar básica ASA continua (ECG, PANI, SpO2, Capnografía, Temperatura).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-blue-950/50 border border-slate-700/80 hover:border-blue-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <Activity className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Monitorización ASA</span> (ECG, PANI, SpO2, EtCO2)
                </button>

                {/* Monitorización Invasiva */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Monitorización hemodinámica invasiva continua (Línea arterial continua / Acceso venoso central).')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/80 hover:border-rose-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Monitoreo Invasivo</span> (Línea arterial / PVC)
                </button>

                {/* Consentimiento Informado */}
                <button
                  type="button"
                  onClick={() => addRecommendationItem('• Consentimiento informado para procedimiento anestésico firmado por el paciente o representante legal.')}
                  className="flex items-center gap-2 text-left p-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/50 border border-slate-700/80 hover:border-emerald-500/50 text-xs text-slate-200 transition-all cursor-pointer group"
                >
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-white">Consentimiento Firmado</span> (Paciente / Familiar)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Texto del Plan Anestésico y Recomendaciones (Editable)
              </label>
              <textarea
                id="recomendaciones"
                rows={5}
                value={formData.recomendaciones}
                onChange={handleChange}
                placeholder="Toque los botones rápidos de arriba o redacte aquí las indicaciones específicas..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                  Anestesiólogo Evaluador
                </label>
                <input
                  type="text"
                  id="anestesio"
                  value={formData.anestesio}
                  onChange={handleChange}
                  placeholder="Nombre y Apellidos"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  placeholder="Ej. V-12.345.678"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Número de contacto"
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={generatePDF}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-black py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/30 transition-all text-sm md:text-base cursor-pointer transform active:scale-95"
          >
            <Eye className="w-5 h-5 text-cyan-200" />
            <span>Previsualizar y Compartir PDF</span>
          </button>
        </div>
      </form>

      {/* Modal de Previsualización y Compartición de PDF Directo */}
      {showPdfModal && pdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-white flex items-center gap-2">
                    Evaluación Preanestésica
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                      1 Hoja
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                    {formData.nombre ? `Paciente: ${formData.nombre}` : 'Documento clínico generado'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="Cerrar y Corregir"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Barra de Acciones: Compartir WhatsApp, Descargar, Imprimir y Cerrar para Corregir */}
            <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSharePdf}
                    disabled={isSharing}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                  >
                    <Share2 className="w-4 h-4 text-emerald-100" />
                    <span>{isSharing ? 'Abriendo...' : 'Compartir (WhatsApp / Email)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectDownload}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-cyan-200" />
                    <span>{isDownloading ? 'Descargando...' : 'Descargar PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Imprimir</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowPdfModal(false)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-950/40 border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    ← Editar / Corregir datos
                  </button>
                </div>
              </div>

              {/* Banner de Aviso Inmediato de Descarga Exitosa */}
              {downloadSuccessMsg && (
                <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{downloadSuccessMsg}</span>
                </div>
              )}
            </div>

            {/* Visor de Previsualización PDF */}
            <div className="flex-1 bg-slate-950 p-2 overflow-hidden flex flex-col items-center justify-center min-h-[420px] md:min-h-[560px]">
              <iframe
                ref={iframeRef}
                src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                title="Previsualización Evaluación Preanestésica PDF"
                className="w-full h-full min-h-[400px] md:min-h-[540px] rounded-xl bg-white border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

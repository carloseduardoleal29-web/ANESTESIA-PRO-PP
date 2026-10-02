import React, { useState, useEffect, useRef } from 'react';
import { PreanesthesiaData } from '../types';
import { 
  FileText, Download, UserCheck, Stethoscope, AlertTriangle, CheckCircle2, 
  RotateCcw, Sparkles, Eye, Share2, ExternalLink, X, BarChart2, KeyRound,
  HeartPulse, Activity, Thermometer, Pill, Clock, Droplets, ShieldCheck, 
  PlusCircle, Check, Trash2, Zap, Printer, ShieldAlert, FileDown,
  Save, Building2, Copy, ChevronDown, ChevronUp, Search, ListChecks,
  MessageCircle, Mail, Send
} from 'lucide-react';
import jsPDF from 'jspdf';
import { recordGlobalDownload, recordPreanesthesiaUsage, getGlobalStats, AppStats } from '../lib/statsService';
import { WhatsAppShareBanner } from './WhatsAppShareBanner';
import { CapriniRiskModal } from './CapriniRiskModal';
import { 
  ANTECEDENTS_DROPDOWN_OPTIONS, 
  evaluateCapriniScore, 
  generateWhatsAppFullPreanesthesiaMessage,
  CapriniAssessmentResult,
  groupAntecedentsByCategory,
  PLAN_ANESTHESIA_SUGGESTIONS
} from '../data/preanesthesiaCatalog';
import { generatePreanesthesiaPdfDocument } from '../utils/preanesthesiaPdfGenerator';
import { 
  getActiveLetterhead, 
  getSavedDoctorCredentials, 
  saveDoctorCredentials,
  isLetterheadConfigured
} from '../lib/preanesthesiaStorage';
import { getStoredUserProfile } from '../lib/userRegistrationService';
import { LOGO_SHIELD_BASE64 } from '../lib/logoData';

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

  // Escala de Caprini (Riesgo Tromboembólico TEV)
  capriniScore: 2,
  capriniCategory: 'Riesgo Bajo (1 - 2 pts)',
  capriniProfilaxis: 'Tromboprofilaxis mecánica: Medias de compresión elástica graduada (MECG) o CNI intra y postoperatoria.',
  capriniSelectedItems: ['age_41_60', 'minor_surg'],

  recomendaciones: '',
  anestesio: '',
  cedula: '',
  matricula: '',
  telefono: ''
};

export const PreanesthesiaModule: React.FC = () => {
  const [formData, setFormData] = useState<PreanesthesiaData>(() => {
    const creds = typeof window !== 'undefined' ? getSavedDoctorCredentials() : { doctorName: '', doctorCedula: '', doctorLicense: '', doctorPhone: '', doctorSignatureDataUrl: null };
    const userProfile = typeof window !== 'undefined' ? getStoredUserProfile() : null;
    const letterhead = typeof window !== 'undefined' ? getActiveLetterhead() : null;
    return {
      ...initialFormData,
      anestesio: creds.doctorName || userProfile?.fullName || '',
      cedula: creds.doctorCedula || userProfile?.idNumber || '',
      matricula: creds.doctorLicense || '',
      telefono: creds.doctorPhone || userProfile?.phone || '',
      doctorSignatureDataUrl: userProfile?.digitalSignatureUrl || creds.doctorSignatureDataUrl || null,
      ...(letterhead ? {
        hospitalName: letterhead.hospitalName,
        hospitalDepartment: letterhead.department,
        hospitalAddress: letterhead.address,
        hospitalCityCountry: letterhead.cityCountry,
        hospitalPhone: letterhead.phone,
        hospitalLogoBase64: letterhead.hospitalLogoBase64,
        specialistLogoBase64: letterhead.specialistLogoBase64,
        themeColor: letterhead.themeColor
      } : (userProfile?.workplace ? {
        hospitalName: userProfile.workplace,
        hospitalCityCountry: userProfile.country || ''
      } : {}))
    };
  });
  const [riskScore, setRiskScore] = useState<number>(0);
  const [riskCategory, setRiskCategory] = useState<string>('Vía Aérea Fácil');
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high'>('low');
  const [isCapriniModalOpen, setIsCapriniModalOpen] = useState<boolean>(false);
  const [doctorSavedNotice, setDoctorSavedNotice] = useState<boolean>(false);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlobData, setPdfBlobData] = useState<Blob | null>(null);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [planCategoryFilter, setPlanCategoryFilter] = useState<string>('all');
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState<boolean>(true);
  const [planSearchQuery, setPlanSearchQuery] = useState<string>('');
  const currentDocRef = useRef<jsPDF | null>(null);

  // States for server-hosted PDF sharing and automated delivery
  const [sharePhone, setSharePhone] = useState<string>(() => {
    const profile = typeof window !== 'undefined' ? getStoredUserProfile() : null;
    return profile?.autoSendConfig?.defaultRecipientPhone || '';
  });
  const [shareEmail, setShareEmail] = useState<string>(() => {
    const profile = typeof window !== 'undefined' ? getStoredUserProfile() : null;
    return profile?.autoSendConfig?.defaultRecipientEmail || '';
  });
  const [isUploadingAndSharing, setIsUploadingAndSharing] = useState<boolean>(false);
  const [shareSuccessNotice, setShareSuccessNotice] = useState<string | null>(null);

  // Sync letterhead and saved doctor credentials on mount
  useEffect(() => {
    const creds = getSavedDoctorCredentials();
    const letterhead = getActiveLetterhead();
    const isCustom = isLetterheadConfigured();
    setFormData(prev => ({
      ...prev,
      anestesio: prev.anestesio || creds.doctorName || 'Dr. Carlos Leal',
      cedula: prev.cedula || creds.doctorCedula || '',
      matricula: prev.matricula || creds.doctorLicense || 'MP-84920 / CM-4521',
      telefono: prev.telefono || creds.doctorPhone || '04243291438',
      doctorSignatureDataUrl: prev.doctorSignatureDataUrl || creds.doctorSignatureDataUrl || null,
      hospitalName: isCustom ? letterhead.hospitalName : 'FORMATO DE EVALUACIÓN PREANESTÉSICA',
      hospitalDepartment: isCustom ? letterhead.department : 'ANESTESIA PRO',
      hospitalAddress: isCustom ? letterhead.address : 'Fundador Dr. Carlos Leal',
      hospitalCityCountry: isCustom ? letterhead.cityCountry : 'Documento Médico Legal Confidencial',
      hospitalPhone: isCustom ? letterhead.phone : '04243291438',
      hospitalLogoBase64: isCustom ? letterhead.hospitalLogoBase64 : (LOGO_SHIELD_BASE64 || null),
      specialistLogoBase64: letterhead.specialistLogoBase64 || (LOGO_SHIELD_BASE64 || null),
      themeColor: letterhead.themeColor || 'navy'
    }));
  }, []);

  // Listen for real-time user profile registration or edits
  useEffect(() => {
    const handleProfileUpdate = (e: CustomEvent<any>) => {
      const profile = e.detail;
      if (profile) {
        const licenseStr = profile.medicalLicenseNumber || profile.idNumber || 'MP-REGISTRADO';
        const fullLicense = profile.collegeRegistration 
          ? `${licenseStr} | Col. ${profile.collegeRegistration}`
          : licenseStr;
        
        setFormData(prev => ({
          ...prev,
          anestesio: profile.fullName || prev.anestesio,
          cedula: profile.idNumber || prev.cedula,
          matricula: fullLicense || prev.matricula,
          telefono: profile.phone || prev.telefono,
          doctorSignatureDataUrl: profile.digitalSignatureUrl || prev.doctorSignatureDataUrl || null,
          hospitalName: prev.hospitalName || profile.workplace || '',
          hospitalCityCountry: prev.hospitalCityCountry || profile.country || ''
        }));

        if (profile.autoSendConfig) {
          setSharePhone(profile.autoSendConfig.defaultRecipientPhone || '');
          setShareEmail(profile.autoSendConfig.defaultRecipientEmail || '');
        }
      }
    };

    window.addEventListener('anestesiapro_user_profile_updated', handleProfileUpdate as EventListener);
    return () => {
      window.removeEventListener('anestesiapro_user_profile_updated', handleProfileUpdate as EventListener);
    };
  }, []);

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

  // Helper de normalización para comparar y detectar acápites del plan anestésico
  const normalizeSnippet = (str: string) => 
    str.replace(/^•\s*/, '')
       .replace(/[.,;:()\-_]/g, ' ')
       .toLowerCase()
       .replace(/\s+/g, ' ')
       .trim();

  // Verifica si un acápite está actualmente seleccionado en el plan
  const isRecommendationSelected = (itemText: string): boolean => {
    if (!formData.recomendaciones) return false;
    const currentLines = formData.recomendaciones.split('\n');
    const targetNorm = normalizeSnippet(itemText);
    const targetPrefix = targetNorm.slice(0, 24);

    return currentLines.some(line => {
      const lineNorm = normalizeSnippet(line);
      if (!lineNorm) return false;
      return lineNorm === targetNorm || 
             lineNorm.includes(targetNorm) || 
             targetNorm.includes(lineNorm) ||
             (targetPrefix.length >= 10 && lineNorm.includes(targetPrefix));
    });
  };

  // Alterna (agrega si no está, o elimina limpiamente si ya estaba seleccionado) a dedo del médico
  const toggleRecommendationItem = (itemText: string) => {
    setFormData(prev => {
      const current = prev.recomendaciones || '';
      const cleanItem = itemText.trim();
      const targetNorm = normalizeSnippet(cleanItem);
      const targetPrefix = targetNorm.slice(0, 24);

      const lines = current.split('\n');
      const existingIndex = lines.findIndex(line => {
        const lineNorm = normalizeSnippet(line);
        if (!lineNorm) return false;
        return lineNorm === targetNorm || 
               lineNorm.includes(targetNorm) || 
               targetNorm.includes(lineNorm) ||
               (targetPrefix.length >= 10 && lineNorm.includes(targetPrefix));
      });

      if (existingIndex >= 0) {
        // Deseleccionar: borrar la línea exacta del plan
        const updatedLines = lines.filter((_, idx) => idx !== existingIndex);
        return {
          ...prev,
          recomendaciones: updatedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
        };
      } else {
        // Seleccionar: agregar al plan con viñeta
        const bullet = cleanItem.startsWith('•') ? cleanItem : `• ${cleanItem}`;
        const newText = current.trim() ? `${current.trim()}\n${bullet}` : bullet;
        return {
          ...prev,
          recomendaciones: newText
        };
      }
    });
  };

  // Mantener compatibilidad con llamadas existentes delegando en toggle
  const addRecommendationItem = (itemText: string) => {
    toggleRecommendationItem(itemText);
  };

  const fillStandardRecommendations = () => {
    setFormData(prev => ({
      ...prev,
      recomendaciones: `• Ayuno de 8h para sólidos y 2h para líquidos claros.
• Monitorización continua básica ASA (ECG, PANI, SpO2, Capnografía, Temp).
• Normotermia activa: Manta térmica trans y postoperatoria.
• Analgesia multimodal preventiva y control oportuno del dolor.
• Profilaxis antibiótica 30 a 60 min previos a incisión quirúrgica.
• Pruebas cruzadas y reserva validadas en Banco de Sangre.
• Consentimiento informado preanestésico firmado y asentado.`
    }));
  };

  const clearRecommendations = () => {
    setFormData(prev => ({ ...prev, recomendaciones: '' }));
  };

  // Cantidad total de pautas del catálogo seleccionadas en el plan
  const selectedPlanCount = PLAN_ANESTHESIA_SUGGESTIONS.reduce(
    (acc, cat) => acc + cat.options.filter(opt => isRecommendationSelected(opt.text)).length,
    0
  );

  // Filtrado reactivo de sugerencias de plan por categoría y búsqueda
  const filteredPlanSuggestions = PLAN_ANESTHESIA_SUGGESTIONS.filter(cat => {
    if (planCategoryFilter !== 'all' && cat.category !== planCategoryFilter) {
      return false;
    }
    if (!planSearchQuery.trim()) return true;
    const q = planSearchQuery.toLowerCase();
    const catMatches = cat.category.toLowerCase().includes(q);
    const optMatches = cat.options.some(opt =>
      opt.label.toLowerCase().includes(q) ||
      (opt.shortDesc && opt.shortDesc.toLowerCase().includes(q)) ||
      opt.text.toLowerCase().includes(q)
    );
    return catMatches || optMatches;
  }).map(cat => {
    if (!planSearchQuery.trim()) return cat;
    const q = planSearchQuery.toLowerCase();
    const matchingOpts = cat.options.filter(opt =>
      opt.label.toLowerCase().includes(q) ||
      (opt.shortDesc && opt.shortDesc.toLowerCase().includes(q)) ||
      opt.text.toLowerCase().includes(q) ||
      cat.category.toLowerCase().includes(q)
    );
    return { ...cat, options: matchingOpts };
  }).filter(cat => cat.options.length > 0);

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

      recomendaciones: `• Ayuno de 8h para sólidos y 2h para líquidos claros.
• Premedicación ansiolítica: Midazolam 1-2 mg IV en preanestesia.
• Protección gástrica: Omeprazol 40 mg IV (o Ranitidina 50 mg IV).
• Monitorización continua básica ASA (ECG, PANI, SpO2, Capnografía, Temp).
• Reservar 02 unidades de Concentrado Globular (CG).
• Normotermia activa: Manta térmica trans y postoperatoria.
• Analgesia multimodal preventiva y control oportuno del dolor.`,
      anestesio: 'Carlos Leal',
      cedula: '15489288',
      matricula: 'MP-84920 / CM-4521',
      telefono: '04243291438'
    });
  };

  const handleAntecedentSelect = (field: keyof PreanesthesiaData, optionValue: string) => {
    if (!optionValue) return;
    setFormData(prev => {
      const current = ((prev[field] as string) || '').trim();
      const isDefaultPlaceholder = 
        !current || 
        current === 'Negativas' || 
        current.toLowerCase().startsWith('niega') || 
        current === 'Ninguna' || 
        current === 'No refiere patologías crónicas';

      if (isDefaultPlaceholder) {
        return { ...prev, [field]: optionValue };
      }
      if (current.includes(optionValue)) {
        return prev; // Avoid duplicate
      }
      return { ...prev, [field]: `${current}, ${optionValue}` };
    });
  };

  const applyCapriniAssessment = (score: number, result: CapriniAssessmentResult, selectedIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      capriniScore: score,
      capriniCategory: result.categoryTitle,
      capriniProfilaxis: result.profilaxisText,
      capriniSelectedItems: selectedIds
    }));
  };

  const addCapriniToRecommendations = () => {
    const profText = `• Tromboprofilaxis Caprini (${formData.capriniScore || 0} pts - ${formData.capriniCategory || 'Riesgo Evaluado'}): ${formData.capriniProfilaxis || 'Medias antitrombóticas / CNI'}`;
    addRecommendationItem(profText);
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
      capriniScore: 0,
      capriniCategory: 'Riesgo Muy Bajo (0 pts)',
      capriniProfilaxis: 'Deambulación temprana y frecuente.',
      capriniSelectedItems: [],
      recomendaciones: '',
      anestesio: '',
      cedula: '',
      matricula: '',
      telefono: ''
    });
  };

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const generatePDF = async () => {
    try {
      const result = generatePreanesthesiaPdfDocument(formData, riskScore, riskCategory);
      currentDocRef.current = result.doc;

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      setPdfBlobData(result.blob);
      setPdfUrl(result.blobUrl);
      setPdfFileName(result.fileName);
      setShowPdfModal(true);

      recordPreanesthesiaUsage('evaluation_generated', formData.nombre);
      return result;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Hubo un error al generar el PDF. Por favor verifique los campos.');
      return null;
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
    setIsDownloading(true);
    recordPreanesthesiaUsage('evaluation_downloaded', formData.nombre);

    try {
      let docToSave = currentDocRef.current;
      let targetName = pdfFileName;

      if (!docToSave) {
        const result = generatePreanesthesiaPdfDocument(formData, riskScore, riskCategory);
        docToSave = result.doc;
        targetName = result.fileName;
        currentDocRef.current = result.doc;
        setPdfBlobData(result.blob);
        setPdfUrl(result.blobUrl);
        setPdfFileName(result.fileName);
      }

      const cleanPatientName = (formData.nombre || 'Paciente').trim().replace(/\s+/g, '_');
      const finalName = targetName || `${cleanPatientName}.pdf`;
      docToSave.save(finalName);

      setDownloadSuccessMsg(`✓ ¡PDF descargado con éxito en tu dispositivo!: ${finalName}`);
      setTimeout(() => {
        setDownloadSuccessMsg(null);
      }, 5000);
    } catch (err) {
      console.error('Download error:', err);
      alert('Hubo un inconveniente al generar o descargar el PDF. Verifique los datos ingresados.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadAndSharePreanesthesia = async () => {
    setIsUploadingAndSharing(true);
    setShareSuccessNotice(null);

    try {
      // 1. Generate the PDF
      let docToSave = currentDocRef.current;
      if (!docToSave) {
        const result = generatePreanesthesiaPdfDocument(formData, riskScore, riskCategory);
        docToSave = result.doc;
        currentDocRef.current = result.doc;
        setPdfBlobData(result.blob);
        setPdfUrl(result.blobUrl);
        setPdfFileName(result.fileName);
      }

      // Convert PDF to Base64
      const pdfBlob = currentDocRef.current.output('blob');
      const reader = new FileReader();
      
      const pdfBase64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(pdfBlob);
      const pdfBase64 = await pdfBase64Promise;

      // 2. Upload to backend
      const uploadRes = await fetch('/api/preanesthesia/save-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pdfBase64,
          patientName: formData.nombre || 'Paciente',
          patientCedula: formData.cedulaPaciente || 'N/A',
          doctorName: formData.anestesio || 'Médico Anestesiólogo'
        })
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success || !uploadData.url) {
        throw new Error(uploadData.error || 'No se pudo subir el PDF al servidor.');
      }

      const relativePdfUrl = uploadData.url;
      const absolutePdfUrl = `${window.location.protocol}//${window.location.host}${relativePdfUrl}`;

      // 3. Trigger Automated Email via backend if email provided
      let emailSuccess = false;
      if (shareEmail && shareEmail.includes('@')) {
        try {
          const emailRes = await fetch('/api/preanesthesia/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              patientName: formData.nombre || 'Paciente',
              patientCedula: formData.cedulaPaciente || 'N/A',
              doctorName: formData.anestesio || 'Médico Anestesiólogo',
              pdfUrl: relativePdfUrl,
              recipientEmail: shareEmail.trim(),
              subject: `🩺 EVALUACIÓN PREANESTÉSICA OFICIAL: ${formData.nombre || 'Paciente'}`
            })
          });
          const emailData = await emailRes.json();
          emailSuccess = emailData.success;
        } catch (emailErr) {
          console.warn('Error sending automated email:', emailErr);
        }
      }

      // 4. Trigger WhatsApp link with short professional text and direct PDF URL
      const cleanPhone = sharePhone.replace(/[^0-9]/g, '');
      const waMessage = `📋 *ANESTESIAPRO - EVALUACIÓN PREANESTÉSICA OFICIAL (PDF)*

Se ha generado la evaluación clínica preoperatoria oficial para el expediente del paciente:
• *Paciente:* ${formData.nombre || '---'}
• *Cédula:* ${formData.cedulaPaciente || '---'}
• *Anestesiólogo:* ${formData.anestesio || '---'}

📲 *Ver y Descargar el Formato PDF Oficial Listo para Quirófano (Impresión y Archivo):*
${absolutePdfUrl}

----------------------------------------
_AnestesiaPro: Suite Médica y Calculadoras de Quirófano_
https://tinyurl.com/AnestesiaProApp`;

      const waUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}` 
        : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
      
      window.open(waUrl, '_blank', 'noopener,noreferrer');

      // 5. Update notice
      let noticeMsg = '✓ PDF guardado en la nube y abierto en WhatsApp.';
      if (emailSuccess) {
        noticeMsg = `✓ PDF guardado en la nube, enviado a ${shareEmail} y abierto en WhatsApp.`;
      }
      setShareSuccessNotice(noticeMsg);
      setTimeout(() => setShareSuccessNotice(null), 8000);
      recordPreanesthesiaUsage('evaluation_shared', formData.nombre);
    } catch (err: any) {
      console.error('Error sharing preanesthesia PDF:', err);
      alert(`Error al procesar el envío de PDF: ${err.message || err}`);
    } finally {
      setIsUploadingAndSharing(false);
    }
  };

  const handleReloadSavedDoctorCredentials = () => {
    const creds = getSavedDoctorCredentials();
    const profile = getStoredUserProfile();
    setFormData(prev => ({
      ...prev,
      anestesio: creds.doctorName || profile?.fullName || prev.anestesio,
      cedula: creds.doctorCedula || profile?.idNumber || prev.cedula,
      matricula: creds.doctorLicense || prev.matricula,
      telefono: creds.doctorPhone || profile?.phone || prev.telefono,
      doctorSignatureDataUrl: profile?.digitalSignatureUrl || creds.doctorSignatureDataUrl || prev.doctorSignatureDataUrl || null
    }));
    setDoctorSavedNotice(true);
    setTimeout(() => setDoctorSavedNotice(false), 3000);
  };

  const handleSaveDoctorCreds = () => {
    if (!formData.anestesio) {
      alert('Por favor ingrese el nombre del anestesiólogo antes de guardar.');
      return;
    }
    saveDoctorCredentials({
      doctorName: formData.anestesio,
      doctorCedula: formData.cedula,
      doctorLicense: formData.matricula,
      doctorPhone: formData.telefono,
      doctorSignatureDataUrl: formData.doctorSignatureDataUrl
    });
    setDoctorSavedNotice(true);
    setTimeout(() => setDoctorSavedNotice(false), 3000);
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
                ANESTESIA PRO
              </span>
              <span className="bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold px-2.5 py-1 rounded-full">
                Fundador Dr. Carlos Leal
              </span>
              {isLetterheadConfigured() && (
                <span className="bg-amber-500/20 text-amber-200 border border-amber-400/30 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-amber-400" /> Membrete Configurado
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2">
              Formato de Evaluación Preanestésica
            </h2>
            <div className="text-xs md:text-sm text-blue-100/90 mt-1 space-y-0.5">
              <p className="font-extrabold text-cyan-300 uppercase tracking-wide">
                Anestesia Pro • Fundador Dr. Carlos Leal
              </p>
              <p className="text-blue-200/80 text-xs">
                Cálculo ponderado de predictores clínicos, escala EGRI de vía aérea, valoración de Caprini y exportación oficial en PDF.
              </p>
            </div>
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
            {/* Patológicos Familiares */}
            <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                  Patológicos Familiares
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-cyan-400 font-bold hidden sm:inline">Menú:</span>
                  <select
                    onChange={(e) => {
                      handleAntecedentSelect('antFam', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <option value="" disabled>▾ Elegir opción del menú...</option>
                    {ANTECEDENTS_DROPDOWN_OPTIONS.patologicosFamiliares.map((opt, idx) => (
                      <option key={idx} value={opt.label} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                id="antFam"
                rows={2}
                value={formData.antFam}
                onChange={handleChange}
                placeholder="Seleccione del menú desplegable o redacte antecedentes familiares..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antFam', 'Sin antecedentes patológicos de relevancia')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  ✓ Sin antecedentes
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antFam', 'Madre viva con HTA')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  + Madre HTA
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antFam', 'Padre con Diabetes Tipo 2')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  + Padre DM2
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antFam', 'Hipertermia Maligna en familiar directo')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-600/40 transition-all cursor-pointer font-semibold"
                >
                  ⚠️ Hipertermia Maligna
                </button>
              </div>
            </div>

            {/* Patológicos Personales */}
            <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                  Patológicos Personales
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-cyan-400 font-bold hidden sm:inline">Menú:</span>
                  <select
                    onChange={(e) => {
                      handleAntecedentSelect('antPers', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-1 text-[11px] font-bold cursor-pointer transition-colors"
                  >
                    <option value="" disabled>▾ Elegir opción del menú...</option>
                    {ANTECEDENTS_DROPDOWN_OPTIONS.patologicosPersonales.map((opt, idx) => (
                      <option key={idx} value={opt.label} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <textarea
                id="antPers"
                rows={2}
                value={formData.antPers}
                onChange={handleChange}
                placeholder="Seleccione del menú desplegable o redacte patologías personales..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antPers', 'No refiere patologías crónicas')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  ✓ Sano / Niega patología
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antPers', 'Hipertensión Arterial (HTA) controlada')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  + HTA controlada
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antPers', 'Diabetes Mellitus Tipo 2')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  + DM Tipo 2
                </button>
                <button
                  type="button"
                  onClick={() => handleAntecedentSelect('antPers', 'Asma bronquial intermitente')}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-600/40 transition-all cursor-pointer"
                >
                  + Asma
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:col-span-2">
              {/* Alergias */}
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                    Alergias
                  </label>
                  <select
                    onChange={(e) => {
                      handleAntecedentSelect('alergias', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                  >
                    <option value="" disabled>▾ Menú alergias...</option>
                    {ANTECEDENTS_DROPDOWN_OPTIONS.alergias.map((opt, idx) => (
                      <option key={idx} value={opt.label} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  id="alergias"
                  value={formData.alergias}
                  onChange={handleChange}
                  placeholder="Medicamentos, Látex..."
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Alcohol / Hábitos */}
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                    Alcohol / Hábitos
                  </label>
                  <select
                    onChange={(e) => {
                      handleAntecedentSelect('alcohol', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                  >
                    <option value="" disabled>▾ Menú hábitos...</option>
                    {ANTECEDENTS_DROPDOWN_OPTIONS.habitos.map((opt, idx) => (
                      <option key={idx} value={opt.label} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  type="text"
                  id="alcohol"
                  value={formData.alcohol}
                  onChange={handleChange}
                  placeholder="Cigarrillo, alcohol, psicotrópicos..."
                  className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Cirugías Previas */}
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <label className="block text-[11px] font-extrabold uppercase text-slate-400">
                    Cirugías Previas
                  </label>
                  <select
                    onChange={(e) => {
                      handleAntecedentSelect('cirugiasPrev', e.target.value);
                      e.target.value = '';
                    }}
                    defaultValue=""
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-0.5 text-[10px] font-bold cursor-pointer"
                  >
                    <option value="" disabled>▾ Menú cirugías...</option>
                    {ANTECEDENTS_DROPDOWN_OPTIONS.cirugiasPrevias.map((opt, idx) => (
                      <option key={idx} value={opt.label} className="bg-slate-900 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
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

          {/* Escala de Caprini: Riesgo Tromboembólico Quirúrgico (TEV / TVP / TEP) */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-indigo-500/30 mb-4 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white">Escala de Caprini: Riesgo Tromboembólico Quirúrgico (TEV)</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Score: {formData.capriniScore ?? 0} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Estratificación de riesgo de trombosis venosa profunda y embolia pulmonar perioperatoria
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCapriniModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Calculadora Caprini (+40 Factores)</span>
                </button>
                <button
                  type="button"
                  onClick={addCapriniToRecommendations}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                  title="Añadir recomendación de profilaxis a las indicaciones de la sección 5"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+ Agregar al Plan</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                  Categoría de Riesgo Caprini
                </label>
                <select
                  id="capriniCategory"
                  value={formData.capriniCategory || 'Riesgo Bajo (1 - 2 pts)'}
                  onChange={(e) => {
                    const cat = e.target.value;
                    let pts = 2;
                    let prof = 'Tromboprofilaxis mecánica: Medias de compresión elástica graduada o CNI.';
                    if (cat.includes('Muy Bajo')) {
                      pts = 0;
                      prof = 'Deambulación temprana y frecuente.';
                    } else if (cat.includes('Bajo (1')) {
                      pts = 2;
                      prof = 'Tromboprofilaxis mecánica: Medias de compresión elástica graduada o CNI.';
                    } else if (cat.includes('Moderado')) {
                      pts = 3;
                      prof = 'Tromboprofilaxis farmacológica: Enoxaparina 20-40 mg SC/día (o CNI mecánica si alto riesgo de sangrado).';
                    } else if (cat.includes('Alto (5')) {
                      pts = 5;
                      prof = 'Tromboprofilaxis combinada: Enoxaparina 40 mg SC/día + Compresión neumática intermitente (CNI).';
                    } else if (cat.includes('Muy Alto')) {
                      pts = 9;
                      prof = 'Tromboprofilaxis extendida combinada: Enoxaparina 40 mg SC/día + CNI por hasta 30 días postoperatorios.';
                    }
                    setFormData(prev => ({
                      ...prev,
                      capriniScore: pts,
                      capriniCategory: cat,
                      capriniProfilaxis: prof
                    }));
                  }}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none font-bold text-indigo-300"
                >
                  <option value="Riesgo Muy Bajo (0 pts)">0 pts - Riesgo Muy Bajo (Incidencia TEV &lt; 0.5%)</option>
                  <option value="Riesgo Bajo (1 - 2 pts)">1 - 2 pts - Riesgo Bajo (Incidencia TEV ~1.5%)</option>
                  <option value="Riesgo Moderado (3 - 4 pts)">3 - 4 pts - Riesgo Moderado (Incidencia TEV ~3.0%)</option>
                  <option value="Riesgo Alto (5 - 8 pts)">5 - 8 pts - Riesgo Alto (Incidencia TEV ~6.0%)</option>
                  <option value="Riesgo Muy Alto (≥ 9 pts)">≥ 9 pts - Riesgo Muy Alto (Incidencia TEV &gt; 10.7%)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                  Pauta de Tromboprofilaxis Sugerida (Caprini)
                </label>
                <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{formData.capriniProfilaxis || 'Deambulación precoz y compresión mecánica.'}</span>
                </div>
              </div>
            </div>
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

          <div className="space-y-3">
            {/* Menú Desplegable con Selección Múltiple Continua */}
            <div className="bg-slate-950/90 rounded-2xl border-2 border-cyan-500/40 shadow-xl overflow-hidden transition-all">
              {/* Botón Cabecera de Despliegue */}
              <button
                type="button"
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 hover:from-slate-850 hover:to-slate-800 transition-all cursor-pointer text-left select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black text-white">
                        Menú Desplegable de Pautas y Plan Anestésico
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/50">
                        Selección Múltiple Continua
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Baje por la lista y toque todas las pautas que desee agregar o retirar a la vez
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded-xl bg-slate-950 text-cyan-300 border border-slate-700 shadow-inner">
                    {selectedPlanCount} elegidas
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors">
                    {isPlanDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Panel Desplegable */}
              {isPlanDropdownOpen && (
                <div className="p-3 sm:p-4 border-t border-slate-800/80 space-y-3 bg-slate-950/95 animate-fadeIn">
                  {/* Buscador y Filtro por Categoría */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      <input
                        type="text"
                        value={planSearchQuery}
                        onChange={(e) => setPlanSearchQuery(e.target.value)}
                        placeholder="Buscar pauta (ej: ayuno, enoxaparina, omeprazol, sangre, dolor)..."
                        className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-8 py-2 focus:outline-none"
                      />
                      {planSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setPlanSearchQuery('')}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={planCategoryFilter}
                        onChange={(e) => setPlanCategoryFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl px-2.5 py-2 focus:border-cyan-400 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Todas las categorías ({PLAN_ANESTHESIA_SUGGESTIONS.length})</option>
                        {PLAN_ANESTHESIA_SUGGESTIONS.map((cat) => (
                          <option key={cat.category} value={cat.category}>
                            {cat.category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lista con scroll continuo para ir bajando y marcando todo lo deseado */}
                  <div className="max-h-72 sm:max-h-80 overflow-y-auto space-y-4 pr-1">
                    {filteredPlanSuggestions.length === 0 ? (
                      <p className="text-center text-xs text-slate-500 py-6">
                        No se encontraron pautas que coincidan con la búsqueda.
                      </p>
                    ) : (
                      filteredPlanSuggestions.map((cat) => {
                        const activeInCat = cat.options.filter(o => isRecommendationSelected(o.text)).length;
                        return (
                          <div key={cat.category} className="space-y-1.5">
                            <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-sm py-1 px-1 border-b border-slate-800 flex items-center justify-between">
                              <span className="text-[11px] sm:text-xs font-black text-amber-300 tracking-wide uppercase">
                                {cat.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {activeInCat} / {cat.options.length}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
                              {cat.options.map((opt) => {
                                const isSelected = isRecommendationSelected(opt.text);
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => toggleRecommendationItem(opt.text)}
                                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 select-none active:scale-[0.99] ${
                                      isSelected
                                        ? 'bg-emerald-950/70 border-emerald-500/80 text-white shadow-sm ring-1 ring-emerald-500/30'
                                        : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 hover:border-slate-700 text-slate-300'
                                    }`}
                                  >
                                    <div className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                      isSelected
                                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black'
                                        : 'border-slate-600 bg-slate-800/80'
                                    }`}>
                                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                                        {opt.label}
                                      </p>
                                      {opt.shortDesc && (
                                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                          {opt.shortDesc}
                                        </p>
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Acciones Rápidas al pie del catálogo */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold text-slate-400">
                      💡 Toque cualquier pauta para sumarla o quitarla sin que el menú se cierre.
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPlanDropdownOpen(false)}
                      className="text-[11px] font-bold px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                    >
                      Ocultar menú desplegable ↑
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Botones de Acceso Rápido a 1 Toque (Pautas Frecuentes) */}
            <div className="flex flex-wrap items-center gap-1.5 px-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mr-1">Frecuentes:</span>
              {[
                { label: 'Ayuno 8h/2h', text: '• Ayuno de 8h para sólidos y 2h para líquidos claros.' },
                { label: 'Protector Gástrico', text: '• Protección gástrica: Omeprazol 40 mg IV (o Ranitidina 50 mg IV).' },
                { label: 'Analgesia Multimodal', text: '• Analgesia multimodal preventiva y control oportuno del dolor.' },
                { label: 'Profilaxis Antibiótica', text: '• Profilaxis antibiótica 30 a 60 min previos a incisión quirúrgica.' },
                { label: 'Tromboprofilaxis Caprini', text: '• Tromboprofilaxis ajustada según estratificación de riesgo de Caprini.' },
                { label: 'Vigilancia URPA', text: '• Cuidados inmediatos y vigilancia continua en Sala de Recuperación (URPA).' }
              ].map((chip) => {
                const isSelected = isRecommendationSelected(chip.text);
                return (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={() => toggleRecommendationItem(chip.text)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm'
                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{isSelected ? '✓' : '+'}</span>
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">
                Texto del Plan Anestésico y Prescripciones (Editable)
              </label>
              <textarea
                id="recomendaciones"
                rows={4}
                value={formData.recomendaciones}
                onChange={handleChange}
                placeholder="• Seleccione pautas del menú desplegable o escriba aquí libremente las indicaciones..."
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none leading-relaxed font-sans shadow-inner"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                <label className="block text-[11px] font-extrabold uppercase text-slate-400 mb-1">Cédula / ID</label>
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
                <label className="block text-[11px] font-extrabold uppercase text-cyan-300 mb-1">
                  Matrícula / Reg. Médico
                </label>
                <input
                  type="text"
                  id="matricula"
                  value={formData.matricula || ''}
                  onChange={handleChange}
                  placeholder="Ej. MPPS 84920 / ColMed 4521"
                  className="w-full bg-slate-800/80 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none font-semibold text-cyan-200"
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

            {/* Guardar credenciales del anestesiólogo */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] text-slate-400">
                Los datos del anestesiólogo se vinculan automáticamente desde tu perfil médico registrado.
              </span>
              <div className="flex items-center gap-2">
                {doctorSavedNotice && (
                  <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> ¡Credenciales Cargadas!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleReloadSavedDoctorCredentials}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cargar mis credenciales de perfil</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveDoctorCreds}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Recordar datos en este equipo</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex flex-col items-center justify-center gap-3 pt-2">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-900/40 transition-all text-sm sm:text-base cursor-pointer transform active:scale-95"
            >
              <Download className="w-5 h-5 text-cyan-200 shrink-0" />
              <span>{isDownloading ? 'Generando PDF Oficial...' : 'Descargar PDF Oficial (Firma y Logos)'}</span>
            </button>

            <button
              type="button"
              onClick={generatePDF}
              className="flex items-center justify-center gap-2.5 bg-indigo-900/90 hover:bg-indigo-800 border border-indigo-700/60 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-indigo-950/50 transition-all text-sm sm:text-base cursor-pointer transform active:scale-95"
            >
              <Eye className="w-5 h-5 text-indigo-300 shrink-0" />
              <span>Previsualizar / Imprimir Ficha</span>
            </button>
          </div>

          {/* Banner de Aviso de Descarga Exitosa en el Formulario */}
          {downloadSuccessMsg && (
            <div className="w-full max-w-md flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMsg}</span>
            </div>
          )}
        </div>
      </form>

      {/* Modal de Calculadora de Caprini */}
      <CapriniRiskModal
        isOpen={isCapriniModalOpen}
        onClose={() => setIsCapriniModalOpen(false)}
        currentScore={formData.capriniScore || 0}
        currentSelectedItems={formData.capriniSelectedItems || []}
        onApply={applyCapriniAssessment}
        onApplyToPlan={(text) => addRecommendationItem(`• Tromboprofilaxis Caprini: ${text}`)}
        patientAge={formData.edad || ''}
        patientWeight={formData.peso || ''}
        patientSurgery={formData.cirugia || ''}
      />

      {/* Modal de Previsualización y Descarga de PDF Directo */}
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
                      1 Hoja Oficial
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

            {/* Barra de Acciones: Descargar PDF, Imprimir y Cerrar */}
            <div className="p-3 bg-slate-800/90 border-b border-slate-700 flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDirectDownload}
                    disabled={isDownloading}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <Download className="w-4 h-4 text-cyan-200" />
                    <span>{isDownloading ? 'Descargando...' : 'Descargar PDF Oficial'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintPdf}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer border border-slate-600"
                  >
                    <Printer className="w-4 h-4 text-slate-300" />
                    <span>Imprimir Ficha</span>
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

            {/* Panel de Envío Automatizado por WhatsApp y Correo */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-3.5">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Send className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">⚡ Panel de Envío Automatizado de PDF Oficial (Paciente / Colega)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Número de WhatsApp del Destinatario (Ej: 584243291438)</label>
                  <input
                    type="text"
                    value={sharePhone}
                    onChange={(e) => setSharePhone(e.target.value)}
                    placeholder="Número con código de país (sin + ni espacios)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder-slate-600 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase mb-1">Correo Electrónico de Destino (Para Envío Directo de PDF)</label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="correo@paciente.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none placeholder-slate-600 font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleUploadAndSharePreanesthesia}
                  disabled={isUploadingAndSharing}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  {isUploadingAndSharing ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                      <span>Subiendo y Despachando PDF Oficial...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-emerald-200 fill-emerald-200" />
                      <span>Enviar PDF Oficial por WhatsApp y Correo</span>
                    </>
                  )}
                </button>
                <span className="text-[10px] text-slate-400 leading-normal max-w-lg block">
                  Al presionar, el informe médico en PDF se hospeda en la nube de AnestesiaPro de forma confidencial. Se abrirá tu WhatsApp listo para enviar, y se despachará un correo automático al destinatario con el enlace limpio de descarga.
                </span>
              </div>

              {shareSuccessNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{shareSuccessNotice}</span>
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

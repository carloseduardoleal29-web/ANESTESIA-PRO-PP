import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Activity, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  Stethoscope, 
  Droplet,
  Clock,
  BookOpen,
  Syringe,
  Pill,
  Scale,
  Zap,
  Info,
  Check,
  ChevronRight,
  Flame,
  Award,
  FileText,
  Share2
} from 'lucide-react';
import jsPDF from 'jspdf';
import { ShareModal } from '../ShareModal';
import { WhatsAppShareBanner } from '../WhatsAppShareBanner';
import { logAdminActivity, getCanonicalAppOrigin, SHORT_APP_URL } from '../../lib/statsService';
import {
  GraphicEarlyDetection,
  GraphicUterineMassage,
  GraphicOxytocicDrugs,
  GraphicTranexamicAcid,
  GraphicIVFluids,
  GraphicVaginalExam4Ts,
  GraphicEscalateBakri
} from './EmotiveAcronymGraphics';

interface EmotiveVisualProps {
  onDownload?: () => void;
}

export const EmotiveProtocolVisualizer: React.FC<EmotiveVisualProps> = ({ onDownload }) => {
  const [activeTab, setActiveTab] = useState<'acronimo' | 'simulador' | 'farmacos_dosis' | 'ptm_111' | 'atlas_visual' | 'evidencia'>('acronimo');
  const [selectedLetter, setSelectedLetter] = useState<'E1' | 'M' | 'O' | 'T' | 'I' | 'V' | 'E2'>('E1');
  const [timelineStep, setTimelineStep] = useState<number>(1);
  const [calcBloodLoss, setCalcBloodLoss] = useState<number>(650);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    logAdminActivity(
      'explore',
      '🩸 Revisión: Protocolo E-MOTIVE (HPP)',
      'Un colega está revisando el paquete de hemorragia posparto y atlas visual obstétrico'
    );
  }, []);

  // Acronym Definitions
  const acronymData = [
    {
      key: 'E1',
      letter: 'E',
      word: 'Early Detection',
      spanish: 'Detección Precoz Objetiva',
      subtitle: 'Bolsa Colectora Calibrada V-Drape',
      timeframe: 'Minuto 0 a 5',
      badgeColor: 'border-rose-500 bg-rose-950/40 text-rose-300',
      icon: Droplet,
      objective: 'Eliminar el error del 50% de la estimación visual subjetiva y diagnosticar la HPP antes del colapso hemodinámico.',
      keyActions: [
        'Colocar la bolsa colectora graduada en ml (V-Drape) bajo la pelvis inmediatamente tras el alumbramiento en parto vaginal o tras cesárea.',
        'Vigilar marcas visuales calibradas continuas (300 ml, 500 ml, 1000 ml).',
        'Declarar activación del Código Rojo E-MOTIVE si el sangrado supera los 300-500 ml o si existe flujo hemorrágico activo continuo.'
      ],
      drugsAndDoses: [
        { name: 'Bolsa Colectora Calibrada V-Drape', dose: 'Graduada de 100 a 2500 ml', route: 'Subpélvica continua', timing: 'Inmediata postparto' }
      ],
      clinicalPearl: 'El ojo humano subestima la hemorragia obstétrica en un 30% a 50%. La bolsa colectora es el "termómetro" visual que alerta simultáneamente al obstetra, anestesiólogo y enfermería.',
      visualConcept: 'Bolsa colectora graduada transparente con marcas en ml que recopila sangre pura sin dilución de líquido amniótico.'
    },
    {
      key: 'M',
      letter: 'M',
      word: 'Uterine Massage',
      spanish: 'Masaje Uterino Bimanual',
      subtitle: 'Compresión Mecánica Activa',
      timeframe: 'Minuto 0 a 10',
      badgeColor: 'border-amber-500 bg-amber-950/40 text-amber-300',
      icon: Activity,
      objective: 'Estimular la contractilidad miometrial, colapsar los senos venosos y ocluir mecánicamente las arterias espirales ("ligaduras vivas de Pinard").',
      keyActions: [
        'Iniciar masaje uterino externo transabdominal enérgico y continuo con movimientos circulares.',
        'Si no responde, ejecutar Masaje Bimanual: introducir la mano enguantada en la vagina en forma de puño en el fondo de saco anterior y comprimir con la otra mano el fondo uterino desde el abdomen contra el promontorio sacro / sínfisis.',
        'Mantener compresión firme continua hasta lograr hipertonía miometrial sostenida.'
      ],
      drugsAndDoses: [
        { name: 'Compresión Bimanual Uterina', dose: 'Fuerza continua sostenida', route: 'Vaginal + Abdominal', timing: 'Sin interrupción hasta respuesta' }
      ],
      clinicalPearl: 'El masaje no sustituye a los fármacos uterotónicos; actúa como puente hemostático mecánico inmediato mientras se cargan e infunden los fármacos.',
      visualConcept: 'Doble compresión: puño intravaginal apoyado en cara anterior uterina + mano externa traccionando y exprimiendo el fondo uterino.'
    },
    {
      key: 'O',
      letter: 'O',
      word: 'Oxytocic Drugs',
      spanish: 'Uterotónicos Combinados de 1ª Línea',
      subtitle: 'Tríada Uterotónica Protocolizada',
      timeframe: 'Minuto 1 a 15',
      badgeColor: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
      icon: Pill,
      objective: 'Inducir contracción tónica profunda y sostenida de la musculatura lisa del miometrio.',
      keyActions: [
        'Administrar Oxitocina IV de inmediato como uterotónico de primera elección.',
        'Alternativa moderna de larga duración: Carbetocina 100 mcg IV bolo lento (duración 4-6h con estabilidad miometrial superior).',
        'Asociar Metilergonovina 0.2 mg IM o IV lenta si no hay contraindicaciones hipertensivas.',
        'Misoprostol 800 mcg sublingual o rectal en atonías refractarias o cuando no hay acceso IV inmediato.'
      ],
      drugsAndDoses: [
        { name: 'Oxitocina', dose: '10 a 20 UI en 500 ml Cristaloides (o bolo lento 5 UI en 2 min)', route: 'IV en infusión (250-500 mU/min)', timing: 'Minuto 0-5' },
        { name: 'Carbetocina', dose: '100 mcg (1 ampolla)', route: 'IV bolo lento en 1 minuto', timing: 'Alternativa de 1ª línea' },
        { name: 'Metilergonovina / Ergometrina', dose: '0.2 mg (1 ampolla)', route: 'IM profunda (o IV lenta diluida)', timing: 'Contraindicado en Preeclampsia/HTA' },
        { name: 'Misoprostol (PGE1)', dose: '800 mcg (4 tabletas de 200 mcg)', route: 'Sublingual o Rectal', timing: 'Atonía resistente' }
      ],
      clinicalPearl: 'NUNCA administrar Oxitocina en bolo IV rápido directo sin diluir, ya que desencadena vasodilatación sistémica brusca, hipotensión severa y taquicardia refleja colapsante.',
      visualConcept: 'Receptores miometriales OXTR, alfa-1 adrenérgicos y EP1/EP3 activados en cascada de fosfolipasa C e influjo de calcio intracelular.'
    },
    {
      key: 'T',
      letter: 'T',
      word: 'Tranexamic Acid',
      spanish: 'Ácido Tranexámico (TXA)',
      subtitle: 'Inhibición Temprana de Fibrinólisis',
      timeframe: 'Primeros 15 min (<3h de Oro)',
      badgeColor: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
      icon: Syringe,
      objective: 'Estabilizar el coágulo retroplacentario e inhibir la hiperfibrinólisis secundaria al parto.',
      keyActions: [
        'Administrar 1 g de Ácido Tranexámico IV diluido en 100 ml de Solución Fisiológica al 0.9% a pasar en 10 minutos.',
        'Administración PRECOZ: La mayor reducción de mortalidad se obtiene en los primeros 15 a 30 minutos (evidencia sólida del ensayo WOMAN y E-MOTIVE).',
        'Segunda dosis de 1 g IV si el sangrado continúa tras 30 minutos o si recurre dentro de las 24 horas.'
      ],
      drugsAndDoses: [
        { name: 'Ácido Tranexámico (TXA)', dose: '1 g (1000 mg) en 100 ml SF 0.9%', route: 'IV infusión en 10 minutos', timing: 'Minutos 0 a 15 (<3 horas)' },
        { name: 'Segunda Dosis de TXA', dose: '1 g (1000 mg) en 100 ml SF 0.9%', route: 'IV en 10 min', timing: 'A los 30 min si persiste sangrado' }
      ],
      clinicalPearl: 'Cada 15 minutos de retraso en la administración del Ácido Tranexámico reduce su beneficio hemostático en un 10%. Pasadas las 3 horas pierde eficacia y no se recomienda.',
      visualConcept: 'Bloqueo competitivo de los sitios de unión de lisina en el plasminógeno, impidiendo su transformación en plasmina y protegiendo la red de fibrina.'
    },
    {
      key: 'I',
      letter: 'I',
      word: 'IV Fluids & Resuscitation',
      spanish: 'Fluidos IV & Reanimación Anestésica',
      subtitle: 'Acceso Vascular & Normotermia',
      timeframe: 'Minuto 0 a 15',
      badgeColor: 'border-blue-500 bg-blue-950/40 text-blue-300',
      icon: Stethoscope,
      objective: 'Restaurar volumen intravascular circulante eficaz sin provocar coagulopatía dilucional ni hipotermia.',
      keyActions: [
        'Canalizar 2 vías periféricas cortas de grueso calibre (14G o 16G) en extremidades superiores.',
        'Infusión guiada de cristaloides balanceados tibios a 37°C (Ringer Lactato o Plasmalyte), bolos de 500-1000 ml.',
        'Evitar sobrecarga hídrica excesiva (máximo 1500-2000 ml de cristaloides antes de iniciar hemoderivados).',
        'Manta térmica activa y calentador de fluidos en línea para mantener normotermia (>36°C).'
      ],
      drugsAndDoses: [
        { name: 'Cristaloides Balanceados Tibios', dose: '500-1000 ml bolos guiados', route: 'IV vías 14-16G a 37°C', timing: 'Minutos 0-15' },
        { name: 'Gluconato de Calcio 10%', dose: '1 a 2 g (10-20 ml)', route: 'IV lento en 10 min', timing: 'Mantener Ca2+ iónico >1.1 mmol/L' }
      ],
      clinicalPearl: 'La hipotermia (<35°C), acidosis (pH <7.2) e hipocalcemia (Ca2+ <1.1 mmol/L) constituyen la "tríada letal" que anula los factores de coagulación independientemente de los fármacos.',
      visualConcept: 'Monitoreo dinámico del índice de choque (FC / PAS > 0.9 = shock oculto), calentadores activos y fluidoterapia balanceada.'
    },
    {
      key: 'V',
      letter: 'V',
      word: 'Vaginal Examination',
      spanish: 'Examen Vaginal & Regla de las 4Ts',
      subtitle: 'Inspección del Canal del Parto',
      timeframe: 'Minuto 5 a 15',
      badgeColor: 'border-purple-500 bg-purple-950/40 text-purple-300',
      icon: Layers,
      objective: 'Identificar y tratar la causa anatómica subyacente de la hemorragia (4Ts).',
      keyActions: [
        'Examinar sistemáticamente bajo valvas ginecológicas con buena iluminación: cuello uterino, cúpula, paredes vaginales y periné.',
        'Exploración de cavidad uterina: extracción de coágulos retenidos, restos placentarios o cotiledones.',
        'Sutura inmediata de desgarros cervicales/vaginales con hemostasia por planos.',
        'Descartar hematomas retroperitoneales expansivos o rotura uterina oculta.'
      ],
      drugsAndDoses: [
        { name: 'Revisión Instrumental del Canal', dose: 'Inspección completa 4Ts', route: 'Valvas ginecológicas / Tacto', timing: 'Simultáneo con bundle' }
      ],
      clinicalPearl: 'El 70% es Tono (atonía), 20% es Trauma (desgarros), 10% es Tejido (restos) y 1% es Trombina. Un 20% de las pacientes tienen más de una causa simultánea.',
      visualConcept: 'Esquema de las 4Ts: Tono (Atonía), Trauma (Desgarros/Hematoma), Tejido (Placenta retenida), Trombina (Coagulopatía).'
    },
    {
      key: 'E2',
      letter: 'E',
      word: 'Escalate / Advanced Care',
      spanish: 'Escalamiento Quirúrgico & PTM 1:1:1',
      subtitle: 'Balón de Bakri, Cirugía & Banco de Sangre',
      timeframe: 'Minuto 15 a 30+',
      badgeColor: 'border-red-500 bg-red-950/40 text-red-300',
      icon: ShieldAlert,
      objective: 'Detener el sangrado refractario mediante taponamiento intrauterino, control quirúrgico del daño y resucitación hemostática balanceada.',
      keyActions: [
        'Colocar Balón de Taponamiento Intrauterino (Bakri) con insuflación de 300 a 500 ml de Solución Salina estéril tibia (test de taponamiento positivo = cese de sangrado en 5 min).',
        'Activar Protocolo de Transfusión Masiva (PTM): Ratio 1:1:1 (Concentrados de Hematíes : Plasma Fresco Congelado : Plaquetas).',
        'Administrar Fibrinógeno concentrado (1.5-2 g) o Crioprecipitados (10 UI) para mantener Fibrinógeno > 200 mg/dL.',
        'Suturas compresivas hemostáticas de B-Lynch / Hayman, ligadura vascular o histerectomía obstétrica hemostática como último recurso salvavidas.'
      ],
      drugsAndDoses: [
        { name: 'Balón de Bakri Intrauterino', dose: '300 a 500 ml SF estéril', route: 'Transvaginal / Transuterino', timing: 'Fallo de respuesta médica a 15 min' },
        { name: 'PTM Balanceado 1:1:1', dose: '4 PG + 4 PFC + 1 Pool Plaq', route: 'IV en calentador rápido', timing: 'HPP severa ≥1000 ml o shock' },
        { name: 'Concentrado de Fibrinógeno', dose: '1.5 a 2 g IV (o 10 UI Crio)', route: 'IV lento en 10 min', timing: 'Fibrinógeno < 200 mg/dL' },
        { name: 'Gluconato de Calcio', dose: '1-2 g IV por cada 4U PG', route: 'IV lento', timing: 'Evitar hipocalcemia por citrato' }
      ],
      clinicalPearl: 'El test del Balón de Bakri ("Tamponade Test") determina en menos de 5 minutos si la paciente requiere cirugía abierta de control de daños o si la hemostasia mecánica intraluminal es suficiente.',
      visualConcept: 'Balón de silicona intrauterino inflado ejerciendo presión hidrostática continua de 300-500 ml contra el lecho vascular miometrial.'
    }
  ];

  // Helper to generate comprehensive PDF
  const downloadEmotivePDF = () => {
    const doc = new jsPDF();
    let y = 18;

    // Header styling
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(56, 189, 248); // sky-400
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • PROTOCOLO E-MOTIVE OFICIAL', 14, 12);

    doc.setTextColor(241, 245, 249); // slate-100
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Guía Clínica Oficial para Detección Precoz y Paquete de Intervención en Hemorragia Posparto (HPP)', 14, 18);
    doc.text('NEJM Mayo 2023 • Directrices OMS / FIGO / SOAP / WFSA 2023-2026', 14, 23);

    y = 36;

    // Introduction Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(12, y, 186, 26, 3, 3, 'F');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('📌 RESUMEN EJECUTIVO & EVIDENCIA CIENTÍFICA (THE E-MOTIVE TRIAL):', 16, y + 6);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('El ensayo clínico E-MOTIVE (NEJM 2023; 389:11-21, Prof. Arri Coomarasamy, n=210.000) demostró que la detección temprana objetiva', 16, y + 12);
    doc.text('mediante bolsa calibrada sumada al tratamiento simultáneo en paquete de primera línea (M-O-T + I-V-E) reduce en un 60% la HPP severa', 16, y + 17);
    doc.text('(≥1000 ml) y disminuye drásticamente la mortalidad materna, necesidad de laparotomía e histerectomía de rescate.', 16, y + 22);

    y += 32;

    // Acronym Table Header
    doc.setFillColor(30, 41, 59);
    doc.rect(12, y, 186, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('LETRA', 15, y + 5.5);
    doc.text('COMPONENTE / INTERVENCIÓN', 32, y + 5.5);
    doc.text('DOSIS & GUÍA FARMACOLÓGICA', 105, y + 5.5);
    doc.text('OBJETIVO / PERLA', 155, y + 5.5);

    y += 9;

    const tableItems = [
      {
        letter: 'E',
        title: 'Early Detection (Detección Precoz)',
        dose: 'Bolsa Colectora Calibrada V-Drape (100-2500 ml)',
        pearl: 'Elimina el error del 50% de estimación visual'
      },
      {
        letter: 'M',
        title: 'Uterine Massage (Masaje Uterino)',
        dose: 'Masaje externo continuo + Compresión Bimanual',
        pearl: 'Ocluye mecánicamente arterias espirales'
      },
      {
        letter: 'O',
        title: 'Oxytocic Drugs (Uterotónicos)',
        dose: 'Oxitocina 10-20 UI / Carbetocina 100 mcg IV\nMetilergonovina 0.2 mg IM / Misoprostol 800 mcg',
        pearl: 'NUNCA dar oxitocina en bolo IV rápido'
      },
      {
        letter: 'T',
        title: 'Tranexamic Acid (Ácido Tranexámico)',
        dose: '1 g IV en 100 ml SF 0.9% en 10 min\nRepetir 1 g a los 30 min si persiste sangrado',
        pearl: 'Ventana de oro < 15-30 min (< 3 horas)'
      },
      {
        letter: 'I',
        title: 'IV Fluids (Reanimación Anestésica)',
        dose: '2 vías 14-16G, Cristaloides balanceados 37°C\nGluconato de Calcio 1-2 g IV (Ca2+ > 1.1 mmol/L)',
        pearl: 'Evitar la tríada letal (hipotermia, acidosis, hipocalcemia)'
      },
      {
        letter: 'V',
        title: 'Vaginal Exam (Examen 4Ts)',
        dose: 'Inspección sistemática de cuello, vagina y periné\nExtracción de restos placentarios',
        pearl: '4Ts: Tono (70%), Trauma (20%), Tejido (10%), Trombina (1%)'
      },
      {
        letter: 'E',
        title: 'Escalate (Balón Bakri / PTM / Cirugía)',
        dose: 'Balón Bakri 300-500 ml SF / PTM 1:1:1 (PG:PFC:Plaq)\nFibrinógeno > 200 mg/dL (1.5-2 g) / Sutura B-Lynch',
        pearl: 'Tamponade test positivo en < 5 min evita laparotomía'
      }
    ];

    tableItems.forEach((item, index) => {
      const isAlt = index % 2 === 1;
      doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
      doc.rect(12, y, 186, 17, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(12, y, 186, 17, 'S');

      doc.setTextColor(225, 29, 72); // Rose
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(item.letter, 18, y + 9);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(item.title, 32, y + 6);

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      const splitDose = doc.splitTextToSize(item.dose, 48);
      doc.text(splitDose, 105, y + 5.5);

      const splitPearl = doc.splitTextToSize(item.pearl, 40);
      doc.text(splitPearl, 155, y + 5.5);

      y += 18;
    });

    y += 4;

    // Resuscitation Protocol PTM 1:1:1 Box
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    doc.roundedRect(12, y, 186, 24, 3, 3, 'FD');

    doc.setTextColor(153, 27, 27);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('🩸 PROTOCOLO DE TRANSFUSIÓN MASIVA (PTM 1:1:1) & GESTIÓN ANESTESIOLÓGICA:', 16, y + 6);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text('• Relación Balanceada 1:1:1: 4 Concentrados de Hematíes : 4 Plasmas Frescos Congelados : 1 Pool de Plaquetas (o 4 U Plaquetas).', 16, y + 11);
    doc.text('• Optimización de Fibrinógeno: Mantener Fibrinógeno > 200 mg/dL mediante Concentrado de Fibrinógeno 1.5-2 g o 10 UI de Crioprecipitados.', 16, y + 15);
    doc.text('• Calcio Iónico Crítico: Administrar 1-2 g de Gluconato de Calcio IV cada 4 unidades de hemoderivados para neutralizar el citrato.', 16, y + 19);

    y += 28;

    // Bibliography & Citations Footer
    doc.setFillColor(241, 245, 249);
    doc.rect(12, y, 186, 18, 'F');
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('BIBLIOGRAFÍA DE REFERENCIA OFICIAL:', 15, y + 5);
    doc.text('1. Coomarasamy A, et al. Randomized Trial of an Early Detection and Treatment Bundle for Postpartum Hemorrhage. N Engl J Med 2023; 389:11-21.', 15, y + 9);
    doc.text('2. World Health Organization (WHO). WHO recommendations for the prevention and treatment of postpartum haemorrhage (2023-2026).', 15, y + 13);
    doc.text('3. FIGO Postpartum Hemorrhage Guidelines / SOAP Consensus Statement on Obstetric Hemorrhage Management (2024-2025).', 15, y + 17);

    logAdminActivity(
      'download',
      '📥 Descarga PDF: Protocolo E-MOTIVE',
      'Un colega descargó el algoritmo oficial y guía de hemorragia posparto'
    );

    doc.save('Protocolo_E_MOTIVE_Hemorragia_Posparto_NEJM_OMS_AnestesiaPro.pdf');
  };

  const selectedData = acronymData.find(a => a.key === selectedLetter) || acronymData[0];

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0 text-white animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 p-4 sm:p-6 border-b border-rose-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Droplet className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> E-MOTIVE Bundle
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700">
                NEJM Mayo 2023 • OMS / FIGO / SOAP
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Protocolo E-MOTIVE: Paquete de Intervención en Hemorragia Posparto (HPP)</span>
            </h2>
            <p className="text-xs sm:text-sm text-rose-200/90 font-medium max-w-3xl leading-relaxed">
              Detección precoz objetiva con bolsa colectora calibrada + paquete simultáneo de primera línea (M-O-T + I-V-E). Ensayo multicéntrico aleatorizado en 80 hospitales con &gt;210.000 pacientes que redujo la HPP severa en un 60%.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowShareModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Compartir Protocolo E-MOTIVE por WhatsApp y Redes"
            >
              <Share2 className="w-4 h-4 text-slate-950" />
              <span>Compartir Guía</span>
            </button>
            <button
              onClick={downloadEmotivePDF}
              className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF Oficial E-MOTIVE</span>
            </button>
            <a
              href="https://www.nejm.org/doi/full/10.1056/NEJMoa2303966"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-700/50 font-bold text-xs px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-all"
            >
              <span>Ver en NEJM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* BANNER PARA COMPARTIR POR WHATSAPP Y REDES */}
      <div className="px-3 sm:px-6 pt-2">
        <WhatsAppShareBanner
          title="🩸 Protocolo E-MOTIVE: Hemorragia Posparto (NEJM / OMS / FIGO)"
          description="Detección temprana con bolsa colectora calibrada V-Drape y respuesta médica simultánea en los primeros 15 minutos: Masaje bimanual + Uterotónicos de 1ª línea + Ácido Tranexámico 1g IV + Cristaloides tibios 37°C + Examen 4Ts + Balón de Bakri y PTM 1:1:1. Reduce en un 60% la HPP severa. Incluye Atlas visual interactivo con gráficos por cada letra, simulador cronológico y Guía Oficial descargable en PDF."
          resourceId="res-protocolo-emotive-hemorragia-posparto-2026"
          shareText="🚨 Colega, te comparto el Protocolo E-MOTIVE (Hemorragia Posparto NEJM / OMS / FIGO) en AnestesiaPro:\n\nDetección temprana con bolsa colectora calibrada V-Drape y respuesta médica simultánea en los primeros 15 minutos: Masaje bimanual + Uterotónicos de 1ª línea + Ácido Tranexámico 1g IV + Cristaloides tibios 37°C + Examen 4Ts + Balón de Bakri y PTM 1:1:1. Reduce en un 60% la HPP severa. Incluye Atlas visual interactivo con gráficos por cada letra, simulador cronológico y Guía Oficial descargable en PDF."
          theme="rose"
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-900/90 px-3 sm:px-6 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'acronimo', label: '1. Acrónimo E-M-O-T-I-V-E', icon: Layers },
          { id: 'simulador', label: '2. Cronología de los 15 Minutos de Oro', icon: Clock },
          { id: 'farmacos_dosis', label: '3. Fármacos & Dosificación Exacta', icon: Pill },
          { id: 'ptm_111', label: '4. Transfusión Masiva 1:1:1 & Calcio', icon: Stethoscope },
          { id: 'atlas_visual', label: '5. Atlas Gráfico de Cada Letra', icon: Sparkles },
          { id: 'evidencia', label: '6. Evidencia Científica & Ensayos', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-400/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: ACRONYM EXPLORER */}
      {activeTab === 'acronimo' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Acronym Buttons Bar */}
          <div className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Selecciona una letra del Acrónimo E-MOTIVE para explorar el protocolo:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {acronymData.map((item) => {
                const isSel = selectedLetter === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedLetter(item.key as any)}
                    className={`p-3 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-2 cursor-pointer ${
                      isSel
                        ? 'bg-gradient-to-br from-rose-900/70 to-slate-900 border-rose-500 shadow-lg shadow-rose-900/30 scale-[1.02] ring-2 ring-rose-500/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-black font-mono ${isSel ? 'text-rose-400' : 'text-slate-400'}`}>
                        {item.letter}
                      </span>
                      <Icon className={`w-4 h-4 ${isSel ? 'text-rose-400' : 'text-slate-500'}`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white line-clamp-1">{item.word}</p>
                      <p className="text-[9px] text-slate-400 font-medium line-clamp-1">{item.timeframe}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Letter Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-600 to-red-700 rounded-2xl flex items-center justify-center text-3xl font-black text-white font-mono shadow-lg shrink-0">
                  {selectedData.letter}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      {selectedData.word}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ⏱️ {selectedData.timeframe}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedData.spanish}
                  </h3>
                  <p className="text-xs text-slate-300 font-semibold">
                    {selectedData.subtitle}
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-right shrink-0">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paso del Bundle</p>
                <p className="text-sm font-black text-rose-400">Respuesta E-MOTIVE</p>
              </div>
            </div>

            {/* Educational Interactive Graphic Illustration */}
            <div className="w-full">
              {selectedLetter === 'E1' && <GraphicEarlyDetection />}
              {selectedLetter === 'M' && <GraphicUterineMassage />}
              {selectedLetter === 'O' && <GraphicOxytocicDrugs />}
              {selectedLetter === 'T' && <GraphicTranexamicAcid />}
              {selectedLetter === 'I' && <GraphicIVFluids />}
              {selectedLetter === 'V' && <GraphicVaginalExam4Ts />}
              {selectedLetter === 'E2' && <GraphicEscalateBakri />}
            </div>

            {/* Objective & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left Column: Objective & Actions */}
              <div className="space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-400" /> Objetivo Clínico Primario
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {selectedData.objective}
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" /> Acciones Clave Inmediatas
                  </h4>
                  <ul className="space-y-2">
                    {selectedData.keyActions.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="w-5 h-5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Drugs / Equipment & Clinical Pearl */}
              <div className="space-y-4">
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-400" /> Dosis & Guía Farmacológica
                  </h4>
                  <div className="space-y-2.5">
                    {selectedData.drugsAndDoses.map((drug, di) => (
                      <div key={di} className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-black text-white">{drug.name}</p>
                          <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded">
                            {drug.route}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-emerald-400">{drug.dose}</p>
                        <p className="text-[11px] text-slate-400 font-medium">Momento: {drug.timing}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/40 rounded-2xl p-4 space-y-2 shadow-inner">
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Perla Clínica / Pro-Tip Anestésico
                  </h4>
                  <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                    {selectedData.clinicalPearl}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: TIMELINE SIMULATOR */}
      {activeTab === 'simulador' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Respuesta Médica Paralela Coordinada
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  La Ventana de Oro de los Primeros 15 Minutos (E-MOTIVE Response)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Paso {timelineStep} de 4</span>
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { step: 1, label: 'Minuto 0: Alumbramiento', sub: 'Colocación de Bolsa Calibrada V-Drape' },
                { step: 2, label: 'Minutos 1-5: Diagnóstico', sub: 'Pérdida ≥300-500 ml -> Disparo de Alarma' },
                { step: 3, label: 'Minutos 5-15: Bundle M-O-T', sub: 'Masaje + Uterotónicos + TXA 1g IV' },
                { step: 4, label: 'Minutos 15-30: Escalamiento', sub: 'Balón Bakri + PTM 1:1:1 + Calcio + Quirófano' }
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setTimelineStep(s.step)}
                  className={`p-3.5 rounded-2xl border transition-all text-left space-y-1 cursor-pointer ${
                    timelineStep === s.step
                      ? 'bg-rose-950/70 border-rose-500 ring-2 ring-rose-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-rose-400 font-mono">Fase {s.step}</span>
                    {timelineStep === s.step && <Check className="w-3.5 h-3.5 text-rose-400" />}
                  </div>
                  <p className="text-xs font-black text-white">{s.label}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{s.sub}</p>
                </button>
              ))}
            </div>

            {/* Timeline Detailed View */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              {timelineStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 text-sm font-black">
                    <Droplet className="w-5 h-5" /> Minuto 0: Alumbramiento y Colocación Sistemática de la Bolsa
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Apenas ocurre el parto o durante la cesárea, se coloca el paño/bolsa colectora graduada bajo la pelvis de la madre. Esto permite que el 100% de la sangre perdida ingrese al contenedor calibrado sin mezclarse con líquido amniótico previo.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Marca de Seguridad</p>
                      <p className="text-sm font-black text-emerald-400">&lt; 300 ml</p>
                      <p className="text-[10px] text-slate-500">Pérdida fisiológica esperable.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-rose-900/50">
                      <p className="text-[10px] text-rose-300 font-bold uppercase">Alerta E-MOTIVE</p>
                      <p className="text-sm font-black text-amber-400">300 a 500 ml</p>
                      <p className="text-[10px] text-slate-400">Preparación inmediata del paquete.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-red-800">
                      <p className="text-[10px] text-red-400 font-bold uppercase">Activación Código Rojo</p>
                      <p className="text-sm font-black text-red-500">≥ 500 ml o Sangrado Activo</p>
                      <p className="text-[10px] text-slate-400">Ejecución paralela del bundle.</p>
                    </div>
                  </div>
                </div>
              )}

              {timelineStep === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-black">
                    <AlertTriangle className="w-5 h-5" /> Minutos 1 a 5: Diagnóstico Precoz & Declaración en Voz Alta
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Al alcanzar el nivel de 300-500 ml en la bolsa graduada, cualquier miembro del equipo (obstetra, anestesiólogo, matrona o enfermera) anuncia la activación del Código E-MOTIVE. Se prohíbe esperar a que la paciente presente hipotensión o taquicardia para actuar.
                  </p>
                  <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200">
                    💡 <strong>Regla de Oro:</strong> Los signos vitales tradicionales (presión arterial y pulso) son tardíos en pacientes jóvenes y sanas debido a la hipervolemia del embarazo. La bolsa colectora detecta el sangrado 20 minutos antes del colapso.
                  </div>
                </div>
              )}

              {timelineStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-black">
                    <Zap className="w-5 h-5" /> Minutos 5 a 15: Paquete Farmacológico Simultáneo (M-O-T + I-V)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    En lugar de la antigua conducta escalonada lenta, se inician las 4 intervenciones de primera línea en paralelo:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-xs font-black text-white">1. Masaje Uterino Continuo (M)</p>
                      <p className="text-[11px] text-slate-400">Bimanual si la atonía no cede.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-xs font-black text-white">2. Uterotónicos (O)</p>
                      <p className="text-[11px] text-slate-400">Oxitocina 10-20 UI IV o Carbetocina 100 mcg + Ergometrina 0.2 mg.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-xs font-black text-white">3. Ácido Tranexámico (T)</p>
                      <p className="text-[11px] text-slate-400">1 g IV en 10 min en solución salina.</p>
                    </div>
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <p className="text-xs font-black text-white">4. Accesos IV & Cristaloides Tibios (I-V)</p>
                      <p className="text-[11px] text-slate-400">2 vías 14-16G, revisión de canal y 4Ts.</p>
                    </div>
                  </div>
                </div>
              )}

              {timelineStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-rose-500 text-sm font-black">
                    <ShieldAlert className="w-5 h-5" /> Minutos 15 a 30+: Escalamiento Avanzado (E)
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Si el sangrado persiste tras 15 minutos de la ejecución del bundle inicial:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <strong>Balón de Taponamiento de Bakri:</strong> Insuflar con 300 a 500 ml de solución salina tibia.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <strong>Protocolo de Transfusión Masiva (PTM 1:1:1):</strong> 4 PG + 4 PFC + 1 Pool de Plaquetas + Calcio iónico.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <strong>Control Quirúrgico de Daños:</strong> Sutura de B-Lynch / Hayman, ligaduras arteriales o histerectomía obstétrica.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: DRUGS & EXACT DOSAGES */}
      {activeTab === 'farmacos_dosis' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">
                  Farmacopea Obstétrica E-MOTIVE
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Tabla Maestra de Dosificación, Infusiones y Contraindicaciones
                </h3>
              </div>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px] font-mono px-3 py-1 rounded-full font-bold">
                Clase I • Nivel A
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="p-3">Fármaco</th>
                    <th className="p-3">Dosis & Vía</th>
                    <th className="p-3">Tiempo de Infusión</th>
                    <th className="p-3">Mecanismo</th>
                    <th className="p-3">Contraindicaciones / Precauciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium text-slate-200">
                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-cyan-300">
                      Oxitocina
                      <span className="block text-[10px] text-slate-400 font-normal">Agonista receptores OXTR</span>
                    </td>
                    <td className="p-3">
                      10 a 20 UI en 500 ml Cristaloides (o bolo lento de 5 UI diluido)
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">Infusión continua en 1-2 horas (250-500 mU/min)</td>
                    <td className="p-3 text-[11px]">Contracción rítmica del fondo uterino.</td>
                    <td className="p-3 text-rose-300 text-[11px]">
                      ⚠️ <strong>Prohibido bolo IV rápido</strong> (causa hipotensión refleja severa y colapso cardiovascular).
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-cyan-300">
                      Carbetocina
                      <span className="block text-[10px] text-slate-400 font-normal">Análogo sintético de oxitocina</span>
                    </td>
                    <td className="p-3">
                      100 mcg (1 ampolla)
                    </td>
                    <td className="p-3 text-cyan-400 font-mono">Bolo IV lento en 1 minuto</td>
                    <td className="p-3 text-[11px]">Acción prolongada (4-6 horas) con estabilidad miometrial.</td>
                    <td className="p-3 text-slate-300 text-[11px]">
                      No administrar en embarazos previos al alumbramiento. Excelente tolerancia hemodinámica.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-amber-300">
                      Metilergonovina / Ergometrina
                      <span className="block text-[10px] text-slate-400 font-normal">Alcaloide cornezuelo de centeno</span>
                    </td>
                    <td className="p-3">
                      0.2 mg (1 ampolla) IM profunda
                    </td>
                    <td className="p-3 text-amber-400 font-mono">Inmediata (IM) o IV muy lenta diluida</td>
                    <td className="p-3 text-[11px]">Contracción tónica tetánica sostenida (miometrio superior e inferior).</td>
                    <td className="p-3 text-red-400 text-[11px] font-bold">
                      ⛔ CONTRAINDICADO en Preeclampsia, Hipertensión Arterial o cardiopatía isquémica.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-emerald-300">
                      Ácido Tranexámico (TXA)
                      <span className="block text-[10px] text-slate-400 font-normal">Antifibrinolítico sintético</span>
                    </td>
                    <td className="p-3 font-bold text-emerald-400">
                      1 g (1000 mg) en 100 ml SF 0.9%
                    </td>
                    <td className="p-3 text-emerald-400 font-mono">Infusión en 10 minutos (Ventana &lt;3h)</td>
                    <td className="p-3 text-[11px]">Bloquea degradación de fibrina y estabiliza coágulo hemostático.</td>
                    <td className="p-3 text-emerald-200 text-[11px]">
                      Seguro en HTA. Repetir segunda dosis de 1g a los 30 min si persiste sangrado.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-purple-300">
                      Misoprostol (PGE1)
                      <span className="block text-[10px] text-slate-400 font-normal">Análogo prostaglandina E1</span>
                    </td>
                    <td className="p-3">
                      800 mcg (4 tabletas de 200 mcg)
                    </td>
                    <td className="p-3 text-purple-400 font-mono">Vía Sublingual o Rectal</td>
                    <td className="p-3 text-[11px]">Receptores miometriales EP3; útil en atonía resistente.</td>
                    <td className="p-3 text-slate-300 text-[11px]">
                      Efectos secundarios: Fiebre transitoria, escalofríos y temblores.
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-850 transition-colors">
                    <td className="p-3 font-bold text-rose-400">
                      Gluconato de Calcio 10%
                      <span className="block text-[10px] text-slate-400 font-normal">Electrolito hemostático</span>
                    </td>
                    <td className="p-3">
                      1 a 2 g (10-20 ml) IV
                    </td>
                    <td className="p-3 text-rose-400 font-mono">IV lento en 10 minutos</td>
                    <td className="p-3 text-[11px]">Cofactor indispensable en todos los pasos de la cascada de coagulación.</td>
                    <td className="p-3 text-slate-300 text-[11px]">
                      Obligatorio administrar por cada 4 concentrados de hematíes para contrarrestar el citrato.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: PTM 1:1:1 & ANESTHETIC RESUSCITATION */}
      {activeTab === 'ptm_111' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Resucitación Anestésica de Control de Daños
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Protocolo de Transfusión Masiva (PTM 1:1:1), Fibrinógeno y Manejo de Calcio
                </h3>
              </div>
              <span className="bg-rose-950 text-rose-300 border border-rose-800 text-xs font-mono px-3 py-1 rounded-full font-bold">
                Ratio 1:1:1 Hemoderivados
              </span>
            </div>

            {/* Visual Ratio Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-rose-800/60 rounded-2xl p-5 text-center space-y-2 shadow-inner">
                <div className="w-12 h-12 bg-rose-600/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/40">
                  <Droplet className="w-6 h-6" />
                </div>
                <p className="text-2xl font-black text-rose-400 font-mono">1 (4 U)</p>
                <p className="text-xs font-bold text-white uppercase">Concentrados de Hematíes (PG)</p>
                <p className="text-[11px] text-slate-400">Restaura transporte de O2 celular y volemia globular.</p>
              </div>

              <div className="bg-slate-950 border border-amber-800/60 rounded-2xl p-5 text-center space-y-2 shadow-inner">
                <div className="w-12 h-12 bg-amber-600/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/40">
                  <Activity className="w-6 h-6" />
                </div>
                <p className="text-2xl font-black text-amber-400 font-mono">1 (4 U)</p>
                <p className="text-xs font-bold text-white uppercase">Plasma Fresco Congelado (PFC)</p>
                <p className="text-[11px] text-slate-400">Aporta factores de coagulación lábiles y estables.</p>
              </div>

              <div className="bg-slate-950 border border-cyan-800/60 rounded-2xl p-5 text-center space-y-2 shadow-inner">
                <div className="w-12 h-12 bg-cyan-600/20 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-500/40">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="text-2xl font-black text-cyan-400 font-mono">1 (1 Pool / 4 U)</p>
                <p className="text-xs font-bold text-white uppercase">Concentrado de Plaquetas</p>
                <p className="text-[11px] text-slate-400">Mantener recuento plaquetario &gt; 50.000 - 100.000 /µL.</p>
              </div>
            </div>

            {/* Critical Targets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Meta de Fibrinógeno</p>
                <p className="text-base font-black text-emerald-400">&gt; 200 mg/dL</p>
                <p className="text-[10px] text-slate-400">Administrar 1.5-2g de Fibrinógeno o 10 U Crioprecipitados si &lt;200.</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Calcio Iónico (Ca2+)</p>
                <p className="text-base font-black text-rose-400">&gt; 1.1 mmol/L</p>
                <p className="text-[10px] text-slate-400">Gluconato de Calcio 1-2g IV por cada 4 unidades transfundidas.</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Temperatura Corporal</p>
                <p className="text-base font-black text-amber-400">&gt; 36.0 °C</p>
                <p className="text-[10px] text-slate-400">Manta de aire caliente forzado y calentador activo de fluidos.</p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Equilibrio Ácido-Base</p>
                <p className="text-base font-black text-cyan-400">pH &gt; 7.25 / Lactato &lt; 2</p>
                <p className="text-[10px] text-slate-400">Prevenir la acidosis que bloquea la activación de trombina.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: ATLAS VISUAL & GRAPHICAL REFERENCES */}
      {activeTab === 'atlas_visual' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Infografía Visual & Referencias Técnicas Oficiales
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Atlas Visual Paso a Paso para Cada Letra del Acrónimo E-MOTIVE
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Ilustraciones anatómicas, farmacológicas y de dispositivos médicos para cada componente del paquete de intervención rápida.
                </p>
              </div>
              <button
                onClick={downloadEmotivePDF}
                className="self-start sm:self-auto bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Atlas en PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 1. E: Bolsa Colectora V-Drape */}
              <div className="space-y-2">
                <GraphicEarlyDetection className="h-full" />
              </div>

              {/* 2. M: Masaje Uterino Bimanual */}
              <div className="space-y-2">
                <GraphicUterineMassage className="h-full" />
              </div>

              {/* 3. O: Uterotónicos */}
              <div className="space-y-2">
                <GraphicOxytocicDrugs className="h-full" />
              </div>

              {/* 4. T: Ácido Tranexámico */}
              <div className="space-y-2">
                <GraphicTranexamicAcid className="h-full" />
              </div>

              {/* 5. I: Fluidos IV & Reanimación */}
              <div className="space-y-2">
                <GraphicIVFluids className="h-full" />
              </div>

              {/* 6. V: Examen Genital & 4Ts */}
              <div className="space-y-2">
                <GraphicVaginalExam4Ts className="h-full" />
              </div>

              {/* 7. E: Escalamiento, Bakri & PTM 1:1:1 (Full width on lg) */}
              <div className="space-y-2 lg:col-span-2">
                <GraphicEscalateBakri className="h-full" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: SCIENTIFIC EVIDENCE & BIBLIOGRAPHY */}
      {activeTab === 'evidencia' && (
        <div className="p-4 sm:p-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">
                  Respaldo Académico & Fuentes Primarias
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Evidencia Científica, Ensayos Clínicos & Bibliografía Oficial
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* Landmark Trial: NEJM 2023 */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-black px-2.5 py-1 rounded-lg">
                    THE E-MOTIVE TRIAL • THE NEW ENGLAND JOURNAL OF MEDICINE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">NEJM 2023; 389:11-21</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  Randomized Trial of an Early Detection and Treatment Bundle for Postpartum Hemorrhage
                </h4>
                <p className="text-xs text-slate-300 font-bold">
                  Autores: Prof. Arri Coomarasamy, F. Gallos, D. Lissauer, et al. (Universidad de Birmingham & Centro Colaborador OMS).
                </p>
                <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <p><strong>Diseño:</strong> Ensayo clínico aleatorizado por conglomerados en 80 hospitales (Kenia, Nigeria, Sudáfrica, Tanzania) sobre 210.000 pacientes.</p>
                  <p><strong>Resultados Principales:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-rose-200">
                    <li>Reducción del 60% en hemorragia posparto severa (≥1000 ml) (RR 0.40; IC 95%: 0.32-0.50; P &lt; 0.001).</li>
                    <li>Descenso del 40% en el desenlace adverso compuesto materno (laparotomía por sangrado, histerectomía o muerte materna).</li>
                    <li>Tasa de detección temprana de HPP incrementada del 51% al 93%.</li>
                  </ul>
                </div>
                <div className="pt-1 flex justify-end">
                  <a
                    href="https://www.nejm.org/doi/full/10.1056/NEJMoa2303966"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 hover:text-cyan-300"
                  >
                    <span>DOI: 10.1056/NEJMoa2303966</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Citations List */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Guías Oficiales & Referencias Internacionales
                </h4>
                <ul className="space-y-3 text-xs text-slate-300 divide-y divide-slate-800/60">
                  <li className="pt-2">
                    <p className="font-bold text-white">Organización Mundial de la Salud (OMS / WHO):</p>
                    <p className="text-slate-400">
                      WHO recommendations for the prevention and treatment of postpartum haemorrhage (2023-2026). Geneve: World Health Organization.
                    </p>
                  </li>
                  <li className="pt-2">
                    <p className="font-bold text-white">The WOMAN Trial Collaborators (The Lancet 2017):</p>
                    <p className="text-slate-400">
                      Effect of early tranexamic acid administration on mortality, hysterectomy, and other morbidities in women with post-partum haemorrhage: an international, randomised, double-blind, placebo-controlled trial. Lancet 2017; 389(10084): 2105-2116.
                    </p>
                  </li>
                  <li className="pt-2">
                    <p className="font-bold text-white">FIGO Guidelines (2023-2025):</p>
                    <p className="text-slate-400">
                      International Federation of Gynecology and Obstetrics (FIGO) recommendations on the management of postpartum hemorrhage and shock. Int J Gynaecol Obstet 2024.
                    </p>
                  </li>
                  <li className="pt-2">
                    <p className="font-bold text-white">Society for Obstetric Anesthesia and Perinatology (SOAP):</p>
                    <p className="text-slate-400">
                      Consensus Statement on the Anesthetic Management of Obstetric Hemorrhage and Massive Transfusion Protocols. Anesth Analg 2024.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Branding Bar */}
      <div className="bg-slate-950 p-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-500" />
          <span>AnestesiaPro Medical Guidelines • Dr. Carlos Leal</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadEmotivePDF}
            className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Descargar Ficha PDF
          </button>
        </div>
      </div>

      {/* SHARE MODAL PRE-POPULATED FOR E-MOTIVE */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={{
          title: '🩸 Protocolo E-MOTIVE: Hemorragia Posparto (NEJM / OMS / FIGO)',
          category: 'URGENCIA OBSTÉTRICA 2026',
          badge: 'NUEVO PROTOCOLO CLÍNICO',
          description: 'Detección temprana con bolsa colectora calibrada V-Drape y respuesta médica simultánea en los primeros 15 minutos: Masaje bimanual + Uterotónicos de 1ª línea + Ácido Tranexámico 1g IV + Cristaloides tibios 37°C + Examen 4Ts + Balón de Bakri y PTM 1:1:1. Reduce en un 60% la HPP severa. Incluye Atlas visual interactivo con gráficos por cada letra, simulador cronológico y Guía Oficial descargable en PDF.',
          url: `${SHORT_APP_URL}?recurso=emotive`
        }}
      />
    </div>
  );
};

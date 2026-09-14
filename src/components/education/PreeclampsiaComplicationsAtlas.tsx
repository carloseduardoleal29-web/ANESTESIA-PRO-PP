import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Brain, 
  Heart, 
  Activity, 
  Stethoscope, 
  ShieldAlert, 
  Zap, 
  Eye, 
  Layers, 
  ChevronRight, 
  CheckCircle2, 
  Info,
  Droplet,
  Flame,
  FileText
} from 'lucide-react';

interface ComplicationData {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  severity: 'EXTREMA' | 'ALTA' | 'CRÍTICA';
  color: string;
  borderColor: string;
  bgLight: string;
  icon: any;
  organs: string[];
  incidence: string;
  mortality: string;
  hallmark: string;
  pathophysiology: string[];
  clinicalFeatures: string[];
  diagnosticCriteria: string[];
  anestheticEmergencySteps: string[];
  warningNote: string;
  realImage?: {
    imageSrc: string;
    secondarySrc?: string;
    imageTitle: string;
    modality: string;
    imageDescription: string;
    radiologicalFindings: string[];
  };
}

export const PreeclampsiaComplicationsAtlas: React.FC = () => {
  const [selectedCompId, setSelectedCompId] = useState<string>('eclampsia');
  const [zoomVisual, setZoomVisual] = useState<boolean>(false);

  const complications: ComplicationData[] = [
    {
      id: 'eclampsia',
      number: 1,
      name: 'Eclampsia',
      subtitle: 'Crisis Convulsiva Generalizada & Emergencia Neurovascular',
      severity: 'CRÍTICA',
      color: 'text-rose-400',
      borderColor: 'border-rose-500',
      bgLight: 'bg-rose-950/40',
      icon: Brain,
      organs: ['Cerebro', 'Tronco Encefálico', 'Uniones Neuromusculares'],
      incidence: '1.5 - 2% en preeclampsia con criterios de severidad',
      mortality: '1 a 3% en países con protocolos activos; hasta 15% en zonas remotas',
      hallmark: 'Convulsiones tónico-clónicas agudas que no pueden ser atribuidas a otra causa neurológica en una gestante con preeclampsia.',
      realImage: {
        imageSrc: '/images/mri_pres_brain_flair.svg',
        secondarySrc: '/images/mri_pres_coronal.svg',
        imageTitle: 'Resonancia Magnética Cerebral Real (Secuencia Axial FLAIR)',
        modality: 'RM Cerebral T2/FLAIR en Paciente Eclámptica',
        imageDescription: 'Extenso edema vasogénico cortico-subcortical bilateral y simétrico de predominio en regiones parieto-occipitales, patognomónico del Síndrome de Encefalopatía Posterior Reversible (PRES) asociado a eclampsia.',
        radiologicalFindings: [
          'Hiperintensidad en secuencia FLAIR que compromete la sustancia blanca subcortical parieto-occipital bilateral.',
          'Ausencia de restricción en difusión (DWI normal con ADC elevado), confirmando edema vasogénico reversible y descartando infarto citotóxico.',
          'Reversibilidad total del edema cerebral en el 95% de las pacientes tras control tensional agresivo y Sulfato de Magnesio.'
        ]
      },
      pathophysiology: [
        'Pérdida del límite superior de autorregulación del Flujo Sanguíneo Cerebral (FSC) cuando la PAM supera los 140 mmHg.',
        'Hiperperfusión forzada con dilatación arteriolar pasiva que rompe las uniones estrechas (zonula occludens) de la barrera hematoencefálica.',
        'Edema vasogénico masivo predominantemente en la sustancia blanca parieto-occipital (Síndrome PRES).',
        'Inundación de glutamato extracelular que sobreexcita los receptores NMDA, disparando un influjo masivo de calcio (Ca²⁺) y despolarización paroxística masiva.'
      ],
      clinicalFeatures: [
        'Cefalea holocraneana o pulsátil intensa, refractaria a paracetamol o AINEs.',
        'Trastornos visuales premonitorios: escotomas centellantes, fotofobia, diplopía, amaurosis fugaz (ceguera cortical).',
        'Hiperreflexia patelar patológica con clonus agotable o inagotable.',
        'Epigastralgia aguda en barra por estimulación neurovegetativa o congestión hepática.',
        'Fase tónica (20-30 seg) con apnea y cianosis, seguida de fase clónica (1-2 min) y coma posictal transitorio.'
      ],
      diagnosticCriteria: [
        'Presencia de convulsión tónico-clónica generalizada en cualquier momento del embarazo, parto o puerperio (hasta 6 semanas posparto).',
        'El 20-38% de las eclampsias ocurren con cifras tensionales limítrofes (< 140/90 mmHg) sin proteinuria previa.',
        'Neuroimagen (TAC o RM): Edema vasogénico parieto-occipital bilateral simétrico (hiperseñal T2/FLAIR sin restricción en difusión).'
      ],
      anestheticEmergencySteps: [
        'Vía Aérea & Seguridad: Decúbito lateral izquierdo inmediato para evitar aspiración bronquial y mejorar retorno venoso. Aspirar secreciones, máscara con reservorio al 100% (10-15 L/min). NO sujetar con violencia.',
        'Fármaco de Elección Absoluto: SULFATO DE MAGNESIO IV en bolo de 4 a 6 g en 15-20 minutos, seguido de infusión de 1 a 2 g/h.',
        'Si la convulsión recurre: Administrar un segundo bolo de 2 g IV de MgSO₄ en 5 minutos.',
        'Evitar Benzodiacepinas de rutina (Diazepam, Midazolam): Deprimen el centro respiratorio del neonato y prolongan el coma materno (reservar solo si la convulsión no cede con 2 bolos de magnesio).',
        'Control Tensional Inmediato: Iniciar Labetalol IV 20 mg o Hidralazina IV 5 mg para mantener PAS < 150 y PAD < 100 mmHg.',
        'Resolución Obstétrica: Estabilizar hemodinámicamente a la madre ANTES de apresurar la cesárea. El feto presenta bradicardia refleja que suele recuperarse tras oxigenar a la madre.'
      ],
      warningNote: '¡PELIGRO!: La hiperventilación forzada materno-fetal produce vasoconstricción de las arterias uterinas y desvía la curva de disociación de la hemoglobina a la izquierda, asfixiando al feto. Mantener normocapnia.'
    },
    {
      id: 'hellp',
      number: 2,
      name: 'Síndrome HELLP',
      subtitle: 'Hemólisis Microangiopática, Necrosis Hepática y Trombocitopenia',
      severity: 'CRÍTICA',
      color: 'text-amber-400',
      borderColor: 'border-amber-500',
      bgLight: 'bg-amber-950/40',
      icon: Activity,
      organs: ['Endotelio Microvascular', 'Hígado', 'Médula Ósea', 'Bazo'],
      incidence: '10 - 20% de las gestantes con preeclampsia con criterios de severidad',
      mortality: '1 al 5% materna; hasta 30% morbimortalidad fetal/neonatal',
      hallmark: 'Tríada de anemia hemolítica microangiopática con esquistocitos, lesión celular periportal hepática con elevación enzimática y consumo periférico de plaquetas.',
      realImage: {
        imageSrc: '/images/blood_smear_schistocytes.svg',
        secondarySrc: '/images/doppler_ultrasound_vessels.svg',
        imageTitle: 'Frotis Sanguíneo Real con Esquistocitos (Síndrome HELLP)',
        modality: 'Frotis de Sangre Periférica (Tinción Wright 100x)',
        imageDescription: 'Presencia patognomónica de múltiples esquistocitos (hematíes fragmentados en "casco de astronauta" o "triángulos") mutilados mecánicamente por el impacto contra mallas de fibrina en microvasos endoteliales estenosados.',
        radiologicalFindings: [
          'Esquistocitos y hematíes fragmentados (helmets cells) > 2 por campo de gran aumento.',
          'Severa depleción plaquetaria sin agregados visibles (trombocitopenia de consumo).',
          'Correlación directa con LDH > 600 U/L y elevación de bilirrubina indirecta por hemólisis intravascular.'
        ]
      },
      pathophysiology: [
        'Daño endotelial microvascular sistémico que expone colágeno subendotelial y activa la cascada de agregación plaquetaria.',
        'Formación de redes de fibrina intramurales en los capilares y sinusoides hepáticos.',
        'Hemólisis mecánica por cizallamiento: Los eritrocitos son mutilados al atravesar los vasos estenosados, generando esquistocitos y liberando hemoglobina libre y LDH.',
        'Isquemia periportal hepática focal con necrosis de hepatocitos y depósitos hialinos en los sinusoides de la cápsula hepática.'
      ],
      clinicalFeatures: [
        'Dolor intenso en hipocondrio derecho o epigastrio (hasta en el 90% de los casos), de inicio brusco y continuo.',
        'Náuseas, vómitos, malestar general inespecífico similar a cuadro viral.',
        'Ictericia clínica leve-moderada (hiperbilirrubinemia indirecta por hemólisis).',
        'Tendencia a hemorragias mucosas, hematomas en sitios de punción o petequias.',
        'El 15% de las pacientes no presenta hipertensión ni proteinuria al momento del diagnóstico (HELLP normotenso).'
      ],
      diagnosticCriteria: [
        'H (Hemólisis): Frotis de sangre con esquistocitos (+), LDH > 600 U/L, Bilirrubina total ≥ 1.2 mg/dL (a expensas de indirecta), Haptoglobina < 25 mg/dL (consumo completo).',
        'EL (Enzimas Hepáticas Elevadas): AST/TGO o ALT/TGP ≥ 70 U/L (o más del doble del límite superior normal).',
        'LP (Low Platelets): Plaquetas < 100,000 /mm³.',
        'Clasificación Mississippi: Clase 1 (< 50,000 /mm³), Clase 2 (50,000 a 100,000 /mm³), Clase 3 (100,000 a 150,000 /mm³).'
      ],
      anestheticEmergencySteps: [
        'Evaluar Plaquetas en Tiempo Real: Solicitar recuento plaquetario fresco antes de entrar a quirófano; la velocidad de caída puede ser de 30,000 a 50,000 /mm³ en 6 horas.',
        'Neuroaxial vs General: Si plaquetas < 50,000 /mm³ o hay coagulopatía con fibrinógeno < 200 mg/dL: CONTRAINDICADA la anestesia neuroaxial. Realizar anestesia general con secuencia rápida.',
        'Transfusión de Plaquetas: Si se va a cesárea con < 50,000 /mm³, transfundir 1 unidad de aféresis de plaquetas (o 6-8 unidades de concentrado plaquetario estándar) inmediatamente previo a la incisión quirúrgica.',
        'Protección Renal: Medir diuresis horaria con sonda Foley estricta; el HELLP tiene alta propensión a Insuficiencia Renal Aguda por hemoglobinuria y endoteliosis.',
        'Profilaxis de Eclampsia: El sulfato de magnesio es MANDATORIO en todo síndrome HELLP hasta 24-48 horas posparto.'
      ],
      warningNote: '¡Atención Anestésica!: El nadir (punto más bajo) de plaquetas ocurre entre las 24 y 48 horas POSPARTO. Nunca retirar catéteres peridurales sin confirmar recuento plaquetario seguro (> 80,000 /mm³).'
    },
    {
      id: 'rotura_hepatica',
      number: 3,
      name: 'Hematoma Subcapsular y Rotura Hepática',
      subtitle: 'Catástrofe Hemorrágica Abdominal & Shock Hipovolémico',
      severity: 'CRÍTICA',
      color: 'text-red-500',
      borderColor: 'border-red-600',
      bgLight: 'bg-red-950/40',
      icon: Flame,
      organs: ['Hígado (Lóbulo Derecho)', 'Cápsula de Glisson', 'Cavidad Peritoneal'],
      incidence: '1 a 2% de los síndromes HELLP',
      mortality: '18 a 50% materna; hasta 60% fetal',
      hallmark: 'Hemorragia intrahepática confluente que distiende la cápsula de Glisson hasta su rotura al peritoneo con colapso cardiovascular súbito.',
      realImage: {
        imageSrc: '/images/atlas_hematoma_hepatico.svg',
        secondarySrc: '/images/doppler_ultrasound_vessels.svg',
        imageTitle: 'Hematoma Subcapsular Hepático de Glisson & Eco-FAST en Quirófano',
        modality: 'Diagrama Quirúrgico Anatómico + Ecografía Doppler Hepática / Eco-FAST',
        imageDescription: 'Colección subcapsular heterogénea a alta tensión en lóbulo hepático derecho con disrupción de la cápsula de Glisson y abundante hemoperitoneo hipoecoico en receso hepatorrenal de Morrison.',
        radiologicalFindings: [
          'Colección heterogénea subcapsular hepática > 5-10 cm de espesor.',
          'Líquido libre hemoperitoneal en espacio de Morrison y fondo de saco de Douglas.',
          'Criterio de laparotomía inmediata de control de daños (Packing hepático urgente).'
        ]
      },
      pathophysiology: [
        'Trombosis arteriolar periportal masiva con necrosis confluente del parénquima hepático (típicamente lóbulo derecho en 85%).',
        'Extravasación hemorrágica dentro del parénquima que se acumula debajo de la cápsula de Glisson formando un hematoma a tensión.',
        'La hipertensión severa, contracciones uterinas o maniobras de presión fúndica (Kristeller, PROHIBIDAS) causan la rotura capsular.',
        'Hemoperitoneo masivo fulminante con shock hipovolémico y Tríada de la Muerte (acidosis, hipotermia y coagulopatía).'
      ],
      clinicalFeatures: [
        'Dolor fulminante en hipocondrio derecho irradiado al hombro derecho (Signo de Kehr positivo por irritación del nervio frénico).',
        'Hipotensión arterial súbita no explicada, palidez mucocutánea extrema, sudoración fría y taquicardia.',
        'Distensión abdominal y signos de irritación peritoneal con matidez en flancos.',
        'Caída vertiginosa del hematocrito en cuestión de minutos.'
      ],
      diagnosticCriteria: [
        'Ecografía FAST de Urgencia en quirófano/sala de partos: Líquido libre en espacio hepatorrenal (Morrison) y hematoma subcapsular heterogéneo.',
        'TAC de Abdomen con contraste: Solo indicada si la paciente se encuentra transitoriamente hemodinámicamente estable.',
        'Si hay colapso e inestabilidad hemodinámica: Laparotomía exploradora inmediata sin retrasos diagnósticos.'
      ],
      anestheticEmergencySteps: [
        'Activación Inmediata de Código Rojo / Protocolo de Transfusión Masiva (PTM 1:1:1: Glóbulos Rojos, Plasma Fresco y Plaquetas).',
        'Ácido Tranexámico precoz: 1 g IV en 10 minutos, seguido de 1 g en infusión cada 8 horas.',
        'Canalización de 2 vías venosas periféricas de grueso calibre (14G o 16G) e instalación de línea arterial invasiva.',
        'Inducción Anestésica de Secuencia Rápida con Etomidato (0.2-0.3 mg/kg) o Ketamina (1-2 mg/kg) para preservar tono simpático y estabilidad hemodinámica.',
        'Quirófano Multidisciplinario: Notificar a Cirugía Hepatobiliar / Vascular y Radiología Intervencionista para posible embolización arterial de la arteria hepática.',
        'Táctica Quirúrgica: Empaquetamiento perihepático compresivo ("Packing" hepático con compresas) y control de daños ("Damage Control Surgery"). NO intentar suturar parénquima necrótico friable.'
      ],
      warningNote: '¡PROHIBICIÓN ESTRICTA!: NUNCA realizar compresión fúndica manual sobre el abdomen de una paciente con preeclampsia/HELLP. Puede desencadenar la rotura hepática fatal.'
    },
    {
      id: 'edema_pulmonar',
      number: 4,
      name: 'Edema Agudo de Pulmón (EAP)',
      subtitle: 'Inundación Alveolar por Desbalance de Starling & Disfunción Diastólica',
      severity: 'CRÍTICA',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500',
      bgLight: 'bg-cyan-950/40',
      icon: Droplet,
      organs: ['Membrana Alvéolo-Capilar', 'Ventrículo Izquierdo', 'Espacio Intersticial Pulmonar'],
      incidence: '3 a 5% de las preeclampsias severas; hasta 10% en el posparto inmediato',
      mortality: 'Causa directa de hasta el 30% de las muertes maternas evitables en preeclampsia',
      hallmark: 'Acumulación patológica de líquido en los espacios intersticiales y alvéolos pulmonares por fallo del drenaje linfático ante hipertensión capilar y colapso oncótico.',
      realImage: {
        imageSrc: '/images/xray_pulmonary_edema.svg',
        secondarySrc: '/images/atlas_pocus_pulmonar_eap.svg',
        imageTitle: 'Radiografía de Tórax & POCUS Pulmonar (Edema Agudo de Pulmón)',
        modality: 'Radiografía AP de Tórax Portátil + Ultrasonografía POCUS (Líneas B)',
        imageDescription: 'Opacidades alveolares algodonosas simétricas en "alas de mariposa" de distribución perihiliar bilateral, redistribución vascular hacia los vértices, cardiomegalia y líneas B de Kerley por engrosamiento de los septos interlobulillares.',
        radiologicalFindings: [
          'Patrón alveolar difuso perihiliar bilateral en alas de mariposa.',
          'Líneas B de Kerley visibles en bases pulmonares y borramiento de senos costofrénicos.',
          'Respuesta favorable inmediata a ventilación con PEEP (CPAP) y vasodilatadores venosos (Nitroglicerina).'
        ]
      },
      pathophysiology: [
        'Aumento extremo de la Presión Capilar Pulmonar (PCP) secundario al exceso de poscarga por vasoconstricción sistémica.',
        'Disfunción diastólica del ventrículo izquierdo con presiones de llenado elevadas.',
        'Colapso de la Presión Oncótica Plasmática: La pérdida renal de albúmina reduce la presión oncótica de 22 a < 14 mmHg.',
        'Aumento de la permeabilidad vascular por daño endotelial mediado por sFlt-1 y citoquinas inflamatorias.',
        'Detonante Iatrogénico: Sobrecarga hídrica indiscriminada de cristaloides (sueros) en urgencias o sala de partos.'
      ],
      clinicalFeatures: [
        'Disnea súbita de reposo con ortopnea y taquipnea marcada (> 28 rpm).',
        'Tos con expectoración asalmonada o espumosa rosada.',
        'Estertores crepitantes húmedos bilaterales que ascienden desde las bases hasta los ápices pulmonares.',
        'Desaturación arterial de oxígeno rápida (SpO₂ < 90% a aire ambiente).',
        'Uso de musculatura accesoria, aleteo nasal y tirajes intercostales.'
      ],
      diagnosticCriteria: [
        'Clínica cardinal respiratoria + Crepitantes en más del 50% de campos pulmonares.',
        'Ecografía Pulmonar POCUS al pie de la cama: Presencia de múltiples Líneas B bilaterales en cohete (> 3 líneas B por espacio intercostal) con "patrón húmedo" alveolar.',
        'Radiografía de Tórax portátil: Infiltrados perihiliares bilaterales en "alas de mariposa", cardiomegalia y líneas de Kerley B.',
        'Gasometría Arterial: Hipoxemia severa (PaO₂/FiO₂ < 200) con alcalosis respiratoria inicial que vira a acidosis mixta por fatiga diafragmática.'
      ],
      anestheticEmergencySteps: [
        'Posicionamiento Inmediato: Sentar a la paciente con el torso a 90° y piernas colgando fuera de la cama para secuestrar precarga venosa periférica.',
        'Soporte Ventilatorio No Invasivo Precoz: Iniciar CPAP (5 a 10 cmH₂O) o BiPAP con FiO₂ al 100%. El PEEP recluta alvéolos inundados y reduce el retorno venoso al ventrículo derecho.',
        'Vasodilatador Venoso de Elección: NITROGLICERINA IV en infusión continua: Iniciar a 10 mcg/min y titular en incrementos de 10 mcg/min cada 3-5 minutos. Disminuye la precarga de inmediato.',
        'Diurético de Asa: FUROSEMIDA 20 a 40 mg IV en bolo lento (2 minutos). Su efecto vasodilatador venoso precede a la diuresis.',
        'Restricción Absoluta de Líquidos: Detener cualquier infusión de mantenimiento; solo mantener vía venosa permeable con solución salina al 0.9% a goteo mínimo (< 40 mL/h).',
        'Si requiere Intubación: Alto riesgo de broncoaspiración e hipoxia letal. Preoxigenar con PEEP, atenuar reflejo hipertensivo con Labetalol/Remifentanilo y utilizar videolaringoscopio.'
      ],
      warningNote: '¡Regla de Oro!: NUNCA intentar "expandir volumen" o "probar función renal" con bolos de cristaloides en una paciente preeclámptica oligúrica. Conducirá inevitablemente a la inundación alveolar.'
    },
    {
      id: 'pres_acv',
      number: 5,
      name: 'Síndrome PRES & ACV Hemorrágico',
      subtitle: 'Encefalopatía Posterior Reversible y Rotura de Vasos Cerebrales',
      severity: 'CRÍTICA',
      color: 'text-purple-400',
      borderColor: 'border-purple-500',
      bgLight: 'bg-purple-950/40',
      icon: Eye,
      organs: ['Corteza Parieto-Occipital', 'Sustancia Blanca Subcortical', 'Polígono de Willis'],
      incidence: 'Presente en más del 80% de las pacientes que sufren eclampsia en RM',
      mortality: 'El ACV hemorrágico es la causa de muerte de más del 45% de fallecimientos maternos',
      hallmark: 'Síndrome clínico-radiológico de edema vasogénico cerebral parieto-occipital con cefalea, ceguera y convulsiones que puede culminar en hematoma intraparenquimatoso.',
      realImage: {
        imageSrc: '/images/mri_pres_brain_flair.svg',
        secondarySrc: '/images/mri_pres_coronal.svg',
        imageTitle: 'Resonancia Magnética (Síndrome PRES & Ruptura de BHE)',
        modality: 'RM Axial y Coronal FLAIR en Preeclampsia Severa',
        imageDescription: 'Colapso de la autorregulación cerebral por crisis hipertensiva (PAS > 160 mmHg): hiperintensidad subcortical occipito-parietal bilateral característica de edema vasogénico cerebral reversible con alto riesgo de sangrado si no se titula la presión.',
        radiologicalFindings: [
          'Predilección marcada por la circulación vertebrobasilar cerebral posterior.',
          'Ausencia de infarto citotóxico establecido (reversibilidad completa del edema vasogénico).',
          'Riesgo crítico de hematoma intraparenquimatoso si la PAS se mantiene > 160 mmHg de forma sostenida.'
        ]
      },
      pathophysiology: [
        'La circulación cerebral posterior (territorio vértebro-basilar) tiene menor inervación simpática perivascular protectora que la circulación anterior.',
        'Presiones sistólicas > 160 mmHg superan la resistencia arteriolar, causando hiperperfusión forzada con rotura de la barrera hematoencefálica.',
        'Fuga de líquido, macromoléculas y eritrocitos al espacio intersticial cerebral (edema vasogénico).',
        'Si la presión transmural no se reduce de urgencia, se produce rotura arterial con hemorragia cerebral masiva (típicamente en ganglios basales o sustancia blanca lobar).'
      ],
      clinicalFeatures: [
        'Cefalea intensa refractaria, frecuentemente occipital o frontoparietal.',
        'Trastornos visuales graves: visión borrosa, escotomas centellantes, defectos campimétricos, amaurosis cortical (ceguera con reflejo fotomotor conservado).',
        'Alteración del estado de conciencia: letargia, confusión mental, estupor o coma.',
        'Déficit neurológico focal (hemiparesia, asimetría facial, disartria) si sobreviene hemorragia cerebral.'
      ],
      diagnosticCriteria: [
        'Resonancia Magnética Cerebral (Estándar de Oro): Hiperseñal en secuencias T2 y FLAIR que predomina en las regiones parieto-occipitales, con difusión normal (ADC elevado que confirma edema vasogénico reversible y no isquemia citotóxica).',
        'TAC Cerebral Simple: Útil en la urgencia para descartar de forma rápida hemorragia intracerebral aguda o hematoma lobar.',
        'Fondo de Ojo: Edema de papila, exudados retinianos o espasmo arteriolar segmentario.'
      ],
      anestheticEmergencySteps: [
        'Control Tensional Ultra-Rápido: Reducir la PAS por debajo de 150 mmHg en menos de 15 a 30 minutos con Labetalol o Nicardipino IV. ¡Cada minuto de PAS > 160 aumenta exponencialmente el riesgo de ACV!',
        'Evitar Hipotensión Excesiva: No descender la PAM más de un 20-25% bruscamente para no provocar isquemia cerebral o hipoperfusión placentaria.',
        'Sulfato de Magnesio: Es neuroprotector de primer orden; estabiliza la barrera hematoencefálica y previene las convulsiones.',
        'Manejo de Intubación Quirúrgica: Si requiere anestesia general, atenuar con máxima agresividad el reflejo simpático a la laringoscopia (Labetalol + Lidocaína + Remifentanilo) para evitar picos tensionales letales de PAS > 220 mmHg.',
        'Interconsulta Urgente con Neurocirugía / Neurología Vascular ante cualquier focalización motora.'
      ],
      warningNote: '¡Atención Diagnóstica!: La pérdida visual en PRES es cortical (área visual occipital edema) y casi siempre revierte al 100% tras el control tensional y el tratamiento con sulfato de magnesio.'
    },
    {
      id: 'dppni',
      number: 6,
      name: 'Desprendimiento Prematuro de Placenta (DPPNI)',
      subtitle: 'Compromiso Fetal Agudo & Coagulación Intravascular Diseminada (CID)',
      severity: 'CRÍTICA',
      color: 'text-rose-600',
      borderColor: 'border-rose-700',
      bgLight: 'bg-rose-950/40',
      icon: ShieldAlert,
      organs: ['Placenta', 'Decidua Basal', 'Miometrio (Útero de Couvelaire)'],
      incidence: '3 a 5 veces más frecuente en preeclampsia severa que en gestaciones normales',
      mortality: 'Mortalidad perinatal de 20 a 35%; riesgo materno de hemorragia masiva y shock',
      hallmark: 'Separación total o parcial de la placenta de su inserción decidual antes del expulsivo fetal por hemorragia en la interfase deciduo-placentaria.',
      realImage: {
        imageSrc: '/images/placenta_specimen.svg',
        secondarySrc: '/images/placenta_specimen.jpg',
        imageTitle: 'Espécimen Quirúrgico Real: Placenta con DPPNI y Hematoma',
        modality: 'Fotografía Anatomopatológica de Pieza Quirúrgica + Macroscopía',
        imageDescription: 'Cara materna de la placenta que evidencia una marcada depresión excavada ocupada por un extenso hematoma retroplacentario organizado de sangre oscura, con cotiledones circundantes pálidos e infartados.',
        radiologicalFindings: [
          'Hematoma retroplacentario organizado con compresión del parénquima vellositario.',
          'Necrosis isquémica extensa de cotiledones por vasoespasmo decidual agudo.',
          'Fibrinolisis masiva local con liberación de factor tisular hacia la circulación materna (CID).'
        ]
      },
      pathophysiology: [
        'Vasoespasmo extremo y necrosis isquémica de las arterias espirales anormales en la decidua basal.',
        'Rotura de los vasos deciduales con formación de un hematoma retroplacentario a alta presión.',
        'El hematoma desprende la placenta de forma centrífuga, asfixiando al feto por interrupción del intercambio gaseoso.',
        'Liberación masiva de tromboplastina tisular decidual a la circulación materna, que activa la cascada de coagulación y desata Coagulación Intravascular Diseminada (CID).',
        'Extravasación de sangre hacia el miometrio y bajo la serosa uterina ("Útero de Couvelaire"), impidiendo la contractilidad posparto con atonía masiva.'
      ],
      clinicalFeatures: [
        'Dolor abdominal súbito, lancinante y constante en hipogastrio o dorso.',
        'Hipertonía uterina con polisistolia o "útero de consistencia leñosa" (en madera), incapaz de relajarse a la palpación.',
        'Metrorragia oscura (puede faltar en el 20% de los casos si el hematoma queda oculto y retenido).',
        'Monitoreo fetal: Bradicardia fetal sostenida (< 100 lpm), desaceleraciones tardías profundas y pérdida de la variabilidad.',
        'Signos de shock hipovolémico materno desproporcionados al sangrado visible externo.'
      ],
      diagnosticCriteria: [
        'Diagnóstico eminentemente CLÍNICO: Hipertonía uterina dolorosa + Sangrado oscuro + Compromiso fetal agudo.',
        'La ecografía tiene baja sensibilidad (solo detecta el hematoma en el 25-50% de los casos). ¡NUNCA esperar una ecografía para decidir la cesárea si la clínica es evidente!',
        'Laboratorio: Caída rápida de fibrinógeno (< 200 mg/dL), prolongación de TP/TTP, trombocitopenia y elevación de dímero D.'
      ],
      anestheticEmergencySteps: [
        'Emergencia Quirúrgica Extrema (Cesárea "Crash"): Incisión en menos de 10-15 minutos desde la decisión.',
        'Técnica Anestésica: Anestesia General con Secuencia Rápida por compromiso fetal y alto riesgo de coagulopatía de consumo.',
        'Preparación Masiva de Hemoderivados: Solicitar Glóbulos Rojos concentrados, Plasma Fresco Congelado, Plaquetas y Crioprecipitados (o Fibrinógeno concentrado si está disponible).',
        'Meta de Fibrinógeno: Mantener fibrinógeno por encima de 200-250 mg/dL mediante la infusión de Crioprecipitados (1 U por cada 10 kg eleva ~50 mg/dL) o Concentrado de Fibrinógeno (2 a 4 g IV).',
        'Prevención de Atonía Uterina: Iniciar Oxitocina en infusión, Ácido Tranexámico 1 g IV precoz, Carbetocina o derivados de prostaglandinas (Misoprostol 800 mcg rectal; evitar Metilergonovina por vasoconstricción sistémica).'
      ],
      warningNote: '¡Contraindicación Absoluta!: La Metilergonovina (Methergin) está TOTALMENTE PROHIBIDA en preeclampsia por riesgo de causar crisis hipertensiva extrema, infarto de miocardio o rotura aórtica.'
    },
    {
      id: 'ira',
      number: 7,
      name: 'Insuficiencia Renal Aguda (IRA)',
      subtitle: 'Endoteliosis Severa, Necrosis Tubular Aguda y Anuria',
      severity: 'ALTA',
      color: 'text-indigo-400',
      borderColor: 'border-indigo-500',
      bgLight: 'bg-indigo-950/40',
      icon: Layers,
      organs: ['Glomérulos Renales', 'Túbulos Contorneados', 'Arteriolas Aferentes'],
      incidence: '2 a 4% de las preeclampsias severas; hasta 10-15% si coexiste con HELLP o DPPNI',
      mortality: 'Aumenta significativamente el riesgo de diálisis materna y morbilidad crónica',
      hallmark: 'Deterioro rápido de la Tasa de Filtración Glomerular con oliguria persistente (< 30 mL/h por más de 2 horas consecutivas) y elevación de azoados.',
      realImage: {
        imageSrc: '/images/kidney_glomerulus_podocytes.svg',
        secondarySrc: '/images/blood_smear_schistocytes.svg',
        imageTitle: 'Microscopía Renal Real: Endoteliosis Glomerular y Podocitopatía',
        modality: 'Microscopía Electrónica & Óptica de Alta Resolución',
        imageDescription: 'Marcada tumefacción reactiva de las células endoteliales ("endoteliosis capilar glomerular") que colapsa la luz vascular de los penachos capilares, junto a borramiento masivo de pedicelos podocitarios, explicando la proteinuria de rango nefrótico y la insuficiencia renal anúrica.',
        radiologicalFindings: [
          'Endoteliosis difusa con oclusión luminal por edema celular mediado por niveles récord de sFlt-1.',
          'Pérdida de la barrera de filtración podocitaria con desprendimiento celular hacia la orina.',
          'Riesgo crítico de toxicidad letal por Sulfato de Magnesio si no se suspende la infusión de mantenimiento ante anuria.'
        ]
      },
      pathophysiology: [
        'Endoteliosis glomerular severa: Tumefacción endotelial que ocluye la luz de los capilares glomerulares y borramiento de podocitos.',
        'Espasmo intenso de la arteriola aferente renal por hiperactividad adrenérgica y desbalance tromboxano/prostaciclina.',
        'Isquemia medular renal secundaria que evoluciona a Necrosis Tubular Aguda (NTA) si hay hipovolemia o sangrado quirúrgico.',
        'La microangiopatía trombótica en HELLP puede provocar necrosis cortical renal bilateral irreversible.'
      ],
      clinicalFeatures: [
        'Oliguria severa (< 0.5 mL/kg/h o < 30 mL/h) resistente a la corrección suave de volumen.',
        'Edema generalizado progresivo (anasarca) por retención hidrosalina severa.',
        'Aparición de signos de sobrecarga de volumen: ingurgitación yugular, hipertensión refractaria y edema pulmonar.',
        'Orinas colúricas o concentradas (o hemáticas si hay hemoglobinuria por hemólisis).'
      ],
      diagnosticCriteria: [
        'Creatinina sérica > 1.1 mg/dL en ausencia de enfermedad renal previa (o duplicación del valor basal).',
        'Oliguria documentada por sonda vesical durante más de 2 horas consecutivas a pesar de optimización hemodinámica.',
        'Elevación del Ácido Úrico sérico (> 7.0 - 8.0 mg/dL) y nitrógeno ureico.',
        'Sedimento urinario: Cilindros granulosos pardos típicos de necrosis tubular aguda.'
      ],
      anestheticEmergencySteps: [
        '¡PELIGRO MORTAL CON SULFATO DE MAGNESIO!: Como el magnesio se excreta al 100% por el riñón, en anuria se acumula velozmente hasta niveles letales (> 12-15 mEq/L). Suspender inmediatamente la infusión de mantenimiento y monitorizar reflejo rotuliano y frecuencia respiratoria cada 30 minutos.',
        'Dosificación Ajustada de Fármacos: Evitar AINEs (Ketorolaco, Diclofenaco) para analgesia posoperatoria; agravan la isquemia renal por inhibición de prostaglandinas renales.',
        'Manejo de Líquidos: Balance hídrico horario milimétrico. NO administrar diuréticos de forma ciega si no hay sobrecarga de volumen demostrada (EAP). Reemplazar diuresis horaria + 30 mL/h de pérdidas insensibles.',
        'Criterios de Terapia de Reemplazo Renal (Hemodiálisis): Sobrecarga hídrica refractaria con EAP, hiperpotasemia severa (> 6.5 mEq/L) refractaria, o acidosis metabólica severa refractaria.'
      ],
      warningNote: '¡Perla Clínica!: En la paciente oligúrica con preeclampsia, el gasto urinario NO refleja el volumen intravascular. Más del 90% de las oligurias son por vasoespasmo glomerular y NO por deshidratación. ¡No encharcar a la paciente!'
    }
  ];

  const currentComp = complications.find(c => c.id === selectedCompId) || complications[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* HEADER DEL ATLAS */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              ATLAS VISUAL INTERACTIVO DE COMPLICACIONES CRÍTICAS
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Complicaciones de la Preeclampsia
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Fisiopatología celular, hallazgos clínicos, criterios diagnósticos y conducta anestésica de emergencia
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              7 Cuadros Clínicos Catastróficos
            </span>
          </div>
        </div>

        {/* SELECTOR INTERACTIVO DE COMPLICACIONES CON PESTAÑAS VISUALES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
          {complications.map((comp) => {
            const IconComp = comp.icon;
            const isSelected = selectedCompId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedCompId(comp.id)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? `${comp.bgLight} ${comp.borderColor} shadow-lg ring-2 ring-rose-400/30 scale-[1.02]`
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {comp.number}
                  </span>
                  <IconComp className={`w-4 h-4 ${isSelected ? comp.color : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {comp.name}
                  </p>
                  <p className="text-[9.5px] text-slate-400 font-mono truncate">
                    {comp.severity}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DETALLE COMPLETO DE LA COMPLICACIÓN SELECCIONADA */}
      <div className={`p-5 sm:p-6 rounded-3xl border ${currentComp.borderColor} bg-slate-950/90 space-y-6 shadow-xl`}>
        {/* Cabecera de la complicación */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-start gap-3">
            <span className={`p-3 rounded-2xl ${currentComp.bgLight} border ${currentComp.borderColor} shrink-0`}>
              <currentComp.icon className={`w-7 h-7 ${currentComp.color}`} />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-800 text-white font-mono">
                  CASO #{currentComp.number}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentComp.severity === 'CRÍTICA' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  SEVERIDAD {currentComp.severity}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Incidencia: {currentComp.incidence}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {currentComp.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {currentComp.subtitle}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Tasa de Mortalidad Reportada</span>
            <span className={`text-xs sm:text-sm font-black ${currentComp.color}`}>
              {currentComp.mortality}
            </span>
          </div>
        </div>

        {/* DEFINICIÓN CARDINAL / HALLMARK */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3">
          <Info className={`w-5 h-5 ${currentComp.color} shrink-0 mt-0.5`} />
          <div>
            <strong className="text-white block mb-0.5">Hallazgo Clínico Patognomónico / Definitorio:</strong>
            <p className="text-slate-300">{currentComp.hallmark}</p>
          </div>
        </div>

        {/* PANEL DE IMAGEN CLÍNICA REAL Y CORRELACIÓN RADIOLÓGICA/HISTOLÓGICA */}
        {currentComp.realImage && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-slate-700/80 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    {currentComp.realImage.imageTitle}
                  </h4>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Modalidad: {currentComp.realImage.modality}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/60 px-2.5 py-1 rounded-full self-start sm:self-auto">
                📸 Caso Clínico Obstétrico Real
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-2.5">
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black group shadow-lg">
                  <img
                    src={currentComp.realImage.imageSrc}
                    alt={currentComp.realImage.imageTitle}
                    className="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-center">
                    <span className="text-[10px] font-bold text-white block">
                      Imagen Principal • {currentComp.realImage.modality}
                    </span>
                  </div>
                </div>

                {currentComp.realImage.secondarySrc && (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black group shadow-lg">
                    <img
                      src={currentComp.realImage.secondarySrc}
                      alt="Corte complementario"
                      className="w-full h-32 sm:h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-1.5 text-center">
                      <span className="text-[9.5px] font-bold text-slate-200 block">
                        Corte / Secuencia Complementaria
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-7 space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <strong className="text-xs font-bold text-rose-300 block">
                    Interpretación Diagnóstica &amp; Correlación Clínica:
                  </strong>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentComp.realImage.imageDescription}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <strong className="text-xs font-bold text-cyan-300 block">
                    Hallazgos Clave a Identificar:
                  </strong>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentComp.realImage.radiologicalFindings.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0">✓</span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 1: FISIOPATOLOGÍA Y CLÍNICA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Fisiopatología celular */}
          <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-400" />
              Cascada Fisiopatológica Celular
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentComp.pathophysiology.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuadro clínico */}
          <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-amber-400" />
              Signos y Síntomas de Alarma Inminente
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentComp.clinicalFeatures.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SECCIÓN 2: CRITERIOS DIAGNÓSTICOS */}
        <div className="p-4 bg-slate-900/70 rounded-2xl border border-slate-800 space-y-2.5">
          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            Criterios Diagnósticos de Laboratorio y Gabinete (ACOG / FIGO)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300 pt-1">
            {currentComp.diagnosticCriteria.map((crit, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">•</span>
                <span className="leading-relaxed">{crit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: PROTOCOLO ANESTÉSICO Y MANEJO EN QUIRÓFANO */}
        <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border-2 border-emerald-500/40 space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              Protocolo de Manejo Anestésico Inmediato en Quirófano (Paso a Paso)
            </h4>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
              Prioridad Cero
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {currentComp.anestheticEmergencySteps.map((step, idx) => {
              const [title, ...rest] = step.split(':');
              return (
                <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-slate-200">
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-black text-[11px] shrink-0 font-mono">
                    {idx + 1}
                  </span>
                  <div className="leading-relaxed">
                    {rest.length > 0 ? (
                      <>
                        <strong className="text-white font-bold">{title}:</strong>
                        <span className="text-slate-300">{rest.join(':')}</span>
                      </>
                    ) : (
                      <span>{step}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning box */}
          <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-900/60 text-xs text-rose-200 flex items-start gap-2 mt-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-semibold">
              {currentComp.warningNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface DrugInfo {
  id: string;
  name: string;
  category: 'Hipnótico' | 'Opioide' | 'Relajante Neuromuscular' | 'Anestésico Local' | 'Reversor' | 'Vasopresor / Inótropo' | 'Antiemético / Coadyuvante';
  inductionDose: string;
  maintenanceDose: string;
  pedsDose: string;
  onset: string;
  duration: string;
  elimination: string;
  contraindications: string;
  clinicalPearls: string;
}

export const VADEMECUM_DRUGS: DrugInfo[] = [
  {
    id: 'propofol',
    name: 'Propofol (Diprivan 1%)',
    category: 'Hipnótico',
    inductionDose: '1.5 - 2.5 mg/kg IV',
    maintenanceDose: '100 - 200 mcg/kg/min (TIVA) o 4 - 12 mg/kg/h',
    pedsDose: '2.5 - 3.5 mg/kg IV',
    onset: '30 - 40 segundos',
    duration: '5 - 10 minutos',
    elimination: 'Hepática rápida (glucuronidación) y aclaramiento pulmonar',
    contraindications: 'Alergia a proteína del huevo/soja (precaución), hipotensión severa, shock cardiogénico.',
    clinicalPearls: 'Produce vasodilatación arterial/venosa y depresión miocárdica. Efecto antiemético dosis-dependiente (10-20 mg IV).'
  },
  {
    id: 'fentanyl',
    name: 'Fentanilo',
    category: 'Opioide',
    inductionDose: '2 - 5 mcg/kg IV (Intubación)',
    maintenanceDose: '1 - 3 mcg/kg/h o bolos de 25-50 mcg',
    pedsDose: '1 - 2 mcg/kg IV',
    onset: '1 - 2 minutos',
    duration: '30 - 60 minutos',
    elimination: 'Metabolización hepática por CYP3A4 a norfentanilo inactivo',
    contraindications: 'Depresión respiratoria severa sin soporte de vía aérea, hipersensibilidad a opioides.',
    clinicalPearls: 'Potencia 100 veces superior a morfina. Puede inducir tórax rígido si se administra en bolo rápido de alta dosis.'
  },
  {
    id: 'remifentanil',
    name: 'Remifentanilo',
    category: 'Opioide',
    inductionDose: '0.5 - 1 mcg/kg IV en 60 segundos',
    maintenanceDose: '0.1 - 0.5 mcg/kg/min en infusión continua',
    pedsDose: '0.25 - 0.5 mcg/kg/min',
    onset: '1 - 1.5 minutos',
    duration: '3 - 5 minutos (vida media independiente de la duración)',
    elimination: 'Hidrólisis rápida por esterasas plasmáticas no específicas y tisulares',
    contraindications: 'Vía neuraxial (contiene glicina). Depresión respiratoria sin ventilación.',
    clinicalPearls: 'Metabolismo ultrarrápido sin acumulación. Requiere planificación de analgesia postoperatoria preventiva antes de cortar la infusión.'
  },
  {
    id: 'rocuronium',
    name: 'Rocuronio (Esmeron)',
    category: 'Relajante Neuromuscular',
    inductionDose: '0.6 mg/kg (Secuencia rápida: 1.0 - 1.2 mg/kg)',
    maintenanceDose: '0.15 mg/kg en bolo o 0.3-0.6 mg/kg/h',
    pedsDose: '0.6 mg/kg IV',
    onset: '60 - 90 segundos (60 seg a dosis de 1.2 mg/kg)',
    duration: '30 - 40 minutos (intermedio)',
    elimination: 'Hepática (70%) y excreción biliar/renal',
    contraindications: 'Hipersensibilidad a aminosteroides.',
    clinicalPearls: 'De elección en Secuencia de Inducción Rápida cuando la succinilcolina está contraindicada. Reversión inmediata con Sugammadex.'
  },
  {
    id: 'succinylcholine',
    name: 'Succinilcolina (Anectine)',
    category: 'Relajante Neuromuscular',
    inductionDose: '1.0 - 1.5 mg/kg IV',
    maintenanceDose: 'No recomendada en infusión continua por riesgo de bloqueo Fase II',
    pedsDose: '2.0 mg/kg IV (4.0 mg/kg IM en caso de laringoespasmo grave sin vía IV)',
    onset: '30 - 60 segundos',
    duration: '5 - 10 minutos',
    elimination: 'Hidrólisis por pseudocolinesterasa plasmática (butirilcolinesterasa)',
    contraindications: 'Hipertermia maligna (antecedentes), quemaduras &gt; 24h, denervación motora, hiperpotasemia, miopatías.',
    clinicalPearls: 'Único bloqueador despolarizante. Produce fasciculaciones e hiperpotasemia transitoria (+0.5 mEq/L).'
  },
  {
    id: 'sugammadex',
    name: 'Sugammadex (Bridion)',
    category: 'Reversor',
    inductionDose: '2 mg/kg (TOF 2), 4 mg/kg (Bloqueo profundo 1-2 PTC), 16 mg/kg (Reversión inmediata 3 min pos 1.2mg/kg rocuronio)',
    maintenanceDose: 'Dosis única según grado de bloqueo neuromuscular',
    pedsDose: '2 - 4 mg/kg IV (aprobado &gt; 2 años)',
    onset: '1.5 - 3 minutos',
    duration: 'Permanente (complejo ciclodextrina estable)',
    elimination: 'Excreción renal sin cambios (95%)',
    contraindications: 'Insuficiencia renal severa (ClCr &lt; 30 mL/min - precaución).',
    clinicalPearls: 'Encapsula específicamente rocuronio y vecuronio. Inactiva anticonceptivos orales hormonales por 7 días.'
  },
  {
    id: 'lidocaine',
    name: 'Lidocaína 1% - 2%',
    category: 'Anestésico Local',
    inductionDose: '1 - 1.5 mg/kg IV (Atenuación respuesta simpática intubación o analgesia IV)',
    maintenanceDose: '1.5 - 2.0 mg/kg/h (Infusión analgésica multimodal)',
    pedsDose: '1 mg/kg IV',
    onset: '1 - 3 minutos IV / 5-10 min infiltración',
    duration: '60 - 120 minutos (hasta 240 min con Epinefrina)',
    elimination: 'Hepática por citocromo P450 (monoetilglicinexilidida)',
    contraindications: 'Bloqueo AV completo, alergia a anestésicos tipo amida.',
    clinicalPearls: 'Dosis máxima sin epinefrina: 4.5 mg/kg. Dosis máxima con epinefrina: 7 mg/kg. Tratamiento de arritmias ventriculares.'
  },
  {
    id: 'bupivacaine',
    name: 'Bupivacaína 0.5% (Marcaina / Bupi)',
    category: 'Anestésico Local',
    inductionDose: 'Infiltración / Bloqueo neuraxial (Espinal: 7.5-15 mg, Epidural: 50-100 mg)',
    maintenanceDose: 'Infusión epidural: 0.1-0.25% a 6-12 mL/h',
    pedsDose: '0.3 - 0.5 mL/kg de solución 0.25%',
    onset: '10 - 20 minutos',
    duration: '3 - 6 horas',
    elimination: 'Hepática por CYP3A4',
    contraindications: 'Uso IV directo (altamente cardiotóxico), infección en el sitio de punción espinal.',
    clinicalPearls: 'Dosis máxima: 2 mg/kg. Alta cardiotoxicidad por bloqueo lento de canales de sodio cardíacos (rescate con Lipofundin 20%).'
  },
  {
    id: 'norepinephrine',
    name: 'Noradrenalina / Norepinefrina',
    category: 'Vasopresor / Inótropo',
    inductionDose: 'Bolos de rescate: 4 - 8 mcg IV',
    maintenanceDose: '0.01 - 0.5 mcg/kg/min en infusión continua',
    pedsDose: '0.05 - 0.2 mcg/kg/min',
    onset: '1 - 2 minutos',
    duration: '1 - 2 minutos tras suspender',
    elimination: 'Metabolización por MAO y COMT en hígado y tejidos',
    contraindications: 'Hipovolemia no corregida (relativo salvo emergencia).',
    clinicalPearls: 'Agonista Alfa-1 potente con moderado efecto Beta-1. Vasopresor de primera línea en hipotensión vasodilatada y sepsis.'
  },
  {
    id: 'ondansetron',
    name: 'Ondansetrón (Zofran)',
    category: 'Antiemético / Coadyuvante',
    inductionDose: '4 - 8 mg IV al final de la cirugía o inductivo',
    maintenanceDose: '4 mg IV c/8 horas si requiere',
    pedsDose: '0.1 mg/kg IV (máx 4 mg)',
    onset: '15 - 30 minutos',
    duration: '8 - 12 horas',
    elimination: 'Metabolización hepática extensa por CYP3A4, CYP2D6',
    contraindications: 'Síndrome de QT largo congénito (precaución).',
    clinicalPearls: 'Antagonista 5-HT3 selectivo. Efecto sinérgico potente al combinarlo con Dexametasona 4-8 mg IV.'
  }
];

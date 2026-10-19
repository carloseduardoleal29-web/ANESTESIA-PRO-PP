import React, { useState } from 'react';
import { Target, Search, Info, ShieldCheck, AlertTriangle, Layers, BookOpen, Compass } from 'lucide-react';

interface BlockInfo {
  id: string;
  name: string;
  zone: 'upper' | 'trunk' | 'lower';
  indications: string;
  transducer: string;
  needle: string;
  landmarks: string;
  localAnesthetic: string;
  volumeRange: string;
  safetyPearls: string;
}

const REGIONAL_BLOCKS: BlockInfo[] = [
  {
    id: 'interescalenico',
    name: 'Bloqueo Interescalénico del Plexo Braquial',
    zone: 'upper',
    indications: 'Cirugía de hombro (artroscopia, prótesis), tercio lateral de clavícula, húmero proximal.',
    transducer: 'Lineal de alta frecuencia (10 - 15 MHz).',
    needle: 'Aguja ecogénica de 50 mm (22G). En plano de lateral a medial.',
    landmarks: 'Músculo escaleno anterior y medio a nivel de C6 (signo del "semáforo" de las raíces C5, C6, C7).',
    localAnesthetic: 'Ropivacaína 0.2% - 0.375% o Bupivacaína 0.25% - 0.375%.',
    volumeRange: '8 - 15 ml (evitar grandes volúmenes para reducir paresia frénica).',
    safetyPearls: 'Bloqueo del nervio frénico ipsilateral en casi el 100% (contraindicado en insuficiencia respiratoria severa contralateral).'
  },
  {
    id: 'supraclavicular',
    name: 'Bloqueo Supraclavicular ("La Raquídea del Brazo")',
    zone: 'upper',
    indications: 'Cirugía de brazo medio-distal, codo, antebrazo y mano. Analgesia completa.',
    transducer: 'Lineal de alta frecuencia.',
    needle: '50 mm en plano de lateral a medial hacia la "esquina de bolsillo" (corner pocket).',
    landmarks: 'Arteria subclavia pulsátil sobre la primera costilla hiperecoica. Plexo braquial en "racimo de uvas" posterolateral.',
    localAnesthetic: 'Bupivacaína 0.25% o Levobupivacaína 0.375% + Lidocaína 1%.',
    volumeRange: '20 - 30 ml.',
    safetyPearls: 'Identificar siempre la pleura y la primera costilla para evitar neumotórax inadvertido.'
  },
  {
    id: 'axilar',
    name: 'Bloqueo Axilar del Plexo Braquial',
    zone: 'upper',
    indications: 'Cirugía de antebrazo, muñeca y mano. Fístulas arteriovenosas para hemodiálisis.',
    transducer: 'Lineal de alta frecuencia colocado transversal en el pliegue axilar.',
    needle: '50 mm en plano o fuera de plano.',
    landmarks: 'Arteria axilar rodeada por los nervios mediano (anterior), ulnar (medial) y radial (posterior). Nervio musculocutáneo dentro del coracobraquial.',
    localAnesthetic: 'Lidocaína 1.5% o Mepivacaína 1.5% con Ropivacaína 0.375%.',
    volumeRange: '20 - 25 ml (5-7 ml por cada nervio + 5 ml musculocutáneo).',
    safetyPearls: 'No olvidar infiltrar el músculo coracobraquial para anestesiar el nervio musculocutáneo.'
  },
  {
    id: 'tap_block',
    name: 'Bloqueo del Plano Transverso del Abdomen (TAP)',
    zone: 'trunk',
    indications: 'Analgesia somática de pared abdominal: cesáreas, laparotomías, colecistectomía, hernia inguinal.',
    transducer: 'Lineal de alta frecuencia en fosa lumbar (entre cresta ilíaca y reborde costal).',
    needle: '80 - 100 mm en plano anteroposterior.',
    landmarks: 'Las 3 capas musculares: Oblicuo externo, oblicuo interno y transverso del abdomen. Depósito entre oblicuo interno y transverso.',
    localAnesthetic: 'Bupivacaína 0.25% o Ropivacaína 0.2%.',
    volumeRange: '15 - 20 ml por lado (bilateral máx 40 ml respetando dosis tóxica).',
    safetyPearls: 'Solo proporciona analgesia somática de la pared abdominal; no alivia el dolor visceral.'
  },
  {
    id: 'esp_block',
    name: 'Bloqueo del Plano del Erector de la Espina (ESP Block)',
    zone: 'trunk',
    indications: 'Toracotomías, fracturas costales múltiples, cirugía de mama, nefrectomía, cirugía de columna.',
    transducer: 'Lineal parasagital a 2-3 cm de la línea media espinosa (nivel T4-T5 para tórax, T8-T9 para abdomen).',
    needle: '80 mm de cefálico a caudal hasta hacer contacto óseo con la apófisis transversa.',
    landmarks: 'Músculo erector de la espina apoyado sobre la apófisis transversa redondeada e hiperecoica.',
    localAnesthetic: 'Ropivacaína 0.2% - 0.375% o Levobupivacaína 0.25%.',
    volumeRange: '20 - 30 ml por lado.',
    safetyPearls: 'Técnica interfacial muy segura debido a que la apófisis transversa actúa como escudo anatómico protector de la pleura.'
  },
  {
    id: 'canal_aductor',
    name: 'Bloqueo del Canal Aductor (Nervio Safeno)',
    zone: 'lower',
    indications: 'Artroplastia total de rodilla, cirugía de ligamento cruzado anterior, analgesia sin bloqueo motor del cuádriceps.',
    transducer: 'Lineal en tercio medio del muslo anteromedial.',
    needle: '50 - 80 mm en plano de lateral a medial.',
    landmarks: 'Músculo sartorio formando el techo del canal. Arteria femoral superficial profunda al sartorio con el nervio safeno anterolateral.',
    localAnesthetic: 'Ropivacaína 0.2% con adyuvante (Dexametasona 4 mg).',
    volumeRange: '10 - 15 ml.',
    safetyPearls: 'Preserva la fuerza del cuádriceps permitiendo la deambulación temprana en el protocolo ERAS de prótesis de rodilla.'
  },
  {
    id: 'peng_block',
    name: 'Bloqueo PENG (Pericapsular Nerve Group)',
    zone: 'lower',
    indications: 'Fractura de cadera en ancianos, artroplastia total de cadera, reducción cerrada de luxación de cadera.',
    transducer: 'Convexo o lineal curvilíneo oblicuo sobre la eminencia iliopúbica.',
    needle: '80 - 100 mm de lateral a medial hacia la eminencia iliopúbica profundo al tendón del psoas.',
    landmarks: 'Eminencia iliopúbica, tendón del psoas mayor, espina ilíaca anteroinferior (EIAI).',
    localAnesthetic: 'Levobupivacaína 0.25% o Ropivacaína 0.375%.',
    volumeRange: '15 - 20 ml.',
    safetyPearls: 'Bloquea ramas sensitivas articulares del nervio femoral y accesorio del obturador sin producir debilidad motora del cuádriceps.'
  },
  {
    id: 'ciatico_popliteo',
    name: 'Bloqueo Ciático Poplíteo (Fosa Poplítea)',
    zone: 'lower',
    indications: 'Cirugía de tobillo, pie y tendón de Aquiles, amputación infracondílea.',
    transducer: 'Lineal colocado transversal 5-7 cm por encima del pliegue poplíteo.',
    needle: '50 - 80 mm en plano de lateral a medial.',
    landmarks: 'Bifurcación del nervio ciático en nervio tibial (medial) y peroneo común (lateral) sobre los vasos poplíteos.',
    localAnesthetic: 'Ropivacaína 0.375% o Bupivacaína 0.375%.',
    volumeRange: '15 - 20 ml en la vaina común de Vloka.',
    safetyPearls: 'Infiltrar dentro de la vaina común antes de la bifurcación para garantizar bloqueo uniforme de ambos componentes.'
  }
];

export function RegionalAtlas() {
  const [selectedZone, setSelectedZone] = useState<'all' | 'upper' | 'trunk' | 'lower'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlocks = REGIONAL_BLOCKS.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.indications.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.landmarks.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'all' || b.zone === selectedZone;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Atlas de Anestesia Regional Ecoguiada & Bloqueos
          </h2>
          <p className="text-xs text-slate-400">
            Guía anatómica de bloqueos periféricos e interfaciales con referencias ecográficas, agujas y volúmenes seguros.
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por técnica o indicación..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Selector de Regiones */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedZone('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedZone === 'all'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Todos los Bloqueos ({REGIONAL_BLOCKS.length})
        </button>
        <button
          onClick={() => setSelectedZone('upper')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedZone === 'upper'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Miembro Superior
        </button>
        <button
          onClick={() => setSelectedZone('trunk')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedZone === 'trunk'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Pared Toraco-Abdominal
        </button>
        <button
          onClick={() => setSelectedZone('lower')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedZone === 'lower'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Miembro Inferior & Cadera
        </button>
      </div>

      {/* Grid de Bloqueos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBlocks.map(b => (
          <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase">
                  {b.zone === 'upper' ? 'Miembro Superior' : b.zone === 'trunk' ? 'Pared Torácica / Abdomen' : 'Miembro Inferior'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{b.name}</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 text-cyan-300 font-bold border border-slate-800">
                {b.volumeRange}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-slate-400">Indicaciones:</strong> {b.indications}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block font-medium">Sonda Ecográfica</span>
                <span className="text-slate-200">{b.transducer}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Aguja Recomendada</span>
                <span className="text-slate-200">{b.needle}</span>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-slate-300">
                <strong className="text-cyan-400">Sonoanatomía:</strong> {b.landmarks}
              </p>
              <p className="text-slate-300">
                <strong className="text-amber-400">Anestésico Local Típico:</strong> {b.localAnesthetic}
              </p>
            </div>

            <div className="p-3 bg-cyan-950/20 rounded-xl border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Perla de Seguridad:</strong> {b.safetyPearls}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

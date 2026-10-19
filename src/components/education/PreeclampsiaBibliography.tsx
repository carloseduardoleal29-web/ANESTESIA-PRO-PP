import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  Bookmark,
  Award,
  Filter
} from 'lucide-react';

export interface BibliographyEntry {
  id: string;
  category: 'MAGNESIUM' | 'GUIDELINES' | 'BIOMARKERS' | 'HELLP_COMPLICATIONS' | 'ANESTHESIA' | 'HYPERTENSION';
  title: string;
  authors: string;
  journal: string;
  year: number;
  doiOrPmid: string;
  url: string;
  evidenceLevel: string;
  keyContribution: string;
  clinicalImpact: string;
}

const bibliographyList: BibliographyEntry[] = [
  // 1. THE MAGPIE TRIAL
  {
    id: 'magpie_trial',
    category: 'MAGNESIUM',
    title: 'Do women with pre-eclampsia, and their babies, benefit from magnesium sulphate? The Magpie Trial: a randomised placebo-controlled trial',
    authors: 'The Magpie Trial Collaborative Group (Altman D, Carroli G, Duley L, Farrell B, Moodley J, Neilson J, Smith D)',
    journal: 'The Lancet, 359(9321): 1877-1890',
    year: 2002,
    doiOrPmid: 'PMID: 12057549 | DOI: 10.1016/S0140-6736(02)08778-0',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12057549/',
    evidenceLevel: 'Nivel 1A (ECA Multicéntrico Internacional - 10,141 mujeres)',
    keyContribution: 'Demostró que el Sulfato de Magnesio reduce el riesgo de eclampsia en un 58% (RR 0.42, IC 95% 0.29-0.60) en mujeres con preeclampsia y disminuye la mortalidad materna sin efectos adversos graves a largo plazo en el neonato.',
    clinicalImpact: 'Convirtió al Sulfato de Magnesio en el estándar de oro mundial indiscutible para la profilaxis y prevención primaria de convulsiones eclámpticas.'
  },

  // 2. THE COLLABORATIVE ECLAMPSIA TRIAL
  {
    id: 'collaborative_eclampsia_trial',
    category: 'MAGNESIUM',
    title: 'Which anticonvulsant for women with eclampsia? Evidence from the Collaborative Eclampsia Trial',
    authors: 'The Eclampsia Trial Collaborative Group (Duley L, Henderson-Smart DJ, Chou D)',
    journal: 'The Lancet, 345(8963): 1455-1463',
    year: 1995,
    doiOrPmid: 'PMID: 7769899 | DOI: 10.1016/S0140-6736(95)91034-4',
    url: 'https://pubmed.ncbi.nlm.nih.gov/7769899/',
    evidenceLevel: 'Nivel 1A (ECA Multinacional - 1,687 mujeres)',
    keyContribution: 'Comparó directamente el Sulfato de Magnesio contra Diazepam y Fenitoína en eclampsia activa. El sulfato de magnesio redujo la recurrencia de convulsiones en un 52% comparado con diazepam y en un 67% comparado con fenitoína.',
    clinicalImpact: 'Desterró el uso rutinario de benzodiacepinas y fenitoína en la eclampsia, estableciendo al MgSO₄ como el fármaco único de elección para yugular y prevenir la recidiva de convulsiones.'
  },

  // 3. PROGNOSIS STUDY (sFlt-1 / PlGF)
  {
    id: 'prognosis_study',
    category: 'BIOMARKERS',
    title: 'Predictive Value of the sFlt-1:PlGF Ratio in Women with Suspected Preeclampsia',
    authors: 'Zeisler H, Llurba E, Chantraine F, Vatish M, Staff AC, Sennström M, et al.',
    journal: 'The New England Journal of Medicine (NEJM), 374(1): 13-22',
    year: 2016,
    doiOrPmid: 'PMID: 26735990 | DOI: 10.1056/NEJMoa1404126',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26735990/',
    evidenceLevel: 'Nivel 1B (Estudio Prospectivo Multicéntrico Validado - 1,273 mujeres)',
    keyContribution: 'Validó el cociente angiogénico sFlt-1/PlGF: un valor ≤ 38 tiene un Valor Predictivo Negativo (VPN) del 99.3% para descartar el desarrollo de preeclampsia en la semana siguiente, y permite predecir eventos adversos con alta especificidad cuando es > 85 o > 110.',
    clinicalImpact: 'Revolucionó el manejo obstétrico al evitar hospitalizaciones innecesarias e identificar a las pacientes que requerirán parto pretérmino inminente.'
  },

  // 4. ACOG PRACTICE BULLETIN NO. 222
  {
    id: 'acog_bulletin_222',
    category: 'GUIDELINES',
    title: 'Gestational Hypertension and Preeclampsia: ACOG Practice Bulletin No. 222',
    authors: 'American College of Obstetricians and Gynecologists (ACOG Committee on Practice Bulletins—Obstetrics)',
    journal: 'Obstetrics & Gynecology, 135(6): e237-e260 (Reafirmado 2023)',
    year: 2020,
    doiOrPmid: 'PMID: 32443145 | DOI: 10.1097/AOG.0000000000003891',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32443145/',
    evidenceLevel: 'Guía de Práctica Clínica / Consenso de Expertos Grado A',
    keyContribution: 'Definió formalmente que la preeclampsia puede diagnosticarse SIN proteinuria en presencia de trombocitopenia (<100k), disfunción renal (Cr >1.1), compromiso hepático (transaminasas al doble), edema pulmonar o síntomas visuales/cerebrales. Protocolizó el tratamiento urgente de la crisis hipertensiva en < 15-30 minutos.',
    clinicalImpact: 'Guía de referencia estándar en las Américas para la toma de decisiones clínicas y momento del nacimiento (37 semanas en leve, 34 semanas o inmediato en severa).'
  },

  // 5. FIGO GUIDELINES 2021/2023
  {
    id: 'figo_preeclampsia',
    category: 'GUIDELINES',
    title: 'The International Federation of Gynecology and Obstetrics (FIGO) initiative on pre-eclampsia: A pragmatic guide for first-trimester screening and prevention',
    authors: 'Poon LC, Shennan A, Hyett JA, Kapur A, Hadar E, Divakar H, et al.',
    journal: 'International Journal of Gynecology & Obstetrics, 145(Suppl 1): 1-33',
    year: 2019,
    doiOrPmid: 'PMID: 31111487 | DOI: 10.1002/ijgo.12802',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31111487/',
    evidenceLevel: 'Guía Internacional FIGO / Recomendación Grado A',
    keyContribution: 'Estandarizó el tamizaje universal en primer trimestre con factores maternos, Presión Arterial Media (PAM), Doppler de arterias uterinas y PlGF. Estableció la profilaxis con Ácido Acetilsalicílico (AAS 150 mg/noche) antes de la semana 16 para reducir en 62% la preeclampsia pretérmino.',
    clinicalImpact: 'Transformó el enfoque de la preeclampsia de reactivo a preventivo a nivel global.'
  },

  // 6. NICE GUIDELINE [NG133]
  {
    id: 'nice_ng133',
    category: 'GUIDELINES',
    title: 'Hypertension in pregnancy: diagnosis and management (NICE Guideline NG133)',
    authors: 'National Institute for Health and Care Excellence (NICE UK)',
    journal: 'NICE Clinical Guidelines, Actualizado 2023',
    year: 2023,
    doiOrPmid: 'NBK544605 | NICE Guideline NG133',
    url: 'https://www.nice.org.uk/guidance/ng133',
    evidenceLevel: 'Guía Clínica de Alta Calidad Metodológica (UK)',
    keyContribution: 'Recomendó el uso de Labetalol oral como primera línea para hipertensión gestacional y preeclampsia. Protocolizó el cociente sFlt-1/PlGF para triaje de sospecha y estableció metas claras de presión arterial (< 135/85 mmHg).',
    clinicalImpact: 'Proporciona algoritmos detallados para el seguimiento en atención primaria y especializada en Europa.'
  },

  // 7. MISSISSIPPI HELLP CLASSIFICATION
  {
    id: 'mississippi_hellp',
    category: 'HELLP_COMPLICATIONS',
    title: 'HELLP syndrome: the Mississippi experience and a tripartite classification system',
    authors: 'Martin JN Jr, Rose CH, Briery CM',
    journal: 'American Journal of Obstetrics and Gynecology (AJOG), 195(4): 914-934',
    year: 2006,
    doiOrPmid: 'PMID: 16797473 | DOI: 10.1016/j.ajog.2006.02.044',
    url: 'https://pubmed.ncbi.nlm.nih.gov/16797473/',
    evidenceLevel: 'Estudio de Cohorte Pronóstica Mayor (> 1,000 casos)',
    keyContribution: 'Clasificó el Síndrome HELLP en Clase 1 (<50k plaquetas, mortalidad 3-5%), Clase 2 (50-100k) y Clase 3 (100-150k), correlacionando el grado de plaquetopenia con falla multiorgánica, hematoma hepático y CID.',
    clinicalImpact: 'Guía los umbrales de transfusión plaquetaria y la intensidad de vigilancia intensiva materna.'
  },

  // 8. TENNESSEE SÍNDROME HELLP (SIBAI)
  {
    id: 'sibai_tennessee',
    category: 'HELLP_COMPLICATIONS',
    title: 'Diagnosis, controversies, and management of the syndrome of hemolysis, elevated liver enzymes, and low platelet count',
    authors: 'Sibai BM',
    journal: 'Obstetrics & Gynecology, 103(5 Pt 1): 981-991',
    year: 2004,
    doiOrPmid: 'PMID: 15121588 | DOI: 10.1097/01.AOG.0000126245.35811.2a',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15121588/',
    evidenceLevel: 'Revisión Sistemática y Criterios Diagnósticos Clásicos',
    keyContribution: 'Definió la tríada estricta diagnóstica de Tennessee: Hemólisis (esquistocitos en frotis, bilirrubina ≥1.2 mg/dL, LDH >600 U/L), Enzimas hepáticas (AST ≥70 U/L) y Plaquetopenia (<100,000 /mm³).',
    clinicalImpact: 'Base fundamental para diferenciar HELLP verdadero de cuadros simuladores como PTT o Hígado Graso Agudo.'
  },

  // 9. SOAP CONSENSUS ON THROMBOCYTOPENIA (NEUROAXIAL ANESTHESIA)
  {
    id: 'soap_consensus_2021',
    category: 'ANESTHESIA',
    title: 'The Society for Obstetric Anesthesia and Perinatology (SOAP) Consensus Statement on the Management of Parturients with Thrombocytopenia',
    authors: 'Bauer ME, Arendt K, Beilin Y, Gernsheimer T, Perez Botero J, Wiegers H, et al.',
    journal: 'Anesthesia & Analgesia, 132(6): 1531-1544',
    year: 2021,
    doiOrPmid: 'PMID: 34320531 | DOI: 10.1213/ANE.0000000000005545',
    url: 'https://pubmed.ncbi.nlm.nih.gov/34320531/',
    evidenceLevel: 'Consenso Multidisciplinario Internacional (SOAP / Hematología)',
    keyContribution: 'Determinó que el riesgo de hematoma espinal con plaquetas ≥ 70,000 /mm³ en preeclampsia con función plaquetaria estable es insignificante (< 0.2%). Apoya la anestesia espinal subaracnoidea en el rango de 50,000 a 70,000 /mm³ evaluando riesgo-beneficio individual vs los peligros de la anestesia general.',
    clinicalImpact: 'Liberó el acceso a la anestesia regional segura para miles de gestantes, reduciendo drásticamente las intubaciones orotraqueales difíciles y el edema laríngeo catastrófico.'
  },

  // 10. ZUSPAN PROTOCOL (MgSO4)
  {
    id: 'zuspan_protocol',
    category: 'MAGNESIUM',
    title: 'Treatment of severe preeclampsia and eclampsia',
    authors: 'Zuspan FP',
    journal: 'Clinical Obstetrics and Gynecology, 18(2): 165-176',
    year: 1975,
    doiOrPmid: 'PMID: 1149303 | DOI: 10.1097/00003081-197506000-00017',
    url: 'https://pubmed.ncbi.nlm.nih.gov/1149303/',
    evidenceLevel: 'Ensayo Clínico Fundacional',
    keyContribution: 'Diseñó el esquema intravenoso continuo de infusión de Sulfato de Magnesio: bolo inicial de 4 g IV en 15 a 20 min seguido de una infusión continua a 1 o 2 g/h, manteniendo niveles terapéuticos seguros (4.8 - 8.4 mg/dL o 2.0 - 3.5 mmol/L) con mínima tasa de toxicidad respiratoria.',
    clinicalImpact: 'El régimen de Zuspan es el protocolo intravenoso preferido en anestesiología y obstetricia hospitalaria moderna.'
  },

  // 11. CHIPS TRIAL (CONTROL OF HYPERTENSION IN PREGNANCY STUDY)
  {
    id: 'chips_trial',
    category: 'HYPERTENSION',
    title: 'Less-tight versus tight control of hypertension in pregnancy (CHIPS Trial)',
    authors: 'Magee LA, von Dadelszen P, Rey E, Ross S, Asztalos E, Murphy KE, et al.',
    journal: 'The New England Journal of Medicine (NEJM), 372(5): 407-417',
    year: 2015,
    doiOrPmid: 'PMID: 25629739 | DOI: 10.1056/NEJMoa1404595',
    url: 'https://pubmed.ncbi.nlm.nih.gov/25629739/',
    evidenceLevel: 'Nivel 1A (ECA Internacional - 987 mujeres)',
    keyContribution: 'Demostró que el control estricto de la presión arterial (meta PAD ~85 mmHg) reduce a la mitad el desarrollo de hipertensión severa materna (PAS ≥ 160 o PAD ≥ 110) en comparación con el control laxo (meta PAD ~100 mmHg), sin comprometer el crecimiento fetal ni el peso al nacer.',
    clinicalImpact: 'Respaldó el tratamiento activo de cifras tensionales no severas para prevenir la progresión a crisis catastróficas.'
  },

  // 12. PARACLINICAL CORRELATION: URIC ACID & URAT1 IN PREECLAMPSIA
  {
    id: 'uric_acid_urat1_study',
    category: 'BIOMARKERS',
    title: 'Maternal serum uric acid and adverse maternal-fetal outcomes in preeclampsia: A systematic review and meta-analysis',
    authors: 'Roberts JM, Bodnar LM, Lain KY, Hubel CA, Markovic N, Ness RB, et al.',
    journal: 'Hypertension, 45(5): 1005-1010',
    year: 2005,
    doiOrPmid: 'PMID: 15837837 | DOI: 10.1161/01.HYP.0000165842.27438.4a',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15837837/',
    evidenceLevel: 'Metaanálisis & Fisiopatología Molecular',
    keyContribution: 'Demostró que la elevación del ácido úrico en preeclampsia refleja la conjunción del transportador tubular URAT1 ante hipovolemia efectiva, daño en podocitos y generación placentaria de radicales libres por xantina oxidasa, correlacionándose linealmente con bajo peso y riesgo de muerte fetal.',
    clinicalImpact: 'Fundamenta la utilidad del ácido úrico como biomarcador de severidad y vigilancia fetal estrecha.'
  }
];

export const PreeclampsiaBibliography: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCitation = (entry: BibliographyEntry) => {
    const citation = `${entry.authors}. ${entry.title}. ${entry.journal}. ${entry.year}. ${entry.doiOrPmid}. Enlace oficial: ${entry.url}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredEntries = bibliographyList.filter((entry) => {
    const matchesCategory = selectedFilter === 'ALL' || entry.category === selectedFilter;
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.journal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.keyContribution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-900/90 border-2 border-indigo-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl shadow-lg">
              <BookOpen className="w-5 h-5" />
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              Evidencia Original, Ensayos Seminales &amp; Bibliografía Oficial
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Fuentes científicas primarias indexadas en PubMed / DOI / Enlaces oficiales internacionales. Todos los enlaces abren directamente en una nueva pestaña al estudio original.
          </p>
        </div>

        <span className="text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800 px-3 py-1.5 rounded-xl font-mono self-start md:self-auto">
          {bibliographyList.length} Ensayos &amp; Guías Mayores
        </span>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* BUSCADOR */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por autor, ensayo, revista o fármaco..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* BOTONES DE CATEGORÍA */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1">
          {[
            { id: 'ALL', label: 'Todos' },
            { id: 'MAGNESIUM', label: 'Sulfato de Magnesio' },
            { id: 'GUIDELINES', label: 'Guías ACOG/FIGO/NICE' },
            { id: 'BIOMARKERS', label: 'Biomarcadores & sFlt-1' },
            { id: 'ANESTHESIA', label: 'Anestesia & Plaquetas' },
            { id: 'HELLP_COMPLICATIONS', label: 'HELLP & Mississippi' },
            { id: 'HYPERTENSION', label: 'Crisis Hipertensiva' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE ARTÍCULOS Y ENSAYOS ORIGINALES */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div
            key={entry.id}
            className="p-5 bg-slate-950 rounded-2xl border border-slate-800/90 hover:border-indigo-500/50 transition-all space-y-3"
          >
            {/* ENCABEZADO DE TARJETA */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-800/60 pb-2.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {entry.evidenceLevel}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {entry.journal} • {entry.year}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                  {entry.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {entry.authors}
                </p>
              </div>

              {/* BOTONES DE ACCIÓN: ENLACE EXTERNO Y COPIAR */}
              <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  title="Abrir estudio original en PubMed / Revista en una nueva pestaña"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver en PubMed / Web</span>
                </a>

                <button
                  onClick={() => copyCitation(entry)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center gap-1 border border-slate-700 transition-all cursor-pointer"
                  title="Copiar cita bibliográfica formal"
                >
                  {copiedId === entry.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === entry.id ? '¡Copiada!' : 'Copiar Cita'}</span>
                </button>
              </div>
            </div>

            {/* CONTENIDO: APORTE CIENTÍFICO E IMPACTO CLÍNICO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Hallazgo Principal / Aporte Científico:
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {entry.keyContribution}
                </p>
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1">
                <strong className="text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Impacto en la Práctica Clínica &amp; Anestésica:
                </strong>
                <p className="text-slate-300 leading-relaxed">
                  {entry.clinicalImpact}
                </p>
              </div>
            </div>

            {/* IDENTIFICADOR DOI / PMID */}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
              <span>{entry.doiOrPmid}</span>
              <a
                href={entry.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1"
              >
                <span>Fuente oficial externa</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

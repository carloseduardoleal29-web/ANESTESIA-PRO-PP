import jsPDF from 'jspdf';

// PDF Generator for Preeclampsia Clinical Dossier (Dr. Carlos Leal)
// Generador Integral Maestro de 5 Páginas de Alta Resolución Académica y Clínica
export const downloadPreeclampsiaGuidePDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ==========================================
    // PÁGINA 1: DIAGNÓSTICO, ÁCIDO ÚRICO, FISIOPATOLOGÍA Y BIOMARCADORES
    // ==========================================

    // Encabezado Superior Slate 900
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.rect(0, 0, 210, 27, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ANESTESIAPRO • PROTOCOLO DE ALTA COMPLEJIDAD OBSTÉTRICA', 14, 10.5);

    doc.setFontSize(9);
    doc.setTextColor(244, 63, 94); // Rose 500
    doc.text('PREECLAMPSIA, ECLAMPSIA Y SÍNDROME HELLP: DOSSIER ACADÉMICO INTEGRAL', 14, 17);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Autoría: Dr. Carlos Leal | Anestesiología y Reanimación | Consenso ACOG / FIGO / SOAP / ISSHP 2026 | ${new Date().toLocaleDateString()}`, 14, 23);

    let yPos = 32;

    // SECCIÓN 1: CRITERIOS DIAGNÓSTICOS MODERNOS (ACOG / FIGO / ISSHP)
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3.5, 182, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('1. CRITERIOS DIAGNÓSTICOS MODERNOS Y CAMBIO DE PARADIGMA (ACOG / FIGO)', 16, yPos + 0.5);

    yPos += 5.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text('• Criterio Tensional Clásico: PAS >= 140 mmHg o PAD >= 90 mmHg en 2 tomas (separadas >= 4h tras sem. 20) en paciente normotensa previa.', 16, yPos);
    yPos += 3.5;
    doc.text('• Crisis Hipertensiva Severa: PAS >= 160 mmHg y/o PAD >= 110 mmHg confirmada en 15 minutos (emergencia obstétrica, no esperar 4h).', 16, yPos);
    yPos += 3.5;
    doc.text('• Proteinuria Tradicional: >= 300 mg en orina de 24h, o cociente Proteína/Creatinina (IPC) >= 0.3 mg/mg en muestra aislada.', 16, yPos);
    yPos += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(190, 18, 60); // Rose 700
    doc.text('• ¡CAMBIO DE PARADIGMA ACOG/FIGO!: Preeclampsia SIN Proteinuria (HTA Gestacional + Daño de Órgano Blanco):', 16, yPos);
    
    yPos += 3.4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text('   1) Trombocitopenia: Conteo plaquetario < 100,000 /mm3.', 18, yPos);
    yPos += 3.2;
    doc.text('   2) Insuficiencia Renal Aguda: Creatinina sérica > 1.1 mg/dL o duplicación del valor basal en ausencia de nefropatía previa.', 18, yPos);
    yPos += 3.2;
    doc.text('   3) Disfunción Hepática: Transaminasas (AST / ALT) elevadas al doble de lo normal y/o dolor severo en hipocondrio derecho o epigastrio.', 18, yPos);
    yPos += 3.2;
    doc.text('   4) Edema Agudo de Pulmón: Disnea súbita, crepitantes bibasales difusos y saturación periférica de O2 < 90%.', 18, yPos);
    yPos += 3.2;
    doc.text('   5) Alteraciones Neurovisuales: Cefalea refractaria a analgésicos, escotomas centellantes, fotopsias, hiperreflexia patelar y clonus.', 18, yPos);

    yPos += 5.5;

    // SECCIÓN 2: ROL DEL ÁCIDO ÚRICO COMO BIOMARCADOR
    doc.setFillColor(254, 243, 199); // Amber 50
    doc.rect(14, yPos - 3, 182, 23, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // Amber 800
    doc.text('🧪 2. EL ÁCIDO ÚRICO COMO BIOMARCADOR CLAVE DE ISQUEMIA TISULAR Y DAÑO RENAL', 16, yPos + 0.5);

    yPos += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text('• Umbral Patológico: > 5.5 - 6.0 mg/dL (en gestación normal cae fisiológicamente a 2.5 - 4.0 mg/dL por hiperfiltración glomerular).', 16, yPos);
    yPos += 3.3;
    doc.text('• Mecanismo Isquémico: La hipoxia trofoblástica dispara la degradación de ATP celular a hipoxantina y xantina, activando masivamente', 16, yPos);
    yPos += 3.1;
    doc.text('  a la enzima Xantina Oxidasa, la cual genera ácido úrico y radicales libres de anión superóxido, lesionando el endotelio vascular.', 18, yPos);
    yPos += 3.3;
    doc.text('• Mecanismo Renal: La endoteliosis glomerular reduce la filtración y genera avidez en la reabsorción tubular proximal de uratos.', 16, yPos);
    yPos += 3.1;
    doc.text('• Correlación Clínica: Su elevación precede en semanas a la proteinuria y se correlaciona con RCIU severo, desprendimiento y HELLP.', 16, yPos);

    yPos += 6;

    // SECCIÓN 3: FISIOPATOLOGÍA CELULAR EN DOS FASES
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3.5, 182, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('3. FISIOPATOLOGÍA CELULAR Y DEFECTOS PLACENTARIOS EN DOS FASES', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text('A) Fase 1 Placentaria (Semanas 8 a 18): Defecto en la Segunda Oleada de Invasión Trofoblástica', 16, yPos);
    yPos += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text('• En el embarazo fisiológico, el citotrofoblasto extravelloso invade la pared de las arterias espirales miometriales, destruyendo su capa elástica', 16, yPos);
    yPos += 3.1;
    doc.text('  y muscular, transformándolas en conductos flácidos, anchos y de baja resistencia vascular sin respuesta a vasopresores.', 18, yPos);
    yPos += 3.3;
    doc.text('• En preeclampsia, fracasa la invasión miometrial: los vasos conservan músculo liso y reactividad adrenérgica. El flujo sanguíneo ingresa', 16, yPos);
    yPos += 3.1;
    doc.text('  en chorro ("jets" pulsátiles a alta velocidad), produciendo estrés de cizallamiento, aterosis aguda, necrosis fibrinoide e isquemia vellosa.', 18, yPos);

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(15, 23, 42);
    doc.text('B) Fase 2 Materna Sistémica: Tormenta Antiangiogénica y Desbalance sFlt-1 / PlGF', 16, yPos);
    yPos += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text('• sFlt-1 (Tirosina quinasa 1 soluble tipo Fms): Liberada por la placenta hipóxica, secuestra y neutraliza al VEGF y al PlGF circulantes.', 16, yPos);
    yPos += 3.1;
    doc.text('• sEng (Endoglina Soluble): Inhibe la vía de señalización del TGF-β, bloqueando la óxido nítrico sintasa endotelial (eNOS) y prostaciclina.', 16, yPos);
    yPos += 3.1;
    doc.text('• Destrucción del Glicocálix Endotelial: Desprendimiento de sindecano-1, induciendo hiperpermeabilidad vascular, fuga de albúmina y edema.', 16, yPos);

    yPos += 5.5;

    // SECCIÓN 4: BIOMARCADORES ANGIOGÉNICOS (COCIENTE sFlt-1 / PlGF)
    doc.setFillColor(245, 243, 255); // Violet 50
    doc.rect(14, yPos - 3, 182, 23, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(109, 40, 217); // Purple 700
    doc.text('🔬 4. COCIENTE ANGIOGÉNICO sFlt-1 / PlGF (ESTUDIO SEMINAL PROGNOSIS - NEJM)', 16, yPos + 0.5);

    yPos += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text('• Ratio sFlt-1 / PlGF <= 38: Regla de Oro para Exclusión. Presenta un Valor Predictivo Negativo (VPN) > 99.3% para descartar el desarrollo', 16, yPos);
    yPos += 3.1;
    doc.text('  de preeclampsia y complicaciones materno-fetales severas durante los 7 días posteriores a la toma de la muestra sanguínea.', 18, yPos);
    yPos += 3.3;
    doc.text('• Ratio > 38 y > 85 (en gestación temprana < 34 semanas) o > 110 (gestación tardía >= 34 semanas): Elevado valor predictivo positivo', 16, yPos);
    yPos += 3.1;
    doc.text('  asociado a necesidad de parto pretérmino inminente en las siguientes 4 semanas y desarrollo acelerado de síndrome HELLP.', 18, yPos);

    yPos += 5.5;

    // SECCIÓN 5: ESTRATIFICACIÓN FENOTÍPICA (PRECOZ VS TARDÍA VS POSTPARTO)
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3.5, 182, 5.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('5. FENOTIPOS CLÍNICOS: PREECLAMPSIA PRECOZ, TARDÍA Y POSTPARTO', 16, yPos + 0.5);

    yPos += 4.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text('• Preeclampsia Precoz (< 34 sem): Origen placentario intrínseco. Cursa con RCIU severo, Doppler de arterias uterinas alterado (notch bilateral)', 16, yPos);
    yPos += 3.1;
    doc.text('  y alto riesgo de complicaciones maternas fulminantes. Manejo: Maduración pulmonar fetal con corticoides y finalización expedita.', 18, yPos);
    yPos += 3.3;
    doc.text('• Preeclampsia Tardía (>= 34 sem): Predominio de susceptibilidad microvascular materna y factores metabólicos. Feto generalmente de peso normal,', 16, yPos);
    yPos += 3.1;
    doc.text('  pero con igual susceptibilidad materna a crisis hipertensivas de novo y edema agudo pulmonar súbito.', 18, yPos);
    yPos += 3.3;
    doc.text('• Preeclampsia Postparto (de inicio tardío 48h - 6 sem): Por persistencia de vasoespasmo y movilización masiva del tercer espacio intravascular.', 16, yPos);

    // Pie de página 1
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('Página 1 de 5 • AnestesiaPro • Guía Maestra de Preeclampsia • Autor: Dr. Carlos Leal', 14, 288);

    // ==========================================
    // PÁGINA 2: EFECTO DEL MAGNESIO SOBRE EL GLUTAMATO Y DOSIFICACIÓN
    // ==========================================
    doc.addPage();

    // Encabezado P2
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 23, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('NEUROPROTECCIÓN CEREBRAL: EL MAGNESIO (MgSO4) Y SU ACCIÓN SOBRE EL GLUTAMATO', 14, 11);
    doc.setFontSize(7.5);
    doc.setTextColor(168, 85, 247); // Purple 400
    doc.text('Mecanismo Molecular del Tapón NMDA, Inhibición Presináptica, Esquemas Zuspan/Pritchard y Toxicidad', 14, 17.5);

    yPos = 29;

    // SECCIÓN MOLECULAR: ACCIÓN SOBRE EL GLUTAMATO
    doc.setFillColor(245, 243, 255); // Purple 50
    doc.rect(14, yPos - 3, 182, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(126, 34, 206); // Purple 700
    doc.text('🧠 1. MECANISMO MOLECULAR: ¿CÓMO FRENA EL MAGNESIO LA TORMENTA DE GLUTAMATO?', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('A) Bloqueo Presináptico de Canales de Calcio Caᵥ2.1 (P/Q) y Caᵥ2.2 (N):', 16, yPos);
    yPos += 3.4;
    doc.text('El Mg²⁺ compite de forma estequiométrica con el Ca²⁺ en los terminales axónicos pre-sinápticos. Al impedir la entrada intracelular de Ca²⁺,', 16, yPos);
    yPos += 3.2;
    doc.text('bloquea la fosforilación de sinaptotagmina-1 y el ensamblaje del complejo SNARE, reduciendo > 70% la exocitosis de vesículas de glutamato.', 18, yPos);
    yPos += 4;

    doc.text('B) El "Tapón de Magnesio" (Magnesium Plug) en el Receptor Postsináptico NMDA (GluN1/GluN2):', 16, yPos);
    yPos += 3.4;
    doc.text('En reposo (-70 mV), el Mg²⁺ se aloja en el cuello profundo del canal NMDA (residuo Asn598 del bucle M2), bloqueando el paso de Ca²⁺.', 16, yPos);
    yPos += 3.2;
    doc.text('En la eclampsia, la despolarización expulsa el Mg²⁺ nativo, causando entrada masiva de Ca²⁺, calpaínas, nNOS y muerte por excitotoxicidad.', 16, yPos);
    yPos += 3.2;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text('La administración terapéutica de MgSO₄ (4.8 - 8.4 mg/dL) reinserta el tapón en el poro incluso ante despolarizaciones severas, abortando la crisis.', 16, yPos);
    yPos += 4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('C) Supresión de la Depresión Cortical Propagada (CSD) y Vasodilatación Vértebro-Basilar mediada por Prostaciclina (PGI₂) y Óxido Nítrico.', 16, yPos);

    yPos += 7.5;

    // ESQUEMA ZUSPAN Y PRITCHARD
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3, 182, 42, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('💊 2. ESQUEMAS DE DOSIFICACIÓN CLÍNICA (ESTÁNDAR DE ORO INTERNACIONAL)', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.3);
    doc.setTextColor(2, 132, 199); // Sky 600
    doc.text('A) Esquema Zuspan (Vía Intravenosa - De Elección con Bomba de Infusión Continua):', 16, yPos);
    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(7);
    doc.text('• Dosis de Impregnación: 4 a 6 gramos IV diluidos en 100 mL de SSN 0.9% a pasar en 15 a 20 minutos (vigilar sensación de calor facial).', 16, yPos);
    yPos += 3.4;
    doc.text('• Dosis de Mantenimiento: 1 a 2 gramos/hora en infusión continua durante 24 horas posparto o tras la última convulsión.', 16, yPos);
    yPos += 3.4;
    doc.text('  Preparación estándar: 20 g de MgSO₄ (4 ampollas al 50%) en 500 mL SSN 0.9% (40 mg/mL). 1 g/h = 25 mL/h; 2 g/h = 50 mL/h.', 18, yPos);
    yPos += 3.4;
    doc.text('• Convulsión Recurrente bajo MgSO₄: Administrar un bolo adicional de 2 g IV en 5 a 10 minutos (NO suspender infusión de mantenimiento).', 16, yPos);

    yPos += 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('B) Esquema Pritchard (Vía Intramuscular - Si no hay bomba de infusión / transporte en ambulancia):', 16, yPos);
    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('• Carga: 4 g IV en 20 min + 10 g IM profundos (5 g en cada glúteo con aguja 21G larga + 1 mL Lidocaína al 2% para mitigar dolor intenso).', 16, yPos);
    yPos += 3.4;
    doc.text('• Mantenimiento: 5 g IM cada 4 horas alternando glúteos previa confirmación estricta de patelar presente, FR >= 12 y diuresis >= 30 mL/h.', 16, yPos);

    yPos += 7;

    // MONITOREO DE TOXICIDAD Y ANTÍDOTO
    doc.setFillColor(254, 242, 242); // Rose 50
    doc.rect(14, yPos - 3, 182, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 18, 60); // Rose 700
    doc.text('⚠️ 3. CORRELACIÓN DE MAGNESEMIA SÉRICA, TOXICIDAD Y ANTÍDOTO OBLIGADO', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('• Rango Terapéutico Neuroprotector: 4.8 a 8.4 mg/dL (2.0 a 3.5 mmol/L | 4 a 7 mEq/L). Cese de clonus, normorreflexia y vasodilatación.', 16, yPos);
    yPos += 3.5;
    doc.text('• Pérdida del Reflejo Rotuliano/Patelar: 9.0 a 12.0 mg/dL (7.5 a 10 mEq/L). PRIMER SIGNO CLÍNICO CENTINELA DE INTOXICACIÓN.', 16, yPos);
    yPos += 3.5;
    doc.text('• Depresión Respiratoria y Parálisis Diafragmática: > 12.0 mg/dL (> 10 mEq/L). Suspender infusión de inmediato y asegurar vía aérea.', 16, yPos);
    yPos += 3.5;
    doc.text('• Paro Cardíaco en Asistolia por Bloqueo AV Completo: > 15.0 a 20.0 mg/dL (> 15 mEq/L).', 16, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• ANTÍDOTO OBLIGADO: GLUCONATO DE CALCIO AL 10% (Ampolla 10 mL = 1 g). Administrar 1 g IV lento en 3 a 5 minutos.', 16, yPos);
    yPos += 3.5;
    doc.setFont('helvetica', 'normal');
    doc.text('  El ion Ca²⁺ antagoniza competitiva y directamente los efectos del Mg²⁺ en la placa motora, diafragma y en el sistema de conducción cardíaco.', 18, yPos);

    yPos += 7.5;

    // ALERTA DE RELAJANTES NEUROMUSCULARES
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos - 3, 182, 23, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('🎯 4. ALERTA ANESTESIOLÓGICA CRÍTICA: POTENCIACIÓN DE RELAJANTES NEUROMUSCULARES', 16, yPos + 0.5);
    yPos += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);
    doc.text('• El MgSO₄ reduce drásticamente la liberación presináptica de acetilcolina. POTENCIA de 2 a 4 veces a Rocuronio, Vecuronio y Succinilcolina.', 16, yPos);
    yPos += 3.3;
    doc.text('• Conducta en Quirófano: Reducir dosis de mantenimiento de rocuronio al 50%, monitorizar TOF cuantitativo obligatorio antes de extubar.', 16, yPos);
    yPos += 3.3;
    doc.text('• Reversión: Disponer de Sugammadex (2 a 4 mg/kg o 16 mg/kg en rescate CICO), ya que la Neostigmina suele ser ineficaz ante bloqueo magnésico.', 16, yPos);

    // Pie de página 2
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('Página 2 de 5 • AnestesiaPro • Guía Maestra de Preeclampsia • Autor: Dr. Carlos Leal', 14, 288);

    // ==========================================
    // PÁGINA 3: FARMACOLOGÍA DE LA CRISIS HIPERTENSIVA
    // ==========================================
    doc.addPage();

    // Encabezado P3
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 23, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MATRIZ FARMACOLÓGICA EN CRISIS HIPERTENSIVA OBSTÉTRICA (PAS >= 160 / PAD >= 110 mmHg)', 14, 11);
    doc.setFontSize(7.5);
    doc.setTextColor(244, 63, 94); // Rose 400
    doc.text('Meta Tensional: PAS 140-150 / PAD 90-100 mmHg | Iniciar en < 15 a 30 minutos para evitar ACV hemorrágico', 14, 17.5);

    yPos = 29;

    // 1. LABETALOL IV
    doc.setFillColor(245, 243, 255); // Violet 50
    doc.rect(14, yPos - 3, 182, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(109, 40, 217); // Purple 700
    doc.text('🩸 1. LABETALOL IV — PRIMERA ELECCIÓN ACOG / FIGO (BLOQUEADOR DUAL α1 y β)', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('• PRESENTACIÓN:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('Ampolla de 100 mg en 20 mL (concentración: 5 mg/mL).', 42, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• DOSIS ESCALONADA:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('20 mg IV en 2 min -> Esperar 10-15 min -> 40 mg -> 80 mg -> 80 mg (Dosis máxima acumulada: 300 mg).', 46, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• MECANISMO:', 16, yPos);
    doc.text('Bloqueo competitivo mixto (alfa-1 y beta adrenérgico, ratio 1:7 IV). El bloqueo alfa vasodilata la circulación periférica reduciendo la RVS,', 36, yPos);
    yPos += 3.2;
    doc.text('mientras el bloqueo beta previene la taquicardia refleja. Preserva intacto el flujo sanguíneo útero-placentario y la autorregulación cerebral.', 18, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('• PERLA A FAVOR:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('Inicio suave a los 5 min, pico a los 10 min. No induce caídas bruscas hipotensoras ni aumento de la presión intracraneal.', 42, yPos);

    yPos += 3.6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• CONTRAINDICACIÓN:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('Asma bronquial activa o hiperreactividad bronquial severa, bradicardia materna (< 60 lpm), bloqueo AV grado II o III, IC aguda.', 48, yPos);

    yPos += 6.5;

    // 2. HIDRALAZINA IV
    doc.setFillColor(254, 243, 199); // Amber 50
    doc.rect(14, yPos - 3, 182, 33, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('⚡ 2. HIDRALAZINA IV — VASODILATADOR ARTERIOLAR DIRECTO', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('• PRESENTACIÓN:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('Ampolla de 20 mg en 1 mL (solución o polvo liofilizado reconstituido).', 42, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• DOSIS Y LATENCIA:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('5 mg IV en bolo lento. Esperar OBLIGATORIAMENTE 20 minutos. Repetir 5 a 10 mg c/20 min (Máx: 20 - 30 mg).', 46, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• MECANISMO:', 16, yPos);
    doc.text('Relajación directa del músculo liso arteriolar por alteración del flujo de Ca²⁺ y liberación de óxido nítrico.', 36, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('• PERLA A FAVOR:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('Potente reductor de cifras tensionales diastólicas extremas. Amplia disponibilidad histórica en salas de parto.', 42, yPos);

    yPos += 3.6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• ALERTA CRÍTICA:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('Latencia de 20 min. Peligro de "dosis sobre dosis" con hipotensión súbita materna y desaceleraciones fetales tardías. Cefalea y rubor.', 44, yPos);

    yPos += 6.5;

    // 3. NIFEDIPINO ORAL
    doc.setFillColor(236, 254, 255); // Cyan 50
    doc.rect(14, yPos - 3, 182, 32, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(14, 116, 144); // Cyan 700
    doc.text('💊 3. NIFEDIPINO VÍA ORAL (LIBERACIÓN INMEDIATA / RETARDADA) — CALCIOANTAGONISTA', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('• PRESENTACIÓN:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('Cápsulas o comprimidos de 10 mg o 20 mg vía oral.', 42, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• DOSIS CLÍNICA:', 16, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('10 a 20 mg VO tragados con agua (no masticar ni perforar). Repetir a los 20-30 min si persiste PAS >= 160 o PAD >= 110.', 42, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'normal');
    doc.text('• MECANISMO:', 16, yPos);
    doc.text('Bloqueo selectivo de canales de calcio tipo L en músculo liso arteriolar periférico, induciendo vasodilatación rápida.', 36, yPos);

    yPos += 3.8;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('• PERLA A FAVOR:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('Fármaco de elección si no se cuenta con vía venosa permeable inmediata. Rápida absorción gastrointestinal.', 42, yPos);

    yPos += 3.6;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• ¡PROHIBICIÓN!:', 16, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    doc.text('¡NUNCA ADMINISTRAR VÍA SUBLINGUAL! Induce colapso hemodinámico no controlable y muerte fetal intrauterina por robo de flujo.', 40, yPos);

    yPos += 6.5;

    // 4. SEGUNDA Y TERCERA LÍNEA (NITROGLICERINA, NICARDIPINO, URAPIDIL, NITROPRUSIATO)
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos - 3, 182, 33, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('🔬 4. FÁRMACOS DE SEGUNDA Y TERCERA LÍNEA EN ESCENARIOS ESPECIALES', 16, yPos + 0.5);

    yPos += 4.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text('• NITROGLICERINA IV (5-10 μg/min hasta 100-200 μg/min): FÁRMACO DE ELECCIÓN EN EDEMA AGUDO DE PULMÓN (EAP).', 16, yPos);
    yPos += 3.2;
    doc.text('  Venodilatador que reduce la precarga ventricular izquierda y la presión capilar pulmonar de enclavamiento.', 18, yPos);
    yPos += 3.6;
    doc.text('• NICARDIPINO IV (5 mg/h, titular hasta 15 mg/h): Bloqueador de canales de calcio IV con curva predecible y sin taquicardia refleja.', 16, yPos);
    yPos += 3.6;
    doc.text('• URAPIDIL IV (Bolo 12.5-25 mg en 2 min, infusión 5-40 mg/h): Antagonista alfa-1 periférico y agonista 5-HT1A central. Preserva flujo cerebral.', 16, yPos);
    yPos += 3.6;
    doc.text('• NITROPRUSIATO DE SODIO IV (0.25-0.5 μg/kg/min): Último recurso extremo en emergencia refractaria. Máximo 4 horas por toxicidad fetal por cianuro.', 16, yPos);

    yPos += 5.5;

    // 5. PREVENCIÓN CON ÁCIDO ACETILSALICÍLICO (AAS)
    doc.setFillColor(240, 253, 244); // Emerald 50
    doc.rect(14, yPos - 3, 182, 17, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(4, 120, 87); // Emerald 700
    doc.text('🛡️ 5. PREVENCIÓN PRIMARIA CON ÁCIDO ACETILSALICÍLICO (ESTUDIOS ASPRE / FIGO)', 16, yPos + 0.5);
    yPos += 4.2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text('• Dosis Óptima: 150 mg/día vía oral nocturna, iniciada ANTES de la semana 16 de gestación (idealmente sem 11 a 14) hasta la sem 36.', 16, yPos);
    yPos += 3.2;
    doc.text('• Impacto Clínico: Reduce en un 62% la preeclampsia pretérmino (< 37 semanas) y en un 89% la preeclampsia extrema (< 32 semanas).', 16, yPos);

    // Pie de página 3
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('Página 3 de 5 • AnestesiaPro • Guía Maestra de Preeclampsia • Autor: Dr. Carlos Leal', 14, 288);

    // ==========================================
    // PÁGINA 4: MANEJO DE LÍQUIDOS, STARLING Y NEUROAXIAL
    // ==========================================
    doc.addPage();

    // Encabezado P4
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 23, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('MANEJO RESTRICTIVO DE LÍQUIDOS, STARLING Y ANESTESIA NEUROAXIAL', 14, 11);
    doc.setFontSize(7.5);
    doc.setTextColor(56, 189, 248); // Sky 400
    doc.text('Restricción Hídrica 60-80 mL/h, Paradoja de Oliguria, Rescate de EAP y Criterios Plaquetarios SOAP 2026', 14, 17.5);

    yPos = 29;

    // SECCIÓN 1: LEY DE STARLING Y RESTRICCIÓN
    doc.setFillColor(240, 253, 250); // Teal 50
    doc.rect(14, yPos - 3, 182, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(13, 148, 136); // Teal 700
    doc.text('💧 1. FISIOPATOLOGÍA DE STARLING Y RESTRICCIÓN HÍDRICA ESTRICTA (60 a 80 mL/hora)', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('• La Preeclampsia es una situación hemodinámica paradójica: Coexiste contracción del volumen plasmático intravascular eficaz', 16, yPos);
    yPos += 3.2;
    doc.text('  con aumento masivo del agua extracelular total (edema intersticial generalizado por fuga capilar).', 18, yPos);
    yPos += 3.6;
    doc.text('• Caída de la Presión Oncótica Plasmática: Cae de 28 mmHg fisiológicos a < 16 mmHg debido a proteinuria masiva y síntesis hepática deprimida.', 16, yPos);
    yPos += 3.6;
    doc.text('• Coeficiente de Filtración Endotelial (Kf) Disparado: La endoteliosis destruye las uniones estrechas, fugando albúmina al intersticio.', 16, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• ¡TERMINANTEMENTE PROHIBIDO PRECARGAR CON 500 A 1000 mL DE CRISTALOIDES ANTES DE LA ANESTESIA RAQUÍDEA!', 16, yPos);
    yPos += 3.6;
    doc.setFont('helvetica', 'normal');
    doc.text('  La sobrecarga hídrica ciega es la primera causa prevenible de muerte materna por Edema Agudo de Pulmón (EAP).', 18, yPos);
    yPos += 3.2;
    doc.text('  Infusión total de mantenimiento: 60 a 80 mL/hora (máximo 1 mL/kg/hora) sumando sueros de mantenimiento + MgSO4 + oxitocina.', 18, yPos);
    yPos += 3.2;
    doc.text('  Tratamiento de la hipotensión post-bloqueo: Vasopresor en bolo (Fenilefrina 50-100 mcg o Norepinefrina 4-8 mcg), NUNCA con sueros.', 18, yPos);

    yPos += 7.5;

    // SECCIÓN 2: PARADOJA DE LA OLIGURIA Y PROTOCOLO EAP
    doc.setFillColor(254, 242, 242);
    doc.rect(14, yPos - 3, 182, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 18, 60);
    doc.text('⚠️ 2. LA PARADOJA DE LA OLIGURIA TRANSITORIA Y PROTOCOLO DE RESCATE EN EAP', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('• Paradoja de la Oliguria (< 25 mL/h): En preeclampsia, la oliguria durante el trabajo de parto o puerperio temprano es fisiopatológica', 16, yPos);
    yPos += 3.2;
    doc.text('  por endoteliosis y vasoespasmo de la arteriola eferente. NO responde a bolos de líquidos y pasar 500 mL solo desata EAP fatal.', 18, yPos);
    yPos += 3.6;
    doc.text('• Conducta en Oliguria: Tolerar oliguria aislada de 20-30 mL/h si la creatinina es estable y no hay hiperkalemia ni acidosis.', 16, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• PROTOCOLO DE RESCATE EN EDEMA AGUDO DE PULMÓN (EAP):', 16, yPos);
    yPos += 3.6;
    doc.setFont('helvetica', 'normal');
    doc.text('   1) Posición semisentada (45-90°) y suspensión inmediata de toda infusión de cristaloides.', 18, yPos);
    yPos += 3.2;
    doc.text('   2) Furosemida: 20 a 40 mg IV en bolo lento (repetir a los 30 min si no hay diuresis adecuada).', 18, yPos);
    yPos += 3.2;
    doc.text('   3) Nitroglicerina IV: Infusión a 10-20 μg/min para reducir poscarga y precarga ventricular izquierda.', 18, yPos);
    yPos += 3.2;
    doc.text('   4) Ventilación no invasiva CPAP / PEEP (8-10 cmH2O) con máscara facial o intubación endotraqueal si agotamiento muscular.', 18, yPos);

    yPos += 7.5;

    // SECCIÓN 3: PLAQUETAS Y PUNCIÓN NEUROAXIAL
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3, 182, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('💉 3. UMBRALES PLAQUETARIOS PARA PUNCIÓN NEUROAXIAL (SOAP / ACOG 2026)', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('• >= 70,000 /mm3: Neuroaxial SEGURA (Raquídea o Epidural) si el conteo es estable, sin coagulopatía y sin descenso vertiginoso en < 6h.', 16, yPos);
    yPos += 3.5;
    doc.text('• 50,000 a 70,000 /mm3: Zona gris/individualizar. Preferir Anestesia Raquídea con aguja punta de lápiz fina (Whitacre/Pencan 25-27G) a punción única.', 16, yPos);
    yPos += 3.2;
    doc.text('  EVITAR catéter epidural por alto riesgo de hematoma compresivo espinal al insertar o retirar el catéter.', 18, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text('• < 50,000 /mm3: Contraindicación ABSOLUTA de neuroaxial. Requiere Anestesia General + Transfusión de aféresis de plaquetas al incidir.', 16, yPos);
    yPos += 3.6;
    doc.setFont('helvetica', 'normal');
    doc.text('• Retiro del Catéter Epidural: Requiere plaquetas verificadas >= 70,000 - 80,000 /mm3 en analítica reciente (< 4-6 horas).', 16, yPos);

    yPos += 7.5;

    // SECCIÓN 4: ANESTESIA EN CESÁREA: RAQUÍDEA VS GENERAL (RSI)
    doc.setFillColor(245, 243, 255);
    doc.rect(14, yPos - 3, 182, 33, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(109, 40, 217);
    doc.text('🎯 4. PROTOCOLO ANESTÉSICO EN CESÁREA: RAQUÍDEA DE ELECCIÓN VS SECUENCIA RÁPIDA (RSI)', 16, yPos + 0.5);

    yPos += 4.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text('• Raquídea (Técnica de Elección): Bupivacaína pesada 0.5% (8-10 mg) + Fentanilo 15-20 mcg + Morfina intratecal 100 mcg.', 16, yPos);
    yPos += 3.1;
    doc.text('  Evita la manipulación de la vía aérea edematosa y previene picos hipertensivos simpáticos severos que precipitan ACV.', 18, yPos);
    yPos += 3.5;
    doc.text('• Anestesia General (RSI si Plaquetas < 50k o Eclampsia activa): Preoxigenación 100% con PEEP 5 cmH2O.', 16, yPos);
    yPos += 3.1;
    doc.text('  Atenuación simpática OBLIGATORIA: Remifentanilo 1 mcg/kg IV o Labetalol 20 mg + Lidocaína 1.5 mg/kg 90s antes de laringoscopia.', 18, yPos);
    yPos += 3.1;
    doc.text('  Inducción con Propofol 1.5-2 mg/kg + Rocuronio 1.0-1.2 mg/kg (con Sugammadex 16 mg/kg listo) o Succinilcolina 1.5 mg/kg. Tubo 6.0-6.5 mm.', 18, yPos);

    // Pie de página 4
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('Página 4 de 5 • AnestesiaPro • Guía Maestra de Preeclampsia • Autor: Dr. Carlos Leal', 14, 288);

    // ==========================================
    // PÁGINA 5: COMPLICACIONES CRÍTICAS, VÍA AÉREA, BIBLIOGRAFÍA Y MANIFIESTO
    // ==========================================
    doc.addPage();

    // Encabezado P5
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 23, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ATLAS DE COMPLICACIONES CRÍTICAS, EVIDENCIA SEMINAL Y MANIFIESTO', 14, 11);
    doc.setFontSize(7.5);
    doc.setTextColor(244, 63, 94);
    doc.text('HELLP, PRES, Hematoma Hepático, Vía Aérea Edematosa, Ensayos Seminales y Carta al Equipo', 14, 17.5);

    yPos = 29;

    // SECCIÓN 1: ATLAS DE COMPLICACIONES QUIRÚRGICAS
    doc.setFillColor(254, 242, 242);
    doc.rect(14, yPos - 3, 182, 42, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(190, 18, 60);
    doc.text('⚠️ 1. ATLAS DE COMPLICACIONES CRÍTICAS EN QUIRÓFANO Y UCI', 16, yPos + 0.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text('• Síndrome HELLP: Hemólisis microangiopática (esquistocitos en frotis, LDH > 600 U/L, bilirrubina indirecta > 1.2 mg/dL),', 16, yPos);
    yPos += 3.2;
    doc.text('  enzimas hepáticas elevadas (AST/ALT > 70 U/L) y plaquetas bajas (< 100,000 /mm3). Clasificación de Mississippi y Tennessee.', 18, yPos);
    yPos += 3.6;
    doc.text('• Hematoma Subcapsular Hepático y Rotura de Glisson: Dolor lacerante en hipocondrio derecho con irradiación al hombro derecho (Signo de Kehr).', 16, yPos);
    yPos += 3.2;
    doc.text('  Manejo: Laparotomía urgente, empaquetamiento hemostático perihepático con compresas (packing) y embolización angiográfica.', 18, yPos);
    yPos += 3.6;
    doc.text('• Síndrome PRES (Encefalopatía Posterior Reversible): Edema vasogénico parieto-occipital en RMN FLAIR/T2 por pérdida de autorregulación.', 16, yPos);
    yPos += 3.6;
    doc.text('• Vía Aérea Edematosa Extrema: Edema supraglótico y glótico severo (colapso a Mallampati IV). Tubo 6.0 - 6.5 mm con estilete.', 16, yPos);
    yPos += 3.2;
    doc.text('  Atenuar respuesta simpática a laringoscopia con Remifentanilo 1 μg/kg o Labetalol 20 mg para evitar hemorragia cerebral masiva.', 18, yPos);

    yPos += 7.5;

    // SECCIÓN 2: DIAGNÓSTICO DIFERENCIAL DE CEFALEA PUERPERAL
    doc.setFillColor(241, 245, 249);
    doc.rect(14, yPos - 3, 182, 23, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('🧠 2. DIAGNÓSTICO DIFERENCIAL DE CEFALEA PUERPERAL EN EL POSTOPERATORIO', 16, yPos + 0.5);

    yPos += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(51, 65, 85);
    doc.text('• Cefalea Post-Punción Dural (CPPD): Estrictamente postural (empeora al ponerse de pie, alivia al decúbito), fronto-occipital, rigidez nucal.', 16, yPos);
    yPos += 3.2;
    doc.text('• Cefalea por Preeclampsia / PRES / ACV: Constante, holocraneana, pulsátil, NO postural, asociada a escotomas y cifras tensionales altas.', 16, yPos);
    yPos += 3.2;
    doc.text('• Trombosis de Senos Venosos Durales: Cefalea progresiva o en trueno, crisis focales, papiledema. Requiere angio-RMN inmediata.', 16, yPos);

    yPos += 6.5;

    // SECCIÓN 3: ENSAYOS SEMINALES Y BIBLIOGRAFÍA OFICIAL
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos - 3, 182, 38, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('📚 3. ENSAYOS CLÍNICOS SEMINALES Y BIBLIOGRAFÍA DE REFERENCIA OFICIAL', 16, yPos + 0.5);

    yPos += 4.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text('1. The Magpie Trial Collaboration Group. Do women with pre-eclampsia benefit from magnesium sulphate? Lancet 2002; 359: 1877-90.', 16, yPos);
    yPos += 3.2;
    doc.text('2. The Eclampsia Trial Collaborative Group. Which anticonvulsant for women with eclampsia? Collaborative Eclampsia Trial. Lancet 1995; 345: 1455-63.', 16, yPos);
    yPos += 3.2;
    doc.text('3. Magee LA, et al; CHIPS Study Group. Less-tight versus tight control of hypertension in pregnancy. N Engl J Med 2015; 372: 407-417.', 16, yPos);
    yPos += 3.2;
    doc.text('4. Rolnik DL, et al; ASPRE Trial. Aspirin versus Placebo in Pregnancies at High Risk for Preterm Preeclampsia. N Engl J Med 2017; 377: 613-622.', 16, yPos);
    yPos += 3.2;
    doc.text('5. Zeisler H, et al; PROGNOSIS Study. Predictive Value of the sFlt-1:PlGF Ratio in Women with Suspected Preeclampsia. N Engl J Med 2016.', 16, yPos);
    yPos += 3.2;
    doc.text('6. SOAP Consensus Statement on Neuraxial Anesthesia and Thrombocytopenia in Obstetric Patients. Anesth Analg 2021/2026.', 16, yPos);
    yPos += 3.2;
    doc.text('7. ACOG Practice Bulletin No. 222: Gestational Hypertension and Preeclampsia. Obstet Gynecol 2020 (Reaffirmed 2026).', 16, yPos);

    yPos += 6.5;

    // SECCIÓN 4: MANIFIESTO FINAL
    doc.setFillColor(15, 23, 42);
    doc.rect(14, yPos - 3, 182, 38, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(244, 63, 94);
    doc.text('✉️ MANIFIESTO: "QUERIDO OBSTETRA, QUERIDO ANESTESIÓLOGO, QUERIDO RESIDENTE"', 18, yPos + 1.5);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(226, 232, 240);
    doc.text('La preeclampsia no es solo una cifra tensional: es una tormenta vascular endotelial capaz de desmoronar en minutos el cerebro,', 18, yPos);
    yPos += 3.2;
    doc.text('pulmones, riñones e hígado materno. Ninguna especialidad sola puede vencer la muerte materna.', 18, yPos);
    yPos += 3.2;
    doc.text('El obstetra necesita el control hemodinámico y de vía aérea del anestesiólogo. Y el anestesiólogo depende de la pericia obstétrica.', 18, yPos);
    yPos += 3.5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(56, 189, 248);
    doc.text('¡Unidos por la meta de Cero Muerte Materna Evitable! Protejamos las neuronas a tiempo y desterremos la sobrecarga ciega de sueros.', 18, yPos);
    yPos += 4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Dr. Carlos Leal • Especialista en Anestesiología y Reanimación • AnestesiaPro', 18, yPos);

    // Pie de página 5
    doc.setFontSize(6.8);
    doc.setTextColor(148, 163, 184);
    doc.text('Página 5 de 5 • AnestesiaPro • Compendio Oficial Preeclampsia • Descarga autorizada para estudio clínico y práctica médica', 14, 288);

    doc.save('AnestesiaPro_Preeclampsia_Dossier_Clinico_Dr_Carlos_Leal.pdf');
  } catch (e) {
    console.error('Error al generar PDF de preeclampsia:', e);
  }
};

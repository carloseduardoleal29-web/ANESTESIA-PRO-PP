import jsPDF from 'jspdf';

export const downloadPreeclampsiaGuidePDF = () => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page 1: Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 36, 'F');

    doc.setTextColor(244, 63, 94); // rose-500
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ANESTESIAPRO • PROTOCOLO DE ALTA COMPLEJIDAD OBSTÉTRICA', 14, 14);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.text('PREECLAMPSIA, ECLAMPSIA Y SUS COMPLICACIONES: ENFOQUE ANESTESIOLÓGICO', 14, 23);

    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Dr. Carlos Leal • Guías Actualizadas ACOG / FIGO / SOAP 2026', 14, 30);

    let y = 43;

    // Box 1: Fisiopatología
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 45, 3, 3, 'FD');
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('1. FISIOPATOLOGÍA EN DOS FASES Y DISFUNCIÓN ENDOTELIAL', 18, y + 7);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    const physioText = 
      '• Fase 1: Invasión trofoblástica defectuosa de arterias espirales uterinas -> Isquemia placentaria relativa.\n' +
      '• Fase 2: Liberación masiva de factores anti-angiogénicos (sFlt-1 y sEng) neutralizando VEGF y PlGF -> Vasoconstricción sistémica, aumento de permeabilidad capilar, edema tisular y daño endotelial multiorgánico.\n' +
      '• Impacto Anestésico: Vía aérea edematosa y friable, aumento del riesgo de colapso respiratorio e hiperreactividad hemodinámica.';
    doc.text(doc.splitTextToSize(physioText, 174), 18, y + 14);

    y += 50;

    // Box 2: Neuroprotección con Sulfato de Magnesio
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(14, 116, 144);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('2. NEUROPROTECCIÓN: SULFATO DE MAGNESIO (ESQUEMA ZUSPAN)', 18, y + 7);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    const mgText = 
      '• Mecanismo: Antagonista competitivo de calcio en terminal presináptica y bloqueo de receptores NMDA cerebrales -> Vasodilatación cerebral selectiva y prevención de crisis convulsivas.\n' +
      '• Dosis de Carga: 4 a 6 g IV infundidos en 20-30 minutos en 100 mL SSN 0.9%.\n' +
      '• Dosis de Mantenimiento: 1 a 2 g/hora en infusión continua por 24 horas postparto.\n' +
      '• Antídoto por Intoxicación: Gluconato de Calcio al 10% (1 g IV lento en 3-5 minutos).';
    doc.text(doc.splitTextToSize(mgText, 174), 18, y + 14);

    y += 53;

    // Box 3: Crisis Hipertensiva
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
    doc.roundedRect(14, y, 182, 50, 3, 3, 'FD');
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('3. MANEJO ESCALONADO DE CRISIS HIPERTENSIVA (PAS ≥ 160 o PAD ≥ 110)', 18, y + 7);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    const htaText = 
      '• Meta: Reducir cifras tensionales a 140-150 / 90-100 mmHg en los primeros 15-30 minutos para evitar hemorragia intracerebral materna sin comprometer la perfusión placentaria.\n' +
      '• 1ª Línea - Labetalol IV: 20 mg bolo inicial -> 40 mg a los 10 min -> 80 mg cada 10 min (máx 220-300 mg total).\n' +
      '• Hidralazina IV: 5-10 mg en bolo lento cada 20 min (máx 20-30 mg).\n' +
      '• Nifedipino Oral: 10-20 mg cápsula oral tragada (NUNCA sublingual).';
    doc.text(doc.splitTextToSize(htaText, 174), 18, y + 14);

    y += 55;

    // Box 4: Consideraciones de Quirófano
    doc.setFillColor(240, 253, 250);
    doc.roundedRect(14, y, 182, 48, 3, 3, 'FD');
    doc.setTextColor(13, 148, 136);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text('4. MANEJO DE LÍQUIDOS Y TÉCNICA ANESTÉSICA EN CESÁREA', 18, y + 7);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(7.8);
    doc.setFont('helvetica', 'normal');
    const orText = 
      '• Restricción Hídrica Estricta: Mantenimiento a 60-80 mL/h (evitar edema agudo de pulmón).\n' +
      '• Anestesia Espinal: De elección en ausencia de coagulopatía (Plaquetas ≥ 70.000 - 80.000/mcL con función plaquetaria y fibrinógeno normales).\n' +
      '• Anestesia General: Atenuación estricta de laringoscopia (Lidocaína 1.5 mg/kg + Fentanilo/Remifentanilo) para evitar hemorragia intracerebral.';
    doc.text(doc.splitTextToSize(orText, 174), 18, y + 14);

    // Footer
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 282, 210, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    doc.text('AnestesiaPro • Guía Oficial Preeclampsia / Eclampsia 2026 • Dr. Carlos Leal', 14, 290);

    const filename = 'Guia_Preeclampsia_Eclampsia_Enfoque_Anestesiologico_2026.pdf';
    doc.save(filename);
  } catch (e) {
    console.error('Error generando PDF preeclampsia:', e);
  }
};

import React, { useState } from 'react';
import { DoctorUser } from '../types/user';
import { jsPDF } from 'jspdf';
import { FileText, Download, CheckCircle2, User, Activity, AlertCircle } from 'lucide-react';

interface Props {
  user: DoctorUser;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  bmi: number;
  idealWeight: number;
}

export function PreAnestheticEvaluation({ user, weight, height, age, gender, bmi, idealWeight }: Props) {
  const [patientName, setPatientName] = useState('Juan Carlos Pérez');
  const [patientId, setPatientId] = useState('V-12345678');
  const [surgeryProposed, setSurgeryProposed] = useState('Colecistectomía Laparoscópica');
  const [asaClass, setAsaClass] = useState('ASA II');
  const [mallampati, setMallampati] = useState('Clase II');
  const [cormack, setCormack] = useState('Grado I');
  const [medicalHistory, setMedicalHistory] = useState('Hipertensión Arterial Controlada (Enalapril 10mg/día)');
  const [allergies, setAllergies] = useState('Sin alergias conocidas (NKDA)');
  const [fastingHours, setFastingHours] = useState(8);
  const [anestheticPlan, setAnestheticPlan] = useState('Anestesia General Balanceada TIVA / Inhalatoria + Bloqueo TAP bilateral');

  const generatePDF = () => {
    try {
      const doc = new jsPDF();

      // Banner Header
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 42, 'F');

      doc.setTextColor(56, 189, 248); // cyan-400
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('AnestesiaPro', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(226, 232, 240);
      doc.text('EVALUACIÓN PREANESTÉSICA CLÍNICA Y PLAN ANESTÉSICO', 14, 28);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')} | Especialista: Dr(a). ${user.fullName}`, 14, 35);

      // Sección 1: Datos del Paciente
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DATOS DEL PACIENTE Y ANTROPOMETRÍA', 14, 52);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Nombre Paciente: ${patientName}`, 14, 60);
      doc.text(`C.I. / Documento: ${patientId}`, 120, 60);
      doc.text(`Edad: ${age} años | Género: ${gender === 'male' ? 'Masculino' : 'Femenino'}`, 14, 67);
      doc.text(`Peso Real: ${weight} kg | Talla: ${height} cm | IMC: ${bmi} kg/m²`, 120, 67);
      doc.text(`Peso Ideal: ${idealWeight} kg | Horas de Ayuno: ${fastingHours} h`, 14, 74);

      // Sección 2: Evaluación Quirúrgica y Riesgo
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('2. EVALUACIÓN DE RIESGO Y VÍA AÉREA', 14, 88);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Cirugía Propuesta: ${surgeryProposed}`, 14, 96);
      doc.text(`Estado Físico ASA: ${asaClass}`, 14, 103);
      doc.text(`Vía Aérea - Mallampati: ${mallampati} | Cormack-Lehane: ${cormack}`, 14, 110);
      doc.text(`Antecedentes Médicos: ${medicalHistory}`, 14, 117);
      doc.text(`Alergias Medicamentosas: ${allergies}`, 14, 124);

      // Sección 3: Plan Anestésico
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('3. PLAN ANESTÉSICO PROPUESTO', 14, 138);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const planLines = doc.splitTextToSize(anestheticPlan, 180);
      doc.text(planLines, 14, 146);

      // Sección 4: Cálculo de Dosis de Inducción
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('4. DOSIFICACIÓN DE INDUCCIÓN Y RESCATE', 14, 168);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`• Propofol 1% (1.5 - 2.5 mg/kg): ${(weight * 1.5).toFixed(0)} - ${(weight * 2.5).toFixed(0)} mg IV`, 14, 176);
      doc.text(`• Fentanilo (2 - 4 mcg/kg): ${(idealWeight * 2).toFixed(0)} - ${(idealWeight * 4).toFixed(0)} mcg IV`, 14, 182);
      doc.text(`• Rocuronio (0.6 - 1.2 mg/kg): ${(weight * 0.6).toFixed(0)} - ${(weight * 1.2).toFixed(0)} mg IV`, 14, 188);
      doc.text(`• Aminofilina (CPPD Rescate): ${(weight * 1.5).toFixed(0)} mg IV lento`, 14, 194);

      // Firma
      doc.setDrawColor(203, 213, 225);
      doc.line(120, 240, 190, 240);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Dr(a). ${user.fullName}`, 120, 246);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`${user.specialty || 'Especialista en Anestesiología y Reanimación'}`, 120, 251);
      doc.text(`Licencia / C.I.: ${user.idNumber || 'Verificado'}`, 120, 256);

      // Pie
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('AnestesiaPro v2.5.0 PRO • Documento de Evaluación Preanestésica Digital.', 14, 285);

      doc.save(`Preanestesica_${patientName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('Error generando PDF:', e);
      alert('Reporte generado en pantalla.');
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">EVALUACIÓN PREANESTÉSICA DIGITAL</h3>
            <p className="text-xs text-slate-400">Genere la hoja de evaluación clínica e imprima el reporte en PDF en quirófano.</p>
          </div>
        </div>
        <button
          onClick={generatePDF}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          Descargar Informe PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo del Paciente</label>
          <input
            type="text"
            value={patientName}
            onChange={e => setPatientName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Documento de Identidad / C.I.</label>
          <input
            type="text"
            value={patientId}
            onChange={e => setPatientId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Cirugía Propuesta</label>
          <input
            type="text"
            value={surgeryProposed}
            onChange={e => setSurgeryProposed(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Clasificación ASA</label>
          <select
            value={asaClass}
            onChange={e => setAsaClass(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="ASA I">ASA I (Paciente Sano)</option>
            <option value="ASA II">ASA II (Enfermedad sistémica leve)</option>
            <option value="ASA III">ASA III (Enfermedad sistémica grave)</option>
            <option value="ASA IV">ASA IV (Amenaza constante para la vida)</option>
            <option value="ASA V">ASA V (Moribundo)</option>
            <option value="ASA E">ASA Emergencia (+E)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mallampati (Vía Aérea)</label>
          <select
            value={mallampati}
            onChange={e => setMallampati(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="Clase I">Clase I (Visión completa de úvula y pilares)</option>
            <option value="Clase II">Clase II (Visión de paladar blando y mayor parte de úvula)</option>
            <option value="Clase III">Clase III (Visión de paladar blando y base de úvula)</option>
            <option value="Clase IV">Clase IV (Solo paladar duro)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Cormack-Lehane (Glotis)</label>
          <select
            value={cormack}
            onChange={e => setCormack(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="Grado I">Grado I (Visión glótica completa)</option>
            <option value="Grado II">Grado II (Visión parcial de glotis)</option>
            <option value="Grado III">Grado III (Solo epiglotis)</option>
            <option value="Grado IV">Grado IV (Ninguna estructura glótica)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Antecedentes Patológicos & Alergias</label>
        <textarea
          rows={2}
          value={medicalHistory}
          onChange={e => setMedicalHistory(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 mb-2"
        />
        <input
          type="text"
          value={allergies}
          onChange={e => setAllergies(e.target.value)}
          placeholder="Alergias..."
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-rose-300 focus:outline-none focus:border-rose-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Plan Anestésico Recomendado</label>
        <textarea
          rows={3}
          value={anestheticPlan}
          onChange={e => setAnestheticPlan(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
      </div>
    </div>
  );
}

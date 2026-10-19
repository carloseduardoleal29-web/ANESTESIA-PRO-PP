const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 1. infografia_anestesiologia_preeclampsia.svg
const preeclampsiaOverviewSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="cardGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="hemoGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="mgGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#6d28d9" />
    </linearGradient>
    <linearGradient id="neuroGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="800" fill="url(#bgGrad)" />
  <rect x="15" y="15" width="1170" height="770" rx="20" fill="none" stroke="#334155" stroke-width="2" />

  <!-- Header Banner -->
  <g transform="translate(40, 35)">
    <rect width="1120" height="85" rx="14" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" />
    <text x="30" y="36" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="900" letter-spacing="2">CONSENSO CLÍNICO ACOG / FIGO / SOAP 2026 • DR. CARLOS LEAL</text>
    <text x="30" y="66" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="900" letter-spacing="0.5">PREECLAMPSIA Y ECLAMPSIA: ABORDAJE INTEGRAL ANESTESIOLÓGICO</text>
    <rect x="940" y="24" width="150" height="38" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
    <text x="1015" y="48" fill="#c7d2fe" font-family="system-ui, sans-serif" font-size="12" font-weight="800" text-anchor="middle">GUÍA DE ALTA PRECISIÓN</text>
  </g>

  <!-- Pillar 1: Hemodynamic Management -->
  <g transform="translate(40, 140)">
    <rect width="355" height="610" rx="16" fill="url(#cardGrad1)" stroke="#0284c7" stroke-width="2" />
    <path d="M 0 16 Q 0 0 16 0 L 339 0 Q 355 0 355 16 L 355 48 L 0 48 Z" fill="url(#hemoGrad)" />
    <text x="177" y="31" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="1">1. MANEJO HEMODINÁMICO</text>

    <!-- Content 1 -->
    <g transform="translate(20, 65)">
      <rect width="315" height="75" rx="10" fill="#0369a1" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1" />
      <text x="15" y="25" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="800">OBJETIVO TENSIONAL PRIMARIO</text>
      <text x="15" y="46" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="900">PAS: 135 - 150 | PAD: 80 - 100</text>
      <text x="15" y="64" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Evitar hipoperfusión placentaria (PAM &gt; 90 mmHg)</text>
    </g>

    <!-- Escalation Drugs -->
    <g transform="translate(20, 155)">
      <text x="5" y="15" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13" font-weight="800">TRATAMIENTO DE CRISIS (PAS ≥ 160 / PAD ≥ 110):</text>
      
      <!-- Labetalol -->
      <g transform="translate(0, 28)">
        <rect width="315" height="85" rx="8" fill="#090d16" stroke="#334155" stroke-width="1" />
        <text x="12" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="900">1ª Línea: LABETALOL IV</text>
        <text x="12" y="44" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Bolo inicial: 20 mg IV en 2 min</text>
        <text x="12" y="62" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Escalamiento c/10-20 min: 40 mg ➔ 80 mg ➔ 80 mg</text>
        <text x="12" y="78" fill="#f59e0b" font-family="system-ui, sans-serif" font-size="10" font-weight="700">Dosis máxima acumulada: 300 mg</text>
      </g>

      <!-- Hidralazina -->
      <g transform="translate(0, 125)">
        <rect width="315" height="75" rx="8" fill="#090d16" stroke="#334155" stroke-width="1" />
        <text x="12" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="900">2ª Línea: HIDRALAZINA IV</text>
        <text x="12" y="44" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">Bolo: 5 a 10 mg IV lento en 2 min</text>
        <text x="12" y="64" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Repetir 5-10 mg c/20 min (Máximo 20-30 mg)</text>
      </g>

      <!-- Nifedipino -->
      <g transform="translate(0, 212)">
        <rect width="315" height="70" rx="8" fill="#090d16" stroke="#334155" stroke-width="1" />
        <text x="12" y="24" fill="#38bdf8" font-family="system-ui, sans-serif" font-size="12" font-weight="900">Opción Oral: NIFEDIPINO LIB. INMEDIATA</text>
        <text x="12" y="44" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="11">10 mg a 20 mg vía oral (No sublingual)</text>
        <text x="12" y="62" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Repetir en 20 min si persiste PAS ≥ 160</text>
      </g>
    </g>

    <!-- Fluid Restriction -->
    <g transform="translate(20, 460)">
      <rect width="315" height="75" rx="10" fill="#0c4a6e" fill-opacity="0.3" stroke="#0ea5e9" stroke-width="1" />
      <text x="12" y="24" fill="#7dd3fc" font-family="system-ui, sans-serif" font-size="12" font-weight="900">RESTRICCIÓN HÍDRICA ESTRICTA</text>
      <text x="12" y="45" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13" font-weight="800">Infusión Total: 60 a 80 mL/hora</text>
      <text x="12" y="65" fill="#fb7185" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700">Evitar cristaloides excesivos ➔ Riesgo alto de EAP</text>
    </g>
  </g>

  <!-- Pillar 2: Magnesium Sulfate & Neuroprotection -->
  <g transform="translate(422, 140)">
    <rect width="355" height="610" rx="16" fill="url(#cardGrad1)" stroke="#8b5cf6" stroke-width="2" />
    <path d="M 0 16 Q 0 0 16 0 L 339 0 Q 355 0 355 16 L 355 48 L 0 48 Z" fill="url(#mgGrad)" />
    <text x="177" y="31" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="1">2. SULFATO DE MAGNESIO (MgSO₄)</text>

    <!-- Target Window -->
    <g transform="translate(20, 65)">
      <rect width="315" height="75" rx="10" fill="#581c87" fill-opacity="0.3" stroke="#c084fc" stroke-width="1" />
      <text x="15" y="25" fill="#c084fc" font-family="system-ui, sans-serif" font-size="12" font-weight="800">VENTANA TERAPÉUTICA MAGNESEMIA</text>
      <text x="15" y="46" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="900">4.8 a 8.4 mg/dL (2.0 a 3.5 mmol/L)</text>
      <text x="15" y="64" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">Bloqueo fisiológico del receptor NMDA cerebral</text>
    </g>

    <!-- Protocol Zuspan -->
    <g transform="translate(20, 155)">
      <text x="5" y="15" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="13" font-weight="800">PROTOCOLO DE INFUSIÓN (ZUSPAN MODIFICADO):</text>
      
      <g transform="translate(0, 28)">
        <rect width="315" height="80" rx="8" fill="#090d16" stroke="#334155" stroke-width="1" />
        <text x="12" y="24" fill="#c084fc" font-family="system-ui, sans-serif" font-size="12" font-weight="900">BOLO DE IMPREGNACIÓN</text>
        <text x="12" y="44" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12" font-weight="700">4 a 6 g IV infundidos en 15 - 20 minutos</text>
        <text x="12" y="65" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Disuelto en 100 mL de Solución Salina o Dextrosa</text>
      </g>

      <g transform="translate(0, 120)">
        <rect width="315" height="80" rx="8" fill="#090d16" stroke="#334155" stroke-width="1" />
        <text x="12" y="24" fill="#c084fc" font-family="system-ui, sans-serif" font-size="12" font-weight="900">INFUSIÓN DE MANTENIMIENTO</text>
        <text x="12" y="44" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="12" font-weight="700">1 a 2 g/hora en bomba de infusión continua</text>
        <text x="12" y="65" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="10.5">Mantener durante parto y 24 horas posparto</text>
      </g>
    </g>

    <!-- Antidote Card -->
    <g transform="translate(20, 385)">
      <rect width="315" height="150" rx="12" fill="#450a0a" fill-opacity="0.35" stroke="#f43f5e" stroke-width="1.5" />
      <text x="15" y="25" fill="#f43f5e" font-family="system-ui, sans-serif" font-size="12" font-weight="900">ANTÍDOTO EN INTOXICACIÓN</text>
      <text x="15" y="46" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="800">GLUCONATO DE CALCIO 10%</text>
      <text x="15" y="66" fill="#fecdd3" font-family="system-ui, sans-serif" font-size="11">1 g IV (1 ampolla de 10 mL) lento en 3 a 5 min</text>
      <line x1="15" y1="78" x2="300" y2="78" stroke="#f43f5e" stroke-width="0.7" stroke-dasharray="4 2" />
      <text x="15" y="96" fill="#fca5a5" font-family="system-ui, sans-serif" font-size="10.5" font-weight="700">Signos de Alarma por Hipermagnesemia:</text>
      <text x="15" y="114" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">• Pérdida reflejo rotuliano (&gt; 9 mg/dL)</text>
      <text x="15" y="130" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">• Depresión respiratoria &lt; 12 rpm (&gt; 12 mg/dL)</text>
      <text x="15" y="144" fill="#e2e8f0" font-family="system-ui, sans-serif" font-size="10">• Paro cardíaco asistólico (&gt; 25 mg/dL)</text>
    </g>
  </g>

  <!-- Pillar 3: Neuroaxial vs General Anesthesia -->
  <g transform="translate(805, 140)">
    <rect width="355" height="610" rx="16" fill="url(#cardGrad1)" stroke="#10b981" stroke-width="2" />
    <path d="M 0 16 Q 0 0 16 0 L 339 0 Q 355 0 355 16 L 355 48 L 0 48 Z" fill="url(#neuroGrad)" />
    <text x="177" y="31" fill="#ffffff" font-family="system-ui, sans-serif" font-size="15" font-weight="900" text-anchor="middle" letter-spacing="1">3. MANEJO ANESTÉSICO QUIRÚRGICO</text>

    <!-- Platelet Threshold -->
    <g transform="translate(20, 65)">
      <rect width="315" height="85" rx="10" fill="#064e3b" fill-opacity="0.3" stroke="#34d399" stroke-width="1" />
      <text x="15" y="24" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="800">UMBRAL PLAQUETARIO (SOAP 2026)</text>
      <text x="15" y="46" fill="#ffffff" font-family="system-ui, sans-serif" font-size="14" font-weight="900">≥ 70.000 /μL: ESPINAL SEGURA</text>
      <text x="15" y="64" fill="#ffffff" font-family="system-ui, sans-serif" font-size="13" font-weight="700">≥ 80.000 /μL: EPIDURAL SEGURA</text>
      <text x="15" y="78" fill="#a7f3d0" font-family="system-ui, sans-serif" font-size="10">Si plaquetas estables y coagulación normal</text>
    </g>

    <!-- Techniques Comparison -->
    <g transform="translate(20, 165)">
      <!-- Neuroaxial Preference -->
      <g transform="translate(0, 10)">
        <rect width="315" height="110" rx="8" fill="#090d16" stroke="#10b981" stroke-width="1" />
        <text x="12" y="24" fill="#34d399" font-family="system-ui, sans-serif" font-size="12" font-weight="900">ANESTESIA NEUROAXIAL (PREFERENCIA)</text>
        <text x="12" y="45" fill="#f8fafc" font-family="system-ui, sans-serif" font-size="11" font-weight="700">• Técnica de elección para cesárea urgente/electiva</text>
        <text x="12" y="65" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Bupivacaína pesada 0.5% (8-10 mg) + Fentanilo 15 mcg</text>
        <text x="12" y="85" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Reduce picos de PAS y catecolaminas circulantes</text>
        <text x="12" y="103" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Menor vasoplejía comparado con población sana</text>
      </g>

      <!-- General Anesthesia Hazards -->
      <g transform="translate(0, 135)">
        <rect width="315" height="145" rx="8" fill="#090d16" stroke="#e11d48" stroke-width="1" />
        <text x="12" y="24" fill="#fb7185" font-family="system-ui, sans-serif" font-size="12" font-weight="900">ANESTESIA GENERAL (ALTO RIESGO)</text>
        <text x="12" y="45" fill="#fda4af" font-family="system-ui, sans-serif" font-size="11" font-weight="700">Riesgos Críticos:</text>
        <text x="12" y="65" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Edema severo de vía aérea (tubo pequeño 6.0-6.5)</text>
        <text x="12" y="83" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Pico hipertensivo en laringoscopia (riesgo ACV)</text>
        <text x="12" y="101" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Inducción: Remifentanilo 1 mcg/kg o Labetalol previo</text>
        <text x="12" y="119" fill="#cbd5e1" font-family="system-ui, sans-serif" font-size="10.5">• Rocuronio 1.2 mg/kg o Succinilcolina 1 mg/kg</text>
        <text x="12" y="137" fill="#fbbf24" font-family="system-ui, sans-serif" font-size="10" font-weight="700">Tener videolaringoscopio listo de primera intención</text>
      </g>
    </g>

    <!-- Bottom Footer Tag -->
    <g transform="translate(20, 480)">
      <rect width="315" height="55" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1" />
      <text x="157" y="24" fill="#e0e7ff" font-family="system-ui, sans-serif" font-size="11" font-weight="800" text-anchor="middle">ANESTESIAPRO • MEDICINA BASADA EN EVIDENCIA</text>
      <text x="157" y="42" fill="#a5b4fc" font-family="system-ui, sans-serif" font-size="9.5" text-anchor="middle">Optimización perioperatoria de la paciente obstétrica crítica</text>
    </g>
  </g>
</svg>`;

fs.writeFileSync(path.join(imagesDir, 'infografia_anestesiologia_preeclampsia.svg'), preeclampsiaOverviewSvg);
console.log('Created infografia_anestesiologia_preeclampsia.svg');

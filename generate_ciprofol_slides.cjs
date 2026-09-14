const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images', 'ciprofol');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Slide 1: Mecanismo de Acción & Receptor GABA-A
const slide1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="gradHeader1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#818cf8" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Grid -->
  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="200" cy="150" r="300" fill="#0284c7" opacity="0.07" filter="blur(80px)"/>
  <circle cx="1000" cy="750" r="350" fill="#6366f1" opacity="0.08" filter="blur(90px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#38bdf8"/>
  <text x="95" y="85" fill="#38bdf8" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 1 • INNOVACIÓN FARMACOLÓGICA 2026</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">CIPROFOL (HSK3486): Identidad Molecular y Receptor GABA-A</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • Educación Continua</text>

  <!-- Left Card: Estructura Química y Afinidad -->
  <g transform="translate(50, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>
    <rect x="25" y="25" width="485" height="42" rx="12" fill="#0369a1" opacity="0.25"/>
    <text x="45" y="52" fill="#38bdf8" font-size="18" font-weight="800">🔬 Estructura Química y Estéreo-Selectividad</text>

    <!-- Chemical Illustration Diagram -->
    <rect x="25" y="85" width="485" height="220" rx="16" fill="#030712" stroke="#1e293b"/>
    <circle cx="267" cy="195" r="75" fill="#0f172a" stroke="#0284c7" stroke-width="2"/>
    <text x="267" y="180" fill="#38bdf8" font-size="20" font-weight="900" text-anchor="middle">Anillo Fenólico</text>
    <text x="267" y="202" fill="#cbd5e1" font-size="13" font-weight="700" text-anchor="middle">+ Núcleo Ciclopropilo</text>
    <text x="267" y="222" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">(Mayor Afinidad Estérica)</text>

    <!-- Bonds -->
    <line x1="140" y1="195" x2="192" y2="195" stroke="#38bdf8" stroke-width="3"/>
    <circle cx="130" cy="195" r="14" fill="#0284c7"/>
    <text x="130" y="200" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">OH</text>

    <line x1="342" y1="195" x2="400" y2="195" stroke="#818cf8" stroke-width="3"/>
    <polygon points="405,195 440,175 440,215" fill="#6366f1" stroke="#818cf8" stroke-width="2"/>
    <text x="455" y="200" fill="#c7d2fe" font-size="11" font-weight="800">Ciclopropil</text>

    <text x="45" y="335" fill="#ffffff" font-size="17" font-weight="800">Características Moleculares Diferenciales:</text>
    
    <!-- Bullet 1 -->
    <circle cx="45" cy="375" r="6" fill="#38bdf8"/>
    <text x="65" y="380" fill="#f1f5f9" font-size="14" font-weight="700">Derivado alquilfenol con sustitución de ciclopropilo.</text>
    <text x="65" y="400" fill="#94a3b8" font-size="13">Aumenta la restricción conformacional e incrementa la afinidad.</text>

    <!-- Bullet 2 -->
    <circle cx="45" cy="440" r="6" fill="#34d399"/>
    <text x="65" y="445" fill="#f1f5f9" font-size="14" font-weight="700">Afinidad por GABA-A 4 a 5 veces superior a Propofol.</text>
    <text x="65" y="465" fill="#94a3b8" font-size="13">Logra el mismo efecto hipnótico con 1/4 - 1/5 de masa molar.</text>

    <!-- Bullet 3 -->
    <circle cx="45" cy="505" r="6" fill="#a78bfa"/>
    <text x="65" y="510" fill="#f1f5f9" font-size="14" font-weight="700">Mayor selectividad sobre subunidades β2 y β3.</text>
    <text x="65" y="530" fill="#94a3b8" font-size="13">Genera hipnosis profunda con menor bloqueo inespecífico.</text>

    <!-- Mini Alert Box -->
    <rect x="25" y="565" width="485" height="90" rx="14" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
    <text x="45" y="595" fill="#a5b4fc" font-size="13" font-weight="900">💡 PERLA CLÍNICA DEL ANESTESIÓLOGO:</text>
    <text x="45" y="620" fill="#e0e7ff" font-size="13" font-weight="500">Al requerir menor concentración plasmática libre (Cp), disminuye</text>
    <text x="45" y="640" fill="#e0e7ff" font-size="13" font-weight="500">drásticamente el impacto cardiodepresor y la vasodilatación sistémica.</text>
  </g>

  <!-- Right Card: Dinámica en Receptor GABA-A y Canal de Cloro -->
  <g transform="translate(615, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>
    <rect x="25" y="25" width="485" height="42" rx="12" fill="#047857" opacity="0.25"/>
    <text x="45" y="52" fill="#34d399" font-size="18" font-weight="800">⚡ Modulación Alostérica Positiva del Poro GABA-A</text>

    <!-- Receptor Diagram -->
    <rect x="25" y="85" width="485" height="220" rx="16" fill="#030712" stroke="#1e293b"/>
    
    <!-- Membrane -->
    <rect x="40" y="170" width="455" height="25" rx="6" fill="#334155" opacity="0.6"/>
    <text x="55" y="187" fill="#64748b" font-size="10" font-weight="700">MEMBRANA NEURONAL</text>

    <!-- Ion Channel -->
    <rect x="190" y="115" width="45" height="135" rx="8" fill="#0284c7"/>
    <rect x="300" y="115" width="45" height="135" rx="8" fill="#0284c7"/>
    <text x="212" y="185" fill="#ffffff" font-size="13" font-weight="900">β3</text>
    <text x="322" y="185" fill="#ffffff" font-size="13" font-weight="900">α1</text>

    <!-- Cl- Ion Flow -->
    <line x1="267" y1="100" x2="267" y2="265" stroke="#34d399" stroke-width="4" stroke-dasharray="6,4"/>
    <polygon points="267,275 258,260 276,260" fill="#34d399"/>
    <circle cx="267" cy="105" r="14" fill="#065f46" stroke="#34d399" stroke-width="2"/>
    <text x="267" y="110" fill="#34d399" font-size="11" font-weight="900" text-anchor="middle">Cl⁻</text>
    <text x="267" y="145" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">Hiperpolarización</text>

    <!-- Ciprofol Binding Molecule -->
    <circle cx="170" cy="140" r="18" fill="#f59e0b" stroke="#fde68a" stroke-width="2" filter="url(#glow)"/>
    <text x="170" y="145" fill="#000000" font-size="11" font-weight="900" text-anchor="middle">HSK</text>
    <line x1="170" y1="160" x2="190" y2="175" stroke="#f59e0b" stroke-width="2"/>

    <text x="45" y="335" fill="#ffffff" font-size="17" font-weight="800">Efectos Neurofisiológicos Centrales:</text>

    <g transform="translate(45, 360)">
      <rect width="445" height="60" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="26" fill="#38bdf8" font-size="13" font-weight="800">1. Apertura Prolongada del Canal Cl⁻</text>
      <text x="18" y="47" fill="#94a3b8" font-size="12">Incrementa la conductancia postsináptica inhibitoria en corteza y tálamo.</text>
    </g>

    <g transform="translate(45, 435)">
      <rect width="445" height="60" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="26" fill="#34d399" font-size="13" font-weight="800">2. Supresión Rápida de Consciencia (BIS &lt; 40)</text>
      <text x="18" y="47" fill="#94a3b8" font-size="12">Inducción hipnótica en 45-60 segundos tras el bolo endovenoso.</text>
    </g>

    <g transform="translate(45, 510)">
      <rect width="445" height="60" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="26" fill="#fbbf24" font-size="13" font-weight="800">3. Recuperación Suave y Predecible</text>
      <text x="18" y="47" fill="#94a3b8" font-size="12">Despertar límpido sin delirio de emergencia, con orientación inmediata.</text>
    </g>

    <rect x="25" y="595" width="485" height="60" rx="12" fill="#064e3b" stroke="#059669" stroke-width="1.5"/>
    <text x="45" y="622" fill="#a7f3d0" font-size="13" font-weight="900">✅ CONFORMIDAD FARMACOLÓGICA:</text>
    <text x="45" y="642" fill="#ffffff" font-size="12">Mismo perfil hipnótico confiable de Propofol con una ventana de seguridad superior.</text>
  </g>
</svg>`;

// Slide 2: Farmacocinética y Farmacodinamia (PK/PD)
const slide2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="300" cy="200" r="320" fill="#10b981" opacity="0.06" filter="blur(80px)"/>
  <circle cx="950" cy="700" r="300" fill="#0284c7" opacity="0.07" filter="blur(80px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad2)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#34d399"/>
  <text x="95" y="85" fill="#34d399" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 2 • PARÁMETROS FARMACOCINÉTICOS Y METABOLISMO</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">CIPROFOL: Farmacocinética de 3 Compartimentos y Aclaramiento</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • TIVA &amp; PK/PD</text>

  <!-- Left: 4 Metric Cards -->
  <g transform="translate(50, 165)">
    <!-- Box 1 -->
    <rect x="0" y="0" width="255" height="155" rx="16" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="38" fill="#94a3b8" font-size="13" font-weight="800">POTENCIA RELATIVA</text>
    <text x="25" y="88" fill="#38bdf8" font-size="44" font-weight="900">4-5 x</text>
    <text x="25" y="125" fill="#cbd5e1" font-size="13">Vs. Propofol (1 mg = 4-5 mg Prop)</text>

    <!-- Box 2 -->
    <rect x="280" y="0" width="255" height="155" rx="16" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="305" y="38" fill="#94a3b8" font-size="13" font-weight="800">LATENCIA DE ACCIÓN</text>
    <text x="305" y="88" fill="#34d399" font-size="44" font-weight="900">45-60 s</text>
    <text x="305" y="125" fill="#cbd5e1" font-size="13">Pérdida del reflejo palpebral</text>

    <!-- Box 3 -->
    <rect x="0" y="180" width="255" height="155" rx="16" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="218" fill="#94a3b8" font-size="13" font-weight="800">ACLARAMIENTO (Cl)</text>
    <text x="25" y="268" fill="#fbbf24" font-size="40" font-weight="900">1.8 L/min</text>
    <text x="25" y="305" fill="#cbd5e1" font-size="13">Elevado aclaramiento hepático</text>

    <!-- Box 4 -->
    <rect x="280" y="180" width="255" height="155" rx="16" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="305" y="218" fill="#94a3b8" font-size="13" font-weight="800">VOLUMEN DISTRIB. (Vss)</text>
    <text x="305" y="268" fill="#a78bfa" font-size="40" font-weight="900">140-180 L</text>
    <text x="305" y="305" fill="#cbd5e1" font-size="13">Amplia distribución tisular lipofílica</text>

    <!-- Detailed PK Table Card -->
    <rect x="0" y="360" width="535" height="320" rx="16" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="25" y="395" fill="#ffffff" font-size="17" font-weight="800">Metabolismo y Eliminación Orgánica</text>
    
    <g transform="translate(25, 420)">
      <rect width="485" height="65" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="28" fill="#38bdf8" font-size="14" font-weight="800">Glucuronidación Hepática Predominante</text>
      <text x="18" y="50" fill="#94a3b8" font-size="12">Vía principal: UGT1A9 (metabolito inactivo Ciprofol-glucurónido M4).</text>
    </g>

    <g transform="translate(25, 500)">
      <rect width="485" height="65" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="28" fill="#34d399" font-size="14" font-weight="800">Excreción Renal de Metabolitos Inactivos</text>
      <text x="18" y="50" fill="#94a3b8" font-size="12">&gt;85% excretado en orina como glucurónido hidrosoluble no tóxico.</text>
    </g>

    <g transform="translate(25, 580)">
      <rect width="485" height="75" rx="10" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="28" fill="#fbbf24" font-size="14" font-weight="800">Semivida Contexto-Sensible (CSHT)</text>
      <text x="18" y="50" fill="#94a3b8" font-size="12">Permanece corta (&lt;15 min) tras infusiones continuas de 2 a 4 horas,</text>
      <text x="18" y="66" fill="#cbd5e1" font-size="11">asegurando extubación rápida en quirófano.</text>
    </g>
  </g>

  <!-- Right: PK Curve Graph -->
  <g transform="translate(615, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad2)" stroke="#334155" stroke-width="1.5"/>
    <text x="35" y="45" fill="#38bdf8" font-size="18" font-weight="800">📈 Curva de Concentración Plasmática vs Tiempo</text>

    <!-- Graph Canvas -->
    <rect x="35" y="70" width="465" height="310" rx="14" fill="#030712" stroke="#1e293b"/>
    
    <!-- Axis -->
    <line x1="75" y1="330" x2="465" y2="330" stroke="#475569" stroke-width="2"/>
    <line x1="75" y1="105" x2="75" y2="330" stroke="#475569" stroke-width="2"/>
    <text x="465" y="355" fill="#64748b" font-size="11" font-weight="700" text-anchor="end">Tiempo (minutos)</text>
    <text x="65" y="100" fill="#64748b" font-size="11" font-weight="700">Cp (µg/mL)</text>

    <!-- Threshold Guide Line -->
    <line x1="75" y1="260" x2="465" y2="260" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="455" y="252" fill="#f87171" font-size="10" font-weight="800" text-anchor="end">Umbral de Despertar (Cp &lt; 0.15 µg/mL)</text>

    <!-- Ciprofol Curve (Sharp drop, steady recovery) -->
    <path d="M 75,120 C 95,140 140,240 210,270 C 270,290 380,310 460,320" fill="none" stroke="#38bdf8" stroke-width="4"/>
    <circle cx="75" cy="120" r="5" fill="#38bdf8"/>
    <text x="90" y="135" fill="#38bdf8" font-size="12" font-weight="900">Bolo IV (0.4 mg/kg)</text>

    <!-- Bis Graph Indicator -->
    <circle cx="210" cy="270" r="6" fill="#34d399"/>
    <text x="220" y="275" fill="#34d399" font-size="11" font-weight="800">Despertar a los ~8-12 min</text>

    <!-- Summary Highlights -->
    <rect x="35" y="405" width="465" height="245" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="435" fill="#ffffff" font-size="16" font-weight="800">Ventajas de la Cinética de Ciprofol:</text>

    <text x="55" y="475" fill="#38bdf8" font-size="14" font-weight="700">✓ Distribución Rápida Tridimensional:</text>
    <text x="55" y="495" fill="#94a3b8" font-size="13">Equilibrio plasma-efecto (t1/2ke0) de tan solo 1.5 a 2 minutos.</text>

    <text x="55" y="535" fill="#34d399" font-size="14" font-weight="700">✓ No genera Acumulación Tisular Excesiva:</text>
    <text x="55" y="555" fill="#94a3b8" font-size="13">Menor saturación del compartimento periférico profundo.</text>

    <text x="55" y="595" fill="#fbbf24" font-size="14" font-weight="700">✓ Rápido Aclaramiento Metabólico:</text>
    <text x="55" y="615" fill="#94a3b8" font-size="13">Evita la resedación en la Unidad de Cuidados Postanestésicos (URPA).</text>
  </g>
</svg>`;

// Slide 3: Dosificación Clínica en Anestesia General y Sedación
const slide3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="250" cy="180" r="300" fill="#6366f1" opacity="0.08" filter="blur(80px)"/>
  <circle cx="950" cy="720" r="320" fill="#06b6d4" opacity="0.08" filter="blur(80px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad3)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#818cf8"/>
  <text x="95" y="85" fill="#a5b4fc" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 3 • PROTOCOLO TERAPÉUTICO Y GUÍA DE ADMINISTRACIÓN</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">DOSIFICACIÓN CLÍNICA: Inducción, Mantenimiento y Sedación</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • Guía Oficial</text>

  <!-- Card 1: Inducción Anestesia General -->
  <g transform="translate(50, 165)">
    <rect width="350" height="680" rx="18" fill="url(#cardGrad3)" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="20" y="20" width="310" height="42" rx="10" fill="#0284c7" opacity="0.25"/>
    <text x="35" y="47" fill="#38bdf8" font-size="16" font-weight="800">1. INDUCCIÓN GENERAL</text>

    <!-- Big Dose Pill -->
    <rect x="20" y="80" width="310" height="95" rx="14" fill="#030712" stroke="#1e293b"/>
    <text x="35" y="112" fill="#94a3b8" font-size="12" font-weight="700">DOSIS BOLO INICIAL IV:</text>
    <text x="35" y="152" fill="#38bdf8" font-size="34" font-weight="900">0.4 - 0.5 <tspan font-size="18" fill="#94a3b8">mg/kg</tspan></text>

    <text x="25" y="210" fill="#ffffff" font-size="14" font-weight="800">Modo de Administración:</text>
    <text x="25" y="235" fill="#cbd5e1" font-size="13">• Infundir en 30 a 60 segundos.</text>
    <text x="25" y="260" fill="#cbd5e1" font-size="13">• Paciente anciano o ASA III-IV:</text>
    <text x="40" y="285" fill="#facc15" font-size="13" font-weight="800">Reducir a 0.2 - 0.3 mg/kg.</text>

    <text x="25" y="330" fill="#ffffff" font-size="14" font-weight="800">Asociación Coadyuvante:</text>
    <text x="25" y="355" fill="#94a3b8" font-size="13">Fentanilo 2-3 µg/kg o Remifentanilo</text>
    <text x="25" y="375" fill="#94a3b8" font-size="13">0.25-0.5 µg/kg/min + Rocuronio.</text>

    <rect x="20" y="420" width="310" height="230" rx="12" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="450" fill="#34d399" font-size="13" font-weight="800">Objetivos Neurofisiológicos:</text>
    <text x="35" y="480" fill="#cbd5e1" font-size="13">✓ Pérdida de reflejos en 45-60 s</text>
    <text x="35" y="510" fill="#cbd5e1" font-size="13">✓ BIS de inducción entre 40 - 55</text>
    <text x="35" y="540" fill="#cbd5e1" font-size="13">✓ Condiciones óptimas de intubación</text>
    <text x="35" y="570" fill="#cbd5e1" font-size="13">✓ Excelente relajación mandibular</text>
    <text x="35" y="615" fill="#38bdf8" font-size="12" font-weight="700">Sin caída brusca de la TAM (&gt;65 mmHg)</text>
  </g>

  <!-- Card 2: Mantenimiento TIVA / Infusión Continua -->
  <g transform="translate(425, 165)">
    <rect width="350" height="680" rx="18" fill="url(#cardGrad3)" stroke="#818cf8" stroke-width="1.5"/>
    <rect x="20" y="20" width="310" height="42" rx="10" fill="#4338ca" opacity="0.25"/>
    <text x="35" y="47" fill="#a5b4fc" font-size="16" font-weight="800">2. MANTENIMIENTO TIVA</text>

    <!-- Big Dose Pill -->
    <rect x="20" y="80" width="310" height="95" rx="14" fill="#030712" stroke="#1e293b"/>
    <text x="35" y="112" fill="#94a3b8" font-size="12" font-weight="700">INFUSIÓN CONTINUA:</text>
    <text x="35" y="152" fill="#a5b4fc" font-size="34" font-weight="900">0.8 - 1.5 <tspan font-size="18" fill="#94a3b8">mg/kg/h</tspan></text>

    <text x="25" y="210" fill="#ffffff" font-size="14" font-weight="800">Rango de Titulación:</text>
    <text x="25" y="235" fill="#cbd5e1" font-size="13">• Inicio tras inducción: 1.2 mg/kg/h.</text>
    <text x="25" y="260" fill="#cbd5e1" font-size="13">• Titular según BIS (meta 40-60).</text>
    <text x="25" y="285" fill="#cbd5e1" font-size="13">• Disminuir a 0.8 mg/kg/h al cierre.</text>

    <text x="25" y="330" fill="#ffffff" font-size="14" font-weight="800">Equivalencia vs Propofol:</text>
    <text x="25" y="355" fill="#94a3b8" font-size="13">Equivale a 4 - 8 mg/kg/h de Propofol</text>
    <text x="25" y="375" fill="#94a3b8" font-size="13">con volumen lipídico reducido al 20%.</text>

    <rect x="20" y="420" width="310" height="230" rx="12" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="450" fill="#a5b4fc" font-size="13" font-weight="800">Ventajas en Cirugías Largas:</text>
    <text x="35" y="480" fill="#cbd5e1" font-size="13">✓ Menor carga de triglicéridos</text>
    <text x="35" y="510" fill="#cbd5e1" font-size="13">✓ Cero riesgo de síndrome PRIS</text>
    <text x="35" y="540" fill="#cbd5e1" font-size="13">✓ Estabilidad hemodinámica estable</text>
    <text x="35" y="570" fill="#cbd5e1" font-size="13">✓ Despertar en 6 a 10 minutos</text>
    <text x="35" y="615" fill="#34d399" font-size="12" font-weight="700">Sin náuseas ni vómitos postoperatorios</text>
  </g>

  <!-- Card 3: Sedación Diagnóstica y Endoscopias -->
  <g transform="translate(800, 165)">
    <rect width="350" height="680" rx="18" fill="url(#cardGrad3)" stroke="#34d399" stroke-width="1.5"/>
    <rect x="20" y="20" width="310" height="42" rx="10" fill="#065f46" opacity="0.25"/>
    <text x="35" y="47" fill="#34d399" font-size="16" font-weight="800">3. SEDACIÓN PROCEDIMIENTOS</text>

    <!-- Big Dose Pill -->
    <rect x="20" y="80" width="310" height="95" rx="14" fill="#030712" stroke="#1e293b"/>
    <text x="35" y="112" fill="#94a3b8" font-size="12" font-weight="700">DOSIS INICIAL SEDACIÓN:</text>
    <text x="35" y="152" fill="#34d399" font-size="34" font-weight="900">0.2 - 0.4 <tspan font-size="18" fill="#94a3b8">mg/kg</tspan></text>

    <text x="25" y="210" fill="#ffffff" font-size="14" font-weight="800">Bolos de Rescate si Requiere:</text>
    <text x="25" y="235" fill="#cbd5e1" font-size="13">• 0.1 a 0.2 mg/kg cada 2-3 min.</text>
    <text x="25" y="260" fill="#cbd5e1" font-size="13">• Máximo recomendado en sesión:</text>
    <text x="40" y="285" fill="#facc15" font-size="13" font-weight="800">Hasta 1.0 - 1.2 mg/kg total.</text>

    <text x="25" y="330" fill="#ffffff" font-size="14" font-weight="800">Indicaciones de Elección:</text>
    <text x="25" y="355" fill="#94a3b8" font-size="13">Endoscopia digestiva alta, Colonoscopia,</text>
    <text x="25" y="375" fill="#94a3b8" font-size="13">Broncoscopia, CPRE y Resonancia.</text>

    <rect x="20" y="420" width="310" height="230" rx="12" fill="#0f172a" stroke="#1e293b"/>
    <text x="35" y="450" fill="#34d399" font-size="13" font-weight="800">Seguridad en Ambulatorio:</text>
    <text x="35" y="480" fill="#cbd5e1" font-size="13">✓ Ventilación espontánea preservada</text>
    <text x="35" y="510" fill="#cbd5e1" font-size="13">✓ Mínima depresión respiratoria (&lt;3%)</text>
    <text x="35" y="540" fill="#cbd5e1" font-size="13">✓ Satisfacción del paciente &gt;98%</text>
    <text x="35" y="570" fill="#cbd5e1" font-size="13">✓ Criterios de alta Aldrete 10 rápido</text>
    <text x="35" y="615" fill="#facc15" font-size="12" font-weight="700">Ideal en pacientes ancianos frágiles</text>
  </g>
</svg>`;

// Slide 4: Estabilidad Hemodinámica y Cardiovascular
const slide4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="cardGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="200" cy="250" r="300" fill="#ef4444" opacity="0.06" filter="blur(80px)"/>
  <circle cx="1000" cy="700" r="300" fill="#10b981" opacity="0.07" filter="blur(80px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad4)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#f87171"/>
  <text x="95" y="85" fill="#f87171" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 4 • SEGURIDAD CARDIOVASCULAR Y HEMODINAMIA</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">ESTABILIDAD HEMODINÁMICA: Menor Hipotensión y Colapso</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • Hemodinamia</text>

  <!-- Left: Comparison Bars -->
  <g transform="translate(50, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad4)" stroke="#334155" stroke-width="1.5"/>
    <text x="35" y="45" fill="#ffffff" font-size="18" font-weight="800">Comparación de Caída Tensional en Inducción</text>

    <!-- Bar Chart -->
    <rect x="35" y="70" width="465" height="260" rx="14" fill="#030712" stroke="#1e293b"/>

    <text x="60" y="105" fill="#94a3b8" font-size="13" font-weight="700">Incidencia de Hipotensión Arterial (TAM &lt; 65 mmHg):</text>

    <!-- Propofol Bar -->
    <text x="60" y="145" fill="#f87171" font-size="13" font-weight="800">Propofol (2.0 mg/kg): 38.5%</text>
    <rect x="60" y="155" width="400" height="28" rx="8" fill="#1e293b"/>
    <rect x="60" y="155" width="280" height="28" rx="8" fill="#ef4444"/>
    <text x="350" y="174" fill="#ffffff" font-size="12" font-weight="900">~38.5%</text>

    <!-- Ciprofol Bar -->
    <text x="60" y="225" fill="#34d399" font-size="13" font-weight="800">Ciprofol (0.4 mg/kg): 12.8% (-66% de reducción)</text>
    <rect x="60" y="235" width="400" height="28" rx="8" fill="#1e293b"/>
    <rect x="60" y="235" width="95" height="28" rx="8" fill="#10b981"/>
    <text x="165" y="254" fill="#ffffff" font-size="12" font-weight="900">~12.8%</text>

    <text x="60" y="300" fill="#94a3b8" font-size="11">Diferencia estadísticamente significativa (p &lt; 0.001) en ensayos fase III.</text>

    <!-- Bullet Points -->
    <g transform="translate(35, 350)">
      <rect width="465" height="85" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="30" fill="#38bdf8" font-size="14" font-weight="800">Preservación del Tono Vascular y RVS</text>
      <text x="18" y="55" fill="#94a3b8" font-size="12">Menor inhibición simpática central directa sobre el centro vasomotor</text>
      <text x="18" y="72" fill="#94a3b8" font-size="12">y menor relajación del músculo liso vascular arterial periférico.</text>
    </g>

    <g transform="translate(35, 450)">
      <rect width="465" height="85" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="30" fill="#34d399" font-size="14" font-weight="800">Menor Requerimiento de Vasopresores</text>
      <text x="18" y="55" fill="#94a3b8" font-size="12">Reduce en más del 50% la necesidad de bolos de rescate con</text>
      <text x="18" y="72" fill="#cbd5e1" font-size="12">Efedrina o Fenilefrina en la inducción.</text>
    </g>

    <g transform="translate(35, 550)">
      <rect width="465" height="95" rx="12" fill="#0f172a" stroke="#1e293b"/>
      <text x="18" y="30" fill="#fbbf24" font-size="14" font-weight="800">Estabilidad del Gasto Cardíaco y Frecuencia</text>
      <text x="18" y="55" fill="#94a3b8" font-size="12">No atenúa el barorreflejo con la severidad observada en propofol,</text>
      <text x="18" y="72" fill="#cbd5e1" font-size="12">evitando episodios de bradicardia severa asociada a opioides.</text>
    </g>
  </g>

  <!-- Right: Cardiovascular Mechanism Details -->
  <g transform="translate(615, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad4)" stroke="#334155" stroke-width="1.5"/>
    <text x="35" y="45" fill="#38bdf8" font-size="18" font-weight="800">Impacto en Poblaciones Quirúrgicas Especiales</text>

    <!-- Card A -->
    <rect x="35" y="70" width="465" height="135" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="102" fill="#34d399" font-size="15" font-weight="800">👴 Paciente Anciano y Fragilidad Clínica (ASA III-IV)</text>
    <text x="55" y="128" fill="#cbd5e1" font-size="13">La compliance arterial reducida y la reserva miocárdica límite</text>
    <text x="55" y="148" fill="#cbd5e1" font-size="13">hacen de Ciprofol un agente ideal, reduciendo el riesgo de</text>
    <text x="55" y="168" fill="#34d399" font-size="13" font-weight="700">hipoperfusión coronaria y cerebral perioperatoria.</text>

    <!-- Card B -->
    <rect x="35" y="225" width="465" height="135" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="257" fill="#38bdf8" font-size="15" font-weight="800">🫀 Cirugía Cardiovascular y Paciente Cardiópata</text>
    <text x="55" y="283" fill="#cbd5e1" font-size="13">Mantiene la presión de perfusión coronaria (PPC = PAD - PFDVI)</text>
    <text x="55" y="303" fill="#cbd5e1" font-size="13">sin inducir depresión inotrópica negativa marcada en el</text>
    <text x="55" y="323" fill="#38bdf8" font-size="13" font-weight="700">ventrículo izquierdo disfuncionante.</text>

    <!-- Card C -->
    <rect x="35" y="380" width="465" height="135" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="412" fill="#fbbf24" font-size="15" font-weight="800">🧠 Neuroanestesia y Presión de Perfusión Cerebral (PPC)</text>
    <text x="55" y="438" fill="#cbd5e1" font-size="13">Conserva el acoplamiento flujo-metabolismo (CMR/CBF)</text>
    <text x="55" y="458" fill="#cbd5e1" font-size="13">disminuyendo la PIC sin comprometer la PPC por hipotensión</text>
    <text x="55" y="478" fill="#fbbf24" font-size="13" font-weight="700">arterial sistémica no deseada.</text>

    <!-- Clinical Takeaway Box -->
    <rect x="35" y="535" width="465" height="115" rx="14" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
    <text x="55" y="568" fill="#a5b4fc" font-size="14" font-weight="900">🛡️ MENSAJE CLAVE PARA LA PRÁCTICA DIARIA:</text>
    <text x="55" y="595" fill="#e0e7ff" font-size="13">Ciprofol ofrece la velocidad y confiabilidad hipnótica de propofol,</text>
    <text x="55" y="618" fill="#e0e7ff" font-size="13">pero con un margen de estabilidad hemodinámica cercano al etomidato.</text>
  </g>
</svg>`;

// Slide 5: Tolerancia Venosa y Supresión del Dolor a la Inyección
const slide5 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="cardGrad5" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="250" cy="200" r="300" fill="#0284c7" opacity="0.06" filter="blur(80px)"/>
  <circle cx="950" cy="720" r="320" fill="#8b5cf6" opacity="0.07" filter="blur(80px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad5)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#38bdf8"/>
  <text x="95" y="85" fill="#38bdf8" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 5 • EXPERIENCIA DEL PACIENTE Y CONFORT VENOSO</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">DOLOR A LA INYECCIÓN: Erradicación del Efecto Irritante</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • Confort Clínico</text>

  <!-- Left: Big Number Comparison -->
  <g transform="translate(50, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad5)" stroke="#334155" stroke-width="1.5"/>
    <text x="35" y="45" fill="#ffffff" font-size="18" font-weight="800">Incidencia de Dolor a la Inyección Venosa</text>

    <!-- Comparison Big Cards -->
    <rect x="35" y="70" width="465" height="160" rx="16" fill="#030712" stroke="#ef4444"/>
    <text x="60" y="105" fill="#f87171" font-size="14" font-weight="800">PROPOFOL TRADICIONAL 1%</text>
    <text x="60" y="165" fill="#ef4444" font-size="52" font-weight="900">60 - 80%</text>
    <text x="60" y="205" fill="#cbd5e1" font-size="13">Dolor moderado a severo en dorso de la mano</text>

    <rect x="35" y="250" width="465" height="160" rx="16" fill="#030712" stroke="#10b981"/>
    <text x="60" y="285" fill="#34d399" font-size="14" font-weight="800">CIPROFOL (HSK3486)</text>
    <text x="60" y="345" fill="#10b981" font-size="52" font-weight="900">&lt; 5 - 8%</text>
    <text x="60" y="385" fill="#cbd5e1" font-size="13">Prácticamente indoloro, sin necesidad de Lidocaína previa</text>

    <g transform="translate(35, 435)">
      <rect width="465" height="210" rx="14" fill="#0f172a" stroke="#1e293b"/>
      <text x="20" y="35" fill="#38bdf8" font-size="15" font-weight="800">¿Por Qué Ciprofol NO Provoca Dolor?</text>

      <circle cx="25" cy="70" r="5" fill="#38bdf8"/>
      <text x="40" y="75" fill="#ffffff" font-size="13" font-weight="700">1. Menor Concentración de Fármaco Libre en Fase Acuosa</text>
      <text x="40" y="95" fill="#94a3b8" font-size="12">Al ser 4-5 veces más potente, la masa emulsionada es mucho menor.</text>

      <circle cx="25" cy="120" r="5" fill="#34d399"/>
      <text x="40" y="125" fill="#ffffff" font-size="13" font-weight="700">2. No Activa Receptores TRPV1 ni Bradicinina Venosa</text>
      <text x="40" y="145" fill="#94a3b8" font-size="12">No irrita las terminaciones nerviosas nociceptivas del endotelio venoso.</text>

      <circle cx="25" cy="170" r="5" fill="#a78bfa"/>
      <text x="40" y="175" fill="#ffffff" font-size="13" font-weight="700">3. Menor Formación de Emulsión Lipídica Agresiva</text>
      <text x="40" y="195" fill="#94a3b8" font-size="12">Solución isotónica con perfil óptimo de pH y osmolaridad fisiológica.</text>
    </g>
  </g>

  <!-- Right: Clinical Perks -->
  <g transform="translate(615, 165)">
    <rect width="535" height="680" rx="20" fill="url(#cardGrad5)" stroke="#334155" stroke-width="1.5"/>
    <text x="35" y="45" fill="#38bdf8" font-size="18" font-weight="800">Ventajas Prácticas en el Acto Anestésico</text>

    <!-- Advantage 1 -->
    <rect x="35" y="70" width="465" height="120" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="100" fill="#34d399" font-size="15" font-weight="800">🚫 Eliminación de la Pre-medicación con Lidocaína</text>
    <text x="55" y="125" fill="#cbd5e1" font-size="13">Ahorra pasos en la inducción anestésica rápida, evita toxicidad</text>
    <text x="55" y="145" fill="#cbd5e1" font-size="13">por anestésicos locales y agiliza el flujo de trabajo en quirófano.</text>

    <!-- Advantage 2 -->
    <rect x="35" y="210" width="465" height="120" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="240" fill="#38bdf8" font-size="15" font-weight="800">😌 Inducción Plácida Sin Movimientos Involuntarios</text>
    <text x="55" y="265" fill="#cbd5e1" font-size="13">El paciente no retira bruscamente el brazo ni sufre agitación</text>
    <text x="55" y="285" fill="#cbd5e1" font-size="13">o taquicardia refleja reactiva al dolor durante la inducción.</text>

    <!-- Advantage 3 -->
    <rect x="35" y="350" width="465" height="120" rx="14" fill="#0f172a" stroke="#1e293b"/>
    <text x="55" y="380" fill="#fbbf24" font-size="15" font-weight="800">💉 Vías Periféricas de Menor Calibre (20G - 22G)</text>
    <text x="55" y="405" fill="#cbd5e1" font-size="13">Excelente tolerancia incluso en venas finas de dorso de mano</text>
    <text x="55" y="425" fill="#cbd5e1" font-size="13">o antebrazo en procedimientos ambulatorios y ancianos.</text>

    <!-- Final Quote Box -->
    <rect x="35" y="495" width="465" height="150" rx="14" fill="#064e3b" stroke="#059669" stroke-width="1.5"/>
    <text x="55" y="530" fill="#a7f3d0" font-size="14" font-weight="900">🌟 IMPACTO DIRECTO EN CALIDAD ASISTENCIAL:</text>
    <text x="55" y="560" fill="#ffffff" font-size="13">El recuerdo del dolor a la inyección es una de las quejas más</text>
    <text x="55" y="582" fill="#ffffff" font-size="13">frecuentes de los pacientes sometidos a anestesia con Propofol.</text>
    <text x="55" y="610" fill="#34d399" font-size="13" font-weight="700">Ciprofol transforma la experiencia anestésica hacia una inducción placentera.</text>
  </g>
</svg>`;

// Slide 6: Cuadro Comparativo Global Ciprofol vs Propofol
const slide6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" width="1200" height="900" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <defs>
    <linearGradient id="cardGrad6" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>

  <rect width="1200" height="900" fill="#090d16"/>
  <circle cx="200" cy="180" r="300" fill="#0284c7" opacity="0.06" filter="blur(80px)"/>
  <circle cx="1000" cy="720" r="320" fill="#10b981" opacity="0.06" filter="blur(80px)"/>

  <!-- Top Banner -->
  <rect x="50" y="40" width="1100" height="100" rx="20" fill="url(#cardGrad6)" stroke="#1e3a5f" stroke-width="1.5"/>
  <rect x="70" y="58" width="6" height="64" rx="3" fill="#34d399"/>
  <text x="95" y="85" fill="#34d399" font-size="14" font-weight="900" letter-spacing="2">LÁMINA 6 • SÍNTESIS CLÍNICA Y COMPARATIVA INTEGRAL</text>
  <text x="95" y="118" fill="#ffffff" font-size="28" font-weight="900">CUADRO COMPARATIVO: Ciprofol (HSK3486) vs Propofol</text>
  <text x="1120" y="85" fill="#94a3b8" font-size="13" font-weight="700" text-anchor="end">Dr. Carlos Leal</text>
  <text x="1120" y="105" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="end">AnestesiaPro • Consenso 2026</text>

  <!-- Table Container -->
  <g transform="translate(50, 165)">
    <rect width="1100" height="540" rx="18" fill="url(#cardGrad6)" stroke="#334155" stroke-width="1.5"/>

    <!-- Table Header Row -->
    <rect x="25" y="25" width="1050" height="50" rx="10" fill="#030712" stroke="#1e293b"/>
    <text x="50" y="56" fill="#94a3b8" font-size="13" font-weight="900">PARÁMETRO CLÍNICO</text>
    <text x="450" y="56" fill="#f87171" font-size="14" font-weight="900">PROPOFOL (1%)</text>
    <text x="780" y="56" fill="#34d399" font-size="14" font-weight="900">CIPROFOL (HSK3486)</text>

    <!-- Row 1: Potencia -->
    <line x1="25" y1="135" x2="1075" y2="135" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="115" fill="#ffffff" font-size="13" font-weight="700">Potencia Relativa</text>
    <text x="450" y="115" fill="#cbd5e1" font-size="13">1x (Referencia estándar)</text>
    <text x="780" y="115" fill="#38bdf8" font-size="14" font-weight="900">4 a 5 veces superior</text>

    <!-- Row 2: Dosis Inducción -->
    <line x1="25" y1="195" x2="1075" y2="195" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="175" fill="#ffffff" font-size="13" font-weight="700">Dosis Inducción General</text>
    <text x="450" y="175" fill="#cbd5e1" font-size="13">1.5 - 2.5 mg/kg IV</text>
    <text x="780" y="175" fill="#34d399" font-size="14" font-weight="900">0.4 - 0.5 mg/kg IV</text>

    <!-- Row 3: Dolor a Inyección -->
    <line x1="25" y1="255" x2="1075" y2="255" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="235" fill="#ffffff" font-size="13" font-weight="700">Dolor a la Inyección</text>
    <text x="450" y="235" fill="#ef4444" font-size="13" font-weight="700">60 - 80% (Frecuente y severo)</text>
    <text x="780" y="235" fill="#10b981" font-size="14" font-weight="900">&lt; 5% (Virtualmente nulo)</text>

    <!-- Row 4: Hipotensión Inducción -->
    <line x1="25" y1="315" x2="1075" y2="315" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="295" fill="#ffffff" font-size="13" font-weight="700">Hipotensión en Inducción</text>
    <text x="450" y="295" fill="#ef4444" font-size="13" font-weight="700">~35 - 45% de los pacientes</text>
    <text x="780" y="295" fill="#38bdf8" font-size="14" font-weight="900">~10 - 15% (Marcada reducción)</text>

    <!-- Row 5: Depresión Respiratoria -->
    <line x1="25" y1="375" x2="1075" y2="375" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="355" fill="#ffffff" font-size="13" font-weight="700">Depresión Respiratoria en Sedación</text>
    <text x="450" y="355" fill="#cbd5e1" font-size="13">Moderada a alta (Apnea en bolos)</text>
    <text x="780" y="355" fill="#34d399" font-size="14" font-weight="900">Menor incidencia de desaturación</text>

    <!-- Row 6: Carga Lipídica (Infusión) -->
    <line x1="25" y1="435" x2="1075" y2="435" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="415" fill="#ffffff" font-size="13" font-weight="700">Carga Lipídica en TIVA Prolongada</text>
    <text x="450" y="415" fill="#cbd5e1" font-size="13">Alta (Riesgo hipertrigliceridemia/PRIS)</text>
    <text x="780" y="415" fill="#38bdf8" font-size="14" font-weight="900">Reducción del ~80% de lípidos</text>

    <!-- Row 7: Despertar y Orientación -->
    <line x1="25" y1="495" x2="1075" y2="495" stroke="#1e293b" stroke-width="1"/>
    <text x="50" y="475" fill="#ffffff" font-size="13" font-weight="700">Calidad de Recuperación (Aldrete 10)</text>
    <text x="450" y="475" fill="#cbd5e1" font-size="13">Rápido (7-12 min)</text>
    <text x="780" y="475" fill="#34d399" font-size="14" font-weight="900">Rápido y lúcido (6-10 min)</text>
  </g>

  <!-- Bottom Summary Banner -->
  <g transform="translate(50, 725)">
    <rect width="1100" height="120" rx="18" fill="url(#cardGrad6)" stroke="#0284c7" stroke-width="1.5"/>
    <text x="35" y="45" fill="#38bdf8" font-size="16" font-weight="900">📌 CONCLUSIÓN CLÍNICA Y RECOMENDACIÓN PRÁCTICA:</text>
    <text x="35" y="75" fill="#cbd5e1" font-size="14">Ciprofol representa una evolución natural del propofol, optimizando su afinidad molecular para resolver sus dos</text>
    <text x="35" y="98" fill="#cbd5e1" font-size="14">grandes debilidades históricas: el dolor severo a la inyección y la inestabilidad hemodinámica perioperatoria.</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(targetDir, 'slide_1_mecanismo_gabaa.svg'), slide1, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide_2_farmacocinetica_farmacodinamia.svg'), slide2, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide_3_dosificacion_clinica_tiva.svg'), slide3, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide_4_estabilidad_hemodinamica.svg'), slide4, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide_5_dolor_inyeccion_tolerancia.svg'), slide5, 'utf8');
fs.writeFileSync(path.join(targetDir, 'slide_6_comparativa_ciprofol_vs_propofol.svg'), slide6, 'utf8');

console.log('Successfully generated 6 HD Ciprofol SVG slides in /public/images/ciprofol/!');

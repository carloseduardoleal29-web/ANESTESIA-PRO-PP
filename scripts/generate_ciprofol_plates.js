import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'images', 'ciprofol');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 9:16 dimensions: 1080 x 1920
function generateSVGPlate(config) {
  const {
    slideNum,
    badge,
    title,
    subtitle,
    datoClave,
    quadIllustrationSVG,
    quadCaption,
    items,
    metricLabel,
    metricValue,
    footerNote
  } = config;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920" width="1080" height="1920" style="background:#070b14; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070c18"/>
      <stop offset="50%" stop-color="#0b1329"/>
      <stop offset="100%" stop-color="#050811"/>
    </linearGradient>

    <!-- Card Gradient -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#131e3a"/>
      <stop offset="100%" stop-color="#0d1527"/>
    </linearGradient>

    <!-- Accent Gradient Cyan -->
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>

    <!-- Stat Gradient -->
    <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f2b48"/>
      <stop offset="100%" stop-color="#08182b"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1920" fill="url(#bgGrad)"/>

  <!-- Subtle Ambient Glow Orbs -->
  <circle cx="200" cy="280" r="260" fill="#0284c7" opacity="0.12" filter="blur(90px)"/>
  <circle cx="900" cy="980" r="320" fill="#6366f1" opacity="0.10" filter="blur(110px)"/>
  <circle cx="300" cy="1650" r="280" fill="#0d9488" opacity="0.09" filter="blur(100px)"/>

  <!-- Grid overlay lines for professional high-tech medical feel -->
  <g stroke="#1e293b" stroke-width="1" opacity="0.25">
    <line x1="60" y1="0" x2="60" y2="1920"/>
    <line x1="1020" y1="0" x2="1020" y2="1920"/>
    <line x1="0" y1="230" x2="1080" y2="230"/>
    <line x1="0" y1="1810" x2="1080" y2="1810"/>
  </g>

  <!-- TOP HEADER -->
  <g transform="translate(60, 65)">
    <!-- Category Badge -->
    <rect x="0" y="0" width="340" height="48" rx="24" fill="#0369a1" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="170" y="31" fill="#38bdf8" font-size="20" font-weight="900" letter-spacing="1.5" text-anchor="middle">${badge}</text>

    <!-- Slide Index Pill -->
    <rect x="360" y="0" width="100" height="48" rx="24" fill="#1e293b" stroke="#475569" stroke-width="1.2"/>
    <text x="410" y="31" fill="#f8fafc" font-size="20" font-weight="900" text-anchor="middle">${slideNum} / 5</text>

    <!-- Top Right Brand -->
    <text x="960" y="24" fill="#94a3b8" font-size="16" font-weight="800" text-anchor="end" letter-spacing="1">ANESTESIA PRO • GUÍAS CLÍNICAS</text>
    <text x="960" y="46" fill="#38bdf8" font-size="15" font-weight="900" text-anchor="end">@ANESTESIAPRO2026</text>
  </g>

  <!-- TITLE & SUBTITLE -->
  <g transform="translate(60, 145)">
    <text x="0" y="55" fill="#ffffff" font-size="44" font-weight="900" letter-spacing="-0.5">${title}</text>
    <text x="0" y="96" fill="#93c5fd" font-size="25" font-weight="700">${subtitle}</text>
  </g>

  <!-- DATO CLAVE / CONCEPTO FUNDAMENTAL CALLOUT -->
  <g transform="translate(60, 265)">
    <rect width="960" height="125" rx="20" fill="#1e293b" fill-opacity="0.8" stroke="#f59e0b" stroke-width="2" filter="url(#softShadow)"/>
    <rect x="0" y="0" width="12" height="125" rx="6" fill="#f59e0b"/>
    <text x="32" y="38" fill="#fbbf24" font-size="17" font-weight="900" letter-spacing="2">DATO CLAVE / CONCEPTO FUNDAMENTAL</text>
    <foreignObject x="32" y="48" width="905" height="68">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px; font-weight:700; color:#f8fafc; line-height:1.35; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        ${datoClave}
      </div>
    </foreignObject>
  </g>

  <!-- 1:1 QUADRATIC ILLUSTRATION BOX -->
  <g transform="translate(60, 420)">
    <!-- Square Container 960 x 560 for balanced vertical layout -->
    <rect width="960" height="560" rx="26" fill="#0a1020" stroke="#0284c7" stroke-width="2" filter="url(#softShadow)"/>
    
    <!-- Header strip of square box -->
    <rect x="0" y="0" width="960" height="46" rx="26" fill="#0f1f3d"/>
    <rect x="0" y="24" width="960" height="22" fill="#0f1f3d"/>
    <circle cx="28" cy="23" r="7" fill="#ef4444"/>
    <circle cx="48" cy="23" r="7" fill="#eab308"/>
    <circle cx="68" cy="23" r="7" fill="#22c55e"/>
    <text x="100" y="29" fill="#93c5fd" font-size="15" font-weight="800" letter-spacing="1">ILUSTRACIÓN VECTORIAL MÉDICA CUADRÁTICA EN ALTA DEFINICIÓN</text>
    <text x="930" y="29" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="end">ANESTESIAPRO HD</text>

    <!-- Embedded Medical Illustration SVG -->
    <g transform="translate(20, 56)">
      ${quadIllustrationSVG}
    </g>

    <!-- Bottom Caption Bar -->
    <rect x="0" y="500" width="960" height="60" rx="0" fill="#091326" fill-opacity="0.95"/>
    <line x1="0" y1="500" x2="960" y2="500" stroke="#1e3a5f" stroke-width="1.5"/>
    <text x="24" y="538" fill="#38bdf8" font-size="19" font-weight="800">📸 ${quadCaption}</text>
  </g>

  <!-- STRUCTURED BULLET POINTS -->
  <g transform="translate(60, 1015)">
    ${items.map((item, idx) => {
      const yOffset = idx * 135;
      return `
      <g transform="translate(0, ${yOffset})">
        <rect width="960" height="120" rx="20" fill="url(#cardGrad)" stroke="#1e293b" stroke-width="1.5" filter="url(#softShadow)"/>
        <!-- Icon badge -->
        <rect x="20" y="20" width="70" height="80" rx="16" fill="${item.iconBg}" stroke="${item.iconBorder}" stroke-width="1.5"/>
        <text x="55" y="70" font-size="34" text-anchor="middle">${item.emoji}</text>
        
        <!-- Text content -->
        <text x="110" y="44" fill="${item.titleColor}" font-size="22" font-weight="900" letter-spacing="0.5">${item.title}</text>
        <foreignObject x="110" y="52" width="830" height="60">
          <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:18px; font-weight:600; color:#cbd5e1; line-height:1.35; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            ${item.text}
          </div>
        </foreignObject>
      </g>`;
    }).join('')}
  </g>

  <!-- STAT METRIC BOX -->
  <g transform="translate(60, 1595)">
    <rect width="960" height="115" rx="22" fill="url(#statGrad)" stroke="#38bdf8" stroke-width="2" filter="url(#softShadow)"/>
    
    <!-- Mini pulse wave -->
    <path d="M 40 1655 L 70 1655 L 85 1630 L 105 1680 L 125 1640 L 140 1665 L 160 1655 L 200 1655" stroke="#38bdf8" stroke-width="3.5" fill="none" opacity="0.8"/>
    
    <text x="40" y="52" fill="#94a3b8" font-size="18" font-weight="900" letter-spacing="2">${metricLabel}</text>
    <text x="40" y="92" fill="#ffffff" font-size="36" font-weight="900">${metricValue}</text>

    <!-- Big Right Number -->
    <rect x="740" y="20" width="195" height="75" rx="16" fill="#0284c7" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="837" y="72" fill="#38bdf8" font-size="40" font-weight="900" text-anchor="middle">${metricValue.split(' ')[0]}</text>
  </g>

  <!-- FOOTER & SCIENTIFIC SOURCE -->
  <g transform="translate(60, 1735)">
    <rect width="960" height="70" rx="16" fill="#0b1326" stroke="#1e293b" stroke-width="1.2"/>
    <text x="30" y="42" fill="#94a3b8" font-size="18" font-weight="700">📚 ${footerNote}</text>
    <text x="930" y="42" fill="#38bdf8" font-size="20" font-weight="900" text-anchor="end">❯</text>
  </g>

  <!-- BOTTOM SIGNATURE STRIP -->
  <g transform="translate(60, 1835)">
    <circle cx="28" cy="28" r="24" fill="#0284c7"/>
    <text x="28" y="37" fill="#ffffff" font-size="26" font-weight="900" text-anchor="middle">A</text>
    
    <text x="70" y="24" fill="#ffffff" font-size="20" font-weight="900">Anestesia Pro</text>
    <text x="70" y="46" fill="#38bdf8" font-size="15" font-weight="800">@anestesiapro2026 • GUÍAS CLÍNICAS OFICIALES</text>

    <rect x="700" y="10" width="260" height="38" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1"/>
    <text x="830" y="34" fill="#38bdf8" font-size="14" font-weight="900" letter-spacing="1" text-anchor="middle">FARMACOLOGÍA &amp; HIPNÓTICOS IV</text>
  </g>
</svg>`;
}

// ==========================================
// 5 SPECIFIC MEDICAL VECTOR ILLUSTRATIONS
// ==========================================

// Illustration 1: Pentameric GABA-A Receptor with HSK3486 Ligand & Chloride Influx
const quadSVG1 = `
  <rect width="920" height="430" rx="18" fill="#040814"/>
  <!-- Bilayer Membrane -->
  <rect x="30" y="195" width="860" height="50" rx="10" fill="#0f2744" opacity="0.6"/>
  <g fill="#0284c7" opacity="0.4">
    ${Array.from({ length: 22 }).map((_, i) => `
      <circle cx="${60 + i * 38}" cy="190" r="9"/>
      <line x1="${60 + i * 38}" y1="199" x2="${60 + i * 38}" y2="218" stroke="#0284c7" stroke-width="2"/>
      <line x1="${60 + i * 38}" y1="222" x2="${60 + i * 38}" y2="242" stroke="#0284c7" stroke-width="2"/>
      <circle cx="${60 + i * 38}" cy="250" r="9"/>
    `).join('')}
  </g>

  <!-- GABA-A Pentameric Subunits -->
  <g transform="translate(460, 220)">
    <!-- Alpha Subunit -->
    <rect x="-140" y="-130" width="80" height="180" rx="30" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
    <text x="-100" y="-30" fill="#bfdbfe" font-size="22" font-weight="900" text-anchor="middle">α1</text>

    <!-- Beta Subunit (Ciprofol target) -->
    <rect x="-50" y="-150" width="100" height="200" rx="35" fill="#065f46" stroke="#10b981" stroke-width="3" filter="url(#glow)"/>
    <text x="0" y="-45" fill="#a7f3d0" font-size="24" font-weight="900" text-anchor="middle">β2 / β3</text>
    <text x="0" y="-15" fill="#6ee7b7" font-size="14" font-weight="800" text-anchor="middle">Sitio Ciprofol</text>

    <!-- Gamma Subunit -->
    <rect x="60" y="-130" width="80" height="180" rx="30" fill="#4c1d95" stroke="#8b5cf6" stroke-width="2"/>
    <text x="100" y="-30" fill="#ddd6fe" font-size="22" font-weight="900" text-anchor="middle">γ2</text>

    <!-- Central Chloride Ion Pore -->
    <path d="M -20 -150 L -15 90 M 20 -150 L 15 90" stroke="#06b6d4" stroke-width="4" stroke-dasharray="6,4"/>
    
    <!-- Chloride Ions Influx (Cl-) -->
    <circle cx="0" cy="-110" r="14" fill="#06b6d4" filter="url(#glow)"/>
    <text x="0" y="-105" fill="#ffffff" font-size="13" font-weight="900" text-anchor="middle">Cl⁻</text>
    <path d="M 0 -85 L 0 -50 M -6 -60 L 0 -50 L 6 -60" stroke="#38bdf8" stroke-width="3" fill="none"/>

    <circle cx="0" cy="-20" r="16" fill="#06b6d4" filter="url(#glow)"/>
    <text x="0" y="-14" fill="#ffffff" font-size="15" font-weight="900" text-anchor="middle">Cl⁻</text>
    <path d="M 0 5 L 0 45 M -6 35 L 0 45 L 6 35" stroke="#38bdf8" stroke-width="3" fill="none"/>

    <!-- Hyperpolarization Influx Arrow -->
    <circle cx="0" cy="75" r="18" fill="#10b981" filter="url(#glow)"/>
    <text x="0" y="82" fill="#ffffff" font-size="16" font-weight="900" text-anchor="middle">Cl⁻</text>
    <text x="0" y="115" fill="#34d399" font-size="14" font-weight="900" text-anchor="middle">HIPERPOLARIZACIÓN</text>
  </g>

  <!-- HSK3486 Molecule Binding Callout -->
  <g transform="translate(110, 110)">
    <rect width="250" height="90" rx="16" fill="#092238" stroke="#38bdf8" stroke-width="2"/>
    <text x="20" y="32" fill="#38bdf8" font-size="18" font-weight="900">Ligando HSK3486</text>
    <text x="20" y="56" fill="#f8fafc" font-size="14" font-weight="700">Anillo Fenol + Ciclopropil</text>
    <text x="20" y="76" fill="#34d399" font-size="13" font-weight="800">Afinidad 4-5x mayor</text>
    <path d="M 250 45 L 390 100" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="5,4"/>
  </g>

  <!-- Hyperpolarization Waveform on right -->
  <g transform="translate(680, 100)">
    <rect width="200" height="130" rx="14" fill="#091b2e" stroke="#1e3a5f" stroke-width="1.5"/>
    <text x="15" y="28" fill="#38bdf8" font-size="14" font-weight="800">Potencial de Membrana</text>
    <path d="M 20 60 L 50 60 L 80 100 L 130 105 L 180 80" stroke="#10b981" stroke-width="3" fill="none"/>
    <text x="20" y="118" fill="#34d399" font-size="13" font-weight="900">-70 mV ➔ -85 mV</text>
  </g>
`;

// Illustration 2: Intravenous Injection & Painless Endothelial Barrier (<5% pain)
const quadSVG2 = `
  <rect width="920" height="430" rx="18" fill="#050a17"/>
  <!-- Vein Lumen Cross-section -->
  <path d="M 40 100 Q 460 70 880 100 L 880 330 Q 460 360 40 330 Z" fill="#1e1026" stroke="#be185d" stroke-width="2.5"/>
  <text x="70" y="135" fill="#f472b6" font-size="18" font-weight="900">LUZ VENOSA ENDOTELIAL (Brazo del Paciente)</text>

  <!-- IV Catheter Cannula -->
  <g transform="translate(80, 160)">
    <!-- Syringe barrel -->
    <rect x="0" y="10" width="160" height="60" rx="8" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="80" y="45" fill="#ffffff" font-size="16" font-weight="900" text-anchor="middle">CIPROFOL</text>
    <!-- Catheter Needle Tip -->
    <polygon points="160,25 240,40 160,55" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
    <!-- Infused Droplets -->
    <circle cx="265" cy="40" r="10" fill="#38bdf8" filter="url(#glow)"/>
    <circle cx="300" cy="42" r="12" fill="#38bdf8" filter="url(#glow)"/>
    <circle cx="340" cy="39" r="14" fill="#38bdf8" filter="url(#glow)"/>
  </g>

  <!-- Endothelial Cell Layer (No irritation) -->
  <g transform="translate(380, 115)">
    <rect width="470" height="190" rx="16" fill="#081d33" stroke="#0284c7" stroke-width="2"/>
    <text x="25" y="36" fill="#38bdf8" font-size="18" font-weight="900">Barrera Endotelial Intacta</text>
    <text x="25" y="62" fill="#22c55e" font-size="16" font-weight="800">✓ Sin liberación de Bradicinina ni Calicreína</text>
    <text x="25" y="88" fill="#22c55e" font-size="16" font-weight="800">✓ Cero activación de nociceptores endoteliales</text>
    <text x="25" y="114" fill="#cbd5e1" font-size="15">✓ No requiere premedicación con Lidocaína</text>

    <!-- Comparison Chart Inside Card -->
    <rect x="25" y="132" width="200" height="34" rx="8" fill="#be185d" fill-opacity="0.3"/>
    <text x="35" y="154" fill="#f43f5e" font-size="14" font-weight="900">Propofol: 70% Dolor</text>

    <rect x="240" y="132" width="200" height="34" rx="8" fill="#059669" fill-opacity="0.3"/>
    <text x="250" y="154" fill="#34d399" font-size="14" font-weight="900">Ciprofol: &lt;5% Dolor</text>
  </g>
`;

// Illustration 3: Hemodynamic Stability - Arterial Line Waveform & Vital Signs
const quadSVG3 = `
  <rect width="920" height="430" rx="18" fill="#030814"/>
  <!-- Operating Room Monitor Frame -->
  <rect x="30" y="25" width="860" height="380" rx="20" fill="#061224" stroke="#1e3a8a" stroke-width="3"/>
  <rect x="30" y="25" width="860" height="42" rx="20" fill="#0c1e3d"/>
  <text x="60" y="52" fill="#93c5fd" font-size="16" font-weight="900">MONITOR HEMODINÁMICO DE ALTA FIDELIDAD • INDUCCIÓN IV</text>
  <text x="850" y="52" fill="#22c55e" font-size="16" font-weight="900" text-anchor="end">ESTABILIDAD PAM 94%</text>

  <!-- Vital Signs Readouts Grid -->
  <g transform="translate(60, 90)">
    <!-- PAM Box -->
    <rect width="240" height="130" rx="14" fill="#0f2b48" stroke="#38bdf8" stroke-width="2"/>
    <text x="20" y="32" fill="#94a3b8" font-size="15" font-weight="900">PRESIÓN ARTERIAL (PAM)</text>
    <text x="20" y="80" fill="#ffffff" font-size="44" font-weight="900">118/74</text>
    <text x="180" y="76" fill="#38bdf8" font-size="28" font-weight="900">(82)</text>
    <text x="20" y="112" fill="#34d399" font-size="14" font-weight="800">✓ Caída &lt; 8% post-inducción</text>

    <!-- HR Box -->
    <rect x="260" y="0" width="240" height="130" rx="14" fill="#092238" stroke="#10b981" stroke-width="1.5"/>
    <text x="280" y="32" fill="#94a3b8" font-size="15" font-weight="900">FRECUENCIA CARDÍACA</text>
    <text x="280" y="80" fill="#10b981" font-size="44" font-weight="900">68</text>
    <text x="350" y="76" fill="#a7f3d0" font-size="22" font-weight="700">lpm</text>
    <text x="280" y="112" fill="#6ee7b7" font-size="14" font-weight="800">Ritmo sinusal estable</text>

    <!-- SpO2 & BIS Box -->
    <rect x="520" y="0" width="270" height="130" rx="14" fill="#1a1c3b" stroke="#8b5cf6" stroke-width="1.5"/>
    <text x="540" y="32" fill="#c4b5fd" font-size="15" font-weight="900">SpO2 / BIS MONITOR</text>
    <text x="540" y="80" fill="#c084fc" font-size="44" font-weight="900">99%</text>
    <text x="660" y="80" fill="#fbbf24" font-size="44" font-weight="900">46</text>
    <text x="540" y="112" fill="#e9d5ff" font-size="14" font-weight="800">Hipnosis quirúrgica óptima</text>
  </g>

  <!-- Arterial Waveform Display -->
  <g transform="translate(60, 245)">
    <rect width="790" height="135" rx="14" fill="#030814" stroke="#0284c7" stroke-width="1.5"/>
    <text x="20" y="28" fill="#ef4444" font-size="15" font-weight="900">Línea Arterial Invasiva (Curva Dicrota Conservada)</text>
    
    <!-- Arterial Wave Path with Dicrotic Notch -->
    <path d="M 30 100 Q 50 100 65 35 Q 75 15 85 45 Q 95 65 105 60 Q 115 55 140 100 
             Q 160 100 175 35 Q 185 15 195 45 Q 205 65 215 60 Q 225 55 250 100 
             Q 270 100 285 35 Q 295 15 305 45 Q 315 65 325 60 Q 335 55 360 100 
             Q 380 100 395 35 Q 405 15 415 45 Q 425 65 435 60 Q 445 55 470 100 
             Q 490 100 505 35 Q 515 15 525 45 Q 535 65 545 60 Q 555 55 580 100
             Q 600 100 615 35 Q 625 15 635 45 Q 645 65 655 60 Q 665 55 690 100
             L 760 100" 
          stroke="#ef4444" stroke-width="3.5" fill="none"/>
    <text x="700" y="35" fill="#f87171" font-size="14" font-weight="900">Morfología Intacta</text>
  </g>
`;

// Illustration 4: Lipid Load Comparison - Propofol vs Ciprofol Syringes & Emulsion Volume
const quadSVG4 = `
  <rect width="920" height="430" rx="18" fill="#080c18"/>
  <text x="40" y="45" fill="#ffffff" font-size="20" font-weight="900">COMPARATIVA DE CARGA LIPÍDICA EN INFUSIONES PROLONGADAS (UCI / TIVA)</text>

  <!-- Left: Propofol 1% Standard High Lipid Load -->
  <g transform="translate(40, 75)">
    <rect width="400" height="320" rx="18" fill="#2d121c" stroke="#f43f5e" stroke-width="2"/>
    <text x="25" y="38" fill="#fb7185" font-size="20" font-weight="900">PROPOFOL 1% (10 mg/mL)</text>
    <text x="25" y="65" fill="#fda4af" font-size="15">Mayor volumen de emulsión lipídica</text>

    <!-- Propofol Bottle 100 mL -->
    <rect x="35" y="90" width="80" height="170" rx="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="55" y="70" width="40" height="20" rx="4" fill="#94a3b8"/>
    <text x="75" y="175" fill="#0f172a" font-size="14" font-weight="900" text-anchor="middle">100 mL</text>
    <text x="75" y="195" fill="#e11d48" font-size="13" font-weight="800" text-anchor="middle">Lípidos 10g</text>

    <g transform="translate(135, 95)">
      <text x="0" y="25" fill="#ffffff" font-size="16" font-weight="800">⚠️ Riesgo de PRIS:</text>
      <text x="0" y="50" fill="#fda4af" font-size="14">Sobrecarga de triglicéridos</text>
      <text x="0" y="75" fill="#fda4af" font-size="14">Acidosis metabólica refractaria</text>
      <text x="0" y="100" fill="#fda4af" font-size="14">Rabdomiólisis en UCI</text>
      <rect x="0" y="125" width="230" height="40" rx="8" fill="#881337"/>
      <text x="115" y="150" fill="#fecdd3" font-size="14" font-weight="900" text-anchor="middle">CARGA LIPÍDICA: 100%</text>
    </g>
  </g>

  <!-- Right: Ciprofol Low Lipid Volume -->
  <g transform="translate(480, 75)">
    <rect width="400" height="320" rx="18" fill="#082b26" stroke="#10b981" stroke-width="2.5" filter="url(#glow)"/>
    <text x="25" y="38" fill="#34d399" font-size="20" font-weight="900">CIPROFOL (HSK3486)</text>
    <text x="25" y="65" fill="#a7f3d0" font-size="15">Alta potencia ➔ 80% menos emulsión</text>

    <!-- Ciprofol Bottle 20 mL -->
    <rect x="45" y="110" width="60" height="150" rx="10" fill="#ffffff" stroke="#34d399" stroke-width="2"/>
    <rect x="60" y="95" width="30" height="15" rx="4" fill="#10b981"/>
    <text x="75" y="175" fill="#0f172a" font-size="14" font-weight="900" text-anchor="middle">20 mL</text>
    <text x="75" y="195" fill="#059669" font-size="13" font-weight="800" text-anchor="middle">Lípidos 2g</text>

    <g transform="translate(130, 95)">
      <text x="0" y="25" fill="#ffffff" font-size="16" font-weight="800">🛡️ Protección en UCI:</text>
      <text x="0" y="50" fill="#a7f3d0" font-size="14">Reducción del 80% de lípidos</text>
      <text x="0" y="75" fill="#a7f3d0" font-size="14">Triglicéridos basales estables</text>
      <text x="0" y="100" fill="#a7f3d0" font-size="14">Ideal para sedaciones > 48 horas</text>
      <rect x="0" y="125" width="230" height="40" rx="8" fill="#065f46"/>
      <text x="115" y="150" fill="#6ee7b7" font-size="14" font-weight="900" text-anchor="middle">REDUCCIÓN DEL -80%</text>
    </g>
  </g>
`;

// Illustration 5: Head-to-Head Comparative Radar & Anesthesia Workstation Matrix
const quadSVG5 = `
  <rect width="920" height="430" rx="18" fill="#040916"/>
  <text x="40" y="42" fill="#38bdf8" font-size="20" font-weight="900">MATRIZ COMPARATIVA CARA A CARA: CIPROFOL VS PROPOFOL</text>

  <!-- Comparative Bars Matrix -->
  <g transform="translate(40, 75)">
    ${[
      { label: 'Potencia Hipnótica (mg/kg)', propofol: '2.0 mg/kg (1x)', ciprofol: '0.4 mg/kg (5x Ganador)', pWidth: 120, cWidth: 420, cWins: true },
      { label: 'Dolor a la Inyección Venosa', propofol: '70% (Ardor Frecuente)', ciprofol: '< 5% (Indoloro)', pWidth: 380, cWidth: 60, cWins: false },
      { label: 'Estabilidad Presión Arterial (PAM)', propofol: 'Caída PAM -25 a -35%', ciprofol: 'Caída PAM -10 a -15%', pWidth: 260, cWidth: 440, cWins: true },
      { label: 'Volumen Lipídico Infundido', propofol: '100% Carga Lipídica', ciprofol: '-80% Menor Carga', pWidth: 400, cWidth: 90, cWins: false },
      { label: 'Velocidad de Despertar (Aldrete ≥9)', propofol: '6 - 8 minutos', ciprofol: '5 - 7 minutos', pWidth: 320, cWidth: 340, cWins: true },
    ].map((row, idx) => {
      const y = idx * 64;
      return `
      <g transform="translate(0, ${y})">
        <text x="0" y="20" fill="#f8fafc" font-size="16" font-weight="800">${row.label}</text>
        
        <!-- Propofol Bar -->
        <rect x="330" y="5" width="${row.pWidth}" height="22" rx="6" fill="#f43f5e" fill-opacity="0.4" stroke="#f43f5e" stroke-width="1.2"/>
        <text x="${340 + row.pWidth}" y="21" fill="#fca5a5" font-size="13" font-weight="700">${row.propofol}</text>

        <!-- Ciprofol Bar -->
        <rect x="330" y="32" width="${row.cWidth}" height="22" rx="6" fill="#10b981" fill-opacity="0.5" stroke="#34d399" stroke-width="1.5"/>
        <text x="${340 + row.cWidth}" y="48" fill="#6ee7b7" font-size="13" font-weight="900">${row.ciprofol}</text>
      </g>`;
    }).join('')}
  </g>
`;

// Compile 5 Plates
const PLATES = [
  {
    fileName: 'placa_1_que_es_el_ciprofol.svg',
    config: {
      slideNum: 1,
      badge: 'NOVEDAD FARMACOLÓGICA 🧪',
      title: '¿QUÉ ES EL CIPROFOL (HSK3486)?',
      subtitle: 'El Nuevo Análogo del Propofol: Lanzamiento, Fases y Avales',
      datoClave: 'Ciprofol (HSK3486): Análogo de propofol con grupo ciclopropilo, 4-5 veces más potente y con menor impacto cardiorrespiratorio.',
      quadIllustrationSVG: quadSVG1,
      quadCaption: 'Estructura molecular HSK3486 sobre receptor GABA_A · Afinidad estérica 5x',
      items: [
        {
          emoji: '🚀',
          iconBg: '#0f2b48',
          iconBorder: '#0284c7',
          title: 'LANZAMIENTO AL PÚBLICO',
          titleColor: '#38bdf8',
          text: 'Aprobado por la NMPA (China) en 2020 para sedación en endoscopia; ampliado en 2021-2022 para anestesia general y UCI.'
        },
        {
          emoji: '🔬',
          iconBg: '#1a1c3b',
          iconBorder: '#8b5cf6',
          title: '¿EN QUÉ FASE ESTÁ?',
          titleColor: '#c084fc',
          text: 'Fase IV (uso clínico rutinario en millones de pacientes en Asia); Fase III avanzada internacional para registro FDA (EE.UU.) y EMA (Europa).'
        },
        {
          emoji: '🏛️',
          iconBg: '#064e3b',
          iconBorder: '#10b981',
          title: '¿QUIÉN LO AVALA?',
          titleColor: '#34d399',
          text: 'Aval oficial NMPA, respaldado por la Sociedad China de Anestesiología y con ensayos multicéntricos en el British Journal of Anaesthesia (BJA).'
        }
      ],
      metricLabel: 'MÁS POTENTE QUE PROPOFOL',
      metricValue: '4 - 5x (Dosis 0.4 mg/kg)',
      footerNote: 'BJA (British Journal of Anaesthesia) & Ensayos Clínicos Fase III'
    }
  },
  {
    fileName: 'placa_2_ventajas_frente_al_propofol.svg',
    config: {
      slideNum: 2,
      badge: 'VENTAJAS CLÍNICAS 🎯',
      title: 'VENTAJAS FRENTE AL PROPOFOL',
      subtitle: 'Cero Dolor a la Inyección, Menor Dosis y Mayor Margen',
      datoClave: 'Erradica el mayor dolor de cabeza del propofol: el dolor a la inyección venosa desciende del 70% a menos del 5%.',
      quadIllustrationSVG: quadSVG2,
      quadCaption: 'Inyección endovenosa indolora (<5% de incidencia) sin necesidad de lidocaína',
      items: [
        {
          emoji: '🎯',
          iconBg: '#0f2b48',
          iconBorder: '#0284c7',
          title: 'ALTA POTENCIA (4-5x)',
          titleColor: '#38bdf8',
          text: 'Dosis de inducción de 0.4 mg/kg vs 1.5 - 2.5 mg/kg de propofol. Misma profundidad con una fracción de fármaco.'
        },
        {
          emoji: '🛡️',
          iconBg: '#064e3b',
          iconBorder: '#10b981',
          title: 'DOLOR A LA INYECCIÓN < 5%',
          titleColor: '#34d399',
          text: 'Reduce más del 90% el dolor vascular endotelial (propofol causa ardor en 50-80% de casos). No requiere lidocaína.'
        },
        {
          emoji: '📈',
          iconBg: '#312e81',
          iconBorder: '#6366f1',
          title: 'MARGEN TERAPÉUTICO 1.5 - 2X',
          titleColor: '#a5b4fc',
          text: 'Ventana de seguridad significativamente más amplia entre la dosis efectiva hipnótica y la toxicidad letal.'
        }
      ],
      metricLabel: 'INCIDENCIA DE DOLOR VASCULAR',
      metricValue: '< 5% (vs 70% Propofol)',
      footerNote: 'Estudios comparativos doble ciego (BJA 2021-2024)'
    }
  },
  {
    fileName: 'placa_3_hemodinamia_y_respiracion.svg',
    config: {
      slideNum: 3,
      badge: 'ESTABILIDAD CLÍNICA ❤️',
      title: 'HEMODINAMIA Y RESPIRACIÓN',
      subtitle: 'Menos Hipotensión, Menor Caída de PAM y Menos Apneas',
      datoClave: 'Conserva mejor el tono vascular periférico y reduce de forma contundente la hipotensión brusca tras la inducción.',
      quadIllustrationSVG: quadSVG3,
      quadCaption: 'Monitoreo arterial invasivo continuo: caída de PAM 30-40% menor que propofol',
      items: [
        {
          emoji: '❤️',
          iconBg: '#4c0519',
          iconBorder: '#f43f5e',
          title: 'MENOS HIPOTENSIÓN',
          titleColor: '#fb7185',
          text: 'Menor vasodilatación y menor depresión miocárdica. Caída de PAM un 30-40% menor que con propofol.'
        },
        {
          emoji: '🫁',
          iconBg: '#0f2b48',
          iconBorder: '#0284c7',
          title: 'MENOR APNEA Y DESATURACIÓN',
          titleColor: '#38bdf8',
          text: 'Menor incidencia y duración de eventos de hipoxemia (SpO2 < 90%) durante sedaciones profundas ambulatorias.'
        },
        {
          emoji: '⚡',
          iconBg: '#362f05',
          iconBorder: '#eab308',
          title: 'DESPERTAR RÁPIDO Y LÚCIDO',
          titleColor: '#fde047',
          text: 'Tiempos de emersión equivalentes a propofol (Aldrete ≥9 en 5-8 min) sin sedación residual prolongada.'
        }
      ],
      metricLabel: 'CAÍDA DE PRESIÓN ARTERIAL (PAM)',
      metricValue: '-40% Menor Hipotensión',
      footerNote: 'Monitoreo hemodinámico continuo en inducción anestésica'
    }
  },
  {
    fileName: 'placa_4_desventajas_y_carga_lipidica.svg',
    config: {
      slideNum: 4,
      badge: 'LIMITACIONES & UCI ⚠️',
      title: 'DESVENTAJAS Y CARGA LIPÍDICA',
      subtitle: 'Acceso Global, Costo, Mioclonías y Protección contra PRIS',
      datoClave: 'Costo superior por ser patente reciente y acceso occidental en trámite; pero con un 80% menos de lípidos infundidos en UCI.',
      quadIllustrationSVG: quadSVG4,
      quadCaption: 'Reducción masiva del 80% en volumen de emulsión lipídica: prevención de PRIS en UCI',
      items: [
        {
          emoji: '🌐',
          iconBg: '#0f2b48',
          iconBorder: '#0284c7',
          title: 'DISPONIBILIDAD GLOBAL',
          titleColor: '#38bdf8',
          text: 'Uso habitual en China; pendiente de autorización final FDA y EMA para comercialización en Occidente.'
        },
        {
          emoji: '💰',
          iconBg: '#3b1a08',
          iconBorder: '#f97316',
          title: 'COSTO DE PATENTE',
          titleColor: '#fdba74',
          text: 'Al ser un fármaco innovador reciente, su coste es superior a las formulaciones genéricas de propofol.'
        },
        {
          emoji: '🧈',
          iconBg: '#064e3b',
          iconBorder: '#10b981',
          title: '80% MENOS LÍPIDOS (ANTI-PRIS)',
          titleColor: '#34d399',
          text: 'Al requerir menor volumen de emulsión, disminuye drásticamente la hipertrigliceridemia y el riesgo de PRIS en UCI.'
        }
      ],
      metricLabel: 'CARGA LIPÍDICA EN INFUSIÓN CONTINUA',
      metricValue: '-80% Menos Emulsión',
      footerNote: 'Perfil de seguridad y farmacovigilancia clínica en UCI'
    }
  },
  {
    fileName: 'placa_5_veredicto_ciprofol_vs_propofol.svg',
    config: {
      slideNum: 5,
      badge: 'VEREDICTO QUIRÚRGICO 🏆',
      title: 'VEREDICTO: CIPROFOL VS PROPOFOL',
      subtitle: 'Comparativa Cara a Cara en la Práctica Anestésica Diaria',
      datoClave: 'Ciprofol conserva la rapidez y predictibilidad del propofol, pero con un perfil de seguridad hemodinámico y vascular superior.',
      quadIllustrationSVG: quadSVG5,
      quadCaption: 'El futuro de la inducción IV: perfil optimizado para pacientes frágiles y cirugías ambulatorias',
      items: [
        {
          emoji: '🥊',
          iconBg: '#0f2b48',
          iconBorder: '#0284c7',
          title: 'POTENCIA & DOLOR',
          titleColor: '#38bdf8',
          text: 'Ciprofol 0.4 mg/kg vs Propofol 2.0 mg/kg (5x potencia). Dolor a la inyección <5% vs 70% con propofol.'
        },
        {
          emoji: '❤️',
          iconBg: '#4c0519',
          iconBorder: '#f43f5e',
          title: 'ESTABILIDAD HEMODINÁMICA',
          titleColor: '#fb7185',
          text: 'Menor caída tensional y menor uso de vasopresores. Gran beneficio en cardiopatías y ancianos.'
        },
        {
          emoji: '🏆',
          iconBg: '#362f05',
          iconBorder: '#eab308',
          title: 'CONCLUSIÓN PRÁCTICA',
          titleColor: '#fde047',
          text: 'Fármaco ideal para ancianos, cardiópatas, endoscopias de alta rotación y sedación prolongada en UCI.'
        }
      ],
      metricLabel: 'EVOLUCIÓN CLÍNICA DEL PROPOFOL',
      metricValue: 'HSK3486 (Ciprofol)',
      footerNote: 'Anestesia Pro · Guías de Farmacología (@anestesiapro2026)'
    }
  }
];

// Write plates
PLATES.forEach((plate) => {
  const content = generateSVGPlate(plate.config);
  const outPath = path.join(outDir, plate.fileName);
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log('Generated plate:', outPath);

  // Also mirror to dist if dist exists
  const distDir = path.join(process.cwd(), 'dist', 'images', 'ciprofol');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, plate.fileName), content, 'utf-8');
  }
});

// Also copy into slide_1 through slide_5 for backwards compatibility
const aliasMap = [
  ['placa_1_que_es_el_ciprofol.svg', 'slide_1_mecanismo_gabaa.svg'],
  ['placa_2_ventajas_frente_al_propofol.svg', 'slide_2_farmacocinetica_farmacodinamia.svg'],
  ['placa_3_hemodinamia_y_respiracion.svg', 'slide_3_dosificacion_clinica_tiva.svg'],
  ['placa_4_desventajas_y_carga_lipidica.svg', 'slide_4_estabilidad_hemodinamica.svg'],
  ['placa_5_veredicto_ciprofol_vs_propofol.svg', 'slide_5_dolor_inyeccion_tolerancia.svg'],
  ['placa_5_veredicto_ciprofol_vs_propofol.svg', 'slide_6_comparativa_ciprofol_vs_propofol.svg']
];

aliasMap.forEach(([src, dest]) => {
  const srcPath = path.join(outDir, src);
  const destPath = path.join(outDir, dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Aliased ${src} -> ${dest}`);
  }
});

console.log('All 5 HD Ciprofol plates generated successfully!');

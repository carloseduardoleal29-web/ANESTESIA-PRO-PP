const fs = require("fs");
let g4 = fs.readFileSync("./g4_raw.js", "utf8");
const iconMap = require("./icon_map.json");

function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

// Separate g4 and Yx
let codeToInsert = g4.trim();
if (codeToInsert.endsWith(",")) {
  codeToInsert = codeToInsert.slice(0, -1);
}

// Find all icons in g4
const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(codeToInsert)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

const iconDeclarations = [];
for (const id of usedIdentifiers) {
  if (iconMap[id]) {
    const iconName = toPascalCase(iconMap[id]);
    iconDeclarations.push(`const ${id} = (LucideIcons as any).${iconName} || LucideIcons.HelpCircle;`);
  }
}

const content = `// PreeclampsiaProtocolVisualizer.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import * as LucideIcons from 'lucide-react';

import { PreeclampsiaPlacentaSpecimen } from './PreeclampsiaPlacentaSpecimen';
import { PreeclampsiaAnatomicalInfographic } from './PreeclampsiaAnatomicalInfographic';
import { 
  GraphicPreeclampsiaPathophysiology, 
  GraphicBrainAstrocytesBBB, 
  GraphicRenalPodocytes, 
  GraphicMagnesiumMechanism, 
  GraphicFluidRestrictionStarling 
} from './PreeclampsiaGraphics';
import { PreeclampsiaDiagnosticCalculator } from './PreeclampsiaDiagnosticCalculator';
import { PreeclampsiaParaclinicosSimulator } from './PreeclampsiaParaclinicosSimulator';
import { PreeclampsiaNmdaPresynaptic } from './PreeclampsiaNmdaPresynaptic';
import { PreeclampsiaFluidsHydrationManager } from './PreeclampsiaFluidsHydrationManager';
import { PreeclampsiaComplicationsAtlas } from './PreeclampsiaComplicationsAtlas';
import { PreeclampsiaVisualAtlas8Laminas } from './PreeclampsiaVisualAtlas8Laminas';
import { PreeclampsiaBibliography } from './PreeclampsiaBibliography';
import { downloadPreeclampsiaGuidePDF } from './preeclampsiaPdfGenerator';
import { statsService } from '../../services/statsService';

const e = { jsx: _jsx, jsxs: _jsxs, Fragment: _Fragment };
const ie = React;

${iconDeclarations.join("\n")}

const x4 = PreeclampsiaPlacentaSpecimen;
const b4 = PreeclampsiaAnatomicalInfographic;
const e4 = GraphicPreeclampsiaPathophysiology;
const a4 = GraphicBrainAstrocytesBBB;
const t4 = GraphicRenalPodocytes;
const c4 = PreeclampsiaDiagnosticCalculator;
const n4 = PreeclampsiaParaclinicosSimulator;
const m4 = PreeclampsiaNmdaPresynaptic;
const i4 = GraphicMagnesiumMechanism;
const u4 = PreeclampsiaFluidsHydrationManager;
const s4 = GraphicFluidRestrictionStarling;
const r4 = PreeclampsiaComplicationsAtlas;
const l4 = PreeclampsiaVisualAtlas8Laminas;
const d4 = PreeclampsiaBibliography;

const Ru = () => {
  try {
    downloadPreeclampsiaGuidePDF();
  } catch (err) {
    console.error("PDF generation error:", err);
  }
};

const on = (type: string, name: string) => {
  try {
    statsService.recordDownload(name);
  } catch (err) {}
};

interface PreeclampsiaProtocolVisualizerProps {
  onDownload?: () => void;
}

const ${codeToInsert};

export const PreeclampsiaProtocolVisualizer = (props: PreeclampsiaProtocolVisualizerProps) => {
  return e.jsx(g4, props);
};

export default PreeclampsiaProtocolVisualizer;
`;

fs.writeFileSync("src/components/education/PreeclampsiaProtocolVisualizer.tsx", content);
console.log("PreeclampsiaProtocolVisualizer.tsx regenerated successfully!");

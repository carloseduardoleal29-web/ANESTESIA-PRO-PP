const fs = require("fs");
const g4 = fs.readFileSync("./g4_raw.js", "utf8");
const iconMap = require("./icon_map.json");

function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

// Check all e.jsx(IDENT, ...)
const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(g4)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

const knownSubcomps = {
  x4: "PreeclampsiaPlacentaSpecimen",
  b4: "PreeclampsiaAnatomicalInfographic",
  e4: "GraphicPreeclampsiaPathophysiology",
  a4: "GraphicBrainAstrocytesBBB",
  t4: "GraphicRenalPodocytes",
  c4: "PreeclampsiaDiagnosticCalculator",
  n4: "PreeclampsiaParaclinicosSimulator",
  m4: "PreeclampsiaNmdaPresynaptic",
  i4: "GraphicMagnesiumMechanism",
  u4: "PreeclampsiaFluidsHydrationManager",
  s4: "GraphicFluidRestrictionStarling",
  r4: "PreeclampsiaComplicationsAtlas",
  l4: "PreeclampsiaVisualAtlas8Laminas",
  d4: "PreeclampsiaBibliography"
};

const iconDeclarations = [];
for (const id of usedIdentifiers) {
  if (iconMap[id]) {
    const iconName = toPascalCase(iconMap[id]);
    iconDeclarations.push(`const ${id} = (LucideIcons as any).${iconName} || LucideIcons.HelpCircle;`);
  } else if (!knownSubcomps[id]) {
    console.log("UNKNOWN IDENTIFIER:", id);
  }
}

console.log("All identifiers mapped!");

const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");
const iconMap = require("./icon_map.json");

function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

function generateComponent({ name, startStr, endStr, exportName, additionalCode = "" }) {
  const start = bundle.indexOf(startStr);
  if (start === -1) throw new Error(`Start not found for ${name}: ${startStr}`);
  const end = bundle.indexOf(endStr, start);
  if (end === -1) throw new Error(`End not found for ${name}: ${endStr}`);
  const code = bundle.slice(start, end);

  // find icons
  const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
  let m;
  const usedIdentifiers = new Set();
  while ((m = regex.exec(code)) !== null) {
    if (m[1] !== "e") usedIdentifiers.add(m[1]);
  }

  const iconDeclarations = [];
  for (const id of usedIdentifiers) {
    if (iconMap[id]) {
      const iconName = toPascalCase(iconMap[id]);
      iconDeclarations.push(`const ${id} = (LucideIcons as any).${iconName} || LucideIcons.HelpCircle;`);
    }
  }

  const output = `// ${name}.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import * as LucideIcons from 'lucide-react';

const e = { jsx: _jsx, jsxs: _jsxs, Fragment: _Fragment };
const ie = React;

${iconDeclarations.join("\n")}

${additionalCode}

const ${code};

export const ${name} = ${exportName};
export default ${name};
`;
  return output;
}

// 1. PreeclampsiaPlacentaSpecimen (x4)
const x4Code = generateComponent({
  name: "PreeclampsiaPlacentaSpecimen",
  startStr: "x4=({onNavigateToTab:t})=>{",
  endStr: ",b4=({onNavigateToTab:t})=>{",
  exportName: "x4"
});
fs.writeFileSync("src/components/education/PreeclampsiaPlacentaSpecimen.tsx", x4Code);
console.log("Written PreeclampsiaPlacentaSpecimen.tsx");

// 2. PreeclampsiaNmdaPresynaptic (m4)
const m4Code = generateComponent({
  name: "PreeclampsiaNmdaPresynaptic",
  startStr: "m4=()=>{const[t,i]=ie.useState(\"presinaptico\")",
  endStr: ",x4=({onNavigateToTab:t})=>{",
  exportName: "m4"
});
fs.writeFileSync("src/components/education/PreeclampsiaNmdaPresynaptic.tsx", m4Code);
console.log("Written PreeclampsiaNmdaPresynaptic.tsx");

// 3. ElaineBromileyVisualizer (j4)
const j4Code = generateComponent({
  name: "ElaineBromileyVisualizer",
  startStr: "j4=()=>{const[t,i]=ie.useState(0)",
  endStr: ",N4=({onDownload:t})=>{",
  exportName: "j4"
});
fs.writeFileSync("src/components/education/ElaineBromileyVisualizer.tsx", j4Code);
console.log("Written ElaineBromileyVisualizer.tsx");

// 4. FonaCricoVisualizer (N4)
const N4Code = generateComponent({
  name: "FonaCricoVisualizer",
  startStr: "N4=({onDownload:t})=>{",
  endStr: ",A4=()=>{const[t,i]=ie.useState(!1)",
  exportName: "N4"
});
fs.writeFileSync("src/components/education/FonaCricoVisualizer.tsx", N4Code);
console.log("Written FonaCricoVisualizer.tsx");

// 5. AminofilinaCppdVisualizer (A4)
const A4Code = generateComponent({
  name: "AminofilinaCppdVisualizer",
  startStr: "A4=()=>{const[t,i]=ie.useState(!1)",
  endStr: ",w4=({onDownload:t})=>{",
  exportName: "A4"
});
fs.writeFileSync("src/components/education/AminofilinaCppdVisualizer.tsx", A4Code);
console.log("Written AminofilinaCppdVisualizer.tsx");

// 6. OrexinaVisualizer (w4)
const w4Code = generateComponent({
  name: "OrexinaVisualizer",
  startStr: "w4=({onDownload:t})=>{",
  endStr: ",S4=({onDownload:t})=>{",
  exportName: "w4"
});
fs.writeFileSync("src/components/education/OrexinaVisualizer.tsx", w4Code);
console.log("Written OrexinaVisualizer.tsx");

// 7. ErasCesareaVisualizer (S4)
const S4Code = generateComponent({
  name: "ErasCesareaVisualizer",
  startStr: "S4=({onDownload:t})=>{",
  endStr: ",E4=({initialResourceId:t",
  exportName: "S4"
});
fs.writeFileSync("src/components/education/ErasCesareaVisualizer.tsx", S4Code);
console.log("Written ErasCesareaVisualizer.tsx");

console.log("All 7 standalone modules written!");

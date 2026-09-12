const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");
const iconMap = require("./icon_map.json");

function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

const start = bundle.indexOf("n4=()=>{const[t,i]=ie.useState(\"ALL\"),[n,o]=ie.useState(6.5)");
const end = bundle.indexOf(",c4=()=>{const[t,i]=ie.useState(Dl)", start);
const code = bundle.slice(start, end);

const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(code)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

console.log("n4 identifiers:", [...usedIdentifiers]);

const iconDeclarations = [];
for (const id of usedIdentifiers) {
  if (iconMap[id]) {
    const iconName = toPascalCase(iconMap[id]);
    iconDeclarations.push(`const ${id} = (LucideIcons as any).${iconName} || LucideIcons.HelpCircle;`);
  }
}

const content = `// PreeclampsiaParaclinicosSimulator.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import * as LucideIcons from 'lucide-react';

const e = { jsx: _jsx, jsxs: _jsxs, Fragment: _Fragment };
const ie = React;

${iconDeclarations.join("\n")}

const ${code};

export const PreeclampsiaParaclinicosSimulator = n4;
export default PreeclampsiaParaclinicosSimulator;
`;

fs.writeFileSync("src/components/education/PreeclampsiaParaclinicosSimulator.tsx", content);
console.log("Written PreeclampsiaParaclinicosSimulator.tsx successfully!");

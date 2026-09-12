const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");
const iconMap = require("./icon_map.json");

function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

const pos = bundle.indexOf("el=[{id:\"TROPHOBLAST\"");
const endL4 = bundle.indexOf(",Dl={", pos);
const code = bundle.slice(pos, endL4);

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

const content = `// PreeclampsiaVisualAtlas8Laminas.tsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from 'react/jsx-runtime';
import * as LucideIcons from 'lucide-react';

const e = { jsx: _jsx, jsxs: _jsxs, Fragment: _Fragment };
const ie = React;

${iconDeclarations.join("\n")}

const ${code};

export const PreeclampsiaVisualAtlas8Laminas = l4;
export default PreeclampsiaVisualAtlas8Laminas;
`;

fs.writeFileSync("src/components/education/PreeclampsiaVisualAtlas8Laminas.tsx", content);
console.log("Generated PreeclampsiaVisualAtlas8Laminas.tsx successfully!");

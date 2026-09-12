const fs = require("fs");
const g4 = fs.readFileSync("./g4_raw.js", "utf8");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");
const iconMap = require("./icon_map.json");

// find all e.jsx(IDENT, ...)
const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(g4)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

const icons = [];
const nonIcons = [];
for (const id of usedIdentifiers) {
  if (iconMap[id]) icons.push(id);
  else nonIcons.push(id);
}

console.log("g4 non-icons:", nonIcons);

// Also let us check what functions or global variables g4 calls
// like Ru, on, f0, etc.
// Let us search for occurrences of function calls in g4:
const calls = g4.match(/([a-zA-Z0-9_$]+)\(/g) || [];
const uniqueCalls = new Set(calls.map(c => c.replace("(", "")));
const standard = new Set(["useState", "useEffect", "useMemo", "useRef", "useCallback", "Math", "Number", "String", "Boolean", "Array", "Object", "parseInt", "parseFloat", "setTimeout", "clearTimeout", "setInterval", "clearInterval", "navigator", "console", "encodeURIComponent", "decodeURIComponent", "alert", "prompt", "confirm", "jsx", "jsxs", "Fragment", "e", "ie", "t", "i", "n", "o", "d", "c", "g", "m", "x", "f", "v", "E", "S", "y", "N", "k", "B", "D", "J", "Q", "H", "me", "we", "ve", "Z", "M", "oe", "R", "G", "ne"]);

const customCalls = [];
for (const c of uniqueCalls) {
  if (!standard.has(c) && !iconMap[c]) {
    customCalls.push(c);
  }
}
console.log("g4 custom calls:", customCalls);

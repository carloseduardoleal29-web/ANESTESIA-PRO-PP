const fs = require("fs");
const g4 = fs.readFileSync("./g4_raw.js", "utf8");
const iconMap = require("./icon_map.json");

// Let us find all identifiers used in g4
// Icons in g4:
const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(g4)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

const icons = [];
const comps = [];
for (const id of usedIdentifiers) {
  if (iconMap[id]) {
    icons.push({ id, iconName: iconMap[id] });
  } else {
    comps.push(id);
  }
}
console.log("Used icons count:", icons.length);
console.log("Icons:", icons);
console.log("Subcomponents count:", comps.length);
console.log("Subcomponents:", comps);

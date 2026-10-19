const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");
const iconMap = require("./icon_map.json");

const pos = bundle.indexOf("el=[{id:\"TROPHOBLAST\"");
const endL4 = bundle.indexOf(",Dl={", pos);
const code = bundle.slice(pos, endL4);

// find all e.jsx(IDENT, ...)
const regex = /e\.jsxs?\(([a-zA-Z0-9_$]+),/g;
let m;
const usedIdentifiers = new Set();
while ((m = regex.exec(code)) !== null) {
  if (m[1] !== "e") usedIdentifiers.add(m[1]);
}

console.log("Used identifiers in el+o4+l4:", [...usedIdentifiers]);
for (const id of usedIdentifiers) {
  console.log(`${id}: ${iconMap[id]}`);
}

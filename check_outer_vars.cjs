const fs = require("fs");
const acorn = require("acorn");

const files = [
  "x4_extracted.js",
  "n4_extracted.js",
  "m4_extracted.js",
  "o4_l4.js",
  "g4_raw.js",
  "S4_extracted.js",
  "w4_extracted.js",
  "N4_extracted.js",
  "A4_extracted.js",
  "j4_extracted.js"
];

for (const f of files) {
  const code = fs.readFileSync("./" + f, "utf8");
  // Let us inspect matches for identifiers that look like outer scope variables
  // Typically variables like el, Lg, Dl, etc.
  const words = new Set(code.match(/[a-zA-Z0-9_$]+/g));
  console.log(`File ${f} (${code.length} bytes): total words ${words.size}`);
}

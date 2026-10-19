const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const pos = bundle.indexOf("E4=({initialResourceId:t");
console.log("Total bundle length:", bundle.length);
console.log("E4 position:", pos);

// search for where g4 is used after pos:
let i = pos;
while ((i = bundle.indexOf("g4", i)) !== -1) {
  console.log("Found g4 at", i, ":", bundle.slice(i - 20, i + 40));
  i += 2;
  if (i > pos + 100000) break;
}

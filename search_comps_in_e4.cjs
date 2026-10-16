const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const pos = bundle.indexOf("E4=({initialResourceId:t");
const slice = bundle.slice(pos, pos + 45000);

['g4', 'S4', 'w4', 'N4', 'A4', 'j4'].forEach(name => {
  let i = 0;
  while ((i = slice.indexOf(name, i)) !== -1) {
    console.log(`Found ${name} at ${i}:`, slice.slice(i - 20, i + 60));
    i += name.length;
  }
});

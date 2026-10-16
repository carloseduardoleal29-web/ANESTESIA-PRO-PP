const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

function getBetween(startStr, endStr) {
  const start = bundle.indexOf(startStr);
  if (start === -1) throw new Error("Not found: " + startStr);
  const end = bundle.indexOf(endStr, start);
  if (end === -1) throw new Error("Not found: " + endStr);
  return bundle.slice(start, end);
}

// j4: Elaine Bromiley
const j4Code = getBetween("j4=()=>{const[t,i]=ie.useState(0)", ",N4=({onDownload:t})=>{");
fs.writeFileSync("./j4_extracted.js", j4Code);
console.log("j4 length:", j4Code.length);

// N4: FONA Crico
const N4Code = getBetween("N4=({onDownload:t})=>{", ",A4=()=>{const[t,i]=ie.useState(!1)");
fs.writeFileSync("./N4_extracted.js", N4Code);
console.log("N4 length:", N4Code.length);

// A4: Aminofilina CPPD
const A4Code = getBetween("A4=()=>{const[t,i]=ie.useState(!1)", ",w4=({onDownload:t})=>{");
fs.writeFileSync("./A4_extracted.js", A4Code);
console.log("A4 length:", A4Code.length);

// w4: Orexina
const w4Code = getBetween("w4=({onDownload:t})=>{", ",S4=({onDownload:t})=>{");
fs.writeFileSync("./w4_extracted.js", w4Code);
console.log("w4 length:", w4Code.length);

// S4: ERAS Cesarea
const S4Code = getBetween("S4=({onDownload:t})=>{", ",E4=({initialResourceId:t");
fs.writeFileSync("./S4_extracted.js", S4Code);
console.log("S4 length:", S4Code.length);

console.log("All missing modules extracted successfully!");

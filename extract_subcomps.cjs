const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

function getBetween(startStr, endStr) {
  const start = bundle.indexOf(startStr);
  if (start === -1) throw new Error("Not found: " + startStr);
  const end = bundle.indexOf(endStr, start);
  if (end === -1) throw new Error("Not found: " + endStr);
  return bundle.slice(start, end);
}

// 1. x4
const x4Code = getBetween("x4=({onNavigateToTab:t})=>{", ",b4=({onNavigateToTab:t})=>{");
fs.writeFileSync("./x4_extracted.js", x4Code);
console.log("x4 length:", x4Code.length);

// 2. n4
const n4Code = getBetween("n4=()=>{const[t,i]=ie.useState(\"ALL\"),[n,o]=ie.useState(6.5)", ",c4=()=>{const[t,i]=ie.useState(Dl)");
fs.writeFileSync("./n4_extracted.js", n4Code);
console.log("n4 length:", n4Code.length);

// 3. m4
const m4Code = getBetween("m4=()=>{const[t,i]=ie.useState(\"presinaptico\")", ",x4=({onNavigateToTab:t})=>{");
fs.writeFileSync("./m4_extracted.js", m4Code);
console.log("m4 length:", m4Code.length);

console.log("Success!");

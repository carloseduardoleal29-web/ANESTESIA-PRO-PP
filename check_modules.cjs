const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const modules = [
  { name: "S4_eras", search: "S4=({onDownload:t})=>{" },
  { name: "w4_orexina", search: "w4=({onDownload:t})=>{" },
  { name: "N4_fona", search: "N4=({onDownload:t})=>{" },
  { name: "A4_aminofilina", search: "A4=()=>{" },
  { name: "j4_elaine", search: "j4=()=>{" },
  { name: "n4_paraclinicos", search: "n4=()=>{" },
  { name: "x4_placenta", search: "x4=({onNavigateToTab:t})=>{" },
  { name: "m4_nmda", search: "m4=()=>{" }
];

for (const mod of modules) {
  const start = bundle.indexOf(mod.search);
  console.log(`${mod.name} start at ${start}`);
}

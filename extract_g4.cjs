const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const start = bundle.indexOf("g4=()=>{const[t,i]=ie.useState(\"fisiopatologia\")");
const end = bundle.indexOf("Og=[{id:\"res-preeclampsia", start);
console.log("g4 start:", start, "end:", end, "len:", end - start);

fs.writeFileSync("./g4_raw.js", bundle.slice(start, end));
console.log("Saved ./g4_raw.js");

const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const pos = bundle.indexOf("u4=()=>{const[t,i]=ie.useState(\"70\")");
console.log("u4 start:", pos);
const end = bundle.indexOf(";const s4=", pos);
console.log("u4 end:", end, "len:", end - pos);

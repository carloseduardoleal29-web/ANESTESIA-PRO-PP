const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const start = bundle.indexOf("el=[{");
const end = bundle.indexOf("];", start);
console.log("el:", bundle.slice(start, end + 2));

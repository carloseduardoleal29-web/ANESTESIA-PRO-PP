const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

// let us see the variable declaration where el begins:
const pos = bundle.indexOf("el=[{id:\"TROPHOBLAST\"");
console.log("Before el:", bundle.slice(pos - 30, pos));
const endL4 = bundle.indexOf(",Dl={", pos);
console.log("el + o4 + l4 length:", endL4 - pos);
console.log("After l4:", bundle.slice(endL4, endL4 + 40));

const fs = require("fs");

const bundle = fs.readFileSync("/tmp/netlify_bundle.js", "utf8");

// search from 1500000 to 1540000
const chunk = bundle.slice(1500000, 1540000);
const o4Rel = chunk.indexOf("o4={");
const l4Rel = chunk.indexOf("l4=");
console.log("o4Rel:", o4Rel, "l4Rel:", l4Rel);

if (o4Rel !== -1 && l4Rel !== -1) {
  const o4Abs = 1500000 + o4Rel;
  const nextConst = bundle.indexOf("const ", 1500000 + l4Rel + 50);
  console.log("o4Abs:", o4Abs, "nextConst:", nextConst);
  fs.writeFileSync("/tmp/o4_l4.js", bundle.slice(o4Abs, nextConst));
  console.log("Saved /tmp/o4_l4.js, size:", nextConst - o4Abs);
}

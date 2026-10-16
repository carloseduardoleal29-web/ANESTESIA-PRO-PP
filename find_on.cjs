const fs = require("fs");
const g4 = fs.readFileSync("./g4_raw.js", "utf8");

let idx = 0;
while ((idx = g4.indexOf("on(", idx)) !== -1) {
  console.log("on( at", idx, ":", g4.slice(idx - 30, idx + 50));
  idx += 3;
}

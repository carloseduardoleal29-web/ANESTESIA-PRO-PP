const fs = require("fs");
const bundle = fs.readFileSync("./netlify_bundle.js", "utf8");

const iconMap = {};
const regex = /([a-zA-Z0-9_$]+)=\$e\("([^"]+)"/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  iconMap[m[1]] = m[2];
}
fs.writeFileSync("./icon_map.json", JSON.stringify(iconMap, null, 2));
console.log("Saved icon_map.json, total:", Object.keys(iconMap).length);

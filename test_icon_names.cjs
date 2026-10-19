const fs = require("fs");
const iconMap = require("./icon_map.json");

// Map kebab-case or lower-case to PascalCase for Lucide icons
function toPascalCase(str) {
  return str.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}

console.log("download ->", toPascalCase("download"));
console.log("share-2 ->", toPascalCase("share-2"));
console.log("circle-check ->", toPascalCase("circle-check"));
console.log("triangle-alert ->", toPascalCase("triangle-alert"));

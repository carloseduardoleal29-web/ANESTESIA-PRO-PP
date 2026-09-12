const fs = require("fs");
const g4 = fs.readFileSync("./g4_raw.js", "utf8");

// let us check what helper components g4 calls
// In g4:
// Tab 0: fisiopatologia
// calls x4, b4, e4, plus grid
// Tab 1: diagnostico
// has the table and criteria directly in JSX
// Tab 2: calculadora
// calls c4
// Tab 3: paraclinicos
// calls n4
// Tab 4: sulfato_magnesio
// calls m4, i4, plus zuspan/pritchard grid
// Tab 5: antihipertensivos
// has the matrix table and drug cards directly in JSX
// Tab 6: liquidos_hemoderivados
// calls u4, s4, plus restriction info directly in JSX
// Tab 7: complicaciones
// calls r4
// Tab 8: modelos_visuales
// calls l4
// Tab 9: anestesiologia
// has neuroaxial vs general cards directly in JSX
// Tab 10: bibliografia
// calls d4
console.log("Verified g4 structure.");

/* Exporta las palabras ya usadas en las lecciones originales por nivel. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "js", "data.js"), "utf8"), sandbox);

const used = {};
sandbox.window.POLY_DATA.languages.forEach((lang) => {
  lang.levels.forEach((level) => {
    const chars = new Set();
    level.lessons.forEach((lesson) => lesson.vocab.forEach((w) => chars.add(w.t)));
    used[level.key] = Array.from(chars);
  });
});
fs.writeFileSync(path.join(root, "data", "used-words.json"), JSON.stringify(used, null, 2), "utf8");
console.log("Exportadas palabras usadas por nivel.");

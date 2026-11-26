/* Extrae los textos a pronunciar de js/data.js y crea:
   - assets/audio/manifest.json  (un MP3 por lección)
   - assets/audio/clips.json     (un MP3 por palabra y por frase)
   Uso: node tools/export_audio_manifest.js */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dataFile = path.join(__dirname, "..", "js", "data.js");
const audioDir = path.join(__dirname, "..", "assets", "audio");
const manifestFile = path.join(audioDir, "manifest.json");
const clipsFile = path.join(audioDir, "clips.json");

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(dataFile, "utf8"), sandbox, { filename: dataFile });

const data = sandbox.window.POLY_DATA;
const manifest = {};
const clips = [];

data.languages.forEach((lang) => {
  lang.levels.forEach((level) => {
    level.lessons.forEach((lesson) => {
      const words = lesson.vocab.map((w) => w.t).join(", ");
      const phrases = lesson.phrases.map((p) => p.t).join(". ");
      manifest[lesson.id] = {
        lang: lang.voice,
        title: `${lang.name} · ${level.name} · ${lesson.title}`,
        text: `${words}. ${phrases}.`,
      };

      lesson.vocab.forEach((w, i) => {
        clips.push({
          id: `${lesson.id}-v${i}`,
          lang: lang.voice,
          text: w.t,
          file: `clips/${lang.id}/${lesson.id}/v${i}.mp3`,
        });
      });
      lesson.phrases.forEach((p, i) => {
        clips.push({
          id: `${lesson.id}-p${i}`,
          lang: lang.voice,
          text: p.t,
          file: `clips/${lang.id}/${lesson.id}/p${i}.mp3`,
        });
      });
    });
  });
});

/* Lecciones generadas por build_lessons.py */
const generatedFile = path.join(__dirname, "..", "data", "generated-lessons.json");
if (fs.existsSync(generatedFile)) {
  const generated = JSON.parse(fs.readFileSync(generatedFile, "utf8"));
  const registryPath = path.join(__dirname, "..", "data", "exam-levels.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
  generated.forEach((lesson) => {
    const meta = registry.find((r) => r.id === lesson.levelKey);
    const voice = meta ? meta.voice : "zh-CN";
    const dir = meta ? meta.dir : "zh";
    const words = lesson.vocab.map((w) => w.t).join(", ");
    const phrases = lesson.phrases.map((p) => p.t).join(". ");
    // Los botones de palabra/frase de estas lecciones reutilizan los MP3
    // de las listas de examen, así que solo se genera el audio de la lección.
    manifest[lesson.id] = { lang: voice, title: lesson.title, text: `${words}. ${phrases}.` };
  });
}

/* Listas oficiales: se leen del registro generado por build_all_lists.py */
const registryFile = path.join(__dirname, "..", "data", "exam-levels.json");
const EXAM_LISTS = fs.existsSync(registryFile)
  ? JSON.parse(fs.readFileSync(registryFile, "utf8")).map((r) => ({ level: r.id, lang: r.voice, dir: r.dir }))
  : [
      { level: "hsk1", lang: "zh-CN", dir: "zh" },
      { level: "hsk2", lang: "zh-CN", dir: "zh" },
      { level: "jlpt-n5", lang: "ja-JP", dir: "ja" },
      { level: "topik-1", lang: "ko-KR", dir: "ko" },
    ];
EXAM_LISTS.forEach(({ level, lang, dir }) => {
  const listFile = path.join(__dirname, "..", "data", `${level}.json`);
  if (!fs.existsSync(listFile)) return;
  const list = JSON.parse(fs.readFileSync(listFile, "utf8"));
  list.words.forEach((w) => {
    clips.push({
      id: `${level}-${w.id}`,
      lang,
      text: w.char,
      file: `clips/${dir}/${level}/w${w.id}.mp3`,
    });
  });
});

fs.mkdirSync(audioDir, { recursive: true });
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2), "utf8");
fs.writeFileSync(clipsFile, JSON.stringify(clips, null, 2), "utf8");
console.log(`Manifiestos escritos: ${Object.keys(manifest).length} lecciones y ${clips.length} clips.`);

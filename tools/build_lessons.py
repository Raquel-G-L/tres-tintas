#!/usr/bin/env python3
"""Genera lecciones de bloque para los niveles con pocas lecciones.

Objetivo: 6 lecciones por nivel, a partir de las listas oficiales de examen.

Escribe:
  js/generated-lessons.js    (parchea POLY_DATA al cargar)
  data/generated-lessons.json (para el manifest de audio)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
TARGET = 6
PER_LESSON = 10


def clean(text):
    return (text or "").split(";")[0].strip()


def make_lesson(level_id, level_name, words, number, lang, lang_dir):
    start = (number - 1) * PER_LESSON + 1
    sample = words[:PER_LESSON]
    vocab = [{
        "t": w["char"],
        "r": w.get("reading") or w.get("romaji") or w.get("pinyin") or "",
        "m": clean(w["es"]),
    } for w in sample]
    examples = [[v["t"], v["r"], v["m"]] for v in vocab[:3]]
    phrases = []
    for w in sample[:4]:
        if w.get("example"):
            phrases.append([w["example"], w.get("exampleEn", ""), clean(w["es"])])
        else:
            reading = w.get("reading") or w.get("romaji") or w.get("pinyin") or ""
            phrases.append([w["char"], reading, clean(w["es"])])
    options_pool = [v["m"] for v in vocab]
    quiz = []
    for i in range(3):
        correct = vocab[i]["m"]
        distractors = [o for o in options_pool if o != correct][:3]
        answer = i % 4
        opts = distractors[:answer] + [correct] + distractors[answer:]
        quiz.append({
            "question": f"¿Qué significa «{vocab[i]['t']}»?",
            "options": opts[:4],
            "answer": answer,
            "explain": f"{vocab[i]['t']} ({vocab[i]['r']}) = {correct}.",
        })
    return {
        "id": f"{level_id}-u{number}",
        "title": f"{level_name} · Bloque {number}",
        "desc": f"Palabras {start}-{start + len(vocab) - 1} del vocabulario oficial de {level_name}.",
        "char": vocab[0]["t"],
        "theory": [{
            "title": "Vocabulario del nivel",
            "text": f"Este bloque reúne {len(vocab)} palabras del nivel {level_name} tomadas de su lista oficial. Estúdialas con el audio y las tarjetas; usa los tests para comprobarlas.",
            "examples": examples,
        }],
        "vocab": vocab,
        "phrases": phrases,
        "quiz": quiz,
        "langId": lang,
        "levelKey": level_id,
        "audio": f"assets/audio/{lang_dir}/{level_id}-u{number}.mp3",
    }


def main():
    registry = json.loads((DATA / "exam-levels.json").read_text(encoding="utf-8"))
    all_generated = []
    by_level = {}

    for meta in registry:
        level_id = meta["id"]
        current = 10 if level_id in ("hsk1", "hsk2") else 2
        need = TARGET - current
        if need <= 0:
            continue
        payload = json.loads((DATA / f"{level_id}.json").read_text(encoding="utf-8"))
        used = {w["char"] for w in payload["words"][:PER_LESSON * 4]}
        available = [w for w in payload["words"] if w["char"] not in used]
        lessons = []
        for n in range(1, need + 1):
            chunk = available[(n - 1) * PER_LESSON:n * PER_LESSON]
            if not chunk:
                break
            lessons.append(make_lesson(level_id, meta["name"], chunk, n, meta["lang"], meta["dir"]))
        by_level[level_id] = lessons
        all_generated.extend(lessons)
        print(f"{meta['name']}: +{len(lessons)} lecciones", flush=True)

    (DATA / "generated-lessons.json").write_text(
        json.dumps(all_generated, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    payload = {"levelLangs": {r["id"]: r["lang"] for r in registry}, "lessons": by_level}
    (ROOT / "js" / "generated-lessons.js").write_text(
        "(function(){\n"
        "  if (!window.POLY_DATA) return;\n"
        "  var data = " + json.dumps(payload, ensure_ascii=False) + ";\n"
        "  Object.keys(data.lessons).forEach(function(levelId){\n"
        "    var meta = window.POLY_EXAM_LEVELS && window.POLY_EXAM_LEVELS.find(function(r){return r.id===levelId});\n"
        "    var langId = meta ? meta.lang : data.levelLangs[levelId];\n"
        "    var lang = window.POLY_DATA.findLanguage(langId);\n"
        "    var level = lang && lang.levels.find(function(l){return l.key===levelId});\n"
        "    if (!level) return;\n"
        "    data.lessons[levelId].forEach(function(lesson){\n"
        "      level.lessons.push(lesson);\n"
        "      window.POLY_DATA.allLessons.push(lesson);\n"
        "    });\n"
        "  });\n"
        "})();\n",
        encoding="utf-8",
    )
    print(f"Total nuevas lecciones: {len(all_generated)}", flush=True)


if __name__ == "__main__":
    main()

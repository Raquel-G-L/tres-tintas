#!/usr/bin/env python3
"""Genera lecciones hasta cubrir TODO el vocabulario oficial de cada nivel.

Una lección = 20 palabras nuevas. Las palabras ya usadas en las lecciones
escritas a mano se omiten. Los botones de audio apuntan a los MP3 de las
listas de examen que ya existen; solo se genera un MP3 por lección nueva.

Escribe:
  js/generated-lessons.js     (parchea POLY_DATA al cargar)
  data/generated-lessons.json (para el manifest de audio)
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
PER_LESSON = 20


def clean(text):
    return (text or "").split(";")[0].strip()


def make_lesson(level_id, level_name, words, number, lang, lang_dir, level_key):
    start = (number - 1) * PER_LESSON + 1
    sample = words[:PER_LESSON]
    vocab = []
    for w in sample:
        reading = w.get("reading") or w.get("romaji") or w.get("pinyin") or ""
        vocab.append({
            "t": w["char"],
            "r": reading,
            "m": clean(w["es"]),
            "audio": f"assets/audio/clips/{lang_dir}/{level_id}/w{w['id']}.mp3",
        })
    examples = [[v["t"], v["r"], v["m"]] for v in vocab[:3]]
    phrases = []
    for w in sample[:4]:
        reading = w.get("reading") or w.get("romaji") or w.get("pinyin") or ""
        phrases.append({
            "t": w["example"] if w.get("example") else w["char"],
            "r": w.get("exampleEn", "") if w.get("example") else reading,
            "m": clean(w["es"]),
            "audio": f"assets/audio/clips/{lang_dir}/{level_id}/w{w['id']}.mp3",
        })
    options_pool = [v["m"] for v in vocab]
    quiz = []
    for i in range(min(3, len(vocab))):
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
        "generated": True,
        "theory": [{
            "title": "Vocabulario del nivel",
            "text": f"Este bloque reúne {len(vocab)} palabras del nivel {level_name} tomadas de su lista oficial. Estúdialas con el audio y las tarjetas; usa los tests para comprobarlas.",
            "examples": examples,
        }],
        "vocab": vocab,
        "phrases": phrases,
        "quiz": quiz,
        "langId": lang,
        "levelKey": level_key,
        "audio": f"assets/audio/{lang_dir}/{level_id}-u{number}.mp3",
    }


def main():
    registry = json.loads((DATA / "exam-levels.json").read_text(encoding="utf-8"))
    used = json.loads((DATA / "used-words.json").read_text(encoding="utf-8"))
    all_generated = []
    by_level = {}

    for meta in registry:
        level_id = meta["id"]
        payload = json.loads((DATA / f"{level_id}.json").read_text(encoding="utf-8"))
        used_chars = set(used.get(level_id, []))
        available = [w for w in payload["words"] if w["char"] not in used_chars]
        total_lessons = math.ceil(len(payload["words"]) / PER_LESSON)
        existing = len([x for x in used_chars])
        need = max(0, total_lessons - (existing // PER_LESSON))
        lessons = []
        for n in range(1, need + 1):
            chunk = available[(n - 1) * PER_LESSON:n * PER_LESSON]
            if not chunk:
                break
            lessons.append(make_lesson(level_id, meta["name"], chunk, n, meta["lang"], meta["dir"], meta["levelKey"]))
        by_level[level_id] = lessons
        all_generated.extend(lessons)
        print(f"{meta['name']}: {len(payload['words'])} palabras -> +{len(lessons)} lecciones", flush=True)

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
        "    var key = meta && meta.levelKey ? meta.levelKey : levelId;\n"
        "    var level = lang && lang.levels.find(function(l){return l.key===key});\n"
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

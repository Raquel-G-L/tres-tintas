#!/usr/bin/env python3
"""Traduce las palabras TOPIK pendientes con un diccionario coreano→español.

Fuente: https://github.com/kenantang/Dictionary-MKG (ko_dict_in_ko_ja_es.json)
El JSON contiene, para cada palabra, una explicación en coreano, japonés y
español. Solo se toca `es` cuando sigue igual que la palabra coreana.

Uso: python tools/translate_topik_dict.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
SOURCE = Path(r"C:\Windows\Temp\opencode\ko_es.json")

KOREAN = re.compile(r"[\uac00-\ud7af]")
JAPANESE = re.compile(r"[\u3040-\u30ff]")
LATIN = re.compile(r"[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]")


def spanish_gloss(response):
    lines = response.split("\n")
    in_meaning = False
    for line in lines:
        if line.strip() == "**[뜻]**":
            in_meaning = True
            continue
        if not in_meaning:
            continue
        if line.strip() == "---" or line.startswith("**[활용 문구]**"):
            break
        stripped = line.strip()
        if LATIN.search(stripped) and not KOREAN.search(stripped) and not JAPANESE.search(stripped):
            text = re.sub(r"\*\*", "", stripped).strip()
            if 3 < len(text) < 160:
                return text
    return ""


def main():
    entries = json.loads(SOURCE.read_text(encoding="utf-8"))
    mapping = {}
    for item in entries:
        word = (item.get("word") or {}).get("word", "").strip()
        gloss = spanish_gloss(item.get("responses", ""))
        if word and gloss and word not in mapping:
            mapping[word] = gloss
    print(f"Diccionario coreano-es: {len(mapping)} entradas", flush=True)

    total = 0
    for level in sorted(p.stem for p in DATA.glob("topik-*.json")):
        path = DATA / f"{level}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        fixed = 0
        for w in payload["words"]:
            if w.get("es") != w.get("char"):
                continue
            gloss = mapping.get(w["char"])
            if gloss:
                w["es"] = gloss
                fixed += 1
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        total += fixed
        print(f"{level}: corregidas {fixed}/{payload['count']}", flush=True)

    registry = json.loads((DATA / "exam-levels.json").read_text(encoding="utf-8"))
    all_data = {}
    for r in registry:
        payload = json.loads((DATA / f"{r['id']}.json").read_text(encoding="utf-8"))
        payload["count"] = len(payload["words"])
        all_data[r["id"]] = payload
    (ROOT / "js" / "exam-data-all.js").write_text(
        "window.POLY_EXAM_DATA = " + json.dumps(all_data, ensure_ascii=False) + ";\n"
        + "window.POLY_EXAM_LEVELS = " + json.dumps(registry, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    print(f"Total corregidas: {total}.", flush=True)


if __name__ == "__main__":
    main()

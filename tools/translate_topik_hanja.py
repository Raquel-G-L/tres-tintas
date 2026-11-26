#!/usr/bin/env python3
"""Traduce palabras coreanas pendientes usando sus hanja.

Los hanja se convierten a chino simplificado con OpenCC y se buscan en los
significados en español ya presentes en las listas HSK/JLPT.

Requisito: pip install opencc-python-reimplemented
"""
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

try:
    import opencc
except ImportError:
    sys.exit("Instala opencc-python-reimplemented: python -m pip install opencc-python-reimplemented")

converter = opencc.OpenCC("t2s")


def main():
    meaning = {}
    source_levels = sorted({p.stem for p in DATA.glob("*.json") if p.stem.startswith(("hsk", "jlpt-"))})
    for level in source_levels:
        payload = json.loads((DATA / f"{level}.json").read_text(encoding="utf-8"))
        for w in payload["words"]:
            if w.get("es") and w["es"] != w.get("en") and w["char"] not in meaning:
                meaning[w["char"]] = w["es"].split(";")[0].strip()
    print(f"Mapa chino→español: {len(meaning)} caracteres", flush=True)

    total = 0
    for level in sorted(p.stem for p in DATA.glob("topik-*.json")):
        path = DATA / f"{level}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        fixed = 0
        for w in payload["words"]:
            if w.get("es") != w.get("char"):
                continue
            hanja = (w.get("hanja") or "").replace("-", "").strip()
            if not hanja:
                continue
            simplified = converter.convert(hanja)
            if simplified in meaning:
                w["es"] = meaning[simplified]
                fixed += 1
                continue
            parts = [meaning.get(ch) for ch in simplified]
            parts = [p for p in parts if p]
            if parts:
                w["es"] = " ".join(dict.fromkeys(parts))[:100]
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

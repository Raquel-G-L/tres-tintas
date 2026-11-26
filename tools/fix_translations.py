#!/usr/bin/env python3
"""Corrige las glosas que quedaron igual que el original.

Se ejecuta DESPUÉS de generar los audios para no saturar la red.
Usa lotes pequeños y pocos workers para evitar límites de la API.
"""
import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import build_exam_lists as helper

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
LEVELS = [p.stem for p in DATA.glob("hsk*.json")] + [p.stem for p in DATA.glob("jlpt-*.json")] + [p.stem for p in DATA.glob("topik-*.json")]
LEVELS = sorted(set(LEVELS))


def translate_chunk(items, sl):
    texts = [item[1] for item in items]
    for attempt in range(5):
        try:
            result = helper.translate_batch(texts, sl, "es")
            if result and len(result) == len(texts):
                return list(zip([item[0] for item in items], result))
        except Exception:  # noqa: BLE001
            pass
        time.sleep(4 * (attempt + 1))
    return []


def fix_level(level):
    path = DATA / f"{level}.json"
    payload = json.loads(path.read_text(encoding="utf-8"))
    is_korean = level.startswith("topik")
    sl = "ko" if is_korean else "en"
    pending = []
    for w in payload["words"]:
        source = w.get("example") or w["char"] if is_korean else w["en"]
        if not source:
            continue
        if is_korean:
            if w["es"] == w["char"] or not w["es"]:
                pending.append((w["id"], source))
        elif w["es"] == w["en"] or not w["es"]:
            pending.append((w["id"], source))
    if not pending:
        return level, 0, 0

    fixed = 0
    chunks = [pending[i:i + 8] for i in range(0, len(pending), 8)]
    with ThreadPoolExecutor(max_workers=2) as pool:
        futures = [pool.submit(translate_chunk, chunk, sl) for chunk in chunks]
        for future in as_completed(futures):
            pairs = future.result()
            by_id = {w["id"]: w for w in payload["words"]}
            for wid, es in pairs:
                w = by_id.get(wid)
                if w and es and es != w["en"] and es != w["char"]:
                    w["es"] = es
                    fixed += 1
            time.sleep(0.4)

    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return level, len(pending), fixed


def rebuild_bundle():
    all_data = {}
    registry = json.loads((DATA / "exam-levels.json").read_text(encoding="utf-8"))
    for r in registry:
        payload = json.loads((DATA / f"{r['id']}.json").read_text(encoding="utf-8"))
        payload["count"] = len(payload["words"])
        all_data[r["id"]] = payload
    (ROOT / "js" / "exam-data-all.js").write_text(
        "window.POLY_EXAM_DATA = " + json.dumps(all_data, ensure_ascii=False) + ";\n"
        + "window.POLY_EXAM_LEVELS = " + json.dumps(registry, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )


def main():
    for level in LEVELS:
        level, pending, fixed = fix_level(level)
        print(f"{level}: pendientes={pending} corregidas={fixed}", flush=True)
    rebuild_bundle()
    print("exam-data-all.js regenerado.", flush=True)


if __name__ == "__main__":
    main()

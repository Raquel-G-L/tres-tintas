#!/usr/bin/env python3
"""Genera TODAS las listas de examen del proyecto en un único archivo JS.

Niveles: HSK 1-6, JLPT N5-N1 y TOPIK 1-6.
Fuentes públicas citadas en data/exam-levels.json.
Las glosas en español se traducen por lotes y se guardan localmente.

Uso:
  python tools/build_all_lists.py
"""
import json
import re
import time
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import build_exam_lists as helper  # reutiliza translate_batch y mapas de corrección

ROOT = Path(__file__).resolve().parent.parent
TMP = Path(r"C:\Windows\Temp\opencode")
OUT_DIR = ROOT / "data"

HSK_LEVELS = {
    "hsk1": ("HSK 1", "zh", "zh-CN", "zh", "hsk1"),
    "hsk2": ("HSK 2", "zh", "zh-CN", "zh", "hsk2"),
    "hsk3": ("HSK 3", "zh", "zh-CN", "zh", "hsk3"),
    "hsk4": ("HSK 4", "zh", "zh-CN", "zh", "hsk4"),
    "hsk5": ("HSK 5", "zh", "zh-CN", "zh", "hsk5"),
    "hsk6": ("HSK 6", "zh", "zh-CN", "zh", "hsk6"),
}
JLPT_LEVELS = {
    "jlpt-n5": ("JLPT N5", "ja", "ja-JP", "ja", "n5"),
    "jlpt-n4": ("JLPT N4", "ja", "ja-JP", "ja", "n4"),
    "jlpt-n3": ("JLPT N3", "ja", "ja-JP", "ja", "n3"),
    "jlpt-n2": ("JLPT N2", "ja", "ja-JP", "ja", "n2"),
    "jlpt-n1": ("JLPT N1", "ja", "ja-JP", "ja", "n1"),
}
TOPIK_LEVELS = {
    f"topik-{i}": (f"TOPIK {i}", "ko", "ko-KR", "ko", f"topik{i}") for i in range(1, 7)
}
ALL_LEVELS = {**HSK_LEVELS, **JLPT_LEVELS, **TOPIK_LEVELS}

SOURCES = {
    "hsk": "https://github.com/drkameleon/complete-hsk-vocabulary (MIT)",
    "jlpt": "https://github.com/evanclan/OpenJLPT (CC BY-SA 4.0)",
    "topik": "https://github.com/julienshim/combined_korean_vocabulary_list (MIT)",
}


def translate_many(texts, sl, tl):
    """Traduce una lista de textos en lotes de 20, en paralelo."""
    unique = sorted({t for t in texts if t})
    batches = [unique[i:i + 20] for i in range(0, len(unique), 20)]

    def work(batch):
        for attempt in range(3):
            try:
                result = helper.translate_batch(batch, sl, tl)
                if result and len(result) == len(batch):
                    return dict(zip(batch, result))
            except Exception:  # noqa: BLE001
                pass
            time.sleep(1 + attempt)
        return {}

    mapping = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        for part in pool.map(work, batches):
            mapping.update(part)
    return [mapping.get(t, t) for t in texts]


def load_hsk(number, name):
    path = TMP / f"hsk{number}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    words = []
    for i, item in enumerate(data, start=1):
        f = item["f"][0]
        words.append({
            "id": i, "char": item["s"], "pinyin": f["i"]["y"], "romaji": "",
            "en": f["m"][0], "es": f["m"][0], "radical": item.get("r", ""),
            "freq": item.get("q", 0), "example": "", "exampleEn": "",
        })
    es = translate_many([w["en"] for w in words], "en", "es")
    for w, value in zip(words, es):
        w["es"] = helper.JLPT_OVERRIDES.get(w["en"], value)
    return words


def load_jlpt(code, name):
    path = TMP / f"jlpt-{code}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    words = []
    for i, item in enumerate(data, start=1):
        example = (item.get("examples") or [{}])[0]
        words.append({
            "id": i, "char": item["word"], "pinyin": item.get("reading", ""),
            "romaji": item.get("romaji", ""), "en": (item.get("meanings") or [""])[0],
            "es": (item.get("meanings") or [""])[0], "radical": "", "freq": 0,
            "example": example.get("ja", ""), "exampleEn": example.get("en", ""),
            "pos": ", ".join(item.get("pos") or []),
        })
    es = translate_many([w["en"] for w in words], "en", "es")
    for w, value in zip(words, es):
        w["es"] = helper.JLPT_OVERRIDES.get(w["en"], value)
    return words


def topik_groups():
    lines = (TMP / "topik.tsv").read_text(encoding="utf-8").splitlines()
    groups = {"basic": [], "int": [], "adv": []}
    for line in lines[1:]:
        if not line.strip():
            continue
        row = line.split("\t")
        if len(row) < 7:
            continue
        rank, word, pos, hanja, explanation, nikl, topik = row[:7]
        topik = topik.strip()
        clean = re.sub(r"\d+$", "", word.strip())
        if not clean:
            continue
        try:
            r = int(rank.strip()) if rank.strip().isdigit() else 10**7
        except ValueError:
            r = 10**7
        group = "basic" if topik == "초급" else "int" if topik == "중급" else "adv"
        groups[group].append((r, clean, pos.strip(), hanja.strip(), explanation.strip()))
    for key in groups:
        groups[key].sort(key=lambda x: x[0])
    return groups


def make_topik_level(rows, name):
    words = [{
        "id": i, "char": word, "pinyin": "", "romaji": "", "hanja": hanja,
        "en": word, "es": word, "radical": "", "freq": rank,
        "example": explanation, "exampleEn": "", "pos": pos,
    } for i, (rank, word, pos, hanja, explanation) in enumerate(rows, start=1)]
    es = translate_many([w["en"] for w in words], "ko", "es")
    for w, value in zip(words, es):
        w["es"] = helper.TOPIK_OVERRIDES.get(w["char"], value)
    return words


def main():
    groups = topik_groups()
    topik_slices = {
        "topik-1": groups["basic"][:300],
        "topik-2": groups["basic"][300:],
        "topik-3": groups["int"][:len(groups["int"]) // 2],
        "topik-4": groups["int"][len(groups["int"]) // 2:],
        "topik-5": groups["adv"][:len(groups["adv"]) // 2],
        "topik-6": groups["adv"][len(groups["adv"]) // 2:],
    }

    all_data = {}
    registry = []
    for level, (name, lang, voice, directory, level_key) in ALL_LEVELS.items():
        print(f"Procesando {name}…", flush=True)
        if level in HSK_LEVELS:
            words = load_hsk(level.replace("hsk", ""), name)
            source = SOURCES["hsk"]
        elif level in JLPT_LEVELS:
            words = load_jlpt(level.replace("jlpt-", ""), name)
            source = SOURCES["jlpt"]
        else:
            words = make_topik_level(topik_slices[level], name)
            source = SOURCES["topik"]
        # Aplanar IDs a partir de 1 para cada nivel
        for i, w in enumerate(words, start=1):
            w["id"] = i
        all_data[level] = {"source": source, "level": name, "count": len(words), "words": words}
        registry.append({
            "id": level, "name": name, "lang": lang, "voice": voice,
            "dir": directory, "levelKey": level_key, "count": len(words), "source": source,
        })
        (OUT_DIR / f"{level}.json").write_text(
            json.dumps(all_data[level], ensure_ascii=False, indent=2), encoding="utf-8"
        )
        print(f"  {name}: {len(words)} palabras", flush=True)

    (ROOT / "js" / "exam-data-all.js").write_text(
        "window.POLY_EXAM_DATA = " + json.dumps(all_data, ensure_ascii=False) + ";\n"
        + "window.POLY_EXAM_LEVELS = " + json.dumps(registry, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )
    (OUT_DIR / "exam-levels.json").write_text(
        json.dumps(registry, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Escrito exam-data-all.js con {len(all_data)} niveles y "
          f"{sum(len(v['words']) for v in all_data.values())} palabras.", flush=True)


if __name__ == "__main__":
    main()

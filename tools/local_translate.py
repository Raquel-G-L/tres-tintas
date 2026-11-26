#!/usr/bin/env python3
"""Traduce las glosas pendientes con un diccionario inglés-español local.

Fuente: https://github.com/fufu70/spanish-english-json (diccionario abierto)
No usa servicios externos. Solo toca las entradas cuyo `es` sigue igual que
el original (`en`), para no sobrescribir traducciones ya corregidas.

Uso:
  python tools/local_translate.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
WORDS_JSON = Path(r"C:\Windows\Temp\opencode\en-es-words.json")
SENTENCES_JSON = Path(r"C:\Windows\Temp\opencode\en-es-sentences.json")


def clean(text):
    text = re.sub(r"\{[^}]*\}", "", text)
    text = re.sub(r"\([^)]*\)", "", text)
    text = re.sub(r"/[^/]*/", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def load_dictionary():
    raw = json.loads(WORDS_JSON.read_text(encoding="utf-8"))
    mapping = {}
    for entry in raw["list"]:
        key = entry["word"].lower().strip()
        values = [clean(v) for v in entry.get("translation", []) if clean(v)]
        if values and key not in mapping:
            mapping[key] = values[0]
    sentences = {}
    for item in json.loads(SENTENCES_JSON.read_text(encoding="utf-8")):
        en, es = item.get("en", "").lower().strip(), clean(item.get("es", ""))
        if en and es and en not in sentences:
            sentences[en] = es
    return mapping, sentences


def translate_phrase(text, mapping, sentences, depth=0):
    if not text or depth > 2:
        return ""
    key = text.lower().strip(" .;:!?")
    if key in sentences:
        return sentences[key]
    if key in mapping:
        return mapping[key]

    # Definiciones con varias aceites separadas por ;
    if "; " in text:
        parts = [translate_phrase(p, mapping, sentences, depth + 1) for p in text.split("; ")]
        parts = [p for p in parts if p]
        return "; ".join(parts) if parts else ""

    # Verbos en infinitivo: "to meet" -> "meet"
    if key.startswith("to "):
        base = key[3:]
        if base in mapping:
            return mapping[base]

    # Traducción token a token (se conservan los no encontrados)
    tokens = re.findall(r"[A-Za-zÁÉÍÓÚáéíóúñÑ]+|\d+|[^\sA-Za-z\d]+", text)
    out = []
    changed = False
    for token in tokens:
        low = token.lower()
        if low in mapping:
            out.append(mapping[low])
            changed = True
        elif low in {"of", "and", "or", "a", "an", "the", "in", "on", "at", "to", "with", "for", "by", "from"}:
            out.append({"of": "de", "and": "y", "or": "o", "a": "un", "an": "un", "the": "el",
                        "in": "en", "on": "sobre", "at": "en", "to": "a", "with": "con",
                        "for": "para", "by": "por", "from": "desde"}[low])
            changed = True
        else:
            out.append(token)
    result = "".join(out) if text.replace(" ", "") == "".join(out).replace(" ", "") else " ".join(out)
    return result.strip() if changed else ""


def main():
    mapping, sentences = load_dictionary()
    print(f"Diccionario: {len(mapping)} palabras, {len(sentences)} frases.", flush=True)
    levels = sorted({p.stem for p in DATA.glob("*.json")
                     if p.stem.startswith(("hsk", "jlpt-", "topik-"))})
    total_fixed = 0
    for level in levels:
        path = DATA / f"{level}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        fixed = 0
        is_korean = level.startswith("topik")
        for w in payload["words"]:
            if is_korean:
                # El diccionario es inglés-español: no aplica a palabras coreanas.
                continue
            if w.get("es") != w.get("en"):
                continue
            translated = translate_phrase(w["en"], mapping, sentences)
            if translated and translated.lower() != w["en"].lower() and len(translated) < 120:
                w["es"] = translated
                fixed += 1
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        total_fixed += fixed
        print(f"{level}: corregidas {fixed}/{payload['count']}", flush=True)

    # Reconstruir el bundle usado por la web
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
    print(f"Total corregidas: {total_fixed}. exam-data-all.js regenerado.", flush=True)


if __name__ == "__main__":
    main()

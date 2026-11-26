#!/usr/bin/env python3
"""Corrige glosas en español mal generadas automáticamente.

Usa el diccionariolocal en-es de fufu70 con dos mejoras:
  - para verbos ("to X") prefiere una traducción en infinitivo (-ar/-er/-ir);
  - recorta las definiciones con paréntesis/ruido del dataset original.
Además aplica un mapa de correcciones para las glosas HSK/JLPT más comunes.

Uso: python tools/fix_glosses.py
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
WORDS_JSON = Path(r"C:\Windows\Temp\opencode\en-es-words.json")

OVERRIDES = {
    "to love; to be fond of; to like": "amar; gustar",
    "to love": "amar",
    "to like; to be fond of": "gustar",
    "to like": "gustar",
    "to be fond of": "gustar",
    "to be": "ser; estar",
    "to be (followed by substantives only)": "ser",
    "to exist; to be alive": "existir; estar vivo",
    "to exist": "existir",
    "he; him (used for either sex when the sex is unknown or unimportant)": "él; le",
    "(coll.) father; dad": "papá",
    "to see": "ver",
    "to look after": "cuidar",
    "to read": "leer",
    "to write": "escribir",
    "to eat": "comer",
    "to consume": "consumir",
    "to drink": "beber",
    "to go": "ir",
    "to come": "venir",
    "to buy": "comprar",
    "to sell": "vender",
    "to say": "decir",
    "to speak": "hablar",
    "to know": "saber; conocer",
    "to think": "pensar",
    "to want": "querer",
    "to have": "tener; haber",
    "to give": "dar",
    "to take": "tomar",
    "to make": "hacer",
    "to do": "hacer",
    "to open": "abrir",
    "to close": "cerrar",
    "to come in; to enter": "entrar",
    "to sit": "sentarse",
    "to stand": "estar de pie",
    "to walk": "caminar",
    "to run": "correr",
    "to sleep": "dormir",
    "to get up": "levantarse",
    "to study": "estudiar",
    "to learn": "aprender",
    "to work": "trabajar",
    "particle indicating that a previously asked question is to be applied to the preceding word": "partícula de pregunta («¿y…?»)",
}

ENGLISH_WORDS = re.compile(r"\b(of|the|and|with|for|to|or|used|indicating|preceding|word|unknown|unimportant|followed|substantives|only|coll|surname|capital|people|Republic|China)\b", re.I)
VERB_END = re.compile(r"(ar|er|ir)(\s|$)|\b(ser|estar|tener|hacer|ir|dar|ver|decir|poder|querer|saber)\b", re.I)


def load_dict():
    raw = json.loads(WORDS_JSON.read_text(encoding="utf-8"))
    mapping = {}
    for entry in raw["list"]:
        key = entry["word"].lower().strip()
        values = []
        for v in entry.get("translation", []):
            v = re.sub(r"\{[^}]*\}", "", v)
            v = re.sub(r"\[[^\]]*\]", "", v)
            v = v.strip()
            if v and len(v) < 60:
                values.append(v)
        if values and key not in mapping:
            mapping[key] = values
    return mapping


def pick(values):
    for v in values:
        if VERB_END.search(v) and len(v) < 30:
            return v
    return values[0]


def translate(text, mapping):
    if text in OVERRIDES:
        return OVERRIDES[text]
    clean_text = re.sub(r"\([^)]*\)", "", text).strip()
    if clean_text in OVERRIDES:
        return OVERRIDES[clean_text]
    # Solo la primera acepción para evitar concatenaciones raras
    first = clean_text.split(";")[0].strip()
    if first in OVERRIDES:
        return OVERRIDES[first]
    key = first.lower()
    if key.startswith("to "):
        key = key[3:]
    elif key.startswith("be "):
        key = key[3:]
    key = key.strip()
    values = mapping.get(key)
    if values:
        result = pick(values)
        if result and result.lower() != key:
            return result
    return ""


def suspicious(es, en):
    if not es or es == en:
        return True
    if ENGLISH_WORDS.search(es):
        return True
    if len(es) > 60:
        return True
    if any(p in es for p in ("-ar estar", "semejante", "tener cariño de", "; ", "de;", " único", " sin ", " oro ")):
        return True
    return False


def main():
    mapping = load_dict()
    levels = sorted({p.stem for p in DATA.glob("*.json")
                     if p.stem.startswith(("hsk", "jlpt-", "topik-"))})
    total = 0
    for level in levels:
        if level.startswith("topik"):
            continue  # las glosas coreanas vienen del diccionario ko-es
        path = DATA / f"{level}.json"
        payload = json.loads(path.read_text(encoding="utf-8"))
        fixed = 0
        for w in payload["words"]:
            if not suspicious(w.get("es", ""), w.get("en", "")):
                continue
            new = translate(w["en"], mapping)
            if new and new != w["es"]:
                w["es"] = new
                fixed += 1
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        total += fixed
        print(f"{level}: corregidas {fixed}", flush=True)

    # Regenerar el bundle que usa la web
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
    print(f"Total corregidas: {total}", flush=True)


if __name__ == "__main__":
    main()

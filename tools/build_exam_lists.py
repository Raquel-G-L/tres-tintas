#!/usr/bin/env python3
"""Genera las listas de vocabulario JLPT N5 y TOPIK inicial.

Fuentes:
  - OpenJLPT (CC BY-SA 4.0): data/json/vocab/n5.json
  - combined_korean_vocabulary_list (MIT): results.tsv

Las glosas se traducen al español por lotes con el endpoint público de
Google Translate y se guardan localmente. La web NO llama a esta API.

Uso:
  python tools/build_exam_lists.py
"""
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JLPT_SRC = Path(r"C:\Windows\Temp\opencode\jlpt-n5.json")
TOPIK_SRC = Path(r"C:\Windows\Temp\opencode\topik.tsv")


def translate_batch(texts, sl, tl):
    """Devuelve una lista de traducciones paralela a texts."""
    joined = "|".join(t.replace("|", "/") for t in texts)
    query = urllib.parse.urlencode({
        "client": "gtx", "sl": sl, "tl": tl, "dt": "t", "q": joined,
    })
    url = "https://translate.googleapis.com/translate_a/single?" + query
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        data = json.loads(response.read().decode("utf-8"))
    translated = data[0][0][0]
    parts = translated.split("|")
    if len(parts) != len(texts):
        return None
    return parts


def translate_all(texts, sl, tl, fallback_lang):
    mapping = {}
    unique = sorted({t for t in texts if t})
    for i in range(0, len(unique), 20):
        batch = unique[i:i + 20]
        result = None
        for attempt in range(3):
            try:
                result = translate_batch(batch, sl, tl)
                break
            except Exception as exc:  # noqa: BLE001
                print(f"  reintento {attempt + 1}: {exc}", flush=True)
                time.sleep(2 * (attempt + 1))
        if result:
            mapping.update(dict(zip(batch, result)))
        else:
            for t in batch:
                mapping[t] = t if fallback_lang == "en" else ""
        time.sleep(0.3)
    return [mapping.get(t, t if fallback_lang == "en" else "") for t in texts]


def write_payload(name, global_name, level_name, source, words):
    payload = {"source": source, "level": level_name, "count": len(words), "words": words}
    (ROOT / "data" / f"{name}.json").write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    (ROOT / "js" / f"{name}-data.js").write_text(
        f"window.{global_name} = " + json.dumps(payload, ensure_ascii=False) + ";\n", encoding="utf-8"
    )
    print(f"Escrito {name}: {len(words)} palabras", flush=True)


JLPT_OVERRIDES = {
    "to meet": "encontrarse", "to go": "ir", "to come": "venir", "to eat": "comer",
    "to drink": "beber", "to see": "ver", "to write": "escribir", "to read": "leer",
    "student": "estudiante", "teacher": "profesor", "book": "libro", "water": "agua",
    "food": "comida", "name": "nombre", "friend": "amigo", "time": "tiempo",
    "day": "día", "one": "uno", "two": "dos", "three": "tres", "four": "cuatro", "five": "cinco",
}

TOPIK_OVERRIDES = {
    "것": "cosa", "하다": "hacer", "있다": "estar; haber", "되다": "llegar a ser",
    "나": "yo", "그": "eso; él", "없다": "no haber", "사람": "persona", "우리": "nosotros",
    "이": "esto", "아니다": "no ser", "보다": "ver", "때": "vez; momento", "거": "cosa",
    "같다": "igual", "가다": "ir", "년": "año", "한": "uno; una vez", "말": "palabra",
    "일": "cosa; trabajo", "그러나": "pero", "오다": "venir", "알다": "saber",
    "씨": "señor; semilla", "그렇다": "ser así", "크다": "grande", "또": "también",
    "일": "cosa; trabajo", "많다": "mucho", "안": "no", "좋다": "bueno", "더": "más",
    "받다": "recibir", "그것": "eso", "집": "casa", "나오다": "salir", "그리고": "y",
    "문제": "problema", "그런": "tal", "살다": "vivir", "저": "yo (humilde)",
    "모르다": "no saber", "속": "interior", "만들다": "hacer", "두": "dos", "앞": "delante",
    "중": "medio; durante", "어떤": "cuál", "잘": "bien", "먹다": "comer",
    "자신": "uno mismo", "문화": "cultura", "원": "won (moneda)", "생각": "pensamiento",
    "어떻다": "cómo ser", "명": "persona (contador)", "소리": "sonido", "다시": "de nuevo",
}


def build_jlpt():
    source = json.loads(JLPT_SRC.read_text(encoding="utf-8"))
    words = []
    for i, item in enumerate(source, start=1):
        en = (item.get("meanings") or [""])[0]
        words.append({
            "id": i,
            "char": item["word"],
            "reading": item.get("reading", ""),
            "romaji": item.get("romaji", ""),
            "en": en,
            "es": en,
            "pos": ", ".join(item.get("pos") or []),
            "example": (item.get("examples") or [{}])[0].get("ja", ""),
            "exampleEn": (item.get("examples") or [{}])[0].get("en", ""),
        })
    es = translate_all([w["en"] for w in words], "en", "es", "en")
    for w, translation in zip(words, es):
        w["es"] = JLPT_OVERRIDES.get(w["en"], translation or w["en"])
    write_payload(
        "jlpt-n5", "POLY_JLPT_N5", "JLPT N5",
        "https://github.com/evanclan/OpenJLPT (CC BY-SA 4.0) — data/json/vocab/n5.json",
        words,
    )


def build_topik():
    lines = TOPIK_SRC.read_text(encoding="utf-8").splitlines()
    rows = [line.split("\t") for line in lines[1:] if line.strip()]
    candidates = []
    for row in rows:
        if len(row) < 7:
            continue
        rank, word, pos, hanja, explanation, nikl, topik = row[:7]
        if topik.strip() != "초급" or not rank.strip().isdigit():
            continue
        clean = re.sub(r"\d+$", "", word.strip())
        if not clean:
            continue
        candidates.append((int(rank), clean, pos.strip(), hanja.strip(), explanation.strip()))
    candidates.sort(key=lambda x: x[0])
    candidates = candidates[:300]

    words = []
    for i, (rank, word, pos, hanja, explanation) in enumerate(candidates, start=1):
        meaning = word
        words.append({
            "id": i,
            "char": word,
            "reading": "",
            "romaji": "",
            "hanja": hanja,
            "en": meaning,
            "es": meaning,
            "pos": pos,
            "rank": rank,
            "example": "",
            "exampleEn": "",
        })
    es = translate_all([w["en"] for w in words], "ko", "es", "ko")
    for w, translation in zip(words, es):
        w["es"] = TOPIK_OVERRIDES.get(w["char"], translation or w["en"])
    write_payload(
        "topik-1", "POLY_TOPIK_1", "TOPIK 1",
        "https://github.com/julienshim/combined_korean_vocabulary_list (MIT) — results.tsv, nivel 초급 por frecuencia",
        words,
    )


if __name__ == "__main__":
    build_jlpt()
    build_topik()

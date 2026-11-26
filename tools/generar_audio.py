#!/usr/bin/env python3
"""Genera todos los MP3 de pronunciación.

- manifest.json -> un MP3 por lección (assets/audio/<idioma>/<leccion>.mp3)
- clips.json    -> un MP3 por palabra y por frase (assets/audio/clips/...)

Requisitos:
    pip install gTTS

Uso:
    1) node tools/export_audio_manifest.js
    2) python tools/generar_audio.py

Los archivos existentes se omiten. Para regenerar uno, bórralo antes.
"""
import json
import sys
import time
from pathlib import Path

try:
    from gtts import gTTS
except ImportError:
    sys.exit("Falta gTTS. Instálalo con: python -m pip install gTTS")

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "assets" / "audio"

LANG_MAP = {"zh-CN": "zh-CN", "ja-JP": "ja", "ko-KR": "ko"}


def synthesize(text, lang_code, out_file, label):
    if out_file.exists() and out_file.stat().st_size > 1000:
        return True
    out_file.parent.mkdir(parents=True, exist_ok=True)
    code = LANG_MAP.get(lang_code, lang_code)
    for attempt in range(1, 4):
        try:
            gTTS(text=text, lang=code, slow=False).save(str(out_file))
            return True
        except Exception as exc:  # noqa: BLE001
            print(f"  {label} intento {attempt} fallido: {exc}", flush=True)
            time.sleep(2 * attempt)
    return False


def main():
    manifest_file = AUDIO_DIR / "manifest.json"
    clips_file = AUDIO_DIR / "clips.json"
    if not manifest_file.exists() or not clips_file.exists():
        sys.exit("Faltan manifiestos. Ejecuta primero: node tools/export_audio_manifest.js")

    manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
    clips = json.loads(clips_file.read_text(encoding="utf-8"))

    print(f"Generando {len(manifest)} audios de lección y {len(clips)} clips...", flush=True)

    done = 0
    failed = 0
    for index, (lesson_id, item) in enumerate(manifest.items(), start=1):
        lang_id = lesson_id.split("-")[0]
        out = AUDIO_DIR / lang_id / f"{lesson_id.split('-')[1]}.mp3"
        if synthesize(item["text"], item["lang"], out, lesson_id):
            done += 1
        else:
            failed += 1
            print(f"ERROR lección {lesson_id}", flush=True)
        time.sleep(0.3)

    for index, clip in enumerate(clips, start=1):
        out = AUDIO_DIR / clip["file"]
        if synthesize(clip["text"], clip["lang"], out, clip["id"]):
            done += 1
        else:
            failed += 1
            print(f"ERROR clip {clip['id']}: {clip['text']}", flush=True)
        if index % 25 == 0:
            print(f"  clips: {index}/{len(clips)} correctos={done} fallidos={failed}", flush=True)
        time.sleep(0.25)

    print(f"Proceso terminado. Correctos: {done}, fallidos: {failed}.", flush=True)


if __name__ == "__main__":
    main()

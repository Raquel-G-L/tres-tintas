#!/usr/bin/env python3
"""Genera todos los MP3 que falten, en paralelo.

Uso:
  node tools/export_audio_manifest.js
  python tools/generar_audio_fast.py
"""
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from gtts import gTTS
except ImportError:
    raise SystemExit("Instala gTTS: python -m pip install gTTS")

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "assets" / "audio"
CLIPS = AUDIO_DIR / "clips.json"
LANG_MAP = {"zh-CN": "zh-CN", "ja-JP": "ja", "ko-KR": "ko"}
WORKERS = int(os.environ.get("AUDIO_WORKERS", "12"))


def generate(item):
    out = AUDIO_DIR / item["file"]
    if out.exists() and out.stat().st_size > 800:
        return "skip", item["id"]
    out.parent.mkdir(parents=True, exist_ok=True)
    lang = LANG_MAP.get(item["lang"], item["lang"])
    for attempt in range(4):
        try:
            gTTS(text=item["text"], lang=lang, slow=False).save(str(out))
            return "ok", item["id"]
        except Exception:  # noqa: BLE001
            time.sleep(1 + attempt)
    return "fail", item["id"]


def main():
    if not CLIPS.exists():
        raise SystemExit("Falta clips.json. Ejecuta export_audio_manifest.js")
    items = json.loads(CLIPS.read_text(encoding="utf-8"))
    pending = [i for i in items if not (AUDIO_DIR / i["file"]).exists()]
    print(f"Clips: {len(items)} · pendientes: {len(pending)} · workers: {WORKERS}", flush=True)
    done = failed = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(generate, item): item["id"] for item in pending}
        for n, future in enumerate(as_completed(futures), start=1):
            status, _ = future.result()
            if status == "ok":
                done += 1
            elif status == "fail":
                failed += 1
                print(f"  fallo: {futures[future]}", flush=True)
            if n % 250 == 0:
                print(f"  {n}/{len(pending)} · creados={done} fallidos={failed}", flush=True)
    print(f"Terminado. Creados {done}, fallidos {failed}.", flush=True)


if __name__ == "__main__":
    main()

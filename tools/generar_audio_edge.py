#!/usr/bin/env python3
"""Genera los MP3 que falten usando Edge TTS (Microsoft).

Requisitos: pip install edge-tts
Uso:
  node tools/export_audio_manifest.js
  python tools/generar_audio_edge.py

Variables de entorno:
  AUDIO_LIMIT=N    genera como máximo N clips (para pruebas)
  AUDIO_WORKERS=N  concurrencia (por defecto 8)
"""
import asyncio
import json
import os
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "assets" / "audio"
CLIPS = AUDIO_DIR / "clips.json"
VOICES = {
    "zh-CN": "zh-CN-XiaoxiaoNeural",
    "ja-JP": "ja-JP-NanamiNeural",
    "ko-KR": "ko-KR-SunHiNeural",
}
LIMIT = int(os.environ.get("AUDIO_LIMIT", "0"))
WORKERS = int(os.environ.get("AUDIO_WORKERS", "8"))


async def generate(item, semaphore, stats):
    out = AUDIO_DIR / item["file"]
    if out.exists() and out.stat().st_size > 800:
        return
    async with semaphore:
        voice = VOICES.get(item["lang"], VOICES["zh-CN"])
        for attempt in range(4):
            try:
                out.parent.mkdir(parents=True, exist_ok=True)
                await edge_tts.Communicate(item["text"], voice).save(str(out))
                stats["ok"] += 1
                break
            except Exception:  # noqa: BLE001
                await asyncio.sleep(2 * (attempt + 1))
        else:
            stats["fail"] += 1
            print(f"fallo: {item['id']}", flush=True)
        stats["done"] += 1
        if stats["done"] % 250 == 0:
            print(f"  {stats['done']}/{stats['total']} · creados={stats['ok']} fallidos={stats['fail']}", flush=True)


async def main():
    items = json.loads(CLIPS.read_text(encoding="utf-8"))
    pending = [i for i in items if not (AUDIO_DIR / i["file"]).exists()]
    if LIMIT:
        pending = pending[:LIMIT]
    print(f"Clips: {len(items)} · pendientes: {len(pending)} · workers: {WORKERS}", flush=True)
    semaphore = asyncio.Semaphore(WORKERS)
    stats = {"done": 0, "ok": 0, "fail": 0, "total": len(pending)}
    await asyncio.gather(*(generate(item, semaphore, stats) for item in pending))
    print(f"Terminado. Creados {stats['ok']}, fallidos {stats['fail']}.", flush=True)


if __name__ == "__main__":
    asyncio.run(main())

#!/usr/bin/env python3
"""Build pipeline for the Atlas of Human Song (PSY 1018).

Inputs (download first):
  1. NHS2 metadata:  https://raw.githubusercontent.com/themusiclab/nhs-expanded/main/data/metadata.csv
     (song id, type, region, glottocode; 1,007 songs)
  2. NHS2 audio:     NHS2-songs.zip from https://doi.org/10.5281/zenodo.8237500
     (unzip; excerpts are corpus_faded_final/<id>.mp3)
  3. Glottolog language coordinates:
     https://raw.githubusercontent.com/glottolog/glottolog-cldf/master/cldf/languages.csv

Steps:
  A. Join songs to Glottolog lat/lon via glottocode (1,004 of 1,007 resolve).
  B. Curate a balanced subset (seed 1018): per region, up to 4 songs of
     distinct types, preferring globally under-represented types ->
     153 songs, 14-16 per function, all 39 regions (saved as chosen.json).
  C. Re-encode each chosen excerpt: ffmpeg -ac 1 -ar 22050 -b:a 32k (~40 KB each).
  D. Assemble index.html: substitute into template.html
       {{WORLD}}  = world-atlas land-110m.json (TopoJSON)
       {{SONGS}}  = chosen.json
       {{AUDIO}}  = {id: "data:audio/mpeg;base64,..."} for the 153 clips.

Run:  python3 prepare_data.py <metadata.csv> <languages.csv> <audio_dir> <land-110m.json>
"""
import base64
import csv
import json
import random
import subprocess
import sys
import tempfile
from collections import defaultdict
from pathlib import Path

TYPES = ["Dance", "Lullaby", "Healing", "Love", "Mourning",
         "Work", "Play", "Story", "Praise", "Procession"]


def load_geo(languages_csv):
    geo = {}
    with open(languages_csv) as f:
        for r in csv.DictReader(f):
            if r["Glottocode"] and r["Latitude"]:
                geo[r["Glottocode"]] = (round(float(r["Latitude"]), 3),
                                        round(float(r["Longitude"]), 3),
                                        r["Name"])
    return geo


def curate(metadata_csv, geo, seed=1018, per_region=4):
    songs = [s for s in csv.DictReader(open(metadata_csv)) if s["glottocode"] in geo]
    random.seed(seed)
    byregion = defaultdict(list)
    for s in songs:
        byregion[s["region"]].append(s)
    chosen, seen = [], defaultdict(int)
    for region in sorted(byregion):
        pool = byregion[region][:]
        random.shuffle(pool)
        picked_types, picks = set(), []
        for _ in range(per_region):
            cands = [s for s in pool if s["type"] not in picked_types and s not in picks]
            if not cands:
                break
            cands.sort(key=lambda s: seen[s["type"]])
            best = [s for s in cands if seen[s["type"]] == seen[cands[0]["type"]]]
            s = random.choice(best)
            picks.append(s)
            picked_types.add(s["type"])
            seen[s["type"]] += 1
        chosen.extend(picks)
    return [{"id": s["song"], "type": s["type"], "region": s["region"],
             "glottocode": s["glottocode"], "lang": geo[s["glottocode"]][2],
             "lat": geo[s["glottocode"]][0], "lon": geo[s["glottocode"]][1]}
            for s in chosen]


def encode(audio_dir, song_id):
    src = Path(audio_dir) / f"{song_id}.mp3"
    with tempfile.NamedTemporaryFile(suffix=".mp3") as tmp:
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src),
                        "-ac", "1", "-ar", "22050", "-b:a", "32k", tmp.name], check=True)
        return "data:audio/mpeg;base64," + base64.b64encode(Path(tmp.name).read_bytes()).decode()


def main(metadata_csv, languages_csv, audio_dir, world_json):
    here = Path(__file__).parent
    geo = load_geo(languages_csv)
    songs = curate(metadata_csv, geo)
    (here / "chosen.json").write_text(json.dumps(songs, indent=0))
    audio = {s["id"]: encode(audio_dir, s["id"]) for s in songs}
    tpl = (here / "template.html").read_text()
    out = (tpl.replace("{{WORLD}}", Path(world_json).read_text())
              .replace("{{SONGS}}", json.dumps(songs, separators=(",", ":")))
              .replace("{{AUDIO}}", json.dumps(audio, separators=(",", ":"))))
    (here.parent / "index.html").write_text(out)
    print(f"{len(songs)} songs -> index.html ({len(out)/1e6:.1f} MB)")


if __name__ == "__main__":
    main(*sys.argv[1:5])

# Atlas of Human Song

An interactive world map for **PSY 1018 — The Science and Psychology of Music** (Harvard College). Every point is a 10-second field recording of vocal music; click a point to listen, or turn on practice mode to guess each song's function (dance, lullaby, healing, love, mourning, work, play, story, praise, procession) before it is revealed.

The page is a single self-contained `index.html` (~8.4 MB): map geometry, song metadata, and audio are embedded, so it runs from any static host (GitHub Pages included) or from a local file with no build step.

## Pedagogical framing

The atlas accompanies three course readings:

1. **Functions.** Naive listeners reliably infer some song functions (dance, lullaby, healing) across unfamiliar cultures, and love songs are much harder — Mehr, Singh, York, Glowacki, & Krasnow (2018, *Current Biology*); Mehr et al. (2019, *Science*). Practice mode reproduces this task.
2. **Universals and contrasts.** No structural feature is present in all musical systems, but several are statistically widespread (discrete pitches, phrase repetition, isorhythm) — Trehub, Becker, & Morley (2015, *Phil. Trans. R. Soc. B*).
3. **Listening together.** Natural music synchronizes listeners' brain responses, from auditory midbrain to attention and motor-planning networks — Abrams et al. (2013, *European Journal of Neuroscience*).

## Data sources (all open)

- **Audio and song metadata:** the Expanded Natural History of Song Discography (NHS2) — 1,007 ten-second excerpts of vocal music with function, region, and language annotations. Bertolo, M., Snarskis, M., Singh, M., & Mehr, S. A. (2025). The Expanded Natural History of Song Discography, a global corpus of vocal music. *Open Mind*. https://doi.org/10.1162/opmi.a.4 — corpus at https://doi.org/10.5281/zenodo.8237500 (record CC BY 4.0; audio excerpts distributed for research under fair use). This atlas embeds a curated subset of 153 excerpts (re-encoded to 32 kbps mono) spanning all 10 functions and all 39 regions.
- **Coordinates:** each song is placed at the point Glottolog assigns to the language it is sung in (via the song's glottocode). Hammarström, Forkel, Haspelmath, & Bank, *Glottolog* (CC BY 4.0), https://glottolog.org.
- **Map geometry:** Natural Earth (public domain), via `world-atlas` v2 (ISC).
- **Rendering:** D3.js v7 and topojson-client (ISC), loaded from cdnjs.

## Rebuilding

`build/` contains the pipeline: `template.html` (the page without embedded data), `chosen.json` (the curated 153-song subset with coordinates), and `prepare_data.py`, which documents how the subset was drawn (seeded, balanced across the 10 functions and up to 4 songs per region) and how the final `index.html` is assembled from the template plus base64-encoded audio. To rebuild, download `NHS2-songs.zip` from the Zenodo record, then run the script — see its header comments.

## A note on the audio

The field recordings remain the intellectual property of their original collectors and the recorded communities. NHS2 distributes brief excerpts for research; they are embedded here for teaching. **Prefer keeping this repository private**, and do not redistribute the audio outside the course context.

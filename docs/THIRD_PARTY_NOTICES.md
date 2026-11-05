# Third-party notices

## Botanical images — 5 November 2026

- Bitter leaf: `Vernonia_amygdalina_plant.jpg`, Zmu'az4Z, CC BY 4.0.
  [Source](https://commons.wikimedia.org/wiki/File:Vernonia_amygdalina_plant.jpg).
- Neem leaves: `Starr_060928-0469_Azadirachta_indica.jpg`, Forest & Kim Starr,
  CC BY 3.0. [Source](https://commons.wikimedia.org/wiki/File:Starr_060928-0469_Azadirachta_indica.jpg).

- Pawpaw: `Starr_010404-0610_Carica_papaya.jpg`, Forest & Kim Starr,
  [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/).
  [Source](https://commons.wikimedia.org/wiki/File:Starr_010404-0610_Carica_papaya.jpg).
  The 1,200 × 1,600 original was resized to 750 × 1,000 and converted to WebP.
  It shows fruit and leaves on a pawpaw tree. Cards crop the display; the full
  composition is available from the photo credit. The earlier download failure
  is resolved.

The bitter-leaf and neem copies were resized to at most 800 pixels and
converted to WebP. Source identifications and licenses were checked, and the
images visually inspected. Independent botanical review is pending. The other
five plant-image credits and modification notes are recorded in `src/lib/photos.ts`
and shown in the app.

## On-device OCR

`public/ocr/` bundles the Tesseract.js 7.0.0 worker and the Tesseract.js-core
7.0.0 LSTM WebAssembly build. Their Apache 2.0 license files are included
alongside the assets. [Tesseract.js](https://github.com/naptha/tesseract.js)
· [Tesseract.js-core](https://github.com/naptha/tesseract.js-core).

The bundled `eng.traineddata.gz` contains the English `tessdata_fast` model.
The decompressed bytes match the upstream `eng.traineddata`. The model uses
the Apache 2.0 license. [Model source](https://github.com/tesseract-ocr/tessdata_fast/blob/923915d4ced2a7235221788285785a29c4a42d4a/eng.traineddata)
· [Model license](https://github.com/tesseract-ocr/tessdata_fast/blob/923915d4ced2a7235221788285785a29c4a42d4a/LICENSE).

## Agent skills

Skill source URLs, exact revisions, and file hashes are recorded in
`../.agents/skill-sources.json` and [skill inventory](SKILLS.md). Upstream content
was copied without local modifications. Retain embedded notices and per-skill
license files when sharing these directories.

- K-Dense scientific skills: root MIT license retained at
  [licenses/K-Dense-LICENSE.md](licenses/K-Dense-LICENSE.md); individual skill
  frontmatter may identify additional terms for referenced software. Instruction
  examples do not grant rights to datasets, papers, APIs, or external software.
- Anthropic `frontend-design` and `webapp-testing`: each installed folder contains
  its upstream `LICENSE.txt` (Apache-2.0). No Claude Code software was installed.
- MLflow skills: Apache-2.0 license retained at
  [licenses/MLflow-LICENSE.txt](licenses/MLflow-LICENSE.txt).
- Vercel `vercel-react-best-practices`: the pinned skill declares MIT in its
  frontmatter. [Source](https://github.com/vercel-labs/agent-skills/tree/1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62/skills/react-best-practices).
  The `web-design-guidelines` skill is kept local because the pinned copy lacks
  an explicit license. [Web Interface Guidelines](https://vercel.com/design/guidelines).

The Skills CLI was used as a tool; its package and runtime dependencies are not
vendored in this repository. No license for the team's future application has
been selected.

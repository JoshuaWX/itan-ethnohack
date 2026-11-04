# EthnoHack 2026

Nigeria-first TCIM and ethnopharmacology research prototype for **Track 4: Digital
Health & Phytotherapy**, November 2–8, 2026. The working title is Ìtàn.

Ìtàn helps people explore medicinal plant names, scan herbal-product ingredient
labels and compare ingredients with source-linked evidence. It includes separate
Nigerian public-health awareness sections.

On mobile, start from Identify a plant, Scan a herbal product or Compare herbal
products. Ask Ìtàn offers navigation guidance and selected source-linked records.

Open this directory in WebStorm. In its PowerShell terminal, with Node.js 24
installed:

```powershell
npm ci
npm run dev
```

Open the local URL printed in the terminal. Run `npm test` for the matching and
evidence checks, and `npm run build` for a production build. No database is
required for the current read-only catalog.

The catalog can read published names from Supabase and falls back to versioned
local data when configuration or network access is missing. Scientific evidence,
photographs and interactions are currently curated in application files.

Optional server-only environment variables are `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and
`PLANTNET_API_KEY`. Set these in an ignored `.env.local`; never commit values.
Pl@ntNet identification requires its key, explicit user consent and network
access. Its photo results are candidates and do not establish safety. Gemini is
used only to select from a small set of curated evidence records. Ask Ìtàn's
navigation guidance runs locally and is not an open-ended chatbot. Both services
share a 30-request-per-UTC-day demo counter when configured with Supabase.

See [teammate handoff](HANDOFF.md) for setup, source data and remaining work.

The comparison page accepts manual ingredient lists and offers optional on-device
OCR. Its Tesseract.js worker and English language data are served locally from
`public/ocr`. OCR may misread labels; review and confirm the transcription.
The bundled language data is from the Tesseract.js fast English data distribution
(https://tessdata.projectnaptha.com/4.0.0_fast/eng.traineddata.gz), based on
Tesseract's Apache-licensed fast models (https://github.com/tesseract-ocr/tessdata_fast).

The public-reproducible default uses a **fictional** example product with no
regulatory record. A separately sourced local snapshot can be enabled with
`ITAN_LOCAL_NAFDAC_SNAPSHOT=1` and an independently authorized
`data/nafdac-rhimza.local.json`; both local configuration and data are ignored by
Git. Do not include this snapshot in a public build or release until reuse rights
have been resolved. The application is not a live registration lookup.

The collection is a curated research prototype. The cholera advisory is historical,
and the catalog is small. Not for medical
diagnosis, individualized treatment, or live clinical use.

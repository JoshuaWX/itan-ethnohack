# EthnoHack 2026

Nigeria-first TCIM and ethnopharmacology research prototype for **Track 4: Digital
Health & Phytotherapy**, November 2–8, 2026. The working title is Ìtàn.

Ìtàn helps people explore medicinal plant names, scan herbal-product ingredient
labels and compare ingredients with source-linked evidence. It includes separate
Nigerian public-health awareness sections.

On mobile, start from Identify a plant, Scan a herbal product or Compare herbal
products. Ask Ìtàn searches a versioned collection of 19 cited records across eight
plants and public-health guidance. Navigation help runs locally. Google Gemini
can explain retrieved evidence when the user opts in and the provider is configured.

Results start with a plain explanation, what remains unknown and a next action.
Scientific names, original label text and study details are expandable. Edition
2.0.1 includes source-linked plain-language summaries for every evidence record;
botanist and pharmacist review is still pending. See the handoff for wording rules
and first-time-user checks.

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
local data when configuration or network access is missing. Plant pages and Ask
Ìtàn share the bundled evidence collection. Each entry identifies its source,
study type, preparation and limitations. Source checking and specialist review
are tracked separately. Specialist review is pending.

Optional server environment variables are `SUPABASE_URL`,
`SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`,
and `PLANTNET_API_KEY`. Set values in an ignored `.env.local`. Use a Supabase
secret key for `SUPABASE_SECRET_KEY`, or an existing legacy service-role key.
Keep it server-side. Apply the quota migration in an authorized test project
before enabling external calls. Gemini uses up to two reserved calls per answer,
and Pl@ntNet uses one per identification. They share a 30-call UTC-day cap and
an eight-call cap per client. The bundled evidence and manual search are available
without external provider credentials.

See [teammate handoff](HANDOFF.md) for setup, source data and remaining work.

Open `/claims` to investigate a general plant claim. The app resolves the plant
and outcome and shows source-specific relations with study scope. `/verify`
guides checks in official NAFDAC services. Neither route establishes an
individual's treatment or authenticates a package.

Run `npm run evidence:draft -- 23770031` to prepare a metadata-only source draft.
Drafts go into ignored `outputs/` and remain pending until source and reuse review.
The app performs no live publication crawl and no model training.

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

# EthnoHack 2026

Nigeria-first TCIM and ethnopharmacology research prototype for **Track 4: Digital
Health & Phytotherapy**, November 2–8, 2026. The working title is Ìtàn.

The application demonstrates a curated product-to-plant journey and separate
public-health awareness sections. It does not provide live regulatory checks.

Open this directory in WebStorm. In its PowerShell terminal, with Node.js 24
installed:

```powershell
npm ci
npm run dev
```

Open the local URL printed in the terminal. Run `npm test` for the matching and
evidence checks, and `npm run build` for a production build. No database is
required for the current read-only catalog.

Vercel builds from the connected GitHub repository using the fictional product
by default. No database, API credentials, or environment variables are required.

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

# Ìtàn teammate handoff

Ìtàn is a Nigeria-first EthnoHack Track 4 research prototype. The core consumer
journey covers plant-name discovery, label OCR, ingredient comparison, and cited
evidence. The audience-facing app does not provide diagnosis or regulatory
certification. See the official [event rules](https://ethnohack2026.devpost.com/rules).

## Running the app

Use Node.js 24, `npm ci`, `npm run dev`, `npm test`, and `npm run build`. Local
development works using versioned catalog fallback data. Environment variables
are listed in the README; request credentials from the project owner through an
approved channel, never in a commit or chat. The GitHub repository is private,
and access must be granted by its owner.

The mobile homepage prioritizes identification, scanning and comparison with
credited botanical imagery. Motion respects reduced-motion preferences. The
identification provider is named in the photo-consent text; results remain
uncertain candidates. Local `.env.local` values are not automatically deployed
to Vercel, so production integration settings need separate configuration.

## Structure and data

- `src/app` contains Next.js routes and server APIs. `src/components` contains
  mobile UI, browser OCR and navigation help.
- `src/lib/matching.ts` and `comparison.ts` handle catalog matching and overlaps.
  Common names produce candidates, not verified physical identifications.
- `src/lib/catalog-server.ts` reads published Supabase taxa with a labeled
  versioned fallback. Evidence, images and interactions still use local curated
  records. `supabase/migrations` holds schema, seeds, policies and the demo quota.
- `public/plants` holds credited, resized photos. `public/ocr` holds local
  Tesseract assets. License and source links are displayed alongside photos.

## Integration status and limitations

Plant-photo recognition uses Pl@ntNet when `PLANTNET_API_KEY` and Supabase quota
configuration are available; otherwise it reports unavailable. It uploads the
selected image to Pl@ntNet only after consent and does not persist it. Candidate
scores are provider scores, not medical or identification guarantees. Live
recognition must be verified separately from fixture tests.

The label OCR runs on device and requires user review. The public product examples
are fictional. Registration lookup is a small curated demonstration, not a live
NAFDAC connection or package authentication. The cholera advisory is archived.
The evidence catalog and medication-interaction coverage are incomplete and need
botanical and pharmacy review. Gemini selects among supplied curated evidence
records; the navigation helper uses local rules. No health histories are stored.

See the [roselle/simvastatin study](https://pubmed.ncbi.nlm.nih.gov/28925046/),
[Kew roselle taxonomy](https://powo.science.kew.org/taxon/326388-2), and the
[Pl@ntNet API](https://my.plantnet.org/doc/api/identify). Review source licenses,
scientific wording and the targeted model, photo and phone checks before release.
Do not commit `.env.local`, local source snapshots, personal planning documents
or patient data. Obtain authorization before committing, pushing or deploying.

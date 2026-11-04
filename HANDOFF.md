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

The mobile homepage prioritizes identification, scanning and comparison.
Plant records retain credited botanical photography. Motion respects reduced-motion preferences. The
identification provider is named in the photo-consent text; results remain
uncertain candidates. Local `.env.local` values are not automatically deployed
to Vercel, so production integration settings need separate configuration.

The design references informed specific choices. Oura’s quiet typography and
clear hierarchy shaped the opening screen. PictureThis’s capture-first view
informed the photo prompt and preview. Yuka’s results hierarchy informed the
scan and correction labels. SkinSort’s comparison groups become stacked
sections on phones. Examine’s distinction between summary and study details
appears on plant pages. Ada’s onboarding example informed the assistant’s
short introduction and suggested next steps.

## Structure and data

- `src/app` contains Next.js routes and server APIs. `src/components` contains
  mobile UI, browser OCR and navigation help.
- `src/lib/matching.ts` and `comparison.ts` handle catalog matching and overlaps.
  Common names produce candidates, not verified physical identifications.
- `src/lib/catalog-server.ts` reads published Supabase taxa with a labeled
  versioned fallback. `src/lib/research-collection.ts` is the evidence corpus.
  `research-retrieval.ts` ranks it using names, topics, study type and prior
  source IDs. `research-answer.ts` validates claim citations and uses a separate
  model pass to check each claim against its cited records.
- `supabase/migrations` holds schema, seeds, policies and the provider quota.
  The new migration removes the anonymous quota RPC. The replacement is
  restricted to `service_role` and atomically reserves a global and client budget.
- `public/plants` holds credited, resized photos. `public/ocr` holds local
  Tesseract assets. License and source links are displayed alongside photos.

## Integration status and limitations

Plant-photo recognition uses Pl@ntNet when `PLANTNET_API_KEY`, `SUPABASE_URL`,
`SUPABASE_SECRET_KEY` and the quota migration are available. It uploads the
selected image to Pl@ntNet only after consent and does not persist it. Candidate
scores are provider scores, not medical or identification guarantees. Live
recognition must be verified separately from fixture tests.

The label OCR runs on device and requires user review. The public product examples
are fictional. Registration lookup is a small curated demonstration, not a live
NAFDAC connection or package authentication. The cholera advisory is archived.
The evidence catalog and medication-interaction coverage are incomplete and need
botanical and pharmacy review. Gemini generates a short claim list only after
opt-in. A separate model pass checks claims against their own cited records.
An invalid citation, rejected claim, provider error or exhausted budget returns
curated records. Official cholera and malaria guidance uses source summaries
directly. Model review can miss unsupported claims. The chat keeps three turns
in page memory and passes prior source IDs for follow-ups. Withdrawal cancels
the client request and clears the conversation. It cannot recall data already
sent to Google.

To add evidence, start from an approved PMID, PMCID, DOI or official source URL.
Open the original source and verify its identity, species, study design, plant
part, preparation, population, outcome and limitations. Record the source ID
and section or table in `research-collection.ts`. Write an original summary and
link to the source. Keep unlicensed text and images out of the collection and
record unresolved fields as `unknown`. Record source checking and any expert
review separately. Add a retrieval case, run `npm test`, and bump the collection
version when the published records change. This is a manual review workflow.

Before configuring a shared environment, run the quota migration and the
checks in `supabase/tests/provider_quota.sql` against disposable Postgres or
local Supabase. Test anonymous and authenticated denial and service-role success,
including concurrent reservations. Then validate real Gemini and Pl@ntNet calls
with synthetic questions and authorized photos. The browser suite and fixtures
do not validate provider response quality or medical accuracy.

See the [roselle/simvastatin study](https://pubmed.ncbi.nlm.nih.gov/28925046/),
[Kew roselle taxonomy](https://powo.science.kew.org/taxon/326388-2), and the
[Pl@ntNet API](https://my.plantnet.org/doc/api/identify). Review source licenses,
scientific wording and the targeted model, photo and phone checks before release.
Do not commit `.env.local`, local source snapshots, personal planning documents
or patient data. Obtain authorization before committing, pushing or deploying.

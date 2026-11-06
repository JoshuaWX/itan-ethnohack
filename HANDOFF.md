# Ìtàn teammate handoff

Ìtàn is a Nigeria-first EthnoHack Track 4 research prototype. The core consumer
journey covers plant-name discovery, label OCR, ingredient comparison, and cited
evidence. The audience-facing app does not provide diagnosis or regulatory
certification. See the official [event rules](https://ethnohack2026.devpost.com/rules).

## Running the app

Use Node.js 24, `npm ci`, `npm run dev`, `npm test`, and `npm run build`. Local
development works using versioned catalog fallback data. Environment variables
are listed in the README; request credentials from the project owner through an
approved channel, never in a commit or chat. The GitHub repository is public;
write access must be granted by its owner.

The mobile homepage prioritizes identification, scanning and comparison.
Plant records retain credited botanical photography. Motion respects reduced-motion preferences. The
identification provider is named in the photo-consent text; results remain
uncertain candidates. Local `.env.local` values are not automatically deployed
to Vercel, so production integration settings need separate configuration.

The homepage borrows Oura’s restrained typography and clear action hierarchy.
Identify takes its capture, preview and candidate sequence from PictureThis.
The Yuka-inspired `/scan` entry point handles one label at a time. Users confirm
OCR or typed ingredients before seeing exact matches, possible identities and
unresolved entries. Compare imports only the confirmed text into its first slot
through in-memory state. A reload returns Compare to the example products.
The existing QR and registration lookup stays linked separately.

SkinSort inspired the product columns and the shared, unique and possible
overlap sections. A listed plant with a documented medicine study shows that
study without a medicine being selected. Choosing a medicine only narrows the
list. No record is not a safety clearance.

Examine inspired the evidence overview and expandable study details. Ada’s guided choices appear in Ask Ìtàn, which fills the phone viewport
and opens as a compact panel on wider screens. The consent toggle stays visible.

## Consumer language and result layout

The default view is written for a consumer with no scientific background.
`ResultGuide` introduces what was found, what it means, what remains unknown
and a next action. Common names come first; original label text, scientific
names, matching rules and study details remain available in disclosures.
Home keeps the three task choices and removes repeated introductory sections.
The navigation uses Home and Health info; `/claims` is Check a plant claim.

Evidence edition 2.0.1 adds original plain-language companion summaries in
`src/lib/plain-evidence.ts`, keyed to the existing 19 source records. Findings,
limitations, source IDs and original scientific summaries remain intact.
Add a companion summary whenever adding a published source. Tests check that
none are missing or orphaned. Source checking is not botanist/pharmacist review;
expert review is still pending. No new scientific sources were added in this pass.

Keep these distinctions when editing: an uncertain plant name is not a confirmed
identification; sharing an ingredient is not proof of danger; no interaction
record is not a safety clearance; no statistically clear effect is not proof
of ineffectiveness. Use specific everyday wording and a practical next action.
Generated scientific answers retain citations and support checks, with a plain
English instruction and companion wording supplied only to the drafting step.
The support check still uses the original evidence. App-help questions such as
“How do I use Ìtàn?” have a narrow local allowlist; medical and injection filters
remain in place.

The service worker registers in production, where build assets have content
hashes. It does not newly register during development, avoiding stale dev chunks.
If an old development registration exists, clear that localhost origin's service
worker/cache once in browser developer tools. Production offline fallback remains.

## Structure and data

- `/claims` runs botanical entity and outcome recognition followed by
  source-specific study relations and an overall verdict. `claim-analysis.ts`
  uses explicit outcome annotations and scope rules. It distinguishes a
  direction match within a study from applicability to a human, preparation or
  finished product, then ranks people / animal-or-lab / traditional evidence.
- The corpus now contains 19 records across eight taxa. Bitter leaf, neem and
  pawpaw have sourced Nigerian names and ethnobotanical context. All eight
  records have credited photos, including pawpaw. Broken images use a labeled
  illustration. Credit details link to the original and the full photo.
- `/verify` provides real source references and opens NAFDAC's own lookup
  services. Results remain external. A missing match cannot establish illegality.
  The restricted snapshot remains excluded from releases.

- `src/app` contains Next.js routes and server APIs. `src/components` contains
  mobile UI, browser OCR and navigation help.
- `src/lib/matching.ts` and `comparison.ts` handle catalog matching and overlaps.
  Common names produce candidates, not verified physical identifications.
- `src/lib/catalog-server.ts` reads published Supabase taxa with a labeled
  versioned fallback. `src/lib/research-collection.ts` is the evidence corpus.
  `research-retrieval.ts` ranks it using names, compact spellings, topics,
  study type and prior source IDs. Everyday synonyms are rewritten onto
  existing keywords. `research-answer.ts` validates claim citations and uses a
  separate model pass to check each claim against its cited records.
- `supabase/migrations` holds schema, seeds, policies and the provider quota.
  The new migration removes the anonymous quota RPC. The replacement is
  restricted to `service_role` and atomically reserves a global and client budget.
- `public/plants` holds credited, resized photos. `public/ocr` holds local
  Tesseract assets. License and source links are displayed alongside photos.

## Integration status and limitations

Plant-photo recognition uses Pl@ntNet when `PLANTNET_API_KEY`, `SUPABASE_URL`,
`SUPABASE_SECRET_KEY` and the quota function are available. `GET /api/identify`
checks settings and quota RPC reachability without spending quota; this does
not prove the provider key works or that budget remains. The POST validates
and bounds the upload, decodes and strips image metadata, and only then
reserves a unit and sends the resized JPEG to Pl@ntNet. It requires consent
and does not persist the photo. Candidate scores do not confirm identification.

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

Run `npm run evidence:draft -- 23770031` for approved PMIDs. It prepares only
bibliographic metadata in ignored `outputs/evidence-drafts`, with source checking
and expert review marked pending. It refuses an incomplete provider response.
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

## Reproduce the evaluation

With Node.js 24, run `npm test` and `npm run build`. Use the following commands
for the retrieval fixtures and to generate the synthetic OCR labels.

```powershell
npm test
npm run audit:retrieval
npm run audit:retrieval -- holdout
npm run audit:claims
node scripts/audit-labels.mjs
```

The 36 regression questions and the 16-case holdout both return the expected
records after the 2.1.0 retrieval changes. A separate 34-question claim set
and 18 everyday retrieval questions also pass. These are developer-authored
checks, not independent scientific labels. Physical phone camera and
installation checks and specialist validation are pending.

## First-time-user checks (not yet conducted)

Ask three to five volunteers with no scientific background to try these tasks
without coaching: start a label scan; explain whether two products share an
ingredient; and explain whether an animal study proves a benefit in people.
After each, ask what Ìtàn found, what remains unknown and what they would do next.
Record task completion, misunderstood wording and needed help without collecting
health histories. Browser checks are developer verification, not user feedback.

See the [roselle/simvastatin study](https://pubmed.ncbi.nlm.nih.gov/28925046/),
[Kew roselle taxonomy](https://powo.science.kew.org/taxon/326388-2), and the
[Pl@ntNet API](https://my.plantnet.org/doc/api/identify). Review source licenses,
scientific wording and the targeted model, photo and phone checks before release.
Do not commit `.env.local`, local source snapshots, personal planning documents
or patient data. Obtain authorization before committing, pushing or deploying.

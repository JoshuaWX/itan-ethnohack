# Progress

Last updated: 2026-11-04 (Africa/Lagos).

## Six-screen UI refinement

The homepage now links to the dedicated `/scan` flow. The scanner groups
confirmed label entries by match certainty and transfers the reviewed text
into Compare in memory. Identify leads with the camera and gallery, then
requests consent for the selected photo. Compare puts overlap before
expandable matching details, the plant records summarize evidence types,
and Ask Ìtàn uses a full-height mobile dialog.

The 15 tests and production build passed. Browser checks covered the six
screens at 320, 375, 768 and 1440 CSS pixels, including focus restoration,
consent withdrawal and the PWA offline fallback. An unreadable test image
left scanning unconfirmed. A synthetic label was read, corrected and passed
to the first comparison slot. Identification retry and result links used
simulated provider responses. Physical-phone camera testing is pending.

## Evidence assistant and mobile update

The local build searches 10 source-checked evidence records across five plants
and two public-health guidance topics. The homepage, assistant and plant
records have updated mobile layouts. Comparison context comes from the actual
matcher output. Gemini generation and its separate claim check are integrated
behind consent and a new server-only quota. Specialist review is pending.

The 12 retrieval fixtures returned the expected ranked records, including
three abstentions. Automated cases also exercised ambiguous names, evidence
types, follow-ups, injected instructions, invalid citations, a simulated
contradiction and provider/quota failure. The original botanical fixtures
remain in place. The production build and 15 tests passed.

The quota SQL passed in disposable, in-memory PostgreSQL via PGlite. The test
checked role grants, the removed anonymous RPC, reservation accounting, and
the global and per-client caps. Hosted RPC authentication and concurrent
requests still need an integration check.

The production build's file traces excluded the local NAFDAC snapshot,
private context and local environment file after explicit exclusions were added.

Browser checks covered five routes at 320, 375, 768 and 1440 CSS pixels. At
320 px the assistant opened by keyboard, narrowed a follow-up to human studies,
showed the unconfigured-provider fallback, and cleared history on withdrawal.
The existing Tesseract worker read one synthetic label and accepted a manual
correction into comparison. The demo product, archived advisory, separate
malaria section, manifest and offline navigation fallback were observed.

Live Gemini and Pl@ntNet calls require the quota migration and a server-only
Supabase key in an authorized environment. Physical phone/camera tests and
specialist review are outstanding.

## Earlier milestones

Environment setup is complete with the limitations recorded in
[setup](SETUP.md). The working directory was empty and had no Git repository at
inspection. A local `main` repository has been initialized; no GitHub remote,
commit, or publication has been created.

The local application uses Next.js, React, TypeScript, and a small, versioned
curated catalog. The current working title is Ìtàn. Product search connects the
Rhimza source records to hibiscus, ginger, and ambiguous cinnamon matches.
Separate awareness sections connect an archived cholera advisory to guava
laboratory research, and malaria context to WHO's Artemisia guidance.

On 2026-11-04 the production build passed, and the matching and evidence tests
passed. Eight hand-authored matching cases yielded 8/8 expected outcomes versus
4/8 for an exact-name-only baseline. This is a small development fixture set, not
independent clinical validation. A mobile browser check followed search → product
→ ginger evidence and inspected the awareness content. The service worker and
cached offline fallback were present, and a simulated offline navigation returned
the fallback. Installation behavior has not been verified on a physical mobile device.

The registration records are a dated curated snapshot, not live verification.
QR scanning is available in browsers with the native BarcodeDetector API, with a
labeled demo QR and manual-search fallback. The unsupported-browser path and a
mocked successful scan were tested; a physical camera scan remains unverified.
Seller discovery, reviews, and real-time outbreak ingestion are not implemented.
The six-feature product vision remains in the project context pack.
NAFDAC data redistribution terms require review before public publication. No
expert interviews, model training, or clinical validation have been performed.

## Reliability audit — 4 November 2026

- Local implementation adds a Pl@ntNet photo workflow with explicit consent,
  local image resizing, an existing shared daily quota and catalog matching. A
  live request using the licensed roselle photograph returned a roselle candidate
  linked to the catalog. This single example is not an accuracy evaluation.
  Invalid file and missing-consent requests were rejected. The navigation helper
  answers using fixed local rules and is not an unrestricted Gemini chatbot.
  Gemini remains limited to selection of curated evidence records. Teammate
  setup and limitations are documented in README and HANDOFF. A 375px browser
  check covered guidance, consent, a live image request and comparison.

- Supabase ITAN has a new catalog migration and seed, with five published taxa,
  three evidence sources, two evidence records, five photo records and one
  interaction record. Anonymous SELECT is granted under RLS; anonymous write
  privileges are denied. The application currently reads taxa from the database;
  evidence, interactions and photos remain sourced from versioned application
  files and still require integration. The local environment has the Supabase
  URL and publishable key. The fallback is labeled in the interface.
- Comparison treats common-name aliases as possible rather than confirmed
  overlap. A limited evidence explorer uses fixed questions and curated summaries.
  Gemini selects record IDs from supplied curated records; it does not generate
  the displayed summaries. Unsupported topics abstain and failures fall back to
  curated records. A Supabase counter limits model requests to 30 per UTC day.
  One supported and one unsupported local request passed; this is not a full
  assistant evaluation. Roselle now has a
  bounded research summary. Expert review of all records remains pending.
- A 375px browser check confirmed the possible-overlap language, evidence source
  link and roselle page with the database enabled. Seven tests and the production
  build passed. Broader responsive, real-phone, OCR and assistant evaluation and
  deeper evidence work remain outstanding.

- Local enhancement: comparison handles two or three editable products,
  confirmed and possible overlaps, unresolved names and a separately sourced
  roselle–simvastatin research example. Images have source and license credits.
  Local OCR was exercised in a browser against two clean synthetic label images;
  these are not representative real-world accuracy measurements. A 375px browser
  run followed scan, confirmation, comparison, evidence and awareness. Seven test
  cases and the production build passed. Real-camera OCR and installation remain
  untested. The new work is local and has not been committed or deployed.

- GitHub repository `JoshuaWX/itan-ethnohack` is private and connected to Vercel.
  Production deployment from commit `1241a4a` is ready at
  https://itan-ethnohack-joshuawxs-projects.vercel.app. Anonymous HTTP checks
  confirmed the fictional product, ginger search, and archived-awareness label;
  the local NAFDAC snapshot was absent from the returned home page. Production
  is public; preview deployments retain Vercel Authentication. No database was
  provisioned. A physical-phone PWA and camera check remains outstanding.

- The local Rhimza source snapshot is now in ignored `data/` and enabled only
  by ignored local configuration. The default application uses an explicitly
  fictional product. Rights to redistribute the snapshot remain unresolved;
  check build and deployment configuration before any release.
- Browser-checked local journey: search, product, three ingredient matches,
  ginger evidence and both awareness sections. The evidence is curated; no live
  regulatory lookup, live outbreak feed, OCR, seller directory or reviews exist.
- Corrected a cinnamon taxon/source mismatch: the second candidate is Java
  cinnamon, *Cinnamomum burmanni*. Common-name identification remains uncertain.
- The separate 24-case challenge fixture recorded 12 correct single matches,
  zero incorrect single matches, two correct ambiguous outcomes and ten correct
  abstentions. These are developer-authored, catalog-specific examples, not an
  independent or representative accuracy assessment. Duplicate exact names now
  produce an ambiguous result.
- Production build and tests pass; a clean configuration returned fictional data,
  an unknown plant returned 404, an overlong search returned 400, and npm audit
  reported zero production vulnerabilities. Home layout showed no horizontal
  overflow at 320, 375, 768 and 1440 CSS pixels. A basic check found no unlabeled
  buttons or missing image alt attributes on the home page; this is not a full
  accessibility audit. Unsupported camera fallback and offline fallback were
  observed locally. Physical installation and camera testing remain outstanding.

## Next project actions

1. Verify record reuse terms and have the team review scientific wording.
2. Check the complete experience on an actual phone, including offline behavior.
3. Test QR scanning with a physical supported device and camera.
4. Consider seller and review demonstrations only after the core workflow passes.

## Blockers / unknowns

Team roles, source reuse permissions, and budget: TBD.
Tool-specific remaining actions belong in [setup](SETUP.md).

See the proposed [milestones](DEVELOPMENT_PLAN.md) and [decision log](DECISIONS.md).

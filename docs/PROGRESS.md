# Progress

## Claim-to-evidence submission pack — 6 November 2026

Prepared the Devpost copy, eight-slide editable PowerPoint and PDF, storyboard,
cover image, two hosted screenshots and timed recording guide in the local
`outputs/submission` folder. Microsoft PowerPoint opened and rendered all eight
slides. The team roster remains editable in the deck and Devpost copy.

Rehearsed “Does bitter leaf lower blood sugar?” on the public app and confirmed
the expected finding plus the human and rat study links. A clean public clone
at `a4425ce` passed installation, 39 automated tests, the production build,
TypeScript, 34 of 34 claim cases and 16 of 16 separate retrieval questions.
The local development server returned the expected claim result without provider
keys. After the public branch advanced to `44d3212`, its tests, claim and retrieval
checks, build and TypeScript check also passed. These are team-written software
checks. Specialist and first-time-user review are pending.

The Devpost owner still needs to verify signed-in form fields, fill the roster,
confirm the repository naming instruction, add the recorded video link and
submit. The README update is on the local branch. The current public tree
excludes the old context folder. Earlier public commits still contain it.

## Procedural Trillium asset — 6 November 2026

Reworked the [generator](../scripts/generate_stylized_flower.py) with curved,
veined leaves, a tilted flower with ruffled petals, sepals and a modeled center.
Ran it twice in Blender 5.2.2 and verified that the rerun replaced the plant
while retaining an unrelated test object. The 2.67 MB Desktop GLB re-imported
with 27 mesh objects, double-sided leaf and petal surfaces, and four embedded
color and normal textures.

## Compare medicine studies — 6 November 2026

Documented herb–medicine studies now appear when a compared label names the
plant. The medicine menu narrows that list. Absence of a record remains
insufficient evidence, not a safety clearance. No new sources were added.

## Claim-to-evidence pipeline — 6 November 2026

- Kept the existing lexical corpus, matcher and Gemini support check. Added
  everyday/Nigerian phrasings, compact names (`bitterleaf`, `paw paw`), an
  overall evidence verdict, and near-miss name suggestions that never select
  records. Interaction questions now require an interaction record.
- Frozen before the change: 36/36 regression questions, 12/16 holdout, 5/34
  claim verdicts, 7/18 everyday retrieval questions. After the change: 36/36,
  16/16, 34/34 and 18/18. Existing source-derived study relations still pass.
  These remain developer-authored checks, not independent scientific validation.
- Specialist review, live Gemini/Pl@ntNet calls and first-time-user testing are
  still pending. No new published sources were added.

Last updated: 2026-11-06 (Africa/Lagos).

## Technical audit — 5 November 2026

- Reproduced the hosted identification error and traced it to missing provider
  settings. The configured local app reached the protected quota function.
- Local fixes: preflight before photo capture, bounded upload decoding, resilient
  candidate mapping, pawpaw photography and compact credits, multiline OCR,
  improved name/topic retrieval, and stricter claim/population interpretation.
- Verified 32 automated groups, 21 HTTP validation cases, 200 seeded comparison
  inputs, a production build, type checking, and desktop-browser PWA fallback.
  Locally, two real plant photos ranked their intended taxa first and one
  generated answer had three claims consistent with its cited records. The
  separate 16-question retrieval set passed 12; tilted OCR also remains limited.
- See the [handoff](../HANDOFF.md#reproduce-the-evaluation) for reproduction
  commands. Specialist review, physical-phone testing and a production retest
  are pending. The detailed audit and machine setup records are local.

Last updated: 2026-11-05 (Africa/Lagos).

## Submission documentation review — 5 November 2026

Reworked the README for first-time readers with the problem, challenge, demo
link, current versus planned capabilities, methods, technology, setup,
attribution, AI-assisted development disclosure, tests and limitations. Added
an empty `.env.example` and clarified API setup without including credentials.
Corrected the handoff: the GitHub repository is public. The demo returned HTTP
200; individual hosted integrations were not re-tested in this documentation
pass. All 25 tests and a production build passed using the installed dependencies.
A clean-clone `npm ci` was not run.

The supplied GitHub guide specifies `makeathon-2026-[team-name]-[challenge-name]`.
The existing repository name does not match. No repository or website rename,
commit, push, deployment, database change, video or slides were performed.
The remote `origin/main` history contains earlier copies of the ignored
`EthnoHack-Codex-Context` folder. Removing a folder from the current tree does not
remove previous commits; review the contents and agree on a history-remediation
approach before any history rewrite. A filename check alone does not prove that
credentials or restricted data are absent from history.

## Consumer clarity pass — 5 November 2026

Local changes simplify the homepage, navigation, photo identification, scan,
comparison, plant and claim results, Ask Ìtàn, and official-check guidance.
Results use a shared finding/meaning/unknown/next-step layout. Edition 2.0.1
adds original plain-language companions to all 19 existing evidence records.
Original findings, limitations, source links and technical checks remain
available in expandable details. All expert reviews remain pending.

The 25 automated tests and TypeScript check pass. The production build passes.
The unchanged botanical challenge set reports 12 correct single matches,
zero incorrect single matches, two ambiguous results and ten abstentions across
24 developer-authored cases. All 15 existing source-derived claim cases pass.
These are development checks, not an independent scientific evaluation.

Production browser checks covered nine routes at 320, 375, 768 and 1440 pixels
(36 route/width combinations): all returned 200 with no horizontal overflow or
visibly unnamed buttons. The 320px run used a short 480px viewport. Simulated
text enlargement to a 32px body font passed on six main screens. Key hero,
navigation and Ask controls measured at least 44px high. Keyboard skip-link
focus and Ask focus restoration were observed; reduced-motion transitions were
near zero. Selected new text colours were checked against their backgrounds.
This is a targeted accessibility check, not a complete screen-reader audit.

Real browser OCR on the two clean synthetic fixtures produced “hibiscus,
ginger” and “roselle, guava”. Neither showed results before confirmation.
A blank synthetic image produced a retake/manual-entry message and kept
confirmation disabled. Corrected manual text, including an unknown ingredient,
transferred unchanged to comparison slot one; slot two was empty. Reload cleared
the transfer. Exact-name overlap, uncertain cinnamon, unknown names, source
details, the roselle/simvastatin record and its six-person limitations were
checked; a comparison link opened the ginger research page.

Identification UI checks used a simulated candidate response: no request before
consent, ranked-result language, plant link and replacement clearing consent and
results were verified. A simulated service failure offered manual search and
left retry enabled. A camera file picker opened during automation, but no
physical camera or live Pl@ntNet prediction was validated in this pass.
Assistant checks covered local app help, unsupported questions, withdrawal and
focus restoration. Simulated unavailable-provider, quota and rejected-answer
responses retained cited summaries; an aborted request used saved summaries.
One actual Gemini answer about PMID 28925046 was observed and checked against
the record for participant count, preparation, direction and source ID. This
does not establish general answer accuracy. No database migration, quota code,
credentials or provider settings were changed; the older missing-RPC observation
below is historical and was not independently re-audited here.

The production service worker opened the offline fallback with network access
disabled. The standalone manifest and both icons returned 200. Development no
longer newly registers the production service worker, avoiding stale dev assets.
No commit, push, deployment, new dependency or optional feature was introduced.

The handoff contains three novice-user tasks; no volunteer testing has occurred.
Physical-phone camera, difficult real-world label OCR, installation and assistive
technology checks remain outstanding, along with botanist/pharmacist review.
Production preview for local review: http://localhost:3036/.

## Mentor corrections and claim analysis

The local app removes guava from the homepage/cholera presentation. Disease
queries return official guidance rather than pairing the archived advisory
with the guava laboratory study. The guava plant record retains that study.
The eight-taxon catalog adds bitter leaf, neem and pawpaw with sourced Nigerian
names, context and preparation descriptions. Two new licensed images were
optimized and credited; pawpaw retains an illustration after a rate-limited
photo download. All specialist reviews are pending.

`/claims` exposes identity and outcome resolution, study selection and source-
specific relations. The 19-record corpus distinguishes ethnobotanical, animal,
laboratory, human and review evidence. The metadata importer was exercised
against Europe PMC for PMID 23770031. Drafts remain pending and are ignored.

The production build and 19 tests passed. Fifteen source-derived claim cases
passed, including preparation and population mismatches. The original 24-case
botanical fixture remains unchanged. These are developer-authored development
checks and do not establish independent clinical validation.

Browser checks at 320, 375, 768 and 1440 px exercised claims, sourced plant
names, official links, medication research, assistant trace and withdrawal,
invalid image rejection and offline fallback. No configured private key was
found in client bundles; restricted files were absent from build traces.

Real browser verification in NAPAMS returned Rhimza and an expired second
example. Greenbook did not return either in the tested filter. Ìtàn links to
these services rather than importing their result database. The public site
still lacks the new workflow because this work remains local.

The user added SUPABASE_SECRET_KEY but chose to keep ITAN's database unchanged.
Read-only inspection confirmed only the old anonymous quota RPC exists. The
new app therefore fails closed to curated summaries for provider calls. Real
Gemini/Pl@ntNet generation and photo-integration checks remain blocked pending
the protected quota migration. Physical-phone testing is also outstanding.

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
the local setup notes. The working directory was empty and had no Git repository at
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
Tool-specific remaining actions belong in the local setup notes.

See the proposed [milestones](DEVELOPMENT_PLAN.md) and [decision log](DECISIONS.md).

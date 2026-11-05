# Decisions

## Submission documentation — 5 November 2026

Make the README understandable without specialist knowledge, disclose existing
models and AI-assisted development, and distinguish the live site from the
repository's latest verified local behaviour. Document optional credentials via
an empty template; retain secret and restricted-data exclusions. The organizer's
repository naming instruction and earlier context-folder history require owner
decisions before a rename or history rewrite. Do not imply that the 25 tests or
small challenge set establish clinical validity.

## Consumer clarity — 5 November 2026

Use plain English and common plant names in the default view. Keep scientific
names, original OCR text, matching rules and original study summaries available
in disclosures. Pair findings with limits and a concrete next action; a short
summary must not turn a candidate match into certainty or missing evidence into
safety. Preserve the matching and claim-analysis engines and the six-feature
roadmap. Add companion summaries to the existing 19 source records as evidence
edition 2.0.1; expert review stays pending. No new scientific sources were added.

Keep the provider quota and database configuration outside this change. A local
Gemini request returned a generated answer during the clarity pass, so earlier
missing-RPC notes describe a historical observation. No database or provider
configuration was changed here; permissions and concurrency require separate
verification. Register the service worker only for production builds to avoid
cached development chunks hiding local UI changes.

## Mentor-driven claim analysis — 5 November 2026

Remove the guava study from the homepage and cholera-awareness presentation,
including disease-query retrieval. Preserve it on the guava research page.
Add sourced Nigerian records and a deterministic, outcome-level claim analysis
that exposes taxon resolution, population/preparation mismatches and source
relations. Use the existing RAG corpus and Gemini support checker. This provides
an auditable baseline on the available small corpus without claiming model
training or clinical validation.

Keep NAFDAC checks in the official services until API and reuse terms are
established. Local snapshot isolation continues. The user declined applying
the protected-quota migration to ITAN in this run, so the database stays
unchanged and provider requests retain their fallback.

## Standalone label scanning

Use `/scan` for a single label and leave the comparison form as a separate
task. Reuse on-device OCR and the comparison matcher. Pass only confirmed
ingredient text in memory so the photo and OCR transcript stay on the scan
screen. Keep QR and registration lookup on its existing path.

## Ìtàn evidence retrieval and provider quota

- Use a versioned, source-checked corpus and deterministic lexical ranking over
  botanical names, topics and source identifiers. Import is manual and expert
  appraisal is tracked separately. This keeps claims, study scope and citations
  auditable within the MVP.
- Require opt-in before Gemini receives a question. Keep conversation turns in
  memory and send prior source IDs to Ìtàn for follow-ups. Validate each model
  claim's citations and run a separate model check using only the cited records.
  Use curated summaries for public-health guidance and failed verification.
- Reserve Gemini draft and review calls together under the same atomic budget
  used by photo identification. Keep the reservation RPC restricted to the
  server role and key client counters with short-lived pseudonyms.

## D003 — On-device label transcription and comparison (2026-11-04)

Use browser OCR with same-origin Tesseract assets and explicit review before
ingredients enter the comparison. Treat exact and alias matches as catalog
candidates and ambiguous names as possible overlaps. Report the small interaction
evidence set separately; missing records are insufficient evidence. Images are
locally resized credited Commons photographs. No patient information is stored.

## D001 — Development foundation (2026-11-02)

**Status:** accepted for environment setup, as directed by the participant.

Use Codex Desktop as the main agent, existing native Windows Codex CLI as a
secondary interface, WebStorm as the preferred editor, and `docs/` as an Obsidian
vault. Keep project skills under `.agents/skills/` and version-control Markdown.
Preserve existing tools and user configuration. No WSL migration or Claude Code
configuration is part of this setup.

Keep idea, application stack, ML necessity, dataset, and deployment target **TBD**.
Install instructions/references only; defer ML libraries, models, GPU setup, cloud
resources, and optional service credentials until a concrete task needs them.

**Rationale:** one-week scope; portable team guidance without premature application choices.
**Consequences:** some skill scripts require dependencies or authorized service
access later. Installed skill discovery does not prove operational readiness or
automatic routing reliability. See [skills](SKILLS.md) and [setup](SETUP.md).

## New decision template

- ID / date / status / owner: TBD.
- Question, relevant [project context](PROJECT_BRIEF.md), and constraints: TBD.
- Options and supporting evidence: TBD.
- Choice and rationale: TBD.
- Risks, trade-offs, validation, and revisit trigger: TBD.

## D002 — Separate source snapshot from reproducible demo (2026-11-04)

NAFDAC redistribution rights have not been established. Keep the local historical
snapshot and its enabling environment setting out of Git; ship a clearly fictional
fallback without those records. This preserves a local research demonstration while
making the default app reproducible. Revisit only after source terms and any
required permission are documented; inspect build and hosting configuration before
any public release. This isolation does not establish rights to use any other source.

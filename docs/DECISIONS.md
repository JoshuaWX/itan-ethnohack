# Decisions

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

# Architecture

Updated 5 November 2026. Next.js App Router renders the consumer PWA. React
controls scanning, comparison and the in-memory assistant. The shared botanical
matcher resolves exact scientific names, aliases, ambiguity and abstentions.

The versioned TypeScript corpus holds source-checked summaries, preparation,
plant part, study design, setting and limitations. Source checking and expert
review are distinct. `scripts/evidence-draft.mjs` retrieves metadata for approved
PMIDs into ignored drafts. It imports no abstract/full text and does not publish
records. A person verifies sources, writes rights-aware summaries and annotates
outcomes before publication.

The claim engine resolves plant and outcome entities, recognizes direction,
selects matching records and compares outcome annotations under scope rules.
Population, plant part, preparation and adjunct-treatment mismatches can force
abstention. The interface shows source-specific relations and applicability.
This auditable baseline is rule-based and has not been independently validated.
A larger independently evaluated corpus would be needed to justify embeddings.

Ask Ìtàn retrieves the same records using names, aliases, source IDs, topics,
evidence types and prior source IDs. Navigation help runs locally. Opted-in
Gemini requests generate cited claims, then a separate model pass checks support
against each claim's cited records. Model review remains fallible. Failure
returns the cited summaries. Official guidance takes priority for disease queries.

Browser OCR uses same-origin Tesseract assets and requires confirmation. Images
and scan transfer stay in memory. Pl@ntNet receives a resized photo after consent.
Provider routes reserve quota units atomically in Supabase using a server secret.
Keys stay server-side and questions/photos are not persisted by the application.

Older remote catalog seeds fall back to the complete local identity catalog.
NAFDAC has no documented API agreement with this project. The verification guide
opens official services and preserves unresolved status. The restricted local
snapshot is ignored by Git and explicitly excluded from build traces.

The service worker caches static application assets and a navigation fallback.
An already loaded claim page can use its bundled corpus offline. Fresh navigation
shows the fallback. Physical camera/PWA installation checks remain separate.

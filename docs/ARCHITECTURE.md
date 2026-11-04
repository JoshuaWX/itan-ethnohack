# Architecture

Status: **TBD — project idea and technology stack not selected**.

## Decision inputs

- Intended users, workflow, access needs, and success criteria: TBD.
- Evidence retrieval, provenance display, and uncertainty requirements: TBD.
- Data sensitivity, authorization, storage, and retention: TBD.
- Interface, API boundaries, deployment target, and budget: TBD.
- Offline needs, expected load, latency, and failure behavior: TBD.

## Options to compare after scope selection

Consider a documented static/rule-based or search-based baseline first. Add a
database, API, retrieval pipeline, LLM, or trained model only for an identified
requirement. A skill about React, Lightning, or MLflow does not select that technology.

For APIs, define inputs, outputs, validation, error semantics, authentication needs,
authorization boundaries, rate limits, and contracts before choosing a framework.
For a database, define entities, source IDs, evidence relationships, integrity
constraints, access patterns, migrations, and provenance before choosing a product.

If ML/DL is proposed, document the target/labels, dataset rights and adequacy,
non-ML comparator, split design, leakage controls, training/evaluation budget,
metrics, uncertainty, and stop criteria. Use [scientific standards](SCIENTIFIC_EVIDENCE.md).

If RAG is proposed, compare lexical retrieval before embeddings; document source
licensing, chunk metadata, retrieval evaluation, citation support, abstention,
prompt-injection boundaries, and held-out evaluation cases.

Implementation diagram, selected components, and model/service choices: TBD.
Record accepted choices in [decisions](DECISIONS.md) and work in [development plan](DEVELOPMENT_PLAN.md).

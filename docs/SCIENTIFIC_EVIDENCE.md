# Scientific evidence and responsible AI

These are project working standards, not a statement of regulatory or clinical
validation. The hackathon prototype is **research and demonstration only; not for
medical diagnosis, individualized treatment, or live clinical use**. It must never
be described as a validated clinical decision-support system.

## Evidence requirements

- Every scientific claim needs a traceable source and a location supporting the
  exact claim: DOI/PMID or primary URL, version/date, and relevant page/table/section.
- Never fabricate sources, data, findings, clinical outcomes, interviews, or validation.
  Label missing information **TBD**, unsupported claims as unverified, and inferences as inferences.
- Distinguish traditional use, in vitro, animal, observational, randomized human,
  and synthesized evidence. Laboratory activity does not establish human benefit.
- Match evidence to species, plant part, preparation, dose/route, population,
  comparator, and outcome. Assess study design, sample size, bias, confounding,
  uncertainty, consistency, applicability, and conflicts of interest.
- Natural origin does not establish safety. Record toxicity, contraindications,
  contamination/adulteration, interactions, and relevant vulnerable populations when supported.
- Missing interaction evidence means **unknown / insufficient evidence**, never
  safe, compatible, or no interaction. Distinguish a searched absence of records
  from evidence supporting absence of an effect; retain search scope and date.
- Avoid diagnosis and individualized treatment recommendations. Qualified experts
  must review safety-critical research interpretation; expert review itself does
  not confer clinical authorization.

## Validation and reproducibility

Use authorized data under [data governance](DATA_SOURCES.md). Define a question,
baseline, outcome, metrics, evaluation sample, and acceptance criteria before
optimizing. Retain queries, data versions/checksums, transformations, random seeds,
environment versions, and code revision. Report failed checks and uncertainty.

ML/DL requires a defensible target, suitable independent data, feasible validation,
and benefit over a simpler baseline. Evaluate leakage, imbalance, subgroup errors,
calibration where meaningful, and external applicability. SHAP or attention scores
do not establish causality, clinical validity, or safety.

For LLM/RAG features, measure retrieval relevance/coverage, citation correctness,
claim support, abstention on missing evidence, unsafe-answer rate, robustness to
untrusted text, and latency/cost. Include no-evidence, contradictory-evidence,
plant-name ambiguity, and missing-interaction cases. Human-reviewed reference
answers and blinded checks complement automated judges; judge scores cannot prove
truth or eliminate hallucinations.

## Evidence register

The executable register is `src/lib/research-collection.ts`, extended by
`src/lib/nigerian-evidence.ts`. Each published summary links its source and
supporting location. `claim-analysis.ts` records outcome direction and scope
separately from the original claim. Source verification is recorded independently
of the still-pending specialist review. See the dated research log for access
and reuse checks.

| Claim ID | Exact claim | Primary source and location | Study / evidence type | Appraisal and limitations | Reviewer / status |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

Link searches and synthesis in [research findings](RESEARCH_FINDINGS.md), source
rights in [data sources](DATA_SOURCES.md), and scope consequences in [decisions](DECISIONS.md).

# Research findings

Updated 5 November 2026. The original setup-stage placeholders below are
superseded by these targeted searches. This was not a systematic review.

## Mentor corrections and source checks

Questions were whether Nigerian plant names/preparations could be sourced,
which studies address a glucose-lowering claim, and how official product
checks can be demonstrated without copying an unlicensed database.

- The Kwara field survey, [PMC10504731](https://pmc.ncbi.nlm.nih.gov/articles/PMC10504731/),
  records bitter leaf, neem and pawpaw and their parts. The North Central survey,
  [PMC11870763](https://pmc.ncbi.nlm.nih.gov/articles/PMC11870763/), supplies the
  attributed local names and preparation context. Full-text table rows were
  checked through Europe PMC's `/{PMCID}/fullTextXML` endpoint. Reported practice
  is stored separately from efficacy findings and without preparation doses.
- The human glucose experiment [PMID 23770031](https://pubmed.ncbi.nlm.nih.gov/23770031/)
  distinguishes individual decoctions from a three-plant blend. The rat study
  [PMID 30258613](https://pubmed.ncbi.nlm.nih.gov/30258613/) describes processing-
  dependent findings. These determine the contrasting outcome annotations.
- [PMID 33244247](https://pubmed.ncbi.nlm.nih.gov/33244247/) studied a standardized
  neem extract alongside metformin. It cannot answer a neem-alone or homemade-tea
  claim. [PMID 39710889](https://pubmed.ncbi.nlm.nih.gov/39710889/) is an animal
  metformin interaction signal. The papaya sources are [PMID 32074143](https://pubmed.ncbi.nlm.nih.gov/32074143/)
  and [PMID 34040647](https://pubmed.ncbi.nlm.nih.gov/34040647/). Their scope and
  pregnancy/lactation exclusions informed contextual cautions.
- POWO identities were checked for Gymnanthemum amygdalinum (210886-1),
  Azadirachta indica (1213180-2) and Carica papaya (30011248-2). The bitter-leaf
  research synonym is retained for entity resolution.
- NAFDAC's herbal-products page, Greenbook and NAPAMS were inspected. Herbal
  coverage is explicit, but no documented public API agreement or redistribution
  permission was established. The app opens official lookups and exposes source
  references. It does not import their result table or infer authenticity.

On 5 November, browser searches in Greenbook's herbal category returned no
match for A7-2452L and A7-100998L. NAPAMS verification returned Rhimza with
approval/end dates in 2026/2028, while the second reference returned an expired
certificate. Ingredient descriptions also differed between official sources.
These observations support a manual official-source workflow with explicit
uncertainty. They do not establish package authenticity or transferable
permission to redistribute the source database. No result table was imported.

Queries included Nigerian ethnobotanical surveys with the three taxa,
`Vernonia amygdalina human blood glucose`, and targeted source IDs. Europe PMC
metadata queries used `SRC:MED AND EXT_ID:{PMID}` with `resultType=core` and
`pageSize=1`. The metadata-only importer was exercised with PMID 23770031 and
produced a pending draft. No abstract or full text was copied into that draft.

The linked full-text licenses were inspected. Kwara, papaya trial/review and
the North Central survey permit attributed reuse. The neem trial carries
CC BY-NC terms. Ìtàn uses original factual summaries and source links, without
copying source prose or figures. Commercial reuse needs a fresh rights review.
All expert-review statuses remain pending.

## Search log

| Search ID | Date | Database / release | Exact query and filters | Coverage / retrieved count | Screening criteria | Limitations |
| --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD |

Record search dates, database coverage, deduplication, full-text availability,
exclusions, and incomplete retrieval. A targeted search is not automatically a
systematic review. Verify bibliographic identifiers against the source before citing.

## Findings

| Finding ID | Bounded claim | Source DOI / PMID / URL, location | Evidence level | Conflicts / uncertainty | Project implication |
| --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD |

Keep quotations distinct from paraphrases and reasoning. Separate traditional use,
laboratory results, animal studies, observational evidence, and human trials.
Use [scientific evidence](SCIENTIFIC_EVIDENCE.md) for appraisal criteria and
[data sources](DATA_SOURCES.md) for provenance. Decisions belong in [decisions](DECISIONS.md).

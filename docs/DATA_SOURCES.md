# Data sources and governance

Source reuse agreements: **TBD**. A manually curated historical NAFDAC snapshot
is retained locally in ignored data, with redistribution rights unresolved; the
reproducible default uses fictional product data. Use synthetic data or appropriately authorized data. Public visibility
alone does not establish permission to reuse, redistribute, or send data to an AI service.

| Source ID | Owner / primary URL | Version / access date | License and allowed uses | Consent / authorization | Sensitivity / storage | Quality / coverage | Transformations / checksum |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TBD | TBD | TBD | TBD | TBD | TBD | TBD | TBD |

Before ingesting data, establish provenance, license compatibility, authorized use,
minimum necessary fields, access controls, retention, and permitted external processing.
Keep secrets and identifiable health data outside Git and the research vault.
Data minimization and de-identification need human review; a script cannot certify privacy.

For plant data, resolve accepted scientific name, synonyms, taxonomy authority,
plant part, preparation/extract, dose/route if reported, geographic context, units,
and source dates. Mark unresolved identity or preparation differences explicitly.

Check schema, types, units, missingness, duplicates, inconsistent labels, collection
bias, subgroup coverage, and source conflicts. Preserve raw inputs; version derived
data and transformations. For ML, split by the relevant independent unit before
fitting preprocessing; check person/site/time/source leakage and label validity.

Synthetic data must be labeled and cannot establish real-world accuracy, efficacy,
or safety. Record limitations in [scientific evidence](SCIENTIFIC_EVIDENCE.md),
results in [research findings](RESEARCH_FINDINGS.md), and design choices in [architecture](ARCHITECTURE.md).

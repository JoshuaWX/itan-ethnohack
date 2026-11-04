# Sources and organizer resources

These priorities are recommendations, not guarantees of access, coverage, clinical quality or permission. Check source terms, individual record licenses and provenance before reuse.

## High priority

- POWO (https://powo.science.kew.org/) and WFO (https://www.worldfloraonline.org/): taxonomic names and context. Choose an authoritative backbone, retain synonyms and original labels; names do not prove medicinal claims.
- PubMed (https://pubmed.ncbi.nlm.nih.gov/) and Europe PMC (https://europepmc.org/): find and assess original research. EMA and WHO herbal monographs (https://www.ema.europa.eu/ and https://www.who.int/publications) can offer assessments for particular species and preparations. An indexed paper alone is not clinical proof.
- Official Nigerian regulatory and public-health sources: identify permitted NAFDAC product records and NCDC or other competent authority disease and prevention updates, checking access, coverage and dates. No live integration is established.
- Organizer datasets_all_tracks.docx, GitHub guide and demo video guide: provided as Markdown copies in organizer-guides/. The datasets list explicitly presents suggestions, not an exhaustive mandate. Check individual rights and current service availability.

## Optional, when relevant to the selected slice

- PubChem (https://pubchem.ncbi.nlm.nih.gov/) and ChEMBL (https://www.ebi.ac.uk/chembl/) provide compound identity and bioactivity information. COCONUT (https://coconut.naturalproducts.net/) covers natural products; NPASS and KNApSAcK may provide natural-product/species associations. Verify current links, availability, licenses and provenance for NPASS and KNApSAcK. Such associations do not establish therapeutic effects.
- GBIF (https://www.gbif.org/) supplies occurrence records, not proof of current local availability. IPNI (https://www.ipni.org/) covers published plant names, not clinical evidence. BHL (https://www.biodiversitylibrary.org/) contains biodiversity literature; check copyright and historical context. OpenAlex (https://openalex.org/) supports research discovery, not quality assessment.
- Libraries: pandas for data preparation; pykew for Kew access where supported; pubchempy and chembl_webresource_client for their services; RDKit for structures; networkx for graphs. Install only when needed; check maintenance and terms.
- Compute: Google Colab, Kaggle Notebooks and GitHub Codespaces may help; check current quotas, prices and privacy before uploading data.

## Sponsor offers: unverified

The organizer message described Anakin as one free month of the $20 plan using coupon ANAKINIO20, and Aitho as a pitch rehearsal tool with Presenter Pro free until 31 December. Year, eligibility, redemption, pricing and expiry were not independently verified; original offer links were not supplied. Verify directly with organizers and providers before registering. The organizer says participants sign up themselves and no emails are shared with sponsors. These offers are optional.

## Additional practical guidance from the dataset guide

The guide recommends WFO identifiers as a plant-name backbone and a POWO/WCVP expert cross-check. Preserve zero, one or multiple candidate taxa and the evidence for each, rather than silently forcing an uncertain match. WFO matching: https://list.worldfloraonline.org/matching.php ; Kew medicinal plant names: https://mpns.science.kew.org/ . The guide also lists optional hackathon-hosted wrappers for WFO, IPNI, WCVP and COCONUT; they are not official provider APIs and availability and terms must be checked. Historical texts, specialized chemical and ontology datasets, and image collections are optional only if relevant to the chosen slice. Record item-level rights and citations; historical claims are not treatment advice. Consult the included full dataset guide for links and caveats.

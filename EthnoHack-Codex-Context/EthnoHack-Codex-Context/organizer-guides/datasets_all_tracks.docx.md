# **Datasets for all tracks**

*This is just a proposal, do not limit yourself with these suggestions.*

# **How to read this document**

Every table uses the same five columns:

| Column | Meaning |
| :---- | :---- |
| **Resource** | Name of the source, database, platform, or standard |
| **What it provides** | Content, coverage, and why it is useful |
| **Access & licence** | Where to get it, API/download options, account requirements, and rights |
| **How to use it / notes** | Recommended role in a hackathon pipeline, caveats, and practical tips |
| **Tracks** | Which track areas the resource mainly serves (see below) |

Citations appear inline as numbered links, e.g. [\[1\]](https://wellcomecollection.org/works/t2eqd53z), and are listed in full under References.

# **1\. Historical source texts**

## **1.1 Core ancient Greek, Byzantine, and Arabic texts**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **Dioscorides, *De materia medica*** | Plant descriptions, synonyms, preparation methods, administration routes, and therapeutic claims; ideal for plant-name disambiguation across Greek, Latin, Arabic, and later vernacular traditions. | The most recent critical edition of the Greek text (Wellmann) in three volumes is available here: [vol. 1](https://archive.org/details/b21459162_0001/page/n5/mode/2up), [vol. 2](https://archive.org/details/b21459162_0002/page/n5/mode/2up), [vol. 3](https://archive.org/details/b21459162_0003/page/n5/mode/2up) [\[134\]](https://archive.org/details/b21459162_0001). English translation [here](https://archive.org/details/greekherbalofdio0000robe) [\[135\]](https://archive.org/details/greekherbalofdio0000robe). Earlier printed editions: Aldine 1499 at Wellcome [\[1\]](https://wellcomecollection.org/works/t2eqd53z) and NLM [\[2\]](https://archive.org/details/2211031RX1.nlm.nih.gov); Sprengel 1829 edition [\[3\]](https://archive.org/details/b23982500_0001) [\[4\]](https://archive.org/details/b33286978_0001), marked public domain. | Start here for **Names**: each chapter gives a headword plus synonyms in several languages. The Wellmann volumes are labelled "copyright not evaluated" on Internet Archive, and the English translation is a borrow-only modern edition; check rights before bulk redistribution. The 1499 and 1829 editions are public domain. |
| **Alexander of Tralles, *Therapeutics*** | Disease-oriented recipes and therapeutic reasoning from late antiquity/Byzantium; complementary to the plant-centered structure of Dioscorides. | The 1878 Puschmann edition, *Alexander von Tralles: Original-Text und Übersetzung*, provides parallel Ancient Greek and German and is marked not in copyright/public domain by the hosting records [\[5\]](https://archive.org/details/bub_gb_Qq8CAAAAMAAJ) [\[6\]](https://archive.org/details/b24755990_0001). | Parallel Greek–German text supports alignment and translation tasks; disease-first organization suits indication extraction and mapping to MeSH/DOID. |
| **Hippocratic Corpus** | Disease descriptions, regimen, materia medica, environment, and historical medical concepts. | The Perseus/Scaife catalog exposes a large set of works with stable CTS URNs, including *On Ancient Medicine*, *Airs, Waters, Places*, *Regimen in Acute Diseases*, *Diseases*, and *On the Sacred Disease* [\[7\]](https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0627) [\[8\]](https://scaife.perseus.org/library/urn:cts:greekLit:tlg0627.tlg001/). | CTS URNs give citation-stable passage IDs: store them with every extracted claim. Good for historical disease-concept mapping. |
| **Pliny the Elder, *Natural History*, especially Books 20–27** | Numerous plant names, synonyms, habitats, uses, preparations, and claims; useful for cross-author comparison with Dioscorides. | Perseus provides searchable book/chapter text; Book 24 covers remedies from trees [\[9\]](http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=24) and Book 26 organizes remedies by ailments [\[10\]](http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=26). | Cross-author alignment with Dioscorides is a strong **Names** benchmark; habitat statements help **Geo**. |
| **Avicenna (Ibn Sīnā), *Canon of Medicine*** | Bridges Greek, Arabic, Persian, and Latin traditions; Book II focuses on materia medica and Book V on compound remedies. | NLM/Internet Archive hosts a digitized Arabic manuscript whose catalog describes all five books, including materia medica and compound remedies [\[11\]](https://archive.org/details/9403778.nlm.nih.gov). A 1476 Latin edition of Books III–V is marked Public Domain [\[12\]](https://archive.org/details/OEXV35RES). English translations are also hosted on Internet Archive [\[13\]](https://archive.org/details/the-canon-of-medicine-volume-2) [\[14\]](https://archive.org/details/the-canon-of-medicine-volume-1). | Use for multilingual name chains (Greek → Arabic → Latin). Manuscript pages suit **Images**/HTR. The English volumes are community uploads of a modern translation; treat their rights as unverified. |

## **1.2 Early-modern and vernacular material**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **Nicholas Culpeper, *The Complete Herbal*** | English common names, aliases, habitats, harvesting times, preparations, therapeutic claims, and astrological associations. | Project Gutenberg provides searchable HTML and plain text and marks its edition public domain in the United States [\[15\]](https://www.gutenberg.org/ebooks/49513) [\[16\]](https://www.gutenberg.org/cache/epub/49513/pg49513.txt). | The text explicitly records multiple regional names for the same herb, making it ideal for vernacular-name resolution and spelling-variant tasks [\[17\]](https://www.gutenberg.org/files/49513/49513-h/49513-h.htm). Verify reuse status in the jurisdiction hosting the hackathon dataset. |
| **Household recipe books** | Real recipe structure: ingredients, quantities, instructions, indications, and domestic terminology. | Wellcome's digitized late-17th/18th-century *Cookery and Medical Recipe Book* is marked Public Domain [\[18\]](https://wellcomecollection.org/works/sx2nv9yd). | Good for recipe segmentation and ingredient/action extraction. Handwriting recognition will be harder than print OCR. For a worked example of turning a historical receptarium into a relational database (and then screening its plants in vitro), see the Receptarium of Burkhard III von Hallwyl study [\[41\]](https://pubmed.ncbi.nlm.nih.gov/39097209/). |
| **William Buchan, *Domestic Medicine*** | Popular medical practice, simple medicines, regimen, food, bathing, and household treatment in the 18th–19th centuries. | Wellcome offers an 1828 digitization marked Public Domain [\[19\]](https://wellcomecollection.org/works/my7z8qtd). | Useful for comparing learned and domestic medicine, but claims must be presented as historical statements. |
| **Medical Heritage Library / Internet Archive collections** | Broad access to digitized medical books with PDFs, OCR, hOCR, and page images. | The Dioscorides and Alexander records show the available download formats, including OCR full text and page-level representations [\[3\]](https://archive.org/details/b23982500_0001) [\[6\]](https://archive.org/details/b24755990_0001). | Organizers should freeze exact item identifiers and downloaded files before the event; avoid live dependence on OCR endpoints. |
| **Wellcome Collection** | Large medical-history collection with online books, manuscripts, pharmacopoeias, and recipe books. | Thousands of digitized items are freely accessible, but licences differ by item; each record must be checked [\[20\]](https://wellcomecollection.org/collections/accessing-our-collections). | Do not infer that the whole collection is public domain. Store the item-level rights statement in the dataset. |

## **1.3 Other traditions and multilingual corpora**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **OpenITI (Open Islamicate Texts Initiative)** | Machine-readable corpus of premodern Arabic and Persian texts, including medical and pharmacological works. | Openly downloadable text files with metadata [\[98\]](https://openiti.org/); check per-text licence notes. | Arabic/Persian counterpart to Perseus for the Greek→Arabic→Latin name chain; good for multilingual NLP. |
| **Chinese Text Project (ctext.org)** | Large digital library of pre-modern Chinese texts, including classical materia medica. | Free web access and API [\[99\]](https://ctext.org/); bulk reuse subject to site terms. | Extends the hackathon beyond the Mediterranean tradition; pair with KNApSAcK (Kampo) and TCM-related name mapping. |
| **Logeion** | Combined Greek and Latin dictionaries (LSJ, Lewis & Short, etc.) with lemma lookup. | Free web access [\[100\]](https://logeion.uchicago.edu/). | Helps participants gloss plant names and variant spellings in Greek/Latin sources. |
| **CLTK (Classical Language Toolkit)** | NLP pipelines (tokenization, lemmatization, POS) for Ancient Greek, Latin, Classical Arabic, and other historical languages. | Open-source Python library [\[101\]](https://cltk.org/). | Baseline tooling for lemmatizing historical plant names before matching. |

## **1.4 Corpus discovery platforms**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **Biodiversity Heritage Library (BHL)** | Open biodiversity literature, full-text search, scientific-name tools, APIs, exports, and downloadable content. | Metadata is CC0; individual item copyright status still needs checking. OCR is automatically generated and can be noisy [\[21\]](https://about.biodiversitylibrary.org/help/faq/) [\[22\]](https://about.biodiversitylibrary.org/tools-and-services/). API v3 can return item metadata, pages, OCR, and identified names; it requires a free API key [\[23\]](https://about.biodiversitylibrary.org/help/terms-of-use/) [\[24\]](https://blog.biodiversitylibrary.org/2018/09/version-3-of-the-bhl-api-now-available) [\[25\]](https://www.biodiversitylibrary.org/docs/api3.html). | Find historical floras, pharmacognosy books, materia medica, botanical synonymies, and illustrations. |
| **Europeana** | Multilingual manuscripts, herbals, images, and collection metadata across European cultural-heritage institutions. | Search, Record, IIIF, SPARQL, OAI-PMH, and dataset access; a free account/API key is required [\[26\]](https://pro.europeana.eu/page/apis) [\[27\]](https://www.europeana.eu/en/apis). | Discover multilingual manuscripts, herbals, images, and collection metadata; rights remain item-specific. |
| **Gallica / Bibliothèque nationale de France** | French materia medica, pharmacopoeias, botany, colonial medicine, and early-modern translations. | Open SRU search, document services, OCR text, ALTO, IIIF images, and large French-language OCR datasets. Gallica's search API can query metadata and OCR and filter by OCR quality and rights status [\[28\]](https://api.bnf.fr/fr/api-document-de-gallica) [\[29\]](https://api.bnf.fr/fr/texte-corrige-et-ocr-de-documents-de-gallica) [\[30\]](https://api.bnf.fr/fr/api-gallica-de-recherche) [\[31\]](https://www.data.gouv.fr/dataservices/api-gallica-recherche). | ALTO supports page/line alignment, which is useful for highlighting extracted claims on page images. |
| **OPenn** | High-resolution manuscript images, TEI XML, and data files, including medieval medical and pharmaceutical manuscripts such as *Canon medicinae* and *Secreti medici* [\[32\]](https://openn.library.upenn.edu/). | Open download; licences are stated per repository and are often public domain or CC BY. | Manuscript-layout, handwriting, TEI, and image-to-knowledge-graph challenges. |
| **Perseus/Scaife** | Stable canonical identifiers and machine-readable classical Greek and Latin text traditions [\[7\]](https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0627) [\[8\]](https://scaife.perseus.org/library/urn:cts:greekLit:tlg0627.tlg001/). | Open web access and CTS-based APIs; texts are mostly CC BY-SA, so check each text. | Greek/Latin NLP, lemmatization, passage alignment, and citation-stable extraction. |
| **Cambridge "Curious Cures"** | Project centered on approximately 8,000 Latin and Middle English medical recipes in 187 manuscripts, using IIIF, TEI descriptions, and Transkribus transcriptions [\[33\]](https://www.lib.cam.ac.uk/curiouscures). | Images via Cambridge Digital Library (IIIF); verify which outputs are available at event time. | A model for how recipe corpora can combine images, transcription, cataloging, and interoperable encoding. |

# **2\. Botanical name resources**

Historical plant-name mapping is the central scientific challenge. A name such as "mallow," "costus," or "siler" may identify different taxa by author, place, period, manuscript family, or translator. The output should therefore support zero, one, or several modern candidate taxa and record the evidence for every candidate.

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **World Flora Online Plant List (WFO)** | Consensus plant-name backbone, accepted names, synonyms, stable URIs, taxon concepts, and name records. | REST name-matching, GraphQL, CSV matching, and W3C Reconciliation API for OpenRefine; no API key is currently required [\[34\]](https://list.worldfloraonline.org/matching.php). Static backbone data are available under CC0 [\[35\]](https://www.worldfloraonline.org/downloadData). You could also use this API: [wfo.ethcstwin.di.uoa.gr:65000/docs](https://wfo.ethcstwin.di.uoa.gr:65000/docs) [\[80\]](https://wfo.ethcstwin.di.uoa.gr:65000/docs), which offers name search, first-hit matching, similar-name lookup, and taxonomy browsing by species, genus, tribe, family, order, and phylum (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j). | Recommended as the primary plant identifier (wfo\_id). |
| **IPNI (International Plant Names Index)** | Nomenclatural records for seed plants, ferns, and lycophytes: names, authors, places and dates of publication, and LSIDs. | Free web search [\[81\]](https://www.ipni.org/); programmatic access via Kew's pykew library [\[82\]](https://github.com/RBGKew/pykew) or the IPNI API at [ipni.ethcstwin.di.uoa.gr:65000/docs](https://ipni.ethcstwin.di.uoa.gr:65000/docs) [\[137\]](https://ipni.ethcstwin.di.uoa.gr:65000/docs): names by ID or search, similar-name (fuzzy) lookup for OCR/spelling variants, ranks, nomenclatural statuses, publication references, and families (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j). | Use to check the author and publication of a name, and to trace historical binomials and authorities. Record IPNI IDs alongside wfo\_id. |
| **Kew World Checklist of Vascular Plants / Plants of the World Online** | Curated accepted names and synonyms, plus descriptions, distributions, images, and uses in POWO. Kew reports over 1,020,000 synonyms for more than 343,000 species in WCVP [\[36\]](https://www.kew.org/science/data-and-resources/data-and-digital/name-and-synonymy-resources). | Web access via POWO; IDs shared with IPNI. | Best expert cross-check when automatic matching produces several candidates. Record Kew/IPNI identifiers where available. |
| **WCVP (bulk data)** | The full World Checklist of Vascular Plants as downloadable tables: names, accepted/synonym status, and distributions coded to TDWG WGSRPD regions. | Download from Kew's data repository [\[85\]](https://sftp.kew.org/pub/data-repositories/WCVP/) or query the WCVP API at [wcvp.ethcstwin.di.uoa.gr:65000/docs](https://wcvp.ethcstwin.di.uoa.gr:65000/docs) [\[142\]](https://wcvp.ethcstwin.di.uoa.gr:65000/docs): plant search, plants with locations, WGSRPD continents/regions/areas, and level-3 area codes by taxon or plant-name ID (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j); described in [\[83\]](https://powo.science.kew.org/about-wcvp) and the data paper [\[84\]](https://doi.org/10.1038/s41597-021-00997-6). Check the licence file in the download. | Offline backbone for reproducible matching during the event; distribution codes support **Geo** (where a historical author could plausibly have encountered a taxon). |
| **Kew Medicinal Plant Names Services (MPNS)** | Maps pharmaceutical, common, and scientific names of medicinal plants used in health regulation and the literature to accepted taxa. | Web portal [\[88\]](https://mpns.science.kew.org/); bulk/API access is restricted and licensed. | Directly relevant for linking *pharmaceutical* names (e.g. "Radix …") to taxa. Use for validation rather than redistribution. |
| **GBIF Species API** | Scientific-name matching, accepted taxa, synonyms, classification, vernacular names, and occurrence links. | The API supports name matching and retrieval of vernacular names by taxon key [\[37\]](https://discourse.gbif.org/t/api-geolocalisation-images-and-vernacular-names/4297) [\[38\]](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation) [\[136\]](https://www.gbif.org/developer/species). | Particularly useful for multilingual common names and geography, but vernacular names are not proof that a historical term refers to that taxon. |
| **Catalogue of Life / ChecklistBank** | Integrated global species checklist and taxonomic hierarchy with persistent identifiers. | Open API through ChecklistBank; some custom downloads require authentication [\[39\]](https://catalogueoflife.org/2020/12/18/infrastructure-live) [\[40\]](https://www.catalogueoflife.org/tools/api). | Useful as a second independent taxonomic backbone. |
| **BHL scientific-name tools** | Names detected across digitized biodiversity literature, linked to pages and books. | Via BHL API v3 [\[21\]](https://about.biodiversitylibrary.org/help/faq/) [\[22\]](https://about.biodiversitylibrary.org/tools-and-services/). | Useful for finding historical contexts and co-occurring spellings; OCR and automated name recognition require validation. |
| **Taxtree (NCBI TaxTree)** | NCBI Taxonomy-based taxonomic tree: names, name classes, nodes, siblings, descendants, and ranked lineages. | API at [taxtree.ethcstwin.di.uoa.gr:65000/docs](https://taxtree.ethcstwin.di.uoa.gr:65000/docs) [\[141\]](https://taxtree.ethcstwin.di.uoa.gr:65000/docs): name search, similar-name lookup and suggestions, name classes, node search (siblings, descendants), and ranked lineages with statistics (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j); data from NCBI Taxonomy [\[86\]](https://www.ncbi.nlm.nih.gov/taxonomy). | Use for lineage and hierarchy queries and for linking to NCBI-keyed chemistry and literature resources (see NCBI Taxonomy below). |
| **NCBI Taxonomy** | Taxonomic tree used across NCBI databases (PubMed, PubChem, GenBank). | Free web and E-utilities access; downloadable dump [\[86\]](https://www.ncbi.nlm.nih.gov/taxonomy). | Bridge key between plant taxa and the chemistry/literature resources (PubChem, LOTUS, UniProt) that use NCBI taxon IDs. |
| **Global Names Verifier**  | Fast verification of name strings against 100+ taxonomic sources, with fuzzy matching. | Free web tool and API [\[87\]](https://verifier.globalnames.org/). | Good first pass for noisy OCR'd Latin binomials before WFO/POWO matching. |
| **Wikidata**  | Linked identifiers for taxa (WFO, IPNI, GBIF, NCBI, POWO), multilingual common names, and LOTUS compound occurrences. | CC0; SPARQL endpoint [\[89\]](https://query.wikidata.org/). | Central crosswalk for building a graph; multilingual labels help vernacular matching (with the same caution as GBIF vernaculars). |

# **3\. Ethnobotanical databases**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **Dr. Duke's Phytochemical and Ethnobotanical Databases (USDA)** | Plant–chemical–activity–ethnobotany searching, including plant uses, chemical profiles, biological activities, and toxicity-related data [\[42\]](https://phytochem.nal.usda.gov/). | Free web search; downloadable data via USDA Ag Data Commons [\[92\]](https://data.nal.usda.gov/dataset/dr-dukes-phytochemical-and-ethnobotanical-databases). | A ready-made plant → compound → activity → use chain for end-to-end prototypes. Entries vary in sourcing depth, so cite the underlying reference. |
| **IMPPAT** | Manually curated Indian medicinal plants, plant parts, phytochemicals, therapeutic uses, protein targets, and literature references. Version 2.0 reports 4,010 plants, 17,967 phytochemicals, and 1,095 therapeutic uses [\[43\]](https://cb.imsc.res.in/imppat/) [\[44\]](https://pubmed.ncbi.nlm.nih.gov/36910986/). | Openly accessible without login [\[45\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC5847565/) [\[46\]](https://cb.imsc.res.in/imppat/help). | Covers Ayurveda, Siddha, Unani, and other Indian traditions, which extends the hackathon beyond Greco-Roman sources. |
| **Native American Ethnobotany Database** | Plant uses by Indigenous peoples of North America, searchable by plant, group, and use. | Free web search (BRIT) [\[90\]](http://naeb.brit.org/). | Records are attributed to specific peoples; apply the community-rights guidance in Responsible use and consider Local Contexts Notices. |
| **KNApSAcK Family** | Species–metabolite relationships plus regional medicinal/edible plant use, biological activity, Kampo, and Jamu modules [\[47\]](http://www.knapsackfamily.com/KNApSAcK_Family/) [\[48\]](http://www.knapsackfamily.com/KNApSAcK/). | Free web access; search engine downloadable via the website. | Kampo (Japanese) and Jamu (Indonesian) modules add East and Southeast Asian traditions. |
| **LOTUS / Natural Products Online** | Referenced organism–natural-product occurrence pairs, hosted on Wikidata and mirrored in an open portal [\[49\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC9135406/) [\[50\]](https://lotus.naturalproducts.net/). | Data are CC0 and queryable with SPARQL. | The cleanest open plant → compound edge (see also §4). |
| **Plants For A Future (PFAF)** | Useful plants, medicinal and edible uses, habitats, and cultivation. | Free web access [\[91\]](https://pfaf.org/); content is copyrighted, so ask permission before bulk scraping or redistribution. | Handy for user-facing **Apps** and cultivation context; not a primary scholarly source. |
| **Regional ethnobotanical datasets** | Country-, culture-, or community-specific use reports with plant part, preparation, use, place, and source. | Published as supplementary data to papers or in repositories (Zenodo, Dryad, GBIF checklists); licences vary. | See the use-report model below. Examples of structured historical/regional datasets: the Hallwyl Receptarium database [\[41\]](https://pubmed.ncbi.nlm.nih.gov/39097209/) and Ewé [\[51\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015817/). |
| **TKDL (Traditional Knowledge Digital Library, India)** *(added)* | Codified traditional formulations from Ayurveda, Unani, Siddha, Sowa Rigpa, and Yoga, created to prevent misappropriation through patents. | Restricted access for patent offices only [\[102\]](https://www.tkdl.res.in/). | Not usable as data, but a useful case study for the **Apps** and responsible-use discussion on protecting traditional knowledge. |

A robust ethnobotanical "use report" should include the taxon, verbatim local name, cultural or community attribution, location, plant part, preparation, route, indication, source, date, and governance information. The Ewé data model, for example, stores scientific name, synonym, common name, emic and etic use categories, plant part, application mode, geography, and literature or herbarium source [\[51\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015817/).

# **4\. Pharmacology and chemistry**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **ChEBI** | Open database and ontology for chemical entities of biological interest. | Public REST APIs require no authentication [\[52\]](https://www.ebi.ac.uk/chebi/backend/api/docs/) [\[53\]](https://www.ebi.ac.uk/chebi/); also the BioKB-ChEBI API at [chebi.ethcstwin.di.uoa.gr:65000/docs](https://chebi.ethcstwin.di.uoa.gr:65000/docs) [\[140\]](https://chebi.ethcstwin.di.uoa.gr:65000/docs): compounds, chemical data, database accessions, names, ontology relations, references, and sources (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j). | Normalize ingredients and phytochemicals to CHEBI: identifiers and chemical classes. |
| **PubChem** | Compound, substance, structure, annotation, and BioAssay data. | PUG-REST is the recommended simple programmatic interface; PubChem BioAssay is also downloadable in bulk [\[54\]](https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access) [\[55\]](https://pubchem.ncbi.nlm.nih.gov/docs/power-user-gateway) [\[56\]](https://pubchem.ncbi.nlm.nih.gov/docs/bioassays). | Map names to PubChem CID/InChIKey, retrieve structures, synonyms, properties, and assay summaries. PubChem also aggregates toxicity annotations useful for **Safety**. |
| **ChEMBL** | Curated molecules, targets, assays, quantitative bioactivity, drug indications, and related drug-discovery data. | REST API [\[57\]](https://www.ebi.ac.uk/chembl/api/data/docs); data CC BY-SA. | Connect plant compounds to measured target activities, keeping assay type, organism, units, and relation (=, \<, \>) intact. |
| **LOTUS** | Taxon–natural-product occurrence with references and Wikidata integration [\[49\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC9135406/). | CC0; SPARQL via Wikidata [\[50\]](https://lotus.naturalproducts.net/). | Establish the plant-to-compound edge before querying compound-to-target resources. |
| **IMPPAT** | Plant-part–phytochemical, plant-part–therapeutic use, and phytochemical–human target associations [\[43\]](https://cb.imsc.res.in/imppat/). | Open, no login [\[44\]](https://pubmed.ncbi.nlm.nih.gov/36910986/). | Useful integrated benchmark for end-to-end graph building. |
| **COCONUT** | Large open collection of natural-product structures aggregated from many sources, with organism and literature links. | Open web, API, and downloads [\[93\]](https://coconut.naturalproducts.net/); also the COCONUT API at [coconut.ethcstwin.di.uoa.gr:65000/docs](https://coconut.ethcstwin.di.uoa.gr:65000/docs) [\[138\]](https://coconut.ethcstwin.di.uoa.gr:65000/docs): compound search, organism and synonym suggestions, compound records, molfiles, structure images, statistics, and export (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j); described in the COCONUT 2.0 paper [\[94\]](https://doi.org/10.1093/nar/gkae1063). | Broad structure coverage that complements LOTUS; use for structure lookup and chemical-space analysis. |
| **BRENDA** | Enzyme database: reactions, substrates, inhibitors, kinetics, and organism-specific enzyme data. | Web and SOAP/API access [\[95\]](https://www.brenda-enzymes.org/); also the BRENDA REST API at [brenda.ethcstwin.di.uoa.gr:65000/docs](https://brenda.ethcstwin.di.uoa.gr:65000/docs) [\[139\]](https://brenda.ethcstwin.di.uoa.gr:65000/docs): enzyme classes by EC number, enzymes by organism, organisms, compounds, and references (hackathon-hosted wrapper, not the official service; also exports RDF/Turtle and imports into Neo4j); check the current licence terms. | Use for metabolism and enzyme-inhibition context, e.g. compounds that inhibit drug-metabolizing enzymes (relevant to herb–drug interactions in **Safety**). |
| **UniProt**  | Protein sequences and functional annotation for drug targets. | Open REST API [\[97\]](https://www.uniprot.org/); CC BY. | Normalize target identifiers coming from ChEMBL/IMPPAT so that graph nodes are consistent. |
| **NAPRALERT**  | Literature-derived natural-product database covering ethnomedical uses, chemistry, and pharmacology. | Web access [\[96\]](https://napralert.org/); full access requires a subscription. | Useful for expert validation of plant–use–activity links; not freely redistributable. |

**An assay result does not establish efficacy of a plant preparation, and a historical use does not establish safety.**

# **5\. Clinical evidence and regulatory monographs**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **PubMed / NCBI E-utilities** | Biomedical literature metadata and abstracts, indexed with MeSH. | Free API [\[103\]](https://www.ncbi.nlm.nih.gov/books/NBK25501/); an API key raises rate limits. | Retrieve modern studies for a plant–indication pair; MeSH indexing links directly to §8.1. |
| **Europe PMC** | Literature search plus open-access full text and text-mined annotations (genes, chemicals, organisms). | Free REST API [\[104\]](https://europepmc.org/RestfulWebService). | Full-text open-access articles allow evidence extraction beyond abstracts. |
| **ClinicalTrials.gov** | Registered clinical trials, including botanical and herbal interventions. | Free API v2 [\[105\]](https://clinicaltrials.gov/data-api/api). | Shows whether a historical claim has ever been tested clinically, and with what outcome. |
| **EMA herbal monographs (HMPC)** | EU monographs on herbal substances: "well-established use" and "traditional use" status, indications, contraindications, and warnings. | Free web access [\[106\]](https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products). | Authoritative modern reference point for comparing historical claims with today's regulatory view. |
| **WHO monographs on selected medicinal plants** | Quality, pharmacology, contraindications, and adverse-reaction summaries for widely used medicinal plants. | Free via WHO IRIS [\[107\]](https://iris.who.int/handle/10665/42052). | Complement to EMA with a global scope. |
| **NCCIH "Herbs at a Glance"** | Plain-language fact sheets on herbs: what the science says, and safety. | Free; US government content [\[108\]](https://www.nccih.nih.gov/health/herbsataglance). | Good model text for user-facing safety messaging in **Apps**. |

# **6\. Safety, toxicity, and interactions** 

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **LiverTox** | Clinical information on drug- and herbal/dietary-supplement-induced liver injury. | Free via NCBI Bookshelf [\[109\]](https://www.ncbi.nlm.nih.gov/books/NBK547852/). | Includes many herbal entries; use for hepatotoxicity flags on plants found in historical texts. |
| **openFDA CAERS (food/supplement adverse events)** | US adverse-event reports for foods, dietary supplements, and cosmetics. | Free API [\[110\]](https://open.fda.gov/apis/food/event/). | Spontaneous reports, not proof of causation; useful for signal exploration. Map products to taxa with care. |
| **EFSA Compendium of Botanicals** | Botanicals reported to contain naturally occurring substances of possible concern for human health. | Free download [\[111\]](https://www.efsa.europa.eu/en/data-report/compendium-botanicals). | Quick flagging of plants with known toxic constituents (e.g. pyrrolizidine alkaloids). |
| **EPA CompTox Chemicals Dashboard** | Toxicity, exposure, and physicochemical data for chemicals. | Free web and API [\[112\]](https://comptox.epa.gov/dashboard/). | Compound-level toxicity once plant → compound edges are established. |
| **DrugBank** | Drugs, targets, and drug–drug/drug–food interactions. | Free for academic non-commercial use with registration; commercial licence otherwise [\[113\]](https://go.drugbank.com/). | Herb–drug interaction reasoning via shared targets/enzymes; check licence before redistribution. |
| **Dr. Duke's / PubChem / BRENDA** | Toxicity-related data, toxicity annotations, and enzyme inhibition (see §3–4). | See above. | Combine for a layered safety view: plant → toxic constituent → mechanism. |

# **7\. Images, manuscripts, and specimens**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **GBIF occurrence API (with media)** | Herbarium specimen and observation records, many with images, coordinates, and dates. | Free API [\[114\]](https://techdocs.gbif.org/en/openapi/v1/occurrence); licence per record (CC0, CC BY, CC BY-NC). | Compare herbal illustrations with specimen images; build regional plant lists for **Geo**. |
| **iDigBio** | Digitized natural-history specimens (many herbarium sheets) with images. | Free API [\[115\]](https://www.idigbio.org/); licences per record. | Training and evaluation images for specimen-to-taxon tasks. |
| **LifeCLEF / PlantCLEF** | Benchmark challenges and datasets for plant identification from images. | Registration via LifeCLEF [\[116\]](https://www.imageclef.org/LifeCLEF); dataset-specific terms. | Ready-made evaluation protocol for plant-image recognition tasks. |
| **Pl@ntNet API** | Automated plant identification from photos. | Free tier with API key [\[117\]](https://my.plantnet.org/). | Baseline identifier for **Apps**; can be tested on herbal illustrations, though accuracy on drawings will be lower than on photos. |
| **BHL Flickr** | Hundreds of thousands of illustrations extracted from BHL books, including botanical plates. | Free [\[118\]](https://www.flickr.com/photos/biodivlibrary/); most are public domain or no known copyright restrictions. | Illustration-to-taxon matching; illustration retrieval. |
| **Wikimedia Commons: Herbals category** | Scanned pages and illustrations from historical herbals. | Free [\[119\]](https://commons.wikimedia.org/wiki/Category:Herbals); licences per file. | Quick-start image set for illustration tasks; combine with IIIF sources (Europeana, OPenn, Gallica) for higher resolution. |

# **8\. Geography, conservation, and sustainable sourcing** 

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **IUCN Red List API** | Global conservation status of assessed species. | API token required [\[120\]](https://api.iucnredlist.org/); non-commercial terms. | Flag threatened medicinal plants (sustainability angle for **Apps**). |
| **CITES Species+ API** | Species listed under CITES and trade-regulation status. | Free API with token [\[121\]](https://api.speciesplus.net/). | Identify medicinal plants whose trade is regulated. |
| **TDWG WGSRPD** | World Geographical Scheme for Recording Plant Distributions: standard region codes used by WCVP/POWO. | Open on GitHub [\[122\]](https://github.com/tdwg/wgsrpd). | Join WCVP distributions to maps; test whether a candidate taxon grows in the region a historical author describes. |
| **WCVP / POWO distributions; GBIF occurrences** | Native/introduced ranges and point occurrences (see §2 and §7). | See above. | Geographic plausibility is strong evidence when ranking candidate taxa for a historical name. |

# **9\. Terminologies and standards**

## **9.1 Clinical and biomedical concepts**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **MeSH** | Conditions, symptoms, anatomy, pharmacological actions, organisms, chemicals, dosage forms, and broad therapeutic-use normalization. MeSH defines a "therapeutic use" subheading for prophylaxis and treatment uses [\[58\]](https://meshb.nlm.nih.gov/record/ui?ui=D045506) [\[59\]](https://meshb.nlm.nih.gov/record/ui?ui=Q000627). | Free from NLM; downloadable and via API. | Strong default for a hackathon because it is multilingual in some services, hierarchical, well linked to PubMed, and less operationally burdensome than using the whole UMLS. |
| **Disease Ontology (DOID)** | Open disease identifiers and mappings for a knowledge graph. | The API is OpenAPI-compliant, and the project's data/code are released under CC0 [\[60\]](https://disease-ontology.org/resources/do-api) [\[61\]](https://pmc.ncbi.nlm.nih.gov/articles/PMC12807653/). | Good open target for normalizing indications in a redistributable graph. |
| **ICD-11** | Mapping historical indications to contemporary disease categories and optional traditional-medicine categories. | WHO provides a multilingual browser/coding tool and REST API; registration is required for API keys [\[62\]](https://www.who.int/news/item/11-02-2022-icd-11-2022-release) [\[63\]](https://icd.who.int/icdapi). | The supplementary traditional-medicine chapter is for optional dual coding and is not intended for mortality reporting [\[64\]](https://www.who.int/standards/classifications/classification-of-diseases). |
| **UMLS Metathesaurus** | Crosswalk among MeSH, SNOMED CT, RxNorm, ICD, MedDRA, HPO, and many other vocabularies; useful for synonym expansion and concept identifiers. | A free individual UTS account and acceptance of the UMLS licence are required; constituent vocabularies have different redistribution restrictions [\[65\]](https://www.nlm.nih.gov/research/umls/index.html) [\[66\]](https://uts.nlm.nih.gov/uts/umls/home). | Do not bundle UMLS-derived terminology files into a public hackathon repository without checking every source restriction. |
| **SNOMED CT** | Detailed clinical findings, disorders, procedures, substances, and body structures. | Licence and distribution rules apply; access through UMLS does not make unrestricted redistribution permissible [\[67\]](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html) [\[68\]](https://www.nlm.nih.gov/research/umls/Snomed/snomed_license.html) [\[65\]](https://www.nlm.nih.gov/research/umls/index.html). | Valuable for sophisticated clinical mappings. |
| **RxNorm / ATC** | Modern clinical drugs, ingredients, strengths, dose forms, and therapeutic classes. RxNorm is designed as a standardized nomenclature for clinical drugs [\[69\]](https://www.nlm.nih.gov/research/umls/rxnorm/docs/techdoc.html). | RxNorm free from NLM (some content needs a UMLS licence); ATC from WHO. | Use only when the result is a modern medicinal product or normalized drug ingredient, not for an unstandardized historical plant preparation. |
| **MedDRA** | Adverse events, toxicities, and safety outcomes. | Redistribution/licensing constraints make it less convenient for an open hackathon corpus; UMLS includes it but does not erase source restrictions [\[66\]](https://uts.nlm.nih.gov/uts/umls/home). | Particularly relevant for safety extraction. |

## **9.2 Plant, anatomy, chemical, and taxonomic standards**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **Plant Ontology (PO)** | Plant anatomy, morphology, and development [\[70\]](https://obofoundry.org/ontology/po.html). | Open (OBO Foundry). | Use for leaf, root, rhizome, bark, seed, flower, fruit, and developmental stages. |
| **ChEBI Ontology** | Chemicals, chemical roles, structural classes, mixtures/components, and normalized identifiers [\[52\]](https://www.ebi.ac.uk/chebi/backend/api/docs/) [\[53\]](https://www.ebi.ac.uk/chebi/). | Open; REST API. | Normalize compounds and chemical classes. |
| **Uberon** | Cross-species anatomical structures [\[71\]](https://obofoundry.org/ontology/uberon.html). | Open (OBO Foundry). | Useful for body-site normalization where a claim refers to an organ or tissue. |
| **WFO IDs / GBIF taxon keys / Catalogue of Life IDs** | Stable taxonomic entity links and accepted-name/synonym reconciliation [\[34\]](https://list.worldfloraonline.org/matching.php) [\[38\]](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation) [\[40\]](https://www.catalogueoflife.org/tools/api). | Open APIs (see §2). | Store all three where possible for cross-backbone checking. |
| **Darwin Core** | Taxon, occurrence, specimen, locality, scientific name, and vernacular-name exchange. | Open TDWG standard [\[123\]](https://dwc.tdwg.org/). | Export format for taxon and vernacular-name tables; interoperates with GBIF. |
| **TDWG Economic Botany Data Collection Standard** | Structured plant-use descriptions in cultural context, attached to taxonomic data [\[72\]](https://www.tdwg.org/standards/economic-botany/) [\[73\]](https://www.tdwg.org/standards/economic-botany/). | Open TDWG standard. | Use-category vocabulary for **Uses** (medicines, food, poisons, etc.). |

## **9.3 Text, metadata, and provenance**

| Resource | What it provides | Access & licence | How to use it / notes |
| :---- | :---- | :---- | :---- |
| **TEI P5 / TEI-XML** | Encode source structure, pages, lines, abbreviations, corrections, uncertain readings, names, dates, recipes, and links from text spans to authority records. TEI is designed for texts of any language, period, genre, or form and supports interchange and application-independent processing [\[74\]](https://tei-c.org/release/doc/tei-p5-doc/en/html/AB.html). | Open standard. | Recommended encoding for transcriptions delivered by **Texts** teams. |
| **IIIF** | Interoperable page-image access, manifests, regions, annotations, and image viewers. Europeana, Cambridge Digital Library, and many manuscript libraries expose IIIF [\[33\]](https://www.lib.cam.ac.uk/curiouscures) [\[26\]](https://pro.europeana.eu/page/apis). | Open specifications [\[133\]](https://iiif.io/api/). | Lets apps display the exact page region behind every extracted claim. |
| **ALTO XML / PAGE XML** | OCR layout, lines, tokens, coordinates, and confidence. Gallica exposes ALTO and corrected OCR datasets [\[28\]](https://api.bnf.fr/fr/api-document-de-gallica) [\[29\]](https://api.bnf.fr/fr/texte-corrige-et-ocr-de-documents-de-gallica). | Open standards [\[131\]](https://www.loc.gov/standards/alto/) [\[132\]](https://github.com/PRImA-Research-Lab/PAGE-XML). | Useful for highlighting extracted claims on page images. |
| **Dublin Core / DataCite** | Bibliographic and dataset metadata. | Open standards [\[124\]](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/) [\[125\]](https://schema.datacite.org/). | Describe every corpus item and the final hackathon datasets. |
| **PROV-O** | Provenance of OCR, normalization, model extraction, human review, and database enrichment. | W3C Recommendation [\[126\]](https://www.w3.org/TR/prov-o/). | Record which model or person produced each assertion, and when. |
| **Web Annotation Data Model** | Stand-off annotations linking exact text or image regions to extracted entities and relations. | W3C Recommendation [\[127\]](https://www.w3.org/TR/annotation-model/). | Bridge between IIIF images, TEI text, and graph entities. |
| **JSON-LD / RDF / SKOS** | Linked-data representation, concept schemes, mappings, and knowledge graphs. | W3C Recommendations [\[128\]](https://www.w3.org/TR/json-ld11/) [\[129\]](https://www.w3.org/TR/rdf11-primer/) [\[130\]](https://www.w3.org/TR/skos-reference/). | SKOS mapping properties (exactMatch, closeMatch, broadMatch) express uncertain historical → modern mappings well. |

# **In-kind sponsor perks**

Two in-kind sponsors give every participant free access during the event. You sign up yourself.

| Resource | What it provides | Access & licence | How to use it / notes | Tracks |
| :---- | :---- | :---- | :---- | :---- |
| **Anakin (YC 21\)**  | Turns any website into a structured REST API, so you can pull live web data without writing scrapers. | **Offer for participants:** one free month of the \$20/month plan. **Bonus:** winning team gets the \$100/month plan free for the first month, then 50% off for 3 months, plus office hours with the Anakin team. **How to claim:** s[ign-up link](https://docs.google.com/document/d/1MypGwVDuftfAtgs6N8cx9SdrBHjpP6z7TAaQ84AgB3E/edit?usp=sharing). | **Anakin for your build.** Useful when your project needs live web data as JSON, for example plant listings, pharmacopoeia pages or clinical-trial registries. | All tracks (especially Texts, Chemistry, Safety, Apps) |
| **Aitho**  | Rehearsal tool for presenters: speak your talk and the script follows your voice. | **Offer for participants:** Aitho Presenter Pro free through 31 December. **Bonus:** none. **How to claim:** [sign up here](https://aitho.app/rehearse?ref=exp500&ch=hack-ethnohack-cohort) . | **Aitho for your pitch.** Practising out loud is what makes a short pitch land. Import your slides, add what you plan to say, and speak; the script follows your voice so you can practise your 10-minute timing without reading. It is for practice only; the EthnoHack rules apply as usual. | All tracks (final pitch) |

# **Responsible use**

## **Historical claims are not treatments**

All user-facing prototypes should display a clear warning that extracted passages describe historical or traditional claims, not established efficacy or safe medical advice. Avoid generating modern dosing instructions from historical quantities, and do not encourage participants to prepare or ingest remedies.

## **Community rights**

Public availability does not automatically make traditional knowledge ethically unrestricted. The Nagoya Protocol addresses access, prior informed consent, mutually agreed terms, and benefit-sharing for traditional knowledge associated with genetic resources. Organizers should avoid newly collected or community-restricted knowledge unless appropriate permissions and partnerships exist [\[75\]](https://www.cbd.int/abs/infokit/revised/web/factsheet-tk-en.pdf) [\[76\]](https://www.cbd.int/abs/text/).  
Local Contexts Traditional Knowledge and Biocultural Labels allow communities to express provenance, protocols, and permissions; institutions and researchers can use Notices to flag Indigenous rights and interests when detailed community labels have not yet been applied [\[77\]](https://localcontexts.org/labels/traditional-knowledge-labels/) [\[78\]](https://localcontexts.org/support/frequently-asked-questions/) [\[79\]](https://localcontexts.org/).

## **Copyright and database rights**

* Record rights at item and edition level, not only repository level.  
* Ancient authors are public domain, but modern translations, editions, annotations, and database compilations may not be.  
* Public viewing does not imply permission for bulk redistribution or model training.  
* Prefer Public Domain, CC0, CC BY, or clearly compatible research licences.  
* Keep a machine-readable rights\_uri, attribution text, source URL, and retrieval date for every corpus item.  
* For BHL and Wellcome, inspect the rights statement for each item even though much of the metadata or many digitizations are open [\[20\]](https://wellcomecollection.org/collections/accessing-our-collections) [\[23\]](https://about.biodiversitylibrary.org/help/terms-of-use/) [\[21\]](https://about.biodiversitylibrary.org/help/faq/).

# **References**

## **Original references**

1\.[\[Peri hylēs iatrikēs logoi hex\] De materia medica / Dioscorides (Venice: Aldus, 1499). Wellcome Collection](https://wellcomecollection.org/works/t2eqd53z): "You can use this work for any purpose without restriction under copyright law."

2\.[Pedakiou Dioskoridou Anazarbeōs Peri hylēs iatrikēs logoi hex (1499). National Library of Medicine via Internet Archive](https://archive.org/details/2211031RX1.nlm.nih.gov): "The National Library of Medicine believes this item to be in the public domain."

3\.[Pedanii Dioscoridis anazerbei De materia medica libri quinque: ad fidem codicum manuscriptorum (1829). Internet Archive](https://archive.org/details/b23982500_0001)

4\.[Pedanii Dioscoridis Anazarbei De materia medica libri quinque (1829). Internet Archive](https://archive.org/details/b33286978_0001): Public Domain Mark

5\.[Alexander von Tralles: Original-Text und Übersetzung (1878), digitized by Google from the University of Michigan. Internet Archive](https://archive.org/details/bub_gb_Qq8CAAAAMAAJ)

6\.[Alexander von Tralles: Original-Text und Übersetzung (1878), parallel Greek and German texts. Internet Archive](https://archive.org/details/b24755990_0001)

7\.[PerseusCatalog: Hippocrates (incl. *De morbo sacro*)](https://catalog.perseus.org/catalog/urn:cts:greekLit:tlg0627)

8\.[Scaife Viewer: Hippocrates, urn:cts:greekLit:tlg0627.tlg001](https://scaife.perseus.org/library/urn:cts:greekLit:tlg0627.tlg001/)

9\.[Pliny the Elder, *The Natural History*, Book XXIV: The remedies derived from the forest trees. Perseus](http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=24)

10\.[Pliny the Elder, *The Natural History*, Book XXVI: Remedies derived from plants, classified according to particular diseases. Perseus](http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.02.0137:book=26)

11\.[Qānūn fī ʻilm al-ṭibb, Avicenna, 980–1037. NLM via Internet Archive](https://archive.org/details/9403778.nlm.nih.gov)

12\.[Canon medicinae III–V, Avicenna (1476), Public Domain Mark 1.0. Internet Archive](https://archive.org/details/OEXV35RES)

13\.[The Canon of Medicine, Volume 2\. Internet Archive](https://archive.org/details/the-canon-of-medicine-volume-2)

14\.[The Canon of Medicine, Volume 1\. Internet Archive](https://archive.org/details/the-canon-of-medicine-volume-1)

15\.[The Complete Herbal by Nicholas Culpeper. Project Gutenberg](https://www.gutenberg.org/ebooks/49513)

16\.[The Complete Herbal, plain text (pg49513.txt). Project Gutenberg](https://www.gutenberg.org/cache/epub/49513/pg49513.txt)

17\.[The Complete Herbal, HTML edition. Project Gutenberg](https://www.gutenberg.org/files/49513/49513-h/49513-h.htm)

18\.[Cookery and Medical Recipe Book (late 17th–18th century). Wellcome Collection](https://wellcomecollection.org/works/sx2nv9yd)

19\.[Domestic medicine: a treatise on the prevention and cure of diseases, William Buchan (London, 1828). Wellcome Collection](https://wellcomecollection.org/works/my7z8qtd)

20\.[Accessing our collections. Wellcome Collection](https://wellcomecollection.org/collections/accessing-our-collections)

21\.[FAQ: About BHL. Biodiversity Heritage Library](https://about.biodiversitylibrary.org/help/faq/)

22\.[Tools and Services. Biodiversity Heritage Library](https://about.biodiversitylibrary.org/tools-and-services/)

23\.[Terms of Use: About BHL. Biodiversity Heritage Library](https://about.biodiversitylibrary.org/help/terms-of-use/)

24\.[Version 3 of the BHL API Now Available. BHL blog](https://blog.biodiversitylibrary.org/2018/09/version-3-of-the-bhl-api-now-available)

25\.[API Version 3 Documentation. Biodiversity Heritage Library](https://www.biodiversitylibrary.org/docs/api3.html)

26\.[Europeana APIs. Europeana Pro](https://pro.europeana.eu/page/apis)

27\.[Europeana APIs. Europeana](https://www.europeana.eu/en/apis)

28\.[API Document de Gallica (OCR/ALTO access). BnF API](https://api.bnf.fr/fr/api-document-de-gallica)

29\.[Gallica: texte corrigé et OCR de documents. BnF API](https://api.bnf.fr/fr/texte-corrige-et-ocr-de-documents-de-gallica)

30\.[API Gallica Recherche. BnF API](https://api.bnf.fr/fr/api-gallica-de-recherche)

31\.[API de recherche de Gallica. data.gouv.fr](https://www.data.gouv.fr/dataservices/api-gallica-recherche)

32\.[Bibliotheca Philadelphiensis: OPenn](https://openn.library.upenn.edu/)

33\.[Curious Cures: enhancing the discoverability of medieval medical recipes. Cambridge University Library](https://www.lib.cam.ac.uk/curiouscures)

34\.[WFO Plant List: Name Matching. World Flora Online](https://list.worldfloraonline.org/matching.php)

35\.[The World Flora Online: data download (static backbone, CC0)](https://www.worldfloraonline.org/downloadData)

36\.[Name and synonymy resources. Royal Botanic Gardens, Kew](https://www.kew.org/science/data-and-resources/data-and-digital/name-and-synonymy-resources)

37\.[GBIF community forum: API (geolocalisation, images and vernacular names)](https://discourse.gbif.org/t/api-geolocalisation-images-and-vernacular-names/4297)

38\.[Taxonomy interpretation. GBIF Technical Documentation](https://techdocs.gbif.org/en/data-processing/taxonomy-interpretation)

39\.[New Catalogue of Life infrastructure live. COL](https://catalogueoflife.org/2020/12/18/infrastructure-live)

40\.[COL API. Catalogue of Life](https://www.catalogueoflife.org/tools/api)

41\.[Plants and their uses in dermatological recipes of the Receptarium of Burkhard III von Hallwyl from 16th century Switzerland: data mining a historical text and preliminary in vitro screening. J Ethnopharmacol 2024\. PubMed](https://pubmed.ncbi.nlm.nih.gov/39097209/)

42\.[Dr. Duke's Phytochemical and Ethnobotanical Databases. USDA](https://phytochem.nal.usda.gov/)

43\.[IMPPAT: Indian Medicinal Plants, Phytochemistry And Therapeutics](https://cb.imsc.res.in/imppat/)

44\.[IMPPAT 2.0: An Enhanced and Expanded Phytochemical Atlas of Indian Medicinal Plants. ACS Omega 2023\. PubMed](https://pubmed.ncbi.nlm.nih.gov/36910986/)

45\.[IMPPAT: A curated database of Indian Medicinal Plants, Phytochemistry And Therapeutics. Sci Rep 2018\. PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5847565/)

46\.[HELP: IMPPAT](https://cb.imsc.res.in/imppat/help)

47\.[KNApSAcK Family (instruction manual and databases)](http://www.knapsackfamily.com/KNApSAcK_Family/)

48\.[KNApSAcK: A Comprehensive Species-Metabolite Relationship Database](http://www.knapsackfamily.com/KNApSAcK/)

49\.[The LOTUS initiative for open knowledge management in natural products research. eLife 2022\. PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9135406/)

50\.[LOTUS: Natural Products Online](https://lotus.naturalproducts.net/)

51\.[Ewé: a web-based ethnobotanical database for storing and analysing data. Database (Oxford) 2020\. PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015817/)

52\.[ChEBI RESTful APIs. EMBL-EBI](https://www.ebi.ac.uk/chebi/backend/api/docs/)

53\.[ChEBI: Chemical Entities of Biological Interest. EMBL-EBI](https://www.ebi.ac.uk/chebi/)

54\.[Programmatic Access. PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/programmatic-access)

55\.[Power User Gateway (PUG). PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/power-user-gateway)

56\.[BioAssays. PubChem](https://pubchem.ncbi.nlm.nih.gov/docs/bioassays)

57\.[ChEMBL web services: activity and data API documentation. EMBL-EBI](https://www.ebi.ac.uk/chembl/api/data/docs) (originally cited via the APIs.io listing)

58\.[Therapeutic Uses \[Pharmacologic Action\]. MeSH](https://meshb.nlm.nih.gov/record/ui?ui=D045506)

59\.[therapeutic use \[Subheading\]. MeSH](https://meshb.nlm.nih.gov/record/ui?ui=Q000627)

60\.[API Documentation. Disease Ontology](https://disease-ontology.org/resources/do-api)

61\.[The DO-KB knowledgebase 2026 update: expanding programmatic and language access. Nucleic Acids Res 2026\. PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12807653/)

62\.[ICD-11 2022 release. World Health Organization](https://www.who.int/news/item/11-02-2022-icd-11-2022-release)

63\.[ICD API. WHO](https://icd.who.int/icdapi)

64\.[International Classification of Diseases (ICD). WHO](https://www.who.int/standards/classifications/classification-of-diseases)

65\.[How to License and Access the Unified Medical Language System (UMLS). NLM](https://www.nlm.nih.gov/research/umls/index.html)

66\.[UMLS Metathesaurus Browser (UTS). NLM](https://uts.nlm.nih.gov/uts/umls/home)

67\.[UMLS Metathesaurus License Agreement Appendix. NLM](https://www.nlm.nih.gov/research/umls/knowledge_sources/metathesaurus/release/license_agreement_appendix.html)

68\.[UMLS: SNOMED CT Affiliate License Agreement. NLM](https://www.nlm.nih.gov/research/umls/Snomed/snomed_license.html)

69\.[RxNorm Technical Documentation. NLM](https://www.nlm.nih.gov/research/umls/rxnorm/docs/techdoc.html)

70\.[Plant Ontology. OBO Foundry](https://obofoundry.org/ontology/po.html)

71\.[Uberon. OBO Foundry](https://obofoundry.org/ontology/uberon.html)

72\.[Economic Botany Data Collection Standard. TDWG](https://www.tdwg.org/standards/economic-botany/)

73.Cook, F.E.M. *Economic Botany Data Collection Standard* (standard document, "Thomas.indd"), available from the [TDWG standard page](https://www.tdwg.org/standards/economic-botany/)

74\.[iv. About These Guidelines. TEI P5](https://tei-c.org/release/doc/tei-p5-doc/en/html/AB.html)

75\.[Nagoya Protocol on Access and Benefit-sharing and Traditional Knowledge (fact sheet). CBD](https://www.cbd.int/abs/infokit/revised/web/factsheet-tk-en.pdf)

76\.[Text of the Nagoya Protocol. CBD](https://www.cbd.int/abs/text/)

77\.[Traditional Knowledge (TK) and Biocultural (BC) Labels. Local Contexts](https://localcontexts.org/labels/traditional-knowledge-labels/)

78\.[Frequently Asked Questions. Local Contexts](https://localcontexts.org/support/frequently-asked-questions/)

79\.[Local Contexts: Grounding Indigenous Rights](https://localcontexts.org/)

## **Added references**

80\.[RESTful API for BioKB-WFO (hackathon-hosted), University of Athens](https://wfo.ethcstwin.di.uoa.gr:65000/docs)

81\.[International Plant Names Index (IPNI)](https://www.ipni.org/)

82\.[pykew: Python access to Kew's IPNI and POWO APIs. GitHub](https://github.com/RBGKew/pykew)

83\.[About WCVP. Plants of the World Online, Kew](https://powo.science.kew.org/about-wcvp)

84\.[Govaerts et al. (2021) The World Checklist of Vascular Plants, a continuously updated resource for exploring global plant diversity. Scientific Data](https://doi.org/10.1038/s41597-021-00997-6)

85\.[WCVP data downloads. Kew data repository](https://sftp.kew.org/pub/data-repositories/WCVP/)

86\.[NCBI Taxonomy](https://www.ncbi.nlm.nih.gov/taxonomy)

87\.[Global Names Verifier](https://verifier.globalnames.org/)

88\.[Medicinal Plant Names Services (MPNS). Kew](https://mpns.science.kew.org/)

89\.[Wikidata Query Service](https://query.wikidata.org/)

90\.[Native American Ethnobotany Database. BRIT](http://naeb.brit.org/)

91\.[Plants For A Future](https://pfaf.org/)

92\.[Dr. Duke's Phytochemical and Ethnobotanical Databases: data download. USDA Ag Data Commons](https://data.nal.usda.gov/dataset/dr-dukes-phytochemical-and-ethnobotanical-databases)

93\.[COCONUT: COlleCtion of Open Natural prodUcTs](https://coconut.naturalproducts.net/)

94\.[COCONUT 2.0: a comprehensive overhaul and curation of the collection of open natural products database. Nucleic Acids Res 2025](https://doi.org/10.1093/nar/gkae1063)

95\.[BRENDA: The Comprehensive Enzyme Information System](https://www.brenda-enzymes.org/)

96\.[NAPRALERT](https://napralert.org/)

97\.[UniProt](https://www.uniprot.org/)

98\.[OpenITI: Open Islamicate Texts Initiative](https://openiti.org/)

99\.[Chinese Text Project](https://ctext.org/)

100\.[Logeion. University of Chicago](https://logeion.uchicago.edu/)

101\.[CLTK: The Classical Language Toolkit](https://cltk.org/)

102\.[Traditional Knowledge Digital Library (TKDL), India](https://www.tkdl.res.in/)

103\.[Entrez Programming Utilities Help. NCBI](https://www.ncbi.nlm.nih.gov/books/NBK25501/)

104\.[Europe PMC RESTful Web Service](https://europepmc.org/RestfulWebService)

105\.[ClinicalTrials.gov API](https://clinicaltrials.gov/data-api/api)

106\.[Herbal medicinal products. European Medicines Agency](https://www.ema.europa.eu/en/human-regulatory-overview/herbal-medicinal-products)

107\.[WHO monographs on selected medicinal plants, Vol. 1\. WHO IRIS](https://iris.who.int/handle/10665/42052)

108\.[Herbs at a Glance. NCCIH](https://www.nccih.nih.gov/health/herbsataglance)

109\.[LiverTox: Clinical and Research Information on Drug-Induced Liver Injury. NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK547852/)

110\.[openFDA: Food, dietary supplement, and cosmetic adverse event reports (CAERS)](https://open.fda.gov/apis/food/event/)

111\.[Compendium of botanicals. EFSA](https://www.efsa.europa.eu/en/data-report/compendium-botanicals)

112\.[CompTox Chemicals Dashboard. US EPA](https://comptox.epa.gov/dashboard/)

113\.[DrugBank](https://go.drugbank.com/)

114\.[GBIF Occurrence API. GBIF Technical Documentation](https://techdocs.gbif.org/en/openapi/v1/occurrence)

115\.[iDigBio](https://www.idigbio.org/)

116\.[LifeCLEF (incl. PlantCLEF). ImageCLEF](https://www.imageclef.org/LifeCLEF)

117\.[Pl@ntNet API](https://my.plantnet.org/)

118\.[Biodiversity Heritage Library on Flickr](https://www.flickr.com/photos/biodivlibrary/)

119\.[Category: Herbals. Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Herbals)

120\.[IUCN Red List API](https://api.iucnredlist.org/)

121\.[Species+ / CITES API](https://api.speciesplus.net/)

122\.[World Geographical Scheme for Recording Plant Distributions (WGSRPD). TDWG, GitHub](https://github.com/tdwg/wgsrpd)

123\.[Darwin Core. TDWG](https://dwc.tdwg.org/)

124\.[DCMI Metadata Terms. Dublin Core](https://www.dublincore.org/specifications/dublin-core/dcmi-terms/)

125\.[DataCite Metadata Schema](https://schema.datacite.org/)

126\.[PROV-O: The PROV Ontology. W3C](https://www.w3.org/TR/prov-o/)

127\.[Web Annotation Data Model. W3C](https://www.w3.org/TR/annotation-model/)

128\.[JSON-LD 1.1. W3C](https://www.w3.org/TR/json-ld11/)

129\.[RDF 1.1 Primer. W3C](https://www.w3.org/TR/rdf11-primer/)

130\.[SKOS Reference. W3C](https://www.w3.org/TR/skos-reference/)

131\.[ALTO: Technical Metadata for Layout and Text Objects. Library of Congress](https://www.loc.gov/standards/alto/)

132\.[PAGE-XML. PRImA Research Lab, GitHub](https://github.com/PRImA-Research-Lab/PAGE-XML)

133\.[IIIF APIs](https://iiif.io/api/)

134\.[Pedanii Dioscuridis De materia medica libri quinque, ed. M. Wellmann, vols. 1–3. Internet Archive](https://archive.org/details/b21459162_0001)

135\.[The Greek Herbal of Dioscorides, Englished by John Goodyer (1655), ed. R.T. Gunther (1933). Internet Archive](https://archive.org/details/greekherbalofdio0000robe)

136\.[GBIF Species API](https://www.gbif.org/developer/species)

137\.[IPNI Data API (hackathon-hosted), University of Athens](https://ipni.ethcstwin.di.uoa.gr:65000/docs)

138\.[RESTful API for COCONUT (hackathon-hosted), University of Athens](https://coconut.ethcstwin.di.uoa.gr:65000/docs)

139\.[RESTful API for BRENDA (hackathon-hosted), University of Athens](https://brenda.ethcstwin.di.uoa.gr:65000/docs)

140\.[RESTful API for BioKB-ChEBI (hackathon-hosted), University of Athens](https://chebi.ethcstwin.di.uoa.gr:65000/docs)

141\.[NCBI TaxTree Data API (hackathon-hosted), University of Athens](https://taxtree.ethcstwin.di.uoa.gr:65000/docs)

142\.[RESTful API for WCVP (hackathon-hosted), University of Athens](https://wcvp.ethcstwin.di.uoa.gr:65000/docs)
import { sources } from "./catalog.ts";

export const evidenceVersion = "1.0.0";
export const evidenceLabels = {
  traditional: "Documented traditional use",
  laboratory: "Laboratory research",
  human: "Human research",
  guidance: "Official public-health guidance",
};

type EvidenceInput = {
  id: string;
  taxa: string[];
  type: keyof typeof evidenceLabels;
  design: string;
  title: string;
  url: string;
  sourceId: string;
  location: string;
  part: string;
  preparation: string;
  finding: string;
  limitation: string;
  keywords: string[];
  href?: string;
};

const entries: EvidenceInput[] = [
  {
    id: "roselle-simvastatin", taxa: ["hibiscus"], type: "human",
    design: "Crossover pharmacokinetic study", title: "Roselle beverage and simvastatin",
    url: "https://pubmed.ncbi.nlm.nih.gov/28925046/", sourceId: "PMID:28925046", location: "Abstract, human pharmacokinetic results",
    part: "Calyces", preparation: "Aqueous calyx beverage",
    finding: "In a crossover study of six healthy volunteers, an aqueous roselle calyx beverage reduced exposure to a single dose of simvastatin.",
    limitation: "This measured drug exposure under specific conditions. Effects of other preparations and the clinical significance for individuals are uncertain.",
    keywords: ["simvastatin", "interaction", "medicine", "drug exposure", "pharmacokinetics"],
  },
  {
    id: "roselle-blood-pressure", taxa: ["hibiscus"], type: "human",
    design: "Randomized placebo-controlled trial", title: "Brewed roselle and blood pressure",
    url: "https://pubmed.ncbi.nlm.nih.gov/20018807/", sourceId: "PMID:20018807", location: "Abstract, methods and results",
    part: "unknown", preparation: "Brewed roselle tea",
    finding: "In a six-week trial of 65 adults with prehypertension or mild hypertension, systolic blood pressure fell more in the brewed roselle group than in the placebo group.",
    limitation: "The study excluded people on blood-pressure-lowering medicines. It does not establish the effects of other products or replace clinical care.",
    keywords: ["blood pressure", "hypertension", "systolic"],
  },
  {
    id: "ginger-ema", taxa: ["ginger"], type: "traditional",
    design: "EMA herbal monograph", title: "Traditional uses of ginger rhizome",
    url: sources.ema, sourceId: "EMA:Zingiberis-rhizoma", location: "EU herbal monograph, therapeutic indications",
    part: "Rhizome", preparation: "Specified ginger rhizome preparations",
    finding: "The EMA monograph documents traditional use of specified ginger rhizome preparations for mild digestive complaints.",
    limitation: "Traditional use is a separate evidence category. The monograph does not establish the effects of an arbitrary tea or blend.",
    keywords: ["traditional", "digestion", "digestive", "monograph"],
  },
  {
    id: "ginger-emptying-wu", taxa: ["ginger"], type: "human",
    design: "Randomized double-blind crossover trial", title: "Ginger and stomach emptying",
    url: "https://pubmed.ncbi.nlm.nih.gov/18403946/", sourceId: "PMID:18403946", location: "Abstract, methods and results",
    part: "Rhizome", preparation: "Ginger capsules",
    finding: "In a crossover trial with 24 healthy volunteers, stomach emptying after a test meal was faster with ginger capsules than with placebo.",
    limitation: "The trial measured short-term motility in healthy volunteers. It does not establish symptom relief or apply automatically to other preparations.",
    keywords: ["gastric emptying", "stomach emptying", "motility", "digestion"],
  },
  {
    id: "ginger-emptying-phillips", taxa: ["ginger"], type: "human",
    design: "Randomized double-blind crossover trial", title: "A ginger trial with no observed effect on stomach emptying",
    url: "https://pubmed.ncbi.nlm.nih.gov/8317647/", sourceId: "PMID:8317647", location: "Abstract",
    part: "Rhizome", preparation: "Powdered rhizome",
    finding: "In a crossover trial with 16 healthy volunteers, powdered ginger showed no effect on stomach emptying as measured by a paracetamol absorption test.",
    limitation: "This small trial used a different test and study protocol from other ginger trials. Its result does not settle the question for every preparation.",
    keywords: ["gastric emptying", "stomach emptying", "motility", "digestion"],
  },
  {
    id: "guava-lab", taxa: ["guava"], type: "laboratory",
    design: "In vitro experiments", title: "Guava leaf extract in diarrhoeal disease research",
    url: sources.paper, sourceId: "PMCID:PMC2911405", location: "Methods and results, antidiarrhoeal assays",
    part: "Leaves", preparation: "Hot-water decoction",
    finding: "Researchers tested a guava leaf decoction in laboratory assays involving diarrhoeal pathogens and toxins, including cholera-related assays.",
    limitation: "Laboratory findings do not establish clinical benefit. Guava is not a proven cholera treatment. Follow official public-health guidance.",
    keywords: ["cholera", "diarrhoea", "diarrhea", "toxin", "bacteria"],
  },
  {
    id: "cinnamon-bark-chemistry", taxa: ["cinnamon-verum", "cinnamon-cassia"], type: "laboratory",
    design: "Comparative chemical analysis", title: "Coumarin in sampled cinnamon bark",
    url: "https://pubmed.ncbi.nlm.nih.gov/23627682/", sourceId: "PMID:23627682", location: "Abstract, authenticated bark results",
    part: "Bark", preparation: "Authenticated bark samples",
    finding: "A chemical analysis found much more coumarin in the sampled Indonesian cassia bark than in the sampled Ceylon cinnamon bark.",
    limitation: "The study measured compounds in samples. A product label does not establish its species, coumarin content, or safety.",
    keywords: ["coumarin", "chemistry", "difference", "bark", "indonesian cassia", "cinnamomum burmannii"],
  },
  {
    id: "ceylon-phase-one", taxa: ["cinnamon-verum"], type: "human",
    design: "Single-arm phase I study", title: "Ceylon cinnamon extract in healthy adults",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5745724/", sourceId: "PMCID:PMC5745724", location: "Methods, intervention and study design",
    part: "Bark", preparation: "Encapsulated water extract",
    finding: "A phase I study assessed tolerability and monitored clinical and laboratory measures in healthy adults taking a Ceylon cinnamon extract.",
    limitation: "The study had no placebo group. It cannot establish clinical effectiveness or safety of other cinnamon preparations.",
    keywords: ["tolerability", "phase i", "ceylon", "cinnamomum zeylanicum"],
  },
  {
    id: "ncdc-cholera-2024", taxa: [], type: "guidance",
    design: "Archived advisory · 12 June 2024", title: "NCDC cholera advisory",
    url: sources.ncdc, sourceId: "NCDC:513", location: "Advice to the public",
    part: "unknown", preparation: "unknown",
    finding: "The archived NCDC advisory emphasizes safe water, handwashing with soap and prompt care for sudden watery diarrhoea.",
    limitation: "This advisory is dated 12 June 2024. Consult NCDC for current outbreak information.",
    keywords: ["cholera", "ncdc", "outbreak", "water", "diarrhoea", "diarrhea"], href: "/awareness#outbreak",
  },
  {
    id: "who-artemisia", taxa: [], type: "guidance",
    design: "WHO position · 10 October 2019", title: "WHO position on Artemisia and malaria",
    url: sources.who, sourceId: "WHO:Artemisia-2019", location: "WHO position",
    part: "unknown", preparation: "Non-pharmaceutical plant material",
    finding: "WHO advises against using Artemisia plant material to prevent or treat malaria.",
    limitation: "The position concerns non-pharmaceutical plant material. Approved artemisinin-based medicines are distinct.",
    keywords: ["malaria", "artemisia", "artemisia annua", "who"], href: "/awareness#seasonal",
  },
];

export const researchCollection = entries.map((entry) => ({
  ...entry,
  sourceVerification: "checked against linked source" as const,
  expertReview: "pending" as const,
  reuse: "Original Ìtàn summary and link. Source text and figures are excluded." as const,
}));

export type ResearchRecord = (typeof researchCollection)[number];

import { identifyIngredient, type Match, type Taxon } from "./matching.ts";

export type ComparedIngredient = { original: string; match: Match };
export type ComparedProduct = { name: string; ingredients: ComparedIngredient[] };

export function compareProducts(products: { name: string; ingredients: string[] }[], taxa: Taxon[]) {
  const analyzed: ComparedProduct[] = products.map((product) => ({
    name: product.name,
    ingredients: product.ingredients.filter((name) => name.trim()).map((original) => ({
      original,
      match: identifyIngredient(original, taxa),
    })),
  }));
  const occurrences = new Map<string, Set<number>>();
  const possible = new Set<string>();
  analyzed.forEach((product, index) => product.ingredients.forEach(({ match }) => {
    if (match.kind === "exact") {
      const id = match.candidates[0].id;
      const indexes = occurrences.get(id) ?? new Set<number>();
      indexes.add(index);
      occurrences.set(id, indexes);
    }
  }));
  analyzed.forEach((product, index) => product.ingredients.forEach(({ match }) => {
    if (match.kind !== "ambiguous" && match.kind !== "alias") return;
    for (const candidate of match.candidates) {
      if ([...(occurrences.get(candidate.id) ?? [])].some((other) => other !== index)) possible.add(candidate.id);
      if (analyzed.some((other, otherIndex) => otherIndex !== index && other.ingredients.some((entry) => (entry.match.kind === "ambiguous" || entry.match.kind === "alias") && entry.match.candidates.some((taxon) => taxon.id === candidate.id)))) possible.add(candidate.id);
    }
  }));
  const shared = taxa.filter((taxon) => (occurrences.get(taxon.id)?.size ?? 0) > 1);
  return { products: analyzed, shared, possible: taxa.filter((taxon) => possible.has(taxon.id)) };
}

export type InteractionRecord = {
  taxonId: string;
  type: "herb-drug" | "herb-herb";
  medicine?: string;
  otherTaxonId?: string;
  title: string;
  source: string;
  summary: string;
  limitation: string;
};

export function findInteractionEvidence(products: ComparedProduct[], medicine: string, records: InteractionRecord[]) {
  const matchedIds = new Set(products.flatMap((product) => product.ingredients.flatMap(({ match }) =>
    match.kind === "exact" || match.kind === "alias" ? [match.candidates[0].id] : [],
  )));
  return records.filter((record) => {
    if (!matchedIds.has(record.taxonId)) return false;
    if (record.type === "herb-herb") {
      const otherTaxonId = record.otherTaxonId;
      if (!otherTaxonId) return false;
      return matchedIds.has(otherTaxonId);
    }
    return !medicine || record.medicine === medicine;
  });
}

export const interactionRecords: InteractionRecord[] = [{
  taxonId: "bitter-leaf", medicine: "metformin", type: "herb-drug",
  title: "Bitter leaf and metformin · animal research",
  source: "https://pubmed.ncbi.nlm.nih.gov/39710889/",
  summary: "In diabetic rats, an aqueous bitter-leaf extract altered metformin exposure. This was an animal pharmacokinetic study, not a clinical contraindication study.",
  limitation: "Human applicability and the effects of other preparations remain uncertain. Missing interaction records cannot establish safety.",
}, {
  taxonId: "hibiscus",
  medicine: "simvastatin",
  type: "herb-drug",
  title: "Roselle and simvastatin",
  source: "https://pubmed.ncbi.nlm.nih.gov/28925046/",
  summary: "In a small crossover study of six healthy volunteers, an aqueous roselle calyx beverage reduced exposure to a single dose of simvastatin. The study also included separate animal experiments.",
  limitation: "The beverage, dose, and conditions studied may differ from these products. The clinical significance for an individual or other preparations is uncertain.",
}];

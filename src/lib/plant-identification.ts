import { identifyIngredient, type Taxon } from "./matching.ts";

type ProviderResult = { score?: number; species?: { scientificNameWithoutAuthor?: string; scientificName?: string; commonNames?: string[] } };
export function mapPlantCandidates(input: unknown, taxa: Taxon[]) {
  if (!input || typeof input !== "object" || !Array.isArray((input as { results?: unknown }).results)) throw new Error("Invalid provider response");
  return ((input as { results: ProviderResult[] }).results).slice(0, 5).flatMap((entry) => {
    const name = entry.species?.scientificNameWithoutAuthor;
    if (typeof name !== "string" || typeof entry.score !== "number" || !Number.isFinite(entry.score) || entry.score < 0 || entry.score > 1) return [];
    const match = identifyIngredient(name, taxa);
    return [{ name, common: entry.species?.commonNames?.[0] ?? "", score: entry.score, match: { kind: match.kind, candidates: match.candidates.map(({ id, name }) => ({ id, name })) } }];
  });
}

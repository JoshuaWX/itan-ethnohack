import { identifyIngredient, type Taxon } from "./matching.ts";

type ProviderResult = { score?: number; species?: { scientificNameWithoutAuthor?: string; scientificName?: string; commonNames?: string[] } };
export function mapPlantCandidates(input: unknown, taxa: Taxon[]) {
  if (!input || typeof input !== "object" || !Array.isArray((input as { results?: unknown }).results)) throw new Error("Invalid provider response");
  return ((input as { results: ProviderResult[] }).results).slice(0, 100).flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const name = entry.species?.scientificNameWithoutAuthor;
    if (typeof name !== "string" || !name.trim() || name.length > 200 || typeof entry.score !== "number" || !Number.isFinite(entry.score) || entry.score < 0 || entry.score > 1) return [];
    const match = identifyIngredient(name, taxa);
    const common = Array.isArray(entry.species?.commonNames) ? entry.species.commonNames.find((value) => typeof value === "string" && value.length <= 200) ?? "" : "";
    return [{ name, common, score: entry.score, match: { kind: match.kind, candidates: match.candidates.map(({ id, name }) => ({ id, name })) } }];
  }).sort((a, b) => b.score - a.score).slice(0, 5);
}

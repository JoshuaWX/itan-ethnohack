import type { Match } from "./matching.ts";
import type { analyzeClaim, Relation } from "./claim-analysis.ts";

export function claimQuestionState(result: ReturnType<typeof analyzeClaim>) {
  if (result.entities.ambiguous || result.entities.taxa.length !== 1) return "plant-name";
  if (!result.outcome) return "unsupported-effect";
  return result.needsClarification ? "one-effect" : "ready";
}

// Only exact, harmless app-help questions bypass the personal-health filter.
export function isGettingStartedQuestion(question: string) {
  const text = question.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().trim().replace(/[?.!]+$/, "").trim();
  return /^(?:how (?:do|can) i use (?:itan|this app)|what (?:is itan|does itan do)|help me (?:get started|use itan))$/.test(text);
}

export function ingredientLanguage(match: Match) {
  switch (match.kind) {
    case "exact": return { label: "Scientific name matches", explanation: "This scientific name matches a plant in our library. A name match does not confirm what is inside the product." };
    case "alias": return { label: "A possible plant name", explanation: `This name is linked to ${match.candidates[0]?.common ?? "a plant"} in our library. The name on a label does not confirm the actual plant used.` };
    case "ambiguous": return { label: "This name can mean different plants", explanation: "We need a more specific name to tell these plants apart. Check the full name on the label or open the possible plant pages." };
    case "unresolved": return { label: "We couldn’t identify this ingredient", explanation: "Check the spelling or the label photo. The plant may also be missing from our small library." };
  }
}

export function studyRelationLanguage(relation: Relation, unchanged = false) {
  if (unchanged && (relation === "supports" || relation === "contradicts")) return "No clear change was found in this study";
  return {
    supports: "This study found the effect described",
    contradicts: "This study reported a different result",
    "partially-addresses": "Related research, with important limits",
    "does-not-answer": "This source does not answer the question",
  }[relation];
}

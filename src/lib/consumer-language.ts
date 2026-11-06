import type { Match } from "./matching.ts";
import type { analyzeClaim, Relation, VerdictLevel } from "./claim-analysis.ts";

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
  if (unchanged && relation !== "does-not-answer") return "No clear change was found in this study";
  return {
    supports: "This study found the effect described",
    contradicts: "This study reported a different result",
    "partially-addresses": "Related research, with important limits",
    "does-not-answer": "This source does not answer the question",
  }[relation];
}

const animalNote = (result: ReturnType<typeof analyzeClaim>) => {
  if (result.verdict.level === "animal-or-lab-only") return "";
  if (result.verdict.animalAgreement === "same") return " Animal or laboratory work points the same way, but that is not evidence in people.";
  if (result.verdict.animalAgreement === "opposite") return " Animal or laboratory work points a different way.";
  if (result.verdict.animalAgreement === "no-change") return " Animal or laboratory work did not show a clear change.";
  return "";
};

const copy: Record<Exclude<VerdictLevel, "blocked">, { found: string; meaning: string }> = {
  "needs-clarification": {
    found: "We need a clearer plant name or one effect at a time.",
    meaning: "Some names refer to different plants. Some questions name more than one effect. Check the name or try a single question.",
  },
  "no-evidence": {
    found: "Ìtàn doesn’t have enough research to answer this.",
    meaning: "Other research may exist. This result does not establish that a plant works, does not work, or is safe.",
  },
  "official-guidance": {
    found: "Official health guidance applies here. This collection cannot treat the plant as a cure.",
    meaning: "Follow the linked public-health advice. Reported traditional use is not the same as a tested treatment.",
  },
  "some-support-in-people": {
    found: "There is some research in people that found the change asked about.",
    meaning: "This is from a small number of studies. It applies only to the people, plant part and preparation that were tested, not to a product you have.",
  },
  "mixed-in-people": {
    found: "Studies in people do not all agree.",
    meaning: "Different tests, preparations or group sizes can produce different results. Read each study’s limits before drawing a conclusion.",
  },
  "not-shown-in-people": {
    found: "In people, the available study did not show a clear change.",
    meaning: "That is not proof the plant has no effect. It also does not establish a benefit in people.",
  },
  "opposite-in-people": {
    found: "The study in people reported a change in the other direction.",
    meaning: "This is limited to the group and preparation studied. It is not a safety or treatment decision.",
  },
  "different-conditions": {
    found: "A related study exists, but it tested different conditions from the question.",
    meaning: "The plant part, preparation, or the people studied do not match what was asked. Do not treat the result as an answer to the original claim.",
  },
  overstated: {
    found: "A study in people found a related change, but it cannot support this stronger claim.",
    meaning: "Words such as always, cure, or proven go beyond what the study measured.",
  },
  "animal-or-lab-only": {
    found: "The matching findings are from animals or laboratory tests, not from people.",
    meaning: "Those results cannot establish the same effect, dose or safety in humans.",
  },
  "traditional-only": {
    found: "This is documented traditional use, not a test of the claimed effect.",
    meaning: "A survey or monograph records what people report using. It does not measure whether the plant works.",
  },
  "direction-unclear": {
    found: "Related research is in the library, but the question does not say what change to look for.",
    meaning: "Say whether the plant is claimed to increase, decrease or leave the effect unchanged.",
  },
};

export function verdictLanguage(result: ReturnType<typeof analyzeClaim>) {
  if (result.verdict.level === "blocked") {
    return {
      found: "This question needs a different kind of help.",
      meaning: "Ìtàn explains research. It cannot diagnose a condition, suggest a dose or choose treatment for you.",
    };
  }
  const text = copy[result.verdict.level];
  const suggestions = result.verdict.suggestions?.map(({ common }) => common) ?? [];
  return {
    found: suggestions.length ? `Did you mean ${suggestions.join(" or ")}?` : text.found,
    meaning: text.meaning + animalNote(result),
  };
}

export function verdictHeadline(level: VerdictLevel) {
  return {
    blocked: "This needs a healthcare professional",
    "needs-clarification": "The question needs to be clearer",
    "no-evidence": "Not enough research in this library",
    "official-guidance": "Official health guidance",
    "some-support-in-people": "Some support in people, with limits",
    "mixed-in-people": "Mixed findings in people",
    "not-shown-in-people": "No clear change in people",
    "opposite-in-people": "People were studied, with a different result",
    "different-conditions": "A related study, different conditions",
    overstated: "The claim goes beyond the study",
    "animal-or-lab-only": "Only animal or laboratory findings",
    "traditional-only": "Traditional use, not a test of effect",
    "direction-unclear": "Say what change to look for",
  }[level];
}

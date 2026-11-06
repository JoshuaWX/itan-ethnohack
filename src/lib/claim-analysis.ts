import { botanicalEntities, questionBlocked, suggestPlantNames } from "./research-retrieval.ts";
import { researchCollection, evidenceVersion, type ResearchRecord } from "./research-collection.ts";

type Direction = "decrease" | "increase" | "unchanged";
// `weak` aliases (a bare drug name) count only when no other outcome is named.
// `benefit` is the direction implied by "helps with", "good for" or "treats".
type Outcome = { id: string; label: string; aliases: readonly string[]; weak?: readonly string[]; benefit?: Direction };
export const outcomes = [
  { id: "glucose", label: "Blood glucose", aliases: ["blood sugar", "blood glucose", "glucose", "sugar level", "sugar levels", "sugar", "glycaemic", "glycemic", "diabetes", "diabetic", "antidiabetic", "anti diabetic", "hba1c", "glucose tolerance"], benefit: "decrease" },
  { id: "pressure", label: "Blood pressure", aliases: ["blood pressure", "bp", "hypertension", "hypertensive", "antihypertensive", "systolic"], benefit: "decrease" },
  { id: "emptying", label: "Stomach emptying", aliases: ["gastric emptying", "stomach emptying", "stomach empty", "gastric motility", "motility"] },
  { id: "digestion", label: "Digestive complaints", aliases: ["digestion", "digestive", "indigestion", "dyspepsia", "stomach upset"], benefit: "decrease" },
  { id: "platelets", label: "Platelet count", aliases: ["platelet", "platelets", "thrombocytopenia"], benefit: "increase" },
  { id: "exposure", label: "Drug exposure", aliases: ["metformin exposure", "metformin levels", "simvastatin exposure", "simvastatin levels", "pharmacokinetics", "drug exposure", "drug levels", "interact", "interacts", "interaction", "interactions"], weak: ["metformin", "simvastatin"] },
  { id: "coumarin", label: "Coumarin content", aliases: ["coumarin"] },
  { id: "cholera", label: "Cholera treatment", aliases: ["cholera"] },
  { id: "malaria", label: "Malaria treatment", aliases: ["malaria"] },
  { id: "diarrhoea", label: "Diarrhoea", aliases: ["diarrhoea", "diarrhea"], benefit: "decrease" },
] as const satisfies readonly Outcome[];
export type OutcomeId = (typeof outcomes)[number]["id"];
type StudyOutcome = { outcome: OutcomeId; direction: Direction; scope: string };

// Each annotation describes an outcome in its cited record, not a whole-plant grade.
export const studyOutcomes: Record<string, StudyOutcome[]> = {
  "bitter-leaf-human-glucose": [{ outcome: "glucose", direction: "unchanged", scope: "Individual bitter-leaf decoction in the 27-subject glucose challenge; the blend result is separate" }],
  "bitter-leaf-rat-glucose": [{ outcome: "glucose", direction: "decrease", scope: "Processed leaf preparations in induced diabetic rats" }],
  "neem-human-glucose": [{ outcome: "glucose", direction: "decrease", scope: "Standardized leaf-and-twig capsules alongside metformin in adults with diabetes" }],
  "papaya-human-platelets": [{ outcome: "platelets", direction: "increase", scope: "Specified leaf extract in the adult dengue pilot trial" }],
  "roselle-blood-pressure": [{ outcome: "pressure", direction: "decrease", scope: "Brewed tea in the six-week adult trial" }],
  "ginger-emptying-wu": [{ outcome: "emptying", direction: "increase", scope: "Capsules and a test meal in 24 healthy volunteers" }],
  "ginger-emptying-phillips": [{ outcome: "emptying", direction: "unchanged", scope: "Powdered rhizome and a paracetamol absorption test in 16 volunteers" }],
  "roselle-simvastatin": [{ outcome: "exposure", direction: "decrease", scope: "Aqueous calyx beverage and simvastatin in six volunteers" }],
  "bitter-leaf-metformin": [{ outcome: "exposure", direction: "increase", scope: "Aqueous leaf extract and metformin in diabetic rats" }],
  "guava-lab": [{ outcome: "diarrhoea", direction: "decrease", scope: "Laboratory assays of diarrhoeal pathogens and toxins, not a clinical trial" }],
};
export type Relation = "supports" | "contradicts" | "partially-addresses" | "does-not-answer";
export type Agreement = "same" | "opposite" | "no-change";
export type VerdictLevel = "blocked" | "needs-clarification" | "no-evidence" | "official-guidance" | "some-support-in-people"
  | "mixed-in-people" | "not-shown-in-people" | "opposite-in-people" | "different-conditions" | "overstated"
  | "animal-or-lab-only" | "traditional-only" | "direction-unclear";
export type Verdict = {
  level: VerdictLevel;
  counts?: { people: number; animalOrLab: number; traditional: number; guidance: number };
  scopes?: string[];
  suggestions?: { id: string; common: string }[];
  animalAgreement?: Agreement;
};

const hasAlias = (text: string, alias: string) => new RegExp(`\\b${alias}\\b`, "i").test(text);
const benefitWords = /\b(?:helps?|helping|helpful|good for|treats?|treating|treatment for|cures?|curing|controls?|manages?|managing|effective (?:for|against)|works? (?:for|against)|fights?|remedy for|anti ?(?:diabetic|hypertensive))\b/;

function directionOf(text: string): Direction | undefined {
  // "Does not lower" can mean unchanged or increased; do not infer either.
  if (/\b(?:does not|doesn't|do not|don't|not|no dey|no fit|cannot|can't)\s+(?:lower|reduce|decrease|increase|raise|boost|slow|speed|help|treat|cure|control)/.test(text)) return;
  if (/\b(?:does not change|doesn't change|no effect|unchanged|neither)\b/.test(text)) return "unchanged";
  if (/\b(?:lowers?|lowering|reduces?|reducing|reduction|decreases?|decreasing|slows?|slowing|drops?|brings? down|cuts?|stops?|stopping|prevents?|preventing)\b/.test(text)) return "decrease";
  if (/\b(?:increases?|increasing|raises?|raising|boosts?|boosting|speeds?|faster|accelerates?)\b/.test(text)) return "increase";
}

function findOutcomes(text: string): Outcome[] {
  const strong = outcomes.filter(({ aliases }) => aliases.some((alias) => hasAlias(text, alias)));
  if (strong.length) return strong;
  return outcomes.filter((outcome: Outcome) => outcome.weak?.some((alias) => hasAlias(text, alias)));
}

export function analyzeClaim(input: string) {
  const text = input.normalize("NFKC").toLowerCase().replace(/[-‐–]/g, " ").replace(/\s+/g, " ").trim();
  const entities = botanicalEntities(text);
  const identified = findOutcomes(text);
  const outcome = identified[0] as (typeof outcomes)[number] | undefined;
  const stated = directionOf(text);
  const benefit = (outcome as Outcome | undefined)?.benefit;
  const directionInferred = !stated && Boolean(benefit) && benefitWords.test(text);
  const direction = stated ?? (directionInferred ? benefit : undefined);
  const blocked = questionBlocked(input);
  const invalid = !input.trim() || input.length > 320 || blocked;
  const needsClarification = entities.ambiguous || entities.taxa.length !== 1 || identified.length !== 1;
  const infectious = outcome?.id === "cholera" || outcome?.id === "malaria";
  const ids = new Set(entities.taxa.map(({ id }) => id));
  const aboutAnimals = /\b(?:rats?|mice|animals?)\b/.test(text);
  const overclaim = /\b(?:cures?|curing|always|everyone|guarantee\w*|proves?|proven|safe|completely|permanently)\b/.test(text);
  const records = invalid || needsClarification || !outcome ? [] : researchCollection.filter((record) => {
    if (infectious) return record.type === "guidance" && record.keywords.includes(outcome.id)
      || record.type === "ethnobotanical" && record.taxa.some((id) => ids.has(id)) && record.keywords.includes(outcome.id);
    if (!record.taxa.some((id) => ids.has(id))) return false;
    return studyOutcomes[record.id]?.some((row) => row.outcome === outcome.id)
      || outcome.aliases.some((alias) => record.keywords.includes(alias));
  }).sort((a, b) => Number(Boolean(studyOutcomes[b.id]?.some((row) => row.outcome === outcome.id))) - Number(Boolean(studyOutcomes[a.id]?.some((row) => row.outcome === outcome.id)))).map((record) => {
    const annotation = studyOutcomes[record.id]?.find((row) => row.outcome === outcome.id);
    const agreement: Agreement | undefined = annotation && direction
      ? annotation.direction === "unchanged" ? "no-change" : annotation.direction === direction ? "same" : "opposite" : undefined;
    let applicable = true;
    let relation: Relation = "does-not-answer";
    let explanation = "No matching experimental outcome was annotated for this claim.";
    if (record.type === "guidance") {
      explanation = "Use this official guidance. The collection cannot establish the plant as a treatment for this disease.";
    } else if (record.type === "ethnobotanical" || record.type === "traditional") {
      relation = "partially-addresses";
      explanation = "Documents reported traditional use. It does not test the effect claimed.";
    } else if (annotation && direction) {
      const speciesMismatch = /\b(?:humans?|people|patients)\b/.test(text) && record.type === "animal"
        || aboutAnimals && record.type === "human";
      const mentionedParts = text.match(/\b(?:leaf|leaves|roots?|seeds?|fruit|bark|twigs?|rhizomes?|calyx|calyces|oil)\b/g) ?? [];
      const partMismatch = mentionedParts.some((part) => {
        const stem = /^(leaf|leaves)$/.test(part) ? "leav" : /^(calyx|calyces)$/.test(part) ? "calyc" : part.replace(/s$/, "");
        return !record.part.toLowerCase().includes(stem);
      });
      const preparationMismatch = /\b(?:homemade|tea|decoction|juice|raw)\b/.test(text) && /standardized|capsules|specified.*extract/i.test(record.preparation)
        || /\balone\b/.test(text) && /alongside|added to|already taking/i.test(record.population ?? record.title);
      const populationMismatch = /\b(?:children|child|infants?|babies|pregnant|pregnancy|breastfeeding)\b/.test(text)
        && !/children|infant|pregnan|breastfeed/i.test(record.population ?? "");
      applicable = !(speciesMismatch || partMismatch || preparationMismatch || populationMismatch);
      if (!applicable) explanation = "The claimed population, plant part, preparation or use without other medicines differs from this study.";
      else if (overclaim || record.type === "animal" && !aboutAnimals) {
        relation = "partially-addresses";
        explanation = record.type === "animal" && !aboutAnimals
          ? `The animal result ${agreement === "same" ? "points the same way as" : agreement === "opposite" ? "points the opposite way to" : "does not show the change in"} your claim, but animal findings do not show the same effect in people.`
          : "The measured outcome is relevant, but the study cannot establish this broader claim.";
      } else {
        relation = annotation.direction === "unchanged" ? "partially-addresses" : annotation.direction === direction ? "supports" : "contradicts";
        explanation = annotation.direction === "unchanged"
          ? "No significant change was detected under these study conditions. This does not prove an effect is impossible."
          : "The direction of the measured finding is compared with the direction in your claim. Applicability remains limited to this study.";
      }
    } else if (annotation) {
      relation = "partially-addresses";
      explanation = "The outcome is relevant, but the claim's direction is unclear. Specify whether it increases, decreases or remains unchanged.";
    } else {
      explanation = "This source did not measure this effect.";
    }
    return { record, annotation, relation, explanation, agreement, applicable };
  });

  const plantOnly = entities.taxa.length === 1 && !entities.ambiguous && !identified.length;
  const verdict: Verdict = invalid ? { level: "blocked" }
    : needsClarification && !plantOnly ? { level: "needs-clarification", suggestions: entities.taxa.length ? [] : suggestPlantNames(text) }
    : synthesize(records, { infectious, aboutAnimals, overclaim, direction });
  return { version: evidenceVersion, entities, outcome, direction, directionInferred, blocked: invalid, needsClarification, records, verdict };
}

type Assessed = { record: ResearchRecord; annotation?: StudyOutcome; agreement?: Agreement; applicable: boolean };

// Ranks evidence by design: studies in people first, then animal or laboratory work, then reported use.
// Small, single studies are never upgraded beyond "some support".
function synthesize(records: Assessed[], claim: { infectious: boolean; aboutAnimals: boolean; overclaim: boolean; direction?: Direction }): Verdict {
  const people = records.filter(({ record, annotation }) => (record.type === "human" || record.type === "review") && annotation);
  const preclinical = records.filter(({ record, annotation }) => (record.type === "animal" || record.type === "laboratory") && annotation);
  const traditional = records.filter(({ record }) => record.type === "ethnobotanical" || record.type === "traditional");
  const counts = { people: people.length, animalOrLab: preclinical.length, traditional: traditional.length, guidance: records.filter(({ record }) => record.type === "guidance").length };
  const animalAgreement = preclinical.find(({ agreement }) => agreement)?.agreement;
  const base = { counts, animalAgreement };
  if (claim.infectious) return { level: counts.guidance ? "official-guidance" : "no-evidence", ...base };
  if (!records.length) return { level: "no-evidence", ...base };
  if (people.length && !claim.aboutAnimals) {
    const allScopes = people.map(({ annotation }) => annotation!.scope);
    if (!claim.direction) return { level: "direction-unclear", ...base, scopes: allScopes };
    const applicable = people.filter(({ applicable }) => applicable);
    if (!applicable.length) return { level: "different-conditions", ...base, scopes: allScopes };
    const scopes = applicable.map(({ annotation }) => annotation!.scope);
    const same = applicable.filter(({ agreement }) => agreement === "same").length;
    const opposite = applicable.filter(({ agreement }) => agreement === "opposite").length;
    if (same === applicable.length) return { level: claim.overclaim ? "overstated" : "some-support-in-people", ...base, scopes };
    if (same) return { level: "mixed-in-people", ...base, scopes };
    if (opposite) return { level: "opposite-in-people", ...base, scopes };
    return { level: "not-shown-in-people", ...base, scopes };
  }
  if (preclinical.length) {
    const scopes = preclinical.map(({ annotation }) => annotation!.scope);
    return { level: claim.direction ? "animal-or-lab-only" : "direction-unclear", ...base, scopes };
  }
  if (traditional.length) return { level: "traditional-only", ...base };
  return { level: "no-evidence", ...base };
}

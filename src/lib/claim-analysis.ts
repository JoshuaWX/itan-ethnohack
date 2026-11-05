import { botanicalEntities, questionBlocked } from "./research-retrieval.ts";
import { researchCollection, evidenceVersion } from "./research-collection.ts";

export const outcomes = [
  { id: "glucose", label: "Blood glucose", aliases: ["blood sugar", "blood glucose", "glucose", "glycaemic", "glycemic", "diabetes", "hba1c", "glucose tolerance"] },
  { id: "pressure", label: "Blood pressure", aliases: ["blood pressure", "hypertension", "systolic"] },
  { id: "emptying", label: "Stomach emptying", aliases: ["gastric emptying", "stomach emptying", "motility"] },
  { id: "platelets", label: "Platelet count", aliases: ["platelet", "platelets", "thrombocytopenia"] },
  { id: "exposure", label: "Drug exposure", aliases: ["simvastatin", "metformin exposure", "pharmacokinetics", "drug exposure"] },
  { id: "coumarin", label: "Coumarin content", aliases: ["coumarin"] },
  { id: "cholera", label: "Cholera treatment", aliases: ["cholera"] },
  { id: "malaria", label: "Malaria treatment", aliases: ["malaria"] },
] as const;
export type OutcomeId = (typeof outcomes)[number]["id"];
type Direction = "decrease" | "increase" | "unchanged";
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
};
export type Relation = "supports" | "contradicts" | "partially-addresses" | "does-not-answer";

function directionOf(text: string): Direction | undefined {
  // "Does not lower" can mean unchanged or increased; do not infer either.
  if (/\b(?:does not|doesn't|not)\s+(?:lower|reduce|decrease|increase|raise|boost|slow|speed)/.test(text)) return;
  if (/\b(?:does not|doesn't|no effect|unchanged|neither)\b/.test(text)) return "unchanged";
  if (/\b(?:lowers?|lowering|reduces?|reduction|decreases?|decreasing|slows?)\b/.test(text)) return "decrease";
  if (/\b(?:increases?|raises?|boosts?|speeds?|faster|accelerates?)\b/.test(text)) return "increase";
}

export function analyzeClaim(input: string) {
  const text = input.normalize("NFKC").toLowerCase().trim();
  const entities = botanicalEntities(text);
  const identified = outcomes.filter(({ aliases }) => aliases.some((alias) => new RegExp(`\\b${alias}\\b`, "i").test(text)));
  const outcome = identified[0];
  const direction = directionOf(text);
  const blocked = questionBlocked(input);
  const invalid = !input.trim() || input.length > 320 || blocked;
  const needsClarification = entities.ambiguous || entities.taxa.length !== 1 || identified.length !== 1;
  const infectious = outcome?.id === "cholera" || outcome?.id === "malaria";
  const ids = new Set(entities.taxa.map(({ id }) => id));
  const records = invalid || needsClarification || !outcome ? [] : researchCollection.filter((record) => {
    if (infectious) return record.type === "guidance" && record.keywords.includes(outcome.id);
    if (!record.taxa.some((id) => ids.has(id))) return false;
    return studyOutcomes[record.id]?.some((row) => row.outcome === outcome.id)
      || outcome.aliases.some((alias) => record.keywords.includes(alias));
  }).sort((a, b) => Number(Boolean(studyOutcomes[b.id]?.some((row) => row.outcome === outcome.id))) - Number(Boolean(studyOutcomes[a.id]?.some((row) => row.outcome === outcome.id)))).map((record) => {
    const annotation = studyOutcomes[record.id]?.find((row) => row.outcome === outcome.id);
    let relation: Relation = "does-not-answer";
    let explanation = "No matching experimental outcome was annotated for this claim.";
    if (record.type === "guidance") {
      explanation = "Use this official guidance. The collection cannot establish the plant as a treatment for this disease.";
    } else if (record.type === "ethnobotanical") {
      relation = "partially-addresses";
      explanation = "Documents reported traditional use. It does not test the effect claimed.";
    } else if (annotation && direction) {
      const speciesMismatch = /\b(?:humans?|people|patients)\b/.test(text) && record.type === "animal"
        || /\b(?:rats|mice|animals?)\b/.test(text) && record.type === "human";
      const mentionedParts = text.match(/\b(?:leaf|leaves|roots?|seeds?|fruit|bark|twigs?|rhizomes?|calyx|calyces|oil)\b/g) ?? [];
      const partMismatch = mentionedParts.some((part) => {
        const stem = /^(leaf|leaves)$/.test(part) ? "leav" : /^(calyx|calyces)$/.test(part) ? "calyc" : part.replace(/s$/, "");
        return !record.part.toLowerCase().includes(stem);
      });
      const preparationMismatch = /\b(?:homemade|tea|decoction|juice|raw)\b/.test(text) && /standardized|capsules|specified.*extract/i.test(record.preparation)
        || /\balone\b/.test(text) && /alongside|added to|already taking/i.test(record.population ?? record.title);
      const populationMismatch = /\b(?:children|child|infants?|babies|pregnant|pregnancy|breastfeeding)\b/.test(text)
        && !/children|infant|pregnan|breastfeed/i.test(record.population ?? "");
      const overclaim = /\b(?:cures?|always|everyone|guarantee|proves?|safe)\b/.test(text);
      if (speciesMismatch || partMismatch || preparationMismatch || populationMismatch) explanation = "The claimed population, plant part, preparation or use without other medicines differs from this study.";
      else if (overclaim || record.type === "animal" && !/\b(?:rats|mice|animals?)\b/.test(text)) {
        relation = "partially-addresses";
        explanation = "The measured outcome is relevant, but the study cannot establish this broader claim.";
      } else {
        relation = annotation.direction === "unchanged" ? "partially-addresses" : annotation.direction === direction ? "supports" : "contradicts";
        explanation = annotation.direction === "unchanged"
          ? "No significant change was detected under these study conditions. This does not prove an effect is impossible."
          : "The direction of the measured finding is compared with the direction in your claim. Applicability remains limited to this study.";
      }
    } else if (annotation) {
      relation = "partially-addresses";
      explanation = "The outcome is relevant, but the claim's direction is unclear. Specify whether it increases, decreases or remains unchanged.";
    }
    return { record, annotation, relation, explanation };
  });

  return { version: evidenceVersion, entities, outcome, direction, blocked: invalid, needsClarification, records };
}

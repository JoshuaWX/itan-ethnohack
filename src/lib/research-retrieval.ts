import { taxa } from "./catalog.ts";
import { normalizeName } from "./matching.ts";
import { researchCollection, type ResearchRecord } from "./research-collection.ts";

export const maxQuestionLength = 320;
export const maxContextIds = 12;
export const maxSources = 6;
export const taxonIds = new Set(taxa.map(({ id }) => id));
export const recordIds = new Set(researchCollection.map(({ id }) => id));

const clean = (text: string) => normalizeName(text).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const contains = (text: string, phrase: string) => ` ${text} `.includes(` ${clean(phrase)} `);
const names = taxa.flatMap((taxon) => [taxon.name, taxon.common, ...taxon.aliases].map((name) => ({ name: clean(name), id: taxon.id })));
names.push({ name: "cinnamomum zeylanicum", id: "cinnamon-verum" }, { name: "cinnamomum burmannii", id: "cinnamon-cassia" });
names.sort((a, b) => b.name.length - a.name.length);

export function questionBlocked(question: string): boolean {
  return /\b(?:diagnos\w*|prescri\w*|dosage|how much|how many (?:tablets|capsules|grams)|safe (?:for|to) (?:me|take|use)|should (?:i|we|my) (?:take|use|stop|combine|mix)|can (?:i|we|my) (?:take|use|stop|combine|mix)|i (?:have|take|use|am|m|feel|weigh|was diagnosed)|my (?:medic\w*|symptoms|child|pregnancy|doctor|condition|blood pressure)|(?:stop|replace|quit) (?:my |the )?(?:prescribed|medication|medicine|treatment)|ignore (?:all |any |the |previous |prior |above )*(?:instructions|rules)|system prompt)\b/i.test(clean(question))
    || /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\d ()-]{8,}\d)/i.test(question);
}

type Scope = { taxonIds?: string[]; priorIds?: string[] };

const broadWords = new Set("a an the of on in with for what whats which who where when why how is are was were has have had been does do did it its they this that these those there them and or about me tell show explain find know any available exist exists give evidence study studies research researched scientific paper papers recorded record documented source sources human humans people participants clinical trial trials traditional use used uses lab laboratory animal type kinds kind results findings found outcome outcomes limitation limitations mean means investigated studied compared compare comparison difference differences between both more also based actually say said look overview summary published pmid pmcid conducted only first second ingredients plant plants".split(" "));

function mentions(text: string) {
  const hits = names.filter(({ name }) => contains(text, name));
  return [...new Set(hits.filter((hit) => !hits.some((other) => other.name !== hit.name && contains(other.name, hit.name))).map(({ id }) => id))];
}

export function botanicalEntities(question: string) {
  const text = clean(question);
  const ids = mentions(text);
  const ambiguous = ids.length > 1 && !ids.every((id) => names.some((name) => name.id === id && contains(text, name.name) && names.filter((n) => n.name === name.name).length === 1));
  return { taxa: taxa.filter(({ id }) => ids.includes(id)), ambiguous };
}

export function retrieveEvidence(question: string, scope: Scope = {}) {
  const text = clean(question);
  const explicit = mentions(text);
  const sourceMatch = researchCollection.filter((record) => contains(text, record.sourceId) || (record.sourceId.startsWith("PMID:") && contains(text, record.sourceId.slice(5))));
  const publicTopic = /\b(?:cholera|malaria|artemisia)\b/.test(text);
  const stripped = names.reduce((value, { name }) => ` ${value} `.replaceAll(` ${name} `, " ").trim(), text);
  const terms = stripped.split(" ").filter((word) => word && !broadWords.has(word));
  const prior = researchCollection.filter(({ id }) => scope.priorIds?.includes(id));
  const followUp = !explicit.length && !publicTopic && /\b(?:it|its|they|them|their|that|this|those|these|what about|which|how many|limitations)\b/.test(text);
  const focus = explicit.length ? explicit : followUp && prior.length ? [...new Set(prior.flatMap(({ taxa }) => taxa))] : scope.taxonIds ?? [];
  const evidenceType = /\b(?:traditional|ethnobotanical|survey)\b/.test(text) ? "traditional" : /\b(?:human|humans|clinical|participants)\b/.test(text) ? "human" : /\b(?:animal|rats|mice)\b/.test(text) ? "animal" : /\b(?:lab|laboratory|in vitro)\b/.test(text) ? "laboratory" : undefined;
  const ambiguous = explicit.length > 1 && !explicit.every((id) => names.some((name) => name.id === id && contains(text, name.name) && names.filter((n) => n.name === name.name).length === 1));

  const ranked = researchCollection.flatMap((record) => {
    if (!focus.length && !sourceMatch.length && !publicTopic && !/\b(?:simvastatin|metformin)\b/.test(text)) return [];
    // Infectious disease queries show official guidance only. Guava's lab study
    // stays available from its plant page, without an outbreak association.
    if (publicTopic && record.type !== "guidance") return [];
    if (record.id === "guava-lab" && !focus.includes("guava") && !sourceMatch.includes(record)) return [];
    const matchedSource = sourceMatch.includes(record);
    if (sourceMatch.length) return matchedSource ? [{ record, score: 100 }] : [];
    const scoped = record.taxa.some((id) => focus.includes(id));
    const topicMatches = record.keywords.filter((keyword) => contains(text, keyword));
    const hasSpecificTopic = topicMatches.some((keyword) => clean(keyword).split(" ").some((word) => !broadWords.has(word)));
    const priorMatch = followUp && prior.includes(record);
    const relevant = publicTopic && record.type === "guidance" && topicMatches.length
      || (!explicit.length || scoped) && hasSpecificTopic && (!focus.length || scoped || publicTopic)
      || (scoped || priorMatch) && (terms.length === 0 || priorMatch && /^(?:how many|what (?:about (?:its|the) limitations|(?:was|were) (?:the|its) (?:preparation|method|methods|plant part)))/.test(text));
    const typeMatch = evidenceType === record.type || evidenceType === "traditional" && record.type === "ethnobotanical";
    if (!relevant || evidenceType && !typeMatch && !(publicTopic && record.type === "guidance")) return [];
    return [{ record, score: (record.type === "guidance" && publicTopic ? 60 : 0) + topicMatches.length * 10 + (scoped ? 5 : 0) + (priorMatch ? 2 : 0) }];
  });

  const records: ResearchRecord[] = ranked.sort((a, b) => b.score - a.score).slice(0, maxSources).map(({ record }) => record);
  return { records, ambiguous, publicTopic };
}

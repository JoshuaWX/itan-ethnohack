import { taxa } from "./catalog.ts";
import { normalizeName } from "./matching.ts";
import { researchCollection, type ResearchRecord } from "./research-collection.ts";

export const maxQuestionLength = 320;
export const maxContextIds = 12;
export const maxSources = 6;
export const taxonIds = new Set(taxa.map(({ id }) => id));
export const recordIds = new Set(researchCollection.map(({ id }) => id));

// Everyday and Nigerian-English phrasings mapped onto the corpus keyword vocabulary.
// Order matters: longer phrases are rewritten before their shorter parts.
const synonyms: [RegExp, string][] = [
  [/\b(?:blood )?sugar levels?\b|\bblood sugar\b|\bblood glucose\b|\bsugar\b/g, "glucose"],
  [/\banti ?diabetic\b|\bdiabetics?\b/g, "diabetes"],
  [/\bhigh blood pressure\b|\bbp\b/g, "blood pressure"],
  [/\banti ?hypertensive\b|\bhypertensive\b/g, "hypertension"],
  [/\b(?:stomach|gastric) (?:empty|empties)\b/g, "stomach emptying"],
  [/\bside effects?\b|\badverse effects?\b|\btoxicity\b|\btoxic\b|\bharmful\b|\bdangerous\b|\bsafe\b/g, "safety"],
  [/\binteract(?:s|ing|ions)?\b/g, "interaction"],
  [/\bplatelet counts?\b/g, "platelets"],
];
export const normalizeQuestion = (text: string) => normalizeName(text).replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const clean = normalizeQuestion;
const canonical = (text: string) => synonyms.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text).replace(/\bglucose(?: glucose)+\b/g, "glucose");
const contains = (text: string, phrase: string) => ` ${text} `.includes(` ${clean(phrase)} `);

const spellingVariants: Record<string, string[]> = { papaya: ["paw paw"] };
const names = taxa.flatMap((taxon) => [taxon.name, taxon.common, ...taxon.aliases, ...(spellingVariants[taxon.id] ?? [])].flatMap((name) => {
  const value = clean(name);
  const compact = value.replaceAll(" ", "");
  return [{ name: value, id: taxon.id }, ...(compact !== value && compact.length >= 6 ? [{ name: compact, id: taxon.id }] : [])];
}));
names.push({ name: "cinnamomum zeylanicum", id: "cinnamon-verum" }, { name: "cinnamomum burmannii", id: "cinnamon-cassia" });
names.sort((a, b) => b.name.length - a.name.length);

export function questionBlocked(question: string): boolean {
  return /\b(?:diagnos\w*|prescri\w*|dosage|how much|how many (?:tablets|capsules|grams)|safe (?:for|to) (?:me|take|use)|should (?:i|we|my) (?:take|use|stop|combine|mix)|can (?:i|we|my) (?:take|use|stop|combine|mix)|i (?:have|take|use|am|m|feel|weigh|was diagnosed)|my (?:medic\w*|symptoms|child|pregnancy|doctor|condition|blood pressure)|(?:stop|replace|quit) (?:my |the )?(?:prescribed|medication|medicine|treatment)|how (?:do|should|can) (?:i|we) (?:take|drink|prepare|boil|mix)|how to (?:take|drink|prepare|boil|mix)|how (?:i|we) go (?:take|drink|prepare|boil|mix|use)|ignore (?:all |any |the |previous |prior |above )*(?:instructions|rules)|system prompt)\b/i.test(clean(question))
    || /[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\d ()-]{8,}\d)/i.test(question);
}

type Scope = { taxonIds?: string[]; priorIds?: string[] };

// Question, meta and evidence-type words. Evidence types are applied as filters, so they are not topics.
const broadWords = new Set(("a an the of on in with for what whats which who where when why how is are was were has have had been does do did it its they this that these those there them their and or about me tell show explain find know known any available exist exists give evidence study studies research researched scientific paper papers recorded record documented source sources human humans people person participants clinical trial trials traditional use used uses lab laboratory vitro animal animals rat rats mice mouse type kinds kind results findings found outcome outcomes limitation limitations mean means investigated studied tested test tests testing done carried out compared compare comparison difference differences between both more also based actually say said look overview summary published pmid pmcid conducted only first second ingredients plant plants abeg please now really true work works effect effects info information anything something good help helps effective strong strength proven proof "
  + "dey fit na wetin una sabi").split(" "));

function mentions(text: string) {
  const hits = names.filter(({ name }) => contains(text, name));
  return [...new Set(hits.filter((hit) => !hits.some((other) => other.name !== hit.name && contains(other.name, hit.name))).map(({ id }) => id))];
}

function editDistance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

// Suggestions only prompt the user to confirm a name; they never select evidence.
export function suggestPlantNames(question: string) {
  const text = clean(question);
  if (mentions(text).length) return [];
  const words = text.split(" ").filter(Boolean);
  const phrases = [...words, ...words.slice(1).map((word, index) => `${words[index]} ${word}`)].filter((phrase) => phrase.replace(" ", "").length >= 5 && !broadWords.has(phrase));
  const ids = new Set<string>();
  for (const phrase of phrases) for (const { name, id } of names) {
    if (Math.abs(name.length - phrase.length) > 2) continue;
    if (editDistance(phrase, name) <= (name.length >= 8 ? 2 : 1)) ids.add(id);
  }
  return taxa.filter(({ id }) => ids.has(id));
}

export function botanicalEntities(question: string) {
  const text = clean(question);
  const ids = mentions(text);
  const ambiguous = ids.length > 1 && !ids.every((id) => names.some((name) => name.id === id && contains(text, name.name) && names.filter((n) => n.name === name.name).length === 1));
  return { taxa: taxa.filter(({ id }) => ids.includes(id)), ambiguous };
}

const typePatterns = [
  ["traditional", /\b(?:traditional|ethnobotanical|survey)\b/],
  ["human", /\b(?:human|humans|people|person|clinical|participants)\b/],
  ["animal", /\b(?:animal|animals|rats?|mice|mouse)\b/],
  ["laboratory", /\b(?:lab|laboratory|in vitro)\b/],
] as const;
const attributeQuestion = /\b(?:limitations?|preparations?|methods?|plant parts?|population|participants|how many|design|interchangeable|same|differ\w*)\b/;

export function retrieveEvidence(question: string, scope: Scope = {}) {
  const text = clean(question);
  const topical = canonical(text);
  const explicit = mentions(text);
  const sourceMatch = researchCollection.filter((record) => contains(text, record.sourceId) || (record.sourceId.startsWith("PMID:") && contains(text, record.sourceId.slice(5))));
  const publicTopic = /\b(?:cholera|malaria|artemisia)\b/.test(text);
  const stripped = names.reduce((value, { name }) => ` ${value} `.replaceAll(` ${name} `, " ").trim(), topical);
  const terms = stripped.split(" ").filter((word) => word && !broadWords.has(word));
  const prior = researchCollection.filter(({ id }) => scope.priorIds?.includes(id));
  const followUp = !explicit.length && !publicTopic && /\b(?:it|its|they|them|their|that|this|those|these|what about|which|how many|limitations)\b/.test(text);
  const focus = explicit.length ? explicit : followUp && prior.length ? [...new Set(prior.flatMap(({ taxa }) => taxa))] : scope.taxonIds ?? [];
  const types = typePatterns.filter(([, pattern]) => pattern.test(text)).map(([type]) => type);
  const evidenceType = types.length === 1 ? types[0] : undefined;
  const ambiguous = explicit.length > 1 && !explicit.every((id) => names.some((name) => name.id === id && contains(text, name.name) && names.filter((n) => n.name === name.name).length === 1));

  const ranked = researchCollection.flatMap((record) => {
    if (followUp && prior.length && !evidenceType && attributeQuestion.test(text) && !prior.some(({ id }) => id === record.id)) return [];
    if (!focus.length && !sourceMatch.length && !publicTopic && !/\b(?:simvastatin|metformin)\b/.test(text)) return [];
    // Infectious disease queries show official guidance only. Guava's lab study
    // stays available from its plant page, without an outbreak association.
    if (publicTopic && record.type !== "guidance") return [];
    if (record.id === "guava-lab" && !focus.includes("guava") && !sourceMatch.includes(record)) return [];
    const matchedSource = sourceMatch.includes(record);
    if (sourceMatch.length) return matchedSource ? [{ record, score: 100 }] : [];
    const scoped = record.taxa.some((id) => focus.includes(id));
    if (contains(topical, "interaction") && !record.keywords.some((keyword) => /interaction|pharmacokinetics|drug exposure/.test(clean(keyword)))) return [];
    const topicMatches = record.keywords.filter((keyword) => contains(topical, canonical(clean(keyword))));
    const hasSpecificTopic = topicMatches.some((keyword) => canonical(clean(keyword)).split(" ").some((word) => !broadWords.has(word)));
    const priorMatch = followUp && prior.includes(record);
    const relevant = publicTopic && record.type === "guidance" && topicMatches.length
      || (!explicit.length || scoped) && hasSpecificTopic && (!focus.length || scoped || publicTopic)
      || (scoped || priorMatch) && (terms.length === 0 || priorMatch && attributeQuestion.test(text));
    const typeMatch = evidenceType === record.type || evidenceType === "traditional" && record.type === "ethnobotanical";
    if (!relevant || evidenceType && !typeMatch && !(publicTopic && record.type === "guidance")) return [];
    return [{ record, score: (record.type === "guidance" && publicTopic ? 60 : 0) + topicMatches.length * 10 + (scoped ? 5 : 0) + (priorMatch ? 2 : 0) }];
  });

  const records: ResearchRecord[] = ranked.sort((a, b) => b.score - a.score).slice(0, maxSources).map(({ record }) => record);
  return { records, ambiguous, publicTopic };
}

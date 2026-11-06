import { readFile, mkdir, writeFile } from "node:fs/promises";
import { analyzeClaim } from "../src/lib/claim-analysis.ts";
import { questionBlocked, recordIds, retrieveEvidence } from "../src/lib/research-retrieval.ts";

const read = async (name) => JSON.parse(await readFile(new URL(`../tests/fixtures/${name}`, import.meta.url)));
const { scope, cases } = await read("claim-eval.json");
const retrievalCases = await read("retrieval-eval.json");
for (const c of retrievalCases) if ((c.expected ?? []).some((id) => !recordIds.has(id))) throw new Error(`Unknown record ID in: ${c.question}`);

const verdictOf = (result) => result.verdict?.level ?? (result.blocked ? "blocked" : result.needsClarification ? "needs-clarification" : result.records.length ? "unscored" : "no-evidence");
const claimRows = cases.map((c) => {
  const result = analyzeClaim(c.claim);
  const actual = {
    taxon: result.entities.taxa.length === 1 ? result.entities.taxa[0].id : undefined,
    outcome: result.outcome?.id,
    direction: result.direction,
    verdict: verdictOf(result),
  };
  const checks = Object.fromEntries(["taxon", "outcome", "direction", "verdict"].filter((key) => key in c).map((key) => [key, c[key] === actual[key]]));
  return { claim: c.claim, expected: c, actual, checks, passed: Object.values(checks).every(Boolean) };
});
const field = (key) => {
  const scored = claimRows.filter((row) => key in row.checks);
  return { correct: scored.filter((row) => row.checks[key]).length, total: scored.length };
};

const retrievalRows = retrievalCases.map((c) => {
  const blocked = questionBlocked(c.question);
  const actual = blocked ? [] : retrieveEvidence(c.question).records.map(({ id }) => id);
  const passed = c.blocked ? blocked : !blocked && JSON.stringify([...actual].sort()) === JSON.stringify([...(c.expected ?? [])].sort());
  return { question: c.question, expected: c.blocked ? "blocked" : c.expected, actual: blocked ? "blocked" : actual, passed };
});

const report = {
  scope,
  claims: { total: claimRows.length, passed: claimRows.filter((row) => row.passed).length, plant: field("taxon"), outcome: field("outcome"), direction: field("direction"), verdict: field("verdict") },
  retrieval: { total: retrievalRows.length, passed: retrievalRows.filter((row) => row.passed).length },
  failures: { claims: claimRows.filter((row) => !row.passed), retrieval: retrievalRows.filter((row) => !row.passed) },
};
await mkdir("outputs/audit", { recursive: true });
await writeFile(`outputs/audit/claims-${process.argv[2] ?? "current"}.json`, JSON.stringify({ ...report, claimRows, retrievalRows }, null, 2));
console.log(JSON.stringify(process.argv.includes("--verbose") ? report : { claims: report.claims, retrieval: report.retrieval }, null, 2));

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { retrieveEvidence, questionBlocked, recordIds } from '../src/lib/research-retrieval.ts';
const holdout = process.argv[2] === 'holdout';
const cases = JSON.parse(await readFile(new URL(holdout ? '../tests/fixtures/audit-holdout.json' : '../tests/fixtures/audit-questions.json', import.meta.url)));
for (const c of cases) if ([...(c.expected ?? []), ...(c.prior ?? [])].some(id => !recordIds.has(id))) throw new Error('Fixture refers to an unknown record ID.');
const rows = cases.map(c => {
  const blocked = questionBlocked(c.question);
  const result = blocked ? { records: [], ambiguous: false } : retrieveEvidence(c.question, { priorIds: c.prior, taxonIds: c.scope });
  const actual = result.records.map(r => r.id);
  const expected = c.expected ?? [];
  const passed = c.blocked ? blocked : !blocked && JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort()) && (c.ambiguous === undefined || c.ambiguous === result.ambiguous);
  return { ...c, actual, actualBlocked: blocked, actualAmbiguous: result.ambiguous, passed };
});
const report = { scope: 'Developer-authored varied retrieval questions; no model calls or independent expert labels', total: rows.length, passed: rows.filter(r => r.passed).length, failed: rows.filter(r => !r.passed).length, rows };
await mkdir('outputs/audit', {recursive:true});
const label = holdout ? 'holdout' : process.argv[2] === 'baseline' ? 'baseline' : 'current';
await writeFile('outputs/audit/retrieval-' + label + '.json', JSON.stringify(report,null,2));
console.log(JSON.stringify({ total:report.total, passed:report.passed, failed:report.failed, failures:rows.filter(r=>!r.passed) },null,2));

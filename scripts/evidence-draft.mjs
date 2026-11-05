import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

// Metadata-only drafts. Publication requires a separate human source check.
const ids = process.argv.slice(2).map((value) => value.replace(/^PMID:/i, ""));
if (!ids.length || ids.length > 10 || ids.some((id) => !/^\d{1,9}$/.test(id))) {
  throw new Error("Provide one to ten approved PMIDs, for example npm run evidence:draft -- 23770031");
}
const query = `SRC:MED AND (${ids.map((id) => `EXT_ID:${id}`).join(" OR ")})`;
const url = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
url.search = new URLSearchParams({ query, format: "json", resultType: "core", pageSize: "10" }).toString();
const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
if (!response.ok) throw new Error("Europe PMC is unavailable. No draft was created.");
const data = await response.json();
if (data.errCode || !Array.isArray(data.resultList?.result)) throw new Error("Invalid Europe PMC response.");
const rows = data.resultList.result;
if (ids.some((id) => !rows.some((row) => row.id === id && row.source === "MED"))) throw new Error("Some requested PMIDs were not returned. Review the identifiers before importing.");
const drafts = rows.map((row) => ({
  sourceId: `PMID:${row.id}`, url: `https://pubmed.ncbi.nlm.nih.gov/${row.id}/`,
  title: row.title, doi: row.doi ?? "unknown", publicationYear: row.pubYear ?? "unknown",
  sourceVerification: "pending", expertReview: "pending", taxa: [],
  part: "unknown", preparation: "unknown", population: "unknown",
  finding: "", limitation: "", outcomes: [],
  reuse: "Bibliographic metadata only. No abstract, figure or full text imported.",
}));
const directory = join(process.cwd(), "outputs", "evidence-drafts");
await mkdir(directory, { recursive: true });
const path = join(directory, `pmids-${ids.join("-")}.json`);
await writeFile(path, JSON.stringify({ retrievedOn: new Date().toISOString(), endpoint: url.href, drafts }, null, 2), { flag: "wx" });
console.log(`Created ${drafts.length} pending metadata drafts in ${path}. Review original sources and rights before adding evidence.`);

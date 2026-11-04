"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { splitIngredients, type Taxon } from "@/lib/matching";
import { compareProducts, findInteractionEvidence, interactionRecords } from "@/lib/comparison";
import { LabelOcr } from "@/components/label-ocr";
import { PlantPhoto } from "@/components/plant-photo";
import { EvidenceExplorer } from "@/components/evidence-explorer";
import { AskTrigger, shareComparison } from "@/components/ask-itan";
import { taxonIds } from "@/lib/research-retrieval";
import { useScanTransfer } from "@/components/scan-transfer";

type Entry = { name: string; text: string };
const examples: Entry[] = [
  { name: "Example tea A", text: "hibiscus\nginger\ncinnamon" },
  { name: "Example tea B", text: "roselle\nCinnamomum verum\nguava" },
];

export function Compare({ taxa, catalogSource }: { taxa: Taxon[]; catalogSource: "database" | "fallback" }) {
  const [entries, setEntries] = useState<Entry[]>(examples);
  const [medicine, setMedicine] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [importedScan, setImportedScan] = useState(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const { ingredients: scanIngredients, setIngredients: setScanIngredients } = useScanTransfer();
  const result = compareProducts(entries.map((entry) => ({ name: entry.name, ingredients: splitIngredients(entry.text) })), taxa);
  const matchingSafety = findInteractionEvidence(result.products, medicine, interactionRecords);
  useEffect(() => () => shareComparison(null), []);
  useEffect(() => {
    if (!scanIngredients) return;
    setEntries([{ name: "Scanned product", text: scanIngredients }, { name: "", text: "" }]);
    setImportedScan(true);
    setSubmitted(false);
    shareComparison(null);
    setScanIngredients("");
  }, [scanIngredients, setScanIngredients]);
  useEffect(() => { if (submitted) resultHeading.current?.focus(); }, [submitted]);
  function clearResult() {
    setSubmitted(false);
    shareComparison(null);
  }
  function submit() {
    setSubmitted(true);
    const ids = [...new Set(result.products.flatMap(({ ingredients }) => ingredients.flatMap(({ match }) => match.candidates.map(({ id }) => id))))].filter((id) => taxonIds.has(id));
    const shared = result.shared.map(({ common }) => common).join(", ");
    const possible = result.possible.map(({ name }) => name).join(", ");
    const unresolved = result.products.reduce((count, { ingredients }) => count + ingredients.filter(({ match }) => match.kind === "unresolved").length, 0);
    shareComparison({ ids, summary: `${shared ? `Confirmed catalog overlap: ${shared}.` : "No exact scientific-name overlap in this comparison."}${possible ? ` Possible overlap: ${possible}.` : ""}${unresolved ? ` Unresolved label entries: ${unresolved}.` : ""} Overlap alone does not establish an interaction.` });
  }
  function update(index: number, change: Partial<Entry>) {
    setEntries((current) => current.map((entry, i) => i === index ? { ...entry, ...change } : entry));
    clearResult();
  }
  return <>
    <Link className="back" href="/">← Back to discover</Link>
    <div className="page-intro"><h1>Compare products</h1><p>{importedScan ? "Your confirmed ingredients are in the first product. Add another label to compare." : "Compare ingredients in two or three products. Try the fictional examples or replace them with your own labels."}</p></div>
    {catalogSource === "fallback" && <p>Using the versioned offline catalog. It may not include recent updates.</p>}
    <div id="scan" className="scan-lead"><h2>Add your labels</h2><p>Take a clear photo of the ingredient list or enter it yourself. Review the text before comparing.</p></div>
    <div className="compare-inputs">{entries.map((entry, index) => <section className="compare-card" key={index}>
      <h3>Product {index + 1}</h3>
      <label htmlFor={`product-${index}`}>Product name</label>
      <input id={`product-${index}`} value={entry.name} onChange={(event) => update(index, { name: event.target.value })} />
      <label htmlFor={`ingredients-${index}`}>Ingredients, one per line or separated by commas</label>
      <textarea id={`ingredients-${index}`} rows={5} value={entry.text} onChange={(event) => update(index, { text: event.target.value })} />
      <details className="compare-scan"><summary>Read a label photo</summary><LabelOcr onConfirm={(text) => update(index, { text })} /></details>
      {entries.length > 2 && <button type="button" className="compare-secondary" onClick={() => { setEntries((current) => current.filter((_, i) => i !== index)); clearResult(); }}>Remove product</button>}
    </section>)}</div>
    {entries.length < 3 && <button type="button" className="compare-secondary" onClick={() => { setEntries([...entries, { name: "Product 3", text: "" }]); clearResult(); }}>+ Add another product</button>}
    <div className="compare-medicine"><label htmlFor="medicine">Explore a documented medicine interaction (optional)</label><select id="medicine" value={medicine} onChange={(event) => { setMedicine(event.target.value); clearResult(); }}><option value="">No medicine selected</option><option value="simvastatin">Simvastatin</option></select></div>
    <button className="button compare-submit" type="button" onClick={submit} disabled={entries.some((entry) => !splitIngredients(entry.text).length)}>Compare ingredients</button>
    {submitted && <div className="compare-results" aria-live="polite">
      <section className="detail-section"><h2 ref={resultHeading} tabIndex={-1}>Shared ingredients</h2>{result.shared.length ? <ul>{result.shared.map((taxon) => <li key={taxon.id}><Link className="source-link" href={`/plants/${taxon.id}`}>{taxon.common} <i>({taxon.name})</i></Link><PlantPhoto id={taxon.id} name={taxon.common} /></li>)}</ul> : <p>No confirmed shared taxa in this small catalog.</p>}<p>Sharing an ingredient does not itself establish an interaction or danger.</p>
      <AskTrigger className="source-link" label="Ask about this comparison" />
      </section>
      <section className="detail-section"><h2>Unique scientific-name matches</h2><p>These taxa have an exact match on one label and no matching candidate on the other labels.</p>
        <div className="compare-columns">
        {result.products.map((product, index) => {
          const unique = [...new Map(product.ingredients.flatMap(({ match }) => match.kind === "exact" ? match.candidates : []).map((taxon) => [taxon.id, taxon])).values()].filter((taxon) => !result.shared.some(({ id }) => id === taxon.id) && !result.possible.some(({ id }) => id === taxon.id));
          return <article className="compare-column" key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{unique.length ? <ul>{unique.map((taxon) => <li key={taxon.id}><Link href={`/plants/${taxon.id}`} className="source-link"><i>{taxon.name}</i> ↗</Link></li>)}</ul> : <p>No unique exact matches.</p>}</article>;
        })}
        </div>
      </section>
      {result.possible.length > 0 && <section className="detail-section"><h2>Possible overlap</h2><p>Common or ambiguous names may refer to more than one species.</p><ul>{result.possible.map((taxon) => <li key={taxon.id}><Link className="source-link" href={`/plants/${taxon.id}`}><i>{taxon.name}</i> ↗</Link></li>)}</ul></section>}
      <details className="detail-section compare-disclosure"><summary>Original label text and matching details</summary><p>Ìtàn checks original label entries against scientific names and documented aliases. Common names suggest possible identities.</p><div className="compare-columns">{result.products.map((product, index) => <article className="compare-column" key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{product.ingredients.map(({ original, match }, row) => <div className="compare-row" key={row}><strong>{original}</strong><span>{match.kind === "unresolved" ? "Unresolved" : match.kind === "ambiguous" ? "Ambiguous" : match.kind === "exact" ? "Scientific-name match" : "Possible identity"}</span><p>{match.explanation}</p>{match.candidates.map((taxon) => <Link className="candidate-link" href={`/plants/${taxon.id}`} key={taxon.id}><i>{taxon.name}</i> ↗</Link>)}</div>)}</article>)}</div></details>
      <section className="detail-section"><p className="overline">Evidence, separately</p><h2>Documented interaction research</h2>{matchingSafety.length ? matchingSafety.map((record) => <article className="guidance" key={record.source}><h3>{record.title}</h3><p>{record.summary}</p><p>{record.limitation}</p><a className="source-link" href={record.source} target="_blank" rel="noreferrer">Read the source ↗</a></article>) : <p>Insufficient evidence in this small curated collection to assess these combinations.</p>}<p>Missing records do not establish safety. This educational prototype does not check every interaction or clinical contraindication. Speak with a qualified health professional about medicines and herbal products.</p></section>
    </div>}
    <EvidenceExplorer />
  </>;
}

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
import { ingredientLanguage } from "@/lib/consumer-language";
import { ResultGuide } from "./result-guide";
import { researchCollection } from "@/lib/research-collection";
import { ResearchCard } from "./research-card";

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
  const unknownEntries = result.products.flatMap((product) => product.ingredients.filter(({ match }) => match.kind === "unresolved").map(({ original }) => ({ product: product.name, original })));
  const uniqueByProduct = result.products.map((product) => [...new Map(product.ingredients.flatMap(({ match }) => match.kind === "exact" ? match.candidates : []).map((taxon) => [taxon.id, taxon])).values()].filter((taxon) => !result.shared.some(({ id }) => id === taxon.id) && !result.possible.some(({ id }) => id === taxon.id)));
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
    shareComparison({ ids, summary: `${shared ? `These labels share scientific names for: ${shared}.` : "We could not confirm a shared ingredient from the scientific names on these labels."}${possible ? ` These plants may be shared, but their names need checking: ${possible}.` : ""}${unresolved ? ` We could not identify ${unresolved} ingredient names.` : ""} Sharing an ingredient alone does not show that a combination is dangerous.` });
  }
  function update(index: number, change: Partial<Entry>) {
    setEntries((current) => current.map((entry, i) => i === index ? { ...entry, ...change } : entry));
    clearResult();
  }
  return <>
    <Link className="back" href="/">← Back to Home</Link>
    <div className="page-intro"><h1>Compare products</h1><p>{importedScan ? "Your confirmed ingredients are in the first product. Add another label to compare." : "Compare ingredients in two or three products. Try the fictional examples or replace them with your own labels."}</p></div>
    {catalogSource === "fallback" && <p className="status-note">Using the plant library saved with this demo. Recent updates may be missing.</p>}
    <div id="scan" className="scan-lead"><h2>Add your labels</h2><p>Take a clear photo of the ingredient list or enter it yourself. Review the text before comparing.</p></div>
    <div className="compare-inputs">{entries.map((entry, index) => <section className="compare-card" key={index}>
      <h3>Product {index + 1}</h3>
      <label htmlFor={`product-${index}`}>Product name (optional)</label>
      <input id={`product-${index}`} value={entry.name} onChange={(event) => update(index, { name: event.target.value })} />
      <label htmlFor={`ingredients-${index}`}>Ingredients, one per line or separated by commas</label>
      <textarea id={`ingredients-${index}`} rows={5} maxLength={4000} value={entry.text} onChange={(event) => update(index, { text: event.target.value })} />
      <details className="compare-scan"><summary>Read a label photo</summary><LabelOcr onConfirm={(text) => update(index, { text })} /></details>
      {entries.length > 2 && <button type="button" className="compare-secondary" onClick={() => { setEntries((current) => current.filter((_, i) => i !== index)); clearResult(); }}>Remove product</button>}
    </section>)}</div>
    {entries.length < 3 && <button type="button" className="compare-secondary" onClick={() => { setEntries([...entries, { name: "Product 3", text: "" }]); clearResult(); }}>+ Add another product</button>}
    <div className="compare-medicine"><label htmlFor="medicine">Narrow the medicine research (optional)</label><select id="medicine" value={medicine} onChange={(event) => { setMedicine(event.target.value); clearResult(); }}><option value="">All documented studies for these plants</option><option value="simvastatin">Simvastatin · studied in people</option><option value="metformin">Metformin · studied in animals</option></select><p>Studies linked to a listed plant appear on their own. Choosing a medicine only narrows that list. A missing study is not a safety clearance.</p></div>
    <button className="button compare-submit" type="button" onClick={submit} disabled={entries.some((entry) => !splitIngredients(entry.text).length)}>Compare ingredients</button>
    {submitted && <div className="compare-results" aria-live="polite">
      <h2 ref={resultHeading} tabIndex={-1}>Your comparison</h2>
      <ResultGuide found={result.shared.length ? `The labels share scientific names for ${result.shared.map(({ common }) => common).join(", ")}.${result.possible.length ? " There are also possible matches to check below." : ""}` : result.possible.length ? `These products may share ${result.possible.map(({ common }) => common).join(", ")}. The label names need checking before we can confirm this.` : "We couldn’t confirm any shared ingredient names. Check the label lists and any unidentified ingredients below."} meaning="We compared the names on the labels. Sharing an ingredient alone does not mean the products are dangerous together." unknown="We cannot confirm amounts, actual product contents or whether these products are safe to take together."><p>Check the uncertain names below, then open a plant to read the research.</p></ResultGuide>
      <section className="detail-section"><h2>Ingredients they share</h2>{result.shared.length ? <ul className="shared-plant-list">{result.shared.map((taxon) => <li key={taxon.id}><Link className="source-link" href={`/plants/${taxon.id}`}>{taxon.common} ↗</Link><PlantPhoto id={taxon.id} name={taxon.common} /></li>)}</ul> : <p>We couldn’t confirm a shared ingredient from the full scientific names on these labels. Common names may still refer to the same plant; check below.</p>}
      <AskTrigger className="source-link" label="Ask about this comparison" />
      </section>
      {uniqueByProduct.some((items) => items.length) && <section className="detail-section"><h2>Ingredients found on only one label</h2><p>These scientific names matched on one label only. Names we are less sure about appear in the next section.</p>
        <div className="compare-columns">
        {result.products.map((product, index) => {
          const unique = uniqueByProduct[index];
          return <article className="compare-column" key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{unique.length ? <ul>{unique.map((taxon) => <li key={taxon.id}><Link href={`/plants/${taxon.id}`} className="source-link">{taxon.common} ↗</Link></li>)}</ul> : <p>No ingredient could be placed here with certainty from its name.</p>}</article>;
        })}
        </div>
      </section>}
      <section className="detail-section"><h2>Names that need checking</h2>
        {result.possible.length > 0 && <><h3>These may be the same ingredient</h3><p>For example, “cinnamon” can mean different plants. We need more detail before counting it as shared.</p><ul>{result.possible.map((taxon) => <li key={taxon.id}><Link className="source-link" href={`/plants/${taxon.id}`}>{taxon.common} ↗</Link></li>)}</ul></>}
        {result.products.map((product, index) => {
          const uncertain = product.ingredients.filter(({ match }) => match.kind === "alias" || match.kind === "ambiguous");
          return uncertain.length > 0 && <div key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{uncertain.map(({ original, match }, row) => <p key={row}><strong>{original}:</strong> {ingredientLanguage(match).explanation}</p>)}</div>;
        })}
        {unknownEntries.length > 0 && <><h3>Ingredients we couldn’t identify</h3><ul>{unknownEntries.map((entry, index) => <li key={index}><strong>{entry.original}</strong> · {entry.product || "Unnamed product"}</li>)}</ul><p>Check the spelling or label photo. These plants may also be missing from our library.</p></>}
        {!result.possible.length && !unknownEntries.length && !result.products.some((product) => product.ingredients.some(({ match }) => match.kind === "alias" || match.kind === "ambiguous")) && <p>All names matched a full scientific name in this library. This checks the label text, not the contents of the products.</p>}
      </section>
      <details className="detail-section compare-disclosure"><summary>See the original labels and name checks</summary><p>Common names suggest a plant but do not confirm its exact identity.</p><div className="compare-columns">{result.products.map((product, index) => <article className="compare-column" key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{product.ingredients.map(({ original, match }, row) => <div className="compare-row" key={row}><strong>{original}</strong><span>{ingredientLanguage(match).label}</span><p>{match.explanation}</p>{match.candidates.map((taxon) => <Link className="candidate-link" href={`/plants/${taxon.id}`} key={taxon.id}><i>{taxon.name}</i> ↗</Link>)}</div>)}</article>)}</div></details>
      <section className="detail-section interaction-section"><h2>Research about effects on medicines</h2><p>This is separate from shared ingredients. Each card names whether the study was in people or in animals. It is not a personal safety check, and a missing record does not mean the combination is safe.</p>{matchingSafety.length ? matchingSafety.map((record) => {
        const evidence = researchCollection.find((item) => item.url === record.source);
        return evidence ? <ResearchCard key={record.source} record={evidence} /> : <article className="guidance" key={record.source}><h3>{record.title}</h3><p>{record.summary}</p><p>{record.limitation}</p><a className="source-link" href={record.source} target="_blank" rel="noreferrer">Read the source ↗</a></article>;
      }) : <p>Ìtàn doesn’t have enough research to assess these combinations{medicine ? ` with ${medicine}` : ""}. This does not mean they are safe.</p>}<p>We do not check every possible effect between herbs and medicines, or every reason a product might be unsuitable. Ask a pharmacist before combining herbal products with medicines.</p></section>
    </div>}
    <EvidenceExplorer />
  </>;
}

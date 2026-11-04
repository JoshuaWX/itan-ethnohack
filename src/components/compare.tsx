"use client";

import { useState } from "react";
import Link from "next/link";
import type { Taxon } from "@/lib/matching";
import { compareProducts, findInteractionEvidence, interactionRecords } from "@/lib/comparison";
import { LabelOcr } from "@/components/label-ocr";
import { PlantPhoto } from "@/components/plant-photo";
import { EvidenceExplorer } from "@/components/evidence-explorer";

type Entry = { name: string; text: string };
const examples: Entry[] = [
  { name: "Example tea A", text: "hibiscus\nginger\ncinnamon" },
  { name: "Example tea B", text: "roselle\nCinnamomum verum\nguava" },
];

export function Compare({ taxa, catalogSource }: { taxa: Taxon[]; catalogSource: "database" | "fallback" }) {
  const [entries, setEntries] = useState<Entry[]>(examples);
  const [medicine, setMedicine] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const result = compareProducts(entries.map((entry) => ({ name: entry.name, ingredients: entry.text.split(/\n|,/).map((value) => value.trim()).filter(Boolean) })), taxa);
  const matchingSafety = findInteractionEvidence(result.products, medicine, interactionRecords);
  function update(index: number, change: Partial<Entry>) {
    setEntries((current) => current.map((entry, i) => i === index ? { ...entry, ...change } : entry));
    setSubmitted(false);
  }
  return <>
    <Link className="back" href="/">← Back to discover</Link>
    <div className="page-intro"><p className="overline">A clearer look at ingredients</p><h1>Compare what’s inside.</h1><p>Explore ingredients in two or three products. The examples are fictional; replace them with names from your labels.</p></div>
    {catalogSource === "fallback" && <p>Using the versioned offline catalog. It may not include recent updates.</p>}
    <div className="compare-inputs" id="scan">{entries.map((entry, index) => <section className="compare-card" key={index}>
      <label htmlFor={`product-${index}`}>Product name</label>
      <input id={`product-${index}`} value={entry.name} onChange={(event) => update(index, { name: event.target.value })} />
      <label htmlFor={`ingredients-${index}`}>Ingredients, one per line or separated by commas</label>
      <textarea id={`ingredients-${index}`} rows={5} value={entry.text} onChange={(event) => update(index, { text: event.target.value })} />
      <LabelOcr onConfirm={(text) => update(index, { text })} />
      {entries.length > 2 && <button type="button" className="compare-secondary" onClick={() => { setEntries((current) => current.filter((_, i) => i !== index)); setSubmitted(false); }}>Remove product</button>}
    </section>)}</div>
    {entries.length < 3 && <button type="button" className="compare-secondary" onClick={() => { setEntries([...entries, { name: "Product 3", text: "" }]); setSubmitted(false); }}>+ Add another product</button>}
    <div className="compare-medicine"><label htmlFor="medicine">Explore a documented medicine interaction (optional)</label><select id="medicine" value={medicine} onChange={(event) => { setMedicine(event.target.value); setSubmitted(false); }}><option value="">No medicine selected</option><option value="simvastatin">Simvastatin</option></select></div>
    <button className="button compare-submit" type="button" onClick={() => setSubmitted(true)} disabled={entries.some((entry) => !entry.text.trim())}>Compare ingredients</button>
    {submitted && <div className="compare-results" aria-live="polite">
      <section className="detail-section"><p className="overline">Comparison</p><h2>Shared ingredients</h2>{result.shared.length ? <ul>{result.shared.map((taxon) => <li key={taxon.id}><Link className="source-link" href={`/plants/${taxon.id}`}>{taxon.common} <i>({taxon.name})</i></Link><PlantPhoto id={taxon.id} name={taxon.common} /></li>)}</ul> : <p>No confirmed shared taxa in this small catalog.</p>}<p>Sharing an ingredient does not itself establish an interaction or danger.</p>
      {result.possible.length > 0 && <><h3>Possible overlap</h3><p>Common or ambiguous names may refer to {result.possible.map((taxon) => taxon.name).join(", ")}. The label does not establish the species.</p></>}
      </section>
      <section className="detail-section"><h2>How the names matched</h2><p>Ìtàn compares each original entry with scientific names and documented aliases in its small catalog. A common name is a candidate, not laboratory identification.</p>{result.products.map((product, index) => <article className="compare-result-card" key={index}><h3>{product.name || `Product ${index + 1}`}</h3>{product.ingredients.map(({ original, match }, row) => <div className="compare-row" key={row}><strong>{original}</strong><span>{match.kind === "unresolved" ? "Not identified" : match.kind === "ambiguous" ? "Ambiguous" : match.kind === "exact" ? "Scientific-name match" : "Candidate catalog match"}</span><p>{match.explanation}</p>{match.candidates.map((taxon) => <Link className="candidate-link" href={`/plants/${taxon.id}`} key={taxon.id}><i>{taxon.name}</i> ↗</Link>)}</div>)}</article>)}</section>
      <section className="detail-section"><p className="overline">Evidence, separately</p><h2>Documented interaction research</h2>{matchingSafety.length ? matchingSafety.map((record) => <article className="guidance" key={record.source}><h3>{record.title}</h3><p>{record.summary}</p><p>{record.limitation}</p><a className="source-link" href={record.source} target="_blank" rel="noreferrer">Read the source ↗</a></article>) : <p>Insufficient evidence in this small curated collection to assess these combinations.</p>}<p>Missing records do not establish safety. This educational prototype does not check every interaction or clinical contraindication. Speak with a qualified health professional about medicines and herbal products.</p></section>
    </div>}
    <EvidenceExplorer />
  </>;
}

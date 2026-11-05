"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { analyzeClaim, type Relation } from "@/lib/claim-analysis";
import { ResearchCard } from "./research-card";

const labels: Record<Relation, string> = {
  supports: "Supports within this study",
  contradicts: "Contradicts within this study",
  "partially-addresses": "Partially addresses the claim",
  "does-not-answer": "Does not answer the claim",
};

export function ClaimExplorer() {
  const [claim, setClaim] = useState("");
  const [submitted, setSubmitted] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const result = submitted ? analyzeClaim(submitted) : null;
  return <>
    <form className="capture-surface" onSubmit={(event) => { event.preventDefault(); setSubmitted(claim.trim()); requestAnimationFrame(() => heading.current?.focus()); }}>
      <label className="scan-field">The claim you want to check<textarea rows={3} maxLength={320} value={claim} onChange={(event) => setClaim(event.target.value)} placeholder="For example, bitter leaf lowers blood sugar" /></label>
      <p>Enter a general claim, without personal health details. This analysis runs on your device.</p>
      <button type="submit" className="button" disabled={!claim.trim()}>Investigate the evidence</button>
      <details className="claim-examples"><summary>Try a claim</summary>{["Bitter leaf lowers blood sugar", "Neem lowers blood glucose", "Papaya increases platelet count", "Ginger increases gastric emptying"].map((example) => <button type="button" className="compare-secondary" key={example} onClick={() => { setClaim(example); setSubmitted(""); }}>{example}</button>)}</details>
    </form>
    {result && <section className="claim-results" aria-labelledby="claim-result">
      <h2 id="claim-result" tabIndex={-1} ref={heading}>From claim to evidence</h2>
      {result.blocked ? <p>Please use a general research claim. Ìtàn cannot provide dosing, diagnose a condition or replace advice from a qualified health professional.</p> : <>
        <p className="claim-original">“{submitted}”</p>
        <dl className="claim-trace">
          <dt>Botanical identity</dt><dd>{result.entities.taxa.length ? result.entities.taxa.map((taxon) => <Link key={taxon.id} href={`/plants/${taxon.id}`}><i>{taxon.name}</i> ↗ </Link>) : "No identity found in this collection"}</dd>
          <dt>Identity certainty</dt><dd>{result.entities.ambiguous ? "Ambiguous name; choose a species" : "Name match in the catalog; physical identity remains unverified"}</dd>
          <dt>Outcome</dt><dd>{result.outcome?.label ?? "Not identified; try naming the measured outcome"}</dd>
          <dt>Claimed direction</dt><dd>{result.direction ?? "Unclear"}</dd>
          <dt>Collection</dt><dd>Version {result.version} · {result.records.length} relevant records</dd>
        </dl>
        {result.needsClarification ? <p>Specify one plant and one outcome. An ambiguous name needs a species before the claim can be assessed.</p> : result.records.length ? <>
          <p>Results compare your claim with source-checked, outcome-level annotations. Exact plant identity, preparation, population and measured outcome determine applicability. Specialist review is pending.</p>
          {result.records.map(({ record, annotation, relation, explanation }, index) => <section className="claim-study" key={record.id}>
            <p className="claim-relation">{labels[relation]}</p><p>{explanation}</p>
            {annotation && <p><strong>Scope.</strong> {annotation.scope}</p>}
            <ResearchCard record={record} number={index + 1} />
          </section>)}
        </> : <p>No supporting outcome record was found in this collection. This does not establish that no research exists.</p>}
        <aside className="claim-caution"><strong>Bring questions to a qualified professional.</strong><p>Do not replace prescribed treatment or choose doses from these studies. Interaction evidence is incomplete, and pregnancy or breastfeeding safety requires specific evidence.</p></aside>
        <details className="claim-method"><summary>How this assessment works</summary><p>Ìtàn resolves catalog names and aliases, recognizes an outcome and direction, and selects records sharing the taxon and outcome. Directly annotated outcomes appear first. Rules compare measured direction and study scope, with abstention for missing or mismatched details. These relations are research aids and have not undergone independent clinical validation.</p></details>
      </>}
    </section>}
  </>;
}

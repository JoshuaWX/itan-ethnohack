"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { analyzeClaim } from "@/lib/claim-analysis";
import { claimQuestionState, studyRelationLanguage } from "@/lib/consumer-language";
import { ResearchCard } from "./research-card";
import { ResultGuide } from "./result-guide";

export function ClaimExplorer() {
  const [claim, setClaim] = useState("");
  const [submitted, setSubmitted] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const result = submitted ? analyzeClaim(submitted) : null;
  const questionState = result ? claimQuestionState(result) : "ready";
  return <>
    <form className="capture-surface" onSubmit={(event) => { event.preventDefault(); setSubmitted(claim.trim()); requestAnimationFrame(() => heading.current?.focus()); }}>
      <label className="scan-field">What have you heard about the plant?<textarea rows={3} maxLength={320} value={claim} onChange={(event) => setClaim(event.target.value)} placeholder="For example, bitter leaf lowers blood sugar" /></label>
      <p>Use one plant and one question at a time. Leave out personal health details.</p>
      <button type="submit" className="button" disabled={!claim.trim()}>Check the research</button>
      <details className="claim-examples"><summary>Try an example</summary>{["Bitter leaf lowers blood sugar", "Neem lowers blood glucose", "Papaya increases platelet count", "Ginger increases stomach emptying"].map((example) => <button type="button" className="compare-secondary" key={example} onClick={() => { setClaim(example); setSubmitted(""); }}>{example}</button>)}</details>
    </form>
    {result && <section className="claim-results" aria-labelledby="claim-result">
      <h2 id="claim-result" tabIndex={-1} ref={heading}>What the research here says</h2>
      <p className="claim-original">“{submitted}”</p>
      {result.blocked ? <ResultGuide found="This question needs a different kind of help." meaning="Ìtàn explains research. It cannot diagnose a condition, suggest a dose or choose treatment for you." unknown="We cannot assess your personal health or whether a product is suitable for you."><p>Ask a general question about a plant, or speak with a pharmacist or qualified healthcare professional.</p></ResultGuide> : <>
        <ResultGuide
          found={questionState === "plant-name" ? "We need a clearer plant name." : questionState === "one-effect" ? "Please ask about one effect at a time." : questionState === "unsupported-effect" ? "Ìtàn doesn’t have enough research to answer this." : result.records.length ? <>{result.records[0].record.plain.finding} <a href={result.records[0].record.url} target="_blank" rel="noreferrer">[1]</a></> : "We don’t have enough research here to answer this."}
          meaning={questionState === "plant-name" ? "We could not find one specific plant. Some names refer to different plants; others are missing from our library. Check the name below or search the library." : questionState === "one-effect" ? "Try one question, such as whether ginger changes how quickly food leaves the stomach." : questionState === "unsupported-effect" ? "This effect is outside the questions our small collection can check. Other research may exist; this result does not establish that a plant works or does not work." : result.records.length ? "Read each finding together with its limits below. Studies can reach different results or test different preparations." : "The question may be outside our small collection. Other research may exist."}
          unknown="These records cannot tell us whether a particular product will work or be safe for you."
        >{result.needsClarification || !result.records.length ? <Link className="source-link" href="/plants">Find the plant in our library ↗</Link> : <a className="source-link" href="#claim-studies">Read the findings below</a>}</ResultGuide>
        {result.records.length > 0 && <div id="claim-studies">
          <p className="review-note">Our team checked the linked sources. A botanist or pharmacist has not yet reviewed these summaries.</p>
          {result.records.map(({ record, annotation, relation, explanation }, index) => <section className="claim-study" key={record.id}>
            <p className="claim-relation">{studyRelationLanguage(relation, annotation?.direction === "unchanged")}</p>
            <ResearchCard record={record} number={index + 1} />
            <details className="claim-method"><summary>How this study relates to your question</summary><p>{explanation}</p>{annotation && <p><strong>What was tested.</strong> {annotation.scope}</p>}</details>
          </section>)}
        </div>}
        <details className="claim-method"><summary>How Ìtàn checked this</summary>
          <dl className="claim-trace">
            <dt>Plant names found</dt><dd>{result.entities.taxa.length ? result.entities.taxa.map((taxon) => <Link key={taxon.id} href={"/plants/" + taxon.id}><i>{taxon.name}</i> ↗ </Link>) : "No plant name found in our library"}</dd>
            <dt>Name check</dt><dd>{result.entities.ambiguous ? "This name can refer to different plants" : "Matched by name only; the physical plant has not been identified"}</dd>
            <dt>Effect mentioned</dt><dd>{result.outcome?.label ?? "Not recognised; describe one effect"}</dd>
            <dt>Change mentioned</dt><dd>{result.direction === "decrease" ? "A decrease" : result.direction === "increase" ? "An increase" : result.direction === "unchanged" ? "No change" : "Not clear"}</dd>
            <dt>Research edition</dt><dd>{result.version}</dd>
          </dl>
          <p>Ìtàn checks names and words in your question against our library, then compares them with recorded study findings. It checks the plant part, preparation and who or what was studied. This is a research aid, not a medical assessment.</p>
        </details>
        <aside className="claim-caution"><strong>Keep your healthcare professional involved.</strong><p>Do not change prescribed treatment based on these studies. Ask a pharmacist about herbal products taken with medicines, during pregnancy or while breastfeeding.</p></aside>
      </>}
    </section>}
  </>;
}

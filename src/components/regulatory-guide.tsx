"use client";
import { useState } from "react";

const examples = [
  { name: "Rhimza Hibiscus & Ginger Herbal Tea", number: "A7-2452L" },
  { name: "Libracin Moringa Plus", number: "A7-100998L" },
];

export function RegulatoryGuide() {
  const [number, setNumber] = useState("");
  const [status, setStatus] = useState("");
  const valid = /^[A-Za-z0-9][A-Za-z0-9-]{2,29}$/.test(number.trim());
  return <section className="capture-surface">
    <label className="scan-field">Registration number on the package<input maxLength={30} value={number} onChange={(event) => { setNumber(event.target.value); setStatus(""); }} placeholder="For example, A7-2452L" autoComplete="off" /></label>
    <p>Copy the number, then paste it into an official lookup. Ìtàn cannot confirm the result inside this page.</p>
    <button type="button" className="button" disabled={!valid} onClick={async () => {
      try { await navigator.clipboard.writeText(number.trim()); setStatus("Number copied. Open an official lookup and paste it into the registration-number field."); }
      catch { setStatus("Copy is unavailable. Select the number above and copy it manually."); }
    }}>Copy number</button><p role="status">{status}</p>
    <div className="research-links"><a className="source-link" href="https://registration.nafdac.gov.ng/" target="_blank" rel="noreferrer">Open NAPAMS verification ↗</a><a className="source-link" href="https://greenbook.nafdac.gov.ng/" target="_blank" rel="noreferrer">Open NAFDAC Greenbook ↗</a></div>
    <details className="claim-examples"><summary>Real source references to look up</summary>{examples.map((example) => <button className="compare-secondary" type="button" key={example.number} onClick={() => { setNumber(example.number); setStatus("Example selected. Confirm details and dates in the official source."); }}>{example.name} · {example.number}</button>)}</details>
  </section>;
}

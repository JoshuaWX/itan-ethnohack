"use client";
import { useState } from "react";

type Result = { id: string; label: string; text: string; url: string };
export function EvidenceExplorer({ initialPlant = "hibiscus" }: { initialPlant?: string }) {
  const [plant, setPlant] = useState(initialPlant);
  const [results, setResults] = useState<Result[] | null>(null);
  const [message, setMessage] = useState("");
  async function explore(topic: string) {
    setMessage("Finding cited evidence…");
    setResults(null);
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plant, topic }) });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json();
      setResults(data.records);
      setMessage(data.records.length ? `${data.mode === "gemini-selection" ? "Gemini-selected sources with curated summaries" : "Curated source summaries"} · expert review pending` : "No curated record for this question in our small collection. This does not establish that evidence is absent.");
    } catch { setMessage("Evidence is unavailable. Please try again or open the plant record."); }
  }
  return <section className="detail-section"><p className="overline">Explore the evidence</p><h2>Ask about a plant</h2><p>Choose a plant and a topic to see a curated, cited summary. Please do not enter personal health information.</p><label htmlFor="evidence-plant">Plant</label><select id="evidence-plant" value={plant} onChange={(event) => { setPlant(event.target.value); setResults(null); setMessage(""); }}><option value="hibiscus">Roselle</option><option value="ginger">Ginger</option><option value="guava">Guava</option><option value="cinnamon-verum">Ceylon cinnamon</option><option value="cinnamon-cassia">Java cinnamon</option></select><div className="evidence-actions"><button type="button" onClick={() => explore("traditional")}>What is documented traditional use?</button><button type="button" onClick={() => explore("research")}>What research is available?</button></div><p role="status">{message}</p>{results?.map((record) => <article className="evidence" key={record.id}><span className="evidence-label">{record.label}</span><p>{record.text}</p><a className="source-link" href={record.url} target="_blank" rel="noreferrer">Read the source ↗</a></article>)}</section>;
}

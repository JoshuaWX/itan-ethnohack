"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Answer = { text: string; href: string; label: string };
type Evidence = { id: string; label: string; text: string; url: string };
function guidance(question: string, path: string): Answer {
  const value = question.toLowerCase();
  if (/diagnos|pregnan|dose|dosage|treat me|my medicine|safe for me|should i (take|use)/.test(value)) return { text: "Ìtàn cannot give personal medical advice or determine whether a product is safe for you. Please speak with a qualified health professional.", href: "/awareness", label: "Read public health guidance" };
  if (/manufactur|register|nafdac|authentic/.test(value)) return { text: "Manufacturers can use Ìtàn to explore ingredient names and evidence. A record match does not authenticate a package or establish regulatory approval. Check the official NAFDAC database for regulatory information.", href: "/#explore", label: "Find product information" };
  if (/identify|photo|photograph|picture|living plant/.test(value)) return { text: "Choose Identify a plant, add a clear photo, select the part shown and consent to processing by Pl@ntNet. Results are suggestions and do not establish safety.", href: "/identify", label: "Identify a plant" };
  if (/scan|label|ocr|unidentified|correct/.test(value)) return { text: "On Compare, choose a label photo. Read the original transcription, correct the ingredient list and confirm it. You can also type ingredients manually.", href: "/compare#scan", label: "Scan or enter ingredients" };
  if (/compare|overlap|shared|interaction/.test(value)) return { text: "Enter ingredients for two or three products and choose Compare. Possible name matches are uncertain. A shared ingredient does not by itself establish an interaction; missing evidence does not establish safety.", href: "/compare", label: "Compare products" };
  if (/disease|cholera|malaria|outbreak|guidance/.test(value) || path.startsWith("/awareness")) return { text: "The awareness page separates official health guidance from plant research. The cholera advisory shown is archived, and laboratory findings do not establish a treatment.", href: "/awareness", label: "Explore awareness" };
  if (/evidence|research|scientific|plant|herb/.test(value) || path.startsWith("/plants/")) return { text: "Plant pages show names, sources and evidence limitations. Open the cited source for details and distinguish traditional use from laboratory and human research.", href: path.startsWith("/plants/") ? path : "/plants", label: "Explore plant evidence" };
  if (/what|how|start|help|purpose|about|use/.test(value)) return { text: "Ìtàn helps you explore medicinal plant names, read herbal-product ingredients, compare labels and find cited research. Start with one of the main actions.", href: "/", label: "Explore the guide" };
  return { text: "I can help you navigate Ìtàn and understand its evidence labels. Try asking how to scan a label or compare products.", href: "/compare", label: "Explore comparison" };
}

export function AskItan() {
  const pathname = usePathname();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [status, setStatus] = useState("");
  async function ask() {
    const input = question.trim();
    if (!input) return;
    setEvidence([]); setStatus("");
    const response = guidance(input, pathname);
    setAnswer(response);
    const plant = pathname.match(/^\/plants\/(hibiscus|ginger|guava|cinnamon-verum|cinnamon-cassia)$/)?.[1];
    if (!plant || !/evidence|research|study|studies|traditional/.test(input.toLowerCase()) || /diagnos|pregnan|dose|treat me|safe for me|my medicine/.test(input.toLowerCase())) return;
    setStatus("Finding sources…");
    try {
      const result = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plant, topic: /traditional/.test(input.toLowerCase()) ? "traditional" : "research" }) });
      if (!result.ok) throw new Error("unavailable");
      const data = await result.json(); setEvidence(data.records);
      setStatus(data.records.length ? "Curated source summary · expert review pending" : "No curated evidence for this topic in the collection.");
    } catch { setStatus("Evidence is unavailable. Please use the links on the plant page."); }
  }
  return <details className="ask-itan"><summary>Ask Ìtàn</summary><div className="ask-panel"><h2>How can I help?</h2><p>Ask about using Ìtàn. Don’t include personal health information. Navigation guidance runs on your device. For plant evidence, the plant name and topic may be sent to Gemini; your question is not sent.</p><form onSubmit={(event) => { event.preventDefault(); void ask(); }}><label htmlFor="ask-question">Your question</label><textarea id="ask-question" rows={2} maxLength={300} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="How do I compare products?" /><button type="submit">Ask</button></form>{answer && <div role="status"><p>{answer.text}</p><Link href={answer.href}>{answer.label} ↗</Link></div>}<p role="status">{status}</p>{evidence.map((item) => <article key={item.id}><strong>{item.label}</strong><p>{item.text}</p><a href={item.url} target="_blank" rel="noreferrer">Read the source ↗</a></article>)}<p className="ask-note">For scientific details, open the cited evidence on a plant page.</p></div></details>;
}

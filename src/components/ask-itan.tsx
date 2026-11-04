"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { ResearchCard } from "./research-card";
import { maxQuestionLength, questionBlocked, retrieveEvidence } from "@/lib/research-retrieval";
import type { ResearchRecord } from "@/lib/research-collection";
import type { Claim } from "@/lib/research-answer";

type Comparison = { ids: string[]; summary: string };
type Reply = { mode: "curated" | "generated" | "restricted" | "no-evidence"; records: ResearchRecord[]; claims?: Claim[]; reason?: string; ambiguous?: boolean; version?: string };
type Turn = { question: string; reply?: Reply; guidance?: { text: string; href: string; label: string } };
const openEvent = "itan:ask";
const comparisonEvent = "itan:comparison";

export function shareComparison(value: Comparison | null) {
  window.dispatchEvent(new CustomEvent(comparisonEvent, { detail: value }));
}

export function AskTrigger({ className, label = "Ask Ìtàn" }: { className?: string; label?: string }) {
  return <button type="button" className={className} onClick={(event) => window.dispatchEvent(new CustomEvent(openEvent, { detail: event.currentTarget }))}>{label} <ArrowUpRight size={15} aria-hidden="true" /></button>;
}

function navigation(question: string, path: string, comparison: Comparison | null): Turn["guidance"] {
  const text = question.toLowerCase();
  if (path === "/compare" && /\b(?:share|shared|overlap|in common|ambiguous|unresolved|match)\b/.test(text) && !/\b(?:study|research|interaction|evidence)\b/.test(text)) return { text: comparison?.summary ?? "Run a comparison first to see which names match and where the label is ambiguous.", href: "/compare#scan", label: "Return to comparison" };
  if (!/^(?:how (?:do|can|to|should)|where (?:is|can|do)|help me|what can (?:i|manufacturers|ìtàn|itan))\b/.test(text)) return;
  if (/manufactur|register|nafdac|authentic/.test(text)) return { text: "Use Ìtàn to explore ingredient names and evidence. For regulatory checks, consult NAFDAC. A record match cannot authenticate the physical package.", href: "/#explore", label: "Explore product records" };
  if (/identify|photograph|photo of a plant|picture/.test(text)) return { text: "Open Identify a plant, add a clear photo, check the preview and consent before submitting. You can search the plant collection by name instead.", href: "/identify", label: "Identify a plant" };
  if (/scan|ocr|label|correct/.test(text)) return { text: "Photograph the ingredient list, then review and correct the extracted text before confirming it. You can also type the ingredients.", href: "/scan", label: "Scan or enter ingredients" };
  if (/compar/.test(text)) return { text: "Enter the ingredients from two or three labels and choose Compare ingredients. Ìtàn groups shared taxa, possible matches and unresolved names.", href: "/compare", label: "Compare products" };
  if (/start|navigate|use ìtàn|use itan|what can (?:ìtàn|itan)/.test(text)) return { text: "Start with a plant photo or a herbal product label. You can compare labels or browse plant studies by name.", href: "/", label: "Back to Discover" };
}

const exampleQuestions = (path: string) => path.startsWith("/plants/") ? ["What has been studied?", "Which studies were in humans?"]
  : path === "/compare" ? ["What do these products have in common?", "What research is available?"]
  : path.startsWith("/awareness") ? ["What does NCDC say about cholera?", "What does WHO say about Artemisia?"]
  : path.startsWith("/products/") ? ["What research is available on these ingredients?", "How do I scan a label?"]
  : path === "/identify" ? ["How do I identify a plant?", "What research exists on ginger?"]
  : path === "/scan" ? ["How do I scan a label?", "How do I compare products?"]
  : ["What research exists on ginger?", "How do I scan a label?"];

function ReplyView({ reply }: { reply: Reply }) {
  if (reply.mode === "restricted") return <p>Ask a general research question without personal details. For diagnosis, treatment, dosage or medication safety, speak with a qualified health professional.</p>;
  if (reply.mode === "no-evidence") return <p>I found no supporting record in this collection. Try a plant name or a study identifier, or <Link href="/plants">browse the plants</Link>.</p>;
  const reason = reply.ambiguous ? "This name can refer to more than one species. Choose a plant below to narrow your question."
    : reply.reason === "quota" ? "The demo AI limit has been reached. Here are the curated sources."
    : reply.reason === "provider-unavailable" ? "AI explanations are unavailable. Here are the curated sources."
    : reply.reason === "unverified-answer" ? "An AI answer could not be verified. Here are the curated sources."
    : reply.reason === "offline" ? "Using the bundled evidence collection."
    : "Results from the curated evidence collection.";
  return <>
    {reply.mode === "generated" ? <><p className="research-meta">AI explanation based on the cited records</p><ul className="ask-claims">{reply.claims?.map((claim, index) => <li key={index}>{claim.text} <strong>{claim.sourceIds.map((id) => `[${reply.records.findIndex((record) => record.id === id) + 1}]`).join(" ")}</strong></li>)}</ul></> : <p>{reason}</p>}
    <p className="research-meta">{reply.version && `Collection v${reply.version} · `}Specialist review pending</p>
    {reply.records.map((record, index) => <ResearchCard key={record.id} record={record} number={index + 1} />)}
  </>;
}

export function AskItan() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [consent, setConsent] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const comparison = useRef<Comparison | null>(null);
  const request = useRef<AbortController | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  const lastTurn = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (event: Event) => {
      opener.current = (event as CustomEvent<HTMLElement>).detail;
      setOpen(true);
    };
    const update = (event: Event) => { comparison.current = (event as CustomEvent<Comparison | null>).detail; };
    window.addEventListener(openEvent, show);
    window.addEventListener(comparisonEvent, update);
    return () => {
      window.removeEventListener(openEvent, show);
      window.removeEventListener(comparisonEvent, update);
      request.current?.abort();
    };
  }, []);
  useEffect(() => {
    const panel = dialog.current;
    if (!panel) return;
    if (!open) { if (panel.open) panel.close(); return; }
    const mobile = window.matchMedia("(max-width: 700px)");
    function show() {
      if (!panel) return;
      if (panel.open) panel.close();
      if (mobile.matches) panel.showModal();
      else panel.show();
      heading.current?.focus();
    }
    show();
    mobile.addEventListener("change", show);
    return () => mobile.removeEventListener("change", show);
  }, [open]);
  useEffect(() => {
    const panel = conversation.current;
    const turn = lastTurn.current;
    if (panel && turn) panel.scrollTop += turn.getBoundingClientRect().top - panel.getBoundingClientRect().top - 10;
  }, [turns, open]);

  function reset() {
    request.current?.abort();
    request.current = null;
    setTurns([]);
    setQuestion("");
    setBusy(false);
  }
  function close() {
    dialog.current?.close();
    setOpen(false);
    const target = opener.current?.isConnected ? opener.current : button.current;
    target?.focus();
  }

  function renderTurn(turn: Turn) {
    return <>
      {turn.guidance && <div><p>{turn.guidance.text}</p><Link href={turn.guidance.href}>{turn.guidance.label} ↗</Link></div>}
      {turn.reply && <ReplyView reply={turn.reply} />}
    </>;
  }

  async function ask(input: string) {
    const prompt = input.trim();
    if (!prompt || request.current) return;
    setQuestion("");
    const add = (turn: Turn) => setTurns((current) => [...current.slice(-2), turn]);
    if (questionBlocked(prompt)) {
      add({ question: "General research questions only", reply: { mode: "restricted", records: [] } });
      return;
    }
    const context = path === "/compare" ? comparison.current : null;
    const guide = navigation(prompt, path, context);
    if (guide) { add({ question: prompt, guidance: guide }); return; }
    const priorIds = [...turns].reverse().find((turn) => turn.reply?.records.length)?.reply?.records.map(({ id }) => id) ?? [];
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    try {
      const hash = path === "/awareness" && ["#outbreak", "#seasonal"].includes(location.hash) ? location.hash : "";
      const response = await fetch("/api/assistant", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ question: prompt, consent, path: path + hash, comparisonIds: context?.ids ?? [], priorIds }),
      });
      if (!response.ok) throw new Error("unavailable");
      const reply = await response.json() as Reply;
      if (!controller.signal.aborted) add({ question: prompt, reply });
    } catch {
      if (!controller.signal.aborted) {
        const { records, ambiguous } = retrieveEvidence(prompt, { taxonIds: path.startsWith("/plants/") ? [path.slice(8)] : context?.ids, priorIds });
        add({ question: prompt, reply: { mode: records.length ? "curated" : "no-evidence", records, ambiguous, reason: "offline" } });
      }
    } finally {
      if (request.current === controller) { request.current = null; setBusy(false); }
    }
  }

  return <div className="ask-itan" onKeyDown={(event) => { if (event.key === "Escape" && open) close(); }}>
    <button type="button" className="ask-launch" aria-expanded={open} aria-controls="ask-panel" ref={button} onClick={(event) => { if (open) close(); else { opener.current = event.currentTarget; setOpen(true); } }}><MessageCircle size={17} aria-hidden="true" /> Ask Ìtàn</button>
    <dialog ref={dialog} className="ask-panel" id="ask-panel" aria-labelledby="ask-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => {
      if (event.target instanceof Element && event.target.closest('a[href^="/"]') && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) close();
    }}>
      <div className="ask-header"><h2 id="ask-title" ref={heading} tabIndex={-1}>Ask Ìtàn</h2><button type="button" className="ask-close" onClick={close} aria-label="Close Ask Ìtàn"><X size={20} /></button></div>
      <div className="ask-conversation" ref={conversation} aria-live="polite" tabIndex={0} aria-label="Conversation">
        {!turns.length && <div className="ask-intro"><h3>What would you like to explore?</h3><p>Pick a question or ask your own about plants, labels or evidence.</p><div className="ask-suggestions">{exampleQuestions(path).map((example) => <button key={example} type="button" disabled={busy} onClick={() => void ask(example)}>{example}<ArrowUpRight size={16} aria-hidden="true" /></button>)}</div></div>}
        {turns.map((turn, index) => index === turns.length - 1 ? <div className="ask-turn" key={`${index}-${turn.question}`} ref={lastTurn}><p className="ask-question-text">{turn.question}</p>{renderTurn(turn)}</div> : <details className="ask-previous" key={`${index}-${turn.question}`}><summary>{turn.question}</summary>{renderTurn(turn)}</details>)}
        {busy && <p role="status">Finding relevant evidence…</p>}
      </div>
      <form className="ask-form" onSubmit={(event) => { event.preventDefault(); void ask(question); }}>
        <div className="ask-privacy"><label><input type="checkbox" checked={consent} aria-describedby="ask-consent-info" onChange={(event) => { setConsent(event.target.checked); if (!event.target.checked) reset(); }} /> Allow Google Gemini to explain evidence</label><p id="ask-consent-info">Sends your question and selected evidence to Google when enabled. Turning it off clears this conversation.</p></div>
        <label htmlFor="ask-question">Your question</label>
        <div className="ask-compose"><textarea id="ask-question" rows={2} maxLength={maxQuestionLength} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask about a plant or study" aria-describedby="ask-private-note" /><button className="button" type="submit" disabled={busy || !question.trim()}>Ask</button></div>
        <p className="ask-note" id="ask-private-note">Leave out personal or medical details.</p>
        {turns.length > 0 && <button type="button" className="ask-clear" onClick={reset}>Clear conversation</button>}
      </form>
    </dialog>
  </div>;
}

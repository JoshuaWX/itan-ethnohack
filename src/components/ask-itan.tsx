"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { ResearchCard } from "./research-card";
import { maxQuestionLength, questionBlocked, retrieveEvidence } from "@/lib/research-retrieval";
import type { ResearchRecord } from "@/lib/research-collection";
import type { Claim } from "@/lib/research-answer";
import { ResultGuide } from "./result-guide";
import { taxa } from "@/lib/catalog";
import { isGettingStartedQuestion, studyRelationLanguage, verdictHeadline } from "@/lib/consumer-language";
import type { Relation, VerdictLevel } from "@/lib/claim-analysis";

type Comparison = { ids: string[]; summary: string };
type Reply = { mode: "curated" | "generated" | "restricted" | "no-evidence"; records: ResearchRecord[]; claims?: Claim[]; reason?: string; ambiguous?: boolean; version?: string; assessment?: { outcome?: string; verdict?: VerdictLevel; studies: { id: string; relation: string; explanation: string }[] } };
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
  if (path === "/compare" && /\b(?:share|shared|overlap|in common|ambiguous|unresolved|match)\b/.test(text) && !/\b(?:study|research|interaction|evidence)\b/.test(text)) return { text: comparison?.summary ?? "Add two ingredient lists and choose Compare ingredients first. I can then explain which names they share and which need checking.", href: "/compare#scan", label: "Return to comparison" };
  if (!/^(?:how (?:do|can|to|should)|where (?:is|can|do)|help me|what can (?:i|manufacturers|ìtàn|itan))\b/.test(text)) return;
  if (/manufactur|register|nafdac|authentic/.test(text)) return { text: "Use NAFDAC’s official website to check a registration number. A matching number does not prove the package is genuine. Ìtàn can help you understand the listed ingredients and research.", href: "/verify", label: "Open the NAFDAC check guide" };
  if (/claim|prove|evidence behind/.test(text)) return { text: "Type something you have heard about one plant, such as bitter leaf lowers blood sugar. Ìtàn will show relevant studies and explain their limits.", href: "/claims", label: "Check a plant claim" };
  if (/identify|photograph|photo of a plant|picture/.test(text)) return { text: "Open Identify a plant, add a clear photo, check the preview and consent before submitting. You can search the plant collection by name instead.", href: "/identify", label: "Identify a plant" };
  if (/scan|ocr|label|correct/.test(text)) return { text: "Photograph the ingredient list, then review and correct the extracted text before confirming it. You can also type the ingredients.", href: "/scan", label: "Scan or enter ingredients" };
  if (/compar/.test(text)) return { text: "Add the ingredients from two or three labels, then choose Compare ingredients. You’ll see names they share, differences and names that need checking. You can try the example products first.", href: "/compare", label: "Compare products" };
  if (/start|navigate|use ìtàn|use itan|what can (?:ìtàn|itan)/.test(text)) return { text: "Have a plant? Choose Identify a plant and add a photo. Have a product? Choose Scan a herbal product to read its label. Choose Compare products to compare two ingredient lists. You can also search the plant library by name.", href: "/", label: "Go to Home" };
}

const exampleQuestions = (path: string) => path.startsWith("/plants/") ? ["What has been studied?", "Which studies were in humans?"]
  : path === "/compare" ? ["What do these products have in common?", "What research is available?"]
  : path.startsWith("/awareness") ? ["What does NCDC say about cholera?", "What does WHO say about Artemisia?"]
  : path.startsWith("/products/") ? ["What research is available on these ingredients?", "How do I scan a label?"]
  : path === "/identify" ? ["How do I identify a plant?", "What research exists on ginger?"]
  : path === "/scan" ? ["How do I scan a label?", "How do I compare products?"]
  : ["How do I use Ìtàn?", "Bitter leaf lowers blood sugar", "How do I scan a label?"];

function ReplyView({ reply }: { reply: Reply }) {
  if (reply.mode === "restricted") return <ResultGuide found="This question needs a healthcare professional." meaning="I can explain research, but cannot diagnose, suggest doses or decide whether a product is safe for you." unknown="Ìtàn cannot assess your personal health or treatment."><p>Ask a pharmacist or qualified healthcare professional. You can still ask general questions about plant research.</p></ResultGuide>;
  if (reply.mode === "no-evidence") return <ResultGuide found="Ìtàn doesn’t have enough research to answer this." meaning="Other research may exist. Our library covers a small number of plants and questions." unknown="A missing result does not tell us that a plant works, does not work or is safe."><Link href="/plants">Find a plant in the library</Link><p>Try its name and one specific question.</p></ResultGuide>;
  const reason = reply.reason === "quota" ? "The demo’s daily AI limit has been reached. You can still read our research summaries."
    : reply.reason === "provider-unavailable" ? "AI explanations are unavailable. You can still read our research summaries."
    : reply.reason === "unverified-answer" ? "We couldn’t confirm that the AI answer matched its sources. Here are the research summaries instead."
    : reply.reason === "offline" ? "The online service could not be reached. Here are research summaries saved with this demo."
    : "";
  const plants = taxa.filter((plant) => reply.records.some((record) => record.taxa.includes(plant.id)));
  return <>
    {reason && <p className="status-note">{reason}</p>}
    {reply.mode === "generated" && <p className="research-meta">AI explanation based on the sources below</p>}
    <ResultGuide found={<><p className="claim-relation">{reply.assessment?.verdict ? verdictHeadline(reply.assessment.verdict) : reply.mode === "generated" ? "AI explanation based on the sources below" : "Research summaries from this library"}</p><ul className="ask-claims">{reply.mode === "generated" ? reply.claims?.map((claim, index) => <li key={index}>{claim.text} {claim.sourceIds.map((id) => {
      const number = reply.records.findIndex((record) => record.id === id);
      return number >= 0 && <a key={id} href={reply.records[number].url} target="_blank" rel="noreferrer" aria-label={`Read source ${number + 1}`}>[{number + 1}] </a>;
    })}</li>) : reply.records.slice(0, 3).map((record, index) => <li key={record.id}><strong>{record.type === "animal" ? "Studied in animals: " : record.type === "laboratory" ? "Laboratory tests: " : record.type === "ethnobotanical" || record.type === "traditional" ? "Traditional use: " : ""}</strong>{record.plain.finding} <a href={record.url} target="_blank" rel="noreferrer" aria-label={`Read source ${index + 1}`}>[{index + 1}]</a><p className="answer-limit">{record.plain.limitation}</p></li>)}</ul></>}
      meaning={reply.ambiguous ? "This name can refer to different plants. Choose a plant below before drawing conclusions." : "Each finding applies to the people, plant parts and preparations studied. It may not apply to a product you have."}
      unknown="These records cannot tell us whether a product is suitable or safe for you. Expert review of our summaries is still pending."
    ><div className="research-links">{plants.map((plant) => <Link key={plant.id} href={`/plants/${plant.id}`}>About {plant.common} ↗</Link>)}{!plants.length && <Link href="/awareness">Read official health guidance ↗</Link>}</div></ResultGuide>
    <details className="ask-source-details"><summary>Read the studies and source details ({reply.records.length})</summary>
      <p className="research-meta">Research edition {reply.version ?? "saved with this demo"}. Original sources checked; botanist or pharmacist review pending.</p>
      {reply.assessment && <details className="claim-method"><summary>How these studies relate to the question</summary>{reply.assessment.outcome && <p>Effect mentioned: {reply.assessment.outcome}.</p>}{reply.assessment.verdict && <p>Overall reading: {verdictHeadline(reply.assessment.verdict)}.</p>}{reply.assessment.studies.filter((row) => reply.records.some(({ id }) => id === row.id)).map((row) => <p key={row.id}><strong>{studyRelationLanguage(row.relation as Relation)}</strong> · {row.explanation}</p>)}<Link href="/claims">Check a plant claim ↗</Link></details>}
      {reply.records.map((record, index) => <ResearchCard key={record.id} record={record} number={index + 1} />)}
    </details>
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
    if (isGettingStartedQuestion(prompt)) {
      add({ question: prompt, guidance: { text: "Have a plant? Choose Identify a plant and add a photo. Have a product? Choose Scan a herbal product to read its label. Choose Compare products to compare two ingredient lists. You can also search the plant library by name.", href: "/", label: "Go to Home" } });
      return;
    }
    if (questionBlocked(prompt)) {
      add({ question: "Question not sent", reply: { mode: "restricted", records: [] } });
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
        {!turns.length && <div className="ask-intro"><h3>What would you like help with?</h3><p>I can help you use Ìtàn or explain the research in our small plant library. Choose a question to get started.</p><div className="ask-suggestions">{exampleQuestions(path).map((example) => <button key={example} type="button" disabled={busy} onClick={() => void ask(example)}>{example}<ArrowUpRight size={16} aria-hidden="true" /></button>)}</div></div>}
        {turns.map((turn, index) => index === turns.length - 1 ? <div className="ask-turn" key={`${index}-${turn.question}`} ref={lastTurn}><p className="ask-question-text">{turn.question}</p>{renderTurn(turn)}</div> : <details className="ask-previous" key={`${index}-${turn.question}`}><summary>{turn.question}</summary>{renderTurn(turn)}</details>)}
        {busy && <p role="status">Looking through the research…</p>}
      </div>
      <form className="ask-form" onSubmit={(event) => { event.preventDefault(); void ask(question); }}>
        <div className="ask-privacy"><label><input type="checkbox" checked={consent} aria-describedby="ask-consent-info" onChange={(event) => { setConsent(event.target.checked); if (!event.target.checked) reset(); }} /> Use AI explanations (optional)</label><p id="ask-consent-info">When on, your question and selected research go to Google Gemini. Turn off to withdraw consent and clear the chat. Research summaries work without AI.</p></div>
        <label htmlFor="ask-question">Your question</label>
        <div className="ask-compose"><textarea id="ask-question" rows={2} maxLength={maxQuestionLength} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="For example, what has been studied about ginger?" aria-describedby="ask-private-note" /><button className="button" type="submit" disabled={busy || !question.trim()}>Ask</button></div>
        <p className="ask-note" id="ask-private-note">Leave out personal health details. For treatment or doses, ask a qualified healthcare professional.</p>
        {turns.length > 0 && <button type="button" className="ask-clear" onClick={reset}>Clear conversation</button>}
      </form>
    </dialog>
  </div>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PhotoPicker } from "./photo-picker";
import { ResultGuide } from "./result-guide";

type Candidate = { name: string; common: string; score: number; match: { kind: string; candidates: { id: string; name: string }[] } };

export function IdentifyPlant() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [organ, setOrgan] = useState("auto");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const [availability, setAvailability] = useState<"checking" | "available" | "unavailable">("checking");
  const heading = useRef<HTMLHeadingElement>(null);

  async function checkAvailability(signal?: AbortSignal) {
    setAvailability("checking");
    try {
      const response = await fetch("/api/identify", { cache: "no-store", signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000) });
      const data = await response.json();
      if (!signal?.aborted) setAvailability(response.ok && data.available === true ? "available" : "unavailable");
    } catch { if (!signal?.aborted) setAvailability("unavailable"); }
  }
  useEffect(() => {
    const controller = new AbortController();
    void checkAvailability(controller.signal);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => { if (results.length) heading.current?.focus(); }, [results]);

  function pick(photo: File) {
    if (availability !== "available") return;
    if (!photo.size || photo.size > 12 * 1024 * 1024 || !["image/jpeg", "image/png"].includes(photo.type)) {
      setMessage("Choose a JPEG or PNG under 12 MB.");
      return;
    }
    setResults([]);
    setConsent(false);
    setMessage("");
    setFile(photo);
  }

  async function identify() {
    if (!file || !consent || busy) return;
    setBusy(true);
    setResults([]);
    setMessage("Preparing your photo…");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      try {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("image");
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      } finally {
        bitmap.close();
      }
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
      if (!blob) throw new Error("image");
      const form = new FormData();
      form.append("image", blob, "plant.jpg");
      form.append("organ", organ);
      form.append("consent", "yes");
      setMessage("Finding possible matches…");
      const response = await fetch("/api/identify", { method: "POST", body: form, signal: AbortSignal.timeout(22000) });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Photo identification is unavailable. You can still search for a plant by name below.");
        return;
      }
      setResults([...data.candidates as Candidate[]].sort((a, b) => b.score - a.score));
      setMessage(data.candidates.length ? "" : "No possible matches found. Try a different photo or search by name.");
    } catch {
      setMessage("Could not read or send this photo. Try another image or search by name.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <section className="identify-panel capture-surface" aria-labelledby="identify-capture">
      <h2 id="identify-capture">{file ? "Review your photo" : "Add a plant photo"}</h2>
      <p>Use daylight and fill the frame with one leaf, flower or fruit.</p>
      {availability === "checking" && <p role="status">Checking photo identification before you choose a photo…</p>}
      {availability === "unavailable" && <div className="capture-tip"><p>Live photo identification is unavailable right now. You can still search our plant library by name. You do not need to upload a photo.</p><button className="compare-secondary" type="button" onClick={() => void checkAvailability()}>Check availability again</button></div>}
      {preview && <img className="identify-preview" src={preview} alt="Selected plant photo preview" onError={() => {
        setFile(null);
        setPreview("");
        setConsent(false);
        setMessage("This image could not be opened. Try another JPEG or PNG.");
      }} />}
      <PhotoPicker accept="image/jpeg,image/png" disabled={busy || availability !== "available"} replacing={Boolean(file)} onPick={pick} />
      {file && <fieldset className="identify-options" disabled={busy}>
        <label htmlFor="organ">Which part is shown?</label>
        <select id="organ" value={organ} onChange={(event) => setOrgan(event.target.value)}><option value="auto">Not sure</option><option value="leaf">Leaf</option><option value="flower">Flower</option><option value="fruit">Fruit</option><option value="bark">Bark</option></select>
        <label className="identify-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>I agree to send this photo to Pl@ntNet for identification. Internet is required. Ìtàn does not store the photo.</span></label>
        {!consent && <p>Tick the box above when you are ready to send this photo.</p>}
        <button type="button" className="button" disabled={!consent || busy} onClick={identify}>{busy ? "Looking for the plant…" : "Identify this photo"}</button>
      </fieldset>}
      <p role="status">{message}</p>
      <Link className="source-link" href="/plants">Search the plant library by name ↗</Link>
    </section>
    {results.length > 0 && <section className="identify-results detail-section" aria-labelledby="identify-results">
      <h2 id="identify-results" ref={heading} tabIndex={-1}>Plants your photo may show</h2>
      <ResultGuide found={`${results.length} possible ${results.length === 1 ? "plant" : "plants"}, with the closest photo match first.`} meaning="These are suggestions from the photo, not a confirmed identification." unknown="A photo cannot tell us whether the plant is safe to eat or use."><p>Compare the names below. Open a plant page to read its research, or try a clearer photo above.</p></ResultGuide>
      <ol>{results.map((result, index) => <li className="identify-candidate" key={`${result.name}-${index}`}>
        <h3>{result.common || <i>{result.name}</i>}</h3>
        {result.common && <p><i>{result.name}</i></p>}
        <details><summary>Photo match details</summary><p>Photo match score: {(result.score * 100).toFixed(1)}%. This is the service’s ranking score, not a guarantee that the plant was correctly identified.</p></details>
        {result.match.candidates.length ? result.match.candidates.map((candidate) => <Link className="source-link" href={`/plants/${candidate.id}#research`} key={candidate.id}>Read about {result.common || candidate.name} ↗</Link>) : <p>We don’t yet have a research page for this plant. Try searching its name in the library.</p>}
      </li>)}</ol>
    </section>}
  </>;
}

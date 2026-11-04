"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PhotoPicker } from "./photo-picker";

type Candidate = { name: string; common: string; score: number; match: { kind: string; candidates: { id: string; name: string }[] } };

export function IdentifyPlant() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [organ, setOrgan] = useState("auto");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => { if (results.length) heading.current?.focus(); }, [results]);

  function pick(photo: File) {
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
      const response = await fetch("/api/identify", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Identification is unavailable. Try manual search.");
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
      {preview && <img className="identify-preview" src={preview} alt="Selected plant photo preview" onError={() => {
        setFile(null);
        setPreview("");
        setConsent(false);
        setMessage("This image could not be opened. Try another JPEG or PNG.");
      }} />}
      <PhotoPicker accept="image/jpeg,image/png" disabled={busy} replacing={Boolean(file)} onPick={pick} />
      {file && <fieldset className="identify-options" disabled={busy}>
        <label htmlFor="organ">Which part is shown?</label>
        <select id="organ" value={organ} onChange={(event) => setOrgan(event.target.value)}><option value="auto">Not sure</option><option value="leaf">Leaf</option><option value="flower">Flower</option><option value="fruit">Fruit</option><option value="bark">Bark</option></select>
        <label className="identify-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> <span>I agree to send this photo to Pl@ntNet for identification. Internet is required. Ìtàn does not store the photo.</span></label>
        <button type="button" className="button" disabled={!consent || busy} onClick={identify}>{busy ? "Identifying…" : "Find possible plants"}</button>
      </fieldset>}
      <p role="status">{message}</p>
      <Link className="source-link" href="/plants">Search the plant library by name ↗</Link>
    </section>
    {results.length > 0 && <section className="identify-results detail-section" aria-labelledby="identify-results">
      <h2 id="identify-results" ref={heading} tabIndex={-1}>Possible matches</h2>
      <p>Photo matches are suggestions. A photo cannot establish that a plant is safe to consume.</p>
      <ol>{results.map((result, index) => <li className="identify-candidate" key={`${result.name}-${index}`}>
        <h3>{result.common || <i>{result.name}</i>}</h3>
        {result.common && <p><i>{result.name}</i></p>}
        <p className="research-meta">Provider match score: {(result.score * 100).toFixed(1)}%. Species identity remains uncertain.</p>
        {result.match.candidates.length ? result.match.candidates.map((candidate) => <Link className="source-link" href={`/plants/${candidate.id}#research`} key={candidate.id}>Explore evidence for <i>{candidate.name}</i> ↗</Link>) : <p>This candidate is outside the Ìtàn collection.</p>}
      </li>)}</ol>
    </section>}
  </>;
}

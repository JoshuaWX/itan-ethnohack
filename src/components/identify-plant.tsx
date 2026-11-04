"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Candidate = { name: string; common: string; score: number; match: { kind: string; candidates: { id: string; name: string }[] } };
export function IdentifyPlant() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [organ, setOrgan] = useState("auto");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [results, setResults] = useState<Candidate[]>([]);
  useEffect(() => { if (!file) { setPreview(""); return; } const url = URL.createObjectURL(file); setPreview(url); return () => URL.revokeObjectURL(url); }, [file]);
  async function identify() {
    if (!file || !consent) return;
    setBusy(true); setResults([]); setMessage("Preparing your photo…");
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("image"); ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
      if (!blob) throw new Error("image");
      const form = new FormData(); form.append("image", blob, "plant.jpg"); form.append("organ", organ); form.append("consent", "yes");
      setMessage("Finding possible matches…");
      const response = await fetch("/api/identify", { method: "POST", body: form }); const data = await response.json();
      if (!response.ok) { setMessage(data.error || "Identification is unavailable. Try manual search."); return; }
      setResults(data.candidates); setMessage(data.candidates.length ? "Possible matches, not a confirmed identification." : "No species candidates found. Try another photo or manual search.");
    } catch { setMessage("Could not read or send this photo. Try another image or search manually."); }
    finally { setBusy(false); }
  }
  return <section className="identify-panel"><label htmlFor="plant-image">Choose or photograph a plant</label><p className="capture-tip" id="plant-photo-tip">Use daylight and fill the frame with one leaf, flower or fruit.</p><input id="plant-image" aria-describedby="plant-photo-tip" type="file" accept="image/jpeg,image/png" capture="environment" onChange={(event) => { const next = event.target.files?.[0]; setResults([]); setConsent(false); if (next && next.size <= 12 * 1024 * 1024 && ["image/jpeg", "image/png"].includes(next.type)) { setFile(next); setMessage(""); } else { setFile(null); setMessage("Choose a JPEG or PNG under 12 MB."); } }} />{preview && <img className="identify-preview" src={preview} alt="Selected plant photo preview" />}
    <label htmlFor="organ">Which part is shown?</label><select id="organ" value={organ} onChange={(event) => setOrgan(event.target.value)}><option value="auto">Not sure</option><option value="leaf">Leaf</option><option value="flower">Flower</option><option value="fruit">Fruit</option><option value="bark">Bark</option></select>
    <label className="identify-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> I agree to send this photo to Pl@ntNet for identification. Internet is required. Ìtàn does not store the photo.</label>
    <button type="button" className="button compare-submit" disabled={!file || !consent || busy} onClick={identify}>{busy ? "Identifying…" : "Find possible plants"}</button><p role="status">{message}</p>
    {results.map((result, index) => <article className="compare-result-card" key={`${result.name}-${index}`}><h3><i>{result.name}</i></h3>{result.common && <p>{result.common}</p>}<p>Match score: {(result.score * 100).toFixed(1)}% · a provider score, not certainty</p>{result.match.candidates.length ? result.match.candidates.map((candidate) => <Link className="source-link" href={`/plants/${candidate.id}`} key={candidate.id}>Explore candidate <i>{candidate.name}</i> ↗</Link>) : <p>Not in Ìtàn’s small plant collection.</p>}</article>)}
    <p>A photograph cannot establish that a plant is safe to use or consume. <Link className="source-link" href="/plants">Browse plants manually ↗</Link></p></section>;
}

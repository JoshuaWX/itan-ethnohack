"use client";

import { useState } from "react";

export function LabelOcr({ onConfirm }: { onConfirm: (ingredients: string) => void }) {
  const [original, setOriginal] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function scan(file: File | undefined) {
    if (!file) return;
    setOriginal("");
    setDraft("");
    if (!file.type.startsWith("image/") || file.size > 12 * 1024 * 1024) {
      setStatus("Choose an image smaller than 12 MB, or enter ingredients manually.");
      return;
    }
    setBusy(true);
    setStatus("Reading the label on this device…");
    let worker: Awaited<ReturnType<typeof import("tesseract.js")["createWorker"]>> | undefined;
    try {
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker("eng", 1, {
        workerPath: "/ocr/worker.min.js",
        corePath: "/ocr/tesseract-core-lstm.wasm.js",
        langPath: "/ocr",
        workerBlobURL: false,
      });
      const result = await worker.recognize(file);
      const text = result.data.text;
      setOriginal(text);
      const ingredientLine = text.match(/(?:ingredients|composition)\s*[:\-]\s*([^\n]+)/i)?.[1] ?? "";
      setDraft(ingredientLine);
      setStatus(ingredientLine ? "Check and correct the suggested ingredients before using them." : "No clear ingredient line found. Copy or type the ingredients below, or retake the photo.");
    } catch {
      setStatus("The image could not be read. Try a clearer photo or enter ingredients manually.");
    } finally {
      await worker?.terminate();
      setBusy(false);
    }
  }

  return <div className="label-ocr"><label>Read a label photo <input type="file" accept="image/*" capture="environment" disabled={busy} onChange={(event) => { void scan(event.target.files?.[0]); event.target.value = ""; }} /></label><p role="status">{status}</p>{original && <><details><summary>Original extracted text</summary><pre>{original}</pre></details><label>Review ingredients<textarea rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} /></label><button type="button" className="compare-secondary" disabled={!draft.trim()} onClick={() => { onConfirm(draft); setStatus("Ingredients added. You can still edit them above."); }}>Confirm ingredients</button></>}</div>;
}

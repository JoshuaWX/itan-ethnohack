"use client";

import { useState } from "react";
import { splitIngredients } from "@/lib/matching";
import { PhotoPicker } from "./photo-picker";
import { extractIngredientSection } from "@/lib/label-text";

export function LabelOcr({ onConfirm, onEdit, standalone = false }: {
  onConfirm: (ingredients: string) => void;
  onEdit?: () => void;
  standalone?: boolean;
}) {
  const [original, setOriginal] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [photoName, setPhotoName] = useState("");

  async function scan(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 12 * 1024 * 1024) {
      setStatus("Choose an image smaller than 12 MB, or enter ingredients manually.");
      return;
    }
    onEdit?.();
    setOriginal("");
    setDraft("");
    setPhotoName(file.name);
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
      const ingredientLine = extractIngredientSection(text);
      if (ingredientLine) setDraft(ingredientLine);
      setStatus(ingredientLine ? "Check and correct the suggested ingredients before using them." : "No clear ingredient line found. Copy or type the ingredients below, or retake the photo.");
    } catch {
      setStatus("The image could not be read. Try a clearer photo or enter ingredients manually.");
    } finally {
      await worker?.terminate().catch(() => {});
      setBusy(false);
    }
  }

  return <div className="label-ocr">
    <PhotoPicker accept="image/*" disabled={busy} replacing={Boolean(photoName)} onPick={(file) => void scan(file)} />
    {photoName && <p className="photo-file">{photoName}</p>}
    <p role="status">{status}</p>
    {original && <details><summary>See the original text read from the photo</summary><pre>{original}</pre></details>}
    {(standalone || original) && <>
      <label className="scan-field">{standalone ? "Check or type the ingredients" : "Check the ingredients"}
        <textarea rows={standalone ? 4 : 3} maxLength={4000} value={draft} disabled={busy} placeholder="Enter one ingredient per line, or separate them with commas" onChange={(event) => { setDraft(event.target.value); onEdit?.(); }} />
      </label>
      <p>Correct any missing or misspelled names. Then confirm the list to see your results.</p>
      <button type="button" className={standalone ? "button" : "compare-secondary"} disabled={busy || !splitIngredients(draft).length} onClick={() => { onConfirm(draft.trim()); setStatus(standalone ? "Ingredients confirmed. Your results are below." : "Ingredients added. You can still edit them above."); }}>Confirm ingredients</button>
    </>}
  </div>;
}

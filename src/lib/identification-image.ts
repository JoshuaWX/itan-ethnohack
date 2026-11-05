import sharp from "sharp";

export async function prepareIdentificationImage(bytes: Uint8Array) {
  const image = sharp(bytes, { limitInputPixels: 20_000_000, failOn: "warning" });
  const meta = await image.metadata();
  if (!["png", "jpeg"].includes(meta.format ?? "") || (meta.pages ?? 1) !== 1) throw new Error("unsupported image");
  // Decode before spending provider quota; strip metadata and bound the output.
  return image.rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 88 }).toBuffer();
}

export async function readUploadBody(request: Request, maxBytes: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("missing image body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) { void reader.cancel().catch(() => {}); throw new RangeError("image body too large"); }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.length; }
  return body;
}

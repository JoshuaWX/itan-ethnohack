import { NextResponse } from "next/server";
import { readCatalog } from "@/lib/catalog-server";
import { mapPlantCandidates } from "@/lib/plant-identification";
import { providerQuotaReady, reserveProviderCalls } from "@/lib/provider-quota";
import { prepareIdentificationImage, readUploadBody } from "@/lib/identification-image";

export const runtime = "nodejs";
export async function GET(request: Request) {
  const configured = Boolean(process.env.PLANTNET_API_KEY && process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
  const available = configured && await providerQuotaReady(request.signal);
  return NextResponse.json({ available, reason: !configured ? "configuration" : available ? "ready" : "quota-service" }, { headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  const key = process.env.PLANTNET_API_KEY;
  if (!key) return NextResponse.json({ error: "Plant identification is not configured. Explore the plant collection instead." }, { status: 503 });
  if (!/^multipart\/form-data;/i.test(request.headers.get("content-type") ?? "")) return NextResponse.json({ error: "Choose a JPEG or PNG photo using the photo picker." }, { status: 415 });
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 4 * 1024 * 1024) return NextResponse.json({ error: "The photo is too large to send. Retake it or choose a smaller image." }, { status: 413 });
  try {
    const body = await readUploadBody(request, 4 * 1024 * 1024);
    let form: FormData;
    try { form = await new Response(body, { headers: { "Content-Type": request.headers.get("content-type")! } }).formData(); }
    catch { return NextResponse.json({ error: "The photo request could not be read. Choose the image again." }, { status: 400 }); }
    const file = form.get("image");
    const organ = form.get("organ");
    if (form.get("consent") !== "yes" || !(file instanceof File) || !["image/jpeg", "image/png"].includes(file.type) || file.size > 5 * 1024 * 1024 || file.size < 12 || typeof organ !== "string" || !["auto", "leaf", "flower", "fruit", "bark"].includes(organ)) return NextResponse.json({ error: "Provide a JPEG or PNG image, plant part and consent." }, { status: 400 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = [137,80,78,71,13,10,26,10].every((byte, index) => bytes[index] === byte);
    if ((!jpeg || file.type !== "image/jpeg") && (!png || file.type !== "image/png")) return NextResponse.json({ error: "The file is not a valid JPEG or PNG." }, { status: 400 });
    let prepared: Uint8Array<ArrayBuffer>;
    try { prepared = new Uint8Array(await prepareIdentificationImage(bytes)); }
    catch { return NextResponse.json({ error: "This photo could not be opened. Choose a valid JPEG or PNG, or retake it." }, { status: 400 }); }
    const quota = await reserveProviderCalls(request, 1);
    if (quota === "unavailable") return NextResponse.json({ error: "Identification is temporarily unavailable. Try manual plant search." }, { status: 503 });
    if (quota === "limited") return NextResponse.json({ error: "The daily demo limit has been reached. Try plant search." }, { status: 429 });
    const providerForm = new FormData();
    providerForm.append("images", new Blob([prepared], { type: "image/jpeg" }), "plant.jpg");
    providerForm.append("organs", organ);
    const url = new URL("https://my-api.plantnet.org/v2/identify/all");
    url.searchParams.set("api-key", key);
    url.searchParams.set("nb-results", "5");
    const response = await fetch(url, { method: "POST", body: providerForm, signal: AbortSignal.timeout(15000), cache: "no-store" });
    if (response.status === 404) return NextResponse.json({ candidates: [] });
    if (!response.ok) return NextResponse.json({ error: "Plant identification is unavailable. Try again or search manually." }, { status: 502 });
    const { taxa } = await readCatalog();
    return NextResponse.json({ candidates: mapPlantCandidates(await response.json(), taxa) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof RangeError) return NextResponse.json({ error: "The photo is too large to send. Choose a smaller image." }, { status: 413 });
    return NextResponse.json({ error: "Could not identify this image. Check the photo and your connection, or search by name." }, { status: 502 });
  }
}

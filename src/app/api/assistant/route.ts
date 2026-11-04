import { NextResponse } from "next/server";
import { assistantEvidence } from "@/lib/assistant-evidence";

export const runtime = "nodejs";

// Only fixed, non-personal topics are accepted. Evidence is never generated.
export async function POST(request: Request) {
  let body: { plant?: unknown; topic?: unknown };
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 1024) return NextResponse.json({ error: "Request too large" }, { status: 413 });
  try {
    const text = await request.text();
    if (text.length > 1024) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    body = JSON.parse(text);
  } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some((key) => key !== "plant" && key !== "topic") || typeof body.plant !== "string" || typeof body.topic !== "string" || !["traditional", "research"].includes(body.topic) || !["hibiscus", "ginger", "guava", "cinnamon-verum", "cinnamon-cassia"].includes(body.plant)) return NextResponse.json({ error: "Choose a plant and a topic from the collection." }, { status: 400 });
  const records = assistantEvidence.filter((record) => record.plant === body.plant && record.topic === body.topic);
  if (!records.length) return NextResponse.json({ records: [], mode: "no-evidence" });
  const apiKey = process.env.GEMINI_API_KEY;
  const dbUrl = process.env.SUPABASE_URL;
  const dbKey = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!apiKey || !dbUrl || !dbKey) return NextResponse.json({ records, mode: "curated" });
  try {
    const quota = await fetch(`${dbUrl}/rest/v1/rpc/itan_reserve_assistant_request`, {
      method: "POST",
      headers: { apikey: dbKey, Authorization: `Bearer ${dbKey}`, "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!quota.ok || await quota.json() !== true) return NextResponse.json({ records, mode: "curated" });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    if (!/^[a-zA-Z0-9.-]+$/.test(model)) return NextResponse.json({ records, mode: "curated" });
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `Select the relevant source IDs for the fixed topic ${body.topic} about ${body.plant}. Use only the provided records. Return an empty array if none are relevant. Records: ${JSON.stringify(records.map(({ id, label, text }) => ({ id, label, text })))}` }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: { type: "OBJECT", properties: { ids: { type: "ARRAY", items: { type: "STRING" } } }, required: ["ids"] }, maxOutputTokens: 256 },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return NextResponse.json({ records, mode: "curated" });
    const data = await response.json();
    const answer = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}");
    const ids = answer.ids;
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string" || !records.some((record) => record.id === id))) return NextResponse.json({ records, mode: "curated" });
    const selected = records.filter((record) => ids.includes(record.id));
    if (!selected.length) return NextResponse.json({ records, mode: "curated" });
    return NextResponse.json({ records: selected, mode: "gemini-selection" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ records, mode: "curated" }, { headers: { "Cache-Control": "no-store" } });
  }
}

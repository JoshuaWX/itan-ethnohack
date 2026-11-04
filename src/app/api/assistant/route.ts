import { getProductData } from "@/lib/product-data";
import { taxa } from "@/lib/catalog";
import { identifyIngredient } from "@/lib/matching";
import { evidenceVersion } from "@/lib/research-collection";
import { answerWithBudget, groundedAnswer } from "@/lib/research-answer";
import { maxContextIds, maxQuestionLength, questionBlocked, recordIds, retrieveEvidence, taxonIds } from "@/lib/research-retrieval";
import { reserveProviderCalls } from "@/lib/provider-quota";

export const runtime = "nodejs";
const maxBytes = 4096;
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("missing body");
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      void reader.cancel().catch(() => {});
      throw new RangeError("request too large");
    }
    text += decoder.decode(value, { stream: true });
  }
  return JSON.parse(text + decoder.decode());
}

function validatedIds(input: unknown, allowed: Set<string>): string[] | null {
  if (input === undefined) return [];
  return Array.isArray(input) && input.length <= maxContextIds && input.every((id) => typeof id === "string" && allowed.has(id)) ? [...new Set<string>(input)] : null;
}

export async function POST(request: Request) {
  if (!/^application\/json(?:;|$)/i.test(request.headers.get("content-type") ?? "")) return json({ error: "Use a JSON request." }, 415);
  if (Number(request.headers.get("content-length")) > maxBytes) return json({ error: "Request too large." }, 413);
  let body;
  try { body = await readBody(request); }
  catch (error) { return error instanceof RangeError ? json({ error: "Request too large." }, 413) : json({ error: "Invalid request." }, 400); }
  if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.question !== "string" || body.question.length > maxQuestionLength || !body.question.trim() || typeof body.consent !== "boolean") return json({ error: "Enter a short question and choose your AI preference." }, 400);
  const priorIds = validatedIds(body.priorIds, recordIds);
  const comparisonIds = validatedIds(body.comparisonIds, taxonIds);
  if (!priorIds || !comparisonIds) return json({ error: "Invalid evidence context." }, 400);
  const path = body.path ?? "/";
  if (typeof path !== "string" || path.length > 120 || !/^\/(?:identify|scan|compare|plants(?:\/[a-z0-9-]+)?|products\/[a-z0-9-]+|awareness(?:#(?:outbreak|seasonal))?)?$/.test(path)) return json({ error: "Invalid page context." }, 400);
  const plantId = path.startsWith("/plants/") ? path.slice(8) : "";
  let focus = taxonIds.has(plantId) ? [plantId] : path === "/compare" ? comparisonIds : [];
  if (path.startsWith("/products/")) {
    const { product, ingredients } = getProductData();
    if (path === `/products/${product.id}`) focus = [...new Set(ingredients.flatMap(({ label }) => identifyIngredient(label, taxa).candidates.map(({ id }) => id)))];
  }
  const question = body.question.trim();
  if (questionBlocked(question)) return json({ mode: "restricted", records: [] });
  const awarenessFollowUp = /\b(?:this|it|guidance|advisory|official|what is the difference)\b/i.test(question) && !/\b(?:cholera|malaria|artemisia)\b/i.test(question);
  const retrievalQuestion = awarenessFollowUp && path === "/awareness#outbreak" ? `${question} cholera` : awarenessFollowUp && path === "/awareness#seasonal" ? `${question} malaria` : question;
  const { records, ambiguous, publicTopic } = retrieveEvidence(retrievalQuestion, { taxonIds: focus, priorIds });
  const result = { records, ambiguous, version: evidenceVersion };
  if (!records.length) return json({ ...result, mode: "no-evidence" });
  if (!body.consent || ambiguous || publicTopic || records.some(({ type }) => type === "guidance")) return json({ ...result, mode: "curated" });
  const key = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  if (!key || !/^[a-zA-Z0-9.-]+$/.test(model)) return json({ ...result, mode: "curated", reason: "provider-unavailable" });
  const answer = await answerWithBudget(() => reserveProviderCalls(request, 2), () => {
    const signal = AbortSignal.any([request.signal, AbortSignal.timeout(12000)]);
    return groundedAnswer(async (system, input, schema, maxOutputTokens) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST", headers: { "x-goog-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(input) }] }],
        generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema, maxOutputTokens, temperature: 0.1,
          ...(model.startsWith("gemini-2.5-flash") ? { thinkingConfig: { thinkingBudget: 0 } } : {}) },
      }),
      cache: "no-store", signal,
    });
    if (!response.ok) throw new Error("provider error");
    const data = await response.json();
    return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "null");
    }, question, records, signal);
  });
  return json({ ...result, ...answer });
}

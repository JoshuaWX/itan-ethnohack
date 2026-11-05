import "server-only";
import { createHmac } from "node:crypto";
import { isIP } from "node:net";

export async function providerQuotaReady(signal?: AbortSignal): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return false;
  try {
    const headers: Record<string, string> = { apikey: secret, "Content-Type": "application/json" };
    if (secret.startsWith("eyJ")) headers.Authorization = `Bearer ${secret}`;
    // Invalid units return before any counter writes. This checks RPC/auth reachability,
    // not remaining budget or provider authentication, and never reserves a call.
    const response = await fetch(new URL("/rest/v1/rpc/itan_reserve_provider_calls", url), {
      method: "POST", headers, body: JSON.stringify({ client_key: "0".repeat(64), units: 0 }), cache: "no-store",
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(2500)]) : AbortSignal.timeout(2500),
    });
    return response.ok && await response.json() === false;
  } catch { return false; }
}

export async function reserveProviderCalls(request: Request, units: 1 | 2): Promise<"allowed" | "limited" | "unavailable"> {
  const url = process.env.SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) return "unavailable";
  const forwarded = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
  const client = forwarded && isIP(forwarded) ? forwarded : "shared-client";
  const date = new Date().toISOString().slice(0, 10);
  const key = createHmac("sha256", secret).update(`itan-quota:${date}:${client}`).digest("hex");
  try {
    const headers: Record<string, string> = { apikey: secret, "Content-Type": "application/json" };
    if (secret.startsWith("eyJ")) headers.Authorization = `Bearer ${secret}`;
    const response = await fetch(new URL("/rest/v1/rpc/itan_reserve_provider_calls", url), {
      method: "POST", headers, body: JSON.stringify({ client_key: key, units }), cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(2500)]),
    });
    if (!response.ok) return "unavailable";
    const allowed = await response.json();
    return allowed === true ? "allowed" : allowed === false ? "limited" : "unavailable";
  } catch {
    return "unavailable";
  }
}

import "server-only";
import { taxa as fallbackTaxa } from "./catalog";
import type { Taxon } from "./matching";

export async function readCatalog(): Promise<{ taxa: Taxon[]; source: "database" | "fallback" }> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (url && key) {
    try {
      const response = await fetch(`${url}/rest/v1/itan_taxa?published=eq.true&select=id,name,common,aliases,source&order=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (response.ok) {
        const rows: Taxon[] = await response.json();
        // An older remote seed must not hide newly verified local identities.
        const complete = fallbackTaxa.every((entry) => rows.some((row) => row.id === entry.id && row.name === entry.name));
        if (complete && rows.every((row) => row.id && row.name && row.common && row.source && Array.isArray(row.aliases))) return { taxa: rows, source: "database" };
      }
    } catch { /* The versioned catalog is available when the service is down. */ }
  }
  return { taxa: fallbackTaxa, source: "fallback" };
}

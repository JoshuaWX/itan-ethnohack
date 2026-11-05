"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search, X } from "lucide-react";
type SearchResult = {
  type: "product" | "plant";
  id: string;
  name: string;
  subtitle: string;
};

export function SearchBox({ exampleNumber }: { exampleNumber: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const q = query.trim();
  useEffect(() => {
    if (!q) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Search unavailable");
        const data: { results: SearchResult[] } = await response.json();
        setResults(data.results);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) setStatus("error");
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);
  return (
    <div className="search-wrap">
      <div className="search-field">
        <Search size={21} aria-hidden="true" />
        <label className="sr-only" htmlFor="search">
          Search plants, products or registration numbers
        </label>
        <input
          id="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim() !== q) setStatus("loading");
          }}
          placeholder="Try ginger, Ewuro or a product name"
          autoComplete="off"
          maxLength={100}
        />
        {query && (
          <button
            className="clear"
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("idle");
            }}
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
        <span className="search-shortcut">Explore</span>
      </div>
      {q && (
        <div className="search-results" aria-live="polite">
          {status === "loading" && <p>Searching the collection…</p>}
          {status === "error" && (
            <p>Search is unavailable. Check your connection and try again.</p>
          )}
          {status === "ready" &&
            results.map((item) => (
              <Link
                href={`/${item.type === "product" ? "products" : "plants"}/${item.id}`}
                key={`${item.type}-${item.id}`}
              >
                <span>
                  <small>{item.type}</small>
                  <strong>{item.name}</strong> <i>{item.subtitle}</i>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          {status === "ready" && results.length === 0 && (
            <p>
              We couldn’t find that name in our small library. Try “ginger” or “
              {exampleNumber}”.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

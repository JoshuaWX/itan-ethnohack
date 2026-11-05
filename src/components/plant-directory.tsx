"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { normalizeName, type Taxon } from "@/lib/matching";
import { PlantPhoto } from "./plant-photo";

export function PlantDirectory({ taxa }: { taxa: Taxon[] }) {
  const [query, setQuery] = useState("");
  const filtered = taxa.filter((plant) => normalizeName([plant.name, plant.common, ...plant.aliases].join(" ")).includes(normalizeName(query)));
  return <>
    <label className="scan-field library-search">Search by plant name<input type="search" maxLength={80} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Ewuro, neem or ginger" /></label>
    <p role="status">{filtered.length} {filtered.length === 1 ? "plant" : "plants"} in this library</p>
    <div className="plant-directory">{filtered.map((plant) => <div key={plant.id} className="plant-directory-entry">
      <PlantPhoto id={plant.id} name={plant.common} />
      <Link className="plant-row" href={`/plants/${plant.id}`}><div><h2>{plant.common}</h2><i>{plant.name}</i></div><ArrowUpRight size={20} /></Link>
    </div>)}</div>
    {!filtered.length && <p>No matching name in this collection. Try another spelling or clear your search.</p>}
  </>;
}

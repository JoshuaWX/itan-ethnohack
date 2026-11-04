"use client";

import { useState } from "react";
import { taxa } from "@/lib/catalog";
import { researchCollection } from "@/lib/research-collection";
import { ResearchCard } from "./research-card";

export function EvidenceExplorer() {
  const [plant, setPlant] = useState("hibiscus");
  const [filter, setFilter] = useState<"all" | "traditional" | "research">("all");
  const records = researchCollection.filter((record) => record.taxa.includes(plant) && (filter === "all" || (filter === "traditional" ? record.type === "traditional" : record.type !== "traditional")));
  return <details className="detail-section evidence-browser">
    <summary>Browse research by plant</summary>
    <div className="research-filters">
      <label>Plant<select value={plant} onChange={(event) => setPlant(event.target.value)}>{taxa.map(({ id, common }) => <option key={id} value={id}>{id === "hibiscus" ? "Roselle" : common}</option>)}</select></label>
      <label>Evidence type<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">All evidence</option><option value="traditional">Traditional use</option><option value="research">Research</option></select></label>
    </div>
    {records.length ? records.map((record) => <ResearchCard key={record.id} record={record} />) : <p>No matching record in this edition of the collection.</p>}
  </details>;
}

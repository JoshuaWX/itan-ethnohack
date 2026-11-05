"use client";

import { useState } from "react";
import { taxa } from "@/lib/catalog";
import { researchCollection } from "@/lib/research-collection";
import { ResearchCard } from "./research-card";

export function EvidenceExplorer() {
  const [plant, setPlant] = useState("hibiscus");
  const [filter, setFilter] = useState<"all" | "traditional" | "research">("all");
  const records = researchCollection.filter((record) => record.taxa.includes(plant) && (filter === "all" || (filter === "traditional" ? record.type === "traditional" || record.type === "ethnobotanical" : record.type !== "traditional" && record.type !== "ethnobotanical")));
  return <details className="detail-section evidence-browser">
    <summary>Read more research about a plant</summary>
    <div className="research-filters">
      <label>Plant<select value={plant} onChange={(event) => setPlant(event.target.value)}>{taxa.map(({ id, common }) => <option key={id} value={id}>{id === "hibiscus" ? "Roselle" : common}</option>)}</select></label>
      <label>Show<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">All sources</option><option value="traditional">Traditional use</option><option value="research">Studies and reviews</option></select></label>
    </div>
    {records.length ? records.map((record) => <ResearchCard key={record.id} record={record} />) : <p>We don’t have a matching research summary here. Try another plant or choose All sources.</p>}
  </details>;
}

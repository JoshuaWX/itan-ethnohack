import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { readCatalog } from "@/lib/catalog-server";
import { evidenceLabels, evidenceVersion, researchCollection } from "@/lib/research-collection";
import { PlantPhoto } from "@/components/plant-photo";
import { ResearchCard } from "@/components/research-card";
import { AskTrigger } from "@/components/ask-itan";

export default async function PlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const catalog = await readCatalog();
  const plant = catalog.taxa.find((row) => row.id === id);
  if (!plant) notFound();
  const records = researchCollection.filter((record) => record.taxa.includes(id));
  const evidenceTypes = [...new Set(records.map((record) => record.type))];
  const name = id === "hibiscus" ? "Roselle (hibiscus)" : plant.common;
  return <div className="container page plant-record">
    <Link href="/plants" className="back"><ArrowLeft size={16} /> All plants</Link>
    <div className="plant-feature">
      <div className="plant-hero">
        <div>
          <p className="overline">Plant record</p>
          <h1>{name}</h1>
          <p className="scientific-name">{plant.name}</p>
          <div className="plant-evidence-overview">
            <p><strong>Evidence in this collection</strong></p>
            {evidenceTypes.length ? <ul>{evidenceTypes.map((type) => <li key={type}>{evidenceLabels[type]}</li>)}</ul> : <p>No evidence summary is available for this plant.</p>}
          </div>
          <div className="research-links"><a className="source-link" href="#research">Read the findings <ArrowUpRight size={16} /></a><AskTrigger className="source-link" /></div>
        </div>
      </div>
      <PlantPhoto id={plant.id} name={name} />
    </div>
    <div className="plant-reading">
      <details className="botanical-disclosure">
        <summary>Botanical names and identity</summary>
        <p>{id === "hibiscus" && <>Kew treats <i>Hibiscus sabdariffa</i> as a synonym of <i>Sabdariffa gossypiifolia</i> and notes alternative taxonomic treatments. </>}Common names on labels can refer to multiple species.</p>
        {plant.aliases.length > 0 && <p>Also encountered as {plant.aliases.join(", ")}.</p>}
        <a className="source-link" href={plant.source} target="_blank" rel="noreferrer">View the botanical source <ArrowUpRight size={16} /></a>
        {catalog.source === "fallback" && <p>Identity from the bundled catalog.</p>}
      </details>
      <section className="detail-section" id="research">
        <h2>What has been studied</h2>
        <p className="research-meta">Collection v{evidenceVersion}</p>
        <p>Plant part, preparation and who or what was studied all affect how a finding applies.</p>
        {records.length ? records.map((record) => <ResearchCard key={record.id} record={record} />) : <p>We have no evidence summary for this plant in the current collection.</p>}
        {id === "guava" && <Link className="source-link" href="/awareness#outbreak">Read official cholera guidance <ArrowUpRight size={16} /></Link>}
      </section>
    </div>
  </div>;
}

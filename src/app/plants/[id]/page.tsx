import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Leaf } from "lucide-react";
import { evidenceRecords, getTaxon, sources } from "@/lib/catalog";
import { getProductData } from "@/lib/product-data";
import { classifyEvidence } from "@/lib/evidence";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product } = getProductData();
  const plant = getTaxon(id);
  if (!plant) notFound();
  const evidence = evidenceRecords.find((record) => record.taxonId === id);
  const evidenceClass = classifyEvidence(evidence?.studyType ?? "");
  return (
    <div className="container page">
      <Link href="/plants" className="back">
        <ArrowLeft size={16} /> All plants
      </Link>
      <div className="plant-hero">
        <div>
          <p className="overline">Botanical identity</p>
          <h1>{plant.common}</h1>
          <p className="scientific-name">{plant.name}</p>
          <p className="detail-lead">
            A closer look at the name, the source and the evidence available in
            this collection.
          </p>
        </div>
        <div className="plant-mark">
          <Leaf size={96} strokeWidth={0.7} />
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-section">
            <p className="overline">Identity</p>
            <h2>Understanding the name</h2>
            <p className="prose">
              {id === "hibiscus"
                ? "The product record uses Hibiscus sabdariffa. Kew currently treats that name as a synonym of Sabdariffa gossypiifolia, while noting alternative taxonomic treatments."
                : `${plant.name} is the name associated with this catalog entry.`}{" "}
              Common names can refer to more than one species, and a name on a
              product record does not identify its preparation or effects.
            </p>
            <a
              className="source-link"
              href={plant.source}
              target="_blank"
              rel="noreferrer"
            >
              View botanical source <ArrowUpRight size={16} />
            </a>
          </section>
          <section className="detail-section">
            <p className="overline">Evidence &amp; context</p>
            <h2>What has been studied</h2>
            {id === "ginger" ? (
              <article className="evidence">
                <span className="evidence-label">
                  {evidenceClass === "traditional"
                    ? "Traditional use · EMA assessment"
                    : "Evidence not classified"}
                </span>
                <h3>Ginger rhizome in herbal preparations</h3>
                <p>
                  The European Medicines Agency describes traditional uses of
                  certain ginger rhizome preparations, including relief of mild
                  digestive complaints. Its assessment concerns particular
                  preparations and uses.
                </p>
                <p className="evidence-limit">
                  This assessment does not establish the effects or safety of
                  any specific tea product, and is not a recommendation to use
                  it.
                </p>
                <a
                  className="source-link"
                  href={sources.ema}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the EMA assessment <ArrowUpRight size={16} />
                </a>
              </article>
            ) : id === "guava" ? (
              <article className="evidence">
                <span className="evidence-label">
                  {evidenceClass === "laboratory"
                    ? "Laboratory research · Not clinical evidence"
                    : "Evidence not classified"}
                </span>
                <h3>Guava leaf research and cholera bacteria</h3>
                <p>
                  A laboratory study examined a water extract of guava leaves
                  against mechanisms associated with infectious diarrhoea,
                  including cholera bacteria and toxin.
                </p>
                <p className="evidence-limit">
                  Laboratory findings do not establish effectiveness or safety
                  in people. Guava is not a proven cholera treatment.
                </p>
                <a
                  className="source-link"
                  href={sources.paper}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the study <ArrowUpRight size={16} />
                </a>
              </article>
            ) : (
              <article className="evidence">
                <span className="evidence-label">Evidence not yet curated</span>
                <h3>More context is needed</h3>
                <p>
                  We have not yet reviewed an evidence summary for this plant in
                  this small collection. A missing summary does not mean
                  evidence does not exist.
                </p>
              </article>
            )}
          </section>
        </div>
        <aside className="detail-aside">
          <div className="aside-box">
            <h3>Keep the context</h3>
            <p>
              Plant part, preparation, dose and the people studied matter. A
              result for one preparation cannot automatically be applied to
              another product.
            </p>
          </div>
          {id === "guava" ? (
            <Link className="aside-return" href="/awareness#outbreak">
              Explore cholera awareness <ArrowUpRight size={16} />
            </Link>
          ) : (
            <Link className="aside-return" href={`/products/${product.id}`}>
              Explore the product record <ArrowUpRight size={16} />
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

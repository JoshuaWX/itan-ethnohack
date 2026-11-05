import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ChevronRight, Info } from "lucide-react";
import { sources } from "@/lib/catalog";
import { readCatalog } from "@/lib/catalog-server";
import { getProductData } from "@/lib/product-data";
import { identifyIngredient } from "@/lib/matching";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { taxa } = await readCatalog();
  const { product, ingredients, localSnapshot } = getProductData();
  if (id !== product.id) notFound();
  return (
    <div className="container page">
      <Link href="/" className="back">
        <ArrowLeft size={16} /> Back to discover
      </Link>
      <div className="breadcrumbs">
        Discover <ChevronRight size={13} /> Product record
      </div>
      <div className="detail-header">
        <div>
          <p className="overline">A closer look · Product</p>
          <h1>{product.name}</h1>
          <p className="detail-lead">
            A closer look at the names on a herbal tea record and the plants
            they may refer to.
          </p>
          <div className="badge-row">
            <span className="pill">
              {localSnapshot
                ? "Local source snapshot"
                : "Fictional demo product"}
            </span>
            <span className="record-number">{product.number}</span>
          </div>
        </div>
        <div className="detail-stamp">
          <span>RECORD</span>
          <strong>01</strong>
          <small>in the collection</small>
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-section">
            <div className="section-title">
              <div>
                <p className="overline">Declared composition</p>
                <h2>What’s on the record</h2>
              </div>
              <span>3 ingredients</span>
            </div>
            <p className="section-description">
              {localSnapshot
                ? "The local source snapshot lists three ingredients."
                : "These fictional ingredients demonstrate the matching workflow."}{" "}
              Follow a name to see how our small catalog interprets it.
            </p>
            <div className="ingredient-list">
              {ingredients.map((ingredient, index) => {
                const match = identifyIngredient(ingredient.label, taxa);
                return (
                  <div className="ingredient-row" key={ingredient.label}>
                    <span className="ingredient-index">0{index + 1}</span>
                    <div className="ingredient-main">
                      <div className="ingredient-title">
                        <h3>{ingredient.display}</h3>
                        <span>{ingredient.amount}</span>
                      </div>
                      <p>{ingredient.detail}</p>
                      <div className={`match-tag ${match.kind}`}>
                        <span />{" "}
                        {match.kind === "ambiguous"
                          ? "Species ambiguous"
                          : match.kind === "alias"
                            ? "Catalog alias match"
                            : match.kind === "exact"
                              ? "Scientific-name match"
                              : "No catalog match"}
                      </div>
                      <p className="match-explanation">{match.explanation}</p>
                      {match.kind === "alias" && (
                        <p className="match-explanation">
                          This ingredient uses a common name only. This is a
                          candidate identification, not an independently
                          verified species.
                        </p>
                      )}
                      {match.candidates.map((candidate) => (
                        <Link
                          className="candidate-link"
                          href={`/plants/${candidate.id}`}
                          key={candidate.id}
                        >
                          <i>{candidate.name}</i>
                          <ArrowUpRight size={15} />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="detail-section">
            <div className="section-title">
              <div>
                <p className="overline">Source records</p>
                <h2>What the records show</h2>
              </div>
            </div>
            <p className="section-description">
              {localSnapshot
                ? "The local NAFDAC snapshot contains two entries with this number. These are historical source records, not a live verification."
                : "No regulatory records are supplied with this fictional product. Visit the official source to search its database."}
            </p>
            <div className="record-grid">
              {product.records.map((record) => (
                <article className="record" key={record.date}>
                  <span>Source entry</span>
                  <h3>{record.date}</h3>
                  <dl>
                    <div>
                      <dt>Listed end date</dt>
                      <dd>{record.end}</dd>
                    </div>
                    <div>
                      <dt>Form</dt>
                      <dd>{record.form}</dd>
                    </div>
                    <div>
                      <dt>Applicant</dt>
                      <dd>{record.applicant}</dd>
                    </div>
                    <div>
                      <dt>Manufacturer</dt>
                      <dd>{record.manufacturer}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{record.location}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
            <a
              className="source-link"
              href={sources.nafdac}
              target="_blank"
              rel="noreferrer"
            >
              View the NAFDAC herbal products database{" "}
              <ArrowUpRight size={16} />
            </a>
            <p className="source-date">
              {localSnapshot
                ? `Source reviewed 4 November 2026 · Search for ${product.number}`
                : "The fictional demo number is not a NAFDAC record."}
            </p>
          </section>
        </div>
        <aside className="detail-aside">
          <div className="aside-box">
            <Info size={20} />
            <h3>A record is a starting point</h3>
            <p>
              A registration number match does not authenticate a physical
              package or establish the product’s effectiveness, safety, or a
              seller’s credentials.
            </p>
            <p>Check the manufacturer’s name and address, batch number, dates and packaging. A copied registration number can appear on a falsified package.</p>
            <Link className="source-link" href="/verify">Check the official source ↗</Link>
          </div>
          <div className="aside-box plain">
            <p className="overline">About this collection</p>
            <p>
              {localSnapshot
                ? "Product information is a small, manually curated local snapshot. Availability and current registration status have not been independently checked."
                : "This fictional product demonstrates the interface. It has no registration record."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

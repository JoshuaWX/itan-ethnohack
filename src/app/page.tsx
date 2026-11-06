import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { SearchBox } from "@/components/search";
import { Scanner } from "@/components/scanner";
import { BotanicalHero } from "@/components/botanical-hero";
import { getProductData } from "@/lib/product-data";

export const dynamic = "force-dynamic";

export default function Home() {
  const { product, ingredients, localSnapshot } = getProductData();
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> A guide to plant knowledge in
              Nigeria
            </div>
            <h1>
              Plant knowledge,
              <br />
              <em>made clearer.</em>
            </h1>
            <p>
              Use a photo to identify a plant, read a herbal product label,
              or compare its ingredients. See what researchers found and what is still unknown.
            </p>
            <div className="hero-actions" aria-label="Start here">
              <Link className="button light hero-task" href="/identify"><span><strong>Identify a plant</strong><small>Find possible names from a photo</small></span><ArrowUpRight size={18} /></Link>
              <Link className="hero-link" href="/scan">
                <span><strong>Scan a herbal product</strong><small>Read or type the ingredients</small></span><ArrowRight size={18} />
              </Link>
              <Link className="hero-link" href="/compare"><span><strong>Compare products</strong><small>See which ingredients they share</small></span><ArrowUpRight size={18} /></Link>
            </div>
            <div className="hero-foot">
              <Link href="/plants">Plant library <ArrowUpRight size={14} /></Link>
              <Link href="/awareness">Health information <ArrowUpRight size={14} /></Link>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <BotanicalHero />
            <span className="art-label label-one">A closer look</span>
            <span className="art-label label-two">
              Plants · People · Evidence
            </span>
          </div>
        </div>
      </section>
      <section className="intro" id="explore">
        <div className="container">
          <h2>Looking for a name?</h2>
          <p>Search our small plant library or try the example product below.</p>
          <SearchBox exampleNumber={product.number} />
          <Link className="source-link" href="/verify">Check a real product using NAFDAC’s lookup ↗</Link>
          <div className="search-hint">
            Try <span>ginger</span>, <span>hibiscus</span>, or{" "}
            <span>{product.number}</span>
          </div>
          <details className="home-lookup"><summary>Use a QR code or registration number</summary><p>The QR example opens a demo product. To check a real registration number, use NAFDAC’s own lookup.</p><Scanner productId={product.id} productNumber={product.number} /></details>
        </div>
      </section>
      <section className="featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="overline">A product, understood</p>
              <h2>Start with the label.</h2>
              <p>
                Try an example to see how ingredient names connect to plants
                and research.
              </p>
            </div>
            <Link className="text-link" href={`/products/${product.id}`}>
              Explore the product <ArrowUpRight size={17} />
            </Link>
          </div>
          <Link className="product-feature" href={`/products/${product.id}`}>
            <div className="product-visual">
              <div className="product-package">
                <div className="pack-top">A closer look at</div>
                <span>
                  Hibiscus
                  <br />
                  &amp; Ginger
                </span>
                <div className="pack-line" />
                <small>
                  HERBAL TEA
                  <br />
                  {localSnapshot ? "CURATED RECORD" : "FICTIONAL EXAMPLE"}
                </small>
              </div>
              <div className="visual-caption">
                Illustration · not product packaging
              </div>
            </div>
            <div className="product-copy">
              <div className="badge-row">
                <span className="pill">
                  {localSnapshot
                    ? "Local source snapshot"
                    : "Fictional demo product"}
                </span>
                <span className="record-number">{product.number}</span>
              </div>
              <h3>{product.name}</h3>
              <p>
                What do hibiscus, ginger and cinnamon on a label tell us? Start
                with the source, then follow each name.
              </p>
              <div className="ingredient-preview">
                {ingredients.map((ingredient) => (
                  <span key={ingredient.label}>
                    {ingredient.display} <small>{ingredient.amount}</small>
                  </span>
                ))}
              </div>
              <div className="card-link">
                View the product record{" "}
                <span>
                  <ArrowRight size={18} />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="claim-entry container" aria-labelledby="claim-entry-title">
        <div><h2 id="claim-entry-title">Heard something about a plant?</h2><p>See what the studies in Ìtàn say, and what is still unknown.</p></div>
        <Link className="button compare-submit" href="/claims">Check a plant claim <ArrowUpRight size={17} /></Link>
      </section>
      <section className="awareness-feature">
        <div className="container awareness-grid">
          <div>
            <p className="overline light-overline">
              Public health &amp; plant research
            </p>
            <h2>Health advice from official sources.</h2>
            <p>
              Read dated Nigerian public-health advisories and prevention
              guidance from official sources.
            </p>
            <Link className="button light" href="/awareness">
              Read health information <ArrowRight size={18} />
            </Link>
          </div>
          <div className="awareness-paper">
            <div className="paper-top">
              <BookOpen size={19} />
              <span>From the knowledge desk</span>
            </div>
            <p className="paper-type">Archived advisory · 12 June 2024</p>
            <h3>Cholera awareness in Nigeria</h3>
            <p>
              Read NCDC’s archived advice on safe water, hygiene and prompt
              care. This prototype does not monitor outbreaks live.
            </p>
            <Link href="/awareness#outbreak">
              Read the archived advice <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <div className="notice container">
        <span>For better-informed questions.</span>
        <p>
          Ìtàn is a research and demonstration prototype. It does not diagnose,
          prescribe, or establish that a product is safe or effective.
        </p>
      </div>
    </>
  );
}

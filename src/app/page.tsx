import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { SearchBox } from "@/components/search";
import { Scanner } from "@/components/scanner";
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
              Identify plants, understand herbal product labels, and explore
              the evidence behind the ingredients.
            </p>
            <div className="hero-actions">
              <Link className="button light" href="/identify">Identify a plant <ArrowUpRight size={16} /></Link>
              <Link className="hero-link" href="/compare#scan">
                Scan a herbal product <ArrowRight size={18} />
              </Link>
              <Link className="hero-link" href="/compare">Compare herbal products <ArrowUpRight size={16} /></Link>
              <Link className="hero-link" href="/plants">Explore medicinal plants <ArrowUpRight size={16} /></Link>
              <Link className="hero-link" href="/awareness">
                Explore public health <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="hero-foot">
              <span>Rooted in knowledge.</span>
              <span>Guided by evidence.</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <svg
              viewBox="0 0 430 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M219 446C216 343 225 227 253 79M221 357C161 335 120 293 87 250M226 310C276 285 321 250 349 208M235 250C188 224 155 181 140 126M245 191C280 171 304 141 314 102"
                stroke="#c4d3b2"
                strokeWidth="2"
              />
              <path
                d="M253 111C220 80 220 37 250 12C280 45 280 81 253 111ZM139 128C100 123 70 97 67 58C109 60 140 88 139 128ZM312 109C306 67 324 39 363 27C369 68 351 99 312 109ZM88 255C46 256 18 231 13 194C55 192 84 215 88 255ZM347 211C342 171 367 140 408 133C411 173 387 202 347 211ZM168 312C121 317 88 296 78 258C123 253 159 272 168 312ZM276 286C281 244 312 220 354 223C350 265 320 289 276 286ZM194 213C151 211 121 181 121 141C165 145 193 173 194 213Z"
                fill="#b4c9a2"
                fillOpacity=".56"
                stroke="#d3dec3"
                strokeWidth="1.2"
              />
              <path
                d="M250 26L253 100M79 69L136 123M353 39L316 102M26 204L82 251M396 145L350 207M91 268L163 307M340 230L280 282M130 151L190 207"
                stroke="#e2e9d8"
                strokeOpacity=".75"
              />
              <circle
                cx="216"
                cy="254"
                r="182"
                stroke="#d2dfc5"
                strokeOpacity=".25"
                strokeDasharray="2 8"
              />
            </svg>
            <span className="art-label label-one">A closer look</span>
            <span className="art-label label-two">
              Plants · People · Evidence
            </span>
          </div>
        </div>
      </section>
      <section className="intro" id="explore">
        <div className="container">
          <div className="section-kicker">
            <span>Start with a question</span>
            <span>01 / Discover</span>
          </div>
          <div className="intro-grid">
            <div>
              <h2>
                A little more clarity,
                <br />
                <em>at every step.</em>
              </h2>
            </div>
            <div>
              <p>
                There’s a lot on a herbal product label. We bring the names,
                sources and context together, so you can explore with a clearer
                picture.
              </p>
              <span className="quiet-link">
                A small, curated collection <ArrowDown size={15} />
              </span>
            </div>
          </div>
          <SearchBox exampleNumber={product.number} />
          <div className="search-hint">
            Try <span>ginger</span>, <span>hibiscus</span>, or{" "}
            <span>{product.number}</span>
          </div>
          <Scanner productId={product.id} productNumber={product.number} />
        </div>
      </section>
      <section className="featured">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="overline">A product, understood</p>
              <h2>Start with the label.</h2>
              <p>
                Follow an ingredient from a product record to its botanical
                identity and evidence.
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
      <section className="approach">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="overline">An honest approach</p>
              <h2>Knowledge, in context.</h2>
            </div>
            <p>
              Traditional knowledge and scientific research can sit side by
              side, with their differences made clear.
            </p>
          </div>
          <div className="principles">
            <div>
              <span className="principle-icon">
                <Leaf size={20} />
              </span>
              <h3>Know the plant</h3>
              <p>
                See how a label name connects to a botanical identity, including
                where that identity is uncertain.
              </p>
            </div>
            <div>
              <span className="principle-icon">
                <FlaskConical size={20} />
              </span>
              <h3>Follow the evidence</h3>
              <p>
                Explore what has been studied, how it was studied and where the
                limits of that evidence lie.
              </p>
            </div>
            <div>
              <span className="principle-icon">
                <ShieldCheck size={20} />
              </span>
              <h3>Understand the record</h3>
              <p>
                See what a source record says, without confusing a record match
                with proof of an authentic package.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="awareness-feature">
        <div className="container awareness-grid">
          <div>
            <p className="overline light-overline">
              Public health &amp; plant research
            </p>
            <h2>
              Awareness begins
              <br />
              <em>with context.</em>
            </h2>
            <p>
              Explore Nigeria-focused public health information alongside the
              research on plants. Each has its own story and its own limits.
            </p>
            <Link className="button light" href="/awareness">
              Explore awareness <ArrowRight size={18} />
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
              Official guidance comes first. Explore a separate laboratory study
              on guava, with its limitations.
            </p>
            <Link href="/awareness#outbreak">
              Read the context <ArrowUpRight size={15} />
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

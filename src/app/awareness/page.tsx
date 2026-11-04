import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { sources } from "@/lib/catalog";

export default function AwarenessPage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <p className="overline">Public health &amp; plant research</p>
        <h1>
          Awareness,
          <br />
          <em>with perspective.</em>
        </h1>
        <p>
          Follow official public-health guidance first. Explore plant research
          separately, with context about what it can and cannot tell us.
        </p>
      </div>
      <div className="awareness-tabs">
        <a href="#outbreak">Outbreak awareness</a>
        <a href="#seasonal">Seasonal &amp; endemic</a>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-section" id="outbreak">
            <div className="badge-row">
              <span className="pill archived">Archived advisory</span>
              <span className="record-number">12 June 2024</span>
            </div>
            <h2>Cholera awareness in Nigeria</h2>
            <p className="prose">
              This historical NCDC advisory describes a cholera outbreak
              reported in Nigeria in 2024. It is provided for context and is not
              a live outbreak alert.
            </p>
            <article className="guidance">
              <p className="overline">Official public-health guidance</p>
              <h3>Safe water and prompt care matter.</h3>
              <p>
                NCDC advises using safe water, washing hands with soap and
                seeking care immediately for sudden watery diarrhoea. Follow
                current advice from health authorities and qualified health
                professionals.
              </p>
              <a
                className="source-link"
                href={sources.ncdc}
                target="_blank"
                rel="noreferrer"
              >
                Read the NCDC advisory <ArrowUpRight size={16} />
              </a>
            </article>
            <article className="evidence">
              <span className="evidence-label">
                Plant research · Laboratory study
              </span>
              <h3>What has been studied about guava?</h3>
              <p>
                A laboratory study investigated guava leaf extract and
                mechanisms associated with infectious diarrhoea, including
                cholera bacteria. It did not establish a treatment for people.
              </p>
              <p className="evidence-limit">
                Guava is not a proven cholera treatment. Laboratory findings
                cannot replace official guidance or professional care.
              </p>
              <Link className="source-link" href="/plants/guava">
                Explore the guava evidence <ArrowRight size={16} />
              </Link>
            </article>
          </section>
          <section className="detail-section" id="seasonal">
            <div className="badge-row">
              <span className="pill">Seasonal &amp; endemic</span>
              <span className="record-number">Nigeria</span>
            </div>
            <h2>Malaria and plant research</h2>
            <p className="prose">
              Malaria is an ongoing public-health concern in Nigeria. Seek
              appropriate testing and care and consult current public-health
              advice.
            </p>
            <article className="guidance">
              <p className="overline">WHO guidance</p>
              <h3>Plant material and medicines are different.</h3>
              <p>
                WHO does not support using non-pharmaceutical Artemisia plant
                material, including teas, for malaria prevention or treatment.
                Artemisinin derivatives used in approved medicines are different
                from plant material.
              </p>
              <a
                className="source-link"
                href={sources.who}
                target="_blank"
                rel="noreferrer"
              >
                Read WHO’s position <ArrowUpRight size={16} />
              </a>
              <a
                className="source-link"
                href={sources.malaria}
                target="_blank"
                rel="noreferrer"
              >
                Read WHO’s malaria guidance <ArrowUpRight size={16} />
              </a>
            </article>
          </section>
        </div>
        <aside className="detail-aside">
          <div className="aside-box">
            <h3>A note on freshness</h3>
            <p>
              This prototype uses curated sources and does not monitor outbreaks
              in real time. Check NCDC for current advisories.
            </p>
            <a
              className="source-link"
              href="https://ncdc.gov.ng/diseases/sitreps"
              target="_blank"
              rel="noreferrer"
            >
              NCDC situation reports <ArrowUpRight size={16} />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

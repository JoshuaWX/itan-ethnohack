import { ArrowUpRight } from "lucide-react";
import { sources } from "@/lib/catalog";

export default function AwarenessPage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <h1>Health information</h1>
        <p>
          Read advice from official health authorities. Check the dates:
          this demo does not track live outbreaks.
        </p>
      </div>
      <div className="awareness-tabs">
        <a href="#outbreak">Past outbreak advice</a>
        <a href="#seasonal">Ongoing disease awareness</a>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-section" id="outbreak">
            <div className="badge-row">
              <span className="pill archived">Archived advice · not a live alert</span>
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
          </section>
          <section className="detail-section" id="seasonal">
            <div className="badge-row">
              <span className="pill">Ongoing and seasonal disease awareness</span>
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
              <h3>Artemisia teas are not recommended for malaria.</h3>
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
            <h3>Looking for current updates?</h3>
            <p>
              These pages use selected published sources. They do not update
              automatically. Check NCDC for current outbreak information.
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

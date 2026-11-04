import Link from "next/link";
import { evidenceLabels, type ResearchRecord } from "@/lib/research-collection";

export function ResearchCard({ record, number }: { record: ResearchRecord; number?: number }) {
  return <article className={`research-card${record.type === "guidance" ? " research-guidance" : ""}`}>
    <p className="research-kind">{number && `[${number}] `}{evidenceLabels[record.type]}</p>
    <h3>{record.title}</h3>
    <p>{record.finding}</p>
    <p className="research-limit"><strong>Limitations.</strong> {record.limitation}</p>
    <details>
      <summary>Study and source details</summary>
      <dl>
        <dt>Design</dt><dd>{record.design}</dd>
        {record.type !== "guidance" && <><dt>Plant part</dt><dd>{record.part}</dd></>}
        <dt>Preparation</dt><dd>{record.preparation}</dd>
        <dt>Source</dt><dd>{record.sourceId} · {record.location}</dd>
        <dt>Source verification</dt><dd>{record.sourceVerification}</dd>
        <dt>Specialist review</dt><dd>{record.expertReview}</dd>
      </dl>
      <a className="source-link" href={record.url} target="_blank" rel="noreferrer">Read the original source ↗</a>
    </details>
    <div className="research-links">
      {number && record.href && <Link className="source-link" href={record.href}>Read awareness guidance ↗</Link>}
      {number && record.taxa.map((id) => <Link className="source-link" key={id} href={`/plants/${id}`}>Explore {id === "hibiscus" ? "roselle" : id === "cinnamon-verum" ? "Ceylon cinnamon" : id === "cinnamon-cassia" ? "Java cinnamon" : id} ↗</Link>)}
    </div>
  </article>;
}

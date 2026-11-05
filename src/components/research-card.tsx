import Link from "next/link";
import { evidenceLabels, type ResearchRecord } from "@/lib/research-collection";
import { taxa } from "@/lib/catalog";

export function ResearchCard({ record, number }: { record: ResearchRecord; number?: number }) {
  return <article className={`research-card${record.type === "guidance" ? " research-guidance" : ""}`}>
    <p className="research-kind">{number && `[${number}] `}{evidenceLabels[record.type]}</p>
    <h3>{record.plain.title}</h3>
    <p>{record.plain.finding}</p>
    <p className="research-limit"><strong>What this doesn’t tell us.</strong> {record.plain.limitation}</p>
    <a className="source-link" href={record.url} target="_blank" rel="noreferrer">{number ? `[${number}] ` : ""}Read the source ↗</a>
    <details>
      <summary>See the study details</summary>
      <p><strong>Research title.</strong> {record.title}</p>
      <p><strong>Full research summary.</strong> {record.finding}</p>
      <p>{record.limitation}</p>
      <dl>
        <dt>Study type</dt><dd>{record.design}</dd>
        {record.type !== "guidance" && <><dt>Plant part</dt><dd>{record.part}</dd></>}
        <dt>Preparation</dt><dd>{record.preparation}</dd>
        {record.population && <><dt>Who or what was studied</dt><dd>{record.population}</dd></>}
        {record.constituents?.length && <><dt>Constituent research</dt><dd>{record.constituents.join(", ")}. Measurements do not establish which compound causes an effect.</dd></>}
        <dt>Source</dt><dd>{record.sourceId} · {record.location}</dd>
        <dt>Original source</dt><dd>Checked against the linked source on {record.checkedOn}. This is separate from expert review.</dd>
        <dt>Expert review</dt><dd>Not yet reviewed by a botanist or pharmacist.</dd>
      </dl>
    </details>
    <div className="research-links">
      {number && record.href && <Link className="source-link" href={record.href}>Read health guidance ↗</Link>}
      {number && record.taxa.map((id) => <Link className="source-link" key={id} href={`/plants/${id}`}>About {id === "hibiscus" ? "roselle" : taxa.find((plant) => plant.id === id)?.common ?? id} ↗</Link>)}
    </div>
  </article>;
}

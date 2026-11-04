"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { identifyIngredient, splitIngredients, type Taxon } from "@/lib/matching";
import { LabelOcr } from "./label-ocr";
import { useScanTransfer } from "./scan-transfer";

const groups = ["Exact scientific-name matches", "Possible identities", "Unresolved ingredients"] as const;

export function ScanLabel({ taxa }: { taxa: Taxon[] }) {
  const [confirmed, setConfirmed] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const transfer = useScanTransfer();
  const router = useRouter();
  const entries = splitIngredients(confirmed).map((name) => ({ name, match: identifyIngredient(name, taxa) }));
  useEffect(() => { if (confirmed) heading.current?.focus(); }, [confirmed]);

  return <>
    <section className="capture-surface" aria-labelledby="scan-capture">
      <h2 id="scan-capture">Read the ingredient list</h2>
      <p>Fill the frame with the label. Check the spelling before you confirm.</p>
      <LabelOcr standalone onConfirm={setConfirmed} onEdit={() => setConfirmed("")} />
    </section>
    {confirmed && <section className="scan-results detail-section" aria-labelledby="scan-result-heading">
      <h2 id="scan-result-heading" ref={heading} tabIndex={-1}>What Ìtàn found</h2>
      <p>These matches describe the names on the label. The contents of the product remain unverified.</p>
      {groups.map((group, index) => {
        const rows = entries.filter(({ match }) => index === 0 ? match.kind === "exact" : index === 1 ? match.kind === "alias" || match.kind === "ambiguous" : match.kind === "unresolved");
        if (!rows.length) return null;
        return <section className="scan-match-group" key={group}>
          <h3>{group}</h3>
          <ul>{rows.map(({ name, match }, row) => <li key={`${name}-${row}`}>
            <strong>{name}</strong><p>{match.explanation}</p>
            <div className="research-links">{match.candidates.map((taxon) => <Link className="source-link" key={taxon.id} href={`/plants/${taxon.id}`}><i>{taxon.name}</i> ↗</Link>)}</div>
          </li>)}</ul>
        </section>;
      })}
      <button className="button" type="button" onClick={() => { transfer.setIngredients(confirmed); router.push("/compare"); }}>Compare with another product</button>
    </section>}
  </>;
}

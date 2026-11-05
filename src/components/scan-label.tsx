"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { identifyIngredient, splitIngredients, type Taxon } from "@/lib/matching";
import { LabelOcr } from "./label-ocr";
import { useScanTransfer } from "./scan-transfer";
import { ingredientLanguage } from "@/lib/consumer-language";
import { ResultGuide } from "./result-guide";

const groups = ["Names we matched", "Names that need checking", "Ingredients we couldn’t identify"] as const;

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
      <h2 id="scan-result-heading" ref={heading} tabIndex={-1}>Your ingredient results</h2>
      <ResultGuide found={`${entries.length} ingredient ${entries.length === 1 ? "name" : "names"} from the list you confirmed.`} meaning="We checked these names against our plant library. Some names may need more detail." unknown="Reading a label does not confirm the actual contents or safety of the product."><p>Open a plant below to learn more, or compare this list with another product.</p></ResultGuide>
      {groups.map((group, index) => {
        const rows = entries.filter(({ match }) => index === 0 ? match.kind === "exact" : index === 1 ? match.kind === "alias" || match.kind === "ambiguous" : match.kind === "unresolved");
        if (!rows.length) return null;
        return <section className="scan-match-group" key={group}>
          <h3>{group}</h3>
          <ul>{rows.map(({ name, match }, row) => <li key={`${name}-${row}`}>
            <strong>{name}</strong><p>{ingredientLanguage(match).explanation}</p>
            <div className="research-links">{match.candidates.map((taxon) => <Link className="source-link" key={taxon.id} href={`/plants/${taxon.id}`}>About {taxon.common} ↗</Link>)}</div>
            <details><summary>See the name check</summary><p>{match.explanation}</p>{match.candidates.map((taxon) => <p key={taxon.id}><i>{taxon.name}</i></p>)}</details>
          </li>)}</ul>
        </section>;
      })}
      <button className="button" type="button" onClick={() => { transfer.setIngredients(confirmed); router.push("/compare"); }}>Compare with another product</button>
    </section>}
  </>;
}

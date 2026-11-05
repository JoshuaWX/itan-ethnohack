import Link from "next/link";
import { RegulatoryGuide } from "@/components/regulatory-guide";

export default function VerifyPage() {
  return <div className="container page capture-page">
    <Link href="/" className="back">← Back to discover</Link>
    <div className="page-intro"><h1>Check an official product record</h1><p>Use NAFDAC’s own lookup and compare the result with the package in front of you.</p></div>
    <RegulatoryGuide />
    <section className="detail-section"><h2>Check more than the number</h2><ul>
      <li>Compare the product name and manufacturer’s name and address with the official result.</li>
      <li>Inspect the batch number, manufacture and expiry dates, packaging and seal. A public record may not contain batch information.</li>
      <li>If the details differ or you cannot confirm the record, seek clarification from NAFDAC or a pharmacist.</li>
    </ul><p>Official sources can differ in coverage, dates or details. Check each source separately and ask NAFDAC to clarify a discrepancy.</p><p>A number match does not authenticate the package. NAFDAC has published herbal-product alerts involving falsified registration details.</p><a className="source-link" href="https://nafdac.gov.ng/public-alert-no-08-2024-alert-on-falsified-coco-samba-herbal-mixture-containing-sildenafil-discovered-in-germany/" target="_blank" rel="noreferrer">Read the dated NAFDAC alert ↗</a></section>
    <details className="detail-section claim-method"><summary>Sources, coverage and permission</summary><p>NAFDAC publishes a herbal-products list and provides Greenbook and NAPAMS lookup interfaces. Coverage and current status must be checked in those services. Checked 5 November 2026.</p><p>Ìtàn has no documented NAFDAC API agreement or redistribution licence. It links to the official services and does not copy their result database. Example references identify records to inspect, not endorsements or confirmation of present registration.</p><a className="source-link" href="https://nafdac.gov.ng/herbal-products-database/" target="_blank" rel="noreferrer">Official herbal-products source ↗</a></details>
  </div>;
}

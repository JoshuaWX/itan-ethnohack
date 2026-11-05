import Link from "next/link";
import { RegulatoryGuide } from "@/components/regulatory-guide";

export default function VerifyPage() {
  return <div className="container page capture-page">
    <Link href="/" className="back">← Back to Home</Link>
    <div className="page-intro"><h1>Check a NAFDAC registration number</h1><p>NAFDAC is Nigeria’s food and drug regulator. Use its official websites to compare a product record with the package in front of you.</p></div>
    <RegulatoryGuide />
    <section className="detail-section"><h2>Check more than the number</h2><ul>
      <li>Compare the product name and manufacturer’s name and address with the official result.</li>
      <li>Inspect the batch number, manufacture and expiry dates, packaging and seal. A public record may not contain batch information.</li>
      <li>If the details differ or you cannot confirm the record, seek clarification from NAFDAC or a pharmacist.</li>
    </ul><p>The websites may show different dates or details. Check each one and ask NAFDAC about differences you cannot explain.</p><p>A matching number does not prove the package is genuine. NAFDAC has published warnings about herbal products carrying false registration details.</p><a className="source-link" href="https://nafdac.gov.ng/public-alert-no-08-2024-alert-on-falsified-coco-samba-herbal-mixture-containing-sildenafil-discovered-in-germany/" target="_blank" rel="noreferrer">Read NAFDAC’s published warning ↗</a></section>
    <details className="detail-section claim-method"><summary>Sources, coverage and permission</summary><p>NAFDAC publishes a herbal-products list and provides Greenbook and NAPAMS lookup interfaces. Coverage and current status must be checked in those services. Checked 5 November 2026.</p><p>Ìtàn has no documented NAFDAC API agreement or redistribution licence. It links to the official services and does not copy their result database. Example references identify records to inspect, not endorsements or confirmation of present registration.</p><a className="source-link" href="https://nafdac.gov.ng/herbal-products-database/" target="_blank" rel="noreferrer">Official herbal-products source ↗</a></details>
  </div>;
}

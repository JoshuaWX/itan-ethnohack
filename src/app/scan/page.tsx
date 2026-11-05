import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScanLabel } from "@/components/scan-label";
import { readCatalog } from "@/lib/catalog-server";

export default async function ScanPage() {
  const { taxa } = await readCatalog();
  return <div className="container page capture-page">
    <Link href="/" className="back"><ArrowLeft size={16} /> Back to Home</Link>
    <div className="page-intro">
      <h1>Scan a herbal product</h1>
      <p>Photograph the ingredients on the label, or type them below. Photo reading happens on this device; the image is not uploaded.</p>
    </div>
    <ScanLabel taxa={taxa} />
    <Link className="source-link" href="/#explore">Go to QR and registration lookup ↗</Link>
    <Link className="source-link" href="/verify">Open official NAFDAC checks ↗</Link>
  </div>;
}

import Link from "next/link";
import { ClaimExplorer } from "@/components/claim-explorer";

export default function ClaimsPage() {
  return <div className="container page capture-page">
    <Link className="back" href="/">← Back to Home</Link>
    <div className="page-intro"><h1>Check a plant claim</h1><p>Heard that a plant has a health benefit? See what the research in Ìtàn says and what is still unclear.</p></div>
    <ClaimExplorer />
  </div>;
}

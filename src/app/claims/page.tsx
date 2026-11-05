import Link from "next/link";
import { ClaimExplorer } from "@/components/claim-explorer";

export default function ClaimsPage() {
  return <div className="container page capture-page">
    <Link className="back" href="/">← Back to discover</Link>
    <div className="page-intro"><h1>Investigate a plant claim</h1><p>Follow a claim from its plant name to the studies, reported practices and evidence gaps.</p></div>
    <ClaimExplorer />
  </div>;
}

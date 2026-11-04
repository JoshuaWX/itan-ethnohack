import Link from "next/link";
import { IdentifyPlant } from "@/components/identify-plant";

export default function IdentifyPage() {
  return <div className="container page capture-page"><Link className="back" href="/">← Back to discover</Link><div className="page-intro"><h1>Identify a plant</h1><p>Use a plant photo to find possible names and explore the evidence.</p></div><IdentifyPlant /></div>;
}

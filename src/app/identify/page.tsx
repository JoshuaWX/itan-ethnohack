import Link from "next/link";
import { IdentifyPlant } from "@/components/identify-plant";

export default function IdentifyPage() {
  return <div className="container page"><Link className="back" href="/">← Back to discover</Link><div className="page-intro"><p className="overline">Explore a living plant</p><h1>What plant is this?</h1><p>Photograph a leaf, flower or fruit to explore possible names and evidence.</p></div><IdentifyPlant /></div>;
}

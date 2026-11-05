import Link from "next/link";
import { IdentifyPlant } from "@/components/identify-plant";

export default function IdentifyPage() {
  return <div className="container page capture-page"><Link className="back" href="/">← Back to Home</Link><div className="page-intro"><h1>Identify a plant</h1><p>Take a clear photo or choose one from your phone. We’ll suggest plant names and link to research where we have it.</p></div><IdentifyPlant /></div>;
}

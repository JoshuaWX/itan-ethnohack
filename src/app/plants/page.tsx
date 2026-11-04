import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { taxa } from "@/lib/catalog";
export default function PlantsPage() {
  return (
    <div className="container page">
      <div className="page-intro">
        <p className="overline">The plant collection</p>
        <h1>
          Names with stories.
          <br />
          <em>Evidence with context.</em>
        </h1>
        <p>
          Explore a small, curated set of botanical records. A plant name alone
          cannot tell you whether a product works.
        </p>
      </div>
      <div className="plant-directory">
        {taxa.map((plant, i) => (
          <Link
            className="plant-row"
            href={`/plants/${plant.id}`}
            key={plant.id}
          >
            <span className="ingredient-index">0{i + 1}</span>
            <div>
              <h2>{plant.common}</h2>
              <i>{plant.name}</i>
            </div>
            <ArrowUpRight size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
}

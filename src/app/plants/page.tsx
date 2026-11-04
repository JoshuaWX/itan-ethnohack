import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { readCatalog } from "@/lib/catalog-server";
import { PlantPhoto } from "@/components/plant-photo";
export default async function PlantsPage() {
  const { taxa, source } = await readCatalog();
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
      {source === "fallback" && <p>Using the versioned offline catalog. It may not include recent updates.</p>}
      <div className="plant-directory">
        {taxa.map((plant, i) => (<div key={plant.id} className="plant-directory-entry">
          <PlantPhoto id={plant.id} name={plant.common} />
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
        </div>))}
      </div>
    </div>
  );
}

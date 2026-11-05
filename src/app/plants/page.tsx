import { readCatalog } from "@/lib/catalog-server";
import { PlantDirectory } from "@/components/plant-directory";
import { nigerianPlants } from "@/lib/nigerian-plants";
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
      <PlantDirectory taxa={[...taxa].sort((a, b) => Number(Boolean(nigerianPlants[b.id])) - Number(Boolean(nigerianPlants[a.id])))} />
    </div>
  );
}

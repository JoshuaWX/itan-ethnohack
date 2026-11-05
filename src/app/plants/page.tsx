import { readCatalog } from "@/lib/catalog-server";
import { PlantDirectory } from "@/components/plant-directory";
import { nigerianPlants } from "@/lib/nigerian-plants";
export default async function PlantsPage() {
  const { taxa, source } = await readCatalog();
  return (
    <div className="container page">
      <div className="page-intro">
        <h1>Plant library</h1>
        <p>
          Find a plant by its common, local or scientific name. Read about
          traditional uses, research findings and what is still unknown.
        </p>
      </div>
      {source === "fallback" && <p>Using the plant library saved with this demo. Recent updates may be missing.</p>}
      <PlantDirectory taxa={[...taxa].sort((a, b) => Number(Boolean(nigerianPlants[b.id])) - Number(Boolean(nigerianPlants[a.id])))} />
    </div>
  );
}

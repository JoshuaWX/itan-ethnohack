import { Compare } from "@/components/compare";
import { readCatalog } from "@/lib/catalog-server";

export default async function ComparePage() {
  const catalog = await readCatalog();
  return <div className="container page"><Compare taxa={catalog.taxa} catalogSource={catalog.source} /></div>;
}

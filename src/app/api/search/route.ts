import { NextRequest, NextResponse } from "next/server";
import { readCatalog } from "@/lib/catalog-server";
import { getProductData } from "@/lib/product-data";
import { normalizeName } from "@/lib/matching";

export async function GET(request: NextRequest) {
  const { taxa } = await readCatalog();
  const { product } = getProductData();
  const input = request.nextUrl.searchParams.get("q") ?? "";
  if (input.length > 100)
    return NextResponse.json(
      { error: "Search is limited to 100 characters." },
      { status: 400 },
    );
  const query = normalizeName(input);
  if (!query) return NextResponse.json({ results: [] });
  const productMatch = normalizeName(
    `${product.name} ${product.number} hibiscus ginger cinnamon tea`,
  ).includes(query);
  const results = [
    ...(productMatch
      ? [
          {
            type: "product",
            id: product.id,
            name: product.name,
            subtitle: product.number,
          },
        ]
      : []),
    ...taxa
      .filter((plant) =>
        normalizeName(
          [plant.name, plant.common, ...plant.aliases].join(" "),
        ).includes(query),
      )
      .map((plant) => ({
        type: "plant",
        id: plant.id,
        name: plant.common,
        subtitle: plant.name,
      })),
  ];
  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "no-store" } },
  );
}

import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Ingredient = {
  label: string;
  display: string;
  amount: string;
  detail: string;
};
type RecordEntry = {
  date: string;
  end: string;
  form: string;
  applicant: string;
  manufacturer: string;
  location: string;
};
export type ProductData = {
  product: {
    id: string;
    name: string;
    number: string;
    description: string;
    records: RecordEntry[];
  };
  ingredients: Ingredient[];
  localSnapshot: boolean;
};

const demo: ProductData = {
  product: {
    id: "demo-herbal-tea",
    name: "Illustrative Herbal Tea",
    number: "DEMO-001",
    description: "Fictional product for demonstration",
    records: [],
  },
  ingredients: [
    {
      label: "hibiscus",
      display: "Hibiscus",
      amount: "",
      detail: "Illustrative ingredient",
    },
    {
      label: "ginger",
      display: "Ginger",
      amount: "",
      detail: "Illustrative ingredient",
    },
    {
      label: "cinnamon",
      display: "Cinnamon",
      amount: "",
      detail: "Illustrative ingredient",
    },
  ],
  localSnapshot: false,
};

export function getProductData(): ProductData {
  if (process.env.ITAN_LOCAL_NAFDAC_SNAPSHOT !== "1") return demo;
  try {
    const data = JSON.parse(
      readFileSync(
        join(process.cwd(), "data", "nafdac-rhimza.local.json"),
        "utf8",
      ),
    );
    if (
      !data.product?.id ||
      !data.product?.name ||
      !data.product?.number ||
      !Array.isArray(data.product.records) ||
      !Array.isArray(data.ingredients)
    )
      return demo;
    return { ...data, localSnapshot: true };
  } catch {
    return demo;
  }
}

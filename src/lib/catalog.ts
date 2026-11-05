import type { Taxon } from "./matching";

export const sources = {
  nafdac: "https://nafdac.gov.ng/herbal-products-database/",
  ginger: "https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:798372-1",
  hibiscus: "https://powo.science.kew.org/taxon/326388-2",
  verum: "https://powo.science.kew.org/taxon/463752-1",
  cassia: "https://powo.science.kew.org/taxon/463328-1",
  guava: "https://powo.science.kew.org/taxon/600841-1",
  ema: "https://www.ema.europa.eu/en/medicines/herbal/zingiberis-rhizoma",
  paper: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2911405/",
  ncdc: "https://www.ncdc.gov.ng/news/513/stop-cholera-public-health-advisory",
  who: "https://www.who.int/news/item/10-10-2019-the-use-of-non-pharmaceutical-forms-of-artemisia",
  malaria: "https://www.who.int/news-room/questions-and-answers/item/malaria",
};

export const taxa: Taxon[] = [
  {
    id: "hibiscus",
    name: "Sabdariffa gossypiifolia",
    common: "Hibiscus",
    aliases: [
      "Hibiscus sabdariffa",
      "hibiscus (calyces of hibiscus sabdariffa)",
      "roselle",
    ],
    source: sources.hibiscus,
  },
  {
    id: "ginger",
    name: "Zingiber officinale",
    common: "Ginger",
    aliases: ["organic ginger"],
    source: sources.ginger,
  },
  {
    id: "cinnamon-verum",
    name: "Cinnamomum verum",
    common: "Ceylon cinnamon",
    aliases: ["cinnamon"],
    source: sources.verum,
  },
  {
    id: "cinnamon-cassia",
    name: "Cinnamomum burmanni",
    common: "Java cinnamon",
    aliases: ["cinnamon"],
    source: sources.cassia,
  },
  {
    id: "guava",
    name: "Psidium guajava",
    common: "Guava",
    aliases: [],
    source: sources.guava,
  },
  {
    id: "bitter-leaf", name: "Gymnanthemum amygdalinum", common: "Bitter leaf",
    aliases: ["Vernonia amygdalina", "Ewuro", "Onugbu", "Shuwaka"],
    source: "https://powo.science.kew.org/taxon/210886-1",
  },
  {
    id: "neem", name: "Azadirachta indica", common: "Neem",
    aliases: ["Dogon yaro", "Dongoyaro"],
    source: "https://powo.science.kew.org/taxon/1213180-2",
  },
  {
    id: "papaya", name: "Carica papaya", common: "Pawpaw (papaya)",
    aliases: ["papaya", "pawpaw", "Ibepe"],
    source: "https://powo.science.kew.org/taxon/30011248-2",
  },
];

export function getTaxon(id: string) {
  return taxa.find((taxon) => taxon.id === id);
}

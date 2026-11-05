const kwara = "https://pmc.ncbi.nlm.nih.gov/articles/PMC10504731/";
const northCentral = "https://pmc.ncbi.nlm.nih.gov/articles/PMC11870763/";

type Profile = {
  family: string;
  authority: string;
  nameNote?: string;
  names: { name: string; language: string; source: string }[];
  context: string;
  practices: string;
  practiceSource: string;
  caution: string;
};

export const nigerianPlants: Record<string, Profile> = {
  "bitter-leaf": {
    family: "Asteraceae", authority: "(Delile) Sch.Bip.",
    nameNote: "Kew accepts Gymnanthemum amygdalinum. Much of the research uses the synonym Vernonia amygdalina.",
    names: [
      { name: "Ewuro", language: "Yoruba", source: northCentral },
      { name: "Onugbu", language: "Igbo", source: northCentral },
      { name: "Shuwaka", language: "Hausa", source: northCentral },
    ],
    context: "A Kwara State survey records bitter-leaf leaves among plants reported by traditional practitioners for malaria. This documents use, not treatment effectiveness.",
    practices: "A North Central Nigerian survey documents squeezed leaf juice, water decoctions and alcohol maceration in obesity-related practices.",
    practiceSource: northCentral,
    caution: "A rat study found altered metformin exposure with an aqueous leaf extract. Human interaction risk is uncertain. Discuss herbal use with a pharmacist, especially when taking glucose-lowering medicines.",
  },
  neem: {
    family: "Meliaceae", authority: "A.Juss.",
    names: [{ name: "Dogon yaro", language: "Hausa", source: northCentral }],
    context: "The Kwara survey records neem roots and leaves in reported malaria practices. That record does not establish clinical efficacy.",
    practices: "The North Central survey records crushed leaves boiled in water in obesity-related practices.",
    practiceSource: northCentral,
    caution: "The curated diabetes trial studied a standardized leaf-and-twig extract alongside metformin. It cannot establish safety of neem oil, home preparations, use in pregnancy or use while breastfeeding.",
  },
  papaya: {
    family: "Caricaceae", authority: "L.",
    names: [{ name: "Ibepe", language: "Yoruba", source: northCentral }],
    context: "The Kwara survey records papaya leaves and unripe fruit in reported malaria practices. This is ethnobotanical documentation.",
    practices: "The North Central survey records blended fruit juice in obesity-related practices. Fruit use and medicinal leaf extracts are different preparations.",
    practiceSource: northCentral,
    caution: "A safety review reports reproductive and liver-toxicity concerns from preclinical evidence. The small dengue trial excluded pregnancy and breastfeeding. The available records cannot establish safety in these groups.",
  },
};

export const ethnobotanicalContextSource = kwara;

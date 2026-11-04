export type Taxon = {
  id: string;
  name: string;
  common: string;
  aliases: string[];
  source: string;
};
export type Match = {
  kind: "exact" | "alias" | "ambiguous" | "unresolved";
  candidates: Taxon[];
  explanation: string;
};

export function normalizeName(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en");
}

export function identifyIngredient(input: string, taxa: Taxon[]): Match {
  const name = normalizeName(input);
  if (!name)
    return {
      kind: "unresolved",
      candidates: [],
      explanation: "No ingredient name supplied.",
    };
  const exact = taxa.filter((taxon) => normalizeName(taxon.name) === name);
  if (exact.length > 1)
    return {
      kind: "ambiguous",
      candidates: exact,
      explanation:
        "More than one catalog entry uses this name. The identity needs review.",
    };
  if (exact.length === 1)
    return {
      kind: "exact",
      candidates: exact,
      explanation: "Matches the scientific name in this catalog.",
    };
  const candidates = taxa.filter((taxon) =>
    [taxon.common, ...taxon.aliases].some(
      (alias) => normalizeName(alias) === name,
    ),
  );
  if (candidates.length > 1)
    return {
      kind: "ambiguous",
      candidates,
      explanation:
        "This name can refer to more than one plant. The label does not identify which one.",
    };
  if (candidates.length === 1)
    return {
      kind: "alias",
      candidates,
      explanation:
        "Matches a documented common name or label alias in this catalog.",
    };
  return {
    kind: "unresolved",
    candidates: [],
    explanation:
      "No match in this small catalog. This does not mean the ingredient is invalid.",
  };
}

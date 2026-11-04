import { test } from "node:test";
import assert from "node:assert/strict";
import { identifyIngredient } from "../src/lib/matching.ts";
import { taxa } from "../src/lib/catalog.ts";

// Separately authored challenge cases; this is a small catalog-specific fixture,
// not an independently annotated or representative real-world dataset.
const cases = [
  ["ZINGIBER OFFICINALE", "exact", ["ginger"]],
  ["  Zingiber\t offIcinale  ", "exact", ["ginger"]],
  ["Ｓａｂｄａｒｉｆｆａ ｇｏｓｓｙｐｉｉｆｏｌｉａ", "exact", ["hibiscus"]],
  ["Cinnamomum burmanni", "exact", ["cinnamon-cassia"]],
  ["Psidium guajava", "exact", ["guava"]],
  ["Hibiscus sabdariffa", "alias", ["hibiscus"]],
  ["ROSELLE", "alias", ["hibiscus"]],
  [" ginger ", "alias", ["ginger"]],
  ["organic   ginger", "alias", ["ginger"]],
  ["ceylon cinnamon", "alias", ["cinnamon-verum"]],
  ["java cinnamon", "alias", ["cinnamon-cassia"]],
  ["guava", "alias", ["guava"]],
  ["cinnamon", "ambiguous", ["cinnamon-verum", "cinnamon-cassia"]],
  [" CINNAMON ", "ambiguous", ["cinnamon-verum", "cinnamon-cassia"]],
  ["Cinnamomum", "unresolved", []],
  ["Zingiber", "unresolved", []],
  ["Cinnamomum cassia", "unresolved", []],
  ["ginger root extract", "unresolved", []],
  ["gingre", "unresolved", []],
  ["Hibiscus sabdariffa L.", "unresolved", []],
  ["Artemisia annua", "unresolved", []],
  ["garlic", "unresolved", []],
  ["DEMO-001", "unresolved", []],
  ["\t  ", "unresolved", []],
] as const;

test("challenge set measures matches, ambiguity and abstention", () => {
  const counts = { correctMatches: 0, incorrectMatches: 0, correctAmbiguous: 0, correctAbstentions: 0, otherErrors: 0 };
  for (const [input, expected, ids] of cases) {
    const result = identifyIngredient(input, taxa);
    const correct = result.kind === expected && result.candidates.map((taxon) => taxon.id).join("|") === ids.join("|");
    if (correct && (expected === "exact" || expected === "alias")) counts.correctMatches++;
    else if (correct && expected === "ambiguous") counts.correctAmbiguous++;
    else if (correct && expected === "unresolved") counts.correctAbstentions++;
    else if (result.kind === "exact" || result.kind === "alias") counts.incorrectMatches++;
    else counts.otherErrors++;
  }
  console.log(`Challenge cases (${cases.length}, catalog-specific): ${JSON.stringify(counts)}`);
  assert.equal(counts.incorrectMatches + counts.otherErrors, 0);
});

test("duplicate exact names are ambiguous rather than a confident match", () => {
  const duplicate = { ...taxa[0], id: "duplicate" };
  const result = identifyIngredient(taxa[0].name, [taxa[0], duplicate]);
  assert.equal(result.kind, "ambiguous");
  assert.equal(result.candidates.length, 2);
});

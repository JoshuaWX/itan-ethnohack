import { test } from "node:test";
import assert from "node:assert/strict";
import { identifyIngredient, normalizeName } from "../src/lib/matching.ts";
import { taxa } from "../src/lib/catalog.ts";
import { researchCollection } from "../src/lib/research-collection.ts";
import { classifyEvidence } from "../src/lib/evidence.ts";

const cases = [
  { input: " Zingiber   officinale ", expected: "exact", ids: ["ginger"] },
  { input: "ORGANIC GINGER", expected: "alias", ids: ["ginger"] },
  { input: "Hibiscus sabdariffa", expected: "alias", ids: ["hibiscus"] },
  {
    input: "hibiscus (calyces of hibiscus sabdariffa)",
    expected: "alias",
    ids: ["hibiscus"],
  },
  {
    input: "cinnamon",
    expected: "ambiguous",
    ids: ["cinnamon-verum", "cinnamon-cassia"],
  },
  { input: "Cinnamomum verum", expected: "exact", ids: ["cinnamon-verum"] },
  { input: "unknown plant", expected: "unresolved", ids: [] },
  { input: "", expected: "unresolved", ids: [] },
] as const;

test("curated matching cases preserve ambiguous and unresolved outcomes", () => {
  let exactOnlyCorrect = 0;
  for (const row of cases) {
    const result = identifyIngredient(row.input, taxa);
    assert.equal(result.kind, row.expected, row.input);
    assert.deepEqual(
      result.candidates.map((p) => p.id),
      [...row.ids],
      row.input,
    );
    const exact = taxa.filter(
      (taxon) => normalizeName(taxon.name) === normalizeName(row.input),
    );
    const baselineKind = exact.length === 1 ? "exact" : "unresolved";
    if (baselineKind === row.expected && exact.map((p) => p.id).join() === [...row.ids].join()) {
      exactOnlyCorrect++;
    }
  }
  console.log(
    `Matcher evaluation: ${cases.length}/${cases.length} expected outcomes on hand-authored cases`,
  );
  console.log(`Exact-name-only baseline: ${exactOnlyCorrect}/${cases.length}; this small fixture set is not an independent validation dataset`);
});

test("evidence classification requires explicit study metadata", () => {
  for (const [input, expected] of [
    ["traditional use", "traditional"],
    ["in vitro", "laboratory"],
    ["animal", "animal"],
    ["human", "human"],
    ["official guidance", "guidance"],
    ["a paper about a plant", "unknown"],
    ["", "unknown"],
  ]) {
    assert.equal(classifyEvidence(input), expected);
  }
  assert.equal(
    classifyEvidence(
      researchCollection.find((row) => row.id === "guava-lab")?.type ?? "",
    ),
    "laboratory",
  );
  assert.equal(
    classifyEvidence(
      researchCollection.find((row) => row.id === "ginger-ema")?.type ?? "",
    ),
    "traditional",
  );
});

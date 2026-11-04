import { test } from "node:test";
import assert from "node:assert/strict";
import { compareProducts, findInteractionEvidence, interactionRecords } from "../src/lib/comparison.ts";
import { taxa } from "../src/lib/catalog.ts";

test("compares aliases, ambiguity and unknown names across products", () => {
  const result = compareProducts([
    { name: "A", ingredients: ["hibiscus", "cinnamon", "unknown"] },
    { name: "B", ingredients: ["roselle", "Cinnamomum verum"] },
  ], taxa);
  assert.deepEqual(result.shared.map((row) => row.id), []);
  assert.deepEqual(result.possible.map((row) => row.id), ["hibiscus", "cinnamon-verum"]);
  assert.equal(result.products[0].ingredients[2].match.kind, "unresolved");
});

test("a duplicate within one product does not count as overlap", () => {
  const result = compareProducts([{ name: "A", ingredients: ["ginger", "organic ginger"] }, { name: "B", ingredients: ["guava"] }], taxa);
  assert.equal(result.shared.length, 0);
});

test("interaction evidence is scoped to roselle and simvastatin", () => {
  assert.equal(interactionRecords[0].taxonId, "hibiscus");
  assert.equal(interactionRecords[0].medicine, "simvastatin");
  assert.match(interactionRecords[0].source, /28925046/);
  const result = compareProducts([{ name: "A", ingredients: ["roselle"] }, { name: "B", ingredients: ["guava"] }], taxa);
  assert.equal(findInteractionEvidence(result.products, "simvastatin", interactionRecords).length, 1);
  assert.equal(findInteractionEvidence(result.products, "", interactionRecords).length, 0);
  const noRoselle = compareProducts([{ name: "A", ingredients: ["ginger"] }, { name: "B", ingredients: ["guava"] }], taxa);
  assert.equal(findInteractionEvidence(noRoselle.products, "simvastatin", interactionRecords).length, 0);
});

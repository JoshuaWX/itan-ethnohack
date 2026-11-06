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

test("documented medicine studies appear for a matched plant without a selected medicine", () => {
  const result = compareProducts([{ name: "A", ingredients: ["roselle"] }, { name: "B", ingredients: ["guava"] }], taxa);
  const found = findInteractionEvidence(result.products, "", interactionRecords);
  assert.equal(found.length, 1);
  assert.equal(found[0].taxonId, "hibiscus");
  assert.match(found[0].source, /28925046/);
  assert.equal(findInteractionEvidence(result.products, "simvastatin", interactionRecords)[0]?.medicine, "simvastatin");
  assert.equal(findInteractionEvidence(result.products, "metformin", interactionRecords).length, 0);
  const noRoselle = compareProducts([{ name: "A", ingredients: ["ginger"] }, { name: "B", ingredients: ["guava"] }], taxa);
  assert.equal(findInteractionEvidence(noRoselle.products, "", interactionRecords).length, 0);
});

test("a medicine choice narrows the studies instead of hiding every other plant", () => {
  const result = compareProducts([{ name: "A", ingredients: ["roselle", "Ewuro"] }], taxa);
  assert.deepEqual(findInteractionEvidence(result.products, "", interactionRecords).map((row) => row.medicine), ["metformin", "simvastatin"]);
  assert.deepEqual(findInteractionEvidence(result.products, "metformin", interactionRecords).map((row) => row.taxonId), ["bitter-leaf"]);
});

test("local-name comparison links bitter leaf to the preclinical metformin record", () => {
  const result = compareProducts([{ name: "A", ingredients: ["Ewuro"] }, { name: "B", ingredients: ["neem"] }], taxa);
  const found = findInteractionEvidence(result.products, "metformin", interactionRecords);
  assert.equal(found.length, 1);
  assert.match(found[0].summary, /rats/);
  assert.match(found[0].source, /39710889/);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { mapPlantCandidates } from "../src/lib/plant-identification.ts";
import { taxa } from "../src/lib/catalog.ts";

test("provider candidates preserve score, map synonyms and leave unknowns unresolved", () => {
  const input = { results: [
    { score: 0.7, species: { scientificNameWithoutAuthor: "Hibiscus sabdariffa", commonNames: ["roselle"] } },
    { score: 0.2, species: { scientificNameWithoutAuthor: "Unknown species" } },
    { score: 4, species: { scientificNameWithoutAuthor: "Zingiber officinale" } },
  ] };
  const results = mapPlantCandidates(input, taxa);
  assert.equal(results.length, 2);
  assert.equal(results[0].score, 0.7);
  assert.equal(results[0].match.candidates[0].id, "hibiscus");
  assert.equal(results[1].match.kind, "unresolved");
  assert.throws(() => mapPlantCandidates({}, taxa));
});

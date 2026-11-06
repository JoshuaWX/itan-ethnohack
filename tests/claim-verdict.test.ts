import assert from "node:assert/strict";
import test from "node:test";
import { analyzeClaim } from "../src/lib/claim-analysis.ts";
import { retrieveEvidence, suggestPlantNames } from "../src/lib/research-retrieval.ts";
import { verdictLanguage } from "../src/lib/consumer-language.ts";

test("overall verdict ranks human studies above animal and traditional records", () => {
  assert.equal(analyzeClaim("Does bitter leaf lower blood sugar?").verdict.level, "not-shown-in-people");
  assert.equal(analyzeClaim("Bitter leaf lowers blood sugar in rats").verdict.level, "animal-or-lab-only");
  assert.equal(analyzeClaim("Neem lowers blood sugar").verdict.level, "some-support-in-people");
  assert.equal(analyzeClaim("Ginger speeds gastric emptying").verdict.level, "mixed-in-people");
  assert.equal(analyzeClaim("Ginger helps digestion").verdict.level, "traditional-only");
  assert.equal(analyzeClaim("Does guava stop diarrhoea?").verdict.level, "animal-or-lab-only");
  assert.equal(analyzeClaim("Neem always cures diabetes").verdict.level, "overstated");
  assert.equal(analyzeClaim("Does neem cure malaria?").verdict.level, "official-guidance");
});

test("near-miss plant names are suggested and never used to select evidence", () => {
  const suggested = suggestPlantNames("Does bitterleef lower sugar?");
  assert.deepEqual(suggested.map(({ id }) => id), ["bitter-leaf"]);
  const result = analyzeClaim("Does bitterleef lower sugar?");
  assert.equal(result.records.length, 0);
  assert.equal(result.verdict.level, "needs-clarification");
  assert.equal(retrieveEvidence("Gingr stomach emptying").records.length, 0);
  assert.equal(suggestPlantNames("Gingr stomach emptying")[0]?.id, "ginger");
});

test("interaction questions require an interaction record, not a co-mentioned medicine", () => {
  assert.deepEqual(retrieveEvidence("Does neem interact with metformin?").records.map(({ id }) => id), []);
  assert.deepEqual(retrieveEvidence("Does bitter leaf interact with metformin?").records.map(({ id }) => id), ["bitter-leaf-metformin"]);
});

test("plain verdicts keep nonsignificant human findings from being called ineffective", () => {
  const language = verdictLanguage(analyzeClaim("Does bitter leaf lower blood sugar?"));
  assert.match(language.found, /did not show a clear change/);
  assert.doesNotMatch(language.found + language.meaning, /ineffective|disproven|does not work|safe/i);
  assert.match(language.meaning, /Animal or laboratory work points the same way/);
});

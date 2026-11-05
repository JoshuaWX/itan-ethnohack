import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import sharp from "sharp";
import { taxa } from "../src/lib/catalog.ts";
import { compareProducts } from "../src/lib/comparison.ts";
import { identifyIngredient, splitIngredients } from "../src/lib/matching.ts";
import { mapPlantCandidates } from "../src/lib/plant-identification.ts";
import { extractIngredientSection } from "../src/lib/label-text.ts";
import { prepareIdentificationImage, readUploadBody } from "../src/lib/identification-image.ts";
import { analyzeClaim } from "../src/lib/claim-analysis.ts";
import { retrieveEvidence } from "../src/lib/research-retrieval.ts";

test("audit: 200 seeded comparisons preserve symmetry, original text and duplicate invariants", () => {
  let seed = 20261105;
  const next = () => { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2 ** 32; };
  const values = [...taxa.map(t => t.name), "cinnamon", "organic ginger", "unknown", "<script>alert(1)</script>", "x".repeat(4000)];
  for (let n = 0; n < 200; n++) {
    const input = Array.from({ length: n % 2 ? 2 : 3 }, (_, p) => ({ name: "P" + p, ingredients: Array.from({ length: Math.floor(next() * 6) }, () => values[Math.floor(next() * values.length)]) }));
    const result = compareProducts(input, taxa);
    const reversed = compareProducts([...input].reverse(), taxa);
    const deduplicated = compareProducts(input.map(p => ({ ...p, ingredients: [...new Set(p.ingredients)] })), taxa);
    assert.deepEqual(result.shared.map(t => t.id), reversed.shared.map(t => t.id));
    assert.deepEqual(result.possible.map(t => t.id), reversed.possible.map(t => t.id));
    assert.deepEqual(result.shared.map(t => t.id), deduplicated.shared.map(t => t.id));
    assert.deepEqual(result.possible.map(t => t.id), deduplicated.possible.map(t => t.id));
    input.forEach((p, i) => assert.deepEqual(result.products[i].ingredients.map(x => x.original), p.ingredients));
    for (const shared of result.shared) assert.ok(input.filter(p => p.ingredients.some(x => identifyIngredient(x, taxa).kind === "exact" && identifyIngredient(x, taxa).candidates[0].id === shared.id)).length >= 2);
  }
});

test("audit: 100 malformed provider rows are discarded, ranked candidates are bounded", () => {
  const invalid = [null, false, 3, "plant", {}, { score: NaN }, { score: 2, species: {scientificNameWithoutAuthor:"ginger"} }, { score:.3, species: {scientificNameWithoutAuthor:{name:"x"}} }];
  for (let i = 0; i < 100; i++) {
    const results = mapPlantCandidates({ results: [invalid[i % invalid.length], {score:.3,species:{scientificNameWithoutAuthor:"Zingiber officinale",commonNames:[{},"Ginger"]}}, {score:.8,species:{scientificNameWithoutAuthor:"Unknown species",commonNames:42}}] }, taxa);
    assert.equal(results.length, 2);
    assert.ok(results.every(x => typeof x.common === "string"));
    assert.equal(results[0].score, .8);
    assert.equal(results[0].match.kind, "unresolved");
  }
  const ranked = mapPlantCandidates({ results: Array.from({length: 9}, (_, n) => ({score: n / 10, species: {scientificNameWithoutAuthor: `Unknown candidate ${n}`} })) }, taxa);
  assert.deepEqual(ranked.map(x => x.score), [.8,.7,.6,.5,.4]);
});

test("audit: 7 label parsing cases retain multiline ingredients and stop before instructions", () => {
  const cases = [
    ["Ingredients: ginger, guava", "ginger, guava"],
    ["COMPOSITION:\nZingiber officinale;\nPsidium guajava\nDirections: do not ingest this test label", "Zingiber officinale;\nPsidium guajava"],
    ["Ingredients: hibiscus\nginger\nStorage: cool place", "hibiscus\nginger"],
    ["Ingredients:\n\ncinnamon\nWarnings: test", "cinnamon"],
    ["Not an ingredient list", ""],
    ["Ingredients: guava\n\nPhone: test", "guava"],
    ["Ingredients: unknown\nNAFDAC: DEMO", "unknown"],
  ];
  for (const [input, expected] of cases) assert.equal(extractIngredientSection(input), expected);
  assert.deepEqual(splitIngredients("ginger;guava\ncinnamon,unknown"), ["ginger","guava","cinnamon","unknown"]);
});

test("audit: images must decode, fit the pixel limit, and have metadata removed", async () => {
  const source = await readFile(new URL("./fixtures/label-0.png", import.meta.url));
  const output = await prepareIdentificationImage(source);
  const meta = await sharp(output).metadata();
  assert.equal(meta.format, "jpeg");
  assert.equal(meta.exif, undefined);
  await assert.rejects(prepareIdentificationImage(new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0])));
  await assert.rejects(prepareIdentificationImage(new TextEncoder().encode("not a photo")));
  const large = await sharp({create:{width:5000,height:5000,channels:3,background:"white"}}).png().toBuffer();
  await assert.rejects(prepareIdentificationImage(large));
});

test("audit: upload byte bound ignores a lying content-length header", async () => {
  const request = new Request("https://test.invalid", {method:"POST",headers:{"content-length":"1"},body:"x".repeat(17)});
  await assert.rejects(readUploadBody(request,16), RangeError);
});

test("audit: adult data, nonsignificance and ambiguous negation cannot prove broader claims", () => {
  assert.equal(analyzeClaim("Hibiscus lowers blood pressure in children").records[0].relation, "does-not-answer");
  assert.equal(analyzeClaim("Ewuro lowers blood sugar").records.find(x=>x.record.id==="bitter-leaf-human-glucose")?.relation, "partially-addresses");
  assert.ok(analyzeClaim("Ginger does not slow stomach emptying").records.every(x=>x.relation!=="supports"));
  assert.ok(analyzeClaim("Papaya increases platelet count in pregnant women").records.every(x=>x.relation!=="supports"));
});

test("audit: independent language and follow-up regressions retain topic boundaries", () => {
  assert.ok(retrieveEvidence("Abeg what research is available on ginger?").records.length > 0);
  assert.equal(identifyIngredient("Zobo", taxa).kind, "alias");
  assert.equal(retrieveEvidence("Zobo blood pressure").records[0]?.id, "roselle-blood-pressure");
  assert.ok(retrieveEvidence("What has ginger been studied for in people?").records.every(x=>x.type==="human"));
  assert.equal(retrieveEvidence("Neem glucose").records[0]?.id,"neem-human-glucose");
  assert.deepEqual(retrieveEvidence("What were their limitations?",{priorIds:["ginger-emptying-wu","ginger-emptying-phillips"]}).records.map(x=>x.id),["ginger-emptying-wu","ginger-emptying-phillips"]);
  assert.equal(retrieveEvidence("Does it cure cancer?",{priorIds:["ginger-ema"]}).records.length,0);
});

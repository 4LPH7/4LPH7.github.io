import assert from "node:assert/strict";
import { test } from "node:test";
import { GLYPHS, scrambleFrame } from "./scramble.ts";

test("scramble keeps the word's length on every frame", () => {
  for (let f = 0; f <= 10; f++) assert.equal(scrambleFrame("4LPH7", f / 10).length, 5);
});

test("scramble settles letters left to right and ends on the real word", () => {
  assert.equal(scrambleFrame("4LPH7", 1), "4LPH7");
  assert.equal(scrambleFrame("4LPH7", 0.6, () => 0).slice(0, 3), "4LP");
  assert.equal(scrambleFrame("4LPH7", 0.6, () => 0).slice(3), GLYPHS[0].repeat(2));
});

test("scramble at the start uses only glyphs from the set", () => {
  for (const ch of scrambleFrame("4LPH7", 0)) assert.ok(GLYPHS.includes(ch));
});

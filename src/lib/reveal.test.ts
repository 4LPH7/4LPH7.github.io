import assert from "node:assert/strict";
import { test } from "node:test";
import { isBelowFold, revealedCount, splitWords, staggerDelay } from "./reveal.ts";

test("splitWords splits on whitespace and drops empties", () => {
  assert.deepEqual(splitWords("  I turn   ideas\ninto  web "), ["I", "turn", "ideas", "into", "web"]);
});

test("revealedCount is 0 at the start and total at the end", () => {
  assert.equal(revealedCount(0, 10), 0);
  assert.equal(revealedCount(1, 10), 10);
});

test("revealedCount scales linearly and rounds", () => {
  assert.equal(revealedCount(0.5, 10), 5);
  assert.equal(revealedCount(0.34, 10), 3);
});

test("revealedCount clamps out-of-range progress", () => {
  assert.equal(revealedCount(-0.2, 10), 0);
  assert.equal(revealedCount(1.7, 10), 10);
});

test("staggerDelay steps by index and starts at zero", () => {
  assert.equal(staggerDelay(0), 0);
  assert.equal(staggerDelay(2), 160);
  assert.equal(staggerDelay(3, 50), 150);
});

test("staggerDelay is capped and ignores negative indexes", () => {
  assert.equal(staggerDelay(50), 400);
  assert.equal(staggerDelay(9, 100, 250), 250);
  assert.equal(staggerDelay(-3), 0);
});

test("isBelowFold is true only for elements starting past the margin of the viewport", () => {
  assert.equal(isBelowFold(1200, 800), true);
  assert.equal(isBelowFold(400, 800), false);
  assert.equal(isBelowFold(-300, 800), false);
  assert.equal(isBelowFold(720, 800), false);
  assert.equal(isBelowFold(721, 800), true);
});

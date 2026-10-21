import assert from "node:assert/strict";
import { test } from "node:test";
import { pickDirection, step, swipeDelta } from "./carousel.ts";

test("step moves forward and back", () => {
  assert.equal(step(1, 1, 5), 2);
  assert.equal(step(3, -1, 5), 2);
});

test("step wraps at both ends", () => {
  assert.equal(step(4, 1, 5), 0);
  assert.equal(step(0, -1, 5), 4);
});

test("step on a single item stays put", () => {
  assert.equal(step(0, 1, 1), 0);
  assert.equal(step(0, -1, 1), 0);
});

test("swipe left (finger moves left) goes next, right goes previous", () => {
  assert.equal(swipeDelta(300, 200), 1);
  assert.equal(swipeDelta(200, 300), -1);
});

test("short drags are ignored", () => {
  assert.equal(swipeDelta(200, 230), 0);
  assert.equal(swipeDelta(200, 170), 0);
});

test("pickDirection slides forward, back, and not at all for the current item", () => {
  assert.equal(pickDirection(1, 4), 1);
  assert.equal(pickDirection(4, 1), -1);
  assert.equal(pickDirection(2, 2), 0);
});

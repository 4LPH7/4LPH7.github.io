import assert from "node:assert/strict";
import { test } from "node:test";
import { formatTime } from "./time.ts";

test("formats seconds as m:ss", () => {
  assert.equal(formatTime(0), "0:00");
  assert.equal(formatTime(65.7), "1:05");
  assert.equal(formatTime(600), "10:00");
});

test("bad input shows 0:00", () => {
  assert.equal(formatTime(Number.NaN), "0:00");
  assert.equal(formatTime(Number.POSITIVE_INFINITY), "0:00");
  assert.equal(formatTime(-5), "0:00");
});

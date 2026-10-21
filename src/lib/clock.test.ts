import assert from "node:assert/strict";
import { test } from "node:test";
import { formatClock } from "./clock.ts";

test("formats a UTC instant as 12-hour time in Asia/Kolkata", () => {
  assert.equal(formatClock(new Date("2026-10-21T09:48:19Z"), "Asia/Kolkata"), "03:18:19 PM");
});

test("zero-pads hours and handles midnight", () => {
  assert.equal(formatClock(new Date("2026-10-21T18:30:05Z"), "Asia/Kolkata"), "12:00:05 AM");
  assert.equal(formatClock(new Date("2026-10-21T03:35:09Z"), "Asia/Kolkata"), "09:05:09 AM");
});

test("respects the requested time zone", () => {
  assert.equal(formatClock(new Date("2026-10-21T12:00:00Z"), "UTC"), "12:00:00 PM");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { canUse3D } from "./gpu.ts";

const ok = { reducedMotion: false, webgl: true, cores: 8, memory: 8, saveData: false };

test("capable desktop gets the 3D scene", () => {
  assert.equal(canUse3D(ok), true);
});

test("reduced motion, no WebGL, or save-data fall back to the static card", () => {
  assert.equal(canUse3D({ ...ok, reducedMotion: true }), false);
  assert.equal(canUse3D({ ...ok, webgl: false }), false);
  assert.equal(canUse3D({ ...ok, saveData: true }), false);
});

test("low-end devices fall back", () => {
  assert.equal(canUse3D({ ...ok, cores: 2 }), false);
  assert.equal(canUse3D({ ...ok, memory: 2 }), false);
});

test("unknown cores/memory (undefined) do not block 3D", () => {
  assert.equal(canUse3D({ ...ok, cores: undefined, memory: undefined }), true);
});

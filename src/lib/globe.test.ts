import assert from "node:assert/strict";
import { test } from "node:test";
import { fibonacciSphere, latLon, project } from "./globe.ts";

const len = (p: { x: number; y: number; z: number }) => Math.hypot(p.x, p.y, p.z);

test("fibonacciSphere returns n unit vectors", () => {
  const pts = fibonacciSphere(400);
  assert.equal(pts.length, 400);
  for (const p of pts) assert.ok(Math.abs(len(p) - 1) < 1e-9);
});

test("fibonacciSphere covers both hemispheres", () => {
  const pts = fibonacciSphere(400);
  assert.ok(pts.some((p) => p.y > 0.9) && pts.some((p) => p.y < -0.9));
});

test("latLon maps (0,0) to +z and the north pole to +y", () => {
  const o = latLon(0, 0);
  assert.ok(Math.abs(o.z - 1) < 1e-9 && Math.abs(o.x) < 1e-9 && Math.abs(o.y) < 1e-9);
  assert.ok(Math.abs(latLon(90, 0).y - 1) < 1e-9);
});

test("a point on the facing side is visible, the far side is not", () => {
  assert.equal(project({ x: 0, y: 0, z: 1 }, 0).visible, true);
  assert.equal(project({ x: 0, y: 0, z: -1 }, 0).visible, false);
});

test("rotating by pi turns the far side to face the viewer", () => {
  assert.equal(project({ x: 0, y: 0, z: -1 }, Math.PI).visible, true);
});

test("a full turn returns to the same screen position", () => {
  const a = project({ x: 0.6, y: 0.3, z: 0.74 }, 0);
  const b = project({ x: 0.6, y: 0.3, z: 0.74 }, Math.PI * 2);
  assert.ok(Math.abs(a.x - b.x) < 1e-9 && Math.abs(a.y - b.y) < 1e-9);
});

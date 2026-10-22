import assert from "node:assert/strict";
import { test } from "node:test";
import { type Blob, makeBlob, RIM, SQUEEZE, shapeFoam, stepFoam } from "./foam.ts";

const W = 600;
const H = 400;
const shown = (b: Blob) => { b.scale = 1; b.target = 1; return b; };

/** 17 bubbles on a golden-angle spiral, like the toolbox. */
const cluster = () => Array.from({ length: 17 }, (_, i) => {
  const a = i * 2.399;
  const d = Math.sqrt(i / 17) * 120;
  return shown(makeBlob(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d, i % 3 ? 40 : 52));
});

const settle = (blobs: Blob[], steps = 1500) => { for (let i = 0; i < steps; i++) stepFoam(blobs, 1 / 120, { w: W, h: H }); };

test("a packed cluster presses together but never squeezes past the limit", () => {
  const blobs = cluster();
  settle(blobs);
  let pressed = 0;
  for (let i = 0; i < blobs.length; i++)
    for (let j = i + 1; j < blobs.length; j++) {
      const a = blobs[i];
      const b = blobs[j];
      const overlap = a.r + b.r - Math.hypot(a.x - b.x, a.y - b.y);
      assert.ok(overlap <= SQUEEZE * Math.min(a.r, b.r) + 0.5, `too deep ${i}/${j}: ${overlap}`);
      if (overlap > 1) pressed++;
    }
  assert.ok(pressed > 5, "neighbours should squash into each other a little");
  for (const b of blobs) assert.ok(b.x > 0 && b.x < W && b.y > 0 && b.y < H, `left the field: ${b.x},${b.y}`);
});

test("outlines go flat where two bubbles meet", () => {
  const a = shown(makeBlob(100, 100, 50));
  const b = shown(makeBlob(180, 100, 50));
  a.r = 50;
  b.r = 50;
  for (let i = 0; i < 600; i++) shapeFoam([a, b], 1 / 120, 1000, 1000);
  assert.ok(Math.abs(a.rim[0] - 40) < 1.5, `facing side should sit on the shared wall at 40, got ${a.rim[0]}`);
  assert.ok(Math.abs(a.rim[RIM / 2] - 50) < 1.5, `far side stays round, got ${a.rim[RIM / 2]}`);
});

test("a bubble pops in with a bounce and settles at full size", () => {
  const b = makeBlob(300, 200, 40);
  b.target = 1;
  let peak = 0;
  for (let i = 0; i < 240; i++) {
    stepFoam([b], 1 / 120, { w: W, h: H });
    peak = Math.max(peak, b.scale);
  }
  assert.ok(peak > 1.02, `expected an overshoot, peak ${peak}`);
  assert.ok(Math.abs(b.scale - 1) < 0.02, `should settle at 1, got ${b.scale}`);
});

test("hidden bubbles take no space", () => {
  const a = shown(makeBlob(300, 200, 40));
  const ghost = makeBlob(310, 200, 40);
  for (let i = 0; i < 120; i++) stepFoam([a, ghost], 1 / 120, { w: W, h: H, cx: 300, cy: 200 });
  assert.ok(Math.hypot(a.x - 300, a.y - 200) < 0.5, "a visible bubble is not pushed by a hidden one");
});

test("holding to pull draws bubbles toward the point", () => {
  const b = shown(makeBlob(300, 200, 40));
  for (let i = 0; i < 60; i++) stepFoam([b], 1 / 120, { w: W, h: H, attract: { x: 520, y: 200, power: 2400 } });
  assert.ok(b.x > 320, `should move toward the pull, x ${b.x}`);
});

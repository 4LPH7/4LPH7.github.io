import assert from "node:assert/strict";
import { test } from "node:test";
import { type Body, hit, poke, radiusFor, repel, settle, step } from "./bubbles.ts";

const W = 600;
const H = 400;
const make = (n: number, r = 30): Body[] =>
  Array.from({ length: n }, (_, i) => ({ x: 60 + (i % 8) * 70, y: -40 - Math.floor(i / 8) * 70, vx: 0, vy: 0, r }));

test("a bubble falls under gravity", () => {
  const [b] = make(1);
  const y0 = b.y;
  step([b], 1 / 60, W, H);
  assert.ok(b.y > y0);
});

test("bubbles come to rest inside the box", () => {
  const bodies = make(17);
  settle(bodies, W, H, 900);
  for (const b of bodies) {
    assert.ok(b.x - b.r >= -0.5 && b.x + b.r <= W + 0.5, `x ${b.x}`);
    assert.ok(b.y + b.r <= H + 0.5, `y ${b.y}`);
    assert.ok(Math.hypot(b.vx, b.vy) < 60, `still moving ${b.vx},${b.vy}`);
  }
});

test("settled bubbles do not overlap", () => {
  const bodies = make(17);
  settle(bodies, W, H, 900);
  for (let i = 0; i < bodies.length; i++)
    for (let j = i + 1; j < bodies.length; j++) {
      const d = Math.hypot(bodies[i].x - bodies[j].x, bodies[i].y - bodies[j].y);
      assert.ok(d >= bodies[i].r + bodies[j].r - 2, `overlap ${i}/${j}: ${d}`);
    }
});

test("hit returns the topmost bubble under a point, or -1", () => {
  const bodies: Body[] = [{ x: 100, y: 100, vx: 0, vy: 0, r: 30 }, { x: 110, y: 100, vx: 0, vy: 0, r: 30 }];
  assert.equal(hit(bodies, 105, 100), 1);
  assert.equal(hit(bodies, 200, 200), -1);
});

test("poke kicks a bubble upward", () => {
  const b: Body = { x: 0, y: 0, vx: 0, vy: 0, r: 30 };
  poke(b, 0.5);
  assert.ok(b.vy < -200);
});

test("radius grows with label length and respects the scale", () => {
  assert.ok(radiusFor("Next.js", 1) > radiusFor("Git", 1));
  assert.ok(radiusFor("Next.js", 0.5) < radiusFor("Next.js", 1));
});

test("repel pushes nearby bubbles away from the pointer and skips the hovered one", () => {
  const near: Body = { x: 100, y: 0, vx: 0, vy: 0, r: 20 };
  const far: Body = { x: 1000, y: 0, vx: 0, vy: 0, r: 20 };
  const hovered: Body = { x: 5, y: 0, vx: 0, vy: 0, r: 20 };
  repel([near, far, hovered], 0, 0, 1 / 60, 1, 2);
  assert.ok(near.vx > 0, "near bubble moves away (+x)");
  assert.equal(far.vx, 0);
  assert.equal(hovered.vx, 0);
  const slow = { ...near, vx: 0 };
  const fast = { ...near, vx: 0 };
  repel([slow], 0, 0, 1 / 60, 1);
  repel([fast], 0, 0, 1 / 60, 3);
  assert.ok(fast.vx > slow.vx, "a faster pointer pushes harder");
});

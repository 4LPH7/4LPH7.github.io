export interface Body { x: number; y: number; vx: number; vy: number; r: number }

const GRAVITY = 1400; // px/s^2
const BOUNCE = 0.35;
const ITER = 4;

/** Bubble radius from its label; `scale` shrinks everything on narrow screens. */
export const radiusFor = (name: string, scale: number) => (30 + name.length * 3.4) * scale;

/** Topmost (last drawn) bubble containing the point, or -1. */
export function hit(bodies: Body[], x: number, y: number): number {
  for (let i = bodies.length - 1; i >= 0; i--) {
    const b = bodies[i];
    if (Math.hypot(x - b.x, y - b.y) <= b.r) return i;
  }
  return -1;
}

/** Tap: kick a bubble upward with a little sideways wobble. `rand` in [0,1). */
export function poke(b: Body, rand = Math.random()) {
  b.vy = -520;
  b.vx += (rand - 0.5) * 360;
}

function walls(b: Body, w: number, h: number) {
  if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
  if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
  if (b.y + b.r > h) {
    b.y = h - b.r;
    b.vy = b.vy > 40 ? -b.vy * BOUNCE : 0;
    b.vx *= 0.98;
  }
}

function collide(a: Body, b: Body) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const min = a.r + b.r;
  let d = Math.hypot(dx, dy);
  if (d >= min) return;
  if (d === 0) d = 0.001;
  const nx = dx / d;
  const ny = dy / d;
  const ma = a.r * a.r;
  const mb = b.r * b.r;
  const push = min - d;
  a.x -= nx * push * (mb / (ma + mb));
  a.y -= ny * push * (mb / (ma + mb));
  b.x += nx * push * (ma / (ma + mb));
  b.y += ny * push * (ma / (ma + mb));
  const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (vn >= 0) return;
  const j = (-(1 + BOUNCE) * vn) / (1 / ma + 1 / mb);
  a.vx -= (j / ma) * nx; a.vy -= (j / ma) * ny;
  b.vx += (j / mb) * nx; b.vy += (j / mb) * ny;
}

export function step(bodies: Body[], dt: number, w: number, h: number) {
  for (const b of bodies) {
    b.vy += GRAVITY * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  for (let k = 0; k < ITER; k++) {
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
    for (const b of bodies) walls(b, w, h);
  }
}

/** Run the simulation to rest without drawing (used for reduced motion and tests). */
export function settle(bodies: Body[], w: number, h: number, steps = 600) {
  for (let i = 0; i < steps; i++) step(bodies, 1 / 60, w, h);
}

/**
 * Zero-gravity variant: every bubble is pulled gently toward (cx, cy) and damped, so the set settles into a
 * cluster in the middle of the field. `held` is the index being dragged (it is moved by the pointer, not physics).
 */
export function stepFloat(bodies: Body[], dt: number, w: number, h: number, cx = w / 2, cy = h / 2, held = -1) {
  const pull = 4.2;
  const damp = Math.exp(-2.6 * dt);
  bodies.forEach((b, i) => {
    if (i === held) return;
    b.vx = (b.vx + (cx - b.x) * pull * dt) * damp;
    b.vy = (b.vy + (cy - b.y) * pull * dt) * damp;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  });
  for (let k = 0; k < ITER; k++) {
    for (let i = 0; i < bodies.length; i++)
      for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
    for (const b of bodies) {
      if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * BOUNCE; }
      if (b.x + b.r > w) { b.x = w - b.r; b.vx = -Math.abs(b.vx) * BOUNCE; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = Math.abs(b.vy) * BOUNCE; }
      if (b.y + b.r > h) { b.y = h - b.r; b.vy = -Math.abs(b.vy) * BOUNCE; }
    }
  }
}

/** Push every bubble near (x, y) outward: the "poke" ripple. */
export function burst(bodies: Body[], x: number, y: number, strength = 900, radius = 220) {
  for (const b of bodies) {
    const dx = b.x - x;
    const dy = b.y - y;
    const d = Math.hypot(dx, dy) || 1;
    if (d > radius) continue;
    const f = strength * (1 - d / radius);
    b.vx += (dx / d) * f;
    b.vy += (dy / d) * f;
  }
}

import type { Body } from "./bubbles.ts";

/**
 * Soft "foam" bubbles for the toolbox field. Bubbles may squeeze into each other a little and are pushed apart by
 * springs, so a packed cluster presses together like soap foam. Each outline is RIM springy points that flatten
 * against neighbours (at their shared wall) and the field edges, stretch along the direction of travel, and wobble.
 */
export interface Blob extends Body {
  /** Radius at scale 1. */
  base: number;
  /** Size multiplier; springs toward `target` (0 = hidden), so bubbles pop in with a bounce. */
  scale: number;
  sv: number;
  target: number;
  /** 0..1 hover swell, eased by the caller. */
  swell: number;
  /** Outline radius per direction, and its velocity. */
  rim: Float32Array;
  rimV: Float32Array;
}

export const RIM = 36;
export const RIM_DIRS: readonly (readonly [number, number])[] = Array.from({ length: RIM }, (_, k) => {
  const a = (k / RIM) * Math.PI * 2;
  return [Math.cos(a), Math.sin(a)] as const;
});

export const makeBlob = (x: number, y: number, base: number): Blob => ({
  x, y, vx: 0, vy: 0, r: 0, base, scale: 0, sv: 0, target: 0, swell: 0,
  rim: new Float32Array(RIM), rimV: new Float32Array(RIM),
});

export const visible = (b: Blob) => b.scale > 0.01;

export interface FoamOpts {
  w: number;
  h: number;
  cx?: number;
  cy?: number;
  /** Index moved by the pointer: no pull, and it shoves others like a heavier bubble. */
  held?: number;
  /** Seconds; adds a slow idle wander so the cluster never sits perfectly still. */
  t?: number;
  /** Hold-to-pull point: everything is drawn toward it with a little swirl. */
  attract?: { x: number; y: number; power: number } | null;
}

const PULL = 3.2; // toward the centre, per s^2 per px
const DRAG = 2.4; // velocity damping per s
const STIFF = 95; // contact spring per s^2 per px of overlap
const CONTACT_DAMP = 6;
/** How far bubbles may squeeze into each other (fraction of the smaller radius) before a hard push. */
export const SQUEEZE = 0.28;
const HELD_MASS = 6;

/** A soft wall: `pen` > 0 is how far a bubble presses in, `v` its speed along the wall's inward normal. */
const wall = (pen: number, v: number, dt: number) => (pen > 0 ? v + (STIFF * 2 * pen - (v < 0 ? CONTACT_DAMP * 2 * v : 0)) * dt : v);

export function stepFoam(blobs: Blob[], dt: number, o: FoamOpts) {
  const cx = o.cx ?? o.w / 2;
  const cy = o.cy ?? o.h / 2;
  const fade = Math.exp(-DRAG * dt);

  blobs.forEach((b, i) => {
    b.sv += ((b.target - b.scale) * 170 - b.sv * 15) * dt;
    b.scale += b.sv * dt;
    if (b.target === 0 && b.scale < 0.02) { b.scale = 0; b.sv = 0; }
    b.r = b.base * Math.max(0, b.scale) * (1 + b.swell * 0.16);
    if (!visible(b) || i === o.held) return;
    let ax = (cx - b.x) * PULL;
    let ay = (cy - b.y) * PULL;
    if (o.t !== undefined) {
      ax += Math.sin(o.t * 0.7 + i * 2.1) * 16;
      ay += Math.cos(o.t * 0.55 + i * 1.3) * 16;
    }
    const a = o.attract;
    if (a) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy) || 1;
      const f = a.power * Math.min(1.6, 180 / d + 0.4);
      ax += (dx / d) * f - (dy / d) * f * 0.3;
      ay += (dy / d) * f + (dx / d) * f * 0.3;
    }
    b.vx = (b.vx + ax * dt) * fade;
    b.vy = (b.vy + ay * dt) * fade;
  });

  for (let i = 0; i < blobs.length; i++) {
    const a = blobs[i];
    if (!visible(a)) continue;
    for (let j = i + 1; j < blobs.length; j++) {
      const b = blobs[j];
      if (!visible(b)) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.max(1e-3, Math.hypot(dx, dy));
      const overlap = a.r + b.r - d;
      if (overlap <= 0) continue;
      const nx = dx / d;
      const ny = dy / d;
      const ma = a.r * a.r * (i === o.held ? HELD_MASS : 1);
      const mb = b.r * b.r * (j === o.held ? HELD_MASS : 1);
      const sa = mb / (ma + mb);
      const sb = ma / (ma + mb);
      const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      const f = (STIFF * overlap - CONTACT_DAMP * rel) * 2 * dt;
      a.vx -= nx * f * sa;
      a.vy -= ny * f * sa;
      b.vx += nx * f * sb;
      b.vy += ny * f * sb;
      const excess = overlap - SQUEEZE * Math.min(a.r, b.r);
      if (excess > 0) {
        a.x -= nx * excess * sa;
        a.y -= ny * excess * sa;
        b.x += nx * excess * sb;
        b.y += ny * excess * sb;
      }
    }
  }

  for (const b of blobs) {
    if (!visible(b)) continue;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.vx = wall(b.r - b.x, b.vx, dt);
    b.vx = -wall(b.x + b.r - o.w, -b.vx, dt);
    b.vy = wall(b.r - b.y, b.vy, dt);
    b.vy = -wall(b.y + b.r - o.h, -b.vy, dt);
    const lim = b.r * (1 - SQUEEZE);
    if (b.x < lim) { b.x = lim; if (b.vx < 0) b.vx *= -0.3; }
    if (b.x > o.w - lim) { b.x = o.w - lim; if (b.vx > 0) b.vx *= -0.3; }
    if (b.y < lim) { b.y = lim; if (b.vy < 0) b.vy *= -0.3; }
    if (b.y > o.h - lim) { b.y = o.h - lim; if (b.vy > 0) b.vy *= -0.3; }
  }
}

const RIM_K = 240;
const RIM_C = 11;
const RIM_SPREAD = 70;
const target = new Float32Array(RIM);

/**
 * Move every outline toward its shape: round, stretched along travel, cut flat where it meets a neighbour (on the
 * line through their two intersection points) or an edge. Springs make dents overshoot and ripple around the rim.
 */
export function shapeFoam(blobs: Blob[], dt: number, w: number, h: number) {
  for (let i = 0; i < blobs.length; i++) {
    const a = blobs[i];
    if (!visible(a)) { a.rim.fill(0); a.rimV.fill(0); continue; }
    const s = Math.min(0.1, Math.hypot(a.vx, a.vy) / 6000);
    const ang = Math.atan2(a.vy, a.vx);
    for (let k = 0; k < RIM; k++) target[k] = a.r * (1 + s * Math.cos(2 * ((k / RIM) * Math.PI * 2 - ang)));
    for (let j = 0; j < blobs.length; j++) {
      const b = blobs[j];
      if (j === i || !visible(b)) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.hypot(dx, dy);
      if (d >= a.r + b.r || d < 1e-3) continue;
      const along = Math.max(a.r * 0.2, (d * d + a.r * a.r - b.r * b.r) / (2 * d));
      const nx = dx / d;
      const ny = dy / d;
      for (let k = 0; k < RIM; k++) {
        const c = RIM_DIRS[k][0] * nx + RIM_DIRS[k][1] * ny;
        if (c > 0.02) target[k] = Math.min(target[k], along / c);
      }
    }
    for (let k = 0; k < RIM; k++) {
      const [ux, uy] = RIM_DIRS[k];
      if (ux < -0.02) target[k] = Math.min(target[k], a.x / -ux);
      if (ux > 0.02) target[k] = Math.min(target[k], (w - a.x) / ux);
      if (uy < -0.02) target[k] = Math.min(target[k], a.y / -uy);
      if (uy > 0.02) target[k] = Math.min(target[k], (h - a.y) / uy);
    }
    const { rim, rimV } = a;
    for (let k = 0; k < RIM; k++) {
      const lap = rim[(k + RIM - 1) % RIM] + rim[(k + 1) % RIM] - 2 * rim[k];
      rimV[k] += ((target[k] - rim[k]) * RIM_K + lap * RIM_SPREAD - rimV[k] * RIM_C) * dt;
    }
    for (let k = 0; k < RIM; k++) rim[k] = Math.max(0, rim[k] + rimV[k] * dt);
  }
}

/** Make a bubble wobble like jelly: a squash-and-stretch oscillation at `angle`. */
export function jiggle(b: Blob, amount: number, angle = Math.random() * Math.PI) {
  for (let k = 0; k < RIM; k++) b.rimV[k] += amount * Math.cos(2 * ((k / RIM) * Math.PI * 2 - angle));
}

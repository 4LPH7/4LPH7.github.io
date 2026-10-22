"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * "Bit", the profile-card robot. Adapted from page-mascot (https://github.com/nilbuild/page-mascot) using its drawn
 * "crt" character: two 3x3 sprite sheets (head directions, expressions) swapped by background-position.
 * Extended here with idle life: it floats, leans toward the cursor, blinks, dozes off when left alone (and startles
 * awake), flinches when the cursor rushes past, lights up on hover, and bursts hearts/sparkles when booped.
 */

const DIRECTIONS = ["up-left", "up", "up-right", "left", "center", "right", "down-left", "down", "down-right"] as const;
const REACTIONS = ["blink", "heart", "sparkle", "surprised", "wink", "bashful", "sleepy", "dizzy", "delighted"] as const;
type Direction = (typeof DIRECTIONS)[number];
type Reaction = (typeof REACTIONS)[number];

// Clockwise from the right, matching atan2 with y pointing down.
const CLOCKWISE: Direction[] = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"];
const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 70;

const PAYOFFS: Reaction[] = ["heart", "sparkle", "delighted"];
const DIZZY_AFTER = 4; // boops inside DIZZY_WINDOW
const DIZZY_WINDOW = 1600;
const SLEEP_AFTER = 12000; // ms with no pointer, scroll or tap
const STARTLE_SPEED = 3.2; // px per ms, within STARTLE_RANGE of the mascot
const STARTLE_RANGE = 320;
const STARTLE_COOLDOWN = 4000;

const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];
const HOP: Keyframe[] = [
  { transform: "translateY(0)", easing: "ease-out" },
  { transform: "translateY(-9%) scale(0.97, 1.04)", offset: 0.4, easing: "ease-in" },
  { transform: "translateY(0) scale(1.05, 0.95)", offset: 0.75, easing: "ease-out" },
  { transform: "translateY(0)" },
];
const SHIVER: Keyframe[] = [
  { transform: "translateX(0)" },
  { transform: "translateX(-3%) rotate(-3deg)" },
  { transform: "translateX(3%) rotate(3deg)" },
  { transform: "translateX(-2%) rotate(-1.5deg)" },
  { transform: "translateX(0)" },
];
const RING: Keyframe[] = [
  { transform: "scale(0.7)", opacity: 0.9 },
  { transform: "scale(1.45)", opacity: 0 },
];

// background-size 300% makes each cell a clean 0/50/100% step on both axes.
const cell = (index: number): CSSProperties => ({ backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%` });
const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
const still = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const animate = (el: HTMLElement | null, frames: Keyframe[], ms: number) => {
  if (el && !still()) el.animate(frames, { duration: ms, easing: "linear" });
};

type Fx = { id: number; glyph: string; heart: boolean; x: number; r: number; delay: number };

export function Mascot() {
  const btn = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLSpanElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const timers = useRef<number[]>([]);
  const busy = useRef(false); // a reaction is playing; idle blinks wait
  const asleepRef = useRef(false);
  const boops = useRef({ count: 0, at: 0 });
  const fxId = useRef(0);
  const [direction, setDirection] = useState<Direction>("center");
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [asleep, setAsleep] = useState(false);
  const [fx, setFx] = useState<Fx[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);
  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };
  /** Show one expression for `ms`, then go back to following the cursor. */
  const show = useCallback((r: Reaction, ms: number) => {
    clear();
    busy.current = true;
    setReaction(r);
    timers.current.push(window.setTimeout(() => { busy.current = false; setReaction(null); }, ms));
  }, [clear]);

  const burst = (kind: Reaction) => {
    if (still()) return;
    const heart = kind === "heart";
    const glyph = heart ? "♥" : "✦";
    const items = Array.from({ length: 4 }, (_, k) => ({
      id: ++fxId.current,
      glyph,
      heart,
      x: (k - 1.5) * 22 + (Math.random() - 0.5) * 12,
      r: (Math.random() - 0.5) * 50,
      delay: k * 50,
    }));
    setFx((list) => [...list, ...items]);
    window.setTimeout(() => setFx((list) => list.filter((f) => !items.includes(f))), 1200);
  };

  // Cursor tracking, lean, startle, doze. Fine pointers only for tracking; sleep works everywhere.
  useEffect(() => {
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    let sector = -1;
    let pointer: { x: number; y: number; t: number } | null = null;
    let startledAt = 0;
    let sleepTimer = 0;

    const doze = () => {
      if (busy.current) { sleepTimer = window.setTimeout(doze, 2000); return; }
      asleepRef.current = true;
      setAsleep(true);
    };
    const nudge = () => {
      window.clearTimeout(sleepTimer);
      sleepTimer = window.setTimeout(doze, SLEEP_AFTER);
      if (asleepRef.current) {
        asleepRef.current = false;
        setAsleep(false);
        show("surprised", 700);
        animate(body.current, SHIVER, 420);
      }
    };

    const aim = () => {
      const el = btn.current;
      if (!el || !pointer) return;
      const box = el.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      el.style.setProperty("--lean", (Math.max(-1, Math.min(1, dx / 600)) * 6).toFixed(2));
      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection("center");
        return;
      }
      // Hold the current sector until the pointer is well past its edge.
      const angle = Math.atan2(dy, dx);
      if (sector !== -1 && Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS) return;
      sector = (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const prev = pointer;
      pointer = { x: e.clientX, y: e.clientY, t: now };
      nudge();
      if (!fine) return;
      aim();
      // A fast swipe close by makes it flinch.
      const el = btn.current;
      if (!prev || !el || busy.current || now - startledAt < STARTLE_COOLDOWN) return;
      const speed = Math.hypot(e.clientX - prev.x, e.clientY - prev.y) / Math.max(1, now - prev.t);
      const box = el.getBoundingClientRect();
      const near = Math.hypot(e.clientX - (box.left + box.width / 2), e.clientY - (box.top + box.height / 2)) < STARTLE_RANGE;
      if (speed > STARTLE_SPEED && near) {
        startledAt = now;
        show("surprised", 520);
        animate(body.current, SHIVER, 360);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", nudge, { passive: true });
    window.addEventListener("scroll", nudge, { passive: true });
    if (fine) window.addEventListener("scroll", aim, { passive: true });
    sleepTimer = window.setTimeout(doze, SLEEP_AFTER);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", nudge);
      window.removeEventListener("scroll", nudge);
      window.removeEventListener("scroll", aim);
      window.clearTimeout(sleepTimer);
    };
  }, [show]);

  // Idle blinking, now and then.
  useEffect(() => {
    let t = 0;
    const blink = () => {
      if (!busy.current && !asleepRef.current) {
        setReaction("blink");
        window.setTimeout(() => { if (!busy.current) setReaction(null); }, 150);
      }
      t = window.setTimeout(blink, 2600 + Math.random() * 3400);
    };
    t = window.setTimeout(blink, 1800);
    return () => { window.clearTimeout(t); clear(); };
  }, [clear]);

  const onEnter = () => {
    if (busy.current || asleepRef.current) return;
    show("wink", 800);
    animate(body.current, HOP, 520);
  };

  const boop = () => {
    clear();
    asleepRef.current = false;
    setAsleep(false);
    const now = Date.now();
    const b = boops.current;
    b.count = now - b.at < DIZZY_WINDOW ? b.count + 1 : 1;
    b.at = now;
    busy.current = true;
    if (b.count >= DIZZY_AFTER) {
      b.count = 0;
      setReaction("dizzy");
      animate(body.current, SHIVER, 600);
      later(1100, () => { busy.current = false; setReaction(null); });
    } else {
      const payoff = PAYOFFS[(b.count - 1) % PAYOFFS.length];
      setReaction("blink");
      later(120, () => { setReaction(payoff); burst(payoff); });
      later(620, () => { busy.current = false; setReaction(null); });
    }
    animate(body.current, SQUASH, 420);
    animate(ring.current, RING, 600);
  };

  const face = reaction ?? (asleep ? "sleepy" : null);

  return (
    <button
      ref={btn}
      type="button"
      className={`mascot${asleep ? " is-asleep" : ""}`}
      onClick={boop}
      onPointerEnter={onEnter}
      aria-label="Boop Bit, the robot mascot"
    >
      <span ref={ring} className="mascot-ring" aria-hidden="true" />
      <span className="mascot-float">
        <span className="mascot-lean">
          <span ref={body} className="mascot-body">
            <span
              className="mascot-layer"
              style={{ backgroundImage: "url(/mascots/crt-directions.webp)", ...cell(DIRECTIONS.indexOf(direction)), opacity: face ? 0 : 1 }}
            />
            {/* Always mounted so the sheet is fetched up front, never on the first click. */}
            <span
              className="mascot-layer"
              style={{ backgroundImage: "url(/mascots/crt-reactions.webp)", ...cell(REACTIONS.indexOf(face ?? "blink")), opacity: face ? 1 : 0 }}
            />
          </span>
        </span>
      </span>
      {fx.map((f) => (
        <span
          key={f.id}
          className={`mascot-fx${f.heart ? " is-heart" : ""}`}
          aria-hidden="true"
          style={{ "--x": `${f.x}px`, "--r": `${f.r}deg`, animationDelay: `${f.delay}ms` } as CSSProperties}
        >
          {f.glyph}
        </span>
      ))}
    </button>
  );
}

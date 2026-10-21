"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { skillIcons } from "@/data/skillIcons";
import { type Body, burst, hit, stepFloat } from "@/lib/bubbles";
import { step as move } from "@/lib/carousel";
import { TABS, type Tab, filterSkills, tabCounts } from "@/lib/skills";
import { SectionHeading } from "./SectionHeading";

const counts = tabCounts(site.skills);
const paths = Object.fromEntries(Object.entries(skillIcons).map(([k, v]) => [k, { color: v.color, path: typeof Path2D === "undefined" ? null : new Path2D(v.d) }]));

/** Bubble size: a few favourites are bigger, like a real toolbox. */
const BIG = new Set(["React", "Python", "Next.js", "JavaScript", "TypeScript", "Node.js"]);

/**
 * Glassy bubble field. Bubbles drift into a cluster; tap to poke (ripple), drag to move, release to flick.
 * Tabs filter the set and rebuild the cluster with a drop-in.
 */
export function Skills() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [tab, setTab] = useState<Tab>("All");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const shown = filterSkills(site.skills, tab);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const names = filterSkills(site.skills, tab).map((s) => s.name);
    let bodies: Body[] = [];
    let w = 0;
    let h = 0;
    let visible = false;
    let held = -1;
    let grab = { dx: 0, dy: 0, x: 0, y: 0, t: 0, vx: 0, vy: 0, moved: 0 };
    let light = document.documentElement.dataset.theme === "light";
    let removeTick = () => {};
    let disposed = false;

    const build = () => {
      w = host.clientWidth;
      h = host.clientHeight;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min(1.15, Math.max(0.62, Math.min(w, h * 1.4) / 1000));
      bodies = names.map((n, i) => {
        const a = (i / names.length) * Math.PI * 2;
        const r = (BIG.has(n) ? 60 : 47) * scale * (names.length < 8 ? 1.2 : 1);
        return { x: w / 2 + Math.cos(a) * w * 0.6, y: h / 2 + Math.sin(a) * h * 0.6 - h, vx: 0, vy: 0, r };
      });
      if (reduced) {
        for (const b of bodies) { b.x = w / 2 + (b.x - w / 2) * 0.3; b.y = h / 2 + (Math.random() - 0.5) * 40; }
        for (let k = 0; k < 600; k++) stepFloat(bodies, 1 / 60, w, h);
      }
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      bodies.forEach((b, i) => {
        const icon = paths[names[i]];
        const tint = icon?.color && icon.color !== "#FFFFFF" ? icon.color : light ? "#18181b" : "#a1a1aa";
        // glass sphere: tinted radial fill, soft rim, inner highlight
        const g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.4, b.r * 0.1, b.x, b.y, b.r);
        g.addColorStop(0, light ? "#ffffff" : "#26262b");
        g.addColorStop(0.7, light ? "#eef2fa" : "#121216");
        g.addColorStop(1, `${tint}${light ? "33" : "40"}`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.shadowColor = `${tint}55`;
        ctx.shadowBlur = i === held ? 30 : 16;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = light ? "#0b122022" : "#ffffff1c";
        ctx.lineWidth = 1;
        ctx.stroke();
        const s = b.r * 0.62;
        if (icon?.path) {
          ctx.save();
          ctx.translate(b.x - s / 2, b.y - s * 0.72);
          ctx.scale(s / 24, s / 24);
          ctx.fillStyle = icon.color === "#FFFFFF" ? (light ? "#0b1220" : "#ffffff") : icon.color;
          ctx.fill(icon.path);
          ctx.restore();
        }
        ctx.fillStyle = light ? "#0b1220" : "#e4e4e7";
        ctx.font = `600 ${Math.max(9, b.r * 0.2)}px Supreme, system-ui, sans-serif`;
        ctx.fillText(names[i], b.x, b.y + b.r * 0.42);
      });
    };

    build();
    const ro = new ResizeObserver(() => { if (host.clientWidth !== w || host.clientHeight !== h) build(); });
    ro.observe(host);
    const mo = new MutationObserver(() => { light = document.documentElement.dataset.theme === "light"; draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const local = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const down = (e: PointerEvent) => {
      const p = local(e);
      const i = hit(bodies, p.x, p.y);
      if (i < 0) { if (!reduced) burst(bodies, p.x, p.y, 500); return; }
      held = i;
      cv.setPointerCapture(e.pointerId);
      grab = { dx: bodies[i].x - p.x, dy: bodies[i].y - p.y, x: p.x, y: p.y, t: performance.now(), vx: 0, vy: 0, moved: 0 };
      cv.style.cursor = "grabbing";
    };
    const moveP = (e: PointerEvent) => {
      const p = local(e);
      if (held < 0) { cv.style.cursor = hit(bodies, p.x, p.y) >= 0 ? "grab" : "default"; return; }
      const now = performance.now();
      const dt = Math.max(1, now - grab.t) / 1000;
      grab.vx = (p.x - grab.x) / dt;
      grab.vy = (p.y - grab.y) / dt;
      grab.moved += Math.hypot(p.x - grab.x, p.y - grab.y);
      grab.x = p.x; grab.y = p.y; grab.t = now;
      const b = bodies[held];
      b.x = Math.max(b.r, Math.min(w - b.r, p.x + grab.dx));
      b.y = Math.max(b.r, Math.min(h - b.r, p.y + grab.dy));
      if (reduced) draw();
    };
    const up = () => {
      if (held < 0) return;
      const b = bodies[held];
      if (grab.moved < 6) { if (!reduced) burst(bodies, b.x, b.y + 1, 700); }
      else { b.vx = Math.max(-2200, Math.min(2200, grab.vx)); b.vy = Math.max(-2200, Math.min(2200, grab.vy)); }
      held = -1;
      cv.style.cursor = "grab";
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", moveP);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(host);

    if (!reduced) {
      void import("gsap").then(({ default: gsap }) => {
        if (disposed) return;
        const tick = (_t: number, deltaMs: number) => {
          if (!visible) return;
          const dt = Math.min(deltaMs, 33) / 1000;
          stepFloat(bodies, dt / 2, w, h, w / 2, h / 2, held);
          stepFloat(bodies, dt / 2, w, h, w / 2, h / 2, held);
          draw();
        };
        gsap.ticker.add(tick);
        removeTick = () => gsap.ticker.remove(tick);
      });
    }

    return () => {
      disposed = true;
      removeTick();
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", moveP);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
  }, [tab]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = move(i, d, TABS.length);
    setTab(TABS[n]);
    tabRefs.current[n]?.focus();
  };

  return (
    <section id="skills" className="skills" aria-labelledby="skills-title">
      <div className="skills-head">
        <SectionHeading num="04" heading={site.headings.skills} id="skills-title" />
        <div className="tabs" role="tablist" aria-label="Skill categories" data-reveal>
          {TABS.map((t, i) => (
            <button
              key={t}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`skills-tab-${t}`}
              aria-selected={tab === t}
              aria-controls="skills-panel"
              tabIndex={tab === t ? 0 : -1}
              onClick={() => setTab(t)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t} <sup>{counts[t]}</sup>
            </button>
          ))}
        </div>
      </div>
      <div id="skills-panel" role="tabpanel" aria-labelledby={`skills-tab-${tab}`} className="field card" data-reveal>
        <div ref={wrap} className="field-canvas" aria-hidden="true">
          <canvas ref={canvas} />
        </div>
        <ul className="sr-only">{shown.map((s) => <li key={s.name}>{s.name} ({s.category})</li>)}</ul>
        <p className="hint field-hint"><span className="hint-fine">POKE · DRAG · FLICK</span><span className="hint-touch">TAP A BUBBLE</span></p>
      </div>
    </section>
  );
}


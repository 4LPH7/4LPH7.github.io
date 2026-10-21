"use client";

import { useEffect, useRef } from "react";
import { fibonacciSphere, latLon, project } from "@/lib/globe";

const DOTS = fibonacciSphere(2200);
const HOME = { lat: 11.0168, lon: 76.9558 }; // Coimbatore
const home = latLon(HOME.lat, HOME.lon);

/** Decorative dotted globe that follows the light/dark theme and spins toward Coimbatore. */
export function Globe() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!host || !cv || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let size = 0;
    let rot = -(HOME.lon * Math.PI) / 180;
    let ink = "#fff";
    let accent = "#3b82f6";
    let visible = false;
    let disposed = false;
    let removeTick = () => {};

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue("--ink").trim() || ink;
      accent = cs.getPropertyValue("--accent").trim() || accent;
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const R = size * 0.46;
      const c = size / 2;
      const light = document.documentElement.dataset.theme === "light";
      // glow + lit sphere body
      const glow = ctx.createRadialGradient(c, c, R * 0.9, c, c, R * 1.08);
      glow.addColorStop(0, light ? "#1d4ed855" : "#ffffff55");
      glow.addColorStop(1, "#00000000");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);
      const body = ctx.createRadialGradient(c - R * 0.35, c - R * 0.45, R * 0.05, c, c, R);
      body.addColorStop(0, light ? "#ffffff" : "#ffffff");
      body.addColorStop(0.55, light ? "#dbe4f5" : "#d4d4d8");
      body.addColorStop(1, light ? "#93a7c9" : "#52525b");
      ctx.beginPath();
      ctx.arc(c, c, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.fillStyle = light ? "#0b1220" : "#18181b";
      for (const p of DOTS) {
        const q = project(p, rot);
        if (!q.visible) continue;
        ctx.globalAlpha = 0.25 + 0.6 * q.z;
        ctx.beginPath();
        ctx.arc(c + q.x * R, c - q.y * R, Math.max(0.7, size / 620) * (0.5 + q.z * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
      const m = project(home, rot);
      if (m.visible) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(c + m.x * R, c - m.y * R, Math.max(3.5, size / 110), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(c + m.x * R, c - m.y * R, Math.max(8, size / 50), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      size = host.clientWidth;
      const dpr = devicePixelRatio || 1;
      cv.width = size * dpr;
      cv.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    readColors();
    resize();
    const ro = new ResizeObserver(() => { if (host.clientWidth !== size) resize(); });
    ro.observe(host);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(host);

    if (!reduced) {
      void import("gsap").then(({ default: gsap }) => {
        if (disposed) return;
        const tick = (_t: number, deltaMs: number) => {
          if (!visible) return;
          rot += (Math.min(deltaMs, 50) / 1000) * 0.25;
          draw();
        };
        gsap.ticker.add(tick);
        removeTick = () => gsap.ticker.remove(tick);
      });
    }

    return () => { disposed = true; removeTick(); ro.disconnect(); mo.disconnect(); io.disconnect(); };
  }, []);

  return (
    <div ref={wrap} className="sg" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}

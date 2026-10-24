"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { canUse3D } from "@/lib/gpu";
import { Mascot } from "./Mascot";
import type { RobotInput } from "./RobotScene";

const RobotScene = dynamic(() => import("./RobotScene"), { ssr: false });

/**
 * K-2SO (the uploaded robot.glb) sitting on a crate, coding on a gaming laptop among hologram panels. It watches the
 * cursor, looks up at you on hover and waves when clicked. Dragging turns the whole scene; a few seconds after you let
 * go it glides back. Three.js and the model load only when the card is near the viewport. Devices that can't run 3D
 * (or prefer reduced motion) get the sprite mascot.
 */
export function Robot() {
  const box = useRef<HTMLButtonElement>(null);
  const input = useRef<RobotInput>({ x: 0, y: 0, hover: false, waveAt: 0, orbit: { yaw: 0, pitch: 0, vYaw: 0, vPitch: 0, dragging: false, releasedAt: 0 } });
  const drag = useRef<{ sx: number; sy: number; x: number; y: number; t: number } | null>(null);
  const dragged = useRef(false); // the last press was a drag, so its click shouldn't wave
  const [mode, setMode] = useState<"pending" | "3d" | "sprite">("pending");
  const [active, setActive] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const gl = document.createElement("canvas");
    setMode(canUse3D({
      reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
      webgl: Boolean(gl.getContext("webgl2") ?? gl.getContext("webgl")),
      cores: nav.hardwareConcurrency,
      memory: nav.deviceMemory,
      saveData: Boolean(nav.connection?.saveData),
    }) ? "3d" : "sprite");
  }, []);

  useEffect(() => {
    const el = box.current;
    if (mode !== "3d" || !el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const soon = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); soon.disconnect(); } }, { rootMargin: "600px" });
    soon.observe(el);
    // Also mount once the page is idle after load, so the model parse and shader compile don't stall the scroll out of the hero.
    const idle = window.setTimeout(() => (window.requestIdleCallback ?? ((f: () => void) => f()))(() => setNear(true)), 1500);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      input.current.x = Math.max(-1.5, Math.min(1.5, ((e.clientX - r.left) / r.width) * 2 - 1));
      input.current.y = Math.max(-1.5, Math.min(1.5, -(((e.clientY - r.top) / r.height) * 2 - 1)));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { io.disconnect(); soon.disconnect(); window.clearTimeout(idle); window.removeEventListener("pointermove", move); };
  }, [mode]);

  // Drag to orbit: past a few pixels a press becomes a drag (no wave), turning the camera with a little momentum.
  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button > 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, x: e.clientX, y: e.clientY, t: performance.now() };
    dragged.current = false;
  };
  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    const o = input.current.orbit;
    if (!d) return;
    if (!o.dragging) {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 6) return;
      o.dragging = true;
      dragged.current = true;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    }
    const now = performance.now();
    const dt = Math.max(1, now - d.t) / 1000;
    const dYaw = -(e.clientX - d.x) * 0.008;
    const dPitch = (e.clientY - d.y) * 0.004;
    o.yaw += dYaw;
    o.pitch += dPitch;
    o.vYaw = dYaw / dt;
    o.vPitch = dPitch / dt;
    Object.assign(d, { x: e.clientX, y: e.clientY, t: now });
  };
  const onEnd = () => {
    const d = drag.current;
    const o = input.current.orbit;
    drag.current = null;
    if (!o.dragging) return;
    o.dragging = false;
    o.releasedAt = performance.now() / 1000;
    if (d && performance.now() - d.t > 80) { o.vYaw = 0; o.vPitch = 0; } // held still before letting go: no fling
  };

  if (mode === "sprite") return <Mascot />;
  return (
    <>
    <button
      ref={box}
      type="button"
      className="robot"
      aria-label="Wave at K-2SO, a security droid coding on a gaming laptop (drag to turn the scene)"
      onPointerEnter={() => { input.current.hover = true; }}
      onPointerLeave={() => { input.current.hover = false; }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onEnd}
      onPointerCancel={onEnd}
      onClick={() => {
        if (dragged.current) { dragged.current = false; return; }
        input.current.waveAt = performance.now() / 1000;
      }}
    >
      {mode === "3d" && near ? <RobotScene input={input} active={active} /> : null}
    </button>
    <p className="robot-credit">
      K-2SO model by <a href="https://sketchfab.com/3d-models/free-droide-de-seguridad-k-2so-by-oscar-creativo-e4c65688ae1b47ec9e1dd6acec2dcadd" target="_blank" rel="noreferrer">Oscar Creativo</a>
      {" · "}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
    </p>
    </>
  );
}

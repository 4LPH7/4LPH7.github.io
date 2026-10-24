"use client";

import { useEffect } from "react";

/** Lenis smooth scroll driven by the GSAP ticker; skipped for reduced-motion and touch. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    let disposed = false;
    let cleanup = () => {};
    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.12, wheelMultiplier: 1, anchors: true }); // lerp: higher = snappier, lower = floatier
      const raf = (time: number) => lenis.raf(time * 1000);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      (window as Window & { __lenis?: unknown }).__lenis = lenis;
      cleanup = () => {
        delete (window as Window & { __lenis?: unknown }).__lenis;
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    }).catch(() => {
      // Native scrolling stays as the fallback.
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return null;
}

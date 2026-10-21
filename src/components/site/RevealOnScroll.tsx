"use client";

import { useEffect } from "react";
import { isBelowFold, staggerDelay } from "@/lib/reveal";

/**
 * Fades `[data-reveal]` blocks in as they scroll into view. The exported HTML never carries a hidden state,
 * so the page reads fine without JS; only elements that start below the fold are hidden, after hydration.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const targets = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const seen = new Map<Element, number>();
    for (const el of targets) {
      const index = seen.get(el.parentElement as Element) ?? 0;
      seen.set(el.parentElement as Element, index + 1);
      el.style.setProperty("--reveal-delay", `${staggerDelay(index)}ms`);
    }
    const pending = targets.filter((el) => isBelowFold(el.getBoundingClientRect().top, innerHeight));
    for (const el of pending) el.dataset.revealState = "pending";
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.revealState = "in";
        io.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });
    for (const el of pending) io.observe(el);
    return () => {
      io.disconnect();
      for (const el of targets) {
        delete el.dataset.revealState;
        el.style.removeProperty("--reveal-delay");
      }
    };
  }, []);
  return null;
}

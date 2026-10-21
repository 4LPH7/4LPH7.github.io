"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const top = () => {
    const lenis = (window as Window & { __lenis?: { scrollTo(y: number, o?: object): void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return (
    <button type="button" className="icon-btn icon-btn-lg" onClick={top} aria-label="Back to top">
      <ArrowUp size={20} strokeWidth={1.6} aria-hidden="true" />
    </button>
  );
}

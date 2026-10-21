"use client";

import { useEffect, useRef } from "react";

/**
 * "Bit": an original monitor-headed robot. Its pupils follow the pointer and it blinks now and then.
 * Pure SVG, no assets. Motion is skipped for reduced-motion users.
 */
export function Mascot() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pupils = [...svg.querySelectorAll<SVGGElement>(".bit-pupil")];
    const lids = [...svg.querySelectorAll<SVGRectElement>(".bit-lid")];
    const move = (e: PointerEvent) => {
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 400);
      const x = (dx / d) * 7 * k;
      const y = (dy / d) * 6 * k;
      for (const p of pupils) p.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    };
    let timer = 0;
    const blink = () => {
      for (const l of lids) l.classList.add("is-blink");
      window.setTimeout(() => { for (const l of lids) l.classList.remove("is-blink"); }, 140);
      timer = window.setTimeout(blink, 2600 + Math.random() * 3200);
    };
    timer = window.setTimeout(blink, 1800);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.clearTimeout(timer); };
  }, []);

  return (
    <svg ref={root} className="bit" viewBox="0 0 200 200" role="img" aria-label="Bit, a small robot mascot watching your cursor">
      <line x1="100" y1="34" x2="100" y2="16" className="bit-stroke" />
      <circle cx="100" cy="12" r="6" className="bit-accent bit-antenna" />
      <rect x="34" y="34" width="132" height="104" rx="26" className="bit-head" />
      <rect x="48" y="48" width="104" height="76" rx="16" className="bit-screen" />
      {[76, 124].map((cx) => (
        <g key={cx}>
          <g className="bit-pupil"><rect x={cx - 9} y="70" width="18" height="26" rx="9" className="bit-eye" /></g>
          <rect x={cx - 12} y="66" width="24" height="0" className="bit-lid" />
        </g>
      ))}
      <rect x="92" y="106" width="16" height="4" rx="2" className="bit-accent bit-mouth" />
      <rect x="82" y="138" width="36" height="14" rx="4" className="bit-neck" />
      <rect x="56" y="152" width="88" height="14" rx="7" className="bit-base" />
    </svg>
  );
}

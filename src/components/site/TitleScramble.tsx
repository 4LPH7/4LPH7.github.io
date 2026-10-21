"use client";

import { useEffect } from "react";
import { scrambleFrame } from "@/lib/scramble";

const WORD = "4LPH7";
const FRAME_MS = 55;
const FRAMES = 16;

/**
 * Keeps the tab title as just "4LPH7", and every few seconds scrambles it into random glyphs that settle back
 * letter by letter. Reduced-motion visitors get the plain title.
 */
export function TitleScramble() {
  useEffect(() => {
    document.title = WORD;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let wait = 0;
    let tick = 0;
    const run = () => {
      // Background tabs throttle timers, so a scramble there could stay garbled for seconds or minutes.
      if (document.hidden) { schedule(); return; }
      let frame = 0;
      tick = window.setInterval(() => {
        frame += 1;
        document.title = scrambleFrame(WORD, frame / FRAMES, Math.random);
        if (frame >= FRAMES) {
          window.clearInterval(tick);
          document.title = WORD;
          schedule();
        }
      }, FRAME_MS);
    };
    const schedule = () => { wait = window.setTimeout(run, 2600 + Math.random() * 3400); };
    const onVisibility = () => {
      if (!document.hidden) return;
      window.clearInterval(tick);
      window.clearTimeout(wait);
      document.title = WORD;
      schedule();
    };
    document.addEventListener("visibilitychange", onVisibility);
    schedule();
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(wait);
      window.clearInterval(tick);
      document.title = WORD;
    };
  }, []);
  return null;
}

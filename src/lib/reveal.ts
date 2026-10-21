export const splitWords = (text: string) => text.split(/\s+/).filter(Boolean);

/** How many words are lit for a scroll progress in [0,1]. */
export const revealedCount = (progress: number, total: number) =>
  Math.round(Math.min(1, Math.max(0, progress)) * total);

/** Entrance delay in ms for the nth sibling, capped so long groups don't make visitors wait. */
export const staggerDelay = (index: number, stepMs = 80, maxMs = 400) =>
  Math.min(Math.max(0, index) * stepMs, maxMs);

/** True when an element starts below the visible area, so it is worth hiding until it scrolls in. */
export const isBelowFold = (top: number, viewportHeight: number, margin = 0.9) =>
  top > viewportHeight * margin;

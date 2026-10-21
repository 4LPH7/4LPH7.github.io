export const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&*+=/<>";

/**
 * One frame of a left-to-right scramble. `progress` runs 0..1: positions below progress * length are settled
 * to the real letter, the rest show a random glyph. Length never changes, so the tab doesn't jitter.
 */
export function scrambleFrame(word: string, progress: number, rand: () => number = Math.random): string {
  const p = Math.min(1, Math.max(0, progress));
  const settled = Math.floor(p * word.length);
  if (p >= 1) return word;
  return [...word].map((ch, i) => (i < settled ? ch : GLYPHS[Math.floor(rand() * GLYPHS.length) % GLYPHS.length])).join("");
}

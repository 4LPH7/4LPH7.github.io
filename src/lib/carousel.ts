/** Next index with wrap-around. */
export const step = (index: number, delta: number, length: number) => (index + delta + length) % length;

/** Slide direction for jumping straight to an item: 1 forward, -1 back, 0 when nothing changes. */
export const pickDirection = (from: number, to: number): -1 | 0 | 1 => (to > from ? 1 : to < from ? -1 : 0);

/** +1 (next) / -1 (previous) / 0 (ignore) from a horizontal drag. */
export function swipeDelta(startX: number, endX: number, threshold = 50): -1 | 0 | 1 {
  const dx = endX - startX;
  return Math.abs(dx) < threshold ? 0 : dx < 0 ? 1 : -1;
}

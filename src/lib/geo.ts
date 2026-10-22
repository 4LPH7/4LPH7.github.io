/** Reading the dot grids in data/worldMap.ts (built by scripts/world-map.mjs). */

export type Grid = { lon0: number; lat0: number; step: number; cols: number; rows: number; data: string };

export const HOME = { name: "Coimbatore", region: "Tamil Nadu", lat: 11.0168, lon: 76.9558 };

const cache = new WeakMap<Grid, Uint8Array>();
const bytes = (g: Grid) => {
  let b = cache.get(g);
  if (!b) {
    b = Uint8Array.from(atob(g.data), (ch) => ch.charCodeAt(0));
    cache.set(g, b);
  }
  return b;
};

/** 1-bit grid (WORLD): is cell (c, r) land? */
export const land = (g: Grid, c: number, r: number) => {
  const k = r * g.cols + c;
  return (bytes(g)[k >> 3] & (0x80 >> (k & 7))) !== 0;
};

/** 2-bit grid (SOUTH_INDIA): 0 sea, 1 land, 2 Tamil Nadu. */
export const kind = (g: Grid, c: number, r: number) => {
  const k = r * g.cols + c;
  return (bytes(g)[k >> 2] >> (6 - (k & 3) * 2)) & 3;
};

/** The cell holding (lon, lat), or null when it falls outside the grid. */
export const cellOf = (g: Grid, lon: number, lat: number) => {
  const c = Math.floor((lon - g.lon0) / g.step);
  const r = Math.floor((g.lat0 - lat) / g.step);
  return c >= 0 && r >= 0 && c < g.cols && r < g.rows ? { c, r } : null;
};

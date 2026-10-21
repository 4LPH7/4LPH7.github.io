interface Env { reducedMotion: boolean; webgl: boolean; cores?: number; memory?: number; saveData: boolean }

/** Heavy 3D only on capable, motion-friendly devices; everything else gets the static card. */
export const canUse3D = (e: Env) =>
  !e.reducedMotion && e.webgl && !e.saveData && (e.cores === undefined || e.cores > 2) && (e.memory === undefined || e.memory > 2);

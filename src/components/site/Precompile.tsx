"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Compiles every shader in the scene in the background (KHR_parallel_shader_compile) as soon as it mounts, then draws
 * one frame off-screen: ANGLE on Windows finishes some shaders only at the first draw, for the real vertex formats.
 * The scenes otherwise render first when scrolled into view, and that first frame froze the scroll for up to ~1 s.
 * Mount it after everything else in the scene (inside the same Suspense as any loaded model).
 */
export function Precompile() {
  const { gl, scene, camera, advance } = useThree();
  useEffect(() => {
    let alive = true;
    void gl.compileAsync(scene, camera).then(() => { if (alive) advance(performance.now()); });
    return () => { alive = false; };
  }, [gl, scene, camera, advance]);
  return null;
}

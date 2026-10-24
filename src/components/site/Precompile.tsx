"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

/**
 * Compiles every shader in the scene in the background (KHR_parallel_shader_compile) as soon as it mounts, then runs
 * one frame off-screen: ANGLE on Windows finishes some shaders only at the first draw, for the real vertex formats, and
 * passes drawn inside useFrame (ContactShadows) compile then too. The scenes otherwise render first when scrolled into
 * view, and that first frame froze the scroll for up to ~1 s.
 * The frame is stepped at the clock's current time, so every useFrame sees a zero delta: in frameloop="never",
 * advance(t) sets the clock to t, and passing performance.now() (ms read as seconds) sent the orb spinning.
 * Mount it after everything else in the scene (inside the same Suspense as any loaded model).
 */
export function Precompile() {
  const { gl, scene, camera, clock, advance } = useThree();
  useEffect(() => {
    let alive = true;
    void gl.compileAsync(scene, camera).then(() => { if (alive) advance(clock.elapsedTime); });
    return () => { alive = false; };
  }, [gl, scene, camera, clock, advance]);
  return null;
}

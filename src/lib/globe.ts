interface V3 { x: number; y: number; z: number }

/** n roughly evenly spaced points on the unit sphere. */
export function fibonacciSphere(n: number): V3[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    return { x: Math.cos(i * golden) * r, y, z: Math.sin(i * golden) * r };
  });
}

/** Degrees to a unit vector: (0,0) faces the viewer (+z), north pole is +y. */
export function latLon(lat: number, lon: number): V3 {
  const a = (lat * Math.PI) / 180;
  const o = (lon * Math.PI) / 180;
  return { x: Math.cos(a) * Math.sin(o), y: Math.sin(a), z: Math.cos(a) * Math.cos(o) };
}

/** Spin about the vertical axis by `rotY`, then tilt slightly; x/y are in [-1,1] screen units. */
export function project(p: V3, rotY: number, tilt = 0.25) {
  const c = Math.cos(rotY);
  const s = Math.sin(rotY);
  const x = p.x * c + p.z * s;
  const z1 = -p.x * s + p.z * c;
  const ct = Math.cos(tilt);
  const st = Math.sin(tilt);
  const y = p.y * ct - z1 * st;
  const z = p.y * st + z1 * ct;
  return { x, y, z, visible: z > 0 };
}

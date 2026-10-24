import * as THREE from "three";

/**
 * Posing helpers for the K-2SO rig, all in world space so they don't depend on each bone's local axes (the rig came
 * from MMD and its bone axes are arbitrary). Every frame the pose is rebuilt from the rest pose, so nothing drifts.
 */

type Rest = { p: THREE.Vector3; q: THREE.Quaternion; s: THREE.Vector3 };
const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();
const v3 = new THREE.Vector3();
const q1 = new THREE.Quaternion();
const q2 = new THREE.Quaternion();
const IDENTITY = new THREE.Quaternion();
const scratchP = new THREE.Vector3();
const scratchS = new THREE.Vector3();

// World transforms are read straight from `matrixWorld`: the rest-pose reset refreshes the whole rig and every change
// below refreshes the subtree it touches, so the cache is always current. (getWorldPosition / getWorldQuaternion
// re-walked and recomputed every ancestor on each call, dozens of times a frame.)
export const pos = (o: THREE.Object3D, out = new THREE.Vector3()) => out.setFromMatrixPosition(o.matrixWorld);
const worldQuat = (o: THREE.Object3D, out: THREE.Quaternion) => { o.matrixWorld.decompose(scratchP, out, scratchS); return out; };

/** Set a bone's world rotation, converting to its parent's space. */
function setWorldQuat(bone: THREE.Object3D, world: THREE.Quaternion) {
  if (bone.parent) worldQuat(bone.parent, q2).invert();
  else q2.identity();
  bone.quaternion.copy(q2.multiply(world));
  bone.updateMatrixWorld(true);
}

/** Rotate a bone by `delta` (a world-space rotation), optionally only part of the way. */
export function turn(bone: THREE.Object3D, delta: THREE.Quaternion, weight = 1) {
  const d = weight >= 1 ? delta : q1.copy(IDENTITY).slerp(delta, weight);
  const w = worldQuat(bone, new THREE.Quaternion());
  setWorldQuat(bone, w.premultiply(d));
}

/** Rotate a bone so the world vector `from` (measured from it) swings onto `to`: the smallest turn, so roll is kept. */
export function aim(bone: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, weight = 1) {
  const delta = new THREE.Quaternion().setFromUnitVectors(v1.copy(from).normalize(), v2.copy(to).normalize());
  turn(bone, delta, weight);
}

/** Aim the bone→tip direction along `dir`. */
export function point(bone: THREE.Object3D, tip: THREE.Object3D, dir: THREE.Vector3, weight = 1) {
  aim(bone, pos(tip, v3).sub(pos(bone)), dir, weight);
}

/** Two-bone IK: put `end` on `target`, bending `mid` toward `pole`. */
export function reach(root: THREE.Object3D, mid: THREE.Object3D, end: THREE.Object3D, target: THREE.Vector3, pole: THREE.Vector3) {
  const A = pos(root);
  const a = A.distanceTo(pos(mid));
  const b = pos(mid).distanceTo(pos(end));
  const d = THREE.MathUtils.clamp(A.distanceTo(target), Math.abs(a - b) + 1e-4, a + b - 1e-4);
  const dir = target.clone().sub(A).normalize();
  const side = pole.clone().sub(A);
  side.sub(dir.clone().multiplyScalar(side.dot(dir))).normalize();
  const cos = (a * a + d * d - b * b) / (2 * a * d);
  const knee = A.clone().addScaledVector(dir, a * cos).addScaledVector(side, a * Math.sqrt(Math.max(0, 1 - cos * cos)));
  point(root, mid, knee.clone().sub(A));
  point(mid, end, A.clone().addScaledVector(dir, d).sub(knee));
}

/** Move a bone by a world-space offset. */
export function shift(bone: THREE.Object3D, offset: THREE.Vector3) {
  const target = pos(bone).add(offset);
  bone.parent?.worldToLocal(target);
  bone.position.copy(target);
  bone.updateMatrixWorld(true);
}

/** Remembers the rest pose and puts it back. */
export class RestPose {
  private rest = new Map<THREE.Object3D, Rest>();
  constructor(root: THREE.Object3D) {
    root.traverse((o) => { if ((o as THREE.Bone).isBone || /scaleCompensation/.test(o.name)) this.rest.set(o, { p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone() }); });
  }
  reset(root: THREE.Object3D) {
    for (const [o, r] of this.rest) { o.position.copy(r.p); o.quaternion.copy(r.q); o.scale.copy(r.s); }
    root.updateMatrixWorld(true);
  }
}

/**
 * Pistons hang off the hip / upper spine but visually join the limbs. Record where each sits relative to its limb in
 * the rest pose, then each frame blend it between "stays on the torso" and "rides with the limb".
 */
export class Followers {
  private items: { o: THREE.Object3D; limb: THREE.Object3D; rel: THREE.Matrix4; w: number }[] = [];
  add(o: THREE.Object3D, limb: THREE.Object3D, w: number) {
    o.updateWorldMatrix(true, false);
    limb.updateWorldMatrix(true, false);
    this.items.push({ o, limb, rel: limb.matrixWorld.clone().invert().multiply(o.matrixWorld), w });
  }
  apply() {
    const p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), s = new THREE.Vector3();
    const r0 = new THREE.Quaternion(), r1 = new THREE.Quaternion();
    const m = new THREE.Matrix4(), inv = new THREE.Matrix4();
    for (const { o, limb, rel, w } of this.items) {
      o.matrixWorld.decompose(p0, r0, s); // current: see the note on `pos`
      m.multiplyMatrices(limb.matrixWorld, rel).decompose(p1, r1, s);
      p0.lerp(p1, w);
      r0.slerp(r1, w);
      if (!o.parent) continue;
      inv.copy(o.parent.matrixWorld).invert();
      m.compose(p0, r0, s).premultiply(inv).decompose(o.position, o.quaternion, s);
      o.updateMatrixWorld(true);
    }
  }
}
